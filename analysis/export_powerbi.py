"""
Builds the tables the Power BI report loads, plus the answers the DAX has to reproduce.

    python download_data.py      # once
    python export_powerbi.py

Writes to ../powerbi/data/:
  fact_sales.csv         one row per order line (large, git-ignored: regenerate it with this script)
  dim_customer.csv       one row per customer: id and home country only. RFM, segment, cohort and risk are
                         calculated in DAX so the report shows the logic, not pasted results.
  dim_product.csv        one row per stock code with its most common description
  expected_values.csv    headline numbers computed by the Python pipeline
  expected_segments.csv  customers and revenue per RFM segment (Python)
  expected_cohorts.csv   retention % per cohort and month, months 0 to 6 (Python)
  expected_customers.csv per-customer RFM scores, segment and churn risk (Python), row-for-row check on the DAX
"""
from pathlib import Path

import pandas as pd

from churn import compute_churn_risk
from cohort import compute_cohort_retention
from etl import load_clean
from rfm import compute_rfm

OUT = Path(__file__).resolve().parent.parent / "powerbi" / "data"
OUT.mkdir(parents=True, exist_ok=True)


def main() -> None:
    tx = load_clean().sort_values(["invoice_date", "invoice"]).reset_index(drop=True)

    fact = pd.DataFrame({
        "Invoice": tx["invoice"].astype(str),
        "StockCode": tx["stock_code"].astype(str),
        "CustomerID": tx["customer_id"],
        "InvoiceDate": tx["invoice_date"].dt.strftime("%Y-%m-%d %H:%M:%S"),
        "Quantity": tx["quantity"].astype(int),
        "UnitPrice": tx["unit_price"].round(4),
        "Revenue": tx["revenue"].round(4),
        "Country": tx["country"],
    })
    fact.to_csv(OUT / "fact_sales.csv", index=False)

    rfm = compute_rfm(tx)
    risk = compute_churn_risk(tx, rfm)

    pd.DataFrame({"CustomerID": rfm["customer_id"], "Country": rfm["country"]}).to_csv(OUT / "dim_customer.csv", index=False)

    desc = (tx.groupby("stock_code")["description"].agg(lambda s: s.mode().iat[0] if not s.mode().empty else "")
            .rename("Description").reset_index().rename(columns={"stock_code": "StockCode"}))
    desc["StockCode"] = desc["StockCode"].astype(str)
    desc.to_csv(OUT / "dim_product.csv", index=False)

    orders = tx["invoice"].nunique()
    revenue = tx["revenue"].sum()
    customers = tx["customer_id"].nunique()
    kpis = {
        "total_revenue": round(revenue, 2), "orders": orders, "customers": customers,
        "avg_order_value": round(revenue / orders, 2),
        "repeat_customers": int((rfm["frequency"] >= 2).sum()),
        "repeat_rate_pct": round((rfm["frequency"] >= 2).mean() * 100, 1),
        "first_order": str(tx["invoice_date"].min()), "last_order": str(tx["invoice_date"].max()),
        "snapshot_date": str(tx["invoice_date"].max() + pd.Timedelta(days=1)),
        "high_risk_customers": int((risk["churn_risk"] == "High risk").sum()),
        "watch_customers": int((risk["churn_risk"] == "Watch").sum()),
        "revenue_at_risk": round(risk.loc[risk["churn_risk"] == "High risk", "monetary"].sum(), 2),
    }
    pd.DataFrame({"metric": list(kpis), "value": list(kpis.values())}).to_csv(OUT / "expected_values.csv", index=False)

    (rfm.groupby("segment").agg(customers=("customer_id", "count"), revenue=("monetary", "sum")).round(2)
        .sort_values("revenue", ascending=False).reset_index().to_csv(OUT / "expected_segments.csv", index=False))

    pd.DataFrame(compute_cohort_retention(tx)).to_csv(OUT / "expected_cohorts.csv", index=False)

    cust = risk[["customer_id", "country", "recency_days", "frequency", "monetary", "r_score", "f_score", "m_score",
                 "segment", "churn_risk", "avg_order_gap_days"]].copy()
    cust["monetary"] = cust["monetary"].round(2)
    cust["avg_order_gap_days"] = cust["avg_order_gap_days"].round(2)
    cust.rename(columns={"customer_id": "CustomerID"}).to_csv(OUT / "expected_customers.csv", index=False)

    print(f"fact rows {len(fact):,} | customers {customers:,} | orders {orders:,} | revenue {revenue:,.0f}")
    print(f"high risk {kpis['high_risk_customers']:,} | revenue at risk {kpis['revenue_at_risk']:,.0f}")


if __name__ == "__main__":
    main()
