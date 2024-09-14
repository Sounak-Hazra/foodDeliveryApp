import Orders from "@/models/Orders";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(req) {
    try {
        const { orderid } = await req.json();
        const id = new mongoose.Types.ObjectId(orderid);
        const order = await Orders.findById(id);
        if (!order) {
            return NextResponse.json({ message: "No such order found",seccess:false },{status:404});
        }
        order.successfull = "accapted"
        const saveorder = await order.save();
        if(!saveorder){
            return NextResponse.json({ message: "Something went wrong", seccess: false }, { status: 500 });
        }
        return NextResponse.json({ order, seccess: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", seccess: false }, { status: 500 });
    }
}