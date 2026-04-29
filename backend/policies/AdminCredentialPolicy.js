import { SERVER_CONSTANTS } from "../config/constants.js";

/**
 * Policy for the existing admin credential header flow.
 */
export class AdminCredentialPolicy {
  /**
   * Validate request includes the configured admin credentials.
   * @param {import("express").Request} req
   * @returns {boolean}
   */
  static isValidCredentialRequest(req) {
    const adminEmail = String(req.headers[SERVER_CONSTANTS.AUTH.HEADER_ADMIN_EMAIL] || "").toLowerCase();
    const adminPassword = String(req.headers[SERVER_CONSTANTS.AUTH.HEADER_ADMIN_PASSWORD] || "");
    return (
      adminEmail === SERVER_CONSTANTS.ADMIN_EMAIL &&
      adminPassword === SERVER_CONSTANTS.ADMIN_PASSWORD
    );
  }
}
