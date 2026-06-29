import { Router } from "express";
import { getPosts } from "../controllers/postController.js";

export const searchRoutes = Router();

searchRoutes.get("/", getPosts);
