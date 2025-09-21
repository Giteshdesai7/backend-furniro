import express from "express"
import cors from "cors"
import { connectDB } from "./config/db.js"
import productRouter from "./routes/productRoute.js"
import userRouter from "./routes/userRoute.js"
import "dotenv/config.js"
import cartRouter from "./routes/cartRoute.js"
import orderRouter from "./routes/orderRoute.js"
import salesRouter from "./routes/salesRoute.js"
import newsletterRouter from "./routes/newsletterRoute.js"
import contactRouter from "./routes/contactRoute.js"
import blogRouter from "./routes/blogRoute.js"
import likeRouter from "./routes/likeRoute.js"

// Global error handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
    process.exit(1);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('SIGINT received. Shutting down gracefully...');
    process.exit(0);
});

//app config
const app = express();
const port = process.env.PORT || 4000;

//middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors({
    origin: process.env.NODE_ENV === 'production' ? 
        ['https://your-frontend-domain.com'] : 
        [
            'http://localhost:5173', 
            'http://localhost:5174',
            'http://localhost:5175',
            'http://localhost:5176',
            'http://localhost:5177',
            'http://localhost:5178',
            'http://localhost:5179',
            'http://localhost:5180'
        ],
    credentials: true
}));

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

//db connection with retry logic
connectDB().catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
});

//api endpoints with error handling
app.use("/api/product", productRouter);
app.use("/images", express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/sales", salesRouter);
app.use("/api/newsletter", newsletterRouter);
app.use("/api/contact", contactRouter);
app.use("/api/blog", blogRouter);
app.use("/api/likes", likeRouter);

app.get("/", (req, res) => {
    res.json({ 
        message: "Furniro API Working", 
        status: "success",
        timestamp: new Date().toISOString()
    });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global error handler:', err);
    res.status(500).json({
        error: 'Internal Server Error',
        message: process.env.NODE_ENV === 'production' ? 'Something went wrong' : err.message
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`
    });
});

const server = app.listen(port, () => {
    console.log(`🚀 Server Started on port ${port}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`📅 Started at: ${new Date().toISOString()}`);
});

// Server timeout configuration
server.timeout = 30000; // 30 seconds
server.keepAliveTimeout = 65000; // 65 seconds
server.headersTimeout = 66000; // 66 seconds