# point-sdd — rules for Claude Code (spec hub)

This repository holds the **planning sources and the specs** of the Point Barbershop System. There is **no
application code here**. The app is `../point-barber` (workspace folder `point/` holds both — ADR-016).

Owner-facing text is written in plain Myanmar; specs and code-facing documents in English.

## 1. What is a requirement

1. **Only 🔒 rows of `docs/decisions/decision-register.md` are requirements** (D-PLT-11). ⚠️ recommendations
   and 🟡 open items are *not* — never put them into a spec, the DB or code until the owner approves.
2. **Precedence:** decision register 🔒 → `docs/db/` → `docs/ux/` → `docs/api/` → `docs/adr/` +
   `docs/architecture/` → design-reference images → Fresha. Details: `openspec/config.yaml`.
3. **Conflict = STOP (D-PLT-13).** If two locked sources disagree, or a request contradicts a locked source,
   do not pick a side. Describe both sides with their IDs, say what each choice would change, and ask.
4. **Never invent** a business rule, a colour, a logo, a font, an error code or UI copy. If a needed behaviour
   is in no locked source, write it under "Open questions" and stop.
5. Do not re-ask what is already decided. One topic at a time. Explain in simple Myanmar with an example; when
   you recommend something, say why.

## 2. Where things are

| Need | Read |
|---|---|
| A decision | `docs/decisions/decision-register.md` (generated — never edit; see §5) |
| Why a decision was made, open sheets, status | `docs/decisions/point-barbershop-system-review-v*.md` — about 1 MB: grep for the section, never load it whole. `§0` = current status and the next step |
| Tables, constraints | `docs/db/` (README first) |
| Screens | `docs/ux/admin-panel.md` (AD-…) · `docs/ux/frontend-website.md` (FE-…) |
| Endpoints | `docs/api/00-conventions.md` (API-…) · `docs/api/01..08-*.md` · `docs/api/openapi/` |
| Cross-cutting | `docs/adr/ADR-001..016` · `docs/architecture/system-design.md` |
| Change list, owners, order | `docs/plan/roadmap.md` · `docs/plan/dev-plan.md` |
| Scenario data | `docs/plan/spec-fixtures.md` |
| Workflow | `docs/SDD-Workflow-Guide-MM.md` |

Lines in these files are long — search with a rule ID, then read around the hit.

## 3. Writing a change (OpenSpec 1.14.0)

`openspec/config.yaml` holds the binding rules for proposal / specs / design / tasks. The short form:

- **One change = one form or topic**, 1–3 days, about 20–30 test cases; name `add-…` / `change-…` /
  `remove-…` / `fix-…` (D-PLT-20). Start from the brief in `docs/briefs/<change-id>.md`.
- **Capabilities** are the 25 business areas listed in `openspec/config.yaml` (all approved by the owner —
  review §0.11 S3). No new capability without the owner.
- **Every requirement** = a SHALL / MUST sentence with the actual value, limit, status or message key, **and**
  its source IDs in the title — `### Requirement: One pending discount request per sale (D-PAY-04 · P4.DRQ.01)`.
  "As defined in D-PAY-04" alone is not a requirement.
- **Every scenario** uses the fixture people, branches, MMK amounts and MMT times, states exact error `code`s
  and HTTP statuses, and gives the expected value with its arithmetic (`total = 11,000 (8,000 + 3,000)`).
- **Proposal** starts with `## မြန်မာ အတိုချုပ်`; lists Implements / Depends on / Repos / Owner; has
  `## Non-goals` and `## Open questions`. While "Needs the owner's answer" holds an item, the change is not
  applied at all.
- **Tasks** are ≤ 2 hours, name the repo `(point-barber)` / `(point-sdd)` and cite IDs; tests first for money,
  permission and date-boundary rules; the last group is verification.
- Validate: `openspec validate <change-id> --strict`. Never edit `openspec/specs/` by hand — it changes only
  through `/opsx:archive`.

## 4. Fixed conventions (cite, do not re-decide)

Money = whole MMK, integer, never float (D-PLT-04) · time = Asia/Yangon, `business_date` = Myanmar calendar
date (D-PLT-15) · status values = smallint codes with named constants (D-DB-03) · permission = CRUD per menu +
named special actions, no `manage` code, reach decided by the data level company / branch / mixed / shared /
private (ADR-011, ADR-012) · transactional rows are never hard-deleted, finished records are immutable
(D-DAT-05, D-VIS-08) · UI text only from the language files, receipts always English (D-PLT-03) · website
booking is a modal (D-UX-05) · website colours `#EEEEEE` / `#000000` / `#DC5F00` with black buttons; admin
panel colours not given yet → neutral (D-UX-02).

## 5. Changing a locked source

A locked source is changed only on the owner's decision, in this order:

1. Ask first with **one question sheet** (numbered, each with a default and the reason); produce files only
   after every answer; deliver the whole batch together (D-PLT-19).
2. Edit the source with a **version bump** (DB part, API part, guideline) — never rewrite a lock in place.
   Architecture: a new ADR, the old one marked *Superseded* (or a dated *Amendment*).
3. Update the review: Appendix A row, §3.0 register, §0 status. Bump the review version.
4. Run `python tools/extract-decision-register.py`.
5. For a DB change: re-run every `docs/db/*-test.sql` on PostgreSQL 16 and record the counts in
   `docs/db/README.md`.

## 6. This repository's own rules

- Write only: `openspec/`, `docs/`, `work/` (generated), `tools/`, `.claude/`. Never create or change files
  in `../point-barber` from here except through `/opsx:apply` in the fallback mode of `SETUP.md`.
- `/opsx:apply` is run from `point-barber`. Everything else (explore, propose, validate, generate tests,
  browser tests, archive) is run here.
- Commit messages: `brief: <id>` · `proposal: <id>` · `spec: <id> — <what>` · `tests: <id> (n cases)` ·
  `archive: <id>` · `docs: <what>`.
- Never commit `.xlsx` output, evidence, `.venv/`, `node_modules/`, `projects.json`,
  `.claude/settings.local.json`, secrets, real customer or staff data, or screenshots of the live Fresha
  account. Fixture data only (`docs/plan/spec-fixtures.md`).
- The system is passwordless; test sign-in = e-mail code read from Mailpit. Never write a password step or a
  test-only login into a spec or a test case.
