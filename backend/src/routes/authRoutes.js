import { Router } from "express";
import { forgotPassword, login, logout, me, refresh, register, resetPasswordController, verifyEmail } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { loginValidator, otpValidator, registerValidator, resetValidator } from "../validators/authValidators.js";

export const authRoutes = Router();

authRoutes.post("/register", registerValidator, validate, register);
authRoutes.post("/login", loginValidator, validate, login);
authRoutes.post("/refresh", refresh);
authRoutes.post("/logout", requireAuth, logout);
authRoutes.get("/me", requireAuth, me);
authRoutes.post("/verify-email", otpValidator, validate, verifyEmail);
authRoutes.post("/forgot-password", forgotPassword);
authRoutes.post("/reset-password", resetValidator, validate, resetPasswordController);
