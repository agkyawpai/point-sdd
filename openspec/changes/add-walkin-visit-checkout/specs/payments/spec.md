## Purpose

Payments record the money a sale receives before FINISH: cash, KBZPay with its reference, split payments, the
change of an over-transfer, and the void of a wrong entry. This delta covers payments on an OPEN walk-in sale.

## ADDED Requirements

### Requirement: Checkout offers the active payment methods, Cash first (D-PAY-01 · D-PAY-02 · P4.PMT.01 · P4-RULE-19 · P4-RULE-20 · AD-POS-08 · AD-CMP-02)

The base seed, which runs in every environment, SHALL contain the two system payment methods: CASH (kind 1
CASH, `is_cash` true, no reference) and KBZPAY (kind 2 MOBILE_WALLET, `requires_reference` true,
`requires_verification` true, `reference_regex` empty until the owner supplies the pattern); running the seed
again SHALL create no second row. `GET /v1/payment-methods` SHALL return to any signed-in staff member,
without a permission code, the payment methods that are ACTIVE (status 1) and not archived, in `sort_order`.
The checkout SHALL show large buttons (≥ 72 px tall) in this order: Cash, KBZPay, "Split", then any other
active method.

#### Scenario: A fresh database without fixtures
- **WHEN** the base seed has run on an empty database and no fixture seed was loaded
- **THEN** `payment_methods` holds exactly CASH (`is_cash` = true) and KBZPAY (`requires_reference` = true, `requires_verification` = true, `reference_regex` = null), both ACTIVE
- **AND** a second run of the base seed leaves two rows

#### Scenario: The two system methods at checkout
- **WHEN** Ko Aung opens checkout at B3
- **THEN** `GET /v1/payment-methods` returns CASH then KBZPAY, and the screen shows the buttons Cash, KBZPay, Split in that order

#### Scenario: A third active method comes after Split
- **WHEN** a third method "Wave" exists with `status` = 1 and `sort_order` = 3
- **THEN** the buttons are Cash, KBZPay, Split, Wave

#### Scenario: An inactive method is not offered
- **WHEN** a third method exists with `status` = 0 INACTIVE
- **THEN** it is not in the response for Ko Aung and has no button

### Requirement: Payments are added to an OPEN sale until nothing remains (D-PAY-01 · D-VIS-07 · P4.PAY.02 · P4-RULE-09 · AD-POS-08 · AD-FORM-11 · AD-A11Y-04)

`POST /v1/sales/{id}/payments` with `{ payment_method_id, amount, external_reference? }` SHALL add a payment
only while the sale is 1 OPEN and only for an ACTIVE method; `amount` MUST be a whole number of MMK ≥ 1 (else
400 `validation`). The server SHALL set `received_at` = server time and `recorded_by_user_id` = the caller and
answer 201 with the whole `Sale`. A sale MAY hold several non-voided payments of any methods (split). Tapping
Cash SHALL record a cash payment of the full `remaining_amount` at once, with no further sheet; tapping KBZPay
SHALL open the reference sheet with the amount preset to `remaining_amount`; tapping "Split" SHALL open the
payment sheet with the method choice and an editable amount. "Remaining to pay" SHALL stay visible until it
reaches 0 and SHALL be announced to assistive technology when it changes.

#### Scenario: One tap, full cash
- **WHEN** Ko Aung's sale totals 10,000 with nothing paid and he taps Cash at 10:41 AM
- **THEN** a Cash payment of 10,000 is recorded with `received_at` = `2026-10-05T10:41:00+06:30`, without any sheet or confirmation
- **AND** `paid_amount` = 10,000, `remaining_amount` = 0 and the Finish step becomes available

#### Scenario: KBZPay opens the reference sheet
- **WHEN** Ko Min's sale has 8,000 remaining and he taps KBZPay
- **THEN** the sheet opens with the amount 8,000 and an empty reference field, and no payment exists until he submits it

#### Scenario: Split Cash + KBZPay
- **WHEN** Ko Min's sale totals 11,000 (Haircut 8,000 + Shave 3,000) and he taps Split and records Cash 5,000, then KBZPay 6,000 with reference `KBZ0001234567`
- **THEN** after the first payment `remaining_amount` = 6,000 (11,000 − 5,000) and the screen shows "Remaining to pay: 6,000 Ks"
- **AND** after the second payment `paid_amount` = 11,000 (5,000 + 6,000), `remaining_amount` = 0 and `change_due_amount` = 0

