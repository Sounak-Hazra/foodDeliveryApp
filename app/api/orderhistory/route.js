import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { date, successfull } = req;
        const orders = await Orders.find({date,successfull});

        if (!orders) {
            return NextResponse.json({ message: 'No orders found',orders:[], success: false }, { status: 404 });
        }

        return NextResponse.json({ orders, success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving orders',orders:[], success: false }, { status: 500 });
    }
}