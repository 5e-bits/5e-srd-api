import { makeExecutableSchema } from '@graphql-tools/schema';
import path from 'path';
import { readFileSync } from 'fs';
import resolvers from './resolvers/rootResolvers.js';

const typeDefs = readFileSync(
  path.resolve(process.cwd(), 'src', 'graphql', 'typeDefs.graphql'),
  'utf-8'
);
const schema = makeExecutableSchema({ typeDefs, resolvers });

export default schema;
