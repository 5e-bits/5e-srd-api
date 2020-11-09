const mongoose = require('mongoose');
const { promisify } = require('util');
const { mongodbUri, redisClient } = require('./util');
// const { apolloClient } = require('./util');
const app = require('./server');
const createApolloMiddleware = require('./apollo/server');
const flushAsync = promisify(redisClient.flushall).bind(redisClient);

const start = async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connection ready');

  console.log('Flushing Redis');
  await flushAsync();

  console.log('Setting up Apollo GraphQL server');
  await createApolloMiddleware();

  console.log('Starting server...');
  const server = app.listen(process.env.PORT || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}! 🚀`);
  });
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
