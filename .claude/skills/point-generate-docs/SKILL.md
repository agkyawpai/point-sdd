---
name: point-generate-docs
description: Generate a change documentation workbook (Overview / UIUX / Diagrams / Detailed Design / Database Design) from one or more OpenSpec change folders in this repo. Use when the user asks for design docs, documentation or a doc workbook for a change.
---

# Generate a documentation workbook from OpenSpec changes

You act as a technical writer for the Point Barbershop System. Read one or more OpenSpec changes, synthesize their content, let the user review it as JSON, then build an Excel workbook with `tools/point-docgen.py`.

## Rules and paths

- Write only inside this repo's `work/` folder. Application repos added with `/add-dir` are **read-only**: you may read controllers, routes and migrations named in the change documents to get API and database details right, but never edit them.
- Never write into `openspec/` from this skill.

| What | Where |
|---|---|
| Manifest | `work/temp_manifest.json` |
| Review JSON | `work/temp_doc.json` |
| Workbook | `work/Design Docs/<suffix> - Documentation.xlsx` |
| Generator | `.venv\Scripts\python tools\point-docgen.py` |

`<slug>` (temp file names) = the suffix lowercased with spaces turned into `-`.

## Step 1 — Find the changes

Input: `{{user_input}}`

- **Absolute path to a folder** → that folder is the only source. Skip discovery; go to Step 2 with one group and a blank suffix.
- **A name or description** → look at `openspec/changes/*/` (skip `openspec/changes/archive/` unless the user says "archive" or "archived"). A folder matches when its name contains a word from the input, or the first heading of its `proposal.md` does. No match → say so and offer to list everything. Don't guess.
- **Nothing** → list active changes as a numbered menu (`name` — one-line summary from the proposal) and ask which to document. Several related ones may be combined.

## Step 2 — Manifest (user review)

For each candidate, note which artifacts exist: `proposal.md`, `design.md`, `specs/**/spec.md`, `tasks.md`.

Group changes that share a feature and concern into one workbook; unrelated changes get separate workbooks. Propose an `outputSuffix` per group. Write `work/temp_manifest.json`:

```json
{
  "groups": [
    {
      "outputSuffix": "Appointment Booking",
      "sources": ["openspec/changes/add-online-booking", "openspec/changes/booking-reminders"],
      "artifactStatus": {
        "openspec/changes/add-online-booking": {"proposal": true, "design": true, "specs": true, "tasks": true},
        "openspec/changes/booking-reminders": {"proposal": true, "design": false, "specs": true, "tasks": false}
      }
    }
  ]
}
```

Show each group as a table (change | proposal | design | specs | tasks, with yes/no), say that missing artifacts give thin sections, and ask the user to edit the file freely (sources, suffixes, merge/split groups) and reply "ready". Wait.

## Step 3 — Re-read and validate

Re-read the manifest. For each group:

1. Trim the suffix; if blank, use the first source folder's name.
2. Reject `< > : " / \ | ? *` in the suffix and ask for another.
3. Output path = `work/Design Docs/<suffix> - Documentation.xlsx`. If it exists, ask before overwriting.
4. Check artifacts on disk and warn per missing file:
   - `proposal.md` → "Why" and "What is changed" will be empty.
   - `design.md` → "How the process works" and the Detailed Design decisions will be empty.
   - `specs/**/spec.md` → "How to test" conditions will be empty.
   - `tasks.md` → "How to test" steps will be thin.

If anything is missing, ask "Proceed anyway?" and stop only if the user says no.

## Per group: Steps 4–10

Handle groups one at a time, in manifest order. Finish a group before starting the next.

### Step 4 — Synthesize

Optional head start: `.venv\Scripts\python tools\point-docgen.py --draft <change-dir> [<change-dir> ...] --json-out work\temp_doc.json` drafts the JSON mechanically (Why, What Changes bullets, decision titles, scenario names, verification tasks). Treat it as raw material — rewrite it into proper prose below.

Read every artifact in the group and merge across changes:

- **1. Why the change** — from each `## Why`. One shared motivation → one narrative; distinct motivations → a short intro plus one `•` bullet per change.
- **2. What is changed** — all `## What Changes` bullets as one `•` list, duplicates removed.
- **3. How the process works** — numbered steps (1, 2, 3…) built from `design.md` `## Decisions` and any `## Migration Plan`.
- **4. How to test** — `Conditions:` from every `#### Scenario` in the specs, then `Steps:` from the verification section of every `tasks.md`. Format: `Conditions:\n• …\n\nSteps:\n1. …`.
- **Diagram** — one `flowchart TD` Mermaid diagram of 5–10 nodes covering the core flow of the group, with a descriptive title.
- **Decisions** — one entry per decision: `{"process": "<title>", "contents": "<numbered explanation>"}`. If two changes use the same title, prefix it with the change name.
- **API structure** — only if a change touches an endpoint. Read the referenced controller/routes (read-only), merge all endpoints, mark fields added by this group with `isNew: true`, set `present: true`. Otherwise `present: false`.
- **Database design** — only if a change touches tables. Read the referenced migrations (read-only), merge columns per table, mark added columns `isNew: true`, set `present: true`. Otherwise `present: false`.

