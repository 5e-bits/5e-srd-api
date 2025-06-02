import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as MagicItemController from '@/controllers/api/2014/magicItemController'
import MagicItemModel from '@/models/2014/magicItem'
import { magicItemFactory } from '@/tests/factories/2014/magicItem.factory'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here based on spell test
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('magicitem')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(MagicItemModel)

describe('MagicItemController', () => {
  describe('index', () => {
    it('returns a list of magic items', async () => {
      // Arrange
      const magicItemsData = magicItemFactory.buildList(3)
      // Mongoose documents need _id, factory generates data matching the schema without it
      // Insert directly, letting Mongoose handle _id
      await MagicItemModel.insertMany(magicItemsData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await MagicItemController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      // Check for essential properties returned by the index endpoint
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: magicItemsData[0].index,
            name: magicItemsData[0].name,
            url: magicItemsData[0].url
          }),
          expect.objectContaining({
            index: magicItemsData[1].index,
            name: magicItemsData[1].name,
            url: magicItemsData[1].url
          }),
          expect.objectContaining({
            index: magicItemsData[2].index,
            name: magicItemsData[2].name,
            url: magicItemsData[2].url
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
      // Mock the find method to throw an error
      vi.spyOn(MagicItemModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockRejectedValueOnce(error)
          // Add other methods chained in the controller if necessary
        } as any
        return query
      })

      // Act
      await MagicItemController.index(request, response, mockNext)

      // Assert
      // Status code might not be set if error is passed to next()
      expect(response.statusCode).toBe(200) // Or check if response was sent
      expect(response._getData()).toBe('') // No data sent on error passed to next()
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty list when no magic items exist', async () => {
      // Arrange
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await MagicItemController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })

    // TODO: Add tests for query parameters (e.g., name) if applicable
  })

  describe('show', () => {
    it('returns a single magic item when found', async () => {
      // Arrange
      const itemData = magicItemFactory.build({
        index: 'cloak-of-protection',
        name: 'Cloak of Protection'
      })
      await MagicItemModel.insertMany([itemData]) // Insert as array

      const request = createRequest({ params: { index: 'cloak-of-protection' } })
      const response = createResponse()

      // Act
      await MagicItemController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      // Check against the original data, excluding potential virtuals or _id
      expect(responseData).toMatchObject({
        index: itemData.index,
        name: itemData.name,
        desc: itemData.desc,
        url: itemData.url
        // Add other fields as necessary
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the magic item is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent-item' } })
      const response = createResponse()

      // Act
      await MagicItemController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Controller doesn't set 404, passes to next()
      expect(response._getData()).toBe('') // No data sent
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Called with no arguments for default 404 handling
    })

    it('handles database errors during findOne', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'any-index' } })
      const response = createResponse()
      const error = new Error('Database findOne failed')
      // Mock findOne to throw an error
      vi.spyOn(MagicItemModel, 'findOne').mockRejectedValueOnce(error)

      // Act
      await MagicItemController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
