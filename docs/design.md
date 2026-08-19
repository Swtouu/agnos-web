# Design

## Brand

Colors and typography are sourced from the actual, live agnoshealth.com CSS (`agnoshealth.com/join-our-team`), not a generic palette: primary blue and a warm off-white page background, matching their real `theme-color` meta tag. Typeface is Athiti (`next/font/google`, `latin` + `thai` subsets, weights 400–700) — also Agnos's own font choice, and functionally necessary since it renders Thai glyphs correctly, unlike the previous Geist Sans stack.

`--surface-muted` (hover states, read-only fields, the "inactive" status pill, unselected filters) stays a neutral gray, not Agnos's soft pale-blue — that token is shared across 7 different "neutral/disabled" contexts, and tinting all of them with the brand's primary-blue family would blur the one signal a status pill most needs: reading clearly as *not* active/interactive.

## Theme

Light/dark mode, toggled from the header (sun/moon button, `next-themes`). Colors are defined once as CSS custom properties (`--background`, `--surface`, `--primary`, `--success-fg`, etc.) in `globals.css` under `:root` and `.dark`, and every component consumes them through Tailwind's `@theme inline` mapping (`bg-surface`, `text-foreground`, ...) rather than hardcoded slate/blue utility classes or `dark:` variant pairs. Switching theme is just toggling the `.dark` class on `<html>` — no component needs its own light/dark branching. `next-themes` injects a blocking script before hydration so the correct theme applies on first paint (no flash of the wrong theme), and defaults to the OS preference (`system`) until the user picks one explicitly.

## Language (EN/TH)

A segmented EN/TH control in the header, next to the theme toggle — deliberately two visible buttons rather than a single cycling toggle, since language choice benefits from both options being visible (unlike light/dark, where "the other one" is unambiguous). Architecturally mirrors the theme toggle: client-side only, persisted to `localStorage`, no locale-based routing (`/en/...`, `/th/...`) — adding that would mean threading a locale segment through every link and through `useSessionId`'s URL-based session persistence for no real benefit at this app's size. See `docs/component-architecture.md` for how translations are looked up.

Dropdown *values* (Gender, Religion, Preferred Language, Relationship) stay English internally — they're what's validated and stored — only the displayed label translates. The Nationality list (250 countries) and free-text fields are not translated; scoped out as disproportionate to this app's size, same reasoning as not building a full Thai administrative address cascade beyond sub-district.

## Patient form

Single-column form on mobile, widening to 2–3 column field groups (`sm:grid-cols-2` / `sm:grid-cols-3`) above the `sm` breakpoint, capped at `max-w-2xl` so line length stays readable on desktop. Native `<input type="date">` and `<select>` are used wherever possible instead of custom widgets, since they give a correct mobile picker UI for free.

The Thai address sub-district field is the one custom widget (a text input + dropdown suggestion list) — District/Province/Postal Code become read-only once a sub-district is selected, so the address can't end up internally inconsistent (see `docs/realtime-sync-flow.md` for why sub-district drives the cascade).

A reconnect banner appears above the form (not a blocking modal) when the socket disconnects, so the patient can keep filling in fields — which still work locally — while it retries in the background.

## Staff dashboard

Master-detail layout: a session list (search + status filter) and a detail panel showing every field of the selected session, live.

- **Desktop (`sm` and above)**: list and detail render side by side (`flex-row`), so staff can watch the list update while a detail panel stays open.
- **Mobile**: only one pane is visible at a time — the list until a session is tapped, then the detail panel takes over full-width with a "← Back" affordance. This is local component state (`selectedSessionId`), not routing, so no navigation round-trip is needed to flip between them.

Status is shown as a colored pill with an icon (success/active, muted/inactive, info/submitted) rather than plain text, since staff need to scan a list of several sessions at a glance.

## Why not more custom components

Both interfaces reuse three thin primitives (`TextField`, `SelectField`, `FormSection`) rather than a larger design-system layer — the field count (11) and the two-screen scope don't justify more abstraction than that. `FormSection` exists specifically because the same card-with-title-and-grid shape was being repeated across every field group (Name, Personal Details, Contact, Address, Emergency Contact) — three-plus repetitions is the point where extracting it stops being premature.
