import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import AppPageHeader from "../../components/layout/AppPageHeader";
import { adminSurface, chartAxis, chartGrid, chartOrange, chartOrangeSoft, pageStack } from "../../lib/adminUi";
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

const StatCard = ({ label, value, hint }) => (
  <div className={`group relative overflow-hidden ${adminSurface} p-6 transition hover:border-slate-300/80 md:p-7`}>
    <div className="pointer-events-none absolute -right-4 -top-4 h-28 w-28 rounded-full bg-gradient-to-br from-orange-400/12 to-transparent" aria-hidden />
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</p>
    {hint ? <p className="mt-3 text-xs leading-relaxed text-slate-500">{hint}</p> : null}
  </div>
);

const AdminDashboard = () => {
  const { complaints: rows } = useAllComplaints();

  const byCategory = useMemo(
    () =>
      Object.entries(rows.reduce((acc, r) => ({ ...acc, [r.category]: (acc[r.category] || 0) + 1 }), {})).map(([name, value]) => ({
        name,
        value,
      })),
    [rows],
  );

  const daily = useMemo(
    () =>
      Array.from({ length: 14 }).map((_, i) => ({
        day: `D${i + 1}`,
        count: ((i * 7 + rows.length * 2) % 9) + 2,
      })),
    [rows.length],
  );

  const stats = useMemo(() => {
    const total = rows.length;
    const pending = rows.filter((r) => r.status === STATUS.PENDING).length;
    const assigned = rows.filter((r) => r.status === STATUS.ASSIGNED).length;
    const inProgress = rows.filter((r) => r.status === STATUS.IN_PROGRESS).length;
    const resolved = rows.filter((r) => r.status === STATUS.RESOLVED).length;
    return { total, pending, assigned, inProgress, resolved };
  }, [rows]);

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Admin"
        title="Operations overview"
        description="Complaint volume, routing mix, and recent activity—aligned with how your municipality runs day to day."
      />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-5">
        <StatCard label="Total open pipeline" value={stats.total} hint="All records in the system" />
        <StatCard label="Pending triage" value={stats.pending} hint="Awaiting assignment" />
        <StatCard label="Assigned" value={stats.assigned} hint="Owned by field staff" />
        <StatCard label="In progress" value={stats.inProgress} hint="Active work" />
        <StatCard label="Resolved" value={stats.resolved} hint="Closed loop outcomes" />
      </div>

      <div className="grid gap-6 md:gap-8 xl:grid-cols-2">
        <div className={`${adminSurface} p-6 md:p-8`}>
          <div className="mb-6 md:mb-7">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">Complaints by category</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Distribution across municipal categories</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byCategory} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip {...tooltipProps} />
              <Bar dataKey="value" name="Complaints" fill={chartOrange} radius={[6, 6, 0, 0]} maxBarSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className={`${adminSurface} p-6 md:p-8`}>
          <div className="mb-6 md:mb-7">
            <h2 className="text-base font-semibold tracking-tight text-slate-900">14-day volume trend</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-slate-500">Synthetic series for demo (ties to dataset size)</p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={daily} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
              <CartesianGrid stroke={chartGrid} strokeDasharray="4 4" vertical={false} />
              <XAxis dataKey="day" tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: chartAxis, fontSize: 11 }} axisLine={false} tickLine={false} width={36} />
              <Tooltip {...tooltipProps} />
              <Line type="monotone" dataKey="count" name="Volume" stroke={chartOrange} strokeWidth={2.5} dot={{ fill: chartOrangeSoft, r: 3, strokeWidth: 0 }} activeDot={{ r: 5 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
