"use client";

import { useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ExportButton } from "@/components/ExportButton";
import { dashboardData, formatGBP } from "@/lib/data";

export function RevenueTrend() {
  const allData = dashboardData.monthlyTrend;
  const [range, setRange] = useState<[number, number]>([0, allData.length - 1]);
  const [start, end] = range;

  const data = useMemo(() => allData.slice(start, end + 1), [allData, start, end]);

  const periodRevenue = useMemo(() => data.reduce((sum, d) => sum + d.revenue, 0), [data]);

  return (
    <div className="card p-5">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Monthly Revenue</h2>
          <p className="text-xs text-slate-500">
            {data[0]?.month} – {data[data.length - 1]?.month} &middot; {formatGBP(periodRevenue, true)} in range
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
            From
            <select
              value={start}
              onChange={(e) => {
                const next = Number(e.target.value);
                setRange([Math.min(next, end), end]);
              }}
              className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11px] text-slate-700"
            >
              {allData.map((d, i) => (
                <option key={d.month} value={i}>
                  {d.month}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-1.5 text-[11px] text-slate-500">
            To
            <select
              value={end}
              onChange={(e) => {
                const next = Number(e.target.value);
                setRange([start, Math.max(next, start)]);
              }}
              className="rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[11px] text-slate-700"
            >
              {allData.map((d, i) => (
                <option key={d.month} value={i}>
                  {d.month}
                </option>
              ))}
            </select>
          </label>
          {(start !== 0 || end !== allData.length - 1) && (
            <button
              type="button"
              onClick={() => setRange([0, allData.length - 1])}
              className="text-[11px] font-medium text-indigo-600 hover:text-indigo-700"
            >
              Reset
            </button>
          )}
          <ExportButton filename="pulse-monthly-revenue.csv" rows={data} />
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ left: 4, right: 12, top: 4 }}>
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f46e5" stopOpacity={0.32} />
              <stop offset="100%" stopColor="#4f46e5" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#eef0f4" vertical={false} />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={{ stroke: "#e5e7eb" }} interval={2} />
          <YAxis tickFormatter={(v) => formatGBP(v, true)} tick={{ fontSize: 11, fill: "#64748b" }} tickLine={false} axisLine={false} width={56} />
          <Tooltip
            formatter={(value) => [formatGBP(Number(value)), "Revenue"]}
            contentStyle={{ borderRadius: 12, border: "1px solid #e5e7eb", fontSize: 12 }}
          />
          <Area type="monotone" dataKey="revenue" stroke="#4f46e5" strokeWidth={2} fill="url(#revenueFill)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
