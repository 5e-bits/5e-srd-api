import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as ClassController from '@/controllers/api/2014/classController';

import { mockNext } from '@/tests/support';

import Class from '@/models/2014/class';
import Feature from '@/models/2014/feature';
import Level from '@/models/2014/level';
import Proficiency from '@/models/2014/proficiency';
import Spell from '@/models/2014/spell';
import Subclass from '@/models/2014/subclass';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'barbarian',
      name: 'Barbarian',
      url: '/api/classes/barbarian',
    },
    {
      index: 'bard',
      name: 'Bard',
      url: '/api/classes/bard',
    },
    {
      index: 'cleric',
      name: 'Cleric',
      url: '/api/classes/cleric',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Class).toReturn(findDoc, 'find');

    await ClassController.index(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'find');

      await ClassController.index(request, response, mockNext);
      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'barbarian',
    name: 'Barbarian',
    url: '/api/classes/barbarian',
  };

  const showParams = { index: 'barbarian' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.show(request, response, mockNext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid index', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Class).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('showLevelsForClass', () => {
  const findDoc = [
    {
      index: 'barbarian-1',
      level: 1,
      url: '/api/classes/barbarian/level/1',
    },
    {
      index: 'barbarian-2',
      level: 2,
      url: '/api/classes/barbarian/level/2',
    },
    {
      index: 'barbarian-3',
      level: 3,
      url: '/api/classes/barbarian/level/3',
    },
  ];
  const request = createRequest({ query: {}, params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Level).toReturn(findDoc, 'find');

    await ClassController.showLevelsForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid index is given', () => {
    describe('when an invalid index is given', () => {
      it('404s', async () => {
        const response = createResponse();
        mockingoose(Level).toReturn(null, 'findOne');

        const invalidShowParams = { index: 'test' };
        const invalidRequest = createRequest({ query: {}, params: invalidShowParams });
        await ClassController.showLevelsForClass(invalidRequest, response, mockNext);

        expect(response.statusCode).toBe(404);
        expect(JSON.parse(response._getData())).toStrictEqual({ error: 'Not found' });
      });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'find');

      await ClassController.showLevelsForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showLevelForClass', () => {
  const findOneDoc = {
    index: 'barbarian-1',
    level: 1,
    url: '/api/classes/barbarian/level/1',
  };

  const showParams = { index: 'barbarian', level: '1' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Level).toReturn(findOneDoc, 'findOne');

    await ClassController.showLevelForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(
      expect.objectContaining({ level: findOneDoc.level, url: findOneDoc.url })
    );
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'findOne');

      await ClassController.showLevelForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid level', () => {
    it('400s', async () => {
      const response = createResponse();
      const invalidShowParams = { index: 'barbarian', level: 'a' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.showLevelForClass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response._getData());
      expect(responseData.error).toEqual('Invalid path parameters');
      expect(responseData.details).toEqual(expect.any(Array));
    });
  });

  describe('with an out of bounds level', () => {
    it('400s', async () => {
      const response = createResponse();
      const invalidShowParams = { index: 'barbarian', level: '30' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.showLevelForClass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response._getData());
      expect(responseData.error).toEqual('Invalid path parameters');
      expect(responseData.details).toEqual(expect.any(Array));
    });
  });
});

