# ADR-013: Document rendering & printing — one server-side `DocumentRenderer` (HTML → headless Chromium → PDF / 1-bit PNG), stored receipt files, Bluetooth print on the phone

**Status:** Accepted — owner one-sheet **"အကုန်လုံး OK" (02/Oct/2026 00:06)**, item **H (1)** receipt / payslip / report PDF rendered on the server with headless Chromium (correct Myanmar text) and receipt files stored so a reprint is identical · **H (2)** printer width = branch setting, auto-print OFF (**REC-37 ✅**) · **H (5)** new job `receipt.render`. Implements 🔒 D-PAY-06 (reprint identical, same number), D-PAY-07 (receipt printed **as an image** from an Android phone over Bluetooth; PDF / Share on every device; branch printer setting; a printer error never blocks payment), D-PAYR-07 (payslip PDF + Excel in-app), D-DAT-02 (PDF export), D-WEB-02 / D-ATT-01 (QR posters), D-UX-02 (fonts). Used by API Part 4 P4-RULE-18 (🔒 D-API-05), Part 5 P5-RULE-12 (🔒 D-API-06), Part 8 P8-RULE-08 (🔒 D-API-09). Recorded under D-ARC-01.
**Date:** 02/Oct/2026
**Deciders:** Owner (one-sheet H) · dev team

> **မြန်မာ အတိုချုပ်** — Receipt · payslip · report PDF · QR poster ကို **server** က ထုတ်မယ်: HTML template → **headless Chromium** (browser engine) → **PDF**; receipt ကိုတော့ printer အတွက် **အဖြူ / အမည်း PNG** ပါ ထုတ် — 58 mm = 384 px, 80 mm = 576 px (branch setting `receipt.printer_width_mm`)။ ဘာကြောင့်လဲ — မြန်မာစာ (ဗျည်းတွဲ၊ ရရစ်၊ သဝေထိုး) ကို ဖုန်းအမျိုးမျိုးမှာ မှန်မှန်ပေါ်ဖို့ — ဖုန်းပေါ်မှာ ထုတ်ရင် font / shaping ကွဲနိုင်တယ်; server မှာ font (**Pyidaungsu** + **Inter** — D-UX-02) ကို image ထဲ ထည့်ထားလို့ အမြဲ တူ။ Receipt ကို FINISH ပြီးတာနဲ့ နောက်ကွယ်က (job **`receipt.render`**) ထုတ်ပြီး bucket ထဲ **သိမ်း** (ADR-014) — ဘယ်အချိန် ပြန်ထုတ်ထုတ် **ပုံတူ** (D-PAY-06)။ Android app က PNG ကို Bluetooth printer ဆီ ပို့ (ADR-003); iPhone / PC = PDF / Share။ **Auto-print = OFF** (REC-37 ✅) — Print ကို လက်နဲ့ နှိပ်မှ။ Payslip = ဖွင့်တဲ့အချိန် ထုတ် (ဝန်ထမ်းရဲ့ ဘာသာ) · မသိမ်း။ Report / list PDF နဲ့ QR poster = export job ကနေ (ADR-015)။ Server မပင်ပန်းအောင် **Chromium တစ်ခု၊ တစ်ကြိမ် ဖိုင်တစ်ခု** ပဲ ထုတ်; မအောင်မြင်ရင် ၃ ခါ ပြန်ကြိုးစား → နောက်ဆုံး မရရင် admin ကို `job.failed` noti — receipt ကိုတော့ ဖွင့်တဲ့အချိန် ချက်ချင်း ထုတ်ပေးလို့ customer မစောင့်ရ။

