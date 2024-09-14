import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'




export default async function middleware(request) {

    const token = await getToken({ req: request, raw: true })
    const url = request.nextUrl.pathname
    console.log("This is middleware")
    console.log(url)
    console.log(token)
    console.log("This is middleware")
    if (!token && (
        url === '/admin/orderhistory' ||
        url === '/admin/addcategory' ||
        url === '/adminaddproduct' ||
        url === '/admin/addproduct' ||
        url === '/admin/adddeliveryboy' ||
        url === '/admin/addnewoutlate'
  )) {
        return NextResponse.redirect(new URL('/admin', request.url))
    }


    return NextResponse.next()
}


export const config = {
    matcher: ['/admin/:path*'],
}

