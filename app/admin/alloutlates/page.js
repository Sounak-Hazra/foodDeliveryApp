"use client"
import React from 'react'
import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'

const page = () => {

    const [outlates, setoutlates] = useState([])
    const [loading, setloading] = useState(true)

    const fetchoutlates = useCallback(async () => {
        try {
            const response = await fetch('/api/getoutlates')
            const data = await response.json()
            const arr = data.outlates
            setoutlates(arr)
            console.log(arr)
        } catch (error) {
            console.log(error)
        } finally {
            setloading(false)
        }
    }, [])

    useEffect(() => {
        fetchoutlates()
    }, [fetchoutlates])
    return (
        <>
            <div className="min-h-screen bg-gray-100">
                {/* Navbar */}
                <nav className="bg-blue-600 p-4 flex justify-between items-center">
                    <h1 className="text-white text-2xl font-bold"><Link href={"/admin"}>Delivery Tracker</Link></h1>
                </nav>

                {/* Card Section */}
                <section className="p-6 mysectionGrid">
                    {outlates.map((outlate, index) => (
                        <Link href={`/admin/alloutlates/${outlate._id}`}>
                            <div key={index} className="card bg-white shadow-md rounded-lg p-4">
                                <h2 className="text-xl font-semibold mb-2">Name: {outlate.name}</h2>
                                <h2 className="text-xl font-semibold mb-2">Email: {outlate.email}</h2>
                                <p><strong>Admin or not:</strong> {outlate.isAdmin ? "Admin Outlate" : "Not Admin"}</p>
                                <div className="mt-4 h-32 overflow-y-auto">
                                    <h3 className="font-semibold text-lg">Pincodes:</h3>
                                    <ul className="list-disc pl-5">
                                        {outlate.pincodes.map((item, i) => (
                                            <li key={i} className="mt-2">
                                                <strong>{item}</strong>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </Link>
                    ))}
                </section>
            </div>
        </>
    )
}

export default page