# Brief: add-shared-ui-components

> Normative text = `openspec/changes/add-shared-ui-components/specs/ui-foundation/spec.md` (77 requirements,
> 239 scenarios). This brief is the readable overview for the developer and the tester.
> Owner: **Dev 1** · Depends on: `add-repo-scaffold` · Parallel with: `add-foundation-auth-access` ·
> Repo: `point-barber` (code), `point-sdd` (spec, workbook).
> **Ready to apply** — the owner answered every open item on 02/Oct/2026 13:08 (review §0.11).

## Goal

Screen တွေ မဆောက်ခင် developer ၂ ယောက်လုံး သုံးမယ့် အခြေခံကို တစ်ခါတည်း ဆောက်ဖို့ — token ဖိုင်၊ formatter၊ ဘာသာစကားဖိုင်၊
shared component ၃၇ မျိုး + `can()` (owner ပြောတဲ့ ~၃၅)၊ စစ်ဆေးဖို့ `/dev/ui` စာမျက်နှာ။

Build, once and before any feature screen, the parts every screen reuses: one design-token file, one
formatter module, the `my` / `en` language files, the shared components of AD-IMPL-02 with the app shell, and
the lint / CI checks that keep later screens consistent. Everything is shown and tested on the
development-only page `/dev/ui`, without login and without the API.

## Decisions

- Implements: D-UI-01 · D-UX-01..05 · D-PLT-03 · D-PLT-04 · D-PLT-05 · D-PLT-15 · D-DB-03 · D-DB-04 · D-CUS-02 ·
  D-ROLE-08 · D-ENG-01 · AD-VIS-01..12 · AD-FMT-00..11 · AD-L10N-01..07 · AD-FORM-01..05 / 08..11 / 13..16 ·
  AD-RSN-01/02 · AD-CONF-01/02 · AD-STATE-01..06 · AD-CMP-01 / 05..09 / 12 / 13 · AD-PERM-01..05 ·
  AD-A11Y-01..07 · AD-IMPL-01..06 · AD-QA-01/02 · FE-VIS-01 / 01a / 01b / 02 · FE-META-06 · FE-FMT-01 ·
  FE-CMP-06 · FE-BK-06 · API-DATA-02..06 / 08 / 11 · API-ERR-01 · API-AUTH-05 · ADR-001 · ADR-012.
- Owner decisions of 02/Oct/2026 used here: website palette `#EEEEEE` / `#000000` / `#DC5F00` (buttons black
  with white text; orange for decoration, large headings and icons only); admin palette not given → shadcn/ui
  `neutral` stays; component catalogue = `/dev/ui` page, not Storybook.
- Owner answers of 02/Oct/2026 13:08 used here: S2 the change stays whole, three pull requests · S3
  `ui-foundation` approved · S5 field codes = Zod issue names (API-ERR-03) · S8 `ReasonDialog` returns the
  generic result, the screen maps it (API-DATA-11) · S15 staff focus outline = `--foreground`, staff input
  border = `--muted-foreground` (AD-VIS-03) · S18 the texts below are used.
- Owner approval of 02/Oct/2026 13:46: **REC-41 ✅** — the remaining website colour tokens are locked
  (FE-VIS-01a v1.7) and are part of this change.
- New (proposed): none. Readings and implementation choices are in `design.md` (D1–D14) and in the proposal's
  "Recorded readings".

## Actors & permissions

- **Developer (Dev 1)** — builds this change end to end; no permission code.
- **Tester / owner** — opens `/dev/ui` on the development server or the catalogue test build; **no login, no
  permission code**.
- **Fixture personas on the catalogue** (`?as=`) — used only to show permission-dependent components; a demo
  decides by `can()`, never by the persona name:

| Persona | Fixture grants (`code` · `scope_type` · branches) | Shows |
| --- | --- | --- |
| `admin` — U Kyaw Zin | `booking.create`, `booking.delete`, `closing.reopen`, `service.update`, `role.update`, `customer.update`, `payroll.view` · 1 COMPANY | everything visible; "All branches"; "Reopen day" |
| `manager` — Ma Hnin | `booking.create`, `booking.delete`, `service.update`, `customer.update` · 2 BRANCHES · [B3] | B3 only; "New booking" shown; no "Reopen day"; company-level write hidden |
| `barber` — Ko Aung | none; own-earnings flag off | gated actions absent |
| `branch-holder` — unnamed | `role.update`, `payroll.view` · 2 BRANCHES · [B3] | a company code at branch scope is read-only; a private code at branch scope gives nothing |

  The real grants come from `/me` (P1.ME.01) — wired by `add-foundation-auth-access`.

## Flow

1. **Tokens and fonts** — `packages/ui/tokens.css`: staff = neutral values unchanged; site block = the 24
   colour tokens of FE-VIS-01a (v1.7 — REC-41 ✅); type scale, spacing, radius, motion;
   self-hosted WOFF2 fonts with licences.
2. **Formatters** (`packages/shared`, tests first) — money, date, time, duration, percent, quantity, relative
   time, phone, digits, Myanmar-Time helpers (zone `Asia/Yangon`), money parser.
3. **Language files** (`packages/i18n`) — `common`, `status`, `error`, `reason`, `devui` in `my` and `en`;
   typed keys; `pnpm i18n:check`; language resolution.
