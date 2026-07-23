import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const candidates = [
  "riho",
  "devriho",
  "rihofficial",
  "rihofficial2",
  "timothy",
  "abejoye"
];

async function test() {
  for (const name of candidates) {
    console.log(`Testing cloud_name: "${name}"...`);
    cloudinary.config({
      cloud_name: name,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
    try {
      const result = await cloudinary.api.ping();
      console.log(`SUCCESS for "${name}":`, result);
      return;
    } catch (error) {
      console.log(`FAILED for "${name}":`, error.error?.message || error.message);
    }
  }
}

test();
