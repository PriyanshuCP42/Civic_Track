import "./config/env.js";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import { getClerkClient, getClerkSecretKey } from "./config/clerk.js";
import { verifyToken, authorize } from "./middleware/auth.js";
import complaintRoutes from "./routes/complaints.js";
import { createServer } from "http";
import { initSocket } from "./utils/socket.js";

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => { console.error(err); process.exit(1); });

const app = express();
const port = Number(process.env.API_PORT || 8787);

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Ashmit";

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

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

app.use('/api/v1/complaints', complaintRoutes);

app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

app.post("/api/v1/admin/employees", async (req, res) => {
  try {
    const adminEmail = String(req.headers["x-admin-email"] || "").toLowerCase();
    const adminPassword = String(req.headers["x-admin-password"] || "");
    const isAdmin = adminEmail === ADMIN_EMAIL && adminPassword === ADMIN_PASSWORD;

    if (!isAdmin) {
      return res.status(403).json({ message: "Only admin can create employees." });
    }

    if (!getClerkClient()) {
      return res.status(500).json({ message: "Missing CLERK_SECRET_KEY in server environment." });
    }

    const { name, email, password, department } = req.body || {};
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "name, email, password, department are required." });
    }

    const firstName = String(name).trim().split(" ")[0] || "Employee";
    const user = await getClerkClient().users.createUser({
      emailAddress: [String(email).trim().toLowerCase()],
      password: String(password),
      firstName,
      skipPasswordChecks: true,
      publicMetadata: {
        role: "employee",
        department: String(department),
      },
    });

    const primaryEmail = user.emailAddresses?.[0];
    if (primaryEmail?.id) {
      await getClerkClient().emailAddresses.updateEmailAddress(primaryEmail.id, { verified: true });
    }

    return res.status(201).json({
      id: user.id,
      name: user.fullName || name,
      email: user.emailAddresses?.[0]?.emailAddress || email,
      department,
      assignedCount: 0,
      joinedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[admin/employees]", error);
    const message =
      error?.errors?.[0]?.longMessage ||
      error?.errors?.[0]?.message ||
      error?.message ||
      "Unable to create employee";
    const status = error?.status || error?.statusCode;
    const code = error?.errors?.[0]?.code;
    if (status === 422 || code === "form_identifier_exists") {
      return res.status(409).json({ message: "A user with this email already exists." });
    }
    return res.status(typeof status === "number" && status >= 400 && status < 600 ? status : 500).json({ message });
  }
});

// GET /api/v1/admin/employees
app.get("/api/v1/admin/employees", verifyToken, authorize("admin"), async (req, res, next) => {
  try {
    if (!getClerkClient()) {
      return res.status(500).json({ message: "Missing CLERK_SECRET_KEY in server environment." });
    }

    const { data: users } = await getClerkClient().users.getUserList({ limit: 100 });

    const employees = users
      .filter((u) => u.publicMetadata?.role === "employee")
      .map((u) => ({
        id: u.id,
        name: u.fullName,
        email: u.emailAddresses[0]?.emailAddress,
        department: u.publicMetadata?.department,
        joinedAt: u.createdAt,
      }));

    return res.json(employees);
  } catch (err) {
    next(err);
  }
});

const httpServer = createServer(app);
const io = initSocket(httpServer, allowedOrigins);

httpServer.listen(port, () => {
  console.log(`CLERK_SECRET_KEY loaded: ${Boolean(getClerkSecretKey())}`);
  console.log(`SCCMS API running on http://localhost:${port}`);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});
