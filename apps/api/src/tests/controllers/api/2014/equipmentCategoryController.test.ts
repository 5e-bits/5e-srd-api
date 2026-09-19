import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import EquipmentCategoryController from '@/controllers/api/2014/equipmentCategoryController'
import EquipmentCategoryModel from '@/models/2014/equipmentCategory'
import { equipmentCategoryFactory } from '@/tests/factories/2014/equipmentCategory.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('equipmentcategory')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(EquipmentCategoryModel)

describe('EquipmentCategoryController', () => {
  describe('index', () => {
    it('returns a list of equipment categories', async () => {
      const categoriesData = equipmentCategoryFactory.buildList(3)
      const categoryDocs = categoriesData.map((data) => new EquipmentCategoryModel(data))
      await EquipmentCategoryModel.insertMany(categoryDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await EquipmentCategoryController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: categoriesData[0].index, name: categoriesData[0].name }),
          expect.objectContaining({ index: categoriesData[1].index, name: categoriesData[1].name }),
          expect.objectContaining({ index: categoriesData[2].index, name: categoriesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no equipment categories exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await EquipmentCategoryController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single equipment category when found', async () => {
      const categoryData = equipmentCategoryFactory.build({ index: 'armor', name: 'Armor' })
      await EquipmentCategoryModel.insertMany([categoryData])

      const request = createRequest({ params: { index: 'armor' } })
      const response = createResponse()

      await EquipmentCategoryController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('armor')
      expect(responseData.name).toBe('Armor')
      expect(responseData.equipment).toHaveLength(categoryData.equipment?.length ?? 0)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the equipment category is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await EquipmentCategoryController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
