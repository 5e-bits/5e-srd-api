const { GraphQLScalarType, Kind } = require('graphql');

const subtypes = [
  'ANY_RACE',
  'HUMAN',
  'DWARF',
  'ELF',
  'GOBLINOID',
  'MERFOLK',
  'SHAPECHANGER',
  'DEMON',
  'DEVIL',
  'ORC',
  'SAHUAGIN',
  'TITAN',
  'KOBOLD',
  'GNOLL',
  'GRIMLOCK',
  'LIZARDFOLK',
  'GNOME',
];

const getSubtype = subtype => subtype.toLowerCase().replace('_', ' ');

const MonsterSubtypeFilter = new GraphQLScalarType({
  name: 'MonsterSubtypeFilter',
  description: 'MonsterSubtype or list of MonsterSubtypes',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      const filter = [];
      for (const x of value) {
        if (typeof x === 'string' && subtypes.includes(x)) {
          filter.push(getSubtype(x));
        }
      }

      return filter;
    } else if (typeof value === 'string' && subtypes.includes(value)) {
      return [getSubtype(value)];
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      const filter = [];
      for (const x of ast.values) {
        if (x.kind === Kind.ENUM && subtypes.includes(x.value)) {
          filter.push(getSubtype(x.value));
        }
      }

      return filter;
    } else if (ast.kind === Kind.ENUM && subtypes.includes(ast.value)) {
      return [getSubtype(ast.value)];
    } else {
      return null;
    }
  },
});

module.exports = MonsterSubtypeFilter;
