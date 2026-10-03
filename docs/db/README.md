# Point Barbershop — DB design (Part 1–8 🔒 · 30/Sep/2026 · Part 1 v3.4 — 01/Oct/2026 · Part 2 v1.3 🔒 — 01/Oct/2026 21:20 · Part 4–8 G — 02/Oct/2026 · Part 5 v1.2 + Part 7 v1.2 — OPEN-40, 02/Oct/2026)

Source of truth = `docs/decisions/point-barbershop-system-review-v5.2.18.md` (Appendix A decision register → generated `docs/decisions/decision-register.md` · §6). Repo path of this folder = `point-sdd/docs/db/` (ADR-016); the app repo `point-barber` builds its migrations from these files and keeps hash-checked copies in `db/source/`.

**Comment ဟောင်းများ (02/Oct/2026 — independent review R3-25; DBML / SQL ဖိုင် မပြင်):** lock လုပ်ထားတဲ့ DBML / SQL ဖိုင်တွေရဲ့ **comment / note** ထဲမှာ ကျန်နေတဲ့ နာမည်ဟောင်းတွေကို **API Parts 1–8 (🔒 D-API-01..09) က အစားထိုးတယ်** — schema (table / column / constraint) ကတော့ ဒီဖိုင်တွေအတိုင်းပဲ မှန်တယ်၊ comment စာသားပဲ ဟောင်းတာ။ အစားထိုးချက်: `site.domain` setting → server `.env` `SITE_ORIGIN` (setting မဟုတ်တော့) · permission `website.manage` / `website.branch_manage` → `website.view` / `website.update` · `settings.manage` → `settings.update` · `notification.manage` → `notification.view` / `notification.update` · notification code `low_stock` → `stock.low` · setting `stock.low_stock_notify_roles` → ဖြုတ် (notification catalogue ရဲ့ recipient rule) · setting `closing.close_roles` → ဖြုတ် (permission `closing.close`) · permission `finance.pnl.view` → `pnl.view` · "backup = pg-boss job" → backup က **sidecar container** (pg-boss မဟုတ် — ADR-002) · Part 6 DBML comment "`stock_movements` / `purchases` ပြောင်းတိုင်း DB trigger → `audit_events`" → အဲ့ table ၂ ခုမှာ audit trigger **မရှိ** (Part 8 constraints = ငွေ table ၁၈ ခုပဲ) — audit = app interceptor row; `stock_movements` ကိုယ်တိုင်က append-only ledger (API Part 6 P6-RULE-15) · `finance.month_end_must_return_job` → setting မဟုတ်၊ pg-boss job **`closing.month_end_must_return`** (နေ့စဉ် 01:00 MMT — အဲ့ branch ရဲ့ လတစ်လလုံး စာရင်းပိတ်ပြီးမှ ပြောင်း; API Part 7 P7-RULE-12)။ **OPEN-40 ✅ (owner "OPEN-40 OK" — 02/Oct/2026):** (a) / (b) ရဲ့ DB ပြောင်းလဲမှု (Part 7 v1.2 — expense FK `ON DELETE SET NULL` + CHECK; Part 5 v1.2 — `employee_salaries` / `employee_commission_plans` archive column) = **zip v8 မှာ ထည့်ပြီး** (အောက်မှာ); (c) က DB ပြောင်းစရာ မလို။

