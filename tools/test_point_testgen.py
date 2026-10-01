"""Run: .venv\\Scripts\\python -m unittest tools/test_point_testgen.py"""

import importlib.util
import json
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path

from openpyxl import load_workbook

TOOL = Path(__file__).with_name("point-testgen.py")
spec = importlib.util.spec_from_file_location("point_testgen", TOOL)
testgen = importlib.util.module_from_spec(spec)
spec.loader.exec_module(testgen)

METHOD = "Scope: browser\nMutation: read-only\nPreconditions: x\nSteps:\n1. y\nCleanup: None"


def case(i, **extra):
    return {"selected": True, "id": f"TC-T-{i:03d}", "Classification": "正常系",
            "Content": f"Case {i}", "Test method": METHOD, "Test result": f"Result {i}", **extra}


class TestGen(unittest.TestCase):
    def setUp(self):
        self.dir = Path(tempfile.mkdtemp())
        self.out = self.dir / "out.xlsx"

    def run_tool(self, tests, check=True):
        src = self.dir / "in.json"
        src.write_text(json.dumps({"meta": {"author": "Tester"}, "tests": tests}, ensure_ascii=False),
                       encoding="utf-8")
        return subprocess.run([sys.executable, str(TOOL), "--input", str(src), "--output", str(self.out)],
                              capture_output=True, text=True, check=check)

    def rows(self):
        ws = load_workbook(self.out)["TestCase"]
        return [[c.value for c in r] for r in ws.iter_rows(min_row=testgen.FIRST_ROW)
                if r[1].value]

    def test_unselected_cases_are_skipped_and_numbered(self):
        self.run_tool([case(1), case(2, selected=False), case(3)])
        rows = self.rows()
        self.assertEqual([r[0] for r in rows], [1, 2])
        self.assertEqual([r[1] for r in rows], ["TC-T-001", "TC-T-003"])

    def test_missing_field_is_rejected(self):
        bad = case(1)
        bad["Test result"] = ""
        result = self.run_tool([bad], check=False)
        self.assertNotEqual(result.returncode, 0)
        self.assertIn("missing", result.stdout + result.stderr)

    def test_method_needs_scope_line(self):
        result = self.run_tool([case(1, **{"Test method": "1. click"})], check=False)
        self.assertNotEqual(result.returncode, 0)

    def test_results_kept_and_changed_cases_reset(self):
        self.run_tool([case(1), case(2)])
        wb = load_workbook(self.out)
        ws = wb["TestCase"]
        result_col = [c[0] for c in testgen.COLUMNS].index("Result") + 1
        ws.cell(row=testgen.FIRST_ROW, column=result_col, value="OK")
        ws.cell(row=testgen.FIRST_ROW + 1, column=result_col, value="NG")
        wb.save(self.out)

        changed = case(2)
        changed["Test result"] = "Result 2 (updated)"
        self.run_tool([case(1), changed])
        rows = self.rows()
        self.assertEqual(rows[0][result_col - 1], "OK")
        self.assertIsNone(rows[1][result_col - 1])
        self.assertIn("Previous result: NG", rows[1][result_col + 2])

    def test_check_reports_case_count(self):
        self.run_tool([case(1), case(2), case(3)])
        out = subprocess.run([sys.executable, str(TOOL), "--check", str(self.out)],
                             capture_output=True, text=True, check=True)
        self.assertEqual(json.loads(out.stdout)["cases"], 3)


if __name__ == "__main__":
    unittest.main()
