const { GraphQLScalarType, Kind } = require('graphql');

const StringFilter = new GraphQLScalarType({
  name: 'StringFilter',
  description: 'String or list of strings',
  serialize(value) {
    return value;
  },
  parseValue(value) {
    if (Array.isArray(value)) {
      const filter = [];
      for (const x of value) {
        if (typeof x === 'string') {
          filter.push(x);
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (typeof value === 'string') {
      return [value];
    } else {
      return null;
    }
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.LIST) {
      const filter = [];
      for (const x of ast.values) {
        if (x.kind === Kind.STRING) {
          filter.push(x.value);
        }
      }

      return filter.length > 0 ? filter : null;
    } else if (ast.kind === Kind.STRING) {
      return [ast.value];
    } else {
      return null;
    }
  },
});

module.exports = StringFilter;
