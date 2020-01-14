const ApiController = require('../../controllers/apiController');
const { mockRequest, mockResponse, mockNext } = require('../support/requestHelpers');

describe('index', () => {
  it('returns the routes', () => {
    const req = mockRequest();
    const res = mockResponse();
    ApiController.index(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(ApiController.API_INDEX);
  });
});
