import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'
import { z } from 'zod'

import { relatedList } from '@/controllers/relatedList'
import AbilityScoreModel from '@/models/2014/abilityScore'
import SkillModel from '@/models/2014/skill'
import { abilityScoreFactory } from '@/tests/factories/2014/abilityScore.factory'
import { skillFactory } from '@/tests/factories/2014/skill.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

setupIsolatedDatabase(generateUniqueDbUri('relatedlist'))
teardownIsolatedDatabase()
setupModelCleanup(SkillModel)
setupModelCleanup(AbilityScoreModel)

const abilityUrl = (index: string) => `/api/2014/ability-scores/${index}`
const skillFor = (index: string, ability: string) => ({
  ...skillFactory.build(),
  index,
  name: index,
  url: `/api/2014/skills/${index}`,
  ability_score: { index: ability, name: ability, url: abilityUrl(ability) }
})

const run = async (handler: ReturnType<typeof relatedList>, params: object, query: object = {}) => {
  const request = createRequest({ params, query })
  const response = createResponse()
  await handler(request, response, mockNext)
  return response
}

describe('relatedList', () => {
  const handler = relatedList({
    Model: SkillModel,
    filter: ({ index }) => ({ 'ability_score.url': abilityUrl(index) }),
    sort: { index: 'asc' }
  })

  it('lists the related documents in the requested sort order', async () => {
    await SkillModel.insertMany([skillFor('b', 'str'), skillFor('a', 'str'), skillFor('c', 'dex')])

    const response = await run(handler, { index: 'str' })

    expect(response.statusCode).toBe(200)
    const { count, results } = JSON.parse(response._getData())
    expect(count).toBe(2)
    expect(results.map((r: any) => r.index)).toEqual(['a', 'b'])
    expect(Object.keys(results[0]).sort()).toEqual(['index', 'name', 'url'])
    expect(response.getHeader('Content-Language')).toBe('en')
  })

  it('returns an empty list when nothing is related', async () => {
    const response = await run(handler, { index: 'con' })

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData()).count).toBe(0)
  })

  it('responds 404 for an empty result when notFoundWhenEmpty is set', async () => {
    const strict = relatedList({
      Model: SkillModel,
      filter: ({ index }) => ({ 'ability_score.url': abilityUrl(index) }),
      notFoundWhenEmpty: true
    })

    const response = await run(strict, { index: 'con' })

    expect(response.statusCode).toBe(404)
  })

  it('responds 404 when the parent does not exist', async () => {
    const withParent = relatedList({
      Model: SkillModel,
      filter: ({ index }) => ({ 'ability_score.url': abilityUrl(index) }),
      parent: AbilityScoreModel
    })
    await AbilityScoreModel.insertMany([{ ...abilityScoreFactory.build(), index: 'str' }])
    await SkillModel.insertMany([skillFor('a', 'dex')])

    expect((await run(withParent, { index: 'dex' })).statusCode).toBe(404)
    expect((await run(withParent, { index: 'str' })).statusCode).toBe(200)
  })

  it('passes the validated query to the filter and returns extra fields', async () => {
    const withQuery = relatedList({
      Model: SkillModel,
      querySchema: z.object({ name: z.string().optional() }),
      filter: ({ index }, { name }) => ({
        'ability_score.url': abilityUrl(index),
        ...(name !== undefined && { name })
      }),
      fields: ['desc']
    })
    await SkillModel.insertMany([skillFor('a', 'str'), skillFor('b', 'str')])

    const response = await run(withQuery, { index: 'str' }, { name: 'b' })

    const { results } = JSON.parse(response._getData())
    expect(results).toHaveLength(1)
    expect(results[0]).toEqual(expect.objectContaining({ index: 'b', desc: expect.any(Array) }))
  })

  it('responds 400 for invalid path parameters without querying', async () => {
    const findSpy = vi.spyOn(SkillModel, 'find')

    const response = await run(handler, { index: '' })

    expect(response.statusCode).toBe(400)
    expect(findSpy).not.toHaveBeenCalled()
    findSpy.mockRestore()
  })

  it('forwards database errors to next', async () => {
    const error = new Error('boom')
    vi.spyOn(SkillModel, 'find').mockImplementationOnce(() => {
      throw error
    })
    mockNext.mockClear()

    await run(handler, { index: 'str' })

    expect(mockNext).toHaveBeenCalledWith(error)
  })
})
