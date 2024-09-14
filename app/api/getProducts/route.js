import Product from "@/models/Product";
import dbConnect from "@/dbConfig/connect";
import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        await dbConnect();
        const req = await request.json();
        const { category } = req;

        if (category === "all") {
            const products = await Product.aggregate([
                    {
                        $group: {
                            _id: "$category", 
                            products: { $push: "$$ROOT" } 
                    },
                    }
                ]).limit(1000);
            if (!products || products.length === 0) {
                return NextResponse.json({ message: 'No products found',success:false }, {status:404});
            }
            return NextResponse.json({ products,success:true }, {status:200});
        }
        
        const products = await Product.find({ category }).limit(1000);

        if (!products || products.length === 0) {
            return NextResponse.json({ message: 'No products found',success:false }, {status:404});
        }

        return NextResponse.json({products:[{products:products,_id:category}],success:true} , {status:200});
    } catch (error) {
        console.log(error);
        return NextResponse.json({ message: 'Error retrieving products',success:false }, {status:500});
    }
}
