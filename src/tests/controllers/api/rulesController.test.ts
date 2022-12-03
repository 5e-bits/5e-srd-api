import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as RulesController from '../../../controllers/api/ruleController.js';

import { mockNext } from '../../support/requestHelpers.js';

import Rule from '../../../models/rule/index.js';

beforeEach(() => {
  mockingoose.resetAll();
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
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Rule).toReturn(findDoc, 'find');

    await RulesController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Rule).toReturn(error, 'find');

      await RulesController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
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
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Rule).toReturn(findOneDoc, 'findOne');

    await RulesController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Rule).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await RulesController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Rule).toReturn(error, 'findOne');

      await RulesController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
