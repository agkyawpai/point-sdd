# Brief: add-repo-scaffold

> Readable overview for the developers and the tester. The normative text is
> `openspec/changes/add-repo-scaffold/specs/platform-runtime/spec.md`; implementation choices are in `design.md`.

## Goal

Turn `point-barber` — today only the delivered starter files, no code — into a working, deployable skeleton: monorepo, the locked database loaded, an API that already answers in the locked error format, the two hosts routed as ADR-009 says, and a CI that blocks work breaking the locked rules. The next three changes build on it. No business feature, no login.

မြန်မာ: `point-barber` repo ကို နောက် change တွေ ဆက်ဆောက်လို့ရတဲ့ အခြေခံ ပုံစံ ဖြစ်အောင် လုပ်တာ — feature မပါ၊ login မပါ။ Owner က မေးခွန်း ၄ ခု (S2–S5) ဖြေပြီး — စလို့ရပြီ။

## Decisions

- **Implements:** D-PLT-02, D-PLT-06, D-PLT-08 (status endpoint only), D-PLT-15, D-PLT-17, D-DB-01, D-AUD-02, D-ARC-01, D-ARC-03, D-API-01, D-API-02 · P1.SYS.01, P1.SYS.02 · API-SHAPE-01..05, API-ERR-01..03, API-AUD-02, API-PERM-02, API-LIM-03 (list `limit` only), API-DATA-03, API-DATA-08 · AD-IMPL-01, AD-IMPL-03, FE-IMPL-01 (structure), AD-QA-01 (PR cites IDs) · ADR-001 action items 1–5, ADR-009, ADR-002, ADR-006, ADR-007, ADR-014, ADR-016.
- **Skeleton only (filled later):** D-PLT-01, D-PLT-03, D-PLT-16, D-ROLE-08, D-DB-03, D-DAT-03, ADR-013, AD-IMPL-05 (four rails switched on; the requirement is written by `add-shared-ui-components`).
- **New (proposed):** none. The four items this change raised (S2–S5) were answered by the owner on 02/Oct/2026 13:08 — see Open questions.
- **Depends on:** nothing. **Blocks:** `add-shared-ui-components`, `add-foundation-auth-access`, `add-walkin-visit-checkout`.
- **Owner:** Dev 2 (API, database, infrastructure, CI) with Dev 1 (web, `packages/ui`, `packages/i18n`, shell placeholders, Claude Code hook) — the one paired exception to "one developer per change", split by path.

## Actors & permissions

- **Anyone, no login** — reads `GET /api/v1/health` and `GET /api/v1/system/status` (both `@Public()`), opens the two placeholder pages. No permission code is used in this change.
- **Uptime monitor (later)** — the reader of the health endpoint (ADR-007).
- **Developers / CI** — run the gates. There is no staff or admin action.

## Flow

1. Developer clones `point-barber` beside `point-sdd`, adds two hosts-file lines (`point.test`, `app.point.test`), copies `.env.example` to `.env`, registers the OpenSpec store once.
2. `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d` starts Caddy, PostgreSQL 16, the API, the web app, an idle backup container, Mailpit.
3. `pnpm db:migrate` (= `node db/scripts/migrate.mjs`) loads the baseline (91 tables) and the role grants.
4. `https://app.point.test/api/v1/health` answers `{ "status": "ok", "time": "…+06:30" }`; `https://point.test/` shows the site placeholder; `https://app.point.test/` shows the staff placeholder.
5. Developer opens a pull request from `feature/<change-id>` (or `feature/<change-id>/<part>`) titled `<type>(<change-id>): <subject>`, e.g. `feat(add-repo-scaffold): health and status endpoints`; CI runs seven jobs; one review; test cases are run on the branch; squash merge.

No status changes — the change has no business record.

## Rules

