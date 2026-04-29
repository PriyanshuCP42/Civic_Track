import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Plus } from "lucide-react";
import AppPageHeader from "../../components/layout/AppPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import EmptyState from "../../components/ui/EmptyState";
import { useAuth } from "../../context/useAuth";
import { adminBtnAccent, adminIconBtn, adminInput, adminSurface, pageStack } from "../../lib/adminUi";
import { useCitizenComplaints } from "../../hooks/useCitizenComplaints";

const MyComplaintsPage = () => {
  const { user } = useAuth();
  const { complaints, isLoading: loading } = useCitizenComplaints(user?.id);
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  const filtered = useMemo(
    () => complaints.filter((r) => `${r.id} ${r.title}`.toLowerCase().includes(q.toLowerCase())),
    [complaints, q],
  );

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Citizen"
        title="My complaints"
        description="Every case you have opened, with current status and quick access to details."
        actions={
          <Link to="/citizen/complaints/new" className={adminBtnAccent}>
            <Plus className="h-4 w-4" />
            New complaint
          </Link>
        }
      />

      <div className={adminSurface}>
        <div className="border-b border-slate-100 p-6 md:p-7">
          <input
            type="search"
            placeholder="Search by ID or title…"
            className={`max-w-md ${adminInput}`}
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-6">
              <SkeletonLoader rows={6} className="h-12" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-6">
              <EmptyState
                title={q ? "No matches" : "No complaints yet"}
                subtitle={q ? "Try a different search." : "Submit your first issue to see it listed here."}
                action={
                  !q ? (
                    <Link to="/citizen/complaints/new" className={adminBtnAccent}>
                      <Plus className="h-4 w-4" />
                      New complaint
                    </Link>
                  ) : null
                }
              />
            </div>
          ) : (
            <table className="w-full min-w-[640px] text-left text-[15px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/95 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Submitted</th>
                  <th className="px-6 py-4 text-right">Open</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filtered.map((r) => (
                  <tr key={r.id} className="transition hover:bg-slate-50/90">
                    <td className="whitespace-nowrap px-6 py-4 font-mono text-xs text-slate-500">{r.id}</td>
                    <td className="max-w-xs px-6 py-4 font-medium text-slate-900">{r.title}</td>
                    <td className="px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-slate-600">{format(new Date(r.submittedAt), "d MMM yyyy")}</td>
                    <td className="px-6 py-4 text-right">
                      <button type="button" className={adminIconBtn} title="View" onClick={() => navigate(`/citizen/complaints/${r.id}`)}>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyComplaintsPage;
