import { asyncHandler } from "../utils/asyncHandler.js";
import { issueTokens, loginUser, refreshSession, registerUser, resetPassword, sendPasswordReset, verifyEmailOtp } from "../services/authService.js";

function tokenPayload(tokens) {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    refreshSecret: tokens.refreshSecret
  };
}

export const register = asyncHandler(async (req, res) => {
  const user = await registerUser(req.body);
  const tokens = await issueTokens(user);
  res.status(201).json({ success: true, user, ...tokenPayload(tokens) });
});

export const login = asyncHandler(async (req, res) => {
  const user = await loginUser(req.body);
  const tokens = await issueTokens(user);
  res.json({ success: true, user, ...tokenPayload(tokens) });
});

export const refresh = asyncHandler(async (req, res) => {
  const tokens = await refreshSession(req.body.refreshToken, req.body.refreshSecret);
  res.json({ success: true, ...tokenPayload(tokens) });
});

export const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    req.user.refreshTokens = [];
    await req.user.save();
  }
  res.json({ success: true });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user });
});

export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await verifyEmailOtp(req.body);
  res.json({ success: true, user });
});

export const forgotPassword = asyncHandler(async (req, res) => {
  await sendPasswordReset(req.body.email);
  res.json({ success: true, message: "If an account exists, a reset link has been sent" });
});

export const resetPasswordController = asyncHandler(async (req, res) => {
  await resetPassword(req.body);
  res.json({ success: true });
});
