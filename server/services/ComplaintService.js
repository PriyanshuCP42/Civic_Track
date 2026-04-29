import { SERVER_CONSTANTS } from "../config/constants.js";
import { InvalidComplaintStatusError } from "../errors/AppError.js";
import { ComplaintStatusPolicy } from "../policies/ComplaintStatusPolicy.js";
import { complaintRepository } from "../repositories/ComplaintRepository.js";
import { generateComplaintId } from "../utils/complaintId.js";
import { notificationService } from "./NotificationService.js";

const MAX_ID_GENERATION_ATTEMPTS = 10;

/**
 * Application service for complaint lifecycle behavior.
 */
export class ComplaintService {
  /**
   * @param {{
   *   repository?: typeof complaintRepository,
   *   notifier?: typeof notificationService
   * }} dependencies
   */
  constructor({ repository = complaintRepository, notifier = notificationService } = {}) {
    this.repository = repository;
    this.notifier = notifier;
  }

  /**
   * Convert query parameters into the existing complaint list filter contract.
   * @param {Record<string, unknown>} query
   * @returns {Record<string, unknown>}
   */
  buildComplaintFilter(query = {}) {
    const filter = {};
    if (query.citizenId) {
      filter.citizenId = query.citizenId;
    }
    if (query.assignedTo) {
      filter.assignedTo = query.assignedTo;
    }
    return filter;
  }

  /**
   * List complaints in newest-first order.
   * @param {Record<string, unknown>} query
   * @returns {Promise<any[]>}
   */
  listComplaints(query = {}) {
    return this.repository.findAll(this.buildComplaintFilter(query));
  }

  /**
   * Get one complaint by public complaint id.
   * @param {string} id
   * @returns {Promise<any | null>}
   */
  getComplaintById(id) {
    return this.repository.findByPublicId(id);
  }

  /**
   * Create a complaint while preserving the current API payload shape.
   * @param {Record<string, any>} payload
   * @returns {Promise<any>}
   */
  async createComplaint(payload) {
    const {
      title,
      citizenId,
      citizenName,
      category,
      description,
      address,
      location,
      imageUrl,
      images,
    } = payload;

    const id = await this.generateUniqueComplaintId();
    const now = new Date();

    return this.repository.create({
      id,
      title,
      citizenId,
      citizenName,
      category,
      description,
      address: address || "",
      location: location || { type: "Point", coordinates: [0, 0] },
      imageUrl: imageUrl || "",
      images: images || [],
      status: SERVER_CONSTANTS.COMPLAINT_STATUS.PENDING,
      submittedAt: now,
      history: [
        {
          status: SERVER_CONSTANTS.COMPLAINT_STATUS.PENDING,
          actor: citizenName,
          note: "Complaint submitted",
          at: now,
        },
      ],
    });
  }

  /**
   * Assign a complaint to an employee.
   * @param {string} id
   * @param {{ employeeId: string, employeeName: string }} assignment
   * @returns {Promise<any | null>}
   */
  async assignComplaint(id, assignment) {
    const complaint = await this.repository.findByPublicId(id);
    if (!complaint) return null;

    complaint.assignedTo = assignment.employeeId;
    complaint.status = SERVER_CONSTANTS.COMPLAINT_STATUS.ASSIGNED;
    complaint.history.push({
      status: SERVER_CONSTANTS.COMPLAINT_STATUS.ASSIGNED,
      actor: "Admin",
      note: "Complaint assigned to " + assignment.employeeName,
      at: new Date(),
    });

    await this.repository.save(complaint);
    this.notifier.publishComplaintStatusUpdated(complaint);
    return complaint;
  }

  /**
   * Update complaint status using the current employee status rules.
   * @param {string} id
   * @param {{ status: string, note?: string }} update
   * @returns {Promise<any | null>}
   */
  async updateComplaintStatus(id, update) {
    if (!ComplaintStatusPolicy.canEmployeeSetStatus(update.status)) {
      throw new InvalidComplaintStatusError();
    }

    const complaint = await this.repository.findByPublicId(id);
    if (!complaint) return null;

    complaint.status = update.status;
    if (update.status === SERVER_CONSTANTS.COMPLAINT_STATUS.RESOLVED) {
      complaint.resolutionNotes = update.note;
    }
    complaint.history.push({
      status: update.status,
      actor: "Employee",
      note: update.note || "Status updated",
      at: new Date(),
    });

    await this.repository.save(complaint);
    this.notifier.publishComplaintStatusUpdated(complaint);
    return complaint;
  }

  /**
   * Delete a complaint by public complaint id.
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteComplaint(id) {
    return this.repository.deleteByPublicId(id);
  }

  /**
   * Generate a public id with the existing CMP-number format.
   * @returns {Promise<string>}
   */
  async generateUniqueComplaintId() {
    for (let attempt = 0; attempt < MAX_ID_GENERATION_ATTEMPTS; attempt += 1) {
      const id = generateComplaintId();
      if (!(await this.repository.existsByPublicId(id))) {
        return id;
      }
    }
    return generateComplaintId();
  }
}

export const complaintService = new ComplaintService();
