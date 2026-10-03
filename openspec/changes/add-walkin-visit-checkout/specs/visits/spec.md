## Purpose

Visits record the service itself: a barber starts a walk-in on their own phone, adds the services, marks the
service done or incomplete, and sees unfinished work first on Today. This delta covers the walk-in path only.

## ADDED Requirements

### Requirement: Today lists the barber's open visits first (AD-TODAY-01 · AD-TODAY-02 · AD-STATE-01 · AD-STATE-02 · AD-STATE-03 · AD-STATE-05 · AD-CMP-05 · P4.VIS.02 · D-VIS-07)

The Today screen (`/today`) SHALL list the caller's open visits — status 1 STARTED and 2 COMPLETED, of any
date, where the caller is the performer or the recorder — read from `GET /v1/me/visits?status=1&status=2`,
ordered oldest `started_at` first, above every other section. Each card SHALL show the customer name or
"Walk-in", the active service names, the time elapsed since `started_at`, the status badge (1 STARTED →
"In service", info tone · 2 COMPLETED → "Awaiting payment", warning tone) and exactly one next action
("Service done" for STARTED, "Take payment" for COMPLETED). The Today tab badge SHALL show the number of
open visits. The app bar SHALL show the date as `Mon, 05/Oct/2026` and the branch chip. The endpoint needs no
permission code (self) and never returns another person's visits.

#### Scenario: Two open visits, oldest first
- **WHEN** Ko Aung opens Today at 10:05 AM on Monday 05/Oct/2026 at B3 with visit A (STARTED 9:20 AM, Haircut) and visit B (STARTED 9:40 AM, COMPLETED 10:00 AM, Shave, sale OPEN)
- **THEN** the "In progress" section lists A first, then B
- **AND** card A shows "Walk-in", "Haircut", "45 min", the badge "In service" and the action "Service done"
- **AND** card B shows "Walk-in", "Shave", "25 min", the badge "Awaiting payment" in the warning tone and the action "Take payment"
- **AND** the Today tab badge shows 2

#### Scenario: No open visit
- **WHEN** Ko Min opens Today and `GET /v1/me/visits?status=1&status=2` returns `{ "items": [] }`
- **THEN** the section shows the empty state with the title of key `today.empty.title`, the body of key `today.empty.body` and the action ＋ Start
- **AND** the Today tab shows no badge

#### Scenario: A colleague's visit is not listed
- **WHEN** Ko Aung has visit A STARTED at B3 and Ko Min, who neither performs nor recorded it, calls `GET /v1/me/visits?status=1&status=2`
- **THEN** the response is 200 and visit A is not in `items`

#### Scenario: The list fails to load
- **WHEN** the request for Today's visits answers 500 with `request_id` `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** the section shows the error state with a Retry button and the short error ID `0199a3f2` (the first 8 characters of that `request_id`)
- **AND** no blank page and no centred spinner is shown

#### Scenario: No connection
- **WHEN** Ko Aung's phone loses the network while Today is open, and he then taps Start on the START sheet
- **THEN** the persistent top banner shows the text of key `common.offline.banner`
- **AND** the START request and the saved-check lookup both fail, the sheet stays open with its input and shows the inline alert of key `pos.saved.notSaved` with a Retry button
- **AND** nothing is sent again until he taps Retry, which sends the same request with the same `Idempotency-Key`

### Requirement: POS screens show confirmed server state without realtime (AD-PERF-03 · AD-PERF-04 · AD-RT-01 · ADR-008 · API-RT-02)

Until the realtime gateway exists, Today, the visit screen and checkout SHALL fetch visit and sale data fresh
(a) when the screen opens, (b) when the app or browser tab regains focus, (c) when the network reconnects and
(d) after every mutation of that visit or sale. A visit, line, payment or status change MUST NOT be displayed
as done before the server's response confirms it.

