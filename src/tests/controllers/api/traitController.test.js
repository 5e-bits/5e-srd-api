const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const Trait = require('../../../models/trait');
const TraitController = require('../../../controllers/api/traitController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'artificers-lore',
      name: "Artificer's Lore",
      url: '/api/traits/artificers-lore',
    },
    {
      index: 'brave',
      name: 'Brave',
      url: '/api/traits/brave',
    },
    {
      index: 'breath-weapon',
      name: 'Breath Weapon',
      url: '/api/traits/breath-weapon',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Trait).toReturn(findDoc, 'find');

    await TraitController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Trait).toReturn(error, 'find');

      await TraitController.index(request, response, mockNext);

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
    url: '/api/traits/abyssal',
  };

  const showParams = { index: 'abyssal' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Trait).toReturn(findOneDoc, 'findOne');

    await TraitController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Trait).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await TraitController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Trait).toReturn(error, 'findOne');

      await TraitController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
