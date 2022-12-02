import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '../../support/requestHelpers.js';

import MagicSchool from '../../../models/magicSchool/index.js';
import MagicSchoolController from '../../../controllers/api/magicSchoolController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'abjuration',
      name: 'Abjuration',
      url: '/api/magic-schools/abjuration',
    },
    {
      index: 'conjuration',
      name: 'Conjuration',
      url: '/api/magic-schools/conjuration',
    },
    {
      index: 'divination',
      name: 'Divination',
      url: '/api/magic-schools/divination',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(MagicSchool).toReturn(findDoc, 'find');

    await MagicSchoolController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(MagicSchool).toReturn(error, 'find');

      await MagicSchoolController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'abjuration',
    name: 'Abjuration',
    url: '/api/magic-schools/abjuration',
  };

  const showParams = { index: 'abjuration' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(MagicSchool).toReturn(findOneDoc, 'findOne');

    await MagicSchoolController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(MagicSchool).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await MagicSchoolController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(MagicSchool).toReturn(error, 'findOne');

      await MagicSchoolController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
