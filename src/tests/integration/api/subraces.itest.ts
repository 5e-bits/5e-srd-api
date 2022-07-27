import { mongodbUri, redisClient } from '../../../util';

import { Application } from 'express';
import createApp from '../../../server';
import { jest } from '@jest/globals';
import mongoose from 'mongoose';
import request from 'supertest';

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

describe('/api/subraces', () => {
  it('should list subraces', async () => {
    const res = await request(app).get('/api/subraces');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/subraces');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/subraces?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/subraces');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/subraces?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/subraces/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/subraces');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/subraces/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/subraces/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });

    describe('/api/subraces/:index/traits', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/subraces');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/subraces/${index}/traits`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/subraces/:index/proficiencies', () => {
      it('returns objects', async () => {
        const res = await request(app).get(`/api/subraces/high-elf/proficiencies`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });
  });
});
