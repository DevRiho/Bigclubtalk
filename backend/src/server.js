import { app } from "./app.js";
import { connectDatabase } from "./config/db.js";
import { assertEnv, env } from "./config/env.js";
import { cloudinary } from "./config/cloudinary.js";

async function checkCloudinary() {
  const isConfigured = env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret;
  if (!isConfigured) {
    console.warn("\x1b[33m%s\x1b[0m", "[WARNING] Cloudinary is NOT configured. Image uploads will fall back to local storage, which will fail in production on ephemeral filesystems like Render.");
    return;
  }
  try {
    await cloudinary.api.ping();
    console.log("\x1b[32m%s\x1b[0m", "[SUCCESS] Cloudinary is configured and connected successfully.");
  } catch (err) {
    console.warn("\x1b[31m%s\x1b[0m", `[ERROR] Cloudinary connection failed: ${err.message || JSON.stringify(err)}. Local storage fallback is active, but files will be lost on restarts/redeploys.`);
  }
}

async function start() {
  assertEnv();
  await connectDatabase();
  await checkCloudinary();
  app.listen(env.port, () => {
    console.log(`Big Club Talk API running on port ${env.port}`);
  });
}

start().catch((error) => {
  console.error(error);
  process.exit(1);
});
