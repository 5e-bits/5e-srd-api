import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as MonsterController from '@/controllers/api/2014/monsterController'
import MonsterModel from '@/models/2014/monster'
import { monsterFactory } from '@/tests/factories/2014/monster.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
// DB Helper Imports
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

// Remove redis mock - Integration tests will hit the real DB
// vi.mock('@/util', ...)

const mockNext = vi.fn(defaultMockNext)

// Setup DB isolation
const dbUri = generateUniqueDbUri('monster')
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(MonsterModel)

// Removed createMockQuery helper

describe('MonsterController', () => {
  describe('index', () => {
    it('returns a list of monsters with default query', async () => {
      // Arrange: Seed the database
      const monstersData = monsterFactory.buildList(3)
      await MonsterModel.insertMany(monstersData)

      const request = createRequest({ query: {}, originalUrl: '/api/monsters' })
      const response = createResponse()

      // Act
      await MonsterController.index(request, response, mockNext)

      // Assert: Check response based on seeded data
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: monstersData[0].index, name: monstersData[0].name }),
          expect.objectContaining({ index: monstersData[1].index, name: monstersData[1].name }),
          expect.objectContaining({ index: monstersData[2].index, name: monstersData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // Keep challenge_rating tests, but they now hit the DB
    describe('with challenge_rating query', () => {
      const crTestCases = [
        { input: '5', expectedCount: 1, seedCRs: [5, 1, 2] },
        { input: '1,10,0.25', expectedCount: 2, seedCRs: [1, 10, 5] },
        { input: ['2', '4'], expectedCount: 2, seedCRs: [2, 4, 5] },
        { input: 'abc,3,def,0.5', expectedCount: 2, seedCRs: [3, 0.5, 1] },
        { input: ['1', 'xyz', '5'], expectedCount: 2, seedCRs: [1, 5, 10] },
        { input: 'invalid, nope', expectedCount: 3, seedCRs: [1, 2, 3] }, // Expect all when filter is invalid
        { input: '', expectedCount: 3, seedCRs: [1, 2, 3] } // Expect all when filter is empty
      ]

      it.each(crTestCases)(
        'handles challenge rating: $input',
        async ({ input, expectedCount, seedCRs }) => {
          // Arrange: Seed specific CRs
          const monstersToSeed = seedCRs.map((cr) => monsterFactory.build({ challenge_rating: cr }))
          await MonsterModel.insertMany(monstersToSeed)

          const request = createRequest({
            query: { challenge_rating: input },
            originalUrl: '/api/monsters'
          })
          const response = createResponse()

          // Act
          await MonsterController.index(request, response, mockNext)

          // Assert
          expect(response.statusCode).toBe(200)
          const responseData = JSON.parse(response._getData())
          expect(responseData.count).toBe(expectedCount)
          expect(responseData.results).toHaveLength(expectedCount)
          // Optional: Add more specific checks on returned indices if needed
          expect(mockNext).not.toHaveBeenCalled()
        }
      )
    })

    // No need for explicit DB error mocking now, handled by helpers/real errors
    // describe('when something goes wrong', ...)

    // Redis tests are removed as we aren't mocking redis here anymore
    // describe('when data is in Redis cache', ...)
  })

  describe('show', () => {
    it('returns a monster object', async () => {
      // Arrange
      const monsterData = monsterFactory.build({ index: 'goblin' })
      await MonsterModel.insertMany([monsterData])

      const request = createRequest({ params: { index: 'goblin' } })
      const response = createResponse()

      // Act
      await MonsterController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('goblin')
      // Add more detailed checks as needed
      expect(responseData).toHaveProperty('challenge_rating', monsterData.challenge_rating)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the record does not exist', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'non-existent' } })
      const response = createResponse()

      // Act
      await MonsterController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200) // Controller passes to next
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })

    // No need for explicit DB error mocking
    // describe('when something goes wrong', ...)
  })
})
