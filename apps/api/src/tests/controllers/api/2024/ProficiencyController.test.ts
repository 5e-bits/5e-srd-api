import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import ProficiencyController from '@/controllers/api/2024/proficiencyController'
import ProficiencyModel from '@/models/2024/proficiency'
import { proficiencyFactory } from '@/tests/factories/2024/proficiency.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('proficiency')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(ProficiencyModel)

describe('ProficiencyController', () => {
  describe('index', () => {
    it('returns a list of proficiencies', async () => {
      const proficienciesData = proficiencyFactory.buildList(3)
      await ProficiencyModel.insertMany(proficienciesData)
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ProficiencyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('filters by name', async () => {
      const proficienciesData = [
        proficiencyFactory.build({ name: 'Skill: Arcana' }),
        proficiencyFactory.build({ name: 'Skill: History' })
      ]
      await ProficiencyModel.insertMany(proficienciesData)
      const request = createRequest({ query: { name: 'Arcana' } })
      const response = createResponse()

      await ProficiencyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(1)
      expect(responseData.results[0].name).toBe('Skill: Arcana')
    })
  })

  describe('show', () => {
    it('returns a single proficiency when found', async () => {
      const proficiencyData = proficiencyFactory.build({
        index: 'skill-arcana',
        name: 'Skill: Arcana'
      })
      await ProficiencyModel.insertMany([proficiencyData])
      const request = createRequest({ params: { index: 'skill-arcana' } })
      const response = createResponse()

      await ProficiencyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('skill-arcana')
      expect(responseData.name).toBe('Skill: Arcana')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the proficiency is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ProficiencyController.show(request, response, mockNext)

      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
    })
  })
})
