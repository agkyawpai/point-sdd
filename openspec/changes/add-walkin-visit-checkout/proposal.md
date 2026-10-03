# add-walkin-visit-checkout

- **Implements (decisions):** D-VIS-01 · D-VIS-02 · D-VIS-03 · D-VIS-05 · D-VIS-06 · D-VIS-07 · D-VIS-08 · D-VIS-09 · D-VIS-10 · D-VIS-11 · D-PAY-01 · D-PAY-02 · D-PAY-05 (automatic change return only) · D-PAY-06 · D-PAY-07 (PDF / Share only) · D-PAY-08 (OFF) · D-SVC-03 · D-SVC-04 · D-SVC-08 · D-CUS-01 · D-CUS-02 · D-CUS-03 · D-FIN-06 (day lock only) · D-AUTH-07 · D-ROLE-03 · D-ROLE-07 · D-AUD-01 · D-AUD-02 · D-DAT-05 · D-PLT-04 · D-PLT-05 · D-PLT-15 · D-PLT-18
- **Implements (API):** P4.VIS.02 · P4.VIS.03 · P4.VIS.04 · P4.VIS.05 · P4.VIS.06 · P4.SAL.02 · P4.SAL.04 · P4.SAL.06 · P4.SAL.10 · P4.PAY.02 · P4.PAY.03 · P4.PMT.01 · P4.RCP.01 · P4.RCP.02 · P4.REQ.01 · P2.CAT.01 · P2.SVC.01 · P2.PRC.06 · P3.CUS.02 — rules P4-RULE-01 · P4-RULE-02 · P4-RULE-03 · P4-RULE-04 · P4-RULE-05 · P4-RULE-06 · P4-RULE-09 · P4-RULE-10 · P4-RULE-11 · P4-RULE-18 · P4-RULE-19 (system rows) · P4-RULE-20 · P4-RULE-21 · P4-RULE-22 · P2-RULE-01 · P2-RULE-03 · P2-RULE-05 · P3-RULE-01 · P7-RULE-02 · P5-RULE-10 · API-IDEM-01 · API-IDEM-02 · API-IDEM-05 · API-IDEM-06 · API-PERM-02 · API-PERM-03 · API-PERM-05 · API-DATA-02 · API-DATA-03 · API-DATA-07 · API-ERR-02 · API-AUD-01
- **Implements (UX):** AD-TODAY-01 · AD-TODAY-02 · AD-TODAY-03 · AD-POS-01 · AD-POS-02 · AD-POS-03 · AD-POS-04 · AD-POS-05 · AD-POS-06 · AD-POS-07 · AD-POS-08 · AD-POS-12 · AD-POS-13 · AD-RCPT-01 · AD-RCPT-02 · AD-NET-01 · AD-NET-02 · AD-PERF-01 · AD-PERF-03 · AD-PERF-04 · AD-STATE-01 · AD-STATE-02 · AD-STATE-03 · AD-STATE-05 · AD-STATE-06 · AD-GOAL-01 · AD-GOAL-02 · AD-GOAL-03 · AD-GOAL-05 · AD-FORM-10 · AD-FORM-11 · AD-FORM-12 · AD-RSN-01 · AD-RSN-02 · AD-DET-03 · AD-PERM-02 · AD-QA-01 · AD-QA-03
- **Implements (ADR):** ADR-001 (rule 1, the 13 module folders) · ADR-002 (`receipt.render`) · ADR-011 · ADR-012 · ADR-013 · ADR-014
- **Depends on:** `add-repo-scaffold` · `add-shared-ui-components` · `add-foundation-auth-access`
- **Repos:** `point-barber` (code, seed, tests — no migration) · `point-sdd` (this change, the brief) — ADR-016
- **Owner:** Dev 2 — API, screens and tests end to end; Dev 1 reviews

## မြန်မာ အတိုချုပ်

