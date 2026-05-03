'use client'

import { useState, useRef } from 'react'
import { createClient } from '@/client/lib/supabase'
import TopBar from '@/client/components/shell/TopBar'
import MagicLinkSent from '@/client/components/auth/MagicLinkSent'

export default function HomePage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)

  const handleSubmit = async () => {
    if (!isValidEmail(email)) {
      setEmailError('Enter a valid email')
      return
    }
    setEmailError('')
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
      })
      if (error) {
        console.error('[signInWithOtp] error:', { message: error.message, status: error.status, name: error.name })
        throw error
      }
      console.log('[signInWithOtp] magic link sent to', email)
      setSubmitted(true)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      if (msg.toLowerCase().includes('rate') || msg.toLowerCase().includes('too many')) {
        setEmailError('Too many attempts. Wait a few minutes and try again.')
      } else {
        setEmailError(`Something went wrong: ${msg}`)
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { e.preventDefault(); handleSubmit() }
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F6F3' }}>
      <TopBar variant="public" />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '0 20px 80px' }}>

        {/* HERO */}
        <div style={{ paddingTop: 72, marginBottom: 56, animation: 'fadeUp 0.8s ease-out' }}>
          <h1 style={{
            fontFamily: "'Libre Baskerville', serif", fontSize: 36, fontWeight: 700,
            color: '#1A1A1A', letterSpacing: '-0.03em', lineHeight: 1.15, margin: 0,
          }}>
            Stop doing everything.
          </h1>
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 18, color: '#6B6B6B',
            letterSpacing: '-0.01em', marginTop: 16,
          }}>
            Four things. This week. That's it.
          </div>
        </div>

        {/* RECOGNITION CARDS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 48, animation: 'fadeUp 0.8s ease-out 0.15s both' }}>
          {[
            { emoji: '🗂', text: 'You have 23 tabs open — none of them are your product.' },
            { emoji: '📊', text: 'You spent Tuesday on your pitch deck. You have no customers yet.' },
            { emoji: '😴', text: 'You went to bed exhausted. Nothing moved.' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'flex-start', gap: 14,
              padding: '16px 20px', backgroundColor: '#FFFFFF',
              border: '1px solid #E2E1DC', borderRadius: 10,
            }}>
              <span style={{ fontSize: 20, flexShrink: 0, lineHeight: 1.4 }}>{item.emoji}</span>
              <span style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#1A1A1A', lineHeight: 1.5, letterSpacing: '-0.01em' }}>
                {item.text}
              </span>
            </div>
          ))}
          <div style={{
            fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
            color: '#991B1B', textAlign: 'center', padding: '12px 0 0', letterSpacing: '-0.01em',
          }}>
            This is the Founder's Trap. Every founder falls in. Most never notice.
          </div>
        </div>

        {/* DIVIDER */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginBottom: 48 }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{ width: 4, height: 4, borderRadius: '50%', backgroundColor: '#D4D3CE' }} />
          ))}
        </div>

        {/* INSIGHT */}
        <div style={{ marginBottom: 56, animation: 'fadeUp 0.8s ease-out 0.3s both' }}>
          <div style={{
            fontFamily: "'Libre Baskerville', serif", fontSize: 17, fontStyle: 'italic',
            color: '#4B4B4B', lineHeight: 1.7, letterSpacing: '-0.01em',
          }}>
            Not all your ideas are wrong. Most of them are just early.
          </div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 15, color: '#6B6B6B', lineHeight: 1.7, marginTop: 16 }}>
            The difference between a founder who moves and one who spins isn't intelligence or effort — it's knowing which week you're in. What's today's job? What's next month's job? Getting that wrong is how good startups die quietly.
          </div>
        </div>

        {/* CTA */}
        <div style={{ animation: 'fadeUp 0.8s ease-out 0.45s both' }}>
          {!submitted ? (
            <div>
              <div style={{
                fontFamily: "'Libre Baskerville', serif", fontSize: 20, fontWeight: 700,
                color: '#1A1A1A', letterSpacing: '-0.02em', marginBottom: 6,
              }}>Ready to find out?</div>
              <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 14, color: '#9B9B9B', marginBottom: 20 }}>
                One conversation. Under 10 minutes. A plan you can actually act on.
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input
                    ref={inputRef}
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError('') }}
                    onKeyDown={handleKeyDown}
                    placeholder="you@startup.com"
                    style={{
                      width: '100%', height: 52, padding: '0 16px', borderRadius: 12,
                      border: `1px solid ${emailError ? '#DC2626' : '#E2E1DC'}`,
                      backgroundColor: '#FFFFFF', fontFamily: "'Outfit', sans-serif",
                      fontSize: 15, color: '#1A1A1A', outline: 'none', boxSizing: 'border-box',
                    }}
                    onFocus={(e) => { if (!emailError) e.target.style.borderColor = '#1A1A1A' }}
                    onBlur={(e) => { if (!emailError) e.target.style.borderColor = '#E2E1DC' }}
                  />
                  {emailError && (
                    <div style={{ position: 'absolute', bottom: -22, left: 2, fontFamily: "'Outfit', sans-serif", fontSize: 12, color: '#DC2626' }}>
                      {emailError}
                    </div>
                  )}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  style={{
                    height: 52, padding: '0 28px', borderRadius: 12, border: 'none',
                    backgroundColor: submitting ? '#6B6B6B' : '#1A1A1A',
                    color: '#FFFFFF', fontFamily: "'Outfit', sans-serif",
                    fontSize: 15, fontWeight: 600, cursor: submitting ? 'default' : 'pointer',
                    letterSpacing: '-0.01em', whiteSpace: 'nowrap', flexShrink: 0,
                  }}
                  onMouseEnter={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#333333' }}
                  onMouseLeave={(e) => { if (!submitting) (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#1A1A1A' }}
                >
                  {submitting ? 'Sending...' : 'Dump your list →'}
                </button>
              </div>
            </div>
          ) : (
            <MagicLinkSent
              email={email}
              onResend={async () => {
                const { error } = await supabase.auth.signInWithOtp({
                  email,
                  options: { emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback` },
                })
                if (error) console.error('[signInWithOtp resend] error:', { message: error.message, status: error.status })
                else console.log('[signInWithOtp resend] resent to', email)
              }}
              onChangeEmail={() => {
                setSubmitted(false)
                setEmail('')
                setTimeout(() => inputRef.current?.focus(), 100)
              }}
            />
          )}
        </div>

        {/* FOOTER */}
        <div style={{
          marginTop: 80, paddingTop: 24, borderTop: '1px solid #E2E1DC',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8,
        }}>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9B9B9B' }}>JustFour © 2026</div>
          <div style={{ fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#B0B0B0', fontStyle: 'italic' }}>
            Built for founders who are ready to be honest about this week.
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
