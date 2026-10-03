## Purpose

Authentication proves which employee is using the staff app and keeps that proof for as long as the account stays active: passwordless sign-in with Google or an 8-digit e-mail code, a server-side session held in an HttpOnly cookie, the checks made on every request, CSRF protection and sign-out. Scenarios use the staff host `https://app.point.test` of the development stack and the people of `docs/plan/spec-fixtures.md`; "today" is Monday 05/Oct/2026 and all times are Myanmar Time.

## ADDED Requirements

### Requirement: Login screen offers Google and an e-mail code, nothing else (D-AUTH-01 · AD-LOGIN-01)

The staff login screen at `/login` SHALL offer exactly two ways to sign in — the button **Continue with Google** and **Email me a sign-in code** with one e-mail field — together with the shop name (the owner's logo once it is supplied) and a language switch (MM / EN). It SHALL NOT contain a password field, an SMS option or a "create account" link. The controls SHALL carry the test ids `login-google` (the Google button), `login-email` (the e-mail field) and `login-send-code` (the code button), so that tests find them in either language. Access: public screen on the staff host; no session and no permission code.

#### Scenario: What the screen contains
- **WHEN** a signed-out browser opens `https://app.point.test/login`
- **THEN** the page shows one button "Continue with Google" (`[data-testid="login-google"]`), one e-mail field (`[data-testid="login-email"]`) with the button "Email me a sign-in code" (`[data-testid="login-send-code"]`) and the MM / EN switch
- **AND** the page contains no `input[type="password"]`

#### Scenario: The switch changes the text without signing in
- **WHEN** the screen is shown in Myanmar and the visitor selects EN
- **THEN** every label of the screen is shown in English from the language file and no request is sent to `/api/v1/auth/*`
- **AND** the three elements `login-google`, `login-email` and `login-send-code` are still found by their test ids

### Requirement: A code request answers the same for every e-mail address (P1.AUTH.01 · D-AUTH-04 · P1-RULE-02 · D-AUTH-02 · API-ERR-03)

`POST /v1/auth/otp/request` with body `{ "email": "<address>" }` SHALL answer status 202 with body `{ "resend_after_seconds": 60 }` whether or not the address can sign in. It SHALL create a `login_otps` row and send one e-mail only when the address is eligible: it equals `users.email` (compared in lower case) of a user with `users.status` `1 ACTIVE` or `2 INVITED` whose employee has `employees.status = 1 ACTIVE`. A body that fails the schema SHALL answer status 400 with `code = "validation"`; the `errors[]` item of `email` SHALL carry `code = "email_invalid"` when the value is not an e-mail address and the schema issue name `too_big` with `params.maximum = 255` when it is longer than 255 characters. Access: public (`@Public()`) — no session; the CSRF header rule applies.

#### Scenario: Eligible barber
- **WHEN** Ko Aung sends `POST /api/v1/auth/otp/request` with `{ "email": "aung@point.test" }` at 9:00:00 AM
- **THEN** the response is 202 with body `{ "resend_after_seconds": 60 }`
- **AND** once the work started by the request has finished, exactly one new `login_otps` row exists for Ko Aung's user with `expires_at = 2026-10-05T09:05:00+06:30`
- **AND** Mailpit holds exactly one new message addressed to `aung@point.test`

#### Scenario: Address typed with capital letters
- **WHEN** the body is `{ "email": "Aung@Point.Test" }`
- **THEN** the response is 202 and the code is created for the user whose `users.email` is `aung@point.test`

#### Scenario: Unknown address gets the same answer and no e-mail
- **WHEN** someone sends `{ "email": "nobody@point.test" }`
- **THEN** the response is 202 with body `{ "resend_after_seconds": 60 }` — the same status and body as for Ko Aung
- **AND** no `login_otps` row is created and Mailpit holds no message for `nobody@point.test`

#### Scenario: Deactivated employee gets the same answer and no e-mail
- **WHEN** Ko Naing (`users.status = 0` DISABLED, `employees.status = 0` INACTIVE) sends `{ "email": "naing@point.test" }`
- **THEN** the response is 202 with body `{ "resend_after_seconds": 60 }`
- **AND** no `login_otps` row is created and Mailpit holds no message for `naing@point.test`

#### Scenario: Not an e-mail address
- **WHEN** the body is `{ "email": "aung" }`
- **THEN** the response is 400 with `code = "validation"`, `errors[0].field = "email"` and `errors[0].code = "email_invalid"`

#### Scenario: Address of 255 characters is accepted
- **WHEN** the body carries an address of 255 characters (244 × `a` followed by `@point.test`)
- **THEN** the response is 202 with body `{ "resend_after_seconds": 60 }`

#### Scenario: Address of 256 characters is refused
- **WHEN** the body carries an address of 256 characters (245 × `a` followed by `@point.test`)
- **THEN** the response is 400 with `code = "validation"`, `errors[0].field = "email"`, `errors[0].code = "too_big"` and `errors[0].params = { "maximum": 255 }`

### Requirement: A code is 8 digits, valid for 5 minutes, usable once, and only the latest one counts (P1-RULE-03 · D-AUTH-04 · P1.AUTH.02 · API-ERR-03)

A sign-in code SHALL be 8 decimal digits (`^[0-9]{8}$`) and SHALL be stored only as an HMAC-SHA256 hash in `login_otps.code_hash`. `expires_at` SHALL be `created_at` + 5 minutes and `POST /v1/auth/otp/verify` SHALL accept the code only while the server time is earlier than `expires_at`. A successful verify SHALL set `consumed_at` and the code SHALL never be accepted again. A new code request SHALL invalidate every earlier unused code of that user. Every verify that does not succeed — wrong, expired, already used, replaced by a newer code, or an address that cannot sign in — SHALL answer status 401 with `code = "otp_invalid"` and the same body members; the body SHALL NOT say which case it was nor how many attempts remain. A `code` value that is not 8 digits SHALL answer status 400 with `code = "validation"` and the field code `otp_format`, and SHALL NOT count as a failed verify. Access: public (`@Public()`).

#### Scenario: Accepted at 4 minutes 59 seconds
- **WHEN** Ko Aung's code was created at 9:00:00 AM and he sends `POST /api/v1/auth/otp/verify` with `{ "email": "aung@point.test", "code": "<the code>" }` at 9:04:59 AM
- **THEN** the response is 200 with the `MeResponse` body and a `Set-Cookie: point_session=…` header
- **AND** the `login_otps` row has `consumed_at = 2026-10-05T09:04:59+06:30`

#### Scenario: Refused at exactly 5 minutes
- **WHEN** the same code is sent at 9:05:00 AM (`expires_at` = 9:05:00 AM)
- **THEN** the response is 401 with `code = "otp_invalid"` and no `Set-Cookie` header

#### Scenario: Refused at 5 minutes 1 second
- **WHEN** the same code is sent at 9:05:01 AM
- **THEN** the response is 401 with `code = "otp_invalid"` and no session row is created

#### Scenario: A used code cannot be used again
- **WHEN** Ko Aung signed in with the code at 9:02:00 AM and the same code is sent again at 9:03:00 AM
- **THEN** the response is 401 with `code = "otp_invalid"`

#### Scenario: Only the latest code works
- **WHEN** Ko Aung requests code A at 9:00:00 AM and code B at 9:01:30 AM, then sends code A at 9:02:00 AM
- **THEN** the response is 401 with `code = "otp_invalid"`
- **AND** code B sent at 9:02:30 AM answers 200

#### Scenario: Unknown address looks like a wrong code
- **WHEN** someone sends `{ "email": "nobody@point.test", "code": "12345678" }`
- **THEN** the response is 401 with `code = "otp_invalid"` and exactly the members a wrong code for `aung@point.test` returns (`type`, `title`, `status`, `code`, `request_id`) — no `until`, no attempt counter

#### Scenario: The code is not stored
- **WHEN** a code is created for Ko Aung
- **THEN** `login_otps.code_hash` is 64 hexadecimal characters and no column of the row contains the 8 digits

#### Scenario: Seven digits fail the schema
- **WHEN** the body is `{ "email": "aung@point.test", "code": "1234567" }`
- **THEN** the response is 400 with `code = "validation"`, `errors[0].field = "code"` and `errors[0].code = "otp_format"`, and the failure counter of Ko Aung is unchanged

#### Scenario: Nine digits fail the schema
- **WHEN** the body is `{ "email": "aung@point.test", "code": "123456789" }`
- **THEN** the response is 400 with `code = "validation"`, `errors[0].field = "code"` and `errors[0].code = "otp_format"`, and the failure counter of Ko Aung is unchanged

### Requirement: Code requests are limited to one per 60 seconds per address and 10 per hour per IP (API-LIM-02 · P1.AUTH.01 · D-AUTH-04)

`POST /v1/auth/otp/request` SHALL refuse a request for an address made less than 60 seconds after the previous accepted request for the same address, and SHALL refuse a request from an IP address that already had 10 accepted requests in the preceding 60 minutes. A refused request SHALL answer status 429 with `code = "rate_limited"`, the member `retry_after` (whole seconds until the request would be accepted) and the header `Retry-After` with the same value; it SHALL create no code and send no e-mail. The 60-second rule SHALL apply to every address, eligible or not, so that it reveals nothing about the address. Access: public (`@Public()`).

#### Scenario: Resend at 59 seconds is refused
- **WHEN** Ko Aung's request was accepted at 9:00:00 AM and he sends the same request at 9:00:59 AM
- **THEN** the response is 429 with `code = "rate_limited"`, `retry_after = 1` and header `Retry-After: 1`
- **AND** no second `login_otps` row exists

#### Scenario: Resend at 60 seconds is accepted
- **WHEN** he sends the request again at 9:01:00 AM
- **THEN** the response is 202 and a second `login_otps` row exists

#### Scenario: The cooldown is the same for an unknown address
- **WHEN** `nobody@point.test` was requested at 9:00:00 AM and again at 9:00:30 AM
- **THEN** the second response is 429 with `code = "rate_limited"` and `retry_after = 30`

#### Scenario: Tenth request from one IP is accepted
- **WHEN** nine requests from IP `203.0.113.10` were accepted between 9:00:00 AM and 9:24:00 AM and a tenth arrives at 9:27:00 AM
- **THEN** the response is 202

#### Scenario: Eleventh request from the same IP is refused
- **WHEN** ten requests from IP `203.0.113.10` were accepted, the first at 9:00:00 AM and the tenth at 9:27:00 AM, and an eleventh arrives at 9:45:00 AM
- **THEN** the response is 429 with `code = "rate_limited"` and `retry_after = 900` (the first request leaves the window at 9:00:00 + 60 min = 10:00:00 AM; 10:00:00 − 9:45:00 = 15 min = 900 s)

#### Scenario: The window slides
- **WHEN** the same IP sends another request at 10:00:00 AM
- **THEN** the response is 202 (only nine accepted requests are younger than 60 minutes)

### Requirement: Five wrong codes in a row lock code sign-in for 20 minutes (P1-RULE-03 · API-LIM-02 · D-AUTH-04 · AD-LOGIN-02)

Each verify that fails for an eligible user while no lock is running SHALL add 1 to `users.failed_login_count`, however many codes were requested in between. A failure that brings the count to 5 or more SHALL set `users.login_locked_until` to the time of that attempt + 20 minutes. That attempt and every verify for the user while the server time is earlier than `login_locked_until` SHALL answer status 401 with `code = "login_locked"` and the member `until` (the lock end, ISO 8601 with `+06:30`), whether or not the code is right; a verify made during a lock SHALL change neither the count nor the lock end. Only a successful verify SHALL reset `failed_login_count` to 0. Access: public (`@Public()`).

#### Scenario: Fourth wrong code is still "invalid"
- **WHEN** Ko Min requested a code at 9:10:00 AM and sends wrong codes at 9:10:30, 9:11:00, 9:11:30 and 9:12:00 AM
- **THEN** each response is 401 with `code = "otp_invalid"`
- **AND** `users.failed_login_count` for Ko Min is 4 and `login_locked_until` is NULL

#### Scenario: Fifth wrong code locks
- **WHEN** Ko Min sends a fifth wrong code at 9:14:00 AM
- **THEN** the response is 401 with `code = "login_locked"` and `until = "2026-10-05T09:34:00+06:30"` (9:14 + 20 min)
- **AND** `users.login_locked_until` is `2026-10-05T09:34:00+06:30` and `users.failed_login_count` is 5 (4 + 1)

#### Scenario: The right code does not help during the lock
- **WHEN** Ko Min sends the correct, unexpired code at 9:14:30 AM (the sixth attempt)
- **THEN** the response is 401 with `code = "login_locked"` and `until = "2026-10-05T09:34:00+06:30"`
- **AND** no session is created, the code is not marked used and `users.failed_login_count` is still 5

#### Scenario: The lock is still active one second before its end
- **WHEN** Ko Min requested a new code at 9:33:30 AM and sends it, correct, at 9:33:59 AM
- **THEN** the response is 401 with `code = "login_locked"` and `until = "2026-10-05T09:34:00+06:30"`

#### Scenario: The lock ends at the stated minute
- **WHEN** Ko Min sends the correct code of 9:33:30 AM at 9:34:00 AM
- **THEN** the response is 200 and `users.failed_login_count` is 0

#### Scenario: A wrong code after the lock locks again at once
- **WHEN** instead Ko Min sends a wrong code at 9:35:00 AM, after the lock ended, while `users.failed_login_count` is still 5
- **THEN** the response is 401 with `code = "login_locked"` and `until = "2026-10-05T09:55:00+06:30"` (9:35 + 20 min)
- **AND** `users.failed_login_count` is 6 (5 + 1)

#### Scenario: Failures are counted across codes
- **WHEN** Ko Htet fails three times on code A, requests code B and fails twice on code B
- **THEN** the second failure on code B is the fifth in a row and answers 401 with `code = "login_locked"`

#### Scenario: A success resets the count
- **WHEN** Ko Thura fails four times, then signs in with the right code, signs out and later fails four times again
- **THEN** after the sign-in `users.failed_login_count` is 0
- **AND** the last of the later four failures answers `code = "otp_invalid"`, not `login_locked`

### Requirement: Code verify is limited to 10 attempts per hour per IP (API-LIM-02 · P1-RULE-03 · P1.AUTH.02)

`POST /v1/auth/otp/verify` SHALL process at most 10 verify attempts from one IP address in any 60 minutes; every processed attempt counts — successful, wrong or answered `login_locked` — whichever address it names. A further attempt from that IP address SHALL answer status 429 with `code = "rate_limited"`, the member `retry_after` (whole seconds until an attempt would be processed) and the header `Retry-After` with the same value. The cap SHALL be applied before the address is looked up: a refused attempt SHALL NOT examine or consume a code, SHALL NOT change `users.failed_login_count` or `users.login_locked_until`, SHALL create no session and SHALL write no `audit_events` row. Access: public (`@Public()`).

#### Scenario: Tenth attempt from one IP is processed
- **WHEN** nine verify attempts for `nobody@point.test` from IP `203.0.113.10` were answered 401 `otp_invalid` between 9:00:00 AM and 9:24:00 AM, and a tenth — the wrong code `11112222` for `min@point.test` — arrives from the same IP at 9:27:00 AM
- **THEN** the response is 401 with `code = "otp_invalid"`
- **AND** `users.failed_login_count` for Ko Min is 1 and one `login.failed` row exists for that request

#### Scenario: Eleventh attempt is refused before anything is looked up
- **WHEN** an eleventh attempt, again a wrong code for `min@point.test`, arrives from `203.0.113.10` at 9:45:00 AM (the first of the ten was at 9:00:00 AM)
- **THEN** the response is 429 with `code = "rate_limited"`, `retry_after = 900` and header `Retry-After: 900` (the first attempt leaves the window at 9:00:00 + 60 min = 10:00:00 AM; 10:00:00 − 9:45:00 = 15 min = 900 s)
- **AND** `users.failed_login_count` for Ko Min is still 1 and no `audit_events` row exists for that request

#### Scenario: A right code is refused too and is not used up
- **WHEN** Ko Aung's code was created at 9:44:00 AM and he sends it, correct, from `203.0.113.10` at 9:46:00 AM
- **THEN** the response is 429 with `code = "rate_limited"` and `retry_after = 840` (10:00:00 − 9:46:00 = 14 min = 840 s), without a `Set-Cookie` header
- **AND** the `login_otps` row has `consumed_at` NULL and no `user_sessions` row was created

#### Scenario: Another IP is not affected
- **WHEN** Ko Aung sends the same code from IP `203.0.113.20` at 9:46:30 AM
- **THEN** the response is 200 with a `Set-Cookie: point_session=…` header

#### Scenario: The window slides
- **WHEN** `203.0.113.10` sends a wrong code for `nobody@point.test` at 10:00:00 AM
- **THEN** the attempt is processed and answers 401 with `code = "otp_invalid"` (only nine processed attempts are younger than 60 minutes; the refused ones of 9:45 and 9:46 were not counted)

### Requirement: The code e-mail uses the user's language and is delivered to Mailpit outside production (P1.AUTH.01 · AD-L10N-06 · ADR-007 · D-ARC-02)

The code e-mail SHALL be written in the language of `users.ui_language` (1 MY · 2 EN) and in the system default language (1 MY) when that column is NULL; it SHALL contain the 8-digit code on a line of its own, not grouped, and the text that it is valid for 5 minutes. It SHALL be sent by the job `email.send`, and a job that starts after the code's `expires_at` SHALL send nothing. In development and test environments every e-mail SHALL be delivered to Mailpit only; in production it is sent through Resend, which delivers to staff addresses only after the owner's domain is verified there — until then the pilot signs in with Google. Access: not applicable — a system action after an accepted code request.

#### Scenario: Default language is Myanmar
- **WHEN** Ko Aung (`ui_language` NULL) requests a code at 9:00:00 AM
- **THEN** the message for `aung@point.test` in Mailpit has the Myanmar subject and body of the language file
- **AND** one line of the body consists of exactly 8 digits and the subject contains no digit

#### Scenario: English for a user who chose English
- **WHEN** U Kyaw Zin has `ui_language = 2` and requests a code
- **THEN** the message for `kyawzin@point.test` has the English subject and body of the language file (keys `auth.email.otp.subject`, `auth.email.otp.body`) and states the 5-minute validity

#### Scenario: A test reads the code from Mailpit
- **WHEN** the automated test requests a code for `aung@point.test` and calls Mailpit's API `GET /api/v1/search?query=to:aung@point.test`
- **THEN** the newest message's text contains exactly one match of `[0-9]{8}`, and sending that value to `POST /api/v1/auth/otp/verify` answers 200

#### Scenario: A late job sends nothing
- **WHEN** the `email.send` job for a code created at 9:00:00 AM first runs at 9:05:10 AM
- **THEN** no message is delivered and the job ends without retry

### Requirement: Code entry screen (AD-LOGIN-02 · AD-FMT-10 · D-AUTH-04)

After a code request the login screen SHALL show the message "If this email can sign in, we've sent a code", one input for the 8-digit code with `autocomplete="one-time-code"` and `inputmode="numeric"`, the texts "Valid for 5 minutes" and "Only the latest code works", and a **Resend** button that is disabled while a 60-second countdown runs. The input SHALL accept a pasted code with spaces and Myanmar digits (၀–၉), show the digits grouped as `1234 5678` and submit 8 Western digits. After a `login_locked` answer the screen SHALL show "Too many attempts. Try again at <time>" with the lock end as `h:mm AM/PM`. The code input SHALL carry the test id `login-code` and the button that sends the code `login-submit`. Access: public screen.

#### Scenario: Same message for a known and an unknown address
- **WHEN** a visitor submits `aung@point.test`, and another visitor submits `nobody@point.test`
- **THEN** both see the code entry step with the text "If this email can sign in, we've sent a code"

#### Scenario: Pasted code with a space
- **WHEN** Ko Aung pastes `4829 1735` into `[data-testid="login-code"]` and activates `[data-testid="login-submit"]`
- **THEN** the input shows `4829 1735` and the request body carries `"code": "48291735"`

#### Scenario: Myanmar digits are converted
- **WHEN** Ko Aung types `၄၈၂၉၁၇၃၅`
- **THEN** the input shows `4829 1735` and the request body carries `"code": "48291735"`

#### Scenario: Resend countdown
- **WHEN** the code was requested at 9:00:00 AM
- **THEN** the Resend button is disabled and shows the remaining seconds, starting at 60
- **AND** at 9:01:00 AM it becomes enabled

#### Scenario: Seven digits are stopped on the screen
- **WHEN** Ko Aung submits `4829 173`
- **THEN** the message of key `error.otp_format` appears under the input, the input has `aria-invalid="true"` and no request is sent

#### Scenario: Lock message shows the time
- **WHEN** the API answers 401 `login_locked` with `until = "2026-10-05T09:34:00+06:30"`
- **THEN** the screen shows "Too many attempts. Try again at 9:34 AM" and the code input is disabled until 9:34 AM

### Requirement: The first successful sign-in activates an invited user (P1-RULE-02 · D-AUTH-03 · AD-LOGIN-03)

A successful sign-in by either method of a user with `users.status = 2 INVITED` SHALL, in the same transaction that creates the session, set `users.status` to `1 ACTIVE` and `users.activated_at` to the sign-in time. Every successful sign-in SHALL set `users.last_login_at`; `activated_at` SHALL never change afterwards. Access: public — the person signing in; no admin step.

#### Scenario: Ma Thida's first sign-in
- **WHEN** Ma Thida (`users.status = 2` INVITED, `activated_at` NULL) signs in with an e-mail code at 9:30:00 AM
- **THEN** the response is 200 and its `user.status` is `1`
- **AND** `users.status = 1`, `users.activated_at = 2026-10-05T09:30:00+06:30` and `users.last_login_at = 2026-10-05T09:30:00+06:30`

#### Scenario: Her second sign-in changes only the last-login time
- **WHEN** Ma Thida signs in again at 11:00:00 AM
- **THEN** `users.activated_at` is still `2026-10-05T09:30:00+06:30` and `users.last_login_at` is `2026-10-05T11:00:00+06:30`

### Requirement: Google sign-in in a browser is a redirect flow that returns only to the staff app (P1.AUTH.03 · P1.AUTH.04 · ADR-005 · D-AUTH-01)

`GET /v1/auth/google/start` SHALL answer status 302 to Google's OpenID Connect authorisation endpoint with the authorisation-code flow, PKCE (`code_challenge_method=S256`) and a `state` value tied to the browser by a cookie. `GET /v1/auth/google/callback` SHALL, when the state matches and the identity is accepted, create a session with `login_method = 1` (GOOGLE), set the `point_session` cookie and answer status 302 to the `return_to` path given at the start, or to `/` when none was given. `return_to` SHALL be used only when it is a path of the staff host — it matches `^/[^/].*$` and contains no backslash; any other value SHALL be ignored and `/` used. Every failed callback SHALL answer status 302 to `/login?error=google_not_linked` and create no session. This change builds the browser flow (`client=web`, the default of P1.AUTH.03); the query parameters `client` and `challenge` of the shell and iOS-PWA hand-off do not exist yet — they arrive, together with P1.AUTH.06, in `add-android-shell`. Access: public (`@Public()`); both are GET requests, so the CSRF header rule does not apply.

#### Scenario: Start redirects to Google
- **WHEN** a browser opens `https://app.point.test/api/v1/auth/google/start?return_to=/today`
- **THEN** the response is 302 and `Location` starts with the issuer's authorisation endpoint (`https://accounts.google.com/o/oauth2/v2/auth` in production; the stub issuer's endpoint in the integration test) and carries `response_type=code`, `code_challenge_method=S256`, a `state` parameter and a `scope` containing `openid` and `email`
- **AND** a `Set-Cookie` header sets the state cookie with `HttpOnly; Secure; SameSite=Lax`

