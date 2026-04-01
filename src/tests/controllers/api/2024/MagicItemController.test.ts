import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import MagicItemController from '@/controllers/api/2024/magicItemController'
import MagicItemModel from '@/models/2024/magicItem'
import { magicItemFactory } from '@/tests/factories/2024/magicItem.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('magic-item')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(MagicItemModel)

describe('MagicItemController', () => {
  describe('index', () => {
    it('returns a list of magic items', async () => {
      const itemsData = magicItemFactory.buildList(3)
      await MagicItemModel.insertMany(itemsData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await MagicItemController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const itemsData = [
        magicItemFactory.build({ name: 'Bag of Holding' }),
        magicItemFactory.build({ name: 'Cloak of Elvenkind' })
      ]
      await MagicItemModel.insertMany(itemsData)

      const request = createRequest({ query: { name: 'Bag' } })
      const response = createResponse()

      await MagicItemController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Bag of Holding')
    })
  })

  describe('show', () => {
    it('returns a single magic item when found', async () => {
      const itemData = magicItemFactory.build({ index: 'bag-of-holding', name: 'Bag of Holding' })
      await MagicItemModel.insertMany([itemData])

      const request = createRequest({ params: { index: 'bag-of-holding' } })
      const response = createResponse()

      await MagicItemController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('bag-of-holding')
      expect(responseData.name).toBe('Bag of Holding')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the magic item is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await MagicItemController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
