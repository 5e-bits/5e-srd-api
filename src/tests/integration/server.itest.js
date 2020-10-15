const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../server');
const { mongodbUri, redisClient } = require('../../util');

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

describe('/', () => {
  it('should load the page', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toEqual(200);
  });
});

describe('/docs', () => {
  it('should load the page', async () => {
    const res = await request(app).get('/docs');
    expect(res.statusCode).toEqual(200);
  });
});

describe('/bad-url', () => {
  it('404s', async () => {
    const res = await request(app).get('/bad-url');
    expect(res.statusCode).toEqual(404);
  });
});

describe('/api', () => {
  it('should list the endpoints', async () => {
    const res = await request(app).get('/api');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('ability-scores');
  });
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
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/proficiencies/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});

describe('/api/races', () => {
  it('should list races', async () => {
    const res = await request(app).get('/api/races');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/races');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/races?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/races');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/races?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });
  describe('/api/races/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/races');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/races/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/races/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
    describe('/api/races/:index/subraces', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/subraces`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });
    describe('/api/races/:index/proficiencies', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/proficiencies`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });

    describe('/api/races/:index/traits', () => {
      it('returns objects', async () => {
        const indexRes = await request(app).get('/api/races');
        const index = indexRes.body.results[1].index;
        const res = await request(app).get(`/api/races/${index}/traits`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.results.length).not.toEqual(0);
      });
    });
  });
});

describe('/api/skills', () => {
  it('should list skills', async () => {
    const res = await request(app).get('/api/skills');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/skills');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/skills?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/skills');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/skills?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });
  describe('/api/skills/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/skills');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/skills/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/skills/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
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

describe('/api/spells', () => {
  it('should list spells', async () => {
    const res = await request(app).get('/api/spells');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });

  it('should hit the cache', async () => {
    redisClient.del('/api/spells');
    const clientSet = jest.spyOn(redisClient, 'set');
    let res = await request(app).get('/api/spells');
    res = await request(app).get('/api/spells');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
    expect(clientSet).toHaveBeenCalledTimes(1);
  });

  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/spells');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/spells?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/spells');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/spells?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });

  describe('with level query', () => {
    it('returns expected objects', async () => {
      const expectedLevel = 2;
      const res = await request(app).get(`/api/spells?level=${expectedLevel}`);
      expect(res.statusCode).toEqual(200);

      const randomIndex = Math.floor(Math.random() * res.body.results.length);
      const randomResult = res.body.results[randomIndex];

      const indexRes = await request(app).get(`/api/spells/${randomResult.index}`);
      expect(indexRes.statusCode).toEqual(200);
      expect(indexRes.body.level).toEqual(expectedLevel);
    });

    describe('with many provided level', () => {
      it('returns expected objects', async () => {
        const expectedLevel1 = 1;
        const res1 = await request(app).get(`/api/spells?level=${expectedLevel1}`);
        expect(res1.statusCode).toEqual(200);

        const expectLevel2 = 8;
        const res2 = await request(app).get(`/api/spells?level=${expectLevel2}`);
        expect(res2.statusCode).toEqual(200);

        const bothRes = await request(app).get(
          `/api/spells?level=${expectedLevel1},${expectLevel2}`
        );
        expect(bothRes.statusCode).toEqual(200);
        expect(bothRes.body.count).toEqual(res1.body.count + res2.body.count);

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length);
        const randomResult = bothRes.body.results[randomIndex];

        const indexRes = await request(app).get(`/api/spells/${randomResult.index}`);
        expect(indexRes.statusCode).toEqual(200);
        expect(
          indexRes.body.level == expectedLevel1 || indexRes.body.level == expectLevel2
        ).toBeTruthy();
      });
    });
  });

  describe('with school query', () => {
    it('returns expected objects', async () => {
      const expectedSchool = 'Illusion';
      const res = await request(app).get(`/api/spells?school=${expectedSchool}`);
      expect(res.statusCode).toEqual(200);

      const randomIndex = Math.floor(Math.random() * res.body.results.length);
      const randomResult = res.body.results[randomIndex];

      const indexRes = await request(app).get(`/api/spells/${randomResult.index}`);
      expect(indexRes.statusCode).toEqual(200);
      expect(indexRes.body.school.name).toEqual(expectedSchool);
    });

    describe('with many provided schools', () => {
      it('returns expected objects', async () => {
        const expectedSchool1 = 'Illusion';
        const res1 = await request(app).get(`/api/spells?school=${expectedSchool1}`);
        expect(res1.statusCode).toEqual(200);

        const expectedSchool2 = 'Evocation';
        const res2 = await request(app).get(`/api/spells?school=${expectedSchool2}`);
        expect(res2.statusCode).toEqual(200);

        const bothRes = await request(app).get(
          `/api/spells?school=${expectedSchool1},${expectedSchool2}`
        );
        expect(bothRes.statusCode).toEqual(200);
        expect(bothRes.body.count).toEqual(res1.body.count + res2.body.count);

        const randomIndex = Math.floor(Math.random() * bothRes.body.results.length);
        const randomResult = bothRes.body.results[randomIndex];

        const indexRes = await request(app).get(`/api/spells/${randomResult.index}`);
        expect(indexRes.statusCode).toEqual(200);
        expect(
          indexRes.body.school.name == expectedSchool1 ||
            indexRes.body.school.name == expectedSchool2
        ).toBeTruthy();
      });
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/spells');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/spells/${index}`);
      const school = showRes.body.school.name;
      const querySchool = school.toLowerCase();
      const res = await request(app).get(`/api/spells?school=${querySchool}`);

      const randomIndex = Math.floor(Math.random() * res.body.results.length);
      const randomResult = res.body.results[randomIndex];

      const queryRes = await request(app).get(`/api/spells/${randomResult.index}`);
      expect(queryRes.statusCode).toEqual(200);
      expect(queryRes.body.school.name).toEqual(school);
    });
  });

  describe('/api/spells/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/spells');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/spells/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/spells/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
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

