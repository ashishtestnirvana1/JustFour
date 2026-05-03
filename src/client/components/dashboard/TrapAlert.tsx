'use client'

interface Props {
  message: string
}

export default function TrapAlert({ message }: Props) {
  return (
    <div style={{
      padding: '14px 18px',
      backgroundColor: '#FEF2F2',
      border: '1px solid #FECACA',
      borderRadius: 10,
      marginBottom: 24,
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
    }}>
      <div style={{
        width: 32, height: 32, borderRadius: 8, backgroundColor: '#FEE2E2',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, fontSize: 14,
      }}>⚠</div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 700,
          color: '#991B1B', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em',
        }}>
          Founder's Trap
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#B91C1C', lineHeight: 1.5,
        }}>
          {message}
        </div>
      </div>
    </div>
  )
}
