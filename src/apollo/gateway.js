const { ApolloGateway, RemoteGraphQLDataSource } = require('@apollo/gateway');
const { graphqlUrl, getValidAccessToken } = require('../util/RealmClient');

const createGateway = async () => {
  const gatewayConfig = {
    serviceList: [{ name: 'main', url: graphqlUrl }],
    async buildService({ _name, url }) {
      const accessToken = await getValidAccessToken();
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, _context }) {
          request.http.headers.set('Authorization', `Bearer ${accessToken}`);
        }
      });
    }
  };

  const gateway = new ApolloGateway(gatewayConfig);
  await gateway.load();

  return gateway;
};

module.exports = createGateway;
