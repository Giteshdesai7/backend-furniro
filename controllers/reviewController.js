import reviewModel from "../models/reviewModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

export const createReview = async (req, res) => {
  try {
    const userId = req.body.userId || req.headers.userid || req.userId; // fallback if auth middleware sets it
    const { productId, rating, comment } = req.body;

    if (!userId) return res.json({ success: false, message: "Unauthenticated" });
    if (!productId || !rating) return res.json({ success: false, message: "Missing fields" });

    // Verify the user purchased this product
    const purchased = await orderModel.exists({
      userId,
      "items._id": productId,
    });
    if (!purchased) {
      return res.json({ success: false, message: "Only purchasers can review" });
    }

    const doc = await reviewModel.findOneAndUpdate(
      { productId, userId },
      { $set: { rating, comment: comment || "" } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return res.json({ success: true, data: doc });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};

export const listReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const reviews = await reviewModel.find({ productId }).sort({ createdAt: -1 });

    // Attach user names
    const userIds = [...new Set(reviews.map(r => (r.userId || '').toString()).filter(Boolean))];
    const users = await userModel.find({ _id: { $in: userIds } }).select('name email');
    const idToName = {};
    users.forEach(u => {
      const key = String(u._id);
      if (u.name && u.name.trim()) idToName[key] = u.name.trim();
      else if (u.email) {
        const [local] = u.email.split('@');
        idToName[key] = local || 'User';
      }
    });

    // For any user without a profile name, fall back to latest order shipping name
    const missing = userIds.filter(id => !idToName[id]);
    if (missing.length) {
      const fallbackOrders = await orderModel.aggregate([
        { $match: { userId: { $in: missing } } },
        { $sort: { date: -1 } },
        { $group: { _id: "$userId", address: { $first: "$address" } } }
      ]);
      fallbackOrders.forEach(o => {
        const full = [o.address?.firstName, o.address?.lastName].filter(Boolean).join(' ').trim();
        if (full) idToName[String(o._id)] = full;
      });
    }

    const withNames = reviews.map(r => {
      const key = (r.userId || '').toString();
      return { ...r.toObject(), userName: idToName[key] || 'User' };
    });

    return res.json({ success: true, data: withNames, count: withNames.length });
  } catch (err) {
    return res.json({ success: false, message: err.message });
  }
};


