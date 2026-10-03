## Purpose

Access decides what a signed-in employee may read and change: the permission catalogue, the seed roles, how a caller's grants and branch scope are worked out on each request, how every endpoint declares its target's data level, and the `/me` payload from which the app mirrors those rules. Scenarios use the people and branches of `docs/plan/spec-fixtures.md` with the seed roles of this change; endpoints under `/api/v1/_fixtures/` exist only in the API integration-test application.

## ADDED Requirements

### Requirement: The permission catalogue is one file and holds the 21 Part 1 codes (D-ROLE-08 · D-ROLE-02 · ADR-011 · ADR-012)

`packages/shared/definitions/permissions.json` SHALL be the only place where permission codes are defined. Each entry SHALL have `code` (`<module>.<action>`), `module`, `action`, `kind` (`crud` or `special`), `level` (`company`, `branch`, `mixed`, `shared` or `private`), `label_key` (`permission.<code>`) and `description`. After this change the file SHALL hold exactly the 21 codes below, and no code with the action `manage`. API and web code SHALL refer to codes only through the type generated from this file, so that a code that is not in the file fails `pnpm typecheck`. Access: not applicable — a build-time definition; the admin never creates codes.

| Code | Kind | Level |
| --- | --- | --- |
| `company.view` · `company.update` | crud | company |
| `branch.view` · `branch.update` | crud | branch |
| `branch.create` · `branch.delete` | crud | company |
| `employee.view` · `employee.create` · `employee.update` · `employee.delete` | crud | branch |
| `employee.rating_update` · `employee.earnings_update` · `employee.access_update` · `employee.branch_assign` | special | branch |
| `role.view` · `role.create` · `role.update` · `role.delete` | crud | company |
| `role.assign` | special | branch |
| `settings.view` · `settings.update` | crud | mixed |

#### Scenario: Count by level and by kind
- **WHEN** the unit test reads `permissions.json`
- **THEN** it has 21 entries: 8 of level `company` + 11 of level `branch` + 2 of level `mixed` = 21, and 16 of kind `crud` + 5 of kind `special` = 21
- **AND** no entry has `action = "manage"` and every `label_key` equals `permission.` + its `code`

#### Scenario: A code that is not in the file does not compile
- **WHEN** a controller method is declared `@Can('employee.manage', { branch: 'body.branch_id' })`
- **THEN** `pnpm typecheck` fails on that line

### Requirement: The catalogue is synchronised to the database at every start (D-ROLE-08 · P1-RULE-10 · ADR-002 · ADR-011)

The job `sync.code_tables` SHALL run at every API start and make table `permissions` equal to the catalogue file: a code that is new in the file is inserted, a code whose `module`, `action` or `description` changed is updated, and a code that was removed from the file gets `archived_at` set — a `permissions` row SHALL never be deleted. A second run with an unchanged file SHALL change no row. A permission with `archived_at` set SHALL NOT count in any grant. A run that changed something SHALL write one `audit_events` row with `action = "permission.sync"`, `source = 3` (SYSTEM_JOB), `branch_id` NULL and no actor, listing the codes it created, updated and archived; a run that changed nothing SHALL write none. Access: not applicable — a system job; nobody can run it from the app.

#### Scenario: First start
- **WHEN** the API starts on a freshly migrated database
- **THEN** table `permissions` has 21 rows, all with `archived_at` NULL
- **AND** one `audit_events` row exists with `action = "permission.sync"`, `source = 3`, `actor_user_id` NULL, `branch_id` NULL, `entity_type = "permissions"` and 21 created codes in `after_data`

#### Scenario: Second start changes nothing
- **WHEN** the API is restarted with the same file
- **THEN** table `permissions` still has 21 rows and no row's `updated_at` changed
- **AND** the run writes no `audit_events` row — exactly one row with `action = "permission.sync"` exists, the one of the first start

#### Scenario: A removed code is archived, not deleted
- **WHEN** the integration test runs the job with a catalogue from which `employee.earnings_update` was removed
- **THEN** the `permissions` row of `employee.earnings_update` still exists and has `archived_at` set
- **AND** the `role_permissions` row linking it to the Admin role still exists
- **AND** the run's `permission.sync` row lists `employee.earnings_update` as archived
- **AND** `GET /api/v1/me` for U Kyaw Zin returns 20 grants and none with `code = "employee.earnings_update"`

### Requirement: A company admin holds all five role codes at company scope and receives every new code (P1-RULE-12 · ADR-011 · API-PERM-06)

