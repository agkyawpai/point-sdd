# Evidence conventions

## Where evidence goes

`createRun` makes one directory per attempt beside the workbook:

```
<workbook directory>/<Topic> Evidence/runs/<yyyyMMddTHHmmssZ>-<topic-slug>-<6 hex>/
  results.json        machine-readable results, rewritten after every case
  summary.md          human-readable summary, written by finalizeRun
  screenshots/        TCnn-<purpose>.png
  diagnostics/        console.jsonl, page-errors.jsonl, network.jsonl
  Test Case - <Topic>-before.xlsx   backup written by apply-results
```

A fresh run never reuses a directory. Prior runs are never overwritten. Screenshots are not embedded in the workbook unless the user asks.

## Screenshot names

Plain file names, case number first, then purpose:

- `TC01-customer-list.png`
- `TC04-filled-booking-form.png`
- `TC04-booking-created.png`
- `TC09-page2-url.png`
- `TC12-required-name-error.png`

The harness only accepts `[A-Za-z0-9._-]+.png` and refuses to overwrite an existing screenshot in the same run, so take each shot once with a distinct name.

## results.json

Top level: `schemaVersion`, `runId`, `topic`, `workbook` (file name only), `environment`, `startedAt`, `host`, `completedAt` (after finalize), `resumedAt` (when resumed), `mutationsAborted` (when set), and `cases`.

Each case:

| Field | When |
|---|---|
| `caseNo` | always (workbook "No") |
| `row` | when known from the manifest; apply-results refuses rows that disagree with the workbook |
| `status` | always: PASS / FAIL / BLOCKED / OUT_OF_SCOPE / NOT_RUN |
| `observed` | always: short factual note of what was seen |
| `evidence` | list of run-relative paths |
| `scope`, `mutation` | when declared or decided |
| `expected` | when it helps reading the note |
| `blocker`, `cleanup` | when something stopped the case or data was restored |
| `tester`, `date` | default from `createRun({ tester, date })` or `POINT_TEST_TESTER`; date defaults to today as `yyyy/MM/dd` |

Use a tester name that appears in the workbook's List sheet (column B); apply-results warns otherwise.

## summary.md

Generated from the final `results.json` by `finalizeRun`. Never hand-edit totals or rows; if something is wrong, fix the run (resume it) and finalize again.

## Workbook updates

`apply-results` writes, for `PASS`/`FAIL` cases only: Result (`OK`/`NG`), Tester and Test Date, each into the top-left cell of the row's merged range. `BLOCKED`, `OUT_OF_SCOPE` and `NOT_RUN` rows stay exactly as they were; report them from `results.json` and `summary.md`. The NG Report and Confirmed date columns are left for a human.

## Route-sensitive cases

For navigation, pagination, filters and return-to-list behavior:

- take the screenshot with `{ stampUrl: true }` so the (sanitized) URL is visible in the image
- quote the observed URL behavior in `observed`
- URLs in diagnostics and stamps have credentials, tokens, codes and session-like query values replaced with `[REDACTED]`

## Mixed-scope cases

Save evidence for the visible part and state in `observed` what remains unverified.
