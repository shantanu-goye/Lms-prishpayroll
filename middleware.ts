import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET_KEY = process.env.SESSION_SECRET || 'super-secret-key'
const encodedKey = new TextEncoder().encode(SECRET_KEY)

export async function middleware(request: NextRequest) {
  const isProtected = request.nextUrl.pathname.startsWith('/dashboard')
  const isLogin = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/'
  
  const token = request.cookies.get('session')?.value

  // Verify Session if token exists
  let session = null
  if (token) {
    try {
      const { payload } = await jwtVerify(token, encodedKey, {
        algorithms: ['HS256'],
      })
      session = payload
    } catch (e) {
      // Invalid token
    }
  }

  // 1. If accessing protected route without session -> Login
  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If accessing Login/Home WITH session -> Dashboard
  if (isLogin && session) {
    if (session.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url))
    } else {
        return NextResponse.redirect(new URL('/dashboard/student', request.url))
    }
  }

  // 3. Role-based protection for sub-routes
  if (isProtected && session) {
      if (request.nextUrl.pathname.startsWith('/dashboard/admin') && session.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard/student', request.url)) // Unauthorized for admin, send to student
      }
      if (request.nextUrl.pathname.startsWith('/dashboard/student') && session.role !== 'STUDENT') {
           return NextResponse.redirect(new URL('/dashboard/admin', request.url)) // Unauthorized for student, send to admin
      }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/'],
}
