import { jest } from '@jest/globals';
import { MockResponse } from './types.d';

export const mockRequest = (reqData = {}) => {
  return reqData;
};

export const mockResponse = () => {
  const res: MockResponse = {};
  res.status = jest.fn().mockReturnValue(res) as jest.Mock<any, any>;
  res.json = jest.fn().mockReturnValue(res) as jest.Mock<any, any>;
  return res;
};

export const mockNext = jest.fn();
