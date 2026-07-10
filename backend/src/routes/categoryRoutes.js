import { Router } from "express";
import { createCategory, deleteCategory, listCategories, updateCategory } from "../controllers/categoryController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { categoryValidator, categoryUpdateValidator } from "../validators/categoryValidators.js";

export const categoryRoutes = Router();

categoryRoutes.get("/", listCategories);
categoryRoutes.post("/", requireAuth, allowRoles("admin"), categoryValidator, validate, createCategory);
categoryRoutes.patch("/:id", requireAuth, allowRoles("admin"), categoryUpdateValidator, validate, updateCategory);
categoryRoutes.delete("/:id", requireAuth, allowRoles("admin"), deleteCategory);

