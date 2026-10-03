## Purpose

The platform runtime is the technical contract every other capability stands on: where the API is served and which host may reach which path, how the API reports health, status and errors, how every request is identified, and the database baseline all modules write to. Its scenarios use the local hosts `https://point.test` (public) and `https://app.point.test` (staff) behind the dev Caddy.

## ADDED Requirements

### Requirement: API is served under /api/v1 on the web app's own origin (API-SHAPE-01 · ADR-009 · D-API-01)

The API SHALL be served by NestJS under the path prefix `/api/v1` on the same origin as the web app — on the staff host every `/api/*` path except `/api/v1/internal/*` is routed to the API and every other path to the web app. `v1` SHALL be the only version; no version is read from a header. Access: routing is not permission-bound.

#### Scenario: Staff host serves the API under /api/v1
- **WHEN** a client sends `GET https://app.point.test/api/v1/health`
- **THEN** the response status is 200
- **AND** the response carries an `X-Request-Id` header (the request reached NestJS)

#### Scenario: A path without the /api prefix is not the API
- **WHEN** a client sends `GET https://app.point.test/v1/health`
- **THEN** the response carries no `X-Request-Id` header — the request never reached NestJS
- **AND** it is the scaffold's web not-found page: status 404, `Content-Type: text/html` (what the staff tree answers for an unknown path once sign-in exists is defined by `add-foundation-auth-access`)

#### Scenario: No second version exists
- **WHEN** a client sends `GET https://app.point.test/api/v2/health`
- **THEN** the response status is 404 with `Content-Type: application/problem+json` and `code = "not_found"`

### Requirement: Public host forwards only the public, health and status paths (ADR-009 · API-SHAPE-01)

On the public host the edge (Caddy) SHALL forward to the API only `/api/v1/public/*`, `/api/v1/health` and `/api/v1/system/status`; every other path under `/api` SHALL be answered by the edge with status 404 and an empty body without contacting the API, so that no staff login and no session can be created on the public host. Access: none — the rule applies to every caller.

#### Scenario: Health and status are reachable on the public host
- **WHEN** a client sends `GET https://point.test/api/v1/health` and then `GET https://point.test/api/v1/system/status`
- **THEN** both responses have status 200 and an `X-Request-Id` header

#### Scenario: The public API prefix is forwarded
- **WHEN** a client sends `GET https://point.test/api/v1/public/site`
- **THEN** the response carries an `X-Request-Id` header and `Content-Type: application/problem+json` (the request reached NestJS)
- **AND** the status is 404 with `code = "not_found"`, because endpoint P8.PUB.01 is not built in this change

#### Scenario: A staff login path is refused at the edge
- **WHEN** a client sends `POST https://point.test/api/v1/auth/otp/request` with body `{ "email": "aung@point.test" }`
- **THEN** the response status is 404 with an empty body
- **AND** the response carries neither an `X-Request-Id` header nor a `Set-Cookie` header

#### Scenario: A look-alike of an allowed path is refused
- **WHEN** a client sends `GET https://point.test/api/v1/healthz`
- **THEN** the response status is 404 with an empty body and no `X-Request-Id` header

#### Scenario: A dot-segment path does not slip through the allow list
- **WHEN** a client sends the raw request lines `GET /api/v1/public/../auth/otp/request` and then `GET /api/v1/public/%2e%2e/auth/otp/request` to host `point.test` (without the client cleaning the path)
- **THEN** both responses have status 404 with an empty body, no `X-Request-Id` header and no `Set-Cookie` header

### Requirement: Internal paths are unreachable from outside (ADR-009 · API-SHAPE-02)

