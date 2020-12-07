const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Feature = require('../../../models/feature');
const FeatureController = require('../../../controllers/api/featureController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'action-surge-1-use',
      name: 'Action Surge (1 use)',
      url: '/api/features/action-surge-1-use'
    },
    {
      index: 'action-surge-2-uses',
      name: 'Action Surge (2 uses)',
      url: '/api/features/action-surge-2-uses'
    },
    {
      index: 'additional-magical-secrets',
      name: 'Additional Magical Secrets',
      url: '/api/features/additional-magical-secrets'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Feature).toReturn(findDoc, 'find');

    await FeatureController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await FeatureController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'action-surge-1-use',
    name: 'Action Surge (1 use)',
    url: '/api/features/action-surge-1-use'
  };

  const showParams = { index: 'action-surge-1-use' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Feature).toReturn(findOneDoc, 'findOne');

    await FeatureController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Feature).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await FeatureController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'findOne');

      await FeatureController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
