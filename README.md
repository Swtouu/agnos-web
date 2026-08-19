# Agnos Patient Intake

A real-time patient intake form and staff monitoring dashboard. Built for the Agnos front-end developer candidate assignment.

## Tech stack

Next.js (App Router), TypeScript, TailwindCSS, Socket.IO (self-managed WebSocket server via a custom Next.js server), react-hook-form + zod, `next-themes` (light/dark mode) + `lucide-react` (icons), Vitest. Brand colors/typography (Athiti) sourced from agnoshealth.com's actual site.

## Quick start

```bash
npm install
npm run dev
```

Open `http://localhost:3000` and click through to either `/patient` or `/staff` — or open both in separate tabs to see the live sync.

```bash
npm run build   # production build
npm run start   # run the production custom server
npm test        # unit tests (Vitest)
npm run lint
```

## Deployment

Deployed on Render (Web Service, native Node buildpack — see `render.yaml`), not Vercel/Netlify: the app runs a self-managed Socket.IO server on a custom Next.js server (`server.ts`), which needs a long-lived Node process holding WebSocket connections open — something Vercel/Netlify's serverless functions can't do. Render's free tier spins the service down after ~15 minutes of inactivity, so the first request after a period of idleness has a cold-start delay of roughly 30–50 seconds.

Live URL: https://agnos-frontend.onrender.com

## How it works

- **Patient** (`/patient`): fills in an 11-field intake form. Every field syncs to the server (debounced 300ms) as it's typed, and the final submission is confirmed with a Socket.IO acknowledgement (with a retry-on-timeout error state) rather than fire-and-forget.
- **Staff** (`/staff`): a dashboard of every active patient session, searchable and filterable by status, with a live detail view of whichever session is selected — including a presence indicator (actively filling in / inactive / submitted).

Multiple patients can fill in the form concurrently; each gets its own session (id generated client-side, carried in the URL so a refresh doesn't lose it) and appears as a separate row on the staff dashboard.

## Development planning documentation

- [`docs/project-structure.md`](docs/project-structure.md) — folder layout and the reasoning behind it
- [`docs/design.md`](docs/design.md) — responsive/UI decisions for both interfaces
- [`docs/component-architecture.md`](docs/component-architecture.md) — main components and their responsibilities
- [`docs/realtime-sync-flow.md`](docs/realtime-sync-flow.md) — the socket event contract, session state, and the presence state machine

## Bonus features

Beyond the stated requirements (documented separately so core requirement satisfaction stays unambiguous, matching the pattern used in the companion back-end assignment):

- **Reconnect indicator** — a banner shown on the patient form while the socket is disconnected, so a patient on a flaky connection knows their changes aren't syncing rather than assuming they are.
- **Staff dashboard search/filter** — search by name and filter by status, which becomes necessary the moment there's more than a handful of concurrent sessions.
- **Light/dark theme** — toggle in the header (`next-themes`), defaults to the OS preference, no flash of the wrong theme on load. See `docs/design.md` for how the color tokens are structured.
- **EN/TH interface language** — segmented toggle in the header, persisted to `localStorage`. Covers all UI copy, field labels, and validation messages; dropdown *values* (Gender, Religion, etc.) stay English since they're what's validated/stored, only the displayed label translates. See `docs/design.md` and `docs/component-architecture.md` for the full scope and how it's wired.

## Known limitations

- **No database — in-memory only.** Session state lives in a `Map` on the server process; nothing survives a restart. Neither the requirements nor the evaluation criteria call for persistence, and a real deployment would add one before going further than a demo.
- **No staff authentication.** `/staff` is an open route. The assignment brief (unlike the companion back-end assignment, which specifies `POST /staff/login`) never asks for staff auth, and adding it would need a credential store — which conflicts with the in-memory-only scope above. A real deployment would gate `/staff` behind login.
- **Thai address autocomplete has no fuzzy matching.** The sub-district search is a plain substring match against a bundled ~7,400-row dataset (`@riz007/thai-address-data`) — no typo tolerance or Thai-transliteration support.
- **Testing scope**: unit tests cover the pure logic (zod validation schema, the inactivity-status reducer) but not the Socket.IO layer end-to-end — that was verified manually (multiple browser tabs, plus ad hoc `socket.io-client` scripts during development) rather than with an automated integration test harness, the same scoping call the back-end assignment made for its repository layer.
- **Single Render instance.** The in-memory session store assumes one process — correct at this scale, but would need a shared store (e.g. Redis) behind a Socket.IO adapter if it ever ran on more than one instance.
- **i18n scope boundaries.** No locale-based routing (`/en/...`, `/th/...`) — deliberate, since this app doesn't need per-locale SEO and it would complicate the URL-based session-id logic for no real benefit. The Nationality dropdown (250 countries) and the static page `<title>` are not translated — translating 250 country names, or making `<title>` locale-aware without routing, is disproportionate to this app's size.
