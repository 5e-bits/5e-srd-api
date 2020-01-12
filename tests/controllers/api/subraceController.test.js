const mockingoose = require('mockingoose').default;
const { mockRequest, mockResponse, mockNext } = require('../../support/requestHelpers');

const Subrace = require('../../../models/subrace');
const Trait = require('../../../models/trait');
const Proficiency = require('../../../models/proficiency');

const SubraceController = require('../../../controllers/api/subraceController');

let response;
beforeEach(() => {
  mockingoose.resetAll();
  response = mockResponse();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'high-elf',
      name: 'High Elf',
      url: '/api/subraces/high-elf'
    },
    {
      index: 'hill-dwarf',
      name: 'Hill Dwarf',
      url: '/api/subraces/hill-dwarf'
    },
    {
      index: 'lightfoot-halfling',
      name: 'Lightfoot Halfling',
      url: '/api/subraces/lightfoot-halfling'
    },
    {
      index: 'rock-gnome',
      name: 'Rock Gnome',
      url: '/api/subraces/rock-gnome'
    }
  ];
  const request = mockRequest({ query: {} });

  it('returns a list of objects', async () => {
    mockingoose(Subrace).toReturn(findDoc, 'find');

    await SubraceController.index(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subrace).toReturn(error, 'find');

      await SubraceController.index(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'high-elf',
    name: 'High Elf',
    url: '/api/subraces/high-elf'
  };

  const showParams = { index: 'high-elf' };
  const request = mockRequest({ params: showParams });

  it('returns an object', async () => {
    mockingoose(Subrace).toReturn(findOneDoc, 'findOne');

    await SubraceController.show(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
    expect(response.json).toHaveBeenCalledWith(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      mockingoose(Subrace).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = mockRequest({ params: invalidShowParams });
      await SubraceController.show(invalidRequest, response, mockNext);

      expect(response.status).toHaveBeenCalledWith(404);
      expect(response.json).toHaveBeenCalledWith({ error: 'Not found' });
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Subrace).toReturn(error, 'findOne');

      await SubraceController.show(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showTraitsForSubrace', () => {
  const findDoc = [
    {
      index: 'darkvision',
      name: 'Darkvision',
      url: '/api/traits/darkvision'
    },
    {
      index: 'elf-weapon-training',
      name: 'Elf Weapon Training',
      url: '/api/traits/elf-weapon-training'
    },
    {
      index: 'extra-language',
      name: 'Extra Language',
      url: '/api/traits/extra-language'
    }
  ];
  const showParams = { index: 'elf' };
  const request = mockRequest({ params: showParams });

  it('returns a list of objects', async () => {
    mockingoose(Trait).toReturn(findDoc, 'find');

    await SubraceController.showTraitsForSubrace(request, response, mockNext);

    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Trait).toReturn(error, 'find');

      await SubraceController.showTraitsForSubrace(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showProficienciesForSubrace', () => {
  const findDoc = [
    {
      index: 'daggers',
      name: 'Daggers',
      url: '/api/proficiencies/daggers'
    },
    {
      index: 'darts',
      name: 'Darts',
      url: '/api/proficiencies/darts'
    },
    {
      index: 'quarterstaffs',
      name: 'Quarterstaffs',
      url: '/api/proficiencies/quarterstaffs'
    }
  ];
  const request = mockRequest({ params: { index: 'high-elf' } });

  it('returns a list of objects', async () => {
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await SubraceController.showProficienciesForSubrace(request, response, mockNext);
    expect(response.status).toHaveBeenCalledWith(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await SubraceController.showProficienciesForSubrace(request, response, mockNext);

      expect(response.status).not.toHaveBeenCalled();
      expect(response.json).not.toHaveBeenCalled();
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
