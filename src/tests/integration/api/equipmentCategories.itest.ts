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

describe('/api/equipment-categories', () => {
  it('redirects to /api/2014/equipment-categories', async () => {
    await request(app)
      .get('/api/equipment-categories')
      .expect(301)
      .expect('Location', '/api/2014/equipment-categories');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Adventuring%20Gear'
    await request(app)
      .get(`/api/equipment-categories?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment-categories?name=${name}`);
  });

  it('redirects to /api/2014/equipment-categories/{index}', async () => {
    const index = 'ammunition'
    await request(app)
      .get(`/api/equipment-categories/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/equipment-categories/${index}`);
  });
});
