import { dashboardData } from "@/lib/data";

export function CohortHeatmap() {
  const cohorts = dashboardData.cohorts;
  const cohortMonths = [...new Set(cohorts.map((c) => c.cohort))].sort().slice(0, 14);
  const periods = [0, 1, 2, 3, 4, 5, 6];

  function cellFor(cohort: string, month: number) {
    return cohorts.find((c) => c.cohort === cohort && c.month === month);
  }

  function bg(pct: number | undefined) {
    if (pct === undefined) return "#f8fafc";
    const intensity = Math.min(pct / 60, 1);
    const r = Math.round(238 - intensity * (238 - 79));
    const g = Math.round(242 - intensity * (242 - 70));
    const b = Math.round(255 - intensity * (255 - 229));
    return `rgb(${r}, ${g}, ${b})`;
  }

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Cohort Retention</h2>
        <p className="text-xs text-slate-500">% of each acquisition cohort still buying N months after first purchase</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-separate border-spacing-1 text-xs">
          <thead>
            <tr>
              <th className="px-2 py-1 text-left font-medium text-slate-500">Cohort</th>
              {periods.map((p) => (
                <th key={p} className="px-2 py-1 text-center font-medium text-slate-500">
                  M{p}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cohortMonths.map((cohort) => (
              <tr key={cohort}>
                <td className="whitespace-nowrap px-2 py-1 font-medium text-slate-600">{cohort}</td>
                {periods.map((month) => {
                  const cell = cellFor(cohort, month);
                  return (
                    <td
                      key={month}
                      className="rounded-md px-2 py-1.5 text-center font-semibold text-slate-700"
                      style={{ background: bg(cell?.retention_pct) }}
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
