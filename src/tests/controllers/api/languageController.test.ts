import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '../../support/requestHelpers.js';

import Language from '../../../models/language/index.js';
import LanguageController from '../../../controllers/api/languageController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'abyssal',
      name: 'Abyssal',
      url: '/api/languages/abyssal',
    },
    {
      index: 'celestial',
      name: 'Celestial',
      url: '/api/languages/celestial',
    },
    {
      index: 'common',
      name: 'Common',
      url: '/api/languages/common',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Language).toReturn(findDoc, 'find');

    await LanguageController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Language).toReturn(error, 'find');

      await LanguageController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'abyssal',
    name: 'Abyssal',
    url: '/api/languages/abyssal',
  };

  const showParams = { index: 'abyssal' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Language).toReturn(findOneDoc, 'findOne');

    await LanguageController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Language).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await LanguageController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Language).toReturn(error, 'findOne');

      await LanguageController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