#### Scenario: Callback signs in and returns to the requested page
- **WHEN** Google redirects the same browser to `/api/v1/auth/google/callback` with the matching `state` and a valid `code` for Ko Aung's Google account
- **THEN** the response is 302 with `Location: /today` and a `Set-Cookie: point_session=…` header
- **AND** a `user_sessions` row with `login_method = 1` exists for Ko Aung

#### Scenario: No return path
- **WHEN** the flow was started without `return_to`
- **THEN** the callback answers 302 with `Location: /`

#### Scenario: A foreign return address is ignored
- **WHEN** the flow was started with `return_to=https://evil.test/x`, with `return_to=//evil.test/x` or with `return_to=/\evil.test`
- **THEN** in each case the callback answers 302 with `Location: /`

#### Scenario: State does not match
- **WHEN** the callback is opened with a `state` that differs from the browser's state cookie
- **THEN** the response is 302 with `Location: /login?error=google_not_linked`, no `point_session` cookie is set and no session row is created

### Requirement: A Google account is tied to the user at the first Google sign-in (D-AUTH-08 · P1-RULE-02 · D-AUTH-02)

At the first Google sign-in of a user (`users.google_subject` NULL) the verified e-mail address of the Google account SHALL equal `users.email`; the Google account id (`sub`) SHALL then be stored in `users.google_subject`. At every later Google sign-in the user SHALL be found by `google_subject` alone. A Google account that matches no user by these rules, or whose user is not eligible (`users.status` not 1 or 2, or `employees.status` not 1), SHALL NOT get a session. Access: public — the person signing in.

