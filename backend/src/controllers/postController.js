import { Post } from "../models/Post.js";
import { createPost, deletePost, listPosts, toggleBookmark, togglePostLike, updatePost } from "../services/postService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getPosts = asyncHandler(async (req, res) => {
  const result = await listPosts(req.query);
  res.json({ success: true, ...result });
});

export const getFeaturedPosts = asyncHandler(async (req, res) => {
  const result = await listPosts({ ...req.query, featured: "true", limit: req.query.limit || 8 });
  res.json({ success: true, ...result });
});

export const getTrendingPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ status: "published" })
    .populate("category", "name slug color")
    .populate("author", "name title avatar")
    .sort({ views: -1, publishedAt: -1 })
    .limit(Number(req.query.limit) || 8);
  res.json({ success: true, data: posts });
});

export const getPostBySlug = asyncHandler(async (req, res) => {
  const post = await Post.findOne({ slug: req.params.slug })
    .populate("category", "name slug color")
    .populate("author", "name title avatar bio socialLinks");
  if (!post) throw new AppError("Post not found", 404, "POST_NOT_FOUND");
  res.json({ success: true, data: post });
});

export const createPostController = asyncHandler(async (req, res) => {
  const post = await createPost(req.body, req.user);
  res.status(201).json({ success: true, data: post });
});

export const updatePostController = asyncHandler(async (req, res) => {
  const post = await updatePost(req.params.id, req.body, req.user);
  res.json({ success: true, data: post });
});

export const deletePostController = asyncHandler(async (req, res) => {
  await deletePost(req.params.id, req.user);
  res.json({ success: true });
});

export const recordView = asyncHandler(async (req, res) => {
  await Post.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });
  res.json({ success: true });
});

export const likePost = asyncHandler(async (req, res) => {
  const result = await togglePostLike(req.params.id, req.user.id);
  res.json({ success: true, ...result });
});

export const bookmarkPost = asyncHandler(async (req, res) => {
  const result = await toggleBookmark(req.params.id, req.user.id);
  res.json({ success: true, ...result });
});