A **company-admin role** SHALL be a role whose permission set contains all five codes `role.view`, `role.create`, `role.update`, `role.delete` and `role.assign`; a **company admin** SHALL be a user with an active assignment (`revoked_at IS NULL`) of such a role with `scope_type = 1` (COMPANY). When `sync.code_tables` inserts a new code it SHALL add that code to every company-admin role and write one `audit_events` row per changed role with `action = "role.permissions_set"`, `source = 3` and no actor. Access: not applicable — a rule fixed in code, whatever the role is called.

#### Scenario: The seed admin qualifies
- **WHEN** the check is made for U Kyaw Zin (Admin role, 21 codes, `scope_type = 1`)
- **THEN** he is a company admin

#### Scenario: A manager with one role code does not qualify
- **WHEN** the check is made for Ma Hnin (Manager role — of the five codes it holds only `role.assign`; `scope_type = 2`, branch B3)
- **THEN** she is not a company admin

#### Scenario: Four of the five codes are not enough
- **WHEN** the integration test creates a role with `role.view`, `role.create`, `role.update` and `role.assign` (no `role.delete`) and assigns it to Ko Zaw with `scope_type = 1`
- **THEN** that role is not a company-admin role and Ko Zaw is not a company admin

#### Scenario: All five codes at branch scope are not enough
- **WHEN** the integration test assigns the Admin role to Ko Zaw with `scope_type = 2` and branch B1
- **THEN** Ko Zaw is not a company admin

#### Scenario: A newly deployed code reaches the admin role only
- **WHEN** the integration test runs the job with a catalogue of 22 codes (the 21 plus `fixture.view`)
- **THEN** the Admin role has 22 codes and the Manager role still has 6
- **AND** one `audit_events` row exists with `action = "role.permissions_set"`, `source = 3`, `actor_user_id` NULL and `entity_id` = the Admin role's id

### Requirement: The first start creates the seed roles Admin, Manager and Barber (D-ROLE-09 · ADR-011 · ADR-012 · D-ROLE-07)

On the first start of a company that has no role, the system SHALL create exactly three roles: **Admin** with every code of the catalogue (21), **Manager** with the 6 codes whose Part 1 seed entry names Manager — `branch.view`, `employee.view`, `employee.rating_update`, `role.assign`, `settings.view`, `settings.update` — and **Barber** with no Part 1 code. The roles SHALL be created once: a later start SHALL NOT re-create them and SHALL NOT restore a permission set the admin changed. Scope is not part of a role; it is set on each assignment. Access: not applicable — a system action; the admin edits the roles afterwards in the role matrix (a later change).

#### Scenario: Fresh database
- **WHEN** the API starts on a freshly migrated database
- **THEN** table `roles` has 3 rows with `name_en` `Admin`, `Manager` and `Barber`, all `status = 1`
- **AND** their permission sets have 21, 6 and 0 codes

#### Scenario: The Manager set is the six codes
- **WHEN** the Manager role's codes are read
- **THEN** they are exactly `branch.view`, `employee.view`, `employee.rating_update`, `role.assign`, `settings.view`, `settings.update`
- **AND** `employee.update` and `employee.branch_assign` are not in the set

#### Scenario: A changed role is left alone
- **WHEN** `settings.update` was removed from the Manager role and the API restarts
- **THEN** the Manager role has 5 codes and table `roles` still has 3 rows

### Requirement: The first company admin of an environment is created by an operator command (P1-RULE-14 · P1-RULE-12 · P1-RULE-02 · D-AUTH-03)

No endpoint SHALL create the first company admin. An operator SHALL create it on the server with `docker compose exec api node dist/cli/admin-create.js --email <e> --name-mm <n> --code <c> [--name-en <n>]` (from source: `pnpm admin:create` with the same options). In one transaction the command SHALL create the `users` row (`status = 2` INVITED), the `employees` row (`status = 1` ACTIVE, `employee_code` = the value of `--code`) and a company-scope assignment (`scope_type = 1`) of the seed **Admin** role, and SHALL write the audit rows `employee.create` and `employee.role_assign` with `source = 3` (SYSTEM_JOB), no actor and `after_data.operator` = the operating-system user that ran the command. The command SHALL succeed only while no active company admin exists — no employee with `employees.status = 1` holds an unrevoked company-scope assignment of a company-admin role; an admin whose user is still INVITED counts. Otherwise, and when the e-mail address or the employee code already exists, it SHALL exit with status 1 and change nothing. `--code` is required (P1-RULE-14): without it the command SHALL exit with status 1 and change nothing. The person then signs in like any invited employee. Access: not an HTTP endpoint — a person with shell access to the server; no session and no permission code.

