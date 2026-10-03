# Development plan — Point Barbershop V1

> **File:** `docs/plan/dev-plan.md` (repo `point-sdd`) · **Version:** v1.1 · **Date:** 02/Oct/2026 (review v5.2.18 — owner sheet 3 answered 13:08: S1 schedule target, S2 size, S16 pilot prerequisites; working mode added; REC-41 / REC-42 approved 13:46)
> **Built on:** 🔒 D-PLT-14 (two developers + Claude Code, V1 = every locked decision, no release split, target
> one month) · 🔒 D-PLT-17 / D-PLT-20 (spec-driven with OpenSpec; one change = one form / topic) · 🔒 D-PLT-18
> (UI/UX guideline → API → code) · 🔒 D-ARC-03 / ADR-016 (two repositories) · 🔒 D-ENG-01 (tooling) ·
> the owner's answers of 02/Oct/2026 (review §0.10).
> **Companions:** `roadmap.md` (the change list) · `spec-fixtures.md` (test data) ·
> `../SDD-Workflow-Guide-MM.md` (step-by-step workflow) · `point-barber/docs/engineering/coding-guideline.md`.
> **Status:** every section describes what is decided. §6 = the owner's schedule decision (S1) and the working mode; its figures are estimates until the first week is measured.

## မြန်မာ အတိုချုပ်

- **လူ:** Dev 1 = website + admin panel · Dev 2 = admin panel · နှစ်ယောက်လုံး Claude Code သုံး။ Change တစ်ခုကို
  developer တစ်ယောက်က API + database migration + screen အပြည့် လုပ်တယ် (အလျားလိုက် မခွဲ)။
- **စမယ့်အချိန်:** owner က မေးခွန်း sheet (review §0.11) ကို 02/Oct 13:08 မှာ ဖြေပြီးပြီ — **အခု စလို့ရပြီ**။ ပထမ
  `add-repo-scaffold` ကို နှစ်ယောက် တွဲလုပ်၊ ပြီးရင် Dev 1 = shared UI၊ Dev 2 = login / permission ပြိုင်တူ၊ ပြီးမှ Dev 2 = walk-in → receipt
  (Dev 1 က review)။ မေးခွန်း ကျန်နေတဲ့ change ကို code မစရ (D-PLT-13)။
- **Repo ၂ ခု:** spec = `point-sdd`၊ code = `point-barber`။ Spec မရှိရင် code မရေးရ။ DB / API ပြောင်းချင်ရင်
  `point-sdd` မှာ အရင်ပြင်။
- **ဖိုင် မတိုက်အောင်:** module တစ်ခုကို တစ်ယောက်ပဲ ပိုင်; မျှသုံးဖိုင် (ဘာသာစကားဖိုင်၊ permission စာရင်း၊ migration) အတွက်
  စည်းမျဉ်း §4 မှာ။
- **Pilot:** ပထမ ၄ ခု + server တင် (`add-staging-deploy`) + pilot branch ရဲ့ တကယ့် data (`add-pilot-data-seed`) +
  နောက်မှ ပြန်ထည့် (`add-late-entry`) ပြီးမှ barber ၃–၅ ယောက်၊ ဆိုင်ခွဲ ၁ ခုမှာ တကယ့် customer နဲ့ စမ်း — browser +
  Google login နဲ့ပဲ။
- **အချိန် (owner S1):** "တစ်လ" = **pilot အထိ** ပစ်မှတ်; V1 အပြည့်ရက်ကို ပထမအပတ် အမြန်နှုန်း တိုင်းပြီးမှ သတ်မှတ်။
  **လုပ်ပုံ:** Claude Code က ရေး၊ developer ၂ ယောက်က စစ် — ခန့်မှန်း V1 အကုန် ~၁ လခွဲ–၂ လခွဲ (သေချာစစ်ရင်)၊
  ပေါ့ပေါ့စစ်ရင် ~၃–၄ ပတ် (§6)။ ငွေ / permission / စာရင်းပိတ် အပိုင်းကိုတော့ သေချာစစ်ရမယ်။

## 1. People and roles

| Role | Who | Does |
|---|---|---|
| Owner | Point Barbershop | answers question sheets, approves specs that carry an open question, supplies values (palette, logo, go-live data), accepts the pilot |
| Spec writer | spec-hub maintainer | briefs (`docs/briefs/`), reviews proposals and test cases, confirms NG fixes, keeps the review + register current |
| Dev 1 | website + admin panel | shared UI, catalogue / prices, schedule / leave, customers, booking, website, half of inventory and reports |
| Dev 2 | admin panel | scaffold lead, login / access, POS / sales / payments, discounts / refunds, closing / finance, commission / payroll, shells, deploy |
| Claude Code | both developers' tool | `/opsx:propose` in point-sdd, `/opsx:apply` in point-barber, test-case generation, browser testing — under `CLAUDE.md` of each repo |

