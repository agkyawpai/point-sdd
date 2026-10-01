# point-sdd

Spec-driven development hub for the Point Barbershop system: specs (OpenSpec) and test cases (Excel). No application code lives here.

## Layout

| Path | Contents |
|---|---|
| `openspec/` | Specs and changes — created by `openspec init` |
| `work/Test Cases/` | Generated test workbooks + the JSON they're built from |
| `tools/point-testgen.py` | Builds a test workbook from reviewed JSON |
| `.claude/skills/point-generate-tests/` | Claude Code skill: specs → cases → workbook |

## Test cases

1. One-time setup: see [SETUP.md](SETUP.md).
2. In Claude Code: `/point-generate-tests <change name or spec path>`
3. Review the grouping (`temp_manifest.json`) and the cases (`temp_tests.json`).
4. Claude builds `work/Test Cases/Test Case - <name>.xlsx`.
5. Testers fill the yellow columns on the **TestCase** sheet (Tester, Test Date, Result OK/NG, NG No, Confirmed Date, Remarks) and log failures on **NG Report**.

Workbook sheets: **Title** (document info, review/approval), **TestCase** (cases + summary: total / OK / NG / not run / progress), **Evidence** (screenshots per case), **NG Report** (仕様漏れ / プログラムミス / その他), **List** (dropdown values).

Rebuilding an existing workbook keeps tester results by case ID. A case whose content changed goes back to blank Result, with the old result noted in Remarks.

Build by hand:

```powershell
.venv\Scripts\python tools\point-testgen.py --input "work\Test Cases\<run-id>\<group>\temp_tests.json" --output "work\Test Cases\Test Case - <name>.xlsx"
.venv\Scripts\python tools\point-testgen.py --check "work\Test Cases\Test Case - <name>.xlsx"
```

Close the workbook in Excel before rebuilding.
