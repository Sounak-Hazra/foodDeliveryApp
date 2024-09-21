"use client"
import React from 'react'
import { Separator } from '@/components/ui/separator'

//for address
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
import { CalendarIcon, Loader2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState, useCallback, useEffect } from "react"
import local from 'next/font/local'


const formSchema = z.object({
  name: z.string().min(2, { message: "Name is required and must be at least 2 characters." }),
  mobile: z.string().length(10, { message: "Mobile number must be exactly 10 digits." }),
  pincode: z.string().min(6, { message: "Pincode must be at least 6 digits." }),
  address: z.string().min(10, { message: "Address must be at least 10 characters." }),
  city: z.string().min(2, { message: "City/District/Town is required." }),
  landmark: z.string().optional(),
  alternatePhone: z.string().optional(),
  message: z.string().optional(),

})

//end address

const page = ({ params }) => {
  const [order, setorder] = useState({ product: [] })
  const [showCart, setshowCart] = useState(false)
  const [time, setTime] = useState("");
  const router = useRouter()
  const [emptycart, setemptycart] = useState(false)

  //address
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

    }
  })

  const { toast } = useToast()

  const onSubmit = async (data) => {
    const f = { ...data, _id: params.id }
    try {
      const response = await fetch("/api/paymentAndorder", {
        method: "POST",
        body: JSON.stringify(f),
      })
      const finalres = await response.json()
      console.log(finalres)
      if (finalres.success) {
        const address = localStorage.getItem("address")
        console.log(data)
        if (!address) {
          localStorage.setItem("address", JSON.stringify(data))
        }
        setshowCart(false)
        toast({
          title: "Success",
          description: "Address added successfully",
        })
      }
      if (!finalres.success) {
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
    }
  }
  //address end

  const fetchOrder = useCallback(async () => {
    console.log("fetching order")
    const res = await fetch('/api/getorder', {
      method: 'POST',
      body: JSON.stringify({ orderid: params.id })
    })
    const data = await res.json()
    const od = data.order
    console.log(od)
    setorder(od)
  }, [])

  const addtocart = (item) => {
    const updatedCart = order.product.map(cartItem =>
      cartItem._id === item._id
        ? { ...cartItem, quantity: cartItem.quantity + 1 }
        : cartItem
    );
    console.log(updatedCart)
    const updatedOrder = { ...order, product: updatedCart };
    const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    console.log(price)
    updatedOrder.price = price;
    setorder(updatedOrder);
  }

  const removefromcart = (item) => {

    if (item.quantity > 1) {
      const updatedCart = order.product.map(cartItem =>
        cartItem._id === item._id
          ? { ...cartItem, quantity: cartItem.quantity - 1 }
          : cartItem
      );
      const updatedOrder = { ...order, product: updatedCart };
      const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      console.log(price)
      updatedOrder.price = price;
      setorder(updatedOrder);
      setorder(updatedOrder);
    }
    else {
      const updatedCart = order.product.filter(cartItem => cartItem._id !== item._id);
      const updatedOrder = { ...order, product: updatedCart };
      const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
      console.log(price)
      updatedOrder.price = price;
      setorder(updatedOrder);
      if (updatedCart.length < 1) {
        setshowCart(true)
      }
    }
  };

  const placeorder = async () => {

    try {
      // Check if address is present
      if (!order.address) {
        toast({
          title: "Error",
          description: "Please add address",
          className: "bg-white text-black", // Custom white background for error
        });
        return;
      }
      if (!time) {
        toast({
          title: "Error",
          description: "Please add a Delevery Time",
          className: "bg-white text-black", // Custom white background for error
        });
        return;
      }

      // Show loader toast with Loader2 component
      const loadingToastId = toast({
        title: (
          <div className="flex items-center">
            <Loader2
              size={24} // Set size of the loader
              color="#000000" // Set color of the loader
              className="mr-2 animate-spin" // Add spinning animation
            />
            Placing Order
          </div>
        ),
        description: "Please wait while we process your order...",
        className: "bg-white text-black", // White background for loader
        duration: null, // Keep it visible until manually dismissed or updated
      });

      // Call API to place order
      const response = await fetch("/api/placeorder", {
        method: "POST",
        body: JSON.stringify({ _id: params.id, order: order, deliverytime: time }),
      });
      const finalres = await response.json();

      // If order is successful
      if (finalres.success) {
        // Update loader toast to success
        toast({
          title: "Success",
          description: "Order placed successfully. Redirecting...",
          className: "bg-white text-black", // White background for success
          duration: 5000, // Automatically close after a while
        });

        // Navigate to payment page
        router.push("/payment/" + params.id) // Adding a small delay before navigating
      }

      // If order fails
      if (!finalres.success) {
        console.log(finalres.message);
        // Update loader toast to error message
        toast({
          title: "Error",
          description: finalres.message,
          variant: "destructive", // Assuming "destructive" is the error variant
          className: "bg-white text-black", // White background for error
        });
      }
    } catch (error) {
      console.log(error);
      // Update loader toast to general error
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive", // Assuming "destructive" is the error variant
        className: "bg-white text-black", // White background for error
      });
    }
  };




  const autoAddress = useCallback(async (add) => {
    await onSubmit(add)
    await fetchOrder()
  }, [fetchOrder])





  useEffect(() => {
    console.log(time)
    fetchOrder()
  }, [fetchOrder, showCart])


  useEffect(() => {
    const address = JSON.parse(localStorage.getItem("address"))
    console.log(address)
    if (address) {
      autoAddress(address)
    }
  }, [])
  return (
    <>
      <div className="header h-36 bg-green-700 text-[28px] text-white  font-[700] flex justify-center items-center">
        <h1 className='mb-4'>Order Details</h1>
      </div>
      <div className="body bg-white relative h-44 top-[-40px] rounded-t-[50px] ">
        <div className='p-6'>
          <div className='mx-3'>
            <div onClick={() => { setshowCart(true) }} className="orderno text-[24px] font-bold font-700 flex  items-center gap-2  ">
              <span>Add new address</span>
              <img src="/addproductfrom/Write icon.svg" alt="" />
            </div>
            <div className='w-full text-[16px]  my-4 overflow-y-hidden flex items-center py-6  font-semibold h-[35px] bg-yellow-300 rounded-2xl whitespace-nowrap overflow-hidden overflow-x-auto scrollbar-hide text-ellipsis'>
              <div className='mx-4 w-80 whitespace-nowrap  overflow-hidden scrollbar-hide text-ellipsis ' >{order.address ? order.address + "," + order.city + "," + order.landmark : <><button onClick={() => { setshowCart(true) }} className='flex gap-2 items-center h-full '> <span>Click hear to add new address</span> <img  src="/addproductfrom/Write icon.svg" alt="" /></button></>}</div>
            </div>
            <div className='text-[16px] font-semibold flex w-full justify-between'>
              <label htmlFor="deliverytime"> Delivery Time</label>
              <input
                value={time}
                onChange={(e) => {
                  const timeValue = e.target.value;

                  // Log time in 24-hour format
                  console.log(timeValue);

                  // Update state with the 24-hour format time
                  setTime(timeValue);
                }}
                id="deliverytime"
                type="time"
                step="1"
              />
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 relative top-[-30px]'>
        <div className='flex justify-between items-center mx-3'>
          <h1 className='w-[147px] h-auto text-[20px] font-[500]'>Order Summary </h1>
          {/* <div className='w-14 h-[14px] flex items-center justify-center p-2 text-[12px] font-[400] rounded-[19px] text-white bg-green-700'>Edit</div> */}
        </div>
        <Separator className="my-7 bg-green-300/50" />
        <div className='px-3'>
          {order ?
            order.product.map((product, index) => {
              return (
                <div key={product._id}>
                  <div className='w-full flex items-center'>

                    <div className='w-[82px] h-[118px] m-0 p-0'>
                      <img className='w-full h-full object-cover rounded-[20px]' src={product.image} alt="" />
                    </div>
                    <div className='h-full w-[153px] flex flex-col mx-4 '>
                      <span className=' text-[20px] font-[500]'>{product.name}</span>
                    </div>
                    <div className='flex flex-col items-end h-full gap-4'>
                      <div className="price w-[88px] h-[26px] text-end text-[20px] font-[500]">{product.price}₹</div>
                      <span className='text-[14px] font-[300]'>{product.quantity} items</span>
                      <div className="addtocart flex justify-between items-center py-1 rounded-lg h-10 my-auto  bottom-1 left-[8px]  z-10 font-bold text-lg  transition-colors">
                        <div onClick={() => removefromcart(product)} className="w-6 h-full flex items-center justify-center  cursor-pointer text-green-700 font-bold text-3xl pb-1 rounded-l-lg">
                          <img src="/homepage/Less Icon.svg" alt="" />
                        </div>
                        <div className="w-8 h-full flex items-center justify-center font-bold text-xl text-white-700">
                          {product.quantity}
                        </div>
                        <div onClick={() => addtocart(product)} className="w-6 h-full flex items-center justify-center cursor-pointer font-bold text-2xl pb-1 rounded-r-lg">
                          <img src="/homepage/Add to car Icon.svg" alt="" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-7 bg-green-300/50" />
                </div>
              )
            }) :
            <div>Loading...</div>
          }
        </div>
        <div className='px-6 my-4 flex items-center justify-center gap-10 flex-col'>
          <div className='w-full text-[20px] font-[500] flex justify-between items-center'>
            <span>Total :</span>
            <span>{order.product ? order.price : "0"}₹</span>
          </div>

        </div>
      </div>
      <div className='w-screen h-20 items-center z-20 flex justify-center bg-white fixed bottom-0'>
        <button disabled={emptycart} onClick={() => { placeorder() }} className='w-[193px] h-[48px] py-[20px] px-[40px] flex items-center justify-center bg-green-700 text-white rounded-[52px] text-[18px] font-[500]'>
          <span>Place Order</span>
        </button>
      </div>
      <div className={`h-screen w-[90%] fixed border border-green-200 bg-green-700 z-40 top-0 ${showCart ? "left-0" : "left-[-100%]"} rounded-r-[20px] transition-all duration-1000 ease-in-out p-4`}>
        <div onClick={() => { setshowCart(!showCart) }} className="close absolute top-3 right-4">
          <img src="/homepage/cancel-circle-stroke-rounded (1).svg" alt="" />
        </div>
        <>
          <div className='text-center my-6'>
            <h1 className="text-white text-2xl font-bold">Add new address</h1>
          </div>
          <div className="form p-4">
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
                          <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                          <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full name </label>
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
                          <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                          <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">10-digit mobile number</label>
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
                          <textarea {...field} type="time" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                          <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Full address</label>
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
                            <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                            <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">City</label>
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
                            <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                            <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Pincode</label>
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
                            <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
                            <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Landmark</label>
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
                            <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " />
                            <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">(optional) Number </label>
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
                          <textarea {...field} type="time" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " />
                          <label className="text-white peer-focus:font-medium absolute text-sm text-white-500 dark:text-white duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-white peer-focus:dark:text-white peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6">Message (optional)</label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-center mt-6">
                  <Button className="w-44 bg-yellow-300 text-green-700 font-bold"
                    type="submit"
                    variant="primary"
                  >
                    Add address
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </>
      </div>
    </>
  )
}

export default page