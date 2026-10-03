# Tasks — add-walkin-visit-checkout

Every task is ≤ 2 hours. Order: data → shared package → API (tests first for money, permission and
date-boundary rules) → web → e2e → verification. The owner answered every open question on 02/Oct/2026 13:08
(review §0.11), so the change is ready to apply.

**Owner:** Dev 2, end to end (API, screens, tests); Dev 1 reviews every pull request.

Pull requests: **A** = groups 1 – 6 · **B** = groups 7 – 9 · **C** = groups 10 – 14, each titled
`<type>(add-walkin-visit-checkout): <subject>`. Tests that need a row a later group creates (a COMPLETED visit,
a payment, a FINISHED sale) build it with the SQL test builders, so each pull request is green on its own.
Pull requests A and B merge on green CI + review; the test workbook is generated and run on pull request C
(CG-GIT-05, D-PLT-20).

## 1. Catalogues and seed

- [ ] 1.1 Integration check (no migration): a freshly migrated database has the tables of design D3 and the triggers `sales_finished_guard`, `sale_items_finished_guard`, `payments_finished_guard`, `visits_final_guard`, `audit_sales`, `audit_sale_items`, `audit_payments`, `audit_refunds` (point-barber) — design D3 · P4-RULE-01 · D-AUD-02
- [ ] 1.2 Record in `docs/engineering/module-map.md` the table ownership of this change (`delivery`: `visits` · `sales`: `sales`, `sale_items`, `receipt_counters`, `payment_methods`, `payments`, `refunds` · `booking`: `customers` · `platform`: generated `attachments`) and the lock keys `day:`, `payroll:`, `payref:`, `receipt:`; `pnpm guards` green (point-barber) — ADR-001 · CG-ARCH-01 · CG-DB-08
- [ ] 1.3 Add the 22 Part 4 permission codes with level and kind to `packages/shared/definitions/permissions.json`; test that the sync creates them and gives them to the company-admin role (point-barber) — Part 4 §9 · ADR-011 · ADR-012
- [ ] 1.4 Add the Part 4 seed codes to the `SeedRoles` sets of Manager and Barber, with a unit test of the two sets (point-barber) — Part 4 §9 · D-ROLE-07
- [ ] 1.5 Tests first: on a migrated database without fixtures the base seed leaves exactly CASH and KBZPAY (flags, order, `reference_regex` null) and a second run adds nothing (point-barber) — P4-RULE-19 · D-PAY-01 · D-PAY-02
- [ ] 1.6 Implement `PaymentMethodSeed.ensure(tx)` in `sales` and call it from the base seed after `SeedRoles.ensure` (point-barber) — P4-RULE-19 · design D3
- [ ] 1.7 Fixture module `050-kbzpay-pattern`: `reference_regex` = `^KBZ[0-9]{10}$` on KBZPAY; ids in `FIXTURE_IDS` (point-barber) — D-PAY-02 · spec-fixtures §4
- [ ] 1.8 Fixture modules `060-customers` (Ma Su, `09 7712 3456`), `070-eligibility` (fixture barbers × Haircut / Shave / Hair wash at their branch) and `080-opening-hours` (9:00 AM – 9:00 PM every day, B1 – B3) (point-barber) — spec-fixtures §2 – §5 · D-EMP-05
- [ ] 1.9 Fixture module `090-part4-grants`: the Part 4 seed codes on the fixture Manager and Barber roles; test that Ma Hnin holds `visit.view`, `visit.update`, `visit.delete`, `sale.view`, `sale.finish_override` for B3 only (point-barber) — Part 4 §9 · ADR-012

## 2. Shared package

