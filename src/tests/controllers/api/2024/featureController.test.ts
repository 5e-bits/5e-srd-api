import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import FeatureController from '@/controllers/api/2024/featureController'
import Feature2024Model from '@/models/2024/feature'
import { featureFactory } from '@/tests/factories/2024/feature.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('feature_2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Feature2024Model)

describe('FeatureController', () => {
  describe('index', () => {
    it('returns a list of features', async () => {
      const featuresData = featureFactory.buildList(3)
      await Feature2024Model.insertMany(featuresData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await FeatureController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const featuresData = [
        featureFactory.build({ name: 'Rage' }),
        featureFactory.build({ name: 'Spellcasting' })
      ]
      await Feature2024Model.insertMany(featuresData)
      const request = createRequest({ query: { name: 'Rage' } })
      const response = createResponse()

      await FeatureController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Rage')
    })
  })

  describe('show', () => {
    it('returns a single feature when found', async () => {
      const featureData = featureFactory.build({ index: 'barbarian-rage', name: 'Rage' })
      await Feature2024Model.insertMany([featureData])
      const request = createRequest({ params: { index: 'barbarian-rage' } })
      const response = createResponse()

      await FeatureController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('barbarian-rage')
      expect(responseData.name).toBe('Rage')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the feature is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await FeatureController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