- ဒီ change ပြီးရင် barber တစ်ယောက်က **ကိုယ့်ဖုန်း** နဲ့ walk-in customer တစ်ယောက်ကို **START → Service ပြီး → ငွေယူ (Cash / KBZPay / ခွဲပေး) → FINISH → receipt PDF** အထိ အစအဆုံး လုပ်လို့ရပြီ။
- ဈေးကို **system က တွက်** တယ် (B3 မှာ Ko Min ဆံပင်ညှပ် 8,000 · Ko Aung 10,000) — barber ဈေးမရိုက်ရ။ KBZPay = reference မဖြစ်မနေ၊ နံပါတ်တူ ၂ ခါ မရ။ KBZPay ပိုလွှဲရင် (8,000 ကို 10,000) အမ်းငွေ 2,000 ကို FINISH မှာ system က အလိုအလျောက် မှတ်ပေးတယ်။
- FINISH လုပ်တာနဲ့ receipt နံပါတ် `B3-2026-OCT-00001` ထွက် (ဆိုင်ခွဲ + လ အလိုက် ဆက်တိုက်၊ နံပါတ် မကျော်) → အဲ့ sale ကို ပြင်မရတော့။ Receipt = English PDF — ဖုန်းတိုင်းမှာ ကြည့် / share လို့ရ၊ ပြန်ဖွင့်တိုင်း ပုံတူ။ ခလုတ် ၂ ခါ နှိပ်မိ / internet ပြတ်ပြီး ပြန်ပို့လည်း စာရင်း ၂ ခါ မဝင်ဘူး။
- **Pilot (ဆိုင်မှာ တကယ်စမ်း) အတွက် ဒီ change တစ်ခုတည်းနဲ့ မလုံလောက်သေးပါ** — server တင်ဖို့ (`add-staging-deploy`)၊ internet ပြတ်ချိန် စက္ကူမှတ်တမ်းကို ပြန်သွင်းဖို့ (`add-late-entry`)၊ pilot ဆိုင်ခွဲရဲ့ တကယ့် barber / service / ဈေး ထည့်ဖို့ (`add-pilot-data-seed`) လိုသေးတယ်။
- **မပါသေးတာ:** discount · refund / ပြင်ဆင်ချက် · နောက်မှသွင်း (late entry) · ကိုယ်စားမှတ် · ပစ္စည်းရောင်း · Bluetooth print · booking ကနေ START · အိမ်အရောက် service · စာရင်းပိတ် · realtime — နောက် change တွေမှာ လာမယ် (အောက်က Non-goals)။
- မေးခွန်း **၇ ခု** (S2 · S3 · S7 · S8 · S16 · S17 · S18) ကို owner က 02/Oct/2026 13:08 မှာ default အတိုင်း ဖြေပြီးပြီ — ဒီ change ကို **စလို့ရပြီ**။

## Why

The biggest risk of the whole system is real-time recording (RISK-01, `docs/ux/admin-panel.md` §1.2): in Fresha
today every service is recorded hours later. The plan therefore starts code with the walk-in → checkout
vertical slice (D-PLT-18) so that barbers can try it on their own phones early (REC-03, D-VIS-11, AD-QA-04).
Nothing sellable exists until a barber can run **Today → START → COMPLETE → checkout (cash / KBZPay / split) →
FINISH → receipt PDF**, with money that is correct from the first sale: server prices, integer MMK, idempotent
submits, a gapless receipt number and an immutable finished sale.

## What Changes

- **Today (barber home):** the barber's open visits first, with the next action and the "Awaiting payment"
  warning; the centre **＋ Start**; empty, loading, error and offline states.
- **START walk-in:** barber + branch only, one tap; optional first-service chips; creates the visit and its
  OPEN sale in one transaction; idempotent (`Idempotency-Key`); blocked while the barber has a completed,
  unpaid visit (422 `unpaid_visit_open`) or the day is closed (422 `day_closed`).
- **Service lines:** add and remove (with reason) on the OPEN sale; the price comes from the server quote
  (branch price, barber price wins) on the visit's business date and is snapshotted; eligibility only warns.
- **COMPLETE / INCOMPLETE:** "Service done · Take payment" needs ≥ 1 service; "Mark incomplete" with a reason
  cancels the sale so the barber is never stuck.
- **Payments:** Cash (one tap records the remaining amount), KBZPay (reference required, format from the
  method, unique per method), split; cash never above the remaining amount; a non-cash over-transfer shows
  "Change to return" and is recorded automatically at FINISH as an overpayment return with an RF number
  (owner B5); void with a reason; every add idempotent.
- **FINISH:** one transaction in the one lock order (day lock → payroll lock → sale → visit → customer →
  payments → receipt counters); customer found or created by phone (optional); `B3-2026-OCT-00001` from
  `receipt_counters`; sale and visit become immutable (API state check + the four DB guard triggers);
  `expected_total_amount` protects against a changed total; repeat = 200 with the same number.
- **Receipt:** rendered on the server in English (HTML → headless Chromium → PDF + 1-bit PNG), stored once,
  identical on every reopen; "View / share PDF" on every device; the refund receipt of the automatic change.
- **"Was it saved?"** lookup by `client_request_id` after a lost reply.
- **The price quote endpoint** with its locked refusals (`outside_window`, `day_closed`) and the services list
  of a branch — the two operational reads the POS needs.
