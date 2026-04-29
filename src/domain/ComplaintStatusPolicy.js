const statusColor = {
  PENDING: "bg-amber-50 text-amber-800 ring-amber-100",
  ASSIGNED: "bg-sky-50 text-sky-800 ring-sky-100",
  IN_PROGRESS: "bg-violet-50 text-violet-800 ring-violet-100",
  RESOLVED: "bg-emerald-50 text-emerald-800 ring-emerald-100",
  CLOSED: "bg-slate-100 text-slate-700 ring-slate-200/80",
};

const fallbackStatusColor = "bg-slate-50 text-slate-700 ring-slate-200";

/**
 * UI-facing status policy.
 */
export class ComplaintStatusPolicy {
  /**
   * Resolve badge classes for a status.
   * @param {string | undefined} status
   * @returns {string}
   */
  static getBadgeClass(status) {
    return statusColor[status] || fallbackStatusColor;
  }

  /**
   * Resolve the existing display label format for a status.
   * @param {string | undefined} status
   * @returns {string | undefined}
   */
  static getLabel(status) {
    return status?.replace(/_/g, " ");
  }
}