Each change has **one** owner who does API + migration + screen + tests end to end (vertical). The other
developer is its reviewer. The roadmap names the owner of every change.

## 2. One change, start to finish

| Step | Where | Who | Output | Gate |
|---|---|---|---|---|
| 1 Brief | point-sdd `docs/briefs/<id>.md` | spec writer (or the change owner) | goal, rules, scenarios, form field tables | developer reads it |
| 2 Explore / propose | point-sdd — `/opsx:explore`, `/opsx:propose` | change owner + Claude | `openspec/changes/<id>/` | `openspec validate <id> --strict` |
| 3 Spec review | point-sdd | spec writer + both devs (+ owner when "Open questions" is not empty) | commit `proposal: <id>` | **no open question left** (D-PLT-13) — otherwise the change is not applied at all |
| 4 Apply | point-barber — branch `feature/<id>` (or `feature/<id>/<part>` per pull request), `/opsx:apply <id>` | change owner + Claude | code + tests, tasks ticked | lint · typecheck · unit · integration · e2e · guards green |
| 5 PR + review | point-barber | reviewer = the other developer | PR `<type>(<id>): <subject>`, description with `Spec:` + IDs | CI green, one human approval — **not merged yet** |
| 6 Test cases | point-sdd — `/point-generate-tests <id>` | change owner, reviewed by the spec writer | `temp_tests.json` → workbook | reviewed JSON committed |
| 7 Test | manual or `/point-browser-tester` against the branch's test environment | tester (anyone but the author when possible) | OK / NG + evidence | every case run |
| 8 NG fix | point-barber, same branch | change owner | fix → retest → confirmed date in the NG report | **no open NG** |
| 9 Merge | point-barber | change owner | squash merge | steps 5–8 done |
| 10 Archive | point-sdd — `/opsx:archive <id>` | change owner | `openspec/specs/` updated, commit `archive: <id>` | roadmap row marked done |

One order everywhere — this table, `SDD-Workflow-Guide-MM.md` §11 and the coding guideline §23 / CG-GIT-05:
the workbook is generated and run **before** the change's final merge. When a change is delivered in several
pull requests, the earlier ones merge on CI green + review (steps 4, 5, 9); the **last** pull request stays
open while the test cases are generated and run on its branch, takes the NG fixes, and merges when no NG is
open; then the change is archived. (`add-shared-ui-components` additionally runs its catalogue cases per pull
request — its own tasks say so.)

If code needs behaviour the spec does not state: stop → fix brief + spec in point-sdd → review → continue.
A design fact (table, endpoint, UX rule, ADR) changes in point-sdd first, with its version bump and register
note, then in code.

## 3. Order

1. **`add-repo-scaffold`** — both developers, split by path (Dev 2: API, database, infrastructure, CI ·
   Dev 1: web app, `packages/ui`, `packages/i18n`, Claude hook). Its PR-A (root tooling) merges first.
2. In parallel: **`add-shared-ui-components`** (Dev 1, three PRs) and **`add-foundation-auth-access`**
   (Dev 2, three PRs). The login screen needs PR 1 of the UI change; shared files follow §4.
3. **`add-walkin-visit-checkout`** — Dev 2 end to end (API, receipt pipeline, screens, e2e); Dev 1 reviews and
   meanwhile starts wave 1 on their own side.
4. Top of wave 1: `add-ci-guard-rails`, then the three **pilot prerequisites** — `add-staging-deploy`,
   `add-pilot-data-seed`, `add-late-entry`.
5. **Pilot gate** — 3–5 barbers, one branch, their own phones, real walk-ins (REC-03, AD-QA-04), signed in with
   Google in the browser tab. Measure taps and seconds (AD-GOAL-01). An outage is written on paper and entered
   with Late entry (D-VIS-13). Fix findings before building on top.
6. The rest of waves 1–4 of `roadmap.md`. Rule of thumb for picking the next change: (a) what unblocks the most rows,
   (b) money correctness before convenience, (c) each developer stays in their own modules.

The critical path to a usable shop day: wave 0 → employee + role forms → schedule → cash outs → expenses and
incomes → daily closing. Online booking and the public website depend on prices, schedule and availability and come last
on Dev 1's side.

## 4. Two developers, one codebase — collision rules

