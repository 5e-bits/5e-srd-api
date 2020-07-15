const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Spellcasting = require('../../../models/spellcasting');
const SpellcastingController = require('../../../controllers/api/spellcastingController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'bard',
      class: 'Bard',
      url: '/api/spellcasting/bard'
    },
    {
      index: 'cleric',
      class: 'Cleric',
      url: '/api/spellcasting/cleric'
    },
    {
      index: 'druid',
      class: 'Druid',
      url: '/api/spellcasting/druid'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Spellcasting).toReturn(findDoc, 'find');

    await SpellcastingController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Spellcasting).toReturn(error, 'find');

      await SpellcastingController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'bard',
    class: 'Bard',
    url: '/api/spellcasting/bard'
  };

  const showParams = { index: 'bard' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Spellcasting).toReturn(findOneDoc, 'findOne');

    await SpellcastingController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Spellcasting).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SpellcastingController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Spellcasting).toReturn(error, 'findOne');

      await SpellcastingController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
