# Change roadmap — Point Barbershop V1

> **File:** `docs/plan/roadmap.md` (repo `point-sdd`) · **Version:** v1.0 · **Date:** 02/Oct/2026 (review v5.2.18 — owner sheet 3 answered 13:08, REC-41 / REC-42 approved 13:46: the first four changes are ready to apply)
> **Status:** the **order of the first four changes is 🔒** (owner 02/Oct/2026 — D-PLT-20). Everything from
> wave 1 on is a ⚠️ **proposal**: names, grouping, order and owners may change as briefs are written. Scope is
> not a proposal — V1 = every 🔒 decision, no release split (D-PLT-14).
> **Rule:** one change = one form or topic, 1–3 days, about 20–30 test cases (D-PLT-20). A row marked **L** is
> larger than that today and is split when its brief is written.
> **Row numbers are identifiers, not the order** — the order inside a wave is the table order (rows 77–81 were
> added after the independent review and sit where they are built).
> **Source of the scope:** API Part 0 §11 module map (441 endpoints) + UX guidelines + ADR action items.

## မြန်မာ အတိုချုပ်

- ဒီဖိုင်က **V1 အတွက် change စာရင်း** — ဘာကို ဘယ်အစဉ်နဲ့ ဘယ်သူ လုပ်မလဲ။ Change တစ်ခု = form / ခေါင်းစဉ် တစ်ခု (ဥပမာ
  Branch, Employee, Service)။
- **ပထမ ၄ ခု** (spec ရေးပြီး၊ owner မေးခွန်း အကုန် ဖြေပြီး — **apply လုပ်လို့ရပြီ**): repo အခြေခံ → shared UI component → login / permission → walk-in ကနေ
  receipt အထိ။
- **ဆိုင်မှာ စမ်းသုံးဖို့ (pilot)** ပထမ ၄ ခုတည်းနဲ့ မလုံလောက်ဘူး — server တင် (`add-staging-deploy`) + pilot branch ရဲ့
  တကယ့် data (`add-pilot-data-seed`) + နောက်မှ ပြန်ထည့် (`add-late-entry` — မီးပျက် / internet ပြတ်ရင် စာရွက်မှာ ရေး၊
  နောက်မှ ထည့်) ပြီးမှ barber ၃–၅ ယောက်နဲ့ စမ်းလို့ရတယ်။ Pilot မှာ **browser + Google login** ပဲ သုံးတယ်။
- ကျန်တာ **change ၇၆ ခု** ကို wave ၄ ခု ခွဲထားတယ် — နာမည် / အစဉ်က **အဆိုပြုချက်**၊ brief ရေးတဲ့အခါ ပြင်လို့ရတယ်။
- **Dev 1** = website + admin panel (service, schedule, customer, booking, website); **Dev 2** = admin panel
  (login, POS, ငွေ, payroll, stock)။ Change တစ်ခုကို developer တစ်ယောက်က API + screen အပြည့် လုပ်တယ်။
- **သတိပေးချက်:** ပထမ ၄ ခုတည်းက developer-ရက် ၄၀–၆၅ ခန့်မှန်းရတယ် (task ၅၀၄ ခု)၊ ကျန် ၇၆ ခုက တစ်ခု ၁–၃ ရက်။ "တစ်လ" ပစ်မှတ်
  (D-PLT-14) နဲ့ မကိုက်နိုင်တာကို `dev-plan.md` §6 မှာ ကိန်းဂဏန်းနဲ့ ပြထားတယ် — owner ဆုံးဖြတ်ရန်။

## Legend

**Owner:** D1 = Dev 1 (website + admin panel) · D2 = Dev 2 (admin panel) · both = shared work: split by path in #1 (tooling — the one paired build change) and the go-live checklist #76. One developer owns a change end to end — API, migration, screens, tests (owner sheet 2 #7); the other reviews.
**Size:** S ≤ 1 day · M 2–3 days · **L** > 3 days (to be split at brief time).
**Status:** ✅ proposal written (in `openspec/changes/`), open questions answered · ⬜ brief not written yet.

## Wave 0 — foundation and the first slice (🔒 order)

