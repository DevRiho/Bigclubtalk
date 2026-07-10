import { body } from "express-validator";

export const commentValidator = [
  body("content")
    .trim()
    .notEmpty()
    .withMessage("Comment content is required")
    .isLength({ max: 1200 })
    .withMessage("Comment content cannot exceed 1200 characters"),
  body("parent")
    .optional({ nullable: true })
    .isMongoId()
    .withMessage("Invalid parent comment ID")
];

export const commentUpdateValidator = [
  body("content")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Comment content cannot be empty")
    .isLength({ max: 1200 })
    .withMessage("Comment content cannot exceed 1200 characters"),
  body("status")
    .optional()
    .isIn(["visible", "hidden"])
    .withMessage("Invalid status value")
];

