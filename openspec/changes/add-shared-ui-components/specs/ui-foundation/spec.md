# ui-foundation

## Purpose

The shared front-end base of the Point Barbershop System: one design-token file, one formatter module, the
`my` / `en` language files, the shared components of AD-IMPL-02 with the app shell, the lint / CI guard rails
that keep screens consistent, and the development-only component catalogue `/dev/ui` on which every one of
these rules is checked.

Conventions used by every scenario below:

- "the catalogue" = the page `/dev/ui` of the staff tree. It needs no login and calls no API. Query
  parameters: `lang=my|en`, `theme=staff|site` (default `staff`), `as=admin|manager|barber|branch-holder`
  (fixture grants — U Kyaw Zin / Ma Hnin / Ko Aung / an unnamed demonstration persona) and
  `now=<ISO instant>` (the catalogue clock; default `2026-10-05T10:42:00+06:30`, Monday 05/Oct/2026).
- "unit test" = a Vitest test in `point-barber`; "at 320 px" / "at 1280 px" = viewport width.
- Money values are whole MMK. Where the UX guidelines fix no text, a scenario names the language key and its
  English text; these texts were accepted by the owner on 02/Oct/2026 (review §0.11 S18) and the owner corrects
  wording in the brief or the pull request without changing keys or behaviour.

## ADDED Requirements

### Requirement: One token file — the staff tree keeps the unchanged neutral values (AD-VIS-01 · AD-VIS-03 · AD-META-04 · D-UX-02)

Every colour, font family, type size, spacing step, radius, elevation and motion value SHALL be a CSS variable
defined in exactly one file, `packages/ui/tokens.css`, imported by both the `staff` and the `site` tree and
mapped into the Tailwind theme. In the staff tree every colour token that exists in the shadcn/ui `neutral`
light theme SHALL hold the value the pinned shadcn/ui CLI generates, unchanged. The tokens of admin §3.1 that
have no neutral value SHALL, in the staff tree, be aliases of neutral tokens and never a new colour: `--success`, `--warning`,
`--info` = `var(--foreground)`; `--success-foreground`, `--warning-foreground`, `--info-foreground` =
`var(--background)`; `--success-subtle`, `--warning-subtle`, `--info-subtle`, `--danger-subtle` =
`var(--muted)`; `--destructive-foreground` = `var(--primary-foreground)`; `--chart-6` =
`var(--muted-foreground)`. Only the light theme is defined in V1.

#### Scenario: Neutral values are unchanged
- **WHEN** the unit test compares the staff colour tokens of `packages/ui/tokens.css` with the committed CLI
  output `packages/ui/tokens.neutral.snapshot.css`
- **THEN** every token present in the snapshot has the identical value (with the Tailwind 4 generation:
  `--background` = `oklch(1 0 0)`, `--foreground` = `oklch(0.145 0 0)`, `--primary` = `oklch(0.205 0 0)`,
  `--destructive` = `oklch(0.577 0.245 27.325)`)
- **AND** changing any one of them makes the test fail

#### Scenario: Tokens without a neutral value are aliases
- **WHEN** the catalogue is opened with `theme=staff` and the Tokens section is read
- **THEN** the computed colour of `--success`, `--warning` and `--info` equals the computed colour of
  `--foreground`, and `--success-subtle` equals `--muted`
- **AND** each of these rows carries the note "owner value pending (OPEN-30)"

### Requirement: The site tree carries the website palette of the guideline (D-UX-02 · D-UX-05 · FE-VIS-01 · FE-VIS-01a)

Inside the site-tree scope (`:root[data-tree="site"]`) `packages/ui/tokens.css` SHALL contain exactly these
24 colour declarations: `--background: #EEEEEE` · `--foreground: #000000` · `--decoration: #DC5F00` (site
only) · `--primary: #000000` / `--primary-foreground: #FFFFFF` · `--ring: #000000` · `--card: #FFFFFF` /
`--card-foreground: #000000` · `--muted: #E0E0E0` / `--muted-foreground: #555555` · `--border: #C4C4C4` ·
`--input: #707070` · `--secondary: #FFFFFF` / `--secondary-foreground: #000000` · `--accent: #E0E0E0` /
`--accent-foreground: #000000` · `--destructive: #C8281B` / `--destructive-foreground: #FFFFFF` ·
`--success: #0E4A28` / `--success-foreground: #FFFFFF` · `--warning: #6A3A00` / `--warning-foreground: #FFFFFF`
· `--info: #0B5CAD` / `--info-foreground: #FFFFFF`. A colour token that this list does not name (`--popover`,
`--popover-foreground`, the four `-subtle` aliases, `--chart-1` … `--chart-6`) SHALL keep its staff-tree
declaration.

#### Scenario: Site values on the catalogue
- **WHEN** the catalogue is opened with `theme=site`
- **THEN** `<html>` carries `data-tree="site"`, the page background is `rgb(238, 238, 238)`, body text is
  `rgb(0, 0, 0)`, a card is `rgb(255, 255, 255)` with a border of `rgb(196, 196, 196)`, and a primary `Button`
  has background `rgb(0, 0, 0)` with text `rgb(255, 255, 255)`

#### Scenario: Muted and status colours on the site
- **WHEN** the Tokens section is read with `theme=site`
- **THEN** `--muted-foreground` is `rgb(85, 85, 85)`, `--destructive` is `rgb(200, 40, 27)`, `--success` is
  `rgb(14, 74, 40)`, `--warning` is `rgb(106, 58, 0)` and `--info` is `rgb(11, 92, 173)`, and each of the four
  status `-foreground` tokens is `rgb(255, 255, 255)`

#### Scenario: Status badges have their own colours on the site only
- **WHEN** `StatusBadge` renders `sales` code 2 (FINISHED, tone success) with `theme=site` and with
  `theme=staff`
- **THEN** on the site its text colour is `rgb(14, 74, 40)`; in the staff tree it equals the staff
  `--foreground` (the admin palette is not given), and in both it shows its icon and its label

#### Scenario: Exactly 24 colour declarations
- **WHEN** the unit test reads the site block of `tokens.css`
- **THEN** it finds the 24 colour declarations above with exactly those values and no other colour
  declaration (font tokens and the two component variables of the focus outline and the input border are not
  counted)

#### Scenario: Tokens the palette does not name
- **WHEN** `--popover`, `--chart-1` and `--success-subtle` are read with `theme=site` and with `theme=staff`
- **THEN** `--popover` and `--chart-1` have the same value in both themes, and `--success-subtle` equals the
  `--muted` of its tree (`rgb(224, 224, 224)` on the site)

#### Scenario: The staff tree is not affected
- **WHEN** the catalogue is opened with `theme=staff`
- **THEN** the page background is the neutral `--background` (`oklch(1 0 0)`, white), `--success`,
  `--warning` and `--info` equal the staff `--foreground`, `--destructive` is the neutral
  `oklch(0.577 0.245 27.325)`, and `--decoration` is not defined

### Requirement: The decoration colour is used only where 3 : 1 is enough (FE-VIS-01b · AD-VIS-04 · D-UX-02)

`--decoration` SHALL be used only by site-tree code, for decoration (lines, shapes, accents), icons and
headings of at least 24 px regular or 19 px bold, and only on a `--background` or `--card` surface; it MUST NOT
be placed on a `--muted` or `--accent` surface (2.80 : 1), MUST NOT colour smaller text and MUST NOT sit behind
`--primary-foreground` text; text placed on a `--decoration` surface uses `--foreground`. No file under
`packages/ui/src` SHALL reference `--decoration`.

#### Scenario: Shared components do not use the decoration token
- **WHEN** a file under `packages/ui/src` contains `--decoration` and `pnpm guards` runs
- **THEN** the guard fails and names the file

#### Scenario: Usage note on the catalogue
- **WHEN** the Tokens section is opened with `theme=site`
- **THEN** the `--decoration` row shows `#DC5F00` with the note "large text and icons only, on the background
  or a card" and no sample of small text in that colour

### Requirement: The focus outline and the input border reach 3 : 1 in both trees (AD-VIS-03 · AD-A11Y-02 · AD-VIS-04 · FE-VIS-01a)

The focus outline of every shared component SHALL be 2 px wide and every input border SHALL be drawn through
two component variables. In the site tree, whose palette is set, they point at the palette tokens: focus
outline = `var(--ring)` (`#000000`), input border = `var(--input)` (`#707070`). In the staff tree, until the
admin palette arrives, the focus outline SHALL be `var(--foreground)` and the input border
`var(--muted-foreground)`; the staff `--ring` and `--input` keep their neutral values and are not what the
outline and the border point at. An invalid field keeps its outline in `--destructive` (D-UI-01).

#### Scenario: Focus outline in the staff tree
- **WHEN** the primary `Button` and the `MoneyInput` of the catalogue receive keyboard focus with `theme=staff`
- **THEN** each shows an outline 2 px wide whose computed colour equals `--foreground`
  (19.80 : 1 on `--background`)

#### Scenario: Focus outline in the site tree
- **WHEN** the same two controls receive keyboard focus with `theme=site`
- **THEN** the outline is 2 px wide and its computed colour equals the site `--ring`, `rgb(0, 0, 0)`
  (18.10 : 1 on `#EEEEEE`)

#### Scenario: Input border in the staff tree
- **WHEN** the border colour of the `MoneyInput`, `PhoneInput`, `DateInput` and `BilingualInput` demos is read
  with `theme=staff`
- **THEN** it equals the staff `--muted-foreground` (4.74 : 1 on the staff background)

#### Scenario: Input border in the site tree
- **WHEN** the same four borders are read with `theme=site`
- **THEN** each equals the site `--input`, `rgb(112, 112, 112)` (4.27 : 1 on `#EEEEEE`, 4.95 : 1 on a white
  card — both at least 3 : 1)

#### Scenario: The staff ring and input tokens are not changed
- **WHEN** the unit test reads the staff `--ring` and `--input` in `tokens.css`
- **THEN** both equal the snapshot values (`oklch(0.708 0 0)` and `oklch(0.922 0 0)` with the Tailwind 4
  generation), and no component style refers to `--ring` or `--input` directly for an outline or a border

### Requirement: The catalogue reports the contrast of each token pair (AD-VIS-04 · AD-A11Y-02 · AD-VIS-03 · FE-VIS-01a · FE-VIS-01b)

The Tokens section of the catalogue SHALL show, for each tree, the WCAG contrast ratio of every listed token
pair computed in the browser from the resolved colours, rounded to 2 decimals, and SHALL mark each pair below
its limit (4.5 : 1 for text, 3 : 1 for large text, icons, input borders and the focus outline). Token values
are never changed to pass.

#### Scenario: Staff pairs
- **WHEN** the Tokens section is opened with `theme=staff` and the Tailwind 4 neutral values
- **THEN** the table shows as passing: `--foreground` on `--background` = 19.80 : 1, `--muted-foreground` on
  `--background` = 4.74 : 1, `--primary-foreground` on `--primary` = 17.18 : 1, `--destructive` on
  `--background` = 4.77 : 1, the focus outline (`--foreground`) = 19.80 : 1 and the input border
  (`--muted-foreground`) = 4.74 : 1
- **AND** no staff row is marked as failing

#### Scenario: Site text and status pairs
- **WHEN** the Tokens section is opened with `theme=site`
- **THEN** the table shows as passing on `--background`: `--foreground` = 18.10 : 1, `--muted-foreground` =
  6.43 : 1 (5.65 : 1 on `--muted`), `--destructive` = 4.79 : 1, `--success` = 8.92 : 1, `--warning` =
  8.16 : 1 and `--info` = 5.75 : 1
- **AND** white text on `--primary` = 21.00 : 1, on `--destructive` = 5.56 : 1, on `--success` = 10.35 : 1,
  on `--warning` = 9.47 : 1 and on `--info` = 6.67 : 1

#### Scenario: Site outline, border and decoration pairs
- **WHEN** the same table is read
- **THEN** the focus outline (`--ring`) = 18.10 : 1 and the input border (`--input`) = 4.27 : 1 on
  `--background` and 4.95 : 1 on `--card` pass their 3 : 1 limit
- **AND** `--decoration` = 3.19 : 1 on `--background` and 3.70 : 1 on `--card` are marked "large text and
  icons only", `--decoration` on `--muted` / `--accent` = 2.80 : 1 and `--primary-foreground` on
  `--decoration` = 3.70 : 1 are marked "not allowed", and `--foreground` on `--decoration` = 5.68 : 1 passes

#### Scenario: No site pair fails
- **WHEN** the site table is checked by the automated test
- **THEN** every text pair is at least 4.5 : 1 and every outline and border pair at least 3 : 1; the only
  marked rows are the usage limits of `--decoration`

### Requirement: Fonts are self-hosted WOFF2 files with their licences (AD-VIS-05 · FE-VIS-02 · FE-PERF-06 · D-UX-02)

