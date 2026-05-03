import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/server/db/middleware'

const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:80',
  process.env.NEXT_PUBLIC_APP_URL ?? '',
].filter(Boolean)

function setCorsHeaders(response: NextResponse, origin: string) {
  response.headers.set('Access-Control-Allow-Origin', origin)
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  response.headers.set(
    'Access-Control-Allow-Headers',
    'Authorization, Content-Type, X-Requested-With'
  )
}

export async function middleware(request: NextRequest) {
  const origin = request.headers.get('origin') ?? ''
  const isAllowed = ALLOWED_ORIGINS.includes(origin)

  // Handle CORS preflight before auth check
  if (request.method === 'OPTIONS' && request.nextUrl.pathname.startsWith('/api/')) {
    const preflight = new NextResponse(null, { status: 204 })
    if (isAllowed) setCorsHeaders(preflight, origin)
    preflight.headers.set('Access-Control-Max-Age', '86400')
    return preflight
  }

  const response = await updateSession(request)

  // Attach CORS headers to all /api/ responses
  if (isAllowed && request.nextUrl.pathname.startsWith('/api/')) {
    setCorsHeaders(response as NextResponse, origin)
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
