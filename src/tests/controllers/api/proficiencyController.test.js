const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Proficiency = require('../../../models/proficiency');
const ProficiencyController = require('../../../controllers/api/proficiencyController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'alchemists-supplies',
      name: "Alchemist's supplies",
      url: '/api/proficiencies/alchemists-supplies'
    },
    {
      index: 'all-armor',
      name: 'All armor',
      url: '/api/proficiencies/all-armor'
    },
    {
      index: 'bagpipes',
      name: 'Bagpipes',
      url: '/api/proficiencies/bagpipes'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await ProficiencyController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await ProficiencyController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'alchemists-supplies',
    name: "Alchemist's supplies",
    url: '/api/proficiencies/alchemists-supplies'
  };

  const showParams = { index: 'alchemists-supplies' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Proficiency).toReturn(findOneDoc, 'findOne');

    await ProficiencyController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Proficiency).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await ProficiencyController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'findOne');

      await ProficiencyController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
