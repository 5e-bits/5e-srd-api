import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import EquipmentController from '@/controllers/api/2014/equipmentController'
import EquipmentModel from '@/models/2014/equipment'
import { equipmentFactory } from '@/tests/factories/2014/equipment.factory'
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
      const equipmentData = equipmentFactory.buildList(3)
      const equipmentDocs = equipmentData.map((data) => new EquipmentModel(data))
      await EquipmentModel.insertMany(equipmentDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await EquipmentController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: equipmentData[0].index, name: equipmentData[0].name }),
          expect.objectContaining({ index: equipmentData[1].index, name: equipmentData[1].name }),
          expect.objectContaining({ index: equipmentData[2].index, name: equipmentData[2].name })
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
    it('returns a single piece of equipment when found', async () => {
      const equipmentData = equipmentFactory.build({ index: 'club', name: 'Club' })
      await EquipmentModel.insertMany([equipmentData])

      const request = createRequest({ params: { index: 'club' } })
      const response = createResponse()

      await EquipmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('club')
      expect(responseData.name).toBe('Club')
      expect(responseData.desc).toEqual(equipmentData.desc)
      expect(responseData.cost.quantity).toEqual(equipmentData.cost.quantity)
      expect(responseData.equipment_category.index).toEqual(equipmentData.equipment_category.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the equipment is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await EquipmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
