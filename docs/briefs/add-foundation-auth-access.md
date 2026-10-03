# Brief: add-foundation-auth-access

> Readable overview for the developer and the tester. The normative text is in
> `openspec/changes/add-foundation-auth-access/specs/{auth,access,audit,organization,platform-runtime}/spec.md`;
> implementation choices are in `design.md`. Fixture people, branches and dates: `docs/plan/spec-fixtures.md`
> ("today" = Monday 05/Oct/2026, Myanmar Time).
> Owner: **Dev 2** (Dev 1 reviews) · Depends on: `add-repo-scaffold` · Parallel with: `add-shared-ui-components` ·
> Blocks: `add-walkin-visit-checkout` · **Ready to apply** — the owner answered every question on 02/Oct/2026 13:08 (review v5.2.17 §0.11).

## Goal

Make the staff app usable by a known person and closed to everyone else: sign in with Google or an 8-digit e-mail code, stay signed in, have every request checked for permission and branch scope, leave an audit trail of sign-ins, and have the double-submit protection ready for the first money endpoint. Seed data gives every later change people and branches to test with.

မြန်မာ: ဝန်ထမ်း login ဝင်နိုင်ဖို့ + ဘယ်သူ ဘာလုပ်ခွင့်ရှိလဲ server က စစ်ဖို့ + login မှတ်တမ်း + စမ်းသပ် data — feature screen မပါသေး (ဝင်ပြီးရင် နာမည် နဲ့ ဆိုင်ခွဲ ပြတဲ့ ယာယီ စာမျက်နှာပဲ)။

## Decisions

- **Implements:** D-AUTH-01, D-AUTH-02, D-AUTH-03 (activation), D-AUTH-04, D-AUTH-05 (audit of sign-ins), D-AUTH-06, D-AUTH-08 · D-ROLE-03..09 · D-AUD-01, D-AUD-02 · D-VIS-10 · D-PLT-03 · D-DSH-03 · D-ARC-02 · D-ORG-03 · D-DB-03 · D-EMP-01 (read) — endpoints P1.AUTH.01, P1.AUTH.02, P1.AUTH.03 and P1.AUTH.04 (browser flow), P1.AUTH.05, P1.ME.01, P1.ME.02, P1.BR.01, P1.EMP.06 — rules P1-RULE-02..06, P1-RULE-10, P1-RULE-11 (one read), P1-RULE-12, P1-RULE-13, P1-RULE-14, P1-RULE-15 · API-AUTH-01, API-AUTH-02, API-AUTH-05 · API-PERM-01..04, API-PERM-06, API-PERM-07 · API-IDEM-01, API-IDEM-02 · API-AUD-01 · API-LIM-02 · API-ERR-03 — AD-LOGIN-01, AD-LOGIN-02, AD-AUTH-01, AD-STATE-04, AD-NAV-04, AD-NAV-07, AD-L10N-06 — ADR-005, ADR-009, ADR-011, ADR-012, ADR-007, ADR-002.
- **Scope decided by the lead:** both sign-in methods of D-AUTH-01 are built — Google (browser redirect) and the e-mail code. The e-mail code is what automated tests use (read from Mailpit); in the production pilot the code e-mail cannot be delivered until the owner's domain is verified at Resend, so **the pilot signs in with Google only, in the browser tab** (D-ARC-02) — the installed Android shell / iOS Home-Screen PWA cannot sign in until `add-android-shell`.
- **Decided by the owner on 02/Oct/2026 (question sheet, review §0.11):** field codes `email_invalid` / `otp_format` (API-ERR-03 v1.6) · the first-admin command (P1-RULE-14) · 10 verify attempts per hour per IP (API-LIM-02 v1.6) · the lock answer stays as written (P1-RULE-03 v1.6 note) · `forbidden` when the code is held for another branch (API-PERM-03 v1.6) · audit action `permission.sync` (P1-RULE-10 v1.6) · same-browser sign-in revokes the old session (P1-RULE-15) · the proposed texts are used (S18).
- **Changes two scaffold requirements:** on the staff host a signed-out visitor is redirected to `/login`; the staff placeholder page is gone.

## Actors & permissions

| Actor | What they do here | Permission |
| --- | --- | --- |
| Anyone with a registered, active account | request a code, verify it, start Google sign-in | none — public endpoints (`@Public()`), CSRF header required on the two `POST`s |
| Any signed-in staff member | `GET /v1/me`, change own language (`PATCH /v1/me`), sign out, read the branch list, read their own branch assignments | none — own record (`@Self()` / own-record rule) or reference read (`@Staff()`) |
| Holder of `employee.view` or any other `employee.*` code | read the branch assignments of an employee who shares a branch with their scope | `employee.view⁺`, level `branch` — U Kyaw Zin (all), Ma Hnin (B3), Ko Zaw (B1) |
| Company admin (U Kyaw Zin) | nothing special in this change — holds all 21 codes at company scope | Admin role, `scope_type` 1 |
| Barber (Ko Aung, Ko Min, …) | sign in, see own name and branch | no Part 1 code |
| System | sync the permission catalogue, create the seed roles, send the code e-mail, delete expired codes | jobs `sync.code_tables`, `email.send`, `auth.cleanup` |
| Operator | create the first company admin of an environment with `node dist/cli/admin-create.js` | server shell — no session, no permission code; works only while no active company admin exists (P1-RULE-14) |

