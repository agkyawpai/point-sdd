---
name: point-browser-tester
description: Execute or resume a Point Barbershop System Excel test workbook through the browser UI with Playwright - case triage, screenshots, sanitized console/network evidence, approval-gated mutations, checkpointed results and safe OK/NG workbook updates. Use when the user asks to run, execute or re-run test cases from a "Test Case - <topic>.xlsx" workbook against a running environment. Not for standalone API or database validation.
---

# Run Point test workbooks in the browser

Execute workbook rows through what a user can see in the browser and record exactly what was observed. A screen that shows data proves the screen, not the request payload, the database row or the transaction outcome; never claim more than the evidence shows.

## Tools

| What | Command / path |
|---|---|
| Inspect a workbook | `.venv\Scripts\python .claude\skills\point-browser-tester\scripts\workbook_tool.py inspect "<workbook>"` |
| Apply finished results | `.venv\Scripts\python .claude\skills\point-browser-tester\scripts\workbook_tool.py apply-results "<workbook>" "<run>\results.json" "<run>"` |
| Harness (require from runners) | `.claude/skills/point-browser-tester/scripts/harness.js` |
| Case runners you write | `work/browser-tests/<topic-slug>/run-cases.js` |
| Evidence | `<workbook directory>/<Topic> Evidence/runs/<run-id>/` with `results.json`, `summary.md`, `screenshots/`, `diagnostics/` |
| Playwright | `npm install` at the repo root, then `npx playwright install chromium` if no browser is installed |

Workbooks normally live in `work/Test Cases/Test Case - <Topic>.xlsx` (written by `point-generate-tests`).

## Required sequence

1. **Inspect first.** Run `inspect` before asking the user anything. Use the sheet, header row, case rows and column letters it reports. Never compute rows as `caseNo + offset` and never hard-code column letters.
2. **Triage every requested row** using `references/case-triage.md`. The `scope` field comes from the `Scope:` line of the Test method: run `browser` and `browser-context` rows; record `standalone-api-db` rows as `OUT_OF_SCOPE`; for `ambiguous` rows run the visible part and state what stays unverified. Re-check the declared scope against the steps; if the steps need the DB or crafted API calls, treat it as out of scope regardless of the label.
3. **Classify mutation** from the `Mutation:` line (`read-only`, `data-mutating`, `RBAC-mutating`). Call `assertMutationApproved(mutation)` before the first state change in a case. Read-only cases run immediately. Data changes need `--approve-mutations`; RBAC changes need `--approve-mutations --approve-rbac-mutations` plus verified restoration. Ask the user for approval; never add the flag yourself without it.
4. **Gather only run-critical inputs** (`references/run-flow.md`): base URL, environment name, credential profile(s), tenant/shop if login needs it, and any case selection.
5. **Write the runner** under `work/browser-tests/<topic-slug>/` following `references/case-module-contract.md`. It requires the harness and must not re-implement credentials, run directories, evidence, results or workbook updates.
6. **Run in checkpointed batches.** Each attempt creates a new timestamped run. Resume only with an explicit `--resume <run-id>`; the harness reloads that run's results and skips finished cases. Never merge results from different runs by hand.
7. **Apply results** after the run is finalized and you have reviewed `results.json`. Only `PASS` -> `OK` and `FAIL` -> `NG` are written (with tester and test date); every other status leaves the row untouched. The tool validates everything before writing and keeps a backup in the run directory.
8. **Hand off** with the totals and paths listed in `references/run-flow.md`.

## Result contract

Statuses in `results.json`: `PASS`, `FAIL`, `BLOCKED`, `OUT_OF_SCOPE`, `NOT_RUN`.

- `FAIL` = the product visibly contradicts the expected result.
- `BLOCKED` = missing data, unavailable credentials, environment or network errors, browser/tooling limits, missing approval, or cleanup that could not be verified.
- `OUT_OF_SCOPE` = cannot be proven from browser evidence alone.

Each case carries `caseNo`, `status`, `observed` and `evidence` (paths relative to the run directory), plus `row`, `scope`, `mutation`, `expected`, `blocker`, `cleanup`, `tester` and `date` when relevant. The harness rejects absolute or `..` evidence paths and drops any field outside this list.

## Credentials and evidence

- **The Point staff app has no passwords** (D-AUTH-01: Google or an 8-digit e-mail code). Runners sign in with the e-mail code: the profile's address comes from `POINT_TEST_<PROFILE>_EMAIL` (for example `POINT_TEST_BARBER_EMAIL=aung@point.test` — the people of `docs/plan/spec-fixtures.md`) through `getLoginEmail`, the runner requests a code on the login screen, and `fetchLoginCode({ email, after, run })` reads it from Mailpit — `after` = the time taken just before the request and `run` are both required, so an older code is never typed and the code is always redacted (`POINT_TEST_MAILPIT_URL`, e.g. `http://localhost:8025` — test environments only, ADR-007). There is no test-only login and Google sign-in is tested by hand. Sign in **once per profile per run** and reuse the session — the app allows 10 code requests and 10 code verifies per hour per IP (API-LIM-02). If the address or Mailpit is unavailable, record the affected cases as `BLOCKED`. `getCredentials` (`_USER` / `_PASSWORD`) remains only for a system that has passwords; never ask the user to paste a password or a code into the chat.
- Never write credentials into source, logs, screenshots, JSON, Markdown, storage state or commits. The harness redacts known secret values and token-like text from everything it writes.
- Browser-context evidence is limited to screenshots, sanitized console and page errors, and allowlisted request metadata (method, URL with sensitive query values redacted, status, resource type, timing). Never save request or response bodies, headers, cookies or storage state.
- `work/` is local output; durable, reusable logic belongs in this skill's `scripts/` with tests in `tests/`.

## References

Read before executing: `references/case-triage.md`, `references/run-flow.md`, `references/evidence-conventions.md`, `references/case-module-contract.md`. The scripts and their tests (`node --test .claude/skills/point-browser-tester/tests/harness.test.js`, `.venv\Scripts\python -m unittest discover -s .claude/skills/point-browser-tester/tests -p "test_*.py"`) are the source of truth for harness behavior.

Report every out-of-scope row explicitly; never leave a requested row unaccounted for.
