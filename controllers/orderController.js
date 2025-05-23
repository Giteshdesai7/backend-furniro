import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import foodModel from "../models/foodModel.js";
import Stripe from "stripe";
import { updateSales } from "./salesController.js";



const stripe= new Stripe(process.env.STRIPE_SECRET_KEY)



///placing user order for frontend
const placeOrder=  async(req, res)=>{


    const frontend_url= "http://localhost:5173";
     
    try {
        // Check if there's sufficient stock for all items
        for (const item of req.body.items) {
            const food = await foodModel.findById(item._id);
            if (!food || food.stock < item.quantity) {
                return res.json({
                    success: false, 
                    message: `Insufficient stock for ${food ? food.name : 'an item'}`
                });
            }
        }

        const newOrder = new orderModel({
            userId:req.body.userId,
            items:req.body.items,
            amount:req.body.amount,
            address:req.body.address
        })

        await newOrder.save();
        
        // Decrease stock for each item ordered
        for (const item of req.body.items) {
            await foodModel.findByIdAndUpdate(item._id, {
                $inc: { stock: -item.quantity }
            });
        }

        await userModel.findByIdAndUpdate(req.body.userId, {
            cartData:{}
        });

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*1
            },
            quantity:item.quantity
        }))


        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount:1*100*45
            },
            quantity:1
        })


        const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:"payment",
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
        })


        res.json({success:true, session_url:session.url})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }

}

const verifyOrder= async(req, res)=>{
   const {orderId, success}= req.body;
   try {
    if (success==="true") {
        const order = await orderModel.findByIdAndUpdate(orderId, {payment:"true"});
        
        // Update sales data when payment is successful
        if (order && order.amount) {
            await updateSales(order.amount);
        }
        
        res.json({success:true, message:"Payment Successful"})
    }
    else{
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false, message:"Payment Failed"})
    }
   } catch (error) {
    console.log(error);
    res.json({success:false, message:"Error"})
   }
}

//user Orders for frontend
const userOrders= async(req, res)=>{
    try {
        const orders = await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

//listing orders for admin panel
const listOrders= async(req, res)=>{
    try {
        const orders = await orderModel.find({});
        res.json({success:true, data:orders})
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}
//order status update for admin panel

const updateStatus= async(req, res)=>{
    try{    
        await orderModel.findByIdAndUpdate(req.body.orderId, {status:req.body.status});
        res.json({success:true, message:"Status Updated"})
    }
    catch(error){
        console.log(error);
        res.json({success:false, message:"Error"})
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus};