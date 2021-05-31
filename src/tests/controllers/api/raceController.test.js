const mockingoose = require('mockingoose');
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');

const Race = require('../../../models/race');
const Subrace = require('../../../models/subrace');
const Trait = require('../../../models/trait');
const Proficiency = require('../../../models/proficiency');

const RaceController = require('../../../controllers/api/raceController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'dragonborn',
      name: 'Dragonborn',
      url: '/api/races/dragonborn',
    },
    {
      index: 'dwarf',
      name: 'Dwarf',
      url: '/api/races/dwarf',
    },
    {
      index: 'elf',
      name: 'Elf',
      url: '/api/races/elf',
    },
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Race).toReturn(findDoc, 'find');

    await RaceController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Race).toReturn(error, 'find');

      await RaceController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'dragonborn',
    name: 'Dragonborn',
    url: '/api/races/dragonborn',
  };

  const showParams = { index: 'dragonborn' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Race).toReturn(findOneDoc, 'findOne');

    await RaceController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Race).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await RaceController.show(invalidRequest, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Race).toReturn(error, 'findOne');

      await RaceController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showSubracesForRace', () => {
  const findDoc = [
    {
      index: 'high-elf',
      name: 'High Elf',
      url: '/api/subraces/high-elf',
    },
  ];
  const showParams = { index: 'dragonborn' };
  const request = mockRequest({ params: showParams });

  it('returns a list of objects', async () => {
    mockingoose(Subrace).toReturn(findDoc, 'find');

    await RaceController.showSubracesForRace(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subrace).toReturn(error, 'find');

      await RaceController.showSubracesForRace(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showTraitsForRace', () => {
  const findDoc = [
    {
      index: 'darkvision',
      name: 'Darkvision',
      url: '/api/traits/darkvision',
    },
    {
      index: 'elf-weapon-training',
      name: 'Elf Weapon Training',
      url: '/api/traits/elf-weapon-training',
    },
    {
      index: 'fey-ancestry',
      name: 'Fey Ancestry',
      url: '/api/traits/fey-ancestry',
    },
  ];
  const showParams = { index: 'elf' };
  const request = mockRequest({ params: showParams });

  it('returns a list of objects', async () => {
    mockingoose(Trait).toReturn(findDoc, 'find');

    await RaceController.showTraitsForRace(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Trait).toReturn(error, 'find');

      await RaceController.showTraitsForRace(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showProficienciesForRace', () => {
  const findDoc = [
    {
      index: 'daggers',
      name: 'Daggers',
      url: '/api/proficiencies/daggers',
    },
    {
      index: 'darts',
      name: 'Darts',
      url: '/api/proficiencies/darts',
    },
    {
      index: 'quarterstaffs',
      name: 'Quarterstaffs',
      url: '/api/proficiencies/quarterstaffs',
    },
  ];
  const request = mockRequest({ params: { index: 'elf' } });

  it('returns a list of objects', async () => {
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await RaceController.showProficienciesForRace(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await RaceController.showProficienciesForRace(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
