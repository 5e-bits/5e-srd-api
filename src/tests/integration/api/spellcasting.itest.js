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

describe('/api/spellcasting', () => {
  it('should list spellcasting', async () => {
    const res = await request(app).get('/api/spellcasting');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('/api/spellcasting/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/spellcasting');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/spellcasting/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 30;
        const showRes = await request(app).get(`/api/spellcasting/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
