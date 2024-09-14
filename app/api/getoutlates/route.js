import outlates from "@/models/outlates";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";


export async function GET(request) {
    try {
        await dbConnect();
        const outlate = await outlates.find({});
        if (!outlate) {
            return NextResponse.json({ message: 'No outlates found', success: false }, { status: 404 });
        }
        return NextResponse.json({success: true,outlates:outlate ,message:"Outlate fetched successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error adding outlate', success: false }, { status: 500 });
    }
}