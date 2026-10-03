# Spec fixtures — the one story every scenario tells

> **What this is:** the named people, branches, services, prices and dates used in OpenSpec scenarios,
> test cases and the development seed (`pnpm db:seed` in point-barber). One shared set means a reviewer
> can check any scenario by hand and the test-case generator reuses the same data (D-PLT-20).
> **What this is not:** go-live data. Real staff, prices, salaries, opening float and KBZPay reference
> pattern come from the owner before go-live (review §0.4 #11). All names here are invented; e-mail
> addresses use the reserved `.test` domain.
> **Changing it:** add rows freely; never change an existing value once a change that uses it has been
> proposed (test workbooks quote these numbers).

## မြန်မာ အတိုချုပ်

Spec ထဲက scenario တိုင်း၊ test case တိုင်း ဒီဖိုင်ထဲက နာမည် / ဆိုင်ခွဲ / ဈေး / ရက်စွဲ ကိုပဲ သုံးပါ — တစ်ပုံစံတည်း ဖြစ်မှ
လက်နဲ့ တွက်စစ်လို့ လွယ်တယ်။ ဒါတွေက **စမ်းသပ်ဖို့ data** ပဲ — ဆိုင်ရဲ့ တကယ့် data မဟုတ်ပါ။

## 1. Company and branches

| Code | Name (EN) | Name (MM) | Notes |
| --- | --- | --- | --- |
| – | Point Barbershop | ပွိုင့် ဘာဘာရှော့ | the one company (D-ORG-03) |
| `B1` | Point 1.0 | ပွိုင့် ၁.၀ | Haircut 6,000 |
| `B2` | Point 2.0 | ပွိုင့် ၂.၀ | Haircut 7,000 |
| `B3` | Point 3.0 | ပွိုင့် ၃.၀ | Haircut 8,000 — the branch most scenarios use |

Branch code pattern `^[A-Z0-9]{1,10}$` (API Part 1 §13 #4). Timezone Asia/Yangon for all three.

## 2. People

| Code | Person (EN / MM) | Role (seed role · scope) | Branches | E-mail | Used for |
| --- | --- | --- | --- | --- | --- |
| E001 | U Kyaw Zin / ဦးကျော်ဇင် | Admin · company | B1, B2, B3 (three branch assignments) | `kyawzin@point.test` | company admin, refunds, reopen |
| E002 | Ma Hnin / မနှင်း | Manager · branch B3 | B3 | `hnin@point.test` | approvals, override finish at B3 |
| E003 | Ko Zaw / ကိုဇော် | Manager · branch B1 | B1 | `zaw@point.test` | out-of-scope cases against B3 |
| E004 | Ko Aung / ကိုအောင် | Barber · branch B3 | B3 | `aung@point.test` | the performer in most scenarios; own price for Haircut |
| E005 | Ko Min / ကိုမင်း | Barber · branch B3 | B3 | `min@point.test` | second barber at B3; proxy recording |
| E006 | Ko Htet / ကိုထက် | Barber · branch B1 | B1 | `htet@point.test` | barber at another branch |
| E007 | Ko Thura / ကိုသူရ | Barber · branch B2 | B2 | `thura@point.test` | iPhone user (no Bluetooth print) |
| E008 | Ma Thida / မသီတာ | none yet — user INVITED, never signed in | B3 | `thida@point.test` | first sign-in turns INVITED into ACTIVE |
| E009 | Ko Naing / ကိုနိုင် | Barber — user DISABLED, employee INACTIVE; B3 assignment ended 30/Sep/2026 | (B3, ended) | `naing@point.test` | deactivated account — sign-in refused |

Seed-role names in Myanmar (အက်ဒမင် / မန်နေဂျာ / ဘာဘာ) are placeholders until the owner reviews the language files.

Customers (no login — D-CUS):

| Customer | Phone as typed | Normalised (E.164) | Notes |
| --- | --- | --- | --- |
| Ma Su | `09 7712 3456` | `+95977123456` | returning customer at B3 |
| Ko Phyo | `09 4500 1122` | `+95945001122` | first visit |
| (no name) | – | – | anonymous walk-in — phone optional (D-VIS-02) |

## 3. Services and prices (fixture)

| Service (EN / MM) | Duration | B1 | B2 | B3 | Barber price |
| --- | --- | --- | --- | --- | --- |
| Haircut / ဆံပင်ညှပ် | 30 min | 6,000 | 7,000 | 8,000 | Ko Aung at B3 = 10,000 |
| Shave / မုတ်ဆိတ်ရိတ် | 15 min | 3,000 | 3,000 | 3,000 | – |
| Hair wash / ခေါင်းလျှော် | 10 min | 2,000 | 2,000 | 2,000 | – |
| Hair colour / ဆံပင်ဆေးဆိုး | option grid (colour × length) | – | – | from 25,000 | used only by changes that cover option pricing (D-SVC-05) |

All amounts are whole MMK. Tax and service charge are OFF (D-PAY-08 default).

Worked totals used again and again:

- Ko Min, Haircut at B3 = **8,000**
- Ko Aung, Haircut at B3 = **10,000** (barber price)
- Ko Min, Haircut + Shave at B3 = 8,000 + 3,000 = **11,000**
- Ko Aung, Haircut + Shave + Hair wash at B3 = 10,000 + 3,000 + 2,000 = **15,000**

## 4. Payments

| Method | Fixture values |
| --- | --- |
| Cash | exact, or tendered more with change (tendered 10,000 for 8,000 → change 2,000) |
| KBZPay | reference `KBZ0001234567` … `KBZ0001234569`; a reference is unique per payment method (D-PAY-02). Fixture reference pattern of the seeded KBZPAY method: `^KBZ[0-9]{10}$` (so `KBZ123` is refused). The real pattern is a payment-method setting supplied by the owner |
| Over-transfer | total 8,000, KBZPay 10,000 → change to return 2,000 in cash, recorded at FINISH as an overpayment return `B3-RF-2026-OCT-00001` (owner B5) |
| Split | 11,000 = Cash 5,000 + KBZPay 6,000 |

## 5. Dates, times, numbers

- "Today" in scenarios = **Monday 05/Oct/2026**, business date `2026-10-05`. "Yesterday" = `2026-10-04` (Sunday).
- Shop hours in the fixture 9:00 AM – 9:00 PM. Typical times: START 10:05 AM, COMPLETE 10:40 AM, FINISH 10:42 AM
  (`2026-10-05T10:42:00+06:30`).
- Receipt numbers at B3 in October start at `B3-2026-OCT-00001` (gapless per branch and month — D-PAY-06);
  refund receipts `B3-RF-2026-OCT-00001`.
- Month boundary cases use `2026-10-31T23:59:00+06:30` (still October) and `2026-11-01T00:00:00+06:30`
  (November — counter restarts at `B3-2026-NOV-00001`).
- Day boundary cases use `23:59` and `00:00` MMT — never UTC midnight (D-PLT-15).

## 6. Devices

| Device | Who | Notes |
| --- | --- | --- |
| Android phone, Chrome / Android shell, 360 × 800 | Ko Aung, Ko Min | primary POS device; Bluetooth print later |
| iPhone, Safari PWA | Ko Thura | PDF / Share only |
| Laptop 1280 × 800 | U Kyaw Zin, Ma Hnin | admin screens |

## 7. Test-environment login

The system is passwordless (D-AUTH-01). In development and test environments the e-mail OTP is delivered
to **Mailpit** (ADR-007), and automated tests read the code from Mailpit's API. There is no password and
no test-only login endpoint. Google login is tested manually.

## 8. Catalogue-only demo rows (`/dev/ui`)

Used by `add-shared-ui-components` to show components that have no data source yet. They follow the rows above
and are never loaded by `pnpm db:seed`. **They are catalogue-only**: the receipt numbers and sales below are
demo rows for `/dev/ui`, not the sequence of the walk-in scenarios (`add-walkin-visit-checkout` tells its own
story of 05/Oct/2026 with its own receipt numbers).

| Fixture | Rows |
| --- | --- |
| Sales at B3 on 05/Oct/2026 | `B3-2026-OCT-00001` Ko Min · Haircut · 8,000 — `00002` Ko Aung · Haircut · 10,000 — `00003` Ko Min · Haircut + Shave · 11,000 — `00004` Ko Aung · Haircut + Shave + Hair wash · 15,000; total 44,000 (8,000 + 10,000 + 11,000 + 15,000) |
| Paging list | 56 generated rows |
| Booking cancel reasons (seed of DB Part 3) | `Customer ပြောင်းချင်` / "Customer wants to change" · `Barber မအား` · `Customer မလာ` (system) · `Other` (`requires_note`) |
| Hair colour at B3 (shop) | Black: Short 25,000 · Medium 30,000 · Long 35,000 — Brown: Short 28,000 · Medium 33,000 · Long not sold; 90 min for every sold cell |
| Revenue by branch | Point 1.0 60,000 · Point 2.0 70,000 · Point 3.0 44,000 |
| Notifications | MONEY 10:37 AM and BOOKING 8:42 AM on 05/Oct/2026 · SECURITY 9:01 AM on 04/Oct/2026 |
| Discount approval | Ko Min at Point 3.0 · Haircut + Shave · subtotal 11,000 · discount 1,000 · total 10,000 |
| Receipt | `B3-2026-OCT-00003` · Ma Su `09•••••456` · Cash 5,000 + KBZPay 6,000 `KBZ0001234567` |

## 9. Seed order (point-barber `db/seed`)

**Base seed** (every environment, on start — the system rows the locked design calls seeds): permission
catalogue, the three seed roles, the company row, and the payment methods **CASH** and **KBZPAY** (API Part 4
§8, P4-RULE-19 — KBZPAY's `reference_regex` is empty until the owner gives the real pattern).
**Fixture seed** (`pnpm db:seed`, development / test only, refused in production): §1–§4 of this file, in
numbered fixture modules — foundation (branches, people, role assignments, one service category, Haircut /
Shave / Hair wash and their prices) and walk-in (the fixture KBZPay pattern `^KBZ[0-9]{10}$`, the customer
Ma Su, eligibility rows, opening hours, Part 4 codes on the fixture roles). Hair colour is not seeded until
the option-pricing change. The pilot's real data comes from `add-pilot-data-seed`, never from fixtures.

