'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/client/lib/supabase'
import { useRouter } from 'next/navigation'

interface Props {
  variant?: 'public' | 'onboard' | 'dashboard'
  email?: string
  onStartOver?: () => void
}

export default function TopBar({ variant = 'public', email = '', onStartOver }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    if (menuOpen) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [menuOpen])

  const initial = email ? email.charAt(0).toUpperCase() : '?'
  const isLoggedIn = variant !== 'public'

  const handleLogout = async () => {
    console.log('[TopBar] signing out', { email })
    const { error } = await supabase.auth.signOut()
    if (error) console.error('[TopBar] signOut error', { message: error.message })
    else console.log('[TopBar] signed out successfully')
    router.push('/')
    router.refresh()
  }

  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 50,
      backgroundColor: 'rgba(247, 246, 243, 0.92)',
      backdropFilter: 'blur(12px)', borderBottom: '1px solid #E2E1DC',
    }}>
      <div style={{
        maxWidth: 640, margin: '0 auto', padding: '10px 20px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        minHeight: 44,
      }}>
        <div style={{
          fontFamily: "'Libre Baskerville', serif", fontSize: 16, fontWeight: 700,
          color: '#1A1A1A', letterSpacing: '-0.02em',
        }}>JustFour</div>

        {isLoggedIn && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {variant === 'onboard' && onStartOver && (
              <button onClick={onStartOver} style={{
                fontFamily: "'Outfit', sans-serif", fontSize: 13, color: '#9B9B9B',
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '8px', borderRadius: 6, minHeight: 44,
                display: 'flex', alignItems: 'center', transition: 'color 0.15s ease',
              }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#6B6B6B')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#9B9B9B')}
              >Start over</button>
            )}

            <div ref={menuRef} style={{ position: 'relative' }}>
              <button onClick={() => setMenuOpen(!menuOpen)} style={{
                width: 36, height: 36, borderRadius: '50%',
                backgroundColor: menuOpen ? '#E2E1DC' : '#EFEEE9',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Outfit', sans-serif", fontSize: 14, fontWeight: 600,
                color: '#4B4B4B', padding: 0, minWidth: 44, minHeight: 44,
                transition: 'background-color 0.15s ease',
              }}
                onMouseEnter={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = '#E2E1DC' }}
                onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.backgroundColor = '#EFEEE9' }}
              >{initial}</button>

              {menuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 6px)', right: 0,
                  width: 220, backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E1DC', borderRadius: 10,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
                  overflow: 'hidden', animation: 'dropdownIn 0.15s ease-out',
                }}>
                  <div style={{
                    padding: '12px 16px 10px', fontFamily: "'Outfit', sans-serif",
                    fontSize: 13, color: '#6B6B6B', borderBottom: '1px solid #F0EFEA',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>{email}</div>
                  <button onClick={() => { setMenuOpen(false); handleLogout() }} style={{
                    width: '100%', padding: '10px 16px', backgroundColor: 'transparent',
                    border: 'none', cursor: 'pointer', fontFamily: "'Outfit', sans-serif",
                    fontSize: 14, color: '#DC2626', textAlign: 'left',
                    minHeight: 44, transition: 'background-color 0.1s ease',
                  }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F7F6F3')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >Log out</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes dropdownIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  )
}
