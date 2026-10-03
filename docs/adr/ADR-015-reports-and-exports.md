# ADR-015: Reports & exports — live read-only SQL (≤ 366 days, no warehouse in V1), one code per report, `data.export` on top of the source's read right, sync small / background large exports, master-data-only imports

**Status:** Accepted — owner one-sheet **"အကုန်လုံး OK" (02/Oct/2026 00:06)**, items **H (4)** reports = live queries up to 1 year · **F1** one permission code per report (Manager = all but ⑦; ⑥ = Manager's branch P&L — E6) · **F2** export needs `data.export` (seed = Admin only) · **F3** Excel / CSV ≤ 50,000 rows, PDF = summary + 1,000 rows, large ones in the background for 24 h · **F5** go-live import = master data only, no Fresha history, no invites · **F6** refunds count on the refund date; returning customer = identified customer with an earlier visit. Implements 🔒 D-RPT-01 (the ten fixed reports), D-KPI-01 / 02 (the parts the API needs — OPEN-11), D-DSH-01..03, D-DAT-01 / 02, D-AUD-01 (exports audited). Used by API Part 8 P8-RULE-07 / 08 / 14 / 15 / 16 (🔒 D-API-09) and Part 7 P7-RULE-04 / 17 (closing components, `Pnl.compute` — 🔒 D-API-08). Recorded under D-ARC-01. **Review fix 02/Oct (independent review R2-1 — status unchanged):** `REPEATABLE READ READ ONLY` is for previews, reports, exports and dashboards **only**; every money write — day close and reopen included — runs READ COMMITTED with its locks taken first (Decision #1a). **Reconcile 02/Oct:** kind-2 wording = overpayment returns (automatic change and manual returns).
**Date:** 02/Oct/2026
**Deciders:** Owner (H / F1 / F2 / F3 / F5 / F6) · dev team

> **မြန်မာ အတိုချုပ်** — Report ၁၀ ခုနဲ့ dashboard ကို **DB ကနေ တိုက်ရိုက် (live)** တွက်မယ် — ညစဉ် ကြိုတွက်ထားတဲ့ table / data warehouse မသုံး (V1)။ ဒါကြောင့် ဒီနေ့ ဒီမိနစ်ထိ ကိန်းဂဏန်း မှန် — "Generated 2:14 PM" ပြ။ ရက်အပိုင်းအခြား **အများဆုံး ၁ နှစ် (၃၆၆ ရက်)**; query တစ်ခု **၁၅ စက္ကန့်** ထက်ကြာရင် ရပ်ပြီး "ရက် ကျဉ်းပါ" ပြ (POS မနှေးအောင်)။ Report တစ်ခု = permission code တစ်ခု (`report_<key>.view`; ⑥ = `pnl.view`; ⑦ commission / payroll = **Admin ပဲ** — private)။ **Excel / CSV / PDF ထုတ်** = `data.export` (Admin) + အဲ့ screen ကို ကြည့်ခွင့်; row ၅,၀၀၀ အထိ ချက်ချင်း download၊ အဲ့ထက်များရင် (သို့) PDF ဆိုရင် နောက်ကွယ်မှာ ပြင်ပြီး "My exports" ထဲ **၂၄ နာရီ** ထား; အများဆုံး ၅၀,၀၀၀ row; PDF = အနှစ်ချုပ် + ပထမ ၁,၀၀၀ row။ Export တိုင်း audit မှာ မှတ်။ **Import** (Fresha ကနေ) = master data ပဲ (customer, service + ဈေး, product, supplier, employee) · တစ်ခါ ၁၀,၀၀၀ row အထိ · confirm = အကုန် တစ်ခါတည်း (တစ်ဝက်တစ်ပျက် မဝင်) · history မယူ · invite မပို့။

## Context
- Volume (system design §1.3): ~30k sales / year (~100k money rows with items and payments), headroom 1 M rows / year; 3 branches; reports opened by the owner and managers a few times a day; dashboards refresh every 5 minutes or on events (AD-PERF-03).
- 🔒 D-RPT-01: exactly the ten reports of AD-RPT-04 — no ad-hoc report builder. 🔒 D-DSH-01..03: overview, needs attention, barber home.
- Money must agree everywhere: report ① revenue must equal the P&L ⑥ revenue (same rules), closings must use the stored snapshot once CLOSED (🔒 D-FIN-06), payment method / performer / collector must follow corrections (Part 4 `EffectiveSale` — contract 8), refunds count on the refund date (owner F6 — a past period never changes).
- Pay data is private (owner C1 — ADR-012 Amendment 1): report ⑦ and salary detail need company scope.
- 🔒 D-DAT-02 export within the permission scope; 🔒 D-DAT-01 import upload → validate → preview → confirm → audit; owner F5 limits go-live import to master data.
- One PostgreSQL 16 database on the VPS also serving the POS (ADR-001) — report load must never slow checkout.
- System design §6 already names the revisit trigger "reporting slowness → materialised views".

## Decision
1. **Live, read-only SQL — no warehouse, no materialised / summary tables, no report cache in V1** (owner H (4)). Each report request runs in **one `REPEATABLE READ READ ONLY` transaction** (summary, breakdowns and the detail page come from the same snapshot), with **`statement_timeout` 15 s** → 422 `report_timeout` ("narrow the range"); every response carries `generated_at`. Queries run on the primary database (no replica) and rely on the DBML indexes plus the report indexes added at build after a one-year load test.
   **1a. Where this isolation level stops (review fix 02/Oct — R2-1; Part 0 API-IDEM-06).** `REPEATABLE READ READ ONLY` is used **only** for read-only work: reports, exports, dashboards, the P&L and the previews (closing preview, payroll / commission preview). **Every transaction that writes money, stock or pay data — FINISH, payments, refunds, cash outs, day close and reopen, purchase / count posts, payroll finalize / reopen — runs READ COMMITTED**, takes its locks first in the one lock order (day lock → payroll lock → sale → visit → booking → payments → receipt counter → cash-out / closing rows → stock levels) and makes every check after the locks. Reason: PostgreSQL fixes a REPEATABLE READ snapshot at the transaction's first statement — for a close that would be the advisory-lock call itself, before the wait — so a payment committed while the close waited would be missing from its open-sales check and its cash components, and the day would be CLOSED without it (🔒 D-FIN-06, owner E2). Under READ COMMITTED each statement after the lock sees it.
2. **Range ≤ 366 days** (422 `range_too_long` `{ max_days }`) in MMT business dates; `to ≤ today` (report ⑨ may look ahead to the booking window); monthly reports (⑥ ⑦ ⑧) snap to whole months, ≤ 12. The same 366-day cap applies to the audit-log viewer (P8-RULE-06).
3. **One set of data rules, one code path** (P8-RULE-14): only FINISHED sales by `sales.business_date`; method / performer / collector = `EffectiveSale` (Part 4); line amounts net of line discount; kind-1 refunds on the refund's business date (F6); kind-2 overpayment returns (automatic change and manual returns) have no revenue effect; tax shown, never revenue; service charge is revenue; closings = the stored snapshot for CLOSED days, `DailyClosings.components` live otherwise (Part 7); P&L = `Pnl.compute` (Part 7 — so ① and ⑥ agree); commission / payroll = Part 5 finalized figures (provisional months flagged); stock = Part 6 ledger. KPI definitions (returning customer, average per visit, unidentified visits) as P8-RULE-14. The dashboard tiles call the same functions (P8-RULE-16).
4. **Permissions** (owner F1, ADR-011 / 012): one code per report — `report_sales.view` ① · `report_barber_performance.view` ② · `report_payments.view` ③ · `report_discounts_refunds.view` ④ · `report_closing_cash.view` ⑤ · **`pnl.view`** ⑥ (mixed — branch P&L with salary as one line, company P&L at company scope — owner E6) · **`report_commission_payroll.view`** ⑦ (**private** — company scope only) · `report_attendance_leave.view` ⑧ · `report_bookings_customers.view` ⑨ · `report_stock.view` ⑩. Default scope = the branches of the report code's grant; a listed branch outside it → 403 `out_of_scope`. Dashboard tiles are gated by the same codes. Data minimisation (AD-PERM-05): no customer phones in report rows, no commission figures outside ⑦.
5. **Exports** (P8-RULE-08 — owner F2 / F3):
   - **Who:** `data.export` (special, mixed, seed = **Admin only**) **on top of** the source's own read right (the report code, or the list's `view⁺`); the export applies the **same scope filter and columns** as the screen — private rows stay out. QR posters need only their source's view code (`website.view⁺` / `attendance_qr.view⁺`), not `data.export`.
   - **Size:** the row count is taken first in the export's snapshot; **> 50,000 rows → 422 `export_too_large`**; CSV / XLSX **≤ 5,000 rows → 200, streamed**, nothing stored; larger CSV / XLSX and **every PDF → 202 → job `export.run`** → file stored as an `exports` attachment (ADR-014) → realtime `export.ready` to the requester's user room → *My exports* for **24 h** → removed by `exports.purge` (hourly).
   - **PDF** = the summary + the first **1,000** detail rows (A4 landscape, `DocumentRenderer` — ADR-013) with a "detail truncated — export Excel for the full list" note.
   - **Formats:** CSV = UTF-8 **with BOM** (Excel shows Myanmar correctly), CRLF, RFC 4180 quoting; XLSX via exceljs (streamed, numeric money with thousands format, real dates `DD/MMM/YYYY` — D-PLT-05); **formula-injection guard** on every text cell starting with `=`, `+`, `-`, `@`, TAB or CR (prefixed `'`); money = integer MMK.
   - **Traceability:** every export, sync or background, writes audit `export.run { kind, key, format, query, row_count }` (🔒 D-DAT-02). The export id = the pg-boss job id — no export table (D-DB-12 / F-P8-09); no `Idempotency-Key` (a duplicate export is harmless).
