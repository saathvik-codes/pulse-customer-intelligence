"use client";

import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dashboardData, formatGBP, formatNumber, segmentColor } from "@/lib/data";

export function SegmentBreakdown() {
  const segments = [...dashboardData.segments].sort((a, b) => b.revenue - a.revenue);

  return (
    <div className="card p-5">
      <div className="mb-4">
        <h2 className="text-sm font-semibold text-slate-900">RFM Customer Segments</h2>
        <p className="text-xs text-slate-500">Recency · Frequency · Monetary quintile scoring, revenue by segment</p>
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={segments} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => formatGBP(v, true)} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} />
          <YAxis type="category" dataKey="segment" tick={{ fontSize: 11, fill: "#334155" }} tickLine={false} axisLine={false} width={120} />
          <Tooltip
            formatter={(value, _name, props) => [
              `${formatGBP(Number(value))} · ${formatNumber(props.payload.customers)} customers`,
              "Revenue",
            ]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <Bar dataKey="revenue" radius={[0, 6, 6, 0]}>
            {segments.map((segment) => (
              <Cell key={segment.segment} fill={segmentColor(segment.segment)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
