import pincodes from "@/models/pincodes";
import { NextResponse } from "next/server";
import dbConnect from "@/dbConfig/connect";


export async function POST(req) {
    await dbConnect();
    try {
        const allpincodes = await pincodes.find();
        if(!allpincodes){
            return NextResponse.json({message:"Error while fetching pincodes" ,success:true},{status:400});
        }
        return NextResponse.json({pincodes:allpincodes,success:true},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.error(error);
    }
}