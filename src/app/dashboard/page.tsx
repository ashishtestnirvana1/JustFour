import { redirect } from 'next/navigation'
import { createClient } from '@/server/db/client'
import TopBar from '@/client/components/shell/TopBar'
import TrapAlert from '@/client/components/dashboard/TrapAlert'
import FocusWall from '@/client/components/dashboard/FocusWall'
import ParkingLot from '@/client/components/dashboard/ParkingLot'
import ContinueConversationStub from '@/client/components/dashboard/ContinueConversationStub'
import type { Dashboard } from '@/shared/types'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: dashboard } = await supabase
    .from('dashboards')
    .select('*')
    .eq('user_id', user.id)
    .single() as { data: Dashboard | null }

  if (!dashboard) redirect('/onboard')

  const parkedCount = Object.values(dashboard.parking_lot).flat().length

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#F7F6F3' }}>
      <TopBar variant="dashboard" email={user.email ?? ''} />

      <div style={{ maxWidth: 640, margin: '0 auto', padding: '28px 20px 80px' }}>
        <TrapAlert parkedCount={parkedCount} />
        <FocusWall items={dashboard.focus_wall} />
        <ParkingLot data={dashboard.parking_lot} totalCount={parkedCount} />
        <ContinueConversationStub />
      </div>
    </div>
  )
}
