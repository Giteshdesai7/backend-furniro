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
import reviewRouter from "./routes/reviewRoute.js"

//app config
const app=express();
const port=process.env.PORT || 4000;

//middleware

app.use(express.json());
app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') || '*'}));

//db connection
connectDB();

//api endpoints
app.use("/api/product", productRouter)
app.use("/images", express.static('uploads'))
app.use("/api/user", userRouter)
app.use("/api/cart", cartRouter)
app.use("/api/order", orderRouter)
app.use("/api/sales", salesRouter)
app.use("/api/newsletter", newsletterRouter)
app.use("/api/contact", contactRouter)
app.use("/api/blog", blogRouter)
app.use("/api/likes", likeRouter)
app.use("/api/reviews", reviewRouter)

app.get("/", (req, res)=> {
    res.send("API Working")
})

app.listen(port, ()=> {
    console.log(`Server Started on http://localhost:${port}`)
})

//mongodb+srv://giteshdesai7:9610996364Gd@cluster0.dqwmi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0