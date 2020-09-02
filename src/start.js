const mongoose = require('mongoose');
const { promisify } = require('util');
const { mongodbUri, redisClient } = require('./util');
const app = require('./server');
const flushAsync = promisify(redisClient.flushall).bind(redisClient);

// Connect to database and start the serverfuser
mongoose
  .connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(_database => {
    console.log('Database connection ready');
  })
  .then(() => {
    console.log('Flushing Redis');
    return flushAsync();
  })
  .then(() => {
    const server = app.listen(process.env.PORT || 3000, () => {
      const port = server.address().port;
      console.log(`Listening on port ${port}!`);
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
