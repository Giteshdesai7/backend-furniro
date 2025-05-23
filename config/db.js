import mongoose from "mongoose"


export const connectDB= async()=>  {
    await mongoose.connect('mongodb+srv://giteshdesai7:7300211136%40%40Gd@cluster8.vgrorsb.mongodb.net/food-del').then(()=> console.log("DB Connected"));
};