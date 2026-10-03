## Purpose

Services and pricing define what each branch sells and what it costs on a given day. This delta adds only the
two operational reads the walk-in POS needs: the services sold at a branch and the server-side price quote.

## ADDED Requirements

### Requirement: The POS lists only the services sold at its branch (D-SVC-01 · D-SVC-02 · P2.SVC.01 · P2.CAT.01 · P2-RULE-01 · P2-RULE-11 · API-PERM-03 · AD-POS-05)

`GET /v1/services?branch_id=<branch>` SHALL return to any signed-in staff member, without a permission code,
only the ACTIVE services that have an ACTIVE `branch_services` row (status 1) at that branch, each with
`name_mm`, `name_en`, `category_id`, `pricing_mode` and `duration_range`. A `branch_id` outside the caller's
read scope SHALL return an empty list, not an error. `GET /v1/service-categories` SHALL return the ACTIVE
categories in `sort_order` to any signed-in staff member. The service picker and the START sheet chips SHALL be
filled from this list and MUST NOT show a service that is not sold at the current branch; each picker row
SHALL show the name, the duration and the price for this branch and performer taken from the price quote for
the visit's business date (today on the START sheet).

#### Scenario: Services sold at B3
- **WHEN** Ko Min opens the service picker at B3 on 05/Oct/2026
- **THEN** it offers Haircut (30 min · 8,000 Ks), Shave (15 min · 3,000 Ks) and Hair wash (10 min · 2,000 Ks), grouped under their category names

#### Scenario: The picker shows the barber's own price
- **WHEN** Ko Aung opens the service picker at B3 on 05/Oct/2026
- **THEN** the Haircut row shows 10,000 Ks

#### Scenario: A service switched off at the branch
- **WHEN** Hair wash has `branch_services.status` = 0 at B3 and Ko Min opens the picker
- **THEN** Hair wash is not offered at B3
- **AND** it is still offered at B1, where its row is ACTIVE

#### Scenario: Branch outside the read scope
- **WHEN** Ko Htet (Barber · B1) calls `GET /v1/services?branch_id=<B3>`
- **THEN** the response is 200 with `items` = []

### Requirement: The price quote is the only price calculator (D-SVC-03 · D-SVC-04 · D-SVC-06 · D-SVC-08 · P2.PRC.06 · P2-RULE-03 · P2-RULE-05 · P7-RULE-02 · API-DATA-07 · AD-POS-05)

`POST /v1/prices/quote` with `{ branch_id, location_type: 1, date, employee_id?, items: [{ service_id }] }`
SHALL be open to any signed-in staff member with the branch in read scope, without a permission code, and
SHALL return per item `unit_price_amount`, `duration_minutes`, `buffer_minutes`, `price_source` and `sold`,
plus `subtotal_amount` and `complete` for the whole quote.
The price SHALL be resolved from the price rows effective on `date` for that branch and service: the row of
the given barber (`price_source` 2 BARBER_OVERRIDE) wins over the branch row (`price_source` 1 BRANCH). An
item without any effective row SHALL be returned with `sold` = false and a `reason` (`not_sold_here`,
`service_inactive`, `category_inactive` or `variant_required`), the quote then carrying `complete` = false —
status 200, not an error. For location 2 HOME the home row is used when one exists, else the branch-level
BRANCH row (`price_source` 4 HOME_FALLBACK_BRANCH; a barber price never applies at home). `date` MAY be any
earlier business date whose branch-day is not CLOSED and any date up to today + `booking.advance_window_days`
(14): a later date SHALL answer 422 `outside_window`, and a past date whose branch-day is CLOSED SHALL answer
422 `day_closed` with `context.correction_path` = `reopen`. The same function SHALL price every sale line
in-process; no other code computes a service price.

#### Scenario: Branch price
- **WHEN** the quote is asked for B3, 05/Oct/2026, `employee_id` = Ko Min, item Haircut
- **THEN** `unit_price_amount` = 8,000, `duration_minutes` = 30, `price_source` = 1 and `sold` = true

#### Scenario: Barber price
- **WHEN** the quote is asked for B3, 05/Oct/2026, `employee_id` = Ko Aung, item Haircut
- **THEN** `unit_price_amount` = 10,000 and `price_source` = 2

#### Scenario: Two items
- **WHEN** the quote is asked for B3, 05/Oct/2026, `employee_id` = Ko Min, items Haircut and Shave
- **THEN** the items are 8,000 and 3,000, `subtotal_amount` = 11,000 (8,000 + 3,000) and `complete` = true

#### Scenario: Price scheduled for tomorrow
- **WHEN** the B3 Haircut branch price is 8,000 until 05/Oct/2026 and 9,000 from 06/Oct/2026
- **THEN** the quote for `date` = `2026-10-05` returns 8,000 and the quote for `date` = `2026-10-06` returns 9,000

#### Scenario: Last day inside the window
- **WHEN** today is 05/Oct/2026 and the quote is asked for B3 with `date` = `2026-10-19` (today + 14)
- **THEN** the response is 200

#### Scenario: One day past the window
- **WHEN** today is 05/Oct/2026 and the quote is asked with `date` = `2026-10-20`
- **THEN** the response is 422 `outside_window`

#### Scenario: A closed past day
- **WHEN** B3's branch-day `2026-10-04` is CLOSED and the quote is asked for B3 with `date` = `2026-10-04`
- **THEN** the response is 422 `day_closed` with `context.correction_path` = `reopen`

#### Scenario: An open past day
- **WHEN** B3 has no closing row for `2026-10-04` and the quote is asked with `date` = `2026-10-04`
- **THEN** the response is 200 with Haircut 8,000 for Ko Min

#### Scenario: Home price falls back to the branch price
- **WHEN** B3 has no HOME price row for Haircut and the quote is asked for B3, 05/Oct/2026, `location_type` = 2, `employee_id` = Ko Aung
- **THEN** `unit_price_amount` = 8,000 (the branch price, not Ko Aung's 10,000), `price_source` = 4 and `transport_fee_amount` = 0

#### Scenario: Not sold here
- **WHEN** the quote is asked for B3 with an item whose service has no ACTIVE `branch_services` row at B3
- **THEN** the response is 200 with that item `sold` = false, `reason` = `not_sold_here`, and `complete` = false
