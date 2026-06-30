import { dashboardData, formatGBP, formatNumber } from "@/lib/data";

export function KpiCards() {
  const { kpis } = dashboardData;

  const cards = [
    { label: "Total Revenue", value: formatGBP(kpis.totalRevenue, true), sub: `${formatGBP(kpis.totalRevenue)} exact` },
    { label: "Orders", value: formatNumber(kpis.totalOrders), sub: `${formatGBP(kpis.avgOrderValue)} avg order value` },
    { label: "Customers", value: formatNumber(kpis.totalCustomers), sub: `${kpis.repeatPurchaseRate}% repeat purchase rate` },
    { label: "Revenue at Churn Risk", value: formatGBP(dashboardData.churn.revenueAtRisk, true), sub: "high-value customers gone quiet", accent: true },
  ];

  const { cancellations } = dashboardData;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{card.label}</p>
            <p className={`mt-2 text-3xl font-bold tracking-tight ${card.accent ? "text-red-600" : "text-slate-900"}`}>{card.value}</p>
            <p className="mt-1 text-xs text-slate-500">{card.sub}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">
        {cancellations.cancellationRate}% of orders were cancelled ({formatGBP(cancellations.cancelledValue, true)} across{" "}
        {formatNumber(cancellations.cancelledOrders)} orders) — excluded from revenue above, tracked separately.
      </p>
    </div>
  );
}
