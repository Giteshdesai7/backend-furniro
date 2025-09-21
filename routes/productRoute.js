import express from "express";
import { addProduct, listProduct, removeProduct, updateStock, decreaseStock, updateProduct } from "../controllers/productController.js";
import multer from "multer";

const productRouter= express.Router();

//image storage Engine

const storage = multer.diskStorage({
    destination:"uploads",
    filename:(req,file, cb)=> {
        return cb(null, `${Date.now()}${file.originalname}`)
    }
})

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        console.log("Multer file filter - Field name:", file.fieldname, "Original name:", file.originalname);
        cb(null, true);
    }
})

productRouter.post("/add", upload.fields([
    {name: 'image', maxCount: 1}, 
    {name: 'additionalImages', maxCount: 3},
    {name: 'descriptionImage1', maxCount: 1},
    {name: 'descriptionImage2', maxCount: 1}
]), addProduct)
productRouter.post("/test", (req, res) => {
    console.log("Test endpoint hit");
    res.json({success: true, message: "Test successful"});
})
productRouter.get("/list", listProduct)
productRouter.post("/remove", removeProduct);
productRouter.post("/update-stock", updateStock);
productRouter.post("/decrease-stock", decreaseStock);
productRouter.post("/update", updateProduct);





export default productRouter;