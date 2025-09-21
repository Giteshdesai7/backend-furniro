import likeModel from "../models/likeModel.js";
import jwt from "jsonwebtoken";

const toggleLike = async (req, res) => {
    try {
        const { itemId } = req.body;
        const token = req.headers.token;
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }
        
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const userId = data.id;
        
        // Check if the item is already liked
        const existingLike = await likeModel.findOne({ userId, itemId });
        
        if (existingLike) {
            // Remove the like
            await likeModel.findByIdAndDelete(existingLike._id);
            res.json({ success: true, message: "Item removed from likes", action: "removed" });
        } else {
            // Add the like
            const newLike = new likeModel({ userId, itemId });
            await newLike.save();
            res.json({ success: true, message: "Item added to likes", action: "added" });
        }
    } catch (error) {
        console.log("Error toggling like:", error);
        res.status(500).json({ success: false, message: "Error toggling like" });
    }
};

const getLikedItems = async (req, res) => {
    try {
        const token = req.headers.token;
        
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }
        
        const data = jwt.verify(token, process.env.JWT_SECRET);
        const userId = data.id;
        
        const likedItems = await likeModel.find({ userId });
        
        // Convert to object format for frontend
        const likedData = {};
        likedItems.forEach(like => {
            likedData[like.itemId] = true;
        });
        
        res.json({ success: true, likedData });
    } catch (error) {
        console.log("Error getting liked items:", error);
        res.status(500).json({ success: false, message: "Error getting liked items" });
    }
};

export { toggleLike, getLikedItems };
