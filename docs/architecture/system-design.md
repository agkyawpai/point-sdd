# Point Barbershop — System Design Review (before coding)

> **File:** `docs/architecture/system-design.md` (repo path) · **Version:** **v1.4** · **Date:** 02/Oct/2026 · **v1.4 = owner "OPEN-40 OK" (02/Oct/2026 — review §0.9):** §7 item 1 **closed** — (a) payroll reopen **soft-deletes** the run's salary expense rows (DB Part 7 v1.2), (b) a wrong, unused salary row / commission-plan assignment is **archived** (DB Part 5 v1.2), (c) removed lines of a DRAFT purchase / transfer are deleted with a full audit diff (owner A2 reading — no DB change) · §2.5 `Expenses.removePayroll(run, actor, reason)` defined · §4.1 two-repository layout (**ADR-016** — specs in `point-sdd`, code in `point-barber`) · no endpoint, DTO or code changed (API Parts 5 / 6 / 7 v1.1) · **v1.3 = owner one-sheet "အကုန်လုံး OK" (02/Oct/2026 00:06 — review §0.8) + API Parts 3–8 locked (🔒 D-API-04..09):** new **ADR-013** (document rendering — server Chromium, stored receipts), **ADR-014** (files in the owner's S3-compatible bucket), **ADR-015** (live reports ≤ 366 days, exports) · **ADR-012 Amendment 1** (level `private`, company-wide money rows, audit rows) · **ADR-002** canonical job list (18 jobs, schedules MMT) · ADR-001 / 003 / 006 / 007 / 008 / 009 amendment notes · §1.1 rows · §2.1 components · §2.2 FINISH flow with DayLock + `receipt.render` · new §2.5 flows (closing, payroll, stock, files / documents / reports) · §2.4 storage · §3.2 / §3.3 / §3.4 / §3.6 updated · new §3.7 realtime rooms · §3.8 security levels · §3.9 documents & files · §3.10 reports & exports · §4 deployment / failure modes · §5 rows · §6 triggers · new **§7 open items** (OPEN-40, D-PAY-08 🟡) · ***review fixes 02/Oct (independent review of the batch — no version bump):*** §3.6 one lock order + isolation rule + `PayrollLock` as an advisory lock · §2.2 / §2.5 FINISH and close flows (READ COMMITTED, locks first) · §3.4 job table (`closing.month_end_must_return` daily 01:00, job owners) · §3.8 backup / import reads = company scope, `receivable.issue` private · §3.3 / §3.9 public media 1-day cache + `ETag` · §4.1 two internal secrets · §7 OPEN-40 with sub-items a / b / c · ***reconcile 02/Oct (no version bump):*** §2.5 `Expenses.postPayroll(run, actor)` / `removePayroll(run, actor, reason)` · §3.6 state errors (409 `invalid_transition`) vs 423 `locked` · §3.8 staff-advance taker = company-scope `payroll.view` or `receivable.issue`; audit rows — own rows always visible, employee rows under the primary branch · **v1.2 = owner scope choice A — ADR-012** (a grant reaches what the target's data level allows: company master / branch data / shared customers) + API Part 3 draft (no-show job detail, customer lookup) · **v1.1 = owner locks (decision sheet §0.6):** every ADR Accepted · providers named (Resend Free · HetrixTools Free with e-mail + Telegram alerts · Sentry Developer · Cloudflare Turnstile) · backup RPO = daily accepted · permissions = CRUD per menu + special actions (**ADR-011**, supersedes ADR-010) · v1.0 (+ independent-review fixes, same day) = 01/Oct 11:54 (owner: "coding ဘက်ကို စရောက်လာပြီ — သေချာ စစ်ပါ")
> **Method:** the engineering `system-design` framework — (1) requirements, (2) high-level design, (3) deep dive, (4) scale & reliability, (5) trade-offs — applied to what is already locked (Appendix A, `docs/db/`, `docs/ux/`) and to the API design (`docs/api/00`–`08`; **Parts 0–8 🔒 D-API-01..09**). Decisions that come out of it are written as ADRs in `docs/adr/` (ADR-001…016; ADR-010 superseded by ADR-011; ADR-011 #7 amended by ADR-012; ADR-012 Amendment 1 adds the `private` level).
> **Status:** review document — **all ADRs it points to are Accepted (owner 01/Oct/2026 21:20; ADR-012 owner 01/Oct evening; ADR-013 / 014 / 015 and ADR-012 Amendment 1 owner one-sheet 02/Oct/2026 00:06)**, so its recommendations are binding through those ADRs (ADR-001…009, 011…016; ADR-010 superseded). Nothing here changes a 🔒 decision; **no owner question is open** — OPEN-40 was answered on 02/Oct/2026 ("OPEN-40 OK") and §7 item 1 records the locked mechanism; §7 keeps D-PAY-08 🟡 and the build-time choices. The repository layout of §4.1 follows ADR-016 (two repositories — owner 02/Oct/2026).

---

## မြန်မာ အတိုချုပ် (Owner အတွက်)

- Coding မစခင် system တစ်ခုလုံးကို architecture framework နဲ့ ပြန်စစ်ထားတာ — **ဘာလိုလဲ (requirement) → ဘာနဲ့ ဘယ်လို ဆောက်မလဲ (design) → အသေးစိတ် (data / API / cache / job / error) → ကြီးလာရင် / ပျက်ရင် (scale / reliability) → ရွေးစရာ ၂ ခု ကြားမှာ ဘာကြောင့် ဒါ (trade-off)**။
- **အဓိက ကောက်ချက်:** ဒီ system က **ဆိုင်ခွဲ ၃ ခု၊ ဝန်ထမ်း ၁၅၊ တစ်နေ့ service ~၉၀** — load နည်းတယ်။ ဒါကြောင့် **server တစ်လုံး + Docker Compose + Postgres တစ်ခု** (modular monolith) က မှန်တယ်; Redis / microservice / Kubernetes မလို။ ပြဿနာ ဖြစ်နိုင်တာက load မဟုတ်ဘဲ **ငွေစာရင်း မှန်ကန်မှု၊ မီးပျက် / net ပြတ်ချိန်၊ backup၊ security** — ဒါတွေကို design မှာ ကာထားပြီး (DB constraint, idempotency, audit, session revoke, daily off-site backup)။
- **ဒီ review ကနေ ထွက်လာတဲ့ ပြောင်းလဲချက် — owner 01/Oct 21:20 အကုန် Accepted (🔒):** API ကို subdomain မသုံးဘဲ **origin တစ်ခုတည်း `/api` path** နဲ့ (cookie / CORS ပြဿနာ မရှိ — ADR-009) · booking idempotency = **client token** (ADR-004 — owner မေးတဲ့ "server / DB ဘယ်ဟာ ပိုကောင်းလဲ" အဖြေ) · job = **pg-boss** (ADR-002) · Android = **Capacitor** (ADR-003) · realtime = Socket.IO instance တစ်ခု (ADR-008) · website = server render + revalidate (ADR-006) · monitoring + email = **Resend (Free) · HetrixTools (Free — server ပျက်ရင် Telegram + Email) · Sentry (Developer)** (ADR-007) · session / CSRF + Android / iPhone ထဲက Google login hand-off (ADR-005) · backup = နေ့စဉ် (RPO ၂၄ နာရီ — ADR-002)။ **Permission = menu တစ်ခုချင်း CRUD (`view` / `create` / `update` / `delete`) + approve လို သီးသန့် action** (ADR-011 — ADR-010 ကို အစားထိုး) · modular monolith (ADR-001)။
- **v1.2 (owner 01/Oct ည — ADR-012):** permission ✔ ဘယ်အထိ ရောက်လဲ = **data အဆင့်** — company တစ်ခုလုံး data (service master, role, company setting) = company scope နဲ့မှ ပြင်; branch data (ရောင်း / ကြာချိန်, ဈေး, schedule, booking, branch setting) = ကိုယ့် branch; customer = မျှသုံး၊ history = ကိုယ့် branch။
- **v1.3 (owner one-sheet 02/Oct 00:06 — "အကုန်လုံး OK"):** **ADR အသစ် ၃ ခု** — (13) receipt / payslip / report PDF ကို **server က Chromium နဲ့ ထုတ်** (မြန်မာစာ မှန်) · receipt ဖိုင် **သိမ်း** (ပြန်ထုတ်တိုင်း ပုံတူ) · printer width = branch setting · auto-print OFF; (14) ပုံ / ဖိုင် / backup = **owner ပိုင် cloud bucket** (R2 / B2 — S3 API) · ၅ မိနစ် link · website ပုံ = လမ်းကြောင်း မပြောင်း; (15) report = **DB ကနေ တိုက်ရိုက် (၁ နှစ်အထိ)** · export = `data.export` (Admin) · ၅,၀၀၀ row အထိ ချက်ချင်း၊ အဲ့ထက်များရင် နောက်ကွယ် (၂၄ နာရီ)။ **Permission အဆင့် (၄) Private** — လစာ / commission / advance / report ⑦ / ဝန်ထမ်း document = company scope ပဲ (Manager ကြည့်ရုံတောင် ✖ — C1 / F11)။ **Job ဇယား** (ညဘက် ၀၀:၃၀ → ၀၆:၀၀) နဲ့ **realtime room** (လစာ / attendance event = သက်ဆိုင်သူ user room ပဲ)။ **ဖွင့်ထားဆဲ (§7):** D-PAY-08 tax / service charge အစဉ် 🟡 (ဖွင့်မှ အတည်ပြု) — OPEN-40 ကို v1.4 မှာ ပိတ်ပြီး (အောက်က အချက်)။
- **v1.4 (owner 02/Oct — "OPEN-40 OK"):** OPEN-40 **ပိတ်ပြီ (🔒)** — (a) payroll ပြန်ဖွင့် (reopen) ရင် အဲ့ run ရဲ့ လစာ expense row တွေကို **အပြီး မဖျက်ဘဲ "ဖျက်ပြီး" အမှတ် (soft delete — reason "Payroll reopened — <အကြောင်းပြချက်>")** နဲ့ ထား၊ finalize ပြန်လုပ်ရင် row အသစ် (DB Part 7 v1.2) · (b) မှားထည့်မိပြီး မသုံးရသေးတဲ့ လစာ row / commission plan assignment ကို ပြန်ရုပ်သိမ်းရင် **archive** မှတ် (`archived_at` — DB Part 5 v1.2; အပြီးဖျက် ✖) · (c) DRAFT purchase / transfer ထဲက ဖြုတ်လိုက်တဲ့ line = ဖျက် + audit မှာ အရင် / အခု အပြည့် (booking item — owner A2 အတိုင်း; DB မပြင်)။ API endpoint / screen ပုံစံ မပြောင်း။ **Repo ၂ ခု (ADR-016):** spec / စာရွက်စာတမ်း = `point-sdd`၊ code = `point-barber` (§4.1)။
- **ကြီးလာရင် ပြန်စဉ်းစားရမှာ (§6):** API instance ၂ ခု ဖြစ်ရင် (Redis adapter / rate-limit store) · company ၂ ခု ဖြစ်ရင် (RLS — D-ORG-03) · offline V2 · iOS push · report နှေးရင် (materialised view — ADR-015) · Chromium က API ကို ထိခိုက်ရင် (renderer container သီးသန့် — ADR-013)။

---

## 1. Requirements

### 1.1 Functional (from the locked decisions)
| Area | What the system does | Decisions |
| --- | --- | --- |
| Service delivery (POS) | Barber records each customer in real time on their own phone: START → services → COMPLETE → payment → FINISH; proxy for a colleague without a phone; late entry after outages | D-VIS-01..13, D-AUTH-07 |
| Sales & money | Immutable finished sales with gapless receipt numbers, cash / KBZPay / split, KBZPay reference + verification, discount codes + in-app approval, refunds / adjustments; **no money write on a closed branch-day** (DayLock — Part 7); receipts rendered on the server and stored (ADR-013) | D-PAY-01..09, D-SVC-04, D-FIN-06 |
| Booking | Staff and public bookings, any-order selection, option services with exact prices, home service, DB-enforced no double booking, no-show timer, manage link (no SMS / e-mail) | D-BKG-01..23, D-CUS-04/05 |
| People & access | Employees = users (1:1), roles composed from granular permissions with branch scope, Google / e-mail-OTP login, server sessions, devices | D-EMP-*, D-ROLE-*, D-AUTH-* |
| Scheduling & attendance | Weekly patterns → daily shifts, leave (pending blocks), QR + GPS clock-in, exceptions → payroll | D-SCH-*, D-LV-*, D-ATT-* |
| Commission & payroll | Tiered commission plans, estimate at checkout / final at period end, payroll run wizard, payslips, advances / loans; **pay data private — company scope only** (owner C1 — ADR-012 A1); finalize locks the period (PayrollLock) | D-COM-*, D-PAYR-* |
| Finance | Daily closing per branch (expected cash formula), cash out / return, expenses, manual income, P&L; company-wide money rows and the company P&L need company scope | D-FIN-* |
| Inventory | Products, stock ledger (one writer — `StockLedger.post`), purchases, two-step transfers, counts, barber usage; nightly ledger check | D-STK-* |
| Platform | Bilingual UI (MM / EN), settings store, audit, in-app notifications, import / export, backups, maintenance mode | D-PLT-*, D-AUD-*, D-NTF-*, D-DAT-* |
| Reports & dashboards | The ten fixed reports (one code each), dashboards, exports — live queries ≤ 366 days (ADR-015) | D-RPT-01, D-KPI-*, D-DSH-*, D-DAT-02 |
| Documents & files | Receipt / payslip / report PDFs and printer PNGs from one server renderer (ADR-013); attachments, staff documents, website images in the owner's bucket (ADR-014) | D-PAY-06/07, D-PAYR-07, D-FIN-03, D-EMP-03, D-WEB-03 |
| Public website | Server-rendered site fed by the admin data, booking modal, SEO / link previews | D-WEB-*, D-UX-05 |

### 1.2 Non-functional
| Dimension | Requirement | Source |
| --- | --- | --- |
| **Correctness of money** | No float money; finished records immutable; every money action idempotent and audited; DB constraints as the last line (exclusion, unique references, gapless counters, CHECKs) | D-PLT-04, D-VIS-08/10, D-AUD-02, review §5.4 |
| **Latency** | Tap feedback < 100 ms; POS / booking API p95 ≤ 400 ms; LCP ≤ 2.5 s on a mid-range Android over 4G | AD-PERF-01, FE-PERF-01 |
| **Availability** | Single shop; downtime = paper + late entry (D-VIS-13). Target: no silent outages (uptime check + alerting), restore within hours from a daily backup, **RPO ≤ 24 h (daily — owner accepted 01/Oct 21:20, ADR-002)**; hourly WAL archiving = revisit trigger (§6) | D-DAT-03, REC-38 |
| **Security** | Backend-enforced permission + branch scope; sessions revocable instantly; public API exposes public fields only; audit append-only; secrets outside the repo | D-ROLE-03, D-AUTH-06, D-AUD-02, review §3.9 |
| **Operability / handover** | As few services as possible; runbooks; a new developer can continue from the repo + docs | D-PLT-06, review §5.1 |
| **Timeline / team** | 2 developers + Claude Code, V1 in ~1 month, no release split | D-PLT-14 |
| **Localisation** | MM / EN strings from language files; Myanmar Unicode; MMT business dates | D-PLT-03/15 |

### 1.3 Load estimate (from the Fresha live study, review §4.2)
| Metric | Today | Design headroom |
| --- | --- | --- |
| Branches / staff | 3 / 13–15 | 10 / 50 without changes |
| Services per day (all branches) | ~90 (peak ~20 / hour) | 1,000 / day |
| Sales rows per year | ~30k (+ items, payments ≈ 100k rows) | 1 M rows / year before any partitioning thought |
| Concurrent staff users | ≤ 15 (phones) | 100 |
| Public site | tens of visits / day; bookings 0 % today → maybe 10–30 / day | 10k page views / day from cache |
| Realtime connections | ≤ 20 | 500 on one instance |
| Peak API rps | < 5 | 200 on a 2–4 vCPU VPS |

**Conclusion:** load is not a design driver. Correctness, resilience to flaky connectivity / power, and operability are. This justifies the modular monolith and the "one VPS, Docker Compose" choice (ADR-001) and rules out Kubernetes, Redis, message brokers and microservices for V1.

### 1.4 Constraints
- Platform: one backend + one DB (🔒 D-PLT-02), web core + Android APK + Windows EXE, iOS PWA (🔒 D-PLT-01/10); the stack itself — NestJS + PostgreSQL + Prisma, Next.js (App Router), Tailwind / shadcn — is the owner's brief confirmed in review §5.2 and the base of the DB / API docs (ADR-001).
- DB design is locked (91 tables, Part 1 v3.4) — the API serves it; schema changes go through version bumps.
- Myanmar connectivity: mobile 4G with gaps, power cuts; no offline mode in V1 (paper + late entry).
- Printing only from Android via Bluetooth (D-PAY-07) → Capacitor shell (ADR-003); the printed image is rendered on the server (ADR-013 — owner H).
- Files and off-site backups in the **owner's own cloud bucket** (R2 / B2 — owner F4, ADR-014); reports are live queries up to one year (owner H (4), ADR-015).

---

## 2. High-level design

### 2.1 Components
```
                 Internet (customers · staff phones · owner PC)
                                   │  HTTPS (Caddy, auto TLS)
 ┌─────────────────────────────────┴──────────────────────────────────┐
 │  Caddy (reverse proxy)                                             │
 │   <domain>/*            → Next.js  site/ tree   public pages + modal│
 │   <domain>/api/v1/public/* (incl. /public/media), /health,          │
 │                           /system/status → NestJS                   │
 │   app.<domain>/*        → Next.js  staff/ tree  staff PWA           │
 │   app.<domain>/api/*    → NestJS  (/v1)         staff API           │
 │   app.<domain>/rt       → NestJS  Socket.IO     realtime (ADR-008)  │
 │   /api/v1/internal/*, /internal/* → 404 from outside (ADR-009)     │
 │   body cap = upload limit + 1 MB · inbound X-Internal-Key stripped │
 └──────┬───────────────────────────────┬─────────────────────────────┘
        │                               │
 ┌──────▼──────┐   REST/JSON      ┌─────▼──────────────────────────────┐
 │  Next.js    │ ───────────────► │  NestJS modular monolith            │
 │  site/+staff/│   (server comps │  modules: auth · people · catalog · │
 │  SSR + ISR  │    + browser;    │  scheduling · booking · delivery ·  │
 │  tag cache  │    SSR → api:3001│  sales · cash/closing · commission ·│
 │             │    + X-Internal- │  payroll · finance · inventory ·   │
 │             │    Key)          │  platform (settings, audit, notify, │
 └─────────────┘ ◄─── revalidate ─│  files, import / export, reports,   │
                   (internal job) │  backup, site)                      │
   Socket.IO /rt  ◄──────────────►│  + pg-boss workers (same process)   │
   (staff PWA)                    │  + DocumentRenderer → headless      │
                                  │    Chromium child process (ADR-013) │
                                  └──────┬───────────────────┬──────────┘
                                         │ Prisma + raw SQL  │ S3 API (put / get / presign)
                                  ┌──────▼──────────────┐    │
                                  │ PostgreSQL 16       │    │
                                  │ (one DB) 91 tables ·│    │
                                  │ constraints ·       │    │
                                  │ triggers · pg-boss ·│    │
                                  │ audit_events        │    │
                                  └──────┬──────────────┘    │
         backup sidecar (ADR-002):       │ pg_dump daily     │
         03:00 · weekly · restore test   │ + weekly          │
                                  ┌──────▼───────────────────▼──────────┐
                                  │  Owner's cloud bucket — R2 or B2    │
                                  │  (S3-compatible, ADR-014)           │
                                  │  app bucket (private, versioned 30d)│
                                  │  · attachments · receipts · exports │
                                  │  backup bucket (off-site dumps)     │
                                  └─────────────────────────────────────┘
   Staff browser ── presigned GET (5 min) ──► app bucket (private files only)
   Side services: Resend (OTP / invite e-mail) · Cloudflare Turnstile (captcha) ·
   HetrixTools (uptime → e-mail + Telegram) · Sentry (errors) — ADR-007 · Google OIDC
```
`<domain>` = ★ ACT-05 placeholder. One Next.js process serves both hosts (`proxy.ts` host rewrite — `middleware.ts` before Next 16 — → `site/` or `staff/` tree — ADR-001). Shells: Android (Capacitor — WebView + Bluetooth printer plugin + Custom Tabs for Google sign-in), Windows (Tauri — WebView2), iOS (Home-Screen PWA). All three load the hosted `app.<domain>`; Google sign-in in the shells uses the hand-off flow (ADR-005). **v1.3:** the API container also runs the `DocumentRenderer` (one headless Chromium, one page at a time — ADR-013); files go to the owner's bucket (ADR-014) — public images are streamed by the API at `/api/v1/public/media/<id>/<variant>`, private staff files are fetched by 5-minute presigned URLs, receipts are streamed through the API (the Android shell prints them).

### 2.2 Data flow — the critical path (walk-in → FINISH → receipt)
```
Barber phone ──POST /visits (Idempotency-Key)──► API: guard(session, @Can, branch) → tx { DayLock.assertOpen(branch, date)
             │                                    [422 day_closed]; insert visit + OPEN sale; audit } → emit visit.started → 201
             ──POST /sales/{id}/items───────────► price-quote (branch × location × variant × date, D-SVC-08) → insert line (snapshot) → 200
             ──POST /visits/{id}/complete───────► status COMPLETED (≥1 service) → sale totals (server) → 200
             ──POST /sales/{id}/payments (Key)──► tx { DayLock.assertOpen; insert payment (KBZPay ref unique; non-cash may exceed
             │                                    → change due — owner B5) } → remaining → 200
             ──POST /sales/{id}/finish──────────► idempotent by state (FINISHED → 200 current); READ COMMITTED tx, the one lock
             │   (no key — P4-RULE-10)            order (§3.6): DayLock (shared advisory) → PayrollLock (shared — a sale with
             │                                    SERVICE lines) → sale → visit → booking → payments → receipt counter(s)
             │                                    → stock levels; every check AFTER the locks:
             │                                    { checks (completed, paid ≥ total, day open); customer matchOrCreate; receipt
             │                                      number B3-2026-OCT-00125 (gapless); sale FINISHED (DB guard trigger);
             │                                      automatic change refund (RF number) if over-transfer; StockLedger.post
             │                                      SALE_OUT per product line; enqueue receipt.render IN the tx; audit }
             │                                    → commit → emit sale.finished / visit.finished / booking.updated → 200
pg-boss ─────── receipt.render { sales, id } ───► DocumentRenderer (HTML → Chromium) → PDF + 1-bit PNG (384 / 576 px from
                                                  receipt.printer_width_mm) → bucket (attachments, kind 1) — reprint identical
Android shell ──GET /sales/{id}/receipt?format=png► stored PNG (or render-and-store now) → shell.print → Bluetooth ESC/POS
                                                  (tap only — auto-print OFF, REC-37 ✅); iPhone / PC → PDF / Share
```
Every step is a short transaction; nothing waits on the network except the request itself. Printer failures never touch the sale (D-PAY-07). **Close-day** takes the **exclusive** advisory lock for the same branch-date **as its first statement** and every writer takes the (shared) day lock before any row lock — one lock order (§3.6, Part 0 API-IDEM-06) — so FINISH and close never deadlock; the close then reads what is committed (READ COMMITTED) and open sales refuse it (owner E2 — Part 4 P4-RULE-10, Part 7 P7-RULE-02 / 06). (Review fix 02/Oct: the earlier text took the day lock after the sale, visit and booking rows.)

### 2.3 API contracts
Defined in `docs/api/00-conventions.md` (surfaces, auth, permission, errors, idempotency, realtime) and per part (`01-foundation.md` … `08-platform.md` + OpenAPI — all 🔒 D-API-01..09). Contract rules that matter architecturally: numeric status codes mirror the DB; money is integer; every endpoint that **creates a money row** whose table has `client_request_id` requires `Idempotency-Key` (visits START, payments, refunds, product-only / difference sales, cash outs, cash returns, expenses, manual incomes, receivables, repayments, stock usage / manual adjust — Part 0 v1.5 wording); **state changes** (FINISH, purchase post, count post, transfer send / receive, close, reopen, finalize, mark paid, approve) are idempotent **by state check** (repeat → 200 current state or 409 `invalid_transition`); the public surface has its own DTOs. Cross-part in-process contracts (lock order, isolation and the `PayrollLock` caller list are written once in Part 0 **API-IDEM-06**): `DayLock` (Part 7), `PayrollLock` (Part 5), `StockLedger.post` (Part 6), `EffectiveSale` (Part 4), `Commission.estimate` / `Receivables` (Part 5), `Expenses.*` / `Pnl.compute` / `DailyClosings.*` (Part 7), `Attachments.*` / `Notifications.emit` (Part 8), `DocumentRenderer` (ADR-013).

### 2.4 Storage
| Store | Holds | Why |
| --- | --- | --- |
| PostgreSQL (one DB) | All business data, settings, audit, notifications, sessions, OTPs, jobs (pg-boss schema) | One backup, one restore, transactional integrity across modules; constraints enforce rules (D-DB-*) |
| Object storage — **owner's S3-compatible cloud bucket (Cloudflare R2 or Backblaze B2 — owner F4, ADR-014)**; *v1.2 option "MinIO on the VPS" dropped (MinIO = optional dev stand-in only)* | **App bucket (private, versioning 30 days):** receipt PDF + PNG (stored — identical reprints), expense / income attachments, staff documents (private), website images + WebP variants, import files (90 days), export files (24 h) · **backup bucket:** daily / weekly `pg_dump` | Keeps the DB and VPS disk small; off-site by design (D-DAT-03); 5-minute signed URLs for private files; stable public media path for website images |
| Browser (PWA) | Session cookie, per-device preferences, in-memory booking progress | No business data cached offline in V1 (D-VIS-13) |
| Next.js data cache | Rendered public pages by tag | Fast, resilient site (REC-35) |
| *Not stored* | Payslip files (rendered on demand from the payroll snapshot — ADR-013); report results (live — ADR-015); sync exports ≤ 5,000 rows (streamed) | Nothing to keep in sync |

### 2.5 Other data flows (API Parts 5–8 — v1.3)

**Daily closing** (Part 7 P7-RULE-02..07 — 🔒 D-FIN-06, owner E1 / E2 / E3 / E7):
```
Manager ── Cash Out "Takings to owner / bank" BEFORE counting (E1 — Idempotency-Key, DayLock shared)
        ── PUT  /daily-closings/{branch}/{date}        draft: count + reasons (components recomputed; no business check)
        ── GET  /daily-closings/{branch}/{date}        preview: one REPEATABLE READ READ ONLY snapshot (read-only — ADR-015)
        ── POST /daily-closings/{branch}/{date}/close ─► READ COMMITTED tx { DayLock.lockExclusive = the FIRST statement (waits
                 for in-flight writers); then every check on what is committed now: earlier day open → 409 previous_day_open;
                 a sale that could still finish on that date — for a past date also any OPEN sale holding payments received
                 on or before it — → 409 open_sales_exist (E2); components computed after the lock (EffectiveSale methods,
                 cash refunds, cash outs / returns, cash manual income incl. PENDING — E7); body figures ≠ live → 409
                 closing_changed; reasons; snapshot; CLOSED } → closing.closed (+ closing.difference)
From commit: every drawer write of that branch-day → 422 day_closed (START, FINISH, payments, refunds, cash outs / returns,
cash income); KBZPay verify still allowed (E3); admin reopen (`closing.reopen`, reason — same exclusive lock first; allowed
inside a finalized payroll period with the warning payroll_finalized_period) → fix the source rows → close again.
Why READ COMMITTED: a REPEATABLE READ snapshot is fixed at the first statement — the lock call itself, before the wait — so a
payment committed while the close waited would be invisible to its checks (review fix 02/Oct — ADR-015 #1a, API-IDEM-06).
01:00 daily  closing.month_end_must_return ─► per MUST_RETURN cash out whose month is fully CLOSED at its branch: outstanding
             → source-5 expense dated the last day of that month (row FOR UPDATE, once — expenses_one_per_cash_out; D-FIN-09)
```

**Payroll** (Part 5 P5-RULE-05..12 — 🔒 D-PAYR-01..08, owner C1 / C4 / C5 / C6 / C7; private — ADR-012 A1):
```
Admin (company scope) ── create run → calculate (synchronous: basic prorated by calendar days, commission by marginal tiers,
      attendance items, advance / loan instalments capped so net ≥ 0) → review → finalize ─► period ended AND
      DailyClosings.openDays = ∅ for every branch (else 409 closings_open — C7) → tx { FINALIZED; Expenses.postPayroll(run, actor):
      one SALARY expense per branch allocation (source 3) } — finalize / reopen hold PayrollLock EXCLUSIVE; calculate /
      finalize refused while an earlier period's run is not FINALIZED+ (409 earlier_run_open); warning pending_leaves
      → PayrollLock (shared advisory lock, then the check): attendance / shift / leave create · edit · approve · reject ·
      cancel / salary / plan writes, late-entry START, FINISH of a sale with SERVICE lines and performer adjustments inside
      the period → 423 payroll_finalized (correction = a manual payroll line — B9) → publish → payslip.published
      (mandatory, user rooms)
      → mark paid (one date — C4; repayment rows written now)
Reopen (latest run only, never PAID) → payslip.revised; tx { Expenses.removePayroll(run, actor, reason): soft-delete the run's
      source-3 salary expenses (deleted_at, by = actor, reason "Payroll reopened — <reason>"); then the allocations are deleted
      (DB Part 7 v1.2: FK ON DELETE SET NULL; a NULL allocation on source 3 only when deleted_at IS NOT NULL) } → the next
      finalize posts fresh expense rows — no hard delete (owner 02/Oct/2026 — OPEN-40 OK, (a) = B; §7 item 1).
```

**Stock ledger** (Part 6 P6-RULE-02 / 14 — 🔒 D-STK-01..06, owner D1–D9, B8 a):
```
FINISH ─► StockLedger.post SALE_OUT per product line (sale branch)   refund ─► SALE_RETURN_IN (+ MANUAL_ADJUST "damaged" — B8 a)
purchase post (Admin — D2) ─► PURCHASE_IN per line + Expenses.createAuto per branch (source 4 — D1 / D3)
transfer send / receive ─► TRANSFER_OUT / TRANSFER_IN (two branches)   usage · count post · adjustment ─► their movements
All inside the caller's transaction; stock-level rows locked last; negative stock allowed with a warning + flag (D5).
01:30 stock.reconcile_levels ─► Σ movements vs quantity_on_hand ─► stock.level_mismatch (read-only; repair = P6.STK.08)
```

**Files, documents, reports, exports** (Part 8 — ADR-013 / 014 / 015):
```
Upload   POST /attachments (multipart) → magic bytes (CSV: text test), EXIF / GPS strip, WebP 400/800/1600 → bucket + staging row (24 h)
         → the business write links it in its own tx (Attachments.link / replace) → uploads.purge (hourly) removes leftovers
Private  GET /attachments/{id}/url → owning entity's read policy → presigned GET (5 min) → browser ↔ bucket
Public   GET /api/v1/public/media/{id}/{variant} → referenced by a public field? → API streams, Cache-Control public,
         max-age=86400 + ETag (own limit 600 / min / IP) : 404
Payslip  GET /me/payslips/{entry}/file → DocumentRenderer on demand (employee's language) → never stored
Report   GET /reports/<key> → report code + scope → one REPEATABLE READ READ ONLY tx, 15 s, ≤ 366 days → ReportResult
Export   POST /exports → data.export + source read right → count: ≤ 5,000 CSV / XLSX → 200 stream │ > 50,000 → 422
         │ otherwise / any PDF → 202 → export.run → exceljs / DocumentRenderer → bucket (24 h) → export.ready → My exports
Import   upload → create → map → import.run validate → preview → import.run confirm (one tx, ≤ 10,000 rows, master data — F5)
```

---

## 3. Deep dive

### 3.1 Data model — review of the locked schema against the API
- **Fits:** every API resource maps 1:1 to a table group; status codes are smallint with CHECKs; snapshots on lines; `business_date` on transactions; `client_request_id` unique on visits / sales / payments / refunds / cash-outs / returns.
- **Gaps closed during API design:** `users.ui_language`, `employees.show_own_earnings` (nullable), `employees.public_rating` (Part 1 v3.4); settings keys added to `settings.json` only (no migration — D-PLT-16).
- **Watch items:** (a) `bookings` has no `client_request_id` → ADR-004; (b) `settings_history` FK + trigger → reset is an UPDATE (Part 1 P1.SET.04); (c) `employee_roles` has no `revoked_by` → audit carries it; (d) 3 polymorphic references without FK (`attachments`, `audit_events`, `notifications`) → app-level checks + a weekly integrity job (⚠️ runbook).

### 3.2 API — review of Parts 0 / 1
| Check | Result |
| --- | --- |
| Authentication | Opaque server session in an HttpOnly, host-only cookie (`Max-Age` 400 d, re-issued); revocation is immediate (row flag) — correct for "stay signed in + admin revoke" (D-AUTH-06). CSRF covered by header + Origin check (API-AUTH-02). Single origin (ADR-009) removes the cookie-domain / CORS surface entirely. **Found in review:** Google OIDC cannot run inside the Capacitor WebView / iOS PWA → system-browser login + verifier / challenge hand-off polled by the app (P1.AUTH.03/04/06, ADR-005) |
| Authorisation | Guard evaluates permission AND branch scope from one grant set per request; codes = **CRUD per menu + named special actions** (`view⁺` for management reads; operational reads open in read scope); lists are scope-filtered, out-of-scope reads 404; no-escalation (company admins = all five role codes, exempt — otherwise new codes could never be granted) and last-admin rules fixed in code; everything else composable by the admin (ADR-011, P1-RULE-12); **how far a grant reaches = the target's data level** — company master writes need company scope (branch scope = read-only), branch data needs the branch, shared customers accept any assignment with history filtered to the read scope (ADR-012, API-PERM-07); **v1.3 — private level** (pay data, report ⑦, staff documents): company scope only, a branch-scope grant reaches nothing, lists 403; company-wide money rows and the company P&L need company scope; audit rows filtered per row (ADR-012 Amendment 1 — §3.8) |
| Idempotency | Row-level `client_request_id` for money; replay = 200 same resource; in-progress = 409; mismatch = compare identifying fields (no stored hash — accepted limitation at this scale) |
| Error contract | problem+json with language-key codes — matches AD-FORM-04 / FE-BK-11; field errors map onto forms; no English leaks to users |
| Public surface | Separate controllers / DTOs; availability `no-store`; captcha + rate limit; manage token hashed; no customer PII except the masked phone on the manage page |
| Bootstrap | `/me` returns grants + scope + effective flags once; realtime `session.updated` invalidates — avoids per-request permission chatter on the phone |
| Risk noted | Rate limiting state lives in-process (fine for one instance; see §6). OTP e-mail delivery is a hard dependency for login — ADR-007 uses Resend (status page; Free plan 100 / day is enough for staff OTP + invites) and Google login stays the second path (also the only path in the pilot until the domain exists) |

### 3.3 Caching
| What | Strategy | Invalidation |
| --- | --- | --- |
| Public pages (`/`, `/branches/[code]`) | Next.js server data cache with tags (`home`, `site`, `branch:<code>`, `barbers`, `services`) + 5-min time fallback; `.next/cache` on a volume; **"Open now" computed in the browser from `hours` + closures + `server_time`** (never cached as text — v1.3) | event `site.content_changed` → job `site.revalidate` (transactional) → `POST http://web:3000/internal/revalidate` (secret, Docker network) — ADR-006; `barbers` also nightly after `shifts.generate` and on shift / branch-assignment / public-profile changes (P8-RULE-13) |
| Public images (`/api/v1/public/media/<id>/<variant>`) | `Cache-Control: public, max-age=86400` + `ETag` (ADR-014 — review fix 02/Oct: one day, not one-year `immutable`) | none needed — a new upload is a new id; a field that stops being public → 404, and browsers drop their copy within a day (a conditional request gets 304 only while the image is still public) |
| Reports, dashboards, P&L, closing preview | **Never cached** — live queries in one snapshot with `generated_at` (ADR-015) | – |
| Booking modal catalogue (`/public/booking/options`) | 60 s in-memory cache per branch in NestJS | Time-based + cleared by `site.revalidate` for the branch (D-WEB-01 "immediately") |
| Availability | **Never cached** (D-BKG-08 correctness) | – |
| Reference data in the PWA (services, prices, employees, settings, reasons) | TanStack Query, stale-while-revalidate | Realtime `settings.changed` / entity events + refetch on focus (AD-PERF-03) |
| Permission grants | In the session payload; recomputed per request from 3 small tables (indexed) — no cache needed at this scale | `session.updated` for the client copy |

### 3.4 Jobs and events (pg-boss — ADR-002)
*The canonical job list — with idempotency and retry for every job — lives in ADR-002 (amended 02/Oct). Summary (MMT; "✔" = dead letter raises `job.failed`, category 6 SECURITY, mandatory — ADR-007):*

| Job | Part | Schedule / trigger | Notes |
| --- | --- | --- | --- |
| `shifts.generate` | 2 | cron 00:30 · inline on pattern save / day reset (P2.PAT.02 / P2.SHF.08) · on demand P2.SHF.06 | Patterns → `schedule_shifts` for today … advance window + 7 days (diff-based, P2-RULE-07); then `site.revalidate(barbers)` · ✔ |
| `booking.noshow_alarm` / `booking.noshow_autocancel` | 3 | alarm at `starts_at`; each snooze a new alarm 10 min later (≤ 4 — count = `booking.noshow_snooze` audit rows); auto-cancel at `starts_at` + 40 | Data `{ booking_id, starts_at, snooze_seq }`; **no singletonKey** — each job locks the booking row and runs only if still BOOKED with the same `starts_at` / current `snooze_seq` (stale = no-op, START wins); recipients = booked barber + that branch's managers (P3-RULE-08; D-BKG-17); both jobs skip a booking whose date is inside an active closure of its branch (owner F8) · ✔ |
| `attendance.detect_exceptions` | 5 | every 15 min (ABSENT, automatic clock-out) · 23:55 (INCOMPLETE) | DB partial uniques; skips finalized periods; creates only (P5-RULE-14; D-ATT-03 / 04) · ✔ |
| `closing.month_end_must_return` | 7 | **01:00 daily** (review fix 02/Oct — was "on the 1st") | acts on a MUST_RETURN cash out only once every day of its month that needs closing at its branch is CLOSED (🔒 D-FIN-09 "until the month-end closing"): outstanding → source-5 expense dated the last day of that month, row `FOR UPDATE`, one tx per cash out, `expenses_one_per_cash_out` (P7-RULE-12) · ✔ |
| `stock.reconcile_levels` | 6 | **01:30** daily | read-only ledger vs cache → `stock.level_mismatch` (P6-RULE-14; owner H (5)) · ✔ |
| `notifications.purge` (renamed from `notifications.cleanup`) | 8 | **02:00** daily | 90-day hard delete in batches of 5,000 (D-NTF-02, F-P8-04) · ✔ |
| `backup.watchdog` | 8 | **06:00** daily | no daily success since yesterday 06:00 / no restore test in 35 days → `backup.failed` · ✔ |
| `uploads.purge` · `exports.purge` | 8 | **hourly** | staging > 24 h, objects of deleted rows, import files > 90 d · export files > 24 h (ADR-014 / 015) · ✔ |
| `integrity.check_weekly` | 8 | weekly (★ day / time at build) | polymorphic references (§3.1) + bucket object of every live attachment row · ✔ |
| `auth.cleanup` | 1 | hourly | expired `login_otps` rows · – |
| `site.revalidate` | 8 (handler; enqueued by website writes of 1 / 2 / 8) | on content change — enqueued **inside the write transaction** | retries 3× with backoff; the 5-min fallback covers the rest · – |
| `receipt.render` | 4 | on FINISH / refund — **in the transaction** | DocumentRenderer → PDF + 1-bit PNG → bucket; skips when stored; GET renders on the fly meanwhile (ADR-013; owner H) · ✔ |
| `export.run` | 8 | on demand (202) — CSV / XLSX > 5,000 rows, every PDF, QR posters | file kept 24 h → `export.ready` (ADR-015) · – (requester sees the failure) |
| `import.run` | 8 | on demand — validate / confirm | confirm = one transaction, ≤ 10,000 rows (F5) · – (importer sees FAILED) |
| `sync.code_tables` | 1 (Part 8 adds `notifications.json`) | on deploy / startup | `permissions.json`, `settings.json`, `notifications.json` → DB (D-ROLE-08, D-PLT-16, D-NTF-03); new permission codes → company-admin roles (ADR-011) · ✔ |
| `email.send` | 1 | OTP / invite only (D-AUTH-01, D-EMP-02) | Resend with retries (Mailpit in dev / staging); OTP jobs expire after 5 min; invites over the 100 / day cap are queued · – |

**Backup sidecar (not pg-boss):** `pg_dump` daily 03:00 (30 days) · weekly Sunday (1 year) · restore test 1st 04:00 automatic (owner F9) → `/v1/internal/backup-runs` → `backup_runs` (D-DAT-03, ADR-002). **Night timeline:** 00:30 shifts → 01:00 month-end must-return check (daily; converts only once the branch's month is fully closed) → 01:30 stock check → 02:00 notification purge → 03:00 backup → 04:00 (1st) restore test → 06:00 watchdog · 23:55 INCOMPLETE detection.

**Event rule (review §5.3):** modules communicate through in-process domain events emitted after commit (`sale.finished` → commission estimate, closing cache, notifications, realtime). No outbox table (D-DB-12): a crash between commit and emit loses the *event* but never the *data*; consumers are designed to tolerate that (recompute from data on the next read: closing totals are computed, not accumulated; realtime clients refetch on focus; revalidate has the time fallback). Jobs that must not be lost (`site.revalidate`, `receipt.render`, no-show timers) are enqueued inside the business transaction instead. This is the deliberate trade-off recorded in ADR-002. **Job owners (review fix 02/Oct — one label everywhere, as ADR-002):** each job belongs to the part whose module implements its handler — `email.send`, `auth.cleanup` and `sync.code_tables` = Part 1; `site.revalidate` = Part 8 (Parts 1 / 2 / 8 enqueue it). Synchronous cross-part calls that must share the business transaction (`DayLock`, `PayrollLock`, `StockLedger.post`, `Expenses.createAuto` / `postPayroll`, `Receivables.issue`, `Attachments.link`) are **service calls inside the caller's transaction**, not events (ADR-001 rule 1).

### 3.5 Error handling and retry
| Layer | Policy |
| --- | --- |
| Client (PWA) | Money submits: disable button, keep `client_request_id` across retries, 15 s timeout → "checking whether it was saved" (lookup by key) → retry with the same key (AD-NET-01/02). No optimistic money UI. Network banner + paper fallback (AD-STATE-05) |
| API | Validation → 400; business rule → 422 with code; DB constraint violations mapped to codes (exclusion → `slot_taken` + nearest free times, unique ref → `duplicate_reference`, counter lock timeout → retry once internally); unexpected → 500 with `request_id` + error tracking |
| Jobs | pg-boss retry with backoff (3×), then dead letter + **`job.failed`** (category 6 SECURITY, mandatory — to company-scope `settings.update` holders, fallback company admins) for every money- and data-relevant job (ADR-002 table, P8-RULE-18); user-started jobs report to their requester (`export.ready` failed, import FAILED) |
| Rendering / storage | Render timeout or Chromium crash → browser restarted, job retried; an on-demand receipt renders on the fly (ADR-013). Bucket unreachable → upload 5xx (client retries), store jobs retry; private URLs and public images fail until it is back (ADR-014) |
| Reports | `statement_timeout` 15 s → 422 `report_timeout` ("narrow the range"); range > 366 days → 422 `range_too_long` (ADR-015) |
| External (e-mail, captcha, Google) | Timeouts 5 s; e-mail queued; captcha failure → 403 `captcha_failed` (customer retries); Google failure → redirect with error, OTP path still works |

### 3.6 Time and money correctness
- All `*_at` stored as `timestamptz`; `business_date` computed in `Asia/Yangon` at the API boundary and validated by DB CHECKs (D-PLT-15). Tests must cover the 00:00 / 06:30 UTC boundary.
- Money as `bigint` end to end; JSON integers; totals computed server-side only; rates as `numeric`.
- Immutability by DB trigger on FINISHED sales / CLOSED days / FINALIZED runs (review §5.4) — the API's state check is a courtesy (409 `invalid_transition` with `correction_path` for a FINISHED / CANCELLED sale, a POSTED purchase and a SENT / RECEIVED / CANCELLED transfer; 423 `locked` for a CLOSED closing row, a FINALIZED+ run, an APPROVED expense / income — reconcile 02/Oct), the trigger is the guarantee. **v1.3:** DB Part 4 v1.2 adds the guard triggers `sales_finished_guard`, `sale_items_finished_guard`, `payments_finished_guard`, `visits_final_guard` (sheet G (f) — only the customer, KBZPay reference and verification may change after FINISH — owner B10 / E3).
- **Day lock (Part 7 `DayLock`):** every drawer write asserts its branch-date is open under a **shared** transaction-scoped advisory lock (`day:<branch>:<date>`); close / reopen take the **exclusive** lock first → a close waits for in-flight writers and every later writer sees CLOSED (422 `day_closed`, `correction_path: "reopen"`). Exempt: KBZPay verify (E3), expenses (not drawer money), the month-end job. The day lock is always taken **before any row lock** (lock order below).
- **Payroll lock (Part 5 `PayrollLock`)** — review fix 02/Oct: it is a **transaction-scoped advisory lock per company payroll**, not a plain status read. `PayrollLock.assertNotFinalized(tx, { employee_ids?, dates })` takes it **shared** and then answers 423 `payroll_finalized { employee_id, run_id, period: { start, end }, status }` when a date lies in a FINALIZED / PUBLISHED / PAID run's period; **finalize and reopen take it exclusive**, so a correction can never commit between finalize's checks and its commit. Callers: Part 2 shift writes and leave create / edit / approve / reject / cancel · Part 4 late-entry START, FINISH of a sale with SERVICE lines (the correction is a manual payroll line — owner B9) and the PERFORMER adjustment · Part 5 attendance writes, salary and plan rows. `AttendanceDetector.redetect` skips dates in finalized periods. A day **reopen** (Part 7) is allowed inside a finalized period and answers with the warning `payroll_finalized_period { run_id, period }`; finalize adds the run warning `pending_leaves { count }` and itself requires every branch-day of the period CLOSED (owner C7).
- **Lock order — one order in every part** (no deadlocks; Part 0 API-IDEM-06 — review fix 02/Oct, the earlier text locked sale rows before the day lock): **(1) day lock** (advisory `DayLock` — shared for writers, exclusive for close / reopen and then **the first statement of the transaction**) → **(2) payroll lock** (advisory — shared for writers, exclusive for finalize / reopen) → **(3) rows**: sale → visit → booking → payments → receipt counter → cash-out / closing rows → **stock-level rows last** (sorted by branch, product — Part 6). A transaction takes only the locks it needs but never out of this order; rows a single part adds keep the position that part states inside this order — Part 4: discount code → customer after the booking, the KBZPay-reference advisory lock with the payments; Part 7: cash-return / expense / income rows with the cash-out / closing rows; Part 6: the purchase / transfer / count header just before the stock levels.
- **Isolation** (review fix 02/Oct — ADR-015 #1a): every transaction that writes money, stock or pay data — **close and reopen included** — runs **READ COMMITTED** with its locks taken first and **every check after the locks**; `REPEATABLE READ READ ONLY` is for previews, reports, exports and dashboards only. (A REPEATABLE READ snapshot is fixed at the first statement — the lock call, before the wait — so a write committed during the wait would be invisible.)

### 3.7 Realtime rooms (ADR-008 + amendment 02/Oct)
Rooms are joined server-side (API-RT-01): `user:<id>` · `branch:<id>` for every branch in the read scope (a code-less barber still gets their branches) · `company` for users with **any** company-scope grant. Payloads carry ids / status only and clients refetch (no amounts — ADR-008; Part 7 P7-RULE-19). **Rule added with Parts 4–8: events about private or person-sensitive data go to computed `user:` rooms, never to `branch:` / `company`.**

| Room | Events (part) |
| --- | --- |
| `branch:<id>` | `booking.created` / `updated` / `cancelled` / `started` (3 / 4) · `visit.*`, `sale.updated` / `finished` / `cancelled` / `adjusted`, `payment.voided` / `verified`, `refund.created`, `discount_request.*` (4) · `stock.changed`, `stock.low`, `stock.transfer_*`, `stock.purchase_posted`, `stock.count_updated` (6) · `closing.*`, `cash_out.*`, `cash_return.*`, branch `expense.updated` / `income.updated` (7) · `schedule.changed` (2 / 8 closures), `eligibility.changed`, `leave.*` (2) · `catalogue.changed` (every branch room for company-wide entities — 2) |
| `company` | `settings.changed` (1 / 8) · `closing.*` (also) · company-wide `expense.updated` / `income.updated` (7) |
| `user:` — the person concerned | `session.updated` / `revoked` (1) · `notification.created` / `updated` / `read_all` (8) · `booking.*` of the booked barber (3) · `payslip.published` / `revised`, own `attendance.*`, own `receivable.changed` (5) · `export.ready`, `import.updated` (8) · `discount_request.decided` to the requester (4) |
| `user:` — computed holders | `booking.noshow_alarm` / `noshow_snoozed` (booked barber + branch managers — 3) · `discount_request.created` (approvers — 4) · `attendance.clocked` / `exception_detected` / `exception_resolved` (`attendance.view` / `resolve` holders covering the branch — 5) · `payroll.run_updated`, `receivable.changed`, SALARY `expense.updated` (company-scope `payroll.*` holders — private, 5 / 7) · `backup.run_updated` (company-scope `backup.view` holders — 8) |

**Payloads carry ids + status only — no amounts, every event** (ADR-008 "ids only, then an authorised refetch"; API-RT-02). Reconciled 02/Oct: Parts 4 / 5 payloads made ids-only (`sale.updated`, `sale.finished`, `refund.created`, `receivable.changed`; also Part 6 `stock.purchase_posted`).

### 3.8 Security levels (ADR-011 / 012 + Amendment 1)
| Level | What | Write | Read | Examples of codes |
| --- | --- | --- | --- | --- |
| **Company master** | rows that exist once for the company | company scope (else 403 `company_scope_required`) | any grant of the module — read-only at branch scope. **Exception (review fix 02/Oct):** imports and backups (`import.run`, `backup.view`, `backup.restore` — P8.IMP.01–08, P8.BAK.01 / 02) and the jobs panel are **read at company scope only** — import files hold every branch's data, backup runs are system-wide state (API-PERM-03 / 07) | `service.*` master fields, `role.*`, `payment_method.*`, `discount.create/update/delete`, `product.*`, `supplier.*`, `cashout_reason.*`, `finance_category.*`, `notification.*`, `import.run`, `backup.*` |
| **Branch data** | rows of one branch | grant covers **every** branch touched | filtered to the grant's branches (two-branch records: **any** of them) | `visit.*`, `sale.*`, `payment.*`, `attendance.*`, `stock.*`, `purchase.*`, `transfer.*`, `closing.*`, `cashout.*`, `audit.view` (+ row rules), reports ①–⑤ ⑧–⑩ |
| **Mixed** | endpoint decides per request | per target | per target | `service.view/update`, `settings.*`, `discount.view`, `expense.*`, `income.*`, `pnl.view`, `website.*`, `data.export` |
| **Shared record** | customers | any assignment | record visible; history filtered to the read scope | `customer.*` |
| **Private** (A1 — owner C1 / F11) | pay data, report ⑦, staff documents | **company scope only** | **company scope only** — a branch-scope grant reaches nothing; lists 403 | `commission.*`, `payroll.*`, `payroll_category.*`, **`receivable.issue`** (review fix 02/Oct — owner C1 + C2: issue / change / repay / cancel an advance or loan, and edit / cancel a staff-advance cash out; the **taker** of such a cash out — employee, note, receivable link — is shown only to company-scope holders of `payroll.view` **or** `receivable.issue` and to the employee, everyone else sees "Staff advance" — Part 7 P7-RULE-01, reconcile 02/Oct), `report_commission_payroll.view`, `employee.documents` — 18 codes (ADR-012 A1-1) |
| **Company-wide money rows** (A1 — Part 7) | expenses / incomes with no branch, company P&L | company scope | company scope — omitted from branch-scope lists, 404 on detail | (mixed codes `expense.*`, `income.*`, `pnl.view`) |
| **Audit rows** (A1 — owner F10) | branch-less rows / pay rows / staff-document rows | – (append-only) | company scope / company-scope `payroll.view` (staff-advance cash-out rows: `payroll.view` or `receivable.issue`) / company-scope `employee.documents`; a holder always sees the rows they authored; an employee-targeted action carries the acted-on branch, else the employee's primary branch (API-AUD-01 — reconcile 02/Oct); hidden rows left out (no count leak) | `audit.view` |

Own data (`@Self()`), operational reads (`@Staff()`, read scope) and public / internal surfaces sit outside the levels (API-PERM-03 / 04). Guard rails (no escalation, last admin) unchanged (ADR-011 #6).

### 3.9 Documents and files (ADR-013 / 014)
- **One renderer:** HTML templates → one headless Chromium (JavaScript off, network blocked, Pyidaungsu + Inter embedded — 🔒 D-UX-02) → PDF / 1-bit PNG; one page at a time; interactive renders before background ones.
- **Receipts:** `receipt.render` at FINISH / refund → PDF + PNG (384 px / 58 mm, 576 px / 80 mm from `receipt.printer_width_mm`) stored → reprint identical (🔒 D-PAY-06); GET renders-and-stores when the job hasn't run; auto-print OFF (REC-37 ✅). **Payslips** on demand in the employee's language, never stored. **Report / list PDFs and QR posters** via `export.run`, 24 h.
- **Files:** private bucket in the owner's account; staging upload → link in the business transaction; magic-byte type check (CSV: a text test), EXIF / GPS stripped, WebP 400 / 800 / 1600; private download = 5-minute presigned URL by the owning entity's policy (staff-document URLs audited); public images = stable `/api/v1/public/media/<id>/<variant>` streamed with one-day caching + `ETag` (own rate limit 600 / min / IP) only while referenced by a public field; purge jobs hourly; versioning 30 days.

### 3.10 Reports and exports (ADR-015)
- Ten fixed reports (D-RPT-01), one code each (`report_<key>.view`; ⑥ = `pnl.view`; ⑦ private); live SQL in one `REPEATABLE READ READ ONLY` transaction, `statement_timeout` 15 s, range ≤ 366 days, `generated_at`; shared data functions (`EffectiveSale`, `DailyClosings.components`, `Pnl.compute`) so ① and ⑥ agree; refunds on the refund date (F6).
- Exports: `data.export` (Admin seed) + the source's read right and scope; CSV / XLSX ≤ 5,000 rows streamed; larger (≤ 50,000) and every PDF → `export.run` → *My exports* 24 h; PDF = summary + 1,000 rows; CSV with BOM + formula-injection guard; every export audited.
- Imports: `import.run` (company scope), master data only (F5), ≤ 10,000 rows, confirm in one transaction.

---

## 4. Scale and reliability

### 4.1 Deployment (single VPS, Docker Compose)
```
VPS (Singapore, 4 vCPU / 8 GB / 100 GB SSD)
 ├── caddy        (TLS, routing, gzip/brotli, rate-limit for public paths — defence in depth; upload body cap; strips inbound X-Internal-Key)
 ├── api          (NestJS + pg-boss workers + DocumentRenderer → one headless Chromium + Pyidaungsu / Inter fonts — ADR-013;
 │                 memory limit with render headroom; 2 replicas optional later)
 ├── web          (Next.js — site/ + staff/ trees, one process; .next/cache volume; SSR → api:3001 with X-Internal-Key =
 │                 INTERNAL_SSR_KEY — it only lifts the public per-IP limit)
 ├── postgres     (16; data volume; WAL archiving optional — §6)
 ├── backup       (sidecar: pg client + cron — pg_dump daily 03:00 / weekly Sunday → owner's backup bucket, restore test 1st 04:00
 │                 automatic; reports backup_runs with X-Internal-Key = INTERNAL_OPS_KEY — ADR-002 / 009)
 ├── (no minio)   (v1.3: files in the owner's cloud bucket — ADR-014; MinIO only as a dev option in docker-compose.dev.yml)
 └── external     (owner's bucket R2 / B2 — ADR-014 · HetrixTools + Sentry — ADR-007 · Resend · Turnstile · Google OIDC)
```
- CI (GitHub Actions): typecheck + lint + unit + DB constraint tests + Playwright smoke → build images → deploy by SSH + `docker compose up -d` → `prisma migrate deploy` → `sync.code_tables` on startup. Rollback = previous image tag + migration discipline (additive migrations only during V1).
- Secrets: `.env` on the server (never in git); rotation runbook. **Two internal secrets (review fix 02/Oct):** `INTERNAL_SSR_KEY` (API + web container — SSR rate-limit exemption only) and `INTERNAL_OPS_KEY` (API + backup sidecar + restore script — the only key `/v1/internal/*` accepts); the internet-facing web container never holds the second one (ADR-009).
- **Two repositories (owner 02/Oct/2026 — ADR-016):** the specs and planning sources live in **`point-sdd`** (the OpenSpec *store* — `openspec/` specs and changes, the briefs and everything under `docs/`, this document included); the application code lives in **`point-barber`**, whose `openspec/config.yaml` holds `store: point-sdd` (a pointer repo — `/opsx:apply` runs there, every other OpenSpec step in `point-sdd`). The CI pipeline, the images and the Compose deployment described above belong to `point-barber`, which also keeps the `db/` migrations and its own engineering docs. This amends ADR-001 action item 1 (it listed `db/`, `docs/` and `openspec/` inside the one repository); the runtime design — components, containers, data flows — is unchanged.

### 4.2 Failure modes and what happens
| Failure | Effect | Mitigation |
| --- | --- | --- |
| Internet at a branch | Phones can't reach the API | Paper + late entry (D-VIS-13); offline banner; no partial writes possible |
| VPS down | Everything down; public site serves stale cache only if Next is up (not when the VPS is down) | HetrixTools alert (Telegram + e-mail, within ~1–2 min) → restart / restore runbook; RTO target 2 h |
| Postgres corruption / disk | Data at risk | Daily dump (30 d) + weekly (1 y) off-site + monthly restore test (D-DAT-03); RPO 24 h accepted (ADR-002) — paper / closing records allow re-entry; WAL archiving = §6 trigger |
| E-mail provider (Resend) down | OTP login fails | Google login path; provider status page; OTP retry queue |
| Captcha provider down | Public booking blocked | Fail closed (no bookings without verification) + "call the branch" message; staff booking unaffected |
| Job runner stuck | No-show alarms / shifts late | `GET /v1/system/jobs` + `backup.watchdog`; alert if the nightly jobs haven't run by 06:00 |
| Printer / Bluetooth | No receipt | Never blocks payment; PDF / share path (D-PAY-07) |
| Lost reply on a money POST | Client doesn't know if saved | Idempotency key replay (API-IDEM-02); `GET /v1/me/requests/{client_request_id}` "was it saved?" (P4.REQ.01) |
| Chromium crash / render timeout (v1.3) | One receipt / export not rendered yet | Browser restarted, job retried 3×, then `job.failed`; the receipt GET renders on the fly; the API keeps serving (separate OS process) — ADR-013 |
| Bucket provider down (v1.3) | Uploads fail; private file links and website images fail; receipt files can't be stored | Client retries uploads; `receipt.render` / `export.run` retry; pages still render without images; files and backups stay safe off-site — ADR-014 |
| Heavy report at peak (v1.3) | DB CPU shared with the POS | 366-day cap, `READ ONLY` snapshot, 15 s `statement_timeout` → 422 `report_timeout`; revisit trigger §6 — ADR-015 |
| Day closed too early / wrong | Late sales / cash moves refused (`day_closed`) | Admin reopen with reason → correct → close again (P7-RULE-07); KBZPay verify still allowed (E3) |

### 4.3 Monitoring and alerting (ADR-007)
- External uptime check (**HetrixTools Free** — every 60 s, several locations) on `GET /api/v1/health` (liveness only) and the public home page → **Telegram + e-mail** to the owner (+ dev); job / backup detail for admins at `GET /v1/system/jobs`. Free account = log in at least every 90 days (go-live checklist).
- Error tracking (**Sentry Developer** — API + web + Android shell) with `request_id` correlation; alert by e-mail on error-rate spikes and money-endpoint 5xx.
- Operational status stays in-app (D-NTF-01): the admin "Needs attention" panel (AD-DSH-04) — backups OK? (`backup.view`), jobs OK? (company-scope `settings.view⁺`), unverified KBZPay count, days not closed — plus `backup.failed` / `job.failed` / `backup.restore_authorized` notifications (**category 6 SECURITY, mandatory** — ADR-007 amendment, P8 §15). (No e-mail digest in V1 unless the owner asks.)
- DB disk / connection alerts.

### 4.4 Capacity
Postgres with ~1 M rows / year needs no partitioning for 5+ years; indexes defined in the DBML cover the hot queries (bookings by barber/time, sales by branch/date, notifications by user). Availability queries scan one barber-day — microseconds. The only serialisation point is the receipt counter row lock per branch-month — ~1 ms per sale. **v1.3:** the day lock is a *shared* advisory lock (writers never block each other; only close / reopen are exclusive). Rendering is serialised on purpose (one Chromium page at a time) — ~100 receipts / day plus occasional payslips / PDFs is far below its capacity. Bucket storage grows by two small receipt files per sale plus photos (estimate: low gigabytes per year — check at build against the provider's free / cheap tier). Reports scan at most 366 days per request (ADR-015).

---

## 5. Trade-offs (summary — details in the ADRs)
| Decision | Chosen | Alternative | Why | ADR |
| --- | --- | --- | --- | --- |
| Architecture | Modular monolith, one DB | Microservices / separate services per module | 2 devs, 1 month, handover; transactions across modules | ADR-001 |
| Background jobs | pg-boss in Postgres | BullMQ + Redis | One less service; same DB backup covers jobs; volume tiny | ADR-002 |
| Android shell | Capacitor | TWA | Bluetooth printing needs a native plugin (D-PAY-07) | ADR-003 |
| Booking idempotency | Client-generated manage token (hash stored) | New `client_request_id` column + server token | Replay can return the one-time link only if the client holds the token; no DB change | ADR-004 |
| Sessions | Opaque server session + host-only cookie; shell / PWA Google login via verifier / challenge hand-off | JWT; Google login only on PC | Instant revoke (D-AUTH-06), iOS PWA storage behaviour, Google blocks WebView OAuth | ADR-005 |
| Public site | SSR + tag revalidation | No cache / static export / separate CMS | Link previews, SEO, resilience; no second data copy | ADR-006 |
| Observability + e-mail | HetrixTools (e-mail + Telegram) + Sentry; Resend e-mail API (Mailpit in dev) | Self-hosted / Gmail SMTP / UptimeRobot Free (5-min checks, no Telegram) | OTP login depends on delivery; night-time outages; free tiers fit the volume | ADR-007 |
| Realtime | Socket.IO, one instance | SSE / polling / Redis adapter | Rooms per branch, reconnect handling; add adapter when >1 instance | ADR-008 |
| Origins | One origin per app, `/api` path, edge rules per host | `api.` subdomain | No CORS, host-only cookie, fewer requests on 4G, no staff login on the public host | ADR-009 |
| Permissions | CRUD per menu (`view` / `create` / `update` / `delete`) + named special actions, admin-composed; seed roles Admin / Manager / Barber | Fixed roles in code / `manage` codes (ADR-010, superseded) / pure CRUD | Owner's answers (11:54, 21:20); D-ROLE-01/02/09; approvals stay separate | ADR-011 |
| Permission reach | Data level decides (company master / branch data / shared) | Company codes only through company scope (ADR-011 #7) / twin branch codes | A branch Manager runs their branch's services and settings without touching company-wide data (D-ROLE-07); customers shared, history private per branch | ADR-012 |
| Pay data reach (v1.3) | Level `private` — company scope only, branch scope reaches nothing; company-wide money rows + company P&L company scope; audit row rules | Pay codes as company master (branch scope reads) / seed-only protection | Owner C1 "Manager ကြည့်ရုံတောင် ✖", E6, F10, F11 | ADR-012 A1 |
| Documents (v1.3) | Server-side HTML → headless Chromium → PDF / 1-bit PNG; stored receipts; print on the phone | JS PDF library / client-side rendering / separate renderer container | Correct Myanmar shaping (owner H (1)); identical reprints (D-PAY-06); one deployable | ADR-013 |
| File storage (v1.3) | Owner's S3-compatible cloud bucket (R2 / B2), staging → link, presigned 5-min URLs, stable public media path | VPS disk / MinIO on the VPS / files in Postgres | Off-site by design (D-DAT-03, owner F4); small DB and disk; privacy processing on upload | ADR-014 |
| Reports & exports (v1.3) | Live read-only SQL ≤ 366 days, 15 s; sync ≤ 5,000 rows, background ≤ 50,000 | Nightly materialised views / warehouse / client-side aggregation | Exact, consistent figures (owner H (4)); one code path for reports, P&L, closing; volume is small | ADR-015 |

---

## 6. What to revisit as the system grows
| Trigger | Change |
| --- | --- |
| A second API instance (load or zero-downtime deploys) | Socket.IO Redis adapter (or Postgres LISTEN/NOTIFY bridge), shared rate-limit store, Google hand-off parked-session store → DB table, sticky sessions not needed (cookie + DB) |
| RPO < 24 h wanted | Enable WAL archiving to the bucket (`wal-g` / `pgbackrest`) — hourly recovery points, same restore runbook |
| Second company (D-ORG-03) | Row-Level Security policies on `company_id`, company selector at login, per-company site |
| Offline V2 (D-VIS-13) | Client queue with the same `client_request_id` keys; conflict rules for slots; background sync in Capacitor (iOS limited) |
| Customer ratings V2 (OPEN-37) | New tables + public endpoint; card source switch |
| > 50 k bookings / year or reporting slowness (a report near the 15 s timeout at a one-year range, or `report_timeout` in production) | Materialised report views refreshed nightly or a read replica (ADR-015); later partition `sales` / `audit_events` by month |
| iPhone staff need push | Web Push (VAPID) behind a button — code already shared across platforms (AD-PWA-01) |
| Render queue makes users wait, or Chromium memory / crashes affect the API (v1.3) | Move rendering to a separate container (e.g. Gotenberg) behind the same `DocumentRenderer` interface (ADR-013) |
| Public image traffic grows (v1.3) | CDN in front of `/api/v1/public/media/*` — same path and cache headers (ADR-014) |
| More than 50,000 rows needed in one export (v1.3) | Streamed background CSV without the cap (ADR-015) |

---

## 7. Open items (v1.4 — 02/Oct/2026)
Everything else in this document is decided (owner one-sheet "အကုန်လုံး OK", 02/Oct/2026 00:06). **Item 1 is closed** (owner "OPEN-40 OK", 02/Oct/2026 — kept here as the record of the locked mechanism); of items 2 and 3 nothing is built until it is answered (🔒 D-PLT-11 / D-PLT-13).

| # | Item | State | What is waiting (item 1: what was decided) |
| --- | --- | --- | --- |
| 1 | **OPEN-40 — 🔒 D-DAT-05 "no hard delete of transactional rows" vs removing wrong / derived rows — one owner question, three sub-items.** **(a)** Payroll reopen vs the run's salary expense rows (🔒 F-P5-09 says reopen deletes the payroll results and recomputes; DB Part 7 `expenses_source_refs_chk` required every source-3 (PAYROLL) expense to keep its FK to `payroll_entry_branch_allocations`) · **(b)** withdrawing a wrong, unused salary row / commission-plan assignment (Part 5 P5.EPY.04 / P5.CPA.04) · **(c)** replacing the lines of a DRAFT purchase / DRAFT transfer (Part 6) | ✅ **closed — 🔒 owner 02/Oct/2026 "OPEN-40 OK" (review §0.9): (a) = B · (b) = B · (c) = A** | **(a) Payroll reopen = soft delete.** `Expenses.removePayroll(run, actor, reason)` (§2.5) **soft-deletes** the run's source-3 salary expenses (reason "Payroll reopened — <reason>", by = actor), then the allocations are removed; finalize posts fresh expense rows (the partial unique `expenses_one_per_allocation … WHERE deleted_at IS NULL` allows it) — no hard delete. **DB Part 7 v1.2:** FK `expenses.payroll_entry_branch_allocation_id` `ON DELETE SET NULL` + `expenses_source_refs_chk` allows a NULL allocation for source 3 (PAYROLL) only when `deleted_at IS NOT NULL`. **(b) Withdraw = archive.** A wrong, **unused** salary row or commission-plan assignment ("unused" = not referenced by a FINALIZED / PUBLISHED / PAID run) is **archived**, never hard-deleted. **DB Part 5 v1.2:** `archived_at`, `archived_by_user_id` and `archive_reason` on `employee_salaries` and `employee_commission_plans`; their overlap constraints ignore archived rows (the pattern the owner approved for DB Part 2 v1.3). **(c) DRAFT lines = delete + audit diff.** Lines removed when the lines of a DRAFT purchase / DRAFT transfer are replaced are deleted with a full audit diff — the same reading as owner answer A2 for `booking_items` (nothing is posted, no stock or money effect yet); no DB change. *Stated, not asked:* `import_job_rows` deleted when an import is re-mapped are staging data, not transactions (same class as F-P8-04). No endpoint, body, response or code changed for (a)–(c) (API Parts 5 / 6 / 7 v1.1) |
| 2 | **D-PAY-08 — order of discount, service charge and tax** | 🟡 until the owner enables tax or service charge | Both are OFF by default (D-PAY-08). Part 4 uses the default order discount → service charge on the net → tax on net + service charge, exclusive, whole kyats — the owner confirms it when switching either on |
| 3 | ★ Build-time choices (not owner decisions) | ★ | bucket provider R2 or B2 (owner account — ADR-014) · `integrity.check_weekly` day / time (ADR-002) · renderer timeout / recycle constants and API memory limit (ADR-013) · Bluetooth plugin tested with the shop's printer at 384 px (+ 576 px if a branch uses 80 mm — ADR-003) |

---

*Change log: **v1.4 (02/Oct/2026)** — owner "OPEN-40 OK": §7 item 1 closed — (a) payroll reopen soft-deletes the run's salary expenses (DB Part 7 v1.2), (b) wrong unused salary row / plan assignment archived (DB Part 5 v1.2), (c) removed DRAFT purchase / transfer lines deleted with a full audit diff (A2 reading); §2.5 `Expenses.removePayroll` defined; §4.1 two-repository layout (ADR-016); header, Status and Myanmar summary updated; no endpoint, DTO or code changed · **v1.3 (02/Oct/2026)** — owner one-sheet + API Parts 3–8 locked: ADR-013 / 014 / 015, ADR-012 Amendment 1, ADR-002 job list, §2.2 / §2.5 flows, §3.7–§3.10, §7 open items; *fix-up 02/Oct (batch v5.2.15, no version bump):* §3.7 realtime payloads ids-only for every event (ADR-008 reconciled — Parts 4 / 5 / 6), the §7 "realtime payload amounts" open point removed; *review fixes 02/Oct (independent review, no version bump):* one lock order, READ COMMITTED for money writes and `PayrollLock` as an advisory lock (§3.6, §2.2, §2.5), month-end job daily 01:00 + job owners (§3.4), backup / import read exception and `receivable.issue` private (§3.8), public media 1-day cache (§3.3 / §3.9), two internal secrets (§4.1), OPEN-40 a / b / c (§7) · **v1.2 (01/Oct/2026 23:30)** — owner scope choice A (ADR-012) + Part 3 draft · **v1.1 (01/Oct/2026 21:20)** — owner locks, providers, ADR-011 · **v1.0 (01/Oct/2026 11:54)** — first review + independent-review fixes.*

*End of system design review v1.4.*
