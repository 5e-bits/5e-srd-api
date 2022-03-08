import { MockResponse } from './types.d';

const mockRequest = (reqData = {}) => {
  return reqData;
};

const mockResponse = () => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

export { mockRequest, mockResponse, mockNext };