- **Base seed (every environment):** the system payment methods CASH and KBZPAY (P4-RULE-19). **Fixture seed
  (development / test):** the fixture KBZPay pattern, the customer Ma Su, eligibility rows, opening hours and
  the Part 4 codes of the fixture roles.
- **Platform pieces this slice brings** (no earlier change has them): the `receipt.render` job on the
  `JobsModule` that `add-foundation-auth-access` provides, the `DocumentRenderer` with the receipt templates in
  `packages/documents`, Chromium and the fonts in the API image, bucket storage for generated files (MinIO in
  development), and the module service seams `DayLock` and `PayrollLock` (advisory lock + the check against
  tables that are still empty).
- **Shell:** `BottomNav` (Today with its badge, the centre ＋ Start), the branch default and the redirect to
  Today are added to the layout in which the foundation change mounts `AppShell`.

**What the barber sees until later changes land**

| Area | In this change | Arrives with |
| --- | --- | --- |
| Today | date, branch chip, "In progress" list, ＋ Start | clock-in chip, no-show alarm, next bookings, earnings tile, bell — their own changes |
| Arrival choice | the step shows "Walk-in" only | "Has a booking" — `add-booking-visit-start` |
| Live updates | data is fetched on open, on focus, on reconnect and after each own action — a change made on another device appears then, not instantly | `add-realtime-gateway` |
| Success screen | "View / share PDF" + "Next customer"; no Print button and no print hint | `add-android-shell` |
| A finished receipt | reachable from the success screen and by its link `/sales/<id>` | `add-receipts-list-lookup` |
| Outage | offline banner; the help page says to write the service on paper — it is entered with Late entry; no other procedure exists | `add-late-entry` (built before the pilot) |
| Closed day | cannot happen — no screen closes a day yet | `add-daily-closing` |
| Receipt header and footer | company and branch text, opening hours; no logo and no thank-you line (no upload path and no setting value exist yet) | `add-company-profile` · `add-settings-store` |
| Another barber's sale | the API honours `visit.update`, `visit.delete`, `sale.finish_override`; a holder reaches the sale only by its link | `add-visit-manager-override` (visits list, notification) |

**Parts of locked contracts that are absent in this change** (not built, not refused with an invented answer —
each arrives with the change named in Non-goals):

- `POST /v1/visits`: the members `booking_id`, `performed_by_employee_id`, `proxy_reason`,
  `performer_change_reason`, `location_type`, `home_address`, `late_entry` are not part of the request schema
  yet; the performer is always the caller and the location is the branch.
- `POST /v1/sales/{id}/items`: `line_type` has the one value 1 SERVICE; `product_id`, `quantity`,
  `service_variant_id` are not part of the schema yet.
- `GET /v1/services`, `GET /v1/service-categories`, `GET /v1/payment-methods`: the management filters
  (`status`, `include_archived`, `sold`, `include_counts`) are not read yet; the operational result is returned.
- `Sale.commission_estimate` is `null`; `Sale.actions.override_price`, `request_discount`, `refund`, `adjust`
  are `false`.
- The realtime events of Part 4 §10 and the notification `sale.finished_for_you` are not emitted.

## Capabilities

### New Capabilities

- `visits`: Today, START walk-in and its service chips, the offline help, service lines, COMPLETE, INCOMPLETE,
  the visit / checkout header, access to a visit, the request lookup.
- `sales-checkout`: totals, FINISH and its gates, receipt number, business date, immutability, access to a
  sale, the receipt document and its pipeline, the Finish and success screens, the audit trail of the flow.
- `payments`: the two system methods and the active list, cash, KBZPay, split, over-transfer change,
  idempotent add, void, collected-by default.
- `services-pricing`: only the operational reads — services sold at a branch (with their categories) and the
  price quote.
- `customers`: only the phone lookup and match-or-create at FINISH.

### Modified Capabilities

None — `openspec/specs/` is empty.

## Impact

- **API (point-barber `apps/api/src/modules`)** — only the bounded contexts of ADR-001: `delivery` (visits),
  `sales` (sales, lines, receipt counters, payment methods, payments, the automatic change refund, receipts),
  `catalog` (services list, categories, price quote, eligibility lookup), `booking` (customers: lookup and
  match-or-create), `cash-closing` (`DayLock`), `payroll` (`PayrollLock`), `platform` (the `receipt.render`
  queue, `DocumentRenderer`, storage, generated attachments). 19 endpoints.
