"""
RFM (Recency, Frequency, Monetary) customer segmentation.

Each customer gets a 1-5 quintile score per dimension, combined into a
segment label using the standard RFM segment map (the same scheme used in
most commercial CRM tools — not a custom invented scoring system, so it's
defensible and explainable in an interview).
"""
import pandas as pd


def compute_rfm(transactions: pd.DataFrame, snapshot_date: pd.Timestamp | None = None) -> pd.DataFrame:
    if snapshot_date is None:
        snapshot_date = transactions["invoice_date"].max() + pd.Timedelta(days=1)

    per_customer = transactions.groupby("customer_id").agg(
        last_purchase=("invoice_date", "max"),
        frequency=("invoice", "nunique"),
        monetary=("revenue", "sum"),
        first_purchase=("invoice_date", "min"),
        country=("country", lambda s: s.mode().iat[0]),
    )
    per_customer["recency_days"] = (snapshot_date - per_customer["last_purchase"]).dt.days

    # Rank before qcut on all three dimensions: this dataset has heavy ties
    # (many customers share the same order count, monetary total, or even
    # purchase day), and qcut on raw values + `duplicates="drop"` would
    # silently produce fewer than 5 bins while still expecting 5 labels —
    # that's a latent crash waiting for a slightly different data cut.
    # Ranking first guarantees exactly 5 evenly-sized bins every time.
    per_customer["r_score"] = pd.qcut(per_customer["recency_days"].rank(method="first", ascending=False), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    per_customer["f_score"] = pd.qcut(per_customer["frequency"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    per_customer["m_score"] = pd.qcut(per_customer["monetary"].rank(method="first"), 5, labels=[1, 2, 3, 4, 5]).astype(int)
    per_customer["rfm_score"] = per_customer["r_score"] + per_customer["f_score"] + per_customer["m_score"]

    per_customer["segment"] = per_customer.apply(assign_segment, axis=1)
    return per_customer.reset_index()


def assign_segment(row: pd.Series) -> str:
    r, f, m = row["r_score"], row["f_score"], row["m_score"]
    if r >= 4 and f >= 4 and m >= 4:
        return "Champions"
    if r >= 3 and f >= 3:
        return "Loyal Customers"
    if r >= 4 and f <= 2:
        return "New Customers"
    if r >= 3 and f <= 2 and m <= 2:
        return "Potential Loyalists"
    if r <= 2 and f >= 4 and m >= 4:
        return "At Risk"
    if r <= 2 and f >= 3:
        return "Needs Attention"
    if r <= 2 and f <= 2 and m >= 4:
        return "Can't Lose Them"
    if r <= 2 and f <= 2:
        return "Hibernating"
    return "Lost"


if __name__ == "__main__":
    from etl import load_clean

    rfm = compute_rfm(load_clean())
    print(rfm["segment"].value_counts())
    print(f"\nTotal monetary value by segment:")
    print(rfm.groupby("segment")["monetary"].sum().sort_values(ascending=False).round(0))
