import { Post } from "../models/Post.js";
import { Like } from "../models/Like.js";
import { Bookmark } from "../models/Bookmark.js";
import { createPost, deletePost, listPosts, toggleBookmark, togglePostLike, updatePost } from "../services/postService.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import { cloudinary } from "../config/cloudinary.js";
import { env } from "../config/env.js";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "bigclubtalk" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

const uploadToLocal = async (file, req) => {
  const uploadsDir = path.join(process.cwd(), "uploads");
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  const filename = `${crypto.randomBytes(16).toString("hex")}${path.extname(file.originalname)}`;
  const filepath = path.join(uploadsDir, filename);
  await fs.promises.writeFile(filepath, file.buffer);
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

export const uploadPostImageController = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw new AppError("No file uploaded", 400, "NO_FILE");
  }

  const isCloudinaryConfigured = env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret;

  if (isCloudinaryConfigured) {
    try {
      const result = await uploadToCloudinary(req.file.buffer);
      return res.json({ success: true, url: result.secure_url });
    } catch (err) {
      console.warn("Cloudinary upload failed, falling back to local storage:", err);
    }
  }

  const url = await uploadToLocal(req.file, req);
  res.json({ success: true, url });
});

export const getPosts = asyncHandler(async (req, res) => {
  const isRequestingSensitive = req.query.status && req.query.status !== "published";
  
  if (isRequestingSensitive) {
    const isAuthorized = req.user && (
      req.user.role === "admin" ||
      (req.user.role === "author" && String(req.query.author) === String(req.user._id))
    );
    if (!isAuthorized) {
      req.query.status = "published";
    }
  }

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

  const [likesCount, isLiked, isBookmarked] = await Promise.all([
    Like.countDocuments({ post: post._id }),
    req.user ? Like.exists({ user: req.user._id, post: post._id }) : false,
    req.user ? Bookmark.exists({ user: req.user._id, post: post._id }) : false
  ]);

  const postObj = post.toObject();
  postObj.likesCount = likesCount;
  postObj.isLiked = !!isLiked;
  postObj.isBookmarked = !!isBookmarked;

  res.json({ success: true, data: postObj });
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
