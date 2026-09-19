import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import WeaponPropertyController from '@/controllers/api/2024/weaponPropertyController'
import WeaponPropertyModel from '@/models/2024/weaponProperty'
import { weaponPropertyFactory } from '@/tests/factories/2024/weaponProperty.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('weaponproperty')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(WeaponPropertyModel)

describe('WeaponPropertyController', () => {
  describe('index', () => {
    it('returns a list of weapon properties', async () => {
      const weaponPropertiesData = weaponPropertyFactory.buildList(3)
      await WeaponPropertyModel.insertMany(weaponPropertiesData)

      const request = createRequest()
      const response = createResponse()

      await WeaponPropertyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: weaponPropertiesData[0].index,
            name: weaponPropertiesData[0].name
          }),
          expect.objectContaining({
            index: weaponPropertiesData[1].index,
            name: weaponPropertiesData[1].name
          }),
          expect.objectContaining({
            index: weaponPropertiesData[2].index,
            name: weaponPropertiesData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single weapon property when found', async () => {
      const weaponPropertyData = weaponPropertyFactory.build({
        index: 'versatile',
        name: 'Versatile'
      })
      await WeaponPropertyModel.insertMany([weaponPropertyData])

      const request = createRequest({ params: { index: 'versatile' } })
      const response = createResponse()

      await WeaponPropertyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('versatile')
      expect(responseData.name).toBe('Versatile')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the weapon property is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await WeaponPropertyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
