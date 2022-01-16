const { createEnumScalarType } = require('./enumFilterResolver');

const types = ['MELEE', 'RANGED'];

const getType = type => type.toLowerCase();

const SpellAttackTypeFilter = createEnumScalarType(
  'SpellAttackTypeFilter',
  'SpellAttackType or list of SpellAttackTypes',
  types,
  getType
);

module.exports = SpellAttackTypeFilter;