## Flow

**A. E-mail code**
1. `/login` → the person types the e-mail address → **Email me a sign-in code** → `POST /v1/auth/otp/request` → always 202; the screen always says "If this email can sign in, we've sent a code".
2. Only if the address belongs to a user `1 ACTIVE` or `2 INVITED` with an ACTIVE employee: a code is created (valid 5 minutes) and e-mailed (Mailpit outside production). This happens after the answer has been sent, so the answer takes the same time for every address.
3. The person types the 8 digits → `POST /v1/auth/otp/verify` → 200 + cookie `point_session` + the `/me` payload.
4. Status changes: `users.status` 2 INVITED → 1 ACTIVE on the first success (by the sign-in itself); `failed_login_count` +1 per wrong code, 0 only on success; count ≥ 5 → `login_locked_until` = that attempt + 20 minutes.

**B. Google (browser)**
1. **Continue with Google** → `GET /v1/auth/google/start?return_to=…` → Google → `GET /v1/auth/google/callback`.
2. First time: Google's verified address must equal `users.email` → the Google account id is stored. Later: matched by that id.
3. Success → cookie + redirect to the page asked for (only a path of the staff app) or `/`. Any failure → `/login?error=google_not_linked`.

**C. Every later request**: cookie → session not revoked → user ACTIVE → employee ACTIVE → access declaration of the endpoint → handler. Changing requests also need `X-Requested-With: point-app` and the app's own `Origin`.

**D. Opening the app signed out**: any staff page → 307 to `/login?return_to=<page>` → after sign-in back to that page.

**E. Sign-out**: `POST /v1/auth/logout` → this session gets `revoke_reason = 1 LOGOUT` → login screen with "You signed out".

**F. Start of the API**: `sync.code_tables` → 21 permission rows → (first time only) company row + roles Admin / Manager / Barber.

**G. First admin of an environment** (once, after the first API start): the operator runs `docker compose exec api node dist/cli/admin-create.js --email <e> --name-mm <n> [--name-en <n>] --code <c>` → user `2 INVITED` + employee + company-scope Admin assignment → the person signs in (flow A or B) and becomes ACTIVE.

## Rules

Sign-in
- R1. The login screen has exactly two options — Google and e-mail code — and no password field; its controls have the test ids `login-google`, `login-email`, `login-send-code`. (D-AUTH-01, AD-LOGIN-01)
- R2. A code request answers 202 `{ "resend_after_seconds": 60 }` for every address; a code is created and mailed only for an eligible address. (P1.AUTH.01, D-AUTH-04, P1-RULE-02)
- R3. A code is 8 digits, stored only as a hash, valid while the time is before created + 5 minutes, usable once; a new request cancels the older codes. (P1-RULE-03)
- R4. Any failed verify answers 401 `otp_invalid` with the same body, whatever the cause. (P1-RULE-03, P1.AUTH.02)
- R5. One code request per address per 60 seconds and 10 per hour per IP; otherwise 429 `rate_limited` with `retry_after`. (API-LIM-02)
- R6. A wrong code that brings the count to 5 or more locks code sign-in for 20 minutes: 401 `login_locked` with `until`; only a success resets the count. (P1-RULE-03, API-LIM-02)
- R6a. At most 10 verify attempts per hour per IP are processed; the eleventh answers 429 `rate_limited` with `retry_after`, before anything is looked up — no counter change, no code used, no audit row. (API-LIM-02 v1.6, P1-RULE-03 v1.6)
- R6b. Field codes of a refused form: `email_invalid` (not an address), `too_big` (address over 255 characters), `otp_format` (code not 8 digits) inside 400 `validation`. (API-ERR-03 v1.6)
- R7. The code e-mail is in the user's `ui_language` (Myanmar when not set), shows the code ungrouped on its own line, and goes to Mailpit outside production. (AD-L10N-06, ADR-007, D-ARC-02)
- R8. The code screen takes one 8-digit input `login-code` (paste with spaces and Myanmar digits accepted) and the button `login-submit`, shows "Valid for 5 minutes", "Only the latest code works", a 60-second resend countdown and the lock time. (AD-LOGIN-02, AD-FMT-10)
- R9. The first successful sign-in sets `users.status` 2 → 1 and `activated_at`. (P1-RULE-02, D-AUTH-03)
- R10. Google sign-in redirects back only to a path of the staff app; any failure goes to `/login?error=google_not_linked`. (P1.AUTH.03, P1.AUTH.04)
- R11. First Google sign-in: verified Google address = `users.email`, then the Google account id is stored and used from then on. (D-AUTH-08)

