import deleveryboy from "@/models/deleveryboy";
import Orders from "@/models/Orders";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { username, orderid } = await req.json();
        console.log(orderid);
        console.log(username);
        const id = new mongoose.Types.ObjectId(orderid);
        const order = await Orders.findById(id);
        console.log(order);
        if (!order) {
            return NextResponse.json({ message: "Invalid order id", success: false }, { status: 400 });
        }
        order.successfull = "successfull" //would be change
        const saveorder = await order.save();
        if(!saveorder){
            return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
        }
        const boy = await deleveryboy.findOne({ phone: username });
        console.log(boy);
        if (!boy) {
            return NextResponse.json({ message: "Invalid username", success: false }, { status: 400 });
        }
        boy.orders.pull(order);
        const saveboy = await boy.save();
        if(!saveboy){
            return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
        }
        return NextResponse.json({ message: "Order done successfully", success: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", success: false }, { status: 500 });
    }
}