4. **Catalogue frame** — `/dev/ui` with the clock, the fixtures and the sections Tokens, Fonts, Formatters.
5. **Pull request 1** — CI green + review, its catalogue cases run, NG fixed → merge.
6. **Primitives** — `Button`, `FormField`, form binding, `DataText`, `LanguageSwitch`, dialogs / sheets /
   drawers, skeleton, toast.
7. **Composite components** — inputs, badges and chips, reason and confirm dialogs, table / cards / filters /
   paging, states, charts and KPI, pickers, the presentational components.
8. **Shell** — `AppShell`, `BottomNav`, `BranchSwitcher`, `PageHeader`.
9. **Catalogue demos** — every component, parameters `lang`, `theme`, `as`, `now`.
10. **Pull request 2** — same as step 5, with the component checklist and the catalogue cases per section.
11. **Guard rails** — lint rules, guards, Playwright + axe in the CI job `catalogue`.
12. **Pull request 3** — stays open while the test workbook of the whole change is generated and run on its
    branch; NG fixed as commits → merge → archive.

No status changes: this change has no business record.

## Rules

R1. All colours, fonts, sizes, spacing, radii and motion values come from `packages/ui/tokens.css` only.
R2. Staff-tree colour tokens equal the shadcn/ui `neutral` values unchanged; tokens neutral lacks are aliases
    of neutral tokens.
R3. The site tree has exactly the 24 colour tokens of FE-VIS-01a (v1.7): `--background #EEEEEE`,
    `--foreground #000000`, `--decoration #DC5F00`, `--primary #000000` / `--primary-foreground #FFFFFF`,
    `--ring #000000`, `--card #FFFFFF` / `#000000`, `--muted #E0E0E0` / `--muted-foreground #555555`,
    `--border #C4C4C4`, `--input #707070`, `--secondary #FFFFFF` / `#000000`, `--accent #E0E0E0` / `#000000`,
    `--destructive #C8281B`, `--success #0E4A28`, `--warning #6A3A00`, `--info #0B5CAD`, each with the
    foreground `#FFFFFF`.
R4. `--decoration` is used only for decoration, icons and headings ≥ 24 px regular / 19 px bold, only on the
    background or a card (never on `--muted` / `--accent`), and never by a shared component.
R5. The catalogue shows the contrast ratio of every token pair and marks the ones below their limit.
R5a. The focus outline is 2 px and input borders are drawn through two variables: staff tree =
     `--foreground` / `--muted-foreground` (admin palette pending — the staff `--ring` and `--input` keep their
     neutral values); site tree = `--ring` (`#000000`) / `--input` (`#707070`).
R6. Fonts are served as WOFF2 from our own origin, each family with its licence file; `--font-myanmar` is
    `'Pyidaungsu'`.
R7. Myanmar text uses the Myanmar line-heights (16 px text → 28 px) whatever the UI language is, and is never
    clipped, upper-cased, italic or letter-spaced.
R8. Money shows as `7,000 Ks` (app EN), `7,000 ကျပ်` (app MM), `7,000 Ks` (site, both languages).
R9. Money in code is the type `Mmk` (whole-MMK `bigint`); a plain number is not money; `parseFloat` and number
    arithmetic on amounts fail lint.
R10. Dates show as `05/Oct/2026`, times as `2:30 PM`, both in Myanmar Time whatever the device time zone is.
R11. "Today" and "now" come from the supplied clock (server time), not from the device date.
R12. Displayed digits are 0–9 in both languages; typed ၀–၉ are converted.
R13. Percentages show at most 2 decimals, rounded half up.
R14. Phone numbers normalise to E.164 (`09 7712 3456` → `+95977123456`) and display in local grouping.
R15. Every visible string comes from the `my` / `en` language files — catalogue demo labels included; a key
     missing in either language fails CI.
R16. The language is the account's `ui_language`; when that is empty, the system default language (setting
     `system.default_language`, default Myanmar). The cookie `point_locale` is used only before a session
     exists and is rewritten after `/me`.
R17. Switching the language does not reload the page or lose typed values.
R18. In the English UI a bilingual field shows `*_en`, or `*_mm` when the English value is empty.
R19. An API error is shown by its `code` through `error.<code>`; the developer text `detail` is never shown.
R19a. A field error from the server uses the schema's catalogue code or the issue name `too_small` /
      `too_big` / `invalid_type`; a missing value is shown as `error.required`.
R20. A required field has a red asterisk after its label; an invalid field has a red outline and its message
     directly under it.
R21. The submit button stays enabled while a form is invalid and is disabled only while submitting.
R22. A status badge takes tone, icon and label from the one status map; every badge has an icon and a text.
R23. A reason-required action uses `ReasonDialog`; the note is required when the chosen reason requires it;
     up to 7 reasons are a radio group, 8 or more a searchable list; the dialog returns
     `{ reason_id?, reason_code?, note? }` and the screen maps it to its endpoint's reason field.
R24. A confirm dialog names the action, states the consequence and repeats the verb on its button.
R25. A list is a table from 768 px and a card list (at most 4 fields) below; the page never scrolls sideways.
R26. Lists page by cursor: 25 rows by default, never more than 100, no next page when `next_cursor` is null.
R27. Loads over 400 ms show a skeleton; there is no blank page with a centred spinner.
R28. A control the user may never use is hidden; a control blocked by the record's state is hidden under a
     lock banner or shown disabled with the reason.