#### Scenario: A change made elsewhere appears on focus
- **WHEN** Ko Aung's phone shows visit A as "In service" and at 10:10 AM Ma Hnin marks visit A incomplete from her own session, and Ko Aung then switches back to the app at 10:12 AM
- **THEN** Today refetches `GET /v1/me/visits?status=1&status=2` on focus and card A disappears
- **AND** between 10:10 AM and 10:12 AM the card stays as it was (no push in this change)

#### Scenario: START is not shown before the server answers
- **WHEN** Ko Aung taps Start at 10:05 AM and the response has not arrived yet
- **THEN** the Start button shows an inline spinner and is disabled
- **AND** no new card appears on Today until the 201 response is received

#### Scenario: An action on a stale screen is decided by the server
- **WHEN** Ko Aung's checkout for visit A is still open after visit A was marked incomplete elsewhere, and he taps Cash
- **THEN** the API answers 409 `invalid_transition` with `context.status` = 0
- **AND** the screen reloads the sale and shows it read-only as cancelled

### Requirement: START records a walk-in with the barber and the branch only (D-VIS-01 · D-VIS-02 · D-VIS-11 · D-AUTH-07 · D-ROLE-07 · P4.VIS.03 · P4-RULE-02 · AD-POS-01 · AD-POS-02 · AD-POS-03 · AD-TODAY-03 · AD-GOAL-05)

`POST /v1/visits` SHALL be open to any signed-in staff member whose read scope contains `branch_id`, without a
permission code; a `branch_id` outside the caller's read scope SHALL answer 403 `out_of_scope`. The performer
SHALL be the caller's own employee, who MUST be ACTIVE and assigned to that branch on the visit date (else 422
`not_assigned_to_branch`). In one transaction the API SHALL insert the visit (status 1 STARTED, `location_type`
1 BRANCH, `booking_id` null, `proxy_reason` null, `started_by_user_id` = the caller, `started_at` = server time,
`business_date` = the Myanmar-time date of `started_at`) and its sale (status 1 OPEN, the same `branch_id`,
no customer) and answer 201 `Visit` with its `sale`. The request carries no customer field. `items[]` is
optional; each `{ service_id }` becomes a SERVICE line priced like any other line. The START sheet SHALL show
the branch taken from the Today branch chip and the performer chip (the caller) above the Start button, and
SHALL fit on one mobile screen of 360 × 640 px without scrolling.

#### Scenario: Ko Aung starts a walk-in
- **WHEN** Ko Aung (Barber · B3) sends `POST /v1/visits` with `{ "branch_id": "<B3>" }` and an `Idempotency-Key` at `2026-10-05T10:05:00+06:30`
- **THEN** the response is 201 with `status` = 1, `performed_by` = Ko Aung, `started_by` = Ko Aung, `proxy_reason` = null, `location_type` = 1, `booking_id` = null, `business_date` = `2026-10-05`
- **AND** `sale.status` = 1, `sale.customer` = null, `sale.items` = [] and `sale.total_amount` = 0

