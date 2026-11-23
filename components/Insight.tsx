// One plain-language finding above a chart: the "so what", not the field name.
export function Insight({ children }: { children: React.ReactNode }) {
  if (!children) return null;
  return <p className="border-l-2 border-accent pl-3 text-sm leading-6 text-ink">{children}</p>;
}
