import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, index: true },
    description: { type: String, maxlength: 300 },
    color: { type: String, default: "#E10600" },
    isFeatured: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export const Category = mongoose.model("Category", categorySchema);