- [ ] 2.1 Check the named constants of `packages/shared` for `visits.status`, `sales.status`, `sale_items.line_type`, `visits.location_type`, `payment_methods.kind`, `refunds.kind`; add `PriceSource` (1 – 4) and any that is missing (point-barber) — D-DB-03 · API-DATA-04 · AD-IMPL-04
- [ ] 2.2 Zod response DTOs `SaleItem`, `Payment`, `PaymentMethod`, `RefundSummary`, `SaleActions`, `Warning` (point-barber) — API-ERR-03 · Part 4 §13
- [ ] 2.3 Zod response DTOs `Sale` and `Visit` (with its `sale`) (point-barber) — API-ERR-03 · Part 4 §13
- [ ] 2.4 Zod response DTOs `Quote`, `ServiceListItem`, `ReceiptView`, `RequestLookup`, `CustomerLookup` (point-barber) — P2.PRC.06 · P4.RCP.01 · P4.REQ.01 · P3.CUS.02
- [ ] 2.5 Unit test that compares the DTOs of 2.2 – 2.4 with the schemas of the Part 2 / 3 / 4 OpenAPI files (point-barber) — API-ERR-03
- [ ] 2.6 Zod request schemas `StartVisitRequest`, `SaleItemCreate`, `ReasonBody`, `PaymentCreate`, `FinishRequest`, `QuoteRequest` holding only the members of design D12; unit tests: unknown member stripped, `amount` integer ≥ 1, reason 1,000 accepted and 1,001 refused (point-barber) — P4.VIS.03 · P4.SAL.04 · P4.PAY.02 · P4.SAL.10
- [ ] 2.7 Add month-boundary and UTC-midnight cases to the existing `businessDateOf` tests (`2026-10-04T23:59:59Z` → `2026-10-05`, `2026-10-31T17:29:00Z` → `2026-10-31`, `2026-10-31T17:30:00Z` → `2026-11-01`) — no new function (point-barber) — D-PLT-15 · CG-TIME-02
- [ ] 2.8 Tests first, then `subtractMoney`, `multiplyMoney(amount, quantity)` and `maxMoney` in `packages/shared/src/money` (point-barber) — D-PLT-04 · CG-MONEY-03
- [ ] 2.9 Enable the lint rule `point/no-number-money` for `apps/api`; response and request mappers use `moneyToWire` / `moneyFromWire`; no global BigInt serializer (point-barber) — CG-MONEY-02 · CG-MONEY-03 · API-DATA-02
- [ ] 2.10 Unit tests first, then the receipt-number formatter: `B3-2026-OCT-00001`, `-00125`, six digits, `NOV`, `B3-RF-2026-OCT-00001` (point-barber) — D-PAY-06 · AD-FMT-06
- [ ] 2.11 Unit tests first, then `maskPhone` for receipts on top of the existing `normalizePhone` (`+95977123456` → `09•••••456`) (point-barber) — D-CUS-02 · AD-RCPT-01
- [ ] 2.12 `error.*` keys in `my` and `en` for the codes this change returns and no earlier change added: `out_of_scope`, `unpaid_visit_open`, `day_closed`, `date_in_future`, `payroll_finalized`, `service_required`, `visit_not_completed`, `payments_exist`, `amount_mismatch`, `amount_exceeds_remaining`, `reference_required`, `reference_format`, `duplicate_reference`, `total_changed`, `invalid_transition`, `not_sold_here`, `variant_required`, `service_inactive`, `category_inactive`, `outside_window`, `not_assigned_to_branch`, `phone_invalid`, `reason_required` — English from the AD wording where one exists, Myanmar written here, both reviewed by the owner in the pull request; `pnpm i18n:check` green (point-barber) — API-ERR-01 · API-ERR-02 · Part 4 §11
- [ ] 2.13 Job name constant `receipt.render` and its data type (point-barber) — ADR-002

## 3. API — seams and platform services

- [ ] 3.1 Integration tests first: `DayLock.assertOpen` with no row, an OPEN row, a CLOSED row (422 `day_closed` + context) and a future date (422 `date_in_future`, no lock taken) (point-barber) — P7-RULE-02 · API-IDEM-06
- [ ] 3.2 Implement `DayLock.assertOpen` and the read-only `DayLock.closedDay` in `cash-closing` (point-barber) — P7-RULE-02 · CG-DB-08
- [ ] 3.3 Integration tests first, then `PayrollLock.assertNotFinalized` in `payroll`: run 01 – 31/Oct/2026 in status 3 → 423 on `2026-10-05` and `2026-10-31`, pass on `2026-11-01`; status 2 → pass (point-barber) — P5-RULE-10 · API-IDEM-06
- [ ] 3.4 `StorageService` in `platform` (put, get-stream, head, delete): S3 implementation with a configurable endpoint and the in-memory fake; unit tests of both (point-barber) — ADR-014 · CG-ARCH-08
- [ ] 3.5 MinIO service in `docker-compose.dev.yml` and in CI, bucket values in `.env.example` and the environment schema; one round-trip integration test (point-barber) — ADR-014
- [ ] 3.6 `Attachments.storeGenerated` (rows from storage keys) and `Attachments.findGenerated`, and the lock helper `ReceiptFilesLock` (`receipt:<entity_id>`), with tests (point-barber) — ADR-014 · P4-RULE-18 · CG-DB-08
- [ ] 3.7 Add the mappings `payments_reference_unique` → 409 `duplicate_reference` and the three `client_request_id` indexes → replay to the constraint-error mapper in `common/database`, with tests (point-barber) — CG-DB-12 · API-IDEM-05

## 4. API — services and price quote (`catalog`)

