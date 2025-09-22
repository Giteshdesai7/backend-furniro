import mongoose from "mongoose"


export const connectDB = async () => {
    const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;
    if (!uri) {
        console.error("Missing MONGODB_URI env var");
        throw new Error("MONGODB_URI not set");
    }
    await mongoose.connect(uri).then(()=> console.log("DB Connected"));
};
