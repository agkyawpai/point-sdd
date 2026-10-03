# ADR-002: Background jobs with pg-boss inside PostgreSQL (instead of BullMQ + Redis)

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #9 "pg-boss + PostgreSQL job architecture — OK"; REC-31 → 🔒). Backup sidecar included. **Backup RPO = daily (V1)** — sheet #15 "OK": up to 24 h of data can be lost in a disaster; hourly WAL archiving stays a revisit trigger (system design §6). *Was:* Proposed (⚠️ REC-31). **Amended 02/Oct/2026 — job list for API Parts 4–8** (owner one-sheet "အကုန်လုံး OK" 00:06, item **H (5)** new jobs `receipt.render`, nightly stock check `stock.reconcile_levels`, notification / export / upload purges; Part 5 / 7 / 8 schedules): the canonical table below now gives **name, owner part, schedule (MMT), idempotency and retry / dead letter for every job**; `notifications.cleanup` is **renamed `notifications.purge`**; the Decision's old `singletonKey` sentence is aligned with action item 6 (no `singletonKey` for no-show jobs). **Review fixes 02/Oct/2026 (independent review of the batch — R2-7, R3-22, R3-24; status unchanged):** `closing.month_end_must_return` runs **daily at 01:00** and converts a must-return cash out only once its branch's month is fully closed (🔒 D-FIN-09 "until the month-end closing") · the no-show jobs skip bookings inside an active closure (owner F8) · one owner part per job: `site.revalidate` handler = Part 8 (enqueued by Parts 1 / 2 / 8), `sync.code_tables` / `email.send` / `auth.cleanup` = Part 1.
**Date:** 01/Oct/2026 · amended 02/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — နောက်ကွယ်က အလုပ်တွေ (ညတိုင်း shift ထုတ်၊ no-show alarm၊ attendance exception၊ လကုန် must-return၊ backup၊ website revalidate၊ email ပို့) ကို **Redis server အသစ် မထည့်ဘဲ PostgreSQL ထဲမှာပဲ queue (pg-boss)** နဲ့ run။ Service တစ်ခု လျော့ (handover လွယ်)၊ backup တစ်ခုတည်းနဲ့ job တွေပါ ပါ၊ ဒီ system ရဲ့ job အရေအတွက် (တစ်နေ့ ရာဂဏန်း) အတွက် လုံလောက်။
> **02/Oct ပြင်ဆင် (owner H (5)):** job အသစ် — **receipt ထုတ်** (`receipt.render`, FINISH ပြီးတိုင်း) · **ညစဉ် stock စစ်** (`stock.reconcile_levels`, ည ၁:၃၀ — မကိုက်ရင် admin noti, ဘာမှ auto မပြင်) · **noti ရှင်း** (`notifications.purge`, ည ၂:၀၀ — ရက် ၉၀ ကျော်) · **upload / export ဖိုင် ရှင်း** (နာရီတိုင်း — ၂၄ နာရီ ကျော်) · export / import (နောက်ကွယ်)။ ညဘက် အချိန်ဇယား — ၀၀:၃၀ shift → ၀၁:၀၀ must-return စစ် (**နေ့တိုင်း** — အဲ့ branch ရဲ့ လတစ်လလုံး စာရင်းပိတ်ပြီးမှ expense ပြောင်း; review ပြင်ဆင်ချက် 02/Oct) → ၀၁:၃၀ stock → ၀၂:၀၀ noti → ၀၃:၀၀ backup → ၀၆:၀၀ backup စစ် → ၂၃:၅၅ attendance (မပြီးသေးတဲ့ record)။ Job တိုင်း ၂ ခါ run မိလည်း ရလဒ် မပြောင်း (idempotent); ၃ ခါ ကြိုးစားပြီး မရရင် admin ကို **`job.failed`** (မဖြစ်မနေ noti — ADR-007)။

