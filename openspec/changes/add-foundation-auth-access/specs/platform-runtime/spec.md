## Purpose

The platform runtime is the technical contract every other capability stands on. This delta does two things. It modifies the two routing requirements of `add-repo-scaffold` that sign-in changes: on the staff host a visitor without a session is now sent to the login screen, and the staff placeholder page is gone (these two can be archived only after `add-repo-scaffold` is archived, which the dependency order guarantees). And it adds the idempotency contract: how an endpoint that creates a money or stock row takes the client's `Idempotency-Key`, and what a repeated, a concurrent and a conflicting request get back, so that a double tap or a retry on a weak connection never creates a second row. No endpoint of this change creates such a row — the first one is `POST /v1/visits` in `add-walkin-visit-checkout` — so the scenarios run in the API integration test against the fixture endpoint `POST /api/v1/_fixtures/idempotent-rows`, which exists only in the test application and stores `branch_id`, `amount` (identifying fields) and `note` in a test table (schema `fixtures`, created by the test set-up, never by a migration) with a unique `client_request_id` column.

## ADDED Requirements

### Requirement: A row-creating endpoint requires the Idempotency-Key header (API-IDEM-01 · D-VIS-10 · AD-NET-01)

An endpoint marked as idempotent SHALL require the request header `Idempotency-Key`, whose value is the client's `client_request_id` — a UUID (version 4 or 7), one per logical submit — and SHALL store that value in the `client_request_id` column of the row it creates. A request without the header SHALL answer status 400 with `code = "idempotency_key_required"`; a header that is not a UUID SHALL answer status 400 with `code = "validation"`; in both cases no row is created. Access: applies on top of the endpoint's own access rule; the header rule itself needs no permission.

#### Scenario: Header missing
- **WHEN** Ko Aung sends `POST /api/v1/_fixtures/idempotent-rows` with `{ "branch_id": "<B3>", "amount": 8000 }` and no `Idempotency-Key` header
- **THEN** the response is 400 with `code = "idempotency_key_required"` and the test table has 0 rows

#### Scenario: Header is not a UUID
- **WHEN** the same request carries `Idempotency-Key: sale-42`
- **THEN** the response is 400 with `code = "validation"` and `errors[0].field = "Idempotency-Key"`, and the test table has 0 rows

