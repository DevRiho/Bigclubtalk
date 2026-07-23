import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const PostSchema = new mongoose.Schema({
  title: String,
  content: String,
  coverImage: {
    url: String,
    alt: String
  }
}, { strict: false });

const Post = mongoose.model('Post', PostSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const posts = await Post.find().sort({ createdAt: -1 }).limit(5);
  for (const post of posts) {
    console.log('--- POST ---');
    console.log('ID:', post._id);
    console.log('Title:', post.title);
    console.log('Cover Image:', post.coverImage);
    console.log('Content (first 300 chars):');
    console.log(JSON.stringify(post.content?.substring(0, 300)));
  }
  await mongoose.disconnect();
}

run().catch(console.error);
