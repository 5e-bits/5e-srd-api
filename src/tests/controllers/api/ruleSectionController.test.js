const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const RuleSection = require('../../../models/ruleSection');
const RuleSectionController = require('../../../controllers/api/ruleSectionController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      name: 'The Order of Combat',
      index: 'the-order-of-combat',
      desc: 'some description',
      url: '/api/rules-sections/the-order-of-combat'
    },
    {
      name: 'Movement and Position',
      index: 'movement-and-position',
      desc: 'some description',
      url: '/api/rules-sections/movement-and-position'
    },
    {
      name: 'Actions in Combat',
      index: 'actions-in-combat',
      desc: 'some description',
      url: '/api/rules-sections/actions-in-combat'
    },
    {
      name: 'Making an Attack',
      index: 'making-an-attack',
      desc: 'some description',
      url: '/api/rules-sections/making-an-attack'
    },
    {
      name: 'Cover',
      index: 'cover',
      desc: 'some description',
      url: '/api/rules-sections/cover'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(RuleSection).toReturn(findDoc, 'find');

    await RuleSectionController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(RuleSection).toReturn(error, 'find');

      await RuleSectionController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    name: 'The Order of Combat',
    index: 'the-order-of-combat',
    desc: 'some description',
    url: '/api/rules-sections/the-order-of-combat'
  };

  const showParams = { index: 'the-order-of-combat' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(RuleSection).toReturn(findOneDoc, 'findOne');

    await RuleSectionController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(RuleSection).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await RuleSectionController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(RuleSection).toReturn(error, 'findOne');

      await RuleSectionController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
