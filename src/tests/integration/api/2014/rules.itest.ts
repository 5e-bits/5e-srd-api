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

describe('/api/2014/rules', () => {
  it('should list rules', async () => {
    const res = await request(app).get('/api/2014/rules');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  it('should hit the cache', async () => {
    await redisClient.del('/api/2014/rules');
    const clientSet = jest.spyOn(redisClient, 'set');
    let res = await request(app).get('/api/2014/rules');
    res = await request(app).get('/api/2014/rules');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
    expect(clientSet).toHaveBeenCalledTimes(1);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/2014/rules');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/rules?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/rules');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/rules?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('with desc query', () => {
    it('returns the object with matching desc', async () => {
      const indexRes = await request(app).get('/api/2014/rules');
      const index = indexRes.body.results[1].index;
      const res = await request(app).get(`/api/rules/${index}`);
      const name = res.body.name;
      const descRes = await request(app).get(`/api/rules?desc=${name}`);
      expect(descRes.statusCode).toEqual(200);
      expect(descRes.body.results[0].index).toEqual(index);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/2014/rules');
      const index = indexRes.body.results[1].index;
      const name = indexRes.body.results[1].name;
      const queryDesc = name.toLowerCase();
      const res = await request(app).get(`/api/rules?desc=${queryDesc}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].index).toEqual(index);
    });
  });

  describe('/api/2014/rules/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/2014/rules');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/rules/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return 404', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/rules/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
