# Case module contract

A case runner lives at `work/browser-tests/<topic-slug>/run-cases.js`. It owns selectors and business steps. The harness owns credentials, mutation gates, run directories, checkpoints, diagnostics, screenshots, the result shape and the summary. Workbook updates are done only by `workbook_tool.py apply-results`; a runner never edits the workbook.

Rules:

- Take case numbers, rows, scope and mutation from the `inspect` manifest; do not compute rows.
- One `addCaseResult` per case, called as soon as the case ends.
- Call `assertMutationApproved` before the first state change of a mutating case; turn a refusal into `BLOCKED`.
- Cleanup goes in `finally`. If restoration cannot be verified, record `BLOCKED` and call `abortMutations`; skip later mutating cases once `run.aborted` is set.
- The sign-in e-mail and the e-mail code are used only to fill the sign-in form. Never put them in results, notes, screenshots, file names or console output.
- Fail closed: an unexpected exception inside a case is `BLOCKED` with the error message (the harness redacts secrets), not `PASS`.

## Skeleton

```js
'use strict';

const path = require('node:path');
const { chromium } = require('playwright');
const {
  abortMutations,
  addCaseResult,
  assertMutationApproved,
  attachPageListeners,
  createRun,
  fetchLoginCode,
  finalizeRun,
  getLoginEmail,
  parseRunArgs,
  screenshot,
  shouldRunCase,
} = require('../../../.claude/skills/point-browser-tester/scripts/harness');

const WORKBOOK = path.resolve(__dirname, '../../Test Cases/Test Case - Customers.xlsx');
// Copied from the inspect manifest: caseNo, row, scope, mutation.
const CASES = [
  { caseNo: 1, row: 7, scope: 'browser', mutation: 'read-only', run: listShowsCustomers },
  { caseNo: 2, row: 8, scope: 'browser', mutation: 'data-mutating', run: createCustomer },
];

async function main() {
  const args = parseRunArgs();
  const baseUrl = process.env.POINT_TEST_BASE_URL;
  const run = await createRun({
    evidenceRoot: path.dirname(WORKBOOK),
    topic: 'Customers',
    workbook: path.basename(WORKBOOK),
    environment: process.env.POINT_TEST_ENVIRONMENT || 'local',
    runId: args.runId,
  });

  let email = null;
  try {
    email = await getLoginEmail('admin', { run }); // POINT_TEST_ADMIN_EMAIL - no password
  } catch (error) {
    for (const item of CASES) {
      if (shouldRunCase(run, item.caseNo, args)) {
        addCaseResult(run, { caseNo: item.caseNo, row: item.row, status: 'BLOCKED', scope: item.scope, mutation: item.mutation, blocker: error.message });
      }
    }
    console.log(await finalizeRun(run));
    return;
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  let currentCase;
  attachPageListeners(run, page, { getCaseNo: () => currentCase });

  try {
    try {
      await signIn(run, page, baseUrl, email);
    } catch (error) {
      // Mailpit not reachable or no code in time (CREDENTIALS_UNAVAILABLE), or the login screen failed:
      // every selected case is BLOCKED and the run is still finalized below - never a crash.
      for (const item of CASES) {
        if (shouldRunCase(run, item.caseNo, args)) {
          addCaseResult(run, { caseNo: item.caseNo, row: item.row, status: 'BLOCKED', scope: item.scope, mutation: item.mutation, blocker: `Sign-in failed: ${error.message}` });
        }
      }
      return;
    }
    for (const item of CASES) {
      if (!shouldRunCase(run, item.caseNo, args)) continue;
      currentCase = item.caseNo;
      const base = { caseNo: item.caseNo, row: item.row, scope: item.scope, mutation: item.mutation };
      if (item.mutation !== 'read-only' && run.aborted) {
        addCaseResult(run, { ...base, status: 'BLOCKED', blocker: `Mutating cases stopped: ${run.aborted}` });
        continue;
      }
      try {
        assertMutationApproved(item.mutation, args);
      } catch (error) {
        addCaseResult(run, { ...base, status: 'BLOCKED', blocker: error.message });
        continue;
      }
      try {
        const outcome = await item.run({ run, page, baseUrl });
        addCaseResult(run, { ...base, ...outcome });
      } catch (error) {
        addCaseResult(run, { ...base, status: 'BLOCKED', blocker: `Runner error: ${error.message}` });
      }
    }
  } finally {
    await context.close();
    await browser.close();
    console.log(await finalizeRun(run)); // also reached after the early return above
  }
}

// Point has no passwords: sign in with the e-mail code read from Mailpit.
async function signIn(run, page, baseUrl, email) {
  await page.goto(new URL('/login', baseUrl).toString());
  // Find elements by test id, never by visible text: the screen may be in Myanmar
  // (coding guideline CG-TEST-06). These ids are fixed by add-foundation-auth-access.
  const requestedAt = new Date(); // taken BEFORE the code is requested
  await page.getByTestId('login-email').fill(email);
  await page.getByTestId('login-send-code').click();
  const code = await fetchLoginCode({ email, after: requestedAt, run }); // `after` and `run` are required
  await page.getByTestId('login-code').fill(code);
  await page.getByTestId('login-submit').click();
}

async function listShowsCustomers({ run, page, baseUrl }) {
  await page.goto(new URL('/customers', baseUrl).toString());
  const visible = await page.getByRole('table').isVisible();
  const evidence = await screenshot(run, page, 'TC01-customer-list.png', { stampUrl: true });
  return visible
    ? { status: 'PASS', observed: 'Customer table is shown with active customers', evidence }
    : { status: 'FAIL', observed: 'No customer table was shown', evidence };
}

async function createCustomer({ run, page }) {
  let created = false;
  try {
    // ... create the record, screenshot, decide PASS/FAIL ...
    created = true;
    return { status: 'PASS', observed: '...', evidence: [], cleanup: 'Test customer deleted and absence confirmed in list' };
  } finally {
    if (created) {
      const restored = true; // delete the record and confirm it is gone
      if (!restored) abortMutations(run, 'Test customer from case 2 could not be removed');
    }
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
```

