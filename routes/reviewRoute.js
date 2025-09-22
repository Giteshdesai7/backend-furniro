import express from "express";
import { createReview, listReviews } from "../controllers/reviewController.js";
import authMiddleware from "../middleware/auth.js";

const reviewRouter = express.Router();

// Public: list reviews
reviewRouter.get("/:productId", listReviews);

// Create/update review (authenticated)
reviewRouter.post("/", authMiddleware, createReview);

export default reviewRouter;