6. **Imports** (P8-RULE-07 — owner F5): `import.run` (special, company scope); **master data only** — customers, service categories, simple services with per-branch sale / duration / price, product categories, products, suppliers, employees (created **without** invites); Fresha history is never imported. **≤ 10,000 data rows per job**; job `import.run` runs the `validate` and `confirm` phases; **confirm writes every VALID row in one transaction** through the owning parts' services (nothing half-imported; a DB error rolls back → FAILED); re-imports are SKIPPED through `import_source_refs` (unique); idempotent by state.
7. **Limits are fixed in code, not settings** (Part 8 §17): 366 days · 15 s · 50,000 / 5,000 / 1,000 rows · 24 h export retention · 10,000 import rows.

## Options Considered

### Option A: Live queries on the primary database (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — SQL per report, one snapshot transaction, a timeout |
| Cost | None beyond indexes |
| Scalability | Comfortable at ~100k money rows / year; guarded by 366 days + 15 s |
| Team familiarity | High |

**Pros:** figures are exact up to the second (dashboards "as of 2:14 PM"); one source of truth — reports, P&L and closing agree by construction; corrections (adjustments, refunds, reopen) show immediately; nothing to refresh or reconcile.
**Cons:** a wide query costs CPU on the same box as the POS — bounded by the range cap and the timeout; performance must be proven with a year of data.