The system SHALL serve every font as a WOFF2 file from `packages/ui/fonts/` — Manrope (400–700), Inter
(400–700), Pyidaungsu Regular 400 and Bold 700, Archivo Black 400, Roboto 400 / 500 / 700 — each family with
its licence file in the same folder, and SHALL make no request to a third-party font host. The Pyidaungsu
subset SHALL keep the whole block U+1000–U+109F.

#### Scenario: No third-party font request
- **WHEN** the catalogue is loaded with `lang=my` and then with `lang=en`
- **THEN** every font request goes to the page's own origin and no request is made to `fonts.googleapis.com`
  or `fonts.gstatic.com`

#### Scenario: Pyidaungsu is really loaded
- **WHEN** the Fonts section is opened with `lang=my` at 320 px
- **THEN** `document.fonts` holds a `FontFace` of family `Pyidaungsu` with weight 400 and one with weight 700,
  both with status `loaded`
- **AND** each of `ကြိုတင်ချိန်းဆိုမှု`, `နေ့စဉ်စာရင်းပိတ်`, `ငွေပေးချေမှု` and `ဝန်ဆောင်မှုပေးခြင်း` has a rendered width
  different from the same string set in `system-ui`

#### Scenario: Myanmar digit glyphs stay in the subset
- **WHEN** the string `၀၁၂၃၄၅၆၇၈၉` is rendered in Pyidaungsu and in `system-ui` in the Fonts section
- **THEN** the two rendered widths differ (the glyphs come from Pyidaungsu)

#### Scenario: A font family without its licence file fails CI
- **WHEN** the licence file of one family is removed from `packages/ui/fonts/` and `pnpm fonts:check` runs
- **THEN** the command exits with a non-zero status naming the family

### Requirement: Font stacks are tokens, with `--font-myanmar` first for Myanmar text (D-UX-02 · AD-VIS-05 · FE-VIS-02)

Font stacks SHALL be tokens. `--font-myanmar` = `'Pyidaungsu'` in both trees. Staff tree: `--font-sans` =
`'Manrope', 'Inter', var(--font-myanmar), system-ui, sans-serif`; `--font-numeric` =
`'Inter', 'Manrope', system-ui, sans-serif` with `font-variant-numeric: tabular-nums`. Site tree:
`--font-sans` = `'Roboto', var(--font-myanmar), system-ui, sans-serif`; `--font-display` =
`'Archivo Black', 'Roboto', sans-serif`. For text whose language is `my` the stack SHALL be
`var(--font-myanmar)` followed by the tree's Latin stack, and a site display heading in `my` uses
`var(--font-myanmar)` at weight 700. Myanmar text SHALL never be drawn with a synthesised bold
(`font-synthesis: none`).

#### Scenario: The Myanmar token in both trees
- **WHEN** the computed value of `--font-myanmar` is read with `theme=staff` and with `theme=site`
- **THEN** it is `'Pyidaungsu'` in both

#### Scenario: Stack order by text language
- **WHEN** a paragraph is rendered in the staff tree with `lang="en"` and with `lang="my"`
- **THEN** the first family of its computed `font-family` is Manrope for `en` and Pyidaungsu for `my`

#### Scenario: Tabular figures
- **WHEN** the column `1,250,000` / `7,000` / `999` is shown right-aligned in `--font-numeric`
- **THEN** the strings `0000000` and `1111111` measure the same width in that font

#### Scenario: Site headings
- **WHEN** the Fonts section is opened with `theme=site`
- **THEN** with `lang=en` the display heading is drawn in Archivo Black, and with `lang=my` in Pyidaungsu at
  weight 700

#### Scenario: No faux bold
- **WHEN** a Myanmar label at weight 600 is inspected
- **THEN** its computed `font-synthesis` is `none` and it is drawn with the Pyidaungsu weight-700 face

### Requirement: The type scale has Latin and Myanmar line-heights (AD-VIS-06 · AD-L10N-04 · FE-VIS-02)

The type scale SHALL be: `text-xs` 12 px (line-height 16 px for Latin text / 20 px for Myanmar text),
`text-sm` 14 px (20 / 24), `text-base` 16 px (24 / 28), `text-lg` 18 px (28 / 30), `text-xl` 20 px (28 / 32),
`text-2xl` 24 px (32 / 38), `text-3xl` 30 px (36 / 46). The Myanmar line-height applies to every element
whose language is `my`. Every input SHALL use at least 16 px.

#### Scenario: Line-height by language
- **WHEN** a `text-base` paragraph is rendered with `lang="en"` and then with `lang="my"`
- **THEN** its computed font size is 16 px in both, and its line-height is 24 px for `en` and 28 px for `my`

#### Scenario: Big numbers in Myanmar
- **WHEN** a `text-3xl` value is rendered with `lang="my"`
- **THEN** its computed font size is 30 px and its line-height is 46 px

#### Scenario: Inputs do not trigger iOS zoom
- **WHEN** every input of the catalogue is inspected at 320 px
- **THEN** each has a computed font size of at least 16 px

### Requirement: Myanmar-script data carries `lang="my"` whatever the UI language is (AD-L10N-04 · AD-A11Y-06 · AD-VIS-06 · D-DB-04)

A data value shown by a shared component — a bilingual field shown through the fallback, a customer or
employee name, free text — that contains a character of U+1000–U+109F SHALL be rendered inside an element with
`lang="my"`, so that it gets the Myanmar font stack and line-height in the English UI as well.
`ReceiptRenderer` SHALL set `lang="en"` on its root element.

#### Scenario: Myanmar fallback value in the English UI
- **WHEN** the service `{ name_mm: "မုတ်ဆိတ်ရိတ်", name_en: null }` is shown in `text-base` with `lang=en`
- **THEN** the element holding `မုတ်ဆိတ်ရိတ်` has `lang="my"` and a computed line-height of 28 px

#### Scenario: Latin value gets no attribute
- **WHEN** the customer name `Ma Su` is shown with `lang=en`
- **THEN** its element has no `lang` attribute and a line-height of 24 px in `text-base`

#### Scenario: The receipt inside the Myanmar UI
- **WHEN** the receipt demo is shown with `lang=my`
- **THEN** the receipt root has `lang="en"`, its English lines in `text-base` have a line-height of 24 px, and
  a line that shows a Myanmar description has `lang="my"`

### Requirement: Myanmar text is never upper-cased, italicised or letter-spaced (AD-VIS-06 · AD-L10N-04)

No shared component SHALL apply `text-transform: uppercase`, italics or letter-spacing to text. No file under
`packages/ui/src` SHALL contain the classes `uppercase`, `italic` or `tracking-*`.

#### Scenario: Computed style of every demo in Myanmar
- **WHEN** every text element of the catalogue is inspected with `lang=my`
- **THEN** each has `text-transform: none`, `font-style: normal` and `letter-spacing: normal`

#### Scenario: A primitive that brings an uppercase class
- **WHEN** a file under `packages/ui/src` contains the class `uppercase`, `italic` or `tracking-wide` and
  `pnpm guards` runs
- **THEN** the guard fails and names the file and the class

### Requirement: Spacing and radius come from fixed tokens (AD-VIS-07 · AD-VIS-08)

Spacing SHALL follow a 4 px grid with at least 8 px between adjacent touch targets, a 16 px page gutter below
768 px and 24 px content padding from 1024 px. `--radius` SHALL be `0.5rem`, with `sm` = radius − 4 px, `md`
= radius − 2 px and `lg` = radius.

#### Scenario: Radius
- **WHEN** a card and a button of the catalogue are inspected
- **THEN** the card's computed border radius is 6 px (`md` = 8 − 2) and `--radius` resolves to 8 px

#### Scenario: Gutter and padding
- **WHEN** the shell demo is measured at 320 px and at 1280 px
- **THEN** the content starts 16 px from the screen edge at 320 px and has 24 px padding at 1280 px

### Requirement: Motion is short and honours reduced motion (AD-VIS-09 · AD-A11Y-06)

Motion SHALL last 150 ms for hover and press and 200 ms for drawers and sheets, never more than 300 ms, with
ease-out on enter and ease-in on exit, and SHALL be replaced by a fade or no motion when
`prefers-reduced-motion: reduce` is set.

#### Scenario: Drawer motion
- **WHEN** the Drawer demo is opened at 1280 px
- **THEN** its enter transition lasts 200 ms

#### Scenario: Reduced motion
- **WHEN** the same drawer is opened with `prefers-reduced-motion: reduce`
- **THEN** it appears without a slide (no transform transition)

### Requirement: Money is displayed through one formatter with the `app` and `site` profiles (D-PLT-04 · AD-FMT-00 · AD-FMT-01 · FE-FMT-01)

`formatMoney(amount, { locale, profile })` in `packages/shared` SHALL take an `Mmk` value and render whole MMK
with a comma every three digits, digits 0–9, one space and the unit: `Ks` for profile `app` in `en`, `ကျပ်`
for profile `app` in `my`, and `Ks` for profile `site` in both languages. A negative amount SHALL start with
`-`. With `unit: false` the number is returned without the unit (table cells whose column header carries the
unit). `MoneyText` and every other component display money only through this function.

#### Scenario: Staff app, English
- **WHEN** `formatMoney` is called with profile `app`, locale `en` and the amounts 0, 999, 1000, 7000 and
  1250000
- **THEN** the results are `0 Ks`, `999 Ks`, `1,000 Ks`, `7,000 Ks` and `1,250,000 Ks`

#### Scenario: Staff app, Myanmar
- **WHEN** `formatMoney` is called with profile `app`, locale `my` and the amounts 7000 and 1250000
- **THEN** the results are `7,000 ကျပ်` and `1,250,000 ကျပ်`

#### Scenario: Website profile shows Ks in both languages
- **WHEN** `formatMoney` is called with profile `site` and the amount 7000 in `my` and in `en`
- **THEN** both results are `7,000 Ks`

#### Scenario: Refund amount
- **WHEN** `MoneyText` renders −6000 with profile `app` in `en`
- **THEN** it shows `-6,000 Ks`

#### Scenario: Table cell without the unit
- **WHEN** Ko Min's Haircut at B3 (8,000) is rendered in a money column of `DataTable` in `en`
- **THEN** the cell shows `8,000` and the column header shows `Amount (Ks)`

#### Scenario: A plain number is not money
- **WHEN** `formatMoney(7000, …)` or `<MoneyText amount={7000} />` is written with a JavaScript `number`
- **THEN** `pnpm typecheck` fails on that line

### Requirement: Money is an integer end to end in front-end code (D-PLT-04 · API-DATA-02 · AD-IMPL-05 · AD-FORM-11)

Front-end code SHALL hold money as the type `Mmk` (a branded `bigint` of whole MMK) and SHALL never pass it
through `parseFloat` or floating-point arithmetic. `parseMoneyInput(text)` SHALL return an `Mmk` for text made
only of digits (0–9 or ၀–၉) with optional comma or space separators, `null` for empty text, and the error code
`amount_invalid` for anything else (a decimal point, a minus sign, a letter). `moneyFromWire(n)` SHALL convert
the JSON integer of an `_amount` field and throw unless `n` is a safe integer; `moneyToWire(m)` converts back
and throws outside the safe-integer range. Sums are made with `sumMoney`.

#### Scenario: Accepted forms of 7,000
- **WHEN** `parseMoneyInput` receives `7,000`, `7000`, `7 000` and `၇,၀၀၀`
- **THEN** each returns 7000

#### Scenario: Rejected forms
- **WHEN** `parseMoneyInput` receives `7000.50`, `-500` and `7k`
- **THEN** each returns the error code `amount_invalid`

#### Scenario: Empty is not zero
- **WHEN** `parseMoneyInput` receives an empty string and then `0`
- **THEN** the first returns `null` and the second returns 0

#### Scenario: No precision loss above the float limit
- **WHEN** `parseMoneyInput` receives `9007199254740993` and the result is formatted with profile `app` in `en`
- **THEN** the text is `9,007,199,254,740,993 Ks`

#### Scenario: Wire boundaries
- **WHEN** `moneyFromWire` receives 7000.5, and `moneyToWire` receives 9007199254740993
- **THEN** both throw and no value is produced

#### Scenario: Sum of a split payment
- **WHEN** `sumMoney` adds Cash 5,000 and KBZPay 6,000
- **THEN** the result is 11000 (5,000 + 6,000 = 11,000) and formats as `11,000 Ks`

### Requirement: Dates and times are formatted in Myanmar Time whatever the device time zone is (D-PLT-05 · D-PLT-15 · AD-FMT-02 · AD-FMT-03 · AD-FMT-11 · API-DATA-03 · FE-FMT-01)

