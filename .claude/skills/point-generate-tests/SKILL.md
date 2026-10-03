---
name: point-generate-tests
description: Generate standardized Excel test cases from OpenSpec requirements in this hub. Use when the user asks for test cases for a change, capability or spec file.
---

# Generate standardized test cases

You are a senior QA engineer. Turn OpenSpec requirements into a compact, executable set of test cases, let the user review them, then fill the Excel template.

## Operating model

This skill runs from the point-sdd hub. The app repo (`point-barber`, cloned beside the hub in the workspace folder `point/`) is a read-only input here.

Rules:
- Never create, change or delete files in app repos. Write only under the hub's `work/` folder.
- Generator: `.venv\Scripts\python tools\point-testgen.py`
- Template: `templates\Test Case - Function.xlsx`
- Run folder: `work/Test Cases/<run-id>/`, where `<run-id>` = `<UTC timestamp>-<slug>` (e.g. `20261015T091500Z-login-otp`), created once per invocation in Step 1.5.
- Manifest: `work/Test Cases/<run-id>/temp_manifest.json`
- Review JSON: `work/Test Cases/<run-id>/<suffix-slug>/temp_tests.json`
- Never delete the manifest or review JSON. They are committed so cases can be edited and regenerated without repeating discovery.
- Workbook: `work/Test Cases/Test Case - <suffix>.xlsx` (`Test Case - Generated.xlsx` if the suffix is blank). Workbooks are gitignored.

---

## Step 1: Input

The user gave: `{{user_input}}`

**A. Absolute path** — a `spec.md` → use it alone; a folder → use every `spec.md` in it. Skip discovery; go to Step 1.5 with one group and a blank suffix.

**B. Name or description** → Step 1.1.

**C. Empty** → Step 1.2.

## Step 1.1: Discovery

Search active changes:
```
openspec/changes/*/specs/**/spec.md
```
Leave out `openspec/changes/archive/` unless the input contains "archive" or "archived"; then also search `openspec/changes/archive/*/specs/**/spec.md`.

A file is a candidate when the change folder name, a path segment, or a `##` / `###` heading inside it matches words from the input. If nothing matches, say so and suggest running with no input to browse. Don't continue without sources.

## Step 1.2: Browse

List active changes (not archive) that contain at least one `spec.md` as a numbered menu:

> No input given. Active changes with specs:
>
> 1. `add-login-otp` — specs/auth/spec.md
> 2. `add-booking-cancel` — specs/booking/spec.md, specs/notifications/spec.md
>
> Which ones? Name them, give numbers, or say "all".

Wait for the answer, then go to Step 1.5.

## Step 1.5: Manifest review

Group the specs: files in the same feature area → one workbook; unrelated files → separate workbooks. Propose an output suffix per group (e.g. "Login OTP").

Create the run folder:
```powershell
$runId = (Get-Date).ToUniversalTime().ToString("yyyyMMddTHHmmssZ") + "-<slug of the input, or 'batch' if empty>"
New-Item -ItemType Directory -Force "work\Test Cases\$runId" | Out-Null
```
Slug: lowercase; anything outside `[a-z0-9-]` becomes `-`; collapse repeats; trim `-` at both ends.

Write `temp_manifest.json`:
```json
{
  "groups": [
    {
      "outputSuffix": "Login OTP",
      "sources": ["openspec/changes/add-login-otp/specs/auth/spec.md"]
    },
    {
      "outputSuffix": "Booking Cancel",
      "sources": ["openspec/changes/add-booking-cancel/specs/booking/spec.md"]
    }
  ]
}
```

Tell the user:

> I found these sources. Review `work/Test Cases/<run-id>/temp_manifest.json` — add or remove sources, rename suffixes, merge or split groups. The file is kept, so you can regenerate later. Reply "ready" when done.
>
> **Group 1 → Test Case - Login OTP.xlsx** — openspec/changes/add-login-otp/specs/auth/spec.md
> **Group 2 → Test Case - Booking Cancel.xlsx** — openspec/changes/add-booking-cancel/specs/booking/spec.md

