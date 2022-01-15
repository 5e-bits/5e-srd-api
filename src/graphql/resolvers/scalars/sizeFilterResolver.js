const { GraphQLScalarType, Kind } = require('graphql');

const sizes = ['MEDIUM', 'LARGE', 'TINY', 'HUGE', 'SMALL', 'GARGANTUAN'];

const getSize = size => size[0].toUpperCase() + size.slice(1).toLowerCase();

const SizeFilter = new GraphQLScalarType({
  name: 'SizeFilter',
  description: 'Size or list of sizes',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      const filter = [];
      for (const x of value) {
        if (typeof x === 'string' && sizes.includes(x)) {
          filter.push(getSize(x));
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (typeof value === 'string' && sizes.includes(value)) {
      return [getSize(value)];
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      const filter = [];
      for (const x of ast.values) {
        if (x.kind === Kind.ENUM && sizes.includes(x.value)) {
          filter.push(getSize(x.value));
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (ast.kind === Kind.ENUM && sizes.includes(ast.value)) {
      return [getSize(ast.value)];
    } else {
      return null;
    }
  },
});

module.exports = SizeFilter;
