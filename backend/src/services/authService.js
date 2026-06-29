import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { generateOtp, hashToken, randomToken, signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/token.js";
import { sendEmail } from "../emails/mailer.js";
import { otpTemplate, resetPasswordTemplate } from "../emails/templates.js";
import { env } from "../config/env.js";

function addMinutes(minutes) {
  return new Date(Date.now() + minutes * 60 * 1000);
}

function addDays(days) {
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

export async function issueTokens(user) {
  const tokenId = randomToken(16);
  const refreshSecret = randomToken(48);
  const refreshToken = signRefreshToken(user, tokenId);

  user.refreshTokens.push({
    tokenId,
    tokenHash: hashToken(refreshSecret),
    expiresAt: addDays(30)
  });
  await user.save();

  return {
    accessToken: signAccessToken(user),
    refreshToken,
    refreshSecret
  };
}

export async function registerUser({ name, email, password }) {
  const exists = await User.exists({ email });
  if (exists) throw new AppError("An account with this email already exists", 409, "EMAIL_EXISTS");

  const otp = generateOtp();
  const user = await User.create({
    name,
    email,
    password,
    emailOtpHash: hashToken(otp),
    emailOtpExpires: addMinutes(10)
  });

  await sendEmail({ to: email, subject: "Verify your Big Club Talk account", html: otpTemplate(otp) });
  return user;
}

export async function loginUser({ email, password }) {
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    throw new AppError("Invalid email or password", 401, "INVALID_CREDENTIALS");
  }
  if (user.status !== "active") throw new AppError("Account is suspended", 403, "ACCOUNT_SUSPENDED");
  return user;
}

export async function refreshSession(refreshToken, refreshSecret) {
  const payload = verifyRefreshToken(refreshToken);
  const user = await User.findById(payload.sub);
  if (!user) throw new AppError("Invalid refresh token", 401, "REFRESH_INVALID");

  const tokenIndex = user.refreshTokens.findIndex(
    (token) => token.tokenId === payload.tokenId && token.tokenHash === hashToken(refreshSecret) && token.expiresAt > new Date()
  );
  if (tokenIndex === -1) throw new AppError("Invalid refresh token", 401, "REFRESH_INVALID");

  user.refreshTokens.splice(tokenIndex, 1);
  await user.save();
  return issueTokens(user);
}

export async function verifyEmailOtp({ email, otp }) {
  const user = await User.findOne({ email }).select("+emailOtpHash +emailOtpExpires");
  if (!user || user.emailOtpHash !== hashToken(otp) || user.emailOtpExpires < new Date()) {
    throw new AppError("Invalid or expired verification code", 422, "OTP_INVALID");
  }

  user.isEmailVerified = true;
  user.emailOtpHash = undefined;
  user.emailOtpExpires = undefined;
  await user.save();
  return user;
}

export async function sendPasswordReset(email) {
  const user = await User.findOne({ email }).select("+passwordResetHash +passwordResetExpires");
  if (!user) return;

  const token = randomToken(32);
  user.passwordResetHash = hashToken(token);
  user.passwordResetExpires = addMinutes(15);
  await user.save();

  const url = `${env.clientUrl}/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
  await sendEmail({ to: email, subject: "Reset your Big Club Talk password", html: resetPasswordTemplate(url) });
}

export async function resetPassword({ email, token, password }) {
  const user = await User.findOne({ email }).select("+passwordResetHash +passwordResetExpires +password");
  if (!user || user.passwordResetHash !== hashToken(token) || user.passwordResetExpires < new Date()) {
    throw new AppError("Invalid or expired reset link", 422, "RESET_INVALID");
  }

  user.password = password;
  user.passwordResetHash = undefined;
  user.passwordResetExpires = undefined;
  user.refreshTokens = [];
  await user.save();
}
