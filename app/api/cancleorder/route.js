import Orders from "@/models/Orders";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(request) {
  const req = await request.json()
  const { _id } = req;
  try {
    await dbConnect();
    const id = new mongoose.Types.ObjectId(_id)
    console.log(id)
    const order = await Orders.findById(id)
    console.log(order)
    if (!order) {
      console.log("No order")
      return NextResponse.json({ message: 'Order not found', success: false }, { status: 400 })
    }
    order.successfull = "cancled";
    const saveOrder = await order.save();
    if (!saveOrder) {
      console.log("Order not seved")
      return NextResponse.json({ message: 'Order not cancle', success: false }, { status: 400 })
    }
    const payload = {
      "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJhYWFmZWE3ZGU3MGI5ODJhNmYyNCIsIm5hbWUiOiJJbW1pIENvbm5lY3QiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjZkMmFhYWZlYTdkZTcwYjk4MmE2ZjE0IiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MjUwODIyODd9.AeaDdvHIU7kaUZchAA9f3_bnPlAdOlE9E3cMgrc5QR8",
      "campaignName": "Order_confirmed",
      "destination": order.mobile,
      "userName": "Immi Connect",
      "templateParams": [
        `${order.name}`,
        `Sorry for some unforseen circumstances we have to cancel your order`,
        `${order.price}₹`,
      ],
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
    return NextResponse.json({ message: 'Cancled', success: true }, { status: 200 })
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: 'Order not created', success: false }, { status: 400 })
  }
}

