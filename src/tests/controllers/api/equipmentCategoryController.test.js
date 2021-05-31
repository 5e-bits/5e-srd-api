const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');
const EquipmentCategory = require('../../../models/equipmentCategory');
const EquipmentCategoryController = require('../../../controllers/api/equipmentCategoryController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'adventuring-gear',
      name: 'Adventuring Gear',
      url: '/api/equipment-categories/adventuring-gear',
    },
    {
      index: 'armor',
      name: 'Armor',
      url: '/api/equipment-categories/armor',
    },
    {
      index: 'artisans-tools',
      name: "Artisan's Tools",
      url: '/api/equipment-categories/artisans-tools',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(EquipmentCategory).toReturn(findDoc, 'find');

    await EquipmentCategoryController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(EquipmentCategory).toReturn(error, 'find');

      await EquipmentCategoryController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'adventuring-gear',
    name: 'Adventuring Gear',
    url: '/api/equipment-categories/adventuring-gear',
  };

  const showParams = { index: 'adventuring-gear' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(EquipmentCategory).toReturn(findOneDoc, 'findOne');

    await EquipmentCategoryController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(EquipmentCategory).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await EquipmentCategoryController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(EquipmentCategory).toReturn(error, 'findOne');

      await EquipmentCategoryController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
