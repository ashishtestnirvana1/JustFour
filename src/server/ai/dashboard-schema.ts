import { z } from 'zod'

const FocusItemSchema = z.object({
  id: z.string(),
  goal: z.string(),
  tag: z.enum(['Product', 'Team', 'Revenue', 'Operations']),
  tasks: z.array(z.string()).length(3),
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
  if (!match) throw new Error('No dashboard JSON block found in AI response')
  const parsed = JSON.parse(match[1])
  return DashboardSchema.parse(parsed)
}
