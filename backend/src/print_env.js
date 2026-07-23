import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), 'backend', '.env') });

const name = process.env.CLOUDINARY_CLOUD_NAME;
const key = process.env.CLOUDINARY_API_KEY;
const secret = process.env.CLOUDINARY_API_SECRET;

console.log("Name:", JSON.stringify(name), "Length:", name?.length);
console.log("Key:", JSON.stringify(key), "Length:", key?.length);
console.log("Secret:", JSON.stringify(secret), "Length:", secret?.length);
