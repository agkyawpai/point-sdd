# point-sdd

Spec-driven development hub for the Point Barbershop System. It holds specs (OpenSpec), test cases and the tools that generate them. No application code lives here — app repos are cloned beside this one under `D:\point_flow\`.

Workflow guide (Myanmar): [docs/SDD-Workflow-Guide-MM.md](docs/SDD-Workflow-Guide-MM.md)

## Layout

| Path | Contents |
|---|---|
| `docs/briefs/` | Feature briefs written after brainstorming |
| `openspec/` | Changes and specs — created by `openspec init` |
| `templates/Test Case - Function.xlsx` | Blank test case workbook (built by `tools/point-make-template.py`) |
| `tools/point-testgen.py` | Fills the template from reviewed test JSON |
| `tools/point-docgen.py` | Builds a documentation workbook from reviewed JSON |
| `.claude/skills/point-generate-tests/` | Specs → test cases → workbook |
| `.claude/skills/point-browser-tester/` | Runs workbook cases in a browser (Playwright), records evidence and OK / NG |
| `.claude/skills/point-generate-docs/` | Changes → documentation workbook |
| `work/` | Generated output. Only `work/Test Cases/**/temp_manifest.json` and `temp_tests.json` are committed |

Setup: [SETUP.md](SETUP.md)

## Workflow

```
brief → /opsx:explore → /opsx:propose → review → /opsx:apply (app repo)
      → /point-generate-tests → review → test (manual or /point-browser-tester) → /opsx:archive
```

## Test cases

In Claude Code: `/point-generate-tests <change name or spec path>`

1. Review `work/Test Cases/<run-id>/temp_manifest.json` (grouping and workbook names).
2. Give Author, System Name, Sub System Name.
3. Review `work/Test Cases/<run-id>/<group>/temp_tests.json` — set `"selected": false` to drop a case.
4. Claude fills `work/Test Cases/Test Case - <name>.xlsx` and inspects it.

Workbook sheets: **Title**, **TestCase** (No · Classification · Content · Test method · Test results · Tester · Test Date · Result · NG Report · Confirmed date), **Evidence**, **NG Report**, **NG_evidence**, **List**. Classification is Normal / Abnormal / Boundary; Result is OK / NG.

Build by hand:

```powershell
.venv\Scripts\python tools\point-testgen.py --input "work\Test Cases\<run-id>\<group>\temp_tests.json" --template "templates\Test Case - Function.xlsx" --output "work\Test Cases\Test Case - <name>.xlsx"
```

Regenerating overwrites the workbook, including results typed into it. Close it in Excel first.

To change tester names or the layout, edit `tools/point-make-template.py` and run it.

## Browser testing

In Claude Code: `/point-browser-tester "work\Test Cases\Test Case - <name>.xlsx"`. Credentials come from environment variables (`POINT_TEST_<PROFILE>_USER` / `_PASSWORD`), never from files or chat. Cases that change data run only when you approve them. Evidence goes to `work\Test Cases\<Topic> Evidence\runs\<run-id>\`.

## Documentation

In Claude Code: `/point-generate-docs <change name or path>`. Review `work/temp_manifest.json` and `work/temp_doc.json`; Claude builds `work/Design Docs/<name> - Documentation.xlsx` (Overview, UIUX, Diagrams, Detailed Design, and Database Design when the change touches tables).

```powershell
.venv\Scripts\python tools\point-docgen.py --input "work\temp_doc.json" --output "work\Design Docs\<name> - Documentation.xlsx"
```
