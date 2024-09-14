"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Nav from "@/app/components/Nav"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState } from "react"


const formSchema = z.object({
    name: z.string().min(2, { message: "Name is required and must be at least 2 characters." }),
    mobile: z.string().length(10, { message: "Mobile number must be exactly 10 digits." }),
    pincode: z.string().min(6, { message: "Pincode must be at least 6 digits." }),
    address: z.string().min(10, { message: "Address must be at least 10 characters." }),
    city: z.string().min(2, { message: "City/District/Town is required." }),
    landmark: z.string().optional(),
    alternatePhone: z.string().optional(),
    message: z.string().optional(),
    deliveryTime: z.string({ required_error: "Delivery time is required." }),
    paymentType: z.string({ required_error: "Payment type is required." }),

})

const Page = ({ params }) => {
    

    const [issubmitting, setissubmitting] = useState(false)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            mobile: "",
            pincode: "",
            address: "",
            city: "",
            landmark: "",
            alternatePhone: "",
            message: "",
            deliveryTime: "",
            paymentType: "",

        }
    })

    const router = useRouter()
    const { toast } = useToast()

    const onSubmit = async (data) => {
        try {
            setissubmitting(true)
            const response = await fetch("/api/paymentAndorder", {
                method: "POST",
                body: JSON.stringify({ ...data, _id: params.id }),
            })
            const finalres = await response.json()
            if (finalres.success) {
                router.push("/ordersuccess/" + params.id)
            }
            else {
                console.log(finalres.message);
                toast({
                    title: "Error",
                    description: finalres.message,
                    variant: "districtive",
                })
            }
        } catch (error) {
            console.log(error);
            toast({
                title: "Error",
                description: "Something went wrong",
                variant: "districtive",
            })
        } finally {
            setissubmitting(false)
        }
    }

    return (
        <>
            <Nav />
            <div className="form p-4 my-4 mt-7">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel className="text-lg font-bold m-2">Name</FormLabel> */}
                                    <FormControl>
                                        {/* <Input placeholder="Your name" {...field} /> */}
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full name </label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="mobile"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel className="text-lg font-bold m-2">10-digit mobile number</FormLabel> */}
                                    <FormControl>
                                        {/* <Input placeholder="Your mobile number" {...field} /> */}
                                        <div className="relative z-0 w-full mb-5 group">
                                            <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">10-digit mobile number</label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel className="text-lg font-bold m-2">Address (Area and Street)</FormLabel> */}
                                    <FormControl>
                                        {/* <Textarea placeholder="Enter your full address" {...field} /> */}
                                        <div className="relative z-0 w-full mt-3 mb-5 group">
                                            <textarea {...field} type="time"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full address</label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-lg font-bold m-2">City/District/Town</FormLabel> */}
                                        <FormControl>
                                            {/* <Input placeholder="Enter your city" {...field} /> */}
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="pincode"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-lg font-bold m-2">Pincode</FormLabel> */}
                                        <FormControl>
                                            {/* <Input placeholder="Enter your pincode" {...field} /> */}
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Pincode</label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                        </div>


                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="landmark"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-lg font-bold m-2">Landmark (Optional)</FormLabel> */}
                                        <FormControl>
                                            {/* <Input placeholder="Nearby landmark" {...field} /> */}
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Landmark</label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="alternatePhone"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormLabel className="text-lg font-bold m-2">Alternate Phone (Optional)</FormLabel> */}
                                        <FormControl>
                                            {/* <Input placeholder="Alternate phone number" {...field} /> */}
                                            <div className="relative z-0 w-full mb-5 group">
                                                <input {...field} type="text"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Alternet number (optional)</label>
                                            </div>
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="message"
                            render={({ field }) => (
                                <FormItem>
                                    {/* <FormLabel className="text-lg font-bold m-2">Message (Optional)</FormLabel> */}
                                    <FormControl>
                                        {/* <Textarea placeholder="Leave a message..." {...field} /> */}
                                        <div className="relative z-0 w-full mt-3 mb-5 group">
                                            <textarea {...field} type="time"  className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                            <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Message (optional)</label>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex gap-2 items-center">
                            <FormField
                                control={form.control}
                                name="deliveryTime"
                                render={({ field }) => (
                                    <FormItem className="w-1/2" >
                                        {/* <FormLabel className="text-lg font-bold m-2">Delivery Time</FormLabel> */}
                                        <FormControl>
                                            {/* <Input className="w-full flex items-center justify-center" type="time" {...field} /> */}
                                            <div className="relative z-0 w-full mt-3 mb-5 group">
                                                <input {...field} type="time" className="block py-2.5 px-2 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-green-400 peer" placeholder=" " required />
                                                <label className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-green-600 peer-focus:dark:text-green-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Delivery time</label>
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="paymentType"
                                render={({ field }) => (
                                    <FormItem className="w-1/2">
                                        {/* <FormLabel className="text-lg font-bold m-2">Payment Method</FormLabel> */}
                                        <FormControl>
                                            <Select
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger className="w-full border-t-0 border-l-0 border-r-0 border-b-2 border-b-gray-300  rounded-none ml-2 pl-1 focus:border-green-400 focus-within:outline-none focus:outline-none focus:ring-0 focus:text-green-600" >
                                                    <SelectValue placeholder="Select a payment method" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="cod">Cash on Delivery</SelectItem>
                                                    <SelectItem value="online">Online Payment</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="h-[116px] flex justify-center items-center gap-2 -bottom-4 -left-0 bg-green-200/50 fixed w-screen rounded-t-3xl">
                            <Button disabled={issubmitting} className="bg-green-500 text-2xl font-bold rounded-xl px-6 py-5 flex items-center justify-center gap-2" type="submit">
                                <span>Place order</span>
                                <img className="mt-1" src="/homepage/cart.svg" alt="" />
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </>
    )
}

export default Page
