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

describe('/api/magic-schools', () => {
  it('redirects to /api/2014/magic-schools', async () => {
    await request(app)
      .get('/api/magic-schools')
      .expect(301)
      .expect('Location', '/api/2014/magic-schools');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Abjuration'
    await request(app)
      .get(`/api/magic-schools?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-schools?name=${name}`);
  });

  it('redirects to /api/2014/magic-schools/{index}', async () => {
    const index = 'conjuration'
    await request(app)
      .get(`/api/magic-schools/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/magic-schools/${index}`);
  });
});
