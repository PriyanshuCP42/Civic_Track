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

connectDatabase()
  .then(() => {})
  .catch((err) => { console.error(err); process.exit(1); });

const app = express();
const port = Number(process.env.PORT || process.env.API_PORT || SERVER_CONSTANTS.DEFAULT_API_PORT);
const allowedOrigins = SERVER_CONSTANTS.ALLOWED_ORIGINS;

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

app.use(SERVER_CONSTANTS.ROUTES.COMPLAINTS_BASE, complaintRoutes);
app.use(SERVER_CONSTANTS.ROUTES.ADMIN_BASE, adminRoutes);

app.get(SERVER_CONSTANTS.ROUTES.HEALTH, (_req, res) => {
  res.json({ ok: true });
});

app.use(errorHandler);

const httpServer = createServer(app);
initSocket(httpServer, allowedOrigins);

httpServer.listen(port, "0.0.0.0", () => {
  if (!getClerkSecretKey()) {
    console.error("CLERK_SECRET_KEY is missing.");
  }
});
