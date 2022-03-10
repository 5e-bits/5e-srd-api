import { Request, Response } from 'express';
import request from 'supertest'
export interface MockResponse extends request.Response {
  status?: jest.Mock<any, any>;
  json?: jest.Mock<any, any>;
};
