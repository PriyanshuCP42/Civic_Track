import { complaints as mockComplaints, employees, users } from "../data/mockData";
import { STATUS } from "../utils/constants";

let complaints = [...mockComplaints];
let localEmployees = [...employees];
const delay = (ms = 600) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  async login({ email, password, role }) {
    await delay();
    const found = users.find((u) => u.email === email && u.password === password && u.role === role);
    if (!found) throw new Error("Invalid credentials");
    return { token: `mock-clerk-token-${found.id}`, user: found };
  },
  async register(payload) {
    await delay();
    return { success: true, payload };
  },
  async refresh() {
    await delay();
    return null;
  },
  async meComplaints(userId) {
    await delay();
    return complaints.filter((c) => c.citizenId === userId);
  },
  async allComplaints() {
    await delay();
    return complaints;
  },
  async complaintById(id) {
    await delay();
    return complaints.find((c) => c.id === id);
  },
  async createComplaint(payload) {
    await delay();
    const created = {
      id: `CMP-${Math.floor(1020 + Math.random() * 100)}`,
      status: STATUS.PENDING,
      submittedAt: new Date().toISOString(),
      history: [{ status: STATUS.PENDING, actor: payload.citizenName, note: "Complaint submitted", at: new Date().toISOString() }],
      ...payload,
    };
    complaints = [created, ...complaints];
    return created;
  },
  async assignComplaint(id, employeeId) {
    await delay();
    complaints = complaints.map((c) => (c.id === id ? { ...c, assignedTo: employeeId, status: STATUS.ASSIGNED } : c));
    return complaints.find((c) => c.id === id);
  },
  async updateComplaintStatus(id, nextStatus, note) {
    await delay();
    complaints = complaints.map((c) => {
      if (c.id !== id) return c;
      return {
        ...c,
        status: nextStatus,
        resolutionNotes: nextStatus === STATUS.RESOLVED ? note : c.resolutionNotes,
        history: [...c.history, { status: nextStatus, actor: "Employee", note: note || "Status updated", at: new Date().toISOString() }],
      };
    });
    return complaints.find((c) => c.id === id);
  },
  async deleteComplaint(id) {
    await delay();
    complaints = complaints.filter((c) => c.id !== id);
    return { success: true };
  },
  async employees() {
    await delay();
    return localEmployees;
  },
  async createEmployee(payload) {
    await delay();
    const exists = localEmployees.some((employee) => employee.email.toLowerCase() === payload.email.toLowerCase());
    if (exists) throw new Error("Employee with this email already exists");

    const created = {
      id: `e${localEmployees.length + 1}`,
      name: payload.name,
      email: payload.email,
      department: payload.department,
      assignedCount: 0,
      joinedAt: new Date().toISOString(),
    };
    localEmployees = [created, ...localEmployees];
    return created;
  },
};
