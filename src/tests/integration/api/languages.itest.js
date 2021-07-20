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
  await redisClient.quit();
});

describe('/api/languages', () => {
  it('should list languages', async () => {
    const res = await request(app).get('/api/languages');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/languages');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/languages?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/languages');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/languages?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/languages/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/languages');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/languages/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/languages/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
