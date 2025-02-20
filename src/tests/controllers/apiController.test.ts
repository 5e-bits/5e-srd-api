import { jest } from '@jest/globals';
import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';

import deprecatedApiController from '../../controllers/apiController.js';
import Collection from '../../models/2014/collection/index.js';

describe('deprecated /api controller', () => {
  
  beforeEach(() => {
    mockingoose.resetAll();

    const findDoc = [
      { index: 'valid-endpoint' }
    ];
    mockingoose(Collection).toReturn(findDoc, 'find');
  })

  it('redirects to /api/2014', async () => {
    const request = createRequest({ path: '/' });
    const response = createResponse();
    const redirect = jest.spyOn(response, 'redirect');

    await deprecatedApiController(request, response);
    expect(response.statusCode).toBe(301);
    expect(redirect).toHaveBeenCalledWith(301, '/api/2014/');
    
  });

  it('redirects nested endpoint to 2014 equivalent', async () => {
    const request = createRequest({ path: '/valid-endpoint' });
    const response = createResponse();
    const redirect = jest.spyOn(response, 'redirect');

    await deprecatedApiController(request, response);

    expect(response.statusCode).toBe(301);
    expect(redirect).toHaveBeenCalledWith(301, '/api/2014/valid-endpoint');
  });

  it('responds with 404 for invalid sub-routes', async () => {
    const request = createRequest({ path: '/invalid-endpoint' });
    const response = createResponse();

    await deprecatedApiController(request, response);

    expect(response.statusCode).toBe(404);
    expect(response._getData()).toBe("Not Found");
  });
});
