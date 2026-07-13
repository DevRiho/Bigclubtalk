import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { ROLES } from "../constants/roles.js";

const socialLinkSchema = new mongoose.Schema(
  {
    label: String,
    url: String
  },
  { _id: false }
);

const refreshTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true },
    tokenHash: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: false, minlength: 8, select: false },
    role: { type: String, enum: Object.values(ROLES), default: ROLES.USER, index: true },
    avatar: { url: String, publicId: String },
    bio: { type: String, maxlength: 500 },
    title: { type: String, maxlength: 120 },
    socialLinks: [socialLinkSchema],
    isEmailVerified: { type: Boolean, default: false },
    emailOtpHash: { type: String, select: false },
    emailOtpExpires: { type: Date, select: false },
    passwordResetHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
    refreshTokens: [refreshTokenSchema],
    socialProvider: { type: String, enum: ["local", "google", "facebook", "apple"], default: "local" },
    socialId: { type: String },
    status: { type: String, enum: ["active", "suspended"], default: "active", index: true }
  },
  { timestamps: true }
);

userSchema.index({ name: "text", email: "text" });

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate) {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model("User", userSchema);