- [ ] 4.1 Tests first (unit + integration): quote resolution — Ko Min Haircut 8,000 (`price_source` 1), Ko Aung 10,000 (2), scheduled price 9,000 from 06/Oct/2026, no row → `sold: false`, HOME without a home row → 8,000 with `price_source` 4 (point-barber) — P2-RULE-03 · P2-RULE-05 · D-SVC-03 · D-SVC-08
- [ ] 4.2 Implement `PriceQuote.quote` and `Eligibility.isEligible` (point-barber) — P2-RULE-05 · P2-RULE-06
- [ ] 4.3 Tests first, then `POST /v1/prices/quote`: `subtotal_amount`, `complete`, read scope, `2026-10-19` → 200, `2026-10-20` → 422 `outside_window`, CLOSED `2026-10-04` → 422 `day_closed`, open `2026-10-04` → 200 (clock injected at 05/Oct/2026) (point-barber) — P2.PRC.06 · P7-RULE-02
- [ ] 4.4 `GET /v1/services?branch_id=&pricing_mode=&category_id=&q=` and `GET /v1/service-categories` (operational reads, cursor page); tests: switched-off service hidden, out-of-scope branch → empty list (point-barber) — P2.SVC.01 · P2.CAT.01 · P2-RULE-01 · API-PERM-03

## 5. API — customers (`booking`)

- [ ] 5.1 Integration tests first: `Customers.matchOrCreate` — existing (name kept), new, name required, INACTIVE reactivated (`customer_reactivated`), archived restored (`customer_restored`), two transactions with one new phone → one row (point-barber) — P3-RULE-01 · D-CUS-02 · D-CUS-03
- [ ] 5.2 Implement `Customers.matchOrCreate` (`INSERT … ON CONFLICT DO NOTHING` + `SELECT … FOR UPDATE`, `Audit.emit` of `customer.create` / `customer.restore` / `customer.reactivate`) (point-barber) — P3-RULE-01
- [ ] 5.3 Tests first, then `GET /v1/customers/lookup`: `09 7712 3456`, `+95977123456`, unknown → null, archived → `{ customer: null, archived: true }`, `phone_invalid`, `upcoming_bookings` = []; `last_visit_at` through the port `CustomerActivityPort` (test double here) (point-barber) — P3.CUS.02 · AD-FORM-10

## 6. API — visits and lines (`delivery`, `sales`)

