# Design — add-walkin-visit-checkout

## Context

First vertical slice (D-PLT-18): **Today → START → COMPLETE → checkout (cash / KBZPay / split) → FINISH →
receipt PDF** for a walk-in at the branch, on the barber's own phone (D-VIS-11, D-AUTH-07). It is the money
path, so the binding texts are API Part 4 P4-RULE-01 … 22, Part 0 API-IDEM-01 … 06, DB Part 4 v1.2,
`docs/ux/admin-panel.md` §10.1 – §10.5 and the coding guideline of point-barber (CG-…). Nothing here
re-decides them; this file only fixes what they leave to the implementer and names every table, endpoint,
component, service interface and lock.

Already available from the three changes this one depends on:

- `add-repo-scaffold` — repository, CI, Docker Compose, the **baseline migration with all 91 locked tables**
  (so this change adds no migration), `pnpm db:test` (the DB test files, incl. the 83 Part 4 cases), the
  committed Prisma schema, `TransactionRunner.run`, the problem-details filter, the constraint-error mapper,
  `docs/engineering/module-map.md` with the 13 module folders.
- `add-shared-ui-components` — tokens, the formatters, `businessDateOf` / `todayMmt`, the `Mmk` money module
  of `packages/shared` (`moneyFromWire`, `moneyToWire`, `sumMoney`), `normalizePhone`, the status map, the
  language files (`packages/i18n`, namespaces `common`, `status`, `error`, `reason`), the lint rule
  `point/no-number-money` for `apps/web` and `packages/*`, and the shared components of AD-IMPL-02.
- `add-foundation-auth-access` — login, session, `GET /v1/me`; the guards `@Can` / `@CanView` / `@Staff` /
  `@Self` with the `BranchResolvers` and `OrSelfResolvers` registries; the service-level transaction
  (`TransactionRunner.run`, READ COMMITTED, request context, audit rows written just before commit);
  `@Audited({ actions })` with `Audit.emit` / `Audit.skip`; `@Idempotent()` and `Idempotency.run`; the
  `JobsModule` on pg-boss (`Jobs.send(tx, …)`, `Jobs.register`); `SettingsReader` (defaults:
  `receipt.printer_width_mm` 58, `booking.advance_window_days` 14, `sales.tax_enabled` /
  `sales.service_charge_enabled` false); `PeopleDirectory`; the base seed (company row, permission catalogue,
  seed roles); the development fixture modules `010` … `040` with `FIXTURE_IDS`; `AppShell` mounted in the
  authed layout with the branch chip and the user menu.

Brought by this change in their minimal form: the `receipt.render` job, document rendering, file storage for
generated files, the price quote, customer match-or-create, and the two lock services owned by parts that
have no change yet (`DayLock` — Part 7, `PayrollLock` — Part 5).

## Goals / Non-Goals

**Goals**

- A barber finishes a one-service cash walk-in in ≤ 7 taps (AD-GOAL-01) with every money rule of Part 4 that
  the path touches enforced by the API and, where the DB has a wall, by the DB.
- The FINISH transaction is the final one: later changes add steps (discount, booking, stock) into the
  numbered slots left open here; they do not reorder locks.
- No interim behaviour that contradicts a locked contract: a deferred feature is absent (listed in
  `proposal.md`) or built as locked.

**Non-Goals** — the list in `proposal.md`. Two technical ones: no realtime event is emitted (the emissions of
Part 4 §10 arrive with `add-realtime-gateway`, together with their consumers), and no upload API (only
generated files are stored). The pilot needs `add-staging-deploy`, `add-late-entry` and `add-pilot-data-seed`
in addition to this change (D14).

## Decisions

### D1 · Module map and service interfaces (ADR-001 rule 1, CG-ARCH-01, CG-NAME-04)

Only the bounded contexts fixed in `docs/engineering/module-map.md` are used; this change creates the folders
`delivery`, `sales`, `catalog`, `booking`, `cash-closing` and `payroll` (each is created by the change that
first needs it) and adds to `platform`. A module writes only its own tables; cross-module work goes through
the interfaces below, called inside the caller's transaction (`tx`) when it must commit together.

| Module (`apps/api/src/modules/…`) | Owns (tables) | Endpoints in this change | Public surface added here |
| --- | --- | --- | --- |
| `delivery` | `visits` | P4.VIS.02 · P4.VIS.03 · P4.VIS.04 · P4.VIS.05 · P4.VIS.06 · P4.REQ.01 | implements the port `VisitsPort` of `sales` · registers the resolvers `visit.lineActors`, `visit.incompleteActors` |
| `sales` | `sales`, `sale_items`, `receipt_counters`, `payment_methods`, `payments`, `refunds` | P4.SAL.02 · P4.SAL.04 · P4.SAL.06 · P4.SAL.10 · P4.PAY.02 · P4.PAY.03 · P4.PMT.01 · P4.RCP.01 · P4.RCP.02 | `Sales.createOpenForVisit(tx, visit, key)` · `Sales.lockForUpdate(tx, sale_id)` · `Sales.cancelForVisit(tx, sale_id, at)` · `Sales.addServiceLines(tx, sale, visit, items, actor)` · `Sales.hasActiveServiceLine(tx, sale_id)` · `Payments.findByClientRequestId(user_id, key)` · the port `VisitsPort { lockForUpdate(tx, visit_id), markFinished(tx, visit_id, finished_at) }` · `PaymentMethodSeed.ensure(tx)` (base seed) · the resolvers `sale.checkoutActors`, `sale.readers` · the lock helper `PaymentReferenceLock` (key `payref:`) |
| `catalog` | — (reads `services`, `service_categories`, `branch_services`, `service_prices`, `employee_service_eligibilities`) | P2.CAT.01 · P2.SVC.01 · P2.PRC.06 | `PriceQuote.quote(db, { branch_id, location_type, date, employee_id?, items })` (P2-RULE-05) · `Eligibility.isEligible(db, { employee_id, branch_id, service_id, date })` (P2-RULE-06) |
| `booking` | `customers` | P3.CUS.02 | `Customers.matchOrCreate(tx, { phone, name?, actor_user_id })` → `{ customer, warnings[] }` (P3-RULE-01) · `Customers.lookup(phone, readScope)` |
| `cash-closing` | — (reads `daily_closings`) | — | `DayLock.assertOpen(tx, branch_id, business_date)` (P7-RULE-02, key `day:`) · `DayLock.closedDay(db, branch_id, business_date)` (read only, no lock — for the quote) |
| `payroll` | — (reads `payroll_runs`) | — | `PayrollLock.assertNotFinalized(tx, { employee_ids?, dates })` (P5-RULE-10, key `payroll:`) |
| `platform` | `attachments` (generated rows), `pgboss` schema (exists) | — | queue `receipt.render` via `Jobs.register` · `DocumentRenderer.renderPdf(template, data, page)` / `renderPng(template, data, widthPx)` (ADR-013) · `StorageService.put / getStream / head / delete` (ADR-014) · `Attachments.storeGenerated(tx, { entity_type, entity_id, kind, file_name, mime_type, size_bytes, storage_key, uploaded_by_user_id })` · `Attachments.findGenerated(entity_type, entity_id)` · the lock helper `ReceiptFilesLock` (key `receipt:`) |