#### Scenario: First request with a key creates the row
- **WHEN** the same request carries `Idempotency-Key: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** the response is 201 without an `Idempotent-Replayed` header
- **AND** the created row has `client_request_id = 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70` and `amount = 8000`

### Requirement: A repeat with the same key returns the first result and creates nothing (API-IDEM-02 · D-VIS-10 · AD-NET-01)

When a request arrives with an `Idempotency-Key` that an earlier, finished request of the same endpoint already used with the same identifying fields, the endpoint SHALL answer status 200 (not 201) with the resource the first request created and the response header `Idempotent-Replayed: true`, and SHALL create no second row. Access: as the endpoint's own access rule.

#### Scenario: Double tap
- **WHEN** Ko Aung's request with key `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70` and `{ "branch_id": "<B3>", "amount": 8000 }` was answered 201 with row id R1 at 10:05:00 AM, and the same request is sent again at 10:05:02 AM
- **THEN** the response is 200 with header `Idempotent-Replayed: true` and the body of row R1
- **AND** the test table still has 1 row

#### Scenario: A retry hours later is still a replay
- **WHEN** the same request is sent a third time at 4:00:00 PM
- **THEN** the response is 200 with `Idempotent-Replayed: true` and row R1, and the table still has 1 row

#### Scenario: A field that is not identifying may differ
- **WHEN** the same key is sent with `{ "branch_id": "<B3>", "amount": 8000, "note": "retry" }` although the first request had no `note`
- **THEN** the response is 200 with `Idempotent-Replayed: true` and row R1 unchanged

### Requirement: A repeat that arrives while the first request is still running is refused (API-IDEM-02)

When a request arrives with an `Idempotency-Key` whose first request has not finished yet, the endpoint SHALL answer status 409 with `code = "idempotency_in_progress"` without waiting and without creating a row; the client waits and retries. Access: as the endpoint's own access rule.

#### Scenario: Two requests at the same moment
- **WHEN** the test holds the first request with key `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e71` inside its transaction and sends a second request with the same key and body
- **THEN** the second response is 409 with `code = "idempotency_in_progress"`
- **AND** after the first request is released it answers 201, and a third request with the same key answers 200 with `Idempotent-Replayed: true`
- **AND** the test table has 1 row for that key

### Requirement: The same key with different identifying fields is refused (API-IDEM-02 · D-DB-12)

When a request arrives with an `Idempotency-Key` that an earlier request used with different values in the identifying fields the endpoint lists, the endpoint SHALL answer status 422 with `code = "idempotency_mismatch"` and SHALL change nothing. The comparison SHALL be made against the stored row — there SHALL be no generic idempotency-key table and no stored request hash. Access: as the endpoint's own access rule.

#### Scenario: Same key, another amount
- **WHEN** key `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70` created a row with `amount = 8000` and is sent again with `{ "branch_id": "<B3>", "amount": 10000 }`
- **THEN** the response is 422 with `code = "idempotency_mismatch"`
- **AND** the stored row still has `amount = 8000` and the table has 1 row

#### Scenario: Same key, another branch
- **WHEN** the same key is sent with `{ "branch_id": "<B1>", "amount": 8000 }`
- **THEN** the response is 422 with `code = "idempotency_mismatch"`

#### Scenario: No key table exists
- **WHEN** the tables of schema `public` are listed after this change's migrations
- **THEN** there are still 91 tables and none is named `idempotency_keys`

## MODIFIED Requirements

### Requirement: API is served under /api/v1 on the web app's own origin (API-SHAPE-01 · ADR-009 · D-API-01)

The API SHALL be served by NestJS under the path prefix `/api/v1` on the same origin as the web app — on the staff host every `/api/*` path except `/api/v1/internal/*` is routed to the API and every other path to the web app. `v1` SHALL be the only version; no version is read from a header. A staff-host path outside `/api` never reaches the API: the web app answers it — with the redirect to the login screen when the browser has no `point_session` cookie, and with its own page or not-found page when it has one. Access: routing is not permission-bound.

#### Scenario: Staff host serves the API under /api/v1
- **WHEN** a client sends `GET https://app.point.test/api/v1/health`
- **THEN** the response status is 200
- **AND** the response carries an `X-Request-Id` header (the request reached NestJS)

#### Scenario: A path without the /api prefix is not the API — signed out
- **WHEN** a client without a `point_session` cookie sends `GET https://app.point.test/v1/health`
- **THEN** the response carries no `X-Request-Id` header — the request never reached NestJS
- **AND** it is the web app's redirect to the login screen: status 307 with `Location: /login?return_to=%2Fv1%2Fhealth`

#### Scenario: A path without the /api prefix is not the API — signed in
- **WHEN** a signed-in browser (cookie `point_session` present) sends `GET https://app.point.test/v1/health`
- **THEN** the response carries no `X-Request-Id` header
- **AND** it is the web app's not-found page: status 404, `Content-Type: text/html`

#### Scenario: No second version exists
- **WHEN** a client sends `GET https://app.point.test/api/v2/health`
- **THEN** the response status is 404 with `Content-Type: application/problem+json` and `code = "not_found"`

### Requirement: The Host header selects the route tree (ADR-001 · API-META-04)

The web app SHALL serve the `site` route tree to requests whose host is the public host and the `staff` route tree to requests whose host is the staff host, by a rewrite in `proxy.ts`. A request from outside whose path is `/site`, `/staff` or begins with `/site/` or `/staff/` SHALL be answered with status 404 on both hosts, and a request for any other host SHALL be answered with status 404. On the staff host the login screen `/login` and the development catalogue `/dev/ui` SHALL open without a session; for every other staff path a request without a `point_session` cookie SHALL be answered with status 307 and `Location: /login?return_to=<the requested path and query, URL-encoded>`, and a request with the cookie SHALL get the page. The cookie test is a presence test for a clean first paint only — the API decides whether the session is valid. The site tree still serves one placeholder page at `/`, replaced by the home page in `add-public-website-pages`. Access: the site placeholder, `/login` and `/dev/ui` are public; every other staff page needs a signed-in user.

#### Scenario: Public host shows the site tree
- **WHEN** a browser opens `https://point.test/`
- **THEN** the response status is 200 and the page is the scaffold's site placeholder — it contains the element `[data-testid="site-placeholder"]` (replaced by the home page in `add-public-website-pages`)
- **AND** the page contains neither `[data-testid="login-email"]` nor `[data-testid="landing-name"]`

#### Scenario: Staff host, signed out — sent to the login screen
- **WHEN** a browser without a `point_session` cookie opens `https://app.point.test/`
- **THEN** the response status is 307 with `Location: /login?return_to=%2F`
- **AND** the page then shown is the login screen — it contains `[data-testid="login-email"]` and `[data-testid="login-google"]`

#### Scenario: The path and query asked for are kept
- **WHEN** a browser without the cookie opens `https://app.point.test/?branch=B3`
- **THEN** the response status is 307 with `Location: /login?return_to=%2F%3Fbranch%3DB3`

#### Scenario: Staff host, signed in — the start page
- **WHEN** Ko Aung, signed in, opens `https://app.point.test/`
- **THEN** the response status is 200 and the page contains `[data-testid="landing-name"]`
- **AND** the page does not contain `[data-testid="site-placeholder"]` and no element `[data-testid="staff-placeholder"]` exists any more

#### Scenario: The login screen needs no session
- **WHEN** a browser without the cookie opens `https://app.point.test/login`
- **THEN** the response status is 200 (no redirect)

#### Scenario: The login screen is not on the public host
- **WHEN** a browser opens `https://point.test/login`
- **THEN** the response status is 404 and the page does not contain `[data-testid="login-email"]`

#### Scenario: The staff tree cannot be opened through the public host
- **WHEN** a browser opens `https://point.test/staff`
- **THEN** the response status is 404 and the page contains neither `[data-testid="login-email"]` nor `[data-testid="landing-name"]`

#### Scenario: The site tree cannot be opened through the staff host
- **WHEN** a browser without the cookie opens `https://app.point.test/site`
- **THEN** the response status is 404 — not a redirect — and the page does not contain `[data-testid="site-placeholder"]`

#### Scenario: A tree's own folder name is not a public path
- **WHEN** a browser opens `https://point.test/site` and then `https://app.point.test/staff/today`, with or without a `point_session` cookie
- **THEN** both responses have status 404

#### Scenario: An unknown host gets nothing
- **WHEN** CI sends `GET http://web:3000/` with header `Host: evil.test` from inside the Docker network
- **THEN** the response status is 404
