import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as MonsterController from '@/controllers/api/2014/monsterController';

import { mockNext } from '@/tests/support';

import Monster from '@/models/2014/monster';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'aboleth',
      name: 'Aboleth',
      url: '/api/monsters/aboleth',
    },
    {
      index: 'acolyte',
      name: 'Acolyte',
      url: '/api/monsters/acolyte',
    },
    {
      index: 'adult-black-dragon',
      name: 'Adult Black Dragon',
      url: '/api/monsters/adult-black-dragon',
    },
  ];
  const request = createRequest({ query: {}, originalUrl: '/api/monsters' });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Monster).toReturn(findDoc, 'find');

    await MonsterController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Monster).toReturn(error, 'find');

      await MonsterController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'aboleth',
    name: 'Aboleth',
    url: '/api/monsters/aboleth',
  };

  const showParams = { index: 'aboleth' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Monster).toReturn(findOneDoc, 'findOne');

    await MonsterController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Monster).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await MonsterController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Monster).toReturn(error, 'findOne');

      await MonsterController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