Wait for "ready".

## Step 1.6: Read back the manifest

For each group:
1. Trim `outputSuffix`; blank → `Generated`.
2. Reject suffixes containing `< > : " / \ | ? *` and ask for another.
3. Output path: `work/Test Cases/Test Case - <suffix>.xlsx`.
4. If that file exists, warn and ask before overwriting (it replaces any results typed into it).
5. Create `work/Test Cases/<run-id>/<suffix-slug>/`.

## Step 2: Metadata

Ask once, for all groups:

1. **Author**
2. **System Name** (e.g. Point Barbershop System)
3. **Sub System Name** (e.g. Login OTP)

Wait for the answers.

---

## Per group: Steps 3–6

Finish one group before starting the next.

### Step 3: Write the cases

Read every `spec.md` in the group. Use the requirements, scenarios, business rules, roles, statuses, input limits and side effects. Where the spec refers to decision IDs (D-xxx), API rules (API-…, P4.…), UI rules (AD-… / FE-…) or ADRs, read those too: `docs/decisions/decision-register.md`, `docs/api/`, `docs/ux/`, `docs/adr/`, `docs/db/` in this repo. Use the people, branches, prices and dates of `docs/plan/spec-fixtures.md` — the scenarios already do — so that every workbook tells the same story. Sign-in steps are passwordless (e-mail code read from Mailpit); never write a password step.

Consider, where relevant:

1. **Normal flow** — expected success with representative valid input.
2. **Errors** — invalid or missing input, forbidden actions, unsupported conditions, the error the app shows.
3. **Boundaries** — minimum / maximum, just below and just above each limit, empty / zero / first / last.
4. **Rule combinations** — decision-table thinking; only combinations that behave differently.
5. **Roles and permissions** — only where outcomes differ between roles, branches or ownership.
6. **Status transitions** — important valid transitions, and invalid ones reachable from the UI.
7. **Side effects** — records created or changed, notifications, receipts, files, calculated values shown.
8. **Regression** — nearby existing flows the change could break; targeted, not broad.

**Keep it small.** Merge or drop cases that test the same behavior, differ only by equivalent values, or are already covered. Use equivalence partitioning; pairwise for large combinations unless the spec demands exhaustive coverage. Rough size: small change 3–10, normal feature 10–25, complex rules 20–40.

**Classification** — exactly one per case:
- `Normal` — valid input or expected successful flow
- `Abnormal` — invalid input, forbidden operation, error, failed transition
- `Boundary` — the main purpose is an edge, minimum, maximum or limit

**Executable.** Every case must be runnable or triageable by the `point-browser-tester` skill. Don't drop an important case just because the browser can't prove it — mark its scope. Start every `Test method` with exactly this block:

```text
Scope: browser | browser-context | standalone-api-db | ambiguous
Mutation: read-only | data-mutating | RBAC-mutating
Preconditions: <exact fixture, account, screen or data state>
Steps:
1. <action>
2. <action>
Cleanup: <None, or how to restore and how to confirm it>
```

- `browser` — proven from what the screen shows.
- `browser-context` — may also use sanitized request method / URL / status / timing, console errors, or route interception, when the result is visible on screen. Never request bodies, headers, cookies, tokens or storage.
- `standalone-api-db` — outside browser testing; name the API or database check needed.
- `ambiguous` — mixes screen and backend checks. Split into two cases where possible; otherwise say exactly which part the browser can check.
- Every state change is `data-mutating` or `RBAC-mutating`. RBAC cases restore the permission and verify the restore.
- Expected results must be observable for the declared scope. A filled-in screen doesn't prove a database write.

### Step 3.5: Concrete values (required)

A tester must be able to compare the expected result with the screen without working anything out.

