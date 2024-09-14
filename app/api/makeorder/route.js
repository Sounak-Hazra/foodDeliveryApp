import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";


export async function POST(request) {
    const req = await request.json()
    const { product, price } = req;
    try {
        await dbConnect();
        const order = await Orders.create({
            product,
            price,
            deleveredby: product[0].deleveredby,
        });
        if (!order) {
            return NextResponse.json({ message: 'Order not created',success:false }, {status:400})
        }
        return NextResponse.json({ message: 'Order created',data:order._id,success:true }, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Order not created',success:false }, {status:400})
    }
}