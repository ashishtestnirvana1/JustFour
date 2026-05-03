'use client'

import { useState, useEffect } from 'react'

export type ErrorVariant = 'api_error' | 'rate_limit' | 'stream_drop' | 'persistent'

interface Props {
  variant: ErrorVariant
  onRetry?: () => void
  onDismiss?: () => void
}

const ERROR_CONFIG: Record<ErrorVariant, { title: string; body: string; retryLabel?: string }> = {
  api_error: {
    title: 'Something went wrong.',
    body: 'The AI hit an error. Your messages are saved — try sending again.',
    retryLabel: 'Try again',
  },
  rate_limit: {
    title: 'Too many requests.',
    body: 'You\'re sending messages very quickly. Wait a moment and try again.',
    retryLabel: 'Retry',
  },
  stream_drop: {
    title: 'Connection dropped.',
    body: 'The response was cut short. Your message is saved — try resending.',
    retryLabel: 'Resend',
  },
  persistent: {
    title: 'Still having trouble.',
    body: 'If this keeps happening, try refreshing the page. Your progress is saved.',
  },
}

export default function ErrorToast({ variant, onRetry, onDismiss }: Props) {
  const [visible, setVisible] = useState(true)
  const config = ERROR_CONFIG[variant]

  useEffect(() => {
    if (variant !== 'persistent') {
      const t = setTimeout(() => { setVisible(false); onDismiss?.() }, 8000)
      return () => clearTimeout(t)
    }
  }, [variant, onDismiss])

  if (!visible) return null

  return (
    <div style={{
      margin: '12px 0',
      padding: '14px 16px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 10,
      animation: 'toastIn 0.3s ease-out',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600, color: '#991B1B', marginBottom: 4 }}>
            {config.title}
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B91C1C', lineHeight: 1.5 }}>
            {config.body}
          </div>
          {config.retryLabel && onRetry && (
            <button
              onClick={onRetry}
              style={{
                marginTop: 10, padding: '6px 14px', borderRadius: 7, border: '1px solid #FECACA',
                backgroundColor: '#FFFFFF', fontFamily: "'Outfit', sans-serif",
                fontSize: 13, fontWeight: 500, color: '#991B1B', cursor: 'pointer', minHeight: 32,
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FEF2F2')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >{config.retryLabel}</button>
          )}
        </div>
        {variant !== 'persistent' && (
          <button
            onClick={() => { setVisible(false); onDismiss?.() }}
            style={{
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#9B9B9B', fontSize: 16, lineHeight: 1, padding: 4, flexShrink: 0,
            }}
          >×</button>
        )}
      </div>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
