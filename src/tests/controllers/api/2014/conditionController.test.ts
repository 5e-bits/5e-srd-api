import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import ConditionController from '@/controllers/api/2014/conditionController'
import ConditionModel from '@/models/2014/condition'
import { conditionFactory } from '@/tests/factories/2014/condition.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('condition')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(ConditionModel)

describe('ConditionController', () => {
  describe('index', () => {
    it('returns a list of conditions', async () => {
      const conditionsData = conditionFactory.buildList(3)
      const conditionDocs = conditionsData.map((data) => new ConditionModel(data))
      await ConditionModel.insertMany(conditionDocs)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ConditionController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: conditionsData[0].index, name: conditionsData[0].name }),
          expect.objectContaining({ index: conditionsData[1].index, name: conditionsData[1].name }),
          expect.objectContaining({ index: conditionsData[2].index, name: conditionsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no conditions exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ConditionController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single condition when found', async () => {
      const conditionData = conditionFactory.build({ index: 'blinded', name: 'Blinded' })
      await ConditionModel.insertMany([conditionData])
      const request = createRequest({ params: { index: 'blinded' } })
      const response = createResponse()

      await ConditionController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('blinded')
      expect(responseData.name).toBe('Blinded')
      expect(responseData.desc).toEqual(conditionData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the condition is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ConditionController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
