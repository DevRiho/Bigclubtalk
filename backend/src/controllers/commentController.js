import { Comment } from "../models/Comment.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const getComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find({ post: req.params.postId, status: "visible" })
    .populate("author", "name avatar")
    .sort({ createdAt: 1 });
  res.json({ success: true, data: comments });
});

export const addComment = asyncHandler(async (req, res) => {
  const comment = await Comment.create({
    post: req.params.postId,
    author: req.user._id,
    parent: req.body.parent || null,
    content: req.body.content
  });
  await comment.populate("author", "name avatar");
  res.status(201).json({ success: true, data: comment });
});

export const updateComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError("Comment not found", 404, "COMMENT_NOT_FOUND");
  if (comment.author.toString() !== req.user.id && req.user.role !== "admin") throw new AppError("Cannot edit this comment", 403, "FORBIDDEN");
  
  if (req.body.content !== undefined) comment.content = req.body.content;
  if (req.body.status !== undefined) {
    if (req.user.role !== "admin") {
      throw new AppError("Only administrators can moderate comment status", 403, "FORBIDDEN");
    }
    comment.status = req.body.status;
  }
  
  await comment.save();
  res.json({ success: true, data: comment });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError("Comment not found", 404, "COMMENT_NOT_FOUND");
  if (comment.author.toString() !== req.user.id && req.user.role !== "admin") throw new AppError("Cannot delete this comment", 403, "FORBIDDEN");
  comment.status = "hidden";
  await comment.save();
  res.json({ success: true });
});

export const likeComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw new AppError("Comment not found", 404, "COMMENT_NOT_FOUND");
  const index = comment.likedBy.findIndex((id) => id.toString() === req.user.id);
  if (index > -1) comment.likedBy.splice(index, 1);
  else comment.likedBy.push(req.user._id);
  await comment.save();
  res.json({ success: true, liked: index === -1 });
});
