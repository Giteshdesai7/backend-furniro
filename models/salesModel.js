import mongoose from "mongoose";

const salesSchema = new mongoose.Schema({
    date: { type: Date, default: Date.now(), required: true },
    dailySales: { type: Number, default: 0 },
    monthlySales: { type: Number, default: 0 },
    yearlySales: { type: Number, default: 0 },
    lastReset: { 
        daily: { type: Date, default: Date.now() },
        monthly: { type: Date, default: Date.now() }
    }
});

// Create or use existing model
const salesModel = mongoose.models.sales || mongoose.model("sales", salesSchema);
export default salesModel; 