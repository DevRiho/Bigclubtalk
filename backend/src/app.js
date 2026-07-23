import express from "express";
import path from "path";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
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
import { standardLimiter } from "./middleware/rateLimiter.js";

export const app = express();

app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
  })
);

const allowedOrigins = env.clientUrl
  ? env.clientUrl.split(",").map((url) => {
      let clean = url.trim();
      if (!clean.startsWith("http")) {
        clean = `https://${clean}`;
      }
      return clean.replace(/\/$/, "");
    })
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const cleanOrigin = origin.replace(/\/$/, "");
      if (allowedOrigins.includes(cleanOrigin) || env.nodeEnv === "development" || cleanOrigin.startsWith("http://localhost")) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(compression());
app.use(mongoSanitize());
app.use(standardLimiter);
if (env.nodeEnv !== "test") app.use(morgan("dev"));

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

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
