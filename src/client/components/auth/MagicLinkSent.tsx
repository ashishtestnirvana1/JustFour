'use client'

import { useState } from 'react'

interface Props {
  email: string
  onResend: () => Promise<void>
  onChangeEmail: () => void
}

export default function MagicLinkSent({ email, onResend, onChangeEmail }: Props) {
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)

  const handleResend = async () => {
    setResending(true)
    setResent(false)
    await onResend()
    setResending(false)
    setResent(true)
  }

  return (
    <div style={{
      padding: '36px 32px', backgroundColor: '#EFEEE9',
      borderRadius: 16, textAlign: 'center',
      animation: 'confirmIn 0.5s ease-out',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14, backgroundColor: '#FFFFFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        margin: '0 auto 20px', fontSize: 26,
        animation: 'envelopePop 0.6s ease-out 0.2s both',
      }}>✉</div>
      <div style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
        color: '#1A1A1A', letterSpacing: '-0.02em', marginBottom: 8,
      }}>Check your email.</div>
      <div style={{
        fontFamily: "'JetBrains Mono', monospace", fontSize: 14, fontWeight: 500,
        color: '#1A1A1A', marginBottom: 8, wordBreak: 'break-all',
      }}>{email}</div>
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6B6B6B',
        lineHeight: 1.5, maxWidth: 320, margin: '0 auto 24px',
      }}>We sent a magic link. Click it to get started — no password needed.</div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 20 }}>
        <button onClick={handleResend} disabled={resending} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
          color: resent ? '#047857' : resending ? '#9B9B9B' : '#6B6B6B',
          background: 'none', border: 'none',
          cursor: resending ? 'default' : 'pointer', padding: '8px 4px', minHeight: 36,
        }}
          onMouseEnter={(e) => { if (!resending && !resent) (e.currentTarget).style.color = '#1A1A1A' }}
          onMouseLeave={(e) => { if (!resending && !resent) (e.currentTarget).style.color = '#6B6B6B' }}
        >{resent ? '✓ Sent again' : resending ? 'Sending...' : 'Resend link'}</button>
        <div style={{ width: 1, height: 16, backgroundColor: '#D4D3CE' }} />
        <button onClick={onChangeEmail} style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#6B6B6B',
          background: 'none', border: 'none', cursor: 'pointer', padding: '8px 4px', minHeight: 36,
        }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#1A1A1A')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#6B6B6B')}
        >Different email</button>
      </div>
      <style>{`
        @keyframes confirmIn { from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); } }
        @keyframes envelopePop { from { opacity: 0; transform: scale(0.7); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
