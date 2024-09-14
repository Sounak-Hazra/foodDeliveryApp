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
import { CalendarIcon } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { useState, useCallback, useEffect } from "react"



const page = ({ params }) => {
  const [order, setorder] = useState({ product: [] })
  const [deliverytime, setdeliverytime] = useState("")
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState('');


  const handleSelection = (method) => {
    setSelectedMethod(method);
    console.log(method);
  };



  const { toast } = useToast()

  // const onSubmit = async (data) => {
  //     const f = { ...data, _id: params.id }
  //     try {
  //         const response = await fetch("/api/paymentAndorder", {
  //             method: "POST",
  //             body: JSON.stringify(f),
  //         })
  //         const finalres = await response.json()
  //         console.log(finalres)
  //         if (finalres.success) {
  //             toast({
  //                 title: "Success",
  //                 description: "Address added successfully",
  //             })
  //         }
  //         if (!finalres.success) {
  //             console.log(finalres.message);
  //             toast({
  //                 title: "Error",
  //                 description: finalres.message,
  //                 variant: "districtive",
  //             })
  //         }
  //     } catch (error) {
  //         console.log(error);
  //         toast({
  //             title: "Error",
  //             description: "Something went wrong",
  //             variant: "districtive",
  //         })
  //     }
  // }
  //address end

  const fetchOrder = useCallback(async () => {
    console.log(params.id)
    const res = await fetch('/api/getorder', {
      method: 'POST',
      body: JSON.stringify({ orderid: params.id })
    })
    const data = await res.json()
    const od = data.order
    console.log(od)
    setorder(od)
  }, [])


  const place = async () => {
    try {
      const response = await fetch("/api/finalplaceorder", {
        method: "POST",
        body: JSON.stringify({ orderid: params.id }),
      })
      const finalres = await response.json()
      if (finalres.success) {
        toast({
          title: "Success",
          description: "Order placed successfully",
        })
        router.push("/ordersuccess/" + params.id)
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

  // const addtocart = (item) => {
  //     const updatedCart = order.product.map(cartItem =>
  //         cartItem._id === item._id
  //             ? { ...cartItem, quantity: cartItem.quantity + 1 }
  //             : cartItem
  //     );
  //     console.log(updatedCart)
  //     const updatedOrder = { ...order, product: updatedCart };
  //     const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  //     console.log(price)
  //     updatedOrder.price = price;
  //     setorder(updatedOrder);
  // }

  // const removefromcart = (item) => {

  //     if (item.quantity > 1) {
  //         const updatedCart = order.product.map(cartItem =>
  //             cartItem._id === item._id
  //                 ? { ...cartItem, quantity: cartItem.quantity - 1 }
  //                 : cartItem
  //         );
  //         const updatedOrder = { ...order, product: updatedCart };
  //         const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  //         console.log(price)
  //         updatedOrder.price = price;
  //         setorder(updatedOrder);
  //         setorder(updatedOrder);
  //     }
  //     else {
  //         const updatedCart = order.product.filter(cartItem => cartItem._id !== item._id);
  //         const updatedOrder = { ...order, product: updatedCart };
  //         const price = updatedCart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  //         console.log(price)
  //         updatedOrder.price = price;
  //         setorder(updatedOrder);
  //     }
  // };

  // const placeorder = async () => {
  //     try {
  //         if (!order.address) {
  //             toast({
  //                 title: "Error",
  //                 description: "Please add address",
  //             })
  //             return
  //         }
  //         const response = await fetch("/api/placeorder", {
  //             method: "POST",
  //             body: JSON.stringify({ _id: params.id, order: order }),
  //         })
  //         const finalres = await response.json()
  //         if (finalres.success) {
  //             toast({
  //                 title: "Success",
  //                 description: "Order placed successfully",
  //             })
  //             router.push("/payment/" + params.id)
  //         }
  //         if (!finalres.success) {
  //             console.log(finalres.message);
  //             toast({
  //                 title: "Error",
  //                 description: finalres.message,
  //                 variant: "districtive",
  //             })
  //         }
  //     } catch (error) {
  //         console.log(error);
  //     }
  // }






  useEffect(() => {
    fetchOrder()
  }, [fetchOrder,])
  return (
    <>
      <div className="header h-36 bg-green-700 text-[28px] text-white  font-[700] flex justify-center items-center">
        <h1 className='mb-4'>Order Details</h1>
      </div>
      <div className="body bg-white relative h-44 top-[-40px] rounded-t-[50px] ">
        <div className='p-6'>
          <div className='mx-3'>
            <div className="orderno text-[24px] font-bold font-700 flex  items-center gap-2  ">
              <span>Sipping address</span>
            </div>
            <div className='w-full text-[16px]  my-4 overflow-y-hidden flex items-center py-6  font-semibold h-[35px] bg-yellow-300 rounded-2xl whitespace-nowrap overflow-hidden overflow-x-auto scrollbar-hide text-ellipsis'>
              <div className='mx-4 w-80 whitespace-nowrap  overflow-hidden scrollbar-hide text-ellipsis ' >{order.address ? order.address + "," + order.city + "," + order.landmark : ""}</div>
            </div>
          </div>
        </div>
      </div>
      <div className='px-6 mt-4 relative top-[-70px]'>
        <div className='px-3'>
          <h1 className='text-[20px] mt-2 font-[700]'>Order Summary</h1>
        </div>
        <div className='px-3 w-full my-4 flex justify-between items-center'>
          <div>

            {order ?
              order.product.map((product, index) => {
                return (
                  <div key={index} className='w-48 flex justify-between'>
                    <div className='flex justify-between items-center'>
                      {product.name}
                    </div>
                    <div className='text-orange-400 '>
                      {product.quantity} items
                    </div>
                  </div>
                )
              }) :
              <div>Loading...</div>
            }
          </div>
          <div className='text-[20px] font-[500]'>
            ₹{order.price}
          </div>
        </div>
        <Separator className="my-6 bg-green-300 " />
        <div className='px-3'>
          <h1 className='text-[20px] mt-2 font-[700]'>Payment method</h1>
        </div>
        <div className="px-3 my-4">
          {/* <div
                        className={`flex items-center p-3 cursor-pointer border ${selectedMethod === 'online' ? 'border-green-500' : 'border-gray-300'
                            } rounded-lg mb-4`}
                        onClick={() => handleSelection('online')}
                    >
                        <img
                            src="/paymentlogos/phonepe-icon.webp" // Replace with the actual image path for PhonePe
                            alt="PhonePe"
                            className="w-8 h-8 mr-3"
                        />
                        <div>PhonePe</div>
                        {selectedMethod === 'online' && (
                            <div className="ml-auto">
                                <div className="w-4 h-4 rounded-full bg-green-500"></div> 
                            </div>
                        )}
                    </div> */}

          <div
            className={`flex items-center p-3 cursor-pointer border ${selectedMethod === 'cod' ? 'border-green-500' : 'border-gray-300'
              } rounded-lg`}
            onClick={() => handleSelection('cod')}
          >
            <img
              src="/paymentlogos/download.png" // Replace with the actual image path for Cash on Delivery
              alt="Cash on Delivery"
              className="w-8 h-8 mr-3"
            />
            <div>Cash on Delivery</div>
            {selectedMethod === 'cod' && (
              <div className="ml-auto">
                <div className="w-4 h-4 rounded-full bg-green-500"></div> {/* Blue circle */}
              </div>
            )}
          </div>
        </div>



        <button onClick={() => place()} className='px-3 w-full my-4 text-center flex items-center justify-center'>
          <h1 className='text-[20px] px-5 py-2 rounded-[30px] w-fit bg-green-300/50 text-green-600 mt-2 font-[700]'>Place order</h1>
        </button>

      </div>



      {/* <div className={`h-screen w-[90%] fixed border border-green-200 bg-green-700 z-40 top-0 ${showCart ? "left-0" : "left-[-100%]"} rounded-r-[50px] transition-all duration-1000 ease-in-out p-4`}>
          <div onClick={() => { setshowCart(!showCart) }} className="close absolute top-3 right-4">
            <img src="/homepage/cancel-circle-stroke-rounded (1).svg" alt="" />
          </div>
          <>
            <div className='text-center my-6'>
              <h1 className="text-white text-2xl font-bold">Add new address</h1>
            </div>
            <div className="form p-4 mt-14">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
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
                        <FormControl>
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
                        <FormControl>
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
                          <FormControl>
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
                          <FormControl>
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
                          <FormControl>
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
                          <FormControl>
                            <div className="relative z-0 w-full mb-5 group">
                              <input {...field} type="text" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
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
                        <FormControl>
                          <div className="relative z-0 w-full mt-3 mb-5 group">
                            <textarea {...field} type="time" className="block py-2.5 px-0 w-full text-sm text-white bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-green-300 focus:outline-none focus:ring-0 focus:border-white peer" placeholder=" " required />
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
        </div> */}
    </>
  )
}

export default page