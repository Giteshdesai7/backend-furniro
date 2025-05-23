import express from "express";
import { getSalesStats } from "../controllers/salesController.js";

const salesRouter = express.Router();

salesRouter.get("/stats", getSalesStats);

export default salesRouter; 