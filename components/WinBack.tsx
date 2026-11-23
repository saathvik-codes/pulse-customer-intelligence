"use client";

import { useState } from "react";
import { dashboardData, formatGBP, formatNumber } from "@/lib/data";

export function WinBack() {
  const [rate, setRate] = useState(10);
  const atRisk = dashboardData.churn.revenueAtRisk;
  const high = dashboardData.churn.breakdown.find((b) => b.risk === "High risk");
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-ink">Win-back what-if</h2>
      <p className="text-xs text-muted">An assumption you set, not a result: the share of at-risk revenue we manage to recover.</p>
      <label className="mt-4 block text-sm text-ink">
        Recover <strong>{rate}%</strong> of {formatGBP(atRisk, true)}
        <input
          type="range" min={0} max={50} step={5} value={rate}
          onChange={(e) => setRate(Number(e.target.value))}
          aria-label="Assumed win-back rate"
          className="mt-2 w-full accent-[#b4532a]"
        />
      </label>
      <p className="mt-4 text-xs uppercase tracking-wide text-muted">Assumed recovery</p>
      <p className="text-3xl font-medium text-ink">{formatGBP((atRisk * rate) / 100, true)}</p>
      <p className="mt-2 text-xs leading-5 text-muted">
        from {high ? formatNumber(high.customers) : "the"} high-risk customers. This is what they have spent so far, so use it to size the
        prize, not as a forecast of future sales.
      </p>
    </div>
  );
}
