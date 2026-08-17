# Real-Time Synchronization Flow

## Transport

`server.ts` creates a single `http.Server`, hands it to Next's request handler, and attaches a Socket.IO server to the same instance — one process, one port, one deployment (see the root `README.md` for why this was chosen over a hosted pub/sub service or a two-service split). Next's own dev-mode HMR websocket and Socket.IO's `/socket.io` websocket coexist on that one server without conflict, since each only claims upgrade requests under its own path.

## Session identity

A patient's session id is generated client-side (`crypto.randomUUID()`) and pushed into the URL (`/patient?session=<id>`) on first load. A refresh reads the id back out of the URL instead of generating a new one, so the patient rejoins the same Socket.IO room and the staff dashboard doesn't see a duplicate session appear.

## Event contract (`src/types/session.ts`)

| Event | Direction | Purpose |
|---|---|---|
| `join-session` | patient → server | Joins the room named by the session id. |
| `join-staff` | staff → server | Joins the `staff` room and triggers a `session-snapshot` reply. |
| `field-update` | patient → server | One top-level field (`{ sessionId, field, value }`) changed. Debounced 300ms client-side per field. |
| `submit` | patient → server (with ack) | Final, validated submission. Server re-validates with the same zod schema before accepting. |
| `session-snapshot` | server → staff | Sent once, right after `join-staff` — the full current session list, so a staff client that connects mid-session sees existing data immediately instead of a blank dashboard until the next keystroke. |
| `session-update` | server → staff | Broadcast to the `staff` room on every field change, submission, or status transition. |

## Server-side state (`src/lib/socket/session-store.ts`)

An in-memory `Map<sessionId, SessionState>` — no database (see root `README.md`). Each `SessionState` carries `data` (a `Partial<PatientFormData>`, since a session may be mid-fill), `status`, and `lastActivityAt`.

## Presence: active / inactive / submitted

- Every `field-update` bumps `lastActivityAt` and sets `status` to `"active"` (unless already `"submitted"`, which is terminal).
- A single `setInterval` sweep (every 5s, `SWEEP_INTERVAL_MS`) checks all sessions; any `"active"` session whose `lastActivityAt` is more than 15s old (`INACTIVITY_THRESHOLD_MS`) flips to `"inactive"` and broadcasts the change.
- This is deliberately the *only* mechanism — there's no separate handling of the Socket.IO `disconnect` event, because a flaky connection auto-reconnects and an instant flip-to-inactive-then-back would just flicker the staff UI. A closed tab and a patient who stopped typing look identical from the server's perspective (no new `field-update` arrives), and both are handled by the same sweep.
- The status transition itself is a pure function, `computeNextStatus(status, lastActivityAt, now)`, unit-tested independently of the interval/module state (`session-store.test.ts`).

## Submission reliability

`submit` is the one event that uses a Socket.IO acknowledgement instead of fire-and-forget (every other field sync is fire-and-forget, which is fine since it's just live-mirroring, not a final state). The client (`usePatientSession.submit`) sets a 5s timeout; if no ack arrives, the promise resolves `{ ok: false }` and the form surfaces a retryable error instead of silently assuming success.
