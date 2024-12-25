import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';

import * as ApiController from '../../controllers/apiController.js';
import { mockNext } from '../support/requestHelpers.js';
import Collection from '../../models/2014/collection/index.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'a',
    },
    {
      index: 'b',
    },
    {
      index: 'c',
    },
  ];
  const expectedResponse = {
    a: '/api/a',
    b: '/api/b',
    c: '/api/c',
  };
  const request = createRequest();

  it('returns the routes', async () => {
    const response = createResponse();
    mockingoose(Collection).toReturn(findDoc, 'find');

    await ApiController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expectedResponse);
  });
});
