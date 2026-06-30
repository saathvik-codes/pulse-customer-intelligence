# Pulse — Customer Intelligence Dashboard

A customer analytics platform built on two years of real e-commerce transaction
data: RFM segmentation, monthly cohort retention, and rule-based churn-risk
scoring, served through a live dashboard.

**[Live demo →](https://pulse-customer-intelligence.vercel.app)**

## Why this exists

Most portfolio analytics projects are a single chart over a synthetic CSV.
Pulse is built the way an actual customer-analytics function would approach
this: clean a real transactional dataset, segment customers by behavior (not
demographics — this data doesn't have any), quantify retention over time, and
flag who's actually at risk of churning — with a number attached, not a vibe.

**Headline findings** (full numbers in the dashboard):
- **£17.7M** in revenue across **36,969 orders** from **5,878 customers**, Dec 2009 – Dec 2011
- **72.4%** of customers are repeat buyers
- The **Champions** segment (top 14% of customers by RFM score) drives
  **£12.1M** — roughly 68% of all revenue, from a fraction of the base
- **£3.5M in revenue sits with "high risk" customers** — repeat buyers who've
  gone quiet well past their own historical ordering rhythm
- Cohort retention decays from **~40% at month 3** for the earliest cohort to
  under **20%** for cohorts acquired a year later — a real, visible erosion in
  onboarding/retention quality over the dataset's timeframe

## Tech stack

- **Analysis**: Python, pandas — ETL, RFM scoring, cohort math, churn logic
  (`/analysis`, fully scripted and re-runnable)
- **Dashboard**: Next.js 16, TypeScript, Tailwind CSS, Recharts
- **Data**: [UCI "Online Retail II"](https://doi.org/10.24432/C5CG6D) — a real
  UK-based online retailer's full transaction history (not synthetic)

## Methodology

### RFM segmentation
Each customer is scored 1–5 (quintiles) on **Recency** (days since last
order), **Frequency** (distinct orders), and **Monetary** (total revenue),
then mapped to a standard segment label (Champions, Loyal Customers, At Risk,
Hibernating, etc.) — the same scheme used in most commercial CRM tools, not a
custom invented scale. See `analysis/rfm.py`.

### Cohort retention
Customers are grouped by the month of their *first* purchase (acquisition
cohort), then tracked month-over-month for what fraction are still buying.
This is the standard cohort-retention-triangle approach used in subscription
and e-commerce analytics. See `analysis/cohort.py`.

### Churn risk — deliberately not a black box
This dataset has no "churned" label, so rather than train a classifier on a
target that doesn't exist, churn risk is defined transparently:

> A repeat customer (3+ orders) is **"High risk"** if their current gap since
> last order exceeds **1.5×** their own historical average gap between orders.

That's a rule I can defend in an interview, not a model whose reasoning I'd
have to hand-wave. See `analysis/churn.py`.

### Why pre-computed JSON, not a live database
The dataset is closed/historical — it doesn't get new transactions — so
there's no real-time ingestion need. The pipeline runs once
(`analysis/export.py`), writes the results to JSON, and the dashboard reads
that. Zero infrastructure, instant page loads, and the actual analytical work
still happens in real, inspectable code rather than being hidden behind a
database.

## Running it locally

```bash
# 1. Python pipeline (re-generates lib/data/dashboard-data.json)
cd analysis
pip install -r requirements.txt
python download_data.py   # fetches the ~45MB dataset (not committed)
python export.py

# 2. Dashboard
cd ..
cp analysis/output/dashboard-data.json lib/data/dashboard-data.json
npm install
npm run dev
```

## Project structure

```
analysis/            Python ETL + analysis pipeline (the real work)
  etl.py                Load + clean the raw transaction data
  rfm.py                RFM scoring and segment assignment
  cohort.py             Monthly cohort retention calculation
  churn.py              Rule-based churn-risk classification
  export.py             Orchestrates the above, writes dashboard JSON
app/                  Next.js App Router pages
components/           Dashboard UI (charts, KPI cards, cohort heatmap)
lib/                  Shared types, formatters, and the data the UI reads
```

## Data source

Chen, Daqing. "Online Retail II." *UCI Machine Learning Repository*, 2019,
https://doi.org/10.24432/C5CG6D.

---

Built by [Saathvik Kalepu](https://github.com/saathvik-codes).
