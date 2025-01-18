"use client"
import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

function OrderConfirmation({ params }) {

  const [order, setorder] = useState({})

  const getorder = useCallback(async () => {
    try {
      const response = await fetch("/api/getorderdetails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderid: params.id }),
      });
      const data = await response.json();
      const od = data.order;
      setorder(od);
    } catch (error) {
      console.log(error);
    }
  }, [params.id]);

  useEffect(() => {
    getorder();
  }, [getorder]);


  return (
    <div className=" min-h-screen flex flex-col justify-center items-center">
      <div className=" text-center relative rounded-lg p-6 max-w-md h-screen w-full flex justify-center flex-col shadow-lg">
        <div className='flex relative items-center justify-center'>
          <div className='relative w-fit '>
            {/* <DotLottieReact
              src="https://lottie.host/embed/ba8a69f0-a49d-4343-83a3-dae80044b042/C1Su1nt46S.json "
              loop
              autoplay
            /> */}
            {/* <div id="container">
              <dotlottie-player src="https://lottie.host/ba8a69f0-a49d-4343-83a3-dae80044b042/C1Su1nt46S.json" background="transparent" speed="1" loop="" autoplay=""></dotlottie-player>
            </div> */}
            {/* <img src="/paymentlogos/Vector (1).svg" alt="" />
            <img className='absolute top-[49px] left-[40px]' src="/paymentlogos/Ellipse 165.svg" alt="" /> */}
            <iframe src="https://lottie.host/embed/ba8a69f0-a49d-4343-83a3-dae80044b042/C1Su1nt46S.json"></iframe>
          </div>
        </div>
        <div className='w-[260px] mx-auto flex flex-col gap-3'>
          <h1 className="text-3xl font-bold text-green-700 mb-4">¡Order Confirmed!</h1>
          <p className="text-green-700 text-lg font-semibold">Your order has been placed successfully</p>
          <p className="text-green-700 mt-2 font-semibold">{order ? `Delivery ${order.date}, ${order.deliveryTime}` : ""}</p>
          <p className="text-green-700 mt-2 font-semibold">Your order id : {order ? order._id : ""}</p>
          <Link href={"#"}>
            <button className="mt-6 text-red-500 underline hover:text-red-600">
              Track my order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderConfirmation;