R29. The shell is mobile below 768 px, tablet from 768 to 1023 px, desktop from 1024 px.
R30. The bottom navigation has at most 5 items, each with a visible label.
R31. The branch switcher lists only branches in the user's scope and remembers the choice per user on the
     device.
R32. `/dev/ui` exists only on the development server and in the catalogue test build; the flag that enables it
     is in no environment file, Dockerfile, Compose file or workflow; it needs no login and calls no API.
R33. Every interactive target is at least 44 × 44 px and reachable by keyboard with a visible focus outline.
R34. The axe check on `/dev/ui` reports 0 WCAG 2.1 A / AA violations.
R35. Raw `<button>`, `<input>`, `<select>`, `<textarea>` and Radix primitives are used only inside
     `packages/ui`.

## Scenarios

### Scenario 1: Money in three places
- WHEN 7,000 is formatted for the staff app in English, the staff app in Myanmar and the website in Myanmar
- THEN the texts are `7,000 Ks`, `7,000 ကျပ်` and `7,000 Ks`

### Scenario 2: Midnight on a phone set to another time zone
- WHEN the phone's time zone is America/Los_Angeles and the instants `2026-10-05T17:29:00Z` and
  `2026-10-05T17:30:00Z` are shown
- THEN the screen shows `05/Oct/2026 11:59 PM` and `06/Oct/2026 12:00 AM` (UTC + 6:30)

### Scenario 3: A phone with a wrong date
- WHEN the device clock says 01/Jan/2020 and the supplied clock says Monday 05/Oct/2026 10:42 AM
- THEN the date picker opens on 5 October 2026 and "Today" filters `2026-10-05`

### Scenario 4: Ma Su's phone typed in Myanmar digits
- WHEN `၀၉ ၇၇၁၂ ၃၄၅၆` is typed in `PhoneInput`
- THEN the field shows `09 7712 3456` and the value is `+95977123456`

### Scenario 5: Language of a new user on a shared phone
- WHEN a user whose account has no language signs in on a phone whose cookie says English, and the system
  default is Myanmar
- THEN the app is in Myanmar and the cookie becomes `my`

### Scenario 6: Required field
- WHEN the required field "Name" is left empty
- THEN `error.required` ("This field is required.") appears under the field with a red outline

### Scenario 7: Cancel booking with the reason "Other"
- WHEN Ma Hnin chooses "Other" for Ma Su's booking and leaves the note empty
- THEN `error.reason_required` appears and the dialog stays open; with the note `wrong phone` it returns the
  reason id and the note

### Scenario 8: Sales list on a laptop and on a phone
- WHEN the four B3 sales of 05/Oct/2026 (8,000 · 10,000 · 11,000 · 15,000) are listed
- THEN at 1280 px a table shows them with the total `44,000` (8,000 + 10,000 + 11,000 + 15,000); at 320 px
  four cards show them and nothing scrolls sideways

### Scenario 9: Manager outside her branch
- WHEN Ma Hnin (branch scope B3) is checked for `booking.delete` at B1
- THEN `can()` is false and the "Cancel booking" button is not in the page

### Scenario 10: The catalogue is not in production
- WHEN `/dev/ui` is requested on the stack built from the production images
- THEN the answer is 404

### Scenario 11: Website colours
- WHEN `/dev/ui?theme=site` is opened
- THEN the background is `#EEEEEE`, text is `#000000`, cards are white, the primary button is black with white
  text, the focus outline is 2 px black (`--ring`, 18.10 : 1), input borders are `#707070` (4.27 : 1), error
  text is `#C8281B` (4.79 : 1) and muted text `#555555` (6.43 : 1); the contrast table has no failing row and
  marks orange as "large text and icons only" (3.19 : 1 on the background, 3.70 : 1 on a card) and "not
  allowed" on `--muted` / `--accent` (2.80 : 1)

### Scenario 12: Status colour on the site and in the staff app
- WHEN the badge of a FINISHED sale (tone success) is shown with `theme=site` and with `theme=staff`
- THEN on the site its text is `#0E4A28`; in the staff app it has the neutral text colour — in both it shows
  its icon and its label

## Screens / Form fields

**Screen:** `/dev/ui` (staff tree; development server and catalogue test build). Controls at the top: language
(MM / EN), theme (staff / site), persona (admin / manager / barber / branch-holder), clock. Sections (14):
Tokens · Fonts · Formatters · Buttons and forms · Inputs · Badges and chips · Dialogs and overlays · Lists ·
States · Permissions · Shell · Charts and KPI · Pickers · Data-less components.

**Shared input components** (the building blocks of every later form):

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| `MoneyInput` | whole MMK, numeric keypad | set by the form | digits 0–9 / ၀–၉ with comma or space separators; decimal-point and minus keys ignored; pasted decimal refused; optional `max` | empty (`null`) | `error.amount_invalid` · `error.required` |
| `PhoneInput` | phone, tel keypad | set by the form | `09…`, `+959…`, `959…`, spaces, dashes; result matches `^\+[1-9][0-9]{6,14}$` | empty · placeholder `09 xxx xxx xxx` | `error.phone_invalid` · `error.required` |
| `BilingualInput` — Myanmar | text | ✔ | not empty; Zawgyi converted to Unicode | empty | `error.required` |
| `BilingualInput` — English | text | ✖ | – (empty → stored as null, Myanmar text shown) | empty | – |
| `DateInput` | date `DD/MMM/YYYY` | set by the form | typed `DD/MM/YYYY` or `DD/MMM/YYYY`; real calendar date; optional `min` / `max` | empty; picker opens on today (supplied clock, MMT) | `error.date_invalid` · `error.required` |
| `AttachmentUploader` | file(s) | set by the form | type allowed for the purpose (image: JPEG, PNG, WebP, HEIC · document: + PDF · import: CSV, XLSX); size ≤ limit (default 10 MB = 10,485,760 bytes) | none | `error.file_type_not_allowed` · `error.file_too_large` |