On both hosts the edge SHALL answer status 404 with an empty body for every path under `/api/v1/internal/` (the internal API) and under `/internal/` (the web app's internal hook path; `/internal/revalidate` is reserved) without contacting the API or the web app, whatever headers the request carries. Access: none from outside — these paths are reachable only over the Docker network by service name.

#### Scenario: Internal API on the staff host with a key header
- **WHEN** a client sends `POST https://app.point.test/api/v1/internal/backup-runs` with header `X-Internal-Key: anything`
- **THEN** the response status is 404 with an empty body and no `X-Request-Id` header

#### Scenario: Internal API on the public host
- **WHEN** a client sends `GET https://point.test/api/v1/internal/backup-runs/0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** the response status is 404 with an empty body and no `X-Request-Id` header

#### Scenario: The web app's internal hook path on both hosts
- **WHEN** a client sends `POST https://point.test/internal/revalidate` and then `POST https://app.point.test/internal/revalidate`
- **THEN** both responses have status 404 with an empty body (not the web app's HTML not-found page)

### Requirement: The web container never holds INTERNAL_OPS_KEY (API-SHAPE-02 · ADR-009)

The secret `INTERNAL_OPS_KEY` SHALL be present only in the environment of the `api` and `backup` containers, and the secret `INTERNAL_SSR_KEY` only in the environment of the `api` and `web` containers. Access: not applicable — a deployment rule checked in CI.

#### Scenario: The internet-facing web container has no ops key
- **WHEN** the Compose stack is up and CI runs `docker compose exec web printenv INTERNAL_OPS_KEY`
- **THEN** the command prints nothing and exits with status 1

#### Scenario: Each secret is where its two holders are
- **WHEN** CI runs `printenv INTERNAL_OPS_KEY` in the `api` and `backup` containers and `printenv INTERNAL_SSR_KEY` in the `api` and `web` containers
- **THEN** all four commands exit with status 0
- **AND** `docker compose exec backup printenv INTERNAL_SSR_KEY` exits with status 1

### Requirement: Health endpoint is a details-free liveness probe (P1.SYS.01 · ADR-007 · API-DATA-03)

`GET /api/v1/health` SHALL answer status 200 with exactly two JSON members: `status` — `"ok"` when a database ping succeeds, `"degraded"` when it fails — and `time` — the server time as ISO 8601 with the `+06:30` offset. It SHALL expose no other detail. Access: public (`@Public()`) — no session and no permission code.

#### Scenario: Database reachable
- **WHEN** the server clock is 05/Oct/2026 10:42:00 AM MMT and a client sends `GET https://app.point.test/api/v1/health`
- **THEN** the response status is 200 with body `{ "status": "ok", "time": "2026-10-05T10:42:00+06:30" }`

#### Scenario: Database stopped
- **WHEN** the `postgres` container is stopped and a client sends `GET https://app.point.test/api/v1/health`
- **THEN** the response status is 200 and `status = "degraded"`
- **AND** the body has only the members `status` and `time` — no error text, no host name, no job or backup information

#### Scenario: Time is Myanmar time, not UTC
- **WHEN** the server clock is `2026-10-04T17:30:00Z` and a client sends `GET https://app.point.test/api/v1/health`
- **THEN** `time = "2026-10-05T00:00:00+06:30"` (17:30 UTC + 6 h 30 min = 00:00 on 05/Oct/2026 in Myanmar)

### Requirement: System status endpoint is public (P1.SYS.02 · D-PLT-08)

`GET /api/v1/system/status` SHALL answer status 200 with exactly these JSON members: `maintenance` (boolean), `until`, `message_mm`, `message_en`, `version` (string — the deployed release) and `server_time` (ISO 8601 with the `+06:30` offset). While no `system.maintenance` setting row exists — nothing can write one before endpoint P1.SYS.03 is built — `maintenance` SHALL be `false` (the key's default `{ enabled: false }`) and `until`, `message_mm` and `message_en` SHALL be `null`. Access: public (`@Public()`) — no session and no permission code, on both hosts.

#### Scenario: Default status
- **WHEN** the release is `0.1.0`, the server clock is 05/Oct/2026 10:42:00 AM MMT and a client sends `GET https://app.point.test/api/v1/system/status`
- **THEN** the response status is 200 with body `{ "maintenance": false, "until": null, "message_mm": null, "message_en": null, "version": "0.1.0", "server_time": "2026-10-05T10:42:00+06:30" }`

#### Scenario: Readable from the public host without a cookie
- **WHEN** a client with no cookie sends `GET https://point.test/api/v1/system/status`
- **THEN** the response status is 200 and `maintenance = false`

### Requirement: Errors are RFC 9457 problem details (API-ERR-01 · API-ERR-02 · API-SHAPE-05)

Every error response of the API SHALL have `Content-Type: application/problem+json` and a JSON body with the members `type` (URI `<SITE_ORIGIN>/errors/<code>`), `title`, `status` (equal to the HTTP status), `code` (the language key under `error.*`) and `request_id`; `detail` (English developer text, never shown to users), `errors[]` and `context` are optional. An unexpected server failure SHALL answer status 500 with `code = "internal_error"` (language key `error.internal_error`); that body SHALL carry `request_id` and no detail of the failure — neither the exception message nor a stack. Access: applies to every caller.

#### Scenario: Shape of an error body
- **WHEN** a client sends `GET https://app.point.test/api/v1/does-not-exist` with header `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** the response has `Content-Type: application/problem+json` and the header `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **AND** the body is `{ "type": "https://point.test/errors/not_found", "title": "Not found", "status": 404, "code": "not_found", "request_id": "0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70" }`

#### Scenario: An unexpected failure hides its internals
- **WHEN** the API integration test calls the fixture endpoint `GET /api/v1/_fixtures/boom` (registered only in the test application), whose handler throws `Error("boom: db password=s3cret")`
- **THEN** the response status is 500 with `code = "internal_error"`, `status = 500` and a `request_id`
- **AND** the body text contains neither `boom` nor `s3cret` nor a stack trace
- **AND** the API log has one error entry with the same `request_id` and the exception message

### Requirement: Every request has one request id (API-ERR-01 · API-AUD-02)

Every API response, success or error, SHALL carry the header `X-Request-Id` holding the request's id: a server-generated UUIDv7 (it matches `^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`), one per request. A client-sent `X-Request-Id` SHALL be used instead only when it parses as a UUID; any other value SHALL be ignored and SHALL never cause an error. In an error body `request_id` SHALL equal the header. Access: applies to every caller.

#### Scenario: Server generates a UUIDv7
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` without an `X-Request-Id` header
- **THEN** the response header `X-Request-Id` matches the UUIDv7 pattern `^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$`

#### Scenario: Two requests get two ids
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` twice without an `X-Request-Id` header
- **THEN** the two `X-Request-Id` response headers are different

#### Scenario: A client UUID is honoured
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` with header `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** the response header is `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`

#### Scenario: A client UUID of another version is honoured
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` with header `X-Request-Id: 3f2b8c1e-5d4a-4f6b-9c7d-1a2b3c4d5e6f` (a version 4 UUID)
- **THEN** the response header is `X-Request-Id: 3f2b8c1e-5d4a-4f6b-9c7d-1a2b3c4d5e6f`

#### Scenario: A non-UUID value is ignored, not rejected
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` with header `X-Request-Id: sale-42`
- **THEN** the response status is 200
- **AND** the response header `X-Request-Id` matches the UUIDv7 pattern and is not `sale-42`

### Requirement: An unknown route answers 404 not_found (API-ERR-02 · API-SHAPE-04)

A request to a path, or to a method on a path, that the API does not define SHALL be answered with status 404 and `code = "not_found"`. Access: applies to every caller.

#### Scenario: Unknown path
- **WHEN** a client sends `GET https://app.point.test/api/v1/does-not-exist`
- **THEN** the response status is 404 with `code = "not_found"` and `status = 404`

#### Scenario: Known path, undefined method
- **WHEN** a client sends `POST https://app.point.test/api/v1/health` with body `{}`
- **THEN** the response status is 404 with `code = "not_found"`

#### Scenario: Test fixture routes are not in the shipped build
- **WHEN** a client sends `GET https://app.point.test/api/v1/_fixtures/boom` to the stack built from the release images
- **THEN** the response status is 404 with `code = "not_found"` (not 500 `internal_error`)

### Requirement: A schema failure answers 400 validation with field errors (API-ERR-02 · API-ERR-03)

A request whose path parameters, query or body fail the endpoint's Zod schema from `packages/shared` SHALL be answered with status 400 and `code = "validation"`, with one `errors[]` item per failed field — each with `field` (dotted path, `[index]` for array positions), `code` and `params` — and the handler SHALL NOT run. The field `code` SHALL be the Zod issue name, unchanged — `too_small`, `too_big`, `invalid_type` — with `params` = the bound (`minimum` / `maximum`) or the expected type (`expected`), unless the schema names a catalogue code for that field (for example `phone_invalid`), which is then returned instead. The API SHALL never return `required`, `date_invalid` or `unknown` as a field code — those are client-only message keys. A body that is not parseable JSON, or a JSON body larger than 1 MB, SHALL be answered with status 400, `code = "validation"` and an empty `errors` array. Access: applies to every endpoint that takes input. The scenarios run in the API integration test against fixture endpoints registered only in the test application.

#### Scenario: A nested field of the wrong type
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with body `{ "name": "Haircut", "items": [ { "quantity": 1 }, { "quantity": "two" } ] }`
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "items[1].quantity", "code": "invalid_type", "params": { "expected": "number" } } ]`
- **AND** the fixture handler's call counter is still 0

#### Scenario: Two fields fail — two items
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with body `{ "name": "", "items": [] }` (both have a minimum of 1)
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` has exactly 2 items: `{ "field": "name", "code": "too_small", "params": { "minimum": 1 } }` and `{ "field": "items", "code": "too_small", "params": { "minimum": 1 } }`

#### Scenario: A missing field is reported with the Zod issue name, not "required"
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with body `{ "items": [ { "quantity": 1 } ] }` (the required member `name` is absent)
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "name", "code": "invalid_type", "params": { "expected": "string" } } ]` — no item has the code `required`

#### Scenario: A catalogue code named by the schema wins over the Zod issue name
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with body `{ "name": "Haircut", "items": [ { "quantity": 1 } ], "phone": "12345" }`, where the fixture schema names the catalogue code `phone_invalid` for the member `phone`
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "phone", "code": "phone_invalid" } ]`

