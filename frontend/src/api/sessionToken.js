import { AUTH_CONSTANTS } from "../data/authConstants";

/**
 * Refresh the Clerk session token before each API call.
 *
 * Clerk JWTs are short-lived, so this updates window.__sccmsToken,
 * which the axiosInstance interceptor reads.
 *
 * For the hardcoded admin token this is a no-op.
 * @returns {Promise<void>}
 */
export async function refreshSessionToken() {
  if (window.__sccmsToken === AUTH_CONSTANTS.HARDCODED_ADMIN_TOKEN) return;

  const clerk = window.Clerk;
  if (clerk?.session) {
    const newToken = await clerk.session.getToken();
    if (newToken) window.__sccmsToken = newToken;
  }
}
