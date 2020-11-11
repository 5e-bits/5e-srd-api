const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('../../server');
const { mongodbUri, redisClient } = require('../../util');
let app;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = await createApp();
});

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
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
