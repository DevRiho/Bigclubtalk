import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    follower: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true }
  },
  { timestamps: true }
);

followerSchema.index({ follower: 1, author: 1 }, { unique: true });

export const Follower = mongoose.model("Follower", followerSchema);
