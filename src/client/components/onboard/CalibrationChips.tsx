'use client'

import { useState, useEffect } from 'react'
import type { SessionContext } from '@/shared/types'

const STAGE_OPTIONS = [
  { id: 'ideation',      label: 'Ideation',      desc: 'Have an idea, haven\'t started building yet' },
  { id: 'building',      label: 'Building',       desc: 'Actively prototyping, nothing in users\' hands' },
  { id: 'pre_revenue',   label: 'Pre-revenue',    desc: 'Have something to show, talking to customers, no revenue yet' },
  { id: 'early_revenue', label: 'Early revenue',  desc: 'First paying customers' },
  { id: 'scaling',       label: 'Scaling',        desc: 'Proven model, growing' },
]

type StageId = 'ideation' | 'building' | 'pre_revenue' | 'early_revenue' | 'scaling'

const STAGE_QUESTIONS: Record<StageId, { id: string; q: string; options: string[] }[]> = {
  ideation: [
    { id: 'has_prototype',        q: 'Do you have any kind of working prototype, even rough?', options: ['Yes', 'No'] },
    { id: 'has_spoken_to_customer', q: 'Have you spoken to a potential customer yet?',         options: ['Yes', 'No'] },
    { id: 'has_cofounder',        q: 'Is anyone else working on this with you?',               options: ['Yes', 'No'] },
  ],
  building: [
    { id: 'has_cofounder',  q: 'Do you have a co-founder or committed technical collaborator?', options: ['Yes', 'No'] },
    { id: 'shown_user',     q: 'Have you shown anything to a potential user?',                  options: ['Yes', 'No'] },
    { id: 'funding_status', q: 'Are you self-funded or do you have outside money?',             options: ['Self-funded', 'Outside money'] },
  ],
  pre_revenue: [
    { id: 'paying_customer', q: 'Do you have a paying customer or signed letter of intent?', options: ['Yes', 'No'] },
    { id: 'runway',          q: 'How long is your runway?',                                   options: ['< 6 months', '6–12 months', '12+ months'] },
    { id: 'has_cofounder',   q: 'Do you have a co-founder?',                                  options: ['Yes', 'No'] },
  ],
  early_revenue: [
    { id: 'funding_status', q: 'Funding status?', options: ['Bootstrapped', 'Seed', 'Series A+'] },
    { id: 'team_size',      q: 'Team size?',       options: ['Solo', '2–5', '6+'] },
  ],
  scaling: [
    { id: 'funding_status', q: 'Funding status?', options: ['Bootstrapped', 'Seed', 'Series A+'] },
    { id: 'team_size',      q: 'Team size?',       options: ['Solo', '2–5', '6+'] },
  ],
}

interface Props { onComplete: (ctx: SessionContext) => void }

function StageChip({ option, selected, onSelect, dimmed }: {
  option: typeof STAGE_OPTIONS[0]; selected: string | null; onSelect: (id: string) => void; dimmed: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const isSelected = selected === option.id
  return (
    <button onClick={() => onSelect(option.id)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', padding: '14px 18px', borderRadius: 10,
        border: `1px solid ${isSelected ? '#1A1A1A' : hovered ? '#C4C3BE' : '#E2E1DC'}`,
        backgroundColor: isSelected ? '#1A1A1A' : hovered ? '#FAFAF8' : '#FFFFFF',
        cursor: dimmed ? 'default' : 'pointer', textAlign: 'left',
        transition: 'all 0.15s ease', minHeight: 44,
        opacity: dimmed && !isSelected ? 0.4 : 1,
        pointerEvents: dimmed ? 'none' : 'auto',
      }}>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, fontWeight: 600, color: isSelected ? '#FFFFFF' : '#1A1A1A', marginBottom: 3 }}>{option.label}</div>
      <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: isSelected ? 'rgba(255,255,255,0.6)' : '#9B9B9B' }}>{option.desc}</div>
    </button>
  )
}

