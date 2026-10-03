# Point Barbershop System — Planning Review

> **ဘာကို review လုပ်ထားလဲ**
> - ChatGPT နဲ့ ဆွေးနွေးထားတဲ့ planning conversation (`chatgpt-barbershop-erp-conversation.md` — prompt 397 ခု၊ 26/Sep/2026 → 29/Sep/2026။ P362–P367 = DB design အစ၊ P368–P397 = risk walkthrough RISK-01..11)
> - Claude chat (29/Sep/2026 ည) — RISK-02 fallback ပြင်ဆင်ချက်၊ attendance fallback၊ RISK-12..17၊ owner မှတ်ချက် ၃ ခု
> - Claude chat (29/Sep ည → 30/Sep/2026 မနက် ၁ နာရီ) — ⏩ OPEN / REC အကုန်၊ **DB Part 1 + 1b + 2 lock** (DBML + SQL — `db/` folder)
> - Claude chat (30/Sep/2026 မနက်) — **D-PLT-17 SDD = OpenSpec** (coding စရင်) · REC-33 (settings store = key-value + history + settings.json) · OPEN-25 (Cash Return = expense reversal + label / note) · OPEN-05 A (closing design = setting) · REC-14 (transfer ၂ ဆင့်) · OPEN-26 (finalize ပြီး refund → reversal line) · OPEN-19 (attendance design ဆက်၊ ★ ပိုင်ရှင်) · OPEN-06 A (deduction rule = setting) · OPEN-03 A (commission engine design) · OPEN-09 (discount code ပုံစံ) · OPEN-15, 24 (Additional Settings) · REC-25 (receipt နံပါတ်) · REC-11 (KBZPay verify) · REC-12 (START) · OPEN-16 (walk-in ဖုန်း) · OPEN-01 (late entry) · OPEN-28 (ဖုန်းမပါ case payment) · OPEN-27 (waitlist) ⏭ + နောက်မှ ထည့်ရလွယ်အောင် ပြင်ဆင်ချက် (§6.4b) · OPEN-14 (one-active-booking) · OPEN-23 (reschedule ဈေး) · OPEN-29 (option booking) · **DB Part 3 lock** (v3, PostgreSQL test ၃၀ ခု)
> - Fresha research repo [`naingaunglinn/fresha-research`](https://github.com/naingaunglinn/fresha-research) (commit `7137637` — sandbox study, live account study, live commission study)
> - Claude chat (30/Sep ည 11:30 → 01/Oct/2026) — **UI/UX guideline ၂ ဖိုင်** (Frontend website + Admin panel) ထုတ် — reference = [Laws of UX](https://lawsofux.com/) (law ၃၀) + Fresha research repo (owner က ဒီ chat အတွက် public ခဏ ဖွင့်ပေး) · 🔒 D-UX-01, D-UX-02, D-PLT-18 (UI/UX → API → Code) · 🟡 OPEN-30..36 · ⚠️ REC-39, REC-40 · ✋ ACT-06, ACT-07 → **§10**
> - Claude chat (01/Oct/2026 မနက်) — **owner က guideline ၂ ဖိုင်ရဲ့ 🟡 / ★ မေးခွန်းတွေ ဖြေ** → guideline **v1.1** ၂ ဖိုင် + **DB Part 1 v3.3** (column ၂ ခု) · ✅ OPEN-10, 20, 21 (toggle), 31, 32, 33, 35, 36 · 🔒 D-UX-05 (website brand / motion / booking modal) · 🟡 OPEN-37 (barber rating) · ⚠️ confirm ၂ ချက် (D-COM-04 ↔ OPEN-10 flag · D-PLT-04 `ကျပ်` ↔ website `Ks`) · OPEN-34 ရှင်းပြ + အဆိုပြု report ၁၀ ခု → **§0.2 (စ), §10.9**
> - Claude chat (01/Oct/2026 10:47) — **owner ဒုတိယအကြိမ် ဖြေ (၆ ချက်)** → guideline **v1.2** ၂ ဖိုင် + **DB Part 1 v3.4** · ✅ OPEN-34 (report ၁၀ ခု 🔒 D-RPT-01) · ✅ OPEN-37 (rating = admin / manager, V2 = customer) · ✅ confirm ၂ ချက် (estimate gating = "အကုန် / တစ်ယောက်ချင်း" နှစ်မျိုး · app `ကျပ်` မပြောင်း) · 🔒 D-BKG-23 (lead time မလို) · OPEN-30 = spec အဆင့်မှ → **§0.2 (ဆ), §10.10**
> - Claude chat (01/Oct/2026 11:09) — **owner: "ဒါကိုပဲ lock လုပ်လိုက်တော့မယ်၊ API Design ဆက်သွားမယ်"** → 🔒 **D-UX-03 / D-UX-04** (guideline v1.2 ၂ ဖိုင် approved — REC-39 / 40 ✅) · **API design (D-PLT-18 #2) စ** — `docs/api/00-conventions.md` (Part 0 — convention + module map, resource ~၇၀) + `docs/api/01-foundation.md` + `openapi/part1-foundation.yaml` (Part 1 — endpoint ၅၀, OpenAPI 3.1 validate ✅) · ⚠️ D-API-01 / D-API-02 (owner lock) → **§11, A.18**
> - Claude chat (01/Oct/2026 11:54) — **owner API မေးခွန်း ၃ ချက် ဖြေ** (idempotency "server / DB ဘယ်ဟာ ပိုကောင်းလဲ" · manager rights = admin က permission နဲ့ adjust · 14 ရက် window = staff ပါ) + **"coding ဘက် စရောက်ပြီ — `/engineering:system-design` `/engineering:architecture` နဲ့ သေချာ စစ်"** → API Part 0 / 1 **v1.1 → v1.2** (granular permission code ၁၃ · 🔒 D-BKG-06 update · single origin `/api` · independent review fix — Google login hand-off, cookie host-only, company-admin rule, job status endpoint; endpoint ၅၂) · **System design review v1.0** (`docs/architecture/system-design.md`) · **ADR-001..010** (`docs/adr/` — Accepted ၂ · Proposed ၈ owner lock ရန်) · **independent reviewer ၂၄ ချက် (HIGH ၄) ပြင်ပြီး** → **§11.5, §12, A.18, A.19, OPEN-38**
> - Claude chat (01/Oct/2026 13:00) — **owner: "API part 2 ဆက်ပါ။ API က ဘယ်နှပိုင်း ရှိမှာလဲ"** → API = **Part 0 + Part 1–8 (ဖိုင် ၉)** · **API Part 2 Catalogue & Scheduling draft v1.1** (`docs/api/02-catalogue-scheduling.md` + OpenAPI — endpoint ၅၀, permission code ၇, availability function) · independent review ၁၈ + verification ၅ ချက် ပြင်ပြီး · ⚠️ **DB Part 2 v1.3** (`archived_at` ၂ column — owner confirm) · 🟡 OPEN-39 (Part 2 owner items ၁၀) → **§11.6, A.18 D-API-03, A.16 D-DB-06**
> - Claude chat (01/Oct/2026 15:22) — **owner: "ဖြေရမှာ အရမ်း များနေပြီ — မေးခွန်း အရင် မေး၊ အကုန် ဖြေပြီးမှ API ရော architecture ရော တစ်ခါတည်း ထုတ်"** → 🔒 **D-PLT-19** (workflow: question sheet first, files after all answers, batched output) · **§0.6 Owner decision sheet (၂၄ ချက် + ★ တန်ဖိုး)** — chat ဖျက်ပြီး **နောက် chat မှာ ဖြေမယ်** · save point = v5.2.12 + bundle zip
> - Claude chat (01/Oct/2026 21:20) — **owner က §0.6 decision sheet ဖြေ** (ADR-001 / 002 / 003 / 005 / 006 OK · email = **Resend Free** · uptime → "Telegram ကို အမြဲ ပို့လို့ရလား" + alert = Email + Push · error = **Sentry** · domain / DNS access ✅, final domain = production release ကျမှ owner ကိုယ်တိုင် · default role = **Admin / Manager / Barber** · permission = **`manage` မဟုတ်ဘဲ view / create / update / delete action အလိုက်** · company admin = `role.manage` + `role.assign`) → Claude: owner list ထဲက "Permission matrix" ↔ "Company admin" ဆန့်ကျင် (D-PLT-13 — `role.manage` မရှိတော့) + မဖြေရသေး ၁၈ ချက် + provider အချက် ၅ ချက် (#25–#29) ကို sheet တစ်ခုတည်း ပြန်မေး → owner 21:20: **#25 = A** (Role ၅ code အကုန် ✔ = company admin; "အကုန် ✔ = Admin") · **#26 a–d OK** · **#27 HetrixTools Free + Email + Telegram** · **#28 Sentry (Developer / Free)** · **#29 default ၃ ချက်** · **ကျန် ၁၈ ချက် "အကုန် OK"** → 🔒 **D-API-01 / 02 / 03** · **D-DB-06 v1.3** · **ADR-002…009 Accepted** · **ADR-011 (CRUD permission — ADR-010 Superseded)** · D-ROLE-02 update + **D-ROLE-09** · **D-ARC-02** (provider) · API Part 0 **v1.3** / Part 1 **v1.3** / Part 2 **v1.2** + OpenAPI · system design **v1.1** · admin guideline **v1.3** · db zip v6 (test ၂၉၆ ပြန် PASS) · **NEXT = §0.7 API Part 3 question sheet** → **§0.2 (ဌ), §0.6, §0.7, §11.7, §12.7**
> - Claude chat (01/Oct/2026 ည — 22:16 → 23:30) — **owner: "Manager က သူ့ Branch မှာရှိတဲ့ Service တွေ Setting တွေကို Manage မလုပ်နိုင်ဘူး ဖြစ်သွားမှာပေါ့ … Admin က Company wide service လုပ်လိုက်တဲ့အခါ branch အလိုက် ရတာရှိတယ် မရတာရှိတယ် — အဲ့တာမျိုးကို ကာဖို့"** → Claude: v5.2.13 ရဲ့ "company code = company scope ကနေမှ" rule က branch Manager ကို ပိတ်မိကြောင်း ဝန်ခံ + ရွေးစရာ ရှင်းပြ → owner **A — "Scope က အဆင့် ဆုံးဖြတ်"** · owner **"API Part 3 question sheet အကုန် OK"** → **ADR-012** (permission ✔ ရောက်တဲ့အထိ = data အဆင့် — company master / branch data / shared customer; ADR-011 #7 အစားထိုး) · API Part 0 **v1.4** / Part 1 **v1.4** / Part 2 **v1.3** + OpenAPI · **API Part 3 draft v1.0** (`docs/api/03-customers-booking.md` + OpenAPI — endpoint ၃၈, code ၁၂, DB မပြင်) · admin guideline **v1.4** · frontend guideline **v1.3** · system design **v1.2** · ADR-002 / 007 action item note · independent reviewer **၂၉ ချက် (HIGH ၂)** ပြင်ပြီး · ✅ OPEN-12 · REC-36 · **NEXT = §0.8 Part 3 lock (၃ ချက်)** → **§0.2 (ဍ), §0.7, §0.8, §11.8, §12.9**
> - Claude chat (01/Oct/2026 23:27 → 02/Oct/2026 04:10) — **owner: "confirm တိုင်း zip မပေးနဲ့ — API အတွက် မေးခွန်း အကုန် မေး၊ ငါ အကုန် ဖြေမယ်၊ ပြီးရင် API ရော Architecture ပါ တစ်ခါတည်း ထုတ် — spec ထုတ်ဖို့ ကျန်သေးတယ်"** → **§0.8 one-sheet (A1–A3 · B1–B12 · C1–C12 · D1–D9 · E1–E8 · F1–F12 · G · H)** → owner **02/Oct 00:06 "အကုန်လုံး OK"** (default အကုန်) → 🔒 **D-API-04** (Part 3 v1.1) · 🔒 **D-API-05..09** (API Part 4 Visits / Sales / Payments · 5 Commission / Payroll / Attendance · 6 Inventory · 7 Finance / Closing · 8 Platform — v1.0 + OpenAPI) · Part 0 **v1.5** / Part 1 **v1.5** / Part 2 **v1.4** · **API design ပြီး — endpoint ၄၄၁ · permission code ၁၇၄** · **DB G** (Part 4 constraints v1.2 · Part 5 v1.1 · Part 6 v1.2 · Part 7 v1.1 · Part 8 v1.1 — test ၃၅၅ PASS, zip v7) · **ADR-013 / 014 / 015 Accepted** + ADR-012 Amendment 1 (`private` level) · system design **v1.3** · admin guideline **v1.5** · frontend guideline **v1.4** · independent reviewer ၃ ယောက် **၈၇ ချက် (HIGH ၁၀)** ပြင်ပြီး · ✅ OPEN-18 · REC-30 · REC-37 · ◐ OPEN-11 · 🟡 **OPEN-40 (တစ်ချက်တည်း — D-DAT-05 နဲ့ ဆန့်ကျင်တာ a / b / c)** · **NEXT = OpenSpec spec အဆင့် (D-PLT-17)** → **§0.2 (ဎ), §0.8, §0.9, §6.4i, §11.9, §12.10**
> - Claude chat (02/Oct/2026 08:24 → 13:00) — **owner: "OPEN-40 OK" + OpenSpec spec အဆင့် စ** → question sheet ၂ ခု (§0.10 — sheet 1 = A1–D5 ၁၂ ချက် · sheet 2 = ၉ ချက်) → owner အဖြေ (08:58 · 09:17) → 🔒 **D-PLT-20** (OpenSpec CLI 1.14.0 · change တစ်ခု = form / topic တစ်ခု · requirement = တန်ဖိုးပါတဲ့ SHALL စာကြောင်း + source ID · capability ၂၃ + အဆိုပြု ၂ (S3) · ပထမ change အစဉ်) · 🔒 **D-ARC-03 / ADR-016** (repo ၂ ခု — `point-sdd` spec hub + `point-barber` app; workspace `point/`) · 🔒 **D-ENG-01** (tooling + CI စစ်ဆေးပုံ + test login) · 🔒 **D-ENG-02** (coding guideline — reference ✅; content Draft v1.0 = ⚠️ REC-42) · **D-UX-02 update (website palette `#EEEEEE` / `#000000` / `#DC5F00`; ခလုတ် = အမည်း + စာဖြူ — OPEN-30 ◐: admin palette ★ ကျန်)** · D-PLT-14 note (Dev 1 = Website + Admin panel · Dev 2 = Admin panel) · ✅ **OPEN-40** → **DB Part 5 v1.2 + Part 7 v1.2 (table ၉၁ · test ၃၉၃ PASS · zip v8)** · API Part 5 / 6 / 7 **v1.1** + OpenAPI · system design **v1.4** · admin guideline **v1.6** · frontend guideline **v1.5** · **OpenSpec change ၄ ခု** (`add-repo-scaffold` · `add-shared-ui-components` · `add-foundation-auth-access` · `add-walkin-visit-checkout` — brief + proposal / spec / design / tasks; requirement ၁၇၈ · scenario ၇၀၄ · task ၅၀၂; `openspec validate --strict` ✅) · `docs/plan/` (dev plan · roadmap ၈၁ row · spec fixtures) · `CLAUDE.md` ၂ ခု · browser tester = passwordless login (Mailpit) · independent reviewer ၄ ယောက် — finding ၁၇၄ (HIGH ၁၄ · MEDIUM ၈၄ · LOW ၇၆): ပြင်ပြီး / source က မဆုံးဖြတ်ပေးတာတွေ §0.11 သို့ တင်ပြီး · 🟡 **OPEN-41 (§0.11 — spec ရေးရင်း တွေ့တဲ့ owner မေးခွန်း, sheet 3)** · ⚠️ REC-41 (website token အဆိုပြု) · ⚠️ REC-42 (coding guideline approve) · ✋ ACT-09 (repo ၂ ခု private) · **NEXT = owner §0.11 ဖြေ → `/opsx:apply add-repo-scaffold`** → **§0.2 (ဏ), §0.10, §0.11, §6.4j, §11.10, §12.11**
> - Claude chat (02/Oct/2026 13:07 → 14:30) — **owner: "ငါတို့ကစစ်ပဲစစ်မှာ" (Claude Code က ရေး၊ developer က စစ်) + "မေးခွန်းအကုန်လုံး OK — Default အတိုင်း" (13:08)** → 🔒 **§0.11 sheet 3 S1–S18 အကုန် default အတိုင်း lock (OPEN-41 ✅)** · API Part 0 **v1.6** (500 `internal_error` · field-level code = Zod နာမည် · reason field = part အလိုက် · code စစ်တာ ၁၀ / နာရီ / IP · `forbidden` vs `out_of_scope`) · API Part 1 **v1.6** (P1-RULE-14 ပထမ admin command · P1-RULE-15 browser တစ်ခု session တစ်ခု · `permission.sync` · `email_invalid` / `otp_format` · OpenAPI 1.6.0) · API Part 4 **v1.1** (`correction_path` မပါတဲ့ case ၂ ခု · OpenAPI 1.1.0) · admin guideline **v1.7** (START chip = catalogue အစဉ် · focus ring / input ဘောင်) · frontend guideline **v1.6** · capability **၂၅ ခု 🔒** · **change ၄ ခု Open questions ပိတ် → apply လုပ်လို့ရပြီ** (requirement ၁၈၄ · scenario ၇၃၈ · task ၅၀၄; `openspec validate --all --strict` ✅) · dev plan **v1.1** (S1 = "တစ်လ" → pilot အထိ ပစ်မှတ်; လုပ်ပုံ = Claude Code ရေး / လူ စစ် → ခန့်မှန်း ၁ လခွဲ–၂ လခွဲ) · ကျန် = ⚠️ REC-41 · ⚠️ REC-42 · ★ OPEN-30 admin palette · ✋ ACT-09 · **NEXT = ACT-09 → push → `/opsx:apply add-repo-scaffold`** → **§0.2 (တ), §0.11, §11.11, §12.12**
> - Claude chat (02/Oct/2026 13:46 → 14:50) — **owner: "Ok ပါတယ်"** (REC-41 + REC-42 ကို မေးတာ) → ✅ **REC-41** website ကျန် colour token အကုန် 🔒 (frontend guideline **v1.7** — FE-VIS-01a row အကုန် 🔒; `add-shared-ui-components` ထဲ တစ်ခါတည်း ဆောက်၊ `change-site-colour-tokens` မလိုတော့; website မှာ focus ring / input ဘောင် = ကိုယ်ပိုင် `--ring` / `--input`) · ✅ **REC-42** coding guideline **v1.0 APPROVED** (rule အကုန် binding — D-ENG-02 🔒) · change ၄ ခု = requirement ၁၈၄ · scenario ၇၄၂ · task ၅၀၄ · ကျန် = ★ OPEN-30 admin palette · ✋ ACT-09 · **NEXT = ACT-09 → push → `/opsx:apply add-repo-scaffold`** → **§0.2 (ထ)**
>
> **ရေးသူ:** Claude (Opus 5.5 → Fable 5.1 — 30/Sep နေ့လယ် · v5.2.6 = Opus 5.5 · v5.2.7 … v5.2.12 = Fable 5.1 · v5.2.13 … v5.2.18 = Opus 5.5) · **နေ့စွဲ:** 28/Sep/2026 · **v5.2.18:** 02/Oct/2026 14:50 — **owner "Ok ပါတယ်" (13:46) → ✅ REC-41 (website ကျန် colour token 🔒 — frontend v1.7) · ✅ REC-42 (coding guideline v1.0 APPROVED — D-ENG-02)** · shared UI change က website အရောင်အကုန် ဆောက် (scenario ၇၄၂) · ကျန် ★ OPEN-30 admin palette · ✋ ACT-09 · **NEXT = push → `/opsx:apply add-repo-scaffold`** · **v5.2.17:** 02/Oct/2026 14:30 — **owner sheet 3 (§0.11) "အကုန် OK — default အတိုင်း" (13:08) → lock + batch တစ်ခါတည်း (D-PLT-19)** — ✅ OPEN-41 (S1–S18) · API Part 0 v1.6 / Part 1 v1.6 / Part 4 v1.1 (+ OpenAPI ၂ ဖိုင်) · admin v1.7 / frontend v1.6 · capability ၂၅ 🔒 · change ၄ ခု apply လုပ်လို့ရပြီ (requirement ၁၈၄ · scenario ၇၃၈ · task ၅၀၄) · dev plan v1.1 (လုပ်ပုံ = Claude Code ရေး / developer စစ်) · D-PLT-14 / 20 · D-API-01 / 02 / 05 · D-UX-03 / 04 · D-AUTH-04 / 06 · D-ROLE-08 · D-VIS-13 · D-DAT-05 note · ကျန် ⚠️ REC-41 / REC-42 · ★ OPEN-30 · ✋ ACT-09 · **NEXT = push → `/opsx:apply add-repo-scaffold`** · **v5.2.16:** 02/Oct/2026 13:00 — **owner "OPEN-40 OK" + OpenSpec question sheet ၂ ခု ဖြေပြီး → lock + batch တစ်ခါတည်း (D-PLT-19)** — 🔒 D-PLT-20 (OpenSpec ရေးပုံ · change အရွယ် · capability ၂၃ + အဆိုပြု ၂ · ပထမ change အစဉ်) · 🔒 D-ARC-03 = ADR-016 (repo ၂ ခု) · 🔒 D-ENG-01 (tooling) · 🔒 D-ENG-02 (coding guideline — Draft v1.0, ⚠️ REC-42) · D-UX-02 (website palette — OPEN-30 ◐) · D-PLT-14 (dev ခွဲဝေ) · ✅ OPEN-40 → DB Part 5 v1.2 / Part 7 v1.2 (test ၃၉၃ PASS, zip v8) · API Part 5 / 6 / 7 v1.1 · system design v1.4 · admin v1.6 / frontend v1.5 · OpenSpec `config.yaml` + change ၄ ခု (requirement ၁၇၈ · scenario ၇၀၄ · task ၅၀၂) · dev plan + roadmap (၈၁ row) + spec fixtures · `CLAUDE.md` ၂ ခု · independent review ၁၇၄ (HIGH ၁၄) ✅ · 🟡 OPEN-41 (§0.11) · ⚠️ REC-41 / REC-42 · ✋ ACT-09 · **ဖိုင်နေရာ ပြောင်း: planning source အကုန် = `point-sdd/docs/…` (ဒီဖိုင် = `docs/decisions/`, DB = `docs/db/`)** · **NEXT = §0.11 → apply** · **v5.2.15:** 02/Oct/2026 04:10 — **owner one-sheet (§0.8) "အကုန်လုံး OK" (02/Oct 00:06) → lock + batch တစ်ခါတည်း (D-PLT-19)** — 🔒 D-API-04 (Part 3 v1.1 — endpoint ၃၈ · code ၁၂) · 🔒 D-API-05 (Part 4 v1.0 — ၅၅ · ၂၂ · P4-RULE-01..22) · 🔒 D-API-06 (Part 5 v1.0 — ၆၉ · ၂၃ · P5-RULE-01..20) · 🔒 D-API-07 (Part 6 v1.0 — ၅၈ · ၂၈ · P6-RULE-01..16) · 🔒 D-API-08 (Part 7 v1.0 — ၅၀ · ၂၇ · P7-RULE-01..19) · 🔒 D-API-09 (Part 8 v1.0 — ၆၉ · ၁၉ · P8-RULE-01..20) · Part 0 v1.5 (private level · final Idempotency-Key list · lock order / isolation / PayrollLock = API-IDEM-06 · realtime ၅၈ event · error code) · Part 1 v1.5 · Part 2 v1.4 · **API = endpoint ၄၄၁ · code ၁၇၄ · OpenAPI ၈ ဖိုင် validate ✅** · DB G → **test ၃၅၅ PASS (zip v7)** · ADR-012 Amendment 1 (`private`, code ၁၈) · **ADR-013** document rendering · **ADR-014** S3 file storage · **ADR-015** reports / exports · ADR-002 job ၁၈ ခု · system design v1.3 · admin v1.5 / frontend v1.4 · independent review ၈၇ (HIGH ၁၀) ✅ · D-VIS / D-PAY / D-COM / D-PAYR / D-ATT / D-STK / D-FIN / D-RPT / D-KPI / D-DSH / D-DAT / D-AUD / D-NTF / D-WEB / D-ROLE note · OPEN-18 / REC-30 / REC-37 ✅ · **🟡 OPEN-40 (§0.9)** · **NEXT = OpenSpec** · **v5.2.14:** 01/Oct/2026 23:30 — **owner: scope A + "API Part 3 question sheet အကုန် OK" → batch (D-PLT-19)** — **ADR-012** scope = data level (company master = company scope နဲ့မှ ပြင် / branch scope = ကြည့်ရုံ · branch data = ကိုယ့် branch · customer = shared, history = ကိုယ့် branch) · API Part 0 v1.4 (API-PERM-02 / 07, `company_scope_required`, problem `context`) · Part 1 v1.4 (P1-RULE-13, settings mixed, `level`) · Part 2 v1.3 (service master = company / ရောင်း + ကြာချိန် = branch) · **API Part 3 draft v1.0** (customer ၉ · cancel reason ၅ · booking ၁၂ · public ၁၂ = endpoint ၃၈ · code ၁၂ · rule P3-RULE-01..13) · admin v1.4 / frontend v1.3 / system design v1.2 · independent review ၂၉ (HIGH ၂) ✅ · OPEN-12 / REC-36 ✅ · D-ROLE-02 / 07 / 09 · D-CUS-07 / 08 · D-BKG-03 / 11 / 12 / 13 / 17 note · **§0.8 Part 3 lock sheet** · **v5.2.13:** 01/Oct/2026 21:20 — **owner §0.6 decision sheet ဖြေပြီး → lock + batch (D-PLT-19)** — 🔒 D-API-01 / 02 / 03 (API Part 0 v1.3 · Part 1 v1.3 · Part 2 v1.2 + OpenAPI — x-permission ပါ, validate ✅) · 🔒 D-DB-06 v1.3 · ADR-002…009 Accepted · **ADR-011 permission = menu CRUD + special action** (ADR-010 Superseded; company admin = role ၅ code — #25 A) · D-ROLE-09 seed role Admin / Manager / Barber · D-ARC-02 provider (Resend Free · HetrixTools Free Email + Telegram · Sentry Developer · Mailpit · pilot = Google login) · D-DAT-03 RPO daily · system design v1.1 · admin guideline v1.3 (AD-PERM-06 / 07 · AD-SCH-01) · REC-31 / 32 / 35 / 38 ✅ · OPEN-38 / 39 ✅ · ACT-08 (ops account) · **§0.7 API Part 3 question sheet** · **v5.2.12 (SAVE POINT):** 01/Oct/2026 15:22 — **owner decision sheet §0.6** (API Part 0 / 1 ၈ · ADR ၇ · Part 2 ၉ — စုစုပေါင်း ၂၄ + ★ တန်ဖိုး ၆) · 🔒 **D-PLT-19** workflow (မေးခွန်း အရင် → အကုန် ဖြေမှ ဖိုင် → API + architecture တစ်ခါတည်း ထုတ်) · ဖိုင် ဘာမှ မပြောင်း (api / architecture / db zip = 13:00 အတိုင်း) · **NEXT = owner က §0.6 ကို နောက် chat မှာ ဖြေ → Claude က တစ်ခါတည်း lock + ထုတ် → Part 3** · **v5.2.11:** 01/Oct/2026 13:00 — **API Part 2 (Catalogue & Scheduling) draft v1.1** — endpoint ၅၀ (category 5 · service 7 · option 3 · price 6 · eligibility 3 · pattern 2 · shift 8 · leave type 4 · leave 9 · availability 3) · permission code ၇ · rule P2-RULE-01..12 (price store resolution, effective-dated write algorithm, manual-day rule, diff-based shift generation, leave, **availability function တစ်ခုတည်း**) · OpenAPI 3.1 validate ✅ · independent review ၁၈ (HIGH ၂) + verification ၅ ပြင်ပြီး · ⚠️ **DB Part 2 v1.3** (`employee_service_eligibilities.archived_at` + `schedule_patterns.archived_at` — PostgreSQL 16 test ✅, zip v5) · API ပိုင်း = Part 0 + 1–8 · §11.6 / A.18 D-API-03 / OPEN-39 / Appendix B #39 · **NEXT = owner: Part 0 / 1 ကျန် ၁၀ + ADR ၈ + Part 2 §16 ၁၀ + DB v1.3 → lock → Part 3** · **v5.2.10:** 01/Oct/2026 11:54 — **owner API အဖြေ ၃ ချက်** → API Part 0 / 1 **v1.2** (permission code granular ၁၃ — ADR-010 Accepted · 🔒 D-BKG-06 update: 14 ရက် window = staff booking ပါ · booking idempotency = client token အကြံပြု — ADR-004 · single origin `/api` — ADR-009 · v1.2 = independent review fix: Google login hand-off Android / iPhone, cookie host-only + Max-Age, company-admin / last-admin rule, `GET /v1/system/jobs`, Socket.IO path, edge routing — endpoint ၅၂) · **System design review v1.0** (`docs/architecture/system-design.md` — requirement / component / data flow / deep dive / failure mode ၈ / job ၁၃ (ADR-002 canonical) / trade-off / revisit trigger ၇) · **ADR-001..010** (`docs/adr/` — Accepted ၂ · Proposed ၈) · **independent reviewer (subagent) ၂၄ ချက် — HIGH ၄ အပါအဝင် အကုန် ပြင်ပြီး (§12.6)** · §11.5 / §12 / A.18 / A.19 / OPEN-38 / Appendix B #38 · **NEXT = owner: ADR ၈ ခု + Part 0 §12 #1, 3–6, 8 + Part 1 §13 #2–5 → lock → Part 2** · **v5.2.9:** 01/Oct/2026 11:09 — **UI/UX guideline ၂ ဖိုင် 🔒 (D-UX-03 / 04 — owner approve)** · **API design Part 0 + Part 1 draft** (`docs/api/` — convention, module map, Foundation & Access endpoint ၅၀, OpenAPI 3.1) · ⚠️ D-API-01 / 02 owner lock ရန် · §11 အသစ် · A.18 · §0, §3.0, §9, §10 · **NEXT = API Part 0 / 1 owner review → lock → Part 2** · **v5.2.8:** 01/Oct/2026 10:47 — **owner ဒုတိယအကြိမ် အဖြေ ၆ ချက်** → admin v1.2 + frontend v1.2 (§10.10) · DB Part 1 **v3.4** (`employees.show_own_earnings` nullable + setting `dashboard.show_own_earnings_all` · `employees.public_rating`) · 🔒 D-RPT-01 report ၁၀ ခု နာမည် · 🔒 D-BKG-23 lead time 0 · D-DSH-03 / D-COM-04 / D-PLT-04 / D-UX-05 / D-DB-02 update · OPEN-34 ✅ · OPEN-37 ✅ · OPEN-30 = spec အဆင့် · **NEXT = guideline approve (REC-39 / 40) → API design** · **v5.2.7:** 01/Oct/2026 မနက် — **owner အဖြေ ၁၆ ချက် guideline ထဲ သွင်း** (admin v1.1 + frontend v1.1 · §10.9) · DB Part 1 **v3.3** (`users.ui_language`, `employees.show_own_earnings` — PostgreSQL 16 load + Part 3 / 8 regression test PASS) · D-UX-02 font ✅ (Pyidaungsu · Manrope / Inter · Archivo Black / Roboto) · D-UX-05 new (booking = modal, barber direct booking card, Motion + GSAP no 3D, TikTok, minimalist theme) · D-PAY-04 update (discount = service + product line) · D-PLT-03 / D-DSH-03 / D-PAY-06 / D-WEB-01 update · 🟡 OPEN-37 (rating) · ⚠️ confirm ၂ ချက် · §0, §3.0, §6.2, §6.3, §10, Appendix A / B · **v5.2.6:** 01/Oct/2026 (owner request 30/Sep ည) — UI/UX guideline ၂ ဖိုင် (`docs/ux/frontend-website.md` + `docs/ux/admin-panel.md` — draft v1.0, owner review စောင့်) · colour / font = team ကိုယ်တိုင် (D-UX-02) · development အစဉ် = guideline ပြင် → API design → Code (D-PLT-18) · guideline ရေးရင်း တွေ့တဲ့ gap ၇ ခု (OPEN-30..36, DB gap ၁ — OPEN-33) · fresha-research repo private ပြန်ပြောင်းရန် (ACT-07) · §0, §3.0, §4.4, §5.2, §9, **§10 (အသစ်)**, Appendix A (A.1 + A.17 အသစ်), Appendix B update *(ဖိုင်နာမည် v5.2.5 = စာသား v5.1 နဲ့ အတူတူ — v5.2.6 ကနေ header နဲ့ ဖိုင်နာမည် ကိုက်အောင် ပြင်ပြီး)* · **v5.1:** 30/Sep/2026 မနက် — OPEN-27 ✅ waitlist ⏭ V1 မပါ + ပြင်ဆင်ချက် / ပုံကြမ်း (§6.4b) · OPEN-14 ✅ active booking ၁ ခု = website ပဲ၊ staff ကန့်သတ်မရှိ (D-BKG-09) · OPEN-23 ✅ reschedule — အချိန်ပဲရွှေ့ရင် မူလဈေး (D-BKG-12) · OPEN-29 ✅ option ကိုယ်တိုင်ရွေး (D-SVC-05) · **DB Part 3 🔒 = v3 (D-DB-07, §6.4c)** · OPEN-28 ✅ conflict ဖြေရှင်း — ဖုန်းမပါ case မှာ B က payment ရ (D-VIS-06/12) · OPEN-01 ✅ late entry = barber ကိုယ်တိုင် + reason + စာရင်းမပိတ်ခင် (D-VIS-13) · OPEN-16 ✅ walk-in ဖုန်း optional + ရယူနှုန်း report (D-VIS-02) · REC-12 ✅ START = barber + branch၊ service = COMPLETE မှာ (D-VIS-02) · REC-11 ✅ KBZPay တစ်ခုချင်း ✔ စာရင်းပိတ်မှာ (D-PAY-02) · REC-25 ✅ receipt `B3-2026-OCT-00125` (D-PAY-06) · OPEN-15, 24 ✅ = Additional Settings (D-PAY-08, D-PAY-02) · OPEN-09 ✅ discount code ပုံစံ + app ထဲ တောင်း / ခွင့်ပြု (D-PAY-04) — **Part 4 OPEN အကုန် ✅** · **DB Part 4 🔒 = v1 (D-DB-08, §6.4d)** — table ၁၃ · PostgreSQL test ၅၇/၅၇ · OPEN-03 ◐ design ✅ (D-COM-01) / data ★ ပိုင်ရှင် · OPEN-06 ◐ design ✅ (D-PAYR-05 / 08 — rule = Additional Settings) / တန်ဖိုး ★ ပိုင်ရှင် · OPEN-19 ◐ design ✅ (D-ATT-01 — method / token / setting နဲ့ ဖြုတ်ရလွယ်) / ★ ပိုင်ရှင် · OPEN-26 ✅ reversal line မူလ % (D-COM-04) — **Part 5 OPEN အကုန် ✅** · **DB Part 5 🔒 = v1 (D-DB-09, §6.4e)** — table ၁၇ (attendance_exceptions ပါ) · PostgreSQL test ၇၀/၇၀ · Part 2 v1.1 (diagram ref) · REC-14 ✅ transfer ၂ ဆင့် (D-STK-03) · **DB Part 6 🔒 = v1 (D-DB-10, §6.4f)** — table ၁၂ · PostgreSQL test ၄၄/၄၄ · OPEN-05 ◐ design ✅ (D-FIN-06 — opening float / ပိတ်သူ permission / ကွာချက် = setting) / တန်ဖိုး ★ ပိုင်ရှင် · OPEN-25 ✅ Cash Return = expense reversal + မူလလ label + P&L note (D-FIN-09) — **Part 7 OPEN အကုန် ✅** · **DB Part 7 🔒 = v1 (D-DB-11, §6.4g)** — table ၈ · test ၄၆/၄၆ · Part 4 / 5 constraints v1.1 + Part 6 v1.1 · REC-33 ✅ settings store (က) key-value jsonb + history + `settings.json` (D-PLT-16 new) · **D-PLT-17 new: coding = Spec-Driven Development (SDD) — OpenSpec** · **DB Part 8 🔒 = v1 (D-DB-12, §6.4h)** — table ၁၂ + Part 1 v3.2 / Part 2 v1.2 website column · **DB design ၈ part အကုန် 🔒 — table ၉၁ · test ၂၉၆ PASS** · **v5 Update:** 30/Sep/2026 — DB Part 1 / 1b / 2 🔒၊ ⏩ OPEN / REC အကုန် ဆုံးဖြတ်၊ §0 ပြန်ရေး (§0.2 (ဂ)) · **v4:** 29/Sep/2026 ည — Risk ၁၇ ခုလုံးရဲ့ ဆုံးဖြတ်ချက် (§3.12)၊ Appendix A မှာ 🔒 row အသစ် / ပြင်ဆင်၊ §3.0 register status၊ §0 အခြေအနေ။ *(v3 — 29/Sep: P362–P367 review၊ Section 3 → Decision Safety Review · 28/Sep: iOS §5.7 + public website §5.8)*
>
> **ဒီဖိုင်ကို ဘယ်လိုသုံးမလဲ:** ChatGPT conversation ကို ဖျက်ပြီးပြီဆိုတော့ **ဒီဖိုင်ကပဲ ဆုံးဖြတ်ချက်နဲ့ အခြေအနေကို သိမ်းထားတဲ့ တစ်ခုတည်းသော record** ဖြစ်တယ်။
> - **§0** — အခု ဘယ်ရောက်နေလဲ၊ နောက် ဘာလုပ်မလဲ၊ chat အသစ်မှာ ဘယ်လို ပြန်စမလဲ။ **ဒီကနေ စဖတ်ပါ။** *(**v5.2.18: REC-41 + REC-42 = ✅ (02/Oct 13:46) — owner ဆုံးဖြတ်ရန် ကျန်တာ မရှိ; ပေးရန် = admin palette, logo, pilot data** · **v5.2.17: §0.11 = ✅ sheet 3 ဖြေပြီး (02/Oct 13:08 — "အကုန် OK") · change ၄ ခု apply လုပ်လို့ရပြီ · NEXT = ACT-09 → push → `/opsx:apply add-repo-scaffold`** · v5.2.16: **§0.9 OPEN-40 = ✅** · **§0.10 = OpenSpec question sheet ၂ ခု ✅** · **§0.11 = owner ဖြေရန် (sheet 3 — spec ရေးရင်း တွေ့တာ)** · NEXT = §0.11 ဖြေ → `add-repo-scaffold` apply · v5.2.15: **§0.8 one-sheet = ✅ ဖြေပြီး ("အကုန်လုံး OK" 02/Oct 00:06)** · **§0.9 = OPEN-40 — owner ဖြေရန် (တစ်ချက်တည်း)** · NEXT = OpenSpec spec အဆင့် · v5.2.14: §0.7 = ✅ · v5.2.13: §0.6 = ✅)*
> - **Appendix A** — lock လုပ်ပြီးသား ဆုံးဖြတ်ချက်အားလုံး (🔒 = requirement)။ *v5.2.16:* `point-sdd/docs/decisions/decision-register.md` = ဒီ appendix ကနေ `tools/extract-decision-register.py` နဲ့ ထုတ်တဲ့ ဖိုင် (Claude Code / spec က အဲ့ဖိုင်ကို ဖတ်; **ပြင်ရင် ဒီ appendix ကို ပြင်ပြီး script ပြန် run**)။
> - **§3.0** — Review ထဲက စိုးရိမ်ချက်/အကြံပြုချက် အားလုံးရဲ့ register။ ဒီထဲက ⚠️ / 🟡 တွေက **requirement မဟုတ်သေးဘူး** (D-PLT-11)။
> - **§3.12** — Risk walkthrough မှာ owner ဆုံးဖြတ်ခဲ့တာ အသေးစိတ် (v4)။
> - **§10** *(v5.2.6 · v5.2.7 = §10.9 · v5.2.8 = §10.10 owner အဖြေ · v5.2.9 = 🔒 approved)*
> - **§12** *(v5.2.10 · v5.2.13 = အကုန် Accepted)* — **Architecture review + ADR** — `docs/architecture/system-design.md` (system design **v1.3**) + `docs/adr/ADR-001..015` — **ADR-001…009 + 011 … 015 Accepted, ADR-010 Superseded, ADR-011 #7 → ADR-012 (01/Oct), ADR-012 Amendment 1 + ADR-013 / 014 / 015 (02/Oct — §12.10)**, provider (§12.7), Claude Code သုံးပုံ။ **Infrastructure / cross-cutting code (job, realtime, session / CSRF, origin, Android shell, website cache, monitoring, permission) ဆောက်တိုင်း ADR ID ကိုးကား; ပြောင်းရင် ADR အသစ် + အဟောင်း Superseded။**
> - **§11** *(v5.2.9 · v5.2.10 = v1.2, §11.5 · v5.2.11 = Part 2 draft, §11.6 · v5.2.13 = Part 0–2 🔒, §11.7 · v5.2.14 = scope A + Part 3 draft, §11.8 · **v5.2.15 = Part 3 🔒 + Part 4–8 🔒 — API design ပြီး, §11.9**)* — **API design (D-PLT-18 #2)** — part လိုက် status၊ ဖိုင်၊ owner lock ရန်၊ API decision (D-API-*)။ **Endpoint ဆောက်တိုင်း `docs/api/00-conventions.md` (API-…) + part ဖိုင် (`P1.…`) + OpenAPI ကို ကိုးကား။** — UI/UX guideline ၂ ဖိုင်ရဲ့ အကျဉ်း၊ ဆုံးဖြတ်ချက်၊ owner စစ်ရန် checklist၊ API design မေးခွန်း။ **Screen / UI ဆောက်တိုင်း `docs/ux/frontend-website.md` (public website + booking modal) နဲ့ `docs/ux/admin-panel.md` (login ဝင်ပြီး screen အားလုံး) ကို ဖတ်ပြီး rule ID (`FE-…` / `AD-…`) ကိုးကား။**
> - **§6** — DB design အခြေအနေ၊ draft review၊ DBML (🔒 Part 1 §6.3 — **v3.4 (01/Oct)** · 1b §6.3b · 2 §6.3c · waitlist ⏭ ပြင်ဆင်ချက် §6.4b · 🔒 Part 3 §6.4c · 🔒 Part 4 §6.4d · 🔒 Part 5 §6.4e · 🔒 Part 6 §6.4f · 🔒 Part 7 §6.4g · 🔒 Part 8 §6.4h)။ **DB design ပြီး (30/Sep) — table ၉၁** · **v5.2.15 = G (အသေးစား — §6.4i): test ၃၅၅ PASS, zip v7** **DBML / SQL ဖိုင်တွေကို `db/` folder နဲ့ အတူ သိမ်းပါ** (dbdiagram.io မှာ paste / PostgreSQL 16 မှာ test ပြီး)။

**သင်္ကေတ:** 🔒 Lock ပြီး (requirement) · 🔴 Risk — ကာကွယ်ရမယ့်အရာ · 🟡 Open decision — owner / မင်း ဆုံးဖြတ်ရန် · ⚠️ ဒီ review ရဲ့ အကြံပြုချက် — **approve မလုပ်မချင်း requirement မဟုတ်** · ✋ လုပ်ရမယ့်အလုပ် (system requirement မဟုတ်) · ✅ သဘောတူ၊ မပြောင်းသင့် · ❌ အချင်းချင်းဆန့်ကျင်နေ / 🔒 ကို ချိုးဖောက်နေ · ✖ Reject လုပ်ပြီး · ⏭ V1 မပါ · ⬜ မစရသေး · ⏩ DB part မစခင် ဆုံးဖြတ်ရန် (§3.0) · ★ owner ကို အရင်မေးရန် (Appendix B) · `P123` = conversation ထဲက Prompt 123 · `R123` = ChatGPT Response 123 · `RISK-nn` `OPEN-nn` `REC-nn` `ACT-nn` = §3.0 register ID · `F-P1-nn` `F-BK-nn` = DB draft review finding (§6.3–§6.4)

---

## မာတိကာ

0. [အခုအခြေအနေ — 02/Oct/2026 (ဒီကနေ ဆက်ပါ)](#0-အခုအခြေအနေ--02oct2026-ဒီကနေ-ဆက်ပါ)
1. [အတိုချုပ်](#1-အတိုချုပ်)
2. [ကောင်းတဲ့အချက်များ — မပြောင်းသင့်](#2-ကောင်းတဲ့အချက်များ--မပြောင်းသင့်)
3. [Decision Safety Review — စိုးရိမ်ချက်များ (Requirement မဟုတ်သေး)](#3-decision-safety-review--စိုးရိမ်ချက်များ-requirement-မဟုတ်သေး)
   - [3.0 Rule နဲ့ Register](#30-rule-နဲ့-register)
   - [3.12 Risk walkthrough ရလဒ် (v4)](#312-risk-walkthrough-ရလဒ်-v4)
4. [Fresha research repo ကို ဆန်းစစ်ချက်](#4-fresha-research-repo-ကို-ဆန်းစစ်ချက်)
5. [Platform နဲ့ Architecture — Claude Code နဲ့ Build မယ်ဆိုရင်](#5-platform-နဲ့-architecture--claude-code-နဲ့-build-မယ်ဆိုရင်)
6. [DB Design — Naming နဲ့ Part လိုက် အခြေအနေ](#6-db-design--naming-နဲ့-part-လိုက်-အခြေအနေ)
7. [နည်းနည်းပြင်ရုံနဲ့ ပိုကောင်းသွားမယ့်အချက်များ](#7-နည်းနည်းပြင်ရုံနဲ့-ပိုကောင်းသွားမယ့်အချက်များ)
8. [Phase / Release အစီအစဉ် အကြံပြုချက်](#8-phase--release-အစီအစဉ်-အကြံပြုချက်)
9. [နောက်ဆက်လုပ်ရန် အစဉ်လိုက်](#9-နောက်ဆက်လုပ်ရန်-အစဉ်လိုက်)
10. [UI/UX Guideline — Frontend website + Admin panel (v5.2.6 · v5.2.7 §10.9 · v5.2.8 §10.10)](#10-uiux-guideline--frontend-website--admin-panel-v526--v527-109--v528-1010)
11. [API Design — REST + OpenAPI, part လိုက် (v5.2.9)](#11-api-design--rest--openapi-part-လိုက်-v529)
12. [Architecture review + ADR (v5.2.10)](#12-architecture-review--adr-v5210)
- [Appendix A — Decision Register](#appendix-a--decision-register)
- [Appendix B — Owner ကိုမေးရန် (စုစည်းပြီး)](#appendix-b--owner-ကိုမေးရန်-စုစည်းပြီး)
- [Appendix C — Owner login နဲ့ Fresha မှာ ထပ်စစ်ရန်](#appendix-c--owner-login-နဲ့-fresha-မှာ-ထပ်စစ်ရန်)

---

## 0. အခုအခြေအနေ — 02/Oct/2026 (ဒီကနေ ဆက်ပါ)

> ChatGPT conversation ကို ဖျက်ပြီးနောက် "ဘယ်ရောက်နေလဲ၊ နောက် ဘာလုပ်မလဲ" ကို ဒီ section က ပြောပြတယ်။ Chat အသစ်မှာ (ChatGPT ဖြစ်ဖြစ် Claude ဖြစ်ဖြစ်) ဒီဖိုင်ကို attach လုပ်ပြီး §0.5 ထဲက prompt နဲ့ စပါ။

### 0.1 ဘယ်အဆင့် ရောက်နေလဲ

| အဆင့် | အခြေအနေ | ဘယ်မှာ |
| --- | --- | --- |
| Requirement lock (P1–P359) | ✅ ပြီး | Appendix A |
| Planning review (ဒီဖိုင်) | ✅ **v5.2.18 (02/Oct 14:50 — REC-41 ✅ website အရောင် ပြည့်စုံ · REC-42 ✅ coding guideline v1.0 approved)** · **v5.2.17 (02/Oct 14:30 — sheet 3 "အကုန် OK": OPEN-41 ✅ · API Part 0 / 1 v1.6 · Part 4 v1.1 · guideline v1.7 / v1.6 · change ၄ ခု apply လုပ်လို့ရပြီ)** · **v5.2.16 (02/Oct 13:00 — OPEN-40 ✅ · OpenSpec အဆင့်: D-PLT-20 · ADR-016 repo ၂ ခု · change ၄ ခု · coding guideline draft · dev plan / roadmap · 🟡 OPEN-41 sheet 3)** · **v5.2.15 (02/Oct 04:10 — one-sheet "အကုန်လုံး OK": API Part 3 🔒 + Part 4–8 🔒 v1.0 — API design ပြီး · DB G · ADR-013 / 014 / 015 · guideline v1.5 / v1.4 · independent review ၈၇ ✅ · 🟡 OPEN-40)** · **v5.2.14 (01/Oct 23:30 — scope A = ADR-012 · API Part 3 draft v1.0 · §0.8 Part 3 lock sheet)** · v5.2.13 (01/Oct 21:20 — §0.6 ဖြေပြီး: API Part 0 / 1 / 2 🔒 · ADR Accepted + ADR-011 · DB Part 2 v1.3 🔒 · §0.7 Part 3 sheet) · v5.2.12 (01/Oct 15:22 — SAVE POINT: decision sheet §0.6, D-PLT-19) · v5.2.11 (01/Oct 13:00 — API Part 2 draft v1.1 · DB Part 2 v1.3 ⚠️) · v5.2.10 (01/Oct 11:54 — owner API အဖြေ ၃ · API v1.2 · system design review + ADR ၁၀ · independent review ✅) · v5.2.9 (01/Oct 11:09 — guideline 🔒 + API design စ) · v5.2.8 (01/Oct 10:47 — owner ဒုတိယအကြိမ် အဖြေ) · v5.2.7 (01/Oct မနက် — owner guideline အဖြေ သွင်း) · v5.2.6 (01/Oct — UI/UX guideline ထည့်) · v5.1 (30/Sep နေ့လယ် — DB design ပြီး) | ဒီဖိုင် + `db/` + `docs/ux/` + `docs/api/` + `docs/architecture/` + `docs/adr/` |
| Decision Safety Review — **Risk ၁၇ ခု** | ✅ **ပြီး** — RISK-06 (discount) ✅ v5.1 (OPEN-09) · RISK-02 ကနေ ပေါ်လာတဲ့ conflict (OPEN-28) ✅ ဖြေရှင်းပြီး (v5.1) | §3.12, §3.0.2 |
| Decision Safety Review — OPEN / REC | ✅ ⏩ (DB Part 1 / 2 ကို ပိတ်ထားတာ) အကုန် ဆုံးဖြတ်ပြီး · ကျန်တာ = သက်ဆိုင်ရာ DB part ရောက်မှ | §3.0.4, §3.0.5 |
| DB design (P360–) | 🔒 **Part 1 (D-DB-02 — v3.4, 01/Oct: v3.3 column ၂ ခု — OPEN-33 / OPEN-10 · v3.4 = `show_own_earnings` nullable + `public_rating` — OPEN-37)** · Part 1b Login (D-DB-05) · Part 2 Services / Scheduling (**D-DB-06 — 🔒 v1.3 (01/Oct 21:20 owner confirm — `archived_at` ၂ column)**) · **Part 3 Customers / Booking (D-DB-07)** · **Part 4 Visit / Sale / Payment (D-DB-08)** — table ၄၂ · **Part 5 Commission / Payroll / Attendance (D-DB-09)** — table ၅၉ · **Part 6 Inventory (D-DB-10)** — table ၇၁ · **Part 7 Finance / Closing (D-DB-11)** — table ၇၉ · **Part 8 System / Website (D-DB-12)** — **✅ DB design ၈ part အကုန် 🔒 · table ၉၁ · PostgreSQL test ၂၉၆ PASS** (01/Oct 21:20 zip v6 — full schema load + test ဖိုင် ၆ ခု ပြန် run PASS) · **v5.2.15 (02/Oct — G, owner one-sheet): Part 4 constraints v1.2 (FINISH guard trigger ၄ ခု) · Part 5 v1.1 (attendance void · receivable / repayment `client_request_id`) · Part 6 v1.2 (`stock_movements.client_request_id`) · Part 7 v1.1 (cash out / return cancel · expense / income `client_request_id`) · Part 8 v1.1 (auto restore test · system purge) — table ၉၁ မပြောင်း · test ၃၅၅ PASS · zip v7 (§6.4i)** · **v5.2.16 (02/Oct မနက် — OPEN-40 ✅ "OPEN-40 OK"): Part 5 v1.2 (`employee_salaries` + `employee_commission_plans` မှာ `archived_at` / `archived_by_user_id` / `archive_reason`; overlap EXCLUDE `WHERE archived_at IS NULL`) · Part 7 v1.2 (FK `expenses.payroll_entry_branch_allocation_id` `ON DELETE SET NULL` + `expenses_source_refs_chk`; column အသစ် မရှိ) — table ၉၁ မပြောင်း · test ၃၉၃ PASS · zip v8 (§6.4j) · ဖိုင်နေရာ = `point-sdd/docs/db/`** | §6.2, §6.3 |
| **UI/UX guideline** (Frontend website + Admin panel) | 🔒 **frontend v1.7 (02/Oct 13:46 — REC-41 ✅: FE-VIS-01a token အကုန် 🔒 — အနီ `#C8281B` · အစိမ်း `#0E4A28` · အညို `#6A3A00` · အပြာ `#0B5CAD` · မီးခိုးစာ `#555555` · input ဘောင် `#707070` …; website အရောင် ပြည့်စုံ)** · 🔒 **admin v1.7 + frontend v1.6 (02/Oct 13:08 — sheet 3: START chip = catalogue အစဉ်, "Frequent here" အပိုင်း V1 မပါ (S7) · palette မရခင် focus ring = စာအရောင်, input ဘောင် = မီးခိုးရင့် (S15))** · 🔒 **admin v1.6 + frontend v1.5 (02/Oct မနက် — OPEN-40 ပိတ် · website palette `#EEEEEE` / `#000000` / `#DC5F00` (FE-VIS-01a / 01b) · design reference folder + "admin = Fresha ~၈၀ %, ပိုသုံးရလွယ်" (AD-META-08) · screen rule မပြောင်း)** · 🔒 **v1.2 APPROVED (01/Oct 11:09 — D-UX-03 / D-UX-04, REC-39 / 40 ✅)** · admin v1.3 (01/Oct 21:20 — AD-PERM-06 / 07 CRUD role matrix · AD-SCH-01 copy) · **admin v1.4 + frontend v1.3 (01/Oct 23:30 — scope A level hint · Part 3 sheet: no-show alarm / Cancel as no-show · Inactive · preferred barber · cutoff 2 h · .ics · service ≤ 5)** · **admin v1.5 + frontend v1.4 (02/Oct — API Part 4–8 delta: POS / receipt / attendance / payroll / stock / closing / finance / report / website / permission list + private level)** — ⚠️ rule အကုန် binding · ◐ OPEN-30 (website palette ✅ · **admin palette ★ ကျန်** → neutral ဆက်) · ⚠️ REC-41 (website ကျန် token အဆိုပြု) · ✅ ACT-06 (`point-sdd/docs/ux/` + `CLAUDE.md` ၂ ခု — v5.2.16) | **§10** · `docs/ux/` |
| **API design** (REST + OpenAPI — D-PLT-18 #2) | 🔒 **API design ပြီး (02/Oct) — Part 0 + Part 1–8 အကုန် lock** · Part 0 conventions **v1.6** (D-API-01) · Part 1 Foundation **v1.6** (D-API-02 — endpoint ၅၂ · code ၂၁) · Part 2 Catalogue & Scheduling **v1.4** (D-API-03 — ၅၀ · ၂၂) · **Part 3 Customers & Booking v1.1 (🔒 D-API-04 — ၃၈ · ၁၂)** · **Part 4 Visits / Sales / Payments v1.1 (🔒 D-API-05 — ၅၅ · ၂၂)** · **Part 5 Commission / Payroll / Attendance v1.0 (🔒 D-API-06 — ၆၉ · ၂၃)** · **Part 6 Inventory v1.0 (🔒 D-API-07 — ၅၈ · ၂၈)** · **Part 7 Finance / Closing v1.0 (🔒 D-API-08 — ၅၀ · ၂၇)** · **Part 8 Platform v1.0 (🔒 D-API-09 — ၆၉ · ၁၉)** — **endpoint ၄၄၁ · permission code ၁၇၄ · realtime event ၅၈ · notification type ၄၁ · job ၁၈** · OpenAPI 3.1 ၈ ဖိုင် validate ✅ (`x-permission` operation တိုင်း) · permission = menu CRUD + special (ADR-011) + data level company / branch / mixed / shared / **private** (ADR-012 + Amendment 1) · independent review ၈၇ ချက် ပြင်ပြီး (§11.9) · ✅ OPEN-40 → **Part 5 / 6 / 7 v1.1 (02/Oct မနက် — endpoint / DTO / code မပြောင်း; §11.10)** · 🟡 D-PAY-08 tax အစဉ် (owner ဖွင့်ချိန်) · ✅ spec ရေးရင်း တွေ့တဲ့ API စာသား ကွက်လပ် ဖြည့်ပြီး (02/Oct 13:08 — sheet 3): **Part 0 v1.6 · Part 1 v1.6 · Part 4 v1.1** — endpoint / DTO / code မပြောင်း (§11.11) · ✅ OpenSpec spec စပြီ (အောက် row) | **§11** · `docs/api/` |
| **Architecture review + ADR** | ✅ **System design v1.4 + ADR-016 (02/Oct မနက် — repo ၂ ခု: `point-sdd` + `point-barber`; ADR-001 Amendment 2; OPEN-40 ပိတ်)** · ✅ **System design review v1.3** (`docs/architecture/system-design.md` — Part 4–8 flow: FINISH + DayLock + receipt render · closing · payroll lock · stock ledger · file / report · lock order + isolation · realtime room · security level) · ✅ **ADR-001..015** (`docs/adr/`) — **Accepted ၁၄** (001–009, 011–015 — 011 #7 → 012; **012 Amendment 1 = `private` level**; **013 document rendering (Chromium) · 014 file storage (S3 bucket) · 015 reports / exports (live query) — owner H, 02/Oct**) · **Superseded ၁** (010 → 011) · ADR-002 job ၁၈ ခု · provider = Resend Free · HetrixTools Free (Email + Telegram) · Sentry Developer (ADR-007, D-ARC-02) · OPEN-38 ✅ | **§12** · `docs/architecture/` · `docs/adr/` |
| Owner မေးခွန်း | ✅ **§0.8 one-sheet (A–H, ၅၈ ချက်) "အကုန်လုံး OK" (02/Oct 00:06)** · ✅ **§0.9 OPEN-40 ("OPEN-40 OK" — 02/Oct 08:24)** · ✅ **§0.10 OpenSpec sheet ၂ ခု (02/Oct 08:58 · 09:17)** · ✅ **§0.11 sheet 3 — S1–S18 "အကုန် OK" (02/Oct 13:08 — OPEN-41 ✅)** · ✅ **§0.6 decision sheet အကုန် ဖြေပြီး (01/Oct 21:20 — #1–#24 + #25–#29)** · Appendix B #38 / #39 ✅ · ✅ **§0.7 API Part 3 question sheet ("အကုန် OK")** · ◐ #5, #21 (domain = production release ကျမှ owner) · ◐ Appendix B ကျန် (#11 — custom KPI ⏭) · ✅ #12 (preferred barber) · ◐ #30 (website palette ✅ · admin palette ★) · ✅ #41 (§0.11) | Appendix B, §0.6, §0.7, §0.10, §0.11 |
| Development plan (dev ၂ ယောက် ပြိုင်တူ) | ✅ **`docs/plan/dev-plan.md` v1.1 + `docs/plan/roadmap.md` (change ၈၁ row — ပထမ ၄ ခု 🔒 apply လုပ်လို့ရပြီ, ကျန် ⚠️ အဆိုပြု) + `docs/plan/spec-fixtures.md` (02/Oct — v5.2.17)** — Dev 1 = Website + Admin panel · Dev 2 = Admin panel · change တစ်ခု = dev တစ်ယောက် API + screen အပြည့် · 🔒 **schedule (S1): "တစ်လ" = pilot အထိ ပစ်မှတ်; V1 ရက် = ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ** · **လုပ်ပုံ (owner 13:07): Claude Code က ရေး၊ developer ၂ ယောက်က စစ်** → ခန့်မှန်း V1 ~၁ လခွဲ–၂ လခွဲ (သေချာစစ်) / ~၃–၄ ပတ် (ပေါ့ပေါ့စစ်) — dev-plan §6 · 🔒 pilot = ပထမ ၄ ခု + server + pilot data + late entry ပြီးမှ (S16) · *(အရင်:)* DB design ပြီးပြီ (D-PLT-14) · SDD = OpenSpec (D-PLT-17) · အစဉ် = UI/UX → API → Code (D-PLT-18) · owner ထပ်ပြောမယ့် အချက် စောင့် · **v5.2.15: API design ပြီး → NEXT = OpenSpec setup + spec (module အလိုက် change) — §0.4** | §0.4, §9 |
| **OpenSpec spec (D-PLT-17 / D-PLT-20)** | ✅ `openspec/config.yaml` (project context + artifact rule — CLI 1.14.0) · ✅ change ၄ ခု ရေးပြီး (`openspec validate --strict` ✅): `add-repo-scaffold` · `add-shared-ui-components` · `add-foundation-auth-access` · `add-walkin-visit-checkout` (requirement ၁၈၄ · scenario ၇၄၂ · task ၅၀၄ — v5.2.18: shared UI က approve ဖြစ်တဲ့ website token အကုန် ဆောက်) + brief ၄ ခု · ✅ **Open questions အကုန် ပိတ်ပြီး (02/Oct 13:08) → apply လုပ်လို့ရပြီ** · ⬜ ကျန် change ၇၆ (roadmap — brief မရေးရသေး; #81 `change-site-colour-tokens` = #2 ထဲ ပေါင်းပြီး) | `point-sdd/openspec/` · `docs/briefs/` · `docs/plan/roadmap.md` · §0.10 |
| **Coding guideline (D-ENG-02)** | 🔒 **v1.0 APPROVED (owner 02/Oct 13:46 — REC-42 ✅)** — `point-barber/docs/engineering/coding-guideline.md` (rule ID `CG-…` ၁၅၁ = rule ၁၄၅ + pointer ၆ · area ၂၂ · CI / lint စစ်ချက် ၈၉ — ဘယ် change က ဆောက်မလဲ ပါ) — **rule အကုန် binding (⚠️ ပါ)**; ပြောင်းရင် version အသစ် + register note · ကျန် = guideline §26 team item ၅ ချက် (OPEN-CG-02..06 — tool pin · coverage floor · CI က point-sdd ဖတ်ပုံ · library · GitHub plan) | `point-barber/docs/engineering/` · §12.11 |
| Prototype / build (Code) | ▶ **NEXT — `/opsx:apply add-repo-scaffold`** (ACT-09 + push ပြီးတာနဲ့; Claude Code က ရေး၊ developer က စစ်) · *(အရင်:)* API design ပြီးမှ (D-PLT-18 #3) — shared UI component အရင် (AD-IMPL-02) → walk-in → checkout vertical slice | §9, §10 |

### 0.2 အသစ် lock ဖြစ်ခဲ့တာ (Appendix A ထဲ ထည့်ပြီး)

**(ထ) v5.2.18 — REC-41 + REC-42 approve (Claude chat 02/Oct 13:46 → 14:50)** — row အပြည့် Appendix A (A.17 D-UX-02 / 04 · A.20 D-ENG-02)

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-UX-02 *(update)* · D-UX-04 **v1.7** | **Website ကျန် colour token အကုန် 🔒** — ring `#000000` · card `#FFFFFF` · muted `#E0E0E0` / မီးခိုးစာ `#555555` · border `#C4C4C4` · input ဘောင် `#707070` · secondary `#FFFFFF` · accent `#E0E0E0` · အနီ `#C8281B` · အစိမ်း `#0E4A28` · အညို `#6A3A00` · အပြာ `#0B5CAD` (FE-VIS-01a) | owner "Ok ပါတယ်" (13:46); contrast အကုန် မီ (မီးခိုးစာ 6.43:1 · အနီစာ 4.79:1 · input ဘောင် 4.27:1); `add-shared-ui-components` မ apply ရသေးလို့ အဲ့ထဲ တစ်ခါတည်း ဆောက် — `change-site-colour-tokens` (roadmap #81) မလိုတော့; website မှာ S15 ကြားဖြတ် ပြီးဆုံး (staff app မှာပဲ ကျန်) | ✅ REC-41 · ◐ OPEN-30 (admin palette ★ ကျန်) |
| D-ENG-02 *(update)* | **Coding guideline v1.0 = APPROVED** — rule အကုန် (⚠️ ပါ) binding | owner "Ok ပါတယ်" (13:46); rule စာသား မပြောင်း; §26 team item ၅ ချက် ကျန် (ပထမ change တွေကို မတား) | ✅ REC-42 |


**(တ) v5.2.17 — Sheet 3 "အကုန် OK" → change ၄ ခု apply လုပ်လို့ရပြီ (Claude chat 02/Oct 13:07 → 14:30)** — row အပြည့် Appendix A (A.1 D-PLT-14 / 20 · A.4 D-ROLE-08 · A.5 D-AUTH-04 / 06 · A.8 D-VIS-13 · A.14 D-DAT-05 · A.17 D-UX-03 / 04 · A.18 D-API-01 / 02 / 05) · မေးခွန်း + အဖြေ **§0.11** · အသေးစိတ် **§11.11, §12.12**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-PLT-14 *(note)* | **S1:** "တစ်လ" = **pilot အထိ** ပစ်မှတ်; V1 အပြည့်ရက် = ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ owner သတ်မှတ် · **လုပ်ပုံ: Claude Code က ရေး၊ developer ၂ ယောက်က စစ်** (owner 13:07) | scope မဖြုတ်၊ release မခွဲ; ခန့်မှန်း V1 ~၁ လခွဲ–၂ လခွဲ (သေချာစစ်) — တိုင်းထားတာ မဟုတ်သေး | ✅ OPEN-41 S1 |
| D-PLT-20 *(note)* | **S3:** capability **၂၅ ခု 🔒** (`platform-runtime`, `ui-foundation` OK) · **S2:** ပထမ change ၄ ခု ဒီအတိုင်း (PR ခွဲ merge; နောက်ဆုံး PR မှာ workbook) · **S16:** walk-in ပြီး → server + pilot data + late entry → pilot · **S18:** အဆိုပြုစာသားနဲ့ စ၊ owner က brief / PR မှာ ပြင် | အရွယ် rule ရဲ့ လက်ခံထားတဲ့ ခြွင်းချက် — story တစ်ခုလုံး တစ်နေရာတည်း | ✅ OPEN-41 S2 / S3 / S16 / S18 |
| D-API-01 **v1.6** | 500 = `internal_error` (S4) · field-level code = Zod နာမည် (S5) · reason field = part သတ်မှတ်တဲ့အတိုင်း (S8) · code စစ်တာ ၁၀ / နာရီ / IP (S9) · scope ပြင်ပ = `forbidden` (S12) | စာသား ကွက်လပ် ဖြည့်တာပဲ — endpoint / DTO / permission code မပြောင်း | ✅ OPEN-41 |
| D-API-02 **v1.6** | P1-RULE-14 ပထမ admin = operator command (S6) · P1-RULE-15 browser တစ်ခု = session တစ်ခု (S14) · `permission.sync` (S13) · lock အဖြေ စာသားအတိုင်း (S10) · `email_invalid` / `otp_format` · OTP endpoint မှာ CSRF header (R1) | OpenAPI 1.6.0 validate ✅; endpoint ၅၂ မပြောင်း | ✅ OPEN-41 |
| D-API-05 **v1.1** | `correction_path` မပါတဲ့ case ၂ ခု (FINISHED sale မှာ payment ထပ်ထည့် · CANCELLED sale ကို ရေးတာ အကုန်) (S17) | rule မှာ မပါတာ မတီထွင်; OpenAPI 1.1.0 validate ✅ | ✅ OPEN-41 |
| D-UX-03 **v1.7** · D-UX-04 **v1.6** | START chip ၆ ခု = catalogue အစဉ်; "Frequent here" V1 မပါ (S7) · palette မရခင် focus ring = စာအရောင်, input ဘောင် = မီးခိုးရင့် (S15) | အရောင်အသစ် မတီထွင် — ရှိပြီးသား neutral token; website `#EEEEEE` ပေါ် input ဘောင် မမြင်ရတာ ပြေ | ✅ OPEN-41 · ◐ OPEN-30 · ⚠️ REC-41 ကျန် |
| D-AUTH-04 / 06 · D-ROLE-08 · D-VIS-13 · D-DAT-05 *(note)* | verify IP cap + lock အဖြေ (S9 / S10) · browser တစ်ခု session တစ်ခု + ပထမ admin command (S14 / S6) · `permission.sync` (S13) · pilot မတိုင်ခင် late entry (S16) · archive row = audit log မှာပဲ (S11) | API v1.6 / roadmap နဲ့ ကိုက်အောင် register note | ✅ OPEN-41 |
| OpenSpec change ၄ ခု | Open questions အကုန် ပိတ် → **apply လုပ်လို့ရပြီ**; approve ဖြစ်တဲ့ requirement ထည့် (ပထမ admin · verify cap · same-browser · focus outline / input border · catalogue-order chip · offline help) | requirement ၁၈၄ · scenario ၇၃၈ · task ၅၀၄; `openspec validate --all --strict` ✅ | §12.12 |


**(ဏ) v5.2.16 — "OPEN-40 OK" + OpenSpec spec အဆင့် (Claude chat 02/Oct 08:24 → 13:00)** — row အပြည့် Appendix A (A.1 D-PLT-14 / 17 / 20 · A.14 D-DAT-05 · A.16 D-DB-09 / 11 · A.17 D-UX-02 / 03 / 04 · A.18 D-API-06 / 07 / 08 · A.19 D-ARC-01 / 03 · A.20 D-ENG-01 / 02) · မေးခွန်း + အဖြေ **§0.10** · ကျန် **§0.11** · အသေးစိတ် **§6.4j, §11.10, §12.11**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-DAT-05 *(note)* · D-DB-09 **v1.2** · D-DB-11 **v1.2** | **OPEN-40 ✅ ("OPEN-40 OK"):** (a) payroll reopen = အဲ့ run ရဲ့ လစာ expense ကို **soft delete** ("Payroll reopened — <reason>"), finalize ပြန်လုပ်ရင် row အသစ် (b) မှားထည့် + မသုံးရသေး လစာ row / commission plan ချိတ်တာ = **archive** (`archived_at` / `archived_by_user_id` / `archive_reason`) (c) DRAFT purchase / transfer line = ဖျက် + audit diff အပြည့် | hard delete ✖ (D-DAT-05) ကို မချိုး; Part 2 v1.3 မှာ approve ခဲ့တဲ့ ပုံစံတူ; DB = column ၆ ခု + FK action ၁ + CHECK; table ၉၁ မပြောင်း; test ၃၅၅ → **၃၉၃ PASS** | ✅ OPEN-40 |
| D-API-06 / 07 / 08 **v1.1** | API Part 5 / 6 / 7 ထဲက ⚠️ OPEN-40 စာသား → 🔒; OpenAPI `info.version` 1.1.0 | endpoint / DTO / error code **မပြောင်း** (စစ်ပြီး) | ✅ OPEN-40 |
| **D-PLT-20** *(new)* | **OpenSpec ရေးပုံ:** CLI 1.14.0 (`openspec/config.yaml`) · change တစ်ခု = form / topic တစ်ခု (၁–၃ ရက်, test case ~၂၀–၃၀) · requirement = **တန်ဖိုးပါတဲ့ SHALL စာကြောင်း + source ID** · scenario = တကယ့် နာမည် / MMK / အချိန် · capability = business area ၂၅ · English + မြန်မာ အတိုချုပ် · ပထမ change အစဉ် ၄ ခု | Owner: "D-PAY-04 ကြည့်" ချည်းဆို validate / review မရ၊ test case ဝိုးတဝါး; change သေးရင် review လွယ်၊ archive စော | owner sheet A1 · C1–C5 · #5 / #6 |
| **D-ARC-03** *(new — ADR-016)* | **Repo ၂ ခု:** `point-sdd` (spec hub — OpenSpec store; planning source အကုန် `docs/` အောက်) + `point-barber` (app — `store: point-sdd` pointer); workspace `point/`; `/opsx:apply` = point-barber ထဲ; design ပြောင်း = point-sdd မှာ အရင်; repo ၂ ခု private | Spec ရေးသူ / developer အလုပ်ခွဲ; code session မှာ app ရဲ့ `CLAUDE.md` + coding guideline အလိုလို ဝင်; ADR-001 action item 1 ကို amend | owner sheet C5 · D5 · #3 / #4 / #8 |
| **D-ENG-01** *(new)* | **Tooling + စစ်ဆေးပုံ:** pnpm + Turborepo · Node 24 LTS · TypeScript strict · ESLint + Prettier · Vitest + PostgreSQL 16 integration + Playwright · GitHub Actions · branch တို + review ၁ + squash · Conventional Commits (scope = change id) · catalogue = `/dev/ui` · စက်နဲ့ စစ်လို့ရတာ = CI fail · test login = Email OTP + Mailpit | Owner sheet D2 / D3 / D4 / #9 "သဘောတူတယ်" | – |
| **D-ENG-02** *(new)* | **Coding guideline** = `point-barber/docs/engineering/coding-guideline.md` (rule `CG-…`); reference = Google TS Style Guide · Clean Code / SOLID · Twelve-Factor · OWASP ASVS · NestJS / Next.js / Prisma docs · Conventional Commits · test pyramid | Owner rule 11 ("lawsofux.com လိုမျိုး … coding guideline သေချာသတ်မှတ်") + D1; content Draft v1.0 = ⚠️ approve စောင့် | ⚠️ REC-42 |
| D-UX-02 *(update)* | **Website palette:** `#EEEEEE` နောက်ခံ · `#000000` စာ · `#DC5F00` decoration; ခလုတ် = အမည်း + စာဖြူ; လိမ္မော် = decoration / ခေါင်းစဉ်ကြီး / icon ပဲ · **admin palette မပေးရသေး → neutral** · `site` tree က colour token ပါ override · design reference = `point-barber/design-reference/` (admin = Fresha ~၈၀ % + ပိုသုံးရလွယ်) | လိမ္မော်ပေါ် စာဖြူ 3.70:1 · `#EEEEEE` ပေါ် လိမ္မော်စာ 3.19:1 — စာသေး 4.5:1 မမီ (AD-VIS-04) | ◐ OPEN-30 · ⚠️ REC-41 |
| D-UX-03 **v1.6** · D-UX-04 **v1.5** | admin: OPEN-40 ပိတ် · AD-META-08 design reference · AD-META-05a path note · AD-META-01 precedence ၇ ဆင့် အပြည့်ရေး · AD-IMPL-06 = `/dev/ui` (D-ENG-01) — frontend: FE-VIS-01 / 01a / 01b (palette + ဘယ်မှာ သုံးရ; `🟡 REC-41` row = အဆိုပြု) · FE-META-01 ၇ ဆင့် · FE-META-04a · FE-META-06 — ဥပမာရက်စွဲ နေ့နာမည် ပြင် (30/Sep, 07/Oct/2026 = Wed) | screen rule မပြောင်း | – |
| D-PLT-14 *(note)* | Dev 1 = Website + Admin panel · Dev 2 = Admin panel · change တစ်ခု = dev တစ်ယောက် API + screen အပြည့် (walk-in = Dev 2) · spec ရပြီး §0.11 ဖြေပြီးတာနဲ့ စ | Owner A2 / #7 · ⚠️ schedule ခန့်မှန်း ≠ "တစ်လ" (dev-plan §6) | 🟡 OPEN-41 S1 |
| D-ARC-01 *(note)* | system design **v1.4** · ADR-001 Amendment 2 · record = ADR-001..016 | OPEN-40 ပိတ် + repo ၂ ခု | – |


**(ဎ) v5.2.15 — One-sheet "အကုန်လုံး OK" → API Part 3–8 lock + DB G + ADR-013 / 014 / 015 (Claude chat 01/Oct 23:27 → 02/Oct 04:10)** — row အပြည့် Appendix A (A.2 · A.7–A.16 note · A.17 D-UX-03 / 04 · A.18 D-API-01..09 · A.19 D-ARC-01) · မေးခွန်း + အဖြေ **§0.8** · ကျန် ၁ ချက် **§0.9** · အသေးစိတ် **§6.4i, §11.9, §12.10**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| **D-API-04** *(🔒)* | **API Part 3 v1.1 lock** (A1) — reschedule မှာ ဖြုတ်တဲ့ `booking_items` row = ဖျက် + audit အပြည့် (A2) · Manager seed = ကိုယ့် branch service ရောင်း / ကြာချိန် + branch setting override (A3) · v1.1 = booking barber ≠ လုပ်သူ → နည်းတဲ့ဈေး (B4) · public မဟုတ်တဲ့ branch ရဲ့ booking link လည်း ရ · ပိတ်ရက်ထဲက booking ကို no-show job မထိ (F8) | Owner one-sheet A1–A3 | §0.8 |
| **D-API-05** *(🔒 new)* | **API Part 4 v1.0 — Visits, Sales & Payments** — endpoint ၅၅ · code ၂၂ · P4-RULE-01..22: START (walk-in / booking / ကူမှတ် / အိမ် / late entry) · line · COMPLETE / INCOMPLETE · checkout total · discount code + request · payment (cash / KBZPay / split / void / ✔) · FINISH (receipt no., DB guard) · product-only sale · ကွာငွေ sale · refund ၂ မျိုး · adjustment ledger · receipt (server render) | B1–B12 · G (f) · H | – |
| **D-API-06** *(🔒 new)* | **API Part 5 v1.0 — Commission, Payroll & Attendance** — endpoint ၆၉ · code ၂၃ · P5-RULE-01..20: commission plan / tier / assignment · estimate (အဆင့်ခွဲ) · salary · payroll run wizard (calculate → finalize → publish → paid → reopen) · payslip · advance / loan · QR + GPS attendance · exception board · `PayrollLock` | C1–C12 · G (a)(b) | OPEN-40 (a)(b) |
| **D-API-07** *(🔒 new)* | **API Part 6 v1.0 — Inventory** — endpoint ၅၈ · code ၂၈ · P6-RULE-01..16: product / category / supplier / reason · stock level + ledger (`StockLedger.post`) · usage · adjustment · purchase (draft → admin post → expense) · transfer ၂ ဆင့် · count (မမြင်ဘဲ ရေ) · ညစဉ် reconcile | D1–D9 · G (c) | OPEN-40 (c) |
| **D-API-08** *(🔒 new)* | **API Part 7 v1.0 — Finance & Daily Closing** — endpoint ၅၀ · code ၂၇ · P7-RULE-01..19: daily closing (`DayLock`, expected cash, KBZPay list, reopen) · cash out / return (edit / cancel) · reason master · category · expense / income (approval) · P&L · လကုန် must-return job | E1–E8 · G (d) | OPEN-40 (a) |
| **D-API-09** *(🔒 new)* | **API Part 8 v1.0 — Platform** — endpoint ၆၉ · code ၁၉ · P8-RULE-01..20: notification (type ၄၁) · attachment (staging → link, signed URL, public media) · audit · import · export · backup / restore · website content + ဖွင့်ချိန် / ပိတ်ရက် · public site API · report ၁၀ · dashboard | F1–F12 · G (e) · H | – |
| D-API-01 / 02 / 03 *(🔒 v1.5 / v1.5 / v1.4)* | Part 4–8 လိုအပ်ချက် သွင်း — **private level** · final `Idempotency-Key` စာရင်း (၁၃ operation) · lock အစဉ် + isolation + `PayrollLock` (API-IDEM-06) · realtime ၅၈ (payload = id ပဲ — ADR-008) · error code ညှိ · settings key ထည့် / ဖြုတ် · `site.*` = Part 8 ကပဲ ရေး · late entry quote = မပိတ်ရသေးတဲ့ ရက်မဆို (B11) · finalize ပြီး period ထဲ shift / leave = 423 | One-sheet + part report | – |
| **D-ROLE-07 / 09** *(note)* + **ADR-012 Amendment 1** | **Data level အသစ် `private`** — commission / payroll / salary / advance (`receivable.issue` ပါ) / report ⑦ / ဝန်ထမ်း document = **company scope နဲ့မှ** (branch scope နဲ့ ✔ ထားလည်း ဘာမှ မရ — list ပါ 403) · code ၁၈ ခု · branch မပါတဲ့ ငွေ row + company P&L + branch မပါတဲ့ audit row = company scope · ဗီရိုက advance ရဲ့ ယူသူနာမည် = payroll ခွင့်ရှိသူပဲ မြင် · **seed:** Manager = pay code ✖; Barber += `sale.create`, `sale.late_entry`, `stock.usage` | C1 · E6 · F10 · F11 | – |
| D-VIS-02 / 04 / 06 / 07 / 08 / 09 / 12 / 13 · D-SVC-04 *(note)* | customer တပြိုင်နက် ၂ ယောက် ရ — ငွေမရှင်းရသေး visit ပဲ ပိတ် (B1) · ကိုယ်စား FINISH = `sale.finish_override` Admin + Manager (B2) · ငွေလက်ခံသူ = branch ဝန်ထမ်း မည်သူမဆို (B3) · နည်းတဲ့ဈေး (B4) · FINISH ပြီး ပြင်ခွင့် = customer + KBZPay ref ပဲ; ဈေးနည်း = ကွာငွေ sale (B10) · late entry = မပိတ်ရသေးတဲ့ ရက်မဆို (B11) · ပိတ်ပြီးနေ့ / finalize ပြီး period = ✖ (B9) | B1–B4 · B9–B12 | – |
| D-PAY-02 / 04 / 05 / 06 / 07 / 08 *(note)* | ပိတ်ပြီးလည်း KBZPay ✔ ရ (E3) · discount ၁၀၀ ပြည့် (B6) + B7 ၄ ချက် · refund = Admin, sale branch, method မည်သည်မဆို, စင်ပေါ် / ပျက်စီး (B8, B12) · KBZPay ပိုလွှဲ ပြန်အမ်း auto (B5) · receipt = server render + သိမ်း (H) · printer width = branch setting, auto-print OFF | B5–B8 · E3 · H | REC-37 ✅ |
| D-COM-01 / 04 · D-PAYR-01 / 02 / 04–08 · D-ATT-01–06 *(note)* | pay data = Admin ပဲ (C1) · advance = `cashout.create` + `receivable.issue`, ကိုယ့်ကိုယ်ကို ✖ (C2) · cash ပြန်ဆပ် = owner လက်ထဲ (C3) · paid ရက် တစ်ရက် (C4) · ရက်အလိုက် ခွဲ (C5) · net ≥ 0 (C6) · finalize = လကုန် + စာရင်းပိတ် အကုန် (C7) · grace (C8) · shift တစ်ဝက် (C9) · clock-out ခလုတ် + GPS (C10) · ကိုယ့်ဟာကိုယ် ✖ (C11) · estimate အဆင့်ခွဲ (C12) | C1–C12 | – |
| D-STK-01–06 *(note)* | ဗီရိုနဲ့ ဝယ် = expense ၁ ခါပဲ (D1) · Manager draft / Admin post (D2) · post ပြီး undo ✖ (D3) · လက်ခံသူ (D4) · အနုတ် ရ (D5) · low stock (D6) · သုံးကုန် (D7) · count (D8) · ပျောက် / ပျက် (D9) | D1–D9 | – |
| D-FIN-01–09 *(note)* | ညနေ ငွေအပ် = Cash Out (E1) · customer ရှိတုန်း ပိတ်မရ (E2) · auto-approve rule (E4) · cash out ပြင် / cancel (E5) · Manager P&L = လစာ တစ်ကြောင်း (E6) · pending cash income = expected cash ထဲ (E7) · D-FIN-06 စာသား ညှိ (E8) · လကုန် job = အဲ့လ အကုန် ပိတ်ပြီးမှ | E1–E8 | – |
| D-RPT-01 · D-KPI-01–03 · D-DSH-01 / 03 · D-DAT-01–04 · D-AUD-01 · D-NTF-02 / 03 · D-WEB-01 / 02 / 04 · D-EMP-03 *(note)* | report ၁ ခု = code ၁ ခု (F1) · `data.export` (F2, F3) · cloud bucket (F4) · import = master data ပဲ (F5) · refund ရက် / returning (F6) · `website.update` (F7) · ပိတ်ရက် (F8) · restore (F9) · audit pay row (F10) · document (F11) · "admin" noti (F12) | F1–F12 | OPEN-18 ✅ · REC-30 ✅ · OPEN-11 ◐ |
| D-DB-08 … 12 *(🔒 version)* | **DB G** — Part 4 constraints **v1.2** · Part 5 **v1.1** · Part 6 **v1.2** · Part 7 **v1.1** · Part 8 **v1.1** — column / index / CHECK အသေးစားပဲ; table ၉၁ မပြောင်း; **test ၃၅၅ PASS** (§6.4i) | G (a)–(f) | – |
| D-ARC-01 *(update)* | **ADR-013** (PDF / receipt / payslip = server Chromium; receipt ဖိုင်သိမ်း) · **ADR-014** (file = S3 bucket, staging → link, signed URL, public media path) · **ADR-015** (report = live query ≤ 366 ရက်; export job) — **Accepted** · ADR-012 Amendment 1 · ADR-002 job ၁၈ · ADR-006 / 007 / 008 / 009 note · system design **v1.3** | Owner H · F4 | – |
| D-UX-03 / 04 *(v1.5 / v1.4)* | Admin v1.5 = Part 4–8 delta (AD-POS / RCPT / ATT / PAY / STK / CLS / FIN / RPT / WEB / PERM-06 / 07 …) · Frontend v1.4 = split-day barber, browser "Open now", media path | Part report §3 | – |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.15): **§0.9 — OPEN-40 (တစ်ချက်တည်း)** · 🟡 D-PAY-08 tax / service charge အစဉ် (ဖွင့်ချိန်မှ) · ★ OPEN-30 colour / logo (spec အဆင့် — အခု ရောက်ပြီ) · ★ go-live data / setting တန်ဖိုး · ★ seed matrix (go-live မတိုင်ခင်)

**(ဍ) v5.2.14 — Scope A + API Part 3 draft (Claude chat 01/Oct ည 22:16 → 23:30)** — row အပြည့် Appendix A (A.2 D-ROLE-02 / 07 / 09 · A.5 D-CUS-07 / 08 · A.6 D-BKG-03 / 11 / 12 / 13 / 17 · A.17 D-UX-03 / 04 · A.18 D-API-01..04 · A.19 D-ARC-01) · အဖြေ **§0.7** · lock ရန် **§0.8** · အသေးစိတ် **§11.8, §12.9**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| **ADR-012** + D-ROLE-02 / 09 *(update 🔒)* | **Permission ✔ ဘယ်အထိ ရောက်လဲ = data အဆင့်** — (1) **company master** (service နာမည် / category / option / archive, role, leave type, cancel reason, company setting တန်ဖိုး, company info, branch ဖွင့် / ပိတ်) = ပြင်ခွင့် **company scope** ပဲ; branch scope နဲ့ ✔ ထားရင် **ကြည့်ရုံ** (ပြင်ရင် 403 `company_scope_required`) (2) **branch data** (ဒီ branch မှာ ရောင်း / မရောင်း + ကြာချိန်, ဈေး, eligibility, schedule, ခွင့်, booking, branch setting override, branch info, ဝန်ထမ်း) = ကိုယ့် scope ထဲက branch ပဲ (3) **shared** (customer) = ✔ ရှိရင် ရ, booking / sale history = ကိုယ့် branch ပဲ · code တိုင်း `level` (company / branch / mixed / shared) · **Manager seed ပြန်ထည့်:** `service.view` / `update` (ကိုယ့် branch ရောင်း + ကြာချိန်) · `settings.view` / `update` (branch override) | Owner 22:16: "Manager က သူ့ Branch မှာရှိတဲ့ Service တွေ Setting တွေကို Manage မလုပ်နိုင်ဘူး ဖြစ်သွားမှာပေါ့" → **A** · v5.2.13 ADR-011 #7 ("company code = company scope ကနေမှ") ကို အစားထိုး — ADR-011 ကျန်တာ မပြောင်း · D-ROLE-07 ("Manager company-wide ✖") = company master ✖ အတိုင်း; ချွင်းချက် = customer (shared — D-CUS-01) | – |
| D-API-01 / 02 / 03 *(🔒 v1.4 / v1.4 / v1.3)* | Scope A ကို Part 0 (API-PERM-02 decorator · **API-PERM-07** · `company_scope_required` · problem `context` · public path) · Part 1 (**P1-RULE-13** · settings = mixed, `editable` · jobs = company scope · `level`) · Part 2 (category / service master / option / leave type = company; **P2.SVC.06 ရောင်း + ကြာချိန် = item တစ်ခုချင်း branch စစ်**; `sold=all` = ကိုယ့် branch) ထဲ သွင်း | Owner A · independent review ✅ | – |
| D-API-04 *(⚠️ draft → 🔒 v5.2.15)* | **API Part 3 v1.0 — Customers & Booking + public** — endpoint **၃၈** · code **၁၂** · P3-RULE-01..13 · DB Part 3 v3 မပြင် · §0.7 အဖြေ ၁၀ ချက် အကုန် ထည့် — **owner lock ရန် §0.8** | "API Part 3 question sheet အကုန် OK" | §0.8 |
| D-BKG-12 *(note)* | Customer link နဲ့ ပြောင်း / cancel = **ချိန်းချိန် ၂ နာရီ (120 မိနစ်) အလို** အထိ (setting `booking.customer_change_cutoff_minutes`; staff ✖) · booking ထဲ **နာမည် = ပြင်ရ (ဒီ booking ပဲ) · ဖုန်း = မပြင်** (မှားရင် cancel "Other" + booking အသစ်) | §0.7 #1, #10 | – |
| D-BKG-17 *(note)* | No-show alarm = **booked barber + အဲ့ branch ကို စီမံသူ** (`booking.update` — branch scope နဲ့ ရှိသူ / branch ထဲ assign ထားတဲ့ company-scope သူ) · snooze ၁၀ × ၄ · ၄၀ မိနစ် auto-cancel · **staff က "Customer မလာ" (no-show reason) နဲ့ ၄၀ မပြည့်ခင် cancel ရ** (no-show history ထဲ ဝင်) · confirmation page မှာ ၄၀ မိနစ် rule ပြော | §0.7 #2, #3, #4 | – |
| D-BKG-03 / 11 / 13 *(note)* | Website booking = service **≤ ၅** (staff ကန့်သတ် ✖) · **.ics = browser ထဲမှာ ထုတ်** (server ✖ — D-CUS-05; manage link ပါ) · barber = **ကိုယ့်နာမည် booking ကို code မလိုဘဲ** ဖန်တီး / ရွှေ့ / cancel / snooze (barber ပြောင်းရင် `booking.update`) | §0.7 #8, #5, #9 | REC-36 ✅ |
| D-CUS-07 / 08 *(note)* | **Inactive** = list / search မှာ default မပြ · ဖုန်းနဲ့ ပြန်လာရင် auto Active · website ✖ မပိတ် · **Preferred barber** = နောက်ဆုံး finished visit **၅ ခုထဲ ၃ ခု+** (setting ၂ ခု) | §0.7 #7, #6 | OPEN-12 ✅ |
| D-ROLE-09 *(note — Part 3)* | Permission code: `customer.view / create / update / delete` (shared) · `booking.view / create / update / delete` (delete = cancel) · `booking_cancel_reason.*` (company) · **Barber seed = `booking.view` + `customer.view` + `customer.create`** (barber ရဲ့ ပထမဆုံး code) | §0.7 #9 | – |
| D-UX-03 / 04 *(v1.4 / v1.3)* | Admin v1.4 = AD-PERM-03 / 06 / 07 level hint · AD-BKG-01 / 02 / 09 · AD-CUS-01 / 02 · Frontend v1.3 = FE-BK-05 (≤ 5) / 10 / 11 (`price_changed`, retry check) · FE-CONF-02 (.ics) / 03 (၄၀ မိနစ် စာ) · FE-MNG-05 (cutoff 2 h) | §0.7 + scope A | – |
| D-ARC-01 *(update)* | **ADR-012 Accepted** (ADR-011 #7 အစားထိုး) · system design **v1.2** · ADR-002 / 007 action item = no-show job (singletonKey မသုံး) · jobs panel company scope | Owner A · review #4 | – |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.14): **§0.8 — API Part 3 lock (၃ ချက်)** · ★ OPEN-30 colour / logo (spec အဆင့်) · ★ go-live data / setting တန်ဖိုး · ★ seed matrix (go-live မတိုင်ခင်)

**(ဌ) v5.2.13 — Owner decision sheet ဖြေ → lock + batch (Claude chat 01/Oct 21:20)** — row အပြည့် Appendix A (A.2 D-ROLE-02 / 09 · A.16 D-DB-06 · A.18 D-API-01..03 · A.19 D-ARC-01 / 02 + note row) · အဖြေ အပြည့် **§0.6** · အသေးစိတ် **§11.7, §12.7**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-API-01 *(🔒)* | **API Part 0 v1.3 lock** — booking idempotency = client manage token (ADR-004) · public rate limit = IP ၁ နာရီ ၁၀ ကြိမ် + ဖုန်း ၁ နာရီ ၃ ကြိမ် · captcha = **Cloudflare Turnstile** · wire status = number · origin တစ်ခုတည်း `/api` (ADR-009) · API-PERM-06 = CRUD (ADR-011) · Part 2 amendment (event ၄ · read-scope room) | Owner: §0.6 ကျန် ၁၈ ချက် **"အကုန် OK"** | OPEN-38 ✅ |
| D-API-02 *(🔒)* | **API Part 1 v1.3 lock** — permission code **၂၁** (CRUD) · invite email = ဝန်ထမ်း ထည့်တာနဲ့ ချက်ချင်း · branch code `^[A-Z0-9]{1,10}$` · client-readable setting ၈ ခု · picker filter (repeatable `service_id`, `home`, `date`) · read scope = assignment ∪ grant | #6–#8 default · Part 2 amendment | – |
| D-API-03 *(🔒)* + D-DB-06 *(🔒 v1.3)* | **API Part 2 v1.2 lock** — buffer **ပေါင်း** · ပိတ်ရက် = staff booking ပါ ✖ · APPROVED ခွင့် cancel = `leave.approve` · self-approval ✖ · option group ≤ 2 · walk-in = ခန့်မှန်း ပြီးချိန်အထိ ပိတ် · နောက်ဆုံး slot = buffer ပါ shift ထဲ · pattern save = roster ချက်ချင်း · **DB Part 2 v1.3 (`archived_at` ×2)** · permission code **၂၂** · read rule (operational = code မလို / management = `view⁺`) | #16–#24 default | OPEN-39 ✅ |
| D-ROLE-02 *(update 🔒)* + **ADR-011** | **Permission = menu တစ်ခုချင်း CRUD** — `<module>.view` / `create` / `update` / `delete` (အဓိပ္ပာယ်ရှိတာပဲ) + **special action** (approve, refund, finalize, close, assign, field group `*_update`); `manage` ✖ · `delete` = archive / ပိတ် / cancel (data မပျောက် — D-DAT-05) · `view` = menu + စီမံ screen; POS / booking / calendar list = ဝန်ထမ်း အကုန် code မလို · **company admin = Role ၅ code (`role.view` + `create` + `update` + `delete` + `assign`) company scope** | Owner list "Permission matrix" ("Manage ဆိုပြီး ဘုံမဟုတ်ဘဲ view, create, update, delete") ↔ "Company admin" (`role.manage` + `role.assign`) ဆန့်ကျင် → Claude STOP (D-PLT-13) → **#25 = A** ("ဒါနဲ့ ပုံစံအတူတူ"), **#26 a–d OK** · ADR-010 → **Superseded** | – |
| D-ROLE-09 *(new 🔒)* | **Seed role = Admin / Manager / Barber** — Admin = permission **အကုန် ✔** (company scope → company admin ပါ); Manager = admin က လိုတာပဲ ✔ (API part တိုင်းရဲ့ code table "Seed" မှာ Manager ပါတဲ့ code = အစ; `company` code = company-scope assignment ကနေမှ သက်ရောက်); Barber = Part 1–2 management code မပါ (ကိုယ့် data + operational list နဲ့ လုံလောက်) · go-live မတိုင်ခင် seed matrix ကို owner ပြ ★ | Owner: "Default Roles သုံးမယ်။ Admin / Manager / Barber" · "အကုန်လုံးကို check လုပ်ထားရင် Admin; မန်နေဂျာဆိုရင် သူ့အတွက် check လုပ်မယ့် ဟာပဲ" | – |
| D-ARC-01 *(update)* | **ADR-001…009 Accepted** (001 reconfirm "1 VPS / Docker Compose") · **ADR-010 Superseded → ADR-011 Accepted** | Owner sheet #9–#15 + ADR-001 OK | REC-31 / 32 / 35 / 38 ✅ |
| D-ARC-02 *(new 🔒)* | **Ops provider (ADR-007):** email = **Resend Free** (OTP + invite ပဲ; ၁၀၀ / ရက်, ၃,၀၀၀ / လ) · uptime = **HetrixTools Free** (၁ မိနစ်တစ်ခါ; alert = **Email + Telegram** — Telegram = ဖုန်း push; ရက် ၉၀ တစ်ခါ login) · error = **Sentry Developer (Free)** (user ၁, error ၅,၀၀၀ / လ, email alert; Team = လိုမှ) · account ၃ ခု = **owner ပိုင် ops Gmail** · dev / staging = **Mailpit** · barber pilot = **Google login ပဲ** · domain = production release ကျမှ owner ကိုယ်တိုင် ထည့် (DNS access ✅) + Resend မှာ **go-live ၂–၃ ရက် အလို** verify | Owner: "Resend ကို Free ရအောင်သုံးမယ်" · "Telegram ကို အမြဲ ပို့လို့ရလား" (→ ရ — HetrixTools bot) · "Sentry" · #27 / #28 / #29 | ACT-05 · ACT-08 (new) |
| D-DAT-03 *(note)* | Backup **RPO = daily** (အဆိုးဆုံး ၂၄ နာရီ data ပျောက်နိုင်) — V1 လက်ခံ; နာရီအလိုက် WAL = revisit trigger | #15 default | – |
| D-SVC-05 / 07 · D-BKG-04 / 11 / 21 · D-WEB-04 · D-LV-02 · D-SCH-01 · D-AUTH-03 *(note)* | API Part 0 / 2 ဆုံးဖြတ်ချက်ကို decision row မှာ note — option ≤ 2 (API) · buffer ပေါင်း · walk-in ခန့်မှန်း · နောက်ဆုံး slot · client token · Turnstile + rate limit · ပိတ်ရက် staff ✖ · approve / cancel / self ✖ · roster ချက်ချင်း · invite ချက်ချင်း | #1–#8, #16–#23 | – |
| D-UX-03 *(v1.3)* | **Admin guideline v1.3** — AD-PERM-06 code map (CRUD + special) · **AD-PERM-07 role matrix = View · Create · Update · Delete + Special actions + Company-admin badge + seed role** · AD-SCH-01 save စာသား = "ချက်ချင်း update" · AD-NAV-02 / AD-WEB-02 code နာမည် · §15 row ပိတ် | #23 · #25 / #26 | – |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.13): **§0.7 — API Part 3 question sheet** (D-PLT-19) · ★ OPEN-30 colour / logo (spec အဆင့်) · ★ go-live data / setting တန်ဖိုး

**(ဋ) v5.2.12 — Save point + workflow rule (Claude chat 01/Oct 15:22)** — row အပြည့် Appendix A (D-PLT-19) · decision sheet = **§0.6**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-PLT-19 *(new 🔒)* | **Workflow (owner 15:22):** Claude က မေးခွန်းတွေကို **sheet တစ်ခုတည်း** အရင် မေး → owner **အကုန် ဖြေပြီးမှ** ဖိုင် ထုတ် (ဖြေခင် မထုတ်ရ — ပြန် confirm ချိန် ဖိုင် ပြန်ထုတ်ရတာ အချိန်ကုန်) → API design + architecture (ADR) + review ကို **တစ်ခါတည်း ပေါင်းထုတ်**; part တစ်ခု ပြီးတိုင်း owner items ကို sheet ထဲ စု | Owner: "ငါ ဖြေရမှာတွေ အရမ်း များနေပြီ … အရင် မေးခွန်းကို အရင် မေးလိုက်၊ ငါက အကုန်လုံး ဖြေပြီးပြီ ဆိုမှ API ရော Architecture ကို တစ်ခါတည်း ပေါင်းထုတ်လိုက်" | 🔒 |
| *(save point)* | ဖိုင် ဘာမှ မပြောင်း — api zip (Part 0 / 1 v1.2 + Part 2 v1.1) · architecture zip v1.0 · db zip v5 · guideline v1.2 ×2 · review v5.2.12 = **bundle zip တစ်ခုတည်း** (`point-barbershop-planning-bundle-01Oct.zip`) | Chat ဖျက်ပြီး နောက် chat မှာ §0.6 ဖြေ | – |

**(ည) v5.2.11 — API Part 2 Catalogue & Scheduling draft (Claude chat 01/Oct 13:00)** — row အပြည့် A.18 (D-API-03) · A.16 (D-DB-06 v1.3 ⚠️) · အသေးစိတ် **§11.6**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-API-03 *(new ⚠️ draft)* | **API Part 2 — Catalogue & Scheduling v1.1** (`docs/api/02-catalogue-scheduling.md` + `openapi/part2-catalogue-scheduling.yaml`): category / service (company master + branch ရောင်း / ကြာချိန် + website field) / option group → value → variant (system ထုတ်) / **ဈေး table တစ်ခုတည်း** (ဆိုင် · အိမ် · branch · barber override · effective date — ရှာပုံ fixed order) + **price quote** (ဈေးတွက်တဲ့ နေရာ တစ်ခုတည်း — booking / checkout ဒါပဲ ခေါ်) / eligibility matrix / weekly pattern → shift (manual-day rule, diff-based nightly generation) / leave (PENDING ကတည်းက block, approve permission, self-approval ✖) / **availability function တစ်ခုတည်း** (shift − booking block − leave − walk-in − ပိတ်ရက် − အတိတ်; slot grid; staff ပါ 14 ရက်) — endpoint ၅၀ · permission code ၇ · realtime ၇ · OpenAPI validate ✅ | Owner "API part 2 ဆက်ပါ" · DB Part 2 + D-SVC / D-SCH / D-LV / D-BKG-04..08 / 23 · AD-SVC / AD-CMP-13 / AD-SCH / AD-LV / FE-BK-05..08 · independent review ၁၈ + ၅ ပြင်ပြီး (Part 2 §17) | ⬜ ⚠️ owner lock (§16 ၁၀ ချက် — OPEN-39) |
| D-DB-06 *(⚠️ v1.3 — owner confirm)* | **DB Part 2 v1.2 → v1.3:** `employee_service_eligibilities.archived_at` + `schedule_patterns.archived_at` (nullable) + `eligibility_one_open` partial unique မှာ `archived_at IS NULL` — **တစ်နေ့တည်း** eligibility ပြန်ဖြုတ် / pattern segment ဖျက်တာကို `effective_to = effective_from − 1` နဲ့ ပိတ်လို့ မရ (date CHECK — PostgreSQL မှာ စမ်းပြီး), hard delete မလုပ် (D-DAT-05) → archive · column ၂ ခုပဲ, table / FK / test မပြောင်း · PostgreSQL 16 load ၉၁ + Part 3 / 5 / 8 regression PASS · `db/` zip v5 | Part 2 API independent review #2 (verification) | ⬜ ⚠️ owner "OK" → 🔒 D-DB-06 v1.3 |
| API ပိုင်း *(owner မေးခွန်း)* | **API = Part 0 (convention + module map) + Part 1–8 = ဖိုင် ၉** — DB part ၈ ခုနဲ့ တူ: 1 Foundation & Access ✅ · 2 Catalogue & Scheduling ✅ · 3 Customers & Booking (+ public) · 4 Visits, Sales & Payments · 5 Commission, Payroll & Attendance · 6 Inventory · 7 Finance & Closing · 8 Platform (notification, attachment, audit, import / export, backup, website, report ၁၀, dashboard) — Part တိုင်း = Markdown + OpenAPI; §11.1 | Owner: "API က ဘယ်နှပိုင်း ရှိမှာလဲ" | – |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.11): **OPEN-39 — Part 2 §16 ၁၀ ချက်** (buffer ပေါင်းပုံ · ပိတ်ရက် staff booking · approved ခွင့် cancel · self-approval ✖ · option group ≤ 2 · walk-in visit ပိတ်ချိန် · go-live data ★ · နောက်ဆုံး slot buffer · AD-SCH-01 copy · **DB v1.3**) + v5.2.10 ကျန် (ADR ၈ · Part 0 / 1 ၁၀ ချက်)

**(ဈ) v5.2.10 — Owner API အဖြေ ၃ ချက် + system design review + ADR (Claude chat 01/Oct 11:54)** — row အပြည့် Appendix A (D-ROLE-02 note · D-BKG-06 · A.18 · A.19) · အသေးစိတ် **§11.5, §12**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-BKG-06 *(update 🔒)* | **Advance window (default 14 ရက်၊ setting `booking.advance_window_days`) = public booking ရော staff booking ရော ကန့်သတ်** — နှစ်ဖက်လုံး 422 `outside_window`; admin က setting ပြောင်းရင် နှစ်ဖက်လုံး လိုက် | Owner: "staff booking ပါ ကန့်သတ်ထားတယ်" · admin guideline §15 API question ပိတ် (🔒 ဖိုင် မထိ — register note ပဲ) | Part 0 §12 #2 ✅ |
| D-ROLE-02 *(note — ADR-010 Accepted)* | **Permission code = action တစ်ခုချင်း (granular); Manager role ထဲ ဘာပါမလဲ = admin က role matrix မှာ compose** — code ထဲ "manager က ဒါ လုပ်ရ / မရ" fixed rule ✖; code ထဲ ပြောင်းမရတာ ၂ ချက်ပဲ: ကိုယ်မရှိတဲ့ permission / scope မပေးရ (no escalation) · နောက်ဆုံး admin မဖြုတ်ရ (no lockout; company admin = `role.manage` + `role.assign` company scope — P1-RULE-12) → Part 1 `employee.manage` → code ၇ ခု ခွဲ (Part 1 code ၁၃) · PATCH = field group အလိုက် 403 + `errors[]` (P1-RULE-11) | Owner: "Manager ရဲ့ လုပ်ပိုင်ခွင့်ကို Admin က permission မှာ လိုအပ်သလို adjust လုပ်လို့ရတယ်" · D-ROLE-01 / 02 / 05 / 08 နဲ့ ကိုက် | Part 0 §12 #7 ✅ · Part 1 §13 #1 ✅ · ADR-010 |
| D-API-01 / 02 *(⚠️ draft → v1.2)* | Part 0 + Part 1 **v1.2** — *v1.1:* API-PERM-06 granular · API-SHAPE-01 origin တစ်ခုတည်း `/api` path (ADR-009 ⚠️) · API-IDEM-02 mismatch = identifying field နှိုင်း · API-IDEM-03 = ADR-004 (A အကြံပြု) · P1-RULE-11 · *v1.2 (independent review):* Google login hand-off — verifier / challenge + poll (P1.AUTH.03/04/06 — Android / iPhone app ထဲ WebView မှာ Google က login ခွင့်မပြုလို့) · cookie host-only + `Max-Age` 400 ရက် · P1-RULE-12 company admin / last-admin · `GET /v1/system/jobs` (P1.SYS.05) · Socket.IO path `/rt` · edge routing rule · OpenAPI `1.2.0-draft` validate ✅ (operation ၅၂) | Owner အဖြေ + system design review + independent review ကနေ | ⬜ ⚠️ owner lock (§11.3 ကျန် ၁၀ ချက်) |
| ADR-001..010 *(new — A.19 D-ARC-01)* | **System design review v1.0** + **ADR ၁၀ ခု** — Accepted: 001 (modular monolith — D-PLT-01 / 02) · 010 (granular permission — owner) · 005 session part (D-AUTH-06); **Proposed ⚠️ (owner lock):** 002 pg-boss · 003 Capacitor · 004 booking idempotency = client token · 005 CSRF header + Origin · 006 website SSR + revalidate · 007 uptime / error tracking + email provider · 008 Socket.IO instance တစ်ခု · 009 single origin `/api` | Owner: "coding ဘက် စရောက်ပြီ — သေချာ စစ်" → `engineering:system-design` + `engineering:architecture` framework | 🟡 OPEN-38 · REC-31 / 32 / 35 / 38 → ADR |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.10): **ADR ၈ ခု** (OPEN-38 — "OK" တစ်လုံးစီ) · **API Part 0 §12** #1 (idempotency A — "OK") · #3 rate limit တန်ဖိုး · #4 domain · #5 captcha (Turnstile) · #6 number code · #8 single origin · **Part 1 §13** #2 invite email · #3 client-readable setting · #4 branch code rule · #5 picker (Part 2) — "OK" ဆို lock → Part 2 · ⚠️ RPO < 24 နာရီ လို / မလို (WAL archiving)

**(ဇ) v5.2.9 — Guideline 🔒 + API design စ (Claude chat 01/Oct 11:09)** — row အပြည့် Appendix A (A.17, A.18) · အသေးစိတ် **§11**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-UX-03 *(🔒)* | **Admin panel / staff app UI/UX guideline v1.2 = approved** — `docs/ux/admin-panel.md`; ⚠️ rule ~270 အကုန် binding; ★ (colour, logo, MM label) = တန်ဖိုး ကျန်ရုံ; ပြောင်းရင် version အသစ် + register note | Owner: "ဒါကိုပဲ lock လုပ်လိုက်တော့မယ်" (01/Oct 11:09) | REC-40 ✅ |
| D-UX-04 *(🔒)* | **Frontend website UI/UX guideline v1.2 = approved** — `docs/ux/frontend-website.md`; booking modal, barber card (rating), motion, TikTok, formats အကုန် binding | Owner (01/Oct 11:09) | REC-39 ✅ |
| D-API-01 *(new ⚠️ draft)* | **API design Part 0 — convention + module map** (`docs/api/00-conventions.md` v1.0): surface ၃ မျိုး (staff `/v1` cookie + permission + branch scope · public `/v1/public` captcha + rate limit + public DTO · internal) · session cookie + CSRF header · `@Can(code, branch)` guard · RFC 9457 error + `code` = language key · cursor pagination · money integer / `+06:30` / number code / `*_mm` `*_en` · `Idempotency-Key` = `client_request_id` (D-VIS-10) · booking idempotency = client manage token (⚠️) · audit interceptor + DB trigger · Socket.IO event catalogue · revalidate hook · rate limit · module map (resource ~၇၀, part ၈ ခု) | D-PLT-18 #2 · review §5.5 / §5.8 · owner lock ရန် (§11 #1) | ⬜ ⚠️ |
| D-API-02 *(new ⚠️ draft)* | **API design Part 1 — Foundation & Access** (`docs/api/01-foundation.md` + `openapi/part1-foundation.yaml` v1.0): auth (OTP / Google / logout) · `/me` bootstrap (grants + scope + effective earnings flag + today branch + settings) · company · branches · employees (create = user + invite, status, branch / role assignments, rating, invite, sessions) · roles + permission catalogue · settings (effective / set / reset / history) · system (health, status, maintenance, search) — **endpoint ၅၀**, permission code အသစ် ၈, realtime event ၃ · OpenAPI 3.1 validate ✅ | DB Part 1 v3.4 + 1b + Part 8 settings · D-AUTH / D-EMP / D-ROLE / D-PLT-16 · owner lock ရန် (§11 #2) | ⬜ ⚠️ |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.9): **API Part 0 §12 (၇ ချက်)** — booking idempotency နည်းလမ်း (client manage token vs `bookings.client_request_id`) · 14 ရက် window staff ကိုပါလား · public rate limit တန်ဖိုး · domain · captcha provider (Turnstile default) · status code = number · permission code အသစ် — **API Part 1 §13 (၅ ချက်)** — manager ရဲ့ staff edit အတိုင်းအတာ · invite email ချက်ချင်း · `client_readable` setting list · branch code rule · picker eligibility (Part 2) — "OK" ဆို lock

**(ဆ) v5.2.8 — Owner ဒုတိယအကြိမ် အဖြေ ၆ ချက် (Claude chat 01/Oct 10:47)** — row အပြည့် Appendix A · အသေးစိတ် **§10.10** · guideline v1.2 ၂ ဖိုင် · DB Part 1 v3.4

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-RPT-01 *(update — OPEN-34 ✅)* | **Report ၁၀ ခု နာမည် 🔒:** ① Sales summary ② Barber performance ③ Payments & KBZPay ④ Discounts & refunds ⑤ Daily closing & cash ⑥ Expenses & P&L ⑦ Commission & payroll ⑧ Attendance & leave ⑨ Bookings & customers ⑩ Stock — တစ်ခုချင်း ဘာဖြေလဲ / ဘယ် decision ကလာလဲ = admin AD-RPT-04 | Owner "OPEN-34: OK" (အဆိုပြု စာရင်းအတိုင်း) | OPEN-34 ✅ |
| D-UX-05 *(update — OPEN-37 ✅)* + D-DB-02 *(v3.4)* | Website barber card **rating = လောလောဆယ် admin / manager ပေးတဲ့ rating** → `employees.public_rating numeric(2,1) NULL` (1.0–5.0, 0.5 ခြား CHECK; NULL = မပြ); website မှာ ★ + ဂဏန်း + **"Point rating" caption** (customer review လို့ မထင်အောင် — honesty rule); edit = admin + manager (ကိုယ့် branch barber) — permission code = API design; **V2 = customer rating** (decision + table အသစ်၊ card source ပြောင်း) | Owner 01/Oct 10:47 ("ADMIN, Manager ကပေးတဲ့ rating ပဲ · V2 မှာ customer rating") · guideline က star မသင့်လို့ အကြံပေးခဲ့ပေမဲ့ owner ဆုံးဖြတ် — caption နဲ့ ရိုးသားအောင် ထား | OPEN-37 ✅ |
| D-DSH-03 *(update)* + D-COM-04 *(confirm ✅)* + D-DB-02 *(v3.4)* | Barber ကိုယ့် sale / commission ပြတာ = **"အကုန်လုံး" ရော "တစ်ယောက်ချင်း" ရော ရ** → ၂ ဆင့်: company setting `dashboard.show_own_earnings_all` (settings.json, default OFF) + per-barber override `employees.show_own_earnings` (**NULL = setting လိုက်** / true / false — v3.4 nullable); effective = COALESCE(override, setting) · **checkout commission estimate line ကိုလည်း effective flag အတိုင်း ပြ** (D-COM-04 တွက်တာ မပြောင်း — owner confirm ✅) | Owner: "ဒါက အကုန်လုံးလဲ ပြလို့ရတယ်၊ တစ်ယောက်ချင်းလဲ ပြရလို့ရတယ် မဟုတ်လား" → နှစ်မျိုးလုံး ရအောင် design | OPEN-10 ✅ · ⚠️ confirm ပြေ |
| D-PLT-04 *(confirm ✅ — lock မပြောင်း)* | **Admin app ငွေ = `Ks` / `ကျပ်` အတိုင်း ဆက်ထား (မပြောင်း)**; website မှာပဲ `Ks` ဘာသာ ၂ မျိုးလုံး (D-UX-05) — formatter profile `app` / `site` | Owner: "Admin က မပြောင်းဘူး၊ Website မှာပဲ ပြောင်းမှာ" | ⚠️ confirm ပြေ |
| D-BKG-23 *(new)* | **Online booking minimum lead time = မရှိ** — customer က 10:00 မှာ နောက် slot boundary (default interval 15 → 10:15; interval 5 → 10:05) အားရင် တန်း booking လုပ်လို့ရ; booked barber ဆီ realtime (AD-TODAY-04); no-show timer = booking အချိန်ကနေ (D-BKG-17) | Owner: "10:00 ဖြစ်ရင် 10:05 ကို booking လုပ်လို့ရမလား → တင်လို့ရပါတယ်" (frontend §14 API question — "50" ဆိုတာ ဒီ row) | API question #7 ✅ |
| OPEN-30 *(timing)* | Colour palette + website design reference = **develop လုပ်ဖို့ spec ထုတ်တဲ့အဆင့် (API design / OpenSpec — D-PLT-18 #2) ရောက်မှ owner ပေးမယ်; Claude Code က အဲ့အချိန် တောင်း** — guideline approve ဖို့ blocker မဟုတ်; အဲ့အထိ shadcn `neutral` scaffolding | Owner: "spec ထုတ်တဲ့အခါကြရင် ပေးမယ်၊ အဲ့အခါ တောင်းခိုင်းလိုက်" | ★ OPEN-30 (timing ✅) |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.8): guideline အတွက် **မရှိတော့** — ★ OPEN-30 (spec အဆင့်မှ) · logo ဖိုင် · ★ customer cutoff တန်ဖိုး / no-show စာသား (setting / language file) · NEXT = owner ဖတ် → approve (REC-39 / 40) → API design

**(စ) v5.2.7 — Owner က guideline မေးခွန်းတွေ ဖြေ (Claude chat 01/Oct မနက်)** — row အပြည့် Appendix A · အသေးစိတ် **§10.9** · guideline v1.1 ၂ ဖိုင် · DB Part 1 v3.3

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-UX-02 *(update — ★ OPEN-31 ✅)* | **Font:** မြန်မာ = **Pyidaungsu** (admin + website) · admin English = **Manrope** (UI) / **Inter** (ဂဏန်း tabular + fallback) · website English = **Archivo Black** (display / heading) + **Roboto** (text) · website က `(site)` ထဲ font token ကိုယ်ပိုင် override · self-host WOFF2 | Owner 01/Oct · "Manrope / Inter" ကို Manrope အရင်၊ Inter = ဂဏန်း / fallback လို့ ဖတ် (admin AD-VIS-05 — ပြောင်းချင်ရင် stack ၂ ခု လဲရုံ) | OPEN-31 ✅ · ★ OPEN-30 colour ကျန် |
| D-PLT-05 *(update — OPEN-32 ✅)* + D-PAY-06 *(update)* | **မြန်မာ UI ပြပုံ:** ဂဏန်း **0–9**၊ လနာမည် **English** (`01/Oct/2026`)၊ **AM / PM** — ဘာသာ ၂ မျိုးလုံး · **Receipt = English အမြဲ** (label = `en` language file၊ item = `*_en` fallback `*_mm`) → reprint = ပုံတူ (API question #8 ပိတ်) | Owner 01/Oct · receipt `B3-2026-OCT-…` / KBZPay ref / ဖုန်း နဲ့ ကိုက် · go-live data: service / option / product တိုင်း EN နာမည် ဖြည့် | OPEN-32 ✅ |
| D-PLT-04 *(note — ⚠️ confirm)* | **Website မှာ ငွေ = `7,000 Ks` ပဲ** (ဘာသာ ၂ မျိုးလုံး) — owner · D-PLT-04 🔒 (MM = `ကျပ်`) က **admin app** အတွက် ဆက်ရှိ; formatter profile `site` / `app` | ⚠️ Owner confirm: admin app MM UI ကိုပါ `Ks` ပြောင်းမလား၊ `ကျပ်` ထားမလား (§0.3) | OPEN-32 (website) ✅ |
| D-PLT-03 *(update — OPEN-33 ✅)* + D-DB-02 *(v3.3)* | **ဘာသာ ရွေးချယ်မှု = user account** → `users.ui_language smallint NULL` (1 MY · 2 EN · NULL = system default) + CHECK · session payload နဲ့ ပြန်ပေး · notification / OTP email ကိုလည်း ဒီဘာသာ · cookie = ပထမ paint အတွက် mirror ပဲ | Owner 01/Oct ("user account base") · Part 1 **v3.2 → v3.3** (column ပဲ၊ table / FK မပြောင်း) | OPEN-33 ✅ |
| D-DSH-03 *(update — OPEN-10 ✅)* + D-DB-02 *(v3.3)* | **Barber ကိုယ့် sale / commission = default OFF အကုန်**၊ admin က ပြစေချင်တဲ့ barber ကို **တစ်ယောက်ချင်း ဖွင့်** → `employees.show_own_earnings boolean NOT NULL DEFAULT false` (Pay tab switch, audit) · ဖွင့်ထားမှ dashboard widget + checkout estimate line + "My earnings" | Owner 01/Oct · DB မှာ user-level setting နေရာ မရှိ (settings = company / branch scope — D-PLT-16) → employees column (role / permission လမ်း = position-based ဖြစ်လို့ မသင့်) | OPEN-10 ✅ · ⚠️ D-COM-04 ချိတ် (§0.3) |
| D-COM-04 *(⚠️ confirm — lock မပြောင်း)* | Checkout commission **estimate** ကို **flag ON barber ကိုပဲ ပြ** (တွက်တာ = အရင်အတိုင်း၊ final = လကုန်) — guideline ရဲ့ ဖတ်ပုံ (AD-POS-07) | Flag OFF barber ကို checkout မှာ commission ပြရင် owner ရဲ့ "default OFF" ဆိုလိုရင်း ပျက် · ⚠️ owner confirm — "performer အကုန် ပြ" ဆိုရင် gating ဖြုတ် | OPEN-10 ↔ D-COM-04 |
| D-PAY-04 *(update — OPEN-36 ✅)* | **Discount ကို service line + product line နှစ်မျိုးလုံး** ဈေးအချိုးနဲ့ ခွဲ (ကားခ ✖ — မပြောင်း) · commission base = net **service** line ပဲ (D-COM-02 — မပြောင်း) · ဥပမာ ညှပ်ခ 10,000 + ဆေး 5,000၊ 10% → 9,000 / 4,500 | Owner 01/Oct ("service line တွေရော product line တွေပါ") · DB `line_discount_amount` ရှိပြီး — app logic ပဲ | OPEN-36 ✅ |
| D-PAY-07 *(note — OPEN-20 ✅)* | **iPhone အရေအတွက် မမေးတော့** — device ဘယ်လောက်ဖြစ်ဖြစ် အလုပ်ဖြစ်ရ: receipt **PDF / Share = device တိုင်း** (success screen ပထမ ခလုတ်)၊ **Print = Android** (capability flag) | Owner 01/Oct ("လူအရေအတွက် မေးတာထက် လုပ်လို့ရအောင်") · D-PAY-07 မပြောင်း | OPEN-20 ✅ |
| D-WEB-01 *(update — OPEN-21 toggle ✅)* | Website toggle တွေ (`site.show_prices`, `site.show_barbers`, `employees.public_profile`) = **default OFF** — owner က admin panel ကနေ ဖွင့်မှ website မှာ ပေါ် · domain = ACT-05 ကျန် | Owner 01/Oct ("owner က Admin panel ကနေ ထည့်လိုက်မှ ပြပေးမှာ") | OPEN-21 ◐ → toggle ✅ |
| D-UX-05 *(new)* | **Website brand / motion / booking UI (owner 01/Oct):** (1) **booking = modal / pop-up box**, သီးခြား `/book` page မရှိ — `/book?branch=…` link / QR တွေက page ပေါ် modal ဖွင့်ပေး (D-BKG-01 link အမြဲ အလုပ်ဖြစ်), confirm ပြီး `/booking/[token]?new=1` page (link မပျောက်အောင်) (2) Home **Our barbers** card = ပုံ + နာမည် + **လက်ရှိ branch** (ဒီနေ့ shift) + description (`public_specialty`) + **Book with <name>** direct booking (3) theme = **minimalist and clean**; colour palette + design reference = owner ပေးမယ် (4) animation = **Motion + GSAP**, **3D object ✖** (5) SEO / social မှာ **TikTok** ပါ (6) website toggle = info page ပဲ၊ **booking modal မှာ ဈေး + barber နာမည် အမြဲ** (OPEN-35 = Option A), closure = ပိတ်ရက်ပဲ ရွေးမရ | Owner 01/Oct · frontend v1.1 FE-BK-00, FE-HOME-05, FE-VIS-01/02/07, FE-SEO-02, FE-BK-01/02/05/07 | OPEN-35 ✅ · 🟡 OPEN-37 (rating — DB / scope မရှိ) |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.7): ★ OPEN-30 colour palette + design reference ပုံ (owner ပေးမယ်) · 🟡 **OPEN-34 report ၁၀ ခု** (admin AD-RPT-04 မှာ ရှင်းပြချက် + အဆိုပြု စာရင်း — confirm / ပြင်ရုံ) · 🟡 **OPEN-37 barber card "rating"** (Appendix B #37) · ⚠️ confirm ၂ ချက် — D-COM-04 estimate line gating · website `Ks` ↔ app `ကျပ်` · ❓ owner note "50 — တင်လို့ရပါတယ်" (§0.3) → *v5.2.8: အကုန် ✅ (ဆ)*

**(င) v5.2.6 — UI/UX guideline (Claude chat 30/Sep ည → 01/Oct)** — row အပြည့် Appendix A (A.1, A.17) · အသေးစိတ် **§10**

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-UX-01 *(new)* | **UI/UX guideline = ဖိုင် ၂ ခု ခွဲ** — (1) `docs/ux/frontend-website.md` = public website + `/book` + manage link page (rule ID `FE-…`) (2) `docs/ux/admin-panel.md` = login ဝင်ပြီး screen အားလုံး — admin / manager / barber ဖုန်း / login / receipt / QR (rule ID `AD-…`); UX principle reference = **Laws of UX (lawsofux.com — law ၃၀ လုံး)**; admin panel ကို **Fresha research repo** ကိုပါ reference (adopt / improve / avoid); precedence = Appendix A 🔒 > `db/` > guideline > Fresha; guideline ≠ 🔒 decision ကို ကျော်လို့မရ — ဆန့်ကျင်ရင် STOP (D-PLT-13); OpenSpec spec source ထဲ ထည့် (D-PLT-17) | Owner: "Claude Code က UX principle ကို မသိမှာ စိုးလို့" — screen တိုင်း တသမတ်တည်း ဖြစ်အောင် rule ID နဲ့ ကိုးကားစေ | owner 30/Sep ည |
| D-UX-02 *(new)* | **Colour code နဲ့ font family = team (owner) ကိုယ်တိုင် သတ်မှတ်** — guideline ထဲမှာ token နာမည် + လိုက်နာရမယ့် requirement (contrast AA, Myanmar Unicode font, weight ၂ မျိုး၊ tabular ဂဏန်း၊ self-host) ပဲ ရေး၊ တန်ဖိုး = `{{…}}` placeholder; **Claude Code က colour / font / logo မတီထွင်ရ** — မသတ်မှတ်ခင် shadcn/ui default `neutral` scaffolding ပဲ | Brand ကို team ကိုယ်တိုင် ဆုံးဖြတ်ချင် (owner) | ★ OPEN-30, OPEN-31 |
| D-PLT-18 *(new)* | **Development အစဉ် = (1) UI/UX guideline review / ပြင် → (2) API design → (3) Code development** — API design = module အလိုက် REST + OpenAPI (§5.5), source = Appendix A + `db/` + `docs/ux/` flow; Code = OpenSpec change (D-PLT-17) + Claude Code; dev plan (D-PLT-14) ကို ဒီအစဉ်နဲ့ ဆွဲ | Owner: "လိုတာပြင်ပြီးတော့မှ API → Code Development" | owner 30/Sep ည |
| REC-39 / REC-40 *(new ⚠️)* | Guideline **content** (Frontend v1.0 / Admin v1.0 draft) — owner ဖတ် / ပြင် / approve → 🔒 **D-UX-04** (Frontend) / **D-UX-03** (Admin); approve မတိုင်ခင် ⚠️ rule တွေက "draft အတိုင်း ဆောက်၊ ပြဿနာရှိရင် report" | D-PLT-11 — review ရဲ့ အကြံ ≠ requirement | §3.0.5 |

🟡 ဆုံးဖြတ်ရန် ကျန် (v5.2.6): ★ OPEN-30 colour · ★ OPEN-31 font · OPEN-32 မြန်မာ UI ဂဏန်း / လနာမည် / AM-PM / receipt ဘာသာ · OPEN-33 user ဘာသာ သိမ်းပုံ (**DB gap**) · OPEN-34 report ၁၀ ခု နာမည် · OPEN-35 website toggle / closure က `/book` ကိုပါ သက်ရောက်လား · OPEN-36 discount ကို product line ပါ ခွဲမလား — Appendix B #30–#36 → *v5.2.7: OPEN-31, 32, 33, 35, 36 ✅ · OPEN-30 ★ owner ပေးမယ် · OPEN-34 ရှင်းပြပြီး (စ)*

**(ဃ) v5.1 — OPEN-27, OPEN-14, OPEN-23, OPEN-29, OPEN-28, OPEN-01, OPEN-16, REC-12, REC-11, REC-25, OPEN-15, OPEN-24, OPEN-09, OPEN-03 A, OPEN-06 A, OPEN-19, OPEN-26, REC-14, OPEN-05 A, OPEN-25, REC-33, D-PLT-17 (Claude chat 30/Sep မနက်)** — row အပြည့် Appendix A · အသေးစိတ် §6.4b

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-BKG-20 *(update)* | Waitlist = **⏭ V1 မပါ**။ နောက်မှ ထည့်ရလွယ်အောင် V1 မှာ ပြင်ဆင်ချက် ၅ ချက် (Part 3 DB မှာ ကြိုမထည့် — နောက်မှ table အသစ်ပဲ၊ `bookings` မပြင်; availability တွက်တာ တစ်နေရာတည်း; နေရာလွတ်စေတဲ့ booking action တွေ code လမ်းကြောင်း တစ်ခုတည်း; number code append-only; permission / noti / language key နောက်မှ) + ပုံကြမ်း | Online booking 0% → go-live မှာ သုံးမယ့်သူ မရှိသလောက်; system က customer ကို အကြောင်းမကြားနိုင် (D-CUS-05) → staff ဖုန်းဆက်ရတာပဲ; **အချိန်ကြောင့် ဖြုတ်တာ မဟုတ်** (D-PLT-14) | OPEN-27 |
| D-BKG-09 *(update)* | Active booking (BOOKED / STARTED) ၁ ခု rule = **website ကနေ customer ကိုယ်တိုင် booking မှာပဲ** — customer မှာ active booking တစ်ခုခု (website / staff ဘယ်ကလာလာ) ရှိရင် website က ပိတ်; **staff ထည့်ရင် ကန့်သတ်ချက် မရှိ** (မိသားစု၊ နောက်အပတ်အတွက် ကြိုချိန်း); DB index မသုံး — app က customer row lock ပြီး စစ် · booking မှာ ဘယ်လမ်းကလာလဲ (website / staff) + ထည့်သူ မှတ် (F-BK-11 ✅) | Rule ရည်ရွယ်ချက် = public link spam ကာ; staff = login + audit ရှိ; Point booking အများစု staff ကပဲ ထည့်မယ် | OPEN-14 |
| D-BKG-12 *(update)* | Reschedule ဈေး: **ရက် / အချိန်ပဲ ပြောင်းရင် မူလဈေး** ဆက်ထား; service / option ပြောင်းရင် အဲ့ item ပဲ ဈေးအသစ်; barber / ဆိုင် ↔ အိမ် ပြောင်းရင် item အကုန် ဈေးအသစ်; ကြာချိန်လည်း rule တူ; ဈေးပြောင်းရင် confirm မတိုင်ခင် ပြ | "အချိန်ရွှေ့တာ အခမဲ့၊ ပြောင်းဝယ်မှ ဈေးပြောင်း" — ဆိုင်ဘက်က ရွှေ့ခိုင်းရင်လည်း ဈေးမတက်; snapshot rule (D-SVC-04) နဲ့ ကိုက် | OPEN-23 |
| D-SVC-05 *(update)* | Option service booking: customer / staff က **option ကိုယ်တိုင်ရွေး** → ဈေး + ကြာချိန် အတိအကျ; မရောင်းတဲ့ကွက် မပြ; ဆိုင်ရောက်မှ barber အတည်ပြု (checkout မှာ ပြောင်းရ) | ဇယား ရှိပြီးသား; "X ကစ" ဆို customer မကျေနပ် + ၁၈၀ မိနစ် အလကားပိတ်; DB = ရိုးရိုး service နဲ့ ပုံစံတူ | OPEN-29 |

**(ဂ) v5 — DB design + ⏩ OPEN / REC (Claude chat 29/Sep ည → 30/Sep)** — row အပြည့် Appendix A

| ID | ဆုံးဖြတ်ချက် (အတို) | ဘာကြောင့် / မှတ်ချက် | Register |
| --- | --- | --- | --- |
| D-ORG-03 | V1 = company ၁ ခု (Point)။ နောက်မှ multi-company မြန်မြန်ဖွင့်လို့ရအောင် master table တွေမှာ `company_id` + unique ကို company အလိုက် + "current company" code တစ်နေရာ | အခု multi-company ဆောက်ရင် dev ~၁ ပတ် ထပ်ကုန်; ပြင်ဆင်ထားရင် နောက်မှ ~၃–၄ ရက် | OPEN-22 |
| D-ROLE-06 *(update)* | Role assignment တစ်ခု ဖြုတ် / ပြောင်း = အဲ့ assignment ပဲ | Ko Aung ရဲ့ Manager (B) ဖြုတ် → Barber (A + B) ကျန် | REC-13 |
| D-SCH-02 | Schedule အချိန်ထပ် ✖ (DB); branch ပြောင်းရင် ခရီးချိန် ခြား — setting default ၆၀ မိနစ်; branch တူ = ခြားစရာမလို | "မနက် A / ညနေ B" = schedule, F-P1-04 နဲ့ မဆိုင် | owner |
| D-DB-03 | Status / type = **number code** (smallint + CHECK)၊ code ထဲ constant နာမည်၊ label = language file၊ number မပြောင်း / ပြန်မသုံး၊ ACTIVE = 1 / ပိတ် = 0 | စာလုံးပေါင်းမှား ကာ; admin setting မှာ မထား (logic ချိတ်) | F-P1-05/06 |
| D-DB-04 | ၂ ဘာသာ data: customer မြင်စာ + admin setting နာမည်အကုန် = MM + EN (EN optional → MM ပြ); လက်ရိုက် မှတ်ချက် = ၁ ခု; customer နာမည် = ၁ ခု | multi-language အခြေခံ | F-P1-07 |
| D-ROLE-08 | `permissions.json` → DB auto sync (ဖြုတ် = archive; key rename ✖; server ပေါ် လက်နဲ့ မပြင်) | DB ထဲ ဝင်ပြင်စရာ မလို; typo = build error | F-P1-10 |
| D-DB-02 | **Part 1 🔒 = DBML v3** (users column ၇ ခု ထပ်ဖြည့် = v3.1 · website column ၅ ခု = v3.2 — Part 8) | F-P1-01..10 approve (F-P1-11 = OPEN-21) | – |
| D-AUTH-03..06, 08 *(update / new)* | Login: server session (HttpOnly cookie — REC-05); login တိုင်း noti; invite = users column (cancel = DISABLED); OTP **၈ လုံး**၊ hash၊ ဆက်တိုက် ၅ ကြိမ်မှား → ၂၀ မိနစ်၊ resend ၆၀ စက္ကန့်; Google ID မှတ် | iPhone login မပြုတ်၊ revoke ချက်ချင်း | F-P1-08 |
| D-DB-05 | **Part 1b Login 🔒 = v1** (`login_otps`, `user_sessions`) | – | – |
| D-SVC-05 *(update)* | ဆိုးဆေး / perm = **option ဈေးဇယား** (ကွက်တိုင်း ဈေး + ကြာချိန်)၊ branch အလိုက်၊ ကွက်လပ် = မရောင်း၊ barber override နောက်မှ (DB အသင့်) | ၁ လက်မ နဲ့ ၁၂ လက်မ ဆိုးတာ မတူ — Fresha ထက် သာ | OPEN-04 |
| D-LV-04 | Pending leave ကလည်း booking ပိတ် | "တင်ကတည်းက မလာချင်လို့" | OPEN-13 |
| D-SVC-06, D-BKG-22, D-SCH-03 | Home service: **အိမ်ဈေး** (ပုံမှန် ဆိုင်ဈေးထက်ပို — system က မစစ်) + **ကားခ** (ဆိုင်ဝင်ငွေ၊ commission ✖) + barber တကယ်ကုန်တဲ့ ကားခ = Cash Out; website ကနေ "ဆိုင် / အိမ်" booking ရ (လိပ်စာ မဖြစ်မနေ); သွားချိန် setting default ၃၀ မိနစ် | ကားခ = barber ရဲ့ လမ်းစရိတ် → commission မတွက် (D-COM-02 ကနေ ချန်) | OPEN-17, REC-26 |
| D-BKG-07 *(update)* | Booking အချိန် interval = setting, default ၁၅ မိနစ် | Fresha live အတိုင်း | REC-22 |
| D-SVC-07 | ရှင်းလင်းချိန် (buffer) service တစ်ခုချင်း, default ၀ | – | REC-23 |
| D-LV-01 *(update)* | Leave type = Fresha ၁၀ မျိုးနဲ့ စ၊ admin လိုတိုးပိုလျှော့ | "Late to work" မထည့် (attendance) | REC-27 |
| D-PLT-15 | လုပ်ငန်းနေ့ = **MMT** ရက် (ည ၁၂ မကျော်); screen / report / DB timezone = MMT | – | REC-34 |
| D-LV-05 | နေ့တစ်ဝက် ခွင့် — နေ့ခွဲချိန် setting default **13:00** | – | D-LV-03 |
| D-SVC-08 | **ဈေးကို ကြိုသတ်မှတ်လို့ရ** (effective date); ဈေးဟောင်း မဖျက် = history; ဈေးရှာ = ဝန်ဆောင်မှုရက် | အရှုံးအမြတ်ကြည့်ပြီး ဘယ်ရက်ကစ ပြောင်းမလဲ ရွေး | owner |
| D-VIS-06 / D-VIS-12 *(update)* | **Conflict ဖြေရှင်း:** A ဖုန်းမပါ case မှာ B က B ဖုန်းကနေ payment ပါ လုပ်ရ — B ကိုယ်တိုင် "A ဖုန်းမပါ" မှတ်ပေးထားတဲ့ visit မှာပဲ; commission = A; `collected_by` = B; reason auto; admin report | Manager ဆိုင်မှာ အမြဲမရှိ — (ခ) ဆို customer စောင့် + တန်းစီ ရပ်; တာဝန်ခံမှု (P269 ရည်ရွယ်ချက်) = `collected_by` + audit နဲ့ ဆက်ရှိ | OPEN-28 |
| D-VIS-13 *(update)* | Late entry = barber ကိုယ်တိုင် (outage + မေ့သွား); reason မဖြစ်မနေ; branch-day စာရင်း မပိတ်ခင်အထိ; report flag + လစဉ် အရေအတွက်; permission နဲ့ တစ်ယောက်ချင်း ပိတ်ရ | Manager အမြဲမရှိ; "မေ့သွား" ပိတ်ရင် ငွေ စာရင်းမဝင်; flag + count က RISK-01 (နောက်မှရိုက်တဲ့ အကျင့်) ပြန်ဖြစ်တာ ပြ | OPEN-01, REC-02 |
| D-VIS-02 *(update)* | Walk-in ဖုန်း = optional ဆက်ထား; FINISH မှာ field ကြိုဖွင့်၊ ရှိပြီးသား customer auto; barber အလိုက် ဖုန်းရယူနှုန်း % report | မဖြစ်မနေ ဆို နံပါတ်အတု → data ပိုဆိုး + checkout နှေး (RISK-01); % နဲ့ တိုက်တွန်း | OPEN-16, REC-01 |
| D-VIS-02 *(update)* | START = barber + branch ပဲ; service = COMPLETE မှာ မဖြစ်မနေ (ပထမ ရွေးတာ reason မလို); booking visit ကနေ ပြောင်းရင် reason (D-VIS-05) | START tap တစ်ချက် (RISK-01); ညှပ်ရင်း ပြောင်းတာ အဖြစ်များ — reason spam မဖြစ် | REC-12, C-5 |
| D-PAY-02 *(update)* | KBZPay payment တစ်ခုချင်း verify ✔ — စာရင်းပိတ်မှာ app history နဲ့ တိုက်; ✔ မရတာ ကျန်ရင် reason; FINISH နဲ့ မဆိုင် | Screenshot အတု ဖမ်းမိ + ဘယ် payment / ဘယ်သူ (`collected_by`) တန်းသိ; KBZPay နည်းလို့ အလုပ်မများ | REC-11, C-1 |
| D-PAY-06 *(update)* | Receipt နံပါတ် `B3-2026-OCT-00125` / refund `B3-RF-2026-OCT-00003` — branch + လ အလိုက် gapless၊ FINISH မှာ ပေး | Point စာရင်းတွေ လစဉ် (commission / လစာ / P&L) — လအလိုက် တိုက်ရလွယ်; format = owner အကြံ (D-PLT-05 MMM နဲ့ ကိုက်) | REC-25 |
| D-PAY-08, D-PAY-02 *(update)* | Tax / service charge နဲ့ KBZPay reference ပုံစံ = **Admin ရဲ့ Additional Settings** (D-PLT-07) — tax / service charge ဖွင့် / ပိတ် + rate (default OFF); reference ဂဏန်းအရေအတွက် / ပုံစံ စစ်တာ setting | ပိုင်ရှင်အဖြေ မစောင့်ဘဲ ဆက်; ဆိုင်က နောက်မှ ပြင်ရ | OPEN-15, OPEN-24 |
| D-PAY-04 *(update)* | Discount code ပုံစံ: admin code (% / ကျပ်၊ သက်တမ်း၊ branch၊ သုံးခွင့် အကြိမ်၊ customer ၁ ကြိမ်၊ **public / internal**) + ထူးခြား case = **app ထဲ တောင်း / ✔ (ဖုန်း ✖)** — `discount.approve` permission; sale တစ်ခုလုံး၊ code ၁ ခု၊ ကားခ မလျှော့၊ line ခွဲ | Manual discount ၃၀/လ (RISK-06) ကို code + approval လမ်းထဲ ဆွဲသွင်း; admin ဖုန်းကိုင်နေစရာ မလို; social media promo = public code | OPEN-09, REC-09 |
| D-DB-12 | **Part 8 🔒 = v1 (နောက်ဆုံး)** — settings (+ history trigger), audit_events (append-only + ငွေ table ၁၈ trigger), notification_types / notifications, attachments, import (jobs / rows / source_refs), backup_runs, branch_opening_hours / closures + Part 1 v3.2 / Part 2 v1.2 website column; F-P8-01..09 approve · **DB design ပြီး — table ၉၁** | PostgreSQL test ၄၅/၄၅ · Part 3–8 ၂၉၆ PASS | – |
| D-PLT-17 *(new)* | **Coding = Spec-Driven Development (SDD), tool = OpenSpec** — DB design ပြီး coding စရင် change / spec / task ကို OpenSpec ပုံစံ (`openspec/` folder) နဲ့ ရေးပြီးမှ Claude Code ကို ခိုင်း; decision register (Appendix A) = spec ရဲ့ source | Owner: "ပိုမြန်မြန် ပြီးလောက်မယ်"; §5.1 #3 spec-driven ⚠️ → 🔒; ကျန်ခဲ့မှာ စိုးလို့ မှတ် | §5.1 #3, §5.6 |
| D-PLT-16 *(new)* | **Settings store** = `settings` key-value (scope company / branch, value jsonb) + `settings_history`; key list / type / default / validation = code ထဲ `settings.json` (D-ROLE-08 ပုံစံ — typo = build error); admin UI = JSON type အတိုင်း form; setting အသစ် = JSON key ထည့်ရုံ (migration ✖) | Setting ~၃၀ (Part 2–7 list) · payroll / closing snapshot (jsonb) နဲ့ ပုံစံတူ · history = ဘယ်သူ ဘယ်တော့ ပြောင်းလဲ | REC-33 |
| D-DB-11 | **Part 7 🔒 = v1** — expense / income categories, expenses ledger (source ၆ — MUST_RETURN_AUTO + / CASH_RETURN_REVERSAL −), manual_incomes (approval), cash_out_reasons (accounting type), cash_outs (type snapshot), cash_returns, daily_closings (REC-17 CHECK + snapshot + generated difference); F-P7-01..07 approve; future FK ပြေ (Part 5 receivables, Part 6 purchases → v1.1) | PostgreSQL test ၄၆/၄၆ · P&L = view | – |
| D-FIN-06 *(update)* | Daily closing design: opening float = branch setting (default ၀) + မနေ့ကျန်နဲ့ တိုက်; ပိတ်သူ = permission `closing.close`; လက်ခံနိုင်တဲ့ ကွာချက် = setting (default ၀) ကျော် ⇒ admin noti; ခံသူ = မှတ်ရုံ | ပိုင်ရှင်အဖြေ = setting တန်ဖိုး; RISK-10 (နေ့တိုင်း ကွာချက်) ကို opening float နဲ့ ကာ | OPEN-05 (A), REC-17 |
| D-FIN-09 *(update)* | Cash Return = ပြန်ထည့်တဲ့လ P&L မှာ မူလ category အနုတ် line (revenue ✖); row ၂ ကြောင်း ခွဲ + မူလ ရက် / ပမာဏ label + P&L ထိပ် note | Revenue / KPI / commission မရှုပ်; category တစ်ခုတည်း နှစ်လ ပေါင်း 0; label + note က "ဘာလို့ အနုတ်လဲ" ဖြေ | OPEN-25 |
| D-DB-10 | **Part 6 🔒 = v1** — product master (category / product / supplier), branch_stock_levels (cache), stock_movements (append-only ledger — trigger), adjustment reasons, purchases (+ items, branch အလိုက်), transfers ၂ ဆင့် (+ items), stock counts (+ items); sale_items.product_id FK; F-P6-01..09 approve | PostgreSQL test ၄၄/၄၄ · expense FK = Part 7 | – |
| D-STK-03 *(update)* | Transfer ၂ ဆင့် — DRAFT → SENT (source −, in transit) → RECEIVED (destination +, actual + reason); approve / ထွက် ခလုတ် မခွဲ | Branch ၃ ခု၊ ဝန်ထမ်း ကိုယ်တိုင် သယ်; D-STK-03 (မထွက်ခင် ပြင် / cancel, receive actual + reason) နဲ့ ကိုက် | REC-14, C-9 |
| D-DB-09 | **Part 5 🔒 = v1** — commission plans / tiers / assignments / results (+ EARN / REVERSAL lines), salaries, payroll categories / runs / entries / lines / attendance items / branch allocations, receivables (+ repayments), QR tokens, attendance records, **attendance_exceptions** (owner မေးခွန်းကြောင့် ထပ်ထည့်); F-P5-01..12 approve | PostgreSQL test ၇၀/၇၀ · cash_out FK = Part 7 | – |
| D-COM-01 *(update)* | Commission engine: plan (tier list) admin ဖန်တီး; employee ၁ ယောက် plan ၁ ခု + effective date (မရှိ = basic ပဲ); qualify = admin assign; threshold = branch ပေါင်း default၊ branch scope optional (C-2 ✅) | ၃ မျိုးလုံး (basic / basic + % / % ပဲ) data နဲ့ ဖြေရ — ပိုင်ရှင်အဖြေ = data; owner INFERRED: ၃ ယောက် = qualify ပြီးသူ | OPEN-03 (A), C-2 |
| D-PAYR-05, D-PAYR-08 *(update)* | Late / absent / unpaid leave deduction rule = **Additional Settings** (default ၀ / OFF): rule အမျိုးအစား ၄ ခု code ထဲ၊ တန်ဖိုး admin; payroll run auto line + override; finalize = rule snapshot; multi-branch allocation = setting (attendance နာရီ default — REC-19 ✅) + snapshot | ပိုင်ရှင်အဖြေ = setting တန်ဖိုးပဲ၊ DB မထိ; Fresha "Late to work" blocked time = ဆိုင်က နောက်ကျတာ မှတ်နေတယ် | OPEN-06 (A), REC-19 |
| D-ATT-01 *(update)* | QR + GPS design အတိုင်း ဆက် — record မှာ method / GPS / device; QR = branch token (ပြန်ထုတ်ရ); GPS / QR ကို setting နဲ့ ပိတ်ရ | ပိုင်ရှင် မကြိုက်ရင် setting နဲ့ ဖြုတ်ရလွယ် (DB မထိ); Fresha clock-in 0 = ဝန်ထမ်းအတွက် အလုပ်အသစ် → ★ အတည်ပြု | OPEN-19 |
| D-COM-04 *(update)* | Finalize ပြီးမှ refund = refund လ payroll မှာ "commission ပြန်နုတ်" line — မူလ run မှာ တွက်ခဲ့တဲ့ % အတိအကျ; လက်ရှိလ tier မထိ; မူလ payroll မပြောင်း | Finalize lock (D-PAYR-06) + အတိအကျ ပြန်ယူ နှစ်ခုလုံး ရ; payslip မှာ ရှင်း | OPEN-26, REC-18 |
| D-DB-08 | **Part 4 🔒 = v1** — visits (START / COMPLETE / INCOMPLETE, proxy, late entry), sales (OPEN → FINISHED immutable, receipt gapless, discount code XOR request, tax / SC snapshot), sale_items (service / product / ကားခ, list vs ယူဈေး override, line discount), payment_methods, payments (collected_by, KBZPay ref unique + verify), receipt_counters, discount_codes (+ branches / customer_uses), discount_requests, refunds (+ items, RF series), sale_adjustments (ledger); F-P4-01..13 approve | PostgreSQL test ၅၇/၅၇ · products FK = Part 6 | – |
| D-DB-07 | **Part 3 🔒 = v3** — customers, cancel reason list, bookings (barber ပိတ်ချိန် block + EXCLUDE — buffer / အိမ်သွားချိန် ပါ), booking_items (option ကွက် + ဈေး / ကြာချိန် / buffer snapshot); F-BK-01..21 approve | PostgreSQL test ၃၀/၃၀ | – |
| D-DB-06 | **Part 2 🔒 = v1** — schedule ပုံစံ + နေ့စဉ် shift ကြိုထုတ်; ဇယား option group ၂ ခုအထိ (UI); အိမ်မှာ လုပ်ခွင့် barber + service တစ်ခုချင်း; leave status 0/1/2/3 | – | – |

🟡 ဆုံးဖြတ်ရန် ကျန် (v4–v5.1): **DB design — မရှိ** · dev plan (D-PLT-14 — ၂ ယောက် ခွဲဝေ / schedule / REC-31, 32, 38 architecture) · ★ ပိုင်ရှင် setting: OPEN-05 B · ★ ပိုင်ရှင် data / setting / အတည်ပြု: OPEN-03 B, OPEN-06 B, OPEN-19 · *(OPEN-28 conflict ✅; Part 3 F-BK-16..21 ✅ — D-DB-07)*

**(က) v4 — Risk walkthrough (P368–P397 + Claude chat 29/Sep ည)** — အသေးစိတ် §3.12

| ID | ဆုံးဖြတ်ချက် (အတို) | Risk | Source |
| --- | --- | --- | --- |
| D-VIS-11 *(new)* | Barber ကိုယ်တိုင် ကိုယ့်ဖုန်းကနေ customer တစ်ယောက်ချင်း real-time: Complete → Payment → FINISH | RISK-01 | P370, P371 |
| D-AUTH-07 *(new)* | ကိုယ်ပိုင်ဖုန်း + ကိုယ်ပိုင် account; မှတ်တမ်းတင်ဖို့ shared counter device မသုံး (REC-04 PIN switch ✖) | RISK-02 | P372, R373 (P374 လက်ခံ) · Claude 29/Sep |
| D-VIS-12 *(new)* | ဖုန်းမပါ/ပျက် → တခြား barber က **ကိုယ့်ဖုန်းကနေ** START / COMPLETE မှတ်ပေး (Actual = A၊ Recorded by = B)။ ဆိုင်ဖုန်း login / shared account ✖ · payment အဆင့် — OPEN-28 ✅ v5.1 (B လုပ်ရ) | RISK-02 | Claude 29/Sep (P373 ကို ပြင်) |
| D-ATT-06 *(new)* | ဖုန်းမပါ → B က A အတွက် clock-in ✖; Manager/Admin က manual ထည့် (reason + service သက်သေ + လစဉ်အရေအတွက်) | RISK-02 | Claude 29/Sep |
| D-VIS-06 *(update)* | `performed_by` ≠ `collected_by`; default = performer; payment screen မှာ ပြောင်းရွေး; commission = performer (REC-07 🔒) | RISK-03 | P375 |
| D-VIS-13 *(new)* | V1 offline ✖ → စက္ကူ → နောက်မှ သွင်း (လုပ်ချိန် / သွင်းချိန်၊ လုပ်သူ / သွင်းသူ ခွဲမှတ်); V2 = true offline · REC-02 ကျန်အပိုင်း ✅ v5.1 (OPEN-01) | RISK-04 | P376, R376 |
| D-SVC-05 *(new)* | Service pricing options (ဥပမာ Color × Length) — option တစ်ခုချင်း ဒါမှမဟုတ် combination အလိုက် final price; base price ထားနိုင် — direction 🔒၊ detail 🟡 OPEN-04 | RISK-05 | P378, P379, R379 |
| D-PAY-04 *(note)* | Code-only မပြောင်း; discount rule ဆိုင်းထား 🟡 *(→ v5.1 ✅ OPEN-09)*; code ကို ပြင်ရလွယ်အောင် | RISK-06 | P381 |
| D-PLT-14 *(new)* | Dev ၂ ယောက် + Claude Code; V1 scope အကုန် တစ်လအတွင်း; release မခွဲ (REC-10 ✖) · waitlist ⏭ (v5.1 — D-BKG-20) | RISK-07 | P382, R382 |
| D-PLT-13 *(new)* | Requirement conflict တွေ့ရင် Claude Code **STOP** → report → owner ဆုံးဖြတ်မှ ဆက် | RISK-08 | P383–P386 |
| D-PAYR-04, D-FIN-02, D-FIN-04 *(update)* | Salary Advance / Staff Loan = သီးခြား balance (receivable)၊ expense မဟုတ်; Salary expense = **Gross** (REC-15, REC-16 🔒) | RISK-09 | P388–P390 |
| D-FIN-06, D-FIN-07 *(update)*, D-FIN-08, D-FIN-09 *(new)* | Cash Out form + Cash Out Reason Master (must return + expense category) + လကုန် rule (REC-17 🔒) | RISK-10 | P391–P395 |
| D-COM-04 *(new)* | Checkout = commission estimate; period ကုန်မှ final | RISK-11 | P396, P397 |
| D-DAT-03 *(update)* | Daily (၃၀ ရက်) + weekly (၁ နှစ်) + off-site + လစဉ် restore test (REC-20 🔒) | RISK-12 | Claude 29/Sep |
| D-AUD-02 *(new)* | Audit append-only — app မှာ ကြည့်ရုံ; DB က insert/read ပဲ; ငွေ table တွေကို DB က အလိုလိုမှတ် (REC-21 🔒) | RISK-15 | Claude 29/Sep |
| D-BKG-21 *(new)* | Public booking — captcha + ချောင်တဲ့ rate limit (REC-28 🔒); D-BKG-10 မပြောင်း | RISK-16 | Claude 29/Sep |
| D-PAY-07 *(update)* | Receipt ကို ပုံအဖြစ် print (REC-29 🔒); V1 = Android ဖုန်း → Bluetooth printer; counter print device ⏭ နောက်မှ | RISK-17 | Claude 29/Sep |
| D-PLT-03 *(update)*, D-UI-01 *(new)* | System + website MM/EN — စာသားအကုန် language file ထဲ; Form rule (required \* အနီ၊ error = အနီ outline + message) | Owner မှတ်ချက် | Claude 29/Sep |

✋ ACT-01 ✅ (repo private ဖြစ်ပုံရ)၊ ACT-02 ✅ (remote debugging ပိတ်ပြီး)။

**(ခ) P360–P367**

| ID | ဆုံးဖြတ်ချက် | Source |
| --- | --- | --- |
| D-PLT-12 | DB design ကို domain part ၈ ခု ခွဲ၊ dbdiagram.io (DBML) နဲ့ပြ၊ part တစ်ခုကို review + lock လုပ်ပြီးမှ နောက် part ဆက် | P360, R360 |
| D-DB-01 | DB naming convention (§6.1) — `users` ≠ `employees`၊ `payments` + `payment_methods`၊ `external_reference`၊ `barber` / vendor နာမည် မသုံး၊ UUIDv7၊ `*_at` / `*_date` / `*_amount`၊ status enum (*v5: → number code — D-DB-03*)၊ `archived_at` | P361, R361, R363, P364 |
| D-EMP-02 *(update)* | `users` ↔ `employees` = **1 : 1**၊ `employees.user_id` **NOT NULL** UNIQUE။ အလုပ်ထွက်ရင် status နဲ့ပဲ ထိန်း၊ record မဖျက် | P366, R366, P367 |
| D-PLT-11 | Review ထဲက concern တွေက requirement **မဟုတ်**။ 🔴 Risk / 🟡 Open / 🔒 Resolved / ⚠️ Recommendation ခွဲပြီး 🔒 ဖြစ်မှ build | P366, R366, P367 |

### 0.3 ဒီ update မှာ တွေ့တာ

**v5.2.15 (02/Oct — API Part 4–8 ရေးရင်း + independent review)** — အသေးစိတ် §11.9, §12.10, part ဖိုင်တိုင်းရဲ့ "Independent review" section

- **🔒 ဆန့်ကျင်ချက် အသစ် ၁ မျိုး (OPEN-40 — §0.9)** — 🔒 D-DAT-05 ("transaction hard delete မရ") နဲ့ (a) payroll reopen မှာ လစာ expense row ဖယ်တာ (🔒 F-P5-09 "results ဖျက် ပြန်တွက်" + Part 7 FK) (b) မှားထည့်မိတဲ့ salary / plan assignment row ဖြုတ်တာ (`archived_at` မရှိ) (c) draft purchase / transfer line ဖြုတ်တာ။ API ပုံစံ မပြောင်း — DB ထဲ သိမ်းပုံပဲ ကွာ → **ကိုယ်တိုင် မရွေးဘဲ owner ကို တစ်ချက်တည်း မေး (D-PLT-13)**; အဖြေ မရမချင်း အဲ့ ၃ နေရာ မဆောက်။
- **Part အချင်းချင်း ချိတ်တဲ့နေရာ = အမှား အများဆုံး** (reviewer ၃ ယောက်, ၈၇ ချက်, HIGH ၁၀) — (1) reopen လုပ်ထားတဲ့နေ့ထဲ late entry သွင်းရင် finalize ပြီး payroll မှာ commission ပျောက် → **finalize ပြီး period ထဲ late entry / service sale FINISH = 423** (manual payroll line — B9) (2) စာရင်းပိတ်တဲ့ transaction က snapshot ကို lock မရခင် ယူမိ → **close = exclusive day lock အရင်, READ COMMITTED**; lock အစဉ် တစ်ခုတည်း (day → payroll → sale → visit → booking → … → stock) (3) go-live ဖွင့်စာရင်း count က level row ရှိတဲ့ product ပဲ ရေ → **branch လုံး = active product အကုန်** (4) commission reversal carry formula က manual line ကို ရောတွက် (5) net 0 line ကြောင့် payroll calculate တစ်ခုလုံး ပျက် (6) public မဟုတ်တဲ့ branch ရဲ့ booking link 404 (DB comment / guideline နဲ့ ဆန့်ကျင်) (7) `request_id` UUID မဟုတ်ရင် audit trigger ပျက် (8) ဖွင့်ချိန် ပြင်တာက အတိတ်ရက်ရဲ့ "ပိတ်ရမယ့်နေ့" ကို ပြောင်းမိ (9) ကွာငွေ sale ဖွင့်ထားရင် စာရင်းပိတ် မရ → **customer ပေးချိန်မှ ဖန်တီး** (10) `receivable.issue` branch level ဖြစ်နေ (C1 ချိုး) → private။ အကုန် ပြင်ပြီး။
- **ADR-008 (realtime = id ပဲ, ငွေ ✖) ကို Part 4 / 5 / 6 payload ၅ ခုက ချိုး** — amount ဖြုတ် (client က ခွင့်ရှိမှ refetch)။ **ADR-006 (~10 စက္ကန့်) ↔ public API `max-age=60`** → 10။
- **C1 ↔ D-FIN-06** — ဗီရိုက advance (Cash Out) ကို Manager က စာရင်းပိတ်မှာ မြင်ရမယ် (ငွေရေဖို့) ဒါပေမဲ့ advance = Admin ပဲ မြင် → **ပမာဏ + "Staff advance" ပြ, ယူသူနာမည် ဖျောက်** (payroll ခွင့်ရှိသူ + ကိုယ်တိုင်ပဲ မြင်)။ ဆန့်ကျင်ချက် မဟုတ် — နှစ်ခုလုံး ပြေ။
- **Part writer တွေရဲ့ research item (E1–E12) က one-sheet ရဲ့ E1–E8 နဲ့ label တူနေ** → "owner E…" လို့ မှားကိုးကားတာ ၂၀ ကျော် → "Part N research E…" ပြောင်း (owner အဖြေ မဟုတ်တာကို owner အဖြေလို့ မထင်အောင်)။
- **`leave.cancelled` notification** — lock ပြီးသား Part 2 မှာ ပါပြီး Part 8 catalogue မှာ ကျန်ခဲ့ → ပြန်ထည့် (type ၄၁)။ Lock ပြီးသားကို အသစ်ရေးတဲ့ဘက်က မဖျက်ရ။
- **Owner မဖြေထားတဲ့နေရာ — ယူထားတဲ့ default (ပြောင်းချင်ရင် တစ်ကြောင်းပြော; §11.9 table):** discount ၁၀၀ ပြည့် = အနီးဆုံး (975 → 1,000 · 945 → 900) · attendance ဖြတ်ငွေ > gross ဆို ပိုတာ နောက်လ မသယ် (advance / commission ပြန်နုတ် ကတော့ သယ်) · ဗီရိုက "expense" cash out = approval မလို (🔒 F-P7-04 — ငွေထွက်ပြီးသား; closing + report ⑤ မှာ စစ်) · လရဲ့ နောက်ဆုံးနေ့ ည barber ကိုင်ထားတဲ့ငွေ = အဲ့လ expense → နောက်နေ့ reversal (D-FIN-09 စာသားအတိုင်း) · ထွက်သွားသူ ကျန်ငွေ write-off = ⏭ V1 မပါ · ကိုယ့် line ကိုယ် price override = code + reason ရှိရင် ရ · staff document = ဝန်ထမ်းကိုယ်တိုင်လည်း မမြင်။
- **DB G test** — FINISH guard trigger ကြောင့် Part 5 test seed တစ်ခု (FINISHED sale ထဲ line ထည့်) ပျက် → seed ကို တကယ့်အစဉ် (open → line → finish) ပြန်ရေး (trigger မလျှော့)။ App rule: FINISH transaction က line / total / payment အရင် ပြင်ပြီးမှ status ပြောင်း။


**v5.2.11 (01/Oct 13:00 — API Part 2 ရေးရင်း)** — အသေးစိတ် §11.6, `docs/api/02-catalogue-scheduling.md` §17

- **ဈေးရှာပုံ ကို rule တစ်ခုတည်း ချ (P2-RULE-03)** — ရက် (booking = ချိန်းရက်၊ walk-in = ဒီနေ့) မှာ သက်ရောက်တဲ့ row → barber override → branch ဈေး; အိမ် = HOME row မရှိရင် **branch-level** BRANCH row (barber override က အိမ်ကို မသက်ရောက်); row မရှိ = မရောင်း။ Booking (Part 3) ရော checkout (Part 4) ရော **quote function တစ်ခုတည်း** ခေါ် (D-SVC-04 — ဘယ်သူမှ ဈေး မရိုက်)။
- **Effective-dated write algorithm (P2-RULE-04)** — reviewer က "ဒီနေ့ row ကို effective_from − 1 နဲ့ ပိတ်" ဆိုတဲ့ ပထမ ရေးချက်က DB date CHECK / EXCLUDE ကို ချိုးတာ (တစ်နေ့တည်း ပြန်ရေး၊ scheduled grid ပြင်၊ scheduled ၂ ခု ကြား ရေး၊ withdraw) တွေ့ → key တစ်ခုချင်း ၅ ဆင့် algorithm (same date = update in place; ကြား row ချိတ်; withdraw re-link; close-as-of-today)။ **တစ်နေ့တည်း eligibility ပြန်ဖြုတ် / pattern segment ဖျက်** ကို ပိတ်လို့လည်း မရ၊ hard delete လည်း ✖ (D-DAT-05) → **DB Part 2 v1.3 ⚠️** `archived_at` ၂ column (PostgreSQL မှာ CHECK ပျက်တာ + archive လမ်း အလုပ်ဖြစ်တာ စမ်းပြီး)။
- **Manual-day rule + diff-based generation (P2-RULE-07)** — reviewer: manual shift ထည့်ထားတဲ့ နေ့မှာ pattern ပြောင်းရင် pattern shift အဟောင်း ကျန်နေ; ညတိုင်း archive + re-insert လုပ်ရင် shift id ပြောင်းလို့ Part 5 attendance (`schedule_shift_id`) ပျက် → "manual day" = `source = 2` row (active / archived) ရှိတဲ့ နေ့; generation က manual day မထိ; nightly = diff (မပြောင်းရင် row တူ); attendance ချိတ်ထားတဲ့ shift ကို ဘယ်တော့မှ archive ✖; `POST /schedule/days/reset` နဲ့ pattern ပြန်သုံး။
- **Availability function (P2-RULE-10) ကို အဆင့် ၀–၆ အတိအကျ ချ** — candidate (ACTIVE + assigned + eligible အကုန်) · block = travel + Σ duration + Σ buffer + travel (⚠️ buffer ပေါင်း — owner) · free = ဒီ branch shift − booking block (branch မတူလည်း) − leave (half-day cutoff) − walk-in visit (booking_items snapshot / quote) − now နောက် slot boundary (D-BKG-23) · dates = today … +14 (15 chips, staff ပါ) · closure = closed (⚠️ staff ပါ — owner) · any barber = union + free employee list (customer ရွေး — D-BKG-05)။
- **Scope — code မရှိတဲ့ barber** (P2-RULE-11): Part 1 P1-RULE-05 အရ scope = grant ကပဲ → permission code မရှိတဲ့ barber က service / ဈေး / roster ဖတ်လို့ မရဖြစ်မယ် → **read scope = assignment ∪ grant** (Part 0 / 1 lock ချိန် amend)။
- **Part 0 / 1 lock ချိန် amend ရန် စာရင်း** (Part 2 §13 note): event ၄ ခု + `leave.*` Part 5 → 2 · module map Part 2 row code · API-RT-01 room = read scope · P1.EMP.09 `service_id` repeatable။
- **Independent reviewer (subagent) ၁၈ + verification ၅** — HIGH ၂ (write algorithm, stale pattern shifts), MEDIUM ၁၀ (visit column မရှိ, HOME fallback, SIMPLE → OPTIONS, home_allowed reset, created_by column မရှိ, catalogue.changed room, pickable param, status filter, read scope, pattern scope / past regenerate) — အကုန် ပြင်ပြီး; 🔒 ချိုးတာ မတွေ့။

**v5.2.10 (01/Oct 11:54 — owner API အဖြေ + system design / architecture review)** — အသေးစိတ် §11.5, §12, `docs/architecture/system-design.md`, `docs/adr/`

- **Owner မေးခွန်း "server မှာ သိမ်းတာနဲ့ DB မှာ သိမ်းတာ ဘယ်ဟာ ပိုကောင်းလဲ" (booking idempotency)** — ၂ နည်းလုံး server က စစ်ပြီး DB ထဲ သိမ်းတာ အတူတူ; ကွာတာက **token ကို ဘယ်သူ ထုတ်လဲ / column အသစ် လိုလား**။ **A (client က manage token ထုတ်၊ server က hash ပဲ သိမ်း — DB မပြင်) ကို အကြံပြု** — reply ပျောက်ပြီး retry ရင် B (`bookings.client_request_id` + server token) က customer ရဲ့ တစ်ခါပဲ ပြနိုင်တဲ့ manage link (D-BKG-11) ကို ပြန်ပေးလို့ မရ (server မှာ hash ပဲ ရှိ) — idempotency လိုတဲ့ case အတိအကျမှာ ပျက်; A က token client လက်ထဲ ရှိလို့ booking ရော link ရော ပြန်ရ။ → ADR-004 (Proposed — owner "OK" ဆို 🔒)။
- **"Manager ရဲ့ လုပ်ပိုင်ခွင့် = admin က permission မှာ adjust"** → Part 1 v1.0 ရဲ့ `employee.manage` (coarse) + "manager က ဘာပြင်ရ" မေးခွန်း ပျက်ပြယ် — code ထဲ manager rule မထား; action တစ်ခုချင်း code (Part 1 = ၁၃ ခု: `employee.create / profile_manage / rating_manage / earnings_manage / status_manage / access_manage / branch_assign` …); guard rail ၂ ချက်ပဲ fixed (no escalation — company admin ကလွဲ · no last-admin lockout) → ADR-010 Accepted · D-ROLE-02 note။
- **14 ရက် window = staff ပါ** → 🔒 D-BKG-06 update (setting တစ်ခုတည်း၊ 422 `outside_window` နှစ်ဖက်)။ Admin guideline v1.2 §15 မှာ ဒီ API question ကျန်နေသေး — guideline ဖိုင် 🔒 ဖြစ်လို့ **မထိ**၊ register note နဲ့ ပိတ် (ပြင်ချင်ရင် v1.3 — owner ပြောမှ)။
- **System design review (framework ၅ ဆင့်) ကောက်ချက်** — load (ဆိုင်ခွဲ ၃၊ service ~၉၀ / နေ့၊ peak < 5 rps) က design driver မဟုတ်; **ငွေ မှန်ကန်မှု၊ 4G / မီး ပြတ်ချိန် resilience၊ backup၊ security၊ handover** က driver → modular monolith + VPS တစ်လုံး မှန် (ADR-001)။ တွေ့တာ: (1) API ကို `api.` subdomain မဟုတ်ဘဲ **origin တစ်ခုတည်း `/api` path** — CORS ✖၊ cookie host-only၊ 4G မှာ preflight ✖ (ADR-009 ⚠️ — Part 0 API-SHAPE-01 v1.1 ပြင်ပြီး) (2) **failure mode ၈ ခု** (branch net ပြတ် · VPS down · DB corruption · email provider down · captcha down · job stuck · printer · money POST reply ပျောက်) တစ်ခုချင်း mitigation ရှိ — ⚠️ RPO < 24 နာရီ လိုရင် WAL archiving (owner ဆုံးဖြတ်ရန်) (3) **job စာရင်း** (ADR-002 canonical — ၁၃ ခု) + outbox မရှိတဲ့ trade-off (in-process event ပျောက်နိုင်၊ data မပျောက် — consumer က recompute; job ကတော့ transaction ထဲ enqueue လို့ မပျောက်) (4) cache = presentational data ပဲ; availability **ဘယ်တော့မှ cache ✖** (5) polymorphic ref ၃ ခု (`attachments`, `audit_events`, `notifications`) FK မရှိ → weekly integrity job (runbook ⚠️) (6) revisit trigger ၇ ခု (instance ၂ · RPO · company ၂ · offline V2 · rating V2 · partition · Web Push)။
- **ADR ၁၀ ခု** (`docs/adr/`, template = `engineering:architecture` — Status / Context / Decision / Options table (Complexity · Cost · Scalability · Team familiarity) / Trade-off / Consequences / Action items; ထိပ်မှာ မြန်မာ အတိုချုပ်) — Accepted ၂ (001, 010) + 005 session part; Proposed ၈ → owner "OK" တစ်လုံးစီ (OPEN-38)။ REC-31 / 32 / 35 / 38 ရဲ့ ADR = 002 / 003 / 006 / 007 (§3.0.5 note ပြည့်)။
- **Capacitor ရွေးရတဲ့ အကြောင်းရင်း အတိအကျ** — 58 mm thermal printer အများစု = Bluetooth **Classic** (SPP); browser ရဲ့ Web Bluetooth = BLE ပဲ → TWA / PWA က print မရ (D-PAY-07) → native plugin ပါတဲ့ Capacitor (ADR-003); plugin ကို ဆိုင်ရဲ့ printer အစစ်နဲ့ Part 4 မဆောက်ခင် စမ်းရမယ် (action item)။
- **Provider နာမည် မသတ်မှတ်** (email / uptime / error tracking — ADR-007) — selection criteria ပဲ ပေး; account = ★ owner ပိုင် (developer ပိုင် ✖); domain (ACT-05) ရမှ SPF / DKIM။
- **Independent reviewer (subagent — မရေးခင် မမြင်ဖူး) ၂၄ ချက် တွေ့ — HIGH ၄:** (1) Next.js route group ၂ ခုနဲ့ host ၂ ခု (website / staff app) ကို မခွဲနိုင် (URL တူ → build error) → `middleware.ts` host rewrite + `site/` / `staff/` tree (ADR-001) (2) **Android app / iPhone PWA ထဲက Google login** — Google က app ထဲ WebView ကနေ login ကို ပိတ်ထား; browser မှာ login ပြီးရင် cookie က browser ထဲ ကျန် → **hand-off** flow — app က verifier ကိုင်၊ server ကို poll (ADR-005, P1.AUTH.03/04/06) (3) cookie `Domain=` (Part 0 v1.1) က staff cookie ကို website ဆီပါ ပို့မိ → host-only (4) "ကိုယ်မရှိတဲ့ permission မပေးရ" rule က part အသစ် deploy ပြီး code အသစ်ကို ဘယ်သူမှ ပေးလို့ မရတော့ (deadlock) → company admin ကလွဲ (P1-RULE-12) + sync မှာ admin role ကို auto-grant · MEDIUM: idempotency mismatch 409 ↔ 422 · health endpoint ၃ မျိုး → `/health` liveness + `/system/jobs` · job နာမည် (`site.content_changed` event → `site.revalidate` job) + job ၅ ခု ကျန် · `settings.manage` branch scope · code ၁၄ → **၁၃** · OpenAPI `servers` subdomain ကျန် · Socket.IO namespace ↔ path · `/api` edge rule (public host မှာ staff login မဖြစ်ရ) · cookie `Max-Age` မပါ (stay signed in ပျက်) · payslip / digest email = 🔒 D-NTF-01 ကျော် → ဖြုတ် · Next.js major pin · no-show job reschedule ပြီး မှားဖျက် (D-BKG-17) → `starts_at` စစ် · LOW ၈ (Capacitor version, Web Bluetooth စာသား, SSE, backup sidecar, placeholder …) — **အကုန် ပြင်ပြီး** (ADR + system design + API Part 0 / 1 **v1.2**; 🔒 decision ချိုးတာ မတွေ့)။ အသေးစိတ် §12.6။

**v5.2.9 (01/Oct 11:09 — API design Part 0 / 1 ရေးရင်း)** — အသေးစိတ် §11

- **Booking create idempotency** (§10.6 #14 ကတည်းက) — DB မပြင်ဘဲ ဖြေတဲ့နည်း = client က manage token ထုတ် → server hash သိမ်း (`manage_token_hash` unique ရှိပြီး) → retry = booking တူ ပြန်ရ (API-IDEM-03)။ Owner lock လိုတယ် (Part 0 §12 #1); မကြိုက်ရင် `bookings.client_request_id` column (Part 3 v3.1)။
- **Cookie auth = CSRF ကာရမယ်** — `X-Requested-With: point-app` header + Origin check (API-AUTH-02) — review §5.5 မှာ မပါခဲ့; public API မှာ cookie မရှိလို့ မလို။
- **Permission code အသစ် ၈ ခု (Part 1)** — `company.manage`, `branch.manage`, `employee.view`, `employee.manage`, `employee.rating_manage`, `role.manage`, `role.assign`, `settings.view` — review ထဲ ~၄၀ ခုမှာ မပါ; `permissions.json` ကို part လိုက် ဖြည့် (D-ROLE-08)။ Privilege escalation ကာ: role assign / permission set မှာ ကိုယ်မရှိတဲ့ code မပေးရ၊ last admin မဖြုတ်ရ (⚠️)။
- **Setting key အသစ် (settings.json)** — `dashboard.show_own_earnings_all` (v5.2.8) အပြင် `booking.customer_change_cutoff_minutes` (★ D-BKG-12 တန်ဖိုး — §10.6 #9), `booking.public_rate_limit_per_hour`, `attendance.default_radius_meters`, `employee.code_format` (D-EMP-03), `system.default_language`, `system.upload_max_mb`, `receipt.auto_print` (REC-37), `receipt.thank_you_text` — Part 1 §8 မှာ စာရင်း; DB migration ✖ (D-PLT-16)။
- **`GET /v1/me` = bootstrap** — permission + branch scope + effective earnings flag + today branch ကို တစ်ခါတည်း ပြန်ပေး → UI `can()` (AD-PERM-03) / AD-NAV-04 / AD-DSH-01 အကုန် ဒီကနေ။ Role ပြောင်းရင် realtime `session.updated` (D-ROLE-06)။
- **Employee status change → future bookings warning** (AD-EMP-03) — API က booking မဖျက် (D-BKG-19)၊ `warnings[]` နဲ့ ပြန်ပေး။
- **Status code = wire မှာ number** (D-DB-03 အတိုင်း) — generated client မှာ `x-enum-varnames` နဲ့ constant name ရ (⚠️ Part 0 §12 #6)။

**v5.2.8 (01/Oct 10:47 — owner ဒုတိယအကြိမ် အဖြေ)** — အသေးစိတ် §10.10

- **Rating — owner က (ခ) admin / manager ★ ကို ရွေး** (guideline က မသင့်လို့ ပြောခဲ့ပေမဲ့ owner ဆုံးဖြတ်ချက် = 🔒)။ Honesty ကို caption နဲ့ ထိန်း — website မှာ "Point rating" (ဆိုင်က သတ်မှတ်ချက်) လို့ ပြ၊ review count / "customers say" မပြ (FE-HOME-05, FE-COPY-03)။ V2 customer rating ရောက်ရင် source ပြောင်း၊ caption ဖြုတ်။ DB = `employees.public_rating` (Part 1 v3.4)။ ဘယ်သူ edit ရ — admin + manager (ကိုယ့် branch barber) → permission code = API design (AD §15)။
- **OPEN-10 "အကုန်လုံး / တစ်ယောက်ချင်း နှစ်မျိုးလုံး"** — v3.3 ရဲ့ `show_own_earnings NOT NULL DEFAULT false` က တစ်ယောက်ချင်းပဲ ရ → v3.4 မှာ **nullable** (NULL = company setting လိုက်) + setting key `dashboard.show_own_earnings_all` (settings.json — D-PLT-16, migration ✖)။ Checkout estimate line gating ကို owner confirm ✅ (D-COM-04 တွက်တာ မပြောင်း)။
- **"50 — တင်လို့ရပါတယ်" = API question "minimum lead time"** (frontend §14) — owner: 10:00 မှာ 10:05 booking လုပ်လို့ရ → 🔒 D-BKG-23 lead time မရှိ (slot boundary အတိုင်း — default 15 မိနစ် ဆို 10:15)။ ❓ ပြေ။
- **D-PLT-04 မပြောင်း** — admin app `ကျပ်` ဆက်ထား၊ website ပဲ `Ks`။ ⚠️ confirm ပြေ။
- **OPEN-30 colour / design ref = spec အဆင့်မှ** — guideline approve ကို မပိတ်ဆို့။ §0.4 / §10.5 ပြင်ပြီး။
- **DB Part 1 v3.4 PostgreSQL 16 test** — table ၉၁ ဆက်တူ · `employees_public_rating_chk` (NULL / 4.5 ✅ · 4.3 / 5.5 / 0.5 ✖) · `show_own_earnings` NULL default ✅ · Part 5 (72/72) + Part 8 (45/45) regression PASS။

**v5.2.7 (01/Oct မနက် — owner အဖြေ သွင်းရင်း)** — အသေးစိတ် §10.9

- **Barber card "Rating" — DB မှာလည်း မရှိ၊ V1 scope မှာလည်း မပါ (🟡 OPEN-37)။** Owner က Our barbers card မှာ current branch + rating + description ပါစေချင်တယ်။ Current branch (`schedule_shifts` ဒီနေ့) နဲ့ description (`employees.public_specialty_mm/_en` — ၂၀၀ လုံး) က ရှိပြီးသား data နဲ့ ရတယ်။ **Rating** ကတော့ review / rating table မရှိ၊ FE-META-05 / §11.3 မှာ "reviews and ratings = V1 မပါ" လို့ ချထား။ ရွေးစရာ — (က) admin က ရိုက်ထည့်တဲ့ **ရိုးသားတဲ့ label** (ဥပမာ "Senior barber · 8 yrs" / level) → Part 1 column ၁ ခု (ခ) admin ရိုက်တဲ့ ★ star (⚠️ guideline က **မသင့်** — customer ဆီက မလာတဲ့ star = review အတု ပုံစံ၊ FE-COPY-03 honesty) (ဂ) customer ဆီက တကယ် rating ယူ = V2 feature (decision + DB အသစ်)။ **Default = rating row မထည့်** (D-PLT-11)။ DB ထဲ မခန့်မှန်း မထည့်။
- **D-PLT-04 (🔒 MM = `ကျပ်`) ↔ owner "7,000 Ks ပဲ" (website).** Owner ရဲ့ အဖြေက frontend OPEN-32 အောက်မှာ ဖြစ်လို့ **website = `Ks` ဘာသာ ၂ မျိုးလုံး** လို့ ယူ; admin app က D-PLT-04 အတိုင်း `Ks` / `ကျပ်` ဆက်ထား (formatter profile `site` / `app`)။ ⚠️ **Owner confirm:** admin app ကိုပါ `Ks` ပြောင်းမလား? (ပြောင်းရင် D-PLT-04 စာသား update + AD-FMT-01)
- **D-COM-04 (🔒 checkout estimate) ↔ OPEN-10 "default OFF, admin က ရွေးတဲ့ barber ပဲ".** §10.6 #5 မှာ ကြိုသတိပေးထားတဲ့ conflict ရောက်လာပြီ — flag OFF barber ကို checkout မှာ estimate ပြနေရင် "OFF" က အဓိပ္ပာယ် မရှိ။ **ယူထားတဲ့ ဖတ်ပုံ (D-PLT-13 အရ ကိုယ်တိုင် မဆုံးဖြတ်ဘဲ ရှင်းပြ):** estimate ကို **တွက်တာ မပြောင်း** (D-COM-04 ရဲ့ အနှစ်သာရ = estimate / final အချိန်)၊ **ပြတာကိုပဲ flag နဲ့ ချိတ်** (AD-POS-07 #5)။ ⚠️ **Owner confirm** — "performer အကုန် estimate မြင်ရ" လို့ လိုချင်ရင် gating ဖြုတ်ရုံ။
- **OPEN-10 flag ကို ဘယ်မှာ သိမ်းမလဲ — DB gap (Part 1 v3.3 နဲ့ ဖြေ).** Settings store = company / branch scope ပဲ (D-PLT-16)၊ `employees` မှာ column မရှိ။ ရွေးစရာ — (က) `employees.show_own_earnings` column (ခ) `permissions.json` ထဲ `earnings.view_own` + role "ကိုယ့်ဝင်ငွေ ကြည့်ခွင့်" ကို barber တစ်ယောက်ချင်း assign (DB မထိ)။ **(က) ရွေး** — admin က Pay tab မှာ switch တစ်ချက်၊ audit ရှင်း; role = position (D-ROLE-01) ဖြစ်လို့ (ခ) က indirect။ OPEN-33 ကြောင့် Part 1 ကို v3.3 bump ရမှာမို့ column ၂ ခု တစ်ခါတည်း (⚠️ owner က v3.3 ကို confirm — D-DB-02)။
- **Booking modal ↔ D-BKG-01 / D-WEB-02 (`/book` link + QR).** Conflict မဟုတ် — URL က ဆက်ရှိ (entry link)၊ UI ကပဲ page → modal။ `/book?branch=B3` ဆို branch page ပေါ် modal ဖွင့်ထားတဲ့ပုံ render။ Confirm ပြီးရင် modal ထဲ မပြဘဲ `/booking/[token]?new=1` page ကို သွား — manage link က customer လက်ထဲ ကျန်တဲ့ တစ်ခုတည်းသော record (D-BKG-11, D-CUS-05) ဖြစ်လို့ modal ပိတ်မိရင် ပျောက်မသွားအောင်။
- **Frontend font ↔ AD-VIS-01 "token file တစ်ခုတည်း".** Website က Archivo Black / Roboto၊ admin က Manrope / Inter — token ဖိုင် တစ်ခုတည်းပဲ၊ `(site)` route group ထဲမှာ font token ကို override (colour token မထိ)။ Myanmar = Pyidaungsu နှစ်ဖက်လုံး။
- **Motion + GSAP ↔ performance budget.** Library ၂ ခု ≈ 50 KB gzip → page interactive ဖြစ်ပြီးမှ dynamic import၊ animate လုပ်တဲ့ page ပဲ (FE-PERF-08)။ **မြန်မာစာကို စာလုံးချင်း split မလုပ်ရ** (GSAP SplitText) — stacking ပျက် (FE-VIS-07)။
- **Owner note "50 — တင်လို့ရပါတယ်" — ဘယ် rule ကို ဆိုလိုမှန်း မသိ** (frontend §14 ထဲ OPEN-21 နောက်မှာ ရေးထား)။ ဖြစ်နိုင်တာ = FE-SEC-03 rate limit "10/hour" ကို **50/hour** လို့ ပြောတာလား? ❓ Owner ကို ပြန်မေး — မသေချာလို့ ဘာမှ မပြောင်းသေး။
- **OPEN-34 ကို owner နားမလည်** → admin AD-RPT-04 မှာ ရိုးရိုး ရှင်းပြချက် (ChatGPT chat ဖျက်လို့ report ၁၀ ခု နာမည် ပျောက်) + 🔒 decision တွေကနေ ဆွဲထုတ်တဲ့ **အဆိုပြု report ၁၀ ခု** စာရင်း ထည့်ပြီး — owner က "OK" / ပြင်ရုံ။
- **DB Part 1 v3.3 ကို PostgreSQL 16 မှာ load + test** — table ၉၁ ဆက်တူ၊ `users_ui_language_chk` (NULL / 1 / 2 ✅, 3 ✖)၊ `show_own_earnings` default false ✅၊ Part 3 (30/30) + Part 8 (45/45) regression PASS။

**v5.2.6 (01/Oct — UI/UX guideline ရေးရင်း)** — အသေးစိတ် §10.6

- **DB gap ၁ ခု (OPEN-33)** — 🔒 D-PLT-03 က "user တစ်ယောက်ချင်း ဘာသာ switch" လို့ ဆိုပေမဲ့ `users` table မှာ ဘာသာ column မရှိ၊ settings store (D-PLT-16) ကလည်း company / branch scope ပဲ။ ဒါကြောင့် user ရွေးထားတဲ့ ဘာသာကို device တစ်ခုချင်း (cookie) ပဲ သိမ်းနိုင်သေး — ဖုန်းပြောင်းရင် / iOS PWA storage ဖျက်ရင် default ပြန်ဖြစ်။ **DB ကို မပြင်ဘဲ (D-PLT-13) မေးထား** — Claude အကြံ = `users.ui_language smallint NULL` (1 MY · 2 EN, NULL = system default) → Part 1 v3.3။
- **D-RPT-01 "Report ၁၀ ခု" ရဲ့ နာမည်စာရင်း register ထဲ မရှိ (OPEN-34)** — source (P130–P145) conversation ဖျက်ပြီးလို့ ပျောက်သွားတယ်။ Guideline က report template + တခြား 🔒 decision တွေ တောင်းတဲ့ report (late entry, proxy payment, ဖုန်းရယူနှုန်း, discount usage, manual attendance, transfer shortfall / in-transit, must-return, P&L) ကိုပဲ ဆောက်ခိုင်းထား။
- **Website toggle vs `/book` မရှင်း (OPEN-35)** — `site.show_prices` OFF ဆို `/book` မှာလည်း ဈေးဖျောက်မလား (🔒 D-SVC-05 က option ရွေးရင် ဈေးအတိအကျ ပြခိုင်း) · `employees.public_profile` / `site.show_barbers` (default OFF) ဆိုရင် `/book` မှာ customer က barber ရွေးရမှာ (🔒 D-BKG-05) — ဘယ်လို ပြမလဲ။ Guideline default = toggle တွေ info page ပဲ သက်ရောက်; `/book` မှာ ဈေး + barber display name အမြဲပြ၊ ပုံ / specialty = public profile ON မှ။
- **မြန်မာ UI ဂဏန်း / လနာမည် / AM-PM / receipt ဘာသာ မဆုံးဖြတ်ရသေး (OPEN-32)** — D-PLT-04/05 က unit / comma / DD/MMM/YYYY / 12-hour ပဲ lock။ Guideline default = data တန်ဖိုး (ငွေ၊ ရက်၊ အချိန်၊ ဖုန်း၊ receipt) ကို ဘာသာ ၂ မျိုးလုံး 0–9 + English MMM + AM/PM (receipt `B3-2026-OCT-…` နဲ့ ကိုက်)၊ စာသား label ပဲ ဘာသာပြန်။
- **ဖြစ်လာနိုင်တဲ့ conflict — D-COM-04 ↔ OPEN-10** — D-COM-04 (🔒) က checkout မှာ commission **estimate** ပြခိုင်းတယ်; OPEN-10 (barber က ကိုယ့် sale / commission မြင်ရမလား) မဖြေရသေး။ Owner က "barber ကို commission မပြ" လို့ ဖြေရင် D-COM-04 နဲ့ ဆန့်ကျင်မယ် → အဲ့ဒီအချိန် STOP (D-PLT-13)။ အခု = checkout estimate ပြ၊ dashboard widget OFF။
- **Discount ခွဲပုံ မရှင်း (OPEN-36)** — 🔒 D-PAY-04 စာသား = "လျှော့ငွေကို **service line** တွေဆီ ဈေးအချိုးနဲ့ ခွဲ"; DB (Part 4) = `line_discount_amount` ကို ကားခ မဟုတ်တဲ့ line အကုန် (product ပါ) ပေါ်မှာ ထားလို့ရ။ Product line ပါ ခွဲမလား — commissionable sales ပြောင်းလို့ owner ဆုံးဖြတ် (D-PLT-13)။
- **Independent review (subagent) ကနေ guideline ပြင်ခဲ့တာ** — proxy reason 2 OTHER က payment မလုပ်ရ (DB `proxy_reason` note)၊ "payment later" ခလုတ် ဖြုတ် (D-VIS-07 / C-1 — pending queue ✖ → performer ရဲ့ unpaid visit ရှိရင် START အသစ် ပိတ်)၊ checkout မှာ option ပြောင်း (D-SVC-05)၊ Home ဈေးကွက်လပ် = ဆိုင်ဈေး (D-SVC-06)၊ QR / GPS setting ပိတ်ပုံ (D-ATT-01)၊ receipt PDF (D-PAY-06)၊ Web Push = lock မဟုတ် (D-NTF-01)၊ `/book` "Closed" = `branch_closures` ပဲ (opening hours = ပြဖို့ပဲ)၊ outbox table မရှိ (D-DB-12)။
- **Booking create က idempotent မဟုတ်** — `bookings` မှာ `client_request_id` မရှိ (D-VIS-10 list ထဲ မပါ); reply ပျောက်ပြီး retry ရင် "slot taken / booking ရှိပြီး" ထွက်ပြီး တစ်ခါပဲ ပြနိုင်တဲ့ manage link ပျောက်နိုင်။ API design မှာ ဖြေ — Claude အကြံ (DB မထိ) = browser က manage token ထုတ်ပို့ → server က hash သိမ်း (`manage_token_hash` unique ရှိပြီး) → retry = booking တူ ပြန်ရ။
- **D-FIN-06 စာသားမှာ expected cash formula ထဲ manual cash income မပါ** — Part 7 DB CHECK (D-DB-11) မှာ ပါပြီး; guideline = DB အတိုင်း။ Register စာသား ညှိရန် (lock ပြောင်းတာ မဟုတ်)။
- **Manage link ကို တစ်ခါပဲ ပြနိုင်** (D-BKG-11 — DB မှာ hash ပဲ) → staff က booking ထည့်ပြီးတာနဲ့ Copy / Share (Viber) ကို ချက်ချင်း ပြရမယ် (AD-BKG-02)။ Conflict မဟုတ် — UI မှာ မဖြစ်မနေ ထည့်ရမယ့်အချက်။
- **API design မှာ ဖြေရမယ့် မေးခွန်း** (decision မဟုတ် — §10.6): 14 ရက် window (D-BKG-06) က staff booking ကိုပါ ကန့်သတ်လား · customer booking lead time (ဥပမာ နောက် ၃၀ မိနစ်အတွင်း မရ) ရှိလား · receipt reprint ကို တခြားဘာသာနဲ့ ထုတ်ရလား · customer cutoff setting key။
- **`fresha-research` repo ကို guideline ရေးဖို့ public ပြန်ဖွင့်ထား** — ACT-01 (private) ပြောင်းပြန်ဖြစ်နေ; owner ကိုယ်ရေး (နာမည်၊ email၊ ဖုန်း၊ ရန်ကုန်လိပ်စာ) + live revenue ပါ → **✋ ACT-07 private ပြန်ပြောင်း** (RISK-13)။
- **Fresha sandbox trial 04/Oct ကုန်မယ် — ၃ ရက်ပဲ ကျန်** (ACT-03)။
- ဖိုင်နာမည် `v5.2.5` နဲ့ header "v5.1" မကိုက် → v5.2.6 မှာ ကိုက်အောင် ပြင်ပြီး။

**v5.1 (30/Sep မနက်)**

- **CHECK constraint NULL ကျော် bug ၅ ခု တွေ့ (Part 7 ဆွဲချိန် audit)** — `(type = 1 AND col BETWEEN 1 AND 100)` လို CHECK မှာ `col` NULL ဆို PostgreSQL က NULL = pass လို့ ယူတယ်။ Part 4 (`discount_codes` / `discount_requests` value)၊ Part 5 (`payroll_attendance_items` minutes / day_portion၊ `attendance_exceptions` minutes)၊ Part 7 (`cash_out_reasons` receivable_kind) မှာ `IS NOT NULL` ထပ်ထည့်ပြီး constraints v1.1 (schema မပြောင်း) + regression test ၄ ခု။ **Rule (§6.5 #13 အသစ်):** nullable column ကို OR-branch ထဲ စစ်ရင် `IS NOT NULL` အရင် ရေး။
- **D-BKG-20 ↔ D-CUS-05 ဆန့်ကျင်မှု တွေ့ (D-PLT-13)** — waitlist rule က "နေရာလွတ်ရင် customer ကို အကြောင်းကြား" ဆိုပေမဲ့ customer ဆီ ဘာမှမပို့ (D-CUS-05)၊ noti က staff in-app ပဲ (D-NTF-01)၊ customer account မရှိ (D-CUS-04)။ Waitlist ⏭ ဖြစ်လို့ အခု မဖြေရှင်းဘဲ **ဆောက်ချိန် ဆုံးဖြတ်ရန်** အဖြစ် §6.4b မှာ မှတ်ထား (ရွေးစရာ + Claude အကြံ ပါ)။

**v5 (30/Sep)**

- **ChatGPT ရဲ့ Part 1 draft (R364) က owner lock ကို ချိုးထားတာ ပြင်ပြီး** — role ရဲ့ branch scope ကို role level မှာ ထားမိတာ (F-P1-02 — "Manager အကုန် branch တူသွား")၊ role ပေး / ဖြုတ်ကို ရက်နဲ့ပဲ မှတ်တာ (F-P1-03)၊ status free text (F-P1-06)။
- **"ခြေကြွခ" ကို service line လုပ်လိုက်ရင် D-COM-02 အရ commission ပါ တွက်သွားမှာ** — owner က "ကားခ = barber ရဲ့ လမ်းစရိတ်" လို့ ရှင်းလို့ ပြင်ပြီး (D-SVC-06: ကားခ = ဆိုင်ဝင်ငွေ၊ commission ✖)။
- **Waitlist (D-BKG-20)** ကို ChatGPT (R365) က review ရဲ့ "Release 3" label ကြောင့် DB ထဲ ချန်ခဲ့တာ — release မခွဲတော့လို့ OPEN-27 အဖြစ် owner ကို ပြန်မေးရမယ်။ → **v5.1: ⏭ V1 မပါ + ပြင်ဆင်ချက် (§6.4b)**
- **DBML ကို PostgreSQL 16 မှာ တကယ် load + test** — Part 1 (၉ ခု)၊ 1b (၇ ခု)၊ 2 (၁၂ + ၆ ခု) အကုန် မျှော်လင့်တဲ့အတိုင်း (§6.3, §6.3b, §6.3c)။

**v4 (29/Sep ည)**

- **P373 ကို ChatGPT နားလည်မှားခဲ့တယ် → ပြင်ပြီး။** Owner က "ဆိုင်ရဲ့ အကောင့်ထဲ login ဝင်" လို့ ပြောတာကို R373 က "ဆိုင်မှာရှိတဲ့ device ပေါ်မှာ ကိုယ့် account နဲ့ login" လို့ 🔒 လုပ်ခဲ့တယ်။ နှစ်မျိုးလုံး ပြဿနာရှိတယ် — shared account ဆိုရင် Fresha "RC Team" (record 44% ကို ဘယ်သူရိုက်မှန်းမသိ) ပြန်ဖြစ်ပြီး D-EMP-02 ကို ချိုးတယ်၊ ဆိုင်ဖုန်းပေါ် ကိုယ့် account ဆိုရင် OTP / Google login က ပျက်နေတဲ့ ဖုန်းကို လိုပြီး stay signed in (D-AUTH-06) ကြောင့် logout မေ့ရင် နောက်လူ ဆက်ရိုက်မိမယ်။ Owner approve နဲ့ **D-VIS-12** (တခြား barber က ကိုယ့်ဖုန်းကနေ START / COMPLETE မှတ်ပေး) ဖြစ်သွားပြီ — payment အဆင့်ကတော့ P269 နဲ့ ကွဲနေလို့ 🟡 OPEN-28 *(→ v5.1 ✅ B လုပ်ရ)*။ R373 ရဲ့ "backup device မှာ ကိုယ့် account နဲ့ login" ကို မကိုးကားပါနဲ့။
- **R368 က backup policy ကို "infrastructure phase မှာမှ" လို့ ပြောခဲ့ပေမဲ့** owner က 29/Sep မှာ REC-20 ကို ရွေးပြီး lock လုပ်ပြီ (D-DAT-03)။
- **RISK-17 က RISK-02 နဲ့ ချိတ်နေတယ်** — counter device မထားတော့ iPhone PWA က Bluetooth printer ကို မသုံးနိုင်ဘူး။ V1 မှာ Android ဖုန်းကပဲ print (D-PAY-07)။ ဒါကြောင့် Android app shell ကို Bluetooth သုံးနိုင်အောင် (Capacitor — TWA မဟုတ်) လုပ်ရမယ် → REC-32 ဆုံးဖြတ်ချိန်မှာ ထည့်စဉ်းစား။
- **RISK-16 ကို "booking release ရောက်မှ" လို့ ထားခဲ့တာ မမှန်တော့ဘူး** — REC-10 ✖ (release မခွဲ) ဖြစ်လို့ public booking က V1 ထဲ ပါတယ်။
- **System error ≠ audit** — audit က data ပြောင်းတာကိုပဲ မှတ်တယ်။ App crash / error တွေအတွက် error monitoring (REC-38) သီးသန့် လိုတယ်။

**v3 (29/Sep)**

1. **ChatGPT ရဲ့ DB draft ၂ ခုမှာ 🔒 decision ကို ချိုးဖောက်တာ ၇ ခု ပါတယ်** — "ဖိုင်ထဲက rule အတိုင်း" လို့ ပြောထားပေမဲ့ —
   - Branch scope ကို role level (`role_branch_scopes`) မှာ ထားမိတယ် — 🔒 D-ROLE-05 က *employee ရဲ့ role assignment တစ်ခုချင်း* မှာ (F-P1-02)
   - `booked_barber_id` (F-BK-01)၊ ငွေကို `numeric(12,2)` (F-BK-02) — 🔒 D-DB-01 ကို ချိုး
   - 🔒 D-BKG-08 double booking DB constraint မပါ (F-BK-04)၊ booked employee ကို nullable ထားလို့ constraint ကိုပါ ရှောင်လို့ရ (F-BK-05)
   - Phone ကို unique မလုပ် (F-BK-07 — 🔒 D-CUS-02)၊ status ကို free text (F-P1-06 — 🔒 D-DB-01)

   ဒါကြောင့် part တိုင်းကို §6.5 checklist နဲ့ စစ်ပြီးမှ lock ပါ။
2. **Part နံပါတ် ရောသွားတယ်** — R360 plan မှာ Part 2 = Services/Scheduling၊ Part 3 = Customers/Booking။ R365 က Booking ကို "Part 2" လို့ခေါ်ပြီး Services ကို "Part 3" လို့ ပြောင်းခေါ်တယ်။ ဒီဖိုင်က **R360 numbering** ကိုပဲ သုံးတယ် — chat အသစ်မှာ part ကို နာမည်နဲ့ ခေါ်ပါ (§6.2)။
3. **🔒 D-AUTH-01..05 (Google/OTP login၊ device revoke) အတွက် table တွေက part plan ထဲ ဘယ်မှာမှ မပါဘူး** → Part 1b အကြံပြု (F-P1-08)။
4. **Lock မရှိဘဲ DB ထဲ ဝင်လာတဲ့ field** — `customers.preferences` (F-BK-08)။ D-PLT-11 က ကာချင်တဲ့ ပုံစံ အတိအကျပဲ။
5. **ChatGPT ရဲ့ ကောင်းတဲ့ ဆုံးဖြတ်ချက်တွေလည်း ရှိတယ်** — waitlist ကို core booking ထဲ မထည့်၊ one-active-booking DB constraint ကို edge case မဆုံးဖြတ်ခင် hard-lock မလုပ်၊ no-show = `CANCELLED` + reason၊ manage token ကို hash ပဲ သိမ်း (§6.4)။

### 0.4 နောက်တစ်ဆင့် (အသေးစိတ် §9, §10)

**02/Oct 14:50 — REC-41 + REC-42 ✅ (v5.2.18): owner ဆုံးဖြတ်ရန် ကျန်တာ မရှိတော့ — အောက်က NEXT အတိုင်းပဲ (item (5) ထဲက REC-42 / REC-41 = ပြီး).** *(အရင် —)* **02/Oct 14:30 — sheet 3 ဖြေပြီး၊ change ၄ ခု apply လုပ်လို့ရပြီ (v5.2.17 — zip တစ်ခုတည်း). NEXT = (1) ✋ **ACT-09 — repo ၂ ခု private** → batch ကို push (`point-sdd` အရင်) (2) စက်တိုင်း `SETUP.md` §3 (OpenSpec 1.14.0 · `openspec store register`) (3) point-barber ထဲမှာ `/opsx:apply add-repo-scaffold` (နှစ်ယောက်တွဲ; Claude Code ရေး / လူ စစ်) → `add-shared-ui-components` (Dev 1) ∥ `add-foundation-auth-access` (Dev 2) → `add-walkin-visit-checkout` (Dev 2) → `add-ci-guard-rails` · `add-staging-deploy` · `add-pilot-data-seed` · `add-late-entry` → pilot (4) change တစ်ခုချင်း "လူ့အချိန် ဘယ်နှနာရီ / apply ကနေ merge အထိ ဘယ်နှရက်" မှတ် → ပထမအပတ်ပြီးရင် owner က V1 ရက် သတ်မှတ် (dev-plan §6) (5) owner: **REC-42 coding guideline "OK"** · **REC-41 website ကျန်အရောင် "OK"** · admin palette (OPEN-30) · design reference ပုံ · logo · GitHub plan · pilot data · ပထမ admin ရဲ့ email / နာမည် / employee code (6) ကျန် change ၇၇ ခုရဲ့ brief → proposal (roadmap wave 1 ကစ).** *(အရင် —)* **02/Oct 13:00 — OpenSpec batch ထုတ်ပြီး (v5.2.16 — zip တစ်ခုတည်း: `point/point-sdd/` + `point/point-barber/`). NEXT = (1) owner က **§0.11 sheet 3** ဖြေ ("အကုန် OK" = default အတိုင်း) — အဲ့ဒါ ပြီးမှ change ၄ ခုရဲ့ Open questions ပိတ်ပြီး apply လို့ရ (**မေးခွန်း ကျန်တဲ့ change ကို လုံးဝ မ apply** — task group တချို့ အရင်စတာ ✖) (2) ✋ **ACT-09 — repo ၂ ခု private ပြောင်း** → batch ကို push (`point-sdd` အရင်) (3) စက်တိုင်း `SETUP.md` §3 (OpenSpec 1.14.0 · `openspec store register`) (4) point-barber ထဲမှာ `/opsx:apply add-repo-scaffold` (နှစ်ယောက်) → `add-shared-ui-components` (Dev 1) ∥ `add-foundation-auth-access` (Dev 2) → `add-walkin-visit-checkout` (Dev 2) → `add-ci-guard-rails` · `add-staging-deploy` · `add-pilot-data-seed` · `add-late-entry` → pilot (5) ပထမအပတ် velocity တိုင်းပြီး schedule ပြန်ကြည့် (dev-plan §6) (6) owner: coding guideline approve (REC-42) · admin palette (OPEN-30) · website token အဆိုပြု (REC-41) · design reference ပုံ · logo · GitHub plan (private repo မှာ branch protection) · pilot data.** *(အရင် —)* **02/Oct 04:10 — API design ပြီး (v5.2.15 bundle: API Part 0 v1.5 · Part 1 v1.5 · Part 2 v1.4 · Part 3 v1.1 · Part 4–8 v1.0 — အကုန် 🔒 + OpenAPI ၈ ဖိုင် · ADR-001..015 · system design v1.3 · admin guideline v1.5 · frontend guideline v1.4 · db zip v7 (G — test ၃၅၅)). NEXT = (1) owner က **§0.9 OPEN-40** ကို ဖြေ ("OPEN-40 OK" = အကြံပြုချက်အတိုင်း) (2) **OpenSpec spec အဆင့် (D-PLT-17)** — owner က dev plan / OpenSpec အတွက် ထပ်ပြောမယ့် အချက် + ★ OPEN-30 colour / design reference ပေး → `openspec/` project context → ADR-001 repo scaffold change → walk-in → checkout vertical slice change.** *(01/Oct 23:30 — scope A (ADR-012) + API Part 3 draft v1.0 ထုတ်ပြီး (v5.2.14 bundle: API Part 0 v1.4 / Part 1 v1.4 / Part 2 v1.3 🔒 + **Part 3 v1.0 ⚠️** + OpenAPI ၃ ဖိုင် · ADR-001..012 · system design v1.2 · admin guideline v1.4 · frontend guideline v1.3 · db zip v6 မပြောင်း). NEXT = owner က **§0.8 (Part 3 lock — ၃ ချက်)** ကို ဖြေ (default OK ဆို "အကုန် OK") → Claude က D-API-04 🔒 + **Part 4 (Visits, Sales & Payments) question sheet** (D-PLT-19 — sheet အရင်၊ ဖြေပြီးမှ draft).** *(01/Oct 21:20 — §0.6 ✅ lock batch v5.2.13)* *(01/Oct 15:22 — save point §0.6)* *(01/Oct 13:00 — API Part 2 draft v1.1)* *(01/Oct 11:54 — API v1.2 · system design + ADR)* *(01/Oct 11:09 — 🔒 guideline v1.2)* ★ OPEN-30 colour palette + design reference = OpenSpec spec ထုတ်ချိန် ရောက်မှ owner ပေး — Claude Code က အဲ့အချိန် တောင်း။ *(30/Sep နေ့လယ် — DB design ၈ part အကုန် 🔒 · table ၉၁ · PostgreSQL test ၂၉၆ PASS)*

1. ✋ **ACT-07 — `fresha-research` repo ကို private ပြန်ပြောင်း (ချက်ချင်း)** — ဒီ chat အတွက် public ဖွင့်ထား; screenshot ထဲ owner နာမည် / email / ဖုန်း / ရန်ကုန်လိပ်စာ + live revenue ပါ (RISK-13)။ ပြောင်းပြီးရင် logout browser (incognito) နဲ့ ဖွင့်ကြည့် အတည်ပြု။
2. ✋ **ACT-03 — Fresha sandbox trial 04/Oct ကုန်မယ် (၃ ရက်ပဲ ကျန်)** — မကုန်ခင် barber-level login test (§4.4) — barber app မှာ ဘာမြင်ရလဲ စစ်ရင် admin guideline ရဲ့ barber screen (AD-TODAY / AD-POS) ကို ထပ်တိုက်လို့ရ။ ★ Appendix C (owner login နဲ့ Fresha ၁၅ မိနစ်) ကလည်း ဒီအချိန် လုပ်ရင် OPEN-03 B / 06 B အဖြေ တစ်ချို့ ရမယ်။
3. ✋ **ACT-04 + ACT-06** — *(v5.2.15: 🔒 API Part 0–8 (`docs/api/00..08` + `openapi/part1..8`) + `docs/adr/` (ADR-001..015) + `docs/architecture/system-design.md` v1.3 + admin guideline v1.5 + frontend guideline v1.4 + `db/` zip v7 — repo ထဲ ထည့်ဖို့ အသင့်)* — ဒီဖိုင် + `db/` folder (zip) ကို product repo `docs/` + `db/` ထဲ၊ Appendix A → `docs/decisions/decision-register.md`၊ UI/UX guideline ၂ ဖိုင် → `docs/ux/admin-panel.md` + `docs/ux/frontend-website.md` (owner review ပြီး version) + `CLAUDE.md` ညွှန် (§10.7)။
4. ✅ **UI/UX guideline review (D-PLT-18 #1) — ပြီး** — 01/Oct 11:09 owner approve → 🔒 D-UX-03 / D-UX-04 (v1.2)။ ကျန် = ACT-06 (repo `docs/ux/` + CLAUDE.md — §10.7 snippet) · ★ OPEN-30 (spec အဆင့်မှ)။
4b. ✅ **API design (D-PLT-18 #2) — ပြီး (02/Oct)** — 🔒 **Part 0 v1.6 (D-API-01) · Part 1 v1.6 (D-API-02) · Part 2 v1.4 (D-API-03) · Part 3 v1.1 (D-API-04) · Part 4 v1.1 (D-API-05) · Part 5 / 6 / 7 v1.1 (D-API-06..08) · Part 8 v1.0 (D-API-09)** — owner one-sheet 02/Oct 00:06 (§0.8, §11.9) · OPEN-40 ✅ (§0.9, §11.10) · sheet 3 ✅ (§0.11, §11.11) — part တိုင်း = Markdown + OpenAPI fragment (`x-permission` ပါ); permission code = menu CRUD + special (ADR-011)။ Part 4 ပြီးရင် walk-in → checkout vertical slice ကို OpenSpec change အဖြစ် စလို့ရ (dev plan #6)။
5. ✅ **API convention (Part 0 v1.3 🔒)** — `@Can()` + branch scope, `view⁺` read rule, `Idempotency-Key`, audit interceptor, CSRF, error format, realtime catalogue (Part 2 event ပါ), Turnstile + rate limit · §10.6 API မေးခွန်း: #14 booking idempotency ✅ ADR-004 · #6 14 ရက် window staff ✅ D-BKG-06 · #9 cutoff setting key `booking.customer_change_cutoff_minutes` (✅ 120 — §0.7 #1) · #21 public barbers endpoint → Part 3 / 8 · #23 rating permission ✅ `employee.rating_update`။ OpenSpec change = part lock ပြီး module တိုင်း (D-PLT-17)။
6. **Development plan (🔒 D-PLT-14) + OpenSpec setup (🔒 D-PLT-17)** — dev ၂ ယောက် + Claude Code ပြိုင်တူ၊ တစ်လ။ Owner က dev plan + OpenSpec အတွက် **ထပ်ပြောမယ့် အချက် ရှိတယ်** (30/Sep နေ့လယ်) → ကြားပြီးမှ ဆွဲ။ Plan ထဲ: module ခွဲဝေ (dev A / dev B — ဖိုင် မတိုက်အောင်)၊ **shared UI component အရင်** (AD-IMPL-02 — ၂ ယောက်လုံး သုံးမှာ)၊ vertical slice (walk-in → checkout အရင်)၊ `CLAUDE.md` rule (D-PLT-13 conflict STOP, D-UI-01, D-PLT-03, D-DB-03 / 04, §6.5 #13 CHECK NULL, **D-UX-01 / 02 — `docs/ux/` rule ID ကိုးကား၊ colour / font မတီထွင်** — §10.7)၊ go-live checklist (ပိုင်ရှင် setting တန်ဖိုး — OPEN-03 B, 05 B, 06 B, 19, 21 toggle; seed data — categories, cash out reasons, notification types, Point commission plan; language file MM စာသား owner စစ်)။ `openspec/` folder: project context (decision register + `docs/ux/` = source) → module တိုင်း change (proposal → spec delta → design → tasks) → Claude Code implement → archive။
7. ✅ **Architecture review + ADR — အကုန် Accepted (01/Oct 21:20 — §12.7 · ADR-012 01/Oct ည · ADR-013 / 014 / 015 + ADR-012 Amendment 1 02/Oct — §12.10)** — `docs/architecture/system-design.md` v1.3 + `docs/adr/ADR-001..015`: ADR-002 pg-boss + backup sidecar (RPO daily) · 003 Capacitor · 004 booking client token · 005 session + CSRF + Google hand-off · 006 website SSR + revalidate · 007 **Resend Free · HetrixTools Free (Email + Telegram) · Sentry Developer** · 008 Socket.IO · 009 single origin · **011 permission = menu CRUD + special action (010 Superseded)** · **012 scope = data level (011 #7 အစားထိုး — 01/Oct ည; Amendment 1 = `private`)** · **013 document rendering (server Chromium — receipt / payslip / PDF)** · **014 file storage (S3 bucket)** · **015 reports / exports (live query)** · ADR-001 §Action items = repo scaffold — Part 1 code မစခင် ပထမ OpenSpec change။
8. **Prototype + pilot** — *(v5.2.13: pilot login = **Google login ပဲ** — domain မရခင် Resend က OTP မပို့နိုင်; D-ARC-02)* REC-03: Today → Start → Checkout → Finish clickable prototype ကို barber ၃–၅ ယောက်ရဲ့ **ကိုယ်ပိုင်ဖုန်း** ပေါ်မှာ စမ်း (D-VIS-11, AD-QA-04 — tap / စက္ကန့် တိုင်း)၊ customer ၅ ယောက် QR ကနေ booking စမ်း (FE-QA-03)။
9. **Code (D-PLT-18 #3)** — OpenSpec change တစ်ခုချင်း → Claude Code → PR မှာ decision ID + UX rule ID ကိုးကား (AD-META-02 / FE-META-02) → screen DoD checklist (AD-QA-01 / FE-QA-01)။
10. ★ **ACT-08 (build ချိန်) — ops account** — owner ပိုင် ops Gmail ဖွင့် → **Resend (Free) · HetrixTools (Free) · Sentry (Developer)** account ၃ ခု အဲ့ Gmail နဲ့ ဖွင့် → Telegram မှာ `@hetrixtools_bot` → Start → Chat ID ကို HetrixTools contact list ထဲ · production release ချိန် domain ထည့် + Resend DNS verify (go-live ၂–၃ ရက် အလို) (D-ARC-02, ADR-007)။
11. ★ **ပိုင်ရှင်ဆီ ပို့ရမယ့် data / setting မေးခွန်း** (DB မထိ — Appendix B ◐ / ★): OPEN-03 B (၁၀ ယောက် လစာပုံစံ — INFERRED basic ပဲ)၊ OPEN-06 B (နောက်ကျ / ပျက်ကွက် ဖြတ် တန်ဖိုး)၊ OPEN-19 (QR + GPS သဘောတူ)၊ OPEN-05 B (opening float / tolerance / ပိတ်ခွင့် role)၊ OPEN-21 (ဖွင့်ချိန် data၊ domain — toggle ✅)၊ OPEN-15 / 24 (tax / KBZPay ref — Appendix C)၊ **OPEN-30** (colour palette + design reference — spec အဆင့်မှ owner ပေး)။ *(✅ 01/Oct: OPEN-10, 20, 31, 32, 33, 34, 35, 36, 37 + confirm ၂ ချက် + D-BKG-23)*

### 0.5 Chat အသစ်မှာ စဖို့ prompt

**v5.2.16 ကစ — repo ၂ ခုထဲမှာ အလုပ်လုပ်တယ်** (ADR-016): `point/point-sdd/` (ဒီဖိုင် = `docs/decisions/point-barbershop-system-review-v5.2.18.md` · `docs/decisions/decision-register.md` · `docs/db/` (zip v8 — Part 5 v1.2 · Part 7 v1.2 · test ၃၉၃ PASS) · `docs/ux/admin-panel.md` (🔒 v1.7) · `docs/ux/frontend-website.md` (🔒 v1.7) · `docs/api/00-conventions.md` (v1.6) + `01..08-*.md` (Part 1 = v1.6 · Part 4 / 5 / 6 / 7 = v1.1) + `openapi/` · `docs/adr/ADR-001..016` · `docs/architecture/system-design.md` (v1.4) · `docs/plan/` · `openspec/`) နဲ့ `point/point-barber/` (`CLAUDE.md` · `docs/engineering/coding-guideline.md` · `openspec/config.yaml` pointer · `design-reference/`)။ Claude Code ကို `point-sdd` ထဲမှာ ဖွင့်ရင် `CLAUDE.md` + `openspec/config.yaml` က rule တွေကို အလိုလို ပေးတယ်။ **Chat (claude.ai) အသစ်မှာ ဆက်ချင်ရင်** `point-sdd` ကို zip လုပ်ပြီး attach + အောက်က prompt —

```text
ဒီဖိုင်တွေက Point Barbershop system ရဲ့ spec hub (point-sdd) ပါ။ Chat အဟောင်းတွေ ဖျက်ပြီးပြီ — docs/decisions/ (review v5.2.18 +
decision-register.md) + docs/db/ + docs/ux/ + docs/api/ + docs/adr/ + openspec/ ကပဲ source ပါ။ App code repo = point-barber (သီးသန့်)။
Rule —
1. decision-register.md (= review Appendix A) ထဲက 🔒 decision တွေပဲ requirement။ ⚠️ recommendation၊ 🟡 open decision တွေကို
   ငါ approve မလုပ်မချင်း spec ထဲ၊ DB ထဲ၊ code ထဲ မထည့်ရ (D-PLT-11)။
2. DB design Part 1–8 အကုန် 🔒 (Part 1 v3.4 · Part 2 v1.3 · Part 4 constraints v1.2 · Part 5 v1.2 · Part 6 v1.2 · Part 7 v1.2 · Part 8 v1.1)
   — table ၉၁၊ test ၃၉၃ PASS။ DB ပြင်ချင်ရင် docs/db + review §6 + Appendix A ကို update ပြီး version bump — lock ကို ချိုးမပြင်ရ။
3. Coding = SDD, tool = OpenSpec 1.14.0 (D-PLT-17 / D-PLT-20) — spec မရေးဘဲ code မရေးရ။ openspec/config.yaml ရဲ့ rule အတိုင်း:
   change တစ်ခု = form / topic တစ်ခု; requirement = တန်ဖိုးပါတဲ့ SHALL စာကြောင်း + source ID; scenario = တကယ့် နာမည် / MMK / အချိန်
   (docs/plan/spec-fixtures.md); capability = config.yaml ထဲက ၂၅ ခု (အကုန် 🔒)။
   Proposal မှာ "Open questions" ကျန်ရင် အဲ့ change ကို လုံးဝ မ apply။
4. Requirement အချင်းချင်း ဆန့်ကျင်နေတာ တွေ့ရင် ကိုယ်တိုင် မရွေးနဲ့ — ရပ်ပြီး ငါ့ကို မေး (D-PLT-13)။
5. တစ်ခါ ခေါင်းစဉ် တစ်ခုပဲ။ ဆုံးဖြတ်ပြီးသားကို ပြန်မမေးနဲ့။ မြန်မာလို ရိုးရိုးရှင်းရှင်း၊ ဥပမာနဲ့ ရှင်းပြ၊ အကြံပြုချက် ပါရင် ဘာကြောင့်လဲ ပြော။
6. ဆုံးဖြတ်ချက် တစ်ခု lock ဖြစ်တိုင်း review ကို update (Appendix A + §3.0 register + §0) → tools/extract-decision-register.py run။
7. UI / screen = docs/ux/admin-panel.md (AD-… — v1.7) / docs/ux/frontend-website.md (FE-… — v1.7) rule ကို လိုက်၊ rule ID ကိုးကား။
   Website အရောင် = #EEEEEE / #000000 / #DC5F00 (ခလုတ် အမည်း + စာဖြူ; လိမ္မော် = decoration ပဲ) + ကျန် token အကုန် 🔒 (FE-VIS-01a)။ Admin panel အရောင် မပေးရသေး → neutral;
   colour / logo မတီထွင်ရ (D-UX-02)။ Design reference ပုံ = point-barber/design-reference/ (reference ပဲ — rule မဟုတ်)။
   Font = Pyidaungsu · Manrope / Inter · Archivo Black / Roboto။ Website booking = modal (D-UX-05)။
8. API = docs/api/00-conventions.md (API-… — v1.6) + part ဖိုင် (P1.… … P8.…) + openapi/ — Part 0–8 အကုန် 🔒 (Part 1 = v1.6 · Part 4 / 5 / 6 / 7 = v1.1)။
   Permission = menu တစ်ခုချင်း CRUD + special action (ADR-011); manage code ✖; data အဆင့် company / branch / mixed / shared / private (ADR-012)။
9. Infrastructure / cross-cutting = docs/architecture/system-design.md (v1.4) + docs/adr/ADR-001..016 (ADR-016 = repo ၂ ခု)။
   ပြောင်းချင်ရင် ADR အသစ် + အဟောင်း Superseded / Amendment။
10. Workflow (D-PLT-19): မေးခွန်း ရှိရင် sheet တစ်ခုတည်း အရင် မေး — ငါ အကုန် ဖြေပြီးမှ ဖိုင် ထုတ်; ထုတ်စရာ အကုန် တစ်ခါတည်း ပေါင်းထုတ်။
11. Code ရေးပုံ = point-barber/docs/engineering/coding-guideline.md (CG-… — v1.0 🔒 approve ပြီး, rule အကုန် binding) — spec / PR မှာ decision ID နဲ့အတူ ကိုးကား။
12. လုပ်ပုံ: Claude Code က code ရေး၊ developer ၂ ယောက်က review + test (ငွေ / permission / စာရင်းပိတ် အပိုင်းကို သေချာစစ်)။ "တစ်လ" = pilot အထိ ပစ်မှတ်;
    V1 ရက်ကို ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ ငါ သတ်မှတ်မယ် (dev-plan §6)။
NEXT = (1) change ၄ ခု apply (add-repo-scaffold → add-shared-ui-components ∥ add-foundation-auth-access → add-walkin-visit-checkout) —
    sheet 3 (§0.11) ကို ငါ "အကုန် OK" ဖြေပြီး၊ Open questions မကျန်။
(2) docs/plan/roadmap.md အတိုင်း နောက် change တွေရဲ့ brief → proposal (wave 1 ကစ — pilot လိုအပ်ချက်: add-ci-guard-rails,
    add-staging-deploy, add-pilot-data-seed, add-late-entry အရင်)။
(3) ငါ ပေးရန် ကျန်: admin palette (OPEN-30) · logo · design reference ပုံ · pilot data။ (REC-41 / REC-42 = approve ပြီး။)
ACT-09 (repo ၂ ခု private) · ACT-07 (fresha-research repo private) · ACT-03 (Fresha sandbox 04/Oct ကုန်) · ACT-08 (ops account — deploy ချိန်) သတိပေး။
```

### 0.6 Owner decision sheet — ✅ ဖြေပြီး 01/Oct 21:20 *(sheet = v5.2.12 · 01/Oct 15:22 · အဖြေ = v5.2.13)*

**✅ Owner အဖြေ (01/Oct 21:20)** — ဒီအဖြေနဲ့ lock + ဖိုင် ထုတ်ပြီး (§0.2 (ဌ))။ မူလ sheet ကို အောက်မှာ record အဖြစ် ဆက်ထား။

| # | ခေါင်းစဉ် | Owner အဖြေ | ရလဒ် |
| --- | --- | --- | --- |
| 1–8 | API Part 0 / 1 (idempotency A · rate limit 10 / IP · 3 / ဖုန်း · Turnstile · number · single origin · invite ချက်ချင်း · branch code · client-readable list) | "အကုန် OK" (default) | 🔒 D-API-01 / 02 |
| 9 | ADR-002 pg-boss + backup sidecar | "pg-boss + PostgreSQL job architecture — OK" | Accepted |
| 10 | ADR-003 Capacitor | "Capacitor Android + Bluetooth Classic ESC/POS — OK" | Accepted |
| 11 | ADR-005 CSRF + Google hand-off | "CSRF protection — OK" · "Android/iOS Google login hand-off flow — OK" | Accepted |
| 12 | ADR-006 website SSR + revalidate | "SSR + tag-based cache + transactional revalidation — OK" | Accepted |
| 13 | ADR-007 email / uptime / error | "Resend ကို Free ရအောင်သုံးမယ်" · uptime = "Telegram ကို အမြဲ ပို့လို့ရလား" · alert = "Email + Push" · error = "Sentry" → #27 / #28 | Accepted + D-ARC-02 |
| 14 | ADR-008 Socket.IO | "အကုန် OK" | Accepted |
| 15 | Backup RPO | "အကုန် OK" → **daily** | D-DAT-03 note |
| 16–24 | API Part 2 (buffer ပေါင်း · ပိတ်ရက် staff ✖ · approved cancel = `leave.approve` · self ✖ · ≤ 2 · ခန့်မှန်း ပြီးချိန် · shift ထဲ · roster ချက်ချင်း · DB v1.3) | "အကုန် OK" | 🔒 D-API-03 · D-DB-06 v1.3 |
| (owner list) | ADR-001 | "OK — 1 VPS / Docker Compose" | Accepted (reconfirm) |
| (owner list) | Domain / DNS | "Domain / DNS Access = ရှိမှာပါ" · "Final Domain Name က production release လုပ်မှ ငါ့ဟာငါထည့်မယ်" | ACT-05 · D-ARC-02 |
| (owner list) | Default roles | "Admin / Manager / Barber" | 🔒 D-ROLE-09 |
| (owner list) | Permission matrix | "Manage ဆိုပြီး ဘုံမဟုတ်ဘဲ view, create, update, delete … Action အလိုက်" | → #25 / #26 |
| (owner list) | Company admin | "`role.manage` + `role.assign` — အဲ့အတိုင်းလုပ်မယ်" → `role.manage` မရှိတော့ (CRUD) → ❌ ဆန့်ကျင် → #25 | → #25 |
| **25** | Company admin (CRUD နဲ့) | **A** — Role ၅ code (`view` + `create` + `update` + `delete` + `assign`) company scope; "Admin = အကုန် ✔, Manager = check လုပ်ပေးတာပဲ" | P1-RULE-12 · ADR-011 |
| **26** | CRUD ခွဲပုံ (a) manage → CRUD (b) special action ဆက် (c) delete = archive (d) view = စီမံ screen, operational list open | **a, b, c, d OK** | 🔒 D-ROLE-02 · ADR-011 |
| **27** | Uptime provider + alert | **HetrixTools Free · Email + Telegram** | D-ARC-02 |
| **28** | Sentry plan | **Sentry (Developer / Free)** — default; Team = လိုမှ | D-ARC-02 |
| **29** | Domain မရခင် email | **default ၃ ချက်** — dev = Mailpit · pilot = Google login · Resend domain = go-live ၂–၃ ရက် အလို | D-ARC-02 |
| ★ a–f | တန်ဖိုး | a domain = release ကျမှ · b account = build ချိန် (ACT-08) · c / d colour + logo = spec အဆင့် · e / f go-live data / setting | – |

*(#25–#29 = Claude က 01/Oct 21:00 မှာ follow-up sheet အဖြစ် မေး — owner list ထဲက "Permission matrix" ↔ "Company admin" ဆန့်ကျင်ချက် (D-PLT-13) + provider အသေးစိတ်။)*

**မူလ sheet (record):**


> **ဖြေပုံ:** Claude default အတိုင်း သဘောတူရင် နံပါတ် မရေးဘဲ **"အကုန် OK"**; ပြောင်းချင်တာပဲ **နံပါတ် + အဖြေ**။ ဖြေပြီးမှ Claude က တစ်ခါတည်း lock + ဖိုင် ထုတ် (D-PLT-19)။ Source = `docs/api/00-conventions.md` §12 · `01-foundation.md` §13 · `02-catalogue-scheduling.md` §16 · `docs/adr/README.md`။

**A. API Part 0 / Part 1** (→ 🔒 D-API-01 / 02)

| # | မေးခွန်း | Claude default | ချိတ် |
| --- | --- | --- | --- |
| 1 | Booking idempotency — client က manage token ထုတ် (A, DB မပြင်) vs `bookings.client_request_id` column (B) | **A** | Part 0 §12 #1 · ADR-004 · OPEN-38 |
| 2 | Public booking rate limit — IP ၁ နာရီ ၁၀ ကြိမ် · ဖုန်း ၁ နာရီ ၃ ကြိမ် | အတိုင်း | Part 0 §12 #3 · API-LIM-01 |
| 3 | Captcha — Turnstile (Google account မလို, အခမဲ့) vs reCAPTCHA v3 | **Turnstile** | Part 0 §12 #5 · D-BKG-21 |
| 4 | Status code ကို API မှာ number (0 / 1 / 2 — DB အတိုင်း) | number | Part 0 §12 #6 · D-DB-03 |
| 5 | API origin = `app.<domain>/api/…` (subdomain ✖, CORS ✖) | origin တစ်ခုတည်း | Part 0 §12 #8 · ADR-009 |
| 6 | ဝန်ထမ်း ထည့်တာနဲ့ invite email ချက်ချင်း ပို့ vs admin က နောက်မှ ပို့ | ချက်ချင်း | Part 1 §13 #2 |
| 7 | Branch code ပုံစံ `^[A-Z0-9]{1,10}$` (B1 / B2 / B3) | အတိုင်း | Part 1 §13 #4 |
| 8 | App ဖွင့်တာနဲ့ ပါလာမယ့် client-readable setting list (booking interval / window, tax / service-charge flag, closing tolerance, အိမ်ကားခ, ဘာသာ, upload size) | အတိုင်း | Part 1 §13 #3 |

*(Part 1 §13 #5 picker filter = Part 2 မှာ ပိတ်ပြီး — မေးစရာ မလို)*

**B. Architecture — ADR Proposed ၈ ခု** (→ Accepted; REC-31 / 32 / 35 / 38 ✅)

| # | ADR | Claude default |
| --- | --- | --- |
| 9 | ADR-002 — background job = pg-boss (Postgres ထဲ, Redis ✖) + backup = sidecar container | OK |
| 10 | ADR-003 — Android app = Capacitor (Bluetooth printer; TWA မရ) | OK |
| 11 | ADR-005 — CSRF header + Origin · **Android / iPhone app ထဲ Google login = ဖုန်း browser မှာ login → app ထဲ hand-off** | OK |
| 12 | ADR-006 — website = server render + admin ပြင်တာနဲ့ revalidate (CMS ✖) | OK |
| 13 | ADR-007 — email provider (OTP + invite ပဲ) · ပြင်ပ uptime check · error tracking (provider = criteria ပဲ) | OK |
| 14 | ADR-008 — realtime = Socket.IO, server ၁ လုံး | OK |
| 15 | Backup RPO — daily (အများဆုံး ၂၄ နာရီ data ပျောက်နိုင်) vs WAL archiving (နာရီအလိုက်) | **daily (V1)** |

*(ADR-001 / 010 = Accepted ပြီး · ADR-004 = #1 · ADR-009 = #5)*

**C. API Part 2 — Catalogue & Scheduling** (→ 🔒 D-API-03 · D-DB-06 v1.3; OPEN-39)

| # | မေးခွန်း | Claude default | ချိတ် |
| --- | --- | --- | --- |
| 16 | Booking တစ်ခုမှာ service ၂ ခု+ ဆို buffer (ရှင်းလင်းချိန်) **ပေါင်း** (5 + 10 = 15) vs အကြီးဆုံး တစ်ခုပဲ | **ပေါင်း** | Part 2 §16 #1 · P2-RULE-10 |
| 17 | Branch ပိတ်ရက် (`branch_closures`) မှာ **staff** ကပါ booking မထည့်ရ | မထည့်ရ | §16 #2 |
| 18 | Approve ပြီးသား ခွင့်ကို cancel — `leave.approve` ရှိသူပဲ | approve permission ရှိသူပဲ | §16 #3 · P2.LV.06 |
| 19 | Manager က ကိုယ့်ခွင့် ကိုယ် approve ✖ (တခြား approver) | ✖ | §16 #4 · P2.LV.07 |
| 20 | Option group ≤ 2 ကို API ကပါ ကန့်သတ် (grid editor နဲ့ တူ; DB မကန့်) | ≤ 2 | §16 #5 · P2.OPT.02 |
| 21 | လုပ်နေဆဲ walk-in က barber ကို ခန့်မှန်း ပြီးချိန် (service ကြာချိန် + buffer) အထိ ပိတ် vs အခုအချိန်အထိပဲ | ခန့်မှန်း ပြီးချိန် | §16 #6 |
| 22 | Shift ကုန်ခါနီး slot — buffer ပါ shift ထဲ ဝင်မှ ပြ (19:35 မှာ 30 + 10 ✖, 20:00 ပိတ်) vs buffer shift ကျော်လို့ ရ | shift ထဲ ဝင်မှ | §16 #8 |
| 23 | Pattern save ရင် roster **ချက်ချင်း** update (guideline AD-SCH-01 "tonight" စာသား → နောက် version မှာ ပြင်) | ချက်ချင်း | §16 #9 |
| 24 | **DB Part 2 v1.3 confirm** — `employee_service_eligibilities.archived_at` + `schedule_patterns.archived_at` (တစ်နေ့တည်း ပြန်ဖြုတ်နိုင်ဖို့; PostgreSQL test PASS; zip v5) | confirm | §16 #10 · D-DB-06 |

**★ တန်ဖိုး — အခု မလို, ရှိရင် ပြော (decision မဟုတ်)**

| ★ | ဘာ | ဘယ်အချိန် လို |
| --- | --- | --- |
| a | Domain name (ACT-05) — `<domain>` + `app.<domain>` | deploy / email DNS |
| b | Email · uptime · error-tracking account ၃ ခု (owner နာမည်နဲ့ — criteria = ADR-007) + alert ပို့မယ့် email / ဖုန်း | build ချိန် |
| c | Colour palette + website design reference ပုံ (OPEN-30) | spec အဆင့် (OpenSpec) |
| d | Logo ဖိုင် | spec အဆင့် |
| e | Go-live data — service / option grid / ဈေး / eligibility / pattern / leave type (Fresha list) | Part 8 import |
| f | Setting တန်ဖိုး — OPEN-03 B (လစာပုံစံ), 05 B (opening float / tolerance), 06 B (ဖြတ်ငွေ), 19 (QR + GPS), 21 (ဖွင့်ချိန်) | go-live checklist |

**ဖြေပြီးရင် Claude လုပ်မယ့်အစဉ် (တစ်ခါတည်း):** (1) register — D-API-01 / 02 / 03 🔒, D-DB-06 v1.3 🔒, ADR-002..009 Accepted, REC-31 / 32 / 35 / 38 ✅, OPEN-38 / 39 ✅ (2) API Part 0 **v1.3** (Part 2 §13 amendment list: event ၄ + `leave.*` → Part 2, module map code, API-RT-01 read scope) · Part 1 **v1.3** (P1-RULE-05 read scope, P1.EMP.09 `service_id` repeatable) · Part 2 **v1.2** (owner အဖြေ) + OpenAPI ၃ ဖိုင် validate (3) ADR ၁၀ ဖိုင် status + README (4) `db/` zip (v1.3 🔒) (5) review update → **ဖိုင် အကုန် zip တစ်ခုတည်း** ပို့ → (6) Part 3 draft စ။

### 0.7 API Part 3 (Customers & Booking + public) — question sheet *(v5.2.13 · ✅ owner ဖြေပြီး 01/Oct ည — "အကုန် OK" → Part 3 draft v1.0, v5.2.14)*

> **ဖြေပုံ:** Claude default အတိုင်း သဘောတူရင် **"အကုန် OK"**; ပြောင်းချင်တာပဲ **နံပါတ် + အဖြေ**။ ဖြေပြီးမှ Part 3 draft (`docs/api/03-customers-booking.md` + OpenAPI) + review ကို တစ်ခါတည်း ထုတ် (D-PLT-19)။ Source = Appendix A.5 / A.6 · DB Part 3 v3 · frontend FE-BK / FE-CONF / FE-MNG · admin AD-BKG / AD-CAL / AD-CUS · API Part 0 / 2 (availability + price quote = Part 2 function)။
> **ဆုံးဖြတ်ပြီးသား — မမေးတော့:** name + ဖုန်းပဲ (D-BKG-10) · website active booking ၁ ခု (D-BKG-09) · manage link = client token (ADR-004) · Turnstile + rate limit (D-BKG-21) · reschedule ဈေး rule (D-BKG-12) · cancel reason မဖြစ်မနေ (D-BKG-14) · cancel ပြီး ပြန်မဖွင့် (D-BKG-16) · no-show 40 မိနစ် auto-cancel (D-BKG-17) · ဆိုင် / အိမ် (D-BKG-22) · lead time မရှိ (D-BKG-23) · window 14 ရက် staff ပါ (D-BKG-06) · modal + confirmation page (D-UX-05) · booking modal မှာ ဈေး + barber အမြဲ (OPEN-35)။

| # | မေးခွန်း | Claude default | ဘာကြောင့် / ချိတ် |
| --- | --- | --- | --- |
| 1 | ★ **Customer က link နဲ့ ပြောင်း / cancel လုပ်ခွင့် ကုန်တဲ့အချိန်** (setting `booking.customer_change_cutoff_minutes` — staff မသက်ရောက်) | **ချိန်းချိန် ၂ နာရီ (120 မိနစ်) အလို** — ဥပမာ 2:00 PM booking ကို 12:00 PM ထိ ပြောင်းရ; နောက်ပိုင်း = "ဆိုင်ကို ဖုန်းဆက်ပါ" | D-BKG-12, FE-MNG-05; admin က setting မှာ ပြောင်းလို့ရ |
| 2 | **No-show alarm** (ချိန်းချိန် ရောက်ပြီး မစရသေး) ကို ဘယ်သူ ရ | **Booked barber + အဲ့ branch ရဲ့ manager** (booking ပြင်ခွင့် `booking.update` ရှိသူ) | Barber ဖုန်း မကိုင်မိရင်လည်း တစ်ယောက်ယောက် သိ — AD-BKG-09 (owner approve ရန် ကျန်) · D-BKG-17 |
| 3 | ၄၀ မိနစ် မပြည့်ခင် **staff က "Customer မလာ" နဲ့ ကိုယ်တိုင် cancel** လုပ်ခွင့် | **ရ** (no-show history ထဲ ဝင် — ကန့်သတ်ချက် မဖြစ်) | Customer က ဖုန်းဆက် "မလာတော့ဘူး" ပြောရင် slot ကို ချက်ချင်း ပြန်ဖွင့် — AD-BKG-09 · D-CUS-09 |
| 4 | Confirmation page မှာ **"၄၀ မိနစ် နောက်ကျရင် booking ပျက်"** ကို customer ကို ပြော | **ပြော** — "အချိန်မီ လာပါ; ၄၀ မိနစ် ကျော်ရင် booking အလိုအလျောက် ပျက်ပြီး ရောက်လာရင် walk-in အဖြစ် လက်ခံ; နောက်ကျမယ်ဆို ဆိုင်ကို ဖုန်းဆက်" | ★ FE-CONF-03 (owner စာသား) · ရိုးသားမှု |
| 5 | **"Calendar ထဲ ထည့်" (.ics)** — confirmation / manage page မှာ | **ထည့်** — ဖုန်းထဲမှာပဲ ဖိုင်ထုတ် (server က ဘာမှ မပို့ — D-CUS-05 OK); ဖိုင်ထဲ manage link ပါ | Link ပျောက်တာ လျော့ — ⚠️ REC-36 ကို approve |
| 6 | **Preferred barber** (customer detail) ဘယ်လို တွက် | **နောက်ဆုံး ပြီးတဲ့ visit ၅ ခုထဲ barber တစ်ယောက်တည်းက ၃ ခု+** → preferred; မရှိရင် "–" · (၅ / ၃ = setting) | 🟡 OPEN-12 ပိတ် · D-CUS-08 |
| 7 | Customer **"Inactive"** ဆိုတာ | **List / search မှာ default မပြ (filter နဲ့ ပြ)**; ဒီဖုန်းနဲ့ booking / walk-in ပြန်လာရင် **အလိုအလျောက် Active** ပြန် — website booking ကို **မပိတ်** | D-CUS-07 / 09 (ကန့်သတ်ချက် ✖) · F-BK-21 (archive) နဲ့ ပုံစံတူ |
| 8 | Website booking တစ်ခုမှာ **service အများဆုံး** | **၅ ခု** (staff = ကန့်သတ်မရှိ) | Spam / အချိန်ရှည် booking အတု ကာ · D-BKG-03 |
| 9 | **Permission (ADR-011)** — Customers = `customer.view / create / update / delete` · Bookings = `booking.view / create / update` (ရွှေ့) `/ delete` (cancel) · Cancel reasons (Settings) = `booking_cancel_reason.view / create / update / delete` · **Barber seed** = `booking.view` + `customer.view` + `customer.create`; **ကိုယ့်ဆီ booking** (ကိုယ့်နာမည်နဲ့) ကို code မလိုဘဲ ဖန်တီး / ရွှေ့ / cancel / snooze | အတိုင်း | D-BKG-13 (barber ရွှေ့ / cancel ရ) + D-ROLE-07 (own work + branch view) · customer = company-level (D-CUS-01) → code ရှိရင် customer အကုန် မြင်; booking / sale history ကတော့ ကိုယ့် branch ပဲ |
| 10 | Booking ထဲက **customer နာမည် / ဖုန်း** ကို staff ပြင်ခွင့် | **နာမည် = ပြင်ရ** (ဒီ booking ပဲ — F-BK-19); **ဖုန်း = မပြင်** — မှားရင် cancel ("Other: ဖုန်းမှား") + booking အသစ် | ဖုန်း = customer identity (D-CUS-02); history / active-booking rule မရှုပ်အောင် |

**ဖြေပြီးရင် Claude လုပ်မယ့်အစဉ် (တစ်ခါတည်း):** (1) Appendix A — D-API-04 draft + အဖြေ note (D-BKG-12 cutoff · D-BKG-17 · D-CUS-07 / 08 · REC-36) (2) `docs/api/03-customers-booking.md` v1.0 + `openapi/part3-customers-booking.yaml` (staff customers / bookings / calendar feed / no-show · public options / availability / create / manage · permission code · realtime · error) — validate (3) independent review (4) review update + zip → owner lock (D-API-04) → Part 4 (Visits, Sales & Payments) sheet။

**✅ Owner အဖြေ (01/Oct ည):** "API Part 3 question sheet **အကုန် OK**" → #1–#10 = Claude default အတိုင်း → **API Part 3 draft v1.0** (`api/api-03-customers-booking-v1.0.md` + `api/openapi/part3-customers-booking-v1.0.yaml`) — အဖြေ တစ်ခုချင်း ဘယ်မှာ ထည့်လဲ = Part 3 §12 · Appendix A note = §0.2 (ဍ) · independent review = §12.9 · lock = **§0.8**။ *(#9 ထဲက customer = company-level ကို owner ရဲ့ scope A — ADR-012 "shared" — နဲ့ ပေါင်း)*

### 0.8 API Part 3–8 + architecture — question sheet တစ်ခုတည်း — ✅ ဖြေပြီး 02/Oct 00:06 *(sheet = 01/Oct 23:30 · owner: "confirm တိုင်း zip မပေးနဲ့ — API မေးခွန်း အကုန် မေး၊ ဖြေပြီးမှ API + architecture တစ်ခါတည်း")*

**✅ Owner အဖြေ (02/Oct 00:06): "အကုန်လုံး OK"** → A1–A3 · B1–B12 · C1–C12 · D1–D9 · E1–E8 · F1–F12 · G · H = **Default column အတိုင်း အကုန် 🔒** → ဖိုင် ထုတ်ပြီး (§0.2 (ဎ), §11.9)။ မူလ sheet ကို အောက်မှာ record အဖြစ် ဆက်ထား — API ဖိုင်တွေထဲက "owner B4", "owner E3" … = ဒီ sheet ရဲ့ နံပါတ်။

**ဖြေပုံ:** default အတိုင်း OK ဆို **"အကုန် OK"**; ပြောင်းချင်တာပဲ **နံပါတ် + အဖြေ** (ဥပမာ "B4 = booking ဈေး", "F4 = server disk")။ 🔒 lock ပြီးသားတွေ မမေးပါ။ ဖြေပြီးရင် ထပ်မမေးဘဲ API Part 3–8 + architecture + review ကို **zip တစ်ခုတည်း** ထုတ်ပါမယ် (ရေးရင်း 🔒 ဆန့်ကျင်ချက် အသစ် တွေ့မှပဲ ရပ်မေးမယ် — D-PLT-13)။

**A. Part 3 lock (Customers & Booking)**

| # | မေးခွန်း | Default |
| --- | --- | --- |
| A1 | API Part 3 v1.0 ကို lock | Lock |
| A2 | Reschedule မှာ service ဖြုတ်ရင် (Haircut + Dye → Haircut) booking item row | ဖျက် + audit မှာ အပြည့်မှတ် (DB column မထပ်) |
| A3 | Manager seed — ကိုယ့် branch service ရောင်း / ကြာချိန် + branch setting override ပြင်ရ | ဒီအတိုင်း |

**B. Part 4 — Walk-in / Checkout / Payment**

| # | မေးခွန်း (ဥပမာ) | Default |
| --- | --- | --- |
| B1 | Barber တစ်ယောက် customer ၂ ယောက် တပြိုင်နက် (ဆိုးဆေး စောင့်တုန်း walk-in ညှပ်) | ရ — ငွေမရှင်းရသေးတဲ့ visit ရှိမှပဲ ပိတ် (🔒 D-VIS-07) |
| B2 | Ko Aung အိမ်ပြန်သွား၊ သူ့ visit "ငွေမရှင်းရသေး" — ကိုယ်စား ငွေလက်ခံ / Incomplete | Admin + Manager (reason) |
| B3 | "ငွေလက်ခံသူ" ရွေးစာရင်း | ဒီ branch ဝန်ထမ်း အကုန် (clock-in ထားသူ အပေါ်) |
| B4 | Booking = Ko Aung ဈေး 8,000၊ တကယ်လုပ်တာ Ko Min (6,000) | ၂ ခုထဲ **နည်းတဲ့ဈေး** |
| B5 | ဈေး 7,000၊ KBZPay 10,000 လွှဲ၊ 3,000 cash ပြန်အမ်း | ရ — "ပိုငွေ ပြန်အမ်း" auto မှတ် (ဝင်ငွေ / commission မထိ) |
| B6 | % discount အပိုင်းအစ — 6,500 ရဲ့ 15% = 975 | discount ကို **၁၀၀ ပြည့်** (1,000 → 5,500) |
| B7 | Discount — (a) code ဖန်တီး = Admin ပဲ (b) ကိုယ့် request ကိုယ် approve ✖ (c) request = အဲ့ branch approve ခွင့်ရှိသူ အကုန်ဆီ (d) approve ပြီး service ထပ်ထည့်ရင် discount မတိုး | ၄ ချက်လုံး ဒီအတိုင်း |
| B8 | Refund — (a) product line တိုင်း "စင်ပေါ် ပြန်တင် / ပျက်စီး" ရွေး (b) sale လုပ်ခဲ့တဲ့ branch မှာပဲ (c) KBZPay နဲ့ ဝယ်တာ cash နဲ့ ပြန်ပေးရ | ၃ ချက်လုံး ဒီအတိုင်း |
| B9 | စာရင်းပိတ်ပြီးတဲ့နေ့ — FINISH / payment နည်း / လက်ခံသူ ပြောင်း · payroll finalize ပြီး barber ပြောင်း | ✖ — admin reopen / manual payroll line |
| B10 | FINISH ပြီးမှ — KBZPay ref စာလုံးမှား / customer မှား · ဈေးနည်းယူမိ (7,000 → 10,000) | ref + customer = reason နဲ့ တိုက်ရိုက်ပြင် (ငွေ မထိ — D-VIS-08 ချွင်းချက်) · ကွာငွေ = "ကွာငွေ sale" အသစ် (မူလ barber) |
| B11 | Late entry နောက်ကြောင်း ဘယ်နှရက် — 🔒 D-VIS-13 "စာရင်းမပိတ်ခင်" ↔ Part 2 quote "မနေ့ထိ" ဆန့်ကျင် | D-VIS-13 အတိုင်း (မပိတ်ရသေးတဲ့ ရက်မဆို) — Part 2 ညှိ |
| B12 | Refund ခွင့် Manager · late entry ကို barber တစ်ယောက် ပိတ်ပုံ | Refund = Admin ပဲ · late entry ပိတ် = "late entry မပါတဲ့ Barber role" ပေး |

**C. Part 5 — Commission / Payroll / Attendance**

| # | မေးခွန်း (ဥပမာ) | Default |
| --- | --- | --- |
| C1 | Payroll / လစာ / advance ကို ဘယ်သူ မြင် | **Admin ပဲ** (Manager ✖ — branch scope နဲ့ ကြည့်ရုံတောင် ✖) |
| C2 | ဗီရိုကနေ advance ထုတ်ပေးခွင့် | `cashout.create` + `receivable.issue` (seed = Admin) · ကိုယ့်ကိုယ်ကို ✖ · instalment မသတ်မှတ်ရင် နောက်လ အကုန်ဖြတ် |
| C3 | Advance / loan ကို cash နဲ့ ပြန်ဆပ် | Owner / Admin လက်ထဲ (ဗီရို ✖ — DB မပြင်) |
| C4 | လစာ ပေးပုံ | run တစ်ခု = paid ရက် တစ်ရက် · ဗီရိုကနေပေးရင် "လစာပေး" cash movement (expense ထပ် ✖) |
| C5 | လလယ် ဝင် / လစာတိုး / plan ကစ (16/Oct ဝင် 300,000) | လစာ = ရက်အလိုက် ခွဲ (154,839) · commission = plan ကစရက်ကစ sale, threshold အပြည့် |
| C6 | ဖြတ်ငွေ > လစာ (gross 180,000, advance 200,000) | net 0 ထက် မလျော့ — ကျန် = နောက်လ |
| C7 | Payroll finalize အချိန် | လကုန်ပြီး + branch အကုန် နေ့တိုင်း စာရင်းပိတ်ပြီးမှ |
| C8 | Exception board — 9:04 ရောက် (grace 10 မိနစ်) | grace ကျော်မှ ပြ (မိနစ်အစစ် သိမ်း) |
| C9 | Shift ၂ ခုထဲ တစ်ခု ပျက် · စောပြန် | ပျက် = နေ့တစ်ဝက် · စောပြန် = မှတ်ပဲ (ဖြတ်ချင်ရင် setting) |
| C10 | Clock-out · branch ပြောင်း | "Clock out" ခလုတ် + GPS (QR ✖) · branch ၂ QR scan ရင် branch ၁ auto ပိတ် |
| C11 | Manager က ကိုယ့် attendance ကိုယ် excuse / ပြင် | ✖ (တခြား manager / admin) |
| C12 | Checkout commission ခန့်မှန်း (လအတွင်း 2,240,000 + ညှပ် 30,000) | အဆင့်ခွဲ = 5,500 (လကုန် payroll နဲ့ ကိုက်) |

**D. Part 6 — Stock**

| # | မေးခွန်း (ဥပမာ) | Default |
| --- | --- | --- |
| D1 | ဗီရိုငွေ 90,000 နဲ့ ပစ္စည်းဝယ် — အခု expense **၂ ခါ** ဝင် (cash out "Supplier" + purchase post) | Purchase = expense · ဗီရိုထုတ် = "ဝယ်ပြီးသား ပစ္စည်းခ" cash movement · "Supplier" = ပစ္စည်းမဟုတ်တဲ့ bill ပဲ |
| D2 | ပစ္စည်း ဘယ်သူ ဝယ်ခွင့် | Manager = ကိုယ့် branch draft · Admin = post |
| D3 | Post ပြီး မှားရိုက် (100 vs 10) | undo ✖ — stock adjust + expense ဖျက် / အသစ် · post မတိုင်ခင် စုစုပေါင်း ပြ |
| D4 | Transfer လက်ခံ | ရွေးထားတဲ့သူ (code မလို) + `transfer.receive` ရှိသူ |
| D5 | Stock အနုတ် (system 2 / ပို့ 5) | ရ — warning + flag |
| D6 | Low stock alert / threshold | Admin + အဲ့ branch manager · manager က ကိုယ့် branch threshold ပြင်ရ |
| D7 | Barber "သုံးကုန်" | product အကုန် (ဆိုင်သုံး အပေါ်) · ကိုယ်တိုင် undo ✖ |
| D8 | Stock count | system အရေအတွက် မပြဘဲ ရေ → post မတိုင်ခင် ကွာချက်ပြ · branch လုံး / category ရွေး |
| D9 | ပျောက် / ပျက် ချ | Manager post ရ · Admin ဆီ noti |

**E. Part 7 — Finance / စာရင်းပိတ်**

| # | မေးခွန်း (ဥပမာ) | Default |
| --- | --- | --- |
| E1 | ညနေ owner ငွေယူ (520,000 ထဲ 500,000) | မရေခင် Cash Out "Owner / bank ပို့" (cash movement) · အိမ်သွား barber ညလုံး ငွေကိုင် = must-return → မနက် return |
| E2 | Customer ထိုင်ခုံပေါ် ရှိတုန်း စာရင်းပိတ် | ✖ — ဒီနေ့ FINISH ဖြစ်နိုင်တဲ့ sale ရှိရင် ပိတ်မရ |
| E3 | KBZPay ကို owner မနက်မှ စစ် | ပိတ်ပြီးလည်း ✔ ရ (reopen မလို) |
| E4 | Expense / income auto-approve | company တစ်ခုလုံး approve ခွင့်ရှိသူ ထည့်မှ · ကိုယ့်ဟာ ကိုယ် ✖ |
| E5 | Cash out မှား (100,000 vs 10,000) | စာရင်းမပိတ်ခင် ပြင် / cancel (reason) |
| E6 | Manager P&L | ကိုယ့် branch ✔ — လစာ = စုစုပေါင်း တစ်ကြောင်း |
| E7 | Pending cash income (ကုလားထိုင်ဟောင်း 20,000) | ဗီရိုထဲ ရောက်ရင် expected cash ထဲ ထည့် (P&L = approve မှ) |
| E8 | 🔒 D-FIN-06 စာသားမှာ "manual cash income" မပါ ↔ DB formula ပါ | DB အတိုင်း စာသား ညှိ |

**F. Part 8 — Report / Website / Platform**

| # | မေးခွန်း (ဥပမာ) | Default |
| --- | --- | --- |
| F1 | Report ခွင့် | report ၁ ခု = code ၁ ခု · Manager = ⑦ commission/payroll ✖၊ ⑥ = E6၊ ကျန် ✔ |
| F2 | Excel / PDF export ခွင့် | `data.export` တစ်ခု — seed = Admin ပဲ |
| F3 | Export အရွယ် | Excel/CSV 50,000 row · PDF summary + 1,000 row · ကြီးရင် နောက်ကွယ် (24 နာရီ) |
| F4 | ပုံ / receipt / document သိမ်းရာ | Cloud bucket (Cloudflare R2 / Backblaze B2 — owner account, ~US$0–1/လ, international card လို) — off-site backup လည်း အဲ့မှာ |
| F5 | Go-live — Fresha ကနေ import | master data ပဲ (customer, service + ဈေး, product, employee) · history ✖ · invite = မပို့သေး |
| F6 | ဝင်ငွေ / returning customer | refund = refund ရက်မှာ နုတ် · returning = အရင် visit ရှိဖူးတဲ့ ဖုန်းပါ customer |
| F7 | Website ပြင်ခွင့် | `website.update` တစ်ခု — company scope = site အကုန် · branch scope = ကိုယ့် branch ဖွင့်ချိန် / ပိတ်ရက် |
| F8 | ပိတ်ရက်ထည့် — အဲ့ရက် booking ၆ ခု ရှိပြီး | သိမ်း + booking စာရင်းပြ (ဖုန်းဆက်ရွှေ့ · auto cancel ✖) |
| F9 | Backup restore | app ထဲ ခွင့်ပြု (reason + ရက်ရိုက် + maintenance ON) → developer script · လစဉ် restore test = auto |
| F10 | Audit log — လစာ ပြောင်းတာ Manager မြင် | ✖ |
| F11 | ဝန်ထမ်း document (မှတ်ပုံတင် / contract) | သီးသန့် code — Admin ပဲ |
| F12 | ငွေ / stock noti "admin" | အဲ့ code ကို company scope နဲ့ ကိုင်သူ (မရှိရင် company admin) |

**G. DB အသေးစား ထပ်ထည့် (column / index ပဲ — ရှိပြီးသား မပြောင်း; test ပြန် run)**

| # | ဘာထည့် | Default |
| --- | --- | --- |
| G | (a) Part 5 — manual attendance မှားရင် void (b) Part 5 — advance / repayment ၂ ခါ မှတ်မိ ကာ (c) Part 6 — "သုံးကုန်" ၂ ခါ နှိပ်မိ ကာ (d) Part 7 — cash out / return cancel (E5) + expense / income ၂ ခါ ကာ (e) Part 8 — auto restore test + system file ရှင်း (f) Part 4 — FINISH ပြီး sale ကို DB trigger နဲ့ ထပ်ကာ | အကုန် ✔ |

**H. Architecture (ADR အသစ်)**

| # | ဘာ | Default |
| --- | --- | --- |
| H | (1) Receipt / payslip / report PDF = server က Chromium နဲ့ ထုတ် (မြန်မာစာ မှန်) · receipt ဖိုင် သိမ်း (reprint တူ) (2) Printer width = branch setting · auto-print OFF (REC-37) (3) File = S3 API (F4) (4) Report = live query (၁ နှစ်ထိ) (5) Job အသစ် — receipt render · stock ညစဉ် စစ် · noti / export ရှင်း | အကုန် ✔ |

*ဆုံးဖြတ်ချက် မလို — Claude ညှိမယ် (စာသား / ထပ်နေတာ):* KBZPay ref ပုံစံ = payment method ထဲ (setting ဖြုတ်) · `closing.close_roles` setting ဖြုတ် (= permission) · `site.domain` setting ဖြုတ် (= .env) · website barber အစဉ် = employee code · booking QR = Part 8 · D-PAY-04 / 05 စာသား = DB အတိုင်း။
*Go-live data (အခု မလို):* လစာ / commission plan · deduction တန်ဖိုး · opening float · product / supplier · ဖွင့်ချိန် · logo / colour · English service နာမည် (receipt) · seed matrix ★။

### 0.9 OPEN-40 — ✅ ဖြေပြီး 02/Oct 08:24 ("OPEN-40 OK") *(မေးခွန်း = v5.2.15 · 02/Oct 04:10)* — 🔒 D-DAT-05 နဲ့ ဆန့်ကျင်တာ ၃ နေရာ

**✅ Owner အဖြေ (02/Oct 08:24): "OPEN-40 OK"** → **(a) B · (b) B · (c) A** — lock + ဖိုင် ထုတ်ပြီး (v5.2.16): DB Part 5 **v1.2** + Part 7 **v1.2** (test ၃၉၃ PASS — §6.4j) · API Part 5 / 6 / 7 **v1.1** (endpoint / DTO မပြောင်း — §11.10) · system design v1.4 · admin guideline v1.6။ မူလ မေးခွန်းကို အောက်မှာ record အဖြစ် ဆက်ထား။

> API ရေးရင်း **lock ပြီးသား ဆုံးဖြတ်ချက် အချင်းချင်း ဆန့်ကျင်တာ** တစ်မျိုး တွေ့လို့ ကိုယ်တိုင် မရွေးဘဲ မေးတာပါ (D-PLT-13)။ **API / screen ပုံစံက ဘယ်ဟာ ရွေးရွေး မပြောင်း** — DB ထဲ ဘယ်လို သိမ်းမလဲပဲ ကွာတယ်၊ ဒါကြောင့် spec အဆင့်ကို မပိတ်ဆို့ပါ (အဲ့ ၃ နေရာရဲ့ mechanism ပဲ အဖြေ စောင့်)။ **အကြံပြုချက်အတိုင်း ဆို "OPEN-40 OK"** လို့ ဖြေရုံပါ။

**ပြဿနာ:** 🔒 D-DAT-05 = "transaction data ကို လုံးဝ မဖျက်ရ (hard delete ✖)"။ ဒါပေမဲ့ —

| # | ဘယ်မှာ ဖြစ်လဲ (ဥပမာ) | A | B | အကြံပြု + ဘာကြောင့် |
| --- | --- | --- | --- | --- |
| **(a)** | **Payroll reopen** — Oct payroll finalize လုပ်တော့ P&L ထဲ လစာ expense ဝင်။ မှားလို့ reopen → အဲ့ expense row တွေ ဖယ်ပြီး ပြန်တွက်ရမယ် (🔒 F-P5-09 "results ဖျက် ပြန်တွက်")။ DB (Part 7) က လစာ expense တိုင်း payroll row ကို ချိတ်ထားရမယ် ဆိုလို့ "ဖျက်ပြီး" အမှတ်နဲ့ ထားခဲ့လို့ မရ | row ကို တကယ်ဖျက် (audit log ထဲ မူရင်း ကျန်) — D-DAT-05 ရဲ့ ချွင်းချက် အဖြစ် ရေး | **DB Part 7 v1.2** (အသေးစား ၂ ချက် — FK `ON DELETE SET NULL` + CHECK): reopen မှာ expense ကို **"ဖျက်ပြီး" အမှတ် (soft delete — reason "Payroll reopened")** နဲ့ ထားခဲ့၊ finalize ပြန်လုပ်ရင် row အသစ် | **B** — D-DAT-05 မချိုး; Finance list မှာ "Payroll reopened" ဆိုပြီး မြင်နေရ; ပြင်ရတာ column အသစ် မလို |
| **(b)** | **မှားထည့်မိတဲ့ လစာ row / commission plan ချိတ်တာ** — ဥပမာ Ko Aung ကို plan မှားချိတ်မိ၊ payroll မသုံးရသေး → ဖြုတ်ချင်။ အဲ့ table ၂ ခုမှာ "archive" column မရှိ | row ကို တကယ်ဖျက် (audit ကျန်) | **DB Part 5 v1.2**: table ၂ ခုမှာ `archived_at` (+ by + reason) ထည့် — **Part 2 v1.3 မှာ owner approve ခဲ့တဲ့ ပုံစံ အတူတူ** | **B** — ပုံစံ တစ်မျိုးတည်း; ဘာ ဖြုတ်ခဲ့လဲ screen မှာ ပြန်ကြည့်လို့ရ |
| **(c)** | **Draft purchase / transfer ထဲက line ဖြုတ်** — post မလုပ်ရသေး (stock / ငွေ မထိသေး) | ဖျက် + audit အပြည့် — **A2 (booking item) မှာ owner လက်ခံခဲ့တဲ့ ပုံစံ အတူတူ** | line တိုင်းမှာ archive column ထည့် (DB Part 6 v1.3) | **A** — draft က transaction မဖြစ်သေး; A2 နဲ့ တစ်ပုံစံတည်း; DB မပြင်ရ |

*မှတ်ချက် (မေးခွန်း မဟုတ်):* import မှာ file ပြန်တင်ရင် ရှင်းတဲ့ `import_job_rows` = staging data (transaction မဟုတ် — notification ရှင်းတာ F-P8-04 နဲ့ အမျိုးတူ)။
**"OPEN-40 OK" ဆိုရင်:** (a) B + (b) B + (c) A → DB Part 5 v1.2 + Part 7 v1.2 (test ပြန် run) + API Part 5 / 6 / 7 ထဲက ⚠️ OPEN-40 စာသား 🔒 ပြောင်း — OpenSpec ပထမ change တွေ (repo scaffold, walk-in → checkout) ကို မထိ။


### 0.10 OpenSpec အဆင့် — question sheet ၂ ခု — ✅ ဖြေပြီး 02/Oct 08:58 · 09:17 *(v5.2.16)*

> D-PLT-19 အတိုင်း — မေးခွန်း အရင်၊ အကုန် ဖြေပြီးမှ ဖိုင်။ Owner က chat အစမှာ **"OPEN-40 OK"** + rule ၁၁ ("spec ဖိုင်ထုတ်တဲ့ အချိန်မှာ experienced software engineer တစ်ယောက်လို coding guideline သေချာသတ်မှတ်") ပေး။

**Sheet 1 (08:24 မေး → 08:58 ဖြေ)**

| # | မေးခွန်း | Owner အဖြေ | ဘာဖြစ်သွားလဲ |
| --- | --- | --- | --- |
| A1 | Dev plan / OpenSpec အတွက် ထပ်ပြောချင်တာ | **"Form တစ်ခုချင်းစီ Category / Topic တစ်ခုချင်းစီ ရေးမယ် (ဥပမာ Barber, Branch, Service)"** | 🔒 D-PLT-20 — change တစ်ခု = form / topic တစ်ခု; roadmap ၇၆ row |
| A2 | Dev ၂ ယောက် ခွဲပုံ / စချိန် | **spec ဖိုင် ရတာနဲ့ စ; Dev 1 = Website + Admin Panel · Dev 2 = Admin Panel** | D-PLT-14 note · dev plan |
| B1 | Colour palette — (က) အကုန် ပေး (ခ) brand အရောင်ပဲ ပေး၊ ကျန်တာ Claude အဆိုပြု | **(ခ)** · Website = `#EEEEEE` Background · `#000000` Text · `#DC5F00` Decoration · "Admin Panel Color Pallet" ခေါင်းစဉ်အောက် **တန်ဖိုး မပါ** | D-UX-02 update · OPEN-30 ◐ (admin ★ ကျန်) · ⚠️ REC-41 (ကျန် website token အဆိုပြု) |
| B2 | Design reference ပုံ + logo | **Project folder ထဲ Website / Admin panel folder ၂ ခု ထည့်ပေးမယ် — develop ချိန် ကြည့်လို့ရလား** · **"Admin Panel က 80 % Fresha reference; ပိုပြီး အသုံးပြုရလွယ်ကူရမယ်"** | ရတယ် — `point-barber/design-reference/{website,admin-panel}/` + `README.md` index; reference ပဲ (rule မဟုတ်) — AD-META-08 · FE-VIS-01 |
| C1 | OpenSpec version 1.14.0 (`config.yaml`; `/opsx:*`) | ✔ | D-PLT-20 |
| C2 | Spec တည်ဆောက်ပုံ — change တစ်ခုချင်းက ဖြည့်၊ ID ကိုးကား | **အများစု ✔ — ဒါပေမဲ့ (1) requirement တိုင်း တကယ့်တန်ဖိုးပါတဲ့ SHALL စာကြောင်း + ID; scenario မှာ တကယ့် နာမည် / MMK / အချိန် (2) capability ၈ ခုက ကြမ်းလွန်း — business area အလိုက် ~၁၅–၁၈ ခွဲ** (auth, access, services-pricing, scheduling, leave, customers, booking, visits, sales-checkout, payments, discounts, refunds, inventory, finance-closing, commission-payroll, attendance, settings, website) | D-PLT-20 · `openspec/config.yaml` rule |
| C3 | Spec = English + proposal ထိပ် မြန်မာ အတိုချုပ် | ✔ | D-PLT-20 |
| C4 | Change ၂ (walk-in → checkout) ထဲ ဘာပါ | **အစဉ် + အကြောင်းပြချက် ✔ — ဒါပေမဲ့ ၂ ခု ခွဲ:** `add-foundation-auth-access` (Google login, session / CSRF, permission + scope guard, audit, idempotency, seed data) + `add-walkin-visit-checkout` (Today → START → COMPLETE → checkout → FINISH → receipt PDF) — "change သေးရင် review လွယ်၊ archive စော၊ test workbook ~၂၀–၃၀ case" | D-PLT-20 #7 |
| C5 | ဒီ batch မှာ ဘာထုတ် | ✔ + **ဖိုင်နေရာ:** point-sdd = spec rule ပါတဲ့ `CLAUDE.md`, `openspec/config.yaml`, change, `docs/decisions`, `docs/db`, dev plan, roadmap · app repo = coding guideline + app ရဲ့ `CLAUDE.md` | D-ARC-03 (ADR-016) |
| D1 | Coding guideline reference | ✔ | D-ENG-02 |
| D2 | စက်နဲ့ စစ်လို့ရတာ = CI fail; ကျန် = PR checklist | ✔ | D-ENG-01 |
| D3 | Tooling | ✔ | D-ENG-01 |
| D4 | Component catalogue = `/dev/ui` | ✔ | D-ENG-01 (AD-IMPL-06 ပိတ်) |
| D5 | Product repo | **`naingaunglinn/point-barber`** (app) · **`agkyawpai/point-sdd`** (SDD) — "ဘယ်လိုတွေ လုပ်လို့ရနိုင်လဲ ပြောပေး" | Claude: repo ၂ ခု ဖတ်ပြီး နည်း ၂ မျိုး ရှင်းပြ → sheet 2 #3 |

**Sheet 2 (08:58 မေး → 09:17 ဖြေ: "ကျန်တာ အိုကေတယ်" + အချက် ၂ ခု)**

| # | မေးခွန်း | Default (Claude) | Owner | ဘာဖြစ်သွားလဲ |
| --- | --- | --- | --- | --- |
| 1 | Admin panel palette (မပါလာ) — (က) website နဲ့ တူ (ခ) သီးသန့် ပေး (ဂ) မပေးသေး | (ဂ) neutral နဲ့ ဆက် | OK (default) | OPEN-30 ◐ — admin ★ ကျန် |
| 2 | Website ခလုတ် အရောင် — လိမ္မော်ပေါ် စာဖြူ 3.7:1 မမီ | ခလုတ် = အမည်း + စာဖြူ; လိမ္မော် = decoration | OK | D-UX-02 · FE-VIS-01b |
| 3 | Repo ချိတ်ပုံ | နည်း ၂ — OpenSpec store + pointer (beta ပြဿနာရှိရင် နည်း ၁) + ADR-016 | OK + **"Project run တဲ့အချိန် `point/` အောက်မှာ `point-sdd` နဲ့ `point-barber` ဘေးချင်းယှဉ်"** | D-ARC-03 · ADR-016 |
| 4 | Spec source ဖိုင်တွေ | အကုန် point-sdd `docs/` ထဲ; migration SQL = point-barber | OK | ADR-016 #2 / #3 |
| 5 | Capability ၁၈ ခုမှာ နေရာမရှိတာ | ၅ ခု ထပ်: `organization` · `notifications` · `reports-dashboards` · `audit` · `data-management` | OK | D-PLT-20 #4 (+ ⚠️ ၂ ခု — §0.11 S3) |
| 6 | Change အစဉ် | scaffold → foundation → walk-in; brief ပါ ထုတ် | OK + **"ပါရမယ့်အရာ: openspec project context · ADR-001 repo scaffold change · Shared UI component ~၃၅ ခု (AD-IMPL-02 — dev ၂ ယောက်လုံး သုံးမှာမို့ အရင်ဆုံး) · walk-in → checkout vertical slice"** | `add-shared-ui-components` ထပ်ထည့် → change ၄ ခု |
| 7 | API ကို ဘယ်သူ ရေး | change တစ်ခုကို dev တစ်ယောက် API + screen အပြည့် | OK | D-PLT-14 note |
| 8 | Repo ၂ ခု public | private ပြောင်း | OK | ✋ ACT-09 |
| 9 | Browser tester login (system က passwordless) | Email OTP ကို Mailpit ကနေ ဖတ်; password login အတု ✖ | OK | D-ENG-01 · harness `getLoginEmail` / `fetchLoginCode` |

**ထုတ်ခဲ့တာ (v5.2.16 batch — zip တစ်ခုတည်း):** `point-sdd/` — `CLAUDE.md` · `openspec/config.yaml` · change ၄ ခု + brief ၄ ခု · `docs/decisions/` (ဒီဖိုင် + `decision-register.md`) · `docs/db/` (zip v8) · `docs/ux/` (v1.6 / v1.5) · `docs/api/` (Part 5 / 6 / 7 v1.1) · `docs/adr/` (+ ADR-016) · `docs/architecture/` (v1.4) · `docs/plan/` (dev-plan · roadmap · spec-fixtures) · workflow guide / `SETUP.md` / skill update · `tools/extract-decision-register.py` — `point-barber/` — `CLAUDE.md` · `docs/engineering/coding-guideline.md` (Draft v1.0) · `openspec/config.yaml` (pointer) · `design-reference/` index · `README.md`။

### 0.11 Sheet 3: spec ရေးရင်း တွေ့တာ — ✅ ဖြေပြီး 02/Oct 13:08 ("မေးခွန်းအကုန်လုံး OK — Default အတိုင်း") *(sheet = v5.2.16 · 02/Oct 13:00 · OPEN-41)*

> Spec ၄ ခု ရေးရင်း + independent review လုပ်ရင်း **lock ထဲမှာ မပါတာ / စာသား ၂ နေရာ မကိုက်တာ** တွေ့လို့ ကိုယ်တိုင် မရွေးဘဲ မေးတာပါ (D-PLT-11 / D-PLT-13)။ Change တစ်ခုချင်းရဲ့ `proposal.md` → "Open questions" မှာလည်း ဒီ S-နံပါတ်တွေနဲ့ ပါတယ်။
> **✅ Owner အဖြေ (02/Oct/2026 13:08):** *"မေးခွန်းအကုန်လုံး OK တယ် Default အရင်သတ်မှတ်ထားတဲ့အတိုင်းပဲသွားမယ်။"* → **S1–S18 အကုန် "Default" column အတိုင်း 🔒**; (B) မှတ်တမ်း R1–R14 လည်း ယူထားတဲ့ ပုံစံအတိုင်း။ အောက်က ဇယားတွေက မေးခဲ့တဲ့အတိုင်း မှတ်တမ်းအဖြစ် ထားတယ် — **"Default + ဘာကြောင့်" column = ဆုံးဖြတ်ချက်**။ OPEN-41 ✅။
> **13:07 မှာ owner ပြောတာ:** *"ငါ claude code ကိုပဲရေးခိုင်းရင်တောင် အဲ့လောက်ကြာမှာလား. ငါတို့ကစစ်ပဲစစ်မှာလေ။"* → လုပ်ပုံ = **Claude Code က ရေး၊ developer ၂ ယောက်က စစ်** (D-PLT-14 note; dev-plan §6 — S1 ရဲ့ ကိန်းဂဏန်းတွေက developer ကိုယ်တိုင်ရေးတဲ့ ပုံစံနဲ့ တွက်ထားတာ; ဒီလုပ်ပုံနဲ့ ခန့်မှန်း V1 ~၁ လခွဲ–၂ လခွဲ)။
> **13:08 အဖြေထဲ မပါခဲ့တာ:** REC-41 (website ကျန်အရောင်) · REC-42 (coding guideline approve) → **✅ owner 02/Oct 13:46 "Ok ပါတယ်" (v5.2.18)** · ကျန်နေဆဲ = ★ OPEN-30 admin palette · ✋ ACT-09 — (C) မှာ။

**အဖြေကို ဘယ်မှာ မှတ်ထားလဲ**

| # | ဆုံးဖြတ်ချက် (အတို) | မှတ်ထားတဲ့နေရာ |
| --- | --- | --- |
| S1 | "တစ်လ" = pilot အထိ ပစ်မှတ်; V1 ရက် = ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ | D-PLT-14 · dev-plan v1.1 §6 |
| S2 | ပထမ change ၄ ခု ဒီအတိုင်း — PR ခွဲ merge | D-PLT-20 · proposal ၄ ခု |
| S3 | capability ၂၅ ခု 🔒 | D-PLT-20 · `openspec/config.yaml` |
| S4 | 500 = `internal_error` | API Part 0 v1.6 API-ERR-02 |
| S5 | field-level code = Zod နာမည် + `email_invalid` / `otp_format` | API Part 0 v1.6 API-ERR-03 · Part 1 v1.6 |
| S6 | ပထမ admin = server ပေါ်က operator command (admin မရှိသေးခင်ပဲ ရ; `--code` မဖြစ်မနေ) | API Part 1 v1.6 **P1-RULE-14** |
| S7 | START chip ၆ ခု = catalogue အစဉ်; "Frequent here" V1 မပါ | admin guideline v1.7 AD-POS-03 / 05 |
| S8 | reason field = Part 4 ပုံစံ | API Part 0 v1.6 API-DATA-11 |
| S9 | code စစ်တာ ၁၀ ခါ / နာရီ / IP | API Part 0 v1.6 API-LIM-02 · Part 1 P1-RULE-03 |
| S10 | lock အဖြေ စာသားအတိုင်း | API Part 1 v1.6 P1-RULE-03 note |
| S11 | archive row = audit log မှာပဲ | D-DAT-05 note (API Part 5 မပြောင်း) |
| S12 | scope ပြင်ပ = `forbidden`; `out_of_scope` = part က နာမည်ပေးထားမှ | API Part 0 v1.6 API-PERM-03 |
| S13 | `permission.sync` | API Part 1 v1.6 P1-RULE-10 |
| S14 | browser တစ်ခုမှာ ထပ် login → အရင် session ပိတ် | API Part 1 v1.6 **P1-RULE-15** |
| S15 | palette မရခင် focus ring = စာအရောင်, input ဘောင် = မီးခိုးရင့် | admin v1.7 AD-VIS-03 · frontend v1.6 FE-VIS-01a note |
| S16 | pilot မတိုင်ခင် server + pilot data + late entry | D-PLT-20 #7 note · roadmap pilot gate · D-VIS-13 |
| S17 | `correction_path` မပါတဲ့ case ၂ ခု | API Part 4 v1.1 P4-RULE-01 |
| S18 | အဆိုပြုစာသားနဲ့ စ၊ owner က brief / PR မှာ ပြင် | D-PLT-20 note · brief ၂ ခုရဲ့ စာသားဇယား |

**(A1) ဆိုင်အလုပ် / အချိန် / လုံခြုံရေးကို ထိတာ — ၁၁ ချက်**

| # | ဘာလဲ (ဥပမာ) | ရွေးစရာ | Default + ဘာကြောင့် | ထိတာ |
| --- | --- | --- | --- | --- |
| **S1** | **အချိန်ဇယား.** ခန့်မှန်းချက် — ပထမ change ၄ ခု (task ၅၀၂ ခု) ≈ developer-ရက် ၄၀–၆၅; ကျန် ၇၇ ခု ≈ ၁၉၀ → **စုစုပေါင်း ~၂၃၀–၂၅၅ developer-ရက်** (နှစ်ယောက် ~၅ လခွဲ–၆ လ)။ Claude Code ကြောင့် နောက်ထပ် ၂ ဆ မြန်ရင်တောင် ~၃ လ။ 🔒 D-PLT-14 = "target တစ်လ၊ release မခွဲ" | (က) "တစ်လ" = **pilot slice** (ပထမ ၄ ခု + S16 ရဲ့ pilot လိုအပ်ချက်) ပစ်မှတ်; V1 အပြည့်ရက်ကို ပထမအပတ် velocity တိုင်းပြီးမှ သတ်မှတ် (ခ) V1 ထဲမှာ go-live အစဉ် ခွဲ (ဥပမာ counter + စာရင်းပိတ် အရင်၊ website + online booking နောက်) — D-PLT-14 ပြောင်း (ဂ) လူ ထပ်ထည့် | **(က)** — scope မဖြုတ်၊ lock မပြောင်း; ခန့်မှန်းက task အရေအတွက်ပေါ်ပဲ မူတည်လို့ တကယ့်အမြန်နှုန်း မသိခင် ရက်အသစ် မသတ်မှတ်သင့်။ **သတိ:** pilot slice တင်ကိုပဲ developer-ရက် ၄၆–၇၁ ခန့်မှန်း (တစ်လ = ၄၄) — "တစ်လ" က အမြန်ဆုံးဖြစ်မှ မီမယ့် ပစ်မှတ်; အလုပ်ခွဲဝေမှုလည်း မညီသေး (Dev 2 ဘက် ပိုများ — brief ရေးချိန် ပြန်ညှိ) | D-PLT-14 · dev-plan §6 |
| **S2** | **ပထမ change ၄ ခုရဲ့ အရွယ်.** မင်းသတ်မှတ်တဲ့ rule = ၁–၃ ရက် / test case ~၂၀–၃၀; ဒါပေမဲ့ မင်းသတ်မှတ်တဲ့ scope အတိုင်း အပြည့်ရေးတော့ — scaffold requirement ၂၀ / scenario ၇၀ / task ၉၄ · shared UI ၇၆ / ၂၂၈ / ၁၆၉ · foundation ၄၃ / ၂၀၃ / ၉၄ · walk-in ၃၉ / ၂၀၃ / ၁၄၅ (စုစုပေါင်း ၁၇၈ / ၇၀၄ / ၅၀၂) | (A) ဒီအတိုင်း ထား — change တစ်ခုကို **PR ခွဲ merge** (scaffold ၈ ခု၊ ကျန် ၃ ခုစီ): အစောပိုင်း PR တွေက CI + review နဲ့ merge၊ **နောက်ဆုံး PR မှာ test workbook ထုတ် / စမ်း / NG ပြင်ပြီးမှ merge** (CG-GIT-05; shared UI ကတော့ PR တိုင်းမှာ စမ်း) (B) change ၁၂–၁၅ ခု ပြန်ခွဲ (requirement စာသား မပြောင်း — folder ပဲ ခွဲ) | **(A)** — story တစ်ခုလုံး တစ်နေရာတည်း; PR ခွဲပုံ tasks.md မှာ ပါပြီး။ Review လုပ်ရ ခက်တယ်ထင်ရင် (B) — ပြောရုံပဲ၊ ပြန်ခွဲပေးမယ် | D-PLT-20 #2 · change ၄ ခုလုံး |
| **S6** | **ပထမဆုံး admin ကို ဘယ်လို ဖန်တီးမလဲ** — ဘယ်သူမှ login မဝင်ရသေးခင် screen ကနေ ဖန်တီးလို့ မရ | (က) server ပေါ်မှာ operator က run တဲ့ command (`docker compose exec api node dist/cli/admin-create.js --email … --name-mm … --code …`) — **admin တစ်ယောက်မှ မရှိသေးခင်ပဲ အလုပ်လုပ်**၊ ရှိပြီးရင် ငြင်း; audit မှတ် (ခ) ပထမ import | **(က)** — HTTP endpoint မဟုတ်လို့ အပြင်က ခေါ်လို့ မရ; admin ရှိပြီးရင် ထပ်ဖန်တီးလို့ မရလို့ လုံခြုံ။ မဖြေရင် ဘယ် environment မှာမှ admin မရှိ | foundation |
| **S7** | **"Frequent here"** (ဒီဆိုင်ခွဲမှာ အသုံးအများဆုံး service chip ၆ ခု — AD-POS-03 / 05)။ ဘယ် API ကမှ "အသုံးအများဆုံး" အစဉ် မပေး | (က) V1 = admin စီထားတဲ့ catalogue အစဉ်အတိုင်း ပထမ ၆ ခု; picker မှာ "Frequent here" အပိုင်း မပြ (ခ) ranking rule သတ်မှတ် (ဥပမာ နောက်ဆုံး ၃၀ ရက် အရေအတွက်) — API အသေးစား ထပ်ထည့် | **(က)** — pilot အတွက် လုံလောက်; admin က အစဉ် ပြင်လို့ရ | walk-in |
| **S9** | **Email code စစ်တဲ့နေရာမှာ စက်တစ်လုံး (IP) အလိုက် ကန့်သတ်ချက် မရှိ** (code တောင်းတာမှာပဲ ၁၀ / နာရီ ရှိ; စစ်တာမှာ "၅ ခါ မှား → ၂၀ မိနစ် lock" ပဲ) — လူဆိုးတစ်ယောက်က ဝန်ထမ်း email တိုင်းကို ၂၀ မိနစ်တစ်ခါ lock ချလို့ရ၊ audit row အကန့်အသတ်မရှိ တိုး | (က) စစ်တာလည်း ၁၀ ခါ / နာရီ / IP (ခ) မထည့် | **(က)** — လုံခြုံရေး; ဝန်ထမ်း ပုံမှန်သုံးတာ မထိ | foundation · API-LIM-02 |
| **S10** | **Lock ဖြစ်တဲ့ အဖြေက "ဒီ email ရှိတယ်" လို့ ပေါ်စေတယ်** — တကယ့် email = ၅ ခါမှားရင် "lock ဖြစ်ပြီ"; မရှိတဲ့ email = "code မှား" အမြဲ | (က) စာသားအတိုင်း ထား (ခ) ဘယ် email မဆို ၅ ခါမှားရင် "lock ဖြစ်ပြီ" ပြန် | **(က)** — ဝန်ထမ်း ၁၅ ယောက်၊ အန္တရာယ် နည်း; ပိတ်ချင်ရင် (ခ) | foundation |
| **S11** | **Archive လုပ်ထားတဲ့ လစာ row / plan ချိတ်တာကို Pay tab မှာ ပြန်ပြမလား** (OPEN-40 b — §0.9 မှာ "screen မှာ ပြန်ကြည့်လို့ရ" လို့ ရေးခဲ့ပေမဲ့ API မှာ filter မရှိ) | (က) audit log မှာပဲ မြင်ရ (API မပြောင်း) (ခ) Pay tab မှာ "ဖြုတ်ထားတာ ပြ" filter — API Part 5 v1.2 | **(က)** — V1 ရိုးရိုး; လိုမှ (ခ) | API Part 5 (change ၄ ခုနဲ့ မဆိုင်) |
| **S14** | **Browser တစ်ခုတည်းမှာ ထပ် login ဝင်ရင်** (ဥပမာ ဆိုင်ဖုန်းတစ်လုံးမှာ Ko Aung ဝင်ထားရာကနေ Ko Min က logout မလုပ်ဘဲ ဝင်) — အရင် session ကို ဘာလုပ်မလဲ ဘယ်မှာမှ မရေးထား | (က) အရင် session ကို logout အဖြစ် ပိတ် (ခ) ဒီအတိုင်း ထား (သုံးမရတော့ပေမဲ့ "My devices" စာရင်းမှာ ကျန်) | **(က)** — စက်တစ်လုံး = session တစ်ခု; စာရင်း ရှင်း | foundation |
| **S15** | **Admin panel မှာ focus ring နဲ့ input ဘောင် မထင်ရှား** — admin အရောင် မရသေးလို့ မီးခိုး (neutral) သုံးထားရ; "neutral ကို မပြင်နဲ့" (AD-VIS-03) ↔ "focus ring / input ဘောင် ထင်ရှားရမယ် 3:1" (AD-A11Y-02 / AD-VIS-04) မကိုက်။ Website (`#EEEEEE`) မှာ input ဘောင် လုံးဝ မမြင်ရ | (A) palette မရခင် focus ring = စာအရောင် (အမည်း)၊ input ဘောင် = မီးခိုးရင့် (ရှိပြီးသား neutral token ပဲ — အရောင်အသစ် မတီထွင်) (B) ဒီအတိုင်း ထား၊ palette ရမှ ပြင် | **(A)** — keyboard / မျက်စိအားနည်းသူ သုံးလို့ရ; `tokens.css` ၂ ကြောင်းပဲ | shared UI |
| **S16** | **Pilot လိုအပ်ချက်.** ပထမ change ၄ ခုတည်းနဲ့ ဆိုင်မှာ မစမ်းနိုင် — (၁) server မရှိသေး (၂) တကယ့် branch / barber / service / ဈေး ထည့်တဲ့ screen တွေ မရှိသေး (fixture က test လူတွေ) (၃) မီးပျက် / internet ပြတ်ရင် စာရွက်မှာ ရေးပြီး နောက်မှ ထည့်တဲ့ "Late entry" (D-VIS-13) မပါသေး။ Pilot မှာ **browser + Google login** ပဲ — ဖုန်းထဲ install လုပ်ထားတဲ့ app / iPhone Home-Screen icon ကနေ login မရသေး | (က) pilot မတိုင်ခင် ၃ ခု ဆောက်: `add-staging-deploy` + `add-pilot-data-seed` (pilot branch တစ်ခုအတွက် data ကို script နဲ့ ထည့် — တန်ဖိုးတွေ owner ပေး) + `add-late-entry` (≈ developer-ရက် ၅–၇ ထပ်) (ခ) late entry မပါဘဲ pilot — စာရွက်မှတ်တမ်းကို system ထဲ မထည့်နိုင်သေး (စာရင်း မပြည့်) | **(က)** — D-VIS-13 အတိုင်း; "ပုံမှန် walk-in အဖြစ် နောက်မှ ထည့်" လို ကြားဖြတ် rule မထား (အချိန် / စာရင်းပိတ် မှားနိုင်) | walk-in · roadmap #5 / #78 / #20 · D-PLT-20 #7 ("… walk-in → pilot" ကြားမှာ ဒီ ၃ ခု ဝင်) |
| **S18** | **Screen / email စာသား အသစ်** (English + မြန်မာ) — guideline မှာ မပါတဲ့ စာတွေ: login email (ခေါင်းစဉ် / စာကိုယ်)၊ error စာ၊ "This field is required." လို form စာ၊ Today / checkout စာ၊ receipt label၊ offline help စသည်။ Claude က မတီထွင်ရလို့ **အဆိုပြုချက်** အဖြစ် brief ထဲ ဇယားနဲ့ ရေးထား (`docs/briefs/add-shared-ui-components.md` → "Proposed texts" · `add-foundation-auth-access.md` → "Texts for the owner"); walk-in စာသားက PR မှာ ရေး | (က) အဆိုပြုစာသားနဲ့ စ — owner က brief / PR မှာ ဖတ်ပြီး ပြင် (key / အလုပ်လုပ်ပုံ မပြောင်း၊ စာသားပဲ ပြောင်း) (ခ) owner က အကုန် အရင်စစ်ပြီးမှ code စ | **(က)** — စာသားပြင်တာ ဘာသာစကားဖိုင် တစ်ကြောင်းပဲ; code ကို မစောင့်ရ | shared UI · foundation · walk-in |

**(A2) နည်းပညာ အတွင်းရေး — ဆိုင်အလုပ်ကို မထိ (developer lead အနေနဲ့ ဖြေ) — ၇ ချက်**

| # | ရိုးရိုးပြောရရင် | ရွေးစရာ | Default + ဘာကြောင့် | ထိတာ |
| --- | --- | --- | --- | --- |
| **S3** | Spec ဖိုင်ထားတဲ့ **folder နာမည် ၂ ခု ထပ်ထည့်** — `platform-runtime` (health, error ပုံစံ, routing, idempotency) နဲ့ `ui-foundation` (token, formatter, shared component)။ မင်းစာရင်း ၂၃ ခုထဲ ထားစရာ မရှိလို့ | OK / နာမည်ပြောင်း / ရှိပြီးသားထဲ ထည့် | **OK** (စုစုပေါင်း ၂၅) | D-PLT-20 #4 · change ၄ ခုလုံး (requirement ထားတာ = scaffold · shared UI · foundation) |
| **S4** | Server ထဲ မမျှော်လင့်တဲ့ အမှား (HTTP 500) ဖြစ်ရင် ပြမယ့် စာကြောင်းရဲ့ **အတွင်းနာမည်** — API Part 0 စာရင်းမှာ မရှိ | `internal_error` / တခြားနာမည် | **`internal_error`** → API Part 0 v1.6 မှာ row ထည့် | scaffold |
| **S5** | Form အကွက် အမှား (ရှည်လွန်း / တိုလွန်း / အမျိုးအစားမှား / email မဟုတ် / ဂဏန်း ၈ လုံး မဟုတ်) ရဲ့ **အတွင်းနာမည် စာရင်း** မရှိ | (က) validation library (Zod) ရဲ့ နာမည်အတိုင်း (`too_small`, `too_big`, `invalid_type`) + `email_invalid`, `otp_format`; "မဖြည့်ရသေး" / "ရက်စွဲမှား" က screen ဘက်စာပဲ (ခ) ကိုယ်ပိုင် စာရင်း | **(က)** — ရှိပြီးသား `phone_invalid` နဲ့ ပုံစံတူ; စာရင်း ထပ်မထိန်းရ | scaffold · shared UI · foundation |
| **S8** | "အကြောင်းပြချက်" ပို့တဲ့ **field နာမည်** ၂ နေရာ မကိုက် — API Part 0 (API-DATA-11) = `{ reason_id?, reason_code?, note? }`; Part 4 OpenAPI = `{ "reason": "…" }` / `added_reason` / `override_reason` | Part 4 ပုံစံ ယူပြီး Part 0 စာသား ညှိ / ပြောင်းပြန် | **Part 4 ပုံစံ** (endpoint ကို သတ်မှတ်တဲ့ ဖိုင်) → Part 0 v1.6 စာသား ညှိ; reason dialog component က ဘယ်ဟာ ရွေးရွေး မပြောင်း | shared UI · walk-in |
| **S12** | Permission ရှိပေမဲ့ **ကိုယ့် branch မဟုတ်တာ** ကို လုပ်ရင် ပြန်မယ့် အမှားနာမည် — Part 0 က `forbidden`၊ တချို့ part က `out_of_scope` | (က) ပုံမှန် `forbidden`; part ရဲ့ endpoint စာသားက `out_of_scope` လို့ နာမည်ပေးထားတဲ့နေရာမှာပဲ `out_of_scope` (ခ) အကုန် `out_of_scope` | **(က)** — ဖိုင်တွေရဲ့ စာသားအတိုင်း; ဘာမှ မပြောင်းရ | foundation |
| **S13** | Permission စာရင်း sync လုပ်တာကို audit log မှာ မှတ်ရမယ် (D-ROLE-08) — **action နာမည်** မရှိ | `permission.sync` / တခြားနာမည် | **`permission.sync`** → API Part 1 v1.6 စာရင်းမှာ ထည့် | foundation |
| **S17** | ပိတ်ပြီးသား (FINISHED) sale မှာ payment ထပ်ထည့်တာ / ပယ်ပြီးသား (CANCELLED) sale ကို ပြင်တာ ငြင်းတဲ့အခါ **"ဘယ်လမ်းနဲ့ ပြင်ရမလဲ" အညွှန်း (`correction_path`)** — rule (P4-RULE-01) မှာ ဒီ ၂ case မပါ | (က) အညွှန်း မထည့် (ခ) တန်ဖိုး သတ်မှတ် | **(က)** — rule မှာ မပါတာ မတီထွင်; ကျန် case တွေ rule အတိုင်း | walk-in |

**(B) မှတ်တမ်း — ယူထားတဲ့ ပုံစံ (lock ဘာမှ မပြောင်း; မှားရင် ပြော)**

| # | တွေ့တာ | ယူထားတဲ့ ပုံစံ |
| --- | --- | --- |
| R1 | CSRF header (`X-Requested-With`) — Part 0 က "ပြောင်းလဲတဲ့ request တိုင်း" လို့ ဆို; Part 1 OpenAPI မှာ code တောင်း / စစ် endpoint ၂ ခုအတွက် မရေးထား | **လို** (Part 0 က အထက်) — OpenAPI ကို နောက် version မှာ ဖြည့် |
| R2 | Manager seed — Part 1 က `employee.update` / `employee.branch_assign` ကို "Manager if the owner wants" လို့ ရေး | **မပေးထား** (code ၆ ခုပဲ) — go-live မတိုင်ခင် seed matrix စစ်တဲ့အခါ admin က ✔ လို့ရ |
| R3 | Pilot မှာ email code မရောက်နိုင် (domain မရှိသေး — D-ARC-02) ဒါပေမဲ့ login screen မှာ ရွေးစရာ ၂ ခုလုံး ပြ (AD-LOGIN-01) | **၂ ခုလုံး ပြ** — pilot မှာ Google နဲ့ပဲ ဝင် |
| R4 | Session cookie "ရက် ၃၀ ကျော်ရင် ပြန်ထုတ်" — DB မှာ ထုတ်ချိန် column မရှိ | DB မပြင် — session စတဲ့ရက်ကနေ ရက် ၃၀ တစ်ခါ တွက် |
| R5 | "ကိုယ်စား FINISH" (`sale.finish_override`) — screen က နောက် change; ဒါပေမဲ့ API guard က lock ထားတဲ့ ပုံစံ တစ်ခုတည်း | API က code ကို လက်ခံ; screen မပြသေး |
| R6 | DB Part 4 comment "Σ payments = total at FINISH" ↔ B5 (KBZPay ပိုလွှဲ → အမ်းငွေ) | D-PAY-05 အတိုင်း; comment ကို နောက် DB note မှာ ပြင် (constraint မထိ) |
| R7 | Cash "customer ပေးငွေ" (10,000 ပေး 8,000 ကျ) — Part 4 က မသိမ်း | screen မှာ အမ်းငွေ 2,000 တွက်ပြရုံ; payment = ကျသင့်ငွေ 8,000 ပဲ |
| R8 | Receipt အောက်ခြေ "ကျေးဇူးတင်စာ" (`receipt.thank_you_text`) — default တန်ဖိုး ဘယ်မှာမှ မရှိ | setting store မလာခင် မပြ |
| R9 | Guideline ဥပမာ `Tue, 30/Sep/2026` / `Tue, 07/Oct/2026` — တကယ်က ဗုဒ္ဓဟူးနေ့ | ✅ ပြင်ပြီး (admin v1.6 / frontend v1.5 — `Wed` / `ဗုဒ္ဓဟူး`); rule မပြောင်း |
| R10 | Neutral (မီးခိုး) အရောင်နဲ့ status badge အရောင် မကွဲ | icon + စာနဲ့ ခွဲ (AD-A11Y-03); admin palette ရမှ ပြေ (OPEN-30)။ Focus ring / input ဘောင် = S15 |
| R11 | ငွေအကွက်မှာ ဒသမ (`.`) နှိပ်ရင် — AD-FORM-11 "ကိန်းပြည့်ပဲ" | `.` ကို လျစ်လျူရှု (`7000` `.` `50` → `700,050` ဖြစ်သွားနိုင် — အောက်က format ပြထားတဲ့ preview မှာ မြင်ရ); ဒသမပါတဲ့ စာကို paste လုပ်ရင် တစ်ခုလုံး ငြင်း။ မကြိုက်ရင် ပြော ("`.` နှိပ်ရင် error ပြ" လို့ ပြောင်းလို့ရ) |
| R12 | Receipt ကို screen မှာ ကြည့်တာ (`format=json`) က လက်ရှိ branch စာသားနဲ့; PDF / ပုံ က ထုတ်ချိန်က အတိုင်း အသေ (P4-RULE-18) | branch လိပ်စာ ပြင်ပြီးရင် screen က အသစ်၊ PDF က အဟောင်း — **မှတ်တမ်း = PDF** |
| R13 | Foundation မှာ "branch scope စစ်တာ" ပြဖို့ endpoint — employee list (P1.EMP.01) ကို တစ်ပိုင်းတစ်စ ဆောက်ရင် lock ထားတဲ့ parameter တွေ ငြင်းရမယ် | P1.EMP.01 ကို `add-employee-management` မှာ အပြည့်ဆောက်; ဒီ change က P1.EMP.06 (employee တစ်ယောက် ဖတ်) ကို အပြည့် ဆောက် |
| R14 | "Request တိုင်း transaction တစ်ခု" (API-AUD-01) ကို စာသားအတိုင်းဆို ဖတ်ရုံ request ပါ transaction ဖွင့်ရ | ပြောင်းလဲမှု လုပ်တဲ့ business action တစ်ခု = transaction တစ်ခု (service က ဖွင့်); ရေးသူ / session / request id ကို အဲ့ transaction ထဲ သတ်မှတ် — audit trigger အတွက် အာမခံချက် မပြောင်း |

**(C) Owner ပေး / လုပ်ရန် (ဆုံးဖြတ်ချက် မဟုတ်)** — *v5.2.18: coding guideline "OK" ✅ + website ကျန် token "OK" ✅ (02/Oct 13:46); ကျန်တာတွေ ကျန်နေဆဲ* — ✋ **ACT-09 repo ၂ ခု private** (push မလုပ်ခင်) + **GitHub plan** (private repo မှာ `main` ကို protect လုပ်ဖို့ အခပေး plan လို — repo ၂ ခုက account ၂ ခုအောက်မှာ; မရခင် လက်နဲ့ စည်းကမ်းထိန်း) · **coding guideline "OK"** (REC-42; guideline §26 မှာ ကျန် ၆ ချက် — tool version pin, coverage floor, CI က point-sdd ဖတ်ပုံ, library, GitHub plan) · **admin palette** (OPEN-30) · **website ကျန် token "OK"** (REC-41 — frontend guideline FE-VIS-01a ဇယား; အနီ / အစိမ်း / အညို ကို အလင်းအမှောင် ကွာအောင် ပြန်အဆိုပြုထား) · design reference ပုံ + `README.md` index · logo / app icon · **pilot data** (pilot branch, barber တွေရဲ့ Google email + role, service, ဈေး, KBZPay reference ပုံစံ) · pilot အတွက် Google OAuth client + server host name · ပထမ admin email။

## 1. အတိုချုပ်

> **v4 မှတ်ချက်** — ဒီ အတိုချုပ်က မူလ review (28/Sep) ပါ။ နောက်ပိုင်း ဆုံးဖြတ်ပြီးသွားတာ (§3.12) — #2 adoption → barber ကိုယ့်ဖုန်းနဲ့ real-time (D-VIS-11, D-AUTH-07) · #3 scope → **release မခွဲ၊ V1 အကုန် တစ်လ** (REC-10 ✖, D-PLT-14) · #5 accounting → 🔒 (D-FIN-02/04/06–09) · #6 backup → daily 🔒 (D-DAT-03) · #7 repo → ✅ private ဖြစ်ပုံရ · #8 branch device PIN switch → ✖ (D-AUTH-07)။

1. **Requirement ကို တစ်ခုချင်း lock လုပ်သွားတဲ့နည်း မှန်တယ်။** Booking ≠ Service Visit ≠ Sale ≠ Payment ခွဲထားတာ၊ FINISH ပြီးရင် မူရင်းကို မပြင်ဘဲ adjustment နဲ့ပဲ ပြင်တာ၊ commission/KPI ကို *တကယ်ညှပ်တဲ့သူ* နဲ့တွက်တာ၊ Permission **AND** Branch Scope ကို backend မှာ စစ်တာ — ဒါတွေက senior-level design ဖြစ်ပြီး မပြောင်းသင့်ဘူး။

2. **အကြီးဆုံး risk က feature မဟုတ်ဘဲ "ဆိုင်က တကယ်သုံးမလား" (adoption) ပါ။** Live Fresha data အရ (နောက်ဆုံး appointment ၁၀၀ ခု sample — 27/Sep) ဆိုင်က ဒီလိုအလုပ်လုပ်နေတယ် —
   - service **100%** က နာမည်မပါတဲ့ Walk-In
   - record **100%** ကို service ပြီးမှ ရိုက်တယ် (median **~7 နာရီ** နောက်ကျ)
   - **44%** ကို shared "RC Team" login နဲ့ ရိုက်တယ်
   - barber တစ်ယောက်ရဲ့ တစ်နေ့လုံးကို **sale တစ်ခုတည်း** နဲ့ ညနေဆိုင်ပိတ်ပြီးမှ checkout လုပ်တယ်

   Lock ထားတဲ့ rule အများစုက *"barber တိုင်း ကိုယ့် login နဲ့ customer တစ်ယောက်ချင်း real-time မှတ်မယ်"* လို့ ယူဆထားတယ်။ ဒါက ဆိုင်ရဲ့ အလုပ်လုပ်ပုံကို အကြီးအကျယ် ပြောင်းတာ။ Walk-in ကို စက္ကန့်ပိုင်းအတွင်း မှတ်လို့မရရင် ပြန်ပြီး "ညနေမှ စုရိုက်" ဖြစ်သွားမယ်၊ commission/KPI/closing အကုန် data မှားမယ် (§3.1)။

3. **Scope က တစ်လထဲ production quality နဲ့ မပြီးနိုင်ဘူး။** Module ~25 ခုရှိပြီ (§3.6)။ Evidence အရ ခွဲသင့်တယ် — online booking က ဒီနေ့ **0%** ဖြစ်လို့ Release 2 ကို ရွှေ့ပြီး၊ **walk-in + ငွေ + daily closing + P&L** ကို Release 1 မှာ ဦးစားပေးသင့်တယ် (§8)။

4. **Lock ထားတဲ့ ဆုံးဖြတ်ချက်အချင်းချင်း ဆန့်ကျင်နေတာ / မရှင်းတာ ၁၁ ခု ရှိတယ်** — ဥပမာ "Payment pending မရှိ" (P275) နဲ့ "Pending / Needs Verification" (R355) (§3.7)။ *29/Sep: ၅ ခုက "user lock > ChatGPT စာသား" precedence နဲ့ ဖြေရှင်းပြီးသား (§3.0.3)၊ ကျန်တာ REC / OPEN အဖြစ် register ထဲမှာ။*

5. **Accounting အမှား ၂ ခု ရှိတယ်** — Staff Advance ကို expense အဖြစ်ထားတာနဲ့ Salary expense ကို net salary နဲ့ ထည့်တာ။ ဒီအတိုင်းဆို P&L မှားမယ်။ ပြီးတော့ Daily Closing ရဲ့ expected cash ထဲမှာ ဗီရိုထဲက ထုတ်သုံးတဲ့ ငွေ (petty cash) မပါသေးဘူး (§3.8)။

6. **Weekly backup က ငွေစာရင်း system အတွက် မလုံလောက်ဘူး။** Server ပျက်ရင် ၆ ရက်စာ sale ပျောက်နိုင်တယ်။ Daily လုပ်ပါ (§3.9)။

7. **`fresha-research` repo က public ဖြစ်နေပုံရတယ်။** ဒီ session က credential မသုံးဘဲ clone လုပ်လို့ရတယ် (GitHub ကို logout လုပ်ပြီး ဖွင့်ကြည့်ရင် အတည်ပြုနိုင်တယ်)။ Repo README ကိုယ်တိုင်က screenshot တွေထဲမှာ owner ရဲ့ နာမည်၊ email၊ ဖုန်း၊ Yangon လိပ်စာ ပါတယ်လို့ ရေးထားတယ်။ Live revenue ကိန်းဂဏန်းတွေလည်း ပါတယ်။ **ချက်ချင်း private ပြောင်းပါ** (§3.9)။

8. **Architecture direction မှန်တယ်** (modular monolith + PostgreSQL + TypeScript + Next.js)။ ပြင်ချင်တာ နည်းနည်းပဲ — Redis ဖြုတ်၊ app တွေကို hosted web ကိုဖွင့်တဲ့ thin shell လုပ်၊ business rule တွေကို DB constraint နဲ့ ကာ၊ shared tablet အတွက် PIN switch ထည့် (§5, §7)။ **iOS** ကို V1 မှာ app သီးသန့် မလုပ်ဘဲ PWA (Home Screen web app) နဲ့ သွားပြီး iOS ကန့်သတ်ချက်တွေကို design မှာ ကြိုထည့် (§5.7)။

9. **P1 ရဲ့ "Admin panel ကပြင်တာနဲ့ website front page မှာ ပေါ်ရမယ်" requirement ကို conversation ထဲမှာ design မလုပ်ခဲ့ဘူး။** `/book` link နဲ့ branch info field တွေပဲ lock ဖြစ်ခဲ့တယ်။ Website က data သီးသန့် မထားဘဲ admin panel နဲ့ DB တစ်ခုတည်းကို ဖတ်ပြီး admin save တိုင်း page cache ကို refresh လုပ်ရမယ် (§5.8)။

10. **(29/Sep) DB design စပြီ၊ ဒါပေမဲ့ ဘယ် part မှ lock မဖြစ်သေးဘူး။** ChatGPT ရဲ့ Part 1 draft နဲ့ Booking draft မှာ 🔒 decision ကို ချိုးဖောက်တာ ၇ ခု တွေ့တယ် (§0.3၊ §6.3–§6.4)။ Section 3 ကိုလည်း **Decision Safety Review** အဖြစ် ပြန်စီပြီ — ဒီဖိုင်ထဲက ⚠️ အကြံပြုချက်တွေက approve မလုပ်မချင်း requirement မဟုတ်ဘူး (§3.0၊ D-PLT-11)။

---

## 2. ကောင်းတဲ့အချက်များ — မပြောင်းသင့်

| ဆုံးဖြတ်ချက် | ဘာကြောင့်ကောင်းလဲ |
| --- | --- |
| ✅ **Booking ≠ Service Visit ≠ Sale ≠ Payment** (R231–R234, P261) | "ချိန်းထားတာ"၊ "တကယ်လုပ်တာ"၊ "ရောင်းတာ"၊ "ငွေရတာ" ကို ခွဲထားလို့ no-show၊ service ပြောင်းတာ၊ ငွေမရသေးတာ တွေကို report မှာ မရောဘူး။ Commission/KPI ကို actual data နဲ့ပဲ တွက်နိုင်တယ်။ |
| ✅ **FINISH ပြီးရင် immutable — adjustment/refund + reason + audit နဲ့ပဲ ပြင်** (P278, R350) | စာရင်းစစ်တဲ့အခါ "ဘာကြောင့် ဒီငွေဖြစ်နေတာလဲ" ကို ပြန်ရှာလို့ရတယ်။ Fresha sandbox မှာ void လုပ်ရင် commission line က trace မကျန်ဘဲ ပျောက်တယ် — ဒါကို ရှောင်ထားတာ။ |
| ✅ **Booked Barber / Actual Service Barber / Started-Recorded By ခွဲမှတ်** (P266–P268) | Live sample (appointment ၁၀၀ ခု) မှာ record ရဲ့ 79% ကို service လုပ်တဲ့သူ မဟုတ်တဲ့လူက ရိုက်ထားတယ်။ ဒီ ၃ ခု ခွဲထားမှ commission မှန်မယ်။ |
| ✅ **Commission/KPI = Actual Service Barber ရဲ့ completed + paid sale** (P311, P315) | Fresha ရဲ့ "sale line ပေါ်က team member" model နဲ့လည်း ကိုက်တယ်။ |
| ✅ **Commission model ကို Point ရဲ့ လက်ရှိ Fresha setup အတိုင်း** (P307–P309) | Monthly, progressive, 15% (≤ 2,250,000) / 20% (အထက်)။ ဆိုင်က ရင်းနှီးပြီးသား rule ဖြစ်လို့ ပြောင်းရွှေ့ရလွယ်တယ်။ |
| ✅ **Booking လုပ်တဲ့အချိန် price/duration ကို snapshot သိမ်း** (P264, R354) | Price ပြောင်းလို့ ရှိပြီးသား booking မပြောင်းဘူး။ Customer နဲ့ စကားများစရာ မရှိဘူး။ |
| ✅ **Branch default price + optional barber override** (P334) | Live data အတိုင်း — branch ၃ ခု ဈေး ၃ ဆင့် (6,000 / 7,000 / 8,000) နဲ့ barber နာမည်တပ်ထားတဲ့ "MASTER CUT"။ ဆိုင်က Fresha ရဲ့ per-location price override ကို မသုံးဘဲ service ကို branch တစ်ခုချင်း copy ပွားထားတယ် (live §6) — ဒါကြောင့် catalogue ရှုပ်နေတာ။ |
| ✅ **Permission AND Data Scope, backend enforced; role အများကြီး grant-only union; role တစ်ခုချင်းမှာ branch scope** (P287–P299) | Fresha မှာ branch အလိုက် role မပေးနိုင်ဘူး (gap B-11b)။ Deny rule မထားတော့ conflict လည်း မဖြစ်ဘူး။ |
| ✅ **Company-wide expense ကို branch P&L ထဲ မခွဲ၊ company P&L မှာပဲ ထည့်** (P325) | Branch ရဲ့ တကယ့် performance မပျက်ဘူး။ Allocation formula အတွက် owner နဲ့ ငြင်းစရာ မလိုဘူး။ |
| ✅ **KBZPay reference + daily closing reconciliation** (P330) | Fresha (sandbox) မှာ KBZPay က နာမည်ပဲရှိတဲ့ custom method၊ reference field မရှိဘူး (live "K pay" setting ကိုတော့ မစစ်ရသေး)။ ဒီ gap ကို ပြင်ထားတာ။ |
| ✅ **Daily closing မှာ difference ရှိရင် reason မဖြစ်မနေ** (P199 #10) | Fresha register မှာ difference ကို reason မလိုဘူး (gap B-5)။ |
| ✅ **Manage Booking ကို unguessable token link နဲ့ (phone number နဲ့ မဟုတ်)** (R165–P166) | SMS OTP မသုံးဘဲ လုံခြုံရေး ထိန်းတဲ့ နည်းကောင်း။ |
| ✅ **Customer notification မလုပ်၊ staff in-app notification ပဲ** (P110, P115) | SMS ကုန်ကျစရိတ် မရှိ။ Live မှာ customer နာမည်တောင် မမှတ်တော့ SMS ပို့စရာလူ မရှိဘူး။ |
| ✅ **Passwordless (Google SSO / Email OTP) + email ကိုက်ရမယ်** (P151, P156) | Password မေ့တာ၊ ပြန်သတ်မှတ်ရတာ မရှိ။ Live မှာ staff တိုင်း email ရှိပြီးသား။ |
| ✅ **Vendor-neutral naming** (P361) | §6.1 မှာ ဆက်ဆွေးနွေးထားတယ် — 🔒 D-DB-01။ |

---

## 3. Decision Safety Review — စိုးရိမ်ချက်များ (Requirement မဟုတ်သေး)

> P366/P367 အရ ဒီ section ကို ပြန်စီထားတယ် (🔒 D-PLT-11)။ §3.1–§3.11 ရဲ့ စာသား (ဘယ်လိုထင် / ဘာကြောင့် / ဘယ်လိုဖြစ်သင့်) က မူရင်း review အတိုင်းပဲ — ဖိုင်ထဲက § reference တွေ မပျက်အောင် နံပါတ် မပြောင်းထားဘူး။ ခေါင်းစဉ်တိုင်းအောက်မှာ register ID နဲ့ status ထည့်ထားတယ်။ **"ဆုံးဖြတ်ပြီးပြီလား" ကို §3.0 register မှာပဲ ကြည့်ပါ။**

### 3.0 Rule နဲ့ Register

#### 3.0.1 Rule (🔒 D-PLT-11 — P366, R366, P367)

1. ဒီ review (§3, §4, §5, §7, §8) ထဲက စိုးရိမ်ချက်၊ အကြံပြုချက်တွေက **requirement မဟုတ်ဘူး**။ Requirement = Appendix A ထဲက 🔒 row တွေပဲ။
2. Item တိုင်းကို ၄ မျိုးထဲက တစ်မျိုး classify လုပ်တယ် —
   - 🔴 **Risk** — ကာကွယ်ရမယ့်အရာ။ ကာကွယ်ပုံ (safeguard) ကို ⚠️ REC အဖြစ် အဆိုပြုတယ်၊ approve မှ 🔒
   - 🟡 **Open decision** — မဆုံးဖြတ်ရသေး။ **DB ထဲ ခန့်မှန်းပြီး မထည့်ရ**။ မေး → ဆုံးဖြတ် → 🔒
   - 🔒 **Resolved** — lock ရှိပြီးသား (ဒါမှမဟုတ် lock precedence နဲ့ ဖြေရှင်းပြီးသား)
   - ⚠️ **Recommendation** — reviewer ရဲ့ အကြံ။ Approve → 🔒၊ reject → ✖ (row ကို မဖျက်ဘဲ ✖ ပြ — နောက်တစ်ခါ ထပ်မအဆိုပြုအောင်)
3. Pipeline —
   ```
   🔴 Risk ──► safeguard = ⚠️ REC ──► approve ──► 🔒
   🟡 Open ──► owner / မင်း ဆုံးဖြတ် ───────────► 🔒
   ⚠️ REC ───► approve ──► 🔒          reject ──► ✖
                  │
                  └─► Appendix A မှာ D-ID အသစ်ထည့် (ဒါမှမဟုတ် ရှိပြီးသား row ကို update) → ဒီ register မှာ "🔒 D-xx" လို့ ပြောင်း
   ```
4. 🔒 row တစ်ခုကို *ပြောင်းမယ့်* REC (ဥပမာ REC-15 → D-FIN-02) ဆိုရင် approve မလုပ်မချင်း **🔒 စာသားအတိုင်းပဲ build**။
5. DB draft ထဲမှာ lock မရှိတဲ့ field / table ပါရင် `// ⚠️ REC-nn` ဒါမှမဟုတ် `// 🟡 OPEN-nn` tag မဖြစ်မနေ (§6.5)။
6. **Precedence** — user ရဲ့ prompt မှာ lock လုပ်ထားတာ > ChatGPT response ထဲက စာသား (🔒 D-PLT-09 ရဲ့ ဆက်စပ်)။ ဒီ rule နဲ့ ဖြေရှင်းထားတာတွေကို §3.0.3 မှာ ပြထားတယ် — မသဘောတူရင် ပြန်ဖွင့်ပါ။
7. **Conflict တွေ့ရင် STOP** (🔒 D-PLT-13, RISK-08) — Claude Code (ဒါမှမဟုတ် ဘယ် assistant မဆို) က requirement အချင်းချင်း ဆန့်ကျင်နေတာ တွေ့ရင် တစ်ဖက်ကို ကိုယ်တိုင် မရွေးဘဲ ရပ်၊ report လုပ်၊ owner ဆုံးဖြတ်မှ ဆက်။

**⏩ = DB Part 1 lock / Part 2 (Services / Scheduling) မစခင် ဆုံးဖြတ်ရမယ့်ဟာ** *(Appendix B ရဲ့ ★ = "Release 1 အတွက် owner ကို အရင်မေး" နဲ့ မတူ)* — walk through ကို ဒါနဲ့ စပါ။ "DB" column = အဖြေမရမချင်း lock မလုပ်နိုင်တဲ့ DB part (§6.2)။

#### 3.0.2 🔴 Risk

| ID | အမျိုးအစား | Risk | § | Safeguard (approve မှ 🔒) | Status |
| --- | --- | --- | --- | --- | --- |
| RISK-01 | Operational | Barber တွေ real-time မမှတ်ရင် commission / KPI / closing data အကုန်မှား (live: record 100% ကို နောက်မှရိုက်၊ 44% shared login) | 3.1 | REC-01, REC-02, REC-03 · OPEN-01 | 🔒 D-VIS-11 (v4) |
| RISK-02 | Operational | Shared device + stay signed in → ပထမလူရဲ့ နာမည်နဲ့ နောက်လူတွေ ဆက်ရိုက် | 3.2 | REC-04, REC-05, REC-06 · OPEN-20 | 🔒 D-AUTH-07, D-VIS-12, D-ATT-06 (v4) |
| RISK-03 | Operational | ငွေလက်ခံသူ ≠ ညှပ်သူ (live: payment ၁၀၀ ကို ၃ ယောက်ပဲ ယူ) — 🔒 D-VIS-06 နဲ့ လက်တွေ့ မကိုက် | 3.3 | REC-07 · OPEN-02 | 🔒 D-VIS-06 update (v4) |
| RISK-04 | Operational | Internet / မီးပြတ်ရင် POS ရပ် | 3.10 | 🔒 D-DB-01 (UUIDv7) + 🔒 D-VIS-10 (idempotent) ရှိပြီး · REC-02 (fallback) · OPEN-08 | 🔒 D-VIS-13 (v4) |
| RISK-05 | Business rule | Colour/perm ဈေး fixed ဆိုရင် admin ကို ခဏခဏခေါ် / စာရင်းမသွင်းဘဲ ယူ | 3.4 | REC-08 · OPEN-04 | 🔒 D-SVC-05 (direction + detail — OPEN-04 ✅ 30/Sep) |
| RISK-06 | Business rule | Code-only discount → manual discount (တစ်လ ၃၀ ခု၊ MMK 117,000) စာရင်းပြင်ပ ရောက် | 3.5 | REC-09 · OPEN-09 | 🟡 ဆိုင်းထား (P381) — D-PAY-04 မပြောင်း |
| RISK-07 | Business rule | Module ~25 ခု vs တစ်လ | 3.6 | REC-10 · OPEN-07 | 🔒 D-PLT-14 (v4) — REC-10 ✖ |
| RISK-08 | Business rule | ဆုံးဖြတ်ချက်အချင်းချင်း ဆန့်ကျင် (C-1..C-12) → Claude Code က တစ်ဖက်ကို ကြိုက်သလို ရွေးမိ | 3.7 | §3.0.3 + REC-11..REC-14 · OPEN-03, OPEN-13 | 🔒 D-PLT-13 (v4) — REC-13 ✅ D-ROLE-06, OPEN-13 ✅ D-LV-04 (v5); REC-11, 12, 14 ⚠️ ဆက် |
| RISK-09 | Data / Accounting | P&L မှား — advance ကို expense၊ salary ကို net နဲ့ ထည့် | 3.8 | REC-15, REC-16 | 🔒 D-PAYR-04, D-FIN-02, D-FIN-04 (v4) |
| RISK-10 | Data / Accounting | Daily closing မှာ နေ့တိုင်း difference ထွက် (ဗီရိုထဲက ထုတ်သုံးတာ မပါ) | 3.8 | REC-17 · OPEN-05 | 🔒 D-FIN-06..09 (v4) · 🟡 opening float (OPEN-05) |
| RISK-11 | Data / Accounting | Progressive commission ကို checkout မှာ အတိအကျ မသိနိုင် | 3.8 | REC-18 · OPEN-03 | 🔒 D-COM-04 (v4) · 🟡 finalize ပြီးမှ refund |
| RISK-12 | Security / Data | Weekly backup → ၆ ရက်စာ ငွေစာရင်း ပျောက်နိုင် | 3.9 | REC-20 | 🔒 D-DAT-03 update (v4) |
| RISK-13 | Security / Data | Research repo public — owner ကိုယ်ရေး + ဆိုင် revenue | 3.9 | ACT-01, **ACT-07** | ✅ private ဖြစ်ပုံရ (29/Sep) · ⚠️ **30/Sep ည — UI/UX guideline ရေးဖို့ owner က public ခဏ ပြန်ဖွင့် → ✋ ACT-07 private ပြန်ပြောင်းရန်** |
| RISK-14 | Security / Data | Chrome remote debugging / production Fresha connector ဖွင့်ထား | 3.9 | ACT-02 | ✅ ပိတ်ပြီး (29/Sep) — သုံးပြီးတိုင်း untick |
| RISK-15 | Security / Data | Audit log ကို app ကနေ ပြင်/ဖျက်နိုင် | 3.9 | REC-21 | 🔒 D-AUD-02 (v4) |
| RISK-16 | Security / Data | Public booking spam (OTP မရှိ) | 3.11 | REC-28 | 🔒 D-BKG-21 (v4) — V1 ထဲ ပါ |
| RISK-17 | Operational | Thermal printer မှာ မြန်မာစာ မထွက် | 3.11 | REC-29 | 🔒 D-PAY-07 update (v4) |

#### 3.0.3 🔒 Resolved — ဆုံးဖြတ်ပြီးသား

| Item | ဖြေရှင်းပုံ | 🔒 | မှတ်ချက် |
| --- | --- | --- | --- |
| C-1 | FINISH = payment မှတ်ပြီးမှ၊ pending queue မရှိ | D-VIS-07 (P275) | R355 "Payment Pending" = ChatGPT စာသား၊ lock မဟုတ်။ KBZPay *verify* = 🔒 D-PAY-02 (v5.1, REC-11) |
| C-3 | Customer ဆီ ဘာမှမပို့ — email field မထည့် | D-CUS-05 (P186 #12) | R349 optional email = lock မဟုတ် |
| C-4 | Customer account checkbox မရှိ | D-CUS-04 (P128, P163, P186 #11) | R13 checkbox = အစောပိုင်း proposal ပဲ |
| C-6 | Stay signed in (idle timeout မရှိ) | D-AUTH-06 (P213 — P212 ထက် နောက်ကျ) | Branch device PIN = REC-04 ✖ (v4 — D-AUTH-07) |
| C-10 | `incomplete` တစ်ခုပဲ | D-VIS-09 (P284) | R355 "Abandoned" မသုံး |
| C-11 | Fresha = reference၊ lock = source of truth | D-PLT-09 (P342) | 28/Sep ကတည်းက ဖြေရှင်းပြီး |
| §3.10 Day-1 | UUIDv7 PK + ငွေ POST idempotent | D-DB-01, D-VIS-10 | Offline queue ကိုယ်တိုင်က 🟡 OPEN-08 |
| §3.11 Business date | Timezone = Asia/Yangon | D-PLT-05 | `business_date` column pattern = 🔒 D-PLT-15 (v5, REC-34) |
| §3.11 Service catalogue | Company master service + branch price/duration + barber override | D-SVC-01..03 | Fresha ရဲ့ branch copy ၃ ခုကို master ၁ ခုအဖြစ် ပေါင်းတာ = go-live data task |
| DB Part 1 | `employees.user_id` NOT NULL (users 1 : 1 employees) | D-EMP-02 (P366, P367) | F-P1-01 |
| Section 3 ကိုယ်တိုင် | Concern ≠ requirement | D-PLT-11 (P366, P367) | ဒီ register |

#### 3.0.4 🟡 Open decision

> **OPEN-n = Appendix B #n** (နံပါတ်တူ)။ မေးခွန်းအပြည့်က Appendix B မှာ။

| ID | မေးခွန်း (အတို) | § / 🔒 | DB | Status (v5) |
| --- | --- | --- | --- | --- |
| OPEN-01 | Walk-in ကို ဘယ်သူ ဘယ်အချိန်မှတ်၊ late entry ခွင့်ပြုမလား | 3.1, D-VIS-02 | Part 4 | ◐ ဘယ်သူ / ဘယ်အချိန် = 🔒 D-VIS-11 · outage → စက္ကူ → နောက်မှသွင်း = 🔒 D-VIS-13 · 🟡 outage မဟုတ်ဘဲ မေ့သွားတာ နောက်မှသွင်းခွင့်၊ reason / permission / report flag၊ ရက် ကန့်သတ်ချက် (REC-02) → ✅ (30/Sep မနက်) — D-VIS-13 update: barber ကိုယ်တိုင် + reason + စာရင်းမပိတ်ခင် + flag / count + permission |
| OPEN-02 | ငွေကို ဘယ်သူ လက်ခံလဲ | 3.3, D-VIS-06 | Part 4 | 🔒 ညှပ်တဲ့သူကိုယ်တိုင် (P371) + `collected_by` (D-VIS-06) |
| OPEN-03 | Commission — plan မရှိတဲ့ barber ၁၀ ယောက်၊ threshold ကို branch ပေါင်းပြီး တိုင်းလား | 3.7 C-2, D-COM-01 | Part 5 | ◐ (30/Sep မနက်) — **(A) design ✅** D-COM-01 update (plan + assign effective date + branch ပေါင်း default / branch scope optional) · **(B) ★ ပိုင်ရှင် = data** (၁၀ ယောက် ပုံစံ INFERRED basic ပဲ; threshold ပေါင်းတိုင်း) — DB မထိ |
| OPEN-04 ⏩ | Colour/perm ဈေး ဘာကြောင့်ပြောင်းလဲ — range / variant | 3.4, D-SVC-04 | Part 2 | 🔒 D-SVC-05 (30/Sep) — combination ဈေးဇယား (ဈေး + ကြာချိန်)၊ branch အလိုက်၊ barber override နောက်မှ |
| OPEN-05 | Daily closing — ဘယ်သူပိတ်၊ opening float၊ ဗီရိုထဲက ထုတ်သုံးတာ၊ bank ထည့်တာ၊ လက်ခံနိုင်တဲ့ difference | 3.8, D-FIN-06/07 | Part 7 | ◐ ထုတ်သုံးတာ / bank ထည့်တာ 🔒 (D-FIN-07..09) · **(A) design ✅ (30/Sep မနက်)** — opening float = branch setting + မနေ့ကျန် တိုက်၊ ပိတ်သူ = permission၊ ကွာချက် = setting (D-FIN-06 update) · **(B) ★ ပိုင်ရှင် = တန်ဖိုး** |
| OPEN-06 | Payroll — late/absent ဖြတ်ပုံ၊ tips၊ multi-branch basic salary ခွဲပုံ | 3.8, D-PAYR-05/08 | Part 5 | ◐ (30/Sep မနက်) — **(A) design ✅** rule = Additional Settings default OFF + snapshot (D-PAYR-05 / 08 update) · tips = ✖ V1 (D-PAY-09) · **(B) ★ ပိုင်ရှင် = setting တန်ဖိုး** (ခွင့်ပြုမိနစ်၊ ပမာဏ၊ ÷ 30 / 26၊ ခွဲပုံ) · advance/loan 🔒 D-PAYR-04 |
| OPEN-07 | Booking ကို go-live မှာ လိုလား | 3.6, §8 | – | 🔒 V1 ထဲ ပါ (D-PLT-14 — release မခွဲ) |
| OPEN-08 | Internet / မီးပြတ်ရင် ဘယ်လိုလုပ်မလဲ | 3.10 | all | 🔒 D-VIS-13 (V1 စက္ကူ၊ V2 offline) |
| OPEN-09 | Standing discount code ဘာတွေလိုလဲ | 3.5, D-PAY-04 | Part 4 | ✅ (30/Sep မနက်) — code ပုံစံ + public / internal + app ထဲ တောင်း / ✔ (D-PAY-04 update); ဘယ် code ကြိုဖန်တီး = go-live data |
| OPEN-10 | Barber dashboard မှာ ကိုယ့် sale / commission မြင်ရမလား | 3.1, D-DSH-03 | Part 1 (v3.4) | ✅ (01/Oct) — **default OFF; "အကုန်လုံး" (company setting `dashboard.show_own_earnings_all`) ရော "တစ်ယောက်ချင်း" (`employees.show_own_earnings` override, NULL = setting လိုက်) ရော** (D-DSH-03 update, Part 1 v3.4) · checkout estimate line (D-COM-04) ကိုလည်း effective flag အတိုင်း ပြ — owner confirm ✅ (v5.2.8) |
| OPEN-11 | KPI list + တွက်ပုံ | D-KPI-03 | – | ◐ **(02/Oct — one-sheet F6)** refund = refund ရက်မှာ နုတ် · returning customer = အရင် finished visit ရှိဖူးတဲ့ identified customer · avg / visit = service revenue ÷ service visit · ဖုန်းမပါ walk-in = "unidentified visit" → report ⑨ (Bookings & customers) + dashboard tile (API Part 8 P8-RULE-15 / 16); **custom KPI = ⏭ (D-KPI-03)** — ကျန်တာ = owner က KPI ထပ်လိုမှ |
| OPEN-12 | Preferred barber threshold default | D-CUS-08 | – | ✅ **(01/Oct — §0.7 #6)** နောက်ဆုံး finished visit ၅ ခုထဲ ၃ ခု+ (setting `customer.preferred_barber_window` / `_min_visits` — API P3-RULE-03) |
| OPEN-13 ⏩ | Pending leave က booking ကို ပိတ်မလား | 3.7 C-12, D-LV-03 | Part 2 | 🔒 D-LV-04 (30/Sep) — pending ကလည်း ပိတ် |
| OPEN-14 | One-active-booking edge case (မိသားစု / သူငယ်ချင်း / staff override) | D-BKG-09 (OD-10) | Part 3 | ✅ (30/Sep မနက်) — D-BKG-09 update: website ပဲ ၁ ခု၊ staff ကန့်သတ်မရှိ · (သူများဖုန်းနဲ့ booking အတု → Manager/Admin cancel — D-BKG-21) |
| OPEN-15 | Tax / service charge ရှိလား | D-PAY-08 | Part 4 | ✅ (30/Sep မနက်) — Additional Settings: ဖွင့် / ပိတ် + rate, default OFF (D-PAY-08) |
| OPEN-16 | Walk-in customer ဖုန်းနံပါတ် အမြဲမေးမလား | 3.11 | Part 4 | ✅ (30/Sep မနက်) — optional + ရိုက်ရလွယ် + ရယူနှုန်း % (D-VIS-02 update) |
| OPEN-17 ⏩ | Home Service ကို ဘယ်လိုမှတ်မလဲ | 3.11 | Part 2 | 🔒 D-SVC-06, D-BKG-22, D-SCH-03 (30/Sep) |
| OPEN-18 | Fresha history ဘယ်လောက်ထိ ယူမလဲ | §7 #18 | – | ✅ **(02/Oct — one-sheet F5)** master data ပဲ (customer · service category · simple service + branch ရောင်း / ကြာချိန် / ဈေး · product category · product · supplier · employee) — **Fresha history ✖ · invite ✖** (D-DAT-01, API Part 8 P8-RULE-07); option-grid service = ဈေးဇယား editor မှာ ရိုက် · ★ Fresha export အပြည့်ကို subscription မဖျက်ခင် owner က offline သိမ်း |
| OPEN-19 | QR + GPS attendance ကို သဘောတူလား | D-ATT-01 | Part 5 | ◐ (30/Sep မနက်) — design ✅ ဆက် (method / token / setting နဲ့ GPS · QR ပိတ်ရ) · ★ ပိုင်ရှင် အတည်ပြု = data (fallback 🔒 D-ATT-06) |
| OPEN-20 | Staff iPhone ဘယ်နှယောက်၊ counter မှာ ဘာ device | 5.7 | Part 1b | ✅ (01/Oct) — counter device မထား (D-AUTH-07)၊ print = Android ဖုန်း (D-PAY-07) · **iPhone အရေအတွက် မမေးတော့ — device တိုင်း အလုပ်ဖြစ်ရ:** receipt PDF / Share = အားလုံး (ပထမ ခလုတ်)၊ Print = Android capability (admin AD-RCPT-02 / AD-POS-13) |
| OPEN-21 | Website မှာ ဘာပြမလဲ (ဈေး၊ barber၊ ဖွင့်ချိန်)၊ domain | 5.8, D-WEB-01/04 | Part 8 | ◐ → **toggle ✅ (01/Oct):** `site.show_prices` / `site.show_barbers` / `employees.public_profile` = **default OFF — owner က admin panel ကနေ ဖွင့်မှ ပြ** · booking modal မှာ ဈေး + barber အမြဲ (OPEN-35) · ကျန် = ဖွင့်ချိန် data + domain (ACT-05) · website MM/EN 🔒 D-PLT-03 |
| OPEN-22 ⏩ | Company တစ်ခုတည်းပဲလား (single-tenant) — *29/Sep အသစ်* | F-P1-09 | Part 1 | 🔒 D-ORG-03 (29/Sep ည) — Point တစ်ခုတည်း + multi-company ကို နောက်မှ မြန်မြန်ဖွင့်လို့ရအောင် ပြင်ဆင် |
| OPEN-23 | Reschedule လုပ်ရင် price snapshot ကို မူလအတိုင်းထားမလား၊ ဈေးအသစ်ယူမလား — *29/Sep အသစ်* | F-BK-14, D-BKG-12 | Part 3 | ✅ (30/Sep မနက်) — D-BKG-12 update: အချိန်ပဲရွှေ့ရင် မူလဈေး၊ ပြောင်းဝယ်မှ ဈေးအသစ် |
| OPEN-24 | KBZPay reference format (ဂဏန်း ဘယ်နှလုံး၊ ဘယ် screen ကကူး) — *29/Sep အသစ်* | D-PAY-02 | Part 4 | ✅ (30/Sep မနက်) — ပုံစံ စစ်တာ = Additional Settings; DB = စာသား + unique (D-PAY-02) |
| OPEN-25 | Must-return cash out ကို နောက်လမှ ပြန်ထည့်ရင် (ယခင်လ expense ကို ပြန်မဖျက် — R394) ပြန်ထည့်တဲ့လ P&L မှာ Cash Return ကို income အဖြစ် ပြမလား — *v4 အသစ်* | D-FIN-09 | Part 7 | ✅ (30/Sep မနက်) — (ခ) expense reversal (revenue ✖) + မူလလ label + P&L note (D-FIN-09 update) |
| OPEN-26 | Payroll finalize ပြီးမှ refund / adjustment ဖြစ်ရင် negative commission ကို ဘယ် period မှာ ဘယ်လိုထည့်မလဲ — *v4 အသစ်* | D-COM-04, REC-18 | Part 5 | ✅ (30/Sep မနက်) — (ဂ) refund လ payroll မှာ reversal line၊ မူလ % (D-COM-04 update) |
| OPEN-27 | Waitlist (🔒 D-BKG-20 feature) ကို V1 မှာ ဆောက်မလား — R365 က review ရဲ့ "R3" label ကြောင့် ချန်ခဲ့ပေမဲ့ REC-10 ✖ ဖြစ်ပြီ — *v4 အသစ်* | D-BKG-20, D-PLT-14 | Part 3 | ✅ ⏭ V1 မပါ (30/Sep မနက်) — D-BKG-20 · ပြင်ဆင်ချက် + ပုံကြမ်း §6.4b |
| OPEN-28 | **Conflict:** ဖုန်းမပါ case (D-VIS-12) မှာ B က B ဖုန်းကနေ A အတွက် payment ပါ လုပ်ခွင့်ပေးမလား — 🔒 D-VIS-06 (P269) က "actual barber ပဲ payment၊ တခြား barber က START / COMPLETE ပဲ ကူ၊ exception = admin override + reason"  · **Claude အကြံ (က):** B လုပ်ခွင့် + reason "A ဖုန်းမပါ" (recorded by / collected by = B) — Manager ဆိုင်မှာ အမြဲမရှိ၊ audit မှာ B လုပ်တာ ရှင်းရှင်းမြင်ရ · (ခ) P269 အတိုင်း Manager / Admin override + reason — *v4 အသစ်* | D-VIS-06, D-VIS-12 | Part 4 | ✅ (30/Sep မနက်) — (က) B လုပ်ခွင့်၊ B ကိုယ်တိုင် မှတ်ပေးတဲ့ visit မှာပဲ — D-VIS-06 / 12 update |
| OPEN-29 | Online booking မှာ option ဇယား service (ဆိုးဆေး / perm) ကို customer က option (အရောင် / အရှည်) ရွေးမလား၊ "ဈေး X ကစ" ပြပြီး ဆိုင်ရောက်မှ ရွေးမလား — ကြာချိန် (booking ပိတ်ချိန်) နဲ့ ချိတ် — *v5 အသစ်* | D-SVC-05, D-BKG-03/04 | Part 3 | ✅ (30/Sep မနက်) — D-SVC-05 update: option ကိုယ်တိုင်ရွေး (ဈေး + ကြာချိန် အတိအကျ)၊ ဆိုင်ရောက်မှ အတည်ပြု |
| OPEN-30 ◐ | **Brand colour code** — guideline token (§10.3, `admin-panel.md` §3.1) တစ်ခုချင်းရဲ့ တန်ဖိုး (primary, background, success / warning / danger, chart ၆ ရောင် …) — AA contrast rule လိုက်ရ — *v5.2.6 အသစ်* | D-UX-02 | – | 🟡 ★ owner: "Color palette + design reference ပုံ သပ်သပ် ပေးမယ်" (01/Oct) · **timing ✅ (v5.2.8): develop spec ထုတ်တဲ့အဆင့် (API design / OpenSpec) ရောက်မှ ပေး — Claude Code က အဲ့အချိန် တောင်း; guideline approve blocker မဟုတ်** · theme = minimalist and clean (D-UX-05) · မရောက်ခင် shadcn `neutral` scaffolding · **v5.2.16 (owner 02/Oct — sheet B1 / B2 / #1 / #2): ◐ website palette ✅ = `#EEEEEE` / `#000000` / `#DC5F00`, ခလုတ် အမည်း + စာဖြူ (🔒 D-UX-02; frontend v1.5 FE-VIS-01a / 01b) · design reference = `point-barber/design-reference/` folder ၂ ခု (AD-META-08) · ★ ကျန် = admin panel palette (မပေးရသေး — neutral ဆက်) + logo ဖိုင် · ကျန် website token = ✅ REC-41 (02/Oct 13:46 — frontend v1.7; website အရောင် ပြည့်စုံ)** |
| OPEN-31 ~~★~~ | **Font family** — Myanmar (Unicode, weight ၂ မျိုး+) + Latin + ဂဏန်း (tabular) — licence self-host ရ — *v5.2.6 အသစ်* | D-UX-02 | – | ✅ (01/Oct) — **Pyidaungsu** (မြန်မာ — admin + website) · admin = **Manrope** (UI) / **Inter** (ဂဏန်း tabular + fallback) · website = **Archivo Black** (display) + **Roboto** (text) · D-UX-02 update (admin §3.2, frontend FE-VIS-02) |
| OPEN-32 | **မြန်မာ UI ပြပုံ** — data တန်ဖိုး ဂဏန်း (0–9 / ၀–၉)၊ လနာမည် (English MMM / မြန်မာ)၊ AM/PM (နံနက် / ညနေ?)၊ receipt ဘာသာ (user UI ဘာသာ / branch setting / ၂ ဘာသာ) — *v5.2.6 အသစ်* | D-PLT-03/04/05, D-PAY-06 | – | ✅ (01/Oct) — **0–9 · English `MMM` (`01/Oct/2026`) · AM/PM** ဘာသာ ၂ မျိုးလုံး · **receipt = English အမြဲ** (D-PLT-05 / D-PAY-06 update; admin AD-FMT-02/03/10, AD-RCPT-01) · website ငွေ = `7,000 Ks` ပဲ (D-PLT-04 `ကျပ်` = admin app — ✅ owner confirm v5.2.8, မပြောင်း) |
| OPEN-33 | **User တစ်ယောက်ချင်း ဘာသာ ဘယ်မှာ သိမ်းမလဲ** — D-PLT-03 "user switch" ရှိပေမဲ့ `users` မှာ column မရှိ (**DB gap**) — (က) device cookie ပဲ (DB မထိ၊ ဖုန်းပြောင်းရင် default ပြန်) (ခ) `users.ui_language smallint NULL` (1 MY · 2 EN) ထည့် → Part 1 **v3.3** — *v5.2.6 အသစ်* | D-PLT-03, D-DB-02 | Part 1 | ✅ (01/Oct) — **(ခ) user account** → `users.ui_language` + CHECK · **Part 1 v3.3** (D-DB-02 update, §6.3) · notification / OTP email ကိုလည်း ဒီဘာသာ (admin AD-L10N-06) |
| OPEN-34 | **Report ၁၀ ခု (D-RPT-01) ရဲ့ နာမည်စာရင်း** — register ထဲ မရှိ (P130–P145 conversation ဖျက်ပြီး) — *v5.2.6 အသစ်* | D-RPT-01 | – | ✅ (01/Oct 10:47 — owner "OK") — **🔒 D-RPT-01 update:** Sales summary · Barber performance · Payments & KBZPay · Discounts & refunds · Daily closing & cash · Expenses & P&L · Commission & payroll · Attendance & leave · Bookings & customers · Stock (အသေးစိတ် = admin AD-RPT-04) |
| OPEN-35 | **Website toggle က `/book` ကိုပါ သက်ရောက်လား** — (a) `site.show_prices` OFF → `/book` မှာ ဈေးဖျောက်? (D-SVC-05 = option ရွေးရင် ဈေးအတိအကျ ပြ) (b) `public_profile` / `site.show_barbers` OFF (default) → `/book` မှာ barber ကို ဘယ်လိုပြ? (D-BKG-05 = customer ရွေး) (c) Branch ယာယီပိတ်ရက် (`branch_closures`) — Part 8 note "`/book` branch ရွေး ✖" = ပိတ်ကာလ တစ်ခုလုံး branch ရွေးမရ လား၊ ပိတ်ရက်တွေပဲ ရွေးမရ လား — *v5.2.6 အသစ်* | D-WEB-01/04, D-SVC-05, D-BKG-05 | – | ✅ (01/Oct) — **Option A** (guideline default): toggle = info page ပဲ; booking မှာ ဈေး + barber display name အမြဲ ("Booking တင်မှတော့ ဈေးပြရမှာပေါ့")၊ ပုံ / specialty = public profile ON မှ; closure = ပိတ်ရက်တွေပဲ ရွေးမရ · **+ booking = modal / pop-up, သီးခြား `/book` page ✖** (D-UX-05; frontend FE-BK-00) |
| OPEN-36 | **Discount ကို ဘယ် line တွေဆီ ခွဲမလဲ** — D-PAY-04 = "service line တွေဆီ ဈေးအချိုး"; DB = ကားခ မဟုတ်တဲ့ line အကုန် ခွဲလို့ရ — product line ပါ ခွဲမလား (commission base ပြောင်း) — *v5.2.6 အသစ်* | D-PAY-04, D-COM-02 | Part 4 (DB မပြောင်း) | ✅ (01/Oct) — **service line + product line နှစ်မျိုးလုံး** ဈေးအချိုး (ကားခ ✖) · commission base = net service line (D-COM-02 မပြောင်း) · D-PAY-04 update (admin AD-POS-09) |
| OPEN-37 | **Barber card "rating"** (website Our barbers card — owner 01/Oct: current branch + rating + description) — review / rating table မရှိ၊ V1 scope ✖ (FE-META-05) — (က) admin ရိုက်တဲ့ ရိုးသား label (ခ) admin ရိုက်တဲ့ ★ star (ဂ) customer rating အစစ် = V2 — *v5.2.7 အသစ်* | D-UX-05, D-PLT-11 | Part 1 (v3.4) | ✅ (01/Oct 10:47) — **(ခ) လောလောဆယ် admin / manager ပေးတဲ့ rating** → `employees.public_rating` (Part 1 v3.4; 1.0–5.0, 0.5 ခြား) · website မှာ "Point rating" caption (review အတု လို့ မထင်အောင်) · **V2 = customer rating** (D-UX-05 update) · Appendix B #37 |
| OPEN-38 | **Architecture ADR ၈ ခု lock** (`docs/adr/`) — 002 pg-boss (REC-31) · 003 Capacitor (REC-32) · 004 booking idempotency = client token (API-IDEM-03 — owner "server / DB ဘယ်ဟာ ပိုကောင်းလဲ" အဖြေ = A) · 005 CSRF header + Origin · 006 website SSR + revalidate (REC-35) · 007 uptime / error tracking + email provider (REC-38 — ★ account owner ပိုင်) · 008 Socket.IO instance ၁ · 009 single origin `/api` · + ⚠️ RPO < 24 နာရီ လို / မလို (WAL archiving) — *v5.2.10 အသစ်* | §12, D-ARC-01 | – | ✅ **(01/Oct 21:20 — §0.6)** ADR-002 / 003 / 004 / 005 / 006 / 007 / 008 / 009 **Accepted** · RPO = daily · provider = Resend Free / HetrixTools Free (Email + Telegram) / Sentry Developer (D-ARC-02) · + ADR-011 (permission CRUD — ADR-010 Superseded) |
| OPEN-39 | **API Part 2 owner items ၁၀** (Part 2 §16) — ① buffer ပေါင်းပုံ (Σ default) ② ပိတ်ရက် = staff booking ✖ ③ approved ခွင့် cancel = `leave.approve` ④ self-approval ✖ ⑤ option group ≤ 2 API ကန့်သတ် ⑥ walk-in visit ပိတ်ချိန် = ခန့်မှန်း end ⑦ ★ go-live data ⑧ နောက်ဆုံး slot buffer = shift ထဲ ⑨ AD-SCH-01 copy ("tonight" → "now") ⑩ **DB Part 2 v1.3 `archived_at`** — *v5.2.11 အသစ်* | §11.6, D-API-03, D-DB-06 | Part 2 (v1.3) | ✅ **(01/Oct 21:20 — §0.6 #16–#24 "အကုန် OK")** → 🔒 D-API-03 (Part 2 v1.2) + 🔒 D-DB-06 v1.3 · ⑦ go-live data = ★ (Part 8 import) · ⑨ AD-SCH-01 copy = admin guideline v1.3 |
| OPEN-40 | **🔒 D-DAT-05 (hard delete ✖) နဲ့ ဆန့်ကျင်တာ ၃ နေရာ** — (a) payroll reopen မှာ လစာ expense row ဖယ်ပုံ (🔒 F-P5-09 + DB Part 7 `expenses_source_refs_chk`) (b) မှားထည့် + မသုံးရသေး salary row / commission plan assignment ဖြုတ်ပုံ (`archived_at` မရှိ) (c) DRAFT purchase / transfer line ဖြုတ်ပုံ — **API ပုံစံ မပြောင်း; mechanism ပဲ** — *v5.2.15 အသစ် (D-PLT-13)* | §0.9, D-DAT-05, D-PAYR-06, D-FIN-04, D-STK-02 / 03 | Part 5 v1.2 · Part 7 v1.2 ✅ (test ၃၉၃ — §6.4j) | ✅ **owner 02/Oct 08:24 "OPEN-40 OK" → (a) B soft delete (DB Part 7 v1.2) · (b) B archive (DB Part 5 v1.2) · (c) A ဖျက် + audit** — 🔒 D-DAT-05 note · D-DB-09 / 11 v1.2 · D-API-06 / 07 / 08 v1.1 (v5.2.16) |
| OPEN-41 | **Spec ရေးရင်း တွေ့တဲ့ မေးခွန်း — sheet 3 (§0.11), ၁၈ ချက်:** *(ဆိုင်အလုပ် / အချိန် / လုံခြုံရေး)* S1 schedule vs "တစ်လ" · S2 ပထမ change ၄ ခုရဲ့ အရွယ် · S6 ပထမ admin ဖန်တီးပုံ · S7 "Frequent here" chip အစဉ် · S9 code စစ်တာမှာ IP limit · S10 lock အဖြေ / email ရှိမရှိ · S11 archive row ကို Pay tab မှာ ပြ / မပြ · S14 browser တစ်ခုတည်းမှာ ထပ် login → session အဟောင်း ပိတ် · S15 focus ring / input border (neutral အရောင်) · S16 pilot လိုအပ်ချက် (server + pilot data + late entry) · S18 UI / email စာသားအသစ် · *(နည်းပညာ အတွင်းရေး)* S3 capability ၂ ခု (`platform-runtime`, `ui-foundation`) · S4 HTTP 500 `code` · S5 field-level error code · S8 reason field နာမည် (API-DATA-11 ↔ Part 4) · S12 `forbidden` / `out_of_scope` · S13 audit action `permission.sync` · S17 `correction_path` — *v5.2.16 အသစ် (D-PLT-11 / D-PLT-13)* | §0.11 · proposal "Open questions" ၄ ခု · D-PLT-14 · D-PLT-20 · API-ERR-02 · API-DATA-11 · API-LIM-02 · API-PERM-03 · D-AUTH-04 · D-VIS-13 · AD-VIS-03 / 04 | – (DB မထိ; API Part 5 မပြောင်း — S11 = က) | ✅ **owner 02/Oct 13:08 "မေးခွန်းအကုန်လုံး OK — Default အတိုင်း" → S1–S18 အကုန် default** — API Part 0 v1.6 · Part 1 v1.6 · Part 4 v1.1 · admin v1.7 / frontend v1.6 · capability ၂၅ 🔒 · change ၄ ခု apply လုပ်လို့ရပြီ — 🔒 D-PLT-14 / 20 · D-API-01 / 02 / 05 · D-UX-03 / 04 · D-AUTH-04 / 06 · D-ROLE-08 · D-VIS-13 · D-DAT-05 note (v5.2.17) |

#### 3.0.5 ⚠️ Recommendation — approve မလုပ်ရသေး

> "🔒 ကို ထိလား" — **ပြောင်း** = lock ထားတဲ့ row ကို ပြောင်းမှာ (သတိထားပြီး ဆုံးဖြတ်)၊ ထပ်ဖြည့် / ရှင်း = lock ကို မပြောင်းဘဲ အသေးစိတ်ထည့်၊ – = lock နဲ့ မဆိုင်။
> DB draft review finding တွေ (F-P1-\*, F-BK-\*) ကလည်း recommendation ပဲ — §6.3–§6.4 မှာ part lock လုပ်တဲ့အခါ တစ်ခါတည်း approve လုပ်ပါ။

| ID | အကြံပြုချက် | § | 🔒 ကို ထိလား | DB | Status (v5) |
| --- | --- | --- | --- | --- | --- |
| REC-01 | Walk-in ကို tap ၃–၄ ချက်နဲ့ checkout < 10 စက္ကန့်၊ ဖုန်းနံပါတ်ကို FINISH မှာ optional field ၁ ခု | 3.1 | D-VIS-02 ကို မပြောင်း (UX) | – | ◐ Real-time flow = 🔒 D-VIS-11 · < 10 စက္ကန့် = prototype တိုင်းမယ့် target ပဲ (requirement မဟုတ်) · ဖုန်းနံပါတ် field = 🔒 D-VIS-02 (v5.1, OPEN-16) |
| REC-02 | `performed_at` / `recorded_at` ခွဲ + ဒီနေ့အတွင်း late entry (reason + permission + report flag) | 3.1, 3.10, §7 #4 | အသစ် | Part 4 | ◐ `performed_at` / `recorded_at` + လုပ်သူ / သွင်းသူ = 🔒 D-VIS-13 (R376) · reason + permission + report flag + "စာရင်းမပိတ်ခင်" = 🔒 D-VIS-13 (v5.1, OPEN-01) |
| REC-03 | Phase 0 clickable prototype + Branch 3.0 မှာ ၂–၃ ရက် pilot | 3.1, §8 | – (process) | – | ⚠️ |
| REC-04 | Personal / Branch device ခွဲ၊ branch device မှာ PIN quick switch + idle ~2 မိနစ်၊ audit = user + device | 3.2, §7 #3 | D-AUTH-06 ကို ထပ်ဖြည့် | Part 1b | ✖ (R373 → P374 "ဆက်သွားပါ" = လက်ခံ — D-AUTH-07) |
| REC-05 | Session = server-set `HttpOnly` cookie (localStorage token မသုံး) | 5.7, §7 #20 | D-AUTH-06 (ပုံစံ) | – | 🔒 D-AUTH-06 (29/Sep ည) |
| REC-06 | Branch counter device = Android tablet / Windows PC (iPad မဟုတ်) | 5.7, §7 #21 | – | – | ✖ မှတ်တမ်းတင်ဖို့ (D-AUTH-07) · print သက်သက် counter device = ⏭ နောက်မှ (D-PAY-07) |
| REC-07 | `collected_by` ≠ `performed_by`၊ default = performer၊ `payment.collect` ရှိသူလည်း ယူခွင့် | 3.3, §7 #5 | **D-VIS-06 ကို ပြောင်း** | Part 4 | 🔒 D-VIS-06 (P375) |
| REC-08 ⏩ | Service price type `fixed` / `range` / `variants` | 3.4, §7 #6 | **D-SVC-04 ကို ပြောင်း** | Part 2 | 🔒 D-SVC-05 — range မဟုတ်ဘဲ options + combination ဈေးဇယား (detail ✅ OPEN-04, 30/Sep) |
| REC-09 | Standing code + admin ဖုန်းကနေ တစ်ခါသုံး code + code usage report | 3.5 | D-PAY-04 မပြောင်း | Part 4 | 🔒 D-PAY-04 (30/Sep မနက်) — ~~ဖုန်းကနေ~~ → app ထဲ တောင်း / ✔ (owner: admin ဖုန်းကိုင်နေရမှာ မဖြစ်) |
| REC-10 | Release ခွဲပုံ — R1 walk-in + ငွေ + closing + P&L + website၊ R2 booking…၊ R3 stock | 3.6, §8 | – | – | ✖ (P382 / R382 — D-PLT-14) |
| REC-11 | C-1: KBZPay verify status (`unverified → verified`) ကို FINISH နဲ့ ခွဲ၊ daily closing မှာ ရှင်း | 3.7 | D-PAY-02 ကို ထပ်ဖြည့် | Part 4, 7 | 🔒 D-PAY-02 (30/Sep မနက်) |
| REC-12 | C-5: START မှာ performer + branch ပဲလို၊ service ကို COMPLETE မတိုင်ခင် ရွေး | 3.7 | D-VIS-02 ကို ရှင်း | Part 4 | 🔒 D-VIS-02 (30/Sep မနက်) |
| REC-13 ⏩ | C-7: Role assignment တစ်ခု ဖြုတ်/ပြောင်းရင် အဲ့ assignment ပဲ သက်ရောက် | 3.7 | D-ROLE-06 ကို ရှင်း | Part 1 | 🔒 D-ROLE-06 (29/Sep ည) |
| REC-14 | C-9: Transfer `Sent` → `Dispatched` → `Received` | 3.7 | D-STK-03 ကို ရှင်း | Part 6 | 🔒 D-STK-03 (30/Sep မနက်) — **၂ ဆင့်** DRAFT → SENT (ထွက်) → RECEIVED (Dispatched ခလုတ် ✖ — ဝန်ထမ်း သယ်) |
| REC-15 | C-8: Advance / Loan = receivable (expense မဟုတ်)၊ "Staff Advance" expense category ဖြုတ် | 3.8, §7 #7 | **D-FIN-02 ကို ပြောင်း** | Part 5, 7 | 🔒 D-FIN-02, D-PAYR-04 (P390) |
| REC-16 | Salary expense = gross (net မဟုတ်) | 3.8, §7 #7 | **D-FIN-04 ကို ပြောင်း** | Part 5, 7 | 🔒 D-FIN-04 (P390) |
| REC-17 | Expected cash = opening float + cash payments − cash refunds − cash paid out ± cash in | 3.8, §7 #8 | **D-FIN-06 ကို ပြောင်း**၊ D-FIN-07 | Part 7 | 🔒 D-FIN-06..09 (P395) + Reason Master · 🟡 opening float (OPEN-05) |
| REC-18 | Commission ကို period ကုန်မှ တွက်၊ checkout မှာ estimate၊ finalize ပြီး refund → နောက်လ အနုတ် line | 3.8, §7 #9 | D-COM-01 ကို ရှင်း | Part 5 | ◐ estimate / final = 🔒 D-COM-04 (P397) · finalize ပြီး refund = 🔒 D-COM-04 (v5.1, OPEN-26) — reversal line မူလ % (REC-18 ✅) |
| REC-19 | Multi-branch basic salary ခွဲတဲ့ default = attendance နာရီအချိုး (မရှိရင် primary branch) | 3.8 | D-PAYR-08 🟡 | Part 5 | 🔒 D-PAYR-08 (30/Sep မနက်) — setting default |
| REC-20 | Daily backup (၃၀ ရက်) + weekly (၁ နှစ်) + off-site + လစဉ် restore test | 3.9, §7 #2 | **D-DAT-03 ကို ပြောင်း** | Part 8 | 🔒 D-DAT-03 (29/Sep) |
| REC-21 | Audit log append-only ကို DB permission နဲ့ပါ ကာ | 3.9 | D-AUD-01 ကို ထပ်ဖြည့် | Part 8 | 🔒 D-AUD-02 (29/Sep) + ငွေ table auto-record |
| REC-22 ⏩ | Booking start interval 15 မိနစ် (live setting) | 3.11 | D-BKG-07 ကို ထပ်ဖြည့် | Part 2 | 🔒 D-BKG-07 (30/Sep) — setting, default 15 |
| REC-23 ⏩ | Service အလိုက် buffer 0–5 မိနစ် | 3.11 | – | Part 2 | 🔒 D-SVC-07 (30/Sep) — default 0 |
| REC-24 | Walk-in START မှာ "booking ရှိတယ်" warning | 3.11 | – | – | ⚠️ |
| REC-25 | Receipt နံပါတ် = branch + နှစ် အလိုက် gapless (`B3-2026-000125`) | 3.11 | D-PAY-06 ကို ထပ်ဖြည့် | Part 4 | 🔒 D-PAY-06 (30/Sep မနက်) — **branch + နှစ် + လ**: `B3-2026-OCT-00125` |
| REC-26 ⏩ | Home Service = branch ကထွက်တဲ့ visit (branch revenue) | 3.11 | – (OPEN-17 အဖြေပေါ်မူတည်) | Part 2, 4 | 🔒 D-SVC-06 (+ အိမ်ဈေး, ကားခ line — commission မတွက်, online booking, သွားချိန်) |
| REC-27 ⏩ | Leave type ကို live blocked-time ၁၀ ခုကနေ seed | 3.11, §7 #16 | D-LV-01 | Part 2 | 🔒 D-LV-01 (30/Sep) |
| REC-28 | Public booking — captcha + rate limit | 3.11, §7 #14 | D-BKG-10 | – | 🔒 D-BKG-21 (29/Sep) |
| REC-29 | မြန်မာ receipt ကို OS driver / browser (image) နဲ့ print | 3.11 | D-PAY-07 | – | 🔒 D-PAY-07 (29/Sep) — ပုံအဖြစ် print |
| REC-30 | Fresha ထွက်ခွာ — subscription မဖျက်ခင် export အကုန်၊ master data ပဲ migrate | 3.11, §7 #18 | – (OPEN-18) | – | ✅ **(02/Oct — F5 → D-DAT-01)** master data ပဲ migrate; history ✖ · ★ export အကုန် offline သိမ်း = owner |
| REC-31 | Redis / BullMQ အစား pg-boss | 5.2, §7 #10 | – | – | 🔒 **ADR-002 Accepted** (owner 01/Oct 21:20 — §0.6 #9) — pg-boss + backup sidecar; RPO daily |
| REC-32 | Android / Windows app = hosted URL ကိုဖွင့်တဲ့ thin shell (TWA / Capacitor, Tauri) | 5.1, 5.2 | D-PLT-01 (ပုံစံ) | – | 🔒 **ADR-003 Accepted** (owner 01/Oct 21:20 — §0.6 #10) — Capacitor + Bluetooth Classic ESC/POS; Windows = Tauri |
| REC-33 | §5.4 DB pattern များ — FINISH lock trigger, `document_sequences`, `idempotency_keys`, `audit_events` ပုံစံ, effective-dated | 5.4 | part အလိုက် | all | ◐ Part 2–7 မှာ pattern အတိုင်း ဆောက်ပြီး (EXCLUDE, partial unique, receipt_counters row lock, client_request_id unique, effective-dated, snapshot) · **settings store = 🔒 D-PLT-16 (30/Sep မနက်)** key-value + history + settings.json · audit_events = Part 8 (D-AUD-02) |
| REC-34 ⏩ | Transaction row တိုင်းမှာ `business_date` (Asia/Yangon ရက်) | 3.11, 5.4 | D-PLT-05 ကနေ ဆင်း | all | 🔒 D-PLT-15 (30/Sep) — MMT ရက်၊ ည ၁၂ မကျော် |
| REC-35 | Public website = admin နဲ့ DB တစ်ခုတည်း + save တိုင်း revalidate (`site` module) | 5.8, §7 #19 | D-WEB-01 🔒 (toggle ✅) | Part 1 add-on | 🔒 **ADR-006 Accepted** (owner 01/Oct 21:20 — §0.6 #12) — SSR + tag cache + transactional revalidate |
| REC-36 | Manage link နဲ့အတူ `.ics` + Viber share | §7 #13 | D-BKG-11 | – | ✅ **(01/Oct — §0.7 #5)** `.ics` = browser ထဲမှာ ထုတ် (server ✖ — D-CUS-05; manage link ပါ) · share = Web Share (FE-CONF-02 v1.3) |
| REC-37 | Auto-print default OFF | §7 #15 | D-PAY-07 | – | ✅ **(02/Oct — one-sheet H2)** `receipt.auto_print` = false (client-readable) · printer width = branch setting `receipt.printer_width_mm` 58 / 80 (D-PAY-07, ADR-013) |
| REC-38 | Email OTP ကို transactional email provider နဲ့ ပို့၊ uptime + error monitoring | 5.2 | D-AUTH-01 (ပုံစံ) | – | 🔒 **ADR-007 Accepted** (owner 01/Oct 21:20 — §0.6 #13, #27–#29) — Resend Free · HetrixTools Free (Email + Telegram) · Sentry Developer · Mailpit / pilot Google login (D-ARC-02) |
| REC-39 | **Frontend website UI/UX guideline v1.2** (`docs/ux/frontend-website.md` — rule `FE-…` ~125 ခု: Laws of UX ၃၀ mapping, page spec, booking modal (FE-BK-00), barber card, confirmation / manage link, motion, SEO, performance, a11y) content ကို approve — *v5.2.6 · v1.1 / v1.2 = 01/Oct owner အဖြေ ၂ ကြိမ် သွင်းပြီး* | §10, §10.9 | 🔒 ကို ထပ်ဖြည့် (D-BKG-*, D-WEB-*, D-SVC-05, D-UX-05 ကို UI အသေးစိတ်) | – | ✅ **🔒 D-UX-04 (01/Oct 11:09 — owner approve v1.2)** · ★ OPEN-30 = spec အဆင့် · ပြောင်းရင် version အသစ် |
| REC-40 | **Admin panel / staff app UI/UX guideline v1.2** (`docs/ux/admin-panel.md` — rule `AD-…` ~270 ခု: Laws of UX ၃၀ mapping, shell / nav, pattern, component, status badge map, format, permission UI, critical flow spec ၁၉ ခု, Fresha adopt / improve / avoid, a11y, DoD) content ကို approve — *v5.2.6 · v1.1 / v1.2 = 01/Oct owner အဖြေ ၂ ကြိမ် သွင်းပြီး (font, OPEN-32 / 33 / 10 / 20 / 34 / 36, rating)* | §10, §10.9, §10.10 | 🔒 ကို ထပ်ဖြည့် (D-VIS-*, D-PAY-*, D-FIN-06, D-UI-01, D-RPT-01 …) | Part 1 v3.4 | ✅ **🔒 D-UX-03 (01/Oct 11:09 — owner approve v1.2)** · ★ OPEN-30 / logo / MM label = တန်ဖိုး ကျန်ရုံ |
| REC-41 | **Website ရဲ့ ကျန် colour token အဆိုပြု** (owner B1 = ခ: "brand အရောင်ပဲ ပေး၊ ကျန်တာ အဆိုပြု → approve") — card `#FFFFFF` · muted `#E0E0E0` / muted စာ `#555555` (6.43:1) · border `#C4C4C4` · input `#707070` · ring `#000000` · destructive `#C8281B` (4.79:1) · success `#0E4A28` (8.92:1) · warning `#6A3A00` (8.16:1) · info `#0B5CAD` (5.75:1) — အနီ / အစိမ်း / အညို ကို **အလင်းအမှောင် ကွာအောင်** ရွေးထား (အရောင်ကွဲ မမြင်ရသူ အတွက် — AD-VIS-04) — frontend guideline FE-VIS-01a ဇယား (v1.7 မှာ 🔒) — *v5.2.16* | §0.10 B1, §0.11 (C) | 🔒 ကို ထပ်ဖြည့် (D-UX-02) | – | ✅ **owner 02/Oct 13:46 "Ok ပါတယ်" → 🔒 D-UX-02 / D-UX-04 v1.7** (FE-VIS-01a row အကုန် 🔒); `add-shared-ui-components` ထဲ တစ်ခါတည်း ဆောက် — roadmap #81 `change-site-colour-tokens` မလိုတော့ (v5.2.18) |
| REC-42 | **Coding guideline Draft v1.0** (`point-barber/docs/engineering/coding-guideline.md` — rule ID `CG-…` ၁၅၁ (rule ၁၄၅ + pointer ၆) · area ၂၂ · reference mapping ၄၁ row · Top 12 · PR Definition of Done · lint / CI inventory ၈၉ · override list ၁၇) content ကို approve — reference / tooling / စစ်ဆေးပုံ က 🔒 ပြီးသား (D-ENG-01 / 02); 🔒 source က လာတဲ့ rule တွေက approve မလိုဘဲ binding — *v5.2.16* | §0.10 D1–D4, §12.11 | – (ထပ်ဖြည့် — code ရေးပုံပဲ; business rule မထိ) | – | ✅ **owner 02/Oct 13:46 "Ok ပါတယ်" → 🔒 D-ENG-02 (v1.0 APPROVED — rule အကုန် binding)** · ကျန် = guideline §26 team item ၅ ချက် (OPEN-CG-02 tool pin — TypeScript 6.0.x / ESLint 9.x / Prisma 7.x · 03 coverage floor · 04 CI က point-sdd ဖတ်ပုံ · 05 library · 06 GitHub plan) (v5.2.18) |

> Architecture REC (REC-31, 32, 33, 38) ကို approve တဲ့အခါ ADR (Architecture Decision Record) တစ်ခုစီ ရေးထားပါ — `docs/adr/NNN-title.md` မှာ Context / Decision / Options considered / Consequences။ နောက် developer အတွက် "ဘာကြောင့်" ကျန်မယ်။ · *v5.2.10:* **ရေးပြီး** — `docs/adr/ADR-001..010` + `docs/architecture/system-design.md` (§12); approve = ADR Status Proposed → Accepted + REC row ✅။ *v5.2.13 (01/Oct 21:20):* **အကုန် Accepted** — REC-31 / 32 / 35 / 38 = 🔒 (ADR-002 / 003 / 006 / 007); ADR-011 (permission CRUD) အသစ်။

#### 3.0.6 ✋ Action — system requirement မဟုတ်၊ လုပ်ရမယ့်အလုပ်

| ID | လုပ်ရန် | § | Status (v4 — 29/Sep ည) |
| --- | --- | --- | --- |
| ACT-01 | `fresha-research` repo → private | 3.9, §7 #1 | ✅ Credential မပါဘဲ `git ls-remote` လုပ်တော့ GitHub က username တောင်း → private ဖြစ်ပုံရ။ 100% သေချာချင်ရင် GitHub logout (incognito) browser မှာ ဖွင့်ကြည့် |
| ACT-02 | `chrome://inspect/#remote-debugging` untick + `claude mcp remove chrome-devtools -s local` | 3.9 | ✅ Untick ပြီး (owner 29/Sep)။ **Rule:** Fresha research လုပ်ချိန်ပဲ tick၊ ပြီးတာနဲ့ untick။ Connector ကို Fresha research လုံးဝ မလိုတော့တဲ့နေ့ ဖြုတ် |
| ACT-03 | Fresha sandbox trial (04/Oct ကုန်) မတိုင်ခင် barber-level login test | 4.4 | ⬜ **04/Oct မတိုင်ခင်** (01/Oct — ၃ ရက်ပဲ ကျန်) |
| ACT-04 | ဒီဖိုင်ကို product repo `docs/` ထဲထည့်၊ Appendix A → `docs/decisions/decision-register.md` · `db/` zip (DBML ၉ · SQL ၉ · test ၆ · README) → repo `db/` | §7 #17 | ⬜ (DB design ပြီးလို့ အသင့်) |
| ACT-05 | Domain name ဝယ် (website၊ Email OTP ပို့တဲ့ domain၊ နောက်မှ Apple) | 5.8 | ◐ **(01/Oct 21:20)** DNS access ✅ · final domain = **production release ကျမှ owner ကိုယ်တိုင် `.env` ထဲ ထည့်** · Resend မှာ go-live ၂–၃ ရက် အလို verify (SPF / DKIM / DMARC) + OTP စမ်း (D-ARC-02) · pilot အထိ = Google login |
| ACT-06 | UI/UX guideline ၂ ဖိုင်ကို product repo `docs/ux/admin-panel.md` + `docs/ux/frontend-website.md` ထဲ ထည့်၊ `CLAUDE.md` မှာ ညွှန် (§10.7)၊ OpenSpec project context ထဲ source အဖြစ် ထည့် — *v5.2.6* · *v5.2.9:* + `docs/api/` (part lock ပြီးတိုင်း) · *v5.2.10:* + `docs/architecture/system-design.md` + `docs/adr/` (ADR Accepted ဖြစ်တိုင်း) + `CLAUDE.md` architecture rule (§12.5) | §10, §11, §12 | ⬜ **အသင့် — guideline 🔒 ပြီး (01/Oct 11:09)**; API ဖိုင် = part lock ပြီးမှ · **v5.2.16: ✅ ဖိုင်တွေ repo layout အတိုင်း ထုတ်ပြီး — `point-sdd/docs/ux/` + `CLAUDE.md` ၂ ခု (push = ACT-09 ပြီးမှ)** |
| ACT-07 | **`fresha-research` repo ကို private ပြန်ပြောင်း** — 30/Sep ည UI/UX guideline အတွက် public ဖွင့်ထား; owner ကိုယ်ရေး + live revenue ပါ (RISK-13) — *v5.2.6* | 3.9, 4.4 | ⬜ **ချက်ချင်း** |
| ACT-08 | **Ops account (build ချိန်)** — owner ပိုင် ops Gmail → **Resend (Free) · HetrixTools (Free) · Sentry (Developer)** account ၃ ခု; HetrixTools ကို Telegram ချိတ် (`@hetrixtools_bot` → Start → Chat ID → contact list) + alert email; HetrixTools ကို ရက် ၉၀ တစ်ခါ login (go-live checklist + calendar reminder); API key = server `.env` ပဲ — *v5.2.13* | 12.7, ADR-007 | ⬜ build စချိန် |
| ACT-09 | **Repo ၂ ခု private ပြောင်း** — `agkyawpai/point-sdd` + `naingaunglinn/point-barber` က 02/Oct မနက် public ဖြစ်နေ (login မပါဘဲ clone ရ); planning record (Fresha revenue ကိန်းဂဏန်း, business rule) နဲ့ design reference (Fresha screenshot) မတင်ခင် private ပြောင်း → incognito browser နဲ့ ဖွင့်ကြည့် အတည်ပြု (ACT-07 နဲ့ အကြောင်းတူ — RISK-13) — *v5.2.16* | §0.10 #8, ADR-016 #8 | ⬜ **ဒီ batch ကို push မလုပ်ခင်** |

### 3.1 "Barber တိုင်း real-time မှတ်မယ်" ဆိုတဲ့ ယူဆချက် (အရေးကြီးဆုံး)

> **Register:** 🔴 RISK-01 · ⚠️ REC-01, REC-02, REC-03 · 🟡 OPEN-01, OPEN-10, OPEN-16 · **Status (v4):** 🔒 D-VIS-11 (barber ကိုယ်တိုင် ကိုယ့်ဖုန်းနဲ့ real-time)၊ REC-02 ◐ (D-VIS-13 — reason / permission 🟡)၊ REC-01 = prototype target ပဲ၊ REC-03 ⚠️ → §3.12

**ဘယ်လိုထင်လဲ** — System design က မှန်တယ်။ ဒါပေမဲ့ design တစ်ခုလုံးက ဒီယူဆချက်တစ်ခုပေါ်မှာ ရပ်နေတယ်။ ဒီယူဆချက် ကျသွားရင် commission၊ KPI၊ daily closing အကုန် data မှားကုန်မယ်။ Conversation ထဲမှာလည်း R271 က P269 ("တကယ်ညှပ်တဲ့သူပဲ ငွေယူ") ကို "live operation နဲ့ နောက်မှ ပြန်တိုက်ကြမယ်" လို့ ပြောခဲ့ပေမဲ့ ပြန်မတိုက်ဖြစ်ဘဲ P273/P275 မှာ "ပိုက်ဆံရှင်းပြီးမှ နောက်တစ်ခေါင်း" ဆိုပြီး R275 မှာ lock လုပ်လိုက်တယ်။

**ဘာကြောင့်လဲ** — `fresha-live-findings.md` §8–§11 က live data (appointment/payment ဆိုင်ရာ % တွေက နောက်ဆုံး record ၁၀၀ ခု sample — appointment: 27/Sep တစ်ရက်၊ payment: 19–27/Sep):

| ဒီနေ့ ဆိုင်က တကယ်လုပ်ပုံ | Lock ထားတဲ့ design |
| --- | --- |
| Customer နာမည်မပါ Walk-In 100% | Walk-in ပြီးတိုင်း customer record ထည့်ဖို့ ရွေးခွင့်ပေး |
| Record 100% ကို service ပြီးမှ ရိုက် (min 17 min, median 418 min, max 567 min) | START → COMPLETE → PAYMENT → FINISH ကို real-time |
| "RC Team" shared login က 44%၊ ညှပ်တဲ့ barber ကိုယ်တိုင် 21% ပဲ | Barber တိုင်း ကိုယ့် account |
| Payment 100 ခုကို လူ ၃ ယောက်ပဲ ယူ (RC Team 39) | Actual Service Barber ကပဲ checkout လုပ်ရ (P269) |
| Barber တစ်ယောက် တစ်နေ့ = sale ၁ ခု (Sale #1048 = line 14 ခု၊ 9:00pm မှာ cash ပေး) | Customer တစ်ယောက် = sale ၁ ခု |
| ~90 services/day (Branch 3.0 ≈37, 2.0 ≈34, 1.0 ≈19) | Barber ~13 ယောက် → တစ်ယောက် တစ်နေ့ ~7 ကြိမ် checkout |

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)* (lock တွေကို မဖျက်ဘဲ ထပ်ဖြည့်တာ)

1. **Walk-in ကို tap ၃–၄ ချက်နဲ့ ပြီးအောင်** — `[ကိုယ့်နာမည် tile] → START` … `COMPLETE → [Service tile] → [Cash] → FINISH`။ Target: checkout တစ်ခု **10 စက္ကန့်အောက်**။ Customer record ကို FINISH screen မှာ optional field တစ်ခု (ဖုန်းနံပါတ်) ပဲ ပြမယ်။
2. **Branch counter tablet + PIN quick switch** (§3.2)။
3. **`performed_at` နဲ့ `recorded_at` ခွဲမှတ်ပြီး "နောက်မှ မှတ်တာ" (late entry) ကို ခွင့်ပြု** — ဒီနေ့အတွင်း၊ reason နဲ့၊ permission နဲ့၊ report မှာ flag ပြမယ်။ မခွင့်ပြုရင် မေ့သွားတဲ့ barber တွေ အချိန်ကို လိမ်ရိုက်ဖို့ပဲ လမ်းကျန်မယ်။ မီးပျက်/internet ပြတ်တဲ့အချိန်မှာ စက္ကူနဲ့ မှတ်ပြီး နောက်မှ ပြန်ထည့်ဖို့လည်း ဒီလမ်းပဲ လိုတယ် (§3.10)။
4. **Go-live မတိုင်ခင် pilot ၂–၃ ရက်** — အလုပ်အများဆုံး Branch 3.0 မှာ prototype နဲ့ စမ်းပြီး checkout တစ်ခုကို စက္ကန့်ဘယ်လောက်ကြာလဲ၊ ဘယ်နှစ်ယောက် မေ့လဲ တိုင်းပါ။
5. **Barber တွေကို "ဘာကြောင့်" ကို ပြောပြ** — "ကိုယ့် commission မှန်ဖို့" ဆိုတာ အကောင်းဆုံး motivation ဖြစ်တယ်။ Barber dashboard မှာ ကိုယ့် ဒီနေ့ sale ကို မြင်ရမလားဆိုတဲ့ OD-7 ကို ဒီအချက်နဲ့ တွဲစဉ်းစားပါ။

### 3.2 Shared device + "Stay signed in"

> **Register:** 🔴 RISK-02 · 🔒 C-6 = D-AUTH-06 (stay signed in) · ⚠️ REC-04, REC-05, REC-06 · 🟡 OPEN-20 · **Status (v4):** 🔒 D-AUTH-07 (ကိုယ်ပိုင်ဖုန်း + ကိုယ်ပိုင် account)၊ D-VIS-12 + D-ATT-06 (ဖုန်းမပါ fallback)၊ REC-04 ✖၊ REC-06 ✖ → §3.12

**ဘယ်လိုထင်လဲ** — P213 မှာ "logout မလုပ်မချင်း ဝင်ထား" လို့ lock လုပ်ထားတယ်။ ကိုယ်ပိုင်ဖုန်းအတွက် မှန်တယ်။ ဒါပေမဲ့ ဆိုင်မှာ tablet/PC တစ်လုံးကို လူများများ သုံးရင် ပထမလူရဲ့ နာမည်နဲ့ နောက်လူတွေ ဆက်ရိုက်ကုန်မယ်။ ဒါက "RC Team" ပြဿနာကို ပြန်ဖန်တီးတာပဲ။

**ဘာကြောင့်လဲ** — Live မှာ record 44% ကို shared "RC Team" account နဲ့ ရိုက်ထားလို့ ဘယ်သူလုပ်လဲ မသိနိုင်ဘူး (live findings §5, §8)။ Fresha မှာ "PIN switching" setting ("Quickly switch between users, without the need for emails and passwords") ရှိတယ် — sandbox မှာ ပိတ်ထားပြီး live ကိုတော့ မစစ်ရသေး (`module-research/staff.md`)။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*
- Device ၂ မျိုး ခွဲ — **Personal device** (ကိုယ့်ဖုန်း: stay signed in) နဲ့ **Branch device** (counter tablet: branch အတွက် တစ်ခါ login၊ ပြီးရင် staff တစ်ယောက်ချင်း **4–6 digit PIN** နဲ့ ပြောင်း)။
- Branch device မှာ idle ~2 မိနစ်ဆိုရင် PIN screen ပြန်ပြ။
- PIN က password မဟုတ်ဘူး — Email OTP / Google နဲ့ authenticate ပြီးသား device ပေါ်မှာ "ဘယ်သူလဲ" ရွေးရုံ။ Passwordless lock ကို မချိုးဖောက်ဘူး။
- Audit မှာ `user` + `device` နှစ်ခုလုံး မှတ်။

### 3.3 ငွေကို ဘယ်သူ လက်ခံလဲ (P269)

> **Register:** 🔴 RISK-03 · ⚠️ REC-07 (🔒 D-VIS-06 ကို ပြောင်းမယ့် REC) · 🟡 OPEN-02 · **Status (v4):** 🔒 REC-07 approve (P375) → D-VIS-06 update။ Point မှာ ညှပ်တဲ့သူကိုယ်တိုင် ငွေလက်ခံ (P371) → §3.12

**ဘယ်လိုထင်လဲ** — "ငွေကိစ္စမို့ တကယ်ညှပ်တဲ့သူပဲ checkout" ဆိုတဲ့ ရည်ရွယ်ချက်က တာဝန်ခံမှု (accountability)။ ရည်ရွယ်ချက် မှန်တယ်။ ဒါပေမဲ့ rule က လက်တွေ့နဲ့ မကိုက်နိုင်ဘူး။

**ဘာကြောင့်လဲ** — Live မှာ နောက်ဆုံး payment 100 ခု (19–27/Sep) ကို လူ ၃ ယောက်ပဲ ယူတယ် (live findings §9)။ ဆိုင်မှာ ငွေကိုင်တဲ့သူ သီးသန့်ရှိပုံရတယ်။ Fresha ကလည်း payment တစ်ခုချင်းမှာ "Cash received by" / "Payment taken by" ကို သီးခြားမှတ်တယ် (`module-research/payments.md`)။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*
- `performed_by` (commission ရမယ့်သူ) နဲ့ `collected_by` (ငွေလက်ထဲရောက်တဲ့သူ) ကို ခွဲမှတ်။
- Default = `collected_by = performed_by` (P269 အတိုင်း)။
- `payment.collect` permission ရှိတဲ့ သတ်မှတ်ထားတဲ့သူ (ငွေကိုင်) ကလည်း လက်ခံခွင့်ရှိ။
- Commission က `performed_by` ဆီပဲ သွားမယ်။ Daily closing difference ရှိရင် `collected_by` အလိုက် ခွဲကြည့်နိုင်မယ်။
- ဒါက A ရဲ့ ရည်ရွယ်ချက် (တာဝန်ခံမှု) ကို ပိုတိကျအောင် ဖြည့်ပေးတာ။ 🟡 Owner ကို အတည်ပြုပါ။

### 3.4 Colour/Perm ဈေး ပြောင်းတာ (P264)

> **Register:** 🔴 RISK-05 · ⚠️ REC-08 ⏩ (🔒 D-SVC-04 ကို ပြောင်းမယ့် REC) · 🟡 OPEN-04 ⏩ · **Status (v5):** 🔒 D-SVC-05 (options + combination ဈေးဇယား — ဈေး + ကြာချိန်၊ branch အလိုက်) + D-SVC-08 → §3.12 / Appendix A

**ဘယ်လိုထင်လဲ** — "Barber ဈေးမပြင်ရ၊ admin ပဲ reason နဲ့ ပြင်" ဆိုတာ ဆံပင်ညှပ်အတွက် မှန်တယ်။ ဒါပေမဲ့ ဆိုးဆေး/perm အတွက် ဒီ rule နဲ့ဆိုရင် admin ကို တစ်နေ့ ခဏခဏ ခေါ်ရမယ်။

**ဘာကြောင့်လဲ** — Live မှာ menu ဈေးထက်ပိုယူတာ ပုံမှန်ဖြစ်နေတယ် — Curly Perm 55,000 → **60,000**၊ Brown 35,000 → **40,000**၊ Black 12,000 → **13,000** (live findings §8)။ ဆံပင်အရှည်ပေါ် မူတည်တာ ဖြစ်နိုင်တယ်။ Fresha မှာလည်း service price type က Free / **From** / Fixed ရှိပြီး variant ထည့်လို့ရတယ် (`module-research/services.md`)။

> *v5: အောက်က အကြံ ~~fixed / range / variants~~ ကို owner က မယူ — 🔒 D-SVC-05 (option ဈေးဇယား) + D-SVC-08 နဲ့ အစားထိုးပြီး။ မူလစာသား ကိုးကားဖို့ပဲ ထားတယ်။*

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)* — Service မှာ price type ထည့်:
- `fixed` — ဆံပင်ညှပ်၊ shampoo (barber မပြင်ရ — P264 အတိုင်း)
- `range` — min–max သတ်မှတ်၊ barber က range ထဲမှာ ရွေးနိုင်၊ range ပြင်ပဆိုရင် admin + reason
- ဒါမှမဟုတ် `variants` — Short / Medium / Long ဆိုပြီး ဈေး fixed အများကြီး

🟡 Owner ကို "ဈေးဘာကြောင့် ပြောင်းလဲ" မေးပြီးမှ range နဲ့ variant ထဲက ရွေးပါ။

### 3.5 Discount code only (P339)

> **Register:** 🔴 RISK-06 · 🔒 D-PAY-04 (code only) မပြောင်း · 🔒 REC-09 → D-PAY-04 · ✅ OPEN-09 · **Status (v5.1):** ✅ code ပုံစံ + app ထဲ တောင်း / ✔ (D-PAY-04 update) · *(v4: 🟡 owner က ဆိုင်းထား (P381) → §3.12)*

**ဘယ်လိုထင်လဲ** — Code-only rule ကို ဆက်ထားနိုင်တယ်။ ပြင်စရာမလိုဘူး၊ ပြင်ဆင်ပုံပဲ လိုတယ်။

**ဘာကြောင့်လဲ** — Live မှာ ဒီလအတွက် manual item discount **30 ခု (MMK 117,000)** ရှိတယ် (live findings §12)။ Code မရှိရင် ဒါတွေက ချက်ချင်း ရပ်သွားမယ်၊ barber တွေက cash ကို စာရင်းမသွင်းဘဲ လျှော့ပေးတာမျိုး ဖြစ်လာနိုင်တယ်။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*
- Go-live မှာ admin က "အမြဲသုံး code" တွေ ကြိုဖန်တီးထား (ဥပမာ regular customer, staff family)။
- Admin ဖုန်းကနေ တစ်ခါသုံး code ချက်ချင်းထုတ်ပေးနိုင်အောင်။
- Code usage report (ဘယ် code ကို ဘယ် barber က ဘယ်နှခါ သုံးလဲ)။

### 3.6 Scope နဲ့ Timeline

> **Register:** 🔴 RISK-07 · ⚠️ REC-10 · 🟡 OPEN-07 · **Status (v4):** 🔒 D-PLT-14 — dev ၂ ယောက် + Claude Code၊ V1 အကုန် တစ်လ၊ REC-10 ✖ → §3.12

**ဘယ်လိုထင်လဲ** — တစ်လထဲမှာ developer တစ်ယောက် + Claude Code နဲ့ ဒီ scope အကုန်လုံးကို production quality မပြီးနိုင်ဘူး။ ChatGPT ကိုယ်တိုင် ပထမဆုံး reply (R1 §16) မှာ "P0 + P1 + P2 အကုန် တစ်လထဲမှာ production-quality ဆိုတာ မယုံသင့်ဘူး" လို့ ပြောခဲ့ပြီးမှ နောက်ပိုင်း scope က အများကြီး ကြီးလာတယ်။

**ဘာကြောင့်လဲ** — Lock ထားပြီးသား module တွေ:

> Auth (SSO/OTP/devices) · Company/Branch · Staff/HR profile/documents · Roles & action-level permissions · Services & branch/barber pricing · Customer · Public website (admin-driven) · Public booking + manage link · Availability engine · No-show engine · Waitlist · Walk-in/visit · Checkout/POS · Discount codes · Tax/service charge engine · Receipts + thermal printing · Refund/adjustment · Stock/purchase/transfer/stocktake · Income/expense + approval · Daily closing/reconciliation · P&L · Commission engine · Payroll/advance/loan/payslip · Schedule · Leave · Attendance (QR+GPS) · KPI (custom) · Dashboards ×3 · Reports ×10 · Global search · Audit · Notifications (realtime) · Import/export · Backup/restore · Maintenance/status · MM/EN · APK + EXE

ဒါ့အပြင် requirement ကို ၂ ရက်ခွဲ သုံးပြီးပြီ၊ DB design ကို ~၂ ရက်ထပ်ကြာမယ်လို့ ခန့်မှန်းထားတယ် (P347)။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)* — Evidence အရ ဦးစားပေး ခွဲပါ (§8)။ အဓိက logic:
- Online booking **0%**၊ requested barber **0%** → booking က ဒီနေ့ ဆိုင်ကို မကယ်ဘူး → Release 2
- Walk-in **100%** + ငွေ + closing + **P&L** (owner က "အဓိကအချက်" လို့ ပြောထား — P56) → Release 1
- Stock: Fresha မှာ product **0** ခု → လုပ်ငန်းစဉ်အသစ် → Release 3

### 3.7 ဆုံးဖြတ်ချက်အချင်းချင်း ဆန့်ကျင်နေတာများ

> **Register:** 🔴 RISK-08 · 🔒 C-1, C-3, C-4, C-6, C-10, C-11 (§3.0.3) · ⚠️ REC-11..REC-15 · 🟡 OPEN-03, OPEN-13 · **Status (v4):** 🔒 D-PLT-13 (conflict → STOP → owner) · C-8 = REC-15 🔒 · ကျန်တဲ့ row တွေ ညာဘက်ဆုံး column အတိုင်း

| # | ဆုံးဖြတ်ချက် ၁ | ဆုံးဖြတ်ချက် ၂ | အကြံပြု ဖြေရှင်းချက် | Status (29/Sep) |
| --- | --- | --- | --- | --- |
| C-1 ❌ | P275: Payment မရှင်းရင် FINISH မဖြစ်၊ pending queue မရှိ | R355 §14.7/§14.9/§14.10: `Pending / Needs Verification`၊ "Service Complete ↓ Payment Pending" | **FINISH = payment *မှတ်ပြီး* ဖြစ်ရမယ်။** KBZPay ကို *verify* လုပ်တာက သီးခြား status (`unverified → verified`) ဖြစ်ပြီး daily closing မှာ ရှင်းမယ်။ Unpaid visit က barber ကို ဆက်မသွားခိုင်းဘူး — P275 အတိုင်း။ | 🔒 D-VIS-07 · 🔒 REC-11 → D-PAY-02 (v5.1) |
| C-2 ❌ | P63/R63 🔒: Branch အလိုက် commission % မတူနိုင် (Branch A 10% / B 12%)၊ P197 #3 မှာ ထပ်အတည်ပြု | P306–P308 (R308 🔒): Point ရဲ့ monthly progressive model (plan ဘယ်နှစ်ခုလဲ မပြောထား — ဒီ review ရဲ့ ကောက်ချက်) | Employee တစ်ယောက်မှာ plan တစ်ခု (branch scope optional)။ **Tier threshold ကို branch အားလုံးရဲ့ စုစုပေါင်းနဲ့ တိုင်းမယ်** (🟡 Fresha မှာ NOT VERIFIED)။ Branch P&L အတွက် commission ကို branch တစ်ခုချင်းရဲ့ commissionable sales အချိုးနဲ့ ခွဲမယ်။ | 🔒 D-COM-01 (v5.1, OPEN-03 A) — plan branch scope optional |
| C-3 ❌ | P161/P186 #12: Customer ဆီ ဘာမှ မပို့၊ Name + Phone ပဲ ယူ | R349 §9.2: Optional email confirmation | တစ်ခုရွေးပါ။ **V1 မှာ email field မထည့်တာ** ကို အကြံပြု — Name + Phone flow ပိုရှင်းတယ်။ | 🔒 D-CUS-05 |
| C-4 ❌ | R13: Booking flow မှာ "Account ဖွင့်မလား?" checkbox (R111 §6: optional account) | P128, P163, P186 #11: V1 မှာ customer account မရှိ၊ customer ကို ဘာမှ မမေး | Checkbox ကို flow ထဲက **ဖြုတ်**။ | 🔒 D-CUS-04 |
| C-5 ⚠️ | R19: START ကို service မရွေးခင် နှိပ် | P282: Walk-in → Barber ရွေး → START | နှစ်ခုလုံး ကိုက်တယ် — START မှာ **performer + branch** ပဲလို၊ service ကို COMPLETE မှာ ရွေး။ | 🔒 REC-12 → D-VIS-02 (v5.1) |
| C-6 ⚠️ | P212: Idle 4 နာရီ timeout | P213: Stay signed in | Final = P213။ Shared branch device အတွက် §3.2 PIN lock ထပ်ထည့်။ | 🔒 D-AUTH-06 · ✖ REC-04 (v4 — shared device မသုံး, D-AUTH-07) |
| C-7 ⚠️ | P295: Role အများကြီး | P300: "Role ပြောင်းရင် အဟောင်းကို ဖြုတ်" | "Role assignment တစ်ခုကို ဖြုတ်/ပြောင်းရင် **အဲ့ assignment** ပဲ သက်ရောက်" လို့ ရှင်းရှင်းရေး။ | 🔒 REC-13 → D-ROLE-06 (v5) |
| C-8 ❌ | R44/P45 (ပထမဆုံး အဆိုပြု/လက်ခံ), R141, R239: "Staff Advance" က expense category | R61, R348: Advance ကို payroll ကနေ ပြန်ဖြတ် | Double counting (§3.8)။ **Staff Advance ကို expense category ထဲက ဖြုတ်**။ | 🔒 REC-15 → D-FIN-02 (v4, P390) |
| C-9 ⚠️ | R38: SEND နှိပ်တာနဲ့ status "IN TRANSIT" + stock ကို reserve | R38 ထဲမှာပဲ သီးခြား `MARK AS IN TRANSIT` step လည်းရှိ — ဘယ်ဟာက "ပစ္စည်းတကယ်ထွက်" လဲ မဆုံးဖြတ်ရသေး (R39 က implementation ကျမှ ဆိုပြီး ချန်ထား) | `Sent` (source မှာ reserve၊ ပြင်/cancel ရ) → `Dispatched` (lock) → `Received` (တကယ်ရွှေ့) ဆိုပြီး ၃ ဆင့် ရှင်းရှင်း။ Fresha က receive မှာမှ ရွှေ့တယ်။ | 🔒 REC-14 → D-STK-03 (v5.1) — ၂ ဆင့် (SENT = ထွက်) |
| C-10 ⚠️ | R284: `Incomplete` | R355 §14.2: `Incomplete / Abandoned` | P284 အတိုင်း `incomplete` တစ်ခုပဲ သုံး။ | 🔒 D-VIS-09 |
| C-11 ✅ | R341: "Fresha = baseline" | P342/R342 🔒: "Fresha က Source of Reference ပဲ… Source of Truth က LOCK လုပ်ထားတဲ့ decisions" | **ဖြေရှင်းပြီးသား** — R341 စာသား ဟောင်းကို မကိုးကားပါနဲ့။ Decision register (Appendix A, D-PLT-09) မှာ ရေးထား။ | 🔒 D-PLT-09 |
| C-12 ⚠️ | R69: Approved leave က availability ပိတ် | Pending leave ကို ဘာလုပ်မလဲ မသတ်မှတ် (Fresha: unapproved leave ကလည်း ပိတ်တယ်) | 🟡 Owner မေး — pending leave က booking ကို ပိတ်မလား။ | 🔒 D-LV-04 (v5 — pending ကလည်း ပိတ်) |

### 3.8 Accounting မှန်ကန်မှု

> **Register:** 🔴 RISK-09, RISK-10, RISK-11 · ⚠️ REC-15, REC-16, REC-17 (🔒 D-FIN-02 / 04 / 06 ကို ပြောင်းမယ့် REC), REC-18, REC-19 · 🟡 OPEN-05, OPEN-06 · **Status (v4):** 🔒 REC-15, 16, 17 + REC-18 (estimate / final) approve → D-PAYR-04, D-FIN-02/04/06..09, D-COM-04 · REC-19 ⚠️ · 🟡 OPEN-05 (opening float စသည်), OPEN-25, OPEN-26 → §3.12

**ဘယ်လိုထင်လဲ** — Formula တွေ ကောင်းပေမဲ့ ငွေ "ဘယ်ဘက်ကို" ဝင်လဲ နည်းနည်း ရောနေတယ်။ Owner က P&L ကို အဓိကကြည့်မှာဆိုတော့ ဒါက မှားလို့မရဘူး။

**ဘာကြောင့်လဲ + ဘယ်လိုဖြစ်သင့်လဲ**

1. **Advance / Loan ≠ Expense** ❌
   - ဝန်ထမ်းကို ကြိုထုတ်ပေးတဲ့ငွေက ဆိုင်ရဲ့ ကုန်ကျစရိတ် မဟုတ်ဘူး — ဝန်ထမ်းက ပြန်ဆပ်ရမယ့် ငွေ (receivable) ဖြစ်တယ်။
   - Expense လည်းမှတ်၊ payroll မှာလည်း ဖြတ်ရင် P&L မှာ နှစ်ခါ ကုန်သလို ဖြစ်မယ်။
   - **ပြင်ရန်:** Advance/Loan ကို `employee_advances` / `employee_loans` အဖြစ်ပဲ သိမ်း၊ P&L ထဲ မထည့်။ ငွေထုတ်ပေးတာကို cash movement (ဗီရိုထဲက/bank ကနေ) အဖြစ် မှတ်။

2. **Salary expense = Gross, Net မဟုတ်** ❌
   - R46 ဥပမာမှာ expense = Net Salary 3,400,000 (deduction နုတ်ပြီး)။
   - Basic 3,000,000 + Commission 500,000 = Gross **3,500,000** က တကယ့် လစာကုန်ကျစရိတ်။ Advance ဖြတ်တာက ကုန်ကျစရိတ် လျော့တာ မဟုတ်ဘူး၊ ကြိုပေးပြီးသားကို ပြန်ရှင်းတာ။
   - **ပြင်ရန်:** Payroll finalize → Salary expense = **gross earnings**။ Net salary က "ပေးရန်ကျန်ငွေ" ပဲ။

3. **Daily closing ရဲ့ expected cash မှာ ဗီရိုထဲက ထုတ်သုံးတာ မပါသေး** ❌
   - R58/R59 → နောက်ဆုံး R351 §11.2: Expected Cash = နေ့အတွင်း valid cash payments (refund နုတ်) ပဲ။
   - R351 §11.9 က opening float ကို 🟡 optional၊ §11.10 က "Cash Out / Bank Deposit ကို Daily Closing နဲ့ မရောဘူး" (🟡) လို့ ထားတယ်။
   - ပြဿနာ — Staff meal၊ ရေဘူး၊ advance စတာတွေကို ဗီရိုထဲကပဲ ထုတ်ပေးရင် ရေတွက်တဲ့ cash က expected နဲ့ နေ့တိုင်း မကိုက်ဘဲ difference ထွက်မယ်။
   - Fresha register မှာ `cash in / cash out` (reason + attachment) ကို register ထဲမှာပဲ တွက်တယ် (`module-research/finance.md`)။
   - **ပြင်ရန်:** R351 §11.10 ကို တမင်ပြောင်းပြီး `Expected cash = opening float + cash payments − cash refunds − cash paid out (expenses/advances from drawer) ± cash in`။ Bank deposit ကိုလည်း drawer ထဲက ထွက်တဲ့ cash out အဖြစ်ပဲ ထည့်။ 🟡 Opening float ထားမလား owner မေး (Appendix B)။

4. **Progressive commission ကို period ကုန်မှ တွက်** ⚠️
   - Tier က တစ်လစာ စုစုပေါင်းပေါ် မူတည်လို့ sale တစ်ခုချင်းရဲ့ commission ကို checkout မှာ အတိအကျ မသိနိုင်ဘူး။
   - **ပြင်ရန်:** Checkout မှာ "estimated" ပဲပြ၊ payroll calculate မှာ တကယ်တွက်။ Payroll finalize ပြီးမှ refund ဖြစ်ရင် နောက်လ payroll မှာ အနုတ် line။

5. **Basic salary ကို branch ခွဲတဲ့ default** ⚠️
   - R348 §8.8 မှာ "admin configurable" လို့ပဲ ရေးထားတယ်။
   - **အကြံ:** Default = branch တစ်ခုချင်းမှာ တကယ်အလုပ်လုပ်တဲ့ နာရီ (attendance) အချိုး၊ attendance မရှိရင် primary branch။ 🟡 Owner အတည်ပြု။

### 3.9 Data လုံခြုံရေး

> **Register:** 🔴 RISK-12..RISK-15 · ⚠️ REC-20 (🔒 D-DAT-03 ကို ပြောင်းမယ့် REC), REC-21 · ✋ ACT-01, ACT-02 · **Status (v4):** 🔒 REC-20 (D-DAT-03)၊ 🔒 REC-21 (D-AUD-02)၊ ✅ ACT-01, ACT-02 → §3.12

1. **Backup: Weekly → Daily** ⚠️ — ChatGPT က R215 မှာ daily ကို အဆိုပြုခဲ့ပေမဲ့ P216 မှာ weekly ရွေးခဲ့တယ်။ Weekly ဆို server ပျက်ရင် ၆ ရက်စာ sale/closing/payroll ပျောက်နိုင်တယ်။ ကုန်ကျစရိတ် သိပ်မကွာဘူး။
   - Daily automatic backup (၃၀ ရက် သိမ်း) + weekly (၁ နှစ် သိမ်း — P217 အတိုင်း)
   - Server တစ်ခုတည်းမှာ မထား၊ off-site storage ကို copy
   - လစဉ် restore test တစ်ခါ (backup ရှိပေမဲ့ restore မရတာ အဖြစ်များဆုံး)
2. **`fresha-research` repo ကို private ပြောင်း** ✅ *(v4: 29/Sep စစ်တော့ credential မပါဘဲ ဝင်မရ — ACT-01)* ~~❌~~ — README ကိုယ်တိုင်က screenshot တွေမှာ owner နာမည်/email/ဖုန်း/Yangon လိပ်စာ ပါတယ်၊ receipt PDF မှာ လိပ်စာပါတယ်လို့ ရေးထားတယ်။ `fresha-live-findings.md` နဲ့ `fresha-commission-research.md` မှာ ဆိုင်ရဲ့ revenue, commission rule တွေ ပါတယ်။ (ChatGPT R272 က "private ဖြစ်ပေမယ့်" လို့ပြောခဲ့ပေမဲ့ ဒီနေ့ credential မပါဘဲ clone လုပ်လို့ရတယ်။)
3. **Chrome remote debugging ကို သုံးပြီးတိုင်း ပိတ်** — `chrome://inspect/#remote-debugging` untick။ Research ပြီးရင် `claude mcp remove chrome-devtools -s local` နဲ့ connector ဖြုတ်ပါ။ Auto-mode ကို ဖွင့်ထားရင် production Fresha connector ရှိနေချိန်မှာ ဘာတွေ ခွင့်ပြုထားလဲ ပြန်စစ်ပါ။
4. **Audit log ကို append-only** — App ကနေ update/delete လုံးဝ မလုပ်နိုင်အောင် DB permission နဲ့ပါ ကာ။

### 3.10 မီးပျက် / Internet ပြတ်တဲ့အချိန်

> **Register:** 🔴 RISK-04 · 🔒 D-DB-01 (UUIDv7) + D-VIS-10 (idempotent) · ⚠️ REC-02 · 🟡 OPEN-08 · **Status (v4):** 🔒 D-VIS-13 — V1 offline မလုပ် (စက္ကူ → နောက်မှ သွင်း)၊ V2 = true offline (P376)၊ OPEN-08 🔒၊ REC-02 ◐ → §3.12

**ဘယ်လိုထင်လဲ** — P1 ထဲ ထည့်ထားတဲ့ မူလ brief ရဲ့ §၉ Q11 ("မီး/internet ပြတ်ချိန်မှာ … offline mode အရေးကြီးလား") ကို ဘယ်တော့မှ မဖြေဖြစ်ခဲ့ဘူး။ R355 §14.7–14.8 က payment လုပ်နေတုန်း internet ပြတ်တာကိုပဲ ဖြေထားတယ်။ POS system အတွက် ဒါက ကျန်နေလို့မရတဲ့ decision ပါ။

**ဘာကြောင့်လဲ** — Payment မပြီးရင် FINISH မဖြစ် (P275) + stay signed in + real-time recording ဆိုတော့ internet ပြတ်တာနဲ့ ဆိုင်ရပ်မလား၊ စက္ကူနဲ့မှတ်မလား ဆိုတာ သတ်မှတ်ရမယ်။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*
- 🟡 Owner ကို မေး — "internet ပြတ်ရင် ဘယ်လိုလုပ်ချင်လဲ"
- **ဘာပဲဖြေဖြေ Day 1 ကတည်း** —
  - record ID တွေကို client-side generate လုပ်နိုင်အောင် **UUIDv7**
  - ငွေနဲ့ဆိုင်တဲ့ POST တိုင်း **idempotency key**
  - ဒါဆို နောက်ပိုင်း walk-in + cash အတွက် offline queue ထည့်တဲ့အခါ schema မပြောင်းရ
- V1 fallback = စက္ကူ + §3.1 ရဲ့ late entry (reason + permission)

### 3.11 မဆုံးဖြတ်ရသေးတဲ့ အချက်များ (gap)

> **Register:** Row တစ်ခုချင်းရဲ့ register ID ကို ညာဘက်ဆုံး column မှာကြည့်ပါ · ⏩ REC-22, REC-23, REC-26, REC-27, REC-34 · **Status (v5):** REC-22 / 23 / 26 / 27 / 34 🔒 (30/Sep)၊ REC-28 🔒 (D-BKG-21)၊ REC-29 🔒 (D-PAY-07)၊ ကျန်တာ approve မလုပ်ရသေး

| Gap | အကြံပြု default | ဘာကြောင့် | Register |
| --- | --- | --- | --- |
| Booking start time interval | **15 မိနစ်** | Live Fresha setting 15 min (live findings §3) | 🔒 D-BKG-07 (v5, REC-22) |
| Service ကြား cleanup/buffer | Service အလိုက် 0–5 မိနစ် | Fresha မှာ "blocked time / processing time" ရှိ (`services.md`) | 🔒 D-SVC-07 (v5, REC-23) |
| Walk-in က booking နဲ့ ထပ်နေရင် | START မှာ warning "10:30 booking ရှိတယ်" | Walk-in 100% ဆိုတော့ booking စလာရင် ထပ်တာ မကြာခဏ ဖြစ်မယ် | ⚠️ REC-24 |
| Business date | Asia/Yangon (UTC+06:30) date | Daily closing၊ report၊ commission period အတွက် | 🔒 D-PLT-05 · 🔒 D-PLT-15 (v5, REC-34) |
| Receipt numbering | Branch + ရက်/နှစ် အလိုက် gapless sequence (ဥပမာ `B3-2026-000125`) | Live location page မှာ "Could not fetch receipt sequencing settings" error ပြနေလို့ Fresha setting ကို မသိရ | 🔒 REC-25 → D-PAY-06 (v5.1 — `B3-2026-OCT-00125`) |
| Home Service (အိမ်အရောက် ညှပ်) | Branch ကနေ ထွက်တဲ့ visit အဖြစ်မှတ် | Live menu မှာ branch ၃ ခုလုံး MMK 20,000 နဲ့ ရှိ၊ brief မှာ မပါ | 🔒 D-SVC-06, D-BKG-22, D-SCH-03 (v5 — OPEN-17, REC-26) |
| Service catalogue ပြောင်းရွှေ့ | Branch copy ၃ ခု → master service ၁ ခု + branch price | Live မှာ "Normal / Normal cut / Normal Cut"၊ branch တစ်ခုထဲ Ear piercing ဈေး ၂ မျိုး | 🔒 D-SVC-01..03 (data task) |
| Leave types seed | Live ရဲ့ blocked-time type ၁၀ ခုကနေ ယူ (paid/unpaid flag ပါ) | DAY OFF (paid)၊ SICK LEAVE (unpaid)၊ VILLAGE (paid)… "Late to work" က attendance, leave မဟုတ် | 🔒 D-LV-01 (v5, REC-27) |
| Customer ဖုန်းနံပါတ် ရယူပုံ | FINISH screen မှာ optional field ၁ ခု | Live မှာ customer profile ၉၉ ခုပဲ ရှိ — မရယူရင် returning customer/preferred barber တွေ data မရှိ | 🔒 D-VIS-02 (v5.1 — OPEN-16) |
| Public booking abuse | Rate limit + captcha (ဥပမာ Cloudflare Turnstile) | OTP မရှိလို့ သူများဖုန်းနဲ့ booking ထည့်ပြီး one-active-booking ကို ပိတ်ထားလို့ရတယ် | 🔒 REC-28 → D-BKG-21 |
| Thermal printer + မြန်မာစာ | OS driver / browser print (image အဖြစ် print) | ESC/POS text mode printer အများစုမှာ မြန်မာ Unicode font မပါနိုင် | 🔒 REC-29 → D-PAY-07 |
| Fresha ထွက်ခွာရေး | Subscription မဖျက်ခင် report/list အကုန် CSV/Excel export | Transaction history ကို V1 မှာ မပြောင်းရွှေ့ဘဲ archive ထား | ⚠️ REC-30 · 🟡 OPEN-18 |

### 3.12 Risk walkthrough ရလဒ် (v4)

> Risk ၁၇ ခုလုံးကို owner နဲ့ တစ်ခုချင်း ဆွေးနွေးပြီး ဆုံးဖြတ်ထားတာ — RISK-01..11 = ChatGPT (P368–P397)၊ RISK-02 fallback ပြင်ဆင်ချက် + attendance fallback + RISK-12..17 + owner မှတ်ချက် = Claude chat (29/Sep ည)။
> ဒီ section = အသေးစိတ်။ Appendix A = requirement row (🔒)။ **ဒီထဲက 🟡 တွေကို DB / code ထဲ ခန့်မှန်းပြီး မထည့်ရ** (D-PLT-11)။

#### အကျဉ်း

| Risk | ဆုံးဖြတ်ချက် | 🔒 | ကျန်တဲ့ 🟡 |
| --- | --- | --- | --- |
| 01 Real-time မမှတ် | Barber ကိုယ်တိုင် ကိုယ့်ဖုန်းကနေ customer တစ်ယောက်ချင်း Complete → Payment → FINISH | D-VIS-11 | – |
| 02 Shared device | ကိုယ်ပိုင်ဖုန်း + ကိုယ်ပိုင် account; ဖုန်းမပါရင် colleague က ကိုယ့်ဖုန်းကနေ မှတ်ပေး; attendance ကို Manager ထည့် | D-AUTH-07, D-VIS-12, D-ATT-06 | ~~OPEN-20~~ ✅ (device count မမေး — v5.2.7), ~~OPEN-28~~ ✅ (B က payment ရ — v5.1) |
| 03 ငွေယူသူ ≠ ညှပ်သူ | `performed_by` / `collected_by` ခွဲ | D-VIS-06 | – |
| 04 Offline | V1 = စက္ကူ → နောက်မှ သွင်း (လုပ်ချိန် / သွင်းချိန် ခွဲ); V2 = true offline | D-VIS-13 | – (REC-02 ကျန် ✅ v5.1) |
| 05 Colour/perm ဈေး | Pricing options — option တစ်ခုချင်း / combination အလိုက် final price | D-SVC-05 | OPEN-04 detail |
| 06 Discount | ဆိုင်းထား — D-PAY-04 မပြောင်း · *v5.1:* ✅ code ပုံစံ + app approve (D-PAY-04 update) | D-PAY-04 | – |
| 07 Scope vs တစ်လ | Dev ၂ + Claude Code; V1 အကုန်; release မခွဲ | D-PLT-14 | Dev plan (DB ပြီးမှ), spec-driven ⚠️ · waitlist ⏭ (D-BKG-20, §6.4b) |
| 08 Conflict | STOP → report → owner | D-PLT-13 | – |
| 09 Advance / Loan / Salary | သီးခြား balance (receivable); salary expense = gross | D-PAYR-04, D-FIN-02, D-FIN-04 | – |
| 10 Daily closing cash | Cash Out form + Reason Master + must return + လကုန် rule | D-FIN-06..09 | OPEN-05 (opening float စသည်), OPEN-25 |
| 11 Progressive commission | Checkout = estimate; period ကုန် = final | D-COM-04 | OPEN-26 |
| 12 Backup | Daily ၃၀ ရက် + weekly ၁ နှစ် + off-site + လစဉ် restore test | D-DAT-03 | – |
| 13 Repo public | ✅ private ဖြစ်ပုံရ | ACT-01 | – |
| 14 Remote debugging | ✅ ပိတ်ပြီး; research ချိန်ပဲ ဖွင့် | ACT-02 | – |
| 15 Audit ပြင်/ဖျက် | App = ကြည့်ရုံ; DB = insert / read ပဲ; ငွေ table ကို DB က auto-record | D-AUD-02 | – |
| 16 Booking spam | Captcha + ချောင်တဲ့ rate limit | D-BKG-21 | Captcha provider (code ရေးချိန်) |
| 17 Printer မြန်မာစာ | ပုံအဖြစ် print; V1 = Android ဖုန်း; counter print device ⏭ | D-PAY-07 | – |

#### RISK-01 — Real-time recording (P368–P371)

- Point မှာ **ညှပ်တဲ့သူကိုယ်တိုင် ငွေလက်ခံ**တယ် (P371)။
- Flow: `Customer → Service → Barber: Complete (ကိုယ့်ဖုန်း) → Payment screen → Cash / KBZPay → FINISH` — customer တစ်ယောက်ချင်း service ပြီးတဲ့အချိန်မှာပဲ ပိတ်။
- REC-01 ရဲ့ "tap ၃–၄ ချက် / < 10 စက္ကန့်" = prototype မှာ တိုင်းမယ့် **target ပဲ၊ requirement မဟုတ်** (R370)။
- REC-03 (prototype + ၂–၃ ရက် pilot) = ⚠️ မဆုံးဖြတ်ရသေး။

#### RISK-02 — Personal device + ဖုန်းမပါရင် (P372, P373 → Claude 29/Sep)

- **ပုံမှန်:** Barber တိုင်း ကိုယ့်ဖုန်းမှာ app install + ကိုယ့် account နဲ့ login။ `performed_by` default = login ဝင်ထားသူ (တခြားသူအတွက် မှတ်ရင် Actual Service Barber ရွေး — D-VIS-04, D-VIS-12)။ Transaction ရိုက်ဖို့ shared counter device မသုံး → REC-04 (branch device PIN switch) ✖၊ REC-06 (counter device) ✖ (R373 → P374 လက်ခံ)။
- **ဖုန်းမပါ / ပျက် / battery ကုန် — service မှတ်တာ (D-VIS-12):**
  - တခြား barber B က **B ရဲ့ ကိုယ်ပိုင်ဖုန်း** ကနေ A အတွက် START / COMPLETE လုပ်ပေး (D-VIS-03/04 ရှိပြီးသား rule)
  - ✅ *(v5.1 — OPEN-28 (က): B က B ဖုန်းကနေ payment ပါ ရ၊ B ကိုယ်တိုင် မှတ်ပေးတဲ့ visit မှာပဲ — D-VIS-06 / 12)* ~~🟡 **Payment အဆင့် — OPEN-28 (conflict, D-PLT-13):** 🔒 D-VIS-06 (P269) က "actual service barber ပဲ checkout / payment လုပ်၊ တခြား barber က START / COMPLETE ကူလုပ်နိုင်ပေမဲ့ payment မလုပ်ရ၊ exception = admin override + reason" လို့ ဆိုတယ်။ A ဖုန်းမပါတဲ့ case မှာ B က B ဖုန်းကနေ payment ပါ လုပ်ခွင့်ပေးမလား၊ Manager / Admin override နဲ့ပဲ လုပ်မလား — owner ဆုံးဖြတ်ရန်။~~
  - Actual Service Barber = A (ရွေး)၊ Recorded by = B (system က auto)၊ commission = A၊ B က ငွေယူရင် `collected_by` = B
  - ✖ ဆိုင်ဖုန်းပေါ်မှာ login ဝင်တာ၊ ✖ ဆိုင်ရဲ့ shared account (§0.3 v4 ကြည့်)
- **ဖုန်းမပါ — attendance (D-ATT-06):**
  - B က A အတွက် clock-in **မလုပ်ရ** — QR + GPS က "ဖုန်းကိုင်ထားသူ ဆိုင်မှာ ရှိတယ်" ပဲ သက်သေပြနိုင်တယ်။ ခွင့်ပြုရင် A အိမ်မှာနေရင်း B ကို နှိပ်ခိုင်းလို့ရသွားမယ် (buddy punching)။
  - A က Manager ကို ပြော → Manager / Admin က ကိုယ့်ဖုန်းကနေ ရောက်ချိန် ထည့် (ဥပမာ "A — 9:05 — ဖုန်းမပါ")
  - Attendance record မှာ method (`QR + GPS` / `Manual`) ခွဲမှတ်။ Manual ဆို reason မဖြစ်မနေ (preset "ဖုန်းမပါ / ပျက်" + Other စာ)။ ဘယ်သူ ထည့်လဲ audit မှာ။
  - ထည့်တဲ့ screen မှာ အဲ့နေ့ အဲ့ branch မှာ A အတွက် မှတ်ထားတဲ့ service visit တွေကို သက်သေအဖြစ် တွဲပြ (ပထမ START အချိန်က ရောက်ချိန် ခန့်မှန်းဖို့ ကူ)
  - Admin က employee တစ်ယောက်ချင်း လစဉ် manual attendance အရေအတွက် မြင်ရ
  - Clock-out: Manager ထည့်၊ မထည့်ဖြစ်ရင် shift ဆုံးချိန် auto (D-ATT-04)။ Manager ဆိုင်မှာ မရှိရင် နောက်မှ ထည့်လို့ရ။

#### RISK-03 — `performed_by` / `collected_by` (P374, P375)

- `performed_by` = service လုပ်တဲ့သူ · `collected_by` = ငွေလက်ခံတဲ့သူ
- Payment screen: **Collected by: `[ A — current barber ▼ ]`** — default = performer၊ ပြောင်းစရာမလိုရင် ဘာမှမနှိပ်ရ။ A မအားလို့ B ကို ငွေယူခိုင်းရင် dropdown ကနေ B ရွေး။
- ရွေးလို့ရတာ = authorized staff (ငွေလက်ခံခွင့် permission ရှိသူ)။
- Commission / KPI = `performed_by` ပဲ။ `collected_by` ပြောင်းလို့ commission မရွှေ့။ Cash accountability / closing = `collected_by`။

#### RISK-04 — Internet / မီးပြတ် (P376)

- **V1:** Offline transaction processing ✖။ ပြတ်ရင် စက္ကူနဲ့ service / payment မှတ် → system ပြန်ရရင် app ထဲ ပြန်သွင်း။
- ပြန်သွင်းတဲ့ record မှာ **service တကယ်လုပ်တဲ့အချိန် (`performed_at`)** နဲ့ **သွင်းတဲ့အချိန် (`recorded_at`)** ခွဲမှတ်၊ ဘယ်သူ လုပ် / ဘယ်သူ သွင်း ပါ (R376 🔒)။ 🟡 REC-02 ကျန်အပိုင်း — late entry မှာ reason + permission + report flag လိုမလား၊ "ဒီနေ့အတွင်းပဲ" ရက် ကန့်သတ်ချက်၊ outage မဟုတ်ဘဲ မေ့သွားတာကို နောက်မှ သွင်းခွင့် — OPEN-01 (Part 4)။ → **v5.1 ✅:** barber ကိုယ်တိုင် + reason + စာရင်းမပိတ်ခင် + flag / count + permission (D-VIS-13)။
- မီးပဲပျက်ပြီး internet ရှိနေရင် ဖုန်း battery နဲ့ app ဆက်သုံး။
- **V2:** True offline mode (device ထဲ ယာယီသိမ်း → sync → duplicate / conflict handle)။ UUIDv7 + idempotency key (D-DB-01, D-VIS-10) ကို V1 ကတည်းက ထားလို့ schema မပြောင်းရ။

#### RISK-05 — Service pricing options (P377–P379)

- Service တစ်ခုမှာ fixed price တစ်ခုတည်း မဟုတ်ရ — **pricing options** (ဥပမာ Hair Dye → Color: Black / Ash / Fashion · Length: Short / Medium / Long / Extra Long) သတ်မှတ်နိုင်။
- Owner ရဲ့ ပုံစံ — "base price က ဒီလောက်၊ ဒီလိုဆို ဒီလောက်" (P378)။ **Option တစ်ခုချင်း ဒါမှမဟုတ် option combination အလိုက် final price** သတ်မှတ်နိုင် (R379 direction) — combination ဥပမာ Black + Long = 20,000 · Ash + Long = 30,000 · Fashion Color + Long = 40,000 (P379)။ Base price ထားနိုင်တယ်၊ ဒါပေမဲ့ option price ရှိရင် checkout မှာ base price ကို မဖြစ်မနေ မသုံး (R379)။
- Checkout မှာ barber က option ရွေး → system က final price တွက်။ Barber ကိုယ်တိုင် ဈေးမရိုက်ရ (D-SVC-04 ဆက်)။
- Generic ဖြစ်ရမယ် — Hair Dye တစ်ခုတည်းအတွက် hard-code မလုပ် (Highlight, Perm, Treatment စသည်)။
- ~~🟡 OPEN-04 detail~~ → ✅ **v5 (30/Sep):** combination ဈေးဇယား (ကွက်တိုင်း ဈေး + ကြာချိန်)၊ branch အလိုက်၊ ကွက်လပ် = မရောင်း၊ barber override နောက်မှ (D-SVC-05); ဈေး ကြိုသတ်မှတ် (D-SVC-08)။

#### RISK-06 — Discount (P380, P381)

- Discount business rule ကို ဆိုင်းထား (🟡 OPEN-09, REC-09)။ D-PAY-04 (admin ထုတ်တဲ့ code ပဲ) မပြောင်း။ → **v5.1 ✅ (30/Sep မနက်):** code ပုံစံ + public / internal + app ထဲ တောင်း / ✔ (ဖုန်း ✖) — D-PAY-04 update။
- Code ရေးတဲ့အခါ discount logic ကို hard-code မလုပ်ဘဲ **သီးခြား၊ ပြင်ရလွယ်** အောင်။ Lock မရှိတဲ့ discount field / table ကို DB ထဲ ကြိုမထည့်။

#### RISK-07 — Scope / timeline (P382)

- Developer **၂ ယောက်** + Claude Code၊ **တစ်လ**၊ V1 scope အကုန် ပြီးအောင် — "မပြီးနိုင်လို့" feature မဖြုတ်။ REC-10 (release ခွဲ) ✖ → booking, stock အပါအဝင် V1 ထဲ (waitlist ကတော့ ⏭ — သုံးမယ့်သူ မရှိသေးလို့၊ အချိန်ကြောင့် မဟုတ် — D-BKG-20, §6.4b)။
- Feature တွေကို parallel / vertical slice ခွဲဆောက်။ Schedule နဲ့ ၂ ယောက် ခွဲဝေပုံကို development plan ဆွဲချိန်မှ (DB design ပြီးမှ — §9)။
- ~~⚠️ Spec-driven~~ → **🔒 D-PLT-17 (v5.1, 30/Sep မနက်): SDD with OpenSpec** — decision register + module spec ကို repo ထဲ (`openspec/`) ထား၊ Claude Code ကို spec / decision ID နဲ့ ညွှန်။ Owner: "ပိုမြန်မြန် ပြီးလောက်မယ်"။

#### RISK-08 — Requirement conflict (P383–P386)

- Owner က **A (ဘေးကင်းတဲ့နည်း)** ကို ရွေး — B (conflict အပိုင်းကို ကျော်ပြီး ကျန်တာ ဆက်) နဲ့ C (lock ကိုယူ၊ open ကို skip) ✖။
- Flow: `Conflict တွေ့ → 🛑 STOP → ဘယ် requirement တွေ ဆန့်ကျင်လဲ ရှင်းပြ → owner ဆုံးဖြတ်တာ စောင့် → ပြီးမှ ဆက်`
- အထူးသဖြင့် business rule, DB behavior, payment / finance, commission / payroll, permission / security, data lifecycle မှာ ခန့်မှန်းမရေးရ။
- Claude Code prompt / `CLAUDE.md` မှာ mandatory rule: *"If you encounter conflicting requirements, do not choose one yourself. Stop implementation and report the conflict for owner decision."*

#### RISK-09 — Advance / Loan / Salary (P387–P390)

- **Salary Advance** (လစာကြိုထုတ်) နဲ့ **Staff Loan** (ဝန်ထမ်းချေးငွေ) — နှစ်မျိုးလုံး support၊ သီးခြား record / balance။
- နှစ်မျိုးလုံး = ပြန်ရမယ့်ငွေ (receivable)၊ **expense မဟုတ်**။ "Staff Advance" expense category မထား (REC-15)။
- Payroll မှာ deduction အဖြစ် settle — repayment က salary expense ကို မလျှော့။
- **Salary Expense = Gross** · **Net = ဝန်ထမ်းကို တကယ်ပေးရမယ့်ငွေ** (REC-16)။

#### RISK-10 — Daily closing cash (P390–P395)

- **Cash in** = cash payment တွေကို system က auto တွက် (သီးသန့် မရိုက်ရ)။
- **Cash out** = ဗီရို (drawer) ထဲက ထုတ်တိုင်း Cash Out form — amount, reason, note, recorded by။ Must return reason ဆို **ဘယ်သူယူလဲ (who took it)** + ရက်စွဲ ပါ (R394)၊ 🟡 expected return date — optional / required နောက်မှ ဆုံးဖြတ်။ စာအုပ်ထဲ အရင်မှတ်ပြီး ညနေ closing မှာ ပြန်သွင်းလို့ရ။
- Expected cash ထဲမှာ cash out တွေ ပါ (REC-17)။ 🟡 opening float၊ ဘယ်သူ ပိတ်၊ လက်ခံနိုင်တဲ့ difference (OPEN-05)။
- **Cash Out Reason Master** (Admin ထိန်း): Reason name · Must Return ☑ · Expense Category (Must Return ဆို မဖြစ်မနေ) · Active / Inactive။ Reason က accounting ကို ဆုံးဖြတ်တယ် —

  | Reason (ဥပမာ) | Must Return | Expense Category | ဘာဖြစ်လဲ |
  | --- | --- | --- | --- |
  | Admin Temporary Withdrawal | ☑ | Admin / Other | ပြန်ထည့်ရမယ် — လကုန်အထိ မပြန်ရင် expense (အောက်က rule) |
  | Staff Meal | – | Staff Meal | Expense |
  | Electricity Payment | – | Electricity | Expense |
  | Supplier Payment | – | Supplier / Other | Expense |
  | Staff Advance / Staff Loan | – | – | Employee balance (RISK-09) |
  | Bank Deposit | – | – | Cash → bank ရွှေ့တာ |

- **Must Return လကုန် rule:** လကုန် စာရင်းချုပ်ချိန်အထိ ပြန်မထည့်ရသေးရင် → သတ်မှတ်ထားတဲ့ category အောက်မှာ **အဲ့လရဲ့ expense** အဖြစ် auto တွက်။ ဒါပေမဲ့ **ပြန်ထည့်ရမယ့် တာဝန် မပျောက်**။ နောက်မှ ပြန်ထည့်ရင် ယခင်လ expense ကို **ပြန်မဖျက်** — ပြန်ထည့်တဲ့လမှာ **Cash Return** transaction ဝင်ပြီး outstanding ပိတ် (R394, P395 လက်ခံ)။ 🟡 အဲ့ Cash Return ကို အဲ့လ P&L မှာ income အဖြစ် ပြမလား (OPEN-25)။

#### RISK-11 — Progressive commission (P396, P397)

- Checkout မှာ ပြတဲ့ commission = **estimate** ပဲ၊ payroll အတွက် final မယူ။
- Commission period ကုန်မှ period တစ်ခုလုံးရဲ့ final commissionable sales နဲ့ **final** တွက်။
- 🟡 Payroll finalize ပြီးမှ refund / adjustment ဖြစ်ရင် negative commission ကို ဘယ် period မှာ ဘယ်လိုထည့်မလဲ (OPEN-26)။

#### RISK-12 — Backup (Claude 29/Sep)

- Daily backup ၃၀ ရက် သိမ်း · Weekly backup ၁ နှစ် သိမ်း · Off-site copy (server နဲ့ သီးခြားနေရာ) · လစဉ် restore test တစ်ခါ · Backup fail → admin notification။

#### RISK-13, 14 — Security actions (Claude 29/Sep)

- ACT-01 ✅ — repo private ဖြစ်ပုံရ (§3.0.6)။
- ACT-02 ✅ — remote debugging ပိတ်ပြီး။ Research လုပ်ချိန်ပဲ tick၊ ပြီးတာနဲ့ untick။ Connector ကို Fresha research လုံးဝ မလိုတော့မှ ဖြုတ်။

#### RISK-15 — Audit append-only (Claude 29/Sep)

1. App ထဲမှာ audit ကို **ကြည့်လို့ပဲ** ရ — ပြင် / ဖျက် button မရှိ (Admin အတွက်လည်း မရှိ)။
2. Database ဘက်ကလည်း app ရဲ့ DB user ကို audit table ပေါ်မှာ **INSERT + SELECT ပဲ** ခွင့်ပြု (UPDATE / DELETE ပိတ်) — code bug၊ Claude Code မှားရေးမိတာ၊ app hack ဖြစ်လည်း audit မပြောင်းနိုင်။
3. **ငွေနဲ့ဆိုင်တဲ့ table** (sale, payment, cash out, payroll) ပြောင်းတိုင်း **database ကိုယ်တိုင်က auto မှတ်** — code က audit မှတ်ဖို့ မေ့ရင်တောင် မှတ်မိ။ "ဘယ်သူ ပြောင်းလဲ" မပါတဲ့ row ပေါ်ရင် bug ဒါမှမဟုတ် DB တိုက်ရိုက်ပြင်ထားတာ။ Table အတိအကျ = အဲ့ table တွေရဲ့ DB part မှာ သတ်မှတ်။
4. ✖ Server ကိုင်တဲ့ developer (DB အကြီးဆုံး account) ကိုပါ ပိတ်တာ — V1 မှာ မလုပ်။ သံသယရှိရင် daily backup နဲ့ တိုက်စစ်။

- Data မှားထည့်တာကို ပြင်လို့ ရတုန်းပဲ (D-VIS-08 adjustment)။ ပြင်တိုင်း audit မှာ စာကြောင်းအသစ် တိုးတာ — audit စာကြောင်းဟောင်းကို ပြင်တာ မဟုတ်။
- System error (crash, 500) က audit ထဲ မဝင် — error monitoring သီးသန့် (REC-38)။

#### RISK-16 — Public booking spam (Claude 29/Sep)

- **Captcha** — Cloudflare Turnstile ဒါမှမဟုတ် Google reCAPTCHA v3 (နှစ်ခုလုံး လူကို ဘာမှမခိုင်းဘဲ နောက်ကွယ်က စစ်)။ Provider ကို code ရေးချိန် ရွေး။ reCAPTCHA free quota = လစဉ် 10,000 assessment (29/Sep စစ်ထား — [phpcaptcha.org](https://phpcaptcha.org/recaptcha-pricing/)) — booking submit မှာပဲ စစ်ရင် လုံလောက်။
- **Rate limit** — IP တစ်ခုကနေ ခဏအတွင်း booking များရင် စောင့်ခိုင်း။ မြန်မာ mobile network မှာ ဖုန်းအများကြီး IP တစ်ခု မျှသုံးလို့ **ချောင်ချောင်** ထား (ဥပမာ တစ်နာရီ ၁၀ ခု)၊ နံပါတ်ကို နောက်မှ ပြင်လို့ရ။
- D-BKG-10 (OTP / account မလို) မပြောင်း — customer ဘက် ထပ်ဖြည့်စရာ မရှိ။
- မကာနိုင်တာ: သူများဖုန်းနံပါတ်နဲ့ **တစ်ခါ** ထည့်တာ → customer က ဆိုင်ကိုဆက် → Manager / Admin က booking အတုကို cancel (D-BKG-13)။

#### RISK-17 — Receipt printer (Claude 29/Sep)

- Receipt print = V1 မှာ **မဖြစ်မနေ ပါ** (D-PAY-07)၊ ဆိုင်က အခု သိပ်မထုတ်သေးရင်လည်း။
- မြန်မာစာ — receipt ကို **ပုံ (image) အဖြစ် ဆွဲပြီးမှ** print (REC-29)။ Printer အမျိုးအစား မရွေး။
- **V1 (က):** Android ဖုန်း → Bluetooth thermal printer တိုက်ရိုက်။ iPhone PWA က Bluetooth printer မသုံးနိုင် → iPhone သုံးသူဆိုရင် Android သုံးတဲ့ colleague ဒါမှမဟုတ် Manager က အဲ့ sale ကို ဖွင့်ပြီး print (ပထမဆုံး print — reprint မဟုတ်)။
- **နောက်မှ (ခ) ⏭:** Counter မှာ print သက်သက် device (Windows PC / Android tablet) — sale မမှတ်၊ printer ပဲ ထိန်း၊ ဘယ်ဖုန်းက "Print" နှိပ်နှိပ် auto ထုတ်။ Design မှာ နေရာချန်ထား။ iPhone သုံးသူ များလာရင် / print ခဏခဏ ထုတ်လာရင် ဆောက်။
- Android app shell က Bluetooth သုံးနိုင်ရမယ် → Capacitor (REC-32 ⚠️ ဆုံးဖြတ်ချိန်)။

#### Owner မှတ်ချက် (29/Sep — "မေ့မှာစိုးလို့")

1. **ဘာသာစကား** (D-PLT-03 update) — System ရော website ရော MM / EN။ Screen ပေါ်က စာသားအားလုံး (button, label, error message) ကို language file ၂ ခု (my, en) ထဲမှာပဲ စု — code ထဲ စာသား တိုက်ရိုက်မရေး၊ တစ်နေရာပြင်ရင် အကုန်ပြောင်း (next-intl)။ Admin ရိုက်ထည့်တဲ့ data (branch နာမည်၊ လိပ်စာ၊ service နာမည်) ၂ ဘာသာ သိမ်းပုံ = F-P1-07 (Part 1 lock ချိန်)။
2. **Form rule** (D-UI-01) — required field label ဘေး **အနီ (\*)**; error ဖြစ်ရင် field ကို **အနီ outline** + error message; error စာသား = language file ထဲက။ UI rule အဖြစ် spec ထဲ ရေး။ ⚠️ *Assistant အကြံ (approve မလုပ်ရသေး):* error message ကို field အောက်မှာ ပြ၊ **form component တစ်ခုတည်း** ကို form အားလုံး သုံး (dev ၂ ယောက်ရဲ့ Claude Code တစ်ယောက်တစ်မျိုး မဖြစ်အောင်)။
3. **Development ပုံစံ** (D-PLT-14) — dev ၂ ယောက် Claude Code နဲ့ ပြိုင်တူ၊ တစ်လ။ "ဘယ်လို develop ရင် အမြန်ဆုံးလဲ — spec driven ဆိုလား" ကို သေချာစဉ်းစားဖို့ owner က မှတ်ခိုင်း — ⚠️ spec-driven (§5.1 #3) ကို DB design ပြီးမှ dev plan နဲ့အတူ ဆုံးဖြတ် (§9)။

---

## 4. Fresha research repo ကို ဆန်းစစ်ချက်

### 4.1 Repo ထဲမှာ ဘာရှိလဲ

| Study | နေ့စွဲ | Scope | ကန့်သတ်ချက် |
| --- | --- | --- | --- |
| Sandbox (`module-research/*`, `gap-analysis.md`, `owner-decisions.md`, `ux-analysis.md`) | 27/Sep | "Baber Shop" test workspace — Singapore/SGD, trial, location 2 ခု, bookable staff 3 ယောက်၊ workflow တွေကို တကယ်လုပ်ကြည့် | MMK၊ +95၊ scale (15 barbers) ကို မစစ်ရ၊ barber login မရှိ၊ **trial ~04/Oct ကုန်မယ်** |
| Live (`fresha-live-findings.md`) | 28/Sep | "Point barbershop" production — read-only, shared "RC Team" (High role) login | Owner-only settings (payment methods, tax, pay runs, rosters, Settings → Team) မမြင်ရ။ Commission plan setting ကိုတော့ Team member → Pay ကနေ မြင်ရ |
| Live commission (`fresha-commission-research.md`) | 28/Sep | Commission plan ၃ ခုရဲ့ settings, rules, history | Commission report "Report data can't be fetched"၊ pay run မမြင်ရ |

**Quality:** ကောင်းတယ်။ ချက်တိုင်းကို OBSERVED / USER-PROVIDED / INFERRED / NOT VERIFIED ခွဲထားတယ်၊ evidence path ပါတယ်၊ Fresha ကို copy ကူးဖို့ မဟုတ်ဘဲ reference အနေနဲ့ပဲ ရေးထားတယ်။

**Stale ဖြစ်နေတာ:** `executive-summary.md` နဲ့ `fresha-gap.md` က "live account wasn't accessed" လို့ ရေးထားဆဲ။ README ကတော့ live study ၂ ခုကို ညွှန်ထားပြီး။ စာရွက် ၂ ခုရဲ့ အပေါ်ဆုံးမှာ live study ကို ညွှန်တဲ့ note တစ်ကြောင်း ထည့်ပါ။

### 4.2 Live account အဓိကကိန်းဂဏန်းများ

| Metric | Value | Source |
| --- | --- | --- |
| Services/day | ~90 (Branch 3.0 ≈37 · 2.0 ≈34 · 1.0 ≈19) | live §11 |
| Revenue (Sep 1–28) | Payments MMK 20,303,000 (313 ခု) · appointment value MMK 20,513,000 | live §11 |
| All-time payments | 5,490 ခု · MMK 258,496,500 · Cash 5,487 · "K pay" 2 · Other 1 · **refund 0** | live §11 |
| Online booking / requested barber (Sep) | **0% / 0%** | live §11 |
| Client profiles | 99 (duplicate ပါ) | live §10 |
| Team | 14 (bookable barbers 13 + "RC Team") | live §5 |
| Commission plan ရှိသူ | 13 ယောက်ထဲက **3 ယောက်** — monthly progressive 15% / 20% (2,250,000 threshold) | commission §1 |
| Manual discounts (Sep) | 30 items · −MMK 117,000 | live §12 |
| Registers / tips / clock-ins (Sep MTD) · products (အားလုံး) | မသုံး (0) | live §7, §11, §12 |
| Leave/lateness | Custom blocked-time type 10 ခု (paid/unpaid) | live §3 |

### 4.3 Research ကြောင့် design ပြောင်းသင့်တာ

| Research finding | Design အပေါ် သက်ရောက်ပုံ |
| --- | --- |
| After-the-fact recording, shared login | §3.1, §3.2 — tap အနည်းဆုံး walk-in, PIN switch, late entry *(v4: ကိုယ်ပိုင်ဖုန်း real-time 🔒 D-VIS-11 / D-AUTH-07; PIN switch ✖)* |
| လူ ၃ ယောက်ပဲ payment ယူ | §3.3 — `collected_by` |
| Colour/perm ဈေး ပြောင်း | §3.4 — price range / variants |
| Manual discount 30 ခု | §3.5 — standing codes |
| Online 0%, stock 0 | §8 — phase ခွဲ |
| Branch ဈေး ၃ ဆင့် + duration မတူ | ✅ lock အတိုင်း မှန် |
| KBZPay 2 ကြိမ်ပဲ | KBZPay reference flow က V1 မှာ ရှိပေမဲ့ UI ကို cash-first ထား |
| Blocked-time 10 types | Leave type + attendance category ကို ဒီကနေ seed |
| Commission plan မရှိတဲ့ barber 10 ယောက် | 🟡 သူတို့ ဘယ်လိုရလဲ — commission engine design မပြောင်းခင် မေးရမယ့် အရေးကြီးဆုံးမေးခွန်း |

### 4.4 Research ကို ဘယ်လို ဆက်သုံးမလဲ
- Owner login ရရင် Appendix C checklist နဲ့ read-only ထပ်စစ်။ Implementation ကို မစောင့်ပါနဲ့ — ဒီအချက်တွေကို setting/feature flag အဖြစ် design လုပ်ထား။
- Sandbox trial မကုန်ခင် (04/Oct) လုပ်ရမှာ — barber-level login နဲ့ ဘာမြင်ရလဲ စမ်း (`executive-summary.md` "Recommended Next Research" #2)။
- Research repo နဲ့ product repo ကို ခွဲထား။ Product repo `docs/research/` မှာ link + ဒီ review ပဲ ထည့်။
- *v5.2.6 (01/Oct):* Admin panel UI/UX guideline (`docs/ux/admin-panel.md` §11) က `ux-analysis.md` (click / screen count, cross-cutting observation, mobile 390 px / tablet 820 px) + `module-research/*` + `evidence/` screenshot ကို **adopt (၁၉) / improve (၂၀) / avoid** table အဖြစ် သုံးထား (commit `7137637`)။ Public booking flow reference = `docs/ux/frontend-website.md` §12 (third-party public venue — `public-0x-*.png`)။ Guideline က evidence path ကို ကိုးကားထားလို့ repo ကို ဖျက်မပစ်ပါနဲ့ — **private ပဲ ပြန်ပြောင်း (ACT-07)**။

---

## 5. Platform နဲ့ Architecture — Claude Code နဲ့ Build မယ်ဆိုရင်

> ⚠️ **ဒီ section တစ်ခုလုံးက architecture အကြံပြုချက် (recommendation) ပါ — approve မလုပ်မချင်း requirement မဟုတ်ဘူး** (🔒 D-PLT-11)။ Lock ပြီးသားက platform (D-PLT-01, D-PLT-02, D-PLT-10) နဲ့ DB naming (D-DB-01) ပဲ။ ကျန်တာ register ID — thin shell REC-32၊ pg-boss REC-31၊ §5.4 DB pattern REC-33 / REC-34၊ iOS session REC-05၊ counter device REC-06၊ website REC-35၊ email / monitoring REC-38 (§3.0.5)။ Approve တဲ့အခါ ADR တစ်ခုစီ ရေးထားပါ။

### 5.1 အခြေခံ principle

1. **Modular monolith** — Backend တစ်ခု၊ DB တစ်ခု၊ module boundary ရှင်းရှင်း။ Microservice မလုပ်။
2. **Business rule ကို DB constraint နဲ့ ကာ** — Rule တွေကို code ထဲမှာပဲ မထားဘဲ constraint ဖြစ်နိုင်သမျှ DB မှာပါ ထည့်။ Claude Code က code ပြင်ရင်း rule တစ်ခု မေ့သွားရင်တောင် DB က ပိတ်ထားမယ်။
3. **Spec-driven** — Decision register + module spec ကို repo ထဲထား၊ Claude Code ကို decision ID နဲ့ ညွှန်ပြီး ခိုင်း။ → **🔒 D-PLT-17 (v5.1): SDD tool = OpenSpec** (`openspec/` — proposal → spec delta → tasks → apply → archive; decision register = spec source)။
4. **Handover-friendly** — Service အရေအတွက် နည်းနိုင်သမျှ နည်း။ Runbook ပါ။ (R2 "နောက် developer တစ်ယောက်က repo + documentation ယူပြီး ဆက်နိုင်ရမယ်")
5. **Thin native shell** — Android/Windows app တွေက hosted web app ကို ဖွင့်ရုံ။ Update တိုင်း APK/EXE ပြန်ပို့စရာ မလို။

### 5.2 Stack — ChatGPT အဆိုပြုချက် vs အကြံပြုချက်

| Layer | Conversation ထဲက (P1 brief, R1–R3) | အကြံပြုချက် | ဘာကြောင့် |
| --- | --- | --- | --- |
| Backend | NestJS + TypeScript | ✅ ထား | Module structure က business module နဲ့ ကိုက်တယ်၊ guard/interceptor နဲ့ permission + audit ထည့်ရလွယ် |
| Database | PostgreSQL | ✅ ထား | Exclusion constraint, partial unique index, `timestamptz`, JSONB audit |
| ORM | Prisma | ✅ ထား (⚠️ SQL migration နဲ့ ဖြည့်) | Exclusion constraint တွေကို Prisma schema မှာ ရေးလို့မရ — `prisma migrate dev --create-only` နဲ့ SQL ကိုယ်တိုင်ထည့် |
| Job queue | Redis + BullMQ | ⚠️ **pg-boss (Postgres ပေါ်မှာ run တဲ့ queue)** | No-show timer, backup, notification အတွက် လုံလောက်တယ်။ Service တစ်ခု လျော့တယ် (handover ပိုလွယ်)။ Scale လိုမှ Redis ထည့် |
| Realtime | Socket.IO | ✅ ထား | Instance တစ်ခုတည်းဆို Redis adapter မလို |
| Frontend | Next.js + TS | ✅ **Next.js ထား** (App Router၊ route group ၂ ခု — §5.8) | Public website (P1) ကို Google ရှာရင်တွေ့ဖို့နဲ့ Facebook/Viber မှာ share ရင် preview ပေါ်ဖို့ server render လိုတယ်။ Staff/admin ဘက်ကို client-side ရေး။ Business logic ကို Next.js server action ထဲ မထည့်ဘဲ NestJS ထဲမှာပဲ ထား။ *(ဒီ review ရဲ့ ပထမ version က P1 ရဲ့ website requirement ကို လွတ်သွားပြီး Vite SPA ကို အကြံပြုမိတယ် — ပြင်ပြီး)* |
| UI | Tailwind + shadcn/ui | ✅ ထား | *v5.2.6:* token / component / pattern rule = `docs/ux/admin-panel.md` §3, §6, §14 + `frontend-website.md` §3, §6 (token file တစ်ခုတည်း ၂ ဘက်မျှသုံး); colour / font တန်ဖိုး = team (D-UX-02); icon = lucide-react |
| Form/State | TanStack Query + React Hook Form + Zod | ✅ ထား | Zod schema ကို `packages/shared` မှာထားပြီး frontend/backend မျှသုံး |
| i18n | next-intl | ✅ ထား | MM/EN key, Noto Sans Myanmar / Pyidaungsu |
| Android | APK (Capacitor/TWA) | ✅ **TWA ဒါမှမဟုတ် Capacitor shell — hosted URL ကိုဖွင့်** | Update အတွက် APK ပြန်မပို့ရ။ Bluetooth printer လိုမှ Capacitor plugin · *v4: D-PAY-07 အရ Android ဖုန်းကနေ Bluetooth print လိုပြီ → Capacitor* |
| Windows | .exe | ✅ **Tauri 2** (သေးတယ်) ဒါမှမဟုတ် Electron | Silent print၊ desktop shortcut။ အလွယ်ဆုံးက Edge "Install app" ပေမဲ့ user က .exe လိုချင်တယ် (P3) |
| iOS | PWA first (R2); native ❌ V1 (R359) | ✅ **PWA (Home Screen web app)** — V1 မှာ native မလုပ် | Customer က install စရာမလို၊ staff အတွက်ပဲ။ ကန့်သတ်ချက်နဲ့ ဖြေရှင်းပုံ §5.7 |
| Printing | — | Browser print + 58/80mm CSS `@page`၊ silent print က shell ကနေ | မြန်မာစာ ရုပ်ပုံအဖြစ် ထွက်မယ် (§3.11) · *v4: 🔒 D-PAY-07 — ပုံအဖြစ် print၊ V1 = Android ဖုန်း → Bluetooth* |
| Email OTP | — | Transactional email provider (SES / Postmark / Resend စသည်) | Gmail SMTP နဲ့ ပို့ရင် spam/နောက်ကျတာ ဖြစ်နိုင် |
| Hosting | Singapore VPS + Docker Compose + Caddy | ✅ ထား | Daily backup ကို off-site (§3.9) |
| Monitoring | — | Uptime check + error tracking | ညဘက် မသိဘဲ ပျက်နေတာ ရှောင်ရန် |

### 5.3 Module map (bounded contexts)

```
                        ┌──────────────── platform ────────────────┐
                        │ auth · users · devices · audit · notify  │
                        │ settings · files · import/export · jobs  │
                        └──────────────────────────────────────────┘
 organization ──► people (employees, roles, permissions, assignments)
      │                    │
      ▼                    ▼
  catalog ──────► scheduling (shifts, leave, attendance, availability)
 (services,                │
  prices)                  ▼
      │              booking (bookings, waitlist, no-show)
      │                    │
      ▼                    ▼
      └──────────► service delivery (visits, visit lines)
                           │
                           ▼
                   sales & payments (sales, items, payments,
                   adjustments, refunds, receipts, discount codes)
                     │              │                   │
                     ▼              ▼                   ▼
             cash & closing    commission ──► payroll ──► finance
             (daily closing,   (plans, tiers,   (runs,      (income, expense,
              cash movements,   calculations)    payslips,   approvals, P&L)
              reconciliation)                    advances,
                                                 loans)
                           inventory (products, stock, movements, transfers)
                                       ▲
                                       └── sales & payments (product lines)
```

**Rule:** Module တစ်ခုက သူ့ table ကိုပဲ ရေး။ တခြား module ရဲ့ data လိုရင် အဲ့ module ရဲ့ service ကိုခေါ်၊ ဒါမှမဟုတ် event (outbox) ကို နားထောင်။ ဥပမာ `sales` က `payment.recorded` event ထုတ် → `commission`, `closing`, `notify` က နားထောင်။ `site` (public website) module က `organization` / `catalog` / `people` ရဲ့ public field ကိုပဲ ဖတ်ပြီး `site.content_changed` event နဲ့ website cache ကို refresh လုပ်တယ် (§5.8)။

### 5.4 DB level မှာ ကာရမယ့် pattern များ

| Rule | DB မှာ ကာပုံ |
| --- | --- |
| Barber တစ်ယောက် တစ်ချိန်တည်း booking ၂ ခု မရ (branch မတူလည်း) | `btree_gist` + `EXCLUDE USING gist (employee_id WITH =, time_range WITH &&) WHERE (status IN (active))` |
| Customer တစ်ယောက် active booking တစ်ခု | Partial unique index `ON bookings(customer_id) WHERE status IN ('booked','started')` |
| Phone unique | Normalize ပြီးသား E.164 (`+959…`) ပေါ်မှာ unique |
| KBZPay reference ထပ်မရ | `UNIQUE (payment_method_id, external_reference) WHERE external_reference IS NOT NULL` |
| ငွေ | `bigint` MMK (float လုံးဝမသုံး)၊ rate ကို basis point integer ဒါမှမဟုတ် `numeric(7,4)` |
| အချိန် | `timestamptz` (UTC သိမ်း) + `business_date date` (Asia/Yangon နဲ့တွက်) |
| FINISH ပြီး မပြင်ရ | Status `finished` ဆို update ပိတ်တဲ့ trigger ဒါမှမဟုတ် app layer + DB role permission |
| ဈေး/duration snapshot | Line တိုင်းမှာ `unit_price_amount`, `duration_minutes`, `service_name` ကို copy |
| Effective-dated | Salary, price, eligibility မှာ `effective_from` / `effective_to` |
| Soft delete | `status` + `archived_at` — transactional table တွေကို DELETE လုံးဝမလုပ် |
| Receipt number | `document_sequences (branch_id, doc_type, period, next_value)` ကို row lock နဲ့ တိုး |
| Audit | `audit_events` append-only (`actor_user_id, device_id, action, entity, before jsonb, after jsonb, reason, branch_id, at`) |
| Idempotency | `idempotency_keys (key, user_id, response, created_at)` — ငွေ POST တိုင်း |

### 5.5 API convention
- REST + OpenAPI (Swagger) auto-generate → frontend client type ကို generate။
- Permission ကို decorator နဲ့ — `@Can('booking.cancel')` + branch scope resolver။ UI က button ဖျောက်ရုံနဲ့ မလုံလောက်ဘူး (R292)။
- ငွေနဲ့ဆိုင်တဲ့ endpoint တိုင်း `Idempotency-Key` header လို။
- Audit ကို interceptor တစ်ခုကနေ အလိုအလျောက်။

### 5.6 Claude Code workflow

**Repo layout (pnpm monorepo)**
```
point/
├── CLAUDE.md                 # rule တိုတို + docs ကို ညွှန်
├── apps/
│   ├── api/                  # NestJS
│   └── web/                  # Next.js PWA — (site) public website + /book · (app) staff/admin
├── packages/
│   └── shared/               # Zod schema, enum, money/date util
├── shells/
│   ├── android/              # TWA / Capacitor
│   ├── windows/              # Tauri
│   └── ios/                  # (နောက်မှ၊ လိုမှ — §5.7)
├── docs/
│   ├── decisions/decision-register.md   # Appendix A ကနေ စ
│   ├── spec/<module>.md                 # module တစ်ခုချင်း spec
│   ├── glossary.md                      # MM ↔ EN ↔ DB name
│   └── runbooks/ (deploy, backup, restore, add-branch, rotate-secrets)
└── infra/ (docker-compose, Caddyfile, backup scripts)
```

**`CLAUDE.md` ထဲ ထည့်သင့်တဲ့ rule ဥပမာ**
```markdown
- Money is bigint MMK. Never use float/number for money.
- Store timestamptz in UTC; derive business_date in Asia/Yangon.
- Every money-changing endpoint requires Idempotency-Key and writes an audit event.
- Finished sales/payments/closings are immutable; corrections are new adjustment rows.
- Access = permission AND branch scope, checked in the API, never only in the UI.
- Before changing behaviour, cite the decision ID from docs/decisions/decision-register.md.
- New business rule → add a test first (commission, availability, closing, payroll).
```

**Feature တစ်ခု (vertical slice) လုပ်ပုံ**
1. `docs/spec/<module>.md` ရေး (decision ID တွေ ကိုးကား)
2. Claude Code plan mode နဲ့ plan ကို review
3. Test အရင်ရေး — အထူးသဖြင့် commission tier၊ availability၊ closing formula၊ payroll၊ Asia/Yangon (+06:30) date boundary
4. Implement → DB constraint ပါ
5. Playwright E2E (walk-in → checkout → closing)
6. Subagent နဲ့ review ("ဒီ diff က decision register ကို ချိုးဖောက်လား")
7. Merge

**အသုံးဝင်တဲ့ Claude Code setup**
- **Hooks:** file ပြင်ပြီးတိုင်း format + typecheck + အမြန် test ကို run (မြန်အောင်ထား)
- **Custom command/skill:** `/new-slice <module>` — spec → test → implement checklist
- **Seed data:** branch ၃ ခု၊ fake staff ၁၄ ယောက်၊ live ဈေး (နာမည်မပါ) — demo နဲ့ test အတွက်
- **Fresha connector:** Research ပြီးရင် ဖြုတ် (§3.9)

### 5.7 iOS — ဘယ်လိုလုပ်မလဲ

**ဘယ်လိုထင်လဲ** — V1 မှာ iOS app သီးသန့် မလုပ်ဘဲ **PWA (Home Screen web app)** နဲ့ပဲ သွားပါ။ Conversation ထဲမှာလည်း "iOS PWA first" (R2) → "iOS အခုမဆုံးဖြတ်သေး" (R3) → "iOS native package ❌ V1" (R359) ဆိုပြီး ဒီဘက်ကိုပဲ ရောက်ခဲ့တယ်။ ဒီ direction ကို သဘောတူတယ်။ ဒါပေမဲ့ iOS ရဲ့ ကန့်သတ်ချက်တွေကို design မှာ ကြိုမထည့်ရင် iPhone သုံးတဲ့ staff တွေ "login ပြုတ်တယ်၊ noti မလာဘူး" ဖြစ်မယ်။

**ဘာကြောင့်လဲ**
- iPhone မှာ `.apk`/`.exe` လို file ပေးပြီး install လို့ မရဘူး။ App လုပ်မယ်ဆိုရင် —
  - Apple Developer Program ($99/နှစ်) + App Review လိုတယ်။ Store မှာ မပေါ်စေချင်ရင် "Unlisted app distribution" ရှိပေမဲ့ App Review ကို ဖြတ်ရတုန်းပဲ။
  - Organization အနေနဲ့ enroll ရင် D-U-N-S number နဲ့ company domain ပေါ်က public website လိုတယ်။ Myanmar ကနေ enroll လုပ်တာ၊ ငွေပေးချေတာ ရ/မရ ကြိုစစ်ရမယ်။
  - Web ကို ထုပ်ထားရုံ app ကို App Review က ငြင်းနိုင်တယ် (minimum functionality)။
- PWA က ဒီနေ့ iOS မှာ လုံလောက်တဲ့အဆင့် ရောက်နေပြီ —
  - iOS 16.4+ — Home Screen ကို ထည့်ထားရင် Web Push notification ရတယ်
  - iOS 26 — Home Screen ကို ထည့်တဲ့ site တိုင်း default web app အဖြစ် ဖွင့်တယ်
  - Camera (QR scan) နဲ့ GPS ကို app ဖွင့်ထားချိန်မှာ သုံးလို့ရ → QR + GPS attendance (D-ATT-01) အလုပ်ဖြစ်တယ်
- Customer ဘက်မှာ iPhone ပေါ် ဘာမှ install စရာမလို — booking link ကို Safari ကနေ ဖွင့်ရုံပဲ။ ဒါကြောင့် iOS "app" လိုတာ staff (barber / manager / admin) ပဲ။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*

| အချက် | iOS မှာ ဖြစ်ပုံ | Design မှာ ဘာထည့်မလဲ |
| --- | --- | --- |
| Install | Android လို auto install prompt မရှိ | App က iPhone ကို သိရင် "Share → Add to Home Screen" guide screen ပြ + runbook မှာ screenshot နဲ့ ရေး |
| Login | Home Screen app ရဲ့ storage က Safari နဲ့ သီးခြား | Install ပြီးမှ **app ထဲမှာ** login ဝင် (Email OTP / Google) လို့ guide မှာ ရေး |
| Stay signed in (D-AUTH-06) | Script နဲ့ ရေးထားတဲ့ storage (localStorage စသည်) ကို iOS က ဖျက်နိုင်တယ် | Session ကို server က set တဲ့ `HttpOnly; Secure` cookie + refresh token rotation နဲ့ လုပ်။ Token ကို localStorage မှာ မထား |
| Notification | Home Screen app ဖြစ်မှ push ရ၊ permission ကို user က button နှိပ်မှ တောင်းလို့ရ | In-app bell (D-NTF-01) က အဓိက။ Web Push (VAPID) ကို "Notification ဖွင့်မယ်" button နဲ့ optional ထား — Android / Windows / iOS code တစ်ခုတည်း |
| Attendance | Camera / GPS က foreground ပဲ | QR + GPS ကို app ဖွင့်ထားချိန်ပဲ စစ် — design အတိုင်း ဖြစ်ပြီးသား |
| Printing | Web Bluetooth မရ၊ browser print = AirPrint ပဲ | ~~Branch counter device~~ *v4 (🔒 D-PAY-07):* V1 မှာ counter device မထား — iPhone သုံးသူရဲ့ sale ကို Android colleague / Manager က print။ Print သက်သက် counter device = ⏭ နောက်မှ |
| Background | Background sync မရ | Offline queue (*v4:* V2 — D-VIS-13) က iOS မှာ app ဖွင့်ထားမှ sync ဖြစ်မယ် |

**နောက်မှ native လိုလာရင်** — WKWebView wrapper (PWABuilder iOS package / Capacitor စသည်) နဲ့ hosted URL ကို ထုပ်ပြီး APNs push လို native feature ထည့်ပေးရမယ်။ Mac ဒါမှမဟုတ် cloud build service လိုတယ်။ ဒီအချိန်မှ လုပ်ပါ —
- (a) iPhone သုံးတဲ့ staff များပြီး push / login ပြဿနာ တကယ် တိုင်ကြားလာရင်
- (b) iPad ကို counter device အဖြစ် Bluetooth printer နဲ့ သုံးချင်ရင်

🟡 Owner ကို "staff ဘယ်နှယောက် iPhone သုံးလဲ၊ counter မှာ ဘာ device ထားမလဲ" မေးပါ (Appendix B)။ *v4: counter device မထား (D-AUTH-07, D-PAY-07) — iPhone အရေအတွက်ပဲ ကျန်။*

*iOS sources (28/Sep/2026 စစ်ထား):* [Apple — Unlisted app distribution](https://developer.apple.com/support/unlisted-app-distribution) · [Apple Developer Program — Enroll](https://developer.apple.com/programs/enroll/) · [Web apps in iOS 26 (Michael Tsai)](https://mjtsai.com/blog/2025/10/03/web-apps-in-ios-26/) · [PWAs on iOS 2026 (MobiLoud)](https://www.mobiloud.com/blog/progressive-web-apps-ios/)

### 5.8 Public website ကို Admin panel data နဲ့ အလိုအလျောက် ပြောင်း (P1)

**ဘယ်လိုထင်လဲ** — ဒါ ကျန်ခဲ့တယ်။ P1 မှာ "လိပ်စာပြောင်းတိုင်း Admin panel ကထည့်တာနဲ့ website front page မှာ သွားပေါ်နေရမယ်" နဲ့ "social media နဲ့ချိတ်ပြီး အလွယ်တကူ Booking" လို့ ပြောထားတယ်။ Procedure မှာလည်း "Frontend Website UI/UX" ပါတယ်။ Conversation က company/branch info field တွေ (R203) နဲ့ `/book` link + branch QR (P175–P179) ကိုပဲ lock လုပ်ခဲ့တယ်။ **Front page (home / branch page) နဲ့ "admin ပြင်ရင် ချက်ချင်းပြောင်း" mechanism ကို design မလုပ်ခဲ့ဘူး။** Branch ဖွင့်ချိန် (opening hours) ကလည်း P1 brainstorm မှာပဲ ပါပြီး lock မဖြစ်ခဲ့ဘူး။

**ဘာကြောင့် ဒီ design လဲ**
- **Website မှာ data သီးသန့် မရှိရဘူး** — admin panel နဲ့ DB တစ်ခုတည်းကို ဖတ်ရမယ်။ Copy နှစ်ခုရှိရင် တစ်ခုခု မေ့ပြင်မှာ သေချာတယ် (Fresha live မှာ service ကို branch အလိုက် copy ပွားထားလို့ ရှုပ်နေတာ ဥပမာပဲ)။
- **Server မှာ HTML အပြည့် render ရမယ်** — Facebook / Viber က link preview ယူတဲ့အခါ JavaScript မ run ဘူး။ Google မှာ "Point barbershop Yangon" ရှာရင် တွေ့ဖို့လည်း ဒီအတိုင်းပဲ။
- **CMS အကြီး (WordPress, Strapi) မလို** — Branch ၃ ခုပဲ ရှိတယ်။ Service တစ်ခု ပိုလာရင် handover ခက်တယ် (§5.1)။

**ဘယ်လိုဖြစ်သင့်လဲ** *(⚠️ အကြံပြုချက် — approve မှ 🔒)*

**(1) Pages — V1 minimal**

| URL | ပြမယ့်အရာ | Data |
| --- | --- | --- |
| `/` | Logo, cover ပုံ, tagline, branch card တစ်ခုချင်း (လိပ်စာ၊ ဖုန်း၊ ဒီနေ့ဖွင့်ချိန် / "ယခုဖွင့်ထား"၊ map, Book), social links, announcement | `companies`, `branches`, `branch_hours`, `site_settings` |
| `/branches/<code>` | လိပ်စာ၊ map (attendance အတွက် lat/long ရှိပြီးသား)၊ ဖုန်း (နှိပ်ရင် ခေါ်)၊ Viber၊ ဖွင့်ချိန်၊ ဒီ branch ရဲ့ service + ဈေး၊ public profile ဖွင့်ထားတဲ့ barber၊ Book | `branches`, `branch_services`, `employees` (public field ပဲ) |
| `/book`, `/book?branch=` | Lock ပြီးသား booking flow (D-BKG-01) | Availability API (cache လုံးဝမလုပ်) |
| MM / EN | Language switch | Field တိုင်း `_mm` / `_en` |

**(2) Admin panel "Website" section** — data အသစ် နည်းနည်းပဲ ထပ်လိုတယ်:
- **Branch:** `address_mm/en`, `map_url`, ဖွင့်ချိန် (နေ့အလိုက်)၊ ယာယီပိတ်ရက် notice (ဥပမာ သင်္ကြန်)၊ `is_public`
- **Service:** `show_on_website`, public description, ပုံ, ဈေးကို "from" နဲ့ ပြမလား
- **Employee:** `public_profile` toggle (**default OFF**) — ပြမယ့်နာမည်၊ ပုံ၊ specialty ပဲ။ ဖုန်း / email လုံးဝ မပြ
- **`site_settings`** (row တစ်ခုတည်း): hero text MM/EN, cover ပုံ, social links, announcement banner (start/end date), SEO title/description, share ပုံ
- **Save = ချက်ချင်း publish** — Draft/approval workflow V1 မှာ မလို။ "Website မှာကြည့်" button ပါ။ Audit log ("လိပ်စာကို ဘယ်သူပြင်လဲ") ပါ
- **Permission:** `website.manage` (admin)။ Branch manager က ကိုယ့် branch ရဲ့ ဖွင့်ချိန် / notice ပဲ ပြင်ခွင့် — 🟡 owner

**(3) "Admin ပြင်တာနဲ့ website ချက်ချင်းပြောင်း" ဖြစ်ပုံ**

```
Admin: Branch 3 လိပ်စာ ပြင် → Save
   ↓
NestJS API: validate → DB update → audit_events
            → outbox event  site.content_changed { tags: ["branch:B3", "home"] }
   ↓ (pg-boss job — စက္ကန့်ပိုင်း)
Next.js: POST /api/revalidate (secret)  →  revalidateTag("branch:B3"), revalidateTag("home")
   ↓
နောက် visitor → page ကို DB data အသစ်နဲ့ render → ပြန် cache
```

- Public page တွေကို Next.js server မှာ render ပြီး tag နဲ့ cache ထားတယ် — မြန်တယ်၊ data ပြောင်းမှ on-demand refresh လုပ်တယ်။
- **Safety net:** time-based revalidate ၅ မိနစ် ထပ်ထား — revalidate call ပျက်သွားရင်တောင် ၅ မိနစ်အတွင်း မှန်လာမယ်။
- **Bonus:** API/DB ခဏကျနေရင် cache ထဲက page ဟောင်းကို ဆက်ပြနေလို့ website မပျက်ဘူး။
- **ပိုရိုးချင်ရင်** cache လုံးဝမထားဘဲ request တိုင်း render လည်း ရတယ် (branch ၃ ခု traffic နဲ့ performance ပြဿနာ မရှိ)။ ဒါပေမဲ့ အပေါ်က resilience ကို ဆုံးမယ်။
- **Booking availability** (အားတဲ့အချိန်) ကိုတော့ cache လုံးဝမလုပ် — request တိုင်း API ကနေ ယူ။
- **ပုံ:** upload → resize (webp) → filename မှာ hash ထည့် → ပုံပြောင်းရင် URL အသစ်ဖြစ်လို့ browser cache ပြဿနာ မရှိ။
- **Facebook / Viber preview cache:** သူတို့ဘက်မှာ preview ကို cache ထားတယ်။ Share ပုံ ပြောင်းရင် Facebook Sharing Debugger နဲ့ re-scrape လုပ်ရမယ် (runbook ထဲထည့်)။
- Staff app ကတော့ Socket.IO realtime နဲ့ ပြောင်းတယ် — public site မှာ socket မလို။

**(4) Code structure** — Next.js app တစ်ခုတည်း၊ route group ၂ ခု:

```
apps/web (Next.js App Router)
├── app/(site)/    # public: /, /branches/[code], /book — server render, SEO, share preview
└── app/(app)/     # staff + admin: client-side, TanStack Query → NestJS API
```

- Next.js server က NestJS ရဲ့ **public read-only endpoint** (`GET /public/site`, `GET /public/branches/:code`) ကို ခေါ်ပြီး render ရုံပဲ။
- Public endpoint က public field ပဲ ပြန်ပေးရမယ် (DTO သီးသန့်) — employee ဖုန်း၊ customer data လုံးဝ မပါရ။ Rate limit ထား။
- **SEO အခြေခံ:** `<title>`, meta description, Open Graph (share ပုံ), branch တစ်ခုချင်းအတွက် schema.org `HairSalon` JSON-LD (လိပ်စာ၊ geo၊ ဖွင့်ချိန်), `sitemap.xml`။ Branch တစ်ခုချင်းရဲ့ Google Business Profile ကနေ branch page ကို link ချိတ် (manual)။

**(5) Release** — Release 1 အဆုံးမှာ `/` + `/branches/<code>` ထည့်ပါ (branch data ရှိပြီးသားမို့ ~၂–၃ ရက်)။ Online booking (Release 2) မဖွင့်ခင် "Book" button ကို feature flag နဲ့ ဖျောက်ပြီး "ဖုန်းခေါ် / Viber" button ပြထား။ *v4: release မခွဲတော့ (D-PLT-14) — booking က V1 ထဲ ပါလို့ Book button ဖျောက်စရာ မလို။*

---

## 6. DB Design — Naming နဲ့ Part လိုက် အခြေအနေ

> **Status (30/Sep):** Naming convention 🔒 (D-DB-01) + number code (D-DB-03) + ၂ ဘာသာ (D-DB-04)။ **Part 1 (D-DB-02)၊ 1b (D-DB-05)၊ 2 (D-DB-06)၊ 3 (D-DB-07)၊ 4 (D-DB-08)၊ 5 (D-DB-09)၊ 6 (D-DB-10)၊ 7 (D-DB-11) 🔒** — NEXT = Part 8 (§6.2)။ Workflow = 🔒 D-PLT-12 (part လိုက်၊ DBML၊ review → lock → နောက် part)။

### 6.1 Naming convention (🔒 D-DB-01 — P361, R361, R363, P364)

**ဘယ်လိုထင်လဲ** — မင်းရဲ့ ထောက်ပြချက် (P361) မှန်တယ်၊ ChatGPT ရဲ့ R361 အဖြေကိုလည်း သဘောတူတယ်။ Business နဲ့ မရင်းနှီးတဲ့ developer က schema ကြည့်တာနဲ့ နားလည်ရမယ်။ R363 က ဒီ section ကို DB design baseline အဖြစ် ယူမယ်လို့ ပြောပြီး P364 မှာ မင်းသဘောတူခဲ့လို့ **အောက်က 1–5 ကို 🔒 D-DB-01** လို့ မှတ်ထားတယ်။ Glossary (6) ကတော့ part တစ်ခု lock လုပ်တိုင်း အဲ့ part ရဲ့ row တွေ 🔒 ဖြစ်မယ်။

1. **`users` ≠ `employees`** 🔒 — `users` = login identity (email, auth, devices)၊ `employees` = business person (code, join date, salary, branches)။ **1 : 1 — `employees.user_id` NOT NULL UNIQUE** (🔒 D-EMP-02၊ P366/P367 — login ဝင်သူ = employee ပဲ၊ အလုပ်ထွက်ရင် `users.status` / `employees.status` နဲ့ ထိန်း၊ record မဖျက်)။ *(28/Sep version မှာ 1 : 0..1 လို့ ရေးခဲ့တယ် — P366 နဲ့ ပြင်ပြီး)* "Staff" ထက် "Employee" က HR domain မှာ ပိုရှင်းတယ်။ `accounts` ဆိုတဲ့နာမည်ကို လုံးဝမသုံး (bank/accounting account နဲ့ ရောတယ်)။
2. **`payments` + `payment_methods`** 🔒 — `payment_methods` ကို data (`CASH`, `KBZPAY`) အဖြစ် seed။ Field က `external_reference` (မဟုတ် `kbzpay_ref`)။ Method အလိုက် "reference လို/မလို" ကို `payment_methods.requires_reference` flag နဲ့ (flag ကတော့ ⚠️ Part 4 မှာ ဆုံးဖြတ်)။
3. **Schema ထဲမှာ `barber` မသုံးဘဲ role-neutral** 🔒 — `performed_by_employee_id`, `booked_employee_id`, `collected_by_employee_id`, `recorded_by_user_id`။ Facial, Home Service, ear piercing လို service တွေကို barber မဟုတ်တဲ့ staff လုပ်လာနိုင်တယ်။ UI ကတော့ "Barber / ဆံပင်ညှပ်ဆရာ" လို့ ပြလို့ရတယ်။ *(🔒 က naming ပုံစံပဲ — `collected_by_employee_id` (REC-07)၊ `recorded_by_user_id` (REC-02) လို column တွေ ရှိမရှိက အဲ့ REC approve ပေါ်မူတည်တယ်)*
4. **Fresha-specific နာမည် မထည့်** 🔒 — `fresha_id` ကို core table မှာ မထားဘဲ `import_source_refs (source, source_id, entity_type, entity_id)` table တစ်ခုထဲမှာပဲ။
5. **Convention** 🔒 —
   - Table: snake_case, အများကိန်း (`bookings`, `booking_items`)
   - Primary key: UUIDv7 (§3.10)
   - `*_at` = `timestamptz`, `*_date` = `date`, `*_amount` = `bigint` MMK
   - `status` = ~~text enum~~ **number code `smallint` + CHECK (🔒 D-DB-03, v5)**, `archived_at` = soft delete
   - FK column = `<ref>_id`၊ user ကို ညွှန်ရင် `*_user_id`၊ employee ကို ညွှန်ရင် `*_employee_id`
   - *v5 (🔒 D-DB-03):* status / type = `smallint` number code + CHECK; number ရဲ့ အဓိပ္ပာယ်ကို DBML note မှာ ပြ; code ထဲ constant နာမည်; screen label = language file။ ~~text + CHECK / Prisma enum~~
6. **Glossary (`docs/glossary.md`)** — Term တစ်ခုကို နေရာတိုင်း တူတူသုံး။ Part lock လုပ်တိုင်း အဲ့ part ရဲ့ row တွေ 🔒 ဖြစ်မယ်:

| မြန်မာ (UI) | English (UI) | DB / code |
| --- | --- | --- |
| ဆိုင်ခွဲ | Branch | `branches` |
| ဝန်ထမ်း | Employee / Staff | `employees` |
| အသုံးပြုသူ (login) | User | `users` |
| ရာထူး / ခွင့်ပြုချက် | Role / Permission | `roles`, `permissions`, `role_permissions`, `employee_roles`, `employee_role_branches` (⚠️ F-P1-02) |
| ဝန်ဆောင်မှု | Service | `services`, `branch_services`, `employee_service_prices` |
| ဖောက်သည် | Customer | `customers` |
| ကြိုတင်ချိန်းဆိုမှု | Booking | `bookings`, `booking_items` (R365 က `booking_services` — F-BK-03) |
| ဝန်ဆောင်မှုပေးခြင်း | Visit | `visits`, `visit_items` |
| ရောင်းချမှု | Sale | `sales`, `sale_items` |
| ငွေပေးချေမှု | Payment | `payments`, `payment_methods` |
| ပြင်ဆင်ချက် / ငွေပြန်အမ်း | Adjustment / Refund | `sale_adjustments`, `refunds` |
| နေ့စဉ်စာရင်းပိတ် | Daily closing | `daily_closings`, `cash_movements` |
| ကော်မရှင် | Commission | `commission_plans`, `commission_tiers`, `commission_results` |
| လစာ | Payroll | `payroll_runs`, `payroll_lines`, `payslips` |
| ကြိုထုတ်ငွေ / ချေးငွေ | Advance / Loan | `employee_advances`, `employee_loans` |

### 6.2 Part plan နဲ့ အခြေအနေ (R360 numbering — 🔒 D-PLT-12)

> ⚠️ **Part နံပါတ် သတိ** — R365 က Customers/Booking ကို "Part 2" လို့ခေါ်ပြီး R365/R366 က Services ကို "Part 3" လို့ ခေါ်တယ်။ ဒီဖိုင်က R360 မူရင်း numbering ကိုပဲ သုံးတယ်။ Chat အသစ်မှာ part ကို **နာမည်နဲ့** ခေါ်ပါ ("Services / Scheduling part")။

| Part | Scope (R360 + ဒီ review ဖြည့်) | Status (30/Sep) | Lock မလုပ်ခင် ဆုံးဖြတ်ရမယ့်ဟာ |
| --- | --- | --- | --- |
| **1** Foundation / Organization / Access | companies, branches, users, employees, employee_branches, roles, permissions, role_permissions, employee_roles, employee_role_branches | 🔒 **v3 (D-DB-02, 29/Sep ည)** → v3.1 (login column) → v3.2 (website column) → **v3.3 (01/Oct — `users.ui_language`, `employees.show_own_earnings`)** → **v3.4 (01/Oct 10:47 — `show_own_earnings` nullable, `employees.public_rating`)** | §6.3 F-P1-02..11 · 🔒 D-ORG-03 (OPEN-22), D-ROLE-06 (REC-13) · ✅ OPEN-33, OPEN-10 (v3.3) · ✅ OPEN-37 (v3.4) |
| **1b** Auth *(ဒီ review ရဲ့ အကြံ — F-P1-08)* | `login_otps`, `user_sessions` + users column (Google ID, invite, lock) · ~~branch device + PIN~~ (REC-04 ✖ — D-AUTH-07) | 🔒 **v1 (D-DB-05, 30/Sep)** | 🔒 D-AUTH-01..05, D-AUTH-07 · REC-05 · ✅ OPEN-20 (v5.2.7 — device count မမေး) |
| **2** Services / Scheduling | service_categories, services, branch_services, option groups / values / variants, service_prices (simple + ဇယား · ဆိုင် / အိမ် · barber override), employee_service_eligibilities, schedule_patterns, schedule_shifts, leave_types, leaves | 🔒 **v1 (D-DB-06, 30/Sep)** · *v1.3 🔒 (01/Oct 21:20 owner confirm — `archived_at` × 2, API Part 2)* | ⏩ item အကုန် ✅ (D-SVC-05..07, D-LV-04/05, D-SCH-02/03, D-BKG-07, D-PLT-15) |
| **3** Customers / Booking | customers, booking_cancel_reasons, bookings, booking_items (waitlist ⏭ — §6.4b) | 🔒 **v3 (D-DB-07, 30/Sep)** — PostgreSQL test ၃၀/၃၀ (§6.4c) | ✅ F-BK-01..21 · OPEN-14, 23, 27, 29 ✅ · 🔒 D-BKG-09 (website ပဲ — app check) · §6.4b (A) waitlist ပြင်ဆင်ချက် · 🔒 D-BKG-21 (captcha / rate limit — DB မလို), D-BKG-22 (ဆိုင် / အိမ် + လိပ်စာ), D-SCH-03, D-LV-04, D-SVC-08 |
| **4** Service execution / Sales / Payments | visits, sales, sale_items (service / product / ကားခ), payments, payment_methods, receipt_counters, discount_codes (+ branches, customer_uses), discount_requests, refunds, refund_items, sale_adjustments | 🔒 **v1 (D-DB-08, 30/Sep)** — PostgreSQL test ၅၇/၅၇ (§6.4d) · **v5.2.15: constraints v1.2 (G f — FINISH guard trigger ၄ ခု) — test ၈၃/၈၃ (§6.4i)** | ✅ F-P4-01..13 · OPEN အကုန် ✅ (01, 09, 15, 16, 24, 28; REC-11, 12, 25) · products FK = Part 6 |
| **5** Commission / Payroll / Attendance | commission_plans (+ tiers), employee_commission_plans, commission_results (+ lines EARN / REVERSAL), employee_salaries, payroll_line_categories, payroll_runs, payroll_entries (+ lines, attendance_items, branch_allocations), employee_receivables (+ repayments), branch_attendance_qr_tokens, attendance_records, attendance_exceptions | 🔒 **v1 (D-DB-09, 30/Sep)** — PostgreSQL test ၇၀/၇၀ (§6.4e) · **v5.2.15: v1.1 (G a / b) — test ၈၅/၈၅ (§6.4i)** · **v5.2.16: v1.2 (OPEN-40 b ✅ — archive column) — test ၁၀၄/၁၀၄ (§6.4j)** | ✅ F-P5-01..12 · OPEN-03, 06, 19, 26 ✅ design (★ ပိုင်ရှင် data) · cash_out FK = Part 7 |
| **6** Inventory | product_categories, products, suppliers, branch_stock_levels, stock_movements (ledger), stock_adjustment_reasons, purchases (+ items), stock_transfers (+ items), stock_counts (+ items) | 🔒 **v1 (D-DB-10, 30/Sep)** — PostgreSQL test ၄၄/၄၄ (§6.4f) · **v5.2.15: v1.2 (G c) — test ၄၉/၄၉ (§6.4i)** | ✅ F-P6-01..09 · REC-14 ✅ · sale_items.product_id FK ဒီမှာ · expense FK = Part 7 |
| **7** Finance / Daily closing / P&L | expense_categories, income_categories, expenses (ledger — source ၆ မျိုး), manual_incomes, cash_out_reasons, cash_outs, cash_returns, daily_closings | 🔒 **v1 (D-DB-11, 30/Sep)** — PostgreSQL test ၄၆/၄၆ (§6.4g) · **v5.2.15: v1.1 (G d) — test ၅၈/၅၈ (§6.4i)** · **v5.2.16: v1.2 (OPEN-40 a ✅ — FK SET NULL + CHECK) — test ၇၇/၇၇ (§6.4j)** | ✅ F-P7-01..07 · OPEN-05, 25 ✅ · future FK ပြေ: receivables.cash_out_id (Part 5), expenses.purchase_id (Part 6 v1.1) · P&L = view |
| **8** System / Website | settings (+ history), audit_events (+ trigger ၁၈ ငွေ table), notification_types, notifications, attachments, import_jobs (+ rows, source_refs), backup_runs, branch_opening_hours, branch_closures · Part 1 v3.2 / Part 2 v1.2 website column | 🔒 **v1 (D-DB-12, 30/Sep)** — PostgreSQL test ၄၅/၄၅ · **full schema ၉၁ table** (§6.4h) · **v5.2.15: v1.1 (G e) — test ၅၀/၅၀ (§6.4i)** | ✅ F-P8-01..09 · 🔒 D-PLT-16, D-AUD-01/02, D-NTF-01..03, D-DAT-01..04, D-WEB-04 (OPEN-21 → data) |

**R360 plan ကို ပြင်ချင်တာ (⚠️ — approve မှ)**
- Part 7 ရဲ့ "KBZPay Reconciliation" → `payment_reconciliations` (vendor-neutral — 🔒 D-DB-01)။
- Part 8 ထဲက Discount Codes / Discount Usage → Part 4 (sale နဲ့ တိုက်ရိုက်ချိတ်လို့)။
- Part 8 ရဲ့ "Audit Logs" → `audit_events` (§5.4)။
- Auth table တွေ (🔒 D-AUTH-01..05) plan ထဲ မပါ → Part 1b (F-P1-08)။
- Part 3 ကို Part 2 မတိုင်ခင် draft လုပ်မိတယ် — `booking_items.service_id` FK နဲ့ availability (schedule / leave / eligibility) က Part 2 ပေါ် မူတည်လို့ Part 2 ပြီးမှ lock ပါ။

### 6.3 Part 1 — Foundation / Organization / Access

**Source:** R364 (draft) + P366 / R366 / P367 (🔒 `employees.user_id` NOT NULL)။ **Status (v5):** 🔒 **LOCK (29/Sep ည) — D-DB-02 = DBML v3** (F-P1-11 = OPEN-21 စောင့် — add-on) · **v5.2.7: v3.3 (01/Oct)** — owner UI/UX အဖြေကြောင့် column ၂ ခု ထပ်ဖြည့် (`users.ui_language` — OPEN-33 ✅ · `employees.show_own_earnings` — OPEN-10 ✅) · **v5.2.8: v3.4 (01/Oct 10:47)** — `show_own_earnings` nullable ("အကုန် / တစ်ယောက်ချင်း") + `employees.public_rating` (OPEN-37 ✅); Part 1b / Part 8 precedent အတိုင်း (locked table မှာ column ထပ်ဖြည့်၊ table / FK / number code မပြောင်း); D-DB-02 row

**R364 မှာ ကောင်းတာ ✅** — users / employees ခွဲထား၊ `accounts` / `staff` / `barbers` မသုံး၊ permission = module + action unique၊ employee ↔ branch history (effective date)၊ `archived_at` soft delete၊ branch code ကို company အတွင်း unique။

| ID | Finding (R364) | 🔒 / Source | အကြံပြုချက် | Status |
| --- | --- | --- | --- | --- |
| F-P1-01 | `employees.user_id` nullable (1 : 0..1) | D-EMP-02 | NOT NULL UNIQUE | 🔒 P366 / P367 |
| F-P1-02 ❌ | Branch scope ကို `role_branch_scopes (role_id, branch_id)` — role level မှာ ထားတယ်။ ဒါဆို "Manager" role ရှိသူ အားလုံး branch တူသွားမယ် | D-ROLE-05 (P299: Ko Aung = Barber → A + B၊ Manager → B) | `employee_roles.scope_type` (COMPANY / BRANCHES) + `employee_role_branches (employee_role_id, branch_id)` | ✅ approve (29/Sep ည) — Part 1 lock မှာ D-DB-02 |
| F-P1-03 | `employee_roles.effective_from / to` = date — "ဖြုတ်တာနဲ့ ချက်ချင်း" ကို ရက်နဲ့ မဖော်ပြနိုင် | D-ROLE-06 (P300) | `assigned_at` / `revoked_at` timestamptz + partial unique (active assignment ၁ ခု) | ✅ approve (29/Sep ည) |
| F-P1-04 | `employee_branches` — branch တူ open assignment ၂ ခု ဝင်နိုင် | D-EMP-01 | Partial unique `WHERE effective_to IS NULL` | ✅ approve (29/Sep ည) — branch မတူရင် ရ (မနက် A / ညနေ B = schedule, Part 2) |
| F-P1-05 | `users.status` / `employees.status` ဘာ value လဲ မသတ်မှတ်၊ "Invited" ကို ဘယ်မှာထားမလဲ မရှင်း | D-EMP-04, D-AUTH-03, P366 | users = INVITED / ACTIVE / DISABLED၊ employees = ACTIVE / INACTIVE / RESIGNED / TERMINATED။ UI "Invited" = `users.status` ကနေ။ Login = users ∈ (INVITED, ACTIVE) AND employees = ACTIVE | ✅ approve (29/Sep ည) — number code: users 0 DISABLED / 1 ACTIVE / 2 INVITED · employees 0 INACTIVE / 1 ACTIVE / 2 RESIGNED / 3 TERMINATED (D-DB-03) |
| F-P1-06 ❌ | Status တွေ `varchar(30)` free text | D-DB-01 (status = enum + CHECK) | Enum / CHECK | ✅ approve (29/Sep ည) — `smallint` code + CHECK (D-DB-03) |
| F-P1-07 | Branch name / address က တစ်ဘာသာပဲ | D-PLT-03 (MM / EN), D-PAY-06 (receipt MM / EN + branch info) | `name_mm` / `name_en`, `address_mm` / `address_en` | ✅ approve (29/Sep ည) — rule အဖြစ် D-DB-04 |
| F-P1-08 🔴 | Auth table မရှိ — Google identity၊ OTP (~~6~~ 8 digits / 5 min / ၅ ကြိမ်မှား lock)၊ multi-device + revoke + new device notify၊ invite resend / cancel။ R360 plan ထဲမှာလည်း မပါ | D-AUTH-01..05 | Part 1b အဖြစ် Part 1 နောက်မှာ ဆွဲ | ✅ approve (29/Sep ည) — Part 1 lock ပြီးတာနဲ့ Part 1b (Login) ဆက်ဆွဲ |
| F-P1-09 🟡 | `companies` ရှိပေမဲ့ roles / customers / services မှာ `company_id` မရှိ = လက်တွေ့ single-company | D-ORG-01 | Single-tenant ဆိုတာ ရေးထား (company row ၁ ခု) | 🔒 D-ORG-03 — company-level master table တွေမှာ `company_id` ထည့်၊ unique ကို company အလိုက် |
| F-P1-10 | Permission ကို code ထဲက `@Can('booking.cancel')` နဲ့ ချိတ်ဖို့ key မရှိ | §5.5 | `permissions.code` unique | ✅ approve (29/Sep ည) — `permissions.json` → DB sync (D-ROLE-08) |
| F-P1-11 ✅ | Branch ဖွင့်ချိန် / ယာယီပိတ်ရက် / website field | D-WEB-01, D-WEB-04 | **Part 8 (v5.1)** — branch_opening_hours / branch_closures table + Part 1 v3.2 column (is_public, map_url, public_profile …) · toggle = OPEN-21 data | ✅ §6.4h |

**DBML v3 — Part 1** *(29/Sep ည — F-P1 approve ပြီး + D-ORG-03 / D-DB-03 / D-DB-04 / D-ROLE-08 ထည့်ပြီး · dbdiagram.io မှာ paste လုပ်လို့ရ · `@dbml/core` parse OK · PostgreSQL 16 မှာ load + test ၉ ခု စမ်းပြီး)* · ဖိုင်: `db/part1-foundation-v3.4.dbml` *(v3.1 = users မှာ Part 1b login column ၇ ခု · v3.2 = Part 8 website column — branches.is_public / map_url၊ employees.public_profile (default OFF) / public_specialty_mm / _en · **v3.3 (01/Oct — owner UI/UX အဖြေ)** = `users.ui_language` (OPEN-33 ✅) + `employees.show_own_earnings` (OPEN-10 ✅) · **v3.4 (01/Oct 10:47)** = `show_own_earnings` **nullable** (NULL = setting `dashboard.show_own_earnings_all` လိုက်) + `employees.public_rating` (OPEN-37 ✅, CHECK 1.0–5.0 / 0.5) — table / FK မပြောင်း၊ PostgreSQL 16 load + regression Part 3 / 8 (v3.3), Part 5 / 8 (v3.4) PASS)*

```dbml
// Point Barbershop — Part 1: Foundation / Organization / Access · v3.4 (01/Oct/2026)
// 🔒 D-DB-02 = v3 (29/Sep ည) · v3.1 = users မှာ Part 1b login column ၇ ခု ထပ်ဖြည့် (D-AUTH-03/04/08) · v3.2 = Part 8 website column — branches ၂ ခု + employees ၃ ခု (OPEN-21 → toggle / data, D-WEB-01 / 04)
// v3.3 (01/Oct — owner UI/UX အဖြေ): users.ui_language (OPEN-33 ✅ — ဘာသာ = user account) · employees.show_own_earnings (OPEN-10 ✅ — default OFF, admin က တစ်ယောက်ချင်း ဖွင့်) — column ၂ ခုပဲ၊ table / FK မပြောင်း
// v3.4 (01/Oct — owner အဖြေ ဒုတိယအကြိမ်): employees.show_own_earnings → NULL ခွင့်ပြု (NULL = company setting dashboard.show_own_earnings_all လိုက် — "အကုန်လုံး / တစ်ယောက်ချင်း" နှစ်မျိုးလုံး) · employees.public_rating (OPEN-37 ✅ — admin / manager ပေးတဲ့ rating, website barber card; V2 = customer rating)
// v2 → v3: F-P1-02..10 approve ပြီး · D-ORG-03 (company_id) · D-DB-03 (status = number code)
//          D-DB-04 (MM / EN) · D-ROLE-08 (permissions.json sync) · D-ROLE-06 (assignment တစ်ခုချင်း)
// Status / type = smallint + CHECK (D-DB-03) — number အဓိပ္ပာယ်ကို note မှာ ပြ၊ code ထဲမှာ constant နာမည်နဲ့ပဲ သုံး
// id = UUIDv7 (app ကထုတ် — D-DB-01) · *_at = timestamptz · CHECK / partial unique = part1-foundation-v3-constraints.sql

Table companies {
  id uuid [pk, note: 'UUIDv7 (D-DB-01)']
  name_mm varchar(255) [not null, note: 'D-DB-04']
  name_en varchar(255) [note: 'D-DB-04 — NULL ဆို EN screen မှာ MM ပြ']
  logo_url text
  phone varchar(50)
  email varchar(255)
  address_mm text [note: 'D-DB-04']
  address_en text [note: 'D-DB-04']
  website_url text
  social_links jsonb
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE (D-DB-03)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'D-ORG-01, D-ORG-02 · D-ORG-03: V1 = row ၁ ခု (Point)၊ နောက်မှ multi-company ဖွင့်လို့ရအောင် master table တွေမှာ company_id'
}

Table branches {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id]
  code varchar(50) [not null, note: '/book?branch=<code> (D-BKG-01)']
  name_mm varchar(255) [not null, note: 'D-DB-04']
  name_en varchar(255) [note: 'D-DB-04']
  phone varchar(50)
  email varchar(255)
  address_mm text [note: 'D-DB-04']
  address_en text [note: 'D-DB-04']
  website_url text
  social_links jsonb
  latitude numeric(10,7)
  longitude numeric(10,7)
  location_radius_meters integer [note: 'QR + GPS attendance (D-ATT-01)']
  is_public boolean [not null, default: true, note: 'Part 8 (v3.2) — website မှာ ပြ / မပြ (D-WEB-01, OPEN-21 toggle)']
  map_url text [note: 'Part 8 (v3.2) — Google Maps link (website "လမ်းညွှန်") · NULL = lat / long ကနေ ထုတ်']
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE (D-DB-03)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Indexes {
    (company_id, code) [unique]
  }

  Note: 'D-ORG-02, D-WEB-03 · ဖွင့်ချိန် = branch_opening_hours · ယာယီပိတ်ရက် = branch_closures (Part 8 — D-WEB-04, F-P1-11 ပြေ)'
}

Table users {
  id uuid [pk]
  email varchar(255) [not null, unique, note: 'Login email = admin ထည့်ထားတဲ့ email (D-AUTH-02)']
  status smallint [not null, default: 2, note: '0 DISABLED · 1 ACTIVE · 2 INVITED (D-DB-03)']
  last_login_at timestamptz
  google_subject varchar(255) [unique, note: 'Part 1b — Google account ID (sub)၊ ပထမ Google login မှာ email ကိုက်မှ မှတ် (D-AUTH-08)']
  invited_at timestamptz [note: 'Part 1b — D-AUTH-03']
  invited_by_user_id uuid [ref: > users.id, note: 'Part 1b — D-AUTH-03']
  invite_last_sent_at timestamptz [note: 'Part 1b — resend (D-AUTH-03)']
  activated_at timestamptz [note: 'Part 1b — ပထမ login အောင် → 2 INVITED → 1 ACTIVE']
  failed_login_count smallint [not null, default: 0, note: 'Part 1b — ဆက်တိုက်မှား အကြိမ်၊ မှန်ရင် 0 (D-AUTH-04)']
  login_locked_until timestamptz [note: 'Part 1b — ၅ ကြိမ်မှား → now + 20 min (D-AUTH-04)']
  ui_language smallint [note: 'v3.3 — UI ဘာသာ: 1 MY · 2 EN · NULL = system default (D-PLT-03, OPEN-33 ✅ 01/Oct) · CHECK = constraints.sql · notification / OTP email ကိုလည်း ဒီဘာသာ']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  Login identity ပဲ (D-DB-01) · company_id မထား — company က employees ကနေ (D-ORG-03)
  ui_language (v3.3) = user တစ်ယောက်ချင်း ရွေးထားတဲ့ UI ဘာသာ — session payload နဲ့ ပြန်ပေး (D-PLT-03)
  Invite → ပထမ login အောင်ရင် 2 INVITED → 1 ACTIVE (D-AUTH-03)
  OTP / session table = Part 1b (part1b-login-v1.dbml) · invite = column (table မလို — D-AUTH-03)
  '''
}

Table employees {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  user_id uuid [not null, unique, ref: - users.id, note: '🔒 D-EMP-02 — users 1 : 1 employees']
  employee_code varchar(100) [not null, note: 'Format = setting (D-EMP-03)']
  name_mm varchar(255) [not null, note: 'D-DB-04']
  name_en varchar(255) [note: 'D-DB-04']
  phone varchar(50)
  photo_url text
  public_profile boolean [not null, default: false, note: 'Part 8 (v3.2) — website မှာ barber ပုံ / နာမည် ပြ (default OFF — OPEN-21 toggle; ဖုန်း / email လုံးဝ မပြ)']
  public_specialty_mm varchar(200) [note: 'Part 8 (v3.2) — website ပြ specialty (D-DB-04)']
  public_specialty_en varchar(200) [note: 'Part 8 (v3.2)']
  show_own_earnings boolean [note: 'v3.3 / v3.4 — barber ကိုယ့် sale / commission estimate ကို dashboard + checkout မှာ မြင်ရ (OPEN-10 ✅ 01/Oct; D-DSH-03, D-COM-04) · NULL = company setting dashboard.show_own_earnings_all (settings.json, default false) အတိုင်း · true / false = ဒီ barber အတွက် override (admin Pay tab) · effective = COALESCE(column, setting)']
  public_rating numeric(2,1) [note: 'v3.4 — website barber card rating (OPEN-37 ✅ 01/Oct — admin / manager ပေး; 1.0–5.0, 0.5 ခြား — CHECK) · NULL = မပြ · website မှာ "Point rating" လို့ label (customer review မဟုတ်) · V2 = customer rating (table အသစ်) · D-UX-05']
  join_date date
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE · 2 RESIGNED · 3 TERMINATED (D-DB-03, D-EMP-04)']
  internal_notes text [note: 'Free text — ရိုက်တဲ့ ဘာသာအတိုင်း (D-DB-04)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Indexes {
    (company_id, employee_code) [unique, note: 'D-ORG-03 — company အတွင်း unique']
  }

  Note: '''
  Login ရ = users.status IN (1 ACTIVE, 2 INVITED) AND employees.status = 1 ACTIVE (D-DB-03)
  အလုပ်ထွက် = status ပြောင်း၊ record မဖျက် (🔒 D-EMP-02, D-EMP-04)
  '''
}

Table employee_branches {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id]
  effective_from date [not null]
  effective_to date
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (employee_id, branch_id, effective_from) [unique]
  }

  Note: '''
  🔒 D-EMP-01 — branch အများကြီး + history
  F-P1-04 (SQL): branch တစ်ခုကို ဖွင့်ထားတဲ့ assignment ၁ ခုပဲ — branch မတူရင် ရ
  တစ်ရက်အတွင်း ဘယ်အချိန် ဘယ် branch = schedule (Part 2, D-SCH-01/02)
  branch.company_id = employee.company_id (app စစ် — V1 company ၁ ခု)
  '''
}

Table roles {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(100) [not null, note: 'D-DB-04']
  name_en varchar(100) [note: 'D-DB-04']
  description_mm text [note: 'D-DB-04']
  description_en text [note: 'D-DB-04']
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE (D-DB-03)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'Role = position၊ admin ဖန်တီး (D-ROLE-01) · (company_id, name_mm) unique — archive မလုပ်ရသေးတာတွေအတွင်း (SQL)'
}

Table permissions {
  id uuid [pk]
  code varchar(200) [not null, unique, note: 'ဥပမာ booking.cancel — permissions.json key (D-ROLE-08) · rename / ပြန်သုံး ✖']
  module varchar(100) [not null]
  action varchar(100) [not null]
  description text [note: 'Developer မှတ်ချက် — screen label က language file (key = code)']
  archived_at timestamptz [note: 'permissions.json ကဖြုတ်ရင် sync က archive (hard delete ✖)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (module, action) [unique]
  }

  Note: 'Module → action (D-ROLE-02) · company_id မထား (system တစ်ခုလုံး) · admin မဖန်တီး၊ permissions.json → DB sync (D-ROLE-08)'
}

Table role_permissions {
  id uuid [pk]
  role_id uuid [not null, ref: > roles.id]
  permission_id uuid [not null, ref: > permissions.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (role_id, permission_id) [unique]
  }

  Note: 'Admin က role မှာ ✔ ခြစ် (D-ROLE-02) · archive ဖြစ်ပြီးသား permission = စစ်ချိန်မှာ မတွက်'
}

Table employee_roles {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  role_id uuid [not null, ref: > roles.id]
  scope_type smallint [not null, note: '1 COMPANY (branch အကုန် + နောက်ဖွင့်မယ့် branch) · 2 BRANCHES (employee_role_branches ထဲကပဲ) — D-DB-03']
  assigned_at timestamptz [not null, note: 'F-P1-03']
  revoked_at timestamptz [note: 'F-P1-03 — ဖြုတ်တဲ့ စက္ကန့်ကစ access ပိတ် (D-ROLE-06)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '''
  🔒 D-ROLE-04 — role အများကြီး၊ grant-only union
  🔒 D-ROLE-05 — branch scope က assignment တစ်ခုချင်းမှာ (Ko Aung: Barber → A + B၊ Manager → B)
  🔒 D-ROLE-06 — assignment တစ်ခု ဖြုတ် / ပြောင်းရင် အဲ့ assignment ပဲ (ကျန်တာ မထိ)
  F-P1-03 (SQL): role တူ active assignment ၁ ခုပဲ
  '''
}

Table employee_role_branches {
  id uuid [pk]
  employee_role_id uuid [not null, ref: > employee_roles.id]
  branch_id uuid [not null, ref: > branches.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (employee_role_id, branch_id) [unique]
  }

  Note: 'F-P1-02 — R364 role_branch_scopes အစား · scope_type = 2 BRANCHES ဆို row ၁ ခု အနည်းဆုံး၊ 1 COMPANY ဆို row မရှိ (app စစ်)'
}
```

**SQL — Part 1 constraint များ** *(DBML မှာ ရေးလို့မရ)* · ဖိုင်: `db/part1-foundation-v3-constraints.sql`

```sql
-- Point Barbershop — Part 1 v3 (v3.4 — 01/Oct/2026) · DBML မှာ ရေးလို့မရတဲ့ constraint များ (Prisma migration --create-only ထဲ ထည့်)

-- D-DB-03: status / type = သတ်မှတ်ထားတဲ့ number ပဲ
ALTER TABLE companies ADD CONSTRAINT companies_status_chk CHECK (status IN (0, 1));
ALTER TABLE branches  ADD CONSTRAINT branches_status_chk  CHECK (status IN (0, 1));
ALTER TABLE users     ADD CONSTRAINT users_status_chk     CHECK (status IN (0, 1, 2));        -- 0 DISABLED · 1 ACTIVE · 2 INVITED
ALTER TABLE employees ADD CONSTRAINT employees_status_chk CHECK (status IN (0, 1, 2, 3));     -- 0 INACTIVE · 1 ACTIVE · 2 RESIGNED · 3 TERMINATED
ALTER TABLE roles     ADD CONSTRAINT roles_status_chk     CHECK (status IN (0, 1));
ALTER TABLE employee_roles ADD CONSTRAINT employee_roles_scope_chk CHECK (scope_type IN (1, 2)); -- 1 COMPANY · 2 BRANCHES
-- v3.3 (OPEN-33 ✅): UI ဘာသာ — NULL = system default (nullable column → IS NULL အရင် — §6.5 #13)
ALTER TABLE users     ADD CONSTRAINT users_ui_language_chk  CHECK (ui_language IS NULL OR ui_language IN (1, 2)); -- 1 MY · 2 EN
-- v3.4 (OPEN-37 ✅): website barber rating — admin / manager ပေး; 1.0–5.0, 0.5 ခြား; NULL = မပြ
ALTER TABLE employees ADD CONSTRAINT employees_public_rating_chk
  CHECK (public_rating IS NULL OR (public_rating >= 1.0 AND public_rating <= 5.0 AND (public_rating * 2) = floor(public_rating * 2)));

-- ရက် / အချိန် အစဉ်
ALTER TABLE employee_branches ADD CONSTRAINT employee_branches_dates_chk
  CHECK (effective_to IS NULL OR effective_to >= effective_from);
ALTER TABLE employee_roles ADD CONSTRAINT employee_roles_times_chk
  CHECK (revoked_at IS NULL OR revoked_at >= assigned_at);

-- F-P1-04 (D-EMP-01): branch တစ်ခုကို ဖွင့်ထားတဲ့ assignment ၁ ခုပဲ (branch မတူရင် ရ)
CREATE UNIQUE INDEX employee_branches_one_open
  ON employee_branches (employee_id, branch_id) WHERE effective_to IS NULL;

-- F-P1-03 (D-ROLE-06): role တူ active assignment ၁ ခုပဲ
CREATE UNIQUE INDEX employee_roles_one_active
  ON employee_roles (employee_id, role_id) WHERE revoked_at IS NULL;

-- D-ORG-03 + D-DB-04: role နာမည် company အတွင်း unique (archive လုပ်ပြီးသားကို မတွက်)
CREATE UNIQUE INDEX roles_company_name_mm_active
  ON roles (company_id, name_mm) WHERE archived_at IS NULL;
```

**Test ရလဒ် (PostgreSQL 16):** Ko Aung → A + B ✅ · A ကို ထပ်ထည့် ✖ (`employee_branches_one_open`) · A ပိတ်ပြီး ပြန်ဝင် ✅ · status 5 ✖ · role နာမည်ထပ် ✖ · Manager role ထပ် active ✖ · Manager ဖြုတ် → Barber ကျန် ✅ · scope_type 9 ✖ · users.status default = 2 INVITED ✅

### 6.3b Part 1b — Login (🔒 v1)

**Source:** F-P1-08 · 🔒 D-AUTH-01..08 (29/Sep ည — owner က ၅ ချက် approve: session cookie (REC-05)၊ login တိုင်း noti၊ invite = column + cancel → DISABLED၊ OTP hash + ဆက်တိုက် ၅ ကြိမ် + ၆၀ စက္ကန့် resend၊ Google ID မှတ်) · **Status:** 🔒 **LOCK (30/Sep) — D-DB-05 = v1**

Table အသစ် ၂ ခု (`login_otps`, `user_sessions`) + `users` မှာ column ၇ ခု (Part 1 v3.1)။ `@dbml/core` parse OK · PostgreSQL 16 load + test ၇ ခု (OTP expiry, revoke reason pair, login_method, token / Google ID unique) စမ်းပြီး။ ဖိုင်: `db/part1b-login-v1.dbml`, `db/part1b-login-v1-constraints.sql`

```dbml
// Point Barbershop — Part 1b: Login · v1 (30/Sep/2026)
// 🔒 D-AUTH-01..08, D-AUTH-06 (REC-05) · Part 1 (D-DB-02) ရဲ့ users table ကို column ထပ်ဖြည့် + table အသစ် ၂ ခု
// dbdiagram မှာ ကြည့်ရင် part1-foundation-v3.2.dbml နဲ့ တွဲ paste လုပ်ပါ (users ref)
// Status / type = smallint + CHECK (D-DB-03) · CHECK / partial index = part1b-login-v1-constraints.sql
// users မှာ ထပ်ဖြည့်တဲ့ column ၇ ခု = part1-foundation-v3.2.dbml (users table)

Table login_otps {
  id uuid [pk, note: 'UUIDv7']
  user_id uuid [not null, ref: > users.id]
  code_hash varchar(255) [not null, note: 'OTP ၈ လုံးကို hash (HMAC-SHA256 + server secret) — raw code မသိမ်း (D-AUTH-04)']
  expires_at timestamptz [not null, note: 'created_at + 5 မိနစ်']
  consumed_at timestamptz [note: 'တစ်ခါသုံး — သုံးပြီးရင် set']
  request_ip inet
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (user_id, created_at)
  }

  Note: '''
  🔒 D-AUTH-04 — ၈ လုံး · ၅ မိနစ် · တစ်ခါသုံး · နောက်ဆုံးတောင်းတဲ့ OTP တစ်ခုပဲ သုံးလို့ရ
  ပြန်တောင်းရင် ၆၀ စက္ကန့် စောင့် — နောက်ဆုံး row ရဲ့ created_at နဲ့ app စစ်
  Email က users ထဲ မရှိ / DISABLED ဆို OTP မပို့ (row မဖန်တီး) — response ကတော့ အတူတူ (email ရှိ/မရှိ မသိအောင်)
  '''
}

Table user_sessions {
  id uuid [pk, note: 'UUIDv7']
  user_id uuid [not null, ref: > users.id]
  token_hash varchar(255) [not null, unique, note: 'HttpOnly cookie ထဲက token ကို hash — raw token မသိမ်း (D-AUTH-06)']
  login_method smallint [not null, note: '1 GOOGLE · 2 EMAIL_OTP (D-DB-03)']
  device_label varchar(255) [note: 'My Devices မှာ ပြ — ဥပမာ "Android · Chrome" (user agent ကနေ)']
  user_agent text
  ip_address inet [note: 'Login ဝင်တုန်းက IP']
  created_at timestamptz [not null, default: `now()`, note: 'Login ဝင်ချိန် → in-app noti (D-AUTH-05, Part 8)']
  last_seen_at timestamptz [not null, default: `now()`, note: '၅ မိနစ်တစ်ခါလောက်ပဲ update (DB write သက်သာအောင်)']
  revoked_at timestamptz
  revoked_by_user_id uuid [ref: > users.id, note: 'ကိုယ်တိုင် / admin · system ဆို NULL']
  revoke_reason smallint [note: '1 LOGOUT · 2 DEVICE_REMOVED (My Devices) · 3 ADMIN_REVOKE_ALL · 4 ACCOUNT_INACTIVE (DISABLED / အလုပ်ထွက်) — D-DB-03']

  Note: '''
  🔒 D-AUTH-05 — စက်အများကြီး · My Devices ကဖြုတ် · admin က အကုန် logout
  🔒 D-AUTH-06 — stay signed in (expiry / idle timeout မရှိ) · revoke ရင် ချက်ချင်း ထွက်
  Request တိုင်း: session revoked_at IS NULL AND users.status = 1 AND employees.status = 1 (D-DB-03)
  Login event (အောင် / မှား) = audit_events (Part 8)
  '''
}
```

```sql
-- Point Barbershop — Part 1b v1 · Login · DBML မှာ ရေးလို့မရတဲ့ constraint

-- users (column တွေက part1-foundation-v3.2.dbml ထဲမှာ)
ALTER TABLE users ADD CONSTRAINT users_failed_login_count_chk CHECK (failed_login_count >= 0);

-- login_otps
ALTER TABLE login_otps ADD CONSTRAINT login_otps_expiry_chk CHECK (expires_at > created_at);

-- user_sessions (D-DB-03)
ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_login_method_chk CHECK (login_method IN (1, 2));
ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_revoke_reason_chk CHECK (revoke_reason IS NULL OR revoke_reason IN (1, 2, 3, 4));
ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_revoke_pair_chk
  CHECK ((revoked_at IS NULL) = (revoke_reason IS NULL));

-- My Devices / request စစ်တာ မြန်အောင် — active session ပဲ
CREATE INDEX user_sessions_active_by_user ON user_sessions (user_id) WHERE revoked_at IS NULL;
```

### 6.3c Part 2 — Services / Scheduling (🔒 v1 · v1.3 🔒 01/Oct 21:20 — `archived_at` ×2, D-DB-06)

**Source:** 🔒 D-SVC-01..08, D-EMP-05, D-SCH-01..03, D-LV-01..05, D-ORG-03, D-DB-01/03/04, D-PLT-15 (⏩ item အကုန် 30/Sep မှာ ဆုံးဖြတ်ပြီး) · **Status:** 🔒 **LOCK (30/Sep) — D-DB-06 = v1**

**Test (PostgreSQL 16, Part 1 + 1b + 2 တွဲ):** ဆိုင်ဈေးထပ် ✖ · အိမ်ဈေး + barber override ✅ · branch မရောင်းတဲ့ service ဈေး ✖ · Ash + Long 30,000 / 180 မိနစ် ✅ · တခြား service ရဲ့ variant ✖ · combination ထပ် ✖ · shift 9–13 A + 13–20 B ✅ / 12–16 B ✖ · shift_date ≠ MMT ရက် ✖ · ခွင့် မနက် + ညနေ ✅ / တစ်နေ့လုံး ထပ် ✖ / REJECTED ✅ · နေ့တစ်ဝက် ၂ ရက် ✖ · eligibility ထပ် ✖

**Claude အဆိုပြု ၅ ချက် → owner "ဟုတ်ပြီ" နဲ့ lock (D-DB-06):** (1) schedule = အပတ်စဉ်ပုံစံ + နေ့စဉ် shift row ကြိုထုတ် (2) option group ၂ ခုအထိ (UI) (3) home service ခွင့် = service တစ်ခုချင်း barber အလိုက် ✔ (4) ~~ဈေးပြောင်း = ချက်ချင်း~~ → owner: ကြိုသတ်မှတ်လို့ရရမယ် → 🔒 D-SVC-08 (effective date + EXCLUDE — test ၆ ခု အောင်) (5) leave status / code

ဖိုင်: `db/part2-services-scheduling-v1.2.dbml` (*v1.1 — `service_prices.service_variant_id` ref ထပ်ဖြည့် (diagram) · v1.2 — Part 8 website column ၄ ခု: services.show_on_website / public_description_mm / _en / image_attachment_id*), `db/part2-services-scheduling-v1-constraints.sql`

```dbml
// Point Barbershop — Part 2: Services / Scheduling · v1.2 🔒 D-DB-06 (30/Sep/2026)
// v1.1 → v1.2 (Part 8): services မှာ website column ၄ ခု ထပ်ဖြည့် (OPEN-21 toggle — D-WEB-01)
// v1 → v1.1 (30/Sep မနက်): service_prices.service_variant_id မှာ ref ထပ်ဖြည့်ပဲ (diagram မှာ မျဉ်း ပေါ်အောင် — FK က constraints.sql မှာ ရှိပြီးသား; schema မပြောင်း)
// Part 1 (D-DB-02) + 1b (D-DB-05) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1-foundation-v3.2.dbml နဲ့ တွဲ paste
// 🔒 D-SVC-01..08, D-EMP-05, D-SCH-01..03, D-LV-01..05, D-ORG-03, D-DB-01/03/04, D-PLT-15, D-DB-06
// Status / type = smallint + CHECK (D-DB-03) · EXCLUDE / partial unique / generated column = part2-services-scheduling-v1-constraints.sql
// ⚠️ = lock မလုပ်ရသေးတဲ့ အကြံ (ဒီဖိုင်မှာ မကျန်တော့ — D-DB-06 နဲ့ lock)

// ───────────────────────── Services ─────────────────────────

Table service_categories {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04']
  name_en varchar(150) [note: 'D-DB-04']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'D-SVC-01 · (company_id, name_mm) unique — archive မလုပ်ရသေးတာတွေအတွင်း (SQL)'
}

Table services {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03 — company master service (D-SVC-01)']
  category_id uuid [not null, ref: > service_categories.id]
  name_mm varchar(200) [not null, note: 'D-DB-04']
  name_en varchar(200) [note: 'D-DB-04']
  description_mm text [note: 'D-DB-04']
  description_en text [note: 'D-DB-04']
  pricing_mode smallint [not null, default: 1, note: '1 SIMPLE (ဈေး တစ်ခု) · 2 OPTIONS (ဈေးဇယား — D-SVC-05)']
  buffer_minutes smallint [not null, default: 0, note: 'ရှင်းလင်းချိန် (D-SVC-07) — booking က ကြာချိန် + buffer ပိတ်']
  show_on_website boolean [not null, default: true, note: 'Part 8 (v1.2) — website service list မှာ ပြ (OPEN-21 toggle) · /book မှာတော့ ACTIVE + branch ရောင်း = ပြ']
  public_description_mm text [note: 'Part 8 (v1.2) — website စာသား (description_mm = admin / internal)']
  public_description_en text [note: 'Part 8 (v1.2)']
  image_attachment_id uuid [note: 'Part 8 (v1.2) — website ပုံ → attachments (FK Part 8 SQL)']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'Fresha ရဲ့ branch copy ၃ ခု → master ၁ ခု + branch_services (D-SVC-01..03) · (company_id, name_mm) unique (SQL)'
}

Table branch_services {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  service_id uuid [not null, ref: > services.id]
  duration_minutes integer [not null, note: 'ဒီ branch မှာ ပုံမှန် ကြာချိန် (D-SVC-02)']
  status smallint [not null, default: 1, note: '0 INACTIVE (ဒီ branch မှာ မရောင်း) · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, service_id) [unique]
  }

  Note: 'D-SVC-02 — branch အလိုက် ရောင်း / မရောင်း + ကြာချိန် · ဈေးက service_prices'
}

// ── Pricing options (D-SVC-05) — ဥပမာ Hair Dye: Color × Length ──

Table service_option_groups {
  id uuid [pk]
  service_id uuid [not null, ref: > services.id]
  name_mm varchar(100) [not null, note: 'ဥပမာ အရောင် / အရှည် (D-DB-04)']
  name_en varchar(100)
  sort_order integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '🔒 D-DB-06 — UI V1 = service တစ်ခုမှာ group ၂ ခုအထိ (ဇယား row × column) · DB က အကန့်အသတ်မရှိ'
}

Table service_option_values {
  id uuid [pk]
  option_group_id uuid [not null, ref: > service_option_groups.id]
  name_mm varchar(100) [not null, note: 'ဥပမာ Ash / ၇–၁၂ လက်မ (D-DB-04)']
  name_en varchar(100)
  sort_order integer [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz
}

Table service_variants {
  id uuid [pk]
  service_id uuid [not null, ref: > services.id]
  variant_key varchar(500) [not null, note: 'option_value id တွေကို sort လုပ်ပြီး ဆက် — combination တူ ၂ ခါ မဝင်အောင် (app ထုတ်)']
  created_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Indexes {
    (id, service_id) [unique, note: 'service_prices composite FK အတွက်']
  }

  Note: 'Combination တစ်ခု = ဇယား ကွက်တစ်ကွက် (ဥပမာ Ash + ၇–၁၂") · (service_id, variant_key) unique (SQL)'
}

Table service_variant_values {
  id uuid [pk]
  service_variant_id uuid [not null, ref: > service_variants.id]
  option_value_id uuid [not null, ref: > service_option_values.id]

  Indexes {
    (service_variant_id, option_value_id) [unique]
  }

  Note: 'option_value က ဒီ service ရဲ့ group ထဲကဖြစ်ရ (app စစ်)'
}

// ── ဈေး table တစ်ခုတည်း — simple / options · ဆိုင် / အိမ် · branch / barber ──

Table service_prices {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  service_id uuid [not null, ref: > services.id]
  service_variant_id uuid [ref: > service_variants.id, note: 'NULL = SIMPLE service · ဖြည့် = ဇယား ကွက် (D-SVC-05) · (service_variant_id, service_id) composite FK = SQL']
  location_type smallint [not null, default: 1, note: '1 BRANCH (ဆိုင်) · 2 HOME (အိမ်ဈေး — D-SVC-06)']
  employee_id uuid [ref: > employees.id, note: 'NULL = branch ဈေး · ဖြည့် = barber override (D-SVC-03) — V1 UI: SIMPLE + ဆိုင် ပဲ (D-SVC-05)']
  price_amount bigint [not null, note: 'MMK (D-DB-01)']
  duration_minutes integer [note: 'NULL → branch_services.duration_minutes (D-SVC-05)']
  effective_from date [not null, note: 'ဒီဈေး စသက်ရောက်တဲ့ MMT ရက် — ကြိုသတ်မှတ်လို့ရ (D-SVC-08)']
  effective_to date [note: 'NULL = ဆက်သက်ရောက် · ဈေးအသစ် မစခင်ရက်']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  ဈေးရှာပုံ: ဝန်ဆောင်မှုပေးမယ့်ရက် (booking = ချိန်းရက်၊ walk-in = ဒီနေ့ — D-PLT-15) မှာ သက်ရောက်နေတဲ့ row
    → barber override → branch ဈေး; HOME row မရှိ → BRANCH ဈေး (D-SVC-06)
  OPTIONS service မှာ ကွက်လပ် (row မရှိ) = အဲ့ branch မှာ အဲ့ combination မရောင်း (D-SVC-05)
  (branch_id, service_id) → branch_services · (service_variant_id, service_id) → service_variants (composite FK — SQL)
  Key တူ + ရက် ထပ် ✖ (EXCLUDE — SQL) · ဈေးအဟောင်း row မဖျက်ဘူး = ဈေး history (D-SVC-08)
  Booking / sale က ရှာတွေ့တဲ့ဈေးကို snapshot (D-SVC-04)
  '''
}

// ───────────────────────── Eligibility ─────────────────────────

Table employee_service_eligibilities {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id]
  service_id uuid [not null, ref: > services.id]
  home_allowed boolean [not null, default: false, note: 'ဒီ service ကို အိမ်မှာ လုပ်ခွင့် (D-SVC-06, D-BKG-22)']
  effective_from date [not null]
  effective_to date
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '''
  🔒 D-EMP-05 — branch အလိုက် ✔ + effective date
  (branch_id, service_id) → branch_services (composite FK — SQL)
  employee + branch + service ဖွင့်ထားတဲ့ row ၁ ခုပဲ (partial unique — SQL)
  '''
}

// ───────────────────────── Schedule ─────────────────────────

Table schedule_patterns {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id]
  day_of_week smallint [not null, note: '1 Mon … 7 Sun (ISO)']
  start_time time [not null, note: 'MMT']
  end_time time [not null, note: 'MMT']
  effective_from date [not null]
  effective_to date
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: 'D-SCH-01 "repeat" — အပတ်စဉ် ပုံစံ · 🔒 D-DB-06: ညတိုင်း schedule_shifts ကို ကြိုထုတ် — booking window (D-BKG-06 setting, default 14 ရက်) + အပို · job ပုံစံ = REC-31'
}

Table schedule_shifts {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id]
  shift_date date [not null, note: 'MMT ရက် (D-PLT-15)']
  starts_at timestamptz [not null]
  ends_at timestamptz [not null]
  source smallint [not null, note: '1 PATTERN (ပုံစံကထုတ်) · 2 MANUAL (တစ်ရက်ချင်း ထည့် / ပြင်)']
  schedule_pattern_id uuid [ref: > schedule_patterns.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  🔒 D-SCH-01 — တစ်ရက်မှာ branch / အပိုင်း အများကြီး
  🔒 D-SCH-02 — ဝန်ထမ်း တစ်ယောက် အချိန်ထပ် ✖ (EXCLUDE — SQL; ထိစပ်ရုံ ရ) · branch ပြောင်းရင် ခရီးချိန် (setting, default 60) = app စစ်
  Booking availability (D-BKG-04) = shift − booking − leave (pending ပါ — D-LV-04) − home service သွားချိန် (D-SCH-03)
  employee က ဒီ branch မှာ ရှိရမယ် (employee_branches — app စစ်)
  '''
}

// ───────────────────────── Leave ─────────────────────────

Table leave_types {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(100) [not null, note: 'D-DB-04']
  name_en varchar(100)
  is_paid boolean [not null, note: 'လစာရ / မရ (payroll — Part 5)']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '🔒 D-LV-01 — initial data = Fresha blocked-time ၁၀ မျိုး ("Late to work" မပါ) · (company_id, name_mm) unique (SQL)'
}

Table leaves {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id, note: 'Employee-level — branch အကုန် ပိတ် (D-LV-03)']
  leave_type_id uuid [not null, ref: > leave_types.id]
  start_date date [not null]
  end_date date [not null]
  day_portion smallint [not null, default: 1, note: '1 FULL · 2 MORNING · 3 AFTERNOON — နေ့တစ်ဝက်က ရက် ၁ ရက်ပဲ (D-LV-03, D-LV-05)']
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 PENDING · 2 APPROVED · 3 REJECTED']
  reason text [note: 'Free text (D-DB-04)']
  requested_by_user_id uuid [not null, ref: > users.id, note: 'ကိုယ်တိုင် ဒါမှမဟုတ် manager က ကိုယ်စား']
  decided_by_user_id uuid [ref: > users.id]
  decided_at timestamptz
  decision_note text
  cancelled_by_user_id uuid [ref: > users.id]
  cancelled_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '''
  🔒 D-LV-02 — approval = permission · PENDING မှာ ပြင်ရ · overlap ✖ (EXCLUDE on half-day unit — SQL) · noti
  🔒 D-LV-04 — PENDING + APPROVED = booking ပိတ်
  🔒 D-LV-05 — နေ့ခွဲချိန် setting (default 13:00)
  '''
}

// ── Setting (Part 8 settings store — ဒီ part က ဖတ်ရုံ) ──
// booking.slot_interval_minutes (company, default 15 — D-BKG-07)
// booking.advance_window_days (company, default 14 — D-BKG-06)
// schedule.cross_branch_gap_minutes (company, default 60 — D-SCH-02)
// home_service.travel_minutes (branch, default 30 — D-SCH-03)
// home_service.transport_fee_amount (branch — D-SVC-06; sale line = Part 4, commission မတွက်)
// leave.half_day_cutoff_time (company, default 13:00 — D-LV-05)
```

```sql
-- Point Barbershop — Part 2 v1 (🔒 D-DB-06) · Services / Scheduling · DBML မှာ ရေးလို့မရတဲ့ constraint
CREATE EXTENSION IF NOT EXISTS btree_gist;   -- EXCLUDE မှာ uuid (=) + range (&&) တွဲသုံးဖို့

-- D-DB-03: status / type number
ALTER TABLE service_categories ADD CONSTRAINT service_categories_status_chk CHECK (status IN (0, 1));
ALTER TABLE services           ADD CONSTRAINT services_status_chk           CHECK (status IN (0, 1));
ALTER TABLE services           ADD CONSTRAINT services_pricing_mode_chk     CHECK (pricing_mode IN (1, 2));
ALTER TABLE services           ADD CONSTRAINT services_buffer_chk           CHECK (buffer_minutes BETWEEN 0 AND 120);
ALTER TABLE branch_services    ADD CONSTRAINT branch_services_status_chk    CHECK (status IN (0, 1));
ALTER TABLE branch_services    ADD CONSTRAINT branch_services_duration_chk  CHECK (duration_minutes > 0);
ALTER TABLE service_prices     ADD CONSTRAINT service_prices_location_chk   CHECK (location_type IN (1, 2));
ALTER TABLE service_prices     ADD CONSTRAINT service_prices_amount_chk     CHECK (price_amount >= 0);
ALTER TABLE service_prices     ADD CONSTRAINT service_prices_duration_chk   CHECK (duration_minutes IS NULL OR duration_minutes > 0);
ALTER TABLE schedule_patterns  ADD CONSTRAINT schedule_patterns_dow_chk     CHECK (day_of_week BETWEEN 1 AND 7);
ALTER TABLE schedule_patterns  ADD CONSTRAINT schedule_patterns_time_chk    CHECK (end_time > start_time);
ALTER TABLE schedule_patterns  ADD CONSTRAINT schedule_patterns_dates_chk   CHECK (effective_to IS NULL OR effective_to >= effective_from);
ALTER TABLE schedule_shifts    ADD CONSTRAINT schedule_shifts_source_chk    CHECK (source IN (1, 2));
ALTER TABLE schedule_shifts    ADD CONSTRAINT schedule_shifts_time_chk      CHECK (ends_at > starts_at);
ALTER TABLE leave_types        ADD CONSTRAINT leave_types_status_chk        CHECK (status IN (0, 1));
ALTER TABLE leaves             ADD CONSTRAINT leaves_status_chk             CHECK (status IN (0, 1, 2, 3));
ALTER TABLE leaves             ADD CONSTRAINT leaves_portion_chk            CHECK (day_portion IN (1, 2, 3));
ALTER TABLE leaves             ADD CONSTRAINT leaves_dates_chk              CHECK (end_date >= start_date);
-- D-LV-03 / D-LV-05: နေ့တစ်ဝက်က ရက် ၁ ရက်ပဲ
ALTER TABLE leaves             ADD CONSTRAINT leaves_half_day_single_chk    CHECK (day_portion = 1 OR start_date = end_date);
ALTER TABLE employee_service_eligibilities ADD CONSTRAINT eligibility_dates_chk
  CHECK (effective_to IS NULL OR effective_to >= effective_from);

-- D-ORG-03 + D-DB-04: နာမည် company / group အတွင်း unique (archive ပြီးသားကို မတွက်)
CREATE UNIQUE INDEX service_categories_name_active ON service_categories (company_id, name_mm) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX services_name_active           ON services (company_id, name_mm) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX option_groups_name_active      ON service_option_groups (service_id, name_mm) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX option_values_name_active      ON service_option_values (option_group_id, name_mm) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX service_variants_key_active    ON service_variants (service_id, variant_key) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX leave_types_name_active        ON leave_types (company_id, name_mm) WHERE archived_at IS NULL;

-- D-SVC-02/05: ဈေးက ဒီ branch ရောင်းတဲ့ service အတွက်ပဲ · variant က ဒီ service ရဲ့ဟာပဲ
ALTER TABLE service_prices ADD CONSTRAINT service_prices_branch_service_fk
  FOREIGN KEY (branch_id, service_id) REFERENCES branch_services (branch_id, service_id);
ALTER TABLE service_prices ADD CONSTRAINT service_prices_variant_service_fk
  FOREIGN KEY (service_variant_id, service_id) REFERENCES service_variants (id, service_id);
-- D-SVC-08: ဈေး key တူ + ရက် ထပ် ✖ (NULL variant / employee ကိုလည်း တူတယ်လို့ ယူ — COALESCE)
ALTER TABLE service_prices ADD CONSTRAINT service_prices_dates_chk
  CHECK (effective_to IS NULL OR effective_to >= effective_from);
ALTER TABLE service_prices ADD CONSTRAINT service_prices_no_overlap
  EXCLUDE USING gist (
    branch_id WITH =,
    service_id WITH =,
    (COALESCE(service_variant_id, '00000000-0000-0000-0000-000000000000'::uuid)) WITH =,
    location_type WITH =,
    (COALESCE(employee_id, '00000000-0000-0000-0000-000000000000'::uuid)) WITH =,
    daterange(effective_from, effective_to, '[]') WITH &&
  ) WHERE (archived_at IS NULL);

-- D-EMP-05
ALTER TABLE employee_service_eligibilities ADD CONSTRAINT eligibility_branch_service_fk
  FOREIGN KEY (branch_id, service_id) REFERENCES branch_services (branch_id, service_id);
CREATE UNIQUE INDEX eligibility_one_open
  ON employee_service_eligibilities (employee_id, branch_id, service_id) WHERE effective_to IS NULL;

-- D-SCH-02: ဝန်ထမ်း တစ်ယောက်ရဲ့ shift အချိန်ထပ် ✖ (branch မတူလည်း) · [) = ထိစပ်ရုံ ရ
ALTER TABLE schedule_shifts ADD CONSTRAINT schedule_shifts_no_overlap
  EXCLUDE USING gist (employee_id WITH =, tstzrange(starts_at, ends_at, '[)') WITH &&)
  WHERE (archived_at IS NULL);
-- shift_date = starts_at ရဲ့ MMT ရက် (D-PLT-15)
ALTER TABLE schedule_shifts ADD CONSTRAINT schedule_shifts_date_chk
  CHECK (shift_date = (starts_at AT TIME ZONE 'Asia/Yangon')::date);

-- D-LV-02: ခွင့် overlap ✖ (PENDING / APPROVED) — နေ့တစ်ဝက် unit နဲ့ (မနက် + ညနေ တစ်ရက်တည်း = ရ)
-- unit = (ရက် − 2000-01-01) × 2 (+1 = ညနေ) · setting (13:00) ပြောင်းလည်း constraint မပျက်
ALTER TABLE leaves ADD COLUMN half_day_units int4range GENERATED ALWAYS AS (
  int4range(
    (start_date - DATE '2000-01-01') * 2 + CASE WHEN day_portion = 3 THEN 1 ELSE 0 END,
    (end_date   - DATE '2000-01-01') * 2 + CASE WHEN day_portion = 2 THEN 1 ELSE 2 END
  )
) STORED;
ALTER TABLE leaves ADD CONSTRAINT leaves_no_overlap
  EXCLUDE USING gist (employee_id WITH =, half_day_units WITH &&)
  WHERE (status IN (1, 2));
```

### 6.4 Part 3 — Customers / Booking (early draft)

**Source:** R365 (ChatGPT က "Part 2" လို့ ခေါ်)။ **Status:** 🟡 early draft — Part 2 (Services / Scheduling) ပြီးမှ ပြန်ကြည့်ပြီး lock။

> **v5.1:** ဒီ section = မှတ်တမ်း (R365 review + 29/Sep v2)။ **လက်ရှိ draft = v3 (§6.4c)** — DBML v2 နဲ့ SQL ကို မကိုးကားပါနဲ့။

**R365 မှာ ကောင်းတာ ✅** — waitlist ကို core booking ထဲ မထည့် (*v5.1:* ⏭ — §6.4b)၊ one-active-booking DB constraint ကို edge case (OPEN-14) မဆုံးဖြတ်ခင် hard-lock မလုပ်၊ no-show = `CANCELLED` + reason (status မပွား)၊ "Any Barber" အတွက် `any_barber` flag မထည့်၊ manage token ကို hash ပဲ သိမ်း၊ customer name / phone snapshot၊ phone + normalized phone ခွဲ။

| ID | Finding (R365) | 🔒 / Source | အကြံပြုချက် | Status |
| --- | --- | --- | --- | --- |
| F-BK-01 ❌ | `booked_barber_id` | D-DB-01 (role-neutral) | `booked_employee_id` | ⚠️ |
| F-BK-02 ❌ | `price_snapshot numeric(12,2)` | D-DB-01 (`*_amount` = bigint MMK) | `unit_price_amount bigint` | ⚠️ |
| F-BK-03 | `booking_services` + `*_snapshot` suffix | Glossary §6.1, R360 ("Booking Items"), §5.4 | `booking_items` (`visit_items` / `sale_items` နဲ့ ပုံစံတူ)၊ `service_name`, `duration_minutes` | ⚠️ |
| F-BK-04 ❌ | Double booking ကို "ကြိုစဉ်းစားထားမယ်" ပဲ — DBML မှာ index ပဲ ရှိ | D-BKG-08 (DB level, first success wins) | `btree_gist` EXCLUDE constraint (အောက်က SQL) | ⚠️ |
| F-BK-05 ❌ | `booked_barber_id` nullable ("Any Barber" အတွက်) | D-BKG-05 (customer ကိုယ်တိုင်ရွေး)၊ D-BKG-03 | NOT NULL — NULL ဆိုရင် EXCLUDE ကို ကျော်သွားလို့ double booking ဖြစ်နိုင် | ⚠️ |
| F-BK-06 | `customer_id` nullable | D-CUS-03 (auto match / create) | NOT NULL | ⚠️ |
| F-BK-07 ❌ | `phone_normalized` ကို index ပဲ၊ unique မဟုတ် | D-CUS-02 (phone = unique identity) | UNIQUE (E.164) | ⚠️ |
| F-BK-08 | `customers.preferences text` | Lock မရှိ (D-CUS-08 preferred barber = history ကနေ တွက်) | ဖြုတ် — D-PLT-11 စိုးရိမ်တဲ့ "မသိမသာ ဝင်လာတဲ့ field" | ⚠️ |
| F-BK-09 | `cancelled_by → users` — customer က manage link နဲ့ cancel ရင် user မရှိ၊ no-show auto-cancel က system | D-BKG-13, D-BKG-17 | `cancelled_by_actor` (CUSTOMER / STAFF / SYSTEM) + `cancelled_by_user_id` + CHECK | ⚠️ |
| F-BK-10 | `manage_token_hash` nullable, unique မဟုတ် | D-BKG-11 | NOT NULL UNIQUE (staff ထည့်တဲ့ booking အတွက်လည်း link ထုတ်ထား — Viber နဲ့ ပို့လို့ရ) | ⚠️ |
| F-BK-11 | `channel`, `created_by_user_id`, `business_date` မရှိ | Online % report (§3.6)၊ REC-34 | ထည့် | ✅ approve (30/Sep မနက် — OPEN-14 / D-BKG-09 အတွက် channel လို) · `business_date` = 🔒 D-PLT-15 |
| F-BK-12 ✅ | One-active-booking constraint ဆိုင်းထား | D-BKG-09 🟡 | ~~OPEN-14 ပြီးမှ partial unique index~~ → DB index မသုံး (staff ကန့်သတ်မရှိလို့); website booking မှာ app က customer row lock + စစ် | ✅ D-BKG-09 (v5.1) |
| F-BK-13 ✅ | Waitlist မထည့်၊ no-show = CANCELLED + CUSTOMER_NO_SHOW | D-BKG-17, D-BKG-20 | သဘောတူ | ✅ |
| F-BK-14 🟡 | Reschedule (full edit) လုပ်ရင် price snapshot ကို ဘာလုပ်မလဲ မသတ်မှတ် | D-BKG-12, D-SVC-04 | ရက် / အချိန်ပဲ ပြောင်းရင် မူလ ဈေး + ကြာချိန် snapshot ဆက်ထား; service / option ပြောင်း (ထပ်ထည့်) ရင် အဲ့ item ကိုပဲ ရက်အသစ်ရဲ့ ဈေး; barber ပြောင်း ဒါမှမဟုတ် ဆိုင် ↔ အိမ် ပြောင်းရင် item အကုန် ရက်အသစ်ရဲ့ ဈေး (barber override — D-SVC-03၊ အိမ်ဈေး / ကားခ — D-SVC-06 ကြောင့်); ဈေးပြောင်းသွားရင် confirm မနှိပ်ခင် screen မှာ ဈေးအသစ် ပြ; ထူးခြား case = checkout မှာ ခွင့်ရှိသူ reason နဲ့ ပြင် (D-SVC-04) | ✅ D-BKG-12 (v5.1) |
| F-BK-15 | `service_id` FK မရှိ (services table မရှိသေး) | — | Part 2 ပြီးမှ FK ထည့်၊ DBML မှာ note ထား | ⚠️ Part 2 နောက် |

**DBML v2 — Part 3** — `branches`, `employees`, `users` ကို ref လုပ်ထားလို့ ဒီ block တစ်ခုတည်း paste ရင် error တက်မယ်။ dbdiagram.io မှာ **§6.3 block + ဒီ block ကို တစ်ခါတည်း** paste ပါ။

```dbml
// Point Barbershop — Part 3: Customers / Booking · v2 (29/Sep/2026) — ⚠️ DRAFT, Part 2 ပြီးမှ lock
// Base = ChatGPT R365 ("Part 2" လို့ ခေါ်ခဲ့) · Part 1 နဲ့ တွဲ paste ပါ (branches, employees, users ကို ref လုပ်လို့)
// 🔒 = lock ပြီး · ❌ = R365 က 🔒 ကို ချိုးထားတာ ပြင် · ⚠️ F-BK-nn = review အကြံ

Enum customer_status {
  ACTIVE
  INACTIVE
}

Enum booking_status { // 🔒 D-BKG-18
  BOOKED
  STARTED
  COMPLETED
  CANCELLED
}

Enum booking_cancel_reason { // 🔒 D-BKG-14 preset (P95) · no-show = CUSTOMER_NO_SHOW (D-BKG-17)
  CUSTOMER_REQUEST
  BARBER_UNAVAILABLE
  CUSTOMER_NO_SHOW
  OTHER
}

Enum actor_type { // ⚠️ F-BK-09
  CUSTOMER
  STAFF
  SYSTEM
}

Enum booking_channel { // ⚠️ F-BK-11
  ONLINE
  STAFF
}

Table customers {
  id uuid [pk]
  name varchar(255) [not null]
  phone varchar(50) [not null, note: 'ရိုက်ထည့်တဲ့အတိုင်း']
  phone_normalized varchar(20) [not null, unique, note: 'E.164 (+959…) · 🔒 D-CUS-02 phone = unique identity'] // ❌ F-BK-07 (R365: unique မပါ)
  status customer_status [not null, default: 'ACTIVE'] // D-CUS-07
  notes text [note: 'Optional၊ staff အားလုံးမြင် (D-CUS-01)']
  created_at timestamptz [not null]
  updated_at timestamptz [not null]
  archived_at timestamptz

  Note: 'Company-level (D-CUS-01) · ⚠️ F-BK-08: R365 ရဲ့ preferences ကို ဖြုတ် — lock မရှိ (preferred barber = history ကနေတွက်၊ D-CUS-08)'
}

Table bookings {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  customer_id uuid [not null, ref: > customers.id] // ⚠️ F-BK-06 (🔒 D-CUS-03 auto match / create)
  booked_employee_id uuid [not null, ref: > employees.id] // ❌ F-BK-01 naming + F-BK-05 NOT NULL (🔒 D-BKG-05, D-BKG-08)
  customer_name_snapshot varchar(255) [not null]
  customer_phone_snapshot varchar(50) [not null]
  channel booking_channel [not null] // ⚠️ F-BK-11
  created_by_user_id uuid [ref: > users.id, note: 'Staff ထည့်တဲ့ booking ဆို ဘယ်သူ၊ online ဆို NULL'] // ⚠️ F-BK-11
  starts_at timestamptz [not null]
  ends_at timestamptz [not null]
  business_date date [not null, note: 'starts_at ရဲ့ Asia/Yangon ရက်'] // ⚠️ F-BK-11 (REC-34)
  status booking_status [not null, default: 'BOOKED']
  cancellation_reason booking_cancel_reason
  cancellation_note text
  cancelled_at timestamptz
  cancelled_by_actor actor_type // ⚠️ F-BK-09 (R365: cancelled_by → users)
  cancelled_by_user_id uuid [ref: > users.id] // ⚠️ F-BK-09
  manage_token_hash varchar(255) [not null, unique, note: 'Raw token မသိမ်း (D-BKG-11)'] // ⚠️ F-BK-10
  created_at timestamptz [not null]
  updated_at timestamptz [not null]

  Indexes {
    (branch_id, starts_at)
    (booked_employee_id, starts_at)
    (customer_id, starts_at)
    business_date
  }

  Note: '''
  dbdiagram မှာ မပြနိုင်တဲ့ constraint — §6.4 SQL:
  🔒 D-BKG-08 EXCLUDE: employee တစ်ယောက် အချိန်ထပ် booking မရ (branch မတူလည်း)
  CHECK ends_at > starts_at · CANCELLED ⇔ cancel field တွေ · OTHER ⇒ note · STAFF ⇒ user
  D-BKG-09 (v5.1): active booking ၁ ခု = website booking မှာပဲ app စစ် (customer row lock) — DB index မသုံး
  Waitlist ⏭ (D-BKG-20, §6.4b) — ဒီမှာ မထည့်
  '''
}

Table booking_items { // ⚠️ F-BK-03 (R365: booking_services)
  id uuid [pk]
  booking_id uuid [not null, ref: > bookings.id]
  service_id uuid [not null, note: 'FK → services.id — Part 2 ပြီးမှ ထည့် (F-BK-15)']
  sort_order integer [not null]
  service_name varchar(255) [not null, note: 'Snapshot (R365: service_name_snapshot)']
  unit_price_amount bigint [not null, note: 'MMK snapshot (🔒 D-SVC-04)'] // ❌ F-BK-02 (R365: price_snapshot numeric(12,2))
  duration_minutes integer [not null, note: 'Snapshot (R365: duration_minutes_snapshot)']
  created_at timestamptz [not null]
  updated_at timestamptz [not null]

  Indexes {
    (booking_id, sort_order) [unique]
  }

  Note: 'Service အများကြီး + barber တစ်ယောက် + ဆက်တိုက် (D-BKG-03)'
}
```

**SQL — Part 3 constraints** *(PostgreSQL 16 မှာ စမ်းပြီး — branch မတူလည်း အချိန်ထပ်တဲ့ booking ကို ပယ်တယ်၊ ဆက်တိုက် booking (10:00–10:30 → 10:30–11:00) ရတယ်၊ cancel လုပ်ရင် slot ပြန်လွတ်တယ်၊ cancel field CHECK တွေ အလုပ်လုပ်တယ်)*

```sql
-- Prisma: `prisma migrate dev --create-only` ပြီး ဒီ SQL ကို migration ထဲ ကိုယ်တိုင်ထည့် (§5.2)

-- 🔒 D-BKG-08: employee တစ်ယောက် အချိန်ထပ် booking မရ (branch မတူလည်း)၊ first success wins
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE bookings
  ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    booked_employee_id WITH =,
    tstzrange(starts_at, ends_at, '[)') WITH &&
  ) WHERE (status IN ('BOOKED', 'STARTED'));

-- 🔒 D-BKG-14 (cancel reason မဖြစ်မနေ + Other text) · ⚠️ F-BK-09 (actor / user)
ALTER TABLE bookings
  ADD CONSTRAINT bookings_time_order CHECK (ends_at > starts_at),
  ADD CONSTRAINT bookings_cancel_fields CHECK (
    (status = 'CANCELLED'
      AND cancelled_at IS NOT NULL
      AND cancellation_reason IS NOT NULL
      AND cancelled_by_actor IS NOT NULL)
    OR
    (status <> 'CANCELLED'
      AND cancelled_at IS NULL
      AND cancellation_reason IS NULL
      AND cancelled_by_actor IS NULL
      AND cancelled_by_user_id IS NULL)
  ),
  ADD CONSTRAINT bookings_cancel_other_note CHECK (
    cancellation_reason IS DISTINCT FROM 'OTHER' OR cancellation_note IS NOT NULL
  ),
  ADD CONSTRAINT bookings_cancel_staff_user CHECK (
    cancelled_by_actor IS DISTINCT FROM 'STAFF' OR cancelled_by_user_id IS NOT NULL
  );

-- ⚠️ F-BK-02: ငွေ အနုတ်မဖြစ်၊ duration > 0
ALTER TABLE booking_items
  ADD CONSTRAINT booking_items_amount_nonneg CHECK (unit_price_amount >= 0),
  ADD CONSTRAINT booking_items_duration_pos CHECK (duration_minutes > 0);

-- D-BKG-09 (v5.1 — OPEN-14 ✅): DB index မသုံး — staff ထည့်ရင် ကန့်သတ်မရှိလို့
-- Website booking မှာပဲ app က: customer row ကို SELECT ... FOR UPDATE → active booking (BOOKED / STARTED) ရှိရင် ပယ်
```

### 6.4b Waitlist — ⏭ V1 မပါ · နောက်မှ ထည့်ရလွယ်အောင် ပြင်ဆင်ချက် (v5.1)

**Source:** OPEN-27 → owner 30/Sep မနက် ("Claude အကြံ (ဂ) — V1 မပါ" + "ထည့်တဲ့အခါ လုပ်ရလွယ်အောင် တစ်ခါတည်း စီစဉ်ထား") · **Status:** 🔒 D-BKG-20 update — ⏭ V1 မပါ + (A) ပြင်ဆင်ချက် · (B) ပုံကြမ်း / (C) ဆုံးဖြတ်ရန် = **requirement မဟုတ်** (ဆောက်ချိန် ပြန်စစ်)

**ဘာကြောင့် V1 မပါ** — Waitlist က online booking များလို့ ပြည့်နေတဲ့ဆိုင်အတွက်။ Point live data: online booking 0%၊ barber ကြိုရွေး 0%၊ walk-in 100% → go-live မှာ waitlist ထဲ ထည့်မယ့်သူ မရှိသလောက်။ System က customer ကို အကြောင်းမကြားနိုင် (D-CUS-05) → နောက်ဆုံး staff ဖုန်းဆက်ရတာပဲ။ **အချိန်မလောက်လို့ ဖြုတ်တာ မဟုတ်** (D-PLT-14)။ Booking စသုံးပြီး "ပြည့်နေလို့ customer လွတ်သွား" တာ တကယ်မြင်လာမှ ဆောက်။

#### (A) V1 မှာ လိုက်နာရမယ့် ပြင်ဆင်ချက် (🔒)

| # | ဘာလုပ်မလဲ | နောက်မှ ဘာသက်သာလဲ |
| --- | --- | --- |
| 1 | Part 3 DB မှာ waitlist table / column **ကြိုမထည့်** (D-PLT-11)၊ `bookings` ကို waitlist logic နဲ့ မရော | နောက်မှ = table အသစ် ၂ ခု ထည့်ရုံ။ "ဘယ် waitlist ကနေ booking ဖြစ်လာလဲ" ကို waitlist ဘက် (`waitlist_entries.booking_id`) မှာ မှတ်လို့ **`bookings` table ကို လုံးဝ မပြင်ရ** — ရှိပြီးသား booking data မထိ |
| 2 | **Availability (D-BKG-04) ကို code တစ်နေရာတည်းက တွက်** — customer booking screen၊ staff calendar၊ reschedule အကုန် အဲ့ function ကိုပဲ ခေါ် | Waitlist ရဲ့ "နေရာလွတ်ပြီလား" စစ်တာလည်း အဲ့ဟာကိုပဲ ခေါ်ရုံ — rule ၂ နေရာ မကွဲ |
| 3 | **နေရာလွတ်စေတဲ့ booking action** — cancel (D-BKG-13)၊ reschedule (D-BKG-12)၊ no-show auto-cancel (D-BKG-17) — ကို code လမ်းကြောင်း **တစ်ခုတည်း** ကနေပဲ ဖြတ်; "ဘယ် barber ရဲ့ ဘယ်အချိန် လွတ်သွားလဲ" ကို အဲ့နေရာမှာ သိနိုင်ရမယ် (V1 မှာ barber noti — D-BKG-15 — လည်း အဲ့ကပဲ) | Waitlist ကို အဲ့တစ်နေရာမှာ ချိတ်ရုံ — cancel ၃ မျိုးကို တစ်ခုချင်း လိုက်ပြင်စရာ မလို |
| 4 | Status / type number အသစ်ဆို နောက်ဆုံး number နောက်က ထပ်တိုး (D-DB-03 — ရှိပြီးသား number မပြောင်း၊ ပြန်မသုံး) | Booking ဘယ်လမ်းကလာလဲ type ရှိရင် "waitlist ကလာ" ကို number အသစ်နဲ့ ထည့်ရုံ |
| 5 | Permission (`waitlist.*`)၊ notification type၊ language key — V1 မှာ **ကြိုမထည့်** | `permissions.json` (D-ROLE-08) + language file ထဲ ထည့်ရုံ — sync က DB ကို အလိုလို ဖြည့် |

#### (B) နောက်မှ ဆောက်ရင် စမယ့် ပုံကြမ်း (⏭ — DB ထဲ မထည့်)

Rule (🔒 D-BKG-20 ရှိပြီးသား): booking မဟုတ် · နေရာ ကြိုမသိမ်း · customer တစ်ယောက် entry အများကြီး ရ · နေရာလွတ်ရင် အကြောင်းကြား · customer confirm မှ booking · သက်တမ်းကုန်

```text
waitlist_entries                      -- ပုံကြမ်း, requirement မဟုတ်
  id, branch_id → branches, customer_id → customers
  preferred_employee_id → employees   -- NULL = ဘယ် barber မဆို
  desired_date (MMT), window_start_time, window_end_time   -- NULL = တစ်နေ့လုံး
  location_type (1 ဆိုင် · 2 အိမ် — D-BKG-22) + အိမ်လိပ်စာ
  status: 0 CANCELLED · 1 WAITING · 2 NOTIFIED · 3 BOOKED · 4 EXPIRED   (D-DB-03)
  notified_at, expires_at
  booking_id → bookings               -- BOOKED ဖြစ်ရင် (bookings ကို မပြင်)
  created_by_user_id (staff ထည့်ရင်), created_at, updated_at

waitlist_entry_items                  -- service အများကြီး (D-BKG-03 လို)
  waitlist_entry_id, service_id, service_variant_id (option service — OPEN-29 အဖြေအတိုင်း), sort_order
```

#### (C) ဆောက်ချိန်မှ ဆုံးဖြတ်ရန် (🟡 — အခု မမေး)

1. ⚠️ **Conflict (D-PLT-13):** D-BKG-20 "customer ကို အကြောင်းကြား" ↔ D-CUS-05 (customer ဆီ ဘာမှမပို့) / D-NTF-01 (staff in-app ပဲ) / D-CUS-04 (account မရှိ)။ ရွေးစရာ —
   - (က) Customer က website `/book` ကနေ ကိုယ်တိုင်ထည့် → နေရာလွတ်ရင် staff noti → staff က ဖုန်း / Viber ဆက်
   - (ခ) Staff ပဲ ထည့် (ဖုန်းဆက် / လာမေးတဲ့ customer) → staff noti → staff ဖုန်းဆက် — **Claude အကြံ (30/Sep)**: (က) ဆို customer က "စာရင်းထဲ ရောက်ပြီ" မြင်ပြီး system က နောက်ထပ် ဘာမှ မပြောနိုင်လို့ မျှော်လင့်ချက် မကိုက်
   - (ဂ) Customer ဆီ ပို့တဲ့ channel ဖွင့် — D-CUS-05 ကို ပြောင်းရမယ်
2. နေရာလွတ်ရင် ဘယ်သူ့ကို အရင် — အစောဆုံး ထည့်သူ / ကိုက်တဲ့သူ အကုန်
3. သက်တမ်း — desired date ကုန်ရင် EXPIRED; NOTIFIED ပြီး ဘယ်လောက်အတွင်း မဖြေရင် နောက်တစ်ယောက်
4. Customer တစ်ယောက် entry ဘယ်နှခုအထိ; one-active-booking (D-BKG-09 — website ၁ ခု / staff ကန့်သတ်မရှိ) နဲ့ ဘယ်လိုတွဲ
5. ထည့်ခွင့် / စီမံခွင့် permission

### 6.4c Part 3 — Customers / Booking (🔒 v3)

**Source:** §6.4 (R365 + F-BK-01..15) + v5.1 ဆုံးဖြတ်ချက် (D-BKG-09 / 12 / 20 ⏭, D-SVC-05 option ရွေး) · **Status:** 🔒 **LOCK (30/Sep မနက်) — D-DB-07 = v3** · `@dbml/core` parse OK (Part 1 + 1b + 2 + 3 တွဲ — table ၂၉ ခု) · PostgreSQL 16 load + **test ၃၀/၃၀ PASS** · F-BK-01..21 approve

ဖိုင်: `db/part3-customers-booking-v3.dbml`, `db/part3-customers-booking-v3-constraints.sql`, `db/part3-customers-booking-v3-test.sql`

**Test (PostgreSQL 16):** ဖုန်းတူ customer ✖ · ဖုန်း E.164 မဟုတ် ✖ · ကိုအောင် B1 10:00 + B2 10:20 (branch မတူ) ✖ · buffer ထဲ 10:30 ✖ / block ထိစပ် 10:35 ✅ · အိမ် 14:00 (block 13:30–15:00) + ဆိုင် 13:45 ✖ / 15:00 ✅ · အိမ် လိပ်စာမပါ ✖ · ဆိုင်မှာ ကားခ ✖ · STAFF ထည့်သူမပါ ✖ · STAFF က customer တူ active ၂ ခု ✅ · cancel reason မပါ ✖ · BOOKED မှာ cancel note ✖ · STAFF cancel user မပါ ✖ · customer cancel ✅ → slot ပြန်လွတ် ✅ · no-show SYSTEM ✅ · NO_SHOW reason ထပ် ✖ · STARTED ကလည်း ပိတ် ✖ · ည ၁၂:၃၀ MMT → နောက်ရက် ✅ / UTC ရက် ✖ · block မအုပ် ✖ · token ထပ် ✖ · Ash + ရှည် 30,000 ✅ · တခြား service ရဲ့ variant ✖ · ဈေး အနုတ် ✖

**§6.4 finding status**

| ID | v3 မှာ | Status |
| --- | --- | --- |
| F-BK-01, 02, 05, 06, 07, 08, 10 | `booked_employee_id` NOT NULL · bigint ဈေး · `customer_id` NOT NULL · phone unique (company အလိုက် — D-ORG-03) · preferences ✖ · token NOT NULL UNIQUE | ✅ ထည့်ပြီး (lock နဲ့ approve) |
| F-BK-03 | `booking_items` နာမည် ✅ · service နာမည် snapshot → F-BK-18 | ◐ |
| F-BK-04 | EXCLUDE ✅ — block range ပေါ်မှာ (F-BK-16) | ✅ |
| F-BK-09 | `cancelled_by_actor` 1 CUSTOMER · 2 STAFF · 3 SYSTEM (number — D-DB-03) | ✅ |
| F-BK-11, 12, 14, 15 | channel + ထည့်သူ · active ၁ ခု = app check · reschedule ဈေး · `service_id` FK | ✅ (v5.1) |

**v3 အသစ် F-BK-16..21 — ✅ approve (D-DB-07)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-BK-16 | `block_starts_at` / `block_ends_at` ထား၊ EXCLUDE ကို အဲ့ပေါ်မှာ — ချိန်းချိန် + buffer (D-SVC-07) + home သွား / ပြန်ချိန် (D-SCH-03) | 🔒 D-BKG-08 "DB level" — မထားရင် buffer / သွားချိန် ထပ်တာကို app ပဲ စစ်နိုင်; booking တုန်းက setting ကို snapshot (setting ပြောင်းလည်း ရှိပြီးသား booking မလှုပ်) |
| F-BK-17 | Cancel reason = admin master table (`booking_cancel_reasons`, MM + EN) + no-show အတွက် `system_code` 1; "Other" စာ မဖြစ်မနေ = app စစ် | 🔒 D-DB-04 က "cancel reason" ကို admin setting နာမည်အဖြစ် စာရင်းထဲ ထည့်ထား + D-BKG-14 preset; trade-off: "Other ⇒ စာ" ကို DB CHECK နဲ့ မကာနိုင်တော့ |
| F-BK-18 | Booking မှာ service နာမည် / customer ဖုန်း snapshot မထား (FK နဲ့ ပြ) — receipt နာမည် snapshot = sale (Part 4) | Service / customer ကို မဖျက်ဘူး (D-DAT-05); lock က ဈေး / ကြာချိန် snapshot ပဲ ခိုင်း (D-SVC-04) |
| F-BK-19 | `bookings.customer_name` = booking မှာ ရိုက်တဲ့နာမည်; ဖုန်းကိုက်ပေမဲ့ နာမည်ကွဲရင် `customers.name` ကို auto မပြောင်း (staff ပြင်ရ) | အမေဖုန်းနဲ့ သားအတွက် (D-BKG-09 v5.1) ဆို customer နာမည် သားနာမည် ဖြစ်မသွားအောင် |
| F-BK-20 | Service အများကြီး booking — item တိုင်း ကြာချိန် + buffer (D-SVC-07 စာသားအတိုင်း) | ဥပမာ ညှပ် ၃၀ + buffer ၅ → ဆိုးဆေး ၆၀ + buffer ၀ = ၉၅ မိနစ် · customer တစ်ယောက်တည်း ဆက်လုပ်တာမို့ နောက်ဆုံး service ပြီးမှပဲ buffer ယူချင်ရင် ပြောပါ |
| F-BK-21 | Customer ဖုန်း unique က archive ပြီးသားပါ ပါ — ဖုန်းကိုက်ရင် row အသစ် မဖန်တီး၊ ပြန်ဖွင့် | ဖုန်း = identity (D-CUS-02) — history မကွဲ |

**App က စစ်ရမယ့်ဟာ (DB မကာနိုင်):** OPTIONS service ⇒ variant မဖြစ်မနေ (OPEN-29) · `ends_at` = Σ ကြာချိန် · employee က branch မှာ ရှိ + eligible (HOME = `home_allowed`) · ONLINE active ၁ ခု (customer row FOR UPDATE) · "Other" ⇒ စာ

```dbml
// Point Barbershop — Part 3: Customers / Booking · v3 🔒 D-DB-07 (30/Sep/2026)
// Part 1 (D-DB-02) + 1b (D-DB-05) + 2 (D-DB-06) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1 + part2 နဲ့ တွဲ paste
// 🔒 D-CUS-01..09, D-BKG-01..22 (v5.1: D-BKG-09, D-BKG-12, D-BKG-20 ⏭), D-SVC-04..08, D-SCH-03, D-LV-04,
//    D-ORG-03, D-DB-01/03/04, D-PLT-15 · OPEN-29 (က) = customer က option ကိုယ်တိုင်ရွေး
// Status / type = smallint + CHECK (D-DB-03) · EXCLUDE / CHECK / composite FK = part3-customers-booking-v3-constraints.sql
// F-BK-nn = review finding (§6.4, §6.4c) — D-DB-07 နဲ့ approve ပြီး
// Waitlist ⏭ (D-BKG-20, §6.4b) — ဒီ part မှာ table မထည့်

// ───────────────────────── Customers ─────────────────────────

Table customers {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03 — company-level customer (D-CUS-01)']
  name varchar(255) [not null, note: 'ပြောတဲ့အတိုင်း တစ်ခု (D-DB-04)']
  phone varchar(50) [not null, note: 'ရိုက်ထည့်တဲ့အတိုင်း (ပြဖို့)']
  phone_normalized varchar(20) [not null, note: 'E.164 (+959…) — 🔒 D-CUS-02 identity · (company_id, phone_normalized) unique (archive ပြီးသားပါ — F-BK-21)']
  notes text [note: 'Optional၊ staff အားလုံးမြင် (D-CUS-01) · free text (D-DB-04)']
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE (D-CUS-07, D-DB-03)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz [note: 'Soft delete (D-CUS-07)']

  Indexes {
    (company_id, phone_normalized) [unique, note: 'D-CUS-02 + D-ORG-03']
    (company_id, name) [note: 'Search (D-CUS-06)']
  }

  Note: '''
  Booking / walk-in မှာ ဖုန်းနဲ့ auto match / create (D-CUS-03) — archive ပြီးသား ဖုန်းဆို row အသစ် မဖန်တီး၊ ပြန်ဖွင့် (F-BK-21)
  Account / login မရှိ (D-CUS-04) · customer ဆီ ဘာမှမပို့ — email field မထား (D-CUS-05)
  Preferred barber / timeline / statistics = history ကနေ တွက် — column မထား (D-CUS-07, D-CUS-08)
  F-BK-08: R365 ရဲ့ preferences ✖ (lock မရှိ)
  '''
}

// ───────────────────────── Booking ─────────────────────────

Table booking_cancel_reasons {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04 (admin master list)']
  name_en varchar(150)
  requires_note boolean [not null, default: false, note: '"Other" — စာ မဖြစ်မနေ (D-BKG-14) · app စစ်']
  system_code smallint [note: 'NULL = admin ထည့်တာ · 1 NO_SHOW (D-BKG-17 auto-cancel က သုံး — ပိတ် / archive ✖)']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  F-BK-17 — 🔒 D-BKG-14 preset + D-DB-04 ("cancel reason" = admin master list, MM + EN)
  Seed: Customer ပြောင်းချင် · Barber မအား · Customer မလာ (system_code 1) · Other (requires_note)
  (company_id, system_code) unique · (company_id, name_mm) unique — archive မလုပ်ရသေးတာတွေအတွင်း (SQL)
  '''
}

Table bookings {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id, note: 'Home service ဆိုလည်း barber ထွက်တဲ့ branch (D-SVC-06)']
  customer_id uuid [not null, ref: > customers.id, note: 'Auto match / create (D-CUS-03) · F-BK-06']
  customer_name varchar(255) [not null, note: 'ဒီ booking မှာ ရိုက်ထည့်တဲ့ နာမည် — ဥပမာ အမေဖုန်းနဲ့ သား (D-BKG-09 v5.1) · customers.name ကို auto မပြောင်း (F-BK-19)']
  booked_employee_id uuid [not null, ref: > employees.id, note: '🔒 D-BKG-05 customer ရွေး · D-BKG-08 · F-BK-01/05']
  location_type smallint [not null, default: 1, note: '1 BRANCH (ဆိုင်) · 2 HOME (အိမ်) — D-BKG-22']
  home_address text [note: 'HOME ဆို မဖြစ်မနေ (D-BKG-22) · free text']
  home_address_note text [note: 'HOME — မှတ်သားစရာ (optional, D-BKG-22)']
  transport_fee_amount bigint [note: 'HOME ဆို ကားခ snapshot (MMK — D-SVC-06; 0 = ဆိုင်ခံ) · BRANCH ဆို NULL · sale line = Part 4']
  channel smallint [not null, note: '1 ONLINE (website) · 2 STAFF — F-BK-11 ✅ (D-BKG-09 v5.1)']
  created_by_user_id uuid [ref: > users.id, note: 'STAFF ဆို မဖြစ်မနေ · ONLINE ဆို NULL']
  starts_at timestamptz [not null, note: 'Customer ချိန်းချိန် (HOME = အိမ်ရောက်ချိန်)']
  ends_at timestamptz [not null, note: 'Service အကုန် ပြီးချိန် = starts_at + Σ items.duration_minutes']
  block_starts_at timestamptz [not null, note: 'Barber ပိတ်ချိန် အစ = starts_at − သွားချိန် (HOME — D-SCH-03) · F-BK-16']
  block_ends_at timestamptz [not null, note: 'Barber ပိတ်ချိန် အဆုံး = ends_at + buffer (D-SVC-07) + ပြန်ချိန် (HOME) · F-BK-16']
  business_date date [not null, note: 'starts_at ရဲ့ MMT ရက် (D-PLT-15)']
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 BOOKED · 2 STARTED · 3 COMPLETED (D-BKG-18)']
  cancelled_at timestamptz
  cancel_reason_id uuid [ref: > booking_cancel_reasons.id, note: 'D-BKG-14 · no-show auto = system_code 1 (D-BKG-17)']
  cancel_note text [note: 'Other ဆို မဖြစ်မနေ (app)']
  cancelled_by_actor smallint [note: '1 CUSTOMER (manage link) · 2 STAFF · 3 SYSTEM (no-show) — F-BK-09']
  cancelled_by_user_id uuid [ref: > users.id, note: 'STAFF ဆို မဖြစ်မနေ']
  manage_token_hash varchar(255) [not null, unique, note: 'Raw token မသိမ်း (D-BKG-11) · staff ထည့်တဲ့ booking လည်း link ထုတ် — F-BK-10']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, business_date)
    (booked_employee_id, block_starts_at)
    (customer_id, starts_at)
  }

  Note: '''
  🔒 D-BKG-08 — barber တစ်ယောက် ပိတ်ချိန် (block) ထပ် ✖ — branch မတူလည်း (EXCLUDE — SQL) · first success wins
  🔒 D-BKG-09 (v5.1) — active (BOOKED / STARTED) ၁ ခု = ONLINE booking မှာပဲ app စစ် (customer row FOR UPDATE) · DB index မသုံး
  🔒 D-BKG-12 (v5.1) — reschedule: အချိန်ပဲ ရွှေ့ = items ဈေး / ကြာချိန် / buffer မပြောင်း၊ block ပြန်တွက် ·
     service / option ပြောင်း = အဲ့ item ပဲ ဈေးအသစ် · barber / ဆိုင် ↔ အိမ် ပြောင်း = item အကုန် + ကားခ ဈေးအသစ်
  🔒 D-BKG-16 — CANCELLED ကနေ ပြန်မဖွင့် · CANCELLED ⇔ cancel field တွေ (CHECK — SQL)
  Availability (D-BKG-04) = shift − booking block − leave (pending ပါ — D-LV-04) − walk-in visit (Part 4) — app, code တစ်နေရာတည်း (§6.4b A-2)
  Cancel / reschedule / no-show = code လမ်းကြောင်း တစ်ခုတည်း (§6.4b A-3) · noti + audit (D-BKG-15, Part 8)
  Employee: ဒီ branch မှာ ရှိ (employee_branches) + eligible (D-EMP-05; HOME = home_allowed) — app စစ်
  STARTED / COMPLETED = visit (Part 4) က ပြောင်း — visits.booking_id FK Part 4 မှာ
  '''
}

Table booking_items {
  id uuid [pk]
  booking_id uuid [not null, ref: > bookings.id]
  sort_order smallint [not null, note: 'ဆက်တိုက် အစဉ် (D-BKG-03)']
  service_id uuid [not null, ref: > services.id, note: 'F-BK-15 ✅ (Part 2 🔒)']
  service_variant_id uuid [ref: > service_variants.id, note: 'OPTIONS service = မဖြစ်မနေ (OPEN-29 (က) — app စစ်) · SIMPLE = NULL · ဒီ service ရဲ့ variant ပဲ (composite FK — SQL)']
  unit_price_amount bigint [not null, note: 'ချိန်းရက်ရဲ့ ဈေး snapshot (D-SVC-04, D-SVC-08; barber / HOME ဈေး ပါ) — F-BK-02']
  duration_minutes integer [not null, note: 'Snapshot (D-SVC-05 ကွက် ကြာချိန် ဒါမှမဟုတ် branch ပုံမှန်)']
  buffer_minutes smallint [not null, default: 0, note: 'Snapshot (D-SVC-07) — item တိုင်း ကြာချိန် + buffer']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (booking_id, sort_order) [unique]
  }

  Note: '''
  Service အများကြီး + barber တစ်ယောက် + ဆက်တိုက် (D-BKG-03)
  Service နာမည် snapshot မထား — services ကို မဖျက်ဘူး (D-DAT-05); receipt နာမည် snapshot = sale (Part 4) — F-BK-18
  '''
}
```

```sql
-- Point Barbershop — Part 3 v3 (🔒 D-DB-07) · Customers / Booking · DBML မှာ ရေးလို့မရတဲ့ constraint
-- Part 2 SQL က btree_gist extension ဖွင့်ပြီးသား (EXCLUDE)

-- D-DB-03: status / type number
ALTER TABLE customers ADD CONSTRAINT customers_status_chk CHECK (status IN (0, 1));
-- D-CUS-02: E.164 ပုံစံ (+ နဲ့ စ၊ ဂဏန်း ၇–၁၅ လုံး)
ALTER TABLE customers ADD CONSTRAINT customers_phone_e164_chk CHECK (phone_normalized ~ '^\+[1-9][0-9]{6,14}$');

ALTER TABLE booking_cancel_reasons ADD CONSTRAINT booking_cancel_reasons_status_chk CHECK (status IN (0, 1));
ALTER TABLE booking_cancel_reasons ADD CONSTRAINT booking_cancel_reasons_system_code_chk CHECK (system_code IS NULL OR system_code IN (1));
CREATE UNIQUE INDEX booking_cancel_reasons_system_code_uq
  ON booking_cancel_reasons (company_id, system_code) WHERE system_code IS NOT NULL;
CREATE UNIQUE INDEX booking_cancel_reasons_name_active
  ON booking_cancel_reasons (company_id, name_mm) WHERE archived_at IS NULL;

ALTER TABLE bookings ADD CONSTRAINT bookings_status_chk        CHECK (status IN (0, 1, 2, 3));      -- 0 CANCELLED · 1 BOOKED · 2 STARTED · 3 COMPLETED
ALTER TABLE bookings ADD CONSTRAINT bookings_location_chk      CHECK (location_type IN (1, 2));     -- 1 BRANCH · 2 HOME
ALTER TABLE bookings ADD CONSTRAINT bookings_channel_chk       CHECK (channel IN (1, 2));           -- 1 ONLINE · 2 STAFF
ALTER TABLE bookings ADD CONSTRAINT bookings_cancel_actor_chk  CHECK (cancelled_by_actor IS NULL OR cancelled_by_actor IN (1, 2, 3));

-- အချိန် အစဉ် · block က ချိန်းချိန်ကို အုပ်ရမယ် (F-BK-16)
ALTER TABLE bookings ADD CONSTRAINT bookings_time_chk  CHECK (ends_at > starts_at);
ALTER TABLE bookings ADD CONSTRAINT bookings_block_chk CHECK (block_starts_at <= starts_at AND block_ends_at >= ends_at);
-- D-PLT-15: business_date = starts_at ရဲ့ MMT ရက်
ALTER TABLE bookings ADD CONSTRAINT bookings_business_date_chk
  CHECK (business_date = (starts_at AT TIME ZONE 'Asia/Yangon')::date);

-- D-BKG-22 / D-SVC-06: HOME ⇔ လိပ်စာ + ကားခ · BRANCH ဆို မရှိ
ALTER TABLE bookings ADD CONSTRAINT bookings_home_chk CHECK (
  (location_type = 2 AND home_address IS NOT NULL AND btrim(home_address) <> ''
                     AND transport_fee_amount IS NOT NULL AND transport_fee_amount >= 0)
  OR
  (location_type = 1 AND home_address IS NULL AND home_address_note IS NULL AND transport_fee_amount IS NULL)
);

-- F-BK-11 (D-BKG-09 v5.1): STAFF ⇔ ထည့်သူ
ALTER TABLE bookings ADD CONSTRAINT bookings_channel_user_chk CHECK (
  (channel = 2 AND created_by_user_id IS NOT NULL) OR (channel = 1 AND created_by_user_id IS NULL)
);

-- D-BKG-14 / D-BKG-16 / F-BK-09: CANCELLED ⇔ cancel field တွေ · STAFF ဆို user
ALTER TABLE bookings ADD CONSTRAINT bookings_cancel_fields_chk CHECK (
  (status = 0 AND cancelled_at IS NOT NULL AND cancel_reason_id IS NOT NULL AND cancelled_by_actor IS NOT NULL)
  OR
  (status <> 0 AND cancelled_at IS NULL AND cancel_reason_id IS NULL AND cancel_note IS NULL
               AND cancelled_by_actor IS NULL AND cancelled_by_user_id IS NULL)
);
ALTER TABLE bookings ADD CONSTRAINT bookings_cancel_staff_user_chk CHECK (
  cancelled_by_actor IS DISTINCT FROM 2 OR cancelled_by_user_id IS NOT NULL
);

-- 🔒 D-BKG-08: barber တစ်ယောက်ရဲ့ ပိတ်ချိန် ထပ် ✖ (branch မတူလည်း၊ buffer + home သွား / ပြန်ချိန် ပါ) · [) = ထိစပ်ရုံ ရ
ALTER TABLE bookings ADD CONSTRAINT bookings_no_overlap
  EXCLUDE USING gist (
    booked_employee_id WITH =,
    tstzrange(block_starts_at, block_ends_at, '[)') WITH &&
  ) WHERE (status IN (1, 2));

-- D-BKG-17: no-show timer ရှာဖို့ (BOOKED ပဲ)
CREATE INDEX bookings_booked_by_start ON bookings (starts_at) WHERE status = 1;

-- D-BKG-09 (v5.1): active booking ၁ ခု — DB index မသုံး (STAFF ကန့်သတ်မရှိ)
-- ONLINE booking မှာ app က: SELECT … FROM customers WHERE id = $1 FOR UPDATE → active (1, 2) ရှိရင် ပယ်

-- booking_items
ALTER TABLE booking_items ADD CONSTRAINT booking_items_amount_chk   CHECK (unit_price_amount >= 0);
ALTER TABLE booking_items ADD CONSTRAINT booking_items_duration_chk CHECK (duration_minutes > 0);
ALTER TABLE booking_items ADD CONSTRAINT booking_items_buffer_chk   CHECK (buffer_minutes BETWEEN 0 AND 120);
-- D-SVC-05: variant က ဒီ service ရဲ့ဟာပဲ (Part 2 ရဲ့ service_variants (id, service_id) unique ကို သုံး)
ALTER TABLE booking_items ADD CONSTRAINT booking_items_variant_service_fk
  FOREIGN KEY (service_variant_id, service_id) REFERENCES service_variants (id, service_id);
```

### 6.4d Part 4 — Service execution / Sales / Payments (🔒 v1)

**Source:** 🔒 D-VIS-01..13, D-PAY-01..09, D-SVC-04 / 06, D-COM-02..04 + v5.1 ဆုံးဖြတ်ချက် (OPEN-01, 09, 15, 16, 24, 28; REC-11, 12, 25) · **Status:** 🔒 **LOCK (30/Sep မနက်) — D-DB-08 = v1** · `@dbml/core` parse OK (Part 1 + 1b + 2 + 3 + 4 တွဲ — table ၄၂ ခု) · PostgreSQL 16 load + **test ၅၇/၅၇ PASS** · F-P4-01..13 approve

ဖိုင်: `db/part4-visits-sales-payments-v1.dbml`, `db/part4-visits-sales-payments-v1-constraints.sql`, `db/part4-visits-sales-payments-v1-test.sql`

**Table ၁၃ ခု:** `visits` · `sales` · `sale_items` · `payment_methods` · `payments` · `receipt_counters` · `discount_codes` · `discount_code_branches` · `discount_code_customer_uses` · `discount_requests` · `refunds` · `refund_items` · `sale_adjustments`

**Test (PostgreSQL 16):** double submit ✖ (client_request_id) · booking ၁ = visit ၁ · late entry reason / OTHER note ✖ · HOME လိပ်စာ ✖ · COMPLETE by / INCOMPLETE reason ✖ · business_date UTC ✖ · visit ၁ = sale ၁ · SERVICE performed_by ✖ · တခြား service ရဲ့ variant ✖ · ဈေး ≠ list reason ✖ / + reason + by ✅ · line ဖြုတ် reason ✖ · ကားခ line discount ✖ · PRODUCT product_id ✖ · line_total generated ✅ · code စာလုံးသေး ✖ · % + amount ✖ · discount code / request မပါ ✖ · request reason ✖ · PENDING ၂ ✖ · APPROVED by ✖ · code + request ၂ ခု ✖ · total မကိုက် ✖ · KBZPay ref ထပ် ✖ · amount 0 ✖ · void reason ✖ · verify by ✖ · FINISH receipt မပါ ✖ · receipt ပုံစံ ✖ · counter gapless ✅ · seq ထပ် ✖ · business_date ≠ finish ✖ · once_per_customer ၂ ကြိမ် ✖ · RF ပုံစံ ✖ · partial refund ✅ · adjustment refs ✖ / ✅

**v1 design finding F-P4-01..13 — ✅ approve (D-DB-08)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-P4-01 | **Visit ≠ Sale** — `visits` = ဝန်ဆောင်မှု (START / COMPLETE / INCOMPLETE)၊ `sales` = ငွေစာရင်း (line / discount / payment / receipt); service visit = 1 : 1၊ product-only sale = visit မရှိ (D-PAY-03); service line = `sale_items` (visit_items table သီးသန့် မထား) | ဈေး snapshot တစ်နေရာတည်း; refund / adjustment / commission အကုန် sale line ပေါ်; INCOMPLETE = sale CANCELLED (D-VIS-09) |
| F-P4-02 | `sale_items.performed_by_employee_id` line တစ်ခုချင်း (V1 = visit.performed_by — app) | Commission / KPI line အလိုက် (D-COM-03, D-KPI-01); နောက်မှ visit ၁ ခု barber ၂ ယောက် ဖြစ်လာရင် DB မပြင် |
| F-P4-03 | **ဈေး override** = `list_price_amount` (ဈေး table) + `unit_price_amount` (ယူတဲ့ဈေး) — ≠ ဆို reason + `price_override_by_user_id` (CHECK); permission `sale.override_price` (admin / manager)၊ barber ✖ | 🔒 D-SVC-04 "authorized adjustment + reason + audit" + D-SVC-06 ကားခ လျှော့ · discount code (D-PAY-04) နဲ့ သီးခြား — report မှာ override ကို ခွဲမြင်ရ |
| F-P4-04 | **Receipt gapless** = `receipt_counters` (branch, kind, year, month) row lock — FINISH transaction ထဲ `last_seq + 1`; sale မှာ နံပါတ် + အပိုင်း (year / month / seq) ခွဲသိမ်း + regex CHECK | 🔒 D-PAY-06 v5.1 ဆက်တိုက်၊ မကျော် · sequence object က rollback မှာ ကျော်တတ် |
| F-P4-05 | **Discount approval** = `discount_requests` table (PENDING ၁ ခု / sale); sale က `discount_code_id` **XOR** `discount_request_id` (CHECK); once-per-customer = `discount_code_customer_uses` unique (DB ကာ) | D-PAY-04 v5.1 app ထဲ တောင်း / ✔ · တစ်ခါသုံး code row ထုတ်စရာ မလို · report = barber အလိုက် တောင်း / ရ |
| F-P4-06 | **Refund ၂ မျိုး** — kind 1 SALE_REFUND (full / partial → `refund_items` → commission reversal, Part 5) · kind 2 OVERPAYMENT_RETURN (KBZPay ၂ ခါ လွှဲ — ဝင်ငွေ / commission မထိ); refund receipt `B3-RF-…` counter kind 2 | 🔒 D-PAY-05 "KBZPay duplicate transfer ကို adjustment နဲ့ trace" ကို refund kind အဖြစ် |
| F-P4-07 | **`sale_adjustments` = correction ledger** (payment method / performer / collected_by / note) — FINISHED sale / payment row မပြင်; report / closing / commission က ledger ကို ပေါင်းဖတ်; ငွေပမာဏ ပြင် ✖ (ပိုယူ = refund၊ လျော့ယူ = line အသစ် sale) | 🔒 D-VIS-08 immutable + "adjustment + reason + audit" |
| F-P4-08 | `client_request_id uuid UNIQUE` — visits / sales / payments / refunds | 🔒 D-VIS-10 idempotent ကို DB level (double tap = duplicate key) |
| F-P4-09 | Late entry field (`is_late_entry`, reason, note) = `visits` မှာပဲ; product-only sale late entry ⏭ | D-VIS-13 = visit-centric (performed_at = `started_at`၊ recorded_at = `created_at`); product sale နည်း |
| F-P4-10 | Sale ၁ ခု payment အများကြီး ရ (cash + KBZPay ခွဲပေး); Σ payments = total = **app** (DB CHECK cross-table မရ — Part 8 trigger ထည့်နိုင်) | D-PAY-01 · Σ line = subtotal လည်း အတူတူ |
| F-P4-11 | `sale_items.description_mm / _en` snapshot (service + ကွက် / product / ကားခ) | D-PAY-06 reprint = နံပါတ်တူ + စာသားတူ; F-BK-18 (Part 3) က ဒီကို ညွှန်ထား |
| F-P4-12 | `sales.business_date` = **FINISH** ချိန်ရဲ့ MMT ရက် (ဝင်ငွေရက်); `visits.business_date` = START ရက်; closing / KPI = sale ရက် | D-PLT-15 · ည ၁၂ ကျော် FINISH ဆို နောက်ရက် ဝင်ငွေ (ရှားတယ်) |
| F-P4-13 | Visit INCOMPLETE ဆို booking → 3 COMPLETED (visit ဘက်က INCOMPLETE ပြ) — app rule | Booking status 4 ခုပဲ (D-BKG-18) — "ရောက်လာပြီ" ကို no-show နဲ့ မရော |

**App / Part 8 trigger က စစ်ရမယ့်ဟာ (DB မကာနိုင် — SQL ဖိုင် အောက်ဆုံး):** Σ line / Σ payment · reference ⇐ method · SERVICE line ⇒ visit · HOME ⇒ ကားခ line ၁ ခု · discount code rule (ရက် / branch / max_uses / once) · APPROVED ပဲ ချိတ် · late entry ⇐ closing မပိတ် · proxy = 1 ⇐ B payment · performer ≠ booked ⇒ reason · refund ≤ ကျန်

```dbml
// Point Barbershop — Part 4: Service execution / Sales / Payments · v1 🔒 D-DB-08 (30/Sep/2026)
// Part 1 (D-DB-02) + 1b (D-DB-05) + 2 (D-DB-06) + 3 (D-DB-07) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1 + part2 + part3 နဲ့ တွဲ paste
// 🔒 D-VIS-01..13 (v5.1: D-VIS-02 / 06 / 12 / 13), D-PAY-01..09 (v5.1: D-PAY-02 / 04 / 06 / 08), D-SVC-04 / 06, D-COM-02 / 03 / 04,
//    D-KPI-01 / 02, D-DAT-05, D-AUD-02, D-ORG-03, D-DB-01 / 03 / 04, D-PLT-15
// Status / type = smallint + CHECK (D-DB-03) · CHECK / partial unique / generated column = part4-visits-sales-payments-v1-constraints.sql
// F-P4-nn = review finding (§6.4d) — D-DB-08 နဲ့ approve ပြီး
// ငွေ table (sales, sale_items, payments, refunds, sale_adjustments) ပြောင်းတိုင်း DB trigger → audit_events (Part 8 — D-AUD-02)
// Products (D-PAY-03) = Part 6 — sale_items.product_id ကို note ပဲ (§6.5 #9 future FK)

// ───────────────────────── Visit (service execution) ─────────────────────────

Table visits {
  id uuid [pk, note: 'UUIDv7']
  client_request_id uuid [not null, unique, note: 'App က request တိုင်း ထုတ် — double submit ကာ (🔒 D-VIS-10) · F-P4-08']
  branch_id uuid [not null, ref: > branches.id, note: 'Home service ဆိုလည်း barber ရဲ့ branch (D-SVC-06)']
  booking_id uuid [ref: > bookings.id, note: 'Booking ကလာရင် (D-VIS-01) · booking ၁ ခု = visit ၁ ခု (partial unique — SQL) · NULL = walk-in']
  performed_by_employee_id uuid [not null, ref: > employees.id, note: '🔒 D-VIS-03 Actual service barber · commission / KPI (D-COM-03, D-KPI-01)']
  performer_change_reason text [note: 'booking.booked_employee_id ≠ performed_by ဆို မဖြစ်မနေ (🔒 D-VIS-04 — app စစ်)']
  proxy_reason smallint [note: 'NULL = barber ကိုယ်တိုင် ကိုယ့်ဖုန်းနဲ့ မှတ် (D-VIS-11) · 1 PHONE_UNAVAILABLE (🔒 D-VIS-12 — B က payment / FINISH ပါ လုပ်ရ) · 2 OTHER (D-VIS-04 ကူမှတ်)']
  location_type smallint [not null, default: 1, note: '1 BRANCH · 2 HOME (D-SVC-06)']
  home_address text [note: 'HOME ဆို မဖြစ်မနေ (booking ကနေ ကူး / walk-in ဆို ရိုက်)']
  status smallint [not null, default: 1, note: '0 INCOMPLETE (D-VIS-09) · 1 STARTED · 2 COMPLETED (service ပြီး၊ ငွေမရှင်းသေး) · 3 FINISHED (D-VIS-07)']
  started_at timestamptz [not null, note: 'တကယ် စချိန် — late entry ဆို user ရိုက် (performed_at — D-VIS-13)']
  started_by_user_id uuid [not null, ref: > users.id, note: 'START နှိပ်သူ = Recorded by (D-VIS-03 / 12)']
  completed_at timestamptz [note: 'တကယ် ပြီးချိန်']
  completed_by_user_id uuid [ref: > users.id, note: 'D-VIS-03 Completed by']
  finished_at timestamptz [note: '= sales.finished_at (D-VIS-07)']
  incomplete_reason text [note: 'D-VIS-09 — status 0 ဆို မဖြစ်မနေ']
  incomplete_at timestamptz
  incomplete_by_user_id uuid [ref: > users.id]
  is_late_entry boolean [not null, default: false, note: '🔒 D-VIS-13 — စက္ကူ / မေ့သွား → နောက်မှ သွင်း · report flag']
  late_entry_reason smallint [note: '1 INTERNET_OUTAGE · 2 POWER_OUTAGE · 3 PHONE_BROKEN · 4 FORGOT · 9 OTHER (D-VIS-13 preset) — is_late_entry ⇔ ဖြည့်']
  late_entry_note text [note: 'OTHER ဆို မဖြစ်မနေ (CHECK)']
  business_date date [not null, note: 'started_at ရဲ့ MMT ရက် (D-PLT-15) · late entry = ဒီ branch-day closing မပိတ်ခင်ပဲ (Part 7 — app စစ်)']
  created_at timestamptz [not null, default: `now()`, note: '= recorded_at (D-VIS-13: performed_at ≠ recorded_at)']
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, business_date)
    (performed_by_employee_id, started_at)
  }

  Note: '''
  🔒 D-VIS-11 flow: START (barber + branch ပဲ — D-VIS-02 v5.1) → COMPLETE (service မဖြစ်မနေ) → payment → FINISH · visit ၁ ခု = barber ၁ ယောက် (V1 UI)
  🔒 D-VIS-07 — payment မပြီး FINISH ✖ · 🔒 D-VIS-08 — FINISHED ⇒ visit + sale immutable (refund / adjustment ပဲ)
  🔒 D-VIS-09 — INCOMPLETE = revenue / commission ✖ → sale status 0 CANCELLED · F-P4-13 booking → 3 COMPLETED
  Customer = sales.customer_id (FINISH မှာ optional — D-VIS-02) / booking.customer_id
  Late entry ⇒ started_at / completed_at / payments.received_at = user ရိုက်၊ created_at = သွင်းချိန် · F-P4-09 product-only sale late entry ⏭
  Booking status: START → 2 STARTED · FINISH → 3 COMPLETED (Part 3 — app)
  '''
}

// ───────────────────────── Sale (checkout document) ─────────────────────────

Table sales {
  id uuid [pk]
  client_request_id uuid [not null, unique, note: 'D-VIS-10 · F-P4-08']
  branch_id uuid [not null, ref: > branches.id]
  visit_id uuid [unique, ref: - visits.id, note: 'Service sale = visit ၁ ခု : sale ၁ ခု · NULL = product-only sale (🔒 D-PAY-03) · F-P4-01']
  customer_id uuid [ref: > customers.id, note: 'Optional (D-VIS-02 v5.1) — booking ကနေ / FINISH မှာ ဖုန်း · once_per_customer code သုံးရင် မဖြစ်မနေ (app)']
  status smallint [not null, default: 1, note: '0 CANCELLED (visit INCOMPLETE) · 1 OPEN (ပြင်ရ) · 2 FINISHED (immutable — D-VIS-08)']
  subtotal_amount bigint [not null, default: 0, note: 'Σ active line (unit × qty) — MMK · app / Part 8 trigger']
  discount_amount bigint [not null, default: 0, note: 'Code / approval ကနေ — sale တစ်ခုလုံး (D-PAY-04) · line တွေဆီ ခွဲ = sale_items.line_discount_amount']
  discount_code_id uuid [ref: > discount_codes.id, note: 'Standing code — sale ၁ ခု code ၁ ခု (D-PAY-04)']
  discount_request_id uuid [ref: - discount_requests.id, note: 'App ထဲ တောင်း / ✔ (D-PAY-04 v5.1) — APPROVED ပဲ (app) · code နဲ့ တစ်ခုပဲ (CHECK)']
  service_charge_rate numeric(5,2) [not null, default: 0, note: 'Snapshot % (D-PAY-08 — Additional Settings, default OFF = 0)']
  service_charge_amount bigint [not null, default: 0]
  tax_rate numeric(5,2) [not null, default: 0, note: 'Snapshot % (D-PAY-08)']
  tax_amount bigint [not null, default: 0]
  total_amount bigint [not null, default: 0, note: '= subtotal − discount + service charge + tax (CHECK) · Σ payments = total (app — F-P4-10)']
  receipt_number varchar(40) [unique, note: '🔒 D-PAY-06 v5.1 `B3-2026-OCT-00125` — FINISH မှာ receipt_counters ကနေ (gapless) · F-P4-04']
  receipt_year smallint
  receipt_month smallint
  receipt_seq integer [note: '(branch, year, month) အတွင်း ဆက်တိုက် — unique (SQL)']
  business_date date [note: 'finished_at ရဲ့ MMT ရက် = ဝင်ငွေရက် (D-PLT-15) · daily closing (Part 7) ဒီရက်နဲ့ · F-P4-12']
  finished_at timestamptz [note: 'D-VIS-07 — payment ပြီးမှ']
  finished_by_user_id uuid [ref: > users.id, note: 'FINISH နှိပ်သူ — performer / proxy (D-VIS-12) / override']
  cancelled_at timestamptz [note: 'status 0 (visit INCOMPLETE)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, business_date)
    (customer_id, finished_at)
    (branch_id, receipt_year, receipt_month, receipt_seq) [unique]
  }

  Note: '''
  START မှာ OPEN sale ဖန်တီး (visit နဲ့ အတူ) → COMPLETE မှာ service line → payment → FINISH = receipt နံပါတ် + immutable
  FINISH ⇔ receipt / finished_at / finished_by / business_date (CHECK — SQL)
  Discount: sale တစ်ခုလုံး · code XOR request · ကားခ line မလျှော့ (app) · line ခွဲ ဈေးအချိုး (app) — D-PAY-04 v5.1
  Tax / service charge = amount snapshot (D-PAY-08) — တွက်အစဉ် 🟡 ဖွင့်မှ
  Commission estimate (D-COM-04) = screen မှာ တွက်ပြ၊ DB မသိမ်း · final = Part 5
  '''
}

Table sale_items {
  id uuid [pk]
  sale_id uuid [not null, ref: > sales.id]
  sort_order smallint [not null]
  line_type smallint [not null, note: '1 SERVICE · 2 PRODUCT (D-PAY-03 — Part 6) · 3 TRANSPORT_FEE (ကားခ — D-SVC-06, commission ✖)']
  service_id uuid [ref: > services.id, note: 'SERVICE ⇒ မဖြစ်မနေ (CHECK)']
  service_variant_id uuid [ref: > service_variants.id, note: 'OPTIONS service ⇒ ကွက် (D-SVC-05) · ဒီ service ရဲ့ variant ပဲ (composite FK — SQL)']
  product_id uuid [note: 'PRODUCT ⇒ မဖြစ်မနေ (CHECK) · → products (Part 6) — FK Part 6 မှာ ထည့် (§6.5 #9)']
  booking_item_id uuid [ref: > booking_items.id, note: 'Booking ကနေ ကြိုဖြည့်တဲ့ line (D-VIS-02 v5.1) · NULL = visit မှာ ထည့်']
  performed_by_employee_id uuid [ref: > employees.id, note: 'SERVICE ⇒ မဖြစ်မနေ — commission / KPI (D-COM-03) · V1 = visit.performed_by (app) · F-P4-02']
  description_mm varchar(300) [not null, note: 'Receipt စာသား snapshot (service + ကွက် / product / ကားခ) — reprint တူအောင် (D-PAY-06) · F-P4-11']
  description_en varchar(300) [note: 'D-DB-04']
  quantity integer [not null, default: 1, note: 'SERVICE / TRANSPORT_FEE = 1']
  list_price_amount bigint [not null, note: 'ဈေး table / ကားခ setting ကနေ ရှာတဲ့ ဈေး — ဝန်ဆောင်မှုရက် (D-SVC-04 / 08, D-SVC-06)']
  unit_price_amount bigint [not null, note: 'တကယ် ယူတဲ့ ဈေး — ≠ list ဆို override reason + by (CHECK) · barber ✖ (D-SVC-04) · F-P4-03']
  price_override_reason text
  price_override_by_user_id uuid [ref: > users.id, note: 'Permission `sale.override_price` (D-SVC-04 / D-SVC-06 ကားခ လျှော့)']
  line_discount_amount bigint [not null, default: 0, note: 'sales.discount_amount ကို ဈေးအချိုးနဲ့ ခွဲ (D-PAY-04 v5.1) — TRANSPORT_FEE = 0 (CHECK) · commission = net (D-COM-02)']
  added_reason text [note: 'Booking visit မှာ booking ထဲ မပါတဲ့ service ထည့်ရင် (🔒 D-VIS-05 — app စစ်)']
  removed_at timestamptz [note: 'Sale OPEN တုန်း ဖြုတ် — row မဖျက် (D-DAT-05) · totals ထဲ မပါ']
  removed_by_user_id uuid [ref: > users.id]
  removed_reason text [note: 'D-VIS-05 — removed_at ⇔ (CHECK)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (sale_id, sort_order) [unique]
    (performed_by_employee_id, created_at)
  }

  Note: '''
  Service line = "visit item" — visit_items table သီးသန့် မထား (ဈေး snapshot တစ်နေရာတည်း) · F-P4-01
  line_total_amount = unit × qty − line_discount (generated — SQL)
  Commissionable (D-COM-02) = SERVICE line ပဲ (PRODUCT / TRANSPORT_FEE ✖) — Part 5 က ဖတ်
  HOME visit ⇒ TRANSPORT_FEE line ၁ ခု (list = branch setting / booking snapshot; 0 = ဆိုင်ခံ) — app
  '''
}

// ───────────────────────── Payment ─────────────────────────

Table payment_methods {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  code varchar(30) [not null, note: 'CASH · KBZPAY (code ထဲ constant) — နောက်ထပ် ထည့်နိုင် (D-PAY-01)']
  name_mm varchar(100) [not null, note: 'D-DB-04']
  name_en varchar(100)
  kind smallint [not null, note: '1 CASH · 2 MOBILE_WALLET · 3 BANK_TRANSFER · 4 CARD (D-DB-03)']
  is_cash boolean [not null, default: false, note: 'Drawer cash in (D-FIN-07) · closing expected cash']
  requires_reference boolean [not null, default: false, note: 'KBZPay = true (🔒 D-PAY-02)']
  requires_verification boolean [not null, default: false, note: 'KBZPay = true — closing မှာ တစ်ခုချင်း ✔ (D-PAY-02 v5.1)']
  reference_regex varchar(200) [note: 'Reference ပုံစံ စစ် — Additional Settings (D-PLT-07, OPEN-24) · NULL = မစစ်']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Indexes {
    (company_id, code) [unique]
  }

  Note: 'Seed: CASH (kind 1, is_cash) · KBZPAY (kind 2, reference + verification) — D-PAY-01 · Tips ✖ (D-PAY-09)'
}

Table payments {
  id uuid [pk]
  client_request_id uuid [not null, unique, note: 'D-VIS-10 · F-P4-08']
  sale_id uuid [not null, ref: > sales.id]
  payment_method_id uuid [not null, ref: > payment_methods.id]
  amount bigint [not null, note: '> 0 · Σ (voided မပါ) = sales.total_amount (app — F-P4-10 split payment ရ)']
  collected_by_employee_id uuid [not null, ref: > employees.id, note: '🔒 D-VIS-06 ငွေလက်ခံသူ — default performer · proxy (D-VIS-12) = B · closing တာဝန်']
  received_at timestamptz [not null, note: 'တကယ် လက်ခံချိန် (late entry = user ရိုက်)']
  recorded_by_user_id uuid [not null, ref: > users.id]
  external_reference varchar(100) [note: 'KBZPay transaction ref (D-DB-01 naming) — method requires_reference ⇒ မဖြစ်မနေ (app) · method အလိုက် unique (partial — SQL) 🔒 D-PAY-02']
  verified_at timestamptz [note: 'D-PAY-02 v5.1 — closing မှာ KBZPay app history နဲ့ တိုက်ပြီး ✔']
  verified_by_user_id uuid [ref: > users.id]
  voided_at timestamptz [note: 'Sale OPEN တုန်း မှားရိုက်တာ ပြန်ဖြုတ် — row မဖျက် (D-DAT-05) · FINISHED ⇒ refund / adjustment ပဲ']
  voided_by_user_id uuid [ref: > users.id]
  void_reason text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (sale_id)
    (payment_method_id, received_at)
  }

  Note: '''
  Verify ≠ FINISH (C-1 — D-VIS-07): FINISH = payment *မှတ်ပြီး*; verify = closing (Part 7)
  Closing list = requires_verification method · voided_at IS NULL · verified_at IS NULL · sale.business_date = ရက် (partial index — SQL)
  '''
}

Table receipt_counters {
  branch_id uuid [not null, ref: > branches.id]
  kind smallint [not null, note: '1 SALE · 2 REFUND (RF series — D-PAY-06)']
  receipt_year smallint [not null]
  receipt_month smallint [not null, note: '1–12 (MMT business date)']
  last_seq integer [not null, default: 0]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, kind, receipt_year, receipt_month) [pk]
  }

  Note: '''
  F-P4-04 — FINISH / refund transaction ထဲမှာ row lock (UPDATE … SET last_seq = last_seq + 1 RETURNING) → gapless (🔒 D-PAY-06 v5.1)
  Row မရှိသေးရင် INSERT … ON CONFLICT · transaction တို (FINISH click တစ်ခုတည်း)
  '''
}

// ───────────────────────── Discount (🔒 D-PAY-04 v5.1) ─────────────────────────

Table discount_codes {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  code varchar(40) [not null, note: 'ရိုက် / ပြောတဲ့ code — uppercase သိမ်း · (company_id, code) unique (archive ပါ — code ပြန်မသုံး)']
  name_mm varchar(150) [not null, note: 'Admin label — ဥပမာ ပုံမှန် customer (D-DB-04)']
  name_en varchar(150)
  discount_type smallint [not null, note: '1 PERCENT · 2 AMOUNT']
  discount_percent smallint [note: 'PERCENT ⇒ 1–100 (CHECK)']
  discount_amount bigint [note: 'AMOUNT ⇒ > 0 MMK (CHECK)']
  is_public boolean [not null, default: false, note: 'true = social media promo — customer ပြောမှ၊ barber checkout list မှာ မပြ · false = internal (list ကနေ ရွေး)']
  once_per_customer boolean [not null, default: false, note: 'true ⇒ customer ဖုန်း မဖြစ်မနေ (app) · discount_code_customer_uses unique']
  max_uses integer [note: 'NULL = အကန့်အသတ်မဲ့ · N = စုစုပေါင်း (app — code row lock ပြီး count)']
  scope_type smallint [not null, default: 1, note: '1 ALL_BRANCHES · 2 BRANCHES (discount_code_branches)']
  valid_from date [note: 'MMT · NULL = ချက်ချင်း']
  valid_to date [note: 'NULL = သက်တမ်း မကုန်']
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Indexes {
    (company_id, code) [unique]
  }

  Note: 'Report: code / barber / ကြိမ် / ပမာဏ = sales (discount_code_id) ကနေ · ဘယ် code ကြိုဖန်တီး = go-live data · service ကန့်သတ် ⏭ · website /book မှာ code ⏭'
}

Table discount_code_branches {
  id uuid [pk]
  discount_code_id uuid [not null, ref: > discount_codes.id]
  branch_id uuid [not null, ref: > branches.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (discount_code_id, branch_id) [unique]
  }

  Note: 'scope_type = 2 ⇒ row ၁ ခု အနည်းဆုံး (app) — employee_role_branches ပုံစံ'
}

Table discount_code_customer_uses {
  id uuid [pk]
  discount_code_id uuid [not null, ref: > discount_codes.id]
  customer_id uuid [not null, ref: > customers.id]
  sale_id uuid [not null, ref: - sales.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (discount_code_id, customer_id) [unique, note: 'once_per_customer code — customer ၁ ယောက် ၁ ကြိမ် (DB ကာ) · F-P4-05']
  }

  Note: 'once_per_customer = true code သုံးတဲ့ FINISH မှာပဲ INSERT (app) · unique က ၂ ကြိမ် တားတယ်'
}

Table discount_requests {
  id uuid [pk]
  sale_id uuid [not null, ref: > sales.id, note: 'OPEN sale · PENDING ၁ ခုပဲ (partial unique — SQL)']
  requested_by_user_id uuid [not null, ref: > users.id, note: 'Barber — checkout မှာ "လျှော့ခွင့် တောင်း"']
  requested_at timestamptz [not null, default: `now()`]
  discount_type smallint [not null, note: '1 PERCENT · 2 AMOUNT']
  discount_percent smallint
  discount_amount bigint
  reason text [not null, note: 'မဖြစ်မနေ (D-PAY-04 v5.1)']
  status smallint [not null, default: 1, note: '0 CANCELLED (barber ပြန်ရုပ် / ဈေးအပြည့်နဲ့ FINISH) · 1 PENDING · 2 APPROVED · 3 REJECTED']
  decided_by_user_id uuid [ref: > users.id, note: 'Permission `discount.approve` (admin / manager — role အလိုက် ပိုင်ရှင် ရွေး)']
  decided_at timestamptz
  decision_note text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (status, requested_at)
  }

  Note: '''
  F-P4-05 — in-app noti (D-NTF-01) → ✔ → sales.discount_request_id = ဒီ row၊ discount_amount တွက် (app) · ဖုန်း ✖
  အဖြေမရ → barber က CANCELLED + ဈေးအပြည့် FINISH → admin နောက်မှ refund (D-PAY-05)
  Report: barber အလိုက် တောင်းတဲ့ / ရတဲ့ အရေအတွက်
  '''
}

// ───────────────────────── After FINISH (🔒 D-VIS-08, D-PAY-05) ─────────────────────────

Table refunds {
  id uuid [pk]
  client_request_id uuid [not null, unique, note: 'D-VIS-10']
  sale_id uuid [not null, ref: > sales.id, note: 'FINISHED sale ပဲ (app)']
  branch_id uuid [not null, ref: > branches.id]
  kind smallint [not null, note: '1 SALE_REFUND (full / partial — refund_items ⇒ commission reversal, Part 5) · 2 OVERPAYMENT_RETURN (KBZPay ၂ ခါ လွှဲ — ဝင်ငွေ မလျော့၊ commission မထိ — D-PAY-05) · F-P4-06']
  payment_method_id uuid [not null, ref: > payment_methods.id, note: 'ပြန်ပေးပုံ (cash / KBZPay)']
  amount bigint [not null, note: '> 0 · kind 1 ⇒ = Σ refund_items (app)']
  external_reference varchar(100) [note: 'KBZPay နဲ့ ပြန်လွှဲရင် ref']
  reason text [not null, note: 'မဖြစ်မနေ (D-VIS-08)']
  refund_receipt_number varchar(40) [not null, unique, note: '`B3-RF-2026-OCT-00003` — receipt_counters kind 2 (D-PAY-06 v5.1)']
  receipt_year smallint [not null]
  receipt_month smallint [not null]
  receipt_seq integer [not null]
  business_date date [not null, note: 'refunded_at ရဲ့ MMT ရက် — closing (Part 7) · commission period (Part 5, 🟡 OPEN-26 finalize ပြီးမှ)']
  refunded_at timestamptz [not null]
  refunded_by_user_id uuid [not null, ref: > users.id, note: 'Permission `sale.refund`']
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (sale_id)
    (branch_id, business_date)
    (branch_id, receipt_year, receipt_month, receipt_seq) [unique]
  }
}

Table refund_items {
  id uuid [pk]
  refund_id uuid [not null, ref: > refunds.id]
  sale_item_id uuid [not null, ref: > sale_items.id]
  quantity integer [not null, default: 1]
  amount bigint [not null, note: '> 0 · ≤ line_total_amount − ယခင် refund (app)']

  Indexes {
    (refund_id, sale_item_id) [unique]
  }

  Note: 'Partial refund → ဘယ် line / ဘယ် performer → commission reversal (D-PAY-05, Part 5)'
}

Table sale_adjustments {
  id uuid [pk]
  sale_id uuid [not null, ref: > sales.id, note: 'FINISHED sale — sale / payment row မပြင် (D-VIS-08) · report / closing / commission က adjustment ကို ပေါင်းဖတ် · F-P4-07']
  adjustment_type smallint [not null, note: '1 PAYMENT_METHOD (payment X → method Y) · 2 PERFORMER (line → barber) · 3 COLLECTED_BY (payment → ငွေလက်ခံသူ) · 9 OTHER (note ပဲ)']
  payment_id uuid [ref: > payments.id, note: 'type 1 / 3 ⇒ မဖြစ်မနေ (CHECK)']
  sale_item_id uuid [ref: > sale_items.id, note: 'type 2 ⇒ မဖြစ်မနေ (CHECK)']
  new_payment_method_id uuid [ref: > payment_methods.id, note: 'type 1']
  new_employee_id uuid [ref: > employees.id, note: 'type 2 / 3']
  reason text [not null]
  adjusted_by_user_id uuid [not null, ref: > users.id, note: 'Permission `sale.adjust` (admin override — D-VIS-06)']
  adjusted_at timestamptz [not null, default: `now()`]

  Indexes {
    (sale_id, adjusted_at)
  }

  Note: '''
  ငွေပမာဏ ပြင်တာ ✖ — ပိုယူမိ = refund · လျော့ယူမိ = product-only sale ပုံစံ line အသစ် (app) · KBZPay ၂ ခါ = refunds kind 2
  Audit before / after = audit_events (Part 8 — D-AUD-02)
  '''
}

// ── Setting (Part 8 settings store — ဒီ part က ဖတ်) ──
// home_service.transport_fee_amount (branch — D-SVC-06; Part 2 list)
// sales.service_charge_enabled / sales.service_charge_rate (company — D-PAY-08, Additional Settings, default OFF)
// sales.tax_enabled / sales.tax_rate (company — D-PAY-08, Additional Settings, default OFF)
// Permission (permissions.json — D-ROLE-08): sale.late_entry (barber default ✔ — D-VIS-13) · discount.approve · sale.override_price · sale.refund · sale.adjust · payment.verify
```

```sql
-- Point Barbershop — Part 4 v1 (🔒 D-DB-08) · Visits / Sales / Payments · DBML မှာ ရေးလို့မရတဲ့ constraint
-- v1.1 (30/Sep — Part 7 ဆွဲချိန် audit): discount_codes / discount_requests value CHECK မှာ NULL ကျော်တာ ပြင် (percent / amount NULL ဆို CHECK ကျော်နေခဲ့ — IS NOT NULL ထပ်ထည့်) · schema မပြောင်း

-- ═══════════ visits ═══════════
ALTER TABLE visits ADD CONSTRAINT visits_status_chk        CHECK (status IN (0, 1, 2, 3));     -- 0 INCOMPLETE · 1 STARTED · 2 COMPLETED · 3 FINISHED
ALTER TABLE visits ADD CONSTRAINT visits_location_chk      CHECK (location_type IN (1, 2));
ALTER TABLE visits ADD CONSTRAINT visits_proxy_reason_chk  CHECK (proxy_reason IS NULL OR proxy_reason IN (1, 2));
ALTER TABLE visits ADD CONSTRAINT visits_late_reason_chk   CHECK (late_entry_reason IS NULL OR late_entry_reason IN (1, 2, 3, 4, 9));
-- D-SVC-06: HOME ⇒ လိပ်စာ
ALTER TABLE visits ADD CONSTRAINT visits_home_chk
  CHECK ((location_type = 2 AND home_address IS NOT NULL AND btrim(home_address) <> '') OR (location_type = 1 AND home_address IS NULL));
-- D-VIS-13: late entry ⇔ reason · OTHER ⇒ note
ALTER TABLE visits ADD CONSTRAINT visits_late_entry_chk
  CHECK (is_late_entry = (late_entry_reason IS NOT NULL) AND (late_entry_reason IS DISTINCT FROM 9 OR late_entry_note IS NOT NULL));
-- အချိန် အစဉ် + status ⇔ timestamp (D-VIS-03 / 07 / 09)
ALTER TABLE visits ADD CONSTRAINT visits_time_order_chk
  CHECK ((completed_at IS NULL OR completed_at >= started_at) AND (finished_at IS NULL OR finished_at >= completed_at));
ALTER TABLE visits ADD CONSTRAINT visits_status_fields_chk CHECK (
  (status = 1 AND completed_at IS NULL AND finished_at IS NULL AND incomplete_at IS NULL)
  OR (status = 2 AND completed_at IS NOT NULL AND completed_by_user_id IS NOT NULL AND finished_at IS NULL AND incomplete_at IS NULL)
  OR (status = 3 AND completed_at IS NOT NULL AND completed_by_user_id IS NOT NULL AND finished_at IS NOT NULL AND incomplete_at IS NULL)
  OR (status = 0 AND finished_at IS NULL AND incomplete_at IS NOT NULL AND incomplete_by_user_id IS NOT NULL
      AND incomplete_reason IS NOT NULL AND btrim(incomplete_reason) <> '')
);
-- D-PLT-15
ALTER TABLE visits ADD CONSTRAINT visits_business_date_chk
  CHECK (business_date = (started_at AT TIME ZONE 'Asia/Yangon')::date);
-- Booking ၁ ခု = visit ၁ ခု (INCOMPLETE ဖြစ်သွားရင်လည်း ပြန်မစ — booking က STARTED ဖြစ်ပြီးသား)
CREATE UNIQUE INDEX visits_one_per_booking ON visits (booking_id) WHERE booking_id IS NOT NULL;
-- Dashboard "current" (D-DSH-03) — ဖွင့်ထားတဲ့ visit ပဲ
CREATE INDEX visits_open_by_employee ON visits (performed_by_employee_id) WHERE status IN (1, 2);

-- ═══════════ sales ═══════════
ALTER TABLE sales ADD CONSTRAINT sales_status_chk CHECK (status IN (0, 1, 2));   -- 0 CANCELLED · 1 OPEN · 2 FINISHED
ALTER TABLE sales ADD CONSTRAINT sales_amounts_chk CHECK (
  subtotal_amount >= 0 AND discount_amount >= 0 AND service_charge_amount >= 0 AND tax_amount >= 0 AND total_amount >= 0
  AND service_charge_rate BETWEEN 0 AND 100 AND tax_rate BETWEEN 0 AND 100
  AND discount_amount <= subtotal_amount
  AND total_amount = subtotal_amount - discount_amount + service_charge_amount + tax_amount
);
-- D-PAY-04: code XOR request · discount > 0 ⇒ တစ်ခုခု ရှိ
ALTER TABLE sales ADD CONSTRAINT sales_discount_source_chk CHECK (
  NOT (discount_code_id IS NOT NULL AND discount_request_id IS NOT NULL)
  AND (discount_amount = 0 OR discount_code_id IS NOT NULL OR discount_request_id IS NOT NULL)
);
-- D-PAY-06 / D-VIS-07: FINISHED ⇔ receipt + finished + business_date · CANCELLED ⇔ cancelled_at
ALTER TABLE sales ADD CONSTRAINT sales_receipt_number_chk
  CHECK (receipt_number IS NULL OR receipt_number ~ '^[A-Za-z0-9]+-[0-9]{4}-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-[0-9]{5,}$');
ALTER TABLE sales ADD CONSTRAINT sales_receipt_month_chk CHECK (receipt_month IS NULL OR receipt_month BETWEEN 1 AND 12);
ALTER TABLE sales ADD CONSTRAINT sales_status_fields_chk CHECK (
  (status = 2 AND receipt_number IS NOT NULL AND receipt_year IS NOT NULL AND receipt_month IS NOT NULL AND receipt_seq IS NOT NULL
     AND finished_at IS NOT NULL AND finished_by_user_id IS NOT NULL AND business_date IS NOT NULL AND cancelled_at IS NULL)
  OR (status = 1 AND receipt_number IS NULL AND receipt_seq IS NULL AND finished_at IS NULL AND business_date IS NULL AND cancelled_at IS NULL)
  OR (status = 0 AND receipt_number IS NULL AND receipt_seq IS NULL AND finished_at IS NULL AND cancelled_at IS NOT NULL)
);
ALTER TABLE sales ADD CONSTRAINT sales_business_date_chk
  CHECK (finished_at IS NULL OR business_date = (finished_at AT TIME ZONE 'Asia/Yangon')::date);
-- ဝင်ငွေ report / closing (FINISHED ပဲ)
CREATE INDEX sales_finished_by_branch_date ON sales (branch_id, business_date) WHERE status = 2;

-- ═══════════ sale_items ═══════════
ALTER TABLE sale_items ADD CONSTRAINT sale_items_line_type_chk CHECK (line_type IN (1, 2, 3));
ALTER TABLE sale_items ADD CONSTRAINT sale_items_amounts_chk
  CHECK (quantity > 0 AND list_price_amount >= 0 AND unit_price_amount >= 0 AND line_discount_amount >= 0
         AND line_discount_amount <= unit_price_amount * quantity);
-- line_type ⇒ ဘယ် ref လို (D-PAY-03, D-SVC-06, D-COM-03)
ALTER TABLE sale_items ADD CONSTRAINT sale_items_type_refs_chk CHECK (
  (line_type = 1 AND service_id IS NOT NULL AND product_id IS NULL AND performed_by_employee_id IS NOT NULL AND quantity = 1)
  OR (line_type = 2 AND product_id IS NOT NULL AND service_id IS NULL AND service_variant_id IS NULL AND booking_item_id IS NULL)
  OR (line_type = 3 AND service_id IS NULL AND service_variant_id IS NULL AND product_id IS NULL AND booking_item_id IS NULL
      AND performed_by_employee_id IS NULL AND quantity = 1 AND line_discount_amount = 0)
);
-- D-SVC-04: ဈေး ≠ list ⇒ override reason + by
ALTER TABLE sale_items ADD CONSTRAINT sale_items_override_chk CHECK (
  (unit_price_amount = list_price_amount AND price_override_reason IS NULL AND price_override_by_user_id IS NULL)
  OR (unit_price_amount <> list_price_amount AND price_override_reason IS NOT NULL AND btrim(price_override_reason) <> '' AND price_override_by_user_id IS NOT NULL)
);
-- D-VIS-05: removed ⇔ reason + by
ALTER TABLE sale_items ADD CONSTRAINT sale_items_removed_chk CHECK (
  (removed_at IS NULL AND removed_by_user_id IS NULL AND removed_reason IS NULL)
  OR (removed_at IS NOT NULL AND removed_by_user_id IS NOT NULL AND removed_reason IS NOT NULL AND btrim(removed_reason) <> '')
);
-- D-SVC-05: variant က ဒီ service ရဲ့ဟာပဲ (Part 2 service_variants (id, service_id) unique)
ALTER TABLE sale_items ADD CONSTRAINT sale_items_variant_service_fk
  FOREIGN KEY (service_variant_id, service_id) REFERENCES service_variants (id, service_id);
-- line_total = unit × qty − discount (commission base — D-COM-02)
ALTER TABLE sale_items ADD COLUMN line_total_amount bigint
  GENERATED ALWAYS AS (unit_price_amount * quantity - line_discount_amount) STORED;

-- ═══════════ payment_methods ═══════════
ALTER TABLE payment_methods ADD CONSTRAINT payment_methods_kind_chk   CHECK (kind IN (1, 2, 3, 4));
ALTER TABLE payment_methods ADD CONSTRAINT payment_methods_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX payment_methods_name_active ON payment_methods (company_id, name_mm) WHERE archived_at IS NULL;

-- ═══════════ payments ═══════════
ALTER TABLE payments ADD CONSTRAINT payments_amount_chk CHECK (amount > 0);
ALTER TABLE payments ADD CONSTRAINT payments_verified_pair_chk CHECK ((verified_at IS NULL) = (verified_by_user_id IS NULL));
ALTER TABLE payments ADD CONSTRAINT payments_void_chk CHECK (
  (voided_at IS NULL AND voided_by_user_id IS NULL AND void_reason IS NULL)
  OR (voided_at IS NOT NULL AND voided_by_user_id IS NOT NULL AND void_reason IS NOT NULL AND btrim(void_reason) <> '')
);
ALTER TABLE payments ADD CONSTRAINT payments_reference_not_blank_chk CHECK (external_reference IS NULL OR btrim(external_reference) <> '');
-- 🔒 D-PAY-02: reference ထပ် ✖ (method အလိုက် · voided မပါ)
CREATE UNIQUE INDEX payments_reference_unique
  ON payments (payment_method_id, external_reference) WHERE external_reference IS NOT NULL AND voided_at IS NULL;
-- D-PAY-02 v5.1: closing verify list
CREATE INDEX payments_unverified ON payments (payment_method_id, received_at) WHERE verified_at IS NULL AND voided_at IS NULL;

-- ═══════════ receipt_counters ═══════════
ALTER TABLE receipt_counters ADD CONSTRAINT receipt_counters_kind_chk  CHECK (kind IN (1, 2));
ALTER TABLE receipt_counters ADD CONSTRAINT receipt_counters_month_chk CHECK (receipt_month BETWEEN 1 AND 12);
ALTER TABLE receipt_counters ADD CONSTRAINT receipt_counters_seq_chk   CHECK (last_seq >= 0);

-- ═══════════ discount_codes ═══════════
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_type_chk   CHECK (discount_type IN (1, 2));
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_scope_chk  CHECK (scope_type IN (1, 2));
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_status_chk CHECK (status IN (0, 1));
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_value_chk CHECK (
  (discount_type = 1 AND discount_percent IS NOT NULL AND discount_percent BETWEEN 1 AND 100 AND discount_amount IS NULL)
  OR (discount_type = 2 AND discount_amount IS NOT NULL AND discount_amount > 0 AND discount_percent IS NULL)
);
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_code_upper_chk CHECK (code = upper(code) AND code ~ '^[A-Z0-9_-]{2,40}$');
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_dates_chk CHECK (valid_to IS NULL OR valid_from IS NULL OR valid_to >= valid_from);
ALTER TABLE discount_codes ADD CONSTRAINT discount_codes_max_uses_chk CHECK (max_uses IS NULL OR max_uses > 0);

-- ═══════════ discount_requests ═══════════
ALTER TABLE discount_requests ADD CONSTRAINT discount_requests_type_chk   CHECK (discount_type IN (1, 2));
ALTER TABLE discount_requests ADD CONSTRAINT discount_requests_status_chk CHECK (status IN (0, 1, 2, 3));
ALTER TABLE discount_requests ADD CONSTRAINT discount_requests_value_chk CHECK (
  (discount_type = 1 AND discount_percent IS NOT NULL AND discount_percent BETWEEN 1 AND 100 AND discount_amount IS NULL)
  OR (discount_type = 2 AND discount_amount IS NOT NULL AND discount_amount > 0 AND discount_percent IS NULL)
);
ALTER TABLE discount_requests ADD CONSTRAINT discount_requests_reason_chk CHECK (btrim(reason) <> '');
-- ဆုံးဖြတ်ချက် ⇔ ဆုံးဖြတ်သူ (APPROVED / REJECTED)
ALTER TABLE discount_requests ADD CONSTRAINT discount_requests_decision_chk CHECK (
  (status IN (2, 3) AND decided_by_user_id IS NOT NULL AND decided_at IS NOT NULL)
  OR (status IN (0, 1) AND decided_by_user_id IS NULL AND decided_at IS NULL)
);
-- Sale ၁ ခု PENDING ၁ ခုပဲ
CREATE UNIQUE INDEX discount_requests_one_pending ON discount_requests (sale_id) WHERE status = 1;

-- ═══════════ refunds ═══════════
ALTER TABLE refunds ADD CONSTRAINT refunds_kind_chk   CHECK (kind IN (1, 2));
ALTER TABLE refunds ADD CONSTRAINT refunds_amount_chk CHECK (amount > 0);
ALTER TABLE refunds ADD CONSTRAINT refunds_reason_chk CHECK (btrim(reason) <> '');
ALTER TABLE refunds ADD CONSTRAINT refunds_receipt_number_chk
  CHECK (refund_receipt_number ~ '^[A-Za-z0-9]+-RF-[0-9]{4}-(JAN|FEB|MAR|APR|MAY|JUN|JUL|AUG|SEP|OCT|NOV|DEC)-[0-9]{5,}$');
ALTER TABLE refunds ADD CONSTRAINT refunds_receipt_month_chk CHECK (receipt_month BETWEEN 1 AND 12);
ALTER TABLE refunds ADD CONSTRAINT refunds_business_date_chk
  CHECK (business_date = (refunded_at AT TIME ZONE 'Asia/Yangon')::date);

-- ═══════════ refund_items ═══════════
ALTER TABLE refund_items ADD CONSTRAINT refund_items_amount_chk CHECK (quantity > 0 AND amount > 0);

-- ═══════════ sale_adjustments ═══════════
ALTER TABLE sale_adjustments ADD CONSTRAINT sale_adjustments_type_chk CHECK (adjustment_type IN (1, 2, 3, 9));
ALTER TABLE sale_adjustments ADD CONSTRAINT sale_adjustments_reason_chk CHECK (btrim(reason) <> '');
ALTER TABLE sale_adjustments ADD CONSTRAINT sale_adjustments_type_refs_chk CHECK (
  (adjustment_type = 1 AND payment_id IS NOT NULL AND new_payment_method_id IS NOT NULL AND sale_item_id IS NULL AND new_employee_id IS NULL)
  OR (adjustment_type = 2 AND sale_item_id IS NOT NULL AND new_employee_id IS NOT NULL AND payment_id IS NULL AND new_payment_method_id IS NULL)
  OR (adjustment_type = 3 AND payment_id IS NOT NULL AND new_employee_id IS NOT NULL AND sale_item_id IS NULL AND new_payment_method_id IS NULL)
  OR (adjustment_type = 9 AND payment_id IS NULL AND sale_item_id IS NULL AND new_payment_method_id IS NULL AND new_employee_id IS NULL)
);

-- ═══════════ App / Part 8 trigger က စစ်ရမယ့်ဟာ (DB CHECK နဲ့ မရ — cross-table) ═══════════
-- · sales.subtotal_amount = Σ active sale_items (unit × qty) · Σ line_discount = sales.discount_amount · Σ payments (voided မပါ) = total (FINISH မှာ)
-- · payments.external_reference ⇐ payment_methods.requires_reference · verify ⇐ requires_verification
-- · sale.visit_id NOT NULL ⇐ SERVICE line ရှိ · HOME visit ⇒ TRANSPORT_FEE line ၁ ခု · SERVICE line performed_by = visit.performed_by (V1)
-- · discount_code: ACTIVE · ရက်အတွင်း · branch scope · max_uses (code row FOR UPDATE) · once_per_customer ⇒ customer_id + customer_uses INSERT
-- · discount_request APPROVED ပဲ sale ကို ချိတ် · late entry ⇐ branch-day closing မပိတ်သေး (Part 7) · proxy_reason = 1 ⇐ B က payment
-- · booking.booked_employee_id ≠ visits.performed_by ⇒ performer_change_reason · refund ≤ ကျန်ငွေ
```

### 6.4e Part 5 — Commission / Payroll / Attendance (🔒 v1)

**Source:** 🔒 D-COM-01..04, D-PAYR-01..08, D-ATT-01..06, D-FIN-04 + v5.1 ဆုံးဖြတ်ချက် (OPEN-03 A, 06 A, 19, 26; REC-18, 19) · **Status:** 🔒 **LOCK (30/Sep မနက်) — D-DB-09 = v1** · `@dbml/core` parse OK (Part 1–5 တွဲ — table ၅၉ ခု) · PostgreSQL 16 load + **test ၇၀/၇၀ PASS** · F-P5-01..12 approve (F-P5-05 = owner မေးခွန်းကြောင့် `attendance_exceptions` ပုံစံ ပြင်)

ဖိုင်: `db/part5-commission-payroll-attendance-v1.1.dbml` (*v5.2.15: v1.1 — G a / b, §6.4i; အောက်က DBML = v1 စာသား*), `db/part5-commission-payroll-attendance-v1-constraints.sql`, `db/part5-commission-payroll-attendance-v1-test.sql`

**Table ၁၇ ခု:** `commission_plans` · `commission_plan_tiers` · `employee_commission_plans` · `commission_results` · `commission_result_lines` · `employee_salaries` · `payroll_line_categories` · `payroll_runs` · `payroll_entries` · `payroll_lines` · `payroll_attendance_items` · `payroll_entry_branch_allocations` · `employee_receivables` · `employee_receivable_repayments` · `branch_attendance_qr_tokens` · `attendance_records` · **`attendance_exceptions`**

**Test (PostgreSQL 16):** tier ထပ် ✖ · rate 150% ✖ · plan assign ရက်ထပ် ✖ / branch scope ✅ · salary history ထပ် ✖ · system category kind မှား ✖ / ထပ် ✖ / archive ✖ · run period ထပ် ✖ · FINALIZE calculate မလုပ်ရသေး ✖ · CALCULATE snapshot မပါ ✖ · entry net မကိုက် ✖ / employee ထပ် ✖ · EARN line ၂ ကြိမ် ✖ · REVERSAL original မပါ ✖ / ✅ / ၂ ကြိမ် ✖ · AUTO override reason ✖ / ✅ · MANUAL + auto_amount ✖ · attendance item 0.3 ရက် ✖ · allocation 1.2 ✖ · PAID publish မလုပ်ရသေး ✖ · reopen reason ✖ · installment > principal ✖ · repayment ၂ source ✖ · SETTLED at မပါ ✖ · QR token ၂ ခု ✖ · GPS မပါ ✖ · active record ၂ ✖ · clock-out source ✖ · MANUAL OTHER note ✖ · အချိန်ထပ် ✖ · correction reason ✖ · business_date UTC ✖ · **exceptions:** item exception မပါ ✖ · LATE exception ✅ · exception တူ item ၂ ✖ · ABSENT + record ✖ · ABSENT ✅ · shift တူ ၂ ကြိမ် ✖ · EXCUSED reason ✖ / ✅ · LEAVE leave_id ✖ · CONFIRMED ✅

**v1 design finding F-P5-01..12 — ✅ approve (D-DB-09)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-P5-01 | `employee_commission_plans.branch_id` — NULL = branch အကုန်ပေါင်း (default); branch-scope = branch တစ်ခုချင်း row; scope တူ ရက်ထပ် ✖ (EXCLUDE); all + branch တစ်ချိန်တည်း ✖ = app | D-COM-01 v5.1 (C-2) — scope table သီးသန့် မလို |
| F-P5-02 | **Commission % ခွဲပုံ** = result header (run × assignment) မှာ tier နဲ့ စုစုပေါင်း တွက် → `effective_rate` (blended = commission ÷ commissionable) → line တိုင်း အဲ့ rate; **REVERSAL = မူလ line ရဲ့ rate** (OPEN-26) | Progressive tier ကို line တစ်ခုချင်း marginal ခွဲရင် ရှုပ်; blended = refund ရဲ့ အချိုးက ပမာဏ အတိအကျ |
| F-P5-03 | `payroll_line_categories` = system ၈ ခု (`system_code`, archive ✖, kind CHECK) + admin custom (D-PAYR-03) | Payslip line အကုန် category ၁ ခုတည်းကနေ · system line ကို admin မဖျက်ရ |
| F-P5-04 | `payroll_runs.rules_snapshot jsonb` — Calculate မှာ deduction rule + allocation basis + period setting snapshot (CALCULATED ⇒ မဖြစ်မနေ) | D-PAYR-05 v5.1 "finalize = rule snapshot" · setting နောက်မှ ပြောင်းလည်း ပြီးသား run မပြောင်း |
| F-P5-05 *(ပြင်)* | **`attendance_exceptions`** — system auto detect (LATE = clock-in · EARLY_LEAVE = clock-out · ABSENT / INCOMPLETE = ညနေ job) → row သိမ်း; status OPEN → **EXCUSED (reason) / CONFIRMED / LEAVE (leave ချိတ်) / VOID**; manager အဲ့နေ့မှာပဲ ဆုံးဖြတ်; admin "ဒီနေ့ / ဒီလ ဘယ်သူ ပျက် / ဘာကြောင့်" screen + employee အလိုက် count; payroll calculate = OPEN + CONFIRMED ပဲ ဖြတ် → `payroll_attendance_items` (exception ချိတ်) + item override | Owner: "ပျက်ကွက် table သပ်သပ် မရှိရင် admin ဘယ်သူ ပျက်လဲ / ဘာလဲ မကြည့်ရ" — draft (payroll ချိန်မှ တွက်) က reason မှတ်စရာ မရှိ + schedule ပြင်ရင် မှတ်တမ်း ပျောက် · D-ATT-03 "auto + manual ပြင်" နဲ့ ပိုကိုက် |
| F-P5-06 | `employee_receivables` table ၁ ခု — `kind` 1 SALARY_ADVANCE · 2 STAFF_LOAN (balance kind အလိုက် သီးခြား); `repayments` = payroll line **XOR** cash; ထုတ်ပေးတဲ့ငွေ = Part 7 cash_out (future FK) | D-PAYR-04 "သီးခြား" = balance ခွဲ; table ၂ ခု ပုံစံတူ ထပ်စရာ မလို |
| F-P5-07 | `branch_attendance_qr_tokens` — QR = random token (branch id ✖); branch ၁ ခု active ၁ ခု; ပြန်ထုတ် = အဟောင်း revoke (history) | D-ATT-01 static QR · ဓာတ်ပုံ / branch id ခန့်မှန်း ✖ |
| F-P5-08 | `attendance_records` — method 1 QR_GPS (token + GPS + distance မဖြစ်မနေ) · 2 MANUAL (preset reason + ထည့်သူ); employee active record ၁ ခု; အချိန်ထပ် ✖ (EXCLUDE, open = ∞); `late_minutes` = raw snapshot (grace = payroll rule) | D-ATT-01 / 02 / 06 · GPS / QR ကို setting နဲ့ ပိတ်လည်း DB မပြောင်း (OPEN-19) |
| F-P5-09 | Payroll run status = 0 CANCELLED · 1 DRAFT · 2 CALCULATED · 3 FINALIZED · 4 PUBLISHED · 5 PAID — "Review" = CALCULATED မှာ လုပ်တဲ့ အလုပ် (status မဟုတ်); reopen = count + reason + by (→ DRAFT, results ဖျက် ပြန်တွက်); PAID reopen ✖ (app) | D-PAYR-06 · status ⇔ timestamp CHECK |
| F-P5-10 | `commission_results` key = (run, `employee_commission_plan_id`) — branch-scope plan တစ်ခုချင်း သီးသန့် တွက်; `tier_breakdown jsonb` = payslip ပြဖို့ snapshot | F-P5-01 branch scope · D-COM-04 final |
| F-P5-11 | `payroll_entry_branch_allocations` = Finalize snapshot table (report ချိန် ပြန်မတွက်) — basis 1 ATTENDANCE_HOURS (REC-19) · 2 SCHEDULED · 3 MANUAL % · 4 PRIMARY | D-PAYR-08 · P&L (Part 7) branch salary expense = ဒီ table |
| F-P5-12 | `employee_salaries.basic_salary_amount` = **လစဉ်** ပမာဏ; period WEEKLY / BIWEEKLY / CUSTOM ဆို prorate = app (🟡 တကယ်သုံးမှ rule) | D-PAYR-01 monthly default · Point = monthly ပဲ |

**App / Part 8 trigger က စစ်ရမယ့်ဟာ (cross-table — SQL ဖိုင် အောက်ဆုံး):** line kind = category kind · Σ line = gross / deduction · Σ allocation = 1 · EARN base = sale line net (FINISHED, period) · tier ကွက်လပ် ✖ · FINALIZED+ immutable · repayment ≤ principal · attendance QR_GPS session user = employee (colleague ✖) · distance ≤ radius · exception detect (LATE / ABSENT / INCOMPLETE) · payroll = exceptions OPEN / CONFIRMED + unpaid leave

```dbml
// Point Barbershop — Part 5: Commission / Payroll / Attendance · v1 🔒 D-DB-09 (30/Sep/2026)
// Part 1 (D-DB-02) + 1b + 2 (D-DB-06) + 3 (D-DB-07) + 4 (D-DB-08) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1–4 နဲ့ တွဲ paste
// 🔒 D-COM-01..04 (v5.1: OPEN-03 A, OPEN-26), D-PAYR-01..08 (v5.1: OPEN-06 A, REC-19), D-ATT-01..06 (v5.1: OPEN-19), D-FIN-04 (Gross),
//    D-LV-01..05 (Part 2 leaves ကို ဖတ်), D-SCH-01 (schedule_shifts ကို ဖတ်), D-ORG-03, D-DB-01 / 03 / 04, D-PLT-15
// Status / type = smallint + CHECK (D-DB-03) · EXCLUDE / CHECK / partial unique = part5-commission-payroll-attendance-v1-constraints.sql
// F-P5-nn = review finding (§6.4e) — D-DB-09 နဲ့ approve ပြီး (F-P5-05 = attendance_exceptions ပုံစံ)
// ငွေ table (payroll_runs / entries / lines, commission_results, employee_receivables) ပြောင်းတိုင်း DB trigger → audit_events (Part 8 — D-AUD-02)
// Deduction rule / allocation basis / period type / auto clock-out = Additional Settings (Part 8) — run မှာ snapshot
// Attendance exception detect job (ABSENT / INCOMPLETE — ညနေ) = REC-31 ပုံစံ (Part 2 shift ထုတ် job လို)

// ───────────────────────── Commission (🔒 D-COM-01..04) ─────────────────────────

Table commission_plans {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04 — seed: "Point ပုံမှန်" (15% / 20%)']
  name_en varchar(150)
  description_mm text
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'Progressive tier plan (D-COM-01) · basis = commissionable sales (D-COM-02 — SERVICE line net of discount, FINISHED, ကားခ ✖) · period = payroll run period · (company_id, name_mm) unique (SQL)'
}

Table commission_plan_tiers {
  id uuid [pk]
  commission_plan_id uuid [not null, ref: > commission_plans.id]
  tier_order smallint [not null, note: '1, 2, 3 …']
  from_amount bigint [not null, note: 'MMK ≥ 0 — ပထမ tier = 0']
  to_amount bigint [note: 'NULL = အဆုံးမရှိ (နောက်ဆုံး tier) · Point: 0 → 2,250,000 = 15% · 2,250,000 → ∞ = 20%']
  rate_percent numeric(5,2) [not null, note: '0–100']

  Indexes {
    (commission_plan_id, tier_order) [unique]
  }

  Note: 'Tier ထပ် ✖ (EXCLUDE int8range — SQL) · ကွက်လပ် မရှိရ (app) · plan ကို employee assign ပြီးရင် tier ပြင်ရင် plan အသစ် (history — app)'
}

Table employee_commission_plans {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  commission_plan_id uuid [not null, ref: > commission_plans.id]
  branch_id uuid [ref: > branches.id, note: 'NULL = branch အကုန်ပေါင်း (default — C-2) · ဖြည့် = အဲ့ branch ရဲ့ sales ပဲ (P63 branch % မတူ case — branch တစ်ခုချင်း row) · F-P5-01']
  effective_from date [not null, note: '"Qualify" ဖြစ်တဲ့ရက် — admin assign (D-COM-01 v5.1)']
  effective_to date [note: 'NULL = ဆက်သက်ရောက်']
  assigned_by_user_id uuid [not null, ref: > users.id]
  note text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '''
  🔒 D-COM-01 (v5.1) — employee ၁ ယောက် scope တူ plan ၁ ခု (EXCLUDE daterange — SQL) · assignment မရှိ = commission ✖ (basic ပဲ)
  Branch-all row နဲ့ branch row တစ်ချိန်တည်း ✖ (app)
  '''
}

Table commission_results {
  id uuid [pk]
  payroll_run_id uuid [not null, ref: > payroll_runs.id]
  employee_id uuid [not null, ref: > employees.id]
  employee_commission_plan_id uuid [not null, ref: > employee_commission_plans.id, note: 'ဘယ် assignment (plan + scope) နဲ့ တွက်လဲ']
  commissionable_amount bigint [not null, default: 0, note: 'Period စုစုပေါင်း (D-COM-02) — Σ EARN lines']
  commission_amount bigint [not null, default: 0, note: 'Tier နဲ့ တွက်ပြီး (final — D-COM-04)']
  effective_rate_percent numeric(7,4) [not null, default: 0, note: 'commission ÷ commissionable — line ခွဲ / reversal % (OPEN-26) · F-P5-02']
  tier_breakdown jsonb [note: 'Payslip ပြဖို့ — [{from, to, rate, base, amount}] snapshot']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (payroll_run_id, employee_commission_plan_id) [unique]
    (employee_id, payroll_run_id)
  }

  Note: 'Run Calculate မှာ ထုတ် · Finalize ⇒ immutable (D-PAYR-06) · Reopen ⇒ ဖျက်ပြီး ပြန်တွက် (run DRAFT ပြန်ဖြစ်မှ)'
}

Table commission_result_lines {
  id uuid [pk]
  commission_result_id uuid [not null, ref: > commission_results.id]
  kind smallint [not null, note: '1 EARN (sale line) · 2 REVERSAL (finalize ပြီးမှ refund — OPEN-26)']
  sale_item_id uuid [ref: > sale_items.id, note: 'EARN ⇒ မဖြစ်မနေ · line ၁ ခု ၁ ကြိမ်ပဲ (partial unique)']
  refund_item_id uuid [ref: > refund_items.id, note: 'REVERSAL ⇒ မဖြစ်မနေ · ၁ ကြိမ်ပဲ']
  original_line_id uuid [ref: > commission_result_lines.id, note: 'REVERSAL → မူလ EARN line (မူလ % ယူ)']
  branch_id uuid [not null, ref: > branches.id, note: 'sale.branch_id — branch P&L ခွဲ (D-PAYR-08 / C-2)']
  base_amount bigint [not null, note: 'EARN = line_total (net of discount) > 0 · REVERSAL = − refund_item.amount']
  rate_percent numeric(7,4) [not null, note: 'EARN = result.effective_rate · REVERSAL = original_line.rate_percent (D-COM-04 v5.1)']
  commission_amount bigint [not null, note: 'base × rate (rounded) — REVERSAL အနုတ်']
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (commission_result_id)
    (branch_id)
  }

  Note: '''
  Finalize မတိုင်ခင် refund = sale line ကို EARN ထဲ မထည့် / base လျှော့ (D-COM-02 fully paid) — REVERSAL မလို
  Finalize ပြီး refund → refund လ run မှာ REVERSAL line (payslip: "28/Oct ဆိုးဆေး refund — 6,000")
  ထွက်သွားလို့ run မရှိ → REVERSAL ကို admin ဆုံးဖြတ် (🟡 app screen — "ပြန်ယူစရာ")
  '''
}

// ───────────────────────── Salary / Payroll (🔒 D-PAYR-01..08, D-FIN-04) ─────────────────────────

Table employee_salaries {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  basic_salary_amount bigint [not null, note: 'MMK / လ (D-PAYR-02) — period weekly ဆို app prorate']
  effective_from date [not null]
  effective_to date
  set_by_user_id uuid [not null, ref: > users.id]
  note text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '🔒 D-PAYR-02 — ၁ ယောက် ၁ ခု + effective date + history (EXCLUDE daterange — SQL) · branch မခွဲ · မရှိ = basic 0 (commission ပဲ case)'
}

Table payroll_line_categories {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04']
  name_en varchar(150)
  kind smallint [not null, note: '1 EARNING · 2 DEDUCTION']
  system_code smallint [note: 'NULL = admin ဖန်တီး (D-PAYR-03) · system: 1 BASIC · 2 COMMISSION · 3 COMMISSION_REVERSAL · 4 LATE · 5 ABSENT · 6 UNPAID_LEAVE · 7 ADVANCE_REPAYMENT · 8 LOAN_REPAYMENT — archive ✖']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'Seed system ၈ ခု · (company_id, system_code) unique · (company_id, name_mm) unique (SQL) · F-P5-03'
}

Table payroll_runs {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03 — payroll = company-level']
  period_type smallint [not null, default: 1, note: '1 MONTHLY (default) · 2 WEEKLY · 3 BIWEEKLY · 4 CUSTOM (D-PAYR-01)']
  period_start date [not null, note: 'MMT']
  period_end date [not null]
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 DRAFT · 2 CALCULATED (review) · 3 FINALIZED (lock) · 4 PUBLISHED (payslip noti) · 5 PAID (D-PAYR-06)']
  rules_snapshot jsonb [note: 'Calculate ချိန်က deduction rule + allocation basis + period setting (D-PAYR-05 v5.1 snapshot) · F-P5-04']
  calculated_at timestamptz
  calculated_by_user_id uuid [ref: > users.id]
  finalized_at timestamptz
  finalized_by_user_id uuid [ref: > users.id]
  published_at timestamptz
  published_by_user_id uuid [ref: > users.id]
  paid_at timestamptz [note: 'D-PAYR-06 Paid (date / by)']
  paid_by_user_id uuid [ref: > users.id]
  paid_note text
  reopen_count smallint [not null, default: 0]
  last_reopened_at timestamptz
  last_reopened_by_user_id uuid [ref: > users.id]
  last_reopen_reason text [note: 'Reopen = reason + audit (D-PAYR-06)']
  cancelled_at timestamptz
  created_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, period_start)
  }

  Note: '''
  Period ထပ် ✖ (EXCLUDE daterange — CANCELLED မပါ — SQL) · status ⇔ timestamp (CHECK)
  FINALIZED+ ⇒ entries / lines / commission_results immutable — reopen (→ DRAFT) မှ ပြန်တွက်; PAID reopen ✖ (app)
  Salary expense (Part 7 P&L) = Σ entries.gross_amount (D-FIN-04 Gross) · branch ခွဲ = payroll_entry_branch_allocations
  '''
}

Table payroll_entries {
  id uuid [pk]
  payroll_run_id uuid [not null, ref: > payroll_runs.id]
  employee_id uuid [not null, ref: > employees.id]
  basic_salary_amount bigint [not null, default: 0, note: 'employee_salaries snapshot (prorate ပြီး)']
  gross_amount bigint [not null, default: 0, note: 'Σ EARNING lines (basic + commission + other) — Salary expense = Gross (D-FIN-04)']
  deduction_amount bigint [not null, default: 0, note: 'Σ DEDUCTION lines (late / absent / unpaid / advance / loan / other)']
  net_amount bigint [not null, default: 0, note: '= gross − deduction (CHECK) · တကယ်ပေးရမယ့်ငွေ']
  late_count smallint [not null, default: 0, note: 'Attendance summary snapshot (payslip ပြ) — detail = payroll_attendance_items']
  late_minutes integer [not null, default: 0]
  absent_days numeric(4,1) [not null, default: 0, note: 'နေ့တစ်ဝက် = 0.5']
  unpaid_leave_days numeric(4,1) [not null, default: 0]
  scheduled_days numeric(4,1) [not null, default: 0, note: 'Period ထဲ schedule ရက် (÷ schedule ရက် basis)']
  note text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (payroll_run_id, employee_id) [unique]
  }

  Note: 'Payslip ၁ ခု (D-PAYR-07 PDF / Excel = app render) · gross / deduction = Σ lines (app / Part 8 trigger)'
}

Table payroll_lines {
  id uuid [pk]
  payroll_entry_id uuid [not null, ref: > payroll_entries.id]
  category_id uuid [not null, ref: > payroll_line_categories.id]
  kind smallint [not null, note: '1 EARNING · 2 DEDUCTION — = category.kind (app)']
  source smallint [not null, note: '1 AUTO (system တွက်) · 2 MANUAL (admin ထည့် — D-PAYR-03)']
  description_mm varchar(300) [not null, note: 'Payslip စာသား — ဥပမာ "နောက်ကျ × 3"']
  description_en varchar(300)
  amount bigint [not null, note: '≥ 0 (kind က အနုတ် / အပေါင်း ဆုံးဖြတ်)']
  auto_amount bigint [note: 'AUTO ⇒ system တွက်တဲ့ မူလ · amount ≠ auto ⇒ override reason + by (CHECK — D-PAYR-05)']
  override_reason text
  override_by_user_id uuid [ref: > users.id]
  commission_result_id uuid [ref: > commission_results.id, note: 'COMMISSION / COMMISSION_REVERSAL line']
  employee_receivable_id uuid [ref: > employee_receivables.id, note: 'ADVANCE / LOAN repayment line → employee_receivable_repayments']
  sort_order smallint [not null, default: 0]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (payroll_entry_id, sort_order)
  }

  Note: 'MANUAL line = admin ထည့် (category admin manage) · AUTO line ဖျက် ✖ — amount 0 + reason'
}

Table payroll_attendance_items {
  id uuid [pk]
  payroll_entry_id uuid [not null, ref: > payroll_entries.id]
  item_date date [not null, note: 'MMT']
  item_type smallint [not null, note: '1 LATE · 2 EARLY_LEAVE · 3 ABSENT · 4 UNPAID_LEAVE (D-LV-01 unpaid) · 5 LATE_TO_ABSENT (N ကြိမ် = ၁ ရက်)']
  attendance_exception_id uuid [ref: > attendance_exceptions.id, note: 'LATE / EARLY_LEAVE / ABSENT ⇒ မဖြစ်မနေ (OPEN / CONFIRMED exception ပဲ — app) · entry ၁ ခုမှာ ၁ ကြိမ်ပဲ']
  leave_id uuid [ref: > leaves.id, note: 'UNPAID_LEAVE ⇒ မဖြစ်မနေ (APPROVED unpaid leave)']
  minutes integer [note: 'LATE / EARLY_LEAVE (exception snapshot)']
  day_portion numeric(3,1) [note: 'ABSENT / UNPAID_LEAVE / LATE_TO_ABSENT = 1 / 0.5']
  auto_deduction_amount bigint [not null, default: 0, note: 'Rule snapshot နဲ့ တွက်']
  deduction_amount bigint [not null, default: 0, note: 'Override ပြီး (≠ auto ⇒ reason + by — CHECK)']
  override_reason text
  override_by_user_id uuid [ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (payroll_entry_id, item_date)
  }

  Note: '''
  F-P5-05 — Calculate မှာ attendance_exceptions (OPEN / CONFIRMED) + leaves (unpaid, APPROVED) ကနေ ထုတ် (D-PAYR-05) · payslip မှာ ရက်အလိုက် ပြ
  Σ deduction_amount (type အလိုက်) → payroll_lines AUTO (LATE / ABSENT / UNPAID_LEAVE) · item override = payroll ချိန် (exception EXCUSED = calculate မတိုင်ခင် manager ဆုံးဖြတ်)
  '''
}

Table payroll_entry_branch_allocations {
  id uuid [pk]
  payroll_entry_id uuid [not null, ref: > payroll_entries.id]
  branch_id uuid [not null, ref: > branches.id]
  ratio numeric(7,4) [not null, note: '0–1 · Σ = 1 (app)']
  allocated_gross_amount bigint [not null, note: 'gross × ratio (rounded; နောက်ဆုံး row က ကျန်ငွေ)']
  basis smallint [not null, note: '1 ATTENDANCE_HOURS (default — REC-19) · 2 SCHEDULED_HOURS · 3 MANUAL_PERCENT · 4 PRIMARY_BRANCH (attendance မရှိ)']

  Indexes {
    (payroll_entry_id, branch_id) [unique]
  }

  Note: '🔒 D-PAYR-08 (v5.1) — report / P&L ပဲ (ငွေပေး ၁ ခု) · Finalize snapshot · commission ကတော့ commission_result_lines.branch_id'
}

// ───────────────────────── Salary Advance / Staff Loan (🔒 D-PAYR-04) ─────────────────────────

Table employee_receivables {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  kind smallint [not null, note: '1 SALARY_ADVANCE · 2 STAFF_LOAN — balance သီးခြား (D-PAYR-04) · F-P5-06']
  principal_amount bigint [not null, note: '> 0 MMK']
  issued_at timestamptz [not null]
  issued_by_user_id uuid [not null, ref: > users.id]
  cash_out_id uuid [note: 'ငွေထုတ်ပေးတဲ့ Cash Out (Part 7 — reason = employee balance, expense ✖ — D-FIN-07 / 08) · FK Part 7 မှာ']
  installment_amount bigint [note: 'Payroll တစ်ကြိမ် ဖြတ်မယ့် ပမာဏ (NULL = နောက် payroll မှာ အကုန် — advance ပုံမှန်)']
  repayment_start_date date [note: 'ဒီရက် နောက်ပိုင်း period ကစ ဖြတ်']
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 ACTIVE · 2 SETTLED']
  settled_at timestamptz
  reason text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (employee_id, status)
  }

  Note: '''
  Receivable (ဆိုင်က ပြန်ရမယ့်ငွေ) — expense ✖ (REC-15 🔒), salary expense မလျှော့ (D-FIN-04)
  Balance = principal − Σ repayments (view) · SETTLED ⇔ balance 0 (app)
  '''
}

Table employee_receivable_repayments {
  id uuid [pk]
  employee_receivable_id uuid [not null, ref: > employee_receivables.id]
  amount bigint [not null, note: '> 0']
  payroll_line_id uuid [unique, ref: - payroll_lines.id, note: 'Payroll deduction နဲ့ ဖြတ် (ပုံမှန်) — run FINALIZE မှာ ထည့်']
  received_at timestamptz [note: 'Cash နဲ့ ပြန်သွင်း (payroll မဟုတ်) ⇒ received_at + received_by (CHECK — တစ်မျိုးပဲ)']
  received_by_user_id uuid [ref: > users.id]
  note text
  created_at timestamptz [not null, default: `now()`]

  Note: 'Payroll line ✖ cash ✖ ၂ ခုလုံး / တစ်ခုမှ မရှိ ✖ (CHECK) · cash ပြန်သွင်း = drawer cash in (Part 7)'
}

// ───────────────────────── Attendance (🔒 D-ATT-01..06) ─────────────────────────

Table branch_attendance_qr_tokens {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  token varchar(64) [not null, unique, note: 'QR ထဲ — random (branch id သက်သက် ✖) · print ပြန်ထုတ်ရင် အသစ် + အဟောင်း revoke']
  created_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  revoked_at timestamptz
  revoked_by_user_id uuid [ref: > users.id]

  Note: 'F-P5-07 — branch ၁ ခု active token ၁ ခု (partial unique — SQL) · D-ATT-01 static QR · GPS radius = branches.location_radius_meters (Part 1)'
}

Table attendance_records {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id, note: 'QR ရဲ့ branch · တစ်ရက် branch အများကြီး = record အများကြီး (D-ATT-02)']
  business_date date [not null, note: 'clock_in_at ရဲ့ MMT ရက် (D-PLT-15)']
  clock_in_at timestamptz [not null]
  clock_out_at timestamptz [note: 'NULL = ဆိုင်ထဲ ရှိနေ (active) · employee ၁ ယောက် active ၁ ခု (partial unique)']
  method smallint [not null, note: '1 QR_GPS (ကိုယ့်ဖုန်း) · 2 MANUAL (Manager / Admin — D-ATT-06)']
  qr_token_id uuid [ref: > branch_attendance_qr_tokens.id, note: 'QR_GPS ⇒ scan လုပ်တဲ့ token']
  clock_in_latitude numeric(10,7) [note: 'QR_GPS ⇒ မဖြစ်မနေ (CHECK)']
  clock_in_longitude numeric(10,7)
  clock_in_distance_meters integer [note: 'ဆိုင်နဲ့ အကွာအဝေး — radius ကျော်ရင် app ပယ် (D-ATT-01)']
  clock_in_device_label varchar(255) [note: 'user_sessions.device_label (D-AUTH-05)']
  clock_out_source smallint [note: '1 SELF (QR_GPS) · 2 MANUAL (Manager / Admin — D-ATT-04) · 3 AUTO_SHIFT_END (setting — D-ATT-04) · NULL = မထွက်သေး']
  clock_out_latitude numeric(10,7)
  clock_out_longitude numeric(10,7)
  clock_out_distance_meters integer
  manual_reason smallint [note: 'MANUAL ⇒ 1 PHONE_UNAVAILABLE · 9 OTHER (D-ATT-06 preset) — CHECK']
  manual_note text [note: 'OTHER ⇒ မဖြစ်မနေ']
  entered_by_user_id uuid [ref: > users.id, note: 'MANUAL ⇒ Manager / Admin (permission `attendance.manual`)']
  schedule_shift_id uuid [ref: > schedule_shifts.id, note: 'ကိုက်တဲ့ shift (app match) — late / early leave တွက်ဖို့']
  late_minutes integer [not null, default: 0, note: 'clock_in − shift.starts_at (grace မနုတ်ခင် raw) · payroll က rule နဲ့ တွက်']
  early_leave_minutes integer [not null, default: 0]
  corrected_at timestamptz [note: 'D-ATT-05 — Manager / Admin ပြင် (before / after = audit_events)']
  corrected_by_user_id uuid [ref: > users.id]
  correction_reason text
  created_at timestamptz [not null, default: `now()`, note: '= recorded_at']
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (employee_id, business_date)
    (branch_id, business_date)
  }

  Note: '''
  🔒 D-ATT-01 (v5.1) — GPS / QR ကို setting နဲ့ ပိတ်ရ (method မပြောင်း) · F-P5-08
  🔒 D-ATT-06 — colleague က သူများအတွက် clock-in ✖ (QR_GPS record ရဲ့ session user = employee.user — app) · MANUAL screen မှာ အဲ့နေ့ visit သက်သေပြ · လစဉ် manual count (employee အလိုက်) report
  Late / early leave / absent / incomplete → attendance_exceptions (detect ပြီး row သိမ်း — D-ATT-03) · Incomplete = clock_out NULL နေ့ကုန် (auto / manual ပိတ် — D-ATT-04)
  Record ထပ် ✖ — employee တစ်ယောက် အချိန်ထပ် (EXCLUDE tstzrange — SQL)
  '''
}

Table attendance_exceptions {
  id uuid [pk]
  employee_id uuid [not null, ref: > employees.id]
  branch_id uuid [not null, ref: > branches.id, note: 'Shift ရဲ့ branch (ABSENT) / record ရဲ့ branch']
  business_date date [not null, note: 'MMT']
  exception_type smallint [not null, note: '1 LATE · 2 EARLY_LEAVE · 3 ABSENT (shift ရှိ၊ record / leave မရှိ) · 4 INCOMPLETE (clock-out မလုပ် — D-ATT-04) — 🔒 D-ATT-03 auto']
  schedule_shift_id uuid [ref: > schedule_shifts.id, note: 'LATE / EARLY_LEAVE / ABSENT ⇒ မဖြစ်မနေ · shift ၁ ခု type ၁ ခု ၁ ကြိမ် (partial unique)']
  attendance_record_id uuid [ref: > attendance_records.id, note: 'LATE / EARLY_LEAVE / INCOMPLETE ⇒ မဖြစ်မနေ · ABSENT = NULL']
  minutes integer [note: 'LATE / EARLY_LEAVE ⇒ > 0 (grace မနုတ်ခင် raw — rule = payroll)']
  detected_at timestamptz [not null, default: `now()`, note: 'LATE = clock-in ချိန် · EARLY_LEAVE = clock-out · ABSENT / INCOMPLETE = ညနေ job (REC-31 ပုံစံ)']
  status smallint [not null, default: 1, note: '0 VOID (detect မှား — schedule ပြင်) · 1 OPEN · 2 EXCUSED (ခွင့်လွှတ် — မဖြတ်) · 3 CONFIRMED (ဖြတ်) · 4 LEAVE (ခွင့်အဖြစ် ပြောင်း)']
  leave_id uuid [ref: > leaves.id, note: 'LEAVE ⇒ မဖြစ်မနေ (leave record — reason / approval အဲ့မှာ)']
  resolution_reason text [note: 'VOID / EXCUSED ⇒ မဖြစ်မနေ · CONFIRMED optional']
  resolved_by_user_id uuid [ref: > users.id, note: 'Manager / Admin (permission `attendance.resolve`) — status ≠ OPEN ⇒ မဖြစ်မနေ']
  resolved_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (employee_id, business_date)
    (branch_id, business_date, status)
    (status, detected_at)
  }

  Note: '''
  F-P5-05 (v1 ပြင်) — "ဒီနေ့ ဘယ်သူ ပျက်လဲ / ဘာကြောင့်လဲ" admin screen + manager က အဲ့နေ့မှာပဲ ဆုံးဖြတ် (ဖုန်းဆက် → EXCUSED / LEAVE / CONFIRMED)
  Detect ပြီး row သိမ်း — schedule နောက်မှ ပြင်လည်း မှတ်တမ်း မပျောက် (VOID နဲ့ပဲ ပိတ်) · D-ATT-03 "auto + admin manual ပြင်" · D-ATT-05 audit
  Payroll calculate = OPEN + CONFIRMED ⇒ ဖြတ် · EXCUSED / LEAVE / VOID ⇒ မဖြတ် (unpaid leave = leaves ကနေ) · OPEN ကျန်နေရင် calculate မှာ သတိပေး (app)
  Employee အလိုက် လစဉ် အရေအတွက် (type / status) report
  '''
}

// ── Setting (Part 8 settings store — ဒီ part က ဖတ်; run မှာ snapshot) ──
// payroll.period_type (company, default 1 MONTHLY — D-PAYR-01)
// payroll.late_grace_minutes · payroll.late_deduction_mode (0 OFF · 1 FIXED_PER_OCCURRENCE · 2 PER_MINUTE) · payroll.late_deduction_amount · payroll.late_count_to_absent (0 OFF) — D-PAYR-05 v5.1
// payroll.absent_daily_rate_basis (1 BASIC_30 · 2 BASIC_26 · 3 SCHEDULED_DAYS) · payroll.absent_deduction_enabled · payroll.unpaid_leave_deduction_enabled
// payroll.branch_allocation_basis (1 ATTENDANCE_HOURS default · 2 SCHEDULED_HOURS · 3 MANUAL_PERCENT — D-PAYR-08) · employee manual % = Part 8 setting per employee
// attendance.gps_required (default true) · attendance.qr_required (default true) · attendance.auto_clock_out_after_shift_minutes (D-ATT-04) — OPEN-19 ★
// Permission: payroll.manage · payroll.finalize · payroll.pay · commission.manage · attendance.manual · attendance.correct · attendance.resolve · receivable.issue
```

```sql
-- Point Barbershop — Part 5 v1 (🔒 D-DB-09) · Commission / Payroll / Attendance · DBML မှာ ရေးလို့မရတဲ့ constraint
-- v1.1 (30/Sep — audit): payroll_attendance_items minutes / day_portion · attendance_exceptions minutes CHECK မှာ NULL ကျော်တာ ပြင် (IS NOT NULL ထပ်ထည့်) · schema မပြောင်း
-- btree_gist = Part 2 SQL မှာ ဖွင့်ပြီး

-- ═══════════ commission_plans / tiers ═══════════
ALTER TABLE commission_plans ADD CONSTRAINT commission_plans_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX commission_plans_name_active ON commission_plans (company_id, name_mm) WHERE archived_at IS NULL;
ALTER TABLE commission_plan_tiers ADD CONSTRAINT commission_plan_tiers_range_chk
  CHECK (from_amount >= 0 AND (to_amount IS NULL OR to_amount > from_amount) AND rate_percent BETWEEN 0 AND 100 AND tier_order >= 1);
-- Tier ထပ် ✖ (D-COM-01 progressive)
ALTER TABLE commission_plan_tiers ADD CONSTRAINT commission_plan_tiers_no_overlap
  EXCLUDE USING gist (commission_plan_id WITH =, int8range(from_amount, to_amount, '[)') WITH &&);

-- ═══════════ employee_commission_plans ═══════════
ALTER TABLE employee_commission_plans ADD CONSTRAINT employee_commission_plans_dates_chk
  CHECK (effective_to IS NULL OR effective_to >= effective_from);
-- Scope တူ (branch / all) ရက် ထပ် ✖ (D-COM-01 v5.1)
ALTER TABLE employee_commission_plans ADD CONSTRAINT employee_commission_plans_no_overlap
  EXCLUDE USING gist (
    employee_id WITH =,
    (COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid)) WITH =,
    daterange(effective_from, effective_to, '[]') WITH &&
  );

-- ═══════════ commission_results / lines ═══════════
ALTER TABLE commission_results ADD CONSTRAINT commission_results_amounts_chk
  CHECK (commissionable_amount >= 0 AND commission_amount >= 0 AND effective_rate_percent BETWEEN 0 AND 100);
ALTER TABLE commission_result_lines ADD CONSTRAINT commission_result_lines_kind_chk CHECK (kind IN (1, 2));
ALTER TABLE commission_result_lines ADD CONSTRAINT commission_result_lines_rate_chk CHECK (rate_percent BETWEEN 0 AND 100);
-- EARN ⇔ sale line (+) · REVERSAL ⇔ refund item + မူလ line (−)
ALTER TABLE commission_result_lines ADD CONSTRAINT commission_result_lines_kind_refs_chk CHECK (
  (kind = 1 AND sale_item_id IS NOT NULL AND refund_item_id IS NULL AND original_line_id IS NULL AND base_amount > 0 AND commission_amount >= 0)
  OR
  (kind = 2 AND refund_item_id IS NOT NULL AND original_line_id IS NOT NULL AND sale_item_id IS NULL AND base_amount < 0 AND commission_amount <= 0)
);
-- Sale line ၁ ခု ၁ ကြိမ်ပဲ commission · refund item ၁ ခု ၁ ကြိမ်ပဲ reversal
CREATE UNIQUE INDEX commission_result_lines_one_earn ON commission_result_lines (sale_item_id) WHERE kind = 1;
CREATE UNIQUE INDEX commission_result_lines_one_reversal ON commission_result_lines (refund_item_id) WHERE kind = 2;

-- ═══════════ employee_salaries ═══════════
ALTER TABLE employee_salaries ADD CONSTRAINT employee_salaries_amount_chk CHECK (basic_salary_amount >= 0);
ALTER TABLE employee_salaries ADD CONSTRAINT employee_salaries_dates_chk CHECK (effective_to IS NULL OR effective_to >= effective_from);
-- D-PAYR-02: ၁ ယောက် ၁ ခု — ရက် ထပ် ✖
ALTER TABLE employee_salaries ADD CONSTRAINT employee_salaries_no_overlap
  EXCLUDE USING gist (employee_id WITH =, daterange(effective_from, effective_to, '[]') WITH &&);

-- ═══════════ payroll_line_categories ═══════════
ALTER TABLE payroll_line_categories ADD CONSTRAINT payroll_line_categories_kind_chk   CHECK (kind IN (1, 2));
ALTER TABLE payroll_line_categories ADD CONSTRAINT payroll_line_categories_status_chk CHECK (status IN (0, 1));
ALTER TABLE payroll_line_categories ADD CONSTRAINT payroll_line_categories_system_chk
  CHECK (system_code IS NULL OR system_code BETWEEN 1 AND 8);
-- System category ⇒ kind ကိုက်ရမယ် (1 BASIC · 2 COMMISSION = EARNING; 3–8 = DEDUCTION) · archive ✖
ALTER TABLE payroll_line_categories ADD CONSTRAINT payroll_line_categories_system_kind_chk CHECK (
  system_code IS NULL
  OR (system_code IN (1, 2) AND kind = 1 AND archived_at IS NULL)
  OR (system_code BETWEEN 3 AND 8 AND kind = 2 AND archived_at IS NULL)
);
CREATE UNIQUE INDEX payroll_line_categories_system_uq ON payroll_line_categories (company_id, system_code) WHERE system_code IS NOT NULL;
CREATE UNIQUE INDEX payroll_line_categories_name_active ON payroll_line_categories (company_id, name_mm) WHERE archived_at IS NULL;

-- ═══════════ payroll_runs ═══════════
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_period_type_chk CHECK (period_type IN (1, 2, 3, 4));
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_status_chk      CHECK (status IN (0, 1, 2, 3, 4, 5));
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_period_chk      CHECK (period_end >= period_start);
-- D-PAYR-06: status ⇔ timestamp / by (အဆင့်တိုင်း ယခင်အဆင့် ရှိရ)
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_status_fields_chk CHECK (
  (status = 1 AND calculated_at IS NULL AND finalized_at IS NULL AND published_at IS NULL AND paid_at IS NULL AND cancelled_at IS NULL)
  OR (status = 2 AND calculated_at IS NOT NULL AND calculated_by_user_id IS NOT NULL AND rules_snapshot IS NOT NULL
      AND finalized_at IS NULL AND published_at IS NULL AND paid_at IS NULL AND cancelled_at IS NULL)
  OR (status = 3 AND calculated_at IS NOT NULL AND rules_snapshot IS NOT NULL AND finalized_at IS NOT NULL AND finalized_by_user_id IS NOT NULL
      AND published_at IS NULL AND paid_at IS NULL AND cancelled_at IS NULL)
  OR (status = 4 AND finalized_at IS NOT NULL AND published_at IS NOT NULL AND published_by_user_id IS NOT NULL AND paid_at IS NULL AND cancelled_at IS NULL)
  OR (status = 5 AND finalized_at IS NOT NULL AND published_at IS NOT NULL AND paid_at IS NOT NULL AND paid_by_user_id IS NOT NULL AND cancelled_at IS NULL)
  OR (status = 0 AND cancelled_at IS NOT NULL AND finalized_at IS NULL)
);
-- Reopen ⇒ reason
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_reopen_chk CHECK (
  (reopen_count = 0 AND last_reopened_at IS NULL AND last_reopen_reason IS NULL)
  OR (reopen_count > 0 AND last_reopened_at IS NOT NULL AND last_reopened_by_user_id IS NOT NULL AND last_reopen_reason IS NOT NULL AND btrim(last_reopen_reason) <> '')
);
-- Period ထပ် ✖ (CANCELLED မပါ)
ALTER TABLE payroll_runs ADD CONSTRAINT payroll_runs_no_overlap
  EXCLUDE USING gist (company_id WITH =, daterange(period_start, period_end, '[]') WITH &&) WHERE (status <> 0);

-- ═══════════ payroll_entries ═══════════
ALTER TABLE payroll_entries ADD CONSTRAINT payroll_entries_amounts_chk CHECK (
  basic_salary_amount >= 0 AND gross_amount >= 0 AND deduction_amount >= 0
  AND net_amount = gross_amount - deduction_amount
  AND late_count >= 0 AND late_minutes >= 0 AND absent_days >= 0 AND unpaid_leave_days >= 0 AND scheduled_days >= 0
);

-- ═══════════ payroll_lines ═══════════
ALTER TABLE payroll_lines ADD CONSTRAINT payroll_lines_kind_chk   CHECK (kind IN (1, 2));
ALTER TABLE payroll_lines ADD CONSTRAINT payroll_lines_source_chk CHECK (source IN (1, 2));
ALTER TABLE payroll_lines ADD CONSTRAINT payroll_lines_amount_chk CHECK (amount >= 0 AND (auto_amount IS NULL OR auto_amount >= 0));
-- D-PAYR-05: AUTO ⇒ auto_amount ရှိ · ပြောင်းရင် reason + by · MANUAL ⇒ auto_amount မရှိ
ALTER TABLE payroll_lines ADD CONSTRAINT payroll_lines_override_chk CHECK (
  (source = 2 AND auto_amount IS NULL AND override_reason IS NULL AND override_by_user_id IS NULL)
  OR (source = 1 AND auto_amount IS NOT NULL AND amount = auto_amount AND override_reason IS NULL AND override_by_user_id IS NULL)
  OR (source = 1 AND auto_amount IS NOT NULL AND amount <> auto_amount AND override_reason IS NOT NULL AND btrim(override_reason) <> '' AND override_by_user_id IS NOT NULL)
);

-- ═══════════ payroll_attendance_items ═══════════
ALTER TABLE payroll_attendance_items ADD CONSTRAINT payroll_attendance_items_type_chk CHECK (item_type IN (1, 2, 3, 4, 5));
ALTER TABLE payroll_attendance_items ADD CONSTRAINT payroll_attendance_items_values_chk CHECK (
  auto_deduction_amount >= 0 AND deduction_amount >= 0
  AND (item_type NOT IN (1, 2) OR (minutes IS NOT NULL AND minutes > 0))
  AND (item_type NOT IN (3, 4, 5) OR (day_portion IS NOT NULL AND day_portion IN (0.5, 1)))
);
-- Type ⇔ ref: LATE / EARLY / ABSENT ⇒ exception · UNPAID_LEAVE ⇒ leave · LATE_TO_ABSENT ⇒ မရှိ
ALTER TABLE payroll_attendance_items ADD CONSTRAINT payroll_attendance_items_refs_chk CHECK (
  (item_type IN (1, 2, 3) AND attendance_exception_id IS NOT NULL AND leave_id IS NULL)
  OR (item_type = 4 AND leave_id IS NOT NULL AND attendance_exception_id IS NULL)
  OR (item_type = 5 AND attendance_exception_id IS NULL AND leave_id IS NULL)
);
CREATE UNIQUE INDEX payroll_attendance_items_one_per_exception
  ON payroll_attendance_items (payroll_entry_id, attendance_exception_id) WHERE attendance_exception_id IS NOT NULL;
ALTER TABLE payroll_attendance_items ADD CONSTRAINT payroll_attendance_items_override_chk CHECK (
  (deduction_amount = auto_deduction_amount AND override_reason IS NULL AND override_by_user_id IS NULL)
  OR (deduction_amount <> auto_deduction_amount AND override_reason IS NOT NULL AND btrim(override_reason) <> '' AND override_by_user_id IS NOT NULL)
);

-- ═══════════ payroll_entry_branch_allocations ═══════════
ALTER TABLE payroll_entry_branch_allocations ADD CONSTRAINT payroll_entry_branch_allocations_chk
  CHECK (ratio > 0 AND ratio <= 1 AND allocated_gross_amount >= 0 AND basis IN (1, 2, 3, 4));

-- ═══════════ employee_receivables / repayments ═══════════
ALTER TABLE employee_receivables ADD CONSTRAINT employee_receivables_kind_chk   CHECK (kind IN (1, 2));
ALTER TABLE employee_receivables ADD CONSTRAINT employee_receivables_status_chk CHECK (status IN (0, 1, 2));
ALTER TABLE employee_receivables ADD CONSTRAINT employee_receivables_amounts_chk
  CHECK (principal_amount > 0 AND (installment_amount IS NULL OR (installment_amount > 0 AND installment_amount <= principal_amount)));
ALTER TABLE employee_receivables ADD CONSTRAINT employee_receivables_settled_chk CHECK ((status = 2) = (settled_at IS NOT NULL));
ALTER TABLE employee_receivable_repayments ADD CONSTRAINT employee_receivable_repayments_amount_chk CHECK (amount > 0);
-- Payroll line XOR cash
ALTER TABLE employee_receivable_repayments ADD CONSTRAINT employee_receivable_repayments_source_chk CHECK (
  (payroll_line_id IS NOT NULL AND received_at IS NULL AND received_by_user_id IS NULL)
  OR (payroll_line_id IS NULL AND received_at IS NOT NULL AND received_by_user_id IS NOT NULL)
);

-- ═══════════ branch_attendance_qr_tokens ═══════════
ALTER TABLE branch_attendance_qr_tokens ADD CONSTRAINT branch_attendance_qr_tokens_revoke_chk
  CHECK ((revoked_at IS NULL) = (revoked_by_user_id IS NULL));
CREATE UNIQUE INDEX branch_attendance_qr_tokens_one_active ON branch_attendance_qr_tokens (branch_id) WHERE revoked_at IS NULL;

-- ═══════════ attendance_records ═══════════
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_method_chk CHECK (method IN (1, 2));
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_clock_out_source_chk CHECK (clock_out_source IS NULL OR clock_out_source IN (1, 2, 3));
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_manual_reason_chk CHECK (manual_reason IS NULL OR manual_reason IN (1, 9));
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_time_chk
  CHECK ((clock_out_at IS NULL OR clock_out_at >= clock_in_at) AND late_minutes >= 0 AND early_leave_minutes >= 0);
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_business_date_chk
  CHECK (business_date = (clock_in_at AT TIME ZONE 'Asia/Yangon')::date);
-- D-ATT-01 / D-ATT-06: QR_GPS ⇒ token + GPS · MANUAL ⇒ reason + ထည့်သူ (OTHER ⇒ note)
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_method_fields_chk CHECK (
  (method = 1 AND qr_token_id IS NOT NULL AND clock_in_latitude IS NOT NULL AND clock_in_longitude IS NOT NULL AND clock_in_distance_meters IS NOT NULL
     AND manual_reason IS NULL AND entered_by_user_id IS NULL)
  OR
  (method = 2 AND manual_reason IS NOT NULL AND entered_by_user_id IS NOT NULL
     AND (manual_reason <> 9 OR (manual_note IS NOT NULL AND btrim(manual_note) <> '')))
);
-- clock_out ⇔ source
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_clock_out_pair_chk
  CHECK ((clock_out_at IS NULL) = (clock_out_source IS NULL));
-- D-ATT-05: correction ⇔ reason + by
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_correction_chk CHECK (
  (corrected_at IS NULL AND corrected_by_user_id IS NULL AND correction_reason IS NULL)
  OR (corrected_at IS NOT NULL AND corrected_by_user_id IS NOT NULL AND correction_reason IS NOT NULL AND btrim(correction_reason) <> '')
);
-- Employee ၁ ယောက် active (clock-out မလုပ်ရသေး) ၁ ခု
CREATE UNIQUE INDEX attendance_records_one_open ON attendance_records (employee_id) WHERE clock_out_at IS NULL;
-- အချိန်ထပ် ✖ (branch မတူလည်း) — open record = ∞
ALTER TABLE attendance_records ADD CONSTRAINT attendance_records_no_overlap
  EXCLUDE USING gist (employee_id WITH =, tstzrange(clock_in_at, COALESCE(clock_out_at, 'infinity'::timestamptz), '[)') WITH &&);
-- Manual count report (D-ATT-06)
CREATE INDEX attendance_records_manual ON attendance_records (employee_id, business_date) WHERE method = 2;

-- ═══════════ attendance_exceptions (D-ATT-03 auto · F-P5-05) ═══════════
ALTER TABLE attendance_exceptions ADD CONSTRAINT attendance_exceptions_type_chk   CHECK (exception_type IN (1, 2, 3, 4));
ALTER TABLE attendance_exceptions ADD CONSTRAINT attendance_exceptions_status_chk CHECK (status IN (0, 1, 2, 3, 4));
-- Type ⇔ ref
ALTER TABLE attendance_exceptions ADD CONSTRAINT attendance_exceptions_type_refs_chk CHECK (
  (exception_type IN (1, 2) AND schedule_shift_id IS NOT NULL AND attendance_record_id IS NOT NULL AND minutes IS NOT NULL AND minutes > 0)
  OR (exception_type = 3 AND schedule_shift_id IS NOT NULL AND attendance_record_id IS NULL AND minutes IS NULL)
  OR (exception_type = 4 AND attendance_record_id IS NOT NULL AND minutes IS NULL)
);
-- Status ⇔ resolution: OPEN = မရှိ · VOID / EXCUSED ⇒ reason · LEAVE ⇒ leave_id · ≠ OPEN ⇒ by + at
ALTER TABLE attendance_exceptions ADD CONSTRAINT attendance_exceptions_resolution_chk CHECK (
  (status = 1 AND resolved_by_user_id IS NULL AND resolved_at IS NULL AND resolution_reason IS NULL AND leave_id IS NULL)
  OR (status IN (0, 2) AND resolved_by_user_id IS NOT NULL AND resolved_at IS NOT NULL
      AND resolution_reason IS NOT NULL AND btrim(resolution_reason) <> '' AND leave_id IS NULL)
  OR (status = 3 AND resolved_by_user_id IS NOT NULL AND resolved_at IS NOT NULL AND leave_id IS NULL)
  OR (status = 4 AND resolved_by_user_id IS NOT NULL AND resolved_at IS NOT NULL AND leave_id IS NOT NULL)
);
-- Shift ၁ ခု type ၁ ခု ၁ ကြိမ် (VOID မပါ) · record ၁ ခု INCOMPLETE ၁ ကြိမ်
CREATE UNIQUE INDEX attendance_exceptions_one_per_shift
  ON attendance_exceptions (schedule_shift_id, exception_type) WHERE schedule_shift_id IS NOT NULL AND status <> 0;
CREATE UNIQUE INDEX attendance_exceptions_one_incomplete
  ON attendance_exceptions (attendance_record_id) WHERE exception_type = 4 AND status <> 0;
-- Admin "ဒီနေ့ / ဒီလ" list
CREATE INDEX attendance_exceptions_open ON attendance_exceptions (branch_id, business_date) WHERE status = 1;

-- ═══════════ App / Part 8 trigger က စစ်ရမယ့်ဟာ (cross-table) ═══════════
-- · payroll_lines.kind = category.kind · Σ EARNING = entry.gross · Σ DEDUCTION = entry.deduction · Σ allocation ratio = 1
-- · commission_result_lines EARN base = sale_items.line_total_amount (SERVICE, sale FINISHED, business_date ∈ period) · REVERSAL rate = original_line.rate
-- · commission_plan_tiers ကွက်လပ် ✖ (0 ကစ ဆက်တိုက်) · employee all-branch row နဲ့ branch row တစ်ချိန်တည်း ✖
-- · FINALIZED+ run ရဲ့ entries / lines / results / items UPDATE ✖ (reopen → DRAFT မှ) · PAID reopen ✖
-- · repayment Σ ≤ principal · SETTLED ⇔ balance 0 · run FINALIZE မှာ ADVANCE / LOAN line → repayments INSERT
-- · attendance QR_GPS: session user = employee.user (colleague ✖ — D-ATT-06) · distance ≤ branches.location_radius_meters (gps_required setting) · token active + branch ကိုက်
-- · exception detect: LATE = clock-in vs shift.starts_at · ABSENT = shift ဆုံးပြီး record / leave (PENDING / APPROVED) မရှိ (ညနေ job) · INCOMPLETE = clock_out NULL နေ့ကုန်
-- · payroll calculate = exceptions OPEN / CONFIRMED (period) + leaves unpaid APPROVED → payroll_attendance_items · OPEN ကျန် = သတိပေး · payslip item ⇒ exception ရဲ့ business_date = item_date
```

### 6.4f Part 6 — Inventory (🔒 v1)

**Source:** 🔒 D-STK-01..06 (v5.1: D-STK-03 ၂ ဆင့် — REC-14), D-PAY-03, D-DAT-05, D-NTF-03 · **Status:** 🔒 **LOCK (30/Sep မနက်) — D-DB-10 = v1** · `@dbml/core` parse OK (Part 1–6 တွဲ — table ၇၁ ခု) · PostgreSQL 16 load + **test ၄၄/၄၄ PASS** · F-P6-01..09 approve

ဖိုင်: `db/part6-inventory-v1.2.dbml` (*v5.2.15: v1.2 — G c, §6.4i; အောက်က DBML = v1.1 စာသား* · *v1.1 — Part 7 ဆွဲချိန်: `purchases.expense_id` ဖြုတ် — expense link = `expenses.purchase_id` + branch (F-P7-05); schema ပြောင်း = column ၁ ခု ဖြုတ်ပဲ*), `db/part6-inventory-v1-constraints.sql`, `db/part6-inventory-v1-test.sql`

**Table ၁၂ ခု:** `product_categories` · `products` · `suppliers` · `branch_stock_levels` · `stock_movements` · `stock_adjustment_reasons` · `purchases` · `purchase_items` · `stock_transfers` · `stock_transfer_items` · `stock_counts` · `stock_count_items`

**Test (PostgreSQL 16):** sellable ဈေးမပါ ✖ · ဆိုင်သုံး + ဈေး ✖ · နာမည် / SKU တူ ✖ · purchase qty 0 ✖ · line_total ✅ · POSTED by မပါ ✖ · PURCHASE_IN အနုတ် ✖ · ref တူ movement ၂ ✖ · **movement UPDATE / DELETE ✖ (trigger)** · type ⇔ ref မကိုက် ✖ · business_date UTC ✖ · USAGE_OUT −1 ✅ / အပေါင်း ✖ · MANUAL_ADJUST reason ✖ / ✅ · reason archive column မရှိ ✖ · transfer from = to ✖ · receiver employee ✖ · RECEIVED before SENT ✖ · SENT + OUT −5 ✅ · SENT ပြီး cancel ✖ · receive ကွာ reason ✖ / ✅ · RECEIVED + IN +4 ✅ · IN ၂ ကြိမ် ✖ · count ၂ ခု in-progress ✖ · difference generated ✅ · COUNT_ADJUST ✅ / ၂ ကြိမ် ✖ · **sale_items.product_id FK** ✖ / ✅ · SALE_OUT ၂ ✖ · ledger Σ = 0 ✅

**v1 design finding F-P6-01..09 — ✅ approve (D-DB-10)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-P6-01 | `product_categories` (service_categories ပုံစံတူ) | Fresha product category · lock မှာ တိတိကျကျ မပါ — UI grouping |
| F-P6-02 | `products` — `sku` optional unique · `is_sellable` (customer ရောင်း / ဆိုင်သုံးပဲ) · `sell_price_amount` **company-level** (sellable ⇒ CHECK; branch override ⏭) · unit column မထား (pcs — D-STK-01) | D-PAY-03 product sale · ဆိုးဆေး / shampoo = ဆိုင်သုံး (usage ပဲ) |
| F-P6-03 | ကုန်ကျစရိတ် = `purchase_items.unit_cost_amount` ပဲ (product standard cost ✖); P&L = **purchase → Part 7 expense** (`purchases.expense_id` future FK — cash basis); COGS / inventory valuation ⏭ | Point = ဆိုင်ငယ်၊ Fresha stock ~မသုံး; D-FIN-01 / 02 expense flow ရှိပြီး |
| F-P6-04 | `branch_stock_levels.quantity_on_hand` = **cache** (Σ movements, app same tx) + ညတိုင်း recompute check (မကိုက် ⇒ admin noti); **အနုတ် ခွင့်ပြု** (report flag) — checkout မပိတ် | RISK-01 (checkout မနှေး) · D-STK-04 usage ကို နောက်မှ မှတ်တာ အဖြစ်များ |
| F-P6-05 | `stock_movements` = **append-only ledger** (UPDATE / DELETE ✖ — trigger) · type ၈ မျိုး · type ⇔ sign ⇔ ref CHECK · ref ၁ ခု movement ၁ ခု · usage / manual adjust = movement တိုက်ရိုက် (table သီးသန့် ✖) | 🔒 D-STK-06 history · D-DAT-05 · ပြင်ရင် movement အသစ် |
| F-P6-06 | Transfer ၂ ဆင့် (D-STK-03 v5.1): SENT ⇒ TRANSFER_OUT (from, −sent) · RECEIVED ⇒ TRANSFER_IN (to, +received) · ကွာချက် (ပျောက်) = from branch ခံ (report) + reason CHECK · SENT ပြီး cancel ✖ | REC-14 · ကွာချက်ကို movement မထုတ် — report ကနေ from − to ကွာတာ မြင် |
| F-P6-07 | `stock_counts` — branch ၁ ခု in-progress ၁ ခု · `expected_quantity` = count စချိန် snapshot · POSTED ⇒ ကွာချက် ≠ 0 တိုင်း COUNT_ADJUST | D-STK-05 · count တုန်း ရောင်းလည်း expected ခိုင် |
| F-P6-08 | `stock_adjustment_reasons` — `archived_at` မထား (status disable ပဲ) | 🔒 D-STK-05 "disable ပဲ၊ delete မလုပ်" စာသားအတိုင်း |
| F-P6-09 | Part 4 ရဲ့ `sale_items.product_id` → `products` FK ကို ဒီ SQL မှာ ထည့် | §6.5 #9 future FK ပြေ · product-only sale test ✅ |

**App / Part 8 trigger က စစ်ရမယ့်ဟာ (SQL ဖိုင် အောက်ဆုံး):** balance = Σ movements · POSTED / SENT / RECEIVED ⇒ movement ထုတ် · FINISH ⇒ SALE_OUT · refund ⇒ SALE_RETURN_IN · count POST ⇒ counted NOT NULL · low stock noti · is_sellable = false ⇒ sale ✖

```dbml
// Point Barbershop — Part 6: Inventory · v1.1 🔒 D-DB-10 (30/Sep/2026)
// v1 → v1.1 (Part 7 ဆွဲချိန်): purchases.expense_id ဖြုတ် — purchase ၁ ခု branch အများကြီး ⇒ expense အများကြီး (branch P&L — D-FIN-05) ⇒ link = expenses.purchase_id + branch_id (Part 7)
// Part 1 (D-DB-02) + 2 (D-DB-06) + 4 (D-DB-08 — sale_items / refund_items) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1–5 နဲ့ တွဲ paste
// 🔒 D-STK-01..06 (v5.1: D-STK-03 transfer ၂ ဆင့် — REC-14), D-PAY-03 (product sale), D-DAT-05, D-NTF-01 / 03 (low stock noti), D-ORG-03, D-DB-01 / 03 / 04, D-PLT-15
// Status / type = smallint + CHECK (D-DB-03) · CHECK / partial unique / FK = part6-inventory-v1-constraints.sql
// F-P6-nn = review finding (§6.4f) — D-DB-10 နဲ့ approve ပြီး
// Part 4 ရဲ့ sale_items.product_id → products FK ကို ဒီ part ရဲ့ SQL မှာ ထည့် (§6.5 #9 future FK ပြေ)
// ငွေ / stock ledger (stock_movements, purchases) ပြောင်းတိုင်း DB trigger → audit_events (Part 8 — D-AUD-02)

// ───────────────────────── Product master ─────────────────────────

Table product_categories {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04']
  name_en varchar(150)
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'F-P6-01 — service_categories ပုံစံတူ (Fresha product category) · (company_id, name_mm) unique (SQL)'
}

Table products {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03 — company master (branch stock = branch_stock_levels)']
  category_id uuid [not null, ref: > product_categories.id]
  name_mm varchar(200) [not null, note: 'D-DB-04']
  name_en varchar(200)
  sku varchar(50) [note: 'Barcode / code (optional) — company အတွင်း unique (SQL) · F-P6-02']
  is_sellable boolean [not null, default: true, note: 'true = customer ကို ရောင်း (D-PAY-03) · false = ဆိုင်သုံးပဲ (ဆိုးဆေး / shampoo — D-STK-04 usage)']
  sell_price_amount bigint [note: 'MMK — sellable ⇒ မဖြစ်မနေ (CHECK) · company-level (branch override ⏭) · sale line = snapshot (list_price)']
  default_low_stock_threshold integer [note: 'D-STK-06 — branch_stock_levels.low_stock_threshold NULL ဆို ဒါ']
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  🔒 D-STK-01 — unit = pcs (column မလို) · (company_id, name_mm) unique (SQL) · archive ပဲ (D-DAT-05)
  Sale: sale_items.product_id (Part 4) → FINISH မှာ stock_movements SALE_OUT · refund kind 1 product line → SALE_RETURN_IN
  ကုန်ကျစရိတ် = purchase_items.unit_cost_amount (product မှာ standard cost မထား) · P&L = purchase = Part 7 expense (F-P6-03)
  '''
}

Table suppliers {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name varchar(200) [not null, note: 'ပြောတဲ့အတိုင်း ၁ ခု (D-DB-04)']
  phone varchar(50)
  address text
  notes text
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: 'D-STK-02 — supplier optional · (company_id, name) unique (SQL)'
}

// ───────────────────────── Stock balance + ledger (🔒 D-STK-06) ─────────────────────────

Table branch_stock_levels {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  product_id uuid [not null, ref: > products.id]
  quantity_on_hand integer [not null, default: 0, note: 'pcs — Σ stock_movements (cache; app same transaction · ညတိုင်း recompute check — F-P6-04) · အနုတ် ဖြစ်နိုင် (ရိုက်ကျန်) — report flag']
  low_stock_threshold integer [note: 'D-STK-06 — NULL → products.default_low_stock_threshold · ≤ ⇒ admin noti (Part 8)']
  low_stock_notified_at timestamptz [note: 'Noti ထပ်မပို့အောင် — threshold အထက် ပြန်ရောက်ရင် NULL']
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, product_id) [unique]
  }

  Note: '🔒 D-STK-01 branch အလိုက် stock · row = product ကို ဒီ branch မှာ သုံး / ရောင်း'
}

Table stock_movements {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  product_id uuid [not null, ref: > products.id]
  movement_type smallint [not null, note: '1 PURCHASE_IN · 2 TRANSFER_OUT · 3 TRANSFER_IN · 4 SALE_OUT · 5 SALE_RETURN_IN · 6 USAGE_OUT (D-STK-04) · 7 COUNT_ADJUST (D-STK-05) · 8 MANUAL_ADJUST (D-STK-05 reason)']
  quantity_delta integer [not null, note: '≠ 0 · IN = + · OUT = − (CHECK type ⇔ sign)']
  purchase_item_id uuid [ref: > purchase_items.id, note: 'PURCHASE_IN']
  stock_transfer_item_id uuid [ref: > stock_transfer_items.id, note: 'TRANSFER_OUT / TRANSFER_IN']
  sale_item_id uuid [ref: > sale_items.id, note: 'SALE_OUT (Part 4 — FINISH)']
  refund_item_id uuid [ref: > refund_items.id, note: 'SALE_RETURN_IN (Part 4)']
  stock_count_item_id uuid [ref: > stock_count_items.id, note: 'COUNT_ADJUST']
  adjustment_reason_id uuid [ref: > stock_adjustment_reasons.id, note: 'MANUAL_ADJUST ⇒ မဖြစ်မနေ (D-STK-05) · USAGE_OUT optional']
  note text [note: 'MANUAL_ADJUST / USAGE_OUT — free text']
  occurred_at timestamptz [not null, note: 'တကယ် ဖြစ်ချိန်']
  business_date date [not null, note: 'occurred_at ရဲ့ MMT ရက် (D-PLT-15)']
  recorded_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, product_id, occurred_at)
    (movement_type, business_date)
  }

  Note: '''
  🔒 D-STK-06 movement history — **append-only ledger** (UPDATE / DELETE ✖ — ပြင်ရင် movement အသစ်) · F-P6-05
  🔒 D-STK-04 usage = တစ်ဘူးလုံး ကုန်မှ USAGE_OUT (qty −1 ပုံမှန်) — barber / staff ကိုယ့်ဖုန်းကနေ
  Type ⇔ ref တစ်ခုပဲ (CHECK) · ref ၁ ခု movement ၁ ခု (partial unique — transfer item = OUT + IN ၂ ခု)
  '''
}

Table stock_adjustment_reasons {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04 — ဥပမာ ပျက်စီး / ပျောက် / ရိုက်မှား']
  name_en varchar(150)
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE (disable ပဲ) · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Note: '🔒 D-STK-05 — admin manage · delete ✖ (archived_at မထား — disable ပဲ) · (company_id, name_mm) unique'
}

// ───────────────────────── Purchase (🔒 D-STK-02) ─────────────────────────

Table purchases {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  supplier_id uuid [ref: > suppliers.id, note: 'Optional (D-STK-02)']
  invoice_reference varchar(100) [note: 'Supplier ဘောင်ချာ နံပါတ် (optional)']
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 DRAFT (ပြင်ရ) · 2 POSTED (stock ဝင်ပြီ — immutable)']
  total_amount bigint [not null, default: 0, note: 'Σ items (app) — MMK']
  purchased_at timestamptz [not null, note: 'ဝယ်တဲ့ရက် (POSTED မှာ movement occurred_at)']
  business_date date [not null, note: 'MMT']
  posted_at timestamptz
  posted_by_user_id uuid [ref: > users.id]
  cancelled_at timestamptz
  notes text
  created_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, business_date)
  }

  Note: 'Header = company (branch ၁ ခု / အများကြီး = items မှာ branch — D-STK-02) · POSTED ⇒ items တိုင်း PURCHASE_IN movement (branch အလိုက်) · ကုန်ကျစရိတ် → Part 7 expenses.purchase_id (purchase × branch ၁ ခု — F-P6-03 / F-P7-05; v1.1: expense_id column ဖြုတ်)'
}

Table purchase_items {
  id uuid [pk]
  purchase_id uuid [not null, ref: > purchases.id]
  branch_id uuid [not null, ref: > branches.id, note: 'ဒီ line ဘယ် branch stock ထဲ ဝင် (D-STK-02)']
  product_id uuid [not null, ref: > products.id]
  quantity integer [not null, note: '> 0 pcs']
  unit_cost_amount bigint [not null, note: 'MMK ≥ 0 — ကုန်ကျစရိတ် history (product မှာ cost မထား)']
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (purchase_id, branch_id, product_id) [unique]
  }

  Note: 'line_total = quantity × unit_cost (generated — SQL)'
}

// ───────────────────────── Transfer (🔒 D-STK-03 v5.1 — ၂ ဆင့်) ─────────────────────────

Table stock_transfers {
  id uuid [pk]
  from_branch_id uuid [not null, ref: > branches.id]
  to_branch_id uuid [not null, ref: > branches.id, note: '≠ from (CHECK)']
  status smallint [not null, default: 1, note: '0 CANCELLED (DRAFT ကနေပဲ) · 1 DRAFT (ပြင် / cancel ရ) · 2 SENT (ထွက်ပြီ — source −, in transit) · 3 RECEIVED (destination +)']
  receiver_type smallint [not null, note: '1 EMPLOYEE (တစ်ယောက်) · 2 BRANCH_STAFF (to_branch ဝန်ထမ်း အားလုံး) — noti (D-STK-03)']
  receiver_employee_id uuid [ref: > employees.id, note: 'EMPLOYEE ⇒ မဖြစ်မနေ (CHECK)']
  notes text
  created_by_user_id uuid [not null, ref: > users.id]
  sent_at timestamptz [note: 'SENT ⇒ (CHECK) — TRANSFER_OUT movement occurred_at']
  sent_by_user_id uuid [ref: > users.id]
  received_at timestamptz [note: 'RECEIVED ⇒ (CHECK) — TRANSFER_IN movement']
  received_by_user_id uuid [ref: > users.id]
  cancelled_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (from_branch_id, status)
    (to_branch_id, status)
  }

  Note: '''
  🔒 D-STK-03 (v5.1 — REC-14): DRAFT → SENT → RECEIVED · SENT ပြီး items ပြင် ✖ (app) · in transit report = SENT
  Receive = actual qty + ကွာချက် reason (items) · noti receiver (Part 8)
  '''
}

Table stock_transfer_items {
  id uuid [pk]
  stock_transfer_id uuid [not null, ref: > stock_transfers.id]
  product_id uuid [not null, ref: > products.id]
  quantity_sent integer [not null, note: '> 0']
  quantity_received integer [note: 'RECEIVED မှာ ဖြည့် (≥ 0) · ≠ sent ⇒ difference_reason (CHECK)']
  difference_reason text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (stock_transfer_id, product_id) [unique]
  }

  Note: 'TRANSFER_OUT = −quantity_sent (from) · TRANSFER_IN = +quantity_received (to) · ကွာချက် = ပျောက် (from branch ခံ — report) F-P6-06'
}

// ───────────────────────── Stock count (🔒 D-STK-05) ─────────────────────────

Table stock_counts {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 IN_PROGRESS · 2 POSTED (ကွာချက် movement ထုတ်ပြီ — immutable)']
  started_at timestamptz [not null]
  started_by_user_id uuid [not null, ref: > users.id]
  posted_at timestamptz
  posted_by_user_id uuid [ref: > users.id]
  cancelled_at timestamptz
  notes text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, started_at)
  }

  Note: 'Branch ၁ ခု IN_PROGRESS count ၁ ခုပဲ (partial unique) · POSTED ⇒ items ကွာချက် ≠ 0 တိုင်း COUNT_ADJUST movement'
}

Table stock_count_items {
  id uuid [pk]
  stock_count_id uuid [not null, ref: > stock_counts.id]
  product_id uuid [not null, ref: > products.id]
  expected_quantity integer [not null, note: 'Count စချိန် quantity_on_hand snapshot']
  counted_quantity integer [note: 'ရေတဲ့ အရေအတွက် (≥ 0) — NULL = မရေရသေး (POSTED ⇒ NOT NULL — app)']
  adjustment_reason_id uuid [ref: > stock_adjustment_reasons.id, note: 'ကွာချက် ≠ 0 ⇒ optional reason (D-STK-05)']
  note text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (stock_count_id, product_id) [unique]
  }

  Note: 'difference = counted − expected (generated — SQL)'
}

// ── Setting (Part 8) ──
// stock.low_stock_notify_roles (company — D-NTF-03 ငွေ / ပစ္စည်း ကိစ္စ → admin)
// Permission: product.manage · purchase.manage · purchase.post · transfer.create · transfer.send · transfer.receive · stock.usage (barber default ✔) · stock.adjust · stock.count
```

```sql
-- Point Barbershop — Part 6 v1 (🔒 D-DB-10) · Inventory · DBML မှာ ရေးလို့မရတဲ့ constraint

-- ═══════════ Part 4 future FK ပြေ (§6.5 #9) ═══════════
ALTER TABLE sale_items ADD CONSTRAINT sale_items_product_fk FOREIGN KEY (product_id) REFERENCES products (id);

-- ═══════════ master ═══════════
ALTER TABLE product_categories ADD CONSTRAINT product_categories_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX product_categories_name_active ON product_categories (company_id, name_mm) WHERE archived_at IS NULL;

ALTER TABLE products ADD CONSTRAINT products_status_chk CHECK (status IN (0, 1));
-- D-PAY-03: ရောင်းမယ့် product ⇒ ဈေး
ALTER TABLE products ADD CONSTRAINT products_sell_price_chk
  CHECK ((is_sellable AND sell_price_amount IS NOT NULL AND sell_price_amount >= 0) OR (NOT is_sellable AND sell_price_amount IS NULL));
ALTER TABLE products ADD CONSTRAINT products_threshold_chk CHECK (default_low_stock_threshold IS NULL OR default_low_stock_threshold >= 0);
CREATE UNIQUE INDEX products_name_active ON products (company_id, name_mm) WHERE archived_at IS NULL;
CREATE UNIQUE INDEX products_sku_active  ON products (company_id, sku) WHERE sku IS NOT NULL AND archived_at IS NULL;

ALTER TABLE suppliers ADD CONSTRAINT suppliers_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX suppliers_name_active ON suppliers (company_id, name) WHERE archived_at IS NULL;

ALTER TABLE stock_adjustment_reasons ADD CONSTRAINT stock_adjustment_reasons_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX stock_adjustment_reasons_name ON stock_adjustment_reasons (company_id, name_mm);

-- ═══════════ branch_stock_levels ═══════════
ALTER TABLE branch_stock_levels ADD CONSTRAINT branch_stock_levels_threshold_chk CHECK (low_stock_threshold IS NULL OR low_stock_threshold >= 0);
-- Low stock list (D-STK-06)
CREATE INDEX branch_stock_levels_low ON branch_stock_levels (branch_id) WHERE low_stock_notified_at IS NULL;

-- ═══════════ stock_movements (append-only ledger) ═══════════
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_type_chk CHECK (movement_type BETWEEN 1 AND 8);
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_delta_chk CHECK (quantity_delta <> 0);
-- Type ⇔ sign ⇔ ref (တစ်ခုတည်း)
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_type_refs_chk CHECK (
  (movement_type = 1 AND quantity_delta > 0 AND purchase_item_id IS NOT NULL
     AND stock_transfer_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 2 AND quantity_delta < 0 AND stock_transfer_item_id IS NOT NULL
     AND purchase_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 3 AND quantity_delta > 0 AND stock_transfer_item_id IS NOT NULL
     AND purchase_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 4 AND quantity_delta < 0 AND sale_item_id IS NOT NULL
     AND purchase_item_id IS NULL AND stock_transfer_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 5 AND quantity_delta > 0 AND refund_item_id IS NOT NULL
     AND purchase_item_id IS NULL AND stock_transfer_item_id IS NULL AND sale_item_id IS NULL AND stock_count_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 6 AND quantity_delta < 0
     AND purchase_item_id IS NULL AND stock_transfer_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL)
  OR (movement_type = 7 AND stock_count_item_id IS NOT NULL
     AND purchase_item_id IS NULL AND stock_transfer_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND adjustment_reason_id IS NULL)
  OR (movement_type = 8 AND adjustment_reason_id IS NOT NULL
     AND purchase_item_id IS NULL AND stock_transfer_item_id IS NULL AND sale_item_id IS NULL AND refund_item_id IS NULL AND stock_count_item_id IS NULL)
);
ALTER TABLE stock_movements ADD CONSTRAINT stock_movements_business_date_chk
  CHECK (business_date = (occurred_at AT TIME ZONE 'Asia/Yangon')::date);
-- ref ၁ ခု movement ၁ ခု (transfer item = OUT + IN)
CREATE UNIQUE INDEX stock_movements_one_purchase   ON stock_movements (purchase_item_id) WHERE purchase_item_id IS NOT NULL;
CREATE UNIQUE INDEX stock_movements_one_transfer   ON stock_movements (stock_transfer_item_id, movement_type) WHERE stock_transfer_item_id IS NOT NULL;
CREATE UNIQUE INDEX stock_movements_one_sale       ON stock_movements (sale_item_id) WHERE sale_item_id IS NOT NULL;
CREATE UNIQUE INDEX stock_movements_one_refund     ON stock_movements (refund_item_id) WHERE refund_item_id IS NOT NULL;
CREATE UNIQUE INDEX stock_movements_one_count_item ON stock_movements (stock_count_item_id) WHERE stock_count_item_id IS NOT NULL;
-- Append-only (D-STK-06 history · D-DAT-05) — app DB user ကို UPDATE / DELETE ✖ (Part 8 grant); ဒီမှာ rule trigger
CREATE FUNCTION stock_movements_immutable() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION 'stock_movements is append-only (D-STK-06)'; END $$;
CREATE TRIGGER stock_movements_no_update BEFORE UPDATE OR DELETE ON stock_movements
  FOR EACH ROW EXECUTE FUNCTION stock_movements_immutable();

-- ═══════════ purchases ═══════════
ALTER TABLE purchases ADD CONSTRAINT purchases_status_chk CHECK (status IN (0, 1, 2));
ALTER TABLE purchases ADD CONSTRAINT purchases_total_chk CHECK (total_amount >= 0);
ALTER TABLE purchases ADD CONSTRAINT purchases_business_date_chk
  CHECK (business_date = (purchased_at AT TIME ZONE 'Asia/Yangon')::date);
ALTER TABLE purchases ADD CONSTRAINT purchases_status_fields_chk CHECK (
  (status = 1 AND posted_at IS NULL AND cancelled_at IS NULL)
  OR (status = 2 AND posted_at IS NOT NULL AND posted_by_user_id IS NOT NULL AND cancelled_at IS NULL)
  OR (status = 0 AND cancelled_at IS NOT NULL AND posted_at IS NULL)
);
ALTER TABLE purchase_items ADD CONSTRAINT purchase_items_values_chk CHECK (quantity > 0 AND unit_cost_amount >= 0);
ALTER TABLE purchase_items ADD COLUMN line_total_amount bigint GENERATED ALWAYS AS (quantity * unit_cost_amount) STORED;

-- ═══════════ stock_transfers (D-STK-03 v5.1 — ၂ ဆင့်) ═══════════
ALTER TABLE stock_transfers ADD CONSTRAINT stock_transfers_status_chk   CHECK (status IN (0, 1, 2, 3));
ALTER TABLE stock_transfers ADD CONSTRAINT stock_transfers_branches_chk CHECK (from_branch_id <> to_branch_id);
ALTER TABLE stock_transfers ADD CONSTRAINT stock_transfers_receiver_chk CHECK (
  (receiver_type = 1 AND receiver_employee_id IS NOT NULL) OR (receiver_type = 2 AND receiver_employee_id IS NULL)
);
-- DRAFT → SENT → RECEIVED · CANCELLED = DRAFT ကနေပဲ (SENT ပြီး cancel ✖ — stock ထွက်ပြီ)
ALTER TABLE stock_transfers ADD CONSTRAINT stock_transfers_status_fields_chk CHECK (
  (status = 1 AND sent_at IS NULL AND received_at IS NULL AND cancelled_at IS NULL)
  OR (status = 2 AND sent_at IS NOT NULL AND sent_by_user_id IS NOT NULL AND received_at IS NULL AND cancelled_at IS NULL)
  OR (status = 3 AND sent_at IS NOT NULL AND sent_by_user_id IS NOT NULL AND received_at IS NOT NULL AND received_by_user_id IS NOT NULL
      AND received_at >= sent_at AND cancelled_at IS NULL)
  OR (status = 0 AND cancelled_at IS NOT NULL AND sent_at IS NULL AND received_at IS NULL)
);
ALTER TABLE stock_transfer_items ADD CONSTRAINT stock_transfer_items_qty_chk
  CHECK (quantity_sent > 0 AND (quantity_received IS NULL OR quantity_received >= 0));
-- Receive: actual ≠ sent ⇒ reason (D-STK-03)
ALTER TABLE stock_transfer_items ADD CONSTRAINT stock_transfer_items_difference_chk CHECK (
  quantity_received IS NULL
  OR quantity_received = quantity_sent
  OR (difference_reason IS NOT NULL AND btrim(difference_reason) <> '')
);

-- ═══════════ stock_counts (D-STK-05) ═══════════
ALTER TABLE stock_counts ADD CONSTRAINT stock_counts_status_chk CHECK (status IN (0, 1, 2));
ALTER TABLE stock_counts ADD CONSTRAINT stock_counts_status_fields_chk CHECK (
  (status = 1 AND posted_at IS NULL AND cancelled_at IS NULL)
  OR (status = 2 AND posted_at IS NOT NULL AND posted_by_user_id IS NOT NULL AND posted_at >= started_at AND cancelled_at IS NULL)
  OR (status = 0 AND cancelled_at IS NOT NULL AND posted_at IS NULL)
);
CREATE UNIQUE INDEX stock_counts_one_in_progress ON stock_counts (branch_id) WHERE status = 1;
ALTER TABLE stock_count_items ADD CONSTRAINT stock_count_items_counted_chk CHECK (counted_quantity IS NULL OR counted_quantity >= 0);
ALTER TABLE stock_count_items ADD COLUMN difference_quantity integer GENERATED ALWAYS AS (counted_quantity - expected_quantity) STORED;

-- ═══════════ App / Part 8 trigger က စစ်ရမယ့်ဟာ (cross-table) ═══════════
-- · branch_stock_levels.quantity_on_hand = Σ movements (same tx · ညတိုင်း recompute + မကိုက်ရင် admin noti)
-- · purchase POSTED ⇒ item တိုင်း PURCHASE_IN movement (branch = item.branch) · POSTED / CANCELLED ⇒ items ပြင် ✖
-- · transfer SENT ⇒ item တိုင်း TRANSFER_OUT (from, −sent) · RECEIVED ⇒ TRANSFER_IN (to, +received) · SENT ပြီး items ပြင် ✖ · counted NULL ⇒ POST ✖
-- · sale FINISH ⇒ PRODUCT line တိုင်း SALE_OUT (sale.branch) · refund kind 1 product line ⇒ SALE_RETURN_IN
-- · stock_count POSTED ⇒ items counted NOT NULL · difference ≠ 0 ⇒ COUNT_ADJUST movement (delta = difference)
-- · low stock: quantity_on_hand ≤ threshold ⇒ noti (notified_at NULL ဆို) · ပြန်ကျော်ရင် notified_at = NULL
-- · product is_sellable = false ⇒ sale line ✖ · archived product ⇒ purchase / sale ✖ (stock ကျန် ရှိရင် archive ✖)
```

### 6.4g Part 7 — Finance / Daily closing / P&L (🔒 v1)

**Source:** 🔒 D-FIN-01..09 (v5.1: OPEN-05 A, OPEN-25), REC-17, D-PAY-02 (closing verify), D-VIS-13, D-SVC-06, D-PAYR-04 · **Status:** 🔒 **LOCK (30/Sep မနက်) — D-DB-11 = v1** · `@dbml/core` parse OK (Part 1–7 တွဲ — **table ၇၉ ခု**) · PostgreSQL 16 load + **test ၄၆/၄၆ PASS** (Part 3–6 test အကုန် full schema ပေါ် ပြန် run ✅) · F-P7-01..07 approve

ဖိုင်: `db/part7-finance-closing-v1.1.dbml` (*v5.2.15: v1.1 — G d, §6.4i; အောက်က DBML = v1 စာသား*), `db/part7-finance-closing-v1-constraints.sql`, `db/part7-finance-closing-v1-test.sql`

**Table ၈ ခု:** `expense_categories` · `income_categories` · `expenses` · `manual_incomes` · `cash_out_reasons` · `cash_outs` · `cash_returns` · `daily_closings` · **P&L = view** (revenue = sales FINISHED + manual_incomes − expenses APPROVED; branch / company-wide)

**Test (PostgreSQL 16):** system category ထပ် / archive ✖ · EXPENSE reason category မပါ ✖ · EMPLOYEE_BALANCE kind မပါ ✖ · CASH_MOVEMENT + category ✖ · cash out → expense ✅ / ၂ ခု ✖ · MUST_RETURN ယူသူ မပါ ✖ · EMPLOYEE_BALANCE employee မပါ ✖ / + receivable FK ✅ / ၂ ခု ✖ · ဘဏ်သွင်း ✅ · business_date UTC ✖ · လကုန် auto expense ✅ · cash return ✅ · REVERSAL အပေါင်း ✖ / −50,000 ✅ / ၂ ခု ✖ · **category Oct + Nov = 0 ✅** · MANUAL paid_via ✖ · PENDING ✅ · REJECTED reason ✖ · APPROVED ✅ · soft delete reason ✖ / ✅ · AUTO source PENDING ✖ · manual income ✅ · closing expected မကိုက် ✖ / ✅ · branch-date ၂ ✖ · CLOSE counted ✖ / ကွာ reason ✖ / ✅ · difference −5,000 ✅ · opening ≠ မနေ့ reason ✖ / ✅ · unverified reason ✖ / ✅ · reopen reason ✖ / ✅

**v1 design finding F-P7-01..07 — ✅ approve (D-DB-11)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-P7-01 | `expense_categories` system code ၃ ခု (1 SALARY · 2 PRODUCT_PURCHASE · 3 HOME_SERVICE_TRANSPORT — archive ✖) + admin custom; "Staff Advance" category seed ✖ | D-FIN-04 payroll auto · Part 6 purchase auto · D-SVC-06 ကားခ · REC-15 |
| F-P7-02 | `manual_incomes` ကိုလည်း expense ပုံစံတူ — PENDING / APPROVED / REJECTED + soft delete (reason) | D-FIN-03 စာသားက expense ပဲ ပြော — income လည်း non-admin ထည့်နိုင်လို့ တူတူ ထိန်း |
| F-P7-03 | `cash_outs.expected_return_date` = **optional** (🟡 D-FIN-07 ဖြေ) | D-FIN-09 လကုန် auto convert ရှိလို့ ရက် မဖြစ်မနေ မလို; ပိုင်ရှင် ယာယီ ထုတ်တာ ရက် မပြောတတ် |
| F-P7-04 | **`expenses` = ledger ၁ ခု** — `source` ၆ မျိုး (MANUAL / CASH_OUT / PAYROLL / PURCHASE / MUST_RETURN_AUTO (+) / CASH_RETURN_REVERSAL (−)); sign + ref CHECK; REVERSAL → `original_expense_id` (P&L label "မူလ ရက် / ပမာဏ" — OPEN-25) · AUTO source ⇒ APPROVED (CHECK) | P&L query တစ်ခုတည်း (Σ APPROVED, deleted ✖); OPEN-25 row ၂ ကြောင်း + note = report layer |
| F-P7-05 | Purchase expense = **(purchase, branch) ၁ ခု** (`expenses.purchase_id` + `branch_id` unique) → **Part 6 v1.1**: `purchases.expense_id` column ဖြုတ် | Purchase ၁ ခု branch ၂ ခု ဝယ်ရင် branch P&L (D-FIN-05) ခွဲရ — Part 6 v1 ရဲ့ single FK မကိုက် |
| F-P7-06 | `daily_closings` = REC-17 component snapshot ၆ ခု + `expected` CHECK formula + `cash_difference_amount` generated; CLOSED ⇔ counted + (diff ≠ 0 ⇒ reason) + (unverified > 0 ⇒ reason — D-PAY-02); `previous_closing_counted` ≠ opening ⇒ reason (OPEN-05 A); reopen = count + reason | D-FIN-06 immutable snapshot — source နောက်မှ ပြောင်း (reopen) လည်း ပိတ်ပြီးသား closing မပြောင်း; RISK-10 |
| F-P7-07 | `cash_outs.accounting_type` = reason snapshot + type ⇔ field CHECK (MUST_RETURN ⇒ ယူသူ user / name · EMPLOYEE_BALANCE ⇒ employee → `employee_receivables.cash_out_id` FK (Part 5 future FK ပြေ, ၁ : ၁)) | D-FIN-08 reason ပြင်လည်း history ခိုင်; D-PAYR-04 advance = receivable (expense ✖) |

**App / Part 8 trigger က စစ်ရမယ့်ဟာ (SQL ဖိုင် အောက်ဆုံး):** cash out type ⇒ expense / receivable same tx · Σ returns ≤ amount · convert ပြီး return ⇒ REVERSAL · လကုန် job (REC-31) · payroll FINALIZE / purchase POSTED ⇒ expense · closing snapshot တွက် · CLOSED ⇒ branch-date ပိတ် · tolerance noti · P&L view

```dbml
// Point Barbershop — Part 7: Finance / Daily closing / P&L · v1 🔒 D-DB-11 (30/Sep/2026)
// Part 1 + 4 (payments / refunds) + 5 (payroll allocations / receivables) + 6 (purchases) ပေါ်မှာ ဆောက် — dbdiagram မှာ part1–6 နဲ့ တွဲ paste
// 🔒 D-FIN-01..09 (v5.1: D-FIN-06 OPEN-05 A · D-FIN-09 OPEN-25), REC-17, D-PAY-02 (closing verify), D-VIS-13 (late entry ⇐ closing), D-SVC-06 (ကားခ Cash Out),
//    D-PAYR-04 (advance / loan = receivable), D-DAT-05, D-AUD-02, D-NTF-03, D-ORG-03, D-DB-01 / 03 / 04, D-PLT-15
// Status / type = smallint + CHECK (D-DB-03) · CHECK / partial unique / FK = part7-finance-closing-v1-constraints.sql
// F-P7-nn = review finding (§6.4g) — D-DB-11 နဲ့ approve ပြီး
// Future FK ပြေ: employee_receivables.cash_out_id → cash_outs (Part 5) · purchases → expenses.purchase_id (Part 6 v1.1 — F-P7-05)
// P&L (D-FIN-05) = view: revenue (sales FINISHED — Part 4) + manual_incomes − expenses (APPROVED, deleted ✖ — reversal အနုတ်) · branch = branch_id · company-wide = branch_id NULL
// Attachments (D-FIN-03) = Part 8 attachments (entity_type / entity_id) · ငွေ table ပြောင်းတိုင်း DB trigger → audit_events (Part 8 — D-AUD-02)

// ───────────────────────── Categories ─────────────────────────

Table expense_categories {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04']
  name_en varchar(150)
  system_code smallint [note: 'NULL = admin ဖန်တီး (D-FIN-02) · 1 SALARY (payroll auto — D-FIN-04) · 2 PRODUCT_PURCHASE (Part 6 auto) · 3 HOME_SERVICE_TRANSPORT (D-SVC-06) — archive ✖']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '🔒 D-FIN-02 — admin manage · "Staff Advance" category ✖ (REC-15 — advance / loan = receivable, Part 5) · (company_id, name_mm) unique (SQL) · F-P7-01'
}

Table income_categories {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04 — ဥပမာ ပစ္စည်း ရောင်း (ဟောင်း) / အခြား']
  name_en varchar(150)
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '🔒 D-FIN-01 manual income category · service / product / ကားခ revenue = sales (Part 4) auto — category မလို'
}

// ───────────────────────── Expense / Income ─────────────────────────

Table expenses {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  branch_id uuid [ref: > branches.id, note: 'NULL = company-wide (D-FIN-02 / D-FIN-05 company P&L) · ဖြည့် = branch P&L']
  category_id uuid [not null, ref: > expense_categories.id]
  source smallint [not null, note: '1 MANUAL · 2 CASH_OUT (drawer — D-FIN-07) · 3 PAYROLL (finalize auto — D-FIN-04) · 4 PURCHASE (POSTED auto — Part 6) · 5 MUST_RETURN_AUTO (လကုန် — D-FIN-09) · 6 CASH_RETURN_REVERSAL (ပြန်ထည့် — OPEN-25, အနုတ်)']
  amount bigint [not null, note: 'MMK · > 0 · REVERSAL ⇒ < 0 (CHECK) · P&L = Σ (APPROVED, deleted ✖)']
  expense_date date [not null, note: 'MMT — P&L လ (PAYROLL = period_end · MUST_RETURN_AUTO = မူလလ ကုန်ရက် · REVERSAL = ပြန်ထည့်ရက်)']
  description_mm text [note: 'Free text (D-DB-04)']
  paid_via smallint [note: 'MANUAL ⇒ မဖြစ်မနေ: 1 BANK · 2 OWNER_PERSONAL · 3 OTHER (drawer cash = CASH_OUT source ကနေပဲ)']
  status smallint [not null, default: 1, note: '1 PENDING (admin မဟုတ်သူ ထည့် — D-FIN-03) · 2 APPROVED (P&L ထဲ) · 3 REJECTED']
  requested_by_user_id uuid [not null, ref: > users.id]
  approved_by_user_id uuid [ref: > users.id, note: 'Permission `expense.approve` · admin ထည့်ရင် ကိုယ်တိုင် (auto APPROVED)']
  approved_at timestamptz
  rejection_reason text
  deleted_at timestamptz [note: 'Soft delete (D-FIN-03 — "Void" ✖) · P&L ထဲ မပါ · reason + by']
  deleted_by_user_id uuid [ref: > users.id]
  deletion_reason text
  cash_out_id uuid [ref: - cash_outs.id, note: 'source CASH_OUT / MUST_RETURN_AUTO ⇒ မဖြစ်မနေ (cash out ၁ ခု expense ၁ ခု)']
  payroll_entry_branch_allocation_id uuid [ref: - payroll_entry_branch_allocations.id, note: 'source PAYROLL ⇒ (employee × branch drill-down — D-FIN-04 / D-PAYR-08) · Gross']
  purchase_id uuid [ref: > purchases.id, note: 'source PURCHASE ⇒ (purchase × branch ၁ ခု — F-P7-05)']
  original_expense_id uuid [ref: > expenses.id, note: 'REVERSAL ⇒ မူလ MUST_RETURN_AUTO expense (label: မူလ ရက် / ပမာဏ — OPEN-25)']
  cash_return_id uuid [ref: - cash_returns.id, note: 'REVERSAL ⇒ ပြန်ထည့်တဲ့ cash return']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, expense_date)
    (branch_id, expense_date)
    (category_id, expense_date)
  }

  Note: '''
  🔒 D-FIN-03 — PENDING မှာ ပြင်ရ · APPROVED ပြီး ပြင် ✖ (delete + အသစ်) · attachment = Part 8
  🔒 D-FIN-04 — salary expense = payroll_entry_branch_allocations.allocated_gross_amount (Gross · advance / loan ✖)
  🔒 D-FIN-09 / OPEN-25 — MUST_RETURN_AUTO (+) မူလလ · REVERSAL (−) ပြန်ထည့်လ — category တူ · P&L row ၂ ကြောင်း + label + note (F-P7-04)
  Source AUTO (2–6) ⇒ status APPROVED (app) · MANUAL admin ⇒ APPROVED · MANUAL non-admin ⇒ PENDING → noti approver (D-NTF-03)
  '''
}

Table manual_incomes {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  branch_id uuid [ref: > branches.id, note: 'NULL = company-wide (D-FIN-01)']
  category_id uuid [not null, ref: > income_categories.id]
  amount bigint [not null, note: '> 0 MMK']
  income_date date [not null, note: 'MMT']
  payment_method_id uuid [not null, ref: > payment_methods.id, note: 'Cash ⇒ drawer cash in → closing expected (REC-17 "± cash in") · branch မဖြစ်မနေ (CHECK)']
  description_mm text
  status smallint [not null, default: 1, note: '1 PENDING · 2 APPROVED · 3 REJECTED — expense ပုံစံတူ (F-P7-02)']
  requested_by_user_id uuid [not null, ref: > users.id]
  approved_by_user_id uuid [ref: > users.id]
  approved_at timestamptz
  rejection_reason text
  deleted_at timestamptz
  deleted_by_user_id uuid [ref: > users.id]
  deletion_reason text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, income_date)
  }

  Note: '🔒 D-FIN-01 manual income (branch / company) · P&L revenue = sales (Part 4) + ဒီ table (APPROVED)'
}

// ───────────────────────── Cash Out / Return (🔒 D-FIN-07 / 08 / 09) ─────────────────────────

Table cash_out_reasons {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  name_mm varchar(150) [not null, note: 'D-DB-04 — ဥပမာ ဝန်ထမ်း ထမင်း / မီးဖိုး / supplier / ဘဏ်သွင်း / ပိုင်ရှင် ယာယီ ထုတ်']
  name_en varchar(150)
  accounting_type smallint [not null, note: '1 EXPENSE (→ expenses) · 2 EMPLOYEE_BALANCE (advance / loan → employee_receivables) · 3 CASH_MOVEMENT (ဘဏ်သွင်း — expense ✖) · 4 MUST_RETURN (ယာယီ — D-FIN-09) — 🔒 D-FIN-08']
  expense_category_id uuid [ref: > expense_categories.id, note: 'EXPENSE / MUST_RETURN ⇒ မဖြစ်မနေ (CHECK — D-FIN-08) · MUST_RETURN = လကုန် auto expense category']
  receivable_kind smallint [note: 'EMPLOYEE_BALANCE ⇒ 1 SALARY_ADVANCE · 2 STAFF_LOAN (Part 5 employee_receivables.kind) — CHECK']
  sort_order integer [not null, default: 0]
  status smallint [not null, default: 1, note: '0 INACTIVE · 1 ACTIVE (admin "active" — D-FIN-08)']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz

  Note: '''
  🔒 D-FIN-08 Cash Out Reason Master — reason က accounting ဆုံးဖြတ် · (company_id, name_mm) unique (SQL)
  Seed: ဝန်ထမ်း ထမင်း (1) · မီးဖိုး (1) · supplier (1) · Home service ကားခ (1 — D-SVC-06) · လစာ ကြိုထုတ် (2, advance) · ဝန်ထမ်း ချေးငွေ (2, loan) · ဘဏ်သွင်း (3) · ပိုင်ရှင် ယာယီ ထုတ် (4)
  '''
}

Table cash_outs {
  id uuid [pk]
  client_request_id uuid [not null, unique, note: 'D-VIS-10 double submit']
  branch_id uuid [not null, ref: > branches.id, note: 'ဘယ် drawer ကနေ']
  reason_id uuid [not null, ref: > cash_out_reasons.id]
  accounting_type smallint [not null, note: 'reason.accounting_type snapshot (reason နောက်မှ ပြင်လည်း history မပြောင်း) — CHECK ⇔ field']
  amount bigint [not null, note: '> 0 MMK']
  note text [note: 'D-FIN-07 note']
  taken_by_user_id uuid [ref: > users.id, note: 'MUST_RETURN ⇒ ယူသူ (user ရှိရင်) · မရှိရင် taken_by_name']
  taken_by_name varchar(200) [note: 'MUST_RETURN ⇒ user မဟုတ်တဲ့ ယူသူ (CHECK: user ✖ name ✖ ၂ ခုလုံး မရှိ ✖)']
  expected_return_date date [note: 'MUST_RETURN — optional (🟡 D-FIN-07 → F-P7-03 optional)']
  employee_id uuid [ref: > employees.id, note: 'EMPLOYEE_BALANCE ⇒ ငွေယူတဲ့ ဝန်ထမ်း (CHECK) → employee_receivables (Part 5)']
  occurred_at timestamptz [not null, note: 'တကယ် ထုတ်ချိန် (စာအုပ်မှတ်ပြီး closing မှာ သွင်း = user ရိုက် — D-FIN-07)']
  business_date date [not null, note: 'MMT — ဒီရက် closing ရဲ့ expected cash ထဲ (REC-17)']
  recorded_by_user_id uuid [not null, ref: > users.id]
  converted_expense_at timestamptz [note: 'MUST_RETURN — လကုန် closing အထိ မပြန် ⇒ expense auto (D-FIN-09) · expense row = expenses.cash_out_id']
  settled_at timestamptz [note: 'MUST_RETURN — Σ cash_returns = amount ⇒ ပိတ် (app)']
  created_at timestamptz [not null, default: `now()`, note: '= recorded_at']

  Indexes {
    (branch_id, business_date)
    (accounting_type, settled_at)
  }

  Note: '''
  🔒 D-FIN-07 — drawer ထုတ်တိုင်း form · closing expected cash − Σ cash_outs (business_date)
  Type ⇒ ဘာဖြစ်လဲ (app, same tx): EXPENSE → expenses (source 2) · EMPLOYEE_BALANCE → employee_receivables (kind = reason.receivable_kind) · CASH_MOVEMENT → ဘာမှ (cash ↓ ပဲ) · MUST_RETURN → outstanding (report "ပြန်ထည့်ရန်")
  Closing CLOSED ပြီး ဒီ branch-date မှာ cash out အသစ် ✖ (reopen မှ — app)
  '''
}

Table cash_returns {
  id uuid [pk]
  client_request_id uuid [not null, unique]
  cash_out_id uuid [not null, ref: > cash_outs.id, note: 'MUST_RETURN cash out ပဲ (app) · partial ရ — Σ ≤ amount (app)']
  branch_id uuid [not null, ref: > branches.id, note: 'ပြန်ထည့်တဲ့ drawer (ပုံမှန် = cash_out.branch)']
  amount bigint [not null, note: '> 0']
  returned_at timestamptz [not null]
  business_date date [not null, note: 'MMT — ဒီရက် closing expected cash + (REC-17)']
  received_by_user_id uuid [not null, ref: > users.id]
  note text
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (cash_out_id)
    (branch_id, business_date)
  }

  Note: '''
  🔒 D-FIN-09 / OPEN-25 — မူလ cash out converted ပြီး (expense ဖြစ်ပြီး) ⇒ expenses REVERSAL row (−amount, category တူ, original_expense_id, label = မူလ ရက် / ပမာဏ)
  Convert မဖြစ်သေး (လအတွင်း ပြန်) ⇒ expense မထုတ် — outstanding ↓ ပဲ
  '''
}

// ───────────────────────── Daily closing (🔒 D-FIN-06 v5.1) ─────────────────────────

Table daily_closings {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  business_date date [not null, note: 'MMT · (branch, date) unique']
  status smallint [not null, default: 1, note: '1 OPEN (ပိတ်ရန်) · 2 CLOSED (immutable) — reopen ⇒ OPEN + reopen field (D-FIN-06)']
  opening_cash_amount bigint [not null, default: 0, note: 'မနက် ဗီရိုထဲ ကြိုထားငွေ — default = branch setting (OPEN-05 A) · ပိတ်သူ ပြင်ရ']
  previous_closing_counted_amount bigint [note: 'မနေ့ closing ရဲ့ counted (ရှိရင်) — ≠ opening ⇒ reason (CHECK)']
  opening_difference_reason text
  cash_sales_amount bigint [not null, default: 0, note: 'Σ payments (is_cash method, voided ✖, sale FINISHED, business_date) — snapshot']
  cash_refunds_amount bigint [not null, default: 0, note: 'Σ refunds (cash method, business_date)']
  cash_outs_amount bigint [not null, default: 0, note: 'Σ cash_outs (branch, business_date)']
  cash_returns_amount bigint [not null, default: 0, note: 'Σ cash_returns (branch, business_date)']
  cash_manual_incomes_amount bigint [not null, default: 0, note: 'Σ manual_incomes (cash, APPROVED, branch, date)']
  expected_cash_amount bigint [not null, default: 0, note: '= opening + sales − refunds − outs + returns + manual (CHECK — REC-17)']
  counted_cash_amount bigint [note: 'ပိတ်သူ ရေတဲ့ ဗီရိုငွေ — CLOSED ⇒ မဖြစ်မနေ · cash_difference_amount = counted − expected (generated column — SQL) · ≠ 0 ⇒ reason (CHECK) · |diff| > setting ⇒ admin noti (D-NTF-03)']
  cash_difference_reason text
  noncash_expected_amount bigint [not null, default: 0, note: 'Σ payments (non-cash method — KBZPay) business_date']
  noncash_verified_amount bigint [not null, default: 0, note: 'Σ verified (D-PAY-02 v5.1)']
  unverified_payment_count integer [not null, default: 0, note: '✔ မရသေးတာ — CLOSED + > 0 ⇒ reason (CHECK — D-PAY-02 v5.1)']
  unverified_reason text
  notes text
  closed_at timestamptz
  closed_by_user_id uuid [ref: > users.id, note: 'Permission `closing.close` (OPEN-05 A)']
  reopen_count smallint [not null, default: 0]
  last_reopened_at timestamptz
  last_reopened_by_user_id uuid [ref: > users.id, note: 'Admin — D-FIN-06 reopen + audit']
  last_reopen_reason text
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, business_date) [unique]
    (business_date, status)
  }

  Note: '''
  🔒 D-FIN-06 (v5.1) — branch + ရက် · expected / counted / difference / reason · CLOSED immutable · admin reopen (reason) · company consolidated = view
  Snapshot column တွေ = CLOSE ချိန် app တွက် (payments / refunds / cash_outs / cash_returns / manual_incomes ကနေ) — ပြီးမှ source ပြောင်းလည်း closing မပြောင်း (F-P7-06)
  CLOSED ⇒ ဒီ branch-date late entry (D-VIS-13) / cash out / payment verify ✖ — reopen မှ (app)
  Opening = setting default · previous_closing_counted ≠ opening ⇒ reason (ပိုင်ရှင် ထုတ်သွား = Cash Out မှတ်)
  '''
}

// ── Setting (Part 8) ──
// closing.opening_float_amount (branch, default 0 — OPEN-05 A) · closing.cash_difference_tolerance_amount (company, default 0) · closing.close_roles = permission
// finance.month_end_must_return_job (REC-31 ပုံစံ — လကုန် closing ပြီး MUST_RETURN outstanding → expenses source 5)
// Permission: expense.create (staff) · expense.approve · income.create · income.approve · cashout.create · cashout.return · closing.close · closing.reopen (admin) · finance.pnl.view
```

```sql
-- Point Barbershop — Part 7 v1 (🔒 D-DB-11) · Finance / Daily closing / P&L · DBML မှာ ရေးလို့မရတဲ့ constraint

-- ═══════════ Future FK ပြေ ═══════════
ALTER TABLE employee_receivables ADD CONSTRAINT employee_receivables_cash_out_fk FOREIGN KEY (cash_out_id) REFERENCES cash_outs (id);   -- Part 5
CREATE UNIQUE INDEX employee_receivables_one_per_cash_out ON employee_receivables (cash_out_id) WHERE cash_out_id IS NOT NULL;

-- ═══════════ categories ═══════════
ALTER TABLE expense_categories ADD CONSTRAINT expense_categories_status_chk CHECK (status IN (0, 1));
ALTER TABLE expense_categories ADD CONSTRAINT expense_categories_system_chk
  CHECK (system_code IS NULL OR (system_code IN (1, 2, 3) AND archived_at IS NULL));
CREATE UNIQUE INDEX expense_categories_system_uq   ON expense_categories (company_id, system_code) WHERE system_code IS NOT NULL;
CREATE UNIQUE INDEX expense_categories_name_active ON expense_categories (company_id, name_mm) WHERE archived_at IS NULL;
ALTER TABLE income_categories ADD CONSTRAINT income_categories_status_chk CHECK (status IN (0, 1));
CREATE UNIQUE INDEX income_categories_name_active ON income_categories (company_id, name_mm) WHERE archived_at IS NULL;

-- ═══════════ expenses ═══════════
ALTER TABLE expenses ADD CONSTRAINT expenses_source_chk   CHECK (source BETWEEN 1 AND 6);
ALTER TABLE expenses ADD CONSTRAINT expenses_status_chk   CHECK (status IN (1, 2, 3));
ALTER TABLE expenses ADD CONSTRAINT expenses_paid_via_chk CHECK (paid_via IS NULL OR paid_via IN (1, 2, 3));
-- Source ⇔ ref ⇔ sign (OPEN-25 reversal = အနုတ်)
ALTER TABLE expenses ADD CONSTRAINT expenses_source_refs_chk CHECK (
  (source = 1 AND amount > 0 AND paid_via IS NOT NULL
     AND cash_out_id IS NULL AND payroll_entry_branch_allocation_id IS NULL AND purchase_id IS NULL AND original_expense_id IS NULL AND cash_return_id IS NULL)
  OR (source IN (2, 5) AND amount > 0 AND cash_out_id IS NOT NULL AND paid_via IS NULL
     AND payroll_entry_branch_allocation_id IS NULL AND purchase_id IS NULL AND original_expense_id IS NULL AND cash_return_id IS NULL)
  OR (source = 3 AND amount > 0 AND payroll_entry_branch_allocation_id IS NOT NULL AND paid_via IS NULL
     AND cash_out_id IS NULL AND purchase_id IS NULL AND original_expense_id IS NULL AND cash_return_id IS NULL)
  OR (source = 4 AND amount > 0 AND purchase_id IS NOT NULL AND branch_id IS NOT NULL AND paid_via IS NULL
     AND cash_out_id IS NULL AND payroll_entry_branch_allocation_id IS NULL AND original_expense_id IS NULL AND cash_return_id IS NULL)
  OR (source = 6 AND amount < 0 AND original_expense_id IS NOT NULL AND cash_return_id IS NOT NULL AND paid_via IS NULL
     AND cash_out_id IS NULL AND payroll_entry_branch_allocation_id IS NULL AND purchase_id IS NULL)
);
-- D-FIN-03: status ⇔ approval field · REJECTED ⇒ reason · AUTO source ⇒ APPROVED
ALTER TABLE expenses ADD CONSTRAINT expenses_status_fields_chk CHECK (
  (status = 1 AND approved_by_user_id IS NULL AND approved_at IS NULL AND rejection_reason IS NULL AND source = 1)
  OR (status = 2 AND approved_by_user_id IS NOT NULL AND approved_at IS NOT NULL AND rejection_reason IS NULL)
  OR (status = 3 AND approved_by_user_id IS NOT NULL AND approved_at IS NOT NULL AND rejection_reason IS NOT NULL AND btrim(rejection_reason) <> '' AND source = 1)
);
-- Soft delete ⇔ reason + by
ALTER TABLE expenses ADD CONSTRAINT expenses_deleted_chk CHECK (
  (deleted_at IS NULL AND deleted_by_user_id IS NULL AND deletion_reason IS NULL)
  OR (deleted_at IS NOT NULL AND deleted_by_user_id IS NOT NULL AND deletion_reason IS NOT NULL AND btrim(deletion_reason) <> '')
);
-- Cash out ၁ ခု expense ၁ ခု · allocation ၁ ခု expense ၁ ခု · purchase × branch ၁ ခု · cash return ၁ ခု reversal ၁ ခု
CREATE UNIQUE INDEX expenses_one_per_cash_out    ON expenses (cash_out_id) WHERE cash_out_id IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX expenses_one_per_allocation  ON expenses (payroll_entry_branch_allocation_id) WHERE payroll_entry_branch_allocation_id IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX expenses_one_per_purchase_br ON expenses (purchase_id, branch_id) WHERE purchase_id IS NOT NULL AND deleted_at IS NULL;
CREATE UNIQUE INDEX expenses_one_per_cash_return ON expenses (cash_return_id) WHERE cash_return_id IS NOT NULL AND deleted_at IS NULL;
-- P&L (APPROVED, deleted ✖)
CREATE INDEX expenses_pnl ON expenses (company_id, expense_date, branch_id) WHERE status = 2 AND deleted_at IS NULL;

-- ═══════════ manual_incomes ═══════════
ALTER TABLE manual_incomes ADD CONSTRAINT manual_incomes_amount_chk CHECK (amount > 0);
ALTER TABLE manual_incomes ADD CONSTRAINT manual_incomes_status_chk CHECK (status IN (1, 2, 3));
ALTER TABLE manual_incomes ADD CONSTRAINT manual_incomes_status_fields_chk CHECK (
  (status = 1 AND approved_by_user_id IS NULL AND approved_at IS NULL AND rejection_reason IS NULL)
  OR (status = 2 AND approved_by_user_id IS NOT NULL AND approved_at IS NOT NULL AND rejection_reason IS NULL)
  OR (status = 3 AND approved_by_user_id IS NOT NULL AND approved_at IS NOT NULL AND rejection_reason IS NOT NULL AND btrim(rejection_reason) <> '')
);
ALTER TABLE manual_incomes ADD CONSTRAINT manual_incomes_deleted_chk CHECK (
  (deleted_at IS NULL AND deleted_by_user_id IS NULL AND deletion_reason IS NULL)
  OR (deleted_at IS NOT NULL AND deleted_by_user_id IS NOT NULL AND deletion_reason IS NOT NULL AND btrim(deletion_reason) <> '')
);
CREATE INDEX manual_incomes_pnl ON manual_incomes (company_id, income_date, branch_id) WHERE status = 2 AND deleted_at IS NULL;

-- ═══════════ cash_out_reasons (D-FIN-08) ═══════════
ALTER TABLE cash_out_reasons ADD CONSTRAINT cash_out_reasons_type_chk   CHECK (accounting_type IN (1, 2, 3, 4));
ALTER TABLE cash_out_reasons ADD CONSTRAINT cash_out_reasons_status_chk CHECK (status IN (0, 1));
-- EXPENSE / MUST_RETURN ⇒ category · EMPLOYEE_BALANCE ⇒ receivable kind · CASH_MOVEMENT ⇒ ဘာမှ
ALTER TABLE cash_out_reasons ADD CONSTRAINT cash_out_reasons_type_fields_chk CHECK (
  (accounting_type IN (1, 4) AND expense_category_id IS NOT NULL AND receivable_kind IS NULL)
  OR (accounting_type = 2 AND receivable_kind IS NOT NULL AND receivable_kind IN (1, 2) AND expense_category_id IS NULL)
  OR (accounting_type = 3 AND expense_category_id IS NULL AND receivable_kind IS NULL)
);
CREATE UNIQUE INDEX cash_out_reasons_name_active ON cash_out_reasons (company_id, name_mm) WHERE archived_at IS NULL;

-- ═══════════ cash_outs (D-FIN-07) ═══════════
ALTER TABLE cash_outs ADD CONSTRAINT cash_outs_type_chk   CHECK (accounting_type IN (1, 2, 3, 4));
ALTER TABLE cash_outs ADD CONSTRAINT cash_outs_amount_chk CHECK (amount > 0);
ALTER TABLE cash_outs ADD CONSTRAINT cash_outs_business_date_chk
  CHECK (business_date = (occurred_at AT TIME ZONE 'Asia/Yangon')::date);
-- Type ⇔ field: MUST_RETURN ⇒ ယူသူ (user / name) · EMPLOYEE_BALANCE ⇒ employee · တခြား ⇒ မရှိ
ALTER TABLE cash_outs ADD CONSTRAINT cash_outs_type_fields_chk CHECK (
  (accounting_type = 4 AND (taken_by_user_id IS NOT NULL OR (taken_by_name IS NOT NULL AND btrim(taken_by_name) <> '')) AND employee_id IS NULL)
  OR (accounting_type = 2 AND employee_id IS NOT NULL AND taken_by_user_id IS NULL AND taken_by_name IS NULL
      AND expected_return_date IS NULL AND converted_expense_at IS NULL AND settled_at IS NULL)
  OR (accounting_type IN (1, 3) AND employee_id IS NULL AND taken_by_user_id IS NULL AND taken_by_name IS NULL
      AND expected_return_date IS NULL AND converted_expense_at IS NULL AND settled_at IS NULL)
);

-- ═══════════ cash_returns (D-FIN-09) ═══════════
ALTER TABLE cash_returns ADD CONSTRAINT cash_returns_amount_chk CHECK (amount > 0);
ALTER TABLE cash_returns ADD CONSTRAINT cash_returns_business_date_chk
  CHECK (business_date = (returned_at AT TIME ZONE 'Asia/Yangon')::date);

-- ═══════════ daily_closings (D-FIN-06 v5.1) ═══════════
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_status_chk CHECK (status IN (1, 2));
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_amounts_chk CHECK (
  opening_cash_amount >= 0 AND cash_sales_amount >= 0 AND cash_refunds_amount >= 0 AND cash_outs_amount >= 0
  AND cash_returns_amount >= 0 AND cash_manual_incomes_amount >= 0 AND noncash_expected_amount >= 0 AND noncash_verified_amount >= 0
  AND noncash_verified_amount <= noncash_expected_amount AND unverified_payment_count >= 0
  AND (counted_cash_amount IS NULL OR counted_cash_amount >= 0)
);
-- REC-17: expected = opening + sales − refunds − outs + returns + manual income
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_expected_chk CHECK (
  expected_cash_amount = opening_cash_amount + cash_sales_amount - cash_refunds_amount - cash_outs_amount + cash_returns_amount + cash_manual_incomes_amount
);
ALTER TABLE daily_closings ADD COLUMN cash_difference_amount bigint
  GENERATED ALWAYS AS (counted_cash_amount - expected_cash_amount) STORED;
-- Opening ≠ မနေ့ counted ⇒ reason (OPEN-05 A)
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_opening_chk CHECK (
  previous_closing_counted_amount IS NULL
  OR previous_closing_counted_amount = opening_cash_amount
  OR (opening_difference_reason IS NOT NULL AND btrim(opening_difference_reason) <> '')
);
-- CLOSED ⇒ counted + by + at · difference ≠ 0 ⇒ reason · unverified > 0 ⇒ reason (D-PAY-02 v5.1)
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_status_fields_chk CHECK (
  (status = 1 AND closed_at IS NULL AND closed_by_user_id IS NULL)
  OR (status = 2 AND closed_at IS NOT NULL AND closed_by_user_id IS NOT NULL AND counted_cash_amount IS NOT NULL
      AND (counted_cash_amount = expected_cash_amount OR (cash_difference_reason IS NOT NULL AND btrim(cash_difference_reason) <> ''))
      AND (unverified_payment_count = 0 OR (unverified_reason IS NOT NULL AND btrim(unverified_reason) <> '')))
);
ALTER TABLE daily_closings ADD CONSTRAINT daily_closings_reopen_chk CHECK (
  (reopen_count = 0 AND last_reopened_at IS NULL AND last_reopen_reason IS NULL)
  OR (reopen_count > 0 AND last_reopened_at IS NOT NULL AND last_reopened_by_user_id IS NOT NULL AND last_reopen_reason IS NOT NULL AND btrim(last_reopen_reason) <> '')
);

-- ═══════════ App / Part 8 trigger က စစ်ရမယ့်ဟာ (cross-table) ═══════════
-- · cash_out.accounting_type = reason.accounting_type (snapshot) · EXPENSE ⇒ expenses (source 2, category = reason.category) same tx · EMPLOYEE_BALANCE ⇒ employee_receivables (kind = reason.receivable_kind, cash_out_id)
-- · cash_return.cash_out = MUST_RETURN · Σ returns ≤ amount · Σ = amount ⇒ settled_at · မူလ converted ⇒ expenses REVERSAL (source 6, −amount, category တူ, original = source 5 expense)
-- · လကုန် job: MUST_RETURN outstanding (settled ✖) ⇒ expenses source 5 (expense_date = လကုန်) + converted_expense_at
-- · payroll FINALIZE ⇒ allocation တိုင်း expenses source 3 (category SALARY, amount = allocated_gross, expense_date = period_end) · purchase POSTED ⇒ (purchase, branch) တိုင်း source 4 (category PRODUCT_PURCHASE)
-- · MANUAL admin ⇒ APPROVED (approved_by = self) · non-admin ⇒ PENDING → noti approver · APPROVED ပြင် ✖ (delete + အသစ်)
-- · daily_closing snapshot column = CLOSE ချိန် တွက် (payments is_cash / non-cash, refunds, cash_outs, cash_returns, manual_incomes cash APPROVED — branch + business_date) · previous_closing_counted = မနေ့ CLOSED counted
-- · CLOSED ⇒ ဒီ branch-date: late entry / cash out / cash return / payment verify / manual income ✖ — reopen (admin) မှ · |difference| > tolerance setting ⇒ admin noti
-- · manual_incomes cash ⇒ branch_id NOT NULL (drawer) · P&L view: revenue (sales FINISHED SERVICE / PRODUCT / TRANSPORT lines) + manual_incomes − expenses (reversal −) by branch / company-wide
```

### 6.4h Part 8 — System / Website (🔒 v1 — နောက်ဆုံး part)

**Source:** 🔒 D-PLT-16 (REC-33), D-PLT-07, D-AUD-01 / 02, D-NTF-01..03, D-DAT-01..05, D-ROLE-08, D-WEB-01..04 (OPEN-21 → toggle / data), D-FIN-03 / D-EMP-03 (attachments) · **Status:** 🔒 **LOCK (30/Sep နေ့လယ်) — D-DB-12 = v1 · DB design ၈ part အကုန် ပြီး** · `@dbml/core` parse OK (Part 1–8 တွဲ — **table ၉၁ ခု**) · PostgreSQL 16 load + **test ၄၅/၄၅ PASS** · **Part 3–8 test ၂၉၆ ခု full schema + audit trigger ပေါ် — အကုန် PASS** · F-P8-01..09 approve

ဖိုင်: `db/part8-system-website-v1.1.dbml` (*v5.2.15: v1.1 — G e, §6.4i; အောက်က DBML = v1 စာသား*), `db/part8-system-website-v1-constraints.sql`, `db/part8-system-website-v1-test.sql` · Part 1 → `v3.2` · Part 2 → `v1.2` (website column)

**Table ၁၂ ခု:** `settings` · `settings_history` · `audit_events` · `notification_types` · `notifications` · `attachments` · `import_jobs` · `import_job_rows` · `import_source_refs` · `backup_runs` · `branch_opening_hours` · `branch_closures` · **+ column:** branches (is_public, map_url) · employees (public_profile, public_specialty_mm / _en) · services (show_on_website, public_description_mm / _en, image_attachment_id) · **site content = settings `site.*`**

**Test (PostgreSQL 16):** setting key ပုံစံ ✖ · key တူ ✖ · branch override ✅ · **history auto (trigger) ✅** / UPDATE ✖ · audit UPDATE / DELETE ✖ · **sale INSERT → audit row (actor = app.user_id, branch) ✅** · UPDATE before / after ✅ · job (user မရှိ) actor NULL ✅ · mandatory type disable ✖ · code တူ ✖ · unread count ✅ · attachment size 0 ✖ · service ပုံ FK ✅ / မရှိ ✖ · storage key တူ ✖ · import confirm ⇐ validate ✖ · count မကိုက် ✖ · row ERROR errors ✖ / ✅ · row တူ ✖ · Fresha id ၂ ခါ ✖ · backup FAILED message ✖ · RESTORE reason ✖ · DAILY + by ✖ · opening hours အချိန် ✖ / ✅ / ထပ် ✖ / closes ≤ opens ✖ · သင်္ကြန် ပိတ် ✅ / ထပ် ✖ · Part 1 v3.2 default (is_public true / public_profile false) ✅ · site.show_prices setting ✅

**v1 design finding F-P8-01..09 — ✅ approve (D-DB-12)**

| ID | အကြံ | ဘာကြောင့် |
| --- | --- | --- |
| F-P8-01 | `settings` (company / branch scope, key regex, jsonb) + `settings_history` **trigger auto** (INSERT / value ပြောင်းတိုင်း); key list / type / default = `settings.json` (DB မှာ default မသိမ်း) | 🔒 D-PLT-16 · history app က မမေ့ |
| F-P8-02 | `audit_events` append-only (trigger + app role INSERT / SELECT ပဲ) · **ငွေ table ၁၈ ခု row trigger** (source 2, before / after jsonb, actor = `SET LOCAL app.user_id`) · app interceptor = source 1 (action + reason) — ငွေ table မှာ row ၂ ကြောင်း ဖြစ်နိုင် (request_id နဲ့ တွဲ) · retention V1 = မဖျက် (partition ⏭) | 🔒 D-AUD-01 / 02 · trigger က app bug / migration ကျော်လည်း မှတ် |
| F-P8-03 | `notification_types` company အလိုက် (code = `notifications.json` sync) · admin = enabled ✔ / ✖ ပဲ · mandatory ⇒ enabled CHECK · recipient rule ၄ မျိုး | 🔒 D-NTF-03 |
| F-P8-04 | `notifications` = `template_key` + `payload` (စာသား DB မသိမ်း — user ဘာသာ render) · 90 ရက် = **hard delete job** (D-DAT-05 ချွင်းချက် — transactional မဟုတ်) · unread partial index | 🔒 D-NTF-01 / 02 · D-PLT-03 |
| F-P8-05 | `attachments` polymorphic (entity_type / entity_id — FK ✖, app စစ်) · `storage_key` unique (signed URL app ထုတ်) · `services.image_attachment_id` ကတော့ FK | D-FIN-03 / D-EMP-03 / website ပုံ — table ၁ ခုနဲ့ ပြီး |
| F-P8-06 | `backup_runs` log — kind DAILY / WEEKLY / RESTORE_TEST / RESTORE (by + reason CHECK) · FAILED ⇒ noti | 🔒 D-DAT-03 / 04 · restore audit |
| F-P8-07 | **Website (OPEN-21 → data):** `branch_opening_hours` (ပြဖို့ပဲ — availability = shifts) · `branch_closures` (EXCLUDE) · Part 1 v3.2 column (branches.is_public / map_url · employees.public_profile **default OFF** / specialty) · Part 2 v1.2 (services.show_on_website / public_description / image) · site content = settings `site.*` (show_prices, hero, announcement, seo) | D-WEB-01 / 04 · ပိုင်ရှင်အဖြေ = toggle · Part 1b precedent (locked table မှာ column ထပ်ဖြည့်) |
| F-P8-08 | Import = `import_jobs` (status flow CHECK) + `import_job_rows` (raw jsonb, error key) + `import_source_refs` (source, entity, source_id unique — re-import SKIPPED) | 🔒 D-DAT-01 · §6.1 #4 fresha_id core table ✖ · REC-30 |
| F-P8-09 | REC-33 ရဲ့ `idempotency_keys` / `document_sequences` generic table ✖ — Part 4–7 ရဲ့ `client_request_id` unique + `receipt_counters` က လုံလောက်; outbox table ✖ (pg-boss) | table မထပ် |

**App / job (SQL ဖိုင် အောက်ဆုံး):** deploy sync (permissions / notifications / settings json) · `SET LOCAL app.user_id` request တိုင်း · recipient resolve + realtime push · 90 ရက် cleanup · storage cleanup · import flow · backup job + retention · site revalidate (§5.8)

```dbml
// Point Barbershop — Part 8: System / Website · v1 🔒 D-DB-12 (30/Sep/2026) — နောက်ဆုံး part · DB design ပြီး (Part 1–8 = table ၉၁)
// Part 1–7 ပေါ်မှာ ဆောက် — dbdiagram မှာ part1–7 နဲ့ တွဲ paste (Part 1 v3.2 · Part 2 v1.2 = website column ထပ်ဖြည့်)
// 🔒 D-PLT-16 (settings store), D-PLT-07, D-AUD-01 / 02, D-NTF-01..03, D-DAT-01..05, D-ROLE-08 (permissions sync — Part 1 table), D-WEB-01..04 (OPEN-21 → toggle / data),
//    D-FIN-03 / D-EMP-03 (attachments), D-PLT-03 (MM / EN), D-ORG-03, D-DB-01 / 03 / 04, D-PLT-15
// Status / type = smallint + CHECK (D-DB-03) · CHECK / partial unique / trigger / FK = part8-system-website-v1-constraints.sql
// F-P8-nn = review finding (§6.4h) — D-DB-12 နဲ့ approve ပြီး
// Job (pg-boss — REC-31): shift ထုတ် (Part 2) · attendance exception detect (Part 5) · လကုန် must-return (Part 7) · notification 90 ရက် cleanup · backup · site revalidate (§5.8) · permissions / settings / notification_types sync (deploy)

// ───────────────────────── Settings (🔒 D-PLT-16) ─────────────────────────

Table settings {
  id uuid [pk, note: 'UUIDv7']
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  branch_id uuid [ref: > branches.id, note: 'NULL = company scope · ဖြည့် = branch override (key က settings.json မှာ scope: branch ခွင့်ပြုမှ — app)']
  key varchar(100) [not null, note: 'settings.json key — ဥပမာ booking.slot_interval_minutes · code ထဲ constant (typo = build error)']
  value jsonb [not null, note: 'Type = settings.json (number / boolean / time / choice / text_mm_en / json) · validation app']
  updated_by_user_id uuid [not null, ref: > users.id]
  updated_at timestamptz [not null, default: `now()`]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, key)
  }

  Note: '''
  🔒 D-PLT-16 — key-value store · (company, branch, key) unique (COALESCE partial — SQL) · row မရှိ = settings.json default
  Read = branch override → company → default · Snapshot (payroll rules_snapshot, closing) = value copy
  Key list (Part 2–8 setting comment တွေ စု): booking.* · schedule.* · home_service.* · leave.* · sales.* · payroll.* · attendance.* · closing.* · stock.* · site.* (hero / cover / announcement / seo / show_prices)
  '''
}

Table settings_history {
  id uuid [pk]
  setting_id uuid [not null, ref: > settings.id]
  old_value jsonb [note: 'NULL = row အသစ် (default ကနေ ပထမ ပြောင်း)']
  new_value jsonb [not null]
  changed_by_user_id uuid [not null, ref: > users.id]
  changed_at timestamptz [not null, default: `now()`]

  Indexes {
    (setting_id, changed_at)
  }

  Note: 'ပြောင်းတိုင်း row ၁ ခု (append-only — trigger) · "tolerance ကို ဘယ်သူ ဘယ်တော့ ပြောင်းလဲ" (D-PLT-16)'
}

// ───────────────────────── Audit (🔒 D-AUD-01 / 02) ─────────────────────────

Table audit_events {
  id uuid [pk, note: 'UUIDv7 (app) · trigger ကနေ = gen_random_uuid()']
  occurred_at timestamptz [not null, default: `now()`]
  actor_user_id uuid [ref: > users.id, note: 'NULL = system job / DB trigger without app context']
  actor_session_id uuid [ref: > user_sessions.id, note: 'D-AUD-01 device — user_sessions.device_label ကနေ']
  source smallint [not null, note: '1 APP (interceptor) · 2 DB_TRIGGER (ငွေ table auto — D-AUD-02) · 3 SYSTEM_JOB']
  action varchar(50) [not null, note: 'INSERT · UPDATE · DELETE (trigger) · app: booking.cancel, sale.finish, payroll.finalize, closing.reopen, login.success / login.failed (D-AUTH), … (permission code ပုံစံ)']
  entity_type varchar(60) [not null, note: 'table နာမည် (ဥပမာ sales)']
  entity_id uuid [note: 'row id (login event ဆို user id)']
  branch_id uuid [ref: > branches.id, note: 'D-AUD-01 manager scope filter — row ရဲ့ branch_id (ရှိရင်)']
  before_data jsonb [note: 'UPDATE / DELETE — row အဟောင်း (D-AUD-01 before)']
  after_data jsonb [note: 'INSERT / UPDATE — row အသစ်']
  reason text [note: 'App ပေးတဲ့ reason (cancel / override / reopen …) — row ရဲ့ reason column နဲ့ ထပ်ရင် ဒီမှာလည်း copy']
  request_id uuid [note: 'App request correlation (client_request_id / trace)']

  Indexes {
    (entity_type, entity_id, occurred_at)
    (actor_user_id, occurred_at)
    (branch_id, occurred_at)
    (occurred_at)
  }

  Note: '''
  🔒 D-AUD-02 — **append-only**: UPDATE / DELETE ✖ (trigger) + app DB role = INSERT / SELECT ပဲ (GRANT — SQL) · admin လည်း ပြင်မရ
  🔒 D-AUD-02 — ငွေ table ~၁၄ ခုမှာ row trigger → ဒီ table (source 2): sales, sale_items, payments, refunds, refund_items, sale_adjustments, discount_requests, cash_outs, cash_returns, expenses, manual_incomes, daily_closings, payroll_runs, payroll_entries, payroll_lines, employee_receivables, employee_receivable_repayments, commission_results
  actor = current_setting('app.user_id') (app က transaction တိုင်း SET LOCAL) — မရှိရင် NULL (job)
  🔒 D-AUD-01 — admin အကုန် · manager = assigned branch (branch_id filter) · barber ✖ · app မှာ ကြည့်ရုံ
  Login event (D-AUTH-05) = source 1, action login.* · System error ≠ audit (REC-38 monitoring သီးသန့်)
  F-P8-02 — retention: V1 မဖျက် (D-DAT-05) · partition by month ⏭ (data ကြီးလာမှ)
  '''
}

// ───────────────────────── Notifications (🔒 D-NTF-01..03) ─────────────────────────

Table notification_types {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03 — company အလိုက် enabled']
  code varchar(80) [not null, note: 'notifications.json key (code sync — D-ROLE-08 ပုံစံ) — ဥပမာ booking.new, booking.cancelled, leave.requested, discount.requested, low_stock, closing.difference, payslip.published, login.new_device, account.deactivated']
  category smallint [not null, note: '1 BOOKING · 2 STAFF (leave / attendance) · 3 MONEY (discount / closing / cash out) · 4 STOCK · 5 PAYROLL · 6 SECURITY']
  is_mandatory boolean [not null, default: false, note: 'D-NTF-03 — security / payslip / deactivation = true (admin ပိတ် ✖ — CHECK enabled)']
  enabled boolean [not null, default: true, note: 'Admin ထိန်း (D-NTF-03) · mandatory ⇒ true']
  default_recipient_rule smallint [not null, note: '1 ADMINS (ငွေ / ပစ္စည်း — D-NTF-03) · 2 BRANCH_MANAGERS · 3 TARGET_USER (payslip / login / leave decision) · 4 BRANCH_STAFF (transfer receive)']
  archived_at timestamptz [note: 'notifications.json ကဖြုတ် = archive']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, code) [unique]
  }

  Note: 'Type list = code (notifications.json) → DB sync · admin = enabled ✔ / ✖ ပဲ · F-P8-03'
}

Table notifications {
  id uuid [pk]
  user_id uuid [not null, ref: > users.id, note: 'လက်ခံသူ']
  notification_type_id uuid [not null, ref: > notification_types.id]
  template_key varchar(100) [not null, note: 'Language file key — user ရဲ့ ဘာသာအတိုင်း render (D-PLT-03) · စာသား DB မသိမ်း']
  payload jsonb [not null, default: `'{}'`, note: 'Template parameter (customer name, amount, ရက် …)']
  link_path varchar(300) [note: 'Deep link (D-NTF-01) — ဥပမာ /bookings/<id>']
  entity_type varchar(60) [note: 'Dedupe / group — ဥပမာ bookings']
  entity_id uuid
  branch_id uuid [ref: > branches.id]
  created_at timestamptz [not null, default: `now()`]
  read_at timestamptz [note: 'Bell unread = read_at IS NULL (D-NTF-01) · mark all = UPDATE']
  deleted_at timestamptz [note: 'User က ကိုယ့်ဟာ ဖျက် (D-NTF-02) — soft']

  Indexes {
    (user_id, created_at)
  }

  Note: '''
  🔒 D-NTF-01 in-app realtime (WebSocket / SSE push = app) · bell + unread count (partial index — SQL) + mark all + deep link
  🔒 D-NTF-02 — 90 ရက် history: job က created_at < now − 90d ကို hard delete (F-P8-04 — transactional data မဟုတ်၊ D-DAT-05 ချွင်းချက်)
  '''
}

// ───────────────────────── Attachments (D-FIN-03, D-EMP-03) ─────────────────────────

Table attachments {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  entity_type varchar(60) [not null, note: 'expenses · employees (document — D-EMP-03) · manual_incomes · services (website ပုံ) · site (cover / share ပုံ) · import_jobs (ဖိုင်)']
  entity_id uuid [not null]
  kind smallint [not null, default: 1, note: '1 DOCUMENT (receipt / ID / contract) · 2 IMAGE · 3 IMPORT_FILE']
  storage_key varchar(500) [not null, unique, note: 'Object storage path (S3-compatible / local) — URL မသိမ်း (signed URL app ထုတ်)']
  file_name varchar(255) [not null, note: 'မူလ ဖိုင်နာမည်']
  mime_type varchar(100) [not null]
  size_bytes bigint [not null, note: '> 0 · max = setting']
  uploaded_by_user_id uuid [not null, ref: > users.id]
  uploaded_at timestamptz [not null, default: `now()`]
  deleted_at timestamptz [note: 'Soft delete — storage cleanup job']
  deleted_by_user_id uuid [ref: > users.id]

  Indexes {
    (entity_type, entity_id)
  }

  Note: 'F-P8-05 — polymorphic (entity_type / entity_id — FK ✖, app စစ်) · services.image_attachment_id ကတော့ FK (SQL) · permission = entity ရဲ့ permission အတိုင်း'
}

// ───────────────────────── Import (🔒 D-DAT-01, §6.1 #4) ─────────────────────────

Table import_jobs {
  id uuid [pk]
  company_id uuid [not null, ref: > companies.id, note: 'D-ORG-03']
  source smallint [not null, note: '1 FRESHA_EXPORT (CSV — REC-30 master data ပဲ) · 2 TEMPLATE (ဆိုင်ရဲ့ Excel / CSV template)']
  entity_type varchar(60) [not null, note: 'customers · services · products · employees … (master data — REC-30)']
  file_attachment_id uuid [not null, ref: > attachments.id, note: 'Upload ဖိုင် (kind 3)']
  status smallint [not null, default: 1, note: '0 CANCELLED · 1 UPLOADED · 2 VALIDATED (preview) · 3 CONFIRMED (import ပြီး) · 4 FAILED (D-DAT-01 flow)']
  total_rows integer [not null, default: 0]
  valid_rows integer [not null, default: 0]
  error_rows integer [not null, default: 0]
  imported_rows integer [not null, default: 0]
  options jsonb [note: 'Column mapping / duplicate rule (ဖုန်းတူ = ပြန်သုံး — D-CUS-02)']
  error_message text [note: 'FAILED']
  created_by_user_id uuid [not null, ref: > users.id]
  validated_at timestamptz
  confirmed_at timestamptz
  confirmed_by_user_id uuid [ref: > users.id]
  cancelled_at timestamptz
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (company_id, created_at)
  }

  Note: '🔒 D-DAT-01 upload → validate → preview → confirm → audit (audit_events source 1, action import.confirm) · status ⇔ timestamp (CHECK)'
}

Table import_job_rows {
  id uuid [pk]
  import_job_id uuid [not null, ref: > import_jobs.id]
  row_number integer [not null, note: 'ဖိုင်ထဲ row (1 = ပထမ data row)']
  raw_data jsonb [not null, note: 'Column → value']
  status smallint [not null, default: 1, note: '1 PENDING · 2 VALID · 3 ERROR · 4 IMPORTED · 5 SKIPPED (duplicate — ရှိပြီးသား entity ချိတ်)']
  errors jsonb [note: 'ERROR ⇒ [{column, message_key}] (language file key)']
  entity_id uuid [note: 'IMPORTED / SKIPPED ⇒ ဖန်တီး / ချိတ်တဲ့ row id']
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (import_job_id, row_number) [unique]
    (import_job_id, status)
  }
}

Table import_source_refs {
  id uuid [pk]
  source smallint [not null, note: '1 FRESHA · 2 TEMPLATE (§6.1 #4 — fresha_id core table မှာ မထား)']
  source_id varchar(200) [not null, note: 'Fresha id / export row key']
  entity_type varchar(60) [not null]
  entity_id uuid [not null]
  import_job_id uuid [ref: > import_jobs.id]
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (source, entity_type, source_id) [unique, note: 'Source id ၁ ခု entity ၁ ခု — re-import = SKIPPED']
    (entity_type, entity_id)
  }

  Note: '🔒 D-DB-01 / §6.1 #4 — vendor id ကို သီးသန့် table · migration ပြီးရင် reference ပဲ (REC-30)'
}

// ───────────────────────── Backup (🔒 D-DAT-03 / 04) ─────────────────────────

Table backup_runs {
  id uuid [pk]
  kind smallint [not null, note: '1 DAILY (၃၀ ရက် သိမ်း) · 2 WEEKLY (၁ နှစ်) · 3 RESTORE_TEST (လစဉ်) · 4 RESTORE (တကယ် ပြန်သွင်း — D-DAT-04)']
  status smallint [not null, default: 1, note: '1 RUNNING · 2 SUCCESS · 3 FAILED']
  started_at timestamptz [not null, default: `now()`]
  finished_at timestamptz
  size_bytes bigint
  location varchar(500) [note: 'Off-site copy path / bucket key (D-DAT-03)']
  checksum varchar(128)
  error_message text [note: 'FAILED ⇒ + admin noti (D-DAT-03 failure → notify)']
  performed_by_user_id uuid [ref: > users.id, note: 'RESTORE / RESTORE_TEST ⇒ authorized user (D-DAT-04) · DAILY / WEEKLY = NULL (job)']
  reason text [note: 'RESTORE ⇒ မဖြစ်မနေ (D-DAT-04 audit)']
  notified_at timestamptz
  created_at timestamptz [not null, default: `now()`]

  Indexes {
    (kind, started_at)
  }

  Note: '🔒 D-DAT-03 log · retention (၃၀ ရက် / ၁ နှစ်) = job က backup ဖိုင် ဖျက်၊ row ကျန် · RESTORE = record တစ်ခုမှား ပြင်ဖို့ ✖ (D-DAT-04) · F-P8-06'
}

// ───────────────────────── Website (D-WEB-01 / 04 — OPEN-21 → toggle / data) ─────────────────────────

Table branch_opening_hours {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  day_of_week smallint [not null, note: '1 Mon … 7 Sun (ISO — schedule_patterns ပုံစံတူ)']
  is_closed boolean [not null, default: false, note: 'true = ဒီနေ့ ပိတ် (ဥပမာ တနင်္လာ)']
  opens_at time [note: 'MMT — is_closed = false ⇒ မဖြစ်မနေ (CHECK)']
  closes_at time [note: '> opens_at']
  updated_by_user_id uuid [not null, ref: > users.id]
  updated_at timestamptz [not null, default: `now()`]

  Indexes {
    (branch_id, day_of_week) [unique]
  }

  Note: '''
  🔒 D-WEB-04 (design — OPEN-21 data) — website "ဒီနေ့ ဖွင့်ချိန် / ယခုဖွင့်ထား" · receipt footer
  Booking availability ကတော့ schedule_shifts (D-BKG-04) — ဒီ table မဟုတ် · F-P8-07
  Permission website.branch_manage (branch scope — D-ROLE-05) = manager ကိုယ့် branch ပဲ
  '''
}

Table branch_closures {
  id uuid [pk]
  branch_id uuid [not null, ref: > branches.id]
  start_date date [not null, note: 'MMT']
  end_date date [not null, note: '≥ start']
  notice_mm varchar(300) [not null, note: 'Website notice — ဥပမာ သင်္ကြန် ပိတ် (D-DB-04)']
  notice_en varchar(300)
  created_by_user_id uuid [not null, ref: > users.id]
  created_at timestamptz [not null, default: `now()`]
  updated_at timestamptz [not null, default: `now()`]
  archived_at timestamptz [note: 'ဖျက် = archive']

  Note: '''
  🔒 D-WEB-04 ယာယီပိတ်ရက် — website banner + /book မှာ အဲ့ရက် branch ရွေး ✖ (app) · ရက် ထပ် ✖ (EXCLUDE — SQL)
  Staff schedule / leave ကို မထိ (admin က shift ကိုယ်တိုင် ဖြုတ်) — F-P8-07
  '''
}

// ── Site content = settings store (site.* keys — table မလို) ──
// site.hero_title (text_mm_en) · site.hero_subtitle · site.cover_attachment_id · site.share_image_attachment_id · site.seo_title · site.seo_description
// site.announcement (json: {text_mm, text_en, start_date, end_date}) · site.show_prices (boolean — OPEN-21) · site.show_barbers (boolean, default false) · site.domain (text — deployment)
// Permission: website.manage (admin — site.* + branch public) · website.branch_manage (branch scope — hours / closures) · settings.manage (admin) · audit.view (admin / manager scope) · notification.manage · import.run · backup.view · backup.restore (admin)
```

```sql
-- Point Barbershop — Part 8 v1 (🔒 D-DB-12) · System / Website · DBML မှာ ရေးလို့မရတဲ့ constraint + audit trigger
-- Part 1 v3.2 / Part 2 v1.2 website column = DBML ထဲ · FK ဒီမှာ

-- ═══════════ Part 2 v1.2 future FK ═══════════
ALTER TABLE services ADD CONSTRAINT services_image_attachment_fk FOREIGN KEY (image_attachment_id) REFERENCES attachments (id);

-- ═══════════ settings (D-PLT-16) ═══════════
ALTER TABLE settings ADD CONSTRAINT settings_key_chk CHECK (key ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)+$');   -- ဥပမာ booking.slot_interval_minutes
CREATE UNIQUE INDEX settings_scope_key_uq
  ON settings (company_id, (COALESCE(branch_id, '00000000-0000-0000-0000-000000000000'::uuid)), key);
-- History append-only
CREATE FUNCTION append_only_guard() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN RAISE EXCEPTION '% is append-only', TG_TABLE_NAME; END $$;
CREATE TRIGGER settings_history_append_only BEFORE UPDATE OR DELETE ON settings_history
  FOR EACH ROW EXECUTE FUNCTION append_only_guard();
-- settings ပြောင်းတိုင်း history auto (D-PLT-16)
CREATE FUNCTION settings_record_history() RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO settings_history (id, setting_id, old_value, new_value, changed_by_user_id)
    VALUES (gen_random_uuid(), NEW.id, NULL, NEW.value, NEW.updated_by_user_id);
  ELSIF NEW.value IS DISTINCT FROM OLD.value THEN
    INSERT INTO settings_history (id, setting_id, old_value, new_value, changed_by_user_id)
    VALUES (gen_random_uuid(), NEW.id, OLD.value, NEW.value, NEW.updated_by_user_id);
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER settings_history_trg AFTER INSERT OR UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION settings_record_history();

-- ═══════════ audit_events (D-AUD-01 / 02) ═══════════
ALTER TABLE audit_events ADD CONSTRAINT audit_events_source_chk CHECK (source IN (1, 2, 3));
ALTER TABLE audit_events ADD CONSTRAINT audit_events_action_chk CHECK (btrim(action) <> '');
CREATE TRIGGER audit_events_append_only BEFORE UPDATE OR DELETE ON audit_events
  FOR EACH ROW EXECUTE FUNCTION append_only_guard();
-- App DB role: audit ပေါ် INSERT + SELECT ပဲ (D-AUD-02) — deploy script မှာ:
--   REVOKE UPDATE, DELETE, TRUNCATE ON audit_events FROM point_app;  GRANT SELECT, INSERT ON audit_events TO point_app;

-- ငွေ table row trigger → audit_events (source 2) · actor = current_setting('app.user_id') (app: SET LOCAL app.user_id = '<uuid>')
CREATE FUNCTION audit_row_change() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_actor uuid;
  v_branch uuid;
  v_row jsonb;
BEGIN
  BEGIN
    v_actor := NULLIF(current_setting('app.user_id', true), '')::uuid;
  EXCEPTION WHEN others THEN v_actor := NULL;
  END;
  v_row := CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END;
  IF v_row ? 'branch_id' THEN v_branch := (v_row ->> 'branch_id')::uuid; END IF;
  INSERT INTO audit_events (id, occurred_at, actor_user_id, source, action, entity_type, entity_id, branch_id, before_data, after_data, request_id)
  VALUES (
    gen_random_uuid(), now(), v_actor, 2, TG_OP, TG_TABLE_NAME,
    (v_row ->> 'id')::uuid, v_branch,
    CASE WHEN TG_OP IN ('UPDATE', 'DELETE') THEN to_jsonb(OLD) END,
    CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN to_jsonb(NEW) END,
    NULLIF(current_setting('app.request_id', true), '')::uuid
  );
  RETURN NULL;
END $$;
-- ငွေ table ၁၈ ခု (D-AUD-02 "table အတိအကျ = part design ချိန်")
CREATE TRIGGER audit_sales                 AFTER INSERT OR UPDATE OR DELETE ON sales                          FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_sale_items            AFTER INSERT OR UPDATE OR DELETE ON sale_items                     FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_payments              AFTER INSERT OR UPDATE OR DELETE ON payments                       FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_refunds               AFTER INSERT OR UPDATE OR DELETE ON refunds                        FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_refund_items          AFTER INSERT OR UPDATE OR DELETE ON refund_items                   FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_sale_adjustments      AFTER INSERT OR UPDATE OR DELETE ON sale_adjustments               FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_discount_requests     AFTER INSERT OR UPDATE OR DELETE ON discount_requests              FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_cash_outs             AFTER INSERT OR UPDATE OR DELETE ON cash_outs                      FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_cash_returns          AFTER INSERT OR UPDATE OR DELETE ON cash_returns                   FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_expenses              AFTER INSERT OR UPDATE OR DELETE ON expenses                       FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_manual_incomes        AFTER INSERT OR UPDATE OR DELETE ON manual_incomes                 FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_daily_closings        AFTER INSERT OR UPDATE OR DELETE ON daily_closings                 FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_payroll_runs          AFTER INSERT OR UPDATE OR DELETE ON payroll_runs                   FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_payroll_entries       AFTER INSERT OR UPDATE OR DELETE ON payroll_entries                FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_payroll_lines         AFTER INSERT OR UPDATE OR DELETE ON payroll_lines                  FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_employee_receivables  AFTER INSERT OR UPDATE OR DELETE ON employee_receivables           FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_receivable_repayments AFTER INSERT OR UPDATE OR DELETE ON employee_receivable_repayments FOR EACH ROW EXECUTE FUNCTION audit_row_change();
CREATE TRIGGER audit_commission_results    AFTER INSERT OR UPDATE OR DELETE ON commission_results             FOR EACH ROW EXECUTE FUNCTION audit_row_change();

-- ═══════════ notifications (D-NTF-01..03) ═══════════
ALTER TABLE notification_types ADD CONSTRAINT notification_types_category_chk  CHECK (category BETWEEN 1 AND 6);
ALTER TABLE notification_types ADD CONSTRAINT notification_types_recipient_chk CHECK (default_recipient_rule IN (1, 2, 3, 4));
ALTER TABLE notification_types ADD CONSTRAINT notification_types_code_chk CHECK (code ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*)*$');
-- D-NTF-03: mandatory ⇒ admin ပိတ် ✖
ALTER TABLE notification_types ADD CONSTRAINT notification_types_mandatory_chk CHECK (NOT is_mandatory OR enabled);
-- Bell unread count (D-NTF-01)
CREATE INDEX notifications_unread ON notifications (user_id) WHERE read_at IS NULL AND deleted_at IS NULL;
-- 90 ရက် cleanup job (D-NTF-02)
CREATE INDEX notifications_created ON notifications (created_at);

-- ═══════════ attachments ═══════════
ALTER TABLE attachments ADD CONSTRAINT attachments_kind_chk CHECK (kind IN (1, 2, 3));
ALTER TABLE attachments ADD CONSTRAINT attachments_size_chk CHECK (size_bytes > 0);
ALTER TABLE attachments ADD CONSTRAINT attachments_deleted_chk CHECK ((deleted_at IS NULL) = (deleted_by_user_id IS NULL));

-- ═══════════ import (D-DAT-01) ═══════════
ALTER TABLE import_jobs ADD CONSTRAINT import_jobs_source_chk CHECK (source IN (1, 2));
ALTER TABLE import_jobs ADD CONSTRAINT import_jobs_status_chk CHECK (status IN (0, 1, 2, 3, 4));
ALTER TABLE import_jobs ADD CONSTRAINT import_jobs_counts_chk
  CHECK (total_rows >= 0 AND valid_rows >= 0 AND error_rows >= 0 AND imported_rows >= 0 AND valid_rows + error_rows <= total_rows AND imported_rows <= valid_rows);
-- upload → validate → preview → confirm (D-DAT-01) · CANCELLED / FAILED ⇒ confirm ✖
ALTER TABLE import_jobs ADD CONSTRAINT import_jobs_status_fields_chk CHECK (
  (status = 1 AND validated_at IS NULL AND confirmed_at IS NULL AND cancelled_at IS NULL)
  OR (status = 2 AND validated_at IS NOT NULL AND confirmed_at IS NULL AND cancelled_at IS NULL)
  OR (status = 3 AND validated_at IS NOT NULL AND confirmed_at IS NOT NULL AND confirmed_by_user_id IS NOT NULL AND cancelled_at IS NULL)
  OR (status = 0 AND cancelled_at IS NOT NULL AND confirmed_at IS NULL)
  OR (status = 4 AND error_message IS NOT NULL AND confirmed_at IS NULL)
);
ALTER TABLE import_job_rows ADD CONSTRAINT import_job_rows_status_chk CHECK (status IN (1, 2, 3, 4, 5));
ALTER TABLE import_job_rows ADD CONSTRAINT import_job_rows_row_chk CHECK (row_number >= 1);
-- ERROR ⇒ errors · IMPORTED / SKIPPED ⇒ entity_id
ALTER TABLE import_job_rows ADD CONSTRAINT import_job_rows_status_fields_chk CHECK (
  (status = 3 AND errors IS NOT NULL) OR (status IN (4, 5) AND entity_id IS NOT NULL) OR (status IN (1, 2) AND entity_id IS NULL)
);
ALTER TABLE import_source_refs ADD CONSTRAINT import_source_refs_source_chk CHECK (source IN (1, 2));
ALTER TABLE import_source_refs ADD CONSTRAINT import_source_refs_id_chk CHECK (btrim(source_id) <> '');

-- ═══════════ backup_runs (D-DAT-03 / 04) ═══════════
ALTER TABLE backup_runs ADD CONSTRAINT backup_runs_kind_chk   CHECK (kind IN (1, 2, 3, 4));
ALTER TABLE backup_runs ADD CONSTRAINT backup_runs_status_chk CHECK (status IN (1, 2, 3));
ALTER TABLE backup_runs ADD CONSTRAINT backup_runs_status_fields_chk CHECK (
  (status = 1 AND finished_at IS NULL)
  OR (status = 2 AND finished_at IS NOT NULL AND finished_at >= started_at AND error_message IS NULL)
  OR (status = 3 AND finished_at IS NOT NULL AND error_message IS NOT NULL AND btrim(error_message) <> '')
);
-- D-DAT-04: RESTORE / RESTORE_TEST ⇒ authorized user · RESTORE ⇒ reason
ALTER TABLE backup_runs ADD CONSTRAINT backup_runs_restore_chk CHECK (
  (kind IN (1, 2) AND performed_by_user_id IS NULL AND reason IS NULL)
  OR (kind = 3 AND performed_by_user_id IS NOT NULL)
  OR (kind = 4 AND performed_by_user_id IS NOT NULL AND reason IS NOT NULL AND btrim(reason) <> '')
);

-- ═══════════ website (D-WEB-04) ═══════════
ALTER TABLE branch_opening_hours ADD CONSTRAINT branch_opening_hours_dow_chk CHECK (day_of_week BETWEEN 1 AND 7);
ALTER TABLE branch_opening_hours ADD CONSTRAINT branch_opening_hours_time_chk CHECK (
  (is_closed AND opens_at IS NULL AND closes_at IS NULL)
  OR (NOT is_closed AND opens_at IS NOT NULL AND closes_at IS NOT NULL AND closes_at > opens_at)
);
ALTER TABLE branch_closures ADD CONSTRAINT branch_closures_dates_chk CHECK (end_date >= start_date);
ALTER TABLE branch_closures ADD CONSTRAINT branch_closures_notice_chk CHECK (btrim(notice_mm) <> '');
-- ရက် ထပ် ✖ (archive ပြီးသား မပါ)
ALTER TABLE branch_closures ADD CONSTRAINT branch_closures_no_overlap
  EXCLUDE USING gist (branch_id WITH =, daterange(start_date, end_date, '[]') WITH &&) WHERE (archived_at IS NULL);

-- ═══════════ App / job က စစ်ရမယ့်ဟာ ═══════════
-- · settings.key ∈ settings.json (type / scope / validation) · branch override = json scope: branch ပဲ · deploy sync: permissions.json / notifications.json / settings.json (default ကို DB မသိမ်း)
-- · app request တိုင်း: SET LOCAL app.user_id, app.request_id (audit actor) · app interceptor = audit_events source 1 (action + reason) — ငွေ table = trigger (source 2) ရော app (reason) ရော ၂ ကြောင်း ဖြစ်နိုင် (request_id နဲ့ တွဲကြည့်)
-- · notification recipient = type.default_recipient_rule + role / branch scope · mandatory type = user ပိတ် ✖ · 90 ရက် cleanup job · realtime push (WS / SSE)
-- · attachments entity_type / entity_id ရှိ (polymorphic) · services.image_attachment_id ⇒ kind 2 · size ≤ setting · storage cleanup job (deleted_at)
-- · import: VALIDATED ⇒ rows status 2 / 3 · CONFIRMED ⇒ valid rows → entity + import_source_refs · duplicate (source_id ရှိပြီး) ⇒ SKIPPED · audit import.confirm
-- · backup job: DAILY / WEEKLY row + retention delete (ဖိုင်) · FAILED ⇒ admin noti (notified_at) · လစဉ် RESTORE_TEST · RESTORE = admin + reason + audit
-- · website: branch_closures ⇒ /book branch ရွေး ✖ · is_public = false ⇒ website မပြ (booking link ကတော့ ရ) · site.* revalidate (§5.8)
```

### 6.4i DB အသေးစား ထပ်ထည့် — G (v5.2.15 · owner one-sheet 02/Oct 00:06 "အကုန် ✔")

**Source:** §0.8 G (a)–(f) · API Part 4–8 ရဲ့ လိုအပ်ချက် · **Status:** 🔒 (D-DB-08 … 12 version bump) · table **၉၁ မပြောင်း** · PostgreSQL 16 full load + **test ၃၅၅ / ၃၅၅ PASS** (Part 3 = ၃၀ · Part 4 = ၈၃ · Part 5 = ၈၅ · Part 6 = ၄၉ · Part 7 = ၅၈ · Part 8 = ၅၀) · `@dbml/core` parse OK · zip v7 (`db/README.md`)။ §6.4d–§6.4h ထဲက DBML စာသားက မူလ version — ပြောင်းတာ အောက်က ဇယားအတိုင်း (ဖိုင်အစစ် = `db/`)။

| Part → version | G | ဘာထည့် | ဘာကြောင့် |
| --- | --- | --- | --- |
| **4** constraints **v1.2** (DBML မပြောင်း — header note) | (f) | Trigger ၄ ခု (SQLSTATE P0001 `finished_immutable`): `sales_finished_guard` (FINISHED / CANCELLED sale = `customer_id` + `updated_at` ပဲ ပြောင်းရ) · `sale_items_finished_guard` (INSERT / UPDATE / DELETE ✖) · `payments_finished_guard` (`verified_at`, `verified_by_user_id`, `external_reference` ပဲ; DELETE ✖) · `visits_final_guard` (FINISHED / INCOMPLETE = `updated_at` ပဲ) | 🔒 D-VIS-08 immutable ကို DB အဆင့်မှာ ထပ်ကာ — app bug ကြောင့် ငွေ row မပြောင်းအောင်; B10 ချွင်းချက် ၂ ခု (customer, KBZPay ref) + ✔ ပဲ ဖွင့် |
| **5 v1.1** (constraints v1.2) | (a) | `attendance_records.voided_at` / `voided_by_user_id` / `void_reason` + all-or-none CHECK `attendance_records_void_chk`; `attendance_records_one_open` + `attendance_records_no_overlap` က void row ကို မတွက် | manual attendance မှားရင် ဖျက်မရ (D-DAT-05) → void + reason (C11) |
|  | (b) | `employee_receivables.client_request_id` + `employee_receivable_repayments.client_request_id` (uuid UNIQUE NULL) · comment: cash repayment = ဗီရို ✖ (C3); payroll repayment = Mark paid မှာ ရေး | advance / repayment ၂ ခါ မှတ်မိ ကာ (`Idempotency-Key`) |
| **6 v1.2** (constraints v1.1) | (c) | `stock_movements.client_request_id` (uuid NULL) + partial unique `stock_movements_client_request_uq` | "သုံးကုန်" ၂ ခါ နှိပ်မိ ကာ; append-only trigger မထိ |
| **7 v1.1** (constraints v1.1) | (d) | `cash_outs` / `cash_returns` + `cancelled_at` / `cancelled_by_user_id` / `cancel_reason` (+ `cash_outs_cancel_chk`, `cash_returns_cancel_chk`) · `expenses.client_request_id` + `manual_incomes.client_request_id` (uuid UNIQUE NULL) · comment: closing က cancel row မတွက်; cash manual income = PENDING + APPROVED (E7); KBZPay ✔ = ပိတ်ပြီးလည်း ရ (E3) | E5 cash out မှား ပြင် / cancel · expense / income ၂ ခါ ကာ |
| **8 v1.1** (constraints v1.1) | (e) | `backup_runs_restore_chk`: kind 3 (RESTORE_TEST) = `performed_by_user_id` NULL ရ · `attachments_deleted_chk` → `(deleted_by_user_id IS NULL OR deleted_at IS NOT NULL)` | လစဉ် restore test = auto (F9) · system purge job က user မပါဘဲ ရှင်း |

**မှတ်ချက်:** (1) FINISH transaction = line / total / payment အရင် ပြင်ပြီးမှ status ပြောင်း; FINISH ပြီးရင် line / payment ကို `updated_at` တောင် မထိရ (ORM cascade save ✖); နောက်မှ finished row backfill လုပ်တဲ့ migration = trigger ခဏပိတ်။ (2) DB က မကာတာ (app က ကာ): FINISHED sale ထဲ payment အသစ်; CANCELLED sale ရဲ့ payment; sale / visit DELETE (FK + D-DAT-05)။ (3) Part 5 test seed တစ်ခု (FINISHED sale ထဲ line ထည့်) ကို တကယ့်အစဉ်နဲ့ ပြန်ရေး — trigger မလျှော့။ (4) DBML comment ထဲက နာမည်ဟောင်း (`site.domain`, `closing.close_roles`, `finance.pnl.view`, `stock.low_stock_notify_roles`, `website.manage` …) = API Part 1–8 က အစားထိုး (`db/README.md` မှာ မှတ်)။ (5) **⚠️ OPEN-40 (a) Part 7 v1.2 / (b) Part 5 v1.2 = အဆိုပြုပဲ — မထည့်ရသေး** (§0.9)။


### 6.4j DB v1.2 — OPEN-40 (v5.2.16 · owner "OPEN-40 OK" 02/Oct 08:24)

**Source:** §0.9 (a) B · (b) B · (c) A · **Status:** 🔒 (D-DB-09 **v1.2** · D-DB-11 **v1.2**) · table **၉၁ မပြောင်း** · PostgreSQL 16 full load + **test ၃၉၃ / ၃၉၃ PASS** (Part 3 = ၃၀ · Part 4 = ၈၃ · Part 5 = **၁၀၄** (+၁၉) · Part 6 = ၄၉ · Part 7 = **၇၇** (+၁၉) · Part 8 = ၅၀) — မူလ ဖိုင်တွေကို အရင် run ပြီး ၃၅၅ ကိုက်တာ အတည်ပြုပြီးမှ ပြင် · zip v8 (`docs/db/README.md`)။ **ဖိုင်နေရာ (ADR-016):** `point-sdd/docs/db/`။ §6.4e / §6.4g ထဲက DBML စာသားက မူလ lock အတိုင်း — အောက်က ဇယားက အဲ့ပေါ် ထပ်ထည့်တာ။

| Part → version | OPEN-40 | ဘာပြင် | ဘာကြောင့် |
| --- | --- | --- | --- |
| **5 v1.2** (`part5-commission-payroll-attendance-v1.2.dbml` · constraints **v1.3**) | (b) | `employee_salaries` + `employee_commission_plans` မှာ `archived_at timestamptz NULL` · `archived_by_user_id uuid NULL → users` · `archive_reason text NULL` + all-or-none CHECK (`employee_salaries_archive_chk` / `employee_commission_plans_archive_chk` — reason ဗလာ ✖) · overlap EXCLUDE (`employee_salaries_no_overlap` / `employee_commission_plans_no_overlap`) = `WHERE (archived_at IS NULL)` | မှားထည့် + မသုံးရသေး row ကို ဖျက်မရ (D-DAT-05) → archive; archive ပြီးသား row က ပြင်ထားတဲ့ row အသစ်ကို မပိတ်။ **အစဉ် = archive အရင်၊ ပြီးမှ ရှေ့ row ရဲ့ `effective_to` ပြန်ချိတ် / row အသစ်** (EXCLUDE က statement တစ်ခုချင်း စစ်) |
| **7 v1.2** (`part7-finance-closing-v1.2.dbml` · constraints **v1.2**) | (a) | FK `expenses.payroll_entry_branch_allocation_id` → `payroll_entry_branch_allocations.id` = **`ON DELETE SET NULL`** (DBML long-form `Ref … [delete: set null]` → generated DDL) · `expenses_source_refs_chk` ရဲ့ source 3 (PAYROLL) branch = `(payroll_entry_branch_allocation_id IS NOT NULL OR deleted_at IS NOT NULL)` · **column အသစ် မရှိ** (`deleted_at` / `deleted_by_user_id` / `deletion_reason` ရှိပြီးသား) · `expenses_one_per_allocation` မပြောင်း | Payroll reopen: salary expense ကို soft delete ("Payroll reopened — <reason>") → allocation ဖျက် → FK NULL ဖြစ်၊ row ကျန်; finalize ပြန်လုပ်ရင် row အသစ်။ DB က ကာတာ: soft delete မလုပ်ရသေးတဲ့ expense ရဲ့ allocation ကို ဖျက် ✖ · NULL allocation row ကို un-delete ✖ · live PAYROLL expense မှာ NULL allocation ✖ |
| **6** (v1.2 အတိုင်း — မပြောင်း) | (c) | DB မပြောင်း — DRAFT purchase / transfer line ဖြုတ် = row ဖျက် + audit diff အပြည့် | draft = stock / ငွေ မထိသေး; booking item (owner A2) ပုံစံတူ |

**မှတ်ချက်:** (1) "မသုံးရသေး" စစ်တာ (FINALIZED / PUBLISHED / PAID run က မညွှန်း) = app (API Part 5 P5-RULE-03)၊ DB မဟုတ်။ (2) Archive ထားတဲ့ row ကို screen မှာ ပြ / မပြ = 🟡 §0.11 S11 (default = audit log မှာပဲ)။ (3) Reopen လုပ်ထားတဲ့ salary expense ကို `include_deleted` နဲ့ ဖတ်ရင် `links.payroll_run_id` = `null` (allocation ချိတ် ပြတ်ပြီ — `deletion_reason` + audit row မှာ run ကျန်; API Part 7 v1.1 P7-RULE-15)။ (4) `_generated-tables-part1-8.sql` = `@dbml/core` 10.2.0 နဲ့ ပြန်ထုတ်ပြီး delta ထည့် (column ၆ · FK ၂ + FK action ၁ + comment)။


### 6.5 Part တစ်ခုချင်း review checklist

> ChatGPT (ဒါမှမဟုတ် Claude Code) DBML ထုတ်တိုင်း ဒီ list နဲ့ စစ်ပြီးမှ lock ပါ။ R364 / R365 က "ဖိုင်ထဲက rule အတိုင်း" လို့ ပြောပေမဲ့ ၇ ခု လွတ်သွားခဲ့တာ ဒီလို စစ်စရာ list မရှိလို့။

1. **Traceability** — table / field တိုင်း 🔒 D-ID တစ်ခုခုနဲ့ ချိတ်လား။ Lock မရှိတဲ့ field ဆို `// ⚠️ REC-nn` / `// 🟡 OPEN-nn` tag ပါလား (D-PLT-11)။
2. **🔒 DB-level rule တွေ တကယ် constraint ဖြစ်ပြီလား** — "ကြိုစဉ်းစားထားမယ်" မဟုတ်ဘဲ SQL ပါရမယ် (ဥပမာ D-BKG-08 EXCLUDE၊ D-CUS-02 unique၊ D-PAY-02 reference unique)။
3. **Naming (D-DB-01)** — `barber` / vendor နာမည် မပါ၊ `*_employee_id` / `*_user_id`၊ `*_amount` = bigint၊ `*_at` = timestamptz၊ `*_date` = date၊ table = plural snake_case၊ glossary နာမည်။
4. **Status** — number code `smallint` + CHECK ဖြစ်လား (🔒 D-DB-03 — note မှာ number အဓိပ္ပာယ်)၊ status ပေါ်မူတည်တဲ့ field တွေကို CHECK နဲ့ ကာလား (ဥပမာ CANCELLED ⇔ `cancelled_at`)။
5. **Nullability** — NULL ခွင့်ပြုတိုင်း lock ထားတဲ့ flow တစ်ခုက တကယ်လိုလို့လား ("just in case" မဟုတ်)။ NULL က unique / exclusion constraint ကို ကျော်သွားနိုင်လား။
6. **Snapshot + history** — line item မှာ price / duration / name snapshot၊ history lock ရှိရင် effective-dated။
7. **Delete** — master = `archived_at`၊ transactional table မှာ hard delete မရှိ (D-DAT-05)။
8. **ဘယ်သူ / ဘယ်အချိန်** — lock က "ဘယ်သူလုပ်လဲ" မှတ်ခိုင်းရင် `*_by_user_id` / `*_by_employee_id` + `*_at` ပါလား (ကျန်တာ `audit_events`)။
9. **Future FK** — မရှိသေးတဲ့ part ကို ညွှန်ရင် note ထား (မဖျောက်ရ)။
10. **Open decision** — 🟡 item ကို ခန့်မှန်းပြီး မထည့်ရ (ဥပမာ one-active-booking)။
11. **Paste test** — အရင် part တွေနဲ့ တွဲပြီး dbdiagram.io (ဒါမှမဟုတ် `@dbml/core`) မှာ error မရှိ။
12. **Finding table** — ❌ (🔒 ချိုး) / ⚠️ (အကြံ) / 🟡 (ဆုံးဖြတ်ရန်) ခွဲပြီး user approve → Appendix A မှာ `D-DB-nn` ထည့် → part 🔒။
13. **CHECK NULL ကျော်** *(v5.1)* — OR-branch ထဲ nullable column ကို `BETWEEN` / `IN` / `>` နဲ့ စစ်ရင် `col IS NOT NULL AND …` အရင် ရေး (NULL = pass ဖြစ်တယ်)။ Test မှာ "NULL ထည့်ရင် fail" case ထည့်။

---

## 7. နည်းနည်းပြင်ရုံနဲ့ ပိုကောင်းသွားမယ့်အချက်များ

> ⚠️ **ဒီ table က ပြင်ဖို့ အကြံပြုချက် list ပါ — approve မလုပ်မချင်း requirement မဟုတ်ဘူး။** ညာဘက်ဆုံး column = §3.0 register ID။

| # | ပြင်ရန် | Effort | ဘာကြောင့် | Register |
| --- | --- | --- | --- | --- |
| 1 | Research repo ကို private ပြောင်း | ၁ မိနစ် | Owner ကိုယ်ရေး + ဆိုင် revenue | ✋ ACT-01 ✅ |
| 2 | Backup ကို daily + off-site + လစဉ် restore test | နည်း | ၆ ရက်စာ ငွေစာရင်း ပျောက်နိုင်ခြေ ဖယ် | 🔒 REC-20 → D-DAT-03 |
| 3 | Branch device + PIN quick switch | အလယ် | Shared login ပြဿနာ မဖြစ်ဘဲ attribution မှန် | ✖ REC-04 (D-AUTH-07) |
| 4 | `performed_at` / `recorded_at` + late entry (reason) | နည်း | လက်တွေ့ workflow + မီးပျက်ချိန် fallback | 🔒 REC-02 → D-VIS-13 (v5.1) |
| 5 | `collected_by` ≠ `performed_by` | နည်း | ငွေကိုင်တဲ့သူ သီးသန့် ရှိနိုင် (live: လူ ၃ ယောက်) | 🔒 REC-07 → D-VIS-06 |
| 6 | Service price type `fixed / range / variants` | နည်း | Colour/perm ဈေး ပြောင်းတာ admin မခေါ်ရ | 🔒 REC-08 → D-SVC-05 (options + combination ဈေးဇယား — v5) |
| 7 | Staff Advance ကို expense ကဖြုတ် + Salary expense = gross | နည်း | P&L မှန် | 🔒 REC-15, REC-16 → D-FIN-02, D-FIN-04 |
| 8 | Expected cash မှာ cash in/out ထည့် | နည်း | Closing difference နေ့တိုင်း မထွက် | 🔒 REC-17 → D-FIN-06..09 |
| 9 | Commission ကို period ကုန်မှ တွက်၊ checkout မှာ estimate ပြ | နည်း | Progressive tier နဲ့ ကိုက် | ◐ REC-18 → D-COM-04 · 🟡 OPEN-26 |
| 10 | Redis/BullMQ → pg-boss | နည်း | Service လျော့၊ handover လွယ် | ⚠️ REC-31 |
| 11 | UUIDv7 + idempotency key Day 1 ကတည်း | နည်း | Double submit မဖြစ် + နောက်ပိုင်း offline ထည့်ရလွယ် | 🔒 D-DB-01 + D-VIS-10 |
| 12 | Exclusion constraint + partial unique index | နည်း | Double booking/one-active-booking ကို DB က ကာ | 🔒 D-BKG-08 (EXCLUDE — §6.4) · one-active-booking = app check (D-BKG-09 — v5.1) |
| 13 | Manage booking link နဲ့အတူ "Add to calendar (.ics)" + Viber share | နည်း | Link ပျောက်တာ (P166) ကို ကုန်ကျစရိတ်မရှိဘဲ လျော့ | ⚠️ REC-36 |
| 14 | Public booking မှာ captcha + rate limit | နည်း | OTP မရှိလို့ spam booking | 🔒 REC-28 → D-BKG-21 |
| 15 | Auto-print default = OFF | နည်း | ဒီနေ့ receipt မထုတ်ဘူး၊ တစ်နေ့ ~90 ခု စက္ကူ/အချိန်ကုန် | ⚠️ REC-37 |
| 16 | Leave types ကို live blocked-time 10 ခုကနေ seed | နည်း | Owner ရင်းနှီးပြီးသား category | 🔒 D-LV-01 (v5, REC-27) |
| 17 | Decision register ကို repo ထဲ (Appendix A) | နည်း | Chat ဖျက်ပြီးရင် ဆုံးဖြတ်ချက် မပျောက် | ✋ ACT-04 |
| 18 | Transaction history မပြောင်းရွှေ့ဘဲ master data ပဲ migrate (branch, staff, service, customer 99) | နည်း | Migration scope သေး၊ Fresha export ကို archive | ⚠️ REC-30 · 🟡 OPEN-18 |
| 19 | Public website = admin DB တစ်ခုတည်း + save တိုင်း on-demand revalidate (§5.8) | နည်း–အလယ် | P1 requirement၊ data copy မရှိလို့ မေ့ပြင်စရာ မရှိ | ⚠️ REC-35 · 🟡 OPEN-21 |
| 20 | Session ကို server-set `HttpOnly` cookie နဲ့ (localStorage token မသုံး) | နည်း | iOS Home Screen app မှာ "stay signed in" အလုပ်ဖြစ်ဖို့ (§5.7) | ⚠️ REC-05 |
| 21 | Branch counter device = Android tablet / Windows PC (iPad မဟုတ်) | – | iOS မှာ Bluetooth / silent print မရ (§5.7) | ✖ REC-06 (D-AUTH-07; print — D-PAY-07) · ✅ OPEN-20 (v5.2.7 — PDF / Share = device တိုင်း) |

---

## 8. Phase / Release အစီအစဉ် အကြံပြုချက်

> ✖ **v4: REC-10 reject ပြီး (P382, D-PLT-14)** — release မခွဲဘဲ V1 scope အကုန် (booking, stock ပါ) ကို dev ၂ ယောက် + Claude Code နဲ့ တစ်လအတွင်း။ အောက်က table ကို module အစဉ် / ခွဲဝေ စဉ်းစားတဲ့အခါ reference အဖြစ်ပဲ သုံးပါ (branch device PIN ✖ — D-AUTH-07)။
>
> *(မူလ v3 စာသား)* ⚠️ **REC-10 — approve မလုပ်ရသေး** (Release ခွဲပုံ)၊ 🟡 OPEN-07 (booking ကို go-live မှာ လိုလား) ပေါ်မူတည်တယ်။ ဒါက evidence ပေါ်အခြေခံတဲ့ အကြံပြုချက်ပါ။ 🟡 Owner က booking ကို go-live မှာ လိုချင်တယ်ဆိုရင် R2 က booking ကို R1 ထဲ ရွှေ့နိုင်ပေမဲ့ တစ်ခုခုကို ပြန်ထုတ်ရမယ်။

| Phase | ပါဝင်တာ | Evidence / ဘာကြောင့် |
| --- | --- | --- |
| **Phase 0** (~၃–၄ ရက်) | Decision register + module spec · Owner meeting (Appendix B top 10) · DB design · Walk-in → checkout clickable prototype ကို tablet ပေါ်မှာ barber ၂–၃ ယောက်နဲ့ စမ်း | §3.1 risk ကို code မရေးခင် စမ်း |
| **Release 1 — "Fresha အစားထိုး + P&L"** (~၄ ပတ် target) | Auth (Google/Email OTP) + branch device PIN · Company/branch · Employees + roles (seed role ၃–၄ ခု၊ action-level permission infra) · Services + branch price + barber override + price range · **Walk-in visit → sale → payment (Cash/KBZPay+ref) → FINISH** · Discount codes · Receipt (PDF/print, auto-print off) · Adjustment/refund · **Daily closing** (cash in/out ပါ) · **Expenses (approval) + P&L** · Commission report (Point model — owner က manual ပေး) · Admin/Barber dashboard + core reports · Audit · MM/EN · PWA + Android shell + iOS install guide · **Public website** (`/` + branch pages, admin-driven; Book button ကို R2 အထိ ဖျောက်) · Daily backup | Walk-in 100%၊ cash 99.9%၊ P&L = owner ရဲ့ အဓိက၊ Fresha မှာ expense/P&L မရှိ၊ website = P1 requirement (branch data ရှိပြီးသား) |
| **Release 2** | Staff calendar + public booking (`/book`, `?branch=`) + manage link + availability engine + no-show · Schedule · Leave · Attendance (QR+GPS) · Payroll finalize + payslip + advance/loan · Customer history/preferred barber · Branch manager dashboard · Windows .exe | Online 0% ဆိုတော့ R1 ပြီးမှ ပိုတန်ဖိုးရှိ၊ attendance/leave က လုပ်ငန်းစဉ်အသစ် |
| **Release 3** | Stock (purchase, transfer, stocktake, low stock) · Product sales · Waitlist · Custom KPI · Import tool (UI) · Tax/service-charge engine (owner confirm ပြီး) · Offline queue (လိုရင်) · iOS native wrapper (လိုမှ — §5.7) | Fresha မှာ product 0၊ waitlist ကို ဖွင့်ထားပေမဲ့ online booking 0% ဆိုတော့ မသုံးဖြစ်ပုံရ (INFERRED — အသုံးပြုမှု မတိုင်းရသေး) |

---

## 9. နောက်ဆက်လုပ်ရန် အစဉ်လိုက်

> *R367 ရဲ့ workflow အတိုင်း:* **Research → Concern classification → Decision → 🔒 Lock → DB design → Implementation**
> *v5 (30/Sep):* Risk walkthrough ✅ (§3.12) · ⏩ OPEN / REC ✅ · DB Part 1 / 1b / 2 🔒 (D-DB-02 / 05 / 06)။
> *v5.2.6 (01/Oct):* DB design ✅ → **UI/UX guideline ✅ draft (§10)** → NEXT အစဉ် (🔒 D-PLT-18) = **(1) guideline review → (2) API design → (3) Code**။ အောက်က #6 dev plan / #7 architecture / #9 prototype တွေက (2)(3) နဲ့ ပြိုင်တူ ပြင်ဆင်ရမယ့်ဟာ — #11–#15 မှာ အစဉ်အသစ်။

1. ✋ **ACT-03** — Fresha sandbox trial **04/Oct** မကုန်ခင် barber-level login test (§4.4)။
2. ✅ **OPEN-28** (ဖုန်းမပါ case payment — conflict) — v5.1 (က)။ *(OPEN-27 ✅ ⏭ — §6.4b)*
3. ✅ **DB Part 3 — Customers / Booking 🔒 (D-DB-07)** — v3 (§6.4c)၊ test ၃၀/၃၀။
4. ✅ **DB Part 4 — Visit / Sale / Payment 🔒 (D-DB-08)** — v1 (§6.4d)၊ test ၅၇/၅၇။
5. ✅ **DB Part 5 — Commission / Payroll / Attendance 🔒 (D-DB-09)** — v1 (§6.4e)၊ test ၇၀/၇၀။
6. ✅ **DB Part 6 — Inventory 🔒 (D-DB-10)** — v1 (§6.4f)၊ test ၄၄/၄၄။
7. ✅ **DB Part 7 — Finance / Closing 🔒 (D-DB-11)** — v1 (§6.4g)၊ test ၄၆/၄၆။
8. ✅ **DB Part 8 — System / Website 🔒 (D-DB-12)** — v1 (§6.4h)၊ test ၄၅/၄၅။ **DB design ၈ part အကုန် ပြီး — table ၉၁၊ test ၂၉၆ PASS။ NEXT = #6 Development plan + OpenSpec။** *(v5.2.15: G အသေးစား — test ၃၅၅, §6.4i)*
4. **DB Part 4 → 8** — part တစ်ခုစီ မစခင် §6.2 ရဲ့ "ဆုံးဖြတ်ရမယ့်ဟာ" column ကို ရှင်း → DBML → test → lock။ (§0.4 #4 မှာ part အလိုက် list)
5. **Final DB audit** — part အားလုံး dbdiagram မှာ တွဲ paste၊ Appendix A ထဲက DB နဲ့ဆိုင်တဲ့ 🔒 တိုင်း table / constraint တစ်ခုခုနဲ့ ချိတ်မိလား traceability စစ်။
6. **Development plan** (D-PLT-14) — dev ၂ ယောက် + Claude Code ပြိုင်တူ တစ်လ: module ခွဲဝေ၊ shared ပိုင်း (DB schema, auth, permission, form component, language file) ကို ဘယ်သူ / ဘယ်အချိန်၊ အစဉ်၊ spec template (§5.6)၊ `CLAUDE.md` rule (D-PLT-13, D-UI-01, D-PLT-03, D-DB-03 / 04, D-ROLE-08)။
7. ✅ **Architecture REC တွေ ဆုံးဖြတ်** *(v5.2.13: ADR အကုန် Accepted — §12.7)* — REC-31 (pg-boss — schedule shift ထုတ်တဲ့ nightly job ပါ)၊ REC-32 (Android = Capacitor — Bluetooth print)၊ REC-33၊ REC-38 (email + error monitoring)။ *v5.2.10:* ADR ရေးပြီး (§12 — ADR-002 / 003 / 006 / 007 + 004 / 005 / 008 / 009) → owner "OK" (OPEN-38)။
8. ✋ **ACT-04** — ဒီဖိုင် + `db/` ကို product repo `docs/` ထဲ၊ Appendix A ကနေ `docs/decisions/decision-register.md`။ Domain (ACT-05)။
9. **Prototype + pilot** — REC-03 approve ရင် walk-in → checkout clickable prototype ကို barber ရဲ့ ကိုယ်ပိုင်ဖုန်းပေါ်မှာ စမ်း (D-VIS-11)။
10. **V1 build** — scope = Appendix A 🔒 အကုန် (⏭ row မပါ)၊ release မခွဲ (D-PLT-14)။
11. ✅ **UI/UX guideline draft v1.0 (01/Oct — D-UX-01)** — `docs/ux/admin-panel.md` (AD-…) + `docs/ux/frontend-website.md` (FE-…)၊ Laws of UX ၃၀ + Fresha reference (§10)။
12. ✋ **ACT-07** — `fresha-research` repo private ပြန်ပြောင်း (ချက်ချင်း)။
13. ✅ **UI/UX guideline owner review (D-PLT-18 #1)** — 01/Oct 11:09 approve → 🔒 D-UX-03 / 04 (v1.2) · ★ OPEN-30 = spec အဆင့်မှ · ACT-06 (repo `docs/ux/` + CLAUDE.md) အသင့်။
14. ✅ **API design (D-PLT-18 #2) — ပြီး (02/Oct — §11.9)** — 🔒 Part 0 v1.5 · Part 1 v1.5 · Part 2 v1.4 · Part 3 v1.1 · Part 4–8 v1.0 (D-API-01 … 09) — endpoint ၄၄၁ · code ၁၇၄ · OpenAPI ၈ ဖိုင် · 🟡 OPEN-40 (§0.9) · **NEXT = OpenSpec spec အဆင့် (D-PLT-17): project context → ADR-001 repo scaffold → walk-in → checkout vertical slice**
14. **API design (D-PLT-18 #2)** — module အလိုက် REST + OpenAPI; source = Appendix A + `db/` + `docs/ux/` flow; §10.6 API မေးခွန်း ဖြေ; OpenSpec change (D-PLT-17)။ ဒီအဆင့်နဲ့ ပြိုင်တူ #6 dev plan + #7 architecture ADR။
15. **Code (D-PLT-18 #3)** — shared UI component (AD-IMPL-02) + token file အရင် → walk-in → checkout vertical slice → ကျန် module; #9 prototype / pilot ကို vertical slice ပြီးတာနဲ့ စမ်း။
16. ✅ **OpenSpec spec အဆင့် စပြီ (02/Oct — v5.2.16, §0.10)** — 🔒 D-PLT-20 (ရေးပုံ) · D-ARC-03 / ADR-016 (repo ၂ ခု) · D-ENG-01 / 02 (tooling · coding guideline draft) · `openspec/config.yaml` · change ၄ ခု (`add-repo-scaffold` → `add-shared-ui-components` ∥ `add-foundation-auth-access` → `add-walkin-visit-checkout`) · `docs/plan/dev-plan.md` + `roadmap.md` (၈၁ row) · ✅ **§0.11 sheet 3 ဖြေပြီး (02/Oct 13:08 — v5.2.17)** → change ၄ ခု apply လုပ်လို့ရပြီ · **NEXT = ACT-09 → push → apply → pilot လိုအပ်ချက် → pilot → roadmap wave 1** · schedule = S1 (dev-plan §6)

---

## 10. UI/UX Guideline — Frontend website + Admin panel (v5.2.6 · v5.2.7 §10.9 · v5.2.8 §10.10)

> **Owner (30/Sep ည):** "DB diagram အကုန် ပြီးပြီ။ UI/UX principle guideline ထုတ်ဖို့ လိုတယ် — Claude Code က မသိမှာ စိုးလို့။ lawsofux.com ကို reference ယူ၊ Frontend website နဲ့ Backend admin panel ခွဲ၊ admin panel က Fresha reference ပါ ယူ၊ .md ၂ ဖိုင်။ Colour code နဲ့ font family က ငါတို့ ပြန်သတ်မှတ်မယ်။ လိုတာ ပြင်ပြီးမှ API → Code development သွားမယ်။"
> → 🔒 **D-UX-01** (ဖိုင် ၂ ခု + reference + precedence) · 🔒 **D-UX-02** (colour / font = team) · 🔒 **D-PLT-18** (UI/UX → API → Code) · ⚠️ **REC-39 / REC-40** (content approve → D-UX-04 / D-UX-03)

### 10.1 ဖိုင် ၂ ခု

| ဖိုင် (ဒီ chat ကထုတ်) | Repo path (ACT-06) | Scope | Rule ID | ပမာဏ | Status |
| --- | --- | --- | --- | --- | --- |
| `point-ux-guideline-frontend-website-v1.2.md` | `docs/ux/frontend-website.md` | Customer မြင်တဲ့ website — `/` home, `/branches/[code]`, **booking modal** (`/book` + `?branch=` + `?barber=` = entry link), confirmation / manage-link page, 404 / maintenance, SEO / link preview | `FE-<AREA>-nn` (~125) | ~580 လိုင်း · section ၁၅ | 🔒 **v1.2 APPROVED (01/Oct 11:09 — D-UX-04, REC-39 ✅)** |
| `point-ux-guideline-admin-panel-v1.2.md` | `docs/ux/admin-panel.md` | Login ဝင်ပြီး screen အားလုံး — owner / admin / manager / barber ဖုန်း (POS)၊ login / OTP / devices၊ receipt print layout၊ QR print | `AD-<AREA>-nn` (~270) | ~1,200 လိုင်း · section ၁၆ | 🔒 **v1.2 APPROVED (01/Oct 11:09 — D-UX-03, REC-40 ✅)** |

- **ဘာသာ:** Guideline ၂ ခုလုံး **English** နဲ့ ရေးထား (Claude Code က rule ကို တိတိကျကျ လိုက်နိုင်ဖို့ + UI / component term တွေ English ဖြစ်လို့) — ထိပ်မှာ **မြန်မာ အတိုချုပ်** ပါ၊ UI စာသား ဥပမာတွေမှာ MM / EN ၂ ဘာသာ (MM = ★ owner စစ်ရန် suggestion)။
- **Tag:** review နဲ့ တူတူ — 🔒 D-xxx (lock ပြီးသားကနေ ဆင်း — ပြောင်းမရ) · ⚠️ (guideline အကြံ — approve မှ binding) · 🟡 OPEN-nn (default နဲ့ ဆောက်၊ နောက်ဆုံးအဖြေ မခန့်မှန်း) · ★ (owner တန်ဖိုး — မတီထွင်ရ)။
- **Precedence (AD-META-01 / FE-META-01):** Appendix A 🔒 > `db/` > guideline > Fresha။ Guideline rule က 🔒 နဲ့ ဆန့်ကျင်ရင် 🔒 နိုင်၊ Claude Code STOP → report (D-PLT-13)။

### 10.2 ဘယ်လို ထုတ်ခဲ့လဲ

1. **Laws of UX** — lawsofux.com က law ၃၀ လုံး (page တစ်ခုချင်းရဲ့ definition + takeaways, 30/Sep/2026 စစ်) → ဖိုင်တစ်ခုချင်းရဲ့ §2 မှာ law တိုင်းကို "ဒီ system မှာ ဘာဆိုလိုလဲ + ဘယ် rule နဲ့ အကောင်အထည်ဖော်လဲ" table အဖြစ်။
2. **ဒီ review** — Appendix A (🔒 decision အားလုံး)၊ §5.7 (iOS PWA)၊ §5.8 (website)၊ §6 (DB Part 1–8 — screen / status code / reason / permission / setting) → screen spec နဲ့ rule တွေကို decision ID နဲ့ ချိတ်။
3. **`db/`** — status number code (badge map)၊ NOT NULL field (ဥပမာ `customers.name` → FINISH မှာ ဖုန်းအသစ်ဆို နာမည်လို)၊ website column / `site.*` settings။
4. **Fresha research repo** (commit `7137637`) — `ux-analysis.md` (click / screen count, pain point)၊ `module-research/*` ၂၀ ခု၊ `evidence/` screenshot (calendar, booking drawer, checkout, register close, pricing grid, mobile 390 px, public booking flow) → admin §11 adopt / improve / avoid, frontend §12။
5. D-PLT-11 အတိုင်း — guideline ရဲ့ ကိုယ်ပိုင် အကြံ (⚠️) နဲ့ lock (🔒) ကို ခွဲ tag တပ်; မသေချာတာ / ဆန့်ကျင်နိုင်တာ = OPEN-30..36 (§10.6)။

### 10.3 ဖိုင်တစ်ခုချင်း ဖွဲ့စည်းပုံ နဲ့ အဓိက အချက်

**Admin panel (`AD-…`)** — §0 အသုံးပြုပုံ · §1 user / device / goal · §2 Laws of UX ၃၀ · §3 design token (colour ★ placeholder + requirement · font = v1.1 မှာ သတ်မှတ်ပြီး — Pyidaungsu / Manrope / Inter, type scale, spacing, breakpoint) · §4 app shell / nav / IA · §5 page pattern (list, detail, form, reason dialog, confirm, wizard, calendar, dashboard, report, settings, state, realtime, help) · §6 component (button, status badge map, flag, table, overlay, price grid, receipt, QR) · §7 format / ဘာသာ · §8 performance / reliability · §9 permission UI · §10 critical flow spec ၁၉ ခု · §11 Fresha · §12 a11y · §13 copy / MM term · §14 Claude Code implementation + DoD · §15 open item။

အဓိက အချက် —
- **Barber ဖုန်းက အမြန်ဆုံး ဖြစ်ရမယ်** (RISK-01) — walk-in 1 service cash: START → FINISH **≤ ၇ tap, ≤ ၁၀ စက္ကန့်** target (START sheet မှာ service chip ရွေးလို့ရ — D-VIS-02 optional) (REC-01 — prototype မှာ တိုင်း)။ Today screen (ပြီးမသွားသေးတဲ့ visit အရင်)၊ bottom nav အလယ် **＋ Start**၊ arrival = ခလုတ် ၂ ခုပဲ (Booking / Walk-in — D-VIS-01)၊ "Service done · Take payment" tap တစ်ချက်၊ Cash = ပထမ (live 99.9%) + tap တစ်ချက် = ကျန်ငွေအပြည့်။
- **Attribution ရှင်း** — service line တိုင်းမှာ performer chip၊ proxy (ဖုန်းမပါ) = link တစ်ခုနဲ့ explicit (D-VIS-12)၊ Fresha ရဲ့ "login ဝင်ထားသူ default" ပြဿနာ ရှောင်။
- **Status badge map တစ်ခုတည်း** — table ~၂၀ ရဲ့ number code → tone (neutral / info / success / warning / danger / muted) + icon + စာ; exception flag (late entry, proxy, home, negative stock …) ပုံသေ။
- **Reason dialog component တစ်ခုတည်း** — reason လိုတဲ့ action ၂၇ ခုကို decision ID + reason source (master list / preset / free text) နဲ့ table။
- **Daily closing = checklist** — opening float → cash lines → expected cash (formula ပြ) → counted → difference tone → KBZPay ✔ list (3/5) → close; ပိတ်ပြီး lock banner။
- **Booking** — DB က double booking ပိတ်လို့ "time just taken" + အနီးဆုံး အချိန် ၃ ခု (Fresha soft warning ✖)၊ reschedule = old → new + ဈေးပြောင်း အကြောင်းပြချက် (D-BKG-12)၊ **manage link ကို save ပြီးချိန် တစ်ခါပဲ ပြနိုင်** → Copy / Share (Viber) ချက်ချင်း (AD-BKG-02)၊ no-show alarm card (snooze ×4, auto-cancel countdown)၊ multi-branch barber အတွက် **barber view** (Fresha "branch တစ်ခုပဲ" ပြဿနာ)။
- **Format တစ်နေရာတည်း** — `7,000 Ks` / `7,000 ကျပ်`, `30/Sep/2026`, `2:30 PM`, ဖုန်း `09 7xx xxx xxx`, MMT; Myanmar typography (line-height ပိုမြင့်၊ clip မဖြစ်၊ wrap၊ uppercase / italic ✖၊ 320 px မှာ စမ်း)၊ Zawgyi → Unicode။
- **Permission UI** — API က ဆုံးဖြတ် (D-ROLE-03); ခွင့်မရှိ = ဖျောက်၊ state ကြောင့် မရ = lock banner / disabled + အကြောင်း; `can(code, {branchId})` helper; review ထဲ ပါပြီးသား permission code ~၄၀ စာရင်း။
- **Money safety** — optimistic update ✖, `client_request_id` retry မှာ ID တူ (D-VIS-10), timeout ဆို "save ဖြစ်မဖြစ် စစ်" ပြီးမှ retry, printer error က payment မပိတ် (D-PAY-07)။
- **Receipt** — ပုံအဖြစ် render (58 mm = 384 px / 80 mm = 576 px), barber, KBZPay ref, ဖုန်း mask, footer ဖွင့်ချိန်; Android ပဲ print — iPhone မှာ "Android ဖုန်းကနေ print" hint။
- **QR ၂ မျိုး မရောအောင်** — booking QR (customer) နဲ့ attendance QR (STAFF ONLY) template ကွဲ။
- **Claude Code အတွက်** — shared component ~၃၅ ခု အရင်ဆောက် (AD-IMPL-02)၊ CI guard (hardcoded string / hex colour / float money ✖)၊ screen DoD checklist၊ Playwright flow ၁၁ ခု (360 px + 1280 px)။

**Frontend website (`FE-…`)** — §0 · §1 visitor / goal · §2 Laws of UX ၃၀ · §3 visual (token တူ, brand ပိုသုံး, ဓာတ်ပုံ) · §4 IA / URL / ဘာသာ routing · §5 page spec (global, home, branch, booking modal step (v1.1 — FE-BK-00), confirmation, manage, system) · §6 component · §7 copy / ဘာသာ / format · §8 performance · §9 SEO / share · §10 privacy · §11 a11y · §12 Fresha public flow · §13 implementation / QA · §14 open item။

အဓိက အချက် —
- **Online booking 0% → call ထက် လွယ်ရမယ်** — account ✖ / OTP ✖ / နာမည် + ဖုန်းပဲ (D-BKG-10)၊ QR link ကနေ service ၁ ခု booking **≤ ၆၀ စက္ကန့်** target။
- **Booking modal step** (v1.1 — သီးခြား `/book` page ✖, FE-BK-00) = Services → Barber → Time → Details → Confirm (Fresha / သိပြီးသား အစဉ် — Jakob) + **ကြိုက်တဲ့အစဉ်** (D-BKG-02) ကို ဆုံးဖြတ်စရာ မတိုးဘဲ — "barber အရင်ရွေး" / "ရက်အရင်ရွေး" link + summary row "Change"; ရွေးပြီးသားနဲ့ မကိုက်တော့ရင် ဖျက်မပစ်ဘဲ "ပြန်ရွေးပါ" + အကြောင်း။
- **ဆိုင် / အိမ်** segmented control (branch မှာ home service ရှိမှ ပြ) → အိမ်ဈေး၊ home_allowed barber၊ ကားခ line၊ လိပ်စာ (D-BKG-22)။
- **Option service** (ဆိုးဆေး) — ရောင်းတဲ့ ကွက်ပဲ ပြ၊ ဈေး + ကြာချိန် အတိအကျ၊ "အရှည် မသေချာရင် အနီးဆုံးရွေး" hint (D-SVC-05)။
- **"Any barber"** = အချိန်ရွေးပြီးမှ အဲ့အချိန် အားတဲ့ barber စာရင်းထဲက customer ရွေး (D-BKG-05 — auto assign ✖)။
- **Date strip (14 ရက်) + slot grid** (မနက် / နေ့လယ် / ညနေ, ≥ 48 px) + "Next available" ခလုတ်; ပိတ်ရက် ရွေးမရ။
- **Error တိုင်း ရွေးထားတာ မပျက်** — slot taken / active booking ရှိပြီး (**booking အသေးစိတ် မပြ** — D-BKG-09) / rate limit / ပိတ်ရက် — ဖုန်းခေါ် ခလုတ် အမြဲ။
- **Confirmation page = customer လက်ထဲ ကျန်တဲ့ တစ်ခုတည်း** (SMS / email ✖ — D-CUS-05) → Peak-End: "Save this link — it's your booking ticket" card (Copy / Share / .ics ⚠️ REC-36 / screenshot hint / "ပြန်ပို့မပေးနိုင်" warning)။
- **Manage page** — reschedule (old → new + ဈေး အကြောင်းပြ)၊ cancel (reason; system no-show reason customer ကို မပြ)၊ cutoff ကျော်ရင် "ဆိုင်ကို ဖုန်းဆက်"၊ noindex / no-referrer / ဖုန်း mask။
- **URL** — `/my/…` `/en/…`; bare path (`/book?branch=B3`) → ဘာသာ redirect **query မပျက်** — ပုံနှိပ်ပြီးသား QR အမြဲ အလုပ်ဖြစ် (D-BKG-01); branch code case-insensitive။
- **ဈေး** — home page မှာ မပြ (branch အလိုက် ကွာလို့ — 6,000 / 7,000 / 8,000)၊ branch page မှာ `site.show_prices` ON မှ; option service = ဇယားသေး (vague "from" ✖)။
- **Performance / SEO** — LCP ≤ 2.5 s (mid Android 4G), availability cache ✖, `HairSalon` JSON-LD, OG share image, hreflang, sitemap, manage route robots ✖။

### 10.4 Laws of UX ၃၀ — ဘယ်လို သုံးထားလဲ (အကျဉ်း)

| Law | Admin panel မှာ | Frontend website မှာ |
| --- | --- | --- |
| Aesthetic-Usability | Token တစ်ခုတည်း၊ တသမတ်တည်း — ငွေ system ကို ယုံစေ; barber ဖုန်းနဲ့ တကယ်စမ်း | FB / Viber link ပထမ impression — ဆိုင်ဓာတ်ပုံ အစစ် |
| Choice Overload | Service picker "Frequent here" + category + search; internal code ပဲ list | Category chip + Popular; ရောင်းတဲ့ option ပဲ |
| Chunking | Form section ခွဲ; ဖုန်း / ငွေ / receipt no. အုပ်စုဖွဲ့ | Booking ၅ step; ဖွင့်ချိန် ဇယား |
| Cognitive Bias | Default = အမှန်ဖြစ်နိုင်ဆုံး (performer = login ဝင်သူ, collected_by = performer); proxy explicit | Honest default; fake urgency ✖; ကားခ ပါ total confirm မတိုင်ခင် |
| Cognitive Load | Mobile screen တစ်ခု = task တစ်ခု; ရှားတဲ့ option = link နောက်ကွယ် | Account / OTP ✖; နာမည် + ဖုန်းပဲ |
| Doherty Threshold | Tap feedback < 100 ms; POS API p95 ≤ 400 ms; skeleton | Availability ≤ 400 ms / skeleton; prefetch |
| Fitts's Law | Target ≥ 48 px; primary = အောက်ခြေ sticky (လက်မ ရောက်) | Slot / "+" ≥ 48 px; Continue sticky; Call / Directions ခလုတ်ကြီး |
| Flow | Modal ဆင့် ✖; START → … → Next customer အလိုအလျောက် | Dead end ✖; error မှာ ရွေးထားတာ မပျက် |
| Goal-Gradient | Checkout progress; closing "3/5"; payroll stepper | Step indicator; summary ဖြည့်လာ |
| Hick's Law | Arrival ခလုတ် ၂ ခု; Cash အရင် | Step တစ်ခု ရွေးစရာနည်း; next available highlight |
| Jakob's Law | Fresha layout (rail, barber column calendar, right drawer, bell) | Services → Barber → Time → Details → Confirm |
| Common Region | Card / section (sale summary, payment, branch closing) | Branch / service / barber card; summary panel |
| Proximity | Label အပေါ်၊ error အောက်၊ action ကို object ဘေး (Options menu ✖) | ဈေး + ကြာချိန် နာမည်ဘေး; Call / Directions card ထဲ |
| Prägnanz | Icon set ၁ ခု၊ badge၊ bar / line chart ပဲ | Layout ရိုး; map iframe ✖ (Directions ခလုတ်) |
| Similarity | Status badge map ၁ ခု; ငွေ right-align tabular | Tappable card / slot style တူ; Book CTA တူ |
| Uniform Connectedness | Booking item timeline; line ↔ performer chip; cash out ↔ return | Stepper connector; service စဉ် summary |
| Mental Model | Booking ≠ Visit ≠ Sale ≠ Payment; ဆိုင်စကား verb | Messaging လို booking; manage link = လက်မှတ် |
| Miller's Law | Nav group ≤ ၇; KPI ≤ ၆ / row | Slot ကို မနက် / နေ့လယ် / ညနေ; step ≤ ၅ |
| Occam's Razor | 🔒 scope ပဲ; screen တိုင်း "ဘာဖြုတ်လို့ရလဲ" review | Page ၄ မျိုးပဲ (home, branch, book, manage) |
| Paradox of the Active User | Empty state, `?` help, first-use tip | "How booking works" ၃ ဆင့်; flow ထဲ hint |
| Pareto | Walk-in checkout / today booking / clock-in ကို ဖုန်းမှာ အရင် optimize | လိပ်စာ / ဖွင့်ချိန် / ဖုန်း / Book ကို အပေါ်ဆုံး |
| Parkinson's Law | Prefill (branch, performer, MMT ရက်, opening float, ကျန်ငွေ) | autocomplete; QR က branch; ပထမ အားတဲ့ရက် |
| Peak-End | FINISH success (receipt no.), day closed ✓, payslip | Confirmation page + link save |
| Postel's Law | ဖုန်း / ငွေ / KBZPay ref ပုံစံ မျိုးစုံ လက်ခံ; Zawgyi → Unicode | ဖုန်း ပုံစံမျိုးစုံ; `?branch=b3`; bare URL redirect |
| Selective Attention | No-show alarm / discount decision ပဲ interrupt; realtime highlight | Announcement ≠ ad; closure notice ကွဲ |
| Serial Position | Home ပထမ / Settings နောက်ဆုံး; primary = footer နောက်ဆုံး | Branches ပထမ / Book နောက်ဆုံး |
| Tesler's Law | ဈေး / availability / expected cash / commission / payroll = system; "How calculated?" | Availability / ဈေး / ကားခ / သွားချိန် = system |
| Von Restorff | Primary ၁ ခု; exception flag (icon + စာ) | "Book now" တစ်ခုတည်း ထင်ရှား; Open / Closed |
| Working Memory | Checkout sticky header; reschedule old → new | Summary အမြဲမြင်; review + confirmation ထပ်ပြ |
| Zeigarnik | Open visit, pending approval, unverified KBZPay count + Continue | Progress; session ထဲ ပြန်ဝင်ရင် "Continue your booking?" |

### 10.5 Owner review checklist (D-PLT-18 #1) — *v5.2.8 status*

1. **★ Colour (OPEN-30)** — ⏸ owner: spec ထုတ်တဲ့အဆင့် (API design / OpenSpec) ရောက်မှ palette + design reference ပေးမယ် — Claude Code က အဲ့အချိန် တောင်း; approve blocker မဟုတ် → ရောက်ရင် `admin-panel.md` §3.1 `{{COLOR_…}}` ဖြည့်; AD-VIS-04 rule (AA contrast, destructive = အနီ, success / danger lightness ကွာ, chart ၆ ရောင် greyscale ခွဲနိုင်) စစ်။ Design reference ပုံ → frontend FE-VIS-01 (spacing / composition) — rule ပြောင်းရင် v1.3 note။
2. **Font (OPEN-31)** — ✅ 01/Oct: Pyidaungsu · Manrope / Inter (admin) · Archivo Black / Roboto (website)။ ကျန် = AD-VIS-05 စစ်ချက် (weight, licence ဖိုင်, tabular ဂဏန်း test) ကို token ဖိုင် commit မတိုင်ခင် တစ်ခါ လုပ်။
3. **Logo** — ⬜ PWA icon, receipt (monochrome), website header — ဖိုင် ပေးရန်။
4. **🟡 OPEN-32..37** — ✅ အကုန် (01/Oct): 32, 33, 35, 36 (မနက်) · 34 "OK" · 37 = admin / manager rating (V2 customer) · ⚠️ confirm ၂ ချက် ✅ (estimate line = effective flag — "အကုန် / တစ်ယောက်ချင်း" နှစ်မျိုး · app `ကျပ်` မပြောင်း) · "50" = lead time → 🔒 D-BKG-23 · DB Part 1 v3.4။
5. **MM စာသား** — `admin-panel.md` §13 + `frontend-website.md` §7 ရဲ့ ★ MM label / microcopy ကို ဆိုင်စကားနဲ့ ကိုက်အောင် ပြင် (ဥပမာ "Service done" = "ဝန်ဆောင်မှု ပြီးပြီ"?, Walk-in ကို ဘယ်လိုခေါ်)။
6. **Barber flow** — `admin-panel.md` §10.1–§10.5 (Today → Start → Checkout → Finish) ကို ဆိုင်လက်တွေ့နဲ့ တိုက် — tap အရေအတွက်၊ ဖုန်းမပါ case၊ Home visit။
7. **Bottom nav / menu** — AD-NAV-01/02 (item ၅ ခု၊ group ၇ ခု) ဆိုင်ခေါ်ပုံနဲ့ ကိုက်လား။
8. **Website** — ✅ toggle default OFF / owner ဖွင့်မှ ပြ (OPEN-21)၊ ✅ booking = modal (FE-BK-00)၊ ✅ Our barbers direct booking card (FE-HOME-05)၊ ✅ motion / TikTok / font · ⬜ confirmation page စာ (FE-CONF-03 — ၄၀ မိနစ် auto-cancel ကို customer ကို ပြောမလား ★)၊ customer cutoff တန်ဖိုး ★။
9. **⚠️ optional တွေ ရွေး** — သိန်း helper (AD-FORM-11), Storybook (AD-IMPL-06), analytics (FE-QA-04), `.ics` (REC-36), barber view (AD-CAL-06), change helper "Customer gave" (AD-POS-08), banknote counter (AD-CLS-01)။
10. မကြိုက်တဲ့ rule = **✖ + အကြောင်းပြချက်** (မဖျက် — D-PLT-11 ပုံစံ) → ပြင်ပြီး REC-39 / 40 approve → Appendix A **D-UX-03 / D-UX-04 🔒** → ACT-06 (repo ထဲ + CLAUDE.md)။

### 10.6 Guideline ရေးရင်း တွေ့တဲ့ gap နဲ့ API design မေးခွန်း

| # | တွေ့တာ | အမျိုးအစား | ဘယ်မှာ ဖြေမလဲ | Guideline default |
| --- | --- | --- | --- | --- |
| 1 | User ဘာသာ သိမ်းဖို့ `users` column မရှိ (D-PLT-03 "user switch") | **DB gap** | ✅ OPEN-33 (01/Oct) — `users.ui_language` → **Part 1 v3.3** | – |
| 2 | D-RPT-01 report ၁၀ ခု နာမည် ပျောက် | Register gap | ✅ (v5.2.8) OPEN-34 "OK" → AD-RPT-04 ၁၀ ခု = 🔒 D-RPT-01 | – |
| 3 | `site.show_prices` / `show_barbers` / `public_profile` vs `/book` (D-SVC-05, D-BKG-05) | ဆန့်ကျင်နိုင် | ✅ OPEN-35 (01/Oct) — Option A: toggle = info page ပဲ; booking modal မှာ ဈေး + barber အမြဲ | – |
| 4 | မြန်မာ ဂဏန်း / လနာမည် / AM-PM / receipt ဘာသာ | မဆုံးဖြတ်ရသေး | ✅ OPEN-32 (01/Oct) — 0–9, English MMM, AM/PM, **receipt = English** | – |
| 5 | D-COM-04 (checkout estimate ပြ) ↔ OPEN-10 (barber commission မြင်ရမလား) | ဖြစ်လာနိုင်တဲ့ conflict | ✅ (v5.2.8) — estimate ပြတာ = effective flag (company setting + per-barber override); တွက်တာ မပြောင်း — owner confirm | Effective flag ON barber ကိုပဲ estimate ပြ |
| 6 | 14 ရက် window (D-BKG-06) က staff booking ကိုပါ ကန့်သတ်လား | API question | API design | API အတိုင်း |
| 7 | Customer lead time (နောက် N မိနစ်အတွင်း booking မရ) — decision မရှိ | API question | ✅ (v5.2.8) 🔒 **D-BKG-23** — lead time မရှိ (owner: 10:00 → 10:05 ရ); earliest = next slot boundary | နောက် slot boundary |
| 8 | Receipt reprint ကို တခြားဘာသာနဲ့ ထုတ်ရလား (D-PAY-06 "စာသားတူ") | API question | ✅ ပိတ် — receipt = English အမြဲ (OPEN-32) → reprint = ပုံတူ | – |
| 9 | Customer change / cancel cutoff setting key + တန်ဖိုး (D-BKG-12) — Part 2/3 setting list ထဲ key မပါ | Setting | API design (`settings.json`) + ★ owner တန်ဖိုး | Setting အတိုင်း ပြ |
| 10 | Manage link ကို save ချိန် တစ်ခါပဲ ပြနိုင် (D-BKG-11 hash) | UI consequence (conflict မဟုတ်) | – | Copy / Share ချက်ချင်း (AD-BKG-02, FE-CONF-02) |
| 11 | FINISH မှာ ဖုန်းအသစ် ရိုက်ရင် `customers.name` NOT NULL → နာမည်လို (D-VIS-02 "နာမည် ထပ်မမေး" = ရှိပြီးသား customer အတွက်ပဲ) | UI consequence | – | Name field ပေါ်၊ Skip ရ (AD-POS-12) |
| 12 | Manage page route နာမည် (`/booking/[token]`)၊ website locale prefix (`/my`, `/en`) | ⚠️ guideline အကြံ | REC-39 approve | FE-IA-02, FE-MNG-01 |
| 13 | Discount ကို service line ပဲလား product line ပါ ခွဲမလဲ (D-PAY-04 စာသား ↔ DB line_discount) | ဆန့်ကျင်နိုင် | ✅ OPEN-36 (01/Oct) — service + product နှစ်မျိုးလုံး (D-PAY-04 update) | – |
| 17 | *(v5.2.7)* Website barber card **rating** — review / rating data မရှိ၊ V1 scope ✖ | Scope / DB gap | ✅ (v5.2.8) OPEN-37 = (ခ) admin / manager rating → `employees.public_rating` (Part 1 v3.4), "Point rating" caption; V2 = customer rating | – |
| 18 | *(v5.2.7)* Website ငွေ `Ks` ပဲ (owner) ↔ 🔒 D-PLT-04 MM = `ကျပ်` | 🔒 ကို ထိနိုင် | ✅ (v5.2.8) owner: admin app မပြောင်း — website ပဲ `Ks` (formatter profile) | – |
| 19 | *(v5.2.7)* OPEN-10 flag သိမ်းစရာ — settings = company / branch scope ပဲ (D-PLT-16) | DB gap | ✅ `employees.show_own_earnings` (Part 1 v3.3 → v3.4 nullable) + setting `dashboard.show_own_earnings_all` (settings.json) — "အကုန် / တစ်ယောက်ချင်း" | – |
| 20 | *(v5.2.7)* Booking modal ↔ D-BKG-01 / D-WEB-02 `/book` link + QR | Conflict မဟုတ် | – | URL ဆက်ရှိ (entry link → modal ဖွင့်); confirm = `/booking/[token]?new=1` page |
| 21 | *(v5.2.7)* Website barber card "current branch" = ဒီနေ့ shift → public endpoint + nightly revalidate | API question | API design (`GET /public/barbers`) | Fallback = assigned branches |
| 22 | *(v5.2.7)* Owner note "50 — တင်လို့ရပါတယ်" — rule မသိ | ❓ | ✅ (v5.2.8) = #7 lead time question → D-BKG-23 | – |
| 23 | *(v5.2.8)* Rating ကို ဘယ်သူ edit ရ — admin (`website.manage`) + manager (ကိုယ့် branch barber) → permission code | API question | API design (`permissions.json` key အသစ် / `website.branch_manage` ချဲ့) | Admin + manager in scope |
| 14 | Booking create idempotent မဟုတ် (`bookings.client_request_id` ✖) → retry မှာ manage link ပျောက်နိုင် | API question (DB gap ဖြစ်နိုင်) | API design | Claude အကြံ: browser ထုတ်တဲ့ manage token (hash unique ရှိပြီး — DB မထိ) |
| 15 | D-FIN-06 စာသားရဲ့ expected cash formula မှာ manual cash income မပါ၊ Part 7 DB CHECK မှာ ပါ | Register စာသား | Owner — D-FIN-06 စာသား ညှိ | DB အတိုင်း (manual cash income ပါ) |
| 16 | Proxy reason 2 OTHER အတွက် note field DB မှာ မရှိ (guideline က note ဖြုတ်ထား) | DB gap (အသေး) | လိုမှ Part 4 version bump | Note မမေး |

### 10.7 Claude Code မှာ ဘယ်လို သုံးမလဲ

- Repo: `docs/ux/admin-panel.md`, `docs/ux/frontend-website.md` (ACT-06) · OpenSpec project context ထဲ source အဖြစ် (D-PLT-17) · screen ပါတဲ့ OpenSpec change တိုင်း "UX rules: AD-… / FE-…" section။
- `CLAUDE.md` မှာ ထည့်ရန် (§5.6 rule တွေနဲ့ အတူ) —

```markdown
- UI rules: staff/admin screens follow docs/ux/admin-panel.md (AD-*), public site and /book follow
  docs/ux/frontend-website.md (FE-*). Cite rule IDs with decision IDs in specs and PRs.
- Precedence: docs/decisions (🔒) > db/ > docs/ux > Fresha. If a UX rule conflicts with a 🔒 decision, STOP and ask (D-PLT-13).
- Never invent colours or logos (D-UX-02). Use tokens from packages/ui/tokens.css; colour placeholders stay until the owner fills them.
  Fonts are fixed: Pyidaungsu (Myanmar), Manrope/Inter (admin), Archivo Black/Roboto (site) — no other font-family anywhere.
- Public booking is a modal (FE-BK-00); /book?branch= links open it. Motion = motion + gsap only, no 3D (FE-VIS-07).
- All UI text from the language files (my, en). Digits 0-9, English month, AM/PM in both languages; receipts always English.
  No raw strings, no raw status numbers, no float money.
- Build shared components (AD-IMPL-02) before feature screens; every screen passes the DoD in AD-QA-01 / FE-QA-01.
```

- Build အစဉ် (D-PLT-18 #3): token file + shared component + formatter + language file skeleton → walk-in → checkout → finish slice (AD §10.1–§10.5) → booking / calendar → closing → ကျန် module → public site။

### 10.8 Fresha ကနေ — အကျဉ်း (admin §11, frontend §12)

- **Adopt (၁၉)** — rail + sub-nav layout, barber column calendar + "Booking at <branch>" block, right drawer + sticky footer, payment method card (tap = ကျန်ငွေအပြည့်), split "To pay", refund per original payment + reason, irreversible wording, unsaved-changes guard, Expected / Counted / Difference, stocktake progress, import error tab, grouped global search, report preset / export, pricing table cascade, mobile bottom nav + centre "+", before → after activity, active sessions; public: breadcrumb step, right summary + Continue, category chip, "+" add, "Any professional" card, date strip + next available။
- **Improve (၂၀)** — double booking soft warning → DB block · logged-in-user attribution → performer chip · "Options" ထဲ ဝှက်ထားတဲ့ action → မြင်ရ · status ပြောင်းရင် drawer ပိတ် → ဖွင့်ထား · cancel / void / discount / register difference reason မလို → reason / approval · KBZPay ref မရှိ → ref + verify · branch ၁ ခု calendar → barber view · date format မညီ → formatter ၁ ခု · report ၂၆–၂၈ မိနစ် stale → live / timestamp · archive လုပ်ရင် booking ကျန် → စာရင်းပြ · cross-branch shift ထပ် → ပိတ် · transfer default 10 → ဗလာ · Burmese ✖ → MM / EN · central audit ✖ → audit viewer · hourly wage ပဲ → payroll wizard + payslip · spinner hang → skeleton · tip step → ✖ · leave "Approved" checkbox → status + booking စာရင်း။
- **Avoid** — marketplace, package / membership / gift card / loyalty, form / patch test, resource, AI concierge, client SMS / email automation, customer login wall (SMS code), review / rating, group / repeat appointment, "Download the app" banner, promo pop-up, client merge, "Late to work" blocked time, tip။

### 10.9 Owner အဖြေ (01/Oct မနက်) — guideline v1.1 ထဲ ဘယ်လို သွင်းထားလဲ *(v5.2.7)*

> Owner က guideline ၂ ဖိုင်ရဲ့ 🟡 / ★ မေးခွန်းတွေကို ဖြေလိုက်တယ်။ အောက်က table = အဖြေ တစ်ခုချင်း → ဘယ် rule / decision / DB ကို ဘယ်လို ပြောင်းလဲ။ ✅ = သွင်းပြီး · ⚠️ = Claude ရဲ့ ဖတ်ပုံ (owner confirm) · 🟡 = ဆက်ဖြေရန်။

**Admin panel (`admin-panel.md` v1.1)**

| # | Owner အဖြေ | သွင်းထားတာ | Rule / decision | Status |
| --- | --- | --- | --- | --- |
| A1 | OPEN-32 — ဂဏန်း 0–9၊ English month၊ AM/PM ပဲ၊ **receipt language English** | Formatter: data တန်ဖိုး = 0–9 / `Oct` / AM-PM ဘာသာ ၂ မျိုးလုံး (label ပဲ ဘာသာပြန်) · receipt = `en` language file + `*_en` snapshot (fallback `*_mm`) · reprint = ပုံတူ · go-live data = service / option / product EN နာမည် ဖြည့် | AD-FMT-02/03/10, AD-RCPT-01/02 · D-PLT-05, D-PAY-06 update | ✅ |
| A2 | OPEN-33 — language preference = **user account base** | `users.ui_language smallint NULL` (1 MY · 2 EN) + CHECK → **DB Part 1 v3.3** · session payload · OTP / notification email ကိုလည်း ဒီဘာသာ · cookie = ပထမ paint mirror | AD-L10N-06, AD-NAV-07 · D-PLT-03, D-DB-02 update | ✅ (⚠️ v3.3 confirm) |
| A3 | Font — Myanmar **Pyidaungsu**; English **Manrope / Inter** | `--font-myanmar` Pyidaungsu (400 / 700) · `--font-sans` Manrope (fallback Inter) · `--font-numeric` Inter (tabular) · "Manrope / Inter" = Manrope အရင်လို့ ဖတ် — ပြောင်းချင်ရင် stack လဲရုံ · licence ဖိုင် သိမ်း | AD §3.2, AD-VIS-05 · D-UX-02 update | ✅ |
| A4 | OPEN-34 — "သိပ်နားမလည်ဘူး၊ ရှင်းပြပါ" | ရိုးရိုး ရှင်းပြချက် (ChatGPT chat မှာ "report ၁၀ ခု" lock ခဲ့ပေမဲ့ နာမည်စာရင်း မကူးခင် chat ဖျက်မိလို့ ပျောက်) + 🔒 decision တွေကနေ ဆွဲထုတ်တဲ့ **အဆိုပြု report ၁၀ ခု** table (Sales summary · Barber performance · Payments & KBZPay · Discounts & refunds · Daily closing & cash · Expenses & P&L · Commission & payroll · Attendance & leave · Bookings & customers · Stock) | AD-RPT-04 | 🟡 owner "OK" / ပြင် |
| A5 | OPEN-10 — **default အကုန် OFF၊ admin က ပြစေချင်တဲ့ barber ကို ပြလို့ရတဲ့ ပုံစံ** | `employees.show_own_earnings boolean DEFAULT false` (Part 1 v3.3) · Employee › Pay tab switch (audit) · ON မှ: dashboard "My earnings" tile + checkout commission estimate line + menu · colleague figures ဘယ်တော့မှ ✖ | AD-DSH-01, AD-TODAY-01, AD-POS-07, AD-EMP-02, AD-PERM-05 · D-DSH-03 update | ✅ · ⚠️ D-COM-04 estimate line gating confirm |
| A6 | OPEN-20 — "လူအရေအတွက် မေးတာထက် လုပ်လို့ရအောင် လုပ်ထား" | Device count assumption ✖ · receipt **PDF / Share = device တိုင်း ပထမ ခလုတ်** · Print = Android capability flag · UI တူ | AD §1.1/1.2, AD-RCPT-02, AD-POS-13 · D-PAY-07 note | ✅ |
| A7 | OPEN-36 — "service line တွေရော product line တွေပါ အလွယ်တကူ ထည့်လို့ရအောင်" | Discount ကို **service + product line** ဈေးအချိုးနဲ့ ခွဲ (ကားခ ✖) · commission base = net service line (D-COM-02 မပြောင်း) · ဥပမာ 10,000 + 5,000, 10% → 9,000 / 4,500 | AD-POS-09 · D-PAY-04 update | ✅ |

**Frontend website (`frontend-website.md` v1.1)**

| # | Owner အဖြေ | သွင်းထားတာ | Rule / decision | Status |
| --- | --- | --- | --- | --- |
| F1 | Home — **Our barbers တစ်ယောက်ချင်း direct booking**; card = current branch, rating, description *(rating → §10.10 R1 ✅)* | `BarberCard`: ပုံ + နာမည် + **လက်ရှိ branch** (ဒီနေ့ `schedule_shifts` — မရှိရင် "Off today · usually at …") + **description** (`public_specialty_mm/_en` ≤ 200) + **Book with <name>** → modal (branch + barber preselected, `/book?branch=&barber=`) · `site.show_barbers` + `public_profile` ON မှ ပြ · nightly revalidate (`barbers` tag) · public endpoint `GET /public/barbers` (API design) | FE-HOME-05, FE-BR-05, FE-CMP-02a, FE-IA-07 · D-UX-05 | ✅ · rating = OPEN-37 → ✅ v5.2.8 (§10.10 R1) |
| F2 | Design ref ပုံ + colour palette — သပ်သပ် ပေးမယ်; theme = **minimalist and clean** | Theme rule (white space, accent ၁ ရောင်, flat, decorative shape / gradient / 3D ✖) · ★ palette → `tokens.css` · ★ design ref → spacing / composition (v1.2 note) | FE-VIS-01 · D-UX-05 · ★ OPEN-30 | ✅ theme · ⬜ palette / ပုံ |
| F3 | Font — **Archivo Black** (display), **Roboto** (text); Myanmar = Pyidaungsu | `(site)` font token override: `--font-display` Archivo Black (Latin heading ပဲ — Myanmar glyph မရှိ) · `--font-sans` Roboto 400 / 500 / 700 · `--font-myanmar` Pyidaungsu (မြန်မာ heading = Pyidaungsu Bold) · preload / subset rule | FE-VIS-02, FE-PERF-06, FE-IMPL-05 · D-UX-02 update | ✅ |
| F4 | SEO — **TikTok ပါ** | Social links = Facebook / TikTok / Viber (footer, JSON-LD `sameAs`) · OG + `twitter:card` · TikTok in-app browser မှာ စမ်း (360 px, modal) · pixel ✖ | FE-SEO-02/03, FE-IA-06, §1 · D-UX-05 | ✅ |
| F5 | Animation — **3D object မထည့်; Motion, GSAP; modern** | `motion` (modal, step, enter/exit) + `gsap` + ScrollTrigger (home scroll reveal) · 3D / WebGL / particle ✖ · ≤ 600 ms, opacity / transform ပဲ, loader ✖, parallax ✖ · **မြန်မာစာ character split ✖** (stacking ပျက်) · reduced-motion fallback · dynamic import after interactive (≈ 50 KB gzip) | FE-VIS-07, FE-PERF-08, FE-A11Y-06, FE-IMPL-05 · D-UX-05 | ✅ |
| F6 | OPEN-31 — Myanmar = Pyidaungsu | (F3) | FE-VIS-02 | ✅ |
| F7 | OPEN-32 — **7,000 Ks ပဲ**; English month (`01/Oct/2026`); AM/PM | Website formatter profile `site`: `Ks` ဘာသာ ၂ မျိုးလုံး, `DD/MMM/YYYY` English month, AM/PM, 0–9 · ⚠️ D-PLT-04 (MM = `ကျပ်`) = admin app အတွက် ဆက်ရှိ | FE-FMT-01, FE-META-06 · D-PLT-04 note | ✅ website · ⚠️ app confirm |
| F8 | OPEN-35 — **`/book` မထားဘဲ Modal Box / Pop-up Box**; Option A ("Booking တင်မှတော့ ဈေးပြရမှာပေါ့") | **FE-BK-00 booking modal**: desktop dialog 1040 px / mobile full-screen sheet · Book CTA တိုင်း page ပေါ် ဖွင့် · `/book`, `/book?branch=`, `/book?branch=&barber=` = entry link (QR / social — D-BKG-01 ဆက်အလုပ်ဖြစ်) → page + modal ဖွင့်ထား · URL state `?book=1&…` (Back / refresh / share) · ✕ / Esc / Back = "Leave booking?" guard · focus trap · **Confirm → `/booking/[token]?new=1` page** (manage link မပျောက်အောင်) · no-JS / crawler fallback · lazy chunk + prefetch · Option A: toggle = info page ပဲ, modal မှာ ဈေး + barber နာမည် အမြဲ, closure = ပိတ်ရက်ပဲ | FE-BK-00/01/02/05/07/12/13/14/16, FE-CONF-00, FE-IA-01, FE-GLB-04, FE-CMP-02b, FE-MNG-01/03, FE-QA-02 · D-UX-05 · OPEN-35 ✅ | ✅ |
| F9 | OPEN-21 — "ဟုတ်တယ်၊ owner က admin panel ကနေ ထည့်လိုက်မှ ပြပေးမှာ" | `site.show_prices` / `site.show_barbers` / `employees.public_profile` = **default OFF**; admin Website › Site content / Team public profiles မှာ ဖွင့် · toggle row တိုင်း "ဘာကို ပြောင်းလဲ" help text · domain = ACT-05 ကျန် | FE-HOME-03/05, FE-BR-03, AD-WEB-02, AD-EMP-02 · D-WEB-01 update | ✅ toggle · ⬜ domain / ဖွင့်ချိန် data |
| F10 | "50 — တင်လို့ရပါတယ်" | ဘယ် rule ကို ဆိုလိုမှန်း မသိ (frontend §14 OPEN-21 နောက်) — rate limit 50/hour လား? | – | ❓ owner ပြန်မေး |

**DB** — Part 1 v3.2 → **v3.3**: `users.ui_language` (A2) + `employees.show_own_earnings` (A5) · `part1-foundation-v3.3.dbml`, `part1-foundation-v3-constraints.sql` (`users_ui_language_chk`), `_generated-tables-part1-8.sql`, README · PostgreSQL 16: table ၉၁ ဆက်တူ၊ CHECK test ✅၊ Part 3 (30/30) + Part 8 (45/45) regression PASS · ⚠️ owner confirm → D-DB-02 row။

**Owner ဆီက ကျန်တာ (approve မတိုင်ခင်)** — ★ OPEN-30 colour palette + design reference ပုံ · 🟡 OPEN-34 report ၁၀ ခု confirm · 🟡 OPEN-37 rating · ⚠️ D-COM-04 estimate gating confirm · ⚠️ app `ကျပ်` / `Ks` confirm · ❓ "50" · DB v3.3 confirm · logo ဖိုင် (§10.5 #3)။ → *v5.2.8: §10.10 မှာ အကုန် ဖြေပြီး*

### 10.10 Owner ဒုတိယအကြိမ် အဖြေ (01/Oct 10:47) — guideline v1.2 *(v5.2.8)*

| # | Owner အဖြေ | သွင်းထားတာ | Rule / decision | Status |
| --- | --- | --- | --- | --- |
| R1 | Rating — "လောလောဆယ် ADMIN, Manager ကပေးတဲ့ rating ပဲ; V2 မှာ customer rating" | `employees.public_rating numeric(2,1) NULL` (1.0–5.0, 0.5 ခြား CHECK — Part 1 v3.4) · Employee › Profile (website section) မှာ ထည့် — admin + manager (ကိုယ့် branch barber; permission code = API design) · website card = ★ + ဂဏန်း + **"Point rating" / "Point ရဲ့ သတ်မှတ်ချက်" caption** (customer review လို့ မထင်အောင် — FE-COPY-03) · NULL = row မပြ · V2 customer rating ရောက်ရင် source ပြောင်း | FE-HOME-05, FE-CMP-02a, FE-COPY-02/03, AD-EMP-02, AD-WEB-02 · D-UX-05 update | ✅ OPEN-37 |
| R2 | Commission estimate — "အကုန်လုံးလဲ ပြလို့ရတယ်၊ တစ်ယောက်ချင်းလဲ ပြရလို့ရတယ် မဟုတ်လား" | ၂ ဆင့်: company setting **`dashboard.show_own_earnings_all`** (Settings › Dashboard, default OFF — settings.json, migration ✖) + per-barber **`employees.show_own_earnings`** (NULL = setting လိုက် / true / false — v3.4 nullable; Pay tab ၃ ခု ရွေး) · effective = COALESCE · dashboard tile / checkout estimate line / My earnings menu = effective flag · D-COM-04 တွက်တာ မပြောင်း | AD-DSH-01, AD-TODAY-01, AD-POS-07, AD-PERM-05, AD-EMP-02, AD-SET-01 · D-DSH-03 update, D-COM-04 confirm | ✅ |
| R3 | "Admin က မပြောင်းဘူး။ Website မှာပဲ ပြောင်းမှာ" | Admin app = 🔒 D-PLT-04 (`Ks` / `ကျပ်`) အတိုင်း; website = `Ks` ဘာသာ ၂ မျိုး (formatter profile `app` / `site`) | AD-FMT-01, FE-FMT-01 · D-PLT-04 note | ✅ confirm |
| R4 | "50 — တင်လို့ရပါတယ်" = API question: customer 10:00 → 10:05 booking ရမလား → ရ | **Lead time မရှိ** — earliest = now ပြီးနောက် ပထမ slot boundary (default 15 → 10:15; interval 5 → 10:05) · booked barber realtime · no-show timer = booking အချိန် | FE-BK-08, AD-TODAY-04 · 🔒 **D-BKG-23** (new) | ✅ |
| R5 | Colour palette + design ref — "develop spec ထုတ်တဲ့အခါ ပေးမယ်၊ အဲ့အခါ တောင်းခိုင်း" | ★ OPEN-30 timing = API design / OpenSpec အဆင့် (D-PLT-18 #2); Claude Code က အဲ့အချိန် တောင်း; approve blocker ✖; အဲ့အထိ `neutral` scaffolding | FE-VIS-01, AD §3.1, §0.4, §10.5 | ⏸ (timing ✅) |
| R6 | "OPEN-34: OK" | AD-RPT-04 ရဲ့ report ၁၀ ခု = 🔒 (Sales summary · Barber performance · Payments & KBZPay · Discounts & refunds · Daily closing & cash · Expenses & P&L · Commission & payroll · Attendance & leave · Bookings & customers · Stock) · ဆောက်ရမယ့် အစဉ် = template → #1, #5, #6, #7 (ပထမ လကုန် အတွက်) → ကျန် | AD-RPT-04 · D-RPT-01 update | ✅ OPEN-34 |

**DB** — Part 1 v3.3 → **v3.4**: `employees.show_own_earnings` nullable + `employees.public_rating` + CHECK `employees_public_rating_chk` · setting key `dashboard.show_own_earnings_all` = `settings.json` (D-PLT-16 — migration ✖) · PostgreSQL 16: table ၉၁၊ CHECK test ✅၊ Part 5 (72/72) + Part 8 (45/45) regression PASS · zip v4။

**Owner ဆီက ကျန်တာ** — ~~guideline ၂ ဖိုင် (v1.2) ဖတ်ပြီး ✖ / approve (REC-39 / 40)~~ ✅ **01/Oct 11:09 approved → 🔒 D-UX-03 / 04** · ★ OPEN-30 = spec အဆင့် · logo ဖိုင် · ★ customer cutoff တန်ဖိုး + no-show စာသား (setting / language file — go-live data)။

---

## 11. API Design — REST + OpenAPI, part လိုက် (v5.2.9)

> **Owner (01/Oct 11:09):** "ဒါကိုပဲ lock လုပ်လိုက်တော့မယ်။ API Design ကို ဆက်သွားမယ်။" → 🔒 D-UX-03 / 04 · **D-PLT-18 #2 စ**။ *v5.2.10 (11:54):* owner အဖြေ ၃ ချက် → **Part 0 / 1 v1.1 → v1.2** (§11.5 — v1.2 = independent review fix §12.6) + architecture review (§12)။ *v5.2.11 (13:00):* owner "API part 2 ဆက်ပါ၊ ဘယ်နှပိုင်း" → **API = Part 0 + Part 1–8 (ဖိုင် ၉ — DB part ၈ နဲ့ တူ)** · **Part 2 draft v1.1** (§11.6)။ *v5.2.13 (21:20):* Part 0 / 1 / 2 🔒 (§11.7)။ *v5.2.14 (23:30):* scope A (ADR-012) → Part 0 v1.4 / 1 v1.4 / 2 v1.3 · **Part 3 draft v1.0** (§11.8)။ DB design (D-PLT-12) လိုပဲ **part လိုက်** — draft → owner review → 🔒 D-API-nn → နောက် part။ Source = Appendix A + `db/` + `docs/ux/` (screen တိုင်းရဲ့ data / action) + review §5.2 / §5.5 / §5.8။

### 11.1 ဖိုင်နဲ့ အခြေအနေ

| Part | ဖိုင် (ဒီ chat ကထုတ်) | Repo path | ပါဝင်တာ | Status |
| --- | --- | --- | --- | --- |
| **0 Conventions + module map** | `api/api-00-conventions-v1.5.md` | `docs/api/00-conventions.md` | §1 surface ၃ မျိုး · §2 session / CSRF · §3 permission + branch scope guard (**API-PERM-06 = menu CRUD + special action, `view⁺`, company admin = role ၅ code — ADR-011**) · §4 data · §5 error (RFC 9457 + language key) · §6 idempotency (API-IDEM-03 = client token) · §7 audit / headers · §8 realtime event catalogue (Part 2 event ပါ) · §9 public API + revalidate · §10 rate limit (Turnstile · 10 / IP · 3 / ဖုန်း) · **§11 module map** · §12 owner decision ၈ ✅ | 🔒 **v1.3 — D-API-01 (01/Oct 21:20)** · **v1.4 = scope A (API-PERM-02 / 07 — ADR-012)** · **v1.5 (02/Oct — one-sheet + Part 4–8): `private` level · final `Idempotency-Key` list (၁၃) · API-IDEM-06 lock အစဉ် / isolation / `PayrollLock` · realtime ၅၈ · error code ညှိ · module map Part 3–8 final (endpoint ၄၄၁ · code ၁၇၄)** |
| **1 Foundation & Access** | `api/api-01-foundation-v1.5.md` + `api/openapi/part1-foundation-v1.5.yaml` | `docs/api/01-foundation.md` + `openapi/part1-foundation.yaml` | rule ၁၃ · **endpoint ၅၂** (auth ၆ · me ၅ · company ၂ · branches ၅ · employees ၁၇ · roles / permissions ၇ · settings ၅ · system ၅) · **permission code ၂၁ (CRUD — ADR-011)** · P1-RULE-05 read scope · P1-RULE-11 field group · P1-RULE-12 company admin (role ၅ code) / last-admin · picker filter (Part 2) · client-readable setting ၈ · realtime ၃ · DTO · owner decision ၆ ✅ · **OpenAPI 3.1 validate ✅ (operation ၅၂, `1.5.0` — v5.2.15, `x-permission`)** | 🔒 **v1.3 — D-API-02 (01/Oct 21:20)** · **v1.4 = P1-RULE-13, settings mixed** · **v1.5 (02/Oct): settings key ထည့် / ဖြုတ် · `site.*` read-only (Part 8 ကပဲ ရေး) · `level` += `private` · logo / photo = staging attachment · job list ၁၈** |
| **2 Catalogue & Scheduling** | `api/api-02-catalogue-scheduling-v1.4.md` + `api/openapi/part2-catalogue-scheduling-v1.4.yaml` | `docs/api/02-catalogue-scheduling.md` + `openapi/part2-catalogue-scheduling.yaml` | rule ၁၂ (P2-RULE — **P2-RULE-11 = operational read open / management read `view⁺`**) · **endpoint ၅၀** · **permission code ၂၂ (CRUD)** · realtime ၇ · error code · setting ၆ (read) · DTO · owner decision ၁၁ ✅ (§16) · §17 independent review · **OpenAPI 3.1 validate ✅ (operation ၅၀, `1.4.0` — v5.2.15, `x-permission`)** | 🔒 **v1.2 — D-API-03 (01/Oct 21:20)** + DB v1.3 🔒 · **v1.3 = service master company / ရောင်း + ကြာချိန် branch** · **v1.4 (02/Oct): quote window = မပိတ်ရသေးတဲ့ ရက်မဆို (B11) · finalize ပြီး period ထဲ shift / leave = 423 · ကိုယ့် shift ကိုယ်ပြင် (≤ ဒီနေ့) = 422 `self_action` (C11) · attendance ပြန်စစ် · late-entry visit = busy မတွက် (B1)** |
| **3 Customers & Booking (+ public)** | `api/api-03-customers-booking-v1.1.md` + `api/openapi/part3-customers-booking-v1.1.yaml` | `docs/api/03-customers-booking.md` + `openapi/part3-customers-booking.yaml` | rule ၁၃ (P3-RULE — customer identity · create pipeline · reschedule ဈေး · no-show job · row lock · public) · **endpoint ၃၈** (customer ၉ · cancel reason ၅ · booking ၁၂ · public ၁၂) · **permission code ၁၂** (`customer.*` shared · `booking.*` · `booking_cancel_reason.*`) · realtime ၅ · error · setting ၄ · DB မပြင် · QR → Part 8 | ⚠️ **draft v1.0 — D-API-04 lock ရန် (§0.8)** → 🔒 **D-API-04 (02/Oct — A1–A3) v1.1: B4 နည်းတဲ့ဈေး · public မဟုတ်တဲ့ branch booking link ရ · ပိတ်ရက်ထဲ booking = no-show job မထိ (F8)** |
| **4 Visits, Sales & Payments** | `api/api-04-visits-sales-payments-v1.0.md` + `api/openapi/part4-visits-sales-payments-v1.0.yaml` | `docs/api/04-visits-sales-payments.md` + `openapi/part4-visits-sales-payments.yaml` | rule ၂၂ (P4-RULE) · **endpoint ၅၅** (visit ၆ · sale ၁၄ · payment ၇ · discount code ၇ · discount request ၆ · refund ၃ · adjustment ၁ · receipt ၄ · request lookup ၁ · payment method ၆) · **code ၂၂** · `Idempotency-Key` ၅ (START · product-only sale · ကွာငွေ sale · payment · refund) · `EffectiveSale` · DayLock / PayrollLock caller | 🔒 **D-API-05 (02/Oct) v1.0** |
| **5 Commission, Payroll & Attendance** | `api/api-05-commission-payroll-attendance-v1.0.md` + `api/openapi/part5-commission-payroll-attendance-v1.0.yaml` | `docs/api/05-commission-payroll-attendance.md` + `openapi/part5-commission-payroll-attendance.yaml` | rule ၂၀ (P5-RULE) · **endpoint ၆၉** (plan ၇ · assignment ၄ · commission ၂ · salary ၆ · payroll category ၅ · run ၁၆ · advance / loan ၈ · payslip ၃ · own attendance ၄ · attendance record ၉ · exception ၂ · QR ၃) · **code ၂၃ (private ၁၆)** · `Commission.estimate` · `PayrollLock` · `Receivables.*` · `Attendance.*` | 🔒 **D-API-06 (02/Oct) v1.0** · ⚠️ OPEN-40 (a)(b) mechanism |
| **6 Inventory** | `api/api-06-inventory-v1.0.md` + `api/openapi/part6-inventory-v1.0.yaml` | `docs/api/06-inventory.md` + `openapi/part6-inventory.yaml` | rule ၁၆ (P6-RULE) · **endpoint ၅၈** (category ၆ · product ၇ · supplier ၇ · adjustment reason ၅ · stock level / ledger / usage / adjustment ၈ · purchase ၈ · transfer ၉ · count ၈) · **code ၂၈** · `StockLedger.post` · job `stock.reconcile_levels` | 🔒 **D-API-07 (02/Oct) v1.0** · ⚠️ OPEN-40 (c) mechanism |
| **7 Finance & Closing** | `api/api-07-finance-closing-v1.0.md` + `api/openapi/part7-finance-closing-v1.0.yaml` | `docs/api/07-finance-closing.md` + `openapi/part7-finance-closing.yaml` | rule ၁၉ (P7-RULE) · **endpoint ၅၀** (closing ၅ · cash out ၆ · cash return ၃ · reason ၆ · category ၁၂ · expense ၈ · income ၈ · P&L ၂) · **code ၂၇** · `DayLock` · `DailyClosings.*` · `Expenses.*` · `Pnl.compute` · job `closing.month_end_must_return` | 🔒 **D-API-08 (02/Oct) v1.0** · ⚠️ OPEN-40 (a) mechanism |
| **8 Platform** | `api/api-08-platform-v1.0.md` + `api/openapi/part8-platform-v1.0.yaml` | `docs/api/08-platform.md` + `openapi/part8-platform.yaml` | rule ၂၀ (P8-RULE) · **endpoint ၆၉** (notification ၅ · type ၂ · attachment ၅ · employee document ၂ · audit ၂ · import ၁၀ · export ၄ · backup ၄ · internal ၃ · website ၁၂ · public ၅ · report ၁၁ · dashboard ၄) · **code ၁၉** · notification catalogue ၄၁ · settings `site.*` | 🔒 **D-API-09 (02/Oct) v1.0** |

- **ဘာသာ:** Part 0 / 1 = English (developer / Claude Code အတွက်) + ထိပ်မှာ မြန်မာ အတိုချုပ် — guideline ပုံစံတူ။ ID = `API-<AREA>-nn` (convention) · `P1.<MODULE>.<nn>` (endpoint)။
- **Tag:** 🔒 (decision ကနေ) · ⚠️ (design rule — part lock မှ binding) · 🟡 (owner) · ★ (တန်ဖိုး)။
- **Precedence (API-META-01):** Appendix A 🔒 > `db/` > `docs/ux/` 🔒 > convention > part ဖိုင် > OpenAPI (code ကနေ generate — part ဖိုင်နဲ့ ကိုက်ရ)။

### 11.2 Part 0 / 1 ရဲ့ အဓိက design ချက် (owner ဖတ်ရန်)

- **API ၂ မျိုး ခွဲ** — staff `/v1` (cookie + `@Can` permission + branch scope — D-ROLE-03) · public `/v1/public` (login ✖, captcha + rate limit — D-BKG-21, public DTO ပဲ — customer / staff data ✖) · internal (job / revalidate)။
- **Login** = Google / email OTP ၈ လုံး (D-AUTH) → server session cookie (D-AUTH-06) + CSRF header; neutral response (email ရှိ / မရှိ မသိ)။ **`GET /v1/me`** = app bootstrap (permission + scope + ကိုယ့်ဝင်ငွေ effective flag + ဒီနေ့ branch + setting)။
- **ငွေ endpoint = `Idempotency-Key`** (`client_request_id` — D-VIS-10); replay = 200 same resource။ **Booking create** = client manage token နဲ့ idempotent (🔒 ADR-004 — DB မပြင်)။
- **Error** = RFC 9457 + `code` = language key (screen က MM / EN) · status code = number (D-DB-03) · money integer · `+06:30`။
- **Employee API** = user + employee တစ်ခါတည်း (D-EMP-02); status ပြောင်း = session revoke + future bookings warning (D-BKG-19 — မဖျက်); role assignment per branch scope (D-ROLE-05 / 06) + escalation ✖; rating `PUT …/public-rating` (D-UX-05)။
- **Settings API** = `settings.json` definition + effective (branch → company → default) + history (D-PLT-16)။
- **Realtime** = Socket.IO rooms (user / branch / company) + event catalogue (Part 0 §8)။

### 11.3 Owner ဆုံးဖြတ်ရန် (Part 0 §12 + Part 1 §13) — ✅ အကုန် ဖြေပြီး (01/Oct 21:20 — §11.7)

| # | မေးခွန်း | Claude default | ဖိုင် |
| --- | --- | --- | --- |
| 1 | **Booking create idempotency** — owner (11:54): "server မှာ သိမ်းတာနဲ့ DB မှာ သိမ်းတာ ဘယ်ဟာ ပိုကောင်းလဲ" → **A (client က manage token ထုတ်၊ server hash သိမ်း — DB မပြင်) အကြံပြု**; B (`bookings.client_request_id` + server token) က replay မှာ manage link ပြန်မပေးနိုင် — အကြောင်းရင်း §11.5 / ADR-004; "OK" ဆို 🔒 | **A** (ADR-004) | Part 0 §12 #1 (API-IDEM-03) |
| 2 | ~~🟡 14 ရက် advance window (D-BKG-06) **staff booking** ကိုပါ ကန့်သတ်လား~~ ✅ **owner 11:54: staff ပါ ကန့်သတ်** → 🔒 D-BKG-06 update (setting တစ်ခုတည်း၊ 422 `outside_window` နှစ်ဖက်) | ✅ | Part 0 §12 #2 |
| 3 | ★ Public rate limit — booking 10 / နာရီ / IP · 3 / နာရီ / ဖုန်း | Default အတိုင်း | Part 0 §12 #3 |
| 4 | ★ Domain (ACT-05) — cookie / CORS | `.env` placeholder | Part 0 §12 #4 |
| 5 | Captcha provider — Turnstile (Google account မလို, အခမဲ့) vs reCAPTCHA v3 | Turnstile | Part 0 §12 #5 |
| 6 | Wire မှာ status code = number (D-DB-03) | Number | Part 0 §12 #6 |
| 7 | ~~Permission code အသစ် ၈ ခု (Part 1 §10)~~ ✅ **owner 11:54: admin က permission နဲ့ adjust → granular action code (Part 1 = ၁၃)**, part တိုင်း code စာရင်း ထည့် — ADR-010 | ✅ | Part 0 §12 #7, Part 1 §10 |
| 8 | ~~**Manager က ကိုယ့် branch barber ကို ဘာတွေ ပြင်ခွင့်ရလဲ**~~ ✅ **owner 11:54: code ထဲ fixed ✖ — admin က role matrix မှာ ရွေး** (`employee.profile_manage` / `rating_manage` / `earnings_manage` / `status_manage` / `access_manage` / `branch_assign`; PATCH field group → 403 + `errors[]`) | ✅ | Part 1 §13 #1 |
| 9 | Employee ဖန်တီးတာနဲ့ invite email ချက်ချင်း ပို့ (default) vs admin နောက်မှ ပို့ | ချက်ချင်း | Part 1 §13 #2 |
| 10 | `/me` ထဲ ပါမယ့် client-readable setting list | booking / sales flag / closing tolerance / home fee / language / upload | Part 1 §13 #3 |
| 11 | Branch code rule `^[A-Z0-9]{1,10}$` (B1 / B2 / B3) | အတိုင်း | Part 1 §13 #4 |
| 12 | Employee picker (`GET /v1/employees/pickable`) ရဲ့ service / home eligibility filter = Part 2 lock ပြီးမှ | Branch-assigned ပဲ | Part 1 §13 #5 |
| 13 | ⚠️ **Single origin** *(v5.2.10 — system design review)* — API = `app.<domain>/api/v1/…` + `<domain>/api/v1/public/…` (Caddy path routing; CORS ✖; cookie host-only; 4G preflight ✖) vs `api.<domain>` subdomain — ADR-009 | Single origin | Part 0 §12 #8 (API-SHAPE-01) |

"OK" ဆိုရင် Part 0 / 1 (v1.2) ကို 🔒 D-API-01 / 02 ပြောင်းပြီး Part 2 ဆက်။ *(v5.2.10: ကျန် = #1, #3, #4, #5, #6, #9, #10, #11, #12, #13 — ၁၀ ချက်; #2 / #7 / #8 ✅)* မကြိုက်တဲ့ rule = ✖ + အကြောင်းပြချက် (D-PLT-11 ပုံစံ)။

### 11.4 Claude Code မှာ သုံးပုံ

- Repo: `docs/api/*.md` + `openapi/*.yaml` (part lock ပြီးတိုင်း) · `CLAUDE.md` ထဲ: "API rules: follow docs/api/00-conventions.md (API-*) and the part file; cite endpoint IDs (P1.EMP.04) with decision + UX rule IDs; every money POST needs Idempotency-Key; every endpoint declares @Can / @Public / @Internal; errors are problem+json with a language-key code."
- OpenSpec change တစ်ခု = module တစ်ခု (D-PLT-17): spec delta ထဲ endpoint table + OpenAPI fragment ကို reference; implement → `openapi.json` generate → `openapi/partN-*.yaml` နဲ့ diff (CI) → client type `packages/shared/api` generate။
- Build အစဉ် (D-PLT-18 #3): Part 1 (auth / me / employees / settings) → shared UI component → Part 2 → Part 3 + 4 (walk-in → checkout slice) → 7 (closing) → 5 → 6 → 8 → public site။

### 11.5 Owner အဖြေ ၃ ချက် (01/Oct 11:54) — Part 0 / 1 v1.1 → v1.2 ထဲ ဘယ်လို သွင်းထားလဲ *(v5.2.10)*

| # | Owner | ဖတ်ပုံ / ဖြေပုံ | ဘယ်မှာ ပြောင်း |
| --- | --- | --- | --- |
| 1 | "server မှာ သိမ်းတာနဲ့ db မှာ သိမ်းတာ ဘယ်ဟာ ပိုကောင်းလဲ" (booking idempotency) | ၂ နည်းလုံး server က စစ်၊ DB ထဲ သိမ်း — ကွာတာ = **token ထုတ်သူ + column အသစ် လို / မလို**။ **A = client (browser / app) က manage token ထုတ် → server က hash ပဲ သိမ်း** (`manage_token_hash` unique ရှိပြီး — DB မပြင်); **B = `bookings.client_request_id` column အသစ် + server က token ထုတ်** (Part 3 v3.1)။ **A ပိုကောင်း** — reply ပျောက်ပြီး retry ရင် B က manage link (customer လက်ထဲ တစ်ခုတည်းသော record၊ တစ်ခါပဲ ပြနိုင် — D-BKG-11; server မှာ hash ပဲ) ကို ပြန်မပေးနိုင်; A က client လက်ထဲ token ရှိလို့ booking ရော link ရော ပြန်ရ။ Token = browser CSPRNG 32 byte (server က format စစ်) — အားနည်းရင် ကိုယ့် booking ကိုယ်ပဲ ထိ။ Payload မတူဘဲ token တူရင် 409 `idempotency_mismatch`။ | API-IDEM-02 (mismatch = identifying field နှိုင်း) · API-IDEM-03 (A အကြံပြု) · **ADR-004** · owner "OK" → 🔒 |
| 2 | "Manager ရဲ့ လုပ်ပိုင်ခွင့်ကို Admin က permission မှာ လိုအပ်သလို adjust လုပ်လို့ရတယ်" | Part 1 v1.0 ရဲ့ "manager က profile + rating ပဲ" fixed rule ✖ → **action တစ်ခုချင်း permission code**; admin က role matrix (AD-PERM-07) မှာ Manager role ကို compose; code ထဲ guard rail ၂ ချက်ပဲ (no escalation — ကိုယ်မရှိတဲ့ permission / scope မပေးရ; company admin ကလွဲ · no last-admin lockout — P1-RULE-12) | API-PERM-06 · P1-RULE-11 (PATCH field group → 403 + `errors[]`) · P1-RULE-12 · Part 1 §10 code ၁၃ (`employee.create / profile_manage / rating_manage / earnings_manage / status_manage / access_manage / branch_assign`, `employee.view`, `company.manage`, `branch.manage`, `role.manage`, `role.assign`, `settings.view`) · EMP.02 / 04 / 05 / 07 / 08 / 12 / 13 / 14 / 15 / 16 perm column · OpenAPI summary · **ADR-010 Accepted** · D-ROLE-02 note |
| 3 | "staff booking ပါ ကန့်သတ်ထားတယ်" (14 ရက် window) | setting `booking.advance_window_days` (default 14) = public + staff; 422 `outside_window` နှစ်ဖက်; admin ပြောင်းရင် နှစ်ဖက် လိုက် | Part 0 §12 #2 ✅ · **🔒 D-BKG-06 update** · admin guideline §15 question = ပိတ် (🔒 ဖိုင် မထိ — register note) |

- **v1.1 ထပ်ပြောင်းတာ (system design review ကနေ):** API-SHAPE-01 = origin တစ်ခုတည်း `/api` path (ADR-009 ⚠️ — Part 0 §12 #8 အသစ်) · changelog header ၂ ဖိုင်။
- **v1.2 (independent review §12.6):** Part 0 — API-AUTH-01 cookie host-only (`Domain` ✖) + `Max-Age` 400 ရက် · API-AUTH-02 Origin = app host · API-SHAPE-01 / 02 edge rule (public host = `/api/v1/public/*`, `/health`, `/system/status` ပဲ; `/internal/*` ✖) · API-RT-01 Socket.IO path `/rt` (namespace ✖) · API-PERM-06 company admin · API-IDEM-03 `manage_url` replay · API-PUB-03 `site.revalidate` job · §12 #4 · Part 1 — P1.AUTH.03 `client=` · P1.AUTH.04 hand-off redirect · **P1.AUTH.06 `POST /v1/auth/handoff`** · **P1.SYS.05 `GET /v1/system/jobs`** · P1.SYS.01 liveness ပဲ · P1-RULE-12 · EMP.05 / 11 / 11b / RL.05 / 06 `last_admin` · §10 code ၁၃ · error `handoff_invalid` · **endpoint ၅၂** · OpenAPI `1.2.0-draft` validate ✅ (path ၄၂ · operation ၅၂, `servers: /api/v1`)။
- **ဖိုင်:** `api/api-00-conventions-v1.2.md` · `api/api-01-foundation-v1.2.md` · `api/openapi/part1-foundation-v1.2.yaml` (v1.0 / v1.1 ကို replace)။

### 11.6 API Part 2 — Catalogue & Scheduling draft v1.1 (01/Oct 13:00) *(v5.2.11)*

**ဘာတွေ ပါလဲ (owner ဖတ်ရန်)**

- **Service** = company master တစ်ခု (D-SVC-01) → branch အလိုက် "ရောင်း / ကြာချိန်" (D-SVC-02) → website field (Part 8)။ **Option ဇယား** (ဥပမာ ဆိုးဆေး: အရောင် × အရှည်) — admin က group ≤ 2 + value သတ်မှတ် → system က ကွက် (variant) ထုတ်; ကွက်လပ် = ဒီ branch မှာ မရောင်း (D-SVC-05)။
- **ဈေး = table တစ်ခုတည်း, ရှာပုံ fixed** (P2-RULE-03): ရက်မှာ သက်ရောက်တဲ့ row → barber override → branch ဈေး; အိမ် = HOME row မရှိရင် branch ဈေး (override ✖); row မရှိ = မရောင်း။ **ဈေးပြင် = "ဒီရက်ကစ"** (D-SVC-08) — ဟောင်း history ကျန်; scheduled grid ကို မသက်ရောက်ခင် ပြင် / withdraw ရ (P2-RULE-04 — DB CHECK / EXCLUDE နဲ့ ကိုက်အောင် ၅ ဆင့်)။ **Price quote** = ဈေးတွက်တဲ့ နေရာ တစ်ခုတည်း — booking (Part 3) / checkout (Part 4) ဒါကိုပဲ ခေါ် (D-SVC-04)။
- **Eligibility** = employee × branch × service + home ✔ + effective date (D-EMP-05); picker (`/employees/pickable?service_id=…&home=`) ကို ဒီနဲ့ filter (Part 1 §13 #5 ✅)။
- **Schedule** = အပတ်စဉ် pattern (segment = branch + start + end; branch ပြောင်းရင် ၆၀ မိနစ် ခြား — D-SCH-02) → shift: pattern save ချိန် ချက်ချင်း + ညတိုင်း job (diff — မပြောင်းရင် row မပြောင်း; attendance ချိတ်ထားတဲ့ shift မထိ)။ Roster မှာ တစ်ရက်ချင်း ပြင် = **manual day** (pattern က အဲ့နေ့ကို မထိတော့; "reset" နဲ့ pattern ပြန်သုံး)။ Booking ကို ဘယ်တော့မှ auto မဖျက် — conflict list (D-BKG-19)။
- **ခွင့်** (D-LV-01..05): ကိုယ်တိုင် / `leave.manage` က ကိုယ်စား → PENDING ကတည်းက booking ပိတ် (D-LV-04) → `leave.approve` (ကိုယ့်ဟာ ကိုယ် ✖ ⚠️) · ခွင့်ကာလထဲ booking = approver ကို list; half-day = နေ့ခွဲချိန် 13:00 (D-LV-05)။
- **Availability function တစ်ခုတည်း** (P2-RULE-10, §6.4b A-2): item စစ် → candidate barber → block = travel + Σ duration + Σ buffer + travel → free = ဒီ branch shift − booking block (branch မတူလည်း) − leave − လုပ်နေဆဲ walk-in − ပိတ်ရက် − now (နောက် slot boundary — D-BKG-23) → slot grid 15 မိနစ် → "any barber" = union + အဲ့ slot မှာ အားတဲ့ barber list (customer ရွေး — D-BKG-05)။ Dates = today … +14 (staff ပါ — D-BKG-06)။ Cache ✖။
- **Permission code ၇** (ADR-010 granular): `service.manage` (company) · `price.manage` (branch) · `employee.eligibility_manage` (branch) · `schedule.manage` (branch) · `leave_type.manage` (company) · `leave.manage` (branch) · `leave.approve` (branch)။ Read = staff အကုန် (read scope = assignment ∪ grant)။

**Owner ဆုံးဖြတ်ရန် (Part 2 §16 — OPEN-39) — ✅ 01/Oct 21:20 အကုန် default (§11.7)**

| # | မေးခွန်း | Claude default |
| --- | --- | --- |
| 1 | Booking တစ်ခုမှာ service ၂ ခု+ ဆို buffer (ရှင်းလင်းချိန်) **ပေါင်း** လား (ညှပ် 5 + ဆိုး 10 = 15) · ဒါမှမဟုတ် အကြီးဆုံး တစ်ခုပဲ (10) | ပေါင်း (D-SVC-07 စာသား အတိုင်း) |
| 2 | Branch ပိတ်ရက် (`branch_closures`) မှာ **staff** ကပါ booking မထည့်ရ လား | မထည့်ရ (ဆိုင် ပိတ်) |
| 3 | **Approve ပြီးသား ခွင့်** ကို ဘယ်သူ cancel ရ | `leave.approve` ပဲ (ဝန်ထမ်း = manager ကို ပြော) |
| 4 | Manager က **ကိုယ့်ခွင့် ကိုယ် approve** ✖ (တခြား approver လို) | ✖ |
| 5 | Option group ကို API ကပါ **≤ 2** ကန့်သတ် (grid editor နဲ့ တူ; DB က မကန့်) | ≤ 2 |
| 6 | လုပ်နေဆဲ walk-in visit က barber ကို **ဘယ်အထိ ပိတ်** — ခန့်မှန်း ပြီးချိန် (service line ကြာချိန် + buffer) · ဒါမှမဟုတ် အခုအချိန်အထိပဲ | ခန့်မှန်း ပြီးချိန် |
| 7 | ★ Go-live data — service / option grid / ဈေး / eligibility / pattern / leave type (Fresha list) | import (Part 8) |
| 8 | Shift ကုန်ခါနီး slot — buffer ပါ shift ထဲ ဝင်မှ ပြ (19:35 မှာ 30 + 10 မိနစ် ✖) · ဒါမှမဟုတ် buffer က shift ကျော်လို့ ရ | shift ထဲ ဝင်မှ |
| 9 | Pattern save ရင် roster **ချက်ချင်း** update (API) — admin guideline AD-SCH-01 စာသား "generated … tonight" ကို နောက် version မှာ ပြင် | ချက်ချင်း; copy = guideline v1.3 |
| 10 | ⚠️ **DB Part 2 v1.3** — `archived_at` ၂ column (တစ်နေ့တည်း ပြန်ဖြုတ်ဖို့; CHECK + D-DAT-05) — confirm | confirm → 🔒 D-DB-06 v1.3 |

**Part 0 / 1 lock ချိန် amend ရန် (Part 2 ကနေ):** Part 0 §8 event (`catalogue.changed`, `eligibility.changed`, `schedule.changed`, `leave.cancelled`; `leave.*` = Part 2) · §11 Part 2 row code (`employee.eligibility_manage`, `leave.manage`, `leave_type.manage`) · API-RT-01 room = read scope · Part 1 P1-RULE-05 read scope + P1.EMP.09 `service_id` repeatable။

**Independent review:** reviewer agent (မရေးခင် မမြင်ဖူး) — ၁၈ ချက် (HIGH ၂: effective-dated write algorithm က DB CHECK / EXCLUDE ချိုး · manual shift ရှိတဲ့ နေ့မှာ pattern shift အဟောင်း ကျန်) + verification ၅ (day reset mechanism · `archived_at` လို → DB v1.3 · nightly regenerate က attendance ချိတ်ထားတဲ့ shift id ပြောင်း → diff + guard · residue) — **အကုန် ပြင်ပြီး** (Part 2 §17)၊ 🔒 ချိုးတာ မတွေ့။

### 11.7 Owner အဖြေ (01/Oct 21:20) — Part 0 / 1 / 2 lock *(v5.2.13)*

> Owner က §0.6 sheet ကို ဖြေ (ADR + provider + role / permission) → Claude က owner list ထဲက "Permission matrix" ↔ "Company admin" ဆန့်ကျင်ချက် (D-PLT-13) + မဖြေရသေး ၁၈ ချက် + provider ၅ ချက်ကို **sheet တစ်ခုတည်း** ပြန်မေး → owner ဖြေ → **🔒 D-API-01 / 02 / 03** + ဖိုင် တစ်ခါတည်း (D-PLT-19)။

**Permission — owner ရှင်းပြချက် (အဓိက ပြောင်းလဲမှု):** "ငါတို့ Role မှာက Admin, Manager, Barber ဆိုပြီးရှိမယ်။ Permission မှာကြ **Menu တစ်ခုချင်းစီကို CRUD** ထည့်တာကိုပြောတာ — ဥပမာ service အတွက် `service.view`, `service.create`, `service.update`, `service.delete` … တခြား ဟာတွေဆိုလဲ အဲ့လိုပဲ; **အကုန်လုံးကို check လုပ်ထားရင် Admin**; မန်နေဂျာဆိုရင် သူ့အတွက် check လုပ်မယ့် ဟာပဲ ပေး" → ADR-011:

| ချက် | ဆုံးဖြတ်ချက် | ဥပမာ |
| --- | --- | --- |
| Code ပုံစံ | `<module>.view / create / update / delete` — menu မှာ ရှိတဲ့ action ပဲ | Settings = `settings.view` + `settings.update` ပဲ (ဖန်တီး / ဖျက် မရှိ) |
| Special action | approve / refund / finalize / close / assign / field group = code သီးသန့် | `leave.approve` — ခွင့် ပြင်ခွင့် (`leave.update`) ရှိရုံနဲ့ approve မရ |
| `delete` | archive / ပိတ် / cancel — data မပျောက် (D-DAT-05) | `employee.delete` = အလုပ်ထွက် / ပိတ် (record ကျန်) |
| `view` | menu + စီမံ screen; ပြင် / ဖျက် / approve ခွင့်ရှိသူလည်း မြင် (`view⁺`) | `service.view` ဖြုတ်ထားလည်း POS မှာ "Haircut 5,000" ရွေးရ |
| Company admin | Role row ၅ ကွက်လုံး ✔ + company scope (#25 = A) | Admin role = အကုန် ✔ → company admin ပါ |
| Seed role | Admin (အကုန်) · Manager (admin ✔ ပေးတာ) · Barber (management ✖) | D-ROLE-09 |

**Part 0 / 1 / 2 ထဲ ဘယ်လို သွင်းထားလဲ**

| ဖိုင် | ပြောင်းတာ |
| --- | --- |
| Part 0 **v1.3** | §12 ✅ ၈ ချက် · API-PERM-06 ပြန်ရေး (CRUD · special · delete · `view⁺` · scope · seed role · company admin / last-admin / auto-grant) · API-PERM-03 operational vs management read · API-IDEM-03 / API-SHAPE-01 / API-AUTH-02 / API-LIM-01 / API-DATA-04 = 🔒 · API-RT-01 room = read scope · API-RT-03 Part 2 event ၄ · §11 module map code (Part 3–8 = part ရောက်မှ အတိအကျ) |
| Part 1 **v1.3** | §10 code **၂၁** (`company.*` ၂ · `branch.*` ၄ · `employee.*` ၄ + special ၄ · `role.*` ၄ + assign · `settings.*` ၂) · endpoint perm column အကုန် · invite resend / cancel → `employee.access_update` · P1-RULE-05 read scope · P1-RULE-12 company admin · P1.EMP.09 filter · P1.SET.02 list · P1.PERM.01 `kind` / `scope` · §13 ✅ · OpenAPI `1.3.0` (operation ၅၂ — `x-permission` ၄၅ · public ၇) + RL.05 / RL.06 `last_admin` 409 |
| Part 2 **v1.2** | §12 code **၂၂** (`service.*` ၄ · `price.*` ၃ · `eligibility.*` ၂ · `schedule.*` ၄ · `leave_type.*` ၄ · `leave.*` ၄ + approve) · **P2-RULE-11 ပြန်ရေး** (operational = POS / booking / calendar list — code မလို · management = price history / scheduled grid, eligibility matrix, pattern, conflict, archived — `view⁺`) · rule tag ⚠️ → 🔒 (§16) · §16 ✅ ၁၁ · OpenAPI `1.2.0` + `x-permission` (operation ၅၀) |

**Owner သိထားရန်:** (1) v1.2 / v1.1 ရဲ့ `*.manage` code တွေ deploy မလုပ်ရသေးလို့ နာမည်ပြောင်းတာ D-ROLE-08 ("rename ✖") ကို မထိ — deploy ပြီးမှ rename ✖။ (2) Part 3–8 code (`payroll.manage`, `product.manage`, `website.manage` …) ကို part တစ်ခုချင်း design လုပ်ချိန် ဒီ rule အတိုင်း ပြောင်း (AD-PERM-06 v1.3 map)။ (3) Matrix UI = column ၄ ခု + Special actions + "Company admin" badge (AD-PERM-07 v1.3)။

### 11.8 Scope A + API Part 3 draft v1.0 (01/Oct 23:30) *(v5.2.14)*

> **Owner (22:16):** "Manager က သူ့ Branch မှာရှိတဲ့ Service တွေ Setting တွေကို Manage မလုပ်နိုင်ဘူး ဖြစ်သွားမှာပေါ့ … Admin က Company wide service လုပ်လိုက်တဲ့အခါ branch အလိုက် ရတာရှိတယ် မရတာရှိတယ် — ကာဖို့ အရင်ကပြောခဲ့တယ်" → Claude: ဟုတ်တယ် — v5.2.13 rule ("company code = company-scope assignment ကနေမှ") က Manager ကို ပိတ်မိတယ် (Claude အမှား) → owner **A** → **ADR-012**။ နောက် owner: "API Part 3 question sheet အကုန် OK" → **Part 3 draft v1.0**။

**Scope A (ADR-012) — ဥပမာ:** Admin က "Hair Dye" ကို company တစ်ခုလုံးအတွက် ဖန်တီး → **Branch A Manager** (`service.update`, branch scope = A):

| လုပ်ချင်တာ | Data အဆင့် | ရ / မရ |
| --- | --- | --- |
| A မှာ Hair Dye ရောင်း / ကြာချိန် 90 မိနစ် | branch data (`branch_services`) | ✅ (P2.SVC.06 — item တစ်ခုချင်း branch စစ်) |
| B မှာ ရောင်း / မရောင်း | branch data (တခြား branch) | ✖ 403 `out_of_scope` |
| Hair Dye နာမည် / option / archive | company master | ✖ 403 `company_scope_required` (screen မှာ read-only) |
| A ရဲ့ ကားခ override (setting) | branch data | ✅ (`settings.update` branch A) |
| Slot interval (company setting) | company master | ကြည့်ရုံ |
| Customer ကိုကို ရဲ့ notes ပြင် | shared | ✅ (`customer.update` ✔ ရှိရင်) — history ကတော့ A ရဲ့ visit ပဲ မြင် |

**Part 3 — ဖိုင် + ပါဝင်တာ**

| အပိုင်း | ပါဝင်တာ | Owner အဖြေ / decision |
| --- | --- | --- |
| Customer (P3.CUS ၉) | list / ဖုန်း lookup (code မလို — booking drawer + FINISH) / add / detail + statistic / edit / Inactive / archive / restore / timeline (booking + visit + product sale) | D-CUS-01..09 · #6 preferred barber · #7 Inactive |
| Cancel reason (P3.CRS ၅) | master list (no-show row lock) | D-BKG-14 / 17 |
| Staff booking (P3.BKG ၁၂) | list · **calendar feed** (code မလို — နာမည် / အချိန် / service; ဖုန်း ✖) · my bookings · create (manage token) · detail · နာမည် / လိပ်စာ ပြင် · reschedule preview + confirm · cancel (no-show reason ပါ) · snooze · reschedule availability | D-BKG-01..23 · #2 #3 #9 #10 |
| Public (P3.PUB ၁၂) | options (60 s cache) · availability dates / slots / next · quote · create · manage view · reschedule availability / preview / confirm · cancel | D-BKG-09 / 11 / 12 / 21 · #1 #5 #8 |
| Permission ၁၂ | `customer.*` (shared) · `booking.*` (branch) · `booking_cancel_reason.*` (company) — Barber seed = `booking.view` + `customer.view` + `customer.create` | #9 |
| Rule | P3-RULE-01 customer identity · 04 create pipeline (token replay → captcha → item / window → customer → price → slot → active booking (website — နောက်ဆုံး) → insert) · 06 reschedule ဈေး · 08 no-show job · 09 row lock · 10 public | – |

**Owner သိထားရန်:** (1) DB **မပြင်** — snooze အရေအတွက် = audit row ကနေ တွက် (column မထည့်)။ (2) Booking START / COMPLETE = Part 4။ (3) Booking QR poster = Part 8 (website)။ (4) Lock ရန် ၃ ချက် = **§0.8**။

---

### 11.9 One-sheet "အကုန်လုံး OK" → API Part 3 lock + Part 4–8 v1.0 — API design ပြီး (02/Oct) *(v5.2.15)*

> **Owner (01/Oct 23:27):** "confirm တိုင်း zip မပေးနဲ့ — API အတွက် လိုအပ်တဲ့ မေးခွန်း အကုန် မေး၊ ငါ အကုန် ဖြေမယ်၊ ပြီးရင် API ရော Architecture ပါ အပြီးထုတ်" → §0.8 one-sheet (၅၈ ချက်, default ပါ) → **owner 02/Oct 00:06 "အကုန်လုံး OK"** → ဒီ batch တစ်ခုတည်း။ ရေးပုံ: part ၅ ခုကို cross-part contract ၁၈ ချက် (function နာမည် / lock / error / event) အရင် ချပြီးမှ ပြိုင်တူ ရေး → Part 0–3 amend → cross-part consistency pass → **မရေးခင် မမြင်ဖူးတဲ့ reviewer ၃ ယောက်** → ပြင် → reconcile + script နဲ့ ပြန်စစ်။

**API တစ်ခုလုံး (Part 0 + 1–8) — ကိန်းဂဏန်း**

| Part | Endpoint | Code | Rule | အဓိက |
| --- | --- | --- | --- | --- |
| 1 Foundation v1.5 | ၅၂ | ၂၁ | P1-RULE-01..13 | auth · me · company · branch · employee · role · settings · system |
| 2 Catalogue & Scheduling v1.4 | ၅၀ | ၂၂ | P2-RULE-01..12 | service / ဈေး / eligibility / roster / ခွင့် / availability |
| 3 Customers & Booking v1.1 | ၃၈ | ၁၂ | P3-RULE-01..13 | customer · booking · public booking |
| 4 Visits, Sales & Payments v1.0 | ၅၅ | ၂၂ | P4-RULE-01..22 | START → line → COMPLETE → payment → FINISH · discount · refund · adjustment · receipt |
| 5 Commission, Payroll & Attendance v1.0 | ၆၉ | ၂၃ | P5-RULE-01..20 | plan · estimate · salary · payroll run · payslip · advance · attendance |
| 6 Inventory v1.0 | ၅၈ | ၂၈ | P6-RULE-01..16 | product · stock ledger · purchase · transfer · count |
| 7 Finance & Closing v1.0 | ၅၀ | ၂၇ | P7-RULE-01..19 | စာရင်းပိတ် · cash out / return · expense / income · P&L |
| 8 Platform v1.0 | ၆၉ | ၁၉ | P8-RULE-01..20 | noti · file · audit · import / export · backup · website · report · dashboard |
| **စုစုပေါင်း** | **၄၄၁** | **၁၇၄** |  | realtime event ၅၈ · notification type ၄၁ · job ၁၈ · `Idempotency-Key` operation ၁၃ · OpenAPI ၈ ဖိုင် validate ✅ |

**Part တစ်ခုချင်း — owner သိသင့်တဲ့ design ချက် (အသေးစိတ် = part ဖိုင်ထိပ်က မြန်မာ အတိုချုပ်)**

- **Part 4 (ရောင်း):** START တိုင်း စာရင်းပိတ်ပြီးနေ့ ✖ · customer ၂ ယောက် တပြိုင်နက် ရ — COMPLETE ပြီး ငွေမရှင်းရသေးတာ ရှိမှ နောက် START ပိတ် (B1) · FINISH = step ၁၈ ဆင့် transaction တစ်ခု (lock အစဉ် တစ်ခုတည်း; receipt နံပါတ် gapless; stock ထုတ်; KBZPay ပိုလွှဲ = auto ပြန်အမ်း row) · FINISH ပြီး = မပြင်ရ (DB trigger ပါ) — ပြင်နည်း ၄ မျိုးပဲ: customer / KBZPay ref (တိုက်ရိုက် + reason) · adjustment ledger (method / performer / collected-by) · refund · ကွာငွေ sale · receipt = server က ပုံထုတ်ပြီး သိမ်း (reprint တူ)။
- **Part 5 (လစာ):** pay data အကုန် = **private** (Admin ပဲ) · commission engine တစ်ခုတည်း — checkout estimate ရော payroll ရော (C12) · run = Draft → Calculate → Finalize → Publish → Paid; finalize = လကုန် + branch အကုန် စာရင်းပိတ်ပြီးမှ; finalize ပြီးရင် `PayrollLock` က အဲ့ period ထဲ sale / attendance / shift / leave ပြင်တာ 423 · net ≥ 0 · attendance = QR + GPS clock-in, ခလုတ် + GPS clock-out; exception board; ကိုယ့်ဟာကိုယ် ✖။
- **Part 6 (stock):** ရေတွက်ချက် အားလုံး = `stock_movements` ledger တစ်ခုတည်း (`StockLedger.post`); cached quantity = ညစဉ် စစ် · purchase = Manager draft → Admin post → branch အလိုက် expense auto · transfer = ပို့ / လက်ခံ ၂ ဆင့် · count = system အရေအတွက် မပြဘဲ ရေ → review → post။
- **Part 7 (စာရင်းပိတ်):** `DayLock` — close က exclusive, ငွေ ရေးသူ အကုန် shared; ပိတ်ပြီးနေ့ = ငွေ ရေးတာ အကုန် 422 `day_closed` (KBZPay ✔ ကလွဲ) · expected cash = float + cash sale + cash income − refund − cash out + return (DB CHECK နဲ့ ကိုက်) · auto expense (cash out / purchase / payroll / လကုန်) = approval မလို; manual = E4 rule · P&L = revenue − expense, branch / company။
- **Part 8 (platform):** file = private bucket; website ပုံ = stable media path · report ၁၀ = live query, code တစ်ခုစီ · export = `data.export` · restore = app ထဲ ခွင့်ပြု + developer script · website = `website.update` တစ်ခု (company / branch scope) · notification catalogue ၄၁။

**Independent review (reviewer ၃ ယောက် — ၈၇ ချက်: HIGH ၁၀ · MEDIUM ၃၈ · LOW ၃၉) — အကုန် ပြင်ပြီး** (part ဖိုင်တိုင်းရဲ့ "Independent review" section မှာ ဇယားအပြည့်)

| # | Sev | တွေ့တာ | ပြင်ပုံ |
| --- | --- | --- | --- |
| 1 | HIGH | Reopen လုပ်ထားတဲ့နေ့ထဲ late entry → finalize ပြီး payroll မှာ commission မဝင် | `PayrollLock`: late-entry START + service sale FINISH = 423 `payroll_finalized` (manual payroll line — B9) |
| 2 | HIGH | Commission reversal carry က manual line ရောတွက် → နောက်လ လျော့နုတ် | AUTO line ပဲ နုတ်, 0 အောက် မကျ |
| 3 | HIGH | မှား salary / plan row "ဖြုတ်" = hard delete (🔒 D-DAT-05) | → **OPEN-40 (b)** owner |
| 4 | HIGH | ကွာငွေ sale ဖွင့်ထားရင် စာရင်းပိတ် မရ; actor / line type / link မသတ်မှတ် | customer ပေးချိန်မှ ဖန်တီး; စာရင်းမပိတ်ခင် FINISH / cancel; link = adjustment note token |
| 5 | HIGH | net 0 service line → payroll calculate တစ်ခုလုံး DB CHECK ပျက် | base ≤ 0 = EARN line မထုတ် |
| 6 | HIGH | Close transaction က lock မရခင် snapshot ယူ → ပိတ်ပြီးနေ့ထဲ payment ဝင်နိုင် | exclusive day lock အရင် + READ COMMITTED; RR = preview / report ပဲ |
| 7 | HIGH | Branch လုံး count = level row ရှိတဲ့ product ပဲ → go-live ဖွင့်စာရင်း မရ | active product အကုန် (row မရှိ = 0) |
| 8 | HIGH | Public မဟုတ်တဲ့ branch booking link 404 (DB comment / FE-IA-03 ဆန့်ကျင်) | ACTIVE branch မည်သည်မဆို ရ; `is_public` = website စာရင်းမှာပဲ ဖျောက် |
| 9 | HIGH | `request_id` UUID မဟုတ်ရင် audit trigger cast ပျက် → ငွေ write အကုန် ပျက် | server က UUIDv7 ထုတ်; client header = UUID ဖြစ်မှ သုံး |
| 10 | HIGH | ဖွင့်ချိန် ပြင် / စပြီးသား ပိတ်ရက် archive → အတိတ်ရက် "ပိတ်ရမယ့်နေ့" ပြောင်း → closing / payroll ပိတ်ဆို့ | hours row = ပြင်တဲ့ရက်ကစ သက်ရောက်; အတိတ်က စတဲ့ ပိတ်ရက် = end ရက်ပဲ ပြင် |
| 11–48 | MED | `receivable.issue` branch level (C1) → private · KBZPay ref unique = effective method · lock အစဉ် မတူ · `PayrollLock` advisory lock မရှိ + leave ကျန် · `run_stale` မသတ်မှတ် → fingerprint + run အစဉ်လိုက် · reopen (timestamp ရှင်း, manual line ကျန်) · late-entry အချိန် မဖြစ်မနေ · once-per-customer detach · နောက်ကျ ↔ ပျက်ကွက် ထပ် · ကိုယ့် shift ကိုယ်ပြင် (C11) · approve ပြီး discount ratchet · estimate window · GPS off clock-in · refund cap · advance cancel ခွင့် · reject မှာ decided-by · convert ပြီး return cancel · လကုန် job အချိန် (D-FIN-09 စာသား) · အရင်ရက် payment ကိုင်ထားတဲ့ OPEN sale · audit trigger မရှိတာ ရှိတယ်ရေး · purchase expense လ · draft child write lock · `post_requested` · cash out edit vs approved expense · audit `branch_id` rule · backup / import read scope · import DTO ↔ DB · public media rate limit / cache · `site.*` write path ၂ ခု · dashboard tile formula · internal key ၂ ခု ခွဲ · error status / context မတူ (`once_per_customer`, `category_in_use`, `self_action`) … | part ဖိုင် + Part 0 (API-IDEM-06, API-AUD-01, API-ERR-02) + ADR + guideline |
| 49–87 | LOW | wording · cross-reference · YAML `minimum` / response ကျန် · label · warning နာမည် · stale DB comment (→ `db/README.md` note) | ပြင်ပြီး |

**Verification pass (reviewer #4 — ပြင်ပြီးသားကို မမြင်ဖူးသူက ပြန်စစ်):** HIGH ၁၀ ခုလုံး ပြင်ထားတာ မှန် + DB နဲ့ မဆန့်ကျင် (FINISH ၁၈ ဆင့် ↔ lock အစဉ် ↔ `finished_immutable` trigger · PayrollLock caller · close transaction · reopen · ကွာငွေ sale · count · public booking · ပိတ်ရမယ့်နေ့) · ထပ်တွေ့ MEDIUM ၃ (reopen ပြီးသား နောက် run ရှိရင် အရင် run reopen = FK ပျက်နိုင် → "နောက် run = CANCELLED / တစ်ခါမှ မတွက်ရသေးတဲ့ DRAFT မှ" · ပိတ်ရက်ကို အတိတ်ဘက် ရွှေ့ = 422 `date_in_past` · Appendix A ဖြတ်အစဉ် ↔ Part 5) + LOW ၁၁ (YAML `request_id` uuid, `mime_type`, စာသား) — အကုန် ပြင်ပြီး။

**ယူထားတဲ့ default (owner မဖြေထားတဲ့နေရာ — ပြောင်းချင်ရင် တစ်ကြောင်း ပြော; 🔒 မချိုး)**

| # | ဘာ | Default | ဘယ်မှာ |
| --- | --- | --- | --- |
| 1 | B6 "၁၀၀ ပြည့်" ဘက် | အနီးဆုံး ၁၀၀ (975 → 1,000 · 945 → 900); setting `sales.discount_round_to_amount` | P4-RULE-06 |
| 2 | Attendance ဖြတ်ငွေ > gross | gross အထိပဲ ဖြတ်; ပိုတာ နောက်လ မသယ် (advance / commission ပြန်နုတ် = သယ် — C6) | P5-RULE-08 |
| 3 | ဗီရိုက "Expense" cash out (Manager မှတ်) | ချက်ချင်း APPROVED (🔒 F-P7-04 — ငွေ ထွက်ပြီးသား); closing list + report ⑤ + audit မှာ စစ်; E4 = manual expense / income အတွက် | P7-RULE-09 / 15 |
| 4 | လရဲ့ နောက်ဆုံးနေ့ ည barber ကိုင်ထားတဲ့ငွေ (must-return) | အဲ့လ ပိတ်ပြီးတာနဲ့ expense → နောက်နေ့ return မှာ reversal (D-FIN-09 စာသားအတိုင်း; ၂ လပေါင်း 0) | P7-RULE-12 |
| 5 | ငွေလှုပ်ရှားမှု မရှိတဲ့ အတိတ်ရက် (ဖွင့်ချိန် မပြင်ခင်) | စာရင်းပိတ် မလို | P7-RULE-03 |
| 6 | ထွက်သွားသူ ကျန်ငွေ (advance / commission ပြန်နုတ်) | စာရင်းမှာ ပြပဲ ပြ; write-off ခလုတ် ⏭ V1 မပါ | P5-RULE-11 |
| 7 | ကိုယ့် line ကိုယ် price override | `sale.override_price` + reason ရှိရင် ရ (discount approve မဟုတ်) | P4-RULE-05 |
| 8 | Finalize ပြီး period ထဲက PENDING ခွင့် | reopen မလုပ်မချင်း ဆုံးဖြတ်မရ — finalize မတိုင်ခင် warning `pending_leaves` | P5-RULE-09 |
| 9 | Staff document | ဝန်ထမ်းကိုယ်တိုင်လည်း မမြင် (Admin ပဲ — F11) | P8-RULE-05 |
| 10 | Kind-2 manual return (လွှဲ ၂ ခါ) အများဆုံး | max(sale total, Σ non-cash payment) + reason + reference | P4-RULE-14 |
| 11 | Dashboard revenue tile | report ① net sales (branch) — top barber ၅ ယောက် | P8-RULE-16 |
| 12 | Payment နည်း ပြင် (cash → KBZPay) | reference ပေးရင် ရ (adjustment ledger — 🔒 F-P4-07); KBZPay list ထဲ ပေါ် | P4-RULE-15 |
| 13 | 🟡 D-PAY-08 tax / service charge အစဉ် | discount → service charge → tax (exclusive) — **owner က ဖွင့်ချိန်မှ အတည်ပြု** (default OFF) | P4-RULE-06 |

**🟡 ကျန် = OPEN-40 (§0.9)** — API surface မပြောင်း; အဖြေရရင် DB Part 5 v1.2 / Part 7 v1.2 + part ဖိုင်ထဲက ⚠️ စာသား 🔒။


### 11.10 OPEN-40 lock → API Part 5 / 6 / 7 v1.1 (02/Oct မနက်) *(v5.2.16)*

Owner "OPEN-40 OK" (§0.9) → part ဖိုင် ၃ ခုထဲက "⚠️ OPEN-40 pending" စာသားကို lock ပြီးသား mechanism အဖြစ် ပြန်ရေး — **endpoint · body · response · error code တစ်ခုမှ မပြောင်း** (OpenAPI ၃ ဖိုင်: `info.version` 1.0.0 → **1.1.0** + description စာသားပဲ ကွာ; `redocly lint` warning အရေအတွက် မူလအတိုင်း)။

| ဖိုင် | Version | ဘာပြောင်း |
| --- | --- | --- |
| `docs/api/05-commission-payroll-attendance.md` + OpenAPI | v1.0 → **v1.1** (🔒 D-API-06) | Withdraw (P5.CPA.04 / P5.EPY.04) = **archive** (`archived_at` / `archived_by_user_id` / `archive_reason` — DB Part 5 v1.2); transaction ထဲ archive အရင် → re-link; archive row = list / picker / တွက်ချက်မှု အကုန်က ချန် |
| `docs/api/06-inventory.md` + OpenAPI | v1.0 → **v1.1** (🔒 D-API-07) | DRAFT purchase / transfer line အစားထိုး = ဖြုတ်တဲ့ line ဖျက် + audit diff အပြည့် (DB မပြောင်း) |
| `docs/api/07-finance-closing.md` + OpenAPI | v1.0 → **v1.1** (🔒 D-API-08) | `Expenses.removePayroll(run, actor, reason)` သတ်မှတ်ပြီး = soft delete (DB Part 7 v1.2); reopen ပြီး salary expense ရဲ့ `links.payroll_run_id` = `null` |
| `docs/api/00-conventions.md` · `02` · `03` · `04` · `08` | version မပြောင်း | OPEN-40 ကို "closed" လို့ စာသားပဲ ညှိ; §11 module map မှာ Part 5 / 6 / 7 = v1.1 |

**Spec ရေးရင်း တွေ့တဲ့ API စာသား ကွက်လပ် (✅ owner ဖြေပြီး 02/Oct 13:08 → §11.11):** HTTP 500 `code` (S4) · field-level validation code (S5) · reason field နာမည် API-DATA-11 ↔ Part 4 (S8) · OTP verify limit (S9) · Part 1 OpenAPI မှာ OTP endpoint ၂ ခုရဲ့ CSRF header parameter (R1) → အဖြေရရင် **API Part 0 v1.6 / Part 1 v1.6** အဖြစ် တစ်ခါတည်း ပြင်။

### 11.11 Sheet 3 lock → API Part 0 v1.6 · Part 1 v1.6 · Part 4 v1.1 (02/Oct 13:08) *(v5.2.17)*

Owner "မေးခွန်းအကုန်လုံး OK — Default အတိုင်း" (§0.11) → spec ရေးရင်း တွေ့တဲ့ စာသား ကွက်လပ် / မကိုက်တာတွေကို part ဖိုင်ထဲ ဖြည့် — **endpoint · body · response · permission code တစ်ခုမှ မပြောင်း** (endpoint ၄၄၁ · code ၁၇၄ အတိုင်း)။ OpenAPI ၂ ဖိုင် `openapi-spec-validator` ✅။

| ဖိုင် | Version | ဘာပြောင်း |
| --- | --- | --- |
| `docs/api/00-conventions.md` | v1.5 → **v1.6** (🔒 D-API-01) | API-ERR-02 — **500 `internal_error`** row (body မှာ `request_id` ပဲ၊ အမှားအသေးစိတ် မပါ) (S4) · API-ERR-03 — **field-level code = Zod issue နာမည်** `too_small` / `too_big` / `invalid_type` (+ `params`); schema က catalogue code ပေးထားရင် အဲ့ဒါ; `required` / `date_invalid` / `unknown` = client-only (S5) · API-DATA-11 — reason field နာမည် = endpoint ရဲ့ part သတ်မှတ်တဲ့အတိုင်း (S8) · API-LIM-02 — **code verify ၁၀ ခါ / နာရီ / IP → 429**, look-up / counter / audit မတိုင်ခင် ရေတွက် (S9) · API-PERM-03 — code ရှိ + branch မဟုတ် = `forbidden`; `out_of_scope` = part က နာမည်ပေးထားမှ (S12) · §11 Part 1 → v1.6, Part 4 → v1.1 · §12 #11 |
| `docs/api/01-foundation.md` + OpenAPI | v1.5 → **v1.6** (🔒 D-API-02; OpenAPI 1.6.0) | P1-RULE-03 (verify cap · lock အဖြေ စာသားအတိုင်း — S10 · `email_invalid` / `otp_format`) · P1-RULE-10 (`permission.sync` — S13) · **P1-RULE-14** ပထမ company admin = operator command `admin-create.js --email --name-mm --code [--name-en]` — active company admin (INVITED ပါ) မရှိသေးခင်ပဲ ရ; audit `source = 3` + OS user (S6) · **P1-RULE-15** session ရှိတဲ့ browser မှာ ထပ် login → အရင် session `1 LOGOUT` (S14) · P1.AUTH.01 / .02 + §11b error row · OpenAPI: OTP endpoint ၂ ခုမှာ `X-Requested-With` parameter (API-AUTH-02 — R1) · §13 #9 |
| `docs/api/04-visits-sales-payments.md` + OpenAPI | v1.0 → **v1.1** (🔒 D-API-05; OpenAPI 1.1.0) | P4-RULE-01 — `correction_path` ကို FINISHED sale မှာ payment ထပ်ထည့်တာ နဲ့ CANCELLED sale ကို ရေးတာ အကုန်မှာ **မထည့်** (S17); void / §11 error row / OpenAPI description ၄ နေရာ ညှိ · reason field ပုံစံ = binding (S8) |
| `docs/api/02` · `03` · `05`–`08` | version မပြောင်း | – |

**မှတ်ချက်:** P1-RULE-14 မှာ `--code` (employee code) ကို မဖြစ်မနေ ထားတယ် — `employees.employee_code` က NOT NULL ဖြစ်ပြီး code ထုတ်ပေးတဲ့ rule (`employee.code_format`) က employee screen change ကျမှ လာမှာမို့ format ကို မတီထွင်ဘဲ operator က ရိုက်ထည့်ရတယ်။



## 12. Architecture review + ADR (v5.2.10)

> **Owner (01/Oct 11:54):** "ဒီ skill တွေပါ သေချာ စစ်ပါ — coding ဘက်ကို စရောက်လာပြီ ဖြစ်လို့ `/engineering:system-design` `/engineering:architecture`" → system design framework ၅ ဆင့် (requirement → high-level design → deep dive → scale / reliability → trade-off) နဲ့ lock ပြီးသား design (Appendix A, `db/`, `docs/ux/`, `docs/api/`) ကို ပြန်စစ်ပြီး ရလဒ်ကို **ADR** (Architecture Decision Record) ၁၀ ခုနဲ့ မှတ်ထား။ 🔒 decision ဘာမှ မပြောင်း; အသစ် အကြံပြုတာ = ⚠️ + ADR Proposed → owner lock (D-PLT-11)။

### 12.1 ဖိုင်

| ဖိုင် (ဒီ chat) | Repo path | ပါဝင်တာ |
| --- | --- | --- |
| `architecture/system-design-v1.3.md` | `docs/architecture/system-design.md` | §1 requirement (functional / NFR / load estimate / constraint) · §2 component diagram + walk-in → FINISH data flow + storage · §3 deep dive (data model watch item ၄ · API review · cache · job ၁၃ (canonical = ADR-002) · error / retry · time & money) · §4 Docker Compose layout · CI/CD · **failure mode ၈** · monitoring (HetrixTools + Sentry) · capacity · §5 trade-off table (ADR map) · **§6 revisit trigger ၇** · *v1.1 = ADR Accepted + provider + RPO daily + ADR-011* |
| `architecture/adr/README.md` + `ADR-001..015-*.md` | `docs/adr/` | ADR တစ်ခုချင်း = Status / Date / Deciders · Context · Decision · Options (Complexity · Cost · Scalability · Team familiarity table + pros / cons) · Trade-off · Consequences · Action items · ထိပ်မှာ မြန်မာ အတိုချုပ် · *v5.2.13:* ADR-011 အသစ်, ADR-010 Superseded |

### 12.2 ADR ၁၅ ခု (+ ADR-016 — v5.2.16) — status *(v5.2.13 — 01/Oct 21:20 · v5.2.14 = ADR-012 · v5.2.15 = ADR-013 / 014 / 015 + ADR-012 Amendment 1 · v5.2.16 = ADR-016 + ADR-001 Amendment 2)*

| ADR | ဘာ | Status | ချိတ် |
| --- | --- | --- | --- |
| ADR-001 | Modular monolith — NestJS + PostgreSQL + Next.js, VPS ၁ လုံး Docker Compose; microservice / Kubernetes / Redis ✖; module boundary rule ၃ | **Accepted** | 🔒 D-PLT-01 / 02 / 06 / 14 · §5.1 / §5.2 |
| ADR-002 | Background job = pg-boss (Postgres ထဲ) — Redis / BullMQ ✖; worker = API process ထဲ (flag နဲ့ ခွဲနိုင်); retry 3× + dead-letter → admin noti; outbox ✖ (event ပျောက်နိုင်၊ data မပျောက်) · backup = sidecar · **RPO = daily** | **Accepted** (owner 21:20 — #9, #15) | 🔒 REC-31 |
| ADR-003 | Android shell = Capacitor (hosted URL + Bluetooth Classic ESC/POS plugin) — TWA က Bluetooth Classic မရောက်; plugin ကို printer အစစ်နဲ့ စမ်း | **Accepted** (#10) | 🔒 REC-32 · D-PAY-07 |
| ADR-004 | Booking idempotency = client က manage token ထုတ်၊ server hash သိမ်း (DB မပြင်) — B (`client_request_id` column) က replay မှာ link ပြန်မပေးနိုင် | **Accepted** (#1) | 🔒 API-IDEM-03 · D-API-01 |
| ADR-005 | Session = opaque server session + HttpOnly cookie (JWT ✖) · CSRF = `X-Requested-With: point-app` + Origin check (SameSite=Lax) · Android / iPhone Google login hand-off | **Accepted** (session 29/Sep · CSRF + hand-off #11) | 🔒 D-AUTH-06 · API-AUTH-02 |
| ADR-006 | Public website = Next.js SSR + tag cache + on-demand revalidate (job `site.revalidate` → `http://web:3000/internal/revalidate`) + 5 မိနစ် fallback; availability cache ✖; data = `/v1/public/*` ပဲ | **Accepted** (#12) | 🔒 REC-35 · D-WEB-01 |
| ADR-007 | **Resend (Free)** email (OTP + invite ပဲ) · **HetrixTools (Free)** uptime 60 s → **Email + Telegram** · **Sentry (Developer)** error (email alert) · owner ops Gmail · dev = Mailpit · pilot = Google login · log = stdout 7 ရက် | **Accepted** (#13, #27–#29) | 🔒 REC-38 · D-ARC-02 · ★ ACT-05 / 08 |
| ADR-008 | Realtime = Socket.IO gateway `/rt`, API instance ၁ ခု, in-memory adapter; event = "refetch" ပဲ (money payload ✖); reconnect / focus = refetch; instance ၂ ဖြစ်မှ adapter | **Accepted** (#14) | 🔒 D-NTF-01 · D-API-01 |
| ADR-009 | Origin တစ်ခုတည်း — API = `app.<domain>/api/*`, `<domain>/api/*` (Caddy path routing); CORS ✖; cookie host-only; `api.` subdomain ✖ | **Accepted** (#5) | 🔒 API-SHAPE-01 · D-API-01 |
| ADR-010 | Permission = granular action code (`*.manage` ပါ), admin compose; guard rail ၂ | **Superseded by ADR-011** (01/Oct 21:20) | history |
| ADR-011 | **Permission = menu တစ်ခုချင်း CRUD** (`view` / `create` / `update` / `delete`) + special action (approve / refund / assign / field group); `manage` ✖; delete = archive; `view⁺` read rule; operational list = code မလို; **company admin = role ၅ code** (#25 A); seed role Admin / Manager / Barber; guard rail ၂ ဆက် | **Accepted** (owner 21:20 — #25, #26, default roles) · **#7 → ADR-012** | 🔒 D-ROLE-02 / 09 · D-API-02 / 03 |
| ADR-012 | **Scope = data level** — company master (ပြင် = company scope; branch scope = ကြည့်ရုံ) · branch data (ကိုယ့် branch) · shared customer (✔ ရှိရင် ရ, history = ကိုယ့် branch); code `level` | **Accepted** (owner 01/Oct ည — A) | 🔒 D-ROLE-02 / 07 / 09 · D-API-01..04 |
| ADR-012 *Amendment 1* | **`private` level** — commission / payroll / salary / advance / report ⑦ / staff document = company scope နဲ့မှ (branch scope = ဘာမှ မရ; list ပါ 403 `company_scope_required`) — code ၁၈ ခု · company-wide ငွေ row + company P&L + branch မပါ audit row = company scope · backup / import read = company scope · staff-advance ယူသူ masking | **Accepted** (owner one-sheet C1 / E6 / F10 / F11 — 02/Oct) | 🔒 D-ROLE-07 / 09 · API-PERM-03 / 07 |
| ADR-013 | **Document rendering & printing** — HTML template → headless Chromium (API image ထဲ ၁ ခု, တစ်ခါ တစ်မျက်နှာ) → PDF + printer PNG (384 px / 58 mm · 576 px / 80 mm); receipt = FINISH မှာ job `receipt.render` → ဖိုင်သိမ်း (reprint တူ); payslip = တောင်းမှ, ဝန်ထမ်းဘာသာ; report PDF / QR poster = `export.run`; Android shell က PNG ကို ESC/POS နဲ့ print; auto-print OFF; font = Pyidaungsu + Inter embed | **Accepted** (owner H1 / H2 / H5 — 02/Oct) | 🔒 D-PAY-06 / 07 · D-PAYR-07 · ADR-003 |
| ADR-014 | **File storage = S3-compatible private bucket** (owner account — Cloudflare R2 / Backblaze B2) — upload = staging → transaction ထဲမှာ link (`Attachments.link` / `replace`); file signature စစ်; EXIF ဖြုတ်; website ပုံ = WebP 400 / 800 / 1600 + stable path `/api/v1/public/media/<id>/<variant>` (cache ၁ ရက် + ETag); private file = signed URL ၅ မိနစ်; `uploads.purge` / `exports.purge` hourly; weekly integrity; off-site backup လည်း bucket | **Accepted** (owner F4 / H3 — 02/Oct) | 🔒 D-FIN-03 · D-DAT-03 · D-WEB-01 |
| ADR-015 | **Reports & exports** — live read-only SQL (REPEATABLE READ READ ONLY snapshot, ≤ 366 ရက်, warehouse ✖); report code `report_<key>.view` (⑥ = `pnl.view` · ⑦ private); export = `data.export` + screen view ခွင့်: ≤ 5,000 row ချက်ချင်း, ကျော် / PDF = job `export.run` (≤ 50,000; PDF = summary + 1,000), ၂၄ နာရီ; import = master data ≤ 10,000 row | **Accepted** (owner H4 / F1 / F2 / F3 / F5 / F6 — 02/Oct) | 🔒 D-RPT-01 · D-DAT-01 / 02 |
| ADR-016 *(v5.2.16)* | **Repo ၂ ခု** — `point-sdd` (spec hub = OpenSpec store: `openspec/`, brief, planning source အကုန် `docs/` အောက်, test case tool) + `point-barber` (app = pointer `store: point-sdd`: code, migration, test, coding guideline, design reference); workspace `point/`; `/opsx:apply` = point-barber ထဲ; design ပြောင်း = point-sdd မှာ အရင်; private; store (beta) fallback = additional directory · **ADR-001 action item 1 ကို amend (Amendment 2)** | **Accepted** (owner 02/Oct — sheet C5 / D5 / #3 / #4) | 🔒 D-ARC-03 · D-PLT-17 / 20 · §12.11 |

### 12.3 System design review — owner ဖတ်ရန် ကောက်ချက်

- **Load ≠ driver.** ဆိုင်ခွဲ ၃ · ဝန်ထမ်း ၁၅ · service ~၉၀ / နေ့ · peak < 5 request / s · phone ≤ ၁၅ · sale row ~၃ သောင်း / နှစ် — VPS ၁ လုံး (4 vCPU / 8 GB) က ၁၀ ဆ ထိ ခံ; partition / Redis / Kubernetes မလို (§1.3)။
- **Driver = ငွေ မှန်ကန်မှု · 4G / မီး ပြတ်ချိန် · backup · security · handover** — design မှာ ကာထားပြီး: DB constraint + trigger (immutability, exclusion, unique ref, gapless counter)၊ money POST တိုင်း idempotency၊ audit append-only၊ session instant revoke၊ daily off-site backup + monthly restore test။
- **Failure mode ၈ ခု** (§4.2) — branch net ပြတ် → စက္ကူ + late entry (D-VIS-13) · VPS down → uptime alert + restore runbook (RTO 2 နာရီ) · DB corruption → daily / weekly backup (RPO daily ✅ owner 01/Oct 21:20 · WAL archiving = revisit trigger) · email provider down → Google login · captcha down → public booking fail-closed + "ဆိုင်ကို ဖုန်းဆက်" · job stuck → health alert 06:00 · printer → payment မပိတ် (D-PAY-07) · money POST reply ပျောက် → idempotency replay။
- **Job ၁၈ ခု** *(v5.2.15 — အရင် ၁၃; canonical = ADR-002)* — `shifts.generate` 00:30 · `booking.noshow_alarm` ×4 + autocancel (`starts_at` စစ်) · `attendance.detect_exceptions` 15 မိနစ် + 23:55 · `closing.month_end_must_return` နေ့စဉ် 01:00 · `stock.reconcile_levels` 01:30 · `notifications.purge` 02:00 (အရင် `notifications.cleanup`) · `uploads.purge` / `exports.purge` နာရီတိုင်း · `site.revalidate` (transaction ထဲ enqueue) · `receipt.render` · `backup.watchdog` 06:00 (backup ကိုယ်တိုင် = sidecar container 03:00) · `integrity.check_weekly` · `auth.cleanup` · `export.run` / `import.run` · `sync.code_tables` deploy · `email.send` (OTP + invite ပဲ)။
- **Cache** (§3.3) — public page = tag cache + 5 မိနစ် fallback · booking option = 60 s · **availability = ဘယ်တော့မှ ✖** · PWA reference data = stale-while-revalidate + realtime invalidate · permission = request တိုင်း DB (cache မလို)။
- **Watch item ၄** (§3.1) — `bookings` client_request_id မရှိ (ADR-004) · settings reset = UPDATE · `employee_roles.revoked_by` မရှိ (audit က ဆောင်) · polymorphic ref ၃ ခု FK မရှိ → weekly integrity job ⚠️။
- **Revisit trigger ၇** (§6) — API instance ၂ (Socket.IO adapter, rate-limit store) · RPO < 24 h (WAL) · company ၂ (RLS — D-ORG-03) · offline V2 (D-VIS-13) · customer rating V2 (OPEN-37) · booking > ၅ သောင်း / နှစ် (materialised view, partition) · iPhone push (Web Push)။

### 12.4 Owner လုပ်ရန် (OPEN-38 · Appendix B #38) — ✅ ပြီး (01/Oct 21:20)

1. ✅ ADR-002 / 003 / 004 / 005 / 006 / 007 / 008 / 009 — **Accepted** (§0.6 #1, #5, #9–#14) · ADR-001 reconfirm · ADR-010 → ADR-011။
2. ✅ ADR-007 ★ — provider ရွေးပြီး (Resend Free · HetrixTools Free · Sentry Developer) · alert = Email + Telegram · account ဖွင့်တာ = **ACT-08 (build ချိန်)** · domain = production release (ACT-05)။
3. ✅ RPO = **daily** (V1) — WAL archiving = revisit trigger (system design §6)။

### 12.5 Claude Code မှာ သုံးပုံ

- Repo: `docs/architecture/system-design.md` + `docs/adr/` · `CLAUDE.md` ထဲ: "Architecture: follow docs/architecture/system-design.md and docs/adr/ (ADR-001..012 — ADR-010 superseded by ADR-011; ADR-011 #7 by ADR-012); cite ADR IDs in infrastructure / cross-cutting code (jobs = ADR-002, realtime = ADR-008, sessions / CSRF = ADR-005, routing = ADR-009, Android shell = ADR-003, site cache = ADR-006, monitoring / e-mail = ADR-007, permissions = ADR-011); a Proposed ADR is not binding until the owner accepts it; a reversed decision = new ADR marking the old one Superseded."
- OpenSpec (D-PLT-17): project context ထဲ ADR list; infra module (jobs, realtime, auth, deploy) ရဲ့ change = ADR action item တွေကို tasks အဖြစ်။
- ADR-001 §Action items = repo scaffold (monorepo layout, module boundary lint, Compose, CI, runbook) — Part 1 code မစခင် ပထမ OpenSpec change။

### 12.6 Independent review (subagent) — တွေ့တာ / ပြင်တာ

> ADR ၁၀ ခု + system design + API Part 0 / 1 v1.1 ကို **မရေးခင် မမြင်ဖူးတဲ့ reviewer agent** နဲ့ Appendix A 🔒 + API convention နဲ့ တိုက်စစ် → ၂၄ ချက် (HIGH ၄ · MEDIUM ၁၂ · LOW ၈)။ 🔒 decision ချိုးတာ / ADR က 🔒 ကို ပြောင်းတာ **မတွေ့**။ အကုန် ပြင်ပြီး (ADR / system design / API v1.2)။

| # | Severity | တွေ့တာ | ပြင်ပုံ | ဘယ်မှာ |
| --- | --- | --- | --- | --- |
| 1 | HIGH | Next.js route group `(site)` / `(app)` ၂ ခုက URL မပြောင်းလို့ host ၂ ခု (`<domain>` / `app.<domain>`) ကို မခွဲနိုင် — `/` တူ → build error | `middleware.ts` က Host အလိုက် `site/` / `staff/` tree ကို rewrite; တိုက်ရိုက် ဝင်ရင် 404; (alternative = app ၂ ခု) | ADR-001, ADR-009, system design §2.1 |
| 2 | HIGH | **Android app (Capacitor WebView) / iPhone PWA ထဲမှာ Google login မရ** — Google က embedded WebView ကို ပိတ် (`disallowed_useragent`); ဖုန်း browser မှာ login ရင် cookie က browser ထဲပဲ ကျန် | **Hand-off flow (PKCE ပုံစံ):** app က verifier (32 byte) ကိုင် → Custom Tabs / Safari sheet မှာ `/auth/google/start?client=shell\|pwa&challenge=sha256(verifier)` ဖွင့် → callback က session ကို cookie မပေးဘဲ challenge အောက် ၅ မိနစ် park + "app ကို ပြန်သွားပါ" page (`point://auth/handoff?done=1` deep link / `app.<domain>/auth/handoff?done=1`) → app က `POST /v1/auth/handoff { verifier }` ကို 2 s တစ်ခါ poll (deep link / visibility ပြန်ရရင် ချက်ချင်း) → cookie က app ကိုယ်တိုင် ခေါ်တဲ့ request နဲ့ app ထဲ ရောက် (browser ရဲ့ redirect ဘယ်မှာ ရပ်သွားသွား မမူ — iPhone Safari sheet ပြဿနာ ကင်း); URL ထဲ secret မပါ; OTP = ဒီအတိုင်း; device test = gate | ADR-005 Decision 4, ADR-003 action, Part 1 P1.AUTH.03 / 04 / **06**, OpenAPI |
| 3 | HIGH | Part 0 v1.1 cookie `Domain=<registrable domain>` ↔ ADR-005 / 009 "host-only" ဆန့်ကျင် — staff cookie က public website ဆီပါ သွားမယ် | `Domain` ✖ (host-only `app.<domain>`); Origin = app host; §12 #4 ပြင် | Part 0 API-AUTH-01 / 02, §12 #4 |
| 4 | HIGH | "ကိုယ်မရှိတဲ့ permission မပေးရ" rule → Part 2 deploy ရင် code အသစ်ကို ဘယ်သူမှ မကိုင်ထား → ဘယ်သူမှ မပေးနိုင် (deadlock); last-admin rule ကလည်း EMP.05 / RL.05 / RL.06 မှာ မပါ | **Company admin** = `role.manage` + `role.assign` company scope → no-escalation ကင်းလွတ်; last company admin ကို deactivate / revoke / code ဖြုတ် / role archive ✖ (409 `last_admin`); `sync.code_tables` က code အသစ်ကို admin role ထဲ auto-grant (audit, ⚠️ default on) | ADR-010 Decision 3, API-PERM-06, **P1-RULE-12**, EMP.05 / 11 / 11b, RL.05 / 06 |
| 5 | MED | ADR-004 mismatch = 409 ↔ Part 0 = 422; manage link ကို client က ဆောက်မယ် ↔ API က `manage_url` ပြန်ပေး | 422 `idempotency_mismatch`; API က raw token ကနေ `manage_url` ကို ပထမ response ရော replay ရော ပြန်ပေး | ADR-004, API-IDEM-03 |
| 6 | MED | Health endpoint ၃ မျိုး (ADR-002 / 007 / Part 1) မကိုက် | `GET /v1/health` = liveness ပဲ (DB ping, detail ✖) · **`GET /v1/system/jobs`** (`settings.view`) = job + backup status | ADR-002 / 007, P1.SYS.01 / **05** |
| 7 | MED | Job နာမည် `site.revalidate` ↔ `site.content_changed`; job ၅ ခု (receipt render, integrity check, export / import, auth cleanup, backup watchdog) စာရင်းထဲ မပါ; "after-commit hook ထဲ transaction ထဲ enqueue" ဆန့်ကျင် | Event = `site.content_changed`, job = `site.revalidate`; canonical job table = ADR-002 (၁၃ ခု); job ကို **transaction ထဲ** enqueue (pg-boss `db` option) — event ပဲ best-effort | ADR-002, ADR-006, system design §3.3 / 3.4, API-RT-03, API-PUB-03 |
| 8 | MED | ADR-010 "`settings.*` = company-only" ↔ Part 1 P1.SET.03 (`settings.manage` branch scope) | `settings.manage` = branch-scopable; `settings.view` = company | ADR-010, Part 1 §10 |
| 9 | MED | Part 1 permission code "၁၄" ↔ table ၁၃ | **၁၃** | Part 1 header / §10, ADR-010, review |
| 10 | MED | OpenAPI `servers` = `api.example.mm` subdomain ကျန် | `servers: /api/v1` | OpenAPI |
| 11 | MED | Socket.IO "namespace `/rt`" (HTTP path `/socket.io/` → Caddy က Next.js ဆီ ပို့မိ); WebSocket upgrade မှာ custom header မပါနိုင် | Engine.IO **path** `/rt`, default namespace; handshake = cookie + Origin + `auth.client` | API-RT-01, ADR-008, ADR-005 |
| 12 | MED | Caddy `/api/*` အကုန် NestJS → public host မှာ `/api/v1/auth/*` ဝင်လို့ရ (staff cookie public host မှာ ဖြစ်နိုင်); Next.js `/api/revalidate` shadow | Public host = `/api/v1/public/*`, `/health`, `/system/status` ပဲ; `/api/v1/internal/*` + `/internal/*` = Docker network ပဲ; Next.js မှာ `/api` route handler ✖ → `/internal/revalidate` | ADR-009, ADR-006, API-SHAPE-01 / 02 |
| 13 | MED | ADR-005 cookie `Max-Age` မပါ (browser ပိတ်ရင် ပျောက် → D-AUTH-06 ပျက်); table နာမည် `sessions` ↔ `user_sessions` | `Max-Age` 400 ရက် + 30 ရက် ကျော်ရင် re-issue; `user_sessions` (D-DB-05) | ADR-005, API-AUTH-01 |
| 14 | MED | ADR-007 က payslip email + owner daily digest email ထည့်ထား — 🔒 D-NTF-01 (in-app ပဲ) / D-PAYR-07 ကျော် | Email = OTP + invite ပဲ; digest = in-app "Needs attention" panel; ⚠️ owner တောင်းမှ | ADR-007, ADR-002, system design §4.3 |
| 15 | MED | Next.js major မ pin; cache API major အလိုက် ကွဲ (14 / 15 `fetch tags` ↔ 16 `'use cache'` + `cacheTag`); `.next/cache` container restart ရင် ပျောက်; "API down ရင် cache ဆက် serve" claim ကျယ်လွန်း | Major pin (16 — 01/Oct/2026); action item major အလိုက်; `.next/cache` volume; claim = time-based window အတွင်းပဲ | ADR-001, ADR-006 |
| 16 | MED | No-show job က status ပဲ စစ်ရင် booking 10:00 → 14:00 reschedule ပြီး 10:40 မှာ မှားပြီး auto-cancel (🔒 D-BKG-17) | Job data = `starts_at`; မတူရင် exit; reschedule / cancel = `singletonKey booking:<id>` နဲ့ pending job ဖျက် | ADR-002, system design §3.4 |
| 17 | LOW | ADR status rule မညီ (ADR-003 / 008 Proposed vs 001 Accepted); system design line က ADR-010 ကို ⚠️ ထဲ ထည့်ထား | README မှာ ရှင်းပြ (REC-32 / Socket.IO = register ⚠️ ဖြစ်လို့ Proposed); summary line ပြင် | README, system design |
| 18 | LOW | "Capacitor 6" ဟောင်း; bridge API နာမည် ၂ မျိုး | "current major ≥ 7, pinned"; contract တစ်ခုတည်း `packages/shared` (`shell.capabilities / print / openExternal`) | ADR-003 |
| 19 | LOW | Web Bluetooth စာသား မှား (TWA မှာ ရ — BLE ပဲ); printer အများစု dual-mode | စာသား ပြင်; BLE ပါ စမ်း | ADR-003 |
| 20 | LOW | Event / endpoint နာမည် drift (`notification.new`, `today.changed`, `/public/services`) | Catalogue အတိုင်း (`notification.created`; coalesce; `/public/site\|branches\|barbers`) | ADR-006, ADR-008, system design §3.3 |
| 21 | LOW | SSE "6 connection / host" con မမှန် (HTTP/2) | ဖြုတ် / ရှင်းပြ | ADR-008 |
| 22 | LOW | Backup ကို API process ထဲ pg-boss job နဲ့ run — `pg_dump` / `CREATEDB` right / API down ရင် alert ပါ down | **backup sidecar container** (pg client + cron, own role) → `backup_runs` (`POST /v1/internal/backup-runs`); API = `backup.watchdog` 06:00 | ADR-002, ADR-007, system design §4.1 |
| 23 | LOW | `point.mm` placeholder domain; ADR-010 action 5 ပြီးသား; P1-RULE-11 က 10 ရှေ့ | `<domain>` (★ ACT-05); tick; order | system design, ADR-010, Part 1 |
| 24 | LOW | Booking option 60 s cache ↔ 🔒 D-WEB-01 "ချက်ချင်း" | `site.revalidate` job က branch ရဲ့ option cache ကိုပါ ချက်ချင်း clear | API-PUB-03, ADR-006 |

**Owner သိထားရန် (decision အသစ် မဟုတ် — ⚠️ ADR ထဲ ပါပြီး):** #2 Google login hand-off (Android / iPhone app) · #4 company admin rule + code အသစ် auto-grant · #14 email = OTP + invite ပဲ (payslip / digest email ✖) · #22 backup sidecar။ ဒါတွေက ADR-005 / 010 / 007 / 002 ရဲ့ "OK" ထဲ ပါဝင်။

**ဒုတိယအကြိမ် စစ် (reviewer agent တူတူ — ပြင်ပြီးတာ ပြန်စစ်):** ၂၄ ချက်လုံး ရောက်ပြီး၊ 🔒 ဆန့်ကျင်တာ မရှိ; ထပ်တွေ့ ၈ ချက် ပြင်ပြီး — Part 1 header / မြန်မာ အကျဉ်း ၅၀ → ၅၂, ၁၄ → ၁၃ (edit ပျောက်ခဲ့) · **iPhone PWA hand-off** — Safari sheet ထဲ redirect ပြန်ရောက်ရင် cookie က sheet ထဲ ကျန်နိုင် → redirect ကို မမှီခိုဘဲ app က **verifier / challenge (PKCE ပုံစံ) + poll** (P1.AUTH.03 `challenge=`, P1.AUTH.04 park, P1.AUTH.06 `{ verifier }` 200 / 202 pending / 401) + Android `appUrlOpen` → `shell.onDeepLink` bridge · ADR-002 "after commit (revalidate)" စာသား ဟောင်း · `auth.cleanup` = OTP row ပဲ · socket handshake "CSRF header" စာသား ဟောင်း ၂ နေရာ · Next.js 16 နာမည် (`proxy.ts`, `cacheComponents`, `revalidateTag(tag, profile)`) · auto-grant target = `role.manage` + `role.assign` နှစ်ခုလုံး ပါတဲ့ role (deterministic) · hygiene (Part 0 `(app)` / `(site)` → `app/staff` / `app/site`, module map `auth/handoff` + `system/jobs` + internal `backup-runs`, SYS.04 / 05 အစဉ်, "enqueues `site.content_changed`" → event / job ခွဲ)။ OpenAPI `1.2.0-draft` validate ✅ (operation ၅၂)။

### 12.7 Owner အဖြေ (01/Oct 21:20) — ADR lock + provider *(v5.2.13)*

| ADR / မေးခွန်း | Owner | ရလဒ် |
| --- | --- | --- |
| ADR-001 | "OK — 1 VPS / Docker Compose" | Accepted (reconfirm) |
| ADR-002 · RPO | "pg-boss + PostgreSQL job architecture — OK" · RPO = "အကုန် OK" (daily) | Accepted · D-DAT-03 note |
| ADR-003 | "Capacitor Android + Bluetooth Classic ESC/POS — OK" | Accepted |
| ADR-004 / 008 / 009 | "အကုန် OK" (default) | Accepted |
| ADR-005 | "CSRF protection — OK" · "Android/iOS Google login hand-off flow — OK" | Accepted (အကုန်) |
| ADR-006 | "SSR + tag-based cache + transactional revalidation — OK" | Accepted |
| ADR-007 | email = "Resend ကို Free ရအောင်" · uptime = "Telegram ကို အမြဲ ပို့လို့ရလား" + "Email + Push" · error = "Sentry" · #27 / #28 / #29 | Accepted + **D-ARC-02** |
| ADR-010 → 011 | "Default Permission Matrix က Manage ဆိုပြီး ဘုံမဟုတ်ဘဲ view, create, update, delete … Action အလိုက်" · #25 = A · #26 a–d | **ADR-011 Accepted, ADR-010 Superseded** |

**Provider — ဘာကြောင့် ဒါ (ADR-007 "Owner choices" table; ဈေး / limit = 01/Oct/2026 စစ်ထား — build ချိန် ပြန်စစ်):**

| လို | Provider · plan | Limit | မှတ်ချက် |
| --- | --- | --- | --- |
| Email (OTP + invite ပဲ) | **Resend · Free** | ၃,၀၀၀ / လ · **၁၀၀ / ရက်** (UTC ရက် — မြန်မာ မနက် ၆:၃၀ reset) · domain ၁ ခု verify လို (Free ထဲ ပါ — build ချိန် ပြန်စစ်) · domain verify မလုပ်ခင် = account ပိုင်ရှင် email ဆီပဲ | Customer email ✖ (D-CUS-05) + stay signed in (D-AUTH-06) → တစ်ရက် အနည်းငယ်ပဲ; go-live မှာ invite အများကြီး ပို့ရင် ၁၀၀ / ရက် ကျော် → queue / ၂ ရက် ခွဲ |
| Uptime | **HetrixTools · Free** | monitor ၁၅ · **၁ မိနစ်တစ်ခါ** · location ၄ · Email + **Telegram** ပါ · **ရက် ၉၀ တစ်ခါ login** | Telegram = `@hetrixtools_bot` → Start → Chat ID → contact list; UptimeRobot Free = ၅ မိနစ် + Telegram ✖ လို့ မရွေး |
| Error | **Sentry · Developer (Free)** | user **၁** · error ၅,၀၀၀ / လ · alert = email ပဲ · Team = US$26 / လ | dev ၂ ယောက် သီးသန့် login လိုမှ Team |
| Account | owner ပိုင် **ops Gmail** တစ်ခု (ဥပမာ `point.ops@gmail.com`) | – | handover (D-PLT-06) — account ပိုင်ရှင် = ဆိုင် |
| Domain မရခင် | dev / staging = **Mailpit** · pilot = **Google login** · go-live ၂–၃ ရက် အလို Resend domain verify | – | DNS verify ချက်ချင်း မပြီးနိုင် |

**Alert routing:** server / website ပျက် → **Telegram + Email** (HetrixTools) · app error → **Email** (Sentry) · backup / job fail → **app ထဲ noti** + "Needs attention" panel (D-NTF-01)။

### 12.8 Independent review (subagent) — v5.2.13 lock batch *(01/Oct 21:20)*

> API Part 0 v1.3 / Part 1 v1.3 / Part 2 v1.2 + OpenAPI · ADR-001..011 · system design v1.1 · admin guideline v1.3 · db README · ဒီ review ရဲ့ ပြောင်းတဲ့ section တွေကို **မရေးခင် မမြင်ဖူးတဲ့ reviewer agent** နဲ့ owner အဖြေ + Appendix A 🔒 တိုက်စစ် → **HIGH ✖ · MEDIUM ၄ · LOW ၁၃** — owner အဖြေ / 🔒 ချိုးတာ မတွေ့၊ barber POS / booking / calendar read ကို `view` code နဲ့ ပိတ်မိတာ မတွေ့; YAML ၂ ခု validate ✅ (operation ၅၂ / ၅၀); code catalogue ၂၁ / ၂၂ နဲ့ endpoint / `x-permission` ကိုက်။ ပြင်ပြီး:

| # | Severity | တွေ့တာ | ပြင်ပုံ |
| --- | --- | --- | --- |
| 1 | MED | `view⁺` ကို ADR-011 မှာ "view + CRUD write" လို့ ရေး ↔ API = "view + module ရဲ့ code အကုန်" (special ပါ) → approver (`leave.approve` ပဲ) inbox 403 ဖြစ်နိုင် | ADR-011 #4 / action item = "module ရဲ့ code အကုန် (special ပါ)" |
| 2 | MED | `company` code ကို branch-scope assignment နဲ့ ပေးရင် ဘာဖြစ်လဲ မသတ်မှတ် (D-ROLE-07 "Manager company-wide ✖" နဲ့ ထိနိုင်) · maintenance bypass = branch `settings.update` | API-PERM-06 #5: **company code = company-scope assignment ကနေမှ** · API-PERM-02 `@Can()` wording ညှိ · `settings.view` / `service.view` Manager seed ဖြုတ် · maintenance = company-scope `settings.update` |
| 3 | MED | API-PERM-03 က role / permission catalogue ကို "reference list (code မလို)" ↔ P1.RL.01 / PERM.01 = code လို | reference list = branch summary + company info ပဲ |
| 4 | MED | OpenAPI Part 1 — RL.05 / RL.06 မှာ `last_admin` 409 မပါ; company admin ကင်းလွတ်ချက် မပါ | 409 + description ထည့် |
| 5–17 | LOW | "#15 ↔ #16" နံပါတ် ရှုပ် (sheet #15 = RPO) · operation ၄၅ ↔ ၅၂ · §11.2 / §12.3 ⚠️ စာသား ဟောင်း · shift horizon စာသား · Part 0 source v1.2 · D-ROLE-01..09 / `settings.view⁺` / ~45 → 43 / "Manager column" နာမည် · Part 2 header bold · ADR-008 room = read scope · Resend domain limit · no-show job "CONFIRMED" → BOOKED · ops alert ≠ D-NTF-01 note · `status` filter = open | အကုန် ပြင် (status filter = open, archived = `view⁺`); #16 (manager က ကိုယ့် APPROVED ခွင့် cancel) = ပြန်လာ အလုပ်လုပ်တာမို့ အန္တရာယ် မရှိ — မပြောင်း |


### 12.9 Independent review (subagent) — v5.2.14 scope A + Part 3 *(01/Oct 23:30)*

> ADR-012 + Part 0 v1.4 / Part 1 v1.4 / Part 2 v1.3 + **Part 3 v1.0** + OpenAPI ၃ ဖိုင် + guideline ၂ ဖိုင် + system design v1.2 ကို **မရေးခင် မမြင်ဖူးတဲ့ reviewer agent** နဲ့ Appendix A · DB Part 3 v3 constraint · Part 0 / 1 / 2 · UX rule တွေနဲ့ တိုက်စစ် → **၂၉ ချက် (HIGH ၂ · MED ၁၅ · LOW ၁၂) — အကုန် ပြင်ပြီးမှ ထုတ်**။ OpenAPI ၃ ဖိုင် validate ✅။

| # | Severity | တွေ့တာ | ပြင်ပုံ |
| --- | --- | --- | --- |
| 1 | HIGH | Register (D-ROLE-09) မှာ v5.2.13 "company code = company scope ကနေမှ" စာ ကျန်နေ · "Manager company-wide ✖" ဆိုတာ shared customer နဲ့ မကိုက် | ဒီ review v5.2.14 — D-ROLE-02 / 07 / 09 note · Part 0 / ADR-011 / ADR-012 စာ = "company master ✖ · customer = shared ချွင်းချက်" |
| 2 | HIGH | START ↔ no-show auto-cancel ↔ reschedule ↔ cancel တပြိုင်နက် ဖြစ်ရင် row lock မရှိ (START ပြီးသား booking ကို cancel လုပ်မိနိုင်) | **P3-RULE-09: writer တိုင်း booking row ကို `FOR UPDATE` lock + status ပြန်စစ်** (job = no-op) |
| 3–17 | MED | token တူ ၂ ခါ တပြိုင်နက် (→ advisory lock + 23505 map) · pg-boss `singletonKey` က job အသစ်ကို ချန်မိ (→ key မသုံး, job ဟောင်း = no-op, snooze = audit row) · active-booking probe (→ နောက်ဆုံးမှ စစ်, attempt limit, IP limit captcha မတိုင်ခင်) · token က body / site log ထဲ ရောက်နိုင် (→ redact + audit) · နောက်မှ eligible ဖြစ်မယ့် barber · reschedule availability ↔ confirm မကိုက် · `sort_order` unique · `bookings_home_chk` case (BRANCH လိပ်စာ 400, HOME → BRANCH null, ကားခ default 0) · alarm = admin အကုန်ဆီ (→ branch စီမံသူ) · "no-show = start ပြီးမှ" = Claude rule (→ ဖြုတ်) · register note · search မှာ Inactive · FE-BK-11 row ၂ · product-only sale timeline · reschedule ခရီးချိန် | Part 3 rule / endpoint / OpenAPI · ADR-002 · system design · FE-BK-11 · ဒီ review |
| 18–29 | LOW | OpenAPI `maxItems` vs setting · dead error code · length · warning = staff ပဲ · `removed_item_ids` · API-PUB-02 HOME လိပ်စာ ချွင်းချက် · `orSelf` decorator · noti recipient enum · branch code စာလုံး · public `expected_updated_at` · calendar cross-branch · problem `context` · stale ref · Manager ငွေ override (★ seed) · kept item စစ်ပုံ | အကုန် ပြင် |

---

### 12.10 ADR-013 / 014 / 015 + ADR-012 Amendment 1 + system design v1.3 · independent review *(v5.2.15 — 02/Oct)*

> Owner one-sheet **H** ("Architecture — ADR အသစ်: အကုန် ✔") + F4 / C1 → ADR ၃ ခု **Accepted** တန်း (D-PLT-11 — owner approve ပြီးသား)။

- **ADR-013 (PDF / receipt):** မြန်မာစာ shaping မှန်ဖို့ browser engine (Chromium) နဲ့ပဲ render — PDF library တွေက မြန်မာစာ stacking ပျက်။ Receipt ကို FINISH ချိန် တစ်ခါ render ပြီး ဖိုင်သိမ်း → reprint / share အမြဲ တူ (D-PAY-06)။ Job မပြီးခင် တောင်းရင် on-the-fly render။ ၃ ခါ fail → `job.failed` (mandatory noti)။
- **ADR-014 (file):** server disk မသုံး — owner ပိုင် bucket (~US$0–1 / လ, international card လို ★)။ Upload = staging → record သိမ်းတဲ့ transaction ထဲမှာ ချိတ် (မချိတ်တာ = ၁ နာရီတစ်ခါ ရှင်း)။ Development = MinIO (option)။
- **ADR-015 (report):** V1 load (ဆိုင်ခွဲ ၃) မှာ live query လုံလောက် — summary table / warehouse = revisit trigger (query > 15 s)။
- **ADR-012 Amendment 1:** scope level ၅ မျိုး — company master · branch data · mixed · shared · **private**။ Private code = ၁၈ (Part 5 ၁၆ + `report_commission_payroll.view` + `employee.documents`)။
- **ADR-002:** job ၁၈ ခု (နာမည် · MMT အချိန် · owner part · idempotency · retry) — `receipt.render`, `stock.reconcile_levels` 01:30, `closing.month_end_must_return` နေ့စဉ် 01:00 (လ အကုန် ပိတ်ပြီးမှ convert), `notifications.purge` 02:00, `uploads.purge` / `exports.purge` hourly, `export.run`, `import.run`, `attendance.detect_exceptions` ၁၅ မိနစ် + 23:55 …; backup = sidecar (နေ့စဉ် 03:00 · restore test လ ၁ ရက် 04:00)။
- **ADR-006 / 007 / 008 / 009 note:** website "Open now" = browser မှာ တွက် (`server_time`) · public API `max-age=10` · `backup.failed` / `job.failed` / `backup.restore_authorized` = mandatory SECURITY noti · realtime payload = id ပဲ (ငွေ ✖ — Part 4 / 5 / 6 payload ၅ ခု ပြင်), attendance / payroll event = user room · internal key ၂ ခု (`INTERNAL_SSR_KEY` / `INTERNAL_OPS_KEY`) · public media path။
- **System design v1.3:** flow အသစ် (FINISH + DayLock + receipt · စာရင်းပိတ် · payroll · stock · file / report) · **lock အစဉ် တစ်ခုတည်း** (day → payroll → sale → visit → booking → payment → receipt counter → cash out / closing → stock level) + **isolation** (ငွေ write = READ COMMITTED, lock အရင်; preview / report = REPEATABLE READ READ ONLY) · realtime room table · security level table · open item = OPEN-40 (a / b / c), D-PAY-08။

**Independent review — cross-part + architecture (reviewer #3, ၂၉ ချက်: HIGH ၃ · MEDIUM ၁၁ · LOW ၁၅)** — §11.9 ဇယား #8–#10 + MEDIUM (audit `branch_id` rule · backup / import read scope ↔ ADR-012 · internal key တစ်ခုတည်း (web container က backup endpoint key ကိုင်) → ၂ ခု ခွဲ · public media rate limit · `site.*` write path) — အကုန် ပြင်ပြီး။ Script နဲ့ စစ်: `x-permission` code ၁၇၄ = code table တစ်ခုစီမှာ တစ်ခါပဲ + Part 0 §11 · event ၅၈ = API-RT-03 · noti ၄၁ = Part 8 §15 · job ၁၈ = ADR-002 · setting key ၄၈ = Part 1 §8 · endpoint ၄၄၁ = YAML operation · YAML ၈ ဖိုင် validate ✅ · 🔒 decision ချိုးတာ = OPEN-40 ကလွဲ မတွေ့။

### 12.11 ADR-016 + OpenSpec batch + coding guideline · independent review *(v5.2.16 — 02/Oct မနက်)*

**ADR-016 — Two repositories (Accepted, owner 02/Oct):** `point-sdd` = spec hub / OpenSpec store · `point-barber` = app / pointer (`store: point-sdd`) · workspace `point/` · `/opsx:apply` = point-barber ထဲ · design ပြောင်း = point-sdd မှာ အရင် · repo ၂ ခု private · store (beta) မရရင် fallback = additional directory။ **ADR-001 Amendment 2** = action item 1 (monorepo ထဲ `docs/` `openspec/`) ကို ဒီအတိုင်း ဖတ်။ OpenSpec 1.14.0 နဲ့ စမ်းပြီး: store register → pointer repo ထဲက `openspec list` က point-sdd ရဲ့ change ၄ ခု ပြ; `openspec init` က ရှိပြီးသား `config.yaml` ကို မထိ။

**OpenSpec change ၄ ခု** (`openspec validate --all --strict` ✅):

| Change | Capability | Requirement / scenario / task | Owner | Open questions |
| --- | --- | --- | --- | --- |
| `add-repo-scaffold` | platform-runtime (⚠️ S3) | 20 / 70 / 94 (PR ၈) | Dev 2 lead + Dev 1 (တွဲ — tooling ခြွင်းချက်) | S2 · S3 · S4 · S5 |
| `add-shared-ui-components` | ui-foundation (⚠️ S3) | 76 / 228 / 169 (PR ၃) | Dev 1 | S2 · S3 · S5 · S8 · S15 · S18 |
| `add-foundation-auth-access` | auth · access · audit · organization · platform-runtime | 43 (41 new + 2 modified) / 203 / 94 (PR ၃) | Dev 2 | S2 · S3 · S5 · S6 · S9 · S10 · S12 · S13 · S14 · S18 |
| `add-walkin-visit-checkout` | visits · sales-checkout · payments · services-pricing · customers | 39 / 203 / 145 (PR ၃) | Dev 2 (API + screen + test အပြည့်; Dev 1 review) | S2 · S3 · S7 · S8 · S16 · S17 · S18 |
| **စုစုပေါင်း** | capability ၁၁ | **178 / 704 / 502** | | S1–S18 (S1 = schedule, S11 = API Part 5 — change ၄ ခုနဲ့ မဆိုင်) |

**Coding guideline Draft v1.0 (D-ENG-02 · ⚠️ REC-42):** rule ID ၁၅၁ = rule ၁၄၅ + pointer ၆ (ထပ်နေတဲ့ rule ၆ စုံကို တစ်ခုစီ ပေါင်း — ID မပြောင်း) (META 5 · PRIN 6 · TS 9 · NAME 5 · ARCH 9 · API 8 · DB 12 · MONEY 7 · TIME 6 · ERR 6 · SEC 12 · IDEM 5 · UI 10 · I18N 5 · TEST 10 · GIT 6 · REVIEW 4 · OBS 4 · PERF 4 · DOC 4 · DEP 6 · AI 8) · CI ၆၆ / Both ၆၄ / Review ၁၅ · §24 စစ်ချက် ၈၉ ခုစီမှာ **ဘယ် change က ဆောက်မလဲ** ပါ (ပေါ့တာ = scaffold; လေးတာ = `add-ci-guard-rails`) · tool pin rule = plugin အကုန် ထောက်ပံ့တဲ့ နောက်ဆုံး major (TypeScript 6.0.x · ESLint 9.x + `eslint-plugin-import-x` · Prisma 7.x — npm `latest` မဟုတ်) · transaction = service က ဖွင့် (`TransactionRunner.run`), audit row ကို runner က commit မတိုင်ခင် ရေး · reference က locked rule နဲ့ မကိုက်တဲ့ ၁၇ နေရာမှာ locked rule ကို လိုက် (ဥပမာ `enum` ✖ → smallint code constant · JWT ✖ → server session · generic idempotency table ✖ → row ရဲ့ `client_request_id`)။

**Tool ပြင်ဆင်ချက် (point-sdd):** browser tester harness = passwordless — `getLoginEmail` + `fetchLoginCode` (Mailpit API; code ကို secret အဖြစ် redact) + test ၁၃ ခု (harness test ၄၁ PASS · Python tool test ၃၂ PASS) — `after` (code မတောင်းခင် အချိန်) နဲ့ `run` မပါရင် ငြင်း (code အဟောင်း မရိုက်မိအောင် / code ကို အမြဲ redact) · လိပ်စာ အတိအကျ တူမှ ဖတ် · Mailpit မရရင် case = BLOCKED · `point-generate-tests` skill = `docs/…` path + fixture ဖိုင် · `tools/extract-decision-register.py` (Appendix A → `decision-register.md`)။

**Independent review (subagent ၄ ယောက် — ရေးတာ မမြင်ဖူးသူ):** ရေးတာ မမြင်ဖူးတဲ့ reviewer ၄ ယောက် (R1 scaffold + foundation · R2 walk-in · R3 shared UI + UX guideline · R4 coding guideline + plan + record + tool) — **finding ၁၇၄ (HIGH ၁၄ · MEDIUM ၈၄ · LOW ၇၆)**။ အရေးကြီးတာ: (1) walk-in ကို dev ၂ ယောက် layer ခွဲထားတာ ↔ owner ဆုံးဖြတ်ချက် "တစ်ယောက် အပြည့်" → **Dev 2 အပြည့်** (2) CASH / KBZPAY က test fixture ထဲမှာပဲ ရှိ → **base seed (environment တိုင်း)** (3) module folder က ADR-001 ရဲ့ bounded context ၁၃ ခုနဲ့ မကိုက် → ADR-001 အတိုင်း (4) capability ၂ ခုကို lock လို ရေးထား → **အဆိုပြုချက် (S3)** လို့ မှတ် (5) "မီးပျက်ရင် ပုံမှန် walk-in အဖြစ် နောက်မှ ထည့်" ဆိုတဲ့ ကြားဖြတ် rule ↔ D-VIS-13 → ဖျက်; `add-late-entry` ကို pilot မတိုင်ခင် (S16) (6) "ပထမ ၄ ခုပြီးတာနဲ့ pilot" မဖြစ်နိုင် (server / တကယ့် data မရှိ) → pilot gate ရွှေ့ + `add-pilot-data-seed` (7) code မှား ၅ ခါ lock counter ပြန် reset ဖြစ်နိုင်တဲ့ design + transaction ကို interceptor က ဖွင့်တဲ့ design → service က ဖွင့် (guideline နဲ့ တစ်မျိုးတည်း) (8) tool version — npm `latest` (TypeScript 7 · Prisma 8 rc · ESLint 10) နဲ့ lint plugin မကိုက် → pin rule (9) admin guideline မှာ rule ID `AD-META-07` နှစ်ခု ဖြစ်သွား → design reference rule = **AD-META-08** (10) REC-41 status အရောင် ၃ ခု အလင်းအမှောင် တူနေ (AD-VIS-04) → ပြန်အဆိုပြု + `🟡` tag (11) "Open question ရှိလည်း task group တချို့ စလို့ရ" ↔ config rule → **change တစ်ခုလုံး မ apply** (12) guideline ရဲ့ CI စစ်ချက် အများစုကို ဘယ် change ကမှ မဆောက် → `add-ci-guard-rails` (roadmap #77) (13) browser tester `fetchLoginCode` default မလုံခြုံ → `after` / `run` မဖြစ်မနေ။ **ရလဒ်:** ရေးသူ ၅ ယောက် + lead က finding အကုန် ပြင် (source က မဆုံးဖြတ်ပေးတာ = §0.11 S12–S18 အသစ် + မှတ်တမ်း R11–R14) → `openspec validate --all --strict` ✅ (4 / 4; foundation မှာ INFO ၁ — scaffold ကို အရင် archive ရမယ်၊ dependency အစဉ်အတိုင်းပဲ) · harness ၄၁ / Python ၃၂ test PASS · DB test ၃၉၃ PASS (မပြောင်း)။ Reviewer report = batch ထဲ မပါ (chat မှတ်တမ်း)။

### 12.12 Sheet 3 close-out — change ၄ ခု apply လုပ်လို့ရပြီ *(v5.2.17 — 02/Oct 14:30)*

Owner အဖြေ (§0.11 — "အကုန် OK") ကို change ၄ ခုထဲ သွင်း: proposal ရဲ့ "Needs the owner's answer" = **None**၊ အဖြေတွေက "Answered by the owner" block ထဲ (ဘယ် ID မှာ မှတ်ထားလဲ ပါ)၊ "approve ဖြစ်မှ ဆောက်" လို့ ရေးထားတဲ့ task တွေ = ပုံမှန် task။ `openspec validate --all --strict` ✅ (4 / 4; foundation မှာ INFO ၁ — scaffold ကို အရင် archive ရမယ်)။

| Change | Requirement / scenario / task | ထပ်ထည့် / ပြောင်းတာ |
| --- | --- | --- |
| `add-repo-scaffold` | 20 / 72 / 94 (PR ၈) | 500 = `internal_error` + field-level code rule (API-ERR-02 / 03 v1.6) — scenario ၂ ခု ထပ် |
| `add-shared-ui-components` | 77 / 235 / 169 (PR ၃) | **requirement အသစ်:** focus outline = `--foreground`, input border = `--muted-foreground` (S15) · contrast ဇယား: staff = ကျတာ မရှိ; site = muted စာ 4.09 + error စာ 4.11 ပဲ ကျန် (REC-41 မ approve ရသေး) · ReasonDialog ရလဒ်ကို caller က map (S8) |
| `add-foundation-auth-access` | 46 (44 new + 2 modified) / 221 / 96 (PR ၃) | **requirement အသစ် ၃ ခု:** code verify ၁၀ / နာရီ / IP (S9) · same-browser sign-in (S14 — P1-RULE-15) · ပထမ admin command (S6 — P1-RULE-14) · `permission.sync` = run က တစ်ခုခု ပြောင်းမှ row ရေး (S13) |
| `add-walkin-visit-checkout` | 41 / 210 / 145 (PR ၃) | **requirement အသစ် ၂ ခု:** START chip = catalogue အစဉ် ပထမ ၆ ခု (S7) · offline help = "စာရွက်မှာ ရေး၊ Late entry နဲ့ ထည့်" (S16) · `correction_path` မပါတဲ့ case (S17) |
| **စုစုပေါင်း** | **184 / 738 / 504** | capability ၁၁ (စာရင်း ၂၅ ခု အကုန် 🔒) |

**တခြား ပြောင်းတာ:** `openspec/config.yaml` (capability ၂၅ 🔒; Open questions rule = "Needs the owner's answer" အောက်မှာ ကျန်ရင် change တစ်ခုလုံး မ apply) · dev plan **v1.1** (§6 = S1 ဆုံးဖြတ်ချက် + လုပ်ပုံ "Claude Code ရေး / developer စစ်" + တိုင်းမယ့်ပုံ) · roadmap (ပထမ ၄ ခု = apply လုပ်လို့ရပြီ) · coding guideline (lead alignment ၃ ချက် — CG-GIT-01 branch per PR · CG-META-04 · §24 row 38 / 39; **content က ⚠️ REC-42 ပဲ ရှိသေး**) · browser tester (`after` = နောက်ဆုံး ၁၀ မိနစ်အတွင်း အချိန်ပဲ လက်ခံ; sign-in မရရင် case အကုန် BLOCKED) · v5.2.16 batch ကို ပြန်စစ်တဲ့ reviewer ၁ ယောက် — finding ၁၃ (HIGH ၀) ပြင်ပြီး။

**ကျန်နေဆဲ (owner):** ✋ ACT-09 repo private + GitHub plan · ~~REC-42 coding guideline "OK"~~ ✅ 13:46 · ~~REC-41 website ကျန်အရောင် "OK"~~ ✅ 13:46 (v5.2.18 — shared UI = 77 / 239 / 169; စုစုပေါင်း 184 / 742 / 504) · ★ OPEN-30 admin palette · design reference ပုံ · logo · pilot data · ပထမ admin ရဲ့ email / နာမည် / employee code · Google OAuth client။


---

## Appendix A — Decision Register

> Conversation ထဲမှာ lock လုပ်ခဲ့တဲ့ ဆုံးဖြတ်ချက်အားလုံး။ **ဒီ appendix ထဲက 🔒 row တွေကပဲ requirement** (🔒 D-PLT-11)။
> **Status:** 🔒 Locked · ⚠️ REC-nn = row ကိုယ်တိုင်က 🔒 ပဲ၊ ဒီ review က ပြောင်း/ဖြည့်ဖို့ အကြံပြုထားတယ် — **approve မလုပ်မချင်း 🔒 စာသားအတိုင်း build** · 🟡 OPEN-nn = အသေးစိတ် မဆုံးဖြတ်ရသေး (owner / မင်း) · ⏭ V1 မပါ
> Decision ID ကို `D-<module>-NN` ပုံစံ ပေးထားတယ်။ Source = conversation prompt/response။ Register ID (REC / OPEN) အသေးစိတ် → §3.0။
> **Update လုပ်ပုံ:** REC / OPEN တစ်ခု approve ဖြစ်ရင် — row အသစ်ထည့် (ဒါမှမဟုတ် ရှိပြီးသား row ရဲ့ Decision စာသားကို ပြင်)၊ Source မှာ approve လုပ်တဲ့ နေ့စွဲ / chat ထည့်၊ §3.0 register မှာ "🔒 D-xx" လို့ ပြောင်း။

### A.1 Platform & System
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-PLT-01 | Web core + Android `.apk` + Windows `.exe`; iOS = PWA later | P3 | 🔒 |
| D-PLT-02 | Backend ၁ ခု၊ DB ၁ ခု | R2 | 🔒 |
| D-PLT-03 | Myanmar + English; system default (admin) + user တစ်ယောက်ချင်း switch · *v4:* **system + public website နှစ်ခုလုံး**; screen စာသားအားလုံး (button, label, error) ကို language file (my / en) ထဲမှာပဲ စု — code ထဲ တိုက်ရိုက်မရေး · *v5.2.7:* user ရဲ့ ရွေးချယ်မှုကို **user account** မှာ သိမ်း — `users.ui_language` (1 MY · 2 EN · NULL = system default; Part 1 v3.3); session payload နဲ့ ပြန်ပေး; OTP / invite email + notification ကိုလည်း ဒီဘာသာ | P206 · owner 29/Sep · owner 01/Oct (OPEN-33) | 🔒 (admin ရိုက်ထည့်တဲ့ data ၂ ဘာသာ — D-DB-04) |
| D-PLT-04 | Currency MMK; EN `Ks`, MM `ကျပ်`; comma separator · *v5.2.7 (owner 01/Oct):* **public website = `7,000 Ks` ဘာသာ ၂ မျိုးလုံး** (formatter profile `site`); admin app = ဒီ row အတိုင်း (`app` profile) · *v5.2.8:* ✅ owner confirm — **admin app မပြောင်း** ("Website မှာပဲ ပြောင်းမှာ") | P203, P207 · owner 01/Oct (website) · owner 01/Oct 10:47 (confirm) | 🔒 |
| D-PLT-05 | 12-hour time; date `DD/MMM/YYYY`; timezone Asia/Yangon · *v5.2.7 (owner 01/Oct — OPEN-32):* **ဂဏန်း 0–9၊ လနာမည် English (`01/Oct/2026`)၊ AM / PM — မြန်မာ UI မှာလည်း အတူတူ** (label / weekday word ပဲ ဘာသာပြန်); input မှာ ၀–၉ ရိုက်ရင် 0–9 ပြောင်း | P204, P205 (timezone: P1 brief, R203 "shop timezone") · owner 01/Oct | 🔒 |
| D-PLT-15 | **လုပ်ငန်းနေ့ (business date) = MMT (Asia/Yangon, UTC+06:30) ပြက္ခဒိန် ရက်** — ဆိုင်ခွဲ ပိတ်ချိန် ည ၁၂ နာရီ မကျော် (owner); transaction row တိုင်းမှာ `business_date` (MMT) သိမ်း (daily closing / report / commission period); screen / report / တွက်ချက် အကုန် MMT; DB session timezone = Asia/Yangon; `*_at` = timestamptz (တိကျတဲ့ အချိန်) | owner 30/Sep (REC-34) | 🔒 |
| D-PLT-06 | Handover docs (install, backup, restore, deploy, admin guide) | R2 | 🔒 |
| D-PLT-07 | ပြောင်းခဲတဲ့ rule တွေကို "Additional / Advanced Settings" ထဲ စု | P209 | 🔒 · store ပုံစံ = D-PLT-16 |
| D-PLT-17 | **Coding methodology = Spec-Driven Development (SDD) — tool = OpenSpec.** DB design (Part 1–8) ပြီးရင် coding မစခင် module တိုင်း OpenSpec change (proposal → spec delta → design → tasks) ရေး → Claude Code / dev ၂ ယောက် က spec အတိုင်း implement → archive; spec ရဲ့ source = Appendix A decision register (D-ID ညွှန်) + `db/` DBML; D-PLT-13 (conflict → STOP) ကို spec ရေးချိန်မှာ ဖမ်း · *v5.2.16:* ရေးပုံ + change အရွယ် = 🔒 D-PLT-20 · spec source ဖိုင်တွေ = `point-sdd/docs/` (repo ၂ ခု — 🔒 D-ARC-03 / ADR-016) · ပထမ change ၄ ခု ရေးပြီး (§0.10) | owner 30/Sep မနက် · owner 02/Oct (OpenSpec အဆင့်) | 🔒 |
| D-PLT-16 | **Settings store (REC-33):** `settings (key, scope_type 1 COMPANY · 2 BRANCH, scope_id, value jsonb, updated_by, updated_at)` + `settings_history` (ပြောင်းတိုင်း အဟောင်း + ဘယ်သူ); key / type / default / validation / scope = repo ထဲ `settings.json` (D-ROLE-08 ပုံစံ — deploy မှာ sync, typo = build error); DB row မရှိ = default; admin UI = type အတိုင်း form (number / boolean / time / choice / text MM+EN); snapshot (payroll rules_snapshot, closing) = value copy · *v5.2.15 (one-sheet 02/Oct):* `site.*` key = `website.update` နဲ့ P8.WEB.02 ကပဲ ရေး · `payroll.*` / `attendance.*` key = company-only · key အသစ် / ဖြုတ် = API Part 1 §8 | owner 30/Sep မနက် (REC-33) | 🔒 |
| D-PLT-08 | Maintenance mode (admin ON/OFF, admin ဝင်ရ) + read-only system status page | P220 | 🔒 |
| D-PLT-09 | Principle: lock ထားတဲ့ decision = source of truth; Fresha = reference | P342, R342 | 🔒 |
| D-PLT-10 | iOS: PWA first; V1 မှာ iOS native package မလုပ် | R2, P3/R3, R359 | 🔒 (+ iOS design အချက်များ — §5.7) |
| D-PLT-11 | Review ထဲက concern / recommendation ≠ requirement။ Item တိုင်း 🔴 Risk / 🟡 Open / 🔒 Resolved / ⚠️ Recommendation classify; 🔒 ဖြစ်မှ DB / code ထဲ ထည့်။ Workflow = Research → Classification → Decision → 🔒 → DB design → Implementation | P366, R366, P367, R367 | 🔒 (register — §3.0) |
| D-PLT-12 | DB design ကို domain part ၈ ခု ခွဲ၊ dbdiagram.io DBML နဲ့ပြ၊ part တစ်ခု review + lock ပြီးမှ နောက် part (auto မဆက်) | P360, R360 | 🔒 (အခြေအနေ — §6.2) |
| D-PLT-13 | Requirement conflict တွေ့ရင် Claude Code / assistant က တစ်ဖက်ကို ကိုယ်တိုင်မရွေး — STOP → ဆန့်ကျင်နေတဲ့ requirement တွေ ရှင်းပြ → owner ဆုံးဖြတ်မှ ဆက် (business rule, DB, payment/finance, commission/payroll, permission/security, data lifecycle) | P383–P386 (RISK-08) | 🔒 (§3.12) |
| D-PLT-14 | Developer ၂ ယောက် + Claude Code; target တစ်လ; V1 scope အကုန် (feature မဖြုတ်); release မခွဲ (REC-10 ✖); parallel / vertical slice · *v5.2.16 (owner 02/Oct — sheet A2 / #7):* **Dev 1 = Website + Admin panel · Dev 2 = Admin panel**; change တစ်ခုကို developer တစ်ယောက်က API + migration + screen အပြည့် (vertical — `add-walkin-visit-checkout` = Dev 2; scaffold တစ်ခုပဲ နှစ်ယောက်တွဲ); spec ဖိုင် ရတာနဲ့ စ (Open questions ဖြေပြီးမှ apply); ခွဲဝေပုံ + အစဉ် = `docs/plan/dev-plan.md` + `roadmap.md` · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **S1 — "တစ်လ" = pilot slice (ပထမ change ၄ ခု + pilot လိုအပ်ချက် ၃ ခု) ပစ်မှတ်; V1 အပြည့်ရက်ကို ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ owner သတ်မှတ်** (scope / release မခွဲ မပြောင်း) · **လုပ်ပုံ (owner 13:07): Claude Code က code ရေး၊ developer ၂ ယောက်က review + test** — ငွေ / permission / စာရင်းပိတ် အပိုင်း သေချာစစ်; ခန့်မှန်း V1 ~၁ လခွဲ–၂ လခွဲ (dev-plan v1.1 §6) | P382, R382 (RISK-07) · owner 29/Sep · owner 02/Oct · owner 02/Oct 13:08 (§0.11) · owner 02/Oct 13:07 (လုပ်ပုံ) | 🔒 · ✅ ၂ ယောက် ခွဲဝေပုံ (v5.2.16) · ✅ schedule = S1 (v5.2.17 — "တစ်လ" = pilot ပစ်မှတ်; V1 ရက် = velocity တိုင်းပြီးမှ; dev-plan §6) · spec-driven = 🔒 D-PLT-17 / D-PLT-20 · waitlist ⏭ (D-BKG-20 — အချိန်ကြောင့် မဟုတ်) |
| D-UI-01 | Form rule: required field = label ဘေး အနီ (\*); validation error = field အနီ outline + error message; error စာသား language file ထဲက | owner 29/Sep | 🔒 (§3.12) · ⚠️ message ကို field အောက်မှာ + form component တစ်ခုတည်း shared = assistant အကြံ *(v5.2.6: admin guideline AD-FORM-01/02 ထဲ ⚠️ အဖြစ် ထည့်ပြီး — REC-40 approve ရင် 🔒)* · UI/UX guideline အကုန် = A.17 |
| D-PLT-18 | **Development အစဉ် (v5.2.6):** (1) **UI/UX guideline** (`docs/ux/` — D-UX-01) ကို owner / team review + ပြင် → approve (*v5.2.8: font ✅; colour palette = အဆင့် (2) ရောက်မှ owner ပေး — OPEN-30*) → (2) **API design** — module အလိုက် REST + OpenAPI (§5.5 — permission + branch scope, money endpoint idempotency, audit); source = Appendix A + `db/` + UX guideline flow; OpenSpec change (D-PLT-17) → (3) **Code development** — Claude Code + dev ၂ ယောက် (D-PLT-14); shared UI component + token အရင်၊ walk-in → checkout vertical slice | owner 30/Sep ည ("လိုတာပြင်ပြီးတော့မှ API → Code Development") | 🔒 |
| D-PLT-19 | **Workflow — မေးခွန်း အရင်၊ ဖိုင် နောက်:** Claude က open item တွေကို **decision sheet တစ်ခုတည်း** (§0.6 ပုံစံ — နံပါတ် + Claude default + ချိတ်) အရင် မေး; owner **အကုန် ဖြေပြီးမှ** ဖိုင် ထုတ် / lock (ဖြေခင် draft ဖိုင် ထုတ်ပြီး ပြန် confirm ချိန် ပြန်ထုတ်ရတာ အချိန်ကုန်); API design + architecture (ADR) + review ကို **တစ်ခါတည်း ပေါင်းထုတ်**; owner "အကုန် OK" = default အတိုင်း | owner 01/Oct 15:22 ("ငါ ဖြေရမှာတွေ အရမ်း များနေပြီ … မေးခွန်းကို အရင် မေးလိုက်၊ အကုန် ဖြေပြီးမှ API ရော Architecture ရော တစ်ခါတည်း ပေါင်းထုတ်") | 🔒 |
| D-PLT-20 | **OpenSpec spec ရေးပုံ + change အရွယ် (v5.2.16):** (1) OpenSpec CLI **1.14.0** pin — project context + artifact rule = `openspec/config.yaml` (ဒီ version မှာ `project.md` မရှိ); command `/opsx:explore` · `/opsx:propose` · `/opsx:apply` · `/opsx:archive` (2) **change တစ်ခု = form / topic တစ်ခု** (Branch, Employee, Service …) — ၁–၃ ရက်၊ test case ~၂၀–၃၀; နာမည် = verb + feature (`add-…` / `change-…` / `remove-…` / `fix-…`) (3) **requirement တိုင်း = တကယ့်တန်ဖိုး (limit / status / message key) ပါတဲ့ SHALL စာကြောင်း + source ID** — "D-PAY-04 ကြည့်" ချည်း ✖; scenario = တကယ့် နာမည် / MMK ပမာဏ / အချိန် / error `code` (`docs/plan/spec-fixtures.md`), မျှော်လင့်တန်ဖိုးကို တွက်ပုံနဲ့ (4) **capability = business area ၂၅ ခု 🔒** — owner ၁၈ (auth · access · services-pricing · scheduling · leave · customers · booking · visits · sales-checkout · payments · discounts · refunds · inventory · finance-closing · commission-payroll · attendance · settings · website) + owner OK ၅ (organization · notifications · reports-dashboards · audit · data-management) + Claude ထပ်ထည့် ၂ (`platform-runtime` · `ui-foundation` — ✅ owner OK 02/Oct 13:08, §0.11 S3) (5) spec = English + proposal ထိပ် `## မြန်မာ အတိုချုပ်` (6) spec ကို change တစ်ခုချင်းက ဖြည့် (၈ part လုံး ကြိုမရေး); စာရှည် မကူး — တစ်ကြောင်း + ID (7) **ပထမ change အစဉ်:** `add-repo-scaffold` (ADR-001) → `add-shared-ui-components` (AD-IMPL-02 ~၃၅ ခု — dev ၂ ယောက်လုံး သုံးမှာမို့ အရင်) ∥ `add-foundation-auth-access` (login, session / CSRF, permission + scope guard, audit, idempotency, seed) → `add-walkin-visit-checkout` (Today → START → COMPLETE → checkout → FINISH → receipt PDF) → pilot (8) proposal မှာ "Open questions" ကျန်ရင် **အဲ့ change တစ်ခုလုံး** apply ✖ (D-PLT-13) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **S3 — `platform-runtime` + `ui-foundation` OK → capability ၂၅ ခု အကုန် 🔒** · **S2 — ပထမ change ၄ ခုကို ဒီအတိုင်း ထား (အရွယ် rule ရဲ့ လက်ခံထားတဲ့ ခြွင်းချက်)**: PR ခွဲ merge (scaffold ၈ · ကျန် ၃ ခုစီ), အစောပိုင်း PR = CI + review နဲ့ merge, နောက်ဆုံး PR မှာ test workbook (CG-GIT-05) · **S16 — #7 အစဉ်: … `add-walkin-visit-checkout` → `add-staging-deploy` + `add-pilot-data-seed` + `add-late-entry` → pilot** (pilot = browser + Google login; စာရွက်မှတ်တမ်းအတွက် ကြားဖြတ် rule မထား) · **S18 — source မှာ မပါတဲ့ UI / email စာသား = အဆိုပြုစာသားနဲ့ စ၊ owner က brief / PR မှာ ပြင်** (key / behaviour မပြောင်း) · (8) = "Needs the owner's answer" အောက်မှာ ကျန်ရင် change တစ်ခုလုံး မ apply · ပထမ change ၄ ခု = Open questions ပိတ်ပြီး, apply လုပ်လို့ရပြီ (requirement ၁၈၄ · scenario ၇၃၈ · task ၅၀၄) | owner 02/Oct မနက် (sheet A1 · C1–C5 · sheet 2 #5 / #6 · 09:17 — §0.10) · owner 02/Oct 13:08 (§0.11) | 🔒 · ✅ capability ၂၅ + ပထမ change ၄ ခုရဲ့ အရွယ် (S2 / S3 — v5.2.17) |

### A.2 Organization, Employees, Roles
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-ORG-01 | Company (parent) → Branches; branch ၃ ခု၊ ထပ်တိုးနိုင် | P227 | 🔒 |
| D-ORG-02 | Company info နဲ့ branch info သီးခြား (name, logo, phone, email, address, social, lat/long, radius) | P203 | 🔒 |
| D-ORG-03 | V1 = company တစ်ခုတည်း (Point)။ နောက်မှ multi-company မြန်မြန်ဖွင့်လို့ရအောင်: (1) `companies` + `branches.company_id` ထား (2) company-level master table (roles, employees, customers, services, expense category, cash out reason, leave type, settings စသည်) မှာ `company_id` NOT NULL (3) unique rule ကို company အလိုက် (ဥပမာ customer phone = company တစ်ခုအတွင်း unique) (4) branch-level transaction table တွေက branch ကနေ company သိ — column မထပ် (5) code ထဲ "current company" ကို တစ်နေရာတည်းက ဆုံးဖြတ် (V1 = အမြဲ Point)။ V1 မှာ မဆောက်: login မှာ company ရွေးတာ၊ super admin၊ company အလိုက် website / domain၊ billing။ နောက်မှ ဖွင့်ရင် Row-Level Security နဲ့ ပိတ် | Claude 29/Sep ည (OPEN-22, F-P1-09) | 🔒 |
| D-EMP-01 | Employee ↔ Branch many-to-many; assignment history | P188 #8 | 🔒 |
| D-EMP-02 | Employee တိုင်း personal login; `users` ↔ `employees` = 1 : 1 (`employees.user_id` NOT NULL UNIQUE); အလုပ်ထွက်ရင် `users.status` / `employees.status` နဲ့ ထိန်း၊ record မဖျက် | P32, P366, R366, P367 | 🔒 |
| D-EMP-03 | Employee code format (setting), join date, documents, internal notes (audit ပါ) · *v5.2.15 (one-sheet 02/Oct):* documents = `employee.documents` (private, Admin ပဲ — F11); ဝန်ထမ်းကိုယ်တိုင်လည်း မမြင် | P188 | 🔒 |
| D-EMP-04 | Status: Invited → Active → Inactive / Resigned / Terminated; history မပျက် | P155, P188 | 🔒 |
| D-EMP-05 | Service eligibility ကို branch အလိုက် checkbox + effective date | P76, P188 #6 | 🔒 |
| D-EMP-06 | Employee search: name, phone, code, role, branch, status | P188 #10 | 🔒 |
| D-ROLE-01 | Role = position; admin က role ဖန်တီး | P79, P188 #1 | 🔒 |
| D-ROLE-02 | Permission = module → action အထိ · *v5.2.10 (owner 01/Oct 11:54 — ADR-010 Accepted):* **action တစ်ခုချင်း = code သီးသန့် (granular); Manager role ထဲ ဘာပါမလဲ = admin က role matrix မှာ compose** — code ထဲ "manager" fixed rule ✖; guard rail ၂ ချက်ပဲ fixed (no escalation · no last-admin lockout); Part 1 code ၁၃ (API Part 1 §10), part တိုင်း ထပ်ထည့် (D-ROLE-08); company admin (`role.manage` + `role.assign` company scope) = no-escalation ကင်းလွတ် + နောက်ဆုံး admin ကာကွယ် (P1-RULE-12 — independent review #4) · *v5.2.13 (owner 01/Oct 21:20):* **permission code = menu (module) တစ်ခုချင်း CRUD** — `<module>.view / create / update / delete` (menu မှာ ရှိတဲ့ action ပဲ) + **special action** သီးသန့် (approve · refund · finalize · close / reopen · verify · assign · field group `<module>.<field>_update`); **`manage` code ✖**; `delete` = archive / ပိတ် / cancel (D-DAT-05); `view` = menu + စီမံ screen — `view⁺` = view ဒါမှမဟုတ် အဲ့ module ရဲ့ တခြား code; POS / booking / calendar မှာ လိုတဲ့ list = ဝန်ထမ်း အကုန် (read scope) code မလို; **company admin = role ၅ code (`role.view` + `create` + `update` + `delete` + `assign`) company scope** (#25 = A — ယခင် `role.manage` + `role.assign` ကို အစားထိုး); Part 1 = code ၂၁ · Part 2 = code ၂၂ · **ADR-011 (ADR-010 Superseded)** · *v5.2.14 (owner 01/Oct ည — scope A, **ADR-012**):* ✔ ရောက်တဲ့အထိ = **data အဆင့်** — **company master** (service master / category / option, role, leave type, cancel reason, company setting တန်ဖိုး, company info, branch ဖွင့် / ပိတ်) = ပြင်ခွင့် company scope ပဲ, branch scope ✔ = ကြည့်ရုံ (403 `company_scope_required`) · **branch data** = ကိုယ့် branch (service ရောင်း / ကြာချိန် = item တစ်ခုချင်း) · **shared** (customer) = ✔ ရှိရင် ရ, history = ကိုယ့် branch · code `level` = company / branch / mixed / shared — ADR-011 #7 ("company code = company scope ကနေမှ") အစားထိုး | P287 · owner 01/Oct 11:54 · owner 01/Oct 21:20 (owner list "Permission matrix", #25, #26) · owner 01/Oct 22:16 → A | 🔒 |
| D-ROLE-03 | Access = permission AND branch scope; backend enforce | R292 | 🔒 |
| D-ROLE-04 | Role အများကြီး; grant-only union (deny မရှိ) | P295 | 🔒 |
| D-ROLE-05 | Role assignment တစ်ခုချင်းမှာ branch scope (ဥပမာ Ko Aung: Barber → A + B၊ Manager → B) | P298, P299 | 🔒 (R364 DB draft က role level မှာ ထားမိ — F-P1-02) |
| D-ROLE-06 | Role ပြင်ရင် ချက်ချင်းသက်ရောက်; role ပြောင်းရင် အဟောင်း access ဖြုတ် · *v5:* role assignment တစ်ခု ဖြုတ် / ပြောင်းရင် **အဲ့ assignment ပဲ** ချက်ချင်း သက်ရောက် — ကျန်တဲ့ role assignment တွေ မထိ (ဥပမာ Ko Aung ရဲ့ Manager (B) ဖြုတ် → Barber (A + B) ဆက်ကျန်) | P293, P300 · Claude 29/Sep ည (REC-13, C-7) | 🔒 |
| D-ROLE-07 | Admin = company-wide + branch; Manager = assigned branches (company-wide မရ); Barber = own work manage + branch operations view-only · *v5.2.14 (ADR-012):* Manager = company master ✖ (ကြည့်ရုံ) · ကိုယ့် branch data ✔ (service ရောင်း / ကြာချိန်, branch setting override …) · customer = shared (D-CUS-01 — `customer.update` ✔ ရှိရင် branch scope နဲ့လည်း customer row တစ်ခုတည်းကို ပြင်ရ; history = ကိုယ့် branch) · *v5.2.15 (one-sheet 02/Oct):* level အသစ် **private** (C1 / F11) — company scope မှ; branch scope = ဘာမှ မရ (ADR-012 Amendment 1 — code ၁၈) | P126, P288, P291 · ADR-012 | 🔒 |
| D-ROLE-08 | Permission list = developer ထိန်း (admin မဖန်တီး — role မှာ ✔ ပဲ)။ `permissions.json` (repo ထဲ — key, module, action, ဖော်ပြချက်) တစ်ခုတည်းက source; server start / deploy တိုင်း DB နဲ့ auto sync (အသစ် → create, ပြောင်း → update, ဖိုင်ကဖြုတ် → **archive**, hard delete ✖); code က ဖိုင်ထဲက key ကိုပဲ သုံး (typo = build error); screen label (MM / EN) = language file (key တူ); key ကို rename / ပြန်သုံး ✖; production server ပေါ် လက်နဲ့ မပြင်; sync ရလဒ်ကို audit မှာ မှတ် · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* sync ရလဒ်ရဲ့ audit action = **`permission.sync`** (S13 — API Part 1 v1.6 P1-RULE-10; run က တစ်ခုခု ပြောင်းမှ row ရေး) | owner 29/Sep ည (F-P1-10) · owner 02/Oct 13:08 (§0.11) | 🔒 |
| D-ROLE-09 | **Seed (default) role = Admin / Manager / Barber** — **Admin** = permission **အကုန် ✔**, company scope (company admin ပါ ဖြစ်); **Manager** = admin က role matrix မှာ လိုတာပဲ ✔ (API part တိုင်းရဲ့ code table "Seed" မှာ Manager ပါတဲ့ code = အစ; ~~`company` code = company-scope assignment ကနေမှ သက်ရောက်~~ → *v5.2.14:* data အဆင့် (ADR-012) — branch scope ✔ = company master ကြည့်ရုံ, branch data ✔, branch scope); **Barber** = Part 1–2 management code မပါ (ကိုယ့် data + operational list နဲ့ လုံလောက်; နောက် part တွေက barber code ထည့်) · admin က ပြင် / role အသစ် ဖန်တီး လို့ရ (D-ROLE-01) · go-live မတိုင်ခင် seed matrix ကို owner ပြ ★ · D-ROLE-07 နဲ့ ကိုက် · *v5.2.14:* Manager seed += `service.view` / `service.update` (ကိုယ့် branch ရောင်း + ကြာချိန်) · `settings.view` / `settings.update` (branch override) · Part 3 draft: **Barber seed = `booking.view` + `customer.view` + `customer.create`** (§0.7 #9) · *v5.2.15 (one-sheet 02/Oct):* Part 4–8 seed — **Manager:** Part 4 = visit / sale ကြည့် + ပြင်, `sale.finish_override`, `sale.override_price`, `sale.late_entry`, `payment.verify`, `discount.approve` (`sale.refund` / `sale.adjust` / discount code ဖန်တီး ✖) · Part 5 = attendance + QR ပဲ (pay code ✖ — C1) · Part 6 = stock ကြည့် / usage / adjust / count, purchase draft, transfer (`purchase.post` ✖) · Part 7 = closing ကြည့် + ပိတ် (reopen ✖), cash out + return, expense / income ကြည့် + ထည့် + ပြင် (approve / delete ✖), `pnl.view` · Part 8 = `website.*`, `audit.view`, report ⑦ ကလွဲ ၈ ခု · **Barber** += `sale.create`, `sale.late_entry`, `stock.usage` · **Admin** = အကုန် — code table တိုင်းရဲ့ Seed column = source; go-live မတိုင်ခင် seed matrix ကို owner ပြ ★ | owner 01/Oct 21:20 ("Default Roles သုံးမယ် — Admin / Manager / Barber" · "အကုန်လုံးကို check လုပ်ထားရင် Admin; မန်နေဂျာဆိုရင် သူ့အတွက် check လုပ်မယ့် ဟာပဲ") · ADR-011 · ADR-012 · §0.7 #9 | 🔒 |

### A.3 Authentication & Security
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-AUTH-01 | Password မရှိ; Google SSO ဒါမှမဟုတ် Email OTP; SMS OTP မရှိ · *v5.2.13 (owner 01/Oct 21:20):* email OTP = **Resend** (D-ARC-02); domain မရခင် (build / pilot) OTP email မရောက် → pilot = **Google login ပဲ**, dev = Mailpit | P151, P153 · D-ARC-02 · #29 | 🔒 |
| D-AUTH-02 | Login email = admin ထည့်ထားတဲ့ email နဲ့ တူရမယ် | P156 | 🔒 |
| D-AUTH-03 | Invite → first login မှာ auto-activate; resend/cancel invite · *v5:* invite email = login link ပဲ (secret token မလို — Google / OTP က email ပိုင်ကြောင်း သက်သေ); resend = email ပြန်ပို့; cancel = `users.status` 0 DISABLED (record မဖျက်); table အသစ် မလို — `users` column · *v5.2.13 (owner 01/Oct 21:20):* invite email = ဝန်ထမ်း ထည့်တာနဲ့ **ချက်ချင်း** ပို့ (API P1.EMP.02 `send_invite` default true); resend / cancel = `employee.access_update` | P155 · owner 29/Sep ည (Part 1b) · §0.6 #6 | 🔒 |
| D-AUTH-04 | OTP **8 digits** *(v5 — မူလ 6)*, 5 မိနစ်, တစ်ခါသုံး; ၅ ကြိမ်မှား → ၂၀ မိနစ် lock · *v5:* OTP ကို hash နဲ့ပဲ သိမ်း; "၅ ကြိမ်" = OTP ဘယ်နှခု တောင်းတောင်း **ဆက်တိုက်** မှား (မှန်ရင် reset); OTP ပြန်တောင်းရင် **၆၀ စက္ကန့်** စောင့် (email spam ကာ); နောက်ဆုံးတောင်းတဲ့ OTP တစ်ခုပဲ သုံးလို့ရ; system ထဲ မရှိ / DISABLED email ဆို OTP မပို့ — screen စာကတော့ အတူတူ (email ရှိ/မရှိ မသိအောင်) *(နောက်ဆုံး ၂ ချက် = Part 1b design မှာပါ၊ D-DB-05 နဲ့ lock)* · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* code စစ်တာမှာ **IP တစ်ခု ၁ နာရီ ၁၀ ခါ** အထိ (၁၁ ခါမြောက် = 429, audit / counter မထိ) (S9 — API-LIM-02 v1.6) · lock အဖြေ = စာသားအတိုင်း (ရှိတဲ့ email = `login_locked`, မရှိတဲ့ email = `otp_invalid`) — V1 အတွက် လက်ခံ (S10) · field code `email_invalid` / `otp_format` (S5) | R152, P214 · owner 29/Sep ည · owner 02/Oct 13:08 (§0.11) | 🔒 |
| D-AUTH-05 | Multiple devices; My Devices revoke; admin revoke all; new device notification · *v5:* "new device" = login အသစ် တစ်ခါဝင်တိုင်း အဲ့ user ကို in-app noti (device label + အချိန်) | P158, P159 · owner 29/Sep ည | 🔒 |
| D-AUTH-06 | Stay signed in (idle timeout မရှိ) · *v5:* server-side session — token ကို HttpOnly cookie ထဲ၊ server မှာ hash; request တိုင်း session + users.status + employees.status စစ် → revoke / အလုပ်ထွက် = ချက်ချင်း ထွက် (REC-05 🔒) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **browser တစ်ခု = session တစ်ခု** — session ရှိနေတဲ့ browser မှာ ထပ် login အောင်မြင်ရင် အရင် session ကို `revoke_reason = 1 LOGOUT` နဲ့ ပိတ် (S14 — API Part 1 v1.6 P1-RULE-15) · ပထမဆုံး company admin = server ပေါ်က operator command (S6 — P1-RULE-14) | P213 · owner 29/Sep ည · owner 02/Oct 13:08 (§0.11) | 🔒 · (REC-04 ✖ — D-AUTH-07) |
| D-AUTH-07 | ကိုယ်ပိုင်ဖုန်း + ကိုယ်ပိုင် account (app install) — transaction ရိုက်ဖို့ shared counter device မသုံး; `performed_by` default = login ဝင်ထားသူ (တခြားသူအတွက် မှတ်ရင် Actual Service Barber ရွေး — D-VIS-04, D-VIS-12); branch device PIN switch (REC-04) ✖; ဆိုင်ဖုန်းပေါ် login / shared account ✖ | P372, R373 (P374 လက်ခံ) → Claude 29/Sep (RISK-02) | 🔒 (§3.12) |
| D-AUTH-08 | Google login: ပထမ Google login မှာ Google email = admin ထည့်ထားတဲ့ email ဖြစ်မှ၊ Google account ID (`sub`) ကို မှတ်; နောက်ပိုင်း ID နဲ့ စစ် | owner 29/Sep ည (Part 1b, D-AUTH-01/02) | 🔒 |

### A.4 Services & Pricing
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-SVC-01 | Category; MM/EN name + description; company-level master service | P10, P11 | 🔒 |
| D-SVC-02 | Branch အလိုက် availability / price / duration | P12 | 🔒 |
| D-SVC-03 | Branch default price + optional barber override | P334 | 🔒 |
| D-SVC-04 | Booking price/duration snapshot; barber ဈေးမပြင်ရ; authorized adjustment + reason + audit · *v5.2.15 (one-sheet 02/Oct):* booking barber ≠ တကယ်လုပ်သူ → booking ဈေး နဲ့ လုပ်သူဈေး ၂ ခုထဲ **နည်းတာ** (B4) | P264, R354 | 🔒 (pricing options → D-SVC-05) |
| D-SVC-05 | Service မှာ pricing options (ဥပမာ Color × Length) — admin က option group / value ကို ကြိုက်သလောက် သတ်မှတ် (screen ပေါ်မှာ group ၂ ခုအထိ — D-DB-06) (ဥပမာ အရှည် ၁–၃" / ၄–၆" / ၇–၁၂" / ၁၂" အထက်)။ *v5 (OPEN-04 ✅):* **combination တစ်ခုချင်း ဈေးဇယား** — ကွက်တိုင်း = **ဈေး + ကြာချိန်** (ကြာချိန် မဖြည့်ရင် service ရဲ့ ပုံမှန်); **branch အလိုက်** ဇယား (D-SVC-02 လို); ကွက်လပ် = အဲ့ branch မှာ မရောင်း; ဈေး table တစ်ခုတည်းကို service ရိုးရိုး / option service နှစ်မျိုးလုံး သုံး — row မှာ barber column (NULL = branch ဈေး၊ ဖြည့် = barber override — D-SVC-03) → V1 မှာ option service barber override screen မဆောက်၊ နောက်မှ screen ထည့်ရုံ (DB မပြင်); checkout မှာ barber က option ရွေး → system တွက် (barber ဈေးမရိုက် — D-SVC-04); generic (Hair Dye, Perm, Highlight, Treatment…) · ⚠️ UI: branch ဇယား copy button · *v5.1 (OPEN-29):* Booking (website + staff) မှာ **customer / staff က option (အရောင် / အရှည်) ကိုယ်တိုင်ရွေး** → ဇယားကွက်ရဲ့ ဈေး + ကြာချိန် အတိအကျ ပြ; ဒီ branch (+ ဆိုင် / အိမ်) မှာ မရောင်းတဲ့ ကွက် မပြ; "အရှည် မသေချာရင် နီးစပ်တာ ရွေး — ဆိုင်ရောက်မှ barber အတည်ပြု" စာပြ; မှားရွေးထားရင် checkout မှာ barber က option ပြောင်း → system ဈေးပြန်တွက် (ဈေးအတည် = checkout); OPTIONS service ဆို booking item မှာ ကွက် မဖြစ်မနေ · *v5.2.13 (owner 01/Oct 21:20):* API က option group **≤ 2** ကန့်သတ် (DB မကန့် — လွှတ်ချင်ရင် check ၁ ခု ဖြုတ်ရုံ) — API P2.OPT.02 | P378, P379, R379 · owner 30/Sep မနက် (OPEN-29) · owner 30/Sep (OPEN-04) · §0.6 #20 · D-API-03 | 🔒 |
| D-SVC-06 | **Home service** *(30/Sep ပြင်ဆင်)* — (1) **အိမ်ဈေး**: service တစ်ခုချင်း (+ option ဇယား) အတွက် admin က branch အလိုက် "အိမ်ဈေး" သီးသန့် (ပုံမှန် ဆိုင်ဈေးထက် ပို — system က မစစ်); မဖြည့်ရင် ဆိုင်ဈေး; ညှပ်ခ ဖြစ်လို့ commission ပုံမှန် — ဈေး table မှာ location column (1 BRANCH / 2 HOME — D-DB-03) · (2) **ကားခ** (customer ဆီက): admin က branch အလိုက် default ပမာဏ (ဥပမာ အသွားအပြန် 6,000; 0 = ဆိုင်ခံ); visit တစ်ခုအတွက် လျှော့ = ခွင့်ရှိသူ + reason (D-SVC-04), barber မပြင်ရ; sale မှာ line သီးသန့် · (3) ကားခ ဝင်ငွေ = **ဆိုင်ဝင်ငွေ၊ commission မတွက်** (D-COM-02 ကနေ ချန်); barber တကယ်ကုန်တဲ့ ကားခ = Cash Out reason "Home service ကားခ" (expense — D-FIN-07/08) · ဝင်ငွေ = barber ရဲ့ branch; barber က customer အိမ်မှာ ကိုယ့်ဖုန်းနဲ့ START → COMPLETE → payment (D-VIS-11); home service လုပ်ခွင့် = eligibility (D-EMP-05) | owner 30/Sep (OPEN-17, REC-26) | 🔒 |
| D-SVC-07 | **ရှင်းလင်းချိန် (buffer)** — service တစ်ခုချင်း admin setting, default ၀ မိနစ်; booking က barber ကို service ကြာချိန် + buffer ပိတ် (option ဇယား service ဆို ကွက်ရဲ့ ကြာချိန် + buffer) · *v5.2.13 (owner 01/Oct 21:20):* booking ထဲ service ၂ ခု+ ဆို buffer **ပေါင်း** (ညှပ် 5 + ဆိုး 10 = 15 မိနစ်) — API P2-RULE-10 | owner 30/Sep (REC-23) · §0.6 #16 · D-API-03 | 🔒 |
| D-SVC-08 | **ဈေးကို ကြိုသတ်မှတ်လို့ရ (effective date)** — ဈေး row တိုင်းမှာ စသက်ရောက်ရက် / ပြီးရက် (MMT); admin က "1/Nov ကစ ဈေးအသစ်" ကြိုထည့်ရင် လက်ရှိဈေးကို ရှေ့ရက်မှာ auto ပိတ်; ဈေးဟောင်း row မဖျက် (= ဈေး history, အရှုံးအမြတ် ကြည့်ဖို့); ရက်ထပ် ✖ (DB); ဈေးရှာ = ဝန်ဆောင်မှုပေးမယ့်ရက် (booking = ချိန်းရက်၊ walk-in = ဒီနေ့) မှာ သက်ရောက်နေတဲ့ဈေး → snapshot (D-SVC-04) · reschedule ရင် ဈေး = D-BKG-12 (v5.1 — အချိန်ပဲရွှေ့ရင် မူလဈေး) | owner 30/Sep | 🔒 |

### A.5 Customers
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-CUS-01 | Company-level customer; Name + Phone; notes (optional, staff အားလုံးမြင်) | P186, P229 | 🔒 |
| D-CUS-02 | Phone = unique identity; format normalize; secondary phone မရှိ; merge feature မလို | P186 #2–3 | 🔒 |
| D-CUS-03 | Booking မှာ နောက်ကွယ်က auto match / auto create | P163 | 🔒 |
| D-CUS-04 | V1 မှာ customer account/dashboard မရှိ | P128, P186 #11 | 🔒 (C-4 ဖြေရှင်း) |
| D-CUS-05 | Customer ဆီ ဘာမှမပို့ | P186 #12 | 🔒 (C-3 ဖြေရှင်း) |
| D-CUS-06 | Search: name, phone | P186 #4 | 🔒 |
| D-CUS-07 | Active/Inactive; soft delete; timeline history; statistics · *v5.2.14 (§0.7 #7):* **Inactive** = list / search default မပြ (filter နဲ့ ပြ); ဖုန်းနဲ့ booking / walk-in ပြန်လာရင် auto Active; website booking မပိတ် · archive ပြီးသား ဖုန်း = ပြန်ဖွင့် (F-BK-21) · history / statistic = ကြည့်သူရဲ့ branch ပဲ (ADR-012) | P186 · §0.7 #7 | 🔒 |
| D-CUS-08 | Preferred barber = history ကနေတွက်; threshold admin setting · *v5.2.14 (§0.7 #6 — OPEN-12 ✅):* preferred = နောက်ဆုံး FINISHED visit **၅ ခုထဲ ၃ ခု+** လုပ်ပေးတဲ့ barber; မရှိရင် "–" (setting `customer.preferred_barber_window` 5 / `customer.preferred_barber_min_visits` 3) | P135, P186 #6, P320 · §0.7 #6 | 🔒 |
| D-CUS-09 | No-show = history ပဲ၊ ကန့်သတ်ချက်မရှိ | P280 | 🔒 |

### A.6 Booking
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-BKG-01 | `/book` (branch ရွေး) နဲ့ `/book?branch=<code>`; branch တစ်ခုချင်း QR · *v5.2.7 (D-UX-05):* URL / QR ဆက်အလုပ်ဖြစ် — UI = **booking modal** (page ပေါ် pop-up; `/book?branch=` link က page + modal ဖွင့်ထားတဲ့ပုံ render); `&barber=<id>` = barber card direct booking | P175, P176, P179 · owner 01/Oct (modal) | 🔒 |
| D-BKG-02 | Service / Barber / Date ကို ကြိုက်တဲ့အစဉ်နဲ့ ရွေး၊ dynamic filter | P178 | 🔒 |
| D-BKG-03 | Service အများကြီး ("+ Add Service"), barber တစ်ယောက်, ဆက်တိုက် · *v5.2.14 (§0.7 #8):* website booking = service **≤ ၅** (setting `booking.public_max_services`); staff = ကန့်သတ် ✖ | P89, P182 #1 · §0.7 #8 | 🔒 |
| D-BKG-04 | Availability = branch + service + eligibility + schedule + leave + existing bookings + total duration · *v5.2.13 (owner 01/Oct 21:20):* availability function တစ်ခုတည်း (API P2-RULE-10): ပိတ်ရက် = **staff booking ပါ** ✖ · လုပ်နေဆဲ walk-in = **ခန့်မှန်း ပြီးချိန်** (service ကြာချိန် + buffer) အထိ barber ပိတ် · ရက်ရဲ့ နောက်ဆုံး slot = buffer (+ အိမ်သွား / ပြန်ချိန်) ပါ **shift ထဲ ဝင်မှ** ပြ (19:35 မှာ 30 + 10 ✖, 20:00 ပိတ်) | R86, P87 · §0.6 #17, #21, #22 · D-API-03 | 🔒 |
| D-BKG-05 | Any Barber = available ဖြစ်တဲ့ eligible barber အားလုံးပြ → customer ရွေး | P336 | 🔒 |
| D-BKG-06 | Advance window 14 ရက် (admin ပြောင်းနိုင်) · *v5.2.10 (owner 01/Oct 11:54):* **staff booking ကိုပါ ကန့်သတ်** — setting `booking.advance_window_days` တစ်ခုတည်း; public / staff နှစ်ဖက် 422 `outside_window` (API Part 0 §12 #2) | P182 #3, P208 · owner 01/Oct 11:54 | 🔒 |
| D-BKG-07 | Available time အားလုံးပြ · *v5:* start time interval = admin setting (5 / 10 / 15 / 30 မိနစ်), **default ၁၅** (Fresha live အတိုင်း) | P182 #4 · owner 30/Sep (REC-22) | 🔒 |
| D-BKG-08 | Double booking ကို DB level မှာ ကာ; first success wins | P182 #5 | 🔒 (EXCLUDE constraint — §6.4) |
| D-BKG-09 | Customer တစ်ယောက် active booking ၁ ခု · *v5.1 (OPEN-14):* ဒီ rule = **website ကနေ customer ကိုယ်တိုင် booking မှာပဲ** — customer (ဖုန်း — D-CUS-02) မှာ active booking (BOOKED / STARTED) တစ်ခုခု ရှိရင် (website / staff ဘယ်ကလာလာ) website က ပိတ်; **staff (login) ထည့်ရင် ကန့်သတ်ချက် မရှိ** (မိသားစု ဖုန်းတစ်လုံး၊ နောက်အပတ်အတွက် ကြိုချိန်း); DB index မသုံး — app က customer row lock ပြီး စစ် (တပြိုင်နက် ၂ ခု မလွတ်); booking မှာ ဘယ်လမ်းကလာလဲ (website / staff) + ထည့်သူ (staff) မှတ် · ⚠️ website ပိတ်ချိန် message မှာ ရှိပြီးသား booking အသေးစိတ် (အချိန်၊ barber) မပြ — ဖုန်းနံပါတ် သိရုံနဲ့ သူများ booking မသိရအောင်; "booking ရှိပြီးသား — manage link နဲ့ ပြင်ပါ / ဆိုင်ကို ဖုန်းဆက်ပါ" ပဲ | P182 #7 · owner 30/Sep မနက် (OPEN-14) | 🔒 · ⚠️ message ပုံစံ = Claude အကြံ |
| D-BKG-10 | Name + Phone ပဲ; OTP/account မလို | P161 | 🔒 |
| D-BKG-11 | On-screen confirmation + Manage Booking link (token); link ပျောက်ရင် ပြန်မရ · *v5.2.13 (owner 01/Oct 21:20):* retry (net ပြတ်) မှာ link မပျောက်အောင် **browser / app က manage token ထုတ်ပို့, server က hash ပဲ သိမ်း** — ထပ်ပို့ရင် booking + link အတူတူ ပြန်ရ (ADR-004, API-IDEM-03; DB မပြင်) · *v5.2.14 (§0.7 #5 — REC-36 ✅):* "Calendar ထဲ ထည့်" `.ics` = **browser ထဲမှာ ထုတ်** (server ✖ — D-CUS-05), manage link ပါ | P166, P168 · §0.6 #1 · D-API-01 · §0.7 #5 | 🔒 (.ics ✅ — REC-36) |
| D-BKG-12 | Customer reschedule (full edit) / cancel — cutoff setting တစ်ခုတည်း; barber/admin cutoff မသက်ရောက် · *v5.1 (OPEN-23) reschedule ဈေး:* ရက် / အချိန်ပဲ ပြောင်းရင် မူလ ဈေး + ကြာချိန် snapshot ဆက်ထား; service / option ပြောင်း (ထပ်ထည့်) ရင် အဲ့ item ကိုပဲ ရက်အသစ်ရဲ့ ဈေး; barber ပြောင်း ဒါမှမဟုတ် ဆိုင် ↔ အိမ် ပြောင်းရင် item အကုန် ရက်အသစ်ရဲ့ ဈေး (barber override — D-SVC-03၊ အိမ်ဈေး / ကားခ — D-SVC-06 ကြောင့်); ဈေးပြောင်းသွားရင် confirm မနှိပ်ခင် screen မှာ ဈေးအသစ် ပြ; ထူးခြား case = checkout မှာ ခွင့်ရှိသူ reason နဲ့ ပြင် (D-SVC-04) · *v5.2.14 (§0.7 #1, #10):* customer cutoff = **120 မိနစ်** (ချိန်းချိန် ၂ နာရီ အလို — setting `booking.customer_change_cutoff_minutes`) · booking ထဲ customer **နာမည် = ပြင်ရ (ဒီ booking ပဲ)**, **ဖုန်း = မပြင်** (မှားရင် cancel "Other" + booking အသစ်) · branch ပြောင်း = cancel + အသစ် | P170, P171, P182 #6 · owner 30/Sep မနက် (OPEN-23) · §0.7 #1, #10 | 🔒 |
| D-BKG-13 | Customer/Barber/Admin သုံးယောက်လုံး reschedule/cancel ရ; availability ပြန်စစ် · *v5.2.14 (§0.7 #9):* barber = **ကိုယ့်နာမည် booking** ကို code မလိုဘဲ ဖန်တီး / ရွှေ့ / cancel / snooze (barber ပြောင်းရင် `booking.update`); customer = link နဲ့ cutoff မတိုင်ခင် | P93 · §0.7 #9 | 🔒 |
| D-BKG-14 | Cancel reason မဖြစ်မနေ (preset + Other text) | P95 | 🔒 |
| D-BKG-15 | Reschedule/cancel → booked barber ကို notification + audit | P164 | 🔒 |
| D-BKG-16 | Cancel ပြီး reactivate မရ; link ဆက်ရှိ | P173 | 🔒 |
| D-BKG-17 | No-show: booking time မှာ alarm, 10 မိနစ် snooze ×4, 40 မိနစ်မှာ auto-cancel (reason = no-show); နောက်ကျရောက်ရင် walk-in · *v5.2.14 (§0.7 #2, #3, #4):* alarm = **booked barber + အဲ့ branch စီမံသူ** (`booking.update` — branch scope နဲ့ ရှိသူ / branch ထဲ assign ထားတဲ့ company-scope သူ); snooze = သူတို့ထဲက ဘယ်သူမဆို · **၄၀ မိနစ် မပြည့်ခင် staff က "Customer မလာ" (no-show reason) နဲ့ cancel ရ** — no-show history ထဲ ဝင် (D-CUS-09) · confirmation page မှာ "၄၀ မိနစ် ကျော်ရင် auto ပျက်, walk-in အဖြစ် လက်ခံ" ပြော (FE-CONF-03) | P97, P209 · §0.7 #2–#4 | 🔒 (server-side timer) |
| D-BKG-18 | Status: Booked → Started → Completed; Cancelled final | P99 | 🔒 |
| D-BKG-19 | Config ပြောင်းလို့ booking ကို silently မဖျက်; conflict ပြ | R354 | 🔒 |
| D-BKG-20 | Waitlist: booking မဟုတ်၊ slot မ reserve, multiple entries, slot လွတ်ရင် notify, customer confirm, expire · *v5.1:* **⏭ V1 မပါ** (online booking 0% — သုံးမယ့်သူ မရှိသေး; customer ကို system က အကြောင်းမကြားနိုင် — D-CUS-05; အချိန်ကြောင့် မဟုတ်) · နောက်မှ ထည့်ရလွယ်အောင် V1 မှာ: (1) Part 3 DB မှာ waitlist table / column ကြိုမထည့် — နောက်မှ table အသစ်ပဲ၊ `bookings` မပြင် (2) availability တွက်တာ code တစ်နေရာတည်း (3) booking cancel / reschedule / no-show cancel = code လမ်းကြောင်း တစ်ခုတည်း ("နေရာလွတ်ပြီ" ကို အဲ့မှာ သိ) (4) number code append-only (D-DB-03) (5) permission / noti / language key နောက်မှ | R354 · owner 30/Sep မနက် (OPEN-27) | 🔒 rule · ⏭ V1 မပါ · 🔒 ပြင်ဆင်ချက် (§6.4b A) · ပုံကြမ်း + ဆောက်ချိန် 🟡 (notify ↔ D-CUS-05 conflict ပါ) = §6.4b |
| D-BKG-21 | Public booking: captcha (Turnstile / reCAPTCHA v3 — code ရေးချိန်ရွေး) + ချောင်တဲ့ IP rate limit (ဥပမာ ၁၀ / နာရီ၊ ပြင်လို့ရ); D-BKG-10 မပြောင်း; booking အတုကို Manager / Admin cancel · *v5.2.13 (owner 01/Oct 21:20):* captcha = **Cloudflare Turnstile** · rate limit = **IP ၁ ခု ၁ နာရီ ၁၀ ကြိမ်** (setting `booking.public_rate_limit_per_hour`) + **ဖုန်း ၁ လုံး ၁ နာရီ ၃ ကြိမ်** (API-LIM-01) | Claude 29/Sep (RISK-16, REC-28) · §0.6 #2, #3 · D-API-01 | 🔒 (§3.12) |
| D-BKG-22 | **Booking location: ဆိုင်မှာ / အိမ်မှာ** — public booking (website) မှာလည်း home service ရ; "အိမ်မှာ" ဆို လိပ်စာ မဖြစ်မနေ + မှတ်သားစရာ နေရာ optional; home service eligible barber ပဲ ပြ; အိမ်ဈေး + ကားခ (D-SVC-06) auto | owner 30/Sep (OPEN-17) | 🔒 |
| D-BKG-23 | **Online booking minimum lead time = မရှိ** *(v5.2.8)* — customer က အခု 10:00 ဆို နောက် slot boundary (interval setting — default 15 မိနစ် → 10:15; 5 မိနစ် ဆို 10:05) အားရင် တန်း booking လုပ်လို့ရ; "အနာဂတ် slot" ပဲ ကန့်သတ်; booked barber ဆီ realtime (D-NTF-01, AD-TODAY-04); no-show alarm = booking အချိန်ကနေ (D-BKG-17); staff booking လည်း ကန့်သတ် မရှိ (14 ရက် window — D-BKG-06 — ကိစ္စ API design) | owner 01/Oct 10:47 (frontend §14 API question — "50 — တင်လို့ရပါတယ်") | 🔒 |

### A.7 Service Visit, Walk-in, Checkout
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-VIS-01 | ရောက်လာရင် "Booking ရှိလား?" → Booking flow / Walk-in | P104 | 🔒 |
| D-VIS-02 | Walk-in: အစမှာ customer info မမေး; START → service → COMPLETE → payment → FINISH → customer record (optional, skip ရ) · *v5.1 (OPEN-16):* FINISH screen မှာ ဖုန်း field ကြိုဖွင့်ထား (optional၊ "ကျော်" ရ); ရိုက်တာနဲ့ ရှိပြီးသား customer (D-CUS-03) auto — နာမည် ထပ်မမေး; admin report မှာ barber အလိုက် ဖုန်းရယူနှုန်း (%); visit မှာ customer = optional (NULL ရ) · *v5.1 (REC-12):* START = barber + branch ပဲ လို (service optional); service ကို **COMPLETE မှာ မဖြစ်မနေ**; ပထမဆုံး ရွေးတာ reason မလို; booking visit = booking service တွေ ကြိုဖြည့် — ပြောင်း / ထည့် / ဖြုတ် = reason (D-VIS-05 မပြောင်း); walk-in dashboard = service ရွေးထားမှ ပြ · *v5.2.15 (one-sheet 02/Oct):* FINISH customer = ဖုန်းနဲ့ ရှာ / ဖန်တီး (P3-RULE-01) · FINISH ပြီးမှ customer တွဲ / ပြင် = reason နဲ့ ရ (B10) · START တိုင်း စာရင်းပိတ်ပြီးနေ့ ✖ (B9) | P19, P104 · owner 30/Sep မနက် (OPEN-16, REC-12) | 🔒 |
| D-VIS-03 | Booked barber / Actual service barber / Started by / Completed by ခွဲမှတ် | P266–P268 | 🔒 (+ collected_by §3.3) |
| D-VIS-04 | တခြား barber က START/COMPLETE လုပ်ပေးနိုင်; actual barber ≠ booked ဆို reason · *v5.2.15 (one-sheet 02/Oct):* ကူမှတ်ပေးသူ (reason 2) = line + COMPLETE ပဲ · ဖုန်းမပါ (reason 1) မှတ်ပေးသူ = payment + FINISH ပါ · INCOMPLETE = performer / reason-1 မှတ်သူ / `visit.delete` | P266, P267 | 🔒 |
| D-VIS-05 | Visit အတွင်း service add/remove ရ + reason | P262 | 🔒 |
| D-VIS-06 | Checkout ကို ပုံမှန် actual service barber ကိုယ်တိုင်; admin override + reason · *v4:* `performed_by` ≠ `collected_by`; default `collected_by` = `performed_by`; payment screen dropdown မှာ authorized staff ပြောင်းရွေး; commission / KPI = `performed_by` · *v5.1 (OPEN-28) ချွင်းချက် ထပ်ဖြည့်:* A ဖုန်းမပါ case (D-VIS-12) မှာ **B က B ရဲ့ဖုန်းကနေ payment + FINISH ပါ လုပ်ခွင့်** — B ကိုယ်တိုင် "A ဖုန်းမပါ" အဖြစ် မှတ်ပေးထားတဲ့ visit မှာပဲ (A ရဲ့ တခြား visit ✖); Actual barber / `performed_by` = A (commission / KPI = A); recorded by + `collected_by` = B (closing တာဝန် = B); reason = "ဖုန်းမပါ / ပျက်" (START မှာ ရွေးတာ auto ပါ); admin report မှာ barber အလိုက် ဒီလို payment အရေအတွက် · *v5.2.15 (one-sheet 02/Oct):* ကိုယ်စား FINISH / ငွေလက်ခံ = `sale.finish_override` (seed Admin + Manager, reason — B2) · "ငွေလက်ခံသူ" = ဒီ branch active ဝန်ထမ်း မည်သူမဆို, clock-in ထားသူ အပေါ် (B3) — code မလို | P269 · P371, P375 (RISK-03, REC-07) · owner 30/Sep မနက် (OPEN-28) | 🔒 |
| D-VIS-07 | Payment မပြီးရင် FINISH မဖြစ်; နောက် customer ကို မကျော် · *v5.2.15 (one-sheet 02/Oct):* visit အများကြီး In service တပြိုင်နက် ရ — **COMPLETE ပြီး ငွေမရှင်းရသေးတဲ့ visit ပဲ** နောက် START ကို ပိတ် (B1); late-entry visit = မပိတ် / အပိတ်မခံ (C-1 ရှင်းပြီး) | P273, P275 | 🔒 (C-1 ရှင်းရန်) |
| D-VIS-08 | FINISH ပြီး အကုန် immutable; adjustment/refund + reason + audit · *v5.2.15 (one-sheet 02/Oct):* ချွင်းချက် ၂ ခု — customer နဲ့ KBZPay reference = reason နဲ့ တိုက်ရိုက်ပြင် (B10) · DB guard trigger ၄ ခု (Part 4 constraints v1.2 — G f) · ဈေးနည်းယူမိ = **ကွာငွေ sale** (customer ပေးချိန်မှ ဖန်တီး, မူလ barber, စာရင်းမပိတ်ခင် FINISH / cancel) · FINISHED sale ကို တိုက်ရိုက်ရေး = 409 `invalid_transition` | P278, P350 | 🔒 |
| D-VIS-09 | Service မပြီးဆုံး → Incomplete + reason; revenue/commission မရှိ · *v5.2.15 (one-sheet 02/Oct):* INCOMPLETE မတိုင်ခင် payment အကုန် void ရ | P284 | 🔒 |
| D-VIS-10 | Double submit ကာ (idempotent); server state = source of truth | R355 | 🔒 |
| D-VIS-11 | ပုံမှန် flow: service barber ကိုယ်တိုင် **ကိုယ့်ဖုန်း** ကနေ customer တစ်ယောက်ချင်း real-time — Customer → Service → Complete → Payment (Cash / KBZPay) → FINISH; "< 10 စက္ကန့်" = prototype target ပဲ | P370, P371 (RISK-01) | 🔒 |
| D-VIS-12 | ဖုန်းမပါ / ပျက် / battery ကုန် → တခြား barber က **ကိုယ့်ဖုန်း** ကနေ START / COMPLETE မှတ်ပေး: Actual Service Barber = A (ရွေး), Recorded by = B (auto), commission = A · *v5.1:* payment + FINISH ပါ B လုပ်ရ (D-VIS-06 ချွင်းချက် — OPEN-28) · *v5.2.15 (one-sheet 02/Oct):* reason 2 (ကူမှတ်) = line + COMPLETE ပဲ; reason 1 (ဖုန်းမပါ) = payment + FINISH ပါ (API Part 4 P4-RULE-03) | Claude 29/Sep (RISK-02 — P373 ကို ပြင်) · owner 30/Sep မနက် (OPEN-28) | 🔒 |
| D-VIS-13 | V1 offline ✖ — internet ပြတ်ရင် စက္ကူ → ပြန်ရရင် သွင်း; `performed_at` ≠ `recorded_at` + လုပ်သူ / သွင်းသူ ခွဲမှတ်; V2 = true offline mode · *v5.1 (OPEN-01):* **Late entry (နောက်မှ သွင်း):** outage ရော မေ့သွားတာပါ barber ကိုယ်တိုင် (colleague အတွက်လည်း — D-VIS-04) သွင်းရ; reason မဖြစ်မနေ — preset internet ပြတ် / မီးပြတ် / ဖုန်းပျက် / မေ့သွား + Other; **အဲ့ branch ရဲ့ အဲ့ business date စာရင်း မပိတ်ခင်အထိပဲ** — ပိတ်ပြီးရင် admin reopen (D-FIN-06); report မှာ "နောက်မှ သွင်း" flag + admin က barber အလိုက် လစဉ် အရေအတွက် မြင်; ခွင့် = permission (barber role default ပေး၊ admin က တစ်ယောက်ချင်း ပိတ်ရ) · *v5.2.15 (one-sheet 02/Oct):* မပိတ်ရသေးတဲ့ ရက်မဆို (B11 — Part 2 quote ညှိပြီး) · တစ်ယောက်ချင်း ပိတ် = `sale.late_entry` မပါတဲ့ Barber role (B12) · ငွေ = service ရက်မှာ ဝင် (late entry မှာ အချိန် ၄ ခု မဖြစ်မနေ ရိုက်) · **finalize ပြီး payroll period ထဲ late entry / service sale FINISH = 423 `payroll_finalized`** (manual payroll line — B9) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* pilot မတိုင်ခင် `add-late-entry` ဆောက် (S16); late entry မရှိသေးခင်အတွက် ကြားဖြတ် rule မထား — offline help က "စာရွက်မှာ ရေး၊ Late entry နဲ့ ထည့်" ပဲ ပြော | P376, R376 (RISK-04, OPEN-08) · owner 30/Sep မနက် (OPEN-01, REC-02) · owner 02/Oct 13:08 (§0.11) | 🔒 |

### A.8 Payments, Discounts, Receipts
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-PAY-01 | Cash + KBZPay (နောက်ထပ်ထည့်နိုင်တဲ့ structure) | P21 | 🔒 |
| D-PAY-02 | KBZPay reference မဖြစ်မနေ + unique; daily closing မှာ reconcile · *v5.1 (REC-11):* KBZPay payment တစ်ခုချင်း verify — FINISH နဲ့ မဆိုင် (barber မစောင့်); စာရင်းပိတ် screen မှာ ဒီနေ့ KBZPay list (reference / ပမာဏ / `collected_by`) → ပိတ်သူက KBZPay app history နဲ့ တိုက်ပြီး တစ်ခုချင်း ✔ (verified at / by); ✔ မရသေးတာ ကျန်ရင် reason မပါဘဲ စာရင်းမပိတ်ရ · *v5.1 (OPEN-24):* reference ပုံစံ (ဂဏန်းအရေအတွက် / ပုံစံ) စစ်တာ = Additional Settings (D-PLT-07); DB = စာသား + method အလိုက် unique · *v5.2.15 (one-sheet 02/Oct):* စာရင်းပိတ်ပြီးလည်း ✔ ရ (E3); ✔ ဖြုတ် = နေ့ဖွင့်ထားတုန်းပဲ · reference ပြင် = `payment.verify` + reason (B10 — ✔ ပြန်ဖြုတ်) · ပုံစံ = `payment_methods.reference_regex` (setting `sales.kbzpay_reference_regex` ဖြုတ်) · reference unique = effective method ပေါ် | P330 · owner 30/Sep မနက် (REC-11, OPEN-24) | 🔒 |
| D-PAY-03 | Service + product checkout တစ်ခုထဲ; product-only sale ရ | P41 | 🔒 |
| D-PAY-04 | Discount = admin ထုတ်တဲ့ code ပဲ; checkout မှာ validate · *v5.1 (OPEN-09, REC-09):* **Discount code ပုံစံ (V1):** admin ဖန်တီး — code စာသား · % / ကျပ်ပမာဏ · သက်တမ်း (optional) · branch (အကုန် / ရွေး) · စုစုပေါင်း သုံးခွင့် (∞ / N) · customer တစ်ယောက် ၁ ကြိမ် (optional — ဒီ code သုံးရင် FINISH မှာ ဖုန်း မဖြစ်မနေ) · **public / internal** (public = social media promo၊ customer ပြောမှ၊ barber list မှာ မပြ; internal = barber က checkout list ကနေ ရွေး) · ဖွင့် / ပိတ်; **ထူးခြား case = app ထဲ တောင်းဆို / ခွင့်ပြု (ဖုန်း ✖)** — barber က checkout မှာ ပမာဏ + reason → permission `discount.approve` ရှိသူ (role အလိုက် ပိုင်ရှင် ရွေး — admin / manager) ဆီ in-app noti → ✔ → barber screen မှာ discount အလိုလို ဝင် (system က တစ်ခါသုံး code နောက်ကွယ်မှာ ထုတ်); အဖြေမရရင် ဈေးအပြည့်နဲ့ FINISH → admin adjustment နောက်မှ; sale တစ်ခု code ၁ ခု · sale တစ်ခုလုံးကို လျှော့ · ကားခ line မလျှော့ · လျှော့ငွေကို ~~service line တွေဆီ~~ *v5.2.7 (OPEN-36 ✅ owner 01/Oct):* **service line + product line နှစ်မျိုးလုံးဆီ** ဈေးအချိုးနဲ့ ခွဲ (ကားခ ✖; DB `sale_items.line_discount_amount`); commission base = net **service** line ပဲ (D-COM-02 — product ✖) · report = code / barber / ကြိမ် / ပမာဏ · service ကန့်သတ် code ⏭ · website booking မှာ code ⏭ (checkout မှာပဲ) · ဘယ် code ကြိုဖန်တီးမလဲ = go-live data (ပိုင်ရှင်) · *v5.2.15 (one-sheet 02/Oct):* code ဖန်တီး = Admin ပဲ · ကိုယ့် request ကိုယ် approve ✖ · branch ရဲ့ approve ခွင့်ရှိသူ အကုန် noti · approve ချိန် ရှိပြီးသား line ပေါ်ပဲ — line အသစ် discount မရ (B7) · % discount = ၁၀၀ ပြည့် (အနီးဆုံး; setting `sales.discount_round_to_amount` — B6) · စာသား: "hidden one-time code" = request row; "admin adjustment later" = refund | P339 · owner 30/Sep မနက် (OPEN-09) · owner 01/Oct (OPEN-36) | 🔒 (§3.5) · *v4:* discount rule ဆိုင်းထား (RISK-06, P381) — logic ကို သီးခြား / ပြင်ရလွယ်အောင် · ✅ OPEN-09 (v5.1) · ✅ OPEN-36 (v5.2.7) |
| D-PAY-05 | Refund full/partial; commission reversal; KBZPay duplicate transfer ကို adjustment နဲ့ trace · *v5.2.15 (one-sheet 02/Oct):* refund = Admin ပဲ (`sale.refund` — B12) · sale branch မှာပဲ (B8 b) · method မည်သည်မဆို (B8 c) · product line = စင်ပေါ်ပြန်တင် / ပျက်စီး (B8 a) · KBZPay ပိုလွှဲ ပြန်အမ်း = FINISH မှာ auto "overpayment return" (B5 — ဝင်ငွေ / commission မထိ) · လွှဲ ၂ ခါ = kind 2 manual (reason + reference) · cap: kind 1 ≤ sale total; kind 2 manual ≤ max(sale total, Σ non-cash payment) | P350 | 🔒 |
| D-PAY-06 | Receipt: auto number, actual barber, KBZPay ref, reprint (နံပါတ်တူ), refund receipt, PDF/print, ~~MM/EN~~ (*v5.2.7: English အမြဲ*), branch info · *v5.1 (REC-25):* **Receipt နံပါတ် = `B3-2026-OCT-00125`** (branch code – နှစ် – လ (အင်္ဂလိပ် ၃ လုံး၊ စာလုံးကြီး — D-PLT-05 MMM နဲ့ ကိုက်) – နံပါတ် ၅ လုံး); refund = `B3-RF-2026-OCT-00003` (နံပါတ်တန်း သီးသန့်); branch + လ တစ်ခုချင်း **ဆက်တိုက်၊ နံပါတ် မကျော် (gapless)**၊ လတိုင်း 00001 ကနေ ပြန်စ; လ = MMT business date (D-PLT-15); နံပါတ်ကို FINISH မှာမှ ပေး (incomplete visit နံပါတ် မစား); MM receipt မှာလည်း နံပါတ် မဘာသာပြန်; sort / ရှာ = DB မှာ နှစ် / လ / နံပါတ် ခွဲသိမ်း (စာသား sort မသုံး) · *v5.2.7 (OPEN-32 ✅ owner 01/Oct):* **receipt language = English အမြဲ** (user ဘာသာ / branch မလိုက်) — label = `en` language file၊ item / branch = `*_en` snapshot (fallback `*_mm`); reprint / PDF = ပုံတူ; go-live data = service / option / product EN နာမည် ဖြည့်; PDF / Share = device တိုင်း · *v5.2.15 (one-sheet 02/Oct):* receipt = server က render ပြီး ဖိုင်သိမ်း (PDF + printer PNG) — reprint တူ (H, ADR-013) · RF series = auto ပြန်အမ်း ပါ | R352 · owner 30/Sep မနက် (REC-25) · owner 01/Oct (OPEN-32) | 🔒 |
| D-PAY-07 | Thermal 58/80mm V1 core; branch အလိုက် printer setting; printer error က payment ကို မပိတ် · *v4:* receipt ကို **ပုံအဖြစ်** print (မြန်မာစာ — REC-29); V1 = Android ဖုန်း → Bluetooth printer; iPhone သုံးသူ → Android colleague / Manager က အဲ့ sale ကို ဖွင့်ပြီး print; counter print-only device = ⏭ နောက်မှ (design မှာ နေရာချန်) · *v5.2.7 (OPEN-20 ✅ owner 01/Oct):* iPhone အရေအတွက် မမေး — device တိုင်း အလုပ်ဖြစ်ရ: **receipt PDF / Share = device တိုင်း** (success screen ပထမ ခလုတ်), Print = Android capability flag (AD-RCPT-02) · *v5.2.15 (one-sheet 02/Oct):* printer width = branch setting `receipt.printer_width_mm` (58 / 80) · auto-print OFF (REC-37 ✅) | P353 · Claude 29/Sep (RISK-17) · owner 01/Oct (OPEN-20) | 🔒 (auto-print off = ⚠️ REC-37) |
| D-PAY-08 | Tax / service charge: configurable (enable/disable); default off · *v5.1 (OPEN-15):* **Admin ရဲ့ Additional Settings (D-PLT-07)** — tax / service charge တစ်ခုချင်း ဖွင့် / ပိတ် + rate %, **default OFF**; sale မှာ ပမာဏ snapshot (Part 4); commissionable sales ထဲ မပါ (D-COM-02) · 🟡 ဖွင့်မယ့်အချိန် တွက်ပုံ (discount နောက်၊ service charge → tax အစဉ်၊ ဈေးထဲ ပါ / မပါ) အတည်ပြု · *v5.2.15 (one-sheet 02/Oct):* default အစဉ် = discount → net ပေါ် service charge → net + service charge ပေါ် tax (exclusive, ကျပ်ပြည့်) — 🟡 owner က ဖွင့်ချိန် အတည်ပြု | P345, R346 · owner 30/Sep မနက် (OPEN-15) | 🔒 |
| D-PAY-09 | Tips V1 မှာ ပိတ် | R346 | 🔒 |

### A.9 Stock / Inventory
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-STK-01 | Branch အလိုက် stock; unit = pcs · *v5.2.15 (one-sheet 02/Oct):* အနုတ် ရ — warning + flag, မပိတ် (D5) | P26, P42 | 🔒 (V1 — REC-10 ✖ ဖြစ်လို့ R3 မဟုတ်တော့) |
| D-STK-02 | Purchase → branch ၁ ခု ဒါမှမဟုတ် အများကြီး; supplier optional · *v5.2.15 (one-sheet 02/Oct):* Manager = ကိုယ့် branch draft → "admin ဆီ ပို့"; Admin = post (D2) · post မတိုင်ခင် branch အလိုက် စုစုပေါင်း ပြ; post ပြီး undo ✖ — stock adjust + expense ဖျက် / အသစ် (D3) · ဗီရိုနဲ့ ပေး = cash-movement Cash Out (D1 — expense ၂ ခါ မဝင်) · subtotal 0 branch = expense ✖ · draft line ဖြုတ် = row ဖျက် + audit diff အပြည့် (✅ OPEN-40 (c) — owner 02/Oct; DB မပြောင်း) | P27, P29 | 🔒 |
| D-STK-03 | Transfer: receiver ရွေး (တစ်ယောက် / branch staff အားလုံး) + notification; receive မှာ actual qty + difference reason; မထွက်ခင် ပြင်/cancel ရ · *v5.1 (REC-14 / C-9):* **Transfer = ၂ ဆင့်** — DRAFT (ပြင် / cancel ရ) → **SENT** (= ပစ္စည်း ထွက်ပြီ: source stock နုတ်၊ "in transit" report) → **RECEIVED** (destination ပေါင်း — actual qty + ကွာချက် reason); "approve" နဲ့ "ထွက်" ခလုတ် ခွဲမထား (ဝန်ထမ်း ကိုယ်တိုင် သယ် — တစ်ချိန်တည်း); movement history = SEND (source −) + RECEIVE (destination +) ၂ ကြောင်း (D-STK-06) · *v5.2.15 (one-sheet 02/Oct):* ရွေးထားသူ / လက်ခံ branch ဝန်ထမ်း = code မလို + `transfer.receive` ရှိသူ (D4) · ပိုလက်ခံ = reason + flag + admin noti · SENT cancel ✖ — 0 လက်ခံ + reason · draft line ဖြုတ် = row ဖျက် + audit diff အပြည့် (✅ OPEN-40 (c) — owner 02/Oct) | P35, P37, P38 · owner 30/Sep မနက် (REC-14) | 🔒 |
| D-STK-04 | Usage = တစ်ဘူးလုံးကုန်မှ မှတ် · *v5.2.15 (one-sheet 02/Oct):* list = product အကုန်, ဆိုင်သုံး အပေါ်; ကိုယ်တိုင် undo ✖ (D7) · ၂ ခါ နှိပ် = `stock_movements.client_request_id` (G c) | P28 | 🔒 |
| D-STK-05 | Stock count/adjustment; reason ကို admin manage (disable ပဲ၊ delete မလုပ်) · *v5.2.15 (one-sheet 02/Oct):* system အရေအတွက် မပြဘဲ ရေ → post မတိုင်ခင် ကွာချက် review; branch လုံး (active product အကုန်) / category (D8) · Manager က count / adjust post; admin noti (D9) · refund "ပျက်စီး" reason = seed + setting `stock.refund_damaged_reason_id` | P31 | 🔒 |
| D-STK-06 | Low stock threshold + notification; movement history · *v5.2.15 (one-sheet 02/Oct):* threshold နဲ့ ညီ / အောက် = alert → company-scope ကိုင်သူ + branch manager (D6, F12); manager က branch threshold ပြင်ရ · ညစဉ် `stock.reconcile_levels` 01:30 (H) | P44 | 🔒 |

### A.10 Finance & Daily Closing
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-FIN-01 | Income: service/product auto + manual income (branch/company, categories) · *v5.2.15 (one-sheet 02/Oct):* cash manual income = မှတ်တာနဲ့ expected cash ထဲ (Pending ပါ — E7); P&L = Approved မှ; cash income = branch လို | P51 | 🔒 |
| D-FIN-02 | Expense categories admin manage; branch ဒါမှမဟုတ် company-wide · *v4:* Salary Advance / Staff Loan = expense **မဟုတ်** (receivable) — "Staff Advance" expense category မထား · *v5.2.15 (one-sheet 02/Oct):* branch မပါတဲ့ (company-wide) row = company scope နဲ့မှ ဖတ် / ရေး · module `finance_category` တစ်ခု · system category ၃ ခု = နာမည် / အစဉ် ပြင်ရ, ပိတ် / archive ✖ | P45, P49 · P390 (REC-15) | 🔒 |
| D-FIN-03 | Admin မဟုတ်သူ ထည့်ရင် approval; approve မတိုင်ခင် edit ရ; attachment; soft delete ("Void" စကားလုံး မသုံး) · *v5.2.15 (one-sheet 02/Oct):* auto-approve = company scope နဲ့ approve ခွင့်ရှိသူ ထည့်မှ; ကိုယ့်ဟာ ကိုယ် approve ✖ (E4 — manual expense / income) · auto source (cash out / purchase / payroll / လကုန်) = 🔒 F-P7-04 အတိုင်း APPROVED · purchase expense = company-scope `expense.delete` ရှိသူ ဖျက် + manual ပြန်ထည့် (D3) · attachment = approve ပြီးလည်း ထည့်ရ; private bucket (ADR-014) | P199 | 🔒 |
| D-FIN-04 | Salary expense ကို payroll ကနေ auto; employee/branch drill-down · *v4:* Salary Expense = **Gross**; Net = တကယ်ပေးရမယ့်ငွေ; advance / loan repayment က salary expense ကို မလျှော့ · *v5.2.15 (one-sheet 02/Oct):* salary row = private; branch P&L မှာ လစာ = စုစုပေါင်း တစ်ကြောင်း (E6 / C1) · finalize မှာ post, reopen မှာ ဖယ် + ပြန် post — ဖယ်ပုံ = **soft delete** ("Payroll reopened — <reason>") ပြီး finalize မှာ row အသစ် (✅ OPEN-40 (a) — DB Part 7 v1.2) | P46, P47 · P389, P390 (REC-16) | 🔒 |
| D-FIN-05 | Branch P&L = branch revenue − branch expense; Company = အကုန် − company-wide · *v5.2.15 (one-sheet 02/Oct):* revenue = finished sale line (discount နုတ်ပြီး) + service charge − refund (refund ရက် — F6) + approved manual income; tax မပါ · Manager = ကိုယ့် branch P&L (E6) · code `pnl.view` | P325 | 🔒 |
| D-FIN-06 | Daily closing: branch + ရက်; expected/actual cash + KBZPay; difference → reason; close ပြီး immutable; admin reopen/adjust + audit; company consolidated view · *v4:* expected cash ထဲမှာ cash out / cash return ပါ (REC-17) · *v5.1 (OPEN-05 A):* **(1) opening float** = branch setting (default ၀) → closing screen မှာ ကြိုဖြည့်၊ ပိတ်သူ ပြင်ရ; မနေ့ ပိတ်ချိန် ကျန်ငွေ ≠ ဒီနေ့ opening ⇒ reason (ပိုင်ရှင် ထုတ်သွား = Cash Out); **(2) ဘယ်သူပိတ်** = permission `closing.close` (role အလိုက် ပိုင်ရှင် ရွေး) — ပိတ်သူ / ပိတ်ချိန် record; closing screen = KBZPay ✔ (D-PAY-02) + Cash Out list + late entry ပိတ် (D-VIS-13); **(3) လက်ခံနိုင်တဲ့ ကွာချက်** = setting (default ၀ — ကွာရင် reason အမြဲ); ကျော် ⇒ admin noti (D-NTF-03); ကွာချက် ခံသူ V1 = မှတ်ရုံ (လစာ auto မဖြတ် — D-PAYR-03 manual); expected cash = opening + cash payments − cash refunds − Cash Out + Cash Return (REC-17) · *v5.2.15 (one-sheet 02/Oct):* စာသား formula = "+ manual cash income" ပါ (E8 — DB အတိုင်း) · ပိတ်မရ = အဲ့နေ့ FINISH ဖြစ်နိုင်တဲ့ sale ရှိ (E2 — ကွာငွေ sale + အရင်ရက် payment ကိုင်ထားတဲ့ OPEN sale ပါ) / အရင်ရက် မပိတ်ရသေး · ပိတ်ပြီးလည်း KBZPay ✔ ရ (E3) · ညနေ ငွေအပ် = မရေခင် Cash Out (E1) · setting `closing.close_roles` ဖြုတ် (= permission `closing.close`) · "adjust" = reopen → source ပြင် → ပြန်ပိတ် · ပိတ်ပြီးနေ့ START / FINISH / payment / refund / method ပြောင်း ✖ (B9) · "ပိတ်ရမယ့်နေ့" = ဖွင့်ရက် + ငွေလှုပ်ရှားမှု ရှိတဲ့နေ့ | P59, P143, P199 · P391–P395 · owner 30/Sep မနက် (OPEN-05 A) | 🔒 · ★ OPEN-05 B = ပိုင်ရှင် setting တန်ဖိုး |
| D-FIN-07 | Cash in = cash payment auto; drawer ထုတ်တိုင်း **Cash Out** form (amount, reason, note, recorded by; must return ဆို who took it + date); စာအုပ်မှတ်ပြီး closing မှာ သွင်းလို့ရ; accounting ကို reason က ဆုံးဖြတ် (D-FIN-08) — ဥပမာ bank deposit = cash → bank (expense မဟုတ်) · *v5.2.15 (one-sheet 02/Oct):* cash out မှား = မပိတ်ခင် ပြင် / cancel + reason (E5 — DB Part 7 v1.1) · Employee balance = `cashout.create` + `receivable.issue`, ကိုယ့်ကိုယ်ကို ✖ (C2); ယူသူနာမည် = payroll ခွင့်ရှိသူ + ကိုယ်တိုင်ပဲ မြင် (C1) · barber ညလုံး ငွေကိုင် = must-return + မနက် return (E1) | R351 · P391–P395, R394 (RISK-10) | 🔒 · opening float = D-FIN-06 (v5.1) · 🟡 expected return date optional / required (Part 7 DBML မှာ ဆုံးဖြတ်) |
| D-FIN-08 | **Cash Out Reason Master** (admin): name, must_return, expense category (must_return ဆို မဖြစ်မနေ), active; reason က accounting ဆုံးဖြတ် — expense (staff meal, electricity, supplier) / employee balance (advance, loan) / cash movement (bank deposit) / must return (admin temporary withdrawal — D-FIN-09) · *v5.2.15 (one-sheet 02/Oct):* seed reason ၁၁ ခု — cash-movement အသစ် ၃: "Takings to owner / bank" (E1) · "Stock purchase payment — recorded in Stock" (D1) · "Salary payment — recorded in Payroll" (C4); "Supplier" = ပစ္စည်းမဟုတ်တဲ့ bill ပဲ · reason က SALARY / PRODUCT_PURCHASE system category ကို မညွှန်ရ | P393, P395 | 🔒 (§3.12) |
| D-FIN-09 | Must return cash out ကို လကုန် closing အထိ မပြန်ရင် → category အောက် အဲ့လ expense အဖြစ် auto; ပြန်ထည့်ရမယ့်တာဝန် မပျောက်; နောက်မှ ပြန်ထည့်ရင် ယခင်လ expense ပြန်မဖျက်၊ ပြန်ထည့်တဲ့လမှာ Cash Return ဝင်ပြီး outstanding ပိတ် · *v5.1 (OPEN-25):* **Cash Return = ပြန်ထည့်တဲ့လ P&L မှာ မူလ expense category အောက် အနုတ် line (expense reversal)** — revenue မထိ; P&L ပြပုံ: category အောက် "ဒီလ ထုတ်" + "ပြန်ထည့် — **မူလ ရက် / ပမာဏ label** (ဥပမာ Oct 20 ရက် 50,000 ကို 5/Nov ပြန်ထည့်)" row ၂ ကြောင်း ခွဲ; P&L ထိပ်မှာ **note** "ဒီလမှာ ယခင်လ ထုတ်ငွေ ပြန်ရ X ပါဝင်"; DB = cash return က မူလ cash out ကို ချိတ် (category / မူလလ system ကနေ ထုတ်); နှစ်လ ပေါင်း = 0 · *v5.2.15 (one-sheet 02/Oct):* job `closing.month_end_must_return` = နေ့စဉ် 01:00 MMT — အဲ့လရဲ့ ပိတ်ရမယ့်နေ့ အကုန် CLOSED ဖြစ်မှ convert · expense ရက် = cash out လရဲ့ နောက်ဆုံးရက် · cancel row မပါ · return reversal = မူလ branch · convert မတိုင်ခင်က မှတ်ခဲ့တဲ့ return (reversal row မရှိတာ) ကို convert ပြီးမှ cancel ✖ (409 `cash_out_converted`) | P394, R394, P395 · owner 30/Sep မနက် (OPEN-25) | 🔒 |

### A.11 Commission & Payroll
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-COM-01 | Monthly, commissionable sales ပေါ်, progressive tier (Point: 0–2,250,000 = 15%, အထက် = 20%) · *v5.1 (OPEN-03 A):* **Commission engine design (OPEN-03 A):** plan = admin ဖန်တီး၊ tier အများကြီး (0 → X = Y%)၊ Point plan (15% / 20%, 2,250,000) = seed data; employee ၁ ယောက် plan ၁ ခု effective date + history (plan မရှိ = commission ✖ = basic ပဲ); **"qualify" = admin က plan ကို effective date နဲ့ assign** (auto rule ✖ V1 — INFERRED: Fresha ၃ ယောက် = qualify ဖြစ်ပြီးသူ၊ ကျန် ၁၀ = basic ပဲ၊ နောက် qualify ရင် plan တူ); tier threshold = **branch အကုန်ပေါင်း** default (C-2) · plan assignment မှာ branch scope optional (P63 branch % မတူ case) — scope ပေးရင် အဲ့ branch sales ပဲ; branch P&L = commission ကို branch commissionable sales အချိုးနဲ့ ခွဲ (D-PAYR-08); **ပိုင်ရှင်အဖြေ (B) = data ပဲ** (၁၀ ယောက် ပုံစံ၊ threshold ပေါင်းတိုင်း မှန်လား) — DB မထိ · *v5.2.15 (one-sheet 02/Oct):* plan = စရက်ကစ sale ရေတွက်, threshold ခွဲမတွက် (C5) · assignment back-date = ဖွင့်ထားတဲ့ payroll period အထိ · မှား + မသုံးရသေး assignment ဖြုတ် = **archive** (✅ OPEN-40 (b) — DB Part 5 v1.2 `archived_at` / `archived_by_user_id` / `archive_reason`) · plan = private data (C1) | P308 · owner 30/Sep မနက် (OPEN-03 A) | 🔒 · ★ OPEN-03 B = ပိုင်ရှင် data · (estimate / final → D-COM-04) |
| D-COM-02 | Commissionable sales = Point ရဲ့ Fresha rule အတိုင်း (services + add-ons; discount/tax/cost နုတ်ပြီး; fully paid ပဲ; package-paid မပါ; membership-paid ပါ) | P309 · *v5:* home service ကားခ line မပါ (D-SVC-06) | 🔒 |
| D-COM-03 | Attribution = actual service barber | P311 | 🔒 |
| D-COM-04 | Checkout မှာ ပြတဲ့ commission = **estimate**; period ကုန်မှ period တစ်ခုလုံးရဲ့ final commissionable sales နဲ့ **final**; checkout amount ကို payroll မှာ final မယူ · *v5.1 (OPEN-26):* **finalize ပြီးမှ refund** = refund ဖြစ်တဲ့လ payroll မှာ "commission ပြန်နုတ်" line သီးသန့် — ပမာဏ = refund line × **မူလ payroll မှာ တွက်ခဲ့တဲ့ %** (commission result မှာ sale line တိုင်း run + % မှတ်ထား); လက်ရှိလ tier တွက်တာ မထိ (sales ထဲက မနုတ်); မူလ payroll / payslip မပြောင်း; payslip မှာ "28/Oct ဆိုးဆေး refund — 6,000" ပြ; **finalize မတိုင်ခင်** refund = အဲ့လ commissionable sales ထဲက တန်းနုတ် (D-COM-02); ထွက်သွားလို့ နောက် payroll မရှိ = reversal "ပြန်ယူစရာ" အဖြစ် ကျန်၊ admin ဆုံးဖြတ် · *v5.2.7 / v5.2.8 (✅ owner confirm 01/Oct 10:47 — lock မပြောင်း):* checkout estimate line ကို **effective own-earnings flag ON barber ကိုပဲ ပြ** (company setting `dashboard.show_own_earnings_all` + per-barber override `employees.show_own_earnings` — D-DSH-03; "အကုန်လုံး / တစ်ယောက်ချင်း" နှစ်မျိုးလုံး ရ); တွက်တာ / final = အရင်အတိုင်း · *v5.2.15 (one-sheet 02/Oct):* checkout estimate = period အတွင်း ပေါင်းပြီး အဆင့်ခွဲ (2,240,000 + 30,000 → 5,500 — C12), engine တစ်ခုတည်း `Commission.estimate`; performer + earnings flag ON မှ ပြ · finalize ပြီး performer ပြောင်း ✖ (B9) · reversal > လစာ → ကျန် နောက် run (C6) · ထွက်သွားသူ ကျန်ငွေ = စာရင်းပဲ ပြ (write-off ⏭) | P396, P397 (RISK-11, REC-18) · owner 30/Sep မနက် (OPEN-26) · owner 01/Oct 10:47 (gating confirm) | 🔒 |
| D-PAYR-01 | Monthly default; weekly/bi-weekly/custom ထည့်နိုင် · *v5.2.15 (one-sheet 02/Oct):* run = company တစ်ခုလုံး period တစ်ခု, အစဉ်လိုက် · MONTHLY = ပြက္ခဒိန်လ · finalize = period ကုန် + branch အကုန် နေ့တိုင်း စာရင်းပိတ်ပြီး (C7) | P197 #1 | 🔒 |
| D-PAYR-02 | Basic salary employee ၁ ယောက် ၁ ခု; effective date + history; branch မခွဲ (commission ပဲခွဲ) · *v5.2.15 (one-sheet 02/Oct):* ရက်အလိုက် ခွဲ (16/Oct ဝင် 300,000 → 154,839; 15/Oct တိုး → 327,419 — C5) · ဝင် / ထွက် = salary row · မှား + မသုံးရသေး row ဖြုတ် = **archive** (✅ OPEN-40 (b) — DB Part 5 v1.2) | P197 #2–3 | 🔒 |
| D-PAYR-03 | Other earnings / deductions categories admin manage | P197 #5–6 | 🔒 |
| D-PAYR-04 | Salary Advance နဲ့ Staff Loan သီးခြား; balance + installment · *v4:* နှစ်မျိုးလုံး receivable (expense မဟုတ်); payroll deduction နဲ့ settle · *v5.2.15 (one-sheet 02/Oct):* ထုတ်ပေး = `receivable.issue` (**private** — Admin; ဗီရိုကဆို + `cashout.create`), ကိုယ့်ကိုယ်ကို ✖, instalment မပါ = နောက် payroll အကုန်ဖြတ် (C2) · cash ပြန်ဆပ် = owner / admin လက်ထဲ, ဗီရို ✖ (C3) · net ≥ 0, ကျန် = နောက်လ (C6) · repayment row = Mark paid မှာ ရေး; issue / repayment `Idempotency-Key` (G b) | P61, P197 #7 · P388, P390 (RISK-09) | 🔒 |
| D-PAYR-05 | Attendance/leave deduction auto + admin override + reason · *v5.1 (OPEN-06 A):* **Deduction rule = Additional Settings (D-PLT-07), default ၀ / OFF (OPEN-06 A):** နောက်ကျ — ခွင့်ပြုချိန် မိနစ် · ဖြတ်ပုံ (မဖြတ် / တစ်ကြိမ် ပုံသေ / မိနစ်နှုန်း) · ပမာဏ · "နောက်ကျ N ကြိမ် = ပျက်ကွက် ၁ ရက်" (0 = OFF); ပျက်ကွက် (ခွင့်မတိုင်) + လစာမဲ့ခွင့် (unpaid leave type) — တစ်ရက်နှုန်း = basic ÷ 30 / ÷ 26 / အဲ့လ schedule ရက်; payroll run = attendance ကနေ ရေတွက် (နောက်ကျ ကြိမ် / မိနစ်၊ ပျက်ကွက် ရက်၊ unpaid ရက်) → auto deduction line → Draft မှာ override + reason; **finalize = rule snapshot** (setting နောက်မှ ပြောင်းလည်း ပြီးသား run မပြောင်း); rule **အမျိုးအစား** = code (ပြောင်းရင် dev)၊ **တန်ဖိုး** = admin setting; go-live checklist: ပိုင်ရှင် တန်ဖိုး ဖြည့်မှ ဖြတ် · *v5.2.15 (one-sheet 02/Oct):* grace = threshold, ကျော်ရင် မိနစ်အပြည့် (C8) · shift ၂ ခုထဲ တစ်ခု ပျက် = 0.5 ရက်; စောပြန် = setting ဖွင့်မှ ဖြတ် (default OFF — C9) · "N ခါ နောက်ကျ = ၁ ရက်" ဆို အဲ့ နောက်ကျတွေရဲ့ ဖြတ်ငွေ အစားထိုး · ဖြတ်အစဉ် = attendance + အခကြေးမဲ့ခွင့် (gross အထိ; ပိုတာ မသယ်) → manual → commission ပြန်နုတ် → advance → loan (API Part 5 P5-RULE-08 — တစ်နေရာတည်းမှာ သတ်မှတ်) | P197 #8–9 · owner 30/Sep မနက် (OPEN-06 A) | 🔒 · ★ OPEN-06 B = ပိုင်ရှင် တန်ဖိုး |
| D-PAYR-06 | Draft → Calculate → Review → Finalize (lock) → Publish payslip (notify) → Paid (date/by); reopen = reason + audit · *v5.2.15 (one-sheet 02/Oct):* finalize gate (C7) · reopen = နောက်ဆုံး run ပဲ, PAID ✖ · paid ရက် = run တစ်ခု တစ်ရက် (C4) · `PayrollLock` → အဲ့ period ထဲ sale / attendance / shift / leave ပြင်တာ 423 `payroll_finalized` · reopen မှာ salary expense = **soft delete** (✅ OPEN-40 (a) — DB Part 7 v1.2; `Expenses.removePayroll`) | P197 #11–14 | 🔒 |
| D-PAYR-07 | Payslip PDF + Excel (Google Sheets မှာဖွင့်လို့ရ) · *v5.2.15 (one-sheet 02/Oct):* payslip = တောင်းမှ render (ADR-013), ဝန်ထမ်းဘာသာ · publish ပြီးမှ မြင် · reopen = "ပြင်နေဆဲ" noti | P197 #12 | 🔒 |
| D-PAYR-08 | Multi-branch salary allocation (report + P&L) · *v5.1 (OPEN-06 A):* ငွေပေး ၁ ခု၊ report / P&L ခွဲပဲ; ခွဲပုံ = setting — attendance နာရီ အချိုး (default, REC-19 ✅) / schedule နာရီ အချိုး / employee အလိုက် % လက်နဲ့; attendance မရှိ = primary branch; finalize မှာ allocation snapshot · *v5.2.15 (one-sheet 02/Oct):* commission ပိုင်း = sale branch အလိုက်; ကျန် = basis · MANUAL_PERCENT = setting `payroll.manual_allocation` · primary branch = အစောဆုံး active assignment | P197 #15, R348 · owner 30/Sep မနက် (OPEN-06 A, REC-19) | 🔒 |

### A.12 Schedule, Leave, Attendance
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-SCH-01 | Entry = employee + branch + date/day + start + end + repeat (optional); တစ်ရက်မှာ segment/branch အများကြီး · *v5.2.13 (owner 01/Oct 21:20):* pattern save ရင် ရှေ့ ၁၄ ရက်စာ shift **ချက်ချင်း** update (API P2.PAT.02); ညတိုင်း job = horizon ဆက်ထုတ်ရုံ · admin AD-SCH-01 စာသား ပြင်ပြီး (guideline v1.3) | P84, P191 · *v5:* repeat = `schedule_patterns` → နေ့စဉ် `schedule_shifts` ကြိုထုတ် (D-DB-06) · §0.6 #23 · D-API-03 | 🔒 |
| D-SCH-02 | ဝန်ထမ်း တစ်ယောက်ရဲ့ schedule အချိန်ချင်း မထပ်ရ — branch မတူလည်း (database level မှာ ကာ)။ **Branch မတူရင် ကြားမှာ ခရီးသွားချိန် ခြားရမယ်** — admin setting, default ၆၀ မိနစ် (ဥပမာ 9–13 A + 13–20 B ✖; 9–13 A + 14–20 B ✅)။ Branch တူရင် ခြားစရာမလို (9–13 A + 13–20 A ✅)။ ခြားချိန်ကို save ချိန်မှာ app က စစ်; booking availability က schedule ကို ကြည့်လို့ အလိုလို ပါ | owner 29/Sep ည (D-PLT-07 setting) | 🔒 |
| D-SCH-03 | **Home service သွားချိန် / ပြန်ချိန်** — admin setting, branch အလိုက်, default ၃၀ မိနစ်; booking က barber ကို [ရောက်ချိန် − သွားချိန်, ပြီးချိန် + ပြန်ချိန်] ပိတ် (ဥပမာ ၂:၀၀ ရောက်၊ ညှပ် ၃၀ မိနစ် → ၁:၃၀–၃:၀၀ ပိတ်) | owner 30/Sep (OPEN-17) | 🔒 |
| D-LV-01 | Leave types admin manage (Paid / Unpaid / Sick / Other) · *v5:* initial data = Point Fresha ရဲ့ blocked-time type ၁၀ မျိုး (paid / unpaid flag ပါ; နာမည် MM + EN — D-DB-04); admin လိုတိုးပိုလျှော့; "Late to work" မထည့် (attendance — D-ATT-03) | P195 #1 · owner 30/Sep (REC-27) | 🔒 |
| D-LV-02 | Approval = permission အလိုက်; pending မှာ edit ရ; overlap မရ; notification · *v5.2.13 (owner 01/Oct 21:20):* **APPROVED** ခွင့်ကို cancel = `leave.approve` ရှိသူပဲ (ဝန်ထမ်းက manager ကို ပြော) · ကိုယ့်ခွင့် **ကိုယ် approve ✖** (တခြား approver) · ကိုယ်စား တင် / ပြင် / cancel (PENDING) = `leave.create` / `update` / `delete` · *v5.2.15 (one-sheet 02/Oct):* noti = `leave.requested` / `decided` / `cancelled` · finalize ပြီး payroll period ထဲ ခွင့် ဖန်တီး / ဆုံးဖြတ် / cancel = 423 | P195 · §0.6 #18, #19 · D-API-03 · ADR-011 | 🔒 |
| D-LV-03 | Employee-level (branch အားလုံး ပိတ်); half-day ရ; hourly မရ | P195 #3–5 | 🔒 (pending → D-LV-04) |
| D-LV-04 | **Pending leave (ခွင့်ပြုချက် စောင့်နေဆဲ) ကလည်း booking ကို ပိတ်** — ခွင့်တင်တာနဲ့ အဲ့အချိန် customer ရွေးလို့မရ; ငြင်းရင် ပြန်ပွင့်; ခွင့်ပြုရင် ဆက်ပိတ် (Fresha အတိုင်း) · ⚠️ ခွင့်တင်ချိန်မှာ အဲ့အချိန်အတွင်း booking ရှိပြီးသားဆို approver ကို list ပြ (D-BKG-19 — booking ကို auto မဖျက်) | owner 30/Sep (OPEN-13, C-12) | 🔒 |
| D-LV-05 | **နေ့တစ်ဝက် ခွင့်** — "နေ့ခွဲချိန်" = admin setting (default **13:00**); မနက်ပိုင်း = ဆိုင်ဖွင့်ချိန် → 13:00၊ ညနေပိုင်း = 13:00 → ပိတ်ချိန်; booking ပိတ်ချိန်ကို ဒီအတိုင်းတွက် | owner 30/Sep (D-LV-03) | 🔒 |
| D-ATT-01 | Personal login + static branch QR + GPS radius (admin setting); location permission မဖြစ်မနေ · *v5.1 (OPEN-19):* design အတိုင်း ဆက် — attendance record မှာ method (1 QR_GPS · 2 MANUAL)၊ GPS lat / long + ဆိုင်နဲ့ အကွာအဝေး၊ device၊ manual = reason + ထည့်သူ (D-ATT-06); QR = branch အလိုက် **token** (branch id သက်သက် ✖)၊ admin ပြန်ထုတ်ရ (history); branches.latitude / longitude / location_radius_meters (Part 1) သုံး; ★ ပိုင်ရှင် အတည်ပြုရန် — "GPS မလို" = radius setting ပိတ် (DB မထိ)၊ "QR မလို" = manual-only mode setting; attendance လုံးဝ မလုပ်မှသာ OPEN-06 deduction ပြန်စဉ်းစား · *v5.2.15 (one-sheet 02/Oct):* QR = `/clock?t=<token>` · GPS accuracy ကန့်သတ် 100 m (`attendance.max_gps_accuracy_meters`) · GPS = clock အချိန်ပဲ ယူ · clock-out = ခလုတ် + GPS (C10) · `attendance.gps_required` OFF = အကွာအဝေး မှတ်ပဲ မှတ်, မစစ် | P74, P193 · owner 30/Sep မနက် (OPEN-19) | 🔒 · ★ ပိုင်ရှင် အတည်ပြု |
| D-ATT-02 | Active attendance ပေါ်မူတည်ပြီး clock in/out auto; တစ်ရက် branch အများကြီး · *v5.2.15 (one-sheet 02/Oct):* တခြား branch QR scan = ဖွင့်ထားတဲ့ record auto ပိတ် (C10) | R73, P193 #8 | 🔒 |
| D-ATT-03 | Late / early leave / absent / incomplete auto; admin manual ပြင်ရ · *v5.2.15 (one-sheet 02/Oct):* grace (C8) · shift တစ်ဝက် (C9) · shift / leave / attendance ပြောင်းရင် exception ပြန်စစ် (finalize ပြီး period ကျော်) | P193 #4–5, #9 | 🔒 |
| D-ATT-04 | Clock-out မေ့ → manager/admin ပြင် / shift ဆုံးရင် auto (setting) · *v5.2.15 (one-sheet 02/Oct):* auto clock-out setting default OFF ★ · auto ပိတ်တဲ့ record = INCOMPLETE flag, မဖြတ် | P193 #6 | 🔒 |
| D-ATT-05 | ပြင်ဆင်ချက် = manager/admin + audit · *v5.2.15 (one-sheet 02/Oct):* ကိုယ့်ဟာကိုယ် manual / ပြင် / excuse ✖ (C11 — 422 `self_action`; ကိုယ့် shift ကို ဒီနေ့ / အတိတ် ပြင်တာပါ) · မှားတဲ့ record = void + reason (G a) · code = `attendance.create` / `attendance.update` | P193 #7, #10 | 🔒 |
| D-ATT-06 | ဖုန်းမပါ / ပျက် → colleague က အခြားသူအတွက် clock-in ✖; Manager / Admin က manual ထည့်; record မှာ method (QR + GPS / Manual); Manual = reason မဖြစ်မနေ (preset "ဖုန်းမပါ / ပျက်" + Other); ထည့်တဲ့ screen မှာ အဲ့နေ့ service visit တွေ သက်သေပြ; လစဉ် manual အရေအတွက် (employee အလိုက်) admin မြင်; clock-out = manual ဒါမှမဟုတ် D-ATT-04 auto · *v5.2.15 (one-sheet 02/Oct):* C11 — ကိုယ့် exception ကို တခြား manager / admin က ဖြေရှင်း · code `attendance.resolve` | Claude 29/Sep (RISK-02) | 🔒 (§3.12) |

### A.13 KPI, Dashboards, Reports, Search, Audit, Notifications
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-KPI-01 | Revenue = actual barber ရဲ့ completed + paid service sales · *v5.2.15 (one-sheet 02/Oct):* refund = refund ရက်မှာ နုတ် (F6) | P315 | 🔒 |
| D-KPI-02 | Count = service visits; avg revenue/visit · *v5.2.15 (one-sheet 02/Oct):* avg / visit = service revenue ÷ service visit | P316 | 🔒 |
| D-KPI-03 | Returning customer data/rate; branch/company KPI; custom KPI (auto/manual) နောက်မှ · *v5.2.15 (one-sheet 02/Oct):* returning = အရင် finished visit ရှိဖူးတဲ့ identified customer; ဖုန်းမပါ walk-in = "unidentified visit" (F6) — OPEN-11 ◐ | P319, P322 | 🔒 ⏭ custom KPI = V1 မပါ (R323 "Future") |
| D-DSH-01 | Admin: All/branch dropdown (ဘယ်ဘက်အပေါ်); overview + booking, revenue, customer, barber KPI, branch, stock, expense, P&L · *v5.2.15 (one-sheet 02/Oct):* tile = report code အလိုက် ပြ; Manager P&L tile = လစာ တစ်ကြောင်း (E6) — API Part 8 P8-RULE-16 | P118, P120 | 🔒 |
| D-DSH-02 | Branch manager: assigned branches ပဲ; company-wide မရ | P124, P126 | 🔒 |
| D-DSH-03 | Barber: schedule, upcoming, current/next, completed, earnings/commission, notifications · *v5.2.7 (OPEN-10 ✅ owner 01/Oct):* **own sales / commission = default OFF အကုန်; admin က ပြစေချင်တဲ့ barber ကို ဖွင့်** · *v5.2.8 (owner 10:47 — "အကုန်လုံးလဲ ပြရ၊ တစ်ယောက်ချင်းလဲ ပြရ"):* ၂ ဆင့် — company setting **`dashboard.show_own_earnings_all`** (settings.json, default OFF) + per-barber override **`employees.show_own_earnings`** (NULL = setting လိုက် / true / false — Part 1 v3.4, Employee › Pay tab, audit); effective = COALESCE(override, setting); ON မှ dashboard tile + checkout estimate line (D-COM-04) + "My earnings"; colleague figures ဘယ်တော့မှ ✖ · *v5.2.15 (one-sheet 02/Oct):* barber home = P8.DSH.03; My earnings = P5.CMS.02 (flag ON မှ; C12 နည်း) | P122 · owner 01/Oct (OPEN-10) · owner 01/Oct 10:47 | 🔒 · ✅ OPEN-10 |
| D-DSH-04 | Customer dashboard မရှိ | P128 | 🔒 |
| D-RPT-01 | Report ၁၀ ခု; common date range; summary + filters + detail · *v5.2.8 (OPEN-34 ✅ owner 01/Oct 10:47 — မူလ နာမည်စာရင်း chat ဖျက်လို့ ပျောက်၊ ပြန်ဆွဲထုတ်ပြီး owner OK):* **① Sales summary ② Barber performance ③ Payments & KBZPay ④ Discounts & refunds ⑤ Daily closing & cash ⑥ Expenses & P&L ⑦ Commission & payroll ⑧ Attendance & leave ⑨ Bookings & customers ⑩ Stock** — တစ်ခုချင်း ဘာဖြေလဲ / source decision = admin AD-RPT-04; ဒီ ၁၀ ခု ပြင်ပ report = decision အသစ် လို · *v5.2.15 (one-sheet 02/Oct):* report ၁ ခု = code ၁ ခု (`report_<key>.view`; ⑥ = `pnl.view`; ⑦ private) — Manager = ⑦ ကလွဲ (F1) · live query ≤ 366 ရက် (H4, ADR-015) | P130–P145 · owner 01/Oct 10:47 (OPEN-34) | 🔒 |
| D-SRC-01 | Global search: admin/manager scope အတွင်း; barber = customer + booking ပဲ | P147 | 🔒 |
| D-AUD-01 | Audit: who/what/when/before/after/reason/branch; admin အကုန်; manager assigned branch; barber မရ · *v5.2.15 (one-sheet 02/Oct):* Manager = pay row ✖ (F10); branch မပါ row = company scope; ဝန်ထမ်းနဲ့ ဆိုင်တဲ့ action = လုပ်တဲ့ branch / primary branch; ကိုယ်တိုင် လုပ်ခဲ့တဲ့ row အမြဲ မြင် | P149 | 🔒 |
| D-AUD-02 | Audit append-only: app မှာ ကြည့်ရုံ (ပြင် / ဖျက် မရှိ — admin လည်း); app DB user = audit ပေါ် INSERT + SELECT ပဲ; ငွေ table (sale, payment, cash out, payroll) ပြောင်းတိုင်း DB က auto မှတ် (table အတိအကျ = part design ချိန်); DB superuser ကို ပိတ်တာ V1 ✖ (backup နဲ့ တိုက်စစ်) | Claude 29/Sep (RISK-15, REC-21) | 🔒 (§3.12) |
| D-NTF-01 | In-app realtime ပဲ; bell + unread + mark all + deep link | P115, P201 | 🔒 |
| D-NTF-02 | 90 ရက် history; user က ကိုယ့် notification ဖျက်ရ · *v5.2.15 (one-sheet 02/Oct):* purge job = `notifications.purge` 02:00 | P201 #4, #8 | 🔒 |
| D-NTF-03 | ငွေ/ပစ္စည်း ကိစ္စ → admin; notification type ကို admin ထိန်း; security/payslip/deactivation = mandatory · *v5.2.15 (one-sheet 02/Oct):* "admin" = အဲ့ code ကို company scope နဲ့ ကိုင်သူ (မရှိ = company admin — F12) · per-user mute ✖ · mandatory += `backup.failed`, `job.failed`, `backup.restore_authorized`, `payslip.published` / `revised` · deactivation = company admin ဆီပါ · catalogue ၄၁ type = API Part 8 §15 | P201 #5–7 | 🔒 |

### A.14 Data Management
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-DAT-01 | Import Excel/CSV: upload → validate → preview → confirm → audit · *v5.2.15 (one-sheet 02/Oct):* go-live import = master data ပဲ (customer · service category · simple service + branch ရောင်း / ကြာချိန် / ဈေး · product category · product · supplier · employee) — Fresha history ✖ · invite ✖ (F5); job ≤ 10,000 row; confirm = transaction တစ်ခု | P218 | 🔒 |
| D-DAT-02 | Export Excel/CSV/PDF — permission scope အတွင်း · *v5.2.15 (one-sheet 02/Oct):* `data.export` (Admin seed — F2) + screen ရဲ့ view ခွင့် · Excel / CSV ≤ 50,000 row, PDF = summary + 1,000 row; 5,000 ကျော် / PDF = နောက်ကွယ် (၂၄ နာရီ) (F3) · export တိုင်း audit | P218, R357 | 🔒 |
| D-DAT-03 | Automatic backup — *v4:* **daily (၃၀ ရက်) + weekly (၁ နှစ်) + off-site copy + လစဉ် restore test**; failure → admin notify · *v5.2.13 (owner 01/Oct 21:20):* **RPO = daily** လက်ခံ (disaster ဆို အဆိုးဆုံး ၂၄ နာရီ data ပျောက်နိုင် — စက္ကူ + closing record နဲ့ ပြန်သွင်း) · နာရီအလိုက် WAL archiving = revisit (system design §6) · backup = sidecar container (ADR-002) · *v5.2.15 (one-sheet 02/Oct):* off-site = owner ရဲ့ bucket (F4, ADR-014) · လစဉ် restore test = auto (DB Part 8 v1.1) · watchdog 06:00 · `backup.failed` / `job.failed` = mandatory noti | P216, P217 · Claude 29/Sep (RISK-12, REC-20) · §0.6 #15 · ADR-002 | 🔒 |
| D-DAT-04 | Restore = authorized + audit; record တစ်ခုမှားတာကို restore နဲ့ မပြင် · *v5.2.15 (one-sheet 02/Oct):* app ထဲ ခွင့်ပြု (reason + ရက်ရိုက် + maintenance ON) → developer script (F9) | R357 | 🔒 |
| D-DAT-05 | Transaction hard delete မရ; master data = deactivate/soft delete · *v5.2.15 (one-sheet 02/Oct):* OPEN-40 (§0.9) — (a)(b)(c) မေးခဲ့ · *v5.2.16 (owner 02/Oct "OPEN-40 OK"):* **✅ hard delete ✖ ကို မချိုး** — (a) payroll reopen = salary expense ကို **soft delete** (DB Part 7 v1.2) · (b) မှား + မသုံးရသေး salary row / commission plan assignment = **archive** (DB Part 5 v1.2) · (c) **DRAFT** purchase / transfer line = row ဖျက် + audit diff အပြည့် (draft = stock / ငွေ မထိသေး — transaction မဖြစ်သေး; booking item A2 ပုံစံတူ); import staging row ရှင်းတာ = transaction မဟုတ် (F-P8-04 အမျိုးတူ) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* S11 — archive လုပ်ထားတဲ့ salary row / commission plan assignment = **audit log မှာပဲ မြင်ရ** (Pay tab မှာ filter မထည့်; API Part 5 v1.1 မပြောင်း) | R357 · owner 02/Oct 13:08 (§0.11) | 🔒 |

### A.15 Public Website
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-WEB-01 | Admin panel ကပြင်တာနဲ့ (လိပ်စာ စသည်) website front page မှာ ချက်ချင်းပေါ် · *v5.1 (Part 8):* website = DB တစ်ခုတည်း ဖတ် (REC-35) — data = companies / branches (+ is_public, map_url) / services (+ show_on_website, public_description, image) / service_prices / employees (public_profile OFF default) / branch_opening_hours / branch_closures / settings site.* · "ချက်ချင်း" = revalidate (§5.8 — app) · *v5.2.7 (OPEN-21 toggle ✅ owner 01/Oct):* `site.show_prices` / `site.show_barbers` / `employees.public_profile` = **default OFF** — owner က admin panel ကနေ ဖွင့်မှ website မှာ ပေါ်; booking modal မှာ ဈေး + barber အမြဲ (OPEN-35); barber card = ဒီနေ့ shift branch (`schedule_shifts`) + `public_specialty` + Book with · *v5.2.15 (one-sheet 02/Oct):* `website.update` တစ်ခု — company scope = site အကုန် / branch scope = ကိုယ့် branch ဖွင့်ချိန် + ပိတ်ရက် (F7) · setting `site.domain` ဖြုတ် (= .env `SITE_ORIGIN`) · barber အစဉ် = employee code · `today_branches[]` · ပုံ = stable media path (ADR-014) | P1 · Part 8 30/Sep မနက် · owner 01/Oct | 🔒 · ✅ OPEN-21 toggle · ★ ဖွင့်ချိန် data / domain ကျန် |
| D-WEB-02 | Social media ကနေ booking လွယ်အောင် — `/book` link + branch QR · *v5.2.15 (one-sheet 02/Oct):* booking QR = P8.WEB.11 + poster export · public မဟုတ်တဲ့ branch ရဲ့ booking link လည်း အလုပ်လုပ် | P1, P174–P179 | 🔒 |
| D-WEB-03 | Company / Branch info (name, logo, phone, email, address, website/social) — website နဲ့ receipt ကို feed | R203, R352 §12.14 | 🔒 |
| D-WEB-04 | Branch ဖွင့်ချိန် (opening hours) + ယာယီပိတ်ရက် · *v5.1 (Part 8):* `branch_opening_hours` (နေ့အလိုက် ဖွင့် / ပိတ်၊ is_closed) + `branch_closures` (ရက် + notice MM / EN၊ ထပ် ✖) — website ပြ + /book မှာ ပိတ်ရက် branch ✖; booking availability = schedule_shifts (ဒီ table မဟုတ်) · *v5.2.13 (owner 01/Oct 21:20):* ပိတ်ရက် (`branch_closures`) = **staff booking ပါ** ✖ (API P2-RULE-10) · *v5.2.15 (one-sheet 02/Oct):* ပိတ်ရက် ထည့် = သိမ်း + booking စာရင်းပြ, auto cancel ✖ (F8 — no-show job ကလည်း ကျော်) · စရက် = ဒီနေ့ / နောက်; အတိတ်က စပြီးသား = end ရက် + notice ပဲ ပြင် | P1 · Part 8 30/Sep မနက် · §0.6 #17 | 🔒 (design) · ★ တန်ဖိုး = ပိုင်ရှင် |

### A.16 Database Design
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-DB-01 | Naming convention §6.1 (1–5) — `users` ≠ `employees`; `payments` + `payment_methods` + `external_reference`; `barber` / vendor နာမည် schema ထဲ မသုံး (`*_employee_id`, `*_user_id`); `fresha_id` → `import_source_refs`; plural snake_case; UUIDv7 PK; `*_at` timestamptz, `*_date` date, `*_amount` bigint MMK; status = enum (CHECK); `archived_at` soft delete | P361, R361, R363, P364 | 🔒 |
| D-DB-02 | **DB Part 1 (Foundation / Organization / Access) 🔒 = DBML v3** (§6.3, `db/part1-foundation-v3.4.dbml` — *v3.1 = Part 1b users column · v3.2 = Part 8 website column ၅ ခု · **v3.3 (01/Oct) = `users.ui_language` (OPEN-33) + `employees.show_own_earnings` (OPEN-10)** — column ၂ ခု၊ table / FK မပြောင်း၊ `users_ui_language_chk` CHECK* + `part1-foundation-v3-constraints.sql`) — F-P1-01..10 approve (F-P1-11 = OPEN-21 စောင့်) · **v3.4 (01/Oct 10:47) = `show_own_earnings` nullable (NULL = setting `dashboard.show_own_earnings_all` လိုက်) + `employees.public_rating numeric(2,1)` (OPEN-37 ✅) + `employees_public_rating_chk`** · v3.4 schema ပေါ် PostgreSQL 16 load ✅ · regression Part 3 / 8 (v3.3) + Part 5 / 8 (v3.4) PASS | owner 29/Sep ည · v3.3 / v3.4 = owner 01/Oct အဖြေ | 🔒 (v3.4) |
| D-DB-03 | **Status = number code** (`smallint` + DB CHECK — သတ်မှတ်ထားတဲ့ number ပဲ ဝင်ရ)။ Code ထဲမှာ constant file က နာမည်နဲ့ပဲ သုံး (ဥပမာ `UserStatus.ACTIVE`, ဂဏန်း တိုက်ရိုက် မရေး)။ Screen label (MM / EN) = language file။ Status list ကို admin setting မှာ မထား (system logic ချိတ်လို့) — status အသစ် = developer က constant + DB CHECK + logic ထည့်။ ရှိပြီးသား number ရဲ့ အဓိပ္ပာယ် မပြောင်း၊ ပြန်မသုံး — အသစ်က နောက် number။ ACTIVE ပါတဲ့ status set မှာ ACTIVE = 1၊ ပိတ် / inactive = 0။ **Type / kind field တွေလည်း ဒီ rule** (ဥပမာ `employee_roles.scope_type` 1 COMPANY / 2 BRANCHES — owner 29/Sep ည Part 1 lock)။ users: 0 DISABLED / 1 ACTIVE / 2 INVITED · employees: 0 INACTIVE / 1 ACTIVE / 2 RESIGNED / 3 TERMINATED · Login ခွင့် = users ∈ (1, 2) AND employees = 1 · *v5.2.13 (owner 01/Oct 21:20):* API wire မှာလည်း **number** (API-DATA-04) | owner 29/Sep ည (F-P1-05, F-P1-06; D-DB-01 ရဲ့ "status = enum (CHECK)" ကို အသေးစိတ်) · §0.6 #4 · D-API-01 | 🔒 |
| D-DB-04 | **၂ ဘာသာ data rule:** (1) Customer မြင်ရမယ့် စာသား (company / branch နာမည်၊ လိပ်စာ၊ service နာမည် / ဖော်ပြချက်၊ category) နဲ့ (2) admin setting / master list ထဲ ထည့်ရတဲ့ နာမည်အားလုံး (cash out reason, expense category, leave type, cancel reason, role, payment method စသည်) → `*_mm` + `*_en`; MM မဖြစ်မနေ၊ EN optional — မရှိရင် EN screen မှာ MM ပြ။ (3) လက်နဲ့ ရိုက်တဲ့ free-text (notes, "Other" reason စာ, internal notes) → field တစ်ခု၊ ရိုက်တဲ့ ဘာသာအတိုင်း သိမ်း / ပြ။ (4) Customer နာမည် → တစ်ခု (ပြောတဲ့အတိုင်း) | owner 29/Sep ည (F-P1-07, D-PLT-03) | 🔒 |
| D-DB-05 | **DB Part 1b (Login) 🔒 = v1** (§6.3b, `db/part1b-login-v1.dbml` + `…-constraints.sql`; users column ၇ ခု = `part1-foundation-v3.2.dbml`) | owner 30/Sep | 🔒 |
| D-DB-12 | **DB Part 8 (System / Website) 🔒 = v1 — နောက်ဆုံး part, DB design ပြီး** (§6.4h, `db/part8-system-website-v1.dbml` + `…-constraints.sql` + `…-test.sql`; Part 1 → `v3.2`, Part 2 → `v1.2` website column) — table ၁၂ · F-P8-01..09 approve: settings key-value + history trigger (D-PLT-16); audit_events append-only + ငွေ table ၁၈ row trigger (actor = SET LOCAL app.user_id); notification_types sync + mandatory CHECK; notifications template_key + 90 ရက် hard delete; attachments polymorphic; backup_runs (RESTORE reason); website = branch_opening_hours / closures + toggle column + site.* settings (OPEN-21 → data); import ၃ table; generic idempotency / outbox table ✖ · **Part 1–8 = table ၉၁ · PostgreSQL test ၂၉၆ PASS** · *v5.2.15 (one-sheet 02/Oct):* **v1.1 (02/Oct — G e):** restore test `performed_by` NULL ရ + `attachments_deleted_chk` · file `part8-system-website-v1.1.dbml` · test ၅၀ (§6.4i) · **စုစုပေါင်း test ၃၅၅ PASS (zip v7)** | owner 30/Sep နေ့လယ် | 🔒 |
| D-DB-11 | **DB Part 7 (Finance / Daily closing / P&L) 🔒 = v1** (§6.4g, `db/part7-finance-closing-v1.dbml` + `…-constraints.sql` + `…-test.sql`) — table ၈ · F-P7-01..07 approve: system expense category ၃; manual_incomes approval + soft delete; expected_return_date optional; expenses ledger source ၆ (reversal −, original ref, AUTO ⇒ APPROVED); purchase expense per (purchase, branch) → Part 6 v1.1; daily_closings REC-17 CHECK + snapshot + generated difference + CLOSED rule; cash_outs type snapshot + receivables FK · P&L = view · *v5.2.15 (one-sheet 02/Oct):* **v1.1 (02/Oct — G d):** cash out / return cancel column + expense / income `client_request_id` · file `part7-finance-closing-v1.1.dbml` · test ၅၈ (§6.4i) · *v5.2.16 (owner "OPEN-40 OK"):* **v1.2 (02/Oct — OPEN-40 a):** FK `expenses.payroll_entry_branch_allocation_id` = `ON DELETE SET NULL` + `expenses_source_refs_chk` (source 3 = allocation NULL ကို `deleted_at` ရှိမှ ခွင့်ပြု) — column အသစ် မရှိ · file `docs/db/part7-finance-closing-v1.2.dbml` · constraints v1.2 · test ၇၇ (§6.4j) · **DB စုစုပေါင်း = table ၉၁ · test ၃၉၃ PASS (zip v8) · ဖိုင်နေရာ = `point-sdd/docs/db/`** | owner 30/Sep မနက် | 🔒 (v1.2) |
| D-DB-10 | **DB Part 6 (Inventory) 🔒 = v1** (§6.4f, `db/part6-inventory-v1.1.dbml` — *v1.1 = purchases.expense_id ဖြုတ် (Part 7 F-P7-05)* + `…-constraints.sql` + `…-test.sql`) — table ၁၂ · F-P6-01..09 approve: product category; sku / is_sellable / company sell price; cost = purchase unit cost, P&L = purchase → Part 7 expense (COGS ⏭); balance cache + အနုတ် ခွင့်ပြု; movement append-only ledger (trigger) type ၈; transfer ၂ ဆင့် ကွာချက် = from ခံ; count in-progress ၁ / expected snapshot; adjustment reason disable ပဲ; sale_items.product_id FK · *v5.2.15 (one-sheet 02/Oct):* **v1.2 (02/Oct — G c):** `stock_movements.client_request_id` · file `part6-inventory-v1.2.dbml` · test ၄၉ (§6.4i) | owner 30/Sep မနက် | 🔒 |
| D-DB-09 | **DB Part 5 (Commission / Payroll / Attendance) 🔒 = v1** (§6.4e, `db/part5-commission-payroll-attendance-v1.dbml` + `…-constraints.sql` + `…-test.sql`) — table ၁၇ · F-P5-01..12 approve: plan branch scope = row per branch; blended effective rate + REVERSAL မူလ %; system category ၈ + custom; rules_snapshot jsonb; **attendance_exceptions** (auto detect → OPEN / EXCUSED / CONFIRMED / LEAVE / VOID; manager အဲ့နေ့ ဆုံးဖြတ်; payroll = OPEN + CONFIRMED) → payroll_attendance_items + override; receivables ၁ table kind ၂ + repayment XOR; QR = random token; attendance method / GPS CHECK; run status ၆ + reopen reason; result key = assignment; branch allocation snapshot; salary = လစဉ် · *v5.2.15 (one-sheet 02/Oct):* **v1.1 (02/Oct — G a / b):** attendance void column + receivable / repayment `client_request_id` · file `part5-…-v1.1.dbml` · test ၈၅ (§6.4i) · *v5.2.16 (owner "OPEN-40 OK"):* **v1.2 (02/Oct — OPEN-40 b):** `employee_salaries` + `employee_commission_plans` မှာ `archived_at` / `archived_by_user_id` / `archive_reason` + `…_archive_chk` (all-or-none, reason ဗလာ ✖) + overlap EXCLUDE `WHERE (archived_at IS NULL)` · file `docs/db/part5-…-v1.2.dbml` · constraints v1.3 · test ၁၀၄ (§6.4j) | owner 30/Sep မနက် | 🔒 (v1.2) |
| D-DB-08 | **DB Part 4 (Service execution / Sales / Payments) 🔒 = v1** (§6.4d, `db/part4-visits-sales-payments-v1.dbml` + `…-constraints.sql` + `…-test.sql`) — table ၁၃ · F-P4-01..13 approve: visit ≠ sale (service line = sale_items, product-only sale = visit မရှိ); performed_by line အလိုက်; ဈေး override = list vs ယူဈေး + reason + permission (barber ✖); receipt gapless = receipt_counters row lock; discount approval = discount_requests, code XOR request, once-per-customer DB guard; refund ၂ မျိုး (sale refund + items / KBZPay overpayment return) + RF series; sale_adjustments = correction ledger (method / performer / collected_by), ငွေပမာဏ ✖; client_request_id unique (D-VIS-10); late entry = visits; split payment ရ (Σ = app); receipt စာသား snapshot; sale business_date = FINISH ရက်; INCOMPLETE ⇒ booking COMPLETED · *v5.2.15 (one-sheet 02/Oct):* **constraints v1.2 (02/Oct — G f):** FINISH guard trigger ၄ ခု (`finished_immutable`) · test ၈၃ (§6.4i) | owner 30/Sep မနက် | 🔒 |
| D-DB-07 | **DB Part 3 (Customers / Booking) 🔒 = v3** (§6.4c, `db/part3-customers-booking-v3.dbml` + `…-constraints.sql` + `…-test.sql`) — v5.1 ဆုံးဖြတ်ချက် (D-BKG-09 / 12 / 20 ⏭, D-SVC-05) + F-BK-01..21 approve: barber ပိတ်ချိန် `block_starts_at` / `block_ends_at` (buffer + အိမ်သွား / ပြန်ချိန်) ပေါ်မှာ EXCLUDE (F-BK-16); cancel reason = admin list + no-show `system_code` (F-BK-17); booking မှာ service နာမည် / ဖုန်း snapshot မထား (F-BK-18); `bookings.customer_name` = ရိုက်တဲ့နာမည်၊ customer record auto မပြောင်း (F-BK-19); service အများကြီး = item တိုင်း ကြာချိန် + buffer (F-BK-20); archive ပြီးသား customer ဖုန်းကိုက်ရင် ပြန်ဖွင့် (F-BK-21) | owner 30/Sep မနက် | 🔒 |
| D-DB-06 | **DB Part 2 (Services / Scheduling) 🔒 = v1** (§6.3c, `db/part2-services-scheduling-v1.3.dbml` — *v1.1 = diagram ref · v1.2 = Part 8 website column ၄ ခု · **v1.3 🔒 (01/Oct 13:00 design · owner confirm 01/Oct 21:20 — §0.6 #24): `employee_service_eligibilities.archived_at` + `schedule_patterns.archived_at` nullable + `eligibility_one_open` partial unique `archived_at IS NULL` (constraints v1.1) — API Part 2 P2-RULE-04: တစ်နေ့တည်း ပြန်ဖြုတ် / segment ဖျက်တာ date CHECK ကြောင့် ပိတ်မရ၊ hard delete ✖ (D-DAT-05); PostgreSQL 16 test ✅, zip v5*** + `…-constraints.sql`) — owner confirm ၅ ချက်: (1) schedule = အပတ်စဉ် ပုံစံ (`schedule_patterns`) + ရှေ့ ၁၄ ရက်စာ နေ့စဉ် shift (`schedule_shifts`) ကို ညတိုင်း ကြိုထုတ် (job ပုံစံ = REC-31 ဆုံးဖြတ်ချိန်)၊ တစ်ရက်ချင်း ပြင်ရ (2) ဈေးဇယား UI = option group ၂ ခုအထိ (DB က အကန့်အသတ်မရှိ) (3) အိမ်မှာ လုပ်ခွင့် = barber + service တစ်ခုချင်း ✔ (`employee_service_eligibilities.home_allowed`) (4) ဈေး = effective date (D-SVC-08) (5) leave status 0 CANCELLED / 1 PENDING / 2 APPROVED / 3 REJECTED + တင်သူ / ဆုံးဖြတ်သူ / အချိန် | owner 30/Sep | 🔒 |

### A.17 UI / UX *(v5.2.6 အသစ်)*
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-UX-01 | **UI/UX guideline = ဖိုင် ၂ ခု** — (1) `docs/ux/frontend-website.md` (public website: home, branch page, `/book` + `?branch=`, confirmation, manage-link page, SEO — rule `FE-<AREA>-nn`) (2) `docs/ux/admin-panel.md` (login ဝင်ပြီး screen အားလုံး: admin / manager / barber ဖုန်း POS, login / OTP / devices, receipt, QR — rule `AD-<AREA>-nn`); UX principle reference = **Laws of UX** (lawsofux.com — law ၃၀ လုံး, ဖိုင်တစ်ခုချင်း §2 မှာ mapping); admin panel = **Fresha research repo** ကိုပါ reference (adopt / improve / avoid — 🔒 D-PLT-09 "Fresha = reference"); **precedence = Appendix A 🔒 > `db/` > UX guideline > Fresha** — ဆန့်ကျင်ရင် STOP (D-PLT-13); *v5.2.16 note:* အစဉ် အပြည့် (၇ ဆင့် — `openspec/config.yaml`, AD-META-01, FE-META-01) = Appendix A 🔒 > `docs/db/` > UX guideline > API design > ADR / system design > design-reference ပုံ > Fresha — ပထမ ၃ ဆင့် + Fresha နောက်ဆုံး မပြောင်း; rule ID ကို OpenSpec spec / PR မှာ decision ID နဲ့အတူ ကိုးကား (D-PLT-17); guideline content = draft → owner approve မှ binding (REC-39 / 40 → D-UX-03 / 04) | owner 30/Sep ည | 🔒 |
| D-UX-02 | **Colour code + font family = team (owner) ကိုယ်တိုင် သတ်မှတ်** — guideline ထဲ semantic token နာမည် (`--primary`, `--destructive`, `--success` …, `--font-myanmar` …) + requirement (WCAG AA contrast; destructive = အနီ — D-UI-01; colour တစ်ခုတည်းနဲ့ status မခွဲ; Myanmar Unicode font, weight ၂ မျိုး+, self-host licence, tabular ဂဏန်း) ပဲ; တန်ဖိုး = `{{…}}` placeholder; Claude Code က colour / font / logo **မတီထွင်ရ** — မသတ်မှတ်ခင် shadcn/ui default `neutral` scaffolding; token file တစ်ခုတည်း (admin + website မျှသုံး) · *v5.2.7 (OPEN-31 ✅ owner 01/Oct):* **Font:** မြန်မာ = **Pyidaungsu** (Regular / Bold — admin + website) · admin English = **Manrope** (UI) / **Inter** (ဂဏန်း tabular + fallback) · website English = **Archivo Black** (display / heading — Latin ပဲ) + **Roboto** (text) · website က `(site)` route group ထဲ font token override (colour token မထိ) · self-host WOFF2 + licence ဖိုင် · colour = ★ owner palette + design reference ပုံ ပေးမယ် · *v5.2.16 (owner 02/Oct — OPEN-30 website ✅):* **Website palette = `#EEEEEE` နောက်ခံ · `#000000` စာ · `#DC5F00` decoration; ခလုတ် = အမည်း + စာဖြူ (21:1); လိမ္မော်ရောင် = decoration / ခေါင်းစဉ်ကြီး / icon ပဲ — စာသေး ✖ (`#EEEEEE` ပေါ် 3.19:1 · လိမ္မော်ပေါ် စာဖြူ 3.70:1; လိမ္မော်ပေါ် စာ = အမည်း 5.68:1)** · **admin panel palette = မပေးရသေး → shadcn `neutral` ဆက်** · `site` tree က **colour token ကိုပါ override** (အထက်က v5.2.7 "colour token မထိ" ကို အစားထိုး — token ဖိုင် တစ်ခုတည်း, နာမည် မျှသုံး) · ကျန် website token = ⚠️ REC-41 အဆိုပြု (frontend v1.5 FE-VIS-01a) · **design reference ပုံ = `point-barber/design-reference/{website,admin-panel}/` + `README.md` index — reference ပဲ, rule မဟုတ်; admin panel = Fresha ပုံစံ ~၈၀ % + ပိုသုံးရလွယ်ရမယ်** (AD-META-08) · *v5.2.18 (owner 02/Oct 13:46 — "Ok ပါတယ်"):* **website ကျန် colour token အကုန် 🔒 (REC-41 ✅)** — `--ring #000000` · `--card #FFFFFF` · `--muted #E0E0E0` / `--muted-foreground #555555` · `--border #C4C4C4` · `--input #707070` · `--secondary #FFFFFF` · `--accent #E0E0E0` · `--destructive #C8281B` · `--success #0E4A28` · `--warning #6A3A00` · `--info #0B5CAD` (foreground = `#FFFFFF` / `#000000` — frontend v1.7 FE-VIS-01a) — **website အရောင် ပြည့်စုံ**; admin panel palette ★ ကျန် (neutral ဆက်) | owner 30/Sep ည · owner 01/Oct (font) · owner 02/Oct (sheet B1 / B2 / #1 / #2) · owner 02/Oct 13:46 (REC-41) | 🔒 · ✅ OPEN-31 (font) · ◐ OPEN-30 (website ✅ · admin palette ★ ကျန်) · ✅ REC-41 (v5.2.18) |
| D-UX-03 | **Admin panel / staff app UI/UX guideline v1.2 = APPROVED** (`docs/ux/admin-panel.md`) — rule `AD-…` ~270 (⚠️ အကုန် binding); v1.1 = owner 01/Oct အဖြေ (font · OPEN-32 / 33 / 10 / 20 / 36) · v1.2 = ဒုတိယအကြိမ် (OPEN-34 🔒 report ၁၀ · earnings ၂ ဆင့် · rating field · `ကျပ်` confirm · Part 1 v3.4); ★ colour / logo / MM label = တန်ဖိုး; ပြောင်းရင် version အသစ် + register note · *v5.2.13 (owner 01/Oct 21:20):* **v1.3** — AD-PERM-06 (code = menu CRUD + special action map) · **AD-PERM-07 role matrix = View · Create · Update · Delete + Special actions + "Company admin" badge + seed role** · AD-NAV-02 / AD-WEB-02 code နာမည် · AD-SCH-01 စာသား ("updated now") · §15 row ပိတ် (rating code, 14 ရက် window, booking idempotency) · *v5.2.14:* **v1.4** — AD-PERM-03 / 06 / 07 data level hint (ADR-012) + Part 3 code · AD-BKG-01 (ဖုန်း fixed / နာမည် ပြင်) / 02 / 09 (alarm recipient + Cancel as no-show) · AD-CUS-01 / 02 (Inactive · preferred barber · history scope) · *v5.2.15 (one-sheet 02/Oct):* **v1.5 (02/Oct):** API Part 4–8 delta — AD-POS / RCPT / ATT / QR / PAY / STK / CLS / FIN / RPT / IMP / AUD / BAK / WEB / NTF / SET · AD-PERM-06 code list (Part 3–8 🔒) + AD-PERM-07 private hint · §15 OPEN-40 (`point-ux-guideline-admin-panel-v1.5.md`) · *v5.2.16:* **v1.6 (02/Oct မနက်):** §15 OPEN-40 ပိတ် · OPEN-30 admin palette ★ (neutral ဆက်) · AD-META-08 (design reference / Fresha ~၈၀ % + ပိုလွယ်) · AD-META-05a (`app/staff` / `app/site` path note) · AD-META-01 (precedence ၇ ဆင့် အပြည့်ရေး) · AD-IMPL-06 (catalogue = `/dev/ui` — D-ENG-01) · AD-VIS-01 note · ဥပမာ နေ့နာမည် ပြင် (30/Sep/2026 = Wed) — screen rule မပြောင်း (`docs/ux/admin-panel.md`) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **v1.7:** AD-POS-03 / AD-POS-05 — V1 START sheet = ဒီ branch မှာ ရောင်းတဲ့ simple service ပထမ ၆ ခု **catalogue အစဉ်အတိုင်း**; picker မှာ "Frequent here" အပိုင်း V1 မပါ (S7) · AD-VIS-03 / AD-A11Y-02 — palette မရခင် **focus outline = 2 px `--foreground`, input border = `--muted-foreground`** (ရှိပြီးသား neutral token; အရောင်အသစ် ✖) (S15) · *v5.2.18 (owner 02/Oct 13:46 — "Ok ပါတယ်"):* fix-up (version မပြောင်း): AD-VIS-03 ရဲ့ S15 ကြားဖြတ် = **staff app မှာပဲ** (website က ကိုယ်ပိုင် `--ring` / `--input` ရပြီ — REC-41 ✅) | Claude 01/Oct (draft v1.0 → v1.2) · **owner approve 01/Oct 11:09** (REC-40 ✅) · ADR-011 · §0.6 #23 / #25 / #26 · scope A · §0.7 · owner 02/Oct (OPEN-40 OK · B2) · owner 02/Oct 13:08 (§0.11) · owner 02/Oct 13:46 (REC-41) | 🔒 (v1.7) |
| D-UX-04 | **Frontend website UI/UX guideline v1.2 = APPROVED** (`docs/ux/frontend-website.md`) — rule `FE-…` ~125 (⚠️ အကုန် binding); v1.1 = owner 01/Oct အဖြေ (D-UX-05 · OPEN-21 / 31 / 32 / 35) · v1.2 = ဒုတိယအကြိမ် (OPEN-37 rating · D-BKG-23 lead time · `Ks` confirm); ★ colour / design ref = spec အဆင့် · *v5.2.14:* **v1.3** — FE-BK-05 (≤ 5) / 10 (cutoff 2 h) / 11 (`price_changed`, retry check) · FE-CONF-02 (.ics browser) / 03 (၄၀ မိနစ် စာ) · FE-MNG-05 · *v5.2.15 (one-sheet 02/Oct):* **v1.4 (02/Oct):** FE-HOME-05 split-day branch · FE-HOME-02 / FE-BR-02 "Open now" = browser မှာ တွက် · FE-PERF-05 media path · FE-IA-03 (`point-ux-guideline-frontend-website-v1.4.md`) · *v5.2.16:* **v1.5 (02/Oct မနက်):** website palette — FE-VIS-01 ပြန်ရေး · FE-VIS-01a (token ဇယား: 🔒 owner ၃ ရောင် + ခလုတ်; 🟡 REC-41 ကျန် token — အဆိုပြုချက်, binding မဟုတ်) · FE-VIS-01b (decoration အရောင် ဘယ်မှာ သုံးရ — `--background` / `--card` ပေါ်မှာပဲ) · FE-META-01 (၇ ဆင့်) · FE-META-04a (path note) · FE-META-06 (site ခြွင်းချက် ၃ ခု) · ဥပမာ နေ့နာမည် ပြင် · design reference folder (`docs/ux/frontend-website.md`) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **v1.6:** FE-VIS-01a note — REC-41 မ approve ခင် focus outline = `--foreground` (18.10:1), input border = `--muted-foreground` (4.09:1) (S15); REC-41 = မ approve ရသေး · *v5.2.18 (owner 02/Oct 13:46 — "Ok ပါတယ်"):* **v1.7:** FE-VIS-01a row အကုန် 🔒 (REC-41 ✅); website မှာ focus outline = `--ring`, input border = `--input` (S15 ကြားဖြတ် website အတွက် ပြီးဆုံး); `add-shared-ui-components` ထဲ ဆောက် | Claude 01/Oct (draft v1.0 → v1.2) · **owner approve 01/Oct 11:09** (REC-39 ✅) · §0.7 · owner 02/Oct (B1 / B2 / #2) · owner 02/Oct 13:08 (§0.11) · owner 02/Oct 13:46 (REC-41) | 🔒 (v1.7) |
| D-UX-05 | **Public website brand / motion / booking UI (owner 01/Oct):** (1) **online booking = modal / pop-up box** — သီးခြား `/book` page မရှိ; `/book`, `/book?branch=<code>`, `/book?branch=<code>&barber=<id>` = entry link (QR / social — D-BKG-01 ဆက်အလုပ်ဖြစ်) → page ပေါ် modal ဖွင့်ထားတဲ့ပုံ; confirm ပြီး `/booking/[token]?new=1` page (manage link မပျောက်အောင် — D-BKG-11) (2) Home **Our barbers** card = ပုံ + နာမည် + **လက်ရှိ branch** (ဒီနေ့ `schedule_shifts`) + description (`employees.public_specialty_*`) + **rating** (*v5.2.8 — OPEN-37 ✅: လောလောဆယ် admin / manager ပေးတဲ့ `employees.public_rating`, website မှာ "Point rating" caption; V2 = customer rating*) + **Book with <name>** direct booking (3) theme = **minimalist and clean**; colour palette + design reference = owner ပေးမယ် (★ OPEN-30) (4) animation = **Motion + GSAP**, **3D object ✖**; မြန်မာစာ character split ✖; reduced-motion fallback (5) SEO / social links မှာ **TikTok** ပါ (6) website toggle (`site.show_prices` / `show_barbers` / `public_profile`) = info page ပဲ, default OFF, owner ဖွင့်မှ; **booking modal မှာ ဈေး + barber display name အမြဲ** (OPEN-35 = Option A); closure = ပိတ်ရက်ပဲ ရွေးမရ (7) website ငွေ = `Ks` ဘာသာ ၂ မျိုးလုံး (D-PLT-04 note) · rule = frontend v1.2 FE-BK-00, FE-HOME-05, FE-VIS-01/02/07, FE-SEO-02, FE-FMT-01 | owner 01/Oct (guideline အဖြေ) · owner 01/Oct 10:47 (rating, colour timing) | 🔒 · ✅ OPEN-37 · ★ OPEN-30 (spec အဆင့်မှ) |

### A.18 API Design *(v5.2.9 အသစ် — D-PLT-18 #2 · v5.2.10 = v1.2 · **v5.2.13 = Part 0 / 1 / 2 🔒** · **v5.2.14 = v1.4 / v1.4 / v1.3 (scope A) + Part 3 draft** · **v5.2.15 = Part 0–8 အကုန် 🔒 — API design ပြီး**)*
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-API-01 | **API design Part 0 — conventions + module map** (`docs/api/00-conventions.md` **v1.3**): surface ၃ မျိုး (staff `/v1` · public `/v1/public` · internal) · session cookie `point_session` HttpOnly / Secure / SameSite=Lax / host-only / `Max-Age` 400 d + CSRF header `X-Requested-With: point-app` + Origin = app host (ADR-005) · `@Can(code, branch)` guard — permission AND branch scope (D-ROLE-03), list = scope-filter, single read out of scope = 404, action = 403 · **API-PERM-03 operational read (read scope, code မလို) vs management read (`view⁺`)** · **API-PERM-06 = menu CRUD + special action, `view⁺`, delete = archive, scope, seed role, company admin = role ၅ code, no-escalation / last-admin / auto-grant (ADR-011)** · JSON snake_case = DB column · money = integer MMK · time = ISO `+06:30`, business date `YYYY-MM-DD` · status / type = **number** (D-DB-03) · `*_mm` / `*_en` · phone E.164 · errors = RFC 9457 + language key `error.*` + `errors[]` + `request_id` · cursor pagination · `Idempotency-Key` = `client_request_id` (D-VIS-10), replay = 200 + `Idempotent-Replayed` · **booking create = client-generated manage token (ADR-004)** · optimistic `expected_updated_at` · audit interceptor + DB trigger (D-AUD-02) · Socket.IO path `/rt`, rooms `user:` / `branch:` (read scope) / `company` + event catalogue (Part 2 event ၄ ပါ) · public DTO rule + `site.revalidate` job (ADR-006) · **Turnstile + 10 / h / IP + 3 / h / ဖုန်း** · OpenAPI from Zod · **single origin `/api` (ADR-009)** · module map ~၇၀ resource / part ၈ · *v5.2.14:* **v1.4** — scope A (ADR-012): API-PERM-02 decorator (`level`, `orSelf`), **API-PERM-07 data level**, `company_scope_required`, problem `context`, API-PUB-01 Part 3 path, API-PUB-02 HOME လိပ်စာ ချွင်းချက် · *v5.2.15 (one-sheet 02/Oct):* **v1.5 (02/Oct — one-sheet + Part 4–8):** `private` level · final `Idempotency-Key` list (၁၃) · API-IDEM-06 (lock အစဉ် / isolation / `PayrollLock`) · realtime ၅၈ (id ပဲ) · error code ညှိ · request id = UUIDv7 · audit `branch_id` rule · module map final (endpoint ၄၄၁ · code ၁၇၄) · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **Part 0 v1.6** — API-ERR-02 **500 `internal_error`** (S4) · API-ERR-03 **field-level code = Zod issue နာမည်** (`too_small` / `too_big` / `invalid_type`; catalogue code ရှိရင် အဲ့ဒါ; `required` / `date_invalid` / `unknown` = client-only) (S5) · API-DATA-11 **reason field = endpoint ရဲ့ part / OpenAPI သတ်မှတ်တဲ့အတိုင်း**, `{ reason_id?, reason_code?, note? }` = shared dialog ရဲ့ ရလဒ်ပုံစံ (S8) · API-LIM-02 **code verify ၁၀ ခါ / နာရီ / IP → 429** (S9) · API-PERM-03 **code ရှိ + branch မဟုတ် = `forbidden`; `out_of_scope` = part က နာမည်ပေးထားမှ** (S12) — endpoint / DTO / permission code မပြောင်း | Claude 01/Oct 11:09 (v1.0) · 11:54 (v1.1) · independent review (v1.2) · **owner 01/Oct 21:20 (§0.6 — v1.3)** · owner scope A (01/Oct ည) · owner 02/Oct 13:08 (§0.11) | 🔒 **(v1.3 — 01/Oct 21:20 · v1.4 — scope A · v1.5 — one-sheet 02/Oct 00:06 · v1.6 — sheet 3 02/Oct 13:08)** |
| D-API-02 | **API design Part 1 — Foundation & Access** (`docs/api/01-foundation.md` + `openapi/part1-foundation.yaml` **v1.3** — OpenAPI 3.1 validate ✅, `1.3.0`, `x-permission`): **endpoint ၅၂** — auth ၆ (OTP request / verify neutral · Google start `client=web\|shell\|pwa` / callback · **hand-off `POST /v1/auth/handoff`** — ADR-005 · logout) · me ၅ (`MeResponse` bootstrap) · company ၂ · branches ၅ · employees ၁၇ (create = users + employees + **invite ချက်ချင်း**; status change = session revoke + future bookings warning; branch / role assignment D-ROLE-05 / 06 + no-escalation; rating; invite resend / cancel; devices) · roles + permissions ၇ (catalogue `kind` / `scope`) · settings ၅ (reset = update; **client-readable ၈ key**) · system ၅ (health liveness · status · maintenance · search · jobs) · **permission code ၂၁ = menu CRUD + special** (`company.view/update` · `branch.view/create/update/delete` · `employee.view/create/update/delete` + `rating_update` / `earnings_update` / `access_update` / `branch_assign` · `role.view/create/update/delete` + `role.assign` · `settings.view/update`) · P1-RULE-05 read scope · P1-RULE-11 field-grouped PATCH · **P1-RULE-12 company admin = role ၅ code** + last-admin 409 · picker filter (repeatable `service_id`, `home`, `date`) · branch code `^[A-Z0-9]{1,10}$` · realtime ၃ · *v5.2.14:* **v1.4** — P1-RULE-13 (company profile / role / company setting = company master; branch / employee / branch override = branch data) · settings = mixed (`editable`) · jobs = company scope · catalogue `level` · Manager seed += `settings.view` / `update` · *v5.2.15 (one-sheet 02/Oct):* **v1.5 (02/Oct):** settings key ထည့် / ဖြုတ် (`receipt.printer_width_mm`, `sales.discount_round_to_amount`, `stock.refund_damaged_reason_id`, `payroll.early_leave_*`, `payroll.manual_allocation`, `attendance.max_gps_accuracy_meters`, `site.*`, `system.maintenance` · ဖြုတ်: `sales.kbzpay_reference_regex`, `closing.close_roles`, `site.domain`, `stock.low_stock_notify_roles`) · `site.*` read-only · `level` += `private` · logo / photo = staging attachment · job list ၁၈ · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **Part 1 v1.6** (OpenAPI 1.6.0 validate ✅) — P1-RULE-03: verify IP cap (S9), lock အဖြေ စာသားအတိုင်း (S10), `email_invalid` / `otp_format` (S5) · P1-RULE-10: **`permission.sync`** (S13) · **P1-RULE-14 ပထမ company admin = server ပေါ်က operator command** (`admin-create.js --email --name-mm --code`; active company admin မရှိသေးခင်ပဲ ရ — INVITED admin လည်း ရေတွက်; HTTP endpoint မဟုတ်; audit `source = 3` + OS user) (S6) · **P1-RULE-15 browser တစ်ခုတည်းမှာ ထပ် login → အရင် session = `1 LOGOUT`** (S14) · OTP endpoint ၂ ခုမှာ `X-Requested-With` (API-AUTH-02 — R1) · Manager seed = code ၆ ခု (R2) — endpoint ၅၂ / code ၂၁ မပြောင်း | Claude 01/Oct 11:09 / 11:54 / review v1.2 · **owner 01/Oct 21:20 (§0.6 #6–#8, #25, #26 — v1.3)** · DB Part 1 v3.4 / 1b / Part 8 settings · AD-LOGIN / AD-EMP / AD-SET / AD-PERM · owner scope A · owner 02/Oct 13:08 (§0.11) | 🔒 **(v1.3 — 01/Oct 21:20 · v1.4 — scope A · v1.5 — one-sheet 02/Oct 00:06 · v1.6 — sheet 3 02/Oct 13:08)** |
| D-API-03 | **API design Part 2 — Catalogue & Scheduling** (`docs/api/02-catalogue-scheduling.md` + `openapi/part2-catalogue-scheduling.yaml` **v1.2** — OpenAPI 3.1 validate ✅, `1.2.0`, `x-permission`): P2-RULE-01..12 — company master / branch sale · options → variants generated, **≤ 2 groups (API)** · one price store, fixed resolution · effective-dated write algorithm · **price quote = the only price calculator** · eligibility + picker filters · pattern → shifts (manual day, diff generation, attendance guard, day reset; **roster updated immediately**) · leave (**APPROVED cancel = `leave.approve` · self-approval ✖**) · **availability function** (**buffers summed · closures block staff too · in-progress walk-in until estimated end · last slot must fit the shift incl. buffer**) · **P2-RULE-11 operational vs management reads** · endpoint ၅၀ · **permission code ၂၂** (`service.*` ၄ · `price.*` ၃ · `eligibility.*` ၂ · `schedule.*` ၄ · `leave_type.*` ၄ · `leave.*` ၄ + `leave.approve`) · realtime ၇ · DB Part 2 **v1.3 🔒** · *v5.2.14:* **v1.3** — service master / category / option / leave type = company master; **P2.SVC.06 ရောင်း + ကြာချိန် = branch data (item တစ်ခုချင်း)**; `sold=all` = ကိုယ့် branch; Manager seed += `service.view` / `update` · *v5.2.15 (one-sheet 02/Oct):* **v1.4 (02/Oct):** quote window = မပိတ်ရသေးတဲ့ ရက်မဆို (B11) · finalize ပြီး period ထဲ shift / leave = 423 · ကိုယ့် shift ကိုယ်ပြင် (≤ ဒီနေ့) = 422 `self_action` (C11) · attendance ပြန်စစ် · late-entry visit = busy မတွက် (B1) · service ပုံ = staging attachment | Claude 01/Oct 13:00 (v1.0 → v1.1 after review) · **owner 01/Oct 21:20 (§0.6 #16–#24, #25, #26 — v1.2)** · AD-SVC / AD-CMP-13 / AD-SCH / AD-LV / FE-BK-05..08 · owner scope A | 🔒 **(v1.2 — 01/Oct 21:20 · v1.3 — scope A)** |
| D-API-04 | **API design Part 3 — Customers & Booking + public** (`docs/api/03-customers-booking.md` + `openapi/part3-customers-booking.yaml` **v1.0** — OpenAPI 3.1 validate ✅, `x-permission`): P3-RULE-01..13 — customer identity တစ်ခုတည်း (auto match / create, archive → ပြန်ဖွင့်, Inactive → Active) · shared customer + branch history (ADR-012) · **create pipeline** (token replay → captcha → item / window → customer → price quote → slot → website active-booking → insert → EXCLUDE) · reschedule ဈေး (D-BKG-12, preview, kept item snapshot) · cancel (no-show reason = staff) · no-show job (recipient, snooze × 4 = audit row, singletonKey ✖) · **row lock** · public (Turnstile, 10 / IP, 3 / phone attempt, ≤ 5, cutoff 120, token redact, public DTO) · endpoint **၃၈** · permission code **၁၂** · realtime ၅ · DB Part 3 v3 မပြင် · *v5.2.15 (one-sheet 02/Oct):* **🔒 lock (A1)** — **v1.1**: ဖြုတ်တဲ့ `booking_items` = ဖျက် + audit အပြည့် (A2) · Manager seed (A3) · B4 နည်းတဲ့ဈေး (START) · public မဟုတ်တဲ့ branch booking link ရ · ပိတ်ရက်ထဲ booking = no-show job မထိ (F8) · FINISH / INCOMPLETE → `booking.updated` | Claude 01/Oct 23:30 (§0.7 "အကုန် OK" + scope A) · independent review ၂၉ ✅ (§12.9) · **owner one-sheet 02/Oct 00:06 (A1–A3)** | 🔒 **(v1.1 — 02/Oct)** |
| D-API-05 | **API design Part 4 — Visits, Sales & Payments** (`docs/api/04-visits-sales-payments.md` + `openapi/part4-visits-sales-payments.yaml` **v1.0** — OpenAPI 3.1 validate ✅): P4-RULE-01..22 — START (walk-in / booking / ကူမှတ် / အိမ် / late entry — DayLock) · line + ဈေး (quote function, နည်းတဲ့ဈေး B4, override) · COMPLETE / INCOMPLETE · total (discount ၁၀၀ ပြည့်, tax / service charge setting) · discount code + request (B7) · payment (split, void, collected-by, KBZPay ✔ / ref ပြင်) · **FINISH ၁၈ ဆင့်** (lock အစဉ်, receipt counter, stock, auto ပြန်အမ်း B5, DB guard) · product-only sale · ကွာငွေ sale (B10) · refund kind 1 / 2 (B8) · adjustment ledger (`EffectiveSale`) · receipt (server render — ADR-013) · "was it saved?" lookup · payment method master · endpoint **၅၅** · permission code **၂၂** · `Idempotency-Key` ၅ · *v5.2.17 (owner 02/Oct 13:08 — sheet 3):* **Part 4 v1.1** (OpenAPI 1.1.0 validate ✅) — P4-RULE-01: `correction_path` ကို **FINISHED sale မှာ payment ထပ်ထည့်တာ** နဲ့ **CANCELLED sale ကို ရေးတာ အကုန်** မှာ မထည့် (409 `invalid_transition { status }` ပဲ) (S17) · reason field (`reason` / `added_reason` / `override_reason`) = binding ပုံစံ (S8) · "အသုံးအများဆုံး service" endpoint V1 မရှိ (S7) — endpoint ၅၅ / code ၂၂ မပြောင်း | Claude 02/Oct · **owner one-sheet 02/Oct 00:06 (B1–B12 · G f · H)** · DB Part 4 (constraints v1.2) · independent review ✅ (§11.9) · owner 02/Oct 13:08 (§0.11) | 🔒 **(v1.0 — 02/Oct · v1.1 — sheet 3, 02/Oct 13:08)** |
| D-API-06 | **API design Part 5 — Commission, Payroll & Attendance** (`docs/api/05-commission-payroll-attendance.md` + OpenAPI **v1.0**): P5-RULE-01..20 — **private level** (C1) · commission plan / tier / assignment · engine တစ်ခုတည်း (estimate အဆင့်ခွဲ C12 · EARN / REVERSAL · carry) · salary (ရက်အလိုက် ခွဲ C5) · payroll run (Draft → Calculate → Finalize → Publish → Paid · reopen · `run_stale` fingerprint · run အစဉ်လိုက်) · net ≥ 0 (C6) · finalize gate (C7) · `PayrollLock` (423) · payslip (ADR-013) · advance / loan (`Receivables.*` — C2 / C3) · QR + GPS attendance (C10) · manual / void / correct (C11) · exception detect (C8 / C9) · branch QR · endpoint **၆၉** · code **၂၃** · `Idempotency-Key` ၂ · *v5.2.16:* **v1.1** — "⚠️ OPEN-40 pending" စာသား → lock ပြီးသား mechanism (§11.10) | Claude 02/Oct · **owner one-sheet (C1–C12 · G a / b)** · DB Part 5 v1.1 → **v1.2** · independent review ✅ · owner 02/Oct "OPEN-40 OK" | 🔒 **(v1.1 — 02/Oct မနက်: OPEN-40 (a)(b) ✅ lock — endpoint / DTO / code မပြောင်း; OpenAPI 1.1.0)** |
| D-API-07 | **API design Part 6 — Inventory** (`docs/api/06-inventory.md` + OpenAPI **v1.0**): P6-RULE-01..16 — product category / product / supplier / adjustment reason (company master) · stock level + threshold override (D6) · ledger `StockLedger.post` (append-only; အနုတ် ရ D5) · usage (D7, G c) · adjustment (D9) · purchase draft → request post → Admin post → `Expenses.createAuto` (D1–D3) · transfer ၂ ဆင့် (D4) · count (D8) · ညစဉ် reconcile · endpoint **၅၈** · code **၂၈** · `Idempotency-Key` ၂ · *v5.2.16:* **v1.1** — "⚠️ OPEN-40 pending" စာသား → lock ပြီးသား mechanism (§11.10) | Claude 02/Oct · **owner one-sheet (D1–D9 · G c)** · DB Part 6 v1.2 · independent review ✅ · owner 02/Oct "OPEN-40 OK" | 🔒 **(v1.1 — 02/Oct မနက်: OPEN-40 (c) ✅ lock — endpoint / DTO / code မပြောင်း; OpenAPI 1.1.0)** |
| D-API-08 | **API design Part 7 — Finance & Daily Closing** (`docs/api/07-finance-closing.md` + OpenAPI **v1.0**): P7-RULE-01..19 — `DayLock` (close = exclusive; 422 `day_closed`) · "ပိတ်ရမယ့်နေ့" rule · expected cash component (DB CHECK နဲ့ ကိုက်) · close blocker (E2) / reopen · KBZPay list (E3) · cash out (accounting type ၄ · edit / cancel E5 · staff-advance masking C1) · cash return · reason master · category · expense / income (approval E4 · auto source carve-out) · လကုန် must-return job (D-FIN-09) · P&L (`Pnl.compute` — E6, F6) · endpoint **၅၀** · code **၂၇** · `Idempotency-Key` ၄ · *v5.2.16:* **v1.1** — "⚠️ OPEN-40 pending" စာသား → lock ပြီးသား mechanism (§11.10) | Claude 02/Oct · **owner one-sheet (E1–E8 · G d)** · DB Part 7 v1.1 → **v1.2** · independent review ✅ · owner 02/Oct "OPEN-40 OK" | 🔒 **(v1.1 — 02/Oct မနက်: OPEN-40 (a) ✅ lock — endpoint / DTO / code မပြောင်း; OpenAPI 1.1.0)** |
| D-API-09 | **API design Part 8 — Platform** (`docs/api/08-platform.md` + OpenAPI **v1.0**): P8-RULE-01..20 — notification (catalogue ၄၁, recipient rule, mandatory — F12) · attachment (staging → link, signed URL, public media — ADR-014) · staff document (F11) · audit (F10) · import (F5) · export (`data.export` — F2 / F3) · backup / restore (F9) · website content + ဖွင့်ချိန် / ပိတ်ရက် (F7 / F8) · public site API · report ၁၀ (code တစ်ခုစီ — F1, F6; ADR-015) · dashboard tile · internal endpoint (key ၂ ခု) · endpoint **၆၉** · code **၁၉** | Claude 02/Oct · **owner one-sheet (F1–F12 · G e · H)** · DB Part 8 v1.1 · independent review ✅ | 🔒 **(v1.0 — 02/Oct)** |

### A.19 Architecture — system design review + ADR *(v5.2.10 အသစ် · **v5.2.13 = ADR Accepted + ADR-011 + provider** · **v5.2.14 = ADR-012** · **v5.2.15 = ADR-013 / 014 / 015 + ADR-012 Amendment 1**)*
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-ARC-01 | **Architecture record = `docs/architecture/system-design.md` (v1.2) + `docs/adr/ADR-001..012`** — infrastructure / cross-cutting code ဆောက်တိုင်း ADR ID ကိုးကား; **Accepted (01/Oct 21:20 — owner §0.6):** ADR-001 modular monolith (1 VPS · Docker Compose) · 002 pg-boss + backup sidecar (RPO daily) · 003 Capacitor + Bluetooth Classic ESC/POS · 004 booking client token · 005 session + CSRF + Google hand-off · 006 website SSR + tag cache + revalidate · 007 monitoring + email (D-ARC-02) · 008 Socket.IO instance ၁ · 009 single origin `/api` · **011 permission = menu CRUD + special action**; **Superseded:** ADR-010 (→ 011) · independent review: v5.2.10 ၂၄ ချက် (§12.6) + v5.2.13 (§12.8); ပြောင်းရင် ADR အသစ် + အဟောင်း Superseded · *v5.2.14:* **ADR-012 Accepted** (scope = data level — ADR-011 #7 အစားထိုး) · system design **v1.2** · ADR-002 / 007 action item (no-show job singletonKey ✖, jobs panel company scope) · independent review §12.9 · *v5.2.15 (one-sheet 02/Oct):* **ADR-013** (document rendering — server Chromium; receipt ဖိုင်သိမ်း) · **ADR-014** (file storage — S3 bucket) · **ADR-015** (reports / exports — live query) **Accepted (owner H / F4)** · **ADR-012 Amendment 1** (`private` level — C1) · ADR-002 job ၁၈ · ADR-006 / 007 / 008 / 009 note · system design **v1.3** (lock အစဉ် + isolation) · *v5.2.16:* system design **v1.4** (OPEN-40 ပိတ် · repo ၂ ခု note) · **ADR-016** (repo ၂ ခု — D-ARC-03) · ADR-001 Amendment 2 — record = `docs/adr/ADR-001..016` | Claude 01/Oct 11:54 (`engineering:system-design` + `engineering:architecture`) · **owner 01/Oct 21:20 (§0.6 #1, #5, #9–#15, #25–#29)** · owner scope A (01/Oct ည) · **owner one-sheet 02/Oct 00:06 (H, F4, C1)** · owner 02/Oct (OPEN-40 OK · sheet C5 / D5 / #3) | 🔒 (REC-31 / 32 / 35 / 38 ✅ · OPEN-38 ✅) |
| D-ARC-02 | **Ops provider + alert (ADR-007):** email = **Resend Free** (OTP + invite ပဲ; ၃,၀၀၀ / လ · ၁၀၀ / ရက်) · uptime = **HetrixTools Free** (၁ မိနစ်တစ်ခါ, location ၄; alert = **Email + Telegram** — Telegram က ဖုန်း push; account ကို ရက် ၉၀ တစ်ခါ login) · error = **Sentry Developer (Free)** (user ၁, error ၅,၀၀၀ / လ, email alert; dev ၂ ယောက် သီးသန့် login လိုမှ Team US$26 / လ) · account ၃ ခု = **owner ပိုင် ops Gmail** နဲ့ (ACT-08) · routing: server / site ပျက် → Telegram + Email · app error → Email · backup / job → app ထဲ noti (D-NTF-01) · ops alert (owner / dev ဆီ provider က တိုက်ရိုက်) = app notification မဟုတ် → 🔒 D-NTF-01 (in-app ပဲ) မထိ · **domain မရခင်:** dev / staging = **Mailpit**, barber pilot = **Google login ပဲ**, domain ကို production release ကျမှ owner ကိုယ်တိုင် ထည့် (DNS access ✅) + Resend မှာ **go-live ၂–၃ ရက် အလို** verify + Gmail / Yahoo / Outlook OTP စမ်း | owner 01/Oct 21:20 ("Resend ကို Free ရအောင်သုံးမယ်" · "Telegram ကို အမြဲ … ပို့လို့ရလား" → ရ · Uptime alert = Email + Push · Sentry · Domain / DNS · #27 / #28 / #29) · limit = provider page 01/Oct/2026 | 🔒 |
| D-ARC-03 | **Repo ၂ ခု (ADR-016):** **`point-sdd`** = spec hub (OpenSpec *store* — `openspec/` config · changes · specs, `docs/briefs`, `docs/decisions`, `docs/db`, `docs/ux`, `docs/api`, `docs/adr`, `docs/architecture`, `docs/plan`, test case / browser test / doc tool; **code ✖**) · **`point-barber`** = app (ADR-001 monorepo: code, `db/` migration (point-sdd `docs/db` ကနေ ထုတ် + hash စစ်ထားတဲ့ copy), test, `docs/engineering` coding guideline, `docs/ops`, `design-reference/`, `CLAUDE.md`, `openspec/config.yaml` = `store: point-sdd`) · developer စက်မှာ **`point/` folder အောက် ဘေးချင်းယှဉ်** · `/opsx:apply` = point-barber ထဲ; brief / propose / validate / test case / archive = point-sdd ထဲ · **DB / API / UX / ADR ပြောင်း = point-sdd မှာ အရင်** (version bump + register) → ပြီးမှ code · branch / commit scope / PR တိုင်း change id ပါ · store (OpenSpec 1.14.0 beta) မရရင် fallback = point-sdd ထဲကနေ additional directory · repo ၂ ခုလုံး **private** (ACT-09) · ADR-001 action item 1 ကို amend (Amendment 2) | owner 02/Oct မနက် (sheet C5 "ဘယ်ဖိုင် ဘယ်မှာ" · D5 · sheet 2 #3 / #4 / #8 · 09:17 "`point/` အောက် `point-sdd` + `point-barber`") | 🔒 |

### A.20 Engineering — tooling, quality gates, coding guideline *(v5.2.16 အသစ် — OpenSpec အဆင့်)*
| ID | Decision | Source | Status |
| --- | --- | --- | --- |
| D-ENG-01 | **Tooling + စစ်ဆေးပုံ:** pnpm workspaces + Turborepo · Node 24 LTS · TypeScript strict · ESLint + Prettier · Vitest (unit) + **PostgreSQL 16 အစစ်နဲ့ integration test** + Playwright (e2e) · GitHub Actions · branch တို (`feature/<change-id>`; PR များရင် `feature/<change-id>/<part>`) + PR review ၁ ယောက် + squash merge · Conventional Commits (scope = change id) · component catalogue = **`/dev/ui` page** (Storybook ✖ — AD-IMPL-06 ပိတ်) · **စက်နဲ့ စစ်လို့ရတာ (lint · typecheck · test · float money · raw UI string · hex colour) = CI fail → merge ✖; ကျန်တာ = PR review checklist** · **test environment login = Email OTP ကို Mailpit ကနေ ဖတ်** — password / test-only login endpoint ✖ (system က passwordless — D-AUTH-01); stack = ADR-001 အတိုင်း | owner 02/Oct မနက် (sheet D2 · D3 · D4 · sheet 2 #9 "သဘောတူတယ်") | 🔒 |
| D-ENG-02 | **Coding guideline = `point-barber/docs/engineering/coding-guideline.md`** (rule ID `CG-<AREA>-nn` — UI/UX guideline ရဲ့ `AD-…` / `FE-…` ပုံစံတူ; PR / spec မှာ decision ID နဲ့အတူ ကိုးကား) — **reference** (UI/UX မှာ Laws of UX သုံးသလို): Google TypeScript Style Guide · Clean Code / SOLID · The Twelve-Factor App · OWASP ASVS · NestJS / Next.js / Prisma official documentation · Conventional Commits · test pyramid; reference က 🔒 decision / ADR / API rule နဲ့ မကိုက်ရင် **locked rule ကို လိုက်** (guideline §25); **Draft v1.0 (rule ID ၁၅၁ = rule ၁၄၅ + pointer ၆)** = owner approve မလုပ်ခင် ⚠️ recommendation (REC-42) — 🔒 source က လာတဲ့ rule တွေကတော့ အဲ့ source အရ binding; ပြောင်းရင် version အသစ် + register note · *v5.2.18 (owner 02/Oct 13:46 — "Ok ပါတယ်"):* **Coding guideline v1.0 = APPROVED (REC-42 ✅) — rule အကုန် (⚠️ ပါ) binding**; rule စာသား မပြောင်း; ကျန် = guideline §26 team item (OPEN-CG-02..06) | owner 02/Oct (chat အစ rule ၁၁ "experienced software engineer တစ်ယောက်လို coding guideline သေချာသတ်မှတ်" · sheet D1) · Claude draft 02/Oct · owner 02/Oct 13:46 (REC-42) | 🔒 (v1.0 APPROVED — 02/Oct 13:46; REC-42 ✅) |

---

## Appendix B — Owner ကိုမေးရန် (စုစည်းပြီး)

> **#n = §3.0.4 ရဲ့ OPEN-n** (နံပါတ်တူ — အဖြေရရင် register မှာ 🔒 ပြောင်း)။ ★ = Release 1 design ကို တိုက်ရိုက် သက်ရောက်လို့ အရင်မေးရမယ့်ဟာ *(v4: release မခွဲတော့ — "V1 design" လို့ ဖတ်ပါ)*။ *v4:* ✅ = ဖြေပြီး · ◐ = တစ်စိတ်တစ်ပိုင်း · ⏸ = owner က ဆိုင်းထား။ 🗄 Part N = အဖြေမရမချင်း အဲ့ DB part ကို lock မလုပ်နိုင် (§6.2)။ OD-n = `fresha-research/owner-decisions.md` ထဲက နံပါတ်။

1. ✅ *(v5.1: late entry = barber ကိုယ်တိုင် + reason + စာရင်းမပိတ်ခင် — D-VIS-13)* ◐ *(v4: barber ကိုယ်တိုင် ကိုယ့်ဖုန်းနဲ့ real-time — D-VIS-11; outage → စက္ကူ → နောက်မှသွင်း — D-VIS-13; outage မဟုတ်တဲ့ late entry နဲ့ reason / permission ကျန်)* ★ **Walk-in ကို ဘယ်သူ ဘယ်အချိန် မှတ်မလဲ** — barber ကိုယ်တိုင် ကိုယ့်ဖုန်းနဲ့ / branch tablet နဲ့? နောက်မှမှတ်တာ (late entry) ကို ခွင့်ပြုမလား? (§3.1) · 🗄 Part 4
2. ✅ *(v4: ညှပ်တဲ့သူကိုယ်တိုင်; `collected_by` ခွဲ — D-VIS-06)* ~~★~~ **ငွေကို ဘယ်သူ လက်ခံလဲ** — ညှပ်တဲ့ barber ပဲလား၊ ငွေကိုင်တဲ့သူ သီးသန့်ရှိလား? (§3.3) · 🗄 Part 4
3. ◐ *(v5.1: design ✅ D-COM-01 — plan assign / effective date / branch ပေါင်း default; ကျန်တာ data ပဲ — INFERRED: ၁၀ ယောက် = basic ပဲ၊ ၃ ယောက် = qualify ပြီးသူ)* ★ **Commission plan မရှိတဲ့ barber ၁၀ ယောက် ဘယ်လို လစာရလဲ?** Threshold 2,250,000 ကို branch အားလုံးပေါင်းတိုင်းတာလား? Fresha rule က ဆိုင်ရဲ့ intended rule လား? (OD-1; commission research §8) · 🗄 Part 5
4. ✅ *(v5: combination ဈေးဇယား + ကြာချိန်၊ branch အလိုက် — D-SVC-05)* ~~★~~ **Colour/perm ဈေးဘာကြောင့် ပြောင်းလဲ** — ဆံပင်အရှည်လား? Range ပေးမလား၊ variant လုပ်မလား? ဘယ်သူ သတ်မှတ်ခွင့်ရှိလဲ? (§3.4; OD-12) · 🗄 Part 2
5. ◐ *(v5.1: design ✅ — opening float / ပိတ်သူ / ကွာချက် = Additional Settings + permission (D-FIN-06); ကျန်တာ = တန်ဖိုး ပိုင်ရှင် ဖြည့် · v4: Cash Out + Reason Master — D-FIN-07..09)* ★ **Daily closing** — ဘယ်သူ ပိတ်လဲ? Opening float ရှိလား? ဗီရိုထဲက ထုတ်သုံးတာ (staff meal, advance) ရှိလား? Bank ထည့်တာ? လက်ခံနိုင်တဲ့ difference? (OD-6; §3.8) · 🗄 Part 7
6. ◐ *(v5.1: design ✅ — rule = Additional Settings, default OFF; ကျန်တာ = တန်ဖိုး ပိုင်ရှင် ဖြည့်)* ★ **Payroll** — basic salary က လစဉ်လား? Late/absent ဖြတ်ပုံ အတိအကျ? Tips? Cash advance? Multi-branch barber ရဲ့ basic salary ကို branch ဘယ်လိုခွဲမလဲ? (OD-4) · 🗄 Part 5
7. ✅ *(v4: V1 ထဲ ပါ — release မခွဲ, D-PLT-14)* ~~★~~ **Booking ကို go-live မှာ လိုသလား** — online 0% ဖြစ်နေတာကို owner သိလား? (§8)
8. ✅ *(v4: V1 စက္ကူ → နောက်မှသွင်း၊ V2 offline — D-VIS-13)* ~~★~~ **Internet/မီးပြတ်ရင် ဘယ်လိုလုပ်ချင်လဲ?** (§3.10)
9. ✅ *(v5.1: code ပုံစံ + public / internal + app ထဲ တောင်း / ✔ — D-PAY-04; ဘယ် code ကြိုဖန်တီး = go-live data)* ★ Standing discount code တွေ ဘာတွေလိုလဲ? ဘယ်သူ့ကို ပေးလဲ? (§3.5) · 🗄 Part 4
10. ✅ *(v5.2.7 / v5.2.8: default အကုန် OFF · "အကုန်လုံး" = company setting `dashboard.show_own_earnings_all` · "တစ်ယောက်ချင်း" = `employees.show_own_earnings` override (Part 1 v3.4); D-DSH-03 · checkout estimate line = effective flag — owner confirm ✅)* ~~★~~ Barber dashboard မှာ ကိုယ့် sale/commission ကို မြင်ရမလား? တခြားသူ့ဟာ? (OD-7)
11. ◐ *(v5.2.15 — one-sheet F6: refund = refund ရက် · returning = အရင် finished visit ရှိဖူးတဲ့ identified customer · avg / visit = service revenue ÷ service visit; custom KPI ⏭ — D-KPI-01..03)* KPI list (barber / branch) + တွက်ပုံ (OD-2) — ကျန်တာ = KPI ထပ်လိုမှ
12. ✅ *(v5.2.14 — §0.7 #6: နောက်ဆုံး finished visit ၅ ခုထဲ ၃ ခု+ — setting ၂ ခု; API P3-RULE-03)* ~~Preferred barber threshold default (OD-3)~~
13. ✅ *(v5: ပိတ်မယ် — D-LV-04)* Pending leave က booking ကို ပိတ်မလား? (OD-13; C-12) · 🗄 Part 2
14. ✅ *(v5.1: website ပဲ ၁ ခု၊ staff ကန့်သတ်မရှိ — D-BKG-09)* One-active-booking edge case — မိသားစု/သူငယ်ချင်းအတွက် booking, staff override (OD-10) · 🗄 Part 3
15. ✅ *(v5.1: Additional Settings — ဖွင့် / ပိတ် + rate, default OFF — D-PAY-08)* Tax / service charge ရှိလား? (Fresha: "Retail prices exclude tax"; rate မသိ) (OD-15) · 🗄 Part 4
16. ✅ *(v5.1: optional + ရိုက်ရလွယ် + ရယူနှုန်း % — D-VIS-02)* Walk-in customer ဆီက ဖုန်းနံပါတ် အမြဲမေးမလား? နောက်ပိုင်း loyalty လုပ်မလား? (§3.11) · 🗄 Part 4
17. ✅ *(v5: အိမ်ဈေး + ကားခ (commission မတွက်)၊ online booking ရ၊ သွားချိန် setting — D-SVC-06, D-BKG-22, D-SCH-03)* Home Service ကို ဘယ်လိုမှတ်လဲ — branch revenue ထဲလား? (§3.11) · 🗄 Part 2
18. ✅ *(v5.2.15 — one-sheet F5: master data ပဲ — customer, service + ဈေး, product, supplier, employee; history ✖; invite ✖ — D-DAT-01)* ~~Fresha ကနေ history ဘယ်လောက်ထိ ယူချင်လဲ — master data ပဲလား၊ report archive လောက်နဲ့ လုံလောက်လား? (§7 #18)~~ · ★ subscription မဖျက်ခင် Fresha export အပြည့်ကို owner က offline သိမ်း
19. ◐ *(v5.1: design ဆက် — မကြိုက်ရင် setting နဲ့ ဖြုတ်ရလွယ်)* ★ QR + GPS attendance ကို သဘောတူလား? (D-ATT-01) · 🗄 Part 5
20. ✅ *(v5.2.7: "လူအရေအတွက် မေးတာထက် လုပ်လို့ရအောင်" — device တိုင်း အလုပ်ဖြစ်ရ: receipt PDF / Share = အားလုံး၊ Print = Android · v4: counter device မထား — D-AUTH-07; print = Android ဖုန်း — D-PAY-07)* ~~★~~ Staff ဘယ်နှယောက် iPhone သုံးလဲ? Branch counter မှာ ဘာ device ထားမလဲ (Android tablet / Windows PC)? (§5.7) · 🗄 Part 1b
21. ◐ *(v5.2.13: DNS access ✅ · final domain = production release ကျမှ owner ကိုယ်တိုင် — ACT-05 / D-ARC-02)* *(v5.2.7: toggle ✅ — "owner က admin panel ကနေ ထည့်လိုက်မှ ပြပေးမှာ" → `site.show_prices` / `site.show_barbers` / `public_profile` default OFF; booking modal မှာ ဈေး + barber အမြဲ · ကျန် = ဖွင့်ချိန် data + domain (ACT-05) · v5.1: design ✅ Part 8)* ★ Website မှာ ဘာပြမလဲ — ဈေးနှုန်း ပြမလား၊ barber ပုံ/နာမည် ပြမလား၊ branch ဖွင့်ချိန်? ဘယ်သူ ပြင်ခွင့်ရှိလဲ? Domain name ရှိပြီးလား? (§5.8) · 🗄 Part 8
22. ✅ *(v5: Point တစ်ခုတည်း + နောက်မှ multi-company ဖွင့်လို့ရအောင် ပြင်ဆင် — D-ORG-03)* ~~★~~ **Company တစ်ခုတည်းပဲလား?** — နောက်မှာ တခြား brand / company ကို ဒီ system ထဲ ထည့်မယ့် အစီအစဉ် ရှိလား? မရှိရင် single-company (company row ၁ ခု) လို့ ရေးထားမယ် (F-P1-09; *29/Sep အသစ်*) · 🗄 Part 1
23. ✅ *(v5.1: အချိန်ပဲရွှေ့ရင် မူလဈေး၊ ပြောင်းဝယ်မှ ဈေးအသစ် — D-BKG-12)* **Reschedule လုပ်ရင် ဈေး** — booking ကို ရက် / အချိန် ပြောင်းတဲ့အချိန် menu ဈေး ပြောင်းနေပြီဆိုရင် မူလ booking ဈေးအတိုင်းလား၊ ဈေးအသစ်လား? (F-BK-14; *29/Sep အသစ်*) · 🗄 Part 3
24. ✅ *(v5.1: ပုံစံ စစ်တာ = Additional Settings — D-PAY-02)* **KBZPay reference** — customer ဖုန်းထဲက ဘယ်နံပါတ် (Transaction ID?) ကို ကူးမှာလဲ၊ ဂဏန်း ဘယ်နှလုံး? (D-PAY-02; Appendix C #1; *29/Sep အသစ်*) · 🗄 Part 4
25. ✅ *(v5.1: (ခ) expense reversal + မူလလ label + P&L note — D-FIN-09)* **Must-return cash out ကို နောက်လမှ ပြန်ထည့်ရင်** — ယခင်လ expense ကို ပြန်မဖျက်ဘူး (R394)၊ ပြန်ထည့်တဲ့လမှာ Cash Return ဝင်မယ် — အဲ့ Cash Return ကို အဲ့လ P&L မှာ income အဖြစ် ပြမလား၊ P&L မထိဘဲ cash + outstanding ပဲ ပြောင်းမလား? (D-FIN-09; *v4 အသစ်*) · 🗄 Part 7
26. ✅ *(v5.1: (ဂ) refund လ payroll မှာ reversal line၊ မူလ % — D-COM-04)* **Payroll finalize ပြီးမှ refund / adjustment ဖြစ်ရင်** — barber ရဲ့ commission ကို နောက်လ payroll မှာ အနုတ် line အဖြစ် ဖြတ်မလား၊ တခြားနည်းလား? (D-COM-04, REC-18; *v4 အသစ်*) · 🗄 Part 5
27. ✅ *(v5.1: ⏭ V1 မပါ + နောက်မှ ထည့်ရလွယ်အောင် ပြင်ဆင် — D-BKG-20, §6.4b)* **Waitlist ကို V1 မှာ ဆောက်မလား?** — Waitlist rule (D-BKG-20) က lock ပြီးသား၊ ဒါပေမဲ့ ChatGPT က review ရဲ့ "Release 3" label ကြောင့် DB ထဲ ချန်ခဲ့တယ်။ Release မခွဲတော့ (D-PLT-14) ဆိုတော့ V1 မှာ ပါမလား၊ နောက်မှလား? (*v4 အသစ်*) · 🗄 Part 3
28. ✅ *(v5.1: (က) B လုပ်ခွင့် — B မှတ်ပေးတဲ့ visit ပဲ — D-VIS-06 / 12)* **Conflict — ဖုန်းမပါတဲ့ barber အတွက် payment** — A ဖုန်းမပါရင် B က B ဖုန်းကနေ START / COMPLETE လုပ်ပေးမယ် (D-VIS-12)။ Payment ကိုရော B လုပ်ခွင့်ပေးမလား (Actual = A၊ Recorded by / collected by = B)၊ ဒါမှမဟုတ် P269 အတိုင်း Manager / Admin override + reason နဲ့ပဲ လုပ်မလား? (D-VIS-06, D-PLT-13; *v4 အသစ်*) · Claude အကြံ = B လုပ်ခွင့် + reason (Manager အမြဲမရှိ၊ audit ရှင်း) · 🗄 Part 4 — **Part 4 မစခင် မေး**
29. ✅ *(v5.1: option ကိုယ်တိုင်ရွေး — D-SVC-05)* **Online booking မှာ ဆိုးဆေး / perm** — customer က အရောင် / အရှည် ကိုယ်တိုင်ရွေးမလား (ဈေး + ကြာချိန် အတိအကျ) ဒါမှမဟုတ် "ဈေး X ကစ" ပဲပြပြီး ဆိုင်ရောက်မှ ရွေးမလား? (D-SVC-05; *v5 အသစ်*) · 🗄 Part 3
30. ◐ *(v5.2.16 — owner 02/Oct: **website palette ✅** `#EEEEEE` / `#000000` / `#DC5F00`, ခလုတ် အမည်း + စာဖြူ (D-UX-02, frontend v1.5 FE-VIS-01a / 01b); design reference = `point-barber/design-reference/` folder ၂ ခု; **★ ကျန် = admin panel palette** ("Admin Panel Color Pallet" ခေါင်းစဉ်အောက် တန်ဖိုး မပါလာ — neutral ဆက်) + logo ဖိုင် + ကျန် website token အဆိုပြု "OK" (REC-41) · v5.2.7: owner — "Color palette + design reference ပုံ သပ်သပ် ပေးမယ်"; theme = minimalist and clean — D-UX-05 · v5.2.8: **develop spec ထုတ်တဲ့အဆင့် (API design / OpenSpec) ရောက်မှ ပေးမယ် — Claude Code က အဲ့အချိန် တောင်း**; guideline approve blocker မဟုတ်)* **Brand colour code** — `docs/ux/admin-panel.md` §3.1 token table ထဲက `{{COLOR_…}}` တန်ဖိုး (primary, background, text, success / warning / danger, chart ၆ ရောင်) — WCAG AA contrast rule (AD-VIS-04) လိုက်ရ (D-UX-02; *v5.2.6 အသစ်*)
31. ✅ *(v5.2.7: Pyidaungsu (မြန်မာ) · admin = Manrope / Inter · website = Archivo Black (display) + Roboto (text) — D-UX-02 update)* ~~★~~ **Font family** — Myanmar / Latin / ဂဏန်း — Myanmar Unicode, weight ၂ မျိုး+, self-host licence, tabular ဂဏန်း (AD-VIS-05) (D-UX-02; *v5.2.6 အသစ်*)
32. ✅ *(v5.2.7: 0–9 · English month `01/Oct/2026` · AM/PM — ဘာသာ ၂ မျိုးလုံး · receipt = English အမြဲ · website ငွေ = `7,000 Ks` ပဲ · v5.2.8: admin app `ကျပ်` မပြောင်း — owner confirm ✅)* **မြန်မာ UI ပြပုံ** — ငွေ / ရက် / အချိန် / ဖုန်း ဂဏန်းကို 0–9 လား ၀–၉ လား? လနာမည် `Oct` လား မြန်မာလား? AM / PM လား နံနက် / ညနေ လား? Receipt ကို ဘယ်ဘာသာနဲ့ ထုတ်မလဲ (user ဘာသာ / branch setting / ၂ ဘာသာ)? Claude အကြံ = 0–9 + `Oct` + AM/PM (receipt `B3-2026-OCT-…`, KBZPay ref, ဖုန်းနဲ့ ကိုက်) (D-PLT-03/04/05, D-PAY-06; *v5.2.6 အသစ်*)
33. ✅ *(v5.2.7: (ခ) user account — `users.ui_language` → Part 1 v3.3; D-PLT-03 update)* **User ဘာသာ ရွေးတာကို ဘယ်မှာ သိမ်းမလဲ** — (က) ဖုန်း / device တစ်ခုချင်း (DB မထိ) (ခ) `users.ui_language` column ထည့် (Part 1 **v3.3** — notification / OTP email ကိုလည်း user ဘာသာနဲ့) · Claude အကြံ = (ခ) (D-PLT-03; **DB gap**; *v5.2.6 အသစ်*) · 🗄 Part 1
34. ✅ *(v5.2.8: owner "OPEN-34: OK" → အဆိုပြု ၁၀ ခု = 🔒 D-RPT-01 · v5.2.7: owner "သိပ်နားမလည်ဘူး" → ရှင်းပြချက်: ChatGPT chat မှာ "report ၁၀ ခု" လို့ lock ခဲ့ပေမဲ့ **ဘယ် ၁၀ ခုလဲ ဆိုတဲ့ နာမည်စာရင်းကို မကူးခင် chat ဖျက်မိလို့ ပျောက်သွားတယ်** — Claude Code က ကိုယ်တိုင် မတီထွင်ရ (D-PLT-11)။ ဒါကြောင့် admin guideline AD-RPT-04 မှာ 🔒 decision တွေကနေ ဆွဲထုတ်တဲ့ **အဆိုပြု ၁၀ ခု** ထည့်ထား: ① Sales summary ② Barber performance ③ Payments & KBZPay ④ Discounts & refunds ⑤ Daily closing & cash ⑥ Expenses & P&L ⑦ Commission & payroll ⑧ Attendance & leave ⑨ Bookings & customers ⑩ Stock — **owner က "OK" လို့ ပြောရုံ ဒါမှမဟုတ် နာမည် ပြင် / လဲ / ပေါင်းပေးရုံ**)* **Report ၁၀ ခု (D-RPT-01) ဘာတွေလဲ** — နာမည်စာရင်း register ထဲ မရှိ (conversation ဖျက်ပြီး)။ Decision တွေက တောင်းထားတဲ့ report — late entry, proxy payment, barber အလိုက် ဖုန်းရယူနှုန်း, discount usage, manual attendance, transfer shortfall / in-transit, must-return, P&L, commission / payroll — ကို အခြေခံပြီး ၁၀ ခု ရွေးပေးပါ (*v5.2.6 အသစ်*)
35. ✅ *(v5.2.7: Option A — toggle = info page ပဲ; booking မှာ ဈေး + barber နာမည် အမြဲ ("Booking တင်မှတော့ ဈေးပြရမှာပေါ့"); closure = ပိတ်ရက်ပဲ · **+ booking = modal / pop-up box, သီးခြား `/book` page ✖** — D-UX-05, FE-BK-00)* **Website toggle က online booking (`/book`) ကိုပါ သက်ရောက်လား** — (a) "ဈေးမပြ" (`site.show_prices` OFF) ဆိုရင် booking လုပ်တဲ့အခါလည်း ဈေးဖျောက်မလား (D-SVC-05 က option ရွေးရင် ဈေးအတိအကျ ပြခိုင်း)? (b) Barber public profile OFF (default) ဆိုရင် booking မှာ customer က barber ရွေးရမှာ (D-BKG-05) — နာမည်ပဲ ပြမလား? · Claude အကြံ = toggle = info page ပဲ; `/book` မှာ ဈေး + barber နာမည် အမြဲ၊ ပုံ / specialty = profile ON မှ (c) ဆိုင်ခွဲ ယာယီပိတ်ချိန် (ဥပမာ သင်္ကြန်) — online booking မှာ အဲ့ branch ကို ပိတ်ကာလ တစ်ခုလုံး ရွေးမရ လား၊ ပိတ်ရက်တွေပဲ ရွေးမရ လား? (D-WEB-01, D-WEB-04, D-SVC-05, D-BKG-05; *v5.2.6 အသစ်*)
36. ✅ *(v5.2.7: (ခ) service + product line နှစ်မျိုးလုံး ဈေးအချိုး — ညှပ်ခ 9,000 / ဆေး 4,500; commission base = service line 9,000 — D-PAY-04 update)* **Discount ကို ဘယ် line တွေဆီ ခွဲမလဲ** — sale တစ်ခုမှာ ညှပ်ခ 10,000 + ဆံပင်လိမ်းဆေး 5,000 ရှိပြီး 10% (1,500) လျှော့ရင် — (က) service line ပေါ်ပဲ (D-PAY-04 စာသားအတိုင်း → ညှပ်ခ 8,500၊ ဆေး 5,000 → commission base နည်း) (ခ) line အကုန် ဈေးအချိုး (ညှပ်ခ 9,000၊ ဆေး 4,500)? (D-PAY-04, D-COM-02; *v5.2.6 အသစ်*) · 🗄 Part 4 (DB မပြောင်း — app logic)
37. ✅ *(v5.2.8: owner — "လောလောဆယ် ADMIN, Manager ကပေးတဲ့ rating ပဲ; V2 မှာ customer rating" → (ခ) `employees.public_rating` (Part 1 v3.4), website "Point rating" caption; D-UX-05 update)* **Website barber card မှာ "Rating"** — owner က Our barbers card မှာ current branch + rating + description ပါစေချင်တယ် (01/Oct)။ Current branch နဲ့ description က ရှိပြီးသား data (ဒီနေ့ shift · `public_specialty`) နဲ့ ရတယ်; **rating ကတော့ DB မှာ review / rating table မရှိ၊ V1 scope မှာလည်း မပါ** (reviews & ratings ⏭)။ ရွေးပါ — (က) admin က ရိုက်ထည့်တဲ့ **ရိုးသားတဲ့ label** (ဥပမာ "Senior barber · 8 yrs" / level) → Part 1 column ၁ ခု (ခ) admin က ရိုက်ထည့်တဲ့ ★ star (⚠️ Claude အကြံ = **မသင့်** — customer ဆီက မလာတဲ့ star ကို customer က review လို့ ထင်မယ်; website honesty rule FE-COPY-03) (ဂ) customer ဆီက **တကယ် rating** ယူတဲ့ system = V2 (decision + DB table အသစ်) · Claude အကြံ = (က) အခု၊ (ဂ) နောက်မှ · default = rating row မထည့် (D-UX-05, D-PLT-11; *v5.2.7 အသစ်*) · 🗄 Part 1 ((က) ဆိုရင်)
38. ✅ *(v5.2.13 — owner 01/Oct 21:20: ADR-002 … 009 Accepted · RPO daily · provider = Resend Free / HetrixTools Free (Email + Telegram) / Sentry Developer · ADR-011 permission CRUD — D-ARC-01 / 02)* ~~★~~ **Architecture ADR ၈ ခု — "OK" / ✖** — ADR-002 pg-boss · 003 Capacitor · 004 booking idempotency = client token (owner "server / DB ဘယ်ဟာ ပိုကောင်းလဲ" → A — အကြောင်းရင်း §11.5 / ADR-004) · 005 CSRF · 006 website SSR + revalidate · 007 monitoring + email (★ account ၃ ခု owner ပိုင်, alert email / ဖုန်း) · 008 Socket.IO · 009 single origin `/api` · + ⚠️ RPO < 24 နာရီ လို / မလို (WAL archiving) (§12, D-ARC-01; *v5.2.10 အသစ်*)
39. ✅ *(v5.2.13 — owner 01/Oct 21:20 "အကုန် OK" → 🔒 D-API-03 + D-DB-06 v1.3)* *(v5.2.12: §0.6 sheet #16–24 — နောက် chat မှာ ဖြေ)* **API Part 2 owner items ၁၀ — "OK" / ✖** (§11.6 table; Part 2 §16) — buffer ပေါင်း · ပိတ်ရက် staff booking ✖ · approved ခွင့် cancel = `leave.approve` · self-approval ✖ · option group ≤ 2 · walk-in visit ပိတ်ချိန် · ★ go-live data · နောက်ဆုံး slot buffer · AD-SCH-01 copy · **DB Part 2 v1.3 `archived_at` confirm** (D-API-03, D-DB-06; *v5.2.11 အသစ်*)
40. ✅ *(v5.2.16 — owner 02/Oct 08:24 **"OPEN-40 OK"** → (a) B · (b) B · (c) A — DB Part 5 v1.2 + Part 7 v1.2 (test ၃၉၃ PASS), API Part 5 / 6 / 7 v1.1; §0.9, §6.4j, §11.10)* **OPEN-40 — 🔒 D-DAT-05 (hard delete ✖) နဲ့ ဆန့်ကျင်တာ ၃ နေရာ** (§0.9 ဇယား): (a) payroll reopen မှာ လစာ expense row — **အကြံပြု B** ("ဖျက်ပြီး" အမှတ်နဲ့ ထား — DB Part 7 v1.2) (b) မှားထည့် + မသုံးရသေး လစာ row / commission plan ချိတ်တာ — **အကြံပြု B** (`archived_at` — DB Part 5 v1.2; Part 2 v1.3 ပုံစံတူ) (c) draft purchase / transfer line — **အကြံပြု A** (A2 အတိုင်း ဖျက် + audit) — အကြံပြုချက်အတိုင်း ဆို **"OPEN-40 OK"**
41. ✅ *(v5.2.17 — owner 02/Oct 13:08 **"မေးခွန်းအကုန်လုံး OK — Default အတိုင်း"** → S1–S18 အကုန် default; API Part 0 / 1 v1.6 · Part 4 v1.1 · admin v1.7 / frontend v1.6 · change ၄ ခု apply လုပ်လို့ရပြီ; §0.11, §11.11, §12.12)* **OPEN-41 — spec ရေးရင်း တွေ့တဲ့ မေးခွန်း, sheet 3** (§0.11 ဇယား — ၁၈ ချက်): **S1** schedule — ခန့်မှန်း ~၂၃၀–၂၅၅ developer-ရက် vs "တစ်လ" (အကြံပြု (က): "တစ်လ" = pilot slice ပစ်မှတ်၊ V1 ရက်ကို velocity သိမှ) · **S2** ပထမ change ၄ ခုရဲ့ အရွယ် (အကြံပြု (A): ဒီအတိုင်း၊ PR ခွဲ merge) · **S3** capability ၂ ခု ထပ် OK · **S4** HTTP 500 `code` = `internal_error` · **S5** field-level code = Zod နာမည် + `email_invalid` / `otp_format` · **S6** ပထမ admin = server ပေါ်က operator command (admin မရှိသေးခင်ပဲ ရ) · **S7** "Frequent here" = catalogue အစဉ် (V1) · **S8** reason field = Part 4 ပုံစံ, API-DATA-11 ညှိ · **S9** code စစ်တာ ၁၀ / နာရီ / IP ထည့် · **S10** lock အဖြေ = စာသားအတိုင်း · **S11** archive row = audit log မှာပဲ · **S12** scope ပြင်ပ = `forbidden` (part က နာမည်ပေးထားမှ `out_of_scope`) · **S13** `permission.sync` · **S14** ထပ် login → session အဟောင်း ပိတ် · **S15** focus ring = စာအရောင်, input border = muted စာအရောင် (palette မရခင်) · **S16** pilot မတိုင်ခင် server + pilot data + late entry · **S17** `correction_path` မပါ (rule မပေးတဲ့ case) · **S18** အဆိုပြုစာသားနဲ့ စ၊ owner က brief / PR မှာ ပြင် — default အတိုင်းဆို **"အကုန် OK"** (S1 / S2 / S16 စဉ်းစားပေးရန်) + (B) မှတ်တမ်း R1–R14 + (C) ပေးရန် (ACT-09 · GitHub plan · REC-41 · REC-42 · admin palette · design reference · logo · pilot data · Google OAuth client)

---

## Appendix C — Owner login နဲ့ Fresha မှာ ထပ်စစ်ရန်

> `fresha-live-findings.md` §6, §13 နဲ့ `fresha-commission-research.md` §7 ကနေ စုထားတာ (#10 က ဒီ review ရဲ့ ထပ်ဖြည့်ချက်)။ #4, #5, #9 တချို့က owner login မလိုဘဲ မဖွင့်ရသေးတဲ့ screen ("N") ပဲ ဖြစ်နိုင်တယ်။ **Read-only ပဲ**။ Implementation ကို ဒီအတွက် မစောင့်ပါနဲ့။

| # | စစ်ရန် | ဘာအတွက်လဲ |
| --- | --- | --- |
| 1 | Settings → Payment methods ("K pay" details, တခြား custom method) | D-PAY-01/02 |
| 2 | Settings → Sales: tax rates, receipt sequencing (error အကြောင်းရင်း), service charges | D-PAY-08, receipt numbering |
| 3 | Commission summary / activity report (actual amount, date basis, branch threshold) | D-COM-01, C-2 |
| 4 | Settings → Team → Commissions (workspace defaults) | D-COM-02 |
| 5 | Pay runs, wages, pay summary, working hours reports | D-PAYR-*, owner Q3/Q6 |
| 6 | Barber တစ်ယောက်ချင်း roster + assigned branches | Multi-branch schedule, allocation |
| 7 | Role permissions (အထူးသဖြင့် custom "MASTER") | Role seed |
| 8 | Automated message channels (SMS/email/WhatsApp) + balance | D-CUS-05 ကို confirm |
| 9 | Service edit form (per-member price, service cost) | D-SVC-03, commission cost deduction |
| 10 | Cash register / discount settings (permission) | §3.5, §3.8 |
| 11 | Payment detail တစ်ခုဖွင့်ပြီး "Team member" column ရဲ့ အဓိပ္ပာယ် (ငွေယူသူလား၊ ညှပ်သူလား) | §3.3 `collected_by` (commission §7 — INFERRED ပဲ ရှိသေး) |

---

*ဒီ review ရဲ့ ကိန်းဂဏန်းအားလုံးက `fresha-research` repo (commit `7137637`) နဲ့ conversation export (P1–P397) ထဲက ဖြစ်တယ်။ Fresha data က 28/Sep/2026 အချိန်အထိပဲ။ UI/UX guideline ရဲ့ Laws of UX = lawsofux.com (30/Sep/2026 စစ်)။ Coding guideline ရဲ့ reference (Google TS Style Guide · Twelve-Factor · OWASP ASVS · Conventional Commits …) = 02/Oct/2026 စစ်; OpenSpec CLI = 1.14.0 (02/Oct/2026)။ နောက်ဆုံး update: **v5.2.18 — 02/Oct/2026 14:50** — owner "Ok ပါတယ်" (13:46) → ✅ REC-41 (website ကျန် colour token 🔒 — frontend v1.7) · ✅ REC-42 (coding guideline v1.0 APPROVED) · ကျန် ★ OPEN-30 admin palette · ✋ ACT-09 · **NEXT = push → `/opsx:apply add-repo-scaffold`** · v5.2.17 — 02/Oct/2026 14:30 — owner sheet 3 (§0.11) "မေးခွန်းအကုန်လုံး OK — Default အတိုင်း" (13:08) → OPEN-41 ✅ · API Part 0 / 1 v1.6 · Part 4 v1.1 · admin v1.7 / frontend v1.6 · capability ၂၅ 🔒 · change ၄ ခု apply လုပ်လို့ရပြီ · dev plan v1.1 (လုပ်ပုံ = Claude Code ရေး / developer စစ်) · ကျန် ⚠️ REC-41 / 42 · ✋ ACT-09 · **NEXT = push → `/opsx:apply add-repo-scaffold`** · v5.2.16 — 02/Oct/2026 13:00 — owner "OPEN-40 OK" + OpenSpec question sheet ၂ ခု (§0.10) → 🔒 D-PLT-20 · D-ARC-03 (ADR-016 repo ၂ ခု) · D-ENG-01 / 02 · D-UX-02 (website palette) · DB Part 5 v1.2 / Part 7 v1.2 (test ၃၉၃) · API Part 5 / 6 / 7 v1.1 · system design v1.4 · admin v1.6 / frontend v1.5 · OpenSpec change ၄ ခု + brief · coding guideline Draft v1.0 · dev plan + roadmap · 🟡 OPEN-41 (§0.11) · ⚠️ REC-41 / 42 · ✋ ACT-09 · **NEXT = §0.11 ဖြေ → apply** · v5.2.15 — 02/Oct/2026 04:10 — API design ပြီး (Part 0–8 🔒) · DB G (test ၃၅၅) · ADR-013 / 014 / 015 · 🟡 OPEN-40 · v5.2.13 / v5.2.14 — 01/Oct/2026 21:20 / 23:30 (§0.6 / §0.7 lock batch) · **v5.2.12 — 01/Oct/2026 15:22 (SAVE POINT)** — 🔒 D-PLT-19 workflow (မေးခွန်း sheet အရင် → အကုန် ဖြေမှ ဖိုင် → API + architecture တစ်ခါတည်း) · **§0.6 owner decision sheet ၂၄ ချက် + ★ ၆** (Part 0 / 1 #1–8 · ADR #9–15 · Part 2 #16–24) · ဖိုင် မပြောင်း — bundle zip · **NEXT = နောက် chat: owner §0.6 ဖြေ → Claude တစ်ခါတည်း lock + ထုတ် → Part 3** · v5.2.11 — 01/Oct/2026 13:00 — **API Part 2 Catalogue & Scheduling draft v1.1** (endpoint ၅၀ · permission code ၇ · P2-RULE-01..12 · availability function · price quote · OpenAPI validate ✅ · independent review ၁၈ + verification ၅ ပြင်ပြီး) · ⚠️ **DB Part 2 v1.3** (`archived_at` × 2 — PostgreSQL 16 test ✅, zip v5) · API = Part 0 + 1–8 (ဖိုင် ၉) · §11.6 / A.18 D-API-03 / A.16 D-DB-06 / OPEN-39 / Appendix B #39 · **NEXT = owner: Part 0 / 1 ၁၀ + ADR ၈ + Part 2 ၁၀ + DB v1.3 → lock → Part 3** · v5.2.10 — 01/Oct/2026 11:54 — **owner API အဖြေ ၃ ချက်** (idempotency "server / DB" → A client token အကြံပြု ADR-004 · manager rights = admin permission adjust → granular code ၁၄ ADR-010 Accepted · 14 ရက် window = staff ပါ → 🔒 D-BKG-06 update) · **API Part 0 / 1 v1.2** (v1.1 = API-PERM-06, API-SHAPE-01 single origin, P1-RULE-11 · v1.2 = independent review fix: Google login hand-off P1.AUTH.06, cookie host-only + Max-Age, P1-RULE-12 company admin, `GET /v1/system/jobs`, Socket.IO path, edge rules — endpoint ၅၂, code ၁၃; OpenAPI validate ✅) · **System design review v1.0** (`docs/architecture/system-design.md`) + **ADR-001..010** (`docs/adr/` — Accepted ၂ · Proposed ၈) · **independent reviewer ၂၄ ချက် (HIGH ၄) အကုန် ပြင်ပြီး — §12.6** · §11.5 / §12 / A.18 / A.19 / OPEN-38 / Appendix B #38 · **NEXT = owner: ADR ၈ + API ကျန် ၁၀ ချက် → lock → Part 2** · v5.2.9 — 01/Oct/2026 11:09 — **UI/UX guideline v1.2 ၂ ဖိုင် 🔒 APPROVED (D-UX-03 / 04, REC-39 / 40 ✅)** · **API design (D-PLT-18 #2) စ — Part 0 convention + module map (resource ~၇၀) · Part 1 Foundation & Access (endpoint ၅၀, OpenAPI 3.1 validate ✅) draft → ⚠️ D-API-01 / 02 owner lock (§11.3 မေးခွန်း ၁၁)** · §11 အသစ် · A.18 · **NEXT = Part 0 / 1 lock → Part 2** · v5.2.8 — 01/Oct/2026 10:47 — **owner ဒုတိယအကြိမ် အဖြေ ၆ ချက် → admin v1.2 + frontend v1.2 (§10.10)** · ✅ OPEN-34 (🔒 D-RPT-01 report ၁၀ ခု) · ✅ OPEN-37 (rating = admin / manager; V2 customer) · ✅ confirm ၂ ချက် (estimate gating = "အကုန် / တစ်ယောက်ချင်း" · app `ကျပ်`) · 🔒 D-BKG-23 (lead time 0) · DB Part 1 v3.4 (`show_own_earnings` nullable + `public_rating`, zip v4) · OPEN-30 = spec အဆင့် · **NEXT = guideline v1.2 approve → API design** · v5.2.7 — 01/Oct/2026 မနက် — **owner guideline အဖြေ ၁၆ ချက် → admin v1.1 + frontend v1.1 (§10.9)** · ✅ OPEN-10, 20, 21 (toggle), 31, 32, 33, 35, 36 · 🔒 D-UX-05 (booking modal, barber direct booking card, minimalist theme, Motion + GSAP, TikTok) · D-UX-02 font ✅ · D-PAY-04 / D-PLT-03 / D-PLT-05 / D-PAY-06 / D-DSH-03 / D-WEB-01 update · **DB Part 1 v3.3** (`users.ui_language`, `employees.show_own_earnings` — PostgreSQL 16 load + regression PASS) · 🟡 OPEN-37 (rating) · ⚠️ confirm ၂ ချက် (D-COM-04 estimate gating · D-PLT-04 `ကျပ်` / `Ks`) · ❓ "50" · **NEXT = owner ကျန်တာ (OPEN-30 palette / design ref, OPEN-34 confirm, OPEN-37, confirm ၂ ချက်) → approve → API design** · v5.2.6 — 01/Oct/2026 — **UI/UX guideline ၂ ဖိုင် draft v1.0 (§10 — `docs/ux/frontend-website.md` FE-… + `docs/ux/admin-panel.md` AD-…)** · D-UX-01 / 02 · D-PLT-18 (UI/UX → API → Code) · OPEN-30..36 (colour, font, မြန်မာ ပြပုံ, user ဘာသာ DB gap, report ၁၀ ခု, website toggle / closure vs `/book`, discount ခွဲပုံ) · REC-39 / 40 · ACT-06 / 07 · A.17 · Appendix B #30–#36 · **NEXT = guideline owner review → API design** · v5.1 — 30/Sep/2026 (မနက် → နေ့လယ် ၁ နာရီ) — **DB design Part 1–8 အကုန် 🔒 (table ၉၁ · test ၂၉၆) · NEXT = dev plan + OpenSpec** · OPEN-27 waitlist ⏭ + ပြင်ဆင်ချက် (§6.4b), OPEN-14 (D-BKG-09), OPEN-23 (D-BKG-12), OPEN-29 (D-SVC-05), **DB Part 3 🔒 (D-DB-07, §6.4c)**, OPEN-28 (D-VIS-06 / 12), OPEN-01 (D-VIS-13), OPEN-16 + REC-12 (D-VIS-02), REC-11 (D-PAY-02), REC-25 (D-PAY-06), OPEN-15 / 24 (Additional Settings), OPEN-09 (D-PAY-04), **DB Part 4 🔒 (D-DB-08, §6.4d)**, OPEN-03 A (D-COM-01), OPEN-06 A (D-PAYR-05 / 08), OPEN-19 (D-ATT-01), OPEN-26 (D-COM-04), **DB Part 5 🔒 (D-DB-09, §6.4e)**, Part 2 v1.1 (diagram ref), REC-14 (D-STK-03), **DB Part 6 🔒 (D-DB-10, §6.4f)**, OPEN-05 A (D-FIN-06), OPEN-25 (D-FIN-09), **DB Part 7 🔒 (D-DB-11, §6.4g)**, Part 4 / 5 constraints v1.1 (NULL audit), Part 6 v1.1, **Part 8 🔒 (D-DB-12, §6.4h) — DB design ပြီး, table ၉၁, test ၂၉၆**, D-PLT-16 / 17 · v5 (30/Sep) — DB Part 1 / 1b / 2 🔒 (§6.3–§6.3c + `db/`)၊ ⏩ OPEN / REC၊ §0, §3.0, §6.2, §9, Appendix A / B · v4 (29/Sep ည) — risk walkthrough (§3.12)။*
