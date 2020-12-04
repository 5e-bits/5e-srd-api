const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const MagicSchool = require('../../../models/magicSchool');
const MagicSchoolController = require('../../../controllers/api/magicSchoolController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'abjuration',
      name: 'Abjuration',
      url: '/api/magic-schools/abjuration',
    },
    {
      index: 'conjuration',
      name: 'Conjuration',
      url: '/api/magic-schools/conjuration',
    },
    {
      index: 'divination',
      name: 'Divination',
      url: '/api/magic-schools/divination',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(MagicSchool).toReturn(findDoc, 'find');

    await MagicSchoolController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(MagicSchool).toReturn(error, 'find');

      await MagicSchoolController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'abjuration',
    name: 'Abjuration',
    url: '/api/magic-schools/abjuration',
  };

  const showParams = { index: 'abjuration' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(MagicSchool).toReturn(findOneDoc, 'findOne');

    await MagicSchoolController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(MagicSchool).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await MagicSchoolController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(MagicSchool).toReturn(error, 'findOne');

      await MagicSchoolController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
