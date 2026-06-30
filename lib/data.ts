import raw from "./data/dashboard-data.json";
import type { DashboardData } from "./types";

export const dashboardData = raw as DashboardData;

// Manual formatting instead of Intl's `notation: "compact"` — that option
// resolves through the host's ICU data, which can render a half-character
// differently between Node (SSR) and the browser (hydration) and trips
// React's hydration-mismatch check. A hand-rolled formatter is byte-identical
// on both sides since it doesn't touch ICU at all.
export function formatGBP(value: number, compact = false): string {
  if (!compact) return `£${Math.round(value).toLocaleString("en-GB")}`;
  const abs = Math.abs(value);
  if (abs >= 1_000_000) return `£${(value / 1_000_000).toFixed(1)}M`;
  if (abs >= 1_000) return `£${(value / 1_000).toFixed(1)}K`;
  return `£${Math.round(value)}`;
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString("en-GB");
}

const SEGMENT_COLORS: Record<string, string> = {
  Champions: "#4f46e5",
  "Loyal Customers": "#6366f1",
  "Potential Loyalists": "#818cf8",
  "New Customers": "#a5b4fc",
  "Needs Attention": "#f59e0b",
  "At Risk": "#f97316",
  "Can't Lose Them": "#ef4444",
  Hibernating: "#94a3b8",
  Lost: "#cbd5e1",
};

export function segmentColor(segment: string): string {
  return SEGMENT_COLORS[segment] ?? "#94a3b8";
}

const RISK_COLORS: Record<string, string> = {
  Healthy: "#10b981",
  Watch: "#f59e0b",
  "High risk": "#ef4444",
};

export function riskColor(risk: string): string {
  return RISK_COLORS[risk] ?? "#94a3b8";
}
