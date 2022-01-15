const { GraphQLScalarType, Kind } = require('graphql');

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

const MonsterTypeFilter = new GraphQLScalarType({
  name: 'MonsterTypeFilter',
  description: 'MonsterType or list of MonsterTypes',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      const filter = [];
      for (const x of value) {
        if (typeof x === 'string' && types.includes(x)) {
          filter.push(getType(x));
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (typeof value === 'string' && types.includes(value)) {
      return [getType(value)];
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      const filter = [];
      for (const x of ast.values) {
        if (x.kind === Kind.ENUM && types.includes(x.value)) {
          filter.push(getType(x.value));
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (ast.kind === Kind.ENUM && types.includes(ast.value)) {
      return [getType(ast.value)];
    } else {
      return null;
    }
  },
});

module.exports = MonsterTypeFilter;