function AnswerChip({ label, selected, onSelect }: { label: string; selected: string | undefined; onSelect: (l: string) => void }) {
  const [hovered, setHovered] = useState(false)
  const isSelected = selected === label
  return (
    <button onClick={() => onSelect(label)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
      style={{
        padding: '10px 20px', borderRadius: 8,
        border: `1px solid ${isSelected ? '#1A1A1A' : hovered ? '#C4C3BE' : '#E2E1DC'}`,
        backgroundColor: isSelected ? '#1A1A1A' : hovered ? '#FAFAF8' : '#FFFFFF',
        cursor: 'pointer', fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 500,
        color: isSelected ? '#FFFFFF' : '#1A1A1A', transition: 'all 0.15s ease', minHeight: 44,
      }}>{label}</button>
  )
}

export default function CalibrationChips({ onComplete }: Props) {
  const [stage, setStage] = useState<StageId | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [transitioning, setTransitioning] = useState(false)

  const stageQuestions = stage ? (STAGE_QUESTIONS[stage] ?? []) : []
  const allAnswered = stage !== null && currentQ >= stageQuestions.length

  const handleStageSelect = (id: string) => {
    setStage(id as StageId)
    setCurrentQ(0)
    setAnswers({})
  }

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }))
    setTimeout(() => setCurrentQ(prev => prev + 1), 300)
  }

  useEffect(() => {
    if (allAnswered && !transitioning) {
      setTransitioning(true)
      setTimeout(() => {
        onComplete({ startup_stage: stage! as SessionContext['startup_stage'], ...answers } as unknown as SessionContext)
      }, 800)
    }
  }, [allAnswered, transitioning, stage, answers, onComplete])

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '60px 20px 80px', minHeight: 'calc(100vh - 65px)' }}>
      {/* Q1 */}
      <div style={{ marginBottom: 48, opacity: stage ? 0.5 : 1, transition: 'opacity 0.4s ease', animation: 'questionIn 0.5s ease-out' }}>
        <div style={{ fontFamily: "'Libre Baskerville', serif", fontSize: 22, fontWeight: 700, color: '#1A1A1A', letterSpacing: '-0.03em', marginBottom: 8 }}>Where are you right now?</div>
        <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B', marginBottom: 20 }}>This calibrates the conversation to your stage.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {STAGE_OPTIONS.map(opt => <StageChip key={opt.id} option={opt} selected={stage} onSelect={handleStageSelect} dimmed={!!stage} />)}
        </div>
      </div>

      {/* Q2 — progressive */}
      {stage && stageQuestions.map((sq, i) => {
        if (i > currentQ) return null
        const isActive = i === currentQ
        return (
          <div key={sq.id} style={{ marginBottom: 36, animation: 'questionIn 0.4s ease-out', opacity: isActive ? 1 : 0.5, transition: 'opacity 0.4s ease' }}>
            <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 16, fontWeight: 600, color: '#1A1A1A', marginBottom: 14, lineHeight: 1.4 }}>{sq.q}</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {sq.options.map(opt => (
                <AnswerChip key={opt} label={opt} selected={answers[sq.id]}
                  onSelect={(ans) => { if (isActive && !answers[sq.id]) handleAnswer(sq.id, ans) }} />
              ))}
            </div>
          </div>
        )
      })}

      {allAnswered && (
        <div style={{ textAlign: 'center', padding: '24px 0', animation: 'questionIn 0.5s ease-out' }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#047857', fontWeight: 500 }}>Got it. Let's get everything out of your head.</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 4, marginTop: 16 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#047857', animation: `pulse 1.4s ease-in-out ${i * 0.2}s infinite` }} />)}
          </div>
        </div>
      )}

      <style>{`
        @keyframes questionIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes pulse { 0%, 80%, 100% { opacity: 0.3; transform: scale(0.8); } 40% { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  )
}
