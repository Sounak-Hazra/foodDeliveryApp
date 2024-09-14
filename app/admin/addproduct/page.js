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

export function ProfileForm() {

    const [pincode, setpincode] = useState('')
    const [pincodes, setpincodes] = useState([])
    const [categorys, setcategorys] = useState([])
    const [issubmitting, setissubmitting] = useState(false)


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
                console.log(res);
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

            const responce = await fetch("/api/addProduct", {
                method: "POST",
                body: JSON.stringify(data),
            });

            const finalres = await responce.json();
            console.log(finalres);

            if (finalres.success) {
                console.log(finalres);
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
        console.log(data)
        form.setValue("image", data)
    };

    const handlepincode = () => {
        setpincodes([...pincodes, pincode]);
        setpincode('');
    }

    const handledeletepincode = (pincode) => {
        const newpincodes = pincodes.filter((p) => p !== pincode);
        setpincodes(newpincodes);
    }


    useEffect(() => {
        form.setValue("avilablepincodes", pincodes);

    }, [pincodes])

    useEffect(() => {
        getcategory();
    }, []);


    return (
        <>
             <nav className="w-full ">
                <div className="flex flex-col w-full bg-white">
                    <div className="text-center bg-green-200/50 rounded-b-3xl">
                        <Link href="https://tiffinboxes.com" className="inline-block">
                            <img className='w-40' src='/nav/mainnavlogo.png' />
                        </Link>
                    </div>
                </div>
            </nav>
        
        <div className="mx-auto bg-white shadow-lg rounded-lg p-8 h-fit overflow-scroll mb-28">
            <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                Product Details Form
            </h2>

            <Form {...form} className="h-fit">
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                    <FormField
                        control={form.control}
                        name="productname"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Product Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                        placeholder="Enter product name"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Category</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <SelectTrigger className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2">
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categorys.map((cat) => (
                                                <SelectItem key={cat.id} value={cat.name}>
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
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Price</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                        placeholder="Enter price"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Description</FormLabel>
                                <FormControl>
                                    <Input
                                        className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                        placeholder="Enter product description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="bestsellar"
                        render={({ field }) => (
                            <FormItem className="flex items-center">
                                <FormLabel className="text-gray-700">Bestsellar</FormLabel>
                                <FormControl>
                                    <Input type="checkbox" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        name="image"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-gray-700">Upload Image</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        onChange={(e) => {
                                            handleImage(e);
                                        }}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="h-20 border border-gray-300 rounded-md p-4 overflow-y-auto">
                        <div className="text-xl font-bold" >
                            <div>Avilable Pincodes</div>
                        </div>
                        {pincodes.map((pincode, index) => {
                            return (
                                <div key={index} className="flex gap-2 items-center border border-b-2 px-2">
                                    <div key={index}>{pincode}</div>
                                    <img className="hover:cursor-pointer" onClick={() => { handledeletepincode(pincode) }} width={20} src="/addproductfrom/cancel-circle-stroke-rounded.svg" alt="" />
                                </div>)
                        })}
                        {
                            pincodes.length === 0 ? <div>No pincodes added</div> : ""
                        }
                    </div>
                    <div className="items-center w-full ">
                        <FormField className="w-full my-2"
                            name="avilablepincodes"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input className="w-full" value={pincode}
                                            onChange={(e) => {
                                                setpincode(e.target.value);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="my-2 bg-gray-800 w-fit p-2 rounded-md text-white font-bold hover:cursor-pointer" onClick={() => { pincode === "" ? "" : handlepincode() }}>
                            Add pincode
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200"
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
