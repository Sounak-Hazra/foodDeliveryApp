import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import deleveryboy from "@/models/deleveryboy";

export async function POST(request) {
    const req = await request.json()
    const { _id } = req
    const { phone } = req
    try {
        await dbConnect();
        const id = new mongoose.Types.ObjectId(_id)
        const order = await Orders.findById(id)
        if (!order) {
            console.log("No order")
            return NextResponse.json({ message: 'Order not found', success: false }, { status: 400 })
        }
        order.successfull = "cancled";
        const saveOrder = await order.save();
        if (!saveOrder) {
            console.log("Order not seved")
            return NextResponse.json({ message: 'Order not cancle', success: false }, { status: 400 })
        }
        const boy = await deleveryboy.findOne({ phone })
        if (!boy) {
            return NextResponse.json({message:"Delivery boy not found",success : false,},{status:400})
        }
        for (let index = 0; index < boy.orders.length; index++) {
            const element = boy.orders[index];
            if (element._id == _id) {
                boy.orders.splice(index, 1)
                console.log(boy.orders)
                const savedBoy = await boy.save()
                if (!savedBoy) {
                    return NextResponse.json({message:"Order cancled but failed to delete it from delivery boy",success:false},{status:300})
                }
                break
            }
        }
        return NextResponse.json({ message: 'Cancled', success: true }, { status: 200 })
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Order not created', success: false }, { status: 400 })
    }
}

