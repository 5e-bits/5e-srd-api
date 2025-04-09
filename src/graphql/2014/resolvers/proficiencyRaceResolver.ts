import { Race } from '@/models/2014/race/index.js';
import { Subrace } from '@/models/2014/subrace/index.js';

const ProficiencyRaceResolver = {
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

export default ProficiencyRaceResolver;
