import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { differenceInDays } from "date-fns";
import AppPageHeader from "../../components/layout/AppPageHeader";
import { adminSurface, chartAxis, chartGrid, chartOrange, pageStack } from "../../lib/adminUi";
import { useAllComplaints } from "../../hooks/useAllComplaints";
import { STATUS } from "../../utils/constants";

const tooltipProps = {
  contentStyle: {
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    boxShadow: "0 10px 40px -12px rgba(15,23,42,0.15)",
    fontSize: "13px",
  },
};

const PIE_COLORS = ["#ea580c", "#f97316", "#fb923c", "#fdba74", "#94a3b8", "#64748b"];

const AdminMetricsPage = () => {
  const { complaints: rows } = useAllComplaints();

  const resolutionRate = rows.length ? Math.round((rows.filter((r) => r.status === STATUS.RESOLVED).length / rows.length) * 100) : 0;

  const statusData = useMemo(
    () => Object.entries(rows.reduce((a, r) => ({ ...a, [r.status]: (a[r.status] || 0) + 1 }), {})).map(([name, value]) => ({ name, value })),
    [rows],
  );

  const byAssignee = useMemo(() => {
    const counts = {};
    rows.forEach((r) => {
      const key = r.assignedTo || "Unassigned";
      counts[key] = (counts[key] || 0) + 1;
    });
    return Object.entries(counts)
      .map(([name, value]) => ({ name: name.length > 14 ? `${name.slice(0, 12)}…` : name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [rows]);

  const lineData = useMemo(
    () =>
      Array.from({ length: 30 }).map((_, i) => ({
        day: i + 1,
        value: ((i * 11 + resolutionRate * 3 + rows.length * 5) % 12) + 1,
      })),
    [resolutionRate, rows.length],
  );

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Admin"
        title="Analytics"
        description="Resolution performance, workload distribution, and SLA risk in one analytics workspace."
      />

      <div className={`${adminSurface} p-7 md:p-9`}>
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">Resolution rate</p>
        <p className="mt-3 text-4xl font-semibold tabular-nums tracking-tight text-slate-900">{resolutionRate}%</p>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-500">Share of complaints marked resolved in the current demo dataset.</p>
      </div>

      <div className="grid gap-6 md:gap-8 xl:grid-cols-3">
        <div className={`${adminSurface} p-6 md:p-8 xl:col-span-2`}>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Load by assignee</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Top buckets by assigned user or queue</p>
          <div className="mt-7 h-[300px]">
            {byAssignee.length === 0 ? (
              <div className="flex h-full items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 text-sm text-slate-500">
                No assignment data yet — assign complaints to populate this chart.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={byAssignee} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
                  <CartesianGrid stroke={chartGrid} strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} interval={0} angle={-18} textAnchor="end" height={56} />
                  <YAxis tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
                  <Tooltip {...tooltipProps} />
                  <Bar dataKey="value" name="Complaints" fill={chartOrange} radius={[6, 6, 0, 0]} maxBarSize={44} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={`${adminSurface} p-6 md:p-8`}>
          <h2 className="text-base font-semibold tracking-tight text-slate-900">Status mix</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Pipeline composition</p>
          <div className="mt-6 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={88} paddingAngle={2}>
                  {statusData.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={1} />
                  ))}
                </Pie>
                <Tooltip {...tooltipProps} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className={`${adminSurface} p-6 md:p-8`}>
        <h2 className="text-base font-semibold tracking-tight text-slate-900">30-day throughput (demo series)</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Deterministic trend derived from metrics for visualization only</p>
        <div className="mt-7 h-[240px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={lineData} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip {...tooltipProps} />
              <Line type="monotone" dataKey="value" name="Index" stroke={chartOrange} strokeWidth={2} dot={false} activeDot={{ r: 4, fill: chartOrange }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={`${adminSurface} overflow-hidden`}>
        <div className="border-b border-slate-100 px-7 py-6 md:px-8 md:py-7">
          <h2 className="text-base font-semibold tracking-tight text-slate-900">SLA exposure</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Days open — highlight aging cases</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-[15px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/95 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                <th className="px-7 py-4 md:px-8">ID</th>
                <th className="px-7 py-4 md:px-8">Submitted</th>
                <th className="px-7 py-4 md:px-8">Days open</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.slice(0, 10).map((r) => {
                const days = differenceInDays(new Date(), new Date(r.submittedAt));
                return (
                  <tr key={r.id} className="transition hover:bg-slate-50/90">
                    <td className="whitespace-nowrap px-7 py-4 font-mono text-xs text-slate-500 md:px-8">{r.id}</td>
                    <td className="whitespace-nowrap px-7 py-4 text-slate-700 md:px-8">{new Date(r.submittedAt).toLocaleDateString()}</td>
                    <td className="whitespace-nowrap px-7 py-4 md:px-8">
                      <span
                        className={
                          days > 14
                            ? "inline-flex rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700 ring-1 ring-rose-100"
                            : days > 7
                              ? "inline-flex rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-800 ring-1 ring-amber-100"
                              : "inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-800 ring-1 ring-emerald-100"
                        }
                      >
                        {days}d
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminMetricsPage;
