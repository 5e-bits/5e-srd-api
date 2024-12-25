import { Race } from '../../models/2014/race/types';
import { Subrace } from '../../models/2014/subrace/types';

const ProficiencyRace = {
  __resolveType(proficiencyRace: Race | Subrace) {
    if (proficiencyRace.url.includes('subrace')) {
      return 'Subrace';
    }
    if (proficiencyRace.url.includes('race')) {
      return 'Race';
    }

    return null;
  },
};

export default ProficiencyRace;
