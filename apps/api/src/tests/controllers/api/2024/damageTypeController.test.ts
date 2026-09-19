import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import DamageTypeController from '@/controllers/api/2024/damageTypeController'
import DamageTypeModel from '@/models/2024/damageType'
import { damageTypeFactory } from '@/tests/factories/2024/damageType.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('damagetype')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(DamageTypeModel)

describe('DamageTypeController', () => {
  describe('index', () => {
    it('returns a list of damage types', async () => {
      const damageTypesData = damageTypeFactory.buildList(3)
      await DamageTypeModel.insertMany(damageTypesData)

      const request = createRequest()
      const response = createResponse()

      await DamageTypeController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
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
  })

  describe('show', () => {
    it('returns a single damage type when found', async () => {
      const damageTypeData = damageTypeFactory.build({ index: 'fire', name: 'Fire' })
      await DamageTypeModel.insertMany([damageTypeData])

      const request = createRequest({ params: { index: 'fire' } })
      const response = createResponse()

      await DamageTypeController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('fire')
      expect(responseData.name).toBe('Fire')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the damage type is not found', async () => {
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