#### Scenario: First Google sign-in stores the account id
- **WHEN** Ko Aung (`google_subject` NULL) signs in with the Google account whose verified e-mail is `aung@point.test` and whose `sub` is `g-1001`
- **THEN** a session is created and `users.google_subject` for Ko Aung is `g-1001`

#### Scenario: Later sign-ins are matched by the account id
- **WHEN** the Google account with `sub = g-1001` signs in again
- **THEN** a session is created for Ko Aung

#### Scenario: A different Google account with the same address is refused
- **WHEN** Ko Aung's `google_subject` is `g-1001` and a Google account with `sub = g-2002` presents the e-mail `aung@point.test`
- **THEN** the callback answers 302 to `/login?error=google_not_linked` and Ko Aung's `google_subject` is still `g-1001`

#### Scenario: A Google account nobody registered
- **WHEN** a Google account with e-mail `stranger@example.test` and `sub = g-9999` completes the Google step
- **THEN** the callback answers 302 to `/login?error=google_not_linked`, no session is created and no `users` row changes

#### Scenario: Deactivated employee
- **WHEN** Ko Naing (`employees.status = 0`) completes the Google step with the account `naing@point.test`
- **THEN** the callback answers 302 to `/login?error=google_not_linked` and no session is created

### Requirement: The session lives in the cookie point_session and never expires on its own (API-AUTH-01 · ADR-005 · ADR-009 · D-AUTH-06)

