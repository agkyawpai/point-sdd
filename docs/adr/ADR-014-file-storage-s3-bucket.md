# ADR-014: File storage — one private S3-compatible bucket in the owner's account (staging upload → link, signed URLs, stable public media path, off-site backups in the same provider)

**Status:** Accepted — owner one-sheet **"အကုန်လုံး OK" (02/Oct/2026 00:06)**, item **F4** (pictures / receipts / documents in a **cloud bucket in the owner's account** — Cloudflare R2 or Backblaze B2, ~US$0–1 / month, international card needed; **off-site backups there too**) and **H (3)** (files = S3 API). Implements 🔒 D-FIN-03 (expense / income attachments), D-EMP-03 (employee documents), D-DAT-03 (off-site backup copy), D-PAY-06 (stored receipt files — ADR-013), D-WEB-01 / 03 (website images), FE-PERF-05. Used by API Part 8 P8-RULE-03 / 04 / 05 / 09 (🔒 D-API-09) and by Parts 1, 2, 4, 7 through `Attachments.link` / `Attachments.replace`. Replaces the "MinIO on the VPS **or** a cloud bucket" option of system design v1.2 §2.4 / ADR-001. Recorded under D-ARC-01. **Review fixes 02/Oct (independent review R3-8 / R3-19 / R3-29 — status unchanged):** public media = `Cache-Control: public, max-age=86400` + `ETag` (was one-year `immutable`) with its own rate limit (600 / min / IP); CSV uploads pass a text test (no signature exists). **Reconcile 02/Oct:** `attachment_invalid { attachment_id, reason }` written with its full context.
**Date:** 02/Oct/2026
**Deciders:** Owner (F4 / H) · dev team

> **မြန်မာ အတိုချုပ်** — ပုံ၊ receipt ဖိုင်၊ expense ဘောင်ချာ ဓာတ်ပုံ၊ ဝန်ထမ်း document (မှတ်ပုံတင် / contract)၊ website ပုံ၊ import / export ဖိုင် အားလုံးကို **server disk ပေါ် မထားဘဲ owner ပိုင် cloud bucket** (Cloudflare R2 သို့ Backblaze B2 — S3 API) ထဲ သိမ်းမယ်; **backup** တွေလည်း အဲ့ provider ထဲ (bucket သီးသန့်)။ Bucket က **private** — link နဲ့ တိုက်ရိုက် မဖွင့်ရ; ဝန်ထမ်းက ဖိုင်ဖွင့်ရင် server က ခွင့်စစ်ပြီး **၅ မိနစ်ပဲ သက်တမ်းရှိတဲ့ link** ထုတ်ပေး။ Website ပုံ (logo, cover, ဆိုင်ဝန်ဆောင်မှု, barber ဓာတ်ပုံ) = လမ်းကြောင်း မပြောင်းတဲ့ `/api/v1/public/media/<id>/<size>` (website မှာ ပြထားတဲ့ ပုံပဲ ပေါ်)။ Upload တင်ရင် server က ဖိုင်အမျိုးအစားကို ဖိုင်အတွင်းက စစ် (နာမည် မယုံ)၊ ဓာတ်ပုံထဲက **တည်နေရာ (GPS) ဖျက်**၊ website အတွက် 400 / 800 / 1600 px ပုံ ထုတ်။ မသုံးဖြစ်တဲ့ upload (၂၄ နာရီ) နဲ့ export ဖိုင် (၂၄ နာရီ) ကို နာရီတိုင်း ရှင်း; မှားဖျက်မိရင် ရက် ၃၀ အတွင်း ပြန်ယူလို့ရ (versioning)။

## Context
- Files the system keeps: receipt PDF + PNG per sale / refund (~100 / day, small — ADR-013); expense / income attachments (photos of bills — 🔒 D-FIN-03); employee documents (ID card, contract — private, owner F11); website images (logo, cover, share image, service images, barber photos — 🔒 D-WEB-01 / 03); import files (D-DAT-01); export files (D-DAT-02, kept 24 h — owner F3); database backups (🔒 D-DAT-03: daily 30 days + weekly 1 year + off-site + monthly restore test).
- One VPS (ADR-001): its disk is a single point of failure for the database **and** anything stored next to it; 🔒 D-DAT-03 needs an off-site copy; the DB should stay small (system design §2.4).
- Owner F4: a cloud bucket in the owner's own account (handover — 🔒 D-PLT-06); R2 and B2 both offer an S3-compatible API.
- DB Part 8 v1.1 `attachments`: polymorphic `entity_type` / `entity_id`, `kind` 1 DOCUMENT · 2 IMAGE · 3 IMPORT_FILE, `storage_key` unique, soft delete (`deleted_at`; `deleted_by_user_id` NULL = system clean-up — sheet G (e)). The polymorphic reference has no FK (system design §3.1 (d)) → app checks + the weekly integrity job.
- Single origin (ADR-009): the API is `/api` on each app host, CORS disabled; the public host forwards only `/api/v1/public/*`, health and status.

## Decision
1. **One S3-compatible API** behind a `StorageService` (put, get-stream, head, delete, presign GET) using the standard S3 client with a configurable endpoint — the provider is configuration (`S3_ENDPOINT`, region, bucket names, access keys in the server `.env`). The owner picks **R2 or B2** at build (★ owner account on the ops Gmail — ADR-007); the code does not change between them.
2. **Buckets and keys:**
   - **Application bucket — private** (no public access, no public bucket URL), **object versioning 30 days** (a deleted or overwritten object stays recoverable as a non-current version for 30 days — cross-part contract 11), server-side encryption at rest as the provider offers it (a bucket setting, no code — check at build). Object keys `att/<yyyy>/<mm>/<attachment_id>/original.<ext>`; image variants `…/w400.webp`, `w800.webp`, `w1600.webp` (derived objects, no rows). `storage_key` = the original's key; **no URL is ever stored for a private file**.
   - **Backup bucket** in the same provider (off-site — owner F4), written by the backup sidecar (ADR-002) with its own access key. Where the provider supports bucket-scoped keys, the API key reaches only the application bucket and the sidecar key only the backup bucket (least privilege).
3. **Upload = staging → link** (P8-RULE-03): `POST /v1/attachments` (multipart, any staff — self) goes **through the API**: size ≤ setting `system.upload_max_mb` (default 10 → 422 `file_too_large`; Caddy caps the body at that + 1 MB — ADR-009); type by **file signature (magic bytes)**, never by extension or `Content-Type` (422 `file_type_not_allowed`) — image = JPEG / PNG / WebP / HEIC (HEIC → JPEG), document = images + PDF, import = CSV / XLSX (**CSV has no signature** — it is accepted when it matches no binary signature and its content decodes as UTF-8 without NUL bytes, or as UTF-16 with a BOM; review fix 02/Oct). Images are re-encoded (≤ 2560 px long edge), **EXIF / GPS removed**, and get **WebP variants 400 / 800 / 1600 px** (never upscaled); PDFs, CSV and XLSX are stored as received. The object is written first, then the **staging row** (`entity_type = 'uploads'`, `entity_id` = the uploader, valid 24 h). The business write links it **in its own transaction** — `Attachments.link` (caller's own staging rows, allowed kinds, max count → 422 `attachment_invalid { attachment_id, reason }`) or `Attachments.replace` for single-image fields (company logo, employee photo, service image, site cover / share image — the old file is soft-deleted by the system).
4. **Downloads:**
   - **Private staff files** → `GET /v1/attachments/{id}/url` (P8.ATT.04): the **owning entity's read policy** decides (P8-RULE-03 table — e.g. expense attachments follow `expense.view⁺` incl. the salary-row rule; staff documents need private `employee.documents` — ADR-012 Amendment 1) → **presigned GET valid 5 minutes** (fixed in code); `download=true` adds `Content-Disposition`. The browser fetches from the bucket host directly (no cookie goes there; the API does not proxy large files); the bucket host is listed in the app's CSP `img-src` / `connect-src`. Every staff-document URL is audited (`employee.document_view` — owner F11).
   - **Receipts** are streamed **through the API** (P4.RCP.01 / 02 — ADR-013), so the Android shell gets the PNG same-origin with its session cookie.
   - **Public media** → **`GET /api/v1/public/media/<attachment_id>/<variant>`** (`original` · `w400` · `w800` · `w1600` — P8-RULE-04): the API **streams** the object (no redirect — an expiring URL can't be cached); served to anyone **only while referenced by a public field** (company logo, site cover / share image, image of an ACTIVE service with `show_on_website`, photo of an ACTIVE employee with `public_profile`) with **`Cache-Control: public, max-age=86400` + `ETag`** (review fix 02/Oct — R3-29: a new upload is a new id, so content behind an id never changes, but a public flag can be switched off — with a one-year `immutable` header browsers would keep a barber's photo after `public_profile` was turned off; one day bounds that, and a conditional request gets 304 only while the image is still public); **own rate limit 600 requests / minute / IP** (browsers fetch every image of a page directly — R3-8; requests with a staff session are not IP-limited); a signed-in staff session on the app host also gets the other kind-2 images of those entities (`private, max-age=3600`); anything else → **404** with the unknown-id body. `companies.logo_url` / `employees.photo_url` store this stable path — never a signed URL.
5. **Lifecycle** (jobs — ADR-002): **`uploads.purge`** hourly (staging rows older than 24 h → system soft delete + object deleted; objects of soft-deleted rows deleted — the 30-day non-current version is the recovery path; import files older than 90 days) · **`exports.purge`** hourly (export files older than 24 h — ADR-015) · **`integrity.check_weekly`** also checks that every live attachment row still has its object (HEAD) and reports objects under `att/` without a row (an upload that failed between object write and row insert — report only). System files (receipts, exports, import files) can't be removed by hand (403).
6. **Backups off-site** (P8-RULE-09, ADR-002): the sidecar writes `pg_dump` daily 03:00 MMT (kept 30 days) and weekly on Sunday (kept 1 year) to the backup bucket and runs the monthly restore test automatically (1st, 04:00 — owner F9). Attachments are not inside the dump — they are already off-site with 30-day versioning.
7. **Development / CI:** an S3-compatible local server stands in for the bucket — **option:** MinIO in `docker-compose.dev.yml` (named as an option in ADR-001 / system design v1.2) — ★ dev team. Production never keeps application files on the VPS disk (only the transient upload buffer).
8. **Limits fixed in code** (Part 8 §17, not settings): signed URL 5 minutes · staging 24 h · export files 24 h · import files 90 days · ≤ 20 documents per employee; the upload size is the setting `system.upload_max_mb` (default 10).

## Options Considered

### Option A: S3-compatible cloud bucket in the owner's account — R2 or B2 (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–Medium — S3 client, presigned URLs, one more account |
| Cost | Owner's sheet estimate ~US$0–1 / month at this volume (check at build); needs an international card |
| Scalability | Effectively unlimited; a CDN can sit in front of the public media path later |
| Team familiarity | High — the S3 API is the industry default |

**Pros:** files survive a VPS loss; off-site backups in the same provider; versioning gives a 30-day undo; the VPS disk holds only the database and logs; same code against MinIO in development.
**Cons:** depends on the internet and the provider (an outage blocks uploads and image loads); keys to protect; one more owner-owned account.

### Option B: Files on the VPS disk (Docker volume)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest |
| Cost | None |
| Scalability | Limited by the disk |
| Team familiarity | High |

**Pros:** no external dependency.
**Cons:** same failure domain as the DB — a disk loss takes the files too; a separate off-site sync is still needed for D-DAT-03; the disk fills unnoticed.

### Option C: MinIO on the VPS
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — one more container |
| Cost | Server resources |
| Scalability | Disk-bound |
| Team familiarity | Medium |

**Pros:** S3 API without an external account.
**Cons:** still on the same disk — needs replication off-site anyway; more to run and hand over. Kept only as the development stand-in.

### Option D: Files inside PostgreSQL (`bytea` / large objects)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low |
| Cost | DB and dump size grow with every photo |
| Scalability | Poor |
| Team familiarity | High |

**Pros:** one backup covers everything; transactional.
**Cons:** daily dumps grow by every image and receipt, restores slow down, the DB cache fills with blobs.

### Option E: Direct-to-bucket uploads with presigned PUT
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — bucket CORS, a second "confirm" call |
| Cost | Saves API bandwidth |
| Scalability | Better for large files |
| Team familiarity | Medium |

**Pros:** the API never touches the bytes.
**Cons:** the server could not check magic bytes, strip EXIF / GPS or produce WebP variants before the file is stored; needs bucket CORS for the app origin. File sizes here (≤ 10 MB, a few a day) don't need it.

## Trade-off Analysis
- **Durability vs. dependency.** A cloud bucket moves files out of the VPS failure domain and gives D-DAT-03 its off-site copy, at the price of an internet dependency for uploads and image loads — acceptable because V1 has no offline mode anyway (D-VIS-13) and printing / receipts are re-rendered on the fly if a store fails (ADR-013).
- **Proxy vs. presign.** Uploads go through the API (validation and privacy processing matter more than bandwidth); private downloads use short presigned URLs (the API never streams large files and never stores a URL); public images are streamed with one-day caching + `ETag` so the website never holds an expiring link and a no-longer-public image disappears within a day.
- **Privacy.** EXIF / GPS stripping, magic-byte checks, a private bucket, 5-minute URLs, audited staff-document access and 24-hour export retention keep personal data exposure small. ⚠️ Encrypting the database dumps before upload (an extra key the owner must keep) is **not decided** — a recommendation only, nothing is built until the owner says OK (D-PLT-11).

## Consequences
- Easier: VPS disk holds only DB + logs; files and backups are off-site by design; the same storage code runs against MinIO locally and R2 / B2 in production; the website gets stable, cacheable image URLs.
- Harder: an owner-owned bucket account with an international card; keys in `.env`; CSP must list the bucket host; if the app ever `fetch()`es a presigned URL (e.g. to build a share Blob), the bucket needs a CORS rule for the app origin (★ build); a provider outage blocks uploads and website images (the pages still render).
- Revisit when: public image traffic grows (put a CDN in front of `/api/v1/public/media/*` — same path, same cache headers), a second company needs separate buckets (D-ORG-03), or storage exceeds the free / cheap tier.

## Action Items
1. [ ] ★ Owner (build time): create the bucket account (R2 or B2) on the ops Gmail; two buckets (application, backups); versioning 30 days on the application bucket (+ the provider's encryption-at-rest setting); scoped keys (API → application bucket; backup sidecar → backup bucket); keys into the server `.env`.
2. [ ] `StorageService` (S3 client, configurable endpoint) + `AttachmentsModule`: magic-byte detection, image pipeline (HEIC → JPEG, re-encode ≤ 2560 px, EXIF / GPS strip, WebP 400 / 800 / 1600), staging rows, `Attachments.link` / `replace`, policy table (P8-RULE-03), presigned GET (5 min), public media stream with the reference check.
3. [ ] Caddy body cap = `system.upload_max_mb` + 1 MB (ADR-009); CSP `img-src` / `connect-src` with the bucket host.
4. [ ] Jobs `uploads.purge`, `exports.purge`, and the bucket check in `integrity.check_weekly` (ADR-002).
5. [ ] Development: S3-compatible local server (MinIO option) in `docker-compose.dev.yml`; integration tests run against it.
6. [ ] Tests: extension spoofing refused by magic bytes; a binary file renamed `.csv` refused by the text test; public media answers 404 (not 304) after the public flag is switched off; EXIF / GPS gone from stored images; staging expiry and every `attachment_invalid` reason; public media 404 unless referenced; presigned URL expiry; runbook "recover a wrongly deleted file from a non-current version" (🔒 D-PLT-06).
