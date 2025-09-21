import express from "express";
import { toggleLike, getLikedItems } from "../controllers/likeController.js";

const router = express.Router();

router.post("/toggle", toggleLike);
router.post("/get", getLikedItems);

export default router;
