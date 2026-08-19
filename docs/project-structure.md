# Project Structure

```
server.ts                          # custom server: http + Next request handler + Socket.IO attached
src/
  app/
    layout.tsx                     # root layout — theme provider + header wrap every page
    page.tsx                       # landing page — links to /patient and /staff
    patient/page.tsx               # patient form route
    staff/page.tsx                 # staff dashboard route
  components/
    layout/
      Header.tsx                   # logo + locale toggle + theme toggle, shown on every page
      LocaleToggle.tsx             # bonus: EN/TH segmented control
    theme/
      ThemeProvider.tsx            # thin wrapper around next-themes' provider
      ThemeToggle.tsx              # bonus: light/dark toggle button
    patient/
      PatientForm.tsx              # the full intake form, wires react-hook-form to the socket layer
      AddressFields.tsx            # Thai sub-district cascading autocomplete
      EmergencyContactFields.tsx   # optional name + relationship pair
      ReconnectBanner.tsx          # bonus: shown while the socket is disconnected
    staff/
      SessionList.tsx              # search/filter + list of session cards (bonus: search/filter)
      SessionCard.tsx              # one row in the list
      SessionDetail.tsx            # full field detail for the selected session
      StatusBadge.tsx              # active / inactive / submitted pill
    ui/
      TextField.tsx                # shared input wrapper (label + error)
      SelectField.tsx              # shared select wrapper (label + options + error)
      FormSection.tsx              # shared card wrapper for a group of fields (title + grid)
  lib/
    i18n/
      translations.ts             # en/th dictionaries + dropdown option-label maps
      LocaleProvider.tsx          # bonus: locale context, useTranslations()/useOptionLabel() hooks
    socket/
      client.ts                    # singleton socket.io-client instance
      session-store.ts             # server-side in-memory session Map + presence sweep (Node-only)
      session-store.test.ts
      use-session-id.ts            # patient: resolves/generates the session id from the URL
      use-patient-session.ts       # patient: connect, debounced field-update emit, submit+ack
      use-staff-sessions.ts        # staff: join the staff room, maintain the live session list
    validation/
      patient-form.ts              # zod schema — single source of truth for form + server validation
      patient-form.test.ts
    data/
      countries.ts                 # Nationality dropdown source (i18n-iso-countries)
      thai-address.ts              # Thai sub-district/district/province/postal dataset
  types/
    session.ts                     # shared types: PatientFormData, SessionState, socket event contracts
docs/                               # this file + the other three planning docs
```

## Why it's organized this way

The two interfaces (patient form, staff dashboard) share almost no UI, so `components/` is split by feature (`patient/`, `staff/`) rather than by type (`hooks/`, `components/` flat) — each folder is self-contained and maps directly onto a section of this documentation. `layout/` and `theme/` are their own small folders for the same reason: they're cross-cutting (used by every page via the root layout), not owned by either the patient or staff feature.

`lib/socket` and `types/session.ts` are the one exception to feature-scoping — deliberately *not* split by feature, because the socket event contract and the field schema are the one thing patient and staff genuinely share. Keeping them at the boundary avoids duplicating the contract on both sides.

`server.ts` lives at the project root, not under `src/`, because it isn't part of the Next.js app itself — it's the process entry point that wraps Next's request handler and attaches Socket.IO to the same HTTP server (see `docs/realtime-sync-flow.md`).
