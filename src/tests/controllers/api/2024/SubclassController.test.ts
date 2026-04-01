import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import SubclassController from '@/controllers/api/2024/subclassController'
import SubclassModel from '@/models/2024/subclass'
import { subclassFactory } from '@/tests/factories/2024/subclass.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('subclass')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(SubclassModel)

describe('SubclassController', () => {
  describe('index', () => {
    it('returns a list of subclasses', async () => {
      const subclassesData = subclassFactory.buildList(3)
      await SubclassModel.insertMany(subclassesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await SubclassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const subclassesData = [
        subclassFactory.build({ name: 'Path of the Berserker' }),
        subclassFactory.build({ name: 'Path of the Totem Warrior' })
      ]
      await SubclassModel.insertMany(subclassesData)

      const request = createRequest({ query: { name: 'Berserker' } })
      const response = createResponse()

      await SubclassController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Path of the Berserker')
    })
  })

  describe('show', () => {
    it('returns a single subclass when found', async () => {
      const subclassData = subclassFactory.build({
        index: 'berserker',
        name: 'Path of the Berserker'
      })
      await SubclassModel.insertMany([subclassData])

      const request = createRequest({ params: { index: 'berserker' } })
      const response = createResponse()

      await SubclassController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('berserker')
      expect(responseData.name).toBe('Path of the Berserker')
      expect(responseData.features).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the subclass is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SubclassController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
