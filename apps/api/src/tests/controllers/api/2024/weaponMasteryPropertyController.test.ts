import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import WeaponMasteryPropertyController from '@/controllers/api/2024/weaponMasteryPropertyController'
import WeaponMasteryPropertyModel from '@/models/2024/weaponMasteryProperty'
import { weaponMasteryPropertyFactory } from '@/tests/factories/2024/weaponMasteryProperty.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('weaponmasteryproperty')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(WeaponMasteryPropertyModel)

describe('WeaponMasteryPropertyController', () => {
  describe('index', () => {
    it('returns a list of weapon mastery properties', async () => {
      const weaponMasteryPropertiesData = weaponMasteryPropertyFactory.buildList(3)
      await WeaponMasteryPropertyModel.insertMany(weaponMasteryPropertiesData)

      const request = createRequest()
      const response = createResponse()

      await WeaponMasteryPropertyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: weaponMasteryPropertiesData[0].index,
            name: weaponMasteryPropertiesData[0].name
          }),
          expect.objectContaining({
            index: weaponMasteryPropertiesData[1].index,
            name: weaponMasteryPropertiesData[1].name
          }),
          expect.objectContaining({
            index: weaponMasteryPropertiesData[2].index,
            name: weaponMasteryPropertiesData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single weapon mastery property when found', async () => {
      const weaponMasteryPropertyData = weaponMasteryPropertyFactory.build({
        index: 'cleave',
        name: 'Cleave'
      })
      await WeaponMasteryPropertyModel.insertMany([weaponMasteryPropertyData])

      const request = createRequest({ params: { index: 'cleave' } })
      const response = createResponse()

      await WeaponMasteryPropertyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('cleave')
      expect(responseData.name).toBe('Cleave')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the weapon mastery property is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await WeaponMasteryPropertyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
