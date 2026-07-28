from dotenv import load_dotenv
from pathlib import Path
import os

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

from fastapi import FastAPI, APIRouter, HTTPException, Request, Depends
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import logging
from pydantic import BaseModel, Field
from typing import List, Optional
import uuid
import jwt
import bcrypt
from datetime import datetime, timezone, timedelta

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT config
JWT_ALGORITHM = "HS256"
# Fallback default ensures the backend still starts (and issues valid tokens) even
# if JWT_SECRET is not provided in the deployment environment (e.g. a GitHub clone
# where .env was not committed). Set JWT_SECRET in the environment for real security.
JWT_SECRET = os.environ.get('JWT_SECRET', 'legal-journal-default-secret-change-me-2026')
ACCESS_TOKEN_EXPIRE_DAYS = 7

app = FastAPI()
api_router = APIRouter(prefix="/api")


# ==================== PASSWORD HELPERS ====================
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    return bcrypt.hashpw(password.encode("utf-8"), salt).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))


# ==================== JWT HELPERS ====================
def create_access_token(user_id: str, email: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "exp": datetime.now(timezone.utc) + timedelta(days=ACCESS_TOKEN_EXPIRE_DAYS),
        "type": "access",
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Invalid token type")
        user = await db.users.find_one({"id": payload["sub"]})
        if not user:
            raise HTTPException(status_code=401, detail="User not found")
        user.pop("password_hash", None)
        user.pop("_id", None)
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")


# ==================== MODELS ====================
class LoginRequest(BaseModel):
    email: str
    password: str


class Photo(BaseModel):
    data: str  # base64 data URL
    caption: str = ""


class DiaryEntryCreate(BaseModel):
    practicum: str = "practicum1"  # practicum1 | practicum2
    week: int = 1
    date: str  # display date string e.g. "2026-08-03"
    title: str
    description: str
    tags: List[str] = []
    photos: List[Photo] = []


class DiaryEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    practicum: str = "practicum1"
    week: int = 1
    date: str
    title: str
    description: str
    tags: List[str] = []
    photos: List[Photo] = []
    created_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())


# ==================== AUTH ENDPOINTS ====================
@api_router.post("/auth/login")
async def login(payload: LoginRequest):
    email = payload.email.strip().lower()
    user = await db.users.find_one({"email": email})
    if not user or not verify_password(payload.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"])
    return {
        "token": token,
        "user": {"id": user["id"], "email": user["email"], "name": user.get("name", "")},
    }


@api_router.get("/auth/me")
async def get_me(current_user: dict = Depends(get_current_user)):
    return {"id": current_user["id"], "email": current_user["email"], "name": current_user.get("name", "")}


@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"message": "Logged out"}


# ==================== DIARY ENDPOINTS ====================
@api_router.get("/entries", response_model=List[DiaryEntry])
async def get_entries(practicum: Optional[str] = None, week: Optional[str] = None):
    query = {}
    if practicum:
        query["practicum"] = practicum
    if week and week != "all":
        try:
            query["week"] = int(week)
        except ValueError:
            pass
    entries = await db.entries.find(query, {"_id": 0}).to_list(1000)
    # Sort by date ascending
    entries.sort(key=lambda e: e.get("date", ""))
    return entries


@api_router.post("/entries", response_model=DiaryEntry)
async def create_entry(payload: DiaryEntryCreate, current_user: dict = Depends(get_current_user)):
    entry = DiaryEntry(**payload.model_dump())
    doc = entry.model_dump()
    await db.entries.insert_one(doc)
    doc.pop("_id", None)
    return entry


@api_router.put("/entries/{entry_id}", response_model=DiaryEntry)
async def update_entry(entry_id: str, payload: DiaryEntryCreate, current_user: dict = Depends(get_current_user)):
    existing = await db.entries.find_one({"id": entry_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Entry not found")
    updated_data = payload.model_dump()
    updated_data["updated_at"] = datetime.now(timezone.utc).isoformat()
    await db.entries.update_one({"id": entry_id}, {"$set": updated_data})
    merged = {**existing, **updated_data}
    merged.pop("_id", None)
    return DiaryEntry(**merged)


@api_router.delete("/entries/{entry_id}")
async def delete_entry(entry_id: str, current_user: dict = Depends(get_current_user)):
    result = await db.entries.delete_one({"id": entry_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Entry not found")
    return {"message": "Entry deleted"}


# ==================== STATS ENDPOINT ====================
@api_router.get("/stats")
async def get_stats():
    entries = await db.entries.find({}, {"_id": 0}).to_list(1000)
    days_logged = len(entries)
    memos_drafted = sum(
        1 for e in entries if any(t.lower() in ("drafting", "memo") for t in e.get("tags", []))
    )
    court_attendances = sum(
        1 for e in entries if any(t.lower() == "court attendance" for t in e.get("tags", []))
    )
    return {
        "days_logged": days_logged,
        "memos_drafted": memos_drafted,
        "court_attendances": court_attendances,
        "practicum_terms": 2,
    }


@api_router.get("/")
async def root():
    return {"message": "Legal Journal API"}


# ==================== EDITABLE CONTENT ====================
class ContentUpdate(BaseModel):
    key: str
    value: str


@api_router.get("/content")
async def get_content():
    doc = await db.content.find_one({"id": "site"}, {"_id": 0})
    return doc.get("values", {}) if doc else {}


@api_router.put("/content")
async def update_content(payload: ContentUpdate, current_user: dict = Depends(get_current_user)):
    await db.content.update_one(
        {"id": "site"},
        {"$set": {f"values.{payload.key}": payload.value, "id": "site"}},
        upsert=True,
    )
    return {"key": payload.key, "value": payload.value}


# Include the router
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# ==================== ADMIN SEEDING ====================
async def seed_admin():
    # Defaults match the owner's real credentials so login works even when the
    # deployment environment does not carry ADMIN_EMAIL / ADMIN_PASSWORD (e.g. a
    # GitHub clone where .env is not committed). Override via env for security.
    admin_email = os.environ.get("ADMIN_EMAIL", "alex@journal.com").strip().lower()
    admin_password = os.environ.get("ADMIN_PASSWORD", "alex2026")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "id": str(uuid.uuid4()),
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Alex Siong Sie Yang",
            "role": "admin",
            "created_at": datetime.now(timezone.utc).isoformat(),
        })
        logger.info(f"Admin seeded: {admin_email}")
    elif not verify_password(admin_password, existing["password_hash"]):
        await db.users.update_one(
            {"email": admin_email},
            {"$set": {"password_hash": hash_password(admin_password)}},
        )
        logger.info(f"Admin password updated: {admin_email}")


@app.on_event("startup")
async def startup_event():
    await db.users.create_index("email", unique=True)
    await db.entries.create_index("practicum")
    await seed_admin()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
