import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import TraitController from '@/controllers/api/2024/traitController'
import Trait2024Model from '@/models/2024/trait'
import { traitFactory } from '@/tests/factories/2024/trait.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('trait2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Trait2024Model)

describe('TraitController (2024)', () => {
  describe('index', () => {
    it('returns a list of traits', async () => {
      const traitsData = traitFactory.buildList(3)
      await Trait2024Model.insertMany(traitsData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await TraitController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
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
      const traitData = traitFactory.build({ index: 'darkvision', name: 'Darkvision' })
      await Trait2024Model.insertMany([traitData])
      const request = createRequest({ params: { index: 'darkvision' } })
      const response = createResponse()

      await TraitController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('darkvision')
      expect(responseData.name).toBe('Darkvision')
      expect(responseData.description).toEqual(traitData.description)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the trait is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await TraitController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
