import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import FeatController from '@/controllers/api/2014/featController'
import FeatModel from '@/models/2014/feat' // Use Model suffix
import { featFactory } from '@/tests/factories/2014/feat.factory' // Import factory
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('feat')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(FeatModel)

describe('FeatController', () => {
  describe('index', () => {
    it('returns a list of feats', async () => {
      // Arrange
      const featsData = featFactory.buildList(3)
      await FeatModel.insertMany(featsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await FeatController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          // Index action returns index, name, url
          expect.objectContaining({
            index: featsData[0].index,
            name: featsData[0].name,
            url: featsData[0].url
          }),
          expect.objectContaining({
            index: featsData[1].index,
            name: featsData[1].name,
            url: featsData[1].url
          }),
          expect.objectContaining({
            index: featsData[2].index,
            name: featsData[2].name,
            url: featsData[2].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during find', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()
      const error = new Error('Database find failed')
      vi.spyOn(FeatModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          exec: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })

      // Act
      await FeatController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Controller passes error to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty list when no feats exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()
      await FeatController.index(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single feat when found', async () => {
      // Arrange
      const featData = featFactory.build({ index: 'tough', name: 'Tough' })
      await FeatModel.insertMany([featData])
      const request = createRequest({ params: { index: 'tough' } })
      const response = createResponse()

      // Act
      await FeatController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      // Check specific fields returned by show
      expect(responseData).toMatchObject({
        index: featData.index,
        name: featData.name,
        prerequisites: expect.any(Array), // Check structure if needed
        desc: featData.desc,
        url: featData.url
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the feat is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await FeatController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles database errors during findOne', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'tough' } })
      const response = createResponse()
      const error = new Error('Database findOne failed')
      vi.spyOn(FeatModel, 'findOne').mockRejectedValueOnce(error)

      // Act
      await FeatController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
