import { Application } from 'express';
import mongoose from 'mongoose';
import request from 'supertest';
import createApp from '../../../server';
import { mongodbUri, redisClient } from '../../../util';
let app: Application;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri);
  await redisClient.connect();
  app = await createApp();
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
});

describe('/api/equipment', () => {
  it('should list equipment', async () => {
    const res = await request(app).get('/api/equipment');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/equipment');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/equipment?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/equipment');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/equipment?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/equipment/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/equipment');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/equipment/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/equipment/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
