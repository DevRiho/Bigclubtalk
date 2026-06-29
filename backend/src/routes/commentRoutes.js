import { Router } from "express";
import { deleteComment, likeComment, updateComment } from "../controllers/commentController.js";
import { requireAuth } from "../middleware/auth.js";

export const commentRoutes = Router();

commentRoutes.patch("/:id", requireAuth, updateComment);
commentRoutes.delete("/:id", requireAuth, deleteComment);
commentRoutes.post("/:id/like", requireAuth, likeComment);
