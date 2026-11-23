"""
Replays the formulas in powerbi/measures.dax in pandas, starting from the same fact table the report loads, and
compares every customer with the Python pipeline's answer (powerbi/data/expected_customers.csv).

    python export_powerbi.py       # once
    python check_dax_logic.py

It cannot run DAX itself, but it checks the part that is easy to get subtly wrong: the tie-break keys, the quintile
bin formula, the telescoping average gap, INT() on recency, and the segment and churn rules.
"""
import math
from pathlib import Path

import numpy as np
import pandas as pd

DATA = Path(__file__).resolve().parent.parent / "powerbi" / "data"


def dax_rank(key: pd.Series, descending: bool) -> pd.Series:
    """RANKX(ALL(DimCustomer), key, , DESC/ASC, SKIP) on keys that are already unique."""
    return key.rank(method="min", ascending=not descending)


def dax_score(rank: pd.Series) -> pd.Series:
    n = len(rank)
    return np.maximum(1, np.ceil((rank - 1) / ((n - 1) / 5))).astype(int)


def main() -> None:
    fact = pd.read_csv(DATA / "fact_sales.csv", parse_dates=["InvoiceDate"])
    expected = pd.read_csv(DATA / "expected_customers.csv").set_index("CustomerID")

    snapshot = fact["InvoiceDate"].max() + pd.Timedelta(days=1)                       # Snapshot[SnapshotDate]
    g = fact.groupby("CustomerID")
    c = pd.DataFrame({
        "FirstPurchase": g["InvoiceDate"].min(), "LastPurchase": g["InvoiceDate"].max(),
        "Frequency": g["Invoice"].nunique(), "Monetary": g["Revenue"].sum(),
    })
    c["RecencyDays"] = (snapshot - c["LastPurchase"]).dt.days                         # INT(snapshot - last)
    # LastOrderTime: an order's time is the earliest line on its invoice; the last order is the latest of those
    c["LastOrderTime"] = fact.groupby(["CustomerID", "Invoice"])["InvoiceDate"].min().groupby("CustomerID").max()
    span = (c["LastOrderTime"] - c["FirstPurchase"]) / pd.Timedelta(days=1)
    c["AvgOrderGapDays"] = np.where(c["Frequency"] > 1, span / (c["Frequency"] - 1).clip(lower=1), c["RecencyDays"])
    cid = c.index.to_series().astype(float)
    c["RankKey_R"] = c["RecencyDays"] - cid / 100000
    c["RankKey_F"] = c["Frequency"] + cid / 100000
    c["RankKey_M"] = (c["Monetary"] * 100).round(0) + cid / 100000
    c["R"] = dax_score(dax_rank(c["RankKey_R"], True))
    c["F"] = dax_score(dax_rank(c["RankKey_F"], False))
    c["M"] = dax_score(dax_rank(c["RankKey_M"], False))

    def segment(r):
        R, F, M = r["R"], r["F"], r["M"]
        if R >= 4 and F >= 4 and M >= 4: return "Champions"
        if R >= 3 and F >= 3: return "Loyal Customers"
        if R >= 4 and F <= 2: return "New Customers"
        if R >= 3 and F <= 2 and M <= 2: return "Potential Loyalists"
        if R <= 2 and F >= 4 and M >= 4: return "At Risk"
        if R <= 2 and F >= 3: return "Needs Attention"
        if R <= 2 and F <= 2 and M >= 4: return "Can't Lose Them"
        if R <= 2 and F <= 2: return "Hibernating"
        return "Lost"

    c["Segment"] = c.apply(segment, axis=1)
    c["ChurnRisk"] = np.where((c["Frequency"] >= 3) & (c["RecencyDays"] > c["AvgOrderGapDays"] * 1.5), "High risk",
                              np.where((c["R"] <= 2) & (c["Frequency"] < 3), "Watch", "Healthy"))

    both = c.join(expected, how="inner")
    n = len(both)
    checks = {
        "recency days": (both["RecencyDays"] == both["recency_days"]).sum(),
        "frequency": (both["Frequency"] == both["frequency"]).sum(),
        "monetary (to 1p)": (np.isclose(both["Monetary"], both["monetary"], atol=0.01)).sum(),
        "R score": (both["R"] == both["r_score"]).sum(),
        "F score": (both["F"] == both["f_score"]).sum(),
        "M score": (both["M"] == both["m_score"]).sum(),
        "segment": (both["Segment"] == both["segment"]).sum(),
        "churn risk": (both["ChurnRisk"] == both["churn_risk"]).sum(),
    }
    print(f"customers compared: {n:,} (expected {len(expected):,})")
    for k, v in checks.items():
        print(f"  {k:<18} {v:>6,} / {n:,}  ({v / n:.2%})")
    bad = both[both["Segment"] != both["segment"]]
    if len(bad):
        print("\nfirst segment differences:")
        print(bad[["R", "r_score", "F", "f_score", "M", "m_score", "Segment", "segment"]].head(8).to_string())
    risk = both.loc[both["ChurnRisk"] == "High risk", "Monetary"].sum()
    print(f"\nrevenue at risk (DAX logic): {risk:,.0f}   Python: {both.loc[both['churn_risk'] == 'High risk', 'monetary'].sum():,.0f}")
    ok = all(v == n for v in checks.values())
    print("\nRESULT:", "every customer matches" if ok else "differences found, see above")


if __name__ == "__main__":
    main()
