const { createEnumScalarType } = require('./enumFilterResolver');

const types = ['SPHERE', 'CUBE', 'CYLINDER', 'LINE', 'CONE'];

const getType = type => type.toLowerCase();

const AreaOfEffectTypeFilter = createEnumScalarType(
  'AreaOfEffectTypeFilter',
  'AreaOfEffectType or list of AreaOfEffectTypes',
  types,
  getType
);

module.exports = AreaOfEffectTypeFilter;
