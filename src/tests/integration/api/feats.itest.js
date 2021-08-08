const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');
let app;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = await createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await new Promise(resolve => {
    redisClient.quit(() => {
      resolve();
    });
  });
  // redis.quit() creates a thread to close the connection.
  // We wait until all threads have been run once to ensure the connection closes.
  await new Promise(resolve => setImmediate(resolve));
});

describe('/api/feats', () => {
  it('should list feats', async () => {
    const res = await request(app).get('/api/feats');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/feats');
      const name = indexRes.body.results[0].name;
      const res = await request(app).get(`/api/feats?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/feats');
      const name = indexRes.body.results[0].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/feats?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/feats/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/feats');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/feats/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/feats/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
