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

describe('/api/proficiencies', () => {
  it('should list proficiencies', async () => {
    const res = await request(app).get('/api/proficiencies');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/proficiencies');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/proficiencies?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/proficiencies');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/proficiencies?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/proficiencies/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/proficiencies');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/proficiencies/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/proficiencies/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
