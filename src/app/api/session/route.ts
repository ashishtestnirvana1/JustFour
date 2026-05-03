import { createClient } from '@/server/db/client'

export async function PATCH(req: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) {
    console.warn('[session/PATCH] unauthenticated', { authError: authError?.message })
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json()
  const { stage, context } = body

  if (typeof stage !== 'number') {
    return new Response('stage must be a number', { status: 400 })
  }

  const updates: Record<string, unknown> = { stage }
  if (context !== undefined) updates.context = context

  const { error } = await supabase
    .from('sessions')
    .update(updates)
    .eq('user_id', user.id)

  if (error) {
    console.error('[session/PATCH] update failed', { userId: user.id, stage, error: error.message })
    return new Response(error.message, { status: 500 })
  }

  console.log('[session/PATCH] stage updated', { userId: user.id, stage })
  return new Response('ok', { status: 200 })
}
