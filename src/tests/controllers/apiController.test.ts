import { API_INDEX, index } from '../../controllers/apiController';
import { mockRequest, mockResponse, mockNext } from '../support/requestHelpers';

describe('index', () => {
  it('returns the routes', () => {
    const req = mockRequest();
    const res = mockResponse();
    index(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(API_INDEX);
  });
});
