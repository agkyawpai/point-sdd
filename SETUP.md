# Setup

One-time setup. Run everything from the repo root (`D:\point_flow\point-sdd`).

## Prerequisites

| Tool | Check |
|---|---|
| Python 3.9+ | `python --version` |
| Node.js 20+ | `node --version` |
| Git | `git --version` |

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

## 3. OpenSpec

```powershell
npm install -g @fission-ai/openspec
openspec init        # choose Claude Code
```

## 4. App repo access

When the app repo is cloned under `D:\point_flow\`:

1. Copy `.claude\settings.local.json.example` to `.claude\settings.local.json` and put the real folder name in.
2. Copy `projects.json.example` to `projects.json` and fill it in.

Both files are personal and gitignored.

## Tests for the tools

```powershell
.venv\Scripts\python -m unittest tools/test_point_testgen.py tools/test_point_docgen.py
.venv\Scripts\python -m unittest discover -s .claude/skills/point-browser-tester/tests -p "test_*.py"
node --test .claude/skills/point-browser-tester/tests/
```

## Output locations

| Tool | Output |
|---|---|
| `/point-generate-tests` | `work\Test Cases\Test Case - <suffix>.xlsx` |
| `/point-browser-tester` | `work\Test Cases\<Topic> Evidence\runs\<run-id>\` |
| `/point-generate-docs` | `work\Design Docs\<suffix> - Documentation.xlsx` |

`work/` is created on first run. Only the test case review JSON under `work/Test Cases/` is committed.
