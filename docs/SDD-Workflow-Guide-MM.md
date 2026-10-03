# Point Barbershop — SDD Workflow လမ်းညွှန် (Start → Test)

> ဒီ guide က feature တစ်ခုကို **စိတ်ကူး → spec → code → test case → test → ပြီးဆုံး** အထိ ဘယ်လို လုပ်မလဲ အဆင့်လိုက် ရှင်းပြထားတာပါ။
> Team: **Spec ရေးသူ** (brainstorm + brief ရေး) နဲ့ **Developer** (Claude Code နဲ့ code ရေး / test လုပ်)။

---

## 0. Folder ပုံစံ

```
point\                          ← workspace folder (repo မဟုတ် — ဘယ် drive မဆို)
├── point-sdd\                  ← ဒီ repo (spec + design source + test case + tool) — github.com/agkyawpai/point-sdd
└── point-barber\               ← app source code repo — github.com/naingaunglinn/point-barber
```

| Repo | ဘာထည့်လဲ | ဘာ မထည့်ရဘူးလဲ |
|---|---|---|
| **point-sdd** | Brief, OpenSpec change / spec, **design source အကုန်** (`docs/decisions` ဆုံးဖြတ်ချက် · `docs/db` DBML / SQL · `docs/ux` · `docs/api` · `docs/adr` · `docs/plan`), test case JSON, tool, skill | App source code ✖ |
| **point-barber** | Source code, migration, unit / integration / e2e test, `docs/engineering/coding-guideline.md`, `design-reference/` ပုံ | Spec ✖ (spec က point-sdd မှာပဲ) |

> Repo ၂ ခု ခွဲတာရဲ့ အကြောင်းရင်း = `docs/adr/ADR-016`။ **DB / API / UX / ADR ပြောင်းချင်ရင် point-sdd မှာ အရင်ပြင်** (version bump + decision register note) → ပြီးမှ point-barber မှာ code ပြင်။
> Claude Code အတွက် စည်းမျဉ်း: ဒီ repo = [`CLAUDE.md`](../CLAUDE.md) + `openspec/config.yaml`; app repo = `point-barber/CLAUDE.md` + `docs/engineering/coding-guideline.md` (CG-…)။

**အဓိက စည်းမျဉ်း — Spec မရှိရင် code မရေးရ။** Code / branch / PR တိုင်း point-sdd ထဲက OpenSpec change တစ်ခုကို ညွှန်းနိုင်ရမယ်။

---

## 1. Workflow တစ်ခုလုံး အကျဉ်း

```
 ① Brief ရေး        ② OpenSpec change       ③ Code ရေး          ④ Test case          ⑤ Test           ⑥ Archive
 (Spec ရေးသူ)   →   /opsx:explore      →   /opsx:apply    →   /point-generate-   →  Excel / Browser  →  /opsx:archive
 docs/briefs/       /opsx:propose          (app repo ထဲ)       tests                tester            spec → current
                    review ✔                                   review ✔             NG → fix → retest
```

| အဆင့် | ဘယ်သူ | Output | Review လုပ်သူ |
|---|---|---|---|
| ① Brief | Spec ရေးသူ | `docs/briefs/<change-id>.md` | Developer |
| ② Proposal | Claude (Developer က run) | `openspec/changes/<change-id>/` | **နှစ်ယောက်လုံး** |
| ③ Code | Claude + Developer | app repo ထဲ code + unit test | Developer |
| ④ Test case | Claude | `temp_tests.json` → Excel | **နှစ်ယောက်လုံး** |
| ⑤ Test | Tester (ဘယ်သူမဆို) / Browser tester | Excel ထဲ OK / NG | Spec ရေးသူ (NG confirm) |
| ⑥ Archive | Developer | `openspec/specs/` update | — |

> **Review အဆင့် ၂ ခု (② နဲ့ ④) က အရေးအကြီးဆုံး။** Spec မှားတာ ဒီမှာ ပြင်ရင် အလွယ်ဆုံး၊ code ရေးပြီးမှ ပြင်ရင် ခက်တယ်။

---

## 2. ပထမဆုံး တစ်ခါ Setup

### 2.1 လိုတာတွေ

| Tool | စစ်နည်း |
|---|---|
| Git | `git --version` |
| Python 3.9+ | `python --version` |
| Node.js 20.19+ | `node --version` |
| Claude Code (VS Code extension သို့ CLI) | — |

### 2.2 Repo clone + tool setup

