import Product from "@/models/Product";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";



export async function POST(request) {
    await dbConnect();
    const { id } = await request.json();
    try {
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            return NextResponse.forbidden({ message: "Product not found",success:false },{status:404});
        }
        return NextResponse.json({ message: "Product deleted",success:true },{status:200});
    } catch (error) {
        return NextResponse.json({ message: error.message,success:false },{status:500});
    }
}