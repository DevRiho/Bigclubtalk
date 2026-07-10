import { Router } from "express";
import { deleteComment, likeComment, updateComment } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { commentUpdateValidator } from "../validators/commentValidators.js";

export const commentRoutes = Router();

commentRoutes.patch("/:id", requireAuth, commentUpdateValidator, validate, updateComment);
commentRoutes.delete("/:id", requireAuth, deleteComment);
commentRoutes.post("/:id/like", requireAuth, likeComment);

