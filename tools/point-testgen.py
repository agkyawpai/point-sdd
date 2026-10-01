"""Build a test specification workbook from a reviewed temp_tests.json.

    .venv\\Scripts\\python tools\\point-testgen.py --input <temp_tests.json> --output <workbook.xlsx>
    .venv\\Scripts\\python tools\\point-testgen.py --check <workbook.xlsx>

Sheets: Title, TestCase, Evidence, NG Report, List.

If the output workbook already exists, tester columns (Tester, Test Date,
Result, NG No, Confirmed Date, Remarks) are carried over by case ID. A case
whose content changed is reset to blank Result and the old result is noted
in Remarks.
"""

import argparse
import datetime as dt
import hashlib
import json
import math
import re
import sys
from pathlib import Path

from openpyxl import Workbook, load_workbook
from openpyxl.formatting.rule import FormulaRule
from openpyxl.styles import Alignment, Border, Font, PatternFill, Side
from openpyxl.utils import get_column_letter
from openpyxl.worksheet.datavalidation import DataValidation

CLASSIFICATIONS = ["正常系", "異常系", "境界値"]
RESULTS = ["OK", "NG"]
NG_TYPES = ["仕様漏れ", "プログラムミス", "その他"]
REQUIRED = ("Classification", "Content", "Test method", "Test result")
SCOPE_RE = re.compile(r"^Scope:\s*(browser|browser-context|standalone-api-db|ambiguous)\b", re.M)

HEADER_ROW = 7
FIRST_ROW = 8
MAX_ROW = 3000
NG_ROWS = 100

# (header, width, json key or None for tester columns)
COLUMNS = [
    ("No", 6, "_no"),
    ("ID", 13, "id"),
    ("Classification", 12, "Classification"),
    ("Content", 34, "Content"),
    ("Test method", 58, "Test method"),
    ("Expected result", 46, "Test result"),
    ("Reference", 22, "Reference"),
    ("Tester", 13, None),
    ("Test Date", 12, None),
    ("Result", 9, None),
    ("NG No", 8, None),
    ("Confirmed Date", 12, None),
    ("Remarks", 30, None),
    ("Hash", 10, "_hash"),
]
TESTER_COLS = ["Tester", "Test Date", "Result", "NG No", "Confirmed Date", "Remarks"]
COL = {name: get_column_letter(i) for i, (name, _, _) in enumerate(COLUMNS, start=1)}

FONT = "Arial"
F_BASE = Font(name=FONT, size=10)
F_BOLD = Font(name=FONT, size=10, bold=True)
F_HEAD = Font(name=FONT, size=10, bold=True, color="FFFFFF")
F_TITLE = Font(name=FONT, size=16, bold=True)
F_MUTED = Font(name=FONT, size=9, color="5B6577")
FILL_HEAD = PatternFill("solid", fgColor="2F4A6D")
FILL_TESTER_HEAD = PatternFill("solid", fgColor="7A5C00")
FILL_INPUT = PatternFill("solid", fgColor="FFF8D6")
FILL_LABEL = PatternFill("solid", fgColor="E8EDF3")
THIN = Side(style="thin", color="B7C1CE")
BORDER = Border(left=THIN, right=THIN, top=THIN, bottom=THIN)
WRAP = Alignment(wrap_text=True, vertical="top")
CENTER = Alignment(horizontal="center", vertical="top", wrap_text=True)
MID = Alignment(horizontal="center", vertical="center", wrap_text=True)


# ── Input ──────────────────────────────────────────────────────────────────

def load_tests(path):
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:
        sys.exit(f"[ERROR] Cannot read {path}: {e}")
    if "tests" not in data:
        sys.exit("[ERROR] Invalid JSON: missing 'tests' key")
    tests = [t for t in data["tests"] if t.get("selected", True)]
    if not tests:
        sys.exit("[ERROR] No tests selected")
    seen = set()
    for i, t in enumerate(tests, start=1):
        missing = [f for f in REQUIRED if not str(t.get(f, "")).strip()]
        if missing:
            sys.exit(f"[ERROR] Test {i} is missing: {', '.join(missing)}")
        if t["Classification"] not in CLASSIFICATIONS:
            sys.exit(f"[ERROR] Test {i}: Classification must be one of {CLASSIFICATIONS}")
        if not SCOPE_RE.search(t["Test method"]):
            sys.exit(f"[ERROR] Test {i}: Test method must start with a 'Scope:' line")
        t.setdefault("id", f"TC-{i:03d}")
        if t["id"] in seen:
            sys.exit(f"[ERROR] Duplicate ID {t['id']}")
        seen.add(t["id"])
        t["_hash"] = case_hash(t)
    return data.get("meta", {}), tests


