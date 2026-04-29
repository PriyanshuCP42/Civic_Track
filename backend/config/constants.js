const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

function parseOrigins(value) {
  return String(value || "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

/**
 * Shared backend constants.
 */
export const SERVER_CONSTANTS = {
  ROUTES: {
    API_V1: "/api/v1",
    HEALTH: "/health",
    COMPLAINTS_BASE: "/api/v1/complaints",
    ADMIN_BASE: "/api/v1/admin",
    ADMIN_EMPLOYEES: "/employees",
  },
  AUTH: {
    BEARER_PREFIX: "Bearer ",
    HARDCODED_ADMIN_ID: "hardcoded-admin",
    HARDCODED_ADMIN_TOKEN: "hardcoded-admin-token",
    HEADER_ADMIN_EMAIL: "x-admin-email",
    HEADER_ADMIN_PASSWORD: "x-admin-password",
  },
  ROLES: {
    ADMIN: "admin",
    CITIZEN: "citizen",
    EMPLOYEE: "employee",
  },
  ADMIN_EMAIL: "admin@gmail.com",
  ADMIN_PASSWORD: "Ashmit",
  DEFAULT_API_PORT: 8787,
  ALLOWED_ORIGINS: [
    ...new Set([
      ...DEFAULT_ALLOWED_ORIGINS,
      ...parseOrigins(process.env.CORS_ORIGINS || process.env.CLIENT_ORIGIN),
    ]),
  ],
  COMPLAINT_STATUS: {
    PENDING: "PENDING",
    ASSIGNED: "ASSIGNED",
    IN_PROGRESS: "IN_PROGRESS",
    RESOLVED: "RESOLVED",
  },
  COMPLAINT_ID: {
    PREFIX: "CMP-",
    MIN: 1000,
    RANGE: 9000,
  },
  SOCKET: {
    CONNECTION_EVENT: "connection",
    COMPLAINT_ROOM_PREFIX: "complaint_",
    STATUS_UPDATED_EVENT: "status_updated",
    JOIN_COMPLAINT_EVENT: "join_complaint",
  },
};
