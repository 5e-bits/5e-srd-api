import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import WeaponPropertyController from '@/controllers/api/2014/weaponPropertyController'
import WeaponPropertyModel from '@/models/2014/weaponProperty'
import { weaponPropertyFactory } from '@/tests/factories/2014/weaponProperty.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Setup DB isolation
const dbUri = generateUniqueDbUri('weaponproperty')
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(WeaponPropertyModel)

describe('WeaponPropertyController', () => {
  describe('index', () => {
    it('returns a list of weapon properties', async () => {
      // Arrange: Seed DB
      const propertiesData = weaponPropertyFactory.buildList(3)
      await WeaponPropertyModel.insertMany(propertiesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await WeaponPropertyController.index(request, response, mockNext)

      // Assert: Check response based on seeded data
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: propertiesData[0].index, name: propertiesData[0].name }),
          expect.objectContaining({ index: propertiesData[1].index, name: propertiesData[1].name }),
          expect.objectContaining({ index: propertiesData[2].index, name: propertiesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('show', () => {
    it('returns a single weapon property', async () => {
      // Arrange
      const propertyData = weaponPropertyFactory.build({ index: 'versatile' })
      await WeaponPropertyModel.insertMany([propertyData])

      const request = createRequest({ params: { index: 'versatile' } })
      const response = createResponse()

      // Act
      await WeaponPropertyController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe(propertyData.index)
      expect(responseData.name).toBe(propertyData.name)
      expect(responseData.desc).toEqual(propertyData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the record does not exist', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'non-existent' } })
      const response = createResponse()
      // Act
      await WeaponPropertyController.show(request, response, mockNext)
      // Assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })

    // describe('when something goes wrong', ...)
  })
})