def case_hash(test):
    keys = ("Classification", "Content", "Test method", "Test result", "Reference")
    raw = json.dumps({k: test.get(k, "") for k in keys}, ensure_ascii=False, sort_keys=True)
    return hashlib.sha1(raw.encode("utf-8")).hexdigest()[:10]


def read_previous(path):
    if not path.exists():
        return {}
    ws = load_workbook(path)["TestCase"]
    header = [c.value for c in ws[HEADER_ROW]]
    if "ID" not in header:
        return {}
    idx = {h: i for i, h in enumerate(header) if h}
    prev = {}
    for row in ws.iter_rows(min_row=FIRST_ROW, values_only=True):
        cid = row[idx["ID"]]
        if cid:
            prev[cid] = {"hash": row[idx["Hash"]], **{c: row[idx[c]] for c in TESTER_COLS}}
    return prev


def merge(test, prev, today):
    old = prev.get(test["id"])
    if not old:
        return {}, "new"
    values = {c: old.get(c) for c in TESTER_COLS}
    if old["hash"] == test["_hash"]:
        return values, "kept"
    if values.get("Result"):
        by = f" by {values['Tester']}" if values.get("Tester") else ""
        note = f"[{today}] Case changed. Previous result: {values['Result']}{by}. Re-test."
        values["Remarks"] = f"{note}\n{values.get('Remarks') or ''}".strip()
    values["Result"] = None
    return values, "changed"


# ── Sheets ─────────────────────────────────────────────────────────────────

def header_cells(ws, row, headers, widths, tester=()):
    for i, (h, w) in enumerate(zip(headers, widths), start=1):
        c = ws.cell(row=row, column=i, value=h)
        c.font, c.alignment, c.border = F_HEAD, MID, BORDER
        c.fill = FILL_TESTER_HEAD if h in tester else FILL_HEAD
        ws.column_dimensions[get_column_letter(i)].width = w
    ws.row_dimensions[row].height = 30


def label_value(ws, row, col, label, value, value_span=1):
    a = ws.cell(row=row, column=col, value=label)
    a.font, a.fill, a.border, a.alignment = F_BOLD, FILL_LABEL, BORDER, WRAP
    b = ws.cell(row=row, column=col + 1, value=value)
    b.font, b.border, b.alignment = F_BASE, BORDER, WRAP
    if value_span > 1:
        ws.merge_cells(start_row=row, start_column=col + 1, end_row=row, end_column=col + value_span)


def row_height(texts):
    lines = 1
    for text, width in texts:
        chars = max(int(width * 1.1), 6)
        lines = max(lines, sum(max(1, math.ceil(len(p) / chars)) for p in str(text).split("\n")))
    return min(max(16, lines * 13 + 4), 409)


def build_title(wb, meta, today):
    ws = wb.active
    ws.title = "Title"
    for col, w in zip("ABCDEFG", (4, 16, 14, 18, 14, 18, 14)):
        ws.column_dimensions[col].width = w
    ws["B2"] = "Test Specification and Report"
    ws["B2"].font = F_TITLE
    label_value(ws, 4, 2, "System Name", meta.get("systemName", ""), 5)
    label_value(ws, 5, 2, "Sub System Name", meta.get("subSystemName", ""), 5)
    header_cells(ws, 8, ["", "", "Created Date", "Author", "Review Date", "Reviewer",
                         "Approval Date"], [4, 16, 14, 18, 14, 18, 14])
    ws.cell(row=8, column=1).fill = PatternFill(None)
    ws.cell(row=8, column=1).border = Border()
    ws.cell(row=8, column=2).value = "Document"
    for r, label in ((9, "Specification"), (10, "Report")):
        ws.cell(row=r, column=2, value=label).font = F_BOLD
        ws.cell(row=r, column=3, value=today)
        ws.cell(row=r, column=4, value=meta.get("author", ""))
        for col in range(2, 8):
            c = ws.cell(row=r, column=col)
            c.border, c.alignment = BORDER, CENTER
            if col != 2:
                c.font = F_BASE
            if col in (3, 5, 7):
                c.number_format = "yyyy-mm-dd"
    ws["B12"] = "Report is filled in after testing; review and approval dates by the reviewer."
    ws["B12"].font = F_MUTED


