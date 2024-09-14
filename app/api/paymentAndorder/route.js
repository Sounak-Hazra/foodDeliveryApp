import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    const req = await request.json()
    const { _id,
        address,
        alternatePhone,
        city,
        landmark,
        message,
        mobile,
        name, } = req;
    try {
        await dbConnect();
        const mongoid = new mongoose.Types.ObjectId(_id);
        const order = await Orders.findById({ _id: mongoid });
        if (!order) {
            return NextResponse.json({ message: 'Order not found',success:false }, {status:400})
        }
        order.address = address;
        order.alternatePhone = alternatePhone;
        order.city = city;
        order.landmark = landmark;
        order.message = message;
        order.mobile = mobile;
        order.name = name;

        console.log(order)

        const savedOrder = await order.save();
        if (!savedOrder) {
            return NextResponse.json({ message: 'Order not created',success:false }, {status:400})
        }
        return NextResponse.json({ message: 'Order created',data:order._id,success:true }, {status:200})
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Order not created',success:false }, {status:400})
    }
}