#### Scenario: Body is not JSON at all
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with `Content-Type: application/json` and the body text `{"name": "Haircut", "items": [`
- **THEN** the response status is 400 with `code = "validation"` and `errors = []`

#### Scenario: Body above the JSON size limit
- **WHEN** the test sends `POST /api/v1/_fixtures/items` with a well-formed JSON body of 1,048,577 bytes (1 MB + 1 byte)
- **THEN** the response status is 400 with `code = "validation"` and `errors = []`
- **AND** the fixture handler's call counter is still 0

### Requirement: List limit is 1 to 100, default 25 (API-LIM-03 · API-DATA-08)

Every list endpoint SHALL read the query parameter `limit` through the shared list-query schema: an integer from 1 to 100, 25 when absent. A value outside the range, or one that is not an integer, SHALL be answered with status 400 and `code = "validation"`. Access: applies to every list endpoint. The scenarios run in the API integration test against the fixture list `GET /api/v1/_fixtures/items`, which echoes the parsed value as `{ "limit": n }`.

#### Scenario: Absent limit is 25
- **WHEN** the test sends `GET /api/v1/_fixtures/items`
- **THEN** the response status is 200 with body `{ "limit": 25 }`

#### Scenario: At the upper limit
- **WHEN** the test sends `GET /api/v1/_fixtures/items?limit=100`
- **THEN** the response status is 200 with body `{ "limit": 100 }`

