const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../../server');
const { mongodbUri, redisClient } = require('../../../util');

afterEach(() => {
  jest.clearAllMocks();
});

beforeAll(async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
});

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
});


describe('/api/starting-equipment', () => {
  it('should list starting equipment', async () => {
    const res = await request(app).get('/api/starting-equipment');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('/api/starting-equipment/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/starting-equipment');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/starting-equipment/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'bad-class';
        const showRes = await request(app).get(`/api/starting-equipment/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
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

  describe('/api/rule-sections', () => {
    it('should list weapon properties', async () => {
      const res = await request(app).get('/api/rule-sections');
      expect(res.statusCode).toEqual(200);
      expect(res.body.results.length).not.toEqual(0);
    });

    it('should hit the cache', async () => {
      redisClient.del('/api/rule-sections');
      const clientSet = jest.spyOn(redisClient, 'set');
      let res = await request(app).get('/api/rule-sections');
      res = await request(app).get('/api/rule-sections');
      expect(res.statusCode).toEqual(200);
      expect(res.body.results.length).not.toEqual(0);
      expect(clientSet).toHaveBeenCalledTimes(1);
    });

    describe('with name query', () => {
      it('returns the named object', async () => {
        const indexRes = await request(app).get('/api/rule-sections');
        const name = indexRes.body.results[1].name;
        const res = await request(app).get(`/api/rule-sections?name=${name}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results[0].name).toEqual(name);
      });

      it('is case insensitive', async () => {
        const indexRes = await request(app).get('/api/rule-sections');
        const name = indexRes.body.results[1].name;
        const queryName = name.toLowerCase();
        const res = await request(app).get(`/api/rule-sections?name=${queryName}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results[0].name).toEqual(name);
      });
    });

    describe('with desc query', () => {
      it('returns the object with matching desc', async () => {
        const indexRes = await request(app).get('/api/rule-sections');
        let index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/rule-sections/${index}`);
        const name = res.body.name;
        const descRes = await request(app).get(`/api/rule-sections?desc=${name}`);
        expect(descRes.statusCode).toEqual(200);
        expect(descRes.body.results[0].index).toEqual(index);
      });

      it('is case insensitive', async () => {
        const indexRes = await request(app).get('/api/rule-sections');
        const index = indexRes.body.results[1].index;
        const name = indexRes.body.results[1].name;
        const queryDesc = name.toLowerCase();
        const res = await request(app).get(`/api/rule-sections?desc=${queryDesc}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results[0].index).toEqual(index);
      });
    });

    describe('/api/rule-sections/:index', () => {
      it('should return one object', async () => {
        const indexRes = await request(app).get('/api/rule-sections');
        const index = indexRes.body.results[0].index;
        const showRes = await request(app).get(`/api/rule-sections/${index}`);
        expect(showRes.statusCode).toEqual(200);
        expect(showRes.body.index).toEqual(index);
      });

      describe('with an invalid index', () => {
        it('should return one object', async () => {
          const invalidIndex = 'invalid-index';
          const showRes = await request(app).get(`/api/rule-sections/${invalidIndex}`);
          expect(showRes.statusCode).toEqual(404);
        });
      });
    });
  });
});
