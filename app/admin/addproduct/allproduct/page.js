"use client"
import { useState, useEffect, useCallback, useRef } from "react";
import Nav from "@/app/components/Nav";
import BestSellerRibbon from "@/app/components/Bestsellar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast";
// import Footer, { Footercomponent } from "./components/Footer";
import { useRouter } from "next/navigation";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
} from "@/components/ui/carousel"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { date } from "zod";
import { Loader2 } from "lucide-react";
import { Modal } from "flowbite-react";
import Link from "next/link";





export default function Home() {
    const [totalProducts, setTotalProducts] = useState([]);
    const [categorys, setcategorys] = useState([])
    const [currentScroll, setCurrentScroll] = useState("");
    const [cart, setcart] = useState([])
    const [emptycart, setemptycart] = useState(true)
    const [totalprice, settotalprice] = useState(0)
    const [showCart, setshowCart] = useState(false)
    const [currentcategory, setcurrentcategory] = useState("all")
    const [issubmitting, setissubmitting] = useState(false)

    //gpt
    const [showModal, setShowModal] = useState(false);

    const { toast } = useToast();
    const router = useRouter();




    //   const getcategory = useCallback(async () => {
    //     try {
    //       const data = await fetch("/api/getcategorys");
    //       const response = await data.json();
    //       if (!response.success) {
    //         setcategorys([]);
    //         toast({
    //           title: "Error",
    //           message: response.message,
    //           type: "error",
    //         });
    //       } else {
    //         const res = response.data
    //         setcategorys(res);
    //         console.log(res);
    //       }
    //     } catch (error) {
    //       setcategorys([]);
    //       toast({
    //         title: "Error",
    //         message: "Failed to fetch categorys",
    //         type: "error",
    //       });
    //     }
    //   }, []);


    const getProduct = useCallback(async () => {
        try {
            const data = await fetch("/api/getProducts", {
                method: "POST",
                body: JSON.stringify({
                    category: currentcategory,
                })
            });
            const response = await data.json();
            if (!response.success) {
                setTotalProducts([]);
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
            } else {
                const arr = response.products
                setTotalProducts(arr);
            }
        } catch (error) {
            setTotalProducts([]);
            toast({
                title: "Error",
                message: "Failed to fetch products",
                type: "error",
            });
        }
    }, [currentcategory]);

    const handledelete = async (item) => {
        try {
            const data = await fetch("/api/deleteproduct", {
                method: "POST",
                body: JSON.stringify({
                    id: item._id,
                })
            });
            const response = await data.json();
            if (!response.success) {
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
            } else {
                toast({
                    title: "Success",
                    message: response.message,
                    type: "success",
                });
            }
        } catch (error) {
            toast({
                title: "Error",
                message: "Failed to delete product",
                type: "error",
            });
        }finally{
            getProduct();
        }
    }

    useEffect(() => {
        getProduct();
        // getcategory();
    }, [getProduct, currentcategory]);



    return (
        <>
            <nav className="w-full">
                <div className="flex flex-col w-full bg-white shadow-md">
                    <div className="text-center bg-green-200/50 rounded-b-3xl py-4">
                        <Link href="https://tiffinboxes.com" className="inline-block">
                            <img className='w-40 mx-auto' src='/nav/mainnavlogo.png' alt="Logo" />
                        </Link>
                    </div>
                </div>
            </nav>
            <div className={`mainitems min-h-screen px-9 py-5 ${showModal && "blureffect"}`}>
                {totalProducts.map((product) => (
                    <div className="h-auto ">
                        <div className="h-auto text-center text-3xl font-bold my-5">
                            {product._id}
                        </div>
                        <div className="myproductsgrid w-full mt-4">
                            {product.products.map((item, i) => (
                                <>
                                    <div key={i} className="bg-white w-full  relative  rounded-lg flex items-center space-x-4 max-w-sm mx-auto md:max-w-lg">

                                        <div className="overflow-hidden flex flex-col m-0 w-full">
                                            {item.bestsellar ?
                                                <div className="w-24 absolute top-0 left-0 ">
                                                    <BestSellerRibbon />
                                                </div>
                                                : null}
                                            <div className='w-full h-[185px] object-cover relative'>
                                                <img src={item.image} className="w-full mx-auto rounded-[26px] object-cover h-full" alt="Nachos" />
                                                <Link href={`/admin/addproduct/allproduct/${item._id}`} className="bg-green-500 text-white font-semibold text-base rounded-md px-2 py-1 absolute top-2 right-2">Edit</Link>

                                            </div>
                                            <div className='flex justify-between w-full mt-2'>
                                                <div className="">
                                                    <div className="font-bold text-xl ">{item.name}</div>
                                                    <div className='text-base font-semibold'>₹{item.price}</div>
                                                    <p className="text-gray-700 text-[12px] h-12 overflow-hidden text-ellipsis mr-3 font-[300] ">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                            <button onClick={()=>handledelete(item)} className="bg-red-500 text-white font-semibold text-base rounded-md px-2 py-1 absolute  bottom-14 right-2">
                                                Remove
                                            </button>
                                            <Separator className=" mt-1 w-auto bg-green-200" />
                                        </div>
                                    </div>

                                </>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
}
