import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as SubclassController from '../../../../controllers/api/2014/subclassController.js';

import { mockNext } from '../../../support/requestHelpers.js';

import Feature from '../../../../models/2014/feature/index.js';
import Level from '../../../../models/2014/level/index.js';
import Subclass from '../../../../models/2014/subclass/index.js';

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
    mockingoose(Subclass).toReturn(findDoc, 'find');

    await SubclassController.index(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'find');

      await SubclassController.index(request, response, mockNext);
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
    mockingoose(Subclass).toReturn(findOneDoc, 'findOne');

    await SubclassController.show(request, response, mockNext);
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Subclass).toReturn(error, 'findOne');

      await SubclassController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid index', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Subclass).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubclassController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });
});

describe('showLevelsForSubclass', () => {
  const findDoc = [
    {
      index: 'barbarian-1',
      level: 1,
      url: '/api/subclasses/barbarian/level/1',
    },
    {
      index: 'barbarian-2',
      level: 2,
      url: '/api/subclasses/barbarian/level/2',
    },
    {
      index: 'barbarian-3',
      level: 3,
      url: '/api/subclasses/barbarian/level/3',
    },
  ];
  const request = createRequest({ params: { index: 'barbarian' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Level).toReturn(findDoc, 'find');

    await SubclassController.showLevelsForSubclass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid index is given', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Level).toReturn([], 'find');

      const invalidShowParams = { index: 'test' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubclassController.showLevelsForSubclass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response._getData())).toStrictEqual([]);
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Level).toReturn(error, 'find');

      await SubclassController.showLevelsForSubclass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showLevelForSubclass', () => {
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

    await SubclassController.showLevelForSubclass(request, response, mockNext);
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

      await SubclassController.showLevelForSubclass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });

  describe('with an invalid level', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Level).toReturn(findOneDoc, 'findOne');

      const invalidShowParams = { index: 'barbarian', level: 'a' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubclassController.showLevelForSubclass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response._getData())).toStrictEqual({ error: 'Not found' });
    });
  });

  describe('with an out of bounds level', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Level).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'barbarian', level: '30' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubclassController.showLevelForSubclass(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith();
    });
  });
});

describe('showFeaturesForSubclass', () => {
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

    await SubclassController.showFeaturesForSubclass(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await SubclassController.showFeaturesForSubclass(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showFeaturesForSubclassAndLevel', () => {
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

    await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when an invalid level is given', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Feature).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'wizard', level: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubclassController.showFeaturesForSubclassAndLevel(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response._getData())).toStrictEqual({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Feature).toReturn(error, 'find');

      await SubclassController.showFeaturesForSubclassAndLevel(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
