'use client'

import { TAG_CONFIG } from '@/shared/constants'
import type { FocusItem, Tag } from '@/shared/types'

interface Props {
  items: FocusItem[]
}

function TagBadge({ tag }: { tag: Tag }) {
  const config = TAG_CONFIG[tag]
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
      backgroundColor: config.bg, color: config.text,
      fontFamily: "'Outfit', sans-serif", fontSize: 11, fontWeight: 600,
      letterSpacing: '0.04em', textTransform: 'uppercase',
    }}>
      {tag}
    </span>
  )
}

function FocusCard({ item, index }: { item: FocusItem; index: number }) {
  return (
    <div style={{
      padding: '20px 22px', backgroundColor: '#FFFFFF',
      border: '1px solid #E2E1DC', borderRadius: 14,
      animation: `cardIn 0.4s ease-out ${index * 0.1}s both`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1.3, flex: 1,
        }}>
          {item.goal}
        </div>
        <TagBadge tag={item.tag} />
      </div>
      <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {item.tasks.map((task, i) => (
          <li key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
            <div style={{
              width: 20, height: 20, borderRadius: 5, border: '1.5px solid #D4D3CE',
              flexShrink: 0, marginTop: 1,
            }} />
            <span style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#4A4A4A',
              lineHeight: 1.5,
            }}>{task}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FocusWall({ items }: Props) {
  return (
    <section style={{ marginBottom: 40 }}>
      <div style={{ marginBottom: 20 }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.03em', marginBottom: 6,
        }}>
          Your focus this week
        </div>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B',
        }}>
          {items.length} priority {items.length === 1 ? 'area' : 'areas'} · 3 actions each
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {items.map((item, i) => <FocusCard key={item.id} item={item} index={i} />)}
      </div>
      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  )
}
