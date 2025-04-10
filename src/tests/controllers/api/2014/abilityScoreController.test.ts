import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';

import { mockNext } from '@/tests/support';

import AbilityScoreModel from '@/models/2014/abilityScore';
import AbilityScoreController from '@/controllers/api/2014/abilityScoreController';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'str',
      name: 'STR',
      url: '/api/ability-scores/str',
    },
    {
      index: 'dex',
      name: 'DEX',
      url: '/api/ability-scores/dex',
    },
    {
      index: 'con',
      name: 'CON',
      url: '/api/ability-scores/con',
    },
  ];
  const request = createRequest();

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(AbilityScoreModel).toReturn(findDoc, 'find');

    await AbilityScoreController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(AbilityScoreModel).toReturn(error, 'find');

      await AbilityScoreController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'str',
    name: 'STR',
    url: '/api/ability-scores/str',
  };

  const showParams = { index: 'str' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(AbilityScoreModel).toReturn(findOneDoc, 'findOne');

    await AbilityScoreController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(AbilityScoreModel).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await AbilityScoreController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(AbilityScoreModel).toReturn(error, 'findOne');

      await AbilityScoreController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
