"use client"
import React, { useState, useEffect, useCallback } from 'react';

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
    <div className="bg-yellow-100 min-h-screen flex flex-col justify-center items-center">
      <div className="bg-yellow-300 text-center relative rounded-lg p-6 max-w-md h-screen w-full flex justify-center flex-col shadow-lg">
        <div className='flex relative items-center justify-center'>
          <div className='relative w-fit '>
            <img src="/paymentlogos/Vector (1).svg" alt="" />
            <img className='absolute top-[49px] left-[40px]' src="/paymentlogos/Ellipse 165.svg" alt="" />
          </div>
        </div>
        <div className='w-[260px] mx-auto flex flex-col gap-3'>
          <h1 className="text-3xl font-bold text-green-700 mb-4">¡Order Confirmed!</h1>
          <p className="text-green-700 text-lg font-semibold">Your order has been placed successfully</p>
          <p className="text-green-700 mt-2 font-semibold">{order ? `Delivery ${order.date}, ${order.deliveryTime}` : ""}</p>
          <button className="mt-6 text-red-500 hover:text-red-600">
            Track my order
          </button>
        </div>

        <p className="text-green-500 text-sm self-end absolute  bottom-[107px] left-[15px] font-semibold">
          If you have any questions, please reach out directly to our customer support
        </p>
      </div>
    </div>
  );
}

export default OrderConfirmation;
