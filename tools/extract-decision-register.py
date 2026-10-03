#!/usr/bin/env python3
"""Extract Appendix A (the decision register) from the planning review into
docs/decisions/decision-register.md.

The review file is the master record (rule: a locked decision is edited there first).
This script only copies Appendix A so that specs and Claude Code can read the register
without loading the whole review (about 1 MB).

Usage (from the repo root):
    python tools/extract-decision-register.py
"""
from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DECISIONS = ROOT / "docs" / "decisions"
START = "## Appendix A — Decision Register"
END = "## Appendix B"


def latest_review() -> Path:
    files = sorted(
        DECISIONS.glob("point-barbershop-system-review-v*.md"),
        key=lambda p: [int(n) for n in re.findall(r"\d+", p.stem)],
    )
    if not files:
        sys.exit("No review file found in docs/decisions/")
    return files[-1]


def main() -> None:
    review = latest_review()
    text = review.read_text(encoding="utf-8")
    start = text.find(START)
    end = text.find(END, start)
    if start < 0 or end < 0:
        sys.exit(f"Appendix A markers not found in {review.name}")
    body = text[start:end].rstrip().rstrip("-").rstrip()
    body = body.replace(START, "## Decisions", 1)
    version = re.search(r"v(\d+(?:\.\d+)+)", review.stem).group(1)
    rows = len(re.findall(r"^\| D-[A-Z0-9]+-\d+", body, flags=re.M))
    header = (
        "# Point Barbershop — Decision Register\n\n"
        f"> **Generated file — do not edit.** Source: `{review.name}` Appendix A (review v{version}).\n"
        "> To change a decision: edit Appendix A in the review (plus §3.0 and §0), bump the review version,\n"
        "> then run `python tools/extract-decision-register.py`.\n"
        "> **Only 🔒 rows are requirements** (D-PLT-11). ⚠️ = recommendation, 🟡 = open, ⏭ = not in V1.\n"
        "> A conflict between two rows is never resolved by the reader — stop and ask the owner (D-PLT-13).\n"
        f"> Decision rows: {rows}.\n\n"
    )
    out = DECISIONS / "decision-register.md"
    out.write_text(header + body + "\n", encoding="utf-8")
    print(f"{out.relative_to(ROOT)} written from {review.name}: {rows} decision rows, {len(body):,} chars")


if __name__ == "__main__":
    main()
