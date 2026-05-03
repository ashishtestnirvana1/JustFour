'use client'

import { useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/client/lib/supabase'
import TopBar from '@/client/components/shell/TopBar'
import ReturnVisitBanner from '@/client/components/onboard/ReturnVisitBanner'
import ArrivalScreen from '@/client/components/onboard/ArrivalScreen'
import CalibrationChips from '@/client/components/onboard/CalibrationChips'
import BrainDumpArea from '@/client/components/onboard/BrainDumpArea'
import ChatContainer from '@/client/components/chat/ChatContainer'
import type { Session, Message, SessionContext } from '@/shared/types'

interface Props {
  session: Session
  messages: Message[]
  userEmail: string
}

export default function OnboardClient({ session: initialSession, messages, userEmail }: Props) {
  const [stage, setStage] = useState(initialSession.stage)
  const [sessionId] = useState(initialSession.id)
  const [showBanner, setShowBanner] = useState(stage >= 1 && stage <= 3)
  const router = useRouter()
  const supabase = createClient()

  const updateStage = useCallback(async (newStage: number, newContext?: SessionContext) => {
    console.log('[OnboardClient] updateStage', { sessionId, from: stage, to: newStage, hasContext: !!newContext })
    const updates: Record<string, unknown> = { stage: newStage }
    if (newContext) updates.context = newContext
    const { error } = await supabase.from('sessions').update(updates).eq('id', sessionId)
    if (error) console.error('[OnboardClient] updateStage failed', { sessionId, error: error.message })
    setStage(newStage)
  }, [sessionId, supabase, stage])

  const handleStartOver = useCallback(async () => {
    console.log('[OnboardClient] startOver', { sessionId })
    const { error: msgError } = await supabase.from('messages').delete().eq('session_id', sessionId)
    if (msgError) console.error('[OnboardClient] messages delete failed', { error: msgError.message })
    const { error: dashError } = await supabase.from('dashboards').delete().eq('session_id', sessionId)
    if (dashError) console.error('[OnboardClient] dashboards delete failed', { error: dashError.message })
    const { error: sessionError } = await supabase.from('sessions').update({ stage: 0, context: {} }).eq('id', sessionId)
    if (sessionError) console.error('[OnboardClient] session reset failed', { error: sessionError.message })
    setStage(0)
    setShowBanner(false)
    router.refresh()
  }, [sessionId, supabase, router])

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F6F3' }}>
      <TopBar
        variant="onboard"
        email={userEmail}
        onStartOver={stage >= 1 ? handleStartOver : undefined}
      />

      {showBanner && stage >= 1 && stage <= 3 && (
        <ReturnVisitBanner
          stage={stage}
          onContinue={() => setShowBanner(false)}
          onStartOver={handleStartOver}
        />
      )}

      {stage === 0 && (
        <ArrivalScreen onStart={() => updateStage(1)} />
      )}

      {stage === 1 && (
        <CalibrationChips
          onComplete={async (ctx) => {
            await updateStage(2, ctx)
          }}
        />
      )}

      {stage === 2 && (
        <BrainDumpArea
          sessionId={sessionId}
          onDone={async (text) => {
            console.log('[OnboardClient] brain dump submitted', { sessionId, length: text.length })
            const { error } = await supabase.from('messages').insert({
              session_id: sessionId,
              role: 'user',
              content: text,
              stage: 2,
            })
            if (error) console.error('[OnboardClient] brain dump message insert failed', { error: error.message })
            await updateStage(3)
          }}
        />
      )}

      {stage === 3 && (
        <ChatContainer
          sessionId={sessionId}
          initialMessages={messages}
        />
      )}
    </div>
  )
}
