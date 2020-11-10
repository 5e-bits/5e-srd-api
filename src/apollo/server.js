const { ApolloServer } = require('apollo-server-express');
const fetch = require('node-fetch');
const { introspectSchema, wrapSchema } = require('graphql-tools');
const { print } = require('graphql');
const { graphqlUrl, getValidAccessToken, realmAvailable } = require('../util/RealmClient');

// This pattern copied from https://www.graphql-tools.com/docs/remote-schemas/
const executor = async ({ document, variables, _context }) => {
  const accessToken = await getValidAccessToken();
  const query = print(document);
  const fetchResult = await fetch(graphqlUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body: JSON.stringify({ query, variables })
  });
  return fetchResult.json();
};

const createApolloMiddleware = async () => {
  const schema = wrapSchema({
    schema: await introspectSchema(executor),
    executor
  });
  const server = new ApolloServer({ schema });
  return server;
};

const apolloAvailable = () => {
  return realmAvailable();
};

module.exports = { createApolloMiddleware, apolloAvailable };
