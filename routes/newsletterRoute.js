import express from "express";
import { subscribeNewsletter, getNewsletterSubscribers, unsubscribeNewsletter } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();

// Public routes
newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.post("/unsubscribe", unsubscribeNewsletter);

// Admin routes (protected)
newsletterRouter.get("/subscribers", getNewsletterSubscribers);

export default newsletterRouter;