#### Scenario: Fresh environment
- **WHEN** on a database that holds only the base seed (21 permissions, the three seed roles, the company row, no employee) the operator runs `docker compose exec api node dist/cli/admin-create.js --email kyawzin@point.test --name-mm "ဦးကျော်ဇင်" --name-en "U Kyaw Zin" --code E001`, the process running as operating-system user `node`
- **THEN** the command exits with status 0
- **AND** one `users` row exists with `email = "kyawzin@point.test"` and `status = 2`, one `employees` row with `employee_code = "E001"`, `name_mm = "ဦးကျော်ဇင်"`, `name_en = "U Kyaw Zin"` and `status = 1`, and one `employee_roles` row for the Admin role with `scope_type = 1` and `revoked_at` NULL

#### Scenario: The two audit rows name the operator
- **WHEN** the audit rows of that run are read
- **THEN** exactly two rows exist, one with `action = "employee.create"` and one with `action = "employee.role_assign"`, both with `source = 3`, `actor_user_id` NULL and `after_data.operator = "node"`
- **AND** both have `branch_id` NULL (the new employee has no branch assignment)

#### Scenario: The first admin signs in like any invited employee
- **WHEN** U Kyaw Zin then requests a code for `kyawzin@point.test` and verifies it at 9:30:00 AM
- **THEN** `users.status` is 1 with `activated_at = 2026-10-05T09:30:00+06:30`
- **AND** `GET /api/v1/me` returns 21 grants, each with `scope_type = 1`

#### Scenario: Refused while an active company admin exists
- **WHEN** on the fixture database (U Kyaw Zin is an active company admin; 9 `users` rows and 9 `employees` rows) the operator runs the command with `--email second@point.test --name-mm "စမ်းသပ်" --code E010`
- **THEN** the command exits with status 1
- **AND** the database still has 9 `users` rows and 9 `employees` rows, and no `audit_events` row was added

#### Scenario: Refused before the first admin has signed in
- **WHEN** in the fresh environment, after the first run and while U Kyaw Zin's user is still `2` INVITED, the command is run again with `--email second@point.test --name-mm "စမ်းသပ်" --code E002`
- **THEN** the command exits with status 1 and the database still has 1 `users` row and 1 `employees` row

#### Scenario: E-mail address or employee code already exists
- **WHEN** the integration test has revoked U Kyaw Zin's Admin assignment on the fixture database (no active company admin is left) and the command is run with `--email aung@point.test --name-mm "စမ်းသပ်" --code E010`, and then with `--email second@point.test --name-mm "စမ်းသပ်" --code E004`
- **THEN** both runs exit with status 1 and the database still has 9 `users` rows and 9 `employees` rows

#### Scenario: Without an employee code
- **WHEN** in the fresh environment the command is run with `--email kyawzin@point.test --name-mm "ဦးကျော်ဇင်"` and no `--code`
- **THEN** the command exits with status 1 and no `users` or `employees` row exists

### Requirement: Every endpoint's access declaration is enforced at run time and an undeclared endpoint is closed (API-PERM-02 · API-SHAPE-02 · ADR-009 · API-PERM-04)

The API SHALL enforce the one access declaration of each endpoint as follows: `@Public()` — no session needed; `@Internal()` — the header `X-Internal-Key` must equal `INTERNAL_OPS_KEY`, otherwise status 401 `unauthenticated`; `@Self()` — a valid session and no permission code, the handler acts only on the caller's own record; `@Staff()` — a valid session and no permission code, the data is limited to the caller's read scope; `@Can(…)` and `@CanView(…)` — a valid session and the grant the declaration names. A request to an endpoint that carries no access declaration SHALL be refused whoever the caller is — status 401 `unauthenticated` without a valid session, status 403 `forbidden` with one. Access: this requirement defines who may call an endpoint of each kind.

#### Scenario: Staff endpoint needs a session but no code
- **WHEN** Ko Aung (Barber role, no permission code) calls the fixture endpoint `GET /api/v1/_fixtures/staff-read`, declared `@Staff()`
- **THEN** the response is 200
- **AND** the same call without a cookie answers 401 with `code = "unauthenticated"`

