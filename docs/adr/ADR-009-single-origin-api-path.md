# ADR-009: One origin per app — API served under the `/api` path by Caddy (not an `api.` subdomain)

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #5 = default single origin, "အကုန် OK"; locked with 🔒 D-API-01 — API-SHAPE-01, API-AUTH-01/02). *Was:* Proposed (new from the system-design review, 01/Oct). **Amendment note 02/Oct/2026** (API Parts 4 / 8): public media under `/api/v1/public/*`, presigned bucket downloads, upload body cap, `X-Internal-Key` stripped at the edge — see *Amendment* under Decision. **Review fix 02/Oct (R3-13):** two internal secrets — `INTERNAL_SSR_KEY` (web container: SSR rate-limit exemption only) and `INTERNAL_OPS_KEY` (backup sidecar / restore script: `/v1/internal/*`).
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — API ကို `api.<domain>` ဆိုတဲ့ subdomain သီးသန့် မထားဘဲ **app နဲ့ origin တစ်ခုတည်း** (`app.<domain>/api/...`၊ website အတွက် `<domain>/api/...`) မှာ ထား — Caddy က `/api/*` ကို NestJS ဆီ၊ ကျန်တာ Next.js ဆီ ပို့ပေး။ ရလဒ်: CORS မလို၊ cookie က host တစ်ခုတည်းမှာပဲ (ပိုလုံခြုံ)၊ 4G ပေါ်မှာ preflight request အပို မရှိ (ပိုမြန်)။ Domain (ACT-05) ရရင် `.env` ထဲ ထည့်ရုံ။

## Context
- Two web front doors: the public site at `<domain>` (SSR pages + booking modal calling `/v1/public/*`) and the staff PWA at `app.<domain>` (calling `/v1/*` with the session cookie, plus Socket.IO `/rt`).
- Cookie-based sessions (ADR-005) are simplest and safest when the API shares the app's origin: no `Domain=` cookie attribute, no `credentials: 'include'`, no CORS allow-list, no preflight `OPTIONS` round-trips — which matter on 4G where each round-trip is 100–300 ms (AD-PERF-01 budget: POS API p95 ≤ 400 ms).
- Caddy already fronts everything (ADR-001); path routing is one line per host.
- Part 0 v1.0 wrote the base URL as a bare `/v1/…` with a ★ domain placeholder and a CORS note; the system-design review found the subdomain variant adds surface without benefit here.

