import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import BackgroundController from '@/controllers/api/2024/backgroundController'
import BackgroundModel from '@/models/2024/background'
import { backgroundFactory } from '@/tests/factories/2024/background.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('background')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(BackgroundModel)

describe('BackgroundController', () => {
  describe('index', () => {
    it('returns a list of backgrounds', async () => {
      const backgroundsData = backgroundFactory.buildList(3)
      await BackgroundModel.insertMany(backgroundsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await BackgroundController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const backgroundsData = [
        backgroundFactory.build({ name: 'Acolyte' }),
        backgroundFactory.build({ name: 'Criminal' })
      ]
      await BackgroundModel.insertMany(backgroundsData)
      const request = createRequest({ query: { name: 'Acolyte' } })
      const response = createResponse()

      await BackgroundController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Acolyte')
    })
  })

  describe('show', () => {
    it('returns a single background when found', async () => {
      const backgroundData = backgroundFactory.build({ index: 'acolyte', name: 'Acolyte' })
      await BackgroundModel.insertMany([backgroundData])
      const request = createRequest({ params: { index: 'acolyte' } })
      const response = createResponse()

      await BackgroundController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('acolyte')
      expect(responseData.name).toBe('Acolyte')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the background is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await BackgroundController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
