# Implementation Summary — ok6wedding

Purpose
-------
This document summarizes the frontend implementation and project structure so backend engineers can quickly understand what was changed, where key frontend flows live, and what backend support (endpoints, environment variables, DB) is required.

High-level overview
-------------------
- Frontend: Next.js (app router) + React 19 + TypeScript. Primary frontend files live under `src/app/`.
- Backend: serverless Node/Express-like routes implemented as Next.js Server Routes under `src/app/api/*`. The backend logic must remain intact — frontend work only.
- Database: Prisma is used (see `prisma/schema.prisma`). There's also a Drizzle schema at `src/db/schema.ts` for reservations.

Important notes
---------------
- Node requirement: Next 16 requires Node >= 20.9.0. The repo contains `.nvmrc` with `20` and README notes. Use a node version manager (`nvm`, `volta`) to run locally.
- Build: `npm run build` runs `prisma generate && prisma db push && next build`. `prisma db push` requires a valid `DATABASE_URL` env var — the build will fail without it.
- Third-party packages: `framer-motion` was added to `package.json` for animations. Install dependencies before running.

Key files and where things live
--------------------------------
- Root
  - `package.json` — scripts and dependencies (includes `framer-motion` entry)
  - `.nvmrc` — Node 20 pin
  - `IMPLEMENTATION_SUMMARY.md` — this file

- Frontend
  - `src/app/page.tsx` — Homepage (splash, hero slideshow, meet-the-couple, schedule, RSVP preview, dress code, food preview, gift, sponsor, footer, floating quick-action hub). Recent additions:
    - `LiveDashboard` component (live mode metrics/progress and layout)
    - Live iframe render when `eventPhase === 'live'` using `NEXT_PUBLIC_LIVESTREAM_URL`
    - `ChatAssistant` modal (frontend stub) wired to the floating hub
    - `framer-motion` `motion` components used for animated progress and items
  - `src/app/reserve/page.tsx` — RSVP / reservation form (POSTs to `/api/reserve`)
  - `src/app/admin/reservations/page.tsx` — Admin guest list (GETs `/api/reservations`) and now includes an "Export CSV" button (frontend CSV generation)
  - `src/app/admin/gate/page.tsx` — Security gate UI for pass verification (frontend stub)
  - `src/app/globals.css` — Global CSS and the new Live Dashboard styles (progress bar, animations, responsive tweaks)

- Types / Shims
  - `src/types/framer-motion.d.ts` — local shim to allow TypeScript checks until `framer-motion` is installed; remove when the real package and types are installed.

- Backend / API routes (where to look)
  - `src/app/api/` contains server routes for backend functionality. Notable endpoints (preserve and integrate with):
    - `src/app/api/reserve/route.ts` — handles reservation POST (used by `/reserve` frontend)
    - `src/app/api/reservations/route.ts` — returns guest list for admin
    - `src/app/api/orders/*`, `src/app/api/kitchen/*`, `src/app/api/menu/*` — existing food ordering and kitchen flows
    - `src/app/api/setup/route.ts` — DB setup helpers used during development
    - Other api routes: activities, admin/generate-codes, concierge, guests, vip/generate

Database / Prisma
------------------
- `prisma/schema.prisma` — Prisma schema used by `prisma generate` and `prisma db push`.
- `src/db/schema.ts` — Drizzle table definitions (e.g., `reservations` table) used by server logic.
- Important: `DATABASE_URL` must be set in your environment for `prisma db push` and to run any DB-driven server routes locally.

Runtime & development commands
------------------------------
Recommended local steps for backend engineers who want to run and test the app:

1. Use Node 20 via `nvm` / `volta`:

```bash
nvm install 20
nvm use 20
```

2. Install dependencies:

```bash
npm install
```

3. Provide environment variables (at least `DATABASE_URL`) — create a `.env` or export directly.

4. Run development server:

```bash
npm run dev
```

5. To test production build (requires DB):

```bash
npm run build
npm start
```

Notes about CI / build
----------------------
- CI must set `DATABASE_URL` (or use a test DB) before `npm run build` because `prisma db push` runs during the build.
- The frontend TypeScript checks pass (we ran `npx tsc --noEmit`). If a CI job runs type-checking before install, the local shim for `framer-motion` allows checks to succeed; the shim should be removed after the package is installed.

Frontend expectations for backend
---------------------------------
- `/api/reserve` should accept POSTed reservation objects with fields used by `src/app/reserve/page.tsx` (name, phone, email, vipCode) and return a JSON reply with `success`, `ticketId`, and `name` when OK.
- `/api/reservations` should return an array of reservation objects consumable by the admin reservations UI. The admin export button expects the API to return consistent keys across records.
- Food-ordering endpoints (`/api/orders`, `/api/kitchen`) should preserve existing behavior. The frontend expects order status strings like `Ready`, `On the Way` and uses them in the admin UI.
- Livestream: frontend uses `NEXT_PUBLIC_LIVESTREAM_URL` env var for the iframe URL. Provide this in the hosting environment for live mode.

Areas changed that need backend awareness
----------------------------------------
- `prisma generate` & `prisma db push` are invoked during `npm run build` — ensure migrations / DB are available in CI.
- `src/types/framer-motion.d.ts` is a temporary shim; after running `npm install`, remove it and (optionally) add `@types/framer-motion` if needed.
- The homepage now shows live-mode content (iframe) when system time crosses the configured event dates; no backend changes required to toggle, but you may supply a live stream URL via env var.

Suggested next backend tasks
---------------------------
1. Ensure `DATABASE_URL` and a test DB are available in CI to allow `prisma db push` during build. Prefer running `prisma migrate deploy` in production pipelines and `prisma db push` for dev/test as appropriate.
2. Add a server-side CSV export endpoint (e.g., `GET /api/export/reservations`) that returns a CSV with proper headers and optional auth for admin users. The frontend currently exports client-side but server-side export is easier to secure.
3. If you provide a chat/AI assistant backend, add a secure route (e.g., `POST /api/assistant/query`) and update frontend `ChatAssistant` to call it (it is currently a stub).

Contacts / context
------------------
- Frontend changes were implemented to produce a luxury experience: splash, cinematic slideshow, floating hub, live mode dashboard, RSVP flow UI, food preview, gifting UI, and admin check-in/export. All changes are frontend-only and preserve existing routes.
- If you need a quick walkthrough of the modified files, start with `src/app/page.tsx`, `src/app/reserve/page.tsx`, `src/app/admin/reservations/page.tsx`, and `prisma/schema.prisma`.

If anything here needs clarification or you'd like me to implement the server-side CSV endpoint or wire the ChatAssistant to a backend, say which option and I will implement it next.
