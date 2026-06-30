-- Revenue and order volume by country.
SELECT
    country,
    COUNT(DISTINCT invoice) AS orders,
    ROUND(SUM(revenue), 2) AS revenue
FROM transactions
GROUP BY country
ORDER BY revenue DESC
LIMIT 10
