# point-sdd

Spec-driven development hub for the Point Barbershop System. It holds the planning sources (decisions, DB / API / UX design, ADRs), the specs (OpenSpec), the test cases and the tools that generate them. **No application code lives here** — the app is `point-barber`, cloned beside this repo in one workspace folder:

```
point/
├── point-sdd/      this repo — OpenSpec store "point-sdd"
└── point-barber/   application — points here with `store: point-sdd` (ADR-016)
```

Workflow guide (Myanmar): [docs/SDD-Workflow-Guide-MM.md](docs/SDD-Workflow-Guide-MM.md) · Rules for Claude Code in this repo: [CLAUDE.md](CLAUDE.md) · Setup: [SETUP.md](SETUP.md)

## Layout

| Path | Contents |
|---|---|
| `openspec/config.yaml` | Project context and artifact rules every proposal / spec / design / tasks file follows |
| `openspec/changes/<change-id>/` | Active changes — proposal, spec deltas, design, tasks |
| `openspec/specs/<capability>/` | Current specs — changed only by `/opsx:archive` |
| `docs/briefs/` | Feature briefs (one per change) |
| `docs/decisions/` | Planning review (master record) + `decision-register.md` (generated from its Appendix A — 🔒 rows are the requirements) |
| `docs/db/` | DBML, constraint SQL and constraint tests (91 tables, PostgreSQL 16) |
| `docs/ux/` | `admin-panel.md` (AD-…) · `frontend-website.md` (FE-…) |
| `docs/api/` | `00-conventions.md` (API-…) · `01..08-*.md` (P1.… … P8.…) · `openapi/*.yaml` |
| `docs/adr/` · `docs/architecture/` | ADR-001..016 · system design review |
| `docs/plan/` | `dev-plan.md` · `roadmap.md` (change list and order) · `spec-fixtures.md` (people, branches, prices used in every scenario) |
| `templates/Test Case - Function.xlsx` | Blank test case workbook (built by `tools/point-make-template.py`) |
| `tools/point-testgen.py` · `tools/point-docgen.py` | Workbook builders |
| `tools/extract-decision-register.py` | Rebuilds `docs/decisions/decision-register.md` from the review |
| `.claude/skills/point-generate-tests/` | Specs → test cases → workbook |
| `.claude/skills/point-browser-tester/` | Runs workbook cases in a browser (Playwright), records evidence and OK / NG |
| `.claude/skills/point-generate-docs/` | Changes → documentation workbook |
| `work/` | Generated output. Only `work/Test Cases/**/temp_manifest.json` and `temp_tests.json` are committed |

## Workflow

```
brief → /opsx:explore → /opsx:propose → review → /opsx:apply (run inside point-barber)
      → /point-generate-tests → review → test (manual or /point-browser-tester) → /opsx:archive
```

Everything except `/opsx:apply` runs in this repo. A change to the database, the API contract, a UX rule or an architecture decision is made **here first** (version bump + register note), then implemented in `point-barber`.

Useful commands:

```powershell
openspec list                                  # active changes
openspec validate --all --strict               # format check
python tools\extract-decision-register.py      # after editing Appendix A of the review
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

In Claude Code: `/point-browser-tester "work\Test Cases\Test Case - <name>.xlsx"`.

The Point staff app has **no passwords**. A runner signs in with the e-mail code: set `POINT_TEST_<PROFILE>_EMAIL` (a fixture person, e.g. `POINT_TEST_BARBER_EMAIL=aung@point.test`) and `POINT_TEST_MAILPIT_URL` (the test environment's Mailpit, e.g. `http://localhost:8025`); the harness reads the code from Mailpit. Nothing secret goes into files or chat. Cases that change data run only when you approve them. Evidence goes to `work\Test Cases\<Topic> Evidence\runs\<run-id>\`. Never run it against production.

## Documentation

In Claude Code: `/point-generate-docs <change name or path>`. Review `work/temp_manifest.json` and `work/temp_doc.json`; Claude builds `work/Design Docs/<name> - Documentation.xlsx` (Overview, UIUX, Diagrams, Detailed Design, and Database Design when the change touches tables).

```powershell
.venv\Scripts\python tools\point-docgen.py --input "work\temp_doc.json" --output "work\Design Docs\<name> - Documentation.xlsx"
```
