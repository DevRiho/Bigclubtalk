import { body } from "express-validator";

export const postValidator = [
  body("title").trim().isLength({ min: 8, max: 160 }).withMessage("Title must be between 8 and 160 characters"),
  body("content").isLength({ min: 50 }).withMessage("Content must be at least 50 characters"),
  body("excerpt").trim().isLength({ min: 20, max: 300 }).withMessage("Excerpt must be between 20 and 300 characters"),
  body("category").isMongoId().withMessage("Valid category is required"),
  body("status").optional().isIn(["draft", "published", "archived"]).withMessage("Invalid post status"),
  body("tags").optional().isArray().withMessage("Tags must be an array")
];
