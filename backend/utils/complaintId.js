import { SERVER_CONSTANTS } from "../config/constants.js";

/**
 * Generate complaint identifier in current API format.
 * @returns {string}
 */
export function generateComplaintId() {
  const generatedNumber =
    SERVER_CONSTANTS.COMPLAINT_ID.MIN +
    Math.floor(Math.random() * SERVER_CONSTANTS.COMPLAINT_ID.RANGE);
  return `${SERVER_CONSTANTS.COMPLAINT_ID.PREFIX}${generatedNumber}`;
}
