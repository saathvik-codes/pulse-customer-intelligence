"""
Monthly acquisition-cohort retention analysis: for each cohort of customers
(grouped by the month of their first purchase), what fraction are still
buying N months later. Produces the classic cohort retention triangle.
"""
import pandas as pd


def compute_cohort_retention(transactions: pd.DataFrame) -> list[dict]:
    df = transactions.copy()
    df["order_month"] = df["invoice_date"].dt.to_period("M")
    first_purchase = df.groupby("customer_id")["order_month"].min().rename("cohort_month")
    df = df.join(first_purchase, on="customer_id")

    df["period_number"] = (
        (df["order_month"].dt.year - df["cohort_month"].dt.year) * 12
        + (df["order_month"].dt.month - df["cohort_month"].dt.month)
    )

    cohort_data = df.groupby(["cohort_month", "period_number"])["customer_id"].nunique().reset_index()
    cohort_sizes = cohort_data[cohort_data["period_number"] == 0].set_index("cohort_month")["customer_id"]

    rows = []
    for cohort_month, group in cohort_data.groupby("cohort_month"):
        size = int(cohort_sizes.get(cohort_month, 0))
        if size == 0:
            continue
        # Cap at 6 months out so the triangle stays readable and every cohort
        # shown has enough trailing data to be meaningful.
        for _, period_row in group[group["period_number"] <= 6].iterrows():
            rows.append({
                "cohort": str(cohort_month),
                "month": int(period_row["period_number"]),
                "customers": int(period_row["customer_id"]),
                "size": size,
                "retention_pct": round(period_row["customer_id"] / size * 100, 1),
            })
    return rows


if __name__ == "__main__":
    from etl import load_clean

    rows = compute_cohort_retention(load_clean())
    month0 = [r for r in rows if r["month"] == 3]
    print(f"{len(rows)} cohort/month cells. Example — month-3 retention by cohort:")
    for r in month0[:6]:
        print(r)
