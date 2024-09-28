import Categorys from "@/models/Categorys";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        await dbConnect();
        const categorys = await Categorys.find();
        console.log(categorys);
        if (categorys.length === 0) {
            return NextResponse.json({ message: "Category not found", success: false }, { status: 400 });
        }
        return NextResponse.json({ message: "Category found", data: categorys, success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Category not found", success: false }, { status: 400 });
    }
}