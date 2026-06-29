import { validationResult } from "express-validator";
import { AppError } from "../utils/AppError.js";

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new AppError(errors.array()[0].msg, 422, "VALIDATION_ERROR");
  }
  next();
}
