import { createRequest, createResponse } from 'node-mocks-http'
import { afterEach, describe, expect, it, vi } from 'vitest'

import ImageController from '@/controllers/api/imageController'
import { mockNext as defaultMockNext } from '@/tests/support'

const mockNext = vi.fn(defaultMockNext)

const bodyOf = (chunks: string[], failAfter?: number) => {
  const encoder = new TextEncoder()
  let sent = 0
  return new ReadableStream<Uint8Array>({
    pull(controller) {
      if (failAfter !== undefined && sent >= failAfter) {
        controller.error(new Error('stream broke'))
        return
      }
      if (sent < chunks.length) controller.enqueue(encoder.encode(chunks[sent++]))
      else controller.close()
    }
  })
}

const stubFetch = (response: Response | Error) => {
  const fetchMock = vi.fn(async () => {
    if (response instanceof Error) throw response
    return response
  })
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

const show = async (url: string) => {
  const request = createRequest({ url })
  const response = createResponse({ eventEmitter: (await import('events')).EventEmitter })
  await ImageController.show(request, response, mockNext)
  return response
}

afterEach(() => {
  vi.unstubAllGlobals()
  mockNext.mockClear()
})

describe('ImageController.show', () => {
  it('responds 400 without fetching for an invalid path', async () => {
    const fetchMock = stubFetch(new Response('unused'))

    const response = await show('/monsters/bad!name.png')

    expect(response.statusCode).toBe(400)
    expect(fetchMock).not.toHaveBeenCalled()
  })

  it('fetches the public bucket URL and streams the image', async () => {
    const fetchMock = stubFetch(
      new Response(bodyOf(['ab', 'cd']), {
        headers: { 'content-type': 'image/png', 'content-length': '4' }
      })
    )

    const response = await show('/monsters/aboleth.png')

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringMatching(
        /^https:\/\/dnd-5e-api-images\.s3\.[a-z0-9-]+\.amazonaws\.com\/monsters\/aboleth\.png$/
      )
    )
    expect(response.statusCode).toBe(200)
    expect(response.getHeader('Content-Type')).toBe('image/png')
    expect(response.getHeader('Content-Length')).toBe('4')
    expect(response._getData().toString()).toBe('abcd')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('passes an upstream error status and body through', async () => {
    stubFetch(new Response('no such key', { status: 403 }))

    const response = await show('/monsters/missing.png')

    expect(response.statusCode).toBe(403)
    expect(response._getData()).toBe('no such key')
  })

  it('hands a failed fetch to the error handler as a 502', async () => {
    const error = new Error('getaddrinfo ENOTFOUND')
    stubFetch(error)

    await show('/monsters/aboleth.png')

    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockNext).toHaveBeenCalledWith(error)
    expect((mockNext.mock.calls[0][0] as { status?: number }).status).toBe(502)
  })

  it('drops the image Content-Length when a stream fails before any data', async () => {
    stubFetch(
      new Response(bodyOf([], 0), {
        headers: { 'content-type': 'image/png', 'content-length': '999' }
      })
    )

    const response = await show('/monsters/aboleth.png')

    expect(response.getHeader('Content-Length')).toBeUndefined()
    expect(mockNext).toHaveBeenCalledOnce()
    expect((mockNext.mock.calls[0][0] as { status?: number }).status).toBe(502)
  })

  it('ends the connection when the stream fails after data was sent', async () => {
    stubFetch(new Response(bodyOf(['ab', 'cd'], 1), { headers: { 'content-type': 'image/png' } }))
    const request = createRequest({ url: '/monsters/aboleth.png' })
    const response = createResponse()
    Object.defineProperty(response, 'headersSent', { get: () => response._getData().length > 0 })
    response.destroy = vi.fn() as any
    vi.spyOn(console, 'error').mockImplementation(() => {})

    await ImageController.show(request, response, mockNext)

    expect(response.destroy).toHaveBeenCalledOnce()
    expect(mockNext).not.toHaveBeenCalled()
  })
})
