import { dashboardData as d, formatGBP, formatNumber } from "./data";

// Every sentence below is computed from the data, so it stays true when the pipeline is re-run.
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const monthName = (ym: string) => `${MONTHS[Number(ym.slice(5, 7)) - 1]} ${ym.slice(0, 4)}`;
const pct = (n: number) => `${Math.round(n * 100)}%`;

export function revenueInsight(): string {
  const t = d.monthlyTrend;
  const total = t.reduce((s, m) => s + m.revenue, 0);
  const peak = t.reduce((a, b) => (b.revenue > a.revenue ? b : a));
  const q4 = t.filter((m) => Number(m.month.slice(5, 7)) >= 10).reduce((s, m) => s + m.revenue, 0);
  return `Revenue peaks in ${monthName(peak.month)} at ${formatGBP(peak.revenue, true)}. October to December brings in ${pct(q4 / total)} of all revenue.`;
}

export function segmentInsight(): string {
  const customers = d.segments.reduce((s, x) => s + x.customers, 0);
  const revenue = d.segments.reduce((s, x) => s + x.revenue, 0);
  const top = [...d.segments].sort((a, b) => b.revenue - a.revenue)[0];
  return `${top.segment} are ${pct(top.customers / customers)} of customers but ${pct(top.revenue / revenue)} of revenue. Losing a few of them costs more than losing many of the rest.`;
}

export function churnInsight(): string {
  const high = d.churn.breakdown.find((b) => b.risk === "High risk");
  if (!high) return "";
  const top5 = d.churn.topAtRisk.slice(0, 5).reduce((s, c) => s + c.monetary, 0);
  const share = top5 / d.churn.revenueAtRisk;
  const total = d.kpis.totalRevenue;
  return (
    `${formatNumber(high.customers)} repeat customers have gone quiet. They have spent ${formatGBP(d.churn.revenueAtRisk, true)} (${pct(d.churn.revenueAtRisk / total)} of revenue). ` +
    `The five largest hold ${pct(share)} of that` + (share >= 0.1 ? ", so a short list of personal calls is worth more than a mass email." : ".")
  );
}

export function cohortInsight(): string {
  const m3 = d.cohorts.filter((c) => c.month === 3).sort((a, b) => a.cohort.localeCompare(b.cohort));
  if (m3.length < 2) return "";
  const first = m3[0];
  const last = m3[m3.length - 1];
  const dir = last.retention_pct < first.retention_pct ? "fell" : "rose";
  return `Three-month retention ${dir} from ${first.retention_pct}% (${first.cohort} customers) to ${last.retention_pct}% (${last.cohort} customers).`;
}
