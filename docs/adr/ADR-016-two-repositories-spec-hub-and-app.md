# ADR-016: Two repositories — spec hub (`point-sdd`, OpenSpec store) and app (`point-barber`, pointer)

**Status:** Accepted — owner 02/Oct/2026 (OpenSpec question sheets: C5 "ဘယ်ဖိုင် ဘယ်မှာထားမလဲ", D5, sheet 2 #3 / #4 / #8 "ကျန်တာ အိုကေတယ်" — review §0.10). **Amends ADR-001 action item 1** (the monorepo no longer holds `docs/` planning sources or `openspec/` changes); the rest of ADR-001 is unchanged.
**Date:** 02/Oct/2026
**Deciders:** Owner (Point Barbershop) · spec writer · dev team (2 developers + Claude Code)

> **မြန်မာ အတိုချုပ်** — Repo ၂ ခု ခွဲထားမယ်။ **`point-sdd`** = spec၊ brief၊ ဆုံးဖြတ်ချက်၊ DB / API / UX design၊ test case tool — code မပါ။ **`point-barber`** = app code၊ migration၊ test၊ coding guideline။ Developer စက်မှာ `point/` folder အောက် ၂ ခု ဘေးချင်းယှဉ် ထား။ Spec အလုပ် (brief / propose / test case / archive) ကို `point-sdd` ထဲမှာ၊ code ရေးတာ (`/opsx:apply`) ကို `point-barber` ထဲမှာ လုပ် — OpenSpec က `point-barber` ထဲကနေ `point-sdd` ရဲ့ spec ကို တိုက်ရိုက် ဖတ်တယ်။ Rule: **spec မရှိရင် code မရေးရ; DB / API ပြောင်းချင်ရင် `point-sdd` မှာ အရင်ပြင်**။

## Context
- 🔒 D-PLT-17: coding is spec-driven with OpenSpec; the spec sources are the decision register, `db/`, `docs/ux/`, `docs/api/` and `docs/adr/`.
- ADR-001 action item 1 sketched one monorepo that also contained `db/`, `docs/` and `openspec/`. Before any code was written the team created two GitHub repositories: `agkyawpai/point-sdd` (already holding the SDD workflow guide, the test-case generator, the browser tester and the documentation generator) and `naingaunglinn/point-barber` (empty, for the application).
- The team's workflow (`docs/SDD-Workflow-Guide-MM.md`) separates two roles: the **spec writer** (briefs, review of proposals and test cases) and the **developers** (code with Claude Code). The spec writer does not need the application toolchain; the developers need the app repo's own `CLAUDE.md`, lint hooks and coding guideline loaded when code is written.
- Test workbooks, review JSON and evidence are produced from the specs, not from the code, and must not live in the application repository.
- OpenSpec CLI 1.14.0 supports a standalone planning repository (a *store*) that other repositories point at with one line (`store: <id>` in their `openspec/config.yaml`). Stores are marked beta in 1.14.0.

## Decision
1. **Two repositories, one workspace folder.** On every machine both are cloned side by side under one folder named `point/`:
   ```
   point/
   ├── point-sdd/      spec hub — OpenSpec store "point-sdd"
   └── point-barber/   application — OpenSpec pointer repo
   ```
2. **`point-sdd` owns everything that is planning.** `openspec/` (config, changes, specs, archive) · `docs/briefs/` · `docs/decisions/` (planning review + generated `decision-register.md`) · `docs/db/` (DBML, constraint SQL, constraint tests — the design source) · `docs/ux/` · `docs/api/` + `docs/api/openapi/` · `docs/adr/` · `docs/architecture/` · `docs/plan/` (dev plan, roadmap, spec fixtures) · the test-case, browser-test and documentation tools · `work/` review JSON. **No application code.**
3. **`point-barber` owns everything that runs.** The monorepo of ADR-001 (`apps/`, `packages/`), `db/` **migrations** built from point-sdd `docs/db` (with byte-identical copies of the source SQL and a hash manifest so CI needs no access to the other repository), unit / integration / e2e tests, `infra/`, `docs/engineering/` (coding guideline), `docs/ops/` (runbooks — D-PLT-06), `design-reference/` (owner's reference images), its own `CLAUDE.md`, and `openspec/config.yaml` containing only `store: point-sdd`.
4. **OpenSpec store + pointer.** Each machine registers the store once: `openspec store register <path>/point/point-sdd --id point-sdd`. Then:
   - in `point-sdd`: `/opsx:explore`, `/opsx:propose`, `openspec validate`, `/point-generate-tests`, `/point-browser-tester`, `/point-generate-docs`, `/opsx:archive`;
   - in `point-barber`: `/opsx:apply <change-id>` — Claude Code loads the app repo's `CLAUDE.md`, coding guideline and hooks, reads the change from the store, and ticks `tasks.md` in `point-sdd`.
   OpenSpec is pinned at **1.14.0** in `SETUP.md`; an upgrade is tried on one machine first.
5. **Fallback while stores are beta.** If the store mechanism fails on a machine, the developer runs `/opsx:apply` from `point-sdd` with `point-barber` added as an additional directory (`.claude/settings.local.json`) and starts the session by reading `../point-barber/CLAUDE.md`. Nothing else changes.
6. **Direction of change — design first.** A change to the database, API contract, UX rule or an architecture decision is made in `point-sdd` first (version bump + register note, the existing rules), then implemented in `point-barber`. The app repo never becomes the source of a design fact: its `db/source/` copies are checked against `point-sdd` (`pnpm db:check-source` locally; CI uses the hash manifest), and the generated OpenAPI is compared with `point-sdd` by a local check whose name is fixed by the change that builds it (`add-ci-guard-rails` — coding guideline CG-API-08, OPEN-CG-04).
7. **Traceability.** Every branch, commit scope and PR in `point-barber` carries the OpenSpec change id; every PR description names `Spec: point-sdd/openspec/changes/<change-id>`. A change is archived only after its PR is merged and its test workbook has no open NG.
8. **Visibility.** Both repositories are **private**: the planning record contains the shop's revenue figures and business rules, and the design references contain screenshots of the shop's current system (same reasoning as RISK-13 / ACT-07).

## Options Considered

### Option A: Two repositories, OpenSpec store + pointer (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–medium — two clones, one registration command per machine |
| Cost | None |
| Scalability | Further app repos (e.g. a separate Android project) can point at the same store |
| Team familiarity | High — matches the workflow the team already wrote down and tooled |

**Pros:** the spec writer works without the app toolchain; code sessions load the app's own rules; test workbooks and evidence stay out of the code repository; spec history is not buried in code commits; one place for every locked source.
**Cons:** a change spans two repositories (two commits / PRs to keep in step); CI in `point-barber` cannot read `point-sdd` directly (different owner) — handled by hashed copies; the store feature is beta.

### Option B: One monorepo (ADR-001 action item 1 as written)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest — one clone, one PR carries spec and code |
| Cost | None |
| Scalability | Fine at this size |
| Team familiarity | Medium — the test tooling and workflow guide already assume a separate hub |

**Pros:** atomic spec + code changes; CI sees everything.
**Cons:** the 1 MB planning record, test JSON and tools sit in the application repo; the spec writer needs the app repo; the repositories and tools already exist the other way.

### Option C: Two repositories, app repo added as an additional directory (the guide's first version)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | None |
| Scalability | Same as A |
| Team familiarity | High |

**Pros:** no beta feature.
**Cons:** code is written from a session rooted in `point-sdd`, so the app repo's `CLAUDE.md`, hooks and coding guideline are not the session's project rules unless loaded by hand — the place where code-quality rules matter most. Kept as the fallback (Decision 5).

## Trade-off Analysis
- **Atomicity vs. separation of roles.** One repo makes spec + code atomic; two repos let the spec be reviewed and locked before a line of code exists, which is the point of D-PLT-17. The change id in every branch / commit / PR restores traceability.
- **Beta dependency.** The store is a thin convenience (it resolves a path); the fallback removes the risk. Pinning the CLI version keeps all machines identical.
- **Duplicate SQL.** The copies in `point-barber/db/source/` are generated, hash-checked and never edited; the design source stays single.

## Consequences
- Easier: reviewing a spec without code noise; onboarding the spec writer; keeping test evidence and workbooks out of the app repo; pointing a future repository at the same specs.
- Harder: keeping two repositories in step — covered by the change id rule, the "design first" rule and the archive gate; CI cannot diff against `point-sdd` — local checks + hash manifest.
- Revisit when: the store feature leaves beta with a different layout; the team grows and wants spec + code in one PR; CI needs to read the contract directly (deploy key or a published contract package).

## Action Items
1. [ ] `point-sdd`: `openspec/config.yaml` (project context, artifact rules), `CLAUDE.md` (spec rules), planning sources under `docs/`, `tools/extract-decision-register.py`, workflow guide + `SETUP.md` updated for the `point/` workspace and the store. *(delivered with batch v5.2.16)*
2. [ ] `point-barber`: `openspec/config.yaml` = `store: point-sdd`; `CLAUDE.md`; `docs/engineering/coding-guideline.md`; `design-reference/` index files. *(delivered with batch v5.2.16; the rest of the tree = change `add-repo-scaffold`)*
3. [ ] Every machine: clone both under `point/`, `npm install -g @fission-ai/openspec@1.14.0`, `openspec store register`, `openspec init --tools claude` in each repository, `openspec doctor`.
4. [ ] Owner: set both GitHub repositories to private before the planning sources and design references are pushed (Decision 8).
5. [ ] `add-repo-scaffold`: `db/source/` copies + hash manifest, `pnpm db:check-source`; PR template with the `Spec:` line; PR-title check with the change id.
