# add-shared-ui-components

## မြန်မာ အတိုချုပ်

- Screen တွေ မဆောက်ခင် developer ၂ ယောက်လုံး သုံးမယ့် **အခြေခံ** ကို အရင်ဆောက်တာ — အရောင် / font token ဖိုင် တစ်ခု၊
  ငွေ / ရက်စွဲ / အချိန် / ဖုန်း format တစ်ခု၊ ဘာသာစကားဖိုင် (မြန်မာ / English)၊ shared component ၃၇ မျိုး + `can()`
  (owner ပြောတဲ့ ~၃၅)၊ app ဘောင် (shell)။
- Owner ရမယ့်အရာ = **`/dev/ui`** စမ်းသပ်စာမျက်နှာ (developer စက် / test build မှာပဲ ပွင့်၊ production မှာ မရှိ) — component တိုင်းကို
  မြန်မာ / English၊ ဖုန်း (320 px) / PC (1280 px) နဲ့ ကြည့်စစ်လို့ရ; login မလို။
- Website အရောင် = owner ပေးထားတဲ့ `#EEEEEE` (နောက်ခံ) / `#000000` (စာ) / `#DC5F00` (အလှဆင်) + owner OK ပေးပြီးတဲ့ ကျန်အရောင်တွေ
  (REC-41 ✅ 02/Oct 13:46 — အနီ `#C8281B`၊ အစိမ်း `#0E4A28`၊ အညို `#6A3A00`၊ အပြာ `#0B5CAD`၊ မီးခိုး စာ `#555555` စသည်) —
  ခလုတ်က အမည်းပေါ် စာဖြူ; လိမ္မော်ရောင်က အလှဆင် / ခေါင်းစဉ်ကြီး / icon အတွက်ပဲ။ **Admin panel အရောင် မပေးရသေးလို့
  မီးခိုးရောင် default ပဲ** — admin မှာ status badge တွေကို icon + စာနဲ့ ခွဲပြထားမယ် (အရောင်ရောက်ရင် ဖိုင်တစ်ခုတည်း ပြင်ရုံ)။
- Format: `7,000 ကျပ်` / `7,000 Ks` (website = `Ks` အမြဲ)၊ `05/Oct/2026`၊ `2:30 PM`၊ ဂဏန်း 0–9၊ မြန်မာစံတော်ချိန် —
  ဖုန်းရဲ့ timezone / ရက်စွဲ မှားနေလည်း အတူတူ။ ငွေကို ဒသမနဲ့ ဘယ်တော့မှ မတွက်။
- Code ထဲ စာသား တိုက်ရိုက်ရေး၊ အရောင် code တိုက်ရိုက်ရေး၊ ဘာသာပြန် key ကျန်၊ accessibility အမှား ရှိရင် CI က အလိုလို ဖမ်းမယ်။
- **Owner ဖြေပြီး (02/Oct/2026 13:08) — မေးခွန်း မကျန်တော့၊ စလုပ်လို့ရပြီ:** change ကို မခွဲဘဲ PR ၃ ခုနဲ့ ပို့မယ် (S2) ·
  `ui-foundation` နာမည် OK (S3) · form အမှား code = `too_small` / `too_big` / `invalid_type` (S5) · reason dialog က ယေဘုယျ
  ပုံစံ ပြန်ပေး၊ screen က endpoint field နဲ့ ချိတ် (S8) · focus ဘောင် = စာအရောင် ၂ px၊ input ဘောင် = မီးခိုးရင့်
  (admin ဘက်မှာ — အရောင်အသစ် မထည့်; website ဘက်က ကိုယ်ပိုင်အရောင် ရပြီ) (S15) · စာသားအသစ်တွေကို ဒီအတိုင်း သုံး — owner က
  brief / PR မှာ ပြင်ပေးနိုင် (S18)။
- **မပါတာ:** တကယ့် screen (walk-in, booking …)၊ login၊ API / database ချိတ်တာ၊ website ရဲ့ ကိုယ်ပိုင် component၊ admin အရောင်။

