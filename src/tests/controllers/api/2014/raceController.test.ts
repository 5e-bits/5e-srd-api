import { vi, describe, it, expect, afterEach } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import * as RaceController from '@/controllers/api/2014/raceController'
import { mockNext } from '@/tests/support'
import Proficiency from '@/models/2014/proficiency'
import Race from '@/models/2014/race'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'
import { raceFactory } from '@/tests/factories/2014/race.factory'
import { subraceFactory } from '@/tests/factories/2014/subrace.factory'
import { traitFactory } from '@/tests/factories/2014/trait.factory'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { Race as RaceModel } from '@/models/2014/race' // Type for mapping

afterEach(() => {
  vi.restoreAllMocks()
})

// Helper to create the mock query object (copied from previous tests)
const createMockQuery = (
  resolveValue: any,
  shouldReject = false,
  rejectValue?: Error,
  chainMethods = ['select', 'sort'] // Default to select().sort()
) => {
  const mockQuery: { [key: string]: any } = {}

  chainMethods.forEach((method) => {
    mockQuery[method] = vi.fn().mockReturnThis()
  })

  const promiseResult = () => {
    if (shouldReject && rejectValue) {
      return Promise.reject(rejectValue)
    } else {
      return Promise.resolve(resolveValue)
    }
  }

  mockQuery.then = (resolve: (value: any) => void, reject?: (reason?: any) => void) => {
    return promiseResult().then(resolve, reject)
  }
  mockQuery.exec = vi.fn().mockImplementation(promiseResult)

  return mockQuery
}

describe('index', () => {
  const mockRacesSummary = raceFactory
    .buildList(3)
    .map((r: RaceModel) => ({ index: r.index, name: r.name, url: r.url }))
  const request = createRequest({ query: {} })

  it('returns a list of objects', async () => {
    const response = createResponse()
    const mockQuery = createMockQuery(mockRacesSummary)
    const findSpy = vi.spyOn(Race, 'find').mockReturnValue(mockQuery as any)

    await RaceController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({}) // Assuming SimpleController
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' })
    expect(JSON.parse(response._getData())).toEqual({
      count: mockRacesSummary.length,
      results: mockRacesSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error)
      vi.spyOn(Race, 'find').mockReturnValue(mockQuery as any)

      await RaceController.index(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('show', () => {
  const mockRace = raceFactory.build()
  const request = createRequest({ params: { index: mockRace.index } })

  it('returns an object', async () => {
    const response = createResponse()
    const findOneSpy = vi.spyOn(Race, 'findOne').mockResolvedValue(mockRace as any)

    await RaceController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findOneSpy).toHaveBeenCalledWith({ index: mockRace.index })
    expect(JSON.parse(response._getData())).toEqual(mockRace)
  })

  describe('when the record does not exist', () => {
    it('calls next() without error', async () => {
      const response = createResponse()
      vi.spyOn(Race, 'findOne').mockResolvedValue(null)
      const invalidRequest = createRequest({ params: { index: 'non-existent' } })
      await RaceController.show(invalidRequest, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      vi.spyOn(Race, 'findOne').mockRejectedValue(error)
      await RaceController.show(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('showSubracesForRace', () => {
  const raceIndex = 'test-race'
  const mockSubracesSummary = subraceFactory
    .buildList(2)
    .map((s: any) => ({ index: s.index, name: s.name, url: s.url })) // Using any for now, can import SubraceModel if needed
  const request = createRequest({ params: { index: raceIndex } })

  it('returns a list of subraces for the race', async () => {
    const response = createResponse()
    // Controller uses .select() but not .sort()
    const mockQuery = createMockQuery(mockSubracesSummary, false, undefined, ['select'])
    const findSpy = vi.spyOn(Subrace, 'find').mockReturnValue(mockQuery as any)

    await RaceController.showSubracesForRace(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({ 'race.url': `/api/2014/races/${raceIndex}` })
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toBeUndefined()
    expect(JSON.parse(response._getData())).toEqual({
      count: mockSubracesSummary.length,
      results: mockSubracesSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error, ['select'])
      vi.spyOn(Subrace, 'find').mockReturnValue(mockQuery as any)
      await RaceController.showSubracesForRace(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('showTraitsForRace', () => {
  const raceIndex = 'test-race'
  const mockTraitsSummary = traitFactory
    .buildList(3)
    .map((t: any) => ({ index: t.index, name: t.name, url: t.url })) // Using any
  const request = createRequest({ params: { index: raceIndex } })

  it('returns a list of traits for the race', async () => {
    const response = createResponse()
    // Controller uses .select() but not .sort()
    const mockQuery = createMockQuery(mockTraitsSummary, false, undefined, ['select'])
    const findSpy = vi.spyOn(Trait, 'find').mockReturnValue(mockQuery as any)

    await RaceController.showTraitsForRace(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({ 'races.url': `/api/2014/races/${raceIndex}` })
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toBeUndefined()
    expect(JSON.parse(response._getData())).toEqual({
      count: mockTraitsSummary.length,
      results: mockTraitsSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error, ['select'])
      vi.spyOn(Trait, 'find').mockReturnValue(mockQuery as any)
      await RaceController.showTraitsForRace(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('showProficienciesForRace', () => {
  const raceIndex = 'test-race'
  const mockProficienciesSummary = proficiencyFactory
    .buildList(4)
    .map((p: any) => ({ index: p.index, name: p.name, url: p.url })) // Using any
  const request = createRequest({ params: { index: raceIndex } })

  it('returns a list of proficiencies for the race', async () => {
    const response = createResponse()
    // Controller uses .select().sort()
    const mockQuery = createMockQuery(mockProficienciesSummary, false, undefined, [
      'select',
      'sort'
    ])
    const findSpy = vi.spyOn(Proficiency, 'find').mockReturnValue(mockQuery as any)

    await RaceController.showProficienciesForRace(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({ 'races.url': `/api/2014/races/${raceIndex}` })
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' })
    expect(JSON.parse(response._getData())).toEqual({
      count: mockProficienciesSummary.length,
      results: mockProficienciesSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error, ['select', 'sort'])
      vi.spyOn(Proficiency, 'find').mockReturnValue(mockQuery as any)
      await RaceController.showProficienciesForRace(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})
