"""Backend tests for Legal Journal API."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "").rstrip("/")
if not BASE_URL:
    # Fallback: read from frontend .env
    with open("/app/frontend/.env") as f:
        for line in f:
            if line.startswith("REACT_APP_BACKEND_URL="):
                BASE_URL = line.split("=", 1)[1].strip().rstrip("/")

API = f"{BASE_URL}/api"
ADMIN_EMAIL = "alex@journal.com"
ADMIN_PASSWORD = "alex2026"


@pytest.fixture(scope="session")
def token():
    r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200, r.text
    return r.json()["token"]


@pytest.fixture(scope="session")
def auth_headers(token):
    return {"Authorization": f"Bearer {token}"}


# ==================== AUTH ====================
class TestAuth:
    def test_login_success(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
        assert r.status_code == 200
        data = r.json()
        assert "token" in data and isinstance(data["token"], str) and len(data["token"]) > 10
        assert data["user"]["email"] == ADMIN_EMAIL
        assert "id" in data["user"]

    def test_login_wrong_password(self):
        r = requests.post(f"{API}/auth/login", json={"email": ADMIN_EMAIL, "password": "wrong"})
        assert r.status_code == 401

    def test_me_with_token(self, auth_headers):
        r = requests.get(f"{API}/auth/me", headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["email"] == ADMIN_EMAIL

    def test_me_without_token(self):
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# ==================== ENTRIES CRUD ====================
class TestEntries:
    created_ids = []

    def test_get_entries_public(self):
        r = requests.get(f"{API}/entries")
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_create_entry_requires_auth(self):
        r = requests.post(f"{API}/entries", json={
            "date": "2026-01-05", "title": "TEST_NoAuth", "description": "x"
        })
        assert r.status_code == 401

    def test_create_entry_with_auth(self, auth_headers):
        payload = {
            "practicum": "practicum1",
            "week": 1,
            "date": "2026-01-10",
            "title": "TEST_Entry1",
            "description": "First test entry",
            "tags": ["Drafting", "Court Attendance"],
            "photos": [{"data": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUg==", "caption": "Test cap"}]
        }
        r = requests.post(f"{API}/entries", json=payload, headers=auth_headers)
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["title"] == "TEST_Entry1"
        assert data["id"]
        assert len(data["photos"]) == 1
        assert data["photos"][0]["caption"] == "Test cap"
        assert "iVBORw0KGgo" in data["photos"][0]["data"]
        TestEntries.created_ids.append(data["id"])

        # Verify persistence via GET
        r2 = requests.get(f"{API}/entries")
        assert any(e["id"] == data["id"] for e in r2.json())

    def test_filter_by_practicum_and_week(self, auth_headers):
        # create a practicum2 entry
        r = requests.post(f"{API}/entries", json={
            "practicum": "practicum2", "week": 3, "date": "2026-02-01",
            "title": "TEST_P2", "description": "p2", "tags": ["Memo"]
        }, headers=auth_headers)
        assert r.status_code == 200
        TestEntries.created_ids.append(r.json()["id"])

        r = requests.get(f"{API}/entries", params={"practicum": "practicum1", "week": "1"})
        assert r.status_code == 200
        for e in r.json():
            assert e["practicum"] == "practicum1"
            assert e["week"] == 1

        r = requests.get(f"{API}/entries", params={"practicum": "practicum2"})
        assert any(e["title"] == "TEST_P2" for e in r.json())

    def test_update_entry(self, auth_headers):
        assert TestEntries.created_ids
        eid = TestEntries.created_ids[0]
        r = requests.put(f"{API}/entries/{eid}", json={
            "practicum": "practicum1", "week": 1, "date": "2026-01-10",
            "title": "TEST_Entry1_Updated", "description": "updated",
            "tags": ["Drafting"], "photos": []
        }, headers=auth_headers)
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Entry1_Updated"

        r2 = requests.get(f"{API}/entries")
        found = [e for e in r2.json() if e["id"] == eid][0]
        assert found["title"] == "TEST_Entry1_Updated"

    def test_update_without_auth(self):
        eid = TestEntries.created_ids[0]
        r = requests.put(f"{API}/entries/{eid}", json={
            "date": "2026-01-10", "title": "x", "description": "x"
        })
        assert r.status_code == 401

    def test_delete_without_auth(self):
        eid = TestEntries.created_ids[0]
        r = requests.delete(f"{API}/entries/{eid}")
        assert r.status_code == 401


# ==================== STATS ====================
class TestStats:
    def test_stats_reflects_entries(self, auth_headers):
        # Snapshot current counts
        before = requests.get(f"{API}/stats").json()
        assert before["practicum_terms"] == 2

        r = requests.post(f"{API}/entries", json={
            "practicum": "practicum1", "week": 2, "date": "2026-01-15",
            "title": "TEST_StatsMemo", "description": "d",
            "tags": ["Memo", "Court Attendance"]
        }, headers=auth_headers)
        assert r.status_code == 200
        new_id = r.json()["id"]
        TestEntries.created_ids.append(new_id)

        after = requests.get(f"{API}/stats").json()
        assert after["days_logged"] == before["days_logged"] + 1
        assert after["memos_drafted"] == before["memos_drafted"] + 1
        assert after["court_attendances"] == before["court_attendances"] + 1


# ==================== CLEANUP ====================
class TestZCleanup:
    def test_delete_all_test_entries(self, auth_headers):
        # Delete every test entry we created
        for eid in TestEntries.created_ids:
            r = requests.delete(f"{API}/entries/{eid}", headers=auth_headers)
            assert r.status_code in (200, 404)
        # Also delete any leftover TEST_ entries
        r = requests.get(f"{API}/entries")
        for e in r.json():
            if e.get("title", "").startswith("TEST_"):
                requests.delete(f"{API}/entries/{e['id']}", headers=auth_headers)
        # Verify none remain
        r = requests.get(f"{API}/entries")
        assert not any(e.get("title", "").startswith("TEST_") for e in r.json())
