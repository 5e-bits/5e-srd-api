import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import { versionIndex } from '@/controllers/api/versionIndexController'
import Collection2014Model from '@/models/2014/collection'
import Collection2024Model from '@/models/2024/collection'
import { collectionFactory as collection2014Factory } from '@/tests/factories/2014/collection.factory'
import { collectionFactory as collection2024Factory } from '@/tests/factories/2024/collection.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

setupIsolatedDatabase(generateUniqueDbUri('version-index'))
teardownIsolatedDatabase()
setupModelCleanup(Collection2014Model)
setupModelCleanup(Collection2024Model)

describe.each([
  ['2014', Collection2014Model, collection2014Factory],
  ['2024', Collection2024Model, collection2024Factory]
] as const)('versionIndex (%s)', (year, CollectionModel, collectionFactory) => {
  const controller = versionIndex(year, CollectionModel)

  it('returns the map of available API routes', async () => {
    const collectionsData = collectionFactory.buildList(3)
    await CollectionModel.insertMany(collectionsData)
    const request = createRequest()
    const response = createResponse()
    const expectedResponse = Object.fromEntries(
      collectionsData.map((col) => [col.index, `/api/${year}/${col.index}`])
    )

    await controller(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData())).toEqual(expectedResponse)
    expect(mockNext).not.toHaveBeenCalled()
  })

  it('leaves out the levels collection', async () => {
    await CollectionModel.insertMany([{ index: 'levels' }, { index: 'spells' }])
    const response = createResponse()

    await controller(createRequest(), response, mockNext)

    expect(JSON.parse(response._getData())).toEqual({ spells: `/api/${year}/spells` })
  })

  it('handles database errors during find', async () => {
    const request = createRequest()
    const response = createResponse()
    const error = new Error('Database find failed')
    vi.spyOn(CollectionModel, 'find').mockImplementationOnce(() => {
      const query = {
        select: vi.fn().mockReturnThis(),
        sort: vi.fn().mockReturnThis(),
        exec: vi.fn().mockRejectedValueOnce(error)
      } as any
      return query
    })
    mockNext.mockClear()

    await controller(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(response._getData()).toBe('')
    expect(mockNext).toHaveBeenCalledOnce()
    expect(mockNext).toHaveBeenCalledWith(error)
  })

  it('returns an empty object when no collections exist', async () => {
    const response = createResponse()

    await controller(createRequest(), response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData())).toEqual({})
    expect(mockNext).not.toHaveBeenCalled()
  })
})
