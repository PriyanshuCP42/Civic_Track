import { verifyToken as clerkVerifyToken } from "@clerk/backend";
import { getClerkClient } from "../config/clerk.js";
import { SERVER_CONSTANTS } from "../config/constants.js";

/**
 * verifyToken middleware
 * Handles both hardcoded admin token and real Clerk JWT tokens.
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 * @param {import("express").NextFunction} next
 * @returns {Promise<void | import("express").Response>}
 */
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (
      !authHeader ||
      !authHeader.startsWith(SERVER_CONSTANTS.AUTH.BEARER_PREFIX)
    ) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(SERVER_CONSTANTS.AUTH.BEARER_PREFIX)[1];

    // --- hardcoded admin token ---
    if (token === SERVER_CONSTANTS.AUTH.HARDCODED_ADMIN_TOKEN) {
      req.user = {
        id: SERVER_CONSTANTS.AUTH.HARDCODED_ADMIN_ID,
        role: SERVER_CONSTANTS.ROLES.ADMIN,
        email: SERVER_CONSTANTS.ADMIN_EMAIL,
      };
      return next();
    }

    // --- real Clerk JWT ---
    const payload = await clerkVerifyToken(token, {
      secretKey: process.env.CLERK_SECRET_KEY,
    });

    const clerkUser = await getClerkClient().users.getUser(payload.sub);

    const email =
      clerkUser.emailAddresses[0]?.emailAddress?.toLowerCase() || "";
    const role =
      email === SERVER_CONSTANTS.ADMIN_EMAIL
        ? SERVER_CONSTANTS.ROLES.ADMIN
        : clerkUser.publicMetadata?.role || SERVER_CONSTANTS.ROLES.CITIZEN;

    req.user = { id: clerkUser.id, role, email };
    return next();
  } catch (err) {
    console.error("[verifyToken]", err?.message || err);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

/**
 * authorize middleware factory
 * Usage: authorize('admin', 'employee')
 * @param {...string} roles
 * @returns {(req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => void | import("express").Response}
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  };
}
