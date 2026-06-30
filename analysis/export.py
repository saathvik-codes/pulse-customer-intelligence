"""
Runs the full pipeline and writes pre-computed JSON for the dashboard.

Why pre-computed JSON instead of a live database: this is a fixed historical
dataset (it doesn't get new transactions), so there's no real-time ingestion
need. Computing once at build time and shipping static JSON is faster, has
zero infra/cost, and is a perfectly standard pattern for a BI dashboard over
a closed dataset — the heavy lifting (the actual SQL/pandas analysis) still
happens in real code, it just doesn't need to re-run per page view.
"""
import json
from pathlib import Path

import pandas as pd

from churn import compute_churn_risk
from cohort import compute_cohort_retention
from etl import load_clean
from rfm import compute_rfm

OUTPUT_DIR = Path(__file__).parent / "output"


def build_kpis(transactions: pd.DataFrame, rfm: pd.DataFrame) -> dict:
    total_revenue = float(transactions["revenue"].sum())
    total_orders = int(transactions["invoice"].nunique())
    total_customers = int(transactions["customer_id"].nunique())
    repeat_customers = int((rfm["frequency"] > 1).sum())

    return {
        "totalRevenue": round(total_revenue, 2),
        "totalOrders": total_orders,
        "totalCustomers": total_customers,
        "avgOrderValue": round(total_revenue / total_orders, 2),
        "repeatPurchaseRate": round(repeat_customers / total_customers * 100, 1),
        "dateRange": {
            "start": str(transactions["invoice_date"].min().date()),
            "end": str(transactions["invoice_date"].max().date()),
        },
    }


def build_monthly_trend(transactions: pd.DataFrame) -> list[dict]:
    monthly = transactions.groupby(transactions["invoice_date"].dt.to_period("M")).agg(
        revenue=("revenue", "sum"),
        orders=("invoice", "nunique"),
        customers=("customer_id", "nunique"),
    )
    return [
        {"month": str(period), "revenue": round(row.revenue, 2), "orders": int(row.orders), "customers": int(row.customers)}
        for period, row in monthly.iterrows()
    ]


def build_segment_summary(rfm: pd.DataFrame) -> list[dict]:
    summary = rfm.groupby("segment").agg(customers=("customer_id", "count"), revenue=("monetary", "sum")).reset_index()
    return [
        {"segment": row.segment, "customers": int(row.customers), "revenue": round(row.revenue, 2)}
        for row in summary.itertuples()
    ]


def build_country_summary(transactions: pd.DataFrame, top_n: int = 10) -> list[dict]:
    summary = (
        transactions.groupby("country")
        .agg(revenue=("revenue", "sum"), orders=("invoice", "nunique"))
        .sort_values("revenue", ascending=False)
        .head(top_n)
        .reset_index()
    )
    return [{"country": row.country, "revenue": round(row.revenue, 2), "orders": int(row.orders)} for row in summary.itertuples()]


def build_top_products(transactions: pd.DataFrame, top_n: int = 10) -> list[dict]:
    summary = (
        transactions.groupby("description")
        .agg(revenue=("revenue", "sum"), units=("quantity", "sum"))
        .sort_values("revenue", ascending=False)
        .head(top_n)
        .reset_index()
    )
    return [
        {"product": row.description, "revenue": round(row.revenue, 2), "units": int(row.units)}
        for row in summary.itertuples()
        if isinstance(row.description, str)
    ]


def build_churn_summary(risk: pd.DataFrame) -> dict:
    breakdown = risk.groupby("churn_risk").agg(customers=("customer_id", "count"), revenue=("monetary", "sum")).reset_index()
    return {
        "breakdown": [
            {"risk": row.churn_risk, "customers": int(row.customers), "revenue": round(row.revenue, 2)}
            for row in breakdown.itertuples()
        ],
        "revenueAtRisk": round(float(risk[risk["churn_risk"] == "High risk"]["monetary"].sum()), 2),
        "topAtRisk": [
            {
                "customerId": row.customer_id,
                "country": row.country,
                "monetary": round(row.monetary, 2),
                "recencyDays": int(row.recency_days),
                "frequency": int(row.frequency),
            }
            for row in risk[risk["churn_risk"] == "High risk"].sort_values("monetary", ascending=False).head(15).itertuples()
        ],
    }


def main() -> None:
    OUTPUT_DIR.mkdir(exist_ok=True)
    transactions = load_clean()
    rfm = compute_rfm(transactions)
    risk = compute_churn_risk(transactions, rfm)
    cohorts = compute_cohort_retention(transactions)

    payload = {
        "kpis": build_kpis(transactions, rfm),
        "monthlyTrend": build_monthly_trend(transactions),
        "segments": build_segment_summary(rfm),
        "countries": build_country_summary(transactions),
        "topProducts": build_top_products(transactions),
        "cohorts": cohorts,
        "churn": build_churn_summary(risk),
    }

    out_path = OUTPUT_DIR / "dashboard-data.json"
    out_path.write_text(json.dumps(payload, indent=2))
    print(f"Wrote {out_path} ({out_path.stat().st_size / 1024:.0f} KB)")


if __name__ == "__main__":
    main()
