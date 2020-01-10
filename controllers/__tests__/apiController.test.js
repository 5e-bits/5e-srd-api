const ApiController = require('../apiController');

// TODO: Find a better way to reuse this everywhere
const mockRequest = (reqData = {}) => {
  return reqData;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

describe('index', () => {
  it('returns the routes', () => {
    const req = mockRequest();
    const res = mockResponse();
    ApiController.index(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(ApiController.API_INDEX);
  });
});
