import Product from "@/models/Product";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { id } = req;
        const mongoid = new mongoose.Types.ObjectId(id);
        const product = await Product.findById({ _id: mongoid })
        if (!product) {
            return NextResponse.json({ message: 'Product not found',success:false }, {status:404});
        }
        return NextResponse.json({ product, success: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving product', success: false }, { status: 500 });
    }
}