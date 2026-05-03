'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { CATEGORIES } from '@/shared/constants'

interface Props {
  sessionId: string
  onDone: (text: string) => void
}

function countIdeas(text: string): number {
  if (!text.trim()) return 0
  return text.split(/[\n,]/).map(s => s.trim()).filter(s => s.length > 3).length
}

function getMentionedIds(text: string): string[] {
  const lower = text.toLowerCase()
  return CATEGORIES.filter(cat => cat.keywords.some(kw => lower.includes(kw))).map(cat => cat.id)
}

export default function BrainDumpArea({ onDone }: Props) {
  const [text, setText] = useState('')
  const [showNudges, setShowNudges] = useState(false)
  const [sweepPhase, setSweepPhase] = useState<null | 'sweeping'>(null)
  const [sweepCat, setSweepCat] = useState<typeof CATEGORIES[number] | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout>>()

  const ideaCount = countIdeas(text)
  const mentioned = getMentionedIds(text)
  const unmentioned = CATEGORIES.filter(c => !mentioned.includes(c.id))

  const autoGrow = useCallback(() => {
    const ta = textareaRef.current
    if (ta) { ta.style.height = 'auto'; ta.style.height = Math.max(200, ta.scrollHeight) + 'px' }
  }, [])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (text.trim().length > 10 && unmentioned.length > 0) {
      timerRef.current = setTimeout(() => setShowNudges(true), 30000)
    }
    return () => clearTimeout(timerRef.current)
  }, [text, unmentioned.length])

  const insertCategory = (label: string) => {
    setText(prev => prev + `\n${label}: `)
    setTimeout(() => { textareaRef.current?.focus(); autoGrow() }, 50)
  }

  const handleDone = () => {
    if (unmentioned.length > 0 && sweepPhase === null) {
      setSweepPhase('sweeping')
      setSweepCat(unmentioned[0])
    } else {
      onDone(text)
    }
  }

  const handleSweepSkip = () => {
    const idx = unmentioned.findIndex(c => c.id === sweepCat?.id)
    if (idx < unmentioned.length - 1) {
      setSweepCat(unmentioned[idx + 1])
    } else {
      onDone(text)
    }
  }

  const handleSweepAdd = () => {
    if (sweepCat) insertCategory(sweepCat.label)
    setSweepPhase(null)
    setSweepCat(null)
  }

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '40px 20px 120px', minHeight: 'calc(100vh - 65px)' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, gap: 16 }}>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 18, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.02em', lineHeight: 1.4, flex: 1 }}>
          Everything you're thinking about doing in the next 30 days.
        </div>
        {ideaCount > 0 && (
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 500, color: '#047857', backgroundColor: '#ECFDF5', border: '1px solid #D1FAE5', borderRadius: 6, padding: '4px 10px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            {ideaCount} {ideaCount === 1 ? 'idea' : 'ideas'}
          </div>
        )}
      </div>

      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B', marginBottom: 20, lineHeight: 1.5 }}>
        Product, fundraising, team, sales, admin, random ideas, worries. Don't edit yourself.
      </div>

      <textarea
        ref={textareaRef}
        value={text}
        onChange={(e) => { setText(e.target.value); setShowNudges(false); autoGrow() }}
        placeholder={`Navigation stack for the robot\nFind a co-founder\nElevator API integration\nTalk to potential customers\nFigure out pricing...`}
        style={{
          width: '100%', minHeight: 200, padding: '16px 18px', borderRadius: 12,
          border: '1px solid #E2E1DC', backgroundColor: '#FFFFFF',
          fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#1A1A1A',
          lineHeight: 1.7, outline: 'none', resize: 'none', boxSizing: 'border-box',
        }}
        onFocus={(e) => (e.target.style.borderColor = '#C4C3BE')}
        onBlur={(e) => (e.target.style.borderColor = '#E2E1DC')}
      />

      {/* Nudge chips */}
      {showNudges && unmentioned.length > 0 && !sweepPhase && (
        <div style={{ marginTop: 16, animation: 'questionIn 0.4s ease-out' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9B9B9B', marginBottom: 10 }}>What about...</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {unmentioned.map(cat => (
              <button key={cat.id} onClick={() => insertCategory(cat.label)} style={{
                padding: '8px 16px', borderRadius: 20, border: '1px dashed #D4D3CE',
                backgroundColor: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontSize: 13,
                fontWeight: 500, color: '#6B6B6B', cursor: 'pointer', minHeight: 36,
              }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#EFEEE9'; e.currentTarget.style.borderColor = '#C4C3BE' }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.borderColor = '#D4D3CE' }}
              >{cat.label}</button>
            ))}
          </div>
        </div>
      )}

      {/* Category sweep */}
      {sweepPhase === 'sweeping' && sweepCat && (
        <div style={{ marginTop: 20, padding: '14px 18px', backgroundColor: '#EFEEE9', borderRadius: 10, animation: 'questionIn 0.4s ease-out' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#1A1A1A', marginBottom: 12, lineHeight: 1.5 }}>
            You haven't mentioned <strong>{sweepCat.label.toLowerCase()}</strong> — anything there, even half-formed thoughts?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={handleSweepAdd} style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #E2E1DC', backgroundColor: '#FFFFFF', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#1A1A1A', cursor: 'pointer', minHeight: 36 }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F6F3')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFFFFF')}
            >Yes, let me add</button>
            <button onClick={handleSweepSkip} style={{ padding: '8px 16px', borderRadius: 8, border: 'none', backgroundColor: 'transparent', fontFamily: "'Outfit', sans-serif", fontSize: 13, fontWeight: 500, color: '#9B9B9B', cursor: 'pointer', minHeight: 36 }}>Nothing there</button>
          </div>
        </div>
      )}

      {/* Fixed bottom bar */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(247, 246, 243, 0.95)', backdropFilter: 'blur(12px)', borderTop: '1px solid #E2E1DC' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '14px 20px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: ideaCount >= 5 ? '#6B6B6B' : '#9B9B9B', lineHeight: 1.4 }}>
            {ideaCount < 5
              ? `Keep going — ${5 - ideaCount} more ${5 - ideaCount === 1 ? 'idea' : 'ideas'} to unlock the next step`
              : `${ideaCount} ideas captured — ready when you are`}
          </div>
          <button onClick={handleDone} disabled={ideaCount < 5} style={{
            padding: '12px 28px', borderRadius: 10, border: 'none',
            backgroundColor: ideaCount >= 5 ? '#1A1A1A' : '#E2E1DC',
            color: ideaCount >= 5 ? '#FFFFFF' : '#9B9B9B',
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: ideaCount >= 5 ? 'pointer' : 'default', minHeight: 44, flexShrink: 0,
          }}>I'm done</button>
        </div>
      </div>

      <style>{`
        @keyframes questionIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}