A successful sign-in SHALL create one `user_sessions` row and set the cookie `point_session` to a random 256-bit token in base64url (43 characters); the database SHALL store only its SHA-256 hash in `token_hash`. The cookie attributes SHALL be exactly `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=34560000` (400 days) with no `Domain` attribute. The session SHALL have no expiry and no idle timeout. The cookie SHALL be sent again with the same token and `Max-Age=34560000` on the first successful request in each 30-day period counted from the session's `created_at` — so a cookie in use never reaches the 400-day limit. Access: set only by the sign-in endpoints.

#### Scenario: Cookie after a code sign-in
- **WHEN** Ko Aung signs in with an e-mail code on his Android phone at 9:02:00 AM
- **THEN** the response has one `Set-Cookie` header whose value starts with `point_session=` followed by 43 characters of `[A-Za-z0-9_-]` and which contains `Max-Age=34560000`, `Path=/`, `HttpOnly`, `Secure` and `SameSite=Lax`
- **AND** the header contains no `Domain=`

#### Scenario: Only the hash is stored
- **WHEN** the session row of that sign-in is read
- **THEN** `token_hash` is the 64-character SHA-256 hex digest of the cookie value, `login_method = 2` (EMAIL_OTP), `created_at = 2026-10-05T09:02:00+06:30` and no column holds the cookie value