## Context
- 🔒 D-PAY-06: receipt number at FINISH, reprint keeps the number; receipt language = **English always** (OPEN-32 ✅) with `*_en` snapshots and **`*_mm` fallback** — so Myanmar glyphs can appear on an English receipt whenever a service / product has no English name.
- 🔒 D-PAY-07: thermal 58 / 80 mm, printed **as an image** (Myanmar text — REC-29) from the barber's Android phone to a Bluetooth printer; PDF / Share on every device (OPEN-20 ✅); branch printer setting; a printer error never blocks payment. REC-37 (auto-print OFF) was ⚠️ — the owner accepted it with H (2).
- 🔒 D-PAYR-07 payslips in-app (PDF + Excel, no e-mail — ADR-007); 🔒 D-DAT-02 export Excel / CSV / PDF; 🔒 D-WEB-02 booking QR poster and 🔒 D-ATT-01 branch attendance QR poster (AD-QR-01 / 02).
- Myanmar script needs **complex text shaping** (stacked consonants, medials, reordered vowel signs). It renders correctly only through an OpenType shaping engine (HarfBuzz) with a Unicode Myanmar font. Phones differ (older Android WebViews, iOS Safari, Windows), and Zawgyi text still circulates (normalised at input — API-SHAPE-05). Common JavaScript PDF libraries lay out glyphs without full complex-script shaping. Chromium shapes with HarfBuzz — the same engine that draws the staff web app.
- Fonts are decided: 🔒 D-UX-02 ✅ (OPEN-31, 01/Oct) — **Pyidaungsu** for Myanmar, **Inter** for tabular numbers / Latin fallback (admin UI = Manrope / Inter); self-hosting is allowed (admin guideline §3 — keep the licence files).
- Thermal printers: 203 dpi = 8 dots / mm; printable width 48 mm on 58 mm paper = **384 dots**, 72 mm on 80 mm paper = **576 dots**; ESC/POS prints raster bitmaps (1 bit per dot).
- Volume: ~90 sales / day (+ refunds and automatic change returns) → ~100 receipts / day; payslips ~15 / month; PDF exports a few / week; posters rare.
- One VPS (4 vCPU / 8 GB — system design §4.1), one API deployable with pg-boss workers inside (ADR-001 / 002).

## Decision
1. **One `DocumentRenderer`** (platform `DocumentsModule`) with `renderPdf(template, data, page)` and `renderPng(template, data, widthPx)`. Typed HTML templates live in `packages/documents` (receipt, refund receipt, payslip MM / EN, report PDF, list PDF, booking QR poster, attendance QR poster) and are rendered to an HTML string **on the server** (every value HTML-escaped — customer and item names are user input). The string is loaded into **headless Chromium** with **JavaScript disabled** and **every network request blocked** (fonts, logo and QR are passed inline or from local files — no remote fetch, no SSRF), then `page.pdf()` / `page.screenshot()`. Driver library = Playwright or Puppeteer, pinned at build (both drive the same Chromium).
2. **Fonts are part of the image:** Pyidaungsu (Regular / Bold) + Inter (🔒 D-UX-02) ship in `packages/documents/fonts` with their licence files, are installed into the API image and referenced by local `@font-face`; the renderer waits for `document.fonts.ready` before printing, so no document is ever drawn with a fallback font.
3. **Receipts** (Part 4 P4-RULE-18):
   - Job **`receipt.render { entity_type: 'sales' | 'refunds', entity_id }`** is enqueued **inside** the FINISH / refund transaction (also for the automatic over-transfer change refund — owner B5) — ADR-002 transactional enqueue.
   - It renders the English receipt (AD-RCPT-01 content) to a **PDF** (page width = paper width, height = content) and a **1-bit PNG** at the sale branch's **`receipt.printer_width_mm`** (branch setting, default 58 — owner H (2)): **58 → 384 px, 80 → 576 px** (viewport = that width, device scale 1, full-page screenshot, then thresholded to a 2-colour palette PNG with the image library chosen at build).
   - Both files are stored as **attachments** (ADR-014; kind 1, entity `sales` / `refunds`, `uploaded_by` = the finisher / refunder). The stored files freeze the branch header, opening hours and thank-you text, so **every reprint is identical** (🔒 D-PAY-06); they can never be removed by hand (P8-RULE-03).
   - `GET /v1/sales/{id}/receipt?format=pdf|png` and the refund twin (P4.RCP.01 / 02) **stream the stored file through the API** (same origin, session cookie — the Android shell gets the bytes it prints). If the job has not run yet, the request renders and stores through the same code path; a per-entity advisory lock (`receipt:<entity_id>`) guarantees the job and an on-the-fly request store **one** set — whoever comes second reads the stored files. Another width (`width=80` at a 58 mm branch) is rendered on the fly and not stored. `format=json` returns the data (`ReceiptView`).
   - A later change of `receipt.printer_width_mm` affects new receipts; reprinting an old one at the new width uses the `width` parameter (on the fly).
