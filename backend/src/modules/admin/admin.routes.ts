import { Router } from "express";

import { authenticate, authorize } from "../auth/auth.middleware";
import { dashboardStats, updateIssueStatus } from "./admin.controller";

const router = Router();

router.get(
  "/stats",
  authenticate,
  authorize("admin"),
  dashboardStats
);

router.patch(
  "/issues/:id/status",
  authenticate,
  authorize("admin"),
  updateIssueStatus
);

export default router;