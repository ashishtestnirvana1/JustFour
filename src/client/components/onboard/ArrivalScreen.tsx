'use client'

import { useState } from 'react'

interface Props { onStart: () => void }

export default function ArrivalScreen({ onStart }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <div style={{
      maxWidth: 640, margin: '0 auto', padding: '0 20px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      minHeight: 'calc(100vh - 65px)',
    }}>
      <div style={{ textAlign: 'center', maxWidth: 440, animation: 'arrivalFadeUp 0.8s ease-out' }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 28, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.03em', lineHeight: 1.3, marginBottom: 16,
        }}>
          Let's figure out what you should actually be working on this week.
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#9B9B9B',
          lineHeight: 1.6, marginBottom: 48,
        }}>
          10 minutes. One conversation. A clear plan.
        </div>
        <button
          onClick={onStart}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600,
            padding: '16px 40px', borderRadius: 12, border: 'none',
            backgroundColor: hovered ? '#333333' : '#1A1A1A', color: '#FFFFFF',
            cursor: 'pointer', letterSpacing: '-0.01em', minHeight: 44,
            transition: 'background-color 0.15s ease, transform 0.15s ease',
            transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
          }}
        >Dump your list →</button>
      </div>
      <style>{`@keyframes arrivalFadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
