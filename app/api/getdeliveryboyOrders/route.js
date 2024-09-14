import deleveryboy from "@/models/deleveryboy";
import Orders from "@/models/Orders";
import mongoose from "mongoose";
import dbConnect from "@/dbConfig/connect";


export async function post(req) {
    try {
        await dbConnect();
        const { username} = req.body;
        const deleveryboy = await deleveryboy.findOne({ username });
        const arr = deleveryboy.orders;
        return NextResponse.json({ message: "Successfull",orders:arr, seccess: true }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: "Something went wrong", seccess: false }, { status: 500 });
    }
}