import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import MagicSchoolController from '@/controllers/api/2014/magicSchoolController'
import MagicSchoolModel from '@/models/2014/magicSchool' // Use Model suffix
import { magicSchoolFactory } from '@/tests/factories/2014/magicSchool.factory' // Updated path
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('magicschool')

// Setup hooks using helpers
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(MagicSchoolModel)

describe('MagicSchoolController', () => {
  describe('index', () => {
    it('returns a list of magic schools', async () => {
      // Arrange
      const schoolsData = magicSchoolFactory.buildList(3)
      await MagicSchoolModel.insertMany(schoolsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await MagicSchoolController.index(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: schoolsData[0].index, name: schoolsData[0].name }),
          expect.objectContaining({ index: schoolsData[1].index, name: schoolsData[1].name }),
          expect.objectContaining({ index: schoolsData[2].index, name: schoolsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no magic schools exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await MagicSchoolController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })

    // Add error handling test if necessary
  })

  describe('show', () => {
    it('returns a single magic school when found', async () => {
      // Arrange
      const schoolData = magicSchoolFactory.build({ index: 'evocation', name: 'Evocation' })
      await MagicSchoolModel.insertMany([schoolData])
      const request = createRequest({ params: { index: 'evocation' } })
      const response = createResponse()

      // Act
      await MagicSchoolController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('evocation')
      expect(responseData.name).toBe('Evocation')
      expect(responseData.desc).toEqual(schoolData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the magic school is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await MagicSchoolController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200) // Controller passes to next()
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith() // Default 404 handling
    })

    // Add error handling test if necessary
  })
})
