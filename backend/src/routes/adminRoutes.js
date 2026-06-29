import { Router } from "express";
import { analytics, listUsers, updateUser, listPosts, listComments } from "../controllers/adminController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, allowRoles("admin"));
adminRoutes.get("/analytics", analytics);
adminRoutes.get("/users", listUsers);
adminRoutes.patch("/users/:id", updateUser);
adminRoutes.get("/posts", listPosts);
adminRoutes.get("/comments", listComments);

