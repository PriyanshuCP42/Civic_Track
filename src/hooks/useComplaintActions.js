import { useCallback } from "react";
import { complaintApi } from "../api/complaintApi";

/**
 * Provide complaint mutation actions for UI consumers.
 * @returns {{
 *   createComplaint: (payload: any) => Promise<any>,
 *   assignComplaint: (id: string, employeeId: string, employeeName: string) => Promise<any>,
 *   updateComplaintStatus: (id: string, status: string, note?: string) => Promise<any>,
 *   deleteComplaint: (id: string) => Promise<any>
 * }}
 */
export function useComplaintActions() {
  const createComplaint = useCallback(async (payload) => {
    return complaintApi.createComplaint(payload);
  }, []);

  const assignComplaint = useCallback(async (id, employeeId, employeeName) => {
    return complaintApi.assignComplaint(id, employeeId, employeeName);
  }, []);

  const updateComplaintStatus = useCallback(async (id, status, note) => {
    return complaintApi.updateComplaintStatus(id, status, note);
  }, []);

  const deleteComplaint = useCallback(async (id) => {
    return complaintApi.deleteComplaint(id);
  }, []);

  return { createComplaint, assignComplaint, updateComplaintStatus, deleteComplaint };
}
