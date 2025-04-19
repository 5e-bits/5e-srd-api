import * as RuleSectionController from '@/controllers/api/2014/ruleSectionController'

import { mockNext } from '@/tests/support/requestHelpers'

import RuleSection from '@/models/2014/ruleSection'
import mockingoose from 'mockingoose'
import { createRequest, createResponse } from 'node-mocks-http'

beforeEach(() => {
  mockingoose.resetAll()
})

describe('index', () => {
  const findDoc = [
    {
      name: 'The Order of Combat',
      index: 'the-order-of-combat',
      desc: 'some description',
      url: '/api/rule-sections/the-order-of-combat'
    },
    {
      name: 'Movement and Position',
      index: 'movement-and-position',
      desc: 'some description',
      url: '/api/rule-sections/movement-and-position'
    },
    {
      name: 'Actions in Combat',
      index: 'actions-in-combat',
      desc: 'some description',
      url: '/api/rule-sections/actions-in-combat'
    },
    {
      name: 'Making an Attack',
      index: 'making-an-attack',
      desc: 'some description',
      url: '/api/rule-sections/making-an-attack'
    },
    {
      name: 'Cover',
      index: 'cover',
      desc: 'some description',
      url: '/api/rule-sections/cover'
    }
  ]
  const request = createRequest({ query: {} })

  it('returns a list of objects', async () => {
    const response = createResponse()
    mockingoose(RuleSection).toReturn(findDoc, 'find')

    await RuleSectionController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      mockingoose(RuleSection).toReturn(error, 'find')

      await RuleSectionController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})

describe('show', () => {
  const findOneDoc = {
    name: 'The Order of Combat',
    index: 'the-order-of-combat',
    desc: 'some description',
    url: '/api/rule-sections/the-order-of-combat'
  }

  const showParams = { index: 'the-order-of-combat' }
  const request = createRequest({ params: showParams })

  it('returns an object', async () => {
    const response = createResponse()
    mockingoose(RuleSection).toReturn(findOneDoc, 'findOne')

    await RuleSectionController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams))
  })

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse()
      mockingoose(RuleSection).toReturn(null, 'findOne')

      const invalidShowParams = { index: 'abcd' }
      const invalidRequest = createRequest({ params: invalidShowParams })
      await RuleSectionController.show(invalidRequest, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      mockingoose(RuleSection).toReturn(error, 'findOne')

      await RuleSectionController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
