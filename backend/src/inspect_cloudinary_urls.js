import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const PostSchema = new mongoose.Schema({
  content: String,
  coverImage: {
    url: String
  }
}, { strict: false });

const Post = mongoose.model('Post', PostSchema);

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  const posts = await Post.find();
  console.log(`Scanning ${posts.length} posts...`);
  
  for (const post of posts) {
    if (post.coverImage?.url && post.coverImage.url.includes('cloudinary')) {
      console.log('Found Cloudinary cover image in post:', post._id, post.coverImage.url);
    }
    if (post.content && post.content.includes('cloudinary')) {
      console.log('Found Cloudinary content image in post:', post._id);
      // find the URL using regex
      const matches = post.content.match(/https?:\/\/[^\s\)]+cloudinary\.com[^\s\)]+/g);
      if (matches) {
        console.log('URLs:', matches);
      }
    }
  }
  await mongoose.disconnect();
}

run().catch(console.error);
