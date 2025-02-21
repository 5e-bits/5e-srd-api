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

describe('/api/weapon-properties', () => {
  it('redirects to /api/2014/weapon-properties', async () => {
    await request(app)
      .get('/api/weapon-properties')
      .expect(301)
      .expect('Location', '/api/2014/weapon-properties');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Ammunition'
    await request(app)
      .get(`/api/weapon-properties?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/weapon-properties?name=${name}`);
  });

  it('redirects to /api/2014/weapon-properties/{index}', async () => {
    const index = 'finesse'
    await request(app)
      .get(`/api/weapon-properties/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/weapon-properties/${index}`);
  });
});