#### Scenario: No idle timeout
- **WHEN** a session was created on 05/Sep/2026 at 10:00 AM, no request was made for 29 days, and `GET /api/v1/me` is sent on 04/Oct/2026 at 10:00 AM
- **THEN** the response is 200

#### Scenario: No re-issue at 29 days
- **WHEN** that request of 04/Oct/2026 10:00 AM (29 days after `created_at`) is answered
- **THEN** the response has no `Set-Cookie` header

#### Scenario: Re-issue at exactly 30 days
- **WHEN** the next request is sent on 05/Oct/2026 at 10:00:00 AM (05/Sep + 30 days — the first request of the second 30-day period)
- **THEN** the response is 200 and has a `Set-Cookie: point_session=<the same token>` header with `Max-Age=34560000`

#### Scenario: Only once per period
- **WHEN** a further request is sent on 05/Oct/2026 at 10:01 AM
- **THEN** the response has no `Set-Cookie` header

#### Scenario: Next period
- **WHEN** no request is made until 04/Nov/2026 10:00 AM (05/Sep + 60 days) and one is sent at that moment
- **THEN** the response has a `Set-Cookie: point_session=<the same token>` header with `Max-Age=34560000`

### Requirement: Every staff request re-checks the session, the user and the employee (P1-RULE-04 · API-AUTH-01 · D-AUTH-06)

