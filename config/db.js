import mongoose from "mongoose"


export const connectDB= async()=>  {
    await mongoose.connect('mongodb+srv://giteshdesai7:HooUm8FSMXTEDhAj@cluster8.vgrorsb.mongodb.net/furniro').then(()=> console.log("DB Connected"));
};