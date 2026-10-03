# Setup

One-time setup per machine. The two repositories are cloned side by side in one workspace folder (any drive):

```
point\
├── point-sdd\       this repo
└── point-barber\    application repo
```

```powershell
mkdir point; cd point
git clone https://github.com/agkyawpai/point-sdd.git
git clone https://github.com/naingaunglinn/point-barber.git
cd point-sdd
```

Run the rest from the `point-sdd` root unless a step says otherwise.

## Prerequisites

| Tool | Check |
|---|---|
| Python 3.9+ | `python --version` |
| Node.js 20.19+ (OpenSpec 1.14.0 needs ≥ 20.19; the app repo needs Node 24 LTS) | `node --version` |
| Git | `git --version` |
| Claude Code | VS Code extension or CLI |

## 1. Python tools (test case + documentation generators)

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -c "import openpyxl; print(openpyxl.__version__)"   # 3.1.5
```

`.venv/` is gitignored. No activation needed — the skills call `.venv\Scripts\python` directly.

Optional, for the documentation generator:

```powershell
.venv\Scripts\pip install pillow                 # embed screenshots and diagram images
npm install -g @mermaid-js/mermaid-cli           # render Mermaid diagrams (mmdc)
```

## 2. Browser tester (Playwright)

```powershell
npm install
npx playwright install chromium
```

## 3. OpenSpec — store + pointer (ADR-016)

The version is pinned so that every machine behaves the same; upgrade on one machine first.

```powershell
npm install -g @fission-ai/openspec@1.14.0

# in point-sdd — installs the /opsx:* commands for Claude Code (openspec/config.yaml is kept as it is)
openspec init --tools claude .
openspec store register . --id point-sdd      # once per machine: point-sdd becomes the store "point-sdd"

# in point-barber — its openspec/config.yaml contains only:  store: point-sdd
cd ..\point-barber
openspec init --tools claude .
openspec list                                  # shows the changes that live in point-sdd
openspec doctor                                # "Store: point-sdd (metadata ok)"
cd ..\point-sdd
```

After `init`, type `/` in Claude Code to see the `/opsx:*` commands.

`openspec init` writes `.claude/commands/opsx/` and `.claude/skills/openspec-*` into each repository. **Commit
these generated files once per repository** (so every machine and Claude Code session has the same commands);
re-run `init` and commit again only when the pinned OpenSpec version changes.

- **Spec work** (brief, `/opsx:explore`, `/opsx:propose`, `openspec validate`, `/point-generate-tests`, `/point-browser-tester`, `/opsx:archive`) → open Claude Code in **point-sdd**.
- **Code** (`/opsx:apply <change-id>`) → open Claude Code in **point-barber**. It reads the change from the store and follows `point-barber/CLAUDE.md` and `docs/engineering/coding-guideline.md`.

**Fallback** (the store feature is beta in 1.14.0): if `openspec list` inside point-barber does not show the changes, run `/opsx:apply` from point-sdd instead — copy `.claude\settings.local.json.example` to `.claude\settings.local.json` (it adds `../point-barber` as an additional directory) and start the session by asking Claude to read `../point-barber/CLAUDE.md`.

## 4. Local files (personal, gitignored)

1. `projects.json.example` → `projects.json` (the path `../point-barber` is already right when the two repos sit side by side).
2. `.claude\settings.local.json.example` → `.claude\settings.local.json` — needed for the fallback above and for the skills that read the app repo.

## 5. Browser-test environment variables

Set in your own shell, never in a file:

```powershell
$env:POINT_TEST_BASE_URL    = "https://app.point.test"
$env:POINT_TEST_ENVIRONMENT = "local"
$env:POINT_TEST_MAILPIT_URL = "http://localhost:8025"      # where sign-in codes arrive in test environments
$env:POINT_TEST_ADMIN_EMAIL = "kyawzin@point.test"         # fixture people — docs/plan/spec-fixtures.md
$env:POINT_TEST_BARBER_EMAIL = "aung@point.test"
```

The system has no passwords; there is nothing else to configure.

## Tests for the tools

```powershell
.venv\Scripts\python -m unittest tools/test_point_testgen.py tools/test_point_docgen.py
.venv\Scripts\python -m unittest discover -s .claude/skills/point-browser-tester/tests -p "test_*.py"
node --test .claude/skills/point-browser-tester/tests/harness.test.js
```

## Output locations

| Tool | Output |
|---|---|
| `/point-generate-tests` | `work\Test Cases\Test Case - <suffix>.xlsx` |
| `/point-browser-tester` | `work\Test Cases\<Topic> Evidence\runs\<run-id>\` |
| `/point-generate-docs` | `work\Design Docs\<suffix> - Documentation.xlsx` |

`work/` is created on first run. Only the test case review JSON under `work/Test Cases/` is committed.
