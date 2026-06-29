import { body } from "express-validator";

export const registerValidator = [
  body("name").trim().isLength({ min: 2, max: 80 }).withMessage("Name must be between 2 and 80 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isStrongPassword({ minLength: 8, minSymbols: 0 }).withMessage("Password must be at least 8 characters and include mixed characters")
];

export const loginValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

export const otpValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("otp").isLength({ min: 6, max: 6 }).withMessage("Six digit OTP is required")
];

export const resetValidator = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("token").notEmpty().withMessage("Reset token is required"),
  body("password").isStrongPassword({ minLength: 8, minSymbols: 0 }).withMessage("Password must be at least 8 characters and include mixed characters")
];
