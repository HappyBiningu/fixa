import { Router } from "express";
import * as authController from "../controllers/authController";
import * as userController from "../controllers/userController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/register", authController.register);
router.post("/verify-phone", authController.verifyPhone);
router.post("/login", authController.login);
router.post("/resend-otp", authController.resendOTP);
router.get("/me", authenticate, authController.getMe);
router.put("/me", authenticate, userController.updateProfile);
router.post("/me/deactivate", authenticate, userController.deactivateAccount);
router.post("/me/delete", authenticate, userController.deleteAccount);

export default router;