def build_testcase(wb, meta, tests, prev, today, stats):
    ws = wb.create_sheet("TestCase")
    ws["A1"] = "Test Specification"
    ws["A1"].font = F_TITLE
    label_value(ws, 2, 3, "System Name", meta.get("systemName", ""), 2)
    label_value(ws, 3, 3, "Sub System Name", meta.get("subSystemName", ""), 2)
    label_value(ws, 2, 7, "Create Date", today)
    ws.cell(row=2, column=8).number_format = "yyyy-mm-dd"
    label_value(ws, 3, 7, "Author", meta.get("author", ""))

    res = f"${COL['Result']}${FIRST_ROW}:${COL['Result']}${MAX_ROW}"
    ids = f"${COL['ID']}${FIRST_ROW}:${COL['ID']}${MAX_ROW}"
    summary = [
        ("Total", f"=COUNTA({ids})"),
        ("OK", f'=COUNTIF({res},"OK")'),
        ("NG", f'=COUNTIF({res},"NG")'),
        ("Not run", "=D5-F5-H5"),
        ("Progress", '=IF(D5=0,0,F5/D5)'),
    ]
    for i, (label, formula) in enumerate(summary):
        col = 3 + i * 2
        label_value(ws, 5, col, label, formula)
        ws.cell(row=5, column=col + 1).alignment = CENTER
    ws.cell(row=5, column=12).number_format = "0.0%"

    header_cells(ws, HEADER_ROW, [c[0] for c in COLUMNS], [c[1] for c in COLUMNS], TESTER_COLS)
    for r, test in enumerate(tests, start=FIRST_ROW):
        tester, state = merge(test, prev, today)
        stats[state] += 1
        texts = []
        for i, (name, width, key) in enumerate(COLUMNS, start=1):
            if key == "_no":
                value = r - FIRST_ROW + 1
            elif key is None:
                value = tester.get(name)
            else:
                value = test.get(key) or None
            c = ws.cell(row=r, column=i, value=value)
            c.font, c.border = F_BASE, BORDER
            c.alignment = CENTER if name in ("No", "Classification", "Result", "NG No") else WRAP
            if name in TESTER_COLS:
                c.fill = FILL_INPUT
            if name in ("Test Date", "Confirmed Date"):
                c.number_format = "yyyy-mm-dd"
            if isinstance(value, str):
                texts.append((value, width))
        ws.row_dimensions[r].height = row_height(texts)

    last = FIRST_ROW + len(tests) - 1
    ws.freeze_panes = ws.cell(row=FIRST_ROW, column=3)
    ws.auto_filter.ref = f"A{HEADER_ROW}:{COL['Remarks']}{last}"
    ws.column_dimensions[COL["Hash"]].hidden = True

    def dv(formula, col, title):
        v = DataValidation(type="list", formula1=formula, allow_blank=True,
                           showErrorMessage=True, errorTitle=title,
                           error=f"Choose a value from the {title} list")
        v.add(f"{COL[col]}{FIRST_ROW}:{COL[col]}{MAX_ROW}")
        ws.add_data_validation(v)

    dv("List!$A$2:$A$3", "Result", "Result")
    dv("List!$B$2:$B$30", "Tester", "Tester")
    dv("List!$D$2:$D$4", "Classification", "Classification")
    d = DataValidation(type="date", operator="greaterThan", formula1="DATE(2026,1,1)",
                       allow_blank=True, showErrorMessage=True, errorTitle="Date",
                       error="Enter a date, e.g. 2026-10-15")
    d.add(f"{COL['Test Date']}{FIRST_ROW}:{COL['Test Date']}{MAX_ROW}")
    d.add(f"{COL['Confirmed Date']}{FIRST_ROW}:{COL['Confirmed Date']}{MAX_ROW}")
    ws.add_data_validation(d)

    rng = f"{COL['Result']}{FIRST_ROW}:{COL['Result']}{MAX_ROW}"
    for value, color in (("OK", "C6EFCE"), ("NG", "FFC7CE")):
        ws.conditional_formatting.add(rng, FormulaRule(
            formula=[f'${COL["Result"]}{FIRST_ROW}="{value}"'],
            fill=PatternFill("solid", fgColor=color)))
    ws.sheet_view.zoomScale = 90


def build_evidence(wb, tests):
    ws = wb.create_sheet("Evidence")
    ws.column_dimensions["A"].width = 10
    ws.column_dimensions["B"].width = 100
    header_cells(ws, 1, ["No", "Paste screenshots below each case number. Attach data if needed."],
                 [10, 100])
    r = 2
    for i, test in enumerate(tests, start=1):
        c = ws.cell(row=r, column=1, value=i)
        c.font, c.alignment = F_BOLD, CENTER
        ws.cell(row=r, column=2, value=f"{test['id']}  {test['Content']}").font = F_BOLD
        r += 20  # room for a screenshot


