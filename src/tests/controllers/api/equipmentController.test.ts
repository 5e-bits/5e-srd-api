const mockingoose = require('mockingoose');
import { mockRequest, mockResponse, mockNext } from '../../support/requestHelpers';
import Equipment from '../../../models/equipment';
import EquipmentController from '../../../controllers/api/equipmentController';

let response: any;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'abacus',
      name: 'Abacus',
      url: '/api/equipment/abacus',
    },
    {
      index: 'acid-vial',
      name: 'Acid (vial)',
      url: '/api/equipment/acid-vial',
    },
    {
      index: 'alchemists-fire-flask',
      name: "Alchemist's fire (flask)",
      url: '/api/equipment/alchemists-fire-flask',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Equipment).toReturn(findDoc, 'find');

    await EquipmentController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Equipment).toReturn(error, 'find');

      await EquipmentController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'abacus',
    name: 'Abacus',
    url: '/api/equipment/abacus',
  };

  const showParams = { index: 'abacus' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Equipment).toReturn(findOneDoc, 'findOne');

    await EquipmentController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Equipment).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await EquipmentController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Equipment).toReturn(error, 'findOne');

      await EquipmentController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
