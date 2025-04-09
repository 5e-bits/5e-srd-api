import { Level } from '@/models/2014/level';
import { Feature } from '@/models/2014/feature';

const spellPrerequisiteResolver = {
  __resolveType(prerequisite: Level | Feature) {
    if ('features' in prerequisite) return 'Level';
    if ('prerequisites' in prerequisite) return 'Feature';

    return null;
  },
};

export default spellPrerequisiteResolver;