def build_ng_report(wb, meta, today):
    ws = wb.create_sheet("NG Report")
    ws["A1"] = "NG Report"
    ws["A1"].font = F_TITLE
    label_value(ws, 2, 3, "System Name", meta.get("systemName", ""), 2)
    label_value(ws, 3, 3, "Sub System Name", meta.get("subSystemName", ""), 2)
    first, last = 8, 7 + NG_ROWS
    cls = f"$C${first}:$C${last}"
    summary = [
        ("Total NG", f"=COUNTA($B${first}:$B${last})"),
        ("仕様漏れ", f'=COUNTIF({cls},"仕様漏れ")'),
        ("プログラムミス", f'=COUNTIF({cls},"プログラムミス")'),
        ("その他", f'=COUNTIF({cls},"その他")'),
    ]
    for i, (label, formula) in enumerate(summary):
        label_value(ws, 5, 3 + i * 2, label, formula)
        ws.cell(row=5, column=4 + i * 2).alignment = CENTER
    headers = ["No", "Case No", "Classification", "NG Content", "Fix Content",
               "Fixed By", "Fixed Date", "Confirmed By", "Confirmed Date"]
    widths = [6, 10, 16, 44, 44, 14, 12, 14, 12]
    header_cells(ws, 7, headers, widths)
    for r in range(first, last + 1):
        ws.cell(row=r, column=1, value=f'=IF(B{r}="","",ROW()-{first - 1})')
        for col in range(1, len(headers) + 1):
            c = ws.cell(row=r, column=col)
            c.font, c.border = F_BASE, BORDER
            c.alignment = CENTER if col in (1, 2, 3) else WRAP
            if col > 1:
                c.fill = FILL_INPUT
            if col in (7, 9):
                c.number_format = "yyyy-mm-dd"
    v = DataValidation(type="list", formula1="List!$C$2:$C$4", allow_blank=True)
    v.add(cls.replace("$", ""))
    ws.add_data_validation(v)
    t = DataValidation(type="list", formula1="List!$B$2:$B$30", allow_blank=True)
    t.add(f"F{first}:F{last}")
    t.add(f"H{first}:H{last}")
    ws.add_data_validation(t)
    ws.freeze_panes = "A8"


def build_list(wb, meta):
    ws = wb.create_sheet("List")
    testers = meta.get("testers") or [meta.get("author", "")]
    columns = [("Result", RESULTS), ("Tester", testers), ("NG Classification", NG_TYPES),
               ("Classification", CLASSIFICATIONS)]
    for i, (head, values) in enumerate(columns, start=1):
        ws.cell(row=1, column=i, value=head).font = F_BOLD
        ws.column_dimensions[get_column_letter(i)].width = 20
        for r, v in enumerate(values, start=2):
            ws.cell(row=r, column=i, value=v).font = F_BASE
    ws.cell(row=1, column=6, value="Add testers in column B (rows 2–30).").font = F_MUTED


# ── Check ──────────────────────────────────────────────────────────────────

def check(path):
    ws = load_workbook(path)["TestCase"]
    header = [c.value for c in ws[HEADER_ROW]]
    idx = {h: i for i, h in enumerate(header) if h}
    problems, count = [], 0
    for row in ws.iter_rows(min_row=FIRST_ROW, values_only=True):
        if row[idx["ID"]] is None:
            break
        count += 1
        if row[idx["No"]] != count:
            problems.append(f"row {count}: No is {row[idx['No']]}, expected {count}")
        for field in ("Classification", "Content", "Test method", "Expected result"):
            if not row[idx[field]]:
                problems.append(f"{row[idx['ID']]}: empty {field}")
    print(json.dumps({"cases": count, "problems": problems}, ensure_ascii=False, indent=2))
    return 0 if not problems else 1


def main():
    ap = argparse.ArgumentParser(description="Build a test specification workbook.")
    ap.add_argument("--input", type=Path, help="temp_tests.json")
    ap.add_argument("--output", type=Path, help="Output .xlsx")
    ap.add_argument("--check", type=Path, help="Validate a generated workbook and exit")
    args = ap.parse_args()

    if args.check:
        sys.exit(check(args.check))
    if not args.input or not args.output:
        ap.error("--input and --output are required (or use --check)")

    meta, tests = load_tests(args.input)
    now = dt.datetime.now()
    today = now.date()
    prev = read_previous(args.output)
    stats = {"new": 0, "kept": 0, "changed": 0}

    wb = Workbook()
    build_title(wb, meta, today)
    build_testcase(wb, meta, tests, prev, today.isoformat(), stats)
    build_evidence(wb, tests)
    build_ng_report(wb, meta, today)
    build_list(wb, meta)

    removed = sorted(set(prev) - {t["id"] for t in tests})
    args.output.parent.mkdir(parents=True, exist_ok=True)
    try:
        wb.save(args.output)
    except PermissionError:
        sys.exit(f"[ERROR] Cannot write {args.output} — close it in Excel and run again")
    print(f"Wrote {len(tests)} test cases to {args.output} "
          f"({stats['new']} new, {stats['kept']} kept results, {stats['changed']} changed)")
    if removed:
        print("Removed since last build (results dropped): " + ", ".join(removed))


if __name__ == "__main__":
    main()
