# ADR-001: Modular monolith on one VPS (NestJS + PostgreSQL + Next.js, Docker Compose)

**Status:** Accepted — architecture style is locked by 🔒 D-PLT-02 (one backend, one DB) + D-PLT-01 / 06 / 14; the concrete stack comes from the owner's brief (P1, R1–R3) and review §5.2 ✅, and the DB design (`db/`, 91 tables) and API design (`docs/api/`) are already built on it. Owner reconfirmed 01/Oct/2026 21:20 ("ADR-001 — OK — 1 VPS / Docker Compose") and API Part 0 is locked (🔒 D-API-01). **Amendment note 02/Oct/2026:** no production MinIO (files in the owner's bucket — ADR-014); Chromium in the API image (ADR-013) — see the note under the module boundary rules. **Amendment 2 (02/Oct/2026 — ADR-016):** the planning sources (`docs/decisions`, `docs/db` design files, `docs/ux`, `docs/api`, `docs/adr`, `docs/architecture`) and the OpenSpec changes live in the separate spec repository `point-sdd`; this monorepo (`point-barber`) keeps `db/` migrations, `docs/engineering/`, `docs/ops/` and an OpenSpec pointer — action item 1 is read with that change.
**Date:** 01/Oct/2026
**Deciders:** Owner (Point Barbershop) · dev team (2 developers + Claude Code)

> **မြန်မာ အတိုချုပ်** — Backend တစ်ခု (NestJS) ထဲမှာ module တွေ ခွဲထား၊ DB တစ်ခု (PostgreSQL)၊ website + staff app = Next.js၊ server တစ်လုံးပေါ် Docker Compose နဲ့ run။ Microservice / Kubernetes / Redis မသုံး — ဆိုင်ခွဲ ၃ ခု၊ ဝန်ထမ်း ၁၅၊ တစ်နေ့ service ~၉၀ အတွက် load မရှိသလောက်; အဓိက ပြဿနာက ငွေစာရင်း မှန်ကန်မှုနဲ့ handover ဖြစ်လို့ ရိုးရှင်းတဲ့ ပုံစံက အကောင်းဆုံး။

## Context
- Scale (review §4.2, system-design §1.3): 3 branches, 13–15 staff, ~90 services / day, ≤ 15 concurrent phones, < 5 requests / s at peak. Load is not a design driver; correctness of money, resilience to flaky 4G / power cuts, and operability are.
- Team and timeline: 2 developers + Claude Code, V1 in ~1 month, no release split (🔒 D-PLT-14). A new developer must be able to continue from the repo + docs (🔒 D-PLT-06).
- Many flows are one transaction across several business areas: `sale.finish` touches the receipt counter, sale immutability, customer upsert, commission estimate, closing totals and inventory usage. The DB design (91 tables, one schema) enforces these with constraints and triggers (D-DB-*).
- 🔒 D-PLT-02 says "one backend, one DB"; 🔒 D-PLT-01 says web core + Android `.apk` + Windows `.exe`; public website must be server-rendered for SEO / link previews (P1 brief, D-WEB-*).

## Decision
Build one **NestJS modular monolith** (modules = bounded contexts from review §5.3: auth · people · catalog · scheduling · booking · delivery · sales · cash/closing · commission · payroll · finance · inventory · platform) talking to **one PostgreSQL 16 database** through Prisma + raw SQL migrations for constraints. One **Next.js** app (current major pinned in `apps/web` — 16 as of 01/Oct/2026) serving two hosts: `proxy.ts` (Next.js 16's name for `middleware.ts`) rewrites by `Host` — `<domain>` → the `site/` route tree (public site + booking modal; the UX guideline's "`(site)`") and `app.<domain>` → the `staff/` route tree (staff PWA; "`(app)`") — because route groups alone do not separate hosts (both trees would claim `/`). Direct requests to `/site/*` or `/staff/*` that did not come through the rewrite are answered 404; manifest / service worker are served under `app.<domain>` by the same rewrite. (Alternative kept in reserve: two Next.js apps `apps/site` + `apps/app` sharing `packages/ui` — switch if the two trees ever need different build settings.) Everything runs on **one Singapore VPS with Docker Compose + Caddy** (api, web, postgres, optional minio). Native shells (Capacitor / Tauri / iOS PWA) load the hosted app (ADR-003).

Module boundary rules (binding for code):
1. A module writes only its own tables; cross-module effects go through the module's service API or an in-process domain event emitted after commit (review §5.3, system-design §3.4).
2. No business logic in Next.js server actions — the API is the only writer (review §5.2).
3. Shared Zod schemas / types live in `packages/shared` and are the single source for validation and OpenAPI.

**Amendment note (02/Oct/2026 — owner one-sheet F4 / H, ADR-013 / 014):** "optional minio" is settled — production files and off-site backups live in the **owner's S3-compatible cloud bucket** (Cloudflare R2 or Backblaze B2 — ADR-014), so no `minio` container runs in production (MinIO stays only an option for local development). The API container also carries **headless Chromium + the document fonts** for the `DocumentRenderer` (ADR-013) — still one deployable. Cross-module calls named by API Parts 4–8 (`DayLock`, `PayrollLock`, `StockLedger.post`, `EffectiveSale`, `Commission.estimate`, `Expenses.*`, `Receivables.*`, `Attachments.link` / `replace`, `Notifications.emit`, `DocumentRenderer`) are module service APIs under rule 1.

## Options Considered

