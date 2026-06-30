import { ChurnPanel } from "@/components/ChurnPanel";
import { CohortHeatmap } from "@/components/CohortHeatmap";
import { KpiCards } from "@/components/KpiCards";
import { RevenueTrend } from "@/components/RevenueTrend";
import { SegmentBreakdown } from "@/components/SegmentBreakdown";
import { TopLists } from "@/components/TopLists";
import { dashboardData } from "@/lib/data";

export default function Home() {
  const { dateRange } = dashboardData.kpis;

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">Pulse · Customer Intelligence</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Two years of real transactions, turned into decisions.
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">
          RFM segmentation, monthly cohort retention, and rule-based churn-risk scoring over{" "}
          <a
            className="font-medium text-indigo-600 underline decoration-indigo-200 underline-offset-2 hover:text-indigo-700"
            href="https://doi.org/10.24432/C5CG6D"
            target="_blank"
            rel="noreferrer"
          >
            UCI&apos;s Online Retail II
          </a>{" "}
          dataset ({dateRange.start} – {dateRange.end}) — a UK-based online retailer&apos;s full transaction history. The
          pipeline (pandas ETL, RFM scoring, cohort math, churn logic) lives in{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">/analysis</code>; this dashboard renders its output.
        </p>
      </header>

      <div className="space-y-5">
        <KpiCards />
        <RevenueTrend />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <SegmentBreakdown />
          <ChurnPanel />
        </div>
        <CohortHeatmap />
        <TopLists />
      </div>

      <footer className="mt-12 border-t border-slate-200 pt-6 text-xs text-slate-400">
        Built by{" "}
        <a className="font-medium text-slate-500 hover:text-indigo-600" href="https://github.com/saathvik-codes" target="_blank" rel="noreferrer">
          Saathvik Kalepu
        </a>
        . Source data: Chen, Daqing. &quot;Online Retail II.&quot; UCI Machine Learning Repository.
      </footer>
    </main>
  );
}
