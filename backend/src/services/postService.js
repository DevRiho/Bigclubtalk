import slugify from "slugify";
import { Post } from "../models/Post.js";
import { Category } from "../models/Category.js";
import { Like } from "../models/Like.js";
import { Bookmark } from "../models/Bookmark.js";
import { AppError } from "../utils/AppError.js";
import { getPagination, paginatedResponse } from "../utils/pagination.js";
import { POST_STATUS } from "../constants/roles.js";

function readingTime(content) {
  const words = String(content || "").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(Math.ceil(words / 220), 1);
}

export async function listPosts(query) {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.status) {
    if (query.status !== "all") filter.status = query.status;
  } else {
    filter.status = POST_STATUS.PUBLISHED;
  }
  if (query.category) filter.category = query.category;
  if (query.author) filter.author = query.author;
  if (query.tag) filter.tags = String(query.tag).toLowerCase();
  if (query.featured) filter.featured = query.featured === "true";
  if (query.q) filter.$text = { $search: query.q };

  const [data, total] = await Promise.all([
    Post.find(filter)
      .populate("category", "name slug color")
      .populate("author", "name title avatar")
      .sort(query.q ? { score: { $meta: "textScore" } } : { publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit),
    Post.countDocuments(filter)
  ]);

  return paginatedResponse({ data, total, page, limit });
}

export async function createPost(payload, author) {
  const category = await Category.findById(payload.category);
  if (!category) throw new AppError("Category not found", 404, "CATEGORY_NOT_FOUND");

  const slug = payload.slug || slugify(payload.title, { lower: true, strict: true });
  const post = await Post.create({
    ...payload,
    slug,
    tags: payload.tags || [],
    author: author._id,
    readingTime: readingTime(payload.content),
    publishedAt: payload.status === POST_STATUS.PUBLISHED ? new Date() : undefined
  });

  return post.populate([
    { path: "category", select: "name slug color" },
    { path: "author", select: "name title avatar" }
  ]);
}

export async function updatePost(id, payload, user) {
  const post = await Post.findById(id);
  if (!post) throw new AppError("Post not found", 404, "POST_NOT_FOUND");

  const ownsPost = post.author.toString() === user.id;
  if (!ownsPost && user.role !== "admin") throw new AppError("Cannot edit this post", 403, "FORBIDDEN");

  Object.assign(post, payload);
  if (payload.title && !payload.slug) post.slug = slugify(payload.title, { lower: true, strict: true });
  if (payload.content) post.readingTime = readingTime(payload.content);
  if (payload.status === POST_STATUS.PUBLISHED && !post.publishedAt) post.publishedAt = new Date();

  await post.save();
  return post.populate([
    { path: "category", select: "name slug color" },
    { path: "author", select: "name title avatar" }
  ]);
}

export async function deletePost(id, user) {
  const post = await Post.findById(id);
  if (!post) throw new AppError("Post not found", 404, "POST_NOT_FOUND");
  if (post.author.toString() !== user.id && user.role !== "admin") throw new AppError("Cannot delete this post", 403, "FORBIDDEN");
  await post.deleteOne();
}

export async function togglePostLike(postId, userId) {
  const existing = await Like.findOne({ post: postId, user: userId });
  if (existing) {
    await existing.deleteOne();
    return { liked: false };
  }
  await Like.create({ post: postId, user: userId });
  return { liked: true };
}

export async function toggleBookmark(postId, userId) {
  const existing = await Bookmark.findOne({ post: postId, user: userId });
  if (existing) {
    await existing.deleteOne();
    return { bookmarked: false };
  }
  await Bookmark.create({ post: postId, user: userId });
  return { bookmarked: true };
}