- **Database:** no design change and no migration — the baseline of `add-repo-scaffold` holds all 91 tables.
  Uses DB Part 4 v1.2 (`visits`, `sales`, `sale_items`, `payment_methods`, `payments`, `receipt_counters`,
  `refunds` + the four guard triggers) and reads Part 1 (`branches`, `employees`, `employee_branches`), Part 2
  (`services`, `service_categories`, `branch_services`, `service_prices`, `employee_service_eligibilities`),
  Part 3 (`customers`), Part 5 (`payroll_runs`), Part 7 (`daily_closings`), Part 8 (`attachments`,
  `audit_events`, `branch_opening_hours`).
- **Catalogues and seed:** `packages/shared/definitions/permissions.json` gains the 22 Part 4 codes; the
  seed-role sets of Manager and Barber gain their Part 4 codes; the base seed gains CASH and KBZPAY. No
  settings file changes: `receipt.printer_width_mm` (58) and `booking.advance_window_days` (14) are read
  through the foundation's `SettingsReader`.
- **Web (point-barber `apps/web/app/staff/(authed)`):** `BottomNav` in the layout; routes `/today`,
  `/visits/new`, `/sales/[id]`, `/help/offline`; new language namespaces `today`, `pos`, `receipt` and new
  `error.*` keys in both language files.
- **Packages:** `packages/shared` (Zod DTOs, `subtractMoney` / `multiplyMoney` / `maxMoney`, receipt-number
  formatter, phone mask, job name), `packages/documents` (receipt + refund receipt templates, fonts),
  `packages/i18n` (keys). The lint rule `point/no-number-money` is switched on for `apps/api`.
- **Engineering docs (point-barber):** table ownership and the advisory-lock keys of this change are recorded
  in `docs/engineering/module-map.md`.
- **Operations:** API image grows by Chromium + fonts; new environment values for the bucket; MinIO in
  `docker-compose.dev.yml` and CI.
- **Pilot:** this change does not make the pilot possible on its own. The pilot also needs a server
  (`add-staging-deploy`), late entry (`add-late-entry` — D-VIS-13 is how an outage is recorded) and the pilot
  branch's real data (`add-pilot-data-seed`: barbers with their Google addresses, services, prices, the real
  KBZPay pattern). The fixture people are test accounts and are never loaded on a pilot server.

## Non-goals

Left for later changes (names from `docs/plan/roadmap.md`):

- Discount codes and discount requests — `add-discount-codes`, `add-discount-requests`.
- Manual refunds — `add-refunds`. (The automatic change return of owner B5 **is** in this change because
  P4-RULE-10 makes it part of the FINISH transaction.)
- Sale adjustments, customer and KBZPay-reference correction after FINISH, difference sale —
  `add-sale-adjustments`.
- Late entry — `add-late-entry`.
- Proxy recording (B records for A) — `add-proxy-recording`.
- Product lines, product-only sale and stock — `add-product-lines`. `P4.SAL.05` (option change, product
  quantity) is entirely out: a SERVICE line always has quantity 1.
- Bluetooth printing and the Android shell — `add-android-shell`. The server already stores the PNG it will
  print.
- Receipts list of a day and lookup by number (`P4.RCP.03`, `P4.RCP.04`) — `add-receipts-list-lookup`.
- Booking-linked visits — `add-booking-visit-start`.
- Home-service visits and the transport fee line — `add-home-service-visits`.
- Option-grid services (colour / perm, D-SVC-05) — `add-option-services`.
- Price override (`sale.override_price`) — `add-price-override`.
- The visits list (AD-POS-15) and the notification `sale.finished_for_you` — `add-visit-manager-override`.
- Tax and service charge — `add-tax-service-charge`. Both switches are OFF (D-PAY-08 default) and no screen
  can switch them on before `add-settings-store`; this change does not compute them.
- KBZPay verification, daily closing, the exclusive day lock — `add-daily-closing`.
- Commission estimate line — `add-commission-estimate`.
- "Collected by" picker (`P4.SAL.14`, `P4.PAY.04`) — `add-payment-collector-picker`.
- Payment-method administration (`P4.PMT.02` … `P4.PMT.06`) and the screen that sets the KBZPay pattern —
  `add-payment-methods-admin`.
- Realtime events and push to other devices — `add-realtime-gateway`.
- The dead-letter notification `job.failed` and the jobs panel — `add-notifications-inbox`. Until then a
  `receipt.render` job that fails on its last attempt is logged as an error; the receipt still opens because
  the request renders it.
- Company logo on the receipt — `add-company-profile`. The thank-you text — `add-settings-store`.
- Service, price and eligibility administration — `add-service-catalogue`, `add-service-prices`,
  `add-service-eligibility`.

