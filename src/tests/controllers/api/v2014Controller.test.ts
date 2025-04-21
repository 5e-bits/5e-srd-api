import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import crypto from 'crypto'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here

import * as ApiController from '@/controllers/api/v2014Controller'
import CollectionModel from '@/models/2014/collection' // Use Model suffix convention
import { collectionFactory } from '@/tests/factories/2014/collection.factory' // Import the factory

const mockNext = vi.fn(defaultMockNext)

// Hold the unique connection details for this test file
let fileUniqueDbUri: string | undefined

beforeAll(async () => {
  const baseUri = process.env.TEST_MONGODB_URI_BASE
  if (!baseUri) {
    throw new Error('TEST_MONGODB_URI_BASE environment variable not set. Ensure globalSetup ran.')
  }
  const dbName = `test_v2014_${crypto.randomBytes(4).toString('hex')}`
  fileUniqueDbUri = baseUri + dbName
  await mongoose.connect(fileUniqueDbUri)
})

afterAll(async () => {
  if (mongoose.connection.readyState === 1) {
    try {
      if (mongoose.connection.db) {
        await mongoose.connection.db.dropDatabase()
      }
    } catch (err) {
      console.error(`Error dropping database ${mongoose.connection.name}:`, err)
    }
    await mongoose.disconnect()
  }
})

beforeEach(async () => {
  vi.clearAllMocks()
  // Clear only collections relevant to this test file
  await CollectionModel.deleteMany({})
  // Seed using the factory
  const collectionsData = collectionFactory.buildList(3)
  await CollectionModel.insertMany(collectionsData)
})

describe('v2014 API Controller', () => {
  describe('index', () => {
    it('returns the map of available API routes', async () => {
      // Arrange
      const request = createRequest()
      const response = createResponse()
      // Re-fetch the inserted data to build the expected response accurately
      const insertedCollections = await CollectionModel.find({}).lean()
      const expectedResponse = insertedCollections.reduce(
        (acc, col) => {
          acc[col.index] = `/api/2014/${col.index}`
          return acc
        },
        {} as Record<string, string>
      )

      // Act
      await ApiController.index(request, response, mockNext)

      // Assert
      const actualResponse = JSON.parse(response._getData())
      expect(response.statusCode).toBe(200)
      expect(actualResponse).toEqual(expectedResponse)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during find', async () => {
      // Arrange
      const request = createRequest()
      const response = createResponse()
      const error = new Error('Database find failed')
      vi.spyOn(CollectionModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          exec: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })

      // Act
      await ApiController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Controller passes error to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty object when no collections exist', async () => {
      // Arrange
      await CollectionModel.deleteMany({}) // Ensure collection is empty
      const request = createRequest()
      const response = createResponse()

      // Act
      await ApiController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({})
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
