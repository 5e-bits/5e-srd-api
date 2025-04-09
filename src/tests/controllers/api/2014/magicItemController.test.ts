import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as MagicItemController from '@/controllers/api/2014/magicItemController.js';

import { mockNext } from '@/tests/support/requestHelpers.js';

import MagicItem from '@/models/2014/magicItem/index.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'adamantine-armor',
      name: 'Adamantine Armor',
      url: '/api/magic-items/adamantine-armor',
    },
    {
      index: 'ammunition',
      name: 'Ammunition, +1, +2, or +3',
      url: '/api/magic-items/ammunition',
    },
    {
      index: 'amulet-of-health',
      name: 'Amulet of Health',
      url: '/api/magic-items/amulet-of-health',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(MagicItem).toReturn(findDoc, 'find');

    await MagicItemController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(MagicItem).toReturn(error, 'find');

      await MagicItemController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'adamantine-armor',
    name: 'Adamantine Armor',
    url: '/api/magic-items/adamantine-armor',
  };

  const showParams = { index: 'adamantine-armor' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(MagicItem).toReturn(findOneDoc, 'findOne');

    await MagicItemController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(MagicItem).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await MagicItemController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(MagicItem).toReturn(error, 'findOne');

      await MagicItemController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
