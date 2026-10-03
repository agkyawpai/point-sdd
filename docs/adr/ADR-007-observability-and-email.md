# ADR-007: Observability (uptime + error tracking) and transactional e-mail via hosted providers

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #13 + #27–#29; REC-38 → 🔒). **Providers chosen:** e-mail = **Resend (Free plan)** · uptime = **HetrixTools (Free plan)** with alerts by **e-mail + Telegram** · errors = **Sentry (Developer / Free plan)** — see *Decision* and *Owner choices (01/Oct 21:20)* below. E-mail is used **only** for what is locked: OTP (🔒 D-AUTH-01) and invites (🔒 D-EMP-02) — no payslip or digest e-mails (🔒 D-NTF-01 in-app only; 🔒 D-PAYR-07 payslip in-app). *Was:* Proposed (provider = criteria only). **Amendment (02/Oct/2026 — API Part 8 🔒 D-API-09, owner one-sheet F12 / F9):** `backup.failed`, `job.failed` and the new `backup.restore_authorized` are notification **category 6 SECURITY, mandatory** (cannot be disabled — P8-RULE-02); recipients = company-scope holders of the related code (`backup.view` · `settings.update` · `backup.restore`), fallback company admins (owner F12) — see Decision #4; the jobs panel stays company-scope `settings.view⁺`.
**Date:** 01/Oct/2026 · amended 02/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — (1) **Email = Resend (Free)** — OTP login (D-AUTH-01) နဲ့ invite (D-EMP-02) ပဲ ပို့; free = တစ်ရက် ၁၀၀ / တစ်လ ၃,၀၀၀ — customer ဆီ email မပို့ (D-CUS-05) + stay signed in (D-AUTH-06) ဆိုတော့ လောက်တယ်။ Domain verify မလုပ်ခင် Resend က ကိုယ့် account email ဆီပဲ ပို့ပေးလို့ — dev / staging = **Mailpit** (အတု mailbox), barber pilot = **Google login ပဲ**, domain ကို release **၂–၃ ရက် အလို** Resend မှာ ထည့် + DNS verify။ (2) **Uptime = HetrixTools (Free)** — ၁ မိနစ်တစ်ခါ ပြင်ပကနေ စစ်; server ပျက်ရင် **Telegram + Email** ချက်ချင်း (Telegram = ဖုန်း push); ရက် ၉၀ တစ်ခါ login ဝင်ရ (free account ဆက်ရဖို့)။ (3) **Error = Sentry (Developer / Free)** — user ၁ ယောက်၊ error ၅,၀၀၀ / လ၊ alert = email ပဲ; account ၃ ခုလုံး **owner ပိုင် ops Gmail** နဲ့ ဖွင့်; dev ၂ ယောက် သီးသန့် login လိုလာမှ Sentry Team (US$26 / လ)။ (4) Backup / job မအောင်မြင်ရင် admin ကို app ထဲ noti (D-NTF-01 — email digest မပို့)။ **02/Oct:** `backup.failed` · `job.failed` · `backup.restore_authorized` (restore ခွင့်ပြုလိုက်ပြီ) = **Security အမျိုးအစား၊ ပိတ်လို့မရ** — ပို့တာ = အဲ့ code ကို company scope နဲ့ ကိုင်သူ (မရှိရင် company admin — F12)။

## Context
- 🔒 D-AUTH-01: no passwords — Google SSO or 8-digit e-mail OTP. E-mail delivery is therefore on the login critical path; invites (🔒 D-EMP-02) also go by e-mail. Nothing else is sent by e-mail in V1 (🔒 D-NTF-01 in-app notifications only; 🔒 D-PAYR-07 payslips rendered in-app).
- Audit (🔒 D-AUD-02) records data changes only; system errors are not in audit (review §3.0 REC-38, system-design §3.2). Nothing today would tell the owner that the API is down at 2 am or that the nightly backup failed.
- 🔒 D-DAT-03: backup failures must notify the admin; D-NTF-01 in-app notifications exist for staff.
- Single VPS (ADR-001): any monitor running on the same box dies with it — the uptime check must be external.
- Budget: a small business; free tiers of hosted providers cover this volume (tens of e-mails / day, < 1k errors / month).

