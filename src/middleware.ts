import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { type Session, signToken, verifyToken } from '@/lib/jose'
import { SESSION_LIFESPAN_MS } from '@/features/auth/constants'

const protectedRoutes = ['/dashboard']
const authRoutes = ['/login', '/register']

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  const sessionCookie = req.cookies.get('session')
  const isProtectedRoute = protectedRoutes.includes(pathname)
  const isAuthRoute = authRoutes.includes(pathname)

  const res = NextResponse.next()

  if (sessionCookie) {
    if (isAuthRoute) {
      return NextResponse.redirect(new URL('/', req.url))
    }

    try {
      const parsed = await verifyToken(sessionCookie.value)

      const expiresAt = new Date(
        Math.floor((Date.now() + SESSION_LIFESPAN_MS) / 1000) * 1000,
      )

      const session: Session = {
        ...parsed,
        expires: expiresAt.toISOString(),
      }

      const encryptedSession = await signToken(session, expiresAt)

      res.cookies.set({
        name: 'session',
        value: encryptedSession,
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        expires: expiresAt,
      })
    } catch (error) {
      console.error('Error updating session:', error)
      res.cookies.delete('session')
      if (isProtectedRoute) {
        return NextResponse.redirect(new URL('/login', req.url))
      }
    }
  } else {
    if (isProtectedRoute) {
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
