import { createEnumScalarType } from './enumFilterResolver'

const types = ['MELEE', 'RANGED']

const getType = (type: string) => type.toLowerCase()

const SpellAttackTypeFilter = createEnumScalarType(
  'SpellAttackTypeFilter',
  'SpellAttackType ("MELEE", "RANGED") or list of SpellAttackTypes',
  types,
  getType
)

export default SpellAttackTypeFilter
