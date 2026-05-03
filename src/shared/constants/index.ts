export const STAGES = {
  ARRIVAL: 0,
  CALIBRATION: 1,
  BRAIN_DUMP: 2,
  CHALLENGE: 3,
  DASHBOARD: 4,
} as const

export const MAX_FOCUS_ITEMS = 4
export const MIN_FOCUS_ITEMS = 2
export const MIN_BRAIN_DUMP_IDEAS = 5
export const MAX_MESSAGES_PER_SESSION = 50
export const MAX_TOKENS_PER_RESPONSE = 4000

export const CATEGORIES = [
  {
    id: 'product',
    label: 'Product / Tech',
    keywords: ['product', 'tech', 'build', 'prototype', 'software', 'hardware', 'code', 'develop', 'feature', 'mvp', 'app'],
  },
  {
    id: 'team',
    label: 'Team & co-founder',
    keywords: ['team', 'hire', 'co-founder', 'cofounder', 'engineer', 'recrui', 'people', 'talent'],
  },
  {
    id: 'fundraising',
    label: 'Fundraising',
    keywords: ['fund', 'invest', 'rais', 'capital', 'money', 'seed', 'series', 'vc', 'angel'],
  },
  {
    id: 'partnerships',
    label: 'Partnerships',
    keywords: ['partner', 'collab', 'alliance', 'deal', 'integrat', 'vendor', 'supplier'],
  },
  {
    id: 'branding',
    label: 'Branding & marketing',
    keywords: ['brand', 'market', 'logo', 'design', 'social', 'content', 'launch', 'pr', 'advertising'],
  },
  {
    id: 'operations',
    label: 'Operations',
    keywords: ['ops', 'operat', 'admin', 'legal', 'compliance', 'process', 'logistics', 'sales', 'customer', 'pilot'],
  },
] as const

export const TAG_CONFIG = {
  Product:    { accent: '#7C3AED', bg: '#F3F0FF', text: '#6D28D9', border: '#E0D8FD' },
  Team:       { accent: '#2563EB', bg: '#EFF6FF', text: '#1D4ED8', border: '#DBEAFE' },
  Revenue:    { accent: '#059669', bg: '#ECFDF5', text: '#047857', border: '#D1FAE5' },
  Operations: { accent: '#D97706', bg: '#FFFBEB', text: '#B45309', border: '#FEF3C7' },
} as const

export const COLORS = {
  surface:      '#F7F6F3',
  surface2:     '#EFEEE9',
  ink:          '#1A1A1A',
  ink2:         '#6B6B6B',
  ink3:         '#9B9B9B',
  border:       '#E2E1DC',
  borderLight:  '#F0EFEA',
  trapBg:       '#FEF2F2',
  trapBorder:   '#FECACA',
  trapText:     '#991B1B',
  trapAccent:   '#DC2626',
} as const
