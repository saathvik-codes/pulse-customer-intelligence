import { dashboardData, formatGBP, formatNumber, segmentColor } from "@/lib/data";
import { PLAYBOOK } from "@/lib/playbook";

export function Playbook() {
  const segments = [...dashboardData.segments].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = segments.reduce((s, x) => s + x.revenue, 0);
  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-ink">What to do with each segment</h2>
        <p className="text-xs text-muted">The numbers come from the data; the actions are the standard RFM playbook.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <th className="py-2 pr-4 font-medium">Segment</th>
              <th className="py-2 pr-4 text-right font-medium">Customers</th>
              <th className="py-2 pr-4 text-right font-medium">Revenue</th>
              <th className="py-2 pr-4 text-right font-medium">Share</th>
              <th className="py-2 pr-4 font-medium">What to do</th>
              <th className="py-2 font-medium">Channel</th>
            </tr>
          </thead>
          <tbody>
            {segments.map((s) => {
              const p = PLAYBOOK[s.segment];
              return (
                <tr key={s.segment} className="border-b border-line align-top last:border-0">
                  <td className="py-2.5 pr-4 font-medium text-ink">
                    <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: segmentColor(s.segment) }} />
                    {s.segment}
                    {p && <div className="pl-[18px] text-xs font-normal text-muted">{p.who}</div>}
                  </td>
                  <td className="py-2.5 pr-4 text-right text-ink">{formatNumber(s.customers)}</td>
                  <td className="py-2.5 pr-4 text-right text-ink">{formatGBP(s.revenue, true)}</td>
                  <td className="py-2.5 pr-4 text-right text-muted">{Math.round((s.revenue / totalRevenue) * 100)}%</td>
                  <td className="py-2.5 pr-4 text-ink">{p?.action ?? ""}</td>
                  <td className="py-2.5 text-muted">{p?.channel ?? ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
