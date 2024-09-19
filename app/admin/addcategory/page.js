"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast"
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
    name: z.string().min(3, "Category atleast 3 character"),
    image: z.string().default(""),
});

export function page() {

    const [issubmitting, setissubmitting] = useState(false)


    const { toast } = useToast()

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: "",
            image: "",
        },
    });


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

            const responce = await fetch("/api/addcategory", {
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





    return (
        <>
            <nav className="w-full bg-white shadow-lg">
                <div className="flex flex-col items-center">
                    <div className="bg-green-200/50 rounded-b-3xl w-full flex justify-center py-4">
                        <Link href="https://tiffinboxes.com" className="inline-block">
                            <img className="w-40 md:w-56" src="/nav/mainnavlogo.png" />
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto bg-white rounded-lg p-6 md:p-10 lg:p-12 shadow-md max-w-lg md:max-w-2xl lg:max-w-3xl h-fit my-16">
                <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                    New Category from
                </h2>

                <Form {...form} className="h-fit">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Category Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md p-2 text-base"
                                            placeholder="Enter product name"
                                            {...field}
                                        />
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
                                            className="block w-full text-base"
                                            onChange={(e) => {
                                                handleImage(e);
                                            }}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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

export default page;