### Step 5 — Confirm the Overview

Show the four Overview bodies under their headings and ask for corrections. Apply them.

### Step 6 — UI screenshots

Ask for an absolute folder of UI screenshots (PNG/JPG/JPEG/GIF), or blank for none.

- Blank → `uiux.images = []`.
- Folder → one entry per image: `caption` = file name without extension, `path` = absolute path.
- Set `uiux.note` to a short line that fits (for example where screenshots go, or that none exist yet).

Embedding images needs Pillow in `.venv`; without it the captions are written and the images skipped with a warning.

### Step 7 — Diagram rendering

Ask whether `mmdc` (`@mermaid-js/mermaid-cli`) is on PATH.

- **Yes** → write the source to `work/<slug>.mmd`, run `mmdc -i "work\<slug>.mmd" -o "work\<slug>-diagram.png"`. On success set `diagrams.renderedImage` to the PNG's absolute path and a matching `instruction`. On failure report the error and use the "no" path.
- **No** → `renderedImage: ""` and `instruction`: "Mermaid source is provided below. Import it into draw.io (https://app.diagrams.net) or render it at https://mermaid.live, export a PNG and insert it in the rows below."

### Step 8 — Confirm Detailed Design and Database Design

Show the decisions (numbered process/contents), the API route, request parameters (field/type/required/description) and response fields (field/type/when present/description, section rows noted), and each table's columns — with new items marked. Apply corrections.

### Step 9 — Write the review JSON

Re-confirm the output path (re-validate if the user changes the suffix). Write `work/temp_doc.json`:

```json
{
  "meta": {"title": "<display title>", "outputSuffix": "<suffix>"},
  "overview": {"sections": [{"title": "1. Why the change", "body": "..."}, {"title": "2. What is changed", "body": "..."},
                            {"title": "3. How the process works", "body": "..."}, {"title": "4. How to test", "body": "..."}]},
  "uiux": {"note": "...", "images": [{"caption": "...", "path": "..."}]},
  "diagrams": {"title": "...", "instruction": "...", "mermaid": "flowchart TD ...", "renderedImage": ""},
  "detailedDesign": {
    "decisions": [{"process": "...", "contents": "..."}],
    "apiStructure": {
      "present": true, "route": "...", "responseSummary": "...",
      "requestParams": [{"field": "...", "type": "...", "required": "...", "desc": "...", "isNew": false}],
      "responseRows": [{"field": "...", "type": "...", "when": "...", "desc": "...", "isNew": false, "isSection": false}]
    }
  },
  "databaseDesign": {
    "present": true,
    "tables": [{"name": "...", "description": "...",
                "columns": [{"name": "...", "type": "...", "null": "...", "default": "...", "extra": "...",
                             "comments": "...", "desc": "...", "isNew": false}]}]
  }
}
```

Tell the user the file is ready for final edits and wait for "ready".

### Step 10 — Build

```powershell
New-Item -ItemType Directory -Force "work\Design Docs" | Out-Null
.venv\Scripts\python tools\point-docgen.py --input "work\temp_doc.json" --output "work\Design Docs\<suffix> - Documentation.xlsx"
```

If `.venv\Scripts\python` or the tool is missing, stop and point the user to `SETUP.md`. If the save fails, the workbook is probably open in Excel — ask the user to close it.

On success report the output path, then delete this group's temp files and list them together:

- always `work\temp_doc.json`
- `work\<slug>.mmd` if it was written this run
- `work\<slug>-diagram.png` if mmdc produced it

If the build failed, keep all temp files and do not move on to the next group.

## After all groups

If every group succeeded, delete `work\temp_manifest.json` and say so; keep it if any group failed. Finish with a list of every workbook generated.

## Workbook contents (for reference)

| Sheet | Contents |
|---|---|
| Overview | Title bar, then the four sections (heading row + body row each) |
| UIUX | Title bar, note, then one caption row per screenshot with the image below |
| Diagrams | Title bar, instruction, Mermaid source block (B6:H11), "Insert rendered diagram PNG below:" with the PNG at B15 if rendered |
| Detailed Design | No / Process / Processing Contents table; if an API is present: Route, Request Parameters, Response Structure (new fields highlighted yellow and bold) |
| Database Design | Only when `databaseDesign.present`: per table a header (number, name, change description) and a column table (# / Name / Type / Null / Default / Extra / Comments / Description), new columns highlighted |
