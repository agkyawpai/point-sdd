# Runbook — `add-repo-scaffold` ကို developer ၂ ယောက် ဘယ်လို run မလဲ

> **ဖိုင်နေရာ:** `point-sdd/docs/plan/runbook-add-repo-scaffold.md` · **ရက်စွဲ:** 02/Oct/2026
> **ဘာအတွက်:** ပထမ change (`add-repo-scaffold`) တစ်ခုတည်းအတွက်ပါ — ဒီ change တစ်ခုပဲ နှစ်ယောက် အပိုင်းခွဲ လုပ်ရတယ်။
> **မူရင်း:** `openspec/changes/add-repo-scaffold/tasks.md` (PR အစဉ် = ထိပ်ဆုံး စာပိုဒ်၊ ဘယ်သူ့အပိုင်း = `## 1.` … `## 9.` ခေါင်းစဉ်)
> နဲ့ `design.md` → "D3. Two developers, no shared files"။ **ဒီဖိုင်နဲ့ `tasks.md` မကိုက်ရင် `tasks.md` က မှန်တယ်။**

---

## အရင်သိထားရမယ့် စည်းမျဉ်း ၆ ချက်

1. **ဘယ်မှာ ရိုက်ရလဲ.** `git …`, `openspec …`, `claude …` = terminal (PowerShell) မှာ။ `/opsx:apply …` နဲ့ သူ့အောက်က စာကြောင်း =
   Claude Code ဖွင့်ပြီးမှ **အထဲမှာ**။
2. **ကိုယ့်အပိုင်းပဲ လုပ်ခိုင်း.** `/opsx:apply add-repo-scaffold` လို့ပဲ ရိုက်ရင် Claude က task အကုန် အစကနေ လုပ်သွားနိုင်တယ်။
   အောက်က စာကြောင်း ("group … ပဲ လုပ်ပါ") ကို အမြဲ ထည့်ပါ။
3. **နောက်တစ်ယောက် စလို့ရတဲ့ signal = PR က `main` ထဲ merge ပြီးတာ.** Claude က "READY" လို့ ပြောတာ မဟုတ်သေးဘူး —
   အဲ့ဒါက "PR ဖွင့်ပြီးပြီ၊ review လုပ်ပေးပါ" ဆိုတဲ့ signal ပဲ။
4. **PR တိုင်းကို ကျန်တစ်ယောက်က review လုပ်ပြီးမှ merge** (squash merge)။ ကိုယ့် PR ကို ကိုယ် မ approve ရ။
5. **Claude က မေးခွန်းမေးရင် / "spec မှာ မပါဘူး" လို့ ပြောရင် — ခန့်မှန်းပြီး မဖြေပါနဲ့။** ရပ်ပြီး spec ကို `point-sdd` မှာ အရင်ပြင်
   (owner ကို မေးရမယ့်ဟာဆို မေး) — D-PLT-13။
6. **`tasks.md` က `point-sdd` ထဲမှာ တစ်ဖိုင်တည်း.** Claude က task ပြီးတိုင်း `[x]` tick လုပ်တယ်။ PR တစ်ခု merge ပြီးတိုင်း
   `point-sdd` မှာ commit + push လုပ်ပါ (အောက်က "PR တစ်ခု ပြီးတိုင်း" အကွက်)။ အဆင့်အသစ် မစခင် `point-sdd` မှာ `git pull`။

## တစ်ချက်ကြည့် ဇယား

