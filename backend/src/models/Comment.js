import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    parent: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null, index: true },
    content: { type: String, required: true, maxlength: 1200 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["visible", "hidden"], default: "visible", index: true }
  },
  { timestamps: true }
);

commentSchema.index({ post: 1, createdAt: -1 });

export const Comment = mongoose.model("Comment", commentSchema);
