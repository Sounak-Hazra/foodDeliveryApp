import mongoose from 'mongoose';
import { string } from 'zod';



export const orderSchema = new mongoose.Schema({
    product: {
        type: [],
        ref: 'Product',
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    deleveredby: {
        type: String,
        required: true
    },
    address: {
        type: String,
    },
    alternetPhone: {
        type: String,
    },
    city: {
        type: String,
    },
    landmark: {
        type: String,
    },
    message: {
        type: String,
    },
    mobile: {
        type: String,
    },
    name: {
        type: String,
    },
    pincode: {
        type: String,
    },
    deliveryTime: {
        type: String,
    },
    successfull: {
        type: String,
        default: "created"
    },
    cancled: {
        type: Boolean,
        default: false
    },
    paymentType: {
        type: String,
        required: true,
        default: "cod"
    },
    date: {
        type: String,
        default: () => new Date().toISOString().split('T')[0]
    },
    deleveryboy: {
        type: String,
    }
});

export default mongoose.models.order || mongoose.model('order', orderSchema);