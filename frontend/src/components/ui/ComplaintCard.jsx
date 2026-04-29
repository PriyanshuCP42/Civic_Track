import { format } from "date-fns";
import { MapPin } from "lucide-react";
import StatusBadge from "./StatusBadge";

const ComplaintCard = ({ complaint, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="w-full rounded-[1.25rem] border border-slate-200/80 bg-white p-6 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_-16px_rgba(15,23,42,0.08)] transition hover:border-orange-200/90 hover:shadow-md md:p-7"
  >
    <div className="flex items-start justify-between gap-5">
      <div className="min-w-0 flex-1">
        <h4 className="font-semibold leading-snug tracking-tight text-slate-900">{complaint.title}</h4>
        <p className="mt-2 text-xs font-medium text-slate-500">{format(new Date(complaint.submittedAt), "d MMM yyyy")}</p>
        {complaint.address ? (
          <div className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-slate-600">
            <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
            <span className="line-clamp-2">{complaint.address}</span>
          </div>
        ) : null}
      </div>
      <div className="shrink-0 pt-0.5">
        <StatusBadge status={complaint.status} />
      </div>
    </div>
  </button>
);

export default ComplaintCard;