#### Scenario: An undeclared endpoint is closed even for the admin
- **WHEN** U Kyaw Zin calls the fixture endpoint `GET /api/v1/_fixtures/undeclared`, which has no access declaration
- **THEN** the response is 403 with `code = "forbidden"` and the handler's call counter is 0

#### Scenario: Internal endpoint refuses the web container's key
- **WHEN** a request to the fixture endpoint `POST /api/v1/_fixtures/internal`, declared `@Internal()`, carries `X-Internal-Key` with the value of `INTERNAL_SSR_KEY`
- **THEN** the response is 401 with `code = "unauthenticated"`
- **AND** the same request with the value of `INTERNAL_OPS_KEY` answers 200

### Requirement: Grants and read scope are worked out from the assignments on every request (P1-RULE-05 · D-ROLE-03 · D-ROLE-04 · D-ROLE-05 · D-ROLE-06)

On every request the API SHALL build the caller's grant set from the caller's active role assignments (`employee_roles.revoked_at IS NULL`), the non-archived permissions of each assigned role and the branches of each assignment: a code is granted for branch B when any assignment containing the code has `scope_type = 1` (COMPANY) or lists B in `employee_role_branches`. Grants only add up; there is no deny. The caller's **read scope** SHALL be the branches of the caller's active `employee_branches` assignments together with every branch covered by any grant — all branches when any grant has company scope. Nothing SHALL be cached between requests, so a change to a role, an assignment or a scope applies to the caller's next request without a new sign-in. Access: applies to every signed-in caller.

#### Scenario: A branch manager
- **WHEN** the grant set of Ma Hnin (Manager role, `scope_type = 2`, branch B3; assigned to B3) is built
- **THEN** each of the 6 Manager codes is granted for B3 only, no code is granted for B1 or B2, and her read scope is {B3}

#### Scenario: A barber without any code still has a read scope
- **WHEN** the grant set of Ko Aung (Barber role — no code; assigned to B3) is built
- **THEN** it contains no code and his read scope is {B3}

#### Scenario: Company scope covers every branch
- **WHEN** the grant set of U Kyaw Zin (Admin role, `scope_type = 1`) is built
- **THEN** each of the 21 codes is granted for B1, B2 and B3 and his read scope is {B1, B2, B3}

#### Scenario: Two assignments add up per code
- **WHEN** the integration test creates the role "Trainer" with the single code `employee.view` and assigns it to Ma Hnin with `scope_type = 2` and branch B1
- **THEN** `employee.view` is granted to her for {B1, B3}, `settings.update` for {B3} only, and her read scope is {B1, B3}

#### Scenario: Revoking one assignment applies on the next request and leaves the other alone
- **WHEN** that "Trainer" assignment gets `revoked_at = 2026-10-05T14:00:00+06:30` and Ma Hnin, still signed in with the same session, sends a request at 2:00:05 PM
- **THEN** `employee.view` is granted to her for {B3} only
- **AND** her Manager assignment is unchanged

#### Scenario: An operational read is limited to the read scope
- **WHEN** Ko Aung calls the fixture list `GET /api/v1/_fixtures/staff-read` (rows at B1, B2 and B3), and then the same list with `?branch_id=<B1>`
- **THEN** the first response contains only the B3 rows
- **AND** the second response is 200 with `items = []`

### Requirement: Company-master targets are changed only with company scope and read with any scope (API-PERM-07 · ADR-012 · P1-RULE-13 · D-ROLE-07)

An endpoint declared `@Can('<code>', { level: 'company' })` SHALL pass only when the caller holds the code through an assignment with `scope_type = 1` (COMPANY). A caller who holds the code only through branch-scope assignments SHALL get status 403 with `code = "company_scope_required"`; a caller who does not hold the code SHALL get status 403 with `code = "forbidden"` and `context.required` = the code. A management read declared `@CanView('<module>')` on company-master data SHALL pass for a caller who holds any code of that module at any scope, and SHALL answer 403 `forbidden` with `context.required = "<module>.view"` for a caller who holds none. Access: this requirement defines the rule for codes of level `company` (8 of the 21 Part 1 codes).

#### Scenario: Branch-scope holder of a company code cannot write
- **WHEN** the integration test creates the role "Senior manager" with the code `role.update`, assigns it to Ko Zaw with `scope_type = 2` and branch B1, and Ko Zaw calls the fixture endpoint `POST /api/v1/_fixtures/company-action`, declared `@Can('role.update', { level: 'company' })`
- **THEN** the response is 403 with `code = "company_scope_required"` and the handler's call counter is 0