- **One direction between `delivery` and `sales`.** `delivery` imports `sales` (START creates the sale;
  COMPLETE and INCOMPLETE lock and change it). FINISH lives in `sales` and must lock and finish the visit; it
  does so through the port `VisitsPort`, which `sales` declares and `delivery` implements — the same pattern as
  the foundation's `GrantSource` port — so there is no import cycle.
- **One direction between `sales` and `booking`.** FINISH (`sales`) calls `Customers.matchOrCreate`
  (`booking`). The lookup's `last_visit_at` needs finished visits, which `sales` owns, so `booking` declares the
  port `CustomerActivityPort { lastVisitAt(customer_id, branch_ids) }` and `sales` implements it.
- **`DayLock.assertOpen`** — as P7-RULE-02: a `business_date` in the future → 422 `date_in_future` before any
  lock; then `pg_advisory_xact_lock_shared(hashtextextended('day:' || branch_id || ':' || business_date, 0))`;
  then `SELECT status, closed_at, closed_by_user_id FROM daily_closings WHERE (branch_id, business_date) = …`;
  status 2 → 422 `day_closed` with the Part 7 context. `lockExclusive`, close and reopen come with
  `add-daily-closing`. The table is empty until then.
- **`PayrollLock.assertNotFinalized`** — as P5-RULE-10: `pg_advisory_xact_lock_shared(
  hashtextextended('payroll:' || company_id, 0))`, then a read of `payroll_runs` with status 3 / 4 / 5 whose
  period contains a date → 423 `payroll_finalized`. Finalize / reopen come with the payroll changes.
- **Not declared here:** `StockLedger.post`, `Commission.estimate`, `Notifications.emit`,
  `Attendance.openRecordsAt` — each is declared by the change that implements and calls it, at the FINISH step
  number reserved in D5.
- **Advisory locks** are transaction-scoped and taken only through the named helpers above (CG-DB-08); their
  key prefixes (`day:`, `payroll:`, `payref:`, `receipt:`; `idem:` exists) and the table ownership of this
  change are written into `docs/engineering/module-map.md` (task 1.2).

### D2 · Endpoints and guards (API-PERM-02 — one decorator each)

| ID | Method · path | Module | Decorator |
| --- | --- | --- | --- |
| P4.VIS.02 | `GET /v1/me/visits` | `delivery` | `@Self()` |
| P4.VIS.03 | `POST /v1/visits` | `delivery` | `@Staff()` + read-scope check on `body.branch_id` (403 `out_of_scope`) |
| P4.VIS.04 | `GET /v1/visits/{id}` | `delivery` | `visit.view⁺` on `params.id→entity.branch_id` (management read), or self through `sale.readers` |
| P4.VIS.05 | `POST /v1/visits/{id}/complete` | `delivery` | `@Can('visit.update', { branch: 'params.id→entity.branch_id', orSelf: 'visit.lineActors' })` |
| P4.VIS.06 | `POST /v1/visits/{id}/incomplete` | `delivery` | `@Can('visit.delete', { branch: …, orSelf: 'visit.incompleteActors' })` |
| P4.REQ.01 | `GET /v1/me/requests/{client_request_id}` | `delivery` | `@Self()` |
| P4.SAL.02 | `GET /v1/sales/{id}` | `sales` | `sale.view⁺` on the sale's branch (management read), or self through `sale.readers` |
| P4.SAL.04 / 06 | `POST /v1/sales/{id}/items` · `…/items/{item_id}/remove` | `sales` | `@Can('visit.update', { branch: …, orSelf: 'visit.lineActors' })` |
| P4.SAL.10 | `POST /v1/sales/{id}/finish` | `sales` | `@Can('sale.finish_override', { branch: …, orSelf: 'sale.checkoutActors' })` |
| P4.PAY.02 / 03 | `POST /v1/sales/{id}/payments` · `POST /v1/payments/{id}/void` | `sales` | `@Can('sale.finish_override', { branch: …, orSelf: 'sale.checkoutActors' })` |
| P4.PMT.01 | `GET /v1/payment-methods` | `sales` | `@Staff()` |
| P4.RCP.01 / 02 | `GET /v1/sales/{id}/receipt` · `GET /v1/refunds/{id}/receipt` | `sales` | `@Staff()` — branch in read scope, else 404 |
| P2.CAT.01 / P2.SVC.01 / P2.PRC.06 | `GET /v1/service-categories` · `GET /v1/services` · `POST /v1/prices/quote` | `catalog` | `@Staff()` |
| P3.CUS.02 | `GET /v1/customers/lookup` | `booking` | `@Staff()` |

- The four resolvers are the ones P4-RULE-03 names; `sale.readers` (performer of a line, recorder, finisher)
  serves the read of a visit and of its sale. In this change the actor sets reduce to the performer and, after
  a FINISH by a code holder, that finisher — proxy recording is out.
