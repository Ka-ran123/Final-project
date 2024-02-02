import { Router } from "express";
import { userController } from "../controller/user.controller.js";
const router = Router()

router.post('/sign-up' , userController.signUp);
router.post('/sign-in' , userController.signIn);
router.post('/verify-email' , userController.verifyEmail);
router.post('/verify-otp' , userController.verifyOtp);

export const userRouter = router