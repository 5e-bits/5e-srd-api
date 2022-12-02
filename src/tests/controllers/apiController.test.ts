import mockingoose from 'mockingoose';
import * as ApiController from '../../controllers/apiController.js';

import { mockNext, mockRequest, mockResponse } from '../support/requestHelpers.js';

import Collection from '../../models/collection/index.js';
import { MockResponse } from '../support/types.d';

let response: MockResponse;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
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
  const request = mockRequest();

  it('returns the routes', async () => {
    mockingoose(Collection).toReturn(findDoc, 'find');

    await ApiController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expectedResponse);
  });
});