| # | Change | Capabilities | Covers | Depends on | Owner | Size | Status |
|---|---|---|---|---|---|---|---|
| 1 | `add-repo-scaffold` | platform-runtime | ADR-001 action items 1–5 (as amended by ADR-016), ADR-009 edge rules, health / status, error format, DB baseline (91 tables), CI and the cheap guard rails | – | both (paired exception) | **L** (20 req · 72 scenarios · 94 tasks — 8 PRs) | ✅ ready to apply |
| 2 | `add-shared-ui-components` | ui-foundation | AD-IMPL-02 components, tokens, formatters, money module, language files, `/dev/ui`, UI guard rails | 1 | D1 | **L** (77 req · 239 scenarios · 169 tasks — 3 PRs; includes the approved website tokens — REC-41 ✅) | ✅ ready to apply |
| 3 | `add-foundation-auth-access` | auth · access · audit · organization · platform-runtime | Google + e-mail code login, session / CSRF, guard + data levels (shown on one complete Part 1 read — P1.EMP.06), `/me`, audit, transaction runner, idempotency contract, base seed + fixture seed, the first-admin command, verify cap | 1 (web tasks: 2 PR 1) | D2 | **L** (46 req · 221 scenarios · 96 tasks — 3 PRs) | ✅ ready to apply |
| 4 | `add-walkin-visit-checkout` | visits · sales-checkout · payments · services-pricing · customers | Today → START → COMPLETE → cash / KBZPay / split → FINISH → receipt PDF; the price quote function; CASH / KBZPAY in the base seed | 1 · 2 · 3 | D2 (API, screens and tests end to end; D1 reviews) | **L** (41 req · 210 scenarios · 145 tasks — 3 PRs) | ✅ ready to apply |

The owner answered every open question of the four changes on 02/Oct/2026 13:08 (review §0.11, OPEN-41 ✅ —
all defaults). Their size is an accepted exception to the size rule (S2); each is delivered in several pull
requests and the test workbook runs on the last one (CG-GIT-05). **All four are ready to apply**, in this
order: 1 → (2 ∥ 3) → 4.

