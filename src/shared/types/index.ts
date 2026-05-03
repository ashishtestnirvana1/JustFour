export type Tag = 'Product' | 'Team' | 'Revenue' | 'Operations'

export interface SessionContext {
  startup_stage: 'ideation' | 'building' | 'pre_revenue' | 'early_revenue' | 'scaling'
  has_prototype?: boolean
  has_spoken_to_customer?: boolean
  has_cofounder?: boolean
  funding_status?: 'self_funded' | 'outside_money' | 'bootstrapped' | 'seed' | 'series_a_plus'
  shown_user?: boolean
  paying_customer?: boolean
  runway?: string
  team_size?: string
  bottleneck?: string
}

export interface Session {
  id: string
  user_id: string
  stage: number
  context: SessionContext
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  session_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  stage: number
  token_count?: number
  created_at: string
}

export interface FocusItem {
  id: string
  title: string
  subtitle: string
  context: string
  tag: Tag
  tasks: string[]
  goal?: string
}

export interface ParkedItem {
  id: string
  idea: string
  reason: string
}

export interface ParkingLot {
  Technology: ParkedItem[]
  'Team & culture': ParkedItem[]
  Partnerships: ParkedItem[]
  'Fundraising & scale': ParkedItem[]
  Other: ParkedItem[]
}

export interface ThisWeekTask {
  id: string
  task: string
  tag: Tag
}

export interface DashboardData {
  focus_wall: FocusItem[]
  parking_lot: ParkingLot
  this_week: ThisWeekTask[]
}

export interface Dashboard extends DashboardData {
  id: string
  session_id: string
  user_id: string
  version: number
  created_at: string
  updated_at: string
}
