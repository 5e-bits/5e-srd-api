import { GraphQLScalarType } from 'graphql';

const IntOrString = new GraphQLScalarType({
  name: 'IntOrString',
  description: 'Int or string',
  serialize(value) {
    return value;
  },
});

export default IntOrString;
