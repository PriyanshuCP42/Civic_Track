import { useMemo, useState } from "react";
import { differenceInDays } from "date-fns";
import { Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppPageHeader from "../../components/layout/AppPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import UpdateStatusModal from "./UpdateStatusModal";
import { adminBtnSecondary, adminSurface, pageStack } from "../../lib/adminUi";
import { useAuth } from "../../context/useAuth";
import { useEmployeeComplaints } from "../../hooks/useEmployeeComplaints";
import { STATUS } from "../../utils/constants";
import { cn } from "@/lib/utils";

const AssignedComplaintsPage = () => {
  const [tab, setTab] = useState("Active");
  const [current, setCurrent] = useState(null);
  const { user } = useAuth();
  const { complaints: rows, setComplaints: setRows } = useEmployeeComplaints(user?.id);
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      rows.filter((row) =>
        tab === "All"
          ? true
          : tab === "Resolved"
            ? row.status === STATUS.RESOLVED
            : [STATUS.ASSIGNED, STATUS.IN_PROGRESS].includes(row.status),
      ),
    [rows, tab],
  );

  const tabs = ["Active", "Resolved", "All"];

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Employee"
        title="My tasks"
        description="Work queue with aging signals and quick status updates for field operations."
      />

      <div className={adminSurface}>
        <div className="flex flex-wrap gap-3 border-b border-slate-100 p-6 md:p-7">
          {tabs.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cn(
                "rounded-full px-4 py-2 text-sm font-semibold transition",
                tab === t ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-600 hover:bg-slate-200/80",
              )}
            >
              {t}
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/95 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Days open</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r) => {
                  const days = differenceInDays(new Date(), new Date(r.submittedAt));
                  return (
                  <tr key={r.id} className="transition hover:bg-slate-50/90">
                    <td className="max-w-xs px-6 py-4 font-medium text-slate-900">{r.title}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{r.category}</td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ring-1 ring-inset",
                          days > 7 ? "bg-rose-50 text-rose-800 ring-rose-100" : days > 3 ? "bg-amber-50 text-amber-900 ring-amber-100" : "bg-emerald-50 text-emerald-800 ring-emerald-100",
                        )}
                      >
                        {days}d
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className={adminBtnSecondary}
                          onClick={() => navigate(`/employee/tasks/${r.id}`)}
                        >
                          <Eye className="h-4 w-4 text-slate-500" />
                          View
                        </button>
                        <button type="button" className={adminBtnSecondary} onClick={() => setCurrent(r)}>
                          Update status
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <UpdateStatusModal open={Boolean(current)} complaint={current} onClose={() => setCurrent(null)} onUpdated={(u) => setRows((prev) => prev.map((r) => (r.id === u.id ? u : r)))} />
    </div>
  );
};

export default AssignedComplaintsPage;
