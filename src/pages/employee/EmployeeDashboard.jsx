import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import AppPageHeader from "../../components/layout/AppPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import { adminSurface, pageStack } from "../../lib/adminUi";
import { useAuth } from "../../context/useAuth";
import { useEmployeeComplaints } from "../../hooks/useEmployeeComplaints";
import { STATUS } from "../../utils/constants";
const StatCard = ({ label, value }) => (
  <div className={`${adminSurface} p-6 transition hover:border-slate-300/80 hover:shadow-md md:p-7`}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</p>
  </div>
);

const EmployeeDashboard = () => {
  const { user } = useAuth();
  const { complaints: rows } = useEmployeeComplaints(user?.id);
  const navigate = useNavigate();

  const active = useMemo(
    () =>
      rows.filter((row) =>
        [STATUS.ASSIGNED, STATUS.IN_PROGRESS].includes(row.status),
      ),
    [rows],
  );

  const stats = [
    { label: "In your queue", value: rows.length },
    {
      label: "In progress",
      value: rows.filter((row) => row.status === STATUS.IN_PROGRESS).length,
    },
    {
      label: "Resolved",
      value: rows.filter((row) => row.status === STATUS.RESOLVED).length,
    },
    { label: "Avg. resolution (demo)", value: "3.2d" },
  ];

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Employee"
        title={`Welcome back, ${user.name?.split(" ")[0] || "team"}`}
        description={`Department: ${user.department || "Municipal operations"} — here is what needs attention today.`}
      />

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} label={s.label} value={s.value} />
        ))}
      </div>

      <section className={`${adminSurface} overflow-hidden`}>
        <div className="border-b border-slate-100 px-7 py-6 md:px-8 md:py-7">
          <h2 className="text-lg font-semibold tracking-tight text-slate-900">Active tasks</h2>
          <p className="mt-1 text-sm leading-relaxed text-slate-500">Select a row to open the full case</p>
        </div>
        <div className="divide-y divide-slate-100">
          {active.length === 0 ? (
            <p className="px-8 py-14 text-center text-sm leading-relaxed text-slate-500">No active assignments in the demo dataset.</p>
          ) : (
            active.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => navigate(`/employee/tasks/${r.id}`)}
                className="flex w-full items-center justify-between gap-4 px-7 py-5 text-left transition hover:bg-slate-50/90 md:px-8"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-500">{r.citizenName}</p>
                </div>
                <StatusBadge status={r.status} />
              </button>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default EmployeeDashboard;