#### Scenario: First service chosen on the START sheet
- **WHEN** Ko Aung taps the Haircut chip and then Start, sending `{ "branch_id": "<B3>", "items": [{ "service_id": "<Haircut>" }] }`
- **THEN** the visit is created with one SERVICE line "Haircut" at `unit_price_amount` = 10,000 (Ko Aung's barber price at B3)
- **AND** `sale.subtotal_amount` = 10,000 and `sale.total_amount` = 10,000
- **AND** no reason is asked for this first service

#### Scenario: A barber of another branch cannot start at B3
- **WHEN** Ko Htet (Barber · B1) sends `POST /v1/visits` with `branch_id` = B3
- **THEN** the response is 403 `out_of_scope`
- **AND** no visit and no sale row is created

#### Scenario: Performer no longer assigned to the branch
- **WHEN** Ko Min's branch assignment to B3 ended on 04/Oct/2026 (`employee_branches.effective_to` = `2026-10-04`) while his role grant still covers B3, and he sends START for B3 on 05/Oct/2026
- **THEN** the response is 422 `not_assigned_to_branch`
- **AND** no visit and no sale row is created

#### Scenario: The START sheet shows where and who
- **WHEN** Ko Aung taps ＋ Start and then "Walk-in" on a 360 × 640 px screen, in Myanmar and in English, with the branch chip on "Point 3.0"
- **THEN** the sheet shows the branch "Point 3.0", the performer chip "Ko Aung", the service chips and the Start button without scrolling and without clipped text
- **AND** no customer name or phone field is shown

### Requirement: The START sheet offers the first six simple services in catalogue order (AD-POS-03 · AD-POS-05 · P2.SVC.01 · D-VIS-02)

The START sheet SHALL show as chips the first 6 simple services (`pricing_mode` 1) sold at the branch, in
catalogue order — category order, then service order — as `GET /v1/services?branch_id=&pricing_mode=1`
returns them; a branch with fewer than 6 shows them all. The service picker SHALL offer a search field and
the categories, and SHALL NOT have a "Frequent here" section. No usage ranking is computed.

#### Scenario: Three services at B3
- **WHEN** Ko Aung opens the START sheet at B3, where Haircut, Shave and Hair wash are sold in that catalogue order
- **THEN** the chips are Haircut, Shave, Hair wash, in that order

#### Scenario: Seven services, six chips
- **WHEN** a branch sells seven simple services
- **THEN** the START sheet shows the first six in catalogue order as chips
- **AND** the seventh is offered only in the service picker

#### Scenario: An option service is not a chip
- **WHEN** a service with `pricing_mode` 2 OPTIONS is sold at the branch
- **THEN** it is not among the chips

#### Scenario: The picker has no "Frequent here" section
- **WHEN** Ko Min taps "＋ Add service" on the visit screen at B3
- **THEN** the picker shows the search field and the category "Services" with Haircut, Shave and Hair wash, and no section named "Frequent here"

### Requirement: Without a connection the app points to paper and Late entry (AD-STATE-05 · D-VIS-13 · D-PLT-20)

While the offline banner is shown, its help link SHALL open `/help/offline`, which tells the barber to write
the service on paper and that it is entered with Late entry. The app MUST NOT queue a visit, a payment or a
FINISH for later sending, and MUST NOT describe any other way of entering a missed service.

#### Scenario: The help page
- **WHEN** Ko Aung taps the help link of the offline banner
- **THEN** `/help/offline` opens with the text of key `pos.help.offline.body`: write the service on paper; it is entered with Late entry
- **AND** the page offers no form and no button that records a visit

#### Scenario: Nothing is sent when the connection returns
- **WHEN** Ko Aung tapped Start while offline, the request failed, and the connection returns 2 minutes later without a tap on Retry
- **THEN** no START request is sent and no visit exists

### Requirement: START is idempotent on its Idempotency-Key (D-VIS-10 · API-IDEM-01 · API-IDEM-02 · P4-RULE-22 · AD-NET-01)

`POST /v1/visits` SHALL require the header `Idempotency-Key` (a UUID; missing → 400
`idempotency_key_required`) and store it as `client_request_id` on both the visit and its sale. A repeat with
the same key SHALL answer 200 with the same visit and the header `Idempotent-Replayed: true`; a repeat that
arrives while the first request is still running SHALL answer 409 `idempotency_in_progress`; a repeat whose
identifying fields `branch_id`, `booking_id` or `performed_by_employee_id` differ from the stored visit SHALL
answer 422 `idempotency_mismatch`. The app SHALL create one key per tap on Start, keep it across retries of
that tap and disable the button while the request is in flight.

#### Scenario: Second request while the first is still running
- **WHEN** Ko Aung's first `POST /v1/visits` with key `K1` for B3 is still inside its transaction and a second request with `K1` arrives
- **THEN** the second request answers 409 `idempotency_in_progress`
- **AND** after the first request answers 201, exactly one visit and one sale exist with `client_request_id` = `K1`

#### Scenario: Second request after the first has answered
- **WHEN** the first START with key `K1` answered 201 and the same request with `K1` is sent again 200 ms later (double tap)
- **THEN** the response is 200 with `Idempotent-Replayed: true` and the same visit `id`
- **AND** still exactly one visit and one sale exist with `client_request_id` = `K1`

#### Scenario: Lost reply, then retry
- **WHEN** the first START with key `K1` was committed at 10:05 AM but its reply was lost, and the app sends the same request with `K1` again
- **THEN** the response is 200 with `Idempotent-Replayed: true` and the visit started at `2026-10-05T10:05:00+06:30`
- **AND** Ko Aung still has exactly one visit from that tap

#### Scenario: Same key, different branch
- **WHEN** U Kyaw Zin (assigned to every branch) started a visit at B3 with key `K2` and the same key `K2` is sent with `branch_id` = B1
- **THEN** the response is 422 `idempotency_mismatch`
- **AND** no visit is created at B1

#### Scenario: Key missing
- **WHEN** `POST /v1/visits` is sent without the `Idempotency-Key` header
- **THEN** the response is 400 `idempotency_key_required`

### Requirement: A completed, unpaid visit blocks the performer's next START (D-VIS-07 · P4-RULE-02 · P4.VIS.03 · AD-POS-04 · AD-TODAY-02)

START SHALL be refused with 422 `unpaid_visit_open` and `context.visit_id` when the performer has a visit in
status 2 COMPLETED whose sale is still 1 OPEN. Any number of visits in status 1 STARTED SHALL be allowed for
the same performer. The app SHALL show the message of key `error.unpaid_visit_open` ("Finish payment for your
previous customer first") with a link to that visit: the app reads `GET /v1/visits/{visit_id}` and opens the
screen of its sale (`/sales/<sale id>`).

#### Scenario: Two customers in service at once
- **WHEN** Ko Aung has visit A in status 1 STARTED since 9:20 AM and starts another walk-in at 9:40 AM
- **THEN** the response is 201 and Ko Aung has two visits in status 1 STARTED

#### Scenario: Awaiting payment blocks the next customer
- **WHEN** Ko Aung's visit B is 2 COMPLETED since 10:00 AM with its sale OPEN and he sends START at 10:05 AM
- **THEN** the response is 422 `unpaid_visit_open` with `context.visit_id` = the id of visit B
- **AND** the screen shows "Finish payment for your previous customer first" with a link that opens the checkout of visit B (`/sales/<id of B's sale>`)

#### Scenario: Unblocked after FINISH
- **WHEN** visit B is finished at 10:07 AM and Ko Aung sends START at 10:08 AM
- **THEN** the response is 201

#### Scenario: Unblocked after INCOMPLETE
- **WHEN** visit B is marked incomplete with the reason "Customer left without paying" and Ko Aung sends START afterwards
- **THEN** the response is 201

#### Scenario: Another barber is not blocked
- **WHEN** Ko Aung's visit B is COMPLETED and unpaid and Ko Min sends START at B3
- **THEN** Ko Min's response is 201

### Requirement: Service lines are priced by the server and snapshotted (D-SVC-03 · D-SVC-04 · D-SVC-08 · API-DATA-07 · P4.SAL.04 · P4-RULE-04 · P4-RULE-05 · AD-POS-04 · AD-POS-05)

`POST /v1/sales/{id}/items` with `{ "line_type": 1, "service_id": … }` SHALL add a SERVICE line only while the
sale is 1 OPEN. The request has no price field: `list_price_amount` and `unit_price_amount` SHALL both be the
price quote for (the sale's branch, location 1 BRANCH, the visit performer, the visit business date). The line
SHALL store `description_mm`, `description_en`, `quantity` = 1 and `performed_by_employee_id` = the visit
performer, and a later change of the price or the service name MUST NOT alter the stored line. A service not
sold at the branch SHALL answer 422 `not_sold_here`, an inactive service 422 `service_inactive`, a service in
an inactive category 422 `category_inactive`, and an option service sent without a variant 422
`variant_required`. The response SHALL be 200 `Sale` with recomputed totals.

#### Scenario: Branch price for Ko Min
- **WHEN** Ko Min adds Haircut to his OPEN sale at B3 on 05/Oct/2026
- **THEN** the line has `list_price_amount` = 8,000 and `unit_price_amount` = 8,000, `quantity` = 1, `performed_by` = Ko Min and `description_en` = "Haircut"

#### Scenario: Barber price for Ko Aung
- **WHEN** Ko Aung adds Haircut to his OPEN sale at B3 on 05/Oct/2026
- **THEN** the line has `unit_price_amount` = 10,000 (the barber price beats the B3 branch price 8,000)

#### Scenario: Second service
- **WHEN** Ko Min's sale has Haircut 8,000 and he adds Shave
- **THEN** the Shave line has `unit_price_amount` = 3,000
- **AND** `subtotal_amount` = 11,000 (8,000 + 3,000) and `total_amount` = 11,000

#### Scenario: A price sent by the client has no effect
- **WHEN** the request body is `{ "line_type": 1, "service_id": "<Haircut>", "unit_price_amount": 1 }` on Ko Min's sale
- **THEN** the line is stored with `unit_price_amount` = 8,000

#### Scenario: The snapshot survives a later price change
- **WHEN** Ko Min added Haircut at 8,000 on 05/Oct/2026 and the B3 Haircut price becomes 9,000 effective 06/Oct/2026
- **THEN** the stored line and the sale total stay at 8,000

#### Scenario: Service not sold at this branch
- **WHEN** Hair wash is switched off at B3 (`branch_services.status` = 0) and Ko Min tries to add it
- **THEN** the response is 422 `not_sold_here` and no line is added

### Requirement: A service outside the barber's eligibility is recorded with a warning (D-EMP-05 · P4-RULE-04 · P2-RULE-06 · P4.SAL.04)

For a visit at the branch (location 1 BRANCH), a SERVICE line whose performer has no eligibility row for that
service at that branch on the visit date SHALL still be recorded, and the response SHALL carry a `warnings[]`
entry with `code` = `not_eligible`. Eligibility MUST NOT block a walk-in line.

#### Scenario: Not eligible, still recorded
- **WHEN** Ko Min's eligibility for Shave at B3 ended on 04/Oct/2026 and he adds Shave to his sale on 05/Oct/2026
- **THEN** the response is 200, the Shave line exists at 3,000 and `warnings` contains `{ "code": "not_eligible" }`

#### Scenario: Eligible, no warning
- **WHEN** Ko Min is eligible for Haircut at B3 on 05/Oct/2026 and adds Haircut
- **THEN** the response is 200 and `warnings` is empty

### Requirement: Removing a line, or adding one after COMPLETE, needs a reason (D-VIS-05 · D-DAT-05 · P4.SAL.04 · P4.SAL.06 · P4-RULE-04 · API-DATA-11 · AD-POS-04 · AD-RSN-01 · AD-RSN-02)

`POST /v1/sales/{id}/items/{item_id}/remove` SHALL require `{ "reason": … }` (1–1,000 characters; blank → 400
`reason_required`; longer → 400 `validation`) and SHALL keep the row with `removed_at`, `removed_by_user_id` and `removed_reason`,
excluding it from the totals; the screen SHALL keep the line visible, struck through. Removing the last active
SERVICE line of a visit in status 2 COMPLETED SHALL answer 422 `service_required`. The reason dialog's result
is sent in the field the endpoint defines: `reason` for a removal, `added_reason` for an added service. A SERVICE line added to a
walk-in visit before COMPLETE needs no reason; a SERVICE line added after COMPLETE SHALL require
`added_reason` (blank → 400 `reason_required`).

#### Scenario: Remove a line with a reason
- **WHEN** Ko Aung's OPEN sale has Haircut 10,000 + Shave 3,000 + Hair wash 2,000 (total 15,000) and he removes Hair wash with the reason "Customer changed his mind"
- **THEN** the Hair wash row stays with `removed_at`, `removed_by` = Ko Aung and `removed_reason` = "Customer changed his mind"
- **AND** `total_amount` = 13,000 (10,000 + 3,000) and the line is shown struck through

#### Scenario: Remove without a reason
- **WHEN** the remove request is sent with `reason` = ""
- **THEN** the response is 400 `reason_required` and the line stays active

#### Scenario: Reason at the length limit
- **WHEN** a line is removed with a reason of exactly 1,000 characters
- **THEN** the response is 200 and the reason is stored unchanged

#### Scenario: Reason one character too long
- **WHEN** a line is removed with a reason of 1,001 characters
- **THEN** the response is 400 `validation` naming the field `reason` and the line stays active

#### Scenario: The last service of a completed visit cannot be removed
- **WHEN** Ko Min's visit is 2 COMPLETED with one active line, Haircut 8,000, and he tries to remove it with a reason
- **THEN** the response is 422 `service_required` and the line stays active

#### Scenario: Service added after "Service done"
- **WHEN** Ko Min's visit is 2 COMPLETED with Haircut 8,000 and he adds Shave with `added_reason` = "Customer asked for a shave at the counter"
- **THEN** the response is 200, the Shave line stores that `added_reason` and `total_amount` = 11,000 (8,000 + 3,000)

#### Scenario: Service added after COMPLETE without a reason
- **WHEN** the same add is sent without `added_reason`
- **THEN** the response is 400 `reason_required` and `total_amount` stays 8,000

### Requirement: COMPLETE needs at least one service (D-VIS-02 · D-VIS-03 · P4.VIS.05 · P4-RULE-11 · AD-POS-04)

`POST /v1/visits/{id}/complete` SHALL move a visit from 1 STARTED to 2 COMPLETED only when its sale has at
least one active SERVICE line (else 422 `service_required`), setting `completed_at` = server time and
`completed_by_user_id` = the caller. A repeat on a COMPLETED visit SHALL answer 200 with the unchanged state; on
a visit in status 3 FINISHED or 0 INCOMPLETE it SHALL answer 409 `invalid_transition` with `context.status`.
The visit screen SHALL offer one primary action, "Service done · Take payment", which records COMPLETE and
opens checkout; it SHALL offer no "pay later" action.

#### Scenario: Service done
- **WHEN** Ko Aung's visit started at 10:05 AM has Haircut 10,000 and he taps "Service done · Take payment" at 10:40 AM
- **THEN** the visit has `status` = 2, `completed_at` = `2026-10-05T10:40:00+06:30`, `completed_by` = Ko Aung
- **AND** the checkout opens showing the total 10,000 Ks

#### Scenario: No service yet
- **WHEN** Ko Min's visit has no line and he sends COMPLETE
- **THEN** the response is 422 `service_required` and the visit stays 1 STARTED

#### Scenario: Only a removed line
- **WHEN** Ko Min's visit has one line, Haircut, that was removed with a reason, and he sends COMPLETE
- **THEN** the response is 422 `service_required`

#### Scenario: Repeat
- **WHEN** COMPLETE is sent again at 10:41 AM for the visit completed at 10:40 AM
- **THEN** the response is 200 and `completed_at` is still `2026-10-05T10:40:00+06:30`

### Requirement: INCOMPLETE closes a visit that will not be paid (D-VIS-09 · D-DAT-05 · P4.VIS.06 · P4-RULE-11 · P7-RULE-02 · API-DATA-11 · AD-POS-04 · AD-RSN-02)

`POST /v1/visits/{id}/incomplete` with `{ "reason": … }` SHALL be allowed from status 1 STARTED or 2 COMPLETED
while the sale is 1 OPEN. A blank reason SHALL answer 400 `reason_required`; a sale that still holds a
non-voided payment SHALL answer 422 `payments_exist`. On success the visit SHALL become 0 INCOMPLETE
(`incomplete_at`, `incomplete_by_user_id`, `incomplete_reason`) and its sale 0 CANCELLED (`cancelled_at`); no
receipt number is assigned and no day lock is taken. A repeat SHALL answer 200 with the unchanged state; on a
visit in status 3 FINISHED it SHALL answer 409 `invalid_transition` with `context.status` = 3. The action sits
behind the kebab "Mark incomplete" on the visit screen and uses the reason dialog.

#### Scenario: Started by mistake
- **WHEN** Ko Aung marks the visit he started at 10:05 AM incomplete at 10:06 AM with the reason "Started by mistake"
- **THEN** the visit has `status` = 0 and `incomplete_reason` = "Started by mistake", and its sale has `status` = 0 with `cancelled_at` set and `receipt_number` = null
- **AND** the visit no longer appears on Today

#### Scenario: Customer leaves after the service without paying
- **WHEN** Ko Aung's visit is 2 COMPLETED with Haircut 10,000, no payment, and he marks it incomplete with the reason "Customer left without paying"
- **THEN** the response is 200 with visit `status` = 0 and sale `status` = 0
- **AND** his next START is accepted

#### Scenario: Payment still on the sale
- **WHEN** the sale holds a non-voided Cash payment of 5,000 and Ko Aung sends INCOMPLETE with a reason
- **THEN** the response is 422 `payments_exist` and nothing changes

#### Scenario: No reason
- **WHEN** INCOMPLETE is sent with `reason` = ""
- **THEN** the response is 400 `reason_required`

#### Scenario: A finished visit cannot be marked incomplete
- **WHEN** INCOMPLETE is sent with a reason for the visit of the finished sale `B3-2026-OCT-00001`
- **THEN** the response is 409 `invalid_transition` with `context.status` = 3 and nothing changes

#### Scenario: No receipt number is consumed
- **WHEN** the last receipt at B3 is `B3-2026-OCT-00001`, a visit is then marked incomplete and the next sale at B3 is finished
- **THEN** that sale gets `B3-2026-OCT-00002`

### Requirement: The visit and checkout screens keep the context visible (AD-POS-04 · AD-POS-06 · AD-POS-07 · AD-POS-11 · AD-GOAL-02 · AD-CMP-09)

The visit screen and every step of checkout SHALL keep a sticky header with the customer name or "Walk-in",
the performer chip, the branch name, the start time and the elapsed time. Every service line SHALL show the
service name, its price, its duration and the performer chip. The header MUST stay visible while the barber
scrolls the lines, takes payments and reaches the Finish step.

#### Scenario: Header and line of a walk-in
- **WHEN** Ko Aung started a walk-in at B3 at 10:05 AM with Haircut and looks at the visit screen at 10:20 AM
- **THEN** the sticky header shows "Walk-in", the chip "Ko Aung", "Point 3.0", "10:05 AM" and "15 min"
- **AND** the line shows "Haircut", "10,000 Ks", "30 min" and the chip "Ko Aung"

#### Scenario: The header stays through checkout
- **WHEN** Ko Aung taps "Service done · Take payment" at 10:40 AM, records Cash and reaches the Finish step
- **THEN** the same header (Walk-in · Ko Aung · Point 3.0 · 10:05 AM) is visible on the payment section and on the Finish step

#### Scenario: Two lines, performer on each
- **WHEN** Ko Min's sale has Haircut 8,000 and Shave 3,000
- **THEN** both lines show the chip "Ko Min"

### Requirement: Own visits need no code; acting on another barber's visit needs the visit codes (D-ROLE-03 · D-ROLE-07 · D-VIS-04 · P4-RULE-03 · P4.VIS.04 · API-PERM-02 · API-PERM-03 · AD-PERM-02)

`GET /v1/visits/{id}` SHALL be allowed to the visit's performer and recorder and to the finisher of its sale,
and to holders of `visit.view` or any other `visit.*` code covering the visit's branch (branch level). Line add, line remove and COMPLETE SHALL
be allowed to the performer and the recorder, and otherwise only with `visit.update` covering the branch.
INCOMPLETE SHALL be allowed to the performer, and otherwise only with `visit.delete` covering the branch. A
caller inside the read scope who is neither SHALL get 403 `forbidden` with `context.required` = the code that
would allow it; a single read from outside the read scope SHALL get 404 `not_found`. The app SHALL show the
line and COMPLETE controls only where `Sale.actions.edit_lines` is true and "Mark incomplete" only where
`Sale.actions.mark_incomplete` is true.

#### Scenario: A colleague of the same branch reads
- **WHEN** Ko Min calls `GET /v1/visits/{id}` for Ko Aung's visit at B3
- **THEN** the response is 403 `forbidden` with `context.required` = `visit.view`

#### Scenario: A barber of another branch reads
- **WHEN** Ko Htet (B1) calls `GET /v1/visits/{id}` for a B3 visit
- **THEN** the response is 404 `not_found`

#### Scenario: The branch manager reads
- **WHEN** Ma Hnin (Manager · B3, holds `visit.view`) calls `GET /v1/visits/{id}` for Ko Aung's visit
- **THEN** the response is 200 with the visit and its sale

#### Scenario: A colleague tries to add a line
- **WHEN** Ko Min sends `POST /v1/sales/{id}/items` for Ko Aung's OPEN sale
- **THEN** the response is 403 `forbidden` with `context.required` = `visit.update` and no line is added

#### Scenario: A manager of another branch
- **WHEN** Ko Zaw (Manager · B1, `visit.update` for B1 only) sends `POST /v1/sales/{id}/items` for a B3 sale
- **THEN** the response is 403 `forbidden` and no line is added

#### Scenario: Controls follow the actions of the sale
- **WHEN** Ko Min opens the link of Ko Aung's sale and the API answers 403 `forbidden`
- **THEN** the screen shows the forbidden state and no line, COMPLETE or incomplete control

#### Scenario: The branch manager closes an abandoned visit
- **WHEN** Ko Aung has gone home leaving a COMPLETED, unpaid visit and Ma Hnin (holds `visit.delete` for B3) sends INCOMPLETE with the reason "Barber left, customer did not pay"
- **THEN** the response is 200 with visit `status` = 0 and `incomplete_by` = Ma Hnin

### Requirement: "Was it saved?" is answered by the client request id (AD-NET-02 · P4.REQ.01 · API-IDEM-02 · P4-RULE-22)

`GET /v1/me/requests/{client_request_id}` SHALL answer 200 `{ client_request_id, resource_type, id, sale_id,
visit_id }` when the caller created a visit (`resource_type` = `visit`) or a payment (`resource_type` =
`payment`) with that key, and 404 `not_found` when nothing was saved with it or the row was created by another
user. When START or a payment has had no answer for about 15 seconds, the app SHALL show "Checking whether it
was saved…", call this lookup, show the saved record as success on 200, and on 404 offer Retry with the same
key. The app MUST NOT resubmit a money action with a new key by itself.

#### Scenario: START was saved, the reply was lost
- **WHEN** Ko Aung's START with key `K1` gets no answer for 15 seconds and the app calls `GET /v1/me/requests/K1`
- **THEN** the response is 200 with `resource_type` = `visit`, `id` = the visit id and `sale_id` = its sale id
- **AND** the app opens that visit as started, without sending START again

#### Scenario: Payment was not saved
- **WHEN** a Cash payment with key `K7` gets no answer for 15 seconds and `GET /v1/me/requests/K7` answers 404
- **THEN** the app offers Retry, and the retry sends the same payment with key `K7`
- **AND** the retry answers 201 and the sale holds exactly one payment from that tap

#### Scenario: Someone else's key
- **WHEN** Ko Min calls `GET /v1/me/requests/K1` for the key of Ko Aung's START
- **THEN** the response is 404 `not_found`