#### Scenario: Company-scope holder can write
- **WHEN** U Kyaw Zin calls the same endpoint
- **THEN** the response is 200

#### Scenario: Caller without the code
- **WHEN** Ma Hnin (no `role.update`) calls the same endpoint
- **THEN** the response is 403 with `code = "forbidden"` and `context.required = "role.update"`

#### Scenario: Any code of the module opens the company-master read
- **WHEN** Ma Hnin (holds `role.assign` for B3, not `role.view`) calls the fixture endpoint `GET /api/v1/_fixtures/company-read`, declared `@CanView('role')`
- **THEN** the response is 200

#### Scenario: No code of the module
- **WHEN** Ko Aung calls the same endpoint
- **THEN** the response is 403 with `code = "forbidden"` and `context.required = "role.view"`

### Requirement: A branch-data action needs the code for the branch it touches (API-PERM-02 · API-PERM-03 · D-ROLE-03 · D-ROLE-05)

An endpoint declared `@Can('<code>', { branch: '<path>' })` SHALL take the target branch from the place the path names — `body.<field>`, `query.<field>`, `params.<field>`, or the `branch_id` of the entity it loads (`params.id→entity.branch_id`); a path ending in `[]` names every listed branch. A changing request (`POST`, `PATCH`, `PUT`, `DELETE`) SHALL pass only when the caller's grant of the code covers the target branch — every listed branch for a `[]` path. A caller who does not hold the code at all SHALL get status 403 with `code = "forbidden"` and `context.required` = the code; a caller who holds it but not for the target branch SHALL get status 403 with `code = "forbidden"`; in both cases nothing is changed. Access: this requirement defines the rule for codes of level `branch` (11 of the 21 Part 1 codes).

#### Scenario: Manager acts in her own branch
- **WHEN** Ma Hnin calls the fixture endpoint `POST /api/v1/_fixtures/branch-action`, declared `@Can('employee.rating_update', { branch: 'body.branch_id' })`, with `{ "branch_id": "<B3>" }`
- **THEN** the response is 200

#### Scenario: Manager acts in another branch
- **WHEN** Ma Hnin sends the same request with `{ "branch_id": "<B1>" }`
- **THEN** the response is 403 with `code = "forbidden"` and the handler's call counter is unchanged

#### Scenario: Barber of B3 calls a B1 resource
- **WHEN** Ko Aung (Barber, B3, no code) sends the same request with `{ "branch_id": "<B1>" }`, and then with `{ "branch_id": "<B3>" }`
- **THEN** both responses are 403 with `code = "forbidden"` and `context.required = "employee.rating_update"`

#### Scenario: Company scope covers a branch the caller is not listed for
- **WHEN** U Kyaw Zin sends the same request with `{ "branch_id": "<B2>" }`
- **THEN** the response is 200

#### Scenario: Every branch of a multi-branch body must be covered
- **WHEN** Ma Hnin calls the fixture endpoint `POST /api/v1/_fixtures/branch-items`, declared `@Can('employee.rating_update', { branch: 'body.items[].branch_id' })`, with items for B3 and B1
- **THEN** the response is 403 with `code = "forbidden"` and nothing is written — not even the B3 item
- **AND** the same request with items for B3 only answers 200

#### Scenario: The branch is taken from the loaded entity
- **WHEN** Ko Zaw (Manager, B1) calls the fixture endpoint `POST /api/v1/_fixtures/branch-notes/{id}/archive`, declared `@Can('employee.rating_update', { branch: 'params.id→entity.branch_id' })`, for a note whose `branch_id` is B3
- **THEN** the response is 403 with `code = "forbidden"`

### Requirement: Reads outside the caller's scope reveal nothing (API-PERM-03 · AD-PERM-04 · D-ROLE-03)

A management list declared `@CanView('<module>')` on branch data SHALL return only rows of the branches that the caller's grants of that module cover and SHALL never answer 403 to a caller who holds a code of the module; a `branch_id` filter outside those branches SHALL give an empty result with status 200. A single-resource `GET` whose target lies outside the caller's scope SHALL answer status 404 with `code = "not_found"` — the same answer as for an id that does not exist. A caller who holds no code of the module SHALL get status 403 with `code = "forbidden"` on the list and on the single read. Access: `<module>.view` or any other code of the same module (`view⁺`), at any scope.

