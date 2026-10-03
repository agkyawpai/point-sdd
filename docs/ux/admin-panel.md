# Point Barbershop — Admin Panel & Staff App · UI/UX Guideline

> **File:** `docs/ux/admin-panel.md` (repo path) · **Version:** **v1.7** · **Date:** 02/Oct/2026 (**v1.7 = owner sheet 3 "အကုန် OK", 02/Oct/2026 13:08 (review §0.11) — S7 service chips in catalogue order · S15 focus outline / input border until the palette arrives** · **v1.6 = owner answers at the OpenSpec stage, 02/Oct/2026 morning — OPEN-40 OK · colour / design-reference answers (review §0.10)** · **v1.5 = owner one-sheet 02/Oct 00:06 — API Parts 4–8 deltas (review §0.8 "အကုန်လုံး OK")** · v1.4 = owner scope choice A — ADR-012 + owner answers to the API Part 3 sheet (review §0.7 "အကုန် OK"), 01/Oct 23:30 · v1.0 = draft written 30/Sep night → 01/Oct · v1.1 = owner answers, 01/Oct morning · v1.2 = owner's second round of answers, 01/Oct 10:47 · **v1.3 = owner decisions 01/Oct 21:20 during API lock**)
> **Status:** 🔒 **APPROVED by the owner — 01/Oct/2026 11:09 (D-UX-03 locked, REC-40 ✅); v1.6 = owner answers of 02/Oct/2026 morning applied; v1.7 = owner sheet 3 of 02/Oct/2026 13:08 applied (D-UX-03 → v1.7).** **v1.7 changes** (review §0.11): AD-POS-03 / AD-POS-05 — **V1: the START sheet shows the first 6 simple services in catalogue order; the picker has no "Frequent here" section** (owner S7 — no usage ranking in V1) · AD-VIS-03 / AD-A11Y-02 — **until the palette arrives the focus outline is 2 px `var(--foreground)` and the input border is `var(--muted-foreground)`** (owner S15 — existing neutral tokens, no new colour) · §15 OPEN-30 row. No other rule changed. **v1.6 changes:** §15 **OPEN-40 closed** ("OPEN-40 OK" — DB Part 5 v1.2 / Part 7 v1.2; screens unchanged) · §15 OPEN-30: **admin palette not given yet → neutral scaffolding stays** (AD-VIS-03); the website has its own palette and overrides the colour tokens in the `site` tree (AD-VIS-01 note; website guideline v1.5 FE-VIS-01a) · new **AD-META-08** — design reference images in `point-barber/design-reference/admin-panel/`; the admin panel follows Fresha's layout about 80 % and must be easier to use (owner 02/Oct) · AD-META-05a path note (`app/staff/` — ADR-001) · AD-META-01 precedence written out as the seven tiers of `openspec/config.yaml` (API design, ADRs and the reference images now have a place; the first three tiers are unchanged) · AD-IMPL-06 component catalogue = the `/dev/ui` page (🔒 D-ENG-01) · weekday of two example dates corrected (30/Sep/2026 is a Wednesday). No screen rule changed. **Earlier:** v1.3 = owner decisions of 01/Oct 21:20 applied (D-UX-03 → v1.3); v1.4 = owner decisions of 01/Oct evening applied (D-UX-03 → v1.4); v1.5 = owner one-sheet answers of 02/Oct/2026 00:06 applied (D-UX-03 → v1.5). **v1.5 changes** (owner one-sheet 02/Oct 00:06 — API Parts 4–8 deltas; review §0.8 items A1–A3, B1–B12, C1–C12, D1–D9, E1–E8, F1–F12, G, H — every default accepted): AD-PERM-06 / 07 — **final permission codes of API Parts 3–8** (Part 3 🔒 D-API-04, Parts 4–8 🔒 D-API-05..09), rename map, seed roles, new level hint ***Private*** (C1) · checkout AD-POS-03 / 04 / 08 / 09 / 10 / 12 / 13 / 14 / 15 / 17 / 18, AD-RSN-02, AD-RCPT-01 / 02, AD-FORM-12, AD-CMP-06 (B1–B12, H) · attendance and payroll AD-ATT-01..04, AD-QR-02, AD-PAY-01..05, AD-DSH-01 / AD-TODAY-01 / AD-POS-07 estimate (C1–C12) · stock AD-STK-01..05, AD-RPT-04 ⑩ (D1–D9) · closing and finance AD-CLS-01 / 03..06, AD-STATE-06, AD-FIN-01..06, AD-DSH-04 (E1–E8) · platform AD-NAV-02, AD-WEB-02 / 03, AD-LIST-07, AD-RPT-01 / 04, AD-IMP-01, AD-AUD-01, AD-BAK-01, AD-NTF-02 / 04, AD-EMP-02, AD-QR-01 (F1–F12) · AD-SET-01 / 04 · §1.1, §4.3 · §15: `/public/barbers` closed (P8.PUB.04 `today_branches[]`), REC-37 ✅. *Fix-up 02/Oct (batch v5.2.15, no version bump):* AD-FIN-01 — the taker of a staff advance is shown only to payroll viewers (owner C1 + D-FIN-06, API Part 7 P7-RULE-01) · AD-SET-01 payroll / attendance settings cite owner C1 + Part 5 research D6 · sources → review v5.2.15. *Review fixes 02/Oct (independent review of the batch — no version bump):* AD-PERM-06 / 07 — **`receivable.issue` is a *Private* code** (owner C1 + C2) · AD-STK-02 — a user with `stock.update` recomputes · AD-POS-14 / 18 — the difference sale is created when the customer pays it and is finished before closing; late entry / Finish inside a finalized payroll period is refused (manual payroll line) · AD-CLS-05 — open difference sales and open sales holding earlier payments block closing · AD-FIN-01 / 02 / 03 — editing or cancelling a staff-advance cash out needs payroll rights; month-end conversion happens once the month is fully closed · AD-WEB-02 — a started closure is ended, not deleted · AD-PAY-05 · AD-BAK-01 · §15 OPEN-40 with a / b / c. *Reconcile 02/Oct (cross-part reconcile — no version bump):* AD-PERM-06 — 18 *Private* codes · AD-POS-17 — refund limits (🔒 D-PAY-05) · AD-CLS-06 — reopen warning inside a finalized payroll period · AD-FIN-01 — staff-advance taker visible with `payroll.view` or `receivable.issue` · AD-FIN-05 — "Decided by" on a rejected entry · AD-ATT-01 — "GPS not required" switches off the radius and the accuracy limit · AD-SCH-02 — no changes to one's own shifts for today / the past (422 `self_action`) · AD-PAY-02 — manual-line form sends `expected_updated_at` · AD-STK-04 — no receive note, a sent transfer can't be edited (409) · AD-STK-05 — a whole-branch count lists every active product · AD-WEB-02 — a closure starting today can still be deleted · AD-AUD-01 — own entries always visible, employee entries under the primary branch. **v1.4 changes** (review §0.2 (ဍ)): AD-PERM-03 / 06 / 07 — **data level decides how far a grant reaches** (company master read-only at branch scope, branch data in scope, customers shared — ADR-012) + Part 3 codes (`customer.*`, `booking.*`, `booking_cancel_reason.*`) · AD-BKG-01 phone fixed on a booking, name editable (#10) · AD-BKG-02 retry safety closed (ADR-004) · AD-BKG-09 alarm also to that branch's managers (`booking.update`) + manual **Cancel as no-show** (#2, #3) · AD-CUS-01 / 02 — Inactive meaning (#7), preferred barber rule (#6), history within the viewer's branches · §15 rows. **v1.3 changes** (review §0.2 (ဌ)): permission codes = **CRUD per menu + named special actions** (owner #25 / #26 — ADR-011) → AD-PERM-06 code map, **AD-PERM-07 role matrix columns View · Create · Update · Delete + Special actions + Company-admin badge + seed roles Admin / Manager / Barber**, AD-NAV-02 / AD-WEB-02 code names · AD-SCH-01 save copy = shifts updated **now** (API Part 2 §16 #9) · §15 closed rows (rating code `employee.rating_update`, 14-day window for staff — D-BKG-06, booking idempotency — ADR-004). Every ⚠️ rule in this file is now binding alongside the 🔒 ones; ★ items (colour palette, logo, MM label wording) are values still to be supplied and do not block implementation. Changes after this point = a new version + a note in the review's register. **v1.2 changes** (owner 01/Oct 10:47 — review §10.10): OPEN-34 ✅ the 10 reports are confirmed (AD-RPT-04 → 🔒 D-RPT-01) · own-earnings visibility = **company switch for all + per-barber override** (AD-DSH-01; `employees.show_own_earnings` nullable, setting `dashboard.show_own_earnings_all` — DB Part 1 v3.4) · checkout estimate gating confirmed (AD-POS-07) · app money unit stays `ကျပ်` (AD-FMT-01 confirm closed) · barber **rating** entered by admin / manager (AD-EMP-02, AD-WEB-02 — `employees.public_rating`) · colour palette arrives at the spec stage (OPEN-30 timing). **v1.1 changes** (owner answers 01/Oct — review §0.2 (စ), §10.9): fonts set (§3.2) · OPEN-32 ✅ digits 0–9, English month, AM/PM, **receipt always English** (§7.1, AD-RCPT-01) · OPEN-33 ✅ language saved on the user account → **DB Part 1 v3.3 `users.ui_language`** (AD-L10N-06) · OPEN-10 ✅ own sales / commission **OFF by default, admin switches it on per barber** → `employees.show_own_earnings` (Part 1 v3.3; AD-DSH-01, AD-POS-07, AD-EMP-02) · OPEN-20 ✅ no device count — PDF / share works for everyone, Android prints (AD-RCPT-02) · OPEN-36 ✅ discount split across **service and product lines** (AD-POS-09) · OPEN-34 still open — explained with a proposed list of 10 (AD-RPT-04).
> **Companion file:** `docs/ux/frontend-website.md` (public website and the booking modal).
> **Current sources (v1.7):** `docs/decisions/point-barbershop-system-review-v5.2.18.md` + `docs/decisions/decision-register.md` (Appendix A; §0.10 = the owner answers of 02/Oct morning; §0.11 = sheet 3, answered 13:08) · `docs/db/` (Part 5 **v1.2** · Part 7 **v1.2**; 91 tables) · `docs/api/` (`00-conventions.md` **v1.6** … `08-platform.md`; Part 1 = **v1.6**, Parts 4–7 = **v1.1**) · `docs/adr/` (ADR-001…016) · `docs/ux/frontend-website.md` **v1.7**. The line below names the files this guideline was first written against (older file names, same content lineage).
> **Sources:** `point-barbershop-system-review-v5.2.15.md` (Appendix A decision register, §5, §6, §10.9–§10.10 owner answers; the owner one-sheet answers A1–H = review §0.8 — answered on v5.2.14) · `db/` (DBML Part 1–8, 91 tables — Part 1 v3.4) · `api/` — API design Parts 0–8 (`api-00-conventions-v1.5.md` · `api-01-foundation-v1.5.md` · `api-02-catalogue-scheduling-v1.4.md` · `api-03-customers-booking-v1.1.md` · `api-04-visits-sales-payments-v1.0.md` · `api-05-commission-payroll-attendance-v1.0.md` · `api-06-inventory-v1.0.md` · `api-07-finance-closing-v1.0.md` · `api-08-platform-v1.0.md`; rule / endpoint IDs `P<n>-RULE-…` / `P<n>.<MODULE>.<nn>` cited below) · [Laws of UX](https://lawsofux.com/) (30 laws, checked 30/Sep/2026) · Fresha research repo `naingaunglinn/fresha-research` (commit `7137637`, sandbox + live study).
> **Not in this file (still ★):** the **admin palette** (🔒 D-UX-02, ★ OPEN-30 — asked on 02/Oct/2026 at the OpenSpec stage, not given yet; the shadcn/ui `neutral` scaffolding stays — AD-VIS-03, §15) and the **logo** file. Not a blocker for building: every colour is a token (AD-VIS-01). Font families are set (OPEN-31 ✅ — §3.2). This file names the tokens and the rules they must satisfy.

---

## မြန်မာ အတိုချုပ် (Owner အတွက်)

- ဒီဖိုင်က **Admin panel + ဝန်ထမ်း app** (barber ဖုန်း၊ manager၊ admin — login ဝင်ပြီးမှ မြင်ရတဲ့ screen အားလုံး) ရဲ့ UI/UX စည်းမျဉ်း ဖြစ်တယ်။ Claude Code က screen တစ်ခု ဆောက်တိုင်း ဒီဖိုင်ကို ဖတ်ပြီး rule ID (`AD-…`) ကို ကိုးကားရမယ်။
- Rule တိုင်းမှာ tag ပါတယ် — 🔒 = Appendix A ထဲက lock ပြီးသား ဆုံးဖြတ်ချက်ကနေ ဆင်းလာတာ (ပြောင်းလို့မရ) · ⚠️ = ဒီ guideline ရဲ့ အကြံ (owner approve မှ binding) · 🟡 = owner ဆုံးဖြတ်ရန် ကျန် · ★ = owner က တန်ဖိုး ဖြည့်ရန်။
- **v1.1 (01/Oct) — owner ဖြေပြီးသား:** font = **Pyidaungsu** (မြန်မာ) + **Manrope / Inter** (English) (§3.2) · ဂဏန်း **0–9**၊ လနာမည် **English** (`01/Oct/2026`)၊ **AM/PM** — ဘာသာ ၂ မျိုးလုံး · **Receipt = English** အမြဲ (§7.1, AD-RCPT-01) · ဘာသာ ရွေးချယ်မှုကို **user account** မှာ သိမ်း (`users.ui_language` — DB Part 1 **v3.3**) · Barber ရဲ့ ကိုယ့် sale / commission = **default OFF အကုန်**၊ admin က ပြစေချင်တဲ့ barber ကို တစ်ယောက်ချင်း ဖွင့် (`employees.show_own_earnings` — Part 1 v3.3; AD-DSH-01 / AD-POS-07 / AD-EMP-02) · iPhone အရေအတွက် မမေးတော့ — ဘယ်ဖုန်းနဲ့မဆို အလုပ်ဖြစ်အောင် (PDF / share = အားလုံး၊ print = Android) (AD-RCPT-02) · Discount ကို **service line + product line** နှစ်မျိုးလုံး ဈေးအချိုးနဲ့ ခွဲ (AD-POS-09)။
- **v1.2 (01/Oct 10:47) — owner ဒုတိယအကြိမ် ဖြေပြီးသား:** **Report ၁၀ ခု OK** → AD-RPT-04 စာရင်း = 🔒 (D-RPT-01) · ကိုယ့် sale / commission ပြတာ = **အကုန်လုံးကို ပြ (company switch) ရော၊ တစ်ယောက်ချင်း ပြ / ဖျောက် (override) ရော** နှစ်မျိုးလုံး ရ (setting `dashboard.show_own_earnings_all` + `employees.show_own_earnings` NULL = setting လိုက်) · checkout estimate line ကိုလည်း အဲ့ flag အတိုင်း ပြ (confirm ✅) · **admin app ငွေ = `ကျပ်` ဆက်ထား** (website ပဲ `Ks`) · website barber card **rating = admin / manager ပေး** (`employees.public_rating`, Employee › Profile; V2 = customer rating) · colour palette = develop spec ထုတ်ချိန်ကျမှ owner ပေး (Claude Code က အဲ့အချိန် တောင်း)။
- **v1.4 (01/Oct ည) — owner ဆုံးဖြတ်ချက်:** permission ✔ ဘယ်အထိ ရောက်လဲ = **data အဆင့်** (ADR-012) — company တစ်ခုလုံး data (service နာမည် / option, role, company setting) = company scope နဲ့မှ ပြင်ရ၊ branch scope ဆို **ကြည့်ရုံ**; ကိုယ့် branch data (ရောင်း / မရောင်း, ဈေး, schedule, booking, branch setting) = ကိုယ့် branch ပဲ; customer = မျှသုံး (history = ကိုယ့် branch ပဲ) — role matrix မှာ အဆင့် hint ပြ (AD-PERM-07) · booking မှာ ဖုန်း မပြင် / နာမည် ပြင်ရ · no-show alarm = barber + branch manager, ၄၀ မိနစ် မပြည့်ခင် "Customer မလာ" cancel ရ · customer Inactive = list မှာ default မပြ၊ ပြန်လာရင် Active · preferred barber = နောက်ဆုံး visit ၅ ခုထဲ ၃ ခု+။
- **v1.3 (01/Oct 21:20) — API lock ချိန် owner ဆုံးဖြတ်ချက်:** permission = **menu တစ်ခုချင်း CRUD** (`view` / `create` / `update` / `delete`) + approve / refund လို သီးသန့် action → role matrix = column ၄ ခု + Special actions (AD-PERM-06 / 07) · Admin = အကုန် ✔ · company admin = Role row ၅ ကွက်လုံး ✔ · pattern save ရင် shift **ချက်ချင်း** update (AD-SCH-01 စာသား)။
- **v1.5 (02/Oct 00:06) — owner one-sheet "အကုန်လုံး OK" (API Part 4–8):** permission code အကုန် **နောက်ဆုံးနာမည်** ရပြီ — Part 4 = ၂၂ ခု · Part 5 = ၂၃ · Part 6 = ၂၈ · Part 7 = ၂၇ · Part 8 = ၁၉ (AD-PERM-06) · လစာ / commission / advance = **Admin ပဲ** — role matrix မှာ အဆင့် ***Private*** (branch scope နဲ့ ကြည့်ရုံတောင် ✖ — C1) · barber တစ်ယောက် customer ၂ ယောက် တပြိုင်နက် ရ၊ ငွေမရှင်းရသေးတဲ့ visit ရှိမှ START ပိတ် (B1) · KBZPay ပိုလွှဲရင် ပိုငွေကို cash ပြန်အမ်း — auto မှတ် (B5) · % discount = ၁၀၀ ပြည့် (B6) · စာရင်းပိတ်ပြီးတဲ့နေ့ START / FINISH / ငွေ ✖ — admin reopen (B9) · refund = Admin ပဲ (B12) · clock-out = ခလုတ် + GPS (QR မလို — C10) · ကိုယ့် attendance ကိုယ် မပြင် / excuse မလုပ်ရ (C11) · ပစ္စည်းဝယ် = Manager draft → Admin post (D2) · customer ထိုင်ခုံပေါ် ရှိတုန်း စာရင်းပိတ်မရ (E2) · KBZPay ✔ ကို စာရင်းပိတ်ပြီးလည်း လုပ်ရ (E3) · report တစ်ခု = code တစ်ခု (F1) · Excel / PDF export = `data.export` (Admin — F2) · website ပြင်ခွင့် = `website.update` တစ်ခုတည်း (branch scope = ကိုယ့် branch ဖွင့်ချိန် / ပိတ်ရက် — F7)။
- **v1.6 (02/Oct မနက်):** ✅ **OPEN-40 ဖြေပြီး** ("OPEN-40 OK") — (a) payroll reopen = အဲ့ run ရဲ့ လစာ expense ကို "ဖျက်ပြီး" အမှတ်နဲ့ ထား (b) မှားထည့်မိတဲ့ လစာ row / plan ချိတ်တာ = archive (c) draft purchase / transfer line = ဖျက် + audit; screen မပြောင်း။ **Admin panel = Fresha ပုံစံ ၈၀ % ခန့် လိုက်၊ ဒါပေမဲ့ ပိုသုံးရလွယ်ရမယ်** (owner) — reference ပုံ = `point-barber/design-reference/admin-panel/` (AD-META-08)။
- **v1.7 (02/Oct 13:08 — sheet 3 "အကုန် OK"):** START မှာ ပြတဲ့ service chip ၆ ခု = **admin စီထားတဲ့ catalogue အစဉ်အတိုင်း** (V1 မှာ "အသုံးအများဆုံး" မတွက်; picker မှာ "Frequent here" အပိုင်း မပါ) · admin အရောင် မရခင် **focus ring = စာအရောင် (အမည်း)၊ input ဘောင် = မီးခိုးရင့်** — ရှိပြီးသား neutral အရောင်ပဲ၊ အသစ် မတီထွင်။
- **Owner ဖြည့် / ဖြေ ရန် ကျန်:** **admin panel colour palette** (★ OPEN-30 — website အရောင်ကတော့ ရပြီ; admin အတွက် မပေးသေးလို့ မီးခိုးရောင် neutral နဲ့ ဆက်ဆောက်ထားမယ်)၊ logo ဖိုင်။
- **ပြင်ချင်တာရှိရင်:** rule ကို ဖျက်မယ့်အစား ✖ ပြပြီး အကြောင်းပြချက် ရေးထားပါ (နောက်တစ်ခါ ပြန်မအဆိုပြုအောင်)။ ပြင်ပြီး approve လုပ်ရင် review ဖိုင်ရဲ့ Appendix A မှာ D-UX-03 ကို 🔒 ပြောင်းပါ။
- Laws of UX ၃၀ လုံးကို admin panel အတွက် ဘယ်လိုသုံးမလဲ — §2။ Fresha ကနေ ယူမယ့်ဟာ / ပိုကောင်းအောင်လုပ်မယ့်ဟာ / ရှောင်မယ့်ဟာ — §11။ အရေးကြီးဆုံး flow (walk-in → checkout → FINISH, daily closing) — §10။

---

## 0. How to use this document (Claude Code and developers)

**AD-META-01 · Precedence.** When sources disagree, this order wins: (1) Appendix A 🔒 decisions → (2) `docs/db/` DBML + constraints → (3) this guideline → (4) API conventions and parts (`docs/api/`) → (5) ADRs and the system design → (6) design-reference images (AD-META-08) → (7) Fresha reference. *(v1.6: tiers 4–6 are written out — the same order as `openspec/config.yaml`; tiers 1–3 and Fresha last are as approved, D-UX-01.)* If a rule here contradicts a 🔒 decision, the decision wins. **Stop and report the conflict to the owner. Don't pick a side yourself** (🔒 D-PLT-13).

**AD-META-02 · Rule IDs.** Every rule has an ID `AD-<AREA>-nn`. OpenSpec specs, tasks and PR descriptions cite these IDs next to decision IDs (🔒 D-PLT-17). Example: `Implements AD-POS-04, AD-FORM-02 · D-VIS-07`.

**AD-META-03 · Tags.**
| Tag | Meaning | What Claude Code does |
| --- | --- | --- |
| 🔒 D-xxx | Derived from a locked decision | Must implement exactly |
| ⚠️ | Guideline rule — **binding since the owner's approval on 01/Oct/2026 (D-UX-03)** | Implement as written; if it causes a problem, report it rather than silently deviating |
| 🟡 OPEN-nn | Owner decision pending | Implement the stated **default** behind a setting / flag, or leave the placeholder. Never guess a final answer |
| ★ | Owner supplies a value | Use the placeholder / fallback; never invent a value |

**AD-META-04 · Placeholders.** `{{NAME}}` marks a value the team will set (colours). Until it is set, use the neutral fallback given in §3. **Don't invent brand colours or logos.** Fonts are no longer placeholders (§3.2).

**AD-META-05 · Scope.** Everything behind login in `apps/web/app/(app)`: owner/admin, branch manager, barber and other staff screens, login/OTP screens, the receipt print layout and QR print layouts. The public website and the booking modal are in the companion file.

**AD-META-05a · Path note (v1.6).** The route trees are `apps/web/app/staff/` (this guideline — written `(app)` in older text) and `apps/web/app/site/` (the public website — written `(site)`), separated by host in `proxy.ts` (ADR-001); the two notations mean the same trees.

**AD-META-06 · Permission-driven, never role-hardcoded.** Roles are positions the admin creates (🔒 D-ROLE-01). "Barber", "Manager" and "Admin" in this document mean **typical permission sets**, not code branches. UI visibility is always decided by `can(permission, branchScope)` (§9).

**AD-META-07 · Out of V1 UI.** Don't design or build UI for these: waitlist (⏭ D-BKG-20), tips (D-PAY-09), customer email field / customer login / anything sent to customers (D-CUS-04, D-CUS-05), customer merge (D-CUS-02), custom KPI builder (⏭ D-KPI-03), offline mode (V2 — D-VIS-13), native iOS app (D-PLT-10), counter print-only device (⏭ D-PAY-07), discount codes on `/book` (⏭ D-PAY-04).

**AD-META-08 · Design reference images (v1.6 — owner 02/Oct/2026).** 🔒 owner + D-PLT-09. The owner keeps reference images for the admin panel in `point-barber/design-reference/admin-panel/` with a `README.md` index (image → screen / rule ID). **The admin panel follows Fresha's layout about 80 %, and must be easier to use than Fresha** — that is what §11 (adopt / improve / avoid) already encodes. Before building a screen, Claude Code opens the image the index names for it. An image is a reference, never a rule: it sits at tier 6 of AD-META-01 (below the decisions, the database, this guideline, the API design and the ADRs; above the Fresha research); where an image disagrees with a rule here, stop and ask (D-PLT-13). Images must not show real customer names, phone numbers or the shop's revenue figures (RISK-13) — crop or blur before committing.

---

## 1. Context — who uses the admin app, where, and on what

### 1.1 Personas (typical permission sets)

| Persona | Device and setting | Main jobs | Key decisions |
| --- | --- | --- | --- |
| **Barber / service staff** (13–15 people, 3 branches) | **Own phone** — Android or iPhone (PWA); the app must work the same on both — no device count is assumed (OPEN-20 ✅ owner 01/Oct). Standing at the chair, one hand, busy, noisy shop; ~90 services/day across branches | START → COMPLETE → payment → FINISH for every customer in real time; see own bookings; clock in (QR + GPS) / clock out (button + GPS — owner C10); request leave; record stock usage; request a discount; late entry; print receipt (Android) | D-VIS-11, D-AUTH-07, D-VIS-12, D-VIS-13, D-ATT-01, D-PAY-04, D-PAY-07 |
| **Branch manager** | Phone, sometimes tablet or PC; assigned branches only | Bookings and calendar; approve discount requests / leave; manual attendance and exception resolution; daily closing (if granted `closing.close`); stock transfers and counts; branch opening hours and closures on the website. **No payroll / salary / advance access** (owner C1 — pay data is *Private*, AD-PERM-07) | D-ROLE-07, D-DSH-02, D-ATT-06, D-FIN-06, D-STK-03, D-WEB-04 |
| **Admin / owner** | Windows PC (`.exe` shell) and phone; company-wide | Dashboards, P&L, expense approval, payroll, commission plans, settings, roles, website content, audit log, imports, backups | D-DSH-01, D-FIN-05, D-PAYR-06, D-PLT-16, D-ROLE-02, D-WEB-01, D-AUD-01 |

### 1.2 Constraints that shape every screen

- **Real-time recording is the biggest risk.** In Fresha today, 100% of services are recorded after the fact (median ~7 hours late) and 44% under a shared login (review §1 #2, RISK-01). If recording a walk-in on the phone is slower than remembering it, staff will go back to recording in the evening. **Speed on the barber's phone beats everything else.**
- **Own phone, own account, stay signed in** (D-AUTH-06, D-AUTH-07). No shared devices, no PIN switch. The logged-in user is the default performer.
- **Myanmar + English** everywhere, all strings from the language file (D-PLT-03). Myanmar text is longer and taller than English (§7.4).
- **MMK only, whole kyats** (`bigint`, D-PLT-04). **Myanmar Time** (Asia/Yangon, UTC+06:30) for every date, time and business day (D-PLT-15).
- **Unstable internet and power.** V1 has no offline mode: paper first, then late entry (D-VIS-13).
- **Printing** only from an Android phone to a Bluetooth thermal printer (58/80 mm), receipt rendered as an image (D-PAY-07). **Receipt PDF / share works on every device** — it is the universal path; printing is the Android add-on (OPEN-20 ✅).
- **iOS = Home Screen web app (PWA)** — no Web Bluetooth, push only after install and a user tap (review §5.7).

### 1.3 UX goals (measured in the prototype and pilot — REC-03)

| ID | Goal | Target |
| --- | --- | --- |
| AD-GOAL-01 | Walk-in, 1 service, cash, customer skips phone: START → FINISH | ≤ **7 taps** (＋ Start → Walk-in → service chip → Start → Service done · Take payment → Cash → Finish), ≤ **10 s** of actual interaction (REC-01 target, not a requirement) |
| AD-GOAL-02 | The performer (actual service barber) is visible on every service line, every sale and every receipt | 100% of screens |
| AD-GOAL-03 | Every money action shows the exact amount before it is committed, and can't be submitted twice | 100% |
| AD-GOAL-04 | Daily closing for one branch | ≤ 5 minutes when there are no differences |
| AD-GOAL-05 | Barber screens usable with one thumb on a 360 × 640 screen, in Myanmar | No clipped text, no horizontal scroll |
| AD-GOAL-06 | Any screen answers in under 400 ms or shows progress (Doherty) | p95 API ≤ 400 ms for POS actions |

---

## 2. Laws of UX → rules for the admin app

All 30 laws from [lawsofux.com](https://lawsofux.com/). Each row states what the law means here and which rules implement it. Rule IDs point to later sections.

| # | Law | Essence (from lawsofux.com) | How it applies to Point admin / staff app | Rules |
| --- | --- | --- | --- | --- |
| 1 | [Aesthetic-Usability Effect](https://lawsofux.com/aesthetic-usability-effect/) | Pleasing design is perceived as more usable, and hides problems | A calm, consistent UI makes staff trust a money system. Polish must not hide usability problems, so test with real barbers on their own phones, not in a design review | AD-VIS-01, AD-QA-04 |
| 2 | [Choice Overload](https://lawsofux.com/choice-overload/) | Too many options hurt decisions; provide filtering and featured items | Service picker: search, then categories (V1 — AD-POS-05 v1.7; a "most used here" section comes with a usage ranking, not in V1); the START sheet offers the first 6 services in catalogue order (AD-POS-03). The discount code list only shows **internal** codes valid now at this branch (public codes are typed, D-PAY-04). Reports start from date presets | AD-POS-05, AD-POS-09, AD-RPT-02 |
| 3 | [Chunking](https://lawsofux.com/chunking/) | Group information into meaningful units | Long forms are split into titled sections (employee: Profile / Branches & roles / Services / Pay). Numbers are chunked: phone `09 7xx xxx xxx`, money `1,250,000`, receipt `B3-2026-OCT-00125` | AD-FORM-05, AD-FMT-01..04 |
| 4 | [Cognitive Bias](https://lawsofux.com/cognitive-bias/) | Mental shortcuts and defaults steer decisions | Defaults decide outcomes. Fresha's quick-sale default credited services to the logged-in user (attribution errors). Our defaults must equal the most likely truth: performer = logged-in barber, `collected_by` = performer, branch = today's branch. Proxy recording is an explicit, visible choice | AD-POS-02, AD-POS-03, AD-POS-11 |
| 5 | [Cognitive Load](https://lawsofux.com/cognitive-load/) | Reduce extraneous load; keep only what the task needs | One primary task per mobile screen. Barbers never see admin fields. Rare options (late entry, proxy, home service) sit behind one clear link (progressive disclosure). No decorative widgets | AD-LAY-06, AD-POS-01, AD-FORM-06 |
| 6 | [Doherty Threshold](https://lawsofux.com/doherty-threshold/) | Respond in < 400 ms; use perceived performance and progress | Pressed state < 100 ms, result < 400 ms for POS actions, skeletons for longer loads, progress bars for imports, payroll calculation and backups. Never a blank page with a spinner (Fresha hang) | AD-PERF-01..04 |
| 7 | [Fitts's Law](https://lawsofux.com/fittss-law/) | Targets must be large, well spaced and easy to reach | Touch targets ≥ 48 × 48 px (never < 44). Primary actions in a sticky bottom bar within thumb reach. Destructive actions are away from primary ones. Desktop primary action always in the same place | AD-CMP-01, AD-LAY-04 |
| 8 | [Flow](https://lawsofux.com/flow/) | Balance challenge and skill; give feedback; remove friction | The barber's customer loop must not be interrupted: no modal chains, no forced detours (no tip step — D-PAY-09), auto-advance START → in-progress → payment → success → back to Today | AD-POS-01, AD-POS-12 |
| 9 | [Goal-Gradient Effect](https://lawsofux.com/goal-gradient-effect/) | People speed up near the goal; show progress | Checkout shows progress (Services ✓ → Payment → Finish). Daily closing is a checklist with a counter ("KBZPay 3/5 verified"). The payroll wizard shows steps | AD-POS-07, AD-CLS-01, AD-PAY-01 |
| 10 | [Hick's Law](https://lawsofux.com/hicks-law/) | Decision time grows with choices; highlight the recommended one | The arrival screen has exactly 2 choices (Booking / Walk-in, D-VIS-01). Cash is the first payment option (99.9% of live payments). Complex tasks are split into steps | AD-POS-02, AD-POS-08 |
| 11 | [Jakob's Law](https://lawsofux.com/jakobs-law/) | Users expect your product to work like the ones they know | Staff already know Fresha and common apps: left nav rail, calendar with one column per barber, right-side drawer for a booking, bell for notifications, search at the top, bottom nav on phones. Keep these positions; change the rules underneath | AD-LAY-01..03, AD-CAL-01 |
| 12 | [Law of Common Region](https://lawsofux.com/law-of-common-region/) | A shared boundary groups elements | Cards / sections with a border or background group what belongs together: the sale summary, the payment card, each branch on the closing screen, the drawer header | AD-CMP-10, AD-CLS-02 |
| 13 | [Law of Proximity](https://lawsofux.com/law-of-proximity/) | Nearby elements are seen as related | Label directly above its input; error text directly under the field (D-UI-01); actions next to the thing they change (row actions visible, not hidden in an "Options" menu as in Fresha) | AD-FORM-02, AD-LIST-04 |
| 14 | [Law of Prägnanz](https://lawsofux.com/law-of-pr%C3%A4gnanz/) | People read complex visuals as the simplest form | Simple shapes and one icon set; status = one badge; simple bar/line charts only; no 3D, no dense infographics on phones | AD-VIS-02, AD-CHART-01 |
| 15 | [Law of Similarity](https://lawsofux.com/law-of-similarity/) | Similar-looking things are seen as related | The same status has the same badge colour + label on every screen (§6.3). Money is always right-aligned with tabular digits. The same action always uses the same icon and verb. Links look like links | AD-CMP-05, AD-FMT-01, AD-COPY-02 |
| 16 | [Law of Uniform Connectedness](https://lawsofux.com/law-of-uniform-connectedness/) | Visually connected elements are seen as more related | Connect booking items in a vertical timeline (back-to-back services). Connect each service line to its performer chip. Show a cash-out and its cash returns as one connected group. Steppers use connectors | AD-BKG-03, AD-POS-04, AD-FIN-03 |
| 17 | [Mental Model](https://lawsofux.com/mental-model/) | Match the model users already have | Mirror the shop's real sequence and the domain model: Booking ≠ Visit ≠ Sale ≠ Payment (review §2). Buttons say what happens in the shop: *Start service*, *Service done*, *Take payment*, *Finish*. Daily closing mirrors counting the cash drawer | AD-POS-*, AD-CLS-* |
| 18 | [Miller's Law](https://lawsofux.com/millers-law/) | Chunk content; don't use "7" as an arbitrary limit | ≤ 7 top-level nav groups with sub-items; ≤ 6 KPI tiles per dashboard row; tables show ≤ 7 columns by default on tablets, the rest via column settings | AD-NAV-02, AD-DSH-02, AD-LIST-06 |
| 19 | [Occam's Razor](https://lawsofux.com/occams-razor/) | Remove until nothing more can be removed | Build only what 🔒 decisions require (AD-META-07). Every screen review asks: which element can go without losing function? | AD-QA-02 |
| 20 | [Paradox of the Active User](https://lawsofux.com/paradox-of-the-active-user/) | Users never read manuals; put guidance in context | Staff won't read a manual. Use empty states that explain the next step, `?` tooltips on complex settings (commission tiers, deduction rules, expected cash), a one-time dismissible tip on the barber's first START | AD-STATE-02, AD-HELP-01..03 |
| 21 | [Pareto Principle](https://lawsofux.com/pareto-principle/) | ~80% of effects come from ~20% of causes | ~80% of use is: walk-in checkout, today's bookings, clock in. Optimise these on the phone first. Rare admin screens can be desktop-first, dense forms | AD-LAY-06, AD-POS-* |
| 22 | [Parkinson's Law](https://lawsofux.com/parkinsons-law/) | Tasks expand to the time available; autofill shortens them | Prefill everything known: branch from context, performer, business date = today (MMT), opening float from settings, "amount = remaining to pay", customer from phone lookup, KBZPay list on closing | AD-FORM-07, AD-POS-08, AD-CLS-03 |
| 23 | [Peak-End Rule](https://lawsofux.com/peak-end-rule/) | Experiences are judged by their peak and their end | The peaks are FINISH (clear success screen with receipt number), day closed, payslip published. Make them satisfying. Negative peaks (payment error, slot taken) must be calm, specific and recoverable | AD-POS-12, AD-CLS-06, AD-STATE-03 |
| 24 | [Postel's Law](https://lawsofux.com/postels-law/) | Liberal in what you accept, conservative in what you send | Accept `09…`, `+959…`, `959…`, spaces and dashes in phones; amounts with or without commas; KBZPay references with spaces; Zawgyi-encoded Myanmar text (convert to Unicode). Store and display one strict normalised format | AD-FORM-10..13, AD-L10N-07 |
| 25 | [Selective Attention](https://lawsofux.com/selective-attention/) | People filter stimuli; beware banner blindness and change blindness | Critical events (no-show alarm, discount decision, "slot just taken", day closed) use a distinct, reserved pattern. Realtime changes get a short highlight so they aren't missed. Nothing looks like an ad | AD-NTF-03, AD-RT-02 |
| 26 | [Serial Position Effect](https://lawsofux.com/serial-position-effect/) | First and last items are remembered best | Nav: Home first, Settings/More last; bottom nav: most important actions at the ends and the centre "+ Start". The primary action is the last button in a footer | AD-NAV-03, AD-LAY-04 |
| 27 | [Tesler's Law](https://lawsofux.com/teslers-law/) | Some complexity can't be removed; the system should carry it | The system carries price lookup (branch / barber / option / home / effective date), availability, expected cash, commission tiers, payroll deductions. The UI shows the result plus a "How is this calculated?" breakdown. Staff never calculate by hand | AD-HELP-02, AD-CLS-03, AD-PAY-04 |
| 28 | [Von Restorff Effect](https://lawsofux.com/von-restorff-effect/) | The item that differs is remembered; don't rely on colour alone | One primary button per view. Exceptions stand out: cash difference ≠ 0, negative stock, late-entry flag, proxy-recorded badge, unverified KBZPay. Always icon + text, never colour only | AD-CMP-01, AD-CMP-06, AD-A11Y-03 |
| 29 | [Working Memory](https://lawsofux.com/working-memory/) | 4–7 chunks fade in 20–30 s; favour recognition over recall | Carry context: sticky header with customer / performer / branch in checkout; reschedule confirm shows old → new; recent customers and recent services lists; breadcrumbs on desktop | AD-POS-06, AD-BKG-07, AD-NAV-06 |
| 30 | [Zeigarnik Effect](https://lawsofux.com/zeigarnik-effect/) | Unfinished tasks are remembered; signal what's pending | Surface unfinished work: open visits on Today, pending approvals count, unverified KBZPay count, draft transfers, OPEN attendance exceptions, payroll run in DRAFT — each with a "Continue" action | AD-TODAY-02, AD-NTF-05, AD-DSH-04 |

---

## 3. Visual foundation — design tokens

**AD-VIS-01 · One token source.** ⚠️ All colours, fonts, spacing, radii, shadows and motion come from CSS variables in one shared file (`packages/ui/tokens.css`, imported by both the `staff` and the `site` tree; **v1.6:** the `site` tree overrides the colour tokens with the owner's website palette and the font tokens — website guideline FE-VIS-01a; token *names* stay shared, plus the site-only `--decoration`), mapped into Tailwind's theme the shadcn/ui way. Components never use raw hex values, raw pixel font sizes or Tailwind palette classes such as `bg-blue-500`. Consistency is what makes the system feel trustworthy (Aesthetic-Usability).

**AD-VIS-02 · Visual simplicity.** ⚠️ Flat surfaces, one icon set, one border style, one radius scale. No gradients, textures or illustrations in working screens (empty states may use one small line illustration). Prägnanz.

### 3.1 Colour tokens — ★ values set by the team (🔒 D-UX-02, ★ OPEN-30)

**AD-VIS-03 · Semantic names only.** ⚠️ Use the semantic token names below. Until the team supplies values, **use the shadcn/ui default `neutral` theme variables unchanged** as scaffolding and leave every `{{…}}` in place. Don't invent a brand colour. **v1.7 (🔒 owner S15, 02/Oct/2026):** two things point at other neutral tokens until the palette (and, on the website, REC-41) arrives, because the neutral `--ring` and `--input` do not reach the 3 : 1 of AD-VIS-04 / AD-A11Y-02 — the **focus outline** is 2 px `var(--foreground)` (19.80 : 1 on the staff background, 18.10 : 1 on the website's `#EEEEEE`) and the **input border** is `var(--muted-foreground)` (4.74 : 1 staff, 4.09 : 1 website). `--ring` and `--input` keep their neutral values and are simply not used for those two. No colour is invented; when the palette arrives both point back at `--ring` / `--input`. *(Fix-up 02/Oct/2026 13:46 — no version bump: the owner approved REC-41, so the **website** tree already points back at its own `--ring` `#000000` / `--input` `#707070` — website guideline v1.7 FE-VIS-01a; this interim now applies to the **staff** tree only, until the admin palette arrives.)*

| Token (CSS variable) | Used for | Value |
| --- | --- | --- |
| `--background` / `--foreground` | Page background / main text | `{{COLOR_BG}}` / `{{COLOR_FG}}` |
| `--card` / `--card-foreground` | Cards, drawers, sheets | `{{COLOR_CARD}}` / `{{COLOR_CARD_FG}}` |
| `--muted` / `--muted-foreground` | Subtle backgrounds, secondary text, helper text | `{{COLOR_MUTED}}` / `{{COLOR_MUTED_FG}}` |
| `--border` / `--input` / `--ring` | Borders, input borders, focus ring | `{{COLOR_BORDER}}` / `{{COLOR_INPUT}}` / `{{COLOR_RING}}` |
| `--primary` / `--primary-foreground` | The one primary action per view, active nav item, selected state | `{{COLOR_PRIMARY}}` / `{{COLOR_PRIMARY_FG}}` |
| `--secondary` / `--secondary-foreground` | Secondary buttons, chips | `{{COLOR_SECONDARY}}` / `{{COLOR_SECONDARY_FG}}` |
| `--accent` / `--accent-foreground` | Hover / highlighted rows, realtime highlight | `{{COLOR_ACCENT}}` / `{{COLOR_ACCENT_FG}}` |
| `--destructive` / `--destructive-foreground` | Destructive actions, errors, required `*` (D-UI-01 "red") | `{{COLOR_DANGER}}` / `{{COLOR_DANGER_FG}}` |
| `--success` / `--success-foreground` / `--success-subtle` | Finished, verified, closed-OK, difference = 0 | `{{COLOR_SUCCESS}}` … |
| `--warning` / `--warning-foreground` / `--warning-subtle` | Pending, needs attention, difference ≠ 0 within tolerance, late entry flag | `{{COLOR_WARNING}}` … |
| `--info` / `--info-foreground` / `--info-subtle` | In progress, informational banners | `{{COLOR_INFO}}` … |
| `--danger-subtle` | Error background, difference above tolerance, negative stock | `{{COLOR_DANGER_SUBTLE}}` |
| `--chart-1` … `--chart-6` | Categorical chart series (branches, categories) | `{{COLOR_CHART_1..6}}` |

**AD-VIS-04 · Colour requirements the team's palette must meet.** ⚠️
- Text contrast ≥ **4.5 : 1** (normal text) and ≥ **3 : 1** (large text ≥ 24 px regular / 19 px bold, icons, input borders, focus ring) against the surface it sits on — WCAG 2.1 AA.
- `--destructive` must read as "red" (D-UI-01 says the required asterisk and error outline are red).
- Success vs danger and warning vs danger must differ in **lightness**, not only hue (colour-blind users), and are always paired with an icon + text (AD-A11Y-03).
- Status tones map through §6.3 — never pick a colour per screen.
- The six chart colours must be distinguishable in greyscale order (Von Restorff: don't rely on colour alone).
- ⚠️ **V1 = light theme only.** The token structure must allow a dark theme later (tokens only, no hard-coded colours). Fresha offers Light/Dark/System; not required for V1.

### 3.2 Typography — font families set by the owner (🔒 D-UX-02 · OPEN-31 ✅ 01/Oct)

| Token | Used for | Value (owner 01/Oct) |
| --- | --- | --- |
| `--font-sans` | UI text (Latin): labels, body, buttons, tables | **Manrope** (variable, use 400 / 500 / 600 / 700); fallback **Inter**, then `system-ui` |
| `--font-myanmar` | UI text (Myanmar script) — listed first in the stack when the locale is `my` | **Pyidaungsu** (Regular 400 / Bold 700) |
| `--font-numeric` | Money, quantities, times, receipt numbers in tables and big numbers | **Inter** with `font-variant-numeric: tabular-nums` (Inter's tabular figures are well tested; if Manrope's `tnum` passes the alignment test below, `--font-numeric` may equal `--font-sans`) |

Stacks: `en` → `'Manrope', 'Inter', 'Pyidaungsu', system-ui, sans-serif` · `my` → `'Pyidaungsu', 'Manrope', 'Inter', system-ui, sans-serif` · numbers → `'Inter', 'Manrope', system-ui, sans-serif`. The owner's answer "Manrope / Inter" is read as Manrope first, Inter as the numeric / fallback face; if the owner meant Inter as the only UI font, swap the first two entries — nothing else changes. The **public website uses different Latin fonts** (Archivo Black + Roboto — frontend FE-VIS-02) and the same Pyidaungsu; the site overrides the font tokens inside the `(site)` route group.

**AD-VIS-05 · Font requirements — checks to run once before the token file is committed.** ⚠️ The chosen fonts must (✓ = expected to pass, verify in the component catalogue AD-IMPL-06 at 320 px):
- support **Myanmar Unicode** (not Zawgyi) with correct stacking of vowels, medials and asat — ✓ Pyidaungsu (the Myanmar Unicode reference font). Test strings: `ကြိုတင်ချိန်းဆိုမှု`, `နေ့စဉ်စာရင်းပိတ်`, `ငွေပေးချေမှု`, `ဝန်ဆောင်မှုပေးခြင်း`;
- come in at least **Regular (400) and Semibold/Bold (600/700)** for Myanmar — ✓ Pyidaungsu ships Regular and Bold; UI "600" maps to Pyidaungsu Bold for Myanmar text (no faux-bold);
- have a licence that allows self-hosting on the web and inside the Android / Windows app shells — ✓ Manrope and Inter are SIL OFL; Pyidaungsu is distributed free by the Myanmar Unicode / government programme — ⚠️ keep a copy of each licence file in `packages/ui/fonts/`;
- have **tabular (monospaced) figures** in the numeric font, so money columns align — ✓ Inter (`tnum`); test a column of `1,250,000` / `7,000` / `999` in `--font-numeric`;
- be **self-hosted** (WOFF2, subset where possible — Latin subset for Manrope / Inter, the full Myanmar block U+1000–U+109F plus Latin digits and punctuation for Pyidaungsu) so the PWA works without a third-party font CDN.
- Displayed digits are always 0–9 (AD-FMT-10), but keep Pyidaungsu's Myanmar-digit glyphs (U+1040–U+1049) in the subset: inputs may briefly show typed ၀–၉ before normalisation.

**AD-VIS-06 · Type scale.** ⚠️ Sizes are fixed here (they don't depend on the font choice). Base = 16 px.

| Token | Size / line-height (EN) | Line-height (MY) | Use |
| --- | --- | --- | --- |
| `text-xs` | 12 / 16 px | 20 px | Badges, captions, table meta (never for Myanmar body text) |
| `text-sm` | 14 / 20 px | 24 px | Secondary text, table cells on desktop |
| `text-base` | **16** / 24 px | 28 px | Body, **all inputs** (≥ 16 px stops iOS zooming on focus) |
| `text-lg` | 18 / 28 px | 30 px | Card titles, drawer section titles |
| `text-xl` | 20 / 28 px | 32 px | Page titles on mobile |
| `text-2xl` | 24 / 32 px | 38 px | Page titles on desktop; totals on checkout |
| `text-3xl` | 30 / 36 px | 46 px | Big numbers: amount to pay, receipt number on success, KPI values |

- Myanmar line-heights are larger because stacked marks above and below the line get clipped at Latin line-heights (§7.4).
- Weights: 400 body, 500 labels, 600 titles and buttons, 700 for key numbers only.
- Never use `text-transform: uppercase`, italics or letter-spacing on Myanmar text.

### 3.3 Spacing, radius, elevation, motion, layout

**AD-VIS-07 · Spacing.** ⚠️ 4 px base grid (Tailwind default scale). Common values: 4, 8, 12, 16, 24, 32, 48. Minimum 8 px between adjacent touch targets. Mobile page gutter = 16 px; desktop content padding = 24 px.

**AD-VIS-08 · Radius and elevation.** ⚠️ Radius tokens: `--radius` `{{RADIUS}}` (fallback shadcn default 0.5 rem) with sm / md / lg derived from it. Three elevation levels only: flat (cards with a border), raised (dropdowns, popovers), overlay (drawers, dialogs, bottom sheets).

**AD-VIS-09 · Motion.** ⚠️ 150 ms for hover/press, 200 ms for drawers and sheets, 300 ms maximum for anything. Ease-out for enter, ease-in for exit. Honour `prefers-reduced-motion` (switch to fades or no motion). Motion is feedback, never decoration.

**AD-VIS-10 · Breakpoints and layout modes.** ⚠️ Tailwind defaults.

| Mode | Width | Primary users | Layout |
| --- | --- | --- | --- |
| Mobile | < 768 px (design at **360 px**, test at 320 px) | Barbers, managers on phone | Top app bar + bottom nav + full-screen sheets |
| Tablet | 768–1023 px | Managers | Icon rail + content; drawers overlay |
| Desktop | ≥ 1024 px (design at 1280 / 1440) | Admin / owner | Icon rail + section sub-nav + content + right drawers |

**AD-VIS-11 · Icons.** ⚠️ `lucide-react` only (ships with shadcn/ui). 20 px in dense UI, 24 px in bottom nav and big buttons. Icons in navigation and bottom nav always have a visible text label. Icon-only buttons need `aria-label` and a tooltip on desktop.

**AD-VIS-12 · Avatars.** ⚠️ Employee photo if present (`employees` photo attachment), otherwise initials on a neutral background. Customers have no photo — show initials. An avatar never appears without the person's name next to it where attribution matters (performer, collected by, approver).

---

## 4. App shell, navigation and information architecture

### 4.1 Shell by layout mode

**AD-LAY-01 · Desktop shell.** ⚠️ Jakob's Law — the Fresha layout the team already knows:
- **Left icon rail** (≈ 64 px) with module icons + tooltips; active item uses `--primary`.
- **Section sub-nav panel** (≈ 240 px, collapsible) listing the screens of the active module (Fresha pattern: `evidence/_nav/nav-d-sales.png`).
- **Top bar:** at the **far left, the branch context switcher** (🔒 D-DSH-01 "All / branch dropdown top-left"), then page title / breadcrumb; on the right: global search (Ctrl/⌘ K), notifications bell with unread count, language switch, user menu.
- **Content area:** lists and reports use the full width; forms are max 720 px wide; detail drawers slide in from the right (480–640 px) over the list.

**AD-LAY-02 · Tablet shell.** ⚠️ Icon rail only (sub-nav opens as a popover or becomes tabs at the top of the page). Drawers overlay the content (≥ 480 px or full width below 600 px).

**AD-LAY-03 · Mobile shell.** ⚠️
- **Top app bar:** page title, branch chip (tap = switch branch within scope), bell. Back arrow on detail pages.
- **Bottom navigation** (Fresha mobile pattern `evidence/ux/mobile-390-calendar.png`): max **5 items**, each icon + label, with the **centre item = the most frequent create action the user is allowed** (§4.2).
- Detail drawers and forms open as **full-screen sheets** with a sticky header (title, close) and a **sticky bottom action bar**.
- No horizontal page scroll, ever. Wide tables become card lists (§6.4).
- Don't show a "Download the app" banner (Fresha does). Show the install guide only from the user menu or the first-login tip (AD-LOGIN-05).

**AD-LAY-04 · Action placement.** ⚠️ Fitts + Serial Position.
- Mobile: primary action = full-width button in the sticky bottom bar (thumb zone). Secondary action to its left or as a text button above it. Destructive actions never sit next to the primary action. Put them in the page body or behind a kebab with a confirm dialog.
- Drawer / dialog footer (desktop): secondary on the left, **primary on the right** (last position).
- Full-page forms on desktop: Save/primary at the top-right in the page header **and** at the bottom of the form.
- Exactly **one primary (filled) button per view** (Von Restorff).

**AD-LAY-05 · Page header.** ⚠️ Every page: title (from the language file), optional subtitle / scope ("Branch 3.0 · 30/Sep/2026"), primary action, secondary actions (max 2 visible + kebab), filter bar below it when it is a list.

**AD-LAY-06 · Device-appropriate density.** ⚠️ Pareto. Barber-frequent screens (Today, START, visit, checkout, FINISH, clock-in, own bookings, stock usage, leave request) are designed **mobile-first** for 360 px. Admin-heavy screens (payroll review, price grid, settings, reports, audit, import) are designed **desktop-first** and must still work (read + simple edits) on mobile.

### 4.2 Bottom navigation (mobile)

**AD-NAV-01 · Bottom nav sets.** ⚠️ The set is chosen by permissions, not by role name. Default mappings:

| Typical user | Item 1 | Item 2 | Centre | Item 4 | Item 5 |
| --- | --- | --- | --- | --- | --- |
| Barber-like (can record visits) | **Today** | Bookings | **＋ Start** (arrival → START) | Customers | More |
| Manager-like | Today / Home | Calendar | **＋** (Start / New booking / Cash out menu) | Approvals (badge) | More |
| Admin on phone | Home | Calendar | **＋** (New booking / Cash out / Expense) | Approvals (badge) | More |

- "More" opens a full menu of the remaining modules the user can access (grouped as in §4.3).
- The centre button is visually distinct (filled `--primary`, larger). If the user has no create permission, there is no centre button (4 items).
- Badges show counts for unfinished work (Zeigarnik): open visits on Today, pending approvals on Approvals.

### 4.3 Information architecture (desktop rail / "More" menu)

**AD-NAV-02 · Module groups.** ⚠️ ≤ 7 main groups + Settings (Miller). Every screen is hidden unless the user has its view permission — `<module>.view` or any other code of that module (§9, AD-PERM-06 v1.3). **v1.5:** every module code is final in API Parts 1–8 (`permissions.json`, 🔒 D-ROLE-08 — list in AD-PERM-06); module names quoted in the Notes column are the code prefixes (`<module>.<action>`), as each API part's codes section maps them to these menus.

| # | Group (rail icon) | Screens | Main tables | Notes / decisions |
| --- | --- | --- | --- | --- |
| 1 | **Home** | Dashboard (admin / manager / barber variants) | views | D-DSH-01..03 |
| 2 | **Calendar** | Calendar (day / week / barber view), Bookings list, No-show alarms | `bookings`, `booking_items`, `schedule_shifts`, `leaves` | D-BKG-*, AD-CAL-* |
| 3 | **Sales** | Today / POS (barber), Visits, Sales, Payments, Refunds, Discount requests (approvals), Discount codes, **Receipts** (v1.5 — today's receipts at the branch, no amounts, + find by receipt number — P4.RCP.03/04, AD-POS-13) | `visits`, `sales`, `sale_items`, `payments`, `refunds`, `discount_*` | D-VIS-*, D-PAY-* · modules `visit`, `sale` (incl. refunds / adjustments), `payment`, `discount`; *Settings › Payment methods* = `payment_method` (API Part 4 §9); Receipts need no code (operational) |
| 4 | **Customers** | Customers list, Customer detail | `customers` | D-CUS-* |
| 5 | **Team** | Employees, Roles, Schedule (patterns / shifts / roster), Leave (requests + approvals), Attendance (records, exceptions, manual entry, branch QR) | `employees`, `roles`, `schedule_*`, `leaves`, `attendance_*` | D-EMP-*, D-ROLE-*, D-SCH-*, D-LV-*, D-ATT-* · Attendance = modules `attendance` (records, exceptions, manual entry) and `attendance_qr` (branch QR) — API Part 5 §14 |
| 6 | **Money** | Daily closing, Cash out / Cash return, To be returned, Expenses (+ approvals), Manual incomes (+ approvals), P&L, Payroll runs, Payslips, Commission plans, Salaries, Advances & loans | `daily_closings`, `cash_outs`, `cash_returns`, `expenses`, `manual_incomes`, `payroll_*`, `commission_*`, `employee_receivables` | D-FIN-*, D-PAYR-*, D-COM-* · v1.5 modules: `closing`, `cashout` (cash outs, returns, to be returned), `expense`, `income`, `pnl`; Settings: `cashout_reason`, `finance_category` (API Part 7 §10) · `payroll` (runs, salaries, advances / loans), `commission` — level *Private*, company scope only (owner C1, API Part 5 §14) |
| 7 | **Stock** | Products, Stock levels, Movements, Purchases, Transfers, Stock counts, Suppliers, Usage | `products`, `branch_stock_levels`, `stock_movements`, `purchases`, `stock_transfers`, `stock_counts` | D-STK-* · modules `product` (incl. categories), `supplier`, `stock` (levels, movements, usage, counts), `purchase`, `transfer`; Settings: `stock_adjustment_reason` (API Part 6 §10) |
| – | **Reports** (can live inside Home or as its own rail item) | Report catalogue (10 reports, D-RPT-01 — list 🔒 AD-RPT-04) | views | AD-RPT-* · **one code per report** (`report_<key>.view`; ⑥ = `pnl.view`; ⑦ *Private* — owner F1, API Part 8 §14) — the catalogue lists only the reports the user holds |
| – | **Website** | Company info, Branches (public, hours, closures), Services on website, Team public profiles, Site content, Booking QR codes | Part 8 + website columns | D-WEB-*, website codes (`website.view` / `website.update` — company scope = whole site, branch scope = own branches' hours and closures — owner F7, API Part 8 P8.WEB) |
| last | **Settings** | Company, Branches, Additional settings, Services & categories, Prices, Eligibility, Payment methods, Cancel reasons, Cash-out reasons, Expense / income categories, Payroll categories, Leave types, Stock adjustment reasons, Notification types, Import, Backups, Audit log, Maintenance mode | Part 1, 2, 4–8 | D-PLT-07/08/16, D-AUD-01 · *Payroll categories* = `payroll_category` (*Private* — API Part 5 §14) |
| user menu | **Me** | My schedule, My leave, Clock in/out, **My attendance**, My payslips, **My advances** (v1.5 — own records with their exceptions, own advances / loans with balance and repayments; self, no code — API Part 5 P5.ATT.04 / P5.RCV.08), My earnings (only when the effective own-earnings flag is ON — AD-DSH-01), My devices, Language, Install app guide, Sign out | `user_sessions` etc. | D-AUTH-05, D-PAYR-07 |

*Services & catalogue:* on desktop, Services / Categories / Prices / Eligibility may sit under Settings or as their own "Catalogue" item — pick one during API/IA design and keep it consistent. They are admin-frequent, barber-never.

**AD-NAV-03 · Order.** ⚠️ Home first, Settings last (Serial Position). Inside groups, the most frequent screen comes first.

**AD-NAV-04 · Branch context switcher.** 🔒 D-ROLE-03, D-DSH-01/02 + ⚠️ details.
- Lists only branches in the user's scope. "All branches" appears only for users with company-scope access.
- The selection persists per user on the device and is mirrored in the URL (`?branch=B3`) so deep links and shared links open the same view.
- Every list, dashboard and report respects it. Create forms prefill the branch from it but allow changing within scope.
- For a barber, the default branch = the branch of today's shift / current attendance record, else the branch they used last on this device, else the first of their active branch assignments (`employee_branches` has no "primary" flag).

**AD-NAV-05 · Global search.** 🔒 D-SRC-01 + ⚠️ details. Desktop: search field in the top bar + Ctrl/⌘ K. Mobile: search icon → full-screen search. Results grouped by type: Customers (name, phone), Bookings (customer name / phone / date), Sales (receipt number `B3-2026-OCT-00125`), Employees. **Barber-like users see Customers and Bookings only.** Results respect branch scope. Keyboard navigable; recent searches listed; phone search matches any format (normalise before querying).

**AD-NAV-06 · Breadcrumbs and deep links.** ⚠️ Desktop pages show a breadcrumb (group › screen › record). Every entity has a URL (`/bookings/<id>`, `/sales/<id>`, `/employees/<id>` …) matching the notification `link_path` (Part 8). Drawers are URL-addressable (`?drawer=booking:<id>`); the browser Back button closes the drawer first.

**AD-NAV-07 · User menu.** ⚠️ Name + primary role label, language switch MM / EN (saved on the user account — `users.ui_language`, OPEN-33 ✅, AD-L10N-06), My earnings (only when the barber's effective own-earnings flag is ON — company setting or per-barber override, AD-DSH-01), My devices, Install app guide (iOS/Android), Help, Sign out.

**AD-NAV-08 · Maintenance mode.** 🔒 D-PLT-08. When ON: non-admin users see a full-screen notice (language file text + expected end if provided) and the status page link; admins see a persistent top banner "Maintenance mode is ON" with a link to turn it off.

---

## 5. Page and interaction patterns

### 5.1 List pages

**AD-LIST-01 · Structure.** ⚠️ Page header (§AD-LAY-05) → filter bar → results → pagination. Filter bar: search box (placeholder says what it searches, e.g. "Name or phone"), branch (from context, AD-NAV-04), date range with presets (Today, Yesterday, This week, Last 7 days, This month, Last month, Custom — all MMT), status chips (multi-select). Active filters show as removable chips with "Clear all".

**AD-LIST-02 · Desktop table vs mobile cards.** ⚠️ Desktop/tablet: data table (§6.4). Mobile: card list — each card shows the 3–4 most important fields (e.g. booking: time, customer, services, status badge) and one inline primary action.

**AD-LIST-03 · Row click.** ⚠️ Transactional records (booking, visit, sale, expense, cash out, leave, transfer) open in a **right drawer** on desktop and a full-screen sheet on mobile, so the list context stays (Working Memory). Master records with many sections (employee, customer, service, role, payroll run) open a **full page with tabs**.

**AD-LIST-04 · Visible row actions.** ⚠️ Fresha hides Reschedule / Cancel / Refund / Void under "Options" (`ux-analysis.md`, "Hidden actions"). We don't: the 1–2 most common actions for the row's current status are visible buttons (desktop: on the row or in the drawer header; mobile: in the card or sheet footer). Rare actions go in a kebab menu.

**AD-LIST-05 · Pagination.** ⚠️ Server-side, cursor-based; 25 rows default (50/100 selectable on desktop). Show the total count where the API can supply it cheaply. Keep the filter state in the URL so Back restores it.

**AD-LIST-06 · Columns.** ⚠️ ≤ 7 visible columns by default on tablet, more on desktop; a "Columns" menu lets users show/hide (stored per user on the device). Money and quantity columns are right-aligned with tabular digits; status column uses badges (§6.3); dates use `DD/MMM/YYYY` (§7.3).

**AD-LIST-07 · Export.** 🔒 D-DAT-02 + owner F2 / F3 (API Part 8 P8-RULE-08). Lists and reports that allow export show an "Export" menu (Excel / CSV / PDF) only to users holding **`data.export`** (Admin seed) in addition to the screen's view right; CSV / Excel up to 50,000 rows, PDF = summary + first 1,000 rows; over 5,000 rows or any PDF is prepared in the background and kept in *My exports* for 24 hours. Exports respect current filters and branch scope and use the same labels as the screen (current language).

### 5.2 Detail views

**AD-DET-01 · Header.** ⚠️ Title (e.g. customer name or receipt number), status badge, key facts line (branch · date · performer), and the visible primary actions for the current status (e.g. BOOKED booking → *Start*, *Reschedule*, *Cancel*).

**AD-DET-02 · Sections.** ⚠️ Order: what the user came for first (items / amounts), then people and times, then history. Long detail pages use tabs (Overview / History / …). Master records show an **Activity** tab driven by `audit_events` (only for users with audit view in scope — D-AUD-01).

**AD-DET-03 · Read-only states.** 🔒 D-VIS-08, D-FIN-06, D-PAYR-06, D-STK (POSTED/SENT). When a record is immutable (FINISHED sale, CLOSED day, FINALIZED+ payroll run, POSTED purchase or count, SENT transfer), show a **lock banner** at the top: what state it is in, who/when, and the correction path ("Use Refund / Adjustment", "Ask an admin to reopen"). Inputs are replaced by text, not shown disabled.

### 5.3 Forms

**AD-FORM-01 · Required fields.** 🔒 D-UI-01. Required field = red asterisk (`--destructive`) right after the label. Don't also add "(optional)" labels, except for single optional fields inside otherwise required groups (e.g. "Note (optional)") where it helps.

**AD-FORM-02 · Validation errors.** 🔒 D-UI-01 + ⚠️ placement. Invalid field = red outline + error message. The message sits **directly under the field** (Law of Proximity; this placement was an assistant suggestion attached to D-UI-01 and is adopted here ⚠️). Message text comes from the language file. Also set `aria-invalid` and link the message with `aria-describedby`.

**AD-FORM-03 · When to validate.** ⚠️ Validate a field on blur and on submit; re-validate on change once it has shown an error. Don't block typing. Keep the submit button **enabled** when the form is invalid; pressing it shows the errors and moves focus to the first invalid field. Disable it only while submitting.

**AD-FORM-04 · Server errors.** ⚠️ API validation errors return field keys + language keys; map them onto fields. Errors not tied to a field (e.g. "Slot just taken", "Day is closed") appear in an inline alert at the top of the form or sheet, never only in a toast.

**AD-FORM-05 · Layout.** ⚠️ One column on mobile; up to two columns on desktop only for short related pairs (Start / End, MM / EN name). Labels above inputs. Group fields into titled sections (Chunking). Helper text under the label when the field needs explaining (from the language file).

**AD-FORM-06 · Progressive disclosure.** ⚠️ Rare options sit behind a clearly labelled link or toggle ("Record for another barber", "Late entry — record a past service", "At customer's home"). Opening it reveals only the fields it needs.

**AD-FORM-07 · Prefill and defaults.** ⚠️ Parkinson + Cognitive Bias. Prefill every value the system knows: branch (context), business date (today, MMT), performer (logged-in user), collected by (performer), time (now, rounded to the slot interval), opening float (setting), amount (= remaining to pay). A default must be the most likely *true* value, never a convenient guess.

**AD-FORM-08 · Unsaved changes.** ⚠️ Closing a drawer, sheet or page with unsaved edits asks "Discard changes? — Keep editing / Discard" (Fresha pattern `evidence/booking/unsaved-changes-modal.png`). Not needed for forms that only have their defaults.

**AD-FORM-09 · Bilingual master data input.** 🔒 D-DB-04. Master names and customer-visible text are entered as a pair: **Myanmar (required)** + **English (optional)**. Use a shared `BilingualInput`: two inputs stacked (MM first) with the hint "Leave English empty to show the Myanmar text" (EN screens fall back to MM). Free-text notes, "Other" reasons and customer names are a single field stored as typed.

**AD-FORM-10 · Phone input.** 🔒 D-CUS-02 + ⚠️ Postel. Accept `09 7xx xxx xxx`, `097…`, `+959…`, `959…`, spaces, dashes. Normalise to E.164 (`+959…`, pattern `^\+[1-9][0-9]{6,14}$`) for lookup and storage (`phone_normalized`); keep what was typed in `phone`. Show a live, formatted preview. `inputmode="tel"`. As soon as the number is complete, look up the customer and show "Existing customer: <name> · last visit <date>" or "New customer".

**AD-FORM-11 · Money input.** 🔒 D-PLT-04 (whole MMK, `bigint`) + ⚠️. Integer only (no decimal key), `inputmode="numeric"`, thousands separators appear as the user types, the currency unit shows as a suffix (`Ks` / `ကျပ်`). Paste of `7,000`, `7000`, `7 000` works. Negative input is impossible except in fields that are explicitly signed (none in V1 UI — corrections use their own flows). Optional helper (⚠️, owner may drop): in the Myanmar UI, amounts ≥ 100,000 show a small helper in သိန်း under the input (`2,250,000` → "22.5 သိန်း"), because staff think in သိန်း and a missing zero is the most common entry error.

**AD-FORM-12 · Reference numbers.** 🔒 D-PAY-02. KBZPay reference: trim spaces, keep what the shop's format allows — the payment method's reference format (Settings › Payment methods, `payment_methods.reference_regex` — OPEN-24 ✅; the setting `sales.kbzpay_reference_regex` is dropped, API Part 4 P4-RULE-09 / 19), show the expected format as helper text generated from it (e.g. "Transaction No. from the KBZPay receipt — N digits"). Uniqueness is checked by the server; show "This reference was already used on <receipt no>" when it fails.

**AD-FORM-13 · Myanmar text input.** ⚠️ Postel. If typed Myanmar text is detected as **Zawgyi**, convert to Unicode before saving and show the converted text for confirmation (use a maintained detector/converter such as Google's `myanmar-tools`). Applies to names, notes and reasons (§7.7).

**AD-FORM-14 · Selects.** ⚠️ ≤ 7 options → radio group or segmented control (visible choices, Hick). More → searchable combobox. Long lists of people show avatar + name + branch. Options that are unavailable (e.g. barber not eligible) are hidden, not disabled, unless explaining why helps ("Not eligible at this branch").

**AD-FORM-15 · Date and time inputs.** 🔒 D-PLT-05. Display `DD/MMM/YYYY` and 12-hour times; the picker opens on today (MMT). Typed dates accepted in `DD/MM/YYYY` and `DD/MMM/YYYY`. Time pickers step by the relevant interval (slot interval for bookings, 5 min elsewhere).

**AD-FORM-16 · File attachments.** 🔒 Part 8 `attachments`. Drag-and-drop on desktop, camera/gallery on mobile. Show allowed types and max size (setting). Image preview thumbnails; remove = soft delete. Upload progress bar; the form can't be submitted while an upload is running.

### 5.4 Reason dialog (shared component)

**AD-RSN-01 · One component for every "reason required" action.** ⚠️ `ReasonDialog`: title = verb + object ("Cancel booking"), a consequence summary (what will happen, with numbers), a reason control, an optional/required note, and the confirm button labelled with the verb ("Cancel booking"), plus "Keep" / "Go back". The note becomes required when the chosen reason requires it (`requires_note` or code OTHER).

**AD-RSN-02 · Where reasons are required.** 🔒 (from the decisions and DB). Reason source: *M* = admin master list, *P* = preset code list in code, *F* = free text.

| Action | Reason source | Decision / table |
| --- | --- | --- |
| Cancel booking (staff or customer) | M `booking_cancel_reasons` (+ note if `requires_note`) | D-BKG-14 |
| START with performer ≠ booked barber | F `performer_change_reason` | D-VIS-04 |
| Record for another barber (proxy) | P `visits.proxy_reason`: 1 PHONE_UNAVAILABLE (D-VIS-12) · 2 OTHER (help-record, D-VIS-04) — no note field in the DB | D-VIS-12, D-VIS-04 |
| Finish a sale as someone other than the performer (and not the phone-unavailable recorder) | F (`sale.finish_override` — owner B2) | D-VIS-06 |
| Add a service not in the booking / remove a service line | F `added_reason` / removal reason | D-VIS-05 |
| Change the option of a booked service (v1.5) | F | D-VIS-02, Part 4 |
| Correct a KBZPay reference after FINISH (`payment.verify`, v1.5) | F | owner B10, D-PAY-02 |
| Attach / change the customer after FINISH (v1.5) | F | owner B10, D-VIS-08 |
| Difference sale (undercharge, v1.5) | F | owner B10 |
| Cancel an OPEN product-only sale (v1.5) | F | D-PAY-03, Part 4 |
| Mark visit incomplete | F | D-VIS-09 |
| Price override (permission `sale.override_price`) | F | D-SVC-04, F-P4-03 |
| Discount request | F (required) | D-PAY-04 |
| Void a payment (sale still OPEN) | F | Part 4 |
| Refund | F (required) | D-PAY-05 |
| Sale adjustment | F (required) | Part 4 |
| Late entry | P INTERNET_OUTAGE · POWER_OUTAGE · PHONE_BROKEN · FORGOT · OTHER (+ note) | D-VIS-13 |
| Opening float ≠ the last closed day's counted cash | F | D-FIN-06, owner E1 |
| Cash difference ≠ 0 at closing | F | D-FIN-06 |
| Unverified KBZPay payments at closing | F | D-PAY-02 |
| Reopen a closed day (admin) | F | D-FIN-06 |
| Delete an expense / manual income | F | D-FIN-03 |
| Reject an expense / manual income | F | Part 7 |
| Cash out | M `cash_out_reasons` (+ note) | D-FIN-07/08 |
| Edit or cancel a cash out / cancel a cash return while the day is open (v1.5) | F | owner E5, D-FIN-07/09 |
| Transfer received quantity ≠ sent | F | D-STK-03 |
| Manual stock adjustment | M `stock_adjustment_reasons` | D-STK-05 |
| Override an AUTO payroll line / attendance item | F | D-PAYR-05 |
| Reopen a payroll run · cancel a payroll run (v1.5) | F | D-PAYR-06, Part 5 |
| Withdraw a wrong, unused salary row / plan assignment (v1.5) | F | D-PAYR-02, D-COM-01, Part 5 |
| Cancel an advance / loan (v1.5) | F | D-PAYR-04, Part 5 |
| Manual attendance | P PHONE_UNAVAILABLE / OTHER (+ note) | D-ATT-06 |
| Attendance correction | F | D-ATT-05 |
| Void an attendance record (v1.5) | F | D-ATT-05, owner G (a) |
| Resolve exception as EXCUSED or VOID | F | Part 5 |
| Restore a backup | F | D-DAT-04 |

**AD-RSN-03 · Reason display.** ⚠️ Wherever the resulting record appears (detail, audit, report), show the reason next to the action and actor ("Cancelled by Ko Aung · Customer wants to change · 30/Sep/2026 2:10 PM").

### 5.5 Confirm dialogs

**AD-CONF-01 · Only when it matters.** ⚠️ Confirm only destructive, irreversible or money-committing actions: FINISH, refund, void payment, close day, finalize / publish / mark paid payroll, send transfer, post purchase / count, restore, revoke role, log out all devices. Never confirm routine saves. Never confirm twice.

**AD-CONF-02 · Content.** ⚠️ Title states the action; the body states consequences with facts ("Stock leaves Branch 1.0 now. You can't edit or cancel this transfer after sending."). Irreversible actions say "This can't be undone." (Fresha's clear wording is worth keeping). The confirm button repeats the verb ("Send transfer"); destructive actions use the destructive style. No bare "Are you sure?".

### 5.6 Wizards and full-screen flows

**AD-WIZ-01 · When.** ⚠️ Multi-step work that has a DB status lifecycle: payroll run, import, stock count, purchase, transfer, daily closing (desktop full page / mobile stepper). Show a stepper with the current step, completed ✓ steps and remaining steps (Goal-Gradient).

**AD-WIZ-02 · Saving.** ⚠️ Progress is saved as the DB status allows (DRAFT, IN_PROGRESS, CALCULATED…). Leaving shows where the user can resume ("Draft saved — continue from Payroll › Runs"). A "Continue" entry point exists on the relevant list and dashboard (Zeigarnik).

### 5.7 Calendar

**AD-CAL-01 · Day view with barber columns.** ⚠️ Jakob — same mental model as Fresha (`evidence/booking/calendar-01.png`): one column per barber working at the selected branch that day; time axis in 12-hour format at the slot interval (`booking.slot_interval_minutes`, default 15); a red current-time line; time outside the barber's shift hatched; leave blocks labelled with the leave type (pending leave shown with a "Pending" tag — it also blocks, D-LV-04).

**AD-CAL-02 · Booking blocks.** ⚠️ Show start–end time, customer name (`bookings.customer_name`), services (short), a status badge tone as left border, and icons for **Home** (🏠 D-BKG-22) and **Online** channel. The buffer and home-travel parts of the barber's block (`block_starts_at` … `block_ends_at`) are drawn as a lighter hatched extension so staff understand why the next slot isn't free.

**AD-CAL-03 · Cross-branch busy time.** ⚠️ A barber's booking at another branch appears in their column as a hatched block "At <branch>" (Fresha pattern `evidence/booking/calendar-baber-tue29-aung.png`), not clickable unless the user has scope there.

**AD-CAL-04 · Creating from the calendar.** ⚠️ Tap/click an empty slot → booking drawer prefilled with barber + time (AD-BKG-01). Slots that can't be booked (outside shift, on leave, in the past) don't open the drawer and show why on hover/long-press.

**AD-CAL-05 · Conflicts are blocked, not warned.** 🔒 D-BKG-08. Unlike Fresha (soft "Team member is not available" and save anyway), the database rejects overlapping blocks. The UI shows "This time was just taken" with the 3 nearest free times for the same barber and a button to pick another barber.

**AD-CAL-06 · Views and filters.** ⚠️ Day (default), Week (per barber: 7 day columns for one barber), List. Filters: barbers (multi), status. **Barber view** (⚠️ addition, fixes Fresha pain "one branch per calendar view"): one barber across all their branches for a day or week, so a multi-branch barber's whole day is visible at once.

**AD-CAL-07 · Mobile calendar.** ⚠️ One barber column at a time with barber chips at the top (swipe or tap to switch), horizontal day swipe, a "Today" button, list view as an alternative. The barber sees their own column by default.

**AD-CAL-08 · Realtime.** ⚠️ New, moved and cancelled bookings appear live (Socket.IO) with a 2-second highlight (AD-RT-02).

### 5.8 Dashboards

**AD-DSH-01 · Per-role content.** 🔒 D-DSH-01..04 + OPEN-10 ✅ (owner 01/Oct). Admin: branch dropdown top-left (All / branch), overview KPIs, bookings, revenue, customers, barber KPIs, branch comparison, stock, expenses, P&L. Manager: the tiles of the reports they hold, for assigned branches only (P&L tile: salary as one line) — **v1.5:** each tile is gated by its report code (owner F1 / E6, API Part 8 P8.DSH.01). Barber: schedule, upcoming, current/next, completed today, notifications; **own sales / commission widget** — visibility is decided in two layers (owner 01/Oct, second round: "all at once, or one by one — both"): (1) company setting **`dashboard.show_own_earnings_all`** (Settings › Dashboard, boolean, **default OFF** — `settings.json`, D-PLT-16), (2) per-barber override **`employees.show_own_earnings`** (Employee › Pay tab: *Follow company setting* = NULL / *Show* = true / *Hide* = false — DB Part 1 v3.4). Effective = `COALESCE(employee override, company setting)`. When effective ON the widget shows today's / this month's own sales and the commission **estimate** ("final at month end", D-COM-04); it never shows colleagues' figures (AD-PERM-05). **v1.5 (owner C12):** the estimate steps through the tiers from month-to-date (2,240,000 + 30,000 → 5,500), so the month's estimates add up to the final figure (one engine — API Part 5 P5-RULE-02, P5.CMS.02). No customer dashboard.

**AD-DSH-02 · KPI tiles.** ⚠️ ≤ 6 tiles per row (Miller). Each tile: label, value (`text-3xl`, tabular), comparison vs previous period (▲/▼ + %, colour + arrow + text), and "Updated 2:14 PM". Tiles link to the report behind them.

**AD-DSH-03 · Freshness.** ⚠️ Fresha reports were 26–28 minutes old. Ours show live data or state the time they were computed ("as of 2:14 PM"). Never show stale numbers without a timestamp.

**AD-DSH-04 · "Needs attention" panel.** ⚠️ Zeigarnik. Count cards for unfinished work in scope: open visits, pending discount requests, pending expenses / incomes, pending leave, OPEN attendance exceptions, unverified KBZPay (today), days not yet closed, transfers in transit, low-stock products, **negative stock**, **purchases waiting to post**, **counts in progress** (v1.5 — API Part 6), outstanding must-return cash, payroll runs not PAID. **"Days not closed" (v1.5 — API Part 7 P7-RULE-03)** = every open day plus every day with money activity (also a closure day with a sale), counted from the branch's first active date — days before go-live never count. Each card is gated by its action code (P8.DSH.02) and links to the filtered list.

### 5.9 Reports

**AD-RPT-01 · Common layout.** 🔒 D-RPT-01 (10 reports; common date range; summary + filters + detail) + ⚠️. Date range (presets + custom, MMT business dates) → branch (scope) → report-specific filters → summary cards → detail table with a totals row → Export (AD-LIST-07). Show "Generated 30/Sep/2026 2:14 PM". **v1.5 (owner F1 / F6, H — API Part 8 P8-RULE-14 / 15, ADR-015):** each report has **its own code** (`report_<key>.view` — listed in AD-RPT-04; ⑥ = `pnl.view`); ⑦ Commission & payroll is *Private* — company scope only; the date range is at most **366 days** (live queries); refunds count on the **refund date**, and a returning customer = an identified customer with an earlier finished visit (owner F6); the Manager seed holds every report except ⑦ (⑥ = their branches' P&L with salary as one line — owner E6).

**AD-RPT-02 · Presets first.** ⚠️ Choice Overload. Open every report on a sensible preset (This month for money, Today for operations) instead of an empty form.

**AD-RPT-03 · Flags in reports.** 🔒 Surface the exception flags the decisions ask for: late entry (D-VIS-13), proxy-recorded / proxy-collected payments (D-VIS-06/12), phone capture rate by barber (D-VIS-02), discount usage by code and barber and requests per barber (D-PAY-04), manual attendance count per employee (D-ATT-06), transfer shortfall and in-transit (D-STK-03), outstanding must-return cash (D-FIN-09), cash-return reversal rows with original date and amount + P&L note (D-FIN-09).

**AD-RPT-04 · The list of 10 reports.** 🔒 D-RPT-01 (OPEN-34 ✅ — owner "OK" 01/Oct 10:47; the list below is the locked one).

*Background:* the original ChatGPT planning chat (P130–P145) locked "the system has **10 reports**, each with a common date range, a summary, filters and a detail table" (🔒 D-RPT-01), but the names were never copied into the register before the chat was deleted. The list below was rebuilt from the other locked decisions and **confirmed by the owner on 01/Oct** ("OPEN-34: OK").

*The 10 reports (🔒 — confirmed by the owner; names are the EN keys, MM labels come from the language file; v1.5: each name is followed by its permission code — owner F1, API Part 8 §14, endpoints P8.RPT.02..11):*

| # | Report | What it answers | From decisions |
| --- | --- | --- | --- |
| 1 | **Sales summary** · `report_sales.view` | Revenue by branch / day / category / service; finished sales count; average per visit | D-KPI-01/02, D-FIN-05 |
| 2 | **Barber performance** · `report_barber_performance.view` | Per barber: visits, revenue, average, phone-capture rate %, late-entry count, proxy-recorded count | D-VIS-02, D-VIS-12/13, D-KPI-01 |
| 3 | **Payments & KBZPay** · `report_payments.view` | By method; KBZPay references verified / unverified; collected-by ≠ performer; proxy-collected | D-PAY-01/02, D-VIS-06 |
| 4 | **Discounts & refunds** · `report_discounts_refunds.view` | Code usage by code / branch / barber; approval requests per barber (approved / rejected); refunds and adjustments with reasons | D-PAY-04/05, Part 4 |
| 5 | **Daily closing & cash** · `report_closing_cash.view` | Per branch-date: expected vs counted, difference + reason, reopen count; cash outs by reason; must-return outstanding | D-FIN-06..09 |
| 6 | **Expenses & P&L** · `pnl.view` | Expenses by category / branch (incl. paid-via); manual incomes; monthly P&L with cash-return reversal rows | D-FIN-01..05, D-FIN-09 |
| 7 | **Commission & payroll** · `report_commission_payroll.view` (*Private* — company scope) | Per employee / period: commissionable sales, tier reached, commission (EARN / REVERSAL), payroll net, advances / loans balance | D-COM-01..04, D-PAYR-* |
| 8 | **Attendance & leave** · `report_attendance_leave.view` | Late / absent / early-leave by employee and month, exceptions by status, manual-attendance count, leave taken by type | D-ATT-01..06, D-LV-* |
| 9 | **Bookings & customers** · `report_bookings_customers.view` | Online vs staff bookings, cancellations by reason, no-shows, reschedules; new vs returning customers, returning rate | D-BKG-*, D-KPI-03, D-CUS-08 |
| 10 | **Stock** · `report_stock.view` | Stock levels + low stock, **negative stock**, movements, usage by barber, purchases, transfers **in transit** / shortfalls, **over / short receipts**, count differences, **write-offs by reason** (v1.5 — API Part 6, owner D5 / D9) | D-STK-01..06 |

Build the report *template* (AD-RPT-01) first, then these 10 in the order above (#1, #5, #6, #7 are needed for the first month-end). Don't add report names beyond this list without a new decision.

### 5.10 Settings screens

**AD-SET-01 · Additional / Advanced Settings.** 🔒 D-PLT-07, D-PLT-16. Settings are grouped by module (Booking, Schedule & leave, Sales & payments, Closing, Payroll & attendance, Stock, Website, Dashboard — `dashboard.show_own_earnings_all` (AD-DSH-01), System). Each row: label + help text (language file), a control matching the `settings.json` type (number with unit, switch, time, choice, MM/EN text, JSON editor for admins only), and the **effective value source** badge: *Default* / *Company* / *Branch override*. **v1.5:** **Payroll & attendance** settings have company values only — no branch overrides (owner C1 + Part 5 research D6; API Part 5 §17). The **Stock** group gets `stock.refund_damaged_reason_id` — the adjustment reason used for a refunded product marked *Damaged* (picker of ACTIVE reasons; owner B8 a, API Part 6 §13). The **Website** keys (`site.*`) are shown read-only here and edited in *Website › Site content* with `website.update` (owner F7; API Part 8 §17). Dropped keys — never shown: `sales.kbzpay_reference_regex` (→ payment method format, AD-FORM-12), `closing.close_roles` (→ permission `closing.close`), `site.domain` (server setting, shown read-only in Website — AD-WEB-02), `stock.low_stock_notify_roles` (→ notification recipients).

**AD-SET-02 · Branch overrides.** 🔒 D-PLT-16. Only keys whose `settings.json` scope allows branch show "Override for a branch". The override list shows each branch's effective value and a "Reset to company value" action.

**AD-SET-03 · History and impact.** 🔒 `settings_history` + ⚠️. Each setting has a "History" link (who, when, old → new). Settings that change behaviour for live operations (slot interval, advance window, tolerance, deduction rules, KBZPay reference format, tax / service charge) show an impact note before saving ("Applies to new bookings from now; existing bookings keep their times", "Applies to payroll runs calculated after today; finalized runs keep their rules snapshot").

**AD-SET-04 · Master lists.** ⚠️ Cancel reasons, cash-out reasons, categories, leave types, adjustment reasons, payment methods: a list with drag-to-reorder (`sort_order`), bilingual name, status. **Archive / Disable, never Delete** (D-DAT-05, D-STK-05). System rows (e.g. the "Customer no-show" cancel reason `system_code 1`, the 3 system expense categories, the 8 system payroll categories) show a lock icon and can't be archived or have their code changed. **v1.5:** the stock adjustment reason referenced by `stock.refund_damaged_reason_id` also shows a lock icon and can't be disabled while referenced (API Part 6 P6.RSN.04 `reason_in_use_by_setting`); a cash-out reason's **accounting type** (and advance / loan kind) is fixed once the reason has been used (API Part 7 P7-RULE-13, P7.COR.03 `reason_in_use`).

### 5.11 Loading, empty, error and special states

**AD-STATE-01 · Loading.** ⚠️ Skeletons shaped like the content for anything that takes > 400 ms. Never a blank page with a centred spinner (Fresha "loading hang", `evidence/ux/loading-hang-clients-list.png`). Buttons show an inline spinner while their action runs.

**AD-STATE-02 · Empty.** ⚠️ Explain what the area is for and the next step, with the action if the user can do it ("No bookings today. Walk-ins are recorded from ＋ Start."). Permission-aware: don't offer actions the user can't take.

**AD-STATE-03 · Errors.** ⚠️ Say what happened, what it means for the user's work, and what to do next, with a Retry when retrying is safe. Include a short error ID for support. Tone calm, no blame, no technical jargon (Peak-End: negative moments are remembered).

**AD-STATE-04 · Forbidden and not found.** ⚠️ 403 page: "You don't have access to this page. Ask an admin if you need it." 404: "This item doesn't exist or was archived." Both with a link Home. Never show a 403 after the user clicked a visible button (hide it instead — §9).

**AD-STATE-05 · Offline and outage.** 🔒 D-VIS-13 + ⚠️ wording. When the network is down or the API is unreachable: a persistent top banner "No connection. Money actions can't be saved right now. Write the service on paper and add it later with Late entry." with a link to the late-entry help. Forms keep their input; money actions are not queued (no offline mode in V1).

**AD-STATE-06 · Closed day.** 🔒 D-FIN-06, D-VIS-13. When the selected branch/date is CLOSED: a lock banner ("30/Sep/2026 at Branch 3.0 was closed by Ma Hnin at 9:05 PM"). Late entry, sales and payments, refunds, cash outs, cash returns and cash income for that date are unavailable (KBZPay ticking stays available — owner E3), with "An admin can reopen the day" (admins see the Reopen button). Server answer: 422 `day_closed` with who closed it and when (API Part 7 `DayLock`, owner B9).

### 5.12 Feedback, toasts and realtime

**AD-TOAST-01 · Toasts.** ⚠️ Short success confirmations only ("Booking saved"), 3–4 s, bottom on mobile (above the bottom nav), top-right on desktop, max one at a time. Errors that need action stay inline (AD-FORM-04). No "Undo" for money actions — corrections use refund / adjustment flows.

**AD-RT-01 · Live data.** ⚠️ Calendar, Today, approvals, notifications and closing screens subscribe to realtime events (Socket.IO, review §5.2). Lists update in place without losing scroll position or open drawers.

**AD-RT-02 · Change highlight.** ⚠️ Selective Attention (change blindness). A record that changed because of someone else's action gets a 2-second `--accent` highlight. If the user is editing that same record, show a non-blocking banner "Updated by Ko Min just now — Reload" instead of overwriting their input.

### 5.13 In-context help

**AD-HELP-01 · Help text.** ⚠️ Paradox of the Active User. Every non-obvious field has helper text from the language file. Complex settings (commission tiers, deduction rules, allocation basis, tolerance) have a `?` popover with an example using real numbers.

**AD-HELP-02 · "How is this calculated?"** ⚠️ Tesler. Every computed money figure that staff might question has an expandable breakdown: expected cash (formula lines, REC-17), sale total (subtotal − discount + service charge + tax), commission estimate (base × tier = estimate, "final at month end" D-COM-04), payroll net (earnings − deductions, with AUTO/MANUAL lines), transport fee, reschedule price change reason (D-BKG-12).

**AD-HELP-03 · First-use tips.** ⚠️ One-time, dismissible tips (stored per user on the device) on: the barber's first START, the first checkout, the first daily closing, the price grid editor. Max 3 short steps. Never block the task.

---

## 6. Components

Build each once in `packages/ui` / `apps/web/components` on top of shadcn/ui and reuse it everywhere (§14.2). Rules below are in addition to shadcn defaults.

### 6.1 Buttons

**AD-CMP-01 · Hierarchy and size.** ⚠️
| Variant | Use | Limit |
| --- | --- | --- |
| Primary (filled `--primary`) | The main action of the view | **1 per view** |
| Secondary (outline / `--secondary`) | Alternative actions | ≤ 2 visible |
| Ghost / link | Low-emphasis, navigation | – |
| Destructive (`--destructive`) | Cancel booking, void, delete, reject, revoke | Never next to primary without spacing |
- Height: **48 px on mobile** (full-width in bottom bars), 40 px on desktop. Touch area never < 44 × 44 px, even for icon buttons (pad invisible area).
- Labels are **verbs** ("Take payment", "Close day"), from the language file. No "OK" / "Submit".
- Loading: spinner inside the button, label kept, button disabled until the request settles.

**AD-CMP-02 · Big choice buttons.** ⚠️ Where the user picks one of 2–4 options to proceed (arrival: Booking / Walk-in; payment method: Cash / KBZPay / Split), use large tappable cards (icon + label, ≥ 72 px tall), like Fresha's payment method cards (`evidence/payments/checkout-03-payment.png`).

### 6.2 Inputs

Covered by AD-FORM-09..16. Additional component rules:

**AD-CMP-03 · Segmented control.** ⚠️ For 2–4 mutually exclusive, frequently switched options (Shop / Home, Day / Week / List, % / Ks). Never for > 4.

**AD-CMP-04 · Switch vs checkbox.** ⚠️ Switch = takes effect immediately (settings rows, notification type on/off). Checkbox = part of a form submitted later, or multi-select lists (KBZPay verification ✔ list is a checkbox list inside the closing form).

### 6.3 Status badges — one map for the whole app

**AD-CMP-05 · Status map.** 🔒 D-DB-03 (number codes, labels from the language file) + ⚠️ tones. Code uses the constant names; the label key is `status.<table>.<CONSTANT>`; the tone comes **only** from this table (Law of Similarity). Tones: **neutral** (outline) · **info** · **success** · **warning** · **danger** · **muted** (greyed, for ended/cancelled). Every badge = tone + icon + text.

| Entity (table) | Code → tone |
| --- | --- |
| Booking (`bookings.status`) | 1 BOOKED → neutral · 2 STARTED → info · 3 COMPLETED → success · 0 CANCELLED → muted (time struck through) |
| Visit (`visits.status`) | 1 STARTED "In service" → info · 2 COMPLETED "Awaiting payment" → **warning** · 3 FINISHED → success · 0 INCOMPLETE → muted |
| Sale (`sales.status`) | 1 OPEN → info · 2 FINISHED → success (lock icon) · 0 CANCELLED → muted |
| Payment | voided → muted (amount struck through) · KBZPay unverified → warning · verified → success |
| Discount request | 1 PENDING → warning · 2 APPROVED → success · 3 REJECTED → danger · 0 CANCELLED → muted |
| Leave (`leaves.status`) | 1 PENDING → warning · 2 APPROVED → success · 3 REJECTED → danger · 0 CANCELLED → muted |
| Payroll run | 1 DRAFT → neutral · 2 CALCULATED → info · 3 FINALIZED → warning (lock) · 4 PUBLISHED → warning (lock + sent) · 5 PAID → success · 0 CANCELLED → muted |
| Attendance exception | 1 OPEN → warning · 2 EXCUSED → neutral · 3 CONFIRMED → danger · 4 LEAVE → info · 0 VOID → muted |
| Purchase | 1 DRAFT → neutral · 2 POSTED → success (lock) · 0 CANCELLED → muted |
| Stock transfer | 1 DRAFT → neutral · 2 SENT "In transit" → info · 3 RECEIVED → success (+ "Short N" / "Over N" warning flag if different — v1.5, P6-RULE-09) · 0 CANCELLED → muted |
| Stock count | 1 IN_PROGRESS → info · 2 POSTED → success · 0 CANCELLED → muted |
| Daily closing | 1 OPEN → neutral for today, **warning "Not closed"** for past dates · 2 CLOSED → success (lock) · reopened → extra flag "Reopened ×N" |
| Expense / manual income | 1 PENDING → warning · 2 APPROVED → success · 3 REJECTED → danger · deleted → muted "Deleted" |
| Receivable (advance / loan) | 1 ACTIVE "Outstanding" → info · 2 SETTLED → success · 0 CANCELLED → muted |
| Must-return cash out | outstanding → warning · returned → success · converted to expense → warning "Charged to expense" · cancelled → muted "Cancelled" |
| Cash out / cash return (v1.5 — owner E5, DB Part 7 v1.1 `cancelled_at`) | active → no badge · cancelled → muted "Cancelled" (amount struck through) |
| User login (`users.status`) | 2 INVITED → info · 1 ACTIVE → success · 0 DISABLED → muted |
| Employee (`employees.status`) | 1 ACTIVE → success · 0 INACTIVE / 2 RESIGNED / 3 TERMINATED → muted |
| Import job / row | UPLOADED neutral · VALIDATED info · CONFIRMED success · FAILED danger · CANCELLED muted / row 1 PENDING neutral · 2 VALID success · 3 ERROR danger · 4 IMPORTED success · 5 SKIPPED muted |
| Backup run | RUNNING info · SUCCESS success · FAILED danger |
| Master data (branch, role, service, product, customer…) | ACTIVE → no badge (default) · INACTIVE / archived → muted |

**AD-CMP-06 · Flags (not statuses).** ⚠️ Small labelled chips that mark exceptions (Von Restorff), same everywhere:
| Flag | Tone + icon | Source |
| --- | --- | --- |
| Late entry | warning · clock | `visits` late entry (D-VIS-13) |
| Recorded by <name> (proxy) | info · users | D-VIS-12 |
| Home service | neutral · home | location_type HOME (D-SVC-06) |
| Online booking | neutral · globe | channel ONLINE |
| Price changed | warning · pencil | list ≠ charged price (override) |
| Discount | info · tag | code or approved request |
| Negative stock | danger · alert | quantity_on_hand < 0 |
| Low stock | warning · package | at or below threshold (v1.5 — API Part 6 P6-RULE-04) |
| Manual attendance | warning · hand | method MANUAL |
| Late / Absent / Early leave | danger / danger / warning | attendance exceptions |
| Pending leave | warning · calendar | blocks bookings (D-LV-04) |
| Difference sale (v1.5) | info · receipt | a visit-less sale that collects an undercharge for the original barber (owner B10 — AD-POS-18) |
| Change returned (v1.5) | info · coins | an over-transfer returned in cash at Finish — automatic RF return (owner B5 — AD-POS-08) |

### 6.4 Data tables

**AD-CMP-07 · Tables.** ⚠️ shadcn `Table` + TanStack Table. Sticky header; sortable columns where the API supports it; row height 48 px (desktop), 56 px for touch; numbers right-aligned in `--font-numeric` tabular digits; a totals row for money columns; zebra striping off (use row dividers); selected row highlighted. On mobile, tables become card lists (AD-LIST-02). Wide report tables on desktop may scroll horizontally with a sticky first column — the page itself never scrolls sideways.

### 6.5 Overlays

**AD-CMP-08 · Which overlay.** ⚠️
| Overlay | Use | Mobile |
| --- | --- | --- |
| **Drawer** (right, 480–640 px) | View/edit one transactional record in context; create booking | Full-screen sheet |
| **Dialog** (centred) | Confirm, reason, short forms (≤ 4 fields) | Bottom sheet |
| **Full page** | Multi-section editing, wizards, price grid, payroll review, daily closing | Full page with stepper |
| **Popover** | Filters, help `?`, date picker | Bottom sheet |
| **Tooltip** | Labels for icon buttons (desktop only) | Not used — use visible labels |
- Never stack more than one dialog on top of a drawer. If a flow needs a second level, move to a full page.
- Keep a drawer open after a status change inside it (Fresha closes the drawer on each status change — `ux-analysis.md`); refresh its content in place.

### 6.6 People chips, timelines, steppers, cards

**AD-CMP-09 · Employee chip.** ⚠️ Avatar + display name (+ branch when relevant). Used for performer, booked barber, collected by, recorded by, approver. Tapping opens a mini profile (name, branches, role) if permitted.

**AD-CMP-10 · Cards and sections.** ⚠️ Common Region: related information sits in one card with a title; cards have 16 px padding (mobile) / 24 px (desktop), 1 px `--border`, radius md. Don't nest cards more than one level.

**AD-CMP-11 · Timeline.** ⚠️ Uniform Connectedness: a vertical line with dots for ordered items — booking items back-to-back (with each item's time, duration, buffer), visit history, audit history, cash-out → returns.

**AD-CMP-12 · Stepper.** ⚠️ Horizontal on desktop, compact "Step 2 of 4 · Payment" + progress bar on mobile. Completed steps are clickable to go back when data allows.

### 6.7 Charts

**AD-CHART-01 · Simple charts only.** ⚠️ Bar (compare branches / barbers / categories) and line (trend over days/months). No pie/donut with more than 4 slices, no 3D, no dual axes. Colours from `--chart-1..6`; always label values or provide a table toggle; axis labels in the current language; money axis in Ks with thousands separators. On mobile, prefer a ranked list with inline bars over a chart.

### 6.8 Price grid editor (option services)

**AD-CMP-13 · Grid.** 🔒 D-SVC-05, D-DB-06 + ⚠️ layout.
- Max **2 option groups** in the UI: group 1 = rows (e.g. Colour), group 2 = columns (e.g. Length). One group = a single column list.
- Tabs or a selector for **branch** and for **location Shop / Home** (D-SVC-06).
- Each cell: price (MoneyInput) + optional duration (placeholder shows the service default).
- **Shop tab: empty cell = not sold at this branch**, shown as "—" with the tooltip "Not sold here" (don't use 0; 0 is a valid price).
- **Home tab: empty cell = the shop price is used** (🔒 D-SVC-06 "မဖြည့်ရင် ဆိုင်ဈေး"; Part 2 `service_prices` "HOME row မရှိ → BRANCH ဈေး"). Show the inherited shop price as a greyed placeholder ("Uses shop price · 7,000 Ks"), like Fresha's inherited defaults.
- "Copy from branch…" action (⚠️ suggestion noted in D-SVC-05) copies a whole grid, then the user edits.
- Prices are effective-dated (🔒 D-SVC-08): editing opens "Change prices from [date]" (default tomorrow). The screen shows current and scheduled grids side by side, and history by date. Past price rows are read-only.
- SIMPLE services use the same editor with a single cell per branch/location. The barber override column exists only for SIMPLE services at the shop in V1 (D-SVC-03/05).

### 6.9 Receipt (print and view)

**AD-RCPT-01 · Content.** 🔒 D-PAY-06, D-WEB-03/04 + 🔒 owner 01/Oct (**receipt language = English, always** — OPEN-32 ✅) + ⚠️ layout. The receipt is rendered in **English regardless of the user's UI language or branch**: labels and footer text come from the `en` language file, item descriptions use the `*_en` snapshot and fall back to `*_mm` when no English name exists (D-DB-04 — ⚠️ go-live data task: give every service, option value and product an English name so receipts are fully English). Reprints and PDFs are therefore always identical (the "reprint in the other language" API question is closed). Top to bottom:
1. Logo (monochrome version if provided), company name, **branch name, address, phone** (company/branch info — `*_en` with MM fallback).
2. **Receipt number** large (`B3-2026-OCT-00125`, never translated), date and time (`30/Sep/2026 2:41 PM`).
3. **Barber** = actual performer (one line if one performer; otherwise shown per item).
4. Customer name if the sale has a customer (⚠️ never print the full phone; if shown, mask as `09•••••123`).
5. Items: description snapshot (`description_en`, fallback `description_mm`), option (e.g. "Black · 7–12\""), qty × unit price, line amount; transport fee line for home service.
6. Subtotal, discount (code label or "Approved discount"), service charge / tax lines only if enabled, **Total**.
7. Payments: method + amount, **KBZPay reference**, and "Change returned (cash) 3,000 Ks — B3-RF-…" when an over-transfer was returned (owner B5 — AD-POS-08).
8. Footer: opening hours (D-WEB-04), thank-you text (setting — the EN value is printed; MM value unused on receipts).
- Refund receipts (`B3-RF-2026-OCT-00003`) use the same template with the title "Refund", the original receipt number, refunded items and method.
- Reprint prints the same number and the same text (D-PAY-06).
- **PDF:** every sale and refund receipt can also be downloaded / shared as a PDF with the same number and text (🔒 D-PAY-06 "PDF/print"). This is the receipt path for iPhone and desktop users (Share → Viber / save).

**AD-RCPT-02 · Rendering and printing.** 🔒 D-PAY-07 + ⚠️ specs.
- **v1.5 (owner H — ADR-013, API Part 4 P4-RULE-18):** the server renders the receipt (HTML → headless Chromium, ADR-013) to a **PDF** and a **1-bit PNG** — 384 px for 58 mm, 576 px for 80 mm (203 dpi; setting `receipt.printer_width_mm`, per branch, default 58) — and stores both, so every reprint is identical (owner H, D-PAY-06); the Android shell prints the PNG. Myanmar script prints correctly because it is shaped by the server renderer; body text ≥ 22 px at 384 px width.
- **Works for everyone, no device count assumed** (OPEN-20 ✅ owner 01/Oct: "make it work rather than asking how many"). **PDF / Share is the first-class receipt path on every device** (Android, iPhone, Windows): one tap on the success screen → PDF → Share sheet (Viber / Messenger / save) or "Open". **Print** is the Android add-on: shown only where the shell reports `canBluetoothPrint` (AD-PWA-02). On iPhone / desktop browsers, hide "Print", keep **PDF / Share**, and show "To print, open this sale on an Android phone" (AD-POS-13). Both paths produce the same image / PDF from the same renderer.
- **A printer error never blocks payment.** Show a non-blocking warning with "Retry" and "Print later" (the sale's detail keeps a Print button).
- Auto-print after FINISH is a setting (`receipt.auto_print`), **default OFF** (REC-37 ✅ — owner H).
- Receipt language: **English, always** (OPEN-32 ✅ — AD-RCPT-01). No branch or user override.

### 6.10 QR codes (two kinds — never confuse them)

**AD-QR-01 · Booking QR (for customers).** 🔒 D-BKG-01, D-WEB-02. Encodes the public URL `/book?branch=<code>`. Print template: branch name, "Scan to book" (MM + EN), the short URL as text, company logo. A5 / A6 poster sizes. Available in Website › Booking QR codes. **v1.5:** the URL is built from the server's site address (`SITE_ORIGIN/book?branch=<code>` — P8.WEB.11); the poster PDF comes from the export service (kind `booking_qr_poster`) and needs `website.view`, not the export permission `data.export` (owner F2 / F7, API Part 8).

**AD-QR-02 · Attendance QR (staff only).** 🔒 D-ATT-01, `branch_attendance_qr_tokens`. Encodes the app URL **`/clock?t=<token>`** (the branch's random token), which opens the clock-in screen from the in-app scanner or the phone camera (v1.5 — API Part 5 P5-RULE-17). Print template is visibly different: header "STAFF ATTENDANCE — not for customers", branch name, generated date, "If this code is replaced, the old one stops working." **Regenerate** asks for confirmation and revokes the old token (kept as history). Only users with **`attendance_qr.view`** see it (regenerate = `attendance_qr.create`, revoke without replacement = `attendance_qr.delete`). The poster PDF comes from the export service (kind `attendance_qr_poster`) and needs `attendance_qr.view`, not the export permission `data.export` (API Part 8).

---

## 7. Formatting and localization

### 7.1 Formats (one formatter module, used everywhere)

**AD-FMT-00 · One formatter.** ⚠️ All display formatting goes through shared helpers in `packages/shared` (`formatMoney`, `formatDate`, `formatTime`, `formatDateTime`, `formatDuration`, `formatPhone`, `formatPercent`, `formatQty`) so every screen, export and receipt matches (Fresha mixed "Sun, Sep 27, 2026", "27 Sep 2026, 15:59" and 24 h / 12 h on the same account — `ux-analysis.md`). No component calls `toLocaleString` directly.

| ID | What | English UI | Myanmar UI | Rule |
| --- | --- | --- | --- | --- |
| AD-FMT-01 | Money | `7,000 Ks` · `1,250,000 Ks` | `7,000 ကျပ်` (🔒 D-PLT-04 — ✅ owner confirmed 01/Oct: **the app does not change**; only the website shows `Ks` in both languages — FE-FMT-01). The formatter has a profile (`app` / `site`) | 🔒 D-PLT-04 (unit + comma, whole kyats). ⚠️ unit as suffix; in table columns put the unit in the header ("Amount (Ks)") and show numbers only. Refunds / reversals show a leading minus: `-6,000 Ks` |
| AD-FMT-02 | Date | `30/Sep/2026` · with weekday `Wed, 30/Sep/2026` | `30/Sep/2026` — **English month abbreviation in both languages** (OPEN-32 ✅ owner 01/Oct, example `01/Oct/2026`); weekday word translated (`ဗုဒ္ဓဟူး, 30/Sep/2026`) | 🔒 D-PLT-05 `DD/MMM/YYYY`. "Today" / "Yesterday" allowed in lists for recent dates |
| AD-FMT-03 | Time | `2:30 PM` · range `2:30 – 3:15 PM` | `2:30 PM` — **AM / PM in both languages** (OPEN-32 ✅; no နံနက် / ညနေ) | 🔒 D-PLT-05 12-hour, MMT. Never show seconds or a time zone label |
| AD-FMT-04 | Phone | `09 7xx xxx xxx` (local grouping of `+959…`) | same | ⚠️ display in local grouped format; store E.164 (D-CUS-02) |
| AD-FMT-05 | Duration | `45 min` · `1 h 30 min` | `45 မိနစ်` · `1 နာရီ 30 မိနစ်` | ⚠️ |
| AD-FMT-06 | Receipt no. | `B3-2026-OCT-00125` | same (never translated) | 🔒 D-PAY-06 |
| AD-FMT-07 | Percent | `15%` · `12.5%` | same | ⚠️ max 2 decimals, trailing zeros trimmed |
| AD-FMT-08 | Quantity | `3 pcs` | `3 ခု` | 🔒 D-STK-01 (unit = pcs) |
| AD-FMT-09 | Relative time | `just now` · `5 min ago` · `2 h ago` → absolute date after 24 h | same in MM words | ⚠️ used for notifications and "last updated" only |

**AD-FMT-10 · Digits.** 🔒 owner 01/Oct (OPEN-32 ✅): **Western digits (0–9) for all data values in both languages** (money, dates, times, phones, quantities, receipt numbers, KBZPay references). Reasons: receipts and KBZPay references are Western-digit strings (D-PAY-06), phone numbers are typed that way, and mixed digit systems cause entry errors. Words and labels are translated. Inputs still **accept** Myanmar digits (၀–၉) typed by staff and normalise them to 0–9 (Postel); they are never displayed.

**AD-FMT-11 · Business date and time zone.** 🔒 D-PLT-15. "Today" = the MMT calendar date. A sale's business date is its FINISH date; a visit's is its START date (Part 4). When a list could be read either way, the column header says which ("Finished on", "Started on").

### 7.2 Language

**AD-L10N-01 · No hard-coded strings.** 🔒 D-PLT-03. Every visible string (labels, buttons, errors, empty states, help, toasts, status labels, permission labels, setting labels, notification templates, receipt text) comes from the language files `my` and `en` via `next-intl`. A lint rule fails the build on raw JSX text; CI fails on keys missing in either file.

**AD-L10N-02 · Key naming.** ⚠️ `<module>.<screen>.<element>` (e.g. `pos.checkout.takePayment`); shared: `common.*`, `status.<table>.<CONSTANT>`, `permission.<code>`, `settings.<key>.label|help`, `reason.<code>`, `error.<code>`, `notification.<template_key>`. The same key is never reused for a different meaning.

**AD-L10N-03 · Bilingual data display.** 🔒 D-DB-04. EN UI shows `*_en`, falling back to `*_mm` when empty; MM UI shows `*_mm`. Free text and customer names show as typed. Don't label fallbacks.

**AD-L10N-04 · Myanmar typography.** ⚠️ Myanmar text is taller and usually 30–60% longer than English.
- Use the Myanmar line-heights from AD-VIS-06. Never set a fixed height with `overflow: hidden` on text containers (stacked marks get clipped).
- Layouts must **wrap**, not truncate, labels, buttons, badges and headings. Truncate only non-critical secondary text (with a tooltip / full text on tap). Never truncate money, status or names in attribution.
- No uppercase, italics, letter-spacing or justified text for Myanmar.
- Set `<html lang="my">` / `lang="en"` so the right font and screen-reader voice are used.
- Test every screen at 320 px in Myanmar before calling it done (AD-QA-01).

**AD-L10N-05 · Line breaking.** ⚠️ Burmese has no spaces between words, so long labels may not break where expected. Allow `overflow-wrap: anywhere` in narrow containers (chips, table cells, buttons). For long fixed UI strings, the language file may insert U+200B (zero-width space) at phrase boundaries. Never insert U+200B into stored data.

**AD-L10N-06 · Switching language.** 🔒 D-PLT-03 + OPEN-33 ✅ (owner 01/Oct: "user account base"). The switch changes all UI text immediately without reloading data and **saves the choice on the user account** — `users.ui_language` (1 MY · 2 EN · NULL = system default; **DB Part 1 v3.3+** — current v3.4, D-DB-02). The server returns it in the session payload, so the same language follows the user to any phone or PC and survives reinstalling the PWA; a cookie mirrors it only so the first paint after login is already in the right language. Notifications re-render in the viewer's language from `template_key` + payload (Part 8); ⚠️ the OTP / invite emails (D-AUTH-01/03) use `ui_language` too, falling back to the system default before the user ever chose. Default = the system default language setting.

**AD-L10N-07 · Zawgyi.** ⚠️ Input: detect Zawgyi and convert to Unicode (AD-FORM-13). Output: Unicode only. Imported files (Fresha export) are checked and converted during the import validation step, with a per-row note.

**AD-L10N-08 · Sorting and search.** ⚠️ Sort Myanmar strings with `Intl.Collator('my')` on the client and the matching collation on the server. Search trims spaces, is case-insensitive for Latin, and matches phones in any format (AD-FORM-10).

### 7.3 Terminology

**AD-COPY-01 · Use the glossary.** 🔒 Glossary (review §6.1) + ⚠️ UI labels in §13. One term per concept on every screen: Booking, Visit, Sale, Payment, Refund, Adjustment, Daily closing, Commission, Payroll, Advance / Loan, Branch, Employee, Customer, Service. The DB word "employee" is shown as "Barber" only where the screen is about service staff (performer pickers); elsewhere "Staff" / "Employee".

**AD-COPY-02 · Same action, same words.** ⚠️ A given action always uses the same verb and icon everywhere (Start, Service done, Take payment, Finish, Reschedule, Cancel booking, Refund, Close day, Reopen day, Approve, Reject, Archive).

---

## 8. Performance, feedback and reliability

**AD-PERF-01 · Budgets.** ⚠️ Doherty Threshold.
- Visual response to any tap/click (pressed state, spinner start) < **100 ms**.
- POS and booking actions (START, add service, take payment, FINISH, booking save): API p95 ≤ **400 ms** at Point's volume.
- Barber screens: LCP ≤ 2.5 s on a mid-range Android phone over 4G; route-level code splitting so the POS doesn't load admin code.

**AD-PERF-02 · Perceived performance.** ⚠️ Skeletons for loads > 400 ms (AD-STATE-01). Long jobs (import validate, payroll calculate, backup, big exports) run in the background with a progress bar or status, and notify on completion. Never freeze the UI.

**AD-PERF-03 · Caching.** ⚠️ TanStack Query. Reference data (services, prices, employees, settings, reasons) is cached and invalidated by realtime events. Money and status data (sales, payments, closing, approvals) is fetched fresh on focus and after every mutation.

**AD-PERF-04 · No optimistic money.** ⚠️ Never show a money action or status transition as done before the server confirms it. Optimistic updates are allowed only for trivial, reversible UI state (mark notification read, collapse a panel, column settings).

**AD-NET-01 · Idempotent submits.** 🔒 D-VIS-10 + ⚠️ mechanics. Visits, sales, payments, refunds, cash outs and cash returns carry `client_request_id` (UUID) — **v1.5:** so do expenses, manual incomes, advances / loans and their cash repayments, stock usage and manual stock adjustments (owner G (b)(c)(d) — sent as `Idempotency-Key`); state changes (Finish, post, send / receive, close, reopen, finalize, mark paid, approve) are safe to repeat without a key (API-IDEM-01, API Part 0 v1.5). Create one ID per logical submit, keep it across retries of that submit, and create a new one only when the user starts a new action. If the server answers "duplicate", fetch the existing record and show it as success ("Already saved"). Disable the submit button while a request is in flight.

**AD-NET-02 · Timeouts.** ⚠️ After ~15 s without an answer on a money action, show "Checking whether it was saved…" and look the record up by `client_request_id` before offering Retry. Never auto-resubmit with a new ID.

**AD-AUTH-01 · Session loss.** 🔒 D-AUTH-06 + ⚠️. Sessions don't expire. Any 401 sends the user to the login screen with the reason mapped from `revoke_reason` ("You signed out", "This device was removed", "An admin signed you out of all devices", "Your account is no longer active") and returns them to the page they were on after login.

**AD-PWA-01 · Installed app.** 🔒 D-PLT-10 + ⚠️ (review §5.7). Web app manifest with the ★ logo icons; theme colour from tokens. An "Install app" guide in the user menu: Android (install prompt / APK), iPhone ("Share → Add to Home Screen", then sign in **inside** the installed app because its storage is separate from Safari). ⚠️ **Web Push is not locked:** 🔒 D-NTF-01 says notifications are in-app realtime only. Web Push (review §5.7 idea) may be added only if the owner approves it; then it is requested from a "Turn on notifications" button, never on page load.

**AD-PWA-02 · Capabilities, not user agents.** ⚠️ The Android (Capacitor, REC-32 ⚠️) and Windows (Tauri) shells expose capability flags (e.g. `canBluetoothPrint`). The UI shows Print, silent print, etc. based on these flags, never on user-agent sniffing.

---

## 9. Permissions and data scope in the UI

**AD-PERM-01 · The API decides.** 🔒 D-ROLE-03 (permission AND branch scope, backend-enforced; review §5.5 "hiding a button is not enough"). The UI mirrors the API for a clean experience; it is never the security boundary.

**AD-PERM-02 · Hide or disable.** ⚠️
- The user **never** has the permission (in this branch) → **hide** the nav item, button, column or field.
- The user has the permission but the record's **state** forbids it now (day closed, sale finished, run finalized) → hide the action and show the lock banner (AD-DET-03), or show it disabled with the reason as helper text. Never show an enabled control that will return 403.

**AD-PERM-03 · `can()` helper.** ⚠️ The session payload carries permission codes with their branch scopes. Components use `can('booking.delete', { branchId })` (single helper, typed from `permissions.json` — typo = build error, D-ROLE-08). **v1.4 (ADR-012):** the helper also knows each code's **level** from `permissions.json`: `can('service.update', { level: 'company' })` is true only with a company-scope grant (master fields, options, archive), `can('service.update', { branchId })` with a grant covering that branch (the branch's sale switch and duration); shared codes (`customer.*`) are true with any grant. **v1.5 (owner C1 — ADR-012 amendment):** *Private* codes (pay data — `commission.*`, `payroll.*`, `payroll_category.*`, `report_commission_payroll.view`, `employee.documents`) are true **only with a company-scope grant**; a branch-scope grant of a private code gives nothing, not even read (API 403 `company_scope_required`). Company-wide money rows (expenses / incomes without a branch) and the company P&L also need company scope (API Part 7). When a role changes (effective immediately — D-ROLE-06), the next API call returns fresh scopes or a realtime `session.updated` event refreshes them; any unexpected 403 triggers a refresh and a friendly message.

**AD-PERM-04 · Scoped pickers.** 🔒 D-ROLE-03. Branch pickers, employee pickers and report filters only offer what the user can access.

**AD-PERM-05 · Data minimisation.** 🔒 D-AUD-01 (audit: admin all, manager assigned branches, barber none), D-DAT-02 (export within scope), D-SRC-01 (barber search = customers + bookings). A barber sees their own sales and commission estimate **only when their effective own-earnings flag is ON** (company switch `dashboard.show_own_earnings_all` + per-barber override `employees.show_own_earnings` — AD-DSH-01, OPEN-10 ✅; default OFF), and never colleagues' figures. The effective value is put in the session payload like a permission (`can('earnings.view_own')` is derived from it) so the same `PermissionGate` hides the widget, the checkout estimate line and the "My earnings" menu entry. Employees' phone numbers and emails are visible only on staff-management screens with permission.

**AD-PERM-06 · Permission codes — CRUD per menu + special actions.** 🔒 (v1.3 — owner 01/Oct 21:20, ADR-011; D-ROLE-02/08/09; **v1.5 — owner one-sheet 02/Oct 00:06: the codes of every API part are final** — Part 3 🔒 D-API-04 (owner A1), Parts 4–8 🔒 D-API-05..09). Every menu (module) has the codes **`<module>.view` · `create` · `update` · `delete`** where the action exists — no `manage` code. **`delete` = archive / deactivate / cancel** (data kept — D-DAT-05). **`view`** shows the menu item and its management screen; a user holding any other code of the module also sees it (API `view⁺`). Operational lists the user needs to work (services and prices in POS, shifts on the calendar, the employee picker, availability) never depend on `view` — unticking it cannot break checkout. **Special actions** keep their own codes. The full list comes from `permissions.json` (D-ROLE-08), assembled per API part (each part's codes table is the source; counts below):
- **Locked (API Parts 1–2 — 21 + 22 codes):** `company.view/update` · `branch.view/create/update/delete` · `employee.view/create/update/delete` + `employee.rating_update` · `employee.earnings_update` · `employee.access_update` · `employee.branch_assign` · `role.view/create/update/delete` + `role.assign` · `settings.view/update` · `service.view/create/update/delete` (services + categories) · `price.view/update/delete` · `eligibility.view/update` · `schedule.view/create/update/delete` · `leave_type.view/create/update/delete` · `leave.view/create/update/delete` + `leave.approve`.
- **Locked (API Part 3 — 🔒 D-API-04, owner A1; 12 codes):** `customer.view/create/update/delete` (shared — any branch's staff use the same customer; history shows the viewer's branches only) · `booking.view/create/update/delete` (`delete` = cancel; own bookings need no code) · `booking_cancel_reason.view/create/update/delete`.
- **Locked (API Parts 4–8 — 🔒 D-API-05..09, owner one-sheet 02/Oct/2026 00:06):**
  - **Part 4 — Visits, sales & payments (22 codes — API Part 4 §9):** `visit.view/update/delete` · `sale.view/create/delete` + `sale.finish_override` (owner B2) · `sale.override_price` · `sale.late_entry` · `sale.refund` (Admin only — owner B12) · `sale.adjust` · `payment.view` + `payment.verify` · `discount.view/create/update/delete` (`discount.view` mixed; codes company — owner B7 a) + `discount.approve` · `payment_method.view/create/update/delete`. Dropped placeholders: `visit.proxy` (anyone records for a colleague — 🔒 D-VIS-04/12), `payment.collect_override` (owner B3).
  - **Part 5 — Commission, payroll & attendance (23 codes — API Part 5 §14):** `commission.view/create/update/delete` + `commission.assign` · `payroll.view/create/update/delete` + `payroll.finalize` · `payroll.pay` · `payroll_category.view/create/update/delete` · `receivable.issue` (Admin — owner C2) — **all of these *Private*** (owner C1; `receivable.issue` too since the review fix of 02/Oct — issuing, changing, recording a repayment for and cancelling an advance / loan shows its balance, so it needs company scope: API Part 5 P5-RULE-18; with Part 8's `report_commission_payroll.view` ⑦ and `employee.documents` that makes **18 *Private* codes** — ADR-012 Amendment 1, A1-1) · `attendance.view/create/update` + `attendance.resolve` · `attendance_qr.view/create/delete`.
  - **Part 6 — Inventory (28 codes — API Part 6 §10):** `product.view/create/update/delete` (products + categories) · `supplier.view/create/update/delete` · `stock_adjustment_reason.view/create/update/delete` · `stock.view/update` + `stock.usage` · `stock.adjust` · `stock.count` · `purchase.view/create/update/delete` + `purchase.post` (Admin — owner D2) · `transfer.view/create/update/delete` + `transfer.send` · `transfer.receive` (the named receiver needs none — owner D4).
  - **Part 7 — Finance & closing (27 codes — API Part 7 §10):** `closing.view` + `closing.close` · `closing.reopen` · `cashout.view/create/update/delete` (`update` / `delete` = correct / cancel before close — owner E5) + `cashout.return` · `cashout_reason.view/create/update/delete` · `expense.view/create/update/delete` + `expense.approve` · `income.view/create/update/delete` + `income.approve` · `finance_category.view/create/update/delete` (expense + income categories) · `pnl.view`. Used here, owned elsewhere: `payment.verify` (Part 4), `receivable.issue` / `payroll.view` (Part 5 — both *Private*: `receivable.issue` is needed to record, **edit or cancel** a staff advance paid from the drawer; review fix 02/Oct).
  - **Part 8 — Platform (19 codes — API Part 8 §14):** `website.view/update` (mixed — owner F7) · `notification.view/update` · `audit.view` · `import.run` · `data.export` (owner F2) · `backup.view` · `backup.restore` · `report_sales.view` ① · `report_barber_performance.view` ② · `report_payments.view` ③ · `report_discounts_refunds.view` ④ · `report_closing_cash.view` ⑤ · `report_commission_payroll.view` ⑦ (*Private*) · `report_attendance_leave.view` ⑧ · `report_bookings_customers.view` ⑨ · `report_stock.view` ⑩ (⑥ = `pnl.view`, Part 7 — owner F1) · `employee.documents` (*Private*, Admin only — owner F11).
- **Special actions (final — kind `special` in the codes tables; every other code is CRUD):** Part 1 `employee.rating_update` · `employee.earnings_update` · `employee.access_update` · `employee.branch_assign` · `role.assign` · Part 2 `leave.approve` · Part 4 `sale.finish_override` · `sale.override_price` · `sale.late_entry` · `sale.refund` · `sale.adjust` · `payment.verify` · `discount.approve` · Part 5 `commission.assign` · `payroll.finalize` · `payroll.pay` · `receivable.issue` · `attendance.resolve` · Part 6 `stock.usage` · `stock.adjust` · `stock.count` · `purchase.post` · `transfer.send` · `transfer.receive` · Part 7 `closing.close` · `closing.reopen` · `cashout.return` · `expense.approve` · `income.approve` · Part 8 `import.run` · `data.export` · `backup.view` · `backup.restore` · `employee.documents`. The review's `transfer.create`, `expense.create`, `income.create` and `cashout.create` are now CRUD codes of their menus; `audit.view`, `pnl.view` and the nine `report_<key>.view` codes are the *view* codes of their own menus (one menu per report — owner F1).
- **Renamed by the rule (never deployed — D-ROLE-08 unaffected):** `booking.cancel` → `booking.delete` (Part 3) · `payroll.manage` → `payroll.view/create/update/delete` · `commission.manage` → `commission.*` · **`attendance.manual` → `attendance.create`** · **`attendance.correct` → `attendance.update`** (Part 5) · `product.manage` → `product.*` · `purchase.manage` → `purchase.*` (Part 6) · **`finance.pnl.view` → `pnl.view`** (Part 7) · **`website.manage` / `website.branch_manage` → `website.view` / `website.update`** (mixed — branch scope = own branches' hours and closures; no separate branch code — owner F7) · `notification.manage` → `notification.view/update` · `report.<name>.view` → `report_<key>.view` (Part 8) · `settings.manage` → `settings.update` (Part 1).
- **Seed roles (D-ROLE-09 — ★ the owner reviews the seed matrix before go-live; `sync.code_tables` gives company-admin roles every code — P1-RULE-12):** **Admin** = every code of Parts 1–8, company scope. **Manager** (branch scope) = Parts 1–3: the codes whose Seed entry names Manager (incl. owner A3) · Part 4: `visit.view/update/delete`, `sale.view/create/delete`, `sale.finish_override`, `sale.override_price`, `sale.late_entry`, `payment.view`, `payment.verify`, `discount.view`, `discount.approve` · Part 5: `attendance.view/create/update`, `attendance.resolve`, `attendance_qr.view/create` — **no** payroll, commission or receivable code (owner C1 / C2) · Part 6: `product.view`, `supplier.view`, `stock.view/update`, `stock.usage`, `stock.adjust`, `stock.count`, `purchase.view/create/update/delete`, `transfer.view/create/update/delete`, `transfer.send`, `transfer.receive` · Part 7: `closing.view`, `closing.close`, `cashout.view/create/update/delete`, `cashout.return`, `expense.view/create/update`, `income.view/create/update`, `pnl.view` — no approve, delete or reopen (API Part 7 seed default; the Manager's expenses / incomes go to the Admin for approval — owner E4) · Part 8: `website.view/update`, `audit.view`, the eight `report_<key>.view` codes except ⑦ (owner F1) — no `data.export`, `employee.documents`, import, backups or notification types. **Barber** = Part 3: `booking.view`, `customer.view`, `customer.create` · Part 4: `sale.late_entry` (🔒 D-VIS-13), `sale.create` (product-only sale) · Part 6: `stock.usage` (🔒 D-STK-04) · nothing in Parts 1–2, 5, 7, 8 — own work, own data and operational lists need no code.

**AD-PERM-07 · Role editor.** 🔒 D-ROLE-02, D-ROLE-08, D-ROLE-09 (v1.3 — ADR-011). A matrix grouped by the menu groups of AD-NAV-02: **rows = modules (menus), columns = View · Create · Update · Delete** (a cell is blank where the action doesn't exist for that module — e.g. Settings has View and Update only), plus a **Special actions** cell per row listing that module's special codes as labelled checkboxes (e.g. Leave → *Approve*; Employees → *Rating · Own-earnings flag · Login & devices · Branch assignment*; Roles → *Assign*). Labels from the language file (`permission.<code>`), a short description per code, "Select all in row" and "Select all in group" toggles. "Delete" is labelled **"Delete (archive)" / "ဖျက် (archive — data မပျောက်)"**. The **Roles** row shows a **Company admin** badge when View, Create, Update, Delete and Assign are all ticked (P1-RULE-12) — saving a change that would leave no company admin is refused with the `last_admin` message. **Level hint (v1.4 — ADR-012):** each row shows a small tag from the code's level — *Company* (company-wide data: with a branch-scope assignment the box gives **read-only** access to that menu), *Branch* (works only in the assigned branches), *Company + branch* (e.g. Services: company-wide fields need company scope, "sold here + duration" works per branch; Settings: company values need company scope, branch overrides per branch), *Shared* (customers — any branch, history limited to the user's branches), **v1.5:** *Private* (pay data — commission plans, payroll, payroll categories, advances / loans — `receivable.issue`, review fix 02/Oct, report ⑦, staff documents) — needs a company-scope assignment; with branch scope the box gives **no access at all** (owner C1, ADR-012 amendment). The role-assignment dialog repeats it: "With branch scope, company-wide items are view-only and private items give no access." Screens follow it: a branch Manager opens *Settings › Services* read-only except the **Sold here / Duration** cells of their branches, and *Settings* with company values read-only and their branches' overrides editable (`SettingView.editable`). **Seed roles** at go-live (full lists per part — AD-PERM-06 v1.5): **Admin** (every box, company scope), **Manager** (the codes whose "Seed" entry in each API part names Manager, branch scope — each box reaches what its level allows; no *Private* box — owner C1), **Barber** (Part 3: `booking.view`, `customer.view`, `customer.create` · Part 4: `sale.late_entry`, `sale.create` · Part 6: `stock.usage`; no management box otherwise). A barber without late entry = a copy of the Barber role without `sale.late_entry` (owner B12). The owner reviews the seed before go-live (★). Permissions themselves can't be created or renamed in the UI.

---

## 10. Screen specifications for the critical flows

Each flow lists the rules; the decisions they come from are cited inline. "Barber" = a user who records their own services. Tap counts assume the happy path.

### 10.1 Today (barber home, mobile)

**AD-TODAY-01 · Layout, top to bottom.** ⚠️
1. App bar: date (`Wed, 30/Sep/2026`), **branch chip** (today's branch), bell.
2. **Clock-in chip:** "Clocked in 9:02 AM · Branch 3.0" or a "Clock in" button (AD-ATT-01).
3. **No-show alarm card(s)** if any are active (AD-BKG-09) — this card always sits on top.
4. **In progress** — my open visits (STARTED, COMPLETED-unpaid) as cards: customer or "Walk-in", services, elapsed time, and the next action ("Service done" / "Take payment").
5. **Next bookings today** — my bookings (time, customer name, services, 🏠 Home / 🌐 Online flags) each with a **Start** button.
6. My earnings tile — only when the barber's **effective** own-earnings flag is ON (company switch or per-barber override — AD-DSH-01; default OFF). Shows today's own sales and the month-to-date commission estimate with "final at month end". **v1.5 (owner C12):** the estimate steps through the tiers from month-to-date (2,240,000 + 30,000 → 5,500), so the month's estimates add up to the final figure (API Part 5 P5.CMS.02).
7. Bottom nav with the centre **＋ Start**.

**AD-TODAY-02 · Unfinished work first.** ⚠️ Zeigarnik. Open visits are listed before anything else and counted on the Today tab badge. A COMPLETED-but-unpaid visit shows the warning tone "Awaiting payment" (the barber can't move on — D-VIS-07).

**AD-TODAY-03 · Branch for the day.** ⚠️ The branch chip defaults to today's shift / attendance branch. If the barber starts a visit at another branch in scope, they change the chip first; START always shows the branch it will use.

**AD-TODAY-04 · Realtime.** ⚠️ New or changed bookings for me appear with a highlight (AD-RT-02). A booking cancelled by the customer shows "Cancelled by customer" for the rest of the day instead of disappearing silently.

### 10.2 Arrival and START

**AD-POS-01 · One flow, no detours.** ⚠️ Flow + Cognitive Load. ＋ Start → arrival choice → START → in-progress screen. No other modal in between. The whole START step fits on one mobile screen.

**AD-POS-02 · Arrival choice.** 🔒 D-VIS-01. Two big buttons: **"Has a booking"** / **"Walk-in"** (AD-CMP-02; Hick). Above them, if the barber has bookings within ±60 min, show those bookings as one-tap shortcuts (they skip the choice).
- *Booking* → list of today's BOOKED bookings at this branch (mine first, then others if permitted) → pick one → START sheet prefilled with the booking's barber and services (D-VIS-02).
- *Walk-in* → START sheet. **No customer questions at the start** (D-VIS-02).

**AD-POS-03 · START sheet.** 🔒 D-VIS-02, D-VIS-04, D-VIS-12, D-AUTH-07. Fields:
- **Branch** (prefilled, AD-TODAY-03) and **Performer** = me (prefilled, shown as my chip). That's all a normal walk-in needs → **Start** (1 tap).
- Optional: a row of this branch's most frequent service chips — **V1 (v1.7, 🔒 owner S7): the first 6 simple services sold at this branch in catalogue order (category order, then service order — API P2.SVC.01); no usage ranking exists in V1, the admin changes what shows by re-ordering the catalogue.** Tapping one adds it before Start (service is optional at START and required at COMPLETE — D-VIS-02; the first choice needs no reason). This saves the separate "＋ Add service" step for most walk-ins.
- Link "**Record for another barber**" → reveals: Actual service barber (picker, same branch) + reason as two options (`visits.proxy_reason`): **"Their phone isn't available"** (1 PHONE_UNAVAILABLE — 🔒 D-VIS-12: I, the recorder, may also take payment and Finish for this visit) or **"Helping record"** (2 OTHER — D-VIS-04: I record START/COMPLETE only; checkout stays with the performer). No free-text note (the DB has no field for it). "Recorded by" = me, filled automatically and shown.
- If the visit comes from a booking and the performer ≠ booked barber → required "Why a different barber?" (`performer_change_reason`).
- Link "At customer's home" (only if the booking is HOME or the user can record home visits) → address required.
- Link "**Late entry** — record a past service" (only with `sale.late_entry`) → AD-POS-14.
- START creates the visit (STARTED) and an OPEN sale with a `client_request_id` (AD-NET-01).
- **v1.5 (owner B9):** if the branch-day is closed, START is refused: "This day is closed — ask an admin to reopen it." (API 422 `day_closed` — checked on every START, API Part 4 P4-RULE-02).

### 10.3 Visit in progress and "Service done"

**AD-POS-04 · In-progress screen.** 🔒 D-VIS-02/05/09, Part 4 + ⚠️ layout.
- **Sticky header:** customer name or "Walk-in" · performer chip · branch · started time + elapsed · flags (🏠, Proxy, Late entry).
- **Service lines:** each shows name + option, list price, duration, performer chip (Uniform Connectedness). "**＋ Add service**" opens the picker (AD-POS-05). Removing a line asks for a reason; the line stays visible struck through (the row is kept). Adding a service that wasn't in the booking asks "Why was this added?" (`added_reason`); the first service chosen on a walk-in needs no reason.
- **Product lines:** "＋ Add product" (sellable products only; shows stock at this branch; negative stock allowed with a flag — D-STK, never blocks).
- **Transport fee line** for HOME visits: added automatically, exactly one, not discountable (D-SVC-06).
- Primary action: **"Service done · Take payment"** — records COMPLETE (requires ≥ 1 service) and opens checkout in one tap. There is **no "pay later" button**: 🔒 D-VIS-07 / C-1 — no pending-payment queue, the barber doesn't move on to the next customer until payment is recorded and the sale finished. If the app is closed mid-checkout, the visit stays COMPLETED ("Awaiting payment") at the top of Today (AD-TODAY-02) and **starting a new visit for the same performer is blocked** with "Finish payment for your previous customer first" (owner B1: only a COMPLETED unpaid visit blocks; several visits may be In service at once; late-entry visits neither block nor are blocked — API Part 4 P4-RULE-02, 422 `unpaid_visit_open`).
- **Change option** on a service line (e.g. wrong colour/length chosen at booking): open to the barber; the system reprices from the grid (🔒 D-SVC-05 — "checkout မှာ barber က option ပြောင်း → system ဈေးပြန်တွက်"). On a visit that came from a booking, ask a short reason (D-VIS-02 "booking visit — ပြောင်း = reason"); on a walk-in, no reason.
- Kebab: **Mark incomplete** → reason required → the sale is cancelled, no revenue, no commission (D-VIS-09); the booking becomes COMPLETED (F-P4-13).

**AD-POS-05 · Service picker.** 🔒 D-SVC-02/05 + ⚠️ Choice Overload. Opens as a bottom sheet: search field, then "**Frequent here**" (this branch's top 6 services), then categories — **V1 (v1.7, 🔒 owner S7): the picker has search and categories only; the "Frequent here" section is not built until a usage ranking exists (not in V1).** Only services **sold at this branch** appear; for a Home visit only home-eligible services for this performer, priced at the home price (falling back to the shop price when no home price is set — D-SVC-06). Each row: name, duration, price for this branch/location/performer (list price from the price lookup on today's date, D-SVC-08). Selecting an OPTIONS service opens the **option picker**: group 1 chips, then group 2 chips; only combinations sold here are shown (D-SVC-05); the chosen cell's price + duration appear before "Add".

**AD-POS-06 · Context never disappears.** ⚠️ Working Memory. The sticky header (customer, performer, branch) stays visible in the in-progress screen and all checkout steps.

### 10.4 Checkout and payment

**AD-POS-07 · Checkout structure.** ⚠️ Goal-Gradient: a compact progress line "Services ✓ → Payment → Finish". Sections:
1. **Items** — each line: name, option, performer, list price, charged price (if different: flag "Price changed" + reason), line amount.
2. **Discount** — "Add discount" (AD-POS-09) or the applied discount line.
3. **Service charge / Tax** — shown only when enabled in settings (D-PAY-08).
4. **Total** — `text-3xl`, with "How is this calculated?" (AD-HELP-02).
5. **Commission estimate** for the performer — "Est. commission ~6,000 Ks · final at month end" (🔒 D-COM-04 — the estimate is always *computed* at checkout and final at period end). **Visibility follows the effective own-earnings flag** (AD-DSH-01 — company switch `dashboard.show_own_earnings_all` or per-barber override; ✅ owner confirmed 01/Oct: "can be shown to all, and per person"): the line is shown to the performer only when their effective flag is ON; otherwise it is omitted. The computation itself never changes (D-COM-04). **v1.5 (owner C12):** the estimate steps through the tiers from month-to-date (2,240,000 + 30,000 → 5,500), so the month's estimates add up to the final figure (`Commission.estimate` — API Part 5 P5-RULE-02, Part 4 P4-RULE-20).
6. **Payment** (AD-POS-08) → **Finish** (AD-POS-12).

**AD-POS-08 · Taking payment.** 🔒 D-PAY-01/02, D-VIS-06/07 + ⚠️ Hick / Parkinson.
- Method buttons: **Cash** (first — 99.9% of live payments), **KBZPay**, **Split**. Other active methods from `payment_methods` follow, if any.
- Tapping Cash or KBZPay adds a payment for the **full remaining amount** (one tap, Fresha pattern). The amount is editable for split payments.
- **KBZPay requires the reference** (AD-FORM-12) before the payment line is added.
- **Collected by** defaults to the performer; in a **phone-unavailable proxy visit** (proxy reason 1 only) it defaults to the recorder, automatically (D-VIS-06/12). It can be changed on the payment screen to any active staff member of this branch — people clocked in here now first (owner B3, D-VIS-06; no permission code needed — API Part 4 P4.SAL.14); the chosen person is shown on the line.
- **Who may take payment and Finish:** the performer; the recorder of a phone-unavailable proxy visit (reason 1); anyone else only with `sale.finish_override` (seed Admin + Manager — owner B2) + a reason (🔒 D-VIS-06 "admin override + reason").
- **Over-transfer (v1.5 — owner B5):** a KBZPay / non-cash amount may exceed the remaining amount; the screen shows "Change to return: 3,000 Ks" and Finish records it as an automatic cash return with its own RF number (no revenue or commission effect — AD-RCPT-01 #7); **cash can't exceed the remaining amount**.
- "**Remaining to pay: 3,000 Ks**" is always visible until it reaches 0; **Finish stays disabled until payments cover the total** (an excess only from a non-cash payment), with the reason written under the button (D-VIS-07).
- Removing a payment while the sale is OPEN = **Void payment** with reason; the line stays visible struck through.
- Optional helper (⚠️): for cash, a "Customer gave" field that shows change due. Not stored.

**AD-POS-09 · Discount.** 🔒 D-PAY-04 + ⚠️. "Add discount" opens a sheet with two tabs; only **one discount source per sale** (the other tab disables once one is applied):
- **Code** — type a code (case-insensitive input, stored uppercase), or pick from the list of **internal** codes valid today at this branch (public codes are never listed; the customer mentions them). Validation messages are specific: expired, not valid at this branch, fully used, already used by this customer. A once-per-customer code makes the phone field at Finish required. **v1.5:** % codes are rounded to the nearest 100 Ks (setting `sales.discount_round_to_amount` — owner B6: 15 % of 6,500 = 975 → 1,000; an approved % request is rounded the same way — API Part 4 P4-RULE-06). Codes are created by the Admin only (owner B7 a).
- **Ask for approval** — type % or Ks, value, **reason (required)** → "Send request". The screen shows "Waiting for approval…" with the approver role and a **Cancel request** button. On approval the discount appears automatically (realtime); on rejection the note is shown. Only one pending request per sale. If nobody answers: cancel the request and finish at full price (hint text says an admin can refund later). **v1.5:** the request goes to everyone who can approve discounts at this branch (company admins included), never to the requester (owner B7 b / c); once approved, adding lines never increases it (owner B7 d).
- The discount applies to the whole sale and never touches the transport fee (shown in the breakdown). **Split: across all service *and* product lines in proportion to their line price** (OPEN-36 ✅ owner 01/Oct: "service line တွေရော product line တွေပါ"; D-PAY-04 updated in the register; DB already allows `line_discount_amount` on any non-transport line). Example: haircut 10,000 + hair cream 5,000, 10% off = 1,500 → haircut 9,000, cream 4,500. Commission base = the net **service** lines only (D-COM-02), so in this example the barber's commissionable amount is 9,000. The "How is this calculated?" breakdown (AD-HELP-02) shows the per-line split.

**AD-POS-10 · Price override.** 🔒 D-SVC-04, F-P4-03. Only users with `sale.override_price` see "Change price" on a line; it requires a reason and shows list vs charged price afterwards. Barbers never see the control. **v1.5 (owner B4):** a booked service done by another barber is priced at the lower of the booked price and that barber's price — the line shows "Booked price kept" / "Lower price for <barber>" (API Part 4 P4-RULE-05); this is automatic, not an override.

**AD-POS-11 · Attribution is always explicit.** ⚠️ Cognitive Bias (Fresha defaulted quick-sale lines to the logged-in user). Every service line shows its performer chip; changing the performer of a line in an OPEN sale is allowed only via the START/proxy rules; after FINISH it is a sale adjustment (AD-POS-18).

### 10.5 Finish and receipt

**AD-POS-12 · Finish.** 🔒 D-VIS-02/07/08, D-PAY-06, D-CUS-03 + ⚠️ Peak-End.
- Finish step shows the **phone field already open** (optional) with a big "**Skip**" (D-VIS-02). Typing a phone looks the customer up: existing → name shown, nothing else asked; new → a Name field appears (required to create the customer record, since `customers.name` is required) — the barber can still Skip. Required only when a once-per-customer code is used.
- **Finish** (confirm button shows the total: "Finish · 7,000 Ks") → the sale becomes FINISHED and immutable; the receipt number is assigned. **v1.5 (owner B9):** if the day is closed, Finish is refused ("This day is closed — ask an admin to reopen it." — 422 `day_closed`).
- **Success screen** (the peak): big check, **receipt number**, total, payments, performer; buttons **Print receipt** (if the device can), **View / share PDF** (D-PAY-06), and primary **Next customer** (→ Today). No auto-redirect.

**AD-POS-13 · Printing from the success screen.** 🔒 D-PAY-07 + OPEN-20 ✅. See AD-RCPT-02. **View / share PDF** is always the first button and works on every device; **Print receipt** appears next to it only where the shell can print. On devices that can't print, a small hint reads "To print, open this sale on an Android phone" — any Android colleague or the manager can find it under **Sales › Receipts** (today's list at the branch, no amounts) or by receipt number and print it (v1.5 — API Part 4 P4.RCP.03 / 04, no code needed).

### 10.6 Late entry, refund and adjustment

**AD-POS-14 · Late entry.** 🔒 D-VIS-13. From the START sheet link (permission `sale.late_entry`). Adds: reason (INTERNET_OUTAGE / POWER_OUTAGE / PHONE_BROKEN / FORGOT / OTHER + note), **actual start time, completed time, payment received time** (date + time pickers). Allowed for any date whose branch-day is not closed (owner B11 — no fixed look-back); if closed: "This day is closed — ask an admin to reopen it." To switch late entry off for one barber, give a Barber role without `sale.late_entry` (owner B12). The rest of the flow is the normal visit → checkout → finish, and everything created carries the **Late entry** flag. **Review fix 02/Oct:** the three times (and the finish time) are **required** for a late entry — without them the sale would land on today instead of the service day. A late entry, or the Finish of any sale with services, whose date falls inside a **finalized payroll period** is refused: "Payroll for this period is finalized — ask the admin to add a manual payroll line" (API 423 `payroll_finalized`; owner B9) — otherwise the sale's commission would be lost silently.

**AD-POS-15 · Visits list.** ⚠️ Sales › Visits shows open and finished visits with filters (branch, date, performer, status, flags: late entry, proxy, incomplete). Managers use it to find "Awaiting payment" visits left open. **v1.5:** managers take the payment, Finish or mark Incomplete with a reason (owner B2 — `sale.finish_override`, `visit.update`, `visit.delete`); open sales block closing (owner E2 — AD-CLS-05).

**AD-POS-16 · Discount approval (approver side).** 🔒 D-PAY-04, `discount.approve`. Notification → approval sheet: branch, barber, items, subtotal, requested discount, **resulting total**, reason. Buttons **Approve** / **Reject** (with note). The decision reaches the barber in realtime. Approvals also appear in the Approvals inbox (AD-NTF-04).

**AD-POS-17 · Refund.** 🔒 D-PAY-05, Part 4. From a FINISHED sale (permission `sale.refund`):
1. Choose kind: **Refund items** (full or partial per line: quantity and amount ≤ what remains; product lines: **"Back on the shelf" / "Damaged"** — owner B8 a) or **Return an overpayment** (e.g. duplicate KBZPay transfer; affects neither revenue nor commission).
2. Method — any active method; a KBZPay sale may be refunded in cash (owner B8 c) — (+ reference for KBZPay) and **reason (required)**.
3. Confirm dialog shows the amount and what changes ("Commission for Ko Aung will be reduced / reversed next payroll").
4. Result: RF receipt `B3-RF-2026-OCT-00003`, linked from the original sale.
- **v1.5:** refunds only at the sale's branch (owner B8 b) and only on a day that is not closed (owner B9); `sale.refund` = Admin seed (owner B12 — API Part 4 P4-RULE-14).
- **Limits (🔒 D-PAY-05 — reconcile 02/Oct, API Part 4 P4-RULE-14):** refunded items never exceed the sale total (each line at most its net amount). **Return an overpayment** is for money that was **never recorded as a payment** of the sale (a duplicate transfer): it needs the reason **and the transfer reference**, each return is at most the sale total or the total of the sale's non-cash payments, whichever is larger, and it does not use up the items-refund limit. The change for an over-transfer at Finish is returned automatically (AD-POS-08) — no refund screen, no permission.

**AD-POS-18 · Sale adjustment.** 🔒 Part 4, `sale.adjust`. Types: payment method, performer, collected by, other — each with a required reason. **Amounts can never be edited**; the screen says so and links to Refund (overcharged) or **Difference sale** — one line for the original barber (undercharged — owner B10; API Part 4 P4.SAL.13). **v1.5:**
- Two in-place corrections with a reason (owner B10, D-VIS-08 exception — money untouched): the **customer** (attach / change — `sale.adjust`, or the performer / finisher attaching a missing customer on the same day) and a mistyped **KBZPay reference** (`payment.verify`; the payment must be verified again).
- Method / performer / collected-by changes are refused for a closed day (admin reopens), and a performer change after payroll finalize (a manual payroll line instead — owner B9).
- **Difference sale (review fix 02/Oct — API Part 4 P4-RULE-12):** it is created **when the customer is paying the difference** — the same day or at a later visit — not in advance. It is a normal open sale: take the payment and **Finish it (or cancel it) before the day is closed** — like any open sale it blocks closing (owner E2, AD-CLS-05). It only corrects the price: no stock moves, the line keeps the original line's type and barber. The creator, the original barber and `sale.finish_override` holders can check it out.
- A direct change to a finished or cancelled sale is always refused with the same message and a pointer to the right tool — Adjustment, Refund or Difference sale (API 409 `invalid_transition`, `correction_path`).

### 10.7 Bookings (staff)

**AD-BKG-01 · Create booking drawer.** 🔒 D-CUS-03, F-BK-19, D-BKG-03/04/08/22, D-SVC-05/06 + ⚠️ order. Sections in this order (all in one scrollable drawer / sheet, summary sticky at the bottom):
1. **Phone** → auto-match or "New customer" (AD-FORM-10). **v1.4 (owner #10):** the phone is fixed once the booking is saved — a wrong number is fixed by cancelling ("Other: wrong phone") and booking again; the drawer says so under the field.
2. **Name for this booking** — prefilled from the customer; editing it doesn't change the customer record (hint: "e.g. booking for a son on mum's phone"); it stays editable on the booking detail while BOOKED (API P3.BKG.06).
3. **Branch** (context) and **Shop / Home** segmented control. Home → address (required) + note (optional); the transport fee is shown.
4. **Barber** — only barbers assigned to the branch and eligible for the chosen services (HOME: `home_allowed`); ineligible ones hidden.
5. **Services** — "＋ Add service"; OPTIONS services require the option; each item shows price, duration and buffer; items run back-to-back for one barber.
6. **Date and time** — available start times only, from the shared availability function (the same one the website's booking modal and reschedule use), at the slot interval. End time is computed.
7. Sticky summary: date, start–end, total price, **Save**.

**AD-BKG-02 · After saving: the manage link.** 🔒 D-BKG-11, F-BK-10 + ⚠️. The raw manage link exists only at creation (the DB stores a hash; a retry after a lost reply returns the same booking and link — the app generates the token, ADR-004 / API-IDEM-03). After Save, show a success panel: "Send the booking link to the customer" with **Copy link** and **Share** (Web Share → Viber / Messenger) and the note "This link is shown only now." Nothing is sent automatically (D-CUS-05).

**AD-BKG-03 · Booking detail.** ⚠️ Header: status badge, date, start–end, branch, barber chip, channel (Online / Staff + created by). Items as a timeline with price / duration / buffer snapshots (Uniform Connectedness). Home address + transport fee if HOME. Cancel info if cancelled. **Visible actions by status:** BOOKED → *Start* (today), *Reschedule*, *Cancel booking*; STARTED → *Open visit*; COMPLETED → *View sale*; CANCELLED → none (final — D-BKG-16).

**AD-BKG-04 · Reschedule.** 🔒 D-BKG-12/13/15. A full edit (date, time, barber, services, Shop/Home) with availability re-checked. Before confirm, show **old → new** side by side and the **price result** with its reason: "Time changed only — original price kept", "Service changed — that item repriced", "Barber / location changed — all items repriced". The booked barber is notified; the change is audited.

**AD-BKG-05 · Cancel.** 🔒 D-BKG-14/15/16. ReasonDialog with the cancel-reason master list; "Other" (or any `requires_note` reason) requires a note. The dialog states "Ko Aung will be notified. A cancelled booking can't be reactivated."

**AD-BKG-06 · One-active-booking rule is website-only.** 🔒 D-BKG-09. Staff screens never block a second booking for the same customer; they may show an info note "This customer has another upcoming booking on 02/Oct/2026" (⚠️) to avoid accidental duplicates.

**AD-BKG-07 · Keep context in reschedule and cancel.** ⚠️ Working Memory. Both dialogs repeat the booking summary (customer, barber, date/time, services) at the top.

**AD-BKG-08 · Bookings list.** ⚠️ Filters: date range, branch, barber, status, channel, Home. Columns: date, time, customer, services, barber, channel, status, total. Default: today and upcoming.

**AD-BKG-09 · No-show alarm.** 🔒 D-BKG-17 (server-side timer: alarm at booking time, 10-minute snooze × 4, auto-cancel at 40 minutes with the no-show reason, actor SYSTEM; a late customer = walk-in). UI: at the booking's start time the **booked barber** gets an alarm card + notification: "Ma Su's 2:00 PM booking hasn't started." Actions: **Customer arrived → Start**, **Snooze 10 min** (shows "3 snoozes left"), **Cancel as no-show** (v1.4 — owner #3: before the 40 minutes when the customer says they won't come; recorded with the system "Customer no-show" reason, history only — D-CUS-09; shown to users who may cancel the booking). The card shows the countdown "Auto-cancels at 2:40 PM" and the hint that a later arrival is a walk-in. **Who gets the alarm (v1.4 — owner #2):** the booked barber **and** that branch's managers — users holding `booking.update` through a branch-scope assignment of that branch, or a company-scope holder who is assigned to that branch that day (an Admin is not alarmed for every branch) — so someone notices even if the barber's phone is away; any of them may snooze (API P3-RULE-08).

### 10.8 Customers

**AD-CUS-01 · List and search.** 🔒 D-CUS-06/07. Search by name or phone (any format). Columns: name, phone, last visit, visits, status. No email column, no merge action (D-CUS-02/05). **Inactive (v1.4 — owner #7):** hidden from the list and search by default (status filter shows them); an inactive customer who books or comes in again becomes Active automatically; Inactive never blocks website booking.

**AD-CUS-02 · Customer detail.** 🔒 D-CUS-01/07/08/09. Header: name, phone (tap-to-call on mobile), status. **Notes** (visible to all staff). **Statistics computed from history**: visits, total spent, last visit, **preferred barber** (v1.4 — owner #6: the barber who did **≥ 3 of the customer's last 5 finished visits**; otherwise "–"; both numbers are settings), no-shows (history only, no penalty). **Timeline**: bookings and sales. **Scope (v1.4 — ADR-012):** the customer record is shared by all branches; statistics and timeline count only the viewer's branches (a company-scope user sees everything) — a small caption says "At your branches". Actions: Edit (name, phone, notes), Deactivate / Archive. No customer login, nothing sent.

### 10.9 Daily closing (per branch, per business date)

**AD-CLS-01 · Checklist layout.** 🔒 D-FIN-06/07/09, D-PAY-02, D-VIS-13 + ⚠️ Goal-Gradient. Full page on desktop, stepper on mobile. A progress header: "Branch 3.0 · 30/Sep/2026 · 3 of 5 done". Sections:
1. **Opening float** — prefilled from the branch setting; editable; if it differs from the last closed day's counted cash → reason. The evening takings handover is recorded **before counting** as a Cash Out "Takings to owner / bank" (owner E1), so the count equals what stays in the drawer.
2. **Cash movements** (read-only, each line links to its records): cash sales, cash refunds, cash outs (list), cash returns, manual cash income.
3. **Expected cash** with the formula expanded (AD-CLS-03).
4. **Counted cash** input (+ optional banknote counter helper ⚠️, not stored).
5. **KBZPay verification** (AD-CLS-04).
6. **Checks before closing** (AD-CLS-05), notes, **Close day** (sales that could still finish on this date and earlier days not closed block the button — owner E2).

**AD-CLS-02 · Visual grouping.** ⚠️ Common Region: each section is a card; the difference card uses the status tone (AD-CLS-03).

**AD-CLS-03 · Expected cash and difference.** 🔒 REC-17 formula (D-FIN-06): `Expected = opening + cash payments − cash refunds − cash outs + cash returns + manual cash income`, shown line by line (Tesler). Difference = counted − expected: **0 → success** "Balanced"; **≠ 0 → warning** + reason required; **beyond tolerance** (`closing.cash_difference_tolerance_amount`, default 0) → danger + "Admin will be notified". **v1.5:** manual cash income counts as soon as it is recorded, Pending included (owner E7 — the money is in the drawer); the P&L counts it when approved. The formula text includes "+ manual cash income" (owner E8).

**AD-CLS-04 · KBZPay verification.** 🔒 D-PAY-02 (REC-11), `payment.verify`. List of today's KBZPay payments: time, reference, amount, collected by, receipt number, checkbox ✔ "Matches KBZPay app". Counter "3 / 5 verified". Totals: expected vs verified. If any remain unverified at close → reason required. Verification never blocked the barber's FINISH. **v1.5 (owner E3):** ticking stays possible after the day is closed — the closing figures don't change; the closed view shows "Verified after close: n"; unticking only while the day is open. The list uses the effective method after any adjustment (API Part 4 P4-RULE-15 / 17).

**AD-CLS-05 · Pre-close checks.** ⚠️ + owner E1 / E2 (v1.5 — API Part 7 P7-RULE-06). Before "Close day" show: **blockers** — sales that could still finish on this date (customer in the chair, awaiting payment, an open late entry, **an open difference sale** — owner E2; 409 `open_sales_exist` lists them; when closing an **earlier** date also any open sale that already holds a payment received on or before that date — review fix 02/Oct) and earlier days not yet closed (409 `previous_day_open`); **warnings** — pending discount requests, pending cash incomes; **reminder** — paper-notebook cash outs and the takings handover (owner E1). State the consequence: "After closing, late entries, sales and payments, refunds, cash outs, cash returns and cash income for this date are blocked until an admin reopens it; KBZPay can still be ticked."

**AD-CLS-06 · Close and closed state.** 🔒 D-FIN-06 + ⚠️ Peak-End. Confirm dialog with the summary (expected, counted, difference, KBZPay verified). After closing: success state "Day closed ✓ by Ma Hnin at 9:05 PM", everything read-only (AD-DET-03). **Reopen** only for `closing.reopen` (admin) with a reason; the reopen count shows as a flag. **v1.5:** after a reopen, the screen lists later closed days that may need reopening too (API Part 7 `later_closings` warning). Reopening a day **inside a finalized payroll period** is allowed and shows a warning: "Payroll for <period> is finalized — cash can be corrected, but a late entry, a Finish with services or a barber change on this day needs a manual payroll line" (API warning `payroll_finalized_period { run_id, period }` — owner B9; Part 7 P7-RULE-07 — reconcile 02/Oct).

**AD-CLS-07 · Company view.** 🔒 D-FIN-06. A table of branches × date: status (Not closed / Closed / Reopened), expected, counted, difference, KBZPay verified/total, closed by. Past dates not closed are highlighted (warning).

### 10.10 Cash out, cash return, expenses, income, P&L

**AD-FIN-01 · Cash out form.** 🔒 D-FIN-07/08, Part 7. Reason (master list; the reason's accounting type is shown as helper text: Expense / Employee balance / Cash movement / Must return), amount, note, time (default now; can be backdated within the open day, from the paper notebook). Conditional fields: **Must return** → who took it (staff picker or a typed name) + expected return date (optional). **Employee balance** → employee (creates the advance / loan). Recorded by = me. **v1.5:**
- Employee balance also needs `receivable.issue` and is never for yourself (owner C2).
- **The taker of a staff advance is shown only to payroll viewers** — users holding `payroll.view` **or** `receivable.issue` with company scope (both *Private*, Admin seed — owner C1 + D-FIN-06; API Part 7 P7-RULE-01; reconcile 02/Oct: whoever may record, edit or cancel the advance also sees whose it is) — and to the employee themself: in the cash-out list / detail, the closing screen's cash-out lines, report ⑤ and the audit log, everyone else sees the amount and the reason with the label **"Staff advance"** instead of the employee (no name, no note, no link to the advance) — the amount still counts in expected cash.
- Before the day is closed a cash out can be **edited** (same accounting type) or **cancelled** with a reason (owner E5). **Review fix 02/Oct:** for a **staff advance** (Employee balance) editing or cancelling also needs `receivable.issue` — payroll rights, Admin (owner C1 + C2): a Manager gets no Edit / Cancel on a staff advance (the API returns `actions.can_edit` / `can_cancel` = false — AD-PERM-02; the Admin does it); editing the note updates the advance's reason. A must-return cash out that was already **charged to expense at month end** can no longer be edited or cancelled (API 409 `cash_out_converted`). An Expense-type reason can't point at the Salary or Product-purchase category (those costs come from Payroll and Stock — owner C4 / D1).
- Reasons "Stock purchase payment — recorded in Stock" (owner D1), "Salary payment — recorded in Payroll" (owner C4) and "Takings to owner / bank" (owner E1) are cash movements (no second expense); "Supplier" is for non-stock bills only (owner D1). A home-service barber keeping the evening cash = "Temporary withdrawal — to be returned" with the barber as taker, returned next morning (owner E1).

**AD-FIN-02 · Cash return.** 🔒 D-FIN-09. Only against an outstanding Must-return cash out; partial returns allowed; total ≤ outstanding (show the outstanding amount). **v1.5:** a return can be cancelled with a reason while its day is open (owner E5 — DB Part 7 v1.1) — but not once its cash out has been charged to expense at month end (API 409 `cash_out_converted`; review fix 02/Oct — the two months must still net to zero, 🔒 D-FIN-09).

**AD-FIN-03 · "To be returned" list.** 🔒 D-FIN-09 + ⚠️ Uniform Connectedness. Each must-return cash out with its returns grouped underneath, outstanding amount, age, and state (outstanding / returned / charged to expense at month end / **cancelled** — v1.5, owner E5). **Review fix 02/Oct (🔒 D-FIN-09 "until the month-end closing"):** "charged to expense at month end" happens **once that month is fully closed at the branch** — every day of the month that needs closing is closed — not at a fixed hour on the 1st (the nightly job checks daily at 1:00 AM); until then the item stays *outstanding*, so a return made on the last day and entered the next morning is simply a return. The expense is dated the last day of the cash out's own month.

**AD-FIN-04 · Expenses and manual income.** 🔒 D-FIN-01/03, Part 7. Form: branch or "Company-wide", category, amount, date, description, **paid via** (Bank / Owner personal / Other — drawer cash is never an expense here, it goes through Cash Out), attachments. Income adds payment method; cash income requires a branch. Entries are approved immediately only when the creator holds the approve code with company scope (owner E4); all others are **Pending** and notify the approvers; nobody approves their own entry. Edit only while Pending. Approved entries are read-only: **Delete** (reason required, the word is "Delete", never "Void") and create again. Non-manual sources (Cash out, Payroll, Purchase, month-end must-return, cash-return reversal) show a **source badge** and are read-only — except a Purchase expense, which a company-scope `expense.delete` holder may delete (reason) and re-enter manually (owner D3). **v1.5:** company-wide rows are visible only with company scope; salary rows only with payroll view (owner E6 / C1). Cash income counts in today's drawer at once, even while Pending (owner E7).

**AD-FIN-05 · Approvals.** 🔒 D-FIN-03. Pending expenses and incomes appear in the Approvals inbox; Approve / Reject (reason) — never one's own (v1.5, owner E4). A decided entry shows who decided it and when: "Approved by" on an approved row, **"Decided by"** on a rejected expense / income (the API's `approved_by` / `approved_at` hold the rejecter and the time — Part 7 P7-RULE-15 / 16; reconcile 02/Oct).

**AD-FIN-06 · P&L.** 🔒 D-FIN-04/05/09, D-PAYR-08, `pnl.view` (renamed from `finance.pnl.view` — v1.5). Branch or company, month by default. Revenue − approved expenses by category; **revenue (v1.5)** = finished sales lines net of discount + service charge − refunds on the refund date (owner F6) + approved manual income; tax excluded (API Part 7 P7-RULE-17). A branch-scope viewer sees salary as one total line (owner E6); the company P&L needs company scope. Company-wide expenses appear only in the company P&L. Salary expense = gross. Cash-return reversals appear as a separate negative row labelled with the original date and amount, plus the note at the top "This month includes X Ks of earlier cash outs returned". Every number drills down to its records.

### 10.11 Attendance, leave, schedule

**AD-ATT-01 · Clock in / out (own phone).** 🔒 D-ATT-01/02 + ⚠️.
1. "Clock in" → a short explanation screen **before** the browser asks for location and camera permission (location is mandatory), so staff understand and don't deny it.
2. Full-screen **QR scanner** with a frame and hint "Scan the STAFF ATTENDANCE code at your branch".
3. GPS check against the branch radius.
4. Result: success ("Clocked in 9:02 AM at Branch 3.0") or a specific failure — too far ("You're 240 m from Branch 3.0; you need to be within 50 m"), code not valid / replaced, location denied (with steps to enable it), already clocked in at this branch — scanning another branch's code while clocked in closes the previous record automatically (owner C10). GPS accuracy worse than 100 m → "Location not precise enough — wait a moment or step outside" (setting `attendance.max_gps_accuracy_meters`, 100 — API Part 5 P5-RULE-13). The "too far" and "not precise enough" refusals appear **only while "GPS required" is on**.
- **Clock out** (v1.5 — owner C10) = a "Clock out" button + GPS inside the branch radius, no QR scan.
- One open record at a time; clocking in at another branch the same day is allowed. **Nobody can clock in for someone else** (D-ATT-06). Settings (🔒 D-ATT-01): "GPS not required" = the **radius check and the accuracy limit** are switched off — distance and accuracy are still recorded, nothing is refused for them (location is still captured, permission still required; API errors `too_far` / `gps_inaccurate` only when it is on — reconcile 02/Oct); "QR not required" = **manual-only mode** — staff can't clock themselves in and a manager/admin records attendance (AD-ATT-02). A self clock-in always needs the QR token + GPS (F-P5-08 CHECK).

**AD-ATT-02 · Manual attendance (manager/admin).** 🔒 D-ATT-06, `attendance.create` (renamed from `attendance.manual` — v1.5). Employee, date, times, reason (Phone unavailable / Other + note). An **evidence panel shows that employee's visits that day**. The monthly manual-entry count per employee is shown on the employee's attendance tab. **v1.5:** never for your own attendance — another manager or the admin records it (owner C11). A forgotten clock-out can be closed manually. A wrong entry is **voided** with a reason, never deleted (owner G (a)).

**AD-ATT-03 · Exceptions board.** 🔒 D-ATT-03, Part 5, `attendance.resolve`. "Who is late / absent / left early today and this month": tabs Today / This month; per-employee counts. Each OPEN exception → Excused (reason) / Confirmed / Leave (link a leave) / Void (reason). Resolve on the same day where possible. OPEN and CONFIRMED are deducted in payroll (shown as a hint). **v1.5:** lateness and early leave appear only beyond the grace minutes; raw minutes are kept (owner C8). Missing one of two shifts in a day = half a day. Early leave is shown but deducted only when the setting is on (`payroll.early_leave_deduction_mode`, default OFF — owner C9). Your own exceptions are resolved by someone else (owner C11).

**AD-ATT-04 · Corrections.** 🔒 D-ATT-04/05, `attendance.update` (renamed from `attendance.correct` — v1.5). Edit a record with a required reason; the old → new values appear in its activity. **v1.5:** not on your own record (owner C11). Inside a finalized payroll period the record is read-only (AD-DET-03 banner — API 423 `payroll_finalized`).

**AD-LV-01 · Leave request.** 🔒 D-LV-01..05. Type, start and end date, day portion (Full / Morning / Afternoon — half-day only on a single date; the cut-off time comes from the setting, default 1:00 PM), reason. Overlaps are refused with a clear message. Anyone can request for themselves; managers can request on someone's behalf. While PENDING the requester can edit or cancel. The form warns: "Pending leave already blocks bookings."

**AD-LV-02 · Leave approval.** 🔒 D-LV-02/04 + ⚠️ D-LV-04 note. Approver sees the request plus **the bookings that fall inside the leave period** (they are not deleted — D-BKG-19) with links to reschedule them. Approve / Reject (note).

**AD-SCH-01 · Weekly pattern editor.** 🔒 D-SCH-01/02, D-DB-06. Per employee: a row per weekday with one or more segments, each segment = branch + start + end; effective from/to. Validation messages are specific: overlapping segments; "Needs a 60-minute gap when changing branch (Branch 1.0 ends 1:00 PM, Branch 3.0 starts 1:30 PM)" (gap from setting); "Assign Ko Aung to Branch 2.0 first". Saving explains: "Shifts for the next 14 days are updated now; you can edit single days in the roster." *(v1.3 — the API regenerates the roster in the same request, owner 01/Oct 21:20 / API Part 2 §16 #9; the nightly job only extends the horizon.)*

**AD-SCH-02 · Roster.** ⚠️ Week view per branch (employees × days, shift times, leave), plus the barber view across branches (AD-CAL-06). Single-day edits create MANUAL shifts. **Nobody changes their own shifts for today or a past day** — nor saves their own weekly pattern when it changes today's shifts — because it would change their own lateness / absence: another manager or the admin does it (API 422 `self_action` — owner C11; API Part 2 P2-RULE-07; reconcile 02/Oct). Inside a finalized payroll period shifts are read-only (API 423 `payroll_finalized`). If an edit leaves existing bookings outside the new shift, show them as conflicts to fix — never delete or move bookings silently (D-BKG-19).

### 10.12 Services, pricing and eligibility

**AD-SVC-01 · Service list.** ⚠️ Category panel (with counts) + search + branch filter (Fresha pattern `evidence/services/service-menu-01.png`). Row: name (MM / EN), category, pricing mode, branches sold at, duration range, status.

**AD-SVC-02 · Service form.** 🔒 D-SVC-01/02/05/06/07, D-DB-06. Tabs: **Details** (category, name + internal description MM/EN, pricing mode Simple / Options, buffer 0–120 min) · **Branches** (sold here ✔ + duration per branch) · **Options** (≤ 2 groups, values MM/EN, order) · **Prices** (price grid editor, AD-CMP-13) · **Website** (show on website, public description MM/EN, image).

**AD-SVC-03 · Eligibility matrix.** 🔒 D-EMP-05. Employees × services for one branch at a time, checkboxes, plus a "Home" ✔ per cell and effective dates. Bulk actions: tick a whole row / column.

### 10.13 Employees, roles and access

**AD-EMP-01 · Employee list.** 🔒 D-EMP-06. Search by name, phone, code, role, branch, status. Columns: name, code, branches, roles, login status (Invited / Active / Disabled), employee status.

**AD-EMP-02 · Employee detail.** 🔒 D-EMP-01..05, D-ROLE-05/06, D-AUTH-03/05 + ⚠️ tabs: **Profile** (code, name MM/EN, phone, photo, join date, status, internal notes, **website public profile** toggle + specialty / short description MM/EN ≤ 200 chars + **rating** (`employees.public_rating`: 1.0–5.0 in half steps, empty = not shown; entered by the admin or a manager with scope over one of the barber's branches — OPEN-37 ✅ owner 01/Oct, "admin / manager gives the rating for now, customer ratings in V2"; help text: "Shown on the website as 'Point rating'. Customer ratings come in a later version."; change is audited) — default OFF; the owner switches the profile on per barber when the "Our barbers" section should show them (OPEN-21 ✅); never phone/email on the website) · **Branches** (assignment history, add / end) · **Roles** (each assignment is its own row: role + scope *Company* or *Selected branches*, with its own **Revoke**; revoking takes effect immediately and removes only that assignment) · **Services** (eligibility) · **Schedule** · **Pay** (salary history, commission plan assignment, advances / loans, and the three-way choice **"Own sales & commission"** = `employees.show_own_earnings`: *Follow company setting (currently OFF)* (NULL, default) / *Show* (true) / *Hide* (false) — OPEN-10 ✅; help text: "When shown, the barber sees their own sales and commission estimate on their dashboard and at checkout. Never other staff's figures. The company-wide switch is in Settings › Dashboard." Change is audited and takes effect on the barber's next request) · **Documents** (ID card, contract … — only with `employee.documents`, Admin seed, company scope — v1.5, owner F11) · **Access** (login email, invite sent / last sent, **Resend invite**, **Cancel invite**, devices, **Log out all devices**, **language** = the user's saved `ui_language`, read-only here) · **Activity** (audit, if permitted).

**AD-EMP-03 · Status changes.** 🔒 D-EMP-04, D-AUTH-06. Deactivate / Resign / Terminate is a status change, never a delete; the user is logged out immediately. ⚠️ Before confirming, list the employee's **future bookings** so they can be reassigned (Fresha left an archived member's bookings in place without warning — `evidence/staff/archived-member-appointment.png`).

### 10.14 Payroll and commission

**AD-PAY-01 · Payroll run wizard.** 🔒 D-PAYR-01/05/06, Part 5. Steps: **Set up** (period type — Monthly default / Weekly / Biweekly / Custom, dates; overlapping periods refused) → **Calculate** (progress) → **Review** → **Finalize** (locks) → **Publish** (payslips visible + notification) → **Mark paid** (date, note). Reopen (reason) is available until PAID; Cancel only before Finalize. The stepper shows where the run is. **v1.5 (API Part 5 P5-RULE-09):** Finalize only after the period has ended and every branch's daily closings in the period are closed — otherwise list the open days per branch (owner C7). Reopen only the latest run, and only while later runs are drafts. Mark paid = one date for the whole run (owner C4). If paid from a drawer, record the Cash Out "Salary payment — recorded in Payroll" (owner C4). Payroll screens are *Private* — company-scope Admin only (owner C1).

**AD-PAY-02 · Review screen.** 🔒 D-PAYR-05, Part 5. A table of employees (basic, commission, deductions, net, warnings). Opening an entry shows: earnings and deductions lines marked **AUTO** or **MANUAL**; AUTO amounts can be overridden with a reason but not deleted (set to 0 with a reason); manual lines can be added; attendance items per date (overridable with a reason); branch allocation. A banner warns if **OPEN attendance exceptions** remain in the period. **v1.5:** net never goes below zero: repayments and commission refunds are capped and the remainder moves to next month (owner C6). A manual deduction that would make net negative is refused. Basic is prorated by calendar days ("Joined 16/Oct: 300,000 × 16/31" — owner C5). A banner asks to **Recalculate** when data changed after the calculation (API 409 `run_stale`). The **manual-line form** (add / edit, and an attendance-item override) sends the entry's `expected_updated_at`; a double tap or a change made on another screen is refused (409 `conflict` — AD-CONF-01) and the entry reloads (API Part 5 P5.RUN.07 / 08 / 10; reconcile 02/Oct).

**AD-PAY-03 · Payslip (employee view).** 🔒 D-PAYR-07, D-COM-04. After Publish: earnings, commission with the tier breakdown, reversal lines ("28/Oct dye refund — 6,000"), deductions, advance/loan repayments, net. Download **PDF** and **Excel**. **v1.5:** language = the employee's app language; the PDF is rendered on the server (ADR-013, owner H). A reopened run hides the payslip and notifies "being revised" (mandatory `payslip.revised`).

**AD-PAY-04 · Commission plans.** 🔒 D-COM-01. Plan: name MM/EN, description, tiers (from, to — blank = no limit, rate %). The editor shows tiers as a continuous bar and refuses gaps or overlaps. A plan already assigned can't be edited — "Create a new version" copies it. Assignment: plan, scope (all branches or one branch per row), effective dates. "No plan = no commission" is stated on the employee's Pay tab. **v1.5:** an assignment starting mid-month counts sales from that date, with thresholds not reduced (owner C5). It can be back-dated only to the open payroll period. A wrong, unused assignment can be withdrawn with a reason (audited).

**AD-PAY-05 · Salaries and receivables.** 🔒 D-PAYR-02/04. Salary history (monthly basic, effective dates, no overlaps). Advances / loans: issue (kind, principal, instalment, start, reason — linked to the cash out), balance, repayments (payroll or cash). **v1.5:** issuing — and changing, recording a cash repayment for or cancelling — needs `receivable.issue` (Admin; a *Private* code — company scope only, review fix 02/Oct). From a drawer = a Cash Out by a user with `cashout.create` + `receivable.issue`. Never to yourself (owner C2). No instalment = the whole balance at the next payroll (owner C2). Cash repayments go to the owner / admin, not the drawer (owner C3). Payroll repayments show as "pending" until the run is marked paid.

**AD-PAY-06 · Irreversible steps.** ⚠️ Finalize, Publish and Mark paid each use a confirm dialog that states the lock consequence ("Finalized runs can only be changed by reopening, which is recorded").

### 10.15 Inventory

**AD-STK-01 · Products and stock.** 🔒 D-STK-01/06, Part 6. Product form: category, name MM/EN, SKU (optional, unique), **Sold to customers** toggle (`is_sellable`) with sell price required when on, low-stock threshold, status. Archive is refused while stock remains ("Move or adjust the remaining 3 pcs first"); **v1.5:** it is also refused while the product is in transit or on an open draft, count or sale (API Part 6 409 `product_in_open_documents`). Stock levels per branch: quantity (negative shown with the flag), threshold override, low-stock flag. **v1.5:** each branch's low-stock threshold can be overridden by that branch's manager (owner D6 — `stock.update`).

**AD-STK-02 · Movements.** 🔒 D-STK-06 (append-only). Read-only ledger with filters (product, branch, type, date); each row: date, type, quantity ±, balance after, by whom, reference (sale, transfer, count, purchase). Corrections are new movements. **v1.5:** a user with `stock.update` can recompute cached quantities from the ledger after a mismatch alert (nightly check `stock.reconcile_levels` — owner H; API Part 6 P6.STK.08).

**AD-STK-03 · Purchases.** 🔒 D-STK-02, Part 6. Supplier (optional), invoice ref, date; lines each with **branch**, product, quantity, unit cost. **v1.5 (owner D1 / D2 / D3):**
- Managers draft for their own branches and tap *Send to admin for posting*; the Admin posts (`purchase.post` — owner D2).
- The Post dialog shows totals and the expense per branch (owner D3); Post → stock in + one expense per branch with a non-zero subtotal.
- POSTED can't be undone: fix quantities with an adjustment ("Purchase entry error") and the amount in Finance (owner D3 — AD-FIN-04).
- Paying from the drawer = Cash Out "Stock purchase payment — recorded in Stock", not "Supplier" (owner D1 — AD-FIN-01).

**AD-STK-04 · Transfers.** 🔒 D-STK-03. Draft (from, to, receiver = one employee or all branch staff, lines) → **Send** (confirm: "Stock leaves Branch 1.0 now; you can't edit or cancel after sending") → receiver is notified → **Receive** (actual quantity per line, prefilled with sent; any difference requires a reason; shortfall is charged to the sender). ⚠️ Quantity fields start empty (Fresha defaulted to the reorder quantity 10, easy to over-transfer). **v1.5 (API Part 6 P6-RULE-09):**
- The named receiver — or any staff of the receiving branch when "All branch staff" — receives without a permission; `transfer.receive` holders at that branch can always receive (owner D4).
- Receiving more than sent is allowed with a reason, flagged "Over N" and notified to the admin.
- A sent transfer can't be cancelled — receive 0 with a reason. A sent, received or cancelled transfer can't be edited either: the API answers 409 `invalid_transition` with a pointer to the right tool, the same pattern as a posted purchase (reconcile 02/Oct).
- **Receive has no note field** — a difference is explained in the line's reason (the draft note is the only note of a transfer; API Part 6 P6-RULE-09).
- Sending below zero shows a warning, never blocks (owner D5).

**AD-STK-05 · Stock count and usage.** 🔒 D-STK-04/05. Count: one in progress per branch; expected quantities snapshotted at start; progress "18 / 24 counted"; Post requires all items counted; difference reasons optional. **Usage** (barber, `stock.usage`): "Used up a bottle/box" → product → quantity (default 1) → save, in ≤ 3 taps. Manual adjustment requires a reason from the master list. **v1.5:**
- The counter doesn't see system quantities; differences appear on a review step before Post; scope = whole branch or chosen categories (owner D8). A **whole-branch count lists every active product** — one the branch has no stock record for yet starts from 0 — plus inactive products that still have stock; a category count follows the same rule (API Part 6 P6-RULE-10; reconcile 02/Oct).
- The manager posts counts and manual adjustments; the admin is notified of differences and of manual adjustments (owner D9).
- The usage list shows every product, shop-use first, recent ones on top; there is no self-undo — a manager corrects with "Entry error" (owner D7).

### 10.16 Website management

**AD-WEB-01 · Save = live.** 🔒 D-WEB-01 + review §5.8 (⚠️ REC-35 mechanism). Saving any website field publishes immediately; show "Saved — live on the website within a few seconds" and a **View on website** link. No drafts in V1.

**AD-WEB-02 · Sections.** 🔒 D-WEB-01..04, Part 8, website codes `website.view` / `website.update` (v1.5 — owner F7, API Part 8 P8.WEB; were `website.manage` / `website.branch_manage`) + OPEN-21 ✅ (owner 01/Oct: things appear on the website only after the owner switches them on here). Company info (incl. **social links — Facebook, TikTok, Viber …** shown in the site footer and SEO) · Branches (public toggle, map URL, **opening hours** weekly grid with Closed toggle, **temporary closures** with a required Myanmar notice + optional English, no overlapping ranges) · Services on the website (show toggle, public description MM/EN, image) · Team public profiles (**default OFF**; display name, photo, specialty / short description, **rating** (admin / manager-entered, 1.0–5.0 half steps — OPEN-37 ✅; shown on the site as "Point rating"); phone and email are never published; the barber card on the site also shows "today's branch" from the roster automatically) · Site content (`site.hero_title/subtitle`, cover image, share image, SEO title/description, announcement with start/end dates, **show prices — default OFF**, **show barbers — default OFF**); the site address is shown read-only (server setting `SITE_ORIGIN` — the `site.domain` setting is dropped; "Claude ညှိမယ်" item accepted with the one-sheet, API Part 8 P8-RULE-11). Each toggle row says what it changes and where ("Shows prices on branch pages. Prices are always shown inside online booking."). **v1.5 (owner F7 / F8):** managers holding `website.update` through a branch-scope assignment see and edit only their branches' hours and closures; company info (`company.update`), branch public toggle / map (`branch.update`), services on the website (`service.update`) and team profiles (`employee.update`, rating `employee.rating_update`) keep their own codes. A closure over existing bookings is saved and those bookings are listed — nothing is cancelled (owner F8), and such a booking is never auto-cancelled as a no-show (staff move or cancel it). **Review fix + reconcile 02/Oct:** a closure can be deleted while its **start date is today or later** (one created today by mistake can still be removed — no past day changes); a closure that **started before today** is **ended** by changing its end date ("End today") — deleting it would change which past days needed a daily closing (API Part 8 P8.WEB.07 / 08, 422 `closure_started`). Site content (`site.*`) is saved only on this screen (*Site content*), never in *Settings*.

**AD-WEB-03 · Image guidance.** ⚠️ Each image field states its use and recommended size (cover 1920 × 1080 landscape, share image 1200 × 630, service image 1200 × 900) and shows a crop preview. Uploads are re-encoded server-side, location data removed, WebP sizes 400 / 800 / 1600 px; the site uses the stable image path (v1.5 — ADR-014, API Part 8 P8-RULE-03 / 04).

**AD-WEB-04 · Share preview.** ⚠️ Show how a Facebook / Viber link preview will look (title, description, share image) next to the SEO fields, plus the runbook reminder to re-scrape in Facebook's Sharing Debugger after changing the share image.

### 10.17 Import, audit, backups

**AD-IMP-01 · Import wizard.** 🔒 D-DAT-01, Part 8. Source (Fresha export / our template) and entity (customers, service categories, simple services with per-branch sale / duration / price, product categories, products, suppliers, employees — master data only, no Fresha history; option-grid services are entered in the price-grid editor; imported employees get no invite until sent from the Access tab — v1.5, owner F5, API Part 8 P8-RULE-07; ≤ 10,000 rows per file) → **Upload** → **Map columns** → **Validate** (progress) → **Preview**: tabs Valid / Errors with per-cell messages and "Download error rows" → **Confirm** → **Result**: imported vs skipped duplicates (same phone = existing customer reused). Leaving asks for confirmation.

**AD-AUD-01 · Audit log.** 🔒 D-AUD-01/02, `audit.view`. Filters: entity, actor, branch, date, source (App / DB trigger / System job). Row: time, actor, action, entity, branch, device. Detail: a field-level **before → after** diff with human labels, the reason, and a link to the record. Read-only for everyone (no edit/delete controls exist). Barbers never see it. **v1.5 (owner F10 — API Part 8 P8-RULE-06):** branch-scope holders see only their branches' rows; rows without a branch need company scope; pay rows need company-scope `payroll.view` (the rows of a staff-advance cash out: `payroll.view` or `receivable.issue`), staff-document rows `employee.documents`. **Reconcile 02/Oct (🔒 D-AUD-01 "manager = assigned branch"):** a holder **always sees the entries they made themselves**, whatever branch they carry (pay and staff-document rows keep their own rule); an entry about an employee — profile / status change, leave — is filed under that employee's **primary branch** (their earliest active branch assignment), and a shift or attendance entry under the branch of that shift / record (API Part 0 API-AUD-01, Part 8 P8-RULE-06).

**AD-BAK-01 · Backups.** 🔒 D-DAT-03/04, `backup.view` / `backup.restore`. List of runs (Daily, Weekly, Restore test, Restore) with status and time; failures highlighted. **Restore** is a separate, heavily guarded flow: explanation that it replaces data (never used to fix one record), reason required, typed confirmation of the backup date. **v1.5 (owner F9):** confirming authorises the restore and turns maintenance on; the developer runs the restore script. While maintenance is on, the Backups screen stays usable for the admin holding `backup.restore` (to watch or cancel the authorisation — review fix 02/Oct). The monthly restore test runs automatically (owner G (e)).

### 10.18 Notifications and approvals

**AD-NTF-01 · Bell.** 🔒 D-NTF-01/02. Unread count badge (99+ cap); panel grouped Today / Earlier; each item: category icon, text rendered in the viewer's language, relative time, deep link; **Mark all read**; delete own. Kept 90 days.

**AD-NTF-02 · Types.** 🔒 D-NTF-03, Part 8. Notification types admin: enable/disable toggle per type; **mandatory types (security incl. backup / job failures and restore authorisation, payslip, deactivation) show a lock and can't be turned off**. Categories and recipients are shown read-only. **v1.5:** types are switched for the whole company — no per-user mute (API Part 8 P8-RULE-02); "admin" recipients = company-scope holders of the type's related code (owner F12).

**AD-NTF-03 · Interruptions.** ⚠️ Selective Attention. Only action-required, time-critical events show a toast / alarm on arrival: no-show alarm, discount request (approvers), discount decision (requester), booking change for the booked barber, transfer to receive. Everything else just increments the bell.

**AD-NTF-04 · Approvals inbox.** ⚠️ One place for everything waiting on the user: discount requests, leave, expenses, manual incomes (and attendance exceptions for managers), **purchases waiting to post** (for `purchase.post` holders — v1.5, owner D2). Own requests are never counted (API Part 8 P8.DSH.04). Tabs by type with counts; each item approvable in place.

**AD-NTF-05 · Pending counts.** ⚠️ Zeigarnik. The Approvals nav item and the bottom-nav tab carry the total pending count; dashboards show the "Needs attention" panel (AD-DSH-04).

### 10.19 Login, OTP, devices, install

**AD-LOGIN-01 · Login screen.** 🔒 D-AUTH-01/02/08. Logo, language switch, **Continue with Google**, and **Email me a sign-in code** (email field). No password, no SMS. Wording is neutral: "If this email can sign in, we've sent a code" — same message for unknown or disabled emails (D-AUTH-04).

**AD-LOGIN-02 · Code entry.** 🔒 D-AUTH-04. One input for the **8-digit** code with `autocomplete="one-time-code"`, `inputmode="numeric"`, paste support and digit grouping (`1234 5678`). Shows "Valid for 5 minutes", a **Resend** button with a 60-second countdown, "Only the latest code works". After 5 wrong codes in a row: "Too many attempts. Try again at 3:25 PM." A correct code resets the counter.

**AD-LOGIN-03 · First login and new devices.** 🔒 D-AUTH-03/05. An invited user's first successful login activates the account (no separate step). Every login creates an in-app notification for that user with the device and time ("New sign-in: Android · Chrome · 30/Sep/2026 9:01 AM — not you? Remove the device").

**AD-LOGIN-04 · My devices.** 🔒 D-AUTH-05, Part 1b. List: device label, sign-in method, IP, signed in at, last seen; "This device" marker; **Remove** per device. Admins can **Log out all devices** for a user from the employee's Access tab.

**AD-LOGIN-05 · Install guide.** ⚠️ (review §5.7). A page reachable from the user menu and offered once after the first login on a phone: Android (install / APK) and iPhone (Share → Add to Home Screen → open the app → sign in again inside it), with screenshots in both languages.

---

## 11. Fresha reference — adopt, improve, avoid

Fresha is a reference, not a spec (🔒 D-PLT-09). Evidence paths are relative to the `fresha-research` repo (commit `7137637`). The research was done on a Singapore sandbox and a read-only view of the live Point account (`README.md`, "Known limitations").

### 11.1 Adopt (patterns the team already knows — Jakob's Law)

| # | Fresha pattern | Our rule | Evidence |
| --- | --- | --- | --- |
| 1 | Dark icon rail + section sub-nav + top bar with search, bell, avatar | AD-LAY-01 | `evidence/_nav/nav-d-sales.png` |
| 2 | Calendar day view: one column per barber, red now-line, hatched off-shift time | AD-CAL-01 | `evidence/booking/calendar-01.png` |
| 3 | Cross-branch busy block "Booking at <branch>" in the barber's column | AD-CAL-03 | `evidence/booking/calendar-baber-tue29-aung.png` |
| 4 | Booking drawer on the right with a sticky footer (total, Checkout, Save) | AD-BKG-01 | `evidence/booking/new-appt-confirm-step.png` |
| 5 | Payment methods as big cards; one tap adds the full amount | AD-CMP-02, AD-POS-08 | `evidence/payments/checkout-03-payment.png` |
| 6 | Split payment with a running "To pay" | AD-POS-08 | `evidence/payments/checkout-split-06-both.png` |
| 7 | Refund per original payment with a required reason and a separate refund document | AD-POS-17 | `evidence/payments/refund-02.png` |
| 8 | Irreversible actions worded clearly, listing consequences ("stock will be returned") | AD-CONF-02 | `evidence/payments/void-sale-modal.png` |
| 9 | "You have unsaved changes" guard | AD-FORM-08 | `evidence/booking/unsaved-changes-modal.png` |
| 10 | Register close table: Expected / Counted / Difference per method | AD-CLS-03/04 | `evidence/finance/register-close-filled.png` |
| 11 | Stocktake with progress and review tabs (Uncounted / Unmatched) | AD-STK-05 | `evidence/inventory/stocktake-04-review.png` |
| 12 | Transfer receive with actual quantity and partial handling | AD-STK-04 | `evidence/inventory/stock-transfer-T1-receive.png` |
| 13 | Import preview with an Errors tab and downloadable error rows | AD-IMP-01 | `evidence/import-export/client-import-04-errors.png` |
| 14 | Global search grouped by type | AD-NAV-05 | `evidence/customers/global-search-03.png` |
| 15 | Report controls: date presets, filter drawer, export CSV / Excel / PDF | AD-RPT-01 | `evidence/reports/sales-summary.png` |
| 16 | Pricing table per location with inherited defaults shown as placeholders | AD-CMP-13 | `evidence/services/advanced-pricing-01.png` |
| 17 | Mobile bottom nav with a centre "+" and a single-barber calendar with a switcher | AD-LAY-03, AD-CAL-07 | `evidence/ux/mobile-390-calendar.png` |
| 18 | Activity entries with before → after ("edited from 10:00 to 10:10") | AD-AUD-01, AD-ATT-04 | `evidence/attendance/timesheet-activity.png` |
| 19 | Personal "Active sessions" with sign out per device / all devices | AD-LOGIN-04 | `evidence/settings/personal-login.png` |

### 11.2 Improve (Fresha has it, but it caused problems)

| # | Fresha behaviour (observed) | What we do instead | Rule / decision |
| --- | --- | --- | --- |
| 1 | Cross-branch double booking only soft-warned, saved anyway | Blocked by the DB; show nearest free times | AD-CAL-05 · D-BKG-08 |
| 2 | Quick-sale lines default to the logged-in user (attribution errors, ~6 extra clicks to fix) | Performer chip on every line; proxy is explicit | AD-POS-11 · D-VIS-03/12 |
| 3 | Reschedule / Cancel / Refund / Void hidden under "Options" | Visible actions for the current status | AD-LIST-04, AD-BKG-03 |
| 4 | Each status change closes the drawer | Drawer stays open and refreshes | AD-CMP-08 |
| 5 | Cancel reason optional, not in the activity log; no-show without reason | Reason required, shown and audited | AD-BKG-05 · D-BKG-14/15 |
| 6 | Void and cart discount need no reason or approval | Reasons; discount by code or approval request | AD-POS-09 · D-PAY-04 |
| 7 | Register difference needs no reason | Reason required; above tolerance notifies admin | AD-CLS-03 · D-FIN-06 |
| 8 | KBZPay = name-only custom method, no reference | Required reference + verification list at closing | AD-POS-08, AD-CLS-04 · D-PAY-02 |
| 9 | One branch per calendar view | Barber view across branches | AD-CAL-06 |
| 10 | Inconsistent date/time formats, "$" on an SGD receipt | One formatter; `DD/MMM/YYYY`, 12 h, Ks | AD-FMT-00 · D-PLT-04/05 |
| 11 | Report data 26–28 minutes old | Live or explicitly timestamped | AD-DSH-03 |
| 12 | Archiving a staff member leaves their bookings silently | List future bookings before deactivating | AD-EMP-03 |
| 13 | Overlapping shifts at two branches saved without warning | Refused, with the cross-branch gap rule | AD-SCH-01 · D-SCH-02 |
| 14 | Transfer quantity defaults to the reorder quantity (10) | Empty until entered | AD-STK-04 |
| 15 | No Burmese UI | Full MM / EN | AD-L10N-* · D-PLT-03 |
| 16 | History only per record, none for staff / settings / clients | Central audit viewer with before/after | AD-AUD-01 · D-AUD-01/02 |
| 17 | Hourly wages only; no payslip seen | Monthly salary, payroll run wizard, payslip PDF / Excel | AD-PAY-* · D-PAYR-* |
| 18 | Blank page / spinner hang on navigation | Skeletons, no full-page spinners | AD-STATE-01 |
| 19 | Tip step on every checkout | No tips in V1 | D-PAY-09 |
| 20 | Leave "Approved" checkbox didn't gate anything | Pending/Approved statuses; both block bookings; approver sees affected bookings | AD-LV-02 · D-LV-04 |

### 11.3 Avoid (don't build or copy)

Marketplace / "online presence" add-ons, packages, memberships, gift cards, loyalty, consultation forms, patch tests, bookable resources, AI concierge, client automations (SMS / email / WhatsApp), customer accounts and login walls, reviews and ratings, group and repeating appointments, "Download the app" banners, first-use promo pop-ups ("Free to use — Start now"), client merge, blocked-time types used for lateness ("Late to work" — lateness is attendance, D-LV-01), tip settings. (Scope: 🔒 decisions only — AD-META-07, review §3.6 / executive summary "Scope creep".)

---

## 12. Accessibility (WCAG 2.1 AA)

**AD-A11Y-01 · Standard.** ⚠️ Every screen meets WCAG 2.1 AA; automated axe checks run in CI (AD-QA-03) and a manual keyboard + screen-reader pass is done for the flows in §10.

**AD-A11Y-02 · Keyboard (desktop).** ⚠️ Every action reachable by keyboard in a logical order; visible focus ring (`--ring`, ≥ 3 : 1 — v1.7: drawn in `--foreground` until the palette arrives, AD-VIS-03); Esc closes the top overlay; focus is trapped in dialogs and returns to the trigger on close; Ctrl/⌘ K opens search.

**AD-A11Y-03 · Not colour alone.** ⚠️ Status, flags, differences and validation always combine colour + icon + text (Von Restorff guidance).

**AD-A11Y-04 · Labels and announcements.** ⚠️ Every input has a visible label; icon buttons have `aria-label`; toasts, realtime changes and "Remaining to pay" updates are announced via `aria-live="polite"`; errors via `aria-describedby` + `aria-invalid`.

**AD-A11Y-05 · Touch and zoom.** ⚠️ Targets ≥ 44 px (48 px preferred); pages usable at 200% zoom and with the OS large-font setting; no `user-scalable=no`.

**AD-A11Y-06 · Motion and language.** ⚠️ Respect `prefers-reduced-motion`; set `lang` on `<html>` and on mixed-language fragments (e.g. an English receipt number inside Myanmar text doesn't need it, but a whole English paragraph does).

**AD-A11Y-07 · Tables and charts.** ⚠️ Tables use real `<th>` headers with scope; charts offer a "Show as table" alternative.

---

## 13. Copy and tone

**AD-COPY-03 · Voice.** ⚠️ Plain, polite, short. Myanmar copy is polite but not ceremonial; staff read it mid-task. Say what to do, not what went wrong in technical terms. Never blame the user.

**AD-COPY-04 · Message patterns.** ⚠️
| Kind | Pattern | Example (EN) |
| --- | --- | --- |
| Error | What happened + what to do | "This time was just booked. Pick another time." |
| Blocked by rule | Rule in plain words + who can help | "This day is closed. An admin can reopen it." |
| Empty | What goes here + first step | "No open visits. Tap ＋ Start when a customer arrives." |
| Confirm | Action + consequence + irreversibility | "Send transfer? Stock leaves Branch 1.0 now. You can't edit or cancel after sending." |
| Success | What is done + next step | "Finished · B3-2026-OCT-00125. Next customer?" |

**AD-COPY-05 · UI terms (MM suggestions need owner review ★).** Glossary terms (🔒 review §6.1) are fixed; the short action labels are suggestions.

| Concept | EN label | MM label | Status |
| --- | --- | --- | --- |
| Branch / Staff / Customer / Service | Branch / Staff / Customer / Service | ဆိုင်ခွဲ / ဝန်ထမ်း / ဖောက်သည် / ဝန်ဆောင်မှု | 🔒 glossary |
| Booking / Visit / Sale / Payment | Booking / Visit / Sale / Payment | ကြိုတင်ချိန်းဆိုမှု / ဝန်ဆောင်မှုပေးခြင်း / ရောင်းချမှု / ငွေပေးချေမှု | 🔒 glossary |
| Refund / Adjustment | Refund / Adjustment | ငွေပြန်အမ်း / ပြင်ဆင်ချက် | 🔒 glossary |
| Daily closing | Daily closing · button "Close day" | နေ့စဉ်စာရင်းပိတ် · "စာရင်းပိတ်မည်" | glossary + ★ |
| Commission / Payroll / Advance / Loan | Commission / Payroll / Advance / Loan | ကော်မရှင် / လစာ / ကြိုထုတ်ငွေ / ချေးငွေ | 🔒 glossary |
| Barber (service staff picker) | Barber | ဆံပင်ညှပ်ဆရာ | review §6 label |
| Start service | Start | စတင်မည် | ★ suggestion |
| Service done | Service done | ဝန်ဆောင်မှု ပြီးပြီ | ★ suggestion |
| Take payment | Take payment | ငွေရှင်းမည် | ★ suggestion |
| Finish | Finish | အပြီးသတ်မည် | ★ suggestion |
| Walk-in | Walk-in | ကြိုမချိန်းဘဲ လာသူ (Walk-in) | ★ suggestion |
| Reschedule / Cancel booking | Reschedule / Cancel booking | အချိန်ပြောင်းမည် / ချိန်းဆိုမှု ပယ်ဖျက်မည် | ★ suggestion |
| Approve / Reject | Approve / Reject | ခွင့်ပြုမည် / ငြင်းပယ်မည် | ★ suggestion |
| Late entry | Late entry | နောက်မှ ထည့်သွင်းခြင်း | ★ suggestion |
| Recorded by | Recorded by | မှတ်သွင်းသူ | ★ suggestion |
| Clock in / Clock out | Clock in / Clock out | အလုပ်ဝင် မှတ်မည် / အလုပ်ဆင်း မှတ်မည် | ★ suggestion |
| Cash out / Cash return | Cash out / Cash return | ငွေထုတ် / ငွေပြန်ထည့် | ★ suggestion |

---

## 14. Implementation notes for Claude Code

**AD-IMPL-01 · Stack.** From review §5.2 (✅ items; architecture RECs still need ADRs): Next.js App Router, route group `(app)` for this guideline (client components, TanStack Query → NestJS REST/OpenAPI client), Tailwind + shadcn/ui, React Hook Form + Zod (schemas shared from `packages/shared`), next-intl, lucide-react, Socket.IO client. Business rules live in the NestJS API, not in Next.js server actions (review §5.2).

**AD-IMPL-02 · Build these shared components first** (before feature screens, so every module reuses them): `AppShell`, `BranchSwitcher`, `BottomNav`, `PageHeader`, `FilterBar`, `DataTable`, `CardList`, `StatusBadge` (reads the §6.3 map), `FlagChip`, `EmployeeChip`, `MoneyInput`, `MoneyText`, `PhoneInput`, `BilingualInput`, `DateInput`, `DateText`, `TimeSlotPicker`, `OptionPicker`, `PriceGridEditor`, `ReasonDialog`, `ConfirmDialog`, `Drawer` / `Sheet`, `Stepper`, `EmptyState`, `ErrorState`, `LockBanner`, `OfflineBanner`, `PermissionGate` + `can()`, `NotificationBell`, `ApprovalCard`, `QrScanner`, `ReceiptRenderer`, `AttachmentUploader`, `KpiTile`, `BarChart` / `LineChart`.

**AD-IMPL-03 · Suggested layout.**
```
apps/web/
├── app/(app)/                # this guideline
│   ├── layout.tsx            # AppShell, auth guard, realtime provider
│   ├── today/  calendar/  bookings/  sales/  customers/
│   ├── team/  money/  stock/  reports/  website/  settings/  me/
├── components/app/           # feature components
packages/
├── ui/                       # tokens.css + shared components (AD-IMPL-02)
├── shared/                   # zod schemas, status constants, formatters, permission keys
└── i18n/                     # my.json, en.json (or per-module namespaces)
```

**AD-IMPL-04 · Constants, not numbers.** 🔒 D-DB-03. Status and type values come from constants in `packages/shared` (e.g. `BookingStatus.BOOKED`); the tone map (§6.3) lives in one file. Never compare against raw numbers in components.

**AD-IMPL-05 · Guard rails in CI.** ⚠️ Lint / CI fail on: raw JSX strings (i18n), hex colours or arbitrary Tailwind colour classes, raw `font-family` declarations outside `tokens.css`, `parseFloat` / JS `number` arithmetic on money (money is bigint / string end-to-end), missing translation keys in either language, axe violations on the flow pages.

**AD-IMPL-06 · Component catalogue.** 🔒 owner 02/Oct/2026 (D-ENG-01): the catalogue is the **`/dev/ui` page** (not Storybook) — it renders every shared component in MM and EN at 320 px and 1280 px; it is built by `add-shared-ui-components` and is not served in production.

**AD-QA-01 · Definition of done for a screen.** ⚠️
- [ ] Works in **Myanmar and English** at **320, 360, 768 and 1280 px**; no clipped or overflowing text.
- [ ] Loading, empty, error, forbidden, read-only (lock), offline states exist where they apply.
- [ ] Actions hidden when not permitted; no enabled control can 403.
- [ ] Formats from the shared formatter only; MMT dates.
- [ ] Reasons collected where §5.4 requires; confirm dialogs where §5.5 requires.
- [ ] Money submits are idempotent and can't double-submit.
- [ ] Realtime updates handled (if the data is shared).
- [ ] Keyboard and screen-reader basics; axe clean.
- [ ] PR cites the rule IDs and decision IDs it implements.

**AD-QA-02 · Occam review.** ⚠️ Each new screen gets one review pass that only asks "what can we remove?" (fields, buttons, columns, text) before merge.

**AD-QA-03 · End-to-end tests (Playwright).** ⚠️ At 360 × 800 and 1280 × 800, MM and EN smoke: walk-in cash; walk-in split Cash + KBZPay with an internal discount code; booking → Start → Finish; proxy recording (B for A) including payment; late entry; discount request approve and reject; refund (items) and overpayment return; daily closing with a difference and KBZPay verification; transfer send → receive with a shortfall; payroll run Draft → Paid; clock in (mock QR + GPS).

**AD-QA-04 · Usability test before build-out.** ⚠️ REC-03. A clickable prototype of Today → Start → Checkout → Finish on 3–5 barbers' **own phones** in a real branch. Measure taps and seconds against AD-GOAL-01, note hesitations and mis-taps, fix, then build.

---

## 15. Open items and owner inputs

**Resolved by the owner on 01/Oct (v1.1):** OPEN-31 fonts ✅ (§3.2) · OPEN-32 digits / month / AM-PM / receipt English ✅ (AD-FMT-02/03/10, AD-RCPT-01) · OPEN-33 language on the user account ✅ → DB Part 1 v3.3 `users.ui_language` (AD-L10N-06) · OPEN-10 own earnings OFF by default, admin enables ✅ → `employees.show_own_earnings` (AD-DSH-01, AD-POS-07, AD-EMP-02) · OPEN-20 no device count, works everywhere ✅ (AD-RCPT-02) · OPEN-36 discount split across service + product lines ✅ (AD-POS-09) · OPEN-21 website toggles default OFF, owner enables ✅ (AD-WEB-02).
**Resolved by the owner on 01/Oct 21:20 (v1.3):** permission codes = CRUD per menu + special actions, company admin = the five role codes, seed roles Admin / Manager / Barber ✅ (AD-PERM-06 / 07) · roster updated immediately after a pattern save ✅ (AD-SCH-01) · rating code `employee.rating_update` ✅ · 14-day window for staff ✅ (D-BKG-06) · booking idempotency by client token ✅ (ADR-004).

**Resolved by the owner on 02/Oct 00:06 (v1.5 — one-sheet "အကုန်လုံး OK", review v5.2.14 §0.8):** A1 Part 3 locked (AD-PERM-06) · B1–B12 checkout, payments, refunds, late entry, receipts (AD-POS-*, AD-RSN-02, AD-RCPT-*) · C1–C12 pay data *Private*, attendance and payroll (AD-PERM-03/06/07, AD-ATT-*, AD-PAY-*) · D1–D9 stock (AD-STK-*) · E1–E8 closing and finance (AD-CLS-*, AD-FIN-*, AD-STATE-06) · F1–F12 reports, exports, website, import, audit, backups, documents, notifications (AD-RPT-*, AD-LIST-07, AD-WEB-*, AD-IMP-01, AD-AUD-01, AD-BAK-01, AD-EMP-02, AD-NTF-02) · G DB additions · H receipt renderer / printer width / auto-print OFF (AD-RCPT-02) — all at their defaults; final names from API Parts 4–8 v1.0.
**Resolved by the owner on 01/Oct 10:47 (v1.2):** OPEN-34 ✅ the 10 reports confirmed (AD-RPT-04 🔒) · own-earnings = company switch **and** per-barber override ✅ (AD-DSH-01; DB Part 1 v3.4 — `show_own_earnings` nullable, setting `dashboard.show_own_earnings_all`) · checkout estimate gated by the same flag ✅ (AD-POS-07) · app money unit stays `ကျပ်` ✅ (AD-FMT-01) · OPEN-37 barber rating = admin / manager-entered ✅ (AD-EMP-02, AD-WEB-02 — `employees.public_rating`; customer ratings = V2) · OPEN-30 colour palette arrives at the spec stage (not a blocker).

| ID | Item | Default until decided | Affects |
| --- | --- | --- | --- |
| ◐ OPEN-30 (admin ★ — v1.7) | **Admin panel colour values for the tokens in §3.1 — not given yet** (owner 02/Oct/2026: the website palette arrived — website guideline FE-VIS-01a; the "Admin Panel Color Pallet" heading came without values). Until the owner gives them the staff tree keeps the shadcn/ui `neutral` values unchanged. With the neutral values the focus ring (`--ring`) and the input border (`--input`) are below the 3 : 1 that AD-VIS-04 asks — **settled for now by owner S15 (v1.7): focus outline = `--foreground`, input border = `--muted-foreground` (AD-VIS-03)**. Still to fix with the palette: the status tones (`--success`, `--warning`, `--info`) have no values of their own — status is told apart by icon + text (AD-A11Y-03). Design reference = AD-META-08 | shadcn/ui `neutral` defaults, placeholders kept | Everything |
| ⚠️ DB | **Part 1 v3.4** = v3.3 (`users.ui_language`, `employees.show_own_earnings`) + v3.4 (`show_own_earnings` nullable — follows `dashboard.show_own_earnings_all`; `employees.public_rating`) — all follow from the owner's answers; recorded in D-DB-02 (review §6.3). Setting `dashboard.show_own_earnings_all` is a `settings.json` key (no migration, D-PLT-16) | Build on v3.4 | AD-L10N-06, AD-DSH-01, AD-EMP-02 |
| ~~⚠️ permission~~ | ~~Who may edit a barber's rating~~ — closed (v1.3): code **`employee.rating_update`** (branch-scopable — admin, and managers whose scope covers one of the barber's branches; API Part 1 P1.EMP.12) | – | AD-EMP-02 |
| ~~⚠️ OPEN-40~~ | ~~🔒 D-DAT-05 "no hard delete of transactional rows" vs removing wrong / derived rows — (a) payroll reopen vs the run's salary expense rows · (b) withdrawing a wrong, unused salary row / commission-plan assignment · (c) replacing the lines of a draft purchase / transfer~~ — ✅ **closed by the owner 02/Oct/2026 ("OPEN-40 OK")**: (a) reopen **soft-deletes** the run's salary expenses and finalize posts fresh rows (DB Part 7 v1.2) · (b) *Withdraw* **archives** the row (DB Part 5 v1.2 — `archived_at` / `archived_by_user_id` / `archive_reason`) · (c) removed draft lines are deleted with a full audit diff (as booking items — A2). Screens are as written: Reopen needs a reason and the salary rows leave the P&L until the run is finalized again; *Withdraw* needs a reason; a draft saves its new lines | – | (a) AD-PAY-01, AD-FIN-04, AD-FIN-06 · (b) AD-PAY-04, AD-PAY-05 · (c) AD-STK-03, AD-STK-04 |
| ~~⚠️ REC-37~~ | ~~Auto-print after FINISH default OFF~~ — ✅ owner H (02/Oct 00:06): setting `receipt.auto_print`, default OFF | – | AD-RCPT-02 |
| ~~⚠️ REC-40~~ | ~~Approve this guideline's content~~ — ✅ 🔒 D-UX-03 (01/Oct 11:09); v1.3 = 01/Oct 21:20 | – | Whole file |
| ~~API question~~ | ~~Does the 14-day advance window also limit staff bookings?~~ — closed by the owner (01/Oct 11:54): **yes**, one setting for public and staff (🔒 D-BKG-06, API Part 0 §12 #2) | Both | AD-BKG-01 |
| ~~API question~~ | ~~Minimum lead time for online booking~~ — closed by the owner (01/Oct): **none** — a customer at 10:00 may book the next free slot boundary (10:15 with the default 15-minute interval). The booked barber sees it live on Today (AD-TODAY-04) — 🔒 D-BKG-23 | No lead time | AD-TODAY-04, FE-BK-08 |
| ~~API question~~ | ~~Who gets the no-show alarm; manual "Cancel as no-show"~~ — closed (owner 01/Oct, Part 3 sheet #2 / #3): booked barber + branch users with `booking.update`; manual cancel allowed before 40 minutes (AD-BKG-09) | – | AD-BKG-09 |
| ~~⚠️ scope~~ | ~~Branch Manager and company-level codes~~ — closed (owner 01/Oct — ADR-012): the data level decides; Manager manages their branch's services (sale + duration) and setting overrides | – | AD-PERM-07 |
| ~~API question~~ | ~~Booking create has no `client_request_id`~~ — closed (owner 01/Oct 21:20): the **client generates the manage token** and the server stores its hash — a retry returns the same booking and link (ADR-004, API-IDEM-03; DB unchanged) | – | AD-BKG-02, FE-BK-11 |
| ~~API question~~ | ~~`GET /public/barbers` (website barber cards) needs each barber's **today's branch** from `schedule_shifts` — public read-only endpoint, no phone / email~~ — closed (v1.5): answered by **`today_branches[]`** (several on a split day), falling back to the assigned branches `branches[]` — API Part 8 **P8.PUB.04** (`[]` while `site.show_barbers` is off; default 12, order `employee_code`) | – | FE-HOME-05 |
| ~~API question~~ | ~~Receipt reprint in the other language~~ — closed: receipts are always English (OPEN-32 ✅) | Reprint = identical image | AD-RCPT-01 |

*Change log: fix-up 02/Oct/2026 13:46 (no version bump) — AD-VIS-03: the S15 interim applies to the staff tree only (REC-41 ✅ — the website has its own `--ring` / `--input`) · **v1.7 (02/Oct/2026 13:08)** — owner sheet 3 (review §0.11): AD-POS-03 / 05 catalogue-order chips, no "Frequent here" section in V1 (S7); AD-VIS-03 / AD-A11Y-02 focus outline and input border on existing neutral tokens until the palette arrives (S15); §15 OPEN-30 row · **v1.6 (02/Oct/2026)** — OPEN-40 closed (§15), OPEN-30 admin palette still open — neutral stays (§15), AD-META-05a path note, AD-META-08 design reference / "80 % Fresha, easier to use", AD-META-01 seven tiers written out, AD-IMPL-06 = `/dev/ui` (D-ENG-01), AD-VIS-01 site colour override note, weekday of the 30/Sep/2026 examples corrected (AD-FMT-02, §8 Today); no screen rule changed · v1.5 (02/Oct/2026 00:06) — API Parts 4–8 deltas.*

*End of admin panel guideline v1.7.*
