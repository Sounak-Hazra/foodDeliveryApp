import Product from "@/models/Product";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { id,productname,category,price,description,image,avilablepincodes,bestsellar} = req;
        const mongoid = new mongoose.Types.ObjectId(id);
        const product = await Product.findById({ _id: mongoid })
        product.name = productname
        product.description = description
        product.category = category
        product.price = price
        product.image = image
        product.avilablepincodes = avilablepincodes
        product.bestsellar = bestsellar
        const saveproduct = await product.save();
        if (!saveproduct) {
            return NextResponse.json({ message: 'Product not saved',success:false }, {status:404});
        }
        return NextResponse.json({ message:"Product saved", success: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving product', success: false }, { status: 500 });
    }
}