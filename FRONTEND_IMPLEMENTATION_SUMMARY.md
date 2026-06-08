# Frontend Implementation Summary — ok6wedding

## Purpose
This document summarizes the frontend implementation for the luxury wedding website experience. It describes the homepage, live event UI, styling, animations, data flows, and frontend-only integration points.

## Technology stack
- Next.js app router (`src/app/`)
- React 19 + TypeScript
- Global styling via `src/app/globals.css`
- `framer-motion` used for animated motion components
- Local `src/types/framer-motion.d.ts` shim used until the runtime package is installed

## Key frontend files
- `src/app/page.tsx`
  - Primary homepage implementation
  - Includes splash entry screen, cinematic hero slideshow, schedule cards, RSVP preview, dress code guidance, food/gift teaser sections, sponsor spotlight, footer, and floating action hub
  - Adds `LiveDashboard` for live event mode and countdown-based mode switching
  - Adds `ChatAssistant` modal stub wired from the floating hub
  - Uses `framer-motion` for progress bar and live item animations

- `src/app/reserve/page.tsx`
  - RSVP/reservation form UI
  - Posts to `/api/reserve`
  - Displays successful ticket details on submit

- `src/app/admin/reservations/page.tsx`
  - Admin guest list display
  - Includes client-side CSV export button

- `src/app/admin/gate/page.tsx`
  - Security gate frontend UI
  - Intended for passcode verification or VIP gate flows

- `src/app/globals.css`
  - Global theme and luxury glassmorphism styling
  - Hero, schedule, RSVP, sections, footer, floating hub, and live dashboard styling
  - Responsive layout rules for mobile and tablet

## Homepage flow details
- Hero section cycles slides automatically every 5 seconds
- Splash transition delays entry for 3.2 seconds before revealing homepage content
- Live event mode toggles by current time:
  - `pre` before 2026-06-25 18:00
  - `live` between 2026-06-25 18:00 and 2026-06-28 02:00
  - `post` after 2026-06-28 02:00
- `LiveDashboard` shows current event, next schedule item, and progress percent
- `ChatAssistant` provides an in-page assistant interface as a frontend stub
- Floating action hub offers quick access to live stream, assistant, directions, and support links

## Animation and UX
- `framer-motion` used in `src/app/page.tsx` for:
  - progress bar animation (`scaleX` transform)
  - live schedule item entrance animations
  - active item hover and pulse effects
- CSS includes:
  - `will-change: transform` on `.progress-fill`
  - `.live-item.current` elevation and border accent
  - responsive adjustments for smaller screens
- The homepage uses large typography, glass surfaces, gold accents, and particle motion for premium visual impact

## Integration points
### Backend API expectations
- `/api/reserve`
  - Accepts reservation POST data and returns `{ success, ticketId, name }`
  - Consumed by `src/app/reserve/page.tsx`

- `/api/reservations`
  - Returns a guest/reservation array for admin listing
  - Used by `src/app/admin/reservations/page.tsx`

### Environment variables
- `NEXT_PUBLIC_LIVESTREAM_URL`
  - Used by the live iframe when the homepage is in live mode
- `DATABASE_URL`
  - Required for `npm run build` because the build triggers Prisma

## Build and runtime notes
- Project requires Node >= 20.9.0 (see `.nvmrc` and `README.md`)
- `npm install` must be run before using `framer-motion` in the browser
- `npm run build` runs Prisma generation and push, so `DATABASE_URL` must be configured

## What changed in frontend-only terms
- Created a new luxurious homepage experience without removing existing backend routes
- Added a live event dashboard with animated progress and schedule tracking
- Implemented a floating quick-action hub and assistant UI shell
- Added responsive premium visual styling and motion transitions
- Added client-side CSV export support in admin reservations

## Recommended next frontend tasks
- Install `framer-motion` and remove `src/types/framer-motion.d.ts` after package install
- Optionally replace the assistant stub with a real backend-driven chat API
- Add a server-side CSV export endpoint for secure admin downloads
- Validate on mobile using Chrome device emulation and test performance in DevTools
