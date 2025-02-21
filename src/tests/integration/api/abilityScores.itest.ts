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

describe('/api/ability-scores', () => {
  it('redirects to /api/2014/ability-scores', async () => {
    await request(app)
      .get('/api/ability-scores')
      .expect(301)
      .expect('Location', '/api/2014/ability-scores');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'CHA'
    await request(app)
      .get(`/api/ability-scores?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores?name=${name}`);
  });

  it('redirects to /api/2014/ability-scores/{index}', async () => {
    const index = 'strength'
    await request(app)
      .get(`/api/ability-scores/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/ability-scores/${index}`);
  });
});
