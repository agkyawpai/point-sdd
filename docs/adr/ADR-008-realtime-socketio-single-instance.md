# ADR-008: Realtime = Socket.IO gateway on a single API instance (no Redis adapter in V1)

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #14 = default, "အကုန် OK"; review §5.2 ✅ Socket.IO; implements 🔒 D-NTF-01 in-app realtime; locked with 🔒 D-API-01). *Was:* Proposed. **Amendment note 02/Oct/2026** (API Parts 4–8): user rooms for attendance / payroll / payslip / private-row events, no amounts in payloads — see *Amendment* under Decision; **reconciled 02/Oct** — Parts 4 / 5 (and Part 6 `stock.purchase_posted`) payloads made ids-only, action item 6 test unconditional.
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — Notification (bell), Today list ပြောင်းတာ, booking အသစ် ရောက်တာ, setting / role ပြောင်းတာ ကို phone တွေဆီ **ချက်ချင်း** ပို့ဖို့ Socket.IO သုံးမယ် (API process ထဲမှာပဲ)။ Phone ≤ ၂၀ လုံးပဲ ချိတ်မှာမို့ Redis adapter မလို။ Net ပြတ်ပြီး ပြန်ချိတ်ရင် app က data ကို ပြန်ဆွဲ (refetch) လို့ event တစ်ခု လွတ်သွားလည်း data မမှား။ API instance ၂ ခု ဖြစ်မှ adapter ထည့်။

## Context
- 🔒 D-NTF-01: in-app realtime notifications only (bell, unread count, deep link); no SMS / push in V1. AD-TODAY-04: the barber's Today list and a booked barber's phone update live; AD-PERM / D-ROLE-06: role changes take effect immediately (`session.updated`).
- Event catalogue and rooms are defined in API Part 0 §8: rooms `user:<id>`, `branch:<id>`, `company`; events such as `visit.started`, `sale.finished`, `booking.created`, `notification.created`, `settings.changed`, `session.updated` / `session.revoked`.
- Scale: ≤ 20 concurrent connections (system-design §1.3), one API container (ADR-001). Phones on 4G drop and reconnect often; iOS PWA suspends sockets in the background.
- Cookie session (ADR-005) must authenticate the socket handshake; a WebSocket upgrade cannot carry the `X-Requested-With` header, so the handshake is checked by cookie + `Origin` + an `auth.client` payload instead.

## Decision
Run a **Socket.IO gateway inside the NestJS process** with Engine.IO **`path: '/rt'`** and the default namespace (a Socket.IO *namespace* would keep the HTTP path at `/socket.io/`, which Caddy routes to Next.js — API-RT-01), routed by Caddy to the API container with WebSocket upgrade (ADR-009), **in-memory adapter**. Handshake: cookie `point_session` + `Origin` check + `auth: { client: 'point-app' }` (a WebSocket upgrade cannot carry the `X-Requested-With` header — ADR-005); on connect the server joins the socket to `user:<id>`, every `branch:<id>` in the user's **read scope** (active branch assignments ∪ branches covered by any grant — P1-RULE-05 / API-RT-01, so a barber with no permission code still gets their branches' events), and `company` only for users holding a company-scope grant. Domain events emitted after commit (ADR-002 event rule) are fanned out by an `RealtimePublisher` to the right rooms with **minimal payloads** (ids + status), and clients **refetch** the affected TanStack Query keys (AD-PERF-03). Clients also refetch on reconnect and on window focus, so a missed event never leaves stale data. Server-side rate: `visit.*` / `sale.*` events for one branch are coalesced to at most one emit per second per branch.

### Amendment (02/Oct/2026 — API Parts 4–8, 🔒 D-API-05..09 · ADR-012 Amendment 1)
*The decision above is unchanged; Parts 4–8 added a room rule.* **Events about private or person-sensitive data go to `user:` rooms of the recipients computed at emit time — never to a `branch:` or the `company` room** (barbers sit in their branch rooms; the `company` room holds anyone with *any* company-scope grant):

| Events | Room(s) | Part |
| --- | --- | --- |
| `attendance.clocked` · `attendance.exception_detected` · `attendance.exception_resolved` | `user:` of the employee + `user:` of the `attendance.view` / `attendance.resolve` holders covering the branch (colleagues don't see each other's lateness) | 5 |
| `payroll.run_updated` · `receivable.changed` | `user:` of company-scope `payroll.*` holders (+ the employee for `receivable.changed`) — private (ADR-012 A1) | 5 |
| `payslip.published` · `payslip.revised` | `user:` of each employee with an entry | 5 |
| `expense.updated` of a SALARY / payroll row | `user:` of company-scope `payroll.*` holders; company-wide rows → `company`; branch rows → `branch:` | 7 |
| `export.ready` · `import.updated` · `backup.run_updated` · `notification.created` / `updated` / `read_all` | `user:` of the requester / creator / company-scope `backup.view` holders / the recipient | 8 |
| `booking.noshow_alarm` · `booking.noshow_snoozed` | `user:` rooms only — booked barber + computed branch managers (P3-RULE-08) | 3 |
| `discount_request.created` / `decided` / `cancelled` | `branch:` + `user:` of the computed approvers / the requester | 4 |

