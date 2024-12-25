import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { mockNext } from '../../support/requestHelpers.js';

import EquipmentCategory from '../../../models/2014/equipmentCategory/index.js';
import EquipmentCategoryController from '../../../controllers/api/equipmentCategoryController.js';

beforeEach(() => {
  mockingoose.resetAll();
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
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(EquipmentCategory).toReturn(findDoc, 'find');

    await EquipmentCategoryController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(EquipmentCategory).toReturn(error, 'find');

      await EquipmentCategoryController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
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
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(EquipmentCategory).toReturn(findOneDoc, 'findOne');

    await EquipmentCategoryController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(EquipmentCategory).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await EquipmentCategoryController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(EquipmentCategory).toReturn(error, 'findOne');

      await EquipmentCategoryController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
