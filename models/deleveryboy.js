import mongoose from "mongoose";
import { orderSchema } from "./Orders";


const deleveryboySchema = new mongoose.Schema({
    username: {
        type: String,
        unique:true,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    orders:[orderSchema],
});

export default mongoose.models.deleveryboy || mongoose.model('deleveryboy', deleveryboySchema);