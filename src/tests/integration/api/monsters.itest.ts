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

describe('/api/monsters', () => {
  it('redirects to /api/2014/monsters', async () => {
    await request(app).get('/api/monsters').expect(301).expect('Location', '/api/2014/monsters');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'Aboleth';
    await request(app)
      .get(`/api/monsters?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/monsters?name=${name}`);
  });

  it('redirects to /api/2014/monsters/{index}', async () => {
    const index = 'acolyte';
    await request(app)
      .get(`/api/monsters/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/monsters/${index}`);
  });
});
