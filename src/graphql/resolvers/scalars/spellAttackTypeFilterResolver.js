import { createEnumScalarType } from './enumFilterResolver.js';

const types = ['MELEE', 'RANGED'];

const getType = type => type.toLowerCase();

const SpellAttackTypeFilter = createEnumScalarType(
  'SpellAttackTypeFilter',
  'SpellAttackType ("MELEE", "RANGED") or list of SpellAttackTypes',
  types,
  getType
);

export default SpellAttackTypeFilter;
