# ADR-010: Granular permission codes composed by the admin — no fixed "manager" rules in code

**Status:** **Superseded by [ADR-011](ADR-011-crud-permission-codes.md)** (owner 01/Oct/2026 21:20 — permission codes become CRUD per menu: `<module>.view / create / update / delete` + named special actions; no `manage` code; company admin = all five role codes `role.view` + `role.create` + `role.update` + `role.delete` + `role.assign`). The principle below (granular codes, the admin composes roles, two guard rails) is carried into ADR-011; the code names and the company-admin definition in this file are **historical**. *Was:* Accepted — owner 01/Oct 11:54 ("Manager ရဲ့ လုပ်ပိုင်ခွင့်ကို Admin က permission မှာ လိုအပ်သလို adjust လုပ်လို့ရတယ်"); consistent with 🔒 D-ROLE-01 / 02 / 03 / 05 / 08. Recorded in the review as a D-ROLE-02 note (v5.2.10).
**Date:** 01/Oct/2026
**Deciders:** Owner (decided) · dev team

> **⚠️ Superseded (01/Oct 21:20) → ADR-011** — code နာမည် (`*.manage`, `employee.*_manage`) နဲ့ company admin = `role.manage` + `role.assign` ဆိုတာ ဟောင်းသွားပြီ; ADR-011 (menu တစ်ခုချင်း CRUD + special action) ကို ဖတ်ပါ။
>
> **မြန်မာ အတိုချုပ် (မူလ)** — "Manager က ဘာလုပ်လို့ရလဲ" ကို code ထဲမှာ သတ်မှတ်မထားဘူး။ လုပ်ဆောင်ချက် တစ်ခုချင်းစီ (ဥပမာ ဝန်ထမ်း profile ပြင်၊ rating ပေး၊ status ပြောင်း၊ branch ချိတ်၊ role ပေး) ကို **permission code သီးသန့်** ထားပြီး admin က role matrix မှာ Manager role ထဲ ဘာတွေ ထည့်မလဲ ကိုယ်တိုင် ရွေး (branch scope ပါ)။ Code ထဲမှာ မပြောင်းနိုင်တာ ၂ ချက်ပဲ: (1) **company admin** (role.manage + role.assign ကို company scope နဲ့ ကိုင်ထားသူ) မဟုတ်ရင် ကိုယ့်မှာ မရှိတဲ့ permission ကို တခြားသူကို မပေးနိုင် (2) နောက်ဆုံး company admin ကို မဖြုတ်နိုင် (system ပိတ်မိမှာ စိုးလို့)။ Part 1 မှာ `employee.manage` တစ်ခုတည်းကို code ၇ ခု ခွဲလိုက်ပြီ (Part 1 code စုစုပေါင်း ၁၃)။

