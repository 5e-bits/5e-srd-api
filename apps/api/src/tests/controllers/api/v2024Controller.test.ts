import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as ApiController from '@/controllers/api/v2024Controller'
import CollectionModel from '@/models/2024/collection'
import { collectionFactory } from '@/tests/factories/2024/collection.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('v2024')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(CollectionModel)

describe('v2024 API Controller', () => {
  describe('index', () => {
    it('returns the map of available API routes', async () => {
      const collectionsData = collectionFactory.buildList(3)
      await CollectionModel.insertMany(collectionsData)

      const request = createRequest()
      const response = createResponse()
      const expectedResponse = collectionsData.reduce(
        (acc, col) => {
          acc[col.index] = `/api/2024/${col.index}`
          return acc
        },
        {} as Record<string, string>
      )
      await ApiController.index(request, response, mockNext)

      // Assert: Check the response
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
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty object when no collections exist', async () => {
      // Arrange: Cleanup is handled by setupModelCleanup
      const request = createRequest()
      const response = createResponse()
      await ApiController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual({})
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
