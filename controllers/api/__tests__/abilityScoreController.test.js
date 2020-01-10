const mockingoose = require('mockingoose').default;
const AbilityScore = require('../../../models/abilityScore');
const findDoc = {
  count: 5,
  results: [
    {
      index: 'str',
      name: 'STR',
      url: '/api/ability-scores/str'
    },
    {
      index: 'dex',
      name: 'DEX',
      url: '/api/ability-scores/dex'
    },
    {
      index: 'con',
      name: 'CON',
      url: '/api/ability-scores/con'
    }
  ]
};
const AbilityScoreController = require('../abilityScoreController');

const mockRequest = (reqData = {}) => {
  return reqData;
};

const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn();

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  it('returns a list of objects', async () => {
    mockingoose(AbilityScore).toReturn(findDoc, 'find');

    const req = mockRequest({ query: {} });
    const res = mockResponse();

    await AbilityScoreController.index(req, res, mockNext);
    expect(res.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(AbilityScore).toReturn(error, 'find');

      const req = mockRequest({ query: {} });
      const res = mockResponse();

      await AbilityScoreController.index(req, res, mockNext);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(new TypeError('data.map is not a function'));
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'str',
    name: 'STR',
    url: '/api/ability-scores/str'
  };

  it('returns an object', async () => {
    mockingoose(AbilityScore).toReturn(findOneDoc, 'findOne');

    const showQuery = { index: 'str' };
    const req = mockRequest({ params: showQuery });
    const res = mockResponse();

    await AbilityScoreController.show(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining(showQuery));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(AbilityScore).toReturn(null, 'findOne');

      const showQuery = { index: 'str' };
      const req = mockRequest({ params: showQuery });
      const res = mockResponse();

      await AbilityScoreController.show(req, res, mockNext);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(AbilityScore).toReturn(error, 'findOne');

      const showQuery = { index: 'str' };
      const req = mockRequest({ params: showQuery });
      const res = mockResponse();

      await AbilityScoreController.show(req, res, mockNext);
      expect(res.status).not.toHaveBeenCalled();
      expect(res.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
