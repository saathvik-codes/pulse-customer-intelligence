"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { dashboardData, formatGBP, formatNumber, riskColor } from "@/lib/data";

export function ChurnPanel() {
  const { breakdown, topAtRisk } = dashboardData.churn;

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">Churn Risk</h2>
        <p className="text-xs text-slate-500">
          Rule-based, not a black box: repeat customers (3+ orders) gone quiet 1.5x longer than their own average
          order gap are flagged &quot;High risk&quot;.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-[180px_1fr]">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Pie data={breakdown} dataKey="customers" nameKey="risk" innerRadius={48} outerRadius={72} paddingAngle={2}>
              {breakdown.map((entry) => (
                <Cell key={entry.risk} fill={riskColor(entry.risk)} />
              ))}
            </Pie>
            <Tooltip formatter={(value, _name, props) => [`${formatNumber(Number(value))} customers`, props.payload.risk]} contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>

        <div>
          <div className="mb-3 flex flex-wrap gap-3">
            {breakdown.map((b) => (
              <span key={b.risk} className="inline-flex items-center gap-1.5 text-xs text-slate-600">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: riskColor(b.risk) }} />
                {b.risk} ({formatNumber(b.customers)})
              </span>
            ))}
          </div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Highest-value at-risk customers</p>
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-100">
            <table className="w-full text-xs">
              <tbody>
                {topAtRisk.slice(0, 8).map((c) => (
                  <tr key={c.customerId} className="border-b border-slate-50 last:border-0">
                    <td className="px-3 py-2 font-medium text-slate-700">#{c.customerId}</td>
                    <td className="px-3 py-2 text-slate-500">{c.country}</td>
                    <td className="px-3 py-2 text-slate-500">{c.recencyDays}d quiet</td>
                    <td className="px-3 py-2 text-right font-semibold text-slate-700">{formatGBP(c.monetary, true)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
