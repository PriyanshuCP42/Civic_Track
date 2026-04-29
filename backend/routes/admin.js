import { Router } from "express";
import { SERVER_CONSTANTS } from "../config/constants.js";
import { authorize, verifyToken } from "../middleware/auth.js";
import { AdminCredentialPolicy } from "../policies/AdminCredentialPolicy.js";
import { employeeService } from "../services/EmployeeService.js";

const router = Router();

/**
 * POST /api/v1/admin/employees
 */
router.post(SERVER_CONSTANTS.ROUTES.ADMIN_EMPLOYEES, async (req, res, next) => {
  try {
    if (!AdminCredentialPolicy.isValidCredentialRequest(req)) {
      return res.status(403).json({ message: "Only admin can create employees." });
    }

    const employee = await employeeService.createEmployee(req.body || {});
    return res.status(201).json(employee);
  } catch (error) {
    return next(error);
  }
});

/**
 * GET /api/v1/admin/employees
 */
router.get(
  SERVER_CONSTANTS.ROUTES.ADMIN_EMPLOYEES,
  verifyToken,
  authorize(SERVER_CONSTANTS.ROLES.ADMIN),
  async (_req, res, next) => {
    try {
      const employees = await employeeService.listEmployees();
      return res.json(employees);
    } catch (error) {
      return next(error);
    }
  },
);

export default router;
