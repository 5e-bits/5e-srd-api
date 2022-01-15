const { GraphQLScalarType, Kind } = require('graphql');

const IntFilter = new GraphQLScalarType({
  name: 'IntFilter',
  description:
    'Int, list of ints, or object with gte (>=), gt (>), lte (<=), and lt (<) properties for range of values',
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

      return filter.length > 0 ? filter : null;
    } else if (Number.isInteger(value)) {
      return [value];
    } else if (typeof value === 'object') {
      const returnObject = {};
      if (Number.isInteger(value.lte)) {
        returnObject.lte = value.lte;
      }
      if (Number.isInteger(value.gte)) {
        returnObject.gte = value.gte;
      }
      if (Number.isInteger(value.lt)) {
        returnObject.lt = value.lt;
      }
      if (Number.isInteger(value.gt)) {
        returnObject.gt = value.gt;
      }

      return Object.keys(returnObject).length > 0 ? returnObject : null;
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

      return filter.length > 0 ? filter : null;
    } else if (ast.kind === Kind.INT) {
      return [ast.value];
    } else if (ast.kind === Kind.OBJECT) {
      const returnObject = {};
      const lte = ast.fields.find(f => f.name.value === 'lte');
      const gte = ast.fields.find(f => f.name.value === 'gte');
      const lt = ast.fields.find(f => f.name.value === 'lt');
      const gt = ast.fields.find(f => f.name.value === 'gt');

      if (lte && lte.value.kind === Kind.INT) {
        returnObject.lte = lte.value.value;
      }
      if (gte && gte.value.kind === Kind.INT) {
        returnObject.gte = gte.value.value;
      }
      if (lt && lt.value.kind === Kind.INT) {
        returnObject.lt = lt.value.value;
      }
      if (gt && gt.value.kind === Kind.INT) {
        returnObject.gt = gt.value.value;
      }

      return Object.keys(returnObject).length > 0 ? returnObject : null;
    } else {
      return null;
    }
  },
});

module.exports = IntFilter;
