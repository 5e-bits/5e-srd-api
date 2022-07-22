import { GraphQLScalarType, Kind } from 'graphql';

export const createEnumScalarType = (name, description, values, getValue) =>
  new GraphQLScalarType({
    name,
    description,
    serialize(value) {
      return value;
    },
    parseValue(value) {
      if (Array.isArray(value)) {
        const filter = [];
        for (const x of value) {
          if (typeof x === 'string' && values.includes(x)) {
            filter.push(getValue(x));
          }
        }

        return filter.length > 0 ? filter : null;
      } else if (typeof value === 'string' && values.includes(value)) {
        return [getValue(value)];
      } else {
        return null;
      }
    },
    parseLiteral(ast) {
      if (ast.kind === Kind.LIST) {
        const filter = [];
        for (const x of ast.values) {
          if (x.kind === Kind.ENUM && values.includes(x.value)) {
            filter.push(getValue(x.value));
          }
        }

        return filter.length > 0 ? filter : null;
      } else if (ast.kind === Kind.ENUM && values.includes(ast.value)) {
        return [getValue(ast.value)];
      } else {
        return null;
      }
    },
  });