| Shared thing | Rule |
|---|---|
| A NestJS module / a Next.js route folder | one owner per change (roadmap); the other developer does not edit it in the same days. Cross-module calls go through the module's `index.ts` service (ADR-001 rule 1, CG-ARCH-02) |
| `packages/shared` constants, `permissions.json`, `settings.json` | "first merge creates, second imports": append-only edits, one entry per line, sorted — merge conflicts stay trivial; codes are never renamed after deploy (D-ROLE-08) |
| Language files `my` / `en` | one namespace per feature area, keys added only by the change that owns the namespace; the i18n check fails CI on a missing key in either file |
| Database migrations | one linear stream. Schema is complete from the baseline (91 tables), so feature changes rarely add a migration; when one is needed (a `docs/db` version bump), the author announces it, rebases on `main` right before merging, and never edits an applied migration (CG-DB-02) |
| Seed fixtures | numbered fixture modules per change; a change adds its own module, never edits another's rows; `spec-fixtures.md` is the source |
| Shared UI components | change the component in its own small PR first, then use it — never fork a copy inside a feature |
| `main` | protected (on private repositories GitHub enforces required checks only on a paid plan — §8); rebase daily; a PR waits at most one working day for review |
| Spec repo | never two people on the same change folder at once; `git pull` before every push |

## 5. Environments

| Environment | What runs | Sign-in | Data |
|---|---|---|---|
| Local | `docker compose` (Caddy, API, web, PostgreSQL 16) + dev file (Mailpit, MinIO) on `app.point.test` / `point.test` | e-mail code from Mailpit; Google with a developer OAuth client | `pnpm db:seed` fixtures only |
| CI (GitHub Actions) | format, lint, typecheck, unit, DB constraint tests, integration on PostgreSQL 16, image build, Playwright smoke | e-mail code from Mailpit | fixtures |
| Pilot / staging (`add-staging-deploy`) | the production Compose stack on the VPS | **Google only** until the domain is verified at Resend (D-ARC-02) | real staff accounts and real walk-in customers of the pilot branch (`add-pilot-data-seed`); no Fresha import yet |
| Production | same stack, owner's domain, bucket, backups, monitoring (ADR-002 / 007 / 014) | Google + e-mail code | go-live data (review §0.4 #11) |

The browser tester and Playwright never run against production.

## 6. Schedule — target, working mode, and how it is measured

**🔒 Owner decision (review §0.11 S1, 02/Oct/2026 13:08):** "one month" (D-PLT-14) is the target for the
**pilot slice** — the four wave-0 changes plus the three pilot prerequisites (`add-staging-deploy`,
`add-pilot-data-seed`, `add-late-entry`). The date for full V1 is set **after the first week's measured
velocity**. Scope (every 🔒 decision) and "no release split" are unchanged.

**Working mode (owner, 02/Oct/2026 13:07):** Claude Code writes the code; the two developers review, test and
decide. The limit is therefore not typing speed but how fast two people can check.

The numbers below are estimates made before any real velocity is known — not measurements.

| Mode | Human time per ordinary change | All of V1 (two developers) |
|---|---|---|
| A developer writes each task with Claude Code's help — the first estimate: 504 tasks in wave 0 (94 + 169 + 96 + 145) at about 0.6–1 hour each ≈ 40–65 developer-days, plus 76 roadmap rows (19 S × 1 + 47 M × 2.5 + 10 L × 5 ≈ 190 days) | 1–3 days | about 5½–6 months |
| **Claude Code writes; developers check carefully** (the working mode) | ½–1 day | about **1½–2½ months** |
| Claude Code writes; developers check lightly | 2–3 hours | about 3–4 weeks |

What the "½–1 day" holds for one ordinary change (one form or topic): read the spec and answer its questions
(~1 h) · answer Claude Code when it stops (~1 h — the run itself takes 2–5 hours and needs no one watching) ·
read the pull request (1–2 h) · run the 20–30 case workbook and look at the NGs (1–2 h) · NG fix and retest
(~1 h).

What does not shrink:

- **The owner's answers.** The first four changes alone raised 18 questions; a change with an unanswered
  question is not applied (D-PLT-13).
- **The pilot** — real barbers need about a week of real use.
- **Devices** — the Android shell, the Bluetooth receipt printer, iPhone behaviour.
- **Outside work** — server, domain, Google OAuth client, go-live data.

Where checking stays careful whatever the mode: **money, permissions and daily closing** (coding guideline
CG-REVIEW-01..04). The evidence is this batch itself: the four specs were written in hours, and four
independent reviewers then found 174 defects in them, 14 of them serious.

The load is not even yet: by the owners named in the roadmap, Dev 2's rows after wave 0 add up to about 105
days of the first estimate and Dev 1's to about 81. Rows are moved between the developers when the briefs are
written (reports, inventory and data tools are the candidates); otherwise Dev 2's queue sets the end date.

