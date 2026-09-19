import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import deprecatedApiController from '@/controllers/apiController'
import CollectionModel from '@/models/2014/collection' // Use Model suffix convention
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('api')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(CollectionModel)

describe('deprecated /api controller', () => {
  it('redirects /api/ to /api/2014/', async () => {
    const request = createRequest({ path: '/' }) // Path relative to where the controller is mounted
    const response = createResponse()
    const redirectSpy = vi.spyOn(response, 'redirect')

    await deprecatedApiController(request, response, mockNext)

    expect(response.statusCode).toBe(301)
    expect(redirectSpy).toHaveBeenCalledWith(301, '/api/2014/')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('redirects /api/<valid-endpoint> to /api/2014/<valid-endpoint>', async () => {
    await CollectionModel.insertMany([{ index: 'valid-endpoint' }])
    const request = createRequest({ method: 'GET', path: '/valid-endpoint' })
    const response = createResponse()
    const redirectSpy = vi.spyOn(response, 'redirect')

    await deprecatedApiController(request, response, mockNext)

    expect(response.statusCode).toBe(301)
    expect(redirectSpy).toHaveBeenCalledWith(301, '/api/2014/valid-endpoint')
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('responds with 404 for invalid sub-routes', async () => {
    const request = createRequest({ path: '/invalid-endpoint' })
    const response = createResponse()
    const sendStatusSpy = vi.spyOn(response, 'sendStatus')

    await deprecatedApiController(request, response, mockNext)

    expect(sendStatusSpy).toHaveBeenCalledWith(404)
    expect(mockNext).not.toHaveBeenCalled()
  })
})
