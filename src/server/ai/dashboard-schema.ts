import { z } from 'zod'

const FocusItemSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
  context: z.string(),
  tag: z.enum(['Product', 'Team', 'Revenue', 'Operations']),
  tasks: z.array(z.string()).length(3),
  goal: z.string().optional(),
})

const ParkedItemSchema = z.object({
  id: z.string(),
  idea: z.string(),
  reason: z.string(),
})

const TaskSchema = z.object({
  id: z.string(),
  task: z.string(),
  tag: z.enum(['Product', 'Team', 'Revenue', 'Operations']),
})

export const DashboardSchema = z.object({
  focus_wall: z.array(FocusItemSchema).min(2).max(4),
  parking_lot: z.object({
    'Technology': z.array(ParkedItemSchema),
    'Team & culture': z.array(ParkedItemSchema),
    'Partnerships': z.array(ParkedItemSchema),
    'Fundraising & scale': z.array(ParkedItemSchema),
    'Other': z.array(ParkedItemSchema),
  }),
  this_week: z.array(TaskSchema).min(3).max(6),
})

export type ValidatedDashboard = z.infer<typeof DashboardSchema>

export function extractDashboardJSON(aiResponse: string): ValidatedDashboard {
  const match = aiResponse.match(/```dashboard\n([\s\S]*?)\n```/)
  if (!match) {
    console.error('[extractDashboardJSON] no ```dashboard block found in AI response', { responseLength: aiResponse.length, tail: aiResponse.slice(-200) })
    throw new Error('No dashboard JSON block found in AI response')
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(match[1])
  } catch (jsonErr) {
    console.error('[extractDashboardJSON] JSON.parse failed', { error: jsonErr instanceof Error ? jsonErr.message : jsonErr, raw: match[1].slice(0, 300) })
    throw jsonErr
  }
  try {
    const result = DashboardSchema.parse(parsed)
    console.log('[extractDashboardJSON] validation passed', { focusItems: result.focus_wall.length, thisWeekTasks: result.this_week.length })
    return result
  } catch (zodErr) {
    console.error('[extractDashboardJSON] zod validation failed', { error: zodErr instanceof Error ? zodErr.message : zodErr })
    throw zodErr
  }
}
