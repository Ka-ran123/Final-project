import { Router } from "express";
import { verifyUser } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
import {
  signUp,
  signIn,
  verifyEmail,
  verifyOtp,
  forgotPassword,
  resetPassword,
  changePassword,
  changeProfilePic,
  deleteProfilePic,
  googleLoginUser,
  getCurrentUser,
} from "../controller/user.controller.js";
const router = Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.post("/verify-email", verifyEmail);
router.post("/verify-otp", verifyOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/change-password", verifyUser, changePassword);
router.post(
  "/change-profilePic",
  verifyUser,
  upload.single("profilePic"),
  changeProfilePic
);
router.delete("/delete-profilePic", verifyUser, deleteProfilePic);
router.post("/google-login", googleLoginUser);

router.get("/get-user", verifyUser, getCurrentUser);

// router.get("/log-out" , verifyUser ,logOutUser )

export const userRouter = router;
