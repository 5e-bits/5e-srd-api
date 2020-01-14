const mongoose = require('mongoose');
const { mongodbUri } = require('./util');
const app = require('./server');

// Connect to database and start the serverfuser
mongoose
  .connect(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(_database => {
    console.log('Database connection ready');

    const server = app.listen(process.env.PORT || 3000, () => {
      const port = server.address().port;
      console.log(`Listening on port ${port}!`);
    });
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