**How it is measured.** From `add-repo-scaffold` on, each change records in its last pull request: human
hours spent (spec, review, test, NG fixes) and calendar days from apply to merge. After the first week the two
numbers replace the estimates above, and the owner sets the V1 date.

## 7. Definition of done for a change

- [ ] No open question in the proposal; `openspec validate <id> --strict` passes.
- [ ] Every requirement scenario has a test that carries its name (CG-TEST-07); tests first for money,
      permission and date-boundary rules.
- [ ] CI green: format, lint, typecheck, unit, integration (PostgreSQL 16), e2e, guards (each check from the
      day the change that builds it has delivered it — coding guideline §24).
- [ ] Screens pass AD-QA-01 / FE-QA-01: Myanmar and English at 320 / 360 / 768 / 1280 px, all states, no
      enabled control that can 403, money submits cannot double-submit.
- [ ] PR reviewed and approved: `Spec:` link, decision IDs, rule IDs (`AD-…` / `FE-…` / `CG-…`), screenshots
      with fixture data only.
- [ ] Test workbook generated, executed, **no open NG**; review JSON committed.
- [ ] Merged (squash) — after the four points above.
- [ ] Archived; roadmap row updated; register / review updated if a locked source changed.

## 8. What the owner supplies, and when

| Item | Needed for | Latest |
|---|---|---|
| ~~Answers to the spec question sheet (review §0.11)~~ | applying the four changes | ✅ answered 02/Oct/2026 13:08 (all defaults) |
| Both GitHub repositories set to private (ACT-09) | pushing the planning sources and design references | before the first push of this batch |
| A GitHub plan that enforces branch protection and required checks on private repositories (the two repositories sit under two personal accounts — coding guideline OPEN-CG-06) | `main` protected: pull request only, CI green, one approval | before the first feature PR (until then the rule is kept by hand) |
| ~~Coding guideline approval (REC-42)~~ | making its ⚠️ rules binding | ✅ approved 02/Oct/2026 13:46 |
| Design reference images + their index rows | screens of `add-walkin-visit-checkout`, later every screen | before the screen task groups |
| Admin panel palette (★ OPEN-30) | final look of the staff app; its focus ring / input border / status colours | before the pilot looks final (not a build blocker) |
| ~~Approval of the remaining website tokens (REC-41)~~ | website colours | ✅ approved 02/Oct/2026 13:46 — built in `add-shared-ui-components` |
| Logo, app icon | login screen, receipt header, PWA / shell icons | pilot |
| Google OAuth client + a host name for the pilot server | Google sign-in in the pilot (D-ARC-02) | `add-staging-deploy` |
| Ops accounts — Resend, HetrixTools, Sentry (ACT-08); bucket provider R2 or B2 (ADR-014) | deploy, receipts storage, monitoring | `add-staging-deploy` |
| First admin's e-mail, name and employee code per environment | the operator command that creates the first admin (API P1-RULE-14 — owner S6) | pilot |
| Pilot data — the pilot branch, its barbers' Google addresses and role, services, prices, the real KBZPay reference pattern | `add-pilot-data-seed` | before the pilot |
| Go-live data — pay plans, deduction values, opening float, products / suppliers, opening hours, KBZPay reference pattern, English service names, seed-role matrix review (review §0.4 #11) | waves 3–4, go-live | before `add-go-live-readiness` |
| Production domain + DNS, Resend verification (ACT-05) | e-mail code sign-in in production | 2–3 days before go-live |

## 9. Risks the plan watches

| Risk | Signal | Response |
|---|---|---|
| Schedule (§6) | human hours per change and days from apply to merge, after week 1 | the owner sets the V1 date; never cut tests or the spec step to catch up |
| Checking becomes a formality (Claude Code writes, people only tick) | PRs approved in minutes; NGs found in the pilot instead of the workbook | money / permission / closing changes get the full review pass (CG-REVIEW); the workbook is run by someone other than the change owner |
| Real-time recording is not adopted (RISK-01) | pilot: taps / seconds above AD-GOAL-01, entries made hours later | fix the flow before building more on it |
| Spec and code drift apart | PR without a `Spec:` line; behaviour added "while there" | PR template + review; stop-and-fix-the-spec rule |
| Two developers in one file | merge conflicts in shared files | §4 rules; small PRs; daily rebase |
| OpenSpec store is beta | `openspec list` in point-barber shows nothing | fallback of `SETUP.md` §3; version pinned at 1.14.0 |
| Money bug found late | NG in a money scenario | integration tests on PostgreSQL 16 for idempotency, counters, locks; concurrency test on FINISH; security + money review pass (CG-REVIEW) |
| Planning data or screenshots leak | public repository | both repositories private (ACT-09); fixture data only |
