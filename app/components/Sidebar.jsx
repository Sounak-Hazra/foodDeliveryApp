import React from 'react'

const Sidebar = () => {
    return (
        <div className='p-5 gap-4 flex flexcol w-28'>
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
    )
}

export default Sidebar