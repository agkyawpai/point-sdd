## မြန်မာ အတိုချုပ်

- ဒီ change ပြီးရင် ဝန်ထမ်းက **Google** နဲ့ ဖြစ်ဖြစ်၊ **email ဆီ ပို့တဲ့ ဂဏန်း ၈ လုံး code** နဲ့ ဖြစ်ဖြစ် staff app ထဲ ဝင်လို့ရမယ် — password မရှိ။ တစ်ခါ ဝင်ပြီးရင် ထွက်မသွား၊ admin က ဖြုတ် / ဝန်ထမ်းကို ပိတ်လိုက်ရင် ချက်ချင်း ထွက်သွားမယ်။
- **ခွင့်ပြုချက် (permission) နဲ့ ဆိုင်ခွဲ scope** ကို server က request တိုင်း စစ်မယ် — Part 1 permission code ၂၁ ခု၊ အစ role ၃ ခု (Admin = အကုန်၊ Manager = ၆ ခု၊ Barber = မရှိသေး)။ ကိုယ့်ဆိုင်ခွဲ မဟုတ်တဲ့ data ကို မမြင်ရ၊ မပြင်ရ။
- Login အောင် / မှား / lock ကျတာကို **audit** ထဲ မှတ်မယ်။ ငွေ row ၂ ခါ မဝင်အောင် ကာတဲ့ စနစ် (ခလုတ် ၂ ခါ နှိပ်မိတာ ကာ) ကို အသင့် ဆောက်ထားမယ် — ပထမဆုံး သုံးမှာက နောက် change ရဲ့ START။
- စမ်းသပ်ဖို့ data (ဆိုင်ခွဲ ၃ ခု၊ လူ ၉ ယောက်၊ service ဈေး) ကို command တစ်ခုနဲ့ ထည့်လို့ရမယ် — ဆိုင်ရဲ့ တကယ့် data မဟုတ်၊ production မှာ မသုံး။
- **မပါသေးတာ** — ဝန်ထမ်း / role / ဆိုင်ခွဲ ထည့်·ပြင်တဲ့ screen၊ "My devices"၊ setting၊ maintenance mode၊ realtime၊ noti၊ Android app ထဲက Google login — နောက် change တွေမှာ။ ဝင်ပြီးရင် မြင်ရမှာက နာမည် + ဆိုင်ခွဲ ပြတဲ့ ယာယီ စာမျက်နှာ တစ်ခုပဲ။
- **သတိ** — Domain မရခင် email code မရောက်နိုင်သေးလို့ pilot မှာ **Google နဲ့ပဲ၊ ဖုန်း browser ထဲကပဲ** ဝင်ရမယ် (ထည့်ထားတဲ့ app / iPhone Home-Screen ထဲက မဝင်နိုင်သေး — D-ARC-02)။
- **ပထမဆုံး admin** ကို server ပေါ်မှာ operator က command တစ်ခုနဲ့ ထည့်မယ် — admin မရှိသေးခင်ပဲ အလုပ်လုပ်၊ ဒုတိယ admin ကို ဒီ command နဲ့ ထည့်လို့ မရ။ Code မှားတာကို IP တစ်ခုက တစ်နာရီ ၁၀ ကြိမ်ထက် ပိုမစမ်းနိုင်။ Browser တစ်ခုထဲ ထပ် login ဝင်ရင် အဟောင်း session ကို ဖြုတ်မယ်။
- **Owner က မေးခွန်း ၁၀ ခုလုံး ဖြေပြီး** (02/Oct/2026 13:08 — default အတိုင်း)။ ဒီ change က **စလုပ်လို့ရပြီ** (ready to apply)။

