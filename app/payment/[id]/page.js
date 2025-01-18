"use client"
import React from 'react'
import { Separator } from '@/components/ui/separator'
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { useState, useCallback, useEffect } from "react"
import Showloading from '@/app/components/Showloading'



const page = ({ params }) => {
  const [order, setorder] = useState({ product: [] })
  const [deliverytime, setdeliverytime] = useState("")
  const router = useRouter()
  const [selectedMethod, setSelectedMethod] = useState('');
  const [od, setod] = useState('')
  const [isSubmitting, setisSubmitting] = useState(false)


  const handleSelection = (method) => {
    setSelectedMethod(method);
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
    try {
      setisSubmitting(true)
      const res = await fetch('/api/getorder', {
        method: 'POST',
        body: JSON.stringify({ orderid: params.id })
      })
      const data = await res.json()
      const od = data.order
      setorder(od)
    }
    catch {
      toast({
        title:"Somrthing went wrong"
      })
    }
    finally {
      setisSubmitting(false)
    }
    
  }, [])


  const place = async () => {

    try {
      setisSubmitting(true)
      const response = await fetch("/api/finalplaceorder", {
        method: "POST",
        body: JSON.stringify({ orderid: params.id }),
      });
      const finalres = await response.json();

      if (finalres.success) {
        router.push("/ordersuccess/" + params.id);
        // console.log(order)
        // let i = ""
        // order.product.map((product, index) => {
        //    i = i + product.name + " " + product.quantity + " items"
        // })
        // const payload = {
        //   "apiKey": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2ZDJhYWFmZWE3ZGU3MGI5ODJhNmYyNCIsIm5hbWUiOiJJbW1pIENvbm5lY3QiLCJhcHBOYW1lIjoiQWlTZW5zeSIsImNsaWVudElkIjoiNjZkMmFhYWZlYTdkZTcwYjk4MmE2ZjE0IiwiYWN0aXZlUGxhbiI6IkJBU0lDX01PTlRITFkiLCJpYXQiOjE3MjUwODIyODd9.AeaDdvHIU7kaUZchAA9f3_bnPlAdOlE9E3cMgrc5QR8",
        //   "campaignName": "Order_confirmed",
        //   "destination": order.mobile,
        //   "userName": "Immi Connect",
        //   "templateParams": [
        //     `${order.name}`,
        //     `${i}`,
        //     `${order.price}₹`,
        //   ],  // Your custom message
        //   "source": "new-landing-page form",
        //   "media": {
        //     "url": "https://whatsapp-media-library.s3.ap-south-1.amazonaws.com/VIDEO/6353da2e153a147b991dd812/3837837_11096001080p4k1280x720.mp4",
        //     "filename": "sample_media"
        //   },
        //   "buttons": [],
        //   "carouselCards": [],
        //   "location": {},
        //   "paramsFallbackValue": {
        //     "FirstName": "user"
        //   }
        // };

        // const res = await fetch('https://backend.aisensy.com/campaign/t1/api/v2', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json'
        //   },
        //   body: JSON.stringify(payload)
        // });
        // console.log(res)

        // const data = await res.json();
      }

      if (!finalres.success) {
        toast({
          title: "Error",
          description: finalres.message,
          variant: "destructive", 
          className: "bg-white text-black", 
        });
      }
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive", 
        className: "bg-white text-black",
      });
    }
    finally {
      setisSubmitting(false)
    }
  };

  useEffect(() => {
    fetchOrder()


  }, [fetchOrder, setod])
  return (
    <>
      {isSubmitting && <Showloading /> }
      <div className='min-h-screen md:mx-[25vw] relative md:border md:border-x-2 md:border-green-700'>
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


       

      </div>
         <div className='w-full h-16 flex justify-center bg-white absolute left-0 bottom-0'>
          <button onClick={() => place()} className='w-[193px] h-[48px] py-[20px] px-[40px] flex items-center justify-center bg-green-700 text-white rounded-[52px] text-[18px] font-[500]'>
            <span>Place Order</span>
          </button>
        </div>
        </div>
    </>
  )
}

export default page