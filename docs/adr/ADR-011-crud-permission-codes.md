# ADR-011: Permission codes = CRUD per menu + named special actions (supersedes ADR-010)

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #25 = A, #26 a–d, "Default Roles = Admin / Manager / Barber"). **#7's scope sentence and action item 1's `scope` field are superseded by [ADR-012](ADR-012-scope-by-data-level.md)** (owner 01/Oct — scope follows the data level: company master · branch data · shared records); the rest stays Accepted. **Supersedes ADR-010** (its guard rails are carried over below; its code list and its "company admin = `role.manage` + `role.assign`" definition are replaced).
**Date:** 01/Oct/2026
**Deciders:** Owner (decided) · dev team

> **မြန်မာ အတိုချုပ်** — Permission ကို **menu (module) တစ်ခုချင်း CRUD** နဲ့ ခွဲမယ် — ဥပမာ Services menu = `service.view` · `service.create` · `service.update` · `service.delete`; တခြား menu တွေလည်း ဒီပုံစံ။ `manage` ဆိုတဲ့ ဘုံ code မသုံးတော့ဘူး။ CRUD နဲ့ မကိုက်တဲ့ **အတည်ပြု / ငွေ action** (approve, refund, finalize, close, assign …) ကိုတော့ သီးသန့် code ဆက်ထား — `update` ထဲ ပေါင်းရင် ပြင်ခွင့်ရှိသူ အကုန် approve / refund ပါ လုပ်နိုင်သွားမှာ စိုးလို့။ **`delete` = archive / ပိတ်** (data မပျောက် — D-DAT-05)။ **`view` = အဲ့ menu ရဲ့ စီမံ screen ဖွင့်ခွင့်** — POS / booking ထဲ ရွေးဖို့ လိုတဲ့ list (service, ဈေး, roster, အားတဲ့အချိန်) ကတော့ ကိုယ့် branch ဝန်ထမ်း အကုန် code မလိုဘဲ ရ (admin က view ကို မတော်တဆ ဖြုတ်မိလည်း checkout မရပ်)။ Role ၃ ခု (Admin / Manager / Barber) နဲ့ စ — **Admin = အကုန် ✔**; Manager = admin က လိုတာပဲ ✔။ System က "company admin" လို့ စစ်တာ = **Role row ၅ ကွက်လုံး ✔** (`role.view` + `role.create` + `role.update` + `role.delete` + `role.assign`) + company scope — role ကို အပြည့်ကိုင်သူက ကျန်တာ ကိုယ့်ကိုယ်ကို ပေးနိုင်လို့ "အကုန် ✔ = Admin" နဲ့ အမှန်တကယ် အတူတူ။

## Context
- 🔒 D-ROLE-01 (role = position, admin creates roles), D-ROLE-02 (permission = module → action), D-ROLE-03 (permission AND branch scope, backend-enforced), D-ROLE-04 (grant-only union), D-ROLE-05 (scope per assignment), D-ROLE-06 (changes immediate), D-ROLE-07 (Admin = company-wide + branch; Manager = assigned branches; Barber = own work + branch operations view-only), D-ROLE-08 (`permissions.json` is the source, synced; codes never renamed **after deploy**).
- ADR-010 (Accepted 01/Oct 11:54) made every distinct action its own code and left the Manager role to the admin. Its code list mixed styles: `company.manage`, `role.manage`, `service.manage`, `price.manage` next to `employee.profile_manage`, `employee.status_manage` …
- Owner, 01/Oct 21:20: "Permission မှာ Menu တစ်ခုချင်းစီကို CRUD ထည့်တာကို ပြောတာ — ဥပမာ service အတွက် `service.view`, `service.create`, `service.update`, `service.delete`; တခြား ဟာတွေလည်း အဲ့လိုပဲ; အကုန်လုံးကို check လုပ်ထားရင် Admin; Manager ဆိုရင် သူ့အတွက် check လုပ်မယ့် ဟာပဲ ပေး" · #25 = A (company admin = all five role codes) · #26 (a) CRUD per module, only actions that make sense, (b) special actions stay separate, (c) delete = archive, (d) view = management screen; operational pickers open.
- Nothing has been deployed, so no code in `permissions.json` exists yet — renaming now does not break D-ROLE-08 ("never renamed" applies from the first deploy).
- The admin guideline already hides every screen unless the user has "its view permission" (AD-NAV-02) and describes the role editor as a matrix of rows = modules, columns = actions (AD-PERM-07) — CRUD columns fit it directly.

