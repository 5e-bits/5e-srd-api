const { GraphQLScalarType, Kind } = require('graphql');

const types = [
  'WEAPONS',
  'ARTISANS_TOOLS',
  'SKILLS',
  'ARMOR',
  'MUSICAL_INSTRUMENTS',
  'SAVING_THROWS',
  'OTHER',
  'GAMING_SETS',
  'VEHICLES',
];

const getType = type => {
  if (type === 'ARTISANS_TOOLS') {
    return "Artisan's Tools";
  } else {
    const words = type.split('_');
    for (let i = 0; i < words.length; ++i) {
      words[i] = words[i][0] + words[i].slice(1).toLowerCase();
    }

    return words.join(' ');
  }
};

const ProficiencyTypeFilter = new GraphQLScalarType({
  name: 'ProficiencyTypeFilter',
  description: 'ProficiencyType or list of ProficiencyTypes',
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

      return filter;
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

      return filter;
    } else if (ast.kind === Kind.ENUM && types.includes(ast.value)) {
      return [getType(ast.value)];
    } else {
      return null;
    }
  },
});

module.exports = ProficiencyTypeFilter;
