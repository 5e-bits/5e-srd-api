const mongoose = require('mongoose');
const { mongodbUri, redisClient, prewarmCache } = require('./util');
const createApp = require('./server');

const start = async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connection ready');

  redisClient.on('error', err => console.log('Redis Client Error', err));

  await redisClient.connect();
  console.log('Redis connection ready');

  console.log('Flushing Redis');
  await redisClient.flushAll();

  console.log('Prewarm Redis');
  await prewarmCache();

  console.log('Setting up Express server');
  const app = await createApp();

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
