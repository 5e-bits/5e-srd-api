import { mongodbUri, redisClient } from '../../../../util';

import { Application } from 'express';
import { jest } from '@jest/globals';
import createApp from '../../../../server';

import mongoose from 'mongoose';
import request from 'supertest';

let app: Application;
let server: any;

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri);
  await redisClient.connect();
  app = await createApp();
  server = app.listen(); // Start the server and store the instance
});

afterAll(async () => {
  await mongoose.disconnect();
  await redisClient.quit();
  server.close();
});

describe('/api/2014/subclasses', () => {
  it('should list subclasses', async () => {
    const res = await request(app).get('/api/2014/subclasses');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/subclasses');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/subclasses?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/subclasses');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/subclasses?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/2014/subclasses/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/2014/subclasses');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/subclasses/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/subclasses/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });

    describe('/api/2014/subclasses/:index/levels', () => {
      it('returns objects', async () => {
        const index = 'berserker';
        const res = await request(app).get(`/api/subclasses/${index}/levels`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).not.toEqual(0);
      });

      describe('/api/2014/subclasses/:index/levels/:level', () => {
        it('returns objects', async () => {
          const index = 'berserker';
          const level = 3;
          const res = await request(app).get(`/api/subclasses/${index}/levels/${level}`);
          expect(res.statusCode).toEqual(200);
          expect(res.body.level).toEqual(level);
        });

        describe('/api/2014/subclasses/:index/levels/:level/features', () => {
          it('returns objects', async () => {
            const index = 'berserker';
            const level = 3;
            const res = await request(app).get(`/api/subclasses/${index}/levels/${level}/features`);
            expect(res.statusCode).toEqual(200);
            expect(res.body.results.length).not.toEqual(0);
          });
        });
      });
    });
  });
});