**Implements:** D-AUTH-01 · D-AUTH-02 · D-AUTH-03 (first-login activation) · D-AUTH-04 · D-AUTH-05 (sign-in events in the audit log) · D-AUTH-06 · D-AUTH-08 · D-ROLE-03 · D-ROLE-04 · D-ROLE-05 · D-ROLE-06 · D-ROLE-07 · D-ROLE-08 · D-ROLE-09 · D-AUD-01 · D-AUD-02 · D-VIS-10 · D-PLT-03 (`users.ui_language`) · D-DSH-03 (effective own-earnings flag in `/me`) · D-ARC-02 · D-ORG-03 · D-DB-03 · D-EMP-01 (assignment history, read only) — endpoints P1.AUTH.01 · P1.AUTH.02 · P1.AUTH.03 and P1.AUTH.04 (browser flow) · P1.AUTH.05 · P1.ME.01 · P1.ME.02 · P1.BR.01 · P1.EMP.06 — rules P1-RULE-02 · P1-RULE-03 · P1-RULE-04 · P1-RULE-05 · P1-RULE-06 · P1-RULE-10 (sign-in actions, `permission.sync`, `branch_id` rule) · P1-RULE-11 (target set, for the one read) · P1-RULE-12 (definition and automatic grant) · P1-RULE-13 (levels in the guard) · P1-RULE-14 (first company admin) · P1-RULE-15 (same-browser sign-in) · API-AUTH-01 · API-AUTH-02 · API-AUTH-03 · API-AUTH-05 · API-PERM-01 · API-PERM-02 · API-PERM-03 · API-PERM-04 · API-PERM-06 · API-PERM-07 · API-IDEM-01 · API-IDEM-02 · API-AUD-01 · API-LIM-02 · API-ERR-03 (field codes of the login form) — AD-LOGIN-01 · AD-LOGIN-02 · AD-LOGIN-03 (activation) · AD-AUTH-01 · AD-PERM-01 · AD-PERM-03 · AD-PERM-04 · AD-STATE-04 · AD-NAV-04 · AD-NAV-07 · AD-L10N-06 · AD-FMT-10 · AD-NET-01 — ADR-005 (decisions 1–3; action items 1, 2, 4) · ADR-009 · ADR-011 (action items 1–3, 5) · ADR-012 (action items 1–3, guard part of 6) · ADR-007 (action item 2 — MailModule, Mailpit) · ADR-002 (`email.send`, `auth.cleanup`, `sync.code_tables`) · ADR-001 rule 1  
**Depends on:** `add-repo-scaffold` (merged, and archived before this change is archived). Runs in parallel with `add-shared-ui-components`; task group 7 (web) needs that change's first pull request (tokens, Tailwind + shadcn/ui, next-intl, language files, formatters). Must be merged before `add-walkin-visit-checkout`.  
**Repos:** point-barber (all code) · point-sdd (this change, the brief, the test workbook)  
**Owner:** Dev 2 — API, seed, login screen and tests, end to end; Dev 1 reviews.

## Why

After the scaffold nobody can sign in, and an endpoint that is not `@Public()` would answer anyone. Every feature change needs the same four things before its first line: a signed-in person, a guard that knows that person's grants and branches, an audit row for what they do, and a safe way to retry a money request. The owner took these out of the walk-in slice so they can be built and tested on their own while the checkout spec is reviewed.

The decisions are locked (D-AUTH-01..08, D-ROLE-01..09, D-AUD-01/02, D-VIS-10; API Part 0 §2, §3, §6, §7; API Part 1). This change turns them into running code with the smallest set of real endpoints that lets a tester see permission and scope work end to end. Where the locked texts left a gap, the owner was asked and answered on 02/Oct/2026 (review v5.2.17 §0.11) — nothing was filled in silently; the answers and the rules that now record them are listed under Open questions.

## What Changes

**Sign-in (capability `auth`)**
- **Two methods, one locked decision (D-AUTH-01): Google sign-in (browser redirect flow) and the 8-digit e-mail code.** The owner's scope list names Google; the e-mail code is included because the owner also approved "test-environment login = e-mail code read from Mailpit" — the automated tester cannot sign in with Google. In production the e-mail code needs the owner's domain verified at Resend; **until the domain exists the pilot signs in with Google only, in the browser tab** (D-ARC-02) — the installed Android shell and the iOS Home-Screen PWA cannot sign in until `add-android-shell` delivers the hand-off. The e-mail option stays on the screen in every environment (AD-LOGIN-01).
- E-mail code rules: 8 digits, hashed, valid 5 minutes, single use, latest only; resend after 60 seconds; 10 requests per hour per IP; 5 wrong codes in a row → 20-minute lock, the count reset only by a success; at most 10 verify attempts per hour per IP, the eleventh refused before anything is looked up or written; the same answer for known and unknown addresses.
- First successful sign-in turns an INVITED user into ACTIVE. Google account tied to the user on the first Google sign-in (address must match), by account id afterwards.
- Session: cookie `point_session` (`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=34560000`, host-only), only the hash stored, no idle timeout, re-issued once per 30-day period; every request re-checks session, user and employee status; own sign-out; signing in again in the same browser revokes the session that browser held.
- CSRF: `X-Requested-With: point-app` + `Origin` = the app origin on every changing request.
- Screens: login (Google button + e-mail field), code entry, the signed-out reasons ("You signed out", "An admin signed you out of all devices", …), and a temporary start page that shows who is signed in and their branches. The controls carry test ids (`login-email`, `login-send-code`, `login-code`, `login-submit`, `login-google`, `landing-*`).

