# ADR-006: Public website = Next.js server rendering + tag-based revalidation from the same database

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #12 "SSR + tag-based cache + transactional revalidation — OK"; REC-35 → 🔒; implements 🔒 D-WEB-01 "admin change appears immediately"). *Was:* Proposed. **Amendment note 02/Oct/2026** (API Part 8): `server_time` + "open now" in the browser, `barbers` revalidated on assignment changes, SSR calls exempt from the per-IP limit via Docker network + `X-Internal-Key`, stable media path, public API `max-age=10` (fix-up 02/Oct — ≤ the ~10 s freshness target) — see *Amendment* under Decision. **Review fixes 02/Oct (R3-8 / R3-13 / R3-29):** public media = `Cache-Control: public, max-age=86400` + `ETag` (not one-year immutable) with its own rate limit; the SSR header carries `INTERNAL_SSR_KEY`, a secret separate from the internal-endpoint key.
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — Website (`<domain>`) က admin panel နဲ့ **DB တစ်ခုတည်း** ကို ဖတ်တယ် — data ကူးထားတာ မရှိ (CMS သီးသန့် မရှိ)။ Page တွေကို server မှာ ကြိုတင် render ပြီး cache ထားလို့ မြန်တယ် + Google / Facebook / Viber preview ပေါ်တယ်။ Admin က လိပ်စာ / ဖွင့်ချိန် / ဈေး ပြင်လိုက်ရင် API က "ဒီ page ပြန် render" (revalidate) လို့ ချက်ချင်း ပြော → D-WEB-01 "ချက်ချင်း ပေါ်" ဖြစ်။ Booking modal ထဲက slot ကိုတော့ **ဘယ်တော့မှ cache မလုပ်** (double booking မဖြစ်အောင်)။

## Context
- 🔒 D-WEB-01: changes in the admin panel (address, hours, prices, barbers) appear on the website immediately; website reads the same DB (Part 8 columns: `is_public`, `show_on_website`, `public_profile`, `branch_opening_hours`, `branch_closures`, `settings site.*`); toggles default OFF (01/Oct).
- P1 brief / review §5.2: the site must be found on Google and show link previews when shared on Facebook / Viber → server-rendered HTML with Open Graph tags (FE-SEO-*).
- 🔒 D-UX-05: booking is a modal on the same pages; availability must be exact (🔒 D-BKG-08) and is served by the public API.
- Load: tens of visits / day today; design headroom 10k page views / day (system-design §1.3). A single VPS serves both site and API.
- Review §5.2: no business logic in Next.js — the site reads through the NestJS public API (`/v1/public/*`), never the DB directly.

## Decision
Render the public pages (`/`, `/branches/[code]`, `/book` entry, `/booking/[token]`) in the Next.js `site/` tree (ADR-001) with the **server-side data cache**, keyed by tags (`site`, `home`, `branch:<code>`, `barbers`, `services`) and a 5-minute time-based fallback. The caching API is written against the **pinned Next.js major** (ADR-001): in Next.js 16 that is `'use cache'` + `cacheTag()` / `cacheLife()` (requires `cacheComponents: true` in `next.config`) with on-demand `revalidateTag(tag, profile)` (second argument per the Next 16 API); in 14 / 15 it was `fetch(..., { next: { tags, revalidate } })` and `revalidateTag(tag)`. The cache directory (`.next/cache`) is on a Docker volume so a redeploy does not empty it. Page data comes from `GET /v1/public/site`, `/branches`, `/branches/{code}`, `/barbers` (public DTOs only — API-PUB-01; services and prices arrive inside the site / branch payloads). Every admin write that touches website data enqueues the job `site.revalidate { tags }` in the same transaction (event `site.content_changed` — ADR-002); the job calls `POST http://web:3000/internal/revalidate` (Docker network only, secret header; Caddy answers 404 for `/internal/*` from outside — ADR-009), which runs `revalidateTag()` for those tags, and clears the API's 60-second booking-options cache for the affected branches. **Availability and booking endpoints are never cached** (`Cache-Control: no-store`). The manage page `/booking/[token]` is rendered per request (dynamic, no cache, no index).

