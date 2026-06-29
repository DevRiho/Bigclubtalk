import mongoose from "mongoose";
import { POST_STATUS } from "../constants/roles.js";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    content: { type: String, required: true },
    excerpt: { type: String, required: true, maxlength: 300 },
    coverImage: { url: String, publicId: String, alt: String },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true, index: true },
    tags: [{ type: String, lowercase: true, trim: true, index: true }],
    readingTime: { type: Number, default: 1 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    status: { type: String, enum: Object.values(POST_STATUS), default: POST_STATUS.DRAFT, index: true },
    featured: { type: Boolean, default: false, index: true },
    breaking: { type: Boolean, default: false, index: true },
    views: { type: Number, default: 0, index: true },
    publishedAt: { type: Date, index: true },
    seoTitle: String,
    seoDescription: String
  },
  { timestamps: true }
);

postSchema.index({ title: "text", excerpt: "text", content: "text", tags: "text" });
postSchema.index({ status: 1, publishedAt: -1 });
postSchema.index({ category: 1, status: 1, publishedAt: -1 });
postSchema.index({ author: 1, status: 1, publishedAt: -1 });

export const Post = mongoose.model("Post", postSchema);
