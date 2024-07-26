import { z } from 'zod'

export const getRoutesParams = z.object({
  id: z.string().uuid(),
})
