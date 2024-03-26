import { Router } from "express";
const router = Router();
import { totalUserCount, totalUser } from "../controller/user.controller.js";
import {
  totalPropertyCount,
  totalSellPropertyCount,
  totalRentPropertyCount,
  getAllPropertyForAdmin,
  getOnlyRentPropertyForAdmin,
  getOnlySellPropertyForAdmin,
  getRecentProperty
} from "../controller/property.controller.js";
import { totalAgentCount, totalAgent } from "../controller/agent.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";

router.get("/total-user-count", verifyUser, totalUserCount);
router.get("/getall-user", verifyUser, totalUser);
router.get("/total-agent-count", verifyUser, totalAgentCount);
router.get("/getall-agent", verifyUser, totalAgent);
router.get("/total-property-count", verifyUser, totalPropertyCount);
router.get("/total-rentproperty-count", verifyUser, totalRentPropertyCount);
router.get("/total-sellproperty-count", verifyUser, totalSellPropertyCount);
router.get("/getall-property-admin", verifyUser, getAllPropertyForAdmin);
router.get(
  "/getall-rentproperty-admin",
  verifyUser,
  getOnlyRentPropertyForAdmin
);
router.get(
  "/getall-sellproperty-admin",
  verifyUser,
  getOnlySellPropertyForAdmin
);

router.get('/recent-property' , verifyUser , getRecentProperty)

export const adminRouter = router;
