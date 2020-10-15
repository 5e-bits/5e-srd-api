const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
});

describe('/api/conditions', () => {
  it('should list conditions', async () => {
    const res = await request(app).get('/api/conditions');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/conditions');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/conditions?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/conditions');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/conditions?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/conditions/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/conditions');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/conditions/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/conditions/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
