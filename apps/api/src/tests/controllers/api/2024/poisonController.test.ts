import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import PoisonController from '@/controllers/api/2024/poisonController'
import Poison2024Model from '@/models/2024/poison'
import { poisonFactory } from '@/tests/factories/2024/poison.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('poison_2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Poison2024Model)

describe('PoisonController', () => {
  describe('index', () => {
    it('returns a list of poisons', async () => {
      const poisonsData = poisonFactory.buildList(3)
      await Poison2024Model.insertMany(poisonsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await PoisonController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const poisonsData = [
        poisonFactory.build({ name: "Assassin's Blood" }),
        poisonFactory.build({ name: 'Truth Serum' })
      ]
      await Poison2024Model.insertMany(poisonsData)
      const request = createRequest({ query: { name: "Assassin's Blood" } })
      const response = createResponse()

      await PoisonController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe("Assassin's Blood")
    })
  })

  describe('show', () => {
    it('returns a single poison when found', async () => {
      const poisonData = poisonFactory.build({
        index: 'assassins-blood',
        name: "Assassin's Blood"
      })
      await Poison2024Model.insertMany([poisonData])
      const request = createRequest({ params: { index: 'assassins-blood' } })
      const response = createResponse()

      await PoisonController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('assassins-blood')
      expect(responseData.name).toBe("Assassin's Blood")
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the poison is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await PoisonController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
