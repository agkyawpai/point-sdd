# ADR-004: Booking-create idempotency — client-generated manage token (no new DB column)

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #1 = default A, "အကုန် OK"; locked with 🔒 D-API-01 — API-IDEM-03). DB stays at Part 3 v3. *Was:* Proposed — recommended option A; answered the owner's question "server မှာ သိမ်းတာနဲ့ DB မှာ သိမ်းတာ ဘယ်ဟာ ပိုကောင်းလဲ" (01/Oct 11:54).
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — Booking တင်တဲ့အချိန် net ပြတ်ပြီး reply မရောက်ရင် customer / staff က ထပ်နှိပ်မယ်။ အဲ့ဒီအခါ "slot ယူပြီးသား" error မထွက်ဘဲ **မူလ booking ကိုပဲ ပြန်ရ** ရမယ် — ဒါ idempotency။
> **Owner မေးခွန်းရဲ့ အဖြေ:** ၂ နည်းလုံးက server ကပဲ စစ်တယ်၊ DB ထဲမှာပဲ သိမ်းတယ် — ကွာတာက **(A) browser / app က manage token ကို ကိုယ်တိုင် ထုတ်ပြီး ပို့** (server က hash ပဲ သိမ်း — DB column အသစ် မလို) နဲ့ **(B) DB မှာ `client_request_id` column အသစ် ထည့်ပြီး server က token ထုတ်** ပဲ။ **A ကို အကြံပြုတယ်** — ဘာကြောင့်လဲဆိုတော့ reply ပျောက်သွားတဲ့ case မှာ B က customer ရဲ့ manage link (တစ်ခါပဲ ပြနိုင်တဲ့ link — D-BKG-11) ကို ပြန်ပေးလို့ မရတော့ဘူး (server က hash ပဲ ရှိ)၊ A ကတော့ token က client လက်ထဲ ရှိနေလို့ link ပါ ပြန်ရတယ်။ DB ကိုလည်း မပြင်ရ (Part 3 v3 အတိုင်း)။

## Context
- `bookings` has no `client_request_id` — D-VIS-10 covers money rows only (visits / sales / payments / refunds / cash-outs / returns). Booking create is the one customer-facing write that is retried over flaky 4G (FE-BK-11, AD-BKG-02).
- 🔒 D-BKG-11 / D-CUS-05: the customer's only record is the **manage link** (`/booking/[token]`); the DB stores only `manage_token_hash` (unique); the token is shown once (FE-CONF-02). No SMS / e-mail.
- 🔒 D-BKG-08: double booking is prevented by a DB exclusion constraint; 🔒 D-BKG-09: one active public booking per phone. Without idempotency a retry after a lost reply hits `slot_taken` / `active_booking_exists`, and the customer never sees the link.
- Both options are enforced server-side and persisted in PostgreSQL; "server vs DB" is really "who generates the token, and is a new column needed".

## Decision
**Option A.** The client generates the manage token (32 random bytes from `crypto.getRandomValues`, base64url, 43 chars) and sends it in `POST /v1/public/bookings` / `POST /v1/bookings` as `manage_token`. The server validates length / alphabet, computes `sha256(token)`, and inserts the booking with `manage_token_hash`. If the hash already exists: compare the identifying fields (branch, barber, start time, phone) — equal → **200 with the existing booking, including `manage_url`** (the API builds the link from the raw token it just received — on the first response and on every replay) and the header `Idempotent-Replayed: true`; different → **422 `error.idempotency_mismatch`** (API-IDEM-02). The client keeps the token across retries (in memory + `sessionStorage` for the public modal; the staff app in its mutation queue), so a lost reply never loses the link. Token never logged; the DB stays at Part 3 v3.

## Options Considered

### Option A: Client-generated manage token, hash stored (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — reuses `manage_token_hash` unique; ~30 lines server, ~10 lines client |
| Cost | None; no migration |
| Scalability | Same as today (one unique index) |
| Team familiarity | High (same pattern as `client_request_id`) |

**Pros:** one mechanism gives both idempotency and the one-time link on replay; no DB change; works identically for public and staff bookings.
**Cons:** token entropy depends on the client's CSPRNG (every modern browser / WebView has one; server rejects malformed tokens); a malicious client can only weaken the secret of *its own* booking.

### Option B: New column `bookings.client_request_id` + server-generated token (Part 3 v3.1)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–Medium — migration + version bump, second unique index |
| Cost | DB Part 3 lock → v3.1 (register update) |
| Scalability | Same |
| Team familiarity | High |

**Pros:** symmetric with the money tables (D-VIS-10); token generated with server entropy.
**Cons:** on a replay the server holds only `manage_token_hash`, so it **cannot return the link** — the exact failure idempotency is meant to fix; would need to return the raw token in the first response only and tell the customer "call the branch" on replay; schema change for no functional gain.

### Option C: Generic idempotency store (table of `Idempotency-Key` → stored response)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — new table, response serialisation, TTL cleanup |
| Cost | New table (Part 8 v1.1) |
| Scalability | Fine |
| Team familiarity | Medium |

**Pros:** works for any endpoint without per-table columns.
**Cons:** storing the response means storing the **raw manage token** — breaks D-BKG-11 "hash only"; duplicates what row-level `client_request_id` already does for money; more moving parts.

### Option D: No idempotency; client recovers by lookup
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | None |
| Scalability | n/a |
| Team familiarity | High |

**Pros:** nothing to build.
**Cons:** retry → `slot_taken`; the customer has no manage link and no account to look it up (D-CUS-04); support burden lands on staff.

## Trade-off Analysis
- **Who holds the secret.** The manage token must exist in exactly one place after creation: the customer's device (D-BKG-11). Only A keeps that true *and* survives a lost reply, because the device already had the token before the request.
- **Entropy source.** Browser CSPRNG is the same primitive the server would use; the server enforces format, and rate limits (D-BKG-21) make guessing infeasible either way.
- **Consistency with D-VIS-10.** B looks "more consistent" but solves the wrong problem; A is documented as the booking-specific variant of the same convention (API-IDEM-03).

## Consequences
- Easier: retries on 4G are safe for both public and staff bookings; confirmation page always has the link; no Part 3 migration.
- Harder: client code must generate and retain the token until success (small, but must be in the shared booking submit hook so the modal, the staff screen and the Capacitor shell behave the same).
- Revisit when: an outbox / generic idempotency layer is introduced for other reasons (not foreseen), or customer accounts arrive (V2) and the link stops being the only record.

## Action Items
1. [x] Owner "OK" (01/Oct 21:20) → API-IDEM-03 🔒 (Part 0 v1.3, D-API-01); Part 3 spec builds on it.
2. [ ] `packages/shared`: `manageTokenSchema` (base64url, 43 chars) + `createManageToken()`; booking create DTOs include `manage_token`.
3. [ ] API Part 3: insert path with hash lookup, replay 200 + `manage_url` + `Idempotent-Replayed`, mismatch 422; never log the token; tests: lost reply, mismatch (422), token reuse with other identifying fields (422), malformed token (400).
4. [ ] Web: `useSubmitBooking()` keeps the token across retries (FE-BK-11 / AD-BKG-02 timeout → "checking whether it was saved" → replay).
