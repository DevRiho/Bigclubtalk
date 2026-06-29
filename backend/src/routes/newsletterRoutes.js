import { Router } from "express";
import { listSubscribers, subscribe, unsubscribe } from "../controllers/newsletterController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";

export const newsletterRoutes = Router();

newsletterRoutes.post("/subscribe", subscribe);
newsletterRoutes.post("/unsubscribe", unsubscribe);
newsletterRoutes.get("/subscribers", requireAuth, allowRoles("admin"), listSubscribers);