#### Scenario: A list is filtered to the caller's branch
- **WHEN** Ma Hnin (holds `employee.view` for B3) calls the fixture list `GET /api/v1/_fixtures/branch-notes`, declared `@CanView('employee')`, which holds 2 notes at B1, 1 at B2 and 3 at B3
- **THEN** the response is 200 and `items` has exactly the 3 notes of B3

#### Scenario: Company scope sees every branch
- **WHEN** U Kyaw Zin calls the same list
- **THEN** `items` has 6 notes (2 + 1 + 3)

#### Scenario: A filter outside the scope gives an empty list, not an error
- **WHEN** Ma Hnin calls `GET /api/v1/_fixtures/branch-notes?branch_id=<B1>`
- **THEN** the response is 200 with `items = []` and `next_cursor = null`

#### Scenario: A single read outside the scope looks like "not found"
- **WHEN** Ma Hnin calls the fixture endpoint `GET /api/v1/_fixtures/branch-notes/{id}`, declared `@Can('employee.view', { branch: 'params.id→entity.branch_id' })`, for a note whose `branch_id` is B1
- **THEN** the response is 404 with `code = "not_found"`
- **AND** the body has the same members as the answer for the id `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`, which does not exist

#### Scenario: No code of the module at all
- **WHEN** Ko Aung calls `GET /api/v1/_fixtures/branch-notes`
- **THEN** the response is 403 with `code = "forbidden"` and `context.required = "employee.view"`

### Requirement: A mixed target is company master when no branch is named and branch data when one is (API-PERM-02 · ADR-012 · P1-RULE-13)

An endpoint declared with an optional branch path — `@Can('<code>', { branch: '<path>?' })` — SHALL treat a request whose path value is empty as a company-master target (company scope required, otherwise status 403 `company_scope_required`) and a request whose path value names a branch as a branch-data target (the grant must cover that branch, otherwise status 403 `forbidden`). Access: this requirement defines the rule for codes of level `mixed` (`settings.view`, `settings.update`).

#### Scenario: Branch manager without a branch in the request
- **WHEN** Ma Hnin (holds `settings.update` for B3) calls the fixture endpoint `PUT /api/v1/_fixtures/mixed-value`, declared `@Can('settings.update', { branch: 'body.branch_id?' })`, with `{ "value": 30 }`
- **THEN** the response is 403 with `code = "company_scope_required"`

#### Scenario: Branch manager with her own branch
- **WHEN** she sends `{ "value": 30, "branch_id": "<B3>" }`
- **THEN** the response is 200

#### Scenario: Branch manager with another branch
- **WHEN** she sends `{ "value": 30, "branch_id": "<B1>" }`
- **THEN** the response is 403 with `code = "forbidden"`

#### Scenario: Company admin without a branch
- **WHEN** U Kyaw Zin sends `{ "value": 30 }`
- **THEN** the response is 200

### Requirement: Shared targets accept any assignment and private targets accept company scope only (API-PERM-02 · API-PERM-07 · ADR-012 · API-PERM-03)

An endpoint declared `@Can('<code>', { level: 'shared' })` SHALL pass when the caller holds the code through any active assignment, whatever its scope. An endpoint declared `@Can('<code>', { level: 'private' })` or `@CanView('<module>', { level: 'private' })` SHALL pass only when the caller holds the code through a company-scope assignment; a caller who holds it only at branch scope SHALL get status 403 with `code = "company_scope_required"` on single reads, on writes and on lists. No Part 1 code has these two levels; the rule is delivered here for the parts that add such codes and is verified with fixture codes. Access: this requirement defines the rule for codes of level `shared` and `private`.

#### Scenario: Shared code at branch scope
- **WHEN** the test catalogue adds `fixture.shared_view` (level `shared`) to a role assigned to Ma Hnin with `scope_type = 2` and branch B3, and she calls the fixture endpoint `GET /api/v1/_fixtures/shared-read`, declared `@Can('fixture.shared_view', { level: 'shared' })`
- **THEN** the response is 200

#### Scenario: Private code at branch scope reaches nothing — not even a list
- **WHEN** the test catalogue adds `fixture.private_view` (level `private`) to a role assigned to Ma Hnin with `scope_type = 2` and branch B3, and she calls the fixture list `GET /api/v1/_fixtures/private-list`, declared `@CanView('fixture', { level: 'private' })`
- **THEN** the response is 403 with `code = "company_scope_required"`

