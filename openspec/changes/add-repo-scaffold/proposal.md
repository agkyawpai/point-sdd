## မြန်မာ အတိုချုပ်

- `point-barber` repo (အခု စာရွက်စာတမ်း ဖိုင် တချို့ပဲ ရှိ) ကို **အလုပ်လုပ်တဲ့ အခြေခံ ပုံစံ** ဖြစ်အောင် ဆောက်မယ် — API (NestJS)၊ web (Next.js)၊ database (table ၉၁ ခု)၊ Docker Compose + Caddy၊ PR တိုင်း အလိုအလျောက် စစ်တဲ့ CI။
- ပြီးရင် ရတာ — command တစ်ခုနဲ့ system တစ်ခုလုံး တက်၊ `…/api/v1/health` က `ok` ပြန်၊ website host နဲ့ staff app host မှာ ယာယီ စမ်းသပ် စာမျက်နှာ တစ်ခုစီ ပေါ်၊ DB constraint test အားလုံး PASS။
- **မပါတာ** — login၊ မျက်နှာပြင် component / အရောင် / ဘာသာစကား ဖိုင်၊ လုပ်ငန်း feature တစ်ခုမှ မပါ။ Server ပေါ် တကယ်တင်တာ (deploy) နဲ့ backup အလုပ်လုပ်တာလည်း နောက် change တွေမှာ။
- Developer ၂ ယောက် တွဲလုပ် (ဒီ change တစ်ခုတည်း ခြွင်းချက်) — Dev 2 = API + DB + Docker + CI၊ Dev 1 = web + package အလွတ်များ; ဖိုင် မထပ်အောင် ခွဲထား။
- လုပ်ငန်း စည်းမျဉ်း အသစ် မရှိ — ADR-001 / ADR-009 နဲ့ API Part 0 / Part 1 အတိုင်းပဲ။
- **စလို့ရပြီ** — owner က မေးခွန်း ၄ ခုလုံး (S2 အရွယ်၊ S3 capability နာမည်၊ S4 / S5 error code နာမည်) ကို 02/Oct/2026 13:08 မှာ default အတိုင်း ဖြေပြီး။ ကျန်တာ owner ဘက်က တစ်ခုပဲ — GitHub private repo မှာ branch protection သုံးဖို့ paid plan စီစဉ်ရန် (မရခင် developer ၂ ယောက်က စည်းမျဉ်းအတိုင်း ကိုယ်တိုင်လိုက်နာ)။

**Implements:** D-PLT-02 · D-PLT-06 · D-PLT-08 (status endpoint only) · D-PLT-15 · D-PLT-17 · D-DB-01 · D-AUD-02 · D-ARC-01 · D-ARC-03 · D-API-01 · D-API-02 — endpoints P1.SYS.01 · P1.SYS.02 — API-SHAPE-01..05 · API-ERR-01..03 · API-AUD-02 · API-PERM-02 · API-LIM-03 (list `limit` only) · API-DATA-03 · API-DATA-08 · API-META-04 — AD-IMPL-01 · AD-IMPL-03 · FE-IMPL-01 (structure only) · AD-QA-01 (last item: PR cites IDs) — ADR-001 (action items 1–5, as amended by ADR-016) · ADR-009 · ADR-002 (backup sidecar placeholder) · ADR-006 (cache volume, reserved hook path) · ADR-007 (liveness probe, JSON logs, Mailpit) · ADR-014 (bucket settings, MinIO dev option) · ADR-016 (action items 2 and 5)  
**Prepares, skeleton only:** D-PLT-01 (`apps/android`, `apps/windows`) · D-PLT-03 (`packages/i18n`) · D-PLT-16 · D-ROLE-08 (empty definition files) · D-DB-03 (constants folder) · D-DAT-03 (backup container without a schedule) · ADR-013 (`packages/documents`) · AD-IMPL-05 (four of its rails switched on — the requirement text is in capability `ui-foundation`, written by `add-shared-ui-components`; design D16) · three edge settings whose requirement comes with the feature (`/rt*` route, 11 MB body cap, `X-Internal-Key` removal — design D12)  
**Depends on:** nothing — this is the first change. It must be merged before `add-shared-ui-components` and `add-foundation-auth-access` start.  
**Repos:** point-barber (all code) · point-sdd (this change, the brief, the test workbook)  
**Owner:** Dev 2 (lead: API, database, infrastructure, CI) with Dev 1 (web app, `packages/ui`, `packages/i18n`, shell placeholders). This is the one **paired exception** to "one developer per change" (D-PLT-14): it is tooling only and is split by path, so the two never edit the same file (design D3).

