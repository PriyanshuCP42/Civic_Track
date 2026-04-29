import { getClerkClient } from "../config/clerk.js";
import { SERVER_CONSTANTS } from "../config/constants.js";
import { AppError } from "../errors/AppError.js";

/**
 * Create the employee payload response used by the API contract.
 * @param {any} user
 * @param {string} fallbackName
 * @param {string} fallbackEmail
 * @param {string} department
 * @returns {{ id: string, name: string, email: string, department: string, assignedCount: number, joinedAt: string }}
 */
function toCreatedEmployeeResponse(user, fallbackName, fallbackEmail, department) {
  return {
    id: user.id,
    name: user.fullName || fallbackName,
    email: user.emailAddresses?.[0]?.emailAddress || fallbackEmail,
    department,
    assignedCount: 0,
    joinedAt: new Date().toISOString(),
  };
}

/**
 * Normalize Clerk exceptions into stable status/message values.
 * @param {any} error
 * @returns {{ status: number, message: string }}
 */
function normalizeClerkError(error) {
  const message =
    error?.errors?.[0]?.longMessage ||
    error?.errors?.[0]?.message ||
    error?.message ||
    "Unable to create employee";
  const status = error?.status || error?.statusCode;
  const code = error?.errors?.[0]?.code;

  if (status === 422 || code === "form_identifier_exists") {
    return { status: 409, message: "A user with this email already exists." };
  }

  return {
    status:
      typeof status === "number" && status >= 400 && status < 600 ? status : 500,
    message,
  };
}

/**
 * Application service for Clerk-backed employee operations.
 */
export class EmployeeService {
  /**
   * @param {{ clerkClientFactory?: typeof getClerkClient }} dependencies
   */
  constructor({ clerkClientFactory = getClerkClient } = {}) {
    this.clerkClientFactory = clerkClientFactory;
  }

  /**
   * Create an employee user in Clerk.
   * @param {{ name?: string, email?: string, password?: string, department?: string }} payload
   * @returns {Promise<{ id: string, name: string, email: string, department: string, assignedCount: number, joinedAt: string }>}
   */
  async createEmployee(payload = {}) {
    const clerkClient = this.getRequiredClerkClient();
    const { name, email, password, department } = payload;
    if (!name || !email || !password || !department) {
      throw new AppError("name, email, password, department are required.", 400);
    }

    try {
      const firstName = String(name).trim().split(" ")[0] || "Employee";
      const user = await clerkClient.users.createUser({
        emailAddress: [String(email).trim().toLowerCase()],
        password: String(password),
        firstName,
        skipPasswordChecks: true,
        publicMetadata: {
          role: SERVER_CONSTANTS.ROLES.EMPLOYEE,
          department: String(department),
        },
      });

      const primaryEmail = user.emailAddresses?.[0];
      if (primaryEmail?.id) {
        await clerkClient.emailAddresses.updateEmailAddress(primaryEmail.id, {
          verified: true,
        });
      }

      return toCreatedEmployeeResponse(user, name, email, department);
    } catch (error) {
      const normalizedError = normalizeClerkError(error);
      throw new AppError(normalizedError.message, normalizedError.status);
    }
  }

  /**
   * List Clerk users that have the employee role.
   * @returns {Promise<Array<{ id: string, name: string, email: string, department: unknown, joinedAt: unknown }>>}
   */
  async listEmployees() {
    const clerkClient = this.getRequiredClerkClient();
    const { data: users } = await clerkClient.users.getUserList({ limit: 100 });

    return users
      .filter((user) => user.publicMetadata?.role === SERVER_CONSTANTS.ROLES.EMPLOYEE)
      .map((user) => ({
        id: user.id,
        name: user.fullName,
        email: user.emailAddresses[0]?.emailAddress,
        department: user.publicMetadata?.department,
        joinedAt: user.createdAt,
      }));
  }

  /**
   * Get the configured Clerk client or throw the existing API message.
   * @returns {NonNullable<ReturnType<typeof getClerkClient>>}
   */
  getRequiredClerkClient() {
    const clerkClient = this.clerkClientFactory();
    if (!clerkClient) {
      throw new AppError("Missing CLERK_SECRET_KEY in server environment.", 500);
    }
    return clerkClient;
  }
}

export const employeeService = new EmployeeService();
