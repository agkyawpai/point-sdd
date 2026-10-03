# ADR-005: Opaque server-side sessions in an HttpOnly cookie (not JWT) + CSRF by custom header and Origin check

**Status:** Accepted — session model since 29/Sep (🔒 D-AUTH-06, REC-05); **CSRF (header + Origin) and the Android / iOS Google sign-in hand-off accepted by the owner 01/Oct/2026 21:20** (decision sheet #11 — "CSRF protection — OK", "Android/iOS Google login hand-off flow — OK"); locked with 🔒 D-API-01 / 02 (API-AUTH-02, P1.AUTH.03/04/06).
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — Login ဝင်ပြီးရင် server က session တစ်ခု ဖန်တီးပြီး ID ကို HttpOnly cookie ထဲ ထည့်ပေး (JWT မသုံး)။ Request တိုင်း DB က session + user status ကို စစ်လို့ admin က device ဖြုတ် / ဝန်ထမ်း ထွက် = **ချက်ချင်း** ထွက်သွား (D-AUTH-06 🔒)။ Cookie သုံးရင် CSRF (တခြား website က barber ရဲ့ browser ကို အသုံးချတာ) ကို ကာရမယ် — app က header `X-Requested-With: point-app` ထည့်ပို့မှ + Origin စစ်မှ လက်ခံ။ ADR-009 (origin တစ်ခုတည်း) နဲ့ ပေါင်းရင် ပိုလုံခြုံ။ **Android app / iPhone PWA ထဲက Google login:** Google က app ထဲ browser (WebView) ကနေ login ကို လက်မခံဘူး → ဖုန်းရဲ့ browser မှာ Google login ဖွင့်ပြီး app က ကိုယ့်မှာ ကိုင်ထားတဲ့ **တစ်ခါသုံး verifier** နဲ့ server ကို ပြန်မေး (hand-off poll) → cookie က app ထဲ ရောက် (browser ဘယ်မှာ ရပ်သွားသွား မမူ)။ Email OTP login က ဒီပြဿနာ မရှိ။

## Context
- 🔒 D-AUTH-06: stay signed in, no idle timeout; server-side session; token in an HttpOnly cookie, hashed at rest; every request checks session + `users.status` + `employees.status`, so revoke / resignation logs out immediately. 🔒 D-AUTH-03 / 05: device list and revoke, login events in audit.
- Passwordless login (🔒 D-AUTH-01: Google OIDC or e-mail OTP) — the session is the only credential after login.
- Clients: Next.js PWA in Chrome / Safari (iOS Home-Screen PWA has its own cookie jar — review §5.7), Capacitor WebView, Tauri WebView2. All support cookies; only some support reliable `localStorage` persistence (iOS evicts). Google OIDC cannot run inside an embedded WebView (Google blocks it), which forces a system-browser round-trip for the shells (🔒 D-AUTH-01 + 🔒 D-PLT-01 / 10 make this case mandatory).
- Cookie-authenticated APIs need CSRF protection; the public API (`/v1/public`) has no cookie and no CSRF surface.

## Decision
1. **Session = opaque random id** (32 bytes) in cookie `point_session` (`HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=34560000` — 400 days, the browser cap, re-issued on the first request after the cookie is 30 days old so "stay signed in" really is indefinite — API-AUTH-01; **no `Domain` attribute** → host-only for `app.<domain>`), stored as `sha256` in `user_sessions` (🔒 D-DB-05, Part 1b) with device label, `last_seen_at`, `revoked_at`. Session row read on every request through a small indexed lookup joined with user / employee status; grants and branch scope recomputed per request (3 small tables) — no cache at this scale.
2. **CSRF:** every state-changing staff request must carry `X-Requested-With: point-app` **and** an `Origin` (or `Referer`) matching the app host; otherwise 403 `error.csrf`. With ADR-009 (same origin, CORS disabled) a cross-site page cannot send the header at all. `SameSite=Lax` adds defence in depth; `Strict` is avoided because Google OIDC's redirect back would drop the cookie on the first navigation.
3. **No JWT.** Revocation must be instant and sessions long-lived — the JWT model (short access + refresh token) adds complexity without meeting D-AUTH-06 better.
4. **Google sign-in inside the Android shell and the iOS Home-Screen PWA = system-browser flow + verifier / challenge hand-off polled by the app** (P1.AUTH.03 `client=shell|pwa`, P1.AUTH.04, P1.AUTH.06). Google refuses OAuth from embedded WebViews (`disallowed_useragent`), and a cookie set during a system-browser login lands in *that* browser's jar, not the WebView's. So (PKCE-style, **pull not push** — the app never depends on where the browser's redirect lands): the app generates a 32-byte **verifier** (memory only) and opens `/v1/auth/google/start?client=shell|pwa&challenge=sha256(verifier)` in the system browser (Android: Custom Tabs via `@capacitor/browser`; iOS PWA: the in-app Safari sheet). The callback creates the `user_sessions` row **without a cookie**, parks it under the challenge in an in-process hand-off store (5-minute TTL, single use — no DB change; move to a table if a second API instance ever exists) and sends the browser to a "return to the app" page (`point://auth/handoff?done=1` — a deep link that closes Custom Tabs; or `https://app.<domain>/auth/handoff?done=1` for the PWA, which only says "go back to the app" because on iOS it may render inside the Safari sheet, whose cookie jar is not the PWA's). Meanwhile the app **polls** `POST /v1/auth/handoff { verifier }` every 2 s (max 5 min), and immediately on the deep link (`shell.onDeepLink` from Capacitor's `appUrlOpen`) or on regaining visibility; the server hashes the verifier, finds the parked session, consumes it and sets the cookie — in the jar of the app that made the call, which is the only jar that matters. 202 `pending` until the flow finishes, 401 `handoff_invalid` after expiry / reuse. Secrets never travel in URLs (the challenge is a hash). OTP login needs no hand-off and remains the documented fallback if a device fails the test in Action 3b. Plain browsers keep the direct redirect (`client=web`).

## Options Considered

### Option A: Opaque server session + HttpOnly cookie (chosen — 🔒)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — one table, one guard |
| Cost | One indexed read per request (sub-ms) |
| Scalability | Fine to thousands of users; shared DB means it works across API instances |
| Team familiarity | High |

**Pros:** instant revoke; nothing secret in the client beyond the cookie; survives iOS storage eviction better than token storage; simple to audit (`user_sessions` rows = devices).
**Cons:** DB hit per request (negligible); requires CSRF protection.

### Option B: JWT access token (15 min) + refresh token
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — key rotation, refresh flow, revocation list |
| Cost | Low |
| Scalability | Stateless verification |
| Team familiarity | High |

**Pros:** no DB read for most requests; standard libraries.
**Cons:** revoke is delayed up to the access-token lifetime unless a denylist is checked anyway (which reintroduces the DB read); refresh tokens in `localStorage` are XSS-exposed and evicted on iOS; more code paths for a benefit this system does not need.

### Option C: JWT with per-request denylist / version check
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | DB read per request (same as A) |
| Scalability | Same as A |
| Team familiarity | Medium |

**Pros:** claims in the token.
**Cons:** all the cost of A plus JWT handling; no advantage.

### CSRF sub-options
| Option | Assessment |
| --- | --- |
| (i) Custom header + Origin check (chosen) | Simple; no token to render into pages; works for every fetch (the Socket.IO handshake uses cookie + `Origin` + `auth.client` instead, since a WebSocket upgrade cannot carry the header — ADR-008); blocked for cross-site forms |
| (ii) Double-submit cookie token | Works, but needs the token readable by JS (non-HttpOnly cookie) and threaded through every form |
| (iii) `SameSite=Strict` only | Breaks the Google OIDC return and link-opening from Viber; relies on one browser feature |

## Trade-off Analysis
- **Instant revoke vs. statelessness.** The owner chose instant revoke (D-AUTH-06); a stateful session is the direct implementation. Statelessness buys nothing on a single VPS.
- **Cookie vs. bearer token in WebViews.** Capacitor / Tauri / iOS PWA all persist cookies; bearer tokens would need per-platform secure storage. Cookies keep one code path — the risk moves to CSRF, which (i) + ADR-009 closes.
- **Lax vs. Strict.** Lax permits the top-level GET navigation after Google login and from shared links; state-changing requests are still protected by the header rule.

## Consequences
- Easier: device management UI (P1.ME.sessions, P1.EMP.sessions), instant lockout on status change, one cookie path for all platforms.
- Harder: every HTTP client (fetch wrapper, Capacitor bridge) must send the header; the Socket.IO handshake is checked by cookie + `Origin` only (a WebSocket upgrade cannot carry custom headers — ADR-008); the hand-off flow adds one endpoint and a deep link to test on real devices; tests must cover missing header / wrong origin → 403.
- Revisit when: a third-party client (not our web app) needs API access — then add API keys or OAuth for that client only; or if a second company needs SSO.

## Action Items
1. [ ] `SessionGuard` (session lookup + status checks + `last_seen_at` throttle 5 min) and `CsrfGuard` (header + Origin) registered globally for `/v1`; `@Public()` for `/v1/public`, `@Internal()` for jobs.
2. [ ] Cookie options in one config; `Secure` enforced in production; host-only cookie per ADR-009.
3. [ ] Socket.IO handshake: cookie + `Origin` check + `auth: { client: 'point-app' }` (ADR-008).
3b. [ ] Hand-off flow (P1.AUTH.03/04/06): verifier / challenge helpers in `packages/shared`, in-process parked-session store with TTL, polling hook `useGoogleHandoff()`, `point://auth/handoff` deep link + `appUrlOpen` → `shell.onDeepLink` in the Capacitor app, `/auth/handoff` "return to the app" page in the staff tree; **device tests are the gate**: Android (Custom Tabs → deep link → cookie in WebView) and iOS standalone PWA (sheet → close → poll succeeds); if a device fails, OTP is the fallback for it.
4. [ ] Tests: revoke → next request 401; employee status 2 → 401; missing header → 403; cross-origin `Origin` → 403.
5. [ ] iOS PWA: verify the Home-Screen cookie jar survives relaunch on 2 devices (review §5.7).
