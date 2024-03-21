import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { addFeedBack,getFeedBack } from "../controller/feedback.controller.js";

const router = Router();

router.post('/add-feedback' , verifyUser ,addFeedBack )
router.get('/get-feedbacks' , verifyUser ,getFeedBack )

export const feedbackRouter = router;
