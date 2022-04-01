const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');

const Class = require('../../../models/class');
const Level = require('../../../models/level');
const Subclass = require('../../../models/subclass');
const Spell = require('../../../models/spell');
const Feature = require('../../../models/feature');
const Proficiency = require('../../../models/proficiency');

const ClassController = require('../../../controllers/api/classController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
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
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Class).toReturn(findDoc, 'find');

    await ClassController.index(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'find');

      await ClassController.index(request, response, mockNext);
      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.show(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid index', () => {
    it('404s', async () => {
      mockingoose(Class).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ query: {}, params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(Level).toReturn(findDoc, 'find');

    await ClassController.showLevelsForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid index is given', () => {
    describe('when an invalid index is given', () => {
      it('404s', async () => {
        mockingoose(Level).toReturn(null, 'findOne');

        const invalidShowParams = { index: 'test' };
        const invalidRequest = mockRequest({ query: {}, params: invalidShowParams });
        await ClassController.showLevelsForClass(invalidRequest, response, mockNext);

        expect(response.status).toHaveBeenCalledWith(404);
        expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
      });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'find');

      await ClassController.showLevelsForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Level).toReturn(findOneDoc, 'findOne');

    await ClassController.showLevelForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ level: findOneDoc.level, url: findOneDoc.url })
    );
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'findOne');

      await ClassController.showLevelForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid level', () => {
    it('404s', async () => {
      mockingoose(Level).toReturn(findOneDoc, 'findOne');

      const invalidShowParams = { index: 'barbarian', level: 'a' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.showLevelForClass(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('with an out of bounds level', () => {
    it('404s', async () => {
      mockingoose(Level).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'barbarian', level: '-1' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.showLevelForClass(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith();
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
  const request = mockRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(Subclass).toReturn(findDoc, 'find');

    await ClassController.showSubclassesForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid index is given', () => {
    it('404s', async () => {
      mockingoose(Subclass).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'test' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.showSubclassesForClass(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'find');

      await ClassController.showSubclassesForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
        from: [
          [
            {
              equipment: {
                index: 'crossbow-light',
                name: 'Crossbow, light',
                url: '/api/equipment/crossbow-light',
              },
              quantity: 1,
            },
            {
              equipment: {
                index: 'crossbow-bolt',
                name: 'Crossbow bolt',
                url: '/api/equipment/crossbow-bolt',
              },
              quantity: 20,
            },
          ],
          {
            equipment_option: {
              choose: 1,
              type: 'equipment',
              from: {
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
    ],
  };
  const request = mockRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showStartingEquipmentForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showStartingEquipmentForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'warlock' } });

  it('returns a spellcasting object', async () => {
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showSpellcastingForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showSpellcastingForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'warlock' } });

  it('returns a multi-classing object', async () => {
    mockingoose(Class).toReturn(findOneDoc, 'findOne');

    await ClassController.showMulticlassingForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Class).toReturn(error, 'findOne');

      await ClassController.showMulticlassingForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    mockingoose(Spell).toReturn(findDoc, 'find');

    await ClassController.showSpellsForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Spell).toReturn(error, 'find');

      await ClassController.showSpellsForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'wizard', level: 1 } });

  it('returns a list of objects', async () => {
    mockingoose(Spell).toReturn(findDoc, 'find');

    await ClassController.showSpellsForClassAndLevel(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid level is given', () => {
    it('404s', async () => {
      mockingoose(Spell).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.showSpellsForClassAndLevel(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Spell).toReturn(error, 'find');

      await ClassController.showSpellsForClassAndLevel(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    mockingoose(Feature).toReturn(findDoc, 'find');

    await ClassController.showFeaturesForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await ClassController.showFeaturesForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'wizard', level: 1 } });

  it('returns a list of objects', async () => {
    mockingoose(Feature).toReturn(findDoc, 'find');

    await ClassController.showFeaturesForClassAndLevel(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid level is given', () => {
    it('404s', async () => {
      mockingoose(Feature).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ClassController.showFeaturesForClassAndLevel(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await ClassController.showFeaturesForClassAndLevel(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
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
  const request = mockRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await ClassController.showProficienciesForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await ClassController.showProficienciesForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
