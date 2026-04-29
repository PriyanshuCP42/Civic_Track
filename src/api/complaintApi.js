import axiosInstance from "./axiosInstance";
import { adminApi } from "./adminApi";
import { Complaint } from "../domain/Complaint";
import { refreshSessionToken } from "./sessionToken";

/**
 * Complaint and employee API methods backed by the Express server.
 */
export const complaintApi = {
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
    await refreshSessionToken();
    const res = await axiosInstance.get(`/complaints?citizenId=${userId}`);
    return Complaint.listFromApiResponse(res.data);
  },
  async allComplaints() {
    await refreshSessionToken();
    const res = await axiosInstance.get("/complaints");
    return Complaint.listFromApiResponse(res.data);
  },
  async employeeComplaints(employeeId) {
    await refreshSessionToken();
    const res = await axiosInstance.get(`/complaints?assignedTo=${employeeId}`);
    return Complaint.listFromApiResponse(res.data);
  },
  async complaintById(id) {
    await refreshSessionToken();
    const res = await axiosInstance.get(`/complaints/${id}`);
    return Complaint.fromApiResponse(res.data);
  },
  async createComplaint(payload) {
    await refreshSessionToken();
    const res = await axiosInstance.post("/complaints", payload);
    return Complaint.fromApiResponse(res.data);
  },
  async assignComplaint(id, employeeId, employeeName) {
    await refreshSessionToken();
    const res = await axiosInstance.patch(`/complaints/${id}/assign`, { employeeId, employeeName });
    return Complaint.fromApiResponse(res.data);
  },
  async updateComplaintStatus(id, nextStatus, note) {
    await refreshSessionToken();
    const res = await axiosInstance.patch(`/complaints/${id}/status`, { status: nextStatus, note });
    return Complaint.fromApiResponse(res.data);
  },
  async deleteComplaint(id) {
    await refreshSessionToken();
    const res = await axiosInstance.delete(`/complaints/${id}`);
    return res.data;
  },
  async employees() {
    await refreshSessionToken();
    const res = await axiosInstance.get("/admin/employees");
    return res.data;
  },
  async createEmployee(payload) {
    return adminApi.createEmployee(payload);
  },
};