- The guards are the locked ones, so a holder of `visit.update`, `visit.delete` or `sale.finish_override`
  covering the branch passes. FINISH by a caller who is not a checkout actor needs `override_reason` (400
  `reason_required` — P4-RULE-10 #6), stored in the `sale.finish` audit row.
- `Sale.actions` (AD-PERM-02) is computed from the sale's state and the caller's rights (self set or code):
  `edit_lines`, `take_payment`, `finish`, `finish_needs_reason`, `mark_incomplete`. The flags of absent
  features (`override_price`, `request_discount`, `refund`, `adjust`) are `false`. The screens render a
  control only where its flag is true; with `finish_needs_reason` the Finish step opens the reason dialog
  first. A code holder reaches a sale only by its link in this change — the visits list is
  `add-visit-manager-override`.

### D3 · Tables, base seed, fixture seed

No DB design change (`docs/db` untouched) and **no migration**: the scaffold's baseline already holds every
table, CHECK, index and trigger used here. Tables written: `visits`, `sales`, `sale_items`, `payments`,
`receipt_counters`, `refunds` (kind 2 only), `customers`, `attachments`, `audit_events` (through the runner
and the `audit_sales` / `audit_sale_items` / `audit_payments` / `audit_refunds` triggers), `payment_methods`
(base seed only), `pgboss.*`. Tables read: `branches`, `employees`, `employee_branches`, `services`,
`service_categories`, `branch_services`, `service_prices`, `employee_service_eligibilities`,
`daily_closings`, `payroll_runs`, `branch_opening_hours`. Task 1.1 asserts that these tables and the guard
and audit triggers exist in a freshly migrated database.

**Base seed — every environment** (Part 4 §8 "Seed (go-live, D-PAY-01)", P4-RULE-19 system rows). `PaymentMethodSeed.ensure(tx)` is called by the foundation's base seed after `SeedRoles.ensure`: for
the company, insert `CASH` (kind 1, `is_cash` true, "ငွေသား" / "Cash", `sort_order` 1) and `KBZPAY` (kind 2,
`requires_reference` true, `requires_verification` true, "KBZPay", `sort_order` 2, `reference_regex` NULL)
when no row with that code exists; an existing row is never changed. Without these rows checkout would have
no button and FINISH step 15 no CASH method for the change return. The owner's real KBZPay pattern is written
to `payment_methods.reference_regex` by the operator script of `add-pilot-data-seed` for the pilot, and later
through the screen of `add-payment-methods-admin`.

**Seed-role sets.** The `SeedRoles` definitions of Manager and Barber gain their Part 4 codes (Part 4 §9:
Manager — `visit.view` / `update` / `delete`, `sale.view` / `create` / `delete`, `sale.finish_override`,
`sale.override_price`, `sale.late_entry`, `payment.view`, `payment.verify`, `discount.view`,
`discount.approve`; Barber — `sale.late_entry`, `sale.create`). That takes effect where `SeedRoles.ensure`
still creates the roles (an environment with no role yet); an environment whose roles exist is changed only
through the role screen of `add-role-permission-matrix` (roles are grant-only and admin-edited). The 22
Part 4 codes go into `packages/shared/definitions/permissions.json` with level and kind; the catalogue sync
adds them to the company-admin roles.

**Fixture seed — development and test only** (appended to `db/seed/fixtures/`, fixed ids in `FIXTURE_IDS`):
`050-kbzpay-pattern` (sets `reference_regex` = `^KBZ[0-9]{10}$` on KBZPAY), `060-customers` (Ma Su,
`09 7712 3456` → `+95977123456`), `070-eligibility` (every fixture barber × Haircut / Shave / Hair wash at
their branch from `2026-09-01`), `080-opening-hours` (9:00 AM – 9:00 PM every day, B1 – B3),
`090-part4-grants` (the codes above on the fixture Manager and Barber roles).

Settings: nothing is added to a file. `receipt.printer_width_mm` and `booking.advance_window_days` are read
through `SettingsReader`. `receipt.thank_you_text` has no default in any locked source; the reader has no
value for it and the receipt prints no thank-you line until `add-settings-store`.

### D4 · Transactions, isolation and lock order (API-IDEM-06, CG-DB-03, CG-DB-06, CG-DB-07)

One business action = one transaction, opened **by the service** with `TransactionRunner.run(async (tx) =>
…)` at READ COMMITTED (as the foundation change does; there is no transaction interceptor). The runner sets
`app.user_id` / `app.session_id` / `app.request_id`. Inside it the service takes its locks first and makes
every check after them. Reads (`GET`) open no transaction. The text order below **is** the lock order: day
lock → payroll lock → sale → visit → (booking) → (discount code) → customer → payments (+ the reference
advisory lock) → receipt counters → (stock levels).

| Write (service method) | Locks, in order | Then |
| --- | --- | --- |
| START (`delivery`) | 1 `DayLock.assertOpen(branch, today)` | performer ACTIVE + assigned · unpaid-block query · insert visit · `Sales.createOpenForVisit` · `Sales.addServiceLines` for `items[]` · totals |
| Add / remove line (`sales`) | 1 sale `FOR UPDATE` | status OPEN (else 409) · visit read · quote on the visit's business date · insert / mark removed · totals |
| COMPLETE (`delivery`) | 1 sale `FOR UPDATE` → 2 visit `FOR UPDATE` | status 1 (2 → 200 unchanged) · ≥ 1 active SERVICE line · update |
| INCOMPLETE (`delivery`) | 1 sale `FOR UPDATE` → 2 visit `FOR UPDATE` → 3 payments `FOR UPDATE` | no non-voided payment · `Sales.cancelForVisit` · visit → 0 |
| Payment add (`sales`) | 1 `DayLock.assertOpen(branch, today)` → 2 sale `FOR UPDATE` → 3 payments `FOR UPDATE` → 4 `PaymentReferenceLock` (`payref:<method_id>:<reference>`) when a reference is sent | status OPEN · method ACTIVE · reference required / format / unique · cash cap · insert · totals |
| Payment void (`sales`) | 1 `DayLock.assertOpen` → 2 sale `FOR UPDATE` → 3 the payment `FOR UPDATE` | status OPEN · set void fields · totals |
| FINISH (`sales`) | D5 | |

A writer that knows only a visit id or a payment id reads the row without a lock to learn the sale id and the
branch, takes the locks in order and re-reads under the lock. The idempotency try-lock (D7) never waits, so
it stands outside the order. A refusal is thrown inside `run()` (the transaction rolls back and nothing must
be kept). No `lock_timeout` and no retry loop is used anywhere except on the receipt-counter step (D6).

### D5 · The FINISH transaction — numbered steps = lock order (P4-RULE-10)

The numbers are those of P4-RULE-10, so later changes fill the steps marked "not in this change" without
renumbering. `SalesFinishService.finish(sale_id, body)`:

1. **Read** the sale without a lock. FINISHED → `Audit.skip()`, 200 current state; CANCELLED → 409
   `invalid_transition`. `finished_at` = the injected clock's now; business date = `businessDateOf(finished_at)`.
   (`finished_at` in the body is ignored for a visit that is not a late entry, as the contract says.)
   — the steps below run inside one `TransactionRunner.run` —
2. **Day lock** — `DayLock.assertOpen(tx, branch_id, business_date)` → 422 `day_closed`.
3. **Payroll lock** — `PayrollLock.assertNotFinalized(tx, { employee_ids: performers of the SERVICE lines,
   dates: [business_date] })` → 423 `payroll_finalized`.
4. **Sale** `SELECT … FOR UPDATE`; re-check status (FINISHED → `Audit.skip()`, 200 current state;
   CANCELLED → 409).
5. **Visit** `FOR UPDATE` through `VisitsPort.lockForUpdate`. (Booking row — not in this change.)
6. **Actor** — a checkout actor, or `sale.finish_override` + `override_reason` (400 `reason_required`).
7. Visit must be 2 COMPLETED → else 422 `visit_not_completed`.
8. Pending discount request — not in this change.
9. Discount code re-check — not in this change.
10. **Customer** — body `customer { phone, name? }` → `Customers.matchOrCreate(tx, …)` (`INSERT … ON CONFLICT
    (company_id, phone_normalized) DO NOTHING`, then `SELECT … FOR UPDATE`); omitted / null → none.
11. **Totals** recomputed (`SaleTotals.compute`); `expected_total_amount` ≠ total → 409 `total_changed
    { total_amount }`.
12. **Payments** of the sale `FOR UPDATE`; `paid < total` → 422 `amount_mismatch { remaining_amount }`;
    `paid − total` > Σ non-cash → 422 `amount_mismatch`.
13. **Receipt number** — `ReceiptNumbers.next(tx, branch_id, 1, business_date)` (D6).
14. **Update** sale → 2 FINISHED (`finished_at`, `finished_by_user_id`, `business_date`, receipt parts,
    frozen totals, `customer_id`), then `VisitsPort.markFinished` (visit → 3 FINISHED). All line / total
    writes happen before the status changes, so the guard triggers never fire (DB Part 4 constraints note).
15. **Over-transfer change** — `change_due > 0` → insert the `refunds` row: kind 2, method CASH, amount =
    change, reason "Change returned for over-transfer", `refunded_at` = `finished_at`, RF number from
    `ReceiptNumbers.next(tx, branch_id, 2, business_date)`, `client_request_id` = a server-generated UUIDv7.
16. Stock (`StockLedger.post`) — not in this change (no PRODUCT line can exist).
17. **Enqueue and audit, still inside the transaction:** `Jobs.send(tx, 'receipt.render', { entity_type:
    'sales', entity_id })` and, after step 15, the same for `refunds`; `Audit.emit({ action: 'sale.finish',
    …, reason: override_reason })` — the runner writes the row just before commit.
18. **Commit.** Realtime events and the `sale.finished_for_you` notification are not emitted in this change.

### D6 · Gapless receipt numbers (D-PAY-06, API-IDEM-05)

```sql
INSERT INTO receipt_counters (branch_id, kind, receipt_year, receipt_month, last_seq)
VALUES ($1, $2, $3, $4, 1)
ON CONFLICT (branch_id, kind, receipt_year, receipt_month)
DO UPDATE SET last_seq = receipt_counters.last_seq + 1, updated_at = $5
RETURNING last_seq;
```

- The upsert holds the counter row lock until commit, so FINISH transactions of one branch and month take
  their numbers one after another; a rollback gives the number back, hence no gap. The counter is touched as
  late as possible (step 13) to keep the serialised section short.
- Number = `<branches.code>-<YYYY>-<MMM>-<seq padded to 5 digits>`; refund series
  `<code>-RF-<YYYY>-<MMM>-<seq>`. `MMM` comes from a constant array (`JAN` … `DEC`), never from a locale. Year
  and month come from the business date of step 1, which the DB CHECK `sales_business_date_chk` verifies again.
- Second wall: unique `(branch_id, receipt_year, receipt_month, receipt_seq)` and unique `receipt_number` on
  `sales` (and on `refunds`).
- **Lock timeout — only here** (system design §3.5 "counter lock timeout → retry once internally"; CG-IDEM-05
  allows no other retry): `ReceiptNumbers.next` runs `SAVEPOINT receipt_counter` → `SET LOCAL lock_timeout = '5s'` →
  the upsert → `SET LOCAL lock_timeout = 0` → `RELEASE`. SQLSTATE `55P03` → `ROLLBACK TO SAVEPOINT
  receipt_counter` and one more try; a second `55P03` is a 500 with `request_id`. Nothing else in the
  transaction is repeated. 5 s is a build constant.
- **Concurrency tests** (integration, PostgreSQL 16, real HTTP server, connection pool ≥ 20): (a) 20 fully
  paid B3 sales finished with `Promise.all` → the set of `receipt_seq` equals {1 … 20}, `last_seq` = 20;
  (b) two FINISH calls for one sale at once → both 200, one number; (c) a fault injected after step 13
  (test-only provider) → rollback, the next FINISH gets the same number; (d) a sale with an over-transfer
  among 5 concurrent ones → RF numbers without a gap; (e) another connection holds the counter row for 6 s →
  the step times out once, retries and succeeds; held for 12 s → 500 and no number is lost.

### D7 · Idempotency and "no audit row for a replay" (API-IDEM-01 / 02, P4-RULE-22, CG-IDEM-02 / 03)

The mechanism is the foundation's `@Idempotent()` + `Idempotency.run(tx, { key, find, same, create })`
(try-lock on the key → 409 `idempotency_in_progress`; `find` → `same` false → 422 `idempotency_mismatch`, true
→ 200 + `Idempotent-Replayed: true`; else `create`, a unique violation on the `client_request_id` index being
mapped back to the replay). This change supplies, per endpoint:

| Endpoint | `find(key)` | `same(row)` compares | `create()` |
| --- | --- | --- | --- |
| P4.VIS.03 START | `visits` by `client_request_id` (the sale carries the same value) | created by the caller · `branch_id` · `booking_id` · `performed_by_employee_id` | the START steps of D4 |
| P4.PAY.02 payment add | `payments` by `client_request_id` | recorded by the caller · `sale_id` · `payment_method_id` · `amount` | the payment steps of D4 |

Audit (foundation design D12): every write endpoint carries `@Audited({ actions: […] })`; the service calls `Audit.emit`
for what it did and **`Audit.skip()` on a replay and on a repeat that changes nothing** (COMPLETE on a
COMPLETED visit, INCOMPLETE on an INCOMPLETE visit, FINISH on a FINISHED sale), so those answer 200 without an
audit row. A replay returns the current `Visit` / `Sale`.

`GET /v1/me/requests/{client_request_id}` (`delivery`) searches `visits` (→ `resource_type` `visit`, with
`sale_id`), then `Payments.findByClientRequestId` (→ `payment`, with `sale_id` and `visit_id`), restricted to
rows created by the caller (`started_by_user_id` / `recorded_by_user_id`).

### D8 · Money arithmetic (D-PLT-04, API-DATA-02, CG-MONEY-01 … 03)

- Amounts are `bigint` in PostgreSQL and `Mmk` (branded `bigint`) in code. On the wire they are JSON
  integers: every response mapper calls `moneyToWire`, every request mapper `moneyFromWire`; there is **no
  global BigInt serializer**. All arithmetic goes through `packages/shared/src/money`; this change adds
  `subtractMoney`, `multiplyMoney(amount, quantity)` and `maxMoney` to the existing module (tests first) and
  switches the lint rule `point/no-number-money` on for `apps/api`.
- `SaleTotals.compute(lines, payments)` is one pure rule function: `subtotal = Σ multiplyMoney(unit, qty)`
  over lines without `removed_at`; `discount = 0`; `service_charge = 0`; `tax = 0`; `total = subtotal −
  discount + service_charge + tax`; `paid = Σ` non-voided payments; `remaining = max(total − paid, 0)`;
  `change_due = max(paid − total, 0)`; `non_cash_paid = Σ` non-voided payments whose method has `is_cash =
  false`; `finish_allowed = paid ≥ total and paid − total ≤ non_cash_paid`. No division and no rounding exists
  in this change. The discount, service-charge and tax terms are parameters that later changes fill.
- The function runs under the sale row lock after every line / payment write and at FINISH step 11; the
  result is stored on `sales` (DB CHECK `sales_amounts_chk` re-verifies it). The web client does one
  subtraction only ("Customer gave" − payment amount) with `subtractMoney`, and decides "Change to return" and
  the Finish button from `paid_amount`, `total_amount` and the payments it already shows.

### D9 · Error mapping (DB → API, CG-DB-12)

| Source | API answer |
| --- | --- |
| State check under the sale lock: sale FINISHED | 409 `invalid_transition { status: 2, correction_path }` — line add → `difference_sale` (undercharge), line removal → `refund` (overcharge), payment void → `refund` (P4-RULE-01, P4-RULE-09); payment add → `correction_path` omitted (P4-RULE-01 v1.1) |
| State check under the sale lock: sale CANCELLED | 409 `invalid_transition { status: 0 }`, `correction_path` omitted for every write (P4-RULE-01 v1.1) |
| Trigger `sales_finished_guard`, `sale_items_finished_guard`, `payments_finished_guard`, `visits_final_guard` — SQLSTATE `P0001` `finished_immutable` | 423 `locked` (second wall; no endpoint reaches it by design — an occurrence is logged as an error) |
| Unique `payments_reference_unique` (`23505`) | 409 `duplicate_reference { receipt_number }` |
| Unique `visits_client_request_id_key`, `sales_client_request_id_key`, `payments_client_request_id_key` (`23505`) | the replay path of D7 |
| `lock_timeout` on the counter step (`55P03`) | one retry inside `ReceiptNumbers.next`, then 500 |
| Everything else — incl. every CHECK violation `23514` (`payments_amount_chk`, `sale_items_amounts_chk`, `visits_business_date_chk`, `sales_business_date_chk`, `visits_status_fields_chk`, `sales_status_fields_chk`, `sales_amounts_chk`) and the unique indexes `sales_visit_id_key`, `sales_receipt_number_key`, `(branch_id, receipt_year, receipt_month, receipt_seq)` | 500 `internal_error` (API-ERR-02) + error tracking: a bug — the API refuses bad input first (Zod, state checks) |
| `DayLock` | 422 `day_closed { branch_id, business_date, closed_at, closed_by, correction_path: "reopen" }` · 422 `date_in_future` |
| `PayrollLock` | 423 `payroll_finalized { employee_id, run_id, period, status }` |

The two new mappings (`payments_reference_unique`, the `client_request_id` indexes) are added to the one
mapper in `common/database`; services do not catch database errors. `duplicate_reference.context.
receipt_number` is the number of the FINISHED sale that holds the reference and `null` while that sale is
OPEN. Unknown JSON members in a request body are stripped by the Zod schema, so a client-sent price or total
has no effect (API-DATA-02).

### D10 · Receipt pipeline (ADR-013, ADR-014, ADR-002, CG-DB-10)

No render and no bucket call happens inside a database transaction. Both the job and the `GET` use one
function, `ReceiptFiles.ensure(entity_type, entity_id)`:

1. **Short read (no transaction):** `Attachments.findGenerated` → a PDF and a PNG row exist → return them.
2. **No transaction:** build the `ReceiptView` (English labels from the `en` file, `description_en` with
   `description_mm` fallback, masked phone, branch header, opening-hours line, the EN value of
   `receipt.thank_you_text` when one exists) → template `receipt` or `refund-receipt` of `packages/documents`
   rendered to an HTML string with every value escaped → `DocumentRenderer.renderPdf` (page width = paper
   width) and `renderPng` at 384 px (`58`) or 576 px (`80`), thresholded to a 2-colour palette →
   `StorageService.put` twice under new keys `att/<yyyy>/<mm>/<attachment_id>/original.<ext>`.
3. **Short transaction:** `ReceiptFilesLock.acquire(tx, entity_id)` → `Attachments.findGenerated` again →
   a set exists (the other path won) → after the transaction, `StorageService.delete` the two objects just
   written and return the stored set; else `Attachments.storeGenerated` twice (kind 1, `entity_type` `sales` /
   `refunds`, `uploaded_by_user_id` = the finisher, `mime_type` `application/pdf` / `image/png`,
   `storage_key`, `size_bytes`). So job and request store exactly one set.

- FINISH enqueues `receipt.render` in its transaction (D5 #17). Worker: `Jobs.register('receipt.render',
  handler, { concurrency: 1, retryLimit: 2 })` — 3 attempts in all, backoff per ADR-002; the handler calls
  `ReceiptFiles.ensure`. A job that fails on its last attempt is logged as an error; `job.failed` arrives with
  `add-notifications-inbox`.
- `GET …/receipt?format=pdf|png` → `ReceiptFiles.ensure`, then the stored file streamed through the API. A
  `width` different from the branch setting → rendered and streamed, not stored. `format=json` → the
  `ReceiptView` built now, with `pdf_attachment_id`, `png_attachment_id`, `rendered_at`.
- `DocumentRenderer` keeps one Chromium and renders one page at a time through an in-process queue with two
  priorities: an interactive render (a `GET`) goes ahead of queued background renders (the job) — ADR-013 #7.
- Choices left to the build by ADR-013 and fixed here: driver = Playwright (`playwright-core`); templates =
  React components rendered with `renderToStaticMarkup` (escaping by construction); 1-bit conversion =
  `sharp`; render timeout 10 s; browser recycled every 200 renders; Chromium headless, JavaScript off, every
  network request blocked, non-root; fonts Pyidaungsu + Inter from `packages/documents/fonts`, the renderer
  waits for `document.fonts.ready`; body text ≥ 22 px at 384 px (AD-RCPT-02). No logo is drawn (none can be
  uploaded before `add-company-profile`, which also adds the inlining as a data URI). The PNG is rendered and
  stored now (ADR-013 renders both), although no device prints it before `add-android-shell`.
- Opening-hours line: weekdays 1 … 7 of `branch_opening_hours`, consecutive days with equal hours joined
  (`Mon–Sun 9:00 AM – 9:00 PM`), a closed day written "Closed"; no rows → no line.
- Storage: `StorageService` on the S3 API with a configurable endpoint and an in-memory fake for unit tests
  (CG-ARCH-08); MinIO in `docker-compose.dev.yml` and CI, the owner's bucket in production (ADR-014).

### D11 · Web: routes, components, data fetching

| Route (`apps/web/app/staff/(authed)/…`) | Screen | Shared components (AD-IMPL-02) |
| --- | --- | --- |
| `/today` | Today — "In progress" cards | `AppShell`, `BottomNav`, `BranchSwitcher`, `PageHeader`, `CardList`, `StatusBadge`, `EmployeeChip`, `DateText`, `EmptyState`, `ErrorState`, `OfflineBanner` |
| `/visits/new` | Arrival step ("Walk-in") → START sheet (full-screen sheet) | `Sheet`, `EmployeeChip`, `OfflineBanner`, `LockBanner` (closed day) |
| `/sales/[id]` | by state: visit STARTED → in-progress screen · COMPLETED → checkout · sale FINISHED → success / read-only with the on-screen receipt · CANCELLED → read-only | `Sheet`, `Stepper`, `MoneyText`, `MoneyInput`, `PhoneInput`, `ReasonDialog`, `StatusBadge`, `FlagChip`, `EmployeeChip`, `LockBanner`, `ReceiptRenderer` |
| `/help/offline` | static help text behind the offline banner's link | `PageHeader` |

- The foundation change mounts `AppShell` (branch chip, user menu) in `app/staff/(authed)/layout.tsx`. This
  change adds to that layout: `BottomNav` with **Today** (badge = open visits) and the centre **＋ Start**; the
  branch default of AD-NAV-04 (`today_branch_id` — null until scheduling exists — → last used on this device →
  `assigned_branch_ids[0]`); and the redirect of `app/staff/(authed)/page.tsx` to `/today`. The items
  Bookings, Customers and More are added by the changes that build those screens.
- Feature components live in `apps/web/components/pos/`: `VisitCard`, `StartSheet`, `ServicePicker`,
  `VisitHeader`, `SaleLines`, `PaymentButtons`, `PaymentSheet`, `PaymentList`, `FinishStep`, `SuccessPanel`,
  `SavedCheck`. `SaleLines` is used by the in-progress screen and by the checkout "Items" section; after
  COMPLETE its add dialog asks for `added_reason`.
- Payment controls follow AD-POS-08 literally: **Cash** records `remaining_amount` at once (tap 6 of
  AD-GOAL-01 — no sheet); **KBZPay** opens the reference sheet with the amount preset; **Split** opens
  `PaymentSheet` with method and an editable amount. The optional "Customer gave" helper sits on a recorded
  cash payment line of `PaymentList` (and in `PaymentSheet` for a cash split); it is not part of the 7 taps.
- The unpaid-visit link gets `context.visit_id`, reads `GET /v1/visits/{visit_id}` and navigates to
  `/sales/<visit.sale.id>`.
- The service picker and the START chips ask the quote with `date` = the visit's business date (today on the
  START sheet), so the price shown is the price the line will record (P4-RULE-05).

Data fetching without realtime (AD-PERF-03 / 04, ADR-008 "correctness does not depend on realtime"):

| Query | Key | Policy |
| --- | --- | --- |
| Open visits, a sale | `['me','visits','open']` · `['sale', id]` | `staleTime` 0; refetch on mount, on window focus, on reconnect; no `refetchInterval` (the sources define focus and mutation only); every mutation writes the returned `Sale` / `Visit` (API-DATA-10) into the cache and invalidates `['me','visits','open']` |
| Services, categories, payment methods | `['services', branch_id]` … | `staleTime` 5 min + refetch on focus |
| Price quote for the picker | `['quote', branch_id, employee_id, date]` | `staleTime` 0 (P2.PRC.06 "not cached") |

What the user sees meanwhile: a change made on another device appears when the screen opens, regains focus or
after the barber's next action — not instantly. An action on stale data is decided by the server (409
`invalid_transition`, 409 `total_changed`) and the screen reloads the sale. No mutation is optimistic.

"View / share PDF": the app fetches `…/receipt?format=pdf` (same origin, session cookie) as a blob, offers it
through the Web Share API when `navigator.canShare({ files })` is true and opens it in a new tab otherwise.

### D12 · What is absent, and three screen readings

Nothing here answers with an invented refusal (D-PLT-11); the absent parts are listed in
`proposal.md` ("Parts of locked contracts that are absent in this change").

- **Reason fields (API-DATA-11, Part 0 v1.6):** the shared reason dialog returns its generic result and the
  calling screen maps it to the field the endpoint defines — `reason` (line removal, void, incomplete),
  `added_reason`, `override_reason`.
- **New texts (D-PLT-20):** English from the AD wording where one exists, Myanmar written in the pull request;
  the owner reads and corrects both there. Keys and behaviour do not change.
- **Request schemas** hold only the members this change builds. `StartVisitRequest` = `{ branch_id, items? }`;
  `SaleItemCreate` = `{ line_type: 1, service_id, added_reason? }`. Members of later changes are not in the
  schema yet and, like any unknown member, are stripped. Only the project's own web client calls these
  endpoints (same origin, CSRF header), and it never sends them.
- **The quote** (`PriceQuote.quote` and P2.PRC.06) is built whole: locations BRANCH and HOME, the variant key,
  `price_source` 1 – 4, `transport_fee_amount` from `home_service.transport_fee_amount`, the refusals
  `outside_window` (today + `booking.advance_window_days`) and `day_closed` (through `DayLock.closedDay`).
- **Arrival step (AD-POS-02):** shows the one button "Walk-in"; "Has a booking" does not exist until
  `add-booking-visit-start`. The "Walk-in" tap stays, so AD-GOAL-01 is measured on the final flow.
- **Finish step (AD-POS-12):** an empty phone field is Skip (recorded reading 2 of the proposal).
- **Success screen:** no "Print receipt" (no shell reports `canBluetoothPrint` — AD-PWA-02) and no "open this
  sale on an Android phone" hint until `add-android-shell`.
- **START chips and picker (AD-POS-03 · AD-POS-05, guideline v1.7):** the chips are the first 6 simple services
  in catalogue order (`GET /v1/services?branch_id=&pricing_mode=1`); the picker has search + categories and no
  "Frequent here" section. No usage ranking exists in V1.
- **Offline (AD-STATE-05):** the shared `OfflineBanner` keeps its locked wording; its help link opens
  `/help/offline`, which says: write the service on paper; it is entered with Late entry. There is no
  interim procedure (D-PLT-20 #7, D-VIS-13).
- Line duration on screen comes from the quote / service list; a sale line stores no duration.

### D13 · Test strategy (CG-TEST-01 … 05)

**Unit (Vitest)** — `SaleTotals.compute` table: 8,000; 8,000 + 3,000 = 11,000; 10,000 + 3,000 + 2,000 with
Hair wash removed = 13,000; Cash 5,000 on 11,000 → remaining 6,000; voided payment; KBZPay 10,000 on 8,000 →
change 2,000; Cash 5,000 + KBZPay 10,000 on 11,000 → change 4,000, allowed (4,000 ≤ 10,000); Cash 8,000 +
KBZPay 2,000 on 8,000 → change 2,000, allowed (2,000 ≤ 2,000); Cash 11,000 on 8,000 → excess 3,000 > 0
non-cash → not allowed. `subtractMoney`, `multiplyMoney`, `maxMoney`. Receipt-number formatter (`00001`,
`00125`, `100000`, `OCT` / `NOV`, RF series). Extra `businessDateOf` cases for the month boundary. Phone mask
(`+95977123456` → `09•••••456`). Quote resolver (barber row beats branch row; effective dates; no row = not
sold; HOME fallback; window edges). Actor resolvers and `Sale.actions`. Zod schemas (unknown members stripped;
`amount` ≥ 1 integer; reason 1,000 / 1,001). Opening-hours line builder.

**Integration (real PostgreSQL 16, real pg-boss, MinIO; the clock is injected in-process — CG-TIME-03)** —
written before the handlers for the money, permission and date-boundary rules: START (201, replay 200 +
header, in-progress 409 with the first request held by a latch, mismatch 422, missing key 400, `out_of_scope`,
`not_assigned_to_branch`, `unpaid_visit_open`, `day_closed`); lines (price by performer, snapshot,
`not_sold_here`, `not_eligible` warning, reasons, `service_required`); COMPLETE / INCOMPLETE; payments (cash
cap at 8,000 / 8,001, `reference_required`, `reference_format`, no pattern, trim, `duplicate_reference` incl.
the simultaneous pair with `receipt_number` null, void frees the reference, idempotency set, collector default
and `not_assigned_to_branch`, `day_closed` on add and void); FINISH (happy path, `visit_not_completed`,
`amount_mismatch` both forms and the equal-excess boundary, `total_changed`, `day_closed`, `payroll_finalized`
with its three edges, customer match / create / name required / reactivate / restore / simultaneous new
phone, automatic change + RF number + UUIDv7, repeat = 200 and nothing written twice, the five concurrency
tests of D6, month boundary with the injected clock); immutability (409 + `correction_path` per write and
status; raw SQL against the guard triggers exactly as the requirement lists them); permissions (Ko Min, Ko
Htet, Ko Zaw, Ma Hnin on read / line / pay / FINISH / receipt; one deny-path test per code — CG-TEST-05);
request lookup; audit rows (one per action, none for a replay or an unchanged repeat, trigger rows); base seed
on a database without fixtures (CASH, KBZPAY, idempotent). Receipt: `ReceiptView` content for sale and refund,
stored once (job vs request race), byte-identical re-read after branch data changes, `format=json` live, PNG
width 384 and 2-colour palette, 22 px, golden image with a stacked-consonant Myanmar fallback name, PDF text
extraction finds the number, no job after a refused FINISH, renderer failure leaves the sale finished,
interactive render overtakes a queued job.

**End to end (Playwright, login through the Mailpit OTP, against the running Compose stack)** — the flows of
AD-QA-03 this slice covers: (1) *walk-in cash* — Ko Aung, Haircut 10,000, 7 taps, skip phone, PDF opens;
(2) *walk-in split Cash + KBZPay* — Ko Min, 11,000 = Cash 5,000 + KBZPay 6,000 (the "internal discount code"
half of that AD-QA-03 flow waits for `add-discount-codes`); (3) *overpayment return* — the automatic part
only: KBZPay 10,000 on 8,000 → "Change to return: 2,000 Ks" → RF number on the success screen. Plus: unpaid
block message, mark incomplete, void and re-pay, duplicate reference message, double tap on Start and on Cash
(one row), lost reply → "Checking whether it was saved…" (route interception), Finish with Ma Su's phone, Ko
Min cannot open Ko Aung's sale, the START sheet at 360 × 640. Each flow runs at 360 × 800 in MM and EN; flow
(1) also at 1280 × 800; axe on the screens (AD-QA-01).
**No clock override exists in a deployed build** (CG-TIME-03; no test-only endpoint), so the e2e tests do not
assert a literal month: the database is reset and seeded per test file, and a receipt number is asserted as
`B3-<YYYY>-<MMM>-00001` (refund: `B3-RF-<YYYY>-<MMM>-00001`) with year and month taken from
`system.server_time` of `GET /v1/me` read at the start of the test, plus the pattern
`^B3-\d{4}-[A-Z]{3}-\d{5}$`. The literal `OCT` / `NOV` cases are integration tests.

### D14 · Pilot notes (AD-QA-04, REC-03, AD-GOAL-01)

This change does not make the pilot possible on its own. The pilot needs, in addition:

- `add-staging-deploy` — a server with the production Compose stack; sign-in is Google only there, in the
  browser tab (the installed Android shell and the iOS Home-Screen PWA cannot sign in yet).
- `add-late-entry` — the way D-VIS-13 records a service written on paper during an outage. There is no
  interim procedure (D-PLT-20 #7).
- `add-pilot-data-seed` — an operator-run, reviewed script for the pilot branch: the barbers with their Google
  addresses, branch assignments and the Barber role, the services, prices and eligibility, and the real KBZPay
  pattern in `payment_methods.reference_regex`. The fixture people and prices are never loaded there.

What the pilot measures on the screens of this change (input for the pilot sheet that `add-staging-deploy`
writes): taps START → FINISH per barber (target ≤ 7) and seconds of interaction (target ≤ 10 s — a target,
not a requirement); hesitations and mis-taps; no clipped Myanmar text at 360 px width (AD-GOAL-05); every
money action shows its amount and cannot be sent twice (AD-GOAL-03); p95 of START, line add, payment add and
FINISH ≤ 400 ms (AD-PERF-01); the PDF opens and shares on Android and on iPhone. Known limits to tell the
barbers: no printing, no discount, refund or booking START; a finished receipt is reopened from its link;
other devices' changes appear after reopening or refocusing the app; days are not closed (no closing screen),
so cash is reconciled outside the system.

## Risks / Trade-offs

| Risk | Mitigation · test |
| --- | --- |
| A gap or duplicate in receipt numbers under concurrent FINISH | Counter row lock inside the transaction + two unique indexes · D6 tests (a) – (e) |
| Double charge from a double tap or a retry | `client_request_id` unique per table + try-lock + disabled buttons · integration replay tests, e2e double-tap tests |
| A sale lands on the wrong business day or month at midnight | `businessDateOf` only, DB CHECKs · unit + integration boundary tests with the injected clock |
| Deadlock between FINISH, payments and (later) day close | One lock order, advisory locks first, READ COMMITTED · soak test: 50 mixed payment / FINISH / INCOMPLETE calls on 10 sales finish without SQLSTATE `40P01` |
| A finished sale is changed | State check under the row lock (409) + four guard triggers · immutability tests incl. raw SQL |
| Chromium in the API image: memory spikes, crashes | One page at a time, queue with priority, timeout, recycle; FINISH never waits for a render; nothing renders inside a transaction · renderer-failure test |
| Two stored sets, or orphan objects, when job and request race | Advisory lock around the row insert, loser deletes its objects · race test counts rows and objects |
| Receipt differs between two opens | Stored files · byte-equality test |
| No realtime: a barber acts on stale data | Refetch on focus / mutation; the server decides; `expected_total_amount` at FINISH · stale-screen tests |
| The seams are wrong when Parts 5 / 7 arrive | Their SQL and context shapes are copied from P7-RULE-02 / P5-RULE-10, tested with seeded rows · `day_closed`, `date_in_future` and `payroll_finalized` integration tests |
| A caller sends a member that does not exist yet (`performed_by_employee_id`, `late_entry`) and it is stripped | Only the own web client calls the API (same origin, CSRF header) and never sends them; each later change adds the member with its rule and tests |
| The change is larger than the usual size | An accepted exception (D-PLT-20): three pull requests along the task groups; A and B merge on CI + review, the test workbook runs on C |
| No checkout without payment methods outside a fixture database | CASH and KBZPAY in the base seed · test on a database without fixtures |

## Migration Plan

1. **PR A:** task groups 1 – 6 — permission catalogue, base seed and fixture modules, `packages/shared`
   schemas and money helpers, seams, catalog + customer reads, visits and lines API. No migration.
2. **PR B:** task groups 7 – 9 — payments, FINISH, the `receipt.render` job, renderer, storage, receipt
   endpoints. Needs the new environment values (`S3_ENDPOINT`, bucket, keys) and the rebuilt API image
   (Chromium + fonts); MinIO service added to `docker-compose.dev.yml` and CI.
3. **PR C:** task groups 10 – 14 — bottom navigation, routes under `apps/web/app/staff/(authed)`, language
   keys, e2e.
4. Each pull request is titled `<type>(add-walkin-visit-checkout): <subject>` (CG-GIT-02). Pull requests A
   and B are squash-merged on green CI + review by Dev 1; on pull request C the test workbook is generated and
   run, every NG is fixed, then it is squash-merged (CG-GIT-05, D-PLT-20). The change is archived after PR C.
5. No data backfill and no schema change. Rollback = revert the pull request. The base seed rows CASH and
   KBZPAY are harmless to an older build. A development database is re-created from scratch when needed;
   receipt numbers are never reset by code.