On every request to a staff endpoint the API SHALL check, in this order and before any permission check: (1) the `point_session` cookie is present, (2) a `user_sessions` row with that token hash exists and has `revoked_at IS NULL`, (3) `users.status = 1` (ACTIVE), (4) `employees.status = 1` (ACTIVE). A missing cookie or an unknown token SHALL answer status 401 with `code = "unauthenticated"`. A revoked session SHALL answer status 401 with `code = "session_revoked"` and the member `reason` = its `revoke_reason` (1 LOGOUT · 2 DEVICE_REMOVED · 3 ADMIN_REVOKE_ALL · 4 ACCOUNT_INACTIVE); a user or employee that is no longer active SHALL answer the same with `reason = 4`. `user_sessions.last_seen_at` SHALL be written at most once every 5 minutes. Access: applies to every endpoint that is not `@Public()` or `@Internal()`.

#### Scenario: No cookie
- **WHEN** a client without a cookie sends `GET /api/v1/me`
- **THEN** the response is 401 with `code = "unauthenticated"`

#### Scenario: Unknown token
- **WHEN** a client sends `GET /api/v1/me` with `Cookie: point_session=AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA`
- **THEN** the response is 401 with `code = "unauthenticated"`

#### Scenario: Session revoked by an admin
- **WHEN** Ko Min's session row has `revoked_at` set and `revoke_reason = 3` and his phone sends `GET /api/v1/me`
- **THEN** the response is 401 with `code = "session_revoked"` and `reason = 3`

#### Scenario: Employee deactivated while signed in
- **WHEN** Ko Min's employee status is changed to `0` INACTIVE at 2:00:00 PM, his sessions are revoked with `revoke_reason = 4`, and his phone sends `GET /api/v1/me` at 2:00:05 PM
- **THEN** the response is 401 with `code = "session_revoked"` and `reason = 4`

#### Scenario: Status is checked even when the session row was left active
- **WHEN** a `user_sessions` row for Ko Naing (`users.status = 0`, `employees.status = 0`) has `revoked_at` NULL and its token is used for `GET /api/v1/me`
- **THEN** the response is 401 with `code = "session_revoked"` and `reason = 4`

#### Scenario: The session is checked before the permission
- **WHEN** Ko Min's revoked session (reason 3) sends `GET /api/v1/employees`, for which he holds no permission code
- **THEN** the response is 401 `session_revoked`, not 403