| အဆင့် | ဘယ်သူ run | ဘာ | စလို့ရတဲ့ signal | ကျန်တစ်ယောက်က အဲ့အချိန် |
|---|---|---|---|---|
| 0 | Dev 2 → Dev 1 | စက် setup | repo ၂ ခု push ပြီး | – |
| 1 | **Dev 2** | PR-A — group 1 (tooling + ပထမ CI) | အဆင့် 0 ပြီး | Dev 1: စက်ပြင်ဆင် (Node 24, Docker, hosts file) → PR-A review |
| 2a | **Dev 1** | PR-D — task 2.4–2.7 + group 5 (web) | **PR-A merge ပြီး** | Dev 2: အဆင့် 2b |
| 2b | **Dev 2** | PR-B — group 3 (database) → PR-C — task 2.1–2.3 + group 4 (API) | **PR-A merge ပြီး** | Dev 1: အဆင့် 2a; ပြီးရင် PR-B / PR-C review |
| 3 | Dev 2, Dev 1 | PR-H — task 7.1–7.3 (Dev 2) → PR-G — task 7.4–7.7 (Dev 1) | PR-A merge ပြီး ဘယ်အချိန်မဆို | စောင့်ချိန်မှာ လုပ် |
| 4 | **Dev 2** | PR-E — group 6 (Docker, Caddy, compose) | **PR-B + PR-C + PR-D merge ပြီး** | Dev 1: PR-G; PR-E review |
| 5 | **နှစ်ယောက်တွဲ** | PR-I — group 8 (end-to-end test) | **PR-E merge ပြီး** | branch တစ်ခုတည်းပေါ် အတူ |
| 6 | **နှစ်ယောက်တွဲ** | group 9 — စစ်ဆေး → merge → archive | group 8 ပြီး | အတူ |

---

## အဆင့် 0 — စက် setup (တစ်ခါတည်း)

လိုတာ: Git · Node.js 24 · Docker Desktop · Claude Code · Python 3.9+ (test case ထုတ်ဖို့ — အဆင့် 6 ကျမှ လို)။

**Dev 2 (အရင်):**

```powershell
npm install -g @fission-ai/openspec@1.14.0

cd point\point-sdd
openspec init --tools claude .
openspec store register . --id point-sdd
git add .claude
git commit -m "docs: openspec commands"
git push

cd ..\point-barber
openspec init --tools claude .
openspec list          # change ၄ ခု ပေါ်ရမယ်
openspec doctor        # "Store: point-sdd (metadata ok)"
git add .claude
git commit -m "chore(add-repo-scaffold): openspec commands"
git push
```

**Dev 1 (Dev 2 push ပြီးမှ):**

```powershell
npm install -g @fission-ai/openspec@1.14.0

cd point\point-sdd
git pull
openspec store register . --id point-sdd

cd ..\point-barber
git pull
openspec list          # change ၄ ခု ပေါ်ရမယ်
```

`openspec list` က change ၄ ခု မပြရင် **ရပ်ပါ** — `point-sdd/SETUP.md` §3 အောက်က "Fallback" အတိုင်း လုပ်ရမယ်။

---

## အဆင့် 1 — PR-A (Dev 2 တစ်ယောက်တည်း)

**Dev 2 — terminal:**

```powershell
cd point\point-barber
git switch -c feature/add-repo-scaffold/toolchain
claude --add-dir ..\point-sdd
```

**Dev 2 — Claude Code ထဲမှာ:**

```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ group 1 (PR-A) ပဲ လုပ်ပါ။ တခြား group မလုပ်ပါနဲ့။
ပြီးရင် PR ဖွင့်ပြီး "PR-A READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

**Dev 1 — ဒီအချိန်မှာ:**

- စက်မှာ Node.js 24 နဲ့ Docker Desktop တပ်။
- hosts ဖိုင်ထဲ ဒီစာကြောင်း ထည့် (Windows: `C:\Windows\System32\drivers\etc\hosts`, admin နဲ့ ဖွင့်): `127.0.0.1 point.test app.point.test`
- `design.md` D3 နဲ့ `tasks.md` ရဲ့ group 2, 5 ကို ဖတ်ထား (ကိုယ့်အပိုင်း)။

**Claude က `PR-A READY: …` လို့ ပြောတဲ့အခါ:**

1. Dev 2: GitHub မှာ PR-A ရဲ့ check ၃ ခု (`static`, `unit`, `pr-title`) အစိမ်းရောင် ဖြစ်မဖြစ် ကြည့်။ အနီဆို Claude ကို "CI မှာ … fail နေတယ်၊ ပြင်ပါ" လို့ ပြော။
2. Dev 2 → Dev 1: "PR-A review လုပ်ပေးပါ"။
3. **Dev 1: PR-A ကို review** → approve။
4. Dev 2: squash merge → Dev 1 ကို "**PR-A merge ပြီး**" လို့ ပြော။ → အဆင့် 2 စ။

---

## အဆင့် 2 — ပြိုင်တူ (PR-A merge ပြီးမှ)

### 2a. Dev 1 — PR-D (web)

```powershell
cd point\point-barber
git switch main
git pull
git switch -c feature/add-repo-scaffold/web
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 2.4–2.7 နဲ့ group 5 (PR-D) ပဲ လုပ်ပါ။ တခြား task မလုပ်ပါနဲ့။
ပြီးရင် PR ဖွင့်ပြီး "PR-D READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

