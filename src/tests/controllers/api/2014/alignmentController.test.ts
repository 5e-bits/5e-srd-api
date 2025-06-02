import { createRequest, createResponse } from 'node-mocks-http'
import { describe, expect, it, vi } from 'vitest'

import AlignmentController from '@/controllers/api/2014/alignmentController'
import AlignmentModel from '@/models/2014/alignment'
import { alignmentFactory } from '@/tests/factories/2014/alignment.factory'
import { mockNext as defaultMockNext } from '@/tests/support' // Assuming support helper location
import {
  generateUniqueDbUri,
  setupIsolatedDatabase,
  setupModelCleanup,
  teardownIsolatedDatabase
} from '@/tests/support/db'

const mockNext = vi.fn(defaultMockNext)

// Generate URI for this test file
const dbUri = generateUniqueDbUri('alignment')

setupIsolatedDatabase(dbUri)
teardownIsolatedDatabase()
setupModelCleanup(AlignmentModel)

describe('AlignmentController', () => {
  describe('index', () => {
    it('returns a list of alignments', async () => {
      const alignmentsData = alignmentFactory.buildList(3)
      const alignmentDocs = alignmentsData.map((data) => new AlignmentModel(data))
      await AlignmentModel.insertMany(alignmentDocs)

      const request = createRequest({ query: {} })
      const response = createResponse()

      await AlignmentController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(3)
      expect(responseData.results).toHaveLength(3)
      expect(responseData.results).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ index: alignmentsData[0].index, name: alignmentsData[0].name }),
          expect.objectContaining({ index: alignmentsData[1].index, name: alignmentsData[1].name }),
          expect.objectContaining({ index: alignmentsData[2].index, name: alignmentsData[2].name })
        ])
      )
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('returns an empty list when no alignments exist', async () => {
      const request = createRequest({ query: {} })
      const response = createResponse()

      await AlignmentController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.count).toBe(0)
      expect(responseData.results).toEqual([])
      expect(mockNext).not.toHaveBeenCalled()
    })
  })

  describe('show', () => {
    it('returns a single alignment when found', async () => {
      const alignmentData = alignmentFactory.build({ index: 'lg', name: 'Lawful Good' })
      await AlignmentModel.insertMany([alignmentData])

      const request = createRequest({ params: { index: 'lg' } })
      const response = createResponse()

      await AlignmentController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      const responseData = JSON.parse(response._getData())
      expect(responseData.index).toBe('lg')
      expect(responseData.name).toBe('Lawful Good')
      expect(responseData.desc).toEqual(alignmentData.desc)
      expect(mockNext).not.toHaveBeenCalled()
    })

    it('calls next() when the alignment is not found', async () => {
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
