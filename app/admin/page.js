"use client"
import { signIn } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import React from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Nav from '../components/Nav'

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
                        <button onClick={()=>signIn(null,{redirect:true})} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition duration-300">
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
                <div className='flex h-24 bg-yellow-300 justify-center text-xl rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 font-bold rounded-md' href='/admin/addproduct'>Add new product</Link>
                </div>
                <div className='flex h-24 bg-yellow-300 justify-center rounded-lg transform transition-transform duration-300 hover:scale-105 hover:shadow-lg gap-3 items-center'>
                    <Link className='px-2 py-1 bg-yellow-300 text-xl font-bold rounded-md' href='/admin/addcategory'>Add new category</Link>
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