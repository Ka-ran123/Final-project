import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { AgentController } from "../controller/agent.controller.js";

const router = Router();

router.post('/add-agent', upload.fields([{ name: 'aadharCardPic', maxCount: 2 }, { name: 'panCardPic', maxCount: 2 }]), AgentController.addAgent);

export const agentRouter = router