Session
- R12. Cookie `point_session` = 43-character random token; attributes `HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=34560000`, no `Domain`; only the SHA-256 hash is stored; no expiry, no idle timeout; re-issued on the first request of each 30-day period counted from sign-in. (API-AUTH-01, ADR-005, D-AUTH-06)
- R13. Every staff request checks cookie → session not revoked → user ACTIVE → employee ACTIVE, before permissions; 401 `unauthenticated` or 401 `session_revoked` with `reason` 1–4; `last_seen_at` written at most every 5 minutes. (P1-RULE-04)
- R14. Every `POST` / `PATCH` / `PUT` / `DELETE` needs `X-Requested-With: point-app` and the app's `Origin`; otherwise 403 `csrf`. (API-AUTH-02)
- R15. Sign-out revokes the current session only (reason 1) and clears the cookie. (P1.AUTH.05)
- R15a. A successful sign-in on a request that carries a still-valid `point_session` cookie revokes that session (reason 1) in the same transaction and audits `session.revoked`; a failed sign-in revokes nothing. (P1-RULE-15)
- R16. The start page shows the user's name, e-mail, branches in scope, the language switch and Sign out (`landing-*` test ids). (API-AUTH-05, AD-NAV-04, AD-NAV-07)
- R17. Any 401 shows the login screen with the reason text and returns to the same page after sign-in. (AD-AUTH-01)

Access
- R18. `permissions.json` holds exactly 21 codes: 8 company + 11 branch + 2 mixed; 16 crud + 5 special. (D-ROLE-08, ADR-011, ADR-012)
- R19. `sync.code_tables` runs at every start: new code → insert, removed → archive (never delete); a run that changed something writes one audit row `permission.sync`, an unchanged run writes none. (D-ROLE-08, P1-RULE-10 v1.6)
- R20. Company admin = active company-scope assignment of a role holding `role.view`, `role.create`, `role.update`, `role.delete`, `role.assign`; a newly deployed code is added to every such role. (P1-RULE-12)
- R21. First start creates Admin (21 codes), Manager (6: `branch.view`, `employee.view`, `employee.rating_update`, `role.assign`, `settings.view`, `settings.update`), Barber (0) — once. (D-ROLE-09)
- R21a. The first company admin is created by the operator command only: user INVITED + employee + company-scope Admin assignment in one transaction, audit rows `employee.create` / `employee.role_assign` with `source = 3` and the operating-system user; it exits with status 1 and changes nothing while an active company admin exists (an invited one counts), when the e-mail or the employee code exists, and when `--code` is missing. (P1-RULE-14)
- R22. An endpoint is reachable only through its one access declaration; without a declaration it is closed (401 / 403). (API-PERM-02)
- R23. Grants = union over active assignments; read scope = branch assignments ∪ granted branches; recomputed on every request. (P1-RULE-05, D-ROLE-04..06)
- R24. Company-master write: company scope, else 403 `company_scope_required`; read: any code of the module at any scope. (API-PERM-07, ADR-012)
- R25. Branch-data action: the code must cover the target branch (all of them for a multi-branch body); else 403 `forbidden` — `out_of_scope` is returned only where a part's endpoint text names it, by no endpoint of this change. (API-PERM-02, API-PERM-03 v1.6)
- R26. Out-of-scope list = filtered or empty, never 403 for a holder; out-of-scope single read = 404; no code of the module = 403. (API-PERM-03)
- R27. Mixed code: no branch in the request = company-master rule; branch given = branch rule. (ADR-012, P1-RULE-13)
- R28. Shared code: any assignment passes. Private code: company scope only, lists included. (API-PERM-07, ADR-012 Amendment 1)
- R29. `orSelf`: the subject of a record passes without the code. (API-PERM-04)
- R30. `GET /v1/me` returns user, employee, grants with scope, branches in scope, assigned branches, effective own-earnings flag, client settings (defaults), system block, session; `Cache-Control: no-store`. (API-AUTH-05, P1.ME.01, P1-RULE-06)
- R31. `PATCH /v1/me` stores `ui_language` 1 / 2 / null on the caller's own account; not audited. Signed in: `ui_language`, NULL → system default (Myanmar); the cookie `point_locale` decides only while signed out. (P1.ME.02, D-PLT-03, AD-L10N-06)
- R32. The app reloads `/me` on window focus and after an unexpected 403; 403 / 404 of a page show the fixed messages with a link Home. (API-AUTH-05, AD-PERM-03, AD-STATE-04)

Organization reads
- R33. `GET /v1/branches` returns all branches as summaries (7 members) to any signed-in staff member. (P1.BR.01)
- R34. `GET /v1/employees/{id}/branches` returns all assignments (ended ones too) to the employee themself, or to an `employee.*` holder at company scope or with one of the employee's active branches; otherwise 404 (holder) or 403 (no code). (P1.EMP.06, P1-RULE-11)

Audit
- R35. Every transaction of a changing request sets `app.user_id`, `app.session_id`, `app.request_id`. (API-AUD-01)
- R36. One `source = 1` audit row per action, written in the action's transaction; `branch_id` = the one branch acted on, else the employee's primary branch for an employee-targeted action, else NULL; a replay adds none; reads are not audited. (API-AUD-01, P1-RULE-10)
- R37. `login.success`, `login.failed` (address only as a hash, plus IP), `login.locked`, `session.revoked` are written and survive a 401; a verify refused by the per-IP cap writes nothing. (P1-RULE-10, API-LIM-02)
- R38. No code, token, hash or Google secret reaches the audit log, the application log or a stored job in readable form. (API-AUD-01)

