-- RFM (Recency, Frequency, Monetary) customer segmentation, in SQL.
-- NTILE(5) is the SQL-native way to bucket into quintiles; it breaks ties
-- by row order rather than pandas' rank-then-cut approach, so exact bucket
-- boundaries can differ slightly from analysis/rfm.py — the segmentation
-- logic and resulting customer counts land in the same range either way.
WITH customer_orders AS (
    SELECT
        customer_id,
        MAX(invoice_date) AS last_purchase,
        COUNT(DISTINCT invoice) AS frequency,
        SUM(revenue) AS monetary
    FROM transactions
    GROUP BY customer_id
),
snapshot AS (
    SELECT MAX(invoice_date) + INTERVAL 1 DAY AS snapshot_date FROM transactions
),
rfm_raw AS (
    SELECT
        c.customer_id,
        DATE_DIFF('day', c.last_purchase, s.snapshot_date) AS recency_days,
        c.frequency,
        c.monetary
    FROM customer_orders c CROSS JOIN snapshot s
),
rfm_scored AS (
    SELECT
        customer_id,
        recency_days,
        frequency,
        monetary,
        -- Most recent purchase = best score, so the recency bucket order is inverted.
        6 - NTILE(5) OVER (ORDER BY recency_days ASC) AS r_score,
        NTILE(5) OVER (ORDER BY frequency ASC) AS f_score,
        NTILE(5) OVER (ORDER BY monetary ASC) AS m_score
    FROM rfm_raw
)
SELECT
    *,
    r_score + f_score + m_score AS rfm_score,
    CASE
        WHEN r_score >= 4 AND f_score >= 4 AND m_score >= 4 THEN 'Champions'
        WHEN r_score >= 3 AND f_score >= 3 THEN 'Loyal Customers'
        WHEN r_score >= 4 AND f_score <= 2 THEN 'New Customers'
        WHEN r_score >= 3 AND f_score <= 2 AND m_score <= 2 THEN 'Potential Loyalists'
        WHEN r_score <= 2 AND f_score >= 4 AND m_score >= 4 THEN 'At Risk'
        WHEN r_score <= 2 AND f_score >= 3 THEN 'Needs Attention'
        WHEN r_score <= 2 AND f_score <= 2 AND m_score >= 4 THEN 'Can''t Lose Them'
        WHEN r_score <= 2 AND f_score <= 2 THEN 'Hibernating'
        ELSE 'Lost'
    END AS segment
FROM rfm_scored
ORDER BY rfm_score DESC
