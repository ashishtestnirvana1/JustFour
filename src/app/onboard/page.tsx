import { redirect } from 'next/navigation'
import { createClient } from '@/server/db/client'
import OnboardClient from './OnboardClient'

export default async function OnboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  let { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!session) {
    // User exists in auth but has no session row — create one and continue
    console.warn('[onboard/page] no session row for authenticated user, creating one', { userId: user.id })

    // Ensure users row exists first
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', user.id)
      .single()

    if (!existingUser) {
      const { error: userErr } = await supabase
        .from('users')
        .insert({ id: user.id, email: user.email! })
      if (userErr) console.error('[onboard/page] users insert failed', { error: userErr.message })
    }

    const { data: newSession, error: sessionErr } = await supabase
      .from('sessions')
      .insert({ user_id: user.id, stage: 0 })
      .select('*')
      .single()

    if (sessionErr || !newSession) {
      console.error('[onboard/page] session create failed', { error: sessionErr?.message })
      redirect('/')
    }

    session = newSession
  }

  if (session.stage === 4) redirect('/dashboard')

  const { data: messages, error: messagesError } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', session.id)
    .eq('stage', 3)
    .in('role', ['user', 'assistant'])
    .order('created_at', { ascending: true })

  if (messagesError) console.error('[onboard/page] messages fetch failed', { error: messagesError.message })
  console.log('[onboard/page] loaded messages', { sessionId: session.id, stage: session.stage, count: messages?.length ?? 0 })

  return (
    <OnboardClient
      session={session}
      messages={messages ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
