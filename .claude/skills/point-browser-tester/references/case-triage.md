# Case triage

Triage every requested row before opening the browser. The manifest from `workbook_tool.py inspect` is the source of truth: each case has `content`, `method`, `expected` (the "Test results" column), `classification` (Normal / Abnormal / Boundary) and, when the Test method declares them, `scope` and `mutation`.

The declared scope is a starting point, not a verdict. Read the steps and the expected result and confirm the row really can be proven from the browser.

## browser - run it

The expected result is fully visible in the UI, for example:

- sign-in, sign-out and access to pages per role (what a front-desk user can or cannot open)
- create, edit, cancel and validation on forms (customers, barbers, services, bookings)
- search, filters, sorting, pagination and the URL/query they produce
- list -> detail -> back-to-list navigation
- toasts, banners, error messages, disabled buttons, empty states
- layout at mobile or tablet widths
- field length limits and upload validation that the screen reports

## browser-context - run it

Still a UI flow, but the proof uses what the browser itself can observe or control:

- request method, URL, status and timing triggered by a UI action
- console errors and uncaught page errors
- Playwright route interception to force a failure the UI must handle (for example a 500 on save that must show an error and leave the list unchanged)
- the visible state after a submit

Never record request bodies, authorization headers, cookies, storage state or secrets.

## standalone-api-db - do not run

Record as `OUT_OF_SCOPE` with a note that backend/API/DB verification is needed, when the row requires:

- reading or seeding the database
- API calls crafted outside the UI
- proving an inserted/updated/soft-deleted row or a transaction rollback
- network or service failures that cannot be simulated from the page
- permission seeding or inspecting RBAC configuration directly
- verifying stored files or image URLs that the UI does not show

Only run these if the user explicitly widens the scope.

## ambiguous - run the visible part

When a row mixes visible behavior with backend assertions:

- run only the browser-visible portion
- say exactly what was observed
- say exactly what was not verified (for example "the booking disappears from the list; the soft-delete flag in the database was not checked")

Mark `PASS` or `FAIL` only on the part you observed, and put the unverified part in `observed`. If the visible part alone cannot decide the row, use `OUT_OF_SCOPE`.

## Mutation class

| Class | Meaning | Before acting |
|---|---|---|
| read-only | nothing is created, changed or deleted | run immediately |
| data-mutating | creates/edits/deletes business data | `--approve-mutations` from the user |
| RBAC-mutating | changes roles, permissions or user access | `--approve-mutations` and `--approve-rbac-mutations`, plus a verified restore |

If the Test method has no `Mutation:` line, decide from the steps and say which class you assumed. When in doubt, choose the stricter class.

## Expected versus observed

- UI matches the expected result -> `PASS`
- UI contradicts the expected result -> `FAIL`
- execution cannot proceed (data, environment, credentials, tooling, missing approval, unverified cleanup) -> `BLOCKED`
- browser evidence alone cannot decide -> `OUT_OF_SCOPE`
- selected but never attempted -> `NOT_RUN`

Never bend an observation to fit the expected result.
