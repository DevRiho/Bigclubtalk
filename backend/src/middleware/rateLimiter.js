import rateLimit from "express-rate-limit";

// Stricter rate limiting for sensitive endpoints (login, registration, forgot-password)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 15, // Limit each IP to 15 attempts per windowMs
  message: {
    success: false,
    message: "Too many verification or authentication requests. Please try again in 15 minutes.",
    code: "TOO_MANY_REQUESTS"
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Standard rate limiter for API endpoints (250 requests per 15 mins)
export const standardLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 250,
  message: {
    success: false,
    message: "Too many requests. Please slow down.",
    code: "TOO_MANY_REQUESTS"
  },
  standardHeaders: true,
  legacyHeaders: false
});
