'use client'

import { useState } from 'react'

export default function ContinueConversationStub() {
  const [clicked, setClicked] = useState(false)

  return (
    <div style={{ borderTop: '1px solid #E2E1DC', paddingTop: 24, marginBottom: 60 }}>
      {!clicked ? (
        <button
          onClick={() => setClicked(true)}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: 10, padding: '16px 20px', backgroundColor: '#FAFAF8',
            border: '1px dashed #D4D3CE', borderRadius: 12, cursor: 'pointer',
            fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B',
            transition: 'border-color 0.15s ease, color 0.15s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#C4C3BE'
            e.currentTarget.style.color = '#6B6B6B'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#D4D3CE'
            e.currentTarget.style.color = '#9B9B9B'
          }}
        >
          <span>💬</span> Continue conversation
        </button>
      ) : (
        <div style={{
          padding: '16px 20px', backgroundColor: '#FAFAF8',
          border: '1px solid #E2E1DC', borderRadius: 12,
          fontFamily: "'Outfit', sans-serif", fontSize: 14,
          color: '#6B6B6B', lineHeight: 1.6, textAlign: 'center',
        }}>
          Coming soon — reach out to{' '}
          <span style={{ color: '#1A1A1A', fontWeight: 500 }}>hello@justfour.ai</span>
          {' '}to update your dashboard.
        </div>
      )}
    </div>
  )
}
