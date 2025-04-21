import { vi, describe, it, expect, afterEach } from 'vitest'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext } from '@/tests/support/requestHelpers'
import WeaponProperty from '@/models/2014/weaponProperty'
import WeaponPropertyController from '@/controllers/api/2014/weaponPropertyController'
import { weaponPropertyFactory } from '@/tests/factories/2014/weaponProperty.factory'
import { WeaponProperty as WeaponPropertyModel } from '@/models/2014/weaponProperty' // Type for mapping

afterEach(() => {
  vi.restoreAllMocks()
})

// Helper to create the mock query object (copied from previous tests)
const createMockQuery = (
  resolveValue: any,
  shouldReject = false,
  rejectValue?: Error,
  chainMethods = ['select', 'sort']
) => {
  const mockQuery: { [key: string]: any } = {}
  chainMethods.forEach((method) => {
    mockQuery[method] = vi.fn().mockReturnThis()
  })
  const promiseResult = () =>
    shouldReject && rejectValue ? Promise.reject(rejectValue) : Promise.resolve(resolveValue)
  mockQuery.then = (resolve: (value: any) => void, reject?: (reason?: any) => void) =>
    promiseResult().then(resolve, reject)
  mockQuery.exec = vi.fn().mockImplementation(promiseResult)
  return mockQuery
}

describe('index', () => {
  const mockWeaponPropertiesSummary = weaponPropertyFactory
    .buildList(3)
    .map((wp: WeaponPropertyModel) => ({ index: wp.index, name: wp.name, url: wp.url }))
  const request = createRequest({ query: {} })

  it('returns a list of objects', async () => {
    const response = createResponse()
    const mockQuery = createMockQuery(mockWeaponPropertiesSummary)
    const findSpy = vi.spyOn(WeaponProperty, 'find').mockReturnValue(mockQuery as any)

    await WeaponPropertyController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findSpy).toHaveBeenCalledWith({}) // Assuming SimpleController
    expect(mockQuery.select).toHaveBeenCalledWith({ index: 1, name: 1, url: 1, _id: 0 })
    expect(mockQuery.sort).toHaveBeenCalledWith({ index: 'asc' })
    expect(JSON.parse(response._getData())).toEqual({
      count: mockWeaponPropertiesSummary.length,
      results: mockWeaponPropertiesSummary
    })
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      const mockQuery = createMockQuery(null, true, error)
      vi.spyOn(WeaponProperty, 'find').mockReturnValue(mockQuery as any)

      await WeaponPropertyController.index(request, response, mockNext)

      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})

describe('show', () => {
  const mockWeaponProperty = weaponPropertyFactory.build()
  const request = createRequest({ params: { index: mockWeaponProperty.index } })

  it('returns an object', async () => {
    const response = createResponse()
    const findOneSpy = vi
      .spyOn(WeaponProperty, 'findOne')
      .mockResolvedValue(mockWeaponProperty as any)

    await WeaponPropertyController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(findOneSpy).toHaveBeenCalledWith({ index: mockWeaponProperty.index })
    expect(JSON.parse(response._getData())).toEqual(mockWeaponProperty)
  })

  describe('when the record does not exist', () => {
    it('calls next() without error', async () => {
      const response = createResponse()
      vi.spyOn(WeaponProperty, 'findOne').mockResolvedValue(null)
      const invalidRequest = createRequest({ params: { index: 'non-existent' } })
      await WeaponPropertyController.show(invalidRequest, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith()
      expect(response._getData()).toBe('')
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      vi.spyOn(WeaponProperty, 'findOne').mockRejectedValue(error)
      await WeaponPropertyController.show(request, response, mockNext)
      expect(mockNext).toHaveBeenCalledWith(error)
      expect(response._getData()).toBe('')
    })
  })
})
