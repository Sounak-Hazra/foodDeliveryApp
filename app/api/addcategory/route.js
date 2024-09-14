import { NextResponse } from "next/server";
import Categorys from "@/models/Categorys";
import dbConnect from "@/dbConfig/connect";

export async function POST(request) {
    const req = await request.json();
    const { name, image } = req;
    try {
        await dbConnect();
        const newCategory = new Categorys({
            name: name,
            image: image,
        });
        const savedCategory = await newCategory.save();
        if (!savedCategory) {
            return NextResponse.json({ message: "Category not created", success: false }, { status: 400 });
        }
        return NextResponse.json({ message: "Category created", success: true }, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Category not created", success: false }, { status: 400 });
    }
}