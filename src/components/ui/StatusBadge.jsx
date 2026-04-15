const statusColor = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-100",
  ASSIGNED: "bg-sky-50 text-sky-800 ring-sky-100",
  IN_PROGRESS: "bg-violet-50 text-violet-800 ring-violet-100",
  RESOLVED: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-200/80",
};

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1 ring-inset ${statusColor[status] || "bg-slate-50 text-slate-700 ring-slate-200"}`}
  >
    {status?.replace(/_/g, " ")}
  </span>
);

export default StatusBadge;
