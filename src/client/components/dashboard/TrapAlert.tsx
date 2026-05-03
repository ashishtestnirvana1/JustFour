'use client'

interface Props {
  parkedCount: number
}

export default function TrapAlert({ parkedCount }: Props) {
  return (
    <div style={{
      backgroundColor: '#FEF2F2', border: '1px solid #FECACA',
      borderRadius: 12, padding: '20px 24px', marginBottom: 36,
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, backgroundColor: '#FEE2E2',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0, fontSize: 18,
        }}>⚠</div>
        <div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 700,
            color: '#991B1B', marginBottom: 6,
          }}>
            Founder's Trap
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#991B1B',
            lineHeight: 1.6, opacity: 0.9,
          }}>
            If you are reading the parked section instead of doing the 4 focus items — close this tab and go do something.
          </div>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B91C1C',
            marginTop: 10, opacity: 0.7,
          }}>
            {parkedCount} ideas parked. Not gone — just not this week.
          </div>
        </div>
      </div>
    </div>
  )
}
