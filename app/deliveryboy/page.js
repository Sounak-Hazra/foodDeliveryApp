"use client";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Page = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");
    const [password, setPassword] = useState("");
    const [orders, setOrders] = useState([]);

    const { toast } = useToast();

    const handleLogin = async (p, ps) => {
        console.log(p, ps);
        try {
            const res = await fetch('/api/deleveryboylogin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ phone: p, password: ps }),
            });
            const data = await res.json();

            if (data.success) {
                const od = data.value;
                setOrders(od);
                setIsLogin(true); // Update state to reflect successful login
                localStorage.setItem('deleveryboy', JSON.stringify({ phone: p, password: ps }));
                console.log("Login successful", data.message);
                toast({
                    title: 'Login successful',
                    description: data.message,
                    type: 'success',
                });
            } else {
                toast({
                    title: 'Error',
                    description: data.message, // Fixed "descrip" to "description"
                    type: 'error',
                });
            }
        } catch (error) {
            console.log(error); // Debugging: Log any errors
            toast({
                title: 'Error',
                description: 'Something went wrong',
                type: 'error',
            });
        }
    };

    const logout = () => {
        console.log("Logout");
        setIsLogin(false);
        setPhoneNumber('');
        setPassword('');
        localStorage.removeItem('deleveryboy');
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent default form submission
        handleLogin(phoneNumber, password);
    };

    useEffect(() => {
        const savedLogin = JSON.parse(localStorage.getItem('deleveryboy'));
        if (savedLogin && savedLogin.phone && savedLogin.password) {
            handleLogin(savedLogin.phone, savedLogin.password);
        }
    }, []);


    if (!isLogin) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-100">
                <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
                    <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
                    <div >
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

                        <button onClick={() => handleLogin(phoneNumber, password)} className="w-full py-2 px-4 bg-indigo-600 text-white font-semibold rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Navbar */}
                <nav className="bg-green-200/70 p-3 flex justify-between items-center shadow-md">
                    <h1 className="text-green-800 text-2xl font-bold"><Link href={"/admin"}>Delivery Tracker</Link></h1>
                    <button onClick={() => logout()} className='px-3 py-2 bg-green-700 text-white font-semibold rounded-lg text-sm md:text-base hover:bg-green-800 transition'>
                        Log out
                    </button>
                </nav>

                {/* Card Section */}
                <section className="p-4 md:p-6 mysectionGrid gap-6">
                    {orders.orders.map((order, index) => (
                        <div key={index} className="card bg-white shadow-lg rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">Name: {order.name}</h2>
                            <h2 className="text-xl font-semibold mb-2 text-gray-800">ID: {order._id}</h2>
                            <p className="text-gray-700"><strong>Full address:</strong> {order.address}</p>
                            <p className="text-gray-700"><strong>City:</strong> {order.city}</p>
                            <p className="text-gray-700"><strong>Landmark:</strong> {order.landmark}</p>
                            <p className="text-gray-700"><strong>Pincode:</strong> {order.pincode}</p>
                            <p className="text-gray-700"><strong>Mobile number:</strong> {order.mobile}</p>
                            <p className="text-gray-700"><strong>Time:</strong> {order.deliveryTime}</p>
                            <p className="text-gray-700"><strong>Payment type:</strong> {order.paymentType}</p>
                            <p className="text-gray-700"><strong>Price:</strong> ₹{order.price}</p>
                            <p className="text-gray-700"><strong>Status:</strong> {order.successfull}</p>
                            <p className="text-gray-600"><strong>Alternet phone number:</strong> {order.alternetPhone ? order.alternetPhone : ""}</p>
                            <p className="text-gray-600 "><strong>Message:</strong> <div className='w-full overflow-y-auto h-20 overflow-x-hidden break-words'> {order.message ? order.message : ""}</div></p>
                            <div className="flex justify-between mt-4">
                                <Button className="bg-green-500 text-white px-3 py-1 rounded-lg text-sm md:text-base hover:bg-green-600 transition" onClick={() => orderdelivered(order)}>Delivered</Button>
                                <Button className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm md:text-base hover:bg-red-600 transition" onClick={() => orderCancled(order)}>Cancel order</Button>
                            </div>

                            {/* Display Items */}
                            <div className="mt-4 h-32 overflow-y-auto border-t pt-3">
                                <h3 className="font-semibold text-lg text-gray-800">Items:</h3>
                                <ul className="list-disc pl-5 text-gray-700">
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
