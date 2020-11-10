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

afterAll(() => {
  mongoose.disconnect();
  redisClient.quit();
});

describe('/api/classes', () => {
  it('should list classes', async () => {
    const res = await request(app).get('/api/classes');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/classes');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/classes?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/classes');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/classes?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('/api/classes/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/classes');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/classes/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });

    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/classes/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });

    describe('/api/classes/:index/subclasses', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/subclasses`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/classes/:index/starting-equipment', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/starting-equipment`);
        expect(res.statusCode).toEqual(200);
      });
    });

    describe('/api/classes/:index/spellcasting', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/spellcasting`);
        expect(res.statusCode).toEqual(200);
      });
    });

    describe('/api/classes/:index/spells', () => {
      it('returns objects', async () => {
        const res = await request(app).get(`/api/classes/wizard/spells`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/classes/:index/features', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/features`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/classes/:index/proficiencies', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/proficiencies`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/classes/:index/levels', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/classes');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/classes/${index}/levels`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).not.toEqual(0);
      });

      describe('/api/classes/:index/levels/:level', () => {
        it('returns objects', async () => {
          const indexRes = await request(app).get('/api/classes');
          const index = indexRes.body.results[1].index;
          const level = 1;
          const res = await request(app).get(`/api/classes/${index}/levels/${level}`);
          expect(res.statusCode).toEqual(200);
          expect(res.body.level).toEqual(level);
        });
      });

      describe('/api/classes/:index/levels/:level/spells', () => {
        it('returns objects', async () => {
          const index = 'wizard';
          const level = 1;
          const res = await request(app).get(`/api/classes/${index}/levels/${level}/spells`);
          expect(res.statusCode).toEqual(200);
          expect(res.body.results.length).not.toEqual(0);
        });
      });

      describe('/api/classes/:index/levels/:level/features', () => {
        it('returns objects', async () => {
          const indexRes = await request(app).get('/api/classes');
          const index = indexRes.body.results[1].index;
          const level = 1;
          const res = await request(app).get(`/api/classes/${index}/levels/${level}/spells`);
          expect(res.statusCode).toEqual(200);
          expect(res.body.results.length).not.toEqual(0);
        });
      });
    });
  });
});
