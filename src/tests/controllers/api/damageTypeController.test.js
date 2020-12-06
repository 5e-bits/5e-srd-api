const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const DamageType = require('../../../models/damageType');
const DamageTypeController = require('../../../controllers/api/damageTypeController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'acid',
      name: 'Acid',
      url: '/api/damage-types/acid'
    },
    {
      index: 'bludgeoning',
      name: 'Bludgeoning',
      url: '/api/damage-types/bludgeoning'
    },
    {
      index: 'cold',
      name: 'Cold',
      url: '/api/damage-types/cold'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(DamageType).toReturn(findDoc, 'find');

    await DamageTypeController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(DamageType).toReturn(error, 'find');

      await DamageTypeController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'acid',
    name: 'Acid',
    url: '/api/damage-types/acid'
  };

  const showParams = { index: 'acid' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(DamageType).toReturn(findOneDoc, 'findOne');

    await DamageTypeController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(DamageType).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await DamageTypeController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(DamageType).toReturn(error, 'findOne');

      await DamageTypeController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
