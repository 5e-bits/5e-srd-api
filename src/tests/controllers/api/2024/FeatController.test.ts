import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import FeatController from '@/controllers/api/2024/featController'
import FeatModel from '@/models/2024/feat'
import { featFactory } from '@/tests/factories/2024/feat.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('feat')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(FeatModel)

describe('FeatController', () => {
  describe('index', () => {
    it('returns a list of feats', async () => {
      const featsData = featFactory.buildList(3)
      await FeatModel.insertMany(featsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await FeatController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const featsData = [featFactory.build({ name: 'Alert' }), featFactory.build({ name: 'Lucky' })]
      await FeatModel.insertMany(featsData)
      const request = createRequest({ query: { name: 'Alert' } })
      const response = createResponse()

      await FeatController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Alert')
    })
  })

  describe('show', () => {
    it('returns a single feat when found', async () => {
      const featData = featFactory.build({ index: 'alert', name: 'Alert' })
      await FeatModel.insertMany([featData])
      const request = createRequest({ params: { index: 'alert' } })
      const response = createResponse()

      await FeatController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('alert')
      expect(responseData.name).toBe('Alert')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the feat is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await FeatController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
