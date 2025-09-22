import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    productId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: "" },
  },
  { timestamps: true }
);

// Prevent multiple reviews per product by same user
reviewSchema.index({ productId: 1, userId: 1 }, { unique: true });

const reviewModel = mongoose.models.review || mongoose.model("review", reviewSchema);
export default reviewModel;