## Decision
- `app.<domain>`: Caddy routes `/api/*` and `/rt*` (Socket.IO path, WebSocket upgrade) → NestJS container, **except** `/api/v1/internal/*` → 404; everything else → Next.js (`staff/` tree via the host rewrite — ADR-001).
- `<domain>`: Caddy forwards **only** `/api/v1/public/*`, `/api/v1/health` and `/api/v1/system/status` → NestJS; every other `/api/*` path → 404 (so no staff login or session can be created on the public host); everything else → Next.js (`site/` tree).
- Both hosts: `/internal/*` → 404 (the web app's revalidate hook is reachable only over the Docker network); the web app defines **no route handlers under `/api`** — that prefix belongs to NestJS at the edge.
- NestJS uses `setGlobalPrefix('api')`; documents and OpenAPI keep paths as `/v1/…` with `servers: [{ url: '/api/v1' }]`. **CORS is disabled** (no cross-origin callers in V1). The session cookie is host-only for `app.<domain>` (no `Domain` attribute — API-AUTH-01); the public site never receives it.
- Internal calls (job → `POST http://web:3000/internal/revalidate`; web SSR → `http://api:3001/api/v1/public/*`; backup sidecar → `/api/v1/internal/backup-runs`) go over the Docker network by service name, not through Caddy.

### Amendment (02/Oct/2026 — API Parts 4 / 8, 🔒 D-API-05 / 09 · ADR-013 / 014)
*The decision above is unchanged; the edge rules already cover the new paths.*
- **Public media** `GET /api/v1/public/media/<attachment_id>/<variant>` (ADR-014) lives under `/api/v1/public/*`, so `<domain>` already forwards it to NestJS; on `app.<domain>` it is a normal `/api/*` path (staff sessions also see non-public images there). No Caddy change.
- **Private staff files** are downloaded from the **bucket host** by a 5-minute presigned URL (P8.ATT.04 — ADR-014). That is a different origin by design: no cookie is sent there and the API's CORS stays disabled; the app's CSP lists the bucket host in `img-src` / `connect-src`. **Receipts** are the exception — streamed through the API (`/api/v1/sales/{id}/receipt`) so the Android shell prints with its same-origin session (ADR-013).
- **Uploads:** Caddy caps the request body of `app.<domain>` at `system.upload_max_mb` + 1 MB (P8-RULE-03); the API enforces the exact limit (422 `file_too_large`).
- **Internal surface** gains `GET` and `PATCH /v1/internal/backup-runs/{id}` (P8.INT.02 / 03) — already blocked from outside by the `/api/v1/internal/*` → 404 rule. `POST /v1/internal/backup-runs` accepts kinds 1–3 only (a RESTORE row comes only from the signed-in authorisation P8.BAK.03).
- **SSR exemption** (P8-RULE-13): server renders call `http://api:3001/api/v1/public/*` with `X-Internal-Key` and skip the per-IP limit (ADR-006 amendment). Caddy **removes any inbound `X-Internal-Key` header** on both hosts, so only container-to-container calls can carry it.
- **Two secrets behind the one header (review fix 02/Oct — independent review R3-13):** **`INTERNAL_SSR_KEY`** is in the `.env` of the API and the **web** container and does one thing — it lifts the per-IP limit on `/v1/public/*`; **`INTERNAL_OPS_KEY`** is in the `.env` of the API, the **backup sidecar** and the restore script and is the only value `/v1/internal/*` accepts. The web container is the internet-facing one; with separate secrets it never holds a key that can write `backup_runs`. The revalidate hook (`POST /internal/revalidate` on the web app) keeps its own secret header (ADR-006).
- **Public media** has its own per-IP limit (600 / minute — API-LIM-01) and requests with a valid staff session are not IP-limited (staff phones share the shop's Wi-Fi address).

## Options Considered

### Option A: Same origin, `/api` path routing per host (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — two Caddy site blocks |
| Cost | None |
| Scalability | Unchanged (Caddy proxies either way) |
| Team familiarity | High |

**Pros:** no CORS / preflight; host-only cookie; one TLS cert per host; relative API URLs in the clients (`/api/v1`), so the same build runs in Capacitor / Tauri (which load the hosted origin) without env juggling.
**Cons:** the API must carry the `/api` prefix (one config line); API and web share a host so a misrouted path returns a Next.js 404 instead of an API 404 — only matters when debugging.

### Option B: `api.<domain>` subdomain + CORS + cookie `Domain=.<domain>`
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — CORS allow-list, credentials mode, preflight caching, cookie domain |
| Cost | None |
| Scalability | Same |
| Team familiarity | High |

**Pros:** clean separation of "API host"; easy to point external clients at it later.
**Cons:** cookie scoped to the whole domain → the public site (and any future subdomain) receives the staff cookie; every non-simple request costs an `OPTIONS` preflight on 4G; CORS misconfiguration is a classic security bug; Capacitor WebView origin handling needs extra care.

### Option C: Next.js `rewrites` proxying `/api/*` to the API
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | Extra hop through the Node web server for every API call |
| Scalability | Web container becomes a bottleneck for POS traffic |
| Team familiarity | High |

**Pros:** same-origin without touching Caddy.
**Cons:** every POS request passes through Next.js (latency, failure coupling); WebSocket proxying through Next is awkward; Caddy already does this job better.

### Option D: Single host for everything (`<domain>/app/...` for staff)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | None |
| Scalability | Same |
| Team familiarity | High |

**Pros:** one cert, one host.
**Cons:** the staff cookie would be sent to public pages too; the two route groups share a Next.js base path (PWA scope / manifest conflicts); public SEO and staff app lifecycles (service worker) interfere.

## Trade-off Analysis
- **Security:** A keeps the staff session confined to the staff host and removes CORS as a failure mode; B widens cookie scope by design.
- **Performance on 4G:** A removes preflights (saving one round-trip on most POS writes); C adds a hop.
- **Future external clients:** none planned in V1; if needed, an `api.` host can be added later in Caddy pointing at the same container — A does not preclude B.

## Consequences
- Easier: client config (relative URLs), cookie handling, Capacitor / Tauri shells, local dev (one `localhost:3000` with the same path layout via Caddy or a dev proxy).
- Harder: nothing material; developers must remember the `/api` prefix exists only at the edge (docs use `/v1/…`).
- Revisit when: a third-party integration needs its own host / CORS (add `api.` then), or a CDN is put in front of the public site (path routing stays valid).

## Action Items
1. [ ] Caddyfile: two site blocks — `app.<domain>`: `/api/v1/internal/*` → 404, `/internal/*` → 404, `/api/*` + `/rt*` → `api:3001`, fallback → `web:3000`; `<domain>`: `/api/v1/public/*`, `/api/v1/health`, `/api/v1/system/status` → `api:3001`, other `/api/*` and `/internal/*` → 404, fallback → `web:3000`; HTTPS automatic; security headers. Integration test that hits each blocked path from outside. **02/Oct:** request-body cap on `app.<domain>` (`system.upload_max_mb` + 1 MB); strip inbound `X-Internal-Key` on both hosts; CSP `img-src` / `connect-src` include the bucket host (ADR-014); test that `/api/v1/public/media/…` answers on both hosts and that an outside request carrying `X-Internal-Key` is still rate-limited; test that `INTERNAL_SSR_KEY` is refused on `/api/v1/internal/*` (401) and that `INTERNAL_OPS_KEY` is absent from the web container's environment.
2. [x] NestJS `setGlobalPrefix('api')`; OpenAPI `servers: [{ url: '/api/v1' }]` (Part 1 v1.2); Part 0 API-SHAPE-01 / API-AUTH-01 / API-AUTH-02 updated in v1.2 (host-only cookie, app-host Origin, edge rules).
3. [ ] Web clients: `NEXT_PUBLIC_API_BASE=/api/v1` (relative); SSR fetches use the internal `http://api:3001/api/v1` base.
4. [ ] CORS middleware not registered; test that a cross-origin request with the cookie is rejected (ADR-005 Origin check), that `<domain>/api/v1/auth/*` returns 404 at the edge, and that the public site never sets or receives `point_session`.
5. [ ] Dev setup: Caddy in `docker-compose.dev.yml` so local and production routing match.