#### Scenario: Just above the upper limit
- **WHEN** the test sends `GET /api/v1/_fixtures/items?limit=101`
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "limit", "code": "too_big", "params": { "maximum": 100 } } ]`

#### Scenario: At the lower limit
- **WHEN** the test sends `GET /api/v1/_fixtures/items?limit=1`
- **THEN** the response status is 200 with body `{ "limit": 1 }`

#### Scenario: Just below the lower limit
- **WHEN** the test sends `GET /api/v1/_fixtures/items?limit=0`
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "limit", "code": "too_small", "params": { "minimum": 1 } } ]`

#### Scenario: Not a number
- **WHEN** the test sends `GET /api/v1/_fixtures/items?limit=abc`
- **THEN** the response status is 400 with `code = "validation"`
- **AND** `errors` is `[ { "field": "limit", "code": "invalid_type", "params": { "expected": "number" } } ]`

### Requirement: The API speaks JSON only (API-SHAPE-05)

Every API success response with a body SHALL have `Content-Type: application/json; charset=utf-8`, and the API SHALL parse request bodies only as `application/json` (multipart is reserved for `POST /v1/attachments`, which is not in this change): a body sent in another media type is not parsed, so the endpoint's schema sees no body. Access: applies to every caller.

#### Scenario: Success response media type
- **WHEN** a client sends `GET https://app.point.test/api/v1/system/status`
- **THEN** the response header is `Content-Type: application/json; charset=utf-8`

