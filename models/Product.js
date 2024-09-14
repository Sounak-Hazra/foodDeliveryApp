import e from 'express';
import mongoose from 'mongoose';

export const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    deleveredby: {
        type: String,
        required: true,
        default: 'admin'
    },
    image: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        default:"all"
    },
    avilablepincodes: {
        type: [String],
        required: true
    }
    ,
    bestsellar: {
        type: Boolean,
        default: false
    },
});

export default mongoose.models.product || mongoose.model('product', productSchema);