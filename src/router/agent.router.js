import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyAgent } from "../middleware/agent.middleware.js";
import {
  addAgent,
  getAllAgent,
  agentMetting,
  verifyEmail,
} from "../controller/agent.controller.js";

const router = Router();

router.post(
  "/add-agent",
  upload.fields([
    { name: "adharCardFront", maxCount: 1 },
    { name: "adharCardBack", maxCount: 1 },
    { name: "panCard", maxCount: 1 },
  ]),
  addAgent
);
router.get("/getall-agent", verifyAgent, getAllAgent);
router.post("/set-meeting", agentMetting);
router.post("/verify-agent", verifyEmail);

export const agentRouter = router;
