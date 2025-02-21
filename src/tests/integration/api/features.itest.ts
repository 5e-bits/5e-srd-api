import { mongodbUri, redisClient } from '../../../util';

import { Application } from 'express';
import createApp from '../../../server';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';

let app: Application;
let server: any;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri);
  await redisClient.connect();
  app = await createApp();
  server = app.listen(); // Start the server and store the instance
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
  server.close();
});

describe('/api/features', () => {
  it('redirects to /api/2014/features', async () => {
    await request(app)
      .get('/api/features')
      .expect(301)
      .expect('Location', '/api/2014/features');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Action%20Surge'
    await request(app)
      .get(`/api/features?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/features?name=${name}`);
  });

  it('redirects to /api/2014/features/{index}', async () => {
    const index = 'arcane-recovery'
    await request(app)
      .get(`/api/features/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/features/${index}`);
  });
});
