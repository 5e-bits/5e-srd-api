import mongoose from 'mongoose';
import { promisify } from 'util';
import { mongodbUri, redisClient, prewarmCache } from './util/index';
import createApp from './server';
const flushAsync = promisify(redisClient.flushall).bind(redisClient);

const start = async () => {
  mongoose.set('useNewUrlParser', true);
  mongoose.set('useFindAndModify', false);
  mongoose.set('useCreateIndex', true);
  await mongoose.connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Database connection ready');

  console.log('Flushing Redis');
  await flushAsync();

  console.log('Prewarm Redis');
  await prewarmCache();

  console.log('Setting up Express server');
  const app = await createApp();

  console.log('Starting server...');
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Listening on port ${port}! 🚀`);
  });
};

start().catch(err => {
  console.error(err);
  process.exit(1);
});
