import { useMemo, useState } from "react";
import { Download, Eye, Trash2, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AppPageHeader from "../../components/layout/AppPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import AssignComplaintModal from "./AssignComplaintModal";
import { adminBtnSecondary, adminIconBtn, adminInput, adminSurface, pageStack } from "../../lib/adminUi";
import { useAllComplaints } from "../../hooks/useAllComplaints";
import { useEmployees } from "../../hooks/useEmployees";
import { useComplaintActions } from "../../hooks/useComplaintActions";
import { STATUS } from "../../utils/constants";

const AllComplaintsPage = () => {
  const { complaints: rows, isLoading: complaintsLoading, setComplaints: setRows } = useAllComplaints();
  const { employees, isLoading: employeesLoading } = useEmployees();
  const { deleteComplaint } = useComplaintActions();
  const [filter, setFilter] = useState({ status: "", q: "" });
  const [assigning, setAssigning] = useState(null);
  const [deleting, setDeleting] = useState(null);
  const navigate = useNavigate();
  const loading = complaintsLoading || employeesLoading;

  const filtered = useMemo(
    () =>
      rows.filter(
        (r) =>
          (!filter.status || r.status === filter.status) &&
          `${r.id} ${r.title}`.toLowerCase().includes(filter.q.toLowerCase()),
      ),
    [rows, filter],
  );

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Admin"
        title="All complaints"
        description="Search, filter, assign, and audit every case in one operational view."
        actions={
          <button type="button" className={adminBtnSecondary}>
            <Download className="h-4 w-4 text-slate-500" />
            Export
          </button>
        }
      />

      <div className={adminSurface}>
        <div className="flex flex-col gap-4 border-b border-slate-100 p-6 sm:flex-row sm:flex-wrap sm:items-center sm:gap-4 md:p-7">
          <input
            type="search"
            placeholder="Search by ID or title…"
            className={`min-w-[200px] flex-1 ${adminInput}`}
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
          />
          <select
            className={`min-w-[160px] sm:max-w-[200px] ${adminInput}`}
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All statuses</option>
            <option>{STATUS.PENDING}</option>
            <option>{STATUS.ASSIGNED}</option>
            <option>{STATUS.IN_PROGRESS}</option>
            <option>{STATUS.RESOLVED}</option>
            <option>{STATUS.CLOSED}</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8">
              <SkeletonLoader rows={5} className="h-12" />
            </div>
          ) : (
            <table className="w-full min-w-[720px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/95 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Title</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Assigned</th>
                  <th className="px-6 py-4 text-left">Submitted</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.slice(0, 12).map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50/90">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">{r.id}</td>
                    <td className="max-w-[280px] px-6 py-4 font-medium text-slate-900">{r.title}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{r.assignedTo || "—"}</td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{new Date(r.submittedAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end gap-1.5">
                        <button
                          type="button"
                          className={adminIconBtn}
                          title="View"
                          onClick={() => navigate(`/admin/complaints/${r.id}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button type="button" className={adminIconBtn} title="Assign" onClick={() => setAssigning(r)}>
                          <UserPlus className="h-4 w-4" />
                        </button>
                        <button type="button" className={adminIconBtn} title="Delete" onClick={() => setDeleting(r)}>
                          <Trash2 className="h-4 w-4 text-rose-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <AssignComplaintModal
        open={Boolean(assigning)}
        onClose={() => setAssigning(null)}
        complaint={assigning}
        employees={employees}
        onAssigned={(u) => setRows((prev) => prev.map((row) => (row.id === u.id ? u : row)))}
      />
      <ConfirmDialog
        open={Boolean(deleting)}
        title="Delete complaint"
        message="This permanently removes the complaint from the demo dataset."
        onClose={() => setDeleting(null)}
        onConfirm={async () => {
          await deleteComplaint(deleting.id);
          setRows((p) => p.filter((row) => row.id !== deleting.id));
          setDeleting(null);
        }}
      />
    </div>
  );
};

export default AllComplaintsPage;
