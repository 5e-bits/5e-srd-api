import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext } from '@/tests/support'

import ConditionModel from '@/models/2014/condition'
import ConditionController from '@/controllers/api/2014/conditionController'
import { conditionFactory } from '@/test/factories/2014/condition.factory'

const mockNextFn = vi.fn(mockNext)

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGODB_URI
  if (!mongoUri) {
    throw new Error('TEST_MONGODB_URI environment variable not set.')
  }
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  vi.clearAllMocks()
  try {
    await ConditionModel.deleteMany({})
  } catch (error) {
    console.warn('Error clearing conditions collection:', error)
  }
})

describe('ConditionController', () => {
  describe('index', () => {
    it('returns a list of conditions', async () => {
      const conditionsData = conditionFactory.buildList(3)
      const conditionDocs = conditionsData.map((data) => new ConditionModel(data))
      await ConditionModel.insertMany(conditionDocs)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ConditionController.index(request, response, mockNextFn)

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
      expect(mockNextFn).not.toHaveBeenCalled()
    })

    it('returns an empty list when no conditions exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ConditionController.index(request, response, mockNextFn)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNextFn).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single condition when found', async () => {
      const conditionData = conditionFactory.build({ index: 'blinded', name: 'Blinded' })
      await ConditionModel.insertMany([conditionData])
      const request = createRequest({ params: { index: 'blinded' } })
      const response = createResponse()

      await ConditionController.show(request, response, mockNextFn)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('blinded')
      expect(responseData.name).toBe('Blinded')
      expect(responseData.desc).toEqual(conditionData.desc)
      expect(mockNextFn).not.toHaveBeenCalled()
    })

    it('calls next() when the condition is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ConditionController.show(request, response, mockNextFn)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNextFn).toHaveBeenCalledOnce()
      expect(mockNextFn).toHaveBeenCalledWith()
    })
  })
})
