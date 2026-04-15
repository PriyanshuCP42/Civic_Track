import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Plus } from "lucide-react";
import AppPageHeader from "../../components/layout/AppPageHeader";
import ComplaintCard from "../../components/ui/ComplaintCard";
import EmptyState from "../../components/ui/EmptyState";
import SkeletonLoader from "../../components/ui/SkeletonLoader";
import { useAuth } from "../../context/AuthContext";
import { adminBtnAccent, adminSurface, pageStack } from "../../lib/adminUi";
import { mockApi } from "../../api/mockApi";

const StatCard = ({ label, value }) => (
  <div className={`${adminSurface} p-6 transition hover:border-slate-300/80 hover:shadow-md md:p-7`}>
    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">{label}</p>
    <p className="mt-3 text-3xl font-semibold tabular-nums tracking-tight text-slate-900">{value}</p>
  </div>
);

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    mockApi.meComplaints(user.id).then((d) => {
      setItems(d);
      setLoading(false);
    });
  }, [user.id]);

  const counts = {
    Total: items.length,
    Pending: items.filter((i) => i.status === "PENDING").length,
    "In progress": items.filter((i) => i.status === "IN_PROGRESS").length,
    Resolved: items.filter((i) => i.status === "RESOLVED").length,
  };

  return (
    <div className={pageStack}>
      <AppPageHeader
        eyebrow="Citizen"
        title={`Hello, ${user.name?.split(" ")[0] || "there"}`}
        description={format(new Date(), "EEEE, d MMMM yyyy")}
        actions={
          <Link to="/citizen/complaints/new" className={adminBtnAccent}>
            <Plus className="h-4 w-4" />
            New complaint
          </Link>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-4">
        {Object.entries(counts).map(([k, v]) => (
          <StatCard key={k} label={k} value={v} />
        ))}
      </div>

      <section>
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-slate-900">Recent complaints</h2>
            <p className="mt-1 text-sm leading-relaxed text-slate-500">Latest updates on what you have reported</p>
          </div>
          <Link to="/citizen/complaints" className="text-sm font-semibold text-orange-600 hover:text-orange-700">
            View all
          </Link>
        </div>
        {loading ? (
          <SkeletonLoader rows={5} className="h-24" />
        ) : items.length ? (
          <div className="space-y-4">
            {items.slice(0, 5).map((c) => (
              <ComplaintCard key={c.id} complaint={c} onClick={() => navigate(`/citizen/complaints/${c.id}`)} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No complaints yet"
            subtitle="When you submit an issue, it will appear here with status updates."
            action={
              <Link to="/citizen/complaints/new" className={adminBtnAccent}>
                <Plus className="h-4 w-4" />
                New complaint
              </Link>
            }
          />
        )}
      </section>

      <Link
        to="/citizen/complaints/new"
        className="fixed bottom-6 right-6 z-40 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/35 transition hover:brightness-105 md:hidden"
        aria-label="New complaint"
      >
        <Plus className="h-6 w-6" />
      </Link>
    </div>
  );
};

export default CitizenDashboard;
