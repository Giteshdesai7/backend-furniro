import mongoose from "mongoose";

const likeSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    itemId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const likeModel = mongoose.models.like || mongoose.model("like", likeSchema);
export default likeModel;
