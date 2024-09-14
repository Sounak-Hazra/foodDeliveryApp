import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { deleveredby,date } = req;

        const order = await Orders.find({
            $and: [
                { product: { $elemMatch: { deliveredby: deleveredby } } },
                { date: searchDate }
            ]
        });

        if (!order ) {
            return NextResponse.json({ message: 'No orders found',success:false }, {status:404});
        }

        return NextResponse.json({order,success:true} , {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving orders',success:false }, {status:500});
    }
}