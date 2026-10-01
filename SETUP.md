# Setup

One-time setup for the test case generator. Needs **Python 3.9+** on your PATH (`python --version`).

From the repo root:

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -c "import openpyxl; print(openpyxl.__version__)"   # → 3.1.5
```

`.venv/` is gitignored. No activation needed — the skill calls `.venv\Scripts\python` directly.

Run the generator tests:

```powershell
.venv\Scripts\python -m unittest tools/test_point_testgen.py
```

## OpenSpec

```powershell
npm install -g @fission-ai/openspec
openspec init
```
