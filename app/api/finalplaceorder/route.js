import Orders from "@/models/Orders";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { orderid } = await req.json();
        const id = new mongoose.Types.ObjectId(orderid);
        const order = await Orders.findById(id);
        order.successfull = "placed"
        await order.save();
        return NextResponse.json({ message: "Order placed successfully", success: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}