- [ ] 6.1 Unit tests first: the `SaleTotals.compute` table of design D13 (point-barber) — P4-RULE-06 · D-PLT-04 · CG-TEST-03
- [ ] 6.2 Implement `SaleTotals.compute` (rule function) and its persistence under the sale row lock (point-barber) — P4-RULE-06 · API-DATA-02
- [ ] 6.3 Integration tests first for the line service on builder-made visits: price by performer (8,000 / 10,000), snapshot after a price change, `not_sold_here`, `service_inactive`, `not_eligible` warning (point-barber) — P4-RULE-04 · P4-RULE-05 · D-SVC-04
- [ ] 6.4 Implement `Sales.createOpenForVisit` and `Sales.addServiceLines` (quote on the visit's business date, snapshot, eligibility warning, totals) (point-barber) — P4-RULE-04 · P4-RULE-05
- [ ] 6.5 Integration tests first for START: 201 values, first-service item, `out_of_scope` (Ko Htet), `not_assigned_to_branch`, `unpaid_visit_open` (two STARTED allowed; blocked by a builder-made COMPLETED visit with an OPEN sale; Ko Min not blocked), `day_closed` (point-barber) — P4.VIS.03 · P4-RULE-02 · D-VIS-07
- [ ] 6.6 Integration tests first for START idempotency through `Idempotency.run`: first request held by a latch → 409 `idempotency_in_progress`; replay → 200 + `Idempotent-Replayed`; other branch → 422 `idempotency_mismatch`; missing key → 400 (point-barber) — API-IDEM-01 · API-IDEM-02 · P4-RULE-22
- [ ] 6.7 Implement START in `delivery` (`TransactionRunner.run`, `@Idempotent()`, `find` / `same` / `create` of design D7, day lock, performer checks, unpaid block, visit + OPEN sale with the same `client_request_id`, `items[]` through `Sales.addServiceLines`) (point-barber) — P4.VIS.03 · P4-RULE-02 · CG-DB-03
- [ ] 6.8 Permission tests first for the visit and line endpoints: Ko Min (403 + `context.required`), Ko Htet (404 / 403), Ko Zaw (403), Ma Hnin (200) on read, line add, COMPLETE, INCOMPLETE (point-barber) — P4-RULE-03 · API-PERM-02 · CG-TEST-05
- [ ] 6.9 Register the resolvers `visit.lineActors`, `visit.incompleteActors`, `sale.checkoutActors`, `sale.readers` in `OrSelfResolvers`, declare the decorators of design D2, and wire the port `VisitsPort` (`sales` declares, `delivery` implements) (point-barber) — P4-RULE-03 · API-PERM-02 · ADR-001
- [ ] 6.10 `GET /v1/me/visits` (`status`, `date`; default = open visits + today's finished and incomplete) with the `Visit` mapper (point-barber) — P4.VIS.02
- [ ] 6.11 `GET /v1/visits/{id}` and `GET /v1/sales/{id}` with the `Sale` mapper (lines, payments, totals, `refunds`, `commission_estimate` = null) (point-barber) — P4.VIS.04 · P4.SAL.02
- [ ] 6.12 Tests first, then `Sale.actions` from state and the caller's rights (performer, code holder with `finish_needs_reason`, colleague without a code) (point-barber) — AD-PERM-02 · P4-RULE-03
- [ ] 6.13 Integration tests first for the line endpoints: client price ignored, remove with / without reason, reason of 1,000 and 1,001 characters, row kept and total recomputed, `service_required`, `added_reason` after COMPLETE (point-barber) — P4.SAL.04 · P4.SAL.06 · D-VIS-05
- [ ] 6.14 Implement `POST /v1/sales/{id}/items` (sale lock, state check, `added_reason` rule, `Sales.addServiceLines`) (point-barber) — P4.SAL.04 · D-SVC-04
- [ ] 6.15 Implement `POST /v1/sales/{id}/items/{item_id}/remove` (reason, row kept, totals) (point-barber) — P4.SAL.06 · D-DAT-05
- [ ] 6.16 Tests first, then `POST /v1/visits/{id}/complete` (`service_required`, removed-only line, repeat → 200 unchanged, final states → 409) (point-barber) — P4.VIS.05 · P4-RULE-11
- [ ] 6.17 Tests first, then `POST /v1/visits/{id}/incomplete` (`reason_required`, sale CANCELLED, no number, no day lock on a closed day, repeat → 200, FINISHED visit → 409 with `context.status` = 3, START unblocked afterwards) (point-barber) — P4.VIS.06 · P4-RULE-11 · D-VIS-09
- [ ] 6.18 `GET /v1/me/requests/{client_request_id}` for visits with tests (found, 404, another user's key) (point-barber) — P4.REQ.01 · AD-NET-02
- [ ] 6.19 Audit tests first, then `@Audited()` + `Audit.emit` for `visit.start`, `visit.complete`, `visit.incomplete`, `sale.item_add`, `sale.item_remove` and `Audit.skip()` on a replayed START and an unchanged COMPLETE / INCOMPLETE (one app row per action, none for the repeat; trigger rows on `sales`, `sale_items`) (point-barber) — API-AUD-01 · P4-RULE-21 · D-AUD-01

## 7. API — payments (`sales`)

- [ ] 7.1 `GET /v1/payment-methods` (ACTIVE, `sort_order`) with tests (point-barber) — P4.PMT.01 · P4-RULE-19
- [ ] 7.2 Integration tests first for payment add: full cash, split 5,000 + 6,000, `amount` 0, cash cap at 8,000 / 8,001, `reference_required`, `reference_format`, no pattern set, trim, non-actor 403, `day_closed` (point-barber) — P4.PAY.02 · P4-RULE-09 · CG-TEST-03
- [ ] 7.3 Implement `POST /v1/sales/{id}/payments` in the lock order of design D4 (day lock → sale → payments → `PaymentReferenceLock`) (point-barber) — P4.PAY.02 · P4-RULE-09 · API-IDEM-06
- [ ] 7.4 Tests first, then the collector rule: default = performer, a B3 colleague accepted, Ko Htet → 422 `not_assigned_to_branch` (point-barber) — D-VIS-06 · P4-RULE-09
- [ ] 7.5 Tests first, then the reference uniqueness: `duplicate_reference` with the receipt number of a FINISHED holder and null for an OPEN holder; two simultaneous payments with `KBZ0001234569`; a voided payment frees the reference (point-barber) — D-PAY-02 · API-IDEM-05
- [ ] 7.6 Payment idempotency tests and the `find` / `same` / `create` of design D7 (first request held → 409, double tap, lost reply, amount mismatch, missing key) (point-barber) — API-IDEM-02 · P4-RULE-22
- [ ] 7.7 Tests first, then `POST /v1/payments/{id}/void` (reason, 1,000 / 1,001 characters, row kept, totals, OPEN only, `day_closed`) (point-barber) — P4.PAY.03 · D-DAT-05
- [ ] 7.8 Tests for the payment cases of earlier endpoints: INCOMPLETE with a non-voided payment → 422 `payments_exist`, void then INCOMPLETE → 200, request lookup of a payment key → `payment` (point-barber) — P4-RULE-11 · P4.REQ.01
- [ ] 7.9 Audit tests first, then `@Audited()` + `Audit.emit` for `payment.add` and `payment.void`, `Audit.skip()` on a replayed payment (point-barber) — API-AUD-01 · P4-RULE-21

## 8. API — FINISH (`sales`)

- [ ] 8.1 Integration tests first: happy path (`B3-2026-OCT-00001`, visit 3 FINISHED), `visit_not_completed`, `amount_mismatch` (underpaid 6,000; cash excess 3,000), excess equal to the non-cash sum (Cash 8,000 + KBZPay 2,000 on 8,000 → 200), `total_changed`, missing `expected_total_amount`, START unblocked after FINISH (point-barber) — P4.SAL.10 · P4-RULE-10 · D-VIS-07
- [ ] 8.2 Date-boundary tests first with the injected clock: `2026-10-31T23:59:00+06:30` → `B3-2026-OCT-00125`, `2026-11-01T00:00:00+06:30` → `B3-2026-NOV-00001`, visit crossing midnight (visit date 05, sale date 06) (point-barber) — D-PLT-15 · D-PAY-06 · CG-TIME-03
- [ ] 8.3 Tests first, then `ReceiptNumbers.next` (the upsert of design D6, kinds 1 and 2, branches independent) (point-barber) — D-PAY-06 · P4-RULE-18 · API-IDEM-05
- [ ] 8.4 `SET LOCAL lock_timeout` with a savepoint and one retry on `55P03` inside `ReceiptNumbers.next`; tests with the counter row held by another connection (6 s → success after one retry; 12 s → 500, no number lost) (point-barber) — system design §3.5 · CG-IDEM-05
- [ ] 8.5 Implement FINISH steps 1 – 7 (read, day lock, payroll lock, sale lock, visit lock through `VisitsPort`, actor, visit state) (point-barber) — P4-RULE-10 · API-IDEM-06
- [ ] 8.6 Implement FINISH steps 10 – 14 (customer, totals + `total_changed`, payments + money check, number, status updates in guard-safe order) (point-barber) — P4-RULE-10 · P3-RULE-01
- [ ] 8.7 Tests first, then step 15: KBZPay 10,000 on 8,000 → refund kind 2 CASH 2,000 `B3-RF-2026-OCT-00001` with a server UUIDv7; split with change 4,000; exact payment → no row (point-barber) — P4-RULE-10 · P4-RULE-14 · D-PAY-05
- [ ] 8.8 Step 17: `Jobs.send(tx, 'receipt.render', …)` for the sale and the change refund and `Audit.emit` of `sale.finish`, all before commit; test that a refused FINISH leaves no job and no audit row (point-barber) — ADR-002 · P4-RULE-21
- [ ] 8.9 Idempotent-by-state tests: FINISH twice, repeat after the day was closed, CANCELLED → 409; no second number, refund, job or `sale.finish` audit row (point-barber) — API-IDEM-01 · P4-RULE-22
- [ ] 8.10 Concurrency tests of design D6 (a) – (d): 20 sales at once → {1 … 20}; one sale twice at once; fault after the counter step → no gap; RF series under concurrency (point-barber) — D-PAY-06 · API-IDEM-05 · CG-IDEM-05
- [ ] 8.11 Immutability tests first, then the state checks: on a FINISHED sale line add → `difference_sale`, line removal and void → `refund`, payment add → no `correction_path`; on a CANCELLED sale the four writes → 409 with `context.status` = 0 and no `correction_path` (point-barber) — P4-RULE-01 · API-PERM-05 · D-VIS-08
- [ ] 8.12 Raw-SQL tests of the second wall exactly as the requirement lists it (sale UPDATE except `customer_id` / `updated_at`; line INSERT / UPDATE / DELETE on a FINISHED and on a CANCELLED sale; payment UPDATE / DELETE on a FINISHED sale; visit UPDATE) → `P0001`; mapping `P0001` → 423 `locked` (point-barber) — P4-RULE-01 · CG-DB-12
- [ ] 8.13 Gate tests on FINISH: `day_closed`, `payroll_finalized` (05/Oct, 31/Oct), pass on 01/Nov and with a CALCULATED run (point-barber) — P7-RULE-02 · P5-RULE-10
- [ ] 8.14 Override path tests and handler rule: a `sale.finish_override` holder without `override_reason` → 400 `reason_required`; with it → 200, `finished_by` = the holder, the reason in the audit row (point-barber) — P4-RULE-03 · P4-RULE-10 · D-VIS-06
- [ ] 8.15 Soak test: 50 mixed payment / FINISH / INCOMPLETE calls on 10 sales complete without a deadlock (SQLSTATE `40P01`) (point-barber) — API-IDEM-06 · CG-IDEM-05
- [ ] 8.16 `sales` implements `CustomerActivityPort.lastVisitAt`; integration tests of the lookup: `last_visit_at` after a FINISHED sale, null for a caller whose read scope lacks that branch (point-barber) — P3.CUS.02 · ADR-001

## 9. API — receipt pipeline (`platform`, `sales`, `packages/documents`)

- [ ] 9.1 `packages/documents`: fonts Pyidaungsu and Inter with their licence files; base CSS for 58 mm (384 px) and 80 mm (576 px) with body text ≥ 22 px at 384 px (point-barber) — ADR-013 · AD-RCPT-02
- [ ] 9.2 Receipt template with the content order of AD-RCPT-01 (React → static HTML, values escaped) and the `receipt.*` label keys; HTML snapshot tests (split payment, change returned, customer, no customer, no thank-you value) (point-barber) — AD-RCPT-01 · D-PAY-06 · OPEN-32
- [ ] 9.3 Refund-receipt template (title "Refund", RF number, original number, method, amount, no item lines for a change return); snapshot test (point-barber) — AD-RCPT-01 · P4-RULE-18
- [ ] 9.4 Tests first, then the opening-hours line builder (`Mon–Sun 9:00 AM – 9:00 PM`; split runs; "Closed"; no rows → no line) (point-barber) — AD-RCPT-01 · design D10
- [ ] 9.5 `DocumentRenderer` launch and sandbox: Chromium headless, JavaScript off, every network request blocked, non-root, local fonts, `document.fonts.ready`; plus the in-memory fake (point-barber) — ADR-013 · CG-ARCH-08
- [ ] 9.6 `DocumentRenderer` queue: one page at a time, interactive renders ahead of background ones, 10 s timeout, restart after a crash, recycle after 200 renders; tests for order, timeout and restart (point-barber) — ADR-013
- [ ] 9.7 `renderPdf` (page width = paper width); test with PDF text extraction that finds the receipt number (point-barber) — ADR-013 · D-PAY-06
- [ ] 9.8 `renderPng`: full-page screenshot at 384 / 576 px, 2-colour palette; golden-image test with a stacked-consonant Myanmar item name (point-barber) — ADR-013 · AD-RCPT-02
- [ ] 9.9 `ReceiptView` builder for a sale and `format=json`: labels, `description_en` fallback, masked phone, payments with reference, `change_returned`, footer, built from current branch data (point-barber) — P4.RCP.01 · AD-RCPT-01
- [ ] 9.10 `ReceiptView` builder for a refund (`kind` = `refund`, `original_number`, no lines) with tests (point-barber) — P4.RCP.02 · AD-RCPT-01
- [ ] 9.11 `ReceiptFiles.ensure`: read → render and put outside any transaction → short transaction with `ReceiptFilesLock`, re-check, insert rows or delete own objects; race test (job vs request) counts one PDF row, one PNG row and two objects (point-barber) — ADR-013 · CG-DB-10 · P4-RULE-18
- [ ] 9.12 `receipt.render` handler registered with `Jobs.register` (concurrency 1, `retryLimit: 2` = 3 attempts); tests: skip when stored, three failed attempts leave the sale finished and log an error (point-barber) — ADR-002 · ADR-013
- [ ] 9.13 `GET /v1/sales/{id}/receipt` (`format`, `width`): stored file stream, on-the-fly `ensure`, other width not stored, 409 for an OPEN sale, read-scope 404; test: byte-identical re-read after the branch address changes (point-barber) — P4.RCP.01 · D-PAY-06
- [ ] 9.14 `GET /v1/refunds/{id}/receipt` with tests (PDF, JSON, Ko Htet → 404) (point-barber) — P4.RCP.02
- [ ] 9.15 API Dockerfile: Chromium and the fonts, non-root user (point-barber) — ADR-013 · ADR-001
- [ ] 9.16 Compose memory limit for the API with headroom; CI builds the image and runs one render smoke test inside it (point-barber) — ADR-013

## 10. Web — Today and START

- [ ] 10.1 Add to the authed layout: `BottomNav` with Today (badge) and the centre ＋ Start, the branch default of AD-NAV-04, and the redirect of the start page to `/today` (point-barber) — AD-NAV-01 · AD-NAV-04 · AD-TODAY-03
- [ ] 10.2 Query and mutation hooks for open visits and START with the fetch policy of design D11 (stale 0, focus / reconnect refetch) and one `Idempotency-Key` per tap kept across retries (point-barber) — AD-PERF-03 · AD-PERF-04 · AD-NET-01
- [ ] 10.3 `/today`: app bar (`Mon, 05/Oct/2026`, branch chip), "In progress" list with `VisitCard` (customer or "Walk-in", services, elapsed, badge, next action), oldest first (point-barber) — AD-TODAY-01 · AD-TODAY-02 · AD-CMP-05
- [ ] 10.4 Today states: skeleton, empty state (`today.empty.title`, `today.empty.body`, ＋ Start), error state with Retry and the 8-character error ID, offline banner; Today tab badge = open visits (point-barber) — AD-STATE-01 · AD-STATE-02 · AD-STATE-03 · AD-STATE-05
- [ ] 10.5 `/visits/new` arrival step with the big button "Walk-in" (point-barber) — AD-POS-02 · AD-CMP-02 · design D12
- [ ] 10.6 Unit tests first, then the chip rule: the first 6 simple services of `GET /v1/services?branch_id=&pricing_mode=1` in catalogue order (3 services → 3 chips; 7 → 6; an option service never) (point-barber) — AD-POS-03 · AD-POS-05 · P2.SVC.01
- [ ] 10.7 `StartSheet`: branch from the chip, performer chip, the first-service chips, Start button with in-flight spinner; fits 360 × 640 px in MM and EN (point-barber) — AD-POS-03 · AD-TODAY-03 · AD-GOAL-05
- [ ] 10.8 START errors: `unpaid_visit_open` message with the link (reads `GET /v1/visits/{visit_id}` → `/sales/<sale id>`), `day_closed` lock banner, `not_assigned_to_branch` (point-barber) — AD-POS-04 · AD-STATE-06 · AD-FORM-04
- [ ] 10.9 `SavedCheck` for START: after 15 s "Checking whether it was saved…", lookup, open the visit on 200, inline alert `pos.saved.notSaved` with Retry (same key) on 404 or network failure (point-barber) — AD-NET-02 · P4.REQ.01
- [ ] 10.10 Static page `/help/offline` (MM + EN, key `pos.help.offline.body`: write the service on paper; it is entered with Late entry; no form, no record button) wired as the `OfflineBanner` help link (point-barber) — AD-STATE-05 · D-VIS-13 · D-PLT-20
- [ ] 10.11 `today.*` and `pos.start.*` keys in `my` and `en` (reviewed by the owner in the pull request); check at 320 and 360 px in both languages (point-barber) — D-PLT-03 · AD-QA-01

## 11. Web — visit in progress

- [ ] 11.1 `/sales/[id]` state router (in progress · checkout · success · cancelled · forbidden) (point-barber) — AD-POS-04 · AD-STATE-04
- [ ] 11.2 `VisitHeader` (sticky): "Walk-in" or customer, performer chip, branch, start time + elapsed; shown on the visit screen and every checkout step (point-barber) — AD-POS-04 · AD-POS-06 · AD-GOAL-02
- [ ] 11.3 `SaleLines`: name, price, duration, performer chip; removed lines struck through; remove through `ReasonDialog` (point-barber) — AD-POS-04 · AD-RSN-01 · D-VIS-05
- [ ] 11.4 `ServicePicker` bottom sheet: search and categories (no "Frequent here" section), rows with duration and the quote price for this branch, performer and the visit's business date (point-barber) — AD-POS-05 · P2.SVC.01 · P2.PRC.06
- [ ] 11.5 Add service: in-flight disable, `warnings[] not_eligible` note, "Why was this added?" (`added_reason`) when the visit is COMPLETED, message for `not_sold_here` (point-barber) — AD-POS-04 · P4.SAL.04
- [ ] 11.6 Primary action "Service done · Take payment" (COMPLETE then checkout; `service_required` message) and kebab "Mark incomplete" with `ReasonDialog` (`payments_exist` message) (point-barber) — AD-POS-04 · AD-LAY-04 · D-VIS-09
- [ ] 11.7 Controls follow `Sale.actions` (`edit_lines`, `mark_incomplete`); read-only view of a cancelled sale; component tests for performer, code holder and no rights (point-barber) — AD-PERM-02 · AD-DET-03
- [ ] 11.8 `pos.visit.*` keys in `my` and `en`; 320 / 360 px check (point-barber) — D-PLT-03 · AD-QA-01

## 12. Web — checkout and payment

- [ ] 12.1 Checkout layout: progress line "Services ✓ → Payment → Finish", Items section (`SaleLines`), Total in `text-3xl` with the "How is this calculated?" breakdown (point-barber) — AD-POS-07 · AD-HELP-02 · AD-FMT-01
- [ ] 12.2 `PaymentButtons` in the order Cash, KBZPay, Split, then other active methods (≥ 72 px); Cash records `remaining_amount` at once, button disabled in flight (point-barber) — AD-POS-08 · AD-CMP-02 · AD-GOAL-01
- [ ] 12.3 KBZPay reference sheet: amount preset to the remaining amount, reference field with the format helper text, submit disabled in flight (point-barber) — AD-POS-08 · AD-FORM-12
- [ ] 12.4 Split sheet (`PaymentSheet`): method choice, editable amount (`MoneyInput`), reference when required, "Customer gave" for a cash amount (point-barber) — AD-POS-08 · AD-FORM-11
- [ ] 12.5 `PaymentList`: method, amount, reference, collector chip; the optional "Customer gave" field on a cash line showing the change (not sent); voided payments struck through; "Void payment" through `ReasonDialog` (point-barber) — AD-POS-08 · AD-CMP-05 · AD-CMP-09 · AD-CONF-01
- [ ] 12.6 "Remaining to pay" line with `aria-live`; "Change to return" only when the excess is covered by non-cash payments; unit tests of the two display rules (point-barber) — AD-POS-08 · AD-A11Y-04
- [ ] 12.7 Field and inline errors for `reference_required`, `reference_format`, `duplicate_reference` (with a receipt number; `pos.checkout.referenceInUse` without one), `amount_exceeds_remaining`, `day_closed` (point-barber) — AD-FORM-04 · AD-FORM-12
- [ ] 12.8 `SavedCheck` for payments (same key on Retry; "Already saved" on replay) (point-barber) — AD-NET-01 · AD-NET-02
- [ ] 12.9 `pos.checkout.*` keys in `my` and `en`; 320 / 360 px check (point-barber) — D-PLT-03 · AD-QA-01

## 13. Web — Finish and success

- [ ] 13.1 `FinishStep`: phone field open and optional (`PhoneInput`, Myanmar digits accepted), lookup → "Existing customer: <name> · last visit <date>" or "New customer" + required Name, "Skip" collapses the field (point-barber) — AD-POS-12 · AD-FORM-10 · P3.CUS.02
- [ ] 13.2 Finish button `Finish · <total>` in the sticky bottom bar; disabled with the reason while money is missing or a cash excess exists; sends `expected_total_amount` and `customer` (point-barber) — AD-POS-12 · AD-POS-08 · AD-GOAL-03
- [ ] 13.3 Override step: where `actions.finish_needs_reason` is true, Finish opens `ReasonDialog` and sends `override_reason` (point-barber) — D-VIS-06 · AD-RSN-02 · AD-PERM-02
- [ ] 13.4 FINISH errors: `total_changed` (reload + new total), `amount_mismatch`, `day_closed`, `payroll_finalized`, `validation` on `customer.name`, `phone_invalid` (point-barber) — AD-FORM-04 · AD-STATE-06
- [ ] 13.5 `SuccessPanel`: check mark, receipt number, total, payments, performer chip, flag "Change returned" with the RF number, primary "Next customer" → Today, no auto-redirect (point-barber) — AD-POS-12 · AD-CMP-06
- [ ] 13.6 "View / share PDF": fetch the PDF as a blob, Web Share when files can be shared, otherwise open in a new tab; no Print button (point-barber) — AD-POS-13 · AD-RCPT-02 · AD-PWA-02
- [ ] 13.7 Finished sale reopened by link: lock banner, the on-screen receipt (`ReceiptRenderer` fed by `format=json`), "View / share PDF" (point-barber) — AD-DET-03 · AD-RCPT-01
- [ ] 13.8 `pos.finish.*` keys in `my` and `en`; axe clean on Today, START, visit, checkout and success (point-barber) — D-PLT-03 · AD-QA-01 · AD-A11Y-01

## 14. End-to-end (Playwright)

- [ ] 14.1 Test base: database reset + fixture seed per test file; helper that reads `system.server_time` from `GET /v1/me` and builds the expected `B3-<YYYY>-<MMM>-00001` / `B3-RF-<YYYY>-<MMM>-00001` (no clock override in the running stack) (point-barber) — AD-QA-03 · CG-TEST-09 · CG-TIME-03
- [ ] 14.2 Login helper through the Mailpit OTP for Ko Aung, Ko Min and Ma Hnin; projects 360 × 800 MM, 360 × 800 EN and 1280 × 800 EN (point-barber) — spec-fixtures §7 · CG-TEST-06
- [ ] 14.3 Flow "walk-in cash": Ko Aung, Haircut 10,000, tap counter ≤ 7, expected receipt number shown, PDF response 200 `application/pdf` — MM + EN at 360 × 800, EN at 1280 × 800 (point-barber) — AD-QA-03 · AD-GOAL-01
- [ ] 14.4 Flow "split Cash + KBZPay": Ko Min, 11,000 = Cash 5,000 + KBZPay 6,000 (`KBZ0001234567`), remaining line 6,000 → 0 (point-barber) — AD-QA-03 · D-PAY-01
- [ ] 14.5 Flow "over-transfer": KBZPay 10,000 on 8,000 → "Change to return: 2,000 Ks" → success screen with the expected RF number (point-barber) — AD-QA-03 · D-PAY-05
- [ ] 14.6 Negative flows: unpaid-visit block message and link, mark incomplete, void and re-pay, duplicate-reference message (point-barber) — D-VIS-07 · D-VIS-09 · D-PAY-02
- [ ] 14.7 Double tap on Start and on Cash creates one row; lost reply (route interception) shows "Checking whether it was saved…" and ends with one record (point-barber) — D-VIS-10 · AD-NET-01 · AD-NET-02
- [ ] 14.8 Finish with Ma Su's phone (existing) and with Ko Phyo (new, name required); Ko Min cannot open Ko Aung's sale (point-barber) — D-CUS-03 · P4-RULE-03
- [ ] 14.9 The START sheet at 360 × 640 px in MM and EN: branch, performer, chips and Start visible without scrolling (point-barber) — AD-GOAL-05 · AD-POS-01

## 15. Verification

- [ ] 15.1 Lint, typecheck, unit, integration and e2e green in CI on each of the three pull requests; Dev 1 reviews; pull requests A and B are squash-merged on that (point-barber) — AD-QA-01 · CG-GIT-05
- [ ] 15.2 Definition-of-done pass for the five screens: MM and EN at 320, 360, 768 and 1280 px; states; controls from `Sale.actions`; formats; reasons (point-barber) — AD-QA-01 · AD-QA-02
- [ ] 15.3 On pull request C: run `/point-generate-tests add-walkin-visit-checkout`, execute the workbook on that branch's environment and fix every NG before its squash merge (point-sdd) — D-PLT-17 · D-PLT-20 · CG-GIT-05
- [ ] 15.4 Archive the change after the pull requests are merged and the workbook has no open NG (point-sdd) — D-PLT-17
