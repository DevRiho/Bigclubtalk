import { body } from "express-validator";

export const newsletterValidator = [
  body("email")
    .isEmail()
    .normalizeEmail()
    .withMessage("Valid email is required"),
  body("source")
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage("Source name is too long")
];
