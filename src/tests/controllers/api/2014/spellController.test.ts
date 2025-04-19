import mockingoose from 'mockingoose'
import { createRequest, createResponse } from 'node-mocks-http'
import * as SpellController from '@/controllers/api/2014/spellController'

import { mockNext } from '@/tests/support'
import Spell from '@/models/2014/spell'

beforeEach(() => {
  mockingoose.resetAll()
})

describe('index', () => {
  const findDoc = [
    {
      index: 'acid-arrow',
      name: 'Acid Arrow',
      url: '/api/spells/acid-arrow'
    },
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash'
    },
    {
      index: 'aid',
      name: 'Aid',
      url: '/api/spells/aid'
    }
  ]
  const request = createRequest({ query: {} })

  it('returns a list of objects', async () => {
    const response = createResponse()
    mockingoose(Spell).toReturn(findDoc, 'find')

    await SpellController.index(request, response, mockNext)

    expect(response.statusCode).toBe(200)
  })

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      mockingoose(Spell).toReturn(error, 'find')

      await SpellController.index(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})

describe('show', () => {
  const findOneDoc = {
    index: 'acid-arrow',
    name: 'Acid Arrow',
    url: '/api/spells/acid-arrow'
  }

  const showParams = { index: 'acid-arrow' }
  const request = createRequest({ params: showParams })

  it('returns an object', async () => {
    const response = createResponse()
    mockingoose(Spell).toReturn(findOneDoc, 'findOne')

    await SpellController.show(request, response, mockNext)

    expect(response.statusCode).toBe(200)
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams))
  })

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse()
      mockingoose(Spell).toReturn(null, 'findOne')

      const invalidShowParams = { index: 'abcd' }
      const invalidRequest = createRequest({ params: invalidShowParams })
      await SpellController.show(invalidRequest, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith()
    })
  })

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse()
      const error = new Error('Something went wrong')
      mockingoose(Spell).toReturn(error, 'findOne')

      await SpellController.show(request, response, mockNext)

      expect(response.statusCode).toBe(200)
      expect(response._getData()).toStrictEqual('')
      expect(mockNext).toHaveBeenCalledWith(error)
    })
  })
})
