import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // If user is authenticated and trying to access auth pages, redirect to home
    if (token && (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register'))) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    // If user is not authenticated and trying to access protected pages
    if (!token && pathname.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: () => true, // Allow all requests to reach the middleware
    },
  }
)

export const config = {
  matcher: [
    '/auth/login',
    '/auth/register', 
    '/dashboard/:path*',
    // Add other protected routes here as needed
  ]
}