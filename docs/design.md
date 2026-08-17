# Design

## Patient form

Single-column form on mobile, widening to 2–3 column field groups (`sm:grid-cols-2` / `sm:grid-cols-3`) above the `sm` breakpoint, capped at `max-w-2xl` so line length stays readable on desktop. Native `<input type="date">` and `<select>` are used wherever possible instead of custom widgets, since they give a correct mobile picker UI for free.

The Thai address sub-district field is the one custom widget (a text input + dropdown suggestion list) — District/Province/Postal Code become read-only once a sub-district is selected, so the address can't end up internally inconsistent (see `docs/realtime-sync-flow.md` for why sub-district drives the cascade).

A reconnect banner appears above the form (not a blocking modal) when the socket disconnects, so the patient can keep filling in fields — which still work locally — while it retries in the background.

## Staff dashboard

Master-detail layout: a session list (search + status filter) and a detail panel showing every field of the selected session, live.

- **Desktop (`sm` and above)**: list and detail render side by side in a CSS grid split, so staff can watch the list update while a detail panel stays open.
- **Mobile**: only one pane is visible at a time — the list until a session is tapped, then the detail panel takes over full-width with a "← Back" affordance. This is local component state (`selectedSessionId`), not routing, so no navigation round-trip is needed to flip between them.

Status is shown as a colored pill (green/active, gray/inactive, blue/submitted) rather than plain text, since staff need to scan a list of several sessions at a glance.

## Why not more custom components

Both interfaces reuse two thin primitives (`TextField`, `SelectField`) rather than a larger design-system layer — the field count (11) and the two-screen scope don't justify more abstraction than that.