## Decision
1. **Code = `<module>.<action>`, one module per menu.** Each menu (Services, Prices, Eligibility, Schedule, Leave types, Leave, Branches, Employees, Roles, Settings, Company …) gets the CRUD actions that exist for it — `view`, `create`, `update`, `delete` — and only those (e.g. Settings = `view` + `update`; Company = `view` + `update`; Prices = `view` + `update` + `delete`). There is **no `manage` code** anywhere.
2. **Special actions stay separate codes** when they are not plain CRUD or must be grantable without edit rights: approvals (`leave.approve`, `discount.approve`, `expense.approve`, `income.approve`), money / irreversible steps (`sale.refund`, `sale.adjust`, `sale.override_price`, `sale.late_entry`, `payment.verify`, `payroll.finalize`, `payroll.pay`, `purchase.post`, `transfer.send` / `receive`, `closing.close` / `reopen`, `cashout.return`, `backup.restore`, `import.run`), assignment (`role.assign`, `employee.branch_assign`) and **field groups that the admin must be able to give separately** (`employee.rating_update`, `employee.earnings_update`, `employee.access_update`). Format for a field group = `<module>.<field>_update`.
3. **`delete` never hard-deletes** (🔒 D-DAT-05): it archives, deactivates or cancels (record kept), and also covers undoing that (re-activate). Examples: `service.delete` = archive service / category; `branch.delete` = deactivate / re-activate a branch; `employee.delete` = Inactive / Resigned / Terminated / re-activate (D-EMP-04 — status change, sessions revoked); `leave.delete` = cancel a PENDING leave on someone's behalf; `price.delete` = withdraw a scheduled grid. The matrix label is "Delete (archive)" / "ဖျက် (archive — data မပျောက်)".
4. **`view` = the menu and its management reads.** A user sees a menu item and can open its management screen only with `<module>.view` **or any other code of the same module — CRUD or special** (written `<module>.view⁺` in the API docs — someone allowed to edit, delete or approve a record can always load it; e.g. a holder of only `leave.approve` still opens the approval inbox). Management reads = lists with archived rows, history, scheduled (future) grids, matrices, other employees' records. **Operational reads stay open** to every staff member inside their read scope (API P2-RULE-11): the service / category / option lists and service detail that POS and booking pickers use, the price quote and resolved variant prices, the roster / shift data the calendar draws, active leave types for the request form, availability, the employee picker, branch summaries, company info. So unticking `service.view` hides *Settings › Services* but never breaks checkout. Reads of the caller's own data (`/v1/me/…`, own leave, own pattern) never need a code.
5. **Writes need exactly their code** — `create`, `update`, `delete` or the special action — checked with branch scope (API-PERM-02). A field-grouped `PATCH` is checked per group (P1-RULE-11).
6. **Company admin** = a user with an active **company-scope** assignment of a **company-admin role**; a company-admin role = a role whose permission set contains **all five role codes** `role.view`, `role.create`, `role.update`, `role.delete`, `role.assign` (owner #25 = A). Guard rails kept from ADR-010, fixed in code regardless of role: (a) **no escalation** — anyone who is not a company admin can grant only codes and branch scopes they hold themselves; company admins may grant any catalogue code; (b) **no last-admin lockout** — the last active company admin cannot be deactivated (P1.EMP.05), cannot have their qualifying assignment revoked (P1.EMP.11b), none of the five role codes can be removed from that role (P1.RL.05) and the role cannot be archived (P1.RL.06) → 409 `last_admin`; (c) on deploy `sync.code_tables` adds every **new** code to every company-admin role (audited `role.permissions_set`, system actor; ⚠️ default on, the admin may untick).
7. **Seed roles = Admin / Manager / Barber** (owner 01/Oct 21:20; D-ROLE-07). Admin = every code, company scope (therefore a company admin). Manager = the codes whose "Seed" entry in each part's code table names Manager, branch scope — the admin ticks or unticks freely. ~~A code declared `company` is effective only through a company-scope assignment~~ → **superseded by ADR-012:** what a grant reaches depends on the **data level** of the target — company master writes need company scope (branch scope = read-only), branch data needs the branch in scope, shared records (customers) accept any assignment with history filtered to scope; a branch-scoped Manager still changes no company master data (D-ROLE-07) — shared records (customers) are the deliberate exception (ADR-012). Barber = no management code in Parts 1–2 (own data + operational reads cover the barber screens); later parts add the barber's operational codes (e.g. booking create, visit start). The seed matrix is shown to the owner before go-live (★).
8. **Role editor (AD-PERM-07 v1.3):** rows = modules (grouped by menu group), columns **View · Create · Update · Delete**, plus a **Special actions** cell listing that module's special codes as checkboxes; a cell is blank where the action doesn't exist for the module; "Select all in module"; the Roles row shows a "Company admin" badge when all five are ticked (company admin also needs a company-scope assignment of that role — P1-RULE-12).
9. **Per-part catalogue.** Each API part lists its codes (module, action, ~~scope company / branch~~ level — ADR-012, typical holder, endpoints) and `permissions.json` is assembled part by part. Part 1 = 21 codes, Part 2 = 22 codes. Codes named for Parts 3–8 in the review / guideline (`payroll.manage`, `product.manage`, `website.manage` …) are renamed by the same rule when that part is designed (map in AD-PERM-06 v1.3).

## Options Considered

### Option A: CRUD per menu + named special actions + open operational reads (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — more codes (43 for Parts 1–2), one generic `view⁺` rule, per-endpoint classification of reads |
| Cost | Matrix UI with fixed columns (simpler than free action names) |
| Scalability | Every new module = the same four columns + its special actions |
| Team familiarity | High — the CRUD matrix is the common admin-panel pattern (Jakob's Law) |

**Pros:** what the owner asked for; one mental model for every menu; the matrix is scannable; dangerous actions still need their own tick; POS never breaks because of a view tick.
**Cons:** more rows to seed and test (deny path per code); "delete" means archive — must be labelled clearly.

### Option B: Keep ADR-010 (action codes incl. `<module>.manage`)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lower code count |
| Cost | Matrix columns differ per module |
| Scalability | Fine |
| Team familiarity | High |

**Pros:** fewer codes.
**Cons:** "manage" hides what the holder can do (create? delete?); not what the owner wants; inconsistent naming (`company.manage` vs `employee.status_manage`).

### Option C: Pure CRUD only (approvals / refunds inside `update`)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | None |
| Scalability | Poor for business rules |
| Team familiarity | High |

**Pros:** strictly four columns.
**Cons:** anyone allowed to edit a leave could approve it, anyone allowed to edit a sale could refund it — contradicts D-LV-02, D-PAY-04/05, D-FIN-06 approval rules; rejected by #26 (b).

### Option D: `view` required for every read (operational lists included)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | Every barber role needs many view ticks |
| Scalability | Fragile |
| Team familiarity | High |

**Pros:** one rule for all reads.
**Cons:** unticking `service.view` or `schedule.view` would break checkout / booking / calendar for barbers; rejected by #26 (d).

## Trade-off Analysis
- **Clarity vs. count.** CRUD columns roughly double the number of codes compared with `manage`, but each code says exactly what it allows, and the matrix stays readable because every row has the same columns.
- **Safety of special actions.** Keeping approvals and money steps outside CRUD preserves separation of duties (a manager may edit a leave but not approve their own — P2.LV.07).
- **Screens vs. data.** `view` controls management screens; operational data needed to work is governed by read scope (assignment ∪ grants) instead — this keeps the barber's phone working whatever the matrix says, while history, scheduled prices and other people's records stay behind `view`.

## Consequences
- Easier: the owner composes roles with a familiar matrix; developers map each endpoint to one code; the 403 / hidden-control rules (AD-PERM-02) follow directly.
- Harder: more deny-path tests; seeding the Admin / Manager / Barber matrix; each later part must classify its reads as operational or management.
- Revisit when: a module needs value thresholds (add a setting + a second special code, e.g. `sale.refund_high`), or customer accounts arrive (V2).

## Action Items
1. [ ] `packages/shared/permissions.json` — Part 1 (21) + Part 2 (22) codes with `module`, `action`, ~~`scope`~~ **`level` (`company` | `branch` | `mixed` | `shared` — ADR-012)**, `kind` (`crud` | `special`), `label_key`; parts 3–8 append when locked (D-ROLE-08).
2. [ ] `@Can()` guard helper `canView(module)` = holds any code whose module = `module` (view, CRUD write or special); `PermissionGuard`, `assertNoEscalation()` (skipped for company admins), `assertNotLastAdmin()` on P1.EMP.05 / EMP.11b / RL.05 / RL.06; `isCompanyAdminRole(role)` = contains the five role codes.
3. [ ] `sync.code_tables`: new codes → every company-admin role (audited, system actor).
4. [ ] Role matrix UI per AD-PERM-07 v1.3 (columns View · Create · Update · Delete + Special actions; Company-admin badge).
5. [ ] Go-live seed: Admin (all, company), Manager (typical column, branch), Barber (none in Parts 1–2) — ★ owner reviews the seed matrix.
6. [ ] Tests: each code's deny path; `view⁺` (update without view loads the record); operational reads work for a code-less barber; company-admin exemption; last-admin 409 for each of the five role codes.
