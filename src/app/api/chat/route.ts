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

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (!user) {
    console.warn('[chat/POST] unauthenticated request', { authError: authError?.message })
    return new Response('Unauthorized', { status: 401 })
  }

  // Rate limit: max 3 concurrent per user
  const current = activeRequests.get(user.id) ?? 0
  if (current >= MAX_CONCURRENT) {
    console.warn('[chat/POST] rate limit hit', { userId: user.id, activeRequests: current })
    return new Response('Too many requests', { status: 429 })
  }
  activeRequests.set(user.id, current + 1)
  console.log('[chat/POST] request accepted', { userId: user.id, activeRequests: current + 1 })

  try {
    const { messages, sessionId, stage } = await req.json()
    console.log('[chat/POST] payload', { sessionId, stage, messageCount: messages.length })

    // Validate session belongs to this user
    const { data: session, error: sessionError } = await supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (!session) {
      console.warn('[chat/POST] session not found', { sessionId, userId: user.id, sessionError: sessionError?.message })
      return new Response('Session not found', { status: 404 })
    }

    // Save user message immediately (before AI responds)
    const lastUserMsg = [...messages].reverse().find((m: { role: string }) => m.role === 'user')
    if (lastUserMsg) {
      const { error: insertError } = await supabase.from('messages').insert({
        session_id: sessionId,
        role: 'user',
        content: lastUserMsg.content,
        stage,
      })
      if (insertError) console.error('[chat/POST] failed to save user message', { sessionId, error: insertError.message })
      else console.log('[chat/POST] user message saved', { sessionId, stage, contentLength: lastUserMsg.content.length })
    }

    const systemPrompt = buildChallengePrompt(session.context as SessionContext)
    console.log('[chat/POST] streaming to Claude', { sessionId, stage, systemPromptLength: systemPrompt.length })

    const result = streamText({
      model: anthropic('claude-opus-4-5'),
      system: systemPrompt,
      messages,
      maxTokens: 1500,
      onError: ({ error }) => {
        console.error('[chat/streamText] Anthropic API error', {
          sessionId,
          error: error instanceof Error ? error.message : error,
          name: error instanceof Error ? error.name : undefined,
        })
      },
      onFinish: async ({ text, usage }) => {
        console.log('[chat/onFinish]', { sessionId, stage, completionTokens: usage.completionTokens, responseLength: text.length })

        const { error: assistantInsertError } = await supabase.from('messages').insert({
          session_id: sessionId,
          role: 'assistant',
          content: text,
          stage,
          token_count: usage.completionTokens,
        })
        if (assistantInsertError) console.error('[chat/onFinish] failed to save assistant message', { sessionId, error: assistantInsertError.message })

        // If this is the final Stage 3 message — parse dashboard
        if (stage === 3 && text.includes('```dashboard')) {
          console.log('[chat/onFinish] dashboard block detected, extracting…', { sessionId })
          try {
            const dashboardData = extractDashboardJSON(text)
            console.log('[chat/onFinish] dashboard parsed', {
              sessionId,
              focusItems: dashboardData.focus_wall.length,
              thisWeekTasks: dashboardData.this_week.length,
            })

            const { error: upsertError } = await supabase.from('dashboards').upsert({
              session_id: sessionId,
              user_id: user.id,
              focus_wall: dashboardData.focus_wall,
              parking_lot: dashboardData.parking_lot,
              this_week: dashboardData.this_week,
            }, { onConflict: 'session_id' })
            if (upsertError) console.error('[chat/onFinish] dashboard upsert failed', { sessionId, error: upsertError.message })

            const { error: stageError } = await supabase
              .from('sessions')
              .update({ stage: 4 })
              .eq('id', sessionId)
            if (stageError) console.error('[chat/onFinish] stage update to 4 failed', { sessionId, error: stageError.message })
            else console.log('[chat/onFinish] session advanced to stage 4', { sessionId })
          } catch (err) {
            console.error('[chat/onFinish] dashboard extraction failed', { sessionId, error: err instanceof Error ? err.message : err })
            // Keep session at stage 3 — founder can continue
          }
        }
      },
    })

    return result.toDataStreamResponse()
  } finally {
    const c = activeRequests.get(user.id) ?? 1
    activeRequests.set(user.id, Math.max(0, c - 1))
    console.log('[chat/POST] request finished', { userId: user.id, activeRequests: Math.max(0, c - 1) })
  }
}
