import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import depthLimit from 'graphql-depth-limit';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import schema from '../graphql/schema.js';

const createApolloMiddleware = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [
      // The type voodoo is needed because of a bug in apollo-server-plugin-response-cache
      (responseCachePlugin as any).default() as any,
      ApolloServerPluginCacheControl({
        // Cache everything for 1 second by default.
        defaultMaxAge: 3600,
        // Don't send the `cache-control` response header.
        calculateHttpHeaders: false,
      }),
    ],
    validationRules: [depthLimit(20)],
  });
  return server;
};

export { createApolloMiddleware };