**Access (capability `access`)**
- `permissions.json` with the **21 Part 1 codes** and their levels; `sync.code_tables` at every start (new → insert, removed → archive, new codes → every company-admin role; audit row `permission.sync` when a run changed something).
- Seed roles: Admin (21 codes), Manager (6), Barber (0). Company admin = all five `role.*` codes at company scope.
- The first company admin of an environment: an operator command on the server (`node dist/cli/admin-create.js`), which works only while no active company admin exists and names the operating-system user in its audit rows.
- Decorators `@Can` (levels company / branch / mixed / shared / private, branch paths, employee target set, `orSelf`), `@CanView`, `@Staff`, `@Self`, `@Internal`; an endpoint without a declaration is closed at run time.
- Grant set and read scope rebuilt on every request; 403 `forbidden` / 403 `company_scope_required` / 404 `not_found` as API-PERM-03 / 07.
- `GET /v1/me` bootstrap (grants with scope, branches in scope, effective own-earnings flag, language, client-readable settings at their defaults) and `PATCH /v1/me` for the user's own language; the app refetches `/me` on focus and after an unexpected 403.

**Organization reads (capability `organization`)** — the smallest existing Part 1 reads that show scope on real data, each built with everything Part 1 gives it: `GET /v1/branches` (P1.BR.01 — reference list, every staff member) and `GET /v1/employees/{id}/branches` (P1.EMP.06 — branch data: the employee code for an overlapping branch, 404 outside the scope, or the employee themself). The employee **list** (P1.EMP.01) is not built here: it could only be built in part, and a part of a locked endpoint is not shipped.

**Audit (capability `audit`)** — request context in every transaction (`app.user_id`, `app.session_id`, `app.request_id`), one application audit row per action endpoint with the locked `branch_id` rule, and the sign-in rows `login.success`, `login.failed`, `login.locked`, `session.revoked`; codes and tokens never written anywhere readable.

**Platform runtime (capability `platform-runtime`)**
- The `Idempotency-Key` contract as shared infrastructure: header required and a UUID, replay → 200 + `Idempotent-Replayed: true`, in progress → 409, different identifying fields → 422. **No endpoint of this change uses it**; the first consumer is `POST /v1/visits` in `add-walkin-visit-checkout`. It is tested with a fixture endpoint that exists only in the integration-test application — no endpoint outside the API design is added to production (design D14).
- Two scaffold requirements are **modified**: on the staff host a visitor without a session is redirected to `/login`, and the staff placeholder page is replaced by the login screen and the start page.

**Seed data** (as `docs/plan/spec-fixtures.md` §9)
- Every environment (on start): permission catalogue, the three seed roles, the one company row.
- Development and test only (`pnpm db:seed`, refused in production): the fixture — company names, B1–B3, the nine people E001–E009 with roles and branch assignments, one service category, three services and their prices.

**Platform pieces this change brings:** the job runner (pg-boss, installed by the one migrate entry point) with `email.send`, `auth.cleanup` and `sync.code_tables`; the mail module (Mailpit / Resend); an in-process rate limiter; the audit writer; the idempotency helper.

No **BREAKING** change for users: no earlier behaviour exists. For the code base, the two modified scaffold requirements change two end-to-end assertions (task 8.3).

## Capabilities

### New Capabilities

- `auth`: login screen, e-mail code rules and limits (request and verify), lock, code e-mail, first-login activation, Google browser sign-in and identity, session cookie, per-request session checks, CSRF, sign-out, same-browser sign-in, start page, signed-out states.
- `access`: permission catalogue and sync, company-admin definition, seed roles, the first-admin command, run-time enforcement of access declarations, grant set and read scope, the five data levels, own-record rule, `/me` bootstrap, own language, refresh of grants in the app.
- `audit`: request context for database attribution, application audit rows and their branch rule, sign-in events, secrecy of codes and tokens.
- `organization`: branch reference list, one employee's branch assignments.

### Modified Capabilities

