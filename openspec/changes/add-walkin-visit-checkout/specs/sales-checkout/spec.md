## Purpose

The sale is the money document of a visit: server-computed totals, FINISH with a gapless receipt number, the
immutable finished sale and its stored English receipt. This delta covers a walk-in sale with service lines.

## ADDED Requirements

### Requirement: Sale totals are computed by the server in whole MMK (D-PLT-04 · D-PAY-08 · API-DATA-02 · P4-RULE-06 · P4.SAL.02 · AD-POS-07 · AD-HELP-02 · AD-FMT-01)

The server SHALL recompute the sale after every line or payment change while the sale is 1 OPEN and return it
in the `Sale` resource as JSON integers: `subtotal_amount` = Σ (`unit_price_amount` × `quantity`) over the
lines without `removed_at`; `total_amount` = `subtotal_amount` − `discount_amount` + `service_charge_amount` +
`tax_amount`, where in this change `discount_amount`, `service_charge_amount` and `tax_amount` are 0 (no
discount source exists; `sales.service_charge_enabled` and `sales.tax_enabled` are OFF by default);
`paid_amount` = Σ non-voided payments; `remaining_amount` = max(`total_amount` − `paid_amount`, 0);
`change_due_amount` = max(`paid_amount` − `total_amount`, 0). The client MUST NOT send or compute a total. The
checkout SHALL show the total with a "How is this calculated?" breakdown and format money as `11,000 Ks` in
the English UI and `11,000 ကျပ်` in the Myanmar UI.

#### Scenario: Two services
- **WHEN** Ko Min's OPEN sale at B3 has Haircut 8,000 and Shave 3,000
- **THEN** `subtotal_amount` = 11,000 (8,000 + 3,000), `discount_amount` = 0, `service_charge_amount` = 0, `tax_amount` = 0 and `total_amount` = 11,000
- **AND** `paid_amount` = 0, `remaining_amount` = 11,000 and `change_due_amount` = 0

#### Scenario: Three services, one removed
- **WHEN** Ko Aung's sale has Haircut 10,000 + Shave 3,000 + Hair wash 2,000 = 15,000 and Hair wash is removed with a reason
- **THEN** `total_amount` = 13,000 (10,000 + 3,000)

#### Scenario: Part payment
- **WHEN** Ko Min's sale of 11,000 receives Cash 5,000
- **THEN** `paid_amount` = 5,000, `remaining_amount` = 6,000 (11,000 − 5,000) and `change_due_amount` = 0

#### Scenario: A voided payment does not count
- **WHEN** that Cash 5,000 payment is voided with a reason
- **THEN** `paid_amount` = 0 and `remaining_amount` = 11,000

#### Scenario: The breakdown and the Myanmar format
- **WHEN** Ko Min opens "How is this calculated?" on the 11,000 checkout with the Myanmar UI
- **THEN** it lists Haircut `8,000 ကျပ်`, Shave `3,000 ကျပ်` and the total `11,000 ကျပ်`, with digits 0–9

### Requirement: FINISH needs a completed visit and full payment (D-VIS-07 · D-VIS-08 · P4.SAL.10 · P4-RULE-10 · AD-POS-08 · AD-POS-12)

`POST /v1/sales/{id}/finish` SHALL finish a sale only when its visit is 2 COMPLETED (else 422
`visit_not_completed`) and `paid_amount` ≥ `total_amount` (else 422 `amount_mismatch` with
`context.remaining_amount`). `paid_amount` > `total_amount` SHALL be accepted only when the excess is not
larger than the sum of the non-voided non-cash payments (else 422 `amount_mismatch`). On success the sale SHALL
become 2 FINISHED with `finished_at` = server time, `finished_by_user_id` = the caller, `business_date` and the
receipt number, and the visit SHALL become 3 FINISHED with the same `finished_at`; the response is 200 `Sale`.
The Finish button SHALL stay disabled, with the reason written under it, while `paid_amount` < `total_amount`
and also while `paid_amount` − `total_amount` is larger than the sum of the non-voided non-cash payments.

#### Scenario: Walk-in, one service, cash
- **WHEN** Ko Aung's visit (START 10:05 AM, COMPLETE 10:40 AM, Haircut 10,000) has one Cash payment of 10,000 and he sends FINISH with `expected_total_amount` = 10,000 at `2026-10-05T10:42:00+06:30` as the first sale of October at B3
- **THEN** the response is 200 with sale `status` = 2, `receipt_number` = `B3-2026-OCT-00001`, `business_date` = `2026-10-05`, `finished_at` = `2026-10-05T10:42:00+06:30`, `finished_by` = Ko Aung
- **AND** the visit has `status` = 3 and `finished_at` = `2026-10-05T10:42:00+06:30`

