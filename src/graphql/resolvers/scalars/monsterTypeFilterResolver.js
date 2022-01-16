const { createEnumScalarType } = require('./enumFilterResolver');

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

const getType = type => {
  if (type === 'SWARM') {
    return 'swarm of Tiny beasts';
  } else {
    return type.toLowerCase();
  }
};

const MonsterTypeFilter = createEnumScalarType(
  'MonsterTypeFilter',
  'MonsterTypes or list of MonsterTypes',
  types,
  getType
);

module.exports = MonsterTypeFilter;
