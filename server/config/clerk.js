import { createClerkClient } from "@clerk/backend";

let _clerkClient;
let _initialized = false;

function init() {
  if (!_initialized) {
    _initialized = true;
    const key = process.env.CLERK_SECRET_KEY;
    _clerkClient = key ? createClerkClient({ secretKey: key }) : null;
  }
}

/**
 * Get initialized Clerk client if secret key is configured.
 * @returns {import("@clerk/backend").ClerkClient | null}
 */
export function getClerkClient() {
  init();
  return _clerkClient;
}

/**
 * Get the active Clerk secret key from environment.
 * @returns {string | undefined}
 */
export function getClerkSecretKey() {
  return process.env.CLERK_SECRET_KEY;
}