Platform runtime
- R39. Marked endpoints need `Idempotency-Key` = a UUID; missing → 400 `idempotency_key_required`. (API-IDEM-01)
- R40. Same key again → 200 with the first result and `Idempotent-Replayed: true`, no second row. (API-IDEM-02)
- R41. Same key while the first request is still running → 409 `idempotency_in_progress`. (API-IDEM-02)
- R42. Same key with other identifying fields → 422 `idempotency_mismatch`; no key table. (API-IDEM-02, D-DB-12)
- R43. Staff host: without a `point_session` cookie every page except `/login` and `/dev/ui` answers 307 to `/login?return_to=…`; `/site*` and `/staff*` typed directly stay 404; a path outside `/api` never reaches the API. (ADR-001, ADR-009 — modifies two scaffold requirements)

## Scenarios

### S1: Ko Aung signs in with a code (R2, R3, R12)
- WHEN he requests a code for `aung@point.test` at 9:00:00 AM and sends it at 9:04:59 AM
- THEN 202 `{ "resend_after_seconds": 60 }`, then 200 with `Set-Cookie: point_session=…; Max-Age=34560000; Path=/; HttpOnly; Secure; SameSite=Lax` and the `/me` body; the same code at 9:05:00 AM would be 401 `otp_invalid`

### S2: Unknown and deactivated addresses look the same (R2, R4)
- WHEN `nobody@point.test` and `naing@point.test` (Ko Naing — INACTIVE) request a code
- THEN both get 202 `{ "resend_after_seconds": 60 }`, no code row, no e-mail; a verify for either answers 401 `otp_invalid`

### S3: Resend and IP limits (R5)
- WHEN Ko Aung asks again at 9:00:59 AM / at 9:01:00 AM; and an IP that had ten accepted requests since 9:00:00 AM asks at 9:45:00 AM
- THEN 429 `retry_after = 1` / 202; and 429 `retry_after = 900` (10:00:00 − 9:45:00 = 900 s)

### S4: Ko Min locks himself out (R6)
- WHEN four wrong codes between 9:10:30 and 9:12:00 AM, a fifth at 9:14:00 AM, then the right code at 9:14:30 AM and at 9:33:59 AM
- THEN `otp_invalid` ×4 (count 4) → `login_locked` with `until = 2026-10-05T09:34:00+06:30` (9:14 + 20 min; count 5) → still `login_locked` twice; the right code at 9:34:00 AM signs him in (count 0); had he sent a wrong code at 9:35:00 AM instead → `login_locked` until 9:55:00 AM (count 6)

### S5: Ma Thida's first sign-in (R9)
- WHEN she (INVITED, no role) signs in at 9:30:00 AM
- THEN `users.status = 1`, `activated_at = 2026-10-05T09:30:00+06:30`; `/me` has `grants = []` and `branches_in_scope` = [B3]

### S6: Session ends at once (R13, R17)
- WHEN Ko Min's session is revoked with reason 3, or his employee status becomes INACTIVE (sessions revoked with reason 4)
- THEN his next request answers 401 `session_revoked` with `reason = 3` / `4` and the login screen shows "An admin signed you out of all devices" / "Your account is no longer active"

### S7: Forged request (R14)
- WHEN `PATCH /v1/me` arrives without `X-Requested-With`, or with `Origin: https://point.test`
- THEN 403 `csrf`, nothing changed

### S8: Scope of the B3 manager (R23, R25, R26, R27, R34)
- WHEN Ma Hnin (Manager · B3) reads the branch assignments of Ko Aung (B3) / Ko Htet (B1) / Ko Naing (assignment ended); acts on a B1 target with a code she holds for B3; uses her mixed code `settings.update` without a branch
- THEN 200 with one item B3 from 01/Sep/2026 · 404 `not_found` · 404 `not_found` · 403 `forbidden` · 403 `company_scope_required`

### S9: Barber of B3 (R25, R29, R33, R34)
- WHEN Ko Aung (Barber · B3, no code) calls a branch action for B1; reads Ko Min's branch assignments; reads his own; reads the branch list
- THEN 403 `forbidden` with `context.required` = the code · 403 `forbidden` with `context.required = "employee.view"` · 200 with the one item B3 · 200 with B1, B2, B3

### S10: `/me` of the admin and the manager (R30)
- WHEN U Kyaw Zin and Ma Hnin call `GET /v1/me`
- THEN 21 grants with `scope_type = 1`, branches B1–B3 · 6 grants with `scope_type = 2` and `branch_ids = [B3]`, branch B3; both `effective.show_own_earnings = false`, `system.default_language = 1`

### S11: Audit of a wrong code (R37, R38)
- WHEN a wrong code `11112222` is sent for `min@point.test` from `203.0.113.10`
- THEN one `login.failed` row with Ko Min's user id, `after_data.ip = "203.0.113.10"`, a 64-character `email_hash`; neither `min@point.test` nor `11112222` appears in the row or the log

### S12: Double tap on a row-creating endpoint (R40, R42) — fixture endpoint in the integration test
- WHEN the same key is sent twice with `{ branch B3, amount 8,000 }`, then with amount 10,000
- THEN 201 → 200 + `Idempotent-Replayed: true`, one row, one audit row → 422 `idempotency_mismatch`, the row still says 8,000