- R1. The API lives under `/api/v1` on the web app's own origin; `v1` is the only version. (API-SHAPE-01, ADR-009)
- R2. On the public host only `/api/v1/public/*`, `/api/v1/health` and `/api/v1/system/status` reach the API; any other `/api/*` path — also one written with `..` — is a 404 with an empty body from the edge. (ADR-009)
- R3. On both hosts `/api/v1/internal/*` and `/internal/*` are a 404 with an empty body from the edge. (ADR-009, API-SHAPE-02)
- R4. `INTERNAL_OPS_KEY` is in the `api` and `backup` containers only; `INTERNAL_SSR_KEY` in `api` and `web` only. (API-SHAPE-02)
- R5. `GET /v1/health` is public and always 200 with exactly `status` (`ok` / `degraded`) and `time`. (P1.SYS.01)
- R6. `GET /v1/system/status` is public and returns `maintenance`, `until`, `message_mm`, `message_en`, `version`, `server_time`; in this change `maintenance` is always `false` and the three optional members are `null`. (P1.SYS.02, D-PLT-08)
- R7. Every timestamp the API sends is ISO 8601 with `+06:30`. (API-DATA-03, D-PLT-15)
- R8. Every error is `application/problem+json` with `type`, `title`, `status`, `code`, `request_id`; an unexpected failure is 500 `internal_error` with no detail of the failure. (API-ERR-01, API-ERR-02)
- R9. Every response has `X-Request-Id`: a server UUIDv7, or the client's value when — and only when — it is a UUID. (API-ERR-01, API-AUD-02)
- R10. An unknown path or method is 404 `not_found`; test fixture routes do not exist in the built images. (API-ERR-02)
- R11. A Zod schema failure is 400 `validation` with one `errors[]` item per field; the handler does not run. A field code is the Zod issue name (`too_small`, `too_big`, `invalid_type`) unless the schema names a catalogue code; `required` is never returned. An unreadable or over-1-MB JSON body is 400 `validation` with no items. (API-ERR-02, API-ERR-03)
- R12. List `limit` is an integer 1–100, default 25. (API-LIM-03, API-DATA-08)
- R13. The API reads and writes JSON only; member names are snake_case. (API-SHAPE-05, API-SHAPE-03)
- R14. No CORS middleware is registered; a preflight is 404. (API-SHAPE-01, ADR-009)
- R15. Every endpoint has exactly one access decorator; a missing or second one fails the build. (API-PERM-02)
- R16. Public host → `site` tree, staff host → `staff` tree; `/site*` and `/staff*` typed directly are 404; an unknown host is 404. The two pages shown now are temporary placeholders. (ADR-001)
- R17. A module imports another module only through its `index.ts`; the Prisma client is used only in repositories and `common/database`; the web app never imports it — a breach fails the build. (ADR-001)
- R18. The web app has no route handler under `/api` — a breach fails the build. (ADR-009)
- R19. Migrations on an empty PostgreSQL 16 give 91 tables, `btree_gist`, time zone `Asia/Yangon`; every constraint test row is `PASS`. (D-PLT-02, D-PLT-15)
- R20. The API's database role `point_app` can only INSERT and SELECT on `audit_events`, is not a superuser and cannot create databases. (D-AUD-02)
- R21. A later database change is made in point-sdd `docs/db/` first, then as a new forward migration in point-barber; every migration runs through `node db/scripts/migrate.mjs`. (design D4.6, D4.10)

## Scenarios

### S1: Health on the staff host (R1, R5, R7)
- WHEN the clock is 05/Oct/2026 10:42:00 AM MMT and `GET https://app.point.test/api/v1/health` is sent
- THEN 200 `{ "status": "ok", "time": "2026-10-05T10:42:00+06:30" }` and an `X-Request-Id` header

### S2: Database stopped (R5)
- WHEN the `postgres` container is stopped and the same request is sent
- THEN 200 with `status = "degraded"`, and nothing in the body except `status` and `time`

### S3: Staff login path on the public host (R2)
- WHEN `POST https://point.test/api/v1/auth/otp/request` is sent with `{ "email": "aung@point.test" }`
- THEN 404, empty body, no `X-Request-Id`, no `Set-Cookie`

### S4: Internal API from outside (R3)
- WHEN `POST https://app.point.test/api/v1/internal/backup-runs` is sent with `X-Internal-Key: anything`
- THEN 404, empty body, no `X-Request-Id`

### S5: Unknown route (R8, R10)
- WHEN `GET https://app.point.test/api/v1/does-not-exist` is sent with `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- THEN 404 `application/problem+json` `{ "type": "https://point.test/errors/not_found", "title": "Not found", "status": 404, "code": "not_found", "request_id": "0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70" }`

### S6: Request id that is not a UUID (R9)
- WHEN `GET https://app.point.test/api/v1/health` is sent with `X-Request-Id: sale-42`
- THEN 200, and the `X-Request-Id` response header is a new UUIDv7 — not `sale-42`

### S7: Limit boundaries (R11, R12)
- WHEN the fixture list is called with `limit=100`, then `limit=101`, then `limit=0`
- THEN 200 `{ "limit": 100 }` · 400 `validation` with `{ "field": "limit", "code": "too_big", "params": { "maximum": 100 } }` · 400 `validation` with `{ "field": "limit", "code": "too_small", "params": { "minimum": 1 } }`

### S8: The two trees (R16)
- WHEN a browser opens `https://point.test/`, `https://app.point.test/`, `https://point.test/staff`, `https://app.point.test/site`
- THEN the scaffold's site placeholder · the scaffold's staff placeholder · 404 · 404

### S9: Missing access decorator (R15)
- WHEN CI lints a controller method that has `@Get()` — or `@All()` — and no access decorator
- THEN lint fails with rule `point/one-access-decorator`

### S10: Audit rows cannot be changed (R20)
- WHEN a connection as `point_app` runs `UPDATE audit_events SET reason = 'x'`
- THEN PostgreSQL answers `permission denied for table audit_events`

### S11: Reaching into another module (R17)
- WHEN CI lints a file of module `sales` that imports `../platform/system/system.service`
- THEN lint fails with rule `no-restricted-imports`

