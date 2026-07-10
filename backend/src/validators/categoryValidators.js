import { body } from "express-validator";

export const categoryValidator = [
  body("name")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  body("slug")
    .optional()
    .trim()
    .isSlug()
    .withMessage("Invalid slug format"),
  body("color")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid 6-character hex color (e.g. #E10600)")
];

export const categoryUpdateValidator = [
  body("name")
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Category name must be between 2 and 100 characters"),
  body("slug")
    .optional()
    .trim()
    .isSlug()
    .withMessage("Invalid slug format"),
  body("color")
    .optional()
    .trim()
    .matches(/^#[0-9A-Fa-f]{6}$/)
    .withMessage("Color must be a valid 6-character hex color (e.g. #E10600)")
];

