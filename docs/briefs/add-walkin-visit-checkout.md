# Brief: add-walkin-visit-checkout

> Readable overview for the developer and the tester. The normative text is the spec delta in
> `openspec/changes/add-walkin-visit-checkout/specs/` (41 requirements, 210 scenarios); technical choices are
> in its `design.md`. Fixture data: `docs/plan/spec-fixtures.md`.

## မြန်မာ အတိုချုပ်

Barber တစ်ယောက်က ကိုယ့်ဖုန်းနဲ့ walk-in customer ကို **Today → START → Service ပြီး → ငွေယူ (Cash / KBZPay /
ခွဲပေး) → FINISH → receipt PDF** အထိ လုပ်နိုင်အောင် ဆောက်တဲ့ ပထမဆုံး အပိုင်း။ ဈေး = system တွက်၊ စာရင်း ၂ ခါ မဝင်၊
receipt နံပါတ် မကျော်၊ FINISH ပြီး ပြင်မရ။ Discount / refund / late entry / ကိုယ်စားမှတ် / product / print /
booking = နောက် change တွေ။ Pilot စဖို့ ဒီ change အပြင် server (`add-staging-deploy`)၊ late entry
(`add-late-entry`)၊ pilot data (`add-pilot-data-seed`) လိုသေးတယ်။ Owner က မေးခွန်း ၇ ခုလုံး ဖြေပြီး (02/Oct/2026 13:08) — စလို့ရပြီ။

## Goal

Let a barber record a walk-in in real time on their own phone, from START to a finished, numbered, immutable
sale with a shareable receipt PDF — the first vertical slice (D-PLT-18, D-VIS-11). Target: one service, cash,
no phone = ≤ 7 taps (AD-GOAL-01).

## Decisions

- **Implements:** D-VIS-01 · D-VIS-02 · D-VIS-03 · D-VIS-05 · D-VIS-06 · D-VIS-07 · D-VIS-08 · D-VIS-09 ·
  D-VIS-10 · D-VIS-11 · D-PAY-01 · D-PAY-02 · D-PAY-05 (automatic change only) · D-PAY-06 · D-PAY-07 (PDF /
  Share) · D-SVC-03 · D-SVC-04 · D-SVC-08 · D-CUS-01 · D-CUS-02 · D-CUS-03 · D-FIN-06 (day lock) · D-AUTH-07 ·
  D-ROLE-03 · D-ROLE-07 · D-AUD-01 · D-AUD-02 · D-DAT-05 · D-PLT-04 · D-PLT-05 · D-PLT-15.
- **API:** P4.VIS.02 · P4.VIS.03 · P4.VIS.04 · P4.VIS.05 · P4.VIS.06 · P4.SAL.02 · P4.SAL.04 · P4.SAL.06 ·
  P4.SAL.10 · P4.PAY.02 · P4.PAY.03 · P4.PMT.01 · P4.RCP.01 · P4.RCP.02 · P4.REQ.01 · P2.CAT.01 · P2.SVC.01 ·
  P2.PRC.06 · P3.CUS.02 (19 endpoints).
- **UX:** `docs/ux/admin-panel.md` §10.1 – §10.5 (AD-TODAY-01 … 03, AD-POS-01 … 08, AD-POS-12, AD-POS-13),
  §6.9 (AD-RCPT-01 / 02), AD-NET-01 / 02, AD-STATE-01 … 06.
- **New (proposed):** none. The seven questions of this change were answered by the owner on 02/Oct/2026 13:08.

## Actors & permissions

