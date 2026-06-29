import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";
import { authRoutes } from "./routes/authRoutes.js";
import { postRoutes } from "./routes/postRoutes.js";
import { categoryRoutes } from "./routes/categoryRoutes.js";
import { commentRoutes } from "./routes/commentRoutes.js";
import { authorRoutes } from "./routes/authorRoutes.js";
import { newsletterRoutes } from "./routes/newsletterRoutes.js";
import { adminRoutes } from "./routes/adminRoutes.js";
import { searchRoutes } from "./routes/searchRoutes.js";

export const app = express();

app.use(helmet());
app.use(cors({ origin: env.clientUrl, credentials: true }));
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, limit: 250 }));
if (env.nodeEnv !== "test") app.use(morgan("dev"));

app.get("/health", (req, res) => res.json({ status: "ok", service: "big-club-talk-api" }));
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/authors", authorRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/search", searchRoutes);

app.use(notFound);
app.use(errorHandler);
