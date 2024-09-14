import Deleveryboy from "@/models/deleveryboy";
import { NextResponse } from "next/server";
import dbConnect from "@/dbConfig/connect";


export async function POST(req) {
    await dbConnect();
    try {
        const request = await req.json();
        const { username, phone, password } = request;
        const deleveryboy = new Deleveryboy({
            username,
            phone,
            password,
        });
        await deleveryboy.save();
        return NextResponse.json({ message: "Deleveryboy added successfully",seccess:true },{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong",seccess:false },{status:500});
    }
}