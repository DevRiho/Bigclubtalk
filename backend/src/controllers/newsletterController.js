import { NewsletterSubscriber } from "../models/NewsletterSubscriber.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const subscribe = asyncHandler(async (req, res) => {
  const subscriber = await NewsletterSubscriber.findOneAndUpdate(
    { email: req.body.email },
    { email: req.body.email, status: "subscribed", source: req.body.source || "website", unsubscribedAt: null },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
  res.status(201).json({ success: true, data: subscriber });
});

export const unsubscribe = asyncHandler(async (req, res) => {
  await NewsletterSubscriber.findOneAndUpdate({ email: req.body.email }, { status: "unsubscribed", unsubscribedAt: new Date() });
  res.json({ success: true });
});

export const listSubscribers = asyncHandler(async (req, res) => {
  const subscribers = await NewsletterSubscriber.find().sort({ createdAt: -1 }).limit(500);
  res.json({ success: true, data: subscribers });
});
