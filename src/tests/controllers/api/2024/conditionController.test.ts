import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import ConditionController from '@/controllers/api/2024/conditionController'
import ConditionModel from '@/models/2024/condition'
import { conditionFactory } from '@/tests/factories/2024/condition.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('condition')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(ConditionModel)

describe('ConditionController', () => {
  describe('index', () => {
    it('returns a list of conditions', async () => {
      const conditionsData = conditionFactory.buildList(3)
      await ConditionModel.insertMany(conditionsData)

      const request = createRequest()
      const response = createResponse()

      await ConditionController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: conditionsData[0].index,
            name: conditionsData[0].name
          }),
          expect.objectContaining({
            index: conditionsData[1].index,
            name: conditionsData[1].name
          }),
          expect.objectContaining({
            index: conditionsData[2].index,
            name: conditionsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single condition when found', async () => {
      const conditionData = conditionFactory.build({ index: 'poisoned', name: 'Poisoned' })
      await ConditionModel.insertMany([conditionData])

      const request = createRequest({ params: { index: 'poisoned' } })
      const response = createResponse()

      await ConditionController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('poisoned')
      expect(responseData.name).toBe('Poisoned')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the condition is not found', async () => {
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
