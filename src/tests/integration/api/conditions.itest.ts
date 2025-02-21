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

describe('/api/conditions', () => {
  it('redirects to /api/2014/conditions', async () => {
    await request(app)
      .get('/api/conditions')
      .expect(301)
      .expect('Location', '/api/2014/conditions');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Blinded'
    await request(app)
      .get(`/api/conditions?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/conditions?name=${name}`);
  });

  it('redirects to /api/2014/conditions/{index}', async () => {
    const index = 'charmed'
    await request(app)
      .get(`/api/conditions/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/conditions/${index}`);
  });
});
