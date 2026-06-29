import { connectDatabase } from "./config/db.js";
import { assertEnv } from "./config/env.js";
import { Post } from "./models/Post.js";
import { Category } from "./models/Category.js";
import { User } from "./models/User.js";
import mongoose from "mongoose";

async function check() {
  try {
    assertEnv();
    await connectDatabase();

    const posts = await Post.find().populate("category", "name").populate("author", "name");
    console.log("=== POSTS IN DATABASE ===");
    console.log(JSON.stringify(posts, null, 2));
    console.log("=========================");
  } catch (error) {
    console.error("Check failed:", error);
  } finally {
    await mongoose.disconnect();
  }
}

check();
