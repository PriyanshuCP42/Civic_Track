/**
 * App shell visual tokens — surfaces, controls, rhythm (admin / citizen / employee).
 */

/** Vertical rhythm: major sections on a page */
export const pageStack = "space-y-10 md:space-y-12";

export const adminSurface =
  "rounded-[1.25rem] border border-slate-200/70 bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_24px_56px_-20px_rgba(15,23,42,0.09),0_0_0_1px_rgba(255,255,255,0.6)_inset]";

export const adminSurfaceMuted =
  "rounded-[1.25rem] border border-slate-200/60 bg-slate-50/90 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_1px_2px_rgba(15,23,42,0.03)]";

export const adminInput =
  "min-h-[2.75rem] w-full rounded-xl border border-slate-200/90 bg-white px-4 py-3 text-[15px] leading-snug text-slate-900 shadow-[0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-orange-200/90 focus:shadow-[0_0_0_3px_rgba(251,146,60,0.12)]";

export const adminSelect = `${adminInput} pr-10`;

export const adminLabel = "text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500";

export const adminBtnPrimary =
  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold tracking-tight text-white shadow-sm transition hover:bg-slate-800 active:scale-[0.99] disabled:pointer-events-none disabled:opacity-50";

export const adminBtnSecondary =
  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl border border-slate-200/90 bg-white px-5 py-2.5 text-sm font-semibold tracking-tight text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50/90 active:scale-[0.99]";

export const adminBtnAccent =
  "inline-flex min-h-[2.75rem] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-2.5 text-sm font-semibold tracking-tight text-slate-950 shadow-md shadow-orange-500/20 transition hover:brightness-[1.03] active:scale-[0.99] disabled:opacity-50";

export const adminIconBtn =
  "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/90 bg-white text-slate-500 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 active:scale-[0.98]";

/** Recharts */
export const chartGrid = "#e2e8f0";
export const chartAxis = "#64748b";
export const chartOrange = "#ea580c";
export const chartOrangeSoft = "#fb923c";
export const chartMuted = "#94a3b8";