## Context
- 🔒 D-ROLE-01: role = position; the admin creates roles. 🔒 D-ROLE-02: permission granularity = module → action. 🔒 D-ROLE-03: access = permission AND branch scope, enforced in the backend. 🔒 D-ROLE-05: branch scope per role assignment. 🔒 D-ROLE-08: `permissions.json` is the source, synced to DB; codes never renamed.
- Admin guideline AD-PERM-06 lists ~40 codes; AD-PERM-07 is a role matrix grouped by module.
- API Part 1 v1.0 had a coarse `employee.manage` and asked (§13 #1) what a manager may edit on staff of their branches. The owner's answer: the admin decides per permission — so the API must not bake a manager policy in.
- Risks of composable permissions: privilege escalation (a manager with `role.assign` granting admin rights) and lockout (revoking the last admin).

## Decision
1. **One code per distinct action**, format `<module>.<action>`, branch-scopable unless the resource is company-wide (`company.manage`, `role.manage`, `settings.view`; `settings.manage` *is* branch-scopable because branch overrides can be delegated — P1.SET.03). Part 1 splits `employee.manage` into `employee.create`, `employee.profile_manage`, `employee.rating_manage`, `employee.earnings_manage`, `employee.status_manage`, `employee.access_manage`, `employee.branch_assign` — 13 Part-1 codes in all with `employee.view`, `company.manage`, `branch.manage`, `role.manage`, `role.assign`, `settings.view` (Part 1 §10). Each later part lists its codes (⚠️ per part, locked with that part).
2. **Field-grouped updates**: a `PATCH` whose fields span several codes is evaluated per group; any missing code → 403 with `errors[]` naming the fields (P1-RULE-11), so the UI can hide or disable exactly those fields (AD-PERM-03).
3. **Two guard rails fixed in code** regardless of role (P1-RULE-12, API-PERM-06). A **company admin** = a user whose active assignments grant both `role.manage` and `role.assign` at company scope. (a) **No escalation** — a caller who is *not* a company admin can grant only permissions and branch scopes they themselves hold (role create / edit and role assignment); company admins may grant any catalogue code — without this exemption a code deployed by a new part could never be granted to anyone. (b) **No last-admin lockout** — the last active company admin cannot be deactivated, cannot have the qualifying assignment revoked, cannot have `role.manage` / `role.assign` removed from their role, and that role cannot be archived (409 `last_admin` on P1.EMP.05 / P1.EMP.11b / P1.RL.05 / P1.RL.06). (c) On deploy, `sync.code_tables` adds each **new** code to every **company-admin role** — defined deterministically as a role whose permission set contains both `role.manage` and `role.assign` (audited `role.permissions_set`, system actor — ⚠️ default on, the admin may untick), so a new part's features are usable without a manual matrix edit.
4. **Seed roles** at go-live (Admin, Manager, Barber) are a suggested starting matrix only; the admin edits them freely. Docs call these "typically" rather than rules.

## Options Considered

### Option A: Granular action codes, admin-composed roles (chosen — Accepted)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — more codes (~60–80 by Part 8), per-group checks on PATCH, company-admin / last-admin rule |
| Cost | Role matrix UI must stay readable (grouping, search) |
| Scalability | Scales to new modules by adding codes |
| Team familiarity | High (simple `@Can(code, branch)` guard) |

**Pros:** matches the owner's way of running the shop (positions differ by branch); no code change when policy changes; auditable (role edits in audit); the same mechanism serves barbers, managers and future positions.
**Cons:** a wrong matrix is the admin's responsibility — needs a clear UI and sensible seeds; tests must cover each code's deny path.

### Option B: Coarse module codes + hard-coded manager rules
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low in the guard, high in scattered `if (isManager)` logic |
| Cost | Every policy change = code change + deploy |
| Scalability | Poor — rules drift across modules |
| Team familiarity | High |

**Pros:** fewer codes; simpler matrix.
**Cons:** contradicts the owner's answer and D-ROLE-01 (roles are the admin's, not the code's); special cases accumulate; harder to audit "who may do what".

### Option C: Fixed hierarchy (Admin > Manager > Barber) in code
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | Policy changes need a developer |
| Scalability | Poor (a receptionist or cashier position does not fit the ladder) |
| Team familiarity | High |

**Pros:** trivial checks.
**Cons:** cannot express "manager may edit profiles but not status", branch scope per assignment, or new positions; rejected by D-ROLE-01 / 02.

### Option D: Policy engine (Casbin / OPA) with attribute rules
| Dimension | Assessment |
|-----------|------------|
| Complexity | High — policy language, another runtime |
| Cost | Learning curve, handover burden |
| Scalability | Very flexible |
| Team familiarity | Low |

**Pros:** arbitrary conditions (time, amount thresholds).
**Cons:** overkill for ~80 flat codes + branch scope; thresholds the owner needs (e.g. discount limits) are better as settings + explicit codes; hard for a future developer to maintain.

## Trade-off Analysis
- **Flexibility vs. foot-guns.** A gives the admin full control; the two guard rails are the minimum needed to keep the system safe without taking that control back. Everything else that is "dangerous" (e.g. giving a barber `sale.refund`) is a business choice the owner explicitly wanted to own.
- **Granularity cost.** More codes mean more rows in the matrix; grouping by module and a "copy role" action keep it manageable (AD-PERM-07). Codes are added only when an action needs separate control — not one per endpoint.
- **Consistency with the DB.** `permissions` / `role_permissions` / `employee_roles` (Part 1 v3.4) already model this; no schema change.

## Consequences
- Easier: policy changes without deploys; clear 403 messages per field; one guard everywhere; onboarding new positions.
- Harder: `permissions.json` discipline per part (add, never rename — D-ROLE-08); per-code tests; matrix UI design; go-live seeding (★ owner reviews the seed matrix).
- Revisit when: an action needs a value threshold (e.g. refund above X requires approval) — then add a setting + a second code (`sale.refund_high`) rather than a policy engine.

## Action Items
1. [x] API Part 1 v1.1: codes split, P1-RULE-11 field groups, §10 table; OpenAPI summaries updated.
2. [ ] `packages/shared/permissions.json` with module / action / label_mm / label_en / scope (company | branch) for Part 1; parts 2–8 append their codes when locked.
3. [ ] `PermissionGuard` + `assertNoEscalation()` (skipped for company admins) + `assertNotLastAdmin()` on EMP.05 / EMP.11b / RL.05 / RL.06, with unit tests (manager grants beyond own set → 403; admin grants a code from a newly deployed part → 200; deactivate / revoke / strip / archive the last company admin → 409 `error.last_admin`); `sync.code_tables` grants new codes to company-admin roles (audited).
4. [ ] Role matrix UI (AD-PERM-07): grouped by module, branch-scope selector per assignment, "copy from role"; seed roles Admin / Manager / Barber at go-live (★ owner confirms).
5. [x] Review v5.2.10: D-ROLE-02 note + API §11 update; Part 0 §12 #7 ✅.
