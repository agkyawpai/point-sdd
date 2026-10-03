## Purpose

Organization holds the one company, its branches, its employees and their branch assignments. This change adds only the two read endpoints that sign-in and the access guard need — the branch reference list and one employee's branch assignments, the smallest Part 1 read that shows branch-data scope, the 404 rule and the own-record rule on real data; the employee list and the forms that create and edit branches and employees arrive with their own changes. Scenarios use the development seed of `docs/plan/spec-fixtures.md`: three branches and nine people (E001–E009).

## ADDED Requirements

### Requirement: The branch list is a reference list for every signed-in staff member (P1.BR.01 · API-PERM-03 · AD-NAV-04)

`GET /v1/branches` SHALL return every branch of the company — not only the branches in the caller's scope — as `{ "items": BranchSummary[] }`, where a `BranchSummary` has exactly the members `id`, `code`, `name_mm`, `name_en`, `phone`, `status` and `is_public`. The optional query parameter `status` (0 INACTIVE · 1 ACTIVE) SHALL filter the list. Access: `@Staff()` — any signed-in staff member, no permission code (`branch.view` only decides whether the *Settings › Branches* menu is shown).

#### Scenario: A barber of one branch sees all three names
- **WHEN** Ko Aung (assigned to B3 only) calls `GET /api/v1/branches`
- **THEN** the response is 200 and `items` has 3 entries with `code` `B1`, `B2`, `B3` and `name_en` `Point 1.0`, `Point 2.0`, `Point 3.0`, each with `status = 1`

#### Scenario: No sensitive field is included
- **WHEN** the same response is inspected
- **THEN** every item has only the members `id`, `code`, `name_mm`, `name_en`, `phone`, `status`, `is_public` — no address, e-mail, latitude, longitude or radius

#### Scenario: Status filter
- **WHEN** Ko Aung calls `GET /api/v1/branches?status=0`
- **THEN** the response is 200 with `items = []` (all three fixture branches are active)

#### Scenario: Unknown status value
- **WHEN** he calls `GET /api/v1/branches?status=2`
- **THEN** the response is 400 with `code = "validation"` and `errors[0].field = "status"`

#### Scenario: Signed out
- **WHEN** a client without a cookie calls `GET /api/v1/branches`
- **THEN** the response is 401 with `code = "unauthenticated"`

### Requirement: An employee's branch assignments are read with the employee code for an overlapping branch, or by the employee (P1.EMP.06 · P1-RULE-11 · API-PERM-03 · API-PERM-04 · D-EMP-01)

`GET /v1/employees/{id}/branches` SHALL return `{ "items": BranchAssignment[] }` — every branch assignment of that employee, ended ones included — where a `BranchAssignment` has `id`, `branch` (a `BranchSummary`), `effective_from` and `effective_to` (null while the assignment is open). The request SHALL pass when the caller is that employee, or when the caller holds `employee.view` or any other `employee.*` code with company scope or for at least one branch of the target employee's **active** assignments; an employee without an active assignment SHALL be readable only at company scope. A caller who holds an `employee.*` code but none that reaches the target SHALL get status 404 `not_found` — the same answer as for an id that does not exist; a caller who holds no `employee.*` code and is not the employee SHALL get status 403 `forbidden` with `context.required = "employee.view"`. Access: `employee.view⁺` (level `branch`, target set of P1-RULE-11) or the own-record rule.

#### Scenario: A manager reads a barber of her branch
- **WHEN** Ma Hnin (Manager · B3) calls `GET /api/v1/employees/<Ko Aung>/branches`
- **THEN** the response is 200 with one item: `branch.code = "B3"`, `effective_from = "2026-09-01"`, `effective_to = null`

#### Scenario: A manager cannot see an employee of another branch
- **WHEN** Ma Hnin calls `GET /api/v1/employees/<Ko Htet>/branches` (Ko Htet is assigned to B1 only)
- **THEN** the response is 404 with `code = "not_found"`
- **AND** the body has the same members as the answer for the id `0199a3f2-7c1e-7b3a-9d4e-2f6a8c1b5e70`, which does not exist

#### Scenario: One overlapping branch is enough
- **WHEN** Ma Hnin calls `GET /api/v1/employees/<U Kyaw Zin>/branches` (assigned to B1, B2 and B3)
- **THEN** the response is 200 with 3 items — `B1`, `B2`, `B3` — because B3 is in her scope

#### Scenario: A barber reads his own assignments
- **WHEN** Ko Aung (no permission code) calls `GET /api/v1/employees/<Ko Aung>/branches`
- **THEN** the response is 200 with the one item `B3`

#### Scenario: A barber cannot read a colleague's assignments
- **WHEN** Ko Aung calls `GET /api/v1/employees/<Ko Min>/branches`
- **THEN** the response is 403 with `code = "forbidden"` and `context.required = "employee.view"`

#### Scenario: History of a deactivated employee is visible at company scope only
- **WHEN** U Kyaw Zin and then Ma Hnin call `GET /api/v1/employees/<Ko Naing>/branches` (his only assignment, B3, ended on 30/Sep/2026)
- **THEN** U Kyaw Zin gets 200 with one item: `branch.code = "B3"`, `effective_from = "2026-09-01"`, `effective_to = "2026-09-30"`
- **AND** Ma Hnin gets 404 with `code = "not_found"` (no active assignment → company scope only)

#### Scenario: The other branch manager
- **WHEN** Ko Zaw (Manager · B1) calls it for Ko Htet (B1) and for Ko Aung (B3)
- **THEN** the first response is 200 with the one item `B1` and the second is 404 with `code = "not_found"`
