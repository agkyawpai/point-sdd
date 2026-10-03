## Purpose

Customers are company-level records identified by their phone number. This delta adds only what a walk-in
FINISH needs: the phone lookup on the Finish step and the automatic match-or-create of the customer.

## ADDED Requirements

### Requirement: The Finish step looks a customer up by phone (D-CUS-01 · D-CUS-02 · API-DATA-06 · P3.CUS.02 · AD-FORM-10 · AD-FMT-10 · AD-POS-12)

`GET /v1/customers/lookup?phone=<typed>` SHALL be open to any signed-in staff member without a permission
code. It SHALL normalise the typed phone to E.164 (a leading `0` = Myanmar `+95`; spaces and dashes ignored)
and answer 200 `{ "customer": … }` for an exact match of `phone_normalized` (inactive customers included), 200
`{ "customer": null }` when there is none, 200 `{ "customer": null, "archived": true }` for an archived
customer, and 400 `phone_invalid` when the value cannot be normalised. As soon as the typed number is complete,
the Finish step SHALL show "Existing customer: <name>" — followed by "· last visit <date>" when
`last_visit_at` is set — and ask nothing more, or "New customer" with a Name field that is then required.
`last_visit_at` SHALL be the finish time of the customer's latest FINISHED visit at a branch in the caller's
read scope, and `upcoming_bookings` SHALL be an empty list while no booking exists. The phone input SHALL
accept Myanmar digits and display 0–9.

#### Scenario: Returning customer
- **WHEN** Ko Aung types `09 7712 3456` on the Finish step
- **THEN** the lookup normalises it to `+95977123456` and returns the customer "Ma Su" with `last_visit_at` = null and `upcoming_bookings` = []
- **AND** the step shows "Existing customer: Ma Su" and no Name field

#### Scenario: Same customer, other spelling
- **WHEN** the phone is typed as `+95977123456`
- **THEN** the lookup returns the same customer "Ma Su"

#### Scenario: Returning customer with an earlier visit here
- **WHEN** a sale of Ma Su was finished at B3 at `2026-10-05T10:42:00+06:30` and Ko Min types her phone on 06/Oct/2026
- **THEN** `last_visit_at` = `2026-10-05T10:42:00+06:30` and the step shows "Existing customer: Ma Su · last visit 05/Oct/2026"

#### Scenario: Visit at a branch outside the read scope
- **WHEN** Ma Su's only finished visit was at B3 and Ko Htet (B1) looks her phone up
- **THEN** the customer "Ma Su" is returned with `last_visit_at` = null

#### Scenario: Archived customer
- **WHEN** the customer with `+95977123456` is archived and the lookup is called with `09 7712 3456`
- **THEN** the response is 200 `{ "customer": null, "archived": true }`

#### Scenario: First visit
- **WHEN** Ko Aung types `09 4500 1122` and no customer has `+95945001122`
- **THEN** the response is `{ "customer": null }` and the step shows "New customer" with a required Name field

#### Scenario: Not a phone number
- **WHEN** the lookup is called with `phone` = `12`
- **THEN** the response is 400 `phone_invalid`

### Requirement: FINISH finds or creates the customer by phone (D-CUS-01 · D-CUS-02 · D-CUS-03 · D-VIS-02 · P3-RULE-01 · P4-RULE-10 · P4.SAL.10 · AD-POS-12)

When the FINISH body carries `customer { phone, name? }`, the server SHALL normalise the phone and attach
exactly one customer row per (company, `phone_normalized`) to the sale: an existing customer is attached and
its stored `name` is never overwritten; an unknown phone creates a customer with the typed `name`, which is
then required (missing → 400 `validation` naming `customer.name`), without the code `customer.create`; an
INACTIVE customer becomes ACTIVE (`warnings[]` `customer_reactivated`); an archived customer is restored
(`warnings[]` `customer_restored`); an invalid phone answers 400 `phone_invalid`. A FINISH with `customer`
omitted or null SHALL finish the sale without a customer. Any refusal leaves the sale 1 OPEN. Two simultaneous
FINISH requests with the same new phone MUST NOT create two customer rows.

#### Scenario: Returning customer attached
- **WHEN** Ko Aung finishes his sale of 10,000 with `customer` = `{ "phone": "09 7712 3456" }`
- **THEN** the sale's `customer` is Ma Su (`phone_normalized` = `+95977123456`) and no new customer row is created

#### Scenario: New customer created
- **WHEN** Ko Aung finishes a sale with `customer` = `{ "phone": "09 4500 1122", "name": "Ko Phyo" }` and no customer has that phone
- **THEN** a customer "Ko Phyo" with `phone` = `09 4500 1122` and `phone_normalized` = `+95945001122` is created and attached to the sale
- **AND** Ko Aung needed no `customer.create` permission

#### Scenario: New phone without a name
- **WHEN** FINISH is sent with `customer` = `{ "phone": "09 4500 1122" }` for an unknown phone
- **THEN** the response is 400 `validation` naming `customer.name`, the sale stays 1 OPEN and no receipt number is taken

#### Scenario: Skip
- **WHEN** FINISH is sent with `customer` = null
- **THEN** the sale is finished with `customer` = null

#### Scenario: A typed name does not rename an existing customer
- **WHEN** FINISH is sent with `customer` = `{ "phone": "09 7712 3456", "name": "Su Su" }`
- **THEN** the sale is attached to the existing customer, whose `name` is still "Ma Su"

#### Scenario: Inactive customer returns
- **WHEN** the customer with `+95977123456` has `status` = 0 INACTIVE and a sale is finished with that phone
- **THEN** the customer has `status` = 1, is attached to the sale, and the response carries `warnings` with `customer_reactivated`

#### Scenario: Archived customer returns
- **WHEN** the customer with `+95977123456` is archived and a sale is finished with that phone
- **THEN** the customer is restored (`archived_at` = null, `status` = 1), attached to the sale, and the response carries `warnings` with `customer_restored`

#### Scenario: Two sales, one new phone, same moment
- **WHEN** Ko Aung and Ko Min each finish a sale at the same moment with `customer` = `{ "phone": "09 4500 1122", "name": "Ko Phyo" }`
- **THEN** exactly one customer row with `+95945001122` exists and both sales point to it
