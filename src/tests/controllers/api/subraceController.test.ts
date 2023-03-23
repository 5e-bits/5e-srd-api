import mockingoose from 'mockingoose';
import { createRequest, createResponse } from 'node-mocks-http';
import * as SubraceController from '../../../controllers/api/subraceController.js';

import { mockNext } from '../../support/requestHelpers.js';

import Proficiency from '../../../models/proficiency/index.js';
import Subrace from '../../../models/subrace/index.js';
import Trait from '../../../models/trait/index.js';

beforeEach(() => {
  mockingoose.resetAll();
});

describe('index', () => {
  const findDoc = [
    {
      index: 'high-elf',
      name: 'High Elf',
      url: '/api/subraces/high-elf',
    },
    {
      index: 'wood-elf',
      name: 'Wood Elf',
      url: '/api/subraces/wood-elf',
    },
    {
      index: 'dark-elf',
      name: 'Dark Elf',
      url: '/api/subraces/dark-elf',
    },
    {
      index: 'hill-dwarf',
      name: 'Hill Dwarf',
      url: '/api/subraces/hill-dwarf',
    },
    {
      index: 'mountain-dwarf',
      name: 'Mountain Dwarf',
      url: '/api/subraces/mountain-dwarf',
    },
    {
      index: 'lightfoot-halfling',
      name: 'Lightfoot Halfling',
      url: '/api/subraces/lightfoot-halfling',
    },
    {
      index: 'stout-halfling',
      name: 'Stout Halfling',
      url: '/api/subraces/stout-halfling',
    },
    {
      index: 'rock-gnome',
      name: 'Rock Gnome',
      url: '/api/subraces/rock-gnome',
    },
  ];
  const request = createRequest({ query: {} });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Subrace).toReturn(findDoc, 'find');

    await SubraceController.index(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Subrace).toReturn(error, 'find');

      await SubraceController.index(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('show', () => {
  const findOneDoc = {
    index: 'high-elf',
    name: 'High Elf',
    url: '/api/subraces/high-elf',
  };

  const showParams = { index: 'high-elf' };
  const request = createRequest({ params: showParams });

  it('returns an object', async () => {
    const response = createResponse();
    mockingoose(Subrace).toReturn(findOneDoc, 'findOne');

    await SubraceController.show(request, response, mockNext);

    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response._getData())).toStrictEqual(expect.objectContaining(showParams));
  });

  describe('when the record does not exist', () => {
    it('404s', async () => {
      const response = createResponse();
      mockingoose(Subrace).toReturn(null, 'findOne');

      const invalidShowParams = { index: 'abcd' };
      const invalidRequest = createRequest({ params: invalidShowParams });
      await SubraceController.show(invalidRequest, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalled();
    });
  });

  describe('when something goes wrong', () => {
    it('is handled', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Subrace).toReturn(error, 'findOne');

      await SubraceController.show(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showTraitsForSubrace', () => {
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
      index: 'extra-language',
      name: 'Extra Language',
      url: '/api/traits/extra-language',
    },
  ];
  const showParams = { index: 'elf' };
  const request = createRequest({ params: showParams });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Trait).toReturn(findDoc, 'find');

    await SubraceController.showTraitsForSubrace(request, response, mockNext);

    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Trait).toReturn(error, 'find');

      await SubraceController.showTraitsForSubrace(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});

describe('showProficienciesForSubrace', () => {
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
  const request = createRequest({ params: { index: 'high-elf' } });

  it('returns a list of objects', async () => {
    const response = createResponse();
    mockingoose(Proficiency).toReturn(findDoc, 'find');

    await SubraceController.showProficienciesForSubrace(request, response, mockNext);
    expect(response.statusCode).toBe(200);
  });

  describe('when something goes wrong', () => {
    it('handles the error', async () => {
      const response = createResponse();
      const error = new Error('Something went wrong');
      mockingoose(Proficiency).toReturn(error, 'find');

      await SubraceController.showProficienciesForSubrace(request, response, mockNext);

      expect(response.statusCode).toBe(200);
      expect(response._getData()).toStrictEqual('');
      expect(mockNext).toHaveBeenCalledWith(error);
    });
  });
});