#### Scenario: A form-encoded body is not read
- **WHEN** the API integration test sends `POST /api/v1/_fixtures/items` with `Content-Type: application/x-www-form-urlencoded` and body `name=Haircut`
- **THEN** the response status is 400 with `Content-Type: application/problem+json` and `code = "validation"`
- **AND** the fixture handler's call counter is still 0

### Requirement: JSON member names are snake_case (API-SHAPE-03 · D-DB-01)

Every member name in a JSON body the API emits SHALL be snake_case — it matches `^[a-z][a-z0-9_]*$` — the same spelling as the database column where one exists. Access: applies to every response.

#### Scenario: Status body
- **WHEN** a client sends `GET https://app.point.test/api/v1/system/status`
- **THEN** the member names are exactly `maintenance`, `until`, `message_mm`, `message_en`, `version`, `server_time`
- **AND** the body has no member named `serverTime`, `messageMm` or `messageEn`

#### Scenario: Problem body
- **WHEN** a client sends `GET https://app.point.test/api/v1/does-not-exist`
- **THEN** the body has the member `request_id` and no member named `requestId`
- **AND** every member name of the body matches `^[a-z][a-z0-9_]*$`

### Requirement: No CORS middleware is registered (API-SHAPE-01 · ADR-009)

The API SHALL register no CORS middleware: no API response carries an `Access-Control-Allow-Origin`, `Access-Control-Allow-Credentials`, `Access-Control-Allow-Methods` or `Access-Control-Allow-Headers` header, and a preflight request is treated as an unknown route. Access: applies to every caller.

#### Scenario: A cross-origin read gets no CORS header
- **WHEN** a client sends `GET https://app.point.test/api/v1/health` with header `Origin: https://point.test`
- **THEN** the response status is 200 and it has no `Access-Control-Allow-Origin` header

#### Scenario: A preflight is not answered
- **WHEN** a client sends `OPTIONS https://app.point.test/api/v1/health` with headers `Origin: https://evil.test` and `Access-Control-Request-Method: GET`
- **THEN** the response status is 404 with `code = "not_found"`
- **AND** the response has none of the four `Access-Control-Allow-*` headers

### Requirement: Every endpoint declares exactly one access decorator (API-PERM-02)

Every controller method that carries a NestJS route decorator — `@Get`, `@Post`, `@Put`, `@Patch`, `@Delete`, `@All`, `@Head`, `@Options` or `@Sse` — SHALL declare exactly one access decorator from the set `@Can`, `@CanView`, `@Staff`, `@Self`, `@Public`, `@Internal`; a missing or a second access decorator SHALL fail lint — and therefore the CI build — with rule id `point/one-access-decorator`. In this change only `@Public()` is implemented, and the two endpoints P1.SYS.01 and P1.SYS.02 carry it. Access: a build rule — checked in CI, not at run time.

#### Scenario: Missing decorator fails the build
- **WHEN** CI lints the fixture `tools/eslint-plugin-point/fixtures/missing.controller.ts`, whose method `list()` has `@Get()` and no access decorator
- **THEN** ESLint reports 1 error with rule id `point/one-access-decorator` on the line of `list()` and exits with status 1

#### Scenario: Second decorator fails the build
- **WHEN** CI lints the fixture `tools/eslint-plugin-point/fixtures/double.controller.ts`, whose method `list()` has `@Get()`, `@Public()` and `@Staff()`
- **THEN** ESLint reports 1 error with rule id `point/one-access-decorator` on the line of `list()` and exits with status 1

#### Scenario: A catch-all handler is covered too
- **WHEN** CI lints the fixture `tools/eslint-plugin-point/fixtures/all.controller.ts`, whose method `any()` has `@All()` and no access decorator
- **THEN** ESLint reports 1 error with rule id `point/one-access-decorator` on the line of `any()` and exits with status 1

