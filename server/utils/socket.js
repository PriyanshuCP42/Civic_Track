import { Server } from "socket.io";
import { SERVER_CONSTANTS } from "../config/constants.js";

let io;

/**
 * Initialize Socket.IO server and complaint room subscription.
 * @param {import("http").Server} httpServer
 * @param {string[]} allowedOrigins
 * @returns {import("socket.io").Server}
 */
export function initSocket(httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
  });

  io.on(SERVER_CONSTANTS.SOCKET.CONNECTION_EVENT, (socket) => {
    socket.on(SERVER_CONSTANTS.SOCKET.JOIN_COMPLAINT_EVENT, (complaintId) => {
      socket.join(`${SERVER_CONSTANTS.SOCKET.COMPLAINT_ROOM_PREFIX}${complaintId}`);
    });
  });

  return io;
}

/**
 * Get initialized Socket.IO instance.
 * @returns {import("socket.io").Server}
 */
export function getIO() {
  if (!io) throw new Error("Socket.io not initialised");
  return io;
}