4. **Printing stays on the phone** (ADR-003): the Android shell sends the PNG to the paired Bluetooth ESC/POS printer through `shell.print(image)` (raster print); the Print button appears only where `canBluetoothPrint` (AD-PWA-02); PDF / Share works on every device. **`receipt.auto_print` = OFF** (REC-37 ✅ owner H (2)) — printing is always a tap, and a printer error never touches the sale (🔒 D-PAY-07). The server never talks to a printer.
5. **Payslips** (Part 5 P5-RULE-12): rendered **on demand** from the stored payroll snapshot in the **employee's language** (`?lang=` else `users.ui_language`, else the system default), **never stored**; the admin copy carries a "Not final" watermark until FINALIZED. The Excel payslip uses exceljs (not the renderer).
6. **Report / list PDFs and QR posters** (Part 8 P8-RULE-08, ADR-015): only through the background job **`export.run`** (every PDF is a background export) — A4 landscape, the summary + the first **1,000** detail rows (`truncated` note), stored 24 h as an `exports` attachment; posters A5 / A6 with the QR drawn server-side as inline SVG (library at build); the attendance poster's token URL is never logged (AD-QR-02).
7. **Resource limits:** **one Chromium browser process per API instance**, launched on first use and kept warm, rendering **one page at a time** (an in-process queue inside `DocumentRenderer`); interactive renders (a receipt requested before its job ran, a payslip) go ahead of queued background renders. The pg-boss workers of `receipt.render` and `export.run` run with **concurrency 1**, so jobs never pile up holding leases behind the queue. Each render has a timeout (build constant) and closes its page; the browser is restarted after a crash or timeout and recycled after a fixed number of renders (build constant) to cap memory. Chromium runs as its own OS process, so the API keeps answering while a render runs; the Compose memory limit of the API container leaves headroom for it (★ sized at build).
8. **Failure handling:** `receipt.render` — 3 attempts with backoff (ADR-002), idempotent (skips when both files exist); the dead letter raises **`job.failed`** (category 6 SECURITY, mandatory — ADR-007) and shows in the jobs panel (P1.SYS.05). The receipt still opens and prints meanwhile because the GET renders on the fly. `export.run` — 3 attempts; a final failure answers the requester with `export.ready { status: "failed", error_code }` (*My exports*). An on-demand render that fails answers like any server error (500 with `request_id`, error tracking — ADR-007); the client offers *Retry*.

## Options Considered

### Option A: Headless Chromium driven by the API process (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — templates + one renderer service; Chromium in the API image |
| Cost | No extra service; API image grows (Chromium + fonts) and needs memory headroom |
| Scalability | ~1 s per receipt at one page at a time ≫ ~100 receipts / day; the queue absorbs bursts |
| Team familiarity | High — HTML / CSS templates, Playwright / Puppeteer are common |

**Pros:** correct Myanmar shaping (HarfBuzz) with the decided fonts; one template language for every document; PDF and printer PNG from the same HTML; identical output on every device; stored receipts make reprints exact.
**Cons:** a browser to keep patched in the API image; memory spikes during a render; golden-image tests needed.

### Option B: Separate rendering container (Gotenberg / browserless) called over HTTP
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium — one more container and its API |
| Cost | Extra container + memory; another service to monitor and hand over (🔒 D-PLT-06) |
| Scalability | Isolated; can be scaled alone |
| Team familiarity | Medium |