## Screens / Form fields

No form and no real screen. Two placeholder pages exist only to prove routing:

| Page | URL | Content | Replaced by |
| --- | --- | --- | --- |
| Site placeholder | `https://point.test/` | `<main data-testid="site-placeholder">` with the tree name and the build version; no UI text | the home page — `add-public-website-pages` |
| Staff placeholder | `https://app.point.test/` | `<main data-testid="staff-placeholder">` with the tree name and the build version; no UI text | the login screen — `add-foundation-auth-access` |

Inputs the API accepts in this change (for the boundary cases):

| Field | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- |
| `X-Request-Id` (request header, every endpoint) | UUID string | ✖ | any UUID version, any letter case; anything else is ignored | server-generated UUIDv7 | none — never an error |
| `limit` (query, every list endpoint; only the test fixture list exists now) | integer | ✖ | 1–100 | 25 | `error.validation` with field code `too_small` (below 1), `too_big` (above 100), `invalid_type` (not a number) — Zod issue names, API-ERR-03 |

Buttons: none. Permissions: none. After save: nothing is saved.

## Data

- **Tables:** all 91 tables of point-sdd `docs/db/` are created by the baseline migration, unchanged. This change's code reads none of them; the CI checks touch `audit_events` to prove the role grants.
- **DBML change:** none. The baseline is built from the files that are current in point-sdd `docs/db/` on the day task 3.1 runs (README load order — Part 5 v1.2 and Part 7 v1.2 are already there).
- **Roles:** owner role (migrations) and `point_app` (the API).

## Edge cases

- Database down → health says `degraded` (200), never a 5xx and never a hang (2-second ping timeout).
- UTC evening is already the next Myanmar day: `2026-10-04T17:30:00Z` is sent as `2026-10-05T00:00:00+06:30`.
- A look-alike path on the public host (`/api/v1/healthz`) and a dot-segment path (`/api/v1/public/../auth/otp/request`, also as `%2e%2e`) are refused at the edge.
- `/site` or `/staff` typed into the address bar → 404 on both hosts.
- A request with a forged `X-Internal-Key` from outside: the header is removed at the edge; `/api/v1/internal/*` is 404 anyway.
- A forged `X-Forwarded-For` does not change the client address the API records.
- A browser preflight (`OPTIONS`) → 404 `not_found`, no CORS header.
- A body that is not JSON, malformed JSON, or JSON above 1 MB → 400 `validation`.
- An unexpected exception → 500 with a `request_id`; the message and stack go to the log only. The query string of a request is never logged.
- A new database created from a template or a restored dump may lose the per-database time zone → the role setting and the API's start-up check catch it.
- Two developers add dependencies at the same time → lockfile conflict is resolved by rebase + `pnpm install`.
- No internet / double tap / closed day / late entry: not applicable — nothing is written.

## Out of scope

- Login, sessions, CSRF, `/me`, permission guard, the other access decorators, seed data, first background job → `add-foundation-auth-access`.
- Tokens, Tailwind / shadcn/ui, shared components, formatters, money type, language files, next-intl, `/dev/ui` → `add-shared-ui-components`.
- Site locale segment, language redirect, the revalidate handler → `add-public-website-pages`.
- Chromium + fonts in the API image → `add-walkin-visit-checkout`.
- First deployment, SSH deploy job, registry, Sentry / HetrixTools / Resend → `add-staging-deploy`.
- Backup schedule and restore test → `add-backup-restore` · maintenance mode ON → `add-settings-store` · Socket.IO → `add-realtime-gateway` · uploads and the first content-security policy source → `add-attachments-upload` · Android and Windows shells → `add-android-shell`, `add-windows-shell`.
- The heavier CI checks of the coding guideline's §24 → `add-ci-guard-rails` (roadmap row to be added by the lead).
- The 600 requests / minute / session cap → no roadmap row yet (to be added by the lead).

## Open questions

None — the change is ready to apply.

## Answers to Claude's questions

Answered by the owner on 02/Oct/2026 13:08 (review v5.2.17 §0.11):

- **S2 — size.** The change stays whole (20 requirements, 72 scenarios, 94 tasks) — an accepted exception to "1–3 days, about 20–30 test cases"; eight pull requests, the test workbook is run on the last one. (D-PLT-20)
- **S3 — capability `platform-runtime`.** Approved. (D-PLT-20, `openspec/config.yaml`)
- **S4 — `code` for an unexpected 500.** `internal_error`; the body carries `request_id` and no detail. (API-ERR-02, Part 0 v1.6)
- **S5 — field-level codes of a schema failure.** The Zod issue names `too_small`, `too_big`, `invalid_type`, unless the schema names a catalogue code such as `phone_invalid`; `required`, `date_invalid`, `unknown` are client-only and never returned by the API. The language keys are added by `add-shared-ui-components`. (API-ERR-03, Part 0 v1.6)

Owner item (not a question): branch protection on a private GitHub repository needs a paid plan.
