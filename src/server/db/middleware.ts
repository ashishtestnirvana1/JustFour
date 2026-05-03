import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll(cookiesToSet: any[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user }, error } = await supabase.auth.getUser()

  // Stale or invalid refresh token — clear the session cookies and redirect home
  if (error?.message?.includes('Refresh Token')) {
    console.warn('[middleware] stale refresh token, clearing cookies and redirecting', { path: request.nextUrl.pathname, error: error.message })
    const url = request.nextUrl.clone()
    url.pathname = '/'
    const redirectResponse = NextResponse.redirect(url)
    request.cookies.getAll()
      .filter(c => c.name.startsWith('sb-'))
      .forEach(c => redirectResponse.cookies.delete(c.name))
    return redirectResponse
  }

  const path = request.nextUrl.pathname
  const isProtected = path.startsWith('/onboard') || path.startsWith('/dashboard')

  if (isProtected && !user) {
    console.warn('[middleware] unauthenticated access to protected route, redirecting', { path })
    const url = request.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  if (user) {
    console.log('[middleware] session valid', { userId: user.id, path })
  }

  return supabaseResponse
}
