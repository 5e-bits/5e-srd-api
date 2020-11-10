const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { graphqlUrl, getValidAccessToken } = require('../util/RealmClient');

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  async willSendRequest({ request, _context }) {
    const accessToken = await getValidAccessToken();
    request.http.headers.set('Authorization', `Bearer ${accessToken}`);
  }
}

const createGateway = async () => {
  const gatewayConfig = {
    serviceList: [{ name: 'main', url: graphqlUrl }],
    buildService({ _name, url }) {
      return new AuthenticatedDataSource({ url });
    }
  };

  const gateway = new ApolloGateway(gatewayConfig);
  await gateway.load();

  return gateway;
};

module.exports = createGateway;
