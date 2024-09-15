import mongoose from "mongoose";

export const pincodeSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
    }
});

export default mongoose.models.pincode || mongoose.model("pincode", pincodeSchema);