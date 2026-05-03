'use client'

import { useEffect, useRef, useState } from 'react'
import { useChat } from 'ai/react'
import { useRouter } from 'next/navigation'
import type { Message } from '@/shared/types'
import MessageBubble from './MessageBubble'
import StreamingIndicator from './StreamingIndicator'
import ErrorToast, { ErrorVariant } from './ErrorToast'

interface Props {
  sessionId: string
  initialMessages: Message[]
  stage: number
}

export default function ChatContainer({ sessionId, initialMessages, stage }: Props) {
  const router = useRouter()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const [errorVariant, setErrorVariant] = useState<ErrorVariant | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [navigating, setNavigating] = useState(false)

  const { messages, input, setInput, append, isLoading, error } = useChat({
    api: '/api/chat',
    body: { sessionId, stage },
    initialMessages: initialMessages.map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
    })),
    onFinish: async (message) => {
      console.log('[ChatContainer] stream finished', { sessionId, contentLength: message.content.length, hasDashboard: message.content.includes('```dashboard') })
      if (message.content.includes('```dashboard')) {
        console.log('[ChatContainer] dashboard block received, navigating to /dashboard')
        setNavigating(true)
        router.push('/dashboard')
      }
    },
    onError: (err) => {
      console.error('[ChatContainer] stream error', { sessionId, message: err.message, status: (err as { status?: number }).status })
      setErrorCount(prev => {
        const next = prev + 1
        console.warn('[ChatContainer] error count', { count: next })
        if (next >= 3) setErrorVariant('persistent')
        else if (err.message?.includes('rate')) setErrorVariant('rate_limit')
        else if (err.message?.includes('stream')) setErrorVariant('stream_drop')
        else setErrorVariant('api_error')
        return next
      })
    },
  })

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed || isLoading || navigating) return
    console.log('[ChatContainer] sending message', { sessionId, contentLength: trimmed.length })
    setErrorVariant(null)
    append({ role: 'user', content: trimmed })
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleRetry = () => {
    setErrorVariant(null)
    const lastUser = [...messages].reverse().find(m => m.role === 'user')
    if (lastUser) append({ role: 'user', content: lastUser.content })
  }

  if (navigating) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: 'calc(100vh - 65px)',
        fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#047857',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ marginBottom: 16 }}>Building your focus plan...</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{
                width: 6, height: 6, borderRadius: '50%', backgroundColor: '#047857',
                animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite`,
              }} />
            ))}
          </div>
        </div>
        <style>{`@keyframes pulse { 0%,80%,100%{opacity:.3;transform:scale(.8)} 40%{opacity:1;transform:scale(1)} }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '24px 20px 140px', minHeight: 'calc(100vh - 65px)' }}>
      {/* Message list */}
      <div>
        {messages.map(m => (
          <MessageBubble key={m.id} role={m.role as 'user' | 'assistant'} content={m.content} />
        ))}
        {isLoading && <StreamingIndicator />}
        {errorVariant && (
          <ErrorToast
            variant={errorVariant}
            onRetry={errorVariant !== 'persistent' ? handleRetry : undefined}
            onDismiss={() => setErrorVariant(null)}
          />
        )}
        <div ref={bottomRef} />
      </div>

      {/* Fixed input bar */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(247, 246, 243, 0.95)',
        backdropFilter: 'blur(12px)',
        borderTop: '1px solid #E2E1DC',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '12px 20px 22px' }}>
          <div style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            backgroundColor: '#FFFFFF', border: '1px solid #E2E1DC',
            borderRadius: 12, padding: '10px 12px',
            transition: 'border-color 0.15s ease',
          }}
            onFocus={() => {}}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => {
                setInput(e.target.value)
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(140, e.target.scrollHeight) + 'px'
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type your response..."
              disabled={isLoading || navigating}
              rows={1}
              style={{
                flex: 1, border: 'none', outline: 'none', resize: 'none',
                fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#1A1A1A',
                lineHeight: 1.5, backgroundColor: 'transparent',
                maxHeight: 140, overflowY: 'auto',
                opacity: isLoading ? 0.5 : 1,
              }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isLoading || navigating}
              style={{
                width: 36, height: 36, borderRadius: 9, border: 'none', flexShrink: 0,
                backgroundColor: input.trim() && !isLoading ? '#1A1A1A' : '#E2E1DC',
                color: input.trim() && !isLoading ? '#FFFFFF' : '#9B9B9B',
                cursor: input.trim() && !isLoading ? 'pointer' : 'default',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16, transition: 'all 0.15s ease',
              }}
              onMouseEnter={e => { if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#333333' }}
              onMouseLeave={e => { if (input.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#1A1A1A' }}
            >↑</button>
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#C4C3BE',
            textAlign: 'center', marginTop: 8,
          }}>
            Enter to send · Shift+Enter for new line
          </div>
        </div>
      </div>
    </div>
  )
}
