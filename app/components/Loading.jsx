"use client"

import React from "react"
import { Loader2 } from "lucide-react"


const Loading = () => {


    return (
        <>
            <div className="w-screen h-screen flex justify-center items-center">
                <Loader2 className="animate-spin w-20 h-20" />
            </div>
        </>
    )
}

export default Loading