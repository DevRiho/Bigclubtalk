import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { issueTokens } from "../services/authService.js";
import { env } from "../config/env.js";

function tokenPayload(tokens) {
  return {
    accessToken: tokens.accessToken,
    refreshToken: tokens.refreshToken,
    refreshSecret: tokens.refreshSecret
  };
}

export const socialLogin = asyncHandler(async (req, res) => {
  const { provider, token, email, name, avatar } = req.body;

  if (!provider || provider !== "google") {
    throw new AppError("Invalid social provider", 400, "INVALID_PROVIDER");
  }

  let finalEmail = email;
  let finalName = name;
  let finalAvatar = avatar;
  let socialId = "";

  // 1. Google Verification
  if (!token) {
    throw new AppError("Google credential token is required", 400, "TOKEN_REQUIRED");
  }
  try {
    const { OAuth2Client } = await import("google-auth-library");
    const client = new OAuth2Client(env.googleClientId);
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: env.googleClientId
    });
    const payload = ticket.getPayload();
    if (!payload) {
      throw new AppError("Google token verification failed: empty payload", 401, "GOOGLE_AUTH_FAILED");
    }
    finalEmail = payload.email;
    finalName = payload.name;
    finalAvatar = payload.picture;
    socialId = payload.sub;
  } catch (error) {
    console.error("[SOCIAL AUTH] Google token verification error:", error);
    throw new AppError("Google token verification failed: " + error.message, 401, "GOOGLE_AUTH_FAILED");
  }

  if (!finalEmail) {
    throw new AppError("Failed to retrieve email from Google", 400, "EMAIL_REQUIRED");
  }

  // 3. Find or create user
  let user = await User.findOne({ email: finalEmail.toLowerCase() });

  if (user) {
    if (user.status !== "active") {
      throw new AppError("Account is suspended", 403, "ACCOUNT_SUSPENDED");
    }
    
    // Automatically verify email for social sign-ins
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }
    
    // Update provider information if they were not logged in via this provider previously
    if (user.socialProvider === "local" || !user.socialProvider) {
      user.socialProvider = provider;
      user.socialId = socialId;
    }

    // Update avatar if not already set
    if (finalAvatar && (!user.avatar || !user.avatar.url)) {
      user.avatar = { url: finalAvatar };
    }
    
    await user.save();
  } else {
    // Create new social user
    user = await User.create({
      name: finalName || finalEmail.split("@")[0],
      email: finalEmail.toLowerCase(),
      isEmailVerified: true,
      socialProvider: provider,
      socialId: socialId,
      avatar: finalAvatar ? { url: finalAvatar } : undefined,
      status: "active"
    });
  }

  // 4. Issue session tokens
  const tokens = await issueTokens(user);

  res.json({
    success: true,
    user,
    ...tokenPayload(tokens)
  });
});
