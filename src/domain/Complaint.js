import { STATUS } from "../data/statusConstants";

/**
 * Domain model for complaint data returned by the API.
 */
export class Complaint {
  /**
   * @param {Record<string, any>} data
   */
  constructor(data = {}) {
    Object.assign(this, data);
  }

  /**
   * Build a complaint model from API response data.
   * @param {any} data
   * @returns {Complaint | null}
   */
  static fromApiResponse(data) {
    if (!data) return null;
    if (data instanceof Complaint) return data;
    return new Complaint(data);
  }

  /**
   * Build complaint models from an API response list.
   * @param {any[]} items
   * @returns {Complaint[]}
   */
  static listFromApiResponse(items) {
    if (!Array.isArray(items)) return [];
    return items.map((item) => Complaint.fromApiResponse(item));
  }

  /**
   * Whether the complaint is resolved.
   * @returns {boolean}
   */
  isResolved() {
    return this.status === STATUS.RESOLVED;
  }
}