## Decision
1. **Transactional e-mail = Resend (Free plan)** through its HTTP API (provider adapter interface — swappable; candidates kept in reserve: Postmark, Amazon SES, Brevo). Sent via the `email.send` job (ADR-002) with 3 retries; OTP jobs expire after 5 minutes (code validity). Domain authentication (SPF, DKIM, DMARC) on the owner's domain (★ ACT-05 — the owner sets the domain at production release). From-address `no-reply@<domain>`; templates (OTP, invite) bilingual by `users.ui_language` (D-PLT-03). **Before the domain exists:** dev / staging send to **Mailpit** (a local mail catcher — nothing leaves the server); the barber pilot signs in with **Google only** (D-AUTH-01 second path; the Google e-mail must equal the admin-entered e-mail — D-AUTH-02); the go-live checklist adds the domain to Resend **at least 2–3 days before go-live** and tests OTP delivery to Gmail / Yahoo / Outlook.
2. **Uptime = HetrixTools (Free plan):** external checks **every 60 s** from several locations on `GET /api/v1/health` (app host — liveness only, no details: P1.SYS.01) and on the public home page; alerts to the owner (+ dev) by **e-mail and Telegram** (HetrixTools' built-in Telegram bot — a Telegram message arrives as a phone push notification, so no separate push app is needed; Viber is not supported). Until the domain exists the monitors point at the staging host.
3. **Error tracking = Sentry (Developer / Free plan)** — Sentry SDK in the API, the web app and the Capacitor shell, with `request_id` correlation (API-ERR-*), PII scrubbing (phones, e-mails, tokens), alert on error-rate spikes and on any 500 from the money endpoints. Free plan alerts go by **e-mail** only (no Telegram); the plan has **one user seat**, used by the dev team through the owner-owned ops login (below); move to **Team** only when two developers need separate logins / alert routing.
4. **Operational visibility stays in-app** (🔒 D-NTF-01): the admin "Needs attention" panel (AD-DSH-04) shows backups OK?, cron jobs OK? (from `GET /v1/system/jobs` — P1.SYS.05), unverified KBZPay count, branch-days not closed; failures raise in-app notifications `backup.failed` / `job.failed` (D-NTF-03). A daily e-mail digest to the owner is **not** in V1 unless the owner asks for it (⚠️ would need a decision).
   **Amendment (02/Oct/2026 — API Part 8 P8-RULE-02 / 09 / 10 / 16 / 18):**

   | Notification type | Category | Mandatory | Recipients (rule 1 ADMINS — owner F12) | Raised by |
   | --- | --- | --- | --- | --- |
   | `backup.failed` | **6 SECURITY** | **yes** | company-scope holders of `backup.view` (fallback company admins) | a FAILED run reported by the sidecar (P8.INT.02) · `backup.watchdog` 06:00 (no daily success / no restore test in 35 days — ADR-002) |
   | `job.failed` | **6 SECURITY** | **yes** | company-scope holders of `settings.update` (fallback company admins) | the dead letter of every job marked so in the ADR-002 table |
   | `backup.restore_authorized` (new) | **6 SECURITY** | **yes** | company-scope holders of `backup.restore`, minus the actor | P8.BAK.03 — a restore was authorised and maintenance mode turned on (owner F9) |

   Mandatory = the type cannot be disabled on *Settings › Notification types* (409 `notification_mandatory`; DB `notification_types_mandatory_chk`); there is no per-user mute in V1. The "Needs attention" cards are gated by their own codes: **backups** card = `backup.view`; **jobs** card = **company-scope `settings.view⁺`** (unchanged — the jobs panel P1.SYS.05 is system-wide, ADR-012).
5. **Logs:** structured JSON (pino) to stdout → Docker log rotation (7 days); no central log service in V1.

### Provider selection criteria (★ owner / dev at build time)
| Need | Criterion |
| --- | --- |
| E-mail | HTTP API + SDK, DKIM / SPF support, status page, bounce / complaint webhooks, free tier ≥ 3k / month, sends to Myanmar ISPs reliably (test Gmail, Yahoo, Outlook) |
| Uptime | External, 60 s interval, status page, multi-region probes, alert via e-mail + app push |
| Errors | Sentry SDK compatible (NestJS, Next.js, Capacitor), release tagging, PII scrubbing, free tier ≥ 5k events / month |

### Owner choices (01/Oct/2026 21:20 — decision sheet #13, #27, #28, #29)
| Need | Provider · plan | Limits on 01/Oct/2026 (check at build time) | Why it fits / watch |
| --- | --- | --- | --- |
| E-mail (OTP + invite) | **Resend · Free** | 3,000 e-mails / month · 100 / day (UTC day = resets 06:30 MMT) · we need 1 verified domain (included in Free — check the domain allowance at build time) · without a verified domain only the account's own address can receive | Staff OTP + invite only (customers get no e-mail — D-CUS-05; sessions never expire — D-AUTH-06) → a few e-mails a day. Watch: > 100 / day (bulk invites at go-live — send in batches or over two days) |
| Uptime | **HetrixTools · Free** | 15 monitors · checked every minute · 4 of 12 locations · status pages · e-mail + Telegram (+ Pushover / ntfy / webhooks) included · the account must be logged into at least once every 90 days | Meets the 60 s criterion at no cost; Telegram is native (bot `@hetrixtools_bot` → Start → paste the Chat ID into the contact list). Watch: the 90-day login → go-live checklist + calendar reminder. UptimeRobot Free was not chosen: 5-minute checks and no Telegram on the free plan |
| Errors | **Sentry · Developer (Free)** | 1 user · 5,000 errors / month · alerts by e-mail only · Team = US$26 / month, unlimited users | Expected < 1k errors / month. One seat → shared owner-owned ops login for the dev team; upgrade when needed |
| Accounts | **One owner-owned ops Gmail** (e.g. `point.ops@gmail.com` — example) for all three providers | – | Handover (🔒 D-PLT-06): the business owns the accounts; the lead developer uses the login; API keys only in the server `.env` |

**Alert routing:** server / site down → **Telegram + e-mail** (HetrixTools) · application errors → **e-mail** (Sentry) · backup / job failures → **in-app** notification + "Needs attention" panel (D-NTF-01; `backup.failed`, `job.failed`). External ops-monitoring alerts go to the owner / developers from the providers themselves; they are not app notifications to staff, so 🔒 D-NTF-01 (in-app only) is unaffected.

## Options Considered

### Option A: Hosted providers (e-mail API + SaaS uptime + SaaS error tracking) (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low — SDK + env keys |
| Cost | Free tiers at this volume; ≤ US$20 / month if exceeded |
| Scalability | Beyond need |
| Team familiarity | High |

**Pros:** independent of the VPS (uptime still works when the box is down); deliverability handled by specialists; dashboards ready.
**Cons:** third-party accounts to manage (★ owner-owned, not developer-owned); data (error payloads) leaves the VPS — mitigated by scrubbing.

### Option B: Self-hosted on the same VPS (Postfix, Uptime Kuma, GlitchTip)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium–High — mail reputation, three more containers |
| Cost | Server resources + maintenance time |
| Scalability | Fine |
| Team familiarity | Low–Medium |

**Pros:** no external accounts; data stays local.
**Cons:** self-hosted SMTP from a VPS is frequently blocked or spam-foldered (OTP fails = cannot log in); the uptime monitor dies with the VPS; more handover surface (🔒 D-PLT-06).

### Option C: Gmail / Google Workspace SMTP for e-mail; no monitoring
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | None |
| Scalability | Daily send caps (500 / 2k) |
| Team familiarity | High |

**Pros:** nothing to set up.
**Cons:** rate limits and spam classification for automated mail; account 2FA / app-password churn breaks login silently; no visibility of outages — the owner finds out from staff the next morning.

## Trade-off Analysis
- **Reliability of the login path.** OTP e-mail must arrive within seconds; a reputable provider with domain authentication is the only option that makes that likely from day one. Google login remains as the second path (D-AUTH-01), so one provider outage does not lock everyone out.
- **External vs. local monitoring.** The whole point is to learn about VPS failure; only an external probe can do that.
- **Privacy vs. convenience.** Error payloads are scrubbed before leaving; audit data never leaves (it is in the DB only).

## Consequences
- Easier: outages and failed backups are visible within minutes; login e-mail is dependable; developers get stack traces with the `request_id` the user sees on the error screen (AD-FORM-04).
- Harder: three accounts to create and keep (★ owner-owned, API keys in `.env`), DNS records for e-mail authentication (needs the domain — ACT-05), PII-scrubbing rules to maintain.
- Revisit when: volume exceeds the free tiers (Resend > 100 / day; Sentry > 5k errors / month), two developers need their own Sentry logins (→ Team), the owner wants Viber / SMS alerts (would need a local gateway), or a second VPS makes central logs worthwhile.

## Action Items
1. [ ] ★ Owner (build time): create the ops Gmail, then the three accounts on it — **Resend (Free)**, **HetrixTools (Free)**, **Sentry (Developer)**; link Telegram to HetrixTools (`@hetrixtools_bot` → Start → Chat ID → contact list) with the owner's alert e-mail; at production release set the domain (★ ACT-05 — DNS access ✅) and add it to Resend ≥ 2–3 days before go-live.
2. [ ] `MailModule` (provider adapter interface + Resend implementation + **Mailpit SMTP transport for dev / staging**), bilingual templates (OTP, invite only), `email.send` job with retry / expiry; daily-cap guard (queue invites over the 100 / day limit).
3. [ ] `/api/v1/health` = liveness (DB ping → `ok` / `degraded`, no details) for the external check; `GET /v1/system/jobs` (authenticated, company-scope `settings.view⁺` — ADR-012) for job / backup status; disk / DB alerts from the host monitor.
4. [ ] Error SDK in api / web / android with `request_id`, release tag from CI, scrubbing of phone / e-mail / token fields; alert rules (error-rate, money endpoints 5xx).
5. [ ] Backup / job failure → `notification_types` `backup.failed`, `job.failed` (D-NTF-03) + "Needs attention" panel rows (AD-DSH-04); `backup.watchdog` (ADR-002) feeds them. **02/Oct:** both + `backup.restore_authorized` = category 6 SECURITY, `mandatory: true` in `notifications.json` with related codes `backup.view` / `settings.update` / `backup.restore` (P8 §15); test that they cannot be disabled and reach company-scope holders only.
6. [ ] Runbook "What to do when the uptime alert fires" (restart order, restore steps) — 🔒 D-PLT-06; go-live checklist: HetrixTools 90-day login reminder, Resend domain verified + OTP test to Gmail / Yahoo / Outlook, Sentry DSN per environment.
