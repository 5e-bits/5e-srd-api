import { Level } from '../../models/level/types';
import { Feature } from '../../models/feature/types';

const SpellPrerequisite = {
  __resolveType(prerequisite: Level | Feature) {
    if ('features' in prerequisite) return 'Level';
    if ('prerequisites' in prerequisite) return 'Feature';

    return null;
  },
};

export default SpellPrerequisite;
