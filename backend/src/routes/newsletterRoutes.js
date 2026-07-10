import { Router } from "express";
import { listSubscribers, subscribe, unsubscribe } from "../controllers/newsletterController.js";
import { allowRoles, requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { newsletterValidator } from "../validators/newsletterValidators.js";

export const newsletterRoutes = Router();

newsletterRoutes.post("/subscribe", newsletterValidator, validate, subscribe);
newsletterRoutes.post("/unsubscribe", newsletterValidator, validate, unsubscribe);
newsletterRoutes.get("/subscribers", requireAuth, allowRoles("admin"), listSubscribers);

