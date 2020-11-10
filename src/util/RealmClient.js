const Realm = require('realm-web');
const { realmAppId, realmApiKey } = require('./environmentVariables');

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

function realmAvailable() {
  return realmAppId && realmApiKey;
}

const graphqlUrl = `https://realm.mongodb.com/api/client/v2.0/app/${realmAppId}/graphql`;

module.exports = {
  getValidAccessToken,
  realmAvailable,
  graphqlUrl
};
