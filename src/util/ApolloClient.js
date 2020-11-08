const Realm = require('realm-web');
const { ApolloClient, HttpLink, InMemoryCache } = require('@apollo/client');
const { realmAppId, realmApiKey } = require('./environmentVariables');
const fetch = require('node-fetch');

// Connect to your MongoDB Realm app
const app = new Realm.App(realmAppId);

// Get a valid Realm user access token to authenticate requests
async function getValidAccessToken() {
  if (!app.currentUser) {
    // If no user is logged in, log in
    const credentials = Realm.Credentials.apiKey(realmApiKey);
    await app.logIn(credentials);
  } else {
    // The logged in user's access token might be stale,
    // Refreshing custom data also refreshes the access token
    await app.currentUser.refreshCustomData();
  }
  // Get a valid access token for the current user
  return app.currentUser.accessToken;
}

const graphql_url = `https://realm.mongodb.com/api/client/v2.0/app/${realmAppId}/graphql`;

const client = new ApolloClient({
  link: new HttpLink({ uri: graphql_url, fetch }),
  cache: new InMemoryCache(),
  fetch: async (uri, options) => {
    const accessToken = await getValidAccessToken();
    options.headers.Authorization = `Bearer ${accessToken}`;
    return fetch(uri, options);
  }
});

module.exports = client;
