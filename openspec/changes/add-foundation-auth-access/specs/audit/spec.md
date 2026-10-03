## Purpose

Audit keeps an append-only record of who did what, when, to which record and branch, with the before and after data and the reason. This change adds the request context that lets the database attribute changes, the application-side writer for action endpoints and the sign-in events; the audit log screen and its row-visibility rules arrive with the platform change. Scenarios use the people of `docs/plan/spec-fixtures.md`; "today" is Monday 05/Oct/2026, Myanmar Time.

## ADDED Requirements

### Requirement: Every changing request carries its user, session and request id into the database (API-AUD-01 · D-AUD-02 · API-ERR-01)

Every business action that changes data SHALL run in one database transaction, opened through the one transaction runner, that first sets, for that transaction only, `app.user_id` (the caller's user id), `app.session_id` (the caller's session id) and `app.request_id` (the request id returned in `X-Request-Id`, always a UUID), so that the database audit triggers attribute money-table changes to the caller. Before sign-in `app.user_id` and `app.session_id` SHALL be empty and `app.request_id` SHALL still be set. The values SHALL NOT be visible to any other transaction. Access: applies to every caller; not permission-bound.

#### Scenario: Values inside a signed-in request
- **WHEN** Ko Aung calls the fixture endpoint `POST /api/v1/_fixtures/context` with header `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`, and the handler reads `current_setting('app.user_id', true)`, `current_setting('app.session_id', true)` and `current_setting('app.request_id', true)` inside its transaction
- **THEN** the three values are Ko Aung's user id, the id of the session that made the call and `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`

#### Scenario: Values before sign-in
- **WHEN** the code request `POST /api/v1/auth/otp/request` for `aung@point.test` runs
- **THEN** inside its transaction `app.user_id` and `app.session_id` are empty and `app.request_id` equals the `X-Request-Id` of the response

#### Scenario: Nothing leaks to the next transaction
- **WHEN** a new transaction on the same database connection reads the three settings after Ko Aung's request has ended
- **THEN** all three are empty

### Requirement: Each action endpoint writes one application audit row with the branch it acted on (API-AUD-01 · D-AUD-01 · P1-RULE-10)

Every action endpoint SHALL write exactly one `audit_events` row with `source = 1` (APP) in the transaction of the action, holding `action`, `entity_type`, `entity_id`, `actor_user_id`, `actor_session_id`, `request_id`, the `reason` given by the caller and `branch_id`. `branch_id` SHALL be the single branch the request acted on — the one branch the access guard resolved, or the branch of the one entity loaded or created; for an action whose target is an employee and whose endpoint names no branch it SHALL be that employee's primary branch (the active branch assignment with the earliest `effective_from`), NULL when the employee has no active assignment; in every other case — company-master, shared and private targets, requests touching several branches, sign-in — it SHALL be NULL. A failed action SHALL leave no application audit row, and a repeat that changes nothing — an idempotent replay — SHALL add none. Reads SHALL NOT be audited. Access: not applicable — written by the system for whoever performs the action.

#### Scenario: Sign-out is an employee-targeted action
- **WHEN** Ko Aung (assigned to B3 since 01/Sep/2026) signs out at 6:00:00 PM with `X-Request-Id: 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`
- **THEN** exactly one row exists with `source = 1`, `action = "session.revoked"`, `entity_type = "user_sessions"`, `entity_id` = the revoked session's id, `actor_user_id` = Ko Aung's user id, `actor_session_id` = that session's id, `branch_id` = B3, `occurred_at = 2026-10-05T18:00:00+06:30` and `request_id = 0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`

#### Scenario: The branch the guard resolved
- **WHEN** Ma Hnin calls the fixture action `POST /api/v1/_fixtures/branch-action` with `{ "branch_id": "<B3>", "reason": "fixture reason" }`
- **THEN** the audit row has `branch_id` = B3 and `reason = "fixture reason"`

#### Scenario: A company-master action has no branch
- **WHEN** U Kyaw Zin calls the fixture action `POST /api/v1/_fixtures/company-action`
- **THEN** the audit row has `branch_id` NULL

#### Scenario: A request touching two branches has no branch
- **WHEN** U Kyaw Zin calls the fixture action `POST /api/v1/_fixtures/branch-items` with items for B1 and B3
- **THEN** the audit row has `branch_id` NULL

