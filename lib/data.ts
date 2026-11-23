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
  Champions: "#7a3114",
  "Loyal Customers": "#b4532a",
  "Potential Loyalists": "#cf8a5f",
  "New Customers": "#e3b99a",
  "Needs Attention": "#c9962b",
  "At Risk": "#9c3b2e",
  "Can't Lose Them": "#5c1f19",
  Hibernating: "#a8a091",
  Lost: "#cfc7b5",
};

export function segmentColor(segment: string): string {
  return SEGMENT_COLORS[segment] ?? "#a8a091";
}

const RISK_COLORS: Record<string, string> = {
  Healthy: "#2f6b66",
  Watch: "#c9962b",
  "High risk": "#9c3b2e",
};

export function riskColor(risk: string): string {
  return RISK_COLORS[risk] ?? "#a8a091";
}
