"""
ETL for Pulse — loads the UCI Online Retail II dataset (two sheets covering
Dec 2009 - Dec 2011, ~1.07M line items from a UK-based online retailer) and
returns a cleaned, analysis-ready transaction frame.

Source: Chen, Daqing. "Online Retail II." UCI Machine Learning Repository,
https://doi.org/10.24432/C5CG6D.
"""
from pathlib import Path

import pandas as pd

DATA_PATH = Path(__file__).parent / "data" / "online_retail_II.xlsx"


def load_raw() -> pd.DataFrame:
    sheets = pd.read_excel(DATA_PATH, sheet_name=["Year 2009-2010", "Year 2010-2011"])
    return pd.concat(sheets.values(), ignore_index=True)


def clean(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df = df.rename(columns={
        "Invoice": "invoice",
        "StockCode": "stock_code",
        "Description": "description",
        "Quantity": "quantity",
        "InvoiceDate": "invoice_date",
        "Price": "unit_price",
        "Customer ID": "customer_id",
        "Country": "country",
    })

    # Drop line items we can't attribute to a customer — RFM/cohort analysis
    # is customer-level, so these are unusable for that purpose.
    df = df.dropna(subset=["customer_id"])
    df["customer_id"] = df["customer_id"].astype(int).astype(str)

    # Invoice numbers prefixed "C" are cancellations.
    df["is_cancellation"] = df["invoice"].astype(str).str.startswith("C")

    # Negative/zero quantity or price on a non-cancellation row is a data
    # entry artifact in this dataset (confirmed against the source docs) —
    # excluded from revenue-bearing analysis.
    sellable = df[(~df["is_cancellation"]) & (df["quantity"] > 0) & (df["unit_price"] > 0)].copy()
    sellable["revenue"] = sellable["quantity"] * sellable["unit_price"]
    sellable["invoice_date"] = pd.to_datetime(sellable["invoice_date"])

    return sellable


def load_clean() -> pd.DataFrame:
    return clean(load_raw())


def cancellation_summary() -> dict:
    """Separate from the main sellable-transactions frame: cancelled orders
    aren't part of revenue, but the rate is its own useful signal."""
    df = load_raw()
    df = df.rename(columns={"Invoice": "invoice", "Customer ID": "customer_id", "Quantity": "quantity", "Price": "unit_price"})
    df = df.dropna(subset=["customer_id"])
    is_cancel = df["invoice"].astype(str).str.startswith("C")
    cancelled = df[is_cancel]
    cancelled_value = float((cancelled["quantity"].abs() * cancelled["unit_price"]).sum())
    return {
        "cancelledOrders": int(cancelled["invoice"].nunique()),
        "totalOrders": int(df["invoice"].nunique()),
        "cancelledValue": round(cancelled_value, 2),
        "cancellationRate": round(cancelled["invoice"].nunique() / df["invoice"].nunique() * 100, 1),
    }


if __name__ == "__main__":
    frame = load_clean()
    print(f"{len(frame):,} sellable line items, {frame['customer_id'].nunique():,} customers, "
          f"{frame['invoice'].nunique():,} orders, date range {frame['invoice_date'].min().date()} "
          f"to {frame['invoice_date'].max().date()}")