**`ReasonDialog`:**

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Reason (master list) | radio group (≤ 7) or searchable list (≥ 8) | ✔ | one option chosen | none chosen | `error.reason_required` |
| Reason (preset codes) | radio group | ✔ | one code chosen | none chosen | `error.reason_required` |
| Reason (free text) | text | ✔ | not empty; Zawgyi converted | empty | `error.reason_required` |
| Note | text | ✔ when the chosen reason requires a note; else ✖ | not empty when required | empty | `error.reason_required` |

**Catalogue demo form "Customer"** (shows D-UI-01 behaviour):

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Name | text | ✔ | not empty; the fake server answers `too_big` (maximum 100) and `too_small` (minimum 2; empty → required) | empty | `error.required` · `error.too_big` · `error.too_small` |
| Phone | `PhoneInput` | ✔ | E.164 after normalisation | empty | `error.required` · `error.phone_invalid` |
| Amount | `MoneyInput` | ✖ | whole MMK; the fake server answers `invalid_type` | empty | `error.amount_invalid` · `error.invalid_type` |
| Note | text | ✖ | – | empty | – |

**`FilterBar` and paging:**

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Search | text | ✖ | trimmed | empty | – |
| Date range | preset or two `DateInput`s | ✖ | Myanmar business dates; the end date cannot be before the start date (`to` has `min = from`) | none (the screen sets its preset) | `error.date_invalid` (typed date that does not exist) |
| Status | multi-select chips | ✖ | codes of the given table | none | – |
| Page size | choice 25 / 50 / 100 (from 1024 px) | ✔ | one of the three | 25 | – |

**`PriceGridEditor`:**

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Cell price | `MoneyInput` | ✖ | whole MMK; 0 allowed; empty = not sold (Shop) / uses shop price (Home) | empty | `error.amount_invalid` |
| Cell duration | number (minutes) | ✖ | whole minutes, digits only | empty; placeholder = service default | `error.invalid_type` |
| Change prices from | `DateInput` | ✔ | real date | tomorrow (supplied clock, MMT) | `error.date_invalid` |

**Buttons**

| Button | What happens | Disabled when |
| --- | --- | --- |
| Primary / secondary / ghost / destructive `Button` | runs its action once; shows a spinner inside while it runs | while its action runs |
| Form submit | validates; on errors shows them and focuses the first invalid field | only while submitting or while an upload runs |
| `ReasonDialog` confirm (verb, e.g. "Cancel booking") | returns `{ reason_id / reason_code / note }` | while its action runs |
| `ReasonDialog` "Keep" / "Go back", Esc | closes without a result | – |
| `ConfirmDialog` confirm (verb, e.g. "Send transfer") | calls the handler once | while its action runs |
| Drawer close / Esc / Back | closes; asks "Discard changes?" when the form was edited | – |
| `LanguageSwitch` | changes all text, sets `point_locale` | – |
| Pagination Next / Previous | loads the next cursor / returns to the previous page | Next: when `next_cursor` is null |

**Permission** — the catalogue itself needs none. Gated demos follow the persona table above: never-allowed →
hidden; allowed but blocked by state → hidden under the lock banner, or disabled with the reason.

**List screen (the `DataTable` demo "Sales")** — columns: Receipt no. · Finished on (sortable) · Barber ·
Services · Amount (Ks) · Status; no default sort in the demo (the first press on "Finished on" gives
`-finished_at`, the second `finished_at`); filters: search (receipt number), date presets, status; totals row
for Amount; cards on phones with receipt no., barber, amount, status; the "Columns" choice is stored per user.

**After save** — demos stay on the catalogue; a success toast (4 s) confirms; nothing is stored.

## Texts (accepted by the owner on 02/Oct/2026 — S18)

These are the texts the language files are written with. Texts marked with a source ID come from a UX
guideline; the ones marked "proposal" were written for this change and accepted by the owner as they stand —
**the owner corrects wording here or in the pull request**; keys and behaviour do not depend on it. `devui.*`
demo labels are tool texts and are not listed.