`PR-D READY` → CI အစိမ်း ကြည့် → **Dev 2 review** → Dev 1 merge → "PR-D merge ပြီး" လို့ ပြော။

### 2b. Dev 2 — PR-B (database), ပြီးရင် PR-C (API)

```powershell
cd point\point-barber
git switch main
git pull
git switch -c feature/add-repo-scaffold/db
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ group 3 (PR-B) ပဲ လုပ်ပါ။ တခြား group မလုပ်ပါနဲ့။
ပြီးရင် PR ဖွင့်ပြီး "PR-B READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

`PR-B READY` → Dev 1 ကို review တောင်း → **review ကို မစောင့်ဘဲ** Claude Code ကနေ ထွက် (`/exit`) ပြီး PR-C ဆက်:

```powershell
git switch main
git pull
git switch -c feature/add-repo-scaffold/api
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 2.1–2.3 နဲ့ group 4 (PR-C) ပဲ လုပ်ပါ။ တခြား task မလုပ်ပါနဲ့။
ပြီးရင် PR ဖွင့်ပြီး "PR-C READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

- PR-B နဲ့ PR-C နှစ်ခုလုံးက `ci.yml` ကို ပြင်တယ်။ PR-B အရင် merge ဖြစ်ရင် PR-C branch မှာ `git pull --rebase origin main` လုပ်ပြီးမှ merge (task 4.21)။
- **Dev 1:** PR-D ပြီးတာနဲ့ PR-B, PR-C ကို review လုပ်ပေး။

**အဆင့် 2 ပြီးတဲ့ signal: PR-B + PR-C + PR-D သုံးခုလုံး merge ပြီး။**

---

## အဆင့် 3 — Docs (စောင့်ချိန်မှာ လုပ်; PR-A ပြီးရင် ဘယ်အချိန်မဆို)

**Dev 2 — PR-H** (PR-C ပြီးလို့ PR-D ကို စောင့်နေချိန်၊ ဒါမှမဟုတ် PR-E ပြီးမှ):

```powershell
git switch main; git pull
git switch -c feature/add-repo-scaffold/docs-ops
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 7.1–7.3 (PR-H) ပဲ လုပ်ပါ။ ပြီးရင် PR ဖွင့်ပြီး "PR-H READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

**Dev 1 — PR-G** (PR-D ပြီးပြီး စောင့်နေချိန်):

```powershell
git switch main; git pull
git switch -c feature/add-repo-scaffold/docs-web
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 7.5, 7.6, 7.7 ကို အရင်လုပ်ပါ။ task 7.4 က docs/engineering/local-setup.md ရှိမှ လုပ်ပါ (PR-H merge ပြီးမှ ရှိမယ်)။
ပြီးရင် PR ဖွင့်ပြီး "PR-G READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

Task 7.4 က Dev 2 ရဲ့ task 7.2 ရေးတဲ့ဖိုင် (`local-setup.md`) ထဲ ထပ်ဖြည့်တာမို့ **PR-H အရင် merge**၊ ပြီးမှ PR-G မှာ 7.4 လုပ်ပြီး merge။

---

## အဆင့် 4 — PR-E (Dev 2; PR-B + PR-C + PR-D merge ပြီးမှ)

```powershell
cd point\point-barber
git switch main
git pull
git switch -c feature/add-repo-scaffold/infra
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ group 6 (PR-E) ပဲ လုပ်ပါ။ တခြား group မလုပ်ပါနဲ့။
ပြီးရင် PR ဖွင့်ပြီး "PR-E READY: <PR link>" လို့ ပြောပြီး ရပ်ပါ။
```

- Task 6.9 မှာ စက်ပေါ် stack တင်ပြီး browser နဲ့ ကိုယ်တိုင် ကြည့်ရတယ် — Docker Desktop ဖွင့်ထား၊ hosts ဖိုင် စာကြောင်း ထည့်ထား (အဆင့် 1 မှာ ပြထားတဲ့အတိုင်း)။
- **Dev 1 — ဒီအချိန်မှာ:** PR-G ပြီးအောင် လုပ် → PR-E review။ အားရင် ကိုယ့်နောက် change (`add-shared-ui-components`) ရဲ့ `proposal.md` / `design.md` ကို ဖတ်ထား။

