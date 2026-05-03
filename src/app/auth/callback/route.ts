import { NextResponse } from 'next/server'
import { createClient } from '@/server/db/client'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  if (!code) {
    return NextResponse.redirect(`${origin}/?error=no_code`)
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(`${origin}/?error=auth_failed`)
  }

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.redirect(`${origin}/`)
  }

  // Ensure users row exists
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('id', user.id)
    .single()

  if (!existingUser) {
    // New user — create users row + session row
    await supabase.from('users').insert({
      id: user.id,
      email: user.email!,
    })
    await supabase.from('sessions').insert({
      user_id: user.id,
      stage: 0,
    })
    return NextResponse.redirect(`${origin}/onboard`)
  }

  // Returning user — check stage
  const { data: session } = await supabase
    .from('sessions')
    .select('stage')
    .eq('user_id', user.id)
    .single()

  if (!session) {
    await supabase.from('sessions').insert({ user_id: user.id, stage: 0 })
    return NextResponse.redirect(`${origin}/onboard`)
  }

  if (session.stage === 4) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}/onboard`)
}