### S13: Opening the app signed out (R43, R17)
- WHEN a browser without a session opens `https://app.point.test/?branch=B3`
- THEN 307 to `/login?return_to=%2F%3Fbranch%3DB3`; after Ko Aung signs in the browser is at `/?branch=B3`

### S14: A shared shop phone (R31)
- WHEN Ko Aung (`ui_language` 2) signs out and Ko Min (`ui_language` NULL) signs in on the same phone
- THEN the login screen is in English (cookie), and after sign-in the app is in Myanmar and the cookie says `my`

### S15: Eleventh verify from one IP (R6a)
- WHEN ten verifies from `203.0.113.10` were processed, the first at 9:00:00 AM, and an eleventh — a wrong code for `min@point.test` — arrives at 9:45:00 AM; then Ko Aung's right code from the same IP at 9:46:00 AM and from `203.0.113.20` at 9:46:30 AM
- THEN 429 `rate_limited` with `retry_after = 900` (10:00:00 − 9:45:00), Ko Min's count unchanged, no audit row · 429 with `retry_after = 840`, the code not used · 200 from the other IP

### S16: Signing in again in the same browser (R15a)
- WHEN Ko Aung's phone browser holds session S1 and he signs in again at 9:30:00 AM; or Ko Min signs in on that phone while Ko Aung also has a laptop session
- THEN S1 gets `revoked_at = 2026-10-05T09:30:00+06:30` and `revoke_reason = 1`, one `session.revoked` audit row with `branch_id` = B3; the old cookie answers 401 `session_revoked` reason 1; the laptop session stays signed in. A wrong code revokes nothing.

### S17: The first admin of a new environment (R21a)
- WHEN on a database with the base seed only the operator runs `admin-create.js --email kyawzin@point.test --name-mm "ဦးကျော်ဇင်" --name-en "U Kyaw Zin" --code E001`; then runs it again with another address; and U Kyaw Zin signs in with a code
- THEN exit 0: user `2 INVITED`, employee `E001`, Admin assignment at company scope, two audit rows with `source = 3` · exit 1, nothing changed (an invited admin counts) · user `1 ACTIVE`, `/me` returns 21 grants at company scope

## Screens / Form fields

Shared rules: required marker and error under the field (AD-FORM-01, AD-FORM-02); validate on blur and on submit; the submit button stays enabled and is disabled only while a request runs (AD-FORM-03); every text from the language files (`my`, `en`); tests find elements by test id, never by text.

### Screen 1 — Login, step 1 (`/login`)

Content: shop name (logo when the owner supplies one) · MM / EN switch · **Continue with Google** · e-mail form · reason / error alert when the URL carries `?reason=` or `?error=`.

| Field | Test id | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- | --- |
| E-mail | `login-email` | `input type="email"`, `autocomplete="email"` | ✔ | trimmed and lower-cased before sending; e-mail format; ≤ 255 characters | empty | `error.required` · `error.email_invalid` · from the API: `error.rate_limited` (shows the seconds of `retry_after`) |

| Button | Test id | Does | Disabled when |
| --- | --- | --- | --- |
| Continue with Google | `login-google` | opens `/api/v1/auth/google/start?return_to=<page>` | never |
| Email me a sign-in code | `login-send-code` | `POST /v1/auth/otp/request` → step 2, whatever the address | while the request runs |
| MM / EN | – | switches the screen text and the `point_locale` cookie; no API call before sign-in | never |

After submit: step 2 with the text "If this email can sign in, we've sent a code" — the same for every address.

### Screen 2 — Login, step 2 (code entry)

| Field | Test id | Type | Required | Validation | Default | Error message key |
| --- | --- | --- | --- | --- | --- | --- |
| Code | `login-code` | `input`, `inputmode="numeric"`, `autocomplete="one-time-code"`; shown grouped `1234 5678` | ✔ | spaces removed, Myanmar digits ၀–၉ → 0–9, then exactly 8 digits (`^[0-9]{8}$`) | empty | `error.required` · `error.otp_format` · from the API: `error.otp_invalid` · `error.login_locked` ("Too many attempts. Try again at 9:34 AM") |

Fixed texts: "Valid for 5 minutes" · "Only the latest code works".

| Button | Test id | Does | Disabled when |
| --- | --- | --- | --- |
| Sign in | `login-submit` | `POST /v1/auth/otp/verify` → the page asked for, or `/` | while the request runs; while a lock is running |
| Resend | – | `POST /v1/auth/otp/request` again | during the 60-second countdown (shows the seconds) |
| Use another e-mail | – | back to step 1 | never |

Boundary cases for the tester: 7 digits · 8 digits · 9 digits · letters · `1234 5678` pasted · `၁၂၃၄၅၆၇၈` typed · e-mail of 255 / 256 characters · code at 4:59 / 5:00 / 5:01 · resend at 59 s / 60 s · 4th / 5th / 6th wrong code · lock at 9:33:59 / 9:34:00 · 10th / 11th verify from one IP within the hour.

### Screen 3 — Signed-out messages (on `/login`)

