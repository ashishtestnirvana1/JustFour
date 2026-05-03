'use client'

import type { DashboardData } from '@/shared/types'

type ParkingLotData = DashboardData['parking_lot']

interface Props {
  data: ParkingLotData
  totalCount: number
}

const CATEGORY_ORDER: (keyof ParkingLotData)[] = [
  'Technology',
  'Team & culture',
  'Partnerships',
  'Fundraising & scale',
  'Other',
]

export default function ParkingLot({ data, totalCount }: Props) {
  const nonEmpty = CATEGORY_ORDER.filter(cat => data[cat]?.length > 0)
  if (nonEmpty.length === 0) return null

  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{
          fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500,
          color: '#9B9B9B', letterSpacing: '0.06em', textTransform: 'uppercase',
          marginBottom: 4,
        }}>
          Parked — every idea, right here
        </div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B0B0B0' }}>
          {totalCount} ideas captured. None lost. Not this week's job.
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {nonEmpty.map(cat => (
          <div key={cat}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 500,
              color: '#9B9B9B', letterSpacing: '0.05em', textTransform: 'uppercase',
              marginBottom: 10,
            }}>
              {cat}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {data[cat].map((item) => (
                <div
                  key={item.id}
                  style={{
                    flex: '1 1 calc(50% - 6px)', minWidth: 180, maxWidth: 'calc(50% - 6px)',
                    padding: '14px 16px', backgroundColor: '#FFFFFF',
                    border: '1px solid #E5E4DF', borderRadius: 8,
                    cursor: 'default', transition: 'border-color 0.15s ease',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#C4C3BE' }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#E5E4DF' }}
                >
                  <div style={{
                    fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                    color: '#1A1A1A', lineHeight: 1.35, marginBottom: 4, letterSpacing: '-0.01em',
                  }}>
                    {item.idea}
                  </div>
                  {item.reason && (
                    <div style={{
                      fontFamily: "'Outfit', sans-serif", fontSize: 12,
                      color: '#9B9B9B', lineHeight: 1.4,
                    }}>
                      {item.reason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