The formatter SHALL compute every date and time in the zone `Asia/Yangon` and never from the device time zone.
`formatDate` SHALL return `DD/MMM/YYYY` with the English month abbreviations `Jan` … `Dec` in both languages;
with `weekday: true` it is prefixed by the weekday word of the current language and a comma. `formatTime`
SHALL return `h:mm AM` or `h:mm PM` in both languages, without seconds and without a time-zone label.
`formatDateTime` is the date, one space and the time. `formatTimeRange` writes the AM / PM marker once when
both ends share it. `businessDateOf(instant)` SHALL return the Myanmar calendar date as `YYYY-MM-DD`.

#### Scenario: FINISH time of the fixture sale
- **WHEN** `formatDateTime` receives `2026-10-05T10:42:00+06:30` in `en` and in `my`
- **THEN** both return `05/Oct/2026 10:42 AM`

#### Scenario: Day boundary on a device in another time zone
- **WHEN** the browser time zone is America/Los_Angeles and `formatDateTime` receives `2026-10-05T17:29:00Z`
  and then `2026-10-05T17:30:00Z`
- **THEN** the results are `05/Oct/2026 11:59 PM` (17:29 UTC + 6:30 = 23:59 MMT) and `06/Oct/2026 12:00 AM`
  (17:30 UTC + 6:30 = 00:00 MMT of the next day)

#### Scenario: Month boundary
- **WHEN** `formatDateTime` receives `2026-10-31T23:59:00+06:30` and `2026-11-01T00:00:00+06:30`
- **THEN** the results are `31/Oct/2026 11:59 PM` and `01/Nov/2026 12:00 AM`

#### Scenario: Business date of an instant
- **WHEN** `businessDateOf` receives `2026-10-04T17:29:00Z` and `2026-10-04T17:30:00Z`
- **THEN** the results are `2026-10-04` and `2026-10-05`

#### Scenario: The same results under three process time zones
- **WHEN** the unit suite of `packages/shared/src/time` and `src/format` runs with `TZ=UTC`,
  `TZ=Asia/Yangon` and `TZ=America/Los_Angeles`
- **THEN** every test passes with identical expected values in the three runs

#### Scenario: Times of day from the wire
- **WHEN** `formatTime` receives the wire values `00:00`, `09:00`, `12:00`, `14:30` and `21:00`
- **THEN** the results are `12:00 AM`, `9:00 AM`, `12:00 PM`, `2:30 PM` and `9:00 PM`

#### Scenario: Weekday word
- **WHEN** `formatDate` with `weekday: true` receives `2026-10-05` in `en` and `2026-10-06` in `my`
- **THEN** the results are `Mon, 05/Oct/2026` and `အင်္ဂါ, 06/Oct/2026`

#### Scenario: Time range
- **WHEN** `formatTimeRange` receives 14:30–15:15 and then 11:30–12:15
- **THEN** the results are `2:30 – 3:15 PM` and `11:30 AM – 12:15 PM`

### Requirement: "Today" and "now" come from the supplied clock, not from the device (D-PLT-15 · API-AUTH-05 · AD-FORM-15 · AD-FMT-11)

Shared components SHALL read the current instant only through `useNow()` of the `ClockProvider`, which is given
a server instant (the `server_time` of `/me`; on the catalogue the `now` parameter) and uses the device clock
only to advance that instant. `todayMmt(now)` takes the instant as a parameter. No component calls
`new Date()` without arguments or `Date.now()`.

#### Scenario: A phone with a wrong date
- **WHEN** the device clock is set to 01/Jan/2020 and the catalogue is opened with the default `now`
- **THEN** the DateInput picker highlights 5 October 2026 and the "Today" filter preset gives `2026-10-05`

#### Scenario: The clock advances
- **WHEN** the catalogue is opened with `now=2026-10-05T17:29:30Z` and 60 seconds pass
- **THEN** `todayMmt(useNow())` changes from `2026-10-05` to `2026-10-06` without a reload

#### Scenario: Reading the device clock in a component fails lint
- **WHEN** a component contains `new Date()` or `Date.now()` and `pnpm lint` runs
- **THEN** the command fails and names the line

### Requirement: Data values use the digits 0–9 and typed Myanmar digits are normalised (D-PLT-05 · AD-FMT-10)

Every formatter output SHALL use the digits 0–9 in both languages; only words are translated.
`normalizeDigits(text)` SHALL replace U+1040–U+1049 (၀–၉) by 0–9, and every shared input applies it to what
is typed.

#### Scenario: Myanmar digits are converted
- **WHEN** `normalizeDigits` receives `၀၁၂၃၄၅၆၇၈၉`
- **THEN** it returns `0123456789`

#### Scenario: No Myanmar digit in Myanmar output
- **WHEN** the Formatters section is opened with `lang=my`
- **THEN** no displayed value contains a character from U+1040–U+1049

### Requirement: Durations and quantities translate the unit, not the digits (AD-FMT-05 · AD-FMT-08 · FE-FMT-01)

`formatDuration(minutes)` SHALL return `45 min` / `1 h 30 min` in `en` and `45 မိနစ်` / `1 နာရီ 30 မိနစ်` in
`my`; a whole number of hours is written without the minutes part. `formatQty(n)` SHALL return `3 pcs` in `en`
and `3 ခု` in `my`.

#### Scenario: Durations of the fixture services
- **WHEN** `formatDuration` receives 30, 45 (Haircut 30 + Shave 15), 60 and 90 in `en`, and 45 and 90 in `my`
- **THEN** the results are `30 min`, `45 min`, `1 h`, `1 h 30 min`, and `45 မိနစ်`, `1 နာရီ 30 မိနစ်`

#### Scenario: Quantity
- **WHEN** `formatQty` receives 3 in `en` and in `my`
- **THEN** the results are `3 pcs` and `3 ခု`

### Requirement: Percentages show at most two decimals, rounded half up (AD-FMT-07 · API-DATA-02)

`formatPercent(value)` SHALL take a number or a decimal string, round half up to 2 decimals on the decimal
representation, remove trailing zeros and append `%`.

#### Scenario: Plain values
- **WHEN** `formatPercent` receives 0, 15, 12.5, `12.50`, `2.5000` and 100
- **THEN** the results are `0%`, `15%`, `12.5%`, `12.5%`, `2.5%` and `100%`

#### Scenario: Rounding
- **WHEN** `formatPercent` receives `33.333`, `12.345`, `12.344` and `99.995`
- **THEN** the results are `33.33%`, `12.35%`, `12.34%` and `100%`

### Requirement: Relative time is used up to 24 hours (AD-FMT-09)

`formatRelativeTime(at, now)` SHALL return `just now` below 1 minute, `N min ago` below 60 minutes, `N h ago`
below 24 hours and the absolute date from 24 hours on.

#### Scenario: Boundaries
- **WHEN** `formatRelativeTime` is called in `en` with `now` = `2026-10-05T10:42:00+06:30` for events 59
  seconds, 60 seconds, 59 minutes, 60 minutes, 23 hours 59 minutes and 24 hours earlier
- **THEN** the results are `just now`, `1 min ago`, `59 min ago`, `1 h ago`, `23 h ago` and `04/Oct/2026`

### Requirement: Phone numbers are normalised to E.164 by one shared function (D-CUS-02 · API-DATA-06 · AD-FORM-10 · AD-FMT-04 · P3-RULE-01 · FE-IMPL-03)

`normalizePhone(text)` in `packages/shared` SHALL convert Myanmar digits, remove spaces and dashes, turn a
leading `0` into `+95`, turn a leading `959` into `+959`, keep a leading `+`, and return the result only when
it matches `^\+[1-9][0-9]{6,14}$`; otherwise it returns the error code `phone_invalid`. `formatPhone(e164)`
SHALL show a `+959…` number in local grouping — `09 xxx xxx xxx` for 9 digits after `09`, `09 xxxx xxxx` for
8, `09 xxx xxxx` for 7 — and any other number unchanged.

#### Scenario: Ma Su's number in every accepted form
- **WHEN** `normalizePhone` receives `09 7712 3456`, `09-7712-3456`, `+95977123456`, `95977123456` and
  `၀၉ ၇၇၁၂ ၃၄၅၆`
- **THEN** each returns `+95977123456`

#### Scenario: Display grouping
- **WHEN** `formatPhone` receives `+95977123456`, `+95945001122` and `+959771234567`
- **THEN** the results are `09 7712 3456`, `09 4500 1122` and `09 771 234 567`

#### Scenario: Length boundaries of E.164
- **WHEN** `normalizePhone` receives `09123` (→ `+959123`, 6 digits), `091234` (→ `+9591234`, 7 digits),
  `+959123456789012` (15 digits) and `+9591234567890123` (16 digits)
- **THEN** the first and the last return `phone_invalid`, the second returns `+9591234` and the third is
  returned unchanged

#### Scenario: A number without a usable prefix
- **WHEN** `normalizePhone` receives `7712 3456`
- **THEN** it returns `phone_invalid`

### Requirement: `PhoneInput` keeps what was typed and previews the formatted number (AD-FORM-10 · FE-CMP-06 · D-CUS-02 · AD-FMT-10)

`PhoneInput` SHALL use `inputmode="tel"` and the placeholder `09 xxx xxx xxx`, keep the text as typed (digits
normalised to 0–9), show the formatted number as a live preview, and report `{ raw, e164 }` on every change;
`e164` is `null` until the number is valid.

#### Scenario: Typing Myanmar digits
- **WHEN** a user types `၀၉ ၇၇၁၂ ၃၄၅၆` in the PhoneInput demo
- **THEN** the field shows `09 7712 3456`, the preview shows `09 7712 3456` and the reported value is
  `{ raw: "09 7712 3456", e164: "+95977123456" }`

#### Scenario: The typed form is kept
- **WHEN** a user types `+95977123456`
- **THEN** the field still shows `+95977123456`, the preview shows `09 7712 3456` and `raw` is `+95977123456`

#### Scenario: Incomplete number on blur
- **WHEN** a user types `0977` and leaves the field
- **THEN** the message of key `error.phone_invalid` (English: "Enter a valid phone number.") appears under
  the field and the reported `e164` is `null`

### Requirement: Every visible string comes from the `my` and `en` language files with checked keys (D-PLT-03 · AD-L10N-01 · AD-L10N-02 · FE-L10N-01 · AD-IMPL-05)

`packages/i18n` SHALL hold one JSON file per namespace and language (`messages/my/<namespace>.json`,
`messages/en/<namespace>.json`), loaded through `next-intl`, with keys named `<module>.<screen>.<element>` and
the shared groups `common.*`, `status.<table>.<CONSTANT>`, `reason.<code>` and `error.<code>`. This change
delivers the namespaces `common`, `status`, `error`, `reason` and `devui` (the labels of the catalogue demos).
A key that does not exist SHALL be a TypeScript error. `pnpm i18n:check` SHALL exit with a non-zero status
when a key exists in only one language, when a value is empty, when a status of the status map has no
`status.<table>.<CONSTANT>` key, or when a code of the shared error-code list has no `error.<code>` key.

#### Scenario: A key missing in Myanmar fails the check
- **WHEN** `common.action.retry` is removed from `messages/my/common.json` and `pnpm i18n:check` runs
- **THEN** the command exits with status 1 and prints `my: missing common.action.retry`

#### Scenario: A mistyped key does not compile
- **WHEN** a component calls `t('common.action.retri')` and `pnpm typecheck` runs
- **THEN** the type check fails on that line

#### Scenario: Complete files pass
- **WHEN** both languages contain the same keys with non-empty values and `pnpm i18n:check` runs
- **THEN** the command exits with status 0

#### Scenario: A status without a label fails the check
- **WHEN** `status.visits.COMPLETED` is removed from `messages/en/status.json` and `pnpm i18n:check` runs
- **THEN** the command exits with status 1 and prints `en: missing status.visits.COMPLETED`

#### Scenario: Demo labels are translated too
- **WHEN** the catalogue is opened with `lang=my`
- **THEN** every demo label comes from the `devui` namespace and no demo shows English-only label text

### Requirement: The language is the account's, else the system default; the cookie serves only before a session exists (D-PLT-03 · AD-L10N-06 · AD-L10N-04)

When a session value is supplied the staff tree SHALL use the account's `ui_language` (1 → `my`, 2 → `en`)
and, when it is NULL, the system default language (setting `system.default_language`, default 1 MY). The
cookie `point_locale` SHALL be used only when no session value is supplied (login screen, first paint, the
catalogue), falling back to the system default; after `/me` is known the cookie is rewritten from the resolved
value. The tree SHALL set `<html lang>` to the resolved language.

#### Scenario: First visit without a cookie and without a session
- **WHEN** the catalogue is opened without a `lang` parameter and without the cookie `point_locale`
- **THEN** the page is in Myanmar and `<html lang="my">` is set

#### Scenario: NULL on the account means the system default, not the cookie
- **WHEN** the resolver receives a session with `ui_language` NULL, the cookie `point_locale=en` and the
  system default 1