**zip v8 (02/Oct/2026) — OPEN-40** (owner **"OPEN-40 OK"** 02/Oct/2026 — review §0.9: (a) B · (b) B · (c) A — "DB Part 5 v1.2 + Part 7 v1.2 (test ပြန် run)"; 🔒 D-DAT-05 hard delete ✖ ကို မချိုး):
- **Part 5 → v1.2 (OPEN-40 b — 🔒 D-DB-09 v1.2)** — `part5-commission-payroll-attendance-v1.2.dbml` (v1.1 ဖိုင် အစားထိုး) + constraints v1.3: `employee_salaries` + `employee_commission_plans` `.archived_at` (timestamptz NULL) / `archived_by_user_id` (uuid NULL → users) / `archive_reason` (text NULL) + `employee_salaries_archive_chk` / `employee_commission_plans_archive_chk` (all-or-none, reason ဗလာ ✖) · EXCLUDE `employee_salaries_no_overlap` / `employee_commission_plans_no_overlap` = `WHERE (archived_at IS NULL)` — archived row က ရက်တူ row အသစ် / ရှေ့ row ပြန်ချိတ်တာကို မပိတ်ဆို့ (Part 2 v1.3 `archived_at` ပုံစံတူ) · မှားထည့်မိ + မသုံးရသေးတဲ့ လစာ row / plan assignment ရုပ်သိမ်း (API P5.EPY.04 / P5.CPA.04) = row ကို **archive အရင်** → ပြီးမှ ရှေ့ row `effective_to` ပြန်ချိတ် / မှန်တဲ့ row အသစ် (EXCLUDE = statement တိုင်း စစ်) · "မသုံးရသေး" စစ်တာ = app · row မဖျက်။
- **Part 7 → v1.2 (OPEN-40 a — 🔒 D-DB-11 v1.2)** — `part7-finance-closing-v1.2.dbml` (v1.1 ဖိုင် အစားထိုး) + constraints v1.2: FK `expenses.payroll_entry_branch_allocation_id` → `payroll_entry_branch_allocations.id` = **`ON DELETE SET NULL`** (DBML `Ref: … [delete: set null]` → `_generated-tables-part1-8.sql`; constraint နာမည် `expenses_payroll_entry_branch_allocation_id_fkey` မပြောင်း) · `expenses_source_refs_chk` = source 3 (PAYROLL) ⇒ `(payroll_entry_branch_allocation_id IS NOT NULL OR deleted_at IS NOT NULL)` — allocation NULL ကို **soft delete ဖြစ်ပြီးသား row မှာပဲ** ခွင့်ပြု · column အသစ် မရှိ · `expenses_one_per_allocation` (`WHERE … IS NOT NULL AND deleted_at IS NULL`) / `expenses_deleted_chk` မပြောင်း။ Payroll reopen (`Expenses.removePayroll`) = run ရဲ့ salary expense တွေ **soft delete အရင်** (`deleted_at` · `deleted_by_user_id` = actor · `deletion_reason` = "Payroll reopened — <reason>") → ပြီးမှ allocation ဖျက် (🔒 F-P5-09 — FK က allocation id ကို NULL လုပ်, expense row ကျန်) → finalize ပြန် = allocation အသစ် + expense row အသစ်။ **DB က စောင့်တာ:** soft delete မလုပ်ရသေးတဲ့ expense ရဲ့ allocation ဖျက်ရင် ပယ် (SET NULL ⇒ CHECK `expenses_source_refs_chk` — `SET CONSTRAINTS … DEFERRED` နဲ့လည်း ချက်ချင်း) · allocation NULL ဖြစ်ပြီးသား row ကို un-delete ✖ · audit trigger (`audit_expenses`) က soft delete + SET NULL ၂ ကြောင်းလုံး before-image နဲ့ မှတ်။
- **(c) Draft purchase / transfer line** — ဖျက် + audit diff အပြည့် (booking item — owner A2 ပုံစံတူ) → **DB မပြောင်း** (Part 6 = v1.2 အတိုင်း)။
- `_generated-tables-part1-8.sql` — column ၆ ခု + FK ၂ ခု (`archived_by_user_id` → users) + FK action ၁ ခု (`ON DELETE SET NULL`) + COMMENT (`@dbml/core` 10.2.0 နဲ့ DBML ၉ ဖိုင်ကနေ ပြန်ထုတ်ပြီး ပြောင်းတဲ့ line တွေကို ထည့် — Part 3–8 = ပြန်ထုတ်တာနဲ့ အတိအကျ ကိုက်; Part 1–2 ရဲ့ အရင်က လက်နဲ့ပြင်ထားတဲ့ line မထိ)။
- PostgreSQL 16 load (table ၉၁ — မပြောင်း) · test ၃၅၅ → **၃၉၃** PASS (Part 5 +19 = 83–101 archive · Part 7 +19 = 59–77 payroll reopen ↔ salary expense)။

