import salesModel from "../models/salesModel.js";
import orderModel from "../models/orderModel.js";

// Initialize or get sales document
const initializeSales = async () => {
    let salesDoc = await salesModel.findOne({});
    if (!salesDoc) {
        salesDoc = new salesModel();
        await salesDoc.save();
    }
    return salesDoc;
};

// Check and reset daily sales if needed
const checkDailyReset = async (salesDoc) => {
    const now = new Date();
    const lastReset = new Date(salesDoc.lastReset.daily);
    
    // Reset if it's a new day (different day than last reset)
    if (now.getDate() !== lastReset.getDate() || 
        now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
        
        salesDoc.dailySales = 0;
        salesDoc.lastReset.daily = now;
        await salesDoc.save();
    }
};

// Check and reset monthly sales if needed
const checkMonthlyReset = async (salesDoc) => {
    const now = new Date();
    const lastReset = new Date(salesDoc.lastReset.monthly);
    
    // Reset if it's a new month
    if (now.getMonth() !== lastReset.getMonth() || 
        now.getFullYear() !== lastReset.getFullYear()) {
        
        salesDoc.monthlySales = 0;
        salesDoc.lastReset.monthly = now;
        await salesDoc.save();
    }
};

// Update sales when an order is placed
const updateSales = async (amount) => {
    try {
        const salesDoc = await initializeSales();
        
        // Check if resets are needed
        await checkDailyReset(salesDoc);
        await checkMonthlyReset(salesDoc);
        
        // Update sales figures
        salesDoc.dailySales += amount;
        salesDoc.monthlySales += amount;
        salesDoc.yearlySales += amount;
        
        await salesDoc.save();
        return true;
    } catch (error) {
        console.error("Error updating sales:", error);
        return false;
    }
};

// Get sales statistics
const getSalesStats = async (req, res) => {
    try {
        const salesDoc = await initializeSales();
        
        // Check if resets are needed before returning data
        await checkDailyReset(salesDoc);
        await checkMonthlyReset(salesDoc);
        
        res.json({
            success: true,
            data: {
                dailySales: salesDoc.dailySales,
                monthlySales: salesDoc.monthlySales,
                yearlySales: salesDoc.yearlySales
            }
        });
    } catch (error) {
        console.error("Error fetching sales stats:", error);
        res.json({ success: false, message: "Error fetching sales statistics" });
    }
};

export { updateSales, getSalesStats }; 