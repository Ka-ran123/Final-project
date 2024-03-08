import { Router } from "express";
import { upload } from "../middleware/multer.middleware.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { AgentController } from "../controller/agent.controller.js";

const router = Router();

router.post('/add-agent', upload.fields([{ name: 'aadharCardPic', maxCount: 2 }, { name: 'panCardPic', maxCount: 2 }]), AgentController.addAgent);
router.get('/getall-agent' , verifyUser, AgentController.getAllAgent)
router.post('/set-meeting' , AgentController.agentMetting);
router.post('/verify-agent',AgentController.verifyEmail);

export const agentRouter = router
