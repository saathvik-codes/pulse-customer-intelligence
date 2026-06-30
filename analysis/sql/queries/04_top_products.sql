-- Top products by revenue. Excludes non-product administrative stock codes
-- (postage, manual price corrections, bank charges) — see
-- analysis/export.py NON_PRODUCT_STOCK_CODES for the full list and why.
SELECT
    description AS product,
    ROUND(SUM(revenue), 2) AS revenue,
    SUM(quantity) AS units
FROM transactions
WHERE stock_code NOT IN ('POST', 'M', 'D', 'C2', 'DOT', 'PADS', 'BANK CHARGES', 'ADJUST', 'ADJUST2', 'AMAZONFEE', 'TEST001', 'TEST002', 'S', 'CRUK')
GROUP BY description
ORDER BY revenue DESC
LIMIT 10
