import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '@/tests/support/requestHelpers.js';

import WeaponProperty from '@/models/2014/weaponProperty/index.js';
import WeaponPropertyController from '@/controllers/api/2014/weaponPropertyController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'ammunition',
      name: 'Ammunition',
      url: '/api/weapon-properties/ammunition',
    },
    {
      index: 'finesse',
      name: 'Finesse',
      url: '/api/weapon-properties/finesse',
    },
    {
      index: 'heavy',
      name: 'Heavy',
      url: '/api/weapon-properties/heavy',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(WeaponProperty).toReturn(findDoc, 'find');

    await WeaponPropertyController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(WeaponProperty).toReturn(error, 'find');

      await WeaponPropertyController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'ammunition',
    name: 'Ammunition',
    url: '/api/weapon-properties/ammunition',
  };

  const showParams = { index: 'ammunition' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(WeaponProperty).toReturn(findOneDoc, 'findOne');

    await WeaponPropertyController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(WeaponProperty).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await WeaponPropertyController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(WeaponProperty).toReturn(error, 'findOne');

      await WeaponPropertyController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