describe('/api/subclasses', () => {
  it('should list subclasses', async () => {
    const res = await request(app).get('/api/subclasses');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/subclasses');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/subclasses?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/subclasses');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/subclasses?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });
  describe('/api/subclasses/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/subclasses');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/subclasses/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/subclasses/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });

    describe('/api/subclasses/:index/levels', () => {
      it('returns objects', async () => {
        const index = 'berserker';
        const res = await request(app).get(`/api/subclasses/${index}/levels`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.length).not.toEqual(0);
      });
      describe('/api/subclasses/:index/levels/:level', () => {
        it('returns objects', async () => {
          const index = 'berserker';
          const level = 3;
          const res = await request(app).get(`/api/subclasses/${index}/levels/${level}`);
          expect(res.statusCode).toEqual(200);
          expect(res.body.level).toEqual(level);
        });
        describe('/api/subclasses/:index/levels/:level/features', () => {
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
      it('should return one object', async () => {
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

describe('/api/traits', () => {
  it('should list traits', async () => {
    const res = await request(app).get('/api/traits');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/traits');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/traits?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/traits');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/traits?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });
  describe('/api/traits/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/traits');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/traits/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/traits/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});

describe('/api/weapon-properties', () => {
  it('should list weapon properties', async () => {
    const res = await request(app).get('/api/weapon-properties');
    expect(res.statusCode).toEqual(200);
    expect(res.body.results.length).not.toEqual(0);
  });
  describe('with name query', () => {
    it('returns the named object', async () => {
      const indexRes = await request(app).get('/api/weapon-properties');
      const name = indexRes.body.results[1].name;
      const res = await request(app).get(`/api/weapon-properties?name=${name}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });

    it('is case insensitive', async () => {
      const indexRes = await request(app).get('/api/weapon-properties');
      const name = indexRes.body.results[1].name;
      const queryName = name.toLowerCase();
      const res = await request(app).get(`/api/weapon-properties?name=${queryName}`);
      expect(res.statusCode).toEqual(200);
      expect(res.body.results[0].name).toEqual(name);
    });
  });
  describe('/api/weapon-properties/:index', () => {
    it('should return one object', async () => {
      const indexRes = await request(app).get('/api/weapon-properties');
      const index = indexRes.body.results[0].index;
      const showRes = await request(app).get(`/api/weapon-properties/${index}`);
      expect(showRes.statusCode).toEqual(200);
      expect(showRes.body.index).toEqual(index);
    });
    describe('with an invalid index', () => {
      it('should return one object', async () => {
        const invalidIndex = 'invalid-index';
        const showRes = await request(app).get(`/api/weapon-properties/${invalidIndex}`);
        expect(showRes.statusCode).toEqual(404);
      });
    });
  });
});
