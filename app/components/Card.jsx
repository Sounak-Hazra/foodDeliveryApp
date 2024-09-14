import React from 'react';

function NachosCard() {
    return (
        <div className="max-w-sm rounded py-4 px-8 overflow-hidden shadow-lg">
            <div className='w-full h-[174px] object-contain'><img src="slidebar/Screenshot 2024-09-09 180741.png" className="w-full rounded-[36px] h-full" alt="Nachos" /></div>
            <div className='flex justify-between w-full mt-2'>
                <div className="">
                    <div className="font-bold text-xl ">Mexican Appetizer</div>
                    <div className='text-base'>Price</div>
                    <p className="text-gray-700 text-[12px] font-[300] ">
                        Tortilla Chips With Toppins
                    </p>
                </div>
                <div className="addtocart px-7 py-1 rounded-lg h-10 my-auto text-green-600 w-28 flex justify-center items-center bottom-1 left-[8px] bg-green-50 z-10 font-bold text-lg border border-green-700 hover:bg-green-100 transition-colors">
                    ADD
                    <img className="w-3 absolute top-[2px] right-[3px] font-bold" src="/homepage/add-01-stroke-rounded.svg" alt="" />
                </div>
            </div>
        </div>
    );
}

export default NachosCard;