## Why

`point-barber` holds only the starter files delivered with ADR-016 (`README.md`, `CLAUDE.md`, `.gitignore`, the OpenSpec pointer, the coding guideline, the `design-reference` index files) — no code. The next three changes (`add-shared-ui-components`, `add-foundation-auth-access`, `add-walkin-visit-checkout`) each need the same ground: a monorepo that builds, the locked database loaded, an API that already answers in the locked error format, the two hosts routed as ADR-009 says, and a CI that refuses work breaking the locked rules. Doing this once, first, means no feature change has to invent a folder, an error shape or a lint rule — and two developers with Claude Code can work in parallel from day one (D-PLT-14) without stepping on each other's files.

ADR-001 lists this work as action items 1–5; the owner's two-repository decision of 02/Oct/2026 (ADR-016) moves the planning sources to point-sdd, so the app repo keeps only migrations, engineering docs and an OpenSpec pointer.

## What Changes

**Repository and tooling (point-barber)**
- pnpm workspaces + Turborepo, Node 24 LTS pinned, TypeScript strict; ESLint + Prettier; Vitest; Playwright. Every other tool is pinned at the newest stable major that every plugin and example of the coding guideline supports — not at npm `latest` (Prisma 7.x; TypeScript inside `typescript-eslint`'s range; one ESLint major all plugins accept) — and recorded in `VERSIONS.md`.
- Workspaces: `apps/api` (NestJS), `apps/web` (Next.js 16), `apps/android` and `apps/windows` (README only), `packages/shared`, `packages/ui`, `packages/i18n`, `packages/documents` (empty skeletons, each README names the change that fills it), `db/`, `e2e/`, `infra/`, `tools/`, `docs/engineering/`, `docs/ops/`.
- The delivered files are kept: `CLAUDE.md`, the coding guideline, `openspec/config.yaml` (the pointer `store: point-sdd` — ADR-016; `/opsx:apply` runs here, the specs stay in point-sdd) and the `design-reference` READMEs stay as they are; `.gitignore` is extended; `README.md` is replaced, as it says itself.
- The 13 module folder names of ADR-001 and which API part each owns are fixed in `docs/engineering/module-map.md`; only `platform` is created now.

**Database baseline**
- One SQL-first baseline migration built from the current files of point-sdd `docs/db/` in the README load order (generated DDL + the nine constraint files) → 91 tables, extension `btree_gist`, database time zone `Asia/Yangon`.
- A second migration grants the restricted role `point_app` (no superuser, no ownership, no `CREATEDB`; `audit_events` = INSERT + SELECT only — D-AUD-02).
- `schema.prisma` is obtained by introspection and never used to generate DDL; constraints stay in raw SQL.
- One migrate entry point, `node db/scripts/migrate.mjs`, used by the developer command, the Compose `migrate` service and CI — later changes add their steps to it.
- The six `*-test.sql` files run in CI, each on its own freshly migrated PostgreSQL 16 database.
- Rule for every later database change: point-sdd `docs/db/` first (version bump + register note) → a new forward migration in point-barber.

**API runtime skeleton** (capability `platform-runtime` — 20 requirements, 72 scenarios)
- `/api/v1` base path, `GET /v1/health` (P1.SYS.01) and `GET /v1/system/status` (P1.SYS.02), both public.
- RFC 9457 problem body with `code` and `request_id`; request id = server UUIDv7, client `X-Request-Id` honoured only when it is a UUID; unknown route → 404 `not_found`; Zod schema failure → 400 `validation` with `errors[]`; list `limit` 1–100 (default 25); JSON only; snake_case members; no CORS middleware.
- Build rules: exactly one access decorator per endpoint (only `@Public()` exists now); cross-module imports and direct Prisma access outside a module's repository layer fail lint; no route handler under `/api` in the web app.

**Web skeleton**
- `proxy.ts` rewrites by host: public host → `app/site/` tree, staff host → `app/staff/` tree; direct `/site/*` or `/staff/*` → 404; unknown host → 404; `/internal/*` left alone (reserved for the revalidate hook). One temporary placeholder page per tree — the staff one is replaced by the login screen in `add-foundation-auth-access`, the site one by the home page in `add-public-website-pages`.

**Infrastructure**
- `docker-compose.yml` (caddy, api, web, postgres, backup placeholder, one-shot migrate), `docker-compose.dev.yml` (local hosts `point.test` / `app.point.test` with a local certificate, Mailpit, MinIO as an option), one Caddyfile for every environment with the ADR-009 edge rules, `.env.example` with `SITE_ORIGIN`, `APP_ORIGIN`, `INTERNAL_SSR_KEY`, `INTERNAL_OPS_KEY`, database and bucket settings.

**Quality gates**
- GitHub Actions, seven jobs: `static` (format, lint, typecheck, guards, secret scan), `unit`, `pr-title` (title + branch name), `db` (migrate + introspection diff + constraint tests), `integration` (API on PostgreSQL 16), `images`, `e2e` (Playwright smoke + edge-routing tests against the Compose stack). The first three arrive with the toolchain pull request; each later pull request adds the job for the code it brings.
- The cheap checks the coding guideline's §24 gives to this change (design D19): two more compiler flags, `gitleaks`, branch-name check, migration guard, `$transaction` and `process.env` restrictions, `Math.random` guard, `.env.example` check; PR template exactly as CG-GIT-04.
- Claude Code: the delivered `CLAUDE.md` and coding guideline are checked against this design; the after-edit hook is wired (format + lint + typecheck + related tests).
- Runbook skeletons in `docs/ops/` (install, deploy, rollback, backup / restore, secrets rotation — D-PLT-06).

No **BREAKING** change: no code exists yet.

## Capabilities

### New Capabilities

- `platform-runtime`: API base path and versioning, what each host may reach, health and system status, the problem-details error format, request ids, validation and list-limit contract, JSON-only and snake_case rules, no CORS, the access-decorator and module-boundary build rules, host-to-route-tree rewrite, the database baseline and the restricted database role. (Approved by the owner — S3, D-PLT-20.)

### Modified Capabilities

None — `openspec/specs/` is empty.

## Impact

- **Code:** the whole initial tree of point-barber beside the delivered files. No business module, no table of its own — the 91 tables come from the locked design unchanged.
- **API:** two endpoints (P1.SYS.01, P1.SYS.02). No other endpoint of Parts 1–8 is built.
- **Database:** baseline + grants migrations. No change to point-sdd `docs/db/`.
- **Developers:** each needs Docker, Node 24, pnpm, `gitleaks`, two lines in the hosts file (`point.test`, `app.point.test`) and the OpenSpec store registered once (`openspec store register ../point-sdd --id point-sdd`).
- **Owner:** the four questions are answered (Open questions below). One item remains: both repositories are private (ADR-016 Decision 8), and GitHub applies branch protection to a private repository only on a paid plan — the owner arranges the plan, and until then the two developers follow the same rules by hand (design D15). Server, domain (ACT-05), bucket keys and the ops accounts are needed only for `add-staging-deploy`.
- **Next changes:** `add-shared-ui-components` fills `packages/ui`, `packages/i18n` and installs the UI libraries; `add-foundation-auth-access` adds the session, the remaining access decorators, the first seeded rows and the first background job, and replaces the staff placeholder (it then modifies the two scenarios of this spec that describe the placeholder and the staff tree's not-found page).
- **Roadmap:** two rows are missing in `docs/plan/roadmap.md` and are added by the lead — `add-ci-guard-rails` (the heavier CI checks, design D19) and a row for the 600 requests / minute / session cap of API-LIM-03.
- **Size:** tooling-heavy and above the change-size rule — an exception the owner accepted (S2, D-PLT-20): 20 requirements, 72 scenarios, 94 tasks of ≤ 2 h, most of them under 1 h with Claude Code — about 55 working hours, 3 to 4 working days for two developers in parallel, in eight pull requests; the earlier ones merge on CI + review and the test workbook is generated and run on the last one (CG-GIT-05). Most scenarios are single automated assertions (curl, CI log).

## Non-goals

- **Login, sessions, CSRF check, `/me`, permission guard, `@Can` / `@CanView` / `@Staff` / `@Self` decorators** → `add-foundation-auth-access`. (The lint rule already knows their names.)
- **Design tokens, Tailwind + shadcn/ui set-up, shared components, formatters, the money type and its lint, language files, next-intl, TanStack Query, the `/dev/ui` catalogue** → `add-shared-ui-components`. The scaffold only creates the empty packages.
- **Site locale segment (`/my`, `/en`) and the bare-path language redirect (FE-IA-02), and the web app's `/internal/revalidate` handler (ADR-006)** → `add-public-website-pages`. Not needed now: there are no language files and no default-language setting yet (design D11); the hook path is only reserved and blocked at the edge.
- **Headless Chromium and the Pyidaungsu / Inter fonts in the API image (ADR-013 action item 4), and the API memory limit that goes with them** → `add-walkin-visit-checkout`, the first change that renders a document (receipt PDF). This change builds the API image without them (design D14).
- **First deployment to a server, the SSH deploy job, image registry push, Sentry, HetrixTools, Resend** → `add-staging-deploy`, because the server, the domain and the provider accounts are owner-supplied and not available yet. This change delivers images that build in CI and the runbook skeletons (design D15).
- **Backup schedule, bucket upload, restore test, `/v1/internal/backup-runs`** → `add-backup-restore`. The `backup` container exists but idles.
- **pg-boss / `JobsModule`, `sync.code_tables` on start-up, development seed (`pnpm db:seed`)** → `add-foundation-auth-access` (first job `email.send`, first seeded rows, first permission codes). The pg-boss install becomes a step of the migrate entry point there.
- **Maintenance mode ON behaviour (P1.SYS.03, 503 `maintenance`)** → `add-settings-store`. Here the status endpoint always reports `maintenance: false`; no endpoint can switch it on.
- **Socket.IO** → `add-realtime-gateway`. **Attachments, the upload size rule and the first content-security policy source** → `add-attachments-upload`. The Caddyfile already routes `/rt*`, caps the body and strips inbound `X-Internal-Key`; those lines are checked in this change (task 8.7) and get their requirement in the owning change (design D12).
- **Per-IP limits of API-LIM-01** → each change that adds a `/v1/public/*` endpoint brings its limit class (CG-SEC-09). **The 600 requests / minute / session cap of API-LIM-03** → not in this change (there is no session); it has no roadmap row yet — a row to be added by the lead.
- **Heavier CI checks of the coding guideline's §24** — coverage thresholds, `spec:trace`, `openapi:check`, `knip`, the licence and `pnpm audit` jobs, Lighthouse CI, PR size and PR description checks, the table-ownership guard, the route-completeness test, the log canary, `expectQueryCount` → `add-ci-guard-rails` (Dev 2, wave 1 — roadmap row to be added by the lead).
- **Android and Windows shells** → `add-android-shell`, `add-windows-shell` (ADR-003).

## Open questions

**The change is ready to apply.**

### Needs the owner's answer

None — all answered by the owner on 02/Oct/2026 13:08 (review §0.11).

### Answered by the owner (02/Oct/2026 13:08 — review v5.2.17 §0.11)

- **S2 — size of this change:** it stays whole — an accepted exception to "1–3 days, 20–30 test cases". It is delivered in eight pull requests; the earlier ones merge on CI + review, and the test workbook is generated and run on the last one (CG-GIT-05). Recorded in D-PLT-20 (v5.2.17 note).
- **S3 — capability `platform-runtime`:** approved; the capability list is 25, all locked. Recorded in D-PLT-20 #4 (v5.2.17) and `openspec/config.yaml`.
- **S4 — `code` of an unexpected server error (HTTP 500):** `internal_error` (language key `error.internal_error`); the body carries `request_id` and no detail of the failure. Recorded in API-ERR-02 (Part 0 v1.6).
- **S5 — `errors[].code` of a schema failure:** the Zod issue name, unchanged — `too_small`, `too_big`, `invalid_type`, with `params` = the bound / the expected type — unless the schema names a catalogue code (`phone_invalid`, `reason_inactive`, and in Part 1 `email_invalid`, `otp_format`). `required`, `date_invalid` and `unknown` are client-only message keys; the API never returns them. Recorded in API-ERR-03 (Part 0 v1.6). The language keys `error.too_small`, `error.too_big`, `error.invalid_type` are added by `add-shared-ui-components`.

### Recorded readings

No decision needed — the reading used changes nothing locked; listed so nothing is resolved silently (D-PLT-13).

1. **ADR-001 action item 1 lists `docs/` and `openspec/` inside the monorepo; the owner's two-repository decision of 02/Oct/2026 (ADR-016, D-ARC-03) keeps planning sources in point-sdd.** Reading used: the owner's later decision — point-barber gets `db/` (migrations), `docs/engineering/`, `docs/ops/` and the pointer `openspec/config.yaml`.
2. **OpenAPI Part 1 names `http://localhost:3000/api/v1` as the local server; this change's scenarios use `https://app.point.test` / `https://point.test`.** Reading used: both hold — the dev Caddy serves the two `.test` hosts and also answers `http://localhost:3000` as a read-only alias of the staff host (design D12).
3. **Review §5.6 recommends `shells/` and `docs/runbooks/`; ADR-001 says `apps/android`, `apps/windows` and `docs/ops/`.** Reading used: ADR-001 (the review section is a recommendation).
4. **Problem member `type`.** API-ERR-01 shows `"type": "https://point.example/errors/slot_taken"` as an example; the OpenAPI `Problem` schema does not require `type`, and one of its examples writes `about:blank`. Reading used: every problem carries `type` = `<SITE_ORIGIN>/errors/<code>` — the form of the API-ERR-01 example, allowed by the schema. The `about:blank` example in the OpenAPI file is corrected at its next revision.
5. **A body the API cannot read.** API-SHAPE-04 lists no 413 or 415, and API-ERR-02 gives 400 `validation` for "Zod schema failed". Reading used: an unparseable JSON body, a JSON body above the 1 MB parser limit and a body in another media type all end as 400 `validation` — in each case the schema has nothing valid to accept.
6. **ADR-001 action item 4 writes the constraint tests as `db/*-test.sql`.** Reading used: the files are byte-identical copies under `db/source/*-test.sql` with a hash manifest (ADR-016 action item 5); the ADR line is a stale path, not a different rule.
7. **ADR-009 writes `setGlobalPrefix('api')` with document paths `/v1/…`.** Reading used: exactly that — the prefix is `api`, there is no framework-level versioning, and each controller writes `v1/` in its own path (design D5).
