import Complaint from "../models/Complaint.js";

/**
 * Persistence gateway for complaint documents.
 */
export class ComplaintRepository {
  /**
   * @param {typeof Complaint} model
   */
  constructor(model = Complaint) {
    this.model = model;
  }

  /**
   * Find complaints using the current API sorting contract.
   * @param {Record<string, unknown>} filter
   * @returns {Promise<any[]>}
   */
  findAll(filter = {}) {
    return this.model.find(filter).sort({ submittedAt: -1 });
  }

  /**
   * Find one complaint by public complaint id.
   * @param {string} id
   * @returns {Promise<any | null>}
   */
  findByPublicId(id) {
    return this.model.findOne({ id });
  }

  /**
   * Check whether a public complaint id already exists.
   * @param {string} id
   * @returns {Promise<boolean>}
   */
  async existsByPublicId(id) {
    const existing = await this.model.exists({ id });
    return Boolean(existing);
  }

  /**
   * Create a complaint document.
   * @param {Record<string, unknown>} payload
   * @returns {Promise<any>}
   */
  create(payload) {
    return this.model.create(payload);
  }

  /**
   * Save a complaint document.
   * @param {any} complaint
   * @returns {Promise<any>}
   */
  save(complaint) {
    return complaint.save();
  }

  /**
   * Delete one complaint by public complaint id.
   * @param {string} id
   * @returns {Promise<any>}
   */
  deleteByPublicId(id) {
    return this.model.deleteOne({ id });
  }
}

export const complaintRepository = new ComplaintRepository();
