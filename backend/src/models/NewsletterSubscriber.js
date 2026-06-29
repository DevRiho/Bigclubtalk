import mongoose from "mongoose";

const newsletterSubscriberSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    status: { type: String, enum: ["subscribed", "unsubscribed"], default: "subscribed", index: true },
    source: { type: String, default: "website" },
    unsubscribedAt: Date
  },
  { timestamps: true }
);

export const NewsletterSubscriber = mongoose.model("NewsletterSubscriber", newsletterSubscriberSchema);