- **THEN** it returns `my` and the cookie is rewritten to `my`

#### Scenario: The account value wins over the cookie
- **WHEN** the resolver receives a session with `ui_language` 2 and the cookie `point_locale=my`
- **THEN** it returns `en` and the cookie is rewritten to `en`

#### Scenario: No session — the cookie is used
- **WHEN** the resolver receives no session and the cookie `point_locale=en`
- **THEN** it returns `en`

### Requirement: Switching the language changes every string without a page load (AD-L10N-06 · AD-NAV-07 · D-PLT-03)

`LanguageSwitch` SHALL change every visible string at once without a full page load and without refetching
data, write the cookie `point_locale`, and call `onChange(locale)`.

#### Scenario: Switching to English keeps the page state
- **WHEN** a user types `8000` in the MoneyInput demo and then chooses English in `LanguageSwitch`
- **THEN** the labels change to English, `<html lang="en">` is set and the cookie `point_locale` is `en`
- **AND** the MoneyInput demo still shows `8,000` and no document navigation request was made

#### Scenario: The choice survives a reload where no session exists
- **WHEN** the catalogue is reloaded after English was chosen
- **THEN** the page is in English

### Requirement: Bilingual data fields fall back from English to Myanmar without a marker (D-DB-04 · AD-L10N-03 · API-DATA-05 · FE-L10N-02)

`localized(record, field, locale)` SHALL return `<field>_mm` in the Myanmar UI, and in the English UI
`<field>_en` when it is non-empty after trimming, otherwise `<field>_mm`. A fallback value is displayed like
any other value, with no label or marker. Free text and customer names are shown as stored.

#### Scenario: Both names present
- **WHEN** the service `{ name_mm: "ဆံပင်ညှပ်", name_en: "Haircut" }` is rendered in `en` and in `my`
- **THEN** it shows `Haircut` in English and `ဆံပင်ညှပ်` in Myanmar

#### Scenario: English name missing
- **WHEN** the service `{ name_mm: "မုတ်ဆိတ်ရိတ်", name_en: null }` is rendered in `en`
- **THEN** it shows `မုတ်ဆိတ်ရိတ်` and no extra label

#### Scenario: Blank English name
- **WHEN** `name_en` is a string of two spaces
- **THEN** the English UI shows the `name_mm` value

### Requirement: An API error is shown through its `code` as a language key (API-ERR-01 · API-ERR-02 · AD-STATE-03 · AD-STATE-04)

`ErrorState` SHALL show an API problem by looking up `error.<code>` in the language files with the problem's
`params` for interpolation, say what to do next, offer Retry only when a retry handler is given, and SHALL
never show the `detail` string. A code that has no key SHALL be shown with the text of `error.unknown` and the
first 8 characters of `request_id` as the error ID.

#### Scenario: Interpolated message
- **WHEN** `ErrorState` receives `{ code: "file_too_large", params: { max_mb: 10 } }` in `en`
- **THEN** it shows the text of `error.file_too_large` (English: "The file is larger than 10 MB.")

#### Scenario: Forbidden and not found
- **WHEN** `ErrorState` receives the codes `forbidden` and `not_found` in `en`
- **THEN** it shows "You don't have access to this page. Ask an admin if you need it." and "This item doesn't
  exist or was archived."

#### Scenario: Unknown code never leaks the developer text
- **WHEN** `ErrorState` receives `{ code: "zz_unknown", detail: "stack trace line 1", request_id:
  "0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70" }` in `en`
- **THEN** it shows the text of `error.unknown` (English: "Something went wrong. Try again.") and
  `Error ID: 0199a3f2`
- **AND** the text "stack trace line 1" is not in the page

#### Scenario: Unexpected server error
- **WHEN** `ErrorState` receives the HTTP 500 problem `{ code: "internal_error", request_id:
  "0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70" }` in `en`