#### Scenario: Private code at company scope
- **WHEN** U Kyaw Zin holds `fixture.private_view` through his company-scope Admin assignment and calls the same list
- **THEN** the response is 200

### Requirement: The subject of a record may reach it without the code (API-PERM-04 · API-PERM-02)

An endpoint declared `@Can('<code>', { …, orSelf: '<path>' })` SHALL also pass when the value at that path equals the caller's own employee id or user id, even when the caller holds no permission code. Access: the own-record rule — the caller is the subject of the record.

#### Scenario: A barber reads his own record
- **WHEN** Ko Aung calls the fixture endpoint `GET /api/v1/_fixtures/staff-cards/{id}`, declared `@Can('employee.view', { branch: 'params.id→entity.branch_id', orSelf: 'entity.employee_id' })`, for the card whose `employee_id` is his own
- **THEN** the response is 200

#### Scenario: A barber cannot read a colleague's record
- **WHEN** Ko Aung calls it for Ko Min's card
- **THEN** the response is 403 with `code = "forbidden"` and `context.required = "employee.view"`

#### Scenario: A manager reads a record of her branch and gets 404 for another branch
- **WHEN** Ma Hnin calls it for Ko Aung's card (B3) and then for Ko Htet's card (B1)
- **THEN** the first response is 200 and the second is 404 with `code = "not_found"`

### Requirement: GET /v1/me returns everything the app needs to start (API-AUTH-05 · P1.ME.01 · P1-RULE-06 · D-DSH-03 · AD-PERM-03)

`GET /v1/me` SHALL answer status 200 with header `Cache-Control: no-store` and the `MeResponse` body: `user` (`id`, `email`, `status`, `ui_language`, `last_login_at`), `employee` (`id`, `employee_code`, `name_mm`, `name_en`, `photo_url`, `status`), `grants` — one entry per granted code as `{ code, scope_type, branch_ids }` with `scope_type = 1` and `branch_ids = []` when any assignment grants the code at company scope, otherwise `scope_type = 2` and the union of the granting assignments' branches —, `branches_in_scope` (the branches of the read scope as `BranchSummary`), `assigned_branch_ids` (active branch assignments ordered by `effective_from`), `today_branch_id`, `effective.show_own_earnings` = `employees.show_own_earnings` when it is not NULL, otherwise the company setting `dashboard.show_own_earnings_all` (default `false`), `settings` (the effective values of the client-readable setting keys), `system` (`maintenance`, `server_time`, `default_language`) and `session` (`id`, `device_label`, `created_at`). The same body SHALL be returned by a successful code sign-in. Access: `@Self()` — any signed-in user, own data only; no permission code.

#### Scenario: A branch manager
- **WHEN** Ma Hnin calls `GET /api/v1/me`
- **THEN** `grants` has 6 entries — `branch.view`, `employee.rating_update`, `employee.view`, `role.assign`, `settings.update`, `settings.view` — each with `scope_type = 2` and `branch_ids = ["<B3>"]`
- **AND** `branches_in_scope` has one entry with `code = "B3"` and `name_en = "Point 3.0"`, `assigned_branch_ids = ["<B3>"]` and `effective.show_own_earnings = false`
- **AND** the response header `Cache-Control` is `no-store`

#### Scenario: The company admin
- **WHEN** U Kyaw Zin calls `GET /api/v1/me`
- **THEN** `grants` has 21 entries, each with `scope_type = 1` and `branch_ids = []`
- **AND** `branches_in_scope` has the 3 entries B1, B2, B3

#### Scenario: A barber
- **WHEN** Ko Aung calls `GET /api/v1/me` from his Android phone
- **THEN** `grants = []`, `branches_in_scope` has the one entry B3, `user.email = "aung@point.test"`, `employee.name_en = "Ko Aung"` and `session.device_label = "Android · Chrome"`

#### Scenario: An invited employee without a role
- **WHEN** Ma Thida calls `GET /api/v1/me` after her first sign-in
- **THEN** `user.status = 1`, `grants = []` and `branches_in_scope` has the one entry B3

