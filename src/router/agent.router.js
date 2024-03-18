import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyAgent } from "../middleware/agent.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import {
  addAgent,
  getAllAgent,
  agentMetting,
  verifyEmail,
  totalAgentCount
} from "../controller/agent.controller.js";

const router = Router();

router.post(
  "/add-agent",
  upload.fields([
    { name: "aadharCardPic", maxCount: 2 },
    { name: "panCardPic", maxCount: 2 },
  ]),
  addAgent
);
router.get("/getall-agent", verifyAgent, getAllAgent);
router.post("/set-meeting", agentMetting);
router.post("/verify-agent", verifyEmail);
router.get("/total-agent-count",verifyUser,totalAgentCount);

export const agentRouter = router;
