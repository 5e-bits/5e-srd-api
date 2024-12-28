import { createEnumScalarType } from './enumFilterResolver.js';

const types = [
  'BEAST',
  'MONSTROSITY',
  'DRAGON',
  'HUMANOID',
  'UNDEAD',
  'FIEND',
  'CELESTIAL',
  'CONSTRUCT',
  'GIANT',
  'ELEMENTAL',
  'FEY',
  'ABERRATION',
  'OOZE',
  'SWARM',
  'PLANT',
];

const getType = (type: string) => {
  if (type === 'SWARM') {
    return 'swarm of Tiny beasts';
  } else {
    return type.toLowerCase();
  }
};

const MonsterTypeFilter = createEnumScalarType(
  'MonsterTypeFilter',
  'MonsterTypes ("BEAST", "MONSTROSITY", "DRAGON", "HUMANOID", "UNDEAD", "FIEND", "CELESTIAL", "CONSTRUCT", "GIANT", "ELEMENTAL", "FEY", "ABERRATION", "OOZE", "SWARM", "PLANT") or list of MonsterTypes',
  types,
  getType
);

export default MonsterTypeFilter;
