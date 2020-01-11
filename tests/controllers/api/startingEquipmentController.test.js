const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const StartingEquipment = require('../../../models/startingEquipment');
const StartingEquipmentController = require('../../../controllers/api/startingEquipmentController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 1,
      class: 'Barbarian',
      url: '/api/startingequipment/1'
    },
    {
      index: 2,
      class: 'Bard',
      url: '/api/startingequipment/2'
    },
    {
      index: 3,
      class: 'Cleric',
      url: '/api/startingequipment/3'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(StartingEquipment).toReturn(findDoc, 'find');

    await StartingEquipmentController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(StartingEquipment).toReturn(error, 'find');

      await StartingEquipmentController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 1,
    class: 'Barbarian',
    url: '/api/startingequipment/1'
  };

  const showParams = { index: 1 };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(StartingEquipment).toReturn(findOneDoc, 'findOne');

    await StartingEquipmentController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(StartingEquipment).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await StartingEquipmentController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(StartingEquipment).toReturn(error, 'findOne');

      await StartingEquipmentController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
