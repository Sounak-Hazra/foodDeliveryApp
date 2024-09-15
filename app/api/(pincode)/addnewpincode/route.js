import pincodes from "@/models/pincodes";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";


export async function POST(req) {
    await dbConnect();
    const { pincode } = await req.json();
    try {
        const newpincode = new pincodes({
            pincode
        });
        const savepin = await newpincode.save();
        if(!savepin){
            return NextResponse.json({message:"Error while adding pincode" ,success:true},{status:400});
        }
        return NextResponse.json({pincode:newpincode,success:true,message:"Pin addes successfully"},{status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.error(error);
    }
}