```powershell
mkdir point; cd point
git clone https://github.com/agkyawpai/point-sdd.git
git clone https://github.com/naingaunglinn/point-barber.git
cd point-sdd

# Test case tool (Python)
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt

# Browser tester (Playwright)
npm install
npx playwright install chromium

# OpenSpec — version pin (စက်တိုင်း တူအောင်)
npm install -g @fission-ai/openspec@1.14.0
openspec init --tools claude .                  # /opsx:* command ထုတ် (openspec/config.yaml မပြောင်း)
openspec store register . --id point-sdd        # စက်တစ်လုံး တစ်ခါ — point-sdd = spec "store"

cd ..\point-barber
openspec init --tools claude .                  # app repo မှာလည်း /opsx:* command
openspec list                                   # point-sdd ထဲက change တွေ ပေါ်ရမယ်
```

> `openspec init` က `/opsx:*` command တွေကို ထုတ်ပေးတယ် (`openspec/config.yaml` ရှိပြီးသားကို မထိ)။ Init ပြီးရင် Claude Code မှာ `/` ရိုက်ပြီး စစ်ပါ။
> `point-barber/openspec/config.yaml` ထဲမှာ `store: point-sdd` တစ်ကြောင်းပဲ ရှိတယ် — app repo က spec ကို point-sdd ကနေ တိုက်ရိုက် ဖတ်တယ် (ADR-016)။ အသေးစိတ် = [`SETUP.md`](../SETUP.md)။

### 2.3 ဘယ် repo ထဲမှာ ဘာလုပ်မလဲ

| အလုပ် | Claude Code ဖွင့်ရမယ့် repo |
|---|---|
| Brief · `/opsx:explore` · `/opsx:propose` · `openspec validate` · `/point-generate-tests` · `/point-browser-tester` · `/opsx:archive` | **point-sdd** |
| `/opsx:apply <change-id>` (code ရေး) | **point-barber** — app ရဲ့ `CLAUDE.md` + coding guideline + hook တွေ အလိုလို ဝင်; change ကို store ကနေ ဖတ်; `tasks.md` ရဲ့ `[x]` က point-sdd ထဲ ရောက် |

Skill တွေက app repo ကို ဖတ်ဖို့ (ကိုယ့်စက်အတွက်ပဲ — git ထဲ မဝင်):

1. `.claude\settings.local.json.example` ကို `.claude\settings.local.json` အဖြစ် copy (`../point-barber` ပါပြီးသား)
2. `projects.json.example` → `projects.json`

> **Fallback:** store က OpenSpec 1.14.0 မှာ beta ပါ။ point-barber ထဲမှာ `openspec list` က change တွေ မပြရင် — point-sdd ထဲကနေ `/opsx:apply` run (အပေါ်က `settings.local.json` လို) ပြီး session အစမှာ Claude ကို `../point-barber/CLAUDE.md` ဖတ်ခိုင်းပါ။

---

## 3. အဆင့် ① — Brief ရေးနည်း (Spec ရေးသူ)

Brainstorm ပြီးရင် **feature / form တစ်ခုကို brief တစ်ခု** ရေးပါ။ OpenSpec format ကို သိစရာမလို — markdown ရိုးရိုး၊ မြန်မာ / English ရောရေးလို့ရ။ Claude က OpenSpec format ပြောင်းပေးမယ်။

### 3.1 Brief အရွယ်

- **Brief ၁ ခု = form / topic တစ်ခု = အလုပ် ၁–၃ ရက်**၊ တစ်ထိုင်တည်း review လို့ရတဲ့ အရွယ်၊ test case ~၂၀–၃၀ (🔒 D-PLT-20)။ Change စာရင်း + အစဉ် + ဘယ်သူ = `docs/plan/roadmap.md`။
- Part တစ်ခုလုံး (ဥပမာ Part 4 Sales) ✖ — ခွဲပါ: `add-discount-codes`, `add-discount-requests`, `add-refunds`, `add-sale-adjustments` … (roadmap ထဲက နာမည်တွေ)
- နာမည် = **verb + feature**: `add-…`, `change-…`, `remove-…`, `fix-…`
- ဘယ် brief ပြီးမှ ဒါလုပ်လို့ရလဲ (dependency) ရေးပါ။

### 3.2 Brief template

`docs/briefs/<change-id>.md`:

