# Tasks — add-shared-ui-components

Owner: **Dev 1**, end to end. Every task is at most 2 hours and is done in the repo named in brackets. This
change has no data / migration group and no API group (no table, no endpoint). Money, date and phone functions
are written tests first.

**Ready to apply:** the owner answered every open item on 02/Oct/2026 13:08 (review §0.11); nothing waits.

**Pull requests** — three, each titled `feat(add-shared-ui-components): <subject>` (CG-GIT-02). Pull request 1
= groups 1–5 · pull request 2 = groups 6–10 · pull request 3 = groups 11–12. Pull requests 1 and 2 merge
(squash) on CI green + review after their catalogue cases were run and the NG fixed; pull request 3 stays open
while the test workbook of the whole change is generated and run on its branch, and merges when no NG is open
(D-PLT-20, CG-GIT-05).

## 1. Tokens and fonts

- [ ] 1.1 Install Tailwind 4 and `lucide-react` for `apps/web` and `packages/ui`, run the pinned shadcn/ui CLI init with base colour `neutral` in `packages/ui`, commit its light-theme variables as `packages/ui/tokens.neutral.snapshot.css`, record the versions in `VERSIONS.md` (point-barber) — AD-IMPL-01, AD-VIS-03, D-UX-02
- [ ] 1.2 Write the staff block of `packages/ui/tokens.css`: neutral colour tokens copied unchanged, the alias tokens of design D2 with their `{{…}}` comments, `@theme inline` mapping, default Tailwind palette removed (point-barber) — AD-VIS-01, AD-VIS-03, AD-META-04
- [ ] 1.3 Add the site block `:root[data-tree="site"]` with exactly the 24 colour declarations of design D2 (FE-VIS-01a v1.7: background, foreground, decoration, primary pair, ring, card pair, muted pair, border, input, secondary pair, accent pair, destructive / success / warning / info pairs); tokens the palette does not name are not declared in the block (point-barber) — D-UX-02, D-UX-05, FE-VIS-01a
- [ ] 1.4 Add type-scale tokens (7 sizes, Latin line-heights) and the `:lang(my)` block (Myanmar line-heights, `font-synthesis: none`); weights 400 / 500 / 600 / 700 (point-barber) — AD-VIS-06, AD-L10N-04
- [ ] 1.5 Add spacing, `--radius: 0.5rem` with sm / md / lg, three elevation tokens, motion tokens 150 / 200 / 300 ms with the `prefers-reduced-motion` block, and the two component variables: staff `--focus-outline: var(--foreground)`, `--field-border: var(--muted-foreground)`; site `--focus-outline: var(--ring)`, `--field-border: var(--input)` (point-barber) — AD-VIS-07, AD-VIS-08, AD-VIS-09, AD-A11Y-06, AD-VIS-03, FE-VIS-01a
- [ ] 1.6 Download Manrope, Inter, Archivo Black, Roboto and Pyidaungsu from their official distributions and copy each licence file into `packages/ui/fonts/`; if the Pyidaungsu package has no licence text, stop and report to the owner (point-barber) — AD-VIS-05, FE-VIS-02, D-PLT-13
- [ ] 1.7 Write `packages/ui/fonts/build-subsets.sh` (Latin subsets; Pyidaungsu U+1000–U+109F + U+200B + Latin digits and punctuation), run it and commit the WOFF2 files (point-barber) — AD-VIS-05, FE-PERF-06
- [ ] 1.8 Add to `tokens.css` the `@font-face` rules (`font-display: swap`) and the font tokens: `--font-myanmar`, staff `--font-sans` / `--font-numeric`, site `--font-sans` / `--font-display`, and the `:lang(my)` family order; write `fontPreloads(tree, locale)` (point-barber) — AD-VIS-05, FE-VIS-02, FE-PERF-06, D-UX-02
- [ ] 1.9 Unit tests: staff tokens equal the snapshot (`--ring` and `--input` included), staff alias tokens resolve to their targets, the site block holds exactly the 24 colour declarations with their values, `--font-myanmar` is `'Pyidaungsu'` in both trees, the two component variables resolve per tree (staff: `--foreground` / `--muted-foreground`; site: `--ring` / `--input`) (point-barber) — AD-VIS-03, D-UX-02, FE-VIS-01a
- [ ] 1.10 Tests then code: guard `tools/guards/check-fonts.mjs` (every font family has a licence file) with the alias `pnpm fonts:check` (point-barber) — AD-VIS-05
- [ ] 1.11 Replace the scaffold's single root layout by `app/staff/layout.tsx` and `app/site/layout.tsx`, each rendering `<html>` with `data-tree`, `lang="my"` (fixed until task 3.10), the `tokens.css` import and the font preloads; the scaffold's 404 page and its smoke / edge specs stay green (point-barber) — AD-VIS-01, AD-L10N-04, ADR-001

## 2. Formatters and shared logic (tests first)

