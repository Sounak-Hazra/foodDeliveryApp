"use client";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import Link from "next/link";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
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
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({ message: "Enter a valid email." }),
    password: z.string().min(6, { message: "Password should be at least 6 characters long." }),
    isAdmin: z.boolean().default(false),
    pincodes: z.array(z.string()).min(1, { message: "At least one pincode is required." }),
});

export function ProfileForm() {
    const [pincode, setPincode] = useState('');
    const [pincodes, setPincodes] = useState([]);
    const [categorys, setCategorys] = useState([]); // Assuming you're populating this somewhere
    const [isSubmitting, setIsSubmitting] = useState(false);

    const { toast } = useToast();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            isAdmin: false,
            pincodes: [],
        },
    });

    const handlePincode = () => {
        setPincodes([...pincodes, pincode]);
        setPincode('');
    };

    const handleDeletePincode = (pincode) => {
        const newPincodes = pincodes.filter((p) => p !== pincode);
        setPincodes(newPincodes);
    };

    const onSubmit = async (data) => {
        setIsSubmitting(true); // Set submission state
        try {
            const finalData = { ...data };
            const response = await fetch("/api/addnewoutlate", {
                method: "POST",
                body: JSON.stringify(finalData),
            });
            if (!response.ok) {
                toast({
                    title: "Submission failed!",
                    description: "An error occurred while submitting the form please resubmit.",
                });
            } else {
                toast({
                    title: "Submission successful!",
                    description: "The form has been submitted successfully.",
                    type: "success",
                });
                form.reset(); 
            }
        } catch (error) {
            setIsSubmitting(false); 
            console.error("Submission error:", error);
        } finally {
            setIsSubmitting(false); 
        }
    };

    useEffect(() => {
        form.setValue("pincodes", pincodes);

    }, [pincodes])

    return (
        <>
            <nav className="w-full ">
                <div className="flex flex-col w-full bg-white">
                    <div className="text-center bg-green-200/50 rounded-b-3xl">
                        <Link href="https://tiffinboxes.com" className="inline-block">
                            <img className="w-40" src="/nav/mainnavlogo.png" alt="Logo" />
                        </Link>
                    </div>
                </div>
            </nav>

            <div className="mx-auto bg-white shadow-lg rounded-lg p-8 h-fit overflow-scroll 8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
                    Outlet Details Form
                </h2>

                <Form {...form} className="h-fit md:px-72">
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 ">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Outlet Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                            placeholder="Enter outlet name"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Outlet Email</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                            placeholder="Enter outlet email"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-gray-700">Password</FormLabel>
                                    <FormControl>
                                        <Input
                                            className="border-gray-300 focus:border-green-500 focus:ring-green-500 block w-full rounded-md shadow-sm p-2"
                                            placeholder="Enter password"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="isAdmin"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <div className="flex items-center space-x-2">
                                            <Checkbox {...field} />
                                            <label
                                                htmlFor="terms"
                                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                            >
                                                Admin Access
                                            </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="h-20 border border-gray-300 rounded-md p-4 overflow-y-auto">
                            <div className="text-xl font-bold">
                                <div>Available Pincodes</div>
                            </div>
                            {pincodes.map((pincode, index) => (
                                <div key={index} className="flex gap-2 items-center border-b-2 px-2">
                                    <div>{pincode}</div>
                                    <img
                                        className="hover:cursor-pointer"
                                        onClick={() => handleDeletePincode(pincode)}
                                        width={20}
                                        src="/addproductfrom/cancel-circle-stroke-rounded.svg"
                                        alt="Delete"
                                    />
                                </div>
                            ))}
                            {pincodes.length === 0 && <div>No pincodes added</div>}
                        </div>
                        <div className="items-center w-full ">
                            <FormField
                                className="w-full my-2"
                                name="pincodes"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="w-full"
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div
                                className="my-2 bg-gray-800 w-fit p-2 rounded-md text-white font-bold hover:cursor-pointer"
                                onClick={() => pincode && handlePincode()}
                            >
                                Add Pincode
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className={`w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-all duration-200 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                                }`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Submitting..." : "Submit"}
                        </Button>
                    </form>
                </Form>
            </div>
        </>
    );
}

export default ProfileForm;
