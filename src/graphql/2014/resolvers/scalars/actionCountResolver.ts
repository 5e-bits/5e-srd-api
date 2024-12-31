import { GraphQLScalarType } from 'graphql';

const ActionCount = new GraphQLScalarType({
  name: 'ActionCount',
  description: 'Int or string',
  serialize(value) {
    return value;
  },
});

export default ActionCount;
