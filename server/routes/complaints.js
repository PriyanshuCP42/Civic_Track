import { Router } from "express";
import Complaint from "../models/Complaint.js";
import { verifyToken, authorize } from "../middleware/auth.js";
import { getIO } from "../utils/socket.js";
import { SERVER_CONSTANTS } from "../config/constants.js";
import { generateComplaintId } from "../utils/complaintId.js";

const router = Router();

// GET /api/v1/complaints
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.citizenId) {
      filter.citizenId = req.query.citizenId;
    }
    const complaints = await Complaint.find(filter).sort({ submittedAt: -1 });
    return res.json(complaints);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/complaints/:id
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// POST /api/v1/complaints
router.post("/", verifyToken, authorize(SERVER_CONSTANTS.ROLES.CITIZEN), async (req, res, next) => {
  try {
    const { title, citizenId, citizenName, category, description, address, location, imageUrl, images } = req.body;

    const id = generateComplaintId();
    const now = new Date();

    const complaint = await Complaint.create({
      id,
      title,
      citizenId,
      citizenName,
      category,
      description,
      address: address || "",
      location: location || { type: "Point", coordinates: [0, 0] },
      imageUrl: imageUrl || "",
      images: images || [],
      status: SERVER_CONSTANTS.COMPLAINT_STATUS.PENDING,
      submittedAt: now,
      history: [
        {
          status: SERVER_CONSTANTS.COMPLAINT_STATUS.PENDING,
          actor: citizenName,
          note: "Complaint submitted",
          at: now,
        },
      ],
    });

    return res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/complaints/:id/assign
router.patch("/:id/assign", verifyToken, authorize(SERVER_CONSTANTS.ROLES.ADMIN), async (req, res, next) => {
  try {
    const { employeeId, employeeName } = req.body;
    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.assignedTo = employeeId;
    complaint.status = SERVER_CONSTANTS.COMPLAINT_STATUS.ASSIGNED;
    complaint.history.push({
      status: SERVER_CONSTANTS.COMPLAINT_STATUS.ASSIGNED,
      actor: "Admin",
      note: "Complaint assigned to " + employeeName,
      at: new Date(),
    });

    await complaint.save();

    getIO()
      .to(`${SERVER_CONSTANTS.SOCKET.COMPLAINT_ROOM_PREFIX}${complaint.id}`)
      .emit(SERVER_CONSTANTS.SOCKET.STATUS_UPDATED_EVENT, {
      id: complaint.id,
      status: complaint.status,
      history: complaint.history,
    });

    return res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/complaints/:id/status
router.patch("/:id/status", verifyToken, authorize(SERVER_CONSTANTS.ROLES.EMPLOYEE), async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (
      ![
        SERVER_CONSTANTS.COMPLAINT_STATUS.IN_PROGRESS,
        SERVER_CONSTANTS.COMPLAINT_STATUS.RESOLVED,
      ].includes(status)
    ) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const complaint = await Complaint.findOne({ id: req.params.id });
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }

    complaint.status = status;
    if (status === SERVER_CONSTANTS.COMPLAINT_STATUS.RESOLVED) {
      complaint.resolutionNotes = note;
    }
    complaint.history.push({
      status,
      actor: "Employee",
      note: note || "Status updated",
      at: new Date(),
    });

    await complaint.save();

    getIO()
      .to(`${SERVER_CONSTANTS.SOCKET.COMPLAINT_ROOM_PREFIX}${complaint.id}`)
      .emit(SERVER_CONSTANTS.SOCKET.STATUS_UPDATED_EVENT, {
      id: complaint.id,
      status: complaint.status,
      history: complaint.history,
    });

    return res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/complaints/:id
router.delete("/:id", verifyToken, authorize(SERVER_CONSTANTS.ROLES.ADMIN), async (req, res, next) => {
  try {
    await Complaint.deleteOne({ id: req.params.id });
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
