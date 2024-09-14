import Product from "@/models/Product";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";


export async function POST(request) {
    const req = await request.json()
    const { productname,category, description, price,image, deleveredby,avilablepincodes,bestsellar } = req;
    try {
        await dbConnect();
        const product = await Product.create({
            name : productname,
            description,
            category,
            price,
            deleveredby,
            image,
            avilablepincodes,
            bestsellar
        });
        if (!product) {
            return NextResponse.json({ message: 'Product not created',success:false }, {status:400})
        }
        return NextResponse.json({ message: 'Product created',success:true }, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Product not created',success:false }, {status:400})
    }
}