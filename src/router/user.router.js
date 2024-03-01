import { Router } from "express";
import { UserController } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router()

router.post('/sign-up' , UserController.signUp);
router.post('/sign-in' , UserController.signIn);
router.post('/verify-email' , UserController.verifyEmail);
router.post('/verify-otp' , UserController.verifyOtp);
router.post('/forgot-password' , UserController.forgotPassword);
router.post('/reset-password',UserController.resetPassword);
router.post('/change-password',verifyUser,UserController.changePassword);
router.post('/change-profilePic' , verifyUser,upload.single('profilePic') ,UserController.changeProfilePic)
router.delete('/delete-profilePic' , verifyUser,UserController.deleteProfilePic)
router.post('/google-login' , UserController.googleLoginUser);


router.get('/get-user',verifyUser,UserController.getCurrentUser);
export const userRouter = router


