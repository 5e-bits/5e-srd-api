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
