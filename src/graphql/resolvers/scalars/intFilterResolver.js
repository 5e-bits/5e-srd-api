const { GraphQLScalarType, Kind } = require('graphql');

const IntFilter = new GraphQLScalarType({
  name: 'IntFilter',
  description: 'Int or list of ints',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      const filter = [];
      for (const x of value) {
        if (Number.isInteger(x)) {
          filter.push(x);
        }
      }

      return filter;
    } else if (Number.isInteger(value)) {
      return [value];
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      const filter = [];
      for (const x of ast.values) {
        if (x.kind === Kind.INT) {
          filter.push(x.value);
        }
      }

      return filter;
    } else if (ast.kind === Kind.INT) {
      return [ast.value];
    } else {
      return null;
    }
  },
});

module.exports = IntFilter;
