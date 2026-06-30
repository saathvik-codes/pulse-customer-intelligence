-- Rule-based churn risk: a repeat customer (3+ orders) is "High risk" if
-- their current gap since last order exceeds 1.5x their own historical
-- average gap between orders. Same logic as analysis/churn.py, expressed
-- with LAG() instead of pandas .diff() — the SQL-native way to compare a
-- row to the row before it within a partition.
WITH order_dates AS (
    SELECT customer_id, invoice, MIN(invoice_date) AS order_date
    FROM transactions
    GROUP BY customer_id, invoice
),
order_gaps AS (
    SELECT
        customer_id,
        order_date,
        DATE_DIFF('day', LAG(order_date) OVER (PARTITION BY customer_id ORDER BY order_date), order_date) AS gap_days
    FROM order_dates
),
customer_gap_summary AS (
    SELECT
        customer_id,
        COUNT(*) AS frequency,
        AVG(gap_days) AS avg_order_gap_days,
        MAX(order_date) AS last_purchase
    FROM order_gaps
    GROUP BY customer_id
),
snapshot AS (
    SELECT MAX(invoice_date) + INTERVAL 1 DAY AS snapshot_date FROM transactions
)
SELECT
    c.customer_id,
    c.frequency,
    ROUND(c.avg_order_gap_days, 1) AS avg_order_gap_days,
    DATE_DIFF('day', c.last_purchase, s.snapshot_date) AS recency_days,
    CASE
        WHEN c.frequency >= 3
             AND DATE_DIFF('day', c.last_purchase, s.snapshot_date) > COALESCE(c.avg_order_gap_days, 0) * 1.5
        THEN 'High risk'
        ELSE 'Healthy / Watch'
    END AS risk_flag
FROM customer_gap_summary c CROSS JOIN snapshot s
ORDER BY recency_days DESC
