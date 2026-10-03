## Context

`point-barber` holds only the starter files delivered with ADR-016 action item 2: `README.md`, `CLAUDE.md`, `.gitignore`, `openspec/config.yaml` (the pointer, with comment lines), `docs/engineering/coding-guideline.md` and the `design-reference/` index files. There is no code. The architecture is fixed: ADR-001 (modular monolith, one PostgreSQL 16 database, one Next.js app serving two hosts, Docker Compose + Caddy), ADR-009 (one origin per app, API under `/api`), API Part 0 (🔒 D-API-01 — every ⚠️ rule there is binding, API-META-03) and API Part 1 (🔒 D-API-02). The owner approved the tooling on 02/Oct/2026 (pnpm workspaces + Turborepo, Node 24 LTS, TypeScript strict, ESLint + Prettier, Vitest, integration tests on a real PostgreSQL 16, Playwright, GitHub Actions, PR + 1 review + squash merge, Conventional Commits with the change id) and the two-repository layout (ADR-016: point-sdd = OpenSpec store, point-barber = code with a pointer `openspec/config.yaml`).

This document decides only what those sources leave to the implementer. Each decision names the ADR or rule that bounds it. Where it cites `CG-…`, the rule is in `point-barber/docs/engineering/coding-guideline.md`.

- **Tables:** all 91 tables of point-sdd `docs/db/` are created (unchanged). The code of this change reads none of them; the integration tests touch `audit_events` only to prove the role grants.
- **Endpoints:** P1.SYS.01 `GET /v1/health`, P1.SYS.02 `GET /v1/system/status`. Nothing else.
- **Shared components (AD-IMPL-02):** none — they are built by `add-shared-ui-components`.
- **Module service interfaces (ADR-001 rule 1):** none between business modules. The cross-cutting `common/database` exposes `TransactionRunner.run(fn)` (D4.8) and `common/http` exposes `RequestContext` (`request_id` now; user and session ids are added by `add-foundation-auth-access`).
- **Lock order (API-IDEM-06):** no row or advisory lock is taken in this change.

## Goals / Non-Goals

**Goals**

- `git clone` → `pnpm install` → `docker compose … up` gives a running stack on any developer machine (Windows included) and in CI, with production-shaped routing.
- The locked contracts that every later endpoint inherits are in place and tested once: error body, request id, validation, list limit, JSON only, access decorator rule, module boundaries.
- The locked database is loaded exactly as designed and its constraint tests run on every pull request.
- Two developers can work at the same time without editing the same files, and every pull request of this change has a CI that can be green on its own.

**Non-Goals** (each is listed with its owning change in proposal.md → Non-goals)

- No business feature, no login, no UI library, no language file, no real deployment, no backup run, no job queue, no Chromium in the API image, none of the heavier CI checks that decision D19 hands to `add-ci-guard-rails`.

## Decisions

### D1. Repository layout — bounded by ADR-001 action item 1, ADR-016, AD-IMPL-03

```
point-barber/
├── apps/
│   ├── api/                      NestJS
│   │   ├── src/main.ts · app.module.ts
│   │   ├── src/common/           config · database · http · access · logging   (cross-cutting, no business rule)
│   │   ├── src/modules/platform/ index.ts · system/ (health, status)           (the only module now)
│   │   ├── test/                 integration tests + test/fixtures/ (fixture controllers, test app only)
│   │   └── Dockerfile
│   ├── web/                      Next.js 16
│   │   ├── proxy.ts              host rewrite
│   │   ├── env.ts                the only reader of process.env in the web app
│   │   ├── app/layout.tsx · app/not-found.tsx
│   │   ├── app/site/page.tsx     placeholder (public host)
│   │   ├── app/staff/page.tsx    placeholder (staff host)
│   │   └── Dockerfile
│   ├── android/README.md         Capacitor shell — add-android-shell (ADR-003)
│   └── windows/README.md         Tauri shell — add-windows-shell
├── packages/
│   ├── shared/                   src/schemas/ (problem, health, system-status, list-query) · src/constants/ ·
│   │                             definitions/permissions.json · settings.json · notifications.json  (each `[]`)
│   ├── ui/                       README + empty src/index.ts      → add-shared-ui-components
│   ├── i18n/                     README + empty src/index.ts      → add-shared-ui-components
│   └── documents/                README + empty src/index.ts      → add-walkin-visit-checkout (receipt template, ADR-013)
├── db/
│   ├── source/                   verbatim copies from point-sdd docs/db + manifest.json (D4.1)
│   ├── migrations/               Prisma migration folders, raw SQL only
│   ├── schema.prisma             introspected, never hand-edited
│   ├── bootstrap/                00-roles.sh (wrapper) · 00-roles.sql — creates the login role point_app (D4.4)
│   └── scripts/                  migrate.mjs (the one migrate entry point) · build-baseline · run-constraint-tests ·
│                                 check-source · check-introspection · check-baseline
├── prisma.config.ts              schema path, migrations path, CLI connection (Prisma 7)
├── e2e/                          Playwright: smoke.spec.ts · edge.spec.ts
├── infra/
│   ├── caddy/Caddyfile
│   └── backup/Dockerfile         PostgreSQL client image, idle command
├── tools/
│   ├── eslint-plugin-point/      rule one-access-decorator + fixtures + test
│   ├── eslint/                   api.mjs · web.mjs · boundaries.mjs (composed by the root config) + fixtures/ + test/
│   ├── guards/                   run-all.mjs · check-css.mjs · check-web-api-routes.mjs · check-env-example.mjs ·
│   │                             check-migrations.mjs · check-math-random.mjs · check-pr-title.mjs · check-branch-name.mjs
│   └── claude-hooks/after-edit.mjs
├── docs/
│   ├── engineering/              README · coding-guideline.md (delivered) · local-setup.md · module-map.md · db-changes.md
│   └── ops/                      README · install.md · deploy.md · rollback.md · backup-restore.md · secrets-rotation.md
├── design-reference/             README.md · website/README.md · admin-panel/README.md   (delivered — kept as they are)
├── openspec/config.yaml          delivered pointer: comment lines + `store: point-sdd` — kept as it is
├── .github/                      workflows/ci.yml · pull_request_template.md
├── .claude/settings.json         hooks
├── CLAUDE.md                     delivered — kept as it is
├── docker-compose.yml · docker-compose.dev.yml · .env.example
├── package.json · pnpm-workspace.yaml · turbo.json · tsconfig.base.json · eslint.config.mjs
├── .prettierrc · .prettierignore · .editorconfig · .gitignore (delivered — extended) · .nvmrc · .npmrc
└── VERSIONS.md · README.md (delivered — replaced, as the delivered file itself says)
```

