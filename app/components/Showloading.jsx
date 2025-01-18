"use client"
import React,{useEffect} from 'react'
import { Loader2 } from 'lucide-react'

const Showloading = () => {
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.body.style.pointerEvents = 'none';


        return () => {
            document.body.style.overflow = '';
            document.body.style.pointerEvents = 'unset';

        };
    }, []);
    return (
        <>
            <div className='w-screen h-screen bg-transparent absolute flex items-center justify-center pointer-events-none z-40 '>
                <Loader2 className='animate-spin w-20 h-20 ' />
            </div>  
        </>
  )
}

export default Showloading