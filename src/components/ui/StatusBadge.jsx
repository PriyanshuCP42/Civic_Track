import { ComplaintStatusPolicy } from "../../domain/ComplaintStatusPolicy";

const StatusBadge = ({ status }) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold tracking-wide ring-1 ring-inset ${ComplaintStatusPolicy.getBadgeClass(status)}`}
  >
    {ComplaintStatusPolicy.getLabel(status)}
  </span>
);

export default StatusBadge;