#### Scenario: Last-seen is not written at 4 minutes 59 seconds
- **WHEN** Ko Aung's `last_seen_at` is 10:00:00 AM and he sends a request at 10:04:59 AM
- **THEN** `last_seen_at` is still 10:00:00 AM

#### Scenario: Last-seen is written at 5 minutes
- **WHEN** he sends a request at 10:05:00 AM
- **THEN** `last_seen_at` is 10:05:00 AM

### Requirement: Changing requests need the app header and the app origin (API-AUTH-02 · ADR-005 · ADR-009)

Every `POST`, `PATCH`, `PUT` and `DELETE` request to the staff API — the sign-in endpoints included — SHALL carry the header `X-Requested-With: point-app` and an `Origin` header (or, when `Origin` is absent, a `Referer`) whose origin equals the staff app origin, one value (`https://app.point.test` in the development stack). A request that fails either check SHALL answer status 403 with `code = "csrf"` and SHALL change nothing. `GET` requests are not checked. Access: applies to every caller, before the session check.

#### Scenario: Header missing
- **WHEN** Ko Aung, signed in, sends `PATCH /api/v1/me` with `{ "ui_language": 2 }`, `Origin: https://app.point.test` and no `X-Requested-With` header
- **THEN** the response is 403 with `code = "csrf"` and `users.ui_language` for Ko Aung is unchanged

#### Scenario: Header with another value
- **WHEN** the same request carries `X-Requested-With: XMLHttpRequest`
- **THEN** the response is 403 with `code = "csrf"`

#### Scenario: Request from the public website's origin
- **WHEN** the same request carries `X-Requested-With: point-app` and `Origin: https://point.test`
- **THEN** the response is 403 with `code = "csrf"`

#### Scenario: Neither Origin nor Referer
- **WHEN** the same request carries `X-Requested-With: point-app` and neither an `Origin` nor a `Referer` header
- **THEN** the response is 403 with `code = "csrf"`

#### Scenario: Referer is used when Origin is absent
- **WHEN** the same request carries `X-Requested-With: point-app`, no `Origin` and `Referer: https://app.point.test/`
- **THEN** the response is 200 and `users.ui_language` for Ko Aung is `2`

#### Scenario: Reading needs no header
- **WHEN** Ko Aung sends `GET /api/v1/me` without `X-Requested-With`
- **THEN** the response is 200

#### Scenario: The code request is protected too
- **WHEN** a client sends `POST /api/v1/auth/otp/request` with `{ "email": "aung@point.test" }` and no `X-Requested-With` header
- **THEN** the response is 403 with `code = "csrf"` and no `login_otps` row is created

### Requirement: Sign-out revokes the current session only (P1.AUTH.05 · D-AUTH-05 · D-AUTH-06)

`POST /v1/auth/logout` SHALL set `revoked_at` to the current time, `revoke_reason = 1` (LOGOUT) and `revoked_by_user_id` to the caller on the session that made the request, answer status 204 and clear the `point_session` cookie (`Max-Age=0`). The caller's other sessions SHALL stay active. Access: any signed-in user, for their own current session; no permission code.

#### Scenario: Sign out on the phone, the laptop stays signed in
- **WHEN** Ko Aung has one session on his Android phone and one on a laptop, and the phone sends `POST /api/v1/auth/logout` at 6:00:00 PM
- **THEN** the response is 204 and its `Set-Cookie` header sets `point_session` to an empty value with `Max-Age=0`
- **AND** the phone's session row has `revoked_at = 2026-10-05T18:00:00+06:30` and `revoke_reason = 1`
- **AND** the laptop's `GET /api/v1/me` still answers 200

#### Scenario: The old cookie no longer works
- **WHEN** the phone's old cookie value is sent with `GET /api/v1/me` at 6:00:05 PM
- **THEN** the response is 401 with `code = "session_revoked"` and `reason = 1`

#### Scenario: Sign-out without a session
- **WHEN** a client without a cookie sends `POST /api/v1/auth/logout` with the CSRF header
- **THEN** the response is 401 with `code = "unauthenticated"`

### Requirement: Signing in again in the same browser revokes the session that browser held (P1-RULE-15 · P1.AUTH.02 · P1.AUTH.04 · D-AUTH-06)

When a sign-in succeeds — a code verify or a Google callback — on a request that carries a `point_session` cookie whose session is still valid (the row exists, `revoked_at IS NULL`, and its user and employee are active), the system SHALL revoke that session with `revoke_reason = 1` (LOGOUT) in the same transaction that creates the new session and SHALL write one `audit_events` row with `action = "session.revoked"` for it. The new cookie replaces the old one, so one browser holds one session. A sign-in that fails SHALL revoke nothing, and a cookie whose session is unknown or already revoked SHALL be ignored. Sessions held by other browsers and devices SHALL stay active. Access: the public sign-in endpoints (`@Public()`); the rule acts only on the session of the cookie that came with the sign-in request.

#### Scenario: The same person signs in again in the same browser
- **WHEN** Ko Aung's phone browser holds session S1 (signed in at 9:02:00 AM) and he signs in again with an e-mail code at 9:30:00 AM, the verify request carrying S1's cookie
- **THEN** the response is 200 with a `Set-Cookie: point_session=…` header holding a new token, and a new session row S2 exists
- **AND** S1 has `revoked_at = 2026-10-05T09:30:00+06:30` and `revoke_reason = 1`
- **AND** S1's old cookie value, sent with `GET /api/v1/me`, answers 401 with `code = "session_revoked"` and `reason = 1`

