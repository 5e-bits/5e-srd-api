import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '../../support/requestHelpers.js';

import Proficiency from '../../../models/proficiency/index.js';
import ProficiencyController from '../../../controllers/api/proficiencyController.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'alchemists-supplies',
      name: "Alchemist's supplies",
      url: '/api/proficiencies/alchemists-supplies',
    },
    {
      index: 'all-armor',
      name: 'All armor',
      url: '/api/proficiencies/all-armor',
    },
    {
      index: 'bagpipes',
      name: 'Bagpipes',
      url: '/api/proficiencies/bagpipes',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await ProficiencyController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await ProficiencyController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'alchemists-supplies',
    name: "Alchemist's supplies",
    url: '/api/proficiencies/alchemists-supplies',
  };

  const showParams = { index: 'alchemists-supplies' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Proficiency).toReturn(findOneDoc, 'findOne');

    await ProficiencyController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Proficiency).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ProficiencyController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'findOne');

      await ProficiencyController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
