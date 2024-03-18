import { Router } from "express";
const router = Router();
import { totalUserCount } from "../controller/user.controller.js";
import {
  totalPropertyCount,
  totalSellPropertyCount,
  totalRentPropertyCount,
} from "../controller/property.controller.js";
import { totalAgentCount } from "../controller/agent.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

router.get("/total-user-count", verifyUser, totalUserCount);
router.get("/total-property-count", verifyUser, totalPropertyCount);
router.get("/total-rentproperty-count", verifyUser, totalRentPropertyCount);
router.get("/total-sellproperty-count", verifyUser, totalSellPropertyCount);
router.get("/total-agent-count", verifyUser, totalAgentCount);

export const adminRouter = router;
