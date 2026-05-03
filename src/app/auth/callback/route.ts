import { NextResponse } from 'next/server'
import { createClient } from '@/server/db/client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    console.warn('[auth/callback] no code in query params', { next })
    return NextResponse.redirect(`${origin}/?error=no_code`)
  }

  console.log('[auth/callback] exchanging code for session')
  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('[auth/callback] exchangeCodeForSession failed', { message: error.message, status: error.status })
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    console.warn('[auth/callback] no user after code exchange')
    return NextResponse.redirect(`${origin}/`)
  }
  console.log('[auth/callback] user authenticated', { userId: user.id, email: user.email })

  // Ensure users row exists
  const { data: existingUser, error: userLookupError } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (userLookupError && userLookupError.code !== 'PGRST116') {
    console.error('[auth/callback] users lookup error', { error: userLookupError.message })
  }

  if (!existingUser) {
    console.log('[auth/callback] new user — creating users + session rows', { userId: user.id })
    const { error: userInsertError } = await supabase.from('users').insert({ id: user.id, email: user.email! })
    if (userInsertError) console.error('[auth/callback] users insert failed', { error: userInsertError.message })

    const { error: sessionInsertError } = await supabase.from('sessions').insert({ user_id: user.id, stage: 0 })
    if (sessionInsertError) console.error('[auth/callback] sessions insert failed', { error: sessionInsertError.message })

    return NextResponse.redirect(`${origin}/onboard`)
  }

  // Returning user — check stage
  const { data: session, error: sessionError } = await supabase
    .from('sessions')
    .select('stage')
    .eq('user_id', user.id)
    .single()

  if (!session) {
    console.warn('[auth/callback] returning user has no session, creating one', { userId: user.id, sessionError: sessionError?.message })
    await supabase.from('sessions').insert({ user_id: user.id, stage: 0 })
    return NextResponse.redirect(`${origin}/onboard`)
  }

  console.log('[auth/callback] returning user', { userId: user.id, stage: session.stage })

  if (session.stage === 4) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}/onboard`)
}
