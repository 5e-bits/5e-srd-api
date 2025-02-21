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

describe('/api/subraces', () => {
  it('redirects to /api/2014/subraces', async () => {
    await request(app)
      .get('/api/subraces')
      .expect(301)
      .expect('Location', '/api/2014/subraces');
  });

  it('redirects preserving query parameters', async () => {
    const name = 'High%20Elf'
    await request(app)
      .get(`/api/subraces?name=${name}`)
      .expect(301)
      .expect('Location', `/api/2014/subraces?name=${name}`);
  });

  it('redirects to /api/2014/subraces/{index}', async () => {
    const index = 'hill-dwarf'
    await request(app)
      .get(`/api/subraces/${index}`)
      .expect(301)
      .expect('Location', `/api/2014/subraces/${index}`);
  });
});
