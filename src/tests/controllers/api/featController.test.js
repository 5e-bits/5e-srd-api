const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Feat = require('../../../models/feat');
const FeatController = require('../../../controllers/api/featController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'grappler',
      name: 'Grappler',
      url: '/api/feats/grappler',
    },
  ];

  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Feat).toReturn(findDoc, 'find');

    await FeatController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feat).toReturn(error, 'find');

      await FeatController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'grappler',
    name: 'Grappler',
    url: '/api/feats/grappler',
  };

  const showParams = { index: 'grappler' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Feat).toReturn(findOneDoc, 'findOne');

    await FeatController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Feat).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await FeatController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feat).toReturn(error, 'findOne');

      await FeatController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
