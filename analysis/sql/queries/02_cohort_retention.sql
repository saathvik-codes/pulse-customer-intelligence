-- Monthly acquisition cohort retention: what % of each cohort is still
-- buying N months after their first purchase.
WITH customer_first_purchase AS (
    SELECT
        customer_id,
        DATE_TRUNC('month', MIN(invoice_date)) AS cohort_month
    FROM transactions
    GROUP BY customer_id
),
orders_with_cohort AS (
    SELECT DISTINCT
        t.customer_id,
        f.cohort_month,
        DATE_TRUNC('month', t.invoice_date) AS order_month
    FROM transactions t
    JOIN customer_first_purchase f USING (customer_id)
),
cohort_periods AS (
    SELECT
        cohort_month,
        DATE_DIFF('month', cohort_month, order_month) AS period_number,
        COUNT(DISTINCT customer_id) AS active_customers
    FROM orders_with_cohort
    GROUP BY cohort_month, period_number
),
cohort_sizes AS (
    SELECT cohort_month, COUNT(DISTINCT customer_id) AS cohort_size
    FROM customer_first_purchase
    GROUP BY cohort_month
)
SELECT
    p.cohort_month,
    p.period_number,
    p.active_customers,
    s.cohort_size,
    ROUND(100.0 * p.active_customers / s.cohort_size, 1) AS retention_pct
FROM cohort_periods p
JOIN cohort_sizes s USING (cohort_month)
WHERE p.period_number BETWEEN 0 AND 6
ORDER BY p.cohort_month, p.period_number
