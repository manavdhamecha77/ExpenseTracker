import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    console.log('🔍 Middleware check:', { pathname, hasToken: !!token })

    // REMOVED: No automatic redirects to /auth/login
    // Let pages handle their own authentication flow
    if (!token && (pathname.startsWith('/dashboard') || pathname.startsWith('/admin') || pathname.startsWith('/employee'))) {
      console.log('⚠️ No token for protected route:', pathname, '- allowing through')
    }

    console.log('✅ Middleware passed for:', pathname)
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => {
        // Return true to allow all requests through
        // No automatic redirects to login
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