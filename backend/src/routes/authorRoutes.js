import { Router } from "express";
import { followAuthor, getAuthor, listAuthors } from "../controllers/authorController.js";
import { requireAuth } from "../middleware/auth.js";

export const authorRoutes = Router();

authorRoutes.get("/", listAuthors);
authorRoutes.get("/:id", getAuthor);
authorRoutes.post("/:id/follow", requireAuth, followAuthor);
