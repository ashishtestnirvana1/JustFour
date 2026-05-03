import { redirect } from 'next/navigation'
import { createClient } from '@/server/db/client'
import OnboardClient from './OnboardClient'

export default async function OnboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', user.id)
    .single()

  if (!session) redirect('/')
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
