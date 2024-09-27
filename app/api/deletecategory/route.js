
import Categorys from "@/models/Categorys";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(request) {
    await dbConnect();
    const { id } = await request.json();
    try {
        const mongoid = new mongoose.Types.ObjectId(id);
        const category = await Categorys.findByIdAndDelete({_id : mongoid});
        if (!category) {
            return NextResponse.json({ message: "Category not found",success:false },{status:404});
        }
        return NextResponse.json({ message: "Category deleted",success:true },{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: error.message,success:false },{status:500});
    }
}