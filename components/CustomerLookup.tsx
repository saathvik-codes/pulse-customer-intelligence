"use client";

import { useState } from "react";
import { dashboardData, formatGBP, formatNumber, riskColor, segmentColor } from "@/lib/data";
import { PLAYBOOK } from "@/lib/playbook";

// [id, country, r, f, m, recencyDays, orders, spend, segment, risk]
type Row = [string, string, number, number, number, number, number, number, string, string];
let cache: Row[] | null = null;

async function loadCustomers(): Promise<Row[]> {
  if (cache) return cache;
  const res = await fetch("/customers.json");
  if (!res.ok) throw new Error("could not load customers");
  cache = ((await res.json()) as { rows: Row[] }).rows;
  return cache;
}

export function CustomerLookup() {
  const [id, setId] = useState("");
  const [row, setRow] = useState<Row | null | undefined>(undefined); // undefined = not searched yet, null = not found
  const [busy, setBusy] = useState(false);
  const examples = dashboardData.churn.topAtRisk.slice(0, 3).map((c) => c.customerId);

  async function search(value: string) {
    const q = value.trim().replace(/^#/, "");
    if (!q) return;
    setBusy(true);
    try {
      setRow((await loadCustomers()).find((r) => r[0] === q) ?? null);
    } catch {
      setRow(null);
    } finally {
      setBusy(false);
    }
  }

  const play = row ? PLAYBOOK[row[8]] : undefined;
  return (
    <div className="card p-5">
      <h2 className="text-sm font-semibold text-ink">Look up a customer</h2>
      <p className="text-xs text-muted">Enter a customer ID to see their segment, risk and what to do next.</p>
      <form className="mt-4 flex gap-2" onSubmit={(e) => { e.preventDefault(); void search(id); }}>
        <input
          value={id} onChange={(e) => setId(e.target.value)} inputMode="numeric" placeholder="e.g. 14156"
          aria-label="Customer ID"
          className="min-w-0 flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-ink outline-none focus:border-accent"
        />
        <button type="submit" className="rounded-md bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-accent" disabled={busy}>
          {busy ? "…" : "Look up"}
        </button>
      </form>
      <p className="mt-2 text-xs text-muted">
        Try{" "}
        {examples.map((e, i) => (
          <button key={e} className="mr-2 underline decoration-line underline-offset-2 hover:text-accent" onClick={() => { setId(e); void search(e); }}>
            {e}{i < examples.length - 1 ? "" : ""}
          </button>
        ))}
        (the largest at-risk accounts)
      </p>

      {row === null && <p className="mt-4 text-sm text-muted">No customer with that ID. IDs are five digits, like 14156.</p>}
      {row && (
        <div className="mt-4 border-t border-line pt-4 text-sm">
          <p className="flex flex-wrap items-center gap-2 text-ink">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: segmentColor(row[8]) }} />
            <strong>{row[8]}</strong>
            <span className="rounded-full px-2 py-0.5 text-xs text-white" style={{ background: riskColor(row[9]) }}>{row[9]}</span>
            <span className="text-muted">· {row[1]}</span>
          </p>
          <p className="mt-2 text-muted">
            R{row[2]} F{row[3]} M{row[4]} · {formatNumber(row[6])} orders · {formatGBP(row[7])} spent · last order {formatNumber(row[5])} days before the data ends
          </p>
          {play && (
            <p className="mt-3 text-ink">
              <span className="text-xs uppercase tracking-wide text-muted">Next step · </span>
              {play.action} <span className="text-muted">({play.channel})</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
