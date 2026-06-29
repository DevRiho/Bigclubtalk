import { AppError } from "../utils/AppError.js";

export function notFound(req, res, next) {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404, "NOT_FOUND"));
}

export function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const payload = {
    success: false,
    message: err.isOperational ? err.message : "Something went wrong",
    code: err.code || "SERVER_ERROR"
  };

  if (process.env.NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  res.status(statusCode).json(payload);
}
