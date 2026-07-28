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
