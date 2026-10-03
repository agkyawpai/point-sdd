# Design — add-shared-ui-components

## Context

- The scaffold (`add-repo-scaffold`) leaves: `packages/ui` and `packages/i18n` empty; `packages/shared` with
  `src/schemas/`, `src/constants/error-codes.ts` and `definitions/permissions.json` (`[]`); one Next.js 16 app
  with one root layout and two placeholder trees, `apps/web/app/staff/` and `apps/web/app/site/`, selected by
  the host rewrite in `proxy.ts` (ADR-001); a root `e2e/` folder; `pnpm guards` (= every
  `tools/guards/check-*.mjs`); and four AD-IMPL-05 guard rails already on (raw JSX strings, hex / arbitrary
  colour classes, `font-family` outside `tokens.css`, `parseFloat`). Tailwind, shadcn/ui, next-intl, TanStack
  Query and React Hook Form are **not** installed there — the scaffold hands them to this change.
- Both developers build feature screens on top of the pieces of AD-IMPL-02; the owner put them first
  (D-PLT-18 #3 build order: token file + shared components + formatter + language-file skeleton).
- This change runs in parallel with `add-foundation-auth-access`. Nothing here may need a session, the API or
  the database: components take typed props and are shown with fixture data on `/dev/ui` (AD-IMPL-06 — the
  owner chose the page over Storybook, D-ENG-01).
- Colours: the website palette is complete — the owner's three colours of 02/Oct/2026 and, since the owner's
  approval of REC-41 on 02/Oct/2026 13:46, the remaining site tokens (FE-VIS-01a v1.7, D-UX-02). The admin
  palette is still ★ OPEN-30, so the staff tree stays on the shadcn/ui `neutral` values (AD-VIS-03). Fonts are
  fixed (D-UX-02). Images in `point-barber/design-reference/` are reference only, never a rule (AD-META-08).
- Bounded by: ADR-001 (one web app, `packages/shared` is the single source of schemas and definitions),
  ADR-012 (data levels that `can()` mirrors), ADR-013 (receipts, payslips and posters are rendered on the
  server from `packages/documents` — not here), ADR-016 (code in `point-barber`, specs in `point-sdd`), and
  the coding guideline of `point-barber` (`docs/engineering/coding-guideline.md`, CG-… rules; its §24 is the
  work list of the web guard rails).

**Tables, endpoints, module services, locks.** This change reads and writes **no table**, calls and adds **no
endpoint**, introduces and calls **no NestJS module service**, and takes **no lock** (API-IDEM-06 does not
apply). It only mirrors response shapes as TypeScript types so that later wiring is a drop-in:

| Type in `packages/shared` | Mirrors | Used by |
| --- | --- | --- |
| `Grant`, `MeGrants` | `MeResponse.grants[]`, `.effective`, `.branches_in_scope` — P1.ME.01 (API-AUTH-05) | `can()`, `PermissionGate`, `BranchSwitcher` |
| `CursorPage<T>` | `{ items, next_cursor, total }` — API-DATA-08 | `DataTable`, `CardList`, `usePagedList` |
| `Problem` | RFC 9457 body — API-ERR-01 (the scaffold's schema) | `ErrorState`, `FormField` |
| `ReceiptView` | P4.RCP.01 `format=json` | `ReceiptRenderer` |
| `Slot` | `slots[]` of P2.AVL.02 (`starts_at`, `ends_at`) | `TimeSlotPicker` |
| `UploadPurpose` (`image` · `document` · `import`) | P8.ATT.01 | `AttachmentUploader` |
| `NotificationItem` (category 1 BOOKING · 2 STAFF · 3 MONEY · 4 STOCK · 5 PAYROLL · 6 SECURITY) | P8.NTF.01 | `NotificationBell` |

## Goals / Non-Goals

**Goals**

- One token file, one formatter, one status map, one set of language files — so a rule is changed in one place.
- Every shared component checkable by a tester on `/dev/ui` in Myanmar and English at 320 and 1280 px.
- Guard rails that fail CI before an inconsistent screen can be merged.
- The owner's admin palette can later be dropped into `tokens.css` without touching a component.

**Non-Goals** (the full list with the owning changes is in the proposal)

- No feature screen, no API call, no session, no realtime.
- No site-specific component of FE-IMPL-02 except the shared `OptionPicker` and `PhoneInput`.
- No colour, logo or copy invented where the owner has not supplied one.

## Decisions

### D1 — Package layout (bounded by ADR-001, AD-IMPL-03)

```
packages/ui/
├── tokens.css                     the only token file (AD-VIS-01), including the @font-face rules
├── tokens.neutral.snapshot.css    output of the pinned shadcn CLI (base colour neutral) — test reference
├── fonts/                         *.woff2 + one licence file per family
└── src/
    ├── primitives/                shadcn/ui generated parts (dialog, sheet, popover, tooltip, table, tabs,
    │                              calendar, command, radio-group, checkbox, dropdown-menu, sonner, skeleton)
    ├── components/<Name>/         one folder per shared component: <Name>.tsx, <Name>.test.tsx
    ├── status/status-map.ts       THE tone / icon / label-key map (AD-CMP-05, AD-CMP-06, AD-IMPL-04)
    ├── providers/                 FormatProvider (locale + money profile), ClockProvider + useNow(),
    │                              GrantsProvider, QueryProvider
    └── catalogue/                 manifest.ts, fixtures.ts, demos/*.tsx (imported only by /dev/ui)
packages/shared/src/
    ├── money/        Mmk, parseMoneyInput, moneyFromWire, moneyToWire, sumMoney, formatLakh
    ├── format/       formatMoney, formatDate, formatTime, formatDateTime, formatTimeRange, formatDuration,
    │                 formatPercent, formatQty, formatRelativeTime, formatPhone   (AD-FMT-00)
    ├── time/         businessDateOf, todayMmt(now), parseDateInput, dateRangeForPreset   (zone Asia/Yangon)
    ├── text/         normalizeDigits, localized, normalizeMyanmarText (Zawgyi), hasMyanmarScript
    ├── phone/        normalizePhone
    ├── constants/status.ts        named status constants of the 19 tables of AD-CMP-05 (D-DB-03)
    ├── constants/error-codes.ts   (from the scaffold) + the codes that get a key in this change
    ├── permissions/  can.ts (createCan), types Grant / MeGrants
    ├── errors/       errorMessageKey, fieldMessageKey
    └── list/         CursorPage<T>
packages/i18n/
    ├── messages/my/{common,status,error,reason,devui}.json
    ├── messages/en/{common,status,error,reason,devui}.json
    └── src/          config.ts (locales), resolve-locale.ts, request.ts (next-intl), keys.d.ts
tools/eslint/web.mjs               (from the scaffold) extended — D14
tools/eslint-plugin-point/         (from the scaffold) + rules no-number-money, no-raw-status — D14
tools/guards/                      check-css.mjs extended · check-fonts.mjs (pnpm fonts:check) ·
                                   check-i18n.mjs (pnpm i18n:check) · check-catalogue-flag.mjs ·
                                   check-ui-text-style.mjs · check-web-globals.mjs
apps/web/app/staff/layout.tsx      root layout of the staff tree (<html lang data-tree="staff">)
apps/web/app/site/layout.tsx       root layout of the site tree  (<html lang data-tree="site">)
apps/web/app/staff/dev/ui/         the catalogue route
e2e/dev-ui/                        Playwright specs for the catalogue
```

**Workspace dependency direction (no cycle):** `packages/i18n` has no workspace dependency · `packages/shared`
→ `packages/i18n` (the formatter words) · `packages/ui` → `packages/shared`, `packages/i18n`. The language
check is a guard under `tools/guards/` (it reads the JSON files, `error-codes.ts` and `status-map.ts` as
files), not code inside `packages/i18n`; `pnpm i18n:check` and `pnpm fonts:check` are aliases of their guard
files, and `pnpm guards` runs them with the others.

**Two root layouts.** The scaffold's single `app/layout.tsx` is replaced by one root layout per tree (Next.js
multiple root layouts): `<html>` needs a per-tree `data-tree` and a per-language `lang`, and the website will
place its root layout under `[locale]` (FE-IMPL-01). Reading the tree from a request header in one shared
layout would make every page dynamic, against ADR-006 for the public site. The scaffold's 404 behaviour and
its smoke tests must stay green after the move.

**Installed here** (the scaffold deferred them): Tailwind 4, shadcn/ui (init with base colour `neutral`),
`lucide-react`, `next-intl`, `@tanstack/react-query` (only the `QueryProvider`: `refetchOnWindowFocus: true`
— AD-PERF-03, mutation `retry: 0` — AD-NET-02), `react-hook-form` with the Zod resolver. Versions are pinned
in `VERSIONS.md` at the newest major that the lint plugins in use support.

`packages/shared` stays free of React and of Next.js so that the API uses the same formatter, phone and money
functions (FE-IMPL-03, API-ERR-03).

### D2 — Tokens (AD-VIS-01, AD-VIS-03, D-UX-02)

- Tailwind 4, `@theme inline` mapping as shadcn/ui generates it. The default Tailwind palette is removed from
  the theme (`--color-*: initial`) so that `bg-blue-500` produces no CSS; the lint rule (D14) turns the silent
  miss into an error.
- Staff tree = the CLI's light-theme values for base colour `neutral`, copied unchanged. Reference values
  (shadcn/ui for Tailwind 4): `--background oklch(1 0 0)` · `--foreground oklch(0.145 0 0)` ·
  `--card oklch(1 0 0)` · `--primary oklch(0.205 0 0)` · `--primary-foreground oklch(0.985 0 0)` ·
  `--secondary / --muted / --accent oklch(0.97 0 0)` · `--muted-foreground oklch(0.556 0 0)` ·
  `--destructive oklch(0.577 0.245 27.325)` · `--border / --input oklch(0.922 0 0)` · `--ring oklch(0.708 0 0)`
  · `--chart-1 … --chart-5` as generated. The snapshot file, not this list, is the test reference: if the
  pinned CLI generates other values, those are the "unchanged" ones.
- Tokens of admin §3.1 that neutral does not have are **aliases**, so no colour is invented:

| Token | Alias of | Comment kept in the file |
| --- | --- | --- |
| `--success`, `--warning`, `--info` | `var(--foreground)` | `{{COLOR_SUCCESS}}` / `{{COLOR_WARNING}}` / `{{COLOR_INFO}}` — OPEN-30 |
| `--success-foreground`, `--warning-foreground`, `--info-foreground` | `var(--background)` | same |
| `--success-subtle`, `--warning-subtle`, `--info-subtle`, `--danger-subtle` | `var(--muted)` | same |
| `--destructive-foreground` | `var(--primary-foreground)` | absent from the Tailwind 4 neutral theme |
| `--chart-6` | `var(--muted-foreground)` | neutral has five chart colours |

  Consequence: in the staff tree, until the owner's admin palette arrives, success / warning / info badges
  look alike in colour and are told apart by icon and text — which AD-A11Y-03 requires anyway. The site block
  overrides `--success`, `--warning`, `--info`, their `-foreground` tokens and `--destructive-foreground` with
  its own values; the four `-subtle` aliases and `--chart-6` are not in FE-VIS-01a, stay aliases and therefore
  follow the site's `--muted` (`#E0E0E0`) and `--muted-foreground` (`#555555`).
- Site scope selector: `:root[data-tree="site"]`; the root layout of each tree sets `data-tree` on `<html>`.
  The site block has exactly the 24 colour declarations of FE-VIS-01a (v1.7), all 🔒:

  | Token | Value | Token | Value |
  | --- | --- | --- | --- |
  | `--background` | `#EEEEEE` | `--foreground` | `#000000` |
  | `--primary` | `#000000` | `--primary-foreground` | `#FFFFFF` |
  | `--decoration` (site only) | `#DC5F00` | `--ring` | `#000000` |
  | `--card` | `#FFFFFF` | `--card-foreground` | `#000000` |
  | `--muted` | `#E0E0E0` | `--muted-foreground` | `#555555` |
  | `--border` | `#C4C4C4` | `--input` | `#707070` |
  | `--secondary` | `#FFFFFF` | `--secondary-foreground` | `#000000` |
  | `--accent` | `#E0E0E0` | `--accent-foreground` | `#000000` |
  | `--destructive` | `#C8281B` | `--destructive-foreground` | `#FFFFFF` |
  | `--success` | `#0E4A28` | `--success-foreground` | `#FFFFFF` |
  | `--warning` | `#6A3A00` | `--warning-foreground` | `#FFFFFF` |
  | `--info` | `#0B5CAD` | `--info-foreground` | `#FFFFFF` |

  The block also holds the site font tokens (D3) and the two component variables of the focus outline and the
  input border (below). Tokens FE-VIS-01a does not name — `--popover`, `--popover-foreground`, the `-subtle`
  aliases, `--chart-1` … `--chart-6` — keep their staff-tree declarations.
- Other tokens: `--radius: 0.5rem` (AD-VIS-08; `sm` = radius − 4 px, `md` = radius − 2 px, `lg` = radius);
  elevation `--elevation-flat: none`, `--elevation-raised`, `--elevation-overlay` (neutral shadows of
  shadcn/ui); motion `--motion-fast: 150ms`, `--motion-overlay: 200ms`, `--motion-max: 300ms`,
  `--ease-enter: ease-out`, `--ease-exit: ease-in`; one `@media (prefers-reduced-motion: reduce)` block sets the
  three durations to `0ms`.
- Type scale: `--text-<size>` and `--leading-<size>` variables; a `:lang(my)` block overrides the seven
  `--leading-*` values and puts `var(--font-myanmar)` first (AD-VIS-06). Because the rule is `:lang(my)`, it
  follows the language of the **text**, not of the page: `DataText` (D10) adds `lang="my"` to Myanmar-script
  data shown in the English UI. `:lang(my)` blocks get `font-synthesis: none`.
- Contrast table on the catalogue: each pair's ratio is computed in the browser from the resolved 8-bit sRGB
  values (WCAG relative luminance), rounded to 2 decimals, with the limit of the pair.

| Tree | Pair (on `--background` unless stated) | Ratio | Limit | Mark |
| --- | --- | --- | --- | --- |
| staff | `--foreground` | 19.80 | 4.5 | pass |
| staff | `--muted-foreground` | 4.74 | 4.5 | pass |
| staff | `--primary-foreground` on `--primary` | 17.18 | 4.5 | pass |
| staff | `--destructive` | 4.77 | 4.5 | pass |
| staff | focus outline = `--foreground` | 19.80 | 3 | pass |
| staff | input border = `--muted-foreground` | 4.74 | 3 | pass |
| site | `--foreground` | 18.10 | 4.5 | pass |
| site | `--primary-foreground` on `--primary` | 21.00 | 4.5 | pass |
| site | `--muted-foreground` | 6.43 | 4.5 | pass |
| site | `--muted-foreground` on `--muted` | 5.65 | 4.5 | pass |
| site | `--destructive` | 4.79 | 4.5 | pass |
| site | `--destructive-foreground` on `--destructive` | 5.56 | 4.5 | pass |
| site | `--success` | 8.92 | 4.5 | pass |
| site | `--success-foreground` on `--success` | 10.35 | 4.5 | pass |
| site | `--warning` | 8.16 | 4.5 | pass |
| site | `--warning-foreground` on `--warning` | 9.47 | 4.5 | pass |
| site | `--info` | 5.75 | 4.5 | pass |
| site | `--info-foreground` on `--info` | 6.67 | 4.5 | pass |
| site | focus outline = `--ring` | 18.10 | 3 | pass |
| site | input border = `--input` | 4.27 | 3 | pass |
| site | input border = `--input` on `--card` | 4.95 | 3 | pass |
| site | `--decoration` | 3.19 | 3 | large text and icons only |
| site | `--decoration` on `--card` | 3.70 | 3 | large text and icons only |
| site | `--decoration` on `--muted` / `--accent` | 2.80 | 3 | not allowed (FE-VIS-01b) |
| site | `--primary-foreground` on `--decoration` | 3.70 | 4.5 | not allowed |
| site | `--foreground` on `--decoration` | 5.68 | 4.5 | pass |

  6 staff rows and 20 site rows; no row fails — the marked rows are the usage limits of `--decoration`.
- **Focus outline and input border (AD-VIS-03 v1.7 — owner S15; FE-VIS-01a v1.7).** `tokens.css` declares two
  component-level variables that every shared component uses: `--focus-outline` and `--field-border`. No
  component refers to `--ring` or `--input` directly.
  - **Staff tree** (admin palette not given): `--focus-outline: var(--foreground)` (19.80 : 1) and
    `--field-border: var(--muted-foreground)` (4.74 : 1) — existing neutral tokens, no new colour. The staff
    `--ring` and `--input` keep their neutral values (2.58 : 1 and 1.26 : 1 on white).
  - **Site tree** (palette set): AD-VIS-03 v1.7 says that when the palette arrives both point back at
    `--ring` / `--input`, so the site block sets `--focus-outline: var(--ring)` (`#000000`, 18.10 : 1) and
    `--field-border: var(--input)` (`#707070`, 4.27 : 1 on the background, 4.95 : 1 on a white card).
  When the admin palette arrives, the staff tree repoints the two variables the same way.

### D3 — Fonts (AD-VIS-05, FE-VIS-02, FE-PERF-06)

- Plain `@font-face` rules inside `packages/ui/tokens.css` with `font-display: swap`, not `next/font`: both
  trees and the catalogue's theme switch need the same faces from one CSS file, preloading must depend on the
  language, and AD-IMPL-05 allows `font-family` in `tokens.css` only (the scaffold's `check-css.mjs` already
  enforces exactly that). `fontPreloads(tree, locale)` in `packages/ui` returns the `<link rel="preload">` list
  — staff `en`: Manrope + Inter; staff `my`: Pyidaungsu Regular + Bold; site `en`: Archivo Black + Roboto 400;
  site `my`: Pyidaungsu Regular + Bold.
- Font tokens: `--font-myanmar: 'Pyidaungsu'` (both trees — D-UX-02 names the token) · staff
  `--font-sans: 'Manrope', 'Inter', var(--font-myanmar), system-ui, sans-serif` and
  `--font-numeric: 'Inter', 'Manrope', system-ui, sans-serif` · site
  `--font-sans: 'Roboto', var(--font-myanmar), system-ui, sans-serif` and
  `--font-display: 'Archivo Black', 'Roboto', sans-serif`. Under `:lang(my)` the applied family is
  `var(--font-myanmar)` followed by the tree's Latin stack; a site display heading under `:lang(my)` is
  `var(--font-myanmar)` at weight 700. The site font tokens live in the same site block as the colours.
- Subsets (`pyftsubset`, script `packages/ui/fonts/build-subsets.sh`, run once and committed): Latin subset for
  Manrope, Inter, Archivo Black and Roboto; Pyidaungsu keeps U+1000–U+109F (so U+1040–U+1049 stay), U+200B,
  Latin digits and punctuation.
- Pyidaungsu has faces 400 and 700 only. CSS font matching maps weight 500 to 400 and weight 600 to 700, which
  is the mapping AD-VIS-05 asks for; `font-synthesis: none` stops a faux bold.
- Licences: `OFL-Manrope.txt`, `OFL-Inter.txt`, `OFL-ArchivoBlack.txt`, `LICENSE-Roboto.txt`,
  `LICENSE-Pyidaungsu.txt` — each copied from the font's own distribution. `pnpm fonts:check`
  (`tools/guards/check-fonts.mjs`) fails when a family that has a WOFF2 file has no licence file.
- "Is the font really loaded" is tested through `document.fonts` (a `FontFace` of the family with status
  `loaded`) and a width comparison against `system-ui`; `document.fonts.check()` alone is not used because it
  answers true for a family that was never registered.

### D4 — Money type and the wire (API-DATA-02, AD-IMPL-05, CG-MONEY-01..03)

API-DATA-02 fixes the wire (`_amount` = JSON integer); AD-IMPL-05 fixes the code ("bigint / string end to
end"). Both hold with: `type Mmk = bigint & { readonly __brand: 'Mmk' }` in TypeScript,
`moneyFromWire(n: number): Mmk` (throws unless `Number.isSafeInteger(n)`) and `moneyToWire(m: Mmk): number`
(throws outside the safe-integer range) at the API-client boundary — the code of CG-MONEY-02. Formatters and
components take `Mmk` only; a bare `number` does not compile (CG-MONEY-02). The catalogue fixtures build their
amounts with `moneyFromWire`.

`formatLakh(amount)` (the သိန်း helper of AD-FORM-11): integer part = amount ÷ 100,000 by integer division; the
remainder is written as up to 5 decimal digits with trailing zeros removed — exact, never rounded
(`123,456` → `1.23456 သိန်း`). Returns `null` below 100,000.

`businessDateOf`, the `Mmk` type, the parser, the wire helpers and `sumMoney` are **created here**;
`add-walkin-visit-checkout` extends their tests and adds the subtract / percent helpers (its tasks 2.7 and
2.9), and enables `point/no-number-money` for `apps/api`. There is one money module and one `businessDateOf`
in the repository.

### D5 — Formatter signatures (AD-FMT-00)

| Function | Input → output | Rule |
| --- | --- | --- |
| `formatMoney(amount: Mmk, { locale, profile, unit? })` | `7000n`, `en`, `app` → `7,000 Ks` | D-PLT-04, AD-FMT-01, FE-FMT-01 |
| `formatDate(value, { locale, weekday? })` | `2026-10-05` → `05/Oct/2026` | D-PLT-05, AD-FMT-02 |
| `formatTime(value, { locale })` | instant or wire `HH:mm` → `2:30 PM` | AD-FMT-03, API-DATA-03 |
| `formatDateTime(instant, { locale })` | → `05/Oct/2026 10:42 AM` | AD-RCPT-01 pattern |
| `formatTimeRange(start, end, { locale })` | → `2:30 – 3:15 PM` | AD-FMT-03 |
| `formatDuration(minutes, { locale })` | 90 → `1 h 30 min` / `1 နာရီ 30 မိနစ်`; 60 → `1 h`; 0 → `0 min` | AD-FMT-05 |
| `formatPercent(value)` | number or decimal string → at most 2 decimals, half up on the decimal string | AD-FMT-07 |
| `formatQty(n, { locale })` | 3 → `3 pcs` / `3 ခု` | AD-FMT-08 |
| `formatRelativeTime(at, now, { locale })` | < 60 s `just now` · < 60 min `N min ago` · < 24 h `N h ago` · else `formatDate` | AD-FMT-09 |
| `formatPhone(e164)` | `+95977123456` → `09 7712 3456` | AD-FMT-04 |
| `normalizePhone(text)` | → E.164 or `phone_invalid` | D-CUS-02, P3-RULE-01 |
| `normalizeDigits(text)` | ၀–၉ → 0–9 | AD-FMT-10 |
| `businessDateOf(instant)`, `todayMmt(now)` | → `YYYY-MM-DD` (MMT) | D-PLT-15, AD-FMT-11 |
| `parseDateInput(text)` | `DD/MM/YYYY`, `DD/MMM/YYYY` → `YYYY-MM-DD` or `date_invalid` | AD-FORM-15 |
| `dateRangeForPreset(preset, today)` | → `{ from, to }` | AD-LIST-01 |
| `localized(record, field, locale)` | → `*_en` or `*_mm` | AD-L10N-03 |
| `normalizeMyanmarText(text)` | → `{ text, converted }` | AD-FORM-13 |

- **Myanmar Time by zone name (CG-TIME-04).** `packages/shared/src/time` is built on one date library —
  `date-fns` with `@date-fns/tz` (the guideline's proposal, OPEN-CG-05: the team fixes the library in the
  change that first needs it, which is this one; recorded in `VERSIONS.md`) — and always passes the zone name
  `Asia/Yangon`. There is no offset arithmetic and no local-time `Date` getter. Month names come from a fixed
  table `Jan … Dec` (an ICU locale may print `Sept`). The unit suite of `time/` and `format/` runs under
  `TZ=UTC`, `TZ=Asia/Yangon` and `TZ=America/Los_Angeles` (CG-TIME-04 asks for the first two; the third is the
  "phone in another zone" case of the spec).
- **Clock (CG-TIME-03, CG-TIME-06).** Pure functions take `now` as a parameter (`todayMmt(now)`,
  `formatRelativeTime(at, now)`, `dateRangeForPreset(preset, today)`). In the browser the instant comes from
  `useNow()` of `ClockProvider`, which is seeded with a server instant and advanced by the elapsed time of the
  device's monotonic clock; the catalogue seeds it from the `now` parameter, `add-foundation-auth-access` from
  `system.server_time` of `/me`. `new Date()` without arguments and `Date.now()` exist only inside
  `ClockProvider` (lint — D14).
- **Words** used by formatters (`Ks`, `ကျပ်`, `min`, `မိနစ်`, `h`, `နာရီ`, `pcs`, `ခု`, weekday names,
  `just now`, `ago`) are read from `common.format.*` of the language files (D-PLT-03); `packages/shared`
  imports the two `common.json` files as data (dependency shared → i18n, D1), so the formatters stay
  synchronous and usable by the API.
- **Phone display** — AD-FMT-04 fixes the pattern for 9 digits after `09` (`09 7xx xxx xxx`). For the other
  lengths this change groups 8 digits as 4-4 (the form the fixture uses: `09 7712 3456`) and 7 digits as 3-4.
  Numbers that do not start with `+959` are shown in E.164.
- **Time range** — the marker is written once when both ends share AM / PM, otherwise on both ends.
- **Percent** — half up on the decimal string (`12.345` → `12.35%`, `99.995` → `100%`); AD-FMT-07 fixes only
  "max 2 decimals, trailing zeros trimmed". This is a display rule; money rounding is never done here
  (CG-MONEY-05).
- **Date presets** (API-DATA-08: "date presets are a client concern"). Weeks run Monday–Sunday, the ISO
  numbering the database already uses (`day_of_week` 1 Mon … 7 Sun in `schedule_patterns` and
  `branch_opening_hours`). `This week` = Monday…Sunday of today's week; `Last 7 days` = today and the 6 days
  before; `This month` / `Last month` = first to last day of the month.

### D6 — Language files (D-PLT-03, AD-L10N-01, AD-L10N-02)

- `next-intl` without locale routing in the staff tree (the language is an account preference, not a URL
  segment). `resolveLocale({ session?, cookie?, systemDefault? })` in `packages/i18n`:
  - a session is supplied → `session.uiLanguage` 1 → `my`, 2 → `en`, `null` → `systemDefault`;
  - no session (login screen, first paint, the catalogue) → the cookie `point_locale` when it holds `my` or
    `en`, else `systemDefault`;
  - `systemDefault` = the value of setting `system.default_language` handed in by the caller; `my` (its
    default, 1 MY) when the caller has none.
  After `/me` is known the session layer rewrites the cookie from the resolved value (`my` | `en`, 1 year,
  `SameSite=Lax`), so a shared shop phone never shows user B in user A's language (D-PLT-03 "NULL = system
  default", AD-L10N-06 "a cookie mirrors it only so the first paint … is already in the right language"). The
  site tree's `[locale]` segment (FE-IMPL-01) uses the same message files and is set up by the website change.
- `LanguageSwitch` writes the cookie and calls `router.refresh()`: server components re-render with the other
  message set, client state and the TanStack Query cache stay (AD-L10N-06 "without reloading data"). Saving
  `users.ui_language` is the `onChange` callback — wired by `add-foundation-auth-access`.
- One JSON file per top-level namespace keeps merge conflicts between the two developers small. Feature
  changes add their own namespace files (`pos`, `booking`, …) and their `error.*` / `reason.*` / `status.*`
  keys.
- **`devui` namespace** — every label of a catalogue demo ("Name", "Cancel booking", "Send transfer", "Sales
  today", "Finished on", …) is a `devui.*` key in both languages. The demo folder is **not** exempt from the
  raw-JSX-string rule. `devui` texts are tool texts, not product copy.
- Typed keys: `keys.d.ts` augments next-intl's message type from the `en` files; `t('…')` with an unknown key
  fails `tsc`.
- `pnpm i18n:check` (`tools/guards/check-i18n.mjs`): key-set equality `my` ↔ `en`; no empty value; every
  constant of `status-map.ts` has `status.<table>.<NAME>`; every code of `constants/error-codes.ts` has
  `error.<code>`; every flag has `status.flag.<key>`; exit code 1 with one line per finding
  (`<lang>: missing <key>`).
- Keys of this change. Their English and Myanmar texts are the ones listed in the brief ("Texts"); the owner
  accepted them on 02/Oct/2026 (review §0.11 S18) and corrects wording in the brief or the pull request:

| Group | Keys |
| --- | --- |
| `common.action.*` | `save`, `cancel`, `close`, `retry`, `keep`, `goBack`, `discard`, `keepEditing`, `clearAll`, `add`, `approve`, `reject`, `markAllRead`, `delete`, `showAsTable`, `showAsChart`, `columns`, `next`, `previous`, `more` |
| `common.format.*` | `unit.ks`, `unit.kyat`, `unit.lakh`, `min`, `hour`, `pcs`, `weekday.mon…sun`, `relative.justNow`, `relative.minAgo`, `relative.hourAgo` |
| `common.date.*` | `today`, `yesterday`, `preset.today`, `preset.yesterday`, `preset.thisWeek`, `preset.last7Days`, `preset.thisMonth`, `preset.lastMonth`, `preset.custom` |
| `common.*` (single) | `bilingual.hint`, `bilingual.mm`, `bilingual.en`, `zawgyi.converted`, `confirm.irreversible`, `form.discard.title`, `offline.banner`, `offline.help`, `error.id`, `slots.empty`, `grid.notSold`, `grid.usesShopPrice`, `grid.changeFrom`, `grid.copyFromBranch`, `grid.shop`, `grid.home`, `qr.permissionDenied`, `qr.noCamera`, `upload.hint`, `upload.inProgress`, `upload.remove`, `notifications.today`, `notifications.earlier`, `notifications.empty`, `branch.all`, `stepper.compact`, `kpi.updated`, `list.total`, `list.pageSize`, `amountHeader`, `search.placeholder` |
| `status.<table>.<NAME>` | the 71 pairs and the derived states of D8 |
| `status.flag.<key>` | the 18 flags of D8 |
| `reason.<NAME>` | `INTERNET_OUTAGE`, `POWER_OUTAGE`, `PHONE_BROKEN`, `FORGOT`, `OTHER`, `PHONE_UNAVAILABLE` |
| `error.<code>` — API codes | `validation`, `not_found`, `internal_error` (HTTP 500 — API-ERR-02 v1.6), `forbidden`, `phone_invalid`, `amount_invalid`, `reason_required`, `file_too_large`, `file_type_not_allowed` |
| `error.<code>` — field codes (API-ERR-03 v1.6) | `too_small` (`{minimum}`), `too_big` (`{maximum}`), `invalid_type` — the Zod issue names, unchanged |
| `error.<code>` — client-only messages (API-ERR-03 v1.6: the API never returns them) | `required`, `date_invalid`, `unknown` |
| `devui.*` | demo labels (not product copy) |

### D7 — `can()` (AD-PERM-03, API-AUTH-05, ADR-012)

```ts
type Grant = { code: string; scope_type: 1 | 2; branch_ids: string[] };   // 1 COMPANY · 2 BRANCHES
type Level = 'company' | 'branch' | 'mixed' | 'shared' | 'private';
function createCan<C extends string>(catalogue: Record<C, { level: Level }>):
  (me: { grants: Grant[]; effective: { show_own_earnings: boolean } }) =>
    (code: C | 'earnings.view_own', opts?: { branchId?: string; level?: 'company' }) => boolean;
```

| Level of the code | `can(code)` | `can(code, { branchId })` | `can(code, { level: 'company' })` |
| --- | --- | --- | --- |
| `branch` | any grant | company-scope grant, or branch grant listing `branchId` | not allowed by the types |
| `company` | any grant (the screen opens read-only — API-PERM-03) | not allowed by the types | company-scope grant |
| `mixed` | any grant | as `branch` | company-scope grant |
| `shared` | any grant | any grant | any grant |
| `private` | company-scope grant | company-scope grant | company-scope grant |

- `createCan` is generic over the catalogue it is given, so a code outside it is a compile error (D-ROLE-08).
  The real catalogue is `packages/shared/definitions/permissions.json` (`[]` after the scaffold);
  `add-foundation-auth-access` fills it and binds `can = createCan(PERMISSIONS)` in
  `packages/shared/src/permissions/catalogue.ts`. This change tests the function with a seven-code fixture
  catalogue: `booking.create`, `booking.delete`, `closing.reopen` (branch), `service.update` (mixed),
  `role.update` (company), `customer.update` (shared), `payroll.view` (private) — levels as in API Parts 1, 2,
  3, 5 and 7.
- `GrantsProvider` holds the `/me` slice; `PermissionGate` props: `code`, `branchId?`, `level?`, `blocked?`,
  `fallback?`. `can()` false → `fallback` (default nothing). `can()` true and `blocked = { reason }` → the
  child is rendered disabled with the reason as helper text linked by `aria-describedby`; `blocked = 'hidden'`
  → nothing is rendered (the screen shows a `LockBanner` instead) — the two forms AD-PERM-02 allows.
- Catalogue personas (`?as=`). Demos decide by `can()` only, never by the persona name (AD-META-06).

| Persona | Fixture grants | Why |
| --- | --- | --- |
| `admin` — U Kyaw Zin | all seven codes, `scope_type` 1 | everything visible |
| `manager` — Ma Hnin | `booking.create`, `booking.delete`, `service.update`, `customer.update`, `scope_type` 2, `[B3]` | codes the Manager seed holds (AD-PERM-06); no `closing.reopen` |
| `barber` — Ko Aung | none; `show_own_earnings` false | gated actions absent |
| `branch-holder` — unnamed | `role.update`, `payroll.view`, `scope_type` 2, `[B3]` | only to demonstrate that branch scope gives read-only (company) or nothing (private); not a fixture person, because no seed role holds these at branch scope |

### D8 — Status constants and the one map (D-DB-03, AD-CMP-05, AD-CMP-06, AD-IMPL-04)

`packages/shared/src/constants/status.ts` declares one `as const` object per table with the codes of the DBML
notes. `add-foundation-auth-access` needs `UserStatus` and `EmployeeStatus` too: whichever change is merged
first creates the file, the other extends it — a constant is never declared twice.

`status-map.ts` — tone per (table, constant). Default icon per tone (lucide): neutral `circle` · info
`circle-dot` · success `circle-check` · warning `triangle-alert` · danger `circle-x` · muted `circle-slash`;
"lock" below replaces the default icon with `lock`; "lock + sent" shows `lock` and `send`.

| Table | Code CONSTANT → tone |
| --- | --- |
| `bookings` | 1 BOOKED neutral · 2 STARTED info · 3 COMPLETED success · 0 CANCELLED muted |
| `visits` | 1 STARTED info · 2 COMPLETED warning · 3 FINISHED success · 0 INCOMPLETE muted |
| `sales` | 1 OPEN info · 2 FINISHED success (lock) · 0 CANCELLED muted |
| `discount_requests` | 1 PENDING warning · 2 APPROVED success · 3 REJECTED danger · 0 CANCELLED muted |
| `leaves` | 1 PENDING warning · 2 APPROVED success · 3 REJECTED danger · 0 CANCELLED muted |
| `payroll_runs` | 1 DRAFT neutral · 2 CALCULATED info · 3 FINALIZED warning (lock) · 4 PUBLISHED warning (lock + sent) · 5 PAID success · 0 CANCELLED muted |
| `attendance_exceptions` | 1 OPEN warning · 2 EXCUSED neutral · 3 CONFIRMED danger · 4 LEAVE info · 0 VOID muted |
| `purchases` | 1 DRAFT neutral · 2 POSTED success (lock) · 0 CANCELLED muted |
| `stock_transfers` | 1 DRAFT neutral · 2 SENT info · 3 RECEIVED success · 0 CANCELLED muted |
| `stock_counts` | 1 IN_PROGRESS info · 2 POSTED success · 0 CANCELLED muted |
| `daily_closings` | 1 OPEN neutral · 2 CLOSED success (lock) |
| `expenses` | 1 PENDING warning · 2 APPROVED success · 3 REJECTED danger |
| `manual_incomes` | 1 PENDING warning · 2 APPROVED success · 3 REJECTED danger |
| `employee_receivables` | 1 ACTIVE info · 2 SETTLED success · 0 CANCELLED muted |
| `users` | 2 INVITED info · 1 ACTIVE success · 0 DISABLED muted |
| `employees` | 1 ACTIVE success · 0 INACTIVE muted · 2 RESIGNED muted · 3 TERMINATED muted |
| `import_jobs` | 1 UPLOADED neutral · 2 VALIDATED info · 3 CONFIRMED success · 4 FAILED danger · 0 CANCELLED muted |
| `import_job_rows` | 1 PENDING neutral · 2 VALID success · 3 ERROR danger · 4 IMPORTED success · 5 SKIPPED muted |
| `backup_runs` | 1 RUNNING info · 2 SUCCESS success · 3 FAILED danger |

That is 71 (table, code) pairs. States of AD-CMP-05 that are not a status column are **derived states** with a
name instead of a code (`<StatusBadge table="payments" state="KBZPAY_UNVERIFIED" />`); the feature change
computes which one applies:

| Table key | Derived state → tone |
| --- | --- |
| `payments` | VOIDED muted · KBZPAY_UNVERIFIED warning · KBZPAY_VERIFIED success |
| `cash_outs` | OUTSTANDING warning · RETURNED success · CONVERTED warning · CANCELLED muted |
| `cash_returns` | CANCELLED muted |
| `expenses`, `manual_incomes` | DELETED muted |
| `daily_closings` | OPEN_PAST warning ("Not closed") |
| `master` | INACTIVE muted (ACTIVE = no badge) |

Flags (`FlagChip`, key → tone · icon): `late_entry` warning · clock; `proxy_recorded` info · users (takes the
recorder's name); `home_service` neutral · home; `online_booking` neutral · globe; `price_changed` warning ·
pencil; `discount` info · tag; `negative_stock` danger · triangle-alert; `low_stock` warning · package;
`manual_attendance` warning · hand; `attendance_late` danger · clock-alert; `attendance_absent` danger ·
user-x; `attendance_early_leave` warning · log-out; `pending_leave` warning · calendar; `difference_sale`
info · receipt; `change_returned` info · coins; and the three count flags of AD-CMP-05 `transfer_short`,
`transfer_over` (warning · triangle-alert, take N) and `reopened` (takes N). AD-CMP-05 gives "Reopened ×N" no
tone; neutral · rotate-ccw is this design's choice, as are the icons of the three attendance flags, for which
AD-CMP-06 names tones only.

Badge styles keep axe clean in both trees: in the staff tree text never sits in `--muted-foreground` on
`--muted` (4.35 : 1), so the muted tone is an outline badge on the surface behind it; on the site
`--destructive` on `--muted` is 4.21 : 1 (the `-subtle` aliases follow `--muted`), so the danger tone is an
outline badge too, while success (7.84 : 1), warning (7.17 : 1) and info (5.05 : 1) may sit on their subtle
background.

`EmployeeChip` initials: Latin names — first letter of the first two words, upper-cased (`Ko Aung` → `KA`);
Myanmar-script names — the first grapheme cluster of the first word (`Intl.Segmenter`, inside
`packages/shared/src/format`).

### D9 — Field-level validation codes (API-ERR-03 v1.6)

Forms validate with the Zod schemas of `packages/shared` through React Hook Form
(`useForm({ resolver: zodResolver(schema), mode: 'onBlur' })` — CG-UI-06). `fieldMessageKey(issue)` maps a
client issue or a server `errors[]` item to a key:

| Issue | Key |
| --- | --- |
| a catalogue code named by the schema (`phone_invalid`, `amount_invalid`, `reason_required`, `date_invalid` …) | `error.<that code>` |
| `invalid_type` with an undefined value, or `too_small` for an empty text / empty list of a required field | `error.required` |
| `too_small` otherwise | `error.too_small` with `{minimum}` |
| `too_big` | `error.too_big` with `{maximum}` |
| `invalid_type` otherwise | `error.invalid_type` |

API-ERR-03 (Part 0 v1.6) fixes the field-level codes: the Zod issue name unchanged (`too_small`, `too_big`,
`invalid_type`, with `params` = the bound or the expected type) unless the schema names a catalogue code;
`required`, `date_invalid` and `unknown` are client-only message keys the API never returns. Server `errors[]`
items are set with `setError(field, { type: code })` and rendered by the same path.

**Reason result (API-DATA-11 v1.6).** `ReasonDialog` returns the generic `{ reason_id?, reason_code?, note? }`;
each endpoint's reason field is the one its API part defines (Part 4: `reason`, `added_reason`,
`override_reason`), and the calling screen maps the result to it. The mapping lives with the screen's API
call, not in `packages/ui`; the catalogue's refund demo shows one mapping (`note` → `reason`).

### D10 — Component contracts

Shared types (in `packages/shared` unless noted):

```ts
type Locale = 'my' | 'en';
type MoneyProfile = 'app' | 'site';
type Mmk = bigint & { readonly __brand: 'Mmk' };    // whole MMK
type BusinessDate = string;                         // YYYY-MM-DD, Myanmar calendar date
type Instant = string;                              // ISO 8601 with offset
type Bilingual = { mm: string; en: string | null };
type Tone = 'neutral' | 'info' | 'success' | 'warning' | 'danger' | 'muted';
type ReasonSource =
  | { type: 'master'; options: { id: string; name_mm: string; name_en: string | null; requires_note: boolean }[] }
  | { type: 'preset'; options: { code: number; name: string; requiresNote: boolean }[] }   // name = CONSTANT
  | { type: 'free' };
type ReasonResult = { reason_id?: string; reason_code?: number; note?: string | null };
type Action = { label: string; onPress: () => void | Promise<void>; allowed?: boolean; destructive?: boolean };
```

Primitives and inputs:

| Component | Rules | Props (required in bold) | Reports |
| --- | --- | --- | --- |
| `Button` | AD-CMP-01, AD-LAY-04 | **children** (translated text) · `variant` primary, secondary (default), ghost, destructive · `loading` · `icon` · `iconOnly` (then **aria-label**) · `fullWidth` · `disabledReason` | `onClick` |
| `FormField` | D-UI-01, AD-FORM-01..05 | **label** · **children** (render prop receiving `id`, `aria-invalid`, `aria-describedby`) · `required` · `helper` · `error` `{ code, params? }` | – |
| `MoneyInput` | AD-FORM-11 | **value** `Mmk` or null · `max` · `lakhHelper` (default true) · `readOnly` | `onChange(Mmk or null)` |
| `MoneyText` | AD-FMT-01 | **amount** `Mmk` · `unit` (default true) · `profile` (default from `FormatProvider`) | – |
| `PhoneInput` | AD-FORM-10, FE-CMP-06 | **value** (text as typed) | `onChange({ raw, e164 })` · `onComplete(e164)` once per valid number |
| `BilingualInput` | AD-FORM-09, AD-FORM-13 | **value** `Bilingual` · `multiline` · `maxLength` | `onChange(Bilingual)` |
| `DateInput` | AD-FORM-15 | **value** `BusinessDate` or null · `min` · `max` (today comes from `useNow()`) | `onChange(BusinessDate or null)` |
| `DateText` | AD-FMT-02, AD-FMT-03 | **value** · `mode` date, time, datetime · `weekday` · `relativeDay` | – |
| `DataText` | AD-L10N-04, AD-A11Y-06 | **children** (a data string) | – (adds `lang="my"` when the string holds U+1000–U+109F) |
| `AttachmentUploader` | AD-FORM-16, API-LIM-03 | **purpose** `UploadPurpose` · **maxMb** · **upload**`(file, onProgress)` → `{ attachment_id, preview_url? }` · `value` · `multiple` | `onChange(files)` · `onBusyChange(boolean)` |
| `LanguageSwitch` | AD-L10N-06 | **value** `Locale` | `onChange(locale)` |
| `Skeleton` | AD-STATE-01 | **shape** text, row, card, tile · `count` · `delayMs` (default 400) | – |
| `Toaster` + `toast.success(text)` | AD-TOAST-01 | – (4,000 ms, one at a time) | – |

Display:

| Component | Rules | Props (required in bold) | Reports |
| --- | --- | --- | --- |
| `StatusBadge` | AD-CMP-05 | **table** · **code** (number) or **state** (derived name) | – |
| `FlagChip` | AD-CMP-06 | **flag** · `name` · `count` | – |
| `EmployeeChip` | AD-CMP-09, AD-VIS-12 | **name** · `photoUrl` · `branch` | `onOpenProfile` (only when given) |
| `KpiTile` | AD-DSH-02 | **label** · **value** (formatted text) · **updatedAt** `Instant` · `comparison` `{ direction, percent, label }` · `href` | – |
| `BarChart`, `LineChart` | AD-CHART-01, AD-A11Y-07 | **series** (1–6; a 7th throws a `RangeError` that names the limit) `{ key, label, points: { x, y }[] }` · **xLabel** · **yLabel** · **yKind** money, count, percent | – |
| `Stepper` | AD-CMP-12, AD-WIZ-01 | **steps** `{ key, label, state: done / current / todo }[]` | `onStepPress(key)` for done steps |
| `ReceiptRenderer` | AD-RCPT-01 | **receipt** `ReceiptView` (root `lang="en"`) | – |
| `EmptyState` | AD-STATE-02 | **title** · **body** · `action` `Action` | – |
| `ErrorState` | AD-STATE-03, API-ERR-01 | **problem** `{ code, params?, request_id? }` | `onRetry` (button only when given) |
| `LockBanner` | AD-DET-03, AD-STATE-06 | **message** · `by` · `at` · `correction` `{ text, action? }` | – |
| `OfflineBanner` | AD-STATE-05 | **helpHref** · `apiUnreachable` | – |

Lists and overlays:

| Component | Rules | Props (required in bold) | Reports |
| --- | --- | --- | --- |
| `DataTable<T>` | AD-CMP-07, AD-LIST-06 | **columns** `{ key, header, kind: text / money / qty / date / time / status / custom, sortKey?, defaultVisible? }[]` · **rows** · **card** `(row) => { fields (a tuple of 1–4), action? }` · **userId** + **storageKey** (column settings) · `totals` `Record<key, Mmk>` · `loading` · `sort` · `selectedId` | `onSortChange(sort)` · `onRowPress(row)` |
| `CardList<T>` | AD-LIST-02 | **rows** · **card** (as above) · `loading` | `onRowPress(row)` |
| `FilterBar` | AD-LIST-01 | **value** `{ q?, from?, to?, preset?, status?: number[] }` · `search` `{ placeholder }` · `presets` · `statuses` `{ table, codes }` · `syncToUrl` (default true) | `onChange(value)` |
| `usePagedList` + `Pagination` | AD-LIST-05, API-DATA-08 | **fetchPage**`({ limit, cursor })` → `CursorPage<T>` · `limit` 25 (default), 50, 100 | page state; `next()`, `previous()`, `setLimit()` |
| `Drawer` | AD-CMP-08, AD-NAV-06, AD-FORM-08 | **open** · **title** · **children** · `footer` · `urlKey` · `dirty` · `width` (clamped to 480–640, default 560) | `onOpenChange` |
| `Sheet` | AD-LAY-03 | **open** · **title** · **children** · `footer` · `side` full or bottom | `onOpenChange` |
| `ReasonDialog` | AD-RSN-01, AD-RSN-02, API-DATA-11 | **open** · **title** · **consequence** · **source** `ReasonSource` · **confirmLabel** · `note` none, optional, by-reason (default), required · `cancelLabel` keep or goBack · `destructive` | `onConfirm(ReasonResult)` · `onCancel` |
| `ConfirmDialog` | AD-CONF-01, AD-CONF-02 | **open** · **title** · **consequence** · **confirmLabel** · `irreversible` · `destructive` | `onConfirm()` · `onCancel` |

Shell, permission and pickers:

| Component | Rules | Props (required in bold) | Reports |
| --- | --- | --- | --- |
| `AppShell` | AD-LAY-01..03, AD-VIS-10 | **nav** `{ key, label, icon, href, items?, badge? }[]` · **children** · `bottomNav` · `branchSwitcher` · `search` · `bell` · `userMenu` · `title` · `breadcrumb` | – |
| `BottomNav` | AD-NAV-01 | **items** (a tuple of 1–5 including the centre) `{ key, label, icon, href, badge? }` · `centre` `{ label, icon, onPress }` | – |
| `BranchSwitcher` | AD-NAV-04, AD-PERM-04 | **branches** (in scope) `{ id, code, name_mm, name_en }[]` · **value** · **userId** · `allowAll` · `syncToUrl` (default true) | `onChange(branchId or 'all')` |
| `PageHeader` | AD-LAY-05 | **title** · `subtitle` · `primary` `Action` · `secondary` `Action[]` (2 shown, rest in a menu) · `filterBar` | – |
| `PermissionGate` | AD-PERM-02 | **code** · **children** · `branchId` · `level` · `blocked` (`{ reason }` or `'hidden'`) · `fallback` | – |
| `TimeSlotPicker` | AD-BKG-01 | **slots** `Slot[]` · **value** `Instant` or null · `loading` | `onChange(starts_at)` |
| `OptionPicker` | AD-POS-05, FE-BK-06 | **open** · **serviceName** `Bilingual` · **groups** (a tuple of 1–2) `{ id, name: Bilingual, values: { id, name: Bilingual }[] }` · **cells** (sold only) `{ valueIds, price_amount: Mmk, duration_minutes }[]` · `hint` | `onAdd(cell)` · `onOpenChange` |
| `PriceGridEditor` | AD-CMP-13 | **mode** simple or options · **groups** (a tuple of 0–2) · **branches** · **branchId** · **location** shop or home · **cells** `{ valueIds, price_amount: Mmk or null, duration_minutes: number or null }[]` · **defaultDurationMinutes** · **effectiveFrom** `BusinessDate` · `shopCells` (for the Home placeholder) · `readOnly` | `onChange(cells)` · `onBranchChange` · `onLocationChange` · `onEffectiveFromChange` · `onCopyFromBranch(branchId)` |
| `NotificationBell` | AD-NTF-01 | **unreadCount** · **items** `NotificationItem[]` `{ id, category, text, created_at, read, href }` | `onOpenItem(id)` · `onMarkAllRead()` · `onDelete(id)` |
| `ApprovalCard` | AD-NTF-04, AD-POS-16 | **title** · **requester** · **branch** · **facts** `{ label, value }[]` · **reason** · `result` `{ label, value }` · `requestedAt` · `canDecide` | `onApprove()` · `onReject(note)` |
| `QrScanner` | AD-ATT-01 | **source** `'camera'` or `{ mock: string }` · **hint** | `onResult(text)` once · `onError(kind: permission_denied / no_camera / unreadable)` · `onClose` |

Component decisions the guideline leaves open:

- **Button height** — 48 px in the mobile layout mode (< 768 px), 40 px from 768 px, with an invisible hit
  area of 44 px (AD-CMP-01 + AD-A11Y-05). Focus indicator = `outline: 2px solid var(--focus-outline)` with a
  2 px offset. Input borders use `var(--field-border)`. The two variables resolve per tree as D2 states
  (staff: `--foreground` / `--muted-foreground`; site: `--ring` / `--input`).
- **Rail labels** — a rail item shows its icon with a short visible label under it and a tooltip, so both
  AD-LAY-01 (icons + tooltips) and AD-VIS-11 (navigation icons always have a visible label) hold.
- **`PhoneInput`** — FE-CMP-06 says "formats as you type" and AD-FORM-10 says "keep what was typed … show a
  live, formatted preview". Reading: the field keeps the typed text (only ၀–၉ → 0–9, D-PLT-05); "formats as
  you type" is the live preview under the field.
- **`MoneyInput` and the decimal key** — AD-FORM-11 "integer only (no decimal key)": the key is ignored and
  later digits are appended (`7000` `.` `5` `0` → `700,050`). The visible separators and, in Myanmar, the
  သိန်း helper show the size of what was typed. A pasted text with a decimal point is refused as a whole.
- **Overlay switch** — `Drawer` renders `Sheet` (full) below 768 px; dialogs render `Sheet` (bottom) below
  768 px (AD-CMP-08). `width` outside 480–640 is clamped. A second dialog over a drawer throws in development
  and test builds.
- **Limits in the types** — `BottomNav.items` (≤ 5), a card's `fields` (≤ 4), `OptionPicker` /
  `PriceGridEditor` groups (≤ 2) are tuple types, so one more does not compile. Chart series come from data,
  so the 6-series limit is a runtime `RangeError`.
- **Skeleton delay** — the skeleton appears after 400 ms of loading (AD-STATE-01) and is skipped for faster
  loads.
- **Paging UI** — "Next" / "Previous" with a client-side stack of the cursors already visited; `limit` is one
  of 25, 50, 100 (API-LIM-03: ≤ 100); the size menu is shown from 1024 px (AD-LIST-05 "on desktop").
- **Per user on the device** — column settings use the `localStorage` key
  `point.columns.<storageKey>.<userId>` (AD-LIST-06) and the branch choice `point.branch.<userId>`
  (AD-NAV-04), both through the typed storage helper; the catalogue uses the persona as the user id.
  `BranchSwitcher` resolves: `?branch=` in the address (when in scope) → the stored choice (when still in
  scope) → the `value` the caller passes. The caller's default (today's shift branch → first assignment —
  `/me`) is `add-foundation-auth-access`.
- **Short error ID** — the first 8 characters of `request_id` (AD-STATE-03).
- **Custom date range** — two `DateInput`s; the `to` input gets `min = from`, so an end date before the start
  date cannot be picked.
- **Upload limit** — `maxMb × 1,048,576` bytes, checked before the upload starts; the server remains the
  authority (magic bytes, `system.upload_max_mb` — API-LIM-03). Accepted types shown per purpose: `image` =
  JPEG, PNG, WebP, HEIC · `document` = the image types + PDF · `import` = CSV, XLSX (P8.ATT.01).
- **`QrScanner` errors** — `NotAllowedError` → `common.qr.permissionDenied`; `NotFoundError` /
  `OverconstrainedError` (a desktop or a CI browser without a camera) → `common.qr.noCamera`.
- **`ReceiptRenderer`** is the on-screen view of a `ReceiptView`. The printed PNG and the PDF come from the
  server renderer in `packages/documents` (ADR-013) and are not part of this change; the two share nothing but
  the content order of AD-RCPT-01.
- **`PriceGridEditor`** covers the grid, the branch and Shop / Home tabs, cell semantics, copy-from-branch and
  the effective date. The side-by-side "current / scheduled" view, the price history and the barber override
  column need price data and belong to the change that first uses the editor.

### D11 — Libraries (inside the stack fixed by ADR-001 and D-ENG-01)

| Need | Library | Why |
| --- | --- | --- |
| Table logic | `@tanstack/react-table` | named by AD-CMP-07 |
| Charts | `recharts` (through the shadcn/ui chart primitive) | uses CSS variables for series colours |
| Toasts | `sonner` (shadcn/ui) | one-at-a-time and position options |
| Date picker | `react-day-picker` (shadcn/ui `calendar`) | month grid; the value handling is ours (MMT) |
| Dates and zone | `date-fns` + `@date-fns/tz` | CG-TIME-04 proposal (OPEN-CG-05), zone name `Asia/Yangon` |
| Zawgyi | `myanmar-tools` | named by AD-FORM-13; convert when the detector's probability is ≥ 0.95 |
| QR decoding | `barcode-detector` (ponyfill of the BarcodeDetector API) | iOS Safari has no native detector |
| Accessibility | `eslint-plugin-jsx-a11y` · `@axe-core/playwright` | AD-IMPL-05, AD-A11Y-01 (CG-UI-10) |
| Query lint | `@tanstack/eslint-plugin-query` | CG-UI-07 |
| Component tests | Vitest + Testing Library (jsdom) | D-ENG-01 tooling |

### D12 — The catalogue (AD-IMPL-06)

- Route `apps/web/app/staff/dev/ui/page.tsx`. The page calls `notFound()` unless the build-time flag
  `NEXT_PUBLIC_DEV_CATALOGUE` is `1`. The flag is set **only inside two package scripts** — `dev` and
  `build:catalogue` of `apps/web` (`cross-env NEXT_PUBLIC_DEV_CATALOGUE=1 next …`) — and nowhere else: not in
  `.env.example` or any `.env*` file (a `NEXT_PUBLIC_*` value in a copied `.env` would be inlined by any
  build), not in a Dockerfile, a Compose file, a CI workflow or `next.config.*`. The CI job `catalogue` calls
  the script and therefore does not name the flag.
- `tools/guards/check-catalogue-flag.mjs` fails when the flag name appears in `.env*`, `**/Dockerfile*`,
  `docker-compose*.yml`, `.github/workflows/*`, `next.config.*`, or in a `package.json` script other than the
  two above, and when `.dockerignore` does not exclude `.env*`. The scaffold's e2e job (the stack built from
  the production images by the `images` job) gets one more spec that expects 404 on `/dev/ui` — the check
  after the fact. (`APP_ENV` of `add-foundation-auth-access` is an API variable and is not used here.) The
  site tree has no such route, so the site host answers 404 in every build.
- `proxy.ts` of `add-foundation-auth-access` excludes `/dev/ui` from the login redirect.
- `manifest.ts` lists every entry `{ name, section, rules, demos: { id, title }[] }`; the page renders from it;
  the unit test of the spec checks it against the AD-IMPL-02 names (38) and the 7 supporting names — 45
  entries. Each demo root carries `data-testid="demo-<name>-<id>"`, and each section has an anchor
  (`/dev/ui#money-input`).
- Controls at the top: language, theme (`staff` / `site` — sets `data-tree` on `<html>` and the money profile),
  persona, clock. They mirror the query parameters `lang`, `theme`, `as`, `now`; the query parameters win over
  the cookie for this page only.
- The catalogue clock (`now`) seeds `ClockProvider`, which every time-dependent demo reads through `useNow()`
  (`DateInput`, `FilterBar` presets, `NotificationBell`, `PriceGridEditor`), so results are the same on every
  run and do not depend on the device date.
- Demo labels come from the `devui` namespace (D6).
- Sections (14): Tokens (swatches + contrast table) · Fonts · Formatters (a table of input → output for every
  function in both languages) · Buttons and forms · Inputs · Badges and chips · Dialogs and overlays · Lists ·
  States · Permissions · Shell · Charts and KPI · Pickers · Data-less components.

Catalogue fixtures (`packages/ui/src/catalogue/fixtures.ts`) — people, branches, services, prices, payments
and dates of `docs/plan/spec-fixtures.md` §1–§5, plus its §8 "Catalogue-only demo rows" (the four B3 sales
totalling 44,000, the 56-row list, the booking cancel reasons of the DB Part 3 seed, the Hair colour grid at
B3, revenue by branch, three notifications, the discount approval, the receipt `B3-2026-OCT-00003`). A unit
test compares the fixture module with those values (CG-TEST-08).

### D13 — Tests

- Vitest unit tests next to the source for every function of D5, D7 and D8 — written **before** the
  implementation for money, dates and phone (the fixtures of the spec scenarios are the test tables). The
  `time/` and `format/` suites run three times: `TZ=UTC`, `TZ=Asia/Yangon`, `TZ=America/Los_Angeles`.
- Type tests (`expectTypeOf` / `// @ts-expect-error`) for `can()` codes, `t()` keys, `Button` `iconOnly`,
  `ConfirmDialog` required props, `formatMoney` with a `number`, and the tuple limits of D10.
- Component tests (Testing Library) per component folder for behaviour that needs no layout.
- Playwright on `/dev/ui` (`e2e/dev-ui/`). Projects: `my-320`, `en-320`, `my-1280`, `en-1280` (all specs) ·
  `my-360`, `en-360`, `my-768`, `en-768` (the layout spec of the components that change at 768 px —
  AD-QA-01) · one project with `timezoneId: 'America/Los_Angeles'` and a device clock set to 2020 · one with
  `reducedMotion: 'reduce'` · one at 640 px with `deviceScaleFactor: 2` (200 % zoom). They run in a new CI job
  `catalogue`: `pnpm --filter web build:catalogue` → `next start` alone (no API, no database) with
  `APP_ORIGIN=http://localhost:3100` and `SITE_ORIGIN=http://127.0.0.1:3100` → Playwright.
- No integration test: nothing here touches PostgreSQL.

### D14 — Guard rails (AD-IMPL-05; coding guideline §24)

Built or extended here (row numbers of the guideline's §24):

| §24 row | Guard | State after the scaffold | This change |
| --- | --- | --- | --- |
| 66 | Raw JSX text and attribute strings | on (`tools/eslint/web.mjs`) | covers `aria-label`, `placeholder`, `title`, `alt`; allowed literals `·`, `—`, `＋`, `*`, `▲`, `▼`; the catalogue demos are not exempt |
| 61 | Colours and fonts | hex colours, arbitrary colour classes and `font-family` on (`web.mjs`, `check-css.mjs` — run by `pnpm guards`) | adds Tailwind palette classes (`bg-blue-500`, `text-white`), `rgb()` / `hsl()` / `oklch()` literals, `style` colours and `fontFamily`; allow-list = `tokens.css` and `tokens.neutral.snapshot.css` |
| 37 | Float money | `parseFloat` / `Number.parseFloat` banned everywhere | `point/no-number-money` in `tools/eslint-plugin-point`: `Number()`, `parseInt()`, unary `+` or a binary arithmetic operator on an identifier or member named `amount` or ending in `_amount` / `Amount`, outside `packages/shared/src/money` (CG-MONEY-03); enabled for `apps/web` and `packages/*`; `apps/api` is enabled by `add-walkin-visit-checkout` (its task 2.9) |
| 44 | Formatting | – | `no-restricted-syntax` for `toLocaleString`, `toLocaleDateString`, `toLocaleTimeString`, `Intl.NumberFormat`, `Intl.DateTimeFormat`, `Intl.RelativeTimeFormat` outside `packages/shared/src/format` |
| 42 · 43 | Clock and zone | – | for `apps/web` and `packages/*`: `new Date()` without arguments and `Date.now()` outside `ClockProvider`; local-time `Date` getters / setters outside `packages/shared/src/time` and `src/format`; the three-zone unit matrix of D13 |
| 7 | Status numbers | – | `point/no-raw-status`: a member named `status` or ending in `_status` **compared with or assigned** a number literal |
| 60 | Shared components first | – | `react/forbid-elements` (`button`, `input`, `select`, `textarea`) and `no-restricted-imports` (`@radix-ui/*`) outside `packages/ui`; `check-catalogue-flag.mjs`; the 404 spec |
| 65 | Accessibility | off (no UI) | `eslint-plugin-jsx-a11y` (recommended) for `apps/web` and `packages/ui`; Playwright axe spec on the catalogue (staff and site themes), tags `wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`; flow pages get their axe specs with their changes |
| 59 · 62 · 63 | Web data rules | – | `no-restricted-globals` (`fetch` in components and hooks), `no-restricted-imports` (`axios`, `redux`, `zustand`, `jotai`, `swr`, `formik`, `yup`, `joi`), `@tanstack/eslint-plugin-query` (recommended), an array literal as `queryKey` outside `*.keys.ts`, `onMutate` outside the allow-list |
| 64 | Device sniffing and zoom | – | `tools/guards/check-web-globals.mjs`: `navigator.userAgent`, `user-scalable=no` |
| 48 | Translation keys | off (no language files) | `pnpm i18n:check` (`tools/guards/check-i18n.mjs`) + typed keys |
| 84 (fonts part) | Font licence | – | `pnpm fonts:check` (`tools/guards/check-fonts.mjs`) |
| – | Text style and site-only token | – | `tools/guards/check-ui-text-style.mjs`: `uppercase`, `italic`, `tracking-*` and `--decoration` under `packages/ui/src` (AD-VIS-06, FE-VIS-01b) |

Not built here: §24 row 81 (Lighthouse CI) → `add-ci-guard-rails`; row 38 (`BigInt.prototype.toJSON` guard)
and row 39 (property-based money tests) → `add-walkin-visit-checkout`, the first change with money
arithmetic; row 67 (golden files of documents) → the change that adds `packages/documents` templates; the
licence allow-list of row 84 and `knip` (row 88) → `add-ci-guard-rails`.

Each rule has a fixture that must fail and one that must pass, linted by the dedicated tests the scaffold set
up (`tools/eslint/test/web.test.mjs`, `tools/eslint-plugin-point/test/`) — the samples of the spec scenarios.

## Risks / Trade-offs

| Risk | Mitigation / test |
| --- | --- |
| A shared component looks right in the staff tree and fails contrast under the site palette (for example `--destructive` text on `--muted`, 4.21 : 1) | The catalogue's axe suite runs with `theme=site` as well as `theme=staff`; the automated contrast-table test asserts that no site pair fails; D8 fixes the badge styles |
| The site block drifts from FE-VIS-01a | Unit test of the 24 declarations with their exact values; task 12.10 compares the file with the guideline before the last merge |
| A component uses `--ring` / `--input` directly (the shadcn/ui default) instead of the two variables, which breaks the staff tree | Unit test over the component styles (no outline or border refers to either token) and the Playwright check of the computed outline and border colours in both themes |
| Success / warning / info look alike until the admin palette arrives | Icon + text on every badge; the unit test of the 71 pairs checks tone names, not colours |
| The pinned shadcn CLI generates other neutral values than the list in D2 | The snapshot file is the reference; the scenario values are quoted "with the Tailwind 4 generation" |
| Pyidaungsu's download carries no licence text | The font task stops and reports to the owner before the font is committed (D-PLT-13); `pnpm fonts:check` blocks the merge |
| The date library renders a zone differently per runtime | The three-zone unit matrix and the Playwright project with a foreign zone and a wrong device date |
| Name-based money lint misses a value with another name | `Mmk` is a branded `bigint`: a `number` is not assignable and mixing fails the type check; the lint rule is the second net |
| `/dev/ui` reaches production | The flag exists only inside two package scripts; the guard scans environment files, Dockerfiles, Compose files, workflows and `next.config.*`; `.dockerignore` must exclude `.env*`; the 404 spec runs against the built images |
| Overlap with `add-foundation-auth-access` (status constants file, error-code constants file, `packages/shared/src/permissions/`, the cookie `point_locale`, field codes of D9) | "First merge creates, second extends" — that change's design states the same rule |
| Overlap with `add-walkin-visit-checkout` (money module, `businessDateOf`) | Created here; that change's tasks 2.7 and 2.9 extend the tests and enable the money lint for `apps/api` — one module, one function |
| Two root layouts change a scaffold file (`app/layout.tsx`, `app/not-found.tsx`) | The scaffold's smoke and edge specs run unchanged in CI and must stay green |
| Zawgyi detection on very short strings | Conversion only at probability ≥ 0.95, and the converted text is shown with a notice before the form is submitted |
| Camera scanning differs by device | `QrScanner` takes a mock source for automated tests (AD-QA-03); manual check on one Android phone and one iPhone is in the verification group |
| Size: 77 requirements, 239 scenarios, 169 tasks — far larger than a 1–3 day change | The owner accepted it as an exception (D-PLT-20, v5.2.17 note — S2): the change stays whole and is delivered in three pull requests; the catalogue cases are run on every pull request and the test workbook on the last one |

## Migration Plan

1. No database migration and no API change.
2. The change is ready to apply: the owner answered every open item on 02/Oct/2026 13:08 (review §0.11).
3. Order: after `add-repo-scaffold`; independent of `add-foundation-auth-access`. Three pull requests, each
   titled `feat(add-shared-ui-components): <subject>` (CG-GIT-02). Pull request 1 (groups 1–5) gives tokens,
   formatters, language keys and the catalogue frame with its first three sections; pull request 2
   (groups 6–10) the components, the shell and their demos; pull request 3 (groups 11–12) the guard rails in
   CI and the final verification. Pull requests 1 and 2 merge on CI green + review, after their catalogue
   cases were run on the catalogue test build and the NG fixed; pull request 3 stays open while the test
   workbook of the whole change is generated and run on its branch, takes the NG fixes as commits and merges
   when no NG is open (D-PLT-20 v5.2.17 note, CG-GIT-05). The change is then archived.
4. When the owner supplies the admin palette (OPEN-30): a separate change replaces the staff values in
   `tokens.css` and repoints the staff `--focus-outline` / `--field-border` at `--ring` / `--input` (MODIFIED
   requirements); the contrast table and the axe suite verify the result.
5. Rollback: revert the pull request; no data is affected.
