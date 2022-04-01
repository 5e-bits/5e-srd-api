const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../support/requestHelpers');
const Collection = require('../../../models/collection');
const ApiController = require('../../controllers/apiController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'a',
    },
    {
      index: 'b',
    },
    {
      index: 'c',
    },
  ];
  const expectedResponse = {
    a: '/api/a',
    b: '/api/b',
    c: '/api/c',
  };
  const request = mockRequest();

  it('returns the routes', async () => {
    mockingoose(Collection).toReturn(findDoc, 'find');

    await ApiController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expectedResponse);
  });
});
