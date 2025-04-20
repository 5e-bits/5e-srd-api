import { beforeEach, describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import mongoose from 'mongoose'
import { createRequest, createResponse } from 'node-mocks-http'
import { mockNext as defaultMockNext } from '@/tests/support'

import ProficiencyModel from '@/models/2014/proficiency'
import ProficiencyController from '@/controllers/api/2014/proficiencyController'
import { proficiencyFactory } from '@/tests/factories/2014/proficiency.factory'

const mockNext = vi.fn(defaultMockNext)

beforeAll(async () => {
  const mongoUri = process.env.TEST_MONGODB_URI
  if (!mongoUri) {
    throw new Error('TEST_MONGODB_URI environment variable not set.')
  }
  await mongoose.connect(mongoUri)
})

afterAll(async () => {
  await mongoose.disconnect()
})

beforeEach(async () => {
  vi.clearAllMocks()
  await ProficiencyModel.deleteMany({})
})

describe('ProficiencyController', () => {
  describe('index', () => {
    it('returns a list of proficiencies', async () => {
      const proficienciesData = proficiencyFactory.buildList(3)
      const proficiencyDocs = proficienciesData.map((data) => new ProficiencyModel(data))
      await ProficiencyModel.insertMany(proficiencyDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await ProficiencyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: proficienciesData[0].index,
            name: proficienciesData[0].name
          }),
          expect.objectContaining({
            index: proficienciesData[1].index,
            name: proficienciesData[1].name
          }),
          expect.objectContaining({
            index: proficienciesData[2].index,
            name: proficienciesData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no proficiencies exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await ProficiencyController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single proficiency when found', async () => {
      const proficiencyData = proficiencyFactory.build({
        index: 'skill-stealth',
        name: 'Skill: Stealth'
      })
      await ProficiencyModel.insertMany([proficiencyData])

      const request = createRequest({ params: { index: 'skill-stealth' } })
      const response = createResponse()

      await ProficiencyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('skill-stealth')
      expect(responseData.name).toBe('Skill: Stealth')
      expect(responseData.type).toEqual(proficiencyData.type)
      expect(responseData.reference.index).toEqual(proficiencyData.reference.index)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the proficiency is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await ProficiencyController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