**zip v7 (02/Oct/2026) — G** (owner one-sheet "အကုန်လုံး OK" 02/Oct/2026 00:06 — row G "column / index ပဲ — ရှိပြီးသား design မပြောင်း; test ပြန် run"):
- **Part 4 → v1.2 (G f — 🔒 D-VIS-08, API P4-RULE-01)** — schema မပြောင်း (DBML = header note ပဲ, ဖိုင်နာမည် မပြောင်း) · `part4-…-constraints.sql` v1.2 = BEFORE trigger ၄ ခု: `sales_finished_guard` (sale 2 FINISHED / 0 CANCELLED ⇒ `customer_id` + `updated_at` ပဲ — owner B10) · `sale_items_finished_guard` (sale 2 / 0 ⇒ line INSERT / UPDATE / DELETE ✖ — ကွာငွေ = sale အသစ်, refund = `refund_items`, barber = `sale_adjustments`) · `payments_finished_guard` (sale 2 ⇒ `verified_at` / `verified_by_user_id` / `external_reference` ပဲ, DELETE ✖ — owner B10 / E3; `payments` မှာ `updated_at` column မရှိ) · `visits_final_guard` (visit 3 FINISHED / 0 INCOMPLETE ⇒ `updated_at` ပဲ) → SQLSTATE `P0001` message `finished_immutable` (API 423 `locked`)။
- **Part 5 → v1.1 (G a / b)** — `part5-commission-payroll-attendance-v1.1.dbml` (zip v8 ကစ `…-v1.2.dbml`) + constraints v1.2: `attendance_records.voided_at` / `voided_by_user_id` (→ users) / `void_reason` + `attendance_records_void_chk` (all-or-none, reason ဗလာ ✖) · `attendance_records_one_open` = `WHERE clock_out_at IS NULL AND voided_at IS NULL` · `attendance_records_no_overlap` EXCLUDE `WHERE (voided_at IS NULL)` · `employee_receivables.client_request_id` + `employee_receivable_repayments.client_request_id` (uuid UNIQUE NULL) · note: payroll repayment row = run **Mark paid** မှာ INSERT (D-PAYR-04 — FINALIZE ✖) · cash ပြန်ဆပ် = owner / admin လက်ထဲ, ဗီရို ✖ (owner C3)။
- **Part 6 → v1.2 (G c)** — `part6-inventory-v1.2.dbml` + constraints v1.1: `stock_movements.client_request_id uuid NULL` + `stock_movements_client_request_uq` (partial unique `WHERE client_request_id IS NOT NULL` — "သုံးကုန်" / manual adjust ၂ ခါ နှိပ် ကာ) · append-only trigger `stock_movements_no_update` မပြောင်း (test 49)။
- **Part 7 → v1.1 (G d)** — `part7-finance-closing-v1.1.dbml` (zip v8 ကစ `…-v1.2.dbml`) + constraints v1.1: `cash_outs` + `cash_returns` `.cancelled_at` / `cancelled_by_user_id` (→ users) / `cancel_reason` + `cash_outs_cancel_chk` / `cash_returns_cancel_chk` (all-or-none — owner E5) · `expenses.client_request_id` + `manual_incomes.client_request_id` (uuid UNIQUE NULL) · note: closing / outstanding / လကုန် job = cancelled ✖ · cash manual income = PENDING + APPROVED ⇒ expected cash (owner E7) · P&L = APPROVED ပဲ · KBZPay verify = ပိတ်ပြီးလည်း ရ (owner E3 — comment ညှိ) · OPEN-40 option B = zip v8 (Part 7 v1.2) မှာ ထည့်ပြီး။
- **Part 8 → v1.1 (G e)** — `part8-system-website-v1.1.dbml` (schema မပြောင်း — note) + constraints v1.1: `backup_runs_restore_chk` = RESTORE_TEST (kind 3) `performed_by_user_id` NULL ရ (လစဉ် auto — owner F9) · `attachments_deleted_chk` = `(deleted_by_user_id IS NULL OR deleted_at IS NOT NULL)` (system purge / replace = `deleted_by` NULL)။
- `_generated-tables-part1-8.sql` — column ၁၄ ခု + FK ၃ ခု + COMMENT (generated ပုံစံ — `@dbml/core` 10.2.0 နဲ့ ပြန်ထုတ်ပြီး တိုက်: Part 3–8 အတိအကျ ကိုက်) · Part 5 test seed = OPEN → line → FINISH အစဉ် (FINISHED sale ကို line INSERT ✖ — G f)။
- PostgreSQL 16 load (table ၉၁ — မပြောင်း) · test ၂၉၆ → **၃၅၅** PASS (Part 4 +24 · Part 5 +13 · Part 6 +5 · Part 7 +12 · Part 8 +5)။

