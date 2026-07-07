"use client";

import { downloadCsv } from "@/lib/csv";

export function ExportButton({
  filename,
  rows,
  label = "Export CSV",
}: {
  filename: string;
  rows: Record<string, string | number>[];
  label?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => downloadCsv(filename, rows)}
      className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 px-2.5 py-1 text-[11px] font-medium text-slate-500 transition-colors hover:border-indigo-200 hover:text-indigo-600"
    >
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      {label}
    </button>
  );
}
