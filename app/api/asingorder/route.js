import deleveryboy from "@/models/deleveryboy";
import Orders from "@/models/Orders";
import mongoose from "mongoose";
import { NextResponse } from "next/server";


export async function POST(req) {
    try {
        const { username, orderid } = await req.json();
        console.log(username);
        const id = new mongoose.Types.ObjectId(orderid);
        const boy = await deleveryboy.findOne({ username });
        if (!boy) {
            return NextResponse.json({ message: "No such boy found",seccess:false },{status:404});
        }
        const order = await Orders.findById(id);
        if (!order) {
            return NextResponse.json({ message: "No such order found",seccess:false },{status:404});
        }
        order.successfull = "assigned"
        boy.orders.push(order);
        order.deleveryboy = boy.username
        await boy.save();
        await order.save();
        return NextResponse.json({ message: "Delivery assigned successfully",seccess:true },{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong",seccess:false },{status:500});
    }
}