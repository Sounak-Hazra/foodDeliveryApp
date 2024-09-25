import Orders from "@/models/Orders";
import { NextResponse } from "next/server";
import mongoose from "mongoose";


export async function POST(req) {
    try {
        const { orderid } = await req.json();
        const id = new mongoose.Types.ObjectId(orderid);
        const order = await Orders.findById(id);
        if (!order) {
            return NextResponse.json({ message: "No such order found", seccess: false }, { status: 404 });
        }
        let i = ""
        order.product.map((product, index) => {
            i = i + product.name + " " + product.quantity + " items"
        })
        const payload = {
            "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJhYWFmZWE3ZGU3MGI5ODJhNmYyNCIsIm5hbWUiOiJJbW1pIENvbm5lY3QiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjZkMmFhYWZlYTdkZTcwYjk4MmE2ZjE0IiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MjUwODIyODd9.AeaDdvHIU7kaUZchAA9f3_bnPlAdOlE9E3cMgrc5QR8",
            "campaignName": "Order_confirmed",
            "destination": order.mobile,
            "userName": "Immi Connect",
            "templateParams": [
                `${order.name}`,
                `${i}`,
                `${order.price}₹`,
            ],  // Your custom message
            "source": "new-landing-page form",
            "media": {
                "url": "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/VIDEO/6353da2e153a147b991dd812/3837837_11096001080p4k1280x720.mp4",
                "filename": "sample_media"
            },
            "buttons": [],
            "carouselCards": [],
            "location": {},
            "paramsFallbackValue": {
                "FirstName": "user"
            }
        };

        const res = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        order.successfull = "accapted"
        const saveorder = await order.save();
        if (!saveorder) {
            return NextResponse.json({ message: "Something went wrong", seccess: false }, { status: 500 });
        }
        return NextResponse.json({ order, seccess: true }, { status: 200 });
    }
    catch (error) {
        console.log(error);
        return NextResponse.json({ message: "Something went wrong", seccess: false }, { status: 500 });
    }
}