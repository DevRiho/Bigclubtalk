import { Router } from "express";
import { bookmarkPost, createPostController, deletePostController, getFeaturedPosts, getPostBySlug, getPosts, getTrendingPosts, likePost, recordView, updatePostController } from "../controllers/postController.js";
import { addComment, getComments } from "../controllers/commentController.js";
import { requireAuth, allowRoles } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { postValidator } from "../validators/postValidators.js";
import { commentValidator } from "../validators/commentValidators.js";

export const postRoutes = Router();

postRoutes.get("/", getPosts);
postRoutes.get("/featured", getFeaturedPosts);
postRoutes.get("/trending", getTrendingPosts);
postRoutes.get("/:slug", getPostBySlug);
postRoutes.post("/", requireAuth, allowRoles("author", "admin"), postValidator, validate, createPostController);
postRoutes.patch("/:id", requireAuth, allowRoles("author", "admin"), updatePostController);
postRoutes.delete("/:id", requireAuth, allowRoles("author", "admin"), deletePostController);
postRoutes.post("/:id/view", recordView);
postRoutes.post("/:id/like", requireAuth, likePost);
postRoutes.post("/:id/bookmark", requireAuth, bookmarkPost);
postRoutes.get("/:postId/comments", getComments);
postRoutes.post("/:postId/comments", requireAuth, commentValidator, validate, addComment);

