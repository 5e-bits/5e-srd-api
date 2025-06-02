import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import ProficiencyController from '@/controllers/api/2014/proficiencyController'
import ProficiencyModel from '@/models/2014/proficiency'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('proficiency')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(ProficiencyModel)

describe('ProficiencyController', () => {
  describe('index', () => {
    it('returns a list of proficiencies', async () => {
      // Arrange
      const proficienciesData = proficiencyFactory.buildList(3)
      await ProficiencyModel.insertMany(proficienciesData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await ProficiencyController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: proficienciesData[0].index,
            name: proficienciesData[0].name
          }),
          expect.objectContaining({
            index: proficienciesData[1].index,
            name: proficienciesData[1].name
          }),
          expect.objectContaining({
            index: proficienciesData[2].index,
            name: proficienciesData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no proficiencies exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ProficiencyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single proficiency when found', async () => {
      // Arrange
      const proficiencyData = proficiencyFactory.build({
        index: 'saving-throw-str',
        name: 'Saving Throw: STR'
      })
      await ProficiencyModel.insertMany([proficiencyData])
      const request = createRequest({ params: { index: 'saving-throw-str' } })
      const response = createResponse()

      // Act
      await ProficiencyController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('saving-throw-str')
      expect(responseData.name).toBe('Saving Throw: STR')
      // Add more specific assertions based on the model structure
      expect(responseData.type).toEqual(proficiencyData.type)
      // Check optional fields only if they exist on the source data
      if (proficiencyData.classes) {
        expect(responseData.classes).toEqual(
          expect.arrayContaining(
            proficiencyData.classes.map((c) => expect.objectContaining({ index: c.index }))
          )
        )
      } else {
        expect(responseData.classes).toEqual([]) // Or appropriate default
      }
      if (proficiencyData.races) {
        expect(responseData.races).toEqual(
          expect.arrayContaining(
            proficiencyData.races.map((r) => expect.objectContaining({ index: r.index }))
          )
        )
      } else {
        expect(responseData.races).toEqual([]) // Or appropriate default
      }
      expect(responseData.reference.index).toEqual(proficiencyData.reference.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the proficiency is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ProficiencyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })
  })
})
