import React from 'react'
import { Separator } from '@/components/ui/separator'

const Nav = () => {
  return (
    <>
      <nav className="w-full ">
        <div className="flex flex-col w-full bg-white">
          <div className="text-center bg-green-200/50 pb-20 rounded-b-3xl">
            <a href="https://tiffinboxes.com" className="inline-block">
              <img className='w-40' src='/nav/mainnavlogo.png'/>
            </a>
          </div>
        </div>
      </nav>
    </>

  )
}

export default Nav