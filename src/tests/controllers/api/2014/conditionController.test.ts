import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '@/tests/support/index.js';

import Condition from '@/models/2014/condition/index.js';
import ConditionController from '@/controllers/api/2014/conditionController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'blinded',
      name: 'Blinded',
      url: '/api/conditions/blinded',
    },
    {
      index: 'charmed',
      name: 'Charmed',
      url: '/api/conditions/charmed',
    },
    {
      index: 'deafened',
      name: 'Deafened',
      url: '/api/conditions/deafened',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Condition).toReturn(findDoc, 'find');

    await ConditionController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Condition).toReturn(error, 'find');

      await ConditionController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'blinded',
    name: 'Blinded',
    url: '/api/conditions/blinded',
  };

  const showParams = { index: 'blinded' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Condition).toReturn(findOneDoc, 'findOne');

    await ConditionController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Condition).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ConditionController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Condition).toReturn(error, 'findOne');

      await ConditionController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
