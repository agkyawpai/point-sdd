---
name: point-generate-tests
description: Generate a reviewed Excel test specification (Title / TestCase / Evidence / NG Report / List) from OpenSpec specs in this repo. Use when the user asks for test cases for a change, capability or spec file.
---

# Generate test cases from OpenSpec specs

You act as a senior QA engineer. Turn OpenSpec requirements into a compact, executable set of test cases, let the user review them as JSON, then build the Excel workbook with `tools/point-testgen.py`.

## Paths

| What | Where |
|---|---|
| Run folder (one per invocation) | `work/Test Cases/<run-id>/` — `<run-id>` = `<UTC yyyyMMddTHHmmssZ>-<slug>` |
| Manifest | `work/Test Cases/<run-id>/temp_manifest.json` |
| Review JSON | `work/Test Cases/<run-id>/<suffix-slug>/temp_tests.json` |
| Workbook | `work/Test Cases/Test Case - <suffix>.xlsx` |
| Generator | `.venv\Scripts\python tools\point-testgen.py` |

Slug rule: lowercase, anything outside `[a-z0-9-]` becomes `-`, collapse repeats, trim `-`.
Keep the manifest and review JSON — they are committed so cases can be edited and rebuilt later.

## Step 1 — Find the specs

Input: `{{user_input}}`

- **A path** to a `spec.md` or a folder → use those files.
- **A name or description** → search `openspec/changes/*/specs/**/spec.md` and `openspec/specs/**/spec.md`. Match on change folder name, path segments, and `##` / `###` headings. Include `openspec/changes/archive/` only if the user says "archive" or "archived".
- **Nothing** → list active changes that have specs as a numbered menu and ask which ones.

If nothing matches, say so and offer the menu. Don't guess.

## Step 2 — Manifest (user review)

Group related specs into one workbook each, propose an output suffix per group, and write:

```json
{
  "groups": [
    { "outputSuffix": "Login", "sources": ["openspec/changes/add-login-otp/specs/auth/spec.md"] }
  ]
}
```

Show the groups and wait for "ready". Then re-read the file (the user may have edited it), trim suffixes, reject `< > : " / \ | ? *`, and warn if a workbook with that name already exists (rebuilding keeps tester results — see Step 6).

## Step 3 — Metadata

Ask once for: **Author**, **System Name** (default "Point Barbershop System"), **Sub System Name**, and **Testers** (names for the Tester dropdown).

## Step 4 — Write the cases

Read every source spec: requirements, scenarios, rules, roles, statuses, limits, side effects. Also read the decision IDs (D-xxx) they reference and `docs/ux-rules.md` if it exists.

Cover, where they apply:

1. Normal flow
2. Errors and forbidden actions
3. Boundaries — just below / at / just above every limit (time limits, counts, amounts)
4. Rule combinations — decision-table thinking, only combinations that behave differently
5. Roles and permissions — only where outcomes differ
6. Status transitions — important valid ones, and invalid ones reachable from the UI
7. Side effects — records created, notifications, receipts, calculated values
8. Regression — nearby existing flows the change could break

Keep it small: merge cases that test the same behavior with equivalent inputs. Rough size: small change 3–10, normal feature 10–25, complex rules 20–40.

**Classification** (exactly one): `正常系` normal / expected success · `異常系` error, forbidden, failed transition · `境界値` limit or edge.

**Concrete values — required.** A tester must be able to compare, not interpret:

- Preconditions pin every input that affects the result: real names, branches, MMK amounts, dates/times (MMT), statuses, settings. If you chose the values, add `(values chosen for this fixture)`.
- Expected result states the value, not the direction: `Total = 22,500 MMK (25,000 − 10%)`, not "discount is applied". Quote exact messages and labels.
- Pick numbers that expose mistakes: avoid 1, 1.0 and exact halves; include at least one uneven split.
- Never put passwords or tokens in cases.

**Test method** starts with this block:

```text
Scope: browser | browser-context | standalone-api-db | ambiguous
Mutation: read-only | data-mutating | RBAC-mutating
Preconditions: <exact data, account, screen>
Steps:
1. ...
Cleanup: <None, or how to restore and how to confirm it>
```

- `browser` — proven from what the screen shows.
- `browser-context` — screen plus console errors or request URL / status. Never cookies, tokens or request bodies.
- `standalone-api-db` — needs API or database checks; name them.
- `ambiguous` — mixes screen and DB checks. Prefer splitting into two cases; otherwise say which part is screen-checkable.
- RBAC-mutating cases must restore the permission and verify it.

## Step 5 — Review JSON

Write `temp_tests.json`:

```json
{
  "meta": { "systemName": "Point Barbershop System", "subSystemName": "Login",
            "author": "<name>", "testers": ["<name>", "<name>"] },
  "tests": [
    {
      "selected": true,
      "id": "TC-AUTH-001",
      "Classification": "正常系",
      "Content": "Active user requests a login code",
      "Test method": "Scope: browser\nMutation: data-mutating\nPreconditions: ...\nSteps:\n1. ...\nCleanup: Log out",
      "Test result": "- Message: \"If this email is registered, we sent a code\"\n- Email arrives with an 8-digit code",
      "Reference": "Req: Request email OTP\nD-AUTH-04"
    }
  ]
}
```

- `id` = `TC-<MODULE>-<3 digits>`. Never renumber or reuse an ID — results are matched by it.
- `Reference` = requirement name + decision IDs (+ UX rule IDs).

Tell the user how many cases you wrote and ask them to set `"selected": false` on any to drop. Wait for confirmation.

## Step 6 — Build and check

```powershell
.venv\Scripts\python tools\point-testgen.py --input "<temp_tests.json>" --output "work\Test Cases\Test Case - <suffix>.xlsx"
.venv\Scripts\python tools\point-testgen.py --check "work\Test Cases\Test Case - <suffix>.xlsx"
```

`--check` must report the number of selected cases and no problems. If not, fix the JSON and rebuild — never hand-edit the workbook.

If the workbook already exists, tester columns are kept by `id`; changed cases go back to blank Result with a note in Remarks. If the file is open in Excel, ask the user to close it.

If `.venv\Scripts\python` is missing, point the user to `SETUP.md`.

Report the workbook path and the kept JSON and manifest paths. Do one group at a time; stop if a group fails.