describe('showSubclassesForClass', () => {
  const findDoc = [
    {
      index: 'berserker',
      name: 'Berserker',
      url: '/api/subclasses/berserker',
    },
  ];
  const request = createRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Subclass).toReturn(findDoc, 'find');

    await ClassController.showSubclassesForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid index is given', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Subclass).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'test' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.showSubclassesForClass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response._getData())).toStrictEqual({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'find');

      await ClassController.showSubclassesForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showStartingEquipmentForClass', () => {
  const findOneDoc = {
    index: 8,
    class: 'Warlock',
    url: '/api/classes/warlock',
    starting_equipment: [
      {
        equipment: {
          index: 'dagger',
          name: 'Dagger',
          url: '/api/equipment/dagger',
        },
        quantity: 2,
      },
    ],
    starting_equipment_options: [
      {
        choose: 1,
        type: 'equipment',
        from: {
          option_set_type: 'options_array',
          options: [
            {
              option_type: 'multiple',
              items: [
                {
                  of: {
                    index: 'crossbow-light',
                    name: 'Crossbow, light',
                    url: '/api/equipment/crossbow-light',
                  },
                  count: 1,
                },
                {
                  of: {
                    index: 'crossbow-bolt',
                    name: 'Crossbow bolt',
                    url: '/api/equipment/crossbow-bolt',
                  },
                  count: 20,
                },
              ],
            },
            {
              option_type: 'choice',
              choice: {
                choose: 1,
                type: 'equipment',
                from: {
                  option_set_type: 'equipment_category',
                  equipment_category: {
                    index: 'simple-weapons',
                    name: 'Simple Weapons',
                    url: '/api/equipment-categories/simple-weapons',
                  },
                },
              },
            },
          ],
        },
      },
    ],
  };
  const request = createRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showStartingEquipmentForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    const response = createResponse();
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showStartingEquipmentForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showSpellcastingForClass', () => {
  const findOneDoc = {
    index: 8,
    class: 'Warlock',
    url: '/api/classes/warlock',
    spellcasting: {
      level: 1,
      spellcasting_ability: {
        index: 'cha',
        name: 'CHA',
        url: '/api/ability-scores/cha',
      },
      info: [
        {
          name: 'Cantrips',
          desc: [
            'You know two cantrips of your choice from the warlock spell list. You learn additional warlock cantrips of your choice at higher levels, as shown in the Cantrips Known column of the Warlock table.',
          ],
        },
      ],
    },
  };
  const request = createRequest({ params: { index: 'warlock' } });

  it('returns a spellcasting object', async () => {
    const response = createResponse();
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showSpellcastingForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showSpellcastingForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showMulticlassingForClass', () => {
  const findOneDoc = {
    index: 8,
    class: 'Warlock',
    url: '/api/classes/warlock',
    multi_classing: {
      some: 'data',
    },
  };
  const request = createRequest({ params: { index: 'warlock' } });

  it('returns a multi-classing object', async () => {
    const response = createResponse();
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showMulticlassingForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showMulticlassingForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showSpellsForClass', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash',
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch',
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights',
    },
  ];
  const request = createRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Spell).toReturn(findDoc, 'find');

    await ClassController.showSpellsForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Spell).toReturn(error, 'find');

      await ClassController.showSpellsForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showSpellsForClassAndLevel', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash',
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch',
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights',
    },
  ];
  const request = createRequest({ params: { index: 'wizard', level: 1 } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Spell).toReturn(findDoc, 'find');

    await ClassController.showSpellsForClassAndLevel(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid level is given', () => {
    it('400s', async () => {
      const response = createResponse();
      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.showSpellsForClassAndLevel(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response._getData());
      expect(responseData.error).toEqual('Invalid path parameters');
      expect(responseData.details).toEqual(expect.any(Array));
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Spell).toReturn(error, 'find');

      await ClassController.showSpellsForClassAndLevel(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showFeaturesForClass', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash',
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch',
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights',
    },
  ];
  const request = createRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Feature).toReturn(findDoc, 'find');

    await ClassController.showFeaturesForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await ClassController.showFeaturesForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showFeaturesForClassAndLevel', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash',
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch',
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights',
    },
  ];
  const request = createRequest({ params: { index: 'wizard', level: 1 } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Feature).toReturn(findDoc, 'find');

    await ClassController.showFeaturesForClassAndLevel(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid level is given', () => {
    it('400s', async () => {
      const response = createResponse();
      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await ClassController.showFeaturesForClassAndLevel(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(400);
      const responseData = JSON.parse(response._getData());
      expect(responseData.error).toEqual('Invalid path parameters');
      expect(responseData.details).toEqual(expect.any(Array));
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await ClassController.showFeaturesForClassAndLevel(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showProficienciesForClass', () => {
  const findDoc = [
    {
      index: 'daggers',
      name: 'Daggers',
      url: '/api/proficiencies/daggers',
    },
    {
      index: 'darts',
      name: 'Darts',
      url: '/api/proficiencies/darts',
    },
    {
      index: 'quarterstaffs',
      name: 'Quarterstaffs',
      url: '/api/proficiencies/quarterstaffs',
    },
  ];
  const request = createRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await ClassController.showProficienciesForClass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await ClassController.showProficienciesForClass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
