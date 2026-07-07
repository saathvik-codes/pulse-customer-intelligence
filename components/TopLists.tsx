import { ExportButton } from "@/components/ExportButton";
import { dashboardData, formatGBP, formatNumber } from "@/lib/data";

export function TopLists() {
  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Top Products by Revenue</h2>
          <ExportButton filename="pulse-top-products.csv" rows={dashboardData.topProducts} />
        </div>
        <ol className="space-y-2.5">
          {dashboardData.topProducts.slice(0, 8).map((p, i) => (
            <li key={p.product} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">{i + 1}</span>
                <span className="truncate text-slate-700">{p.product}</span>
              </span>
              <span className="shrink-0 font-semibold text-slate-900">{formatGBP(p.revenue, true)}</span>
            </li>
          ))}
        </ol>
      </div>

      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-sm font-semibold text-slate-900">Revenue by Market</h2>
          <ExportButton filename="pulse-top-markets.csv" rows={dashboardData.countries} />
        </div>
        <ol className="space-y-2.5">
          {dashboardData.countries.slice(0, 8).map((c, i) => (
            <li key={c.country} className="flex items-center justify-between gap-3 text-sm">
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-indigo-50 text-[10px] font-bold text-indigo-600">{i + 1}</span>
                <span className="truncate text-slate-700">{c.country}</span>
              </span>
              <span className="shrink-0 text-xs text-slate-400">{formatNumber(c.orders)} orders</span>
              <span className="shrink-0 font-semibold text-slate-900">{formatGBP(c.revenue, true)}</span>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