#### Scenario: A refused action leaves no row
- **WHEN** Ma Hnin's fixture action for B1 is refused with 403 `forbidden`
- **THEN** no `audit_events` row with `source = 1` exists for that `request_id`

#### Scenario: A replayed request writes no second row
- **WHEN** the fixture endpoint `POST /api/v1/_fixtures/idempotent-rows` is called twice with the same `Idempotency-Key` and the second call answers 200 with `Idempotent-Replayed: true`
- **THEN** exactly one `audit_events` row with `source = 1` exists for the created row — the replay added none

#### Scenario: Reading is not audited
- **WHEN** Ko Aung calls `GET /api/v1/me` and `GET /api/v1/branches`
- **THEN** no `audit_events` row is written

### Requirement: Sign-in successes, failures and locks are audited (P1-RULE-10 · D-AUTH-05 · API-AUD-01 · API-LIM-02)

The system SHALL write an `audit_events` row with `source = 1` (APP) and `branch_id` NULL for each of these events: `login.success` — every successful sign-in, with the method (`otp` or `google`) and the new session as `actor_session_id`; `login.failed` — every failed code verify and every failed Google callback, with the attempted e-mail address only as a hash and the caller's IP address; `login.locked` — when the fifth consecutive failure sets the lock, with the lock end. These rows SHALL remain although the request that caused them answers 401 or redirects to the login screen. A verify refused by the per-IP cap (429 `rate_limited`) is not a failed verify and SHALL write no row. Access: not applicable — written by the system.

#### Scenario: Successful code sign-in
- **WHEN** Ko Aung signs in with an e-mail code at 9:02:00 AM
- **THEN** one row exists with `action = "login.success"`, `entity_type = "users"`, `entity_id` and `actor_user_id` = Ko Aung's user id, `actor_session_id` = the new session's id, `branch_id` NULL and `after_data.method = "otp"`

#### Scenario: Wrong code
- **WHEN** a wrong code is sent for `min@point.test` from IP `203.0.113.10` and the response is 401 `otp_invalid`
- **THEN** one row exists with `action = "login.failed"`, `entity_id` = Ko Min's user id, `actor_user_id` NULL and `after_data.ip = "203.0.113.10"`
- **AND** the row's `after_data.email_hash` is 64 hexadecimal characters and the text `min@point.test` appears nowhere in the row

#### Scenario: Unknown address
- **WHEN** a code is sent for `nobody@point.test`
- **THEN** one row exists with `action = "login.failed"`, `entity_id` NULL and an `after_data.email_hash`

#### Scenario: The fifth failure writes the lock
- **WHEN** Ko Min's fifth consecutive wrong code arrives at 9:14:00 AM
- **THEN** a row with `action = "login.failed"` and a row with `action = "login.locked"` exist for that request, and the second has `after_data.until = "2026-10-05T09:34:00+06:30"`

#### Scenario: Refused Google account
- **WHEN** the Google account `stranger@example.test` is refused and the browser is sent to `/login?error=google_not_linked`
- **THEN** one row exists with `action = "login.failed"`, `entity_id` NULL and `after_data.method = "google"`

### Requirement: Codes, tokens and their hashes never reach the audit log, the application log or a stored job (API-AUD-01 · D-AUTH-04 · D-AUTH-06)

The system SHALL NOT write a sign-in code, a session token, a `code_hash`, a `token_hash`, a Google authorisation code, a Google ID token or a Google account id to `audit_events`, and SHALL NOT write a sign-in code or a session token in readable form to the application log or to a stored job. Access: not applicable — applies to every code path.

#### Scenario: A complete sign-in leaves no secret behind
- **WHEN** Ko Aung requests a code, receives `48291735`, signs in with it and receives the session token T
- **THEN** a text search for `48291735`, for T and for the SHA-256 hex digest of T finds nothing in the `audit_events` rows written since the code request, in the API log lines of those requests and in the stored `email.send` job rows

#### Scenario: A failed attempt does not record the code that was tried
- **WHEN** the wrong code `11112222` is sent for `min@point.test`
- **THEN** `11112222` appears neither in the `login.failed` row nor in the API log
