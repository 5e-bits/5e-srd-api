const mockingoose = require('mockingoose').default;
jest.mock('redis', () => {
  const redis = require('redis-mock');
  return redis;
});
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const redis = require('redis');
const { redisClient } = require('../../../util');
const Rule = require('../../../models/rule');
const RulesController = require('../../../controllers/api/ruleController');

let response;
beforeEach(() => {
  const client = redis.createClient();
  client.flushall();
  mockingoose.resetAll();
  response = mockResponse();
});

afterAll(() => {
  redisClient.quit();
});

describe('index', () => {
  const findDoc = [
    {
      name: 'Combat',
      index: 'combat',
      desc: 'description',
      subsections: [
        {
          name: 'The Order of Combat',
          desc: 'description',
        },
        {
          name: 'Movement and Position',
          desc: 'description',
        },
      ],
      url: '/api/rules/combat',
    },
    {
      name: 'Using Ability Scores',
      index: 'using-ability-scores',
      desc: 'description',
      subsections: [
        {
          name: 'Ability Scores and Modifiers',
          desc: 'description',
        },
        {
          name: 'Advantage and Disadvantage',
          desc: 'description',
        },
        {
          name: 'Proficiency Bonus',
          desc: 'description',
        },
        {
          name: 'Ability Checks',
          desc: 'description',
        },
      ],
      url: '/api/rules/using-ability-scores',
    },
    {
      name: 'Adventuring',
      index: 'adventuring',
      desc: 'description',
      subsections: [],
      url: '/api/rules/adventuring',
    },
    {
      name: 'Spellcasting',
      index: 'spellcasting',
      desc: 'description',
      subsections: [
        {
          name: 'What Is a Spell?',
          desc: 'description',
        },
      ],
      url: '/api/rules/spellcasting',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Rule).toReturn(findDoc, 'find');

    await RulesController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Rule).toReturn(error, 'find');

      await RulesController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    name: 'Spellcasting',
    index: 'spellcasting',
    desc: 'description',
    subsections: [
      {
        name: 'What Is a Spell?',
        desc: 'description',
      },
    ],
    url: '/api/rules/spellcasting',
  };

  const showParams = { index: 'spellcasting' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Rule).toReturn(findOneDoc, 'findOne');

    await RulesController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Rule).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await RulesController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Rule).toReturn(error, 'findOne');

      await RulesController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