- [ ] 2.1 Write the failing test table for `formatMoney` (0, 999, 1,000, 7,000, 1,250,000, −6,000; `app` / `site`; `my` / `en`; `unit: false`; a `number` argument does not compile), then implement it (point-barber) — D-PLT-04, AD-FMT-01, FE-FMT-01
- [ ] 2.2 Tests then code: `Mmk` (branded bigint), `parseMoneyInput` (accepted, rejected, empty, `9007199254740993`), `moneyFromWire`, `moneyToWire`, `sumMoney` (point-barber) — API-DATA-02, AD-IMPL-05, AD-FORM-11, CG-MONEY-02
- [ ] 2.3 Tests then code: `formatLakh` (99,999 → none; 100,000 → `1`; 2,250,000 → `22.5`; 123,456 → `1.23456`) (point-barber) — AD-FORM-11
- [ ] 2.4 Add `date-fns` and `@date-fns/tz` (record in `VERSIONS.md`); tests then code: `businessDateOf` and `todayMmt(now)` on the zone `Asia/Yangon` with the 23:59 / 00:00, UTC-midnight and month-end fixtures; add the script that runs the `time/` and `format/` suites under `TZ=UTC`, `TZ=Asia/Yangon` and `TZ=America/Los_Angeles` (point-barber) — D-PLT-15, AD-FMT-11, CG-TIME-04, CG-TIME-05
- [ ] 2.5 Tests then code: `formatDate` (with weekday), `formatTime` (instant and wire `HH:mm`), `formatDateTime`, `formatTimeRange` (point-barber) — D-PLT-05, AD-FMT-02, AD-FMT-03, API-DATA-03
- [ ] 2.6 Tests then code: `parseDateInput` (`DD/MM/YYYY`, `DD/MMM/YYYY`, Myanmar digits, `31/02/2026`, leap day) and `dateRangeForPreset` (six presets on 05/Oct/2026 and 07/Oct/2026) (point-barber) — AD-FORM-15, AD-LIST-01
- [ ] 2.7 Tests then code: `normalizeDigits`, `formatDuration`, `formatQty` (point-barber) — AD-FMT-05, AD-FMT-08, AD-FMT-10
- [ ] 2.8 Tests then code: `formatPercent` (half up: `12.345` → `12.35%`, `12.344` → `12.34%`, `99.995` → `100%`) and `formatRelativeTime(at, now)` with its six boundaries (point-barber) — AD-FMT-07, AD-FMT-09
- [ ] 2.9 Tests then code: `normalizePhone` (five forms of Ma Su's number, length boundaries, no prefix) and `formatPhone` (9 / 8 / 7 digits after `09`) (point-barber) — D-CUS-02, API-DATA-06, AD-FORM-10, AD-FMT-04, P3-RULE-01
- [ ] 2.10 Tests then code: `localized` (both names, EN null, EN blank) and `hasMyanmarScript` (U+1000–U+109F) (point-barber) — D-DB-04, AD-L10N-03, AD-L10N-04
- [ ] 2.11 Tests then code: `normalizeMyanmarText` with `myanmar-tools` (`ျမန္မာ` → `မြန်မာ`, Unicode text untouched, threshold 0.95) (point-barber) — AD-FORM-13, AD-L10N-07
- [ ] 2.12 Create — or, if `add-foundation-auth-access` has already created it, extend — `packages/shared/src/constants/status.ts` for the 19 tables of AD-CMP-05 from the DBML notes, with a test that pins every numeric value (point-barber) — D-DB-03, API-DATA-04, AD-IMPL-04
- [ ] 2.13 Tests then code: `createCan` — the level table of design D7 with the seven-code fixture catalogue, `earnings.view_own`, type tests for an unknown code and for options a level does not allow (point-barber) — AD-PERM-03, AD-PERM-05, API-AUTH-05, ADR-012
- [ ] 2.14 Add the types `Grant`, `MeGrants`, `CursorPage<T>`, `ReceiptView`, `Slot`, `UploadPurpose`, `NotificationItem`; add this change's codes to the scaffold's `constants/error-codes.ts`; tests then code: `errorMessageKey` and `fieldMessageKey` (the table of design D9) (point-barber) — API-AUTH-05, API-DATA-08, API-ERR-01, API-ERR-03

## 3. Language files

- [ ] 3.1 Install `next-intl` and set up `packages/i18n`: locales `my` / `en`, per-namespace JSON loading, the request config for the staff tree, typed keys (`keys.d.ts`); `packages/i18n` gets no workspace dependency (point-barber) — D-PLT-03, AD-L10N-01, AD-L10N-02
- [ ] 3.2 Write `common` in both languages with the texts of the brief ("Texts"): actions, `common.format.*` words (units, weekday names, relative time), date words and presets (point-barber) — AD-L10N-02, AD-FMT-01, AD-FMT-05, AD-FMT-09, AD-COPY-05
- [ ] 3.3 Write the remaining `common` keys of design D6 (bilingual hint, discard question, offline banner, grid, QR, upload, notifications, stepper, list, search) in both languages (point-barber) — AD-FORM-08, AD-FORM-09, AD-STATE-05, AD-CMP-13
- [ ] 3.4 Write `status` in both languages: the 71 status values and the derived states (point-barber) — AD-CMP-05, API-DATA-04
- [ ] 3.5 Write the 18 `status.flag.*` keys and the `reason` namespace in both languages (point-barber) — AD-CMP-06, AD-RSN-02
- [ ] 3.6 Write `error` in both languages: the API codes, the field codes `too_small` / `too_big` / `invalid_type`, and the client-only `required`, `date_invalid`, `unknown` (point-barber) — API-ERR-01, API-ERR-02, API-ERR-03, AD-STATE-04
- [ ] 3.7 Create the `devui` namespace in both languages with the labels of the catalogue frame; later demo tasks add their own `devui` keys (point-barber) — AD-L10N-01, AD-IMPL-06
- [ ] 3.8 Connect the formatter words to `common.format.*` (dependency shared → i18n only) and re-run the formatter tests in both languages (point-barber) — D-PLT-03, AD-FMT-00
- [ ] 3.9 Tests then code: guard `tools/guards/check-i18n.mjs` with the alias `pnpm i18n:check` (missing key, empty value, status without label, error code without key, flag without label; exit code and output lines) (point-barber) — AD-L10N-01, AD-IMPL-05
- [ ] 3.10 Tests then code: `resolveLocale` (session `ui_language` 1 / 2 / NULL → system default; no session → cookie `point_locale` → system default) and the cookie rewrite helper; set `<html lang>` from it in the staff root layout (point-barber) — D-PLT-03, AD-L10N-06, AD-L10N-04

## 4. Catalogue frame and first sections

- [ ] 4.1 Route `apps/web/app/staff/dev/ui` gated by the build-time flag `NEXT_PUBLIC_DEV_CATALOGUE`, set only inside the `dev` and `build:catalogue` scripts of `apps/web` (never in `.env.example` or any other file); page frame with section anchors and the query parameters `lang`, `theme` (sets `data-tree` on `<html>`), `as`, `now` as plain links (point-barber) — AD-IMPL-06
- [ ] 4.2 `ClockProvider` and `useNow()` (seeded with an instant, advanced by elapsed device time); the catalogue seeds it from `now`; tests with fake timers and a wrong device date (point-barber) — D-PLT-15, API-AUTH-05, CG-TIME-03, CG-TIME-06
- [ ] 4.3 `packages/ui/src/catalogue/fixtures.ts` from `spec-fixtures.md` §1–§5 and §8, with the unit test that compares the module with those values (point-barber) — AD-IMPL-06, CG-TEST-08
- [ ] 4.4 Section Tokens: swatches with alias notes, and the contrast table of design D2 (6 staff rows and 20 site rows, ratios computed in the browser, limit and mark per row), with the test that no pair fails (point-barber) — AD-VIS-03, AD-VIS-04, FE-VIS-01a, FE-VIS-01b
- [ ] 4.5 Section Fonts: Myanmar test strings at 400 / 700, loaded `FontFace` check, tabular column, Myanmar digits, site headings (point-barber) — AD-VIS-05, FE-VIS-02
- [ ] 4.6 Section Formatters: an input → output table for every function of design D5 in both languages (point-barber) — AD-FMT-00..11

## 5. Verification of pull request 1

- [ ] 5.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm guards`, the unit tests (three-zone run included), `pnpm i18n:check`, `pnpm fonts:check`; open pull request 1; CI green and review done (point-barber) — AD-IMPL-05, CG-GIT-02
- [ ] 5.2 Run the catalogue cases of the sections Tokens, Fonts and Formatters (the spec scenarios of groups 1–4 that name the catalogue) on the catalogue test build in `my` and `en` at 320 and 1280 px; record OK / NG per scenario in the pull request (point-barber) — AD-QA-01, D-PLT-20
- [ ] 5.3 Fix every NG of 5.2, re-run those cases, then squash-merge pull request 1 (point-barber) — AD-QA-01, CG-GIT-05

## 6. Primitives

- [ ] 6.1 Generate the shadcn/ui primitives of design D1 into `packages/ui/src/primitives` and remove every palette class and every `uppercase`, `italic` and `tracking-*` class they bring (point-barber) — AD-IMPL-01, AD-VIS-01, AD-VIS-06
- [ ] 6.2 `Button`: four variants, 48 / 40 px heights with a 44 px hit area, loading state, `iconOnly` typing, focus outline from `--focus-outline`; tests (point-barber) — AD-CMP-01, AD-LAY-04, AD-A11Y-05, AD-NET-01
- [ ] 6.3 `FormField`: label, asterisk, helper, input border from `--field-border`, error under the field with the `--destructive` outline, `aria-invalid` / `aria-describedby`; tests (point-barber) — D-UI-01, AD-FORM-01, AD-FORM-02, AD-A11Y-04
- [ ] 6.4 Install `react-hook-form` with the Zod resolver; form binding: validate on blur and submit, re-validate on change after an error, focus the first invalid field, submit enabled while invalid; tests (point-barber) — AD-FORM-03, API-ERR-03, CG-UI-06
- [ ] 6.5 Form binding: map server `errors[]` to fields through `fieldMessageKey`, inline alert for non-field problems; tests with `phone_invalid`, `too_big`, `too_small` (empty text and below the minimum), `invalid_type` and `forbidden` (point-barber) — AD-FORM-04, API-ERR-01, API-ERR-03
- [ ] 6.6 `FormatProvider` (locale + money profile), `MoneyText` (`Mmk` only), `DateText` (with `relativeDay`, today from `useNow()`); tests (point-barber) — AD-FMT-00, AD-FMT-01, AD-FMT-02
- [ ] 6.7 `DataText` (adds `lang="my"` to a value with Myanmar script) and its use in the display path of shared components; tests for the fallback value, a Latin name and the Myanmar line-height (point-barber) — AD-L10N-04, AD-A11Y-06
- [ ] 6.8 Install `@tanstack/react-query` and add `QueryProvider` (refetch on focus, no mutation retry); test (point-barber) — AD-PERF-03, AD-NET-02
- [ ] 6.9 `LanguageSwitch` (writes `point_locale`, `router.refresh()`, `onChange`); component test that client state survives the switch (point-barber) — AD-L10N-06, AD-NAV-07
- [ ] 6.10 `Skeleton` (shapes, 400 ms delay); tests for a slow and a fast load (point-barber) — AD-STATE-01
- [ ] 6.11 `Toaster` / `toast.success` (4 s, one at a time, position by layout mode, `aria-live`); tests (point-barber) — AD-TOAST-01, AD-A11Y-04
- [ ] 6.12 `Dialog` base: focus trap, Esc, focus return, centred from 768 px and bottom sheet below; tests (point-barber) — AD-CMP-08, AD-A11Y-02
- [ ] 6.13 `Sheet` and `Drawer` base: right panel with the width clamped to 480–640 px (tests at 479 / 480 / 640 / 641), full-screen sheet below 768 px with sticky header and action bar (point-barber) — AD-CMP-08, AD-LAY-02, AD-LAY-03
- [ ] 6.14 Overlay motion: 200 ms enter / exit with the easing tokens and the reduced-motion variant; tests (point-barber) — AD-VIS-09, AD-A11Y-06
- [ ] 6.15 `Drawer` address key (`?drawer=`) and "Back closes the drawer first"; tests (point-barber) — AD-NAV-06
- [ ] 6.16 Unsaved-changes question ("Discard changes?") and the guard against a second dialog over a drawer; tests (point-barber) — AD-FORM-08, AD-CMP-08

## 7. Composite components

- [ ] 7.1 `MoneyInput` typing: live separators, unit suffix by language and profile, ignored `.` and `-` keys (`7000` `.` `5` `0` → `700,050`), Myanmar digits; tests (point-barber) — AD-FORM-11, D-PLT-04, AD-FMT-10
- [ ] 7.2 `MoneyInput` paste handling (`7,000`, `7000`, `7 000`, refused `7000.50`), `null` vs 0, `max`, read-only, the သိန်း helper with its boundary; tests (point-barber) — AD-FORM-11
- [ ] 7.3 `PhoneInput`: `inputmode="tel"`, placeholder, typed text kept, live preview, `{ raw, e164 }`, `onComplete` once; tests (point-barber) — AD-FORM-10, FE-CMP-06, D-CUS-02
- [ ] 7.4 `BilingualInput` (Myanmar required, English optional → null, hint); tests (point-barber) — AD-FORM-09, D-DB-04
- [ ] 7.5 Zawgyi conversion with its notice on the shared text inputs (`BilingualInput`, the `ReasonDialog` note); tests (point-barber) — AD-FORM-13, AD-L10N-07
- [ ] 7.6 `DateInput` display and typed forms (`DD/MM/YYYY`, `DD/MMM/YYYY`, Myanmar digits, impossible dates); tests (point-barber) — AD-FORM-15, D-PLT-05
- [ ] 7.7 `DateInput` picker: opens on today from `useNow()`, `min` / `max`; tests with a foreign device time zone and a wrong device date (point-barber) — AD-FORM-15, D-PLT-15, CG-TIME-06
- [ ] 7.8 `packages/ui/src/status/status-map.ts` (71 pairs, derived states, 18 flags, default icon per tone, lock and "lock + sent" overrides) with the unit test against AD-CMP-05 (point-barber) — AD-CMP-05, AD-CMP-06, AD-IMPL-04
- [ ] 7.9 `StatusBadge` (tone styles that pass axe in both trees — outline style for the muted tone, and for the danger tone on the site; icon + text always); tests (point-barber) — AD-CMP-05, AD-A11Y-03, FE-VIS-01a
- [ ] 7.10 `FlagChip` (tone, icon, label, name and count parameters); tests (point-barber) — AD-CMP-06, AD-A11Y-03
- [ ] 7.11 `EmployeeChip` (photo or initials, name always visible, optional branch, optional profile action); tests (point-barber) — AD-CMP-09, AD-VIS-12
- [ ] 7.12 `ReasonDialog` master and preset sources: radio group for 7 reasons, searchable list for 8; tests (point-barber) — AD-RSN-01, AD-RSN-02, AD-FORM-14
- [ ] 7.13 `ReasonDialog` free text, note rules (`requires_note`, preset `requiresNote`), the generic `ReasonResult`, "Keep" / Esc; tests for the spec scenarios (point-barber) — AD-RSN-01, AD-RSN-02, API-DATA-11
- [ ] 7.14 `ConfirmDialog`: required title / consequence / verb, irreversible sentence, destructive style, single call while pending; tests and type tests (point-barber) — AD-CONF-01, AD-CONF-02, AD-NET-01
- [ ] 7.15 `DataTable` core on TanStack Table: sticky header, `<th scope>`, row height 48 / 56 px, column kinds (money, qty, date, time, status), unit in the header; tests (point-barber) — AD-CMP-07, AD-FMT-01, AD-A11Y-07
- [ ] 7.16 `DataTable` sorting, totals row from `totals`, selected row; tests (point-barber) — AD-CMP-07
- [ ] 7.17 `DataTable` "Columns" menu stored per user on the device and the 7-column default at 768–1023 px; tests with two user ids (point-barber) — AD-LIST-06
- [ ] 7.18 `CardList` (a tuple of at most 4 fields, one inline action), the switch from table to cards at 768 px, skeleton rows; tests at 767 / 768 px (point-barber) — AD-LIST-02, AD-LAY-03, AD-STATE-01
- [ ] 7.19 `FilterBar` search, status chips, active-filter chips, "Clear all", address sync; tests (point-barber) — AD-LIST-01
- [ ] 7.20 `FilterBar` date presets (today from `useNow()`) and the custom range with `min = from`; tests incl. the midnight boundary (point-barber) — AD-LIST-01, AD-FMT-11
- [ ] 7.21 `usePagedList` and `Pagination`: cursor stack, sizes 25 / 50 / 100, total only when given, reset on filter change; tests with the 56-row fixture (point-barber) — AD-LIST-05, API-DATA-08, API-LIM-03
- [ ] 7.22 `EmptyState` and `ErrorState` (code → key, params, unknown code, error ID, Retry only with a handler); tests (point-barber) — AD-STATE-02, AD-STATE-03, AD-STATE-04, API-ERR-01
- [ ] 7.23 `LockBanner` and the read-only form mode (values as text); tests (point-barber) — AD-DET-03, AD-STATE-06
- [ ] 7.24 `OfflineBanner` (browser offline event + `apiUnreachable`, inputs keep their values); tests (point-barber) — AD-STATE-05, D-VIS-13
- [ ] 7.25 `Stepper` (row with connectors from 768 px, compact text + progress bar below, completed steps pressable); tests (point-barber) — AD-CMP-12, AD-WIZ-01
- [ ] 7.26 `KpiTile` and the six-per-row KPI row; tests with 6 and 7 tiles (point-barber) — AD-DSH-02, AD-DSH-03
- [ ] 7.27 `BarChart` and `LineChart` drawing on Recharts: chart tokens, value labels, money axis, 6 series drawn and a 7th refused; tests (point-barber) — AD-CHART-01
- [ ] 7.28 Chart "Show as table" view and the ranked list below 768 px; tests (point-barber) — AD-CHART-01, AD-A11Y-07
- [ ] 7.29 `TimeSlotPicker` (radio group of the given start times, check icon on the choice, loading and empty states); tests (point-barber) — AD-BKG-01
- [ ] 7.30 `OptionPicker` (group chips, sold combinations only, price + duration before "Add", sheet / popover, money profile from the provider); tests (point-barber) — AD-POS-05, FE-BK-06, D-SVC-05, FE-IMPL-03
- [ ] 7.31 `PriceGridEditor` grid: rows × columns for 0–2 groups, branch tabs, Shop / Home tabs, `MoneyInput` + duration cells; tests (point-barber) — AD-CMP-13, D-SVC-05
- [ ] 7.32 `PriceGridEditor` cell semantics (empty Shop cell = `—`, 0 valid, Home placeholder from the shop price), "Copy from branch", "Change prices from" (default tomorrow from `useNow()`), read-only mode; tests (point-barber) — AD-CMP-13, D-SVC-06, D-SVC-08
- [ ] 7.33 `NotificationBell` (badge with the 99+ cap, Today / Earlier groups, relative time, mark all read, delete); tests (point-barber) — AD-NTF-01, AD-FMT-09
- [ ] 7.34 `ApprovalCard` (requester chip, facts, emphasised result, reason, Approve / Reject with a note, decide flag); tests (point-barber) — AD-NTF-04, AD-POS-16
- [ ] 7.35 `QrScanner` shell: full screen, frame, hint, close, mock source, single result; tests with the mock source (point-barber) — AD-ATT-01, AD-QA-03
- [ ] 7.36 `QrScanner` camera source through `barcode-detector`, with the permission-denied and no-camera states; tests with a stubbed `getUserMedia` (point-barber) — AD-ATT-01
- [ ] 7.37 `ReceiptRenderer` (order of AD-RCPT-01, root `lang="en"`, `description_en` with `description_mm` fallback, masked phone as given); tests (point-barber) — AD-RCPT-01, D-PAY-06
- [ ] 7.38 `AttachmentUploader` checks: types and limit text per purpose, size and type pre-check with the byte boundary, file list, remove; tests with a fake upload function (point-barber) — AD-FORM-16, API-LIM-03
- [ ] 7.39 `AttachmentUploader` input paths: drag-and-drop, camera / gallery input, progress bar, busy state; tests (point-barber) — AD-FORM-16
- [ ] 7.40 `GrantsProvider` and `PermissionGate` (hide, fallback, `blocked` as disabled-with-reason or hidden); tests with the four personas (point-barber) — AD-PERM-02, AD-PERM-03, AD-PERM-05

## 8. Shell

- [ ] 8.1 `AppShell` from 768 px: icon rail with visible labels and tooltips; sub-navigation panel from 1024 px (collapsible) (point-barber) — AD-LAY-01, AD-LAY-02, AD-VIS-10, AD-VIS-11
- [ ] 8.2 `AppShell` top bar with slots in the order branch switcher · title · search · bell · language · user menu; content padding 24 px (point-barber) — AD-LAY-01, AD-VIS-07
- [ ] 8.3 `AppShell` below 768 px: top app bar, content gutter 16 px; breakpoint tests at 767 / 768 / 1023 / 1024 px (point-barber) — AD-LAY-03, AD-VIS-10, AD-VIS-07
- [ ] 8.4 `BottomNav` (a tuple of at most 5 items, labels, filled centre action, badges, 4-item form without a centre); tests and the type test for a 6th item (point-barber) — AD-NAV-01, AD-LAY-03
- [ ] 8.5 `BranchSwitcher` (in-scope branches, "All branches" by flag, `?branch=<code>` sync, choice stored per user on the device); tests with Ma Hnin and U Kyaw Zin (point-barber) — AD-NAV-04, AD-PERM-04, D-DSH-01
- [ ] 8.6 `PageHeader` (title, subtitle, one primary, two secondary + menu, filter bar slot); tests with 2 and 4 secondary actions (point-barber) — AD-LAY-05, AD-LAY-04

## 9. Catalogue demos

- [ ] 9.1 `manifest.ts` (38 AD-IMPL-02 names + 7 supporting names = 45 entries) and its completeness test; replace the frame's plain links by `LanguageSwitch` and `Button` controls (point-barber) — AD-IMPL-02, AD-IMPL-06
- [ ] 9.2 Demos (with their `devui` keys in both languages): buttons, form field with the fake server errors (point-barber) — AD-QA-01
- [ ] 9.3 Demos: `MoneyInput`, `PhoneInput`, `BilingualInput`, `DateInput`, `AttachmentUploader` (point-barber) — AD-QA-01
- [ ] 9.4 Demos: badges, flags, employee chips, `DataText` (point-barber) — AD-QA-01
- [ ] 9.5 Demos: `ReasonDialog` (master with 4, 7 and 8 reasons, preset, free with the "request body" panel that maps `note` → `reason`), `ConfirmDialog`, drawer / sheet with the dirty guard and the width cases (point-barber) — AD-QA-01
- [ ] 9.6 Demos: `DataTable` / `CardList` (sales fixture, 9-column case, per-user columns), `FilterBar`, paging (56 rows, null total) (point-barber) — AD-QA-01
- [ ] 9.7 Demos: loading (slow / fast), empty (`booking.create`), error, lock (`closing.reopen`), offline, toast (point-barber) — AD-QA-01
- [ ] 9.8 Demos: permission gate with the four personas (disabled-with-reason and lock-banner variants) (point-barber) — AD-QA-01
- [ ] 9.9 Demos: shell (`AppShell`, `BottomNav`, `BranchSwitcher`, `PageHeader`) (point-barber) — AD-QA-01
- [ ] 9.10 Demos: stepper, KPI row (6 and 7 tiles), charts (3 and 6 series) (point-barber) — AD-QA-01
- [ ] 9.11 Demos: `TimeSlotPicker`, `OptionPicker`, `PriceGridEditor` (point-barber) — AD-QA-01
- [ ] 9.12 Demos: `NotificationBell`, `ApprovalCard`, `QrScanner` (mock and camera), `ReceiptRenderer` (point-barber) — AD-QA-01

## 10. Verification of pull request 2

- [ ] 10.1 Run lint, typecheck, guards, unit and component tests, `pnpm i18n:check`; open pull request 2; CI green and review done (point-barber) — AD-IMPL-05, CG-GIT-02
- [ ] 10.2 Section Buttons and forms: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.3 Section Inputs: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.4 Section Badges and chips: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.5 Section Dialogs and overlays: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.6 Section Lists: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.7 Section States: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.8 Section Permissions: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.9 Section Shell: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.10 Section Charts and KPI: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.11 Section Pickers: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.12 Section Data-less components: walk the component checklist, run the section's catalogue cases in `my` and `en` at 320 and 1280 px, record OK / NG and the "what can be removed?" result in the pull request (point-barber) — AD-QA-01, AD-QA-02
- [ ] 10.13 Fix the NG of sections Buttons and forms to Lists and re-run those cases (point-barber) — AD-QA-01
- [ ] 10.14 Fix the NG of sections States to Data-less components and re-run those cases; then squash-merge pull request 2 (point-barber) — AD-QA-01, CG-GIT-05

## 11. Lint and CI guard rails

- [ ] 11.1 Extend the scaffold's raw-JSX-string rule in `tools/eslint/web.mjs` to the attributes `aria-label`, `placeholder`, `title`, `alt` with the allowed punctuation list; fixtures (point-barber) — AD-L10N-01, AD-IMPL-05
- [ ] 11.2 Extend the colour checks of `tools/eslint/web.mjs` with Tailwind palette classes, `rgb()` / `hsl()` / `oklch()` literals, `style` colours and `fontFamily` in `style`; fixtures (point-barber) — AD-VIS-01, AD-IMPL-05
- [ ] 11.3 Extend `tools/guards/check-css.mjs` (run by `pnpm guards`): colour functions in CSS, allow-list `tokens.css` and its snapshot; fixtures and test (point-barber) — AD-VIS-01, AD-IMPL-05
- [ ] 11.4 Write `point/no-number-money` in `tools/eslint-plugin-point` (names `amount`, `*_amount`, `*Amount`; `Number()`, `parseInt()`, unary `+`, arithmetic) with failing and passing fixtures; enable it for `apps/web` and `packages/*` (point-barber) — AD-IMPL-05, API-DATA-02, CG-MONEY-03
- [ ] 11.5 Add the locale-formatting restriction (`toLocale*String`, `Intl.*Format` outside `packages/shared/src/format`) with fixtures (point-barber) — AD-FMT-00, AD-IMPL-05
- [ ] 11.6 Add the clock and zone restrictions for `apps/web` and `packages/*` (`new Date()` without arguments, `Date.now()`, local-time `Date` getters / setters) with fixtures (point-barber) — D-PLT-15, CG-TIME-03, CG-TIME-04
- [ ] 11.7 Write `point/no-raw-status` (a status member compared with or assigned a number literal) with fixtures; enable it for `apps/web` and `packages/ui` (point-barber) — AD-IMPL-04, D-DB-03
- [ ] 11.8 Add `react/forbid-elements` (`button`, `input`, `select`, `textarea`) and the `@radix-ui/*` import restriction outside `packages/ui`, with fixtures (point-barber) — AD-IMPL-02, CG-UI-04
- [ ] 11.9 Add `eslint-plugin-jsx-a11y` (recommended) for `apps/web` and `packages/ui`; fix the findings in `packages/ui/src/primitives` and `components` (point-barber) — AD-A11Y-01, CG-UI-10
- [ ] 11.10 Add the web data rules: `fetch` in components and hooks, the deny list of second libraries, `@tanstack/eslint-plugin-query`, inline `queryKey`, `onMutate` allow-list; fixtures (point-barber) — CG-UI-03, CG-UI-06, CG-UI-07, CG-UI-08
- [ ] 11.11 Tests then code: guards `check-ui-text-style.mjs` (`uppercase`, `italic`, `tracking-*`, `--decoration` under `packages/ui/src`) and `check-web-globals.mjs` (`navigator.userAgent`, `user-scalable=no`) (point-barber) — AD-VIS-06, FE-VIS-01b, AD-PWA-02, AD-A11Y-05
- [ ] 11.12 Tests then code: guard `check-catalogue-flag.mjs` — the flag name in `.env*`, Dockerfiles, Compose files, `.github/workflows/*`, `next.config.*` or a script other than `dev` / `build:catalogue` fails; `.dockerignore` must exclude `.env*` (point-barber) — AD-IMPL-06
- [ ] 11.13 CI job `catalogue`: `build:catalogue` → `next start` alone with `APP_ORIGIN=http://localhost:3100` and `SITE_ORIGIN=http://127.0.0.1:3100` → Playwright; add the three-zone unit run to the job `unit` (point-barber) — AD-IMPL-06, AD-QA-01, CG-TIME-04
- [ ] 11.14 Playwright projects: `my-320`, `en-320`, `my-1280`, `en-1280`; `my-360`, `en-360`, `my-768`, `en-768` (layout spec only); foreign time zone with a wrong device date; reduced motion; 640 px at device scale factor 2 (point-barber) — AD-QA-01, AD-A11Y-05
- [ ] 11.15 Spec: section smoke, page scroll width = viewport width, no hidden-overflow element wider than its box (point-barber) — AD-QA-01, AD-L10N-04
- [ ] 11.16 Spec: touch targets ≥ 44 px with 8 px gaps at 320 px, and the same check in the zoom project (point-barber) — AD-A11Y-05, AD-VIS-07
- [ ] 11.17 Spec: shell breakpoints 767 / 768 / 1023 / 1024 and the layout-changing components at 360 and 768 px (point-barber) — AD-VIS-10, AD-QA-01
- [ ] 11.18 Spec: no `/api` request while the catalogue loads, 404 on the site host, font requests same-origin, loaded `FontFace` for Pyidaungsu (point-barber) — AD-IMPL-06, AD-VIS-05
- [ ] 11.19 Spec: language switch keeps client state; drawer address key and Back button (point-barber) — AD-L10N-06, AD-NAV-06
- [ ] 11.20 Spec: offline banner; picker and "Today" preset on a device with a foreign zone and a wrong date; computed text style with `lang=my` (point-barber) — AD-STATE-05, D-PLT-15, AD-VIS-06
- [ ] 11.21 Spec: the focus outline is 2 px and equals `--foreground` with `theme=staff` and the site `--ring` with `theme=site`; the input border equals `--muted-foreground` (staff) and the site `--input`; unit test that no component style refers to `--ring` or `--input` directly (point-barber) — AD-VIS-03, AD-A11Y-02, AD-VIS-04, FE-VIS-01a
- [ ] 11.22 axe spec on the catalogue (staff and site themes, four projects, WCAG 2.1 A / AA tags) and the negative case (a demo input without its label) (point-barber) — AD-A11Y-01, AD-IMPL-05
- [ ] 11.23 Fix the axe findings of sections Tokens to Dialogs and overlays; a finding that does not fit the time box is added to this file as its own task before the pull request (point-barber) — AD-A11Y-01
- [ ] 11.24 Fix the axe findings of sections Lists to Data-less components, same rule (point-barber) — AD-A11Y-01
- [ ] 11.25 Add one spec to the scaffold's e2e job (stack built from the production images): `/dev/ui` answers 404 on the staff host (point-barber) — AD-IMPL-06

## 12. Verification of pull request 3, test workbook and archive

- [ ] 12.1 Run `pnpm lint`, `pnpm typecheck`, `pnpm guards`, unit and component tests and the Playwright suite (no integration suite in this change — nothing touches PostgreSQL); open pull request 3; CI green and review done; the pull request stays open (point-barber) — AD-IMPL-05, CG-GIT-02, CG-GIT-05
- [ ] 12.2 Run `/point-generate-tests add-shared-ui-components` and review the workbook part for tokens, fonts, formatters, clock and language requirements (point-sdd) — AD-QA-01, D-PLT-20
- [ ] 12.3 Review the workbook part for buttons, forms, inputs, badges, dialogs and overlays (point-sdd) — AD-QA-01
- [ ] 12.4 Review the workbook part for lists, states, permissions, shell, charts, pickers and data-less components (point-sdd) — AD-QA-01
- [ ] 12.5 Review the workbook part for the guard-rail, catalogue and checklist requirements (point-sdd) — AD-QA-01
- [ ] 12.6 Run the workbook parts of 12.2 and 12.3 on the catalogue test build of the pull request branch with the browser tester; rows proven by unit tests are recorded with the test name (point-sdd) — AD-QA-01
- [ ] 12.7 Run the workbook parts of 12.4 and 12.5 (browser rows on the catalogue test build; lint and guard rows by running the command on the fixture) (point-sdd) — AD-QA-01
- [ ] 12.8 Manual check on one Android phone: Myanmar test strings, the four test widths, focus outline and input borders, `QrScanner` with the real camera, 200 % zoom (point-barber) — AD-VIS-05, AD-A11Y-05, AD-ATT-01
- [ ] 12.9 The same manual check on one iPhone (Safari) (point-barber) — AD-VIS-05, AD-A11Y-05, AD-ATT-01
- [ ] 12.10 Compare the site block of `tokens.css` with FE-VIS-01a (v1.7) of the website guideline — 24 tokens, value by value — and the catalogue fixtures with `docs/plan/spec-fixtures.md` §8; report any difference in the pull request (point-barber) — D-UX-02, FE-VIS-01a
- [ ] 12.11 Fix the NG rows of 12.6–12.9 as commits on the branch, re-run them, then squash-merge pull request 3 (point-barber) — AD-QA-01, CG-GIT-05
- [ ] 12.12 After the merge, with no open NG in the workbook: archive the change (point-sdd) — D-PLT-17
