import axiosInstance from "./axiosInstance";
import { adminApi } from "./adminApi";

/**
 * Refresh the Clerk session token before each API call.
 * Clerk JWTs are short-lived (~60s), so we must get a fresh one
 * right before every request. This updates window.__sccmsToken
 * which the axiosInstance interceptor reads.
 *
 * For the hardcoded admin token this is a no-op (it never expires).
 */
async function freshToken() {
  // Admin token doesn't expire — skip refresh
  if (window.__sccmsToken === "hardcoded-admin-token") return;

  // Clerk exposes its auth via the global __clerk_frontend_api or the loaded instance
  const clerk = window.Clerk;
  if (clerk?.session) {
    const newToken = await clerk.session.getToken();
    if (newToken) window.__sccmsToken = newToken;
  }
}

export const mockApi = {
  async login() {
    throw new Error("Use Clerk login");
  },
  async register() {
    throw new Error("Use Clerk register");
  },
  async refresh() {
    return null;
  },
  async meComplaints(userId) {
    await freshToken();
    const res = await axiosInstance.get(`/complaints?citizenId=${userId}`);
    return res.data;
  },
  async allComplaints() {
    await freshToken();
    const res = await axiosInstance.get("/complaints");
    return res.data;
  },
  async complaintById(id) {
    await freshToken();
    const res = await axiosInstance.get(`/complaints/${id}`);
    return res.data;
  },
  async createComplaint(payload) {
    await freshToken();
    const res = await axiosInstance.post("/complaints", payload);
    return res.data;
  },
  async assignComplaint(id, employeeId, employeeName) {
    await freshToken();
    const res = await axiosInstance.patch(`/complaints/${id}/assign`, { employeeId, employeeName });
    return res.data;
  },
  async updateComplaintStatus(id, nextStatus, note) {
    await freshToken();
    const res = await axiosInstance.patch(`/complaints/${id}/status`, { status: nextStatus, note });
    return res.data;
  },
  async deleteComplaint(id) {
    await freshToken();
    const res = await axiosInstance.delete(`/complaints/${id}`);
    return res.data;
  },
  async employees() {
    await freshToken();
    const res = await axiosInstance.get("/admin/employees");
    return res.data;
  },
  async createEmployee(payload) {
    return adminApi.createEmployee(payload);
  },
};
