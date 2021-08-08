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

describe('/api/monsters', () => {
  it('should list monsters', async () => {
    const res = await request(app).get('/api/monsters');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  it('should hit the cache', async () => {
    redisClient.flushall();
    const clientSet = jest.spyOn(redisClient, 'set');
    let res = await request(app).get('/api/monsters');
    res = await request(app).get('/api/monsters');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
    expect(clientSet).toHaveBeenCalledTimes(1);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/monsters');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/monsters?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/monsters');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/monsters?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('with challenge_rating query', () => {
    describe('with only one provided challenge rating', () => {
      it('returns expected objects', async () => {
        const expectedCR = 0.25;
        const res = await request(app).get(`/api/monsters?challenge_rating=${expectedCR}`);
        expect(res.statusCode).toEqual(200);

        const randomIndex = Math.floor(Math.random() * res.body.results.length);
        const randomResult = res.body.results[randomIndex];

        const indexRes = await request(app).get(`/api/monsters/${randomResult.index}`);
        expect(indexRes.statusCode).toEqual(200);
        expect(indexRes.body.challenge_rating).toEqual(expectedCR);
      });
    });

    describe('with many provided challenge ratings', () => {
      it('returns expected objects', async () => {
        const cr1 = 1;
        const cr1Res = await request(app).get(`/api/monsters?challenge_rating=${cr1}`);
        expect(cr1Res.statusCode).toEqual(200);

        const cr20 = 20;
        const cr20Res = await request(app).get(`/api/monsters?challenge_rating=${cr20}`);
        expect(cr20Res.statusCode).toEqual(200);

        const bothRes = await request(app).get(`/api/monsters?challenge_rating=${cr1},${cr20}`);
        expect(bothRes.statusCode).toEqual(200);
        expect(bothRes.body.count).toEqual(cr1Res.body.count + cr20Res.body.count);

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length);
        const randomResult = bothRes.body.results[randomIndex];

        const indexRes = await request(app).get(`/api/monsters/${randomResult.index}`);
        expect(indexRes.statusCode).toEqual(200);
        expect(
          indexRes.body.challenge_rating == cr1 || indexRes.body.challenge_rating == cr20
        ).toBeTruthy();
      });
    });
  });

  describe('/api/monsters/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/monsters');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/monsters/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/monsters/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