- **Delivered files are kept, not recreated.** `CLAUDE.md`, `docs/engineering/coding-guideline.md`, `openspec/config.yaml` and the three `design-reference` READMEs stay byte-identical in this change; `.gitignore` only gains entries; `README.md` is replaced because its own text says so.
- `openspec/` holds **only** `config.yaml`. With `changes/` or `specs/` beside it the OpenSpec CLI treats the folder as a real root and ignores the `store:` line.
- `docs/` in point-barber holds only engineering and operations documents. Decision register, DB design, UX guidelines, API design and ADRs stay in point-sdd (ADR-016); `docs/engineering/README.md` links to them by relative path `../point-sdd/docs/…`.
- Compose files sit at the repository root so `docker compose up` works from the root (ADR-001 "one `docker compose up`"); everything else infrastructure-related sits under `infra/`.
- **Module map — the 13 bounded contexts of ADR-001, fixed here and written to `docs/engineering/module-map.md`.** A module folder is created by the change that first needs it; only `platform` exists after this change. No other module folder is created by any change.

| Folder under `apps/api/src/modules/` | Owns (API part → resources) |
| --- | --- |
| `auth` | Part 1 — login, sessions, devices, one-time codes |
| `people` | Part 1 — company, branches, employees, branch assignments, roles, permissions |
| `catalog` | Part 2 — service categories, services, options, prices, eligibility |
| `scheduling` | Part 2 — patterns, shifts, availability, leave · Part 5 — attendance |
| `booking` | Part 3 — customers, bookings, cancel reasons, public booking |
| `delivery` | Part 4 — visits and visit lines |
| `sales` | Part 4 — sales, sale items, receipt counters, payment methods, payments, discounts, refunds, adjustments |
| `cash-closing` | Part 7 — daily closing, cash outs and returns (`DayLock`) |
| `commission` | Part 5 — commission plans and the estimate |
| `payroll` | Part 5 — salaries, payroll runs, payslips, receivables (`PayrollLock`) |
| `finance` | Part 7 — expenses, manual incomes, P&L |
| `inventory` | Part 6 |
| `platform` | Part 1 settings and system (health, status) · Part 8 — notifications, attachments and storage, audit, import / export, backup, website content, reports · jobs, documents, mail |

### D2. Toolchain and version pinning — bounded by ADR-001 action item 1, the owner's tooling approval, CG-DOC-04, CG-DEP-03

- Majors fixed by the sources: **Node 24 LTS**, **Next.js 16**, **PostgreSQL 16**. OpenSpec CLI **1.14.0** (point-sdd `openspec/config.yaml`).
- **Pin rule for everything else:** a tool is pinned at the **newest stable major that every plugin, preset and example of the coding guideline supports** — not at npm `latest`. Known consequences, each still to be confirmed on the day task 1.2 runs and marked "verified on <date>" in `VERSIONS.md`:
  - **Prisma** (`prisma` and `@prisma/client`): the **7.x** line, its newest stable release; never a pre-release and never a dist-tag that points at one. The guideline's examples and the `$transaction` lint are Prisma 7 API (guideline OPEN-CG-02); a move to another major is an ADR.
  - **TypeScript:** the newest major inside the peer range `typescript-eslint` declares, because the type-aware lint rules must run.
  - **ESLint:** one major that every plugin of guideline §24 accepts. A plugin with no release for that major is replaced by its maintained equivalent (for example `eslint-plugin-import-x` for `eslint-plugin-import`); the replacement and its rule prefix are written to `VERSIONS.md` and reported to the guideline's owner.
- `VERSIONS.md` has one row per tool: tool · pinned version · date · reason · what it was checked against (peer ranges). It covers Node, pnpm, Turborepo, TypeScript, ESLint and each plugin, Prettier, NestJS, Prisma, Next.js, React, Zod, Vitest, Playwright, pino, PostgreSQL, Caddy, the OpenSpec CLI; Capacitor and Tauri are recorded as "not installed — pinned by `add-android-shell` / `add-windows-shell`".
- Enforcement: root `package.json` `engines.node` and `packageManager`, `.nvmrc`, `.npmrc` `engine-strict=true` and `save-exact=true`, `pnpm install --frozen-lockfile` in CI and in the Dockerfiles; Docker base images pinned by tag to the same Node major and to `postgres:16`.
- An upgrade of a major is its own pull request that edits `VERSIONS.md`.
- TypeScript: one `tsconfig.base.json` with `strict`, `noUncheckedIndexedAccess`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch` (CG-TS-01); every workspace extends it.
- Turborepo tasks: `build`, `lint`, `typecheck`, `test` (unit), `test:int` (needs PostgreSQL), `e2e` (needs the Compose stack). Root scripts: `pnpm dev`, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:int`, `pnpm e2e`, `pnpm format`, `pnpm format:check`, `pnpm db:migrate`, `pnpm db:test`, `pnpm db:check-source`, `pnpm db:check-introspection`, `pnpm guards`.

### D3. Two developers, no shared files — bounded by D-PLT-14