| Actor | What they do here | Permission |
| --- | --- | --- |
| Barber (Ko Aung, Ko Min — B3) | START, lines, COMPLETE, INCOMPLETE, payments, void, FINISH, receipt — for **their own** visit | none — own work needs no code (D-ROLE-07, P4-RULE-03); the branch must be in their read scope |
| Barber of the same branch (Ko Min on Ko Aung's sale) | opens the **receipt** of a finished sale | none (operational read); the sale itself → 403 `forbidden` (`context.required` = `sale.view`) |
| Barber of another branch (Ko Htet — B1) | nothing at B3 | START → 403 `out_of_scope`; reads → 404; writes → 403 `forbidden` |
| Manager (Ma Hnin — B3) | reads visits and sales of B3; by a sale's link she can act for an absent barber (FINISH asks her for a reason) | `visit.view`, `sale.view` (read) · `visit.update`, `visit.delete`, `sale.finish_override` + reason — all branch level. No list of other barbers' visits in this change |
| Admin (U Kyaw Zin) | as the Manager, every branch | the same codes at company scope |

## Flow

1. **Today** `/today` — "In progress" lists my open visits, oldest first.
2. **＋ Start → Walk-in → START sheet** — branch + me; optional service chip → **Start**.
   Visit `—` → **1 STARTED**, sale `—` → **1 OPEN** (same transaction, by the barber).
3. **Visit screen** `/sales/<id>` — ＋ Add service (price from the server), remove with reason.
4. **"Service done · Take payment"** — visit 1 → **2 COMPLETED** (needs ≥ 1 service) and checkout opens.
5. **Checkout** — **Cash** records the remaining amount at once · **KBZPay** opens the reference sheet ·
   **Split** opens the sheet with an editable amount — until "Remaining to pay" = 0; void a wrong payment with
   a reason; a KBZPay over-transfer shows "Change to return".
6. **Finish** — optional phone (empty = Skip), **Finish · total** → sale 1 → **2 FINISHED**, visit 2 →
   **3 FINISHED**, receipt number assigned, automatic change return if any.
7. **Success screen** — receipt number, total, payments → **View / share PDF** → **Next customer** (→ Today).
8. **Mark incomplete** (kebab, any time before FINISH, reason, no active payment) — visit → **0 INCOMPLETE**,
   sale → **0 CANCELLED**; no receipt number.

## Rules

- R1. Today shows only my visits in status 1 or 2, oldest first, COMPLETED ones flagged "Awaiting payment".
- R2. START needs no permission code; the branch must be in my read scope (else 403 `out_of_scope`).
- R3. The performer of a START is the logged-in barber, ACTIVE and assigned to the branch (else 422 `not_assigned_to_branch`).
- R4. START asks no customer question and creates the visit and its OPEN sale in one transaction.
- R5. START with the same `Idempotency-Key` returns the same visit (200 + `Idempotent-Replayed: true`); while the first is still running → 409; other branch / performer → 422 `idempotency_mismatch`; no key → 400.
- R6. A barber with a COMPLETED, unpaid visit cannot START (422 `unpaid_visit_open`); several STARTED visits are allowed.
- R7. START, payment add, payment void and FINISH are refused on a closed branch-day (422 `day_closed`); INCOMPLETE is not.
- R8. A service price is never sent by the client; it is the server quote for branch + barber on the visit's business date (barber price beats branch price).
- R9. A line keeps its price and description snapshot when prices or names change later.
- R10. A service the barber is not eligible for is still recorded, with the warning `not_eligible`.
- R11. Removing a line needs a reason of 1–1,000 characters; the row stays (struck through) and leaves the total.
- R12. A service added after "Service done" needs a reason (`added_reason`).
- R13. COMPLETE needs ≥ 1 active service line (422 `service_required`); a repeat returns 200.
- R14. INCOMPLETE needs a reason and no non-voided payment (422 `payments_exist`); it cancels the sale and takes no receipt number.
- R15. Totals are computed by the server in whole MMK: total = Σ active lines; remaining = max(total − paid, 0); change = max(paid − total, 0).
- R16. The base seed of every environment contains the payment methods CASH and KBZPAY.
- R17. Tapping Cash records the whole remaining amount at once; a cash payment can never exceed the remaining amount (422 `amount_exceeds_remaining`); "Customer gave" is a helper and is not stored.
- R18. A KBZPay payment needs a reference (422 `reference_required`) in the method's format when one is set (422 `reference_format`).
- R19. A reference can be used once per payment method among non-voided payments (409 `duplicate_reference`).
- R20. A non-cash payment may exceed the remaining amount; the excess is returned in cash and recorded at FINISH as an overpayment return with an RF number.
- R21. A payment with the same `Idempotency-Key` is stored once; different sale / method / amount → 422 `idempotency_mismatch`.
- R22. A payment is voided with a reason, never deleted; a voided payment does not count.
- R23. "Collected by" = the performer unless another ACTIVE employee of the branch is sent.
- R24. FINISH needs a COMPLETED visit (422 `visit_not_completed`) and paid ≥ total (422 `amount_mismatch`); an excess is allowed only up to the non-cash payments, and the Finish button is disabled otherwise.
- R25. FINISH carries `expected_total_amount`; a different total → 409 `total_changed`.
- R26. FINISH takes the next gapless number of the branch and month: `B3-2026-OCT-00001`.
- R27. Business date and receipt month are the Myanmar-time date of `finished_at`, computed by the server.
- R28. A phone given at FINISH finds the customer or creates one (name required for a new phone); no phone = no customer.
- R29. FINISH repeated returns 200 with the same receipt number and writes nothing twice — no second number, refund, job or audit row.
- R30. A FINISHED or CANCELLED sale cannot be changed: API 409 `invalid_transition` (with `correction_path` `difference_sale` for a line add, `refund` for a line removal or void on a FINISHED sale); DB triggers as the second wall.
- R31. The receipt is English, rendered on the server, stored once and byte-identical on every reopen; the PDF opens on every device.
- R32. After about 15 s without an answer the app checks `GET /v1/me/requests/{key}` before offering Retry with the same key.
- R33. Without realtime, screens refetch on open, focus, reconnect and after each own action; nothing is shown as done before the server confirms.
- R34. Every action writes one audit row with actor, branch and reason; a replay or an unchanged repeat writes none.
- R35. Screen controls (lines, pay, void, Finish, incomplete) are shown only where `Sale.actions` allows them.
- R36. The price quote refuses a date later than today + 14 days (422 `outside_window`) and a closed past day (422 `day_closed`).
- R37. The START sheet shows the first 6 simple services of the branch in catalogue order as chips; the picker has search + categories and no "Frequent here" section.
- R38. Without a connection nothing is queued; the offline help says to write the service on paper — it is entered with Late entry.
- R39. On a FINISHED sale a payment add, and on a CANCELLED sale every write, answers 409 `invalid_transition` without `correction_path`.

## Scenarios

All at B3 on Monday 05/Oct/2026 unless said otherwise.

### S1: Walk-in, one service, cash (7 taps)
- WHEN Ko Aung taps ＋ Start → Walk-in → Haircut chip → Start (10:05 AM) → "Service done · Take payment" (10:40 AM) → Cash → "Finish · 10,000 Ks" (10:42 AM), phone left empty
- THEN the sale is FINISHED with total 10,000 (Ko Aung's barber price), Cash 10,000, no customer, receipt `B3-2026-OCT-00001`, business date `2026-10-05`

### S2: Split payment
- WHEN Ko Min sells Haircut 8,000 + Shave 3,000 = 11,000 and takes Cash 5,000, then KBZPay 6,000 with reference `KBZ0001234567`
- THEN remaining goes 11,000 → 6,000 → 0, and FINISH at 10:50 AM gives `B3-2026-OCT-00002`

### S3: KBZPay over-transfer
- WHEN Ko Min sells Haircut 8,000 and the customer transfers KBZPay 10,000 (`KBZ0001234568`)
- THEN the screen shows "Change to return: 2,000 Ks" (10,000 − 8,000); FINISH at 11:15 AM gives `B3-2026-OCT-00003`, records the cash return `B3-RF-2026-OCT-00001` of 2,000, and the receipt prints "Change returned (cash) 2,000 Ks — B3-RF-2026-OCT-00001"

### S4: Paid less than the total
- WHEN Ko Min's sale of 11,000 holds Cash 5,000 and FINISH is sent
- THEN 422 `amount_mismatch` with `remaining_amount` = 6,000; the Finish button was disabled with "Remaining to pay: 6,000 Ks"

### S5: Double tap and lost reply
- WHEN Start (or Cash) is tapped twice, or the reply is lost and the app retries with the same key
- THEN exactly one visit (one payment) exists; the retry answers 200 with `Idempotent-Replayed: true`; one audit row

### S6: Duplicate KBZPay reference
- WHEN `KBZ0001234567` is already on `B3-2026-OCT-00002` and Ko Aung enters it on another sale
- THEN 409 `duplicate_reference`; the sheet shows "This reference was already used on B3-2026-OCT-00002"

### S7: Customer leaves without paying
- WHEN Ko Aung's visit is "Awaiting payment" and he marks it incomplete with the reason "Customer left without paying"
- THEN visit 0 INCOMPLETE, sale 0 CANCELLED, no receipt number; his next START is accepted (it was refused with 422 `unpaid_visit_open` before)

### S8: Edit after FINISH
- WHEN a line is added to `B3-2026-OCT-00001`, or its payment is voided
- THEN 409 `invalid_transition` with `context.status` = 2 and `correction_path` `difference_sale` (line add) / `refund` (void); the sale is unchanged

### S9: Month boundary
- WHEN the October counter stands at 124 and sales are finished at `2026-10-31T23:59:00+06:30` and `2026-11-01T00:00:00+06:30`
- THEN the numbers are `B3-2026-OCT-00125` and `B3-2026-NOV-00001`

### S10: Other people
- WHEN Ko Htet (B1) calls START for B3 / reads a B3 sale / adds a payment to it; Ko Min reads Ko Aung's sale; Ma Hnin reads it
- THEN 403 `out_of_scope` / 404 / 403 `forbidden`; 403 `forbidden` (`sale.view`); 200

### S11: Cash excess after a line was removed
- WHEN a sale of 11,000 was paid Cash 11,000 and Shave (3,000) is then removed, total 8,000
- THEN the Finish button is disabled, no "Change to return" is shown, FINISH answers 422 `amount_mismatch`; after the cash payment is voided and Cash 8,000 taken, FINISH succeeds

## Screens / Form fields

Mobile first (the START sheet fits 360 × 640 px; e2e runs at 360 × 800), one primary button per view in the
sticky bottom bar (AD-LAY-04); all text from the language files; money `10,000 Ks` / `10,000 ကျပ်`, date
`05/Oct/2026`, time `10:42 AM`, digits 0–9. The visit and checkout screens keep a sticky header: customer or
"Walk-in" · performer chip · branch · start time + elapsed.

### Today `/today` (list)
- Card: customer name or "Walk-in" · services · elapsed · badge ("In service" info / "Awaiting payment"
  warning) · next action ("Service done" / "Take payment"). Sort: `started_at` ascending. No filter, no search.
- States: skeleton > 400 ms · empty state (`today.empty.title`, `today.empty.body`, ＋ Start) · error with
  Retry + 8-character error ID · offline banner (`common.offline.banner`).
- Visible to every signed-in staff member; shows only their own visits.

### Form A — START sheet `/visits/new`

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Branch | read-only chip (changed through the Today branch chip, branches in scope only) | ✔ | in my read scope; branch-day not closed | today's branch | `error.out_of_scope` · `error.day_closed` |
| Performer | read-only employee chip | ✔ | = me; ACTIVE; assigned to the branch today | me | `error.not_assigned_to_branch` |
| First service | chips, 0–n of the first 6 simple services sold here, in catalogue order | ✖ | sold at this branch | none | `error.not_sold_here` |

- **Buttons:** "Walk-in" (arrival step — the only choice in this change) · **Start** (primary; spinner +
  disabled while in flight) · close.
- **Not tied to a field:** `error.unpaid_visit_open` with a link to the unpaid visit's checkout.
- **After save:** the visit screen `/sales/<id>` opens; no toast.

### Form B — Add service (picker sheet on the visit screen and in checkout "Items")

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Service | row picked from search / category list (name · duration · price) | ✔ | ACTIVE, sold at this branch, simple pricing | — | `error.not_sold_here` · `error.service_inactive` · `error.category_inactive` · `error.variant_required` |
| Why was this added? (`added_reason`) | text | ✔ only when the visit is already COMPLETED | 1–1,000 characters, not blank | — | `error.reason_required` · `error.validation` |

- **After save:** the line appears with its server price; warning chip when `not_eligible`.

### Form C — Remove line (reason dialog)

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Reason | text | ✔ | 1–1,000 characters, not blank; not the last service of a COMPLETED visit | — | `error.reason_required` · `error.validation` · `error.service_required` |

### Form D — Payment (checkout)

Buttons in this order: **Cash** · **KBZPay** · **Split** · any other active method.

- **Cash** — no form: one tap records a cash payment of the remaining amount.
- **KBZPay** — the reference sheet:

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Amount | money input (whole MMK) | ✔ | integer ≥ 1 | the remaining amount | `error.validation` |
| Reference | text | ✔ | trimmed; ≤ 100 characters; the method's format when one is set; unused on this method | — | `error.reference_required` · `error.reference_format` · `error.duplicate_reference` · `pos.checkout.referenceInUse` |

- **Split** — the payment sheet:

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Method | choice of the active methods | ✔ | ACTIVE method | — | — |
| Amount | money input (whole MMK) | ✔ | integer ≥ 1; cash: ≤ remaining | the remaining amount | `error.validation` · `error.amount_exceeds_remaining` |
| Reference (methods that require one) | text | ✔ | as above | — | as above |
| Customer gave (cash only) | money input | ✖ | shows change = gave − amount; never sent | — | — |

- **On a recorded cash payment line:** optional "Customer gave" field → shows the change; never sent.
- **On every payment line:** collector chip (= the performer; no picker in this change) · "Void payment" (Form E).
- **Always visible:** "Remaining to pay: <amount>" until 0; "Change to return: <amount>" only when a non-cash
  payment covers the excess.
- **Not tied to a field:** `error.day_closed`.

### Form E — Void payment · Form F — Mark incomplete (reason dialogs)

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Reason (void) | text | ✔ | 1–1,000 characters, not blank; sale OPEN | — | `error.reason_required` · `error.validation` · `error.invalid_transition` |
| Reason (incomplete) | text | ✔ | 1–1,000 characters, not blank; no non-voided payment | — | `error.reason_required` · `error.validation` · `error.payments_exist` |

### Form G — Finish step

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| Customer phone | phone input (`09…`, `+959…`, spaces, dashes, Myanmar digits accepted) | ✖ | normalises to E.164; ≤ 50 characters | empty (= Skip) | `error.phone_invalid` |
| Name | text | ✔ only when the phone is unknown | 1–255 characters | — | `error.validation` (`customer.name`) |
| Reason (only for a code holder finishing another barber's sale) | text in the reason dialog | ✔ then | 1–1,000 characters | — | `error.reason_required` |

- **Lookup result:** "Existing customer: <name> · last visit <date>" or "New customer".
- **Buttons:** "Skip" (collapses the phone field) · **Finish · <total>** (primary; disabled with the reason
  under it while money is missing or a cash excess exists).
- **Not tied to a field:** `error.total_changed` (screen reloads with the new total) · `error.amount_mismatch` ·
  `error.visit_not_completed` · `error.day_closed` · `error.payroll_finalized`.
- **After save:** success screen — receipt number, total, payments, performer, "Change returned" flag when
  applicable; buttons **View / share PDF**, **Next customer**; no auto-redirect; no Print button.

## Data

- **Written:** `visits`, `sales`, `sale_items`, `payments`, `receipt_counters`, `refunds` (kind 2 only),
  `customers`, `attachments` (receipt PDF + PNG), `audit_events`; `payment_methods` by the base seed only.
- **Read:** `branches`, `employees`, `employee_branches`, `services`, `service_categories`, `branch_services`,
  `service_prices`, `employee_service_eligibilities`, `daily_closings`, `payroll_runs`,
  `branch_opening_hours`; settings `receipt.printer_width_mm`, `booking.advance_window_days`.
- **DBML:** no change and no migration (DB Part 4 v1.2 and the other locked parts as they are).
- **Modules (ADR-001):** `delivery`, `sales`, `catalog`, `booking`, `cash-closing`, `payroll`, `platform`.

## Edge cases

- Double tap, lost reply, 15 s timeout → idempotency + "Checking whether it was saved…".
- No connection → offline banner; nothing is queued; the help page says to write the service on paper — it is
  entered with Late entry; no other procedure exists.
- Two phones on one sale, or a manager acting by the link → the next refetch shows it; FINISH protected by `expected_total_amount`.
- Cash excess after a line is removed → Finish disabled; void and retake.
- Two FINISH at the same moment (same sale → one number; different sales → consecutive numbers).
- Midnight: visit date = START day, sale date = FINISH day; 31/Oct 23:59 vs 01/Nov 00:00.
- Closed day / finalized payroll period → 422 `day_closed` / 423 `payroll_finalized` (no screen creates them yet; tested with seeded rows).
- Renderer or bucket down → the sale is still finished; the PDF renders when requested.
- Service without an English name → Myanmar name on the English receipt.
- A database without fixtures still has CASH and KBZPAY (base seed).

## Out of scope

Discount codes and requests · manual refunds · adjustments and difference sale · late entry · proxy recording ·
product lines and stock · option-grid services and option change · price override · home service · booking
START · the visits list for managers · collected-by picker · tax / service charge · KBZPay verification and
daily closing · commission estimate · Bluetooth printing · receipts list and lookup · payment-method
administration · realtime events · `job.failed` notification · logo and thank-you text on the receipt. Change
names: `proposal.md` → Non-goals.

## Open questions

None. The seven questions of this change were answered by the owner on 02/Oct/2026 13:08 (review v5.2.17
§0.11); the change is ready to apply. Recorded readings (no decision needed): `proposal.md` → Open questions →
Recorded readings (8 items).

## Answers to Claude's questions

| ID | Answer (owner) | Date |
| --- | --- | --- |
| S2 | The change stays whole (41 requirements, 145 tasks) — an accepted exception; three pull requests, the test workbook runs on the last one; Dev 2 end to end, Dev 1 reviews (D-PLT-20, CG-GIT-05) | 02/Oct/2026 13:08 |
| S3 | `platform-runtime` and `ui-foundation` are approved capabilities (D-PLT-20) | 02/Oct/2026 13:08 |
| S7 | START chips = first 6 simple services in catalogue order; picker = search + categories, no "Frequent here" (AD-POS-03 · AD-POS-05 v1.7) | 02/Oct/2026 13:08 |
| S8 | Part 4 reason shapes — `reason`, `added_reason`, `override_reason` (API-DATA-11 v1.6) | 02/Oct/2026 13:08 |
| S16 | No interim rule for paper records; `add-staging-deploy`, `add-pilot-data-seed`, `add-late-entry` come before the pilot (D-PLT-20, D-VIS-13) | 02/Oct/2026 13:08 |
| S17 | `correction_path` omitted for a payment add on a FINISHED sale and for every write on a CANCELLED sale (P4-RULE-01 v1.1) | 02/Oct/2026 13:08 |
| S18 | The texts are written in the pull request (AD wording where one exists) and reviewed by the owner there (D-PLT-20) | 02/Oct/2026 13:08 |
