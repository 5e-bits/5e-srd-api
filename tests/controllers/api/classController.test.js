const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Class = require('../../../models/class');
const ClassController = require('../../../controllers/api/classController');

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
    ]
  };
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
      expect(mockNext).toHaveBeenCalledWith(new TypeError('data.map is not a function'));
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

describe('showLevelsForClass', () => {});
describe('showLevelForClass', () => {});
