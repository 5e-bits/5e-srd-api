const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const skill = require('../../../models/skill');
const skillController = require('../../../controllers/api/skillController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'acrobatics',
      name: 'Acrobatics',
      url: '/api/skills/acrobatics'
    },
    {
      index: 'animal-handling',
      name: 'Animal Handling',
      url: '/api/skills/animal-handling'
    },
    {
      index: 'arcana',
      name: 'Arcana',
      url: '/api/skills/arcana'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(skill).toReturn(findDoc, 'find');

    await skillController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(skill).toReturn(error, 'find');

      await skillController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'acrobatics',
    name: 'Acrobatics',
    url: '/api/skills/acrobatics'
  };

  const showParams = { index: 'acrobatics' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(skill).toReturn(findOneDoc, 'findOne');

    await skillController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(skill).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await skillController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(skill).toReturn(error, 'findOne');

      await skillController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