#### Scenario: Paid less than the total
- **WHEN** Ko Min's sale totals 11,000, holds Cash 5,000 only, and FINISH is sent with `expected_total_amount` = 11,000
- **THEN** the response is 422 `amount_mismatch` with `context.remaining_amount` = 6,000 (11,000 − 5,000)
- **AND** the sale stays 1 OPEN without a receipt number

#### Scenario: Visit not completed
- **WHEN** Ko Min's visit is still 1 STARTED with Haircut 8,000 and a Cash payment of 8,000, and FINISH is sent
- **THEN** the response is 422 `visit_not_completed`

#### Scenario: Cash excess after a line was removed
- **WHEN** Ko Min's sale of 11,000 (Haircut 8,000 + Shave 3,000) was paid with Cash 11,000, Shave is then removed with a reason so that `total_amount` = 8,000, and FINISH is sent with `expected_total_amount` = 8,000
- **THEN** the response is 422 `amount_mismatch` with `context.remaining_amount` = 0, because the excess 3,000 (11,000 − 8,000) is larger than the non-cash payments (0)
- **AND** after the Cash 11,000 payment is voided and Cash 8,000 is taken, FINISH succeeds

#### Scenario: Excess exactly equal to the non-cash payments
- **WHEN** a sale of 8,000 holds Cash 8,000 and then KBZPay 2,000 (reference `KBZ0001234569`), so `paid_amount` = 10,000 and the excess is 2,000 (10,000 − 8,000) = the non-cash payments (2,000), and FINISH is sent with `expected_total_amount` = 8,000
- **THEN** the response is 200, the sale is 2 FINISHED and a change return of 2,000 is recorded

#### Scenario: Finish stays disabled on a cash excess
- **WHEN** the checkout shows the total 8,000 Ks with Cash 11,000 recorded (a line was removed after payment)
- **THEN** the Finish button is disabled with the reason under it and no "Change to return" line is shown
- **AND** the reason tells the barber to void the cash payment and take it again

#### Scenario: Finish stays disabled while money is missing
- **WHEN** the checkout shows the total 11,000 Ks with Cash 8,000 recorded
- **THEN** "Remaining to pay: 3,000 Ks" is visible and the Finish button is disabled with that reason under it

### Requirement: FINISH refuses a total the screen did not show (P4.SAL.10 · P4-RULE-10 · P4-RULE-22 · AD-PERF-04 · AD-GOAL-03)

The FINISH request SHALL carry `expected_total_amount` — the total shown on the Finish button (missing → 400
`validation`). When it differs from the total recomputed under the sale's row lock, the API SHALL answer 409
`total_changed` with `context.total_amount` = the current total, leave the sale OPEN and assign no receipt
number; the app SHALL reload the sale and show the new total.

#### Scenario: A line was added on another device
- **WHEN** Ko Min's Finish button shows "Finish · 8,000 Ks" with Cash 8,000 paid, a Shave line (3,000) has meanwhile been added to the sale from another session, and he taps Finish sending `expected_total_amount` = 8,000
- **THEN** the response is 409 `total_changed` with `context.total_amount` = 11,000 (8,000 + 3,000)
- **AND** the sale stays 1 OPEN and the screen reloads showing the total 11,000 Ks and "Remaining to pay: 3,000 Ks"

#### Scenario: Totals match
- **WHEN** the screen shows 11,000 Ks, the sale totals 11,000 and is fully paid, and FINISH carries `expected_total_amount` = 11,000
- **THEN** the response is 200 and the sale is 2 FINISHED

#### Scenario: Field missing
- **WHEN** FINISH is sent with the body `{}`
- **THEN** the response is 400 `validation` naming the field `expected_total_amount`

### Requirement: The day lock and the payroll lock gate every money write (D-FIN-06 · API-IDEM-06 · P7-RULE-02 · P5-RULE-10 · P4-RULE-02 · P4-RULE-09 · P4-RULE-10 · AD-STATE-06 · AD-POS-03 · AD-POS-12)

Before any row lock, START, payment add, payment void and FINISH SHALL take the shared day lock of (branch,
business date) and answer 422 `day_closed` with `context { branch_id, business_date, closed_at, closed_by,
correction_path: "reopen" }` when `daily_closings` holds a row in status 2 CLOSED for that branch-day; no row,
or a row in status 1 OPEN, passes. FINISH of a sale with SERVICE lines SHALL then take the shared payroll lock
and answer 423 `payroll_finalized` with `context { employee_id, run_id, period { start, end }, status }` when
the business date lies inside the period of a payroll run in status 3 FINALIZED, 4 PUBLISHED or 5 PAID.
INCOMPLETE takes neither lock. The app SHALL show "This day is closed — ask an admin to reopen it." for
`day_closed`.

