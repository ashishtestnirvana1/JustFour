'use client'

import { useState } from 'react'

interface Props {
  stage: number
  onContinue: () => void
  onStartOver: () => void
}

const MESSAGES: Record<number, { title: string; body: string }> = {
  1: { title: 'Welcome back.', body: 'You were setting up — want to continue where you left off?' },
  2: { title: 'You were mid-brain-dump.', body: 'Your ideas are still here. Pick up where you left off, or start fresh.' },
  3: { title: 'You left mid-conversation.', body: 'Your progress is saved. Continue from where you stopped, or start over.' },
}

export default function ReturnVisitBanner({ stage, onContinue, onStartOver }: Props) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const msg = MESSAGES[stage] ?? MESSAGES[3]

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '16px 20px 0', animation: 'bannerSlideIn 0.4s ease-out' }}>
      <div style={{ padding: '18px 20px', backgroundColor: '#FFFBEB', border: '1px solid #FEF3C7', borderRadius: 12 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEF3C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 16 }}>↩</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700, color: '#92400E', marginBottom: 4 }}>{msg.title}</div>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#A16207', lineHeight: 1.5, marginBottom: 14 }}>{msg.body}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setDismissed(true); onContinue() }} style={{
                padding: '8px 20px', borderRadius: 8, border: 'none', backgroundColor: '#1A1A1A',
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 600,
                color: '#FFFFFF', cursor: 'pointer', minHeight: 36,
              }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#333333')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1A1A1A')}
              >Continue</button>
              <button onClick={() => { setDismissed(true); onStartOver() }} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent',
                fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500,
                color: '#9B9B9B', cursor: 'pointer', minHeight: 36,
              }}>Start over</button>
            </div>
          </div>
        </div>
      </div>
      <style>{`@keyframes bannerSlideIn { from { opacity: 0; transform: translateY(-12px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