**`error.*`**

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `error.required` | This field is required. | ဒီအကွက်ကို ဖြည့်ပါ။ | proposal |
| `error.date_invalid` | Enter a valid date, for example 05/Oct/2026. | ရက်စွဲ မှန်အောင် ထည့်ပါ — ဥပမာ 05/Oct/2026။ | proposal |
| `error.phone_invalid` | Enter a valid phone number. | ဖုန်းနံပါတ် မှန်အောင် ထည့်ပါ။ | proposal |
| `error.amount_invalid` | Enter a whole amount in kyats. | ကျပ်ပမာဏကို ဒသမမပါဘဲ ထည့်ပါ။ | proposal |
| `error.reason_required` | Enter a reason. | အကြောင်းပြချက် ထည့်ပါ။ | proposal |
| `error.file_too_large` | The file is larger than {max_mb} MB. | ဖိုင်က {max_mb} MB ထက် ကြီးနေပါတယ်။ | proposal |
| `error.file_type_not_allowed` | This file type is not allowed. Allowed: {allowed}. | ဒီဖိုင်အမျိုးအစား မရပါ။ ရတာ: {allowed}။ | proposal |
| `error.too_small` | This value is too short or too small — minimum {minimum}. | တိုလွန်း / နည်းလွန်းပါတယ် — အနည်းဆုံး {minimum}။ | proposal · code: API-ERR-03 |
| `error.too_big` | This value is too long or too large — maximum {maximum}. | ရှည်လွန်း / များလွန်းပါတယ် — အများဆုံး {maximum}။ | proposal · code: API-ERR-03 |
| `error.invalid_type` | This value has the wrong format. | ထည့်ထားတဲ့ ပုံစံ မမှန်ပါ။ | proposal · code: API-ERR-03 |
| `error.validation` | Check the marked fields. | အမှတ်ပြထားတဲ့ အကွက်တွေကို စစ်ပါ။ | proposal |
| `error.forbidden` | You don't have access to this page. Ask an admin if you need it. | ဒီစာမျက်နှာကို ကြည့်ခွင့် မရှိပါ။ လိုအပ်ရင် admin ကို ပြောပါ။ | EN: AD-STATE-04 · MM proposal |
| `error.not_found` | This item doesn't exist or was archived. | ဒီအရာ မရှိပါ၊ သို့မဟုတ် သိမ်းဆည်းထားပြီး ဖြစ်ပါတယ်။ | EN: AD-STATE-04 · MM proposal |
| `error.internal_error` | Something went wrong on the server. Try again; if it happens again, give the error ID to an admin. | Server ဘက်မှာ အမှားဖြစ်သွားပါတယ်။ ထပ်စမ်းပါ; ထပ်ဖြစ်ရင် အမှား ID ကို admin ကို ပေးပါ။ | proposal · code: API-ERR-02 |
| `error.unknown` | Something went wrong. Try again. | တစ်ခုခု မှားသွားပါတယ်။ ထပ်စမ်းကြည့်ပါ။ | proposal |

**`common.action.*`**

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `save` | Save | သိမ်းမည် | proposal |
| `cancel` | Cancel | မလုပ်တော့ပါ | proposal |
| `close` | Close | ပိတ်မည် | proposal |
| `retry` | Retry | ထပ်ကြိုးစားမည် | proposal |
| `keep` | Keep | ဆက်ထားမည် | EN: AD-RSN-01 · MM proposal |
| `goBack` | Go back | ပြန်သွားမည် | EN: AD-RSN-01 · MM proposal |
| `discard` | Discard | မသိမ်းဘဲ ထွက်မည် | EN: AD-FORM-08 · MM proposal |
| `keepEditing` | Keep editing | ဆက်ပြင်မည် | EN: AD-FORM-08 · MM proposal |
| `clearAll` | Clear all | အားလုံး ရှင်းမည် | EN: AD-LIST-01 · MM proposal |
| `add` | Add | ထည့်မည် | EN: AD-POS-05 · MM proposal |
| `approve` | Approve | ခွင့်ပြုမည် | AD-COPY-05 |
| `reject` | Reject | ငြင်းပယ်မည် | AD-COPY-05 |
| `markAllRead` | Mark all read | အားလုံး ဖတ်ပြီးအဖြစ် မှတ်မည် | EN: AD-NTF-01 · MM proposal |
| `delete` | Delete | ဖျက်မည် | proposal |
| `showAsTable` | Show as table | ဇယားဖြင့် ပြမည် | EN: AD-A11Y-07 · MM proposal |
| `showAsChart` | Show as chart | ပုံဖြင့် ပြမည် | proposal |
| `columns` | Columns | ကော်လံများ | EN: AD-LIST-06 · MM proposal |
| `next` | Next | နောက်စာမျက်နှာ | proposal |
| `previous` | Previous | ယခင်စာမျက်နှာ | proposal |
| `more` | More | နောက်ထပ် | EN: AD-NAV-01 · MM proposal |

**`common.format.*` and `common.date.*`**

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `format.unit.ks` | Ks | Ks | D-PLT-04 |
| `format.unit.kyat` | – (not used in `en`) | ကျပ် | D-PLT-04 |
| `format.unit.lakh` | – (not used in `en`) | သိန်း | AD-FORM-11 |
| `format.min` / `format.hour` | min / h | မိနစ် / နာရီ | AD-FMT-05 |
| `format.pcs` | pcs | ခု | AD-FMT-08 |
| `format.weekday.mon` … `sun` | Mon · Tue · Wed · Thu · Fri · Sat · Sun | တနင်္လာ · အင်္ဂါ · ဗုဒ္ဓဟူး · ကြာသပတေး · သောကြာ · စနေ · တနင်္ဂနွေ | EN + `အင်္ဂါ`: AD-FMT-02 · other MM proposal |
| `format.relative.justNow` | just now | ယခုလေးတင် | EN: AD-FMT-09 · MM proposal |
| `format.relative.minAgo` | {n} min ago | လွန်ခဲ့သော {n} မိနစ် | EN: AD-FMT-09 · MM proposal |
| `format.relative.hourAgo` | {n} h ago | လွန်ခဲ့သော {n} နာရီ | EN: AD-FMT-09 · MM proposal |
| `date.today` / `date.yesterday` | Today / Yesterday | ယနေ့ / မနေ့က | EN: AD-FMT-02 · MM proposal |
| `date.preset.thisWeek` / `last7Days` | This week / Last 7 days | ဒီအပတ် / ပြီးခဲ့သော 7 ရက် | EN: AD-LIST-01 · MM proposal |
| `date.preset.thisMonth` / `lastMonth` / `custom` | This month / Last month / Custom | ဒီလ / ပြီးခဲ့သောလ / ကိုယ်တိုင် ရွေးမည် | EN: AD-LIST-01 · MM proposal |