#### Scenario: Settings and system blocks before the settings store exists
- **WHEN** any signed-in user calls `GET /api/v1/me` at 10:42:00 AM
- **THEN** `settings` is `{ "booking.slot_interval_minutes": 15, "booking.advance_window_days": 14, "sales.tax_enabled": false, "sales.service_charge_enabled": false, "closing.cash_difference_tolerance_amount": 0, "home_service.transport_fee_amount": 0, "system.default_language": 1, "system.upload_max_mb": 10, "receipt.printer_width_mm": 58, "receipt.auto_print": false }` — the default of each key
- **AND** `system` is `{ "maintenance": false, "server_time": "2026-10-05T10:42:00+06:30", "default_language": 1 }` and `today_branch_id` is `null`

#### Scenario: Own-earnings flag follows the employee's override
- **WHEN** `employees.show_own_earnings` for Ko Aung is NULL, and is then set to `true`
- **THEN** `effective.show_own_earnings` is `false` in the first call and `true` in the next call, while Ko Min's stays `false`

### Requirement: A user sets their own interface language on their account (P1.ME.02 · D-PLT-03 · AD-L10N-06 · AD-NAV-07)

`PATCH /v1/me` with body `{ "ui_language": 1 | 2 | null }` (1 MY · 2 EN · null = system default) SHALL store the value in `users.ui_language` of the caller and answer status 200 with the `MeResponse`. The value SHALL be returned by `/me` on every device of that user. For a signed-in user the app SHALL use `ui_language` (1 → Myanmar, 2 → English) and, when it is NULL, the system default language (`system.default_language`, 1 MY) — whatever the cookie `point_locale` holds; the cookie SHALL decide the language only while nobody is signed in (login screen, first paint) and SHALL be rewritten from the resolved language after `/me` is loaded. No audit row SHALL be written for a language change. Any other value SHALL answer status 400 `validation`. Access: `@Self()` — the caller's own account only; no permission code.

#### Scenario: Language follows the user to another device
- **WHEN** Ko Aung sends `PATCH /api/v1/me` with `{ "ui_language": 2 }` from his phone
- **THEN** the response is 200 with `user.ui_language = 2`
- **AND** `GET /api/v1/me` from his laptop session returns `user.ui_language = 2`

#### Scenario: Back to the system default
- **WHEN** he sends `{ "ui_language": null }`
- **THEN** `users.ui_language` is NULL and `system.default_language` (1) applies

#### Scenario: A shared phone does not pass one user's language to the next
- **WHEN** Ko Aung (`ui_language = 2`) signs out on a shop phone, leaving the cookie `point_locale=en`, and Ko Min (`ui_language` NULL) signs in on the same phone
- **THEN** the login screen is shown in English (cookie, nobody signed in)
- **AND** after Ko Min's sign-in the app is in Myanmar (NULL → system default 1 MY) and the cookie is rewritten to `point_locale=my`

#### Scenario: Unknown language value
- **WHEN** he sends `{ "ui_language": 3 }`
- **THEN** the response is 400 with `code = "validation"` and `errors[0].field = "ui_language"`

#### Scenario: Only the caller's own account changes, and nothing is audited
- **WHEN** Ko Aung's `PATCH` with `{ "ui_language": 2 }` succeeds
- **THEN** `users.ui_language` of Ko Min is unchanged
- **AND** no `audit_events` row was written for the request

### Requirement: The app refreshes its grants on focus and after an unexpected 403 (API-AUTH-05 · AD-PERM-03 · AD-STATE-04 · D-ROLE-06)

The staff app SHALL load `/v1/me` after sign-in and again every time its window gets focus, and SHALL load it once more whenever an API call of a signed-in page answers 403. A page whose main request answers 403 `forbidden` SHALL show "You don't have access to this page. Ask an admin if you need it." with a link Home; a page whose main request answers 404 `not_found` SHALL show "This item doesn't exist or was archived." with a link Home. Access: every signed-in user; the app mirrors the API and is never the security boundary.

#### Scenario: A changed role reaches the open app on focus
- **WHEN** Ma Hnin has the app open, her `settings.update` grant is removed at 2:00:00 PM, and she returns to the app's window at 2:01:00 PM
- **THEN** the app requests `GET /api/v1/me` once on focus and the grants it holds no longer contain `settings.update` — without a new sign-in

#### Scenario: An unexpected 403
- **WHEN** a request of a signed-in page answers 403 with `code = "forbidden"`
- **THEN** the app requests `GET /api/v1/me` once and the page shows "You don't have access to this page. Ask an admin if you need it." and a link to `/`

#### Scenario: Not found
- **WHEN** the main request of a signed-in page answers 404 with `code = "not_found"`
- **THEN** the page shows "This item doesn't exist or was archived." and a link to `/`, and the app does not sign the user out
