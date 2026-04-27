import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { format } from "date-fns";
import { ArrowLeft } from "lucide-react";
import AppPageHeader from "../../components/layout/AppPageHeader";
import StatusBadge from "../../components/ui/StatusBadge";
import MapPicker from "../../components/ui/MapPicker";
import { adminSurface, pageStack } from "../../lib/adminUi";
import { mockApi } from "../../api/mockApi";
import socket from "../../utils/socket";

const ComplaintDetailPage = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const [item, setItem] = useState(null);

  const { backHref, backLabel, eyebrow } = useMemo(() => {
    if (pathname.startsWith("/admin")) {
      return { backHref: "/admin/complaints", backLabel: "All complaints", eyebrow: "Admin" };
    }
    if (pathname.startsWith("/employee")) {
      return { backHref: "/employee/tasks", backLabel: "My tasks", eyebrow: "Employee" };
    }
    return { backHref: "/citizen/complaints", backLabel: "My complaints", eyebrow: "Citizen" };
  }, [pathname]);

  useEffect(() => {
    mockApi.complaintById(id).then(setItem);
  }, [id]);

  // Socket.io real-time updates
  useEffect(() => {
    socket.connect();
    socket.emit("join_complaint", id);

    const handleStatusUpdated = (data) => {
      if (data.id === id) {
        setItem((prev) =>
          prev ? { ...prev, status: data.status, history: data.history } : prev
        );
      }
    };

    socket.on("status_updated", handleStatusUpdated);

    return () => {
      socket.off("status_updated", handleStatusUpdated);
      socket.disconnect();
    };
  }, [id]);

  if (!item) return null;

  return (
    <div className={pageStack}>
      <Link
        to={backHref}
        className="inline-flex items-center gap-2 text-sm font-semibold text-orange-600 transition hover:text-orange-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {backLabel}
      </Link>

      <AppPageHeader
        eyebrow={eyebrow}
        title={item.title}
        description={`Submitted ${format(new Date(item.submittedAt), "d MMMM yyyy")}`}
        actions={<StatusBadge status={item.status} />}
      />

      {item.status === "RESOLVED" && item.resolutionNotes ? (
        <div className="rounded-[1.25rem] border border-emerald-200/80 bg-emerald-50/90 px-6 py-5 text-sm leading-relaxed text-emerald-900 md:px-7 md:py-6">
          {item.resolutionNotes}
        </div>
      ) : null}

      <div className="grid gap-7 md:gap-8 xl:grid-cols-2">
        <div className={`space-y-5 ${adminSurface} p-7 md:p-9`}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Description</h2>
          <p className="text-sm leading-relaxed text-slate-700">{item.description}</p>
          <div className="overflow-hidden rounded-xl border border-slate-100">
            <MapPicker value={item.location?.coordinates} readOnly />
          </div>
        </div>
        <div className={`${adminSurface} p-7 md:p-9`}>
          <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">Activity</h2>
          <div className="mt-5 space-y-5">
            {item.history.map((h, idx) => (
              <div key={idx} className={`relative border-l-2 border-orange-200 pl-4 ${idx === 0 ? "pt-0" : ""}`}>
                <p className="text-sm font-semibold text-slate-900">{h.status?.replace(/_/g, " ")}</p>
                <p className="text-xs text-slate-500">
                  {h.actor} · {format(new Date(h.at), "d MMM yyyy, p")}
                </p>
                <p className="mt-1 text-xs text-slate-600">{h.note}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetailPage;

