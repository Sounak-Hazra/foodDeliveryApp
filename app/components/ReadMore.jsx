"use client"

import React from "react"
import { useState } from "react"


const ReadMoreText = ({ text }) => {
    const [show, setshow] = useState(false)
    const toggel = () => {
        setshow(!show)
    }

    return (
        <>
            <div>
                <span className="text-xs">
                    {show ? text : text.slice(0,100) }
                </span>
                {text.length > 100 ?  <button className="text-blue-500 font-light" onClick={()=>toggel()}>
                    {show ? `show less` : "...read more"}
                </button> : ""}
            </div>  
        </>
    )
    
}

export default ReadMoreText