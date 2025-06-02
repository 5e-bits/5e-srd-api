import { type Model } from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { beforeAll, describe, expect, it, vi } from 'vitest'

import SimpleController from '@/controllers/simpleController'
import AbilityScoreModel from '@/models/2014/abilityScore' // Use Model suffix convention
import { abilityScoreFactory } from '@/tests/factories/2014/abilityScore.factory' // Import factory
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming mockNext is here
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('simple')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(AbilityScoreModel)

let abilityScoreController: SimpleController // Keep declaration

describe('SimpleController (with AbilityScore)', () => {
  beforeAll(async () => {
    // Initialize controller after connection
    abilityScoreController = new SimpleController(AbilityScoreModel as Model<any>)
  })

  describe('index', () => {
    it('returns a list of documents', async () => {
      // Arrange
      const scoresData = abilityScoreFactory.buildList(3)
      await AbilityScoreModel.insertMany(scoresData)
      const request = createRequest()
      const response = createResponse()

      // Act
      await abilityScoreController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          // SimpleController index returns index, name, url
          expect.objectContaining({
            index: scoresData[0].index,
            name: scoresData[0].name,
            url: scoresData[0].url
          }),
          expect.objectContaining({
            index: scoresData[1].index,
            name: scoresData[1].name,
            url: scoresData[1].url
          }),
          expect.objectContaining({
            index: scoresData[2].index,
            name: scoresData[2].name,
            url: scoresData[2].url
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('handles database errors during find', async () => {
      // Arrange
      const request = createRequest()
      const response = createResponse()
      const error = new Error('Database find failed')
      vi.spyOn(AbilityScoreModel, 'find').mockImplementationOnce(() => {
        const query = {
          select: vi.fn().mockReturnThis(),
          sort: vi.fn().mockReturnThis(),
          exec: vi.fn().mockRejectedValueOnce(error)
        } as any
        return query
      })

      // Act
      await abilityScoreController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })

    it('returns an empty list when no documents exist', async () => {
      const request = createRequest()
      const response = createResponse()
      await abilityScoreController.index(request, response, mockNext)
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single document when found', async () => {
      // Arrange
      const scoreData = abilityScoreFactory.build({ index: 'str', name: 'STR' })
      await AbilityScoreModel.insertMany([scoreData])
      const request = createRequest({ params: { index: 'str' } })
      const response = createResponse()

      // Act
      await abilityScoreController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      // Check against the specific fields returned by show
      expect(responseData).toMatchObject({
        index: scoreData.index,
        name: scoreData.name,
        full_name: scoreData.full_name,
        desc: scoreData.desc
        // url is often included too
      })
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the document is not found', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await abilityScoreController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('handles database errors during findOne', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'str' } })
      const response = createResponse()
      const error = new Error('Database findOne failed')
      vi.spyOn(AbilityScoreModel, 'findOne').mockRejectedValueOnce(error)

      // Act
      await abilityScoreController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
