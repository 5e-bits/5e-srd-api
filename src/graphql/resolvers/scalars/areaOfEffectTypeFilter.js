import { createEnumScalarType } from './enumFilterResolver.js';

const types = ['SPHERE', 'CUBE', 'CYLINDER', 'LINE', 'CONE'];

const getType = type => type.toLowerCase();

const AreaOfEffectTypeFilter = createEnumScalarType(
  'AreaOfEffectTypeFilter',
  'AreaOfEffectType ("SPHERE", "CUBE", "CYLINDER", "LINE", "CONE") or list of AreaOfEffectTypes',
  types,
  getType
);

export default AreaOfEffectTypeFilter;
