import { createRequest, createResponse } from 'node-mocks-http'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import errorHandler from '@/middleware/errorHandler'

const run = (err: unknown, response = createResponse()) => {
  const next = vi.fn()
  errorHandler(err, createRequest(), response, next)
  return { response, next }
}

beforeEach(() => {
  vi.spyOn(console, 'error').mockImplementation(() => {})
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('errorHandler', () => {
  it('answers 500 with a generic message for an error without a status', () => {
    const { response, next } = run(new Error('connection to mongo at 10.0.0.5 refused'))

    expect(response.statusCode).toBe(500)
    expect(JSON.parse(response._getData())).toEqual({ message: 'Internal Server Error' })
    expect(next).not.toHaveBeenCalled()
  })

  it('keeps a 4xx status and its message', () => {
    const { response } = run(
      Object.assign(new Error('Unexpected token } in JSON'), { status: 400 })
    )

    expect(response.statusCode).toBe(400)
    expect(JSON.parse(response._getData())).toEqual({ message: 'Unexpected token } in JSON' })
  })

  it('keeps a 5xx status but hides its message', () => {
    const { response } = run(Object.assign(new Error('upstream said no'), { status: 502 }))

    expect(response.statusCode).toBe(502)
    expect(JSON.parse(response._getData())).toEqual({ message: 'Internal Server Error' })
  })

  it('reads statusCode when there is no status', () => {
    const { response } = run(Object.assign(new Error('too large'), { statusCode: 413 }))

    expect(response.statusCode).toBe(413)
  })

  it.each([[200], [302], [399], [600], ['404'], [undefined], [null], [418.5]])(
    'falls back to 500 for the unusable status %s',
    (status) => {
      const { response } = run(Object.assign(new Error('odd'), { status }))

      expect(response.statusCode).toBe(500)
    }
  )

  it('logs the stack', () => {
    const error = new Error('boom')

    run(error)

    expect(console.error).toHaveBeenCalledWith(error.stack)
  })

  it('hands the error to Express when a response has already started', () => {
    const response = createResponse()
    Object.defineProperty(response, 'headersSent', { get: () => true })
    const error = new Error('mid-stream')

    const { next } = run(error, response)

    expect(next).toHaveBeenCalledWith(error)
    expect(response._isEndCalled()).toBe(false)
  })
})
