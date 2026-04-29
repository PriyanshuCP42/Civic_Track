import { SERVER_CONSTANTS } from "../config/constants.js";

const EMPLOYEE_SETTABLE_STATUSES = [
  SERVER_CONSTANTS.COMPLAINT_STATUS.IN_PROGRESS,
  SERVER_CONSTANTS.COMPLAINT_STATUS.RESOLVED,
];

/**
 * Status policy for complaint lifecycle operations.
 */
export class ComplaintStatusPolicy {
  /**
   * Check whether an employee may set the requested status.
   * This preserves the current API behavior, which validates only the requested value.
   * @param {string} status
   * @returns {boolean}
   */
  static canEmployeeSetStatus(status) {
    return EMPLOYEE_SETTABLE_STATUSES.includes(status);
  }

  /**
   * List employee-settable statuses.
   * @returns {string[]}
   */
  static employeeSettableStatuses() {
    return [...EMPLOYEE_SETTABLE_STATUSES];
  }
}
