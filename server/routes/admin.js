import { Router } from "express";
import { getClerkClient } from "../config/clerk.js";
import { SERVER_CONSTANTS } from "../config/constants.js";
import { authorize, verifyToken } from "../middleware/auth.js";

const router = Router();

/**
 * Validate request includes hardcoded admin credentials.
 * @param {import("express").Request} req
 * @returns {boolean}
 */
function isValidAdminCredentialRequest(req) {
  const adminEmail = String(req.headers[SERVER_CONSTANTS.AUTH.HEADER_ADMIN_EMAIL] || "").toLowerCase();
  const adminPassword = String(req.headers[SERVER_CONSTANTS.AUTH.HEADER_ADMIN_PASSWORD] || "");
  return (
    adminEmail === SERVER_CONSTANTS.ADMIN_EMAIL &&
    adminPassword === SERVER_CONSTANTS.ADMIN_PASSWORD
  );
}

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
 * POST /api/v1/admin/employees
 */
router.post(SERVER_CONSTANTS.ROUTES.ADMIN_EMPLOYEES, async (req, res) => {
  try {
    if (!isValidAdminCredentialRequest(req)) {
      return res.status(403).json({ message: "Only admin can create employees." });
    }

    const clerkClient = getClerkClient();
    if (!clerkClient) {
      return res
        .status(500)
        .json({ message: "Missing CLERK_SECRET_KEY in server environment." });
    }

    const { name, email, password, department } = req.body || {};
    if (!name || !email || !password || !department) {
      return res
        .status(400)
        .json({ message: "name, email, password, department are required." });
    }

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

    return res
      .status(201)
      .json(toCreatedEmployeeResponse(user, name, email, department));
  } catch (error) {
    const normalizedError = normalizeClerkError(error);
    return res
      .status(normalizedError.status)
      .json({ message: normalizedError.message });
  }
});

/**
 * GET /api/v1/admin/employees
 */
router.get(
  SERVER_CONSTANTS.ROUTES.ADMIN_EMPLOYEES,
  verifyToken,
  authorize(SERVER_CONSTANTS.ROLES.ADMIN),
  async (_req, res, next) => {
    try {
      const clerkClient = getClerkClient();
      if (!clerkClient) {
        return res
          .status(500)
          .json({ message: "Missing CLERK_SECRET_KEY in server environment." });
      }

      const { data: users } = await clerkClient.users.getUserList({ limit: 100 });
      const employees = users
        .filter((user) => user.publicMetadata?.role === SERVER_CONSTANTS.ROLES.EMPLOYEE)
        .map((user) => ({
          id: user.id,
          name: user.fullName,
          email: user.emailAddresses[0]?.emailAddress,
          department: user.publicMetadata?.department,
          joinedAt: user.createdAt,
        }));

      return res.json(employees);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