## Open questions

**The change is ready to apply.**

### Needs the owner's answer

None — all answered by the owner on 02/Oct/2026 13:08 (review §0.11).

### Answered by the owner (02/Oct/2026 13:08 — review v5.2.17 §0.11)

| ID | Answer | Recorded in |
| --- | --- | --- |
| S2 | This change stays whole — an accepted exception to "1–3 days, 20–30 test cases" (41 requirements, 210 scenarios, 145 tasks). Three pull requests (A: data + API up to COMPLETE · B: payments, FINISH, receipt · C: screens + e2e); A and B merge on CI + review, the test workbook is generated and run on C. Dev 2 does it end to end; Dev 1 reviews. | D-PLT-20 · CG-GIT-05 |
| S3 | `platform-runtime` and `ui-foundation` are approved capabilities (the list is 25). This change adds no requirement to either. | D-PLT-20 · `openspec/config.yaml` |
| S7 | The START sheet shows the first 6 simple services of the branch in catalogue order (category order, then service order); the picker has search + categories and no "Frequent here" section. No usage ranking in V1. | AD-POS-03 · AD-POS-05 (admin guideline v1.7) |
| S8 | Each endpoint's reason field is the one Part 4 defines (`reason`, `added_reason`, `override_reason`); the shared reason dialog's generic result is mapped to it by the calling screen. | API-DATA-11 (Part 0 v1.6) |
| S16 | No interim rule for paper records. `add-staging-deploy`, `add-pilot-data-seed` and `add-late-entry` come before the pilot; the pilot signs in with Google in the browser tab. | D-PLT-20 · D-VIS-13 · `docs/plan/roadmap.md` (pilot gate) |
| S17 | `correction_path` is omitted for a payment add on a FINISHED sale and for every write on a CANCELLED sale (409 `invalid_transition` with `context.status` only). Line add → `difference_sale`, line removal and payment void on a FINISHED sale → `refund`. | P4-RULE-01 (Part 4 v1.1) · P4-RULE-09 |
| S18 | The new texts are used as written in the pull request — English from the AD wording where one exists, Myanmar written there — and the owner reads and corrects them in the pull request; keys and behaviour do not change. Keys of this change: `today.empty.title`, `today.empty.body`, `pos.saved.checking`, `pos.saved.notSaved`, `pos.arrival.walkIn`, `pos.checkout.referenceInUse`, `pos.help.offline.body`, the two reasons under a disabled Finish button, the `receipt.*` labels, the opening-hours line `Mon–Sun 9:00 AM – 9:00 PM`, and the Myanmar text of every new `error.*`, `today.*` and `pos.*` key. | D-PLT-20 |

### Recorded readings

No decision needed — the reading used changes nothing locked; listed so nothing is resolved silently
(D-PLT-13).

1. **A DB comment that pre-dates owner B5.** DB Part 4 notes say "Σ payments (non-voided) = total at FINISH"
   (an application note, not a constraint); D-PAY-05 and P4-RULE-09 / 10 allow a non-cash payment above the
   total, returned as change. Reading: D-PAY-05. The comment is updated with the next DB note.
2. **Finish with an empty phone field is "Skip".** AD-POS-12 shows the phone field with a "Skip"; AD-GOAL-01
   counts 7 taps ending with Finish for a customer who gives no phone. Reading: tapping Finish with the field
   empty sends `customer: null`; "Skip" only collapses the field.
3. **`format=json` of a receipt** is built from the sale and the branch as they are now; only the stored PDF
   and PNG are frozen (P4-RULE-18 freezes "the stored files"). After a branch edit the on-screen receipt can
   show newer branch text than the PDF, which is the record.
4. **`duplicate_reference.context.receipt_number`** is `null` while the sale that holds the reference is still
   OPEN (an OPEN sale has no number — `sales_status_fields_chk`).
5. **`GET /v1/me/requests/{key}`** reports a START key as `resource_type` `visit` (visit and sale share the
   key).
6. **`CustomerLookup.last_visit_at`** = the finish time of the customer's latest FINISHED visit in the
   caller's read scope (P3-RULE-03 filters customer statistics to the read scope).
7. **The quote function is built whole** (location BRANCH and HOME, variant key, `price_source` 1–4), because
   a partial resolver would answer wrongly for inputs the locked contract defines. The price-grid screens stay
   with `add-service-prices`.
8. **Locks not named by P4-RULE-22 for the first write** — line add / remove, COMPLETE and INCOMPLETE take
   only row locks (sale, then visit, then payments); the day lock is taken by START, payment add / void and
   FINISH, as their rules say.
