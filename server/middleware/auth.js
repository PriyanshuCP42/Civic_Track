import { verifyToken as clerkVerifyToken } from "@clerk/backend";
import { getClerkClient } from "../config/clerk.js";

/**
 * verifyToken middleware
 * Handles both "hardcoded-admin-token" and real Clerk JWT tokens.
 */
export async function verifyToken(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    // --- hardcoded admin token ---
    if (token === "hardcoded-admin-token") {
      req.user = { id: "hardcoded-admin", role: "admin", email: "admin@gmail.com" };
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
      email === "admin@gmail.com"
        ? "admin"
        : clerkUser.publicMetadata?.role || "citizen";

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
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    return next();
  };
}
