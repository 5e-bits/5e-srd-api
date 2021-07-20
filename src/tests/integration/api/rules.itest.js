const mongoose = require('mongoose');
const request = require('supertest');
const createApp = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');
let app;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  app = await createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
});

describe('/api/rules', () => {
  it('should list rules properties', async () => {
    const res = await request(app).get('/api/rules');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  it('should hit the cache', async () => {
    redisClient.del('/api/rules');
    const clientSet = jest.spyOn(redisClient, 'set');
    let res = await request(app).get('/api/rules');
    res = await request(app).get('/api/rules');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
    expect(clientSet).toHaveBeenCalledTimes(1);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/rules');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/rules?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/rules');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/rules?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('with desc query', () => {
    it('returns the object with matching desc', async () => {
      const indexRes = await request(app).get('/api/rules');
      let index = indexRes.body.results[1].index;
      const res = await request(app).get(`/api/rules/${index}`);
      const name = res.body.name;
      const descRes = await request(app).get(`/api/rules?desc=${name}`);
      expect(descRes.statusCode).toEqual(200);
      expect(descRes.body.results[0].index).toEqual(index);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/rules');
      const index = indexRes.body.results[1].index;
      const name = indexRes.body.results[1].name;
      const queryDesc = name.toLowerCase();
      const res = await request(app).get(`/api/rules?desc=${queryDesc}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].index).toEqual(index);
    });
  });

  describe('/api/rules/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/rules');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/rules/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/rules/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
