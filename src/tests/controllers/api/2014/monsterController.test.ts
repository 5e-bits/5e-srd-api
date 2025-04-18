import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { jest } from '@jest/globals';
import * as MonsterController from '@/controllers/api/2014/monsterController';

import { mockNext } from '@/tests/support';

import Monster from '@/models/2014/monster';

// Keep track of spies to restore them
let findSpy: ReturnType<typeof jest.spyOn>;

afterEach(() => {
  // Restore any spies created
  if (findSpy) {
    findSpy.mockRestore();
  }
  mockingoose.resetAll();
});

describe('index', () => {
  const baseFindDoc = [
    {
      index: 'aboleth',
      name: 'Aboleth',
      url: '/api/monsters/aboleth',
    },
  ];

  // Test cases for default behavior (no specific query params)
  it('returns a list of objects with default query', async () => {
    const request = createRequest({ query: {}, originalUrl: '/api/monsters' });
    const response = createResponse();
    // Mock the find method using mockingoose for this simple case
    mockingoose(Monster).toReturn(baseFindDoc, 'find');

    await MonsterController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    // Add check for returned data structure if needed
  });

  describe('with challenge_rating query', () => {
    // Define test cases for challenge_rating
    const crTestCases = [
      {
        description: 'handles a single number string',
        query: { challenge_rating: '5' },
        expectedMongoQuery: { challenge_rating: { $in: [5] } },
      },
      {
        description: 'handles a comma-separated string',
        query: { challenge_rating: '1,10,0.25' },
        expectedMongoQuery: { challenge_rating: { $in: [1, 10, 0.25] } },
      },
      {
        description: 'handles an array of number strings',
        query: { challenge_rating: ['2', '4'] },
        expectedMongoQuery: { challenge_rating: { $in: [2, 4] } },
      },
      {
        description: 'handles mixed valid/invalid in a string, ignoring invalid',
        query: { challenge_rating: 'abc,3,def,0.5' },
        expectedMongoQuery: { challenge_rating: { $in: [3, 0.5] } },
      },
      {
        description: 'handles mixed valid/invalid in an array, ignoring invalid',
        query: { challenge_rating: ['1', 'xyz', '5'] },
        expectedMongoQuery: { challenge_rating: { $in: [1, 5] } },
      },
      {
        description: 'handles only invalid values, resulting in no CR filter',
        query: { challenge_rating: 'invalid, nope' },
        expectedMongoQuery: {}, // Empty query expected
      },
      {
        description: 'handles an empty string, resulting in no CR filter',
        query: { challenge_rating: '' },
        expectedMongoQuery: {}, // Empty query expected
      },
    ];

    // Use it.each to run the same test logic for each case
    it.each(crTestCases)(
      '$description', // Use the description field from the test case object
      async ({ query, expectedMongoQuery }) => {
        const request = createRequest({ query });
        const response = createResponse();

        // Spy on Monster.find and mock its resolution
        findSpy = jest.spyOn(Monster, 'find').mockResolvedValue(baseFindDoc as any);

        await MonsterController.index(request, response, mockNext);

        expect(response.statusCode).toBe(200);
        expect(findSpy).toHaveBeenCalledWith(expectedMongoQuery); // Verify the query passed to find
      }
    );
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      const request = createRequest({ query: {}, originalUrl: '/api/monsters' });
      mockingoose(Monster).toReturn(error, 'find');

      await MonsterController.index(request, response, mockNext);

      expect(mockNext).toHaveBeenCalledWith(error);
      expect(response._getData()).toStrictEqual('');
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'aboleth',
    name: 'Aboleth',
    url: '/api/monsters/aboleth',
  };

  const showParams = { index: 'aboleth' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Monster).toReturn(findOneDoc, 'findOne');

    await MonsterController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Monster).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await MonsterController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Monster).toReturn(error, 'findOne');

      await MonsterController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
