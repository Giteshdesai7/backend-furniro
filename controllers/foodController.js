import productModel from "../models/productModel.js";
import fs from 'fs'


//add product item

const addProduct = async (req, res)=>{


    let image_filename =`${req.file.filename}`;

    const product = new productModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category,
        stock:req.body.stock || 0
    })

    try {
        await product.save();
        res.json({success:true, message:"Product Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }

}

//all product list
const listProduct= async (req, res)=> {
    try {
        const products= await productModel.find({});
        res.json({success:true, data:products})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})

        
    }

}

//remove product item
const removeProduct = async (req, res)=>{
    try {
        const product=await productModel.findById(req.body.id);
        fs.unlink(`uploads/${product.image}`, ()=> {})

        await productModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Product Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//update stock
const updateStock = async (req, res)=>{
    try {
        await productModel.findByIdAndUpdate(req.body.id, {stock: req.body.stock});
        res.json({success:true, message:"Stock Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//decrease stock when ordered
const decreaseStock = async (req, res)=>{
    try {
        const product = await productModel.findById(req.body.id);
        if(product.stock >= req.body.quantity) {
            product.stock -= req.body.quantity;
            await product.save();
            res.json({success:true, message:"Stock Updated"})
        } else {
            res.json({success:false, message:"Insufficient Stock"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addProduct, listProduct, removeProduct, updateStock, decreaseStock}