#### Scenario: Exactly one decorator passes
- **WHEN** CI lints the fixture `tools/eslint-plugin-point/fixtures/ok.controller.ts`, whose method `list()` has `@Get()` and `@Public()`
- **THEN** ESLint reports 0 errors for rule `point/one-access-decorator`

#### Scenario: The real controllers pass
- **WHEN** CI runs `pnpm lint` on `apps/api`
- **THEN** the handlers of `GET /v1/health` and `GET /v1/system/status` each carry `@Public()` and the rule reports 0 errors

### Requirement: The Host header selects the route tree (ADR-001 · API-META-04)

The web app SHALL serve the `site` route tree to requests whose host is the public host and the `staff` route tree to requests whose host is the staff host, by a rewrite in `proxy.ts`. A request from outside whose path is `/site`, `/staff` or begins with `/site/` or `/staff/` SHALL be answered with status 404 on both hosts, and a request for any other host SHALL be answered with status 404. In this change each tree serves one placeholder page at `/`; both are temporary — the staff placeholder is replaced by the login screen in `add-foundation-auth-access`, the site placeholder by the home page in `add-public-website-pages`. Access: public in this change — the placeholder pages need no session.

#### Scenario: Public host shows the site tree
- **WHEN** a browser opens `https://point.test/`
- **THEN** the response status is 200 and the page is the scaffold's site placeholder — it contains the element `[data-testid="site-placeholder"]` (replaced by the home page in `add-public-website-pages`)
- **AND** the page does not contain `[data-testid="staff-placeholder"]`

#### Scenario: Staff host shows the staff tree
- **WHEN** a browser opens `https://app.point.test/`
- **THEN** the response status is 200 and the page is the scaffold's staff placeholder — it contains the element `[data-testid="staff-placeholder"]` (replaced by the login screen in `add-foundation-auth-access`)
- **AND** the page does not contain `[data-testid="site-placeholder"]`

#### Scenario: The staff tree cannot be opened through the public host
- **WHEN** a browser opens `https://point.test/staff`
- **THEN** the response status is 404 and the page does not contain `[data-testid="staff-placeholder"]`

#### Scenario: The site tree cannot be opened through the staff host
- **WHEN** a browser opens `https://app.point.test/site`
- **THEN** the response status is 404 and the page does not contain `[data-testid="site-placeholder"]`

#### Scenario: A tree's own folder name is not a public path
- **WHEN** a browser opens `https://point.test/site` and then `https://app.point.test/staff/today`
- **THEN** both responses have status 404

#### Scenario: An unknown host gets nothing
- **WHEN** CI sends `GET http://web:3000/` with header `Host: evil.test` from inside the Docker network
- **THEN** the response status is 404

### Requirement: Module boundaries are enforced at build (ADR-001)

A file of one API module SHALL import another module only through that module's `index.ts`; the Prisma client SHALL be imported only inside a module's `repositories/` folder and inside `src/common/database/`; and the web app SHALL import neither the Prisma client nor anything from `apps/api`. A breach SHALL fail lint — and therefore the CI build — with rule id `no-restricted-imports`. Access: a build rule — checked in CI, not at run time.

#### Scenario: Reaching into another module's internals fails the build
- **WHEN** CI lints the fixture `tools/eslint/fixtures/boundaries/modules/sales/reach-in.ts`, which imports `../platform/system/system.service`
- **THEN** ESLint reports 1 error with rule id `no-restricted-imports` and exits with status 1

#### Scenario: Importing through the public surface passes
- **WHEN** CI lints the fixture `tools/eslint/fixtures/boundaries/modules/sales/through-index.ts`, which imports `../platform` (its `index.ts`)
- **THEN** ESLint reports 0 errors for rule `no-restricted-imports`

#### Scenario: Database access outside a repository fails the build
- **WHEN** CI lints the fixture `tools/eslint/fixtures/boundaries/modules/sales/sales.controller.ts`, which imports the Prisma client
- **THEN** ESLint reports 1 error with rule id `no-restricted-imports` and exits with status 1

#### Scenario: The web app cannot reach the database
- **WHEN** CI lints the fixture `tools/eslint/fixtures/boundaries/web/page.tsx`, which imports the Prisma client
- **THEN** ESLint reports 1 error with rule id `no-restricted-imports` and exits with status 1

