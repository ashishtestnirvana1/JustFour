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
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.03em', marginBottom: 6,
        }}>
          Parking lot
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B',
        }}>
          {totalCount} {totalCount === 1 ? 'item' : 'items'} not this week — but not forgotten
        </div>
      </div>

      <div style={{
        padding: '20px 22px', backgroundColor: '#FAFAF8',
        border: '1px solid #E2E1DC', borderRadius: 14,
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          {nonEmpty.map(cat => (
            <div key={cat}>
              <div style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 700,
                color: '#9B9B9B', letterSpacing: '0.08em', textTransform: 'uppercase',
                marginBottom: 10,
              }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                {data[cat].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <div style={{
                      width: 5, height: 5, borderRadius: '50%', backgroundColor: '#C4C3BE',
                      flexShrink: 0, marginTop: 7,
                    }} />
                    <div>
                      <div style={{
                        fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#4A4A4A',
                        lineHeight: 1.4,
                      }}>
                        {item.idea}
                      </div>
                      {item.reason && (
                        <div style={{
                          fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#9B9B9B',
                          marginTop: 2, lineHeight: 1.4,
                        }}>
                          {item.reason}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
