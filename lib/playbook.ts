// What to do for each RFM segment. The wording matches the "Segment Playbook" table in powerbi/measures.dax.
export const PLAYBOOK: Record<string, { who: string; action: string; channel: string }> = {
  Champions: { who: "Bought recently, often, and spend the most", action: "Protect them: early access, no discounts, ask for referrals", channel: "Email, account manager" },
  "Loyal Customers": { who: "Buy regularly and recently", action: "Grow basket size: bundles and higher-value cross-sells", channel: "Email" },
  "Potential Loyalists": { who: "Recent, low spend so far", action: "Nudge a second order within 30 days", channel: "Email" },
  "New Customers": { who: "Very recent, few orders", action: "Onboarding series and a reason to come back", channel: "Email" },
  "Needs Attention": { who: "Used to buy, going quiet", action: "Time-limited reminder before they lapse", channel: "Email, SMS" },
  "At Risk": { who: "High value, now quiet", action: "Personal outreach and a win-back offer", channel: "Account manager, phone" },
  "Can't Lose Them": { who: "Big spenders who stopped", action: "Highest-priority win-back: call, not a mass email", channel: "Account manager, phone" },
  Hibernating: { who: "Low activity, low spend, quiet", action: "One low-cost reactivation, then stop spending on them", channel: "Email" },
  Lost: { who: "Gone, low value", action: "Exclude from campaigns; keep for analysis", channel: "None" },
};
