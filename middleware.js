import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    console.log('🔍 Middleware check:', { pathname, hasToken: !!token })

    // Only redirect to login if there's definitely no token
    // Let the client-side components handle authenticated redirects
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/employee'))) {
      console.log('❌ No token, redirecting to login from:', pathname)
      return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    console.log('✅ Middleware passed for:', pathname)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow the request to continue
        // This allows the middleware function above to handle the logic
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/auth/login',
    '/auth/register', 
    '/dashboard/:path*',
    '/admin/:path*',
    '/employee/:path*',
    // Add other protected routes here as needed
  ]
}