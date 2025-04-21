import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here

import deprecatedApiController from '@/controllers/apiController'
import CollectionModel from '@/models/2014/collection' // Use Model suffix convention

const mockNext = vi.fn(defaultMockNext)

// Apply DB isolation pattern
const fileUniqueDbUri = `${process.env.TEST_MONGODB_URI_BASE}test_apicontroller_${crypto.randomBytes(4).toString('hex')}`

describe('deprecated /api controller', () => {
  beforeAll(async () => {
    // Connect to isolated DB
    await mongoose.connect(fileUniqueDbUri)
  })

  afterAll(async () => {
    // Drop and disconnect isolated DB
    if (mongoose.connection.db) {
      await mongoose.connection.db.dropDatabase()
    }
    await mongoose.disconnect()
  })

  beforeEach(async () => {
    vi.clearAllMocks()
    // Clean the relevant model before each test
    await CollectionModel.deleteMany({})
  })

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
