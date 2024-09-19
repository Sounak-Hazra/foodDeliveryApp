"use client"
import { signIn } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Nav from '../components/Nav'
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"


const page = () => {
    const { data: session } = useSession()


    if (!session) {
        return (
            <>
                <div className="min-h-screen flex items-center px-4 justify-center bg-gradient-to-br from-blue-500 to-purple-500">
                    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                        <h1 className="text-3xl font-bold text-gray-800 mb-4">Admin Login Required</h1>
                        <p className="text-gray-600 mb-6">
                            You must be logged in as an admin to access this page.
                        </p>
                        <button onClick={() => signIn(null, {
                            redirect: true,
                            callbackUrl: "/admin"
                        })} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
                            Go to Login
                        </button>
                    </div>
                </div>
            </>)
    }
    return (
        <>
            <nav className="w-full ">
                <div className="flex flex-col w-full bg-white">
                    <div className="text-center bg-green-200/50 rounded-b-3xl">
                        <Link href="https://tiffinboxes.com" className="inline-block">
                            <img className='w-40' src='/nav/mainnavlogo.png' />
                        </Link>
                    </div>
                </div>
            </nav>
            <div className='p-5 mygridadmin grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4'>
                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' href='/admin/orderhistory'>Order history</Link>
                </div>
                <HoverCard className="p-0">
                    <HoverCardTrigger asChild className='w-full h-full'>
                        <div className="flex w-full h-full bg-yellow-300 justify-center text-xl font-semibold text-gray-800 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl gap-3 items-center cursor-pointer">
                            <button className="px-4 h-full w-full text-xl font-bold py-2 bg-yellow-300 hover:bg-yellow-500 text-gray-900 rounded-md shadow-sm transition-colors duration-200 ease-in-out" href="/admin/addproduct">
                                Product
                            </button>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 p-5 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <div className="flex flex-col gap-4">
                            <div className="font-semibold text-lg text-gray-700">Manage Your Products</div>
                            <Link href="/admin/addproduct" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">
                                ➕ Add a New Product
                            </Link>
                            <Link href="/admin/addproduct/allproduct" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">
                                ✏️ Edit Existing Products
                            </Link>
                        </div>
                    </HoverCardContent>

                </HoverCard>


                {/* <div className='flex h-24 bg-yellow-300 justify-center text-xl rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 font-bold rounded-md' href='/admin/addproduct'>Add new product</Link>
                </div> */}
                <HoverCard className="p-0">
                    <HoverCardTrigger asChild className='w-full h-full'>
                        <div className="flex w-full h-full bg-yellow-300 justify-center text-xl font-semibold text-gray-800 rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-2xl gap-3 items-center cursor-pointer">
                            <button className="px-4 h-full w-full text-xl font-bold py-2 bg-yellow-300 hover:bg-yellow-500 text-gray-900 rounded-md shadow-sm transition-colors duration-200 ease-in-out" href="/admin/addproduct">
                                Category
                            </button>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-72 p-5 bg-white border border-gray-200 rounded-xl shadow-lg">
                        <div className="flex flex-col gap-4">
                            <div className="font-semibold text-lg text-gray-700">Manage Your Products</div>
                            <Link href="/admin/addcategory" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">
                                ➕ Add a New Product category
                            </Link>
                            <Link href="/admin/addcategory/allcategory" className="text-blue-600 hover:text-blue-700 hover:underline transition-all duration-200">
                                ✏️ Delete category
                            </Link>
                        </div>
                    </HoverCardContent>
                </HoverCard>

                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' href='/admin/addnewpincode'>Add new pincode</Link>
                </div>
                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' href='/admin/adddeliveryboy'>Add new Deliveryboy</Link>
                </div>
                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' href='#'>Add new outlate</Link>
                </div>
                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <button className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' onClick={() => { signOut() }}>
                        Logout
                    </button>
                </div>
            </div>
        </>
    )
}

export default page