---

- **Implements:** D-UI-01 · D-UX-01 · D-UX-02 · D-UX-03 · D-UX-04 · D-UX-05 · D-PLT-03 · D-PLT-04 · D-PLT-05 ·
  D-PLT-15 · D-DB-03 · D-DB-04 · D-CUS-02 · D-ROLE-08 · D-ENG-01 (the `/dev/ui` catalogue) — UX rules
  AD-VIS-01..12 · AD-LAY-01..05 · AD-NAV-01 · AD-NAV-04 · AD-NAV-06 · AD-LIST-01 · AD-LIST-02 · AD-LIST-05 ·
  AD-LIST-06 · AD-DET-03 · AD-FORM-01..05 · AD-FORM-08..11 · AD-FORM-13..16 · AD-RSN-01 · AD-RSN-02 ·
  AD-CONF-01 · AD-CONF-02 · AD-WIZ-01 · AD-STATE-01..06 · AD-TOAST-01 · AD-CMP-01 · AD-CMP-05..09 · AD-CMP-12 ·
  AD-CMP-13 · AD-CHART-01 · AD-DSH-02 · AD-DSH-03 · AD-NTF-01 · AD-NTF-04 · AD-RCPT-01 (on-screen view) ·
  AD-FMT-00..11 · AD-L10N-01..07 · AD-PERM-01..05 · AD-A11Y-01..07 · AD-IMPL-01..06 · AD-QA-01 · AD-QA-02 ·
  FE-VIS-01 · FE-VIS-01a (v1.7 — the whole site palette) · FE-VIS-01b · FE-VIS-02 · FE-VIS-06 · FE-META-06 · FE-FMT-01 ·
  FE-CMP-06 · FE-BK-06 (shared `OptionPicker`) · FE-IMPL-03 · FE-PERF-06 (font files) — API conventions
  API-DATA-02..06 · API-DATA-08 · API-DATA-11 · API-ERR-01 · API-ERR-02 · API-AUTH-05 · API-LIM-03 (shapes
  consumed, no endpoint implemented) — ADR-001 · ADR-012 · ADR-016 — coding guideline CG-MONEY-01..03 ·
  CG-TIME-03 · CG-TIME-04 · CG-TIME-06 · CG-UI-04 · CG-UI-05 · CG-UI-06 · CG-UI-10 · CG-I18N-01..03 and the
  web rows of its §24.
- **Depends on:** `add-repo-scaffold` (empty `packages/ui`, `packages/i18n`; `packages/shared` skeleton; the
  `staff` and `site` trees; lint, guards, test and CI pipeline). Runs in parallel with
  `add-foundation-auth-access`.
- **Repos:** `point-barber` (all code) · `point-sdd` (this change, the brief, the test workbook).
- **Owner:** Dev 1 (end to end).

## Why