**No amounts in payloads** stays the rule (Consequences: "ids only, then an authorised refetch"); Part 5 `payroll.run_updated` and Part 7 P7-RULE-19 state it explicitly. **Reconciled 02/Oct: Parts 4 / 5 payloads made ids-only** — `sale.updated` (`{ sale_id, visit_id?, change }`), `sale.finished`, `refund.created` (Part 4 §10) and `receivable.changed` (Part 5 §15) no longer carry `*_amount` fields; the same sweep removed `total_amount` from Part 6 `stock.purchase_posted`. The rule applies to **every** event (API Part 0 API-RT-02): clients refetch the authorised resource for totals / balances.

## Options Considered

### Option A: Socket.IO, single instance, in-memory adapter (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — `@nestjs/platform-socket.io` gateway |
| Cost | None |
| Scalability | Thousands of sockets on one process; across instances needs an adapter |
| Team familiarity | High (Socket.IO is in the owner's brief, review §5.2 ✅) |

**Pros:** rooms, reconnection with backoff, fallback to long-polling behind strict proxies, built-in heartbeats; same auth as HTTP.
**Cons:** state is per process → a second instance needs the Redis (or Postgres) adapter; sticky connections during deploys drop and reconnect (acceptable — clients refetch).

### Option B: Server-Sent Events (SSE)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | None |
| Scalability | Similar |
| Team familiarity | Medium |

**Pros:** plain HTTP, works through any proxy, simple server.
**Cons:** no rooms / ack / bidirectional channel (fine for V1, but typing-style signals in V2 would need HTTP); reconnection semantics hand-rolled; iOS background behaviour similar. (The old "6 connections per host" limit does not apply — Caddy serves HTTP/2, which multiplexes SSE.)

### Option C: Polling (TanStack Query `refetchInterval` 10–15 s)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | ~1–2 req / s per phone at 15 phones — trivial |
| Scalability | Fine here |
| Team familiarity | High |

**Pros:** nothing to operate; naturally resilient.
**Cons:** 10–15 s delay for "booking arrived" / "role changed" — against D-NTF-01 "realtime" and the live Today list; constant 4G radio wakeups drain phone batteries.

### Option D: Socket.IO + Redis adapter from day one
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | Redis container (contradicts ADR-002's "no Redis") |
| Scalability | Multi-instance ready |
| Team familiarity | Medium |

**Pros:** no change later when scaling out.
**Cons:** a second stateful service for a hypothetical need; ADR-002 removed Redis on purpose.

### Option E: Socket.IO + Postgres `LISTEN/NOTIFY` adapter
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | None |
| Scalability | Multi-instance without Redis |
| Team familiarity | Low |

**Pros:** keeps "Postgres only".
**Cons:** community adapter maturity; not needed until a second instance exists — recorded as the first option to evaluate at that trigger (system-design §6).

## Trade-off Analysis
- **Freshness vs. simplicity.** A delivers sub-second updates with little code; C is simpler but visibly slower and worse for batteries. B is a reasonable alternative but loses rooms and the proven reconnect behaviour that flaky 4G needs.
- **Correctness does not depend on realtime.** Because every event is "refetch this", a lost or late event only delays a UI refresh; money and booking state live in the DB (D-BKG-08 etc.). This is what lets V1 skip an adapter and the outbox.
- **Deploy behaviour.** Restarting the API drops sockets for a few seconds; clients reconnect and refetch — acceptable for a shop (deploys outside opening hours by runbook).

## Consequences
- Easier: live Today list, instant notifications, instant permission changes; one auth path.
- Harder: payload discipline (never send money details over the socket — ids only, then an authorised refetch); tests for reconnect + refetch; Caddy must proxy WebSocket upgrades on `/rt`.
- Revisit when: a second API instance is introduced (adapter E or D), or iOS staff need background notifications (Web Push — AD-PWA-01, system-design §6).

## Action Items
1. [ ] `RealtimeModule`: gateway with Engine.IO `path: '/rt'`, handshake guard (cookie + `Origin` + `auth.client`), room join from the same grant computation as `/me`; `RealtimePublisher.publish(event, rooms, payload)`.
2. [ ] Event types + payload schemas in `packages/shared/realtime` (catalogue = API Part 0 §8); each part adds its events.
3. [ ] Client `useRealtime()` hook: map event → query keys to invalidate; refetch on `connect` and on focus; exponential backoff.
4. [ ] Caddy: `/rt*` → api with WebSocket upgrade; `GET /v1/system/jobs` / metrics include the connected-socket count.
5. [ ] Tests: role change → `session.updated` → `/me` refetch; booking created → booked barber's phone receives `booking.created` within 1 s.
6. [ ] **02/Oct:** `RealtimePublisher` helper `toUsersHolding(code, { branchId?, companyScopeOnly? })` (same grant computation as the guard) for the user-room events of the amendment table; payload-schema test that no event `data` carries a money field (`*_amount`) — every event, no exceptions.
