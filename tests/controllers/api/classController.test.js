const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');

const Class = require('../../../models/class');
const Level = require('../../../models/level');
const Subclass = require('../../../models/subclass');
const StartingEquipment = require('../../../models/startingEquipment');

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
      url: '/api/classes/barbarian'
    },
    {
      index: 'bard',
      name: 'Bard',
      url: '/api/classes/bard'
    },
    {
      index: 'cleric',
      name: 'Cleric',
      url: '/api/classes/cleric'
    }
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
    url: '/api/classes/barbarian'
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

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});

describe('showLevelsForClass', () => {
  const findDoc = [
    {
      index: 1,
      level: 1,
      url: '/api/classes/barbarian/level/1'
    },
    {
      index: 2,
      level: 2,
      url: '/api/classes/barbarian/level/2'
    },
    {
      index: 3,
      level: 3,
      url: '/api/classes/barbarian/level/3'
    }
  ];
  const request = mockRequest({ params: { index: 'barbarian' } });

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
        const invalidRequest = mockRequest({ params: invalidShowParams });
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
    index: 1,
    level: 1,
    url: '/api/classes/barbarian/level/1'
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

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});

describe('showSubclassesForClass', () => {
  const findDoc = [
    {
      index: 'berserker',
      name: 'Berserker',
      url: '/api/subclasses/berserker'
    }
  ];
  const request = mockRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(Subclass).toReturn(findDoc, 'find');

    await ClassController.showSubclassesForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid index is given', () => {
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
    index: 1,
    starting_equipment: [],
    url: '/api/startingequipment/1'
  };
  const request = mockRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(StartingEquipment).toReturn(findOneDoc, 'findOne');

    await ClassController.showStartingEquipmentForClass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(StartingEquipment).toReturn(error, 'findOne');

      await ClassController.showStartingEquipmentForClass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
