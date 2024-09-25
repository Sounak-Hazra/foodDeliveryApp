import pincodes from "@/models/pincodes";
import { NextResponse } from "next/server";
import dbConnect from "@/dbConfig/connect";


export async function POST(req) {
    await dbConnect();
    try {
        const { pincode } = await req.json();
        const avilable = await pincodes.find({ pincode: pincode });
        if (avilable.length === 0) {
            return NextResponse.json({ message: "Pincode not avilable", success: false }, { status: 400 });
        }
        return NextResponse.json({ message: "Avilable Pincode", success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.error(error);
    }
}