- `platform-runtime` (created by `add-repo-scaffold`, which is archived first; an approved capability — owner answer S3, D-PLT-20 #4): **added** — the idempotency contract (4 requirements); **modified** — "API is served under /api/v1 on the web app's own origin" and "The Host header selects the route tree" (the signed-out redirect to `/login`; the staff placeholder is gone). The validator notes that these two can be archived only once the scaffold's spec exists; the dependency order guarantees it.

## Impact

- **API:** 9 of Part 1's 52 endpoints (5 auth, 2 me, 1 branches, 1 employees) and one operator command (`admin-create`, no endpoint). Three global guards. All later endpoints inherit them.
- **Database:** no schema change and no change to `docs/db/`. Rows written: `users` (login columns), `login_otps`, `user_sessions`, `permissions`, `roles`, `role_permissions`, `companies`, `audit_events`; the first-admin command writes one `users`, one `employees` and one `employee_roles` row; the development seed also writes branches, employees, assignments, services and prices. The migrate entry point installs pg-boss's schema `pgboss`; `public` stays at 91 tables.
- **Code (point-barber):** `apps/api` — `common/access`, `common/http`, `common/database`, `modules/auth`, `modules/people`, `modules/platform` (audit, jobs, mail, idempotency, settings reader, rate limiter); `packages/shared` — catalogue, constants, schemas; `packages/i18n` — `auth` namespace and `error.*` keys; `apps/web` — `/login`, session layer, start page, `proxy.ts`; `db/seed`; `db/scripts/migrate.mjs` (one step added); `e2e`.
- **CI:** job `integration` gets a `mailpit` service; job `e2e` restarts the `api` container between spec files that request codes (design D5).
- **Screens:** login and code entry (new), start page (replaces the scaffold's staff placeholder; replaced again by Today in the next change).
- **Configuration:** 18 new environment variables for the `api` service (design D18), five of them secrets.
- **Owner supplies:** a Google OAuth client (web application) before the first real Google sign-in — the redirect address must be an HTTPS host name with a public top-level domain, so the pilot server (`add-staging-deploy`) needs at least a temporary host name; the e-mail address, name and employee code of the first admin per environment; corrections to the proposed texts, if any, in the brief or the pull request (S18); later, the domain at Resend (2–3 days before go-live — D-ARC-02).
- **Pilot:** this change does not make a pilot possible on its own — the pilot also needs `add-walkin-visit-checkout`, a server (`add-staging-deploy`), late entry (`add-late-entry`) and the pilot's real data (`add-pilot-data-seed`); the fixture people are never used there.
- **Other changes:** `add-shared-ui-components` — shared files follow "first merge creates, second imports" (status constants, error-code constants, `permissions/`, `packages/i18n/messages/`, cookie `point_locale`); `add-walkin-visit-checkout` — uses the guards, `/me`, the audit writer, `Idempotency.run`, the job runner (it registers its own job in the `JobsModule` built here) and extends the seed; `add-repo-scaffold` — two requirements modified, two e2e assertions rewritten.
- **Size:** 46 requirements (44 added, 2 modified), 221 scenarios, 96 tasks of ≤ 2 h (most under 1 h with Claude Code) — about 8 working days for one developer. The owner accepted this as an exception to the change-size rule (S2, D-PLT-20 v5.2.17 note): the change stays whole and is delivered as three pull requests; the first two merge on CI + review, the test workbook is generated and run on the third (CG-GIT-05).

## Non-goals

- **Google sign-in inside the Android shell and the iOS Home-Screen PWA** (the `client` and `challenge` parameters of P1.AUTH.03, P1.AUTH.06 hand-off, ADR-005 decision 4) → `add-android-shell`; the install guide (AD-LOGIN-05) → `add-pwa-install`. The parameters do not exist until then. In the pilot (no domain yet, so no code e-mail) the installed shell and the iOS Home-Screen PWA cannot sign in at all; the pilot uses the browser tab.
- **My devices and admin "log out all devices"** (P1.ME.03, P1.ME.04, P1.EMP.15, P1.EMP.16, AD-LOGIN-04) → `add-employee-management`. Own sign-out is in this change; the device list is a separate screen with its own list endpoint, the same `Session` DTO as the employee's Access tab, and three more revoke paths — moving it keeps this change from growing further, and nothing here depends on it.
- **In-app notification `login.new_device`** (D-AUTH-05, AD-LOGIN-03 second sentence) → `add-notifications-inbox`. This change emits the event `auth.session_created` for it.
- **Employee list, employee, role and branch forms and their endpoints** → `add-employee-management`, `add-role-permission-matrix`, `add-branch-management` — including P1.EMP.01 with all its parameters, invite e-mail, resend and cancel (D-AUTH-03), P1.RL.01 / P1.PERM.01, the no-escalation and last-admin rules of P1-RULE-12 and the write actions of P1-RULE-11.
- **Settings store, `settings.json`, maintenance mode** (P1.SET.*, P1.SYS.03, API-AUTH-06) → `add-settings-store`. Here `/me` returns the locked defaults — the effective value when no row exists (D-PLT-16) — and `maintenance: false`; no endpoint can change either.
- **Realtime** — Socket.IO, `session.updated`, `session.revoked` push, P1.ME.05 → `add-realtime-gateway`. Until then the app refetches `/me` on window focus and a revoked session is refused on its next request. Nothing locked is weakened: D-ROLE-06 and P1-RULE-05 require a change to apply "on the next request", and API-AUTH-01 / P1-RULE-04 make every request check the session — the push only makes the screen react sooner.
- **Audit log screen and row visibility** (P8.AUD.01, P8-RULE-06) → `add-audit-log-screen`. Rows are written now and read then.
- **Guard forms that no Part 1 endpoint of this change needs** — any-of branch paths written `a|b`, the row filter `{ branch: 'row' }`, the `@Staff()` handler policy → the Part 6 / Part 8 changes that introduce them.
- **A production endpoint that requires `Idempotency-Key`** → `add-walkin-visit-checkout` (`POST /v1/visits`).
- **The 600 requests / minute / session cap** (API-LIM-03) → not in the owner's scope list for this change; it has no roadmap row yet — the row the lead adds (the same one `add-repo-scaffold` names).
- **Server deployment, Resend account and domain, production Google client** → `add-staging-deploy`.

## Open questions

### Needs the owner's answer

None — all answered by the owner on 02/Oct/2026 13:08 (review §0.11). The change is ready to apply.

### Answered by the owner (02/Oct/2026 13:08 — review v5.2.17 §0.11)

- **S2 — size of this change.** (A) The change stays whole — an accepted exception to "1–3 days, 20–30 test cases"; three pull requests, the first two merge on CI + review, the test workbook is generated and run on the last one (CG-GIT-05). Recorded in D-PLT-20 (v5.2.17 note).
- **S3 — capability `platform-runtime`.** OK — an approved capability; the list is 25, all locked. Recorded in D-PLT-20 #4 (v5.2.17) and `openspec/config.yaml`.
- **S5 — field-level error codes for the login form.** The field code of a schema failure is the Zod issue name unchanged (`too_small`, `too_big`, `invalid_type`), unless the schema names a catalogue code — for this change `email_invalid` (P1.AUTH.01 / P1.AUTH.02) and `otp_format` (P1.AUTH.02); `required` is a client-only message key. Recorded in API-ERR-03 (Part 0 v1.6) and Part 1 v1.6 §11b.
- **S6 — the first admin of an environment.** An operator command on the server: `docker compose exec api node dist/cli/admin-create.js --email <e> --name-mm <n> --code <c> [--name-en <n>]`; it works only while no active company admin exists, otherwise exits with status 1 and changes nothing; audit rows with `source = 3` and the operating-system user. Recorded in P1-RULE-14 (Part 1 v1.6). Requirement: `specs/access` "The first company admin of an environment is created by an operator command"; tasks 3.9, 3.10.
- **S9 — per-IP limit on code verify.** 10 verify attempts per hour per IP → 429 `rate_limited` (`retry_after`), counted before any look-up, counter change or audit write; the tenth is processed, the eleventh is refused and writes no `login.failed` row. Recorded in API-LIM-02 (Part 0 v1.6) and P1-RULE-03 (Part 1 v1.6). Requirement: `specs/auth` "Code verify is limited to 10 attempts per hour per IP"; task 5.6.
- **S10 — the lock answer shows that an address exists.** The literal texts stay: a locked existing address answers 401 `login_locked`, an unknown address keeps answering 401 `otp_invalid`. Recorded in P1-RULE-03 (Part 1 v1.6 note).
- **S12 — `forbidden` or `out_of_scope`.** A caller who holds the code but not for the target branch gets 403 `forbidden`; `out_of_scope` is returned only where a part's endpoint text names it — no endpoint of this change. Recorded in API-PERM-03 (Part 0 v1.6).
- **S13 — audit action name of the catalogue sync.** `permission.sync`, written when a run changed something; a system row with `branch_id` NULL. Recorded in P1-RULE-10 (Part 1 v1.6).
- **S14 — signing in again in the same browser.** The session that browser held is revoked with `revoke_reason = 1` LOGOUT in the transaction that creates the new session (audit `session.revoked`). Recorded in P1-RULE-15 (Part 1 v1.6). Requirement: `specs/auth` "Signing in again in the same browser revokes the session that browser held"; tasks 4.1, 5.18.
- **S18 — new interface and e-mail texts.** The proposed English / Myanmar texts of the brief (`docs/briefs/add-foundation-auth-access.md` → "Texts") are used; the owner reads and corrects them in the brief or the pull request — keys and behaviour do not change. Recorded in D-PLT-20 (v5.2.17 note).

### Recorded readings

No decision needed — the reading used changes nothing locked; listed so nothing is resolved silently (D-PLT-13).

1. **CSRF header on the two code endpoints** (owner sheet record R1). API-AUTH-02 says every `POST` / `PATCH` / `PUT` / `DELETE` of the staff API needs `X-Requested-With: point-app` (only `/v1/public` is exempt); the Part 1 OpenAPI lists the header parameter on logout, hand-off and `PATCH /me` but not on `POST /auth/otp/request` and `/auth/otp/verify`. Reading used: API-AUTH-02 — the header is required on both (Part 0 ranks above the OpenAPI document, API-META-01). The owner confirmed the record, and the OpenAPI document of Part 1 v1.6 now lists the `X-Requested-With` header on both code endpoints — the two documents agree.
2. **Manager seed** (owner sheet record R2). D-ROLE-09: "Manager = the codes whose Seed entry names Manager". Part 1 §10 names Manager outright for six codes and writes "Manager if the owner wants" for `employee.update` and `employee.branch_assign`. Reading used: the six codes; the admin ticks the other two in the matrix, and the owner reviews the seed before go-live (★).
3. **The e-mail option in the pilot** (owner sheet record R3). AD-LOGIN-01 puts both sign-in options on the screen; D-ARC-02 says the pilot signs in with Google because code e-mails cannot be delivered before the domain exists. Reading used: both options are shown everywhere; in the pilot a requested code does not arrive.
4. **"Each request runs in a transaction" (API-AUD-01).** Read literally, a transaction would wrap every request, including reads and refused sign-ins. Reading used (lead decision, CG-DB-03 / CG-DB-06): the service opens one transaction per business action through the one transaction runner, which sets `app.user_id`, `app.session_id` and `app.request_id` for it; a request that changes nothing opens none. What API-AUD-01 protects — every write carries its author for the audit triggers — holds unchanged.
5. **Cookie age.** API-AUTH-01 re-issues the cookie "on the first successful request after it is 30 days old", and `user_sessions` has no column for when the cookie was issued. Reading used: no DB change; one re-issue in each 30-day period counted from the session's `created_at` (design D6) — the same guarantee: a cookie in use never reaches the 400-day limit.
6. **`auth.cleanup`.** ADR-002: "deletes expired `login_otps` rows", hourly. Reading used: `expires_at < now()`; a verify with an already deleted code answers `otp_invalid` like any other failed verify.
7. **Which Part 1 read shows branch scope.** The lead's brief suggested the employee list (P1.EMP.01). It cannot be built in part without refusing parameters the API design defines, so this change builds P1.EMP.06 instead — complete as locked — and leaves P1.EMP.01 whole to `add-employee-management`.
8. **Archive order of the modified requirements.** The two `platform-runtime` requirements this change modifies are created by `add-repo-scaffold`, which is not archived yet; `openspec validate --strict` passes and notes that archive needs the scaffold's spec first. Reading used: the dependency order — the scaffold is archived before this change.
9. **`--code` on the first-admin command.** P1-RULE-14 requires `--code`: `employees.employee_code` is NOT NULL and the generator of P1.EMP.02 (setting `employee.code_format`, D-EMP-03) has no format or default in any locked source, so it is not invented here — the operator passes the code, and a run without `--code` exits with status 1 and changes nothing. If `add-employee-management` later delivers the generator, making the option optional is that change's proposal.
10. **"Active company admin" in P1-RULE-14.** P1-RULE-12 defines a company admin by the assignment (active, company scope, all five role codes) and protects the "last active company admin" against an employee status other than ACTIVE. Reading used: an employee with `employees.status = 1` holding such an assignment, whatever the user's status — so an admin who is still INVITED counts and a second run of the command before his first sign-in is refused.