#### Scenario: Amount zero
- **WHEN** a payment is sent with `amount` = 0
- **THEN** the response is 400 `validation` naming the field `amount` and no payment row is created

### Requirement: A cash payment never exceeds the remaining amount (P4-RULE-09 · P4.PAY.02 · AD-POS-08)

A payment by a method with `is_cash` = true whose `amount` is larger than the sale's `remaining_amount` SHALL
answer 422 `amount_exceeds_remaining`. A recorded, non-voided cash payment line on the checkout screen SHALL
offer the optional helper field "Customer gave", which shows the change to hand back (given − the payment
amount); the Split sheet offers the same field for a cash amount. That figure is neither sent to the API nor
stored — the payment amount is the money kept.

#### Scenario: Customer gives a larger note
- **WHEN** Ko Min tapped Cash for a sale of 8,000 (Cash 8,000 is recorded) and types 10,000 into "Customer gave" on that payment line
- **THEN** the line shows the change 2,000 Ks (10,000 − 8,000)
- **AND** no request is sent and the stored payment `amount` stays 8,000

#### Scenario: Exactly the remaining amount
- **WHEN** a Cash payment of 8,000 is sent for a sale with `remaining_amount` = 8,000
- **THEN** the response is 201 and `remaining_amount` = 0

#### Scenario: One kyat more than the remaining amount
- **WHEN** a Cash payment of 8,001 is sent for a sale with `remaining_amount` = 8,000
- **THEN** the response is 422 `amount_exceeds_remaining` and no payment row is created

### Requirement: KBZPay needs a reference in the method's format (D-PAY-02 · P4.PAY.02 · P4-RULE-09 · P4-RULE-19 · AD-FORM-12 · AD-FMT-10)

A payment by a method with `requires_reference` = true SHALL carry `external_reference`: missing or blank →
422 `reference_required`. Surrounding spaces SHALL be trimmed before any check and the trimmed value stored.
When the method has a `reference_regex`, a reference that does not match it SHALL answer 422
`reference_format`; while the method has none, any non-blank reference of up to 100 characters is accepted. The KBZPay sheet SHALL require the reference before the payment can be submitted and show
the expected format as helper text generated from the method's format.

#### Scenario: Valid reference
- **WHEN** Ko Min records KBZPay 6,000 with the reference `KBZ0001234567` (the fixture seed sets the pattern `^KBZ[0-9]{10}$` on KBZPAY)
- **THEN** the response is 201 and the payment stores `external_reference` = `KBZ0001234567`

#### Scenario: Reference missing
- **WHEN** a KBZPay payment of 6,000 is sent without `external_reference`
- **THEN** the response is 422 `reference_required` and no payment row is created

#### Scenario: Wrong format
- **WHEN** a KBZPay payment is sent with `external_reference` = `KBZ123`
- **THEN** the response is 422 `reference_format`

#### Scenario: No pattern set
- **WHEN** KBZPAY has `reference_regex` = null (base seed only) and a KBZPay payment is sent with `external_reference` = `KBZ123`
- **THEN** the response is 201

#### Scenario: Spaces around the reference
- **WHEN** the barber pastes ` KBZ0001234567 ` with a leading and a trailing space
- **THEN** the payment is stored with `external_reference` = `KBZ0001234567`

### Requirement: A reference is used only once per payment method (D-PAY-02 · API-IDEM-05 · P4.PAY.02 · P4-RULE-09 · AD-FORM-12)

A payment whose `external_reference` equals that of another non-voided payment of the same payment method
SHALL answer 409 `duplicate_reference` with `context.receipt_number` = the receipt number of the FINISHED sale
that already holds it, or null while that sale is still OPEN. A voided payment SHALL NOT block its reference.
The database index `payments_reference_unique` is the final guard, so two simultaneous payments with one
reference can never both be stored. The sheet SHALL show "This reference was already used on <receipt
number>" (key `error.duplicate_reference`), and the message of key `pos.checkout.referenceInUse` — without
a number — when `context.receipt_number` is null.

#### Scenario: Reference already on a finished sale
- **WHEN** `KBZ0001234567` is on a KBZPay payment of the finished sale `B3-2026-OCT-00002` and Ko Aung records KBZPay 10,000 with `KBZ0001234567` on another sale
- **THEN** the response is 409 `duplicate_reference` with `context.receipt_number` = `B3-2026-OCT-00002`
- **AND** the sheet shows "This reference was already used on B3-2026-OCT-00002" and no payment row is created

