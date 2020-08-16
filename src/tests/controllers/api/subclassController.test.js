const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');

const Subclass = require('../../../models/subclass');
const Level = require('../../../models/level');
const Feature = require('../../../models/feature');

const SubclassController = require('../../../controllers/api/subclassController');

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
    mockingoose(Subclass).toReturn(findDoc, 'find');

    await SubclassController.index(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'find');

      await SubclassController.index(request, response, mockNext);
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
    mockingoose(Subclass).toReturn(findOneDoc, 'findOne');

    await SubclassController.show(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'findOne');

      await SubclassController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid index', () => {
    it('404s', async () => {
      mockingoose(Subclass).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SubclassController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});

describe('showLevelsForSubclass', () => {
  const findDoc = [
    {
      index: 'barbarian-1',
      level: 1,
      url: '/api/subclasses/barbarian/level/1'
    },
    {
      index: 'barbarian-2',
      level: 2,
      url: '/api/subclasses/barbarian/level/2'
    },
    {
      index: 'barbarian-3',
      level: 3,
      url: '/api/subclasses/barbarian/level/3'
    }
  ];
  const request = mockRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    mockingoose(Level).toReturn(findDoc, 'find');

    await SubclassController.showLevelsForSubclass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid index is given', () => {
    it('404s', async () => {
      mockingoose(Level).toReturn([], 'find');

      const invalidShowParams = { index: 'test' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SubclassController.showLevelsForSubclass(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(200);
      expect(response.json).toHaveBeenCalledWith([]);
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'find');

      await SubclassController.showLevelsForSubclass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showLevelForSubclass', () => {
  const findOneDoc = {
    index: 'barbarian-1',
    level: 1,
    url: '/api/classes/barbarian/level/1'
  };

  const showParams = { index: 'barbarian', level: '1' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Level).toReturn(findOneDoc, 'findOne');

    await SubclassController.showLevelForSubclass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(
      expect.objectContaining({ level: findOneDoc.level, url: findOneDoc.url })
    );
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'findOne');

      await SubclassController.showLevelForSubclass(request, response, mockNext);

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
      await SubclassController.showLevelForSubclass(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('with an out of bounds level', () => {
    it('404s', async () => {
      mockingoose(Level).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'barbarian', level: '30' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SubclassController.showLevelForSubclass(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });
});

describe('showFeaturesForSubclass', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash'
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch'
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights'
    }
  ];
  const request = mockRequest({ params: { index: 'wizard' } });

  it('returns a list of objects', async () => {
    mockingoose(Feature).toReturn(findDoc, 'find');

    await SubclassController.showFeaturesForSubclass(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await SubclassController.showFeaturesForSubclass(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showFeaturesForSubclassAndLevel', () => {
  const findDoc = [
    {
      index: 'acid-splash',
      name: 'Acid Splash',
      url: '/api/spells/acid-splash'
    },
    {
      index: 'chill-touch',
      name: 'Chill Touch',
      url: '/api/spells/chill-touch'
    },
    {
      index: 'dancing-lights',
      name: 'Dancing Lights',
      url: '/api/spells/dancing-lights'
    }
  ];
  const request = mockRequest({ params: { index: 'wizard', level: 1 } });

  it('returns a list of objects', async () => {
    mockingoose(Feature).toReturn(findDoc, 'find');

    await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when an invalid level is given', () => {
    it('404s', async () => {
      mockingoose(Feature).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SubclassController.showFeaturesForSubclassAndLevel(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