One developer per change is the rule (D-PLT-14, owner sheet 2 #7). This change is the **paired exception**: it is tooling only, there is no vertical slice to own, and it is split by path so that the two developers never edit the same file.

| Owner | Paths |
| --- | --- |
| **Dev 2** | root tooling files, `apps/api/`, `packages/shared/`, `packages/documents/`, `db/`, `prisma.config.ts`, `infra/`, compose files, `.env.example`, `.github/`, `tools/eslint-plugin-point/`, `tools/eslint/api.mjs`, `tools/eslint/boundaries.mjs`, `tools/guards/run-all.mjs`, `check-env-example.mjs`, `check-migrations.mjs`, `check-math-random.mjs`, `check-pr-title.mjs`, `check-branch-name.mjs`, `docs/engineering/` (except the web section of `local-setup.md`), `docs/ops/`, `VERSIONS.md` |
| **Dev 1** | `apps/web/`, `packages/ui/`, `packages/i18n/`, `apps/android/`, `apps/windows/`, `tools/eslint/web.mjs`, `tools/guards/check-css.mjs`, `tools/guards/check-web-api-routes.mjs`, `tools/claude-hooks/`, `.claude/settings.json` |
| **Together** | `e2e/` and the verification group |

Order of pull requests (each squash-merged after one review by the other developer). The order is fixed because every pull request must be green on a CI that already exists:

1. **PR-A (Dev 2)** — group 1: root toolchain **and** `.github/workflows/ci.yml` with the jobs `static`, `unit` and `pr-title`, the PR template and the hooks. Merged before anyone else starts.
2. In parallel, each adding its own CI job to `ci.yml` in the same pull request: **PR-B (Dev 2)** database + job `db` · **PR-C (Dev 2)** `packages/shared`, API + job `integration` · **PR-D (Dev 1)** `packages/ui`, `packages/i18n`, shell placeholders, web (covered by `static` and `unit`).
3. **PR-E (Dev 2)** — after B, C and D: Dockerfiles, Caddyfile, compose files, `.env.example` + jobs `images` and `e2e` (stack up and health only).
4. Any time after PR-A: **PR-G (Dev 1)** web part of `local-setup.md`, Claude Code hook · **PR-H (Dev 2)** engineering docs and runbooks.
5. **PR-I (both)** — after E: `e2e/` smoke and edge tests against the full stack, then the verification group. PR-I stays open while the test workbook is run (D15).

`ci.yml` is edited only by Dev 2. The root `eslint.config.mjs` only composes the three files under `tools/eslint/`, so each developer edits their own rule file. One agreed exception to the path table: Dev 2 adds `apps/web/Dockerfile` (a new file, in PR-E) so that all image work is in one pull request. A dependency is added only to the `package.json` of the developer's own workspace; a lockfile conflict is resolved by rebasing and running `pnpm install`, never by hand.

Branches: CG-GIT-01 names `feature/<change-id>`. A change with several pull requests open at once needs several branches, so this change uses `feature/add-repo-scaffold/<part>` (`toolchain`, `db`, `api`, `web`, `infra`, `docs-web`, `docs-ops`, `e2e`); `check-branch-name.mjs` accepts `feature/<change-id>`, `feature/<change-id>/<part>` and `chore/<topic>`.

### D4. Database — bounded by the db README (load order, Prisma note, app role), review §5.2 (SQL-first), D-PLT-15, D-AUD-02, ADR-002, CG-DB-01, CG-DB-02

1. **Source copies.** `db/source/` holds byte-identical copies of the current point-sdd `docs/db/` files that the README load order names — `_generated-tables-part1-8.sql`, the nine `*-constraints.sql` files — plus the six `*-test.sql` files. `db/source/manifest.json` records, per file, its name, SHA-256 and the point-sdd commit it was copied from. No version number is hard-coded in a script: the scripts read the manifest. (DB Part 5 v1.2 and Part 7 v1.2 — OPEN-40 — are already in `docs/db/`; whatever is current on the day task 3.1 runs is what gets copied.) ADR-001 action item 4 writes the test path as `db/*-test.sql`; in this layout it is `db/source/*-test.sql`.
2. **Baseline migration.** `pnpm db:build-baseline` writes `db/migrations/<timestamp>_baseline/migration.sql` = a short preamble + the ten source files concatenated in README order, each preceded by a comment line with its file name and SHA-256. The preamble sets the database time zone: `DO $$ BEGIN EXECUTE format('ALTER DATABASE %I SET timezone TO %L', current_database(), 'Asia/Yangon'); END $$;`. `CREATE EXTENSION IF NOT EXISTS btree_gist` comes from the Part 2 constraint file as designed. The script is run once; the generated file is committed and never edited afterwards.
3. **Grants migration.** `db/migrations/<timestamp>_app_role_grants/migration.sql` (hand-written): `GRANT USAGE ON SCHEMA public`, `GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public`, `GRANT USAGE, SELECT ON ALL SEQUENCES` and matching `ALTER DEFAULT PRIVILEGES` for `point_app`; then `REVOKE UPDATE, DELETE, TRUNCATE ON audit_events FROM point_app` (the statement the Part 8 constraint file prescribes) and `REVOKE ALL ON _prisma_migrations FROM point_app` (the API has no reason to read or change the migration history). `point_app` keeps `DELETE` on other tables because some rows may really be deleted (expired `login_otps`, old notifications, draft lines — OPEN-40 (c)); D-DAT-05 is enforced by the services and the database triggers, not by grants.
4. **Roles.** `db/bootstrap/00-roles.sql` creates `point_app` (`LOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE`) and sets `ALTER ROLE point_app SET timezone = 'Asia/Yangon'`. Files in the `postgres` image's init directory cannot receive a psql variable, so the directory gets the wrapper `00-roles.sh`, which reads `POINT_APP_DB_PASSWORD` from the container environment and runs the SQL file with `psql -v`. CI and `docs/ops/install.md` call the same wrapper. Migrations run as the owner role (`POSTGRES_USER`); the API runs as `point_app`. Two connection strings: `MIGRATE_DATABASE_URL` (owner — used only by the migrate entry point, introspection and the test runner) and `DATABASE_URL` (`point_app` — the API). The backup sidecar's read-only role is created by `add-backup-restore` (ADR-002).
5. **Prisma.** Prisma 7 reads its paths from `prisma.config.ts` at the repository root: schema `db/schema.prisma`, migrations `db/migrations/`, CLI connection `MIGRATE_DATABASE_URL`. The schema is produced by `prisma db pull` from a freshly migrated database and committed; it is never edited by hand and never used to generate DDL (`prisma migrate dev` without `--create-only` is not used in this repository). CHECK, partial-unique, EXCLUDE constraints and triggers live only in the SQL. CI job `db` re-introspects and fails when the result differs from the committed file (`pnpm db:check-introspection`).
6. **One migrate entry point.** `db/scripts/migrate.mjs` is the only thing that migrates a database: `pnpm db:migrate`, the Compose `migrate` service, the CI jobs `db`, `integration` and `e2e`, and the deploy runbook all call `node db/scripts/migrate.mjs`. In this change it runs one step, `prisma migrate deploy`. A later change that needs an owner-role step after the migrations (the pg-boss schema install and its grants in `add-foundation-auth-access`) appends it to this script and is then picked up everywhere at once.
7. **Time zone, three layers.** (a) the baseline preamble sets the database default; (b) the role setting covers every database `point_app` connects to; (c) on its first successful connection the API runs `SHOW timezone` and exits with a fatal log line if the answer is not `Asia/Yangon`. `ALTER DATABASE … SET` is not copied by `CREATE DATABASE … TEMPLATE`, so the test runner connects with `PGTZ=Asia/Yangon`.
8. **Request context in transactions (API-AUD-01, CG-DB-03).** The **service** opens the transaction: `TransactionRunner.run(async (tx) => …)`, one per business action; there is no transaction interceptor. The runner opens a Prisma interactive transaction and first sets `app.request_id` with `set_config(…, true)` (the parameterised form of `SET LOCAL`) — plus `app.user_id` and `app.session_id` when the request context has them (it has neither in this change). The audit trigger casts `app.request_id` to `uuid` without a guard, which is why D6 lets only a UUID become the request id. Covered by an integration test that reads `current_setting('app.request_id')` inside the transaction. `$transaction` is callable only inside `src/common/database/` (lint — D19).
9. **Constraint test runner.** `pnpm db:test`: create `point_template` and migrate it once through the entry point; for each `db/source/*-test.sql` create a database from that template, run the file with `psql -v ON_ERROR_STOP=1 -At`, drop the database. The files end with a result query whose rows carry `PASS` or `FAIL`; the runner fails when any row is `FAIL`, when a file yields no result row, or when `psql` exits non-zero, and prints file name + label of each failing row. The parsing function is unit-tested with a canned `FAIL` row and an empty result.
10. **How a later database change flows.** (1) point-sdd: edit the DBML / constraint / test file in `docs/db/`, bump its version, add the README line and the decision-register note — reviewed there. (2) point-barber: write a new forward-only migration `db/migrations/<timestamp>_<change-id>/migration.sql` by hand (additive only during V1 — system-design §4.1, CG-DB-02); replace the changed files in `db/source/` and update the manifest; run `prisma db pull`; `pnpm db:test` must pass. The baseline is never rebuilt. This is written up in `docs/engineering/db-changes.md`.
11. **Drift and migration guards.** CI verifies that every file in `db/source/` matches its manifest hash (catches an edit made in point-barber). `pnpm db:check-source` additionally compares the hashes with `../point-sdd/docs/db/` when that sibling folder exists (the developers' `point/` workspace); it is part of the verification group and of the PR checklist for database changes. CI does not check out point-sdd (another GitHub owner — guideline OPEN-CG-04). `tools/guards/check-migrations.mjs` fails when a migration file that exists on `main` is modified or deleted, or when a new migration contains `DROP TABLE`, `DROP COLUMN`, `RENAME` or `ALTER COLUMN … TYPE` (CG-DB-02).

### D5. API bootstrap — bounded by ADR-009 (decision and action item 2), API-SHAPE-01, ADR-001 action item 2

- **Prefix and version.** `app.setGlobalPrefix('api')` — the call ADR-009 names — and **no NestJS URI versioning**. The version is part of each controller's path: `@Controller('v1/health')`, `@Controller('v1/system')`. Three reasons: it is the literal ADR-009 decision; API-SHAPE-01 says a later breaking change is "`/v2` for the changed resources only", which is a per-controller choice; and it is how the API documents and the guideline's CG-API-01 example (`@Controller('v1/expenses')`) already write paths. A second `/v1` can therefore never be added by a framework setting.
- **HTTP adapter: Express** (the NestJS default). Two consequences are handled explicitly: Express answers `OPTIONS` on a known path with 200 and an `Allow` header, so a global handler registered before the routes turns every `OPTIONS` request into the 404 `not_found` problem (there is no CORS and no endpoint defines `OPTIONS`); `HEAD` on a `GET` route keeps its HTTP meaning and is not an "undefined method".
- Listens on `0.0.0.0:3001` (`api:3001` on the Docker network — ADR-009). `trust proxy` = one hop (Caddy): the client address the API uses — and later the rate-limit key — is the address Caddy saw, never a client-sent `X-Forwarded-For` value (D12).
- CORS is not enabled; no `enableCors()` call and no CORS package. A unit test asserts the bootstrap source contains neither.
- Body parsing: JSON only, limit 1 MB (uploads get their own multipart route in `add-attachments-upload`); the URL-encoded parser is not registered.
- Environment is validated at start by a Zod schema in `src/common/config/` — the only place in the API that reads `process.env` (lint — D19); a missing or malformed variable stops the process with the variable's name. Variables read now: `DATABASE_URL`, `SITE_ORIGIN`, `APP_ORIGIN`, `API_PORT`, `LOG_LEVEL`, `INTERNAL_SSR_KEY`, `INTERNAL_OPS_KEY` (the two keys are required to be present and different; no code uses them yet) — all required — and `APP_VERSION`, optional with default `0.0.0-dev` (D9).
- OpenAPI is generated from the Zod schemas in `packages/shared` (API-ERR-03) by `pnpm --filter api openapi` into `apps/api/dist/openapi.json` with `servers: [{ url: '/api/v1' }]` and paths written relative to it (`/health`, `/system/status` — as `openapi/part1-foundation.yaml` does). No documentation endpoint is served. A unit test checks that the generated `Problem` and `SystemStatus` schemas have the required members and types of Part 1. The full contract comparison (`openapi:check`) belongs to `add-ci-guard-rails`.
- Logs: structured JSON to stdout (ADR-007 decision 5) with `request_id`, method, **path without the query string**, status, duration and `client_ip` on every request. The query string is never logged: token-bearing queries arrive with later changes (the Google callback's `code` and `state`, booking manage tokens — CG-SEC-06). No error-tracking SDK yet (needs the owner's account — `add-staging-deploy`).

### D6. Request id — bounded by API-ERR-01, API-AUD-02

A middleware that runs before everything else: if the `X-Request-Id` header matches the general UUID pattern (8-4-4-4-12 hex, any version, case-insensitive) it is used in lower case; otherwise a UUIDv7 is generated. The id is stored in an `AsyncLocalStorage` request context, set on the response header immediately (so 404s and errors carry it too) and attached to every log line.

### D7. Problem filter — bounded by API-ERR-01, API-ERR-02, system-design §3.5

One global exception filter produces every error body.

| Thrown | Status | `code` | Notes |
| --- | --- | --- | --- |
| `ProblemException(code, status, { detail?, errors?, context? })` | as given | as given | the only way modules raise errors; codes are constants in `packages/shared` |
| Zod failure in the validation pipe | 400 | `validation` | `errors[]` filled (D8) |
| Unparseable JSON body, or a JSON body above the 1 MB limit | 400 | `validation` | `errors: []` — the body could not be read (recorded reading 5 in the proposal: API-SHAPE-04 lists no 413) |
| Framework "route not found", and every `OPTIONS` request | 404 | `not_found` | also an undefined method on a known path |
| Anything else | 500 | `internal_error` | API-ERR-02 (Part 0 v1.6 — owner answer S4); logged with stack and `request_id`; the body carries `request_id` and no `detail` |

- `type` = `<SITE_ORIGIN>/errors/<code>` — API-ERR-01 shows `https://point.example/errors/slot_taken` with the ★ domain placeholder as an example and the OpenAPI `Problem` does not require the member; emitting it on every problem is recorded reading 4 in the proposal. The URI is an identifier and need not resolve.
- `title` = the code as a sentence (`not_found` → `Not found`). `detail` is optional English developer text.
- `Content-Type: application/problem+json`. Success bodies: `application/json; charset=utf-8`.
- Codes added to `packages/shared/src/constants/error-codes.ts` now: `validation`, `not_found`, `internal_error`. Every later change adds its own from API-ERR-02 or its part's table.

### D8. Validation and list query — bounded by API-ERR-03, API-DATA-08, API-LIM-03

- `ZodValidationPipe` is applied per parameter through small decorators (`@ZBody(schema)`, `@ZQuery(schema)`, `@ZParam(schema)`). No class-validator.
- Issue → `errors[]` item: `field` = the issue path joined with dots, array positions as `[n]` (`items[1].quantity`); `code` = the catalogue code the schema attached to the issue when it has one, otherwise the Zod issue name unchanged — `too_small`, `too_big`, `invalid_type` (API-ERR-03, Part 0 v1.6 — owner answer S5); the mapper never produces `required`, `date_invalid` or `unknown`, which are client-only message keys; `params` = `{ minimum }`, `{ maximum }` or `{ expected }` when the issue has that datum.
- `listQuerySchema` in `packages/shared`: `limit` = coerced integer, min 1, max 100, default 25 (the `Limit` parameter of `openapi/part1-foundation.yaml`); `cursor` = optional non-empty string. Every list endpoint extends this schema. Cursor encoding and the `{ items, next_cursor, total }` envelope helper are built by the first change with a real list.
- Fixture endpoints used by the integration tests (`GET` / `POST /v1/_fixtures/items`, `GET /v1/_fixtures/boom`) live in `apps/api/test/fixtures/` and are registered only in the test application module. They carry `@Public()` like any other endpoint. Two checks keep them out of the product: a unit test asserts that `AppModule` has no route starting with `/v1/_fixtures`, and `edge.spec.ts` asserts that the built image answers `GET /api/v1/_fixtures/boom` with 404 `not_found`.

### D9. Health and status — bounded by P1.SYS.01, P1.SYS.02, ADR-007, API-DATA-03

- Health ping = `SELECT 1` through the application connection with a 2-second timeout; a timeout or an error gives `degraded`. The answer is always status 200 — the Part 1 table and its OpenAPI list no other response, and the uptime monitor reads the body. The cause is logged, never returned.
- `version` = `APP_VERSION`. The environment schema gives it the default `0.0.0-dev`, which is what a developer sees when running from source with `pnpm dev`. Both Dockerfiles set it from a build argument (Git tag or short commit hash), and CI job `images` fails when a built image reports `0.0.0-dev`.
- `time` / `server_time` are produced by one serializer `toMmtIso(date)` in `apps/api/src/common/http/`: ISO 8601, second precision, fixed `+06:30` (Myanmar has no daylight saving). Tests use a fake clock.
- Status reads no table in this change: `maintenance: false`, the three optional members `null` (the OpenAPI types them `string | null`). `add-settings-store`, which builds P1.SYS.03, replaces the constant by the settings store.

### D10. Lint build rules — bounded by API-PERM-02, ADR-001 module boundary rules 1–2 and action item 2, ADR-009

- **`point/one-access-decorator`** (custom ESLint rule in `tools/eslint-plugin-point/`): in any class decorated with `@Controller`, each method carrying a NestJS route decorator — `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@All`, `@Head`, `@Options`, `@Sse` — must have exactly one decorator named `Can`, `CanView`, `Staff`, `Self`, `Public` or `Internal`. The six access names are in the rule from the start so later changes add decorators without touching the rule. Only `@Public()` is implemented now (it sets route metadata; there is no session guard yet to skip). The "handler policy must be the first statement" half of API-PERM-02 is added by the change that introduces the first handler policy (`add-attachments-upload`).
- **Module boundaries** (`tools/eslint/boundaries.mjs`, `no-restricted-imports`): a file under `apps/api/src/modules/<a>/` may import from `modules/<b>/` only through `modules/<b>/index.ts`; the Prisma client may be imported only in `**/repositories/**` and in `src/common/database/`; `apps/web` may not import the Prisma client or anything from `apps/api`. Fixture files prove each of the three cases fails and that the allowed form passes.
- **No route handler under `/api` in the web app** (`tools/guards/check-web-api-routes.mjs`): fails when a `route.ts` / `route.js` exists under any `apps/web/app/**/api/**` folder (ADR-009).
- Fixture files that must fail are linted by a dedicated test beside each rule file (`tools/eslint-plugin-point/test/`, `tools/eslint/test/api.test.mjs`, `web.test.mjs`, `boundaries.test.mjs` — one test file per owner) and are excluded from the normal `pnpm lint` run.
- `pnpm guards` = `tools/guards/run-all.mjs`, which runs every `check-*.mjs` in the folder that takes no argument; a developer adds a guard by adding a file, not by editing a shared script.

### D11. Web skeleton — bounded by ADR-001 (host rewrite), ADR-009 action item 3, FE-IMPL-01, D-PLT-03

- `proxy.ts` algorithm, as a pure function `resolveRoute(host, pathname)` with unit tests:
  1. pathname starts with `/internal/` → pass through unchanged (reserved for `POST /internal/revalidate`, ADR-006; no handler exists yet);
  2. pathname is `/site`, `/staff` or starts with `/site/` or `/staff/` → 404;
  3. host = host of `SITE_ORIGIN` → rewrite to `/site` + pathname; host = host of `APP_ORIGIN` → rewrite to `/staff` + pathname;
  4. any other host → 404.
  The matcher skips `/_next/*` and files in `public/`.
- **Placeholder pages.** Each tree has one server component: `<main data-testid="site-placeholder">` / `<main data-testid="staff-placeholder">` containing the tree's identifier and `APP_VERSION` as expressions. They contain no literal UI text, so D-PLT-03 / AD-L10N-01 are not touched and the raw-JSX-string lint rule can be on from the first day with no exemption. Both are temporary: `add-foundation-auth-access` replaces the staff placeholder by the login screen and makes the staff tree redirect signed-out visitors (it then MODIFIES the two affected scenarios of this change's spec); `add-public-website-pages` replaces the site placeholder by the home page.
- **No locale segment now.** FE-IMPL-01 puts the site under a `[locale]` segment with next-intl, and FE-IA-02 redirects bare paths using the language cookie or the default-language setting. Neither language files nor that setting exist after this change, and a `[locale]` folder without message loading would be a dead segment. Because `proxy.ts` rewrites the whole path (`/x` → `/site/x`), adding `app/site/[locale]/` later (`add-public-website-pages` — "site locale routing") moves one file and does not change the host logic.
- No Tailwind, shadcn/ui, next-intl, TanStack Query or React Hook Form is installed here; they arrive configured with the tokens in `add-shared-ui-components`.
- API base URLs (ADR-009 action item 3): `NEXT_PUBLIC_API_BASE=/api/v1` for the browser, `API_INTERNAL_BASE=http://api:3001/api/v1` for server-side calls. Both are declared now and read only through `apps/web/env.ts`; the placeholders do not call the API.
- Next.js `output: 'standalone'`; `.next/cache` on a named volume (ADR-006). `cacheComponents` and the tag cache are configured by `add-public-website-pages`.

### D12. Edge — bounded by ADR-009 (decision, amendment, action items 1 and 5)

One Caddyfile for every environment (ADR-009 action item 5: local and production routing match). Site addresses come from the environment: `{$SITE_ORIGIN}` and `{$APP_ORIGIN}`.

| Host | Matcher | Action |
| --- | --- | --- |
| both | `/api/v1/internal/*`, `/internal/*` | `respond 404` (empty body) |
| staff | `/api/*`, `/rt*` | reverse proxy → `{$API_UPSTREAM}` (default `api:3001`) |
| staff | everything else | reverse proxy → `{$WEB_UPSTREAM}` (default `web:3000`) |
| public | `/api/v1/public/*`, `/api/v1/health`, `/api/v1/system/status` | reverse proxy → API |
| public | other `/api/*` | `respond 404` (empty body) |
| public | everything else | reverse proxy → web |

- Edge 404s have an empty body and no `X-Request-Id`; API 404s are `application/problem+json` with the header. The edge tests use that difference to prove a request did or did not reach NestJS (ADR-009 names this confusion as the one cost of the single origin).
- **Path matching is done on the normalised path.** A request line with dot segments (`/api/v1/public/../auth/otp/request`) or their percent-encoded form (`%2e%2e`) is matched after normalisation, so it falls under "other `/api/*`" on the public host and is refused at the edge. `edge.spec.ts` sends both forms as raw request lines (a normal HTTP client would clean them before sending). If Caddy's matcher turns out not to normalise the encoded form, the public host adds an explicit refusal of any path containing `%2e` — verified at task 8.5.
- **Client address.** Caddy is not configured with trusted proxies, so it overwrites a client-sent `X-Forwarded-For` with the address it saw; the API trusts exactly that one hop (D5). `edge.spec.ts` sends a spoofed `X-Forwarded-For: 203.0.113.9` and checks that the `client_ip` of the API's log line for that request id is not `203.0.113.9`. The rate limits that use this address arrive with the changes that own them.
- Both hosts: inbound `X-Internal-Key` is removed before proxying; compression on; baseline headers `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and `Strict-Transport-Security` when the certificate is public. The content-security policy is added by the changes that know its sources (first: the bucket host in `add-attachments-upload` — ADR-014 action item 3).
- Access log: JSON to stdout with the query string removed from the logged URI (same reason as D5).
- Staff host: request body capped at 11 MB (`system.upload_max_mb` default 10 + 1 MB — API-LIM-03) through `{$CADDY_MAX_BODY}`. `add-attachments-upload` owns the requirement and keeping the cap in step with the setting.
- **Configured here, specified later.** Three lines of the Caddyfile have no requirement in this change's spec because the feature behind them does not exist yet: the `/rt*` route (`add-realtime-gateway`), the 11 MB body cap (`add-attachments-upload`) and the removal of inbound `X-Internal-Key` (first consumer: `add-public-website-pages`, P8-RULE-13). Their acceptance in this change is this decision plus the three checks of task 8.7; each owning change adds the requirement.
- **Local hosts.** `SITE_ORIGIN=https://point.test`, `APP_ORIGIN=https://app.point.test`; the developer adds `127.0.0.1 point.test app.point.test` to the hosts file. HTTPS uses Caddy's local certificate authority, because the session cookie of the next change is `Secure` (API-AUTH-01) and `.test` is not a secure context over plain HTTP. Playwright runs with `ignoreHTTPSErrors`; `docs/engineering/local-setup.md` explains trusting the local root certificate on Windows.
- **`http://localhost:3000` alias.** The dev Caddyfile block also answers `http://localhost:3000` with the staff-host rules and sends `Host: app.point.test` upstream, so the "Local development" server of `openapi/part1-foundation.yaml` keeps working. The alias is for **read-only API calls (`GET`)**. Once `add-foundation-auth-access` is merged, a changing request through the alias fails the CSRF origin check (its origin is not `APP_ORIGIN` — API-AUTH-02) and the `Secure` session cookie is kept only by browsers that treat `localhost` as secure; sign-in and every write are done on `https://app.point.test`. A change that needs `localhost` as the real staff origin (the foundation's manual Google test) replaces this block in its own dev override; it does not reuse the alias.
- **Host-run development.** `pnpm dev` runs the API on port 3101 and the web app on port 3100 on the developer's machine with reload; `docker-compose.dev.yml` then sets `API_UPSTREAM=host.docker.internal:3101` and `WEB_UPSTREAM=host.docker.internal:3100`. Inside Compose (CI, production) the ports stay `api:3001` and `web:3000`.

### D13. Compose — bounded by ADR-001 action item 3, ADR-002, ADR-006, ADR-014, system-design §4.1

`docker-compose.yml` (production shape):

| Service | Image | Notes |
| --- | --- | --- |
| `caddy` | official Caddy | ports 80 / 443; volumes for certificates and config |
| `api` | `apps/api/Dockerfile` | not published; `DATABASE_URL` = `point_app` |
| `web` | `apps/web/Dockerfile` | not published; volume `next_cache` → `.next/cache` |
| `postgres` | `postgres:16` | data volume; init script `db/bootstrap/00-roles.sh`; not published |
| `backup` | `infra/backup/Dockerfile` | PostgreSQL client tools; command idles; no schedule, no bucket call (ADR-002 — `add-backup-restore`) |
| `migrate` | the `api` image, profile `tools` | one-shot `node db/scripts/migrate.mjs` with `MIGRATE_DATABASE_URL` (D4.6) |

- The `api` image carries `db/migrations`, `db/schema.prisma`, `db/scripts/migrate.mjs`, `prisma.config.ts` and the Prisma CLI, so the `migrate` service needs nothing else.
- Each service lists its variables under `environment:` one by one; there is no shared `env_file` on the services. That is how `INTERNAL_OPS_KEY` reaches only `api` and `backup`, and `INTERNAL_SSR_KEY` only `api` and `web` (API-SHAPE-02).
- `docker-compose.dev.yml` (override for local work and CI): publishes PostgreSQL on 5432 for host-run development; adds `mailpit` (SMTP 1025, web / API 8025 — the OTP inbox of the next change, ADR-007) and `minio` under profile `storage` (ADR-014 dev option); sets the local origins and the Caddy local certificate mode.
- `.env.example` groups: origins (`SITE_ORIGIN`, `APP_ORIGIN`) · database (`POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POINT_APP_DB_PASSWORD`, `DATABASE_URL`, `MIGRATE_DATABASE_URL`) · internal secrets (`INTERNAL_SSR_KEY`, `INTERNAL_OPS_KEY`) · bucket (`S3_ENDPOINT`, `S3_REGION`, `S3_BUCKET_APP`, `S3_BUCKET_BACKUP`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`, `BACKUP_S3_ACCESS_KEY_ID`, `BACKUP_S3_SECRET_ACCESS_KEY` — declared for ADR-014, read by later changes) · runtime (`APP_VERSION`, `API_PORT`, `LOG_LEVEL`, `NEXT_PUBLIC_API_BASE`, `API_INTERNAL_BASE`) · edge (`API_UPSTREAM`, `WEB_UPSTREAM`, `CADDY_MAX_BODY`). `SITE_ORIGIN`, `INTERNAL_SSR_KEY`, `INTERNAL_OPS_KEY` and `S3_ENDPOINT` are the names the sources fix; the others are chosen here. Every entry has a one-line comment; `.env` is git-ignored.
- `tools/guards/check-env-example.mjs` keeps three lists equal (CG-SEC-05): every `${VAR}` used in a compose file or the Caddyfile is in `.env.example`; every key of the API's environment schema and of `apps/web/env.ts` is in `.env.example`; and `.env.example` has no key that none of them uses, except the ones under a `# reserved:` comment that names the change which will read them (the bucket block).

### D14. Chromium and fonts are not in this image — bounded by ADR-013 action item 4

ADR-013 puts headless Chromium and the Pyidaungsu / Inter fonts in the API image and takes the fonts from `packages/documents/fonts`. That package is empty after this change and nothing launches a browser, so the image work is done by `add-walkin-visit-checkout` together with the `DocumentRenderer` and its golden-image tests. To keep that step small the API Dockerfile uses a Debian-based Node image (system packages for Chromium install cleanly) and a separate final stage.

### D15. CI, pull requests, deployment — bounded by ADR-001 action item 4, system-design §4.1, AD-QA-01, CG-GIT-01..05, the owner's tooling approval

`.github/workflows/ci.yml`, on every pull request and on `main`. The file is created in PR-A with three jobs; each later pull request adds the job for the code it brings (D3), so no job ever refers to a script that is not in the same tree.

| Job | Added in | Does |
| --- | --- | --- |
| `static` | PR-A | `pnpm install --frozen-lockfile` · `pnpm format:check` · `pnpm lint` · `pnpm typecheck` · `pnpm guards` · `gitleaks` on the pushed commits · manifest hash check of `db/source/` (from PR-B) |
| `unit` | PR-A | `pnpm test` (Vitest, incl. the lint-rule, guard and runner tests) |
| `pr-title` | PR-A | pull requests only: the title is a Conventional Commit whose scope is the change id (`check-pr-title.mjs`); the branch name is valid (`check-branch-name.mjs`) |
| `db` | PR-B | PostgreSQL 16 service → `00-roles.sh` → `node db/scripts/migrate.mjs` → table / extension / time-zone / role checks → `pnpm db:check-introspection` → `pnpm db:test` |
| `integration` | PR-C | PostgreSQL 16 service → roles + migrate → `pnpm test:int` (API on the real database, connected as `point_app`). Service containers are declared in one `services:` block, so a later change adds its own (the foundation adds `mailpit`) |
| `images` | PR-E | builds the `api`, `web` and `backup` images (no push); fails when an image reports version `0.0.0-dev` |
| `e2e` | PR-E (stack + health) · PR-I (tests) | hosts-file lines → `docker compose build` of its own images (it does not depend on job `images`) → stack with the dev override → `migrate` → Playwright `smoke.spec.ts` and `edge.spec.ts` → secret-distribution check → logs uploaded on failure |

- **PR title = the squash commit.** Format `<type>(<change-id>): <subject>` — the change id is the Conventional Commits scope, as `docs/engineering/coding-guideline.md` CG-GIT-02 sets it — e.g. `feat(add-repo-scaffold): health and status endpoints`; `<change-id>` matches `^(add|change|remove|fix)-[a-z0-9-]+$` (on a `chore/<topic>` branch the scope is `repo` or `deps` — CG-GIT-01 / CG-GIT-02). A local `commit-msg` hook checks only the Conventional Commit header, so work-in-progress commits stay easy. The guideline is the single definition of the format; `check-pr-title.mjs` implements it (task 1.10).
- **PR template** = the seven sections of CG-GIT-04, copied exactly: *Change* (with the `Spec: point-sdd/openspec/changes/<change-id>` line — ADR-016 action item 5), *Implements*, *What changed and why*, *Test evidence*, *Screenshots*, *Database*, *Passes*. The CI check that fails on a missing section belongs to `add-ci-guard-rails` (D19).
- **Order of test and merge** (the team's workflow guide): apply → CI green + review → test cases → test → NG fixed on the branch → squash merge → archive. For this change PR-A … PR-H are parts and merge as they are reviewed; **PR-I stays open** while `/point-generate-tests` is run and the workbook is executed against the PR-I branch's Compose stack; NG fixes are commits on that branch; PR-I is merged when no NG is open; then the change is archived.
- **Branch protection** on `main` (set by the repository admin, written down in `docs/engineering/README.md`): the seven jobs required, one approving review that is not the author, squash merge only. Both repositories are private (ADR-016 Decision 8), and protection rules on a private repository need a paid GitHub plan — an owner item in the proposal. Until the plan is in place the two developers follow the same rules by hand, and the README says so.
- **Deployment is not in this change.** system-design §4.1 ends CI with "deploy by SSH + `docker compose up -d` → `prisma migrate deploy`". The server, the domain (ACT-05), the bucket keys (ADR-014 action item 1) and the ops accounts (ADR-007 action item 1) are owner-supplied and not available, so an SSH job could not be run even once. `add-staging-deploy` adds the registry push, the SSH job, the first deploy and the monitoring hooks, and completes `docs/ops/install.md` and `deploy.md`. What this change guarantees is that the images build and that the Compose stack built from them passes the smoke and edge tests in CI.

### D16. AD-IMPL-05 guard rails — which are on now

The requirement text for these rails lives in capability `ui-foundation` and is written by `add-shared-ui-components`, which also extends them. This change only switches on the four that need no UI library; the acceptance here is one failing fixture per rule (tasks 4.18, 5.5, 5.6).

| Guard rail | Now | Where / owner |
| --- | --- | --- |
| Raw JSX strings | ✔ on for `apps/web` and `packages/ui` | `tools/eslint/web.mjs` |
| Hex colours, arbitrary Tailwind colour classes | ✔ on (TS / TSX string literals and CSS files) | `tools/eslint/web.mjs` + `tools/guards/check-css.mjs` |
| Raw `font-family` outside `packages/ui/tokens.css` | ✔ on | `tools/guards/check-css.mjs` |
| `parseFloat` / `Number.parseFloat` | ✔ banned in every workspace | `tools/eslint/api.mjs`, `web.mjs` |
| JS `number` arithmetic on money | ✖ needs the money type | `add-shared-ui-components` (the `Mmk` type and `point/no-number-money`) |
| Missing translation keys in either language | ✖ needs the language files | `add-shared-ui-components` |
| axe violations on the flow pages | ✖ needs pages with real UI | `add-shared-ui-components` (catalogue) and the first flow change |

### D17. Claude Code set-up — bounded by review §5.6 (recommendation)

Worth doing, kept fast. `.claude/settings.json` registers one post-edit hook → `node tools/claude-hooks/after-edit.mjs <file>` (a Node script, so it runs the same on Windows and Linux):

1. file outside `apps/`, `packages/`, `tools/`, `e2e/`, `db/scripts/` → exit;
2. Prettier on the file, ESLint on the file;
3. `tsc --noEmit` (incremental) for the workspace that owns the file;
4. `vitest related <file> --run` for that workspace.

Integration tests, database tests and Playwright never run in the hook. Target: under 10 seconds on a developer laptop for a single-file edit; if step 3 or 4 exceeds that, it is moved to a pre-push check. `CLAUDE.md` and `docs/engineering/coding-guideline.md` are already in the repository; this change checks that `CLAUDE.md` points to the guideline and to `../point-sdd`, and that neither contradicts D1–D19 (a contradiction is reported, not fixed silently).

### D18. Where each requirement is tested

| Requirement (spec) | Test |
| --- | --- |
| `/api/v1` on the app's origin · public-host forwarding · internal paths blocked | `e2e/edge.spec.ts` (Playwright request API through Caddy; raw request lines for the dot-segment cases) |
| Web container never holds `INTERNAL_OPS_KEY` | CI step in job `e2e` (`docker compose exec … printenv`) |
| Health · status | API integration tests (fake clock) + `edge.spec.ts` (database stopped) + `smoke.spec.ts` |
| Problem body · request id · unknown route · JSON only · snake_case · no CORS | API integration tests; `edge.spec.ts` for the fixture route on the built image |
| Validation · list limit | API integration tests with the fixture endpoints; unit tests of the issue mapper and `listQuerySchema` |
| One access decorator · module boundaries | rule tests on fixtures + `pnpm lint` |
| No route handler under `/api` in the web app | unit test of the guard on a temporary tree + `pnpm guards` |
| Host selects the route tree | unit tests of `resolveRoute` + `smoke.spec.ts` + one in-network request for the unknown host |
| Database baseline · app role | CI job `db` |

### D19. Guideline §24 checks — which are built here — bounded by CG-TS-01, CG-SEC-05, CG-SEC-06, CG-DB-02, CG-DB-03, CG-GIT-01, CG-GIT-02, CG-GIT-04, CG-DEP-03

The guideline's §24 is the work list of machine checks. This change builds the cheap ones that guard code it creates; each has a fixture or unit test that fails without it.

| Check | Where | Rule |
| --- | --- | --- |
| `noImplicitReturns`, `noFallthroughCasesInSwitch` (with the three flags of D2) | `tsconfig.base.json` | CG-TS-01 |
| Secret scan | `gitleaks` in job `static` and in the `pre-commit` hook (the hook runs it when the binary is installed; CI is the gate) | CG-SEC-05 |
| Branch name | `tools/guards/check-branch-name.mjs` in job `pr-title` | CG-GIT-01 |
| PR title | `tools/guards/check-pr-title.mjs` in job `pr-title` + `commit-msg` hook | CG-GIT-02 |
| PR template, seven sections | `.github/pull_request_template.md` | CG-GIT-04 |
| Merged migration untouched; no destructive DDL | `tools/guards/check-migrations.mjs` | CG-DB-02 |
| `$transaction` only in `src/common/database/` | `no-restricted-syntax` in `tools/eslint/api.mjs` | CG-DB-03 |
| `process.env` only in the config modules | `n/no-process-env` in `api.mjs` and `web.mjs` (allowed: `apps/api/src/common/config/`, `apps/web/env.ts`, config files and scripts outside `src`) | CG-SEC-05 |
| `.env.example` = compose variables = environment schemas | `tools/guards/check-env-example.mjs` | CG-SEC-05 |
| No `Math.random` in `apps/api` and `packages/shared` | `tools/guards/check-math-random.mjs` | CG-SEC-06 |
| Exact versions, frozen lockfile, pinned engine | `.npmrc` (`save-exact`, `engine-strict`) + `--frozen-lockfile` in CI and Dockerfiles | CG-DEP-03 |
| The checks of D10 and D16, the CI jobs of D15, the database checks of D4 | as listed there | — |

**Not built here → `add-ci-guard-rails`** (a new roadmap change, Dev 2, wave 1): coverage thresholds, `spec:trace`, `openapi:check`, `knip`, the licence and `pnpm audit` jobs, Lighthouse CI, the PR size and PR description checks, the table-ownership guard, the route-completeness test, the log canary, `expectQueryCount`. Checks that need code which does not exist yet stay with the change that brings that code (money lint, language-file check, catalogue flag — `add-shared-ui-components`; audit, idempotency and session tests — the changes that add them). Task 7.6 compares the guideline's §24 owner column with this list and reports any row that names `add-repo-scaffold` and has no task here.

## Risks / Trade-offs

- **The baseline drifts from point-sdd `docs/db/`** (a file edited in one repo only) → manifest hash check in CI + `pnpm db:check-source` against the sibling repo in verification and in the PR checklist (D4.11).
- **A later `docs/db/` version lands after the baseline was built** → not a rebuild: it comes in as a forward migration by the D4.10 flow. Task 3.1 records the point-sdd commit so the gap is visible.
- **Prisma introspection cannot express EXCLUDE / CHECK / partial indexes and prints warnings** → accepted; the schema is a typing aid, the SQL is the truth; `db:check-introspection` keeps the committed schema honest, and the constraint tests prove the constraints exist.
- **Time zone silently wrong on a new database** (per-database setting not copied by templates, a restored dump, a new server) → three layers + API start-up check (D4.7); CI scenario `SHOW timezone`.
- **A later change migrates through one path but not the other** (the script but not the Compose service, or the reverse) → there is only one path: `db/scripts/migrate.mjs` (D4.6); `check-env-example` and job `e2e` run the same script as the developer.
- **A developer confuses an edge 404 with an API 404** → empty body vs problem JSON with `X-Request-Id`, documented in `local-setup.md`, asserted in `edge.spec.ts`.
- **A crafted path slips past the public-host allow list** → dot-segment and `%2e%2e` cases in `edge.spec.ts` (D12).
- **A client forges its address** → Caddy overwrites `X-Forwarded-For`, the API trusts one hop, `edge.spec.ts` checks the logged `client_ip` (D12).
- **`.test` hosts and a local certificate are friction on Windows** → documented step by step; the `http://localhost:3000` alias works with no set-up for read-only API calls.
- **The decorator lint rule misses an endpoint written in an unusual way** (decorator alias, inherited method) → the rule covers all nine route decorators and the rule test covers the patterns the coding guideline allows; `add-foundation-auth-access` adds a default-deny guard at run time, so a missed endpoint is closed, not open.
- **Express answers `OPTIONS` by itself** → the global `OPTIONS` handler and its integration test (D5).
- **A token reaches a log through the URL** → neither the API nor Caddy logs the query string; unit test with `?code=…&state=…` (D5, D12).
- **A pinned tool has no working plugin** (TypeScript ahead of `typescript-eslint`, a plugin without a release for the ESLint major) → the pin rule of D2; task 1.2 checks peer ranges before anything is installed.
- **The hook slows editing** → budget and fallback in D17.
- **Two developers and one lockfile** → PR-A first; workspace-local dependencies; rebase + `pnpm install` (D3).
- **A pull request has no CI, or a CI job points at code that is not merged yet** → `ci.yml` starts in PR-A and each job arrives with its code (D3, D15).
- **The 500 code and the field codes drift from the locked text** (`internal_error` — API-ERR-02 v1.6; Zod issue names — API-ERR-03 v1.6) → each is one constant / one mapper function, covered by the integration tests of tasks 4.5 and 4.7; task 1.1 reads the two rules in `docs/api/00-conventions.md` before any code is written.
- **Fixture endpoints leak into production** → they live under `test/`, are excluded from the build, a unit test asserts `AppModule` has no `/v1/_fixtures` route and `edge.spec.ts` asks the built image (D8).
- **Deploy is deferred, so a production-only fault is found late** → CI builds the real images and runs the stack from them; `add-staging-deploy` is the first change of wave 1.
- **Branch protection is not available on a private repository without a paid plan** → owner item; until then the rules are followed by hand and CI still reports every job (D15).

## Migration Plan

1. The change is ready to apply: the owner answered S2–S5 on 02/Oct/2026 13:08 (proposal → Open questions). Task 1.1 reads the answered rules in the sources once.
2. PR-A merged → the repository builds and has a CI (`static`, `unit`, `pr-title` green on the toolchain alone).
3. PR-B, PR-C, PR-D in parallel, each green on the jobs that exist plus the one it adds.
4. PR-E after B, C and D: images build, the stack comes up in job `e2e` and answers health.
5. PR-G and PR-H any time after PR-A.
6. PR-I: smoke and edge tests green on the full stack; test workbook generated and run against the PR-I branch; NG fixed on the branch; PR-I merged; branch protection requested; change archived.
7. Each developer: hosts-file lines, `openspec store register ../point-sdd --id point-sdd`, `cp .env.example .env`, `docker compose -f docker-compose.yml -f docker-compose.dev.yml up -d`, `pnpm db:migrate`, `pnpm dev`.

There is no data and no earlier version, so rollback = revert the pull request. From the first feature change on, migrations are forward-only and additive (system-design §4.1); the baseline and grants migrations are never edited after merge.