- **THEN** it shows the text of `error.internal_error` (English: "Something went wrong on the server. Try
  again; if it happens again, give the error ID to an admin.") and `Error ID: 0199a3f2`

#### Scenario: Retry only when it is safe
- **WHEN** `ErrorState` is rendered with a retry handler and then without one
- **THEN** the "Retry" button is shown only in the first case

### Requirement: Buttons follow one hierarchy, one size rule and one loading behaviour (AD-CMP-01 · AD-LAY-04 · AD-VIS-11 · AD-A11Y-05 · AD-NET-01)

`Button` SHALL offer the variants primary (filled `--primary`), secondary, ghost and destructive
(`--destructive`); be 48 px high below 768 px and 40 px high from 768 px with a touch area never smaller than
44 × 44 px; require an `aria-label` when it shows only an icon; and, while its action runs, keep its label,
show a spinner inside the button and stay disabled until the request settles.

#### Scenario: Height by layout mode
- **WHEN** the Button demo is measured at 320 px and at 1280 px
- **THEN** the primary button is 48 px high at 320 px and 40 px high at 1280 px
- **AND** at 1280 px a tap 1 px above the visible edge still activates the button (40 px + 2 px above and
  below = a 44 px hit area)

#### Scenario: A double tap submits once
- **WHEN** a user taps the "Save" button of the loading demo twice within 300 ms
- **THEN** the button shows a spinner next to the label "Save", is disabled, and the demo counter shows 1 call

#### Scenario: Icon-only button without a name does not compile
- **WHEN** a `Button` is written with `iconOnly` and without `aria-label`
- **THEN** `pnpm typecheck` fails on that line

### Requirement: Form fields show the required asterisk and the error under the field (D-UI-01 · AD-FORM-01 · AD-FORM-02 · AD-FORM-05 · AD-A11Y-04)

`FormField` SHALL place the label above the control; mark a required field with an asterisk in `--destructive`
directly after the label; and show an invalid field with an outline in `--destructive` and the message from
the language file directly under the field, with `aria-invalid="true"` and `aria-describedby` pointing to the
message.

#### Scenario: Required field left empty
- **WHEN** a user focuses the required field "Name" of the form demo and leaves it empty
- **THEN** the message of key `error.required` (English: "This field is required.") appears directly under
  the field, the field outline uses `--destructive`, and the input has `aria-invalid="true"` and an
  `aria-describedby` that references the message

#### Scenario: Asterisk only on required fields
- **WHEN** the form demo is rendered
- **THEN** the label "Name" is followed by `*` in the computed colour of `--destructive` and the optional
  field "Note" has no asterisk

### Requirement: Forms validate on blur and submit, stay submittable, and map server errors to fields (AD-FORM-03 · AD-FORM-04 · API-ERR-01 · API-ERR-03)

A field SHALL be validated on blur and on submit, and again on every change once it has shown an error. The
submit button stays enabled while the form is invalid; pressing it shows every error and moves the focus to
the first invalid field; it is disabled only while submitting. An item of the server's `errors[]` SHALL be
shown under the field named by `field` with the text of `error.<code>` and its `params`, where `code` is a
catalogue code named by the schema (for example `phone_invalid`) or the schema issue name `too_small`,
`too_big` or `invalid_type`; a problem without a field is shown in an inline alert at the top of the form, not
only in a toast. A missing value — `invalid_type` for an undefined value, or `too_small` for an empty text —
SHALL be shown as `error.required`; `required`, `date_invalid` and `unknown` are client-only message keys that
the API never returns.

#### Scenario: The error clears while typing
- **WHEN** the user types `Ma Su` into the field that shows `error.required`
- **THEN** the message and the red outline disappear after the first character

#### Scenario: Submit with two invalid fields
- **WHEN** the user presses the enabled submit button while "Name" and "Phone" are both invalid
- **THEN** both fields show their message and the focus is in "Name"

#### Scenario: Server error on a field and without a field
- **WHEN** the demo answers `errors: [{ field: "phone", code: "phone_invalid" }]` and then the non-field
  problem `forbidden`
- **THEN** the first message appears under "Phone", and the second appears in an inline alert at the top of
  the form and not in a toast

#### Scenario: Generic field codes with their bound
- **WHEN** the demo answers `errors: [{ field: "name", code: "too_big", params: { maximum: 100 } }]` in `en`
- **THEN** the text of `error.too_big` (English: "This value is too long or too large — maximum 100.") appears
  under "Name"

#### Scenario: An empty required text from the server
- **WHEN** the demo answers `errors: [{ field: "name", code: "too_small", params: { minimum: 1 } }]` for an
  empty "Name"
- **THEN** the field shows the text of `error.required`

#### Scenario: A value below its minimum and a wrong type
- **WHEN** the demo answers `errors: [{ field: "name", code: "too_small", params: { minimum: 2 } }]` for the
  typed name `M`, and then `errors: [{ field: "amount", code: "invalid_type" }]`, in `en`
- **THEN** "Name" shows the text of `error.too_small` ("This value is too short or too small — minimum 2.")
  and "Amount" shows the text of `error.invalid_type` ("This value has the wrong format.")

### Requirement: `MoneyInput` accepts only whole MMK and formats while typing (D-PLT-04 · AD-FORM-11 · AD-FMT-10 · AD-FMT-01)

`MoneyInput` SHALL use `inputmode="numeric"`, show thousands separators as the user types, show the unit of the
current language and profile as a suffix, accept pasted `7,000`, `7000` and `7 000`, ignore the decimal-point
and the minus key, and report an `Mmk` value or `null` when empty. In the Myanmar UI an amount of 100,000 or
more SHALL show a helper in သိန်း under the input (amount ÷ 100,000, trailing zeros removed).

#### Scenario: Typing an amount
- **WHEN** a user types `7000` in the MoneyInput demo in `en` and then in `my`
- **THEN** the field shows `7,000` with the suffix `Ks` in English and `ကျပ်` in Myanmar, and the reported
  value is 7000

#### Scenario: Myanmar digits
- **WHEN** a user types `၇၀၀၀`
- **THEN** the field shows `7,000` and the reported value is 7000

#### Scenario: Decimal point and minus are ignored
- **WHEN** a user types `7000`, then `.`, then `-`
- **THEN** the field still shows `7,000`

#### Scenario: Digits typed after an ignored decimal point
- **WHEN** a user types `7000`, `.`, `5`, `0`
- **THEN** the field shows `700,050` (the point was ignored and the two digits were appended) and the
  reported value is 700050

#### Scenario: Pasting a decimal amount
- **WHEN** a user pastes `7000.50` into the empty field
- **THEN** the reported value stays `null` and the message of key `error.amount_invalid` (English: "Enter a
  whole amount in kyats.") appears under the field

#### Scenario: Zero is a value, empty is not
- **WHEN** a user types `0`, and then clears the field
- **THEN** the reported value is 0 and then `null`

#### Scenario: The သိန်း helper and its boundary
- **WHEN** a user types 99999, then 100000, then 2250000 in `my`
- **THEN** no helper is shown for `99,999`; `100,000` shows `1 သိန်း` (100,000 ÷ 100,000 = 1); `2,250,000`
  shows `22.5 သိန်း` (2,250,000 ÷ 100,000 = 22.5)
- **AND** in `en` no helper is shown for any of them

### Requirement: Master names are entered as a Myanmar and English pair (D-DB-04 · AD-FORM-09 · API-DATA-05)

`BilingualInput` SHALL show two stacked inputs, Myanmar first and required, English second and optional, with
the hint of key `common.bilingual.hint` (English: "Leave English empty to show the Myanmar text"), and report
`{ mm, en }` where an empty English value is `null`.

#### Scenario: Myanmar only
- **WHEN** a user enters `ဆံပင်ညှပ်` in the Myanmar input and leaves English empty
- **THEN** the reported value is `{ mm: "ဆံပင်ညှပ်", en: null }` and no error is shown

#### Scenario: Myanmar name missing
- **WHEN** a user enters `Haircut` in the English input, leaves Myanmar empty and leaves the field
- **THEN** the message of key `error.required` appears under the Myanmar input

### Requirement: Zawgyi text typed into shared text inputs is converted to Unicode (AD-FORM-13 · AD-L10N-07 · API-SHAPE-05)

Every shared text input for names, notes and reasons SHALL detect Zawgyi-encoded Myanmar text, convert it to
Unicode before reporting the value, and show the converted text with a notice so the user can confirm it.

#### Scenario: Zawgyi input
- **WHEN** a user enters the Zawgyi-encoded text `ျမန္မာ` in the Myanmar input of `BilingualInput` and leaves
  the field
- **THEN** the field shows the Unicode text `မြန်မာ`, the reported value is `မြန်မာ`, and the notice of key
  `common.zawgyi.converted` is shown under the field

#### Scenario: Unicode input is untouched
- **WHEN** a user enters `မြန်မာ`
- **THEN** the value is reported unchanged and no notice is shown

### Requirement: Dates are typed, picked and shown as `DD/MMM/YYYY` on the Myanmar calendar date (D-PLT-05 · D-PLT-15 · AD-FORM-15 · AD-FMT-02 · API-DATA-03)

`DateInput` SHALL display the chosen date as `DD/MMM/YYYY`, open its picker on today's Myanmar date, accept
typed dates in `DD/MM/YYYY` and `DD/MMM/YYYY` (Myanmar digits normalised, month abbreviation in any case), and
report the value as `YYYY-MM-DD`. A date that does not exist SHALL show the message of key
`error.date_invalid`. `DateText` SHALL render dates and times only through the shared formatter; with
`relativeDay` it shows the words of `common.date.today` / `common.date.yesterday` for those two dates.

#### Scenario: The picker opens on the Myanmar date
- **WHEN** the browser time zone is America/Los_Angeles, the catalogue clock is `2026-10-04T18:00:00Z`
  (00:30 MMT on 05/Oct/2026) and the picker of the DateInput demo is opened
- **THEN** the highlighted day is 5 October 2026

#### Scenario: Typed forms
- **WHEN** a user types `05/10/2026`, `05/oct/2026` or `၀၅/၁၀/၂၀၂၆` and leaves the field
- **THEN** the field shows `05/Oct/2026` and the reported value is `2026-10-05`

#### Scenario: Impossible dates and the leap day
- **WHEN** a user types `31/02/2026`, `29/02/2026` and `29/02/2028`
- **THEN** the first two show the message of `error.date_invalid` (English: "Enter a valid date, for example
  05/Oct/2026.") and the third reports `2028-02-29`

#### Scenario: Today and yesterday in a list
- **WHEN** `DateText` with `relativeDay` renders `2026-10-05`, `2026-10-04` and `2026-10-03` in `en` with the
  default catalogue clock
- **THEN** it shows `Today`, `Yesterday` and `03/Oct/2026`

### Requirement: Status badges take tone, icon and label from one map (D-DB-03 · API-DATA-04 · AD-CMP-05 · AD-IMPL-04 · AD-A11Y-03)

`StatusBadge` SHALL receive a table name and a status code and take its tone, icon and label key only from the
single map file `packages/ui/src/status/status-map.ts`, which is keyed by the named constants of
`packages/shared`; the label key is `status.<table>.<CONSTANT>`; the tones are neutral, info, success,
warning, danger and muted; every badge shows an icon and a text next to its tone.

#### Scenario: Visit statuses
- **WHEN** `StatusBadge` renders `visits` with code 1 and code 2 in `en`
- **THEN** code 1 (STARTED) shows tone info with the label of `status.visits.STARTED` ("In service"), and
  code 2 (COMPLETED) shows tone warning with the label of `status.visits.COMPLETED` ("Awaiting payment")
- **AND** each badge contains an icon and the text

#### Scenario: Locked and ended states
- **WHEN** `StatusBadge` renders `sales` code 2 (FINISHED), `payroll_runs` code 3 (FINALIZED), `payroll_runs`
  code 4 (PUBLISHED), `bookings` code 0 (CANCELLED) and `stock_transfers` code 2 (SENT) in `en`
- **THEN** the tones are success with a lock icon, warning with a lock icon, warning with a lock icon and a
  sent icon, muted, and info with the label "In transit"

#### Scenario: Every pair of the guideline is in the map
- **WHEN** the unit test walks the status constants of the 19 tables listed in AD-CMP-05
- **THEN** each of the 71 (table, code) pairs has exactly one map entry and its tone equals the tone of
  AD-CMP-05

### Requirement: Flag chips mark exceptions with a fixed tone and icon (AD-CMP-06 · AD-CMP-05 · AD-A11Y-03)

`FlagChip` SHALL take the tone and the icon of each flag of AD-CMP-06 from the status map file and its label
from `status.flag.<key>`, and SHALL always show the icon and the text together.

#### Scenario: Flags
- **WHEN** `FlagChip` renders `late_entry`, `proxy_recorded` with the name Ko Min, and `negative_stock` in `en`
- **THEN** it shows tone warning with a clock icon and "Late entry", tone info with a users icon and
  "Recorded by Ko Min", and tone danger with an alert icon and "Negative stock"

#### Scenario: Late entry in Myanmar
- **WHEN** `FlagChip` renders `late_entry` in `my`
- **THEN** the label is `နောက်မှ ထည့်သွင်းခြင်း`

### Requirement: An employee chip never shows an avatar without the name (AD-CMP-09 · AD-VIS-12)

`EmployeeChip` SHALL show the employee's photo or, when there is none, initials on a neutral background,
always together with the display name, and the branch when it is given.

#### Scenario: Employee without a photo
- **WHEN** `EmployeeChip` renders Ko Aung without a photo and with the branch Point 3.0 at 320 px
- **THEN** it shows the initials `KA`, the name `Ko Aung` and `Point 3.0`, and the name is not truncated

#### Scenario: Profile action only when given
- **WHEN** the chip is rendered without and then with the profile handler
- **THEN** it is plain text in the first case and a button that calls the handler in the second

### Requirement: Every reason-required action uses `ReasonDialog` with its reason source (AD-RSN-01 · AD-RSN-02 · API-DATA-11 · AD-FORM-14 · D-BKG-14 · D-VIS-13)

`ReasonDialog` SHALL show a title made of verb and object, a consequence summary, a reason control for one of
three source types — master list (`{ id, name_mm, name_en, requires_note }`), preset codes
(`{ code, name, requiresNote }`, label `reason.<name>`) or free text — a note field, a confirm button labelled
with the verb, and a second button to keep the record. The note SHALL be required when the chosen master
reason has `requires_note = true` or the chosen preset reason is marked as requiring it. Confirming without a
reason, or without a required note, SHALL show the message of key `error.reason_required` and keep the dialog
open. On confirm it returns the generic result `{ reason_id?, reason_code?, note? }`; the calling screen SHALL map
that result to the reason field its endpoint defines (for example `reason`, `added_reason` or
`override_reason` in API Part 4) — the dialog itself knows no endpoint. Up to 7 reasons are shown as a radio
group, 8 or more as a searchable list.

#### Scenario: Master reason without a note
- **WHEN** Ma Hnin cancels Ma Su's booking of 05/Oct/2026 2:30 PM with Ko Aung at Point 3.0 in the demo,
  chooses the reason "Customer wants to change" and presses "Cancel booking"
- **THEN** the dialog returns `{ reason_id: <id of that reason>, note: null }` and closes

#### Scenario: Master reason that requires a note
- **WHEN** she chooses "Other" (`requires_note = true`), leaves the note empty and presses "Cancel booking"
- **THEN** the message of key `error.reason_required` (English: "Enter a reason.") appears under the note and
  the dialog stays open
- **AND** after typing `wrong phone` the dialog returns `{ reason_id: <id of Other>, note: "wrong phone" }`

#### Scenario: Preset reasons of a late entry
- **WHEN** the late-entry demo is opened in `en`
- **THEN** it offers the five reasons INTERNET_OUTAGE (1), POWER_OUTAGE (2), PHONE_BROKEN (3), FORGOT (4) and
  OTHER (9) as a radio group
- **AND** choosing POWER_OUTAGE returns `{ reason_code: 2 }`, while choosing OTHER without a note shows
  `error.reason_required`

#### Scenario: Free-text reason
- **WHEN** the refund demo is confirmed with an empty reason, and then with `Customer charged twice`
- **THEN** the first attempt shows `error.reason_required`, and the second returns
  `{ note: "Customer charged twice" }`

#### Scenario: The caller maps the result to its endpoint's field
- **WHEN** the refund demo, whose fixture endpoint takes `{ "reason": "…" }`, is confirmed with
  `Customer charged twice`
- **THEN** the demo's "request body" panel shows `{ "reason": "Customer charged twice" }`, built by the demo
  from the dialog result `{ note: "Customer charged twice" }`

#### Scenario: Seven reasons and eight reasons
- **WHEN** the dialog receives a master list of 7 reasons, and then of 8 reasons
- **THEN** 7 are shown as a radio group with every option visible, and 8 are shown as a searchable list

#### Scenario: Keeping the record
- **WHEN** the user presses "Keep" or the Esc key
- **THEN** the dialog closes, nothing is returned and the focus is back on the button that opened it

### Requirement: Confirm dialogs state the action, the consequence and the verb (AD-CONF-01 · AD-CONF-02 · AD-LAY-04 · AD-NET-01 · AD-COPY-04)

`ConfirmDialog` SHALL require a title that names the action, a body that states the consequence, and a confirm
label that repeats the verb; there is no default "OK" label and no body-less form. An irreversible action
SHALL add the sentence of key `common.confirm.irreversible` (English: "This can't be undone."). A destructive
action uses the destructive button style. The confirm button is the last button on the right on desktop and
is disabled while its action runs, so one confirmation produces one call.

#### Scenario: Send transfer
- **WHEN** the send-transfer demo is opened in `en` at 1280 px
- **THEN** it shows the title "Send transfer", the body "Stock leaves Point 1.0 now. You can't edit or cancel
  this transfer after sending.", the sentence "This can't be undone." and the buttons "Go back" (left) and
  "Send transfer" (right)

#### Scenario: Double confirmation
- **WHEN** the user presses "Send transfer" twice within 300 ms
- **THEN** the confirm handler is called once and the button shows a spinner while it runs

#### Scenario: A confirm dialog without a consequence does not compile
- **WHEN** a `ConfirmDialog` is written without the `consequence` or the `confirmLabel` property
- **THEN** `pnpm typecheck` fails on that line

### Requirement: Drawers, sheets and dialogs follow one overlay rule set (AD-CMP-08 · AD-LAY-01 · AD-LAY-02 · AD-LAY-03 · AD-A11Y-02 · FE-CMP-02b)

`Drawer` SHALL open from the right with a width between 480 and 640 px from 768 px upward (full width below
600 px of panel space) and as a full-screen `Sheet` with a sticky header and a sticky bottom action bar below
768 px; a dialog is centred from 768 px and a bottom sheet below. The Esc key SHALL close the top overlay, the
focus SHALL be trapped inside it and return to the opening control on close. No more than one dialog may be
open above a drawer.

#### Scenario: Drawer on desktop and sheet on a phone
- **WHEN** the booking drawer demo is opened at 1280 px and at 320 px
- **THEN** at 1280 px the panel is 560 px wide on the right and the list stays visible beside it; at 320 px it
  covers the whole screen and its header and action bar stay visible while the body scrolls

#### Scenario: Width limits
- **WHEN** the drawer is given the widths 479, 480, 640 and 641 at 1280 px
- **THEN** the rendered widths are 480, 480, 640 and 640 px

#### Scenario: Drawer on a tablet
- **WHEN** the drawer demo is opened at 768 px
- **THEN** it overlays the content as a right panel 560 px wide

#### Scenario: Focus is trapped and returns
- **WHEN** the drawer is open and Tab is pressed repeatedly, and then the drawer is closed
- **THEN** the focus never leaves the drawer while it is open, and after closing it is on the button that
  opened it

#### Scenario: A second dialog over a drawer
- **WHEN** a dialog is open above a drawer and a second dialog is opened in a development or test build
- **THEN** an error naming the rule is thrown

### Requirement: A drawer is addressable and guards unsaved edits (AD-NAV-06 · AD-FORM-08)

A drawer with a `urlKey` SHALL add `?drawer=<urlKey>` to the address and close first when the browser Back
button is pressed. Closing an overlay that holds unsaved edits SHALL ask "Discard changes?" with "Keep
editing" and "Discard"; an untouched form closes directly.

#### Scenario: Address and Back button
- **WHEN** the drawer demo is opened and then the browser Back button is pressed
- **THEN** the address contains `?drawer=booking:demo-1` while it is open, and after Back the drawer is closed
  and the catalogue page is still shown

#### Scenario: Unsaved changes
- **WHEN** the user edits the name in the drawer and presses Esc
- **THEN** the question "Discard changes?" with the buttons "Keep editing" and "Discard" appears
- **AND** when nothing was edited, Esc closes the drawer without a question

### Requirement: `DataTable` shows lists as a real table from 768 px (AD-CMP-07 · AD-LIST-06 · AD-FMT-01 · AD-A11Y-07)

`DataTable` SHALL render a real table with a sticky header and `<th scope="col">` header cells, rows 48 px
high (56 px where the primary pointer is touch), money and quantity columns right-aligned in `--font-numeric`
with the unit in the header, a status column made of `StatusBadge`, a totals row for money columns taken from
the `totals` property, row dividers instead of zebra stripes, sort buttons only on columns that have a sort
key, and a "Columns" menu whose choice is stored per user on the device. At 768–1023 px at most 7 columns are
visible by default.

#### Scenario: Sales table at 1280 px
- **WHEN** the sales demo (4 finished sales at B3 on 05/Oct/2026: 8,000, 10,000, 11,000 and 15,000) is shown
  in `en` at 1280 px
- **THEN** the column header reads `Amount (Ks)`, the cells read `8,000`, `10,000`, `11,000` and `15,000`
  right-aligned, and the totals row reads `44,000` (8,000 + 10,000 + 11,000 + 15,000 = 44,000)

#### Scenario: Sorting
- **WHEN** the user presses the header "Finished on" (no sort is active) twice
- **THEN** the table reports the sort value `-finished_at` and then `finished_at`
- **AND** the header "Barber", which has no sort key, is not a button

#### Scenario: Column limit on a tablet
- **WHEN** a table with 9 defined columns is shown at 768 px
- **THEN** 7 columns are visible and the "Columns" menu lists all 9
- **AND** with a touch pointer each row is 56 px high, and with a mouse pointer at 1280 px each row is 48 px
  high

#### Scenario: Column choice is per user
- **WHEN** the column "Services" is hidden with `as=admin`, the catalogue is reloaded with `as=manager` and
  then again with `as=admin`
- **THEN** the column is visible for the manager persona and still hidden for the admin persona

### Requirement: Lists become cards below 768 px (AD-LIST-02 · AD-LAY-03)

Below 768 px the data of a `DataTable` SHALL be shown as a `CardList` with at most 4 fields and one inline
primary action per card, and the page never scrolls sideways.

#### Scenario: The sales list at 320 px
- **WHEN** the sales demo is shown at 320 px
- **THEN** there is no `<table>`; each sale is a card with the receipt number, the barber, the amount with its
  unit (`8,000 Ks`) and the status badge, and the page's scroll width equals 320 px

#### Scenario: Boundary at 767 and 768 px
- **WHEN** the sales demo is shown at 767 px and at 768 px
- **THEN** it is a card list at 767 px and a table at 768 px

#### Scenario: A fifth card field does not compile
- **WHEN** a card definition returns 5 fields
- **THEN** `pnpm typecheck` fails on that line (4 fields compile)

### Requirement: Filters live in the address (AD-LIST-01 · AD-LIST-05 · AD-FMT-11)

`FilterBar` SHALL offer a search box whose placeholder says what it searches, the date presets Today,
Yesterday, This week, Last 7 days, This month, Last month and Custom computed on Myanmar business dates,
multi-select status chips, and removable chips for the active filters with "Clear all"; the filter state SHALL
be mirrored in the query string (`q`, `from`, `to`, repeated `status`).

#### Scenario: Date presets on Monday 05/Oct/2026
- **WHEN** each preset is chosen with the default catalogue clock
- **THEN** the address carries: Today `from=2026-10-05&to=2026-10-05`; Yesterday `from=2026-10-04&to=2026-10-04`;
  This week `from=2026-10-05&to=2026-10-11`; Last 7 days `from=2026-09-29&to=2026-10-05`; This month
  `from=2026-10-01&to=2026-10-31`; Last month `from=2026-09-01&to=2026-09-30`

#### Scenario: "Today" changes at midnight Myanmar Time
- **WHEN** Today is chosen with the catalogue clock at `2026-10-05T17:29:00Z` and at `2026-10-05T17:30:00Z`
- **THEN** the range is `2026-10-05` for the first and `2026-10-06` for the second

#### Scenario: Status chips
- **WHEN** the user selects the booking statuses BOOKED and STARTED and reloads the page
- **THEN** the address contains `status=1&status=2`, two removable chips are shown, and "Clear all" removes
  both parameters

### Requirement: Lists page with the cursor contract (AD-LIST-05 · API-DATA-08 · API-LIM-03)

List paging SHALL consume `{ items, next_cursor, total }`, request 25 rows by default, offer 50 and 100 from
1024 px and never more than 100, show the total only when `total` is not `null`, offer no next page when
`next_cursor` is `null`, and restart from the first page when a filter changes.

#### Scenario: Paging through 56 rows
- **WHEN** the 56-row demo list is paged with the default size
- **THEN** page 1 shows rows 1–25 and the total `56`, page 2 rows 26–50, page 3 rows 51–56
  (25 + 25 + 6 = 56), and on page 3 no next page is offered

#### Scenario: Page size limit
- **WHEN** the page-size menu is opened at 1280 px and 100 is chosen
- **THEN** the options are 25, 50 and 100 and the next request carries `limit=100`

#### Scenario: Unknown total and filter change
- **WHEN** the demo answers `total: null`, and then the user changes the search text while on page 2
- **THEN** no total is shown, and after the change the list shows rows from the first page

### Requirement: Loads over 400 ms show a skeleton, never a centred spinner (AD-STATE-01 · AD-PERF-02)

A component that waits for data longer than 400 ms SHALL show a skeleton shaped like its content; a blank
area with a centred spinner is never shown.

#### Scenario: Skeleton only for slow loads
- **WHEN** the slow demo (2 s) and the fast demo (200 ms) are run
- **THEN** the slow one shows skeleton cards from 400 ms until the data arrives, and the fast one never shows
  a skeleton

#### Scenario: Table loading
- **WHEN** the `DataTable` demo is in the loading state for more than 400 ms
- **THEN** skeleton rows in the shape of table rows are shown and no centred spinner appears

### Requirement: An empty state explains the area and offers only an allowed action (AD-STATE-02 · AD-PERM-02)

`EmptyState` SHALL explain what the area is for and the next step, and show its action only when the caller
marks it as allowed.

#### Scenario: Empty bookings for a manager and a barber
- **WHEN** the empty bookings demo is shown in `en` with `as=manager` and with `as=barber`
- **THEN** both show "No bookings today. Walk-ins are recorded from ＋ Start."; the manager (grant
  `booking.create` at B3) sees the "New booking" button and the barber (no grant) does not

### Requirement: A locked record shows a lock banner and its values as text (AD-DET-03 · AD-STATE-06 · AD-PERM-02)

`LockBanner` SHALL state the locked state, who locked it and when, and the correction path; the locked form
SHALL show its values as text instead of disabled inputs; a correction action is shown only to a user who may
take it.

#### Scenario: Closed day for a manager and an admin
- **WHEN** the closed-day demo is shown in `en` with `as=manager` and with `as=admin`
- **THEN** the banner reads "04/Oct/2026 at Point 3.0 was closed by Ma Hnin at 9:05 PM" and "An admin can
  reopen the day", and the form below shows values as text with no input element
- **AND** the manager (no `closing.reopen` grant) sees no "Reopen day" button and the admin (grant
  `closing.reopen` at company scope) sees it

### Requirement: An offline banner stays while the connection is down (AD-STATE-05 · D-VIS-13)

`OfflineBanner` SHALL stay at the top while the browser is offline or the API is reported unreachable, with the
text of key `common.offline.banner` and a link to the late-entry help; form inputs keep their values and
nothing is queued.

#### Scenario: Offline banner text
- **WHEN** the browser goes offline while `8000` is typed in the MoneyInput demo, in `en`
- **THEN** a banner at the top reads "No connection. Money actions can't be saved right now. Write the service
  on paper and add it later with Late entry." with a link to the late-entry help
- **AND** the field still shows `8,000`, and the banner disappears when the connection returns

### Requirement: Success toasts are short and shown one at a time (AD-TOAST-01 · AD-A11Y-04)

A toast SHALL be used only for a success confirmation, stay 4 seconds, be shown one at a time, sit at the
bottom above the bottom navigation below 768 px and top-right from 768 px, and be announced through
`aria-live="polite"`.

#### Scenario: One toast at a time
- **WHEN** two success toasts are raised 1 second apart
- **THEN** only the second is visible after the second is raised, and it disappears 4 seconds after it appeared

#### Scenario: Position
- **WHEN** a toast is raised at 320 px and at 1280 px
- **THEN** at 320 px it sits above the bottom navigation and at 1280 px in the top-right corner, inside an
  `aria-live="polite"` region

### Requirement: `can()` mirrors the grants of `/me` by data level (AD-PERM-01 · AD-PERM-03 · AD-PERM-05 · AD-META-06 · API-AUTH-05 · D-ROLE-03 · D-ROLE-08)

`can(code, options)` SHALL be built from the grants `[{ code, scope_type, branch_ids }]` and the effective
flags of the `/me` payload and from each code's level in the permission catalogue: without options it is true
when the user holds any grant of the code; with `{ branchId }` it is true when a grant of the code has
`scope_type` 1 (COMPANY) or has `scope_type` 2 (BRANCHES) with that branch in `branch_ids`; with
`{ level: 'company' }` it is true only with a company-scope grant; a code of level `shared` is true with any
grant; a code of level `private` is true only with a company-scope grant; `earnings.view_own` equals the
effective `show_own_earnings` flag. A code that is not in the catalogue SHALL be a TypeScript error.

#### Scenario: Branch scope
- **WHEN** Ma Hnin (grant `booking.delete`, `scope_type` 2, branches [B3]) is checked for `booking.delete` at
  B3 and at B1
- **THEN** `can` is true for B3 and false for B1

#### Scenario: Company scope reaches every branch
- **WHEN** U Kyaw Zin (grant `booking.delete`, `scope_type` 1) is checked for `booking.delete` at B1
- **THEN** `can` is true

#### Scenario: Company-level target of a mixed code
- **WHEN** Ma Hnin holds `service.update` with branch scope [B3]
- **THEN** `can('service.update', { level: 'company' })` is false and `can('service.update', { branchId: B3 })`
  is true, while both are true for U Kyaw Zin

#### Scenario: Private code at branch scope gives nothing
- **WHEN** the `branch-holder` persona (grant `payroll.view`, `scope_type` 2, branches [B3]) is checked
- **THEN** `can('payroll.view')` is false; for U Kyaw Zin (`scope_type` 1) it is true

#### Scenario: Shared code
- **WHEN** Ma Hnin holds `customer.update` with branch scope [B3]
- **THEN** `can('customer.update')` is true

#### Scenario: Own-earnings flag
- **WHEN** the effective flag `show_own_earnings` is false and then true
- **THEN** `can('earnings.view_own')` is false and then true

#### Scenario: A mistyped code does not compile
- **WHEN** a component calls `can('booking.delet')`
- **THEN** `pnpm typecheck` fails on that line

### Requirement: `PermissionGate` hides what the user may never do and never shows an enabled control that would be refused (AD-PERM-02 · AD-PERM-04 · AD-DET-03)

`PermissionGate` SHALL render nothing when `can()` is false. When the user holds the permission but the
record's state forbids the action, the control SHALL either be hidden under a `LockBanner` or be rendered
disabled with the reason as helper text; an enabled control that the API would refuse is never shown.

#### Scenario: A barber never sees the cancel button
- **WHEN** the gate demo is opened with `as=barber` (Ko Aung, no `booking.delete` grant)
- **THEN** the page contains no "Cancel booking" button, enabled or disabled

#### Scenario: State forbids the action — disabled with the reason
- **WHEN** the gate demo is opened with `as=manager` and the demo marks the day as closed with a reason text
- **THEN** the "Cancel booking" button is shown disabled with the reason text under it

#### Scenario: State forbids the action — hidden under the lock banner
- **WHEN** the same demo is set to the lock-banner variant
- **THEN** the page shows the `LockBanner` and no "Cancel booking" button

### Requirement: The app shell changes its layout at 768 px and 1024 px (AD-VIS-10 · AD-LAY-01 · AD-LAY-02 · AD-LAY-03 · AD-VIS-11)

`AppShell` SHALL show, below 768 px, a top app bar and a bottom navigation; from 768 to 1023 px an icon rail
without the sub-navigation panel; and from 1024 px the icon rail (64 px), a collapsible sub-navigation panel
(240 px) and a top bar with the branch switcher at the far left. Every navigation icon has a visible text
label.

#### Scenario: Layout at the breakpoints
- **WHEN** the shell demo is shown at 767, 768, 1023 and 1024 px
- **THEN** at 767 px there is a bottom navigation and no rail; at 768 and 1023 px there is a rail, no bottom
  navigation and no sub-navigation panel; at 1024 px there is a 64 px rail, a 240 px sub-navigation panel and
  the branch switcher is the first element of the top bar

#### Scenario: Myanmar labels at 320 px
- **WHEN** the shell demo is shown at 320 px with `lang=my`
- **THEN** every navigation item shows its label on one or more full lines (no ellipsis, no hidden overflow)
  and the page's scroll width equals 320 px

### Requirement: The bottom navigation has at most five labelled items (AD-NAV-01 · AD-LAY-03 · AD-VIS-11)

`BottomNav` SHALL show at most 5 items, each with an icon and a visible label, the centre item filled with
`--primary`, and no centre item when the user has no create action.

#### Scenario: Bottom navigation of a barber
- **WHEN** the shell demo is shown at 320 px with `as=barber` in `en`
- **THEN** the bottom navigation has the 5 items Today, Bookings, ＋ Start, Customers and More, each with a
  visible label, and "＋ Start" is the filled centre item

#### Scenario: No create action
- **WHEN** the bottom navigation is configured without a centre action
- **THEN** it shows 4 items and no centre button

#### Scenario: A sixth item does not compile
- **WHEN** `BottomNav` is given 6 items
- **THEN** `pnpm typecheck` fails on that line (5 items compile)

### Requirement: The branch switcher offers only branches in scope and remembers the choice per user (AD-NAV-04 · AD-PERM-04 · D-DSH-01 · D-ROLE-03)

`BranchSwitcher` SHALL list only the branches in the user's scope, offer "All branches" only to a
company-scope user, mirror the choice in the address as `?branch=<code>`, and store the choice per user on the
device so that it is restored when the address carries no `branch`.

#### Scenario: Branch switcher follows the scope
- **WHEN** the shell demo is opened with `as=manager` and with `as=admin`
- **THEN** Ma Hnin sees only "Point 3.0" and no "All branches"; U Kyaw Zin sees "All branches", "Point 1.0",
  "Point 2.0" and "Point 3.0"

#### Scenario: The branch choice is in the address
- **WHEN** U Kyaw Zin chooses "Point 3.0"
- **THEN** the address contains `branch=B3`, and opening that address again shows "Point 3.0" as selected

#### Scenario: The choice is remembered per user
- **WHEN** U Kyaw Zin chose "Point 2.0", the catalogue is opened with `as=manager` and then again with
  `as=admin`, both without a `branch` parameter
- **THEN** the manager persona shows "Point 3.0" and the admin persona shows "Point 2.0" again

### Requirement: A page header has one primary action and at most two visible secondary actions (AD-LAY-05 · AD-LAY-04)

`PageHeader` SHALL show the title, an optional subtitle, one primary action and at most 2 secondary actions,
with the rest in a menu.

#### Scenario: Page header actions
- **WHEN** a `PageHeader` receives one primary and four secondary actions
- **THEN** it shows one filled button, two secondary buttons and a menu holding the other two

#### Scenario: Exactly two secondary actions
- **WHEN** it receives two secondary actions
- **THEN** both are visible and there is no menu

### Requirement: A stepper shows where the user is in a multi-step flow (AD-CMP-12 · AD-WIZ-01)

`Stepper` SHALL show all steps in a row with connectors from 768 px and the compact form
"Step N of M · <step name>" with a progress bar below 768 px; completed steps show a check and can be pressed;
later steps cannot.

#### Scenario: Stepper on desktop and phone
- **WHEN** the four-step demo (Services, Payment, Review, Finish) is on step 2 at 1280 px and at 320 px in `en`
- **THEN** at 1280 px four steps are shown with a check on "Services"; at 320 px the text reads
  "Step 2 of 4 · Payment" above a progress bar

#### Scenario: Going back to a completed step
- **WHEN** the user presses the completed step "Services"
- **THEN** the stepper reports that step; pressing the later step "Finish" reports nothing

### Requirement: KPI tiles show a value, its comparison and its freshness (AD-DSH-02 · AD-DSH-03)

`KpiTile` SHALL show a label, the value in `text-3xl` with tabular digits, a comparison made of an arrow, a
percentage and a text, and the time it was updated; a row holds at most 6 tiles.

#### Scenario: KPI tile
- **WHEN** the tile "Sales today" is shown with value 44,000, previous value 40,000 and comparison `10%` up
  ((44,000 − 40,000) ÷ 40,000 = 10 %), updated at `2026-10-05T10:42:00+06:30`, in `en`
- **THEN** it shows `44,000 Ks` in `text-3xl`, `▲ 10%` with a text label, and `Updated 10:42 AM`

#### Scenario: Six and seven tiles
- **WHEN** a KPI row receives 6 tiles and then 7 tiles at 1280 px
- **THEN** 6 tiles fill one row; with 7 the first row holds 6 tiles and the seventh starts a second row

### Requirement: Charts are simple, labelled and have a table view (AD-CHART-01 · AD-A11Y-07)

`BarChart` and `LineChart` SHALL colour at most 6 series from `--chart-1` … `--chart-6`, label values, write a
money axis with thousands separators and the unit, offer a "Show as table" view, and below 768 px show a
ranked list with inline bars.

#### Scenario: Bar chart and its table
- **WHEN** the revenue demo (Point 1.0 60,000 · Point 2.0 70,000 · Point 3.0 44,000) is shown in `en` at
  1280 px and "Show as table" is pressed
- **THEN** the chart shows three labelled bars `60,000`, `70,000` and `44,000` with the axis title
  `Amount (Ks)`, and the table lists the same three rows with `<th scope="col">` headers

#### Scenario: Chart on a phone
- **WHEN** the revenue demo is shown at 320 px
- **THEN** it is a ranked list in the order Point 2.0 `70,000`, Point 1.0 `60,000`, Point 3.0 `44,000`, each
  with an inline bar

#### Scenario: Six and seven series
- **WHEN** a chart receives 6 series and then 7 series
- **THEN** 6 series are drawn in `--chart-1` … `--chart-6`, and 7 series raise an error that names the limit

### Requirement: `TimeSlotPicker` shows only the start times it is given (AD-BKG-01 · D-PLT-05)

`TimeSlotPicker` SHALL show only the start times it receives, in 12-hour format, as a radio group, and mark the
chosen time with an icon as well as the fill.

#### Scenario: Available start times only
- **WHEN** the slot demo receives the start times 10:00, 10:15 and 10:45 on 05/Oct/2026
- **THEN** it shows the three options `10:00 AM`, `10:15 AM` and `10:45 AM` and no `10:30 AM`
- **AND** choosing `10:15 AM` reports `2026-10-05T10:15:00+06:30` and marks the option with a check icon

#### Scenario: No start time left
- **WHEN** the slot demo receives an empty list in `en`
- **THEN** it shows the text of key `common.slots.empty` ("No times left on this day")

### Requirement: `OptionPicker` offers only sold combinations and shows the price before "Add" (AD-POS-05 · FE-BK-06 · D-SVC-05 · FE-IMPL-03)

`OptionPicker` SHALL show the first option group as chips, then the second group limited to the combinations
it receives as sold, and show the chosen combination's price and duration before the "Add" button; it opens as
a bottom sheet below 768 px and as a popover from 768 px, and formats money with the profile of the tree it
runs in.

#### Scenario: Only sold combinations
- **WHEN** the Hair colour demo at B3 is opened (Black: Short 25,000 · Medium 30,000 · Long 35,000; Brown:
  Short 28,000 · Medium 33,000; Brown · Long not sold) and "Brown" is chosen
- **THEN** the second group offers only "Short" and "Medium"

#### Scenario: Price and duration before Add
- **WHEN** "Black" and "Short" are chosen in `en`, in `my`, and in `my` with `theme=site`
- **THEN** the picker shows `25,000 Ks` and `1 h 30 min`; `25,000 ကျပ်` and `1 နာရီ 30 မိနစ်`; and
  `25,000 Ks` and `1 နာရီ 30 မိနစ်`
- **AND** "Add" reports that combination with the price 25000 and 90 minutes

### Requirement: `PriceGridEditor` distinguishes "not sold", zero and the inherited home price (AD-CMP-13 · D-SVC-05 · D-SVC-06 · D-SVC-08)

`PriceGridEditor` SHALL lay out at most 2 option groups as rows and columns with tabs for branch and for
Shop / Home; an empty Shop cell means "not sold" and is shown as `—`, while 0 is a valid price; an empty Home
cell shows the inherited shop price as a placeholder; the "Change prices from" date defaults to tomorrow's
Myanmar date; in read-only mode cells are text.

#### Scenario: Empty and zero in the Shop grid
- **WHEN** the Shop tab of the Hair colour grid at B3 is shown in `en`, the cell Brown · Long is left empty and
  the cell Brown · Short is changed to `0`
- **THEN** Brown · Long shows `—` with the tooltip "Not sold here" and is reported as `null`, and
  Brown · Short is reported as the price 0

#### Scenario: Home cell inherits the shop price
- **WHEN** the Home tab of Haircut at B2 (shop price 7,000) has no home price, in `en`
- **THEN** the cell shows the placeholder "Uses shop price · 7,000 Ks" and is reported as `null`

#### Scenario: Effective date
- **WHEN** the editor is opened with the default catalogue clock
- **THEN** the "Change prices from" date shows `06/Oct/2026`

#### Scenario: A third option group does not compile
- **WHEN** the editor is given 3 option groups
- **THEN** `pnpm typecheck` fails on that line (2 groups compile)

### Requirement: `NotificationBell` renders the unread count and the list from typed data (AD-NTF-01 · D-NTF-01 · D-NTF-02 · AD-FMT-09)

`NotificationBell` SHALL show the unread count as a badge capped at `99+` and no badge at 0, and a panel
grouped into "Today" and "Earlier" by Myanmar date in which each item has a category icon, its text, a
relative time and a link, with "Mark all read" and a delete action per item. It SHALL work from properties
alone and perform no network request.

#### Scenario: Badge boundaries
- **WHEN** the bell receives the unread counts 0, 99 and 100
- **THEN** it shows no badge, `99`, and `99+`

#### Scenario: Grouping and relative time
- **WHEN** the bell demo is opened in `en` with the default catalogue clock and three notifications created
  at 10:37 AM and 8:42 AM on 05/Oct/2026 and at 9:01 AM on 04/Oct/2026
- **THEN** "Today" lists the first two with `5 min ago` and `2 h ago`, and "Earlier" lists the third with
  `04/Oct/2026`

#### Scenario: Mark all read
- **WHEN** the user presses "Mark all read"
- **THEN** the handler is called once and no request leaves the page

### Requirement: `ApprovalCard` shows a request with its resulting value and the decision actions (AD-NTF-04 · AD-POS-16 · AD-PERM-02)

`ApprovalCard` SHALL show the requester as an `EmployeeChip`, the branch, the facts of the request, the
resulting value emphasised, the reason, and the actions "Approve" and "Reject" only when the caller marks the
user as allowed to decide. It SHALL work from properties alone and perform no network request.

#### Scenario: Discount approval card
- **WHEN** the approval demo (Ko Min at Point 3.0, Haircut + Shave, subtotal 11,000, requested discount 1,000)
  is shown in `en` with the decide flag on
- **THEN** it shows `Subtotal 11,000 Ks`, `Discount 1,000 Ks` and, emphasised, `Total 10,000 Ks`
  (11,000 − 1,000 = 10,000), the reason, and the buttons "Approve" and "Reject"

#### Scenario: A viewer who may not decide
- **WHEN** the same card is rendered with the decide flag off
- **THEN** it shows the same facts and neither "Approve" nor "Reject"

### Requirement: `QrScanner` reports one decoded text and explains a missing or refused camera (AD-ATT-01 · AD-QA-03)

`QrScanner` SHALL open full screen with a frame and a hint, report the decoded text once, accept a mock source
that reports a given text without a camera, and show an explanation with a close button instead of failing
when camera access is denied or no camera exists.

#### Scenario: Mock scan
- **WHEN** the scanner demo is opened with the mock source `https://app.point.test/clock?t=FIXTURE-TOKEN`
- **THEN** the result handler is called once with exactly that text and the scanner shows its hint text

#### Scenario: Camera permission denied
- **WHEN** the scanner demo is opened with the camera source and the browser denies camera access
- **THEN** the text of key `common.qr.permissionDenied` is shown with a close button and no error is thrown

#### Scenario: No camera
- **WHEN** the scanner demo is opened with the camera source on a device without a camera
- **THEN** the text of key `common.qr.noCamera` is shown with a close button and no error is thrown

### Requirement: `ReceiptRenderer` shows a receipt in English in the order of the guideline (AD-RCPT-01 · D-PAY-06 · D-DB-04)

`ReceiptRenderer` SHALL lay out a `ReceiptView` in the order of AD-RCPT-01 in English whatever the UI language
is, using the English description of a line and its Myanmar description only when the English one is empty.

#### Scenario: Receipt is English in the Myanmar UI
- **WHEN** the receipt demo (B3-2026-OCT-00003, 05/Oct/2026 10:42 AM, Point 3.0, barber Ko Min, customer
  Ma Su `09•••••456`, Haircut 8,000 + Shave 3,000, Cash 5,000 + KBZPay 6,000 ref `KBZ0001234567`) is shown with
  `lang=my`
- **THEN** the labels are English, the receipt number reads `B3-2026-OCT-00003`, the lines read `8,000 Ks` and
  `3,000 Ks`, and the total reads `11,000 Ks` (8,000 + 3,000 = 11,000) with the payments `5,000 Ks` and
  `6,000 Ks`

#### Scenario: Line without an English description
- **WHEN** a receipt line has `description_en: null` and `description_mm: "မုတ်ဆိတ်ရိတ်"`
- **THEN** the line shows `မုတ်ဆိတ်ရိတ်`

### Requirement: `AttachmentUploader` checks type and size before uploading and reports that it is busy (AD-FORM-16 · API-LIM-03)

`AttachmentUploader` SHALL show the allowed file types and the size limit it is given, refuse a file above the
limit (limit in MB × 1,048,576 bytes) or of another type before uploading, show a progress bar and report
"busy" while an upload runs, and let the user remove a file.

#### Scenario: Upload size boundary
- **WHEN** the uploader demo (purpose `image`, limit 10 MB) receives a file of 10,485,760 bytes and then one
  of 10,485,761 bytes (10 × 1,048,576 = 10,485,760)
- **THEN** the first is uploaded with a progress bar; the second is refused with the message of key
  `error.file_too_large` (English: "The file is larger than 10 MB.") and the upload function is not called

#### Scenario: Wrong type and busy state
- **WHEN** a PDF is chosen for purpose `image`, and then a JPEG upload is running
- **THEN** the PDF is refused with the message of key `error.file_type_not_allowed`; while the JPEG uploads
  the demo form's submit button is disabled, and it is enabled again when the upload ends

### Requirement: Lint fails on literal UI text (AD-L10N-01 · AD-IMPL-05 · D-PLT-03)

`pnpm lint` and the CI pipeline SHALL fail on a raw text string in JSX and in the attributes `aria-label`,
`placeholder`, `title` and `alt`, in `apps/web` and `packages/ui` — the catalogue demos included.

#### Scenario: Raw text in JSX
- **WHEN** a component contains `<button>Save</button>` and `pnpm lint` runs
- **THEN** the command fails and names the line

#### Scenario: Raw text in an attribute
- **WHEN** a component contains `<input placeholder="Name or phone" />`
- **THEN** `pnpm lint` fails; `placeholder={t('common.search.placeholder')}` passes

### Requirement: Lint and guards fail on a colour or font outside the token file (AD-VIS-01 · AD-IMPL-05 · D-UX-02)

`pnpm lint`, `pnpm guards` and the CI pipeline SHALL fail on a hex colour, an `rgb()` / `hsl()` / `oklch()`
colour, a Tailwind palette class or an arbitrary colour class outside `packages/ui/tokens.css` and its
reference snapshot, and on a `font-family` declaration (CSS) or `fontFamily` style outside
`packages/ui/tokens.css`.

#### Scenario: Colours in component code
- **WHEN** a component uses `className="bg-blue-500"`, `className="text-[#DC5F00]"` or
  `style={{ color: '#000' }}`
- **THEN** `pnpm lint` fails for each of the three cases

#### Scenario: Colour in a CSS file
- **WHEN** a CSS file other than `tokens.css` contains `#EEEEEE`
- **THEN** `pnpm guards` fails and names the file

#### Scenario: Font family outside the token file
- **WHEN** a component stylesheet contains `font-family: Arial`
- **THEN** `pnpm guards` fails; a `font-family` declaration inside `packages/ui/tokens.css` passes

### Requirement: Lint fails on number arithmetic on money (AD-IMPL-05 · API-DATA-02 · D-PLT-04)

`pnpm lint` and the CI pipeline SHALL fail on `parseFloat`, and on `Number()`, `parseInt()`, unary `+` or an
arithmetic operator applied to a value named `amount` or whose name ends in `_amount` or `Amount`, outside
`packages/shared/src/money`.

#### Scenario: Float money
- **WHEN** a file contains `parseFloat('7000')`, `sale.total_amount * 2` or `Number(amount)`
- **THEN** `pnpm lint` fails for each of the three

#### Scenario: The money module is allowed
- **WHEN** `packages/shared/src/money/sum.ts` adds two `Mmk` values with `+`
- **THEN** `pnpm lint` passes

### Requirement: Lint fails on locale formatting outside the formatter (AD-FMT-00 · AD-IMPL-05 · D-PLT-05)

`pnpm lint` and the CI pipeline SHALL fail on `toLocaleString`, `toLocaleDateString`, `toLocaleTimeString` and
`Intl.NumberFormat` / `Intl.DateTimeFormat` / `Intl.RelativeTimeFormat` outside `packages/shared/src/format`,
and on local-time `Date` getters and setters outside `packages/shared/src/time` and `src/format`.

#### Scenario: Formatting outside the formatter
- **WHEN** a component calls `amount.toLocaleString()` or `new Intl.DateTimeFormat()`
- **THEN** `pnpm lint` fails; the same call inside `packages/shared/src/format` passes

#### Scenario: Device-zone getter
- **WHEN** a component calls `date.getHours()`
- **THEN** `pnpm lint` fails

### Requirement: Lint fails on a status compared with or set to a number (AD-IMPL-04 · D-DB-03 · API-DATA-04)

`pnpm lint` and the CI pipeline SHALL fail when a member named `status` or ending in `_status` is compared
with, or assigned, a number literal.

#### Scenario: Raw status number
- **WHEN** a component contains `booking.status === 2` or `{ status: 2 }`
- **THEN** `pnpm lint` fails for both, and `booking.status === BookingStatus.STARTED` passes

### Requirement: Raw form elements and Radix primitives are used only inside `packages/ui` (AD-IMPL-02 · AD-IMPL-06)

`pnpm lint` and the CI pipeline SHALL fail when code outside `packages/ui` renders a raw `<button>`, `<input>`,
`<select>` or `<textarea>` or imports from `@radix-ui/*`.

#### Scenario: A hand-made input in a screen
- **WHEN** a file under `apps/web/app/staff` contains `<input type="text" />` or imports `@radix-ui/react-dialog`
- **THEN** `pnpm lint` fails for both; the same code inside `packages/ui/src` passes

### Requirement: Accessibility is checked statically and on the catalogue (AD-A11Y-01 · AD-IMPL-05 · AD-QA-01)

`pnpm lint` SHALL run the accessibility lint rules on `apps/web` and `packages/ui`, and the CI pipeline SHALL
run the axe suite on the catalogue and fail on any violation of WCAG 2.1 A / AA.

#### Scenario: Static check
- **WHEN** a component contains `<img src={url} />` without `alt`
- **THEN** `pnpm lint` fails with the accessibility rule that names the missing attribute

#### Scenario: Accessibility check on the catalogue
- **WHEN** the axe suite runs on the catalogue with `theme=staff` and with `theme=site`, in `my` and `en`, at
  320 and 1280 px
- **THEN** it reports 0 violations for the tags `wcag2a`, `wcag2aa`, `wcag21a` and `wcag21aa`
- **AND** removing the label of one demo input makes the suite fail with the rule `label`

### Requirement: The catalogue `/dev/ui` exists only outside the production image (AD-IMPL-06 · AD-PERM-01)

The staff tree SHALL serve the page `/dev/ui` only in a build made with the catalogue flag
(`NEXT_PUBLIC_DEV_CATALOGUE=1`), which is set only inside the scripts `dev` and `build:catalogue`; the flag
MUST NOT appear in any `.env*` file, Dockerfile, Compose file, CI workflow or `next.config.*`. In the
production image, and on the site host in every build, the path SHALL answer 404. The page SHALL need no
session and call no `/api` endpoint.

#### Scenario: Open without a session
- **WHEN** `/dev/ui` is requested on the staff host of the development server or of the catalogue test build
  without a session cookie
- **THEN** the page answers 200 and no request to a path starting with `/api` is made while it loads

#### Scenario: Not in production
- **WHEN** `/dev/ui` is requested on the staff host of the stack built from the production images
- **THEN** the answer is 404

#### Scenario: Not on the public site
- **WHEN** `/dev/ui` is requested on the site host of the catalogue test build
- **THEN** the answer is 404

#### Scenario: The flag in an environment file or a workflow
- **WHEN** `NEXT_PUBLIC_DEV_CATALOGUE` is written into `.env.example`, a file under `.github/workflows/`,
  `apps/web/Dockerfile`, a Compose file or `next.config.*` and `pnpm guards` runs
- **THEN** the guard fails and names the file

#### Scenario: Environment files stay out of the image build
- **WHEN** `.dockerignore` does not exclude `.env*` and `pnpm guards` runs
- **THEN** the guard fails

### Requirement: The catalogue shows every shared component in both languages (AD-IMPL-06 · AD-IMPL-02 · AD-QA-01)

The catalogue SHALL render from fixture data every entry of AD-IMPL-02 — 37 components and `can()` — plus the
supporting `Button`, `FormField`, `Dialog`, `Skeleton`, `Toaster`, `LanguageSwitch` and `DataText`, in Myanmar
and English at 320 and 1280 px, with the parameters `lang`, `theme`, `as` and `now`.

#### Scenario: Every shared component has a demo
- **WHEN** the unit test reads the catalogue manifest
- **THEN** it finds one entry with at least one demo for each of the 38 names of AD-IMPL-02 (`AppShell`,
  `BranchSwitcher`, `BottomNav`, `PageHeader`, `FilterBar`, `DataTable`, `CardList`, `StatusBadge`, `FlagChip`,
  `EmployeeChip`, `MoneyInput`, `MoneyText`, `PhoneInput`, `BilingualInput`, `DateInput`, `DateText`,
  `TimeSlotPicker`, `OptionPicker`, `PriceGridEditor`, `ReasonDialog`, `ConfirmDialog`, `Drawer`, `Sheet`,
  `Stepper`, `EmptyState`, `ErrorState`, `LockBanner`, `OfflineBanner`, `PermissionGate`, `can`,
  `NotificationBell`, `ApprovalCard`, `QrScanner`, `ReceiptRenderer`, `AttachmentUploader`, `KpiTile`,
  `BarChart`, `LineChart`) and for each of the 7 supporting names

#### Scenario: Both languages at both widths
- **WHEN** the catalogue is opened with `lang=my` and `lang=en` at 320 px and at 1280 px
- **THEN** in all four cases every demo renders, the page's scroll width equals the viewport width, and no
  element that hides its overflow has a scroll width larger than its client width

#### Scenario: Persona parameter
- **WHEN** the catalogue is opened with `as=barber` and then `as=admin`
- **THEN** the permission-dependent demos show Ko Aung's view and then U Kyaw Zin's view

### Requirement: A shared component is done only when it passes the component checklist (AD-QA-01 · AD-QA-02 · AD-A11Y-02 · AD-A11Y-03 · AD-A11Y-04 · AD-A11Y-05 · AD-L10N-04 · AD-L10N-05)

A shared component SHALL be merged only when all of the following hold: (1) the catalogue shows it with every
state it supports in `my` and `en` at 320 and 1280 px, and at 360 and 768 px for the components whose layout
changes at 768 px (`DataTable`, `CardList`, `Drawer`, `Stepper`, `BarChart`, `LineChart`, `AppShell`), without
clipped or overflowing text; (2) each interactive target is at least 44 × 44 px with at least 8 px between
adjacent targets; (3) every action is reachable by keyboard in a logical order with a visible 2 px focus
outline (staff: `--foreground`; site: `--ring`); (4) every input has a visible label and every icon-only control an `aria-label`; (5) status, flags
and validation combine colour, icon and text; (6) all text comes from the language files and all formats from
the shared formatter; (7) labels wrap instead of being truncated, and the page is usable at 200 % zoom;
(8) the axe suite reports 0 violations; (9) each rule the component implements has a unit or component test;
(10) the pull request lists the rule IDs it implements and the result of the "what can be removed?" review.

#### Scenario: Touch targets on a phone
- **WHEN** the automated check measures every button, link, input, checkbox, radio and chip of the catalogue
  at 320 px
- **THEN** each hit area is at least 44 px wide and 44 px high, and adjacent targets are at least 8 px apart

#### Scenario: Keyboard walk through a dialog
- **WHEN** the ReasonDialog demo is opened with Enter on its trigger and Tab is pressed repeatedly
- **THEN** the focus moves reason options → note → "Keep" → the confirm button and back to the first, never
  leaving the dialog, and each focused control shows a 2 px outline in the colour of the staff `--foreground`
- **AND** Esc closes the dialog and returns the focus to the trigger

#### Scenario: Zoom
- **WHEN** the catalogue is shown in a 640 px viewport at device scale factor 2 (1280 px at 200 % zoom)
- **THEN** the page's scroll width equals 640 px and every control passes the 44 px check

#### Scenario: Layout-changing components at 360 and 768 px
- **WHEN** the demos of `DataTable`, `CardList`, `Drawer`, `Stepper`, the charts and `AppShell` are shown in
  `my` and `en` at 360 px and at 768 px
- **THEN** at 360 px they show their phone form and at 768 px their tablet form, with a page scroll width
  equal to the viewport width in all four cases

#### Scenario: Long Myanmar label
- **WHEN** a `Button` and a `StatusBadge` receive a Myanmar label longer than their container at 320 px
- **THEN** the label wraps onto a second line, and neither element has `text-overflow: ellipsis` or a scroll
  width larger than its client width
