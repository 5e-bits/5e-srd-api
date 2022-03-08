// import mockingoose from 'mockingoose';
import { mockRequest, mockResponse, mockNext } from '../support/requestHelpers';
import { MockResponse } from '../support/types.d';
import AbilityScore from '../../models/abilityScore';
import SimpleController from '../../controllers/simpleController';

let response: MockResponse;
let simpleController: SimpleController;
beforeEach(() => {
  // mockingoose.resetAll();
  response = mockResponse();
  simpleController = new SimpleController(AbilityScore);
});

describe('index', () => {
  const findDoc = [
    {
      index: 'str',
      name: 'STR',
      url: '/api/ability-scores/str',
    },
    {
      index: 'dex',
      name: 'DEX',
      url: '/api/ability-scores/dex',
    },
    {
      index: 'con',
      name: 'CON',
      url: '/api/ability-scores/con',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    jest.spyOn(AbilityScore, 'find').mockReturnValueOnce(findDoc);

    await simpleController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(AbilityScore, 'find').mockReturnValueOnce(error);

      await simpleController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'str',
    name: 'STR',
    url: '/api/ability-scores/str',
  };

  const showParams = { index: 'str' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    jest.spyOn(AbilityScore, 'findOne').mockReturnValueOnce(findOneDoc);

    await simpleController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      jest.spyOn(AbilityScore, 'findOne').mockReturnValueOnce(null);

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await simpleController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      jest.spyOn(AbilityScore, 'findOne').mockReturnValueOnce(error);

      await simpleController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