Every screen of the system is built from the same parts: tokens, formatters, language keys, a form field, a
status badge, a reason dialog, a table, the shell. The owner put them first ("Shared UI component ~35 — dev ၂
ယောက်လုံး သုံးမှာမို့ အရင်ဆုံး", AD-IMPL-02; build order D-PLT-18 #3). If two developers start feature screens
without them, each screen invents its own money format, date format, error display and badge colour — the
inconsistency the guideline measured in Fresha (AD-FMT-00) and the one a money system cannot afford.

The rules these parts carry are locked: required asterisk and error under the field (D-UI-01), whole MMK with
`Ks` / `ကျပ်` (D-PLT-04), `DD/MMM/YYYY`, 12-hour time and digits 0–9 (D-PLT-05), Myanmar Time whatever the
device says (D-PLT-15), all text from the language files (D-PLT-03), status by named constant (D-DB-03),
Myanmar + English data fields (D-DB-04), phone as E.164 identity (D-CUS-02). Building them once, with tests and
lint rules, is how every later change inherits them without restating them.

## What Changes

- **Design tokens** — one `packages/ui/tokens.css`. Staff tree = shadcn/ui `neutral` values unchanged
  (admin palette not given — AD-VIS-03); tokens that neutral does not have are aliases of neutral tokens, never
  a new colour. Site tree = the website palette of FE-VIS-01a (v1.7), 24 colour tokens: the owner's
  `--background #EEEEEE`, `--foreground #000000`, `--decoration #DC5F00` (decoration, large headings and icons
  only, on the background or a card — FE-VIS-01b), `--primary #000000` / `--primary-foreground #FFFFFF`, and
  the tokens approved with REC-41 (ring, card, muted, border, input, secondary, accent, destructive
  `#C8281B`, success `#0E4A28`, warning `#6A3A00`, info `#0B5CAD` with their foregrounds). Type scale with
  Myanmar line-heights that follow the language of the text, spacing, radius, elevation, motion. The focus
  outline and the input border are two component variables: on the site they point at `--ring` and `--input`;
  in the staff tree, until the admin palette arrives, at `--foreground` and `--muted-foreground` (AD-VIS-03 —
  owner S15), while the staff `--ring` and `--input` keep their neutral values. Self-hosted WOFF2 fonts with
  their licence files (Pyidaungsu · Manrope / Inter · Archivo Black / Roboto) and the font tokens,
  `--font-myanmar` included.
- **Formatters** in `packages/shared` — money with the `app` and `site` profiles, date, time, date-time, time
  range, duration, percent, quantity, relative time, phone display and E.164 normalisation, Myanmar-digit
  normalisation, Myanmar-Time helpers on the zone name `Asia/Yangon` (`businessDateOf`, `todayMmt`), the
  integer-only money type `Mmk` with its parser and wire helpers, date presets.
- **Clock** — `ClockProvider` / `useNow()`: "today" and "now" come from a supplied server instant, not from the
  device date.
- **Language files** in `packages/i18n` (`next-intl`) — `my` and `en`, namespaces `common`, `status`, `error`,
  `reason` and `devui` (catalogue demo labels); typed keys; the bilingual-field fallback; language resolution
  (account value → system default; cookie only before a session exists) and the switch; `pnpm i18n:check`.
- **Shared components** — every entry of AD-IMPL-02 (37 components and `can()` — the owner's "~35"), plus the
  seven supporting parts `Button`, `FormField`, `Dialog`, `Skeleton`, `Toaster`, `LanguageSwitch`, `DataText`.
  Components whose data source does not exist yet (`NotificationBell`, `ApprovalCard`, `QrScanner`,
  `ReceiptRenderer`, `AttachmentUploader`, `TimeSlotPicker`, `PriceGridEditor`) are presentational: typed props
  and fixture data.
- **One status map** — tone, icon and label key for the 71 status values of 19 tables and the 18 flags, keyed
  by named constants in `packages/shared`.
- **Guard rails** — the four checks the scaffold turned on (raw JSX strings, hex / arbitrary colour classes,
  `font-family` outside `tokens.css`, `parseFloat`) are extended, and the web rows of the coding guideline's
  §24 are added: palette classes and colour functions, number arithmetic on amounts, direct locale formatting,
  device-clock and device-zone reads, raw status numbers, raw form elements and Radix primitives outside
  `packages/ui`, static accessibility lint, missing translation keys, font licences, the catalogue flag, and
  axe violations on the catalogue.
- **Catalogue `/dev/ui`** — staff tree, development server and catalogue test build only (404 in the
  production image and on the site host): every shared component in Myanmar and English at 320 and 1280 px
  (360 and 768 px for the components whose layout changes at 768 px), no login, no API call.
- **Definition of done** for a shared component (touch targets, focus, labels, keyboard, both languages, axe).

## Capabilities

### New Capabilities

- `ui-foundation` — design tokens, formatters, language files, shared components, app shell, catalogue and the
  lint / CI guard rails (77 requirements, 239 scenarios). The capability is approved (D-PLT-20 #4 — owner S3).

### Modified Capabilities

- None.

## Impact

- **Code (`point-barber`):** `packages/ui` (tokens, fonts, components, providers, status map, catalogue
  demos), `packages/shared` (money, format, time, text, phone, status constants, `createCan`, error codes, list
  types), `packages/i18n` (message files, locale resolution, request config), `tools/eslint/web.mjs`,
  `tools/eslint-plugin-point` (two rules), `tools/guards` (CSS, fonts, i18n, catalogue flag, text style, web
  globals), the route `apps/web/app/staff/dev/ui`, Playwright specs in `e2e/dev-ui`, a CI job `catalogue`, and
  the scaffold's single root layout replaced by one root layout per tree (`data-tree`, `lang`, token import).
- **No database change, no API endpoint, no NestJS module, no background job.**
- **New dependencies:** the ones the scaffold deferred to this change — Tailwind 4, shadcn/ui, `lucide-react`,
  `next-intl`, `@tanstack/react-query`, `react-hook-form` — plus `@tanstack/react-table`, `recharts`, `sonner`,
  `react-day-picker`, `date-fns` with `@date-fns/tz`, `myanmar-tools`, `barcode-detector`,
  `eslint-plugin-jsx-a11y`, `@tanstack/eslint-plugin-query`, `@axe-core/playwright` (all inside the stack fixed
  by ADR-001 and D-ENG-01).
- **Coordination with `add-foundation-auth-access`** (parallel) — shared files follow "first merge creates,
  second extends": (1) `packages/shared/src/constants/status.ts`; (2) the error-code constants file;
  (3) `packages/shared/src/permissions/` — this change ships `createCan` and tests it with a seven-code fixture
  catalogue, the foundation change fills `permissions.json` and binds `can`; (4) the cookie `point_locale` and
  `resolveLocale` — the foundation change passes the session's `ui_language` and the system default, rewrites
  the cookie after `/me` and saves the switch; (5) `ClockProvider` — the foundation change seeds it from
  `system.server_time` of `/me`; (6) the field message keys of design D9. That change needs pull request 1 of
  this change before its web tasks.
- **Coordination with `add-walkin-visit-checkout`:** the type `Mmk`, the parser, the wire helpers
  (`moneyFromWire`, `moneyToWire`), `sumMoney`, `businessDateOf` and the lint rule `point/no-number-money` are
  created **here**; the walk-in change extends their tests and helpers (its tasks 2.7 and 2.9) and enables the
  rule for `apps/api`. There is one money module and one `businessDateOf` in the repository.
- **Size:** 77 requirements, 239 scenarios, 169 tasks of at most 2 hours — far more than the usual 1–3 days
  and 20–30 test cases; the owner accepted it as an exception (D-PLT-20, v5.2.17 note — S2). Delivered as three
  pull requests: tokens + formatters + language files + catalogue frame · components + shell + demos · guard
  rails + verification. Pull requests 1 and 2 merge on CI + review after their catalogue cases were run; the
  test workbook is generated and run on pull request 3 (CG-GIT-05).
- **Sources already updated with batch v5.2.16:** the D-UX-02 row records the owner's palette decision of
  02/Oct/2026 (the site tree overrides colour and font tokens), the website guideline carries the values
  (FE-VIS-01a / 01b — v1.7 with the tokens of REC-41), and the catalogue-only fixture rows are in `docs/plan/spec-fixtures.md` §8.

## Non-goals

- **Feature screens and data wiring** — no TanStack Query hook, no API call, no Socket.IO subscription
  (AD-RT-01 / 02). Each shared component is wired by the feature change that first uses it.
- **Session and access wiring** → `add-foundation-auth-access`: fetching `/me`, `permissions.json` and the
  bound `can()`, saving `users.ui_language`, seeding the clock from the server time, the login and code-entry
  screens, session-loss handling (AD-AUTH-01). Later still: the device screens → `add-employee-management`;
  the maintenance banner (AD-NAV-08) → `add-settings-store`; refresh on `session.updated` →
  `add-realtime-gateway` (until then `/me` is refetched on window focus).
- **Shell content** — the module list of the rail (AD-NAV-02), the user menu entries (AD-NAV-07), global search
  (AD-NAV-05), breadcrumbs per screen, the barber's default branch from today's shift: `AppShell` and
  `BranchSwitcher` take them as props; `add-foundation-auth-access` fills what `/me` provides, the rest comes
  with the feature change that owns each module.
- **Data behind the presentational components** — notifications and the approvals inbox, the attachment upload
  call (P8.ATT.01), QR clock-in and GPS, availability slots, price grids (including the current / scheduled /
  history views and the barber override column), the customer lookup after a phone number is complete
  (AD-FORM-10): the feature change that first uses each one.
- **Receipt printing, PDF and PNG** — rendered on the server from `packages/documents` (ADR-013) by the
  sales-checkout change that issues receipts; `ReceiptRenderer` here is only the on-screen view.
- **Site-specific components of FE-IMPL-02** (`SiteHeader`, `BookingModal`, `DateStrip`, `SlotGrid`,
  `BarberCard`, `Reveal`, …), Motion / GSAP (FE-VIS-07), the site `[locale]` routing, the namespaces `site.*`,
  `book.*`, `manage.*`, and axe / Lighthouse checks on public pages: the website changes. Only the pieces
  marked shared are here (`OptionPicker`, `PhoneInput`, formatters, tokens, fonts).
- **The admin palette** (★ OPEN-30) — not given; the staff tree stays on the neutral values and its
  success / warning / info tokens stay aliases. It arrives through its own change. The website palette is
  complete (REC-41 ✅) and is part of this change; site tokens that FE-VIS-01a does not name (`--popover`, the
  `-subtle` aliases, the chart colours) keep the staff declarations.
- **Logo, favicon and PWA manifest icons** (AD-PWA-01) — owner files, added when supplied.
- **Dark theme** — V1 is light only (AD-VIS-04, FE-VIS-06).
- **Components outside AD-IMPL-02** — big choice cards (AD-CMP-02), segmented control (AD-CMP-03), timeline
  (AD-CMP-11), calendar (AD-CAL-01..08), help popovers (AD-HELP-01..03), the role matrix (AD-PERM-07), the
  export menu (AD-LIST-07), reference-number and time inputs (AD-FORM-12, the time part of AD-FORM-15), the
  Myanmar collation helper (AD-L10N-08): the feature change that first needs each.
- **Heavier CI checks of the coding guideline's §24** — Lighthouse CI, the licence allow-list, `knip`,
  coverage thresholds, `spec:trace` → `add-ci-guard-rails`. The `BigInt.prototype.toJSON` guard and the
  property-based money tests → `add-walkin-visit-checkout` (the first change with money arithmetic).

## Open questions

The change is ready to apply.

### Needs the owner's answer

None — all answered by the owner on 02/Oct/2026 13:08 (review §0.11).

### Answered by the owner (02/Oct/2026 13:08 — review v5.2.17 §0.11)

- **S2 — size of this change: (A) it stays whole.** An accepted exception to "1–3 days, 20–30 test cases";
  three pull requests; the earlier two merge on CI + review after their catalogue cases were run, the test
  workbook is generated and run on the last one — D-PLT-20 (v5.2.17 note), CG-GIT-05.
- **S3 — capability `ui-foundation`: OK.** It is an approved capability; the list is 25 — D-PLT-20 #4
  (v5.2.17), `openspec/config.yaml`.
- **S5 — field-level error codes.** `errors[].code` of a schema failure is the Zod issue name unchanged
  (`too_small`, `too_big`, `invalid_type`, with `params`) unless the schema names a catalogue code;
  `required`, `date_invalid` and `unknown` are client-only message keys the API never returns — API-ERR-03
  (Part 0 v1.6). The key `error.internal_error` is the HTTP 500 code of API-ERR-02 (Part 0 v1.6 — S4).
- **S8 — shape of the reason field.** Each endpoint's reason field is the one its part defines;
  `{ reason_id?, reason_code?, note? }` is the generic result of the shared `ReasonDialog`, and the calling
  screen maps it to the endpoint's field — API-DATA-11 (Part 0 v1.6).
- **S15 — focus outline and input border: (A).** Until a tree's palette arrives its focus outline is 2 px
  `var(--foreground)` and its input border `var(--muted-foreground)` — existing neutral tokens, no new colour;
  `--ring` and `--input` keep their neutral values — AD-VIS-03 (admin guideline v1.7). This now applies to the
  staff tree only: the site palette arrived with REC-41, so the site points back at `--ring` / `--input`.
- **REC-41 ✅ 02/Oct/2026 13:46 ("Ok ပါတယ်") — the remaining website colour tokens.** They are locked and,
  because this change is not applied yet, folded into it instead of a later change: the site block of
  `tokens.css` carries all 24 colour tokens of FE-VIS-01a (v1.7) — D-UX-02.
- **S18 — new UI copy.** The English and Myanmar texts listed in the brief are used; the owner reads and
  corrects them in the brief or the pull request; keys and behaviour do not change — D-PLT-20 (v5.2.17 note).

Still open with the owner and **not** part of this change: the admin palette (OPEN-30) and the approval of
the coding guideline (REC-42).

### Recorded readings

No decision needed — the reading used changes nothing locked; listed so nothing is resolved silently
(D-PLT-13).

1. **D-UX-02's older note "the site overrides font tokens only" vs the owner's palette decision of
   02/Oct/2026.** Reading used: the later decision — the site tree overrides colour and font tokens (the
   register row and FE-VIS-01a carry it since batch v5.2.16).
2. **AD-IMPL-05 "money is bigint / string end to end" vs API-DATA-02 "JSON integer, never string".** Reading
   used: both hold — `Mmk` (bigint) in code, JSON integer on the wire, converted at the API-client boundary
   (design D4; the same reading as CG-MONEY-02).
3. **FE-CMP-06 "formats as you type" vs AD-FORM-10 "keep what was typed, show a live formatted preview".**
   Reading used: the field keeps the typed text and the preview formats as the user types.
4. **AD-LAY-01 "icon rail with icons + tooltips" vs AD-VIS-11 "navigation icons always have a visible label".**
   Reading used: both — icon, short visible label and tooltip.
5. **AD-FORM-11 "integer only (no decimal key)".** Reading used: the key is ignored and later digits are
   appended (`7000` `.` `5` `0` → `700,050`); a pasted text with a decimal point is refused as a whole.
6. **AD-QA-01 (screens at 320, 360, 768 and 1280 px) vs AD-IMPL-06 (catalogue at 320 and 1280 px).** Reading
   used: every component at 320 and 1280 px, and the components whose layout changes at 768 px also at 360 and
   768 px.
7. **AD-PERM-02 allows two forms for a state-blocked action** (hidden under the lock banner, or disabled with
   the reason). Reading used: `PermissionGate` supports both; the screen chooses.
8. **AD-FMT-04 gives the phone grouping for 9 digits after `09` only.** Reading used: 8 digits as 4-4 (the
   form of the fixture `09 7712 3456`), 7 digits as 3-4.
9. **AD-FMT-07 gives no rounding rule for percentages.** Reading used: half up on the decimal string (display
   only; no money is rounded here).
10. **AD-LIST-01 names "This week" and "Last 7 days" without a week start.** Reading used: Monday–Sunday, the
    ISO numbering of `day_of_week` in the database; "Last 7 days" = today and the 6 days before
    (API-DATA-08: date presets are a client concern).
11. **AD-CMP-05 gives "Reopened ×N" no tone, and AD-CMP-06 gives the three attendance flags no icon.** Reading
    used: a design choice recorded in design D8 (neutral; lucide icons).
12. **The coding guideline is a draft (OPEN-CG-01) and leaves the date library open (OPEN-CG-05).** Reading
    used: its proposal, `date-fns` with `@date-fns/tz` on the zone name `Asia/Yangon`, recorded in
    `VERSIONS.md`.
