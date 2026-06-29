import { Router } from "express";

import issueRoutes from "../modules/issue/issue.routes";
import adminRoutes from "../modules/admin/admin.routes";

const router = Router();

router.use("/issues", issueRoutes);
router.use("/admin", adminRoutes);

export default router;