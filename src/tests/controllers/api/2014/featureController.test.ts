import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import FeatureController from '@/controllers/api/2014/featureController'
import FeatureModel from '@/models/2014/feature'
import { featureFactory } from '@/tests/factories/2014/feature.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('feature')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(FeatureModel)

describe('FeatureController', () => {
  describe('index', () => {
    it('returns a list of features', async () => {
      const featuresData = featureFactory.buildList(3)
      const featureDocs = featuresData.map((data) => new FeatureModel(data))
      await FeatureModel.insertMany(featureDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await FeatureController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: featuresData[0].index, name: featuresData[0].name }),
          expect.objectContaining({ index: featuresData[1].index, name: featuresData[1].name }),
          expect.objectContaining({ index: featuresData[2].index, name: featuresData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no features exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await FeatureController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single feature when found', async () => {
      const featureData = featureFactory.build({ index: 'action-surge', name: 'Action Surge' })
      await FeatureModel.insertMany([featureData])

      const request = createRequest({ params: { index: 'action-surge' } })
      const response = createResponse()

      await FeatureController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('action-surge')
      expect(responseData.name).toBe('Action Surge')
      expect(responseData.desc).toEqual(featureData.desc)
      expect(responseData.level).toEqual(featureData.level)
      expect(responseData.class.index).toEqual(featureData.class.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the feature is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await FeatureController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