### Requirement: The web app defines no route handler under /api (ADR-009 · API-SHAPE-01)

The web app SHALL contain no route handler file (`route.ts` or `route.js`) in any folder named `api` under `apps/web/app/` — the `/api` path belongs to NestJS at the edge; a breach SHALL fail `pnpm guards`, and therefore the CI build. Access: a build rule — checked in CI, not at run time.

#### Scenario: A route handler under /api fails the build
- **WHEN** the guard `tools/guards/check-web-api-routes.mjs` runs on a tree that contains `apps/web/app/staff/api/ping/route.ts`
- **THEN** the guard exits with status 1 and prints that file's path

#### Scenario: The real tree passes
- **WHEN** CI runs `pnpm guards` on the repository
- **THEN** `check-web-api-routes.mjs` exits with status 0

### Requirement: Database baseline equals the locked design (D-PLT-02 · D-PLT-15 · ADR-001)

Applying the repository's migrations to an empty PostgreSQL 16 database SHALL produce the 91 tables defined by the current files of point-sdd `docs/db/` (README load order) in schema `public`, the extension `btree_gist`, and the database time zone `Asia/Yangon`; and every case of every `*-test.sql` file of `docs/db/` SHALL report `PASS` when the file is run on its own freshly migrated database. Access: not applicable — checked by the CI job `db`.

#### Scenario: Table count
- **WHEN** CI migrates an empty PostgreSQL 16 database with `node db/scripts/migrate.mjs` (which runs `prisma migrate deploy`) and then `SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name <> '_prisma_migrations'`
- **THEN** the result is `91`

#### Scenario: Extension
- **WHEN** CI runs `SELECT count(*) FROM pg_extension WHERE extname = 'btree_gist'` on the migrated database
- **THEN** the result is `1`

#### Scenario: Time zone
- **WHEN** CI opens a new connection to the migrated database and runs `SHOW timezone`
- **THEN** the result is `Asia/Yangon`
- **AND** `SELECT to_char(timestamptz '2026-10-04T17:30:00Z', 'YYYY-MM-DD HH24:MI TZH:TZM')` returns `2026-10-05 00:00 +06:30`

#### Scenario: Constraint tests all pass
- **WHEN** CI runs each of the six `*-test.sql` files of `docs/db/` (copied to `db/source/`) on its own freshly migrated database
- **THEN** every result row of every file reads `PASS` and the job exits with status 0

#### Scenario: One failing case fails the job
- **WHEN** the runner is given a result set in which one row reads `FAIL`, or a file that produced no result row
- **THEN** the runner exits with status 1 and prints the file name and the failing row's label

### Requirement: The API's database role cannot change or delete audit rows (D-AUD-02)

The API SHALL connect to the database as the role `point_app`, which SHALL NOT be a superuser, SHALL NOT own the tables and SHALL NOT have `CREATEDB`; on table `audit_events` it SHALL hold only the privileges `SELECT` and `INSERT`. Access: not applicable — a database rule checked by the CI job `db`.

#### Scenario: Update is refused
- **WHEN** a connection as `point_app` runs `UPDATE audit_events SET reason = 'x'`
- **THEN** PostgreSQL answers `permission denied for table audit_events` (SQLSTATE `42501`)

#### Scenario: Delete and truncate are refused
- **WHEN** a connection as `point_app` runs `DELETE FROM audit_events` and then `TRUNCATE audit_events`
- **THEN** PostgreSQL answers `permission denied for table audit_events` (SQLSTATE `42501`) for both

#### Scenario: Insert and select are allowed
- **WHEN** CI runs `SELECT has_table_privilege('point_app', 'audit_events', 'INSERT'), has_table_privilege('point_app', 'audit_events', 'SELECT'), has_table_privilege('point_app', 'audit_events', 'UPDATE'), has_table_privilege('point_app', 'audit_events', 'DELETE')`
- **THEN** the result is `true, true, false, false`

#### Scenario: Role attributes
- **WHEN** CI runs `SELECT rolsuper, rolcreatedb FROM pg_roles WHERE rolname = 'point_app'`
- **THEN** the result is `false, false`
- **AND** `SELECT count(*) FROM pg_tables WHERE schemaname = 'public' AND tableowner = 'point_app'` returns `0`
