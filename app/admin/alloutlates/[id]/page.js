"use client"
import { set } from 'date-fns' // renamed to avoid conflict
import React, { useCallback, useState, useEffect } from 'react'
import Link from 'next/link'

const page = ({params}) => {
    const [date, setdate] = useState(() => new Date().toISOString().split('T')[0])
    const [orders, setorders] = useState([])


    const fetchHistory = useCallback(async () => {
        try {
            const res = await fetch('/api/orderhistoryOutlates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date: date, deleveredby: params.id })
            })
            const data = await res.json()
            console.log(data)
            if (data.success) {
                setorders(data.orders)
            } else {
                setorders([])
                console.log(data.message)
            }
        } catch (error) {
            console.log(error)
        }
    }, [date]) // make sure date is included in the dependency array

    // Correct usage of useEffect
    useEffect(() => {
        fetchHistory()
    }, [date, fetchHistory]) // re-run fetchHistory when the date changes

    const datechange = (newDate) => {
        console.log(newDate)
        const d = newDate
        setdate(d) // use setdate (React state) instead of setDate from date-fns
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-blue-600 p-4 flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold"><Link href={"/admin"}>Delivery Tracker</Link></h1>
                    <div className="flex items-center">
                        <label htmlFor="delivery-time" className="text-white mr-2">Select Date:</label>
                        <input
                            type="date"
                            id="delivery-time"
                            className="rounded-md border border-gray-300 px-2 py-1"
                            onChange={(e) => { datechange(e.target.value) }} // onChange updates the date state
                        />
                    </div>
                </nav>

                {/* Card Section */}
                <section className="p-6 mysectionGrid">
                    {orders.map((order, index) => (
                        <div key={index} className="card bg-white shadow-md rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">Name: {order.name}</h2>
                            <h2 className="text-xl font-semibold mb-2">ID: {order._id}</h2>
                            <p><strong>Full address:</strong> {order.address}</p>
                            <p><strong>City:</strong> {order.city}</p>
                            <p><strong>Landmark:</strong> {order.landmark}</p>
                            <p><strong>Mobile number:</strong> {order.mobile}</p>
                            <p><strong>Payment type:</strong> {order.paymentType}</p>
                            <p><strong>Price:</strong> {order.price}</p>
                            <p><strong>Status:</strong> {order.successfull}</p>
                            {/* Display Items */}
                            <div className="mt-4 h-32 overflow-y-auto">
                                <h3 className="font-semibold text-lg">Items:</h3>
                                <ul className="list-disc pl-5">
                                    {order.product.map((item, i) => (
                                        <li key={i} className="mt-2">
                                            <strong>{item.name}</strong> - Quantity: {item.quantity}, Price: ${item.price}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </section>
            </div>
        </>
    )
}

export default page;
