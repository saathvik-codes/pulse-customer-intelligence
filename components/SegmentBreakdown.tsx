"use client";

import { useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExportButton } from "@/components/ExportButton";
import { dashboardData, formatGBP, formatNumber, segmentColor } from "@/lib/data";

export function SegmentBreakdown() {
  const segments = [...dashboardData.segments].sort((a, b) => b.revenue - a.revenue);
  const totalRevenue = segments.reduce((sum, s) => sum + s.revenue, 0);
  const [selected, setSelected] = useState<string | null>(null);

  const active = segments.find((s) => s.segment === selected) ?? null;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-ink">RFM Customer Segments</h2>
          <p className="text-xs text-muted">Recency · Frequency · Monetary quintile scoring, revenue by segment</p>
        </div>
        <ExportButton filename="pulse-segments.csv" rows={segments} />
      </div>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={segments} layout="vertical" margin={{ left: 8, right: 24 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ebe2d0" horizontal={false} />
          <XAxis type="number" tickFormatter={(v) => formatGBP(v, true)} tick={{ fontSize: 11, fill: "#8d8272" }} tickLine={false} axisLine={{ stroke: "#ddd2bd" }} />
          <YAxis type="category" dataKey="segment" tick={{ fontSize: 11, fill: "#5e5548" }} tickLine={false} axisLine={false} width={120} />
          <Tooltip
            formatter={(value, _name, props) => [
              `${formatGBP(Number(value))} · ${formatNumber(props.payload.customers)} customers`,
              "Revenue",
            ]}
            contentStyle={{ borderRadius: 12, border: "1px solid #ddd2bd", fontSize: 12 }}
          />
          <Bar
            dataKey="revenue"
            radius={[0, 6, 6, 0]}
            onClick={(entry: { segment?: string; payload?: { segment: string } }) => {
              const seg = entry.segment ?? entry.payload?.segment;
              if (seg) setSelected((prev) => (prev === seg ? null : seg));
            }}
            cursor="pointer"
          >
            {segments.map((segment) => (
              <Cell
                key={segment.segment}
                fill={segmentColor(segment.segment)}
                opacity={selected && selected !== segment.segment ? 0.35 : 1}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {active ? (
        <div className="mt-3 flex items-center justify-between rounded-md border border-line bg-accent-soft px-4 py-2.5 text-xs">
          <span className="font-medium text-ink">{active.segment}</span>
          <span className="text-accent">
            {formatNumber(active.customers)} customers &middot; {formatGBP(active.revenue, true)} &middot;{" "}
            {((active.revenue / totalRevenue) * 100).toFixed(1)}% of revenue &middot;{" "}
            {formatGBP(active.revenue / active.customers, true)}/customer
          </span>
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-4">
          <img src="/illustrations/pl-empty-segments.webp" alt="" width={96} height={72} className="h-[72px] w-24 shrink-0 object-contain" />
          <p className="text-xs text-muted">Click a segment to see its customers, revenue and share.</p>
        </div>
      )}
    </div>
  );
}
