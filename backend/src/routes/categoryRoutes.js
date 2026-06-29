import { Router } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categoryController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", requireAuth, allowRoles("admin"), createCategory);
categoryRoutes.patch("/:id", requireAuth, allowRoles("admin"), updateCategory);
categoryRoutes.delete("/:id", requireAuth, allowRoles("admin"), deleteCategory);
