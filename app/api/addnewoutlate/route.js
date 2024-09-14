import outlates from "@/models/outlates";
import dbConnect from "@/dbConfig/connect";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";



export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { name, email, password, isAdmin, pincodes } = req;
        const hashedpassword = await bcrypt.hash(password, 10);
        const newOutlate = new outlates({
            name, email,password:hashedpassword, isAdmin, pincodes
        });
        const outlate = await newOutlate.save();
        if (!outlate) {
            return NextResponse.json({ message: 'Outlate not added', success: false }, { status: 404 });
        }
        return NextResponse.json({success: true ,message:"Outlate created successfully"}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error adding outlate', success: false }, { status: 500 });
    }
}