`PR-E READY` → CI job ၅ ခု (`static`, `unit`, `db`, `integration`, `images`) + `e2e` အစိမ်း → Dev 1 review → merge → "**PR-E merge ပြီး**"။ → အဆင့် 5 စ။

---

## အဆင့် 5 — PR-I: နှစ်ယောက်အတူ (PR-E merge ပြီးမှ)

Branch တစ်ခုတည်း။ Dev 2 က ဖွင့်၊ Dev 1 က ဆွဲယူ။

**Dev 2:**

```powershell
cd point\point-barber
git switch main
git pull
git switch -c feature/add-repo-scaffold/e2e
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 8.1 ကို အရင်လုပ်ပြီး push လုပ်ပါ၊ "8.1 PUSHED" လို့ ပြောပါ။
ပြီးရင် task 8.3, 8.5, 8.6, 8.7 ဆက်လုပ်ပါ။ task 8.2 နဲ့ 8.4 ကို မလုပ်ပါနဲ့ (Dev 1 ရဲ့အပိုင်း)။
အကုန်ပြီးရင် push လုပ်ပြီး "GROUP 8 DEV2 DONE" လို့ ပြောပြီး ရပ်ပါ။
```

**Claude က `8.1 PUSHED` လို့ ပြောတဲ့အခါ → Dev 2 က Dev 1 ကို "စလို့ရပြီ" လို့ ပြော။**

**Dev 1:**

```powershell
cd point\point-barber
git fetch
git switch feature/add-repo-scaffold/e2e
claude --add-dir ..\point-sdd
```
```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 8.2 နဲ့ 8.4 ပဲ လုပ်ပါ။ push မလုပ်ခင် git pull --rebase လုပ်ပါ။
ပြီးရင် push လုပ်ပြီး "GROUP 8 DEV1 DONE" လို့ ပြောပြီး ရပ်ပါ။
```

- `edge.spec.ts` ကို နှစ်ယောက်လုံး ထိတယ် (Dev 1 = 8.4၊ Dev 2 = 8.3 / 8.5 / 8.6) — push မလုပ်ခင် `git pull --rebase` အမြဲ။
- နှစ်ယောက်လုံး `DONE` ဖြစ်မှ တစ်ယောက်ယောက်က PR-I ဖွင့် (**merge မလုပ်သေး**) → အဆင့် 6။

---

## အဆင့် 6 — စစ်ဆေး → merge → archive (`tasks.md` → `## 9. Verification`)

| Task | ဘာလုပ် | ဘယ်သူ | ဘယ်မှာ |
|---|---|---|---|
| 9.1–9.3 | check အကုန် အစိမ်း (format, lint, typecheck, guards, test, db, integration, e2e, CI job ၇ ခု) + တစ်ယောက်က တစ်ယောက်ကို review | တစ်ယောက်က run၊ တစ်ယောက်က review | `point-barber` — PR-I branch |
| 9.4 | `docs/engineering/local-setup.md` ကို **မရေးခဲ့တဲ့သူ** က အစကနေ လိုက်လုပ်ကြည့်၊ မရှင်းတာ စာရွက်မှာ ပြင် | လူကိုယ်တိုင် | ကိုယ့်စက် |
| 9.5 | test case Excel ထုတ် | တစ်ယောက် | `point-sdd` |
| 9.6 | test case စမ်း → NG ရှိရင် PR-I branch မှာ ပြင် → ပြန်စမ်း | change မရေးခဲ့သူ ဖြစ်နိုင်ရင် | `point-sdd` + `point-barber` |
| 9.7 | NG မကျန်မှ PR-I squash merge; `main` ကို protect | တစ်ယောက် | GitHub |
| 9.8 | archive | တစ်ယောက် | `point-sdd` |

**9.1–9.3** (`point-barber`, PR-I branch, Claude Code ထဲမှာ):

```
/opsx:apply add-repo-scaffold
tasks.md ရဲ့ task 9.1, 9.2, 9.3 ပဲ လုပ်ပါ။ fail တာရှိရင် ပြင်ပါ။ ပြီးရင် "9.1–9.3 GREEN" လို့ ပြောပြီး ရပ်ပါ။
```

