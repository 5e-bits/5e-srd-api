import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import DamageTypeController from '@/controllers/api/2014/damageTypeController'
import DamageTypeModel from '@/models/2014/damageType'
import { damageTypeFactory } from '@/tests/factories/2014/damageType.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('damageType')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(DamageTypeModel)

describe('DamageTypeController', () => {
  describe('index', () => {
    it('returns a list of damage types', async () => {
      const damageTypesData = damageTypeFactory.buildList(3)
      const damageTypeDocs = damageTypesData.map((data) => new DamageTypeModel(data))
      await DamageTypeModel.insertMany(damageTypeDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await DamageTypeController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: damageTypesData[0].index,
            name: damageTypesData[0].name
          }),
          expect.objectContaining({
            index: damageTypesData[1].index,
            name: damageTypesData[1].name
          }),
          expect.objectContaining({
            index: damageTypesData[2].index,
            name: damageTypesData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no damage types exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await DamageTypeController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single damage type when found', async () => {
      const damageTypeData = damageTypeFactory.build({ index: 'acid', name: 'Acid' })
      await DamageTypeModel.insertMany([damageTypeData])

      const request = createRequest({ params: { index: 'acid' } })
      const response = createResponse()

      await DamageTypeController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('acid')
      expect(responseData.name).toBe('Acid')
      expect(responseData.desc).toEqual(damageTypeData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the damage type is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await DamageTypeController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
