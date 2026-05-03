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

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('session_id', session.id)
    .order('created_at', { ascending: true })

  return (
    <OnboardClient
      session={session}
      messages={messages ?? []}
      userEmail={user.email ?? ''}
    />
  )
}
