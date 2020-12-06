const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Language = require('../../../models/language');
const LanguageController = require('../../../controllers/api/languageController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'abyssal',
      name: 'Abyssal',
      url: '/api/languages/abyssal'
    },
    {
      index: 'celestial',
      name: 'Celestial',
      url: '/api/languages/celestial'
    },
    {
      index: 'common',
      name: 'Common',
      url: '/api/languages/common'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Language).toReturn(findDoc, 'find');

    await LanguageController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Language).toReturn(error, 'find');

      await LanguageController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'abyssal',
    name: 'Abyssal',
    url: '/api/languages/abyssal'
  };

  const showParams = { index: 'abyssal' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Language).toReturn(findOneDoc, 'findOne');

    await LanguageController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Language).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await LanguageController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Language).toReturn(error, 'findOne');

      await LanguageController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
