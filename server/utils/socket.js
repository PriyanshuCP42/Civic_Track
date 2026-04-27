import { Server } from "socket.io";

let io;

export function initSocket(httpServer, allowedOrigins) {
  io = new Server(httpServer, {
    cors: { origin: allowedOrigins, methods: ["GET", "POST"] },
  });

  io.on("connection", (socket) => {
    socket.on("join_complaint", (complaintId) => {
      socket.join("complaint_" + complaintId);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error("Socket.io not initialised");
  return io;
}
