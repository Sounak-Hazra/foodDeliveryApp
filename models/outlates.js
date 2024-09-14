import mongoose from 'mongoose';
import { orderSchema } from './Orders';
import { productSchema } from './Product';

const outlateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    email: {
        type: String,
        required: true,
        unique:true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    orders: {
        type:[orderSchema]
    },
    products: {
        type: [productSchema]
    },
    pincodes: {
        type: [String],
        required: true
    }
});

export default mongoose.models.outlate || mongoose.model('outlate', outlateSchema);