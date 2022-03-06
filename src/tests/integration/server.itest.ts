import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import createApp from '../../server';
import { mongodbUri, redisClient } from '../../util';
let app: Application;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  await redisClient.connect();
  app = await createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
});

describe('/', () => {
  it('should load the page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('/docs', () => {
  it('should load the page', async () => {
    const res = await request(app).get('/docs');
    expect(res.statusCode).toEqual(200);
  });
});

describe('/bad-url', () => {
  it('404s', async () => {
    const res = await request(app).get('/bad-url');
    expect(res.statusCode).toEqual(404);
  });
});

describe('/api', () => {
  it('should list the endpoints', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ability-scores');
  });
});
