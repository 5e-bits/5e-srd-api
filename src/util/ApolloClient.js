const { ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');
const fetch = require('node-fetch');
const { graphqlUrl, getValidAccessToken } = require('./RealmClient');

const client = new ApolloClient({
  link: new HttpLink({
    uri: graphqlUrl,
    fetch: async (uri, options) => {
      const accessToken = await getValidAccessToken();
      options.headers.Authorization = `Bearer ${accessToken}`;
      return fetch(uri, options);
    }
  }),
  cache: new InMemoryCache()
});

module.exports = client;