**Pilot gate (REC-03, AD-QA-04; 🔒 owner S16) — after wave 0 *and* the three pilot prerequisites at the top of wave 1**
(#5 `add-staging-deploy` — a server; #78 `add-pilot-data-seed` — the real branch, barbers, services and
prices; #20 `add-late-entry` — how an outage written on paper is entered, D-VIS-13). Then 3–5 barbers record
real walk-ins on their own phones in one branch; taps and seconds are measured against AD-GOAL-01; findings
become `fix-…` / `change-…` changes before wave 2 is built on top. In the pilot the staff sign in **with Google
in the browser tab**: code e-mails are not delivered before the domain exists (D-ARC-02) and the installed
Android shell / iOS Home-Screen PWA cannot sign in until #73.

## Wave 1 — guard rails, run it somewhere (pilot prerequisites), master data, the forms every later screen needs

| # | Change | Capabilities | Covers (API part · resource) | Depends on | Owner | Size |
|---|---|---|---|---|---|---|
| 77 | `add-ci-guard-rails` | platform-runtime | the heavier checks of the coding guideline §24 that no feature change builds: remaining type-aware lint rules, coverage floors, `spec:trace`, `openapi:check`, `knip`, licence + `pnpm audit` jobs, Lighthouse CI, PR size / description checks, table-ownership guard, route-completeness test (allow / deny, rate-limit class), log canary, `expectQueryCount`, `BigInt.prototype.toJSON` guard, money property-based tests (guideline §24 "Built by") | 1 | D2 | M |
| 5 | `add-staging-deploy` | platform-runtime | first server deploy, deploy job, `prisma migrate deploy`, Sentry / HetrixTools / Resend wiring (ADR-007), Caddy content-security policy (ADR-009 action item 1), per-session request cap 600 / minute (API-LIM-03), runbooks filled (D-PLT-06) | 1 · 3 | D2 | M |
| 78 | `add-pilot-data-seed` | organization · services-pricing · payments | an operator-run, reviewed script for the **pilot branch only**: the branch, the barbers with their Google addresses and role, services and prices, the real KBZPay reference pattern (★ owner gives the values); never the fixture people; replaced by the real screens (#9, #10, #12, #14, #16) and the import (#71) | 3 · 4 · 5 | D2 | S |
| 20 | `add-late-entry` | visits | late entry with four times, `sale.late_entry` (D-VIS-13). The closed-day and finalized-period refusals are specified here against `DayLock` / `PayrollLock` (built in #4) with a closed day and a finalized run inserted by the test builders; #44 and #53 later produce those rows for real | 4 | D2 | M |
| 6 | `add-realtime-gateway` | notifications · platform-runtime | Socket.IO path `/rt`, rooms from read scope, `session.updated` / `session.revoked`, event envelope (ADR-008, API-RT-01..03); delivers the Part 4 events that #4 already emits in-process (`visit.*`, `sale.*`) to the Today screen | 3 · 4 | D2 | M |
| 7 | `add-settings-store` | settings | Part 1 settings (definitions, effective values, set / reset, history), `settings.json`, maintenance mode (P1.SYS.03), Additional Settings screens; replaces the defaults reader of #4 (incl. `receipt.thank_you_text`) | 3 | D1 | M |
| 8 | `add-company-profile` | organization | Part 1 company; the receipt logo (upload through #17 — until then receipts print the shop name as text) | 3 (logo: 17) | D1 | S |
| 9 | `add-branch-management` | organization | Part 1 branches (list / create / read / update / status) | 3 | D1 | M |
| 10 | `add-employee-management` | organization · auth | Part 1 employees (create + user + invite, update, status, branch assignment, rating, invite resend / cancel), My devices + revoke sessions | 3 · 9 | D2 | **L** |
| 11 | `add-role-permission-matrix` | access | Part 1 roles + permission catalogue, role assign / revoke, company-admin and last-admin rules (AD-PERM-06 / 07) | 10 | D2 | M |
| 12 | `add-service-catalogue` | services-pricing | Part 2 service categories + services (master, archive, per-branch sale + duration, website fields) | 9 | D1 | M |
| 13 | `add-option-services` | services-pricing | Part 2 option groups / values / variants (≤ 2 groups), `OptionPicker` wiring (D-SVC-05) | 12 | D1 | M |
| 14 | `add-service-prices` | services-pricing | Part 2 price grid screens and endpoints (branch × location × variant × employee, effective-dated, copy from branch); the quote function itself is built whole in #4 and is reused here | 12 · 13 · 4 | D1 | M |
| 15 | `add-service-eligibility` | services-pricing | Part 2 eligibility matrix, bulk set, `home_allowed` | 12 · 10 | D1 | S |
| 16 | `add-payment-methods-admin` | payments | Part 4 payment methods CRUD / archive / order, KBZPay reference pattern | 4 | D2 | S |
| 17 | `add-attachments-upload` | data-management | Part 8 attachments (staging upload, link, signed URL, remove), public media path (ADR-014) | 3 | D2 | M |
| 18 | `add-notifications-inbox` | notifications | Part 8 notifications + notification types (incl. `job.failed` — ADR-002), bell, approvals inbox shell (D-NTF-01..03) | 6 | D2 | M |
| 79 | `add-employee-documents` | organization · data-management | Part 8 employee documents P8.DOC.01 / .02 (D-EMP-03, `employee.documents`) | 10 · 17 | D2 | S |
| 80 | `add-jobs-panel` | platform-runtime | P1.SYS.05 jobs panel, `integrity.check_weekly`, the purge jobs (ADR-002 action item 4, ADR-014 action item 4) | 5 | D2 | S |

## Wave 2 — the rest of the counter flow, schedule, customers, booking

| # | Change | Capabilities | Covers (API part · resource) | Depends on | Owner | Size |
|---|---|---|---|---|---|---|
| 19 | `add-proxy-recording` | visits | B records for A, incl. payment (D-VIS-12) | 4 | D2 | S |
| 21 | `add-visit-manager-override` | visits · sales-checkout | visits list, finish / incomplete on behalf (`sale.finish_override`), `sale.finished_for_you` notification | 4 · 18 | D2 | M |
| 22 | `add-payment-collector-picker` | payments | "collected by" picker and collector change (D-VIS-06) | 4 | D2 | S |
| 23 | `add-price-override` | sales-checkout | `sale.override_price` with reason (D-SVC-04) | 4 | D2 | S |
| 24 | `add-discount-codes` | discounts | Part 4 discount codes CRUD (company master), apply at checkout, once-per-customer | 4 | D2 | M |
| 25 | `add-discount-requests` | discounts | request / approve / reject / cancel, approver notifications, rounding to 100 (D-PAY-04) | 24 · 18 | D2 | M |
| 26 | `add-refunds` | refunds | Part 4 refunds (items / overpayment), refund receipt | 4 | D2 | M |
| 27 | `add-sale-adjustments` | refunds · sales-checkout | adjustments (method / performer / collected by), customer + KBZPay reference correction, difference sale | 26 | D2 | M |
| 28 | `add-receipts-list-lookup` | sales-checkout | Part 4 receipts of a day, lookup by number | 4 | D2 | S |
| 29 | `add-tax-service-charge` | sales-checkout · settings | D-PAY-08 switches and calculation order (owner confirms the order when enabling — system design §7 #2) | 7 · 4 | D2 | S |
| 30 | `add-schedule-patterns-shifts` | scheduling | Part 2 patterns, roster, single-day edit, generate job, day reset, conflicts | 10 | D1 | **L** |
| 31 | `add-leave-types` | leave | Part 2 leave types (company master) | 3 | D1 | S |
| 32 | `add-leave-requests` | leave | request (self / on behalf), edit, cancel, approve / reject, affected bookings | 30 · 31 · 18 | D1 | M |
| 33 | `add-availability-lookup` | scheduling | the one availability function (staff lookup: dates / slots / next) | 30 · 14 · 15 | D1 | M |
| 34 | `add-customer-management` | customers | Part 3 customers (list, create, read + stats, update, status, archive / restore, timeline, preferred barber) | 4 | D1 | M |
| 35 | `add-booking-cancel-reasons` | booking | Part 3 cancel reasons master | 3 | D1 | S |
| 36 | `add-staff-booking` | booking | Part 3 bookings: create (manage token), read, edit details, my bookings | 33 · 34 | D1 | M |
| 37 | `add-booking-calendar` | booking | calendar feed + calendar screen (AD-CAL-*) | 36 | D1 | M |
| 38 | `add-booking-reschedule-cancel` | booking | reschedule preview + reschedule, cancel with reason (staff) | 36 · 35 | D1 | M |
| 39 | `add-booking-noshow` | booking | no-show timer job, alarm, snooze, cancel as no-show (D-BKG-17) | 36 · 6 | D1 | M |
| 40 | `add-booking-visit-start` | visits · booking | START from a booking, lower-of-two price rule (owner B4), booking status sync | 36 · 4 | D2 | M |
| 41 | `add-home-service-visits` | visits · booking | home service price, transport fee line, travel time (D-SVC-06, D-BKG-22) | 40 · 14 | D2 | M |

## Wave 3 — money back office: closing, finance, attendance, pay, stock

| # | Change | Capabilities | Covers (API part · resource) | Depends on | Owner | Size |
|---|---|---|---|---|---|---|
| 42 | `add-finance-master-lists` | finance-closing | Part 7 cash-out reasons, expense / income categories | 3 | D2 | S |
| 43 | `add-cash-outs-returns` | finance-closing | Part 7 cash outs, cash returns, month-end must-return job | 42 | D2 | M |
| 45 | `add-expenses-incomes` | finance-closing | Part 7 expenses + manual incomes (create, approve / reject, delete with reason, attachments) | 42 · 17 | D2 | M |
| 44 | `add-daily-closing` | finance-closing · payments | Part 7 daily closing (preview, count, close, reopen — expected cash includes cash outs / returns of #43 and cash manual incomes of #45), KBZPay verify / unverify, full `DayLock` | 43 · 45 · 4 | D2 | **L** |
| 46 | `add-pnl` | finance-closing | Part 7 P&L (branch / company month, trend) | 45 · 44 | D2 | M |
| 47 | `add-attendance-clock` | attendance | Part 5 own clock-in / out (QR + GPS), branch QR tokens (the printable poster is an export kind of #68) | 30 | D1 | M |
| 48 | `add-attendance-records` | attendance | records, manual entry, correction, void, exceptions board + resolve | 47 | D1 | M |
| 49 | `add-commission-plans` | commission-payroll | Part 5 plans + tiers, assignments (set / end / withdraw = archive — OPEN-40 b), preview | 10 | D2 | M |
| 50 | `add-commission-estimate` | commission-payroll · sales-checkout | *My earnings*, checkout estimate line behind the own-earnings flag (D-DSH-03) | 49 · 4 | D2 | S |
| 51 | `add-salaries-pay-tab` | commission-payroll | salaries (effective-dated, withdraw = archive), allocation shares, payroll categories | 10 | D2 | M |
| 52 | `add-receivables` | commission-payroll | Part 5 advances / loans (issue, change, cash repayment, cancel), own advances | 51 · 43 | D2 | M |
| 53 | `add-payroll-runs` | commission-payroll | create / calculate / review (entries, lines, overrides), full `PayrollLock` | 49 · 51 · 48 | D2 | **L** |
| 54 | `add-payroll-finalize-pay` | commission-payroll | finalize / publish / mark paid / reopen (soft-delete salary expenses — OPEN-40 a), payslips (PDF / XLSX, own) | 53 · 45 | D2 | M |
| 55 | `add-product-catalogue` | inventory | Part 6 product categories, products, suppliers, adjustment reasons | 3 | D1 | M |
| 56 | `add-stock-levels-usage` | inventory | stock levels, movement ledger, barber usage, manual adjustment, low-stock notification | 55 · 18 | D1 | M |
| 57 | `add-product-lines` | sales-checkout · inventory | product lines at checkout, product-only sale, `StockLedger.post` at FINISH | 56 · 4 | D2 | M |
| 58 | `add-purchases` | inventory | Part 6 purchases (draft, lines, send to admin, post, cancel), purchase expense | 56 · 45 | D1 | M |
| 59 | `add-stock-transfers` | inventory | Part 6 transfers (draft, send, receive with difference, cancel) | 56 | D1 | M |
| 60 | `add-stock-counts` | inventory | Part 6 counts (start, blind entry, review, post) | 56 | D1 | M |

## Wave 4 — website, reports, data tools, shells, go-live

| # | Change | Capabilities | Covers (API part · resource) | Depends on | Owner | Size |
|---|---|---|---|---|---|---|
| 61 | `add-website-management` | website | Part 8 website admin (site content, opening hours, closures, team, share preview, booking QR link and image (the printable poster is an export kind of #68), revalidate) | 17 · 9 | D1 | M |
| 62 | `add-public-website-pages` | website | home, branch page, system pages, SEO, SSR + tag revalidation (ADR-006), site locale routing | 61 · 12 | D1 | **L** |
| 63 | `add-public-booking-modal` | booking · website | Part 3 public booking: options, availability, quote, create (Turnstile, manage token), confirmation page | 62 · 33 · 36 · 35 | D1 | **L** |
| 64 | `add-public-booking-manage` | booking | manage link: view, reschedule, cancel, cutoff rule | 63 | D1 | M |
| 65 | `add-dashboards` | reports-dashboards | Part 8 dashboards (overview, needs attention, my day, approval counts) | waves 2–3 | D2 | M |
| 66 | `add-reports-sales` | reports-dashboards | reports ① sales · ② barber performance · ③ payments · ④ discounts & refunds · ⑤ closing & cash; the one-year synthetic dataset and the load test (ADR-015 action item 2 — needed by CG-DB-09 / CG-PERF-04) | waves 2–3 | D2 | **L** |
| 67 | `add-reports-operations` | reports-dashboards | reports ⑦ commission & payroll (private) · ⑧ attendance & leave · ⑨ bookings & customers · ⑩ stock | waves 2–3 | D1 | **L** |
| 68 | `add-data-export` | data-management | Part 8 exports (sync ≤ 5,000 rows, background job, PDF), posters — attendance QR and booking QR (ADR-015) | 66 · 47 · 61 | D2 | M |
| 69 | `add-audit-log-screen` | audit | Part 8 audit list / detail with the row-visibility rules | 3 | D2 | S |
| 70 | `add-global-search` | platform-runtime | Part 1 global search (customers, bookings, receipts, employees — D-SRC-01) | 34 · 36 | D1 | S |
| 71 | `add-data-import` | data-management | Part 8 imports (master data only — D-DAT-01) | 12 · 34 · 55 · 10 | D2 | **L** |
| 72 | `add-backup-restore` | data-management | backup sidecar schedule, runs list, restore authorisation, monthly restore test (D-DAT-03 / 04) | 5 | D2 | M |
| 73 | `add-android-shell` | auth · sales-checkout | Capacitor shell (ADR-003), Google hand-off (P1.AUTH.06), Bluetooth receipt print (`add-receipt-bluetooth-print` folded in) | 4 · 28 | D2 | **L** |
| 74 | `add-windows-shell` | platform-runtime | Tauri shell (D-PLT-01) | 5 | D1 | S |
| 75 | `add-pwa-install` | ui-foundation | manifest, icons, install guide, iOS constraints (D-PLT-10, AD-PWA-01) | 2 | D1 | S |
| 81 | ~~`change-site-colour-tokens`~~ | ui-foundation | **folded into #2** — the owner approved the remaining website tokens (REC-41 ✅ 02/Oct/2026 13:46) before #2 was applied, so `add-shared-ui-components` builds them | – | D1 | – |
| 76 | `add-go-live-readiness` | – (docs / data) | go-live checklist: owner settings and seed matrix review, real master data import, handover documents (D-PLT-06), production domain + Resend verification (ACT-05 / ACT-08) | all | both | M |

## How the list is kept

- A brief (`docs/briefs/<change-id>.md`) may rename, split or merge a row — update this file in the same commit.
- A row leaves the list only when its change is archived; add the archive date in the Status column.
- New work found during the pilot or testing is a new row (`fix-…`, `change-…`), never a silent addition to an
  existing change.
- Count today: **81 rows** — 4 written, 76 to brief (19 S · 47 M · 10 L), 1 folded into #2 (row 81). 14 rows are marked **L** (10 of them
  still to brief) and will become two or more changes.
