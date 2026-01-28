import { Router } from "express";
import * as authController from "../controllers/authController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-phone", authController.verifyPhone);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOTP);
router.get("/me", authenticate, authController.getMe);

export default router;

