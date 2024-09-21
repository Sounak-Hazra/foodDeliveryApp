"use client"
import { set } from 'date-fns' // renamed to avoid conflict
import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from 'flowbite-react'
import Sidebar from '@/app/components/Sidebar'
import { useToast } from '@/hooks/use-toast'
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Loader2 } from 'lucide-react'


const page = () => {
    const { toast } = useToast();

    const [date, setdate] = useState(() => new Date().toISOString().split('T')[0]);
    const [orders, setorders] = useState([]);
    const [orderstate, setorderstate] = useState("created");
    const [iscancled, setiscancled] = useState(false);
    const [totalcancled, settotalcancled] = useState([])
    const [deliveryboys, setdeliveryboys] = useState([]);
    const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
    const [deleveryboy, setdeleveryboy] = useState("all");
    const [totalsale, settotalsale] = useState(0);
    const [selectboy, setselectboy] = useState("");
    const [totalCancle, settotalCancle] = useState(0)
    const [totalordered, settotalordered] = useState(0)

    const getdeliveryboys = useCallback(async () => {

        try {
            const res = await fetch('/api/gtedeliveryboys');
            const data = await res.json();
            setdeliveryboys(data.success ? data.value : []);
        } catch (error) {
            console.log(error);
        }
    }, [date]);

    const fetchHistory = useCallback(async () => {
        const loadingToast = toast({
            title: (
                <div className="flex items-center">
                    <Loader2
                        size={24}
                        color="#000000"
                        className="mr-2 animate-spin"
                    />
                    Fetching order history please wait...
                </div>
            ),
            description: 'Fetching order history...',
            type: 'loading',
            duration: Infinity
        });

        try {
            const res = await fetch('/api/orderhistory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: date, successfull: orderstate, cancled: iscancled })
            });
            const data = await res.json();
            setorders(data.success ? data.orders : []);
            console.log(data.orders);
        } catch (error) {
            console.log(error);
        } finally {
            toast({
                id: loadingToast.id,
                title: 'Order History',
                description: 'Fetched successfully!',
                type: 'success',
                duration: 3000
            });
        }
    }, [date, orderstate]);
    const fetchtotalcancled = useCallback(async () => {
        try {
            const res = await fetch('/api/orderhistory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: date, successfull: "cancled", cancled: iscancled })
            });
            console.log("this is cancled orders");
            const data = await res.json();
            settotalcancled(data.success ? data.orders : []);
            console.log(data.orders);
        } catch (error) {
            console.log(error);
        } 
    }, [date, orderstate]);

    const cancleorder = async (order) => {
        const loadingToast = toast({
            title: (
                <div className="flex items-center">
                    <Loader2
                        size={24}
                        color="#000000"
                        className="mr-2 animate-spin"
                    />
                    Cancling Order Please wait...
                </div>
            ),
            description: 'Processing...',
            type: 'loading',
            duration: Infinity
        });

        try {
            const res = await fetch('/api/cancleorder', {
                method: 'POST',
                body: JSON.stringify({ id: order._id })
            });
            const data = await res.json();
            fetchHistory();
            toast({
                id: loadingToast.id,
                title: 'Order Cancelled',
                description: data.success ? 'Cancelled successfully!' : 'Cancellation failed!',
                type: data.success ? 'success' : 'error',
                duration: 3000
            });
        } catch (error) {
            toast({
                id: loadingToast.id,
                title: 'Order Cancelled',
                description: 'Cancellation failed!',
                type: 'error',
                duration: 3000
            });
        }
    };

    const handleSelectChange = async (event, order) => {
        const loadingToast = toast({
            title: (
                <div className="flex items-center">
                    <Loader2
                        size={24}
                        color="#000000"
                        className="mr-2 animate-spin"
                    />
                    Assigning deleveryboy
                </div>
            ),
            description: 'Processing...',
            type: 'loading',
            duration: Infinity
        });

        try {
            const res = await fetch('/api/asingorder', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: event, orderid: order._id })
            });
            const data = await res.json();
            setSelectedDeliveryBoy(event);
            toast({
                id: loadingToast.id,
                title: 'Delivery',
                description: data.success ? 'Assigned successfully!' : 'Assignment failed!',
                type: data.success ? 'success' : 'error',
                duration: 3000
            });
        } catch (error) {
            toast({
                id: loadingToast.id,
                title: 'Delivery',
                description: 'Assignment failed!',
                type: 'error',
                duration: 3000
            });
        } finally {
            fetchHistory();
        }
    };

    const accapet = async (order) => {
        const loadingToast = toast({
            title: (
                <div className="flex items-center">
                    <Loader2
                        size={24}
                        color="#000000"
                        className="mr-2 animate-spin"
                    />
                    Accepting order please wait...
                </div>
            ),
            description: 'Processing...',
            type: 'loading',
            duration: Infinity
        });

        try {
            const res = await fetch('/api/accapetorder', {
                method: 'POST',
                body: JSON.stringify({ orderid: order._id })
            });
            const data = await res.json();
            toast({
                id: loadingToast.id,
                title: 'Order',
                description: data.success ? 'Placed successfully!' : 'Placement failed!',
                type: data.success ? 'success' : 'error',
                duration: 3000
            });
        } catch (error) {
            toast({
                id: loadingToast.id,
                title: 'Order',
                description: 'Placement failed!',
                type: 'error',
                duration: 3000
            });
        } finally {
            fetchHistory();
        }
    };

    const calculatetotalsuccessfullorder = () => {
        let total = 0;
        let tcancled = 0;
        orders.map((order) => {
            if (orderstate === "successfull" && deleveryboy !== "all" && deleveryboy === order.deleveryboy) {
                total++;
            }
            else if (orderstate === "successfull" && deleveryboy === "all" ) {
                total++
            }
            
        })
        settotalordered(total);
        console.log(totalcancled)
        totalcancled.map((order) => {
            if (deleveryboy !== "all" && deleveryboy === order.deleveryboy) {
                tcancled++;
            }
            else if (deleveryboy === "all") {
                tcancled++
            }
        })
        settotalCancle(tcancled);
        console.log(tcancled);
        console.log(total);

    }

    useEffect(() => {
        calculatetotalsuccessfullorder()
        console.log(deleveryboy)
    }, [settotalcancled,settotalCancle, totalcancled, totalordered, orders, orderstate, deleveryboy])
    

    // useEffect hooks as it is
    useEffect(() => {
        fetchHistory();
        getdeliveryboys();
        fetchtotalcancled()
    }, [date, fetchHistory, setorders, orderstate, selectboy]);

    const datechange = (newDate) => {
        const d = newDate;
        setdate(d);
    };

    const seteOrderstate = (e) => {
        const d = e.target.value;
        setorderstate(d);
    };

    const calculateTotalSale = () => {
        let saleTotal = 0;
        if (deleveryboy === "all") {
            orders.map((order) => {
                saleTotal += order.price;
            });
        } else {
            orders.forEach((order) => {
                if (order.deleveryboy === deleveryboy) {
                    saleTotal += order.price;
                }
            });
        }

        settotalsale(saleTotal);
    };

    useEffect(() => {
        calculateTotalSale();
        calculatetotalsuccessfullorder()
    }, [orderstate, deleveryboy, orders]);

    const changeselectvalue = (e) => {
        setselectboy(e);
    };


    return (
        <>
            <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-300">
                {/* Navbar */}
                <nav className="bg-gradient-to-r from-blue-600 to-indigo-600 p-4 shadow-lg">
                    <div className="container mx-auto flex justify-between items-center">
                        <h1 className="text-white text-3xl font-extrabold hidden md:inline-block tracking-wide">
                            <Link href={"/admin"}>Delivery Tracker</Link>
                        </h1>
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center">
                                {/* <label htmlFor="delivery-time" className="text-white mr-2 text-lg">Select Date:</label> */}
                                <input
                                    type="date"
                                    id="delivery-time"
                                    value={date}
                                    className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => datechange(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center">
                                {/* <label htmlFor="selectstate" className="text-white text-lg">Select State:</label> */}
                                <select
                                    id="selectstate"
                                    className="rounded-md border border-gray-300 px-3 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => { seteOrderstate(e); setdeleveryboy("all"); setdate(() => new Date().toISOString().split('T')[0])}}
                                >
                                    <option value="created">Created</option>
                                    <option value="placed">Placed</option>
                                    <option value="accapted">Accapted</option>
                                    <option value="assigned">Assigned</option>
                                    <option value="cancled">Cancled</option>
                                    <option value="successfull">Successfull</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Content Section */}
                <div>
                    <div className="container mx-auto p-5">
                        {orderstate === "successfull" && (
                            <section className="p-4 bg-white shadow-md rounded-lg mb-6 flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-blue-700">Total Sale: ₹{totalsale}</h2>
                                <select
                                    onChange={(e) => setdeleveryboy(e.target.value)}
                                    className="w-48 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                >
                                    <option value="" disabled>
                                        --Select--
                                    </option>
                                    <option key={"all"} value={"all"}>
                                        All
                                    </option>
                                    {deliveryboys.map((boy) => (
                                        <option key={boy.id} value={boy.name}>
                                            {boy.username}
                                        </option>
                                    ))}
                                </select>


                                <div>
                                    <h2 className="text-2xl font-bold text-blue-700">Total Orders {"delivered by" + deleveryboy ? deleveryboy : ""} : {totalordered}</h2>
                                    <h2 className="text-2xl font-bold text-red-700">Total Cancled {"delivered by" + deleveryboy ? deleveryboy : ""}: {totalCancle}</h2>
                                </div>
                            </section>
                        )}

                        {orderstate === "cancled" && (
                            <section className="p-4 bg-white shadow-md rounded-lg mb-6 flex items-center gap-4">
                                <h2 className="text-2xl font-bold text-red-600">Delivery Boy:</h2>
                                <select
                                    onChange={(e) => setdeleveryboy(e.target.value)}
                                    className="w-48 p-2 border-2 border-red-500 rounded-md focus:border-red-700 focus:outline-none bg-gray-50 text-gray-700"
                                >
                                    <option value="" disabled>
                                        --Select--
                                    </option>
                                    <option key={"all"} value={"all"}>
                                        All
                                    </option>
                                    {deliveryboys.map((boy) => (
                                        <option key={boy.id} value={boy.name}>
                                            {boy.username}
                                        </option>
                                    ))}
                                </select>
                            </section>
                        )}

                        {/* Cards Section */}
                        <section className=" mygridadmin gap-4">
                            {orders.map((order, index) => {
                                return (
                                    <>
                                        {(orderstate === "successfull" && deleveryboy === "all") && (

                                            <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                                <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                                <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                                <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                                <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                                <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                                <p className="text-gray-600"><strong>Pincode:</strong> {order.pincode}</p>
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>Delevery by:</strong> {order.deleveryboy}</p>
                                                <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                                                <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>

                                                {/* Display Items */}
                                                <div className="mt-3 h-28 overflow-y-auto">
                                                    <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {order.product.map((item, i) => (
                                                            <li key={i}>
                                                                <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                        )}
                                        {(orderstate === "successfull" && deleveryboy !== "all" && deleveryboy === order.deleveryboy) && (

                                            <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                                <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                                <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                                <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                                <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                                <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                                <p className="text-gray-600"><strong>Pincode:</strong> {order.pincode}</p>
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>Delevery by:</strong> {order.deleveryboy}</p>
                                                <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                                                <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>
                                                {/* Display Items */}
                                                <div className="mt-3 h-28 overflow-y-auto">
                                                    <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {order.product.map((item, i) => (
                                                            <li key={i}>
                                                                <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                        )}
                                        {(orderstate === "cancled" && deleveryboy === "all") && (

                                            <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                                <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                                <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                                <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                                <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                                <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                                <p className="text-gray-600"><strong>Pincode:</strong> {order.pincode}</p>
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>cancled by:</strong> {order.deleveryboy}</p>
                                                <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                                                <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>

                                                {/* Display Items */}
                                                <div className="mt-3 h-28 overflow-y-auto">
                                                    <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {order.product.map((item, i) => (
                                                            <li key={i}>
                                                                <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                        )}
                                        {(orderstate === "cancled" && deleveryboy !== "all" && deleveryboy === order.deleveryboy) && (

                                            <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                                <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                                <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                                <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                                <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                                <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                                <p className="text-gray-600"><strong>Pincode:</strong> {order.pincode}</p>
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>cancled by:</strong> {order.deleveryboy}</p>
                                                <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                                                <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>

                                                {/* Display Items */}
                                                <div className="mt-3 h-28 overflow-y-auto">
                                                    <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {order.product.map((item, i) => (
                                                            <li key={i}>
                                                                <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>

                                        )}
                                        {(orderstate !== "cancled" && orderstate !== "successfull") && (

                                            <div key={index} className="card bg-white shadow-xl rounded-lg p-4 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
                                                <h2 className="text-xl font-bold text-gray-700 mb-2">Name: {order.name}</h2>
                                                <h2 className="text-base text-gray-600">ID: {order._id}</h2>
                                                <p className="text-gray-600"><strong>Full Address:</strong> {order.address}</p>
                                                <p className="text-gray-600"><strong>City:</strong> {order.city}</p>
                                                <p className="text-gray-600"><strong>Landmark:</strong> {order.landmark}</p>
                                                <p className="text-gray-600"><strong>Pincode:</strong> {order.pincode}</p>
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                                                <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>

                                                {order.successfull === "placed" && (
                                                    <button className="mt-3 mr-2 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700" onClick={() => accapet(order)}>
                                                        Accept Order
                                                    </button>
                                                )}
                                                {order.successfull === "created" || order.successfull === "placed" && (
                                                    <button className="mt-3 ml-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700" onClick={() => cancleorder(order)}>
                                                        Cancel Order
                                                    </button>
                                                )}

                                                {order.successfull === "accapted" && (
                                                    <div className="flex flex-col items-start mt-3 space-y-3">
                                                        <label className="text-lg font-semibold text-gray-700">Select Delivery Boy:</label>
                                                        <select
                                                            onChange={(e) => changeselectvalue(e.target.value)}
                                                            className="w-48 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                                        >
                                                            <option value="" disabled>--Select--</option>
                                                            {deliveryboys.map((boy) => (
                                                                <option key={boy.name} value={boy.username}>{boy.username}</option>
                                                            ))}
                                                        </select>

                                                        <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700" onClick={() => handleSelectChange(selectboy, order)}>
                                                            Assign Delivery Boy
                                                        </button>

                                                        {selectedDeliveryBoy && (
                                                            <p className="mt-2 text-blue-600 font-medium">Selected Delivery Boy: {selectedDeliveryBoy}</p>
                                                        )}
                                                    </div>
                                                )}



                                                {order.successfull === "assigned" && (
                                                    <p className="text-gray-600 mt-3"><strong>Delivery By:</strong> {order.deleveryboy}</p>
                                                )}

                                                {/* Display Items */}
                                                <div className="mt-3 h-28 overflow-y-auto">
                                                    <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        {order.product.map((item, i) => (
                                                            <li key={i}>
                                                                <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                );
                            })}
                        </section>

                    </div>
                </div>
            </div>
        </>



    )
}

export default page;
