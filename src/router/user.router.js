import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
const router = Router()

router.post('/sign-up' , userController.signUp);
router.post('/sign-in' , userController.signIn);
router.post('/verify-email' , userController.verifyEmail);
router.post('/verify-otp' , userController.verifyOtp);
router.get('/get-user',verifyUser,userController.getData)

export const userRouter = router