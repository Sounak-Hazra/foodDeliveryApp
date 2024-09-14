import mongoose from "mongoose";


const CategorysSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    createdat: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.models.categorys || mongoose.model('categorys', CategorysSchema);