```markdown
# Brief: <change-id>

## Goal
<ဘာပြဿနာ၊ ဘယ်သူ့အတွက် — ၁–၃ ကြောင်း>

## Decisions
- Implements: D-xxx, D-xxx
- New (proposed): <မရှိ / ရှင်းပြ>

## Actors & permissions
- <role> — <ဘာလုပ်လဲ> — permission `<module.action>`

## Flow
1. …
2. …
(Status ပြောင်းတာ ရေးပါ: PENDING → APPROVED, ဘယ်သူ ပြောင်းလဲ)

## Rules
R1. … (တစ်ကြောင်း၊ ဟုတ် / မဟုတ် စစ်လို့ရတဲ့ စာ)
R2. …

## Scenarios
### S1: <နာမည်>
- WHEN … (တကယ့် နာမည်၊ branch၊ ငွေ ပမာဏ)
- THEN …

## Screens / Form fields     ← form ပါရင် မဖြစ်မနေ (3.3 ကြည့်)

## Data
- Tables: …
- DBML ပြောင်းရင်: docs/db/ မှာ အရင်ပြင်

## Edge cases
- Internet ပြတ်၊ double tap၊ ပိတ်ပြီးသား ရက်၊ late entry …

## Out of scope
- ဒီ change မှာ **မလုပ်** မယ့်အရာ

## Open questions
- 🟡 OPEN-xx: …

## Answers to Claude's questions
<အဆင့် ② မှာ ဖြည့်>
```

### 3.3 Form ပါတဲ့ feature အတွက် — Field table (မဖြစ်မနေ)

Form တစ်ခုချင်း field တိုင်း ဒီလို ရေးပါ:

| Field | Type | Required | Validation | Default | Error message |
|---|---|---|---|---|---|
| Customer phone | phone | ✔ | `09…` / `+959…`၊ ၉–၁၁ လုံး | — | "ဖုန်းနံပါတ် ထည့်ပါ" |
| Service | dropdown (branch services) | ✔ | ACTIVE ပဲ | — | "Service ရွေးပါ" |
| Discount % | number | ✖ | 1–100 | — | "1 မှ 100 ကြား ထည့်ပါ" |
| Reason | text | ✔ (discount ပါရင်) | 1–500 စာလုံး | — | "အကြောင်းပြချက် ထည့်ပါ" |

ပြီးရင်:
- **Buttons** — ဘာ button တွေ၊ နှိပ်ရင် ဘာဖြစ်လဲ၊ ဘယ် status မှာ ပိတ်ထားလဲ
- **Permission** — ဘယ် role မြင်ရ / ပြင်ရ
- **List screen ဆို** — column၊ sort default၊ filter၊ search ဘာနဲ့ရှာ
- **Save ပြီးရင်** — ဘယ်မှာ ကျန်လဲ၊ ဘာ message ပြလဲ (`docs/ux/admin-panel.md` AD-… / `docs/ux/frontend-website.md` FE-… အတိုင်း — rule ID ကိုးကား)

> Field table ကောင်းရင် **Boundary / Abnormal test case** တွေ အလိုလို ထွက်လာတယ် (1–100 ဆို 0, 1, 100, 101 စစ်မယ်)။

### 3.4 မပေးခင် checklist

- [ ] Rule တိုင်း ဟုတ် / မဟုတ် စစ်လို့ရတဲ့ တစ်ကြောင်း
- [ ] Rule တိုင်းမှာ scenario အနည်းဆုံး ၁ ခု (တကယ့် နာမည် / ငွေ / အချိန် — `docs/plan/spec-fixtures.md` ထဲက လူ / ဆိုင်ခွဲ / ဈေး ကိုပဲ သုံး)
- [ ] Form field တိုင်း table ထဲ ပါ
- [ ] Decision ID ပါ၊ ဆုံးဖြတ်ချက်အသစ်ဆို "proposed" လို့ မှတ်
- [ ] Out of scope ဖြည့်ပြီး (တစ်ကြောင်းဖြစ်ဖြစ်)
- [ ] "etc."၊ "Fresha လိုပဲ" လို ရေးမထား
- [ ] DBML ပြောင်းရင် docs/db/ မှာ ပြင်ပြီးပြီ

Commit: `git add docs/briefs/<change-id>.md` → `git commit -m "brief: <change-id>"` → push

---

## 4. အဆင့် ② — OpenSpec change (Developer + Claude)

### 4.1 Explore — မေးခွန်းထုတ်

```
/opsx:explore docs/briefs/<change-id>.md
```

