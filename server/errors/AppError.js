/**
 * Application error with an HTTP status code.
 */
export class AppError extends Error {
  /**
   * @param {string} message
   * @param {number} status
   */
  constructor(message, status) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

/**
 * Error used when a request violates complaint status rules.
 */
export class InvalidComplaintStatusError extends AppError {
  constructor() {
    super("Invalid status", 400);
    this.name = "InvalidComplaintStatusError";
  }
}
