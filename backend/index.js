import "./config/env.js";
import cors from "cors";
import express from "express";
import { getClerkSecretKey } from "./config/clerk.js";
import complaintRoutes from "./routes/complaints.js";
import adminRoutes from "./routes/admin.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";
import { SERVER_CONSTANTS } from "./config/constants.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { connectDatabase } from "../database/connect.js";

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || SERVER_CONSTANTS.DEFAULT_API_PORT);
const allowedOrigins = SERVER_CONSTANTS.ALLOWED_ORIGINS;

if (!Number.isInteger(port) || port <= 0) {
  throw new Error(`Invalid PORT/API_PORT value: ${process.env.PORT || process.env.API_PORT}`);
}

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: false,
  }),
);
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({
    ok: true,
    service: "CivicTrack API",
    health: SERVER_CONSTANTS.ROUTES.HEALTH,
    apiBase: SERVER_CONSTANTS.ROUTES.API_V1,
  });
});

app.use(SERVER_CONSTANTS.ROUTES.COMPLAINTS_BASE, complaintRoutes);
app.use(SERVER_CONSTANTS.ROUTES.ADMIN_BASE, adminRoutes);

app.get(SERVER_CONSTANTS.ROUTES.HEALTH, (_req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer, allowedOrigins);

async function startServer() {
  await connectDatabase();
  console.log("Connected to MongoDB.");

  httpServer.listen(port, "0.0.0.0", () => {
    console.log(`CivicTrack API listening on 0.0.0.0:${port}`);
    if (!getClerkSecretKey()) {
      console.error("CLERK_SECRET_KEY is missing.");
    }
  });
}

startServer().catch((err) => {
  console.error("Failed to start CivicTrack API.");
  console.error(err);
  process.exit(1);
});
