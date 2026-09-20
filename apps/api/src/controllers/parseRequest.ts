import { Request, Response } from 'express'
import { z } from 'zod'

const messages = {
  params: 'Invalid path parameters',
  query: 'Invalid query parameters'
} as const

/**
 * Validates `req.params` or `req.query`. On failure it sends the 400 response and returns
 * undefined, so callers return straight away.
 */
export function parseRequest<S extends z.ZodType>(
  req: Request,
  res: Response,
  source: keyof typeof messages,
  schema: S
): z.output<S> | undefined {
  const result = schema.safeParse(req[source])
  if (!result.success) {
    res.status(400).json({ error: messages[source], details: result.error.issues })
    return undefined
  }
  return result.data
}