Claude က brief + `docs/decisions/decision-register.md` + `docs/db` + `docs/api` + `docs/ux` ကို ဖတ်ပြီး **မရှင်းတာ၊ ကွဲလွဲတာ** ကို မေးခွန်းထုတ်မယ်။ 🔒 ဆုံးဖြတ်ချက် အချင်းချင်း ဆန့်ကျင်တာ တွေ့ရင် Claude က ကိုယ်တိုင် မရွေးဘဲ ရပ်ပြီး မေးရမယ် (D-PLT-13)။
→ Spec ရေးသူက brief ထဲ "Answers to Claude's questions" မှာ ဖြေ (chat ထဲမဟုတ် — မှတ်တမ်းကျန်အောင်)။

### 4.2 Propose — change ထုတ်

```
/opsx:propose <change-id>
```

ထွက်လာမယ့် folder:

```
openspec/changes/<change-id>/
├── proposal.md      ← ဘာကြောင့်၊ ဘာပြောင်းမလဲ
├── design.md        ← နည်းပညာ ဆုံးဖြတ်ချက် (လိုမှ)
├── tasks.md         ← လုပ်ရမယ့် checklist
└── specs/<capability>/spec.md   ← requirement + scenario (delta)
```

### 4.3 OpenSpec file တစ်ခုချင်း ဘာပါရမလဲ

**proposal.md**

| Section | ပါရမယ့်အရာ |
|---|---|
| Why | ပြဿနာ၊ brief ရဲ့ Goal |
| What changes | ပြောင်းမယ့်အရာ အကျဉ်း (bullet) |
| Impact | ထိမယ့် capability၊ table၊ screen၊ **app repo** |
| Non-goals | မလုပ်မယ့်အရာ (brief ရဲ့ Out of scope) |

**design.md** (ရိုးရှင်းရင် မလိုဘူး)
- Data / API ပုံစံ၊ ဘယ် table ဘယ် column
- ရွေးချယ်စရာ ၂ ခုရှိရင် ဘာရွေးလဲ၊ ဘာကြောင့်
- Risk + ဘယ်လို ကာမလဲ

**tasks.md**
- Task တစ်ခု **၂ နာရီအောက်**
- Code task တိုင်း **ဘယ် repo** မှာလဲ ရေး
- ဥပမာ:
  ```markdown
  ## 1. Backend (point-barber)
  - [ ] 1.1 discount_requests migration + model
  - [ ] 1.2 POST /sales/{id}/discount-requests (reason required, one PENDING per sale)
  ## 2. Frontend (point-barber)
  - [ ] 2.1 "Ask for discount" dialog
  ## 3. Tests
  - [ ] 3.1 Unit tests for R1–R5
  ```

**specs/<capability>/spec.md** — အရေးအကြီးဆုံး

```markdown
## ADDED Requirements

### Requirement: One pending discount request per sale (D-PAY-04)
The system SHALL allow at most one PENDING discount request per OPEN sale.

#### Scenario: Second request is blocked
- **WHEN** sale S-1001 at Branch B3 already has a PENDING request
- **THEN** the "Ask for discount" button is disabled
- **AND** the API rejects a new request with "A request is already pending"
```

**ဒီ project ရဲ့ spec စည်းမျဉ်း (🔒 D-PLT-20 — `openspec/config.yaml` မှာ အပြည့်):**

- Capability folder = `openspec/config.yaml` ထဲက business area စာရင်းထဲကပဲ — **၂၅ ခု 🔒** (`auth`, `access`, `organization`, `services-pricing`, `scheduling`, `leave`, `customers`, `booking`, `visits`, `sales-checkout`, `payments`, `discounts`, `refunds`, `inventory`, `finance-closing`, `commission-payroll`, `attendance`, `settings`, `website`, `notifications`, `reports-dashboards`, `audit`, `data-management`, `platform-runtime`, `ui-foundation`)။ (နောက်ဆုံး ၂ ခု — `platform-runtime`, `ui-foundation` — ကို owner က 02/Oct/2026 sheet 3 (review §0.11 S3) မှာ အတည်ပြုပြီး။)
- Requirement တိုင်း = **တကယ့်တန်ဖိုးပါတဲ့ SHALL စာကြောင်း + source ID**။ "D-PAY-04 ကြည့်" လို့ချည်း ရေးရင် requirement မဟုတ်။
- Scenario = တကယ့် နာမည် / MMK ပမာဏ / အချိန် / error `code` + HTTP status; မျှော်လင့်တဲ့ တန်ဖိုးကို တွက်ပုံနဲ့ ရေး (`total = 11,000 (8,000 + 3,000)`)။
- Proposal ထိပ်မှာ `## မြန်မာ အတိုချုပ်`; `## Open questions` → "Needs the owner's answer" အောက်မှာ တစ်ခုခု ကျန်နေရင် အဲ့ change တစ်ခုလုံး apply မလုပ်ရ။

