'use client'

import { TAG_CONFIG } from '@/shared/constants'
import type { FocusItem, Tag } from '@/shared/types'

function TagBadge({ tag, size = 'default' }: { tag: Tag; size?: 'default' | 'small' }) {
  const config = TAG_CONFIG[tag]
  const isSmall = size === 'small'
  return (
    <span style={{
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: isSmall ? 10 : 11, fontWeight: 500, letterSpacing: '0.04em',
      padding: isSmall ? '2px 7px' : '3px 10px', borderRadius: 4,
      backgroundColor: config.bg, color: config.text,
      border: `1px solid ${config.border}`, textTransform: 'uppercase' as const,
      flexShrink: 0,
    }}>
      {tag}
    </span>
  )
}

function FocusCard({ item, number }: { item: FocusItem; number: number }) {
  const config = TAG_CONFIG[item.tag]
  return (
    <div style={{
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E1DC',
      borderLeft: `4px solid ${config.accent}`,
      borderRadius: '4px 12px 12px 4px',
      padding: '24px 24px 20px',
    }}>
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 4 }}>
        <div style={{
          fontFamily: "'Outfit', sans-serif", fontSize: 18, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1.3,
        }}>
          <span style={{ color: '#9B9B9B', fontWeight: 600 }}>{number}.</span> {item.title}
        </div>
        <TagBadge tag={item.tag} size="small" />
      </div>

      {/* Subtitle */}
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#6B6B6B',
        marginBottom: 16, lineHeight: 1.4,
      }}>
        {item.subtitle}
      </div>

      {/* Context paragraph */}
      <div style={{
        fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#4B4B4B',
        lineHeight: 1.65, marginBottom: 18, paddingBottom: 16,
        borderBottom: '1px solid #F0EFEA',
      }}>
        {item.context}
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: item.goal ? 18 : 0 }}>
        {item.tasks.map((task, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
            <div style={{
              width: 18, height: 18, borderRadius: 4,
              border: '1.5px solid #C4C3BE', flexShrink: 0, marginTop: 1,
            }} />
            <div style={{
              fontFamily: "'Outfit', sans-serif", fontSize: 14,
              color: '#1A1A1A', lineHeight: 1.5, flex: 1,
            }}>
              {task}
            </div>
          </div>
        ))}
      </div>

      {/* Goal (optional) */}
      {item.goal && (
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 8,
          paddingTop: 14, borderTop: '1px solid #F0EFEA',
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500,
            color: config.text, backgroundColor: config.bg,
            border: `1px solid ${config.border}`,
            padding: '2px 6px', borderRadius: 3,
            letterSpacing: '0.04em', textTransform: 'uppercase' as const,
            flexShrink: 0, marginTop: 1,
          }}>Goal</span>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 13,
            color: '#6B6B6B', lineHeight: 1.4, fontStyle: 'italic',
          }}>
            {item.goal}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FocusWall({ items }: { items: FocusItem[] }) {
  return (
    <section style={{ marginBottom: 48 }}>
      <h2 style={{
        fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700,
        color: '#1A1A1A', letterSpacing: '-0.03em', margin: '0 0 24px 0',
      }}>
        Just four things:
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {items.map((item, i) => (
          <FocusCard key={item.id} item={item} number={i + 1} />
        ))}
      </div>
    </section>
  )
}