**9.5–9.6** (`point-sdd` ထဲမှာ Claude Code ဖွင့်ပြီး):

```powershell
cd point\point-sdd
git pull
claude
```
```
/point-generate-tests add-repo-scaffold
```

ထွက်လာတဲ့ test case စာရင်းကို ဖတ်ပြီး OK ပေး → Excel ထွက် → case တစ်ခုချင်း စမ်း (ဒီ change က screen မပါသလောက်မို့ `curl` / browser /
CI log နဲ့) → OK / NG မှတ်။ စစ်ပုံ အသေးစိတ် = `docs/SDD-Workflow-Guide-MM.md` §6 (test case ထုတ်) နဲ့ §7 (test လုပ်)။

**9.7** NG မကျန်တော့မှ PR-I merge။ **9.8** (`point-sdd` ထဲက Claude Code မှာ):

```
/opsx:archive add-repo-scaffold
```

"ပြီးပြီ" လို့ ပြောလို့ရတဲ့ စာရင်း = `docs/plan/dev-plan.md` §7 · PR တစ်ခုအတွက် စာရင်း = `point-barber/docs/engineering/coding-guideline.md` §23။

---

## PR တစ်ခု ပြီးတိုင်း (`point-sdd` မှာ)

Claude က tick လုပ်ထားတဲ့ `tasks.md` ကို သိမ်း:

```powershell
cd point\point-sdd
git pull
git add openspec/changes/add-repo-scaffold/tasks.md
git commit -m "spec: add-repo-scaffold — PR-A tasks done"
git push
```

(PR-A နေရာမှာ ကိုယ့် PR နာမည် ထည့်။) နှစ်ယောက်လုံး ဒီဖိုင်ကို ပြင်တာမို့ `git pull` အရင်။

## Claude က ဒီလို ပြောရင်

| Claude ပြောတာ | ဘာလုပ်ရမလဲ |
|---|---|
| `PR-x READY: <link>` | CI အစိမ်း ကြည့် → ကျန်တစ်ယောက်ကို review တောင်း → approve ရမှ squash merge → "PR-x merge ပြီး" လို့ ပြော |
| "spec မှာ မပါဘူး" / "ဒီ ၂ ခု မကိုက်ဘူး" / ရွေးခိုင်းတဲ့ မေးခွန်း | **မခန့်မှန်းနဲ့။** ရပ် → spec ကို `point-sdd` မှာ ပြင် (business rule ဆို owner ကို မေး) → ပြီးမှ ဆက် |
| test / CI fail နေတယ် | အဲ့ branch မှာပဲ ဆက်ပြင်ခိုင်း; fail နေတုန်း merge မလုပ်။ test / lint rule ကို ဖြုတ်ပြီး အစိမ်းလုပ်တာ လက်မခံ |
| ခိုင်းမထားတဲ့ group / ဖိုင်ကို လုပ်ချင်တယ် | "မလုပ်နဲ့၊ ခိုင်းထားတဲ့ task ပဲ" လို့ ပြော |
| folder အပြင်ကို ဖတ် / ရေးခွင့် တောင်း (`..\point-sdd`) | ခွင့်ပြု — spec ဖတ်ဖို့နဲ့ `tasks.md` tick လုပ်ဖို့ လိုတယ် |
| `openspec` က change ကို မတွေ့ဘူး | `point-sdd/SETUP.md` §3 "Fallback" |

## ဒီ change ပြီးရင်

နှစ်ယောက်တွဲ လုပ်တာ ကုန်ပြီ — change တစ်ခုကို တစ်ယောက်တည်း အစအဆုံး:

- **Dev 1:** `/opsx:apply add-shared-ui-components` (PR ၃ ခု — အဲ့ change ရဲ့ `tasks.md` ထိပ်မှာ ခွဲပုံ ပါ)
- **Dev 2:** `/opsx:apply add-foundation-auth-access` (PR ၃ ခု) → ပြီးရင် `/opsx:apply add-walkin-visit-checkout`

Change ၄ ခုရဲ့ အစဉ် = `docs/plan/dev-plan.md` §3 · change အကုန်ရဲ့ စာရင်း = `docs/plan/roadmap.md`။