#### Scenario: START on a closed day
- **WHEN** B3's branch-day `2026-10-05` is CLOSED (closed by Ma Hnin at `2026-10-05T21:05:00+06:30`) and Ko Aung sends START for B3 at 9:10 PM
- **THEN** the response is 422 `day_closed` with `context.business_date` = `2026-10-05`, `context.closed_at` = `2026-10-05T21:05:00+06:30`, `context.closed_by` = Ma Hnin and `context.correction_path` = `reopen`
- **AND** no visit is created and the screen shows "This day is closed — ask an admin to reopen it."

#### Scenario: Payment on a closed day
- **WHEN** Ko Min's sale is OPEN, the branch-day `2026-10-05` has been closed, and he adds Cash 8,000
- **THEN** the response is 422 `day_closed` and no payment row is created

#### Scenario: Payment void on a closed day
- **WHEN** Ko Min's OPEN sale holds Cash 8,000, the branch-day `2026-10-05` has been closed, and he voids that payment with a reason
- **THEN** the response is 422 `day_closed` and the payment still counts

#### Scenario: FINISH on a closed day
- **WHEN** Ko Min's sale is fully paid, the branch-day `2026-10-05` has been closed, and he sends FINISH
- **THEN** the response is 422 `day_closed`, the sale stays 1 OPEN and no receipt number is taken

#### Scenario: Finalized payroll period
- **WHEN** a payroll run for `2026-10-01` … `2026-10-31` is in status 3 FINALIZED and Ko Aung sends FINISH for his fully paid sale on `2026-10-05`
- **THEN** the response is 423 `payroll_finalized` with `context.employee_id` = Ko Aung, `context.period` = `{ "start": "2026-10-01", "end": "2026-10-31" }` and `context.status` = 3
- **AND** the sale stays 1 OPEN

#### Scenario: Last day of a finalized period
- **WHEN** the run for `2026-10-01` … `2026-10-31` is in status 3 FINALIZED and a sale with a SERVICE line is finished at `2026-10-31T20:00:00+06:30`
- **THEN** the response is 423 `payroll_finalized`

#### Scenario: First day after the finalized period
- **WHEN** the same run is FINALIZED and a sale is finished at `2026-11-01T09:30:00+06:30`
- **THEN** the payroll gate passes and the response is 200 with `B3-2026-NOV-00001`

#### Scenario: A calculated run does not lock
- **WHEN** the run for `2026-10-01` … `2026-10-31` is in status 2 CALCULATED and Ko Aung sends FINISH on `2026-10-05`
- **THEN** the payroll gate passes and the response is 200

#### Scenario: No closing row
- **WHEN** `daily_closings` has no row for (B3, `2026-10-05`) and no payroll run exists
- **THEN** START, payment add and FINISH pass both gates

#### Scenario: INCOMPLETE on a closed day
- **WHEN** the branch-day `2026-10-05` is CLOSED and Ko Aung marks his STARTED visit of that day incomplete with a reason
- **THEN** the response is 200 (no money moves, no day lock)

### Requirement: Receipt numbers are gapless per branch and month (D-PAY-06 · API-IDEM-05 · P4-RULE-10 · P4-RULE-18 · AD-FMT-06)

