const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Race = require('../../../models/race');
const RaceController = require('../../../controllers/api/raceController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = {
    count: 3,
    results: [
      {
        index: 'dragonborn',
        name: 'Dragonborn',
        url: '/api/races/dragonborn'
      },
      {
        index: 'dwarf',
        name: 'Dwarf',
        url: '/api/races/dwarf'
      },
      {
        index: 'elf',
        name: 'Elf',
        url: '/api/races/elf'
      }
    ]
  };
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Race).toReturn(findDoc, 'find');

    await RaceController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Race).toReturn(error, 'find');

      await RaceController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new TypeError('data.map is not a function'));
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'dragonborn',
    name: 'Dragonborn',
    url: '/api/races/dragonborn'
  };

  const showParams = { index: 'dragonborn' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Race).toReturn(findOneDoc, 'findOne');

    await RaceController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Race).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await RaceController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Race).toReturn(error, 'findOne');

      await RaceController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
