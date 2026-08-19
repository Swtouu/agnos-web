# Component Architecture

## App shell

- **`RootLayout`** (`src/app/layout.tsx`) — wraps every page in `ThemeProvider` and renders `Header` above `{children}`, so both are available regardless of which route loads first.
- **`ThemeProvider`** — a thin pass-through wrapper around `next-themes`' provider (`attribute="class"`, `defaultTheme="system"`). Exists as its own file mainly so `layout.tsx` can stay a server component while the provider itself is client-only.
- **`Header`** — logo/link back to `/` plus `LocaleToggle` and `ThemeToggle`. The one piece of UI both the patient and staff routes share.
- **`ThemeToggle`** — bonus feature. Reads `resolvedTheme` from `next-themes` directly rather than tracking its own `mounted` state in a `useEffect` — `resolvedTheme` is `undefined` until the theme resolves client-side, which is enough to render a neutral placeholder pre-hydration without an extra effect+state pair.
- **`LocaleProvider`** (`src/lib/i18n/LocaleProvider.tsx`) — bonus feature. Reads/writes the `en`/`th` locale via `useSyncExternalStore` against `localStorage` (`getServerSnapshot` always returns `"en"`, matching the client's first paint, then React re-syncs to the real value right after hydration) — the correct tool for "read external mutable browser state without a hydration mismatch," and the reason it's not a `useState` + `useEffect` pair like an earlier draft of `useSessionId` was: that pattern calls `setState` synchronously inside an effect, which this project's lint config rejects. Also exports `useTranslations()` (dot-path string → localized string, e.g. `t("patientForm.fields.firstName")`) and `useOptionLabel()` (translates a dropdown's *displayed* label while its underlying *value* stays English — see `docs/design.md`).
- **`LocaleToggle`** — bonus feature, segmented EN/TH control next to `ThemeToggle`.

## Patient side

- **`PatientForm`** — owns the `react-hook-form` instance (`zodResolver(patientFormSchema)`), the session id (via `useSessionId`), and the socket connection (via `usePatientSession`). It wires every field's `onChange` to a single `syncField(field)` helper that reads the field's current value with `getValues(field)` and hands it to `emitFieldUpdate`. This works uniformly for both flat fields (`firstName`) and nested objects (`address`, `emergencyContact`) — for a nested field, `getValues("address")` returns the whole sub-object after RHF has already applied the change internally, so one helper covers both cases without a dot-path parser. Field groups are wrapped in `FormSection` (Name, Personal Details, Contact), with `AddressFields`/`EmergencyContactFields` each wrapping themselves in one.
- **`AddressFields`**, **`EmergencyContactFields`** — receive `register`/`errors` (and, for `AddressFields`, `setValue`/`watch`) as props rather than reading form context, since the form is small enough that prop-passing is simpler than `FormProvider`/`useFormContext`.
- **`ReconnectBanner`** — pure presentational, driven by the `connected` boolean from `usePatientSession`.

## Staff side

- **`StaffPage`** — holds `selectedSessionId` as local state; everything else (list vs. detail, mobile vs. desktop) is a CSS/Tailwind concern layered on top of that one piece of state.
- **`useStaffSessions`** — the data source: joins the `staff` room, receives a full snapshot on connect, then merges incremental `session-update` events into a `Record<sessionId, SessionState>`. Returned as an array sorted by creation time.
- **`SessionList`** — owns its own search/filter local state (bonus feature) and derives the filtered list with `useMemo`.
- **`SessionCard`** / **`StatusBadge`** — presentational only.
- **`SessionDetail`** — presentational; renders whatever fields are present on the selected `SessionState["data"]` (a `Partial<PatientFormData>`, since a session may be mid-fill).

## Shared boundary

- **`src/types/session.ts`** — the socket event contract (`ClientToServerEvents`, `ServerToClientEvents`) and `SessionState`/`PatientFormData` types, imported by both `server.ts` and the client hooks. This is the one place patient and staff code genuinely depend on the same shape.
- **`src/lib/validation/patient-form.ts`** — the zod schema is the source of truth for `PatientFormData`'s type (`z.infer`), for the client-side RHF resolver, and for server-side validation at submit time (`server.ts` calls `patientFormSchema.safeParse` before accepting a submission). Every error `message` in the schema is an i18n translation key (e.g. `"patientForm.validation.firstNameRequired"`), not literal English — `TextField`/`SelectField` translate `errors.field?.message` at render time via `useTranslations()`. This keeps the schema itself locale-agnostic (still one file, still shared client+server) instead of duplicating validation per language.
- **`FormSection`** (`src/components/ui/FormSection.tsx`) — the one UI primitive both `PatientForm` and `SessionDetail` reach for: a titled card wrapping a field/data grid. `PatientForm` uses it as a real `<fieldset>` (form semantics); `SessionDetail` uses its own visually-identical `Group` (a `<div>`, since it's read-only display, not a form control group) rather than sharing the component directly — see `docs/design.md`.
