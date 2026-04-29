function trimTrailingSlash(value) {
  return String(value || "").replace(/\/+$/, "");
}

const apiOrigin = trimTrailingSlash(import.meta.env.VITE_API_ORIGIN);

export const API_BASE_URL = apiOrigin ? `${apiOrigin}/api/v1` : "/api/v1";
export const SOCKET_URL = trimTrailingSlash(import.meta.env.VITE_SOCKET_URL || apiOrigin) || "/";
