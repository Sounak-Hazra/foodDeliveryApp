import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(request) {
    const req = await request.json()
    const { _id, order, deliverytime } = req;
    try {
        await dbConnect();
        const id = new mongoose.Types.ObjectId(_id);
        const ord = await Orders.findById({ _id: id });
        if (!ord) {
            return NextResponse.json({ message: 'Order not found', success: false }, { status: 400 })
        }
        ord.price = order.price;
        ord.product = order.product;
        ord.deliveryTime = deliverytime
        const savedOrder = await ord.save();
        if (!savedOrder) {
            return NextResponse.json({ message: 'Order not created', success: false }, { status: 400 })
        }
        return NextResponse.json({ message: 'Order created', data: order._id, success: true }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Order not created', success: false }, { status: 400 })
    }
}