**`common.*` (single keys)**

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `bilingual.hint` | Leave English empty to show the Myanmar text | English ကွက်လပ်ထားရင် မြန်မာစာကို ပြပါမယ် | EN: AD-FORM-09 · MM proposal |
| `bilingual.mm` / `bilingual.en` | Myanmar / English | မြန်မာ / English | proposal |
| `zawgyi.converted` | Converted from Zawgyi to Unicode. Please check the text. | Zawgyi မှ Unicode သို့ ပြောင်းထားပါတယ်။ စာသားကို စစ်ပေးပါ။ | proposal |
| `confirm.irreversible` | This can't be undone. | ဒါကို ပြန်ပြင်လို့ မရပါ။ | EN: AD-CONF-02 · MM proposal |
| `form.discard.title` | Discard changes? | ပြင်ထားတာတွေ မသိမ်းဘဲ ထွက်မလား? | EN: AD-FORM-08 · MM proposal |
| `offline.banner` | No connection. Money actions can't be saved right now. Write the service on paper and add it later with Late entry. | အင်တာနက် မရပါ။ ငွေနဲ့ဆိုင်တဲ့ လုပ်ဆောင်ချက်တွေ အခု သိမ်းလို့ မရပါ။ ဝန်ဆောင်မှုကို စာရွက်ပေါ် ရေးထားပြီး နောက်မှ "နောက်မှ ထည့်သွင်းခြင်း" နဲ့ ထည့်ပါ။ | EN: AD-STATE-05 · MM proposal |
| `offline.help` | How to add it later | နောက်မှ ဘယ်လို ထည့်မလဲ | proposal |
| `error.id` | Error ID: {id} | အမှား ID: {id} | proposal |
| `slots.empty` | No times left on this day | ဒီနေ့အတွက် အချိန်လွတ် မရှိတော့ပါ | FE-COPY-02 |
| `grid.notSold` | Not sold here | ဒီမှာ မရောင်းပါ | EN: AD-CMP-13 · MM proposal |
| `grid.usesShopPrice` | Uses shop price · {price} | ဆိုင်ဈေးအတိုင်း · {price} | EN: AD-CMP-13 · MM proposal |
| `grid.changeFrom` | Change prices from | ဈေးပြောင်းမည့်ရက် | EN: AD-CMP-13 · MM proposal |
| `grid.copyFromBranch` | Copy from branch… | ဆိုင်ခွဲတစ်ခုမှ ကူးမည်… | EN: AD-CMP-13 · MM proposal |
| `grid.shop` / `grid.home` | Shop / Home | ဆိုင် / အိမ် | EN: AD-CMP-13 · MM proposal |
| `qr.permissionDenied` | Camera access is off. Allow the camera for this site in the browser settings, then try again. | ကင်မရာ သုံးခွင့် ပိတ်ထားပါတယ်။ Browser setting မှာ ဒီ site အတွက် ကင်မရာကို ခွင့်ပြုပြီး ထပ်စမ်းပါ။ | proposal |
| `qr.noCamera` | No camera was found on this device. | ဒီစက်မှာ ကင်မရာ မတွေ့ပါ။ | proposal |
| `upload.hint` | {types} · up to {max_mb} MB | {types} · အများဆုံး {max_mb} MB | proposal |
| `upload.inProgress` | Uploading… wait until it finishes. | တင်နေပါတယ်… ပြီးသည်အထိ စောင့်ပါ။ | proposal |
| `upload.remove` | Remove | ဖယ်မည် | proposal |
| `notifications.today` / `earlier` | Today / Earlier | ယနေ့ / အရင်က | EN: AD-NTF-01 · MM proposal |
| `notifications.empty` | No notifications | အသိပေးချက် မရှိပါ | proposal |
| `branch.all` | All branches | ဆိုင်ခွဲအားလုံး | EN: AD-NAV-04 · MM proposal |
| `stepper.compact` | Step {n} of {m} · {name} | အဆင့် {n} / {m} · {name} | EN: AD-CMP-12 · MM proposal |
| `kpi.updated` | Updated {time} | နောက်ဆုံး update {time} | EN: AD-DSH-02 · MM proposal |
| `list.total` | Total {n} | စုစုပေါင်း {n} | proposal |
| `list.pageSize` | Rows per page | တစ်မျက်နှာ အရေအတွက် | proposal |
| `amountHeader` | Amount ({unit}) | ပမာဏ ({unit}) | EN: AD-FMT-01 · MM proposal |
| `search.placeholder` | Search | ရှာမည် | proposal |

**`status.<table>.<NAME>`** — one text per constant name, used for every table that has it; table-specific
labels below the line.