### Option A: Modular monolith, one DB, one VPS (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — one deployable API, one web app, one DB |
| Cost | ~1 VPS (4 vCPU / 8 GB) + object storage; lowest |
| Scalability | Vertical to 10× current load without change; horizontal later (ADR-008 / §6 triggers) |
| Team familiarity | High — the stack is the owner's own brief; Claude Code works well with NestJS / Next.js / Prisma |

**Pros:** cross-module transactions are plain DB transactions; one backup / restore; simplest handover; fastest to build in 1 month; DB constraints protect every module equally.
**Cons:** a bug in one module can take the whole API down (mitigated by tests, error tracking, restart policy); module boundaries are enforced by convention + lint, not by a network.

### Option B: Microservices per domain (separate services and databases, message broker)
| Dimension | Assessment |
|-----------|------------|
| Complexity | High — service discovery, broker, sagas for sale → commission → closing |
| Cost | Several containers + broker + more memory; ops time |
| Scalability | Independent scaling — not needed at < 5 rps |
| Team familiarity | Low for a 2-person team on a 1-month timeline |

**Pros:** independent deploys and scaling; fault isolation.
**Cons:** money consistency becomes eventual (sagas, compensations) — directly against D-VIS-08 / D-PAY immutability expectations; 3–5× the operational surface; handover far harder.

### Option C: Backend-as-a-service (hosted Postgres + edge functions, e.g. Supabase-style)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low to start, medium once business rules grow |
| Cost | Usage-based; cheap at this size |
| Scalability | Good |
| Team familiarity | Medium |

**Pros:** no server to run; auth and storage built in.
**Cons:** business rules scattered across RLS policies and functions; harder to express the audit interceptor, idempotency, gapless counters and permission AND branch-scope guard consistently; vendor lock-in and data residency outside the owner's control; conflicts with "backend-enforced permission" (D-ROLE-03) being reviewable in one place.

### Option D: Everything inside Next.js (server actions + Prisma, no separate API)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | Lowest |
| Scalability | Fine at this size |
| Team familiarity | Medium |

**Pros:** one process.
**Cons:** no clean place for guards / interceptors / jobs / Socket.IO; public site and staff API share one runtime and one failure domain; the Capacitor / Tauri shells and future integrations need a real HTTP API anyway; review §5.2 explicitly keeps logic out of server actions.

## Trade-off Analysis
- **Simplicity vs. isolation.** Option A gives up process isolation between modules for transactional simplicity and a 1-month delivery. At this load and team size, the cost of microservices (B) is pure overhead and makes money correctness harder, not easier.
- **Control vs. convenience.** Option C would be quicker to bootstrap, but the locked design leans heavily on DB-level rules, audit and idempotency implemented in one backend; keeping those in NestJS keeps them reviewable and testable (D-PLT-17 spec-driven).
- **Single VPS risk** is accepted because downtime already has a defined fallback (paper + late entry, D-VIS-13) and the backup policy (D-DAT-03) bounds data loss; monitoring (ADR-007) makes outages visible.

## Consequences
- Easier: transactions across modules, one migration stream, one backup, one `docker compose up`, one place for guards / audit / idempotency.
- Harder: keeping module boundaries honest — needs a lint rule (no cross-module Prisma access) and code review discipline; a deploy restarts everything (seconds; acceptable).
- Revisit when: a second API instance is needed (ADR-008 adapter, shared rate-limit store), a second company is added (RLS — D-ORG-03), or a module needs a different runtime (none foreseen).

## Action Items
1. [ ] Monorepo layout: `apps/api` (NestJS), `apps/web` (Next.js — `app/site/` + `app/staff/` trees, host rewrite in `proxy.ts` (`middleware.ts` before Next 16), no route handlers under `/api`, internal hook at `/internal/revalidate`), `apps/android` (Capacitor), `apps/windows` (Tauri), `packages/shared` (Zod schemas, types, permission / setting definitions), `db/`, `docs/`, `openspec/` *(Amendment 2 — ADR-016: `db/` = migrations built from `point-sdd/docs/db`; `docs/` = `docs/engineering` + `docs/ops` only; `openspec/config.yaml` = `store: point-sdd`; further packages named by later ADRs / guidelines: `packages/ui`, `packages/i18n`, `packages/documents`)*. Pin Node, Next.js, NestJS, Prisma, Capacitor majors in the root `package.json` engines / a `VERSIONS.md`.
2. [ ] NestJS module per bounded context with an `index.ts` public surface; ESLint `no-restricted-imports` rule blocking cross-module internals and direct Prisma access outside a module's repository layer.
3. [ ] `docker-compose.yml` (caddy, api, web, postgres, backup sidecar — ADR-002; ~~minio optional~~ → files in the owner's bucket, ADR-014; MinIO only in `docker-compose.dev.yml` as an option) + `.env.example` (incl. the bucket endpoint / keys, `SITE_ORIGIN`, the two internal secrets `INTERNAL_SSR_KEY` — api + web — and `INTERNAL_OPS_KEY` — api + backup sidecar; ADR-009, review fix 02/Oct); Caddyfile per ADR-009; `.next/cache` on a volume (ADR-006).
4. [ ] CI: typecheck, lint, unit, DB constraint tests (`db/source/*-test.sql` — copies of `point-sdd/docs/db/*-test.sql`, ADR-016), Playwright smoke; image build; SSH deploy; `prisma migrate deploy`; `sync.code_tables` on startup.
5. [ ] Runbooks in `docs/ops/`: install, deploy, rollback, backup / restore, secrets rotation (🔒 D-PLT-06).
