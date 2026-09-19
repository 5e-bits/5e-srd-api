import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import EquipmentController from '@/controllers/api/2024/equipmentController'
import EquipmentModel from '@/models/2024/equipment'
import { equipmentFactory, weaponFactory } from '@/tests/factories/2024/equipment.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('equipment')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(EquipmentModel)

describe('EquipmentController', () => {
  describe('index', () => {
    it('returns a list of equipment', async () => {
      // Arrange: Seed the database with different equipment types
      const equipmentData = equipmentFactory.buildList(2)
      const weaponData = weaponFactory.build()
      await EquipmentModel.insertMany([...equipmentData, weaponData])

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await EquipmentController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: equipmentData[0].index, name: equipmentData[0].name }),
          expect.objectContaining({ index: equipmentData[1].index, name: equipmentData[1].name }),
          expect.objectContaining({ index: weaponData.index, name: weaponData.name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no equipment exists', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await EquipmentController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single equipment item when found', async () => {
      const equipmentData = weaponFactory.build({
        index: 'longsword',
        name: 'Longsword'
      })
      await EquipmentModel.insertMany([equipmentData])

      const request = createRequest({ params: { index: 'longsword' } })
      const response = createResponse()

      await EquipmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('longsword')
      expect(responseData.name).toBe('Longsword')
      expect(responseData.damage).toBeDefined()
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the equipment is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await EquipmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Default status
      expect(response._getData()).toBe('') // No data written
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