| Constant | English | Myanmar | Source |
| --- | --- | --- | --- |
| BOOKED | Booked | ချိန်းထားပြီး | proposal |
| STARTED | Started | စတင်ပြီး | proposal |
| COMPLETED | Completed | ပြီးပြီ | proposal |
| FINISHED | Finished | အပြီးသတ်ပြီး | proposal |
| INCOMPLETE | Incomplete | မပြီးဆုံး | proposal |
| CANCELLED | Cancelled | ပယ်ဖျက်ပြီး | EN: AD-CMP-05 · MM proposal |
| OPEN | Open | ဖွင့်ထား | proposal |
| PENDING | Pending | စောင့်ဆိုင်းဆဲ | proposal |
| APPROVED | Approved | ခွင့်ပြုပြီး | proposal |
| REJECTED | Rejected | ငြင်းပယ်ပြီး | proposal |
| DRAFT | Draft | မူကြမ်း | proposal |
| CALCULATED | Calculated | တွက်ပြီး | proposal |
| FINALIZED | Finalized | အပြီးသတ် အတည်ပြုပြီး | proposal |
| PUBLISHED | Published | ထုတ်ပြန်ပြီး | proposal |
| PAID | Paid | ပေးချေပြီး | proposal |
| EXCUSED | Excused | ခွင့်လွှတ်ပြီး | proposal |
| CONFIRMED | Confirmed | အတည်ပြုပြီး | proposal |
| LEAVE | Leave | ခွင့်အဖြစ် ပြောင်းပြီး | proposal |
| VOID | Void | ပယ်ဖျက် (မှား) | proposal |
| POSTED | Posted | စာရင်းသွင်းပြီး | proposal |
| SENT | Sent | ပို့ပြီး | proposal |
| RECEIVED | Received | လက်ခံပြီး | proposal |
| IN_PROGRESS | In progress | လုပ်ဆောင်နေဆဲ | proposal |
| CLOSED | Closed | စာရင်းပိတ်ပြီး | proposal |
| ACTIVE | Active | အသုံးပြုနေ | proposal |
| SETTLED | Settled | ကျေပြီး | proposal |
| INVITED | Invited | ဖိတ်ထားပြီး | proposal |
| DISABLED | Disabled | ပိတ်ထား | proposal |
| INACTIVE | Inactive | အသုံးမပြု | proposal |
| RESIGNED | Resigned | နုတ်ထွက်ပြီး | proposal |
| TERMINATED | Terminated | ရပ်စဲပြီး | proposal |
| UPLOADED | Uploaded | တင်ပြီး | proposal |
| VALIDATED | Validated | စစ်ဆေးပြီး | proposal |
| FAILED | Failed | မအောင်မြင် | proposal |
| VALID | Valid | မှန် | proposal |
| ERROR | Error | အမှား | proposal |
| IMPORTED | Imported | သွင်းပြီး | proposal |
| SKIPPED | Skipped | ကျော်ထား | proposal |
| RUNNING | Running | လုပ်ဆောင်နေ | proposal |
| SUCCESS | Success | အောင်မြင် | proposal |
| — table-specific — | | | |
| `visits.STARTED` | In service | ဝန်ဆောင်မှု ပေးနေဆဲ | EN: AD-CMP-05 · MM proposal |
| `visits.COMPLETED` | Awaiting payment | ငွေရှင်းရန် ကျန် | EN: AD-CMP-05 · MM proposal |
| `stock_transfers.SENT` | In transit | လမ်းတွင် | EN: AD-CMP-05 · MM proposal |
| `employee_receivables.ACTIVE` | Outstanding | ပေးရန် ကျန် | EN: AD-CMP-05 · MM proposal |
| `daily_closings.OPEN_PAST` | Not closed | စာရင်းမပိတ်ရသေး | EN: AD-CMP-05 · MM proposal |
| `payments.VOIDED` | Voided | ပယ်ဖျက်ပြီး | proposal |
| `payments.KBZPAY_UNVERIFIED` / `KBZPAY_VERIFIED` | Unverified / Verified | မစစ်ရသေး / စစ်ပြီး | EN: AD-CMP-05 · MM proposal |
| `cash_outs.OUTSTANDING` / `RETURNED` | Outstanding / Returned | ပြန်ထည့်ရန် ကျန် / ပြန်ထည့်ပြီး | EN: AD-CMP-05 · MM proposal |
| `cash_outs.CONVERTED` | Charged to expense | အသုံးစရိတ်အဖြစ် ပြောင်းပြီး | EN: AD-CMP-05 · MM proposal |
| `expenses.DELETED`, `manual_incomes.DELETED` | Deleted | ဖျက်ပြီး | EN: AD-CMP-05 · MM proposal |
| `master.INACTIVE` | Inactive | အသုံးမပြု | proposal |

