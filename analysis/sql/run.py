"""
Runs the SQL versions of Pulse's core analyses against the same cleaned
transaction data, via DuckDB (an embedded analytical SQL engine — standard
SQL, no server to stand up).

This isn't a duplicate of the pandas pipeline for its own sake: it exists to
show the same RFM/cohort/churn logic expressed in SQL, since that's the
skill most data-analyst screens actually probe for. Run it with:

    cd analysis/sql && python run.py
"""
import io
import sys
from pathlib import Path

import duckdb

# DuckDB's pretty-printed tables use box-drawing characters that the default
# Windows console encoding (cp1252) can't render.
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))
from etl import load_clean

QUERIES_DIR = Path(__file__).parent / "queries"


def main() -> None:
    transactions = load_clean()
    con = duckdb.connect()
    con.register("transactions", transactions)

    for sql_file in sorted(QUERIES_DIR.glob("*.sql")):
        print(f"\n{'=' * 70}\n{sql_file.name}\n{'=' * 70}")
        result = con.sql(sql_file.read_text())
        print(result.limit(10))


if __name__ == "__main__":
    main()
