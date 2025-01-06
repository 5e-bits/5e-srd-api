import { mockNext } from '../../../support/requestHelpers.js';

import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import skill from '../../../../models/2014/skill/index.js';
import skillController from '../../../../controllers/api/2014/skillController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'acrobatics',
      name: 'Acrobatics',
      url: '/api/skills/acrobatics',
    },
    {
      index: 'animal-handling',
      name: 'Animal Handling',
      url: '/api/skills/animal-handling',
    },
    {
      index: 'arcana',
      name: 'Arcana',
      url: '/api/skills/arcana',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(skill).toReturn(findDoc, 'find');

    await skillController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(skill).toReturn(error, 'find');

      await skillController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'acrobatics',
    name: 'Acrobatics',
    url: '/api/skills/acrobatics',
  };

  const showParams = { index: 'acrobatics' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(skill).toReturn(findOneDoc, 'findOne');

    await skillController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(skill).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await skillController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(skill).toReturn(error, 'findOne');

      await skillController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
