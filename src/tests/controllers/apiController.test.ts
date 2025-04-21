import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here

import deprecatedApiController from '@/controllers/apiController'
import CollectionModel from '@/models/2014/collection' // Use Model suffix convention

const mockNext = vi.fn(defaultMockNext)

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGODB_URI
  if (!mongoUri) {
    throw new Error('TEST_MONGODB_URI environment variable not set.')
  }
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  vi.clearAllMocks()
  await CollectionModel.deleteMany({})
  // Seed data needed for one of the test cases
  await CollectionModel.insertMany([{ index: 'valid-endpoint' }])
})

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
    const request = createRequest({ path: '/valid-endpoint' })
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
