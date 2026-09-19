import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import * as SpellController from '@/controllers/api/2024/spellController'
import Spell2024Model from '@/models/2024/spell'
import Translation2024Model from '@/models/2024/translation'
import { spellFactory } from '@/tests/factories/2024/spell.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('spell_2024')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(Spell2024Model)
setupModelCleanup(Translation2024Model)

describe('SpellController', () => {
  describe('index', () => {
    it('returns a list of spells', async () => {
      const spellsData = spellFactory.buildList(3)
      await Spell2024Model.insertMany(spellsData)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: spellsData[0].index, name: spellsData[0].name }),
          expect.objectContaining({ index: spellsData[1].index, name: spellsData[1].name }),
          expect.objectContaining({ index: spellsData[2].index, name: spellsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    describe('with level query', () => {
      const levelTestCases = [
        { input: '1', expectedCount: 2, seedLevels: [1, 2, 1] },
        { input: '1,2', expectedCount: 3, seedLevels: [1, 2, 1] }, // comma-separated (the bug case)
        { input: ['1', '2'], expectedCount: 2, seedLevels: [1, 2, 3] }, // repeated param array
        { input: 'abc,1,def,2', expectedCount: 2, seedLevels: [1, 2, 3] }, // mixed valid/invalid tokens
        { input: ['3', 'xyz', '5'], expectedCount: 2, seedLevels: [3, 5, 7] }, // array with invalid
        { input: 'invalid', expectedCount: 3, seedLevels: [1, 2, 3] }, // all invalid → no filter applied
        { input: '', expectedCount: 3, seedLevels: [1, 2, 3] } // empty → no filter applied
      ]

      it.each(levelTestCases)('handles level: $input', async ({ input, expectedCount, seedLevels }) => {
        const spellsToSeed = seedLevels.map((lvl, i) =>
          spellFactory.build({ level: lvl, name: `Spell ${i}` })
        )
        await Spell2024Model.insertMany(spellsToSeed)

        const request = createRequest({ query: { level: input } })
        const response = createResponse()

        await SpellController.index(request, response, mockNext)

        expect(response.statusCode).toBe(200)
        const responseData = JSON.parse(response._getData())
        expect(responseData.count).toBe(expectedCount)
        expect(responseData.results).toHaveLength(expectedCount)
        expect(mockNext).not.toHaveBeenCalled()
      })
    })

    it('returns an empty list when no spells exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns translated names and Content-Language header when translations exist', async () => {
      const spellData = spellFactory.build({ index: 'fireball', name: 'Fireball' })
      await Spell2024Model.insertMany([spellData])
      await Translation2024Model.insertMany([
        {
          source_index: 'fireball',
          source_collection: 'spells',
          lang: 'fr-FR',
          fields: { name: 'Boule de Feu' },
          completeness: 1.0,
          updated_at: new Date().toISOString()
        }
      ])

      const request = createRequest({ query: {} })
      request.lang = 'fr-FR'
      const response = createResponse()

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.results[0].name).toBe('Boule de Feu')
      expect(response.getHeader('Content-Language')).toBe('fr-FR')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns Content-Language: en when no translations exist for lang', async () => {
      const spellsData = spellFactory.buildList(2)
      await Spell2024Model.insertMany(spellsData)

      const request = createRequest({ query: {} })
      request.lang = 'de-DE'
      const response = createResponse()

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response.getHeader('Content-Language')).toBe('en')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single spell when found', async () => {
      const spellData = spellFactory.build({ index: 'fireball', name: 'Fireball' })
      await Spell2024Model.insertMany([spellData])

      const request = createRequest({ params: { index: 'fireball' } })
      const response = createResponse()

      await SpellController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('fireball')
      expect(responseData.name).toBe('Fireball')
      expect(responseData.description).toEqual(spellData.description)
      expect(responseData.level).toEqual(spellData.level)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the spell is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await SpellController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })

    it('returns translated fields and Content-Language header when a translation exists', async () => {
      const spellData = spellFactory.build({ index: 'fireball', name: 'Fireball' })
      await Spell2024Model.insertMany([spellData])
      await Translation2024Model.insertMany([
        {
          source_index: 'fireball',
          source_collection: 'spells',
          lang: 'fr-FR',
          fields: { name: 'Boule de Feu', description: 'Description en français' },
          completeness: 1.0,
          updated_at: new Date().toISOString()
        }
      ])

      const request = createRequest({ params: { index: 'fireball' } })
      request.lang = 'fr-FR'
      const response = createResponse()

      await SpellController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.name).toBe('Boule de Feu')
      expect(responseData.description).toEqual('Description en français')
      expect(response.getHeader('Content-Language')).toBe('fr-FR')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns original content and Content-Language: en when no translation exists for lang', async () => {
      const spellData = spellFactory.build({ index: 'fireball', name: 'Fireball' })
      await Spell2024Model.insertMany([spellData])

      const request = createRequest({ params: { index: 'fireball' } })
      request.lang = 'de-DE'
      const response = createResponse()

      await SpellController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.name).toBe('Fireball')
      expect(response.getHeader('Content-Language')).toBe('en')
      expect(mockNext).not.toHaveBeenCalled()
    })
  })
})
