import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '@/tests/support/requestHelpers';

import Feature from '@/models/2014/feature';
import FeatureController from '@/controllers/api/2014/featureController';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'action-surge-1-use',
      name: 'Action Surge (1 use)',
      url: '/api/features/action-surge-1-use',
    },
    {
      index: 'action-surge-2-uses',
      name: 'Action Surge (2 uses)',
      url: '/api/features/action-surge-2-uses',
    },
    {
      index: 'additional-magical-secrets',
      name: 'Additional Magical Secrets',
      url: '/api/features/additional-magical-secrets',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Feature).toReturn(findDoc, 'find');

    await FeatureController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await FeatureController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'action-surge-1-use',
    name: 'Action Surge (1 use)',
    url: '/api/features/action-surge-1-use',
  };

  const showParams = { index: 'action-surge-1-use' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Feature).toReturn(findOneDoc, 'findOne');

    await FeatureController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Feature).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await FeatureController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'findOne');

      await FeatureController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