**`status.flag.*` and `reason.*`**

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `flag.late_entry` | Late entry | နောက်မှ ထည့်သွင်းခြင်း | AD-COPY-05 |
| `flag.proxy_recorded` | Recorded by {name} | မှတ်သွင်းသူ {name} | AD-COPY-05 |
| `flag.home_service` | Home service | အိမ်တိုင်ရာရောက် | EN: AD-CMP-06 · MM proposal |
| `flag.online_booking` | Online booking | Online ချိန်းဆိုမှု | EN: AD-CMP-06 · MM proposal |
| `flag.price_changed` | Price changed | ဈေးပြင်ထား | EN: AD-CMP-06 · MM proposal |
| `flag.discount` | Discount | လျှော့ဈေး | EN: AD-CMP-06 · MM proposal |
| `flag.negative_stock` | Negative stock | လက်ကျန် အနုတ် | EN: AD-CMP-06 · MM proposal |
| `flag.low_stock` | Low stock | လက်ကျန် နည်း | EN: AD-CMP-06 · MM proposal |
| `flag.manual_attendance` | Manual attendance | လက်ဖြင့် မှတ်ထားသော တက်ရောက်မှု | EN: AD-CMP-06 · MM proposal |
| `flag.attendance_late` / `absent` / `early_leave` | Late / Absent / Early leave | နောက်ကျ / ပျက်ကွက် / စောပြန် | EN: AD-CMP-06 · MM proposal |
| `flag.pending_leave` | Pending leave | ခွင့် စောင့်ဆိုင်းဆဲ | EN: AD-CMP-06 · MM proposal |
| `flag.difference_sale` | Difference sale | ကွာခြားငွေ ရောင်းချမှု | EN: AD-CMP-06 · MM proposal |
| `flag.change_returned` | Change returned | ပိုငွေ ပြန်အမ်းပြီး | EN: AD-CMP-06 · MM proposal |
| `flag.transfer_short` / `transfer_over` | Short {n} / Over {n} | လို {n} / ပို {n} | EN: AD-CMP-05 · MM proposal |
| `flag.reopened` | Reopened ×{n} | ပြန်ဖွင့် ×{n} | EN: AD-CMP-05 · MM proposal |
| `reason.INTERNET_OUTAGE` | Internet outage | အင်တာနက် ပြတ် | proposal |
| `reason.POWER_OUTAGE` | Power outage | မီးပြတ် | proposal |
| `reason.PHONE_BROKEN` | Phone broken | ဖုန်းပျက် | proposal |
| `reason.FORGOT` | Forgot | မေ့သွား | proposal |
| `reason.OTHER` | Other | အခြား | proposal |
| `reason.PHONE_UNAVAILABLE` | Phone unavailable | ဖုန်း မသုံးနိုင် | proposal |

## Data

- Tables: **none**. Endpoints: **none**. No migration.
- Shapes mirrored as TypeScript types only: `/me` grants (P1.ME.01), cursor page (API-DATA-08), problem details
  (API-ERR-01), `ReceiptView` (P4.RCP.01), slots (P2.AVL.02), upload purpose (P8.ATT.01), notification item
  (P8.NTF.01).
- Status constants for 19 tables are copied from the DBML notes (`docs/db`) into
  `packages/shared/src/constants/status.ts`; no DBML change.
- Fixtures: `docs/plan/spec-fixtures.md` §1–§5 and §8 (catalogue-only demo rows).

## Edge cases

- Device time zone differs from Myanmar (23:59 / 00:00 MMT, month end); device date wrong (2020).
- Amount above the float-safe range (`9,007,199,254,740,993`), amount 0 vs empty, pasted decimal amount,
  digits typed after an ignored decimal point (`7000` `.` `5` `0` → `700,050`).
- Phone with the minimum (7) and maximum (15) E.164 digits; Myanmar digits; number without a prefix.
- English name missing or blank on bilingual data; Myanmar-script value in the English UI; Zawgyi input.
- Account language empty with an English cookie on a shared phone.
- API error code without a language key; field error from the server; error without a field.
- Double tap on a button or a dialog confirm; closing a drawer with unsaved edits; browser Back with a drawer
  open.
- Internet lost while typing (inputs keep their values; banner shown; nothing is queued).
- Long Myanmar labels at 320 px; 200 % zoom; reduced-motion setting; keyboard-only use.
- Limits: 7 / 8 reasons, 5 / 6 navigation items, 4 / 5 card fields, 6 / 7 chart series, 6 / 7 KPI tiles,
  drawer width 479 / 480 / 640 / 641, 9 table columns on a tablet, 56 rows over three pages, unknown total,
  unread count 99 / 100.
- Camera permission denied and no camera in the scanner; file exactly at the size limit and one byte over.
- Layout exactly at 767 / 768 / 1023 / 1024 px.

## Out of scope

- Feature screens, API calls, realtime, login and session (`add-foundation-auth-access` and the feature changes).
- `permissions.json` and the bound `can()`; saving the language on the account; seeding the clock from `/me`
  (`add-foundation-auth-access`).
- Data for notifications, uploads, QR clock-in, slots, price grids, customer lookup (the feature change that
  first uses each).
- Receipt printing / PDF / PNG (server renderer, ADR-013).
- Website-only components, Motion / GSAP, public-page accessibility and performance gates (website changes).
- Admin colour palette (OPEN-30); logo; dark theme.
- Lighthouse CI, licence allow-list, `knip`, coverage thresholds (`add-ci-guard-rails`).

## Open questions

- None. The owner answered S2, S3, S5, S8, S15 and S18 on 02/Oct/2026 13:08 (review §0.11) and approved REC-41
  on 02/Oct/2026 13:46; the answers are listed in the proposal. Not part of this change and still with the
  owner: the admin palette (OPEN-30).

## Answers to Claude's questions

- (empty — filled at the explore step)
