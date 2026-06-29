import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Follower } from "../models/Follower.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ROLES } from "../constants/roles.js";

export const listAuthors = asyncHandler(async (req, res) => {
  const authors = await User.find({ role: { $in: [ROLES.AUTHOR, ROLES.ADMIN] }, status: "active" }).select("name title bio avatar socialLinks");
  res.json({ success: true, data: authors });
});

export const getAuthor = asyncHandler(async (req, res) => {
  const [author, posts] = await Promise.all([
    User.findById(req.params.id).select("name title bio avatar socialLinks"),
    Post.find({ author: req.params.id, status: "published" }).sort({ publishedAt: -1 }).limit(12)
  ]);
  res.json({ success: true, data: { author, posts } });
});

export const followAuthor = asyncHandler(async (req, res) => {
  const existing = await Follower.findOne({ follower: req.user._id, author: req.params.id });
  if (existing) {
    await existing.deleteOne();
    return res.json({ success: true, following: false });
  }
  await Follower.create({ follower: req.user._id, author: req.params.id });
  res.json({ success: true, following: true });
});
