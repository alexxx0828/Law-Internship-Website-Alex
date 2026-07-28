# Legal Internship Journal - Alex Siong Sie Yang

## Original Problem Statement
Personal legal internship journal landing page for a second-year law student in Malaysia. Tracks two practicum periods with daily diary entries, Google Maps location, and premium Awwwards-level animations.

## User Choices
- Name: Alex Siong Sie Yang
- Practicum I: Court of Appeal, Putrajaya (Istana Kehakiman, Presint 3, 62506 Putrajaya) — 03/08/2026 to 28/08/2026
- Practicum II: To Be Determined (Upcoming)
- Option B: Premium React app with framer-motion + lenis smooth scroll
- Map: Static OpenStreetMap embed (no API key needed)

## Architecture
- React app at route /legal-journal
- Libraries: framer-motion, @studio-freight/lenis, react-intersection-observer
- Components in /app/frontend/src/components/legal-journal/
- Editorial warm-paper theme (Fraunces + Newsreader fonts)

## What's Implemented (2026-07-28)
- Hero with masked line-by-line reveal animation
- Overview with scroll-reveal
- LocationMap: 2 location cards + OpenStreetMap static embed with marker
- DiarySection: Practicum I/II tabs + Week 1-4 filters + 14 diary cards
- ScrollTransition: rotating legal seal SVG with scroll-driven scale/rotate
- Metrics: animated count-up (Days Logged, Memos Drafted, Court Attendances, Practicum Terms)
- Contact section with email/LinkedIn
- Lenis smooth momentum scrolling
- Fully responsive (380px/768px/1440px)

## Backlog / Next Tasks
- P1: Add Practicum II details once confirmed
- P1: Sticky navigation bar with section links
- P2: Add more diary entries for weeks 3-4
- P2: Editorial marquee section

## Update (2026-07-28) — Editable Diary System
- Removed all sample diary entries — diary now starts EMPTY
- Added password-protected editing (JWT + bcrypt). Admin: alex@journal.com / alex2026
- Public can VIEW entries; only logged-in owner can add/edit/delete
- Multiple photo uploads per entry (client-side compressed to base64, stored in MongoDB) with per-photo captions
- Entry fields: practicum, week, date, title, description, tags, photos
- Metrics now AUTO-CALCULATED from real entries via /api/stats (days logged, memos drafted, court attendances, practicum terms)
- Practicum dates kept: Practicum I (03/08/2026–28/08/2026), Practicum II upcoming
- Backend: /api/auth/* + /api/entries CRUD + /api/stats in server.py
- Frontend: AuthContext, AdminBar, LoginModal, EntryEditor components; DiarySection + Metrics now dynamic
- Tested: 13/13 backend + full frontend CRUD flow passed (iteration_1.json)

## Update (2026-07-28) — Inline Editable Content + Photo Gallery/Lightbox
- Diary cards: main photo + thumbnail strip; click any photo opens full-screen Lightbox (prev/next, keyboard, captions, body-scroll lock)
- EVERY section text is now inline-editable by the logged-in owner (map itself NOT editable, but its caption is)
- Backend: db.content collection; GET /api/content (public), PUT /api/content {key,value} (protected)
- Frontend: ContentContext (CONTENT_DEFAULTS + server overrides), Editable component (ref-based uncontrolled contentEditable, saves on blur, hardened against caret-jump/wipe)
- Editable keys cover Hero, Overview, Location cards + map caption, Diary heading, Scroll text, Metrics heading+labels, Contact heading+footer
- Tested: 16/16 backend + 100% frontend (edits persist across reload). iteration_4.json