| URL | Message (English text; key) |
| --- | --- |
| `?reason=1` | "You signed out" — `auth.signedOut.LOGOUT` |
| `?reason=2` | "This device was removed" — `auth.signedOut.DEVICE_REMOVED` |
| `?reason=3` | "An admin signed you out of all devices" — `auth.signedOut.ADMIN_REVOKE_ALL` |
| `?reason=4` | "Your account is no longer active" — `auth.signedOut.ACCOUNT_INACTIVE` |
| `?error=google_not_linked` | `auth.login.googleNotLinked` (one neutral sentence; both options stay available) |
| no parameter | no message |

### Screen 4 — Start page (`/`, signed in — temporary)

| Element | Test id | Shows |
| --- | --- | --- |
| Name | `landing-name` | Myanmar UI: `name_mm`; English UI: `name_en`, else `name_mm` |
| E-mail | `landing-email` | `user.email` |
| Branches | `landing-branches` | every branch of `branches_in_scope`: code · name |
| Language | – | MM / EN — saved on the account through `PATCH /v1/me` |
| Sign out | `landing-sign-out` | `POST /v1/auth/logout` → login screen with "You signed out" |

No other data. Inside the shared `AppShell` once it is merged (branch switcher from `/me`, user menu with language and Sign out, no module in the rail yet). Replaced by Today in `add-walkin-visit-checkout`.

### Screen 5 — Forbidden / not found (inside the signed-in area)

"You don't have access to this page. Ask an admin if you need it." / "This item doesn't exist or was archived.", each with a link Home (AD-STATE-04). No screen of this change produces them; the handling is wired for the next changes and tested on its own.

Permissions on screens: every signed-in person sees screen 4; nothing here is hidden by a permission code.

### Texts (owner answer S18)

The owner accepted these texts on 02/Oct/2026; he reads and corrects them here or in the pull request — keys and behaviour do not change. "Source" = the rule that gives the English text; **new** = written for this change. Digits stay 0–9 in both languages (AD-FMT-10).