#### Scenario: A voided payment frees its reference
- **WHEN** a KBZPay payment with `KBZ0001234569` was voided with a reason and a new KBZPay payment uses `KBZ0001234569`
- **THEN** the response is 201

#### Scenario: Same reference at the same moment
- **WHEN** Ko Aung and Ko Min each send a KBZPay payment with `KBZ0001234569` on their own sales at the same moment
- **THEN** exactly one answers 201 and the other answers 409 `duplicate_reference` with `context.receipt_number` = null
- **AND** the refused sheet shows the message of key `pos.checkout.referenceInUse`

### Requirement: A non-cash over-transfer is returned in cash and recorded at FINISH (D-PAY-05 · D-PAY-06 · P4-RULE-09 · P4-RULE-10 · P4-RULE-14 · P4.SAL.10 · AD-POS-08 · AD-RCPT-01 · AD-CMP-06)

A payment by a method with `is_cash` = false MAY exceed `remaining_amount`; the excess SHALL appear as
`change_due_amount`, and the checkout SHALL show "Change to return: <amount>" only when FINISH would accept
the excess (it is not larger than the non-voided non-cash payments). When a sale is finished with
`change_due_amount` > 0, FINISH SHALL insert in the same transaction one `refunds` row of kind 2
OVERPAYMENT_RETURN — payment method CASH, `amount` = the change, `reason` = "Change returned for
over-transfer", `refunded_by_user_id` = the finisher, `refunded_at` = `finished_at`, `refund_receipt_number` =
the next number of the branch's refund series (`<branch code>-RF-<YYYY>-<MMM>-<sequence>`, counter kind 2),
`client_request_id` = a UUIDv7 generated by the server — without any permission code, and enqueue its receipt
render. The sale's `total_amount` SHALL stay unchanged.
A repeated FINISH SHALL write no second row.

#### Scenario: KBZPay 10,000 for a haircut of 8,000
- **WHEN** Ko Min's sale totals 8,000 (Haircut) and he records KBZPay 10,000 with reference `KBZ0001234568`
- **THEN** `paid_amount` = 10,000, `remaining_amount` = 0, `change_due_amount` = 2,000 (10,000 − 8,000) and the screen shows "Change to return: 2,000 Ks"

#### Scenario: FINISH records the change
- **WHEN** Ko Min finishes that sale at `2026-10-05T11:15:00+06:30` as the first refund-series entry of October at B3
- **THEN** the sale is 2 FINISHED with `total_amount` = 8,000
- **AND** one refund row exists with `kind` = 2, method CASH, `amount` = 2,000, `refund_receipt_number` = `B3-RF-2026-OCT-00001`, `refunded_at` = `2026-10-05T11:15:00+06:30`, `refunded_by` = Ko Min, `business_date` = `2026-10-05` and a server-generated UUIDv7 as `client_request_id`
- **AND** the sale's receipt shows "Change returned (cash) 2,000 Ks — B3-RF-2026-OCT-00001" and the success screen shows the flag "Change returned"

#### Scenario: Over-transfer inside a split
- **WHEN** a sale of 11,000 holds Cash 5,000 and KBZPay 10,000
- **THEN** `paid_amount` = 15,000 and `change_due_amount` = 4,000 (15,000 − 11,000)
- **AND** FINISH is accepted because the excess 4,000 is not larger than the non-cash payments (10,000), and records a change return of 4,000

#### Scenario: FINISH repeated
- **WHEN** FINISH is sent a second time for the sale with the change return `B3-RF-2026-OCT-00001`
- **THEN** the response is 200 and there is still exactly one refund row for that sale

#### Scenario: Exact payment
- **WHEN** a sale of 8,000 is paid with KBZPay 8,000 and finished
- **THEN** no refund row is written and the refund counter of (B3, kind 2, 2026, 10) is unchanged

### Requirement: Payment add is idempotent on its Idempotency-Key (D-VIS-10 · API-IDEM-01 · API-IDEM-02 · P4-RULE-22 · AD-NET-01 · AD-GOAL-03)

