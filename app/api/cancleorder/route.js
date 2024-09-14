import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    const req = await request.json()
    const { id } = req;
    try {
        await dbConnect();
        const _id = new mongoose.Types.ObjectId(id);
        const order = await Orders.findById({ _id });
        if (!order) {
            return NextResponse.json({ message: 'Order not found',success:false }, {status:400})
        }
        order.successfull = "cancled";
        const saveOrder = await order.save();
        if (!saveOrder) {
            return NextResponse.json({ message: 'Order not cancle',success:false }, {status:400})
        }
        return NextResponse.json({ message: 'Cancled',success:true }, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Order not created',success:false }, {status:400})
    }
}