| Key | English | Myanmar | Source |
| --- | --- | --- | --- |
| `auth.login.title` | Sign in | ဝင်ရောက်ရန် | new |
| `auth.login.google` | Continue with Google | Google ဖြင့် ဆက်လုပ်မည် | AD-LOGIN-01 |
| `auth.login.emailLabel` | Email | အီးမေးလ် | new |
| `auth.login.sendCode` | Email me a sign-in code | ဝင်ရောက်ရန် code ကို အီးမေးလ်ပို့ပါ | AD-LOGIN-01 |
| `auth.login.googleNotLinked` | We couldn't sign you in with this Google account. Use the Google account of the email your admin registered, or use an email code. | ဒီ Google account နဲ့ ဝင်လို့ မရပါ။ Admin ထည့်ထားတဲ့ အီးမေးလ်ရဲ့ Google account ကို သုံးပါ၊ ဒါမှမဟုတ် အီးမေးလ် code နဲ့ ဝင်ပါ။ | new |
| `auth.code.sent` | If this email can sign in, we've sent a code | ဒီအီးမေးလ်နဲ့ ဝင်ခွင့်ရှိရင် code ပို့လိုက်ပါပြီ | AD-LOGIN-01 |
| `auth.code.label` | Sign-in code | ဝင်ရောက်ရန် code | new |
| `auth.code.validFor` | Valid for 5 minutes | 5 မိနစ်အတွင်း သုံးပါ | AD-LOGIN-02 |
| `auth.code.latestOnly` | Only the latest code works | နောက်ဆုံးပို့တဲ့ code ပဲ သုံးလို့ရပါတယ် | AD-LOGIN-02 |
| `auth.code.submit` | Sign in | ဝင်မည် | new |
| `auth.code.resend` | Resend | ပြန်ပို့ပါ | AD-LOGIN-02 |
| `auth.code.resendIn` | Resend in {seconds} s | {seconds} စက္ကန့်အကြာ ပြန်ပို့နိုင်မည် | new |
| `auth.code.otherEmail` | Use another email | အခြားအီးမေးလ် သုံးမည် | new |
| `auth.signedOut.LOGOUT` | You signed out | သင် ထွက်လိုက်ပါပြီ | AD-AUTH-01 |
| `auth.signedOut.DEVICE_REMOVED` | This device was removed | ဒီစက်ကို ဖြုတ်လိုက်ပါပြီ | AD-AUTH-01 |
| `auth.signedOut.ADMIN_REVOKE_ALL` | An admin signed you out of all devices | Admin က စက်အားလုံးကနေ ထွက်ခိုင်းလိုက်ပါတယ် | AD-AUTH-01 |
| `auth.signedOut.ACCOUNT_INACTIVE` | Your account is no longer active | သင့် account ကို ပိတ်ထားပါတယ် | AD-AUTH-01 |
| `auth.landing.signedInAs` | Signed in as | ဝင်ထားသူ | new |
| `auth.landing.branches` | Your branches | သင့်ဆိုင်ခွဲများ | new |
| `auth.landing.signOut` | Sign out | ထွက်မည် | AD-NAV-07 |
| `auth.email.otp.subject` | Point Barbershop sign-in code | Point Barbershop ဝင်ရောက်ရန် code | new |
| `auth.email.otp.body` | Your sign-in code is:<br>{code}<br>It is valid for 5 minutes. Only the latest code works.<br>If you did not ask for it, ignore this email. | သင့် ဝင်ရောက်ရန် code —<br>{code}<br>5 မိနစ်အတွင်း သုံးပါ။ နောက်ဆုံးပို့တဲ့ code ပဲ သုံးလို့ရပါတယ်။<br>သင် မတောင်းခဲ့ရင် ဒီအီးမေးလ်ကို လျစ်လျူရှုပါ။ | new |
| `error.login_locked` | Too many attempts. Try again at {time}. | အကြိမ်များစွာ မှားနေပါတယ်။ {time} မှာ ပြန်စမ်းပါ။ | AD-LOGIN-02 |
| `error.otp_invalid` | That code is not right or has expired. | Code မမှန်ပါ၊ ဒါမှမဟုတ် သက်တမ်းကုန်သွားပါပြီ။ | new |
| `error.rate_limited` | Please wait {retry_after} seconds and try again. | {retry_after} စက္ကန့် စောင့်ပြီး ပြန်စမ်းပါ။ | new |
| `error.email_invalid` | Enter a valid email address. | အီးမေးလ်လိပ်စာ မှန်အောင် ထည့်ပါ။ | new (code — API-ERR-03 v1.6) |
| `error.otp_format` | Enter the 8-digit code. | ဂဏန်း 8 လုံး code ကို ထည့်ပါ။ | new (code — API-ERR-03 v1.6) |
| `error.unauthenticated` | Please sign in. | ကျေးဇူးပြု၍ ဝင်ရောက်ပါ။ | new |
| `error.session_revoked` | You have been signed out. | သင် ထွက်သွားပါပြီ။ | new (the reason texts above are what the screen shows) |
| `error.forbidden` | You don't have access to this page. Ask an admin if you need it. | ဒီစာမျက်နှာကို ကြည့်ခွင့် မရှိပါ။ လိုအပ်ရင် admin ကို ပြောပါ။ | AD-STATE-04 |
| `error.company_scope_required` | Only someone with company-wide access can change this. | ဒါကို company တစ်ခုလုံးအတွက် ခွင့်ပြုချက်ရှိသူပဲ ပြင်နိုင်ပါတယ်။ | new |
| `error.out_of_scope` | This is outside your branches. | ဒါက သင့်ဆိုင်ခွဲတွေအပြင်ဘက် ဖြစ်ပါတယ်။ | new (used by no endpoint of this change — API-PERM-03 v1.6) |
| `error.csrf` | The request was blocked. Reload the page and try again. | Request ကို ပိတ်လိုက်ပါတယ်။ စာမျက်နှာကို ပြန်ဖွင့်ပြီး ထပ်စမ်းပါ။ | new |
| `error.idempotency_key_required` | Something went wrong. Try again. | တစ်ခုခု မှားသွားပါတယ်။ ထပ်စမ်းပါ။ | new |
| `error.idempotency_in_progress` | Still saving. Please wait. | သိမ်းနေဆဲပါ။ ခဏစောင့်ပါ။ | new |
| `error.idempotency_mismatch` | This was already saved with different details. Reload and check. | အချက်အလက် မတူဘဲ သိမ်းပြီးသား ဖြစ်နေပါတယ်။ ပြန်ဖွင့်ပြီး စစ်ပါ။ | new |
| Seed role names | Admin · Manager · Barber | အက်ဒမင် · မန်နေဂျာ · ဘာဘာ | D-ROLE-09 (English) · new (Myanmar — as fixtures §2) |

In the e-mail body the code stands alone on its line, without a space in the middle.

## Data

- **Tables written:** `users` (`status`, `activated_at`, `last_login_at`, `google_subject`, `failed_login_count`, `login_locked_until`, `ui_language`), `login_otps`, `user_sessions`, `permissions`, `roles`, `role_permissions`, `companies` (first start), `audit_events`; the first-admin command also writes `employees` and `employee_roles`.
- **Tables read:** `employees`, `employee_branches`, `employee_roles`, `employee_role_branches`, `branches`.
- **Base seed** (every environment, on start — fixtures §9): permission catalogue, the three seed roles, the company row.
- **Fixture seed** (`pnpm db:seed`, never in production): company names · B1 Point 1.0, B2 Point 2.0, B3 Point 3.0 · the nine people E001–E009 of fixtures §2 (U Kyaw Zin assigned to B1–B3 with Admin at company scope; Ma Hnin Manager [B3]; Ko Zaw Manager [B1]; Ko Aung, Ko Min Barber [B3]; Ko Htet Barber [B1]; Ko Thura Barber [B2]; Ma Thida INVITED at B3 without a role; Ko Naing INACTIVE, user DISABLED, B3 assignment ended 30/Sep/2026) · one service category · Haircut 6,000 / 7,000 / 8,000 (Ko Aung at B3 = 10,000), Shave 3,000, Hair wash 2,000.
- **DBML change:** none. The migrate entry point installs pg-boss's own schema `pgboss`; `public` stays at 91 tables.

## Edge cases

