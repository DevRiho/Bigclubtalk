import dotenv from "dotenv";

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  mongoUri: process.env.MONGODB_URI,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || "15m",
  jwtRefreshExpires: process.env.JWT_REFRESH_EXPIRES || "30d",
  cookieDomain: process.env.COOKIE_DOMAIN,
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  },
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
    from: process.env.MAIL_FROM || "Big Club Talk <newsroom@bigclubtalk.com>"
  },
  resendApiKey: process.env.RESEND_API_KEY,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
};

export function assertEnv() {
  const required = ["mongoUri", "jwtAccessSecret", "jwtRefreshSecret"];
  const missing = required.filter((key) => !env[key]);

  if (missing.length) {
    throw new Error(`Missing required environment values: ${missing.join(", ")}`);
  }
}
