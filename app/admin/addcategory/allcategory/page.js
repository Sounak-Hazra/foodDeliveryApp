"use client"
import React, { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Button } from "@/components/ui/button"; // Assuming you have a Button component

const Page = () => {
    const [categorys, setCategorys] = useState([]);
    const { toast } = useToast();

    const getCategorys = useCallback(async () => {
        try {
            const data = await fetch("/api/getcategorys", {
                method: "GET",
            });
            const response = await data.json();
            if (!response.success) {
                setCategorys([]);
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
            } else {
                const res = response.data;
                setCategorys(res);
            }
        } catch (error) {
            setCategorys([]);
            toast({
                title: "Error",
                message: "Failed to fetch categories",
                type: "error",
            });
        }
    }, [toast]);

    const handledeletecategory = async (id) => {
        try {
            const data = await fetch("/api/deletecategory", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ id }),
            });
            const response = await data.json();
            if (!response.success) {
                toast({
                    title: "Error",
                    message: response.message,
                    type: "error",
                });
                getCategorys();
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
                message: "Failed to delete category",
                type: "error",
            });
        } finally {
            getCategorys();
        }
    }

    useEffect(() => {
        getCategorys();
    }, [getCategorys]);

    return (
        <>
            <div className="w-full px-4 md:px-8 py-10">
                <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-800 mb-10">
                    Category List
                </h1>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8">
                    {categorys.map((category, index) => (
                        <HoverCard key={index} className="shadow-lg rounded-lg overflow-hidden bg-white hover:shadow-xl transition-shadow duration-300">
                            {/* HoverCardTrigger only for desktop */}
                            <HoverCardTrigger asChild>
                                <div className="relative cursor-pointer h-32 w-full">
                                    <img
                                        src={category.image}
                                        alt={category.name}
                                        className="w-full h-full object-contain rounded-xl"
                                    />
                                    <div className="absolute rounded-md bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                                        <p className="text-white text-sm font-medium">
                                            {category.name}
                                        </p>
                                    </div>
                                </div>
                            </HoverCardTrigger>

                            {/* Conditionally show HoverCardContent based on screen size */}
                            <HoverCardContent className="p-3 flex flex-col items-center justify-between hidden sm:flex">
                                <div className="w-full text-center">
                                    <p className="text-gray-700 font-medium text-base">
                                        {category.name}
                                    </p>
                                </div>
                                <Button
                                    className="w-full mt-3 bg-red-600 text-white py-1 rounded-md hover:bg-red-700 transition-colors duration-200"
                                    onClick={() => { handledeletecategory(category._id) }}
                                >
                                    Delete
                                </Button>
                            </HoverCardContent>

                            {/* Always visible delete button for mobile (no hover) */}
                            <div className="p-3 flex flex-col items-center justify-between sm:hidden">
                                <div className="w-full text-center">
                                    <p className="text-gray-700 font-medium text-base">
                                        {category.name}
                                    </p>
                                </div>
                                <Button
                                    className="w-full mt-3 bg-red-600 text-white py-1 rounded-md hover:bg-red-700 transition-colors duration-200"
                                    onClick={() => { handledeletecategory(category._id) }}
                                >
                                    Delete
                                </Button>
                            </div>
                        </HoverCard>
                    ))}
                </div>
            </div>
        </>
    )
}

export default Page;
