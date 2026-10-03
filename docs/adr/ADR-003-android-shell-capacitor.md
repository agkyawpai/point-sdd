# ADR-003: Android shell = Capacitor (WebView + native Bluetooth printing), not TWA

**Status:** Accepted — owner 01/Oct/2026 21:20 (decision sheet #10 "Capacitor Android + Bluetooth Classic ESC/POS — OK"; REC-32 → 🔒; forced by 🔒 D-PAY-07 Bluetooth printing). *Was:* Proposed. **Amendment note 02/Oct/2026** (API Part 4 + owner H (1) / H (2)): the printed image is the server-rendered receipt PNG (ADR-013), width per branch setting, auto-print OFF — see *Amendment* under Decision.
**Date:** 01/Oct/2026
**Deciders:** Owner · dev team

> **မြန်မာ အတိုချုပ်** — Android `.apk` (D-PLT-01) ကို **Capacitor** နဲ့ လုပ်မယ်: app ထဲမှာ browser (WebView) တစ်ခု ပါပြီး hosted staff app (`app.<domain>`) ကို ဖွင့်ရုံ — update တိုင်း APK ပြန်မပို့ရ။ ဒါပေမဲ့ receipt ကို Android ဖုန်းကနေ Bluetooth printer နဲ့ ထုတ်ရမယ် (🔒 D-PAY-07) — browser သက်သက် (TWA) က 58mm thermal printer တွေ သုံးတဲ့ Bluetooth Classic ကို မရောက်နိုင်လို့ native plugin ပါတဲ့ Capacitor ကို ရွေး။ iPhone = PWA (print ✖, PDF / share ✔)၊ Windows = Tauri။

## Context
- 🔒 D-PLT-01: web core + Android `.apk` + Windows `.exe`; iOS = PWA (🔒 D-PLT-10). Review §5.1 principle 5: thin native shells that open the hosted app, so updates never require re-distributing an APK.
- 🔒 D-PAY-07 (v4 + 01/Oct): receipt printed **as an image** from the barber's **Android phone to a Bluetooth printer**; PDF / Share works on every device; Print = Android only (capability flag — AD-PWA-02).
- Most 58 / 80 mm thermal receipt printers used in Yangon speak **Bluetooth Classic (SPP)** with ESC/POS (newer models are dual-mode Classic + BLE). Chrome's Web Bluetooth API — available in a TWA, since a TWA *is* Chrome — supports **BLE / GATT only**, so SPP printers are unreachable from any pure browser shell.
- Distribution is a sideloaded APK installed by the admin (D-PLT-01), not Google Play — "web wrapper" store policies do not apply.
- Staff phones: mid-range Android, 4G; the app is a PWA already (service worker, install prompt), so the shell must not break PWA behaviour (cookies, session persistence, file share).

## Decision
Build the Android app with **Capacitor** (current major at build time — ≥ 7 as of 01/Oct/2026, pinned in `apps/android`): a native Android project (`apps/android`) whose WebView loads the hosted staff app (`server.url = https://app.<domain>`, `allowNavigation` restricted to that host). Add a **Bluetooth Classic ESC/POS printer plugin** (community plugin evaluated against a real printer before Part 4 build — see action items) exposed to the web app through one bridge contract defined in `packages/shared` (`shell.capabilities()` → `{ print: { bluetooth: boolean } }`, `shell.print(image)`, `shell.openExternal(url)` and `shell.onDeepLink(handler)` for the Google sign-in hand-off — ADR-005). Printer pairing / selection UI lives in the web app (AD-PWA-02); printing never blocks payment (D-PAY-07). The same web build serves iOS PWA and Windows (Tauri — WebView2, silent print via OS driver later).

### Amendment (02/Oct/2026 — API Part 4 P4-RULE-18 · owner one-sheet H (1) / H (2) · ADR-013)
*The decision above is unchanged; this records what Part 4 fixed about the image the shell prints.*
- **The image comes from the server**, not from the phone: the `DocumentRenderer` (ADR-013) stores a **1-bit PNG** per receipt at the branch setting **`receipt.printer_width_mm`** — **58 mm → 384 px, 80 mm → 576 px** (owner H (2)); the shell downloads it same-origin (`GET /api/v1/sales/{id}/receipt?format=png`, P4.RCP.01 — or the refund twin) and `shell.print(image)` sends it as an ESC/POS raster at the printer's dot width. The plugin therefore only rasterises a ready bitmap — no Myanmar text rendering on the phone.
- **Auto-print = OFF** (`receipt.auto_print` false, client-readable — REC-37 ✅ owner H (2)): Print is always a tap on the success screen or the receipt; a printer error never touches the sale (🔒 D-PAY-07).
- **Printing for a colleague** (iPhone users — 🔒 D-PAY-07): any Android staff member finds the receipt in *Receipts* (today's branch list without amounts, ≤ 7 days, or by exact number — P4.RCP.03 / 04) and prints the same stored PNG.

## Options Considered

### Option A: Capacitor shell + native Bluetooth plugin (chosen)
| Dimension | Assessment |
|-----------|------------|
| Complexity | Low–Medium — one Android project, one plugin, web code unchanged |
| Cost | None beyond a signing key; APK built in CI |
| Scalability | n/a (client shell) |
| Team familiarity | Medium — Capacitor is well documented; Claude Code handles the Kotlin plugin glue |

**Pros:** real Bluetooth Classic access; hosted URL → no APK re-release for updates; other native needs later (camera for QR clock-in is already web-capable, but e.g. background sync in V2) have a home.
**Cons:** a native project to maintain (Gradle, SDK versions, signing); WebView cookie / storage behaviour must be tested for "stay signed in" (D-AUTH-06); plugin quality varies — must be verified with the shop's actual printer model.

### Option B: Trusted Web Activity (TWA) — Chrome renders the PWA full-screen
| Dimension | Assessment |
|-----------|------------|
| Complexity | Lowest — Bubblewrap generates the APK |
| Cost | None |
| Scalability | n/a |
| Team familiarity | Medium |

**Pros:** zero native code; identical to the PWA; Chrome updates itself.
**Cons:** **cannot reach Bluetooth Classic (SPP) printers** (Web Bluetooth = BLE / GATT only) → violates 🔒 D-PAY-07 for the printers the shop uses; depends on Chrome being installed and current on every staff phone; no way to add native features later.

### Option C: Native Android app (Kotlin) with its own WebView
| Dimension | Assessment |
|-----------|------------|
| Complexity | Medium–High (own bridge, own update story) |
| Cost | Developer time |
| Scalability | n/a |
| Team familiarity | Low |

**Pros:** full control.
**Cons:** re-implements what Capacitor provides (bridge, plugins, config); slower for a 2-person team.

### Option D: React Native / Flutter staff app
| Dimension | Assessment |
|-----------|------------|
| Complexity | High — second UI codebase |
| Cost | Doubles front-end work |
| Scalability | n/a |
| Team familiarity | Low–Medium |

**Pros:** native feel.
**Cons:** duplicates ~270 UX rules and all screens already specified for the web app; breaks the "one web build everywhere" principle and the 1-month timeline.

## Trade-off Analysis
- **D-PAY-07 decides it.** Only A, C and D can print over Bluetooth Classic; A is the cheapest of those and keeps the web app as the single UI.
- **Hosted URL vs. bundled assets.** Loading the hosted app means the shell is useless offline — acceptable because V1 has no offline mode anyway (D-VIS-13) and the web app shows its own offline banner. Bundling assets would reintroduce APK re-releases for every UI change.
- **Risk: WebView session behaviour.** Capacitor's WebView keeps cookies persistently by default; verify "stay signed in" survives app kill / reboot on 2–3 real devices before pilot (REC-03).

## Consequences
- Easier: Bluetooth printing from Android; native capabilities later without touching the web app; iOS and Windows keep using the same build.
- Harder: an Android toolchain in CI (Gradle, SDK, keystore secrets); plugin maintenance; printer-model compatibility testing.
- Revisit when: a counter printer appears (D-PAY-07 ⏭ later — Windows silent print via Tauri), or iOS staff need printing (would need a native iOS shell — out of V1).

## Action Items
1. [ ] Evaluate two Bluetooth ESC/POS Capacitor plugins (Classic SPP, and BLE if the shop's printer is dual-mode) with the shop's actual printer (58 mm) — image raster print of a sample receipt (Myanmar text as image, D-PAY-07). Pick one; pin the version. *(02/Oct: test with the **server-rendered 1-bit PNG** of ADR-013 — 384 px; also 576 px if any branch sets `receipt.printer_width_mm` = 80.)*
2. [ ] `apps/android`: Capacitor config (`server.url`, `allowNavigation`, cleartext off), app icon / name placeholders (★ logo from the owner), signing keystore in CI secrets, versioned APK artifact per release tag.
3. [ ] Web bridge contract in `packages/shared`: `shell.capabilities()`, `shell.print(image)`, `shell.openExternal(url)` (Custom Tabs via `@capacitor/browser`), `shell.onDeepLink(handler)` (wraps Capacitor `App.appUrlOpen`; the `point://auth/handoff?done=1` link closes Custom Tabs and triggers an immediate `POST /v1/auth/handoff` poll — ADR-005); PWA path when absent (AD-PWA-02 flag drives the Print button). Register the `point://` scheme in the Android manifest.
4. [ ] Device tests before pilot: **Google sign-in via Custom Tabs → `point://auth/handoff?done=1` → hand-off poll → cookie in the WebView** and OTP login; login persistence after kill / reboot; file share (receipt PDF); camera for QR clock-in; Socket.IO reconnect on network switch.
5. [ ] Runbook: "install the APK on a staff phone" + "pair a printer" (🔒 D-PLT-06).
