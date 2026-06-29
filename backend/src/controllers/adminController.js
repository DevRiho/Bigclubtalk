import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { Comment } from "../models/Comment.js";
import { Like } from "../models/Like.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const analytics = asyncHandler(async (req, res) => {
  const [users, posts, comments, likes, popularArticles] = await Promise.all([
    User.countDocuments(),
    Post.countDocuments(),
    Comment.countDocuments({ status: "visible" }),
    Like.countDocuments(),
    Post.find({ status: "published" }).sort({ views: -1 }).limit(5).select("title slug views publishedAt")
  ]);

  const views = await Post.aggregate([{ $group: { _id: null, total: { $sum: "$views" } } }]);
  res.json({
    success: true,
    data: {
      users,
      posts,
      comments,
      likes,
      views: views[0]?.total || 0,
      popularArticles
    }
  });
});

export const listUsers = asyncHandler(async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).limit(200);
  res.json({ success: true, data: users });
});

export const listPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find()
    .populate("category", "name slug color")
    .populate("author", "name email")
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ success: true, data: posts });
});

export const listComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find()
    .populate("author", "name email avatar")
    .populate("post", "title slug")
    .sort({ createdAt: -1 })
    .limit(200);
  res.json({ success: true, data: comments });
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  res.json({ success: true, data: user });
});

