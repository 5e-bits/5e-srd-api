import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginCacheControl } from '@apollo/server/plugin/cacheControl';
import depthLimit from 'graphql-depth-limit';
import schema from '../graphql/2014/schema.js';

const createApolloMiddleware = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [
      ApolloServerPluginCacheControl({
        // Cache everything for 1 second by default.
        defaultMaxAge: 3600,
        // Don't send the `cache-control` response header.
        calculateHttpHeaders: false,
      }),
    ],
    introspection: true,
    validationRules: [depthLimit(20)],
  });
  return server;
};

export { createApolloMiddleware };
