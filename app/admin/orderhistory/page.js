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


const page = () => {
    const [date, setdate] = useState(() => new Date().toISOString().split('T')[0])
    const [orders, setorders] = useState([])
    const [orderstate, setorderstate] = useState("created")
    const [iscancled, setiscancled] = useState(false)
    const [deliveryboys, setdeliveryboys] = useState([])
    const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');
    const [deleveryboy, setdeleveryboy] = useState("all")
    const [totalsale, settotalsale] = useState(0)
    const [selectboy, setselectboy] = useState("")



    const { toast } = useToast()


    const getdeliveryboys = useCallback(async () => {
        try {
            const res = await fetch('/api/gtedeliveryboys')
            const data = await res.json()
            if (data.success) {
                const value = data.value
                setdeliveryboys(value)
            } else {
                setdeliveryboys([])
            }
        } catch (error) {
            console.log(error)
        }
    }, [date]) // make sure date is included in the dependency array

    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/orderhistory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date: date, successfull: orderstate, cancled: iscancled })
            })
            const data = await res.json()
            if (data.success) {
                setorders(data.orders)
            } else {
                setorders([])
            }
        } catch (error) {
            console.log(error)
        }
    }, [date, orderstate]) // make sure date is included in the dependency array

    const cancleorder = async (order) => {
        try {
            const res = await fetch('/api/cancleorder', {
                method: 'POST',
                body: JSON.stringify({ id: order._id })
            })
            const data = await res.json()
            if (data.success) {
                fetchHistory()
                toast({
                    title: 'Order cancle',
                    message: 'Order cancle successfully',
                    type: 'success'
                })
            } else {
                toast({
                    title: 'Order cancle',
                    message: 'Order cancle failed',
                    type: 'error'
                })
            }
        } catch (error) {
            toast({
                title: 'Order cancle',
                message: 'Order cancle failed',
                type: 'error'
            })
        }
    }

    const handleSelectChange = async (event, order) => {
        console.log(event)
        try {
            const res = await fetch('/api/asingorder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: event, orderid: order._id })
            })
            const data = await res.json()
            console.log(data)
            if (data.success) {
                setSelectedDeliveryBoy(event)
                toast({
                    title: 'Delivery',
                    description: 'Delivery assigned successfully',
                    type: 'success'
                })
            } else {
                toast({
                    title: 'Delivery',
                    description: 'Delivery assigned failed',
                    type: 'error'
                })
            }


        } catch (error) {
            console.log(error)
            toast({
                title: 'Delivery',
                description: 'Delivery assigned failed',
                type: 'error'
            })
        } finally {
            fetchHistory()
        }
    };

    // Correct usage of useEffect
    useEffect(() => {
        console.log('fetching history')
        console.log(selectboy)
        fetchHistory()
        getdeliveryboys()
    }, [date, fetchHistory, setorders, orderstate, selectboy]) // re-run fetchHistory when the date changes

    const datechange = (newDate) => {
        const d = newDate
        setdate(d) // use setdate (React state) instead of setDate from date-fns
    }
    const seteOrderstate = (e) => {

        const d = e.target.value
        setorderstate(d)
    }

    const calculateTotalSale = () => {

        let saleTotal = 0; // Temporary variable to hold the total
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

        settotalsale(saleTotal); // Update state with the final total
    };

    useEffect(() => {
        calculateTotalSale();
    }, [orderstate, deleveryboy, orders]);

    const accapet = async (order) => {
        try {
            const res = await fetch('/api/accapetorder', {
                method: 'POST',
                body: JSON.stringify({ orderid: order._id })
            })
            const data = await res.json()
            if (data.success) {

                toast({
                    title: 'Order placed',
                    message: 'Order placed successfully',
                    type: 'success'
                })
            } else {
                toast({
                    title: 'Order placed',
                    message: 'Order placed failed',
                    type: 'error'
                })
            }
        } catch (error) {
            console.log(error)
            toast({
                title: 'Order placed',
                message: 'Order placed failed',
                type: 'error'
            })
        } finally {
            fetchHistory()
        }
    }

    const changeselectvalue = (e) => {
        console.log(e)
        setselectboy(e)
    }

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
                                    className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => datechange(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center">
                                {/* <label htmlFor="selectstate" className="text-white text-lg">Select State:</label> */}
                                <select
                                    id="selectstate"
                                    className="rounded-md border border-gray-300 px-3 py-2 ml-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                    onChange={(e) => seteOrderstate(e)}
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
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>Delevery by:</strong> {order.deleveryboy}</p>

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
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>Delevery by:</strong> {order.deleveryboy}</p>
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
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>cancled by:</strong> {order.deleveryboy}</p>

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
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>
                                                <p className="text-gray-600"><strong>cancled by:</strong> {order.deleveryboy}</p>

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
                                                <p className="text-gray-600"><strong>Mobile:</strong> {order.mobile}</p>
                                                <p className="text-gray-600"><strong>Payment Type:</strong> {order.paymentType}</p>
                                                <p className="text-gray-600"><strong>Price:</strong> ₹{order.price}</p>
                                                <p className="text-gray-600"><strong>Time:</strong> {order.deliveryTime}</p>
                                                <p className="text-gray-600"><strong>Date:</strong> {order.date}</p>
                                                <p className="text-gray-600"><strong>Status:</strong> {order.successfull}</p>

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
