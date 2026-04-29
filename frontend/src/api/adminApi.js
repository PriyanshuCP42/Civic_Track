import { AUTH_CONSTANTS } from "../data/authConstants";

/**
 * Admin API methods.
 */
export const adminApi = {
  /**
   * Create an employee account via backend API.
   * @param {{name: string, email: string, password: string, department: string}} payload
   * @returns {Promise<any>}
   */
  async createEmployee(payload) {
    let response;
    try {
      response = await fetch(
        `${AUTH_CONSTANTS.API_BASE_URL}/admin/employees`,
        {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-email": AUTH_CONSTANTS.ADMIN_EMAIL,
          "x-admin-password": AUTH_CONSTANTS.ADMIN_PASSWORD,
        },
        body: JSON.stringify(payload),
        },
      );
    } catch {
      const err = new Error(
        `Cannot reach API at ${AUTH_CONSTANTS.API_BASE_URL} — is npm run dev:api running?`,
      );
      err.code = "NETWORK";
      throw err;
    }

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const err = new Error(
        data?.message ||
          (response.status === 409
            ? "This email is already registered in Clerk. Use another email or delete the user in Clerk Dashboard."
            : "Unable to create employee"),
      );
      err.status = response.status;
      throw err;
    }
    return data;
  },
};
