import { Router } from "express";
import { verifyToken, authorize } from "../middleware/auth.js";
import { SERVER_CONSTANTS } from "../config/constants.js";
import { complaintService } from "../services/ComplaintService.js";

const router = Router();

// GET /api/v1/complaints
router.get("/", verifyToken, async (req, res, next) => {
  try {
    const complaints = await complaintService.listComplaints(req.query);
    return res.json(complaints);
  } catch (err) {
    next(err);
  }
});

// GET /api/v1/complaints/:id
router.get("/:id", verifyToken, async (req, res, next) => {
  try {
    const complaint = await complaintService.getComplaintById(req.params.id);
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
    const complaint = await complaintService.createComplaint(req.body);
    return res.status(201).json(complaint);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/complaints/:id/assign
router.patch("/:id/assign", verifyToken, authorize(SERVER_CONSTANTS.ROLES.ADMIN), async (req, res, next) => {
  try {
    const complaint = await complaintService.assignComplaint(req.params.id, req.body);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/v1/complaints/:id/status
router.patch("/:id/status", verifyToken, authorize(SERVER_CONSTANTS.ROLES.EMPLOYEE), async (req, res, next) => {
  try {
    const complaint = await complaintService.updateComplaintStatus(req.params.id, req.body);
    if (!complaint) {
      return res.status(404).json({ message: "Complaint not found" });
    }
    return res.json(complaint);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/v1/complaints/:id
router.delete("/:id", verifyToken, authorize(SERVER_CONSTANTS.ROLES.ADMIN), async (req, res, next) => {
  try {
    await complaintService.deleteComplaint(req.params.id);
    return res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

export default router;
