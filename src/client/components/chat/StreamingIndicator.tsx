'use client'

export default function StreamingIndicator() {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'flex-start',
      marginBottom: 16,
    }}>
      <div style={{
        padding: '14px 18px',
        borderRadius: '14px 14px 14px 4px',
        backgroundColor: '#EFEEE9',
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}>
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            backgroundColor: '#9B9B9B',
            animation: `typingPulse 1.4s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`
        @keyframes typingPulse {
          0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
