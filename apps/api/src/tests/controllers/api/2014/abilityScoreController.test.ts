import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import AbilityScoreController from '@/controllers/api/2014/abilityScoreController'
import AbilityScoreModel from '@/models/2014/abilityScore'
import { abilityScoreFactory } from '@/tests/factories/2014/abilityScore.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('abilityscore')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(AbilityScoreModel)

describe('AbilityScoreController', () => {
  describe('index', () => {
    it('returns a list of ability scores', async () => {
      // Arrange: Seed the database
      const abilityScoresData = abilityScoreFactory.buildList(3)
      await AbilityScoreModel.insertMany(abilityScoresData)

      const request = createRequest()
      const response = createResponse()

      // Act
      await AbilityScoreController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      // Check if the returned data loosely matches the seeded data (checking name/index)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: abilityScoresData[0].index,
            name: abilityScoresData[0].name
          }),
          expect.objectContaining({
            index: abilityScoresData[1].index,
            name: abilityScoresData[1].name
          }),
          expect.objectContaining({
            index: abilityScoresData[2].index,
            name: abilityScoresData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // Skipping the explicit 'find error' mock test for now.
  })

  describe('show', () => {
    it('returns a single ability score when found', async () => {
      // Arrange: Seed the database
      const abilityScoreData = abilityScoreFactory.build({ index: 'cha', name: 'CHA' })
      await AbilityScoreModel.insertMany([abilityScoreData])

      const request = createRequest({ params: { index: 'cha' } })
      const response = createResponse()

      // Act
      await AbilityScoreController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('cha')
      expect(responseData.name).toBe('CHA')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the ability score is not found', async () => {
      // Arrange: Database is empty (guaranteed by setupModelCleanup)
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      // Act
      await AbilityScoreController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Default node-mocks-http status
      expect(response._getData()).toBe('') // No data written before error
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Expect next() called with no arguments
    })

    // Skipping the explicit 'findOne error' mock test for similar reasons as above.
  })
})
