"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Page = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [orders, setOrders] = useState([]);

    const {toast} = useToast();

    const handleLogin = async (e) => {
        try {
            e.preventDefault();
            const res = await fetch('/api/deleveryboylogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: phoneNumber, password }),
            });
            const data = await res.json();
            console.log(data); // Debugging: Log the response

            if (data.success) {
                const od = data.value
                setOrders(od)
                const val = data.success;
                console.log(val); // Debugging: Log the value of val
                setIsLogin(val); // Update state to reflect successful login
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log(error); // Debugging: Log any errors
            alert('Something went wrong');
        }
    };

    const orderdelivered = async (order) => {
        try {
            const res = await fetch('/api/orderdone', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: phoneNumber, orderid: order._id }),
            });
            const data = await res.json();
            if (data.success) {
                toast({
                    title: 'Order Delivered',
                    message: data.message,
                    type: 'success',
                });
            }
            else {
                toast({
                    title: 'Error',
                    message: data.message,
                    type: 'error',
                });
            }
            
        } catch (error) {
            console.log(error); // Debugging: Log any errors
            alert('Something went wrong');
        }
    }

    useEffect(() => {
        console.log("Login state updated:", isLogin);
    }, [isLogin]);

    if (!isLogin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">Phone Number:</label>
                            <input
                                id="phoneNumber"
                                type="tel"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                placeholder="Enter phone number"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password:</label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>

                        <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-blue-600 p-4 flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold"><Link href={"/admin"}>Delivery Tracker</Link></h1>
                </nav>

                {/* Card Section */}
                <section className="p-6 mysectionGrid">
                    {orders.orders.map((order, index) => (
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
                            <Button onClick = {()=>orderdelivered(order)}>Delivered</Button>
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
    );
};

export default Page;
