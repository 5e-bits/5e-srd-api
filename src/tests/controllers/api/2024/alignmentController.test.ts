import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import AlignmentController from '@/controllers/api/2024/alignmentController'
import AlignmentModel from '@/models/2024/alignment'
import { alignmentFactory } from '@/tests/factories/2024/alignment.factory'
import { mockNext as defaultMockNext } from '@/tests/support'
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

const dbUri = generateUniqueDbUri('alignment')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(AlignmentModel)

describe('AlignmentController', () => {
  describe('index', () => {
    it('returns a list of alignments', async () => {
      const alignmentsData = alignmentFactory.buildList(3)
      await AlignmentModel.insertMany(alignmentsData)

      const request = createRequest()
      const response = createResponse()

      await AlignmentController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results.length).toBe(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            index: alignmentsData[0].index,
            name: alignmentsData[0].name
          }),
          expect.objectContaining({
            index: alignmentsData[1].index,
            name: alignmentsData[1].name
          }),
          expect.objectContaining({
            index: alignmentsData[2].index,
            name: alignmentsData[2].name
          })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single alignment when found', async () => {
      const alignmentData = alignmentFactory.build({ index: 'lawful-good', name: 'Lawful Good' })
      await AlignmentModel.insertMany([alignmentData])

      const request = createRequest({ params: { index: 'lawful-good' } })
      const response = createResponse()

      await AlignmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('lawful-good')
      expect(responseData.name).toBe('Lawful Good')
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next with an error if the alignment is not found', async () => {
      const request = createRequest({ params: { index: 'nonexistent' } })
      const response = createResponse()

      await AlignmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toBe('')
      expect(mockNext).toHaveBeenCalledOnce()
      expect(mockNext).toHaveBeenCalledWith()
    })
  })
})
