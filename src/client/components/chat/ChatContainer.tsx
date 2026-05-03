'use client'

import { useEffect, useRef, useState } from 'react'
// eslint-disable-next-line @typescript-eslint/no-deprecated
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
  const [inputText, setInputText] = useState('')
  const [errorVariant, setErrorVariant] = useState<ErrorVariant | null>(null)
  const [errorCount, setErrorCount] = useState(0)
  const [dashboardReady, setDashboardReady] = useState(false)

  const { messages, append, status } = useChat({
    api: '/api/chat',
    body: { sessionId, stage },
    initialMessages: initialMessages.map(m => ({
      id: m.id,
      role: m.role as 'user' | 'assistant',
      content: m.content,
      parts: [{ type: 'text' as const, text: m.content }],
    })),
    onFinish: (message) => {
      console.log('[ChatContainer] stream finished', {
        sessionId,
        contentLength: message.content.length,
        hasDashboard: message.content.includes('```dashboard'),
      })
      if (message.content.includes('```dashboard')) {
        console.log('[ChatContainer] dashboard ready, showing CTA')
        setDashboardReady(true)
      }
    },
    onError: (err) => {
      console.error('[ChatContainer] stream error', {
        sessionId,
        message: err.message,
        status: (err as { status?: number }).status,
      })
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

  const isLoading = status === 'streaming' || status === 'submitted'

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const handleSend = () => {
    const trimmed = inputText.trim()
    if (!trimmed || isLoading || dashboardReady) return
    console.log('[ChatContainer] sending message', { sessionId, contentLength: trimmed.length })
    setErrorVariant(null)
    append({ role: 'user', content: trimmed })
    setInputText('')
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

        {/* Dashboard ready — per constitution: show button, no auto-redirect */}
        {dashboardReady && (
          <div style={{
            margin: '24px 0', padding: '24px', backgroundColor: '#F0FDF4',
            border: '1px solid #BBF7D0', borderRadius: 12, textAlign: 'center',
          }}>
            <div style={{
              fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700,
              color: '#14532D', marginBottom: 8, letterSpacing: '-0.02em',
            }}>
              Your dashboard is ready.
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#166534',
              marginBottom: 20, lineHeight: 1.5,
            }}>
              Four things. This week. That's it.
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              style={{
                padding: '12px 28px', backgroundColor: '#14532D', color: '#FFFFFF',
                border: 'none', borderRadius: 10, cursor: 'pointer',
                fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600,
                letterSpacing: '-0.01em', transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#166534' }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#14532D' }}
            >
              View your dashboard →
            </button>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Fixed input bar — hidden once dashboard is ready */}
      {!dashboardReady && (
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
            }}>
              <textarea
                ref={inputRef}
                value={inputText}
                onChange={e => {
                  setInputText(e.target.value)
                  e.target.style.height = 'auto'
                  e.target.style.height = Math.min(140, e.target.scrollHeight) + 'px'
                }}
                onKeyDown={handleKeyDown}
                placeholder={errorVariant === 'persistent' ? 'Conversation paused' : 'Type your response...'}
                disabled={isLoading || errorVariant === 'persistent'}
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
                disabled={!inputText.trim() || isLoading || errorVariant === 'persistent'}
                style={{
                  width: 36, height: 36, borderRadius: 9, border: 'none', flexShrink: 0,
                  backgroundColor: inputText.trim() && !isLoading ? '#1A1A1A' : '#E2E1DC',
                  color: inputText.trim() && !isLoading ? '#FFFFFF' : '#9B9B9B',
                  cursor: inputText.trim() && !isLoading ? 'pointer' : 'default',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 16, transition: 'all 0.15s ease',
                }}
                onMouseEnter={e => { if (inputText.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#333333' }}
                onMouseLeave={e => { if (inputText.trim() && !isLoading) e.currentTarget.style.backgroundColor = '#1A1A1A' }}
              >↑</button>
            </div>
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#C4C3BE',
              textAlign: 'center', marginTop: 8,
            }}>
              {errorVariant === 'persistent' ? 'Conversation paused' : 'Enter to send · Shift+Enter for new line'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