**Pros:** a Chromium crash or memory spike can never touch the API process; image updates independent of the API.
**Cons:** more moving parts for ~100 documents a day; same Chromium underneath. Kept as the revisit path behind the same `DocumentRenderer` interface.

### Option C: JavaScript PDF library on the server (pdfmake / PDFKit / react-pdf)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–Medium |
| Cost | Light — no browser |
| Scalability | Fine |
| Team familiarity | Medium |

**Pros:** small footprint, fast.
**Cons:** no full complex-script shaping → Myanmar text breaks (fails H (1) "မြန်မာစာ မှန်"); the printer PNG would need a second rendering path; layouts written in a second, non-HTML language.

### Option D: Render on the client (browser print, canvas / html2canvas on the phone)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low on the server |
| Cost | None on the server |
| Scalability | n/a |
| Team familiarity | High |

**Pros:** no server load.
**Cons:** output depends on each phone's fonts and WebView → Myanmar text and layout differ per device; no stored copy → reprints not guaranteed identical (🔒 D-PAY-06); iOS PWA print limits; payslip / report PDFs would differ by device. Rejected by the owner's H (1).

### Option E: wkhtmltopdf / LaTeX / Typst
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium |
| Cost | Light |
| Scalability | Fine |
| Team familiarity | Low |

**Pros:** no full browser.
**Cons:** wkhtmltopdf is unmaintained and uses an old WebKit; LaTeX / Typst bring a second template language and unproven Myanmar shaping for this font set.

## Trade-off Analysis
- **Correct Myanmar text vs. resource cost.** Only a real shaping engine meets H (1); Chromium is that engine, and its cost (memory during a render, a larger image) is bounded by the one-page-at-a-time rule at this volume.
- **Stored vs. rendered receipts.** Storing two small files per sale costs little bucket space (ADR-014) and buys exact reprints even after branch data, hours or thank-you text change; payslips are rendered from the immutable payroll snapshot, so they need no stored file.
- **In-process vs. separate service.** In-process keeps one deployable (ADR-001) and one less thing to hand over; the `DocumentRenderer` interface allows moving to Option B without touching callers.

## Consequences
- Easier: identical documents on every device and on every reprint; the phone only sends a ready bitmap to the printer; one template system for receipts, payslips, reports and posters.
- Harder: the API image carries Chromium + fonts and must be rebuilt for browser security updates; render timeouts / crashes must be handled; golden-image tests (Myanmar stacked text, both widths); memory headroom on the VPS.
- Revisit when: the render queue makes users wait at peak, or Chromium memory / crashes affect the API → move rendering to a separate container (Option B) behind the same interface; a counter printer arrives (D-PAY-07 ⏭ — Windows silent print via Tauri can print the same PDF / PNG — ADR-003).

## Action Items
1. [ ] `packages/documents`: templates (receipt + refund receipt per AD-RCPT-01, payslip MM / EN per AD-PAY-03, report / list PDF per AD-LIST-07, booking poster AD-QR-01, attendance poster AD-QR-02); fonts Pyidaungsu + Inter with licence files; HTML escaping enforced by the template engine.
2. [ ] `DocumentRenderer`: Chromium launch (headless, JavaScript off, request interception blocking all network, run as a non-root user), `document.fonts.ready` wait, per-render timeout, single-page queue with interactive priority, restart / recycle; PNG → 1-bit palette (384 / 576 px).
3. [ ] Receipt pipeline: `receipt.render` handler (idempotent, advisory lock `receipt:<entity_id>`), attachment store (ADR-014), P4.RCP.01 / 02 stream + on-the-fly fallback + `width` override.
4. [ ] API Dockerfile: Chromium + fonts; Compose memory limit with headroom; monthly image rebuild with dependency / browser updates (runbook — 🔒 D-PLT-06).
5. [ ] Tests: golden images (Myanmar fallback names with stacked consonants, 58 and 80 mm), PDF text extraction, job-vs-GET race stores one set, timeout / crash restart, `receipt.auto_print` default false; device test of the server PNG on the shop's printer (ADR-003 action item 1).