#### Scenario: Another person signs in on a shared phone
- **WHEN** the shop phone's browser holds Ko Aung's session S1, Ko Aung also has session S3 on a laptop, and Ko Min signs in on the phone with an e-mail code at 9:40:00 AM
- **THEN** Ko Min's session is created and S1 has `revoked_at = 2026-10-05T09:40:00+06:30` and `revoke_reason = 1`
- **AND** the laptop's `GET /api/v1/me` with S3 still answers 200 for Ko Aung

#### Scenario: The revocation is audited
- **WHEN** S1 is revoked by Ko Aung's sign-in of 9:30:00 AM
- **THEN** one `audit_events` row exists with `action = "session.revoked"`, `entity_type = "user_sessions"`, `entity_id` = S1's id, `after_data.revoke_reason = 1` and `branch_id` = B3 (Ko Aung's primary branch)
- **AND** it carries the same `request_id` as the `login.success` row of that sign-in

#### Scenario: A failed sign-in revokes nothing
- **WHEN** the browser holds Ko Aung's valid session S1 and a wrong code is sent for `aung@point.test` with S1's cookie
- **THEN** the response is 401 with `code = "otp_invalid"` and S1 has `revoked_at` NULL — `GET /api/v1/me` with S1 still answers 200

#### Scenario: An already revoked cookie is ignored
- **WHEN** Ko Aung signed out at 6:00:00 PM (S1 revoked with reason 1), a client still sends S1's cookie value, and he signs in again at 6:05:00 PM
- **THEN** the sign-in answers 200, S1 keeps `revoked_at = 2026-10-05T18:00:00+06:30`, and exactly one `session.revoked` row exists for S1 — the one of 6:00:00 PM

#### Scenario: Google sign-in follows the same rule
- **WHEN** the browser holds Ko Aung's valid session S1 and the Google callback signs him in at 9:50:00 AM
- **THEN** the 302 response sets a new `point_session` cookie and S1 has `revoked_at = 2026-10-05T09:50:00+06:30` and `revoke_reason = 1`

### Requirement: After sign-in the start page shows who is signed in and their branches (API-AUTH-05 · AD-NAV-04 · AD-NAV-07 · AD-L10N-03)

Until the Today screen exists, the staff app's start page `/` SHALL show, from the `/me` payload only: the employee's name (`name_mm` in the Myanmar interface; `name_en`, or `name_mm` when it is empty, in the English interface), the user's e-mail address, the branches of `branches_in_scope` (code and name), the MM / EN switch and **Sign out**. The elements SHALL carry the test ids `landing-name`, `landing-email`, `landing-branches` and `landing-sign-out`. The page is temporary: `add-walkin-visit-checkout` replaces it with Today. Access: any signed-in user — own data only; no permission code.

#### Scenario: A barber
- **WHEN** Ko Aung is signed in with the Myanmar interface and opens `https://app.point.test/`
- **THEN** `landing-name` shows `ကိုအောင်`, `landing-email` shows `aung@point.test` and `landing-branches` lists exactly one branch, `B3` · `ပွိုင့် ၃.၀`

#### Scenario: English interface
- **WHEN** Ko Aung switches to EN
- **THEN** `landing-name` shows `Ko Aung` and the branch is shown as `B3` · `Point 3.0`

#### Scenario: The company admin sees three branches
- **WHEN** U Kyaw Zin opens the start page
- **THEN** `landing-branches` lists `B1`, `B2` and `B3`

#### Scenario: Sign out from the start page
- **WHEN** Ko Aung activates `landing-sign-out`
- **THEN** `POST /api/v1/auth/logout` answers 204 and the login screen shows "You signed out"

### Requirement: A lost session leads to the login screen with the reason and back to the same page (AD-AUTH-01 · D-AUTH-06)

When any staff API call answers 401, the app SHALL show the login screen. For `session_revoked` it SHALL show the message of the `reason`: 1 → "You signed out" · 2 → "This device was removed" · 3 → "An admin signed you out of all devices" · 4 → "Your account is no longer active"; for `unauthenticated` it SHALL show no reason. After the next successful sign-in the app SHALL open the page the user was on. Access: every staff screen.

#### Scenario: Opening the app signed out
- **WHEN** a browser without a session opens `https://app.point.test/?branch=B3`
- **THEN** the login screen is shown without a reason message
- **AND** after Ko Aung signs in, the browser is at `https://app.point.test/?branch=B3`

#### Scenario: After signing out
- **WHEN** Ko Aung taps Sign out
- **THEN** the login screen shows "You signed out"

#### Scenario: Signed out by an admin while the app is open
- **WHEN** Ko Min's session is revoked with `revoke_reason = 3` and his app makes its next API call
- **THEN** the login screen shows "An admin signed you out of all devices"

#### Scenario: Account no longer active
- **WHEN** the next API call of a deactivated employee answers 401 `session_revoked` with `reason = 4`
- **THEN** the login screen shows "Your account is no longer active"

#### Scenario: Google account not accepted
- **WHEN** the browser lands on `/login?error=google_not_linked`
- **THEN** the login screen shows the message of key `auth.login.googleNotLinked` and both sign-in options stay available