**zip v6 (01/Oct/2026 21:20) — Part 2 v1.3 🔒 (owner confirmed — decision sheet #24, D-DB-06 v1.3).** Schema unchanged from zip v5; header comments updated; PostgreSQL 16 load (table ၉၁) + test files re-run PASS.

**zip v5 (01/Oct/2026 13:00) — Part 2 v1.2 → v1.3 (🔒 since zip v6 — D-DB-06 v1.3)** (API Part 2 design — independent review #2): `employee_service_eligibilities.archived_at` + `schedule_patterns.archived_at` (nullable timestamptz) — တစ်နေ့တည်း eligibility ပြန်ဖြုတ် / pattern segment ဖျက်တာကို `effective_to = effective_from − 1` နဲ့ ပိတ်လို့ မရ (date CHECK)၊ hard delete မလုပ် (D-DAT-05) → archive; `eligibility_one_open` partial unique မှာ `archived_at IS NULL` ထပ် (constraints.sql v1.1)။ Column ၂ ခုပဲ၊ table / FK မပြောင်း · PostgreSQL 16 load (table ၉၁) + regression ပြန် PASS။

**zip v4 (01/Oct/2026) — Part 1 v3.3 → v3.4** (owner အဖြေ ဒုတိယအကြိမ်): `employees.show_own_earnings` → **nullable** (NULL = company setting `dashboard.show_own_earnings_all` — settings.json key, DB migration ✖ — လိုက်; true / false = override → "အကုန်လုံး" ရော "တစ်ယောက်ချင်း" ရော ရ) + `employees.public_rating numeric(2,1) NULL` (OPEN-37 ✅ admin / manager ပေးတဲ့ website rating, 1.0–5.0 / 0.5 ခြား CHECK `employees_public_rating_chk`; V2 = customer rating)။ PostgreSQL 16 load + regression ပြန် PASS။

**zip v3 (01/Oct/2026) — Part 1 v3.2 → v3.3** (owner UI/UX guideline အဖြေ — review §0.2 (စ)): `users.ui_language smallint NULL` (1 MY · 2 EN — OPEN-33 ✅ ဘာသာ = user account) + `employees.show_own_earnings boolean NOT NULL DEFAULT false` (OPEN-10 ✅ barber ကိုယ့် sale / commission — admin က တစ်ယောက်ချင်း ဖွင့်)။ Column ၂ ခုပဲ၊ table / FK / test မပြောင်း · CHECK `users_ui_language_chk` = `part1-foundation-v3-constraints.sql` · `_generated-tables-part1-8.sql` ပြင်ပြီး · PostgreSQL 16 load (table ၉၁) + Part 3 / 8 regression PASS ပြန်စမ်းပြီး။ **မှတ်ချက်:** Part 1b / 2 / 8 ဖိုင်တွေရဲ့ comment ထဲက `part1-foundation-v3.2.dbml` ဆိုတာ = ဒီ `v3.4` ဖိုင် (locked ဖိုင်တွေကို comment အတွက် မပြင်ထား)။
DBML = table / column / relationship · `*-constraints.sql` = CHECK / partial unique / EXCLUDE / trigger (DBML မှာ ရေးလို့မရတာ) · `*-test.sql` = PostgreSQL 16 constraint test။

| Part | DBML | Constraints | Test | Lock |
| --- | --- | --- | --- | --- |
| 1 Foundation / Org / Access | part1-foundation-v3.4.dbml | part1-foundation-v3-constraints.sql (v3.4) | (review §6.3 — 9 + ui_language / public_rating CHECK) | D-DB-02 (v3.4 — 01/Oct) |
| 1b Login | part1b-login-v1.dbml | part1b-login-v1-constraints.sql | (review §6.3b — 7) | D-DB-05 |
| 2 Services / Scheduling | part2-services-scheduling-v1.3.dbml | part2-services-scheduling-v1-constraints.sql (v1.1) | (review §6.3c — 18 + archived_at index) | D-DB-06 (v1.3 🔒 — 01/Oct 21:20) |
| 3 Customers / Booking | part3-customers-booking-v3.dbml | part3-customers-booking-v3-constraints.sql | part3-…-test.sql (30) | D-DB-07 |
| 4 Visits / Sales / Payments | part4-visits-sales-payments-v1.dbml (v1.2 header note — schema v1) | part4-…-constraints.sql (v1.2) | part4-…-test.sql (83) | D-DB-08 (v1.2 — 02/Oct G f) |
| 5 Commission / Payroll / Attendance | part5-commission-payroll-attendance-v1.2.dbml | part5-…-constraints.sql (v1.3) | part5-…-test.sql (104) | D-DB-09 (v1.2 — 02/Oct OPEN-40 b · v1.1 — 02/Oct G a / b) |
| 6 Inventory | part6-inventory-v1.2.dbml | part6-inventory-v1-constraints.sql (v1.1) | part6-…-test.sql (49) | D-DB-10 (v1.2 — 02/Oct G c) |
| 7 Finance / Closing / P&L | part7-finance-closing-v1.2.dbml | part7-finance-closing-v1-constraints.sql (v1.2) | part7-…-test.sql (77) | D-DB-11 (v1.2 — 02/Oct OPEN-40 a · v1.1 — 02/Oct G d) |
| 8 System / Website | part8-system-website-v1.1.dbml | part8-system-website-v1-constraints.sql (v1.1) | part8-…-test.sql (50) | D-DB-12 (v1.1 — 02/Oct G e) |

**Table ၉၁ ခု · test ၃၉၃ ခု PASS (PostgreSQL 16 — zip v8, 02/Oct/2026: Part 3 30 · Part 4 83 · Part 5 104 · Part 6 49 · Part 7 77 · Part 8 50)**

## dbdiagram.io
DBML ၉ ဖိုင်ကို အစဉ်လိုက် (part1 → part8) တစ်ဖိုင်တည်း ပေါင်း paste။ `_generated-tables-part1-8.sql` = `@dbml/core` က ထုတ်တဲ့ DDL (table + FK ပဲ — FK action `ON DELETE SET NULL` (Part 7 v1.2) အပါ; constraint ဖိုင် သီးသန့် run ရ)။

## PostgreSQL 16 load order
```bash
createdb point
psql point -v ON_ERROR_STOP=1 \
  -f _generated-tables-part1-8.sql \
  -f part1-foundation-v3-constraints.sql \
  -f part1b-login-v1-constraints.sql \
  -f part2-services-scheduling-v1-constraints.sql \
  -f part3-customers-booking-v3-constraints.sql \
  -f part4-visits-sales-payments-v1-constraints.sql \
  -f part5-commission-payroll-attendance-v1-constraints.sql \
  -f part6-inventory-v1-constraints.sql \
  -f part7-finance-closing-v1-constraints.sql \
  -f part8-system-website-v1-constraints.sql
# test (ဖိုင်တစ်ခုချင်း — database အသစ်တစ်ခုစီ)
psql point -f part3-customers-booking-v3-test.sql   # … part8
```
Part 2 constraints က `CREATE EXTENSION btree_gist` (EXCLUDE) ဖွင့်တယ်။ Timezone = Asia/Yangon (D-PLT-15 — business_date CHECK)။

## Prisma / migration
- DDL ကို Prisma `migrate dev --create-only` ထဲ ထည့် (constraint SQL = migration ထဲ raw SQL)။
- App DB role: `audit_events` ပေါ် INSERT + SELECT ပဲ (D-AUD-02 — part8 SQL comment)။
- Request တိုင်း `SET LOCAL app.user_id = '<uuid>'` (audit trigger actor)။

## Rule (review §6.5 checklist)
- Status / type = smallint + CHECK (D-DB-03) · MM / EN (D-DB-04) · company_id (D-ORG-03) · UUIDv7 · `*_amount` bigint MMK · `*_at` timestamptz · `business_date` MMT
- CHECK မှာ nullable column ကို OR-branch ထဲ စစ်ရင် `IS NOT NULL` အရင် (§6.5 #13 — NULL = pass)
- Transactional table hard delete ✖ (D-DAT-05) · ledger (stock_movements, audit_events, settings_history) = trigger append-only
- မှား row ရုပ်သိမ်း = `archived_at` / `archived_by_user_id` / `archive_reason` (all-or-none CHECK) + overlap EXCLUDE `WHERE (archived_at IS NULL)` (Part 5 v1.2 — OPEN-40 b) · payroll reopen = salary expense soft delete → allocation ဖျက် (FK `ON DELETE SET NULL` + CHECK — Part 7 v1.2, OPEN-40 a)
- FINISHED / CANCELLED sale (+ line, payment) · FINISHED / INCOMPLETE visit = trigger guard `finished_immutable` (Part 4 v1.2 — G f) · Idempotency-Key = row ရဲ့ `client_request_id` (G b / c / d)