## Context
The locked design needs these scheduled / delayed jobs. **This table is the canonical job list** (02/Oct/2026 — API Parts 1–8 🔒 D-API-01..09); the system-design document (§3.4), ADR-006 / 007 / 013 / 014 / 015, `GET /v1/system/jobs` (P1.SYS.05) and the jobs panel refer to it. Event names (`site.content_changed`) are domain events; job names (`site.revalidate`) are pg-boss queues. All cron expressions run in **`Asia/Yangon`** (MMT — D-PLT-15). Retry = pg-boss retry with exponential backoff; **dead letter → `job.failed`** = notification category 6 SECURITY, mandatory, to company-scope holders of `settings.update` (fallback company admins — owner F12, ADR-007) + the jobs panel; "–" = the failure is only counted in the jobs panel because another path already covers it.

| Job | Owner part | Schedule (MMT) / trigger | Idempotency (safe to run twice) | Retry · dead letter | Volume |
| --- | --- | --- | --- | --- | --- |
| `shifts.generate` (D-DB-06, D-SCH-01) | 2 (P2-RULE-07, P2.SHF.06) | cron **00:30** daily · inline on pattern save / day reset · on demand (P2.SHF.06 → 202) | diff-based: patterns → `schedule_shifts` for today … advance window + 7 days; unchanged rows untouched; then `site.revalidate(['barbers'])` | 3 · `job.failed` | 1 / day + edits |
| `booking.noshow_alarm` (D-BKG-17) | 3 (P3-RULE-08) | delayed: at `starts_at`; each snooze a new alarm 10 min later (≤ 4) | data `{ booking_id, starts_at, snooze_seq }`; **no `singletonKey`**; locks the booking row and is a no-op unless still BOOKED with the same `starts_at` and the current `snooze_seq` (snooze count = `booking.noshow_snooze` audit rows); also a no-op when the booking's date is inside an active closure of its branch (owner F8 — P3-RULE-08, review fix 02/Oct) | 3 · `job.failed` | ≤ 5 × bookings / day |
| `booking.noshow_autocancel` (D-BKG-17) | 3 (P3-RULE-08) | delayed: `starts_at` + 40 min | same state guard (incl. the closure skip — nothing is auto-cancelled inside a closure, owner F8); START wins the race (status 2 → no-op) | 3 · `job.failed` | ≤ bookings / day |
| `attendance.detect_exceptions` (D-ATT-03 / 04) | 5 (P5-RULE-14) | cron **every 15 min** (ABSENT, automatic clock-out when `attendance.auto_clock_out_after_shift_minutes` > 0) · cron **23:55** (INCOMPLETE) | DB partial uniques (one exception per shift and type, one INCOMPLETE per record); skips finalized payroll periods; the job only creates, never voids | 3 · `job.failed` | ~100 / day |
| `closing.month_end_must_return` (D-FIN-09) | 7 (P7-RULE-12) | cron **01:00 daily** (review fix 02/Oct — R2-7; was "on the 1st") | acts on a MUST_RETURN cash out **only once every day of the cash out's month that needs closing at its branch is CLOSED** (🔒 D-FIN-09 "until the month-end closing" — until then the nightly run is a no-op for it, so a return made on the last day and entered the next morning is never converted by mistake); `expense_date` = the last day of the cash out's own month; cash-out row locked `FOR UPDATE`, one transaction per cash out; DB `expenses_one_per_cash_out` — a converted cash out carries its source-5 expense, so no "processed" table is needed; a return dated after the conversion gets its reversal | 3 · `job.failed` (money) | 1 / day (work only after a month is closed) |
| `stock.reconcile_levels` (D-STK-06, F-P6-04) | 6 (P6-RULE-14) | cron **01:30** daily | **read-only** — compares `quantity_on_hand` with Σ `stock_movements` in one statement / one read-only snapshot (no false mismatch from a movement committed in between); mismatch → notification `stock.level_mismatch`; never repairs (P6.STK.08 is manual) | 3 · `job.failed` | 1 / day |
| `notifications.purge` (D-NTF-02) — **renamed from `notifications.cleanup`** | 8 (P8-RULE-02) | cron **02:00** daily | hard-deletes rows older than 90 days in batches of 5,000 (F-P8-04 — D-DAT-05 exception: not transactional data); a re-run finds nothing more | 3 · `job.failed` | 1 / day |
| `backup.watchdog` (D-DAT-03) | 8 (P8-RULE-09) | cron **06:00** daily | read-only check of `backup_runs`: no SUCCESS DAILY since yesterday 06:00, or no SUCCESS RESTORE_TEST in 35 days → `backup.failed { reason: "missing", kind }` (category 6, mandatory) | 3 · `job.failed` | 1 / day |
| `uploads.purge` (F-P8-05) | 8 (P8-RULE-03, ADR-014) | cron **hourly** | selects by age / state: staging rows > 24 h → system soft delete + object delete; objects of soft-deleted rows; import files > 90 days; deleting a missing object is a no-op | 3 · `job.failed` | 24 / day |
| `exports.purge` (D-DAT-02) | 8 (P8-RULE-08, ADR-015) | cron **hourly** | export files > 24 h → system soft delete + object delete; same no-op rule | 3 · `job.failed` | 24 / day |
| `integrity.check_weekly` | 8 (P8-RULE-18) | cron **weekly** (day / time ★ at build — outside opening hours) | read-only report: polymorphic references of `attachments`, `audit_events`, `notifications` (system design §3.1) + **bucket object of every live attachment row** (ADR-014) | 3 · `job.failed` | 1 / week |
| `auth.cleanup` | 1 | cron **hourly** | deletes expired `login_otps` rows (the Google hand-off store is in-process with its own TTL — ADR-005) | 3 · – (next run) | 24 / day |
| `site.revalidate` (REC-35, ADR-006) | **8** — the handler (P8-RULE-13 / 18); enqueued by any website write of Parts 1 / 2 / 8 (API-PUB-03) | on content change, enqueued **in the write transaction**; data `{ tags }` | `revalidateTag()` is idempotent; also clears the booking-options cache of the branch | 3 · – (the 5-minute time fallback covers it) | tens / day |
| `receipt.render` (D-PAY-06 / 07 — owner H) | 4 (P4-RULE-18, ADR-013) | on FINISH / refund (incl. the automatic change refund), enqueued **in the transaction**; data `{ entity_type: 'sales' \| 'refunds', entity_id }` | skips when both files exist; per-entity advisory lock shared with the on-the-fly GET → one stored set; worker concurrency 1 (renderer) | 3 · `job.failed` (the receipt still opens — GET renders on the fly) | ~100 / day |
| `export.run` (D-DAT-02 — owner F2 / F3) | 8 (P8-RULE-08, ADR-015) | on demand (`POST /v1/exports` → 202) — CSV / XLSX > 5,000 rows and every PDF incl. QR posters | job id = export id; a retry re-renders into the same export (one attachment per export id); worker concurrency 1 for PDFs (ADR-013) | 3 · – (requester gets `export.ready { status: "failed" }`) | few / week |
| `import.run` (D-DAT-01 — owner F5) | 8 (P8-RULE-07, ADR-015) | on demand — phases `validate` / `confirm` (202) | by import status (validate / confirm while queued → same job; confirm on CONFIRMED → 200); confirm = **one transaction** (committed or rolled back — a retry re-checks status 2); `import_source_refs` unique | 3 for transient errors; a data / constraint error ends FAILED (status 4) at once · – (importer sees `import.updated`) | few / month |
| `sync.code_tables` (D-ROLE-08, D-PLT-16, D-NTF-03) | **1** (P1-RULE-12 — it syncs every part's codes and settings; Part 8 contributes `notifications.json`) | on deploy / startup | upserts `permissions.json`, `settings.json`, `notifications.json`; new permission codes → every company-admin role (ADR-011); re-run = no change | 3 · `job.failed` | per deploy |
| `email.send` (D-AUTH-01, D-EMP-02) | 1 (ADR-007) | on demand (OTP, invite only) | OTP jobs expire after 5 minutes (code validity); invites over the 100 / day provider cap stay queued | 3 · – (the user requests a new OTP) | tens / day |

**Not pg-boss — the backup sidecar** (Decision, P8-RULE-09): `pg_dump` **daily 03:00** (kept 30 days) · **weekly on Sunday** (kept 1 year) · **monthly restore test on the 1st at 04:00** (automatic — owner F9, DB Part 8 v1.1) → reports to `/v1/internal/backup-runs` (P8.INT.01 / 02); a FAILED run raises `backup.failed`.

**Night timeline (MMT):** 00:30 `shifts.generate` → 01:00 month-end must-return check (daily — converts only after the month is fully closed) → 01:30 stock check → 02:00 notification purge → 03:00 backup (sidecar) → 04:00 (1st) restore test (sidecar) → 06:00 `backup.watchdog`; 23:55 INCOMPLETE detection. Nothing heavy runs in opening hours except the 15-minute attendance check and the hourly purges.

Requirements: delayed jobs (minutes to days), cron schedules, retries with backoff, at-least-once execution with idempotent handlers, visibility of failures (admin notification), and as few services as possible (🔒 D-PLT-06 handover, review §5.1). Total volume is in the hundreds of jobs per day.

## Decision
Use **pg-boss** (job queue on PostgreSQL, `pgboss` schema in the same database) for all background work. Workers run **inside the API process** in V1 (feature flag `JOBS_IN_API=true`) so there is one deployable; the worker can be split into its own container later without code change. Handlers are idempotent and **bound to the state they were scheduled for**: the no-show jobs carry `booking_id` + `starts_at` (+ `snooze_seq`) in their data and exit unless the booking is still BOOKED (status 1 — DB Part 3) *and* `starts_at` is unchanged ~~; reschedule / cancel also cancels the pending jobs through `singletonKey = booking:<id>`~~ — *02/Oct: aligned with action item 6 / API P3-RULE-08 — no `singletonKey` (pg-boss would drop the new job while an old one is queued); a stale job is simply a no-op* — so a booking moved from 10:00 to 14:00 is not auto-cancelled at 10:40 (🔒 D-BKG-17). Jobs that must not be lost with the business write (`site.revalidate`, `receipt.render`, no-show timers) are enqueued **inside the same transaction** (pg-boss `send(name, data, { db })` with the request's transaction client). Retry policy: 3 attempts with exponential backoff; the dead letter raises the admin in-app notification **`job.failed`** (category 6 SECURITY, mandatory — ADR-007; D-NTF-01) for the jobs marked so in the table — every money- and data-relevant job (P8-RULE-18). Job health (last run of each cron) is exposed to admins by `GET /v1/system/jobs` (P1.SYS.05, company-scope `settings.view⁺` — ADR-012) and alerted on (ADR-007); `GET /v1/health` stays a details-free liveness probe. **Backups are not pg-boss jobs:** a `backup` sidecar container (PostgreSQL client image + cron, its own read-only DB role; `CREATEDB` on a scratch database for the monthly restore test — the API's restricted role must not have it) runs `pg_dump` daily 03:00 / weekly (Sunday), uploads to the **owner's backup bucket** (owner F4 — ADR-014), runs the monthly restore test automatically (1st, 04:00 — owner F9), and reports each run to `POST` / `PATCH /v1/internal/backup-runs` → `backup_runs` (D-DAT-03, P8.INT.01 / 02); `backup.watchdog` raises `backup.failed` if no successful daily run is recorded by 06:00 (or no successful restore test in 35 days). **Recovery point = daily (owner 01/Oct 21:20, sheet #15):** a disaster can lose up to 24 hours of data — accepted for V1 because the day's paper fallback (D-VIS-13) and closing records allow re-entry; hourly WAL archiving (`wal-g` / `pgbackrest`) stays the revisit trigger (system design §6).

Event rule kept from review §5.3: in-process domain events (realtime fan-out, notifications, commission estimate) are emitted after commit; **no outbox table** (D-DB-12). A crash between commit and emit can lose such an *event*, never the *data*; consumers recompute from data (closing totals computed, not accumulated; clients refetch on focus; the site keeps its 5-minute time fallback). Jobs, by contrast, are enqueued transactionally (above), so they are never lost.

## Options Considered

### Option A: pg-boss on PostgreSQL (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — a schema in the existing DB; TypeScript API; cron + delayed jobs built in |
| Cost | Zero extra infrastructure |
| Scalability | Thousands of jobs / minute on Postgres — far above need; polling adds ~1 light query / s |
| Team familiarity | Medium (small API; well documented) |

**Pros:** one service fewer; jobs are inside the same backup and the same transaction boundary (a job can be enqueued in the business transaction); no Redis to secure / monitor / restore.
**Cons:** polling latency (~1–2 s) instead of push; the DB does a little extra work; fewer dashboards than the BullMQ ecosystem.

### Option B: BullMQ + Redis
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — Redis container, persistence config, separate backup |
| Cost | Extra container + memory; another thing to monitor |
| Scalability | Very high — unnecessary here |
| Team familiarity | High (common in NestJS projects) |

**Pros:** push-based, rich UI (Bull Board), huge throughput, familiar `@nestjs/bullmq`.
**Cons:** Redis becomes a second stateful service to back up and restore; enqueue is outside the DB transaction (needs outbox or accepts loss); more handover surface for a shop system with hundreds of jobs a day.

### Option C: In-process timers / node-cron, no persistence
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | None |
| Scalability | n/a |
| Team familiarity | High |

**Pros:** trivial.
**Cons:** delayed jobs (no-show alarms) are lost on restart / deploy; no retries, no visibility; unacceptable for backups and month-end.

### Option D: Custom queue on `LISTEN/NOTIFY` + a jobs table
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium–High (write and test our own scheduler) |
| Cost | None |
| Scalability | Fine |
| Team familiarity | Low |

**Pros:** full control.
**Cons:** reinventing pg-boss with less testing; time better spent on business features in a 1-month V1.

## Trade-off Analysis
- **Operational simplicity vs. push latency.** pg-boss polling means a no-show alarm may fire 1–2 s late — irrelevant for a 10-minute timer. In exchange the system has one stateful service instead of two.
- **Transactional enqueue.** With pg-boss the enqueue shares the business transaction (same connection), which is cleaner than Redis + outbox: jobs are never lost. Only the in-process domain events (realtime, notifications) are best-effort after commit, and the site's time fallback / client refetch cover those.
- **Migration path.** If job volume or latency ever matters, BullMQ can replace pg-boss module by module behind the same `JobsService` interface; nothing in the business code depends on pg-boss types.

## Consequences
- Easier: deploy, backup, restore, handover; jobs and data restored together.
- Harder: no ready-made UI — a small admin "Jobs" panel (last run / failures) is needed (Part 8 platform; AD-SET area). Pg-boss housekeeping (archive / delete completed jobs) must be configured so the table does not grow.
- Revisit when: a dedicated worker container is wanted (flag), or job volume > ~10k / day (unlikely).

## Action Items
1. [ ] `JobsModule` wrapping pg-boss behind a `JobsService` (`schedule(name, data, { startAfter })`, `cron(name, expr)` with time zone `Asia/Yangon`; per-queue worker concurrency — 1 for the renderer queues `receipt.render` / `export.run`, ADR-013), with job names as constants in `packages/shared` (the 18 names of the table; `notifications.cleanup` is not used — renamed `notifications.purge`).
2. [ ] Handlers for the jobs in the table above, each idempotent as its row says and unit-tested with a fake clock; cron times in `Asia/Yangon` (D-PLT-15).
3. [ ] Retry / dead-letter policy per the table + admin notification type `job.failed` (category 6 SECURITY, mandatory, related code `settings.update` — notifications.json, D-NTF-03, ADR-007).
4. [ ] `GET /v1/system/jobs` (P1.SYS.05, company-scope `settings.view⁺`) reports last success / failure, failures in 24 h and queued count for **every** job of the table (incl. `receipt.render`, `stock.reconcile_levels`, `closing.month_end_must_return`, the purges) and the `backup_runs` summary; `backup.watchdog` + ADR-007 alert if nightly jobs have not run by 06:00 MMT.
5. [ ] `backup` sidecar container (pg client + cron + own DB role, `pg_dump` → bucket, `POST /v1/internal/backup-runs`, monthly restore test into a scratch DB); the `pgboss` schema is included in the dump; archive completed jobs after 7 days, delete after 30.
6. [ ] No-show jobs (API Part 3 P3-RULE-08 — 01/Oct): data `{ booking_id, starts_at, snooze_seq }`, **no `singletonKey` replacement** (pg-boss drops a `send` while a same-key job is queued); every job locks the booking row and is a no-op unless still BOOKED with the same `starts_at` / current `snooze_seq`; snooze count = `booking.noshow_snooze` audit rows; test the 10:00 → 14:00 reschedule and the START-vs-auto-cancel race.