- **Reply lost after a correct code** (weak 4G): the code is already used, the cookie did not arrive → the person asks for a new code (after the 60-second countdown) and signs in again; the orphan session stays unused. No data is lost.
- **Double tap on "Email me a sign-in code":** the second request answers 429; the screen is already on step 2 and keeps the countdown.
- **Code typed after a newer code was requested:** refused as `otp_invalid` — the screen text "Only the latest code works" explains it.
- **Wrong code after a lock has ended:** locked again at once for 20 minutes (the count is reset only by a success).
- **Five wrong codes typed by someone else for a colleague's address:** the colleague's code sign-in is locked for 20 minutes; Google sign-in and existing sessions keep working.
- **Sign-in in the same browser while already signed in:** the session that browser held is revoked with reason 1 in the same transaction (P1-RULE-15); sessions on other devices stay.
- **Tester works from one IP, verifies:** 10 verify attempts per hour — the eleventh answers 429 whatever the code; restart the `api` container to start a fresh section.
- **First-admin command run twice, or run before the API has started once:** exit status 1, nothing changed (an admin exists / the seed Admin role does not exist yet).
- **Employee deactivated while working:** the next tap answers 401 and the login screen says "Your account is no longer active".
- **Role or branch scope changed while signed in:** applies to the next request; the screen refreshes `/me` when the window gets focus (the realtime push comes later).
- **Shared shop phone:** the next person's language comes from their account, never from the previous person's cookie.
- **API restarted during a Google sign-in:** the pending sign-in is lost → the callback goes to the login screen with the Google message; the person taps the button again.
- **API restarted during a code request:** the 60-second and 10-per-hour counters start again for every address alike; a code whose issuing was interrupted is not sent — the person asks again.
- **Link back from Google with a foreign address in `return_to`:** ignored → `/`.
- **Phone clock wrong:** irrelevant — only the server clock decides expiry, lock end and cookie age.
- **Mailpit down in development:** the code request still answers 202; the job retries three times; the developer sees no e-mail.
- **Pilot before the domain exists:** a requested code e-mail does not arrive; staff use Google in the browser tab; the installed app cannot sign in yet.
- **Tester works from one IP:** 10 code requests and 10 verifies per hour — the workbook is cut into sections of at most 8 of each, each starting with a restart of the `api` container; waits (60 s, 20 min) are written in the case.
- **Closed day / late entry / money:** not applicable — this change writes no money row.

## Out of scope

- Google sign-in inside the Android shell / iOS PWA (hand-off) → `add-android-shell`; install guide → `add-pwa-install`.
- My devices, admin "log out all devices", the employee list (P1.EMP.01) and forms → `add-employee-management`.
- "New sign-in" notification → `add-notifications-inbox`.
- Role and branch forms, invites, roles list, permission catalogue endpoint, no-escalation and last-admin rules → `add-role-permission-matrix`, `add-branch-management`, `add-employee-management`.
- Settings store, maintenance mode → `add-settings-store`. Realtime → `add-realtime-gateway`. Audit log screen → `add-audit-log-screen`.
- A real endpoint that needs `Idempotency-Key` → `add-walkin-visit-checkout`.
- The 600 requests / minute / session cap (API-LIM-03) → a roadmap row the lead adds.
- Deployment, Resend domain, production Google client → `add-staging-deploy`. Pilot data → `add-pilot-data-seed`.

## Open questions

None — all answered by the owner on 02/Oct/2026 13:08 (review v5.2.17 §0.11). The change is ready to apply.

Answered (the rule that records each answer is in the proposal):

- 🔒 **S2** — size: the change stays whole (46 requirements, 221 scenarios, 96 tasks), three pull requests; the workbook runs on the last one.
- 🔒 **S3** — capability `platform-runtime`: approved.
- 🔒 **S5** — field codes `email_invalid`, `otp_format`; other schema failures keep the Zod issue name.
- 🔒 **S6** — first admin of an environment: the operator command of P1-RULE-14.
- 🔒 **S9** — 10 verify attempts per hour per IP → 429 `rate_limited`, counted before any look-up or audit write.
- 🔒 **S10** — the lock answer stays as written (`login_locked` for a locked existing address, `otp_invalid` for an unknown one).
- 🔒 **S12** — `forbidden` when the code is held for another branch; `out_of_scope` only where a part names it.
- 🔒 **S13** — audit action `permission.sync`, written when a run changed something.
- 🔒 **S14** — signing in again in the same browser revokes the session that browser held (P1-RULE-15).
- 🔒 **S18** — the texts of the table above are used; the owner corrects them here or in the pull request.

Recorded readings (no answer needed): CSRF header also on the two code endpoints (now also in the OpenAPI document, Part 1 v1.6) · Manager seed = six codes · the e-mail option stays visible in the pilot · one transaction per business action, opened by the service · cookie re-issue once per 30-day period · `auth.cleanup` deletes expired codes · P1.EMP.06 instead of a partial P1.EMP.01 · the scaffold is archived first · the first-admin command needs `--code` until the code generator of `add-employee-management` exists · an invited admin counts as an active company admin for that command.

## Answers to Claude's questions

(filled during `/opsx:explore`)
