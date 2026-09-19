import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import MagicSchoolController from '@/controllers/api/2024/magicSchoolController'
import MagicSchoolModel from '@/models/2024/magicSchool'
import { magicSchoolFactory } from '@/tests/factories/2024/magicSchool.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('magicschool')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(MagicSchoolModel)

describe('MagicSchoolController', () => {
  describe('index', () => {
    it('returns a list of magic schools', async () => {
      const magicSchoolsData = magicSchoolFactory.buildList(3)
      await MagicSchoolModel.insertMany(magicSchoolsData)

      const request = createRequest()
      const response = createResponse()

      await MagicSchoolController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: magicSchoolsData[0].index,
            name: magicSchoolsData[0].name
          }),
          expect.objectContaining({
            index: magicSchoolsData[1].index,
            name: magicSchoolsData[1].name
          }),
          expect.objectContaining({
            index: magicSchoolsData[2].index,
            name: magicSchoolsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single magic school when found', async () => {
      const magicSchoolData = magicSchoolFactory.build({ index: 'evocation', name: 'Evocation' })
      await MagicSchoolModel.insertMany([magicSchoolData])

      const request = createRequest({ params: { index: 'evocation' } })
      const response = createResponse()

      await MagicSchoolController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('evocation')
      expect(responseData.name).toBe('Evocation')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the magic school is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await MagicSchoolController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
