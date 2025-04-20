import { vi, describe, it, expect, afterEach } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import * as MonsterController from '@/controllers/api/2014/monsterController'
import { mockNext } from '@/tests/support'
import Monster from '@/models/2014/monster'
import { monsterFactory } from '@/tests/factories/2014/monster.factory'

// Mock the redisClient methods used in the controller
vi.mock('@/util', async (importOriginal) => {
  const original = await importOriginal<typeof import('@/util')>()
  return {
    ...original, // Keep other exports from the module
    redisClient: {
      get: vi.fn().mockResolvedValue(null), // Keep simple default
      set: vi.fn().mockResolvedValue('OK')
    }
  }
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('index', () => {
  const mockMonstersSummary = monsterFactory
    .buildList(2)
    .map((m) => ({ index: m.index, name: m.name, url: m.url }))

  // Helper to create the mock query object
  const createMockQuery = (resolveValue: any, shouldReject = false, rejectValue?: Error) => {
    const mockQuery = {
      select: vi.fn().mockReturnThis(),
      sort: vi.fn().mockReturnThis(),
      // Make it thenable to simulate await
      then: (resolve: (value: any) => void, reject?: (reason?: any) => void) => {
        if (shouldReject && reject) {
          return Promise.resolve().then(() => reject(rejectValue))
        } else {
          return Promise.resolve().then(() => resolve(resolveValue))
        }
      }
      // Optionally mock exec() if needed: exec: vi.fn().mockResolvedValue(resolveValue)
    }
    return mockQuery
  }

  it('returns a list of objects with default query', async () => {
    const request = createRequest({ query: {}, originalUrl: '/api/monsters' })
    const response = createResponse()

    const mockQuery = createMockQuery(mockMonstersSummary)
    const findSpy = vi.spyOn(Monster, 'find').mockReturnValue(mockQuery as any)

    await MonsterController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({}) // Check find query
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 }) // Check select fields
    expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' }) // Check sort
    // Check the final data sent (assuming ResourceList doesn't modify it much)
    expect(JSON.parse(response._getData())).toEqual({
      count: mockMonstersSummary.length,
      results: mockMonstersSummary
    })
  })

  describe('with challenge_rating query', () => {
    const crTestCases = [
      {
        description: 'handles a single number string',
        query: { challenge_rating: '5' },
        expectedMongoQuery: { challenge_rating: { $in: [5] } }
      },
      {
        description: 'handles a comma-separated string',
        query: { challenge_rating: '1,10,0.25' },
        expectedMongoQuery: { challenge_rating: { $in: [1, 10, 0.25] } }
      },
      {
        description: 'handles an array of number strings',
        query: { challenge_rating: ['2', '4'] },
        expectedMongoQuery: { challenge_rating: { $in: [2, 4] } }
      },
      {
        description: 'handles mixed valid/invalid in a string, ignoring invalid',
        query: { challenge_rating: 'abc,3,def,0.5' },
        expectedMongoQuery: { challenge_rating: { $in: [3, 0.5] } }
      },
      {
        description: 'handles mixed valid/invalid in an array, ignoring invalid',
        query: { challenge_rating: ['1', 'xyz', '5'] },
        expectedMongoQuery: { challenge_rating: { $in: [1, 5] } }
      },
      {
        description: 'handles only invalid values, resulting in no CR filter',
        query: { challenge_rating: 'invalid, nope' },
        expectedMongoQuery: {}
      },
      {
        description: 'handles an empty string, resulting in no CR filter',
        query: { challenge_rating: '' },
        expectedMongoQuery: {}
      }
    ]

    it.each(crTestCases)('$description', async ({ query, expectedMongoQuery }) => {
      const request = createRequest({ query, originalUrl: '/api/monsters' })
      const response = createResponse()
      const mockQuery = createMockQuery(mockMonstersSummary)
      const findSpy = vi.spyOn(Monster, 'find').mockReturnValue(mockQuery as any)

      await MonsterController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(findSpy).toHaveBeenCalledWith(expectedMongoQuery)
      expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
      expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' })
      expect(JSON.parse(response._getData())).toEqual({
        count: mockMonstersSummary.length,
        results: mockMonstersSummary
      })
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Database error')
      const request = createRequest({ query: {}, originalUrl: '/api/monsters' })
      // Mock find to return a query that rejects
      const mockQuery = createMockQuery(null, true, error)
      vi.spyOn(Monster, 'find').mockReturnValue(mockQuery as any)

      await MonsterController.index(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error) // Should now be called with the correct error
      expect(response._getData()).toBe('')
    })
  })

  describe('when data is in Redis cache', () => {
    it('returns cached data and does not call Monster.find', async () => {
      const request = createRequest({ query: {}, originalUrl: '/api/monsters' })
      const response = createResponse()
      const cachedData = {
        count: 1,
        results: [
          { index: 'cached-monster', name: 'Cached Monster', url: '/api/monsters/cached-monster' }
        ]
      }

      // Import the mocked redisClient
      const { redisClient } = await import('@/util')

      // Override the mock for this specific test case
      // Use @ts-expect-error to bypass persistent type inference issue
      // @ts-expect-error Vitest mock override type mismatch
      vi.mocked(redisClient.get).mockResolvedValueOnce(JSON.stringify(cachedData))

      const findSpy = vi.spyOn(Monster, 'find')

      await MonsterController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(JSON.parse(response._getData())).toEqual(cachedData)
      expect(findSpy).not.toHaveBeenCalled()
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})

describe('show', () => {
  const mockMonster = monsterFactory.build({ index: 'test-monster', name: 'Test Monster' })

  const request = createRequest({ params: { index: mockMonster.index } })

  it('returns an object', async () => {
    const response = createResponse()
    // findOne doesn't need complex chaining mock in this controller
    vi.spyOn(Monster, 'findOne').mockResolvedValue(mockMonster as any)

    await MonsterController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(Monster.findOne).toHaveBeenCalledWith({ index: mockMonster.index })
    // Controller returns the full object from findOne
    expect(JSON.parse(response._getData())).toEqual(mockMonster)
  })

  describe('when the record does not exist', () => {
    it('calls next() without error (delegates to 404 handling)', async () => {
      const response = createResponse()
      vi.spyOn(Monster, 'findOne').mockResolvedValue(null)

      const invalidRequest = createRequest({ params: { index: 'non-existent' } })
      await MonsterController.show(invalidRequest, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      vi.spyOn(Monster, 'findOne').mockRejectedValue(error)

      await MonsterController.show(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})
