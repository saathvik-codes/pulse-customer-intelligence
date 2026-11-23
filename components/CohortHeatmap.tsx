import { dashboardData } from "@/lib/data";

export function CohortHeatmap() {
  const cohorts = dashboardData.cohorts;
  const cohortMonths = [...new Set(cohorts.map((c) => c.cohort))].sort().slice(0, 14);
  const periods = [0, 1, 2, 3, 4, 5, 6];

  function cellFor(cohort: string, month: number) {
    return cohorts.find((c) => c.cohort === cohort && c.month === month);
  }

  function bg(pct: number | undefined) {
    if (pct === undefined) return "#fbf8f1";
    const intensity = Math.min(pct / 60, 1);
    const r = Math.round(244 - intensity * (244 - 180));
    const g = Math.round(238 - intensity * (238 - 83));
    const b = Math.round(226 - intensity * (226 - 42));
    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-ink">Cohort Retention</h2>
          <p className="text-xs text-muted">% of each acquisition cohort still buying N months after first purchase</p>
        </div>
        <img src="/illustrations/pl-empty-cohorts.webp" alt="" width={112} height={78} className="hidden h-[78px] w-28 shrink-0 object-cover mix-blend-multiply sm:block" />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-muted">Cohort</th>
              {periods.map((p) => (
                <th key={p} className="px-2 py-1 text-center font-medium text-muted">
                  M{p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortMonths.map((cohort) => (
              <tr key={cohort}>
                <td className="whitespace-nowrap px-2 py-1 font-medium text-muted">{cohort}</td>
                {periods.map((month) => {
                  const cell = cellFor(cohort, month);
                  return (
                    <td
                      key={month}
                      className="rounded-md px-2 py-1.5 text-center font-semibold"
                      style={{ background: bg(cell?.retention_pct), color: (cell?.retention_pct ?? 0) >= 40 ? "#fff" : "#221d17" }}
                      title={cell ? `${cell.customers} of ${cell.size} customers` : undefined}
                    >
                      {cell ? `${cell.retention_pct}%` : ""}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
