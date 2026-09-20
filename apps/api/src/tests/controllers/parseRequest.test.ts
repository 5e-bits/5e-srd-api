import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it } from 'vitest'
import { z } from 'zod'

import { parseRequest } from '@/controllers/parseRequest'

const schema = z.object({ index: z.string().min(1) })

describe('parseRequest', () => {
  it('returns the parsed data and sends nothing when valid', () => {
    const res = createResponse()

    const result = parseRequest(
      createRequest({ params: { index: 'wizard' } }),
      res,
      'params',
      schema
    )

    expect(result).toEqual({ index: 'wizard' })
    expect(res._isEndCalled()).toBe(false)
  })

  it('sends a 400 for invalid path parameters and returns undefined', () => {
    const res = createResponse()

    const result = parseRequest(createRequest({ params: { index: '' } }), res, 'params', schema)

    expect(result).toBeUndefined()
    expect(res.statusCode).toBe(400)
    const body = JSON.parse(res._getData())
    expect(body.error).toBe('Invalid path parameters')
    expect(body.details).toHaveLength(1)
  })

  it('sends a 400 for invalid query parameters and returns undefined', () => {
    const res = createResponse()

    const result = parseRequest(createRequest({ query: {} }), res, 'query', schema)

    expect(result).toBeUndefined()
    expect(res.statusCode).toBe(400)
    expect(JSON.parse(res._getData()).error).toBe('Invalid query parameters')
  })
})
