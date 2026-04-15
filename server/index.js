import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createClerkClient } from "@clerk/backend";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.join(__dirname, "..");

// Load in order; later files override so server-only secrets win.
dotenv.config({ path: path.join(rootDir, ".env") });
dotenv.config({ path: path.join(rootDir, ".env.local") });
dotenv.config({ path: path.join(rootDir, ".env.server") });

const app = express();
const port = Number(process.env.API_PORT || 8787);
const clerkSecretKey = process.env.CLERK_SECRET_KEY;

const ADMIN_EMAIL = "admin@gmail.com";
const ADMIN_PASSWORD = "Ashmit";

const clerkClient = clerkSecretKey ? createClerkClient({ secretKey: clerkSecretKey }) : null;

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

    if (!clerkClient) {
      return res.status(500).json({ message: "Missing CLERK_SECRET_KEY in server environment." });
    }

    const { name, email, password, department } = req.body || {};
    if (!name || !email || !password || !department) {
      return res.status(400).json({ message: "name, email, password, department are required." });
    }

    const firstName = String(name).trim().split(" ")[0] || "Employee";
    const user = await clerkClient.users.createUser({
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
      await clerkClient.emailAddresses.updateEmailAddress(primaryEmail.id, { verified: true });
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

app.listen(port, () => {
  console.log(`CLERK_SECRET_KEY loaded: ${Boolean(clerkSecretKey)}`);
  console.log(`SCCMS API running on http://localhost:${port}`);
});

