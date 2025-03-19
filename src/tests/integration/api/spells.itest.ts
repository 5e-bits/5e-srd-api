import { mongodbUri, redisClient } from '@/util';

import { Application } from 'express';
import createApp from '@/server';
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

describe('/api/spells', () => {
  it('redirects to /api/2014/spells', async () => {
    await request(app).get('/api/spells').expect(301).expect('Location', '/api/2014/spells');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Acid%20Arrow';
    await request(app)
      .get(`/api/spells?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/spells?name=${name}`);
  });

  it('redirects to /api/2014/spells/{index}', async () => {
    const index = 'aid';
    await request(app)
      .get(`/api/spells/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/spells/${index}`);
  });
});
