# Run flow

## 1. Inspect

```
.venv\Scripts\python .claude\skills\point-browser-tester\scripts\workbook_tool.py inspect "work\Test Cases\Test Case - <Topic>.xlsx"
```

Keep the JSON. It tells you the sheet names, the test-case sheet, header row, column letters (`caseNo`, `classification`, `content`, `method`, `expected`, `tester`, `date`, `result`, `ngReport`, `confirmedDate`), the List sheet values, and per case its row, text, `scope` and `mutation`. Do this before asking the user anything the workbook already answers.

## 2. Gather run-critical inputs only

- base URL of the Point web app (pass as `POINT_TEST_BASE_URL`)
- environment name (`POINT_TEST_ENVIRONMENT`, e.g. `local`, `staging`)
- credential profile(s) per role the cases need (owner, manager, barber, front desk, ...). The user sets `POINT_TEST_<PROFILE>_USER` / `POINT_TEST_<PROFILE>_PASSWORD` in their own shell or types them into the hidden prompt. Never take passwords through the chat.
- shop/tenant if sign-in depends on it
- which cases to run, if not all (`--cases 1,3,5-8`)
- tester name for the workbook (`POINT_TEST_TESTER`, ideally from the List sheet)

If sign-in redirects through another page, follow the chain and return to the target page afterwards.

## 3. Preflight

Before launching the browser confirm: runner path, base URL, credential source, viewport, the selected cases with their scope and mutation class, and which approvals are present. If a selected case is `data-mutating` or `RBAC-mutating` and the user has not approved it, stop and ask; do not run the rest silently.

## 4. Browser capability

Check that Playwright resolves from the repo root (`node -e "require('playwright')"`). If not, ask to run `npm install` and, if needed, `npx playwright install chromium`. Never report a case as executed when no browser ran.

## 5. Execute

```
node work\browser-tests\<topic-slug>\run-cases.js [--cases 1-5] [--approve-mutations] [--approve-rbac-mutations]
node work\browser-tests\<topic-slug>\run-cases.js --resume <run-id> [...]
```

- `results.json` is checkpointed after every case.
- Every attempt is a new run directory. Resume only by passing the run id; resumed runs must match topic, workbook and environment, keep earlier results and skip cases already recorded.
- Keep batches small; isolate flaky or stateful cases.
- Reuse records created by earlier cases only when it keeps the run traceable, and say so in `observed`.
- Cleanup for mutating cases runs in `finally`. If restoration cannot be verified, record `BLOCKED`, call `abortMutations(run, reason)` and skip the remaining mutating cases.

## 6. Preserve observations

On failure capture the page state, the URL when relevant, and the exact visible symptom. Do not rewrite a note to match the expected result.

## 7. Classify blockers

Use one of these in `blocker` / the summary:

- product failure (that is `FAIL`, not a blocker)
- environment or data issue
- browser or tooling limitation
- missing approval or credentials
- out of scope for browser-only execution

Everything except product failure is `BLOCKED` or `OUT_OF_SCOPE`.

## 8. Apply and hand off

After `finalizeRun` and a review of `results.json`:

```
.venv\Scripts\python .claude\skills\point-browser-tester\scripts\workbook_tool.py apply-results "<workbook>" "<run>\results.json" "<run>"
```

It refuses to write if the run is not finalized, belongs to another workbook, has duplicate or unknown case numbers, invalid statuses, non-relative evidence, credential-like fields, or rows that no longer match. Close the workbook in Excel first. It prints applied/skipped cases and OK/NG totals.

Tell the user:

- executed case numbers, and out-of-scope case numbers
- PASS / FAIL / BLOCKED / OUT_OF_SCOPE / NOT_RUN totals, plus OK / NG written to Excel
- paths to `results.json`, `summary.md` and the evidence folder
- the most important failures and blockers, with their unverified parts
