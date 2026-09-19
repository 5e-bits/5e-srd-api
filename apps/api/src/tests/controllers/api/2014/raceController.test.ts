import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as RaceController from '@/controllers/api/2014/raceController'
import ProficiencyModel from '@/models/2014/proficiency'
import RaceModel from '@/models/2014/race'
import SubraceModel from '@/models/2014/subrace'
import TraitModel from '@/models/2014/trait'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { raceFactory } from '@/tests/factories/2014/race.factory'
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
const dbUri = generateUniqueDbUri('race')
setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
// Cleanup all relevant models
setupModelCleanup(RaceModel)
setupModelCleanup(SubraceModel)
setupModelCleanup(TraitModel)
setupModelCleanup(ProficiencyModel)

describe('RaceController', () => {
  describe('index', () => {
    it('returns a list of races', async () => {
      // Arrange: Seed DB
      const racesData = raceFactory.buildList(3)
      await RaceModel.insertMany(racesData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      // Act
      await RaceController.index(request, response, mockNext)

      // Assert: Check response based on seeded data
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: racesData[0].index, name: racesData[0].name }),
          expect.objectContaining({ index: racesData[1].index, name: racesData[1].name }),
          expect.objectContaining({ index: racesData[2].index, name: racesData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('show', () => {
    it('returns a single race', async () => {
      // Arrange
      const raceData = raceFactory.build({ index: 'human' })
      await RaceModel.insertMany([raceData])
      const request = createRequest({ params: { index: 'human' } })
      const response = createResponse()

      // Act
      await RaceController.show(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toEqual(raceData.index)
      // Add more specific checks
      expect(responseData.name).toEqual(raceData.name)
      expect(responseData.speed).toEqual(raceData.speed)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the record does not exist', async () => {
      // Arrange
      const request = createRequest({ params: { index: 'non-existent' } })
      const response = createResponse()
      // Act
      await RaceController.show(request, response, mockNext)
      // Assert
      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })

    // describe('when something goes wrong', ...)
  })

  describe('showSubracesForRace', () => {
    const raceIndex = 'dwarf'
    const raceUrl = `/api/2014/races/${raceIndex}`

    it('returns a list of subraces for the race', async () => {
      // Arrange
      const raceRef = { index: raceIndex, name: 'Dwarf', url: raceUrl }
      const subracesData = subraceFactory.buildList(2, { race: raceRef })
      await SubraceModel.insertMany(subracesData)
      // Seed an unrelated subrace
      await SubraceModel.insertMany(subraceFactory.buildList(1))

      const request = createRequest({ params: { index: raceIndex } })
      const response = createResponse()

      // Act
      await RaceController.showSubracesForRace(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(2)
      expect(responseData.results).toHaveLength(2)
      expect(responseData.results.map((r: any) => r.index)).toEqual(
        expect.arrayContaining([subracesData[0].index, subracesData[1].index])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('showTraitsForRace', () => {
    const raceIndex = 'elf'
    const raceUrl = `/api/2014/races/${raceIndex}`

    it('returns a list of traits for the race', async () => {
      // Arrange
      const raceRef = { index: raceIndex, name: 'Elf', url: raceUrl }
      const traitsData = traitFactory.buildList(3, { races: [raceRef] })
      await TraitModel.insertMany(traitsData)
      // Seed unrelated traits
      await TraitModel.insertMany(traitFactory.buildList(2))

      const request = createRequest({ params: { index: raceIndex } })
      const response = createResponse()

      // Act
      await RaceController.showTraitsForRace(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results.map((t: any) => t.index)).toEqual(
        expect.arrayContaining([traitsData[0].index, traitsData[1].index, traitsData[2].index])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })

  describe('showProficienciesForRace', () => {
    const raceIndex = 'halfling'
    const raceUrl = `/api/2014/races/${raceIndex}`

    it('returns a list of proficiencies for the race', async () => {
      // Arrange
      const raceRef = { index: raceIndex, name: 'Halfling', url: raceUrl }
      const proficienciesData = proficiencyFactory.buildList(4, { races: [raceRef] })
      await ProficiencyModel.insertMany(proficienciesData)
      // Seed unrelated proficiencies
      await ProficiencyModel.insertMany(proficiencyFactory.buildList(2))

      const request = createRequest({ params: { index: raceIndex } })
      const response = createResponse()

      // Act
      await RaceController.showProficienciesForRace(request, response, mockNext)

      // Assert
      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(4)
      expect(responseData.results).toHaveLength(4)
      expect(responseData.results.map((p: any) => p.index)).toEqual(
        expect.arrayContaining([
          proficienciesData[0].index,
          proficienciesData[1].index,
          proficienciesData[2].index,
          proficienciesData[3].index
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    // describe('when something goes wrong', ...)
  })
})
