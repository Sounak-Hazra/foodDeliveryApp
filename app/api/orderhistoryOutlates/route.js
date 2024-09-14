import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import outlates from "@/models/outlates";


// successfull: orderstate, cancled: iscancled 

export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { date, deleveredby } = req;
        const outlateData = await outlates.findOne({deleveredby}).name;
        const orders = await Orders.find({date,deleveredby});

        if (!orders) {
            return NextResponse.json({ message: 'No orders found',orders:[], success: false }, { status: 404 });
        }

        return NextResponse.json({ orders, success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving orders',orders:[], success: false }, { status: 500 });
    }
}