**Preconditions pin every input that affects the result**, with literal values: amounts in MMK, dates and times (MMT), quantities, rates, statuses, the branch, the barber, the setting and its value. Not "a discount on a sale" but "Sale at Branch B3, 1 haircut 25,000 MMK, discount request 10% approved by Ma Hnin". If you can't tell from the spec which settings matter, say so inside the case.

**Expected result states the value, not the direction:**

| Avoid | Use |
|---|---|
| "Total is reduced" | "Total = 22,500 MMK (25,000 − 10%)" |
| "An error is shown" | "The field shows 'Phone number is required'" |
| "The list is filtered" | "The list shows exactly 3 bookings: 10:00 Ko Aung, 11:30 Ko Aung, 14:00 Ko Min" |

- Show the working in brackets whenever a number is calculated.
- If a value can't be predicted from the spec, state which two figures must be equal and where each one is read on screen.
- Quote exact labels and messages.

**Choosing values:** round numbers that are easy to check by hand, but avoid values that hide mistakes (a quantity of 1, a rate of 1.0, a change exactly halfway through a period). Include at least one uneven case. Use the spec's numbers when it gives them; otherwise add `(values chosen for this fixture)`. Never put passwords or tokens in a case.

### Step 4: Review JSON

```json
{
  "meta": {
    "systemName": "<system name>",
    "subSystemName": "<sub system name>",
    "author": "<author>"
  },
  "tests": [
    {
      "selected": true,
      "Classification": "Normal",
      "Content": "Approved 10% discount request reduces the sale total",
      "Test method": "Scope: browser\nMutation: data-mutating\nPreconditions: Branch B3; barber Ko Aung; OPEN sale with 1 x Haircut 25,000 MMK; manager Ma Hnin has discount.approve (values chosen for this fixture)\nSteps:\n1. As Ko Aung, open the sale and tap \"Ask for discount\"\n2. Enter 10% and reason \"regular customer\", tap \"Send request\"\n3. As Ma Hnin, open the notification and tap \"Approve\"\n4. As Ko Aung, reopen the sale\nCleanup: Cancel the sale and confirm it shows status Cancelled",
      "Test result": "Discount = 2,500 MMK; Total = 22,500 MMK (25,000 − 10%)"
    }
  ]
}
```

Write it to `work/Test Cases/<run-id>/<suffix-slug>/temp_tests.json`. Keep these keys exactly.

### Step 5: Review

Tell the user:

> I wrote {{count}} test cases for **{{outputSuffix}}** in `work/Test Cases/<run-id>/<suffix-slug>/temp_tests.json`. Set `"selected": false` on any you want to leave out. Generate the Excel file now?

Wait for confirmation.

### Step 6: Generate and inspect

```powershell
New-Item -ItemType Directory -Force "work\Test Cases" | Out-Null
.venv\Scripts\python tools\point-testgen.py --input "work\Test Cases\<run-id>\<suffix-slug>\temp_tests.json" --template "templates\Test Case - Function.xlsx" --output "<output path>"
```

If `.venv\Scripts\python` or the tool is missing, stop and point the user to `SETUP.md`. If the file is open in Excel, ask the user to close it.

Then inspect the workbook:
```powershell
.venv\Scripts\python .claude\skills\point-browser-tester\scripts\workbook_tool.py inspect "<output path>"
```

Check that it finds exactly the number of selected cases, numbered 1, 2, 3… without gaps, each with content, test method and expected result. If not, fix the JSON and regenerate — never hand-edit the workbook.

Report the workbook path and: "Kept for editing / regeneration: `work/Test Cases/<run-id>/<suffix-slug>/temp_tests.json`". If a group fails, fix its JSON and re-run Step 6; don't move on to the next group.

## After all groups

Report: "Kept for editing / regeneration: `work/Test Cases/<run-id>/temp_manifest.json`", then list every workbook generated.
