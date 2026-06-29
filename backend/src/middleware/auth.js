import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { verifyAccessToken } from "../utils/token.js";

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization;
  const token = header?.startsWith("Bearer ") ? header.slice(7) : req.cookies.accessToken;

  if (!token) throw new AppError("Authentication required", 401, "AUTH_REQUIRED");

  const payload = verifyAccessToken(token);
  const user = await User.findById(payload.sub);

  if (!user || user.status !== "active") throw new AppError("Invalid authentication", 401, "AUTH_INVALID");

  req.user = user;
  next();
});

export function allowRoles(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new AppError("You do not have permission to perform this action", 403, "FORBIDDEN");
    }
    next();
  };
}
