import { vi, describe, it, expect, afterEach } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import * as SubraceController from '@/controllers/api/2014/subraceController'
import { mockNext } from '@/tests/support/requestHelpers'
import Proficiency from '@/models/2014/proficiency'
import Subrace from '@/models/2014/subrace'
import Trait from '@/models/2014/trait'
import { subraceFactory } from '@/tests/factories/2014/subrace.factory'
import { traitFactory } from '@/tests/factories/2014/trait.factory'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'
import { Subrace as SubraceModel } from '@/models/2014/subrace'

afterEach(() => {
  vi.restoreAllMocks()
})

// Helper to create the mock query object
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

  // Make it thenable to simulate await
  mockQuery.then = (resolve: (value: any) => void, reject?: (reason?: any) => void) => {
    return promiseResult().then(resolve, reject)
  }

  // Add exec method
  mockQuery.exec = vi.fn().mockImplementation(promiseResult)

  return mockQuery
}

describe('index', () => {
  const mockSubracesSummary = subraceFactory
    .buildList(3)
    .map((s: SubraceModel) => ({ index: s.index, name: s.name, url: s.url }))
  const request = createRequest({ query: {} })

  it('returns a list of objects', async () => {
    const response = createResponse()
    const mockQuery = createMockQuery(mockSubracesSummary)
    const findSpy = vi.spyOn(Subrace, 'find').mockReturnValue(mockQuery as any)

    await SubraceController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({}) // Assuming SimpleController uses empty query
    // Assuming SimpleController uses .select().sort()
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' })
    expect(JSON.parse(response._getData())).toEqual({
      count: mockSubracesSummary.length,
      results: mockSubracesSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error)
      vi.spyOn(Subrace, 'find').mockReturnValue(mockQuery as any)

      await SubraceController.index(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('show', () => {
  const mockSubrace = subraceFactory.build()
  const request = createRequest({ params: { index: mockSubrace.index } })

  it('returns an object', async () => {
    const response = createResponse()
    // Assuming SimpleController.show uses findOne without chaining
    const findOneSpy = vi.spyOn(Subrace, 'findOne').mockResolvedValue(mockSubrace as any)

    await SubraceController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findOneSpy).toHaveBeenCalledWith({ index: mockSubrace.index })
    expect(JSON.parse(response._getData())).toEqual(mockSubrace)
  })

  describe('when the record does not exist', () => {
    it('calls next() without error', async () => {
      const response = createResponse()
      vi.spyOn(Subrace, 'findOne').mockResolvedValue(null)

      const invalidRequest = createRequest({ params: { index: 'non-existent' } })
      await SubraceController.show(invalidRequest, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      vi.spyOn(Subrace, 'findOne').mockRejectedValue(error)

      await SubraceController.show(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('showTraitsForSubrace', () => {
  const subraceIndex = 'test-subrace'
  const mockTraitsSummary = traitFactory
    .buildList(2)
    .map((t) => ({ index: t.index, name: t.name, url: t.url }))
  const request = createRequest({ params: { index: subraceIndex } })

  it('returns a list of traits for the subrace', async () => {
    const response = createResponse()
    // Controller uses .select() but not .sort()
    const mockQuery = createMockQuery(mockTraitsSummary, false, undefined, ['select'])
    const findSpy = vi.spyOn(Trait, 'find').mockReturnValue(mockQuery as any)

    await SubraceController.showTraitsForSubrace(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({ 'subraces.url': `/api/2014/subraces/${subraceIndex}` })
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toBeUndefined() // Ensure sort wasn't created/called
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

      await SubraceController.showTraitsForSubrace(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('showProficienciesForSubrace', () => {
  const subraceIndex = 'test-subrace'
  const mockProficienciesSummary = proficiencyFactory
    .buildList(3)
    .map((p) => ({ index: p.index, name: p.name, url: p.url }))
  const request = createRequest({ params: { index: subraceIndex } })

  it('returns a list of proficiencies for the subrace', async () => {
    const response = createResponse()
    // Controller uses .select().sort()
    const mockQuery = createMockQuery(mockProficienciesSummary, false, undefined, [
      'select',
      'sort'
    ])
    const findSpy = vi.spyOn(Proficiency, 'find').mockReturnValue(mockQuery as any)

    await SubraceController.showProficienciesForSubrace(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({ 'races.url': `/api/2014/subraces/${subraceIndex}` })
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

      await SubraceController.showProficienciesForSubrace(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})
