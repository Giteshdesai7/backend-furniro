import foodModel from "../models/foodModel.js";
import fs from 'fs'


//add food item

const addFood = async (req, res)=>{


    let image_filename =`${req.file.filename}`;

    const food = new foodModel({
        name:req.body.name,
        description:req.body.description,
        price:req.body.price,
        image:image_filename,
        category:req.body.category,
        stock:req.body.stock || 0
    })

    try {
        await food.save();
        res.json({success:true, message:"Food Added"})
    } catch (error) {
        console.log(error)
        res.json({success:false, message:"Error"})
    }

}

//all food list
const listFood= async (req, res)=> {
    try {
        const foods= await foodModel.find({});
        res.json({success:true, data:foods})
        
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})

        
    }

}

//remove food item
const removeFood = async (req, res)=>{
    try {
        const food=await foodModel.findById(req.body.id);
        fs.unlink(`uploads/${food.image}`, ()=> {})

        await foodModel.findByIdAndDelete(req.body.id);
        res.json({success:true, message:"Food Removed"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//update stock
const updateStock = async (req, res)=>{
    try {
        await foodModel.findByIdAndUpdate(req.body.id, {stock: req.body.stock});
        res.json({success:true, message:"Stock Updated"})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//decrease stock when ordered
const decreaseStock = async (req, res)=>{
    try {
        const food = await foodModel.findById(req.body.id);
        if(food.stock >= req.body.quantity) {
            food.stock -= req.body.quantity;
            await food.save();
            res.json({success:true, message:"Stock Updated"})
        } else {
            res.json({success:false, message:"Insufficient Stock"})
        }
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {addFood, listFood, removeFood, updateStock, decreaseStock}