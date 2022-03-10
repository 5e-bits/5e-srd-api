import { MockResponse } from './types.d';
import request from 'supertest';

const mockRequest = (reqData: any = {}) => {
  return reqData;
};

const mockResponse = () => {
  const res: any = {}
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

export { mockRequest, mockResponse, mockNext };
