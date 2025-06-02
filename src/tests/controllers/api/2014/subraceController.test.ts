import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SubraceController from '@/controllers/api/2014/subraceController'
import ProficiencyModel from '@/models/2014/proficiency'
import SubraceModel from '@/models/2014/subrace'
import TraitModel from '@/models/2014/trait'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { subraceFactory } from '@/tests/factories/2014/subrace.factory'
import { traitFactory } from '@/tests/factories/2014/trait.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Setup DB isolation
const dbUri = generateUniqueDbUri('subrace')
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
// Cleanup all relevant models
setupModelCleanup(SubraceModel)
setupModelCleanup(TraitModel)
setupModelCleanup(ProficiencyModel)

describe('SubraceController', () => {
  describe('index', () => {
    it('returns a list of subraces', async () => {
      // Arrange: Seed DB
      const subracesData = subraceFactory.buildList(3)
      await SubraceModel.insertMany(subracesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await SubraceController.index(request, response, mockNext)

      // Assert: Check response based on seeded data
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: subracesData[0].index, name: subracesData[0].name }),
          expect.objectContaining({ index: subracesData[1].index, name: subracesData[1].name }),
          expect.objectContaining({ index: subracesData[2].index, name: subracesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('show', () => {
    it('returns a single subrace', async () => {
      // Arrange
      const subraceData = subraceFactory.build({ index: 'high-elf' })
      await SubraceModel.insertMany([subraceData])

      const request = createRequest({ params: { index: 'high-elf' } })
      const response = createResponse()

      // Act
      await SubraceController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe(subraceData.index)
      expect(responseData.name).toBe(subraceData.name)
      // Add more checks as needed
      expect(responseData.race.index).toBe(subraceData.race.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the record does not exist', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'non-existent' } })
      const response = createResponse()
      // Act
      await SubraceController.show(request, response, mockNext)
      // Assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })

    // describe('when something goes wrong', ...)
  })

  describe('showTraitsForSubrace', () => {
    const subraceIndex = 'rock-gnome'
    const subraceUrl = `/api/2014/subraces/${subraceIndex}`

    it('returns a list of traits for the subrace', async () => {
      // Arrange
      const subraceRef = { index: subraceIndex, name: 'Rock Gnome', url: subraceUrl }
      const traitsData = traitFactory.buildList(2, { subraces: [subraceRef] })
      await TraitModel.insertMany(traitsData)
      // Seed unrelated traits
      await TraitModel.insertMany(traitFactory.buildList(1))

      const request = createRequest({ params: { index: subraceIndex } })
      const response = createResponse()

      // Act
      await SubraceController.showTraitsForSubrace(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(responseData.results.map((t: any) => t.index)).toEqual(
        expect.arrayContaining([traitsData[0].index, traitsData[1].index])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('showProficienciesForSubrace', () => {
    const subraceIndex = 'hill-dwarf'
    const subraceUrl = `/api/2014/subraces/${subraceIndex}`

    it('returns a list of proficiencies for the subrace', async () => {
      // Arrange
      const subraceRef = { index: subraceIndex, name: 'Hill Dwarf', url: subraceUrl }
      // The Proficiency model links via `races` which includes subraces conceptually
      const proficienciesData = proficiencyFactory.buildList(3, { races: [subraceRef] })
      await ProficiencyModel.insertMany(proficienciesData)
      // Seed unrelated proficiencies
      await ProficiencyModel.insertMany(proficiencyFactory.buildList(2))

      const request = createRequest({ params: { index: subraceIndex } })
      const response = createResponse()

      // Act
      await SubraceController.showProficienciesForSubrace(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results.map((p: any) => p.index)).toEqual(
        expect.arrayContaining([
          proficienciesData[0].index,
          proficienciesData[1].index,
          proficienciesData[2].index
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })
})
