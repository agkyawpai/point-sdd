# Point Barbershop — Public Website & Online Booking · UI/UX Guideline

> **File:** `docs/ux/frontend-website.md` (repo path) · **Version:** **v1.7** · **Date:** 02/Oct/2026 (**v1.7 = owner approved the remaining website colour tokens, 02/Oct/2026 13:46 (REC-41 ✅)** · **v1.6 = owner sheet 3 "အကုန် OK", 02/Oct/2026 13:08 (review §0.11) — S15 focus outline / input border until REC-41 is approved** · **v1.5 = owner's website colour palette, 02/Oct/2026 morning — OpenSpec sheets B1 / B2 / #2 (review §0.10)** · v1.0 = draft written 30/Sep night → 01/Oct · v1.1 = owner answers, 01/Oct morning · v1.2 = owner's second round, 01/Oct 10:47 · v1.3 = owner answers to the API Part 3 sheet, 01/Oct evening — review §0.7 "အကုန် OK", 01/Oct 23:30 · **v1.4 = owner one-sheet 02/Oct 00:06 — API Parts 4–8 deltas (review §0.8 "အကုန်လုံး OK")**)
> **Status:** 🔒 **APPROVED by the owner — 01/Oct/2026 11:09 (D-UX-04 locked, REC-39 ✅); v1.5 = the owner's website palette applied; v1.6 = owner sheet 3 of 02/Oct/2026 13:08 applied; v1.7 = REC-41 approved 02/Oct/2026 13:46 (D-UX-04 → v1.7).** **v1.7 changes:** FE-VIS-01a — **every row of the token table is now 🔒** (ring, card, muted, border, input, secondary, accent, destructive, success, warning, info — owner "Ok ပါတယ်", REC-41 ✅); they are built in `add-shared-ui-components` (the separate change `change-site-colour-tokens` is not needed); the S15 interim (focus outline / input border on other tokens) **ends for the website** — the site uses its own `--ring` and `--input`; FE-META-03 and §14 rows updated. No other rule changed. **v1.6 changes:** FE-VIS-01a note — until REC-41 is approved the **focus outline is 2 px `var(--foreground)` and the input border is `var(--muted-foreground)`** (owner S15; admin AD-VIS-03 v1.7); REC-41 itself is **still not approved**. No other rule changed. **v1.5 changes** (owner 02/Oct/2026 — OPEN-30 website part ✅, D-UX-02 update): **website palette = `#EEEEEE` background · `#000000` text · `#DC5F00` decoration** (FE-VIS-01, new FE-VIS-01a token table and FE-VIS-01b contrast rules) · **buttons = black with white text; orange = decoration, large headings and icons only** (owner sheet 2 #2) · the `site` tree overrides **colour** tokens as well as font tokens (one `tokens.css` — AD-VIS-01) · design reference images = `point-barber/design-reference/website/` (reference, never a rule — FE-VIS-01) · §14 OPEN-30 row updated; the remaining site tokens are a 🟡 proposal (REC-41 — not binding, not used in code) until the owner approves · FE-META-01 precedence written out as seven tiers, FE-META-04a path note, FE-META-06 third exception (site colours), weekday of the example dates corrected. **v1.4** = owner one-sheet answers of 02/Oct/2026 00:06. **v1.4 changes** (owner one-sheet 02/Oct 00:06 — API Part 8 public endpoints P8.PUB.01..05, 🔒 D-API-09): barber card on a **split day shows both branches** — "Today at 1.0 (AM) · 3.0 (PM)" from `today_branches[]` (FE-HOME-05) · **"Open now" computed in the browser** from `hours`, `closures` and `server_time`, so a cached page is never stale (FE-HOME-02, FE-BR-02) · images from the **stable media path** `/api/v1/public/media/<id>/<variant>` (FE-PERF-05) · public endpoint names final (FE-IMPL-01) · §14 `/public/barbers` question closed (P8.PUB.04). *Review fixes 02/Oct (independent review of the batch — no version bump):* sources → review v5.2.15 · FE-PERF-05 images cached one day (not immutable) · the booking link of a branch hidden from the website keeps working — the booking API accepts any active branch (FE-IA-03, API Part 3 P3-RULE-10). Every ⚠️ rule in this file is now binding alongside the 🔒 ones; ★ items (colour palette, design reference) are values still to be supplied and do not block implementation. Changes after this point = a new version + a note in the review's register. **v1.3 changes** (owner 01/Oct evening — Part 3 sheet, review §0.2 (ဍ)): customer change / cancel **cutoff = 2 hours before** (setting, FE-BK-10, FE-MNG-05) · confirmation page **tells the customer about the 40-minute auto-cancel** (FE-CONF-03) · **"Add to calendar" (.ics) built in the browser** — REC-36 ✅ (FE-CONF-02) · **≤ 5 services** per website booking (FE-BK-05) · retry after a lost reply returns the same booking + link (ADR-004 — FE-BK-11) · API paths = API Part 3 (P3.PUB.*). **v1.2 changes** (owner 01/Oct 10:47 — review §10.10): barber card **rating = set by the admin / manager** for V1, customer ratings in V2 (OPEN-37 ✅ — FE-HOME-05, `employees.public_rating`, DB Part 1 v3.4) · money unit confirmed: website `Ks`, app unchanged (FE-FMT-01) · **no minimum lead time** for online booking (🔒 D-BKG-23 — FE-BK-08) · colour palette + design reference arrive at the spec stage (FE-VIS-01). **v1.1 changes** (owner answers 01/Oct — review §0.2 (စ), §10.9): booking flow = **modal / pop-up**, not a separate page (FE-BK-00) · **Our barbers** cards with direct booking, current branch, description (FE-HOME-05) · fonts set (FE-VIS-02) · theme = minimalist and clean, design reference + colour palette to follow (FE-VIS-01) · motion = Motion + GSAP, no 3D (FE-VIS-07) · TikTok in social / SEO (FE-SEO-02) · OPEN-31 / 32 / 35 / 21 resolved · OPEN-37 (barber "rating") raised — resolved in v1.2.
> **Companion file:** `docs/ux/admin-panel.md` (everything behind staff login). Shared foundations — design tokens, formatter, language files — are defined once and used by both.
> **Current sources (v1.7):** `docs/decisions/point-barbershop-system-review-v5.2.18.md` + `docs/decisions/decision-register.md` (Appendix A; §0.10 = the owner answers of 02/Oct morning; §0.11 = sheet 3, answered 13:08) · `docs/db/` · `docs/api/` (`00-conventions.md` **v1.6**, `03-customers-booking.md`, `08-platform.md`) · `docs/adr/` (ADR-001…016) · `docs/ux/admin-panel.md` **v1.7**. The line below names the files this guideline was first written against (older file names, same content lineage).
> **Sources:** `point-barbershop-system-review-v5.2.15.md` (Appendix A, §5.8 website design, §6.4h Part 8, §10.9–§10.10 owner answers; the owner one-sheet answers A1–H = review §0.8 — answered on v5.2.14) · `db/` (Part 1 v3.4, Part 2 v1.3, Part 3 v3, Part 8 v1.1) · `api/` — public endpoints in `api-03-customers-booking-v1.1.md` (P3.PUB.* — booking) and `api-08-platform-v1.0.md` (P8.PUB.* — site, branches, barbers, media); conventions `api-00-conventions-v1.5.md` · [Laws of UX](https://lawsofux.com/) (30 laws, checked 30/Sep/2026) · Fresha research repo `naingaunglinn/fresha-research` (commit `7137637`, customer booking flow on a public Fresha venue page).
> **Colour (v1.7):** the website palette is complete — the owner's three colours and the approved remaining tokens (REC-41 ✅ 02/Oct/2026 13:46), all in FE-VIS-01a. Still ★: the logo file. Design reference images live in `point-barber/design-reference/website/` (the owner adds them; Claude Code opens the image its `README.md` index names for the screen being built). Fonts are set (OPEN-31 ✅ — FE-VIS-02).

---

## မြန်မာ အတိုချုပ် (Owner အတွက်)

- ဒီဖိုင်က **customer မြင်ရတဲ့ website** (`/` home, branch page) နဲ့ **online booking** (booking modal — `/book`, `/book?branch=<code>` link တွေက modal ကို ဖွင့်ပေး၊ booking ပြင် / ပယ်ဖျက်တဲ့ manage link page) ရဲ့ UI/UX စည်းမျဉ်းပါ။ Rule ID = `FE-…`။
- အဓိက စိတ်ကူး — ဒီနေ့ online booking **0%** ဖြစ်နေတယ်၊ customer အများစုက Facebook / Viber / TikTok / ဆိုင်ထဲက QR ကနေ **ဖုန်း** နဲ့ ဝင်မယ်။ ဒါကြောင့် **account မလို၊ OTP မလို၊ နာမည် + ဖုန်းပဲ** (🔒 D-BKG-10)၊ step တိုတို၊ **စက္ကန့် ၆၀ အတွင်း** booking ပြီးအောင်။ Customer ဆီ SMS / email ဘာမှ မပို့လို့ (🔒 D-CUS-05) **confirmation page + manage link** ကပဲ customer လက်ထဲ ကျန်မယ့် တစ်ခုတည်းသော မှတ်တမ်း — ဒါကို အကောင်းဆုံး ဖြစ်အောင် ဆွဲထားတယ် (§5.5)။
- Tag တွေက admin ဖိုင်နဲ့ တူတူ — 🔒 lock ပြီး · ⚠️ guideline အကြံ · 🟡 owner ဆုံးဖြတ်ရန် · ★ owner တန်ဖိုး ဖြည့်ရန်။
- **v1.1 (01/Oct) — owner ဖြေပြီးသား:** booking ကို သီးခြား page မထားဘဲ **modal / pop-up box** နဲ့ (FE-BK-00) · Home page **Our barbers** card တစ်ယောက်ချင်း **direct booking** + လက်ရှိ branch + description (FE-HOME-05) · font = **Archivo Black** (display) + **Roboto** (text) + **Pyidaungsu** (မြန်မာ) (FE-VIS-02) · theme = **minimalist and clean** (FE-VIS-01) · animation = **Motion + GSAP**၊ 3D object ✖ (FE-VIS-07) · SEO / social မှာ **TikTok** ပါ (FE-SEO-02) · ဈေး `7,000 Ks` ပဲ၊ လ English (`01/Oct/2026`)၊ AM/PM (FE-FMT-01) · website toggle = info page ပဲ၊ booking မှာ ဈေး အမြဲပြ (OPEN-35 = Option A) · ဈေး / barber = owner က admin panel ကနေ ဖွင့်မှ ပြ (OPEN-21 — default OFF)။
- **v1.2 (01/Oct 10:47) — owner ဒုတိယအကြိမ် ဖြေပြီးသား:** barber card **rating = လောလောဆယ် admin / manager ပေးတဲ့ rating** (`employees.public_rating` — website မှာ "Point rating" လို့ label ပြ၊ customer review လို့ မထင်အောင်)၊ **V2 မှာ customer rating** · ငွေ = website မှာပဲ `Ks`၊ admin app မပြောင်း · online booking **lead time မလို** — customer က 10:00 မှာ နောက် slot (default 15 မိနစ် ဆို 10:15) ကို တန်း booking လုပ်လို့ရ (D-BKG-23) · colour palette + design reference = develop spec ထုတ်ချိန်ကျမှ ပေးမယ် (Claude Code က အဲ့အချိန် တောင်း)။
- **v1.3 (01/Oct ည) — API Part 3 sheet owner ဖြေပြီး:** link နဲ့ ပြောင်း / cancel = **ချိန်းချိန် ၂ နာရီ အလို** အထိ (setting) · confirmation page မှာ **"၄၀ မိနစ် နောက်ကျရင် booking ပျက်၊ ရောက်လာရင် walk-in"** ပြော · **"Calendar ထဲ ထည့်" (.ics)** = ဖုန်းထဲမှာပဲ ဖိုင်ထုတ် (server က ဘာမှ မပို့) · website booking တစ်ခုမှာ service **၅ ခု** အထိ။
- **v1.4 (02/Oct 00:06) — owner one-sheet (API Part 8):** barber card — တစ်နေ့တည်း branch ၂ ခု (မနက် / ညနေ) မှာ လုပ်ရင် branch ၂ ခုလုံး ပြ ("Today at 1.0 (AM) · 3.0 (PM)") · "ယခု ဖွင့်ထားပါတယ်" ကို browser ထဲမှာ ဖွင့်ချိန် + ပိတ်ရက် + server အချိန်နဲ့ တွက် (cache ဟောင်းနေလည်း မမှား) · ပုံ = `/api/v1/public/media/…` link တစ်ခုတည်း (အရွယ် 400 / 800 / 1600) · `/public/barbers` မေးခွန်း ပိတ်ပြီ (`today_branches[]`)။
- **v1.5 (02/Oct မနက်) — website အရောင်:** owner ပေးတဲ့ ၃ ရောင် — နောက်ခံ `#EEEEEE` · စာ `#000000` · decoration `#DC5F00` (FE-VIS-01a)။ **ခလုတ် = အမည်း + စာဖြူ**; လိမ္မော်ရောင်ကို အလှဆင်၊ ခေါင်းစဉ်ကြီး၊ icon မှာပဲ သုံး — စာသေးမှာ မသုံး (ဖတ်ရခက်လို့ — FE-VIS-01b)။ Design reference ပုံ = `point-barber/design-reference/website/` folder။
- **v1.6 (02/Oct 13:08 — sheet 3 "အကုန် OK"):** ကျန်အရောင် (REC-41) OK မရခင် **focus ring = အမည်း၊ input ဘောင် = မီးခိုးရင့်** (ရှိပြီးသား အရောင်ပဲ) — `#EEEEEE` နောက်ခံပေါ်မှာ input ဘောင် မမြင်ရတာ ပြေ။
- **v1.7 (02/Oct 13:46 — owner "Ok"):** website ရဲ့ ကျန်အရောင် (အနီ error / အစိမ်း success / အညို warning / အပြာ info / မီးခိုး စာ / ဘောင်) **အကုန် lock** (REC-41 ✅ — FE-VIS-01a ဇယား); website အရောင် ပြည့်စုံပြီ။
- **Owner ဖြည့်ရန် ကျန်:** logo ဖိုင်။

---

## 0. How to use this document

**FE-META-01 · Precedence.** (1) Appendix A 🔒 decisions → (2) `docs/db/` DBML + constraints → (3) this guideline → (4) API conventions and parts (`docs/api/`) → (5) ADRs and the system design → (6) design-reference images (FE-VIS-01) → (7) Fresha reference *(v1.5: tiers 4–6 written out — the same order as `openspec/config.yaml` and admin AD-META-01)*. A rule that contradicts a 🔒 decision loses; **stop and report the conflict** (🔒 D-PLT-13).

**FE-META-02 · Rule IDs.** `FE-<AREA>-nn`, cited in OpenSpec specs and PRs next to decision IDs (🔒 D-PLT-17).

**FE-META-03 · Tags.** 🔒 D-xxx = derived from a locked decision · ⚠️ = guideline rule — **binding since the owner's approval on 01/Oct/2026 (D-UX-04)** · 🟡 = owner decision pending — **not binding and not used in code** until approved (D-PLT-11); none left in this file (v1.7 — the REC-41 rows of FE-VIS-01a were approved on 02/Oct/2026) · ★ = owner supplies a value (never invent it).

**FE-META-04 · Scope.** Next.js route group `(site)`: home, branch pages, the **booking modal** (opened from every Book CTA and from the `/book` entry links — FE-BK-00), confirmation state, manage-booking page, system pages (404, maintenance), SEO/social metadata. Staff screens are in the admin guideline.

**FE-META-04a · Path note (v1.5).** "Route group `(site)`" in this file means the route tree `apps/web/app/site/`; the staff app is `apps/web/app/staff/`; `proxy.ts` separates them by host (ADR-001). Same note as admin AD-META-05a.

**FE-META-05 · Out of V1.** Don't build: customer accounts or login (D-CUS-04), SMS / email / any message to customers (D-CUS-05), OTP for booking (D-BKG-10), waitlist (⏭ D-BKG-20), discount codes on `/book` (⏭ D-PAY-04), online payment / deposits, **customer** reviews and ratings (V2 — the shop-set barber rating in FE-HOME-05 is in V1), blog, gift cards, packages, memberships, marketplace features.

**FE-META-06 · Shared foundations.** Tokens (admin §3), formatter (admin §7.1), language files (admin §7.2) and Myanmar typography rules (admin AD-L10N-04/05) apply here unchanged, with three public-site exceptions set by the owner: its **own Latin font tokens** (01/Oct — FE-VIS-02; the Myanmar font is shared), its **own colour values** for the shared token names plus the site-only `--decoration` (02/Oct — FE-VIS-01a, v1.5), and money as **`Ks` in both languages** (01/Oct — FE-FMT-01). This file repeats only what matters for the public site.

---

## 1. Context — who visits and what they need

### 1.1 Visitors

| Visitor | Arrives from | Device | Wants |
| --- | --- | --- | --- |
| **Regular customer** (most Point customers today are walk-ins — review §1 #2) | Facebook page, Viber message, TikTok profile link, Google Maps, the QR code in the shop | Mid-range Android phone, mobile data (variable 4G) | Address, opening hours, "open now?", phone number; increasingly: book a time with a chosen barber |
| **New customer** | Google search ("barber South Dagon"), a friend's shared link | Phone | Where, how much, is it good, can I book |
| **Customer with a booking** | The manage link they saved (from the confirmation page or sent by staff via Viber) | Phone | See, reschedule or cancel the booking |
| **Home-service customer** | Facebook / phone call → link | Phone | Book a barber to come home; know the transport fee (D-BKG-22, D-SVC-06) |

Language: Myanmar first, English available on every page (🔒 D-PLT-03). No account, nothing sent to the customer (🔒 D-CUS-04/05).

### 1.2 What the business needs from the site

1. **Accurate, automatic branch information** — address, hours, closures, phone — that changes the moment admin saves it (🔒 D-WEB-01, D-WEB-03/04).
2. **Online bookings with less friction than a phone call** — online booking is 0% today (live Fresha data); the site has to earn that habit.
3. **Good link previews** on Facebook, Viber and TikTok (owner 01/Oct) and findability on Google (review §5.8).
4. **No spam bookings** without adding OTP (🔒 D-BKG-21: captcha + loose rate limit).

### 1.3 UX goals

| ID | Goal | Target |
| --- | --- | --- |
| FE-GOAL-01 | Find a branch's address, today's hours and phone from the home page | ≤ 1 tap / visible without scrolling on a 360 px screen for the first branch |
| FE-GOAL-02 | Book 1 service at a QR-linked branch with a chosen barber (in the booking modal) | ≤ **60 s**, ≤ 8 taps + typing name and phone |
| FE-GOAL-03 | Customers who reach the confirmation page and **save the manage link** (copy / share / calendar) | Track in the pilot (⚠️ only if analytics is approved — FE-QA-04) |
| FE-GOAL-04 | Core Web Vitals on mid-range Android over 4G (p75) | LCP ≤ 2.5 s · INP ≤ 200 ms · CLS ≤ 0.1 |
| FE-GOAL-05 | Every page complete and unclipped in Myanmar and English at 320 px | 100% |

---

## 2. Laws of UX → rules for the public website

All 30 laws from [lawsofux.com](https://lawsofux.com/), applied to the customer side.

| # | Law | Essence | How it applies to the Point website and the booking modal | Rules |
| --- | --- | --- | --- | --- |
| 1 | [Aesthetic-Usability Effect](https://lawsofux.com/aesthetic-usability-effect/) | Pleasing design is perceived as more usable | The first impression from a Facebook/Viber/TikTok link decides whether people trust booking online instead of calling. Real branch photos, a minimalist and clean layout (owner), consistent brand tokens, restrained modern motion. Still test with real customers — polish hides problems | FE-VIS-01, FE-VIS-07, FE-QA-03 |
| 2 | [Choice Overload](https://lawsofux.com/choice-overload/) | Too many options overwhelm; help narrow them | 31 services in 4 categories (live): category chips + "Popular" first. Barbers: only those eligible and working. Dates: only the booking window. Option combinations not sold are hidden | FE-BK-05, FE-BK-07 |
| 3 | [Chunking](https://lawsofux.com/chunking/) | Group information into meaningful units | Booking in 5 short steps; hours as a weekly table; services by category; phone shown in groups | FE-BK-03, FE-BR-03 |
| 4 | [Cognitive Bias](https://lawsofux.com/cognitive-bias/) | Defaults and framing steer decisions | Honest defaults: "At the shop" preselected, first available date preselected. No dark patterns (no fake "only 1 slot left", no pre-ticked extras). Full price incl. transport fee before confirming | FE-BK-08, FE-BK-10, FE-COPY-03 |
| 5 | [Cognitive Load](https://lawsofux.com/cognitive-load/) | Keep only what the task needs | One decision per mobile screen. No sign-up, no OTP — name + phone only (D-BKG-10). Nothing on screen that doesn't help the current step | FE-BK-01, FE-BK-09 |
| 6 | [Doherty Threshold](https://lawsofux.com/doherty-threshold/) | Respond within 400 ms; use perceived performance | Availability answers in < 400 ms or shows slot skeletons; "+ Add" reacts instantly; the next step's data is prefetched | FE-PERF-03, FE-PERF-04 |
| 7 | [Fitts's Law](https://lawsofux.com/fittss-law/) | Big, close, well-spaced targets | Time slots and service "+" buttons ≥ 48 px; the Continue button is sticky at the bottom (thumb zone); Call and Directions are large buttons on branch cards | FE-CMP-01, FE-BK-13 |
| 8 | [Flow](https://lawsofux.com/flow/) | Remove friction, give feedback | A guided path with no dead ends; errors keep every selection; no forced account; the booking modal opens on top of the page the visitor is already on, and nothing else (promos, cookie banners) interrupts it | FE-BK-00, FE-BK-11 |
| 9 | [Goal-Gradient Effect](https://lawsofux.com/goal-gradient-effect/) | Show progress toward the goal | Step indicator "Services › Barber › Time › Details › Confirm"; the summary fills up as choices are made | FE-BK-14 |
| 10 | [Hick's Law](https://lawsofux.com/hicks-law/) | Fewer choices, recommended option highlighted | Few choices per step; "next available time" highlighted; Shop/Home appears only when the branch offers home service | FE-BK-04, FE-BK-08 |
| 11 | [Jakob's Law](https://lawsofux.com/jakobs-law/) | Work like the sites people already know | The common booking order (Services → Barber → Time → Details → Confirm, same as Fresha's public flow), a standard site header/footer, tap-to-call, map directions | FE-BK-03, FE-GLB-01 |
| 12 | [Law of Common Region](https://lawsofux.com/law-of-common-region/) | A boundary groups things | Branch, service and barber cards; the booking summary as its own panel / bar | FE-CMP-02 |
| 13 | [Law of Proximity](https://lawsofux.com/law-of-proximity/) | Near = related | Price and duration next to the service name; Call and Directions inside the branch card; errors right under the field | FE-CMP-03, FE-BK-09 |
| 14 | [Law of Prägnanz](https://lawsofux.com/law-of-pr%C3%A4gnanz/) | Simplest interpretation wins | Simple layouts, no busy image behind text, a directions button instead of a heavy embedded map above the fold | FE-VIS-03, FE-BR-04 |
| 15 | [Law of Similarity](https://lawsofux.com/law-of-similarity/) | Similar look = similar function | All tappable cards and slots share one style; selected state identical everywhere; every "Book" CTA looks the same; links look like links | FE-CMP-01 |
| 16 | [Law of Uniform Connectedness](https://lawsofux.com/law-of-uniform-connectedness/) | Connected = related | Stepper connectors; chosen services listed as one connected sequence in the summary (back-to-back, D-BKG-03) | FE-BK-13 |
| 17 | [Mental Model](https://lawsofux.com/mental-model/) | Match what people already believe | Booking should feel like messaging the shop: what, who, when, your name and phone. "Pay at the shop". The manage link is "your ticket" | FE-CONF-02, FE-COPY-02 |
| 18 | [Miller's Law](https://lawsofux.com/millers-law/) | Chunk; don't impose arbitrary limits | Categories as chips; time slots grouped Morning / Afternoon / Evening; ≤ 5 steps | FE-BK-08 |
| 19 | [Occam's Razor](https://lawsofux.com/occams-razor/) | Remove what isn't needed | V1 = Home, Branch, Book, Manage. No blog, no accounts, no reviews, no marketplace | FE-IA-01 |
| 20 | [Paradox of the Active User](https://lawsofux.com/paradox-of-the-active-user/) | Nobody reads instructions first | A 3-step "How booking works" strip on the home page; hints inside the flow (option picker hint, link-saving hint) instead of help pages | FE-HOME-04, FE-BK-06 |
| 21 | [Pareto Principle](https://lawsofux.com/pareto-principle/) | Most value comes from a few features | Most visits want address, hours, phone, Book. Put those first on home and branch pages; optimise for phones | FE-HOME-02, FE-BR-02 |
| 22 | [Parkinson's Law](https://lawsofux.com/parkinsons-law/) | Autofill shortens tasks | `autocomplete` on name/phone/address, branch prefilled from the QR link, first available date preselected, only two required fields | FE-BK-09 |
| 23 | [Peak-End Rule](https://lawsofux.com/peak-end-rule/) | Peak and end moments are remembered | The confirmation page is both peak and end — nothing is sent afterwards — so it must be clear, reassuring and help save the link. Cancelling is respectful and easy | FE-CONF-01..04, FE-MNG-04 |
| 24 | [Postel's Law](https://lawsofux.com/postels-law/) | Accept liberally, output strictly | Phone in any format; Zawgyi input converted to Unicode; `?branch=b3` matched case-insensitively; bare URLs redirect to the right language; old `/book?branch=` links keep working by opening the modal | FE-BK-09, FE-IA-03, FE-BK-00 |
| 25 | [Selective Attention](https://lawsofux.com/selective-attention/) | Banner blindness; change blindness | Announcements and closure notices must not look like ads; closure notices look different from promos; one emphasised CTA per view | FE-GLB-03 |
| 26 | [Serial Position Effect](https://lawsofux.com/serial-position-effect/) | First and last are remembered | Header nav: Branches first, **Book** last (as the CTA); contact details close the page in the footer | FE-GLB-01 |
| 27 | [Tesler's Law](https://lawsofux.com/teslers-law/) | The system carries the complexity | The system computes availability, branch / option / home prices, transport fee and travel time; the customer only picks | FE-BK-06, FE-BK-15 |
| 28 | [Von Restorff Effect](https://lawsofux.com/von-restorff-effect/) | The different item stands out | "Book now" is the single most prominent element on every page; "Open now" / "Closed today" stand out with icon + text | FE-CMP-01, FE-BR-02 |
| 29 | [Working Memory](https://lawsofux.com/working-memory/) | Don't make people remember | The summary is always visible; the review step repeats everything; the confirmation repeats it again | FE-BK-13, FE-BK-10 |
| 30 | [Zeigarnik Effect](https://lawsofux.com/zeigarnik-effect/) | Unfinished tasks pull people back | Visible progress; a half-finished booking is restored if the visitor comes back in the same browser session | FE-BK-12 |

---

## 3. Visual foundation

**FE-VIS-01 · One token file, the site's own colours — theme "minimalist and clean".** 🔒 owner 01/Oct (theme) + 🔒 owner 02/Oct (palette — D-UX-02 v5.2.16) + ⚠️. Use the shared token **names** (admin §3.1–§3.3, one `packages/ui/tokens.css`); the `site` tree overrides the **colour** tokens with the website palette below and the font tokens (FE-VIS-02). The admin app keeps its own values (neutral scaffolding until the owner gives the admin palette — AD-VIS-03). Components never use a raw hex value or a Tailwind palette class (AD-VIS-01). **Theme = minimalist and clean** (owner): generous white space, one accent colour, flat surfaces, few borders, large photography, short copy, no decorative shapes or gradients, no 3D objects. **Design reference images** are in `point-barber/design-reference/website/` with a `README.md` index (image → page / section); Claude Code opens the indexed image before building that page and matches spacing / composition from it. An image is a reference, never a rule: where it disagrees with a rule of this file or a 🔒 decision, stop and ask (D-UX-01 precedence, D-PLT-13); a rule the owner changes because of an image is recorded here as a new version note. No invented colour or logo — anything not in FE-VIS-01a stays on the neutral scaffolding value.

**FE-VIS-01a · Website colour tokens (v1.5; complete in v1.7).** 🔒 every row. The first four rows are the owner's palette (02/Oct/2026 morning); the others were proposed by this guideline (owner sheet B1 = "brand colours from me, the rest proposed for approval") and **approved by the owner on 02/Oct/2026 13:46 (REC-41 ✅)**. All of them are the `site` tree's values in `packages/ui/tokens.css`, built by `add-shared-ui-components`. A token this table does not list keeps the shared value (AD-VIS-03).

| Token (in the `site` tree) | Value | Source | Contrast (WCAG 2.1) |
| --- | --- | --- | --- |
| `--background` | `#EEEEEE` | 🔒 owner — "Background" | – |
| `--foreground` | `#000000` | 🔒 owner — "Text" | 18.10 : 1 on `--background` |
| `--decoration` (new semantic token — site only) | `#DC5F00` | 🔒 owner — "Decoration" | 3.19 : 1 on `--background` — large text and non-text only (FE-VIS-01b) |
| `--primary` / `--primary-foreground` | `#000000` / `#FFFFFF` | 🔒 owner (sheet 2 #2 — "ခလုတ် = အမည်း + စာဖြူ") | 21.00 : 1 |
| `--ring` | `#000000` | 🔒 owner 02/Oct 13:46 (REC-41 ✅; follows `--primary`) | 18.10 : 1 on `--background` |
| `--card` / `--card-foreground` | `#FFFFFF` / `#000000` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 21.00 : 1 |
| `--muted` / `--muted-foreground` | `#E0E0E0` / `#555555` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | `#555555`: 6.43 : 1 on `--background`, 5.65 : 1 on `--muted` (the neutral `#737373` was 4.09 : 1 on `#EEEEEE` — below 4.5 : 1) |
| `--border` | `#C4C4C4` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | decorative divider (no contrast requirement) |
| `--input` | `#707070` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 4.27 : 1 on `--background`, 4.95 : 1 on white (≥ 3 : 1 for input borders) |
| `--secondary` / `--secondary-foreground` | `#FFFFFF` / `#000000` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 21.00 : 1 |
| `--accent` / `--accent-foreground` | `#E0E0E0` / `#000000` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 15.91 : 1 |
| `--destructive` / `--destructive-foreground` | `#C8281B` / `#FFFFFF` | 🔒 owner 02/Oct 13:46 (REC-41 ✅; reads as red — D-UI-01) | 4.79 : 1 on `--background`, white on it 5.56 : 1 · lightness L\* 44 |
| `--success` / `--success-foreground` | `#0E4A28` / `#FFFFFF` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 8.92 : 1 on `--background`, white on it 10.35 : 1 · lightness L\* 27 |
| `--warning` / `--warning-foreground` | `#6A3A00` / `#FFFFFF` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 8.16 : 1 on `--background`, white on it 9.47 : 1 · lightness L\* 30 |
| `--info` / `--info-foreground` | `#0B5CAD` / `#FFFFFF` | 🔒 owner 02/Oct 13:46 (REC-41 ✅) | 5.75 : 1 on `--background`, white on it 6.67 : 1 · lightness L\* 39 |

*Notes to the table (v1.7).* (1) **Lightness, not only hue** (admin AD-VIS-04): the red is clearly lighter (L\* 44) than the green (L\* 27) and the brown (L\* 30) — red against green is 1.86 : 1, red against brown 1.70 : 1 — and a status is always told by icon + text as well (AD-A11Y-03). (2) **Focus outline and input border.** With the approved values the website's focus outline is 2 px `var(--ring)` (`#000000`, 18.10 : 1) and its input border is `var(--input)` (`#707070`, 4.27 : 1 on `#EEEEEE`, 4.95 : 1 on a white card) — the interim of owner S15 (v1.6: outline in `--foreground`, border in `--muted-foreground`) has ended for the website and stays only in the staff app, whose palette is not given yet (admin AD-VIS-03). (3) No value of this table is below its target on `#EEEEEE`: body text 18.10 : 1, muted text 6.43 : 1, error text 4.79 : 1, the status colours 5.75–8.92 : 1. (4) `--destructive` on a `--muted` fill is 4.21 : 1, so a danger badge on the website is drawn as an outline on `--background` / `--card`, not on a muted fill.

**FE-VIS-01b · Where the decoration colour may be used.** 🔒 owner (sheet 2 #2) + WCAG 2.1 AA (AD-VIS-04). `#DC5F00` on `#EEEEEE` is 3.19 : 1 and white on `#DC5F00` is 3.70 : 1 — both below the 4.5 : 1 needed for normal text. So `--decoration` is used for: section accents, lines and shapes, icons, the active / hover accent, and **large** headings (≥ 24 px regular or ≥ 19 px bold — 3 : 1 is enough). It is **never** used for body text, links inside text, form labels, error text or small captions, and never as a button background with white text. `--decoration` icons, lines and large headings sit only on `--background` or `--card` — never on `--muted` / `--accent` (on the proposed `#E0E0E0` it would be 2.80 : 1). Text placed on a `--decoration` surface is `#000000` (5.68 : 1). Buttons and other primary actions are `--primary` (black) with white text.

**FE-VIS-02 · Typography.** 🔒 owner 01/Oct (font families — OPEN-31 ✅) + ⚠️ (scale and rules). Same scale and Myanmar line-heights as admin AD-VIS-06. Public headings may use one step larger sizes (hero title `text-3xl` on mobile, up to `text-5xl` on desktop), still with Myanmar line-height ≥ 1.5 × font size. Body text ≥ 16 px. Inputs ≥ 16 px (no iOS zoom).

The public site has its **own Latin font tokens** (scoped to the `(site)` route group; the admin app keeps Manrope / Inter — admin §3.2). The Myanmar font is the same everywhere.

| Token | Value (owner 01/Oct) | Used for | Notes |
| --- | --- | --- | --- |
| `--font-display` | **Archivo Black** (Google Fonts, OFL, single weight 400) | Hero title, section headings, big numbers in the hero — **Latin text only** | Display face: never for body text, buttons, forms or anything under 24 px; never for Myanmar text (it has no Myanmar glyphs — see below) |
| `--font-sans` | **Roboto** (400 / 500 / 700) | All other Latin text: body, buttons, forms, cards, footer | Tabular figures for prices / times via `font-variant-numeric: tabular-nums` (Roboto supports `tnum`) |
| `--font-myanmar` | **Pyidaungsu** (Regular / Bold) | All Myanmar text, including Myanmar headings | Myanmar Unicode; listed first in the stack when the locale is `my`. Headings in Myanmar use **Pyidaungsu Bold**, not Archivo Black |

- Stacks: `en` → `'Roboto', 'Pyidaungsu', system-ui, sans-serif`; `my` → `'Pyidaungsu', 'Roboto', system-ui, sans-serif`; headings `en` → `'Archivo Black', 'Roboto', sans-serif`; headings `my` → `'Pyidaungsu', sans-serif` with weight 700.
- Archivo Black is wide and heavy: use `text-3xl`–`text-5xl` only, line-height 1.1, letter-spacing 0 to −0.01 em, never uppercase-transformed Myanmar (AD-L10N-04), max 2 lines in the hero on mobile.
- Self-hosted WOFF2 (FE-PERF-06). Archivo Black and Roboto are OFL / Apache-licensed; Pyidaungsu is distributed free by the Myanmar Unicode / government programme — ⚠️ keep a copy of each licence file in `packages/ui/fonts/` (AD-VIS-05 self-host requirement).
- AD-VIS-05 checks for Pyidaungsu (weights 400 + 700 present, stacking of `ကြိုတင်ချိန်းဆိုမှု` / `ဝန်ဆောင်မှုပေးခြင်း` correct) are done once, in the admin font check, and reused here.

**FE-VIS-03 · Imagery.** ⚠️ Real photos of Point branches and work (cover image, service images, barber photos when public profile is on). No stock photos of other shops. Never place body text over a busy photo; hero text sits on a solid or darkened overlay that keeps contrast ≥ 4.5 : 1. Recommended sizes (enforced in the admin uploader, AD-WEB-03): cover 1920 × 1080, share image 1200 × 630, service 1200 × 900, barber photo square ≥ 600 × 600.

**FE-VIS-04 · Icons.** ⚠️ `lucide-react`, same as admin; common icons: map-pin (address), clock (hours), phone (call), navigation (directions), scissors (services), home (home service), calendar (booking), check-circle (confirmed), alert-triangle (closure).

**FE-VIS-05 · Layout.** ⚠️ Mobile-first at 360 px (test 320 px). Content max-width ~1120 px on desktop. The booking flow lives in a **modal** (FE-BK-00): on desktop a centred dialog (max-width 1040 px, max-height 90 vh) with a two-column layout inside it (steps left, summary right — Fresha pattern `evidence/booking/public-05-professional.png`); on mobile a full-screen sheet with a single column + sticky summary bar.

**FE-VIS-06 · Light theme only in V1.** ⚠️ Token-ready for dark later.

**FE-VIS-07 · Motion.** 🔒 owner 01/Oct (libraries, no 3D) + ⚠️ (rules). The site should feel modern through **motion, not 3D**:
- Libraries: **Motion** (`motion` / `motion/react` — component enter/exit, layout and gesture animations, the booking modal and step transitions) and **GSAP** (scroll-triggered timelines on the home page — ScrollTrigger, hero reveal). **No 3D objects**, no WebGL / Three.js / Spline, no particle backgrounds, no Lottie-heavy scenes.
- Where: hero (title + subtitle + CTA staggered reveal ≤ 600 ms total), sections fading / sliding in once on scroll (`y: 16 px → 0`, 300–400 ms, ease-out), cards lifting 2–4 px on hover (desktop), the open-status pill, the booking modal (scale 0.98 → 1 + fade 200 ms; sheet slides up on mobile), step changes inside the modal (slide 150–200 ms), "Copied" / "Added" feedback (AD-VIS-09 timings).
- Never: intro loaders or splash screens, animations that delay the first branch card or the Book CTA (FE-GOAL-01), autoplaying carousels, parallax on images, continuous looping motion on working screens, anything over 600 ms, animating layout size of text containers (CLS — FE-PERF-01).
- **Myanmar text is animated only as whole blocks.** Never split Myanmar text into characters or words (GSAP SplitText / per-character stagger) — splitting breaks the shaping of stacked vowels and medials. Latin headings may use line-level splits only.
- `prefers-reduced-motion`: all GSAP timelines and Motion variants fall back to simple fades or no motion (FE-A11Y-06). Motion is applied progressively: the page is complete and readable with JavaScript disabled or before it loads (server HTML — FE-SEO-06).
- Performance: animation libraries are loaded only on pages that use them, after the page is interactive (dynamic import), and count against the budget in FE-PERF-01 / FE-PERF-08.

---

## 4. Information architecture, URLs and navigation

**FE-IA-01 · Pages (V1).** ⚠️ Structure from review §5.8 (REC-35) + 🔒 D-BKG-01, D-WEB-01..04. Occam: only these.

| Route (per locale) | Page | Main data | Rendering |
| --- | --- | --- | --- |
| `/` | Home | `companies`, `branches` (public), `branch_opening_hours`, `branch_closures`, `services` (`show_on_website`), `employees` (`public_profile`), `site.*` | Server-rendered, cached with tag revalidation (§8) |
| `/branches/[code]` | Branch page | branch + hours + closures + services & prices sold there + public barbers | Server-rendered, cached |
| `/book`, `/book?branch=<code>`, `/book?branch=<code>&barber=<id>` | **Booking entry links** — render the home page (or the branch page when `?branch=` is valid) **with the booking modal already open** (FE-BK-00). These URLs stay forever because they are printed on QR posters and shared on social media (🔒 D-BKG-01, D-WEB-02) | Public read-only API + live availability | Server-rendered page shell (cached) + client modal; **availability never cached** |
| `/booking/[token]` ⚠️ name | Manage booking — also the **confirmation page** right after booking (`?new=1`, FE-CONF-01) | The booking behind the token | Dynamic, `noindex` |
| `/404`, error, maintenance | System pages | – | Static |

A separate `/services` page is not needed in V1: prices differ per branch (live: 6,000 / 7,000 / 8,000 for the same cut), so prices belong on branch pages and in the booking modal. There is **no separate booking page** either (owner 01/Oct): the booking flow is a modal / pop-up opened on top of whatever page the visitor is on; `/book` exists only as an entry URL.

**FE-IA-02 · Language in the URL.** ⚠️ Every page exists under `/my/…` and `/en/…` (locale codes per D-PLT-03 language files `my` / `en`). Bare paths (`/`, `/book`, `/branches/B3`) **redirect (307) to the visitor's language**: cookie from a previous switch, otherwise the system default language setting — **keeping the query string**. This keeps every printed QR link `/book?branch=<code>` working forever (🔒 D-BKG-01) while giving search engines one URL per language (hreflang, FE-SEO-04).

**FE-IA-03 · Forgiving URLs.** ⚠️ Postel. Branch codes match case-insensitively (`?branch=b3` = `B3`); an unknown or inactive code opens the modal at the branch step with a short note ("We couldn't find that branch — please choose one"). A branch with `is_public = false` is hidden from lists and the sitemap, but its booking link still works (DB Part 8; API Part 3 P3-RULE-10 — the booking endpoints accept any active branch; API Part 8 P8-RULE-13). An unknown `barber=` id is ignored silently (the barber step is shown as usual).

**FE-IA-04 · Header navigation.** ⚠️ Logo (links home) · **Branches** · (optional **Services** anchor on the home page) · language switch · **Book** (primary CTA, last position — Serial Position; opens the booking modal). On mobile: logo, language switch, "Book" button; Branches link inside a simple menu. No mega-menus.

**FE-IA-05 · Language switch.** 🔒 D-PLT-03 + ⚠️. Text labels "မြန်မာ | EN" (no flags). Switching keeps the current page and booking selections (also inside the open modal), sets the cookie, and updates `<html lang>`.

**FE-IA-06 · Footer.** 🔒 D-WEB-03 + ⚠️. Company name and logo, each public branch (name, short address, phone as `tel:` link), social links from `companies.social_links` — **Facebook, TikTok, Viber** and any others the admin enters (owner 01/Oct: TikTok is a main channel) — language switch, copyright. **Never staff phone numbers or emails** (Part 1 website rule).

**FE-IA-07 · Deep links from outside.** ⚠️ Every branch card and branch page has a "Book at this branch" link to `/book?branch=<code>`; every public barber card has "Book with <name>" → `/book?branch=<code>&barber=<employee_id>` (FE-HOME-05); admin can print the branch link as a QR (AD-QR-01). Links shared on Facebook / Viber / TikTok must open straight into the right step of the modal without extra choices.

---

## 5. Page specifications

### 5.1 Global elements

**FE-GLB-01 · Header.** ⚠️ See FE-IA-04. Sticky on scroll (compact height 56 px on mobile). The Book CTA is the only filled primary button in the header.

**FE-GLB-02 · Announcement bar.** 🔒 Part 8 `site.announcement` (MM/EN text + start/end date) + ⚠️. Shown above the header only between its start and end dates (MMT). Neutral/info style, one line (expands on tap), dismissible for the session. Text only — no images, no blinking (Selective Attention: must not look like an ad).

**FE-GLB-03 · Closure notices.** 🔒 D-WEB-04, `branch_closures` (required MM notice, optional EN) + ⚠️. A closure is shown **on the affected branch card and branch page**, and on the home page as a banner when it is current or starts within the next 7 days: "Branch 2.0 is closed 13/Apr/2027 – 16/Apr/2027 · Thingyan holidays". Warning tone with an alert icon, **not dismissible**, visually different from the announcement bar. In the booking modal, closed dates can't be picked (FE-BK-08).

**FE-GLB-04 · Consistent CTA.** ⚠️ Every "Book" button in the site uses the same component and wording. It is a real link whose `href` is `/book` (with `?branch=` and `?barber=` when the context has them — works without JavaScript and for crawlers); with JavaScript it **opens the booking modal in place** (FE-BK-00) and pushes the same query onto the current URL instead of navigating.

### 5.2 Home page `/`

**FE-HOME-01 · Order of sections (mobile).** ⚠️
1. **Hero:** cover image (`site.cover_attachment_id`), `site.hero_title` / `hero_subtitle` (MM/EN), buttons **Book now** (primary — opens the modal) and **Find a branch** (secondary, scrolls to branches).
2. **Branches** (FE-HOME-02).
3. **How booking works** (FE-HOME-04).
4. **Services** overview (FE-HOME-03).
5. **Our barbers** — only when `site.show_barbers` is on (FE-HOME-05); on desktop this section may sit above Services if the owner's design reference puts it there (★).
6. Social links (Facebook, TikTok, Viber …), footer.

**FE-HOME-02 · Branch cards.** 🔒 D-WEB-01/03/04 + ⚠️ Pareto. One card per public branch: name, short address, **today's status** ("Open now · closes 8:00 PM" / "Closed now · opens 9:00 AM tomorrow" / "Closed today — <closure notice>" — **v1.4:** computed in the browser from the branch's `hours`, `closures` and `server_time`, so a cached page is never stale — FE-BR-02; API Part 8 P8.PUB.01 returns no status string), and three large buttons: **Call** (`tel:`), **Directions** (`map_url`, else a maps link from lat/long), **Book** (`/book?branch=<code>`). The whole card also links to the branch page. The first card is visible without scrolling on a 360 × 740 screen (FE-GOAL-01), so the hero is short on mobile.

**FE-HOME-03 · Services overview.** 🔒 `services.show_on_website` + ⚠️. Categories with a few services each (name, short public description, duration). **No prices on the home page** — they differ per branch; each item says "Prices by branch" and links to the branches. (`site.show_prices` is **OFF until the owner turns it on** from the admin panel — OPEN-21 ✅ 01/Oct; while off, branch pages hide prices too — FE-BR-03. The booking modal always shows prices — FE-BK-05.)

**FE-HOME-04 · How booking works.** ⚠️ Paradox of the Active User. Three short steps with icons: "Choose service and barber → Pick a time → Enter your name and phone. Pay at the shop." One line under it: "No account needed. We don't send SMS — you'll get a link to manage your booking."

**FE-HOME-05 · Our barbers — one card per barber, direct booking.** 🔒 owner 01/Oct + Part 8 (`site.show_barbers`, default OFF; `employees.public_profile`, default OFF — both stay OFF until the owner switches them on in the admin panel, OPEN-21 ✅). Only barbers with a public profile, only when the site toggle is on. Each card:
- **Photo** (square ≥ 600 px, FE-VIS-03; initials placeholder if none), **display name** (`name_mm` / `name_en` per D-DB-04).
- **Current branch** (owner): the branch of the barber's shift **today** (MMT, from `schedule_shifts`), shown as "Today at Branch 3.0"; **v1.4:** on a split day both branches are shown in shift order — "Today at 1.0 (AM) · 3.0 (PM)" (API Part 8 P8.PUB.04 `today_branches[]`, one entry per branch with its shift times); if they have no shift today, "Off today · usually at Branch 1.0, Branch 3.0" (their active assignments — `branches[]`). ⚠️ The home page cache is revalidated after the nightly shift generation and whenever a shift or branch assignment is edited (tag `barbers`, FE-PERF-02).
- **Description** (owner): `employees.public_specialty_mm` / `_en` (≤ 200 characters — the only public text field the DB has; clamp to 3 lines with "More"). ⚠️ If the owner wants a longer bio, that is a Part 1 column change — not assumed here.
- **Rating** (owner 01/Oct, OPEN-37 ✅): **for V1 the rating is given by the admin / manager** (`employees.public_rating`, 1.0–5.0 in half steps, DB Part 1 v3.4; entered on the employee's Profile tab — admin AD-EMP-02); **customer ratings come in V2** (new decision + tables; the card then switches source). Display: ★ icons + the number (`4.5`) and a small caption **"Point rating"** / "Point ရဲ့ သတ်မှတ်ချက်" — ⚠️ the caption is required so visitors don't read it as customer reviews (FE-COPY-03 honesty); never show a review count or "customers say". Rating empty (NULL) → the row is simply omitted. Half stars render as a half-filled icon; stars are decorative with the number as the accessible text (`aria-label="Point rating 4.5 of 5"`).
- **Book with <name>** (primary button on the card; also the whole card is tappable) → opens the booking modal with the branch = current branch (or the first of their branches) and the barber preselected (`/book?branch=<code>&barber=<id>`, FE-IA-07). The branch stays changeable in the modal ("Change").
- **Never phone or email.** Cards are a horizontal scroll on mobile (snap, 1.2 cards visible) and a 3–4 column grid on desktop; ≤ 12 barbers shown, ordered by `employees.employee_code` unless the admin sets an order later.

**FE-HOME-06 · Freshness.** 🔒 D-WEB-01. Content comes from the same DB as admin and refreshes via revalidation seconds after an admin saves (review §5.8, REC-35). Nothing on the site is hand-maintained.

### 5.3 Branch page `/branches/[code]`

**FE-BR-01 · Header block.** ⚠️ Branch name, full address (MM/EN), status line (as FE-HOME-02), and the three buttons Call / Directions / **Book at this branch** (opens the modal with this branch preselected). On mobile, a sticky bottom bar keeps "Book at this branch" visible.

**FE-BR-02 · Opening hours.** 🔒 D-WEB-04 `branch_opening_hours` + ⚠️. A 7-row table (Mon–Sun), today's row highlighted, "Closed" for closed days, times in 12-hour format (`9:00 AM – 8:00 PM`). The "Open now" status is computed in **MMT** from hours and closures (never from the visitor's device time zone). **v1.4 (API Part 8 P8-RULE-13, P8.PUB.01 / 03):** it is computed **in the browser** from `hours`, `closures` (current + starting within 60 days) and `server_time` (MMT), so a cached page never shows a stale "Open now"; the API returns no status string. Status uses icon + text + tone (Von Restorff, accessible).

**FE-BR-03 · Services and prices.** 🔒 `branch_services`, `service_prices`, `site.show_prices`, D-SVC-05/06 + ⚠️.
- Services sold at this branch with `show_on_website`, grouped by category: name, public description, duration.
- **Prices only when `site.show_prices` is on** (OPEN-21 ✅ — default OFF, the owner turns it on from Website › Site content when ready). Simple services: one price. **Option services** (dye, perm): an expandable small table of the option grid (e.g. Colour × Length) showing only combinations sold here — no vague "from" prices.
- If home service is offered here: a note "Home service available · home prices + transport fee apply" (no numbers unless prices are shown).
- Each service has "Book" → opens the modal with this branch and that service preselected.

**FE-BR-04 · Map.** ⚠️ Prägnanz + performance. A "Directions" button is enough; an embedded map (if any) loads lazily below the fold on user tap ("Show map"), never on page load.

**FE-BR-05 · Barbers at this branch.** 🔒 as FE-HOME-05 (same card, same "Book with <name>"), filtered to barbers assigned to this branch; "Current branch" on these cards reads "Today here" / "Not here today".

**FE-BR-06 · Structured data.** 🔒 review §5.8 SEO + ⚠️. Each branch page outputs schema.org `HairSalon` JSON-LD (FE-SEO-03).

### 5.4 Booking flow — the booking modal

**FE-BK-00 · The booking flow is a modal, not a page.** 🔒 owner 01/Oct ("`/book` မထားဘဲ Modal Box / Pop Up Box") + 🔒 D-BKG-01 / D-WEB-02 (links and QR must keep working) + ⚠️ mechanics.
- **Container.** `BookingModal`: desktop = centred dialog, max-width 1040 px, max-height 90 vh, two columns (steps left, summary right — FE-BK-13), scrim behind it, page scroll locked; mobile (< 768 px) = **full-screen sheet** sliding up, sticky header (step indicator FE-BK-14 + close ✕) and sticky bottom summary bar. Motion per FE-VIS-07 (200 ms).
- **Opened from** every Book CTA (header, hero, branch cards, branch page, service rows, barber cards) **on top of the current page** — the visitor never leaves the page they were reading (Flow). Preselections come from the CTA: branch, service, barber.
- **Entry URLs keep working.** `/book`, `/book?branch=<code>`, `/book?branch=<code>&barber=<id>` (printed QR posters, Facebook / Viber / TikTok links) render the home page — or the branch page when `?branch=` is valid — **with the modal already open** at the right step. The bare-path language redirect (FE-IA-02) keeps the query string.
- **URL state.** While the modal is open, the current page's URL carries `?book=1&branch=…&svc=…&opt=…&barber=…&loc=shop|home&date=…&time=…` (FE-BK-12), so Back closes the modal (one history entry per open, not per step — steps use `replaceState`), refresh reopens it with the selections, and the link can be shared.
- **Closing.** ✕, Esc, scrim tap or Back closes it. If the visitor has made selections or typed details: "Leave booking? Your selections are kept for this visit — Keep booking / Leave" (AD-FORM-08 pattern). Selections are restored on the next open in the same session (FE-BK-12).
- **Accessibility.** `role="dialog"` + `aria-modal="true"`, labelled by the step heading; focus moves into the modal on open, is trapped inside, and returns to the CTA on close; each step change moves focus to the new step heading (FE-A11Y-03). On mobile the sheet is the whole viewport, so screen-reader order equals visual order.
- **After "Confirm booking"** the modal does **not** show the confirmation — the browser navigates to the confirmation page `/booking/[token]?new=1` (FE-CONF-01). Reason: the manage link is the only record the customer gets (🔒 D-BKG-11, D-CUS-05); a modal can be closed by accident, a page URL survives refresh, Back and bookmarking.
- **No JavaScript / crawler fallback.** The CTA `href` is the entry URL; the server-rendered `/book` route carries its own `<title>` / OG tags ("Book a haircut — Point Barbershop", FE-SEO-01) and a short no-JS message with branch phone numbers (FE-BK-16 wording).
- **Code.** The modal is a lazily loaded chunk (dynamic import), prefetched when the page is idle or on first hover / focus of any Book CTA, so the first open is instant (Doherty); budget in FE-PERF-01.

**FE-BK-01 · Principles.** 🔒 D-BKG-01..11, D-BKG-21/22, D-SVC-05, D-CUS-03/05 + ⚠️.
- No account, no OTP, no password: **name + phone** only (D-BKG-10).
- Service, barber and date can be chosen **in any order**, each choice filtering the others (D-BKG-02).
- One barber performs all chosen services back-to-back (D-BKG-03).
- Availability is always live — never cached (review §5.8).
- One decision per screen on mobile; the summary is always visible.
- Nothing is sent to the customer; the confirmation page must do that job (§5.5).
- **Prices are always shown inside the modal** (owner 01/Oct, OPEN-35 ✅ "Option A — booking တင်မှတော့ ဈေးပြရမှာပေါ့"), whatever `site.show_prices` says for the info pages.

**FE-BK-02 · Branch step.** 🔒 D-BKG-01, D-WEB-04 + OPEN-35 (c) ✅. With a valid `?branch=` (or a CTA that carries a branch) the step is skipped (branch shown in the summary with "Change"). Otherwise: list of public branches as cards (name, area, today's status). **Closures** (`branch_closures`): the branch can't be booked **for the closed dates only** — they are disabled in the date strip (FE-BK-08) and the branch card shows the closure notice; if the whole booking window falls inside a closure, the branch card is disabled with the notice. The branch is **not** blocked for the whole closure period (owner 01/Oct — Option A).

**FE-BK-03 · Default order, any order.** 🔒 D-BKG-02 + ⚠️ Jakob / Hick. The guided default is **Services → Barber → Date & time → Your details → Confirm** (the order people know from Fresha and similar sites; `evidence/booking/public-04-services.png`). Any-order is offered without adding a decision:
- On the Services step, two small links: "**Choose a barber first**" and "**Choose a date first**".
- Each row of the summary (Branch, Services, Barber, Date & time) has "Change", which jumps to that step.
- Every step shows only options compatible with what's already chosen (e.g. barber first → only services that barber does here; time first → only barbers free then).
- If a change makes an earlier choice impossible (e.g. new barber isn't free at the chosen time), keep what still works and mark the rest "**Please choose again**" with the reason. Never drop a choice silently.

**FE-BK-04 · Shop or home.** 🔒 D-BKG-22, D-SVC-06, D-SCH-03. A segmented control at the top of the Services step: **At the shop** (default) / **At my home**. Shown only if the branch has any home-eligible service and barber. Choosing Home: service prices switch to home prices, only home-eligible barbers are offered, a transport-fee line appears in the summary, and the address is asked in the details step. Switching back and forth re-applies FE-BK-03 invalidation rules and shows the price change.

**FE-BK-05 · Services step.** 🔒 D-BKG-03, D-SVC-02/05, Part 8 + ⚠️ Choice Overload.
- Category chips (horizontal scroll) with "Popular" first; a search field if > 15 services.
- **All ACTIVE services sold at this branch** appear here (even if `show_on_website` is off — Part 8 rule for `/book`).
- Service card: name, 1–2 lines of public description (expandable), duration, and price for this branch and location. Option services show "Choose options" instead of a price until chosen.
- A "+" button adds the service (becomes ✓ "Added"); several services can be added — **up to 5 per website booking** (v1.3 — owner, Part 3 sheet #8; the 6th "+" is disabled with "Up to 5 services online — call the branch for more"; staff bookings have no limit); they run back-to-back in the order added. The summary shows total duration and total price.
- Prices are **always shown** in the modal (OPEN-35 ✅ owner 01/Oct — D-SVC-05 requires the exact price and duration when choosing an option); `site.show_prices` only affects the info pages.

**FE-BK-06 · Option picker.** 🔒 D-SVC-05 (OPEN-29 ✅). Bottom sheet (mobile) / popover (desktop): group 1 as chips (e.g. Colour), then group 2 (e.g. Length). **Only combinations sold at this branch (and location) are shown.** The chosen cell's exact **price + duration** appear before "Add". Fixed hint text (from D-SVC-05): "Not sure about your length? Pick the closest one — your barber will confirm at the shop."

**FE-BK-07 · Barber step.** 🔒 D-BKG-04/05 + OPEN-35 (b) ✅ (owner 01/Oct — Option A).
- Cards for barbers **assigned to this branch and eligible for all chosen services** (and home-eligible for Home). Card: **display name always**; photo and specialty / description only if their public profile is on (`employees.public_profile`); a helper "Next available: Today 3:15 PM" (⚠️ needs API support). `site.show_barbers` affects the info pages only — inside the modal every eligible barber is listed by name, because the customer must pick one (D-BKG-05).
- First option: "**Any available barber**" → go to Date & time with all eligible barbers' availability combined; after a time is picked, **show the barbers free at that time and let the customer choose one** (D-BKG-05 — a booking always stores a specific barber; the system doesn't auto-assign).
- If only one barber is eligible, preselect them and say so ("Ko Aung does this service at Branch 3.0").
- When the modal was opened from a barber card (`?barber=`), that barber is preselected and the step is shown as done in the summary ("Ko Aung · Change"); if they aren't eligible for a service added later, FE-BK-03's "Please choose again" applies.

**FE-BK-08 · Date and time step.** 🔒 D-BKG-06/07, D-WEB-04, D-LV-04 + ⚠️ Hick / Miller.
- **No minimum lead time** (🔒 D-BKG-23 — owner 01/Oct: a customer at 10:00 may book 10:05 if it is free). The earliest start time offered is the **next slot boundary after now** (MMT) that is free for the chosen barber — with the default 15-minute interval a customer at 10:00 sees 10:15; with a 5-minute interval, 10:05. The booked barber is told in realtime (admin AD-TODAY-04) and the no-show timer runs from the booked time as usual (D-BKG-17).
- **Date strip** covering the advance window (setting, default 14 days, MMT). Each chip: weekday + date + a state: available, "Full" (no free time), "Closed" (**only from `branch_closures`**, with the notice on tap). Weekly opening hours are for display only — availability comes from shifts (F-P8-07), so a day nobody works simply has no times ("Full" / "No times"). Closed and full dates can't be selected. Default selection = the first date with free times.
- **Time slots** for the selected date: only start times that are actually free for the chosen barber(s) and services, at the slot interval (setting, default 15 min), in 12-hour format, grouped **Morning / Afternoon / Evening**. Each slot ≥ 48 px tall.
- After selecting: show the end time ("2:00 – 3:35 PM") and, for home service, a note that the barber travels to you (travel time is handled by the system — D-SCH-03).
- No free time on that date: "No times left on this day" + a button "**Next available: Wed, 07/Oct/2026 10:30 AM**" (Fresha pattern `evidence/booking/new-appt-time-step.png`). No free time in the whole window: "Fully booked for the next 14 days — please call the branch" + Call.

**FE-BK-09 · Your details step.** 🔒 D-BKG-10, D-CUS-02/03, D-BKG-22, D-BKG-21 + ⚠️ Parkinson / Postel.
- **Name** (required, `autocomplete="name"`). Zawgyi input is converted to Unicode (admin AD-FORM-13).
- **Phone** (required, `type="tel"`, `autocomplete="tel"`): accepts `09…`, `+959…`, `959…`, spaces, dashes; shows the formatted number. Validation is the **same as the admin phone input** (AD-FORM-10): a number starting with `0` is treated as Myanmar (+95); any valid E.164 number is accepted (DB rule `^\+[1-9][0-9]{6,14}$`). Error text: "Please check the number (e.g. 09 7xx xxx xxx)."
- **Home only:** address (required, textarea, `autocomplete="street-address"`) + note for the barber (optional, e.g. "3rd floor, blue gate").
- Notice above the button: "We don't send SMS or email. On the next screen you'll get a link to change or cancel your booking — please save it."
- Spam protection: invisible captcha (Turnstile or reCAPTCHA v3 — chosen at build time, D-BKG-21) + a hidden honeypot field (⚠️). A visible challenge appears only if the captcha service asks for one.

**FE-BK-10 · Review and confirm step.** 🔒 D-BKG-12 (price rules), D-SVC-06, D-PAY-09 + ⚠️ Working Memory.
- Everything in one card: branch (name + address), shop/home (+ address), barber, date, start–end time, each service with option, duration and price, transport fee (home), **total**.
- "Pay at the shop — cash or KBZPay" (no online payment in V1).
- Change/cancel policy in one line from the customer cutoff setting ("You can change or cancel online until 2 hours before" — v1.3: default **120 minutes**, owner Part 3 sheet #1; the text follows the setting; D-BKG-12).
- Primary button "**Confirm booking**". Each summary row still has "Change".

**FE-BK-11 · Submitting and errors.** 🔒 D-BKG-08/09/21 + ⚠️ Flow / Peak-End. The button shows a spinner and is disabled while submitting. Errors keep every selection and explain the next step:
| Situation | Message (EN; MM in the language file) | Next step offered |
| --- | --- | --- |
| Slot taken meanwhile (DB exclusion) | "Sorry, that time was just booked." | Nearest free times for the same barber + "See other barbers" |
| Phone already has an active booking (website rule — D-BKG-09) | "This phone number already has an upcoming booking. Use your booking link to change it, or call the branch." (**no details of the existing booking** — D-BKG-09 ⚠️ note) | Call branch |
| Rate limited / captcha failed (D-BKG-21) | "Too many attempts from this connection. Please wait a few minutes or call the branch." | Call branch, retry later |
| Date became closed / service no longer offered | "This branch changed its schedule." | Back to the affected step |
| Price changed meanwhile (`price_changed`, v1.3) | "The price changed just now — please check the new total." | Review step with the new prices (from the error's `context`); Confirm again |
| Network error / no reply | "We couldn't confirm your booking. Check your connection and try again." | Retry with the **same** manage token (v1.3 — ADR-004 / API-IDEM-03: the browser generates the token once per booking attempt and keeps it in session storage until the confirmation page opens; a retry returns the same booking and link — never "time just booked" for your own booking). **Before letting the visitor edit after a network error**, the modal first asks `GET /public/bookings/{stored token}`: 200 → the booking went through → open the confirmation page; 404 → keep editing (a changed request then gets a new token) |
| Same token, different details (`idempotency_mismatch`, v1.3) | (not shown — handled by the check above) | Open the confirmation page of the existing booking |

**FE-BK-12 · Keeping progress.** ⚠️ Zeigarnik / Back button. Selections (branch, location, services + options, barber, date, time) live in the current page's URL query while the modal is open (`?book=1&…`, FE-BK-00) so Back, refresh and sharing work. Name, phone and address are **not** put in the URL; they are kept in memory / session storage for the tab only. Reopening the modal in the same session shows "Continue your booking?" with the saved selections.

**FE-BK-13 · Summary panel.** ⚠️ Desktop: right-hand column inside the modal (Fresha pattern) with branch, chosen services (as a connected list), barber, date/time, total and the primary **Continue** button. Mobile: a sticky bottom bar in the sheet "2 services · 1 h 35 min · 42,000 Ks · **Continue**"; tapping the text opens the full summary as a bottom sheet. The Continue button is disabled until the current step is complete, with the missing item named ("Choose a time").

**FE-BK-14 · Step indicator.** ⚠️ Goal-Gradient. In the modal header: a breadcrumb "Services › Barber › Time › Details › Confirm" (Fresha `evidence/booking/public-04-services.png`); completed steps are clickable; on mobile, a compact "Step 3 of 5 · Time" with a progress bar.

**FE-BK-15 · What the system calculates (never the customer).** 🔒 D-BKG-04, D-SVC-05/06/07/08, D-SCH-03. Availability (shifts − bookings incl. buffer and home travel − leave incl. pending − walk-in visits), price per branch / location / option / date, duration per option cell, buffer, transport fee. The UI shows results and short explanations ("Includes 6,000 Ks transport fee for home service"), never formulas.

**FE-BK-16 · Booking unavailable.** 🔒 D-PLT-08 + ⚠️. In maintenance mode, or if the booking API is down, the modal opens on a single panel "Online booking is temporarily unavailable. Please call the branch." with the branch phone numbers; info pages keep working from cache.

### 5.5 Confirmation page (the only thing the customer takes away)

**FE-CONF-00 · Where it lives.** ⚠️ (consequence of the modal decision, FE-BK-00). The confirmation is a **full page**, not a modal state: after Confirm, the browser navigates to `/{locale}/booking/[token]?new=1` — the manage page (§5.6) in its "just confirmed" state. The URL itself is the manage link, so the customer already has the link in the address bar; refresh, Back and bookmark all keep it. The `?new=1` flag only switches the header and the link-saving card on; it is dropped on the next visit.

**FE-CONF-01 · Content.** 🔒 D-BKG-11, D-CUS-05 + ⚠️ Peak-End.
- A clear success header: ✓ "**Your booking is confirmed**" + date and time in large type.
- Booking card: branch (name, address), shop/home (+ address), barber, services with options, duration, total, "Pay at the shop".
- **Manage-link card** (FE-CONF-02).
- Branch actions: **Directions**, **Call**.
- No automatic redirect, no pop-ups, no promotions.

**FE-CONF-02 · Save the manage link.** 🔒 D-BKG-11 ("lost link can't be recovered") + ⚠️. A highlighted card titled "**Save this link — it's your booking ticket**" with:
- **Copy link** (shows "Copied" feedback),
- **Share** (Web Share API → Viber / Messenger / "send to myself"; hidden where unsupported),
- **Add to calendar** (`.ics` file **generated in the browser** from the booking shown on the page — time, branch address, services and the manage link; nothing is sent by the server, D-CUS-05 — v1.3: REC-36 ✅ owner Part 3 sheet #5; also on the manage page),
- a hint "Or take a screenshot of this page",
- the warning "We can't send this link again. Without it, call the branch to change your booking."

**FE-CONF-03 · Arrival tips.** 🔒 D-BKG-17 + owner Part 3 sheet #4 (v1.3). Two lines from the language file: "Please arrive on time. If you are more than 40 minutes late, the booking is cancelled automatically — you're still welcome as a walk-in." and "Running late? Call the branch." (+ Call button). MM wording in the language file follows the owner's sheet text ("အချိန်မီ လာပါ; ၄၀ မိနစ် ကျော်ရင် booking အလိုအလျောက် ပျက်ပြီး ရောက်လာရင် walk-in အဖြစ် လက်ခံ; နောက်ကျမယ်ဆို ဆိုင်ကို ဖုန်းဆက်").

**FE-CONF-04 · Privacy.** ⚠️ The page is `noindex`, sends no referrer, and shows the phone number masked (`09•••••123`).

### 5.6 Manage booking page (via the link)

**FE-MNG-01 · Route and access.** 🔒 D-BKG-11 (hashed token) + ⚠️. `/{locale}/booking/[token]` (route name ⚠️ proposal; also the confirmation page with `?new=1` — FE-CONF-00). `noindex, nofollow`; `Referrer-Policy: no-referrer`; the token is never sent to analytics or logs in clear text. An unknown or malformed token shows a generic "This booking link isn't valid" page with links to Book and Branches — no hint whether a booking exists.

**FE-MNG-02 · View.** ⚠️ Status (Booked / In progress / Completed / Cancelled — same status words as admin, in customer language), all booking details as in FE-CONF-01, phone masked, branch Call / Directions.

**FE-MNG-03 · Reschedule.** 🔒 D-BKG-12/13/15. "Change booking" opens the booking modal (FE-BK-00) prefilled with the current booking (full edit: date, time, services, options, barber, shop/home). Before confirming, show **old → new** and the price result with its reason ("Same price — only the time changed" / "Price updated because you changed the barber"). The booked barber is notified (staff side). The same link keeps working.

**FE-MNG-04 · Cancel.** 🔒 D-BKG-14/16. "Cancel booking" → a reason from the shop's cancel-reason list (the system "Customer no-show" reason is never offered to customers ⚠️); a note is required for "Other" (or any reason marked as needing a note). Confirm text: "Cancel your booking on Wed, 30/Sep/2026 at 2:00 PM? This can't be undone — you can make a new booking any time." After cancelling: "Booking cancelled" state (the link keeps showing it — D-BKG-16) and a "Book again" button.

**FE-MNG-05 · Cutoff.** 🔒 D-BKG-12 (one cutoff setting for customer changes; staff are not limited) — v1.3: `booking.customer_change_cutoff_minutes` default **120** (owner Part 3 sheet #1; e.g. a 2:00 PM booking can be changed online until 12:00 PM). The page shows the deadline ("Changes online until 12:00 PM") while it applies. After the cutoff, Change and Cancel are replaced by "Changes are no longer possible online. Please call the branch." + Call.

**FE-MNG-06 · Other states.** ⚠️ In progress / Completed: view only, with "Book again". Cancelled: view only + "Book again".

### 5.7 System pages

**FE-SYS-01 · 404.** ⚠️ Friendly message in both languages, links to Home, Branches, Book.

**FE-SYS-02 · Error.** ⚠️ "Something went wrong on our side" + retry + branch phone numbers (customers can always call).

**FE-SYS-03 · Maintenance.** 🔒 D-PLT-08. Info pages stay available from cache; booking shows FE-BK-16.

---

## 6. Components

**FE-CMP-01 · Buttons and tappable items.** ⚠️ One filled primary CTA per view (Book / Continue / Confirm). Height ≥ 48 px on mobile; full width in sticky bars. Service "+", time slots, date chips and barber cards have ≥ 48 px touch height and ≥ 8 px gaps. Selected state = filled token colour + check icon (not colour alone). Labels are verbs from the language file.

**FE-CMP-02 · Cards.** ⚠️ Branch, service, barber and summary cards: 1 px border or subtle background (Common Region), 16 px padding on mobile, whole card tappable when it has one action; buttons inside a card are separate targets. Minimalist theme (FE-VIS-01): no drop shadows at rest, a 2–4 px lift + subtle shadow on hover only (FE-VIS-07).

**FE-CMP-02a · Barber card.** 🔒 owner 01/Oct (FE-HOME-05). `BarberCard`: photo (1:1, top or left), name (`text-lg`, 600), current-branch line with a map-pin icon, description (3-line clamp), rating row (★ + number + "Point rating" caption, omitted when empty — FE-HOME-05), **Book with <name>** primary button full-width at the bottom. The same component is used on the home page, the branch page and in the modal's barber step (there without the Book button and with a selected state — FE-CMP-01).

**FE-CMP-02b · Booking modal.** 🔒 owner 01/Oct (FE-BK-00). `BookingModal` built on the shared `Dialog` / `Sheet` primitives (admin AD-CMP-08): desktop dialog 1040 × ≤ 90 vh with internal scroll per column, mobile full-screen sheet; header = step indicator + close; body = current step; footer / right column = summary (FE-BK-13).

**FE-CMP-03 · Service card.** ⚠️ Name (bold), duration and price on one line right under the name (Proximity), description clamped to 2 lines with "More", "+" / "✓ Added" on the right. Home prices and "Choose options" states follow FE-BK-04/05.

**FE-CMP-04 · Date strip.** ⚠️ Horizontally scrollable chips (weekday + day + month), today first, disabled chips for closed / full days with a small label, arrow buttons on desktop. Keeps the selected chip in view.

**FE-CMP-05 · Slot grid.** ⚠️ 3 columns at 360 px, 4–6 on desktop; grouped under "Morning / Afternoon / Evening" headings; implemented as a radio group (keyboard arrows move, Enter selects). Show a skeleton grid while loading.

**FE-CMP-06 · Phone input.** 🔒 D-CUS-02. Shared with admin (AD-FORM-10). Placeholder `09 xxx xxx xxx`; formats as you type; `inputmode="tel"`.

**FE-CMP-07 · Status line.** ⚠️ `OpenStatus` component: icon + text + tone; computed in MMT from hours and closures; re-computed on the client every minute so a page left open stays correct.

**FE-CMP-08 · Banners.** ⚠️ Two distinct components: `AnnouncementBar` (info, dismissible) and `ClosureNotice` (warning, not dismissible). Never styled like ads (no flashing, no stock imagery).

---

## 7. Content, language and formats

**FE-L10N-01 · Everything from the language files.** 🔒 D-PLT-03. Same rule and tooling as admin AD-L10N-01/02; the public site uses its own namespace (`site.*`, `book.*`, `manage.*`). SEO titles/descriptions and hero/announcement texts come from `site.*` settings (MM/EN).

**FE-L10N-02 · Bilingual data.** 🔒 D-DB-04. English pages show `*_en`, falling back to `*_mm`; branch notices require MM and may have EN.

**FE-L10N-03 · Myanmar typography and line breaking.** ⚠️ Admin AD-L10N-04/05 apply: Myanmar line-heights, no clipping, wrap instead of truncating, no uppercase/italics, U+200B only inside fixed UI strings, test at 320 px.

**FE-L10N-04 · Zawgyi.** ⚠️ Name, address and note inputs detect Zawgyi and convert to Unicode before submit (AD-FORM-13).

**FE-FMT-01 · Formats.** 🔒 D-PLT-05, D-PLT-15 + owner 01/Oct (OPEN-32 ✅) via the shared formatter (AD-FMT-00), called with the `site` profile:
- **Money: `7,000 Ks` in both languages** (owner: "7,000 Ks ပဲ ထားမယ်"; ✅ confirmed 01/Oct 10:47 — **website only, the admin app keeps 🔒 D-PLT-04** `Ks` / `ကျပ်`). The formatter takes a profile (`site` → `Ks` always; `app` → D-PLT-04).
- Date `Wed, 30/Sep/2026` — **English month abbreviations (`Oct`) in both languages**, `DD/MMM/YYYY` (D-PLT-05; owner's example `01/Oct/2026`).
- Time `2:30 PM` — **AM / PM in both languages** (no နံနက် / ညနေ).
- **Digits 0–9 in both languages** (money, dates, times, phone numbers, durations). Only words are translated — weekday names and units: `Wed, 30/Sep/2026` / `ဗုဒ္ဓဟူး, 30/Sep/2026`, `1 h 35 min` / `1 နာရီ 35 မိနစ်` (same as admin AD-FMT-02/05).
- All times are Myanmar Time regardless of the visitor's device.

**FE-COPY-01 · Voice.** ⚠️ Warm, respectful, short. Talk like the shop talks to its customers. No jargon ("slot", "variant", "entity"): say "time", "option", "booking".

**FE-COPY-02 · Key microcopy.** ⚠️ ★ MM suggestions for owner review (the language file is the final source).

| Moment | English | Myanmar (suggestion ★) |
| --- | --- | --- |
| Main CTA | Book now | အချိန်ချိန်းမည် |
| Branch CTA | Book at this branch | ဒီဆိုင်ခွဲမှာ ချိန်းမည် |
| Find branches | Find a branch | ဆိုင်ခွဲ ရှာမည် |
| Status | Open now · closes 8:00 PM | ယခု ဖွင့်ထားပါတယ် · 8:00 PM ပိတ်မည် |
| Status | Closed today | ဒီနေ့ ပိတ်ပါတယ် |
| Buttons | Call · Directions | ဖုန်းခေါ်မည် · လမ်းညွှန် |
| Step | Choose a service | ဝန်ဆောင်မှု ရွေးပါ |
| Option hint | Not sure about your length? Pick the closest one — your barber will confirm at the shop. | ဆံပင်အရှည် မသေချာရင် အနီးစပ်ဆုံးကို ရွေးပါ — ဆိုင်ရောက်မှ ဆရာက အတည်ပြုပေးပါမယ် |
| Barber | Any available barber | အားတဲ့ ဆရာ မည်သူမဆို |
| Barber card | Book with Ko Aung · Today at Branch 3.0 · Off today · Point rating 4.5 | ကိုအောင်နဲ့ ချိန်းမည် · ဒီနေ့ Branch 3.0 မှာ · ဒီနေ့ နားရက် · Point ရဲ့ သတ်မှတ်ချက် 4.5 |
| Modal close | Leave booking? Your selections are kept for this visit. — Keep booking / Leave | ချိန်းဆိုမှုကို ထားခဲ့မလား? ရွေးထားတာတွေ ဒီတစ်ကြိမ်အတွက် ကျန်နေပါမယ်။ — ဆက်လုပ်မည် / ထွက်မည် |
| Time | No times left on this day | ဒီနေ့အတွက် အချိန်လွတ် မရှိတော့ပါ |
| Time | Next available: Wed, 07/Oct/2026 10:30 AM | အနီးဆုံး အားချိန်: ဗုဒ္ဓဟူး, 07/Oct/2026 10:30 AM |
| Details | Your name · Phone number | အမည် · ဖုန်းနံပါတ် |
| Details notice | We don't send SMS or email. On the next screen you'll get a link to change or cancel your booking — please save it. | SMS / email မပို့ပါ။ နောက် screen မှာ ချိန်းဆိုမှု ပြင် / ပယ်ဖျက်ဖို့ link ရပါမယ် — သိမ်းထားပေးပါ |
| Review | Pay at the shop — cash or KBZPay | ဆိုင်ရောက်မှ ငွေချေပါ — ငွေသား သို့မဟုတ် KBZPay |
| Confirm | Confirm booking | ချိန်းဆိုမှု အတည်ပြုမည် |
| Success | Your booking is confirmed | ချိန်းဆိုမှု အတည်ပြုပြီးပါပြီ |
| Link card | Save this link — it's your booking ticket | ဒီ link ကို သိမ်းထားပါ — သင့် booking လက်မှတ်ပါ |
| Link actions | Copy link · Share · Add to calendar | Link ကူးမည် · မျှဝေမည် · ပြက္ခဒိန်ထဲ ထည့်မည် |
| Manage | Change booking · Cancel booking | ချိန်းဆိုမှု ပြင်မည် · ချိန်းဆိုမှု ပယ်ဖျက်မည် |
| Active booking rule | This phone number already has an upcoming booking. Use your booking link to change it, or call the branch. | ဒီဖုန်းနံပါတ်နဲ့ ချိန်းဆိုထားတာ ရှိပြီးသားပါ။ Link နဲ့ ပြင်ပါ၊ သို့မဟုတ် ဆိုင်ကို ဖုန်းဆက်ပါ |

**FE-COPY-03 · Honesty.** ⚠️ Cognitive Bias. No fake urgency or scarcity, no pre-selected extras, the full total (incl. transport fee) before Confirm, the cancel option as visible as the change option. The barber rating is labelled as the shop's own rating ("Point rating") until real customer ratings exist (FE-HOME-05) — never presented as reviews.

---

## 8. Performance

**FE-PERF-01 · Budgets.** ⚠️ p75 on a mid-range Android phone over 4G: **LCP ≤ 2.5 s, INP ≤ 200 ms, CLS ≤ 0.1**. First-load JavaScript: info pages ≈ ≤ 90 KB gzip **before** the animation libraries, which load after interactivity (FE-PERF-08); the booking modal chunk ≈ ≤ 170 KB gzip, loaded on demand. Checked in CI with Lighthouse budgets (FE-QA-05).

**FE-PERF-02 · Rendering and caching.** ⚠️ review §5.8 (REC-35). Home and branch pages are server-rendered and cached with tags (`home`, `site`, `branch:<code>`, `barbers`), revalidated on admin save (background job / event → revalidate; there is no outbox table — D-DB-12) and after the nightly shift generation (barber "current branch", FE-HOME-05), with a 5-minute time-based safety net. The booking modal = client steps on top of the cached page. **Availability is fetched live with `no-store`** — never cached anywhere.

**FE-PERF-03 · Availability responses.** ⚠️ Doherty. Target p95 ≤ 400 ms. Show skeleton slots after 150 ms; cancel stale requests when the selection changes; never show slots from a previous selection.

**FE-PERF-04 · Prefetch.** ⚠️ When services are chosen, prefetch eligible barbers and the first available date; prefetch the next step's route.

**FE-PERF-05 · Images.** ⚠️ `next/image` with AVIF/WebP, responsive `sizes`, explicit width/height (no layout shift), lazy below the fold, hero ≤ ~200 KB on mobile. **v1.4 (ADR-014, API Part 8 P8-RULE-04 / P8.PUB.05):** images are served from the stable path `/api/v1/public/media/<id>/<w400|w800|w1600|original>` (uploads re-encoded to WebP 400 / 800 / 1600 px, location data removed; cached for one day with an `ETag` — review fix 02/Oct, so a photo taken off the website disappears from browsers within a day) — `logo_url`, `photo_url`, `image_url` and the cover / share images all use it; pick the variant by the rendered size (`sizes`).

**FE-PERF-06 · Fonts.** ⚠️ Self-hosted WOFF2 (Archivo Black, Roboto 400/500/700, Pyidaungsu Regular/Bold — FE-VIS-02); preload only the fonts used above the fold in the current language (`en`: Archivo Black + Roboto 400; `my`: Pyidaungsu Regular + Bold); `font-display: swap` with a size-adjusted fallback (`size-adjust`, `ascent-override`) to limit CLS — Archivo Black's fallback is a bold system sans at ~105% width; subset Latin; keep the full Myanmar Unicode block (U+1000–U+109F) in the Pyidaungsu subset.

**FE-PERF-07 · Third parties.** ⚠️ Only the captcha script, and only when the booking modal opens. No map SDK, chat widget, TikTok / Facebook embeds or pixels on load.

**FE-PERF-08 · Animation budget.** ⚠️ (FE-VIS-07). Motion ≈ 18–20 KB gzip and GSAP core + ScrollTrigger ≈ 30 KB gzip are loaded with `next/dynamic` **after** the page is interactive, only on pages that animate (home; the modal uses Motion only). The first paint never waits for them — content is in place without animation and the libraries only add the entrance effects (`opacity` and `transform` only, never layout properties). Target: no INP regression, CLS unchanged, main-thread work from animation < 50 ms per scroll.

---

## 9. SEO and link sharing

**FE-SEO-01 · Titles and descriptions.** 🔒 Part 8 `site.seo_title` / `seo_description` (home) + ⚠️ patterns: branch page "Point Barbershop — {branch name} · {area}", `/book` entry route "Book a haircut — Point Barbershop". Both languages.

**FE-SEO-02 · Open Graph and social — including TikTok.** 🔒 `site.share_image_attachment_id` + owner 01/Oct (TikTok) + ⚠️. `og:title`, `og:description`, `og:image` (1200 × 630), `og:url` (canonical), `og:locale` (`my_MM` / `en_US`), plus `twitter:card = summary_large_image` (used by several in-app browsers). **TikTok:** the site link goes in the TikTok profile bio and in video captions / comments; TikTok's in-app browser opens it, so the home page and the `/book?branch=` links must load fast and work inside that WebView (no features that need a desktop browser; the booking modal works at 360 px). Share image and title are tested in Facebook's Sharing Debugger, in a Viber chat **and in a TikTok DM / bio link** after every change (runbook — review §5.8). No TikTok pixel (FE-SEC-05).

**FE-SEO-03 · Structured data.** 🔒 review §5.8. Each branch page: schema.org `HairSalon` JSON-LD — name, address (`PostalAddress`, locality, country `MM`), `geo`, `telephone`, `url`, `image`, `openingHoursSpecification` from `branch_opening_hours`, `sameAs` = all social links incl. the **TikTok profile URL** (`companies.social_links`). Home: `Organization` with logo, branches and the same `sameAs` list.

**FE-SEO-04 · Languages.** ⚠️ `hreflang` for `my` and `en`, `x-default` → the bare path; a canonical URL per language.

**FE-SEO-05 · Sitemap and robots.** ⚠️ `sitemap.xml` lists home, public branch pages and the `/book` entry route in both languages. `robots.txt` disallows the manage-booking route; manage pages also send `noindex`.

**FE-SEO-06 · Server HTML.** ⚠️ All informational content is in the server-rendered HTML (crawlers and link-preview bots don't run JavaScript — review §5.8).

**FE-SEO-07 · Google Business Profile.** ⚠️ Each branch's profile links to its branch page (manual step in the runbook, ACT-05 domain first).

---

## 10. Privacy and security, as the visitor experiences them

**FE-SEC-01 · Public data only.** 🔒 review §5.8 (public DTOs), Part 1 website rule. Public endpoints return only public fields; the UI never shows staff phone numbers or emails, customer data, or internal notes.

**FE-SEC-02 · Manage links.** 🔒 D-BKG-11. The token appears only in the manage URL and the confirmation page; `noindex`, `Referrer-Policy: no-referrer`, excluded from analytics and error reports (mask it in logs).

**FE-SEC-03 · Spam protection without friction.** 🔒 D-BKG-21. Invisible captcha + loose IP rate limit (e.g. 10/hour, configurable). The visitor sees a challenge only when the captcha provider requires it; rate-limit messages are polite and offer the phone number (FE-BK-11).

**FE-SEC-04 · Data notice.** ⚠️ A one-line notice under the details form: "We use your name and phone number only for this booking." Plus the captcha provider's required notice if the chosen provider needs one.

**FE-SEC-05 · No customer messaging, no tracking by default.** 🔒 D-CUS-05 + ⚠️. No marketing pixels. Analytics only if the owner approves it (FE-QA-04), cookie-less and without personal data or tokens.

---

## 11. Accessibility (WCAG 2.1 AA)

**FE-A11Y-01 · Standard.** ⚠️ WCAG 2.1 AA; axe checks in CI on every public route and booking step.

**FE-A11Y-02 · Language attributes.** ⚠️ `<html lang="my">` or `lang="en"`; mixed-language blocks marked with `lang`.

**FE-A11Y-03 · Keyboard and focus.** ⚠️ The whole booking flow works by keyboard; the modal traps focus and returns it to the opening CTA on close (FE-BK-00); date strip and slot grid are radio groups; on each step change, focus moves to the step heading and the step name is announced.

**FE-A11Y-04 · Errors and live updates.** ⚠️ Field errors via `aria-describedby`; booking errors (FE-BK-11) in an `aria-live="assertive"` region; "Copied" and total changes via `aria-live="polite"`.

**FE-A11Y-05 · Images.** ⚠️ No alt-text field exists in the DB, so alt text comes from names (branch name, service name, barber name); decorative images use `alt=""`.

**FE-A11Y-06 · Zoom and motion.** ⚠️ Usable at 200% zoom and with large system fonts; respects `prefers-reduced-motion` — every GSAP / Motion effect has a reduced-motion variant (fade or none, FE-VIS-07); no motion triggers flashing (> 3 flashes / s) or large moving backgrounds.

---

## 12. Fresha public booking — reference

Observed anonymously on a third-party public Fresha venue page (`module-research/booking.md`, "customer self-booking").

| Adopt (Jakob's Law) | Evidence | Our rule |
| --- | --- | --- |
| Breadcrumb steps "Services › Professional › Time › Confirm" | `evidence/booking/public-04-services.png` | FE-BK-14 |
| Right-hand summary card with total and a single Continue button | `evidence/booking/public-05-professional.png` | FE-BK-13 |
| Category chips above the service list; "+" to add | `evidence/booking/public-04-services.png` | FE-BK-05 |
| Add-on picker sheet after tapping "+" | `evidence/booking/public-04b-addons.png` | FE-BK-06 (as option picker) |
| "Any professional" card at the top of the barber list | `evidence/booking/public-05-professional.png` | FE-BK-07 |
| Date strip + 12-hour times; "next available date" when a day is full | `evidence/booking/public-07-time.png`, `evidence/booking/new-appt-time-step.png` | FE-BK-08 |

| Avoid | Why | Our rule / decision |
| --- | --- | --- |
| "Log in or sign up to book" wall with an SMS code | Kills conversion; we require name + phone only | 🔒 D-BKG-10 · FE-BK-09 (`evidence/booking/public-09-after-time-continue.png`) |
| "from SGD 68" price with "Any professional" | Vague; we show exact prices per branch / option | 🔒 D-SVC-05 · FE-BK-05/06 |
| Customer ratings, reviews, "Senior Barber (12 years)" marketing labels | No review system in V1; the barber card shows a **shop-set** rating labelled "Point rating" (OPEN-37 ✅), customer ratings = V2 | FE-META-05, FE-HOME-05 |
| Waitlist link, group booking, package upsell, marketplace branding | Not in scope | 🔒 D-BKG-20 ⏭ · FE-META-05 |

---

## 13. Implementation notes and QA

**FE-IMPL-01 · Structure.** ⚠️ review §5.2 / §5.8: one Next.js app, route group `(site)` with a `[locale]` segment (`next-intl`); middleware redirects bare paths to a locale keeping the query (FE-IA-02); the `/book` route renders the home / branch page with the modal open (FE-BK-00) via a parallel / intercepting route or a `?book=1` search param — pick one at API / IA design and keep it. Server components fetch NestJS public read-only endpoints — **v1.4, final names:** `GET /v1/public/site` (P8.PUB.01), `GET /v1/public/branches` (P8.PUB.02), `GET /v1/public/branches/{code}` (P8.PUB.03), `GET /v1/public/barbers` (P8.PUB.04 — public profiles + `today_branches[]`), `GET /v1/public/media/{attachment_id}/{variant}` (P8.PUB.05), and the availability and booking endpoints P3.PUB.* (API Part 3); server-side calls go over the internal network with the internal key and skip the per-IP limit (API Part 8 P8-RULE-13). No business logic in Next.js server actions.

**FE-IMPL-02 · Components.** ⚠️ `SiteHeader`, `LanguageSwitch`, `AnnouncementBar`, `ClosureNotice`, `BranchCard`, `OpenStatus`, `OpeningHoursTable`, `ServiceCard`, `OptionPicker` (shared with admin), `BarberCard` (FE-CMP-02a), **`BookingModal`** (FE-CMP-02b — wraps the steps), `DateStrip`, `SlotGrid`, `BookingSummary` (column + mobile bar), `StepIndicator`, `PhoneInput` (shared), `ConfirmationCard`, `ManageLinkCard`, `SiteFooter`, `Reveal` (Motion wrapper used for section entrances, FE-VIS-07).

**FE-IMPL-03 · Shared logic.** 🔒 §6.4b A-2 (one availability function) + ⚠️. The booking modal, the staff calendar and reschedule use the same server-side availability function; formatters (with the `site` money profile — FE-FMT-01), phone normalisation and the option picker are shared packages.

**FE-IMPL-04 · Flags.** ⚠️ `.ics` "Add to calendar" (REC-36) and analytics (FE-QA-04) are behind feature flags, OFF until approved. The barber-card rating row is built (OPEN-37 ✅) and hides itself when the rating is empty.

**FE-IMPL-05 · Libraries fixed by the owner.** 🔒 owner 01/Oct. Fonts: Archivo Black, Roboto, Pyidaungsu (FE-VIS-02). Motion: `motion` and `gsap` (+ ScrollTrigger) — no other animation or 3D library (FE-VIS-07).

**FE-QA-01 · Definition of done for a page / step.** ⚠️
- [ ] MM and EN at 320, 360, 768, 1280 px; nothing clipped; `lang` set.
- [ ] Loading (skeleton), empty, error and closed / unavailable states.
- [ ] Works from a cold QR link (`/book?branch=<code>` opens the modal) and from the home page.
- [ ] Performance budget met (FE-PERF-01); no layout shift from images, fonts or animations; reduced-motion variant checked.
- [ ] Meta tags / JSON-LD present where required; manage pages `noindex`.
- [ ] Keyboard + screen-reader basics; axe clean.
- [ ] PR cites FE rule IDs and decision IDs.

**FE-QA-02 · End-to-end tests (Playwright, 360 × 800 and 1280 × 800).** ⚠️ QR link `/book?branch=b3` → modal opens on the branch page → book one service; barber card "Book with" → modal with barber + branch preselected; barber card with a rating shows "Point rating 4.5", without one shows no rating row; the earliest slot offered is the next boundary after now (no lead time); barber-first and date-first paths; option service (dye) with exact price; home service with address and transport fee; slot taken during review; phone with an active booking is refused without details; Confirm → lands on `/booking/[token]?new=1` and the link survives refresh; manage link → reschedule (modal) with a price change → cancel with "Other" + note; after cutoff → call prompt; closed date not selectable while other dates of that branch are; language switch mid-flow keeps selections; Esc / Back closes the modal with the "Leave booking?" guard and reopening restores selections; bare `/book?branch=b3` redirects with the query kept; reduced-motion renders the page without entrance animations.

**FE-QA-03 · Test with real customers.** ⚠️ Before launch, 5 customers at one branch book on their own phones via the shop QR; note where they hesitate, how long it takes (FE-GOAL-02) and whether they save the link.

**FE-QA-04 · Analytics (optional).** ⚠️ Only if the owner approves: cookie-less, aggregate step counts (entered, chose service, chose time, confirmed, saved link) — no names, phones or tokens.

**FE-QA-05 · Lighthouse CI.** ⚠️ Budgets from FE-PERF-01 enforced on home, one branch page, the `/book?branch=` entry (modal open) and each modal step.

---

## 14. Open items and owner inputs

**Resolved by the owner on 01/Oct (v1.1):** OPEN-31 fonts ✅ (FE-VIS-02) · OPEN-32 formats ✅ (FE-FMT-01) · OPEN-35 (a)(b)(c) ✅ Option A (FE-BK-01/02/05/07) · OPEN-21 toggles ✅ default OFF, owner enables from the admin panel (FE-HOME-03/05, FE-BR-03) · booking = modal (FE-BK-00) · barber direct booking cards (FE-HOME-05) · motion libraries (FE-VIS-07) · TikTok (FE-SEO-02) · theme (FE-VIS-01).
**Resolved by the owner on 02/Oct 00:06 (v1.4 — one-sheet "အကုန်လုံး OK", review v5.2.14 §0.8):** public site API final (API Part 8 P8.PUB.01..05, 🔒 D-API-09 — Part 8 research items accepted with the sheet; files in the owner's bucket — F4): barber `today_branches[]` (FE-HOME-05), "Open now" in the browser (FE-HOME-02, FE-BR-02), stable media path (FE-PERF-05), endpoint names (FE-IMPL-01) · website barber order = `employee_code` (FE-HOME-05, unchanged) · the site address comes from the server (`SITE_ORIGIN`), not a setting.
**Resolved by the owner on 01/Oct 10:47 (v1.2):** OPEN-37 ✅ rating = admin / manager-entered for V1, customer ratings V2 (FE-HOME-05, FE-CMP-02a) · money unit confirmed: website `Ks`, app unchanged (FE-FMT-01) · no minimum lead time 🔒 D-BKG-23 (FE-BK-08) · "50 — တင်လို့ရပါတယ်" = that lead-time question (closed) · colour palette + design reference at the spec stage (FE-VIS-01).

| ID | Item | Default until decided | Affects |
| --- | --- | --- | --- |
| ◐ OPEN-30 (website ✅ 02/Oct) | **Website palette given by the owner** — `#EEEEEE` / `#000000` / `#DC5F00`, buttons black + white (FE-VIS-01a / 01b). Design reference images = `point-barber/design-reference/website/` (the owner adds them; a rule an image changes is recorded as a new version note). Still ★: the logo file | Palette applied; neutral scaffolding for everything not in FE-VIS-01a | Whole site, FE-VIS-01 |
| ✅ REC-41 (02/Oct 13:46) | **The remaining site tokens are approved** (FE-VIS-01a — ring, card, muted, border, input, secondary, accent, destructive, success, warning, info) — owner: "Ok ပါတယ်" | 🔒 in FE-VIS-01a; built in `add-shared-ui-components` | FE-VIS-01a |
| ⚠️ V2 | **Customer ratings** (OPEN-37 ✅ chose admin / manager-entered rating for V1) — when V2 adds real customer ratings, the card switches source and the "Point rating" caption goes | Shop-set rating with caption | FE-HOME-05 |
| 🟡 OPEN-21 (rest) | Opening-hours data, domain (ACT-05) | – | FE-BR-02, FE-SEO-07 |
| ~~★~~ | ~~Customer change / cancel cutoff value and no-show wording~~ — closed (owner, Part 3 sheet #1 / #4): **120 minutes**; the confirmation page states the 40-minute auto-cancel (FE-CONF-03) | – | FE-BK-10, FE-CONF-03, FE-MNG-05 |
| ⚠️ REC-35 | Revalidate-on-save mechanism for "admin edits appear immediately" (+ nightly `barbers` tag) | Build per review §5.8 | FE-PERF-02 |
| ~~⚠️ REC-36~~ | ~~`.ics` "Add to calendar"~~ — ✅ approved (owner, Part 3 sheet #5): generated in the browser, contains the manage link | – | FE-CONF-02 |
| ⚠️ | Manage-page route name (`/booking/[token]`, also the confirmation page with `?new=1`) and the `/book` entry-route mechanism (parallel route vs `?book=1`) | As written | FE-MNG-01, FE-CONF-00, FE-IMPL-01 |
| ~~API question~~ | ~~Minimum lead time before a customer can book~~ — closed: **none** (🔒 D-BKG-23, owner 01/Oct) | Next free slot boundary after now | FE-BK-08 |
| ~~API question~~ | ~~`GET /public/barbers` needs "today's branch" per barber (from `schedule_shifts`) and returns `public_rating`~~ — closed (v1.4): answered by **`today_branches[]`** (several on a split day), falling back to the assigned branches `branches[]`, with `public_rating` — API Part 8 **P8.PUB.04** (`[]` while `site.show_barbers` is off; default 12, order `employee_code`) | – | FE-HOME-05 |
| ~~API question~~ | ~~Booking create is not idempotent~~ — closed (owner 01/Oct 21:20 — ADR-004): the browser generates the manage token and the server stores its hash; a retry returns the same booking and link (API P3.PUB.06) | – | FE-BK-11, FE-CONF-02 |
| ⚠️ REC-39 | Approve this guideline's content (→ 🔒 D-UX-04) | Build per this draft | Whole file |

*Change log: **v1.7 (02/Oct/2026 13:46)** — REC-41 approved: every FE-VIS-01a row 🔒, the site uses its own `--ring` / `--input` (S15 interim ends for the website), danger badge note · **v1.6 (02/Oct/2026 13:08)** — owner sheet 3 (review §0.11): FE-VIS-01a note — focus outline and input border on existing neutral tokens until REC-41 is approved (S15) · **v1.5 (02/Oct/2026)** — owner's website palette (FE-VIS-01 rewritten, FE-VIS-01a / 01b new), site tree overrides colour tokens, design reference folder, OPEN-30 website part closed, REC-41 opened (🟡 proposal rows — status colours proposed with separated lightness), FE-META-01 seven tiers, FE-META-04a path note, FE-META-06 three exceptions, weekday of the 30/Sep and 07/Oct/2026 examples corrected · v1.4 (02/Oct/2026 00:06) — API Part 8 deltas.*

*End of public website guideline v1.7.*
