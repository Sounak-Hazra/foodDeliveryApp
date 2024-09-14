import deleveryboy from "@/models/deleveryboy";
import { NextResponse } from "next/server";
import dbConnect from "@/dbConfig/connect";

export async function GET(req) {
    await dbConnect();
    try {
        const deliveryboy = await deleveryboy.find({});
        if (!deliveryboy) {
            return NextResponse.json({ message: "Invalid phone number", success: false }, { status: 400 });
        }
        return NextResponse.json({ message: "Login successfully",success:true, value:deliveryboy },{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong",success:false },{status:500});
    }
}