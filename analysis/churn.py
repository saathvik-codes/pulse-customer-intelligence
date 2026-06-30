"""
Churn-risk flagging.

This dataset has no explicit "churned" label, so rather than fabricate a
black-box classifier trained on a label that doesn't exist, churn risk is
defined transparently from RFM behavior — the same logic a CRM team would
actually use, and one that's defensible in an interview:

  - "High risk": valuable repeat customers (frequency >= 3 orders) who have
    gone quiet for longer than their own historical average gap between
    orders, scaled by a tolerance factor.
  - "Watch": recency in the worst quintile but not yet a repeat customer.
  - "Healthy": everyone else.
"""
import pandas as pd


def compute_churn_risk(transactions: pd.DataFrame, rfm: pd.DataFrame) -> pd.DataFrame:
    orders = transactions.sort_values("invoice_date").groupby(["customer_id", "invoice"])["invoice_date"].min().reset_index()
    gaps = (
        orders.groupby("customer_id")["invoice_date"]
        .apply(lambda dates: dates.diff().dt.days.dropna().mean())
        .rename("avg_order_gap_days")
    )

    merged = rfm.set_index("customer_id").join(gaps)
    merged["avg_order_gap_days"] = merged["avg_order_gap_days"].fillna(merged["recency_days"])

    def classify(row: pd.Series) -> str:
        if row["frequency"] >= 3 and row["recency_days"] > row["avg_order_gap_days"] * 1.5:
            return "High risk"
        if row["r_score"] <= 2 and row["frequency"] < 3:
            return "Watch"
        return "Healthy"

    merged["churn_risk"] = merged.apply(classify, axis=1)
    return merged.reset_index()


if __name__ == "__main__":
    from etl import load_clean
    from rfm import compute_rfm

    txns = load_clean()
    rfm_table = compute_rfm(txns)
    risk = compute_churn_risk(txns, rfm_table)
    print(risk["churn_risk"].value_counts())
    print(f"\nRevenue at risk (High risk segment): £{risk[risk['churn_risk'] == 'High risk']['monetary'].sum():,.0f}")
