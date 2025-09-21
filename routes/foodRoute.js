import express from "express";
import { addProduct, listProduct, removeProduct, updateStock, decreaseStock } from "../controllers/productController.js";
import multer from "multer";

const productRouter= express.Router();

//image storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file, cb)=> {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({storage:storage})

productRouter.post("/add", upload.single("image"),  addProduct)
productRouter.get("/list", listProduct)
productRouter.post("/remove", removeProduct);
productRouter.post("/update-stock", updateStock);
productRouter.post("/decrease-stock", decreaseStock);





export default productRouter;