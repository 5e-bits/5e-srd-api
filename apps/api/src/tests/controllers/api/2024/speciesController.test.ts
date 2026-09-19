import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SpeciesController from '@/controllers/api/2024/speciesController'
import Species2024Model from '@/models/2024/species'
import Subspecies2024Model from '@/models/2024/subspecies'
import Trait2024Model from '@/models/2024/trait'
import { speciesFactory } from '@/tests/factories/2024/species.factory'
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

const dbUri = generateUniqueDbUri('species2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Species2024Model)
setupModelCleanup(Subspecies2024Model)
setupModelCleanup(Trait2024Model)

describe('SpeciesController (2024)', () => {
  describe('index', () => {
    it('returns a list of species', async () => {
      const speciesData = speciesFactory.buildList(3)
      await Species2024Model.insertMany(speciesData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SpeciesController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no species exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SpeciesController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single species when found', async () => {
      const speciesData = speciesFactory.build({ index: 'elf', name: 'Elf' })
      await Species2024Model.insertMany([speciesData])
      const request = createRequest({ params: { index: 'elf' } })
      const response = createResponse()

      await SpeciesController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('elf')
      expect(responseData.name).toBe('Elf')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the species is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SpeciesController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('showSubspeciesForSpecies', () => {
    it('returns subspecies matching the species url', async () => {
      const species = speciesFactory.build({ index: 'elf', name: 'Elf' })
      const matchingSubspecies = subspeciesFactory.buildList(2, {
        species: { index: 'elf', name: 'Elf', url: '/api/2024/species/elf' }
      })
      const otherSubspecies = subspeciesFactory.build({
        species: { index: 'dwarf', name: 'Dwarf', url: '/api/2024/species/dwarf' }
      })

      await Species2024Model.insertMany([species])
      await Subspecies2024Model.insertMany([...matchingSubspecies, otherSubspecies])

      const request = createRequest({ params: { index: 'elf' } })
      const response = createResponse()

      await SpeciesController.showSubspeciesForSpecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns empty list when no matching subspecies exist', async () => {
      const request = createRequest({ params: { index: 'human' } })
      const response = createResponse()

      await SpeciesController.showSubspeciesForSpecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
    })
  })

  describe('showTraitsForSpecies', () => {
    it('returns traits matching the species url', async () => {
      const matchingTraits = traitFactory.buildList(2, {
        species: [{ index: 'elf', name: 'Elf', url: '/api/2024/species/elf' }]
      })
      const otherTrait = traitFactory.build({
        species: [{ index: 'dwarf', name: 'Dwarf', url: '/api/2024/species/dwarf' }]
      })

      await Trait2024Model.insertMany([...matchingTraits, otherTrait])

      const request = createRequest({ params: { index: 'elf' } })
      const response = createResponse()

      await SpeciesController.showTraitsForSpecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns empty list when no matching traits exist', async () => {
      const request = createRequest({ params: { index: 'human' } })
      const response = createResponse()

      await SpeciesController.showTraitsForSpecies(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
    })
  })
})
