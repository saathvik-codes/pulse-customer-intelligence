"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { dashboardData, formatGBP } from "@/lib/data";

export function RevenueTrend() {
  const data = dashboardData.monthlyTrend;

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <div>
          <h2 className="text-sm font-semibold text-slate-900">Monthly Revenue</h2>
          <p className="text-xs text-slate-500">Dec 2009 – Dec 2011, UK online retailer</p>
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