`POST /v1/sales/{id}/payments` SHALL require the header `Idempotency-Key` (missing → 400
`idempotency_key_required`) and store it as the payment's `client_request_id`. A repeat with the same key SHALL
answer 200 with the sale and the header `Idempotent-Replayed: true` and create no second payment; a repeat
while the first is still running SHALL answer 409 `idempotency_in_progress`; a repeat whose `sale_id`,
`payment_method_id` or `amount` differs from the stored payment SHALL answer 422 `idempotency_mismatch`. The
payment button SHALL be disabled while its request is in flight.

#### Scenario: Double tap on Cash
- **WHEN** Ko Aung taps Cash twice within 200 ms on his sale of 10,000 and both requests carry the key `K5`
- **THEN** the sale holds exactly one Cash payment of 10,000 and `paid_amount` = 10,000 (not 20,000)

#### Scenario: Second request while the first is still running
- **WHEN** the first payment request with key `K5` is still inside its transaction and a second request with `K5` arrives
- **THEN** the second request answers 409 `idempotency_in_progress` and the sale ends with one payment

#### Scenario: Lost reply, then retry
- **WHEN** the KBZPay 6,000 payment with key `K6` was committed, its reply was lost, and the same request is sent again with `K6`
- **THEN** the response is 200 with `Idempotent-Replayed: true` and the sale still holds one KBZPay payment of 6,000

#### Scenario: Same key, different amount
- **WHEN** key `K6` was used for KBZPay 6,000 and is sent again with `amount` = 5,000
- **THEN** the response is 422 `idempotency_mismatch` and nothing changes

#### Scenario: Key missing
- **WHEN** a payment is sent without the `Idempotency-Key` header
- **THEN** the response is 400 `idempotency_key_required`

### Requirement: A wrong payment is voided, never deleted (D-DAT-05 · P4.PAY.03 · P4-RULE-09 · API-DATA-11 · AD-POS-08 · AD-RSN-02 · AD-CONF-01 · AD-CMP-05)

`POST /v1/payments/{id}/void` with `{ "reason": … }` (1–1,000 characters; blank → 400 `reason_required`;
longer → 400 `validation`) SHALL
be allowed only while the sale is 1 OPEN. It SHALL keep the row and set `voided_at`, `voided_by_user_id` and
`void_reason`; the payment then no longer counts in `paid_amount`. The checkout SHALL show a voided payment
struck through in the muted tone and SHALL ask for the reason in the reason dialog before sending.

#### Scenario: Wrong method recorded
- **WHEN** Ko Min recorded Cash 8,000 on a sale of 8,000 but the customer pays by KBZPay, and he voids the cash payment with the reason "Customer pays by KBZPay instead"
- **THEN** the payment row has `voided_at`, `voided_by` = Ko Min and that `void_reason`
- **AND** `paid_amount` = 0, `remaining_amount` = 8,000 and the line is shown struck through

#### Scenario: Void without a reason
- **WHEN** the void is sent with `reason` = ""
- **THEN** the response is 400 `reason_required` and the payment still counts

#### Scenario: Reason length limit
- **WHEN** a payment is voided with a reason of exactly 1,000 characters, and another with 1,001 characters
- **THEN** the first answers 200 and the second answers 400 `validation` naming the field `reason`

#### Scenario: Void, then incomplete
- **WHEN** a sale holds one Cash payment of 5,000, the payment is voided with a reason, and the visit is then marked incomplete with a reason
- **THEN** INCOMPLETE answers 200 (no non-voided payment remains)

### Requirement: "Collected by" defaults to the performer (D-VIS-06 · P4.PAY.02 · P4-RULE-09 · AD-POS-08 · AD-CMP-09)

A payment sent without `collected_by_employee_id` SHALL store the visit performer as
`collected_by_employee_id`. When the field is sent it MUST name an ACTIVE employee assigned to the sale's
branch on the sale date, else 422 `not_assigned_to_branch`. The checkout of this change sends no collector and
shows the stored collector as an employee chip on the payment line.

#### Scenario: Default collector
- **WHEN** Ko Aung records Cash 10,000 on his own sale without `collected_by_employee_id`
- **THEN** the payment has `collected_by` = Ko Aung and the payment line shows the chip "Ko Aung"

#### Scenario: A colleague of the same branch
- **WHEN** the request carries `collected_by_employee_id` = Ko Min (Barber · B3)
- **THEN** the response is 201 and the payment has `collected_by` = Ko Min

#### Scenario: An employee of another branch
- **WHEN** the request carries `collected_by_employee_id` = Ko Htet (Barber · B1) for a B3 sale
- **THEN** the response is 422 `not_assigned_to_branch` and no payment row is created
