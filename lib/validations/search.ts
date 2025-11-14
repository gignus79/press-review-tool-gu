import { z } from 'zod'

/**
 * Validation schema for search configuration
 */
export const searchConfigSchema = z.object({
  query: z.string()
    .min(1, 'Query is required')
    .max(500, 'Query must be less than 500 characters'),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  sources: z.array(z.string()).optional(),
  contentTypes: z.array(z.enum(['article', 'review', 'interview', 'news', 'feature', 'all']))
    .min(1, 'At least one content type must be selected'),
  maxResults: z.number()
    .min(1, 'Maximum results must be at least 1')
    .max(200, 'Maximum results cannot exceed 200')
}).refine(
  (data) => {
    if (data.dateFrom && data.dateTo) {
      return new Date(data.dateFrom) <= new Date(data.dateTo)
    }
    return true
  },
  { 
    message: 'Start date must be before or equal to end date',
    path: ['dateTo']
  }
)

export type SearchConfigInput = z.infer<typeof searchConfigSchema>

