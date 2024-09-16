"use client"
import { set } from 'date-fns' // renamed to avoid conflict
import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from 'flowbite-react'
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
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-blue-600 p-4 flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold"><Link href={"/admin"}>Delivery Tracker</Link></h1>
                    <div className="flex items-center flex-col gap-2 md:flex-row sm:flex-row">
                        <label htmlFor="delivery-time" className="text-white mr-2">Select Date:</label>
                        <input
                            type="date"
                            id="delivery-time"
                            className="rounded-md border border-gray-300 px-2 py-1"
                            onChange={(e) => { datechange(e.target.value) }} // onChange updates the date state
                        />
                        <label htmlFor="selectstate">Select state</label>
                        <select id="selectstate" className="rounded-md border border-gray-300 px-2 py-1 ml-2" onChange={(e) => { seteOrderstate(e) }}>
                            <option value="created">Created</option>
                            <option value="placed">Placed</option>
                            <option value="accapted">Accapted</option>
                            <option value="assigned">Assigned order</option>
                            <option value="cancled">Cancled order</option>
                            <option value="successfull">Successfull</option>
                        </select>
                    </div>
                </nav>

                {
                    orderstate === "successfull" &&
                    <section className="p-6 flex w-full gap-2">
                        <h2 className="text-xl font-semibold">Total Sale: ₹{totalsale}</h2>
                        <select
                            onChange={(e) => setdeleveryboy(e.target.value)}
                            className="w-64 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
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
                }
                {
                    orderstate === "cancled" &&
                    <section className="p-6 flex w-full gap-2">
                        <h2 className="text-xl font-semibold">Delevery Boy :</h2>
                        <select
                            onChange={(e) => setdeleveryboy(e.target.value)}
                            className="w-64 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
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
                }

                {/* Card Section */}
                <section className="p-6 mysectionGrid">
                    {orders.map((order, index) => (
                        (!orderstate == "successfull" || deleveryboy === "all") ?
                            (!orderstate == "cancled" || deleveryboy === "all") ?
                                <div key={index} className="card bg-white shadow-md rounded-lg p-4">
                                    <h2 className="text-xl font-semibold mb-2">Name: {order.name}</h2>
                                    <h2 className="text-xl font-semibold mb-2">ID: {order._id}</h2>
                                    <p><strong>Full address:</strong> {order.address}</p>
                                    <p><strong>City:</strong> {order.city}</p>
                                    <p><strong>Landmark:</strong> {order.landmark}</p>
                                    <p><strong>Mobile number:</strong> {order.mobile}</p>
                                    <p><strong>Payment type:</strong> {order.paymentType}</p>
                                    <p><strong>Price:</strong> {order.price}</p>
                                    <p><strong>Time:</strong> {order.deliveryTime}</p>
                                    <p><strong>Date:</strong> {order.date}</p>
                                    <p><strong>Status:</strong> {order.successfull}</p>
                                    {order.successfull === "placed" && <Button className='my-2 text-black' onClick={() => { accapet(order) }}>Accapet order</Button>}
                                    {order.successfull === "accapted" &&
                                        <div className="flex flex-col items-start p-4 space-y-4">
                                            <label className="text-lg font-semibold text-gray-700">Select Delivery Boy:</label>
                                            {/* <select
                                                className="w-64 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                            >
                                                <option value="" disabled>
                                                    --Select--
                                                </option>
                                                {deliveryboys.map((boy) => (
                                                    <option onClick={() => { setselectboy(boy.name) }} key={boy.id} value={boy.name}>
                                                        {boy.username}
                                                    </option>
                                                ))}
                                            </select> */}
                                            {
                                                <Select onValueChange={(e) => { changeselectvalue(e) }}>
                                                    <SelectTrigger className="w-[180px]">
                                                        <SelectValue placeholder="Select a fruit" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectGroup>
                                                            <SelectLabel>Fruits</SelectLabel>
                                                            {deliveryboys.map((boy) => (
                                                                <SelectItem key={boy.name} value={boy.username}>{boy.username}</SelectItem>))}
                                                        </SelectGroup>
                                                    </SelectContent>
                                                </Select>
                                            }

                                            {
                                                <button onClick={() => handleSelectChange(selectboy, order)}>Assing delevery boy</button>
                                            }

                                            {selectedDeliveryBoy && (
                                                <p className="mt-2 text-blue-600 font-medium">
                                                    Selected Delivery Boy: {selectedDeliveryBoy}
                                                </p>
                                            )}
                                        </div>}
                                    {order.successfull === "created" || order.successfull === "placed" && <Button className='text-black' onClick={() => { cancleorder(order) }}>Cancle order</Button>}
                                    {order.successfull === "assigned" && <p><strong>Delevery By</strong> {order.deleveryboy}</p>}
                                    {/* Display Items */}
                                    <div className="mt-4 h-32 overflow-y-auto">
                                        <h3 className="font-semibold text-lg">Items:</h3>
                                        <ul className="list-disc pl-5">
                                            {order.product.map((item, i) => (
                                                <li key={i} className="mt-2">
                                                    <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div> :
                                <>
                                    {order.deleveryboy == deleveryboy && <div key={index} className="card bg-white shadow-md rounded-lg p-4">
                                        <h2 className="text-xl font-semibold mb-2">Name: {order.name}</h2>
                                        <h2 className="text-xl font-semibold mb-2">ID: {order._id}</h2>
                                        <p><strong>Full address:</strong> {order.address}</p>
                                        <p><strong>City:</strong> {order.city}</p>
                                        <p><strong>Landmark:</strong> {order.landmark}</p>
                                        <p><strong>Mobile number:</strong> {order.mobile}</p>
                                        <p><strong>Payment type:</strong> {order.paymentType}</p>
                                        <p><strong>Price:</strong> {order.price}</p>
                                        <p><strong>Time:</strong> {order.deliveryTime}</p>
                                        <p><strong>Date:</strong> {order.date}</p>
                                        <p><strong>Status:</strong> {order.successfull}</p>
                                        {order.successfull === "placed" && <Button className='my-2 text-black' onClick={() => { accapet(order) }}>Accapet order</Button>}
                                        {order.successfull === "accapted" &&
                                            <div className="flex flex-col items-start p-4 space-y-4">
                                                <label className="text-lg font-semibold text-gray-700">Select Delivery Boy:</label>
                                                <select
                                                    value={selectedValue} // controlled component to ensure the value changes
                                                    onChange={(e) => handleSelectChange(e, order)}
                                                    className="w-64 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                                >
                                                    <option value="">--Select--</option>
                                                    {deliveryboys.map((boy) => (
                                                        <option key={boy.id} value={boy.name}>
                                                            {boy.username}
                                                        </option>
                                                    ))}
                                                </select>

                                                {selectedDeliveryBoy && (
                                                    <p className="mt-2 text-blue-600 font-medium">
                                                        Selected Delivery Boy: {selectedDeliveryBoy}
                                                    </p>
                                                )}
                                            </div>}
                                        {order.successfull === "created" || order.successfull === "placed" && <Button className='text-black' onClick={() => { cancleorder(order) }}>Cancle order</Button>}
                                        {order.successfull === "assigned" && <p><strong>Delevery By</strong> {order.deleveryboy}</p>}
                                        {/* Display Items */}
                                        <div className="mt-4 h-32 overflow-y-auto">
                                            <h3 className="font-semibold text-lg">Items:</h3>
                                            <ul className="list-disc pl-5">
                                                {order.product.map((item, i) => (
                                                    <li key={i} className="mt-2">
                                                        <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>}
                                </>
                            :
                            <>
                                {order.deleveryboy == deleveryboy && <div key={index} className="card bg-white shadow-md rounded-lg p-4">
                                    <h2 className="text-xl font-semibold mb-2">Name: {order.name}</h2>
                                    <h2 className="text-xl font-semibold mb-2">ID: {order._id}</h2>
                                    <p><strong>Full address:</strong> {order.address}</p>
                                    <p><strong>City:</strong> {order.city}</p>
                                    <p><strong>Landmark:</strong> {order.landmark}</p>
                                    <p><strong>Mobile number:</strong> {order.mobile}</p>
                                    <p><strong>Payment type:</strong> {order.paymentType}</p>
                                    <p><strong>Price:</strong> {order.price}</p>
                                    <p><strong>Time:</strong> {order.deliveryTime}</p>
                                    <p><strong>Date:</strong> {order.date}</p>
                                    <p><strong>Status:</strong> {order.successfull}</p>
                                    {order.successfull === "placed" && <Button className='my-2 text-black' onClick={() => { accapet(order) }}>Accapet order</Button>}
                                    {order.successfull === "accapted" &&
                                        <div className="flex flex-col items-start p-4 space-y-4">
                                            <label className="text-lg font-semibold text-gray-700">Select Delivery Boy:</label>
                                            <select
                                                onChange={(e) => handleSelectChange(e, order)}
                                                className="w-64 p-2 border-2 border-blue-500 rounded-md focus:border-blue-700 focus:outline-none bg-gray-50 text-gray-700"
                                            >
                                                <option value="" disabled>
                                                    --Select--
                                                </option>
                                                {deliveryboys.map((boy) => (
                                                    <option key={boy.id} value={boy.name}>
                                                        {boy.username}
                                                    </option>
                                                ))}
                                            </select>
                                            {/* <Select onOpenChange={(e)=>{changeselectvalue(e)}}>
                                                <SelectTrigger className="w-[180px]">
                                                    <SelectValue placeholder="Select a fruit" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectGroup>
                                                        <SelectLabel>Fruits</SelectLabel>
                                                        {deliveryboys.map((boy) => (
                                                            <SelectItem key={boy.name} value={boy.name}>Apple</SelectItem>))}
                                                    </SelectGroup>
                                                </SelectContent>
                                            </Select> */}

                                            {selectedDeliveryBoy && (
                                                <p className="mt-2 text-blue-600 font-medium">
                                                    Selected Delivery Boy: {selectedDeliveryBoy}
                                                </p>
                                            )}
                                        </div>}
                                    {order.successfull === "created" || order.successfull === "placed" && <Button className='text-black' onClick={() => { cancleorder(order) }}>Cancle order</Button>}
                                    {order.successfull === "assigned" && <p><strong>Delevery By</strong> {order.deleveryboy}</p>}
                                    {/* Display Items */}
                                    <div className="mt-4 h-32 overflow-y-auto">
                                        <h3 className="font-semibold text-lg">Items:</h3>
                                        <ul className="list-disc pl-5">
                                            {order.product.map((item, i) => (
                                                <li key={i} className="mt-2">
                                                    <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ₹{item.price}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>}
                            </>
                    ))}
                </section>
            </div>
        </>
    )
}

export default page;
