const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Condition = require('../../../models/condition');
const ConditionController = require('../../../controllers/api/conditionController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
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
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Condition).toReturn(findDoc, 'find');

    await ConditionController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Condition).toReturn(error, 'find');

      await ConditionController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Condition).toReturn(findOneDoc, 'findOne');

    await ConditionController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Condition).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ConditionController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Condition).toReturn(error, 'findOne');

      await ConditionController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
