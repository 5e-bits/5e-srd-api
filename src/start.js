const path = require('path');
const { root } = require('../../config/helpers');
const envfile = root('secret.env');
require('dotenv').config({ path: envfile });

const mongoose = require('mongoose');
// const { promisify } = require('util');
const { mongodbUri, redisClient, prewarmCache } = require('./util');
const createApp = require('./server');
// const flushAsync = promisify(redisClient.flushall).bind(redisClient);

const start = async () => {
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connection ready');

  // console.log('Flushing Redis');
  // await flushAsync();

  // console.log('Prewarm Redis');
  // await prewarmCache();

  console.log('Setting up Express server');
  const app = await createApp();

  console.log('Starting server...');
  const server = app.listen(process.env.PORT_API || 3000, () => {
    const port = server.address().port;
    console.log(`Listening on port ${port}! 🚀`);
  });
};

start().catch(err => {
  console.error(err);
  console.trace();
  process.exit(1);
});