Format စည်းမျဉ်း (validator တင်းကျပ်တယ်):

| စည်းမျဉ်း | မှန် | မှား |
|---|---|---|
| Section | `## ADDED / MODIFIED / REMOVED Requirements` | အခြား heading |
| Requirement | `### Requirement: …` + **SHALL / MUST** | "should", "can" |
| Scenario heading | `#### Scenario:` (**# ၄ ခု အတိအကျ**) | `###` / `#####` — မြင်တောင် မမြင်ဘူး |
| Scenario | Requirement တိုင်း **အနည်းဆုံး ၁ ခု** | scenario မပါ |
| MODIFIED | Requirement **အပြည့်** (scenario အကုန်ပါ) ကူးထည့် | ပြောင်းတဲ့ စာကြောင်းပဲ |
| Keyword | `Requirement`, `Scenario`, `WHEN`, `THEN`, `SHALL` = English | — |

ကျန်တဲ့ စာ (ရှင်းပြချက်) ကို မြန်မာ ရေးလို့ရ။
Decision ID ကို requirement title ထဲ `(D-BKG-08)` လို ထည့် — နောက်မှ ရှာရလွယ်တယ်။

### 4.4 Proposal review (နှစ်ယောက်လုံး)

- [ ] Brief ရဲ့ Rule တိုင်း requirement ဖြစ်သွားပြီ
- [ ] Scenario တွေမှာ တကယ့် တန်ဖိုး ပါ
- [ ] Non-goals မှန်
- [ ] Task တွေ ၂ နာရီအောက်၊ repo ပါ
- [ ] Brief မှာ မပါတာ Claude က ထပ်ထည့်ထားတာ မရှိ (ရှိရင် ဖြုတ် / brief ပြင်)

```powershell
openspec validate <change-id> --strict     # format စစ်
```

Commit: `proposal: <change-id>`

---

## 5. အဆင့် ③ — Code ရေး (Developer)

1. **point-barber** မှာ branch ဖွင့်: `git switch -c feature/<change-id>`
2. Claude Code ကို **point-barber ထဲမှာ ဖွင့်ပြီး**:
   ```
   /opsx:apply <change-id>
   ```
   Claude က tasks.md ကို တစ်ခုချင်း လုပ်၊ ပြီးတာကို `[x]` ခြစ်မယ်။
3. Code က **app repo ထဲမှာပဲ** ရေးရ — point-sdd ထဲ code ✖
4. Spec မှာ မပါတာ လုပ်ချင်လာရင် → **ရပ်** → spec / brief ကို အရင်ပြင် → ပြီးမှ ဆက်
5. Unit test ကို scenario တွေကနေ ရေး (scenario ၁ ခု ≈ test ၁ ခု)
6. Commit ကို အဆင့်လိုက်ခွဲ (task group တစ်ခု = commit တစ်ခု လောက်)
7. PR title = `<type>(<change-id>): <အကျဉ်း>` (ဥပမာ `feat(add-walkin-visit-checkout): take split payment`) — coding guideline CG-GIT-02; PR description မှာ `Spec: point-sdd/openspec/changes/<change-id>` + decision ID + rule ID (`AD-…` / `CG-…`) ထည့်
8. Code ရေးပုံ စည်းမျဉ်း = `point-barber/docs/engineering/coding-guideline.md` (CG-…) — CI က စက်နဲ့ စစ်လို့ရတာ အကုန် စစ်တယ်

> Claude လမ်းလွဲရင် chat ထဲ ပြောတာထက် **tasks.md သို့ scenario** ကို ပြင်တာ ပိုထိရောက်တယ်။ ပြီးရင် `/clear` လုပ်ပြီး ပြန် apply။

---

## 6. အဆင့် ④ — Test case ထုတ် (Excel)

### 6.1 Command

point-sdd ထဲမှာ:

```
/point-generate-tests <change-id>
```

### 6.2 Claude နဲ့ အဆင့်လိုက်

| # | Claude လုပ်တာ | ကိုယ်လုပ်ရမှာ |
|---|---|---|
| 1 | Spec file ရှာ၊ group ခွဲ → `temp_manifest.json` | Group / output နာမည် စစ်၊ "ready" |
| 2 | Author / System Name / Sub System Name မေး | ဖြေ |
| 3 | Case တွေရေး → `temp_tests.json` | **Review** — မလိုတာ `"selected": false` |
| 4 | Excel ထုတ် + inspect | Excel ဖွင့်ကြည့် |

Output: `work/Test Cases/Test Case - <suffix>.xlsx`

### 6.3 Excel sheet တွေ

| Sheet | ပါတာ |
|---|---|
| **Title** | Document — Created / Review / Approval ရက်နဲ့ လူ |
| **TestCase** | Case စာရင်း + အပေါ်မှာ Total / OK / NG / Progress % |
| **Evidence** | Case နံပါတ်အလိုက် screenshot ကပ် (၁၅ row တစ်ခု) |
| **NG Report** | NG ဖြစ်တဲ့ case — ဘာမှားလဲ၊ ဘာပြင်လဲ၊ ဘယ်သူပြင် / confirm |
| **NG_evidence** | NG အတွက် screenshot |
| **List** | Dropdown တန်ဖိုး (OK / NG၊ tester နာမည်) |

**TestCase columns:**

| Column | ဘယ်သူဖြည့် | အဓိပ္ပာယ် |
|---|---|---|
| No | Tool | 1, 2, 3 … |
| Classification | Tool | **Normal** (အောင်မြင်ရမယ့် flow) / **Abnormal** (error, ခွင့်မပြု) / **Boundary** (limit အစွန်း) |
| Content | Tool | ဘာစစ်တာလဲ |
| Test method | Tool | Scope / Mutation / Preconditions / Steps / Cleanup |
| Test results | Tool | မျှော်လင့်တဲ့ ရလဒ် (တကယ့် တန်ဖိုး) |
| Tester | **Tester** | Dropdown |
| Test Date | **Tester** | စစ်တဲ့ရက် |
| Result | **Tester** | **OK** / **NG** |
| NG Report | **Tester** | NG ဆို NG Report sheet ရဲ့ No |
| Confirmed date | **Spec ရေးသူ** | ပြင်ပြီး ပြန်စစ် confirm ရက် |

### 6.4 Test method block

```text
Scope: browser                      ← browser / browser-context / standalone-api-db / ambiguous
Mutation: data-mutating             ← read-only / data-mutating / RBAC-mutating
Preconditions: Branch B3; Ko Aung; OPEN sale 1 x Haircut 25,000 MMK
Steps:
1. Sale ဖွင့်ပြီး "Ask for discount" နှိပ်
2. 10%၊ reason "regular customer" ထည့်ပြီး "Send request"
Cleanup: Sale ကို cancel ပြီး status Cancelled ဖြစ်တာ စစ်
```

| Scope | အဓိပ္ပာယ် |
|---|---|
| `browser` | Screen မှာ မြင်ရတာနဲ့ စစ်လို့ရ |
| `browser-context` | Screen + console error / request status |
| `standalone-api-db` | API / DB ကို တိုက်ရိုက်စစ်မှ (browser tester မလုပ်) |
| `ambiguous` | Screen + DB ရော — screen အပိုင်းပဲ browser က စစ် |

### 6.5 Case ကောင်း / မကောင်း

| ✖ မကောင်း | ✔ ကောင်း |
|---|---|
| "Total လျော့သွားရမယ်" | "Total = 22,500 MMK (25,000 − 10%)" |
| "Error ပြရမယ်" | "Field အောက်မှာ 'ဖုန်းနံပါတ် ထည့်ပါ' ပြ" |
| "Customer တစ်ယောက်" | "Customer Ma Su, 09-7712-3456" |

### 6.6 Git

- `temp_manifest.json` နဲ့ `temp_tests.json` → **commit** (ပြန်ထုတ်လို့ရအောင်)
- `.xlsx` → git ထဲ **မဝင်** (gitignore) — Google Drive / share folder ကနေ မျှ
- Case ပြင်ချင်ရင် JSON ကို ပြင် → ပြန်ထုတ် (Excel ကို တိုက်ရိုက် မပြင်)

> ⚠️ ပြန်ထုတ်ရင် Excel **အသစ်ဖြစ်သွား**တယ် — tester ဖြည့်ထားတဲ့ OK / NG ပျောက်မယ်။ Test စပြီးရင် case ပြင်ချင်ရင် file နာမည်အသစ် (suffix အသစ်) နဲ့ ထုတ်ပါ။

---

## 7. အဆင့် ⑤ — Test လုပ်

### 7.1 Manual test (Excel)

1. `Test Case - <suffix>.xlsx` ဖွင့်
2. Case တစ်ခုချင်း Preconditions ပြင် → Steps လုပ် → Test results နဲ့ တိုက်
3. **Tester / Test Date / Result** ဖြည့်
4. Screenshot ကို **Evidence** sheet မှာ case နံပါတ်အောက် ကပ်
5. **NG ဆို:**
   - NG Report sheet မှာ row အသစ် — Classification (Specification leak / Program miss / Other)၊ NG Content
   - NG Report No ကို TestCase ရဲ့ "NG Report" column မှာ ထည့်
   - Screenshot → NG_evidence
6. TestCase အပေါ်က Total / OK / NG / Progress အလိုလို ပြောင်းမယ်

**NG Classification:**

| | ဘယ်အချိန် |
|---|---|
| Specification leak | Spec ထဲ မပါခဲ့ / မှားခဲ့ → **spec ပြင်ရမယ်** |
| Program miss | Spec မှန်၊ code မှား → code ပြင် |
| Other | Environment၊ data၊ test case ကိုယ်တိုင် မှား |

### 7.2 Automated test (Browser tester)

```
/point-browser-tester "work/Test Cases/Test Case - <suffix>.xlsx"
```

- Claude က case တစ်ခုချင်း scope ခွဲ (browser ရ / မရ)၊ Playwright နဲ့ browser ဖွင့်ပြီး run
- **Login** — system မှာ **password မရှိ** (Google / email code)။ Tester က email code နဲ့ ဝင်တယ်: code ကို test environment ရဲ့ **Mailpit** ကနေ harness က ဖတ်ပေးတယ်။ Chat ထဲ code / password **ဘယ်တော့မှ မထည့်ရ**၊ environment variable နဲ့ပဲ:
  ```powershell
  $env:POINT_TEST_BASE_URL     = "https://app.point.test"
  $env:POINT_TEST_MAILPIT_URL  = "http://localhost:8025"
  $env:POINT_TEST_ADMIN_EMAIL  = "kyawzin@point.test"     # docs/plan/spec-fixtures.md ထဲက လူ
  $env:POINT_TEST_BARBER_EMAIL = "aung@point.test"
  ```
  Google login ကို လက်နဲ့ပဲ စစ် (automation ✖)။
- Data ပြောင်းတဲ့ case (data-mutating / RBAC-mutating) က **ခွင့်ပြုချက်မပေးရင် မ run** — test environment မှာပဲ ခွင့်ပြုပါ
- Evidence: `work/Test Cases/<Topic> Evidence/runs/<run-id>/` (screenshot, results.json, summary.md)
- ပြီးရင် PASS → OK၊ FAIL → NG အဖြစ် Excel ထဲ ရေးပေးမယ်။ BLOCKED / OUT_OF_SCOPE က မထိဘူး — manual စစ်ရမယ်

> Production မှာ browser tester **မ run ရ**။ Test / staging environment ပဲ။

### 7.3 NG → ပြင် → ပြန်စစ်

```
NG ─┬─ Program miss ──────→ app repo မှာ fix → ပြန်စစ် → OK → Confirmed date
    ├─ Specification leak → brief + spec ပြင် (MODIFIED) → code fix → case ပြင် → ပြန်စစ်
    └─ Other ─────────────→ data / env / case ပြင် → ပြန်စစ်
```

NG Report မှာ Modification Content / Modification Name ဖြည့်၊ confirm လုပ်သူက Confirmation Name ဖြည့်။

---

## 8. အဆင့် ⑥ — Archive

Code merge ပြီး test **NG မကျန်မှ**:

```
/opsx:archive <change-id>
```

- Change ရဲ့ spec delta → `openspec/specs/` (system ရဲ့ လက်ရှိ အမှန်) ထဲ ပေါင်း
- Change folder → `openspec/changes/archive/`
- Commit: `archive: <change-id>`

> `openspec/specs/` ကို **လက်နဲ့ မပြင်ရ** — change → archive ကနေပဲ ပြောင်းရ။

---

## 9. Design doc (လိုမှ)

```
/point-generate-docs <change-id>
```

Change folder ကနေ documentation workbook ထုတ်ပေးတယ် → `work/Design Docs/<suffix> - Documentation.xlsx`

| Sheet | ပါတာ |
|---|---|
| Overview | ဘာကြောင့် ပြောင်း / ဘာပြောင်း / process ဘယ်လိုအလုပ်လုပ် / ဘယ်လို test |
| UIUX | Screenshot + caption |
| Diagrams | Mermaid source + rendered PNG |
| Detailed Design | Decision table၊ API (route / request / response) — field အသစ်ကို အဝါရောင် |
| Database Design | Table ပြောင်းရင်ပဲ — column table၊ column အသစ်ကို အဝါရောင် |

အဆင့်တိုင်း Claude က content ကို အရင်ပြ → confirm ပြီးမှ ထုတ်မယ်။

---

## 10. Git စည်းမျဉ်း

| ဘာ | Commit? |
|---|---|
| `docs/briefs/*.md` | ✔ |
| `openspec/**` | ✔ |
| `work/Test Cases/*/temp_manifest.json`, `*/*/temp_tests.json` | ✔ |
| `*.xlsx` (output), evidence, screenshot | ✖ (share folder) |
| `.venv/`, `node_modules/`, `settings.local.json`, `projects.json` | ✖ |

Commit message:

| အဆင့် | Message |
|---|---|
| Brief | `brief: add-discount-requests` |
| Proposal | `proposal: add-discount-requests` |
| Spec ပြင် | `spec: add-discount-requests — answer OPEN-31` |
| Test case | `tests: add-discount-requests (18 cases)` |
| Archive | `archive: add-discount-requests` |

Push မလုပ်ခင် `git pull` အရင်။ Change တစ်ခုတည်းကို နှစ်ယောက် တပြိုင်နက် မပြင်ပါနဲ့။

---

## 11. Cheat sheet — Feature တစ်ခု

```
[ ] 1. Brief ရေး           docs/briefs/<id>.md                    (Spec ရေးသူ)
[ ] 2. Explore             /opsx:explore docs/briefs/<id>.md      → မေးခွန်း brief ထဲဖြေ
[ ] 3. Propose             /opsx:propose <id>
[ ] 4. Validate            openspec validate <id> --strict
[ ] 5. Review proposal     (နှစ်ယောက်)                             → commit
[ ] 6. Branch              app repo: git switch -c feature/<id>
[ ] 7. Apply               point-barber ထဲမှာ /opsx:apply <id>     → CI green + PR review (merge မလုပ်သေး)
[ ] 8. Test cases          /point-generate-tests <id>             → JSON review → Excel
[ ] 9. Test                Manual / /point-browser-tester <xlsx>
[ ] 10. NG fix loop        NG Report → fix → retest → Confirmed date
[ ] 11. Merge              app repo PR squash merge (Spec link ပါ) — NG အကုန် ပိတ်ပြီးမှ
[ ] 12. Archive            /opsx:archive <id>                     → commit
```

---

## 12. မေးလေ့ရှိတာ

**Q: Brief မရေးဘဲ /opsx:propose တန်းလုပ်လို့ရလား?**
ရတယ်၊ ဒါပေမဲ့ Claude က ကွက်လပ်တွေကို ခန့်မှန်းဖြည့်မယ်။ Brief ရှိမှ ကိုယ့်ဆုံးဖြတ်ချက်အတိုင်း ဖြစ်မယ်။

**Q: Code ရေးနေရင်း spec မှားနေတာ တွေ့ရင်?**
Code ရပ် → brief / spec ပြင် → proposal ပြန် review → ဆက် apply။ Code ထဲမှာပဲ ပြင်ပြီး spec မပြင်ရင် spec နဲ့ code ကွဲသွားမယ်။

**Q: Test case ဘယ်နှစ်ခု သင့်တော်လဲ?**
Change သေး ၃–၁၀၊ ပုံမှန် ၂၀–၃၀ (🔒 D-PLT-20)။ ၃၀ ကျော်နေရင် change က ကြီးလွန်းတာ — ခွဲဖို့ စဉ်းစားပါ။ များတာ မကောင်းဘူး — behavior မတူတာပဲ ခွဲ။

**Q: Excel ပြင်ချင်ရင်?**
Case content → JSON ပြင်ပြီး ပြန်ထုတ်။ Tester column (Result စတာ) → Excel မှာ တိုက်ရိုက်။

**Q: Tester နာမည် dropdown မှာ မပါဘူး?**
`tools/point-make-template.py` ရဲ့ `TESTERS` မှာ ထည့် → `.venv\Scripts\python tools\point-make-template.py` → template ပြန်ထုတ်။

**Q: Claude က လမ်းလွဲနေတယ်?**
Chat ထဲ ရှည်ရှည်မပြောနဲ့ — scenario / tasks.md ကို ပြင်၊ `/clear`၊ ပြန် run။
