import { Router } from "express";
import { userController } from "../controller/user.controller.js";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router()

router.post('/sign-up' , userController.signUp);
router.post('/sign-in' , userController.signIn);
router.post('/verify-email' , userController.verifyEmail);
router.post('/verify-otp' , userController.verifyOtp);
router.post('/forget-password' , userController.forgetPassword);
router.post('/reset-password',userController.resetPassword);
router.post('/change-password',verifyUser,userController.changePassword);
router.post('/change-profilePic' , verifyUser,upload.single('profilePic') ,userController.changeProfilePic)
router.delete('/delete-profilePic' , verifyUser,userController.deleteProfilePic)

router.get('/get-user',verifyUser,userController.getCurrentUser);
export const userRouter = router


