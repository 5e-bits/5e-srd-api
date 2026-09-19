import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SubspeciesController from '@/controllers/api/2024/subspeciesController'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'
import { subspeciesFactory } from '@/tests/factories/2024/subspecies.factory'
import { traitFactory } from '@/tests/factories/2024/trait.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('subspecies2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Subspecies2024Model)
setupModelCleanup(Trait2024Model)

describe('SubspeciesController (2024)', () => {
  describe('index', () => {
    it('returns a list of subspecies', async () => {
      const subspeciesData = subspeciesFactory.buildList(3)
      await Subspecies2024Model.insertMany(subspeciesData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SubspeciesController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no subspecies exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SubspeciesController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single subspecies when found', async () => {
      const subspeciesData = subspeciesFactory.build({ index: 'high-elf', name: 'High Elf' })
      await Subspecies2024Model.insertMany([subspeciesData])
      const request = createRequest({ params: { index: 'high-elf' } })
      const response = createResponse()

      await SubspeciesController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('high-elf')
      expect(responseData.name).toBe('High Elf')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the subspecies is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SubspeciesController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('showTraitsForSubspecies', () => {
    it('returns traits matching the subspecies url', async () => {
      const matchingTraits = traitFactory.buildList(2, {
        subspecies: [
          { index: 'high-elf', name: 'High Elf', url: '/api/2024/subspecies/high-elf' }
        ]
      })
      const otherTrait = traitFactory.build({
        subspecies: [
          { index: 'wood-elf', name: 'Wood Elf', url: '/api/2024/subspecies/wood-elf' }
        ]
      })

      await Trait2024Model.insertMany([...matchingTraits, otherTrait])

      const request = createRequest({ params: { index: 'high-elf' } })
      const response = createResponse()

      await SubspeciesController.showTraitsForSubspecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns empty list when no matching traits exist', async () => {
      const request = createRequest({ params: { index: 'nonexistent-subspecies' } })
      const response = createResponse()

      await SubspeciesController.showTraitsForSubspecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
    })
  })
})