## Harness API

| Function | Purpose |
|---|---|
| `parseRunArgs(argv?)` | `--approve-mutations`, `--approve-rbac-mutations`, `--resume <id>` / `--run-id <id>`, `--cases 1,3-5` |
| `createRun({ evidenceRoot, topic, workbook, environment, runId?, tester?, date? })` | new run, or resume when `runId` is given |
| `shouldRunCase(run, caseNo, { cases })` | selected and not yet recorded in this run |
| `assertMutationApproved(mutation, options?)` | throws `MUTATION_NOT_APPROVED` without explicit approval (options, argv flags, or `POINT_APPROVE_MUTATIONS=1` / `POINT_APPROVE_RBAC_MUTATIONS=1`) |
| `getLoginEmail(profile, { run })` | env `POINT_TEST_<PROFILE>_EMAIL` (or `_USER`) or hidden prompt — the passwordless sign-in address; throws `CREDENTIALS_UNAVAILABLE` |
| `fetchLoginCode({ email, after, run })` | reads the newest 8-digit sign-in code sent **after `after`** to exactly `email` from Mailpit (`POINT_TEST_MAILPIT_URL`); registers it as a secret. `after` and `run` are **required** (`BAD_ARGUMENT` otherwise — an older code must never be typed: wrong codes count toward the 5-failure lock, D-AUTH-04). Throws `CREDENTIALS_UNAVAILABLE` when Mailpit is not set, cannot be reached, or no code arrives within 30 s → case `BLOCKED` |
| `getCredentials(profile, { run })` | password systems only (not the Point staff app): env `POINT_TEST_<PROFILE>_USER`/`_PASSWORD` or hidden prompt; throws `CREDENTIALS_UNAVAILABLE` |
| `attachPageListeners(run, page, { getCaseNo })` | console, page errors and xhr/fetch/document responses to `diagnostics/` |
| `recordConsole`, `recordPageError`, `recordNetwork` | manual diagnostic records, sanitized |
| `screenshot(run, page, 'TCnn-purpose.png', { stampUrl, fullPage })` | saves to `screenshots/`, returns the relative path |
| `addCaseResult(run, result)` | validates, sanitizes, checkpoints |
| `abortMutations(run, reason)` | stop later mutating cases after an unverified cleanup |
| `finalizeRun(run)` | sets `completedAt`, writes `summary.md`, returns counts |
