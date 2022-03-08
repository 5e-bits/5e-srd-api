import { ApolloServer } from 'apollo-server-express';
import { ApolloServerPluginCacheControl } from 'apollo-server-core';
import responseCachePlugin from 'apollo-server-plugin-response-cache';
import schema from '../graphql/schema';

const createApolloMiddleware = async () => {
  const server = new ApolloServer({
    schema,
    plugins: [
      responseCachePlugin(),
      ApolloServerPluginCacheControl({
        // Cache everything for 1 second by default.
        defaultMaxAge: 3600,
        // Don't send the `cache-control` response header.
        calculateHttpHeaders: false,
      }),
    ],
  });
  return server;
};

export { createApolloMiddleware };