### Option B: Nightly materialised views / summary tables
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — refresh jobs, invalidation after corrections |
| Cost | Extra storage and a nightly job |
| Scalability | Better for multi-year ranges |
| Team familiarity | Medium |

**Pros:** fast large ranges.
**Cons:** today's figures stale until the refresh; a refund or reopen leaves summaries wrong until the next run; two code paths that can disagree. Kept as the revisit path (system design §6).

### Option C: Read replica or separate warehouse / BI tool
| Dimension | Assessment |
|-----------|------------|
| Complexity | High — replication or ETL, another service |
| Cost | Another server / subscription |
| Scalability | High |
| Team familiarity | Low–Medium |

**Pros:** isolates report load completely; ad-hoc analysis.
**Cons:** more to run and hand over (🔒 D-PLT-06); permission and scope rules would have to be re-implemented outside the API; D-RPT-01 forbids ad-hoc reports anyway.

### Option D: Client-side aggregation (download raw rows, compute in the browser)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low on the server |
| Cost | Heavy on phones and 4G |
| Scalability | Poor |
| Team familiarity | High |

**Pros:** no server CPU.
**Cons:** sends raw rows (data minimisation lost), slow on 4G, scope filtering easy to get wrong.

**Exports — sync only (no background job):** rejected — a 50,000-row file or a PDF can take longer than a phone request survives on 4G; background + *My exports* keeps the request short.

## Trade-off Analysis
- **Freshness vs. load.** Live queries give exact, consistent figures; the 366-day cap, `READ ONLY` snapshot and 15-second timeout keep the worst case small enough for the shared database. A long snapshot also delays vacuum only for those seconds.
- **One code path.** Reports, P&L, closing and dashboard tiles share `EffectiveSale`, `DailyClosings.components` and `Pnl.compute`, so the owner never sees two different revenue figures for the same month.
- **Export reach vs. data leakage.** `data.export` is a separate tick (Admin only by default) and always sits on top of the screen's own right, so exporting never shows more than the screen; files live 24 h only and every export is audited.

## Consequences
- Easier: no refresh jobs, no stale dashboards, corrections visible at once; one permission rule per report; exports reuse the screens' queries.
- Harder: every report query must be tested on a year of synthetic data (1 M-row headroom) and indexed for its filters; the export pipeline (job, storage, purge, realtime) must be built; audit volume grows with exports.
- Revisit when: a report regularly approaches the 15 s timeout at a one-year range, or `report_timeout` appears in production → nightly materialised views for the heavy breakdowns or a read replica (system design §6); the owner needs more than 50,000 rows in one file → a streamed background CSV without the cap; custom KPIs (D-KPI-03 ⏭).

## Action Items
1. [ ] `ReportsModule`: one query module per report on shared data functions (`EffectiveSale`, `DailyClosings.components`, `Pnl.compute`, Part 5 finalized figures, Part 6 ledger); `REPEATABLE READ READ ONLY` + `statement_timeout` 15 s; `generated_at`; range / scope guards.
2. [ ] Load test with one year of synthetic data per branch (target headroom 1 M rows / year — system design §1.3); add indexes for report filters; record p95 per report.
3. [ ] `ExportsModule`: row count in snapshot, sync stream ≤ 5,000, job `export.run` (202) above that and for every PDF, CSV BOM + formula guard, XLSX streaming, `export.ready`, audit `export.run`; `exports.purge`.
4. [ ] `ImportsModule`: templates, Fresha header aliases (`imports.json`), job `import.run` (validate / confirm), one-transaction confirm, `import_source_refs`.
5. [ ] Tests: ① revenue = ⑥ revenue for the same month; refund dated in a later month changes only that month (F6); ⑦ refused at branch scope (403 `company_scope_required`); export boundaries 5,000 / 5,001 / 50,000 / 50,001; formula-injection cells; Myanmar text in CSV opened in Excel; import confirm rollback leaves nothing behind; a payment that commits while a day close waits for the day lock is counted by that close (READ COMMITTED — 1a).
