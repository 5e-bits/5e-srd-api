import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import TraitController from '@/controllers/api/2014/traitController'
import TraitModel from '@/models/2014/trait'
import { traitFactory } from '@/tests/factories/2014/trait.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('trait')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(TraitModel)

describe('TraitController', () => {
  describe('index', () => {
    it('returns a list of traits', async () => {
      // Arrange
      const traitsData = traitFactory.buildList(3)
      await TraitModel.insertMany(traitsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await TraitController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: traitsData[0].index, name: traitsData[0].name }),
          expect.objectContaining({ index: traitsData[1].index, name: traitsData[1].name }),
          expect.objectContaining({ index: traitsData[2].index, name: traitsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no traits exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await TraitController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single trait when found', async () => {
      // Arrange
      const traitData = traitFactory.build({ index: 'darkvision', name: 'Darkvision' })
      await TraitModel.insertMany([traitData])
      const request = createRequest({ params: { index: 'darkvision' } })
      const response = createResponse()

      // Act
      await TraitController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('darkvision')
      expect(responseData.name).toBe('Darkvision')
      expect(responseData.desc).toEqual(traitData.desc)
      // Add checks for potentially optional fields like races, subraces, proficiencies if needed
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the trait is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await TraitController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })
  })
})