### Amendment (02/Oct/2026 — API Part 8 P8-RULE-04 / 11 / 12 / 13, 🔒 D-API-09)
*The decision above is unchanged; Part 8 fixed these details.*
- **"Open now" is computed in the browser.** `GET /v1/public/site` (and the branch payloads) return **`server_time`** (MMT), `hours`, closures (current + starting within 60 days) and `site_origin` — **no "open now" string**. The page computes "Open now / Closed" client-side from those (FE-BR-02), so a cached page can never show a stale status, and no revalidation is needed when a shop opens or closes.
- **`barbers` tag** is revalidated nightly after `shifts.generate` (00:30 — ADR-002) **and on every shift, branch-assignment or public-profile change** (P8-RULE-13 — `today_branches[]` on the barber cards depends on today's shifts and assignments). Closures and opening hours revalidate `home` + `branch:<code>` and also emit `schedule.changed`; site content (`site.*` settings, written with `website.update`) revalidates `site` + `home` (+ `barbers` / every `branch:<code>` when `site.show_barbers` / `site.show_prices` change).
- **SSR calls are exempt from the per-IP limit:** the web container calls `http://api:3001/api/v1/public/*` over the Docker network with the **`X-Internal-Key`** header carrying **`INTERNAL_SSR_KEY`**; such calls skip the public per-IP rate limit (API-LIM-01 amendment) — otherwise every server render would share one IP and the site would throttle itself. The key lives only in the server `.env` of both containers and never reaches a browser; external requests can't carry it (Caddy strips the header — ADR-009 amendment). **It is not the key of `/v1/internal/*`** (review fix 02/Oct — R3-13): the backup-run endpoints accept only `INTERNAL_OPS_KEY`, which the internet-facing web container never holds, so a compromised web container cannot write backup or restore rows.
- **Images** on the site use the stable public media path `/api/v1/public/media/<id>/<w400|w800|w1600|original>` (ADR-014 — `Cache-Control: public, max-age=86400` + `ETag`; a new upload = a new id, so no image purge is ever needed, and a photo whose public flag is switched off leaves browsers within a day — review fix 02/Oct, R3-29). Browsers fetch images directly, so the media path has its **own rate limit, 600 / minute / IP** (API-LIM-01 — R3-8). Open Graph images use `SITE_ORIGIN` + that path.
- **Public API `Cache-Control` (fix-up 02/Oct):** `GET /v1/public/site`, `/branches`, `/branches/{code}`, `/barbers` answer `Cache-Control: public, max-age=10` (P8-RULE-13 — was 60), so no browser or proxy copy outlives the "visible within ~10 s" target of this ADR (Consequences, action item 5). The SSR behaviour is unchanged: the Next.js data cache follows its tags + `site.revalidate` + 5-minute fallback and ignores this header; availability / booking stay `no-store`; media: one day + `ETag` (ADR-014).
- **`site.domain` setting dropped** — the site origin is the server's `.env` `SITE_ORIGIN` (one-sheet clean-up note "`site.domain` setting ဖြုတ် (= .env)", cross-part contract 16), used for canonical / Open Graph / booking-QR URLs.

## Options Considered

### Option A: SSR + tag cache + on-demand revalidation (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–Medium — tags on fetches, one internal endpoint, one job |
| Cost | None (same containers) |
| Scalability | Cached HTML serves 10k+ views / day on the VPS without touching the DB |
| Team familiarity | Medium (Next.js App Router caching semantics need care) |

**Pros:** SEO + link previews; "immediate" updates (seconds) without a rebuild; resilient on the time-based path — while a page is within its 5-minute window it serves from cache even if the API is briefly down (after an on-demand purge the next request must re-render, so that case is not covered); no second copy of the data.
**Cons:** cache semantics must be tested (stale page after a change = a bug report from the owner); revalidate endpoint must be protected; the time fallback masks a lost revalidate by ≤ 5 min.

### Option B: SSR with no cache (render on every request)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | Every view hits the API + DB |
| Scalability | Fine at tens of views / day, poor if a post goes viral |
| Team familiarity | High |

**Pros:** always fresh; nothing to invalidate.
**Cons:** a viral Facebook post (the shop's main channel) turns into DB load on the same box that runs the POS; slower LCP on 4G (FE-PERF-01).

### Option C: Static export rebuilt on each change (CI)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — build pipeline triggered by the API |
| Cost | Build minutes per change |
| Scalability | Excellent (static files) |
| Team familiarity | Medium |

**Pros:** cheapest to serve; can live on a CDN.
**Cons:** minutes of delay per change — fails D-WEB-01 "immediately"; booking modal still needs a live API; two deploy pipelines.

### Option D: Separate CMS (WordPress / headless) with content copied from the admin
| Dimension | Assessment |
|-----------|------------|
| Complexity | High — sync job, two sources of truth |
| Cost | Another service to host and secure |
| Scalability | Fine |
| Team familiarity | Medium |

**Pros:** rich page editing.
**Cons:** data duplication (prices, hours, barbers) drifts — exactly what the owner wants to avoid ("ပြင်တာနဲ့ ချက်ချင်း ပေါ်"); more handover surface; the owner edits in one admin panel already.

### Option E: Client-side SPA fetching the public API
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | None |
| Scalability | Good |
| Team familiarity | High |

**Pros:** simplest front end.
**Cons:** no server-rendered OG tags → no link previews on Facebook / Viber; weaker SEO; slower first paint on 4G.

## Trade-off Analysis
- **Freshness vs. serving cost.** A gives "fresh within seconds" at near-static serving cost; B is fresh at the cost of coupling website traffic to POS DB load; C is cheap but not immediate.
- **One source of truth.** A, B, E read the live DB through the API; C and D introduce copies. The owner's requirement and the honesty rules (prices shown = prices charged, FE-COPY-03) favour one source.
- **Correctness boundary.** Caching is applied only to presentational data; anything that can cause a wrong booking (availability, prices inside the modal — 60 s API cache only, D-SVC-08 effective-dated) stays live.

## Consequences
- Easier: fast site, SEO, previews; admin edits propagate without developer involvement; the site rides out short API hiccups within the time-based window.
- Harder: cache tags must be assigned carefully per fetch; a test must prove "change hours in admin → branch page updated within 10 s"; the revalidate endpoint is an internal attack surface (secret + Caddy restriction to the API container).
- Revisit when: a CDN is wanted (then move the cache to the CDN with the same tags / purge), or multi-company sites (D-ORG-03) need per-company domains.

## Action Items
1. [ ] `site/` data loaders written against the pinned Next.js major (16: `cacheComponents: true`, `'use cache'` + `cacheTag(...)` + `cacheLife('minutes')`, `revalidateTag(tag, 'max')`; 14 / 15: `fetch` with `next: { tags, revalidate: 300 }`); `generateMetadata` for OG / Twitter tags (FE-SEO-01..03, TikTok link in social — FE-SEO-02); `.next/cache` volume in Compose.
2. [ ] `POST /internal/revalidate` route handler in the web app: secret header from `.env`, body `{ tags: string[] }`, reachable only from the API container over the Docker network (Caddy returns 404 for `/internal/*`); no other route handlers under `/api` in the web app.
3. [ ] `site.revalidate` job (enqueued transactionally by `SiteContentService.touch(tags)`) + list of writes that call it (company, branches, hours, closures, services, prices, employee public fields / rating, settings `site.*`; **02/Oct:** + shift writes and branch-assignment changes → `barbers`, image replacements, P8.WEB.12 manual revalidate); the job also clears the booking-options cache for the branch.
4. [ ] Public endpoints `/v1/public/site`, `/branches`, `/branches/{code}`, `/barbers` with public DTOs (API-PUB-01); availability `no-store`.
5. [ ] E2E test: edit opening hours → branch page reflects within 10 s; toggle `site.show_prices` OFF → prices disappear from info pages but remain in the booking modal (OPEN-35 rule).
