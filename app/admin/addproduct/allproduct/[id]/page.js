"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { set } from "mongoose";

const formSchema = z.object({
    productname: z.string().min(2, {
        message: "Product name must be at least 2 characters.",
    }),
    category: z.string().default("all"),
    price: z.string().default(0),
    description: z.string().default(""),
    image: z.string().default(""),
    avilablepincodes: z.array(z.string()).min(1, { "message": "Atleast one pincode is required" }),
    bestsellar: z.boolean().default(false),
});

export function ProfileForm({params}) {

    const [pincode, setpincode] = useState({})
    const [pincodes, setpincodes] = useState([])
    const [categorys, setcategorys] = useState([])
    const [issubmitting, setissubmitting] = useState(false)
    const [allpincodes, setallpincodes] = useState([])
    const [availablePincodes, setAvailablePincodes] = useState([]);


    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            productname: "",
            category: "all",
            price: "0",
            description: "",
            image: "",
            avilablepincodes: [],
            bestsellar: false,
        },
    });


    const getcategory = useCallback(async () => {
        try {
            const data = await fetch("/api/getcategorys");
            const response = await data.json();
            if (!response.success) {
                setcategorys([]);
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
            } else {
                const res = response.data
                setcategorys(res);
            }
        } catch (error) {
            setcategorys([]);
            toast({
                title: "Error",
                message: "Failed to fetch categorys",
                type: "error",
            });
        }
    }, []);

    const getPincode = useCallback(async () => {
        try {
            const data = await fetch("/api/getpincodes");
            const response = await data.json();
            if (!response.success) {
                setallpincodes([]);
                toast({
                    title: "Error",
                    description: response.message,
                    type: "error",
                });
            } else {
                const res = response.pincodes
                setallpincodes(res);
                console.log(res);
            }
        } catch (error) {
            setallpincodes([]);
            toast({
                title: "Error",
                description: "Failed to fetch pincodes",
                type: "error",
            });
        }
    }, []);



    const makebase64 = (file) => {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        const data = new Promise((resolve, reject) => {
            reader.onload = () => {
                resolve(reader.result)
            }
            reader.onerror = (error) => {
                reject(error)
            }
        })
        return data
    }

    const onSubmit = async (data) => {
        console.log(data)
        try {
            setissubmitting(true);

            const responce = await fetch("/api/editproduct", {
                method: "POST",
                body: JSON.stringify({...data, id: params.id}),
            });

            const finalres = await responce.json();

            if (finalres.success) {
                toast({
                    title: "Product added successfully",
                    description: finalres.message,
                });
            } else {

                toast({
                    title: finalres.message,
                    description: finalres.message,
                });
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Something went wrong",
                type: "error",
                description: "Please try again later",
            });
        } finally {
            setissubmitting(false);
        }
    };

    const handleImage = async (e) => {
        const file = e.target.files[0]
        const data = await makebase64(file)
        form.setValue("image", data)
    };

    const handlepincode = () => {
        allpincodes.filter((e) => {
            if (e._id === pincode) {
                setpincodes([...pincodes, e]);
            }
        });
        setpincode('');
    }

    const handlePincodeSelect = (selectedPincode) => {
        // Check if the selected pincode is already in the availablePincodes array
        if (!availablePincodes.some(pin => pin === selectedPincode)) {
            // Add the selected pincode to availablePincodes array
            form.setValue("avilablepincodes", [...availablePincodes, selectedPincode]);
            setAvailablePincodes([...availablePincodes, selectedPincode]);
        }
    };

    const handledeletepincode = (pincode) => {
        const newpincodes = pincodes.filter((p) => p !== pincode);
        setpincodes(newpincodes);
    }


    useEffect(() => {
        form.setValue("avilablepincodes", pincodes);

    }, [pincodes])

    const getproductDetails = useCallback(async () => {
        try {
            const data = await fetch("/api/getproductdetails", {
                method: "POST",
                body: JSON.stringify({ id: params.id }),
            });
            const response = await data.json();
            if (!response.success) {
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
            } else {
                const res = response.product
                console.log(res);
                form.setValue("productname", res.name);
                form.setValue("category", res.category);
                form.setValue("price", `${res.price}`);
                form.setValue("description", res.description);
                form.setValue("bestsellar", res.bestsellar);
                form.setValue("image", res.image);
                setpincodes(res.avilablepincodes);
                setAvailablePincodes(res.avilablepincodes);
            }
        } catch (error) {
            toast({
                title: "Error",
                message: "Failed to fetch product details",
                type: "error",
            });
        }
    }, []);


    useEffect(() => {
        getcategory();
        getPincode()
        if (params.id) {
            getproductDetails()
        }
    }, []);


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

            <div className="mx-auto bg-white shadow-lg rounded-lg p-6 md:p-8 h-fit overflow-y-auto mb-28 max-w-screen-lg">
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
                    Product Details Form
                </h2>

                <Form {...form} className="h-fit space-y-6">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        {/* Product Name Field */}
                        <FormField
                            control={form.control}
                            name="productname"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-700">Product Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-3"
                                            placeholder="Enter product name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Category Field */}
                        <FormField
                            control={form.control}
                            name="category"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-700">Category</FormLabel>
                                    <FormControl>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-3">
                                                <SelectValue placeholder="Select a category" />
                                            </SelectTrigger>
                                            <SelectContent className="z-50">
                                                {categorys.map((cat, i) => (
                                                    <SelectItem key={i} value={cat.name}>
                                                        {cat.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Price Field */}
                        <FormField
                            control={form.control}
                            name="price"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-700">Price</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-3"
                                            placeholder="Enter price"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Description Field */}
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-700">Description</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-3"
                                            placeholder="Enter product description"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Bestseller Field */}
                        <FormField
                            control={form.control}
                            name="bestsellar"
                            render={({ field }) => (
                                <FormItem className="flex items-center gap-4">
                                    <FormLabel className="text-lg text-gray-700">Bestsellar</FormLabel>
                                    <FormControl>
                                        <Input type="checkbox" className="h-5 w-5" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Image Upload Field */}
                        <FormField
                            name="image"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-lg text-gray-700">Upload Image</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="file"
                                            className="w-full block file:mr-4 file:py-2 file:px-4 py-0 file:rounded-md file:border-0 file:text-sm file:bg-green-100 hover:file:bg-green-200"
                                            onChange={(e) => handleImage(e)} // Not recommended to change JavaScript logic
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Available Pincodes Field */}
                        <div className="items-center w-full">
                            <FormField
                                name="availablePincodes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-lg text-gray-700">Available Pincodes</FormLabel>
                                        <FormControl>
                                            <Select
                                                onValueChange={(e) => {
                                                    handlePincodeSelect(e); // Not recommended to change JavaScript logic
                                                }}
                                            >
                                                <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-3">
                                                    {/* <SelectValue placeholder="Select a pincode" /> */}
                                                </SelectTrigger>
                                                <SelectContent className="z-50 flex items-center">
                                                    {allpincodes.map((pin, i) => (
                                                        <SelectItem key={i} value={pin.pincode}>
                                                            {pin.pincode}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {/* Display the added pincodes */}
                            <div className="mt-4">
                                <h3 className="font-semibold text-gray-800">Added Pincodes:</h3>
                                <ul className="list-disc ml-6">
                                    {availablePincodes.map((pin, i) => (
                                        <li key={i} className="text-gray-600">
                                            {pin}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-all duration-200"
                        >
                            Submit
                        </Button>
                    </form>
                </Form>
            </div>
        </>

    );
}

export default ProfileForm;
