import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import MonsterController from '@/controllers/api/2024/monsterController'
import Monster2024Model from '@/models/2024/monster'
import { monsterFactory } from '@/tests/factories/2024/monster.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('monster2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Monster2024Model)

describe('Monster2024Controller', () => {
  describe('index', () => {
    it('returns a list of monsters', async () => {
      const monstersData = monsterFactory.buildList(3)
      await Monster2024Model.insertMany(monstersData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await MonsterController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const monstersData = [
        monsterFactory.build({ name: 'Ancient Dragon' }),
        monsterFactory.build({ name: 'Goblin' })
      ]
      await Monster2024Model.insertMany(monstersData)
      const request = createRequest({ query: { name: 'Ancient Dragon' } })
      const response = createResponse()

      await MonsterController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Ancient Dragon')
    })
  })

  describe('show', () => {
    it('returns a single monster when found', async () => {
      const monsterData = monsterFactory.build({ index: 'goblin', name: 'Goblin' })
      await Monster2024Model.insertMany([monsterData])
      const request = createRequest({ params: { index: 'goblin' } })
      const response = createResponse()

      await MonsterController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('goblin')
      expect(responseData.name).toBe('Goblin')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the monster is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await MonsterController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
