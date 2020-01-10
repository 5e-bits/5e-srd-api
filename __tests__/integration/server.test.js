const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const { mongodbUri } = require('../../util');

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(() => {
  mongoose.disconnect();
});

describe('Test /api', () => {
  it('should create a new post', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ability-scores');
  });
});
