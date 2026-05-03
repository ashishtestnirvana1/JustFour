import { anthropic } from '@ai-sdk/anthropic'
import { streamText } from 'ai'
import { createClient } from '@/server/db/client'
import { buildChallengePrompt } from '@/server/ai/prompts'
import { extractDashboardJSON } from '@/server/ai/dashboard-schema'
import type { SessionContext } from '@/shared/types'

// Per-user in-memory concurrent request counter
const activeRequests = new Map<string, number>()
const MAX_CONCURRENT = 3

export async function POST(req: Request) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate limit: max 3 concurrent per user
  const current = activeRequests.get(user.id) ?? 0
  if (current >= MAX_CONCURRENT) {
    return new Response('Too many requests', { status: 429 })
  }
  activeRequests.set(user.id, current + 1)

  try {
    const { messages, sessionId, stage } = await req.json()

    // Validate session belongs to this user
    const { data: session } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      return new Response('Session not found', { status: 404 })
    }

    // Save user message immediately (before AI responds)
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    if (lastUserMsg) {
      await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'user',
        content: lastUserMsg.content,
        stage,
      })
    }

    const systemPrompt = buildChallengePrompt(session.context as SessionContext)

    const result = streamText({
      model: anthropic('claude-opus-4-5'),
      system: systemPrompt,
      messages,
      maxTokens: 1500,
      onFinish: async ({ text, usage }) => {
        // Save assistant message
        await supabase.from('messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: text,
          stage,
          token_count: usage.completionTokens,
        })

        // If this is the final Stage 3 message — parse dashboard
        if (stage === 3 && text.includes('```dashboard')) {
          try {
            const dashboardData = extractDashboardJSON(text)

            await supabase.from('dashboards').upsert({
              session_id: sessionId,
              user_id: user.id,
              focus_wall: dashboardData.focus_wall,
              parking_lot: dashboardData.parking_lot,
              this_week: dashboardData.this_week,
            }, { onConflict: 'session_id' })

            await supabase
              .from('sessions')
              .update({ stage: 4 })
              .eq('id', sessionId)
          } catch (err) {
            console.error('Dashboard extraction failed:', err)
            // Keep session at stage 3 — founder can continue
          }
        }
      },
    })

    return result.toDataStreamResponse()
  } finally {
    const c = activeRequests.get(user.id) ?? 1
    activeRequests.set(user.id, Math.max(0, c - 1))
  }
}