FINISH SHALL take the next number from `receipt_counters` for (branch, kind 1 SALE, year and month of the
sale's business date) under a row lock inside the FINISH transaction and store `receipt_number` =
`<branch code>-<YYYY>-<MMM>-<sequence, at least 5 digits>` with `MMM` the upper-case English month
abbreviation, together with `receipt_year`, `receipt_month` and `receipt_seq`. Within one branch and month the
numbers SHALL run 00001, 00002, … with no gap and no duplicate; a FINISH that fails and a visit marked
INCOMPLETE SHALL consume no number. The number is never translated and never reused.

#### Scenario: First three sales of October at B3
- **WHEN** three sales are finished at B3 on 05/Oct/2026 at 10:42 AM, 10:50 AM and 11:15 AM with an empty October counter
- **THEN** they get `B3-2026-OCT-00001`, `B3-2026-OCT-00002` and `B3-2026-OCT-00003`, with `receipt_year` = 2026, `receipt_month` = 10 and `receipt_seq` = 1, 2, 3

#### Scenario: Branches count separately
- **WHEN** Ko Htet finishes the first October sale at B1 after B3 has already issued `B3-2026-OCT-00003`
- **THEN** the B1 sale gets `B1-2026-OCT-00001`

#### Scenario: A refused FINISH takes no number
- **WHEN** the last receipt at B3 is `B3-2026-OCT-00003`, a FINISH is refused with 422 `amount_mismatch`, and the next FINISH succeeds
- **THEN** the successful sale gets `B3-2026-OCT-00004`

#### Scenario: A rolled-back FINISH takes no number
- **WHEN** a FINISH transaction at B3 fails after the counter step and is rolled back, and another sale is then finished
- **THEN** that sale gets the number the failed transaction had taken — no gap

#### Scenario: Twenty sales finished at the same instant
- **WHEN** 20 different fully paid B3 sales are finished concurrently on 05/Oct/2026 with an empty October counter
- **THEN** all 20 answer 200 and their numbers are exactly `B3-2026-OCT-00001` … `B3-2026-OCT-00020`, each used once
- **AND** `receipt_counters.last_seq` for (B3, kind 1, 2026, 10) = 20

### Requirement: Business dates and the receipt month follow Myanmar time (D-PLT-15 · D-PLT-05 · API-DATA-03 · P4-RULE-01 · AD-FMT-11)

The server SHALL compute every business date in Asia/Yangon (UTC+06:30) and never accept one from the client:
a visit's `business_date` = the Myanmar-time date of `started_at`; a sale's `business_date` = the Myanmar-time
date of `finished_at`; the receipt year and month come from the sale's business date. Timestamps SHALL be
returned as ISO 8601 with the `+06:30` offset.

#### Scenario: One minute before midnight on the last day of October
- **WHEN** the October counter at B3 stands at 124 and a sale is finished at `2026-10-31T23:59:00+06:30`
- **THEN** `business_date` = `2026-10-31` and `receipt_number` = `B3-2026-OCT-00125`

#### Scenario: Midnight starts November
- **WHEN** the next B3 sale is finished at `2026-11-01T00:00:00+06:30` (which is `2026-10-31T17:30:00Z`)
- **THEN** `business_date` = `2026-11-01` and `receipt_number` = `B3-2026-NOV-00001`

#### Scenario: A visit that crosses midnight
- **WHEN** Ko Aung starts a walk-in at `2026-10-05T23:59:00+06:30` and the sale is finished at `2026-10-06T00:00:00+06:30`
- **THEN** the visit's `business_date` = `2026-10-05` and the sale's `business_date` = `2026-10-06`
- **AND** FINISH checks the day lock of `2026-10-06`

### Requirement: FINISH is idempotent by state (D-VIS-10 · API-IDEM-01 · API-IDEM-02 · P4-RULE-10 · P4-RULE-22 · AD-NET-01)

FINISH SHALL take no `Idempotency-Key`. A FINISH on a sale that is already 2 FINISHED SHALL answer 200 with
the current sale — the same receipt number — before any lock, and SHALL write no second receipt number, no
second change-return row and no second render job; a FINISH on a sale that is 0 CANCELLED SHALL answer 409
`invalid_transition` with `context.status` = 0. Two FINISH requests for the same sale that run at the same
moment SHALL both answer 200 with one receipt number.

#### Scenario: FINISH twice
- **WHEN** the sale `B3-2026-OCT-00001` is finished and FINISH is sent again one second later
- **THEN** the response is 200 with `receipt_number` = `B3-2026-OCT-00001`
- **AND** `receipt_counters.last_seq` for (B3, kind 1, 2026, 10) is still 1

#### Scenario: Double tap on Finish
- **WHEN** two FINISH requests for the same fully paid sale reach the API at the same moment
- **THEN** both answer 200 with the same `receipt_number` and exactly one number was taken

#### Scenario: Repeat after the day was closed
- **WHEN** the sale `B3-2026-OCT-00001` is finished, the branch-day is then closed, and FINISH is sent again
- **THEN** the response is 200 with the current sale (not 422 `day_closed`)

#### Scenario: FINISH on a cancelled sale
- **WHEN** a visit was marked incomplete (sale 0 CANCELLED) and FINISH is sent for its sale
- **THEN** the response is 409 `invalid_transition` with `context.status` = 0

### Requirement: A finished or cancelled sale is immutable (D-VIS-08 · D-DAT-05 · API-PERM-05 · P4-RULE-01 · P4-RULE-09 · AD-DET-03)

Every direct write on a sale in status 2 FINISHED or 0 CANCELLED — line add, line remove, payment add,
payment void — SHALL answer 409 `invalid_transition` with `context.status`, never 423. On a FINISHED sale
`context.correction_path` SHALL be `difference_sale` for a line add (an undercharge) and `refund` for a line
removal (an overcharge) and for a payment void. For a payment add on a FINISHED sale, and for every write on
a CANCELLED sale, `context.correction_path` SHALL be omitted: the answer is 409 `invalid_transition` with
`context.status` only. As the second wall the database SHALL reject with SQLSTATE `P0001` `finished_immutable`: an UPDATE of
a FINISHED or CANCELLED sale other than `customer_id` / `updated_at`; any INSERT, UPDATE or DELETE of a line
of such a sale; an UPDATE (other than `verified_at`, `verified_by_user_id`, `external_reference`) or a DELETE
of a payment of a FINISHED sale; an UPDATE of a FINISHED or INCOMPLETE visit other than `updated_at`. A
payment INSERT, and payment writes on a CANCELLED sale, are stopped by the API state check only. The screen
of a finished sale SHALL show a lock banner and text instead of inputs.

#### Scenario: Add a line after FINISH
- **WHEN** Ko Aung sends `POST /v1/sales/{id}/items` (Shave) for his finished sale `B3-2026-OCT-00001`
- **THEN** the response is 409 `invalid_transition` with `context.status` = 2 and `context.correction_path` = `difference_sale`
- **AND** the sale still totals 10,000

#### Scenario: Remove a line after FINISH
- **WHEN** Ko Aung sends the remove request with a reason for the Haircut line of `B3-2026-OCT-00001`
- **THEN** the response is 409 `invalid_transition` with `context.status` = 2 and `context.correction_path` = `refund`

#### Scenario: Void a payment after FINISH
- **WHEN** Ko Aung sends `POST /v1/payments/{id}/void` with a reason for the Cash 10,000 payment of `B3-2026-OCT-00001`
- **THEN** the response is 409 `invalid_transition` with `context.status` = 2 and `context.correction_path` = `refund`

#### Scenario: Cash on a finished sale
- **WHEN** Ko Aung sends a Cash payment of 1,000 with a new `Idempotency-Key` for the finished sale `B3-2026-OCT-00001`
- **THEN** the response is 409 `invalid_transition` with `context.status` = 2 and no `context.correction_path`
- **AND** no payment row is created and `paid_amount` stays 10,000

#### Scenario: Add a line to a cancelled sale
- **WHEN** a visit was marked incomplete and `POST /v1/sales/{id}/items` is sent for its sale
- **THEN** the response is 409 `invalid_transition` with `context.status` = 0 and no `context.correction_path`

#### Scenario: Cash on a cancelled sale
- **WHEN** a Cash payment of 8,000 with a new `Idempotency-Key` is sent for the sale of a visit that was marked incomplete
- **THEN** the response is 409 `invalid_transition` with `context.status` = 0 and no `context.correction_path`, and no payment row is created

#### Scenario: Direct database update of a finished sale
- **WHEN** `UPDATE sales SET total_amount = 9000` is run in SQL against the finished sale `B3-2026-OCT-00001`
- **THEN** the statement fails with SQLSTATE `P0001` and the message `finished_immutable`, and `total_amount` stays 10,000

#### Scenario: Direct database delete of a payment of a finished sale
- **WHEN** `DELETE FROM payments` is run in SQL for the Cash payment of `B3-2026-OCT-00001`
- **THEN** the statement fails with SQLSTATE `P0001` `finished_immutable`

#### Scenario: Direct database insert of a line into a cancelled sale
- **WHEN** an `INSERT INTO sale_items` is run in SQL for a sale in status 0 CANCELLED
- **THEN** the statement fails with SQLSTATE `P0001` `finished_immutable`

#### Scenario: The finished sale on screen
- **WHEN** Ko Aung reopens the sale `B3-2026-OCT-00001`
- **THEN** the screen shows the lock banner, the lines and payments as text, and no add, remove, pay or void control

### Requirement: Own sale needs no code; reading or checking out another barber's sale needs the sale codes (D-ROLE-03 · D-ROLE-07 · D-VIS-06 · D-PAY-07 · P4-RULE-03 · P4-RULE-20 · P4.SAL.02 · P4.RCP.01 · API-PERM-02 · API-PERM-03 · AD-PERM-05)

`GET /v1/sales/{id}` SHALL be allowed to the performer of a line, the visit recorder and the finisher, and to
holders of `sale.view` or any other `sale.*` code covering the sale's branch (branch level). Payment add,
payment void and FINISH SHALL be allowed to the performer, and otherwise only with `sale.finish_override`
covering the branch, FINISH then requiring `override_reason` (blank → 400 `reason_required`). The receipt of a
FINISHED sale (`GET /v1/sales/{id}/receipt`) SHALL be readable by any staff member whose read scope contains
the sale's branch, without a code. A caller inside the read scope without the right SHALL get 403 `forbidden`
with `context.required`; a single read from outside the read scope SHALL get 404 `not_found`. The app SHALL
show the pay and void controls only where `Sale.actions.take_payment` is true and Finish only where
`Sale.actions.finish` is true; where `Sale.actions.finish_needs_reason` is true the Finish step SHALL ask for
the reason in the reason dialog and send it as `override_reason`.

#### Scenario: A barber of another branch reads a B3 sale
- **WHEN** Ko Htet (Barber · B1) calls `GET /v1/sales/{id}` for Ko Aung's sale at B3
- **THEN** the response is 404 `not_found`

#### Scenario: A barber of another branch tries to take payment
- **WHEN** Ko Htet sends `POST /v1/sales/{id}/payments` (Cash 10,000, with an `Idempotency-Key`) for Ko Aung's B3 sale
- **THEN** the response is 403 `forbidden` with `context.required` = `sale.finish_override` and no payment row is created

#### Scenario: A colleague of the same branch reads amounts
- **WHEN** Ko Min calls `GET /v1/sales/{id}` for Ko Aung's sale at B3
- **THEN** the response is 403 `forbidden` with `context.required` = `sale.view`

#### Scenario: The branch manager reads
- **WHEN** Ma Hnin (Manager · B3, holds `sale.view`) calls `GET /v1/sales/{id}` for Ko Aung's finished sale `B3-2026-OCT-00001`
- **THEN** the response is 200 with the lines, the payments and `total_amount` = 10,000

#### Scenario: A colleague opens the receipt
- **WHEN** Ko Min calls `GET /v1/sales/{id}/receipt?format=pdf` for Ko Aung's finished sale at B3
- **THEN** the response is 200 `application/pdf`
- **AND** the same call by Ko Htet (B1) answers 404 `not_found`

#### Scenario: Finish for an absent barber without a reason
- **WHEN** Ma Hnin (holds `sale.finish_override` for B3) sends FINISH for Ko Aung's fully paid sale without `override_reason`
- **THEN** the response is 400 `reason_required` and the sale stays 1 OPEN

#### Scenario: Finish for an absent barber with a reason
- **WHEN** Ma Hnin opens the link of Ko Aung's fully paid sale of 10,000, where `actions.finish` and `actions.finish_needs_reason` are true, taps Finish and enters the reason "Ko Aung went home"
- **THEN** FINISH is sent with `override_reason` = "Ko Aung went home" and answers 200 with `finished_by` = Ma Hnin
- **AND** the line still shows the performer Ko Aung and the `sale.finish` audit row stores that reason

### Requirement: The receipt is English with fixed content (D-PAY-06 · D-PLT-03 · OPEN-32 · AD-RCPT-01 · P4.RCP.01 · P4-RULE-18)

The receipt of a sale SHALL be rendered in English whatever the user's UI language or the branch: labels from
the `en` language file, item descriptions from `description_en` falling back to `description_mm`. Top to
bottom it SHALL contain: the company name (no logo is printed in this change — no logo can be uploaded yet);
branch name, address and phone; the receipt number and the finish date
and time as `05/Oct/2026 10:42 AM`; the barber (the performer); the customer name when the sale has a
customer, with the phone only in the masked form `09•••••456`; each active line with quantity × unit price and
the line amount; subtotal and total; each non-voided payment with method, amount and the KBZPay reference; the
line "Change returned (cash)" with its amount and refund receipt number when an over-transfer was returned;
the footer with the branch's opening hours — consecutive weekdays with the same hours on one line, as
`Mon–Sun 9:00 AM – 9:00 PM` — and, when the setting has a value, the English value of
`receipt.thank_you_text`. On the 384 px print image the body text SHALL be at least 22 px high. `GET
/v1/sales/{id}/receipt?format=json` SHALL return the same data as `ReceiptView`.

#### Scenario: Split-payment receipt
- **WHEN** Ko Min's sale `B3-2026-OCT-00002` (Haircut 8,000 + Shave 3,000, Cash 5,000 + KBZPay 6,000 with reference `KBZ0001234567`, finished 05/Oct/2026 10:50 AM, no customer) is read with `format=json`
- **THEN** `number` = `B3-2026-OCT-00002`, `barbers` = ["Ko Min"], `lines` = Haircut 1 × 8,000 = 8,000 and Shave 1 × 3,000 = 3,000, `subtotal_amount` = 11,000, `total_amount` = 11,000
- **AND** `payments` = Cash 5,000 and KBZPay 6,000 with `reference` = `KBZ0001234567`, `change_returned` = null and `customer_name` = null
- **AND** `footer.opening_hours` = "Mon–Sun 9:00 AM – 9:00 PM" (B3 is open 9:00 AM – 9:00 PM every day in the fixture) and `footer.thank_you` = null

#### Scenario: Myanmar UI, English receipt
- **WHEN** Ko Aung uses the app in Myanmar and opens the PDF of `B3-2026-OCT-00001`
- **THEN** every label on the PDF is English and the total reads `10,000 Ks`

#### Scenario: Service without an English name
- **WHEN** a finished sale has a line whose `description_en` is null and `description_mm` is "ဆံပင်ညှပ်"
- **THEN** the receipt prints "ဆံပင်ညှပ်" for that line, correctly shaped

#### Scenario: Text size on the print image
- **WHEN** the 384 px PNG of `B3-2026-OCT-00002` is rendered
- **THEN** its item, total and payment lines use a font size of at least 22 px

#### Scenario: Customer on the receipt
- **WHEN** the sale has the customer Ma Su (`09 7712 3456`)
- **THEN** the receipt shows "Ma Su" and `09•••••456`, and never the full phone number

### Requirement: The receipt is rendered once, stored, and identical on every reopen (D-PAY-06 · D-PAY-07 · ADR-002 · ADR-013 · ADR-014 · P4-RULE-18 · P4.RCP.01 · P4.RCP.02 · AD-RCPT-02)

FINISH SHALL enqueue the job `receipt.render { entity_type: 'sales', entity_id }` inside its transaction (and
one more with `entity_type: 'refunds'` for an automatic change return), so a rolled-back FINISH leaves no job.
The job SHALL render the receipt on the server to a PDF and to a 1-bit PNG at the branch's
`receipt.printer_width_mm` (58 → 384 px, the default; 80 → 576 px), store both as attachments of the sale
(`uploaded_by` = the finisher) and do nothing when both already exist. `GET
/v1/sales/{id}/receipt?format=pdf|png` SHALL return the stored file; when the job has not run yet it SHALL
render and store through the same path, and exactly one stored PDF and one stored PNG SHALL exist per sale.
Every later request SHALL return the same bytes, also after the branch data, opening hours or thank-you text
change. `format=json` is built from the sale and the branch as they are now, so it MAY show newer branch data
than the stored PDF, which is the record. A sale that is not FINISHED SHALL answer 409 `invalid_transition`. A
render failure MUST NOT affect the finished sale. `GET /v1/refunds/{id}/receipt` SHALL serve the receipt of a
refund the same way (same formats, same storage, same read scope): the same template with the title "Refund",
the refund receipt number, the original receipt number, the method and the amount, and — for an automatic
change return — no item lines.

#### Scenario: Identical on reopen
- **WHEN** Ko Aung requests `GET /v1/sales/{id}/receipt?format=pdf` for `B3-2026-OCT-00001` at 10:43 AM and again at 4:00 PM
- **THEN** both responses carry the same bytes (equal SHA-256)

#### Scenario: Identical after the branch address changes
- **WHEN** the address of B3 is edited on 06/Oct/2026 and the PDF of `B3-2026-OCT-00001` is requested again
- **THEN** the response is the stored file of 05/Oct/2026 with the old address, byte for byte

#### Scenario: On-screen receipt after the branch address changes
- **WHEN** the address of B3 was edited on 06/Oct/2026 and `GET /v1/sales/{id}/receipt?format=json` is called for `B3-2026-OCT-00001`
- **THEN** `branch.address` is the new address, while `format=pdf` still returns the stored file with the old one

#### Scenario: Receipt of the automatic change return
- **WHEN** `GET /v1/refunds/{id}/receipt?format=json` is called by Ko Min for the change return `B3-RF-2026-OCT-00001` of the sale `B3-2026-OCT-00003`
- **THEN** `kind` = `refund`, `number` = `B3-RF-2026-OCT-00001`, `original_number` = `B3-2026-OCT-00003`, `lines` = [], `total_amount` = 2,000 and `payments` = Cash 2,000
- **AND** the same call by Ko Htet (B1) answers 404 `not_found`

#### Scenario: Opened before the job ran
- **WHEN** Ko Aung taps "View / share PDF" one second after FINISH while `receipt.render` is still queued
- **THEN** the request renders the PDF and the PNG, stores them and returns the PDF
- **AND** when the job runs afterwards it stores nothing, and the sale has exactly one PDF and one PNG attachment

#### Scenario: Job and request at the same moment
- **WHEN** the job and a `format=pdf` request for the same sale start at the same moment
- **THEN** exactly one PDF and one PNG are stored and both paths return or keep that same PDF

#### Scenario: PNG for the 58 mm printer
- **WHEN** `receipt.printer_width_mm` for B3 is 58 and `GET /v1/sales/{id}/receipt?format=png` is called
- **THEN** the response is an `image/png` 384 px wide with a 2-colour palette

#### Scenario: FINISH refused, no job
- **WHEN** a FINISH answers 422 `amount_mismatch`
- **THEN** no `receipt.render` job exists for that sale

#### Scenario: Renderer down
- **WHEN** all 3 attempts of `receipt.render` fail for `B3-2026-OCT-00001`
- **THEN** the sale stays 2 FINISHED with its number, and a later `format=pdf` request renders and stores the receipt on the fly

#### Scenario: Receipt of an open sale
- **WHEN** `GET /v1/sales/{id}/receipt` is called for a sale in status 1 OPEN
- **THEN** the response is 409 `invalid_transition`

### Requirement: The Finish step and the success screen (D-VIS-02 · D-PAY-06 · D-PAY-07 · AD-POS-07 · AD-POS-12 · AD-POS-13 · AD-GOAL-01 · AD-LAY-04 · AD-PWA-02 · AD-RCPT-02)

The checkout SHALL show the progress line "Services ✓ → Payment → Finish" and, once `remaining_amount` = 0,
the Finish step with the customer phone field already open and optional ("Skip"), and one primary button that
carries the total (`Finish · 10,000 Ks`). A Finish with the phone field empty SHALL finish the sale without a
customer. After FINISH the success screen SHALL show the receipt number, the total, the payments and the
performer, the button "View / share PDF" on every device and the primary button "Next customer" (→ Today),
and MUST NOT redirect by itself. "Print receipt" SHALL be shown only where the shell reports
`canBluetoothPrint`; no device reports it in this change.

#### Scenario: Seven taps, customer skips the phone
- **WHEN** Ko Aung taps ＋ Start → Walk-in → the Haircut chip → Start → "Service done · Take payment" → Cash → "Finish · 10,000 Ks" with the phone field left empty
- **THEN** the sale is finished after those 7 taps with `customer` = null and `receipt_number` = `B3-2026-OCT-00001`
- **AND** the success screen shows `B3-2026-OCT-00001`, "10,000 Ks", "Cash 10,000 Ks", the performer chip "Ko Aung", "View / share PDF" and "Next customer"

#### Scenario: PDF on an iPhone
- **WHEN** Ko Thura (Barber · B2, iPhone, Safari PWA) finishes a Haircut of 7,000 and taps "View / share PDF"
- **THEN** the PDF of that receipt opens in the share sheet
- **AND** no "Print receipt" button is shown

#### Scenario: PDF on an Android phone
- **WHEN** Ko Aung (Android, Chrome) taps "View / share PDF" on the success screen of `B3-2026-OCT-00001`
- **THEN** the same PDF opens in the share sheet or the viewer, and no "Print receipt" button is shown

#### Scenario: No automatic redirect
- **WHEN** the success screen has been open for 60 seconds without a tap
- **THEN** it is still shown; Today opens only after "Next customer" is tapped

### Requirement: POS actions leave an audit trail (D-AUD-01 · D-AUD-02 · API-AUD-01 · P4-RULE-21)

Each action of this flow SHALL write one application audit row (`source` 1 APP) with the actor, the branch of
the visit or sale and the reason where one was given, under the actions `visit.start`, `visit.complete`,
`visit.incomplete`, `sale.item_add`, `sale.item_remove`, `payment.add`, `payment.void` and `sale.finish`
(with `override_reason` when a non-performer finished). Every insert or update of `sales`, `sale_items`,
`payments` and `refunds` SHALL also produce a database-trigger audit row (`source` 2 DB_TRIGGER) attributed
to the same user. An idempotent replay (200 with `Idempotent-Replayed: true`) and a repeat that changes
nothing (COMPLETE, INCOMPLETE or FINISH answering 200 with the unchanged state) SHALL write no audit row.

#### Scenario: Walk-in cash
- **WHEN** Ko Aung runs START → add Haircut → COMPLETE → Cash 10,000 → FINISH at B3
- **THEN** `audit_events` holds the app rows `visit.start`, `sale.item_add`, `visit.complete`, `payment.add` and `sale.finish`, each with actor Ko Aung and `branch_id` = B3
- **AND** the sale's insert and its change to status 2 each have a `source` 2 row with `entity_type` = `sales`

#### Scenario: Double tap on Finish writes one row
- **WHEN** FINISH is sent twice for the same fully paid sale
- **THEN** `audit_events` holds exactly one `sale.finish` app row for that sale

#### Scenario: A replayed START writes no second row
- **WHEN** START with key `K1` answered 201 and is replayed with `K1` (200, `Idempotent-Replayed: true`)
- **THEN** `audit_events` holds exactly one `visit.start` app row for that visit

#### Scenario: Void with a reason
- **WHEN** Ko Min voids a Cash 5,000 payment with the reason "Customer pays by KBZPay instead"
- **THEN** one `payment.void` app row stores that reason, the actor Ko Min and `branch_id` = B3

#### Scenario: Incomplete with a reason
- **WHEN** Ko Aung marks a visit incomplete with the reason "Started by mistake"
- **THEN** one `visit.incomplete` app row stores that reason
