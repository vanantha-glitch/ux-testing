import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Get password from environment variable
  const password = process.env.PROTOTYPE_PASSWORD

  // If no password is set, allow access (for local development)
  if (!password) {
    return NextResponse.next()
  }

  // Check for existing auth cookie
  const authCookie = request.cookies.get('prototype-auth')
  const isAuthenticated = authCookie?.value === 'authenticated'

  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Check for Authorization header
  const authHeader = request.headers.get('authorization')

  if (authHeader) {
    const base64Credentials = authHeader.split(' ')[1]
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, providedPassword] = credentials.split(':')

    // For basic auth, username can be anything, we only check password
    if (providedPassword === password) {
      // Create response and set auth cookie
      const response = NextResponse.next()
      response.cookies.set('prototype-auth', 'authenticated', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })
      return response
    }
  }

  // Return 401 with WWW-Authenticate header to trigger browser password prompt
  return new NextResponse('Authentication required', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Prototype Viewer"',
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

